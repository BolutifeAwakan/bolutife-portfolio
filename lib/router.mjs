import { getContent } from "./content.mjs";
import * as T from "./templates.mjs";

const slugify = (s) =>
  String(s)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

// Returns { status, html } or { status, location } for redirects.
export async function route(rawPath, query = {}) {
  let path = decodeURIComponent(rawPath || "/").replace(/\/+$/, "") || "/";
  const c = await getContent();

  if (path === "/") return ok(T.home(c));
  if (path === "/work") return ok(T.work(c));
  if (path === "/about") return ok(T.about(c));
  if (path === "/speaking") return ok(T.speaking(c));
  if (path === "/notes") return ok(T.notes(c));
  if (path === "/playground") return ok(T.playground(c));
  if (path === "/contact" || path === "/bookings") return ok(T.contact(c, query));

  const m = path.match(/^\/work\/([^/]+)$/);
  if (m) {
    const p = c.projects.find((x) => x.slug === m[1]) || c.projects.find((x) => slugify(x.slug) === slugify(m[1]));
    if (p && p.slug !== m[1]) return { status: 301, location: `/work/${encodeURIComponent(p.slug)}` };
    if (p) return ok(T.caseStudy(c, p));
  }
  return { status: 404, html: T.notFound(c) };
}

const ok = (html) => ({ status: 200, html });
