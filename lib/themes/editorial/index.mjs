// Direction B — The Personal Editorial.
// The site reads like a magazine profile of Bolutife: her name as the
// masthead, her 2025 portraits carrying the pages, a hand-drawn Didone
// monogram, Lagos and London side by side. Wine (from the patchwork in the
// portraits) on plaster white, Bodoni Moda + Schibsted Grotesk.

import { esc, img, media } from "../../media.mjs";
import { photo } from "../../photos.mjs";
import { headTags, href, paras, extAttrs, year, fmtDate } from "../../shell.mjs";
import { contentIndex, SECTIONS } from "../../model.mjs";
import { markEditorial } from "../marks.mjs";

const NAV = SECTIONS.filter((s) => s.key !== "contact");
const navKey = { about: "about", work: "work", case: "work", ventures: "ventures", speaking: "speaking", writing: "writing", article: "writing", side: "side", contact: "contact" };

const timeIn = (tz) => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz });
const clocks = () =>
  `<p class="ed-clocks" aria-label="Local time in Lagos and London"><span>Lagos <time data-tz="Africa/Lagos">${timeIn("Africa/Lagos")}</time></span><span>London <time data-tz="Europe/London">${timeIn("Europe/London")}</time></span></p>`;

/* ---------- shell ---------- */

function shell(m, ctx, { title, description, image, body, tone = "bone" }) {
  const L = (p) => href(ctx, p);
  const active = navKey[ctx.pageKey];
  const links = NAV.map((s) => `<a href="${L(s.path)}"${active === s.key ? ' aria-current="page"' : ""}>${s.label}</a>`).join("");
  return `<!doctype html>
<html lang="en" class="ed">
<head>
${headTags(ctx, { title, description, image, path: ctx.path })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..800;1,6..96,400..800&family=Schibsted+Grotesk:wght@400..700&display=swap">
<link rel="stylesheet" href="/assets/editorial.css?v=1">
<script src="/assets/editorial.js?v=1" defer></script>
</head>
<body class="ed-page ed-page--${ctx.pageKey} ed-tone--${tone}">
<a class="ed-skip" href="#main">Skip to content</a>
<header class="ed-head">
  <a class="ed-head__brand" href="${L("/")}" aria-label="Bolutife Awakan, home">${markEditorial({ size: 46, title: "" })}<span>Bolutife Awakan</span></a>
  <nav class="ed-head__nav" aria-label="Main">${links}</nav>
  <div class="ed-head__end">
    ${clocks()}
    <a class="ed-head__cta" href="${L("/contact")}"${active === "contact" ? ' aria-current="page"' : ""}>Work with me</a>
    <button class="ed-head__menu" type="button" aria-expanded="false" aria-controls="ed-menu">Menu</button>
  </div>
</header>
<div class="ed-menu" id="ed-menu" hidden>
  <nav aria-label="Menu">${[...NAV, { key: "contact", path: "/contact", label: "Contact" }].map((s) => `<a href="${L(s.path)}"${active === s.key ? ' aria-current="page"' : ""}>${s.label}</a>`).join("")}</nav>
  ${clocks()}
  <button class="ed-menu__close" type="button">Close</button>
</div>
<main id="main">
${body}
</main>
<footer class="ed-foot">
  <div class="ed-foot__top">
    <p class="ed-foot__line">${esc(m.footerLine || "")}</p>
    <p class="ed-foot__mail"><a href="mailto:${esc(m.person.email)}">${esc(m.person.email)}</a></p>
  </div>
  <div class="ed-foot__grid">
    <a class="ed-foot__mark" href="${L("/")}" aria-label="Home">${markEditorial({ size: 96, title: "" })}</a>
    <nav class="ed-foot__nav" aria-label="Footer">${[...NAV, { path: "/contact", label: "Contact" }, { path: "/index", label: "Everything" }].map((s) => `<a href="${L(s.path)}">${s.label}</a>`).join("")}</nav>
    <ul class="ed-foot__social">${m.person.socials.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join("")}</ul>
    <div class="ed-foot__meta">${clocks()}<p>${esc(m.photoCredit)}. Bolutife Awakan, ${year()}.</p></div>
  </div>
</footer>
</body>
</html>`;
}

/* ---------- parts ---------- */

const pageTitle = (t, standfirst, extra = "") =>
  `<header class="ed-title"><h1 class="ed-title__h">${esc(t)}</h1>${standfirst ? `<p class="ed-title__sf">${esc(standfirst)}</p>` : ""}${extra}</header>`;

const kicker = (t) => `<p class="ed-kicker">${esc(t)}</p>`;

function features(L, projects, { layout = "alt" } = {}) {
  return `<div class="ed-features ed-features--${layout}">${projects
    .map(
      (p) => `<article class="ed-feature">
      <a class="ed-feature__img" href="${L(p.path)}" tabindex="-1" aria-hidden="true">${img(p.thumbnail || p.cover, { width: 1600, alt: "" })}</a>
      <div class="ed-feature__text">
        <p class="ed-feature__meta">${esc([p.services, p.year].filter(Boolean).join(", "))}</p>
        <h3 class="ed-feature__t"><a href="${L(p.path)}">${esc(p.title)}</a></h3>
        <p class="ed-feature__s">${esc(p.summary)}</p>
        <a class="ed-more" href="${L(p.path)}">Read the case study</a>
      </div>
    </article>`
    )
    .join("")}</div>`;
}

function ventureEntries(L, ventures, { full = false } = {}) {
  return ventures
    .map(
      (v) => `<article class="ed-venture" id="${esc(v.slug)}" aria-labelledby="ev-${esc(v.slug)}">
      <div class="ed-venture__head">
        <p class="ed-venture__kind">${esc(v.kind)}, founded by me</p>
        <h3 class="ed-venture__name" id="ev-${esc(v.slug)}">${esc(v.name)}</h3>
      </div>
      <div class="ed-venture__body">
        <p class="ed-venture__line">${esc(v.line)}</p>
        ${full ? `<p>${esc(v.body)}</p>` : ""}
        ${full && v.offers.length ? `<ul class="ed-venture__offers">${v.offers.map((o) => `<li><h4>${esc(o.title)}</h4><p>${esc(o.body)}</p></li>`).join("")}</ul>` : ""}
        ${v.url ? `<a class="ed-more" href="${esc(v.url)}" target="_blank" rel="noopener" data-track="venture_click" data-track-target="${esc(v.slug)}">${esc(v.cta)}</a>` : ""}
      </div>
    </article>`
    )
    .join("");
}

function noteList(L, notes, { limit } = {}) {
  const list = limit ? notes.slice(0, limit) : notes;
  return `<ul class="ed-notes">${list
    .map((n) => {
      const h = n.path ? L(n.path) : n.href || "#";
      return `<li><a href="${esc(h)}"${n.path ? "" : extAttrs(h)}>
        <span class="ed-notes__t">${esc(n.title)}</span>
        <span class="ed-notes__s">${esc(n.summary || "")}</span>
        <span class="ed-notes__d">${esc(n.date ? fmtDate(n.date) : "")}${n.readTime ? `<br>${n.readTime} min read` : ""}</span>
      </a></li>`;
    })
    .join("")}</ul>`;
}

const bookFeature = (b) => `<aside class="ed-book">
  <p class="ed-kicker">The book</p>
  <p class="ed-book__t">${esc(b.title)}</p>
  <p>${esc(b.line)}</p>
  ${b.url ? `<a class="ed-more" href="${esc(b.url)}" target="_blank" rel="noopener" data-track="venture_click" data-track-target="book">${esc(b.cta)}</a>` : ""}
</aside>`;

function logos(m) {
  const list = (m.work.clientLogos || []).map(media).filter(Boolean);
  if (!list.length) return "";
  return `<div class="ed-logos"><p class="ed-kicker">Among the clients</p><ul>${list.map((l) => `<li>${img(l, { width: 400, alt: l.alt })}</li>`).join("")}</ul></div>`;
}

/* ---------- pages ---------- */

function home(m, ctx) {
  const L = (p) => href(ctx, p);
  const p = m.person;
  const body = `
<section class="ed-hero" aria-labelledby="ed-hero-h">
  <h1 class="ed-hero__name" id="ed-hero-h"><span class="ed-hero__l1"><span>${esc(p.first)}</span></span><span class="ed-hero__l2"><span>${esc(p.last)}</span></span></h1>
  <figure class="ed-hero__photo">${photo("textile-dark", { sizes: "(max-width: 800px) 70vw, 26vw", eager: true })}</figure>
  <div class="ed-hero__deck">
    <p class="ed-hero__sf">${esc(p.headline)}</p>
    <p class="ed-hero__sup">${esc(p.supporting)}</p>
  </div>
  <p class="ed-hero__id">${esc(p.identity.join(", "))}.<br>Between ${esc(p.locations.map((l) => l.split(",")[0]).join(" and "))}.</p>
</section>

<section class="ed-sec" aria-labelledby="h-work">
  <div class="ed-sec__head"><h2 class="ed-sec__h" id="h-work">Selected work</h2><a class="ed-more" href="${L("/work")}">All work</a></div>
  ${features(L, m.work.featured)}
</section>

<section class="ed-sec ed-sec--practice" aria-labelledby="h-practice">
  <div class="ed-sec__head"><h2 class="ed-sec__h" id="h-practice">How I work</h2><a class="ed-more" href="${L("/about")}">About me</a></div>
  <blockquote class="ed-belief"><p>${esc(m.practice.belief)}</p></blockquote>
  <ul class="ed-areas">${m.practice.areas.map((a) => `<li><h3>${esc(a.title)}</h3><p>${esc(a.body)}</p></li>`).join("")}</ul>
  <p class="ed-aside">${esc(m.practice.operator)}</p>
  ${logos(m)}
</section>

<section class="ed-sec ed-sec--wine" aria-labelledby="h-ventures">
  <div class="ed-sec__head"><h2 class="ed-sec__h" id="h-ventures">What I'm building</h2><a class="ed-more" href="${L("/ventures")}">More on both</a></div>
  ${ventureEntries(L, m.ventures)}
</section>

<section class="ed-sec ed-sec--speak" aria-labelledby="h-speak">
  <div class="ed-speak">
    <figure class="ed-speak__photo">${m.speaking.image ? img(m.speaking.image, { width: 1400, alt: "Bolutife speaking on stage" }) : photo("colonnade", { sizes: "50vw" })}</figure>
    <div class="ed-speak__text">
      <h2 class="ed-sec__h" id="h-speak">On stage</h2>
      <p class="ed-lede">${esc(m.speaking.promise)}</p>
      <ul class="ed-topics">${m.speaking.tracks.map((t) => `<li>${esc(t.title)}</li>`).join("")}</ul>
      <p class="ed-actions"><a class="ed-btn" href="${L("/contact?about=speaking")}">Book me to speak</a><a class="ed-more" href="${L("/speaking")}">Topics and past talks</a></p>
    </div>
  </div>
</section>

<section class="ed-sec" aria-labelledby="h-writing">
  <div class="ed-sec__head"><h2 class="ed-sec__h" id="h-writing">Writing and books</h2><a class="ed-more" href="${L("/writing")}">All writing</a></div>
  <div class="ed-writing">${noteList(L, m.writing.notes, { limit: 3 })}${m.books.map(bookFeature).join("")}</div>
</section>

<section class="ed-sec ed-sec--side" aria-labelledby="h-side">
  <div class="ed-side">
    <figure class="ed-side__a">${photo("chair-gold", { sizes: "(max-width: 800px) 60vw, 28vw" })}</figure>
    <figure class="ed-side__b">${photo("arch-mono", { sizes: "(max-width: 800px) 40vw, 18vw" })}</figure>
    <div class="ed-side__text">
      <h2 class="ed-sec__h" id="h-side">On the side</h2>
      <p class="ed-lede">${esc(m.side.intro)}</p>
      <a class="ed-more" href="${L("/on-the-side")}">More about life outside work</a>
    </div>
  </div>
</section>

${contactBand(L, m)}`;
  return shell(m, ctx, { body, image: "photo:textile-dark", tone: "wine-top" });
}

const contactBand = (L, m) => `<section class="ed-band" aria-labelledby="h-contact">
  <h2 class="ed-band__h" id="h-contact">Let's work together</h2>
  <p class="ed-band__sub">Brand projects, design leadership, speaking, Design Lever or Lilac Africa.</p>
  <p class="ed-band__mail"><a href="mailto:${esc(m.person.email)}">${esc(m.person.email)}</a></p>
  <p class="ed-actions"><a class="ed-btn ed-btn--light" href="${L("/contact")}">Send a message</a><a class="ed-btn ed-btn--line" href="${L("/contact?about=speaking")}">Book a talk</a></p>
</section>`;

function about(m, ctx) {
  const L = (p) => href(ctx, p);
  const a = m.about;
  const body = `<section class="ed-about-hero">
    <div class="ed-about-hero__text">
      ${kicker("About")}
      <h1 class="ed-display">${esc(m.person.name)}</h1>
      <p class="ed-title__sf">${esc(m.person.identity.join(", "))}.</p>
    </div>
    <figure class="ed-about-hero__photo">${photo("steps-seated", { sizes: "(max-width: 800px) 100vw, 45vw", eager: true })}</figure>
  </section>
  <section class="ed-longread">
    ${a.paragraphs.map((t, i) => `<p${i === 0 ? ' class="ed-dropcap"' : ""}>${esc(t)}</p>`).join("")}
    <p>${esc(m.person.supporting)}</p>
  </section>

  <section class="ed-sec" aria-labelledby="h-path">
    <div class="ed-sec__head"><h2 class="ed-sec__h" id="h-path">The path so far</h2></div>
    <div class="ed-path">
      <ol class="ed-path__list">${a.path.map((s) => `<li><h3>${esc(s.when)}</h3><p>${esc(s.text)}</p></li>`).join("")}</ol>
      <figure class="ed-path__photo">${photo("arch-white", { sizes: "(max-width: 800px) 80vw, 30vw" })}</figure>
    </div>
  </section>

  <section class="ed-sec ed-sec--practice" aria-labelledby="h-practice">
    <div class="ed-sec__head"><h2 class="ed-sec__h" id="h-practice">How I work</h2></div>
    <blockquote class="ed-belief"><p>${esc(m.practice.belief)}</p></blockquote>
    <ul class="ed-areas">${m.practice.areas.map((x) => `<li><h3>${esc(x.title)}</h3><p>${esc(x.body)}</p></li>`).join("")}</ul>
    <p class="ed-aside">${esc(m.practice.operator)}</p>
    <h3 class="ed-h3">Services</h3>
    <ul class="ed-areas">${m.practice.services.map((s) => `<li><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p>${(s.tags || []).length ? `<p class="ed-tags">${s.tags.map(esc).join(", ")}</p>` : ""}</li>`).join("")}</ul>
  </section>

  <section class="ed-sec" aria-labelledby="h-exp">
    <div class="ed-sec__head"><h2 class="ed-sec__h" id="h-exp">Experience and education</h2></div>
    <div class="ed-cv">
      <div><h3 class="ed-h3">Experience</h3><ul class="ed-cv__list">${a.experience.map((x) => `<li><span class="ed-cv__y">${esc(String(x.period || "").replace(/[()]/g, ""))}</span><span class="ed-cv__r">${esc(x.role)}</span><span class="ed-cv__o">${esc(x.org)}</span></li>`).join("")}</ul></div>
      <div><h3 class="ed-h3">Education</h3><ul class="ed-cv__list">${a.education.map((x) => `<li><span class="ed-cv__y">${esc(x.year)}</span><span class="ed-cv__r">${esc(x.title)}</span><span class="ed-cv__o">${esc(x.org)}</span></li>`).join("")}</ul>
      <p class="ed-aside">${esc(m.mentoring)}</p></div>
    </div>
  </section>

  <section class="ed-sec" aria-labelledby="h-rec">
    <div class="ed-sec__head"><h2 class="ed-sec__h" id="h-rec">Recognition</h2></div>
    <ul class="ed-cv__list ed-cv__list--wide">${a.awards.map((x) => `<li><span class="ed-cv__y">${esc(x.year)}</span><span class="ed-cv__r">${esc(x.title)}</span><span class="ed-cv__o">${esc(x.org)}</span></li>`).join("")}</ul>
    <ul class="ed-cv__list ed-cv__list--wide">${a.career.map((x) => `<li><span class="ed-cv__y">${esc(x.year)}</span><span class="ed-cv__r ed-cv__r--span">${esc(x.text)}</span></li>`).join("")}</ul>
  </section>

  <section class="ed-sec ed-sec--wine" aria-labelledby="h-say">
    <div class="ed-sec__head"><h2 class="ed-sec__h" id="h-say">What clients say</h2></div>
    <div class="ed-quotes">${a.testimonials.map((t) => `<figure class="ed-quote"><blockquote><p>${esc(t.quote)}</p></blockquote><figcaption>${esc(t.name)}<span>${esc(t.role)}</span></figcaption></figure>`).join("")}</div>
  </section>
  ${contactBand(L, m)}`;
  return shell(m, ctx, { title: "About", description: m.person.supporting, image: "photo:steps-seated", body });
}

function work(m, ctx) {
  const L = (p) => href(ctx, p);
  const body = `${pageTitle("Work", "Brand identities, systems and creative direction for companies, events and founders since 2013.")}
  <section class="ed-sec ed-sec--flush">${features(L, m.work.all, { layout: "grid" })}</section>
  ${contactBand(L, m)}`;
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
      <p class="ed-kicker"><a href="${L("/work")}">Work</a></p>
      <h1 class="ed-case__t">${esc(p.title)}</h1>
      <p class="ed-title__sf">${esc(p.summary)}</p>
      <dl class="ed-meta">${meta.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
    </header>
    ${p.cover ? `<figure class="ed-case__cover">${img(p.cover, { width: 2400, eager: true, alt: p.title })}</figure>` : ""}
    <div class="ed-longread ed-longread--intro">${paras(p.intro)}</div>
    ${(p.sections || [])
      .map(
        (s) => `<section class="ed-case__sec">
        ${s.heading || s.body ? `<div class="ed-case__text">${s.heading ? `<h2>${esc(s.heading)}</h2>` : "<span></span>"}<div>${paras(s.body)}</div></div>` : ""}
        ${gallery(s.images)}
      </section>`
      )
      .join("")}
  </article>
  <section class="ed-next" aria-label="Next case study">
    <p class="ed-kicker">Next</p>
    <a class="ed-next__a" href="${L(next.path)}">${esc(next.title)}</a>
    <p class="ed-next__s">${esc(next.summary)}</p>
  </section>
  ${contactBand(L, m)}`;
  return shell(m, ctx, { title: p.title, description: p.summary, image: p.thumbnail || p.cover, body });
}

function ventures(m, ctx) {
  const L = (p) => href(ctx, p);
  const body = `${pageTitle("Ventures", "Alongside my design leadership work, I founded two organisations. Each has its own name and identity; here is what they do and my part in them.")}
  <section class="ed-sec ed-sec--flush">${ventureEntries(L, m.ventures, { full: true })}</section>
  <section class="ed-sec" id="mentoring" aria-labelledby="h-mentor">
    <div class="ed-sec__head"><h2 class="ed-sec__h" id="h-mentor">Mentoring</h2></div>
    <p class="ed-lede">${esc(m.mentoring)}</p>
    <p class="ed-actions"><a class="ed-btn" href="${L("/contact?about=mentoring")}">Ask about mentoring</a></p>
  </section>
  ${contactBand(L, m)}`;
  return shell(m, ctx, { title: "Ventures", description: m.ventures.map((v) => `${v.name}: ${v.line}`).join(" "), body });
}

function speaking(m, ctx) {
  const L = (p) => href(ctx, p);
  const s = m.speaking;
  const body = `<section class="ed-stage">
    ${s.image ? `<figure class="ed-stage__img">${img(s.image, { width: 2400, eager: true, alt: "Bolutife speaking on stage" })}</figure>` : ""}
    <div class="ed-stage__text"><h1 class="ed-display ed-display--light">Speaking</h1><p class="ed-title__sf">${esc(s.promise)}</p></div>
  </section>
  <section class="ed-longread"><p class="ed-dropcap">${esc(s.intro)}</p><p class="ed-aside">I give ${s.formats.map((f) => f.toLowerCase()).join(", ").replace(/, ([^,]*)$/, " and $1")}.</p></section>
  <section class="ed-sec" aria-labelledby="h-topics">
    <div class="ed-sec__head"><h2 class="ed-sec__h" id="h-topics">What I speak about</h2></div>
    <ul class="ed-areas ed-areas--2">${s.tracks.map((t) => `<li><h3>${esc(t.title)}</h3><p>${esc(t.body)}</p></li>`).join("")}</ul>
  </section>
  <section class="ed-sec" id="talks" aria-labelledby="h-talks">
    <div class="ed-sec__head"><h2 class="ed-sec__h" id="h-talks">Talks</h2></div>
    <ul class="ed-talks">${s.talks.map((t) => `<li><p class="ed-talks__t">${esc(t.title)}</p><p class="ed-talks__m">${esc([t.track, t.event].filter(Boolean).join(". "))}</p></li>`).join("")}</ul>
  </section>
  <section class="ed-sec" aria-labelledby="h-where">
    <div class="ed-sec__head"><h2 class="ed-sec__h" id="h-where">Where I've spoken</h2></div>
    <ul class="ed-talks">${s.appearances.map((a) => `<li><p class="ed-talks__t">${esc(a.title)}</p><p class="ed-talks__m">${esc(a.body)}</p></li>`).join("")}</ul>
    ${s.photos.length ? `<div class="ed-reel">${s.photos.map((ph) => `<figure>${img(ph, { width: 1200, alt: "" })}</figure>`).join("")}</div>` : ""}
  </section>
  <section class="ed-band" aria-labelledby="h-book">
    <h2 class="ed-band__h" id="h-book">Book me to speak</h2>
    <p class="ed-band__sub">Tell me about your event, your audience and the date.</p>
    <p class="ed-actions"><a class="ed-btn ed-btn--light" href="${L("/contact?about=speaking")}">Send the details</a>${s.press.map(([u, l]) => `<a class="ed-btn ed-btn--line" href="${esc(u)}" target="_blank" rel="noopener">${esc(l)}</a>`).join("")}</p>
  </section>`;
  return shell(m, ctx, { title: "Speaking", description: s.promise, image: s.image, body });
}

function writing(m, ctx) {
  const L = (p) => href(ctx, p);
  const body = `${pageTitle("Writing", m.writing.intro)}
  <section class="ed-sec ed-sec--flush" aria-label="Notes">${noteList(L, m.writing.notes)}</section>
  <section class="ed-sec" id="books" aria-labelledby="h-books"><div class="ed-sec__head"><h2 class="ed-sec__h" id="h-books">Books</h2></div>${m.books.map(bookFeature).join("")}</section>
  ${contactBand(L, m)}`;
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
      <p class="ed-kicker"><a href="${L("/writing")}">Writing</a>${(n.tags || []).length ? `, ${n.tags.map(esc).join(", ")}` : ""}</p>
      <h1 class="ed-article__t">${esc(n.title)}</h1>
      ${n.summary ? `<p class="ed-title__sf">${esc(n.summary)}</p>` : ""}
      <p class="ed-byline">By Bolutife Awakan${n.date ? `, ${esc(fmtDate(n.date))}` : ""}${n.readTime ? `. ${n.readTime} minute read` : ""}</p>
    </header>
    ${media(n.thumbnail) ? `<figure class="ed-article__cover">${img(n.thumbnail, { width: 2400, eager: true, alt: "" })}</figure>` : ""}
    <div class="ed-longread">
      ${n.quote ? `<p class="ed-article__quote">${esc(n.quote)}</p>` : ""}
      ${(n.sections || [])
        .map(
          (s, j) => `${s.heading ? `<h2>${esc(s.heading)}</h2>` : ""}${j === 0 ? paras(s.body).replace("<p>", '<p class="ed-dropcap">') : paras(s.body)}
          ${s.pullQuote ? `<blockquote class="ed-pull"><p>${esc(s.pullQuote)}</p></blockquote>` : ""}
          ${media(s.image) ? `<figure class="ed-article__img">${img(s.image, { width: 1600, alt: s.image.alt || "" })}</figure>` : ""}`
        )
        .join("")}
    </div>
  </article>
  ${next ? `<section class="ed-next" aria-label="Next article"><p class="ed-kicker">Read next</p><a class="ed-next__a" href="${L(next.path)}">${esc(next.title)}</a><p class="ed-next__s">${esc(next.summary || "")}</p></section>` : ""}`;
  return shell(m, ctx, { title: n.title, description: n.summary || n.title, image: n.thumbnail, body });
}

const SHEET = ["steps-smile", "colonnade", "garden-sun", "lawn-stand", "arch-mono", "portrait-mono", "stairs-dark", "doorway-dark", "lawn-crouch", "chair-gold", "steps-seated", "arch-white"];

function side(m, ctx) {
  const L = (p) => href(ctx, p);
  const s = m.side;
  const body = `<section class="ed-after">
    <figure class="ed-after__img">${photo("garden-sun", { sizes: "(max-width: 800px) 100vw, 50vw", eager: true })}</figure>
    <div class="ed-after__text">
      ${kicker("On the side")}
      <h1 class="ed-display">Away from work</h1>
      <p class="ed-lede">${esc(s.intro)}</p>
    </div>
  </section>
  <section class="ed-sec" aria-labelledby="h-enjoy">
    <div class="ed-sec__head"><h2 class="ed-sec__h" id="h-enjoy">What I enjoy</h2></div>
    <ul class="ed-enjoy">${s.interests.map((x) => `<li><h3>${esc(x.title)}</h3><p>${esc(x.body)}</p></li>`).join("")}</ul>
    ${s.offDutyLine ? `<p class="ed-aside">${esc(s.offDutyLine)}</p>` : ""}
  </section>
  ${s.nowPlaying ? `<section class="ed-sec ed-sec--wine" aria-labelledby="h-np">
    <div class="ed-np">${img(s.nowPlaying.cover, { width: 400, alt: "" })}<div><h2 class="ed-kicker" id="h-np">Listening to</h2><p class="ed-np__song">${esc(s.nowPlaying.song)}</p><p>${esc(s.nowPlaying.artist)}, from ${esc(s.nowPlaying.album)}</p>${s.nowPlaying.url ? `<a class="ed-more" href="${esc(s.nowPlaying.url)}" target="_blank" rel="noopener">Listen</a>` : ""}</div></div>
  </section>` : ""}
  <section class="ed-sec" aria-labelledby="h-sheet">
    <div class="ed-sec__head"><h2 class="ed-sec__h" id="h-sheet">Contact sheet</h2><p class="ed-aside">${esc(m.photoCredit)}, 2025.</p></div>
    <ul class="ed-sheet">${SHEET.map((k) => `<li><figure>${photo(k, { sizes: "(max-width: 800px) 50vw, 25vw" })}</figure></li>`).join("")}</ul>
  </section>
  ${contactBand(L, m)}`;
  return shell(m, ctx, { title: "On the side", description: s.intro, image: "photo:garden-sun", body });
}

const ABOUT = [
  ["project", "A brand or creative project"],
  ["leadership", "Design leadership or Design Lever"],
  ["speaking", "Speaking at an event"],
  ["mentoring", "Mentoring or Lilac Africa"],
  ["other", "Something else"],
];

function contact(m, ctx) {
  const p = m.person;
  const about = ABOUT.some(([k]) => k === ctx.query.about) ? ctx.query.about : "project";
  const body = `<section class="ed-contact">
    <div class="ed-contact__intro">
      <h1 class="ed-display">Let's talk</h1>
      <p class="ed-lede">Tell me what you're working on and how I can help.</p>
      <dl class="ed-meta ed-meta--stack">
        <div><dt>Email</dt><dd><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></dd></div>
        <div><dt>Based in</dt><dd>${p.locations.map(esc).join(" and ")}</dd></div>
        <div><dt>Elsewhere</dt><dd>${p.socials.map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join(", ")}</dd></div>
      </dl>
      ${clocks()}
    </div>
    <form class="ed-form" data-mailto="${esc(p.email)}">
      <fieldset class="ed-form__about">
        <legend>What is it about?</legend>
        ${ABOUT.map(([k, l]) => `<label><input type="radio" name="about" value="${k}"${k === about ? " checked" : ""}><span>${esc(l)}</span></label>`).join("")}
      </fieldset>
      <label class="ed-field"><span>Your name</span><input name="name" autocomplete="name" required></label>
      <label class="ed-field"><span>Your email</span><input name="email" type="email" autocomplete="email" required></label>
      <label class="ed-field"><span>Message</span><textarea name="message" rows="6" required></textarea></label>
      <button class="ed-btn" type="submit">Write the email</button>
      <p class="ed-aside">The form opens an email to me with your message filled in.</p>
    </form>
  </section>`;
  return shell(m, ctx, { title: "Contact", body });
}

function index(m, ctx) {
  const L = (p) => href(ctx, p);
  const items = contentIndex(m);
  const groups = [...new Set(items.map((i) => i.type))];
  const body = `${pageTitle("Everything", "Every case study, venture, note, talk and page on the site.")}
  <section class="ed-sec ed-sec--flush"><div class="ed-index">${groups
    .map(
      (g) => `<div><h2 class="ed-h3">${esc(g)}</h2><ul>${items
        .filter((i) => i.type === g)
        .map((i) => {
          const h = i.path ? L(i.path) : i.href;
          return `<li><a href="${esc(h || "#")}"${i.path ? "" : extAttrs(h)}>${esc(i.title)}</a>${i.meta ? `<span>${esc(i.meta)}</span>` : ""}</li>`;
        })
        .join("")}</ul></div>`
    )
    .join("")}</div></section>`;
  return shell(m, ctx, { title: "Everything", body });
}

function experiments(m, ctx) {
  const x = m.experiments;
  const shots = x.shots.map((s) => ({ ...s, m: media(s.media) })).filter((s) => s.m);
  const body = `${pageTitle("Experiments", x.intro)}
  <section class="ed-sec ed-sec--flush">${shots.length ? `<div class="ed-shots">${shots.map((s) => `<figure class="ed-shot${s.wide ? " ed-shot--wide" : ""}">${img(s.m, { width: s.wide ? 1600 : 1000, alt: s.title || "" })}<figcaption><span>${esc(s.title || "")}</span>${esc(s.caption || "")}</figcaption></figure>`).join("")}</div>` : `<p class="ed-lede">New experiments are on the way.</p>`}</section>`;
  return shell(m, ctx, { title: "Experiments", description: x.intro, body });
}

function notFound(m, ctx) {
  const L = (p) => href(ctx, p);
  const body = `${pageTitle("Not here", "This page has moved or never existed. Everything else is a click away.")}
  <section class="ed-sec ed-sec--flush"><ul class="ed-lost">${[...NAV, { path: "/contact", label: "Contact" }].map((s) => `<li><a href="${L(s.path)}">${s.label}</a></li>`).join("")}</ul></section>`;
  return shell(m, ctx, { title: "Not found", body });
}

const PAGES = { home, about, work, case: caseStudy, ventures, speaking, writing, article, side, contact, index, experiments, notFound };
export function render(key, m, ctx) {
  return (PAGES[key] || notFound)(m, ctx);
}
