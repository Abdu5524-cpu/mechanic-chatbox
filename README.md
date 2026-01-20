# Mechanic Chatbox

Mechanic Chatbox is a full-stack app that helps users paste or describe an auto repair quote and receive a structured analysis. The frontend is a Next.js UI with a chat-like experience, and the backend is an Express API that calls OpenAI for parsing and analysis.

Live app: https://mechanic-frontend.onrender.com

## Features
- Quote analysis endpoint that converts free text into a structured summary.
- Chat-style UI with multiple themes and formatted results.
- Optional database schema placeholder for future user accounts.

## Project Structure
- `backend/` Express API, OpenAI integration, quote parsing and analysis.
- `frontend/` Next.js app (pages router) with the chat UI.
- `database/` SQL schema for a basic `users` table (not wired in yet).

## Requirements
- Node.js 18+ (recommended)
- npm (or your preferred Node package manager)
- OpenAI API key
- (Optional) Postgres if you plan to use the schema in `database/schema.sql`

## Setup

### 1) Install dependencies
```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2) Backend environment variables
Create a `backend/.env` file:
```bash
OPENAI_API_KEY=your_openai_api_key
BACKEND_PORT=3000
ALLOWED_ORIGINS=http://localhost:3001
```

Notes:
- `OPENAI_API_KEY` is required. The API will fail without it.
- `BACKEND_PORT` defaults to `3000` if not set.
- `ALLOWED_ORIGINS` controls CORS. Use a comma-separated list if you have more than one origin.

### 3) Frontend environment variables
Create a `frontend/.env.local` file:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

Notes:
- The frontend uses `NEXT_PUBLIC_API_BASE_URL` to call the backend. If unset, it defaults to a relative URL.
- The default frontend dev port is `3001`, so the backend should allow `http://localhost:3001`.

## Running the Project (Development)

### Start the backend
```bash
cd backend
npm start
```
This starts the API on `http://localhost:3000` by default.

### Start the frontend
```bash
cd frontend
npm run dev
```
This starts the Next.js app on `http://localhost:3001`.

### View the app
Open `http://localhost:3001` in your browser.

## API Endpoints

### `POST /api/analyzeQuote`
Parses a user-provided quote or repair description into structured data and returns a summary.

Request body:
```json
{ "userText": "2018 Toyota Camry, rear bumper dent, Austin TX. Quote total $1,250." }
```

Response (example shape):
```json
{
  "success": true,
  "parsed": {
    "parsedQuote": { "...": "..." },
    "riskLevel": "MEDIUM",
    "reasons": ["..."],
    "recommendations": ["..."]
  }
}
```

### `POST /api/chat`
Simple chat endpoint backed by OpenAI chat completions. Accepts either `messages` or a `formData` payload.

Request body (example):
```json
{ "messages": [{ "role": "user", "content": "Hello" }] }
```

## Database
`database/schema.sql` contains a basic `users` table definition. It is not connected to the backend yet. If you plan to add auth or persistence, you can start here.

## Scripts

Backend (`backend/package.json`)
- `npm start` - start the Express server

Frontend (`frontend/package.json`)
- `npm run dev` - start Next.js dev server on port 3001
- `npm run build` - production build
- `npm start` - run the production build
- `npm run lint` - run ESLint

## Troubleshooting
- If you see CORS errors, ensure `ALLOWED_ORIGINS` includes your frontend URL.
- If the API responds with 500 errors, confirm `OPENAI_API_KEY` is set and valid.
- If the frontend fails to call the backend, ensure `NEXT_PUBLIC_API_BASE_URL` points to the correct backend URL.

## License
See `LICENSE`.
