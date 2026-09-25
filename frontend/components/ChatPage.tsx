import About from './About'
import Footer from './Footer'
import HeroHeader from './HeroHeader'
import ChatPanel from './chat/ChatPanel'
import MonumentIllustrations from './decor/MonumentIllustrations'
import OrnamentBands from './decor/OrnamentBands'
import StarTileBackground from './decor/StarTileBackground'

export default function ChatPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-parchment">
      <StarTileBackground />
      <MonumentIllustrations />
      <OrnamentBands />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-4 py-20 sm:px-6">
        <HeroHeader />
        <ChatPanel />
        <p className="m-0 rounded-[3px] border border-saffron/25 bg-white/70 px-4 py-2 text-center text-[11px] tracking-[0.02em] text-lapis/60">
          AI-powered analysis for bodywork &amp; mechanical estimates. Informational only; get a second opinion for major repairs.
        </p>
        <About />
        <Footer />
      </main>
    </div>
  )
}
