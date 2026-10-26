// /preview — the owner's comparison page. Not indexed, not measured.
import { esc } from "../media.mjs";

const NAME = { legacy: "the current site", book: "the Brand Book", editorial: "the Personal Editorial", realbook: "The Book" };

export function comparison(c, cfg) {
  const status = cfg.enabled
    ? `The A/B test <strong>${esc(cfg.id)}</strong> is running: ${cfg.splitBook}% of new visitors get ${NAME[cfg.arms[0]]}, ${100 - cfg.splitBook}% ${NAME[cfg.arms[1]]}.`
    : `The A/B test is off. Visitors see: <strong>${NAME[cfg.defaultDirection]}</strong>.`;
  const card = (slug, name, line) => `<li><a href="/preview/${slug}">
    <span class="t">${esc(name)}</span><span class="l">${esc(line)}</span><span class="u">/preview/${slug}</span></a>
    <p class="pages">${["", "work", "about", "ventures", "speaking", "writing", "on-the-side", "contact"].map((p) => `<a href="/preview/${slug}/${p}">${p || "home"}</a>`).join("")}</p></li>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>Compare directions | Bolutife Awakan</title>
<style>
  body{margin:0;font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;color:#1a1a1a;background:#fff}
  main{max-width:960px;margin:0 auto;padding:40px 20px 80px}
  h1{font-size:32px;margin:0 0 8px} p{margin:0 0 12px}
  .status{background:#f3f3f0;padding:12px 16px;margin:20px 0 32px}
  ul{list-style:none;padding:0;margin:0;display:grid;gap:16px}
  li{border:1px solid #cfcfcf;padding:20px}
  li>a{display:grid;gap:4px;color:inherit;text-decoration:none}
  .t{font-size:22px;font-weight:600}.l{color:#555}.u{font-size:13px;color:#1d6a3c}
  .pages{margin:14px 0 0;display:flex;flex-wrap:wrap;gap:6px 14px;font-size:14px}
  .pages a{color:#1a1a1a}
  .note{font-size:14px;color:#555;margin-top:32px}
</style></head><body><main>
<h1>Compare the directions</h1>
<p>Each link keeps you inside one direction as you click around. Open them on your phone too: the links work the same way.</p>
<p class="status">${status}</p>
<ul>
${card("brand-book", "A. The Living Brand Book", "The site set as brand guidelines plates: mark, colour, type, photography, architecture.")}
${card("personal-editorial", "B. The Personal Editorial", "Mason Wong as the reference: black, photo-led, huge condensed type, a desk of polaroids.")}
${card("the-book", "C. The Book", "A black-and-white book you handle: lift a corner and the page folds; chapters follow the positioning strategy.")}
${card("current", "The current site", "What bolutifeawakan.com shows today, for reference.")}
</ul>
<p class="note">Visiting any preview link marks this browser as internal, so your own clicks are never counted in the test. Preview pages are hidden from search engines.</p>
</main></body></html>`;
}
