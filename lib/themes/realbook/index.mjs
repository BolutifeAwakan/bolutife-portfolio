// Direction C — The Book: the brand book as a real book you handle.
// The home page is a bound book lying on a table. You open the cover on its
// hinge, lift a page by its corner and fold it over, tap a page to turn it,
// or use the arrow keys. Its chapters follow the positioning strategy:
// principles, identity, the work, what she's building, her voice, how she
// leads, life off-brand, and how to work with her. Each chapter links to a
// full page, which is the same paper laid flat. Black, white and grey only;
// photographs in black and white. Instrument Serif and Instrument Sans.

import { esc, img, media } from "../../media.mjs";
import { photo } from "../../photos.mjs";
import { headTags, href, paras, extAttrs, year, fmtDate } from "../../shell.mjs";
import { contentIndex, SECTIONS } from "../../model.mjs";
import { markBook } from "../marks.mjs";

const ORDER = ["work", "ventures", "speaking", "writing", "about", "side", "contact"];
const NAV = ORDER.map((k) => SECTIONS.find((s) => s.key === k));
const navKey = { about: "about", work: "work", case: "work", ventures: "ventures", speaking: "speaking", writing: "writing", article: "writing", side: "side", contact: "contact" };

// The chapters, in the order the positioning strategy sets out: principles,
// identity, the work, what she's building, voice, how she leads, off-brand,
// and how to work with her. `card` is where each sits in the experience on
// the home page; `path` is its full chapter page.
const CHAPTERS = [
  { key: "believe", n: "One", title: "What I believe", path: "/about#believe", card: 2 },
  { key: "about", n: "Two", title: "Who I am", path: "/about", card: 3 },
  { key: "work", n: "Three", title: "The work", path: "/work", card: 4 },
  { key: "ventures", n: "Four", title: "What I'm building", path: "/ventures", card: 6 },
  { key: "speaking", n: "Five", title: "On stage", path: "/speaking", card: 7 },
  { key: "lead", n: "Six", title: "How I lead", path: "/about#practice", card: 9 },
  { key: "side", n: "Seven", title: "On the side", path: "/on-the-side", card: 10 },
  { key: "contact", n: "Eight", title: "Work with me", path: "/contact", card: 11 },
];
const WRITING = { key: "writing", n: "Five", title: "Field notes", path: "/writing", card: 8 };
const chapterOf = (key) => CHAPTERS.find((c) => c.key === key) || (key === "writing" ? WRITING : null);

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
<link rel="stylesheet" href="/assets/realbook.css?v=2">
<script src="/assets/realbook.js?v=2" defer></script>
</head>
<body class="bk-page bk-page--${ctx.pageKey}">
<a class="bk-skip" href="#main">Skip to content</a>
<header class="bk-head">
  <a class="bk-head__brand" href="${L("/")}" aria-label="Bolutife Awakan, home">${markBook({ size: 28, title: "" })}<span>Bolutife Awakan</span></a>
  <nav class="bk-head__nav" aria-label="Main"><ul>${NAV.map((s) => `<li><a href="${L(s.path)}"${cur(s.key)}>${s.label}</a></li>`).join("")}</ul></nav>
  <button class="bk-head__menu" type="button" aria-expanded="false" aria-controls="bk-menu">Contents</button>
</header>
<dialog class="bk-menu" id="bk-menu" aria-label="Menu">
  <div class="bk-menu__top">${markBook({ size: 28, title: "" })}<button class="bk-menu__close" type="button">Close</button></div>
  <nav aria-label="Menu"><ol>${CHAPTERS.map((c) => `<li><a href="${L(c.path)}"${home ? ` data-goto="${c.card}"` : ""}><span>Chapter ${c.n.toLowerCase()}</span>${esc(c.title)}</a></li>`).join("")}</ol>
  <ul class="bk-menu__more"><li><a href="${L("/")}"${home ? ' data-goto="0"' : ""}>The beginning</a></li><li><a href="${L("/experiments")}">Experiments</a></li><li><a href="${L("/index")}">Everything on the site</a></li></ul></nav>
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

/* ---------- the experience (home) ---------- */

// Each card is one page of the book, held up in a curved space you move
// through. `label` names it in the running head; `chapter` gives its number.
const card = (i, label, inner, { cls = "", c = null } = {}) => `
  <section class="ex-card ${cls}" data-card="${i}" data-label="${esc(label)}" aria-label="${esc(label)}">
    <div class="ex-card__in">${inner}</div>
    ${c ? `<p class="ex-folio" aria-hidden="true">Chapter ${c.n.toLowerCase()}</p>` : ""}
  </section>`;
const head = (c) => `<p class="ex-k">Chapter ${c.n.toLowerCase()}</p><h2 class="ex-h">${esc(c.title)}</h2>`;
const go = (L, c, label) => `<a class="ex-go" href="${L(c.path)}">${esc(label)}</a>`;

function home(m, ctx) {
  const L = (p) => href(ctx, p);
  const p = m.person;
  const C = Object.fromEntries(CHAPTERS.map((c) => [c.key, c]));
  const sentences = (t) => String(t || "").match(/[^.!?]+[.!?]+/g) || [String(t || "")];
  const sideFirst = sentences(m.side.intro).slice(0, 2).join(" ").trim();
  const credits = (m.about.path.find((s) => /entertainment/i.test(s.when)) || {}).text;
  const orgs = [...new Set([...m.about.experience.map((x) => x.org.split(" / ")[0]), "Mavin", ...m.work.all.map((w) => w.title)])];
  const doorCard = { make: C.work.card, lead: C.lead.card, build: C.ventures.card };
  const doorPhoto = { make: "chair-gold", lead: "colonnade", build: "garden-sun" };
  const cards = [];

  // 0 The cover: the line, and three doors into it
  cards.push(card(0, "The beginning", `
    <div class="ex-intro">
      <div class="ex-intro__text">
        <h1 class="ex-name">Bolutife Awakan</h1>
        <p class="ex-role">${esc(p.identity.join(", "))}</p>
        <p class="ex-line">${esc(p.cover.lead)} in ${p.cover.doors.map((d, i) => `<a href="#${d.key}" data-goto="${doorCard[d.key]}" data-door="${d.key}">${esc(d.text)}</a>${i === 0 ? ", " : i === 1 ? ", and " : "."}`).join("")}</p>
        <p class="ex-sub">${esc(p.headline)}</p>
      </div>
      <figure class="ex-intro__photo ex-print">
        <div class="ex-frame is-on" data-frame="default">${photo("steps-smile", { sizes: "(max-width: 760px) 70vw, 24vw", eager: true })}</div>
        ${p.cover.doors.map((d) => `<div class="ex-frame" data-frame="${d.key}" aria-hidden="true">${photo(doorPhoto[d.key], { sizes: "(max-width: 760px) 70vw, 24vw", alt: "" })}</div>`).join("")}
      </figure>
    </div>`, { cls: "ex-card--intro" }));

  // 1 Today: a photograph, a lens to look closer, and the time where she is
  cards.push(card(1, "Today", `
    <div class="ex-today" data-lens>
      <div class="ex-today__img">${photo("lawn-stand", { sizes: "(max-width: 760px) 90vw, 60vw" })}</div>
      <div class="ex-lens" aria-hidden="true"><div class="ex-lens__img"></div></div>
      <div class="ex-today__cap">
        <p class="ex-time">It is <time data-tz="Africa/Lagos" data-long>${timeIn("Africa/Lagos")}</time> in Lagos, <time data-tz="Europe/London">${timeIn("Europe/London")}</time> in London.</p>
        <dl class="ex-now">${p.now.map((n) => `<div><dt>${esc(n.label)}</dt><dd>${esc(n.text)}</dd></div>`).join("")}</dl>
      </div>
      <p class="ex-hint" aria-hidden="true">Move the lens</p>
    </div>`, { cls: "ex-card--photo" }));

  // 2 What I believe: the words arrive as you do
  cards.push(card(2, C.believe.title, `
    <div class="ex-believe">${head(C.believe)}
      <blockquote class="ex-quote" data-words><p>${esc(m.practice.belief).split(" ").map((w, i) => `<span style="--w:${i}">${w}</span>`).join(" ")}</p></blockquote>
      <p class="ex-small">${esc(m.practice.operator)}</p>
      ${go(L, C.believe, "How I work")}
    </div>`, { c: C.believe }));

  // 3 Who I am: one arc, in three parts you choose between
  const arcKeys = ["make", "lead", "build"];
  const arcPhoto = { make: "portrait-mono", lead: "stairs-dark", build: "arch-white" };
  cards.push(card(3, C.about.title, `
    <div class="ex-arc" data-tabs>
      <div class="ex-arc__text">${head(C.about)}
        <div class="ex-tabs" role="tablist" aria-label="The arc">${arcKeys.map((k, i) => `<button type="button" role="tab" id="arc-t-${k}" aria-controls="arc-p-${k}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(m.arc[k].title)}</button>`).join("")}</div>
        ${arcKeys.map((k, i) => `<div class="ex-tabpanel" role="tabpanel" id="arc-p-${k}" aria-labelledby="arc-t-${k}"${i ? " hidden" : ""}><p class="ex-lede">${esc(m.arc[k].line)}</p>${k === "make" && credits ? `<p class="ex-small">${esc(credits)}</p>` : ""}</div>`).join("")}
        ${go(L, C.about, "Read my story")}
      </div>
      <figure class="ex-arc__photo ex-print">${arcKeys.map((k, i) => `<div class="ex-frame${i === 0 ? " is-on" : ""}" data-frame="${k}">${photo(arcPhoto[k], { sizes: "(max-width: 760px) 60vw, 22vw", alt: i ? "" : undefined })}</div>`).join("")}</figure>
    </div>`, { c: C.about }));

  // 4 The work: the words part, and the work comes through
  cards.push(card(4, C.work.title, `
    <div class="ex-work" data-cloud>
      <h2 class="ex-split"><span>The</span><span>work</span></h2>
      <ul class="ex-cloud">${m.work.featured.map((w, i) => `<li style="--i:${i}"><a href="${L(w.path)}"><span class="ex-cloud__img">${img(w.thumbnail || w.cover, { width: 700, alt: "" })}</span><span class="ex-cloud__t">${esc(w.title)}</span></a></li>`).join("")}</ul>
      <p class="ex-k ex-work__k">Chapter ${C.work.n.toLowerCase()}</p>
      ${go(L, C.work, `All ${m.work.all.length} case studies`)}
    </div>`, { cls: "ex-card--work" }));

  // 5 Proof, as facts
  cards.push(card(5, "Proof", `
    <div class="ex-proof">
      <p class="ex-k">Brands and teams I've worked with</p>
      <p class="ex-names">${orgs.map((o) => `<span>${esc(o)}</span>`).join(" ")}</p>
      <ul class="ex-awards">${m.about.awards.map((a) => `<li><strong>${esc(a.title)}</strong>${esc(a.org)}, ${esc(a.year)}</li>`).join("")}</ul>
    </div>`));

  // 6 What I'm building: two organisations, each in its own name
  cards.push(card(6, C.ventures.title, `
    <div class="ex-build">${head(C.ventures)}
      <div class="ex-vents">${m.ventures.map((v) => `<article class="ex-vent" tabindex="0"><p class="ex-vent__k">${esc(v.kind)}, founded by me</p><h3 class="ex-vent__n">${esc(v.name)}</h3><p class="ex-vent__l">${esc(v.line)}</p>${v.offers.length ? `<p class="ex-vent__o">${v.offers.map((o) => esc(o.title)).join(", ")}</p>` : ""}${v.url ? `<a href="${esc(v.url)}" target="_blank" rel="noopener" data-track="venture_click" data-track-target="${esc(v.slug)}">${esc(v.cta)}</a>` : ""}</article>`).join("")}</div>
      <p class="ex-small">${esc(m.mentoring)}</p>
      ${go(L, C.ventures, "More on both")}
    </div>`, { c: C.ventures }));

  // 7 On stage: cue cards you flip through
  cards.push(card(7, C.speaking.title, `
    <div class="ex-stage">
      <div class="ex-stage__text">${head(C.speaking)}
        <p class="ex-big">${esc(m.speaking.headline)}</p>
        <p class="ex-small">${esc(m.speaking.promise)}</p>
        <p class="ex-actions"><a class="ex-btn" href="${L("/contact?about=speaking")}">Book me to speak</a>${go(L, C.speaking, "Topics and talks")}</p>
      </div>
      <div class="ex-cues" data-cues>
        <button class="ex-cues__btn" type="button" aria-label="Next talking point"></button>
        <ol>${m.speaking.tracks.map((t, i) => `<li class="ex-cue" style="--i:${i}"><span class="ex-cue__n">${i + 1} of ${m.speaking.tracks.length}</span><strong>${esc(t.title)}</strong><span>${esc(t.body)}</span></li>`).join("")}</ol>
        <p class="ex-hint" aria-hidden="true">Tap the cards</p>
      </div>
    </div>`, { c: C.speaking }));

  // 8 Field notes: papers on the desk, fanned out when you reach for them
  cards.push(card(8, WRITING.title, `
    <div class="ex-notes">
      <div><p class="ex-k">Chapter five, continued</p><h2 class="ex-h">${esc(WRITING.title)}</h2>
        <p class="ex-small">${m.books.map((b) => `My book, ${b.url ? `<a href="${esc(b.url)}" target="_blank" rel="noopener" data-track="book_click" data-track-target="book"><em>${esc(b.title)}</em></a>` : `<em>${esc(b.title)}</em>`}, ${esc(b.line.replace(/^My book, /, "").replace(/\.$/, ""))}.`).join(" ")}</p>
        ${go(L, WRITING, "All writing")}</div>
      <ol class="ex-papers">${m.writing.notes.slice(0, 3).map((n, i) => {
        const u = n.path ? L(n.path) : n.href || "#";
        return `<li style="--i:${i}"><a href="${esc(u)}"${n.path ? "" : extAttrs(u)}><span class="ex-papers__d">${esc(n.date ? fmtDate(n.date) : "")}</span><span class="ex-papers__t">${esc(n.title)}</span><span class="ex-papers__s">${esc(n.summary || "")}</span></a></li>`;
      }).join("")}</ol>
    </div>`, { cls: "ex-card--notes" }));

  // 9 How I lead
  cards.push(card(9, C.lead.title, `
    <div class="ex-lead">${head(C.lead)}
      <ul class="ex-areas">${m.practice.areas.map((a) => `<li><h3>${esc(a.title)}</h3><p>${esc(a.body)}</p></li>`).join("")}</ul>
      <ul class="ex-led">${m.about.experience.slice(0, 4).map((x) => `<li><span>${esc(x.role)}</span>${esc(x.org)}</li>`).join("")}</ul>
      ${go(L, C.lead, "The full record")}
    </div>`, { c: C.lead }));

  // 10 On the side: a loose collection that follows your hand
  const sideSet = ["chair-gold", "arch-mono", "lawn-crouch", "doorway-dark", "textile-dark", "garden-sun", "portrait-mono"];
  cards.push(card(10, C.side.title, `
    <div class="ex-side" data-drift>
      <ul class="ex-drift">${sideSet.map((s, i) => `<li style="--i:${i}" data-depth="${(0.4 + (i % 3) * 0.3).toFixed(1)}">${photo(s, { sizes: "14vw", alt: "" })}</li>`).join("")}</ul>
      <div class="ex-side__text">${head(C.side)}
        <p class="ex-lede">${esc(sideFirst)}</p>
        <p class="ex-words">${m.side.interests.map((x) => `<span>${esc(x.title)}</span>`).join(" ")}</p>
        ${m.side.nowPlaying ? `<p class="ex-small">Listening to ${esc(m.side.nowPlaying.song)}, ${esc(String(m.side.nowPlaying.artist).replace(/\.$/, ""))}.</p>` : ""}
        ${go(L, C.side, "Life outside work")}
      </div>
    </div>`, { cls: "ex-card--side" }));

  // 11 Work with me: the ways in, and a note you can sign
  cards.push(card(11, C.contact.title, `
    <div class="ex-usage">
      <div>${head(C.contact)}
        <ul class="ex-ways">${[
          ["project", "Brand and creative direction"],
          ["leadership", "Design leadership"],
          ["speaking", "Speaking"],
          ["mentoring", "Mentoring"],
        ].map(([k, t]) => `<li><a href="${L(`/contact?about=${k}`)}">${esc(t)}</a></li>`).join("")}</ul>
        <p class="ex-mail"><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></p>
      </div>
      <form class="ex-note" data-note data-mailto="${esc(p.email)}">
        <p class="ex-k">Leave a note</p>
        <label class="ex-note__msg"><span class="ex-vh">Your note</span><textarea name="note" rows="4" required placeholder="Write me something"></textarea></label>
        <label class="ex-note__sig"><span>Yours,</span><input name="name" required autocomplete="name" placeholder="your name"></label>
        <button class="ex-btn" type="submit">Send the note</button>
      </form>
    </div>`, { c: C.contact }));

  // 12 The last page: the line, written out
  cards.push(card(12, "The end", `
    <div class="ex-mantra" data-mantra>
      <svg class="ex-mantra__svg" viewBox="0 0 1000 220" role="img" aria-label="${esc(p.cover.lead)}"><text x="500" y="150" text-anchor="middle" textLength="880" lengthAdjust="spacingAndGlyphs">${esc(p.cover.lead)}</text></svg>
      <p class="ex-sign">Bolutife</p>
    </div>`, { cls: "ex-card--mantra" }));

  const chapters = Object.fromEntries([...CHAPTERS, WRITING, ...p.cover.doors.map((d) => ({ key: d.key, card: doorCard[d.key] }))].map((c) => [c.key, c.card]));
  const body = `
<section class="ex" aria-label="The book" data-chapters='${JSON.stringify(chapters)}' style="--n:${cards.length}">
  <div class="ex-view">
    <p class="ex-run" aria-live="polite"><span data-run>The beginning</span></p>
    <div class="ex-bar" aria-hidden="true"><i data-bar></i></div>
    <div class="ex-room" data-room>${cards.join("")}</div>
    <div class="ex-ui">
      <button type="button" data-step="-1" aria-label="Previous page">Back</button>
      <button type="button" data-step="1" aria-label="Next page">Next</button>
      <button type="button" data-sound aria-pressed="false">Sound off</button>
    </div>
  </div>
</section>`;
  return shell(m, ctx, { body, image: "photo:steps-smile", home: true });
}

/* ---------- chapter pages: the same paper, laid flat ---------- */

const sheet = (inner, { chapterTitle = "", cls = "" } = {}) => `<article class="bk-sheet ${cls}">
  <p class="bk-sheet__run" aria-hidden="true"><span>Bolutife Awakan</span><span>${esc(chapterTitle)}</span></p>
  ${inner}
</article>`;

const opener = (L, key, title, line, { photoSlug } = {}) => {
  const c = chapterOf(key);
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
  const c = chapterOf(key);
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
      <blockquote class="bk-big-q" id="believe"><p>${esc(m.practice.belief)}</p></blockquote>
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
