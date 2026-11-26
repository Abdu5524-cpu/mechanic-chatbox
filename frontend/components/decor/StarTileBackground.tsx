// Decorative artwork, moved verbatim from the original page component.
export default function StarTileBackground() {
  return (
    <div aria-hidden="true">
      {/* ════════════════════════════════════════════════════════════════════
          BACKDROP — AUTHENTIC 8-POINTED STAR TILE (KHATAM)
          Based on the actual geometry of Timurid tilework:
          • Two overlapping squares (one rotated 45°) create the octagram
          • Inner radius = outer radius × tan(22.5°) ≈ outer × 0.4142
            (this is the exact ratio where inner points fall on the
             intersection lines of the two underlying squares)
          • Spaces between stars contain octagonal connector shapes
          • Stars placed on a 100×100 square grid; corners share
            quarter-stars between adjacent tiles
          Colors deliberately faint — these are the carved-plaster
          "muqarnas" texture of the wall, not the painted tile surface.
      ════════════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            {/*
              Octagram star polygon — 16 points alternating outer/inner.
              Outer radius = 30, inner radius = 12.43 (= 30 × tan 22.5°)
              All calculations for center at origin; offset per use.

              Outer points (r=30) at 0°, 45°, 90°... clockwise from top:
                0°:   (0, -30)
                45°:  (21.21, -21.21)
                90°:  (30, 0)
                135°: (21.21, 21.21)
                180°: (0, 30)
                225°: (-21.21, 21.21)
                270°: (-30, 0)
                315°: (-21.21, -21.21)

              Inner points (r=12.43) at 22.5°, 67.5°...
                22.5°:  (4.76, -11.46)
                67.5°:  (11.46, -4.76)
                112.5°: (11.46, 4.76)
                157.5°: (4.76, 11.46)
                202.5°: (-4.76, 11.46)
                247.5°: (-11.46, 4.76)
                292.5°: (-11.46, -4.76)
                337.5°: (-4.76, -11.46)
            */}
            {/* Center star — centered at (50,50) */}
            <polygon id="star8"
              points="50,20 54.76,38.54 71.21,28.79 61.46,45.24 80,50 61.46,54.76 71.21,71.21 54.76,61.46 50,80 45.24,61.46 28.79,71.21 38.54,54.76 20,50 38.54,45.24 28.79,28.79 45.24,38.54"
            />
            {/* Connector diamond — small 4-pointed star for mid-edge and cross connectors */}
            <polygon id="diamond4" points="0,-6 3.5,-3.5 6,0 3.5,3.5 0,6 -3.5,3.5 -6,0 -3.5,-3.5" />

            <pattern id="star-tile" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">

              {/* ── Center 8-pointed star ────────────────────────────── */}
              {/* Cobalt fill — the lapis lazuli blue of the interior tiles */}
              <polygon
                points="50,20 54.76,38.54 71.21,28.79 61.46,45.24 80,50 61.46,54.76 71.21,71.21 54.76,61.46 50,80 45.24,61.46 28.79,71.21 38.54,54.76 20,50 38.54,45.24 28.79,28.79 45.24,38.54"
                fill="#0D2464" fillOpacity="0.085" stroke="#C8960A" strokeWidth="0.7" strokeOpacity="0.22"
              />
              {/* Gold outline, slightly heavier — the tile grout line */}
              <polygon
                points="50,20 54.76,38.54 71.21,28.79 61.46,45.24 80,50 61.46,54.76 71.21,71.21 54.76,61.46 50,80 45.24,61.46 28.79,71.21 38.54,54.76 20,50 38.54,45.24 28.79,28.79 45.24,38.54"
                fill="none" stroke="#C8960A" strokeWidth="1.1" strokeOpacity="0.18"
              />
              {/* Center rosette — small circle with dot, the "shamsa" motif */}
              <circle cx="50" cy="50" r="7"   fill="none" stroke="#C8960A" strokeWidth="0.8" strokeOpacity="0.22" />
              <circle cx="50" cy="50" r="3.5" fill="#2EB5BC" fillOpacity="0.14" />
              <circle cx="50" cy="50" r="1.5" fill="#C8960A"  fillOpacity="0.28" />

              {/* ── Corner quarter-stars ─────────────────────────────── */}
              {/* Teal fill — firoza turquoise of the outer tile fields   */}
              {/* Top-left corner: star centered at (0,0)   */}
              <polygon
                points="0,-30 4.76,-11.46 21.21,-21.21 11.46,-4.76 30,0 11.46,4.76 21.21,21.21 4.76,11.46 0,30 -4.76,11.46 -21.21,21.21 -11.46,4.76 -30,0 -11.46,-4.76 -21.21,-21.21 -4.76,-11.46"
                fill="#2EB5BC" fillOpacity="0.07" stroke="#C8960A" strokeWidth="0.8" strokeOpacity="0.17"
              />
              {/* Top-right corner: star centered at (100,0) */}
              <polygon
                points="100,-30 104.76,-11.46 121.21,-21.21 111.46,-4.76 130,0 111.46,4.76 121.21,21.21 104.76,11.46 100,30 95.24,11.46 78.79,21.21 88.54,4.76 70,0 88.54,-4.76 78.79,-21.21 95.24,-11.46"
                fill="#2EB5BC" fillOpacity="0.07" stroke="#C8960A" strokeWidth="0.8" strokeOpacity="0.17"
              />
              {/* Bottom-left corner: star centered at (0,100) */}
              <polygon
                points="0,70 4.76,88.54 21.21,78.79 11.46,95.24 30,100 11.46,104.76 21.21,121.21 4.76,111.46 0,130 -4.76,111.46 -21.21,121.21 -11.46,104.76 -30,100 -11.46,95.24 -21.21,78.79 -4.76,88.54"
                fill="#2EB5BC" fillOpacity="0.07" stroke="#C8960A" strokeWidth="0.8" strokeOpacity="0.17"
              />
              {/* Bottom-right corner: star centered at (100,100) */}
              <polygon
                points="100,70 104.76,88.54 121.21,78.79 111.46,95.24 130,100 111.46,104.76 121.21,121.21 104.76,111.46 100,130 95.24,111.46 78.79,121.21 88.54,104.76 70,100 88.54,95.24 78.79,78.79 95.24,88.54"
                fill="#2EB5BC" fillOpacity="0.07" stroke="#C8960A" strokeWidth="0.8" strokeOpacity="0.17"
              />

              {/* ── Mid-edge half-stars ───────────────────────────────── */}
              {/* These complete the corner stars of adjacent tiles.       */}
              {/* Top edge: star centered at (50,0) */}
              <polygon
                points="50,-30 54.76,-11.46 71.21,-21.21 61.46,-4.76 80,0 61.46,4.76 71.21,21.21 54.76,11.46 50,30 45.24,11.46 28.79,21.21 38.54,4.76 20,0 38.54,-4.76 28.79,-21.21 45.24,-11.46"
                fill="#0D2464" fillOpacity="0.06" stroke="#C8960A" strokeWidth="0.7" strokeOpacity="0.15"
              />
              {/* Left edge: star centered at (0,50) */}
              <polygon
                points="0,20 4.76,38.54 21.21,28.79 11.46,45.24 30,50 11.46,54.76 21.21,71.21 4.76,61.46 0,80 -4.76,61.46 -21.21,71.21 -11.46,54.76 -30,50 -11.46,45.24 -21.21,28.79 -4.76,38.54"
                fill="#0D2464" fillOpacity="0.06" stroke="#C8960A" strokeWidth="0.7" strokeOpacity="0.15"
              />

              {/* ── Cross connector diamonds ─────────────────────────── */}
              {/* The small octagonal/square shapes that fill the spaces  */}
              {/* between adjacent 8-pointed stars. In real khatam        */}
              {/* tilework these spaces contain smaller geometric insets. */}
              {/* Here represented as small 4-pointed connector stars.    */}
              {/* Orthogonal connectors */}
              <polygon points="50,7 53,10 50,13 47,10" fill="#C8960A" fillOpacity="0.18" />
              <polygon points="50,87 53,90 50,93 47,90" fill="#C8960A" fillOpacity="0.18" />
              <polygon points="7,50 10,53 13,50 10,47"  fill="#C8960A" fillOpacity="0.18" />
              <polygon points="87,50 90,53 93,50 90,47" fill="#C8960A" fillOpacity="0.18" />
              {/* Diagonal connectors */}
              <polygon points="14,14 17,11 20,14 17,17" fill="#2EB5BC" fillOpacity="0.15" />
              <polygon points="86,14 89,11 92,14 89,17" fill="#2EB5BC" fillOpacity="0.15" />
              <polygon points="14,86 17,83 20,86 17,89" fill="#2EB5BC" fillOpacity="0.15" />
              <polygon points="86,86 89,83 92,86 89,89" fill="#2EB5BC" fillOpacity="0.15" />

              {/* ── Outer square grid ────────────────────────────────── */}
              <rect width="100" height="100" fill="none" stroke="#C8960A" strokeWidth="0.4" strokeOpacity="0.12" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#star-tile)" />
        </svg>
      </div>

      {/* Very subtle edge darkening — like the depth of a courtyard corner */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 55%, rgba(13,24,64,0.07) 100%)' }} />
    </div>
  )
}
