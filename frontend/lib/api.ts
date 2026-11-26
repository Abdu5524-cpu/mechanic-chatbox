export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'

export type Analysis = {
  parsedQuote: {
    originalText?: string
    vehicle: { make: string | null; model: string | null; year: string | null }
    damages: string[]
    location: { city: string | null; stateOrRegion: string | null; userLocationHint: string | null }
    services: string[]
    quoteTotal: number | null
    currency: string
    quoteRangeMin: number | null
    quoteRangeMax: number | null
    shopName: string | null
    notesFromUser: string | null
  }
  riskLevel: RiskLevel
  reasons: string[]
  recommendations: string[]
}

// Public backend URL. This is not a secret: the Claude key lives only on the backend.
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '')

export const MAX_INPUT = 4000
export const MIN_INPUT = 10

export class ApiError extends Error {}

export async function analyzeQuote(userText: string, signal?: AbortSignal): Promise<Analysis> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/analyzeQuote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userText }),
      signal,
    })
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') throw err
    throw new ApiError("Couldn't reach the analyzer. Check your connection and try again.")
  }

  let data: { success?: boolean; error?: string; parsed?: Analysis } | null = null
  try {
    data = await res.json()
  } catch {
    // Non-JSON body (e.g. a proxy error page); fall through to a generic message.
  }

  if (!res.ok || !data?.success || !data.parsed) {
    throw new ApiError(data?.error || `The analyzer returned an error (${res.status}). Try again.`)
  }
  return data.parsed
}

// Free hosting tiers sleep when idle. Ping the backend on page load so it is
// awake by the time someone submits a quote. Failures are ignored.
export function wakeBackend() {
  fetch(`${API_BASE}/health`, { method: 'GET' }).catch(() => {})
}
