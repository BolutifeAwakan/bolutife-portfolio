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
})();
