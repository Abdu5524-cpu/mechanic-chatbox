'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import About from './components/About'
import VehicleDecorations from './components/chat/VehicleDecorations'
import ChatBubble from './components/chat/ChatBubble'
import Footer from './components/Footer'

type Theme = {
  id: string
  name: string
  bg: string
  panel: string
  panelBorder: string
  accent: string
  accentSoft: string
  optionBg: string
  optionText: string
  railGradient: string
  railGlow: string
  inputText: string
  inputPlaceholder: string
  bubbleUser: string
  bubbleBot: string
}

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

const THEMES: Theme[] = [
  {
    id: 'track',
    name: 'Track Day',
    bg: 'from-orange-500 via-rose-500 to-amber-400',
    panel: 'bg-white/10',
    panelBorder: 'border-white/20',
    accent: 'text-orange-100',
    accentSoft: 'text-orange-50/80',
    optionBg: 'bg-gradient-to-r from-orange-600 to-rose-600',
    optionText: 'text-white',
    railGradient: 'linear-gradient(135deg, #ff6a00, #ff2d55)',
    railGlow: 'rgba(255, 90, 0, 0.4)',
    inputText: 'text-white',
    inputPlaceholder: 'placeholder:text-white/50',
    bubbleUser: 'bg-white/90 text-slate-900',
    bubbleBot: 'bg-black/80 text-white',
  },
  {
    id: 'chrome',
    name: 'Chrome Wave',
    bg: 'from-sky-500 via-cyan-500 to-indigo-500',
    panel: 'bg-white/12',
    panelBorder: 'border-white/25',
    accent: 'text-sky-100',
    accentSoft: 'text-sky-50/80',
    optionBg: 'bg-gradient-to-r from-sky-600 to-cyan-600',
    optionText: 'text-white',
    railGradient: 'linear-gradient(135deg, #0ea5e9, #22d3ee)',
    railGlow: 'rgba(56, 189, 248, 0.4)',
    inputText: 'text-white',
    inputPlaceholder: 'placeholder:text-white/50',
    bubbleUser: 'bg-white/90 text-slate-900',
    bubbleBot: 'bg-slate-900/80 text-white',
  },
  {
    id: 'rally',
    name: 'Desert Rally',
    bg: 'from-amber-500 via-teal-500 to-emerald-500',
    panel: 'bg-white/12',
    panelBorder: 'border-white/25',
    accent: 'text-amber-50',
    accentSoft: 'text-amber-50/70',
    optionBg: 'bg-gradient-to-r from-amber-500 to-emerald-500',
    optionText: 'text-white',
    railGradient: 'linear-gradient(135deg, #f59e0b, #10b981)',
    railGlow: 'rgba(16, 185, 129, 0.35)',
    inputText: 'text-white',
    inputPlaceholder: 'placeholder:text-white/50',
    bubbleUser: 'bg-white/90 text-slate-900',
    bubbleBot: 'bg-slate-900/75 text-white',
  },
  {
    id: 'nightshift',
    name: 'Night Shift',
    bg: 'from-slate-900 via-indigo-900 to-black',
    panel: 'bg-slate-900/60',
    panelBorder: 'border-emerald-400/30',
    accent: 'text-emerald-200',
    accentSoft: 'text-emerald-100/80',
    optionBg: 'bg-gradient-to-r from-emerald-500 to-cyan-500',
    optionText: 'text-slate-900',
    railGradient: 'linear-gradient(135deg, #10b981, #22d3ee)',
    railGlow: 'rgba(16, 185, 129, 0.3)',
    inputText: 'text-white',
    inputPlaceholder: 'placeholder:text-white/50',
    bubbleUser: 'bg-emerald-100 text-slate-900',
    bubbleBot: 'bg-slate-950 text-white',
  },
]

const initialMessages: Message[] = [
  {
    id: 1,
    content: 'Paste a repair quote or describe the vehicle, damage, and location.',
    isUser: false,
    time: 'Now',
  },
]

export default function Chat() {
  const [themeId, setThemeId] = useState(THEMES[0].id)
  const theme = useMemo(() => THEMES.find(t => t.id === themeId) || THEMES[0], [themeId])
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
    const quoteRange = rangeMin !== null && rangeMin !== undefined && rangeMax !== null && rangeMax !== undefined
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

  return (
    <div className={`min-h-screen relative overflow-hidden bg-gradient-to-br ${theme.bg}`}>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,0,0,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_60%)]" />
      </div>

      <VehicleDecorations />

      <div className="relative z-10 flex flex-col min-h-screen max-w-4xl mx-auto px-4 py-8 gap-6">
        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`text-xs font-semibold tracking-[0.4em] ${theme.accent}`}>CARS · MOTORCYCLES</span>
            <span className={`text-xs ${theme.accentSoft}`}>Quote Analysis Lab</span>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className={`text-4xl sm:text-5xl font-semibold ${theme.accent}`}>
              Fast quote clarity, tuned for the road.
            </h1>
            <p className={`max-w-2xl text-sm sm:text-base ${theme.accentSoft}`}>
              Drop in estimate text or describe the job. We return a structured summary, a typical range, and a risk read.
            </p>
          </div>
        </header>

        <section className="flex flex-wrap gap-3">
          {THEMES.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setThemeId(t.id)}
              className={`rounded-full px-5 py-2 text-sm font-semibold shadow-lg transition ${
                t.id === theme.id
                  ? `${t.optionBg} ${t.optionText} ring-2 ring-white/70`
                  : `${t.optionBg} ${t.optionText} opacity-80 hover:opacity-100 hover:shadow-xl`
              }`}
            >
              {t.name}
            </button>
          ))}
        </section>

        <motion.div
          className={`flex-1 ${theme.panel} backdrop-blur-xl rounded-3xl border ${theme.panelBorder} shadow-2xl overflow-hidden flex flex-col`}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            <AnimatePresence>
              {messages.map(message => (
                <ChatBubble
                  key={message.id}
                  message={message}
                  isUser={message.isUser}
                  userClass={theme.bubbleUser}
                  botClass={theme.bubbleBot}
                />
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl rounded-bl-md px-5 py-3 shadow-lg">
                    <div className="flex gap-1.5">
                      <motion.div
                        className="w-2 h-2 bg-purple-500 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-pink-500 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-orange-500 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          <div className="p-4 border-t border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe the vehicle, damage, location, and any total..."
                  className={`w-full bg-white/10 border border-white/20 ${theme.inputText} ${theme.inputPlaceholder} rounded-full px-5 py-6 focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all`}
                />
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white rounded-full w-12 h-12 p-0 shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          ref={footerNoteRef}
          className="text-center mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className={`text-xs ${theme.accentSoft}`}>
            🚗 Bodywork & mechanical estimates 🏍️ — built for fast decisions.
          </p>
        </motion.div>

        <About />

        <Footer
          backgroundClassName={`${theme.panel} backdrop-blur-xl`}
          borderClassName={theme.panelBorder}
          textClassName={theme.accent}
          mutedTextClassName={theme.accentSoft}
        />
      </div>
    </div>
  )
}
