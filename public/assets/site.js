(() => {
  const root = document.documentElement;

  // Reveal titles and blocks as they scroll into view
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
