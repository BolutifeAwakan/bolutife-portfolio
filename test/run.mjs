// Checks that both directions are complete and comparable. No dependencies.
//   node test/run.mjs
// Uses the offline seed content so it runs anywhere.

process.env.SANITY_PROJECT_ID = "";
const { route } = await import("../lib/router.mjs");
const { resolve, config } = await import("../lib/experiment.mjs");
const { getContent } = await import("../lib/content.mjs");
const { buildModel, contentIndex } = await import("../lib/model.mjs");

let failed = 0;
const ok = (cond, msg) => {
  if (!cond) { failed++; console.log("  FAIL", msg); }
};
const strip = (h) => h.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/\s+/g, " ");

const c = await getContent();
const m = buildModel(c);
const pages = ["/", "/work", "/about", "/ventures", "/speaking", "/writing", "/on-the-side", "/contact", "/index", "/experiments", ...m.work.all.map((p) => p.path)];

console.log("1. Every page renders in both directions, with the same essential content");
const must = {
  "/": [m.person.headline, ...m.work.featured.map((p) => p.title), ...m.ventures.map((v) => v.name), m.books[0].title, m.person.email],
  "/work": m.work.all.map((p) => p.title),
  "/about": [m.practice.belief, ...m.about.experience.map((x) => x.org), ...m.about.awards.map((a) => a.title)],
  "/ventures": m.ventures.flatMap((v) => [v.name, v.line, ...v.offers.map((o) => o.title)]),
  "/speaking": [m.speaking.promise, ...m.speaking.tracks.map((t) => t.title), ...m.speaking.talks.map((t) => t.title)],
  "/writing": [...m.writing.notes.map((n) => n.title), m.books[0].title],
  "/on-the-side": m.side.interests.map((i) => i.title),
  "/contact": [m.person.email, "Speaking at an event"],
  "/index": contentIndex(m).map((i) => i.title),
};
must["/thoughts"] = must["/writing"];
must["/shop"] = m.books.map((b) => b.title);
must["/shop/worth-the-work"] = ["Worth the Work", ...m.books[0].editions.map((e) => e.price)];
const editorialPages = [
  ...pages.map((p) => (p === "/writing" ? "/thoughts" : p)),
  "/shop", "/shop/worth-the-work", "/shop/signature",
  ...m.writing.notes.filter((n) => n.internal).map((n) => `/thoughts/${n.slug}`),
];
for (const dir of ["brand-book", "personal-editorial", "the-book"]) {
  for (const p of dir === "personal-editorial" ? editorialPages : pages) {
    const out = await route(`/preview/${dir}${p === "/" ? "" : p}`, {}, {});
    ok(out.status === 200, `${dir} ${p} returned ${out.status}`);
    if (out.status !== 200) continue;
    const text = strip(out.html);
    for (const s of must[p] || []) ok(text.includes(strip(s)), `${dir} ${p} is missing "${s.slice(0, 50)}"`);
    ok(/<h1[\s>]/.test(out.html), `${dir} ${p} has no h1`);
    ok(out.html.includes('href="#main"'), `${dir} ${p} has no skip link`);
    ok(out.html.includes('name="robots" content="noindex'), `${dir} ${p} preview is indexable`);
    ok(out.html.includes(`rel="canonical" href="https://www.bolutifeawakan.com${p}"`), `${dir} ${p} canonical is wrong`);
    const imgs = out.html.match(/<img [^>]*>/g) || [];
    ok(imgs.every((t) => / alt="/.test(t)), `${dir} ${p} has an image without alt`);
    // links inside a preview stay inside it
    const hrefs = [...out.html.matchAll(/href="(\/[^"]*)"/g)].map((x) => x[1]).filter((h) => !h.startsWith("/assets") && !h.startsWith("/favicon") && !h.startsWith("/apple"));
    const leaks = hrefs.filter((h) => !h.startsWith(`/preview/${dir}`));
    ok(!leaks.length, `${dir} ${p} links out of the preview: ${leaks.slice(0, 3).join(", ")}`);
  }
}

console.log("2. Old addresses redirect");
for (const [from, to] of [["/notes", "/writing"], ["/playground", "/experiments"], ["/bookings", "/contact?about=speaking"]]) {
  const out = await route(`/preview/brand-book${from}`, {}, {});
  ok(out.status === 301 && out.location === `/preview/brand-book${to}`, `${from} should redirect to ${to}, got ${out.status} ${out.location}`);
}
for (const [from, to] of [["/writing", "/thoughts"], ["/notes", "/thoughts"], ["/playground", "/experiments"]]) {
  const out = await route(`/preview/personal-editorial${from}`, {}, {});
  ok(out.status === 301 && out.location === `/preview/personal-editorial${to}`, `editorial ${from} should redirect to ${to}, got ${out.status} ${out.location}`);
}

console.log("3. Production stays on the current site while the test is off");
{
  const out = await route("/", {}, {});
  ok(out.status === 200 && out.cache === "public", "home should be public-cached legacy");
  ok(!out.html.includes('name="robots"'), "production home must be indexable");
  ok(!(out.headers || {})["Set-Cookie"], "no cookie when the test is off");
}

console.log("4. Assignment is sticky, split as configured, and reset by a new test id");
{
  const cfg = { enabled: true, id: "t1", splitBook: 50, defaultDirection: "legacy" };
  const first = resolve({}, cfg, () => 0.2);
  ok(first.direction === "book" && first.setCookie.includes("ba_dir=t1:book"), "0.2 < 50% should give book");
  const again = resolve({ ba_dir: "t1:book" }, cfg, () => 0.9);
  ok(again.direction === "book" && !again.setCookie, "returning visitor keeps book");
  const reset = resolve({ ba_dir: "t0:book" }, cfg, () => 0.9);
  ok(reset.direction === "editorial", "a new test id reassigns");
  let book = 0;
  for (let i = 0; i < 10000; i++) if (resolve({}, { ...cfg, splitBook: 30 }).direction === "book") book++;
  ok(book > 2700 && book < 3300, `30% split gave ${book / 100}%`);
  ok(config({}).enabled === false && config({}).defaultDirection === "legacy", "defaults: test off, current site");
}

console.log("5. The experiment, when on, serves private pages to everyone");
{
  process.env.EXPERIMENT_ENABLED = "1";
  const out = await route("/work", {}, {});
  ok(out.cache === "private" && /ba_dir=/.test(out.headers["Set-Cookie"] || ""), "assigned and private");
  ok(/"measure":true/.test(out.html.replace(/&quot;/g, '"')), "measurement on for real visitors");
  const internal = await route("/preview/brand-book/work", {}, {});
  ok(/"measure":false/.test(internal.html.replace(/&quot;/g, '"')), "previews are never measured");
  delete process.env.EXPERIMENT_ENABLED;
}

console.log(failed ? `\n${failed} check(s) failed` : "\nAll checks passed");
process.exit(failed ? 1 : 0);
