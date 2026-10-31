// First-party analytics endpoint for the A/B test.
// The browser sends one small JSON event at a time (public/assets/track.js).
// Events are validated, internal and preview traffic is dropped, and the rest
// is written as one JSON line to the function log ("ba_event") and, if
// ANALYTICS_FORWARD_URL is set, forwarded there (any webhook or log drain
// that accepts JSON). No IP address, user agent or cookie is stored.

import { parseCookies, INTERNAL_COOKIE, config } from "../lib/experiment.mjs";

export const EVENTS = new Set([
  "exposure",          // a page was shown to a visitor in the test (once per page view)
  "home_engaged",      // scrolled half the home page, or clicked anything on it
  "work_click",        // followed a link to /work or a case study
  "case_view",         // a case study page was viewed
  "about_view",
  "writing_view",      // the writing list or an article
  "ventures_view",
  "venture_click",     // followed a link out to a venture's own site
  "speaking_view",
  "contact_cta",       // clicked a contact or hire link anywhere
  "speaking_cta",      // clicked a "book me to speak" link anywhere
  "contact_submit",    // submitted the contact form (opens an email draft)
  "speaking_submit",   // submitted the contact form with "Speaking" chosen
  "qualified",         // primary metric: viewed a case study, then took a contact or speaking action, in one session
  "nav_open",          // opened the menu or contents panel
  "nav_click",         // followed Contact from the navigation (not counted as a call to action)
  "book_click",        // followed a link to a book or the store
  "signup",            // left an email for new thoughts and releases
]);

const clean = (v, n = 80) => (typeof v === "string" ? v.slice(0, n).replace(/[^\w\-/:. #?=&]/g, "") : null);

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.end();
  }
  const cookies = parseCookies(req.headers.cookie);
  if (cookies[INTERNAL_COOKIE] === "1") {
    res.statusCode = 204; // owner and reviewer traffic is never measured
    return res.end();
  }
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 2048) break;
  }
  let e;
  try {
    e = JSON.parse(body);
  } catch {
    res.statusCode = 400;
    return res.end();
  }
  const cfg = config();
  if (!e || !EVENTS.has(e.name) || !cfg.enabled || e.exp !== cfg.id || !(cfg.arms || []).includes(e.dir)) {
    res.statusCode = 204;
    return res.end();
  }
  const event = {
    t: "ba_event",
    at: new Date().toISOString(),
    exp: cfg.id,
    dir: e.dir,
    name: e.name,
    page: clean(e.page, 40),
    target: clean(e.target),
    session: clean(e.session, 24), // random per-tab id, not tied to a person
    device: e.device === "mobile" ? "mobile" : "desktop",
  };
  console.log(JSON.stringify(event));
  if (process.env.ANALYTICS_FORWARD_URL) {
    try {
      await fetch(process.env.ANALYTICS_FORWARD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
        signal: AbortSignal.timeout(2000),
      });
    } catch (err) {
      console.error("Analytics forward failed:", err.message);
    }
  }
  res.statusCode = 204;
  res.end();
}
