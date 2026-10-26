import { route } from "../lib/router.mjs";
import { parseCookies } from "../lib/experiment.mjs";

const CACHE = {
  // Same page for everyone: fresh within a minute of publishing, served from the edge.
  public: "public, max-age=0, s-maxage=60, stale-while-revalidate=86400",
  // During the A/B test each visitor's page depends on their cookie, so it is never shared.
  private: "private, no-store",
  // Owner preview links: cache at the edge (the path already names the direction).
  preview: "public, max-age=0, s-maxage=60, stale-while-revalidate=600",
};

export default async function handler(req, res) {
  const url = new URL(req.url, "http://localhost");
  const path = url.searchParams.get("__path") || url.pathname;
  const query = Object.fromEntries(url.searchParams);
  delete query.__path;
  try {
    const out = await route(path, query, parseCookies(req.headers.cookie));
    for (const [k, v] of Object.entries(out.headers || {})) res.setHeader(k, v);
    if (out.location) {
      res.statusCode = out.status;
      res.setHeader("Location", out.location);
      res.setHeader("Cache-Control", out.cache === "private" ? CACHE.private : "public, max-age=0, s-maxage=3600");
      return res.end();
    }
    res.statusCode = out.status;
    if (!res.getHeader("Content-Type")) res.setHeader("Content-Type", "text/html; charset=utf-8");
    // Preview pages set an "exclude me from measurement" cookie, so they can't be shared at the edge.
    const cache = out.cache === "preview" && out.headers && out.headers["Set-Cookie"] ? "private" : out.cache;
    res.setHeader("Cache-Control", CACHE[cache] || CACHE.public);
    res.end(out.html);
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Something went wrong loading this page. Please refresh.");
  }
}
