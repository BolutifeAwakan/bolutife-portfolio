(() => {
  const root = document.documentElement;
  const track = (n, t) => window.baTrack && window.baTrack(n, t);
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Lagos and London clocks
  const tick = () =>
    document.querySelectorAll("time[data-tz]").forEach((t) => {
      t.textContent = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: t.dataset.tz });
    });
  tick();
  setInterval(tick, 30000);

  // Display lines that fill their container exactly
  const fitAll = () =>
    document.querySelectorAll(".ed-fit:not(.ed-fit--left)").forEach((el) => {
      const inner = el.firstElementChild;
      if (!inner) return;
      el.classList.remove("is-fitted");
      const avail = el.clientWidth;
      const w = inner.getBoundingClientRect().width;
      if (!avail || !w) return;
      const cur = parseFloat(getComputedStyle(el).fontSize);
      el.style.setProperty("--fs", `${Math.floor(cur * (avail / w) * 100) / 100}px`);
      el.classList.add("is-fitted");
    });
  fitAll();
  if (document.fonts) document.fonts.ready.then(fitAll);
  let rt;
  addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(fitAll, 120); });

  // Reveal on scroll. Only elements below the fold wait, so nothing above it flashes.
  // Transform and opacity only, so it stays cheap.
  if (!still) {
    let pending = [...document.querySelectorAll("[data-reveal]")].filter((el, i) => {
      if (el.getBoundingClientRect().top < innerHeight * 0.92) return false;
      el.classList.add("is-pending");
      el.style.transitionDelay = `${(i % 3) * 70}ms`;
      return true;
    });
    let queued = false;
    const check = () => {
      queued = false;
      const edge = innerHeight * 0.94;
      pending = pending.filter((el) => {
        if (el.getBoundingClientRect().top > edge) return true;
        el.classList.remove("is-pending");
        return false;
      });
      if (!pending.length) removeEventListener("scroll", onScroll);
    };
    const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(check); } };
    if (pending.length) { addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll); }
  }

  // Selected work: as the next card slides over, the one beneath settles back.
  const cards = [...document.querySelectorAll(".ed-stack__card")];
  if (cards.length && !still) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const h = innerHeight;
      cards.forEach((c, i) => {
        const next = cards[i + 1];
        const a = c.firstElementChild;
        if (!next) { a.style.removeProperty("--sc"); a.style.removeProperty("--br"); return; }
        const t = Math.min(1, Math.max(0, 1 - next.getBoundingClientRect().top / h));
        a.style.setProperty("--sc", (1 - t * 0.06).toFixed(4));
        a.style.setProperty("--br", (1 - t * 0.45).toFixed(3));
      });
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  // Intro: the photo beside "teams" grows out of the sentence as you scroll and
  // settles as a large picture in the empty column, then shrinks back on the way up.
  const grow = document.querySelector(".ed-intro__grow");
  const seed = document.querySelector(".ed-intro .ed-chip[data-grow]");
  if (grow && seed && !still) {
    const sec = grow.closest(".ed-intro");
    const space = sec.querySelector(".ed-intro__space");
    let queued = false;
    const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
    const frame = () => {
      queued = false;
      if (getComputedStyle(space).display === "none") { grow.classList.remove("is-ready"); seed.style.visibility = ""; return; }
      const vh = innerHeight;
      const s = sec.getBoundingClientRect();
      if (s.bottom < -vh || s.top > vh * 2) return;
      const c = seed.getBoundingClientRect();
      const t = space.getBoundingClientRect();
      const cw = seed.offsetWidth, ch = seed.offsetHeight;
      const cx = c.left + c.width / 2 - s.left, cy = c.top + c.height / 2 - s.top;
      const W = t.width, H = Math.min(vh * 0.76, W * 1.3);
      const padB = parseFloat(getComputedStyle(sec).paddingBottom) || 0;
      const top = Math.min(Math.max(vh * 0.12 - s.top, t.top - s.top), s.height - padB - H);
      const tx = t.left - s.left + W / 2, ty = top + H / 2;
      const p = Math.min(1, Math.max(0, (vh * 0.72 - (c.top + c.height / 2)) / (vh * 0.42)));
      // First it slides out of the sentence into the empty column, then it opens up.
      const em = ease(Math.min(1, p / 0.45));
      const es = ease(Math.min(1, Math.max(0, (p - 0.35) / 0.65)));
      const w = cw + (W - cw) * es, h = ch + (H - ch) * es;
      const x = cx + (tx - cx) * em - w / 2, y = cy + (ty - cy) * em - h / 2;
      grow.style.width = `${w}px`;
      grow.style.height = `${h}px`;
      grow.style.borderRadius = `${(ch / 2) * (1 - es)}px`;
      grow.style.transform = `translate(${x}px, ${y}px) rotate(${-3 * (1 - em)}deg)`;
      grow.classList.add("is-ready");
      seed.style.visibility = "hidden";
    };
    const req = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };
    addEventListener("scroll", req, { passive: true });
    addEventListener("resize", req);
    addEventListener("load", req);
    if (document.fonts) document.fonts.ready.then(req);
    req();
  }

  // Menu as a modal dialog: background made inert, focus kept inside
  const btn = document.querySelector(".ed-head__menu");
  const menu = document.getElementById("ed-menu");
  if (btn && menu) {
    const close = menu.querySelector(".ed-menu__close");
    const behind = [...document.body.children].filter((el) => el !== menu && el.tagName !== "SCRIPT");
    const set = (open) => {
      menu.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
      root.classList.toggle("ed-menu-open", open);
      behind.forEach((el) => (el.inert = open));
      if (open) { menu.querySelector("nav a").focus(); track("nav_open", "menu"); }
      else btn.focus();
    };
    btn.addEventListener("click", () => set(menu.hidden));
    close.addEventListener("click", () => set(false));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) set(false); });
    addEventListener("resize", () => { if (!menu.hidden && innerWidth > 1100) set(false); });
  }

  // Rows with a photo that follows the pointer
  if (fine) {
    const rows = document.querySelectorAll(".ed-row[data-preview]");
    if (rows.length) {
      const peek = document.createElement("div");
      peek.className = "ed-peek";
      peek.setAttribute("aria-hidden", "true");
      const im = document.createElement("img");
      im.alt = "";
      peek.appendChild(im);
      document.body.appendChild(peek);
      let x = 0, y = 0, px = 0, py = 0, raf = 0;
      const loop = () => {
        px += (x - px) * 0.18; py += (y - py) * 0.18;
        peek.style.left = `${px}px`; peek.style.top = `${py}px`;
        raf = Math.abs(x - px) + Math.abs(y - py) > 0.5 ? requestAnimationFrame(loop) : 0;
      };
      rows.forEach((r) => {
        r.addEventListener("pointerenter", (e) => {
          if (!r.dataset.preview) return;
          im.src = r.dataset.preview;
          x = px = e.clientX; y = py = e.clientY;
          peek.classList.add("is-on");
        });
        r.addEventListener("pointermove", (e) => { x = e.clientX + 40; y = e.clientY; if (!raf) raf = requestAnimationFrame(loop); });
        r.addEventListener("pointerleave", () => peek.classList.remove("is-on"));
      });
    }
  }

  // The desk: photos you can pick up and move
  document.querySelectorAll("[data-desk]").forEach((desk) => {
    if (!fine || innerWidth <= 800) return;
    let z = 10;
    desk.querySelectorAll("[data-drag]").forEach((p) => {
      const base = getComputedStyle(p).transform;
      let sx, sy, ox = 0, oy = 0;
      p.addEventListener("pointerdown", (e) => {
        p.setPointerCapture(e.pointerId);
        p.classList.add("is-drag");
        p.style.zIndex = ++z;
        sx = e.clientX - ox; sy = e.clientY - oy;
      });
      p.addEventListener("pointermove", (e) => {
        if (!p.classList.contains("is-drag")) return;
        ox = e.clientX - sx; oy = e.clientY - sy;
        p.style.transform = `translate(${ox}px, ${oy}px) ${base === "none" ? "" : base} rotate(${still ? 0 : ox * 0.01}deg)`;
      });
      const end = () => p.classList.remove("is-drag");
      p.addEventListener("pointerup", end);
      p.addEventListener("pointercancel", end);
    });
  });

  // Contact form: opens an email draft with the message filled in
  const form = document.querySelector(".ed-form[data-mailto]");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(form);
      const about = f.get("about") || "project";
      const label = form.querySelector(`input[name="about"][value="${about}"]`)?.parentElement.textContent.trim() || "Hello";
      track(about === "speaking" ? "speaking_submit" : "contact_submit", about);
      const subject = `${label}: ${f.get("name")}`;
      const body = `${f.get("message")}\n\n${f.get("name")}\n${f.get("email")}`;
      location.href = `mailto:${form.dataset.mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  // Email sign-up: posts to the newsletter provider when one is connected
  // (the form then has an action); otherwise opens a short email to Bolutife.
  document.querySelectorAll("form[data-signup]").forEach((f) => {
    const done = f.querySelector(".ed-su__done");
    f.addEventListener("submit", (e) => {
      const email = f.querySelector('input[type="email"]').value.trim();
      const source = f.dataset.source || "site";
      track("signup", source);
      if (f.getAttribute("action")) {
        if (done) done.textContent = "Thanks. Check your inbox to confirm.";
        return; // the provider's form handles the rest
      }
      e.preventDefault();
      const subject = source === "signature" ? "Tell me when Signature is available" : "Add me to your email list";
      location.href = `mailto:${f.dataset.mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Please add ${email} (from ${source}).`)}`;
      if (done) done.textContent = "Your email app should open with the request filled in. Send it and you're on the list.";
    });
  });

  // Copy the article link (or use the device's share sheet)
  document.querySelectorAll("[data-share]").forEach((b) => {
    b.addEventListener("click", async () => {
      const url = location.href.split("#")[0];
      try {
        if (navigator.share && matchMedia("(pointer: coarse)").matches) { await navigator.share({ title: document.title, url }); return; }
        await navigator.clipboard.writeText(url);
        b.textContent = "Link copied";
      } catch (err) {
        const t = document.createElement("textarea");
        t.value = url; document.body.appendChild(t); t.select();
        try { document.execCommand("copy"); b.textContent = "Link copied"; } catch (_) { b.textContent = url; }
        t.remove();
      }
      setTimeout(() => { b.textContent = "Copy link"; }, 2400);
    });
  });

  // Experiments filter
  const filters = document.querySelectorAll(".ed-filter [data-filter]");
  filters.forEach((btn) =>
    btn.addEventListener("click", () => {
      const c = btn.dataset.filter;
      filters.forEach((x) => x.setAttribute("aria-pressed", String(x === btn)));
      document.querySelectorAll(".ed-shot").forEach((s) => s.classList.toggle("is-hidden", !!c && s.dataset.cat !== c));
    })
  );
})();
