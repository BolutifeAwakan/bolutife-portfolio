// The shared content layer. Both design directions render from this one
// model, so a project, note or venture published once appears in both.
// Sanity content (lib/content.mjs) is the source; content/v2.mjs fills the
// fields Sanity doesn't hold yet.

import v2 from "../content/v2.mjs";
import thoughts from "../content/thoughts.mjs";
import { photos } from "./photos.mjs";

const pick = (a, b) => (a === undefined || a === null || (Array.isArray(a) && !a.length) || a === "" ? b : a);

export function buildModel(c) {
  const s = c.settings || {};
  const x = { ...v2, ...(s.v2 || {}) }; // Sanity can override any v2 field under settings.v2

  const notes = (c.notes || []).map((raw) => {
    // Her full essays (content/thoughts.mjs) replace the short CMS drafts. The
    // CMS dates were placeholders, so no date or reading time is shown.
    // Fall back to the last part of the old note URL when the CMS copy has no slug.
    if (!raw.slug && raw.url) raw = { ...raw, slug: raw.url.split("/").filter(Boolean).pop() };
    const t = thoughts[raw.slug];
    const n = t ? { ...raw, ...t, date: null, readTime: null } : raw;
    const internal = !!(n.slug && (n.sections || []).length);
    return {
      ...n,
      internal,
      path: internal ? `/writing/${n.slug}` : null,
      href: internal ? null : n.url || null,
      readTime: readTime(n),
    };
  });

  const projects = (c.projects || []).map((p) => ({ ...p, path: `/work/${p.slug}` }));
  const featured = projects.filter((p) => p.featured);

  return {
    person: {
      name: s.name || "Bolutife Awakan",
      first: (s.name || "Bolutife Awakan").split(" ")[0],
      last: (s.name || "Bolutife Awakan").split(" ").slice(1).join(" "),
      identity: x.identity,
      base: x.base,
      intro: x.intro,
      headline: x.headline,
      cover: x.cover,
      now: x.now || [],
      supporting: x.supporting,
      email: s.email,
      locations: s.locations || [],
      socials: s.socials || [],
      portrait: s.portrait,
      aboutPortrait: s.aboutPortrait,
    },
    photos,
    photoCredit: x.photoCredit,
    practice: { belief: x.belief, operator: x.operator, areas: x.practice, services: c.services || [] },
    work: { all: projects, featured: featured.length ? featured : projects.slice(0, 3), clientLogos: s.clientLogos || [], summaries: x.projectSummaries || {} },
    arc: x.arc,
    ventures: x.ventures,
    venturesIntro: x.venturesIntro,
    books: x.books,
    shop: { intro: x.shopIntro, storeUrl: x.storeUrl },
    newsletter: { url: s.newsletterUrl || "", blurb: s.newsletterBlurb || "" },
    contactLine: x.contactLine,
    bookingUrl: s.bookingUrl || x.bookingUrl || "",
    mentoring: x.mentoring,
    writing: { notes, intro: x.thoughtsIntro },
    speaking: {
      intro: s.speakingIntro,
      promise: x.speaking.promise,
      support: x.speaking.support,
      headline: x.stagePromise,
      tracks: x.speaking.tracks,
      talks: x.speaking.talks,
      formats: x.speaking.formats,
      appearances: lines(s.appearances),
      image: s.speakingImage,
      photos: s.speakingPhotos || [],
      press: [
        [s.bioUrl, "Professional bio"],
        [s.headshotsUrl, "Headshots"],
        [s.pressKitUrl, "Press kit"],
      ].filter(([u]) => u),
    },
    about: {
      paragraphs: s.aboutParagraphs || [],
      path: x.path,
      career: s.career || [],
      education: s.education || [],
      experience: s.experience || [],
      awards: c.awards || [],
      testimonials: (c.testimonials || []).map((t) => ({ ...t, quote: String(t.quote || "").trim().replace(/^["“]|["”]$/g, "") })),
    },
    side: {
      intro: x.side.intro,
      interests: x.side.interests,
      nowPlaying: s.nowPlaying && s.nowPlaying.song ? s.nowPlaying : null,
      offDutyLine: s.offDutyLine,
      photos: s.aboutPhotos || [],
    },
    experiments: { title: "Experiments", intro: x.experimentsIntro.join(" "), introParas: x.experimentsIntro, kinds: x.experimentsKinds, shots: c.shots || [], categories: c.shotCategories || [] },
    footerLine: s.footerLine,
  };
}

function lines(t = "") {
  return String(t || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [title, ...rest] = l.split(" — ");
      return { title: title.trim(), body: rest.join(" — ").replace(/\.$/, "").trim() };
    });
}

function readTime(n) {
  if (n.readTime) return n.readTime;
  const words = (n.sections || []).reduce((t, s) => t + String(s.body || "").split(/\s+/).length + String(s.pullQuote || "").split(/\s+/).length, 0);
  return words ? Math.max(1, Math.round(words / 200)) : null;
}

// The site's sections, in the order both directions present them.
// `key` is the analytics and routing name; `path` is the canonical URL.
export const SECTIONS = [
  { key: "about", path: "/about", label: "About" },
  { key: "work", path: "/work", label: "Work" },
  { key: "ventures", path: "/ventures", label: "Ventures" },
  { key: "speaking", path: "/speaking", label: "Speaking" },
  { key: "writing", path: "/writing", label: "Writing" },
  { key: "side", path: "/on-the-side", label: "On the side" },
  { key: "contact", path: "/contact", label: "Contact" },
];

// Everything on the site in one list, for the content index page.
export function contentIndex(m) {
  return [
    ...m.work.all.map((p) => ({ type: "Case study", title: p.title, meta: p.year, path: p.path })),
    ...m.ventures.map((v) => ({ type: "Venture", title: v.name, meta: v.role, path: `/ventures#${v.slug}` })),
    ...m.books.map((b) => ({ type: "Book", title: b.title, meta: b.role, path: `/writing#books` })),
    ...m.writing.notes.map((n) => ({ type: "Writing", title: n.title, meta: n.date ? n.date.slice(0, 4) : "", path: n.path, href: n.href })),
    ...m.speaking.talks.map((t) => ({ type: "Talk", title: t.title, meta: t.event || "", path: "/speaking#talks" })),
    ...SECTIONS.map((s) => ({ type: "Page", title: s.label, meta: "", path: s.path })),
    { type: "Page", title: m.experiments.title, meta: "", path: "/experiments" },
  ];
}
