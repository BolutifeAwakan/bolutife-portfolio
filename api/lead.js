// Press kit downloads on Thoughts ask for a name and an email first.
// Each lead is validated and written as one JSON line ("ba_lead") to the function log and,
// if LEADS_FORWARD_URL is set, sent there too (a Zapier or Make webhook, a Google Sheet
// script, or a newsletter provider). Logs are short-lived, so set the forward URL to keep them.

const ASSETS = new Set(["press-kit", "headshots", "cv"]);
const text = (v, n) => (typeof v === "string" ? v.trim().slice(0, n).replace(/[\u0000-\u001f<>]/g, "") : "");

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.end();
  }
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 4096) break;
  }
  let e;
  try {
    e = JSON.parse(body);
  } catch {
    res.statusCode = 400;
    return res.end();
  }
  const lead = {
    t: "ba_lead",
    at: new Date().toISOString(),
    name: text(e && e.name, 120),
    email: text(e && e.email, 200).toLowerCase(),
    org: text(e && e.org, 160),
    asset: ASSETS.has(e && e.asset) ? e.asset : "",
    page: text(e && e.page, 80),
  };
  if (!lead.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email) || !lead.asset) {
    res.statusCode = 422;
    return res.end();
  }
  console.log(JSON.stringify(lead));
  if (process.env.LEADS_FORWARD_URL) {
    try {
      await fetch(process.env.LEADS_FORWARD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
        signal: AbortSignal.timeout(3000),
      });
    } catch (err) {
      console.error("Lead forward failed:", err.message);
    }
  }
  res.statusCode = 204;
  res.end();
}
