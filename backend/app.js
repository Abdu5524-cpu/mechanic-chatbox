import "dotenv/config";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";
import intentrouter from "./intentrouter.js";

console.log("CWD:", process.cwd());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("__dirname:", __dirname);




// Initialize Express app
const app = express();



// CORS configuration
// Allow requests from specific origins
const allowed = new Set(
  (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean)
);

const corsMiddleware = cors({
  origin(origin, cb) {
    // allow non-browser/SSR/cURL (no Origin) and allow-all when list is empty
    if (!origin || allowed.size === 0 || allowed.has(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
});

app.use(morgan("dev"));
app.use(corsMiddleware);
app.use(express.json());



app.use("/api", intentrouter);
// Backwards-compat for older frontend fetch paths.
app.use("/controllers", intentrouter);


// Any cases that fall through

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(process.env.BACKEND_PORT || 3000, () =>
  console.log(`Server running on port ${process.env.BACKEND_PORT || 3002}`)
);
