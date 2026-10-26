// Direction B — The Personal Editorial (Mason Wong as the reference).
// Night ground sampled from the studio portraits, so the dark shots melt
// into the page. Huge condensed type (Archivo at its narrowest), small
// bracketed labels, her patchwork stripe as the one graphic device, and a
// signature script used twice. Short lines; pictures do the talking.

import { esc, img, media } from "../../media.mjs";
import { photo } from "../../photos.mjs";
import { headTags, href, paras, extAttrs, year, fmtDate } from "../../shell.mjs";
import { contentIndex, SECTIONS } from "../../model.mjs";
import { markEditorial } from "../marks.mjs";

const NAV = SECTIONS; // About, Work, Ventures, Speaking, Writing, On the side, Contact
const ORDER = ["work", "ventures", "speaking", "writing", "about", "side", "contact"];
const MENU = ORDER.map((k) => NAV.find((s) => s.key === k));
const navKey = { about: "about", work: "work", case: "work", ventures: "ventures", speaking: "speaking", writing: "writing", article: "writing", side: "side", contact: "contact" };

const timeIn = (tz) => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz });
const clocks = (cls = "") =>
  `<span class="ed-clocks ${cls}" role="group" aria-label="Local time in Lagos and London"><span>[Lagos <time data-tz="Africa/Lagos">${timeIn("Africa/Lagos")}</time>]</span><span>[London <time data-tz="Europe/London">${timeIn("Europe/London")}</time>]</span></span>`;

// Bracketed label, Mason-style: [2022]
const br = (t) => (t ? `<span class="ed-br">[${esc(t)}]</span>` : "");
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
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,300..900;1,62..125,300..900&family=IBM+Plex+Mono:wght@400;500&family=Ms+Madi&display=swap">
<link rel="stylesheet" href="/assets/editorial.css?v=2">
<script src="/assets/editorial.js?v=2" defer></script>
</head>
<body class="ed-page ed-page--${ctx.pageKey} ${cls}">
<a class="ed-skip" href="#main">Skip to content</a>
<header class="ed-head">
  <a class="ed-head__brand" href="${L("/")}" aria-label="Bolutife Awakan, home">${markEditorial({ size: 40, title: "" })}<span>Bolutife Awakan</span></a>
  <nav class="ed-head__nav" aria-label="Main"><ul>${MENU.map((s) => `<li><a href="${L(s.path)}"${cur(s.key)}>${s.label}</a></li>`).join("")}</ul></nav>
  ${clocks("ed-head__clocks")}
  <button class="ed-head__menu" type="button" aria-expanded="false" aria-controls="ed-menu">Menu</button>
</header>
<div class="ed-menu" id="ed-menu" role="dialog" aria-modal="true" aria-label="Menu" hidden>
  <div class="ed-menu__top">${markEditorial({ size: 40, title: "" })}<button class="ed-menu__close" type="button">Close</button></div>
  <nav aria-label="Menu"><ol>${MENU.map((s, i) => `<li><a href="${L(s.path)}"${cur(s.key)}><span class="ed-br">[${pad(i + 1)}]</span>${s.label}</a></li>`).join("")}</ol></nav>
  ${clocks()}
</div>
<main id="main">
${body}
</main>
${footer(m, ctx)}
</body>
</html>`;
}

function footer(m, ctx) {
  const L = (p) => href(ctx, p);
  const p = m.person;
  return `<footer class="ed-foot">
  ${stripe()}
  <section class="ed-foot__cta" aria-labelledby="h-hello">
    <p class="ed-sign" aria-hidden="true">hello,</p>
    <h2 class="ed-foot__h" id="h-hello">${fit("Say hello", { cls: "ed-fit--foot" })}</h2>
    <div class="ed-foot__row">
      <p class="ed-foot__lead">Brand projects, design leadership, mentoring or a talk. Tell me what you're working on.</p>
      <p class="ed-foot__mail"><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></p>
      <p class="ed-actions"><a class="ed-btn" href="${L("/contact")}">Send a message</a><a class="ed-btn ed-btn--line" href="${L("/contact?about=speaking")}">Book a talk</a></p>
    </div>
  </section>
  <div class="ed-foot__grid">
    <nav class="ed-foot__nav" aria-label="Footer"><ul>${[...MENU, { path: "/experiments", label: "Experiments" }, { path: "/index", label: "Everything" }].map((s) => `<li><a href="${L(s.path)}">${s.label}</a></li>`).join("")}</ul></nav>
    <ul class="ed-foot__social">${p.socials.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join("")}</ul>
    <div class="ed-foot__meta">${clocks()}<p>${esc(p.locations.join(" / "))}</p><p>${esc(m.photoCredit)}</p><p>&copy; Bolutife Awakan ${year()}</p></div>
  </div>
  <div class="ed-foot__mark" aria-hidden="true">${markEditorial({ size: 1200, title: "" })}</div>
</footer>`;
}

/* ---------- parts ---------- */

// Page opener: one giant condensed word, a bracket count, a short line.
const opener = (word, { count, line, h = "h1", id } = {}) => `<header class="ed-open">
  <${h} class="ed-open__h"${id ? ` id="${id}"` : ""}>${fit(word)}${count != null ? `<sup class="ed-open__n">[${pad(count)}]</sup>` : ""}</${h}>
  ${line ? `<p class="ed-open__line">${esc(line)}</p>` : ""}
</header>`;

const label = (t) => `<p class="ed-label">${br(t)}</p>`;

const projMeta = (p) => `${br(p.year)}${br(p.services)}`;

function stack(L, projects) {
  return `<ol class="ed-stack">${projects
    .map(
      (p, i) => `<li class="ed-stack__card" style="--i:${i}">
      <a class="ed-stack__a" href="${L(p.path)}">
        <figure class="ed-stack__img">${img(p.thumbnail || p.cover, { width: 2400, alt: "" })}</figure>
        <span class="ed-stack__shade" aria-hidden="true"></span>
        <span class="ed-stack__meta"><span class="ed-br">[${pad(i + 1)}/${pad(projects.length)}]</span>${projMeta(p)}</span>
        <span class="ed-stack__t">${esc(p.title)}</span>
        <span class="ed-stack__s">${esc(p.summary)}</span>
        <span class="ed-stack__go">View the case study</span>
      </a>
    </li>`
    )
    .join("")}</ol>`;
}

function grid(L, projects) {
  return `<ul class="ed-grid">${projects
    .map(
      (p, i) => `<li class="ed-grid__item ed-grid__item--${i % 3 === 0 ? "wide" : "half"}">
      <a href="${L(p.path)}">
        <figure>${img(p.thumbnail || p.cover, { width: i % 3 === 0 ? 2400 : 1400, alt: "" })}</figure>
        <span class="ed-grid__meta">${projMeta(p)}</span>
        <h2 class="ed-grid__t">${esc(p.title)}</h2>
        <span class="ed-grid__s">${esc(p.summary)}</span>
      </a>
    </li>`
    )
    .join("")}</ul>`;
}

// Big list rows with a photo that follows the pointer on wide screens.
function rows(items, { h = "h3", cls = "" } = {}) {
  return `<ul class="ed-rows ${cls}">${items
    .map(
      (r) => `<li class="ed-row"${r.preview ? ` data-preview="${esc(r.preview)}"` : ""}>
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

function ventureRows(L, ventures, { h = "h3" } = {}) {
  return `<ul class="ed-vent">${ventures
    .map(
      (v) => `<li class="ed-vent__item" id="${esc(v.slug)}">
      <p class="ed-vent__k">${br(v.kind)}${br("Founded by Bolutife")}</p>
      <${h} class="ed-vent__name">${esc(v.name)}</${h}>
      <p class="ed-vent__line">${esc(v.line)}</p>
      ${v.url ? `<a class="ed-link" href="${esc(v.url)}" target="_blank" rel="noopener" data-track="venture_click" data-track-target="${esc(v.slug)}">${esc(v.cta)}</a>` : `<span class="ed-vent__soon">${br("Website coming")}</span>`}
    </li>`
    )
    .join("")}</ul>`;
}

const bookRow = (b, h = "h3") => `<div class="ed-book">
  <p class="ed-book__k">${br("The book")}${br(b.role)}</p>
  <${h} class="ed-book__t">${esc(b.title)}</${h}>
  <p class="ed-book__s">${esc(b.line)}</p>
  ${b.url ? `<a class="ed-link" href="${esc(b.url)}" target="_blank" rel="noopener" data-track="book_click" data-track-target="book">${esc(b.cta)}</a>` : ""}
</div>`;

function noteRows(L, notes, { limit, h = "h3" } = {}) {
  const list = limit ? notes.slice(0, limit) : notes;
  return rows(
    list.map((n) => ({
      href: n.path ? L(n.path) : n.href || "#",
      ext: !n.path && /^https?:/.test(n.href || ""),
      k: n.date ? fmtDate(n.date).replace(/^\d+ /, "") : "",
      t: n.title,
      s: n.summary || "",
      preview: previewSrc(n.thumbnail),
    })),
    { h, cls: "ed-rows--notes" }
  );
}

// Inline photo chips inside a sentence. Decorative; the sentence reads whole.
const chip = (slug) => `<span class="ed-chip" aria-hidden="true">${photo(slug, { sizes: "160px", alt: "" })}</span>`;

const DESK = ["chair-gold", "garden-sun", "arch-mono", "lawn-crouch", "portrait-mono", "steps-smile", "colonnade"];

function desk(slugs, tags = []) {
  return `<div class="ed-desk" data-desk>
    ${slugs.map((s, i) => `<figure class="ed-desk__p ed-desk__p--${i + 1}" data-drag>${photo(s, { sizes: "(max-width: 800px) 45vw, 22vw" })}${tags[i] ? `<figcaption>${br(tags[i])}</figcaption>` : ""}</figure>`).join("")}
  </div>`;
}

/* ---------- pages ---------- */

function home(m, ctx) {
  const L = (p) => href(ctx, p);
  const p = m.person;
  const sup = p.supporting; // "I've spent over a decade working across design, creative direction, and business. These days, ..."
  const statement = sup
    .replace("over a decade", `over a decade ${chip("steps-smile")}`)
    .replace("creative direction,", `creative direction ${chip("colonnade")},`)
    .replace("developing people,", `developing people ${chip("garden-sun")},`);
  const body = `
<section class="ed-hero" aria-labelledby="ed-hero-h">
  <figure class="ed-hero__photo">${photo("textile-dark", { sizes: "(max-width: 800px) 92vw, 44vw", eager: true })}</figure>
  <div class="ed-hero__top">
    <p class="ed-hero__id">${esc(p.identity.join(", "))}</p>
    <p class="ed-hero__where">${br(p.locations.map((l) => l.split(",")[0]).join(" / "))}</p>
  </div>
  <p class="ed-hero__head">${esc(p.headline)}</p>
  <h1 class="ed-hero__name" id="ed-hero-h"><span class="ed-fit ed-hero__first" style="--n:8"><span class="ed-fit__in">${[...p.first].map((ch, i) => `<span class="ed-ch" style="--d:${i}">${esc(ch)}</span>`).join("")}</span></span><span class="ed-hero__last">${esc(p.last)}</span></h1>
  <a class="ed-hero__scroll" href="#work">${br("Scroll down")}</a>
</section>
${stripe("ed-stripe--hero")}

<section class="ed-intro" aria-labelledby="h-intro">
  <h2 class="ed-label" id="h-intro">${br("Hello")}</h2>
  <p class="ed-intro__p">${statement}</p>
  <p class="ed-intro__more"><a class="ed-link" href="${L("/about")}">More about me</a></p>
</section>

<section class="ed-work" id="work" aria-labelledby="h-work">
  <h2 class="ed-work__h" id="h-work">${fit("Selected work")}<sup class="ed-open__n">[${pad(m.work.featured.length)}]</sup></h2>
  ${stack(L, m.work.featured)}
  <p class="ed-more-row"><a class="ed-link ed-link--big" href="${L("/work")}">All work ${br(pad(m.work.all.length))}</a></p>
</section>

<section class="ed-practice" aria-labelledby="h-practice">
  <h2 class="ed-label" id="h-practice">${br("What I do")}</h2>
  ${rows(
    m.practice.areas.map((a, i) => ({ k: pad(i + 1), t: a.title, s: a.body, preview: photoSrc(["colonnade", "stairs-dark", "steps-seated"][i % 3]) })),
    { cls: "ed-rows--xl" }
  )}
</section>

<section class="ed-ventures" aria-labelledby="h-ventures">
  <div class="ed-split">
    <h2 class="ed-split__h" id="h-ventures">${fit("I also build", { cls: "ed-fit--left" })}</h2>
    <p class="ed-split__line">Two organisations I founded. Each has its own name and identity.</p>
  </div>
  ${ventureRows(L, m.ventures)}
  <p class="ed-more-row"><a class="ed-link" href="${L("/ventures")}">About the ventures</a></p>
</section>

<section class="ed-stage" aria-labelledby="h-stage">
  <figure class="ed-stage__img">${m.speaking.image ? img(m.speaking.image, { width: 2400, alt: "Bolutife speaking on stage" }) : photo("colonnade", { sizes: "100vw" })}</figure>
  <div class="ed-stage__over">
    <h2 class="ed-stage__h" id="h-stage">${fit("On stage")}</h2>
    <p class="ed-stage__line">${esc(m.speaking.promise)}</p>
    <p class="ed-actions"><a class="ed-btn" href="${L("/contact?about=speaking")}">Book me to speak</a><a class="ed-btn ed-btn--line" href="${L("/speaking")}">Topics and talks</a></p>
  </div>
  <div class="ed-marquee" aria-hidden="true"><div class="ed-marquee__in">${[0, 1].map(() => m.speaking.tracks.map((t) => `<span>${esc(t.title)}</span>`).join("")).join("")}</div></div>
  <ul class="ed-vh">${m.speaking.tracks.map((t) => `<li>${esc(t.title)}</li>`).join("")}</ul>
</section>

<section class="ed-writing" aria-labelledby="h-writing">
  <div class="ed-split">
    <h2 class="ed-split__h" id="h-writing">${fit("Notes", { cls: "ed-fit--left" })}</h2>
    <p class="ed-split__line">${esc(m.writing.intro)}</p>
  </div>
  ${noteRows(L, m.writing.notes, { limit: 3 })}
  ${m.books.map((b) => bookRow(b)).join("")}
  <p class="ed-more-row"><a class="ed-link" href="${L("/writing")}">All writing</a></p>
</section>

<section class="ed-side" aria-labelledby="h-side">
  <div class="ed-side__text">
    <h2 class="ed-side__h" id="h-side">${fit("On the side", { cls: "ed-fit--left" })}</h2>
    <p class="ed-sign ed-sign--side" aria-hidden="true">off duty</p>
    <p class="ed-side__line">${esc(m.side.intro.split(". ").slice(0, 1).join(". ").replace(/\.?$/, "."))}</p>
    <ul class="ed-tags">${m.side.interests.map((x) => `<li>${esc(x.title)}</li>`).join("")}</ul>
    <a class="ed-link" href="${L("/on-the-side")}">Life outside work</a>
    <p class="ed-hint" aria-hidden="true">${br("Move the photos around")}</p>
  </div>
  ${desk(DESK.slice(0, 5))}
</section>`;
  return shell(m, ctx, { body, image: "photo:textile-dark", cls: "ed-has-hero" });
}

function about(m, ctx) {
  const L = (p) => href(ctx, p);
  const a = m.about;
  const [lead, ...rest] = a.paragraphs;
  const body = `<section class="ed-about-hero">
    <h1 class="ed-about-hero__h"><span class="ed-fit" style="--n:5"><span class="ed-fit__in">About</span></span></h1>
    <figure class="ed-about-hero__photo">${photo("steps-seated", { sizes: "(max-width: 800px) 70vw, 30vw", eager: true })}</figure>
    <p class="ed-about-hero__id">${br(m.person.identity.join(" / "))}</p>
  </section>

  <section class="ed-copy">
    ${label("In short")}
    ${lead ? `<p class="ed-copy__lead">${esc(lead)}</p>` : ""}
    ${rest.map((t) => `<p>${esc(t)}</p>`).join("")}
  </section>

  <section class="ed-quote-big" aria-labelledby="h-belief">
    <h2 class="ed-label" id="h-belief">${br("What I believe")}</h2>
    <blockquote><p>${esc(m.practice.belief)}</p></blockquote>
    <p class="ed-quote-big__aside">${esc(m.practice.operator)}</p>
  </section>

  <section class="ed-sec" aria-labelledby="h-path">
    ${opener("The path", { h: "h2", id: "h-path" })}
    ${rows(a.path.map((s, i) => ({ k: s.when, t: s.text, preview: photoSrc(["portrait-mono", "stairs-dark", "lawn-stand", "doorway-dark", "garden-sun"][i % 5]) })), { cls: "ed-rows--path" })}
  </section>

  <section class="ed-sec" aria-labelledby="h-practice">
    ${opener("What I do", { h: "h2", id: "h-practice" })}
    ${rows(m.practice.areas.map((x) => ({ t: x.title, s: x.body })), { cls: "ed-rows--xl" })}
    <h3 class="ed-label">${br("Services")}</h3>
    ${rows(m.practice.services.map((s) => ({ t: s.title, s: s.body, k: (s.tags || []).slice(0, 2).join(", ") })), { h: "h4" })}
  </section>

  <section class="ed-sec ed-cv" aria-labelledby="h-exp">
    ${opener("Experience", { h: "h2", id: "h-exp" })}
    <div class="ed-cv__cols">
      <div><h3 class="ed-label">${br("Roles")}</h3><ul class="ed-table">${a.experience.map((x) => `<li><span class="ed-br">[${esc(String(x.period || "").replace(/[()]/g, ""))}]</span><span class="ed-table__t">${esc(x.role)}</span><span class="ed-table__o">${esc(x.org)}</span></li>`).join("")}</ul></div>
      <div><h3 class="ed-label">${br("Education")}</h3><ul class="ed-table">${a.education.map((x) => `<li><span class="ed-br">[${esc(x.year)}]</span><span class="ed-table__t">${esc(x.title)}</span><span class="ed-table__o">${esc(x.org)}</span></li>`).join("")}</ul>
      <h3 class="ed-label">${br("Recognition")}</h3><ul class="ed-table">${a.awards.map((x) => `<li><span class="ed-br">[${esc(x.year)}]</span><span class="ed-table__t">${esc(x.title)}</span><span class="ed-table__o">${esc(x.org)}</span></li>`).join("")}</ul>
      <h3 class="ed-label">${br("Milestones")}</h3><ul class="ed-table">${a.career.map((x) => `<li><span class="ed-br">[${esc(x.year)}]</span><span class="ed-table__t ed-table__t--span">${esc(x.text)}</span></li>`).join("")}</ul>
      <h3 class="ed-label">${br("Mentoring")}</h3><p class="ed-cv__p">${esc(m.mentoring)}</p></div>
    </div>
  </section>

  <section class="ed-sec ed-says" aria-labelledby="h-say">
    ${opener("Kind words", { h: "h2", id: "h-say" })}
    <div class="ed-says__list">${a.testimonials.map((t) => `<figure class="ed-say"><blockquote><p>${esc(t.quote)}</p></blockquote><figcaption>${esc(t.name)} ${br(t.role)}</figcaption></figure>`).join("")}</div>
  </section>`;
  return shell(m, ctx, { title: "About", description: m.person.supporting, image: "photo:steps-seated", body });
}

function work(m, ctx) {
  const L = (p) => href(ctx, p);
  const body = `${opener("Work", { count: m.work.all.length, line: "Brand identities, systems and creative direction for companies, events and founders." })}
  <section class="ed-sec ed-sec--flush" aria-label="All projects">${grid(L, m.work.all)}</section>`;
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
    return `<div class="ed-gallery">${items.map((im) => `<figure class="ed-g ed-g--${im.size === "half" ? "half" : "full"}">${img(im, { width: im.size === "half" ? 1400 : 2400 })}</figure>`).join("")}</div>`;
  };
  const meta = [
    ["Client", p.client],
    ["Sector", p.services],
    ["Year", p.year],
    ["Scope", (p.tags || []).join(", ")],
  ].filter(([, v]) => v);
  const body = `<article class="ed-case">
    <header class="ed-case__head">
      <p class="ed-label"><a href="${L("/work")}">[Work]</a> ${br(`${pad(idx + 1)}/${pad(m.work.all.length)}`)}</p>
      <h1 class="ed-case__t">${esc(p.title)}</h1>
      <p class="ed-case__s">${esc(p.summary)}</p>
      <dl class="ed-meta">${meta.map(([k, v]) => `<div><dt>${br(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
    </header>
    ${p.cover ? `<figure class="ed-case__cover">${img(p.cover, { width: 2400, eager: true, alt: p.title })}</figure>` : ""}
    ${p.intro ? `<div class="ed-case__intro">${paras(p.intro)}</div>` : ""}
    ${(p.sections || [])
      .map(
        (s, i) => `<section class="ed-case__sec">
        ${s.heading || s.body ? `<div class="ed-case__text"><h2 class="ed-case__sh">${br(pad(i + 1))} ${esc(s.heading || "")}</h2><div class="ed-case__body">${paras(s.body)}</div></div>` : ""}
        ${gallery(s.images)}
      </section>`
      )
      .join("")}
  </article>
  <section class="ed-next" aria-labelledby="h-next">
    <a href="${L(next.path)}">
      <span class="ed-label">${br("Next project")}</span>
      <h2 class="ed-next__t" id="h-next">${fit(next.title)}</h2>
      <span class="ed-next__s">${esc(next.summary)}</span>
    </a>
  </section>`;
  return shell(m, ctx, { title: p.title, description: p.summary, image: p.thumbnail || p.cover, body });
}

function ventures(m, ctx) {
  const L = (p) => href(ctx, p);
  const body = `${opener("Ventures", { count: m.ventures.length, line: "Alongside my design leadership work, I founded two organisations. Each has its own name, identity and team." })}
  ${m.ventures
    .map(
      (v) => `<section class="ed-ven" id="${esc(v.slug)}" aria-labelledby="vh-${esc(v.slug)}">
      <p class="ed-vent__k">${br(v.kind)}${br(`${v.role}: Bolutife Awakan`)}</p>
      <h2 class="ed-ven__name" id="vh-${esc(v.slug)}">${esc(v.name)}</h2>
      <div class="ed-ven__cols">
        <p class="ed-ven__line">${esc(v.line)}</p>
        <div class="ed-ven__body"><p>${esc(v.body)}</p>
          ${v.url ? `<a class="ed-btn" href="${esc(v.url)}" target="_blank" rel="noopener" data-track="venture_click" data-track-target="${esc(v.slug)}">${esc(v.cta)}</a>` : `<p class="ed-vent__soon">${br("Website coming")}</p>`}
        </div>
      </div>
      ${v.offers.length ? rows(v.offers.map((o, i) => ({ k: pad(i + 1), t: o.title, s: o.body }))) : ""}
    </section>`
    )
    .join("")}
  <section class="ed-sec" id="mentoring" aria-labelledby="h-mentor">
    ${opener("Mentoring", { h: "h2", id: "h-mentor" })}
    <p class="ed-big-line">${esc(m.mentoring)}</p>
    <p class="ed-actions"><a class="ed-btn" href="${L("/contact?about=mentoring")}">Ask about mentoring</a></p>
  </section>`;
  return shell(m, ctx, { title: "Ventures", description: m.ventures.map((v) => `${v.name}: ${v.line}`).join(" "), body });
}

function speaking(m, ctx) {
  const L = (p) => href(ctx, p);
  const s = m.speaking;
  const body = `<section class="ed-stage ed-stage--page">
    <figure class="ed-stage__img">${s.image ? img(s.image, { width: 2400, eager: true, alt: "Bolutife speaking on stage" }) : photo("colonnade", { sizes: "100vw", eager: true })}</figure>
    <div class="ed-stage__over">
      <h1 class="ed-stage__h">${fit("Speaking")}</h1>
      <p class="ed-stage__line">${esc(s.promise)}</p>
      <p class="ed-actions"><a class="ed-btn" href="${L("/contact?about=speaking")}">Book me to speak</a></p>
    </div>
  </section>
  <section class="ed-copy">
    ${label("How I speak")}
    <p class="ed-copy__lead">${esc(s.intro)}</p>
    <p class="ed-tags-line">${s.formats.map((f) => br(f)).join(" ")}</p>
  </section>
  <section class="ed-sec" aria-labelledby="h-topics">
    ${opener("Topics", { h: "h2", id: "h-topics", count: s.tracks.length })}
    ${rows(s.tracks.map((t, i) => ({ k: pad(i + 1), t: t.title, s: t.body })), { cls: "ed-rows--xl" })}
  </section>
  <section class="ed-sec" id="talks" aria-labelledby="h-talks">
    ${opener("Talks", { h: "h2", id: "h-talks" })}
    ${rows(s.talks.map((t) => ({ k: t.event || t.track, t: t.title, s: t.event ? t.track : "" })))}
  </section>
  <section class="ed-sec" aria-labelledby="h-where">
    ${opener("Where I've spoken", { h: "h2", id: "h-where" })}
    ${rows(s.appearances.map((a) => ({ t: a.title, s: a.body })))}
    ${s.photos.length ? `<div class="ed-reel">${s.photos.map((ph) => `<figure>${img(ph, { width: 1200, alt: "" })}</figure>`).join("")}</div>` : ""}
    ${s.press.length ? `<p class="ed-actions">${s.press.map(([u, l]) => `<a class="ed-btn ed-btn--line" href="${esc(u)}" target="_blank" rel="noopener">${esc(l)}</a>`).join("")}</p>` : ""}
  </section>`;
  return shell(m, ctx, { title: "Speaking", description: s.promise, image: s.image, body });
}

function writing(m, ctx) {
  const L = (p) => href(ctx, p);
  const body = `${opener("Writing", { count: m.writing.notes.length, line: m.writing.intro })}
  <section class="ed-sec ed-sec--flush" aria-label="Notes">${noteRows(L, m.writing.notes, { h: "h2" })}</section>
  <section class="ed-sec" id="books" aria-labelledby="h-books">
    ${opener("Books", { h: "h2", id: "h-books" })}
    ${m.books.map((b) => bookRow(b)).join("")}
  </section>`;
  return shell(m, ctx, { title: "Writing", description: m.writing.intro, body });
}

function article(m, ctx) {
  const L = (p) => href(ctx, p);
  const n = ctx.note;
  const list = m.writing.notes.filter((x) => x.internal);
  const i = list.findIndex((x) => x.slug === n.slug);
  const next = list.length > 1 ? list[(i + 1) % list.length] : null;
  const body = `<article class="ed-article">
    <header class="ed-article__head">
      <p class="ed-label"><a href="${L("/writing")}">[Writing]</a> ${(n.tags || []).map(br).join(" ")}</p>
      <h1 class="ed-article__t">${esc(n.title)}</h1>
      ${n.summary ? `<p class="ed-article__s">${esc(n.summary)}</p>` : ""}
      <p class="ed-article__by">${br("By Bolutife Awakan")}${n.date ? br(fmtDate(n.date)) : ""}${n.readTime ? br(`${n.readTime} min read`) : ""}</p>
    </header>
    ${media(n.thumbnail) ? `<figure class="ed-article__cover">${img(n.thumbnail, { width: 2400, eager: true, alt: "" })}</figure>` : ""}
    <div class="ed-read">
      ${n.quote ? `<p class="ed-read__quote">${esc(n.quote)}</p>` : ""}
      ${(n.sections || [])
        .map(
          (s) => `${s.heading ? `<h2>${esc(s.heading)}</h2>` : ""}${paras(s.body)}
          ${s.pullQuote ? `<blockquote class="ed-pull"><p>${esc(s.pullQuote)}</p></blockquote>` : ""}
          ${media(s.image) ? `<figure class="ed-read__img">${img(s.image, { width: 1600, alt: s.image.alt || "" })}</figure>` : ""}`
        )
        .join("")}
    </div>
  </article>
  ${next ? `<section class="ed-next" aria-labelledby="h-next"><a href="${L(next.path)}"><span class="ed-label">${br("Read next")}</span><h2 class="ed-next__t ed-next__t--note" id="h-next">${esc(next.title)}</h2><span class="ed-next__s">${esc(next.summary || "")}</span></a></section>` : ""}`;
  return shell(m, ctx, { title: n.title, description: n.summary || n.title, image: n.thumbnail, body });
}

const SHEET = ["steps-smile", "colonnade", "garden-sun", "lawn-stand", "arch-mono", "portrait-mono", "stairs-dark", "doorway-dark", "lawn-crouch", "chair-gold", "steps-seated", "arch-white", "textile-dark"];

function side(m, ctx) {
  const s = m.side;
  const body = `<section class="ed-side ed-side--page">
    <div class="ed-side__text">
      <h1 class="ed-side__h">${fit("On the side", { cls: "ed-fit--left" })}</h1>
      <p class="ed-sign ed-sign--side" aria-hidden="true">off duty</p>
      <p class="ed-side__line">${esc(s.intro)}</p>
      <p class="ed-hint" aria-hidden="true">${br("Move the photos around")}</p>
    </div>
    ${desk(["chair-gold", "garden-sun", "arch-mono", "lawn-crouch", "portrait-mono"], s.interests.map((x) => x.title))}
  </section>
  <section class="ed-sec" aria-labelledby="h-enjoy">
    ${opener("What I enjoy", { h: "h2", id: "h-enjoy" })}
    ${rows(s.interests.map((x, i) => ({ k: pad(i + 1), t: x.title, s: x.body, preview: photoSrc(["doorway-dark", "portrait-mono", "stairs-dark", "lawn-stand", "steps-smile"][i % 5]) })), { cls: "ed-rows--xl" })}
    ${s.offDutyLine ? `<p class="ed-big-line">${esc(s.offDutyLine)}</p>` : ""}
  </section>
  ${s.nowPlaying ? `<section class="ed-sec ed-np" aria-labelledby="h-np">
    <figure class="ed-np__cover">${img(s.nowPlaying.cover, { width: 600, alt: `${s.nowPlaying.album} cover` })}</figure>
    <div><h2 class="ed-label" id="h-np">${br("On repeat")}</h2><p class="ed-np__song">${esc(s.nowPlaying.song)}</p><p class="ed-np__by">${esc(s.nowPlaying.artist)} ${br(s.nowPlaying.album)}</p>${s.nowPlaying.url ? `<a class="ed-link" href="${esc(s.nowPlaying.url)}" target="_blank" rel="noopener">Listen</a>` : ""}</div>
  </section>` : ""}
  <section class="ed-sec" aria-labelledby="h-sheet">
    ${opener("Contact sheet", { h: "h2", id: "h-sheet", count: SHEET.length, line: m.photoCredit })}
    <ul class="ed-sheet">${SHEET.map((k, i) => `<li><figure>${photo(k, { sizes: "(max-width: 800px) 50vw, 25vw" })}<figcaption>${br(pad(i + 1))}</figcaption></figure></li>`).join("")}</ul>
  </section>`;
  return shell(m, ctx, { title: "On the side", description: s.intro, image: "photo:garden-sun", body });
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
  const body = `${opener("Let's talk", { line: "Tell me what you're working on and how I can help." })}
  <section class="ed-contact">
    <form class="ed-form" data-mailto="${esc(p.email)}">
      <fieldset class="ed-form__about">
        <legend>${br("What is it about?")}</legend>
        ${ABOUT.map(([k, l]) => `<label><input type="radio" name="about" value="${k}"${k === about ? " checked" : ""}><span>${esc(l)}</span></label>`).join("")}
      </fieldset>
      <label class="ed-field"><span>${br("Your name")}</span><input name="name" autocomplete="name" required></label>
      <label class="ed-field"><span>${br("Your email")}</span><input name="email" type="email" autocomplete="email" required></label>
      <label class="ed-field"><span>${br("Message")}</span><textarea name="message" rows="5" required></textarea></label>
      <button class="ed-btn" type="submit">Open an email draft</button>
      <p class="ed-note">The form opens an email to me with your message filled in.</p>
    </form>
    <aside class="ed-contact__aside">
      <figure>${photo("garden-sun", { sizes: "(max-width: 800px) 60vw, 26vw" })}</figure>
      <dl class="ed-meta ed-meta--stack">
        <div><dt>${br("Email")}</dt><dd><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></dd></div>
        <div><dt>${br("Based in")}</dt><dd>${p.locations.map(esc).join(" and ")}</dd></div>
        <div><dt>${br("Elsewhere")}</dt><dd>${p.socials.map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join(", ")}</dd></div>
        <div><dt>${br("Ventures")}</dt><dd>${m.ventures.map((v) => (v.url ? `<a href="${esc(v.url)}" target="_blank" rel="noopener" data-track="venture_click" data-track-target="${esc(v.slug)}">${esc(v.name)}</a>` : esc(v.name))).join(", ")} have their own teams.</dd></div>
      </dl>
    </aside>
  </section>`;
  return shell(m, ctx, { title: "Contact", body });
}

function index(m, ctx) {
  const L = (p) => href(ctx, p);
  const items = contentIndex(m);
  const groups = [...new Set(items.map((i) => i.type))];
  const body = `${opener("Everything", { count: items.length, line: "Every case study, venture, note, talk and page on the site." })}
  <section class="ed-sec ed-sec--flush"><div class="ed-index">${groups
    .map(
      (g) => `<div><h2 class="ed-label">${br(g)}</h2><ul>${items
        .filter((i) => i.type === g)
        .map((i) => {
          const h = i.path ? L(i.path) : i.href;
          return `<li><a href="${esc(h || "#")}"${i.path ? "" : extAttrs(h)}>${esc(i.title)}</a>${i.meta ? br(i.meta) : ""}</li>`;
        })
        .join("")}</ul></div>`
    )
    .join("")}</div></section>`;
  return shell(m, ctx, { title: "Everything", body });
}

function experiments(m, ctx) {
  const x = m.experiments;
  const shots = x.shots.map((s) => ({ ...s, m: media(s.media) })).filter((s) => s.m);
  const body = `${opener("Experiments", { count: shots.length, line: x.intro })}
  <section class="ed-sec ed-sec--flush">${shots.length ? `<div class="ed-shots">${shots.map((s) => `<figure class="ed-shot${s.wide ? " ed-shot--wide" : ""}">${img(s.m, { width: s.wide ? 1600 : 1000, alt: s.title || "" })}<figcaption>${br(s.category || "")} ${esc(s.title || "")}</figcaption></figure>`).join("")}</div>` : `<p class="ed-big-line">New experiments are on the way.</p>`}</section>`;
  return shell(m, ctx, { title: "Experiments", description: x.intro, body });
}

function notFound(m, ctx) {
  const L = (p) => href(ctx, p);
  const body = `${opener("Lost", { line: "This page has moved or never existed. Everything else is a click away." })}
  <section class="ed-sec ed-sec--flush">${rows(MENU.map((s) => ({ href: L(s.path), t: s.label })), { h: "h2", cls: "ed-rows--xl" })}</section>`;
  return shell(m, ctx, { title: "Not found", body });
}

const PAGES = { home, about, work, case: caseStudy, ventures, speaking, writing, article, side, contact, index, experiments, notFound };
export function render(key, m, ctx) {
  return (PAGES[key] || notFound)(m, ctx);
}
