# Mechanic Chatbox

**AI-powered auto repair quote analyzer.** Paste or describe a mechanic's estimate — vehicle, damage, location, price — and get back a structured breakdown: parsed quote data, a typical price range for that repair, a risk assessment (LOW / MEDIUM / HIGH), and actionable recommendations.

**Live:** https://mechanic-frontend.onrender.com

---

## What It Does

Most people have no reference point when they receive a repair quote. This tool closes that gap:

1. You describe the job in plain language or paste a quote verbatim
2. The backend parses it into structured data using GPT-4.1 via the OpenAI Responses API
3. It estimates what that repair typically costs in your region using a second pass with live web search
4. It assesses the risk level of the quote and returns specific reasons and recommendations

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 18, Tailwind CSS v4, Framer Motion |
| Backend | Node.js, Express 4, OpenAI SDK v5 |
| AI | GPT-4.1 (Responses API) for structured parsing, GPT-4o (Chat Completions) for conversation |
| Hosting | Render (backend Web Service + frontend Static Site) |

---

## Architecture

```
frontend/          Next.js app — chat UI, theme switcher, quote formatting
backend/
  app.js           Express server — helmet, CORS, rate limiting, startup validation
  intentrouter.js  Route definitions
  controllers/     chat.js — GPT-4o chat completions endpoint
  features/
    analyzeQuote/  Controller → Service → Parser pipeline
  lib/
    callWrapper.js OpenAI Responses API wrapper with 30s timeout
```

**Request pipeline for `/api/analyzeQuote`:**
```
User input
  → Input guardrails (length cap, sanitization)
  → quoteParser → GPT-4.1 structured JSON output
  → estimateQuoteRange → GPT-4.1 with web search (if range not returned)
  → Formatted response to frontend
```

---

## Security

- **CORS** fails closed — no allowed origins configured means all cross-origin requests are denied
- **Rate limiting** — 20 requests per 15 minutes per IP
- **Input guardrails** — 4,000 char max, 10 char min, control character stripping
- **Startup validation** — server refuses to start if required env vars are absent
- **Security headers** — `helmet` sets CSP, HSTS, X-Frame-Options, and more
- **Request size limit** — `express.json({ limit: "10kb" })`
- **30-second timeout** on all OpenAI calls via `AbortController`

---

## Local Development

### Prerequisites
- Node.js 18+
- An OpenAI API key with access to GPT-4.1 and GPT-4o

### 1. Clone and install

```bash
git clone https://github.com/your-username/resume-project.git
cd resume-project

cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure the backend

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```
OPENAI_API_KEY=sk-...
ALLOWED_ORIGINS=http://localhost:3001
PORT=3000
```

`OPENAI_API_KEY` and `ALLOWED_ORIGINS` are required — the server will not start without them. `PORT=3000` keeps the backend off the same port as the frontend (`3001`). On Render, `PORT` is injected automatically and overrides this.

### 3. Configure the frontend

```bash
cp frontend/.env.example frontend/.env
```

`frontend/.env` already contains `NEXT_PUBLIC_API_BASE_URL=http://localhost:3000` which points to the backend.

### 4. Run

```bash
# Terminal 1 — backend
cd backend && npm start

# Terminal 2 — frontend
cd frontend && npm run dev
```

Open **http://localhost:3001**

---

## API Reference

### `POST /api/analyzeQuote`

Parses a free-text repair description into structured data and returns a risk analysis.

**Request**
```json
{ "userText": "2019 Honda Civic, front bumper crack and paint, San Diego CA. Shop quoted $1,800." }
```

**Constraints:** `userText` must be a non-empty string between 10 and 4,000 characters.

**Response**
```json
{
  "success": true,
  "parsed": {
    "parsedQuote": {
      "vehicle": { "make": "Honda", "model": "Civic", "year": "2019" },
      "damages": ["front bumper crack", "paint damage"],
      "location": { "city": "San Diego", "stateOrRegion": "CA" },
      "services": ["bumper replacement", "paint repair"],
      "quoteTotal": 1800,
      "quoteRangeMin": 900,
      "quoteRangeMax": 1600,
      "currency": "USD",
      "shopName": null
    },
    "riskLevel": "MEDIUM",
    "reasons": ["Quote is above typical range for this repair in this region."],
    "recommendations": ["Get a second quote from another shop.", "Ask for a line-item breakdown."]
  }
}
```

**Error responses**

| Status | Meaning |
|--------|---------|
| 400 | `userText` missing, too short, or too long |
| 429 | Rate limit exceeded |
| 502 | Upstream parsing failed |
| 500 | Unexpected server error |

---

### `POST /api/chat`

General-purpose chat endpoint backed by GPT-4o. Accepts a message history or a raw form payload.

**Request**
```json
{ "messages": [{ "role": "user", "content": "What's a fair price for a rear bumper respray?" }] }
```

**Response**
```json
{ "reply": "A rear bumper respray typically ranges from..." }
```

---

### `GET /health`

Returns `{ "status": "ok" }`. Used by Render's health check system.

---

## Deployment (Render)

**Backend — Web Service**

| Setting | Value |
|---------|-------|
| Build command | `npm install` |
| Start command | `node app.js` |
| Health check path | `/health` |
| `OPENAI_API_KEY` | Your OpenAI key |
| `ALLOWED_ORIGINS` | Your frontend Render URL |

**Frontend — Static Site**

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| `NEXT_PUBLIC_API_BASE_URL` | Your backend Render URL |

---

## Troubleshooting

**CORS errors in the browser**
Confirm `ALLOWED_ORIGINS` on the backend includes the exact frontend origin (protocol + domain, no trailing slash).

**Backend won't start**
The server validates `OPENAI_API_KEY` and `ALLOWED_ORIGINS` at boot. Check the startup log — it will print the exact missing variable.

**429 Too Many Requests**
You've hit the rate limit (20 requests / 15 minutes). Wait and try again.

**Slow responses**
The quote analysis pipeline makes two sequential LLM calls. Response time is typically 5–15 seconds depending on OpenAI load.

---

## License

See [LICENSE](LICENSE).
