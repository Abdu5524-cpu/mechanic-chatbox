// Decorative artwork, moved verbatim from the original page component.
export default function MonumentIllustrations() {
  return (
    <div aria-hidden="true">
      {/* ════════════════════════════════════════════════════════════════════
          BACKGROUND ARCHITECTURAL ILLUSTRATIONS
          SVG illustrations of iconic Uzbek monuments placed as flanking
          panels in the page margins. Visible but not dominant — they
          establish the sense of place without competing with content.

          Left:  Kalon Minaret, Bukhara (12th c.) — the tallest pre-Mongol
                 minaret in Central Asia, with 14 ornamental brick bands.
          Right: Gur-e-Amir Mausoleum, Samarkand (1404) — Timur's tomb,
                 with the iconic tall ribbed melon dome on a blue drum.
      ════════════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none hidden xl:block" style={{ zIndex: 2 }}>

        {/* ── KALON MINARET (left) ──────────────────────────────────── */}
        <div style={{ position: 'absolute', left: '2%', top: '8%', opacity: 0.28 }}>
          <svg viewBox="0 0 80 480" width="80" height="480" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Shaft outline for clipping the ornamental bands */}
              <clipPath id="shaft-clip">
                <polygon points="13,438 67,438 59,96 21,96" />
              </clipPath>
              {/* Gallery outline for clipping window arches */}
              <clipPath id="gallery-clip">
                <rect x="15" y="44" width="50" height="54" />
              </clipPath>
            </defs>

            {/* ── Base plinth — two stepped levels ── */}
            <rect x="4"  y="453" width="72" height="14" rx="1" fill="#7A5030" />
            <rect x="8"  y="440" width="64" height="14" rx="1" fill="#8B6040" />
            <polygon points="13,440 67,440 64,426 16,426" fill="#8B6040" />

            {/* ── Main shaft — tapering polygon, warm terracotta brick ── */}
            <polygon points="13,438 67,438 59,96 21,96" fill="#9A6840" />

            {/* ── 14 ornamental bands clipped to shaft ── */}
            {/*
              The real Kalon Minaret has 14 bands of different patterns:
              carved terracotta bricks in geometric arrangements.
              Alternating: cobalt tile band / terracotta diamond band.
            */}
            <g clipPath="url(#shaft-clip)">
              {[438,412,386,360,334,308,282,256,230,204,178,152,126,100].map((y, i) => (
                <g key={y}>
                  {i % 2 === 0 ? (
                    /* Cobalt glazed-tile band — references the blue-tile rings visible in photos */
                    <>
                      <rect x="0" y={y - 9} width="80" height="9" fill="#0D2464" />
                      {/* Small white dot row inside cobalt band */}
                      {[8,16,24,32,40,48,56,64,72].map(x => (
                        <circle key={x} cx={x} cy={y - 4.5} r="1.6" fill="white" opacity="0.38" />
                      ))}
                    </>
                  ) : (
                    /* Terracotta diamond-pattern band */
                    <>
                      <rect x="0" y={y - 9} width="80" height="9" fill="#6A3818" opacity="0.7" />
                      {/* Diamond row */}
                      {[8,20,32,44,56,68].map(x => (
                        <polygon key={x} points={`${x},${y-9} ${x+6},${y-4.5} ${x},${y} ${x-6},${y-4.5}`}
                          fill="#C8960A" opacity="0.45" />
                      ))}
                    </>
                  )}
                </g>
              ))}
              {/* Prominent Kufic inscription band at the mid-shaft (~y=260) */}
              <rect x="0" y="248" width="80" height="14" fill="#0A1A50" />
              {[6,14,22,30,38,46,54,62,70].map(x => (
                <rect key={x} x={x} y="251" width="4" height={[8,5,8,6,8,5,7,8,5][x/8|0] || 7} fill="white" opacity="0.3" />
              ))}
            </g>
            {/* Shaft gold-rule outline */}
            <polygon points="13,438 67,438 59,96 21,96" fill="none" stroke="#C8960A" strokeWidth="0.6" opacity="0.35" />

            {/* ── Muqarnas corbel bracket above shaft ── */}
            {/* Step-bracket silhouette referencing the stalactite niche beneath the gallery */}
            <path d="M 21,96 L 17,86 L 14,78 L 18,72 L 21,68 L 24,64 L 28,60 L 40,56
                     L 52,60 L 56,64 L 59,68 L 62,72 L 66,78 L 63,86 L 59,96"
                  fill="#7A5030" />
            <path d="M 22,92 L 19,84 L 17,78 L 20,73 L 22,70 L 25,67 L 29,63 L 40,60
                     L 51,63 L 55,67 L 58,70 L 60,73 L 63,78 L 61,84 L 58,92"
                  fill="none" stroke="#C8960A" strokeWidth="0.5" opacity="0.4" />

            {/* ── Gallery / lantern — wider than shaft, with arched windows ── */}
            {/* Dark cobalt background */}
            <rect x="15" y="44" width="50" height="16" fill="#0D2464" />
            {/* Gallery rail with gold crenellations */}
            <rect x="15" y="40" width="50" height="6" fill="#0D2464" />
            {[17,21,25,29,33,37,41,45,49,53,57].map(x => (
              <rect key={x} x={x} y="36" width="3" height="6" fill="#C8960A" opacity="0.55" />
            ))}
            {/* 8 arched openings in the gallery */}
            <g clipPath="url(#gallery-clip)">
              {[17,23,29,35,41,47,53,59].map(x => (
                <path key={x}
                  d={`M ${x},60 L ${x},48 Q ${x + 3},42 ${x + 6},48 L ${x + 6},60 Z`}
                  fill="#F5EFE0" opacity="0.65"
                />
              ))}
            </g>
            {/* Gallery base line */}
            <line x1="15" y1="60" x2="65" y2="60" stroke="#C8960A" strokeWidth="0.8" opacity="0.5" />

            {/* ── Conical tiled cap — teal like the Bukharan dome caps ── */}
            <path d="M 15,44 Q 40,4 65,44 Z" fill="#2EB5BC" />
            {/* Rib lines on cap */}
            {[22,28,34,40,46,52,58].map(x => (
              <line key={x} x1={x} y1="44" x2="40" y2="6" stroke="rgba(13,36,100,0.18)" strokeWidth="0.7" />
            ))}
            <path d="M 15,44 Q 40,4 65,44" fill="none" stroke="#C8960A" strokeWidth="0.8" opacity="0.4" />

            {/* Finial */}
            <line x1="40" y1="6" x2="40" y2="-10" stroke="#C8960A" strokeWidth="1.5" />
            <circle cx="40" cy="-12" r="2.5" fill="#C8960A" />
          </svg>
        </div>

        {/* ── GUR-E-AMIR DOME (right) ────────────────────────────────── */}
        {/*
          Timur's mausoleum (1404), Samarkand. The ribbed turquoise melon
          dome on a tall cobalt drum is the defining image of Timurid
          architecture — prototype for the Taj Mahal's dome form.
        */}
        <div style={{ position: 'absolute', right: '2%', top: '18%', opacity: 0.28 }}>
          <svg viewBox="0 0 170 310" width="170" height="310" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Dome outline clip — tall pointed ogival profile */}
              <clipPath id="dome-clip">
                <path d="M 10,178 C 6,118 22,46 85,12 C 148,46 164,118 160,178 Z" />
              </clipPath>
            </defs>

            {/* ── Base step / platform ── */}
            <rect x="0"  y="292" width="170" height="10" rx="1" fill="#6A4020" opacity="0.6" />
            <rect x="5"  y="282" width="160" height="12" rx="1" fill="#7A5030" opacity="0.55" />

            {/* ── Drum (tall octagonal base of dome) — cobalt tiled ── */}
            {/*
              The real drum is tall (~12m) and octagonal with kufic inscription
              band at the top and arched niches/windows. Shown here simplified
              as a rectangle with cut corners (the visible 3 faces from front).
            */}
            {/* Cut-corner rectangle for octagonal drum */}
            <polygon
              points="18,282 152,282 162,270 162,202 152,190 18,190 8,202 8,270"
              fill="#0D2464"
            />
            {/* Drum highlight — lighter cobalt on left face (reflected light) */}
            <polygon points="8,202 8,270 18,282 18,190" fill="#1A3880" />
            {/* Four arched window niches on drum face */}
            {[36, 65, 94, 123].map(x => (
              <g key={x}>
                <rect x={x} y={220} width={16} height={36} rx="1" fill="#091840" />
                <path d={`M ${x},220 Q ${x + 8},210 ${x + 16},220`} fill="#091840" />
              </g>
            ))}
            {/* Kufic inscription band near drum top */}
            <rect x="8" y="192" width="154" height="12" fill="#091840" />
            {[12,20,28,36,44,52,60,68,76,84,92,100,108,116,124,132,140,148,156].map(x => (
              <rect key={x} x={x} y="194" width="3"
                height={[7,5,9,6,8,5,7,9,6,8,5,7,6,9,7,5,8,6,7][Math.floor(x/8) % 19] || 6}
                fill="white" opacity="0.22" />
            ))}
            {/* Gold rule at drum top and bottom */}
            <line x1="8" y1="190" x2="162" y2="190" stroke="#C8960A" strokeWidth="1.2" opacity="0.55" />
            <line x1="8" y1="282" x2="162" y2="282" stroke="#C8960A" strokeWidth="0.8" opacity="0.4" />

            {/* ── Short neck between drum and dome ── */}
            <rect x="55" y="175" width="60" height="18" fill="#0A1E50" />
            <line x1="55" y1="175" x2="115" y2="175" stroke="#C8960A" strokeWidth="0.9" opacity="0.45" />

            {/* ── Ribbed melon dome — the signature Timurid form ── */}
            {/*
              The Gur-e-Amir dome has ~64 ribs. Here 16 alternating strips
              (8 pairs of light/dark teal) are clipped to the ogival profile.
              The left ribs are slightly brighter (reflected sky light).
            */}
            {/* Base teal fill */}
            <path d="M 10,178 C 6,118 22,46 85,12 C 148,46 164,118 160,178 Z"
                  fill="#1A9080" />
            {/* 16 alternating rib strips */}
            <g clipPath="url(#dome-clip)">
              {Array.from({ length: 16 }, (_, i) => {
                const x = 10 + i * 9.375
                const isLight = i % 2 === 0
                /* Ribs on the left half are brighter (light source from left) */
                const brightness = i < 8
                  ? (isLight ? '#30C8B4' : '#1A9080')
                  : (isLight ? '#28B0A0' : '#127060')
                return (
                  <rect key={i} x={x} y={0} width={9.375} height={200}
                        fill={brightness} />
                )
              })}
              {/* Highlight on leftmost ribs — sky reflection */}
              <rect x="10" y="0" width="18" height="200" fill="white" opacity="0.07" />
              {/* Dark shadow on rightmost ribs */}
              <rect x="142" y="0" width="18" height="200" fill="#061830" opacity="0.15" />
            </g>
            {/* Dome outline — gold grout line */}
            <path d="M 10,178 C 6,118 22,46 85,12 C 148,46 164,118 160,178"
                  fill="none" stroke="#C8960A" strokeWidth="0.9" opacity="0.45" />

            {/* ── Finial — tall spike with crescent ── */}
            {/* Neck knob */}
            <circle cx="85" cy="14" r="5" fill="#C8960A" opacity="0.75" />
            {/* Spike */}
            <line x1="85" y1="14" x2="85" y2="-18" stroke="#C8960A" strokeWidth="2" />
            {/* Crescent */}
            <path d="M 80,-18 Q 85,-28 90,-18 Q 85,-22 80,-18 Z" fill="#C8960A" opacity="0.8" />
          </svg>
        </div>

        {/* ── SHAH-I-ZINDA PORTAL (lower, center-left) ─────────────────
            A faint ogival arch silhouette — the corridor of Shah-i-Zinda
            necropolis in Samarkand, famous for its cobalt and teal glazed
            portal facades. Placed low so it doesn't interfere with main content.
        ─────────────────────────────────────────────────────────────── */}
        <div style={{ position: 'absolute', left: '6%', bottom: '14%', opacity: 0.16 }}>
          <svg viewBox="0 0 120 180" width="120" height="180" xmlns="http://www.w3.org/2000/svg">
            {/* Portal rectangle frame */}
            <rect x="5" y="5" width="110" height="175" fill="none" stroke="#C8960A" strokeWidth="2" />
            <rect x="10" y="10" width="100" height="165" fill="none" stroke="#C8960A" strokeWidth="0.7" opacity="0.5" />
            {/* Cobalt spandrel field */}
            <path d="M 10,10 L 110,10 L 110,110 Q 110,70 60,58 Q 10,70 10,110 Z" fill="#0D2464" />
            {/* Scattered rosettes in spandrel */}
            {[[30,40],[60,28],[90,40],[25,72],[95,72]].map(([x,y],i) => (
              <g key={i} transform={`translate(${x},${y})`}>
                {[0,60,120].map(a => (
                  <ellipse key={a} rx="1" ry="4" fill="white" opacity="0.35"
                    transform={`rotate(${a})`} />
                ))}
                <circle r="1.8" fill="white" opacity="0.55" />
              </g>
            ))}
            {/* Arch opening — pointed iwan */}
            <path d="M 10,175 L 10,110 Q 10,70 60,58 Q 110,70 110,110 L 110,175 Z"
                  fill="#F5EFE0" />
            {/* Arch border */}
            <path d="M 10,110 Q 10,70 60,58 Q 110,70 110,110"
                  fill="none" stroke="#C8960A" strokeWidth="1.5" />
            {/* Tilework border band */}
            {[0,10,20,30,40,50,60,70,80,90,100].map(x => (
              <rect key={x} x={x + 5} y={5} width={5} height={5} fill="#2EB5BC" opacity={x%20===0 ? 0.5 : 0.25} />
            ))}
          </svg>
        </div>
      </div>
    </div>
  )
}
