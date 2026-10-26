(() => {
  const root = document.documentElement;
  const track = (n, t) => window.baTrack && window.baTrack(n, t);

  /* Running head: follows the plate under it (chapter, folio, colour) */
  const head = document.querySelector(".bk-head");
  const cur = head && head.querySelector(".bk-head__cur");
  const folio = head && head.querySelector(".bk-head__folio");
  const plates = [...document.querySelectorAll("[data-plate]")];
  const TOTAL = 11;
  let last = null;
  const setHead = (el) => {
    if (!head || el === last) return;
    last = el;
    const tone = el.dataset.tone || "paper";
    head.className = head.className.replace(/\bbk-tone-\w+/g, "").trim() + " bk-tone-" + tone;
    const n = el.dataset.ch;
    const t = el.dataset.title || "";
    if (cur) cur.innerHTML = n && n !== "00" ? `<span class="bk-run__n">${n}</span> ${t.replace(/</g, "&lt;")}` : t.replace(/</g, "&lt;") || "Cover";
    if (folio) folio.textContent = `${n || "00"} / ${TOTAL}`;
  };
  if (head && plates.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setHead(e.target)),
      { rootMargin: "-50px 0px -92% 0px" }
    );
    plates.forEach((p) => io.observe(p));
  }

  /* Contents: a modal dialog (focus stays inside, Escape closes) */
  const btn = document.querySelector(".bk-head__toc");
  const dlg = document.getElementById("bk-contents");
  if (btn && dlg && typeof dlg.showModal === "function") {
    const close = () => dlg.open && dlg.close();
    btn.addEventListener("click", () => {
      dlg.showModal();
      btn.setAttribute("aria-expanded", "true");
      (dlg.querySelector('[aria-current="page"]') || dlg.querySelector("a")).focus();
      track("nav_open", "contents");
    });
    dlg.querySelector(".bk-contents__close").addEventListener("click", close);
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg) close();
      const a = e.target.closest("a");
      if (a && a.hash && a.pathname === location.pathname) close();
    });
    dlg.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const f = [...dlg.querySelectorAll("a[href], button")];
      const first = f[0], end = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); end.focus(); }
      else if (!e.shiftKey && document.activeElement === end) { e.preventDefault(); first.focus(); }
    });
    dlg.addEventListener("close", () => { btn.setAttribute("aria-expanded", "false"); btn.focus(); });
  }

  /* The layout grid, on demand */
  const grid = document.querySelector(".bk-head__grid");
  if (grid) grid.addEventListener("click", () => {
    const on = !root.classList.contains("bk-grid-on");
    root.classList.toggle("bk-grid-on", on);
    grid.setAttribute("aria-pressed", String(on));
  });

  /* Colour plate: copy a value */
  const live = document.querySelector("[data-copied]");
  document.querySelectorAll("[data-copy]").forEach((b) =>
    b.addEventListener("click", async () => {
      const v = b.dataset.copy;
      try { await navigator.clipboard.writeText(v); } catch (e) { /* clipboard blocked: still show the value */ }
      document.querySelectorAll("[data-copy][data-done]").forEach((x) => x.removeAttribute("data-done"));
      b.setAttribute("data-done", "");
      if (live) live.textContent = `Copied ${v}`;
      setTimeout(() => b.removeAttribute("data-done"), 1800);
    })
  );

  /* Typography plate: width and weight */
  const spec = document.querySelector("[data-specimen]");
  if (spec) document.querySelectorAll("[data-axis]").forEach((r) => {
    const out = document.querySelector(`[data-out="${r.dataset.axis}"]`);
    const set = () => { spec.style.setProperty(`--${r.dataset.axis}`, r.value); if (out) out.textContent = r.value; };
    r.addEventListener("input", set);
  });

  /* Fit the address to its clear-space box, whatever font arrives */
  const fits = [...document.querySelectorAll("[data-fit]")];
  const fit = () => fits.forEach((el) => {
    el.style.fontSize = "";
    const box = el.parentElement;
    const cs = getComputedStyle(box);
    const room = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const size = parseFloat(getComputedStyle(el).fontSize);
    if (el.scrollWidth > room) el.style.fontSize = Math.floor((size * room) / el.scrollWidth) + "px";
  });
  if (fits.length) {
    root.classList.add("bk-fit");
    fit();
    if (document.fonts) document.fonts.ready.then(fit);
    let t; addEventListener("resize", () => { clearTimeout(t); t = setTimeout(fit, 120); });
  }

  /* Contact form: opens an email draft with the message filled in */
  const form = document.querySelector(".bk-form[data-mailto]");
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
