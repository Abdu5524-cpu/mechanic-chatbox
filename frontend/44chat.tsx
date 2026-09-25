'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import About from './components/About'
import ChatBubble from './components/chat/ChatBubble'
import Footer from './components/Footer'
import CornerOrnament from './components/decor/CornerOrnament'
import StarTileBackground from './components/decor/StarTileBackground'
import MonumentIllustrations from './components/decor/MonumentIllustrations'
import OrnamentBands from './components/decor/OrnamentBands'
import HeroHeader from './components/HeroHeader'

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

      <StarTileBackground />
      <MonumentIllustrations />
      <OrnamentBands />

      {/* ════════════════════════════════════════════════════════════════════
          PAGE CONTENT — the open courtyard between ornate portals
      ════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-col min-h-screen max-w-3xl mx-auto px-6 gap-10"
           style={{ paddingTop: 80, paddingBottom: 80 }}>

        <HeroHeader />

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
