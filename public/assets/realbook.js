(() => {
  const root = document.documentElement;
  const track = (n, t) => window.baTrack && window.baTrack(n, t);
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  // Lagos and London clocks
  const tick = () =>
    document.querySelectorAll("time[data-tz]").forEach((t) => {
      t.textContent = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: t.dataset.tz });
    });
  tick();
  setInterval(tick, 30000);

  // Contents: a native modal dialog
  const mbtn = document.querySelector(".bk-head__menu");
  const menu = document.getElementById("bk-menu");
  if (mbtn && menu && menu.showModal) {
    mbtn.addEventListener("click", () => { menu.showModal(); mbtn.setAttribute("aria-expanded", "true"); root.classList.add("bk-locked"); track("nav_open", "contents"); });
    menu.querySelector(".bk-menu__close").addEventListener("click", () => menu.close());
    menu.addEventListener("close", () => { mbtn.setAttribute("aria-expanded", "false"); root.classList.remove("bk-locked"); mbtn.focus(); });
  }

  // Contact form on the contact page: opens an email draft
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

  /* ================= the experience ================= */

  const ex = document.querySelector(".ex");
  if (!ex) return;
  ex.classList.add("is-live");
  const view = ex.querySelector(".ex-view");
  const cards = [...ex.querySelectorAll(".ex-card")];
  const N = cards.length;
  const run = ex.querySelector("[data-run]");
  const bar = ex.querySelector("[data-bar]");
  const prev = ex.querySelector('[data-step="-1"]');
  const next = ex.querySelector('[data-step="1"]');
  const soundBtn = ex.querySelector("[data-sound]");
  const chapters = JSON.parse(ex.dataset.chapters || "{}");

  /* ---------- sound: a quiet paper slide, off until asked for ---------- */
  let actx = null, soundOn = false;
  const slide = () => {
    if (!soundOn || !actx) return;
    const now = actx.currentTime, len = 0.28;
    const buf = actx.createBuffer(1, Math.floor(actx.sampleRate * len), actx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) { const t = i / d.length; d[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * t) * Math.pow(1 - t, 0.6); }
    const src = actx.createBufferSource(); src.buffer = buf;
    const bp = actx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.setValueAtTime(1800, now); bp.frequency.linearRampToValueAtTime(3600, now + len); bp.Q.value = 0.8;
    const g = actx.createGain(); g.gain.value = 0.09;
    src.connect(bp).connect(g).connect(actx.destination); src.start(now);
  };
  soundBtn.addEventListener("click", () => {
    soundOn = !soundOn;
    if (soundOn && !actx) { const AC = window.AudioContext || window.webkitAudioContext; if (AC) actx = new AC(); }
    if (actx && actx.state === "suspended") actx.resume();
    soundBtn.setAttribute("aria-pressed", String(soundOn));
    soundBtn.textContent = soundOn ? "Sound on" : "Sound off";
    slide();
  });

  /* ---------- the room: pages held on a curve around you ---------- */
  let top = 0, span = 1, R = 1000, theta = 0.8;
  const measure = () => {
    top = ex.getBoundingClientRect().top + scrollY;
    span = Math.max(1, ex.offsetHeight - innerHeight);
    const cw = cards[0].offsetWidth;
    R = cw * (innerWidth < 760 ? 1.05 : 1.12);
    theta = (cw * 1.1) / R; // radians between pages: a page and a little air
    view.style.setProperty("--persp", `${Math.round(R * 0.96)}px`);
  };
  const offset = () => clamp((scrollY - top) / span, 0, 1) * (N - 1);
  const yFor = (i) => top + (span * clamp(i, 0, N - 1)) / (N - 1);

  let here = -1, lastO = -1;
  const render = () => {
    const o = offset();
    if (o === lastO) return;
    lastO = o;
    cards.forEach((c, i) => {
      const d = i - o, ad = Math.abs(d);
      if (ad > 2.6) { c.style.visibility = "hidden"; return; }
      c.style.visibility = "visible";
      const a = -d * theta * (180 / Math.PI);
      c.style.transform = `translateZ(${R}px) rotateY(${a.toFixed(3)}deg) translateZ(${-R}px)`;
      c.style.filter = still ? "" : `blur(${(clamp(ad - 0.12, 0, 1) * 6).toFixed(2)}px)`;
      c.style.opacity = (1 - clamp(ad - 1.5, 0, 1)).toFixed(3);
      c.style.zIndex = String(100 - Math.round(ad * 10));
    });
    const k = Math.round(o);
    if (k !== here) {
      here = k;
      cards.forEach((c, i) => {
        const on = i === k;
        c.classList.toggle("is-here", on);
        c.inert = !on;
        if (on) c.classList.add("is-read");
      });
      run.textContent = cards[k].dataset.label;
      prev.disabled = k === 0;
      next.disabled = k === N - 1;
      slide();
      if (k > 0) track("home_engaged", "move");
    }
    bar.style.setProperty("--prog", `${((o / (N - 1)) * 100).toFixed(1)}%`);
  };
  let raf = 0;
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; render(); }); };
  addEventListener("scroll", onScroll, { passive: true });

  // settle on the nearest page when scrolling stops
  let settleT = 0, held = false;
  const settle = () => {
    clearTimeout(settleT);
    settleT = setTimeout(() => {
      if (held) return;
      const r = ex.getBoundingClientRect();
      if (r.top > 1 || r.bottom < innerHeight - 1) return; // only while the room fills the screen
      const o = offset(), k = Math.round(o);
      if (Math.abs(o - k) > 0.01) scrollTo({ top: yFor(k), behavior: still ? "auto" : "smooth" });
    }, 140);
  };
  addEventListener("scroll", settle, { passive: true });
  const goTo = (i) => scrollTo({ top: yFor(i), behavior: still ? "auto" : "smooth" });

  prev.addEventListener("click", () => goTo(here - 1));
  next.addEventListener("click", () => goTo(here + 1));
  document.addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea, select, [contenteditable], dialog, [role=tablist]")) return;
    const r = ex.getBoundingClientRect();
    if (r.top > 1 || r.bottom < innerHeight - 1) return;
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(here + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(here - 1); }
  });
  // links that move you to a page in the room (doors, contents)
  document.querySelectorAll("[data-goto]").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      if (menu && menu.open) menu.close();
      goTo(+a.dataset.goto);
    })
  );
  // a page off to the side comes to you when you click it
  cards.forEach((c, i) => c.addEventListener("click", (e) => { if (i !== here) { e.preventDefault(); goTo(i); } }));

  // drag the room sideways
  let drag = null;
  view.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || e.target.closest("a, button, input, textarea, label, [data-lens], [data-cues]")) return;
    drag = { x: e.clientX, y: scrollY, moved: false, id: e.pointerId };
  });
  addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 8) { drag.moved = true; held = true; view.classList.add("is-drag"); }
    if (drag.moved) scrollTo({ top: drag.y - (dx / cards[0].offsetWidth) * (span / (N - 1)), behavior: "auto" });
  });
  const endDrag = () => {
    if (!drag) return;
    const moved = drag.moved;
    drag = null; held = false; view.classList.remove("is-drag");
    if (moved) settle();
  };
  addEventListener("pointerup", endDrag);
  addEventListener("pointercancel", endDrag);
  // a sideways trackpad swipe also moves the room
  let wheelAt = 0;
  view.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaX) < 20 || Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
    e.preventDefault();
    const now = performance.now();
    if (now - wheelAt < 600) return;
    wheelAt = now;
    goTo(here + (e.deltaX > 0 ? 1 : -1));
  }, { passive: false });

  /* ---------- things to touch on the pages ---------- */

  // the beginning: each door changes the photograph
  const intro = ex.querySelector(".ex-card--intro");
  if (intro) {
    const line = intro.querySelector(".ex-line");
    const frames = intro.querySelectorAll("[data-frame]");
    let t = 0;
    const show = (k) => {
      clearTimeout(t);
      frames.forEach((f) => f.classList.toggle("is-on", f.dataset.frame === k));
      intro.querySelectorAll("[data-door]").forEach((a) => a.classList.toggle("is-on", a.dataset.door === k));
      line.classList.toggle("has-on", k !== "default");
    };
    intro.querySelectorAll("[data-door]").forEach((a) => {
      a.addEventListener("pointerenter", () => show(a.dataset.door));
      a.addEventListener("focus", () => show(a.dataset.door));
      a.addEventListener("pointerleave", () => { t = setTimeout(() => show("default"), 450); });
      a.addEventListener("blur", () => { t = setTimeout(() => show("default"), 450); });
    });
    setTimeout(() => frames.forEach((f) => f.querySelectorAll("img").forEach((i) => (i.loading = "eager"))), 1200);
  }

  // today: a lens to look closer
  ex.querySelectorAll("[data-lens]").forEach((box) => {
    const lens = box.querySelector(".ex-lens"), inner = box.querySelector(".ex-lens__img"), pic = box.querySelector(".ex-today__img img");
    const Z = 2.2;
    const place = (x, y) => {
      const r = box.getBoundingClientRect();
      if (!r.width) return;
      x = clamp(x, 0, r.width); y = clamp(y, 0, r.height);
      box.style.setProperty("--lx", `${x}px`);
      box.style.setProperty("--ly", `${y}px`);
      const ls = lens.offsetWidth;
      inner.style.backgroundImage = `url("${pic.currentSrc || pic.src}")`;
      inner.style.backgroundSize = `${r.width * Z}px ${r.height * Z}px`;
      inner.style.backgroundPosition = `${-(x * Z - ls / 2)}px ${-(y * Z - ls / 2)}px`;
    };
    const fromEvent = (e) => { const r = box.getBoundingClientRect(); place(e.clientX - r.left, e.clientY - r.top); };
    box.addEventListener("pointermove", fromEvent);
    box.addEventListener("pointerdown", (e) => { fromEvent(e); try { box.setPointerCapture(e.pointerId); } catch {} });
    const start = () => { const r = box.getBoundingClientRect(); place(r.width * 0.58, r.height * 0.36); };
    if (pic.complete) start(); else pic.addEventListener("load", start, { once: true });
    addEventListener("resize", start);
  });

  // who I am: the three parts of the arc
  ex.querySelectorAll("[data-tabs]").forEach((box) => {
    const tabs = [...box.querySelectorAll("[role=tab]")];
    const frames = box.querySelectorAll("[data-frame]");
    const pick = (t, focus) => {
      tabs.forEach((x) => {
        const on = x === t;
        x.setAttribute("aria-selected", String(on));
        x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
      });
      const k = t.id.replace("arc-t-", "");
      frames.forEach((f) => f.classList.toggle("is-on", f.dataset.frame === k));
      if (focus) t.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => pick(t));
      t.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); pick(tabs[(i + 1) % tabs.length], true); }
        if (e.key === "ArrowLeft") { e.preventDefault(); pick(tabs[(i - 1 + tabs.length) % tabs.length], true); }
      });
    });
  });

  // the work, and the side collection, lean toward the hand
  if (fine && !still) {
    ex.querySelectorAll("[data-cloud], [data-drift]").forEach((box) => {
      box.addEventListener("pointermove", (e) => {
        const r = box.getBoundingClientRect();
        box.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
        box.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
      });
      box.addEventListener("pointerleave", () => { box.style.setProperty("--mx", 0); box.style.setProperty("--my", 0); });
    });
    ex.querySelectorAll("[data-drift] li").forEach((li) => li.style.setProperty("--d", li.dataset.depth));
  }

  // on stage: cue cards you flip through
  ex.querySelectorAll("[data-cues]").forEach((box) => {
    const cues = [...box.querySelectorAll(".ex-cue")];
    let first = 0;
    const lay = () => cues.forEach((c, i) => c.style.setProperty("--o", (i - first + cues.length) % cues.length));
    lay();
    box.querySelector(".ex-cues__btn").addEventListener("click", () => {
      const out = cues[first];
      out.classList.add("is-gone");
      setTimeout(() => { out.classList.remove("is-gone"); first = (first + 1) % cues.length; lay(); }, still ? 0 : 380);
      slide();
    });
  });

  // work with me: a note, signed, sent as an email draft
  ex.querySelectorAll("[data-note]").forEach((f) =>
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = new FormData(f);
      track("contact_submit", "note");
      location.href = `mailto:${f.dataset.mailto}?subject=${encodeURIComponent(`A note from ${d.get("name")}`)}&body=${encodeURIComponent(`${d.get("note")}\n\nYours,\n${d.get("name")}`)}`;
    })
  );

  /* ---------- start ---------- */
  addEventListener("resize", () => { measure(); lastO = -1; render(); });
  measure();
  render();
  const k = chapters[location.hash.slice(1)];
  if (k != null) { measure(); scrollTo({ top: yFor(k), behavior: "auto" }); }
  addEventListener("hashchange", () => { const j = chapters[location.hash.slice(1)]; if (j != null) goTo(j); });
})();
