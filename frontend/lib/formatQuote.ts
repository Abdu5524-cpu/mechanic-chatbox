export function formatMoney(amount: number, currency = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${Math.round(amount)} ${currency}` // Intl throws RangeError on unknown currency codes
  }
}

export type RangeComparison = {
  verdict: 'below' | 'within' | 'above'
  percent: number // marker position on the track, 0-100
  bandStart: number // typical-range band start on the track, 0-100
  bandEnd: number
}

// The track extends past the typical range on both sides so the marker has room to land outside it.
export function compareToRange(total: number | null, min: number | null, max: number | null): RangeComparison | null {
  if (total === null || min === null || max === null) return null

  const pad = Math.max((max - min) * 0.25, max * 0.1, 1)
  const lo = min - pad
  const span = max + pad - lo
  const toPercent = (value: number) => Math.min(100, Math.max(0, ((value - lo) / span) * 100))

  return {
    verdict: total < min ? 'below' : total > max ? 'above' : 'within',
    percent: toPercent(total),
    bandStart: toPercent(min),
    bandEnd: toPercent(max),
  }
}
