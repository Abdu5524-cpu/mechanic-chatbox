import { useEffect, useState } from 'react'

export default function AnalysisSkeleton() {
  const [slow, setSlow] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 9000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6" aria-hidden>
      <div className="flex items-center justify-between">
        <div className="skeleton h-4 w-40" />
        <div className="skeleton h-6 w-24 rounded-full" />
      </div>
      <div className="skeleton mt-6 h-2 w-full rounded-full" />
      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="skeleton h-8" />
        <div className="skeleton h-8" />
        <div className="skeleton h-8" />
      </div>
      <div className="skeleton mt-6 h-16 w-full" />
      <p className="mt-4 text-xs text-ink-faint">
        {slow ? 'Still working. The server may be waking up, which can take up to a minute.' : 'Reading the quote…'}
      </p>
    </div>
  )
}
