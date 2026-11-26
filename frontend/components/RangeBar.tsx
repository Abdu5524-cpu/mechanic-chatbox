import { formatMoney } from '@/lib/format'

type Props = {
  min: number
  max: number
  quote: number | null
  currency: string
}

// A typical-price band with the quoted price marked against it.
export default function RangeBar({ min, max, quote, currency }: Props) {
  const lo = Math.min(min, quote ?? min) * 0.75
  const hi = Math.max(max, quote ?? max) * 1.15
  const span = hi - lo || 1
  const pct = (v: number) => `${((v - lo) / span) * 100}%`

  const position =
    quote === null ? null : quote < min ? 'below' : quote > max ? 'above' : 'within'

  const summary =
    quote === null
      ? `Typical price ${formatMoney(min, currency)} to ${formatMoney(max, currency)}.`
      : `Quoted ${formatMoney(quote, currency)}, ${position} the typical ${formatMoney(min, currency)} to ${formatMoney(max, currency)}.`

  return (
    <figure className="space-y-3" aria-label={summary}>
      <div className="relative h-2 rounded-full bg-range" aria-hidden>
        <div
          className="absolute inset-y-0 rounded-full bg-range-fill"
          style={{ left: pct(min), width: `calc(${pct(max)} - ${pct(min)})` }}
        />
        {quote !== null && (
          <div
            className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-ink shadow-sm"
            style={{ left: pct(quote) }}
          />
        )}
      </div>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
        <span className="text-ink-muted">
          Typical{' '}
          <span className="font-medium text-ink tabular-nums">
            {formatMoney(min, currency)} to {formatMoney(max, currency)}
          </span>
        </span>
        {quote !== null && (
          <span className="text-ink-muted">
            Your quote{' '}
            <span className="font-medium text-ink tabular-nums">{formatMoney(quote, currency)}</span>
          </span>
        )}
      </figcaption>
    </figure>
  )
}
