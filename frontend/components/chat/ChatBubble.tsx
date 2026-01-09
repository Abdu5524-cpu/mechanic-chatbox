import { motion } from 'framer-motion'

type Message = {
  id: number
  content: string
  isUser: boolean
  time: string
}

type ChatBubbleProps = {
  message: Message
  isUser: boolean
  userClass: string
  botClass: string
}

export default function ChatBubble({ message, isUser, userClass, botClass }: ChatBubbleProps) {
  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-lg whitespace-pre-wrap ${
          isUser ? `${userClass} rounded-br-sm` : `${botClass} rounded-bl-sm`
        }`}
      >
        <p>{message.content}</p>
        <div className="mt-2 text-[10px] opacity-60">{message.time}</div>
      </div>
    </motion.div>
  )
}
