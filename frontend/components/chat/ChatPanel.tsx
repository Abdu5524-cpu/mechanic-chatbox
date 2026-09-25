'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Send } from 'lucide-react'
import ChatBubble from './ChatBubble'
import QuoteResultCard from './QuoteResultCard'
import CornerOrnament from '../decor/CornerOrnament'
import { analyzeQuote } from '@/lib/api'
import type { ChatMessage } from '@/lib/quoteTypes'

const MIN_LEN = 10
const MAX_LEN = 4000

const EXAMPLES = [
  '2019 Honda Civic, front bumper crack and repaint. San Diego, CA. Shop quoted $1,800.',
  '2015 Ford F-150, replace front brake pads and rotors. Austin, TX. Quote total: $650.',
  '2021 Yamaha MT-07, new chain and sprockets plus labor. Denver, CO. Quoted $420.',
]

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'bot',
  time: '', // no timestamp: avoids a server/client hydration mismatch
  text: 'Paste a repair quote or describe the vehicle, damage, location, and price.',
}

const DOTS = [
  { bg: 'bg-saffron', delay: 0 },
  { bg: 'bg-lapis', delay: 0.15 },
  { bg: 'bg-firoza', delay: 0.3 },
] as const

const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

function StarIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" className="flex-none opacity-60" aria-hidden="true">
      <polygon
        points="8,1 9.1,5.3 13.1,3.2 11,7.2 15,8 11,8.8 13.1,12.8 9.1,10.7 8,15 6.9,10.7 2.9,12.8 5,8.8 1,8 5,7.2 2.9,3.2 6.9,5.3"
        fill="#C8960A"
      />
    </svg>
  )
}

function TypingIndicator() {
  return (
    <motion.div className="flex justify-start" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex items-center gap-3 rounded border border-firoza/20 border-l-[3px] border-l-firoza bg-[#F0F7F8] px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          {DOTS.map(({ bg, delay }) => (
            <motion.div
              key={bg}
              className={`size-[7px] rounded-full ${bg}`}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, delay }}
            />
          ))}
        </div>
        <span className="text-xs text-lapis/70">Researching local prices; this can take up to 30 seconds…</span>
      </div>
    </motion.div>
  )
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, isLoading])

  const trimmed = input.trim()
  const canSend = trimmed.length >= MIN_LEN && !isLoading
  const hint =
    trimmed.length > 0 && trimmed.length < MIN_LEN
      ? 'Add a bit more detail: vehicle, damage, and price.'
      : `${input.length} / ${MAX_LEN}`

  async function send(text: string) {
    const userText = text.trim()
    if (userText.length < MIN_LEN || userText.length > MAX_LEN || isLoading) return

    setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'user', time: now(), text: userText }])
    setInput('')
    setIsLoading(true)
    try {
      const analysis = await analyzeQuote(userText)
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'bot', time: now(), analysis }])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'bot', time: now(), text: message, isError: true }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.section
      aria-label="Quote analyzer chat"
      className="relative flex flex-col"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
    >
      <CornerOrnament position="tl" />
      <CornerOrnament position="tr" />
      <CornerOrnament position="bl" />
      <CornerOrnament position="br" />

      <div className="flex flex-col overflow-hidden rounded-[3px] border-2 border-saffron bg-white shadow-[0_0_0_5px_rgba(200,150,10,0.09),0_10px_48px_rgba(13,36,100,0.09)]">
        <div className="flex items-center gap-2 border-b border-saffron bg-lapis px-4 py-2">
          <StarIcon />
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-saffron to-transparent" />
          <span className="text-[9px] font-bold uppercase tracking-[0.45em] text-saffron">QuoteCheck AI</span>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-saffron to-transparent" />
          <StarIcon />
        </div>

        <div
          ref={listRef}
          role="log"
          aria-live="polite"
          className="flex max-h-[60vh] min-h-80 flex-col gap-3.5 overflow-y-auto bg-white px-4 py-5 sm:px-6"
        >
          <AnimatePresence initial={false}>
            {messages.map(m => (
              <ChatBubble key={m.id} role={m.role} time={m.time} isError={m.isError}>
                {m.analysis ? <QuoteResultCard analysis={m.analysis} /> : <p className="m-0 whitespace-pre-wrap">{m.text}</p>}
              </ChatBubble>
            ))}
          </AnimatePresence>
          <AnimatePresence>{isLoading && <TypingIndicator />}</AnimatePresence>
        </div>

        {messages.length === 1 && !isLoading && (
          <div className="flex flex-wrap gap-2 border-t border-saffron/20 bg-white px-4 py-3 sm:px-6">
            <span className="w-full text-[10px] font-bold uppercase tracking-[0.3em] text-saffron">Try an example</span>
            {EXAMPLES.map(example => (
              <button
                key={example}
                type="button"
                onClick={() => void send(example)}
                className="rounded-[3px] border border-firoza/40 bg-[#F0F7F8] px-3 py-1.5 text-left text-xs text-lapis hover:border-firoza"
              >
                {example}
              </button>
            ))}
          </div>
        )}

        <form
          className="border-t border-saffron/50 bg-parchment px-4 py-3.5"
          onSubmit={e => {
            e.preventDefault()
            void send(input)
          }}
        >
          <label htmlFor="quote-input" className="sr-only">
            Describe your repair quote
          </label>
          <div className="flex items-end gap-2.5">
            <textarea
              id="quote-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault()
                  void send(input)
                }
              }}
              rows={2}
              maxLength={MAX_LEN}
              disabled={isLoading}
              placeholder="Describe the vehicle, damage, location, and quoted total… (Shift+Enter for a new line)"
              className="max-h-40 min-h-11 flex-1 resize-y rounded-[3px] border border-saffron/60 bg-white px-4 py-2.5 text-[13px] text-lapis outline-none focus-visible:ring-2 focus-visible:ring-firoza disabled:opacity-60"
            />
            <motion.button
              type="submit"
              disabled={!canSend}
              aria-label="Analyze quote"
              whileHover={canSend ? { scale: 1.06 } : undefined}
              whileTap={canSend ? { scale: 0.94 } : undefined}
              className="flex size-11 flex-none items-center justify-center rounded-[3px] border border-saffron/60 bg-lapis text-parchment disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="size-[18px]" aria-hidden="true" />
            </motion.button>
          </div>
          <p className="mb-0 mt-1.5 text-right text-[10px] text-lapis/60" aria-live="polite">
            {hint}
          </p>
        </form>
      </div>
    </motion.section>
  )
}
