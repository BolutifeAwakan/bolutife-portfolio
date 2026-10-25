(() => {
  const root = document.documentElement;

  // Reveal titles and blocks as they scroll into view
  const startReveals = () => {
    const targets = document.querySelectorAll(".title, .hero__name, .reveal");
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
        { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
      );
      targets.forEach((t) => io.observe(t));
    } else {
      targets.forEach((t) => t.classList.add("in"));
    }
  };

  // Loader: plays once on the home page, then not again for 7 days.
  // Same steps and timings as the original Framer preloader.
  const loader = document.querySelector(".loader");
  if (loader && root.classList.contains("is-loading")) {
    const steps = [[300, "s2"], [500, "s3"], [1300, "s4"], [2100, "s5"], [2700, "s6"]];
    steps.forEach(([t, cls]) => setTimeout(() => {
      loader.classList.add(cls);
      if (cls === "s6") startReveals();
    }, t));
    setTimeout(() => {
      root.classList.remove("is-loading");
      loader.remove();
      try { localStorage.setItem("loaderSeen", String(Date.now())); } catch (e) {}
    }, 3550);
  } else {
    if (loader) loader.remove();
    startReveals();
  }

  // Awards: a card with the award image follows the cursor on hover
  const awardRows = document.querySelectorAll(".table--awards .trow[data-hover]");
  if (awardRows.length && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const card = document.createElement("div");
    card.className = "acursor";
    card.setAttribute("aria-hidden", "true");
    const pic = document.createElement("img");
    pic.alt = "";
    card.appendChild(pic);
    document.body.appendChild(card);
    awardRows.forEach((r) => { const i = new Image(); i.src = r.dataset.hover; });

    // Spring follow (stiffness 500, damping 60, mass 1), card to the right of the cursor, offset 20/20
    const W = 266, H = 188, OX = 20, OY = 20;
    let tx = 0, ty = 0, x = 0, y = 0, vx = 0, vy = 0, raf = 0, last = 0, active = false;
    const tick = (now) => {
      const dt = Math.min(0.032, (now - last) / 1000 || 0.016);
      last = now;
      const ax = 500 * (tx - x) - 60 * vx, ay = 500 * (ty - y) - 60 * vy;
      vx += ax * dt; vy += ay * dt; x += vx * dt; y += vy * dt;
      card.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (active || Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(vx) + Math.abs(vy) > 0.5) raf = requestAnimationFrame(tick);
      else raf = 0;
    };
    const target = (e) => { tx = e.clientX + OX; ty = e.clientY - H / 2 + OY; };
    awardRows.forEach((row) => {
      row.addEventListener("pointerenter", (e) => {
        if (pic.getAttribute("src") !== row.dataset.hover) pic.src = row.dataset.hover;
        target(e);
        if (!active && !card.classList.contains("on")) { x = tx; y = ty; vx = vy = 0; }
        active = true;
        card.classList.add("on");
        if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
      });
      row.addEventListener("pointermove", target);
      row.addEventListener("pointerleave", () => { active = false; card.classList.remove("on"); });
    });
  }

  // Light / dark theme
  const themeBtn = document.querySelector(".theme");
  const setLabel = () => themeBtn && themeBtn.setAttribute("aria-label", root.dataset.theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  setLabel();
  themeBtn && themeBtn.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
    setLabel();
  });

  // Mobile menu
  const menuBtn = document.querySelector(".nav__menu");
  const menu = document.getElementById("menu");
  const setMenu = (open) => {
    menu.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.textContent = open ? "Close" : "Menu";
    document.body.style.overflow = open ? "hidden" : "";
  };
  menuBtn && menuBtn.addEventListener("click", () => setMenu(menu.hidden));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menu && !menu.hidden) setMenu(false); });

  // Forms open an email draft (or the newsletter sign-up page, if one is set)
  document.querySelectorAll("form[data-mailto]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(form);
      if (form.dataset.url) { window.open(form.dataset.url, "_blank", "noopener"); return; }
      const subject = form.dataset.kind === "subscribe" ? `Newsletter sign-up — ${f.get("name")}` : `Hello from ${f.get("name")}`;
      const body = form.dataset.kind === "subscribe"
        ? `Please add me to your newsletter.\n\n${f.get("name")}\n${f.get("email")}`
        : `${f.get("message")}\n\n${f.get("name")}\n${f.get("email")}`;
      window.location.href = `mailto:${form.dataset.mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  });
})();
