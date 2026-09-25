export default function Contact() {
  return (
    <section style={{ maxWidth: 896, margin: '0 auto', padding: '16px 16px 8px' }}>
      {/* Section heading with teal accent bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 'none', width: 4, height: 24, background: '#C8960A', borderRadius: 2 }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#F5EFE0', margin: 0 }}>
          Built by
        </h2>
      </div>

      <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(245,239,224,0.75)', marginBottom: 12 }}>
        QuoteCheck AI is a portfolio project by Abdu Uralov. Source code and other projects
        are available on GitHub.
      </p>

      <p style={{ fontSize: '0.95rem', color: 'rgba(245,239,224,0.75)' }}>
        <strong style={{ color: '#C8960A', fontWeight: 600 }}>GitHub: </strong>
        <a
          href="https://github.com/Abdu5524-cpu"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#2EB5BC', textDecoration: 'underline', textUnderlineOffset: 3 }}
        >
          github.com/Abdu5524-cpu
        </a>
      </p>
    </section>
  )
}
