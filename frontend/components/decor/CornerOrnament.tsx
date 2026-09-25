// ── Corner ornament component ──────────────────────────────────────────────
// Classic Islamic manuscript corner bracket — the decorative "kosheh" element
// that marks the four corners of a ruled page or panel.
export default function CornerOrnament({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const flip = {
    tl: 'scale(1,1)',
    tr: 'scale(-1,1)',
    bl: 'scale(1,-1)',
    br: 'scale(-1,-1)',
  }[position]

  const offset = {
    tl: { top: -14, left: -14 },
    tr: { top: -14, right: -14 },
    bl: { bottom: -14, left: -14 },
    br: { bottom: -14, right: -14 },
  }[position]

  return (
    <div style={{ position: 'absolute', width: 28, height: 28, ...offset }}>
      <svg viewBox="0 0 28 28" width="28" height="28">
        <g transform={`translate(14,14) ${flip} translate(-14,-14)`}>
          {/* Outer L-bracket */}
          <polyline points="28,14 14,14 14,28" fill="none" stroke="#C8960A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Inner L-bracket */}
          <polyline points="28,8 8,8 8,28" fill="none" stroke="#C8960A" strokeWidth="0.8" opacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Corner medallion */}
          <circle cx="14" cy="14" r="3" fill="#C8960A" />
          <circle cx="14" cy="14" r="1.5" fill="#2EB5BC" />
          {/* Teal flag at outer-bracket end-points */}
          <polygon points="28,11 28,17 24,14" fill="#2EB5BC" opacity="0.7" />
          <polygon points="11,28 17,28 14,24" fill="#2EB5BC" opacity="0.7" />
        </g>
      </svg>
    </div>
  )
}
