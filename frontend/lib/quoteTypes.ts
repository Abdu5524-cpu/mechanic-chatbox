export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'

// Mirrors normalizeAnalysis() in backend/features/analyzeQuote/quoteParser.js.
export type QuoteAnalysis = {
  parsedQuote: {
    vehicle: { make: string | null; model: string | null; year: string | null }
    damages: string[]
    location: { city: string | null; stateOrRegion: string | null }
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

export type ChatMessage = {
  id: string
  role: 'user' | 'bot'
  time: string
  text?: string
  analysis?: QuoteAnalysis
  isError?: boolean
}
