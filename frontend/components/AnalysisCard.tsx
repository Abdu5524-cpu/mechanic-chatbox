import RangeBar from './RangeBar'
import RiskBadge from './RiskBadge'
import type { Analysis } from '@/lib/api'
import { joinPresent } from '@/lib/format'

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-ink-faint">{label}</dt>
      <dd className="mt-1 text-sm text-ink break-words">{value || <span className="text-ink-faint">Not stated</span>}</dd>
    </div>
  )
}

export default function AnalysisCard({ analysis }: { analysis: Analysis }) {
  const q = analysis.parsedQuote
  const vehicle = joinPresent([q.vehicle.year, q.vehicle.make, q.vehicle.model])
  const location = joinPresent([q.location.city, q.location.stateOrRegion], ', ') || q.location.userLocationHint || ''
  const hasRange = q.quoteRangeMin !== null && q.quoteRangeMax !== null

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{vehicle || 'Repair quote'}</h3>
          {q.shopName && <p className="mt-0.5 truncate text-sm text-ink-muted">{q.shopName}</p>}
        </div>
        <RiskBadge level={analysis.riskLevel} />
      </header>

      <div className="space-y-6 px-5 py-5 sm:px-6">
        {hasRange && (
          <RangeBar min={q.quoteRangeMin!} max={q.quoteRangeMax!} quote={q.quoteTotal} currency={q.currency} />
        )}

        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
          <Field label="Damage" value={q.damages.join(', ')} />
          <Field label="Work quoted" value={q.services.join(', ')} />
          <Field label="Location" value={location} />
        </dl>

        {analysis.reasons.length > 0 && (
          <section>
            <h4 className="text-sm font-semibold">Why</h4>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink-muted">
              {analysis.reasons.map((r, i) => (
                <li key={i} className="flex gap-2.5">
                  <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-ink-faint" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {analysis.recommendations.length > 0 && (
          <section className="rounded-xl bg-surface-muted px-4 py-3.5">
            <h4 className="text-sm font-semibold">What to do next</h4>
            <ol className="mt-2 space-y-1.5 text-sm leading-relaxed">
              {analysis.recommendations.map((r, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="w-4 shrink-0 text-ink-faint tabular-nums">{i + 1}.</span>
                  <span>{r}</span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </article>
  )
}
