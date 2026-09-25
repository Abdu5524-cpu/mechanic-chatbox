export default function About() {
  return (
    <section
      aria-labelledby="about-heading"
      className="rounded border border-saffron/45 bg-white px-6 py-7 shadow-[0_2px_16px_rgba(13,36,100,0.06)] sm:px-8"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="h-7 w-1 flex-none rounded-sm bg-firoza" />
        <h2 id="about-heading" className="m-0 text-2xl font-bold text-lapis">
          What This Is
        </h2>
      </div>
      <div className="space-y-4 text-base leading-7 text-ink">
        <p>
          QuoteCheck AI helps vehicle owners make sense of repair estimates. Paste any mechanic quote (cars, trucks,
          motorcycles) and it returns a structured breakdown, the typical price range for that repair, and a
          plain-language risk read.
        </p>
        <p>
          Prices are researched live on the web for your region, so you know whether a quote is in the ballpark
          before you sign anything. No up-selling and no shop affiliation: just a second opinion.
        </p>
        <p>
          It works best when you include the vehicle year, make, and model; the specific damage or service; your city
          or region; and the total quoted.
        </p>
      </div>
    </section>
  )
}
