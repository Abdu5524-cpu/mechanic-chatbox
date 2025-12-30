console.log("CWD:", process.cwd());
console.log("__dirname:", __dirname);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const intentrouter = require('./routes/intentrouter');




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

app.use(morgan('dev'));
app.use(corsMiddleware);
app.use(express.json());



app.use('/intentrouter', intentrouter);


// Any cases that fall through

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(process.env.BACKEND_PORT || 3002, () =>
  console.log(`Server running on port ${process.env.BACKEND_PORT || 3002}`)
);