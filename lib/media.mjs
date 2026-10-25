// Images and videos from either the seed (plain URLs) or Sanity (objects with
// dimensions). Builds sized URLs for the Framer and Sanity CDNs.

export const esc = (s = "") =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export function media(m) {
  if (!m) return null;
  if (typeof m === "string") m = { url: m };
  if (!m.url) return null;
  const u = new URL(m.url);
  const w = Number(m.w || u.searchParams.get("width")) || 0;
  const h = Number(m.h || u.searchParams.get("height")) || 0;
  const ext = u.pathname.split(".").pop().toLowerCase();
  const isVideo = (m.mime || "").startsWith("video/") || ["mp4", "webm", "mov"].includes(ext);
  const isGif = ext === "gif" || m.mime === "image/gif";
  return { url: m.url, w, h, alt: m.alt || "", size: m.size || "full", isVideo, isGif };
}

const PLACEHOLDER = process.env.DEV_PLACEHOLDER === "1";

export function src(m, width = 1600) {
  if (!m) return "";
  if (PLACEHOLDER) return placeholder(m);
  if (m.isVideo || m.isGif || /\.svg$/i.test(m.url)) return m.url;
  const u = new URL(m.url);
  if (u.hostname === "framerusercontent.com") {
    const step = width <= 512 ? 512 : width <= 1024 ? 1024 : 2048;
    return `${u.origin}${u.pathname}?scale-down-to=${step}`;
  }
  if (u.hostname === "cdn.sanity.io") {
    return `${u.origin}${u.pathname}?w=${m.w ? Math.min(width, m.w) : width}&auto=format&q=82`;
  }
  return m.url;
}

function placeholder(m) {
  const hue = [...m.url].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  const w = m.w || 1600, h = m.h || 1000;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="hsl(${hue},30%,70%)"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function img(raw, { width = 1600, cls = "", alt, eager = false } = {}) {
  const m = media(raw);
  if (!m) return "";
  const a = esc(alt ?? m.alt);
  const c = cls ? ` class="${cls}"` : "";
  const dims = m.w && m.h ? ` width="${m.w}" height="${m.h}"` : "";
  if (m.isVideo) {
    return `<video${c} src="${esc(PLACEHOLDER ? "" : m.url)}" autoplay muted loop playsinline preload="metadata"${dims}${a ? ` aria-label="${a}"` : ""}></video>`;
  }
  return `<img${c} src="${esc(src(m, width))}" alt="${a}"${dims} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}
