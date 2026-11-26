import "dotenv/config";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import intentrouter from "./intentrouter.js";

// Fail fast: refuse to start if any required env var is missing.
const REQUIRED_ENV = ["ANTHROPIC_API_KEY", "ALLOWED_ORIGINS"];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`[startup] Missing required env var: ${key}`);
    process.exit(1);
  }
}

const PORT = process.env.PORT || 3000;

const app = express();

// Render (and most hosts) sit behind one reverse proxy. Trust it so req.ip is the
// visitor's address; otherwise every visitor shares a single rate-limit bucket.
app.set("trust proxy", Number.parseInt(process.env.TRUST_PROXY_HOPS || "1", 10));

// Security headers.
app.use(helmet());

// CORS: fail closed. Only origins in ALLOWED_ORIGINS may call the API from a browser.
const allowed = new Set(
  process.env.ALLOWED_ORIGINS
    .split(",")
    .map(s => s.trim().replace(/\/$/, ""))
    .filter(Boolean)
);

app.use(cors({
  origin(origin, cb) {
    // No Origin header: non-browser clients (curl, health checks). Rate limits still apply.
    if (!origin) return cb(null, true);
    // Disallowed origins get no CORS headers, so the browser blocks the response.
    return cb(null, allowed.has(origin));
  },
}));

app.use(morgan(":method :url :status :response-time ms"));
app.use(express.json({ limit: "10kb" }));

// Per-visitor limit: 20 requests per 15 minutes on all /api routes.
app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, error: "Too many requests. Wait a few minutes and try again." },
}));

// Health check: no rate limiting. The frontend also pings it to wake a sleeping instance.
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", intentrouter);

app.use((req, res) => {
  res.status(404).json({ success: false, error: "Not Found" });
});

app.use((err, req, res, next) => {
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, error: "Invalid JSON body." });
  }
  if (err?.type === "entity.too.large") {
    return res.status(413).json({ success: false, error: "Request too large." });
  }
  console.error("Unhandled Error:", err);
  res.status(500).json({ success: false, error: "Something went wrong. Try again." });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
