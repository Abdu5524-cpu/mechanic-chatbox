import "dotenv/config";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import intentrouter from "./intentrouter.js";

// Fail fast: refuse to start if any required env var is missing.
const REQUIRED_ENV = ["OPENAI_API_KEY", "ALLOWED_ORIGINS"];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`[startup] Missing required env var: ${key}`);
    process.exit(1);
  }
}

const PORT = process.env.PORT || 3000;

const app = express();

// Security headers.
app.use(helmet());

// CORS — fail closed: if origin is not in the allow-list, deny.
const allowed = new Set(
  process.env.ALLOWED_ORIGINS
    .split(",")
    .map(s => s.trim())
    .filter(Boolean)
);

const corsMiddleware = cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true); // allow non-browser (SSR, curl, health checks)
    if (allowed.has(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
});

// Rate limiting: 20 requests per 15 minutes per IP across all /api routes.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please wait and try again." },
});

app.use(morgan("combined"));
app.use(corsMiddleware);
app.use(express.json({ limit: "10kb" }));
app.use("/api", limiter);

// Health check — no auth, no rate limiting, used by Render and uptime monitors.
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// API routes.
app.use("/api", intentrouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
