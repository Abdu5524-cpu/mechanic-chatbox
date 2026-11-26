import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type ChatBubbleProps = {
  role: 'user' | 'bot'
  time: string
  isError?: boolean
  children: ReactNode
}

const TONES = {
  user: 'border border-saffron/35 bg-lapis text-parchment',
  bot: 'border border-firoza/20 border-l-[3px] border-l-firoza bg-[#F0F7F8] text-lapis',
  error: 'border border-red-200 border-l-[3px] border-l-red-500 bg-red-50 text-red-900',
}

export default function ChatBubble({ role, time, isError = false, children }: ChatBubbleProps) {
  const isUser = role === 'user'
  const tone = isUser ? TONES.user : isError ? TONES.error : TONES.bot

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className={`max-w-[85%] rounded px-4 py-3 text-sm shadow-lg ${tone}`}>
        {children}
        {time && <div className="mt-2 text-[10px] opacity-60">{time}</div>}
      </div>
    </motion.div>
  )
}
