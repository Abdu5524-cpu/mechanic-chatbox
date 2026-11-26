# CLAUDE.md: QuoteCheck AI (repo: mechanic-chatbox)

Context for Claude Code sessions in this repo.

## Where we left off (updated 2026-09-28)

**Goal:** make this presentable as a resume project, and switch the backend from OpenAI to Claude.

**State:**
- Work is on branch `health-and-claude`: 16 commits on top of `main` (`ea42d50`). It is **not pushed** and has **no PR** yet.
- The plan is `docs/superpowers/plans/2026-09-25-cleanup-and-claude-migration.md`. Tasks 1–13 are done; Task 14 (deploy) is not.
- The execution ledger is `.superpowers/sdd/2026-09-25-cleanup-and-claude-migration/progress.md` (gitignored). It records every ruling made and every deferred Minor finding.
- A fresh whole-branch review found no Critical issues. Its two Important findings are fixed, with tests (`fe0f814`, `b403166`).
- Tests: backend 62/62. Frontend: 13 tests, plus lint, typecheck and build, all green.

**Not yet verified with a real API key.** Everything model-facing was tested with mocks, an invalid key, or a stub backend:
- `backend/.env` still has `OPENAI_API_KEY`. The user must replace it with `ANTHROPIC_API_KEY=sk-ant-...`. Never read or print `.env` values; checking the variable names is fine.
- Once the key is in, run one real quote per example prompt. Check that the first pass returns `stop_reason: "tool_use"`, that `[quoteParser] web-search pass failed` and `[claudeClient] ... not called` don't appear in the log, and that it finishes in about 30s. If web search fails, enable it for the org in the Anthropic Console.
- `docs/screenshot.png` was captured against a stub backend with sample data. Re-capture it from a real result.

**Next steps (Task 14). These act outside the repo, so ask the user before each one:**
1. Push `health-and-claude`, open a PR to `main`, and wait for CI (`.github/workflows/ci.yml`) to pass, then merge.
2. Render backend: add `ANTHROPIC_API_KEY`, delete `OPENAI_API_KEY`, and set `ALLOWED_ORIGINS=https://mechanic-frontend.onrender.com` with no trailing slash.
3. Render frontend: it must be a **Static Site** (build `npm ci && npm run build`, publish `out`, root `frontend`). `next.config.js` uses `output: "export"`, so `next start` no longer works. If it is currently a Web Service, create a Static Site instead. `NEXT_PUBLIC_API_BASE_URL` is baked in at build time.
4. After deploying, compare the backend's logged `req.ip` with your own IP. If they differ, `trust proxy` = 1 is wrong for Render, and all users share one rate limit.
5. Optional: add an uptime ping on `/health` every 10 min. Revoke the old OpenAI key.

**Known issues deferred (Minor). Pick from these after deploying:**
- README "Engineering decisions" is now out of date. It says the regex total overrides the model, but since `fe0f814` **the model's total wins** and the regex is only a fallback/hint. It also says "forced tool use", but the primary pass is `tool_choice: auto`. And "web search must be enabled" overstates it, because a fallback exists.
- `pause_turn` isn't handled: search results are discarded and the forced retry runs instead (`lib/claudeClient.js`).
- `web_search_20260209` is newer than the `web_search_20250305` tool version in use.
- Some models reject a forced `tool_choice`. Add a note next to `ANTHROPIC_MODEL` in `.env.example`.
- The `</quote>` strip in `prompts.js` is case-sensitive.
- The `10kb` body limit is smaller than 4000 CJK characters; the resulting 413 shows as "Bad request".
- A trailing `/` in `ALLOWED_ORIGINS` or `NEXT_PUBLIC_API_BASE_URL` isn't normalized.
- `crypto.randomUUID()` is outside the `try` in `ChatPanel.tsx`, so it throws when dev is opened over a plain-http LAN address.
- `key={reason}` in `QuoteResultCard` can collide when strings repeat.
- The character counter's `aria-live` is chatty, and the textarea loses focus after sending.
- The loading copy says "up to 30 seconds", but the worst case is longer.

**Decisions already made (don't re-litigate):**
- `/api/chat` was deleted, not fixed.
- Default model is `claude-sonnet-5`.
- The product name is "QuoteCheck AI"; the repo slug stays `mechanic-chatbox`.
- `frontend-v0/` was deleted; its contents are in commit `ea42d50`.

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
