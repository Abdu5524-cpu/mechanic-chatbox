import VaultIllustration from './decor/VaultIllustration'

const TIPS = [
  { label: 'Year · Make · Model', sub: 'e.g. 2019 Toyota Camry' },
  { label: 'Damage type', sub: 'collision, wear, mechanical' },
  { label: 'Services quoted', sub: 'parts & labor listed' },
  { label: 'City or state', sub: 'affects local pricing' },
  { label: 'Quoted price', sub: 'total or line items' },
]

export default function HeroHeader() {
  return (
    <header className="overflow-hidden rounded border border-saffron/45 bg-white shadow-[0_2px_16px_rgba(13,36,100,0.07)]">
      <VaultIllustration />
      <div className="flex flex-col gap-3 px-5 pb-6 pt-5 sm:px-7">
        <div className="flex items-center gap-2 text-[10px] uppercase text-firoza">
          <span className="font-bold tracking-[0.4em]">Cars · Trucks · Motorcycles</span>
          <span aria-hidden="true" className="text-saffron">◆</span>
          <span className="tracking-[0.3em] opacity-75">AI Quote Analysis</span>
        </div>
        <h1 className="m-0 text-[clamp(1.9rem,5vw,3rem)] font-bold leading-[1.15] tracking-[-0.01em] text-lapis">
          Know if your repair<br />quote is fair.
        </h1>
        <p className="my-0.5 text-[10px] font-bold uppercase tracking-[0.35em] text-saffron">
          ◆ For the sharpest analysis, include ◆
        </p>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {TIPS.map(({ label, sub }) => (
            <li
              key={label}
              className="flex flex-col gap-0.5 rounded-[3px] border border-saffron bg-white px-3 py-1.5 text-[11px] outline-2 outline-offset-2 outline-saffron/10"
            >
              <span className="font-bold text-lapis">{label}</span>
              <span className="text-[10px] text-[#4A6A8A]">{sub}</span>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
