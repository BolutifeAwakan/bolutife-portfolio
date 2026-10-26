// Read the A/B test events and say what they do (and don't) show.
//   node scripts/results.mjs events.jsonl
// The input is one JSON event per line, as written by api/collect.js
// (exported from your log drain or webhook). Lines that aren't events are skipped.

import { readFileSync } from "node:fs";

const file = process.argv[2];
if (!file) {
  console.log("Usage: node scripts/results.mjs <events.jsonl>");
  process.exit(1);
}
const events = readFileSync(file, "utf8")
  .split("\n")
  .map((l) => { try { const j = JSON.parse(l.slice(l.indexOf("{"))); return j.t === "ba_event" ? j : null; } catch { return null; } })
  .filter(Boolean);
if (!events.length) { console.log("No events found in that file."); process.exit(0); }

const exps = [...new Set(events.map((e) => e.exp))];
const MIN_SESSIONS = 400; // per direction, before any comparison is read as evidence

for (const exp of exps) {
  const ev = events.filter((e) => e.exp === exp);
  const first = ev.reduce((a, e) => (e.at < a ? e.at : a), ev[0].at).slice(0, 10);
  const last = ev.reduce((a, e) => (e.at > a ? e.at : a), ev[0].at).slice(0, 10);
  console.log(`\nTest "${exp}"  ${first} to ${last}`);
  const days = (Date.parse(last) - Date.parse(first)) / 864e5 + 1;

  const NAMES = { book: "Brand Book", editorial: "Editorial", arc: "The Arc" };
  const dirs = [...new Set(ev.map((e) => e.dir))].filter((d) => NAMES[d]).sort().slice(0, 2);
  if (dirs.length < 2) { console.log("  Only one direction has events so far."); continue; }
  const [d1, d2] = dirs;
  const stats = {};
  for (const dir of dirs) {
    const sessions = new Map();
    for (const e of ev.filter((x) => x.dir === dir)) {
      if (!sessions.has(e.session)) sessions.set(e.session, new Set());
      sessions.get(e.session).add(e.name);
    }
    const n = sessions.size;
    const has = (name) => [...sessions.values()].filter((s) => s.has(name)).length;
    const anyOf = (...names) => [...sessions.values()].filter((s) => names.some((x) => s.has(x))).length;
    stats[dir] = {
      n,
      qualified: has("qualified"),
      contact: anyOf("contact_cta", "contact_submit", "speaking_cta", "speaking_submit"),
      submitted: anyOf("contact_submit", "speaking_submit"),
      caseView: has("case_view"),
      workClick: has("work_click"),
      homeEngaged: has("home_engaged"),
      about: has("about_view"),
      ventures: has("ventures_view"),
      writing: has("writing_view"),
      mobile: new Set(ev.filter((x) => x.dir === dir && x.device === "mobile").map((x) => x.session)).size,
    };
  }

  const pct = (k, d) => (stats[d].n ? ((100 * stats[d][k]) / stats[d].n).toFixed(1) + "%" : "–");
  const rows = [
    ["Sessions", "n"],
    ["Qualified engagement (primary)", "qualified"],
    ["Any contact or speaking action", "contact"],
    ["Sent the contact form", "submitted"],
    ["Viewed a case study", "caseView"],
    ["Clicked through to work", "workClick"],
    ["Engaged with the home page", "homeEngaged"],
    ["Visited About", "about"],
    ["Visited Ventures", "ventures"],
    ["Read writing", "writing"],
    ["On a phone", "mobile"],
  ];
  console.log(`  ${"".padEnd(34)}${NAMES[d1].padStart(14)}${NAMES[d2].padStart(14)}`);
  for (const [label, k] of rows) {
    const a = k === "n" ? String(stats[d1].n) : `${stats[d1][k]} (${pct(k, d1)})`;
    const b = k === "n" ? String(stats[d2].n) : `${stats[d2][k]} (${pct(k, d2)})`;
    console.log(`  ${label.padEnd(34)}${a.padStart(14)}${b.padStart(14)}`);
  }

  // Two-proportion z-test on the primary metric.
  const A = stats[d1], B = stats[d2];
  const p1 = A.n ? A.qualified / A.n : 0, p2 = B.n ? B.qualified / B.n : 0;
  const p = (A.qualified + B.qualified) / Math.max(1, A.n + B.n);
  const se = Math.sqrt(p * (1 - p) * (1 / Math.max(1, A.n) + 1 / Math.max(1, B.n)));
  const z = se ? (p1 - p2) / se : 0;
  const pval = 2 * (1 - phi(Math.abs(z)));
  console.log(`\n  Primary metric difference: ${((p1 - p2) * 100).toFixed(1)} points (p = ${pval.toFixed(3)})`);

  const enough = A.n >= MIN_SESSIONS && B.n >= MIN_SESSIONS && days >= 14 && A.qualified + B.qualified >= 30;
  if (!enough) {
    console.log(`  Not enough evidence to choose yet. The test needs at least ${MIN_SESSIONS} sessions per direction, 14 days, and 30 qualified sessions in total.`);
    console.log(`  So far: ${A.n} and ${B.n} sessions over ${Math.round(days)} days, ${A.qualified + B.qualified} qualified.`);
    console.log("  With low traffic, rely on the usability sessions (docs/usability-test.md) alongside these numbers.");
  } else if (pval < 0.05) {
    console.log(`  ${p1 > p2 ? NAMES[d1] : NAMES[d2]} leads on the primary metric, and the difference is unlikely to be chance.`);
    console.log("  Check the secondary metrics and the usability findings before making it permanent.");
  } else {
    console.log("  No reliable difference on the primary metric. Choose on the usability findings and the design assessment.");
  }
}

function phi(x) {
  // standard normal CDF
  const t = 1 / (1 + 0.2316419 * x);
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  return 1 - d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
}
