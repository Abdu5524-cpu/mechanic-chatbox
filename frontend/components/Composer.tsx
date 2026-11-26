import { useEffect, useRef } from 'react'
import { ArrowUp } from 'lucide-react'
import { MAX_INPUT, MIN_INPUT } from '@/lib/api'
import { cn } from '@/lib/utils'

const EXAMPLES = [
  '2019 Honda Civic, cracked front bumper and paint touch up. San Diego, CA. Shop quoted $1,800.',
  '2015 Toyota Camry, front brake pads and rotors. Austin, TX. Quote total: $640.',
  '2021 Yamaha MT-07, new chain and sprockets. Brooklyn, NY. They want $520 installed.',
]

type Props = {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  busy: boolean
  showExamples?: boolean
}

export default function Composer({ value, onChange, onSubmit, busy, showExamples = true }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const length = value.trim().length
  const tooLong = value.length > MAX_INPUT
  const canSubmit = !busy && length >= MIN_INPUT && !tooLong

  // Grow with content up to a cap.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 320)}px`
  }, [value])

  const submit = () => {
    if (canSubmit) onSubmit()
  }

  return (
    <form
      className="rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors focus-within:border-line-strong"
      onSubmit={e => {
        e.preventDefault()
        submit()
      }}
    >
      <label htmlFor="quote" className="sr-only">
        Repair quote
      </label>
      <textarea
        id="quote"
        ref={ref}
        rows={4}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          // Enter adds a line (quotes are often pasted); Cmd/Ctrl+Enter submits.
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            submit()
          }
        }}
        placeholder="Paste the quote, or describe the vehicle, the work, where you are, and the price."
        className="block w-full resize-none bg-transparent px-5 pt-4 pb-2 text-[15px] leading-relaxed text-ink placeholder:text-ink-faint focus:outline-none focus-visible:outline-none"
        aria-describedby="quote-hint"
        maxLength={MAX_INPUT + 500}
      />
      <div className="flex items-center justify-between gap-3 px-3 pb-3 pl-5">
        <span id="quote-hint" className={cn('text-xs tabular-nums', tooLong ? 'text-high' : 'text-ink-faint')}>
          {tooLong ? `${value.length - MAX_INPUT} characters over the limit` : `${value.length} / ${MAX_INPUT}`}
          <span className="hidden sm:inline"> · Ctrl + Enter to analyze</span>
        </span>
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
        >
          {busy ? 'Analyzing' : 'Analyze'}
          <ArrowUp className="size-4" aria-hidden />
        </button>
      </div>

      {showExamples && length === 0 && (
        <div className="flex flex-wrap gap-2 border-t border-line px-5 py-3">
          <span className="w-full text-xs text-ink-faint">Try an example</span>
          {EXAMPLES.map(ex => (
            <button
              key={ex}
              type="button"
              onClick={() => {
                onChange(ex)
                ref.current?.focus()
              }}
              className="max-w-full truncate rounded-full border border-line px-3 py-1 text-xs text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
            >
              {ex.split('.')[0]}
            </button>
          ))}
        </div>
      )}
    </form>
  )
}
