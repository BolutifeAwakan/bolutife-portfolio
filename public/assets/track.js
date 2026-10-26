// A/B test measurement, identical in both directions.
// Sends nothing unless: the test is running, this isn't a preview or internal
// visit, and the visitor has said yes to measurement.
(() => {
  const meta = document.querySelector('meta[name="ba-exp"]');
  let cfg = {};
  try { cfg = JSON.parse(meta ? meta.content : "{}"); } catch (e) {}
  const debug = /[?&]track-debug\b/.test(location.search);
  const store = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };
  const sess = (k, v) => { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } };

  const consent = () => store("ba_consent") === "yes";
  const active = () => cfg.measure && consent();
  const sessionId = () => {
    let id = sess("ba_sid");
    if (!id) { id = Math.random().toString(36).slice(2, 12); sess("ba_sid", id); }
    return id;
  };

  function send(name, target) {
    const event = { name, target: target || null, exp: cfg.exp, dir: cfg.dir, page: cfg.page, device: matchMedia("(max-width: 809px)").matches ? "mobile" : "desktop" };
    if (debug) console.info("[ba-track]", name, event);
    if (!active()) return;
    event.session = sessionId();
    const body = JSON.stringify(event);
    if (!(navigator.sendBeacon && navigator.sendBeacon("/api/collect", new Blob([body], { type: "application/json" })))) {
      fetch("/api/collect", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
    }
  }

  const ACTIONS = ["contact_cta", "speaking_cta", "contact_submit", "speaking_submit"];
  function track(name, target) {
    send(name, target);
    if (name === "case_view") sess("ba_case", "1");
    if (ACTIONS.includes(name) && sess("ba_case") === "1" && sess("ba_qualified") !== "1") {
      sess("ba_qualified", "1");
      send("qualified", name);
    }
  }
  window.baTrack = track;

  function start() {
    track("exposure", location.pathname);
    const views = { case: "case_view", about: "about_view", writing: "writing_view", article: "writing_view", ventures: "ventures_view", speaking: "speaking_view" };
    if (views[cfg.page]) track(views[cfg.page], cfg.slug || cfg.page);

    if (cfg.page === "home") {
      let done = false;
      const engaged = (why) => { if (!done) { done = true; track("home_engaged", why); } };
      addEventListener("scroll", () => { if (scrollY + innerHeight > document.documentElement.scrollHeight * 0.5) engaged("scroll"); }, { passive: true });
      document.addEventListener("click", (e) => { if (e.target.closest("main")) engaged("click"); });
    }
  }

  // One listener classifies every link the same way in both directions.
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-track], a[href]");
    if (!el) return;
    if (el.dataset.track) return track(el.dataset.track, el.dataset.trackTarget || el.getAttribute("href"));
    const h = el.getAttribute("href") || "";
    const p = h.replace(/^\/preview\/[^/]+/, "");
    if (/^mailto:/.test(h)) return track("contact_cta", "email");
    if (/^\/contact\?about=speaking/.test(p)) return track("speaking_cta", p);
    if (/^\/contact/.test(p)) return track("contact_cta", p);
    if (/^\/work(\/|$)/.test(p)) return track("work_click", p);
  });

  // Consent: asked once, only while the test is running.
  function ask() {
    const box = document.createElement("div");
    box.setAttribute("role", "region");
    box.setAttribute("aria-label", "Measurement");
    box.style.cssText = "position:fixed;z-index:9999;left:16px;right:16px;bottom:16px;max-width:420px;margin-left:auto;background:#fff;color:#1a1a1a;border:1px solid #cfcfcf;padding:16px 18px;font:15px/1.5 system-ui,-apple-system,Segoe UI,sans-serif;box-shadow:0 2px 12px rgba(0,0,0,.08)";
    box.innerHTML = '<p style="margin:0 0 12px">I’m testing two designs for this site. May I count which pages you visit? No personal details, no ads, nothing shared.</p><div style="display:flex;gap:8px"><button type="button" data-c="yes" style="font:inherit;padding:8px 14px;border:1px solid #1a1a1a;background:#1a1a1a;color:#fff;cursor:pointer">Allow</button><button type="button" data-c="no" style="font:inherit;padding:8px 14px;border:1px solid #1a1a1a;background:#fff;color:#1a1a1a;cursor:pointer">No thanks</button></div>';
    box.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-c]");
      if (!b) return;
      store("ba_consent", b.dataset.c);
      box.remove();
      if (b.dataset.c === "yes") start();
    });
    document.body.appendChild(box);
  }

  const init = () => {
    if (!cfg.measure) return;
    const c = store("ba_consent");
    if (c === "yes") start();
    else if (c !== "no") ask();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
