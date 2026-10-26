// Local preview: node dev.mjs  →  http://localhost:3000
import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import handler from "./api/render.js";
import collect from "./api/collect.js";

const types = { ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".txt": "text/plain", ".ico": "image/x-icon" };

http
  .createServer(async (req, res) => {
    const p = req.url.split("?")[0];
    if (p.startsWith("/assets/") || p === "/robots.txt" || p === "/favicon.ico" || p === "/apple-touch-icon.png") {
      try {
        const file = join("public", p);
        res.setHeader("Content-Type", types[extname(file)] || "application/octet-stream");
        return res.end(await readFile(file));
      } catch {
        res.statusCode = 404;
        return res.end();
      }
    }
    if (p === "/api/collect") return collect(req, res);
    return handler(req, res);
  })
  .listen(process.env.PORT || 3000, () => console.log("http://localhost:" + (process.env.PORT || 3000)));
