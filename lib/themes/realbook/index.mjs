// Direction C — The Book: the brand book as a real, immersive book.
// The home page is a cloth-bound book lying on a lit table. You open it
// and turn its pages by scrolling, dragging a corner, tapping a page edge
// or with the arrow keys. Each spread is a chapter of Bolutife: a picture
// on the left, the chapter on the right, and a way into the full chapter.
// The chapter pages are the same paper, laid flat. Nothing here is a
// literal brand manual: the book is how she is presented, not what it shows.
// Instrument Serif and Instrument Sans; cloth green and gold foil from the
// 2025 portraits.

import { esc, img, media } from "../../media.mjs";
import { photo } from "../../photos.mjs";
import { headTags, href, paras, extAttrs, year, fmtDate } from "../../shell.mjs";
import { contentIndex, SECTIONS } from "../../model.mjs";
import { markBook } from "../marks.mjs";

const ORDER = ["work", "ventures", "speaking", "writing", "about", "side", "contact"];
const NAV = ORDER.map((k) => SECTIONS.find((s) => s.key === k));
const navKey = { about: "about", work: "work", case: "work", ventures: "ventures", speaking: "speaking", writing: "writing", article: "writing", side: "side", contact: "contact" };

// The chapters of the book, in reading order. `leaf` is where the chapter
// sits in the book on the home page; `path` is its full page.
const CHAPTERS = [
  { key: "about", n: "One", title: "Who I am", path: "/about" },
  { key: "work", n: "Two", title: "The work", path: "/work" },
  { key: "lead", n: "Three", title: "How I lead", path: "/about#practice" },
  { key: "ventures", n: "Four", title: "What I'm building", path: "/ventures" },
  { key: "speaking", n: "Five", title: "On stage", path: "/speaking" },
  { key: "writing", n: "Six", title: "Field notes", path: "/writing" },
  { key: "side", n: "Seven", title: "On the side", path: "/on-the-side" },
  { key: "contact", n: "Eight", title: "Work with me", path: "/contact" },
];
const FIRST_CHAPTER_LEAF = 3; // cover, title page, contents come first
const chapterLeaf = (key) => FIRST_CHAPTER_LEAF + CHAPTERS.findIndex((c) => c.key === key);
const pageNo = (leaf) => leaf * 2 - 1; // the right-hand page number of a leaf

const timeIn = (tz) => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz });
const clocks = () => `<span role="group" aria-label="Local time">Lagos <time data-tz="Africa/Lagos">${timeIn("Africa/Lagos")}</time>, London <time data-tz="Europe/London">${timeIn("Europe/London")}</time></span>`;

/* ---------- shell ---------- */

function shell(m, ctx, { title, description, image, body, home = false }) {
  const L = (p) => href(ctx, p);
  const active = navKey[ctx.pageKey];
  const cur = (k) => (active === k ? ' aria-current="page"' : "");
  return `<!doctype html>
<html lang="en" class="bk${home ? " bk--home" : ""}">
<head>
${headTags(ctx, { title, description, image, path: ctx.path })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wdth,wght@0,75..100,400..700;1,75..100,400..700&family=Instrument+Serif:ital@0;1&display=swap">
<link rel="stylesheet" href="/assets/realbook.css?v=1">
<script src="/assets/realbook.js?v=1" defer></script>
</head>
<body class="bk-page bk-page--${ctx.pageKey}">
<a class="bk-skip" href="#main">Skip to content</a>
<header class="bk-head">
  <a class="bk-head__brand" href="${L("/")}" aria-label="Bolutife Awakan, home">${markBook({ size: 28, title: "" })}<span>Bolutife Awakan</span></a>
  <nav class="bk-head__nav" aria-label="Main"><ul>${NAV.map((s) => `<li><a href="${L(s.path)}"${cur(s.key)}>${s.label}</a></li>`).join("")}</ul></nav>
  <button class="bk-head__menu" type="button" aria-expanded="false" aria-controls="bk-menu">Menu</button>
</header>
<dialog class="bk-menu" id="bk-menu" aria-label="Menu">
  <div class="bk-menu__top">${markBook({ size: 28, title: "" })}<button class="bk-menu__close" type="button">Close</button></div>
  <nav aria-label="Menu"><ol>${CHAPTERS.map((c) => `<li><a href="${L(c.path)}"><span>Chapter ${c.n.toLowerCase()}</span>${esc(c.title)}</a></li>`).join("")}</ol>
  <ul class="bk-menu__more"><li><a href="${L("/")}">Open the book</a></li><li><a href="${L("/experiments")}">Experiments</a></li><li><a href="${L("/index")}">Everything on the site</a></li></ul></nav>
</dialog>
<main id="main">
${body}
</main>
${footer(m, ctx)}
</body>
</html>`;
}

// The same close on every page: the A/B test's call to action.
function footer(m, ctx) {
  const L = (p) => href(ctx, p);
  const p = m.person;
  return `<footer class="bk-foot">
  <section class="bk-cta" aria-labelledby="h-cta">
    <h2 class="bk-cta__h" id="h-cta">Work with me</h2>
    <p class="bk-cta__mail"><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></p>
    <p class="bk-actions"><a class="bk-btn" href="${L("/contact")}">Send a message</a><a class="bk-btn bk-btn--line" href="${L("/contact?about=speaking")}">Book a talk</a></p>
  </section>
  <div class="bk-foot__base">
    <nav aria-label="Footer"><ul>${[...NAV, { path: "/experiments", label: "Experiments" }, { path: "/index", label: "Everything" }].map((s) => `<li><a href="${L(s.path)}">${s.label}</a></li>`).join("")}</ul></nav>
    <ul class="bk-foot__social">${p.socials.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join("")}</ul>
    <p class="bk-foot__meta">${clocks()}<br>${esc(m.photoCredit)}<br>&copy; Bolutife Awakan ${year()}</p>
  </div>
</footer>`;
}

/* ---------- the book (home) ---------- */

// A printed page: running head, the page's content, a folio.
const page = (leaf, chapterTitle, inner, { cls = "" } = {}) => `
  <div class="bk-pg ${cls}">
    <p class="bk-pg__run" aria-hidden="true"><span>Bolutife Awakan</span><span>${esc(chapterTitle || "")}</span></p>
    <div class="bk-pg__body">${inner}</div>
    <p class="bk-pg__folio" aria-hidden="true">${pageNo(leaf)}</p>
  </div>`;

// A picture page: the photograph fills the left page, with a caption.
const plate = (slug, caption, { pos } = {}) => `
  <figure class="bk-plate">${photo(slug, { sizes: "(max-width: 760px) 90vw, 36vw", pos })}${caption ? `<figcaption>${esc(caption)}</figcaption>` : ""}</figure>`;

const chapterHead = (c, h = "h2") => `<p class="bk-pg__ch">Chapter ${c.n.toLowerCase()}</p><${h} class="bk-pg__t" id="ch-${c.key}">${esc(c.title)}</${h}>`;
const more = (L, c, label) => `<p class="bk-pg__more"><a href="${L(c.path)}">${esc(label)}</a></p>`;

function home(m, ctx) {
  const L = (p) => href(ctx, p);
  const p = m.person;
  const C = Object.fromEntries(CHAPTERS.map((c) => [c.key, c]));
  const sideFirst = (m.side.intro.match(/[^.!?]+[.!?]+/g) || [m.side.intro]).slice(0, 2).join(" ").trim();
  const leadQuote = m.about.testimonials[0];

  // Each leaf has a front (a right-hand page) and a back (the next left-hand page).
  const leaves = [
    // 0: the cover
    {
      cls: "bk-leaf--cover",
      front: `<div class="bk-cover" aria-hidden="true">
        <div class="bk-cover__foil">${markBook({ size: 200, title: "" })}</div>
        <p class="bk-cover__name">Bolutife Awakan</p>
      </div>`,
      back: `<div class="bk-endpaper" aria-hidden="true"></div>`,
    },
    // 1: title page
    {
      front: `<div class="bk-pg bk-pg--title">
        <p class="bk-pg__ch">${esc(p.identity.join(", "))}</p>
        <h1 class="bk-title">Bolutife Awakan</h1>
        <p class="bk-title__line">${esc(p.headline)}</p>
        <p class="bk-title__imprint">${esc(p.locations.map((l) => l.split(",")[0]).join(" and "))}<br>Edition ${year()}</p>
      </div>`,
      back: plate("steps-smile", ""),
    },
    // 2: contents
    {
      front: page(2, "Contents", `<h2 class="bk-pg__t bk-pg__t--small">Contents</h2>
        <ol class="bk-toc">${CHAPTERS.map((c) => `<li><a href="${L(c.path)}" data-goto="${chapterLeaf(c.key)}"><span class="bk-toc__n">${esc(c.n)}</span><span class="bk-toc__t">${esc(c.title)}</span><span class="bk-toc__p">${pageNo(chapterLeaf(c.key))}</span></a></li>`).join("")}</ol>`),
      back: plate("colonnade", ""),
    },
    // 3: Who I am
    {
      front: page(3, C.about.title, `${chapterHead(C.about)}
        <p class="bk-pg__lede bk-pg__lede--sm">${esc(p.supporting)}</p>
        <ol class="bk-path">${m.about.path.map((s) => `<li><span>${esc(s.when)}</span>${esc(s.text)}</li>`).join("")}</ol>
        ${more(L, C.about, "Read my story")}`),
      back: plate("portrait-mono", m.practice.operator),
    },
    // 4: The work
    {
      front: page(4, C.work.title, `${chapterHead(C.work)}
        <ul class="bk-works">${m.work.featured.map((w) => `<li><a href="${L(w.path)}"><span class="bk-works__img">${img(w.thumbnail || w.cover, { width: 600, alt: "" })}</span><span class="bk-works__t">${esc(w.title)}</span><span class="bk-works__s">${esc(w.summary)}</span></a></li>`).join("")}</ul>
        ${more(L, C.work, `All ${m.work.all.length} case studies`)}`),
      back: m.work.featured[0] && media(m.work.featured[0].cover || m.work.featured[0].thumbnail)
        ? `<figure class="bk-plate bk-plate--work">${img(m.work.featured[0].cover || m.work.featured[0].thumbnail, { width: 1200, alt: "" })}<figcaption>${esc(m.work.featured[0].title)}, ${esc(m.work.featured[0].year || "")}</figcaption></figure>`
        : plate("chair-gold", ""),
    },
    // 5: How I lead
    {
      front: page(5, C.lead.title, `${chapterHead(C.lead)}
        <blockquote class="bk-pg__quote"><p>${esc(m.practice.belief)}</p></blockquote>
        <ul class="bk-list">${m.practice.areas.map((a) => `<li><strong>${esc(a.title)}</strong> ${esc(a.body)}</li>`).join("")}</ul>
        ${more(L, C.lead, "How I work")}`),
      back: leadQuote
        ? `<div class="bk-pg bk-pg--quote"><blockquote><p>${esc(leadQuote.quote)}</p></blockquote><p class="bk-pg__by">${esc(leadQuote.name)}, ${esc(leadQuote.role)}</p></div>`
        : plate("stairs-dark", ""),
    },
    // 6: What I'm building
    {
      front: page(6, C.ventures.title, `${chapterHead(C.ventures)}
        <div class="bk-vents">${m.ventures.map((v) => `<div class="bk-vent"><p class="bk-vent__k">${esc(v.kind)}, founded by me</p><h3 class="bk-vent__n">${esc(v.name)}</h3><p>${esc(v.line)}</p>${v.url ? `<a href="${esc(v.url)}" target="_blank" rel="noopener" data-track="venture_click" data-track-target="${esc(v.slug)}">${esc(v.cta)}</a>` : ""}</div>`).join("")}</div>
        <p class="bk-pg__note">${esc(m.mentoring)} ${m.books.map((b) => `My book, <a href="${esc(b.url || L("/writing#books"))}"${b.url ? ' target="_blank" rel="noopener" data-track="book_click" data-track-target="book"' : ""}><em>${esc(b.title)}</em></a>, is out now.`).join(" ")}</p>
        ${more(L, C.ventures, "More on the ventures")}`),
      back: plate("garden-sun", ""),
    },
    // 7: On stage
    {
      front: page(7, C.speaking.title, `${chapterHead(C.speaking)}
        <p class="bk-pg__lede">${esc(m.speaking.promise)}</p>
        <ol class="bk-list bk-list--num">${m.speaking.tracks.map((t) => `<li><strong>${esc(t.title)}</strong></li>`).join("")}</ol>
        <p class="bk-pg__more"><a href="${L("/contact?about=speaking")}">Book me to speak</a> <a href="${L("/speaking")}">Topics and talks</a></p>`),
      back: m.speaking.image ? `<figure class="bk-plate">${img(m.speaking.image, { width: 1200, alt: "Bolutife speaking on stage" })}</figure>` : plate("arch-white", ""),
    },
    // 8: Field notes
    {
      front: page(8, C.writing.title, `${chapterHead(C.writing)}
        <ol class="bk-notes">${m.writing.notes.slice(0, 3).map((n) => {
          const u = n.path ? L(n.path) : n.href || "#";
          return `<li><a href="${esc(u)}"${n.path ? "" : extAttrs(u)}><span class="bk-notes__d">${esc(n.date ? fmtDate(n.date) : "")}</span><span class="bk-notes__t">${esc(n.title)}</span></a></li>`;
        }).join("")}</ol>
        ${more(L, C.writing, "All writing")}`),
      back: plate("lawn-crouch", ""),
    },
    // 9: On the side
    {
      front: page(9, C.side.title, `${chapterHead(C.side)}
        <p class="bk-pg__lede">${esc(sideFirst)}</p>
        <p class="bk-pg__words">${m.side.interests.map((x) => `<span>${esc(x.title)}</span>`).join(" ")}</p>
        ${m.side.nowPlaying ? `<p class="bk-pg__note">On repeat: ${esc(m.side.nowPlaying.song)}, ${esc(String(m.side.nowPlaying.artist).replace(/\.$/, ""))}.</p>` : ""}
        ${more(L, C.side, "Life outside work")}`),
      back: `<div class="bk-snaps" aria-hidden="true">${["chair-gold", "arch-mono", "lawn-stand"].map((s) => `<figure>${photo(s, { sizes: "20vw", alt: "" })}</figure>`).join("")}</div>`,
    },
    // 10: Work with me
    {
      front: page(10, C.contact.title, `${chapterHead(C.contact)}
        <p class="bk-pg__lede">Brand projects, design leadership, speaking or mentoring. Tell me what you're working on.</p>
        <p class="bk-pg__mail"><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></p>
        <p class="bk-pg__more"><a href="${L("/contact")}">Send a message</a> <a href="${L("/contact?about=speaking")}">Book a talk</a></p>
        <p class="bk-pg__sign">Bolutife</p>`),
      back: `<div class="bk-endpaper" aria-hidden="true"></div>`,
    },
    // 11: the back cover
    {
      cls: "bk-leaf--backcover",
      front: `<div class="bk-endpaper" aria-hidden="true"></div>`,
      back: `<div class="bk-cover bk-cover--back" aria-hidden="true"><p>${esc(p.headline)}</p><div class="bk-cover__foil bk-cover__foil--small">${markBook({ size: 60, title: "" })}</div></div>`,
    },
  ];

  const N = leaves.length;
  const body = `
<section class="bk-stage" aria-label="The book" data-leaves="${N}" data-chapters='${JSON.stringify(Object.fromEntries(CHAPTERS.map((c) => [c.key, chapterLeaf(c.key)])))}'>
  <div class="bk-scene">
    <div class="bk-light" aria-hidden="true"></div>
    <div class="bk-book" data-book>
      <div class="bk-edge bk-edge--left" aria-hidden="true"></div>
      <div class="bk-edge bk-edge--right" aria-hidden="true"></div>
      ${leaves
        .map(
          (l, i) => `<div class="bk-leaf ${l.cls || ""}" data-leaf="${i}" style="--i:${i}">
        <div class="bk-face bk-face--front" data-face="${i * 2}">${l.front}<span class="bk-shade" aria-hidden="true"></span></div>
        <div class="bk-face bk-face--back" data-face="${i * 2 + 1}">${l.back}<span class="bk-shade" aria-hidden="true"></span></div>
      </div>`
        )
        .join("")}
    </div>
    <div class="bk-ui">
      <button class="bk-ui__btn" type="button" data-turn="-1" aria-label="Previous page">Back</button>
      <p class="bk-ui__where" aria-live="polite"><span data-where>Scroll to open</span></p>
      <button class="bk-ui__btn" type="button" data-turn="1" aria-label="Next page">Turn</button>
      <button class="bk-ui__sound" type="button" aria-pressed="false" data-sound aria-label="Page sound">Sound off</button>
    </div>
  </div>
  <div class="bk-track" aria-hidden="true">${Array.from({ length: N + 1 }, (_, k) => `<i data-stop="${k}"></i>`).join("")}</div>
</section>`;
  return shell(m, ctx, { body, image: "photo:steps-smile", home: true });
}

/* ---------- chapter pages: the same paper, laid flat ---------- */

const sheet = (inner, { chapterTitle = "", cls = "" } = {}) => `<article class="bk-sheet ${cls}">
  <p class="bk-sheet__run" aria-hidden="true"><span>Bolutife Awakan</span><span>${esc(chapterTitle)}</span></p>
  ${inner}
</article>`;

const opener = (L, key, title, line, { photoSlug } = {}) => {
  const c = CHAPTERS.find((x) => x.key === key);
  return `<header class="bk-open${photoSlug ? " bk-open--photo" : ""}">
    <div>
      <p class="bk-open__ch">${c ? `Chapter ${c.n.toLowerCase()}` : ""}</p>
      <h1 class="bk-open__t">${esc(title)}</h1>
      ${line ? `<p class="bk-open__line">${esc(line)}</p>` : ""}
    </div>
    ${photoSlug ? `<figure class="bk-tipin">${photo(photoSlug, { sizes: "(max-width: 760px) 80vw, 30vw", eager: true })}</figure>` : ""}
  </header>`;
};

const backToBook = (L, key) => {
  const c = CHAPTERS.find((x) => x.key === key);
  return `<p class="bk-back"><a href="${L("/")}${c ? `#${c.key}` : ""}">Back to the book</a></p>`;
};

const meta = (...parts) => parts.filter(Boolean).map(esc).join(", ");

function workItem(L, p, { h = "h2", wide = false, eager = false } = {}) {
  return `<li class="bk-wk${wide ? " bk-wk--wide" : ""}"><a href="${L(p.path)}">
    <figure class="bk-wk__img">${img(p.thumbnail || p.cover, { width: wide ? 2000 : 1200, alt: "", eager })}</figure>
    <${h} class="bk-wk__t">${esc(p.title)}</${h}>
    <p class="bk-wk__s">${esc(p.summary)}</p>
    <p class="bk-wk__m">${meta(p.services, p.year)}</p>
  </a></li>`;
}

function ventureBlock(v, { h = "h2" } = {}) {
  return `<section class="bk-ven" id="${esc(v.slug)}" aria-labelledby="v-${esc(v.slug)}">
    <p class="bk-ven__k">${esc(v.kind)}, founded by Bolutife. It has its own name, identity and team.</p>
    <${h} class="bk-ven__n" id="v-${esc(v.slug)}">${esc(v.name)}</${h}>
    <p class="bk-ven__line">${esc(v.line)}</p>
    <p>${esc(v.body)}</p>
    ${v.offers.length ? `<ul class="bk-ven__offers">${v.offers.map((o) => `<li><strong>${esc(o.title)}</strong> ${esc(o.body)}</li>`).join("")}</ul>` : ""}
    ${v.url ? `<p><a class="bk-link" href="${esc(v.url)}" target="_blank" rel="noopener" data-track="venture_click" data-track-target="${esc(v.slug)}">${esc(v.cta)}</a></p>` : `<p class="bk-muted">Its own website is on the way.</p>`}
  </section>`;
}

const bookBlock = (b, h = "h3") => `<div class="bk-bk">
  <div class="bk-bk__obj" aria-hidden="true"><span>${esc(b.title)}</span><small>Bolutife Awakan</small></div>
  <div><${h} class="bk-bk__t">${esc(b.title)}</${h}><p>${esc(b.line)}</p>${b.url ? `<p><a class="bk-link" href="${esc(b.url)}" target="_blank" rel="noopener" data-track="book_click" data-track-target="book">${esc(b.cta)}</a></p>` : ""}</div>
</div>`;

function noteList(L, notes, { h = "h2" } = {}) {
  return `<ol class="bk-nl">${notes
    .map((n) => {
      const u = n.path ? L(n.path) : n.href || "#";
      return `<li><a href="${esc(u)}"${n.path ? "" : extAttrs(u)}><span class="bk-nl__d">${esc(n.date ? fmtDate(n.date) : "")}</span><${h} class="bk-nl__t">${esc(n.title)}</${h}><span class="bk-nl__s">${esc(n.summary || "")}</span></a></li>`;
    })
    .join("")}</ol>`;
}

const quote = (t) => `<figure class="bk-q"><blockquote><p>${esc(t.quote)}</p></blockquote><figcaption>${esc(t.name)}, ${esc(t.role)}</figcaption></figure>`;

function about(m, ctx) {
  const L = (p) => href(ctx, p);
  const a = m.about;
  const table = (rows) => `<ul class="bk-tbl">${rows.map(([y, t, o]) => `<li><span>${esc(y)}</span><strong>${esc(t)}</strong>${o ? `<span>${esc(o)}</span>` : ""}</li>`).join("")}</ul>`;
  const inner = `${opener(L, "about", "Who I am", m.person.identity.join(", ") + ".", { photoSlug: "steps-seated" })}
    <section class="bk-sec bk-prose">${a.paragraphs.map((t, i) => `<p${i === 0 ? ' class="bk-drop"' : ""}>${esc(t)}</p>`).join("")}</section>
    <section class="bk-sec" aria-labelledby="h-path"><h2 class="bk-h2" id="h-path">The path so far</h2>
      <ol class="bk-tl">${a.path.map((s) => `<li><h3>${esc(s.when)}</h3><p>${esc(s.text)}</p></li>`).join("")}</ol></section>
    <section class="bk-sec" id="practice" aria-labelledby="h-practice"><h2 class="bk-h2" id="h-practice">How I lead</h2>
      <blockquote class="bk-big-q"><p>${esc(m.practice.belief)}</p></blockquote>
      <p class="bk-muted bk-narrow">${esc(m.practice.operator)}</p>
      <ul class="bk-cols">${m.practice.areas.map((x) => `<li><h3>${esc(x.title)}</h3><p>${esc(x.body)}</p></li>`).join("")}</ul>
      <h3 class="bk-h3">Services</h3>
      <ul class="bk-cols">${m.practice.services.map((s) => `<li><h4>${esc(s.title)}</h4><p>${esc(s.body)}</p></li>`).join("")}</ul></section>
    <section class="bk-sec" aria-labelledby="h-record"><h2 class="bk-h2" id="h-record">The record</h2>
      <div class="bk-two">
        <div><h3 class="bk-h3">Experience</h3>${table(a.experience.map((x) => [String(x.period || "").replace(/[()]/g, ""), x.role, x.org]))}</div>
        <div><h3 class="bk-h3">Education</h3>${table(a.education.map((x) => [x.year, x.title, x.org]))}
        <h3 class="bk-h3">Recognition</h3>${table(a.awards.map((x) => [x.year, x.title, x.org]))}</div>
      </div>
      <h3 class="bk-h3">Milestones</h3>${table(a.career.map((x) => [x.year, x.text]))}
      <p class="bk-narrow">${esc(m.mentoring)}</p></section>
    <section class="bk-sec" aria-labelledby="h-say"><h2 class="bk-h2" id="h-say">What clients say</h2>
      <div class="bk-qs">${a.testimonials.map(quote).join("")}</div></section>
    ${backToBook(L, "about")}`;
  return shell(m, ctx, { title: "About", description: m.person.supporting, image: "photo:steps-seated", body: sheet(inner, { chapterTitle: "Who I am" }) });
}

function work(m, ctx) {
  const L = (p) => href(ctx, p);
  const inner = `${opener(L, "work", "The work", "Brand identities, systems and creative direction for companies, events and founders.")}
    <ul class="bk-wks">${m.work.all.map((p, i) => workItem(L, p, { wide: i % 3 === 0, eager: i === 0 })).join("")}</ul>
    ${backToBook(L, "work")}`;
  return shell(m, ctx, { title: "Work", body: sheet(inner, { chapterTitle: "The work" }) });
}

function caseStudy(m, ctx) {
  const L = (p) => href(ctx, p);
  const p = ctx.project;
  const idx = m.work.all.findIndex((x) => x.slug === p.slug);
  const next = m.work.all[(idx + 1) % m.work.all.length];
  const gallery = (images = []) => {
    const items = (images || []).map(media).filter(Boolean);
    if (!items.length) return "";
    return `<div class="bk-gal">${items.map((im) => `<figure class="bk-gal__${im.size === "half" ? "half" : "full"}">${img(im, { width: im.size === "half" ? 1400 : 2400 })}</figure>`).join("")}</div>`;
  };
  const rows = [["Client", p.client], ["Sector", p.services], ["Year", p.year], ["Scope", (p.tags || []).join(", ")]].filter(([, v]) => v);
  const inner = `<header class="bk-open">
      <div>
        <p class="bk-open__ch"><a href="${L("/work")}">The work</a>, case study ${idx + 1} of ${m.work.all.length}</p>
        <h1 class="bk-open__t">${esc(p.title)}</h1>
        <p class="bk-open__line">${esc(p.summary)}</p>
        <dl class="bk-spec">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
      </div>
    </header>
    ${p.cover ? `<figure class="bk-cover-img">${img(p.cover, { width: 2400, eager: true, alt: p.title })}</figure>` : ""}
    ${p.intro ? `<div class="bk-sec bk-intro">${paras(p.intro)}</div>` : ""}
    ${(p.sections || [])
      .map(
        (s) => `<section class="bk-sec">
        ${s.heading || s.body ? `<div class="bk-cs">${s.heading ? `<h2 class="bk-h3">${esc(s.heading)}</h2>` : "<span></span>"}<div class="bk-prose">${paras(s.body)}</div></div>` : ""}
        ${gallery(s.images)}
      </section>`
      )
      .join("")}
    <nav class="bk-next" aria-label="Next case study"><a href="${L(next.path)}"><span>Next case study</span><strong>${esc(next.title)}</strong></a></nav>
    ${backToBook(L, "work")}`;
  return shell(m, ctx, { title: p.title, description: p.summary, image: p.thumbnail || p.cover, body: sheet(inner, { chapterTitle: "The work" }) });
}

function ventures(m, ctx) {
  const L = (p) => href(ctx, p);
  const inner = `${opener(L, "ventures", "What I'm building", "Alongside my design leadership work, I founded two organisations. Each has its own name, identity and team.")}
    <div class="bk-two bk-two--vents">${m.ventures.map((v) => ventureBlock(v)).join("")}</div>
    <section class="bk-sec" id="mentoring" aria-labelledby="h-mentor"><h2 class="bk-h2" id="h-mentor">Mentoring</h2><p class="bk-lede">${esc(m.mentoring)}</p>
      <p class="bk-actions"><a class="bk-btn" href="${L("/contact?about=mentoring")}">Ask about mentoring</a></p></section>
    <section class="bk-sec" aria-labelledby="h-books"><h2 class="bk-h2" id="h-books">Books</h2>${m.books.map((b) => bookBlock(b)).join("")}</section>
    ${backToBook(L, "ventures")}`;
  return shell(m, ctx, { title: "Ventures", description: m.ventures.map((v) => `${v.name}: ${v.line}`).join(" "), body: sheet(inner, { chapterTitle: "What I'm building" }) });
}

function speaking(m, ctx) {
  const L = (p) => href(ctx, p);
  const s = m.speaking;
  const inner = `${opener(L, "speaking", "On stage", s.promise)}
    ${s.image ? `<figure class="bk-cover-img">${img(s.image, { width: 2400, eager: true, alt: "Bolutife speaking on stage" })}</figure>` : ""}
    <section class="bk-sec bk-prose"><p class="bk-drop">${esc(s.intro)}</p><p class="bk-muted">I give keynotes, run workshops, join panels and give guest lectures.</p>
      <p class="bk-actions"><a class="bk-btn" href="${L("/contact?about=speaking")}">Book me to speak</a></p></section>
    <section class="bk-sec" aria-labelledby="h-tracks"><h2 class="bk-h2" id="h-tracks">What I speak about</h2>
      <ol class="bk-rows">${s.tracks.map((t, i) => `<li><span class="bk-rows__n">${i + 1}</span><h3>${esc(t.title)}</h3><p>${esc(t.body)}</p></li>`).join("")}</ol></section>
    <section class="bk-sec" id="talks" aria-labelledby="h-talks"><h2 class="bk-h2" id="h-talks">Talks</h2>
      <ul class="bk-rows bk-rows--plain">${s.talks.map((t) => `<li><h3>${esc(t.title)}</h3><p>${meta(t.track, t.event)}</p></li>`).join("")}</ul></section>
    <section class="bk-sec" aria-labelledby="h-where"><h2 class="bk-h2" id="h-where">Where I've spoken</h2>
      <ul class="bk-rows bk-rows--plain">${s.appearances.map((a) => `<li><h3>${esc(a.title)}</h3><p>${esc(a.body)}</p></li>`).join("")}</ul>
      ${s.photos.length ? `<div class="bk-reel">${s.photos.map((ph) => `<figure>${img(ph, { width: 1200, alt: "" })}</figure>`).join("")}</div>` : ""}
      ${s.press.length ? `<p class="bk-actions">${s.press.map(([u, l]) => `<a class="bk-btn bk-btn--line" href="${esc(u)}" target="_blank" rel="noopener">${esc(l)}</a>`).join("")}</p>` : ""}</section>
    ${backToBook(L, "speaking")}`;
  return shell(m, ctx, { title: "Speaking", description: s.promise, image: s.image, body: sheet(inner, { chapterTitle: "On stage" }) });
}

function writing(m, ctx) {
  const L = (p) => href(ctx, p);
  const inner = `${opener(L, "writing", "Field notes", m.writing.intro)}
    ${noteList(L, m.writing.notes)}
    <section class="bk-sec" id="books" aria-labelledby="h-books"><h2 class="bk-h2" id="h-books">Books</h2>${m.books.map((b) => bookBlock(b)).join("")}</section>
    ${backToBook(L, "writing")}`;
  return shell(m, ctx, { title: "Writing", description: m.writing.intro, body: sheet(inner, { chapterTitle: "Field notes" }) });
}

function article(m, ctx) {
  const L = (p) => href(ctx, p);
  const n = ctx.note;
  const list = m.writing.notes.filter((x) => x.internal);
  const i = list.findIndex((x) => x.slug === n.slug);
  const next = list.length > 1 ? list[(i + 1) % list.length] : null;
  const inner = `<header class="bk-open bk-open--article">
      <div>
        <p class="bk-open__ch"><a href="${L("/writing")}">Field notes</a>${(n.tags || []).length ? `, ${n.tags.map(esc).join(", ")}` : ""}</p>
        <h1 class="bk-open__t">${esc(n.title)}</h1>
        ${n.summary ? `<p class="bk-open__line">${esc(n.summary)}</p>` : ""}
        <p class="bk-muted">By Bolutife Awakan${n.date ? `, ${esc(fmtDate(n.date))}` : ""}${n.readTime ? `. ${n.readTime} minute read` : ""}</p>
      </div>
    </header>
    ${media(n.thumbnail) ? `<figure class="bk-cover-img">${img(n.thumbnail, { width: 2400, eager: true, alt: "" })}</figure>` : ""}
    <div class="bk-read">
      ${n.quote ? `<p class="bk-read__q">${esc(n.quote)}</p>` : ""}
      ${(n.sections || [])
        .map(
          (s, j) => `${s.heading ? `<h2>${esc(s.heading)}</h2>` : ""}${j === 0 ? paras(s.body).replace("<p>", '<p class="bk-drop">') : paras(s.body)}
          ${s.pullQuote ? `<blockquote class="bk-pull"><p>${esc(s.pullQuote)}</p></blockquote>` : ""}
          ${media(s.image) ? `<figure class="bk-read__img">${img(s.image, { width: 1600, alt: s.image.alt || "" })}</figure>` : ""}`
        )
        .join("")}
    </div>
    ${next ? `<nav class="bk-next" aria-label="Next note"><a href="${L(next.path)}"><span>Next field note</span><strong>${esc(next.title)}</strong></a></nav>` : ""}
    ${backToBook(L, "writing")}`;
  return shell(m, ctx, { title: n.title, description: n.summary || n.title, image: n.thumbnail, body: sheet(inner, { chapterTitle: "Field notes", cls: "bk-sheet--read" }) });
}

const SHEET = ["steps-smile", "colonnade", "garden-sun", "lawn-stand", "arch-mono", "portrait-mono", "stairs-dark", "doorway-dark", "lawn-crouch", "chair-gold", "steps-seated", "arch-white", "textile-dark"];

function side(m, ctx) {
  const L = (p) => href(ctx, p);
  const s = m.side;
  const inner = `${opener(L, "side", "On the side", s.intro, { photoSlug: "garden-sun" })}
    <section class="bk-sec" aria-labelledby="h-enjoy"><h2 class="bk-h2" id="h-enjoy">What I enjoy</h2>
      <ul class="bk-cols">${s.interests.map((x) => `<li><h3>${esc(x.title)}</h3><p>${esc(x.body)}</p></li>`).join("")}</ul>
      ${s.offDutyLine ? `<p class="bk-muted bk-narrow">${esc(s.offDutyLine)}</p>` : ""}</section>
    ${s.nowPlaying ? `<section class="bk-sec" aria-labelledby="h-np"><h2 class="bk-h3" id="h-np">On repeat</h2><div class="bk-np">${img(s.nowPlaying.cover, { width: 500, alt: `${s.nowPlaying.album} cover` })}<div><p class="bk-np__s">${esc(s.nowPlaying.song)}</p><p>${esc(s.nowPlaying.artist)}, from ${esc(s.nowPlaying.album)}</p>${s.nowPlaying.url ? `<p><a class="bk-link" href="${esc(s.nowPlaying.url)}" target="_blank" rel="noopener">Listen</a></p>` : ""}</div></div></section>` : ""}
    <section class="bk-sec" aria-labelledby="h-sheet"><h2 class="bk-h2" id="h-sheet">Contact sheet</h2><p class="bk-muted">${esc(m.photoCredit)}</p>
      <ul class="bk-sheetgrid">${SHEET.map((k) => `<li>${photo(k, { sizes: "(max-width: 760px) 45vw, 20vw" })}</li>`).join("")}</ul></section>
    ${backToBook(L, "side")}`;
  return shell(m, ctx, { title: "On the side", description: s.intro, image: "photo:garden-sun", body: sheet(inner, { chapterTitle: "On the side" }) });
}

const ABOUT = [
  ["project", "A brand or creative project"],
  ["leadership", "Design leadership"],
  ["speaking", "Speaking at an event"],
  ["mentoring", "Mentoring"],
  ["other", "Something else"],
];

function contact(m, ctx) {
  const L = (p) => href(ctx, p);
  const p = m.person;
  const about = ABOUT.some(([k]) => k === ctx.query.about) ? ctx.query.about : "project";
  const inner = `${opener(L, "contact", "Work with me", "Tell me what you're working on and how I can help.")}
    <div class="bk-two bk-two--contact">
      <form class="bk-form" data-mailto="${esc(p.email)}">
        <fieldset class="bk-form__about"><legend>What is it about?</legend>
          ${ABOUT.map(([k, l]) => `<label><input type="radio" name="about" value="${k}"${k === about ? " checked" : ""}><span>${esc(l)}</span></label>`).join("")}
        </fieldset>
        <label class="bk-field"><span>Your name</span><input name="name" autocomplete="name" required></label>
        <label class="bk-field"><span>Your email</span><input name="email" type="email" autocomplete="email" required></label>
        <label class="bk-field"><span>Message</span><textarea name="message" rows="5" required></textarea></label>
        <button class="bk-btn" type="submit">Open an email draft</button>
        <p class="bk-muted">The form opens an email to me with your message filled in.</p>
      </form>
      <dl class="bk-spec bk-spec--stack">
        <div><dt>Email</dt><dd><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></dd></div>
        <div><dt>Based in</dt><dd>${p.locations.map(esc).join(" and ")}. ${clocks()}</dd></div>
        <div><dt>Elsewhere</dt><dd>${p.socials.map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join(", ")}</dd></div>
        <div><dt>Ventures</dt><dd>${m.ventures.map((v) => (v.url ? `<a href="${esc(v.url)}" target="_blank" rel="noopener" data-track="venture_click" data-track-target="${esc(v.slug)}">${esc(v.name)}</a>` : esc(v.name))).join(" and ")} have their own teams and contacts.</dd></div>
      </dl>
    </div>
    ${backToBook(L, "contact")}`;
  return shell(m, ctx, { title: "Contact", body: sheet(inner, { chapterTitle: "Work with me" }) });
}

function index(m, ctx) {
  const L = (p) => href(ctx, p);
  const items = contentIndex(m);
  const groups = [...new Set(items.map((i) => i.type))];
  const inner = `${opener(L, "", "Everything", "Every case study, venture, note, talk and page on the site.")}
    <div class="bk-idx">${groups
      .map(
        (g) => `<div><h2 class="bk-h3">${esc(g)}</h2><ul>${items
          .filter((i) => i.type === g)
          .map((i) => {
            const h = i.path ? L(i.path) : i.href;
            return `<li><a href="${esc(h || "#")}"${i.path ? "" : extAttrs(h)}>${esc(i.title)}</a>${i.meta ? `<span>${esc(i.meta)}</span>` : ""}</li>`;
          })
          .join("")}</ul></div>`
      )
      .join("")}</div>
    ${backToBook(L, "")}`;
  return shell(m, ctx, { title: "Everything", body: sheet(inner, { chapterTitle: "Index" }) });
}

function experiments(m, ctx) {
  const L = (p) => href(ctx, p);
  const x = m.experiments;
  const shots = x.shots.map((s) => ({ ...s, m: media(s.media) })).filter((s) => s.m);
  const inner = `${opener(L, "", "Experiments", x.intro)}
    ${shots.length ? `<div class="bk-shots">${shots.map((s) => `<figure>${img(s.m, { width: 1200, alt: s.title || "" })}<figcaption><strong>${esc(s.title || "")}</strong> ${esc(s.caption || "")}</figcaption></figure>`).join("")}</div>` : `<p class="bk-lede">New experiments are on the way.</p>`}
    ${backToBook(L, "")}`;
  return shell(m, ctx, { title: "Experiments", description: x.intro, body: sheet(inner, { chapterTitle: "Experiments" }) });
}

function notFound(m, ctx) {
  const L = (p) => href(ctx, p);
  const inner = `${opener(L, "", "This page isn't in the book", "It has moved or never existed.")}
    <ul class="bk-lost">${NAV.map((s) => `<li><a href="${L(s.path)}">${s.label}</a></li>`).join("")}</ul>
    ${backToBook(L, "")}`;
  return shell(m, ctx, { title: "Not found", body: sheet(inner, { chapterTitle: "" }) });
}

const PAGES = { home, about, work, case: caseStudy, ventures, speaking, writing, article, side, contact, index, experiments, notFound };
export function render(key, m, ctx) {
  return (PAGES[key] || notFound)(m, ctx);
}
