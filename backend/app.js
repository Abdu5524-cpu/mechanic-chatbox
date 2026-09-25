import "dotenv/config";
import { createApp } from "./createApp.js";

// Fail fast: refuse to start if any required env var is missing.
const REQUIRED_ENV = ["OPENAI_API_KEY", "ALLOWED_ORIGINS"];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`[startup] Missing required env var: ${key}`);
    process.exit(1);
  }
}

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",").map(s => s.trim()).filter(Boolean);
if (allowedOrigins.length === 0 || allowedOrigins.includes("*")) {
  console.error("[startup] ALLOWED_ORIGINS must list explicit origins (no '*').");
  process.exit(1);
}

const PORT = process.env.PORT || 3000;
createApp({ allowedOrigins }).listen(PORT, () => console.log(`Server running on port ${PORT}`));
