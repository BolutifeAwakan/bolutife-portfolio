// Local preview: node dev.mjs  →  http://localhost:3000
import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import handler from "./api/render.js";

const types = { ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg" };

http
  .createServer(async (req, res) => {
    if (req.url.startsWith("/assets/")) {
      try {
        const file = join("public", req.url.split("?")[0]);
        res.setHeader("Content-Type", types[extname(file)] || "application/octet-stream");
        return res.end(await readFile(file));
      } catch {
        res.statusCode = 404;
        return res.end();
      }
    }
    return handler(req, res);
  })
  .listen(process.env.PORT || 3000, () => console.log("http://localhost:" + (process.env.PORT || 3000)));
