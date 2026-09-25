// Decorative artwork, moved verbatim from the original page component.
export default function OrnamentBands() {
  return (
    <div aria-hidden="true">
      {/* ════════════════════════════════════════════════════════════════════
          TOP BORDER BAND — ISLIMI ARABESQUE VINE
          Based on the running vine border ("islimi qalam") found on:
          • The inner jambs of the Registan portals
          • Manuscript page borders from the Timurid scriptorium
          Structure: continuous S-curve vine with upward half-palmette
          flowers at arch peaks and downward teal leaves at troughs.
          Leaves spring directly from stems (no leaf-stalk) — the
          definitive stylistic feature of Uzbek vegetal ornament.
          Colors: cobalt ground, gold vine/flowers, teal leaves.
          NO rainbow gradient — authentic Timurid palette only.
      ════════════════════════════════════════════════════════════════════ */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none z-20">
        {/* Cobalt band with running islimi vine */}
        <svg width="100%" height="42" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            {/*
              Vine pattern unit — 60px wide, 42px tall.
              Vine midline y = 21. The cubic bezier S-curve:
                M 0,21  C 10,7  20,7  30,21   ← arch up (peak at x≈15, y≈9.5)
                         C 40,35 50,35  60,21   ← arch down (trough at x≈45, y≈32.5)
              Half-palmette (3 petals, central + two angled at ≈45°) at peak.
              Single leaf pair at trough.
              Small forking tendrils at midline crossing (x=30).
            */}
            <pattern id="islimi-top" x="0" y="0" width="60" height="42" patternUnits="userSpaceOnUse">
              {/* Cobalt ground */}
              <rect width="60" height="42" fill="#0D2464" />

              {/* Inner gold rules */}
              <line x1="0" y1="1.5" x2="60" y2="1.5" stroke="#C8960A" strokeWidth="0.7" opacity="0.5" />
              <line x1="0" y1="40.5" x2="60" y2="40.5" stroke="#C8960A" strokeWidth="0.7" opacity="0.5" />

              {/* Main vine stem — continuous S-curve */}
              <path d="M 0,21 C 10,7 20,7 30,21 C 40,35 50,35 60,21"
                    fill="none" stroke="#C8960A" strokeWidth="1.3" opacity="0.9" />

              {/* ── Upward half-palmette at arch peak (≈15, 9.5) ─── */}
              {/* Central petal pointing straight up */}
              <path d="M 15,13 C 13.2,10 13.2,5 15,2 C 16.8,5 16.8,10 15,13 Z"
                    fill="#C8960A" opacity="0.72" />
              {/* Left side petal at ~45° */}
              <path d="M 15,13 C 11.5,11 9.5,8 11,5.5 C 12.8,7.5 13.8,10.5 15,13 Z"
                    fill="#C8960A" opacity="0.55" />
              {/* Right side petal at ~45° */}
              <path d="M 15,13 C 18.5,11 20.5,8 19,5.5 C 17.2,7.5 16.2,10.5 15,13 Z"
                    fill="#C8960A" opacity="0.55" />
              {/* Small outer side petals (true half-palmette has 5 petals total) */}
              <path d="M 15,13 C 10,12 7.5,10 9,8 C 10.5,9.5 12,11 15,13 Z"
                    fill="#C8960A" opacity="0.35" />
              <path d="M 15,13 C 20,12 22.5,10 21,8 C 19.5,9.5 18,11 15,13 Z"
                    fill="#C8960A" opacity="0.35" />
              {/* Teal center calyx dot */}
              <circle cx="15" cy="13" r="2" fill="#2EB5BC" opacity="0.85" />

              {/* ── Downward leaf pair at arch trough (≈45, 32.5) ── */}
              {/* Leaves in teal — the contrasting foliage color of Timurid vine work */}
              {/* Central downward leaf */}
              <path d="M 45,28 C 43.2,31 43.2,36.5 45,39 C 46.8,36.5 46.8,31 45,28 Z"
                    fill="#2EB5BC" opacity="0.65" />
              {/* Left leaf */}
              <path d="M 45,28 C 41.5,26 39,27 40,30.5 C 41.5,29.5 43,28.5 45,28 Z"
                    fill="#2EB5BC" opacity="0.5" />
              {/* Right leaf */}
              <path d="M 45,28 C 48.5,26 51,27 50,30.5 C 48.5,29.5 47,28.5 45,28 Z"
                    fill="#2EB5BC" opacity="0.5" />
              {/* Gold center calyx dot */}
              <circle cx="45" cy="28" r="2" fill="#C8960A" opacity="0.85" />

              {/* ── Forking tendrils at midline crossing (x=30, y=21) */}
              {/* In islimi ornament, secondary stems fork off at vine joints */}
              <path d="M 30,21 C 27.5,18.5 25,17 27,15.5"
                    fill="none" stroke="#C8960A" strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />
              <path d="M 30,21 C 32.5,18.5 35,17 33,15.5"
                    fill="none" stroke="#C8960A" strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />
              {/* Small gold buds at tendril tips */}
              <circle cx="26.5" cy="15.5" r="1.3" fill="#C8960A" opacity="0.55" />
              <circle cx="33.5" cy="15.5" r="1.3" fill="#C8960A" opacity="0.55" />
            </pattern>
          </defs>
          <rect width="100%" height="42" fill="url(#islimi-top)" />
        </svg>

        {/* Second gold rule below the band */}
        <div style={{ height: 1, background: '#C8960A', opacity: 0.35 }} />
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          BOTTOM BORDER BAND — mirrored islimi (vine scrolls upward)
      ════════════════════════════════════════════════════════════════════ */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-20">
        <div style={{ height: 1, background: '#C8960A', opacity: 0.35 }} />
        <svg width="100%" height="42" xmlns="http://www.w3.org/2000/svg"
             preserveAspectRatio="xMidYMid slice"
             style={{ transform: 'scaleY(-1)' }}>
          <defs>
            <pattern id="islimi-bot" x="0" y="0" width="60" height="42" patternUnits="userSpaceOnUse">
              <rect width="60" height="42" fill="#0D2464" />
              <line x1="0" y1="1.5" x2="60" y2="1.5" stroke="#C8960A" strokeWidth="0.7" opacity="0.5" />
              <line x1="0" y1="40.5" x2="60" y2="40.5" stroke="#C8960A" strokeWidth="0.7" opacity="0.5" />
              <path d="M 0,21 C 10,7 20,7 30,21 C 40,35 50,35 60,21"
                    fill="none" stroke="#C8960A" strokeWidth="1.3" opacity="0.9" />
              <path d="M 15,13 C 13.2,10 13.2,5 15,2 C 16.8,5 16.8,10 15,13 Z" fill="#C8960A" opacity="0.72" />
              <path d="M 15,13 C 11.5,11 9.5,8 11,5.5 C 12.8,7.5 13.8,10.5 15,13 Z" fill="#C8960A" opacity="0.55" />
              <path d="M 15,13 C 18.5,11 20.5,8 19,5.5 C 17.2,7.5 16.2,10.5 15,13 Z" fill="#C8960A" opacity="0.55" />
              <path d="M 15,13 C 10,12 7.5,10 9,8 C 10.5,9.5 12,11 15,13 Z" fill="#C8960A" opacity="0.35" />
              <path d="M 15,13 C 20,12 22.5,10 21,8 C 19.5,9.5 18,11 15,13 Z" fill="#C8960A" opacity="0.35" />
              <circle cx="15" cy="13" r="2" fill="#2EB5BC" opacity="0.85" />
              <path d="M 45,28 C 43.2,31 43.2,36.5 45,39 C 46.8,36.5 46.8,31 45,28 Z" fill="#2EB5BC" opacity="0.65" />
              <path d="M 45,28 C 41.5,26 39,27 40,30.5 C 41.5,29.5 43,28.5 45,28 Z" fill="#2EB5BC" opacity="0.5" />
              <path d="M 45,28 C 48.5,26 51,27 50,30.5 C 48.5,29.5 47,28.5 45,28 Z" fill="#2EB5BC" opacity="0.5" />
              <circle cx="45" cy="28" r="2" fill="#C8960A" opacity="0.85" />
              <path d="M 30,21 C 27.5,18.5 25,17 27,15.5" fill="none" stroke="#C8960A" strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />
              <path d="M 30,21 C 32.5,18.5 35,17 33,15.5" fill="none" stroke="#C8960A" strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />
              <circle cx="26.5" cy="15.5" r="1.3" fill="#C8960A" opacity="0.55" />
              <circle cx="33.5" cy="15.5" r="1.3" fill="#C8960A" opacity="0.55" />
            </pattern>
          </defs>
          <rect width="100%" height="42" fill="url(#islimi-bot)" />
        </svg>
        <div style={{ height: 2, background: '#C8960A', opacity: 0.65 }} />
      </div>
    </div>
  )
}
