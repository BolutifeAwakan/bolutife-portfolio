// Parts of every page that must be identical in both directions:
// SEO metadata, canonical URLs, indexing rules and the analytics wiring.
// Keeping them here means neither direction gets an advantage in the test.

import { esc, media, src } from "./media.mjs";
import { photoUrl } from "./photos.mjs";

export const SITE = process.env.SITE_URL || "https://www.bolutifeawakan.com";

// ctx.base is "" in production and "/preview/<slug>" in a preview,
// so links inside a preview keep the visitor in the same direction.
export const href = (ctx, path) => (/^(https?:|mailto:|#)/.test(path) ? path : `${ctx.base}${path === "/" && ctx.base ? "" : path}` || "/");

export function headTags(ctx, { title, description, image, path }) {
  const name = "Bolutife Awakan";
  const full = title ? `${title} | ${name}` : `${name} | Design leader, brand strategist, founder`;
  const desc = description || "I build brands, lead creative teams, and help businesses get more from design.";
  let og = "";
  if (typeof image === "string" && image.startsWith("photo:")) og = SITE + photoUrl(image.slice(6), 1280);
  else if (image) {
    const m = media(image);
    if (m) og = src(m, 1200);
  }
  if (!og) og = SITE + photoUrl("steps-smile", 1280);
  const canonical = SITE + (path === "/" ? "/" : path);
  const exp = {
    dir: ctx.direction,
    exp: ctx.experimentId || null,
    page: ctx.pageKey,
    slug: ctx.slug || null,
    preview: !!ctx.preview,
    measure: !!ctx.inExperiment && !ctx.preview && !ctx.internal,
  };
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(desc)}">
${ctx.notFound ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${esc(canonical)}">`}
${ctx.preview && !ctx.notFound ? '<meta name="robots" content="noindex, nofollow">' : ""}
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(og)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico?v=3" sizes="any">
<link rel="icon" href="/assets/favicon.svg?v=3" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png?v=3">
<meta name="ba-exp" content="${esc(JSON.stringify(exp))}">
<script src="/assets/track.js?v=1" defer></script>`;
}

// Small shared helpers for templates.
export const paras = (text = "", cls = "") =>
  String(text || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p${cls ? ` class="${cls}"` : ""}>${esc(p).replace(/\n/g, "<br>")}</p>`)
    .join("");

export const ext = (u = "") => /^https?:/.test(u);
export const extAttrs = (u = "") => (ext(u) ? ' target="_blank" rel="noopener"' : "");
export const year = () => new Date().getFullYear();
export const fmtDate = (d) => (d ? new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : "");
