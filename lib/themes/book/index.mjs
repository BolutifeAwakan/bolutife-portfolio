// Direction A — The Living Brand Book.
// The site is set as Bolutife's personal brand guidelines: a sequence of
// full-bleed plates (cover, mark, colour, type, photography, applications,
// architecture, tone of voice, editorial, off-grid, usage). Colours are
// sampled from her 2025 portraits. Instrument Sans (its width axis does the
// display work) with Instrument Serif for notes and quotes.

import { esc, img, media } from "../../media.mjs";
import { photo } from "../../photos.mjs";
import { headTags, href, paras, extAttrs, year, fmtDate } from "../../shell.mjs";
import { contentIndex, SECTIONS } from "../../model.mjs";
import { markBook } from "../marks.mjs";

/* ---------- the book's structure ---------- */

// Chapters, in order. Pages that have their own URL carry `path`; the rest
// live on the cover page as plates.
const CH = [
  { n: "01", key: "about", title: "Foundations", label: "About", path: "/about", tone: "plaster", line: "Who I am and what I believe" },
  { n: "02", key: "mark", title: "The mark", anchor: "mark", tone: "night", line: "One line holds the two letters" },
  { n: "03", key: "colour", title: "Colour", anchor: "colour", tone: "paper", line: "Six colours, all from the portraits" },
  { n: "04", key: "type", title: "Typography", anchor: "type", tone: "paper", line: "One family, two voices" },
  { n: "05", key: "photography", title: "Photography", anchor: "photography", tone: "night", line: "How the portraits are used" },
  { n: "06", key: "work", title: "Applications", label: "Work", path: "/work", tone: "paper", line: "The brands I've built" },
  { n: "07", key: "ventures", title: "Brand architecture", label: "Ventures", path: "/ventures", tone: "gold", line: "The organisations I founded" },
  { n: "08", key: "speaking", title: "Tone of voice", label: "Speaking", path: "/speaking", tone: "red", line: "What I sound like on stage" },
  { n: "09", key: "writing", title: "Editorial", label: "Writing", path: "/writing", tone: "paper", line: "Notes, and a book" },
  { n: "10", key: "side", title: "Off-grid", label: "On the side", path: "/on-the-side", tone: "sky", line: "Life outside the work" },
  { n: "11", key: "contact", title: "Usage", label: "Contact", path: "/contact", tone: "night", line: "How to get in touch" },
];
const TOTAL = CH.length;
const chapter = (key) => CH.find((c) => c.key === key);
const PAGE_CH = { about: "about", work: "work", case: "work", ventures: "ventures", speaking: "speaking", writing: "writing", article: "writing", side: "side", contact: "contact" };
const chHref = (L, c) => (c.path ? L(c.path) : `${L("/")}#${c.anchor}`);

// The palette. Each colour names the photograph it was sampled from.
const PALETTE = [
  { key: "green", name: "Aso Green", hex: "#23863A", rgb: "35 134 58", from: "the trousers", photo: "lawn-stand", spot: "47% 78%", ink: "#FFFFFF" },
  { key: "red", name: "Stripe Red", hex: "#8B0A2A", rgb: "139 10 42", from: "the patchwork top", photo: "textile-dark", spot: "46% 58%", ink: "#FFFFFF" },
  { key: "gold", name: "Backdrop Gold", hex: "#A8843F", rgb: "168 132 63", from: "the painted backdrop", photo: "chair-gold", spot: "18% 18%", ink: "#070908" },
  { key: "plaster", name: "Plaster", hex: "#DDD0C5", rgb: "221 208 197", from: "the colonnade", photo: "colonnade", spot: "78% 38%", ink: "#070908" },
  { key: "sky", name: "Garden Sky", hex: "#0186A2", rgb: "1 134 162", from: "the lawn shots", photo: "lawn-stand", spot: "22% 8%", ink: "#070908" },
  { key: "night", name: "Night", hex: "#070908", rgb: "7 9 8", from: "the studio shots", photo: "doorway-dark", spot: "50% 22%", ink: "#F6F3EE" },
];

/* ---------- shell ---------- */

function shell(m, ctx, { title, description, image, body, chapterKey, tone = "paper" }) {
  const L = (p) => href(ctx, p);
  const cur = chapterKey ? chapter(chapterKey) : null;
  const active = PAGE_CH[ctx.pageKey];
  const headLabel = cur ? `<span class="bk-run__n">${cur.n}</span> ${esc(cur.title)}` : "Cover";
  const folio = cur ? `${cur.n} / ${TOTAL}` : `00 / ${TOTAL}`;
  const footNav = [...SECTIONS, { key: "experiments", path: "/experiments", label: "Experiments" }, { key: "index", path: "/index", label: "Index" }];

  return `<!doctype html>
<html lang="en" class="bk">
<head>
${headTags(ctx, { title, description, image, path: ctx.path })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wdth,wght@0,75..100,400..700;1,75..100,400..700&family=Instrument+Serif:ital@0;1&display=swap">
<link rel="stylesheet" href="/assets/book.css?v=2">
<script src="/assets/book.js?v=2" defer></script>
</head>
<body class="bk-page bk-page--${ctx.pageKey}" data-head="${tone}">
<a class="bk-skip" href="#main">Skip to content</a>
<header class="bk-head bk-tone-${tone}">
  <a class="bk-head__brand" href="${L("/")}" aria-label="Bolutife Awakan, home">${markBook({ size: 26, title: "" })}<span class="bk-head__name">Bolutife Awakan</span><span class="bk-head__doc">Brand Guidelines</span></a>
  <p class="bk-head__run"><span class="bk-head__cur">${headLabel}</span></p>
  <div class="bk-head__end">
    <span class="bk-head__folio" aria-hidden="true">${folio}</span>
    <button class="bk-head__grid" type="button" aria-pressed="false" title="Show the layout grid">Grid</button>
    <button class="bk-head__toc" type="button" aria-haspopup="dialog" aria-controls="bk-contents">Contents</button>
  </div>
</header>
<dialog class="bk-contents" id="bk-contents" aria-label="Contents">
  <div class="bk-contents__in">
    <div class="bk-contents__top"><p class="bk-contents__title">Contents</p><button class="bk-contents__close" type="button">Close</button></div>
    <nav aria-label="Contents">
      <ol class="bk-contents__list">
        <li><a href="${L("/")}"${ctx.pageKey === "home" ? ' aria-current="page"' : ""}><span class="bk-contents__n">00</span><span class="bk-contents__t">Cover</span><span class="bk-contents__l">The headline</span></a></li>
        ${CH.map((c) => `<li class="bk-tone-${c.tone}"><a href="${chHref(L, c)}"${active && active === c.key ? ' aria-current="page"' : ""}><span class="bk-contents__n">${c.n}</span><span class="bk-contents__t">${esc(c.title)}${c.label ? `<span class="bk-contents__k">${esc(c.label)}</span>` : ""}</span><span class="bk-contents__l">${esc(c.line)}</span></a></li>`).join("")}
      </ol>
      <p class="bk-contents__appx"><a href="${L("/experiments")}">Appendix: Experiments</a><a href="${L("/index")}">Index of everything</a></p>
    </nav>
  </div>
</dialog>
<div class="bk-gridlay" aria-hidden="true">${"<span></span>".repeat(12)}</div>
<main id="main" class="bk-main">
${body}
</main>
${usage(m, L)}
<footer class="bk-foot bk-tone-night">
  <nav class="bk-foot__nav" aria-label="Footer">${footNav.map((s) => `<a href="${L(s.path)}"${active === s.key || ctx.pageKey === s.key ? ' aria-current="page"' : ""}>${esc(s.label)}</a>`).join("")}</nav>
  <ul class="bk-foot__social">${m.person.socials.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join("")}</ul>
  <p class="bk-foot__meta">Set in Instrument Sans and Instrument Serif. ${esc(m.photoCredit)}.<br>Bolutife Awakan, ${year()}.</p>
</footer>
</body>
</html>`;
}

// The last plate on every page: the same three calls to action in both
// directions (email, message, talk), set as the book's usage rule.
function usage(m, L) {
  const e = m.person.email;
  return `<section class="bk-usage bk-tone-night" data-plate data-ch="11" data-title="Usage" data-tone="night" aria-labelledby="usage-h">
  <div class="bk-usage__top">
    <p class="bk-pn">11</p>
    <h2 class="bk-usage__h" id="usage-h">Clear space for a conversation</h2>
    <p class="bk-note">Keep at least one idea of space around the address. Use it for brand projects, design leadership and speaking.</p>
  </div>
  <div class="bk-usage__spec">
    <span class="bk-usage__x bk-usage__x--t" aria-hidden="true">x</span>
    <span class="bk-usage__x bk-usage__x--r" aria-hidden="true">x</span>
    <span class="bk-usage__x bk-usage__x--b" aria-hidden="true">x</span>
    <span class="bk-usage__x bk-usage__x--l" aria-hidden="true">x</span>
    <a class="bk-usage__mail" href="mailto:${esc(e)}">${esc(e)}</a>
  </div>
  <p class="bk-usage__cta"><a class="bk-btn bk-btn--light" href="${L("/contact")}">Send a message</a><a class="bk-btn bk-btn--line" href="${L("/contact?about=speaking")}">Book a talk</a></p>
</section>`;
}

/* ---------- marks ---------- */

// The cover monogram: the mark drawn on its construction lines, with the
// guides running off the edge of the plate. Same geometry as markBook.
function coverMark() {
  return `<svg class="bk-cm" viewBox="0 0 124 100" role="img" aria-label="The BA monogram on its construction grid">
  <g class="bk-cm__guides" fill="none" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke">
    <path class="bk-cm__h" d="M-600 10H700"/><path class="bk-cm__h" d="M-600 52H700"/><path class="bk-cm__h" d="M-600 90H700"/>
    <path class="bk-cm__v" d="M10 -600V700"/><path class="bk-cm__v" d="M90 -600V700"/><path class="bk-cm__v" d="M114.6 -600V700"/>
    <circle class="bk-cm__c" cx="37" cy="33.25" r="18.75"/><circle class="bk-cm__c" cx="39" cy="68.75" r="16.75"/>
    <path class="bk-cm__d" d="M42.5 200L111.5 -76M68.5 -76L137.5 200" stroke-dasharray="2 3"/>
  </g>
  <g class="bk-cm__labels" fill="currentColor">
    <text x="118" y="8.5">cap</text><text x="118" y="50.5">waist</text><text x="118" y="88.5">baseline</text>
  </g>
  <clipPath id="bk-cm-clip"><rect x="0" y="10" width="124" height="80"/></clipPath>
  <g class="bk-cm__letters" clip-path="url(#bk-cm-clip)" fill="none" stroke="currentColor" stroke-width="9" stroke-linejoin="miter">
    <path pathLength="1" d="M14.5 10V90"/>
    <path pathLength="1" d="M10 14.5H37A18.75 18.75 0 0 1 37 52"/>
    <path pathLength="1" d="M10 85.5H39A16.75 16.75 0 0 0 39 52"/>
    <path pathLength="1" d="M70 90L90 10L110 90"/>
    <path pathLength="1" d="M14.5 52H99.5"/>
  </g>
</svg>`;
}

// The mark plate: the monogram on a unit grid (one unit = the stem),
// with its clear space and a dimension.
function specMark() {
  const lines = [];
  for (let x = -26; x <= 152; x += 9) lines.push(`M${x} -27V128`);
  for (let y = -26; y <= 128; y += 9) lines.push(`M-27 ${y}H152`);
  return `<svg class="bk-sm" viewBox="-30 -30 186 162" role="img" aria-label="The BA monogram with its clear space of two stem widths on every side">
  <path class="bk-sm__unit" d="${lines.join("")}" fill="none" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke"/>
  <rect class="bk-sm__clear" x="-8" y="-8" width="140.6" height="116" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" vector-effect="non-scaling-stroke"/>
  <g class="bk-sm__dim" fill="none" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke">
    <path d="M10 100V106M19 100V106M10 103H19"/>
    <path d="M-8 -14V-20M10 -14V-20M-8 -17H10"/>
  </g>
  <g class="bk-sm__txt" fill="currentColor">
    <text x="14.5" y="113" text-anchor="middle">x</text>
    <text x="1" y="-22" text-anchor="middle">2x</text>
  </g>
  <clipPath id="bk-sm-clip"><rect x="0" y="10" width="124" height="80"/></clipPath>
  <g clip-path="url(#bk-sm-clip)" fill="none" stroke="currentColor" stroke-width="9" stroke-linejoin="miter">
    <path d="M14.5 10V90M10 14.5H37A18.75 18.75 0 0 1 37 52M10 85.5H39A16.75 16.75 0 0 0 39 52M70 90L90 10L110 90M14.5 52H99.5"/>
  </g>
</svg>`;
}

/* ---------- parts ---------- */

// A chapter's opening plate on inner pages: colour field, big number, title.
function divider(key, { title, lead, kicker } = {}) {
  const c = chapter(key);
  return `<header class="bk-div bk-tone-${c.tone}" data-plate data-ch="${c.n}" data-title="${esc(c.title)}" data-tone="${c.tone}">
    <p class="bk-div__n" aria-hidden="true">${c.n}</p>
    <div class="bk-div__text">
      <p class="bk-div__k">${esc(kicker || `Chapter ${c.n}, ${c.title}`)}</p>
      <h1 class="bk-div__h">${esc(title || c.label || c.title)}</h1>
      ${lead ? `<p class="bk-div__lead">${esc(lead)}</p>` : ""}
    </div>
  </header>`;
}

// A plain opening plate for the appendix pages.
function plain(title, lead, kicker) {
  return `<header class="bk-div bk-div--plain bk-tone-paper" data-plate data-ch="" data-title="${esc(kicker)}" data-tone="paper">
    <div class="bk-div__text">
      <p class="bk-div__k">${esc(kicker)}</p>
      <h1 class="bk-div__h">${esc(title)}</h1>
      ${lead ? `<p class="bk-div__lead">${esc(lead)}</p>` : ""}
    </div>
  </header>`;
}

// Opening tag for a home plate.
const plate = (key, cls = "", extra = "") => {
  const c = chapter(key);
  return `<section class="bk-plate bk-plate--${key} bk-tone-${c.tone} ${cls}" id="${c.anchor || key}" data-plate data-ch="${c.n}" data-title="${esc(c.title)}" data-tone="${c.tone}" aria-labelledby="pl-${key}"${extra}>`;
};
const plateHead = (key, h, note = "") => {
  const c = chapter(key);
  return `<div class="bk-ph"><p class="bk-pn">${c.n}</p><h2 class="bk-ph__h" id="pl-${key}">${h}</h2>${note ? `<p class="bk-note bk-ph__note">${note}</p>` : ""}</div>`;
};

const crop = `<span class="bk-crop" aria-hidden="true"><i></i><i></i><i></i><i></i></span>`;

const spec = (rows) =>
  `<dl class="bk-spec">${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`)
    .join("")}</dl>`;

const projectSpec = (p) =>
  spec([
    ["Client", esc(p.client || p.title)],
    ["Sector", esc(p.services)],
    ["Year", esc(p.year)],
    ["Scope", (p.tags || []).map(esc).join(", ")],
  ]);

// Work as applications: image in a cropped frame with its spec sheet.
function application(L, p, { h = "h3", size = "", eager = false } = {}) {
  return `<article class="bk-app ${size}">
    <a class="bk-app__fig" href="${L(p.path)}" tabindex="-1" aria-hidden="true">${crop}${img(p.thumbnail || p.cover, { width: size === "bk-app--lead" ? 2000 : 1200, alt: "", eager })}</a>
    <div class="bk-app__cap">
      <${h} class="bk-app__t"><a href="${L(p.path)}">${esc(p.title)}</a></${h}>
      <p class="bk-app__s">${esc(p.summary)}</p>
      ${projectSpec(p)}
    </div>
  </article>`;
}

// One venture in neutral type: its own identity, not hers.
function ventureBox(v, { h = "h3", full = false } = {}) {
  return `<article class="bk-arch__box bk-arch__box--venture" id="${esc(v.slug)}" aria-labelledby="v-${esc(v.slug)}">
    <div class="bk-arch__plate"><${h} class="bk-arch__name" id="v-${esc(v.slug)}">${esc(v.name)}</${h}></div>
    <p class="bk-arch__rel">${esc(v.kind)}. Founded by Bolutife.</p>
    <p class="bk-arch__line">${esc(v.line)}</p>
    ${full ? `<p class="bk-arch__body">${esc(v.body)}</p>` : ""}
    ${full && v.offers.length ? `<ul class="bk-arch__offers">${v.offers.map((o) => `<li><${h === "h2" ? "h3" : "h4"}>${esc(o.title)}</${h === "h2" ? "h3" : "h4"}><p>${esc(o.body)}</p></li>`).join("")}</ul>` : ""}
    ${v.url ? `<p class="bk-arch__link"><a class="bk-link" href="${esc(v.url)}" target="_blank" rel="noopener" data-track="venture_click" data-track-target="${esc(v.slug)}">${esc(v.cta)}</a></p>` : `<p class="bk-arch__link bk-note">Its own site is on the way.</p>`}
  </article>`;
}

function architecture(m, { h = "h3", full = false } = {}) {
  return `<div class="bk-arch${full ? " bk-arch--full" : ""}">
    <article class="bk-arch__box bk-arch__box--self" aria-labelledby="v-self">
      <div class="bk-arch__plate bk-arch__plate--self">${markBook({ size: 64, title: "" })}<${h} class="bk-arch__name" id="v-self">Bolutife Awakan</${h}></div>
      <p class="bk-arch__rel">Personal brand. This book.</p>
      <p class="bk-arch__line">${m.person.identity.map(esc).join(", ")}.</p>
    </article>
    ${m.ventures.map((v) => ventureBox(v, { h, full })).join("")}
  </div>`;
}

function noteRows(L, notes, { limit, h = "h3" } = {}) {
  const list = limit ? notes.slice(0, limit) : notes;
  return `<ol class="bk-notes">${list
    .map((n) => {
      const u = n.path ? L(n.path) : n.href || "#";
      return `<li class="bk-notes__i">
        <a class="bk-notes__a" href="${esc(u)}"${n.path ? "" : extAttrs(u)}>
          <span class="bk-notes__d">${esc(n.date ? fmtDate(n.date) : "")}</span>
          <${h} class="bk-notes__t">${esc(n.title)}</${h}>
          <span class="bk-notes__s">${esc(n.summary || "")}${n.readTime ? ` <span class="bk-notes__r">${n.readTime} min</span>` : ""}</span>
        </a>
        ${media(n.thumbnail) ? `<span class="bk-notes__img" aria-hidden="true">${img(n.thumbnail, { width: 600, alt: "" })}</span>` : ""}
      </li>`;
    })
    .join("")}</ol>`;
}

// The book, drawn as an object rather than described.
function bookObject(b, { h = "h3" } = {}) {
  return `<div class="bk-bookobj">
    <div class="bk-bookobj__cover" aria-hidden="true"><span class="bk-bookobj__spine"></span><span class="bk-bookobj__t">${esc(b.title)}</span><span class="bk-bookobj__a">Bolutife Awakan</span></div>
    <div class="bk-bookobj__text">
      <${h} class="bk-bookobj__h">${esc(b.title)}</${h}>
      <p>${esc(b.line)}</p>
      ${b.url ? `<p><a class="bk-link" href="${esc(b.url)}" target="_blank" rel="noopener" data-track="book_click" data-track-target="book">${esc(b.cta)}</a></p>` : ""}
    </div>
  </div>`;
}

const OFFGRID = [
  ["garden-sun", "a"],
  ["chair-gold", "b"],
  ["lawn-crouch", "c"],
  ["arch-mono", "d"],
];

function offGrid(m, { h = "h3", all = false } = {}) {
  const words = m.side.interests;
  return `<div class="bk-off">
    ${OFFGRID.map(([k, pos]) => `<figure class="bk-off__ph bk-off__ph--${pos}">${photo(k, { sizes: "(max-width: 760px) 46vw, 22vw" })}</figure>`).join("")}
    <ul class="bk-off__words">${words.map((x, i) => `<li class="bk-off__w bk-off__w--${i}"><${h}>${esc(x.title)}</${h}>${all ? `<p>${esc(x.body)}</p>` : ""}</li>`).join("")}</ul>
  </div>`;
}

const sentences = (t = "") => String(t).match(/[^.!?]+[.!?]+/g) || [t];

/* ---------- home: the plates ---------- */

function home(m, ctx) {
  const L = (p) => href(ctx, p);
  const p = m.person;
  const s = m.speaking;
  const body = `
<section class="bk-cover bk-tone-green" data-plate data-ch="00" data-title="Cover" data-tone="green" aria-labelledby="cover-h">
  <div class="bk-cover__mark">${coverMark()}</div>
  <div class="bk-cover__meta">
    <p class="bk-cover__name">Bolutife Awakan</p>
    <p class="bk-cover__ed">Brand Guidelines<br>Edition 2026</p>
  </div>
  <figure class="bk-cover__photo"><span class="bk-frame">${crop}${photo("textile-dark", { sizes: "(max-width: 760px) 60vw, 24vw", eager: true })}</span><figcaption class="bk-note">Primary portrait</figcaption></figure>
  <h1 class="bk-cover__h" id="cover-h">${esc(p.headline)}</h1>
  <ul class="bk-cover__id">${p.identity.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
</section>

<section class="bk-toc bk-tone-paper" data-plate data-ch="00" data-title="Contents" data-tone="paper" aria-labelledby="toc-h">
  <div class="bk-toc__side"><h2 class="bk-toc__h" id="toc-h">Contents</h2><p class="bk-toc__sup">${esc(p.supporting)}</p></div>
  <ol class="bk-toc__list">${CH.map((c) => `<li class="bk-tone-${c.tone}"><a href="${chHref(L, c)}"><span class="bk-toc__n">${c.n}</span><span class="bk-toc__t">${esc(c.title)}</span><span class="bk-toc__l">${esc(c.label || c.line)}</span></a></li>`).join("")}</ol>
</section>

${plate("about")}
  ${plateHead("about", "Foundations")}
  <div class="bk-found">
    <figure class="bk-found__ph">${crop}${photo("colonnade", { sizes: "(max-width: 760px) 70vw, 28vw" })}</figure>
    <blockquote class="bk-found__belief"><p>${esc(m.practice.belief)}</p></blockquote>
    <ul class="bk-found__areas">${m.practice.areas.map((a) => `<li><h3>${esc(a.title)}</h3><p>${esc(a.body)}</p></li>`).join("")}</ul>
    <p class="bk-found__more"><a class="bk-link" href="${L("/about")}">Read the foundations</a></p>
  </div>
</section>

${plate("mark")}
  ${plateHead("mark", "The mark", "The B's waist runs on as the A's crossbar. One line holds the two letters together.")}
  <div class="bk-markplate">
    <div class="bk-markplate__spec">${specMark()}</div>
    <dl class="bk-markplate__rules">
      <div><dt>Unit</dt><dd>x, the width of one stem</dd></div>
      <div><dt>Clear space</dt><dd>2x on every side</dd></div>
      <div><dt>Smallest size</dt><dd>16 pixels high</dd></div>
    </dl>
    <ul class="bk-markplate__ways" aria-label="The mark in each colourway">${PALETTE.map((c) => `<li style="--bg:${c.hex};--fg:${c.ink}">${markBook({ size: 46, title: `On ${c.name}` })}<span>${esc(c.name)}</span></li>`).join("")}</ul>
  </div>
</section>

${plate("colour")}
  ${plateHead("colour", "Colour", "Every colour was sampled from the 2025 portraits. Select one to copy its value.")}
  <ul class="bk-swatches">${PALETTE.map((c) => `<li class="bk-sw" style="--bg:${c.hex};--fg:${c.ink}">
      <button class="bk-sw__b" type="button" data-copy="${c.hex}" aria-label="Copy ${esc(c.name)}, ${c.hex}">
        <span class="bk-sw__name">${esc(c.name)}</span>
        <span class="bk-sw__vals"><span>${c.hex}</span><span>RGB ${c.rgb}</span></span>
        <span class="bk-sw__from"><span class="bk-sw__crop" style="--spot:${c.spot}">${photo(c.photo, { sizes: "120px", alt: "" })}</span><span>From ${esc(c.from)}</span></span>
      </button>
    </li>`).join("")}</ul>
  <p class="bk-sr" aria-live="polite" data-copied></p>
</section>

${plate("type")}
  ${plateHead("type", "Typography", "Instrument Sans carries the voice. Its narrow widths do the shouting; Instrument Serif keeps the notes.")}
  <div class="bk-type">
    <p class="bk-type__spec" data-specimen aria-hidden="true">Bolutife</p>
    <div class="bk-type__ctl">
      <label><span>Width <output data-out="wdth">75</output></span><input type="range" min="75" max="100" step="1" value="75" data-axis="wdth"></label>
      <label><span>Weight <output data-out="wght">700</output></span><input type="range" min="400" max="700" step="10" value="700" data-axis="wght"></label>
    </div>
    <div class="bk-type__pair">
      <div><p class="bk-type__face">Instrument Sans</p><p class="bk-type__aa" aria-hidden="true">Aa</p><p class="bk-note">Display and text. Widths 75 to 100, weights 400 to 700.</p></div>
      <div><p class="bk-type__face bk-type__face--serif">Instrument Serif</p><p class="bk-type__aa bk-type__aa--serif" aria-hidden="true">Aa</p><p class="bk-note">Notes, captions and quotes. Italic only when it is said aloud.</p></div>
    </div>
    <p class="bk-type__text">${esc(m.practice.operator)}</p>
  </div>
</section>

${plate("photography")}
  ${plateHead("photography", "Photography", `${esc(m.photoCredit)}.`)}
  <ul class="bk-photos">
    <li class="bk-photos__i bk-photos__i--a"><figure><span class="bk-frame">${crop}${photo("steps-smile", { sizes: "(max-width: 760px) 92vw, 40vw" })}</span><figcaption><strong>Do.</strong> Let the textile lead.</figcaption></figure></li>
    <li class="bk-photos__i bk-photos__i--b"><figure><span class="bk-frame">${crop}${photo("doorway-dark", { sizes: "(max-width: 760px) 44vw, 18vw" })}</span><figcaption><strong>Do.</strong> Give her room. Small in the frame still reads.</figcaption></figure></li>
    <li class="bk-photos__i bk-photos__i--c"><figure><span class="bk-frame">${crop}${photo("portrait-mono", { sizes: "(max-width: 760px) 44vw, 18vw" })}</span><figcaption><strong>Do.</strong> Black and white for the quieter pages.</figcaption></figure></li>
    <li class="bk-photos__i bk-photos__i--d"><figure><span class="bk-frame">${crop}${photo("garden-sun", { sizes: "(max-width: 760px) 44vw, 18vw" })}</span><figcaption><strong>Do.</strong> Daylight for the open, outdoor side.</figcaption></figure></li>
    <li class="bk-photos__i bk-photos__i--e bk-photos__i--dont"><figure><span class="bk-frame">${crop}<span class="bk-photos__dont">${photo("steps-seated", { sizes: "(max-width: 760px) 44vw, 18vw", alt: "A stone staircase, cropped so the person sitting on it is out of frame" })}</span></span><figcaption><strong>Don't.</strong> Crop out the person to keep the place.</figcaption></figure></li>
  </ul>
</section>

${plate("work")}
  ${plateHead("work", "Applications", "Identities, systems and creative direction, in use.")}
  <div class="bk-apps bk-apps--home">
    ${m.work.featured.map((x, i) => application(L, x, { size: i === 0 ? "bk-app--lead" : "" })).join("")}
  </div>
  <p class="bk-plate__more"><a class="bk-link" href="${L("/work")}">All applications</a></p>
</section>

${plate("ventures")}
  ${plateHead("ventures", "Brand architecture", "A house of brands, not a branded house. I founded these organisations; each keeps its own name, look and voice.")}
  ${architecture(m)}
  <p class="bk-plate__more"><a class="bk-link" href="${L("/ventures")}">How each one works</a></p>
</section>

${plate("speaking")}
  ${plateHead("speaking", "Tone of voice", "From how I approach every talk.")}
  <div class="bk-tone">
    <p class="bk-tone__words" aria-label="Practical, human, memorable."><span>Practical.</span><span>Human.</span><span>Memorable.</span></p>
    <div class="bk-tone__side">
      <p class="bk-tone__promise">${esc(s.promise)}</p>
      <h3 class="bk-tone__k">Talking points</h3>
      <ul class="bk-tone__pts">${s.tracks.map((t) => `<li>${esc(t.title)}</li>`).join("")}</ul>
      <p class="bk-tone__cta"><a class="bk-btn bk-btn--light" href="${L("/contact?about=speaking")}">Book me to speak</a><a class="bk-link" href="${L("/speaking")}">Talks and topics</a></p>
    </div>
  </div>
</section>

${plate("writing")}
  ${plateHead("writing", "Editorial", esc(m.writing.intro))}
  <div class="bk-edit">
    ${noteRows(L, m.writing.notes, { limit: 3 })}
    ${m.books.map((b) => bookObject(b)).join("")}
  </div>
  <p class="bk-plate__more"><a class="bk-link" href="${L("/writing")}">All writing</a></p>
</section>

${plate("side")}
  ${plateHead("side", "Off-grid", "The one page where the grid is allowed to break.")}
  ${offGrid(m)}
  <p class="bk-off__intro">${esc(sentences(m.side.intro).slice(-2).join(" ").trim())}</p>
  <p class="bk-plate__more"><a class="bk-link" href="${L("/on-the-side")}">On the side</a></p>
</section>`;
  return shell(m, ctx, { body, image: "photo:textile-dark", tone: "green" });
}

/* ---------- inner pages ---------- */

function about(m, ctx) {
  const L = (p) => href(ctx, p);
  const a = m.about;
  const body = `${divider("about", { title: "About", lead: m.person.identity.join(", ") + "." })}
  <section class="bk-sheet bk-tone-paper" data-plate data-ch="01" data-title="Foundations" data-tone="paper" aria-labelledby="ab-who">
    <div class="bk-who">
      <figure class="bk-who__ph">${crop}${photo("colonnade", { sizes: "(max-width: 760px) 92vw, 36vw", eager: true })}</figure>
      <div class="bk-who__text">
        <h2 class="bk-h2" id="ab-who">Who I am</h2>
        <div class="bk-read">${a.paragraphs.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
      </div>
    </div>
  </section>

  <section class="bk-sheet bk-tone-plaster" data-plate data-ch="01" data-title="Foundations" data-tone="plaster" aria-labelledby="ab-path">
    <h2 class="bk-h2" id="ab-path">The path</h2>
    <ol class="bk-path">${a.path.map((s, i) => `<li><span class="bk-path__n">${String(i + 1).padStart(2, "0")}</span><h3>${esc(s.when)}</h3><p>${esc(s.text)}</p></li>`).join("")}</ol>
  </section>

  <section class="bk-sheet bk-tone-paper" data-plate data-ch="01" data-title="Foundations" data-tone="paper" aria-labelledby="ab-belief">
    <h2 class="bk-h2" id="ab-belief">What I believe</h2>
    <blockquote class="bk-found__belief bk-found__belief--page"><p>${esc(m.practice.belief)}</p></blockquote>
    <p class="bk-quote-note">${esc(m.practice.operator)}</p>
    <div class="bk-cols3">
      ${m.practice.areas.map((x) => `<div><h3 class="bk-h3">${esc(x.title)}</h3><p>${esc(x.body)}</p></div>`).join("")}
    </div>
    <h3 class="bk-h3 bk-gap">Services</h3>
    <div class="bk-cols3">${m.practice.services.map((s) => `<div><h4 class="bk-h4">${esc(s.title)}</h4><p>${esc(s.body)}</p>${(s.tags || []).length ? `<p class="bk-note">${s.tags.map(esc).join(", ")}</p>` : ""}</div>`).join("")}</div>
  </section>

  <section class="bk-sheet bk-tone-paper" data-plate data-ch="01" data-title="Foundations" data-tone="paper" aria-labelledby="ab-record">
    <h2 class="bk-h2" id="ab-record">The record</h2>
    <div class="bk-record">
      <div><h3 class="bk-h3">Experience</h3>${table(["Years", "Role", "Organisation"], a.experience.map((x) => [String(x.period || "").replace(/[()]/g, ""), x.role, x.org]))}</div>
      <div><h3 class="bk-h3">Education</h3>${table(["Year", "Programme", "Institution"], a.education.map((x) => [x.year, x.title, x.org]))}<p class="bk-note bk-gap-s">${esc(m.mentoring)}</p></div>
      <div><h3 class="bk-h3">Recognition</h3>${table(["Year", "Award", "Given by"], a.awards.map((x) => [x.year, x.title, x.org]))}</div>
      <div><h3 class="bk-h3">Milestones</h3>${table(["Year", "Milestone"], a.career.map((x) => [x.year, x.text]))}</div>
    </div>
  </section>

  ${a.testimonials.length ? `<section class="bk-sheet bk-tone-green" data-plate data-ch="01" data-title="Foundations" data-tone="green" aria-labelledby="ab-say">
    <h2 class="bk-h2" id="ab-say">In other people's words</h2>
    <div class="bk-quotes">${a.testimonials.map((t) => `<figure class="bk-quote"><blockquote><p>${esc(t.quote)}</p></blockquote><figcaption>${esc(t.name)}<span>${esc(t.role)}</span></figcaption></figure>`).join("")}</div>
  </section>` : ""}`;
  return shell(m, ctx, { title: "About", description: m.person.supporting, image: "photo:colonnade", body, chapterKey: "about", tone: "plaster" });
}

function table(head, rows) {
  return `<table class="bk-table"><thead><tr>${head.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

function work(m, ctx) {
  const L = (p) => href(ctx, p);
  const body = `${divider("work", { title: "Work", lead: "Brand identities, systems and creative direction for companies, events and founders since 2013." })}
  <section class="bk-sheet bk-tone-paper" data-plate data-ch="06" data-title="Applications" data-tone="paper" aria-label="All work">
    <div class="bk-apps bk-apps--all">${m.work.all.map((p, i) => application(L, p, { h: "h2", size: i % 3 === 0 ? "bk-app--lead" : "", eager: i === 0 })).join("")}</div>
  </section>`;
  return shell(m, ctx, { title: "Work", body, chapterKey: "work", tone: "paper" });
}

function caseStudy(m, ctx) {
  const L = (p) => href(ctx, p);
  const p = ctx.project;
  const idx = m.work.all.findIndex((x) => x.slug === p.slug);
  const prev = m.work.all[(idx - 1 + m.work.all.length) % m.work.all.length];
  const next = m.work.all[(idx + 1) % m.work.all.length];
  let fig = 0;
  const gallery = (images = []) => {
    const items = (images || []).map(media).filter(Boolean);
    if (!items.length) return "";
    return `<div class="bk-gallery">${items
      .map((im) => `<figure class="bk-g bk-g--${im.size === "half" ? "half" : "full"}">${img(im, { width: im.size === "half" ? 1400 : 2400 })}<figcaption class="bk-note">Fig. ${++fig}${im.alt ? `, ${esc(im.alt)}` : ""}</figcaption></figure>`)
      .join("")}</div>`;
  };
  const body = `<article class="bk-case">
    <header class="bk-case__head bk-tone-paper" data-plate data-ch="06" data-title="Applications" data-tone="paper">
      <p class="bk-div__k"><a href="${L("/work")}">06 Applications</a>, sheet ${String(idx + 1).padStart(2, "0")} of ${String(m.work.all.length).padStart(2, "0")}</p>
      <h1 class="bk-case__t">${esc(p.title)}</h1>
      <p class="bk-case__s">${esc(p.summary)}</p>
      ${projectSpec(p)}
    </header>
    ${p.cover ? `<figure class="bk-case__cover">${img(p.cover, { width: 2400, eager: true, alt: p.title })}</figure>` : ""}
    <div class="bk-case__intro bk-read bk-read--lede">${paras(p.intro)}</div>
    ${(p.sections || [])
      .map(
        (s) => `<section class="bk-case__sec">
        ${s.heading || s.body ? `<div class="bk-case__text">${s.heading ? `<h2 class="bk-case__h">${esc(s.heading)}</h2>` : "<span></span>"}<div class="bk-read">${paras(s.body)}</div></div>` : ""}
        ${gallery(s.images)}
      </section>`
      )
      .join("")}
  </article>
  <nav class="bk-pager" aria-label="More case studies">
    <a href="${L(prev.path)}"><span class="bk-note">Previous sheet</span><span class="bk-pager__t">${esc(prev.title)}</span></a>
    <a href="${L(next.path)}"><span class="bk-note">Next sheet</span><span class="bk-pager__t">${esc(next.title)}</span></a>
  </nav>`;
  return shell(m, ctx, { title: p.title, description: p.summary, image: p.thumbnail || p.cover, body, chapterKey: "work", tone: "paper" });
}

function ventures(m, ctx) {
  const L = (p) => href(ctx, p);
  const body = `${divider("ventures", { title: "Ventures", lead: "A house of brands, not a branded house. I founded these organisations; each keeps its own name, look and voice." })}
  <section class="bk-sheet bk-tone-paper" data-plate data-ch="07" data-title="Brand architecture" data-tone="paper" aria-label="The organisations">
    ${architecture(m, { h: "h2", full: true })}
  </section>
  <section class="bk-sheet bk-tone-plaster" data-plate data-ch="07" data-title="Brand architecture" data-tone="plaster" id="mentoring" aria-labelledby="v-mentor">
    <div class="bk-split">
      <h2 class="bk-h2" id="v-mentor">Mentoring</h2>
      <div><p class="bk-lede">${esc(m.mentoring)}</p><p class="bk-gap-s"><a class="bk-link" href="${L("/contact?about=mentoring")}">Ask about mentoring</a></p></div>
    </div>
  </section>`;
  return shell(m, ctx, { title: "Ventures", description: m.ventures.map((v) => `${v.name}: ${v.line}`).join(" "), body, chapterKey: "ventures", tone: "gold" });
}

function speaking(m, ctx) {
  const L = (p) => href(ctx, p);
  const s = m.speaking;
  const body = `${divider("speaking", { title: "Speaking", lead: s.promise })}
  <section class="bk-sheet bk-tone-red bk-sheet--tone" data-plate data-ch="08" data-title="Tone of voice" data-tone="red" aria-labelledby="sp-voice">
    <h2 class="bk-sr" id="sp-voice">How I speak</h2>
    <p class="bk-tone__words" aria-hidden="true"><span>Practical.</span><span>Human.</span><span>Memorable.</span></p>
    <div class="bk-split bk-split--tone">
      <div class="bk-read"><p>${esc(s.intro)}</p></div>
      <div>${spec([["Formats", s.formats.map(esc).join(", ")]])}</div>
    </div>
    ${s.image ? `<figure class="bk-wide">${crop}${img(s.image, { width: 2400, alt: "Bolutife speaking on stage" })}</figure>` : ""}
  </section>
  <section class="bk-sheet bk-tone-paper" data-plate data-ch="08" data-title="Tone of voice" data-tone="paper" aria-labelledby="sp-points">
    <h2 class="bk-h2" id="sp-points">Talking points</h2>
    <ol class="bk-points">${s.tracks.map((t, i) => `<li><span class="bk-path__n">${String(i + 1).padStart(2, "0")}</span><h3>${esc(t.title)}</h3><p>${esc(t.body)}</p></li>`).join("")}</ol>
  </section>
  <section class="bk-sheet bk-tone-paper" data-plate data-ch="08" data-title="Tone of voice" data-tone="paper" id="talks" aria-labelledby="sp-talks">
    <h2 class="bk-h2" id="sp-talks">Talks</h2>
    <ul class="bk-talks">${s.talks.map((t) => `<li><h3 class="bk-talks__t">${esc(t.title)}</h3><p class="bk-note">${esc([t.track, t.event].filter(Boolean).join(". "))}</p></li>`).join("")}</ul>
    <h2 class="bk-h2 bk-gap">Where I've spoken</h2>
    <ul class="bk-appear">${s.appearances.map((a) => `<li><h3>${esc(a.title)}</h3><p>${esc(a.body)}</p></li>`).join("")}</ul>
    ${s.photos.length ? `<div class="bk-strip">${s.photos.map((ph) => `<figure>${img(ph, { width: 1000, alt: "Bolutife speaking" })}</figure>`).join("")}</div>` : ""}
    <p class="bk-gap"><a class="bk-btn" href="${L("/contact?about=speaking")}">Book me to speak</a>${s.press.map(([u, l]) => ` <a class="bk-link bk-press" href="${esc(u)}" target="_blank" rel="noopener">${esc(l)}</a>`).join("")}</p>
  </section>`;
  return shell(m, ctx, { title: "Speaking", description: s.promise, image: s.image, body, chapterKey: "speaking", tone: "red" });
}

function writing(m, ctx) {
  const L = (p) => href(ctx, p);
  const body = `${divider("writing", { title: "Writing", lead: m.writing.intro })}
  <section class="bk-sheet bk-tone-paper" data-plate data-ch="09" data-title="Editorial" data-tone="paper" aria-labelledby="wr-notes">
    <h2 class="bk-sr" id="wr-notes">Notes</h2>
    ${noteRows(L, m.writing.notes)}
  </section>
  <section class="bk-sheet bk-tone-plaster" data-plate data-ch="09" data-title="Editorial" data-tone="plaster" id="books" aria-labelledby="wr-books">
    <h2 class="bk-h2" id="wr-books">Books</h2>
    ${m.books.map((b) => bookObject(b)).join("")}
  </section>`;
  return shell(m, ctx, { title: "Writing", description: m.writing.intro, body, chapterKey: "writing", tone: "paper" });
}

function article(m, ctx) {
  const L = (p) => href(ctx, p);
  const n = ctx.note;
  const list = m.writing.notes.filter((x) => x.internal);
  const i = list.findIndex((x) => x.slug === n.slug);
  const next = list.length > 1 ? list[(i + 1) % list.length] : null;
  const body = `<article class="bk-article">
    <header class="bk-article__head bk-tone-paper" data-plate data-ch="09" data-title="Editorial" data-tone="paper">
      <p class="bk-div__k"><a href="${L("/writing")}">09 Editorial</a>${(n.tags || []).length ? `, ${n.tags.map(esc).join(", ")}` : ""}</p>
      <h1 class="bk-article__t">${esc(n.title)}</h1>
      ${n.summary ? `<p class="bk-article__s">${esc(n.summary)}</p>` : ""}
      <p class="bk-article__by">Bolutife Awakan${n.date ? `<br>${esc(fmtDate(n.date))}` : ""}${n.readTime ? `<br>${n.readTime} minute read` : ""}</p>
    </header>
    ${media(n.thumbnail) ? `<figure class="bk-article__cover">${img(n.thumbnail, { width: 2400, eager: true, alt: "" })}</figure>` : ""}
    <div class="bk-article__body">
      ${n.quote ? `<p class="bk-article__q">${esc(n.quote)}</p>` : ""}
      ${(n.sections || [])
        .map(
          (s) => `${s.heading ? `<h2>${esc(s.heading)}</h2>` : ""}${paras(s.body)}
          ${s.pullQuote ? `<blockquote class="bk-pull"><p>${esc(s.pullQuote)}</p></blockquote>` : ""}
          ${media(s.image) ? `<figure class="bk-article__img">${img(s.image, { width: 1600, alt: s.image.alt || "" })}</figure>` : ""}`
        )
        .join("")}
    </div>
  </article>
  ${next ? `<nav class="bk-pager bk-pager--one" aria-label="Next note"><a href="${L(next.path)}"><span class="bk-note">Next note</span><span class="bk-pager__t">${esc(next.title)}</span></a></nav>` : ""}`;
  return shell(m, ctx, { title: n.title, description: n.summary || n.title, image: n.thumbnail, body, chapterKey: "writing", tone: "paper" });
}

const SHEET = ["steps-smile", "steps-seated", "colonnade", "chair-gold", "portrait-mono", "stairs-dark", "doorway-dark", "textile-dark", "arch-mono", "arch-white", "garden-sun", "lawn-crouch", "lawn-stand"];

function side(m, ctx) {
  const s = m.side;
  const body = `${divider("side", { title: "On the side", lead: "The one chapter where the grid is allowed to break." })}
  <section class="bk-sheet bk-tone-sky bk-sheet--off" data-plate data-ch="10" data-title="Off-grid" data-tone="sky" aria-labelledby="sd-enjoy">
    <h2 class="bk-sr" id="sd-enjoy">What I enjoy</h2>
    ${offGrid(m, { all: true })}
    <p class="bk-off__intro bk-off__intro--page">${esc(s.intro)}</p>
    ${s.offDutyLine ? `<p class="bk-note bk-off__duty">${esc(s.offDutyLine)}</p>` : ""}
  </section>
  ${s.nowPlaying ? `<section class="bk-sheet bk-tone-night" data-plate data-ch="10" data-title="Off-grid" data-tone="night" aria-labelledby="sd-np">
    <div class="bk-np">
      <div class="bk-np__sleeve">${img(s.nowPlaying.cover, { width: 600, alt: `Cover of ${s.nowPlaying.album}` })}<span class="bk-np__disc" aria-hidden="true"></span></div>
      <div><h2 class="bk-np__k" id="sd-np">On repeat</h2><p class="bk-np__song">${esc(s.nowPlaying.song)}</p><p>${esc(s.nowPlaying.artist)} ${esc(s.nowPlaying.album)}</p>${s.nowPlaying.url ? `<p class="bk-gap-s"><a class="bk-link" href="${esc(s.nowPlaying.url)}" target="_blank" rel="noopener">Listen</a></p>` : ""}</div>
    </div>
  </section>` : ""}
  <section class="bk-sheet bk-tone-paper" data-plate data-ch="10" data-title="Off-grid" data-tone="paper" aria-labelledby="sd-sheet">
    <div class="bk-split"><h2 class="bk-h2" id="sd-sheet">Contact sheet</h2><p class="bk-note">${esc(m.photoCredit)}.</p></div>
    <ol class="bk-csheet">${SHEET.map((k, i) => `<li><figure>${photo(k, { sizes: "(max-width: 760px) 46vw, 16vw" })}<figcaption>${String(i + 1).padStart(2, "0")}</figcaption></figure></li>`).join("")}</ol>
  </section>`;
  return shell(m, ctx, { title: "On the side", description: s.intro, image: "photo:garden-sun", body, chapterKey: "side", tone: "sky" });
}

const ABOUT = [
  ["project", "A brand or creative project"],
  ["leadership", "Design leadership"],
  ["speaking", "Speaking at an event"],
  ["mentoring", "Mentoring"],
  ["other", "Something else"],
];

function contact(m, ctx) {
  const p = m.person;
  const about = ABOUT.some(([k]) => k === ctx.query.about) ? ctx.query.about : "project";
  const body = `${divider("contact", { title: "Contact", lead: "Tell me what you're working on and how I can help." })}
  <section class="bk-sheet bk-tone-paper" data-plate data-ch="11" data-title="Usage" data-tone="paper" aria-labelledby="ct-form">
    <div class="bk-contact">
      <div class="bk-contact__info">
        <h2 class="bk-h2" id="ct-form">Write to me</h2>
        ${spec([
          ["Email", `<a class="bk-link" href="mailto:${esc(p.email)}">${esc(p.email)}</a>`],
          ["Based in", p.locations.map(esc).join(" and ")],
          ["Elsewhere", p.socials.map((s) => `<a class="bk-link" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join(", ")],
        ])}
        <p class="bk-note bk-gap-s">For Design Lever or Lilac Africa, use each organisation's own channels.</p>
      </div>
      <form class="bk-form" data-mailto="${esc(p.email)}">
        <fieldset class="bk-form__about">
          <legend>What is it about?</legend>
          ${ABOUT.map(([k, l]) => `<label><input type="radio" name="about" value="${k}"${k === about ? " checked" : ""}><span>${esc(l)}</span></label>`).join("")}
        </fieldset>
        <label class="bk-field"><span>Your name</span><input name="name" autocomplete="name" required></label>
        <label class="bk-field"><span>Your email</span><input name="email" type="email" autocomplete="email" required></label>
        <label class="bk-field"><span>Message</span><textarea name="message" rows="6" required></textarea></label>
        <button class="bk-btn" type="submit">Open an email draft</button>
        <p class="bk-note">The form opens an email to me with your message filled in.</p>
      </form>
    </div>
  </section>`;
  return shell(m, ctx, { title: "Contact", body, chapterKey: "contact", tone: "night" });
}

function index(m, ctx) {
  const L = (p) => href(ctx, p);
  const items = contentIndex(m);
  const groups = [...new Set(items.map((i) => i.type))];
  const body = `${plain("Index", "Every case study, venture, note, talk and page in this book.", "Index")}
  <section class="bk-sheet bk-tone-paper" aria-label="Everything">
    <div class="bk-index">${groups
      .map(
        (g, gi) => `<section aria-labelledby="ix-${gi}"><h2 class="bk-h3" id="ix-${gi}">${esc(g)}</h2><ul>${items
          .filter((i) => i.type === g)
          .map((i) => {
            const u = i.path ? L(i.path) : i.href;
            return `<li><a href="${esc(u || "#")}"${i.path ? "" : extAttrs(u)}><span>${esc(i.title)}</span><span class="bk-index__m">${esc(i.meta || "")}</span></a></li>`;
          })
          .join("")}</ul></section>`
      )
      .join("")}</div>
  </section>`;
  return shell(m, ctx, { title: "Index", body });
}

function experiments(m, ctx) {
  const x = m.experiments;
  const shots = x.shots.map((s) => ({ ...s, m: media(s.media) })).filter((s) => s.m);
  const body = `${plain("Experiments", x.intro, "Appendix")}
  <section class="bk-sheet bk-tone-paper" aria-label="Experiments">
    ${shots.length ? `<div class="bk-shots">${shots.map((s, i) => `<figure class="bk-shot${s.wide ? " bk-shot--wide" : ""}"><span class="bk-frame">${crop}${img(s.m, { width: s.wide ? 1600 : 1000, alt: s.title || "" })}</span><figcaption class="bk-note">Plate ${i + 1}${s.title ? `, ${esc(s.title)}` : ""}${s.category ? `. ${esc(s.category)}` : ""}</figcaption></figure>`).join("")}</div>` : `<p class="bk-lede">New experiments are on the way.</p>`}
  </section>`;
  return shell(m, ctx, { title: "Experiments", description: x.intro, body });
}

function notFound(m, ctx) {
  const L = (p) => href(ctx, p);
  const body = `${plain("This page isn't in the book", "It may have moved. Every chapter is listed below.", "Page not found")}
  <section class="bk-sheet bk-tone-paper" aria-label="Chapters">
    <ol class="bk-toc__list bk-toc__list--page">${CH.map((c) => `<li class="bk-tone-${c.tone}"><a href="${chHref(L, c)}"><span class="bk-toc__n">${c.n}</span><span class="bk-toc__t">${esc(c.title)}</span><span class="bk-toc__l">${esc(c.label || c.line)}</span></a></li>`).join("")}</ol>
  </section>`;
  return shell(m, ctx, { title: "Not found", body });
}

const PAGES = { home, about, work, case: caseStudy, ventures, speaking, writing, article, side, contact, index, experiments, notFound };
export function render(key, m, ctx) {
  return (PAGES[key] || notFound)(m, ctx);
}
export { PAGE_CH };
