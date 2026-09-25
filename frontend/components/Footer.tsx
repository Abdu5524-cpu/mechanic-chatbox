import type { CSSProperties } from 'react'
import Contact from '../components/Contact'

type FooterProps = {
  backgroundClassName?: string
  borderClassName?: string
  textClassName?: string
  mutedTextClassName?: string
  style?: CSSProperties
  textStyle?: CSSProperties
  mutedStyle?: CSSProperties
}

export default function Footer({
  backgroundClassName = 'bg-white',
  borderClassName = 'border-gray-200',
  textClassName = 'text-slate-900',
  mutedTextClassName = 'text-gray-500',
  style,
  textStyle,
  mutedStyle,
}: FooterProps) {
  return (
    <footer className={`${backgroundClassName} ${borderClassName} ${textClassName} py-6`} style={{ borderTop: '1px solid', ...style, ...textStyle }}>
      <Contact />
      <div className={`text-center max-w-6xl mx-auto px-4 text-sm flex flex-col gap-1 ${mutedTextClassName}`} style={mutedStyle}>
        <span>QuoteCheck AI — an independent auto repair quote analyzer.</span>
        <span>
          Built by{' '}
          <a
            href="https://github.com/Abdu5524-cpu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400/80 hover:text-amber-300 transition-colors underline underline-offset-2"
          >
            Abdu Uralov
          </a>
          {' '}· Portfolio project
        </span>
      </div>
    </footer>
  )
}
