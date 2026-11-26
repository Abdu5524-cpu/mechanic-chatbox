import { cn } from '@/lib/utils'
import type { RiskLevel } from '@/lib/api'

const STYLES: Record<RiskLevel, { label: string; className: string }> = {
  LOW: { label: 'Low risk', className: 'bg-low-bg text-low' },
  MEDIUM: { label: 'Medium risk', className: 'bg-medium-bg text-medium' },
  HIGH: { label: 'High risk', className: 'bg-high-bg text-high' },
}

export default function RiskBadge({ level }: { level: RiskLevel }) {
  const style = STYLES[level] ?? STYLES.MEDIUM
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', style.className)}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {style.label}
    </span>
  )
}
