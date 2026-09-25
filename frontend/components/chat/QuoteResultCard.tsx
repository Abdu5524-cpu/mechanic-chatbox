import { compareToRange, formatMoney } from '@/lib/formatQuote'
import type { QuoteAnalysis, RiskLevel } from '@/lib/quoteTypes'

const RISK: Record<RiskLevel, { label: string; className: string }> = {
  LOW: { label: 'Low risk', className: 'border-emerald-300 bg-emerald-100 text-emerald-800' },
  MEDIUM: { label: 'Medium risk', className: 'border-amber-300 bg-amber-100 text-amber-800' },
  HIGH: { label: 'High risk', className: 'border-red-300 bg-red-100 text-red-800' },
}

const VERDICT = {
  below: 'Below the typical range',
  within: 'Within the typical range',
  above: 'Above the typical range',
} as const

const orNotSpecified = (value: string) => value || 'Not specified'

export default function QuoteResultCard({ analysis }: { analysis: QuoteAnalysis }) {
  const q = analysis.parsedQuote
  const risk = RISK[analysis.riskLevel] ?? RISK.MEDIUM
  const money = (n: number) => formatMoney(n, q.currency)
  const vehicle = [q.vehicle.year, q.vehicle.make, q.vehicle.model].filter(Boolean).join(' ')
  const location = [q.location.city, q.location.stateOrRegion].filter(Boolean).join(', ')
  const hasRange = q.quoteRangeMin !== null && q.quoteRangeMax !== null
  const comparison = compareToRange(q.quoteTotal, q.quoteRangeMin, q.quoteRangeMax)

  return (
    <div className="space-y-4 text-lapis">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="m-0 text-base font-bold">{orNotSpecified(vehicle)}</h3>
        <span className={`rounded border px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${risk.className}`}>
          {risk.label}
        </span>
      </div>

      <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        <dt className="font-semibold">Damage</dt>
        <dd className="m-0">{orNotSpecified(q.damages.join(', '))}</dd>
        <dt className="font-semibold">Services</dt>
        <dd className="m-0">{orNotSpecified(q.services.join(', '))}</dd>
        <dt className="font-semibold">Location</dt>
        <dd className="m-0">{orNotSpecified(location)}</dd>
        {q.shopName && (
          <>
            <dt className="font-semibold">Shop</dt>
            <dd className="m-0">{q.shopName}</dd>
          </>
        )}
      </dl>

      <section aria-label="Price comparison" className="rounded border border-saffron/40 bg-white p-3">
        <div className="flex flex-wrap justify-between gap-2">
          <span>
            Quoted: <strong>{q.quoteTotal !== null ? money(q.quoteTotal) : 'Not specified'}</strong>
          </span>
          <span>
            Typical:{' '}
            <strong>{hasRange ? `${money(q.quoteRangeMin!)} – ${money(q.quoteRangeMax!)}` : 'Unavailable'}</strong>
          </span>
        </div>
        {comparison && (
          <>
            <div className="relative mt-3 h-2 rounded-full bg-lapis/10" aria-hidden="true">
              <div
                className="absolute inset-y-0 rounded-full bg-firoza/60"
                style={{ left: `${comparison.bandStart}%`, width: `${comparison.bandEnd - comparison.bandStart}%` }}
              />
              <div
                className="absolute -top-1 h-4 w-1 -translate-x-1/2 rounded bg-lapis"
                style={{ left: `${comparison.percent}%` }}
              />
            </div>
            <p className="mb-0 mt-2 text-xs font-semibold">{VERDICT[comparison.verdict]}</p>
          </>
        )}
      </section>

      {analysis.reasons.length > 0 && (
        <div>
          <h4 className="m-0 mb-1 text-xs font-bold uppercase tracking-wider text-saffron">Why</h4>
          <ul className="m-0 list-disc space-y-1 pl-5">
            {analysis.reasons.map(reason => <li key={reason}>{reason}</li>)}
          </ul>
        </div>
      )}

      {analysis.recommendations.length > 0 && (
        <div>
          <h4 className="m-0 mb-1 text-xs font-bold uppercase tracking-wider text-saffron">What to do</h4>
          <ul className="m-0 list-disc space-y-1 pl-5">
            {analysis.recommendations.map(rec => <li key={rec}>{rec}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}
