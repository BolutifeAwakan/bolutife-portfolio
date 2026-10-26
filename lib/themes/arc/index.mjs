// Direction C — The Arc.
// Built on the positioning strategy rather than on a visual conceit: one
// career told as one arc (Make, Lead, Build the conditions), a cover line
// whose three phrases are the doors, proof stated as facts, and speaking
// as a pillar. Deep green and gold sampled from the 2025 portraits;
// Instrument Serif and Instrument Sans, as planned for v2.
// One signature interaction: the cover doors. One scroll device: the arc.

import { esc, img, media } from "../../media.mjs";
import { photo } from "../../photos.mjs";
import { headTags, href, paras, extAttrs, year, fmtDate } from "../../shell.mjs";
import { contentIndex, SECTIONS } from "../../model.mjs";
import { markBook } from "../marks.mjs";

const ORDER = ["work", "ventures", "speaking", "writing", "about", "side", "contact"];
const NAV = ORDER.map((k) => SECTIONS.find((s) => s.key === k));
const navKey = { about: "about", work: "work", case: "work", ventures: "ventures", speaking: "speaking", writing: "writing", article: "writing", side: "side", contact: "contact" };

const timeIn = (tz) => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz });
const clock = (city, tz) => `${city} <time data-tz="${tz}">${timeIn(tz)}</time>`;
const clocks = () => `<span role="group" aria-label="Local time">${clock("Lagos", "Africa/Lagos")}, ${clock("London", "Europe/London")}</span>`;

const DOOR_PHOTO = { make: "chair-gold", lead: "colonnade", build: "garden-sun" };

/* ---------- shell ---------- */

function shell(m, ctx, { title, description, image, body, tone = "deep" }) {
  const L = (p) => href(ctx, p);
  const active = navKey[ctx.pageKey];
  const cur = (k) => (active === k ? ' aria-current="page"' : "");
  return `<!doctype html>
<html lang="en" class="ac">
<head>
${headTags(ctx, { title, description, image, path: ctx.path })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wdth,wght@0,75..100,400..700;1,75..100,400..700&family=Instrument+Serif:ital@0;1&display=swap">
<link rel="stylesheet" href="/assets/arc.css?v=1">
<script src="/assets/arc.js?v=1" defer></script>
</head>
<body class="ac-page ac-page--${ctx.pageKey} ac-tone--${tone}">
<a class="ac-skip" href="#main">Skip to content</a>
<header class="ac-head">
  <a class="ac-head__brand" href="${L("/")}" aria-label="Bolutife Awakan, home">${markBook({ size: 30, title: "" })}<span>Bolutife Awakan</span></a>
  <nav class="ac-head__nav" aria-label="Main"><ul>${NAV.map((s) => `<li><a href="${L(s.path)}"${cur(s.key)}>${s.label}</a></li>`).join("")}</ul></nav>
  <button class="ac-head__menu" type="button" aria-haspopup="dialog" aria-controls="ac-contents">Contents</button>
</header>
<dialog class="ac-contents" id="ac-contents" aria-label="Contents">
  <div class="ac-contents__top"><span>${markBook({ size: 30, title: "" })}</span><button class="ac-contents__close" type="button">Close</button></div>
  <nav aria-label="Contents">
    <div class="ac-contents__col">
      <p class="ac-k">The story</p>
      <ol class="ac-contents__arc">
        <li><a href="${L("/#make")}"><span>I</span>${esc(m.arc.make.title)}</a></li>
        <li><a href="${L("/#lead")}"><span>II</span>${esc(m.arc.lead.title)}</a></li>
        <li><a href="${L("/#build")}"><span>III</span>${esc(m.arc.build.title)}</a></li>
      </ol>
    </div>
    <div class="ac-contents__col">
      <p class="ac-k">Pages</p>
      <ul class="ac-contents__pages">${NAV.map((s) => `<li><a href="${L(s.path)}"${cur(s.key)}>${s.label}</a></li>`).join("")}<li><a href="${L("/experiments")}">Experiments</a></li><li><a href="${L("/index")}">Everything on the site</a></li></ul>
    </div>
  </nav>
  <p class="ac-contents__foot">${clocks()}</p>
</dialog>
<main id="main">
${body}
</main>
${footer(m, ctx)}
</body>
</html>`;
}

const WAYS = [
  ["project", "Brand and creative direction", "Identities, brand systems, campaigns and film."],
  ["leadership", "Design leadership", "Leading design inside your business, or helping your designers lead."],
  ["speaking", "Speaking", "Keynotes, workshops, panels and guest lectures."],
  ["mentoring", "Mentoring", "For designers growing into leadership."],
];

function footer(m, ctx) {
  const L = (p) => href(ctx, p);
  const p = m.person;
  return `<footer class="ac-foot">
  <section class="ac-work-with" aria-labelledby="h-wwm">
    <div class="ac-work-with__head">
      <h2 class="ac-h2" id="h-wwm">Work with me</h2>
      <p class="ac-work-with__mail"><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></p>
      <p class="ac-actions"><a class="ac-btn" href="${L("/contact")}">Send a message</a><a class="ac-btn ac-btn--line" href="${L("/contact?about=speaking")}">Book a talk</a></p>
    </div>
    <ul class="ac-ways">${WAYS.map(([k, t, s]) => `<li><a href="${L(`/contact?about=${k}`)}"><span class="ac-ways__t">${esc(t)}</span><span class="ac-ways__s">${esc(s)}</span></a></li>`).join("")}</ul>
  </section>
  <div class="ac-foot__base">
    <a class="ac-foot__mark" href="${L("/")}" aria-label="Home">${markBook({ size: 56, title: "" })}</a>
    <nav class="ac-foot__nav" aria-label="Footer"><ul>${[...NAV, { path: "/experiments", label: "Experiments" }, { path: "/index", label: "Everything" }].map((s) => `<li><a href="${L(s.path)}">${s.label}</a></li>`).join("")}</ul></nav>
    <ul class="ac-foot__social">${p.socials.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join("")}</ul>
    <div class="ac-foot__meta"><p>${clocks()}</p><p>${esc(m.photoCredit)}</p><p>&copy; Bolutife Awakan ${year()}</p></div>
  </div>
</footer>`;
}

/* ---------- parts ---------- */

const opener = (kicker, title, line, { photoSlug, eager = true } = {}) => `<header class="ac-open${photoSlug ? " ac-open--photo" : ""}">
  <div class="ac-open__text">
    ${kicker ? `<p class="ac-k">${esc(kicker)}</p>` : ""}
    <h1 class="ac-display">${esc(title)}</h1>
    ${line ? `<p class="ac-open__line">${esc(line)}</p>` : ""}
  </div>
  ${photoSlug ? `<figure class="ac-open__photo">${photo(photoSlug, { sizes: "(max-width: 800px) 100vw, 40vw", eager })}</figure>` : ""}
</header>`;

const meta = (...parts) => parts.filter(Boolean).map(esc).join(", ");

function workCard(L, p, { h = "h3", size = "full", eager = false } = {}) {
  return `<article class="ac-work ac-work--${size}">
    <a href="${L(p.path)}">
      <figure class="ac-work__img">${img(p.thumbnail || p.cover, { width: size === "full" ? 2000 : 1200, alt: "", eager })}</figure>
      <div class="ac-work__text">
        <${h} class="ac-work__t">${esc(p.title)}</${h}>
        <p class="ac-work__s">${esc(p.summary)}</p>
        <p class="ac-work__m">${meta(p.services, p.year)}</p>
      </div>
    </a>
  </article>`;
}

function venturePanel(v, { h = "h3", full = false } = {}) {
  return `<article class="ac-venture" id="${esc(v.slug)}" aria-labelledby="v-${esc(v.slug)}">
    <p class="ac-venture__k">${esc(v.kind)}. Founded by Bolutife.</p>
    <${h} class="ac-venture__name" id="v-${esc(v.slug)}">${esc(v.name)}</${h}>
    <p class="ac-venture__line">${esc(v.line)}</p>
    ${full ? `<p class="ac-venture__body">${esc(v.body)}</p>` : ""}
    ${v.offers.length ? `<ul class="ac-venture__offers">${v.offers.map((o) => `<li><span>${esc(o.title)}</span>${full ? `<small>${esc(o.body)}</small>` : ""}</li>`).join("")}</ul>` : ""}
    ${v.url ? `<a class="ac-link" href="${esc(v.url)}" target="_blank" rel="noopener" data-track="venture_click" data-track-target="${esc(v.slug)}">${esc(v.cta)}</a>` : `<p class="ac-venture__soon">Its own website is on the way.</p>`}
  </article>`;
}

const bookBlock = (b, h = "h3") => `<div class="ac-book">
  <div class="ac-book__cover" aria-hidden="true"><span>${esc(b.title)}</span><small>Bolutife Awakan</small></div>
  <div>
    <p class="ac-k">The book</p>
    <${h} class="ac-book__t">${esc(b.title)}</${h}>
    <p class="ac-book__s">${esc(b.line)}</p>
    ${b.url ? `<a class="ac-link" href="${esc(b.url)}" target="_blank" rel="noopener" data-track="book_click" data-track-target="book">${esc(b.cta)}</a>` : ""}
  </div>
</div>`;

function noteList(L, notes, { limit, h = "h3" } = {}) {
  const list = limit ? notes.slice(0, limit) : notes;
  return `<ol class="ac-notes">${list
    .map((n) => {
      const u = n.path ? L(n.path) : n.href || "#";
      return `<li><a href="${esc(u)}"${n.path ? "" : extAttrs(u)}>
        <span class="ac-notes__d">${esc(n.date ? fmtDate(n.date) : "")}</span>
        <${h} class="ac-notes__t">${esc(n.title)}</${h}>
        <span class="ac-notes__s">${esc(n.summary || "")}</span>
      </a></li>`;
    })
    .join("")}</ol>`;
}

const quote = (t, cls = "") => (t ? `<figure class="ac-quote ${cls}"><blockquote><p>${esc(t.quote)}</p></blockquote><figcaption>${esc(t.name)}<span>${esc(t.role)}</span></figcaption></figure>` : "");

/* ---------- home ---------- */

function home(m, ctx) {
  const L = (p) => href(ctx, p);
  const p = m.person;
  const doors = p.cover.doors;
  const orgs = [...new Set([...m.about.experience.map((x) => x.org.split(" / ")[0]), "Mavin", ...m.work.all.map((w) => w.title)])];
  const credits = (m.about.path.find((s) => /entertainment/i.test(s.when)) || {}).text;
  const leadQuote = m.about.testimonials.find((t) => /lead|partner|team/i.test(t.quote)) || m.about.testimonials[0];

  const body = `
<section class="ac-cover" aria-labelledby="ac-cover-h" data-doors>
  <div class="ac-cover__text">
    <h1 class="ac-cover__h" id="ac-cover-h">
      <span class="ac-cover__lead">${esc(p.cover.lead)}</span>
      <span class="ac-cover__doors">in ${doors.map((d, i) => `<a href="#${d.key}" data-door="${d.key}">${esc(d.text)}</a>${i === 0 ? ", " : i === 1 ? ", and " : "."}`).join("")}</span>
    </h1>
    <p class="ac-cover__sub">${esc(p.headline)}</p>
  </div>
  <figure class="ac-cover__photo">
    <div class="ac-cover__frames">
      <div class="ac-frame is-on" data-frame="default">${photo("steps-smile", { sizes: "(max-width: 800px) 100vw, 42vw", eager: true })}</div>
      ${doors.map((d) => `<div class="ac-frame" data-frame="${d.key}" aria-hidden="true">${photo(DOOR_PHOTO[d.key], { sizes: "(max-width: 800px) 100vw, 42vw", alt: "" })}</div>`).join("")}
    </div>
    <figcaption class="ac-cover__proof" aria-live="polite"><span data-proof="default">${esc(p.identity.join(", "))}</span>${doors.map((d) => `<span data-proof="${d.key}" hidden>${esc(d.proof)}</span>`).join("")}</figcaption>
  </figure>
  <dl class="ac-now">
    ${p.now.map((n) => `<div><dt>${esc(n.label)}</dt><dd>${esc(n.text)}</dd></div>`).join("")}
    <div><dt>Based</dt><dd>${clocks()}</dd></div>
  </dl>
  <p class="ac-cover__go"><a class="ac-btn ac-btn--gold" href="${L("/contact?about=leadership")}">Work with me</a><a class="ac-btn ac-btn--line" href="${L("/contact?about=speaking")}">Book a talk</a></p>
</section>

<section class="ac-proof" aria-labelledby="h-proof">
  <h2 class="ac-k" id="h-proof">Brands and teams I've worked with</h2>
  <ul class="ac-proof__names">${orgs.map((o) => `<li>${esc(o)}</li>`).join("")}</ul>
  <ul class="ac-proof__awards">${m.about.awards.map((a) => `<li><strong>${esc(a.title)}</strong> ${esc(a.org)}, ${esc(a.year)}</li>`).join("")}</ul>
</section>

<div class="ac-arc">
  <nav class="ac-rail" aria-label="The story"><ol>
    <li><a href="#make" data-rail="make"><span>I</span>${esc(m.arc.make.title)}</a></li>
    <li><a href="#lead" data-rail="lead"><span>II</span>${esc(m.arc.lead.title)}</a></li>
    <li><a href="#build" data-rail="build"><span>III</span>${esc(m.arc.build.title)}</a></li>
  </ol></nav>

  <section class="ac-act" id="make" aria-labelledby="h-make" data-act="make">
    <header class="ac-act__head">
      <p class="ac-act__n" aria-hidden="true">I</p>
      <h2 class="ac-act__t" id="h-make">${esc(m.arc.make.title)}</h2>
      <p class="ac-act__line">${esc(m.arc.make.line)}</p>
      <a class="ac-link" href="${L("/work")}">All ${m.work.all.length} case studies</a>
    </header>
    <div class="ac-act__body">
      ${m.work.featured.map((w, i) => workCard(L, w, { size: i === 0 ? "full" : "half" })).join("")}
      ${credits ? `<p class="ac-credits"><span class="ac-k">Where it started</span>${esc(credits)}</p>` : ""}
    </div>
  </section>

  <section class="ac-act" id="lead" aria-labelledby="h-lead" data-act="lead">
    <header class="ac-act__head">
      <p class="ac-act__n" aria-hidden="true">II</p>
      <h2 class="ac-act__t" id="h-lead">${esc(m.arc.lead.title)}</h2>
      <p class="ac-act__line">${esc(m.arc.lead.line)}</p>
      <a class="ac-link" href="${L("/about")}">My story</a>
    </header>
    <div class="ac-act__body">
      <blockquote class="ac-belief"><p>${esc(m.practice.belief)}</p></blockquote>
      <ul class="ac-areas">${m.practice.areas.map((a) => `<li><h3>${esc(a.title)}</h3><p>${esc(a.body)}</p></li>`).join("")}</ul>
      <figure class="ac-act__photo">${photo("portrait-mono", { sizes: "(max-width: 800px) 100vw, 50vw" })}<figcaption>${esc(m.practice.operator)}</figcaption></figure>
      <div class="ac-led">
        <h3 class="ac-k">Where I've led</h3>
        <ul>${m.about.experience.slice(0, 4).map((x) => `<li><span>${esc(x.role)}</span>${esc(x.org)}</li>`).join("")}</ul>
      </div>
      ${quote(leadQuote)}
    </div>
  </section>

  <section class="ac-act" id="build" aria-labelledby="h-build" data-act="build">
    <header class="ac-act__head">
      <p class="ac-act__n" aria-hidden="true">III</p>
      <h2 class="ac-act__t" id="h-build">${esc(m.arc.build.title)}</h2>
      <p class="ac-act__line">${esc(m.arc.build.line)}</p>
      <a class="ac-link" href="${L("/ventures")}">The ventures</a>
    </header>
    <div class="ac-act__body">
      <div class="ac-ventures">${m.ventures.map((v) => venturePanel(v)).join("")}</div>
      <p class="ac-mentor"><span class="ac-mentor__n">15</span><span class="ac-mentor__t">${esc(m.mentoring)}</span></p>
      ${m.books.map((b) => bookBlock(b)).join("")}
    </div>
  </section>
</div>

<section class="ac-stage" aria-labelledby="h-stage">
  <figure class="ac-stage__img">${m.speaking.image ? img(m.speaking.image, { width: 2400, alt: "Bolutife speaking on stage" }) : photo("colonnade", { sizes: "100vw" })}</figure>
  <div class="ac-stage__text">
    <p class="ac-k">On stage</p>
    <h2 class="ac-display ac-display--stage" id="h-stage">${esc(m.speaking.headline)}</h2>
    <p class="ac-stage__line">${esc(m.speaking.promise)}</p>
    <ol class="ac-tracks">${m.speaking.tracks.map((t) => `<li>${esc(t.title)}</li>`).join("")}</ol>
    <p class="ac-actions"><a class="ac-btn ac-btn--gold" href="${L("/contact?about=speaking")}">Book me to speak</a><a class="ac-btn ac-btn--line" href="${L("/speaking")}">Topics and talks</a></p>
  </div>
</section>

<section class="ac-sec ac-sec--notes" aria-labelledby="h-notes">
  <div class="ac-sec__head"><h2 class="ac-h2" id="h-notes">Field notes</h2><p class="ac-sec__line">${esc(m.writing.intro)}</p><a class="ac-link" href="${L("/writing")}">All writing</a></div>
  ${noteList(L, m.writing.notes, { limit: 3 })}
</section>

<section class="ac-side" aria-labelledby="h-side">
  <figure class="ac-side__a">${photo("lawn-crouch", { sizes: "(max-width: 800px) 60vw, 26vw" })}</figure>
  <figure class="ac-side__b">${photo("arch-mono", { sizes: "(max-width: 800px) 40vw, 18vw" })}</figure>
  <div class="ac-side__text">
    <p class="ac-k">On the side</p>
    <h2 class="ac-h2" id="h-side">Away from work</h2>
    <p class="ac-side__line">${esc(m.side.intro)}</p>
    <ul class="ac-side__list">${m.side.interests.map((x) => `<li>${esc(x.title)}</li>`).join("")}</ul>
    ${m.side.nowPlaying ? `<p class="ac-side__np"><span class="ac-k">On repeat</span>${esc(m.side.nowPlaying.song)}, ${esc(String(m.side.nowPlaying.artist).replace(/\.$/, ""))}</p>` : ""}
    <a class="ac-link" href="${L("/on-the-side")}">More about life outside work</a>
  </div>
</section>`;
  return shell(m, ctx, { body, image: "photo:steps-smile" });
}

/* ---------- pages ---------- */

function about(m, ctx) {
  const L = (p) => href(ctx, p);
  const a = m.about;
  const all = a.paragraphs.join("\n\n");
  const first = all.split(/(?<=[.!?])\s+/).slice(0, 2).join(" ");
  const rest = all.slice(first.length).trim().split(/\n\n/).filter(Boolean);
  const table = (rows) => `<ul class="ac-table">${rows.map(([y, t, o]) => `<li><span class="ac-table__y">${esc(y)}</span><span class="ac-table__t">${esc(t)}</span>${o ? `<span class="ac-table__o">${esc(o)}</span>` : ""}</li>`).join("")}</ul>`;
  const body = `${opener("Identity", "About", m.person.identity.join(", ") + ".", { photoSlug: "steps-seated" })}
  <section class="ac-sec ac-sec--narrow">
    <p class="ac-lead">${esc(first)}</p>
    ${rest.map((t) => `<p class="ac-p">${esc(t)}</p>`).join("")}
  </section>
  <section class="ac-sec" aria-labelledby="h-path">
    <div class="ac-sec__head"><h2 class="ac-h2" id="h-path">The path</h2></div>
    <ol class="ac-path">${a.path.map((s, i) => `<li><span class="ac-path__n">${["I", "II", "III", "IV", "V", "VI"][i] || i + 1}</span><h3>${esc(s.when)}</h3><p>${esc(s.text)}</p></li>`).join("")}</ol>
  </section>
  <section class="ac-sec" aria-labelledby="h-believe">
    <div class="ac-sec__head"><h2 class="ac-h2" id="h-believe">What I believe</h2></div>
    <blockquote class="ac-belief ac-belief--wide"><p>${esc(m.practice.belief)}</p></blockquote>
    <p class="ac-p ac-p--aside">${esc(m.practice.operator)}</p>
    <ul class="ac-areas">${m.practice.areas.map((x) => `<li><h3>${esc(x.title)}</h3><p>${esc(x.body)}</p></li>`).join("")}</ul>
    <h3 class="ac-k ac-k--gap">Services</h3>
    <ul class="ac-areas">${m.practice.services.map((s) => `<li><h4>${esc(s.title)}</h4><p>${esc(s.body)}</p></li>`).join("")}</ul>
  </section>
  <section class="ac-sec" aria-labelledby="h-record">
    <div class="ac-sec__head"><h2 class="ac-h2" id="h-record">The record</h2></div>
    <div class="ac-record">
      <div><h3 class="ac-k">Experience</h3>${table(a.experience.map((x) => [String(x.period || "").replace(/[()]/g, ""), x.role, x.org]))}</div>
      <div><h3 class="ac-k">Education</h3>${table(a.education.map((x) => [x.year, x.title, x.org]))}</div>
      <div><h3 class="ac-k">Recognition</h3>${table(a.awards.map((x) => [x.year, x.title, x.org]))}</div>
      <div><h3 class="ac-k">Milestones</h3>${table(a.career.map((x) => [x.year, x.text]))}<p class="ac-p">${esc(m.mentoring)}</p></div>
    </div>
  </section>
  <section class="ac-sec" aria-labelledby="h-say">
    <div class="ac-sec__head"><h2 class="ac-h2" id="h-say">What clients say</h2></div>
    <div class="ac-quotes">${a.testimonials.map((t) => quote(t)).join("")}</div>
  </section>`;
  return shell(m, ctx, { title: "About", description: m.person.supporting, image: "photo:steps-seated", body });
}

function work(m, ctx) {
  const L = (p) => href(ctx, p);
  const body = `${opener(m.arc.make.title, "Work", m.arc.make.line)}
  <section class="ac-sec ac-sec--flush" aria-label="All case studies"><div class="ac-grid">${m.work.all.map((p, i) => workCard(L, p, { h: "h2", size: i % 3 === 0 ? "full" : "half", eager: i === 0 })).join("")}</div></section>`;
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
    return `<div class="ac-gallery">${items.map((im) => `<figure class="ac-g ac-g--${im.size === "half" ? "half" : "full"}">${img(im, { width: im.size === "half" ? 1400 : 2400 })}</figure>`).join("")}</div>`;
  };
  const rows = [["Client", p.client], ["Sector", p.services], ["Year", p.year], ["Scope", (p.tags || []).join(", ")]].filter(([, v]) => v);
  const body = `<article class="ac-case">
    <header class="ac-case__head">
      <p class="ac-k"><a href="${L("/work")}">Work</a>, case study ${idx + 1} of ${m.work.all.length}</p>
      <h1 class="ac-display">${esc(p.title)}</h1>
      <p class="ac-case__s">${esc(p.summary)}</p>
      <dl class="ac-spec">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
    </header>
    ${p.cover ? `<figure class="ac-case__cover">${img(p.cover, { width: 2400, eager: true, alt: p.title })}</figure>` : ""}
    ${p.intro ? `<div class="ac-case__intro">${paras(p.intro)}</div>` : ""}
    ${(p.sections || [])
      .map(
        (s) => `<section class="ac-case__sec">
        ${s.heading || s.body ? `<div class="ac-case__text">${s.heading ? `<h2>${esc(s.heading)}</h2>` : "<span></span>"}<div>${paras(s.body)}</div></div>` : ""}
        ${gallery(s.images)}
      </section>`
      )
      .join("")}
  </article>
  <nav class="ac-next" aria-label="Next case study"><a href="${L(next.path)}"><span class="ac-k">Next case study</span><span class="ac-next__t">${esc(next.title)}</span><span class="ac-next__s">${esc(next.summary)}</span></a></nav>`;
  return shell(m, ctx, { title: p.title, description: p.summary, image: p.thumbnail || p.cover, body, tone: "light" });
}

function ventures(m, ctx) {
  const L = (p) => href(ctx, p);
  const body = `${opener(m.arc.build.title, "Ventures", "Alongside my design leadership work, I founded two organisations. Each has its own name, identity and team.")}
  <section class="ac-sec ac-sec--flush"><div class="ac-ventures ac-ventures--full">${m.ventures.map((v) => venturePanel(v, { h: "h2", full: true })).join("")}</div></section>
  <section class="ac-sec" id="mentoring" aria-labelledby="h-mentor">
    <div class="ac-sec__head"><h2 class="ac-h2" id="h-mentor">Mentoring</h2></div>
    <p class="ac-mentor"><span class="ac-mentor__n">15</span><span class="ac-mentor__t">${esc(m.mentoring)}</span></p>
    <p class="ac-actions"><a class="ac-btn ac-btn--gold" href="${L("/contact?about=mentoring")}">Ask about mentoring</a></p>
  </section>
  <section class="ac-sec" aria-labelledby="h-books">
    <div class="ac-sec__head"><h2 class="ac-h2" id="h-books">Books</h2></div>
    ${m.books.map((b) => bookBlock(b)).join("")}
  </section>`;
  return shell(m, ctx, { title: "Ventures", description: m.ventures.map((v) => `${v.name}: ${v.line}`).join(" "), body });
}

function speaking(m, ctx) {
  const L = (p) => href(ctx, p);
  const s = m.speaking;
  const body = `<section class="ac-stage ac-stage--page">
    <figure class="ac-stage__img">${s.image ? img(s.image, { width: 2400, eager: true, alt: "Bolutife speaking on stage" }) : photo("colonnade", { sizes: "100vw", eager: true })}</figure>
    <div class="ac-stage__text">
      <p class="ac-k">Speaking</p>
      <h1 class="ac-display ac-display--stage">${esc(s.headline)}</h1>
      <p class="ac-stage__line">${esc(s.promise)}</p>
      <p class="ac-actions"><a class="ac-btn ac-btn--gold" href="${L("/contact?about=speaking")}">Book me to speak</a></p>
    </div>
  </section>
  <section class="ac-sec ac-sec--narrow">
    <p class="ac-lead">${esc(s.intro)}</p>
    <p class="ac-p">Formats: ${s.formats.map((f) => esc(f.toLowerCase())).join(", ")}.</p>
  </section>
  <section class="ac-sec" aria-labelledby="h-tracks">
    <div class="ac-sec__head"><h2 class="ac-h2" id="h-tracks">Four tracks</h2></div>
    <ol class="ac-trackrows">${s.tracks.map((t, i) => `<li><span class="ac-trackrows__n">${i + 1}</span><h3>${esc(t.title)}</h3><p>${esc(t.body)}</p></li>`).join("")}</ol>
  </section>
  <section class="ac-sec" id="talks" aria-labelledby="h-talks">
    <div class="ac-sec__head"><h2 class="ac-h2" id="h-talks">Talks</h2></div>
    <ul class="ac-talks">${s.talks.map((t) => `<li><h3>${esc(t.title)}</h3><p>${meta(t.track, t.event)}</p></li>`).join("")}</ul>
  </section>
  <section class="ac-sec" aria-labelledby="h-where">
    <div class="ac-sec__head"><h2 class="ac-h2" id="h-where">Where I've spoken</h2></div>
    <ul class="ac-talks">${s.appearances.map((a) => `<li><h3>${esc(a.title)}</h3><p>${esc(a.body)}</p></li>`).join("")}</ul>
    ${s.photos.length ? `<div class="ac-reel">${s.photos.map((ph) => `<figure>${img(ph, { width: 1200, alt: "" })}</figure>`).join("")}</div>` : ""}
    ${s.press.length ? `<p class="ac-actions">${s.press.map(([u, l]) => `<a class="ac-btn ac-btn--line" href="${esc(u)}" target="_blank" rel="noopener">${esc(l)}</a>`).join("")}</p>` : ""}
  </section>`;
  return shell(m, ctx, { title: "Speaking", description: s.promise, image: s.image, body });
}

function writing(m, ctx) {
  const L = (p) => href(ctx, p);
  const body = `${opener("Field notes", "Writing", m.writing.intro)}
  <section class="ac-sec ac-sec--flush" aria-label="Notes">${noteList(L, m.writing.notes, { h: "h2" })}</section>
  <section class="ac-sec" id="books" aria-labelledby="h-books"><div class="ac-sec__head"><h2 class="ac-h2" id="h-books">Books</h2></div>${m.books.map((b) => bookBlock(b)).join("")}</section>`;
  return shell(m, ctx, { title: "Writing", description: m.writing.intro, body });
}

function article(m, ctx) {
  const L = (p) => href(ctx, p);
  const n = ctx.note;
  const list = m.writing.notes.filter((x) => x.internal);
  const i = list.findIndex((x) => x.slug === n.slug);
  const next = list.length > 1 ? list[(i + 1) % list.length] : null;
  const body = `<article class="ac-article">
    <header class="ac-article__head">
      <p class="ac-k"><a href="${L("/writing")}">Field notes</a>${(n.tags || []).length ? `, ${n.tags.map(esc).join(", ")}` : ""}</p>
      <h1 class="ac-display ac-display--article">${esc(n.title)}</h1>
      ${n.summary ? `<p class="ac-case__s">${esc(n.summary)}</p>` : ""}
      <p class="ac-article__by">By Bolutife Awakan${n.date ? `, ${esc(fmtDate(n.date))}` : ""}${n.readTime ? `. ${n.readTime} minute read` : ""}</p>
    </header>
    ${media(n.thumbnail) ? `<figure class="ac-article__cover">${img(n.thumbnail, { width: 2400, eager: true, alt: "" })}</figure>` : ""}
    <div class="ac-read">
      ${n.quote ? `<p class="ac-read__quote">${esc(n.quote)}</p>` : ""}
      ${(n.sections || [])
        .map(
          (s) => `${s.heading ? `<h2>${esc(s.heading)}</h2>` : ""}${paras(s.body)}
          ${s.pullQuote ? `<blockquote class="ac-pull"><p>${esc(s.pullQuote)}</p></blockquote>` : ""}
          ${media(s.image) ? `<figure class="ac-read__img">${img(s.image, { width: 1600, alt: s.image.alt || "" })}</figure>` : ""}`
        )
        .join("")}
    </div>
  </article>
  ${next ? `<nav class="ac-next" aria-label="Next note"><a href="${L(next.path)}"><span class="ac-k">Next field note</span><span class="ac-next__t">${esc(next.title)}</span><span class="ac-next__s">${esc(next.summary || "")}</span></a></nav>` : ""}`;
  return shell(m, ctx, { title: n.title, description: n.summary || n.title, image: n.thumbnail, body, tone: "light" });
}

const SHEET = ["steps-smile", "colonnade", "garden-sun", "lawn-stand", "arch-mono", "portrait-mono", "stairs-dark", "doorway-dark", "lawn-crouch", "chair-gold", "steps-seated", "arch-white", "textile-dark"];

function side(m, ctx) {
  const s = m.side;
  const body = `${opener("On the side", "Away from work", s.intro, { photoSlug: "garden-sun" })}
  <section class="ac-sec" aria-labelledby="h-enjoy">
    <div class="ac-sec__head"><h2 class="ac-h2" id="h-enjoy">What I enjoy</h2></div>
    <ul class="ac-enjoy">${s.interests.map((x) => `<li><h3>${esc(x.title)}</h3><p>${esc(x.body)}</p></li>`).join("")}</ul>
    ${s.offDutyLine ? `<p class="ac-p ac-p--aside">${esc(s.offDutyLine)}</p>` : ""}
  </section>
  ${s.nowPlaying ? `<section class="ac-sec" aria-labelledby="h-np"><div class="ac-np">${img(s.nowPlaying.cover, { width: 500, alt: `${s.nowPlaying.album} cover` })}<div><h2 class="ac-k" id="h-np">On repeat</h2><p class="ac-np__song">${esc(s.nowPlaying.song)}</p><p>${esc(s.nowPlaying.artist)}, from ${esc(s.nowPlaying.album)}</p>${s.nowPlaying.url ? `<a class="ac-link" href="${esc(s.nowPlaying.url)}" target="_blank" rel="noopener">Listen</a>` : ""}</div></div></section>` : ""}
  <section class="ac-sec" aria-labelledby="h-sheet">
    <div class="ac-sec__head"><h2 class="ac-h2" id="h-sheet">Contact sheet</h2><p class="ac-sec__line">${esc(m.photoCredit)}</p></div>
    <ul class="ac-sheet">${SHEET.map((k) => `<li>${photo(k, { sizes: "(max-width: 800px) 50vw, 25vw" })}</li>`).join("")}</ul>
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
  const body = `${opener("Work with me", "Let's talk", "Tell me what you're working on and how I can help.")}
  <section class="ac-sec ac-sec--flush ac-contact">
    <form class="ac-form" data-mailto="${esc(p.email)}">
      <fieldset class="ac-form__about">
        <legend>What is it about?</legend>
        ${ABOUT.map(([k, l]) => `<label><input type="radio" name="about" value="${k}"${k === about ? " checked" : ""}><span>${esc(l)}</span></label>`).join("")}
      </fieldset>
      <label class="ac-field"><span>Your name</span><input name="name" autocomplete="name" required></label>
      <label class="ac-field"><span>Your email</span><input name="email" type="email" autocomplete="email" required></label>
      <label class="ac-field"><span>Message</span><textarea name="message" rows="5" required></textarea></label>
      <button class="ac-btn ac-btn--gold" type="submit">Open an email draft</button>
      <p class="ac-note">The form opens an email to me with your message filled in.</p>
    </form>
    <dl class="ac-spec ac-spec--stack">
      <div><dt>Email</dt><dd><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></dd></div>
      <div><dt>Based in</dt><dd>${p.locations.map(esc).join(" and ")}. ${clocks()}</dd></div>
      <div><dt>Elsewhere</dt><dd>${p.socials.map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join(", ")}</dd></div>
      <div><dt>Ventures</dt><dd>${m.ventures.map((v) => (v.url ? `<a href="${esc(v.url)}" target="_blank" rel="noopener" data-track="venture_click" data-track-target="${esc(v.slug)}">${esc(v.name)}</a>` : esc(v.name))).join(" and ")} have their own teams and contacts.</dd></div>
    </dl>
  </section>`;
  return shell(m, ctx, { title: "Contact", body });
}

function index(m, ctx) {
  const L = (p) => href(ctx, p);
  const items = contentIndex(m);
  const groups = [...new Set(items.map((i) => i.type))];
  const body = `${opener("Contents", "Everything", "Every case study, venture, note, talk and page on the site.")}
  <section class="ac-sec ac-sec--flush"><div class="ac-index">${groups
    .map(
      (g) => `<div><h2 class="ac-k">${esc(g)}</h2><ul>${items
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
  const body = `${opener("Experiments", "Experiments", x.intro)}
  <section class="ac-sec ac-sec--flush">${shots.length ? `<div class="ac-shots">${shots.map((s) => `<figure class="ac-shot">${img(s.m, { width: 1200, alt: s.title || "" })}<figcaption><strong>${esc(s.title || "")}</strong> ${esc(s.caption || "")}</figcaption></figure>`).join("")}</div>` : `<p class="ac-lead">New experiments are on the way.</p>`}</section>`;
  return shell(m, ctx, { title: "Experiments", description: x.intro, body });
}

function notFound(m, ctx) {
  const L = (p) => href(ctx, p);
  const body = `${opener("Not found", "This page isn't here", "It has moved or never existed. Everything else is a click away.")}
  <section class="ac-sec ac-sec--flush"><ul class="ac-lost">${NAV.map((s) => `<li><a href="${L(s.path)}">${s.label}</a></li>`).join("")}</ul></section>`;
  return shell(m, ctx, { title: "Not found", body });
}

const PAGES = { home, about, work, case: caseStudy, ventures, speaking, writing, article, side, contact, index, experiments, notFound };
export function render(key, m, ctx) {
  return (PAGES[key] || notFound)(m, ctx);
}
