# CLAUDE.md — Mechanic Chatbox

This file gives Claude Code context about the project so it can assist effectively without re-exploring the codebase from scratch each session.

---

## What This Project Is

A vehicle repair quote analysis tool. Users paste or describe a mechanic quote (vehicle, damage, location, price), and the app returns a structured breakdown: parsed vehicle/damage info, typical price range, risk level (LOW/MEDIUM/HIGH), and recommendations.

Built as a portfolio project. The live UI is a themed chat interface at the frontend root.

---

## Architecture

Two separate services, both deployed on Render:

```
frontend/   → Next.js 15 app (port 3001 in dev)
backend/    → Express 4 API server (port 3000 in dev, $PORT in prod)
```

They communicate over HTTP. The frontend calls the backend via `NEXT_PUBLIC_API_BASE_URL`.

There is **no database in use**. `database/schema.sql` is a leftover artifact from an earlier design; it is not connected to anything and should not be wired up.

---

## Backend

### Entry point
`backend/app.js` — sets up Express with helmet, CORS, rate limiting, morgan, and mounts the router.

### Request flow
```
POST /api/analyzeQuote
  → backend/intentrouter.js
  → backend/features/analyzeQuote/analyzeQuoteController.js  (input validation + guardrails)
  → backend/features/analyzeQuote/analyzeQuoteService.js     (orchestration)
  → backend/features/analyzeQuote/quoteParser.js             (main LLM parse call)
  → backend/lib/callWrapper.js                               (OpenAI Responses API wrapper)

POST /api/chat
  → backend/intentrouter.js
  → backend/controllers/chat.js                              (direct OpenAI Chat Completions call)

GET /health
  → inline in app.js, returns { status: "ok" }
```

### Key design decisions
- `quoteParser` makes **two** sequential LLM calls: one to parse the quote into JSON schema, and a second (`estimateQuoteRange`) to estimate a price range if the model didn't return one. This is intentional — the range estimate uses web search via the Responses API.
- `callWrapper` uses the **Responses API** (`openai.responses.create`), not Chat Completions. These are different APIs with different parameters.
- `chat.js` uses the **Chat Completions API** (`openai.chat.completions.create`). Do not mix these up.
- Input is sanitized and capped at 4000 chars / minimum 10 chars before reaching the LLM.

### Models in use
- `backend/lib/callWrapper.js` → `gpt-4.1` (Responses API)
- `backend/controllers/chat.js` → `gpt-4o` (Chat Completions API)

### Environment variables (backend)
| Variable | Required | Notes |
|----------|----------|-------|
| `OPENAI_API_KEY` | Yes | Validated at startup |
| `ALLOWED_ORIGINS` | Yes | Comma-separated list of allowed CORS origins. Validated at startup. Fails closed if missing. |
| `PORT` | Injected by Render | Never set manually in production. Set to `3000` in `.env` for local dev. Frontend runs on `3001`. |

See `backend/.env.example` for the template. Never commit `backend/.env`.

### Run locally
```bash
cd backend
npm install
# create backend/.env from backend/.env.example, fill in your key
node app.js
```

---

## Frontend

### Entry point
`frontend/pages/index.tsx` re-exports `frontend/44chat.tsx`. The main chat UI lives in `44chat.tsx`.

### Key components
| File | Role |
|------|------|
| `frontend/44chat.tsx` | Main chat page — theme switching, message state, calls `analyzeQuote` API |
| `frontend/components/chat/ChatBubble.tsx` | Individual message bubble |
| `frontend/components/chat/VehicleDecorations.tsx` | Decorative animated SVG elements |
| `frontend/components/ErrorBoundary.tsx` | Class component wrapping the entire app; shows fallback UI on crash |
| `frontend/components/QuoteForm.tsx` | Alternative chat-style quote form; not currently mounted anywhere |
| `frontend/pages/_app.tsx` | Wraps `<Component>` in `<ErrorBoundary>` |

### API call
Both `44chat.tsx` and `QuoteForm.tsx` call `POST /api/analyzeQuote` with `{ userText }` and format the response via `formatParsedQuote()`. If the API call fails, the error message is displayed inline in the chat as a bot message.

### Environment variables (frontend)
| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_API_BASE_URL` | Yes in prod | Set to the Render backend URL in production. In dev, set to `http://localhost:3000`. |

See `frontend/.env.example` for the template. `frontend/.env` is gitignored.

### Run locally
```bash
cd frontend
npm install
# create frontend/.env from frontend/.env.example
npm run dev     # runs on port 3001
```

---

## Security model

- **CORS**: fail-closed. Empty `ALLOWED_ORIGINS` → all cross-origin requests denied. Non-browser requests (no `Origin` header) are always allowed.
- **Rate limiting**: 20 requests per 15 minutes per IP on all `/api` routes. In-memory store — resets on restart, does not persist across multiple instances.
- **Input guardrails**: controller rejects input > 4000 chars, < 10 chars, and strips null bytes / control characters before passing to the LLM.
- **Startup validation**: app exits with code 1 if `OPENAI_API_KEY` or `ALLOWED_ORIGINS` is missing.
- **Request size**: `express.json({ limit: "10kb" })` — sized for quote text with headroom, not a DoS vector.
- **Security headers**: `helmet()` sets CSP, X-Frame-Options, HSTS, X-Content-Type-Options, etc.

---

## Production deployment (Render)

Both services deployed on Render.

**Backend (Web Service):**
- Build command: `npm install`
- Start command: `node app.js`
- Health check path: `/health`
- Env vars to set: `OPENAI_API_KEY`, `ALLOWED_ORIGINS` (set to the frontend Render URL)

**Frontend (Static Site or Web Service):**
- Build command: `npm run build`
- Publish directory (static): `out/` — requires `output: 'export'` in `next.config.js`
- Or deploy as Web Service with start command: `npm start`
- Env var to set: `NEXT_PUBLIC_API_BASE_URL` (set to the backend Render URL)

---

## What not to do

- Do not add database integration. The schema in `database/schema.sql` is a dead artifact.
- Do not add `JWT_SECRET` or auth middleware. There is no user system and none is planned.
- Do not re-add `pg` or `jsonwebtoken` to `backend/package.json`.
- Do not use `openai.responses.create` in `chat.js` or `openai.chat.completions.create` in `callWrapper.js` — they use different APIs intentionally.
- Do not set `ALLOWED_ORIGINS` to `*` or leave it empty. CORS is intentionally fail-closed.
- Do not commit `backend/.env` or `frontend/.env`. Both are gitignored.
