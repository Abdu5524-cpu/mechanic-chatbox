import { describe, it, expect } from 'vitest'
import { compareToRange, formatMoney } from './formatQuote'

describe('formatMoney', () => {
  it('formats USD without cents', () => {
    expect(formatMoney(1800, 'USD')).toBe('$1,800')
  })

  it('formats other currencies', () => {
    expect(formatMoney(500, 'EUR')).toBe('€500')
  })

  it('does not throw on an invalid currency code', () => {
    expect(formatMoney(500, 'dollars')).toBe('500 dollars')
  })
})

describe('compareToRange', () => {
  it('places a total inside the range', () => {
    const r = compareToRange(1000, 900, 1600)!
    expect(r.verdict).toBe('within')
    expect(r.percent).toBeCloseTo(26.19, 1)
    expect(r.bandStart).toBeCloseTo(16.67, 1)
    expect(r.bandEnd).toBeCloseTo(83.33, 1)
  })

  it('flags and clamps totals above the range', () => {
    const r = compareToRange(1800, 900, 1600)!
    expect(r.verdict).toBe('above')
    expect(r.percent).toBe(100)
  })

  it('flags totals below the range', () => {
    expect(compareToRange(500, 900, 1600)!.verdict).toBe('below')
  })

  it('handles a zero-width range', () => {
    const r = compareToRange(1000, 1000, 1000)!
    expect(r.verdict).toBe('within')
    expect(r.percent).toBeCloseTo(50, 5)
  })

  it('returns null when any value is missing', () => {
    expect(compareToRange(null, 900, 1600)).toBeNull()
    expect(compareToRange(1000, null, 1600)).toBeNull()
  })
})
