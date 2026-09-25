export default function About() {
  return (
    <section style={{
      maxWidth: 896,
      margin: '0 auto',
      padding: '28px 32px',
      background: '#FFFFFF',
      border: '1px solid rgba(200,150,10,0.45)',
      borderRadius: 4,
      boxShadow: '0 2px 16px rgba(13,36,100,0.06)',
    }}>
      {/* Section heading with gold rule — like a manuscript chapter heading */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 'none', width: 4, height: 28, background: '#2EB5BC', borderRadius: 2 }} />
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0D2464', margin: 0 }}>
          What This Is
        </h2>
      </div>

      <p style={{ fontSize: '1rem', lineHeight: 1.75, color: '#2D3748', marginBottom: 16 }}>
        QuoteCheck AI is an independent tool that helps vehicle owners make sense of repair
        estimates. Paste any mechanic quote — cars, trucks, motorcycles — and the AI returns
        a structured breakdown with typical price ranges and a plain-language risk read.
      </p>
      <p style={{ fontSize: '1rem', lineHeight: 1.75, color: '#2D3748', marginBottom: 16 }}>
        The goal is transparency: you should know whether a quote is in the ballpark before
        you sign anything. No up-selling, no shop affiliation — just a second opinion powered
        by real-world pricing data.
      </p>
      <p style={{ fontSize: '1rem', lineHeight: 1.75, color: '#2D3748' }}>
        Works best when you include the vehicle year, make, and model; the specific damage or
        service; your city or region; and the total quoted. The more detail you give, the
        sharper the analysis.
      </p>
    </section>
  )
}
