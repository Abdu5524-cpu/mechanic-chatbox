'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import About from './components/About'
import ChatBubble from './components/chat/ChatBubble'
import Footer from './components/Footer'

type Message = {
  id: number
  content: string
  isUser: boolean
  time: string
}

type ParsedQuote = {
  parsedQuote?: {
    originalText?: string
    vehicle?: { make?: string | null; model?: string | null; year?: string | null }
    damages?: string[]
    location?: { city?: string | null; stateOrRegion?: string | null; userLocationHint?: string | null }
    services?: string[]
    quoteTotal?: number | null
    currency?: string
    quoteRangeMin?: number | null
    quoteRangeMax?: number | null
    shopName?: string | null
    notesFromUser?: string | null
  }
  riskLevel?: string
  reasons?: string[]
  recommendations?: string[]
}

const initialMessages: Message[] = [
  {
    id: 1,
    content: 'Paste a repair quote or describe the vehicle, damage, quote, and location.',
    isUser: false,
    time: 'Now',
  },
]

// ── Corner ornament component ──────────────────────────────────────────────
// Classic Islamic manuscript corner bracket — the decorative "kosheh" element
// that marks the four corners of a ruled page or panel.
function CornerOrnament({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
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

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const footerNoteRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const el = footerNoteRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight
    if (rect.bottom > viewportHeight || rect.top < 0) {
      el.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages, isTyping])

  const formatParsedQuote = (payload: ParsedQuote) => {
    const q = payload.parsedQuote
    const vehicle = q?.vehicle
    const location = q?.location
    const vehicleLine = [vehicle?.year, vehicle?.make, vehicle?.model].filter(Boolean).join(' ')
    const locationLine = [location?.city, location?.stateOrRegion].filter(Boolean).join(', ')
    const damages = q?.damages?.length ? q.damages.join(', ') : 'Not specified'
    const services = q?.services?.length ? q.services.join(', ') : 'Not specified'
    const reasons = payload.reasons?.length ? payload.reasons.join(' ') : 'Not specified'
    const recommendations = payload.recommendations?.length ? payload.recommendations.join(' ') : 'Not specified'
    const quoteTotal = q?.quoteTotal !== null && q?.quoteTotal !== undefined ? `$${q.quoteTotal}` : 'Not specified'
    const rangeMin = q?.quoteRangeMin
    const rangeMax = q?.quoteRangeMax
    const quoteRange =
      rangeMin !== null && rangeMin !== undefined && rangeMax !== null && rangeMax !== undefined
        ? `$${rangeMin} - $${rangeMax}`
        : 'Not specified'

    return [
      `Summary`,
      ``,
      `Vehicle: ${vehicleLine || 'Not specified'}`,
      `Damage: ${damages}`,
      `Services: ${services}`,
      ``,
      `Location: ${locationLine || 'Not specified'}`,
      `Quote Total: ${quoteTotal}`,
      `Typical Range: ${quoteRange}`,
      ``,
      `Risk Level: ${payload.riskLevel || 'Not specified'}`,
      `Reasons: ${reasons}`,
      `Recommendations: ${recommendations}`,
    ].join('\n')
  }

  const callAnalyzeAPI = async (userText: string) => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || ''
    const res = await fetch(`${apiBase}/api/analyzeQuote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userText }),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || 'Analyze quote request failed')
    }

    const data = await res.json()
    if (!data || data.success === false) {
      throw new Error(data?.error || 'Analyze quote failed')
    }

    const payload = data.parsed ?? data
    if (payload && typeof payload === 'object') {
      return formatParsedQuote(payload as ParsedQuote)
    }
    return String(payload)
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: messages.length + 1,
      content: inputValue.trim(),
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages(prev => [...prev, newMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      const responseText = await callAnalyzeAPI(newMessage.content)
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          content: responseText,
          isUser: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analyze quote failed'
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          content: message,
          isUser: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ── Authentic Timurid palette ─────────────────────────────────────────────
  // Derived from actual Registan / Gur-e-Amir / Shah-i-Zinda tilework:
  //   Lapis cobalt   #0D2464  — interior wall tile (dominant dark)
  //   Firoza turquoise #2EB5BC — dome glaze, outer tile fields
  //   Saffron gold   #C8960A  — grout lines, calligraphy gilt, border frames
  //   Ivory parchment #F5EFE0 — marble courtyard ground, manuscript base
  // The white/ivory IS the room. Cobalt/gold are the decoration on its edges.
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#F5EFE0' }}>

      {/* ════════════════════════════════════════════════════════════════════
          BACKDROP — AUTHENTIC 8-POINTED STAR TILE (KHATAM)
          Based on the actual geometry of Timurid tilework:
          • Two overlapping squares (one rotated 45°) create the octagram
          • Inner radius = outer radius × tan(22.5°) ≈ outer × 0.4142
            (this is the exact ratio where inner points fall on the
             intersection lines of the two underlying squares)
          • Spaces between stars contain octagonal connector shapes
          • Stars placed on a 100×100 square grid; corners share
            quarter-stars between adjacent tiles
          Colors deliberately faint — these are the carved-plaster
          "muqarnas" texture of the wall, not the painted tile surface.
      ════════════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            {/*
              Octagram star polygon — 16 points alternating outer/inner.
              Outer radius = 30, inner radius = 12.43 (= 30 × tan 22.5°)
              All calculations for center at origin; offset per use.

              Outer points (r=30) at 0°, 45°, 90°... clockwise from top:
                0°:   (0, -30)
                45°:  (21.21, -21.21)
                90°:  (30, 0)
                135°: (21.21, 21.21)
                180°: (0, 30)
                225°: (-21.21, 21.21)
                270°: (-30, 0)
                315°: (-21.21, -21.21)

              Inner points (r=12.43) at 22.5°, 67.5°...
                22.5°:  (4.76, -11.46)
                67.5°:  (11.46, -4.76)
                112.5°: (11.46, 4.76)
                157.5°: (4.76, 11.46)
                202.5°: (-4.76, 11.46)
                247.5°: (-11.46, 4.76)
                292.5°: (-11.46, -4.76)
                337.5°: (-4.76, -11.46)
            */}
            {/* Center star — centered at (50,50) */}
            <polygon id="star8"
              points="50,20 54.76,38.54 71.21,28.79 61.46,45.24 80,50 61.46,54.76 71.21,71.21 54.76,61.46 50,80 45.24,61.46 28.79,71.21 38.54,54.76 20,50 38.54,45.24 28.79,28.79 45.24,38.54"
            />
            {/* Connector diamond — small 4-pointed star for mid-edge and cross connectors */}
            <polygon id="diamond4" points="0,-6 3.5,-3.5 6,0 3.5,3.5 0,6 -3.5,3.5 -6,0 -3.5,-3.5" />

            <pattern id="star-tile" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">

              {/* ── Center 8-pointed star ────────────────────────────── */}
              {/* Cobalt fill — the lapis lazuli blue of the interior tiles */}
              <polygon
                points="50,20 54.76,38.54 71.21,28.79 61.46,45.24 80,50 61.46,54.76 71.21,71.21 54.76,61.46 50,80 45.24,61.46 28.79,71.21 38.54,54.76 20,50 38.54,45.24 28.79,28.79 45.24,38.54"
                fill="#0D2464" fillOpacity="0.085" stroke="#C8960A" strokeWidth="0.7" strokeOpacity="0.22"
              />
              {/* Gold outline, slightly heavier — the tile grout line */}
              <polygon
                points="50,20 54.76,38.54 71.21,28.79 61.46,45.24 80,50 61.46,54.76 71.21,71.21 54.76,61.46 50,80 45.24,61.46 28.79,71.21 38.54,54.76 20,50 38.54,45.24 28.79,28.79 45.24,38.54"
                fill="none" stroke="#C8960A" strokeWidth="1.1" strokeOpacity="0.18"
              />
              {/* Center rosette — small circle with dot, the "shamsa" motif */}
              <circle cx="50" cy="50" r="7"   fill="none" stroke="#C8960A" strokeWidth="0.8" strokeOpacity="0.22" />
              <circle cx="50" cy="50" r="3.5" fill="#2EB5BC" fillOpacity="0.14" />
              <circle cx="50" cy="50" r="1.5" fill="#C8960A"  fillOpacity="0.28" />

              {/* ── Corner quarter-stars ─────────────────────────────── */}
              {/* Teal fill — firoza turquoise of the outer tile fields   */}
              {/* Top-left corner: star centered at (0,0)   */}
              <polygon
                points="0,-30 4.76,-11.46 21.21,-21.21 11.46,-4.76 30,0 11.46,4.76 21.21,21.21 4.76,11.46 0,30 -4.76,11.46 -21.21,21.21 -11.46,4.76 -30,0 -11.46,-4.76 -21.21,-21.21 -4.76,-11.46"
                fill="#2EB5BC" fillOpacity="0.07" stroke="#C8960A" strokeWidth="0.8" strokeOpacity="0.17"
              />
              {/* Top-right corner: star centered at (100,0) */}
              <polygon
                points="100,-30 104.76,-11.46 121.21,-21.21 111.46,-4.76 130,0 111.46,4.76 121.21,21.21 104.76,11.46 100,30 95.24,11.46 78.79,21.21 88.54,4.76 70,0 88.54,-4.76 78.79,-21.21 95.24,-11.46"
                fill="#2EB5BC" fillOpacity="0.07" stroke="#C8960A" strokeWidth="0.8" strokeOpacity="0.17"
              />
              {/* Bottom-left corner: star centered at (0,100) */}
              <polygon
                points="0,70 4.76,88.54 21.21,78.79 11.46,95.24 30,100 11.46,104.76 21.21,121.21 4.76,111.46 0,130 -4.76,111.46 -21.21,121.21 -11.46,104.76 -30,100 -11.46,95.24 -21.21,78.79 -4.76,88.54"
                fill="#2EB5BC" fillOpacity="0.07" stroke="#C8960A" strokeWidth="0.8" strokeOpacity="0.17"
              />
              {/* Bottom-right corner: star centered at (100,100) */}
              <polygon
                points="100,70 104.76,88.54 121.21,78.79 111.46,95.24 130,100 111.46,104.76 121.21,121.21 104.76,111.46 100,130 95.24,111.46 78.79,121.21 88.54,104.76 70,100 88.54,95.24 78.79,78.79 95.24,88.54"
                fill="#2EB5BC" fillOpacity="0.07" stroke="#C8960A" strokeWidth="0.8" strokeOpacity="0.17"
              />

              {/* ── Mid-edge half-stars ───────────────────────────────── */}
              {/* These complete the corner stars of adjacent tiles.       */}
              {/* Top edge: star centered at (50,0) */}
              <polygon
                points="50,-30 54.76,-11.46 71.21,-21.21 61.46,-4.76 80,0 61.46,4.76 71.21,21.21 54.76,11.46 50,30 45.24,11.46 28.79,21.21 38.54,4.76 20,0 38.54,-4.76 28.79,-21.21 45.24,-11.46"
                fill="#0D2464" fillOpacity="0.06" stroke="#C8960A" strokeWidth="0.7" strokeOpacity="0.15"
              />
              {/* Left edge: star centered at (0,50) */}
              <polygon
                points="0,20 4.76,38.54 21.21,28.79 11.46,45.24 30,50 11.46,54.76 21.21,71.21 4.76,61.46 0,80 -4.76,61.46 -21.21,71.21 -11.46,54.76 -30,50 -11.46,45.24 -21.21,28.79 -4.76,38.54"
                fill="#0D2464" fillOpacity="0.06" stroke="#C8960A" strokeWidth="0.7" strokeOpacity="0.15"
              />

              {/* ── Cross connector diamonds ─────────────────────────── */}
              {/* The small octagonal/square shapes that fill the spaces  */}
              {/* between adjacent 8-pointed stars. In real khatam        */}
              {/* tilework these spaces contain smaller geometric insets. */}
              {/* Here represented as small 4-pointed connector stars.    */}
              {/* Orthogonal connectors */}
              <polygon points="50,7 53,10 50,13 47,10" fill="#C8960A" fillOpacity="0.18" />
              <polygon points="50,87 53,90 50,93 47,90" fill="#C8960A" fillOpacity="0.18" />
              <polygon points="7,50 10,53 13,50 10,47"  fill="#C8960A" fillOpacity="0.18" />
              <polygon points="87,50 90,53 93,50 90,47" fill="#C8960A" fillOpacity="0.18" />
              {/* Diagonal connectors */}
              <polygon points="14,14 17,11 20,14 17,17" fill="#2EB5BC" fillOpacity="0.15" />
              <polygon points="86,14 89,11 92,14 89,17" fill="#2EB5BC" fillOpacity="0.15" />
              <polygon points="14,86 17,83 20,86 17,89" fill="#2EB5BC" fillOpacity="0.15" />
              <polygon points="86,86 89,83 92,86 89,89" fill="#2EB5BC" fillOpacity="0.15" />

              {/* ── Outer square grid ────────────────────────────────── */}
              <rect width="100" height="100" fill="none" stroke="#C8960A" strokeWidth="0.4" strokeOpacity="0.12" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#star-tile)" />
        </svg>
      </div>

      {/* Very subtle edge darkening — like the depth of a courtyard corner */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 55%, rgba(13,24,64,0.07) 100%)' }} />

      {/* ════════════════════════════════════════════════════════════════════
          BACKGROUND ARCHITECTURAL ILLUSTRATIONS
          SVG illustrations of iconic Uzbek monuments placed as flanking
          panels in the page margins. Visible but not dominant — they
          establish the sense of place without competing with content.

          Left:  Kalon Minaret, Bukhara (12th c.) — the tallest pre-Mongol
                 minaret in Central Asia, with 14 ornamental brick bands.
          Right: Gur-e-Amir Mausoleum, Samarkand (1404) — Timur's tomb,
                 with the iconic tall ribbed melon dome on a blue drum.
      ════════════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>

        {/* ── KALON MINARET (left) ──────────────────────────────────── */}
        <div style={{ position: 'absolute', left: '2%', top: '8%', opacity: 0.28 }}>
          <svg viewBox="0 0 80 480" width="80" height="480" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Shaft outline for clipping the ornamental bands */}
              <clipPath id="shaft-clip">
                <polygon points="13,438 67,438 59,96 21,96" />
              </clipPath>
              {/* Gallery outline for clipping window arches */}
              <clipPath id="gallery-clip">
                <rect x="15" y="44" width="50" height="54" />
              </clipPath>
            </defs>

            {/* ── Base plinth — two stepped levels ── */}
            <rect x="4"  y="453" width="72" height="14" rx="1" fill="#7A5030" />
            <rect x="8"  y="440" width="64" height="14" rx="1" fill="#8B6040" />
            <polygon points="13,440 67,440 64,426 16,426" fill="#8B6040" />

            {/* ── Main shaft — tapering polygon, warm terracotta brick ── */}
            <polygon points="13,438 67,438 59,96 21,96" fill="#9A6840" />

            {/* ── 14 ornamental bands clipped to shaft ── */}
            {/*
              The real Kalon Minaret has 14 bands of different patterns:
              carved terracotta bricks in geometric arrangements.
              Alternating: cobalt tile band / terracotta diamond band.
            */}
            <g clipPath="url(#shaft-clip)">
              {[438,412,386,360,334,308,282,256,230,204,178,152,126,100].map((y, i) => (
                <g key={y}>
                  {i % 2 === 0 ? (
                    /* Cobalt glazed-tile band — references the blue-tile rings visible in photos */
                    <>
                      <rect x="0" y={y - 9} width="80" height="9" fill="#0D2464" />
                      {/* Small white dot row inside cobalt band */}
                      {[8,16,24,32,40,48,56,64,72].map(x => (
                        <circle key={x} cx={x} cy={y - 4.5} r="1.6" fill="white" opacity="0.38" />
                      ))}
                    </>
                  ) : (
                    /* Terracotta diamond-pattern band */
                    <>
                      <rect x="0" y={y - 9} width="80" height="9" fill="#6A3818" opacity="0.7" />
                      {/* Diamond row */}
                      {[8,20,32,44,56,68].map(x => (
                        <polygon key={x} points={`${x},${y-9} ${x+6},${y-4.5} ${x},${y} ${x-6},${y-4.5}`}
                          fill="#C8960A" opacity="0.45" />
                      ))}
                    </>
                  )}
                </g>
              ))}
              {/* Prominent Kufic inscription band at the mid-shaft (~y=260) */}
              <rect x="0" y="248" width="80" height="14" fill="#0A1A50" />
              {[6,14,22,30,38,46,54,62,70].map(x => (
                <rect key={x} x={x} y="251" width="4" height={[8,5,8,6,8,5,7,8,5][x/8|0] || 7} fill="white" opacity="0.3" />
              ))}
            </g>
            {/* Shaft gold-rule outline */}
            <polygon points="13,438 67,438 59,96 21,96" fill="none" stroke="#C8960A" strokeWidth="0.6" opacity="0.35" />

            {/* ── Muqarnas corbel bracket above shaft ── */}
            {/* Step-bracket silhouette referencing the stalactite niche beneath the gallery */}
            <path d="M 21,96 L 17,86 L 14,78 L 18,72 L 21,68 L 24,64 L 28,60 L 40,56
                     L 52,60 L 56,64 L 59,68 L 62,72 L 66,78 L 63,86 L 59,96"
                  fill="#7A5030" />
            <path d="M 22,92 L 19,84 L 17,78 L 20,73 L 22,70 L 25,67 L 29,63 L 40,60
                     L 51,63 L 55,67 L 58,70 L 60,73 L 63,78 L 61,84 L 58,92"
                  fill="none" stroke="#C8960A" strokeWidth="0.5" opacity="0.4" />

            {/* ── Gallery / lantern — wider than shaft, with arched windows ── */}
            {/* Dark cobalt background */}
            <rect x="15" y="44" width="50" height="16" fill="#0D2464" />
            {/* Gallery rail with gold crenellations */}
            <rect x="15" y="40" width="50" height="6" fill="#0D2464" />
            {[17,21,25,29,33,37,41,45,49,53,57].map(x => (
              <rect key={x} x={x} y="36" width="3" height="6" fill="#C8960A" opacity="0.55" />
            ))}
            {/* 8 arched openings in the gallery */}
            <g clipPath="url(#gallery-clip)">
              {[17,23,29,35,41,47,53,59].map(x => (
                <path key={x}
                  d={`M ${x},60 L ${x},48 Q ${x + 3},42 ${x + 6},48 L ${x + 6},60 Z`}
                  fill="#F5EFE0" opacity="0.65"
                />
              ))}
            </g>
            {/* Gallery base line */}
            <line x1="15" y1="60" x2="65" y2="60" stroke="#C8960A" strokeWidth="0.8" opacity="0.5" />

            {/* ── Conical tiled cap — teal like the Bukharan dome caps ── */}
            <path d="M 15,44 Q 40,4 65,44 Z" fill="#2EB5BC" />
            {/* Rib lines on cap */}
            {[22,28,34,40,46,52,58].map(x => (
              <line key={x} x1={x} y1="44" x2="40" y2="6" stroke="rgba(13,36,100,0.18)" strokeWidth="0.7" />
            ))}
            <path d="M 15,44 Q 40,4 65,44" fill="none" stroke="#C8960A" strokeWidth="0.8" opacity="0.4" />

            {/* Finial */}
            <line x1="40" y1="6" x2="40" y2="-10" stroke="#C8960A" strokeWidth="1.5" />
            <circle cx="40" cy="-12" r="2.5" fill="#C8960A" />
          </svg>
        </div>

        {/* ── GUR-E-AMIR DOME (right) ────────────────────────────────── */}
        {/*
          Timur's mausoleum (1404), Samarkand. The ribbed turquoise melon
          dome on a tall cobalt drum is the defining image of Timurid
          architecture — prototype for the Taj Mahal's dome form.
        */}
        <div style={{ position: 'absolute', right: '2%', top: '18%', opacity: 0.28 }}>
          <svg viewBox="0 0 170 310" width="170" height="310" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Dome outline clip — tall pointed ogival profile */}
              <clipPath id="dome-clip">
                <path d="M 10,178 C 6,118 22,46 85,12 C 148,46 164,118 160,178 Z" />
              </clipPath>
            </defs>

            {/* ── Base step / platform ── */}
            <rect x="0"  y="292" width="170" height="10" rx="1" fill="#6A4020" opacity="0.6" />
            <rect x="5"  y="282" width="160" height="12" rx="1" fill="#7A5030" opacity="0.55" />

            {/* ── Drum (tall octagonal base of dome) — cobalt tiled ── */}
            {/*
              The real drum is tall (~12m) and octagonal with kufic inscription
              band at the top and arched niches/windows. Shown here simplified
              as a rectangle with cut corners (the visible 3 faces from front).
            */}
            {/* Cut-corner rectangle for octagonal drum */}
            <polygon
              points="18,282 152,282 162,270 162,202 152,190 18,190 8,202 8,270"
              fill="#0D2464"
            />
            {/* Drum highlight — lighter cobalt on left face (reflected light) */}
            <polygon points="8,202 8,270 18,282 18,190" fill="#1A3880" />
            {/* Four arched window niches on drum face */}
            {[36, 65, 94, 123].map(x => (
              <g key={x}>
                <rect x={x} y={220} width={16} height={36} rx="1" fill="#091840" />
                <path d={`M ${x},220 Q ${x + 8},210 ${x + 16},220`} fill="#091840" />
              </g>
            ))}
            {/* Kufic inscription band near drum top */}
            <rect x="8" y="192" width="154" height="12" fill="#091840" />
            {[12,20,28,36,44,52,60,68,76,84,92,100,108,116,124,132,140,148,156].map(x => (
              <rect key={x} x={x} y="194" width="3"
                height={[7,5,9,6,8,5,7,9,6,8,5,7,6,9,7,5,8,6,7][Math.floor(x/8) % 19] || 6}
                fill="white" opacity="0.22" />
            ))}
            {/* Gold rule at drum top and bottom */}
            <line x1="8" y1="190" x2="162" y2="190" stroke="#C8960A" strokeWidth="1.2" opacity="0.55" />
            <line x1="8" y1="282" x2="162" y2="282" stroke="#C8960A" strokeWidth="0.8" opacity="0.4" />

            {/* ── Short neck between drum and dome ── */}
            <rect x="55" y="175" width="60" height="18" fill="#0A1E50" />
            <line x1="55" y1="175" x2="115" y2="175" stroke="#C8960A" strokeWidth="0.9" opacity="0.45" />

            {/* ── Ribbed melon dome — the signature Timurid form ── */}
            {/*
              The Gur-e-Amir dome has ~64 ribs. Here 16 alternating strips
              (8 pairs of light/dark teal) are clipped to the ogival profile.
              The left ribs are slightly brighter (reflected sky light).
            */}
            {/* Base teal fill */}
            <path d="M 10,178 C 6,118 22,46 85,12 C 148,46 164,118 160,178 Z"
                  fill="#1A9080" />
            {/* 16 alternating rib strips */}
            <g clipPath="url(#dome-clip)">
              {Array.from({ length: 16 }, (_, i) => {
                const x = 10 + i * 9.375
                const isLight = i % 2 === 0
                /* Ribs on the left half are brighter (light source from left) */
                const brightness = i < 8
                  ? (isLight ? '#30C8B4' : '#1A9080')
                  : (isLight ? '#28B0A0' : '#127060')
                return (
                  <rect key={i} x={x} y={0} width={9.375} height={200}
                        fill={brightness} />
                )
              })}
              {/* Highlight on leftmost ribs — sky reflection */}
              <rect x="10" y="0" width="18" height="200" fill="white" opacity="0.07" />
              {/* Dark shadow on rightmost ribs */}
              <rect x="142" y="0" width="18" height="200" fill="#061830" opacity="0.15" />
            </g>
            {/* Dome outline — gold grout line */}
            <path d="M 10,178 C 6,118 22,46 85,12 C 148,46 164,118 160,178"
                  fill="none" stroke="#C8960A" strokeWidth="0.9" opacity="0.45" />

            {/* ── Finial — tall spike with crescent ── */}
            {/* Neck knob */}
            <circle cx="85" cy="14" r="5" fill="#C8960A" opacity="0.75" />
            {/* Spike */}
            <line x1="85" y1="14" x2="85" y2="-18" stroke="#C8960A" strokeWidth="2" />
            {/* Crescent */}
            <path d="M 80,-18 Q 85,-28 90,-18 Q 85,-22 80,-18 Z" fill="#C8960A" opacity="0.8" />
          </svg>
        </div>

        {/* ── SHAH-I-ZINDA PORTAL (lower, center-left) ─────────────────
            A faint ogival arch silhouette — the corridor of Shah-i-Zinda
            necropolis in Samarkand, famous for its cobalt and teal glazed
            portal facades. Placed low so it doesn't interfere with main content.
        ─────────────────────────────────────────────────────────────── */}
        <div style={{ position: 'absolute', left: '6%', bottom: '14%', opacity: 0.16 }}>
          <svg viewBox="0 0 120 180" width="120" height="180" xmlns="http://www.w3.org/2000/svg">
            {/* Portal rectangle frame */}
            <rect x="5" y="5" width="110" height="175" fill="none" stroke="#C8960A" strokeWidth="2" />
            <rect x="10" y="10" width="100" height="165" fill="none" stroke="#C8960A" strokeWidth="0.7" opacity="0.5" />
            {/* Cobalt spandrel field */}
            <path d="M 10,10 L 110,10 L 110,110 Q 110,70 60,58 Q 10,70 10,110 Z" fill="#0D2464" />
            {/* Scattered rosettes in spandrel */}
            {[[30,40],[60,28],[90,40],[25,72],[95,72]].map(([x,y],i) => (
              <g key={i} transform={`translate(${x},${y})`}>
                {[0,60,120].map(a => (
                  <ellipse key={a} rx="1" ry="4" fill="white" opacity="0.35"
                    transform={`rotate(${a})`} />
                ))}
                <circle r="1.8" fill="white" opacity="0.55" />
              </g>
            ))}
            {/* Arch opening — pointed iwan */}
            <path d="M 10,175 L 10,110 Q 10,70 60,58 Q 110,70 110,110 L 110,175 Z"
                  fill="#F5EFE0" />
            {/* Arch border */}
            <path d="M 10,110 Q 10,70 60,58 Q 110,70 110,110"
                  fill="none" stroke="#C8960A" strokeWidth="1.5" />
            {/* Tilework border band */}
            {[0,10,20,30,40,50,60,70,80,90,100].map(x => (
              <rect key={x} x={x + 5} y={5} width={5} height={5} fill="#2EB5BC" opacity={x%20===0 ? 0.5 : 0.25} />
            ))}
          </svg>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          TOP BORDER BAND — ISLIMI ARABESQUE VINE
          Based on the running vine border ("islimi qalam") found on:
          • The inner jambs of the Registan portals
          • Manuscript page borders from the Timurid scriptorium
          Structure: continuous S-curve vine with upward half-palmette
          flowers at arch peaks and downward teal leaves at troughs.
          Leaves spring directly from stems (no leaf-stalk) — the
          definitive stylistic feature of Uzbek vegetal ornament.
          Colors: cobalt ground, gold vine/flowers, teal leaves.
          NO rainbow gradient — authentic Timurid palette only.
      ════════════════════════════════════════════════════════════════════ */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none z-20">
        {/* Cobalt band with running islimi vine */}
        <svg width="100%" height="42" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            {/*
              Vine pattern unit — 60px wide, 42px tall.
              Vine midline y = 21. The cubic bezier S-curve:
                M 0,21  C 10,7  20,7  30,21   ← arch up (peak at x≈15, y≈9.5)
                         C 40,35 50,35  60,21   ← arch down (trough at x≈45, y≈32.5)
              Half-palmette (3 petals, central + two angled at ≈45°) at peak.
              Single leaf pair at trough.
              Small forking tendrils at midline crossing (x=30).
            */}
            <pattern id="islimi-top" x="0" y="0" width="60" height="42" patternUnits="userSpaceOnUse">
              {/* Cobalt ground */}
              <rect width="60" height="42" fill="#0D2464" />

              {/* Inner gold rules */}
              <line x1="0" y1="1.5" x2="60" y2="1.5" stroke="#C8960A" strokeWidth="0.7" opacity="0.5" />
              <line x1="0" y1="40.5" x2="60" y2="40.5" stroke="#C8960A" strokeWidth="0.7" opacity="0.5" />

              {/* Main vine stem — continuous S-curve */}
              <path d="M 0,21 C 10,7 20,7 30,21 C 40,35 50,35 60,21"
                    fill="none" stroke="#C8960A" strokeWidth="1.3" opacity="0.9" />

              {/* ── Upward half-palmette at arch peak (≈15, 9.5) ─── */}
              {/* Central petal pointing straight up */}
              <path d="M 15,13 C 13.2,10 13.2,5 15,2 C 16.8,5 16.8,10 15,13 Z"
                    fill="#C8960A" opacity="0.72" />
              {/* Left side petal at ~45° */}
              <path d="M 15,13 C 11.5,11 9.5,8 11,5.5 C 12.8,7.5 13.8,10.5 15,13 Z"
                    fill="#C8960A" opacity="0.55" />
              {/* Right side petal at ~45° */}
              <path d="M 15,13 C 18.5,11 20.5,8 19,5.5 C 17.2,7.5 16.2,10.5 15,13 Z"
                    fill="#C8960A" opacity="0.55" />
              {/* Small outer side petals (true half-palmette has 5 petals total) */}
              <path d="M 15,13 C 10,12 7.5,10 9,8 C 10.5,9.5 12,11 15,13 Z"
                    fill="#C8960A" opacity="0.35" />
              <path d="M 15,13 C 20,12 22.5,10 21,8 C 19.5,9.5 18,11 15,13 Z"
                    fill="#C8960A" opacity="0.35" />
              {/* Teal center calyx dot */}
              <circle cx="15" cy="13" r="2" fill="#2EB5BC" opacity="0.85" />

              {/* ── Downward leaf pair at arch trough (≈45, 32.5) ── */}
              {/* Leaves in teal — the contrasting foliage color of Timurid vine work */}
              {/* Central downward leaf */}
              <path d="M 45,28 C 43.2,31 43.2,36.5 45,39 C 46.8,36.5 46.8,31 45,28 Z"
                    fill="#2EB5BC" opacity="0.65" />
              {/* Left leaf */}
              <path d="M 45,28 C 41.5,26 39,27 40,30.5 C 41.5,29.5 43,28.5 45,28 Z"
                    fill="#2EB5BC" opacity="0.5" />
              {/* Right leaf */}
              <path d="M 45,28 C 48.5,26 51,27 50,30.5 C 48.5,29.5 47,28.5 45,28 Z"
                    fill="#2EB5BC" opacity="0.5" />
              {/* Gold center calyx dot */}
              <circle cx="45" cy="28" r="2" fill="#C8960A" opacity="0.85" />

              {/* ── Forking tendrils at midline crossing (x=30, y=21) */}
              {/* In islimi ornament, secondary stems fork off at vine joints */}
              <path d="M 30,21 C 27.5,18.5 25,17 27,15.5"
                    fill="none" stroke="#C8960A" strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />
              <path d="M 30,21 C 32.5,18.5 35,17 33,15.5"
                    fill="none" stroke="#C8960A" strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />
              {/* Small gold buds at tendril tips */}
              <circle cx="26.5" cy="15.5" r="1.3" fill="#C8960A" opacity="0.55" />
              <circle cx="33.5" cy="15.5" r="1.3" fill="#C8960A" opacity="0.55" />
            </pattern>
          </defs>
          <rect width="100%" height="42" fill="url(#islimi-top)" />
        </svg>

        {/* Second gold rule below the band */}
        <div style={{ height: 1, background: '#C8960A', opacity: 0.35 }} />
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          BOTTOM BORDER BAND — mirrored islimi (vine scrolls upward)
      ════════════════════════════════════════════════════════════════════ */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-20">
        <div style={{ height: 1, background: '#C8960A', opacity: 0.35 }} />
        <svg width="100%" height="42" xmlns="http://www.w3.org/2000/svg"
             preserveAspectRatio="xMidYMid slice"
             style={{ transform: 'scaleY(-1)' }}>
          <defs>
            <pattern id="islimi-bot" x="0" y="0" width="60" height="42" patternUnits="userSpaceOnUse">
              <rect width="60" height="42" fill="#0D2464" />
              <line x1="0" y1="1.5" x2="60" y2="1.5" stroke="#C8960A" strokeWidth="0.7" opacity="0.5" />
              <line x1="0" y1="40.5" x2="60" y2="40.5" stroke="#C8960A" strokeWidth="0.7" opacity="0.5" />
              <path d="M 0,21 C 10,7 20,7 30,21 C 40,35 50,35 60,21"
                    fill="none" stroke="#C8960A" strokeWidth="1.3" opacity="0.9" />
              <path d="M 15,13 C 13.2,10 13.2,5 15,2 C 16.8,5 16.8,10 15,13 Z" fill="#C8960A" opacity="0.72" />
              <path d="M 15,13 C 11.5,11 9.5,8 11,5.5 C 12.8,7.5 13.8,10.5 15,13 Z" fill="#C8960A" opacity="0.55" />
              <path d="M 15,13 C 18.5,11 20.5,8 19,5.5 C 17.2,7.5 16.2,10.5 15,13 Z" fill="#C8960A" opacity="0.55" />
              <path d="M 15,13 C 10,12 7.5,10 9,8 C 10.5,9.5 12,11 15,13 Z" fill="#C8960A" opacity="0.35" />
              <path d="M 15,13 C 20,12 22.5,10 21,8 C 19.5,9.5 18,11 15,13 Z" fill="#C8960A" opacity="0.35" />
              <circle cx="15" cy="13" r="2" fill="#2EB5BC" opacity="0.85" />
              <path d="M 45,28 C 43.2,31 43.2,36.5 45,39 C 46.8,36.5 46.8,31 45,28 Z" fill="#2EB5BC" opacity="0.65" />
              <path d="M 45,28 C 41.5,26 39,27 40,30.5 C 41.5,29.5 43,28.5 45,28 Z" fill="#2EB5BC" opacity="0.5" />
              <path d="M 45,28 C 48.5,26 51,27 50,30.5 C 48.5,29.5 47,28.5 45,28 Z" fill="#2EB5BC" opacity="0.5" />
              <circle cx="45" cy="28" r="2" fill="#C8960A" opacity="0.85" />
              <path d="M 30,21 C 27.5,18.5 25,17 27,15.5" fill="none" stroke="#C8960A" strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />
              <path d="M 30,21 C 32.5,18.5 35,17 33,15.5" fill="none" stroke="#C8960A" strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />
              <circle cx="26.5" cy="15.5" r="1.3" fill="#C8960A" opacity="0.55" />
              <circle cx="33.5" cy="15.5" r="1.3" fill="#C8960A" opacity="0.55" />
            </pattern>
          </defs>
          <rect width="100%" height="42" fill="url(#islimi-bot)" />
        </svg>
        <div style={{ height: 2, background: '#C8960A', opacity: 0.65 }} />
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          PAGE CONTENT — the open courtyard between ornate portals
      ════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-col min-h-screen max-w-3xl mx-auto px-6 gap-10"
           style={{ paddingTop: 80, paddingBottom: 80 }}>

        {/* ── HEADER ────────────────────────────────────────────────── */}
        {/*
          Tashkent Metro aesthetic — Alisher Navoi / Kosmonavtlar station vault:
          • Receding pointed arches in perfect bilateral symmetry
          • Sky-blue groined vault ceiling with cross-ribs converging on
            a central medallion (the ornamental dome boss)
          • Wide white marble arch borders graduating in thickness with depth
          • Vault webbing between arch bays (the curved vault "cells")
          • Central medallion: 8-pointed geometric star + botanical leaf forms
            in cobalt + dark teal (matches the station dome ornament)
          • Diamond lozenge panels in the spandrel walls
          • Pilaster columns at the arch springer points
          The text sits in a clean white tray below the vault illustration.
        */}
        <header style={{
          background: '#FFFFFF',
          border: '1px solid rgba(200,150,10,0.45)',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 2px 16px rgba(13,36,100,0.07)',
        }}>

          {/* ── VAULT ILLUSTRATION ── */}
          <svg
            viewBox="0 0 700 195"
            width="100%"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block' }}
          >
            <defs>
              {/*
                Sky-blue vault background — lighter at center (dome glow),
                deeper at the outer edges, exactly as in the photo.
              */}
              <radialGradient id="vault-sky" cx="50%" cy="30%" r="68%">
                <stop offset="0%"   stopColor="#DCF0FA" />
                <stop offset="38%"  stopColor="#A8CEDF" />
                <stop offset="100%" stopColor="#5A90B4" />
              </radialGradient>
              {/* Extra glow centred on the dome medallion */}
              <radialGradient id="dome-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#A8CEDF" stopOpacity="0" />
              </radialGradient>
              {/* Gentle white inner-arch fill — the lit vault cell interior */}
              <radialGradient id="inner-vault" cx="50%" cy="0%" r="100%">
                <stop offset="0%"   stopColor="#EAF6FE" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#A8CEDF" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Vault background */}
            <rect width="700" height="195" fill="url(#vault-sky)" />

            {/* Dome halo — bright circular light from the medallion */}
            <ellipse cx="350" cy="58" rx="230" ry="140" fill="url(#dome-glow)" />

            {/* ════════════════════════════════════════════════════════
                VAULT WEBBING — the curved panels between arch bays.
                In a groined vault each bay has two curved webs that
                meet at a ridge rib. Shown as subtle light fills.
            ════════════════════════════════════════════════════════ */}
            {/* Left bay web (arch1 → arch2, left half) */}
            <path d="M 95,195 C 95,110 183,60 350,25 C 280,55 183,110 183,195 Z"
                  fill="white" opacity="0.06" />
            {/* Right bay web */}
            <path d="M 605,195 C 605,110 517,60 350,25 C 420,55 517,110 517,195 Z"
                  fill="white" opacity="0.06" />

            {/* ════════════════════════════════════════════════════════
                CROSS-RIBS — the characteristic X rib pattern in each
                vault bay, going from springer to springer diagonally.
                These are the thin white curved lines that create the
                geometric lattice on the vault ceiling in the photo.
            ════════════════════════════════════════════════════════ */}
            {/* Left bay: arch1-L (95,195) ↗ toward arch2 apex shoulder */}
            <path d="M 95,195 C 130,130 230,60 350,25"
                  fill="none" stroke="white" strokeWidth="1.6" opacity="0.38" />
            {/* Left bay: arch2-L (183,195) ↗ toward far arch (arch1-L shoulder) */}
            <path d="M 183,195 C 170,140 140,85 95,50"
                  fill="none" stroke="white" strokeWidth="1.4" opacity="0.32" />
            {/* Right bay: arch1-R (605,195) ↗ toward arch2 apex shoulder */}
            <path d="M 605,195 C 570,130 470,60 350,25"
                  fill="none" stroke="white" strokeWidth="1.6" opacity="0.38" />
            {/* Right bay: arch2-R (517,195) ↗ toward arch1-R shoulder */}
            <path d="M 517,195 C 530,140 560,85 605,50"
                  fill="none" stroke="white" strokeWidth="1.4" opacity="0.32" />
            {/* Inner left bay ribs (arch2↔arch3) */}
            <path d="M 183,195 C 205,135 280,75 350,46"
                  fill="none" stroke="white" strokeWidth="1.2" opacity="0.26" />
            <path d="M 248,195 C 232,148 200,100 183,72"
                  fill="none" stroke="white" strokeWidth="1.1" opacity="0.22" />
            {/* Inner right bay ribs (arch2↔arch3) */}
            <path d="M 517,195 C 495,135 420,75 350,46"
                  fill="none" stroke="white" strokeWidth="1.2" opacity="0.26" />
            <path d="M 452,195 C 468,148 500,100 517,72"
                  fill="none" stroke="white" strokeWidth="1.1" opacity="0.22" />

            {/* ════════════════════════════════════════════════════════
                ARCHES — 6 arches from foreground to vanishing point.
                Each successive arch is: ~30% narrower and its apex
                ~18px higher (closer to top), with progressively
                thinner white border stroke.
                All arch paths: M x1,195 C x1,ctrl mid,apex 350,apex_y
                                         C 350,apex_y mid,ctrl x2,195
            ════════════════════════════════════════════════════════ */}

            {/* Arch 6 — deepest / smallest (barely a sliver) */}
            <path d="M 328,195 C 328,162 344,100 350,100 C 356,100 372,162 372,195"
                  fill="none" stroke="white" strokeWidth="3.5" opacity="0.45" />

            {/* Arch 5 */}
            <path d="M 312,195 C 312,152 336,84 350,84 C 364,84 388,152 388,195"
                  fill="none" stroke="white" strokeWidth="5" opacity="0.55" />

            {/* Arch 4 */}
            <path d="M 287,195 C 287,135 328,67 350,67 C 372,67 413,135 413,195"
                  fill="none" stroke="white" strokeWidth="7" opacity="0.65" />

            {/* Arch 3 */}
            <path d="M 247,195 C 247,118 314,46 350,46 C 386,46 453,118 453,195"
                  fill="none" stroke="white" strokeWidth="10" opacity="0.75" />
            {/* Arch 3 inner edge shadow — gives the marble border its depth */}
            <path d="M 257,195 C 257,123 318,54 350,54 C 382,54 443,123 443,195"
                  fill="none" stroke="#78AEC8" strokeWidth="1" opacity="0.3" />

            {/* Arch 2 */}
            <path d="M 182,195 C 182,100 294,25 350,25 C 406,25 518,100 518,195"
                  fill="none" stroke="white" strokeWidth="14" opacity="0.87" />
            {/* Arch 2 inner edge */}
            <path d="M 196,195 C 196,108 300,37 350,37 C 400,37 504,108 504,195"
                  fill="none" stroke="#6AA4C0" strokeWidth="1.5" opacity="0.35" />

            {/* Arch 1 — foreground, largest, dominant white marble border */}
            <path d="M 93,195 C 93,80 274,5 350,5 C 426,5 607,80 607,195"
                  fill="none" stroke="white" strokeWidth="20" opacity="0.95" />
            {/* Arch 1 inner shadow line — the recessed edge of the marble moulding */}
            <path d="M 113,195 C 113,90 282,20 350,20 C 418,20 587,90 587,195"
                  fill="none" stroke="#5A9AB8" strokeWidth="2" opacity="0.4" />
            {/* Arch 1 outer shadow — the other edge */}
            <path d="M 73,195 C 73,70 265,-8 350,-8 C 435,-8 627,70 627,195"
                  fill="none" stroke="#3A7090" strokeWidth="2" opacity="0.2" />

            {/* ════════════════════════════════════════════════════════
                SIDE ARCHES — the platform wall niches visible left
                and right of frame in the photo. Partial arches
                at the very edge of the frame suggesting depth.
            ════════════════════════════════════════════════════════ */}
            <path d="M 0,195 C 0,130 38,75 60,55 C 72,100 93,160 93,195"
                  fill="none" stroke="white" strokeWidth="9" opacity="0.52" />
            <path d="M 700,195 C 700,130 662,75 640,55 C 628,100 607,160 607,195"
                  fill="none" stroke="white" strokeWidth="9" opacity="0.52" />

            {/* ════════════════════════════════════════════════════════
                SPANDREL DIAMOND PANELS — the geometric lozenge shapes
                visible on the wall panels between arch springing points.
                In the photo: octagonal/diamond insets in slightly darker
                stone on the wall face beside each arch.
            ════════════════════════════════════════════════════════ */}
            {/* Left spandrel panel */}
            {[
              [138, 92], [138, 120], [138, 148], [138, 172],
            ].map(([x, y], i) => (
              <g key={`ls${i}`}>
                <polygon
                  points={`${x},${y - 12} ${x + 12},${y} ${x},${y + 12} ${x - 12},${y}`}
                  fill="none" stroke="white" strokeWidth="1.1" opacity="0.28"
                />
                <polygon
                  points={`${x},${y - 7} ${x + 7},${y} ${x},${y + 7} ${x - 7},${y}`}
                  fill="white" opacity="0.06"
                />
              </g>
            ))}
            {/* Right spandrel panel (mirror) */}
            {[
              [562, 92], [562, 120], [562, 148], [562, 172],
            ].map(([x, y], i) => (
              <g key={`rs${i}`}>
                <polygon
                  points={`${x},${y - 12} ${x + 12},${y} ${x},${y + 12} ${x - 12},${y}`}
                  fill="none" stroke="white" strokeWidth="1.1" opacity="0.28"
                />
                <polygon
                  points={`${x},${y - 7} ${x + 7},${y} ${x},${y + 7} ${x - 7},${y}`}
                  fill="white" opacity="0.06"
                />
              </g>
            ))}

            {/* ════════════════════════════════════════════════════════
                PILASTER COLUMNS — vertical white marble piers at the
                arch springing points (where arches meet the wall).
            ════════════════════════════════════════════════════════ */}
            {/* Outer columns (arch 1 springers) */}
            <rect x="80" y="115" width="18" height="80" rx="9" fill="white" opacity="0.52" />
            <rect x="602" y="115" width="18" height="80" rx="9" fill="white" opacity="0.52" />
            {/* Inner columns (arch 2 springers) */}
            <rect x="173" y="148" width="13" height="47" rx="6" fill="white" opacity="0.38" />
            <rect x="514" y="148" width="13" height="47" rx="6" fill="white" opacity="0.38" />

            {/* ════════════════════════════════════════════════════════
                CENTRAL DOME MEDALLION
                The ornamental boss at the vault crown — based on the
                8-pointed star + floral botanical panels of Tashkent
                Metro station ceiling ornament.
                Colors: cobalt (#0D2464) ribs, dark teal (#1A7060)
                leaf forms, light ground (#E8F5FC).
            ════════════════════════════════════════════════════════ */}
            {/* Soft outer halo — diffuse glow ring */}
            <circle cx="350" cy="57" r="58" fill="white" opacity="0.14" />

            {/* Medallion ground disc */}
            <circle cx="350" cy="57" r="47" fill="#EAF6FD" opacity="0.96" />
            <circle cx="350" cy="57" r="47" fill="none" stroke="white" strokeWidth="3.5" />
            {/* Inner border ring */}
            <circle cx="350" cy="57" r="43" fill="none" stroke="#3A88B0" strokeWidth="0.8" opacity="0.4" />

            {/* 8 main structural ribs — like the vault ribs of the dome */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
              const rad = (a - 90) * Math.PI / 180
              return (
                <line key={`mr${a}`}
                  x1={350 + Math.cos(rad) * 10} y1={57 + Math.sin(rad) * 10}
                  x2={350 + Math.cos(rad) * 44} y2={57 + Math.sin(rad) * 44}
                  stroke="#0D2464" strokeWidth="1.4" opacity="0.68"
                />
              )
            })}

            {/* 8 secondary ribs (half-way between main ribs) */}
            {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((a) => {
              const rad = (a - 90) * Math.PI / 180
              return (
                <line key={`sr${a}`}
                  x1={350 + Math.cos(rad) * 20} y1={57 + Math.sin(rad) * 20}
                  x2={350 + Math.cos(rad) * 40} y2={57 + Math.sin(rad) * 40}
                  stroke="#0D2464" strokeWidth="0.8" opacity="0.45"
                />
              )
            })}

            {/* Outer ring: 8 botanical leaf forms (the floral panels of the dome) */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
              const rad = (a - 90) * Math.PI / 180
              const cx = 350 + Math.cos(rad) * 34
              const cy = 57 + Math.sin(rad) * 34
              return (
                <g key={`lf${a}`} transform={`rotate(${a}, ${cx}, ${cy})`}>
                  {/* Outer leaf — dark teal, wider */}
                  <ellipse cx={cx} cy={cy} rx="4.5" ry="8"
                           fill="#1A7060" opacity="0.78" />
                  {/* Inner leaf highlight */}
                  <ellipse cx={cx} cy={cy} rx="2" ry="4.5"
                           fill="#30B090" opacity="0.45" />
                </g>
              )
            })}

            {/* Middle ring: 8 smaller diamonds at secondary rib tips */}
            {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((a) => {
              const rad = (a - 90) * Math.PI / 180
              const cx = 350 + Math.cos(rad) * 24
              const cy = 57 + Math.sin(rad) * 24
              return (
                <polygon key={`md${a}`}
                  transform={`translate(${cx}, ${cy})`}
                  points="0,-4.5 3.5,0 0,4.5 -3.5,0"
                  fill="#0D2464" opacity="0.6"
                />
              )
            })}

            {/* Inner ring: connecting arc between main rib bases */}
            <circle cx="350" cy="57" r="10" fill="none" stroke="#0D2464" strokeWidth="1.2" opacity="0.55" />

            {/* Inner 8-pointed star — the khatam at the vault crown */}
            <polygon
              transform="translate(350, 57)"
              points="0,-8.5 2,-2 8.5,0 2,2 0,8.5 -2,2 -8.5,0 -2,-2"
              fill="#0D2464" opacity="0.8"
            />

            {/* Center gem */}
            <circle cx="350" cy="57" r="4"   fill="#0D2464" />
            <circle cx="350" cy="57" r="2.2" fill="#2EB5BC" />
            <circle cx="350" cy="57" r="0.9" fill="white" opacity="0.9" />

            {/* ════════════════════════════════════════════════════════
                BOTTOM TRANSITION LINE — the gold rule separating the
                vault illustration from the white text area below.
            ════════════════════════════════════════════════════════ */}
            <line x1="0" y1="193" x2="700" y2="193" stroke="#C8960A" strokeWidth="1.5" opacity="0.45" />
          </svg>

          {/* ── Text content — white area below the vault ── */}
          <div style={{ padding: '20px 28px 26px', display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, letterSpacing: '0.4em', fontWeight: 700, textTransform: 'uppercase', color: '#2EB5BC' }}>
                Cars · Motorcycles
              </span>
              <span style={{ fontSize: 10, color: '#C8960A' }}>◆</span>
              <span style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#2EB5BC', opacity: 0.75 }}>
                AI Quote Analysis
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(1.9rem, 5vw, 3rem)',
              fontWeight: 700,
              color: '#0D2464',
              lineHeight: 1.15,
              margin: 0,
              letterSpacing: '-0.01em',
            }}>
              Know if your repair<br />quote is fair.
            </h1>

            {/* Info chips label */}
            <p style={{
              fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase',
              color: '#C8960A', margin: '2px 0 2px', fontWeight: 700,
            }}>
              ◆ For the sharpest analysis, include ◆
            </p>

            {/* Info chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                { label: 'Year · Make · Model', sub: 'e.g. 2019 Toyota Camry' },
                { label: 'Damage type',         sub: 'collision, wear, mechanical' },
                { label: 'Services quoted',     sub: 'parts & labor listed' },
                { label: 'City or state',       sub: 'affects local pricing' },
                { label: 'Quoted price',        sub: 'total or line items' },
              ].map(({ label, sub }) => (
                <div key={label} style={{
                  background: '#FFFFFF',
                  border: '1px solid #C8960A',
                  outline: '2px solid rgba(200,150,10,0.11)',
                  outlineOffset: 2,
                  padding: '6px 13px',
                  borderRadius: 3,
                  fontSize: 11,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}>
                  <span style={{ color: '#0D2464', fontWeight: 700 }}>{label}</span>
                  <span style={{ color: '#4A6A8A', fontSize: 10 }}>{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* ── CHAT PANEL ────────────────────────────────────────────────
            A white niche (taq) set in the ivory wall, framed in gold
            with manuscript corner-bracket ornaments at each corner.
        ─────────────────────────────────────────────────────────────── */}
        <motion.div
          style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'visible', position: 'relative' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          {/* Manuscript corner ornaments — "kosheh" brackets */}
          <CornerOrnament position="tl" />
          <CornerOrnament position="tr" />
          <CornerOrnament position="bl" />
          <CornerOrnament position="br" />

          {/* Gold frame */}
          <div style={{
            border: '2px solid #C8960A',
            borderRadius: 3,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            background: '#FFFFFF',
            boxShadow: '0 0 0 5px rgba(200,150,10,0.09), 0 10px 48px rgba(13,36,100,0.09)',
          }}>
            {/* Panel header strip — cobalt dado rail */}
            <div style={{
              background: '#0D2464',
              borderBottom: '1px solid #C8960A',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              {/* Small 8-pointed star flanking the title — the khatam motif inline */}
              <svg viewBox="0 0 16 16" width="12" height="12" style={{ flex: 'none', opacity: 0.6 }}>
                <polygon
                  points="8,1 9.1,5.3 13.1,3.2 11,7.2 15,8 11,8.8 13.1,12.8 9.1,10.7 8,15 6.9,10.7 2.9,12.8 5,8.8 1,8 5,7.2 2.9,3.2 6.9,5.3"
                  fill="#C8960A"
                />
              </svg>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #C8960A 40%, #C8960A 60%, transparent)' }} />
              <span style={{ color: '#C8960A', fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', fontWeight: 700 }}>
                QuoteCheck AI
              </span>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #C8960A 40%, #C8960A 60%, transparent)' }} />
              <svg viewBox="0 0 16 16" width="12" height="12" style={{ flex: 'none', opacity: 0.6 }}>
                <polygon
                  points="8,1 9.1,5.3 13.1,3.2 11,7.2 15,8 11,8.8 13.1,12.8 9.1,10.7 8,15 6.9,10.7 2.9,12.8 5,8.8 1,8 5,7.2 2.9,3.2 6.9,5.3"
                  fill="#C8960A"
                />
              </svg>
            </div>

            {/* Messages area — clean white interior */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              background: '#FFFFFF',
            }}>
              <AnimatePresence>
                {messages.map(message => (
                  <ChatBubble
                    key={message.id}
                    message={message}
                    isUser={message.isUser}
                    userClass=""
                    botClass=""
                    userStyle={{
                      background: '#0D2464',
                      color: '#F5EFE0',
                      borderRadius: 4,
                      border: '1px solid rgba(200,150,10,0.35)',
                    }}
                    botStyle={{
                      background: '#F0F7F8',
                      color: '#0D2464',
                      borderRadius: 4,
                      borderLeft: '3px solid #2EB5BC',
                      border: '1px solid rgba(46,181,188,0.22)',
                      borderLeftColor: '#2EB5BC',
                      borderLeftWidth: 3,
                    }}
                  />
                ))}
              </AnimatePresence>

              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    style={{ display: 'flex', justifyContent: 'flex-start' }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div style={{
                      background: '#F0F7F8',
                      borderLeft: '3px solid #2EB5BC',
                      border: '1px solid rgba(46,181,188,0.22)',
                      borderLeftColor: '#2EB5BC',
                      borderLeftWidth: 3,
                      borderRadius: 4,
                      padding: '10px 16px',
                    }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {[
                          { bg: '#C8960A', delay: 0 },
                          { bg: '#0D2464', delay: 0.15 },
                          { bg: '#2EB5BC', delay: 0.3 },
                        ].map(({ bg, delay }) => (
                          <motion.div
                            key={bg}
                            style={{ width: 7, height: 7, borderRadius: '50%', background: bg }}
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input tray — warm ivory step at the base of the niche */}
            <div style={{
              background: '#F5EFE0',
              borderTop: '1px solid rgba(200,150,10,0.5)',
              padding: '14px 18px',
            }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe the vehicle, damage, location, and any total…"
                  style={{
                    flex: 1,
                    background: '#FFFFFF',
                    border: '1px solid rgba(200,150,10,0.6)',
                    borderRadius: 3,
                    padding: '10px 16px',
                    color: '#0D2464',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
                <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>
                  <Button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    style={{
                      background: '#0D2464',
                      border: '1px solid rgba(200,150,10,0.6)',
                      borderRadius: 3,
                      width: 44,
                      height: 44,
                      padding: 0,
                      cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                      opacity: inputValue.trim() ? 1 : 0.38,
                    }}
                  >
                    <Send style={{ width: 18, height: 18, color: '#F5EFE0' }} />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Caption */}
        <motion.div
          ref={footerNoteRef}
          style={{
            textAlign: 'center',
            background: 'rgba(255,255,255,0.72)',
            border: '1px solid rgba(200,150,10,0.25)',
            borderRadius: 3,
            padding: '8px 16px',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p style={{ fontSize: 11, color: 'rgba(13,36,100,0.36)', margin: 0, letterSpacing: '0.02em' }}>
            AI-powered analysis for bodywork &amp; mechanical estimates — built for fast decisions.
          </p>
        </motion.div>

        <About />

        <Footer
          style={{
            background: '#0D2464',
            border: '1px solid rgba(200,150,10,0.5)',
            borderRadius: 3,
            marginTop: 0,
          }}
          textStyle={{ color: '#F5EFE0' }}
          mutedStyle={{ color: '#C8B87A' }}
        />
      </div>
    </div>
  )
}
