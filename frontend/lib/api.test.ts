import { describe, it, expect, vi } from 'vitest'
import { analyzeQuote, wakeBackend } from './api'
import type { QuoteAnalysis } from './quoteTypes'

const analysis: QuoteAnalysis = {
  parsedQuote: {
    vehicle: { make: 'Honda', model: 'Civic', year: '2019' },
    damages: ['bumper crack'],
    location: { city: 'San Diego', stateOrRegion: 'CA' },
    services: ['repaint'],
    quoteTotal: 1800,
    currency: 'USD',
    quoteRangeMin: 900,
    quoteRangeMax: 1600,
    shopName: null,
    notesFromUser: null,
  },
  riskLevel: 'MEDIUM',
  reasons: [],
  recommendations: [],
}

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
const mockFetch = (impl: () => Promise<Response>) => vi.fn(impl) as unknown as typeof fetch

describe('analyzeQuote', () => {
  it('returns the parsed analysis on success', async () => {
    const fetchImpl = mockFetch(async () => jsonResponse(200, { success: true, parsed: analysis }))
    await expect(analyzeQuote('2019 Civic bumper $1800', fetchImpl)).resolves.toEqual(analysis)
    expect(fetchImpl).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/analyzeQuote$/),
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ userText: '2019 Civic bumper $1800' }) }),
    )
  })

  it('surfaces the server message for rate limiting', async () => {
    const fetchImpl = mockFetch(async () => jsonResponse(429, { error: 'Too many requests. Please wait and try again.' }))
    await expect(analyzeQuote('x'.repeat(20), fetchImpl)).rejects.toThrow('Too many requests. Please wait and try again.')
  })

  it('surfaces the server message for a failed analysis', async () => {
    const fetchImpl = mockFetch(async () => jsonResponse(502, { success: false, error: "We couldn't analyze that quote right now." }))
    await expect(analyzeQuote('x'.repeat(20), fetchImpl)).rejects.toThrow("We couldn't analyze that quote right now.")
  })

  it('uses a generic message when the error body is not JSON (e.g. a proxy HTML page)', async () => {
    const fetchImpl = mockFetch(async () => new Response('<html>502 Bad Gateway</html>', { status: 502 }))
    const error = await analyzeQuote('x'.repeat(20), fetchImpl).catch((e: Error) => e)
    expect(error).toBeInstanceOf(Error)
    expect((error as Error).message).not.toContain('<html>')
    expect((error as Error).message).toMatch(/couldn't analyze/i)
  })

  it('explains network failures such as a sleeping backend', async () => {
    const fetchImpl = mockFetch(async () => { throw new TypeError('Failed to fetch') })
    await expect(analyzeQuote('x'.repeat(20), fetchImpl)).rejects.toThrow(/Couldn't reach the server/)
  })

  it('does not double the slash when the base URL ends with one', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'https://api.example.com/')
    const fetchImpl = mockFetch(async () => jsonResponse(200, { success: true, parsed: analysis }))
    await analyzeQuote('2019 Civic bumper $1800', fetchImpl)
    expect(fetchImpl).toHaveBeenCalledWith('https://api.example.com/api/analyzeQuote', expect.anything())
    vi.unstubAllEnvs()
  })
})

describe('wakeBackend', () => {
  it('pings /health and swallows failures', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'https://api.example.com')
    const fetchImpl = mockFetch(async () => { throw new Error('offline') })
    expect(() => wakeBackend(fetchImpl)).not.toThrow()
    expect(fetchImpl).toHaveBeenCalledWith('https://api.example.com/health')
    vi.unstubAllEnvs()
  })
})
