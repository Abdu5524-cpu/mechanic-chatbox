# Auto Quote Analyzer

**Is this repair quote fair?** Paste a mechanic's estimate for a car or motorcycle and get back the typical price for that work in your area, a risk read on the quote (LOW / MEDIUM / HIGH), and specific next steps.

**Live:** https://mechanic-frontend.onrender.com

---

## How it works

1. You paste a quote or describe the job in plain language.
2. The backend sends it to Claude with a strict JSON schema (structured outputs), so the answer always has the same shape.
3. Claude extracts the vehicle, damage, work and location, estimates a typical price range, and rates the quote.
4. The backend cross-checks the quoted total against the text, then the frontend draws the quote against the typical range.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (static export), React 18, Tailwind CSS v4 |
| Backend | Node.js, Express 4, Anthropic TypeScript SDK |
| AI | Claude (`claude-opus-5-5` by default) with structured outputs |
| Hosting | Render (backend Web Service, frontend Static Site) |

## Architecture

```
frontend/                 Static Next.js site (no secrets, no server code)
  pages/index.tsx         Page: composer, results
  components/             Composer, AnalysisCard, RangeBar, RiskBadge
  lib/api.ts              Calls POST /api/analyzeQuote on the backend
backend/
  app.js                  Express: helmet, CORS, rate limits, error handling
  intentrouter.js         Routes
  features/analyzeQuote/  Controller → Service → Parser
  lib/claude.js           The only place the Claude API is called
  lib/dailyCap.js         Site-wide daily request cap
```

## Security

The Claude API key exists only as an environment variable on the backend server.

- **Never in the browser:** the frontend is static HTML/JS and only knows the backend URL.
- **Never in git:** `.env` files are gitignored in both apps; only `.env.example` placeholders are committed.
- **CORS** fails closed: browsers can only call the API from origins in `ALLOWED_ORIGINS`.
- **Rate limits:** 20 requests per 15 minutes per visitor, plus a site-wide daily cap (`DAILY_REQUEST_CAP`, default 200).
- **Input guardrails:** 10 to 4,000 characters, control characters stripped, 10 KB body limit.
- **Bounded cost:** `max_tokens` caps each response; the API call times out after 45 seconds.
- **Prompt injection:** quote text is wrapped and treated as data; output is constrained to a JSON schema.

Also set a monthly spend limit on your key in the Claude Console.

## Local development

Requires Node.js 18+ and a Claude API key from the [Claude Console](https://console.anthropic.com).

```bash
cd backend && npm install && cp .env.example .env    # then put your key in backend/.env
cd ../frontend && npm install && cp .env.example .env
```

```bash
# Terminal 1
cd backend && npm start          # http://localhost:3000

# Terminal 2
cd frontend && npm run dev       # http://localhost:3001
```

### Environment variables

| Where | Variable | Required | Notes |
|-------|----------|----------|-------|
| backend | `ANTHROPIC_API_KEY` | Yes | Server only. Never commit it. |
| backend | `ALLOWED_ORIGINS` | Yes | Comma separated frontend origins, no trailing slash. |
| backend | `DAILY_REQUEST_CAP` | No | Analyses per UTC day across all visitors. Default 200. |
| backend | `ANTHROPIC_MODEL` | No | Default `claude-opus-5-5`. |
| frontend | `NEXT_PUBLIC_API_BASE_URL` | Yes in prod | The backend URL. Public by design; not a secret. |

## API

### `POST /api/analyzeQuote`

```json
{ "userText": "2019 Honda Civic, front bumper crack and paint, San Diego CA. Shop quoted $1,800." }
```

Response:

```json
{
  "success": true,
  "parsed": {
    "parsedQuote": {
      "vehicle": { "make": "Honda", "model": "Civic", "year": "2019" },
      "damages": ["front bumper crack", "paint damage"],
      "location": { "city": "San Diego", "stateOrRegion": "CA", "userLocationHint": null },
      "services": ["bumper repair", "refinish"],
      "quoteTotal": 1800,
      "quoteRangeMin": 900,
      "quoteRangeMax": 1600,
      "currency": "USD",
      "shopName": null,
      "notesFromUser": null,
      "originalText": "2019 Honda Civic, ..."
    },
    "riskLevel": "MEDIUM",
    "reasons": ["The quote is above the typical range for this repair in this region."],
    "recommendations": ["Ask whether the bumper can be repaired instead of replaced."]
  }
}
```

Errors return `{ "success": false, "error": "<message safe to show users>" }` with status 400 (bad input), 422 (request declined), 429 (rate limit or daily cap), 502/503/504 (upstream problem) or 500.

### `GET /health`

Returns `{ "status": "ok" }`. The frontend pings it on page load to wake a sleeping free-tier instance.

## Deployment (Render)

`render.yaml` describes both services, so you can create them with **New → Blueprint**. Or configure them by hand:

**Backend (Web Service):** root `backend`, build `npm ci`, start `node app.js`, health check `/health`, env vars `ANTHROPIC_API_KEY` and `ALLOWED_ORIGINS`.

**Frontend (Static Site):** root `frontend`, build `npm ci && npm run build`, publish directory `out`, env var `NEXT_PUBLIC_API_BASE_URL`.

The free backend sleeps after inactivity, so the first request after a while can take up to a minute.

## License

See [LICENSE](LICENSE).
