// Direction A — The Living Brand Book.
// The site is set like Bolutife's own brand guidelines: a cover, a contents
// page, numbered chapters, running heads, folios, figure captions and spec
// tables. One spot colour (green, from the 2025 portraits) does all the
// signalling. Instrument Sans (with its width axis) + Instrument Serif.

import { esc, img, media } from "../../media.mjs";
import { photo } from "../../photos.mjs";
import { headTags, href, paras, extAttrs, year, fmtDate } from "../../shell.mjs";
import { contentIndex } from "../../model.mjs";
import { markBook } from "../marks.mjs";

const CH = [
  { n: "01", key: "about", path: "/about", label: "About", line: "Who I am, the path that got me here, and how I work." },
  { n: "02", key: "work", path: "/work", label: "Work", line: "Brand identities and creative direction, with the thinking behind each." },
  { n: "03", key: "ventures", path: "/ventures", label: "Ventures", line: "The company and the social enterprise I founded." },
  { n: "04", key: "speaking", path: "/speaking", label: "Speaking", line: "What I speak on, where I've spoken, and how to book me." },
  { n: "05", key: "writing", path: "/writing", label: "Writing", line: "Notes on brand, design and leadership, and my book." },
  { n: "06", key: "side", path: "/on-the-side", label: "On the side", line: "Films, books, music, and the people I spend time with." },
  { n: "07", key: "contact", path: "/contact", label: "Contact", line: "How to reach me, and what to tell me." },
];
const chapterOf = (key) => CH.find((c) => c.key === key);
const PAGE_CH = { about: "about", work: "work", case: "work", ventures: "ventures", speaking: "speaking", writing: "writing", article: "writing", side: "side", contact: "contact" };

/* ---------- shell ---------- */

function shell(m, ctx, { title, description, image, body, chapter }) {
  const L = (p) => href(ctx, p);
  const cur = chapter ? chapterOf(chapter) : null;
  const i = cur ? CH.indexOf(cur) : -1;
  const prev = i > 0 ? CH[i - 1] : null;
  const next = i >= 0 && i < CH.length - 1 ? CH[i + 1] : i === -1 && ctx.pageKey === "home" ? CH[0] : null;
  const contents = CH.map(
    (c) => `<li><a href="${L(c.path)}"${cur && cur.key === c.key ? ' aria-current="page"' : ""}><span class="bk-toc__n">${c.n}</span><span>${c.label}</span></a></li>`
  ).join("");

  return `<!doctype html>
<html lang="en" class="bk">
<head>
${headTags(ctx, { title, description, image, path: ctx.path })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wdth,wght@0,75..100,400..700;1,75..100,400..700&family=Instrument+Serif:ital@0;1&display=swap">
<link rel="stylesheet" href="/assets/book.css?v=1">
<script src="/assets/book.js?v=1" defer></script>
</head>
<body class="bk-page bk-page--${ctx.pageKey}">
<a class="bk-skip" href="#main">Skip to content</a>
<header class="bk-head">
  <a class="bk-head__brand" href="${L("/")}" aria-label="Bolutife Awakan, home">${markBook({ size: 30, title: "" })}<span>Bolutife Awakan</span></a>
  <p class="bk-head__run">${cur ? `<span class="bk-head__ch">${cur.n}</span> ${esc(cur.label)}` : "Personal brand book, 2026 edition"}</p>
  <button class="bk-head__toc" type="button" aria-expanded="false" aria-controls="bk-contents">Contents</button>
</header>
<nav class="bk-rail" aria-label="Contents">
  <a class="bk-rail__cover" href="${L("/")}"${ctx.pageKey === "home" ? ' aria-current="page"' : ""}>Cover</a>
  <ol class="bk-toc">${contents}</ol>
  <a class="bk-rail__index" href="${L("/index")}"${ctx.pageKey === "index" ? ' aria-current="page"' : ""}>Index of everything</a>
</nav>
<div class="bk-contents" id="bk-contents" hidden>
  <div class="bk-contents__in">
    <p class="bk-contents__title">Contents</p>
    <ol class="bk-contents__list">${CH.map((c) => `<li><a href="${L(c.path)}"><span class="bk-toc__n">${c.n}</span><span class="bk-contents__label">${c.label}</span><span class="bk-contents__line">${esc(c.line)}</span></a></li>`).join("")}</ol>
    <p class="bk-contents__foot"><a href="${L("/")}">Back to the cover</a><a href="${L("/index")}">Index of everything</a></p>
    <button class="bk-contents__close" type="button">Close</button>
  </div>
</div>
<main id="main" class="bk-main">
${body}
</main>
<footer class="bk-foot">
  <nav class="bk-folio" aria-label="Chapters">
    ${prev ? `<a class="bk-folio__prev" href="${L(prev.path)}"><span class="bk-folio__dir">Previous chapter</span><span>${prev.n} ${prev.label}</span></a>` : `<a class="bk-folio__prev" href="${L("/")}"><span class="bk-folio__dir">Back to</span><span>Cover</span></a>`}
    ${next ? `<a class="bk-folio__next" href="${L(next.path)}"><span class="bk-folio__dir">Next chapter</span><span>${next.n} ${next.label}</span></a>` : `<a class="bk-folio__next" href="${L("/contact")}" data-track="contact_cta" data-track-target="footer"><span class="bk-folio__dir">Get in touch</span><span>Contact</span></a>`}
  </nav>
  <div class="bk-colophon">
    <div>
      <p class="bk-colophon__line">${esc(m.footerLine || "")}</p>
      <p><a class="bk-link" href="mailto:${esc(m.person.email)}">${esc(m.person.email)}</a></p>
    </div>
    <ul class="bk-colophon__social">${m.person.socials.map((s) => `<li><a class="bk-link" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join("")}</ul>
    <p class="bk-colophon__meta">Set in Instrument Sans and Instrument Serif. ${esc(m.photoCredit)}. Bolutife Awakan, ${year()}.</p>
  </div>
</footer>
</body>
</html>`;
}

/* ---------- parts ---------- */

// The opening spread of a chapter.
function opener(chapterKey, { title, lead, sections = [] } = {}) {
  const c = chapterOf(chapterKey);
  return `<header class="bk-open">
    <p class="bk-open__n" aria-hidden="true">${c.n}</p>
    <div class="bk-open__text">
      <p class="bk-open__kicker">Chapter ${c.n}</p>
      <h1 class="bk-open__title">${esc(title || c.label)}</h1>
      <p class="bk-open__lead">${esc(lead || c.line)}</p>
    </div>
    ${sections.length ? `<nav class="bk-open__in" aria-label="In this chapter"><p>In this chapter</p><ol>${sections.map(([id, label], i) => `<li><a href="#${id}"><span>${c.n.replace(/^0/, "")}.${i + 1}</span>${esc(label)}</a></li>`).join("")}</ol></nav>` : ""}
  </header>`;
}

// A numbered section inside a chapter: "1.2 Practice".
function sec(chapterKey, i, id, label, body, cls = "") {
  const c = chapterOf(chapterKey);
  return `<section class="bk-sec ${cls}" id="${id}" aria-labelledby="${id}-h">
    <h2 class="bk-sec__h" id="${id}-h"><span class="bk-sec__n">${c.n.replace(/^0/, "")}.${i}</span>${esc(label)}</h2>
    <div class="bk-sec__body">${body}</div>
  </section>`;
}

// A home-page excerpt that points into its chapter.
function excerpt(L, chapterKey, heading, body, link) {
  const c = chapterOf(chapterKey);
  return `<section class="bk-ex" aria-labelledby="ex-${c.key}">
    <div class="bk-ex__side">
      <a class="bk-ex__ch" href="${L(c.path)}"><span>${c.n}</span>${c.label}</a>
    </div>
    <div class="bk-ex__main">
      <h2 class="bk-ex__h" id="ex-${c.key}">${esc(heading)}</h2>
      ${body}
      ${link ? `<p class="bk-ex__more"><a class="bk-link" href="${L(link[0])}">${esc(link[1])}</a></p>` : ""}
    </div>
  </section>`;
}

const spec = (rows) =>
  `<dl class="bk-spec">${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`)
    .join("")}</dl>`;

function plates(L, projects, { start = 1, big = false } = {}) {
  return `<ol class="bk-plates${big ? " bk-plates--big" : ""}">${projects
    .map(
      (p, i) => `<li class="bk-plate">
      <a class="bk-plate__a" href="${L(p.path)}">
        <figure class="bk-plate__fig"><span class="bk-crop" aria-hidden="true"></span>${img(p.thumbnail || p.cover, { width: 1400, alt: "" })}</figure>
        <span class="bk-plate__cap"><span class="bk-plate__fig-n">Fig. 2.${start + i}</span><span class="bk-plate__t">${esc(p.title)}</span><span class="bk-plate__s">${esc(p.summary)}</span><span class="bk-plate__m">${esc([p.services, p.year].filter(Boolean).join(", "))}</span></span>
      </a>
    </li>`
    )
    .join("")}</ol>`;
}

function ventureBlocks(L, ventures, { full = false } = {}) {
  return ventures
    .map(
      (v, i) => `<article class="bk-venture" id="${esc(v.slug)}" aria-labelledby="v-${esc(v.slug)}">
      <header class="bk-venture__head">
        <h3 class="bk-venture__name" id="v-${esc(v.slug)}">${full ? `<span class="bk-sec__n">3.${i + 1}</span>` : ""}${esc(v.name)}</h3>
        <p class="bk-venture__rel">${esc(v.kind)}. My role: ${esc(v.role)}.</p>
      </header>
      <p class="bk-venture__line">${esc(v.line)}</p>
      ${full ? `<p class="bk-venture__body">${esc(v.body)}</p>` : ""}
      ${full && v.offers.length ? `<ul class="bk-venture__offers">${v.offers.map((o) => `<li><h4>${esc(o.title)}</h4><p>${esc(o.body)}</p></li>`).join("")}</ul>` : ""}
      ${v.url ? `<p><a class="bk-link" href="${esc(v.url)}" target="_blank" rel="noopener" data-track="venture_click" data-track-target="${esc(v.slug)}">${esc(v.cta)}</a></p>` : ""}
    </article>`
    )
    .join("");
}

function noteList(L, notes, { limit } = {}) {
  const list = limit ? notes.slice(0, limit) : notes;
  return `<ol class="bk-notes">${list
    .map((n) => {
      const h = n.path ? L(n.path) : n.href || "#";
      return `<li><a href="${esc(h)}"${n.path ? "" : extAttrs(h)}>
        <span class="bk-notes__date">${esc(n.date ? fmtDate(n.date) : "")}</span>
        <span class="bk-notes__t">${esc(n.title)}</span>
        <span class="bk-notes__s">${esc(n.summary || "")}</span>
        <span class="bk-notes__r">${n.readTime ? `${n.readTime} min read` : ""}</span>
      </a></li>`;
    })
    .join("")}</ol>`;
}

function bookBlock(b) {
  return `<div class="bk-book">
    <p class="bk-book__t">${esc(b.title)}</p>
    <p>${esc(b.line)}</p>
    ${b.url ? `<p><a class="bk-link" href="${esc(b.url)}" target="_blank" rel="noopener" data-track="venture_click" data-track-target="book">${esc(b.cta)}</a></p>` : ""}
  </div>`;
}

/* ---------- pages ---------- */

function home(m, ctx) {
  const L = (p) => href(ctx, p);
  const p = m.person;
  const body = `
<section class="bk-cover" aria-labelledby="cover-h">
  <div class="bk-cover__lockup">
    <div class="bk-cover__mark">${markBook({ size: 360, grid: true, title: "Bolutife Awakan monogram" })}</div>
    <p class="bk-cover__edition">Personal brand book<br>2026 edition</p>
  </div>
  <div class="bk-cover__text">
    <p class="bk-cover__name">${esc(p.name)}</p>
    <h1 class="bk-cover__h" id="cover-h">${esc(p.headline)}</h1>
    <p class="bk-cover__sup">${esc(p.supporting)}</p>
    <p class="bk-cover__id">${p.identity.map(esc).join("<br>")}</p>
    <p class="bk-cover__cta"><a class="bk-btn" href="${L("/work")}">See the work</a><a class="bk-btn bk-btn--ghost" href="${L("/contact")}">Work with me</a></p>
  </div>
  <figure class="bk-cover__photo">
    ${photo("steps-smile", { sizes: "(max-width: 900px) 100vw, 34vw", eager: true })}
    <figcaption class="bk-note"><span class="bk-note__k">Primary portrait</span>${esc(m.photoCredit)}, 2025.</figcaption>
  </figure>
</section>

<section class="bk-contents-page" aria-labelledby="toc-h">
  <h2 class="bk-contents-page__h" id="toc-h">Contents</h2>
  <ol class="bk-contents-page__list">${CH.map((c) => `<li><a href="${L(c.path)}"><span class="bk-toc__n">${c.n}</span><span class="bk-contents-page__label">${c.label}</span><span class="bk-contents-page__line">${esc(c.line)}</span></a></li>`).join("")}</ol>
</section>

${excerpt(L, "work", "Selected work", plates(L, m.work.featured), ["/work", "All work"])}

${excerpt(
  L,
  "about",
  "Practice and leadership",
  `<blockquote class="bk-belief">${esc(m.practice.belief)}</blockquote>
   <ul class="bk-areas">${m.practice.areas.map((a) => `<li><h3>${esc(a.title)}</h3><p>${esc(a.body)}</p></li>`).join("")}</ul>
   <p class="bk-quiet">${esc(m.practice.operator)}</p>
   ${logos(m)}`,
  ["/about", "About me"]
)}

${excerpt(L, "ventures", "Ventures and initiatives", ventureBlocks(L, m.ventures), ["/ventures", "Both ventures in full"])}

${excerpt(
  L,
  "speaking",
  "Speaking",
  `<p class="bk-lede">${esc(m.speaking.promise)}</p>
   <ul class="bk-tracks">${m.speaking.tracks.map((t) => `<li>${esc(t.title)}</li>`).join("")}</ul>
   <p><a class="bk-btn bk-btn--ghost" href="${L("/contact?about=speaking")}">Book me to speak</a></p>`,
  ["/speaking", "Topics and past talks"]
)}

${excerpt(L, "writing", "Writing and books", noteList(L, m.writing.notes, { limit: 3 }) + m.books.map(bookBlock).join(""), ["/writing", "All writing"])}

${excerpt(
  L,
  "side",
  "Away from work",
  `<div class="bk-side-ex">
     <figure>${photo("garden-sun", { sizes: "(max-width: 900px) 60vw, 20vw" })}</figure>
     <p class="bk-lede">${esc(m.side.intro)}</p>
   </div>`,
  ["/on-the-side", "On the side"]
)}

${excerpt(
  L,
  "contact",
  "Contact",
  `<p class="bk-lede">For brand projects, design leadership, speaking or Design Lever, write to me.</p>
   <p class="bk-big-mail"><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></p>
   <p><a class="bk-btn" href="${L("/contact")}">Send a message</a></p>`
)}`;
  return shell(m, ctx, { body, image: "photo:steps-smile" });
}

function logos(m) {
  const list = (m.work.clientLogos || []).map(media).filter(Boolean);
  if (!list.length) return "";
  return `<div class="bk-logos"><p class="bk-quiet">Selected clients</p><ul>${list.map((l) => `<li>${img(l, { width: 400, alt: l.alt })}</li>`).join("")}</ul></div>`;
}

function about(m, ctx) {
  const L = (p) => href(ctx, p);
  const a = m.about;
  const body = `${opener("about", { title: "About", lead: m.person.headline, sections: [["story", "Who I am"], ["path", "The path"], ["practice", "Practice and leadership"], ["experience", "Experience and education"], ["recognition", "Recognition"], ["clients-say", "What clients say"]] })}
  <div class="bk-about-hero">
    <figure class="bk-about-hero__fig">${photo("colonnade", { sizes: "(max-width: 900px) 100vw, 40vw", eager: true })}<figcaption class="bk-note"><span class="bk-note__k">Fig. 1.1</span>${esc(m.photoCredit)}.</figcaption></figure>
    <div class="bk-about-hero__text">${a.paragraphs.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
  </div>
  ${sec("about", 1, "story", "Who I am", `<p class="bk-lede">${esc(m.person.supporting)}</p><p class="bk-identity">${m.person.identity.map(esc).join(", ")}</p>`)}
  ${sec(
    "about",
    2,
    "path",
    "The path",
    `<ol class="bk-path">${a.path.map((s) => `<li><p class="bk-path__when">${esc(s.when)}</p><p>${esc(s.text)}</p></li>`).join("")}</ol>`
  )}
  ${sec(
    "about",
    3,
    "practice",
    "Practice and leadership",
    `<blockquote class="bk-belief">${esc(m.practice.belief)}</blockquote>
     <ul class="bk-areas">${m.practice.areas.map((x) => `<li><h3>${esc(x.title)}</h3><p>${esc(x.body)}</p></li>`).join("")}</ul>
     <p class="bk-quiet">${esc(m.practice.operator)}</p>
     <h3 class="bk-h3">Services</h3>
     <ul class="bk-services">${m.practice.services.map((s) => `<li><h4>${esc(s.title)}</h4><p>${esc(s.body)}</p>${(s.tags || []).length ? `<p class="bk-tags">${s.tags.map(esc).join(", ")}</p>` : ""}</li>`).join("")}</ul>`
  )}
  ${sec(
    "about",
    4,
    "experience",
    "Experience and education",
    `<table class="bk-table"><caption class="bk-sr">Experience</caption><thead><tr><th scope="col">Years</th><th scope="col">Role</th><th scope="col">Organisation</th></tr></thead><tbody>${a.experience.map((x) => `<tr><td>${esc(String(x.period || "").replace(/[()]/g, ""))}</td><td>${esc(x.role)}</td><td>${esc(x.org)}</td></tr>`).join("")}</tbody></table>
     <table class="bk-table"><caption class="bk-sr">Education</caption><thead><tr><th scope="col">Year</th><th scope="col">Programme</th><th scope="col">Institution</th></tr></thead><tbody>${a.education.map((x) => `<tr><td>${esc(x.year)}</td><td>${esc(x.title)}</td><td>${esc(x.org)}</td></tr>`).join("")}</tbody></table>
     <p class="bk-quiet">${esc(m.mentoring)}</p>`
  )}
  ${sec(
    "about",
    5,
    "recognition",
    "Recognition",
    `<table class="bk-table"><caption class="bk-sr">Awards</caption><thead><tr><th scope="col">Year</th><th scope="col">Award</th><th scope="col">Given by</th></tr></thead><tbody>${a.awards.map((x) => `<tr><td>${esc(x.year)}</td><td>${esc(x.title)}</td><td>${esc(x.org)}</td></tr>`).join("")}</tbody></table>
     <ul class="bk-career">${a.career.map((x) => `<li><span>${esc(x.year)}</span>${esc(x.text)}</li>`).join("")}</ul>`
  )}
  ${sec(
    "about",
    6,
    "clients-say",
    "What clients say",
    `<div class="bk-quotes">${a.testimonials.map((t) => `<figure class="bk-quote"><blockquote>${esc(t.quote)}</blockquote><figcaption>${esc(t.name)}<span>${esc(t.role)}</span></figcaption></figure>`).join("")}</div>`
  )}`;
  return shell(m, ctx, { title: "About", description: m.person.supporting, image: "photo:colonnade", body, chapter: "about" });
}

function work(m, ctx) {
  const L = (p) => href(ctx, p);
  const body = `${opener("work", { title: "Work", lead: "Brand identities, systems and creative direction for companies, events and founders since 2013." })}
  ${plates(L, m.work.all, { big: true })}`;
  return shell(m, ctx, { title: "Work", body, chapter: "work" });
}

function caseStudy(m, ctx) {
  const L = (p) => href(ctx, p);
  const p = ctx.project;
  const idx = m.work.all.findIndex((x) => x.slug === p.slug);
  const next = m.work.all[(idx + 1) % m.work.all.length];
  let fig = 0;
  const gallery = (images = [], heading = "") => {
    const items = (images || []).map(media).filter(Boolean);
    if (!items.length) return "";
    return `<div class="bk-gallery">${items
      .map((im) => `<figure class="bk-g bk-g--${im.size === "half" ? "half" : "full"}">${img(im, { width: im.size === "half" ? 1400 : 2400 })}<figcaption class="bk-note"><span class="bk-note__k">Fig. ${++fig}</span>${esc(im.alt || heading || p.title)}</figcaption></figure>`)
      .join("")}</div>`;
  };
  const body = `<article class="bk-case">
    <header class="bk-case__head">
      <p class="bk-case__kicker"><a href="${L("/work")}">02 Work</a></p>
      <h1 class="bk-case__title">${esc(p.title)}</h1>
      <p class="bk-case__sum">${esc(p.summary)}</p>
      ${spec([
        ["Client", esc(p.client)],
        ["Sector", esc(p.services)],
        ["Year", esc(p.year)],
        ["Scope", (p.tags || []).map(esc).join(", ")],
      ])}
    </header>
    ${p.cover ? `<figure class="bk-case__cover">${img(p.cover, { width: 2400, eager: true, alt: p.title })}</figure>` : ""}
    <div class="bk-case__intro">${paras(p.intro)}</div>
    ${(p.sections || [])
      .map(
        (s) => `<section class="bk-case__sec">
        ${s.heading || s.body ? `<div class="bk-case__text">${s.heading ? `<h2>${esc(s.heading)}</h2>` : ""}<div>${paras(s.body)}</div></div>` : ""}
        ${gallery(s.images, s.heading)}
      </section>`
      )
      .join("")}
  </article>
  <section class="bk-next" aria-label="Next case study">
    <p class="bk-quiet">Next case study</p>
    <a class="bk-next__a" href="${L(next.path)}">${esc(next.title)}</a>
    <p><a class="bk-btn bk-btn--ghost" href="${L("/contact")}">Start a project with me</a></p>
  </section>`;
  return shell(m, ctx, { title: p.title, description: p.summary, image: p.thumbnail || p.cover, body, chapter: "work" });
}

function ventures(m, ctx) {
  const L = (p) => href(ctx, p);
  const body = `${opener("ventures", {
    title: "Ventures",
    lead: "Alongside my design leadership work, I founded two organisations. Each has its own name and identity; this chapter explains what they do and my part in them.",
    sections: [...m.ventures.map((v) => [v.slug, v.name]), ["mentoring", "Mentoring"]],
  })}
  <div class="bk-ventures">${ventureBlocks(L, m.ventures, { full: true })}</div>
  ${sec("ventures", m.ventures.length + 1, "mentoring", "Mentoring", `<p class="bk-lede">${esc(m.mentoring)}</p><p><a class="bk-btn bk-btn--ghost" href="${L("/contact?about=mentoring")}">Ask about mentoring</a></p>`)}`;
  return shell(m, ctx, { title: "Ventures", description: m.ventures.map((v) => `${v.name}: ${v.line}`).join(" "), body, chapter: "ventures" });
}

function speaking(m, ctx) {
  const L = (p) => href(ctx, p);
  const s = m.speaking;
  const body = `${opener("speaking", { title: "Speaking", lead: s.promise, sections: [["approach", "My approach"], ["topics", "Topics"], ["talks", "Talks"], ["appearances", "Where I've spoken"], ["book", "Book me"]] })}
  ${s.image ? `<figure class="bk-wide">${img(s.image, { width: 2400, eager: true, alt: "Bolutife speaking on stage" })}<figcaption class="bk-note"><span class="bk-note__k">Fig. 4.1</span>On stage.</figcaption></figure>` : ""}
  ${sec("speaking", 1, "approach", "My approach", `<p class="bk-lede">${esc(s.intro)}</p><p class="bk-quiet">Formats: ${s.formats.map(esc).join(", ")}.</p>`)}
  ${sec("speaking", 2, "topics", "Topics", `<ol class="bk-topic-list">${s.tracks.map((t) => `<li><h3>${esc(t.title)}</h3><p>${esc(t.body)}</p></li>`).join("")}</ol>`)}
  ${sec("speaking", 3, "talks", "Talks", `<ul class="bk-talks">${s.talks.map((t) => `<li><p class="bk-talks__t">${esc(t.title)}</p><p class="bk-quiet">${esc([t.track, t.event].filter(Boolean).join(". "))}</p></li>`).join("")}</ul>`)}
  ${sec(
    "speaking",
    4,
    "appearances",
    "Where I've spoken",
    `<ul class="bk-appear">${s.appearances.map((a) => `<li><p class="bk-appear__t">${esc(a.title)}</p><p>${esc(a.body)}</p></li>`).join("")}</ul>
     ${s.photos.length ? `<div class="bk-strip">${s.photos.map((ph) => `<figure>${img(ph, { width: 1000, alt: "" })}</figure>`).join("")}</div>` : ""}`
  )}
  ${sec(
    "speaking",
    5,
    "book",
    "Book me",
    `<p class="bk-lede">Tell me about your event, your audience and the date.</p>
     <p><a class="bk-btn" href="${L("/contact?about=speaking")}">Book me to speak</a></p>
     ${s.press.length ? `<ul class="bk-press">${s.press.map(([u, l]) => `<li><a class="bk-link" href="${esc(u)}" target="_blank" rel="noopener">${esc(l)}</a></li>`).join("")}</ul>` : ""}`
  )}`;
  return shell(m, ctx, { title: "Speaking", description: s.promise, image: s.image, body, chapter: "speaking" });
}

function writing(m, ctx) {
  const L = (p) => href(ctx, p);
  const body = `${opener("writing", { title: "Writing", lead: m.writing.intro, sections: [["notes", "Notes"], ["books", "Books"]] })}
  ${sec("writing", 1, "notes", "Notes", noteList(L, m.writing.notes))}
  ${sec("writing", 2, "books", "Books", m.books.map(bookBlock).join(""))}`;
  return shell(m, ctx, { title: "Writing", description: m.writing.intro, body, chapter: "writing" });
}

function article(m, ctx) {
  const L = (p) => href(ctx, p);
  const n = ctx.note;
  const list = m.writing.notes.filter((x) => x.internal);
  const i = list.findIndex((x) => x.slug === n.slug);
  const next = list.length > 1 ? list[(i + 1) % list.length] : null;
  const body = `<article class="bk-article">
    <header class="bk-article__head">
      <p class="bk-case__kicker"><a href="${L("/writing")}">05 Writing</a></p>
      <h1 class="bk-article__title">${esc(n.title)}</h1>
      ${n.summary ? `<p class="bk-article__sum">${esc(n.summary)}</p>` : ""}
      ${spec([
        ["Published", esc(fmtDate(n.date))],
        ["Reading time", n.readTime ? `${n.readTime} minutes` : ""],
        ["Filed under", (n.tags || []).map(esc).join(", ")],
      ])}
    </header>
    ${media(n.thumbnail) ? `<figure class="bk-article__cover">${img(n.thumbnail, { width: 2400, eager: true, alt: "" })}</figure>` : ""}
    <div class="bk-article__body">
      ${n.quote ? `<p class="bk-article__quote">${esc(n.quote)}</p>` : ""}
      ${(n.sections || [])
        .map(
          (s) => `${s.heading ? `<h2>${esc(s.heading)}</h2>` : ""}${paras(s.body)}
          ${s.pullQuote ? `<blockquote class="bk-pull">${esc(s.pullQuote)}</blockquote>` : ""}
          ${media(s.image) ? `<figure class="bk-article__img">${img(s.image, { width: 1600, alt: s.image.alt || "" })}</figure>` : ""}`
        )
        .join("")}
    </div>
  </article>
  ${next ? `<section class="bk-next" aria-label="Next note"><p class="bk-quiet">Next note</p><a class="bk-next__a" href="${L(next.path)}">${esc(next.title)}</a></section>` : ""}`;
  return shell(m, ctx, { title: n.title, description: n.summary || n.title, image: n.thumbnail, body, chapter: "writing" });
}

function side(m, ctx) {
  const s = m.side;
  const body = `${opener("side", { title: "On the side", lead: s.intro, sections: [["interests", "What I enjoy"], ["listening", "Listening to"], ["album", "From the album"]] })}
  ${sec(
    "side",
    1,
    "interests",
    "What I enjoy",
    `<ul class="bk-interests">${s.interests.map((x) => `<li><h3>${esc(x.title)}</h3><p>${esc(x.body)}</p></li>`).join("")}</ul>${s.offDutyLine ? `<p class="bk-quiet">${esc(s.offDutyLine)}</p>` : ""}`
  )}
  ${sec(
    "side",
    2,
    "listening",
    "Listening to",
    s.nowPlaying
      ? `<div class="bk-np">${img(s.nowPlaying.cover, { width: 300, alt: "" })}<div><p class="bk-np__song">${esc(s.nowPlaying.song)}</p><p>${esc(s.nowPlaying.artist)}, ${esc(s.nowPlaying.album)}</p>${s.nowPlaying.url ? `<p><a class="bk-link" href="${esc(s.nowPlaying.url)}" target="_blank" rel="noopener">Listen</a></p>` : ""}</div></div>`
      : `<p class="bk-quiet">Nothing on right now.</p>`
  )}
  ${sec(
    "side",
    3,
    "album",
    "From the album",
    `<div class="bk-album">
      ${["chair-gold", "arch-mono", "lawn-stand", "portrait-mono", "doorway-dark", "garden-sun"].map((k, i) => `<figure class="bk-album__f bk-album__f--${i}">${photo(k, { sizes: "(max-width: 900px) 50vw, 25vw" })}</figure>`).join("")}
     </div>
     <p class="bk-note"><span class="bk-note__k">Figs. 6.1 to 6.6</span>${esc(m.photoCredit)}, 2025.</p>`
  )}`;
  return shell(m, ctx, { title: "On the side", description: s.intro, image: "photo:chair-gold", body, chapter: "side" });
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
  const body = `${opener("contact", { title: "Contact", lead: "Tell me what you're working on and how I can help." })}
  <div class="bk-contact">
    <div class="bk-contact__info">
      ${spec([
        ["Email", `<a class="bk-link" href="mailto:${esc(p.email)}">${esc(p.email)}</a>`],
        ["Based in", p.locations.map(esc).join(" and ")],
        ["Elsewhere", p.socials.map((s) => `<a class="bk-link" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join(", ")],
      ])}
      <p class="bk-quiet">The form opens an email to me with your message filled in.</p>
    </div>
    <form class="bk-form" data-mailto="${esc(p.email)}">
      <fieldset class="bk-form__about">
        <legend>What is it about?</legend>
        ${ABOUT.map(([k, l]) => `<label><input type="radio" name="about" value="${k}"${k === about ? " checked" : ""}> ${esc(l)}</label>`).join("")}
      </fieldset>
      <label class="bk-field"><span>Your name</span><input name="name" autocomplete="name" required></label>
      <label class="bk-field"><span>Your email</span><input name="email" type="email" autocomplete="email" required></label>
      <label class="bk-field"><span>Message</span><textarea name="message" rows="7" required></textarea></label>
      <button class="bk-btn" type="submit">Write the email</button>
    </form>
  </div>`;
  return shell(m, ctx, { title: "Contact", body, chapter: "contact" });
}

function index(m, ctx) {
  const L = (p) => href(ctx, p);
  const items = contentIndex(m);
  const groups = [...new Set(items.map((i) => i.type))];
  const body = `<header class="bk-open bk-open--plain"><div class="bk-open__text"><p class="bk-open__kicker">Index</p><h1 class="bk-open__title">Everything in this book</h1><p class="bk-open__lead">Every case study, venture, note, talk and page in one list.</p></div></header>
  <div class="bk-index">${groups
    .map(
      (g) => `<section aria-labelledby="ix-${g}"><h2 class="bk-h3" id="ix-${g}">${esc(g)}</h2><ul>${items
        .filter((i) => i.type === g)
        .map((i) => {
          const h = i.path ? L(i.path) : i.href;
          return `<li><a href="${esc(h || "#")}"${i.path ? "" : extAttrs(h)}><span>${esc(i.title)}</span><span class="bk-quiet">${esc(i.meta || "")}</span></a></li>`;
        })
        .join("")}</ul></section>`
    )
    .join("")}</div>`;
  return shell(m, ctx, { title: "Index", body });
}

function experiments(m, ctx) {
  const L = (p) => href(ctx, p);
  const x = m.experiments;
  const shots = x.shots.map((s) => ({ ...s, m: media(s.media) })).filter((s) => s.m);
  const body = `<header class="bk-open bk-open--plain"><div class="bk-open__text"><p class="bk-open__kicker">Appendix</p><h1 class="bk-open__title">Experiments</h1><p class="bk-open__lead">${esc(x.intro)}</p></div></header>
  ${shots.length ? `<div class="bk-shots">${shots.map((s, i) => `<figure class="bk-shot${s.wide ? " bk-shot--wide" : ""}">${img(s.m, { width: s.wide ? 1600 : 1000, alt: s.title || "" })}<figcaption class="bk-note"><span class="bk-note__k">Plate ${i + 1}</span>${esc(s.title || s.caption || "")}${s.category ? `, ${esc(s.category)}` : ""}</figcaption></figure>`).join("")}</div>` : `<p class="bk-lede">New experiments are on the way.</p>`}`;
  return shell(m, ctx, { title: "Experiments", description: x.intro, body });
}

function notFound(m, ctx) {
  const L = (p) => href(ctx, p);
  const body = `<header class="bk-open bk-open--plain"><div class="bk-open__text"><p class="bk-open__kicker">Page not found</p><h1 class="bk-open__title">This page isn't in the book</h1><p class="bk-open__lead">It may have moved. The contents below list every chapter.</p></div></header>
  <ol class="bk-contents-page__list">${CH.map((c) => `<li><a href="${L(c.path)}"><span class="bk-toc__n">${c.n}</span><span class="bk-contents-page__label">${c.label}</span><span class="bk-contents-page__line">${esc(c.line)}</span></a></li>`).join("")}</ol>`;
  return shell(m, ctx, { title: "Not found", body });
}

const PAGES = { home, about, work, case: caseStudy, ventures, speaking, writing, article, side, contact, index, experiments, notFound };
export function render(key, m, ctx) {
  return (PAGES[key] || notFound)(m, ctx);
}
export { PAGE_CH };
