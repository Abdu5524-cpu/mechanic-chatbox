# CLAUDE.md — Mechanic Chatbox

This file gives Claude Code context about the project so it can assist effectively without re-exploring the codebase from scratch each session.

---

## What This Project Is

A vehicle repair quote analysis tool. Users paste or describe a mechanic quote (vehicle, damage, location, price), and the app returns a structured breakdown: parsed vehicle/damage info, typical price range, risk level (LOW/MEDIUM/HIGH), and recommendations.

Built as a portfolio project. The live UI is a themed chat interface at the frontend root.

---

## Architecture

Two services, both deployed on Render (see `render.yaml`):

```
frontend/   → Next.js 15 static export (port 3001 in dev)
backend/    → Express 4 API server (port 3000 in dev, $PORT in prod)
```

The frontend calls the backend via `NEXT_PUBLIC_API_BASE_URL`. There is no database.

---

## Backend

### Request flow
```
POST /api/analyzeQuote
  → backend/intentrouter.js
  → features/analyzeQuote/analyzeQuoteController.js  (validation, guardrails, daily cap)
  → features/analyzeQuote/analyzeQuoteService.js
  → features/analyzeQuote/quoteParser.js             (prompt, JSON schema, total cross-check)
  → lib/claude.js                                    (Anthropic SDK call, error mapping)

GET /health → inline in app.js
```

### Key design decisions
- `lib/claude.js` is the only file that talks to the Claude API. It reads `ANTHROPIC_API_KEY` from the environment, uses structured outputs (`output_config.format` with a JSON schema), effort `low`, server-side refusal fallbacks, a 45 s timeout and `max_tokens: 8000`.
- `ModelError` carries a user-safe message and HTTP status; the controller returns it as `{ success: false, error }`.
- `quoteParser` sets `originalText`, `currency` and `userLocationHint` itself. `quoteTotal` comes from the regex when it finds one; otherwise Claude's value is kept only if that number appears in the text.
- `app.set("trust proxy", 1)` is required on Render so rate limiting sees visitor IPs.

### Environment variables (backend)
| Variable | Required | Notes |
|----------|----------|-------|
| `ANTHROPIC_API_KEY` | Yes | Validated at startup. Server only. |
| `ALLOWED_ORIGINS` | Yes | Comma-separated CORS origins. Fails closed. |
| `DAILY_REQUEST_CAP` | No | Default 200 analyses per UTC day. |
| `ANTHROPIC_MODEL` | No | Default `claude-opus-5-5`. |
| `PORT` | Injected by Render | `3000` locally. |

---

## Frontend

- `pages/index.tsx`: page and result list. `components/Composer.tsx`: textarea (Enter = newline, Ctrl/Cmd+Enter = submit). `components/AnalysisCard.tsx`, `RangeBar.tsx`, `RiskBadge.tsx`: result display. `lib/api.ts`: API client and `wakeBackend()`.
- One theme. Colors are CSS variables in `styles/globals.css`, switched by `prefers-color-scheme`. There is no theme picker; do not add one.
- `next.config.mjs` uses `output: "export"`. Do not add API routes or server-side code to the frontend; Claude calls belong in the backend.

---

## What not to do

- Do not put the Claude API key, or any Claude call, in the frontend. No `NEXT_PUBLIC_` secrets.
- Do not commit `.env` files. Only `.env.example` is tracked.
- Do not add a database, auth, or a general-purpose chat endpoint that relays arbitrary messages to Claude.
- Do not set `ALLOWED_ORIGINS` to `*`.
