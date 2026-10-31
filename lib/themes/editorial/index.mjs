// Direction B — The Personal Editorial (Mason Wong as the reference).
// Night ground sampled from the studio portraits, so the dark shots melt
// into the page. One type family (Archivo, from its narrowest display cut
// to text widths) on a fixed scale, plus her signature script; her patchwork
// stripe is the one graphic device. Short lines; pictures do the talking.

import { esc, img, media } from "../../media.mjs";
import { photo } from "../../photos.mjs";
import { headTags, href, paras, extAttrs, year } from "../../shell.mjs";
import { contentIndex } from "../../model.mjs";
import { markEditorial } from "../marks.mjs";

// Primary navigation: WORK / VENTURES / THOUGHTS / ABOUT / SHOP, plus Say hello. No sub-menus.
const NAV = [
  { key: "work", path: "/work", label: "Work" },
  { key: "ventures", path: "/ventures", label: "Ventures" },
  { key: "thoughts", path: "/thoughts", label: "Thoughts" },
  { key: "about", path: "/about", label: "About" },
  { key: "shop", path: "/shop", label: "Shop" },
];
const navKey = { work: "work", case: "work", experiments: "work", ventures: "ventures", writing: "thoughts", article: "thoughts", speaking: "thoughts", about: "about", side: "about", shop: "shop", book: "shop", contact: "contact" };

const timeIn = (tz) => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz });
const clocks = (cls = "") =>
  `<span class="ed-clocks ${cls}" role="group" aria-label="Local time in Lagos and London"><span>Lagos <time data-tz="Africa/Lagos">${timeIn("Africa/Lagos")}</time></span><span>London <time data-tz="Europe/London">${timeIn("Europe/London")}</time></span></span>`;

// Small label: project metadata, kinds, counts. Same family as everything else.
const br = (t) => (t ? `<span class="ed-br">${esc(t)}</span>` : "");
const pad = (n) => String(n).padStart(2, "0");

// Display line sized to fill its container (CSS estimate, refined in JS).
const fit = (text, { tag = "span", cls = "", id = "" } = {}) =>
  `<${tag} class="ed-fit ${cls}"${id ? ` id="${id}"` : ""} style="--n:${[...String(text)].length}"><span class="ed-fit__in">${esc(text)}</span></${tag}>`;

const stripe = (cls = "") => `<div class="ed-stripe ${cls}" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>`;

/* ---------- shell ---------- */

function shell(m, ctx, { title, description, image, body, cls = "" }) {
  const L = (p) => href(ctx, p);
  const active = navKey[ctx.pageKey];
  const cur = (k) => (active === k ? ' aria-current="page"' : "");
  return `<!doctype html>
<html lang="en" class="ed">
<head>
${headTags(ctx, { title, description, image, path: ctx.path })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,300..900;1,62..125,300..900&family=Ms+Madi&display=swap">
<link rel="stylesheet" href="/assets/editorial.css?v=13">
<script src="/assets/editorial.js?v=13" defer></script>
</head>
<body class="ed-page ed-page--${ctx.pageKey} ${cls}">
<a class="ed-skip" href="#main">Skip to content</a>
<header class="ed-head">
  <a class="ed-head__brand" href="${L("/")}" aria-label="Bolutife Awakan, home">${markEditorial({ size: 40, title: "" })}<span>Bolutife Awakan</span></a>
  <nav class="ed-head__nav" aria-label="Main"><ul>${[...NAV, { key: "contact", path: "/contact", label: "Say hello" }].map((s) => `<li><a href="${L(s.path)}"${cur(s.key)}>${s.label}</a></li>`).join("")}</ul></nav>
  ${clocks("ed-head__clocks")}
  <button class="ed-head__menu" type="button" aria-expanded="false" aria-controls="ed-menu">Menu</button>
</header>
<div class="ed-menu" id="ed-menu" role="dialog" aria-modal="true" aria-label="Menu" hidden>
  <div class="ed-menu__top">${markEditorial({ size: 40, title: "" })}<button class="ed-menu__close" type="button">Close</button></div>
  <nav aria-label="Menu"><ul>${[...NAV, { key: "contact", path: "/contact", label: "Say hello" }].map((s) => `<li><a href="${L(s.path)}"${cur(s.key)}>${s.label}</a></li>`).join("")}</ul></nav>
  ${clocks()}
</div>
<main id="main">
${body}
</main>
${footer(m, ctx)}
</body>
</html>`;
}

// Email sign-up form. Posts to the newsletter provider when its form URL is set
// in Sanity (Settings → Newsletter URL); until then it opens an email to Bolutife.
function signupForm(m, source, { quiet = false } = {}) {
  const n = m.newsletter;
  return `<form class="ed-su${quiet ? " ed-su--quiet" : ""}" data-signup data-mailto="${esc(m.person.email)}" data-source="${esc(source)}"${n.url ? ` action="${esc(n.url)}" method="post" target="_blank"` : ""}>
      <label class="ed-vh" for="su-${esc(source)}">Your email</label>
      <input id="su-${esc(source)}" name="email" type="email" autocomplete="email" placeholder="Your email" required>
      <input type="hidden" name="source" value="${esc(source)}">
      <button type="submit">Subscribe</button>
      <p class="ed-su__done" role="status" aria-live="polite"></p>
    </form>`;
}

function signup(m, { title, line, source }) {
  return `<section class="ed-signup" aria-label="Email sign-up" data-reveal>
    <div><h2 class="ed-signup__h">${esc(title)}</h2>${line ? `<p class="ed-signup__line">${esc(line)}</p>` : ""}</div>
    ${signupForm(m, source)}
  </section>`;
}

function footer(m, ctx) {
  const L = (p) => href(ctx, p);
  const p = m.person;
  const links = [...NAV, { path: "/experiments", label: "Experiments" }, { path: "/contact", label: "Contact" }];
  return `<footer class="ed-foot">
  ${stripe()}
  <section class="ed-foot__cta" aria-labelledby="h-hello">
    <h2 class="ed-foot__h" id="h-hello">${fit("Say hello", { cls: "ed-fit--foot" })}</h2>
    <div class="ed-foot__row">
      <div><p class="ed-foot__lead">${esc(m.contactLine)}</p><p class="ed-sign ed-sign--foot" aria-hidden="true">Bolu</p></div>
      <p class="ed-foot__mail"><a href="mailto:${esc(p.email)}" data-track="contact_cta" data-track-target="email">${esc(p.email)}</a></p>
      <p class="ed-actions"><a class="ed-btn" href="${L("/contact")}">Send a message</a><a class="ed-btn ed-btn--line" href="${L("/contact?about=call")}">Book a call</a></p>
    </div>
  </section>
  <div class="ed-foot__grid">
    <nav class="ed-foot__nav" aria-label="Footer"><ul>${links.map((s) => `<li><a href="${L(s.path)}">${s.label}</a></li>`).join("")}</ul></nav>
    <ul class="ed-foot__social">${p.socials.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join("")}</ul>
    <div class="ed-foot__news"><p class="ed-foot__k">New thoughts and releases, now and then</p>${signupForm(m, "footer", { quiet: true })}</div>
    <div class="ed-foot__meta">${clocks()}<p>${esc(p.locations.join(" / "))}</p><p>${esc(m.photoCredit)}</p><p>&copy; Bolutife Awakan ${year()}</p></div>
  </div>
</footer>`;
}

/* ---------- parts ---------- */

// Page opener: one giant condensed word, a count, a short line.
const opener = (word, { count, line, lines, h = "h1", id } = {}) => `<header class="ed-open">
  <${h} class="ed-open__h"${id ? ` id="${id}"` : ""}>${fit(word)}${count != null ? `<sup class="ed-open__n">${count}</sup>` : ""}</${h}>
  ${line ? `<p class="ed-open__line">${esc(line)}</p>` : ""}
  ${lines ? `<div class="ed-open__line">${lines.map((l) => `<p>${esc(l)}</p>`).join("")}</div>` : ""}
</header>`;

// Section heading at the second level of the scale (not a page-width word).
const secHead = (word, { id, line, h = "h2" } = {}) => `<div class="ed-split">
    <${h} class="ed-split__h" id="${id}">${fit(word, { cls: "ed-fit--left" })}</${h}>
    ${line ? `<p class="ed-split__line">${esc(line)}</p>` : ""}
  </div>`;

// Selected work: full-height cards that stack as you scroll. Each card keeps its
// words on a solid band below the picture, so they always read clearly.
function stack(L, projects, summaries = {}) {
  return `<ol class="ed-stack">${projects
    .map(
      (p, i) => `<li class="ed-stack__card" style="--i:${i}">
      <a class="ed-stack__a" href="${L(p.path)}" data-track="work_click" data-track-target="${esc(p.slug)}">
        <figure class="ed-stack__img">${img(p.thumbnail || p.cover, { width: 2400, alt: "" })}</figure>
        <span class="ed-stack__band">
          <span class="ed-stack__meta"><span class="ed-br">${i + 1} / ${projects.length}</span>${br(p.services)}${br(p.year)}</span>
          <span class="ed-stack__t">${esc(p.title)}</span>
          <span class="ed-stack__s">${esc(summaries[p.slug] || p.summary)}</span>
          <span class="ed-stack__go">View the project</span>
        </span>
      </a>
    </li>`
    )
    .join("")}</ol>`;
}

// All projects on the Work page: a two-up grid with the words under each picture.
function grid(L, projects) {
  return `<ul class="ed-grid">${projects
    .map(
      (p, i) => `<li class="ed-grid__item ed-grid__item--${i % 3 === 0 ? "wide" : "half"}" data-reveal>
      <a href="${L(p.path)}" data-track="work_click" data-track-target="${esc(p.slug)}">
        <figure>${img(p.thumbnail || p.cover, { width: i % 3 === 0 ? 2400 : 1400, alt: "" })}</figure>
        <span class="ed-grid__meta">${br(p.services)}${br(p.year)}</span>
        <h2 class="ed-grid__t">${esc(p.title)}</h2>
        <span class="ed-grid__s">${esc(p.summary)}</span>
        <span class="ed-grid__go">View the project</span>
      </a>
    </li>`
    )
    .join("")}</ul>`;
}

// Big list rows with a photo that follows the pointer on wide screens.
function rows(items, { h = "h3", cls = "" } = {}) {
  return `<ul class="ed-rows ${cls}">${items
    .map(
      (r) => `<li class="ed-row"${r.preview ? ` data-preview="${esc(r.preview)}"` : ""} data-reveal>
      ${r.href ? `<a class="ed-row__a" href="${esc(r.href)}"${r.ext ? ' target="_blank" rel="noopener"' : ""}${r.track ? ` data-track="${r.track}" data-track-target="${esc(r.trackTarget || "")}"` : ""}>` : `<div class="ed-row__a">`}
        <span class="ed-row__k">${r.k ? br(r.k) : ""}</span>
        <${h} class="ed-row__t">${esc(r.t)}</${h}>
        <span class="ed-row__s">${esc(r.s || "")}</span>
        ${r.go ? `<span class="ed-row__go">${esc(r.go)}</span>` : ""}
      ${r.href ? "</a>" : "</div>"}
    </li>`
    )
    .join("")}</ul>`;
}

const previewSrc = (raw, w = 800) => {
  const x = media(raw);
  return x && !x.isVideo ? img(x, { width: w }).match(/src="([^"]+)"/)?.[1] || "" : "";
};
const photoSrc = (slug) => `/assets/photos/${slug}-640.webp`;

const founded = (v) => (/^co-/i.test(v.role) ? "Co-founded by Bolutife" : "Founded by Bolutife");

function ventureRows(L, ventures, { h = "h3" } = {}) {
  return `<ul class="ed-vent">${ventures
    .map(
      (v) => `<li class="ed-vent__item" id="${esc(v.slug)}" data-reveal>
      <p class="ed-vent__k">${br(v.kind)}${br(founded(v))}</p>
      <${h} class="ed-vent__name">${esc(v.name)}</${h}>
      <p class="ed-vent__line">${esc(v.line)}</p>
      ${v.url ? `<a class="ed-link" href="${esc(v.url)}" target="_blank" rel="noopener" data-track="venture_click" data-track-target="${esc(v.slug)}">${esc(v.cta)}</a>` : ""}
    </li>`
    )
    .join("")}</ul>`;
}

// A book is an object: its photo or a typeset cover, in a framed panel.
const cover = (b, { eager = false } = {}) =>
  b.cover
    ? `<span class="ed-cover ed-cover--photo"><img src="${esc(b.cover)}" alt="${esc(b.title)}, the book" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></span>`
    : `<span class="ed-cover ed-cover--type" role="img" aria-label="${esc(b.title)} book cover"><span class="ed-cover__t">${esc(b.title)}</span>${b.subtitle ? `<span class="ed-cover__s">${esc(b.subtitle)}</span>` : ""}<span class="ed-cover__a">Bolutife Awakan</span></span>`;

function bookFeature(L, b, { h = "h3" } = {}) {
  return `<article class="ed-bookf" aria-label="${esc(b.title)}, a book" data-reveal>
    <a class="ed-bookf__a" href="${L(b.path)}" data-track="book_click" data-track-target="${esc(b.slug)}">
      <span class="ed-bookf__obj">${cover(b)}</span>
      <span class="ed-bookf__text">
        <span class="ed-bookf__k">${br(b.byline)}${b.available === false ? br("Coming") : ""}</span>
        <${h} class="ed-bookf__t">${esc(b.title)}</${h}>
        <span class="ed-bookf__s">${esc(b.line)}</span>
        <span class="ed-link">${esc(b.cta)}</span>
      </span>
    </a>
  </article>`;
}

const thoughtPath = (n) => (n.path ? n.path.replace(/^\/writing\//, "/thoughts/") : null);

function noteRows(L, notes, { limit, h = "h3" } = {}) {
  const list = limit ? notes.slice(0, limit) : notes;
  return rows(
    list.map((n) => ({
      href: thoughtPath(n) ? L(thoughtPath(n)) : n.href || L("/thoughts"),
      ext: !thoughtPath(n) && /^https?:/.test(n.href || ""),
      t: n.title,
      s: n.summary || "",
      go: "Read",
      preview: previewSrc(n.thumbnail),
    })),
    { h, cls: "ed-rows--notes" }
  );
}

// Inline photo chips inside a sentence. Decorative; the sentence reads whole.
const chip = (slug) => `<span class="ed-chip" aria-hidden="true">${photo(slug, { sizes: "160px", alt: "" })}</span>`;

const DESK = ["chair-gold", "garden-sun", "arch-mono", "lawn-crouch", "portrait-mono"];

function desk(slugs, tags = []) {
  return `<div class="ed-desk" data-desk>
    ${slugs.map((s, i) => `<figure class="ed-desk__p ed-desk__p--${i + 1}" data-drag>${photo(s, { sizes: "(max-width: 800px) 45vw, 22vw" })}${tags[i] ? `<figcaption>${br(tags[i])}</figcaption>` : ""}</figure>`).join("")}
  </div>`;
}

function sideSection(m, L, { h = "h2", link = true, id = "" } = {}) {
  return `<section class="ed-side"${id ? ` id="${id}"` : ""} aria-labelledby="h-side">
  <div class="ed-side__text">
    <${h} class="ed-side__h" id="h-side">${fit("On the side", { cls: "ed-fit--left" })}</${h}>
    <p class="ed-sign ed-sign--side" aria-hidden="true">off duty</p>
    <p class="ed-side__line">${esc(m.side.intro)}</p>
    <ul class="ed-tags">${m.side.interests.map((x) => `<li>${esc(x.title)}</li>`).join("")}</ul>
    ${link ? `<a class="ed-link" href="${L("/about#on-the-side")}">Life outside work</a>` : ""}
    <p class="ed-hint" aria-hidden="true">${br("Drag the photos around")}</p>
  </div>
  ${desk(DESK)}
</section>`;
}

function speakingBand(m, L, { h = "h2", eager = false, explore = true } = {}) {
  const s = m.speaking;
  return `<section class="ed-stage" id="speaking" aria-labelledby="h-stage">
  <figure class="ed-stage__img">${s.image ? img(s.image, { width: 2400, eager, alt: "Bolutife speaking on stage" }) : photo("colonnade", { sizes: "100vw", eager })}</figure>
  <div class="ed-stage__over">
    <${h} class="ed-stage__h" id="h-stage">${fit("Speaking", { cls: explore ? "" : "ed-fit--left" })}</${h}>
    <div class="ed-stage__cols">
      <p class="ed-stage__line">${esc(s.promise)}</p>
      <div><p class="ed-actions"><a class="ed-btn" href="${L("/contact?about=speaking")}" data-track="speaking_cta" data-track-target="${explore ? "home" : "thoughts"}">Invite me to speak</a>${explore ? `<a class="ed-btn ed-btn--line" href="${L("/thoughts#speaking")}">Explore talks</a>` : ""}</p></div>
    </div>
  </div>
</section>`;
}

/* ---------- pages ---------- */

function home(m, ctx) {
  const L = (p) => href(ctx, p);
  const p = m.person;
  const [p1, p2] = p.intro;
  const intro1 = esc(p1)
    .replace("graphic designer.", `graphic <span class="ed-nw">designer ${chip("steps-smile")}.</span>`)
    .replace("creative teams,", `creative <span class="ed-nw">teams ${chip("colonnade")},</span>`);
  const intro2 = esc(p2).replace("the people,", `the <span class="ed-nw">people ${chip("garden-sun")},</span>`);
  const [book] = m.books;
  const body = `
<section class="ed-hero" aria-labelledby="ed-hero-h">
  <figure class="ed-hero__photo">${photo("textile-dark", { sizes: "(max-width: 800px) 92vw, 44vw", eager: true })}</figure>
  <div class="ed-hero__top">
    <p class="ed-hero__id">${esc(p.identity.join(", "))}</p>
  </div>
  <p class="ed-hero__head">${esc(p.headline)}</p>
  <h1 class="ed-hero__name" id="ed-hero-h"><span class="ed-fit ed-hero__first" style="--n:8"><span class="ed-fit__in">${[...p.first].map((ch, i) => `<span class="ed-ch" style="--d:${i}">${esc(ch)}</span>`).join("")}</span></span><span class="ed-hero__last">${esc(p.last)}</span></h1>
  <a class="ed-hero__scroll" href="#intro">${br("Scroll down")}</a>
</section>
${stripe("ed-stripe--hero")}

<section class="ed-intro" id="intro" aria-label="Introduction">
  <p class="ed-intro__p" data-reveal>${intro1}</p>
  <p class="ed-intro__p ed-intro__p--2" data-reveal>${intro2}</p>
  <p class="ed-intro__more"><a class="ed-link" href="${L("/about")}">More about me</a></p>
</section>

<section class="ed-work" id="work" aria-labelledby="h-work">
  <h2 class="ed-work__h" id="h-work">${fit("Selected work")}<sup class="ed-open__n">${m.work.featured.length}</sup></h2>
  ${stack(L, m.work.featured, m.work.summaries)}
  <p class="ed-more-row ed-more-row--work"><a class="ed-link ed-link--big" href="${L("/work")}">All work <span class="ed-link__n">${m.work.all.length}</span></a><a class="ed-link ed-link--quiet" href="${L("/experiments")}">Explore Experiments</a></p>
</section>

<section class="ed-practice" aria-label="What I do">
  ${rows(
    m.practice.areas.map((a, i) => ({ t: a.title, s: a.body, preview: photoSrc(["colonnade", "stairs-dark", "steps-seated"][i % 3]) })),
    { cls: "ed-rows--xl" }
  )}
</section>

<section class="ed-ventures" aria-labelledby="h-ventures">
  ${secHead("Things I'm building", { id: "h-ventures", line: m.venturesIntro })}
  ${ventureRows(L, m.ventures)}
  <p class="ed-more-row"><a class="ed-link" href="${L("/ventures")}">About the ventures</a></p>
</section>

${speakingBand(m, L)}

<section class="ed-writing" aria-labelledby="h-writing">
  ${secHead("Thoughts", { id: "h-writing", line: m.writing.intro })}
  ${bookFeature(L, book)}
  ${noteRows(L, m.writing.notes, { limit: 3 })}
  <p class="ed-more-row"><a class="ed-link" href="${L("/thoughts")}">All thoughts</a></p>
</section>

${sideSection(m, L)}`;
  return shell(m, ctx, { body, image: "photo:textile-dark", cls: "ed-has-hero" });
}

function about(m, ctx) {
  const L = (p) => href(ctx, p);
  const a = m.about;
  // Her first two sentences set large; the rest of her words follow at reading size.
  const all = a.paragraphs.join("\n\n");
  const cut = all.split(/(?<=[.!?])\s+/);
  const lead = cut.slice(0, 2).join(" ");
  const rest = all.slice(lead.length).trim().split(/\n\n/).filter(Boolean);
  const s = m.side;
  const body = `<section class="ed-about-hero">
    <h1 class="ed-about-hero__h"><span class="ed-fit" style="--n:5"><span class="ed-fit__in">About</span></span></h1>
    <figure class="ed-about-hero__photo">${photo("steps-seated", { sizes: "(max-width: 800px) 70vw, 30vw", eager: true })}</figure>
    <p class="ed-about-hero__id">${br(m.person.identity.join(", "))}</p>
  </section>

  <section class="ed-copy" data-reveal>
    ${lead ? `<p class="ed-copy__lead">${esc(lead)}</p>` : ""}
    ${rest.map((t) => `<p>${esc(t)}</p>`).join("")}
  </section>

  <section class="ed-quote-big" aria-labelledby="h-belief" data-reveal>
    <h2 class="ed-label" id="h-belief">What I believe</h2>
    <blockquote><p>${esc(m.practice.belief)}</p></blockquote>
    <p class="ed-quote-big__aside">${esc(m.practice.operator)}</p>
  </section>

  <section class="ed-sec" aria-labelledby="h-path">
    ${secHead("The path", { id: "h-path" })}
    ${rows(a.path.map((x, i) => ({ k: x.when, t: x.text, preview: photoSrc(["portrait-mono", "stairs-dark", "lawn-stand", "doorway-dark", "garden-sun"][i % 5]) })), { cls: "ed-rows--path" })}
  </section>

  <section class="ed-sec" aria-labelledby="h-practice">
    ${secHead("What I do", { id: "h-practice" })}
    ${rows(m.practice.areas.map((x) => ({ t: x.title, s: x.body })), { cls: "ed-rows--xl" })}
    ${m.practice.services.length ? `<h3 class="ed-label ed-label--pad ed-label--gap">Services</h3>${rows(m.practice.services.map((x) => ({ t: x.title, s: x.body, k: (x.tags || []).slice(0, 2).join(", ") })), { h: "h4" })}` : ""}
  </section>

  <section class="ed-sec ed-cv" aria-labelledby="h-exp">
    ${secHead("Experience", { id: "h-exp" })}
    <div class="ed-cv__cols">
      <div><h3 class="ed-label">Roles</h3><ul class="ed-table">${a.experience.map((x) => `<li>${br(String(x.period || "").replace(/[()]/g, ""))}<span class="ed-table__t">${esc(x.role)}</span><span class="ed-table__o">${esc(x.org)}</span></li>`).join("")}</ul></div>
      <div><h3 class="ed-label">Education</h3><ul class="ed-table">${a.education.map((x) => `<li>${br(x.year)}<span class="ed-table__t">${esc(x.title)}</span><span class="ed-table__o">${esc(x.org)}</span></li>`).join("")}</ul>
      <h3 class="ed-label">Recognition</h3><ul class="ed-table">${a.awards.map((x) => `<li>${br(x.year)}<span class="ed-table__t">${esc(x.title)}</span><span class="ed-table__o">${esc(x.org)}</span></li>`).join("")}</ul>
      <h3 class="ed-label">Milestones</h3><ul class="ed-table">${a.career.map((x) => `<li>${br(x.year)}<span class="ed-table__t ed-table__t--span">${esc(x.text)}</span></li>`).join("")}</ul>
      <h3 class="ed-label">Mentoring</h3><p class="ed-cv__p">${esc(m.mentoring)}</p></div>
    </div>
  </section>

  ${a.testimonials.length ? `<section class="ed-sec ed-says" aria-labelledby="h-say">
    ${secHead("Kind words", { id: "h-say" })}
    <div class="ed-says__list">${a.testimonials.map((t) => `<figure class="ed-say" data-reveal><blockquote><p>${esc(t.quote)}</p></blockquote><figcaption>${esc(t.name)} ${br(t.role)}</figcaption></figure>`).join("")}</div>
  </section>` : ""}

  ${sideSection(m, L, { link: false, id: "on-the-side" })}
  ${s.nowPlaying ? `<section class="ed-sec ed-sec--tight" aria-label="On repeat">
    <div class="ed-np" data-reveal>
      <figure class="ed-np__cover">${img(s.nowPlaying.cover, { width: 600, alt: `${s.nowPlaying.album} cover` })}</figure>
      <div><h3 class="ed-label">On repeat</h3><p class="ed-np__song">${esc(s.nowPlaying.song)}</p><p class="ed-np__by">${esc(s.nowPlaying.artist)} ${br(s.nowPlaying.album)}</p>${s.nowPlaying.url ? `<a class="ed-link" href="${esc(s.nowPlaying.url)}" target="_blank" rel="noopener">Listen</a>` : ""}</div>
    </div>
  </section>` : ""}`;
  return shell(m, ctx, { title: "About", description: m.person.intro.join(" "), image: "photo:steps-seated", body });
}

function work(m, ctx) {
  const L = (p) => href(ctx, p);
  const body = `${opener("Work", { count: m.work.all.length, line: "Brand identities, systems and creative direction for companies, events and founders." })}
  <section class="ed-sec ed-sec--flush" aria-label="All projects">${grid(L, m.work.all)}</section>
  <section class="ed-sec" aria-labelledby="h-exp-teaser">
    <a class="ed-teaser" href="${L("/experiments")}" data-reveal>
      <span class="ed-teaser__k">${br("Also in Work")}</span>
      <h2 class="ed-teaser__t" id="h-exp-teaser">Experiments</h2>
      <span class="ed-teaser__s">${esc(m.experiments.introParas[0])}</span>
      <span class="ed-link">Explore Experiments</span>
    </a>
  </section>`;
  return shell(m, ctx, { title: "Work", body });
}

function caseStudy(m, ctx) {
  const L = (p) => href(ctx, p);
  const p = ctx.project;
  const idx = m.work.all.findIndex((x) => x.slug === p.slug);
  const next = m.work.all[(idx + 1) % m.work.all.length];
  const gallery = (images = []) => {
    const items = (images || []).map(media).filter(Boolean);
    if (!items.length) return "";
    return `<div class="ed-gallery">${items.map((im) => `<figure class="ed-g ed-g--${im.size === "half" ? "half" : "full"}" data-reveal>${img(im, { width: im.size === "half" ? 1400 : 2400 })}</figure>`).join("")}</div>`;
  };
  const meta = [
    ["Client", p.client],
    ["Sector", p.services],
    ["Year", p.year],
    ["Scope", (p.tags || []).join(", ")],
  ].filter(([, v]) => v);
  const body = `<article class="ed-case">
    <header class="ed-case__head">
      <p class="ed-label"><a href="${L("/work")}">Work</a> ${br(`${idx + 1} of ${m.work.all.length}`)}</p>
      <h1 class="ed-case__t">${esc(p.title)}</h1>
      <p class="ed-case__s">${esc(p.summary)}</p>
      <dl class="ed-meta">${meta.map(([k, v]) => `<div><dt>${br(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
    </header>
    ${p.cover ? `<figure class="ed-case__cover">${img(p.cover, { width: 2400, eager: true, alt: p.title })}</figure>` : ""}
    ${p.intro ? `<div class="ed-case__intro" data-reveal>${paras(p.intro)}</div>` : ""}
    ${(p.sections || [])
      .map(
        (s, i) => `<section class="ed-case__sec">
        ${s.heading || s.body ? `<div class="ed-case__text" data-reveal><h2 class="ed-case__sh"><span class="ed-case__n">${i + 1}</span> ${esc(s.heading || "")}</h2><div class="ed-case__body">${paras(s.body)}</div></div>` : ""}
        ${gallery(s.images)}
      </section>`
      )
      .join("")}
  </article>
  <section class="ed-next" aria-labelledby="h-next">
    <a href="${L(next.path)}">
      <span class="ed-label">Next project</span>
      <h2 class="ed-next__t" id="h-next">${fit(next.title)}</h2>
      <span class="ed-next__s">${esc(m.work.summaries[next.slug] || next.summary)}</span>
    </a>
  </section>`;
  return shell(m, ctx, { title: p.title, description: p.summary, image: p.thumbnail || p.cover, body });
}

function ventures(m, ctx) {
  const L = (p) => href(ctx, p);
  const body = `${opener("Ventures", { count: m.ventures.length, line: m.venturesIntro })}
  ${m.ventures
    .map(
      (v) => `<section class="ed-ven" id="${esc(v.slug)}" aria-labelledby="vh-${esc(v.slug)}" data-reveal>
      <p class="ed-vent__k">${br(v.kind)}${br(founded(v))}</p>
      <h2 class="ed-ven__name" id="vh-${esc(v.slug)}">${esc(v.name)}</h2>
      <div class="ed-ven__cols">
        <p class="ed-ven__line">${esc(v.line)}</p>
        <div class="ed-ven__body"><p>${esc(v.body)}</p>
          ${v.url ? `<a class="ed-btn" href="${esc(v.url)}" target="_blank" rel="noopener" data-track="venture_click" data-track-target="${esc(v.slug)}">${esc(v.cta)}</a>` : ""}
        </div>
      </div>
      ${v.offers.length ? rows(v.offers.map((o) => ({ t: o.title, s: o.body })), { cls: "ed-rows--md" }) : ""}
    </section>`
    )
    .join("")}
  <section class="ed-sec" id="mentoring" aria-labelledby="h-mentor">
    ${secHead("Mentoring", { id: "h-mentor" })}
    <p class="ed-big-line">${esc(m.mentoring)}</p>
    <p class="ed-actions ed-actions--pad"><a class="ed-btn" href="${L("/contact?about=mentoring")}">Ask about mentoring</a></p>
  </section>`;
  return shell(m, ctx, { title: "Ventures", description: m.ventures.map((v) => `${v.name}: ${v.line}`).join(" "), body });
}

// Thoughts: speaking first, then the books, then the writing.
function writing(m, ctx) {
  const L = (p) => href(ctx, p);
  const s = m.speaking;
  const body = `${opener("Thoughts", { line: m.writing.intro })}
  ${speakingBand(m, L, { h: "h2", eager: true, explore: false })}
  <section class="ed-sec" id="talks" aria-labelledby="h-talks">
    ${secHead("Topics and talks", { id: "h-talks" })}
    ${s.intro ? `<p class="ed-sec__intro" data-reveal>${esc(s.intro)}</p>` : ""}
    ${rows(s.tracks.map((t) => ({ t: t.title, s: t.body })), { cls: "ed-rows--md" })}
    <h3 class="ed-label ed-label--pad ed-label--gap">Talks</h3>
    ${rows(s.talks.map((t) => ({ k: t.event || "", t: t.title })), { cls: "ed-rows--talks" })}
    ${s.appearances.length ? `<h3 class="ed-label ed-label--pad ed-label--gap">Where I've spoken</h3>${rows(s.appearances.map((a) => ({ t: a.title, s: a.body })), { cls: "ed-rows--talks" })}` : ""}
    ${s.press.length ? `<p class="ed-actions ed-actions--pad ed-actions--gap">${s.press.map(([u, l]) => `<a class="ed-btn ed-btn--line" href="${esc(u)}" target="_blank" rel="noopener">${esc(l)}</a>`).join("")}</p>` : ""}
  </section>
  <section class="ed-sec" id="books" aria-labelledby="h-books">
    ${secHead("Books", { id: "h-books", line: m.shop.intro })}
    ${m.books.map((b) => bookFeature(L, b)).join("")}
  </section>
  <section class="ed-sec" id="writing" aria-labelledby="h-essays">
    ${secHead("Writing", { id: "h-essays" })}
    ${noteRows(L, m.writing.notes, { h: "h3" })}
  </section>
  ${signup(m, { title: "New thoughts by email", line: "Essays, books and resources when they're ready. Nothing else.", source: "thoughts" })}`;
  return shell(m, ctx, { title: "Thoughts", description: m.writing.intro, body });
}

function article(m, ctx) {
  const L = (p) => href(ctx, p);
  const n = ctx.note;
  const list = m.writing.notes.filter((x) => x.internal);
  const i = list.findIndex((x) => x.slug === n.slug);
  const next = list.length > 1 ? list[(i + 1) % list.length] : null;
  const body = `<article class="ed-article">
    <header class="ed-article__head">
      <p class="ed-label"><a href="${L("/thoughts#writing")}">Back to Thoughts</a></p>
      <h1 class="ed-article__t">${esc(n.title)}</h1>
      ${n.intro ? `<p class="ed-article__s">${esc(n.intro)}</p>` : n.summary ? `<p class="ed-article__s">${esc(n.summary)}</p>` : ""}
      <div class="ed-article__by"><span>By Bolutife Awakan</span></div>
    </header>
    ${media(n.thumbnail) ? `<figure class="ed-article__cover">${img(n.thumbnail, { width: 2400, eager: true, alt: "" })}</figure>` : ""}
    <div class="ed-read">
      ${(n.sections || [])
        .map(
          (s) => `${s.heading ? `<h2>${esc(s.heading)}</h2>` : ""}${paras(s.body)}
          ${s.pullQuote ? `<blockquote class="ed-pull"><p>${esc(s.pullQuote)}</p></blockquote>` : ""}
          ${media(s.image) ? `<figure class="ed-read__img">${img(s.image, { width: 1600, alt: s.image.alt || "" })}</figure>` : ""}`
        )
        .join("")}
      <p class="ed-read__end"><span class="ed-br">Bolutife Awakan</span><button class="ed-share" type="button" data-share>Copy link</button></p>
    </div>
  </article>
  ${next ? `<section class="ed-next" aria-labelledby="h-next"><a href="${L(thoughtPath(next))}"><span class="ed-label">Next thought</span><h2 class="ed-next__t ed-next__t--note" id="h-next">${esc(next.title)}</h2><span class="ed-next__s">${esc(next.summary || "")}</span></a></section>` : ""}`;
  return shell(m, ctx, { title: n.title, description: n.summary || n.title, image: n.thumbnail, body });
}

/* ---------- shop ---------- */

function shop(m, ctx) {
  const L = (p) => href(ctx, p);
  const body = `${opener("Shop", { line: m.shop.intro })}
  <section class="ed-sec ed-sec--flush" aria-label="Books">
    ${m.books.map((b) => bookFeature(L, { ...b, line: b.editions ? `${b.subtitle} From ${lowest(b.editions)}.` : b.line }, { h: "h2" })).join("")}
  </section>
  <section class="ed-sec" aria-labelledby="h-more">
    <a class="ed-teaser" href="${esc(m.shop.storeUrl)}" target="_blank" rel="noopener" data-track="book_click" data-track-target="store" data-reveal>
      <span class="ed-teaser__k">${br("More resources")}</span>
      <h2 class="ed-teaser__t" id="h-more">The store</h2>
      <span class="ed-teaser__s">Guides, courses and consultations live in my online store.</span>
      <span class="ed-link">Visit the store</span>
    </a>
  </section>`;
  return shell(m, ctx, { title: "Shop", description: m.shop.intro, body });
}
const lowest = (eds) => eds.map((e) => e.price).sort((a, b) => parseFloat(a.replace(/[^\d.]/g, "")) - parseFloat(b.replace(/[^\d.]/g, "")))[0];

function book(m, ctx) {
  const L = (p) => href(ctx, p);
  const b = ctx.book;
  return b.slug === "worth-the-work" ? worthTheWork(m, ctx, L, b) : signature(m, ctx, L, b);
}

function bookHero(L, b, extra = "") {
  return `<section class="ed-bookhero">
    <p class="ed-label"><a href="${L("/shop")}">Shop</a></p>
    <div class="ed-bookhero__grid">
      <div class="ed-bookhero__obj">${cover(b, { eager: true })}</div>
      <div class="ed-bookhero__text">
        <p class="ed-bookhero__by">${br("Book by Bolutife Awakan")}</p>
        <h1 class="ed-bookhero__t">${esc(b.title)}</h1>
        <p class="ed-bookhero__sub">${esc(b.subtitle)}</p>
        ${extra}
      </div>
    </div>
  </section>`;
}

function worthTheWork(m, ctx, L, b) {
  const learn = [
    ["Understand your costs", "Look beyond the visible deliverable and account for the time, resources, and expenses involved in delivering creative services."],
    ["Price with more clarity", "Understand how costs, margins, value, and business considerations influence what you charge."],
    ["Recognise bad revenue", "Learn to evaluate opportunities that may appear profitable but consume more resources than they're worth."],
    ["Make better business decisions", "Explore practical pricing situations that help you evaluate projects, negotiate scope, and make informed decisions."],
  ];
  const body = `${bookHero(L, b, `<p class="ed-actions"><a class="ed-btn" href="#editions" data-track="book_click" data-track-target="worth-the-work-get">Get Worth the Work</a></p><p class="ed-note">From ${esc(lowest(b.editions))}. Checkout and delivery are handled by Selar, my store.</p>`)}
  <section class="ed-copy" data-reveal>
    <p class="ed-copy__lead">You can be talented, consistently busy, and still struggle to make your creative work financially sustainable.</p>
    <p>I've seen how easily creatives can confuse having projects with making progress. We spend years improving our skills, building portfolios, and finding clients, but often give far less attention to understanding what our work costs, how to price it, or whether the opportunities we're accepting actually make business sense.</p>
    <p>I wrote Worth the Work to address that gap.</p>
  </section>
  <section class="ed-sec" aria-labelledby="h-inside">
    ${secHead("Inside the book", { id: "h-inside" })}
    ${rows(learn.map(([t, s]) => ({ t, s })), { cls: "ed-rows--md" })}
  </section>
  <section class="ed-sec" aria-labelledby="h-for">
    <h2 class="ed-label ed-label--pad" id="h-for">Who it's for</h2>
    <p class="ed-big-line" data-reveal>Designers, writers, photographers, illustrators, freelancers, and other independent creatives building a sustainable business around their skills.</p>
  </section>
  <section class="ed-quote-big" aria-label="Why I wrote it" data-reveal>
    <blockquote><p>I believe creative work deserves to be taken seriously as work.</p></blockquote>
    <div class="ed-quote-big__aside"><p>That means appreciating the craft, but also understanding the business that makes it possible to continue practising it.</p><p>You shouldn't have to choose between doing meaningful work and making a sustainable living from it.</p></div>
  </section>
  <section class="ed-sec" id="editions" aria-labelledby="h-editions">
    ${secHead("Get the book", { id: "h-editions" })}
    <ul class="ed-eds">${b.editions
      .map(
        (e) => `<li data-reveal><a class="ed-eds__a" href="${esc(e.url)}" target="_blank" rel="noopener" data-track="book_click" data-track-target="${esc(e.url.split("/").pop())}">
        <span class="ed-eds__t">${esc(e.title)}</span>
        <span class="ed-eds__d">${esc(e.detail)}</span>
        <span class="ed-eds__p">${esc(e.price)}</span>
        <span class="ed-eds__go">Buy on Selar</span>
      </a></li>`
      )
      .join("")}</ul>
    <p class="ed-note ed-note--pad">Prices are set in the store, which handles payment, delivery and your order confirmation.</p>
  </section>`;
  return shell(m, ctx, { title: "Worth the Work", description: b.subtitle, image: b.cover, body });
}

function signature(m, ctx, L, b) {
  const chapters = ["Embracing the Journey", "Who Am I?", "Understanding Branding", "Your Signature", "Becoming Your Brand", "How to Approach Branding Based on Personality", "Fine Details"];
  const body = `${bookHero(L, b, `<p class="ed-note">Signature isn't available to order yet. Leave your email below and I'll let you know when it is.</p>`)}
  <section class="ed-copy" data-reveal>
    <p class="ed-copy__lead">${esc(b.line)}</p>
    <p>Signature argues that a real personal brand begins with self-discovery, not with formulas. Without that self-knowledge, it's easy to end up keeping up a façade that never quite feels like you.</p>
    <p>The book moves from self-awareness and understanding what branding really is, to defining your purpose, values and ambitions, and then to expressing your brand with confidence.</p>
    <p>It's written for anyone building a personal brand: introverts and extroverts, multipotentialites, business owners, professionals, mums and creators.</p>
  </section>
  <section class="ed-sec" aria-labelledby="h-chapters">
    ${secHead("Chapters", { id: "h-chapters" })}
    ${rows(chapters.map((t, i) => ({ k: `Chapter ${i + 1}`, t })), { cls: "ed-rows--path" })}
  </section>
  ${signup(m, { title: "Tell me when Signature is out", line: "One email when the book can be ordered.", source: "signature" })}`;
  return shell(m, ctx, { title: "Signature", description: b.line, body });
}

const ABOUT = [
  ["project", "A brand or creative project"],
  ["call", "Booking a call"],
  ["leadership", "Design leadership"],
  ["speaking", "Speaking at an event"],
  ["mentoring", "Mentoring"],
  ["other", "Something else"],
];

function contact(m, ctx) {
  const p = m.person;
  const about = ABOUT.some(([k]) => k === ctx.query.about) ? ctx.query.about : "project";
  const body = `${opener("Say hello", { line: m.contactLine })}
  <section class="ed-contact">
    <form class="ed-form" data-mailto="${esc(p.email)}">
      <fieldset class="ed-form__about">
        <legend>What is it about?</legend>
        ${ABOUT.map(([k, l]) => `<label><input type="radio" name="about" value="${k}"${k === about ? " checked" : ""}><span>${esc(l)}</span></label>`).join("")}
      </fieldset>
      <label class="ed-field"><span>Your name</span><input name="name" autocomplete="name" required></label>
      <label class="ed-field"><span>Your email</span><input name="email" type="email" autocomplete="email" required></label>
      <label class="ed-field"><span>Message</span><textarea name="message" rows="5" required placeholder="${about === "call" ? "What you'd like to talk about, and a few times that suit you" : ""}"></textarea></label>
      <button class="ed-btn" type="submit">Send a message</button>
      <p class="ed-note">This opens an email to me with your message filled in.</p>
    </form>
    <aside class="ed-contact__aside">
      <figure>${photo("garden-sun", { sizes: "(max-width: 800px) 60vw, 26vw" })}</figure>
      <dl class="ed-meta ed-meta--stack">
        <div><dt>Email</dt><dd><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></dd></div>
        <div><dt>Based in</dt><dd>${esc(p.base)}</dd></div>
        <div><dt>Paid consultation</dt><dd><a href="https://selar.com/i775xl96wj" target="_blank" rel="noopener">Book a consultation</a></dd></div>
        <div><dt>Elsewhere</dt><dd>${p.socials.map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join(", ")}</dd></div>
      </dl>
    </aside>
  </section>`;
  return shell(m, ctx, { title: "Contact", body });
}

function index(m, ctx) {
  const L = (p) => href(ctx, p);
  const items = contentIndex(m).map((i) => ({ ...i, path: i.path && i.path.replace(/^\/writing/, "/thoughts").replace(/^\/speaking/, "/thoughts").replace(/^\/on-the-side/, "/about"), type: i.type === "Writing" ? "Thoughts" : i.type }));
  const groups = [...new Set(items.map((i) => i.type))];
  const body = `${opener("Everything", { count: items.length, line: "Every project, venture, thought, talk and page on the site." })}
  <section class="ed-sec ed-sec--flush"><div class="ed-index">${groups
    .map(
      (g) => `<div><h2 class="ed-label">${esc(g)}</h2><ul>${items
        .filter((i) => i.type === g)
        .map((i) => {
          const h = i.path ? L(i.path) : i.href;
          return `<li><a href="${esc(h || L("/"))}"${i.path ? "" : extAttrs(h)}>${esc(i.title)}</a>${i.meta && i.type !== "Thoughts" ? br(i.meta) : ""}</li>`;
        })
        .join("")}</ul></div>`
    )
    .join("")}</div></section>`;
  return shell(m, ctx, { title: "Everything", body });
}

function experiments(m, ctx) {
  const L = (p) => href(ctx, p);
  const x = m.experiments;
  const shots = x.shots.map((s) => ({ ...s, m: media(s.media) })).filter((s) => s.m);
  const cats = [...new Set(shots.map((s) => s.category).filter(Boolean))];
  const body = `<p class="ed-label ed-label--pad ed-label--top"><a href="${L("/work")}">Work</a></p>
  ${opener("Experiments", { count: shots.length || null, lines: x.introParas })}
  <section class="ed-sec ed-sec--flush ed-exp" aria-label="Experiments">
    ${cats.length > 1 ? `<div class="ed-filter" role="group" aria-label="Filter experiments"><button type="button" data-filter="" aria-pressed="true">All</button>${cats.map((c) => `<button type="button" data-filter="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join("")}</div>` : ""}
    ${shots.length
      ? `<ul class="ed-shots">${shots
          .map(
            (s, i) => `<li class="ed-shot ed-shot--${["a", "b", "c"][i % 3]}" data-cat="${esc(s.category || "")}" data-reveal>
          <figure>${img(s.m, { width: 1600, alt: s.title || "" })}
            <figcaption><span class="ed-shot__t">${esc(s.title || "")}</span>${s.caption ? `<span class="ed-shot__c">${esc(s.caption)}</span>` : ""}${s.category ? br(s.category) : ""}</figcaption>
          </figure>
        </li>`
          )
          .join("")}</ul>`
      : ""}
  </section>
  <section class="ed-sec" aria-labelledby="h-kinds">
    <h2 class="ed-label ed-label--pad" id="h-kinds">What lives here</h2>
    <ul class="ed-tags ed-tags--pad">${x.kinds.map((k) => `<li>${esc(k)}</li>`).join("")}</ul>
  </section>`;
  return shell(m, ctx, { title: "Experiments", description: x.intro, body });
}

function notFound(m, ctx) {
  const L = (p) => href(ctx, p);
  const body = `${opener("Lost", { line: "This page has moved or never existed. Everything else is a click away." })}
  <section class="ed-sec ed-sec--flush">${rows([...NAV, { path: "/contact", label: "Say hello" }].map((s) => ({ href: L(s.path), t: s.label })), { h: "h2", cls: "ed-rows--xl" })}</section>`;
  return shell(m, ctx, { title: "Not found", body });
}

// Speaking now lives on Thoughts and On the side on About; these keep old links working.
const speaking = (m, ctx) => writing(m, ctx);
const side = (m, ctx) => about(m, ctx);

const PAGES = { home, about, work, case: caseStudy, ventures, speaking, writing, article, side, contact, index, experiments, shop, book, notFound };
export function render(key, m, ctx) {
  return (PAGES[key] || notFound)(m, ctx);
}
