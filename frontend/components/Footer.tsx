const LINK = 'text-firoza underline underline-offset-[3px] hover:text-parchment'

export default function Footer() {
  return (
    <footer className="rounded-[3px] border border-saffron/50 bg-lapis px-6 py-6 text-parchment">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1 flex-none rounded-sm bg-saffron" />
          <h2 className="m-0 text-xl font-bold">Built by Abdu Uralov</h2>
        </div>
        <p className="text-[0.95rem] leading-relaxed text-parchment/75">
          A portfolio project: a Next.js front end and an Express API that uses Claude to parse repair quotes and
          research typical local prices.
        </p>
        <p className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
          <a href="https://github.com/Abdu5524-cpu" target="_blank" rel="noopener noreferrer" className={LINK}>
            GitHub profile
          </a>
          <a href="https://github.com/Abdu5524-cpu/mechanic-chatbox" target="_blank" rel="noopener noreferrer" className={LINK}>
            Source code
          </a>
        </p>
        <p className="pt-2 text-center text-xs text-[#C8B87A]">
          QuoteCheck AI is informational only and not a substitute for a professional inspection.
        </p>
      </div>
    </footer>
  )
}
