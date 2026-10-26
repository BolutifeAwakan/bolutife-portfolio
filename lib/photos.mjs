// Bolutife's 2025 professional portraits (Google Drive: "Professional pictures 2025").
// Exported at 640, 1280 and 2000px wide as WebP and JPEG in public/assets/photos.
// Three originals carried the photographer's watermark in the bottom band;
// those were cropped above it before export.

const list = [
  ["steps-smile", 2496, 3120, "Bolutife smiling, seated on stone steps in a striped patchwork top and white shirt"],
  ["steps-seated", 2748, 3435, "Bolutife seated at the top of a stone staircase, hands on her knees"],
  ["colonnade", 2881, 3096, "Bolutife standing against a white colonnade, hand at her collar"],
  ["chair-gold", 2880, 3096, "Bolutife reclining in a dark armchair against a gold painted backdrop"],
  ["portrait-mono", 2880, 3096, "Black and white portrait of Bolutife, arms folded, in glasses and earrings"],
  ["stairs-dark", 2880, 3600, "Bolutife standing on a step in low light, looking to the side"],
  ["doorway-dark", 2492, 3600, "Bolutife small in the frame, standing in a tall dark doorway"],
  ["textile-dark", 2334, 2898, "Close portrait of Bolutife in the striped patchwork top against black"],
  ["arch-mono", 2463, 3600, "Black and white: Bolutife standing in a white stone archway"],
  ["arch-white", 2523, 3600, "Black and white: Bolutife leaning in a brick archway, hand raised to her glasses"],
  ["garden-sun", 2496, 3120, "Bolutife in a white shirt and tie, shading her eyes in a sunlit garden"],
  ["lawn-crouch", 2880, 3600, "Bolutife crouching on a driveway in front of a white colonial building"],
  ["lawn-stand", 2880, 3600, "Bolutife standing in front of a white colonial building under a blue sky"],
];

export const photos = Object.fromEntries(list.map(([slug, w, h, alt]) => [slug, { slug, w, h, alt, local: true }]));

const base = (slug) => `/assets/photos/${slug}`;

// <picture> with WebP and JPEG sources. `sizes` describes the rendered width.
export function photo(slug, { sizes = "100vw", cls = "", eager = false, alt, pos } = {}) {
  const p = photos[slug];
  if (!p) return "";
  const set = (ext) => [640, 1280, 2000].map((w) => `${base(slug)}-${w}.${ext} ${w}w`).join(", ");
  const a = (alt ?? p.alt).replace(/"/g, "&quot;");
  const style = pos ? ` style="object-position:${pos}"` : "";
  return `<picture${cls ? ` class="${cls}"` : ""}><source type="image/webp" srcset="${set("webp")}" sizes="${sizes}"><img src="${base(slug)}-1280.jpg" srcset="${set("jpg")}" sizes="${sizes}" width="${p.w}" height="${p.h}" alt="${a}"${style} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture>`;
}

export const photoUrl = (slug, w = 1280) => `${base(slug)}-${w}.jpg`;
