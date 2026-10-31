import { getContent } from "./content.mjs";
import { buildModel } from "./model.mjs";
import * as legacy from "./templates.mjs";
import * as book from "./themes/book/index.mjs";
import * as editorial from "./themes/editorial/index.mjs";
import * as realbook from "./themes/realbook/index.mjs";
import { comparison } from "./themes/compare.mjs";
import { config, resolve, DIRECTIONS, PREVIEW_PREFIX, internalCookie, INTERNAL_COOKIE } from "./experiment.mjs";

const THEMES = { book, editorial, realbook };
const bySlug = Object.fromEntries(Object.values(DIRECTIONS).map((d) => [d.slug, d.key]));

const norm = (s) =>
  String(s)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

// Returns { status, html?, location?, headers, cache: "public" | "private" | "preview" }.
export async function route(rawPath, query = {}, cookies = {}) {
  let path = decodeURIComponent(rawPath || "/").replace(/\/+$/, "") || "/";
  const c = await getContent();
  const headers = {};
  const cfg = config();

  // Owner previews: /preview, /preview/brand-book/..., /preview/personal-editorial/..., /preview/current/...
  if (path === PREVIEW_PREFIX || path.startsWith(PREVIEW_PREFIX + "/")) {
    headers["X-Robots-Tag"] = "noindex, nofollow";
    headers["Set-Cookie"] = internalCookie; // anyone reviewing is excluded from test measurements
    const rest = path.slice(PREVIEW_PREFIX.length);
    if (!rest) return { status: 200, html: comparison(c, cfg), headers, cache: "preview" };
    const [, slug, ...tail] = rest.split("/");
    const dir = bySlug[slug];
    if (!dir) return { status: 404, html: comparison(c, cfg), headers, cache: "preview" };
    const sub = "/" + tail.join("/");
    const ctx = { direction: dir, base: `${PREVIEW_PREFIX}/${slug}`, preview: true, inExperiment: false, experimentId: null };
    const out = await page(c, dir, sub === "/" ? "/" : sub.replace(/\/+$/, ""), query, ctx);
    return { ...out, headers: { ...headers, ...(out.headers || {}) }, cache: out.location ? "preview" : "preview" };
  }

  if (path === "/sitemap.xml") return { status: 200, html: sitemap(c, cfg), headers: { "Content-Type": "application/xml; charset=utf-8" }, cache: "public" };

  // Production: the experiment (when on) or the default direction.
  const r = resolve(cookies, cfg);
  if (r.setCookie) headers["Set-Cookie"] = r.setCookie;
  const internal = cookies[INTERNAL_COOKIE] === "1"; // owners and reviewers are never measured
  const ctx = { direction: r.direction, base: "", preview: false, internal, inExperiment: r.inExperiment, experimentId: r.inExperiment ? cfg.id : null };
  const out = await page(c, r.direction, path, query, ctx);
  return { ...out, headers: { ...headers, ...(out.headers || {}) }, cache: r.inExperiment ? "private" : "public" };
}

async function page(c, dir, path, query, ctx) {
  if (dir === "legacy") return legacyPage(c, path, query, ctx);
  const T = THEMES[dir];
  const m = buildModel(c);
  const go = (to) => ({ status: 301, location: ctx.base + to });
  const ok = (key, html) => ({ status: 200, html });
  const render = (key, extra = {}) => T.render(key, m, { ...ctx, pageKey: key, path, query, ...extra });

  // The editorial direction calls writing "Thoughts" and adds a shop.
  if (dir === "editorial") {
    if (path === "/writing" || path === "/notes") return go("/thoughts");
    const wn = path.match(/^\/(?:writing|notes)\/([^/]+)$/);
    if (wn) return go(`/thoughts/${wn[1]}`);
    if (path === "/thoughts") return ok("writing", render("writing"));
    const tn = path.match(/^\/thoughts\/([^/]+)$/);
    if (tn) {
      const list = m.writing.notes.filter((x) => x.internal);
      const note = list.find((x) => x.slug === tn[1]) || list.find((x) => norm(x.slug) === norm(tn[1]));
      if (note && note.slug !== tn[1]) return go(`/thoughts/${encodeURIComponent(note.slug)}`);
      if (note) return ok("article", render("article", { slug: note.slug, note }));
    }
    if (path === "/shop") return ok("shop", render("shop"));
    const sp = path.match(/^\/shop\/([^/]+)$/);
    if (sp) {
      const book = (m.books || []).find((b) => b.slug === sp[1]);
      if (book) return ok("book", render("book", { book }));
    }
  }

  // Old addresses from the current site keep working.
  if (path === "/notes") return go("/writing");
  const old = path.match(/^\/notes\/([^/]+)$/);
  if (old) return go(`/writing/${old[1]}`);
  if (path === "/playground") return go("/experiments" + (query.c ? `?c=${encodeURIComponent(query.c)}` : ""));
  if (path === "/bookings") return go("/contact?about=speaking");

  const pages = {
    "/": "home",
    "/work": "work",
    "/writing": "writing",
    "/ventures": "ventures",
    "/speaking": "speaking",
    "/about": "about",
    "/on-the-side": "side",
    "/contact": "contact",
    "/index": "index",
    "/experiments": "experiments",
  };
  if (pages[path]) return ok(pages[path], render(pages[path]));

  const w = path.match(/^\/work\/([^/]+)$/);
  if (w) {
    const p = m.work.all.find((x) => x.slug === w[1]) || m.work.all.find((x) => norm(x.slug) === norm(w[1]));
    if (p && p.slug !== w[1]) return go(`/work/${encodeURIComponent(p.slug)}`);
    if (p) return ok("case", render("case", { slug: p.slug, project: p }));
  }
  const n = path.match(/^\/writing\/([^/]+)$/);
  if (n) {
    const list = m.writing.notes.filter((x) => x.internal);
    const note = list.find((x) => x.slug === n[1]) || list.find((x) => norm(x.slug) === norm(n[1]));
    if (note && note.slug !== n[1]) return go(`/writing/${encodeURIComponent(note.slug)}`);
    if (note) return ok("article", render("article", { slug: note.slug, note }));
  }
  return { status: 404, html: render("notFound", { notFound: true }) };
}

// The current site, unchanged, with the new v2 addresses pointing somewhere sensible.
function legacyPage(c, path, query, ctx) {
  const T = legacy;
  const base = ctx.base;
  const go = (to) => ({ status: 302, location: base + to });
  const okp = (html) => ({ status: 200, html: base ? html.replace(/(href|action)="\/(?!\/|assets\/|favicon|apple-touch)/g, `$1="${base}/`) : html });
  if (path === "/writing") return go("/notes");
  const wr = path.match(/^\/writing\/([^/]+)$/);
  if (wr) return go(`/notes/${wr[1]}`);
  if (path === "/experiments") return go("/playground");
  if (["/ventures", "/on-the-side"].includes(path)) return go("/about");
  if (path === "/index") return go("/work");

  if (path === "/") return okp(T.home(c));
  if (path === "/work") return okp(T.work(c));
  if (path === "/about") return okp(T.about(c));
  if (path === "/speaking") return okp(T.speaking(c));
  if (path === "/notes") return okp(T.notes(c));
  if (path === "/playground") return okp(T.playground(c, query));
  if (path === "/contact" || path === "/bookings") return okp(T.contact(c, query));
  const m = path.match(/^\/work\/([^/]+)$/);
  if (m) {
    const p = c.projects.find((x) => x.slug === m[1]) || c.projects.find((x) => norm(x.slug) === norm(m[1]));
    if (p && p.slug !== m[1]) return { status: 301, location: `${base}/work/${encodeURIComponent(p.slug)}` };
    if (p) return okp(T.caseStudy(c, p));
  }
  const n = path.match(/^\/notes\/([^/]+)$/);
  if (n) {
    const list = (c.notes || []).filter((x) => x.slug);
    const note = list.find((x) => x.slug === n[1]) || list.find((x) => norm(x.slug) === norm(n[1]));
    if (note && note.slug !== n[1]) return { status: 301, location: `${base}/notes/${encodeURIComponent(note.slug)}` };
    if (note) return okp(T.noteArticle(c, note));
  }
  return { status: 404, html: T.notFound(c) };
}

function sitemap(c, cfg) {
  const site = process.env.SITE_URL || "https://www.bolutifeawakan.com";
  const v2 = cfg.enabled || cfg.defaultDirection !== "legacy";
  const m = buildModel(c);
  const ed = !cfg.enabled && cfg.defaultDirection === "editorial";
  const paths = ed
    ? ["/", "/work", "/about", "/ventures", "/speaking", "/thoughts", "/on-the-side", "/contact", "/experiments", "/shop", ...m.books.map((b) => b.path), ...m.work.all.map((p) => p.path), ...m.writing.notes.filter((n) => n.internal).map((n) => `/thoughts/${n.slug}`)]
    : v2
    ? ["/", "/work", "/about", "/ventures", "/speaking", "/writing", "/on-the-side", "/contact", "/index", "/experiments", ...m.work.all.map((p) => p.path), ...m.writing.notes.filter((n) => n.internal).map((n) => n.path)]
    : ["/", "/work", "/about", "/speaking", "/notes", "/contact", ...m.work.all.map((p) => p.path), ...m.writing.notes.filter((n) => n.internal).map((n) => `/notes/${n.slug}`)];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>${site}${p}</loc></url>`).join("")}</urlset>`;
}
