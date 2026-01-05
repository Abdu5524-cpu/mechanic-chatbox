import type { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Car, User, FileText } from 'lucide-react';

type ChatRole = 'user' | 'assistant' | 'system';

type ChatMessageData = {
  role: ChatRole;
  content: string;
  file?: string;
};

type ChatMessageProps = {
  message: ChatMessageData;
};

type MarkdownChildProps = { children?: ReactNode };

export default function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
        >
            {/* Avatar */}
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isUser 
                    ? 'bg-gradient-to-br from-slate-200 to-slate-300' 
                    : 'bg-gradient-to-br from-slate-800 to-slate-900'
            }`}>
                {isUser ? (
                    <User className="h-4 w-4 text-slate-600" />
                ) : (
                    <Car className="h-4 w-4 text-white" />
                )}
            </div>

            {/* Message Content */}
            <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`rounded-2xl px-4 py-3 ${
                    isUser 
                        ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-tr-md' 
                        : 'bg-white shadow-sm border border-slate-200/80 rounded-tl-md'
                }`}>
                    {message.file && (
                        <div className={`flex items-center gap-2 text-xs mb-2 pb-2 border-b ${
                            isUser ? 'border-slate-700 text-slate-300' : 'border-slate-100 text-slate-500'
                        }`}>
                            <FileText className="h-3 w-3" />
                            <span className="truncate">{message.file}</span>
                        </div>
                    )}
                    
                    {isUser ? (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    ) : (
                        <div className="prose prose-sm prose-slate max-w-none">
                            <ReactMarkdown
                                components={{
                                    h1: ({ children }: MarkdownChildProps) => (
                                        <h1 className="text-base font-semibold text-slate-900 mt-4 mb-2 first:mt-0">{children}</h1>
                                    ),
                                    h2: ({ children }: MarkdownChildProps) => (
                                        <h2 className="text-sm font-semibold text-slate-900 mt-3 mb-1.5">{children}</h2>
                                    ),
                                    h3: ({ children }: MarkdownChildProps) => (
                                        <h3 className="text-sm font-medium text-slate-800 mt-2 mb-1">{children}</h3>
                                    ),
                                    p: ({ children }: MarkdownChildProps) => (
                                        <p className="text-sm text-slate-700 leading-relaxed my-2">{children}</p>
                                    ),
                                    ul: ({ children }: MarkdownChildProps) => (
                                        <ul className="my-2 ml-4 space-y-1">{children}</ul>
                                    ),
                                    ol: ({ children }: MarkdownChildProps) => (
                                        <ol className="my-2 ml-4 space-y-1 list-decimal">{children}</ol>
                                    ),
                                    li: ({ children }: MarkdownChildProps) => (
                                        <li className="text-sm text-slate-700 leading-relaxed">{children}</li>
                                    ),
                                    strong: ({ children }: MarkdownChildProps) => (
                                        <strong className="font-semibold text-slate-900">{children}</strong>
                                    ),
                                    em: ({ children }: MarkdownChildProps) => (
                                        <em className="text-slate-600">{children}</em>
                                    ),
                                    code: ({ children }: MarkdownChildProps) => (
                                        <code className="px-1.5 py-0.5 bg-slate-100 rounded text-xs text-slate-700">{children}</code>
                                    ),
                                    blockquote: ({ children }: MarkdownChildProps) => (
                                        <blockquote className="border-l-2 border-emerald-500 pl-3 my-2 text-slate-600 italic">
                                            {children}
                                        </blockquote>
                                    ),
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
