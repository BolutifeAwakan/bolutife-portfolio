(() => {
  const root = document.documentElement;
  const track = (n, t) => window.baTrack && window.baTrack(n, t);

  // Lagos and London clocks
  const tick = () => document.querySelectorAll("time[data-tz]").forEach((t) => {
    t.textContent = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: t.dataset.tz });
  });
  tick();
  setInterval(tick, 30000);

  // Full-screen menu on small screens
  const btn = document.querySelector(".ed-head__menu");
  const menu = document.getElementById("ed-menu");
  if (btn && menu) {
    const close = menu.querySelector(".ed-menu__close");
    let last = null;
    const set = (open) => {
      menu.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
      root.classList.toggle("ed-menu-open", open);
      if (open) { last = document.activeElement; menu.querySelector("a").focus(); track("nav_open", "menu"); }
      else if (last) last.focus();
    };
    btn.addEventListener("click", () => set(menu.hidden));
    close.addEventListener("click", () => set(false));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) set(false); });
    addEventListener("resize", () => { if (!menu.hidden && innerWidth > 960) set(false); });
  }

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
