// The two BA monograms, one per direction. Hand-built SVG, no font outlines.

// Direction A: a construction-led mark. The B's waist runs on as the A's
// crossbar, so one line joins the two letters. `grid` draws the clear-space
// box and construction lines used on the brand book cover.
let n = 0;
export function markBook({ size = 40, grid = false, title = "BA monogram", cls = "" } = {}) {
  const g = grid
    ? `<g class="mk-grid" fill="none" stroke="currentColor" stroke-width=".6" opacity=".45">
        <rect x="-14" y="-4" width="148" height="108" stroke-dasharray="3 3"/>
        <path d="M-14 10H134M-14 52H134M-14 90H134M14.5 -4V104M90 -4V104" stroke-dasharray="1.5 3"/>
      </g>`
    : "";
  const id = `mkc${++n}`;
  return `<svg class="mk mk--book ${cls}" viewBox="${grid ? "-16 -6 152 112" : "4 2 112 96"}" width="${size}" height="${Math.round((size * (grid ? 112 : 96)) / (grid ? 152 : 112))}" role="img" aria-label="${title}">
    ${g}
    <clipPath id="${id}"><rect x="0" y="10" width="120" height="80"/></clipPath>
    <g class="mk-letters" clip-path="url(#${id})" fill="none" stroke="currentColor" stroke-width="9" stroke-linejoin="miter" stroke-linecap="butt">
      <path class="mk-b" d="M14.5 10V90M10 14.5H37A18.75 18.75 0 0 1 37 52M10 85.5H39A16.75 16.75 0 0 0 39 52"/>
      <path class="mk-a" d="M70 90L90 10L110 90"/>
      <path class="mk-join" d="M14.5 52H99.5"/>
    </g>
  </svg>`;
}

// Direction B: a high-contrast, hand-drawn didone pair. Thick stems,
// hairline joins, and the A's hairline leg crossing into the B's bowl.
export function markEditorial({ size = 44, title = "BA monogram", cls = "" } = {}) {
  return `<svg class="mk mk--ed ${cls}" viewBox="2 4 112 92" width="${size}" height="${Math.round((size * 92) / 112)}" role="img" aria-label="${title}">
    <g fill="currentColor" fill-rule="evenodd">
      <path d="M4 10H30V12H24V88H30V90H4V88H10V12H4Z"/>
      <path d="M24 10H44C58 10 64 18 64 29C64 40 58 48 44 48H24ZM24 12V46H43C51 46 54 39 54 29C54 19 51 12 43 12Z"/>
      <path d="M24 48H47C62 48 69 57 69 69C69 81 62 90 47 90H24ZM24 50V88H46C55 88 59 80 59 69C59 58 55 50 46 50Z"/>
      <path d="M80 8H87L107 88H95Z"/>
      <path d="M80.6 8H82.4L63.4 88H61.6Z"/>
      <path d="M68.6 63H92.6L93.1 65H68.1Z"/>
      <path d="M55 88H70V90H55ZM90 88H112V90H90Z"/>
    </g>
  </svg>`;
}
