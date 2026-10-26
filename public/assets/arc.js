(() => {
  const root = document.documentElement;
  const track = (n, t) => window.baTrack && window.baTrack(n, t);

  // Lagos and London clocks
  const tick = () =>
    document.querySelectorAll("time[data-tz]").forEach((t) => {
      t.textContent = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: t.dataset.tz });
    });
  tick();
  setInterval(tick, 30000);

  // Header rule once the page moves
  const head = document.querySelector(".ac-head");
  const onScroll = () => head && head.classList.toggle("is-scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Contents: a native modal dialog (focus stays inside, Escape closes)
  const btn = document.querySelector(".ac-head__menu");
  const dlg = document.getElementById("ac-contents");
  if (btn && dlg && dlg.showModal) {
    btn.addEventListener("click", () => { dlg.showModal(); root.classList.add("ac-locked"); track("nav_open", "contents"); });
    dlg.querySelector(".ac-contents__close").addEventListener("click", () => dlg.close());
    dlg.addEventListener("close", () => { root.classList.remove("ac-locked"); btn.focus(); });
    dlg.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => dlg.close()));
  }

  // The cover doors: each phrase changes the portrait and the proof line
  const cover = document.querySelector("[data-doors]");
  if (cover) {
    const doorsLine = cover.querySelector(".ac-cover__doors");
    const frames = cover.querySelectorAll("[data-frame]");
    const proofs = cover.querySelectorAll("[data-proof]");
    let timer;
    const show = (key) => {
      clearTimeout(timer);
      frames.forEach((f) => f.classList.toggle("is-on", f.dataset.frame === key));
      proofs.forEach((p) => (p.hidden = p.dataset.proof !== key));
      cover.querySelectorAll("[data-door]").forEach((a) => a.classList.toggle("is-on", a.dataset.door === key));
      doorsLine.classList.toggle("has-on", key !== "default");
    };
    const reset = () => { timer = setTimeout(() => show("default"), 500); };
    cover.querySelectorAll("[data-door]").forEach((a) => {
      a.addEventListener("pointerenter", () => show(a.dataset.door));
      a.addEventListener("focus", () => show(a.dataset.door));
      a.addEventListener("pointerleave", reset);
      a.addEventListener("blur", reset);
    });
    // load the door portraits once the page is idle, so the swap is instant
    const warm = () => frames.forEach((f) => f.querySelectorAll("img").forEach((i) => (i.loading = "eager")));
    ("requestIdleCallback" in window ? requestIdleCallback : setTimeout)(warm, 1200);
  }

  // The arc: the rail shows which act you're in
  const rail = document.querySelectorAll("[data-rail]");
  const acts = document.querySelectorAll("[data-act]");
  if (rail.length && acts.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) rail.forEach((r) => r.classList.toggle("is-on", r.dataset.rail === e.target.dataset.act));
      }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    acts.forEach((a) => io.observe(a));
  }

  // Contact form: opens an email draft with the message filled in
  const form = document.querySelector(".ac-form[data-mailto]");
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
