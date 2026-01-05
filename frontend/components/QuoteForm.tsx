'use client' // Next.js directive: marks this component to run on the client (enables hooks, event handlers, etc.)

// React hooks for state, refs, and side effects
import { useState, useRef, useEffect } from 'react'

// shadcn/ui primitives
// Button: clickable trigger & actions
import { Button } from '@/components/ui/button'
// Popover: floating dropdown container
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
// Command: command-palette-style list (input + results)
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

// Icons from lucide-react for visual cues
import { ChevronsUpDown, Check } from 'lucide-react'
import ChatMessage from './ChatMessage'

// ------------------------------
// Types shared across the file
// ------------------------------
// Chat message shape sent to/received from your /api/chat endpoint
type Msg = { role: 'user' | 'assistant' | 'system'; content: string; file?: string }

// Your form fields: keep this small for V1
type FormData = { car: string; part: string; damage: string }

// Props for the CarCombobox component (controlled input)
// - value: current selected text
// - onChange: parent setter when a value is picked/created
// - placeholder: UI hint before selection
type CarComboboxProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

// A small, curated starter list — good fallback when server suggestions aren’t available
const POPULAR_CARS = [
  'Toyota Camry',
  'Toyota Corolla',
  'Honda Civic',
  'Honda Accord',
  'Tesla Model 3',
  'Tesla Model Y',
  'Ford F-150',
  'Ford Explorer',
  'Chevrolet Silverado',
  'Chevrolet Malibu',
  'Nissan Altima',
  'Nissan Rogue',
  'Hyundai Elantra',
  'Hyundai Sonata',
  'Kia Optima',
  'Kia Forte',
  'BMW 3 Series',
  'BMW 5 Series',
  'Mercedes C-Class',
  'Audi A4',
]

// -------------------------------------------------------
// CarCombobox: shadcn/ui Popover + Command = Combobox
// - Controlled by `value` and `onChange`
// - Suggest-as-you-type: calls /api/car-suggest with debounce
// - Allows custom (free text) when no results
// -------------------------------------------------------
function CarCombobox({ value, onChange, placeholder = 'Search make/model…' }: CarComboboxProps) {
  // Option B: Local list + Command's built-in fuzzy filtering
  // - No network requests, no debounce, no AbortController
  // - Fastest path to move on to backend wiring

  // Whether the dropdown is open
  const [open, setOpen] = useState(false)

  // When a user selects a value
  const selectValue = (val: string) => {
    onChange(val)
    setOpen(false)
  }

  return (
    // Popover is the dropdown shell; controlled with `open`
    <Popover open={open} onOpenChange={setOpen}>
      {/* Trigger Button shows current selection or placeholder */}
      <PopoverTrigger asChild>
        <Button
          id="car" // tie the label htmlFor="car" to this trigger for a11y & click focus
          onClick={() => setOpen((o) => !o)} // explicit toggle; Radix also calls onOpenChange, this ensures it opens

          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate max-w-[85%] text-left">
            {value ? value : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      {/* Match the width of the trigger. If this var form fails in your setup, use w-[var(--radix-popover-trigger-width)]. */}
      <PopoverContent forceMount side="bottom" align="start" className="z-[9999] w-[var(--radix-popover-trigger-width)] p-0 bg-white border border-gray-200 shadow-md data-[state=open]:opacity-100 opacity-100">
        {/* Command provides input + keyboard nav + built-in fuzzy filtering */}
        <Command>
          {/* Uncontrolled input: Command handles filtering internally */}
          <CommandInput placeholder={placeholder} autoFocus />

          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Popular">
              {POPULAR_CARS.map((c) => {
                const selected = c === value
                return (
                  <CommandItem
                    key={c}
                    value={c}
                    onSelect={() => selectValue(c)}
                    className="cursor-pointer"
                  >
                    {/* Visual cue for selection; opacity keeps alignment consistent */}
                    <Check className={`mr-2 h-4 w-4 ${selected ? 'opacity-100' : 'opacity-0'}`} />
                    {c}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// -------------------------------------------------------
// QuoteForm: Form → Chat handoff
// - Shows a form first
// - On submit, composes a first user message and calls /api/chat
// - Switches UI into a simple chat with message bubbles
// -------------------------------------------------------
export default function QuoteForm() {
  // Form state
  const [formData, setFormData] = useState<FormData>({ car: '', part: '', damage: '' })

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false) // submit spinner/disabled
  const [isChatting, setIsChatting] = useState(false) // toggles between form and chat views

  // Chat state: running transcript exchanged with the model
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('') // chatbox input

  // Error banner content (form + chat)
  const [error, setError] = useState<string | null>(null)

  // Ref to auto-scroll to the bottom when messages change
  const endRef = useRef<HTMLDivElement | null>(null)

  // Keep the chat scrolled to the latest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isChatting])

  // Generic onChange for text inputs (part, damage)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Compose the very first message from the form values
  const composeFirstMessage = (data: FormData) =>
    `Hi! I need a quick bodywork estimate for a car.

Car: ${data.car}
Affected part: ${data.part}
Damage: ${data.damage}.

Please ask any follow-up questions and give a ballpark cost range with parts/labor separated for a mechanic shop in Brooklyn, NY in 2025 market rates.`

  // Call the analyze quote endpoint. Expects { userText } -> returns { success, parsed }.
  const callAnalyzeAPI = async (userText: string) => {
    const res = await fetch('/api/analyzeQuote', {
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
    return `\`\`\`json\n${JSON.stringify(payload, null, 2)}\n\`\`\``
  }

  // Form submit → kick off chat with a composed first user message
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    // Minimal client validation
    if (!formData.car || !formData.part || !formData.damage) {
      setError('Please fill out all fields.')
      return
    }

    setIsSubmitting(true)

    const userText = composeFirstMessage(formData)
    const firstUser: Msg = { role: 'user', content: userText }
    const newMsgs = [firstUser]

    try {
      const reply = await callAnalyzeAPI(userText)
      setMessages([...newMsgs, { role: 'assistant', content: reply }])
      setIsChatting(true) // swap to chat view
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Send a follow-up message from the chat input
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
    } catch (err: any) {
      setError(err?.message || 'Failed to send message.')
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
        {/* View 1: Intake form */}
        {!isChatting ? (
          <>
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-gray-800">
              Need Some Bodywork Done? Get a Quick Quote!
            </h2>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Car field: Combobox (server-suggest + creatable) */}
              <div>
                <label htmlFor="car" className="block text-sm font-medium text-gray-700 mb-1">
                  Car Make & Model
                </label>
                <CarCombobox
                  value={formData.car}
                  onChange={(val) => setFormData((p) => ({ ...p, car: val }))}
                  placeholder="e.g. Toyota Camry"
                />
                <p className="mt-1 text-xs text-gray-500">You can pick from suggestions or press Enter to use your custom entry.</p>
              </div>

              {/* Text input: affected part */}
              <div>
                <label htmlFor="part" className="block text-sm font-medium text-gray-700 mb-1">
                  Affected Part
                </label>
                <input
                  type="text"
                  name="part"
                  id="part"
                  value={formData.part}
                  onChange={handleChange}
                  placeholder="e.g. bumper, door, fender"
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Text input: damage description */}
              <div>
                <label htmlFor="damage" className="block text-sm font-medium text-gray-700 mb-1">
                  Describe the Damage
                </label>
                <input
                  type="text"
                  name="damage"
                  id="damage"
                  value={formData.damage}
                  onChange={handleChange}
                  placeholder="e.g. dent, scratch, cracked panel"
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit button: starts the chat handoff */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isSubmitting ? 'Getting your quote…' : 'Get a Quote'}
                </Button>
              </div>
            </form>
          </>
        ) : (
          // View 2: Simple chat UI
          <>
            <header className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Your Quote Chat</h3>
              <button
                onClick={() => {
                  setIsChatting(false)
                  setMessages([])
                }}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Start over
              </button>
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
              <div ref={endRef} /> {/* anchor for auto-scroll */}
            </div>

            {/* Composer */}
            <div className="mt-4 flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a follow-up, share photos link, or request a breakdown…"
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
          </>
        )}
      </div>
    </section>
  )
}
