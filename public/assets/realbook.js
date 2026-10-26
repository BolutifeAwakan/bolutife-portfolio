(() => {
  const root = document.documentElement;
  const track = (n, t) => window.baTrack && window.baTrack(n, t);
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

  // Lagos and London clocks
  const tick = () =>
    document.querySelectorAll("time[data-tz]").forEach((t) => {
      t.textContent = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: t.dataset.tz });
    });
  tick();
  setInterval(tick, 30000);

  // Menu (small screens): a native modal dialog
  const mbtn = document.querySelector(".bk-head__menu");
  const menu = document.getElementById("bk-menu");
  if (mbtn && menu && menu.showModal) {
    mbtn.addEventListener("click", () => { menu.showModal(); mbtn.setAttribute("aria-expanded", "true"); root.classList.add("bk-locked"); track("nav_open", "menu"); });
    menu.querySelector(".bk-menu__close").addEventListener("click", () => menu.close());
    menu.addEventListener("close", () => { mbtn.setAttribute("aria-expanded", "false"); root.classList.remove("bk-locked"); mbtn.focus(); });
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
      location.href = `mailto:${form.dataset.mailto}?subject=${encodeURIComponent(`${label}: ${f.get("name")}`)}&body=${encodeURIComponent(`${f.get("message")}\n\n${f.get("name")}\n${f.get("email")}`)}`;
    });
  }

  /* ---------- the book ---------- */

  const stage = document.querySelector(".bk-stage");
  if (!stage) return;
  const book = stage.querySelector("[data-book]");
  const scene = stage.querySelector(".bk-scene");
  const leaves = [...stage.querySelectorAll(".bk-leaf")];
  const N = leaves.length;
  const where = stage.querySelector("[data-where]");
  const prev = stage.querySelector('[data-turn="-1"]');
  const next = stage.querySelector('[data-turn="1"]');
  const soundBtn = stage.querySelector("[data-sound]");
  const chapters = JSON.parse(stage.dataset.chapters || "{}");
  const stops = [...stage.querySelectorAll("[data-stop]")];

  root.classList.add("bk-on");
  stage.style.setProperty("--n", N);

  const single = () => matchMedia("(max-width: 760px)").matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

  // Geometry of the scroll track: one stop per leaf.
  let top = 0, span = 1;
  const measure = () => {
    top = stage.getBoundingClientRect().top + scrollY;
    span = Math.max(1, stage.offsetHeight - innerHeight);
    stops.forEach((s, k) => (s.style.top = `${(span * k) / N}px`));
  };
  const leafToY = (k) => top + (span * k) / N;
  const goTo = (k) => scrollTo({ top: leafToY(clamp(k, 0, N)), behavior: still ? "auto" : "smooth" });

  // Sound: synthesised paper, silent until asked for
  let ctx = null, soundOn = false, lastSound = 0;
  const rustle = () => {
    if (!soundOn || !ctx) return;
    const now = ctx.currentTime;
    if (now - lastSound < 0.12) return;
    lastSound = now;
    const len = 0.32, buf = ctx.createBuffer(1, ctx.sampleRate * len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) { const t = i / d.length; d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.2) * (0.6 + 0.4 * Math.sin(t * 40 + Math.random())); }
    const src = ctx.createBufferSource(); src.buffer = buf;
    const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 2600 + Math.random() * 1400; bp.Q.value = 0.7;
    const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 900;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(0.22, now + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, now + len);
    src.connect(bp).connect(hp).connect(g).connect(ctx.destination);
    src.start(now);
  };
  soundBtn.addEventListener("click", () => {
    soundOn = !soundOn;
    if (soundOn && !ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (AC) ctx = new AC(); }
    if (ctx && ctx.state === "suspended") ctx.resume();
    soundBtn.setAttribute("aria-pressed", String(soundOn));
    soundBtn.textContent = soundOn ? "Sound on" : "Sound off";
    if (soundOn) rustle();
  });

  // Render the book for a reading position t (0 = closed, N = closed again at the back).
  let lastT = -1, lastSpread = -1, crossed = new Array(N).fill(0);
  const render = () => {
    const p = clamp((scrollY - top) / span, 0, 1);
    let t = p * N;
    if (still) t = Math.round(t);
    if (t === lastT) return;
    lastT = t;
    const one = single();

    leaves.forEach((leaf, i) => {
      let a = clamp(t - i, 0, 1);
      const e = still ? Math.round(a) : ease(a);
      leaf.style.setProperty("--deg", `${-180 * e}deg`);
      // shading: the page darkens as it lifts, the underside lightens as it lands
      leaf.style.setProperty("--sf", (Math.min(e, 0.5) * 1.8).toFixed(3));
      leaf.style.setProperty("--sb", (Math.max(0, 1 - e) * 1.8 * (e > 0.5 ? 1 : 0)).toFixed(3));
      leaf.style.zIndex = a > 0 && a < 1 ? N + 2 : a >= 1 ? i + 1 : N - i;
      leaf.classList.toggle("is-gone", one && a >= 1);
      // sound when a page starts to lift or settles
      const zone = a <= 0.04 ? 0 : a >= 0.96 ? 2 : 1;
      if (zone !== crossed[i]) { if (zone === 1) rustle(); crossed[i] = zone; }
    });

    // the book slides so the open spread is centred; closed books sit on one side
    const open = clamp(t, 0, 1), closing = clamp(t - (N - 1), 0, 1);
    const shift = one ? -0.5 : -0.5 + 0.5 * open + 0.5 * closing;
    book.style.setProperty("--shift", shift.toFixed(4));
    book.style.setProperty("--open", (open - closing).toFixed(3));
    book.style.setProperty("--rx", `${(16 - 10 * open + 10 * closing).toFixed(2)}deg`);
    book.style.setProperty("--er", `${Math.max(0, (N - t) * 0.9).toFixed(1)}px`);
    book.style.setProperty("--el", `${Math.max(0, open ? t * 0.9 : 0).toFixed(1)}px`);

    // which pages are showing, and keyboard focus only on those
    const s = Math.round(t);
    if (s !== lastSpread) {
      lastSpread = s;
      stage.querySelectorAll("[data-face]").forEach((f) => {
        const k = +f.dataset.face;
        const visible = k === 2 * s || (!one && k === 2 * s - 1);
        f.inert = !visible;
        f.setAttribute("aria-hidden", String(!visible));
      });
      const right = 2 * s - 1; // printed number of the right-hand page
      where.textContent = s === 0 ? "Scroll to open" : s >= N ? "The end" : s === 1 ? "Title page" : one ? `Page ${right}` : `Pages ${right - 1} and ${right}`;
      prev.disabled = s <= 0;
      next.disabled = s >= N;
    }
  };

  let raf = 0;
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; render(); }); };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", () => { measure(); lastT = -1; render(); });
  measure();
  render();

  // Turning by hand: buttons, keys, a tap on a page edge, or dragging the page
  const current = () => Math.round(clamp((scrollY - top) / span, 0, 1) * N);
  prev.addEventListener("click", () => goTo(current() - 1));
  next.addEventListener("click", () => { goTo(current() + 1); track("home_engaged", "turn"); });
  document.addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea, select, [contenteditable]")) return;
    const r = stage.getBoundingClientRect();
    if (r.top > 10 || r.bottom < innerHeight - 10) return; // only while the book is on screen
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(current() + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current() - 1); }
  });

  let drag = null;
  book.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || e.target.closest("a, button, input, textarea")) return;
    drag = { x: e.clientX, y: scrollY, moved: false, id: e.pointerId };
  });
  addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; book.classList.add("is-drag"); try { book.setPointerCapture(e.pointerId); } catch {} }
    if (drag.moved) {
      const pw = book.offsetWidth / 2;
      scrollTo({ top: drag.y - (dx / pw) * (span / N), behavior: "auto" });
    }
  });
  const endDrag = (e) => {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    const d = drag;
    drag = null;
    book.classList.remove("is-drag");
    if (d.moved) { goTo(Math.round(clamp((scrollY - top) / span, 0, 1) * N)); return; }
    // a tap: right half turns forward, left half back
    if (e && !e.target.closest("a, button")) {
      const r = book.getBoundingClientRect();
      const mid = single() ? r.left + r.width * 0.5 + r.width * 0.25 : r.left + r.width / 2;
      goTo(current() + (e.clientX >= mid - (single() ? r.width * 0.25 : 0) ? 1 : -1));
    }
  };
  addEventListener("pointerup", endDrag);
  addEventListener("pointercancel", () => { drag = null; book.classList.remove("is-drag"); });

  // Contents links turn to their chapter instead of leaving the book
  stage.querySelectorAll("[data-goto]").forEach((a) =>
    a.addEventListener("click", (e) => { e.preventDefault(); goTo(+a.dataset.goto); })
  );
  // Arriving from a chapter page ("Back to the book") opens at that chapter
  const fromHash = () => {
    const k = chapters[location.hash.slice(1)];
    if (k != null) { measure(); scrollTo({ top: leafToY(k), behavior: "auto" }); }
  };
  addEventListener("hashchange", fromHash);
  if (location.hash) setTimeout(fromHash, 60);

  // A lamp over the table, and the book leans a little toward you
  if (fine && !still) {
    let lx = 50, ly = 44;
    scene.addEventListener("pointermove", (e) => {
      const r = scene.getBoundingClientRect();
      lx = ((e.clientX - r.left) / r.width) * 100;
      ly = ((e.clientY - r.top) / r.height) * 100;
      scene.style.setProperty("--lx", `${40 + lx * 0.2}%`);
      scene.style.setProperty("--ly", `${36 + ly * 0.16}%`);
      if (!drag) {
        book.style.setProperty("--ry", `${((lx - 50) / 50) * 3}deg`);
        book.style.setProperty("--lift", `${2 - ((ly - 50) / 50) * 0.8}%`);
      }
    });
  }
})();
