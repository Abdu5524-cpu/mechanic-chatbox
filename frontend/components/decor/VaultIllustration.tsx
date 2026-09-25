// Header vault artwork, moved verbatim from the original page component.
export default function VaultIllustration() {
  return (
          <svg aria-hidden="true"
            viewBox="0 0 700 195"
            width="100%"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block' }}
          >
            <defs>
              {/*
                Sky-blue vault background — lighter at center (dome glow),
                deeper at the outer edges, exactly as in the photo.
              */}
              <radialGradient id="vault-sky" cx="50%" cy="30%" r="68%">
                <stop offset="0%"   stopColor="#DCF0FA" />
                <stop offset="38%"  stopColor="#A8CEDF" />
                <stop offset="100%" stopColor="#5A90B4" />
              </radialGradient>
              {/* Extra glow centred on the dome medallion */}
              <radialGradient id="dome-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#A8CEDF" stopOpacity="0" />
              </radialGradient>
              {/* Gentle white inner-arch fill — the lit vault cell interior */}
              <radialGradient id="inner-vault" cx="50%" cy="0%" r="100%">
                <stop offset="0%"   stopColor="#EAF6FE" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#A8CEDF" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Vault background */}
            <rect width="700" height="195" fill="url(#vault-sky)" />

            {/* Dome halo — bright circular light from the medallion */}
            <ellipse cx="350" cy="58" rx="230" ry="140" fill="url(#dome-glow)" />

            {/* ════════════════════════════════════════════════════════
                VAULT WEBBING — the curved panels between arch bays.
                In a groined vault each bay has two curved webs that
                meet at a ridge rib. Shown as subtle light fills.
            ════════════════════════════════════════════════════════ */}
            {/* Left bay web (arch1 → arch2, left half) */}
            <path d="M 95,195 C 95,110 183,60 350,25 C 280,55 183,110 183,195 Z"
                  fill="white" opacity="0.06" />
            {/* Right bay web */}
            <path d="M 605,195 C 605,110 517,60 350,25 C 420,55 517,110 517,195 Z"
                  fill="white" opacity="0.06" />

            {/* ════════════════════════════════════════════════════════
                CROSS-RIBS — the characteristic X rib pattern in each
                vault bay, going from springer to springer diagonally.
                These are the thin white curved lines that create the
                geometric lattice on the vault ceiling in the photo.
            ════════════════════════════════════════════════════════ */}
            {/* Left bay: arch1-L (95,195) ↗ toward arch2 apex shoulder */}
            <path d="M 95,195 C 130,130 230,60 350,25"
                  fill="none" stroke="white" strokeWidth="1.6" opacity="0.38" />
            {/* Left bay: arch2-L (183,195) ↗ toward far arch (arch1-L shoulder) */}
            <path d="M 183,195 C 170,140 140,85 95,50"
                  fill="none" stroke="white" strokeWidth="1.4" opacity="0.32" />
            {/* Right bay: arch1-R (605,195) ↗ toward arch2 apex shoulder */}
            <path d="M 605,195 C 570,130 470,60 350,25"
                  fill="none" stroke="white" strokeWidth="1.6" opacity="0.38" />
            {/* Right bay: arch2-R (517,195) ↗ toward arch1-R shoulder */}
            <path d="M 517,195 C 530,140 560,85 605,50"
                  fill="none" stroke="white" strokeWidth="1.4" opacity="0.32" />
            {/* Inner left bay ribs (arch2↔arch3) */}
            <path d="M 183,195 C 205,135 280,75 350,46"
                  fill="none" stroke="white" strokeWidth="1.2" opacity="0.26" />
            <path d="M 248,195 C 232,148 200,100 183,72"
                  fill="none" stroke="white" strokeWidth="1.1" opacity="0.22" />
            {/* Inner right bay ribs (arch2↔arch3) */}
            <path d="M 517,195 C 495,135 420,75 350,46"
                  fill="none" stroke="white" strokeWidth="1.2" opacity="0.26" />
            <path d="M 452,195 C 468,148 500,100 517,72"
                  fill="none" stroke="white" strokeWidth="1.1" opacity="0.22" />

            {/* ════════════════════════════════════════════════════════
                ARCHES — 6 arches from foreground to vanishing point.
                Each successive arch is: ~30% narrower and its apex
                ~18px higher (closer to top), with progressively
                thinner white border stroke.
                All arch paths: M x1,195 C x1,ctrl mid,apex 350,apex_y
                                         C 350,apex_y mid,ctrl x2,195
            ════════════════════════════════════════════════════════ */}

            {/* Arch 6 — deepest / smallest (barely a sliver) */}
            <path d="M 328,195 C 328,162 344,100 350,100 C 356,100 372,162 372,195"
                  fill="none" stroke="white" strokeWidth="3.5" opacity="0.45" />

            {/* Arch 5 */}
            <path d="M 312,195 C 312,152 336,84 350,84 C 364,84 388,152 388,195"
                  fill="none" stroke="white" strokeWidth="5" opacity="0.55" />

            {/* Arch 4 */}
            <path d="M 287,195 C 287,135 328,67 350,67 C 372,67 413,135 413,195"
                  fill="none" stroke="white" strokeWidth="7" opacity="0.65" />

            {/* Arch 3 */}
            <path d="M 247,195 C 247,118 314,46 350,46 C 386,46 453,118 453,195"
                  fill="none" stroke="white" strokeWidth="10" opacity="0.75" />
            {/* Arch 3 inner edge shadow — gives the marble border its depth */}
            <path d="M 257,195 C 257,123 318,54 350,54 C 382,54 443,123 443,195"
                  fill="none" stroke="#78AEC8" strokeWidth="1" opacity="0.3" />

            {/* Arch 2 */}
            <path d="M 182,195 C 182,100 294,25 350,25 C 406,25 518,100 518,195"
                  fill="none" stroke="white" strokeWidth="14" opacity="0.87" />
            {/* Arch 2 inner edge */}
            <path d="M 196,195 C 196,108 300,37 350,37 C 400,37 504,108 504,195"
                  fill="none" stroke="#6AA4C0" strokeWidth="1.5" opacity="0.35" />

            {/* Arch 1 — foreground, largest, dominant white marble border */}
            <path d="M 93,195 C 93,80 274,5 350,5 C 426,5 607,80 607,195"
                  fill="none" stroke="white" strokeWidth="20" opacity="0.95" />
            {/* Arch 1 inner shadow line — the recessed edge of the marble moulding */}
            <path d="M 113,195 C 113,90 282,20 350,20 C 418,20 587,90 587,195"
                  fill="none" stroke="#5A9AB8" strokeWidth="2" opacity="0.4" />
            {/* Arch 1 outer shadow — the other edge */}
            <path d="M 73,195 C 73,70 265,-8 350,-8 C 435,-8 627,70 627,195"
                  fill="none" stroke="#3A7090" strokeWidth="2" opacity="0.2" />

            {/* ════════════════════════════════════════════════════════
                SIDE ARCHES — the platform wall niches visible left
                and right of frame in the photo. Partial arches
                at the very edge of the frame suggesting depth.
            ════════════════════════════════════════════════════════ */}
            <path d="M 0,195 C 0,130 38,75 60,55 C 72,100 93,160 93,195"
                  fill="none" stroke="white" strokeWidth="9" opacity="0.52" />
            <path d="M 700,195 C 700,130 662,75 640,55 C 628,100 607,160 607,195"
                  fill="none" stroke="white" strokeWidth="9" opacity="0.52" />

            {/* ════════════════════════════════════════════════════════
                SPANDREL DIAMOND PANELS — the geometric lozenge shapes
                visible on the wall panels between arch springing points.
                In the photo: octagonal/diamond insets in slightly darker
                stone on the wall face beside each arch.
            ════════════════════════════════════════════════════════ */}
            {/* Left spandrel panel */}
            {[
              [138, 92], [138, 120], [138, 148], [138, 172],
            ].map(([x, y], i) => (
              <g key={`ls${i}`}>
                <polygon
                  points={`${x},${y - 12} ${x + 12},${y} ${x},${y + 12} ${x - 12},${y}`}
                  fill="none" stroke="white" strokeWidth="1.1" opacity="0.28"
                />
                <polygon
                  points={`${x},${y - 7} ${x + 7},${y} ${x},${y + 7} ${x - 7},${y}`}
                  fill="white" opacity="0.06"
                />
              </g>
            ))}
            {/* Right spandrel panel (mirror) */}
            {[
              [562, 92], [562, 120], [562, 148], [562, 172],
            ].map(([x, y], i) => (
              <g key={`rs${i}`}>
                <polygon
                  points={`${x},${y - 12} ${x + 12},${y} ${x},${y + 12} ${x - 12},${y}`}
                  fill="none" stroke="white" strokeWidth="1.1" opacity="0.28"
                />
                <polygon
                  points={`${x},${y - 7} ${x + 7},${y} ${x},${y + 7} ${x - 7},${y}`}
                  fill="white" opacity="0.06"
                />
              </g>
            ))}

            {/* ════════════════════════════════════════════════════════
                PILASTER COLUMNS — vertical white marble piers at the
                arch springing points (where arches meet the wall).
            ════════════════════════════════════════════════════════ */}
            {/* Outer columns (arch 1 springers) */}
            <rect x="80" y="115" width="18" height="80" rx="9" fill="white" opacity="0.52" />
            <rect x="602" y="115" width="18" height="80" rx="9" fill="white" opacity="0.52" />
            {/* Inner columns (arch 2 springers) */}
            <rect x="173" y="148" width="13" height="47" rx="6" fill="white" opacity="0.38" />
            <rect x="514" y="148" width="13" height="47" rx="6" fill="white" opacity="0.38" />

            {/* ════════════════════════════════════════════════════════
                CENTRAL DOME MEDALLION
                The ornamental boss at the vault crown — based on the
                8-pointed star + floral botanical panels of Tashkent
                Metro station ceiling ornament.
                Colors: cobalt (#0D2464) ribs, dark teal (#1A7060)
                leaf forms, light ground (#E8F5FC).
            ════════════════════════════════════════════════════════ */}
            {/* Soft outer halo — diffuse glow ring */}
            <circle cx="350" cy="57" r="58" fill="white" opacity="0.14" />

            {/* Medallion ground disc */}
            <circle cx="350" cy="57" r="47" fill="#EAF6FD" opacity="0.96" />
            <circle cx="350" cy="57" r="47" fill="none" stroke="white" strokeWidth="3.5" />
            {/* Inner border ring */}
            <circle cx="350" cy="57" r="43" fill="none" stroke="#3A88B0" strokeWidth="0.8" opacity="0.4" />

            {/* 8 main structural ribs — like the vault ribs of the dome */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
              const rad = (a - 90) * Math.PI / 180
              return (
                <line key={`mr${a}`}
                  x1={350 + Math.cos(rad) * 10} y1={57 + Math.sin(rad) * 10}
                  x2={350 + Math.cos(rad) * 44} y2={57 + Math.sin(rad) * 44}
                  stroke="#0D2464" strokeWidth="1.4" opacity="0.68"
                />
              )
            })}

            {/* 8 secondary ribs (half-way between main ribs) */}
            {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((a) => {
              const rad = (a - 90) * Math.PI / 180
              return (
                <line key={`sr${a}`}
                  x1={350 + Math.cos(rad) * 20} y1={57 + Math.sin(rad) * 20}
                  x2={350 + Math.cos(rad) * 40} y2={57 + Math.sin(rad) * 40}
                  stroke="#0D2464" strokeWidth="0.8" opacity="0.45"
                />
              )
            })}

            {/* Outer ring: 8 botanical leaf forms (the floral panels of the dome) */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
              const rad = (a - 90) * Math.PI / 180
              const cx = 350 + Math.cos(rad) * 34
              const cy = 57 + Math.sin(rad) * 34
              return (
                <g key={`lf${a}`} transform={`rotate(${a}, ${cx}, ${cy})`}>
                  {/* Outer leaf — dark teal, wider */}
                  <ellipse cx={cx} cy={cy} rx="4.5" ry="8"
                           fill="#1A7060" opacity="0.78" />
                  {/* Inner leaf highlight */}
                  <ellipse cx={cx} cy={cy} rx="2" ry="4.5"
                           fill="#30B090" opacity="0.45" />
                </g>
              )
            })}

            {/* Middle ring: 8 smaller diamonds at secondary rib tips */}
            {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((a) => {
              const rad = (a - 90) * Math.PI / 180
              const cx = 350 + Math.cos(rad) * 24
              const cy = 57 + Math.sin(rad) * 24
              return (
                <polygon key={`md${a}`}
                  transform={`translate(${cx}, ${cy})`}
                  points="0,-4.5 3.5,0 0,4.5 -3.5,0"
                  fill="#0D2464" opacity="0.6"
                />
              )
            })}

            {/* Inner ring: connecting arc between main rib bases */}
            <circle cx="350" cy="57" r="10" fill="none" stroke="#0D2464" strokeWidth="1.2" opacity="0.55" />

            {/* Inner 8-pointed star — the khatam at the vault crown */}
            <polygon
              transform="translate(350, 57)"
              points="0,-8.5 2,-2 8.5,0 2,2 0,8.5 -2,2 -8.5,0 -2,-2"
              fill="#0D2464" opacity="0.8"
            />

            {/* Center gem */}
            <circle cx="350" cy="57" r="4"   fill="#0D2464" />
            <circle cx="350" cy="57" r="2.2" fill="#2EB5BC" />
            <circle cx="350" cy="57" r="0.9" fill="white" opacity="0.9" />

            {/* ════════════════════════════════════════════════════════
                BOTTOM TRANSITION LINE — the gold rule separating the
                vault illustration from the white text area below.
            ════════════════════════════════════════════════════════ */}
            <line x1="0" y1="193" x2="700" y2="193" stroke="#C8960A" strokeWidth="1.5" opacity="0.45" />
          </svg>
  )
}
