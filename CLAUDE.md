# CLAUDE.md: QuoteCheck AI (repo: mechanic-chatbox)

Context for Claude Code sessions in this repo.

## What this is

A portfolio app that analyzes auto repair quotes. The user pastes a quote; the backend asks Claude to parse it, research typical local prices with web search, and return a structured verdict (range, LOW/MEDIUM/HIGH risk, reasons, recommendations). The frontend renders it as a result card in a themed chat UI.

## Architecture

```
frontend/  Next.js Pages Router, static export (out/), port 3001 in dev
backend/   Express 4 API, port 3000 in dev ($PORT on Render)
```

The frontend calls `${NEXT_PUBLIC_API_BASE_URL}/api/analyzeQuote`. There is no database and no auth.

## Backend

- `app.js`: entry point. Validates env (`ANTHROPIC_API_KEY`, `ALLOWED_ORIGINS`), then `createApp(...).listen`.
- `createApp.js`: helmet → morgan → origin allow-list (403) → cors → json(10kb) → rate limit (/api) → routes → 404 → error handler (keeps 4xx from body-parser).
- `features/analyzeQuote/`: controller (validation, sanitization) → service (error boundary, generic message) → `quoteParser.js` (orchestration + `normalizeAnalysis`), plus `quoteExtractors.js`, `prompts.js`, `schema.js`.
- `lib/claudeClient.js`: the only place that talks to the Anthropic SDK. `callStructured({ system, user, tool, webSearch })` returns the forced tool's input, or null.
- The model is `claude-sonnet-5` by default; override it with `ANTHROPIC_MODEL`.
- Tests: `backend/test/*.test.js` (Vitest + Supertest). The SDK and the parser are mocked; the tests never hit the network. In `beforeEach`, use a block body (`() => { mock.mockReset(); }`): a returned function is run as a teardown.

## Frontend

- `pages/index.tsx` re-exports `components/ChatPage.tsx`.
- `components/chat/ChatPanel.tsx` holds the chat state and input; `QuoteResultCard.tsx` renders an analysis; `ChatBubble.tsx` is the bubble shell.
- `components/decor/*` are purely decorative SVGs (moved verbatim; don't restyle them casually). `MonumentIllustrations` is hidden below `xl`.
- `lib/api.ts` (fetch plus user-facing error mapping), `lib/formatQuote.ts` (money, range bar math), `lib/quoteTypes.ts` (mirrors the backend `normalizeAnalysis` output; keep them in sync).
- Styling: Tailwind v4 with palette tokens in `styles/globals.css` (`lapis`, `firoza`, `saffron`, `parchment`, `ink`). No `tailwind.config.js`. Don't put `m-0` on children of `space-y-*` containers; it cancels the spacing.

## Commands

```bash
cd backend && npm run dev | npm test
cd frontend && npm run dev | npm test | npm run lint | npm run typecheck | npm run build
```

## Environment

| Var | Where | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | backend | Required. `backend/.env` locally, Render env in production. Never in the frontend. |
| `ANTHROPIC_MODEL` | backend | Optional. |
| `ALLOWED_ORIGINS` | backend | Required. Comma-separated, never `*`. |
| `PORT` | backend | 3000 locally; injected by Render. |
| `NEXT_PUBLIC_API_BASE_URL` | frontend | Baked in at build time. |

## What not to do

- Don't add a database, auth, `pg` or `jsonwebtoken`.
- Don't call the Anthropic SDK outside `lib/claudeClient.js`.
- Don't put secrets in `NEXT_PUBLIC_*` variables or commit `.env` files (`frontend/.env.example` is committed on purpose).
- Don't loosen CORS (`*` or an empty allow-list) or remove `trust proxy`.
- Don't change the `QuoteAnalysis` shape on one side without the other (backend `normalizeAnalysis` ↔ frontend `lib/quoteTypes.ts`).
