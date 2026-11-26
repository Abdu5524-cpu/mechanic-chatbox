import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import intentrouter from "./intentrouter.js";

// Browsers send Origin without a trailing slash; tolerate one in the configured list.
const normalizeOrigin = o => o.trim().replace(/\/+$/, "");

export function createApp({ allowedOrigins, rateLimitMax = 20, logRequests = true }) {
  const allowed = new Set(allowedOrigins.map(normalizeOrigin));
  const app = express();

  // Render sits one proxy hop in front of us; without this every client shares the proxy's IP.
  app.set("trust proxy", 1);

  app.use(helmet());
  if (logRequests) app.use(morgan("combined"));

  // Fail closed: reject browser requests from unknown origins before any work (or LLM spend) happens.
  // Requests without an Origin header (curl, Render health checks) are allowed.
  app.use((req, res, next) => {
    const origin = req.get("Origin");
    if (origin && !allowed.has(origin)) {
      return res.status(403).json({ error: "Origin not allowed" });
    }
    next();
  });
  app.use(cors({ origin: [...allowed] }));

  // 4000 characters of CJK text is ~12 KB of UTF-8 JSON; the controller enforces the character limit.
  app.use(express.json({ limit: "32kb" }));
  app.use(
    "/api",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: rateLimitMax,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: "Too many requests. Please wait and try again." },
    })
  );

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api", intentrouter);

  app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  // Body-parser errors (malformed JSON, payload too large) carry a 4xx status; keep it.
  app.use((err, req, res, next) => {
    const status = Number.isInteger(err.status) && err.status < 500 ? err.status : 500;
    if (status === 500) console.error("Unhandled error:", err);
    const error = status === 500 ? "Internal Server Error" : status === 413 ? "Quote is too long." : "Bad request";
    res.status(status).json({ error });
  });

  return app;
}
