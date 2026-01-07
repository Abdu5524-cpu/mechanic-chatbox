'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import ChatMessage from './ChatMessage'

type Msg = { role: 'user' | 'assistant' | 'system'; content: string; file?: string }

export default function QuoteForm() {
  // Chat state: running transcript exchanged with the model
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('') // raw user text before it is sent to the API

  // Error banner content (form + chat)
  const [error, setError] = useState<string | null>(null)

  // Ref to auto-scroll to the bottom when messages change
  const endRef = useRef<HTMLDivElement | null>(null)

  // Keep the chat scrolled to the latest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Call the analyze-quote endpoint with a single `userText` payload.
  // The backend responds with a parsed schema object (or an error).
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

    const payload = data.parsed ?? data // normalize to a single object shape for display
    return payload

  }

  // Send the current chatbox contents to the backend.
  const handleSend = async () => {
    if (!input.trim()) return
    setError(null)

    const userText = input.trim()
    const userMsg: Msg = { role: 'user', content: userText }
    const pending = [...messages, userMsg]
    setMessages(pending)
    setInput('')

    try {
      const reply = await callAnalyzeAPI(userText)
      setMessages([...pending, { role: 'assistant', content: reply }])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send message.'
      setError(message)
    }
  }

  // Allow Enter to send (Shift+Enter for newline)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ------------------------------
  // Render
  // ------------------------------
  return (
    <section className="px-4 py-10 bg-gray-50">
      <div className="max-w-[40rem] mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
        <header className="mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Analyze Your Quote</h2>
          <p className="text-sm text-gray-600 mt-1">
            Paste a quote or describe the car, damage, and location. I’ll parse it into a clean breakdown.
          </p>
        </header>

        {/* Messages scroll area */}
        <div className="h-96 overflow-y-auto rounded-xl border border-gray-200 p-4 bg-gray-50">
          {messages.map((m, i) => (
            <div key={i} className="mb-3">
              <ChatMessage message={m} />
            </div>
          ))}
          {error && (
            <div className="text-xs text-red-600 mt-2">{error}</div>
          )}
          <div ref={endRef} />
        </div>

        {/* Composer */}
        <div className="mt-4 flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. 2018 Toyota Camry, rear bumper dent, Austin TX. Quote total $1,250."
            rows={2}
            className="flex-1 resize-none rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <Button
            type="button"
            onClick={handleSend}
            className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2 text-white text-sm font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            Send
          </Button>
        </div>
      </div>
    </section>
  )
}
