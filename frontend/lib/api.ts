import type { QuoteAnalysis } from './quoteTypes'

const GENERIC_ERROR = "We couldn't analyze that quote right now. Please try again in a moment."
const NETWORK_ERROR = "Couldn't reach the server. It may be waking up; try again in about 30 seconds."

type AnalyzeResponse = { success?: boolean; parsed?: QuoteAnalysis; error?: string }

// Tolerate a trailing slash in the configured URL so we never request `//api/...`.
export const apiBase = () => (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '')

// Free-tier hosts sleep when idle. Pinging /health when the page loads starts the wake-up
// while the visitor is still reading, so their first analysis isn't the one that waits.
export function wakeBackend(fetchImpl: typeof fetch = fetch): void {
  fetchImpl(`${apiBase()}/health`).catch(() => {})
}

export async function analyzeQuote(userText: string, fetchImpl: typeof fetch = fetch): Promise<QuoteAnalysis> {

  let res: Response
  try {
    res = await fetchImpl(`${apiBase()}/api/analyzeQuote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userText }),
    })
  } catch {
    throw new Error(NETWORK_ERROR)
  }

  // Error pages from proxies are HTML, not JSON; never show those to the user.
  const body: AnalyzeResponse = (await res.json().catch(() => null)) ?? {}

  if (!res.ok || body.success === false || !body.parsed) {
    throw new Error(typeof body.error === 'string' && body.error ? body.error : GENERIC_ERROR)
  }
  return body.parsed
}
