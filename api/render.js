import { route } from "../lib/router.mjs";

export default async function handler(req, res) {
  const url = new URL(req.url, "http://localhost");
  const path = url.searchParams.get("__path") || url.pathname;
  const query = Object.fromEntries(url.searchParams);
  delete query.__path;
  try {
    const out = await route(path, query);
    if (out.location) {
      res.statusCode = out.status;
      res.setHeader("Location", out.location);
      return res.end();
    }
    res.statusCode = out.status;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    // Fresh within a minute of publishing; served instantly from the edge.
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=86400");
    res.end(out.html);
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Something went wrong loading this page. Please refresh.");
  }
}
