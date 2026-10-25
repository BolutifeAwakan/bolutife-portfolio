import { esc, img, media, src } from "./media.mjs";

/* ---------- small helpers ---------- */

const paras = (text = "") =>
  String(text || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`)
    .join("");

const lines = (text = "") =>
  String(text || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

const arrow = `<svg class="arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"/></svg>`;
const sun = `<svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="currentColor"/><g stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></g></svg>`;
const moon = `<svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" fill="currentColor"/></svg>`;

const title = (text, tag = "h2", id = "") =>
  `<${tag} class="title"${id ? ` id="${id}"` : ""}><span class="title__mask"><span class="title__inner">${esc(text)}</span></span></${tag}>`;

const boxBtn = (href, label, ext = false) =>
  `<a class="boxbtn" href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ""}><span class="boxbtn__in"><span>${esc(label)}</span><span aria-hidden="true">${esc(label)}</span></span></a>`;

const arrowLink = (href, label, ext = false) =>
  `<a class="alink" href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ""}>${arrow}<span>${esc(label)}</span></a>`;

const isExt = (u = "") => /^https?:/.test(u) || u.startsWith("mailto:");

const BASE_NAV = [
  ["/about", "About"],
  ["/work", "Work"],
  ["/speaking", "Speaking"],
  ["/notes", "Notes"],
];

/* ---------- layout ---------- */

function header(c, path) {
  const s = c.settings;
  const NAV = (c.shots || []).length ? [...BASE_NAV.slice(0, 2), ["/playground", "Playground"], ...BASE_NAV.slice(2)] : BASE_NAV;
  const cur = (href) => (path === href || path.startsWith(href + "/") ? ' aria-current="page"' : "");
  return `<header class="nav">
    <a class="nav__brand" href="/">${esc(s.name)}<span class="nav__reg"> ®</span></a>
    <nav class="nav__links" aria-label="Main">${NAV.map(([h, l]) => `<a href="${h}"${cur(h)}>${l}</a>`).join("")}</nav>
    <div class="nav__right">
      <button class="theme" type="button" aria-label="Switch to dark theme">${sun}${moon}</button>
      <a class="nav__contact" href="/contact"${cur("/contact")}>Contact</a>
      <button class="nav__menu" type="button" aria-expanded="false" aria-controls="menu">Menu</button>
    </div>
  </header>
  <div class="menu" id="menu" aria-hidden="true" inert>
    <nav aria-label="Mobile">${[...NAV, ["/contact", "Contact"]].map(([h, l]) => `<a href="${h}"${cur(h)}>${l}</a>`).join("")}</nav>
    <p class="menu__legal"><span>${esc(s.name)} © ${new Date().getFullYear()}</span><span>All rights reserved</span></p>
  </div>`;
}

function footer(c) {
  const s = c.settings;
  const links = [["mailto:" + s.email, "Email"], ...(s.socials || []).map((x) => [x.url, x.label])];
  return `<footer class="footer">
    <div class="footer__main">
      <p class="footer__line">${esc(s.footerLine)}</p>
      <a class="footer__hello" href="mailto:${esc(s.email)}">Say Hello</a>
      <div class="footer__links">${links.map(([h, l]) => arrowLink(h, l, true)).join("")}</div>
    </div>
    <div class="footer__bar">
      <span>${esc(s.name)} © ${new Date().getFullYear()}</span>
      <span>All rights reserved</span>
    </div>
  </footer>`;
}

export function layout(c, { path, title: t, description, image, body, before = "", head = "" }) {
  const s = c.settings;
  const fullTitle = t ? `${s.name} - ${t}` : `${s.name} - Designer`;
  const page = path === "/" ? "home" : path === "/work" ? "work" : path.startsWith("/work/") ? "case" : path.startsWith("/notes/") ? "note" : (path.slice(1) || "other").split("/")[0];
  const desc = description || "I help founders, teams, and creators bring ideas to life through brand, product, and experience design.";
  const ogM = media(image || s.portrait);
  const og = ogM ? src(ogM, 1200) : "";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
${og && !og.startsWith("data:") ? `<meta property="og:image" content="${esc(og)}"><meta name="twitter:card" content="summary_large_image">` : ""}
<link rel="icon" href="/assets/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="/assets/favicon.png">
<script>document.documentElement.classList.add("js");try{var t=localStorage.getItem("theme");if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif&display=swap">
<link rel="preconnect" href="https://api.fontshare.com" crossorigin>
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap">
${head}
<link rel="stylesheet" href="/assets/site.css?v=18">
<script src="/assets/site.js?v=17" defer></script>
</head>
<body class="page-${page}">
${before}
<a class="skip" href="#main">Skip to content</a>
${header(c, path)}
<main id="main">
${body}
</main>
${footer(c)}
</body>
</html>`;
}

/* ---------- blocks ---------- */

function workRows(projects) {
  return `<div class="rows">${projects
    .map(
      (p) => `<article class="wrow reveal">
      <div class="wrow__text">
        <h3 class="h6"><a href="/work/${esc(p.slug)}">${esc(p.title)}</a></h3>
        <p class="muted">${esc(p.summary)}</p>
        ${arrowLink(`/work/${p.slug}`, "View Case Study")}
      </div>
      <a class="wrow__img" href="/work/${esc(p.slug)}" tabindex="-1" aria-hidden="true">${img(p.thumbnail || p.cover, { width: 1400, alt: "" })}</a>
    </article>`
    )
    .join("")}</div>`;
}

function clients(c) {
  const logos = (c.settings.clientLogos || []).map(media).filter(Boolean);
  if (!logos.length) return "";
  const set = logos.map((l) => `<img src="${esc(src(l, 512))}" alt="${esc(l.alt)}" loading="lazy">`).join("");
  return `<section class="clients reveal" aria-label="Clients">
    <h2 class="h6">Clients</h2>
    <div class="marquee marquee--logos is-quarter"><div class="marquee__track">${set}${set}${set}${set}</div></div>
  </section>`;
}

function services(c) {
  return `<div class="rows">${(c.services || [])
    .map(
      (s, i) => `<div class="srow reveal">
      <p class="h6 muted">${String(i + 1).padStart(2, "0")}</p>
      <div class="srow__body">
        <h3 class="h6">${esc(s.title)}</h3>
        <p class="muted">${esc(s.body)}</p>
        ${(s.tags || []).length ? `<ul class="tags">${s.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
      </div>
    </div>`
    )
    .join("")}</div>`;
}

function awardsTable(awards) {
  return `<div class="rows table table--awards">${awards
    .map((a) => {
      const hover = a.hoverImage ? ` data-hover="${esc(src(media(a.hoverImage), 640))}"` : "";
      return `<div class="trow reveal"${hover}>${[a.year, a.title, a.org].map((v, i) => `<p class="h6${i === 0 ? " muted" : ""}">${esc(v)}</p>`).join("")}</div>`;
    })
    .join("")}</div>`;
}

function loader(c) {
  const l = c.loader;
  if (!l || l.enabled === false) return { before: "", head: "" };
  const name = `<span>${esc(l.line1)}</span><span>${esc(l.line2)}</span><em>${esc(l.line3)}</em>`;
  const back = l.backdrop ? src(media(l.backdrop), 800) : "";
  const face = l.portrait ? src(media(l.portrait), 800) : "";
  return {
    head: `<script>try{var s=+localStorage.getItem("loaderSeen");if(s&&Date.now()-s<6048e5||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("no-loader");else document.documentElement.classList.add("is-loading")}catch(e){document.documentElement.classList.add("no-loader")}</script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500&family=Instrument+Serif:ital@1&display=swap">`,
    before: `<div class="loader" aria-hidden="true">
  <div class="loader__bg"></div>
  <p class="loader__name loader__name--center">${name}</p>
  <div class="loader__frame">
    ${back ? `<img class="loader__back" src="${esc(back)}" alt="">` : ""}
    <div class="loader__pwrap">${face ? `<img class="loader__face" src="${esc(face)}" alt="">` : ""}</div>
  </div>
  <p class="loader__name loader__name--corner">${name}</p>
</div>`,
  };
}

function table(rows, cls) {
  return `<div class="rows table ${cls}">${rows
    .map((cells) => `<div class="trow reveal">${cells.map((v, i) => `<p class="h6${i === 0 ? " muted" : ""}">${esc(v)}</p>`).join("")}</div>`)
    .join("")}</div>`;
}

function photoMarquee(list, cls = "") {
  const items = (list || []).map(media).filter(Boolean);
  if (!items.length) return "";
  const set = items.map((m) => `<figure>${img(m, { width: 1024, alt: "" })}</figure>`).join("");
  return `<div class="marquee marquee--photos ${cls}"><div class="marquee__track">${set}${set}${set}</div></div>`;
}

function testimonials(c) {
  return `<div class="cols reveal">
    <p class="h6 muted quotes__label">What clients say?</p>
    <div class="span2 rows quotes">${(c.testimonials || [])
      .map(
        (t) => `<figure class="quote">
        <blockquote class="muted">${esc(t.quote)}</blockquote>
        <figcaption>${img(t.avatar, { width: 512, cls: "avatar", alt: "" })}<span><span>${esc(t.name)}</span><span class="muted">${esc(t.role)}</span></span></figcaption>
      </figure>`
      )
      .join("")}</div>
  </div>`;
}

const noteHref = (n) => (n.slug && (n.sections || []).length ? { href: `/notes/${n.slug}`, ext: false } : { href: n.url || (n.slug ? `/notes/${n.slug}` : "#"), ext: isExt(n.url) });
const noteLabel = (n) => {
  const sub = String(n.summary || "").trim().replace(/\.$/, "");
  return sub ? `${n.title} - ${sub.charAt(0).toLowerCase()}${sub.slice(1)}` : n.title;
};

function noteCards(c, limit) {
  const notes = limit ? (c.notes || []).slice(0, limit) : c.notes || [];
  return `<div class="cards">${notes
    .map((n) => {
      const { href, ext } = noteHref(n);
      const a = `href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ""}`;
      const pic = media(n.thumbnail) ? img(n.thumbnail, { width: 1024, alt: "" }) : `<span class="card__type"><span>${esc(n.title)}</span></span>`;
      return `<article class="card reveal">
        <a class="card__img" ${a} tabindex="-1" aria-hidden="true">${pic}</a>
        <h3 class="h6"><a ${a}>${esc(noteLabel(n))}</a></h3>
        <a class="card__go" ${a} aria-label="Read ${esc(n.title)}">${arrow}</a>
      </article>`;
    })
    .join("")}</div>`;
}

export function noteArticle(c, n) {
  const list = (c.notes || []).filter((x) => x.slug && (x.sections || []).length);
  const i = list.findIndex((x) => x.slug === n.slug);
  const prev = list.length > 1 ? list[(i - 1 + list.length) % list.length] : null;
  const next = list.length > 1 ? list[(i + 1) % list.length] : null;
  const words = (n.sections || []).reduce((t, s) => t + String(s.body || "").split(/\s+/).length + String(s.pullQuote || "").split(/\s+/).length, 0);
  const read = n.readTime || Math.max(1, Math.round(words / 200));
  const secs = (n.sections || [])
    .map((s) => `<section class="note-sec reveal"><h2>${esc(s.heading || "")}</h2><div>${paras(s.body)}</div></section>
      ${s.pullQuote ? `<blockquote class="note__pull reveal">${esc(s.pullQuote)}</blockquote>` : ""}
      ${media(s.image) ? `<figure class="note__img reveal">${img(s.image, { width: 2400, alt: "" })}</figure>` : ""}`)
    .join("");
  const body = `<article class="note">
    <header class="note__head">
      <h1 class="note__title reveal">${esc(n.title)}</h1>
      <div class="note__meta reveal">
        ${(n.tags || []).length ? `<ul class="tags">${n.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
        <span class="muted">${read} min${read === 1 ? "" : "s"} read</span>
      </div>
    </header>
    ${media(n.thumbnail) ? `<figure class="note__cover reveal">${img(n.thumbnail, { width: 2400, eager: true, alt: "" })}</figure>` : ""}
    ${n.quote ? `<p class="note__quote reveal">${esc(n.quote)}</p>` : ""}
    <div class="note__body">${secs}</div>
    ${prev || next ? `<nav class="note__pager" aria-label="More notes">
      ${prev ? `<a class="note__pg" href="/notes/${esc(prev.slug)}" aria-label="Previous note: ${esc(prev.title)}">Prev</a>` : "<span></span>"}
      ${next ? `<a class="note__pg" href="/notes/${esc(next.slug)}" aria-label="Next note: ${esc(next.title)}">Next</a>` : ""}
    </nav>` : ""}
  </article>`;
  const description = n.summary ? `${n.title} - ${n.summary}` : n.title;
  return layout(c, { path: `/notes/${n.slug}`, title: n.title, description, image: n.thumbnail, body });
}

function subscribe(c) {
  const s = c.settings;
  return `<section class="section" aria-labelledby="sub-h">
    ${title("Subscribe", "h2", "sub-h")}
    <p class="muted sub__blurb reveal">${esc(s.newsletterBlurb)}</p>
    <form class="form sub reveal" data-mailto="${esc(s.email)}" data-kind="subscribe"${s.newsletterUrl ? ` data-url="${esc(s.newsletterUrl)}"` : ""}>
      <label class="sr" for="sub-name">Name</label><input id="sub-name" name="name" placeholder="Name" autocomplete="name" required>
      <label class="sr" for="sub-email">Email</label><input id="sub-email" name="email" type="email" placeholder="Email" autocomplete="email" required>
      <button class="submit" type="submit">Submit</button>
    </form>
  </section>`;
}

function headRow(t, right, id) {
  return `<div class="headrow">${title(t, "h2", id)}<div class="headrow__right reveal">${right || ""}</div></div>`;
}

/* ---------- pages ---------- */

export function home(c) {
  const s = c.settings;
  const featured = c.projects.filter((p) => p.featured);
  const topics = s.speakingTopics || [];
  const half = Math.ceil(topics.length / 2);
  const body = `
<section class="hero">
  <h1 class="hero__name"><span class="title__mask"><span class="title__inner">${esc(s.name)}</span></span></h1>
  <figure class="hero__photo">${img(s.portrait, { width: 512, eager: true, alt: `Portrait of ${s.name}` })}</figure>
  <p class="h6 hero__role">${esc(s.role)}</p>
  <p class="muted hero__intro">${esc(s.intro)}</p>
</section>

<section class="section" aria-labelledby="work-h">
  ${headRow("Work", boxBtn("/work", "View All Works"), "work-h")}
  ${workRows(featured.length ? featured : c.projects.slice(0, 3))}
  ${clients(c)}
</section>

<section class="section" aria-labelledby="svc-h">
  ${title("Services", "h2", "svc-h")}
  ${services(c)}
</section>

<section class="section" aria-labelledby="aw-h">
  ${title("Awards", "h2", "aw-h")}
  ${awardsTable(c.awards || [])}
</section>

<section class="section section--bleed" aria-labelledby="sp-h">
  ${headRow("Speaking", boxBtn("/contact?about=speaking", "Book Me"), "sp-h")}
  ${photoMarquee(s.speakingPhotos)}
  <div class="cols topics reveal">
    <p class="muted">Topics I speak on</p>
    <ul class="rows">${topics.slice(0, half).map((t) => `<li class="h6">${esc(t)}</li>`).join("")}</ul>
    <ul class="rows">${topics.slice(half).map((t) => `<li class="h6">${esc(t)}</li>`).join("")}</ul>
  </div>
</section>

<section class="section" aria-labelledby="t-h">
  ${title("Testimonials", "h2", "t-h")}
  ${testimonials(c)}
</section>

<section class="section" aria-labelledby="n-h">
  ${title("Notes", "h2", "n-h")}
  <div class="subrow reveal"><p class="muted">Ideas, stories, and lessons I share along the way.</p>${boxBtn("/notes", "See All Notes")}</div>
  ${noteCards(c, 3)}
</section>

${subscribe(c)}`;
  return layout(c, { path: "/", body, ...loader(c) });
}

export function work(c) {
  const body = `<section class="section section--page" aria-labelledby="w-h">
    ${headRow("Work", `<p>From 2016</p>`, "w-h")}
    ${workRows(c.projects)}
  </section>`;
  return layout(c, { path: "/work", title: "Work", body });
}

function gallery(images = []) {
  const items = (images || []).map(media).filter(Boolean);
  if (!items.length) return "";
  return `<div class="gallery">${items
    .map((m) => `<figure class="g g--${m.size === "half" ? "half" : "full"} reveal">${img(m, { width: m.size === "half" ? 1400 : 2400 })}</figure>`)
    .join("")}</div>`;
}

export function caseStudy(c, p) {
  const idx = c.projects.findIndex((x) => x.slug === p.slug);
  const next = idx >= 0 ? c.projects[idx + 1] : null;
  const body = `<article class="cs">
    <header class="cs__head">
      ${title(p.title, "h1")}
      <div class="cs__meta reveal">
        <div><p class="muted">Client</p><p>${esc(p.client)}</p></div>
        <div><p class="muted">Services</p><p>${esc(p.services)}</p></div>
        <div class="cs__year"><p class="muted">Year</p><p>${esc(p.year)}</p></div>
      </div>
      <div class="cs__intro reveal">
        ${paras(p.intro)}
        ${(p.tags || []).length ? `<ul class="tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
      </div>
    </header>
    ${p.cover ? `<figure class="cs__cover reveal">${img(p.cover, { width: 2400, eager: true, alt: `${p.title}` })}</figure>` : ""}
    ${(p.sections || [])
      .map(
        (sec) => `<section class="cs-sec">
        ${sec.heading || sec.body ? `<div class="cs-sec__text reveal"><h2>${esc(sec.heading || "")}</h2><div>${paras(sec.body)}</div></div>` : ""}
        ${gallery(sec.images)}
      </section>`
      )
      .join("")}
  </article>
  ${
    `<section class="section" aria-labelledby="next-h">
    ${headRow("Next", boxBtn("/work", "View All Works"), "next-h")}
    ${next ? workRows([next]) : ""}
  </section>`
  }`;
  return layout(c, { path: `/work/${p.slug}`, title: p.title, image: p.thumbnail || p.cover, body });
}

function musicCard(np) {
  if (!np || !np.song) return "";
  const bars = Array.from({ length: 28 }, (_, i) => `<i style="--d:${((i * 37) % 11) / 10}s;--h:${30 + ((i * 53) % 70)}%"></i>`).join("");
  const tag = np.url ? "a" : "div";
  return `<${tag} class="music reveal"${np.url ? ` href="${esc(np.url)}" target="_blank" rel="noopener"` : ""}>
    ${img(np.cover, { width: 160, cls: "music__art", alt: "" })}
    <span class="music__meta"><span class="music__song">${esc(np.song)}</span><span class="music__sub">${esc(np.album)}<span aria-hidden="true">•</span>${esc(np.artist)}</span></span>
    <span class="music__wave" aria-hidden="true">${bars}</span>
    <span class="music__play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 7.5v9l7.5-4.5z" fill="currentColor"/></svg></span>
  </${tag}>`;
}

export function about(c) {
  const s = c.settings;
  const tags = s.aboutTags || [];
  const body = `<section class="section section--page about" aria-labelledby="a-h">
    ${title("About", "h1", "a-h")}
    <div class="cols about__tags reveal">${tags.map((t) => `<p class="h6">${esc(t)}</p>`).join("")}</div>
    <div class="cols">
      <div></div>
      <div class="span2">
        <figure class="about__photo reveal">${img(s.aboutPortrait || s.portrait, { width: 512, eager: true, alt: `Portrait of ${s.name}` })}</figure>
        <div class="about__text reveal">${(s.aboutParagraphs || []).map((p) => `<p class="h6">${esc(p)}</p>`).join("")}</div>
        ${musicCard(s.nowPlaying)}
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="c-h">
    ${title("Career", "h2", "c-h")}
    ${table((s.career || []).map((x) => [x.year, x.text]), "table--career")}
  </section>

  <section class="section" aria-labelledby="e-h">
    ${title("Academic Feats", "h2", "e-h")}
    ${table((s.education || []).map((x) => [x.year, x.title, x.org]), "table--edu")}
    <h2 class="h5 reveal">Experiences</h2>
    ${table((s.experience || []).map((x) => [x.period, x.role, x.org]), "table--exp")}
  </section>

  <section class="section section--bleed" aria-label="Off the clock">
    <div class="subrow reveal"><p class="muted offduty">${esc(s.offDutyLine)}</p>${boxBtn("/contact", "Book Me")}</div>
    ${photoMarquee(s.aboutPhotos, "marquee--slow")}
    ${s.appearances ? `<div class="appear reveal">${lines(s.appearances).map((l) => `<p>${esc(l)}</p>`).join("")}</div>` : ""}
  </section>`;
  return layout(c, { path: "/about", title: "About", image: s.aboutPortrait, body });
}

export function speaking(c) {
  const s = c.settings;
  const links = [
    [s.bioUrl, "Professional Bio"],
    [s.headshotsUrl, "Headshots"],
    [s.pressKitUrl, "Press Kit"],
  ].filter(([u]) => u);
  const body = `<section class="section section--page" aria-labelledby="s-h">
    ${title("Speaking", "h1", "s-h")}
    <div class="cols reveal sp__intro"><div></div><p class="h6 span2">${esc(s.speakingIntro)}</p></div>
    ${s.speakingImage ? `<figure class="sp__image reveal">${img(s.speakingImage, { width: 2400, eager: true, alt: "Bolutife speaking on stage" })}</figure>` : ""}
    <div class="cols reveal">
      <p class="h6 muted">My Signature Topics</p>
      <ul class="rows span2">${(s.signatureTopics || []).map((t) => `<li class="h6">${esc(t.title)} — ${esc(t.body)}</li>`).join("")}</ul>
    </div>
  </section>
  <section class="section section--bleed" aria-label="Past events">
    <div class="subrow reveal"><p class="muted">Past Events</p>${boxBtn("/contact?about=speaking", "Book Me")}</div>
    ${photoMarquee(s.speakingPhotos)}
    ${links.length ? `<div class="sp__links reveal">${links.map(([u, l]) => arrowLink(u, l, true)).join("")}</div>` : ""}
  </section>`;
  return layout(c, { path: "/speaking", title: "Speaking", description: s.speakingIntro, image: s.speakingImage, body });
}

export function notes(c) {
  const body = `<section class="section section--page" aria-labelledby="no-h">
    ${title("Notes", "h1", "no-h")}
    <div class="subrow reveal"><p class="muted">Ideas, stories, and lessons I share along the way.</p></div>
    ${noteCards(c)}
  </section>`;
  return layout(c, { path: "/notes", title: "Notes", body });
}

export function contact(c, query = {}) {
  const s = c.settings;
  const links = [["mailto:" + s.email, "Email"], ...(s.socials || []).map((x) => [x.url, x.label])];
  const pre = query.about === "speaking" ? "Hi Bolutife, I'd like to book you to speak at " : "";
  const body = `<section class="section section--page" aria-labelledby="ct-h">
    ${title("Contact", "h1", "ct-h")}
    <div class="contact reveal">
      <div class="contact__info">
        <div><p class="muted">Address</p>${(s.locations || []).map((l) => `<p>${esc(l)}</p>`).join("")}<p><a href="mailto:${esc(s.email)}">${esc(s.email)}</a></p></div>
        <div><p class="muted">Social</p>${links.map(([h, l]) => arrowLink(h, l, true)).join("")}</div>
      </div>
      <form class="form contact__form" data-mailto="${esc(s.email)}" data-kind="contact">
        <label class="sr" for="c-name">Full name</label><input id="c-name" name="name" placeholder="Full Name" autocomplete="name" required>
        <label class="sr" for="c-email">Email</label><input id="c-email" name="email" type="email" placeholder="Email" autocomplete="email" required>
        <label class="sr" for="c-msg">Message</label><textarea id="c-msg" name="message" placeholder="Type a message..." rows="7" required>${esc(pre)}</textarea>
        <button class="submit" type="submit">Submit</button>
      </form>
    </div>
  </section>`;
  return layout(c, { path: "/contact", title: "Contact", body });
}

const slug = (t = "") => String(t).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function playground(c, query = {}) {
  const pg = c.playground || {};
  const shots = (c.shots || []).map((s) => ({ ...s, m: media(s.media), cat: slug(s.category || "") })).filter((s) => s.m);
  const used = new Set(shots.map((s) => s.cat).filter(Boolean));
  const cats = [...(c.shotCategories || []), ...shots.map((s) => s.category).filter(Boolean)]
    .filter((t, i, a) => t && a.indexOf(t) === i && used.has(slug(t)));
  const active = cats.some((t) => slug(t) === query.c) ? query.c : "all";
  const count = (k) => (k === "all" ? shots.length : shots.filter((s) => s.cat === k).length);
  const filters = cats.length
    ? `<div class="pg__filters reveal" role="group" aria-label="Filter shots">${[["all", "All"], ...cats.map((t) => [slug(t), t])]
        .map(([k, l]) => `<a class="pg__filter" href="/playground${k === "all" ? "" : `?c=${k}`}" data-cat="${k}"${k === active ? ' aria-current="true"' : ""}>${esc(l)}<sup>${count(k)}</sup></a>`)
        .join("")}</div>`
    : "";
  const items = shots
    .map((s, i) => {
      const label = s.title || s.caption || "Shot";
      const full = s.m.isVideo ? s.m.url : src(s.m, 2400);
      const cap = s.title || s.caption || (s.tags || []).length
        ? `<figcaption class="shot__cap">
            ${s.title ? `<p>${esc(s.title)}</p>` : ""}
            ${s.caption ? `<p class="muted">${esc(s.caption)}</p>` : ""}
            ${(s.tags || []).length ? `<ul class="tags">${s.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
          </figcaption>`
        : "";
      return `<figure class="shot reveal${s.wide ? " shot--wide" : ""}" data-cat="${esc(s.cat)}"${active !== "all" && s.cat !== active ? " hidden" : ""}>
        <button class="shot__open" type="button" data-i="${i}" data-full="${esc(full)}" data-video="${s.m.isVideo ? 1 : 0}" data-title="${esc(s.title || "")}" data-caption="${esc(s.caption || "")}" data-link="${esc(s.link || "")}" aria-label="View ${esc(label)}">${img(s.m, { width: s.wide ? 1600 : 1000, alt: s.title || "" })}</button>
        ${cap}
      </figure>`;
    })
    .join("");
  const body = `<section class="section section--page" aria-labelledby="pg-h">
    ${title(pg.title || "Playground", "h1", "pg-h")}
    <div class="cols reveal pg__intro"><div></div><p class="h6 span2">${esc(pg.intro || "")}</p></div>
    ${filters}
    ${shots.length ? `<div class="shots">${items}</div>` : `<p class="muted pg__empty reveal">New shots are on the way.</p>`}
  </section>
  <div class="lightbox" id="lightbox" hidden aria-modal="true" role="dialog" aria-label="Shot viewer">
    <button class="lightbox__close" type="button">Close</button>
    <div class="lightbox__stage"></div>
    <div class="lightbox__bar">
      <div class="lightbox__text"></div>
      <div class="lightbox__nav"><button type="button" class="lightbox__prev" aria-label="Previous">Prev</button><button type="button" class="lightbox__next" aria-label="Next">Next</button></div>
    </div>
  </div>`;
  return layout(c, { path: "/playground", title: pg.title || "Playground", description: pg.intro, image: shots[0] && !shots[0].m.isVideo ? shots[0].media : null, body });
}

export function notFound(c) {
  const body = `<section class="section section--page">
    ${title("Not found", "h1")}
    <div class="subrow"><p class="muted">This page has moved or never existed. The work is still here.</p>${boxBtn("/work", "View All Works")}</div>
  </section>`;
  return layout(c, { path: "", title: "Not found", body });
}
