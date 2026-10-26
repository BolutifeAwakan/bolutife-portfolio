(() => {
  const root = document.documentElement;
  const track = (n, t) => window.baTrack && window.baTrack(n, t);

  // Contents panel (mobile and tablet; the rail covers desktop)
  const btn = document.querySelector(".bk-head__toc");
  const panel = document.getElementById("bk-contents");
  if (btn && panel) {
    const close = panel.querySelector(".bk-contents__close");
    let last = null;
    const set = (open) => {
      panel.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
      root.classList.toggle("bk-toc-open", open);
      if (open) { last = document.activeElement; (panel.querySelector("a") || close).focus(); track("nav_open", "contents"); }
      else if (last) last.focus();
    };
    btn.addEventListener("click", () => set(panel.hidden));
    close.addEventListener("click", () => set(false));
    panel.addEventListener("click", (e) => { if (e.target.closest("a")) set(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) set(false); });
  }

  // Contact form: opens an email draft with the message filled in
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
