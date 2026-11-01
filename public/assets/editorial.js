(() => {
  const root = document.documentElement;
  const track = (n, t) => window.baTrack && window.baTrack(n, t);
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Light and dark mode. The choice is remembered on this device.
  const themeBtn = document.querySelector("[data-theme-toggle]");
  const setThemeLabel = () => {
    if (!themeBtn) return;
    const light = root.dataset.theme === "light";
    themeBtn.title = light ? "Dark mode" : "Light mode";
    themeBtn.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
  };
  setThemeLabel();
  if (themeBtn) themeBtn.addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.classList.add("is-theming");
    root.dataset.theme = next;
    try { localStorage.setItem("ba-theme", next); } catch (e) {}
    setThemeLabel();
    track("theme", next);
    setTimeout(() => root.classList.remove("is-theming"), 450);
  });

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

  // Hero: as you scroll on, the first name breaks in the middle and its halves
  // slide out of the frame, left and right.
  const hero = document.querySelector(".ed-hero");
  if (hero && !still) {
    const name = hero.querySelector(".ed-hero__name");
    let hq = false;
    const split = () => {
      hq = false;
      const r = hero.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height * 0.7)));
      hero.style.setProperty("--split", (p * p * (3 - 2 * p)).toFixed(4));
    };
    addEventListener("scroll", () => { if (!hq) { hq = true; requestAnimationFrame(split); } }, { passive: true });
    split();
    // "Scroll down" sits just above the last letter of the name.
    const sd = hero.querySelector(".ed-hero__scroll");
    const place = () => {
      if (!sd || getComputedStyle(sd).display === "none") return;
      const n = name.querySelector(".ed-fit__in").getBoundingClientRect(), h = hero.getBoundingClientRect();
      sd.style.bottom = `${Math.round(h.bottom - n.top + 6)}px`;
    };
    place();
    if (document.fonts) document.fonts.ready.then(place);
    addEventListener("resize", place);
  }

  // Page headlines with the same giant type break in the middle too, once they
  // are in the top half of the screen and you keep scrolling.
  const splits = [...document.querySelectorAll("[data-split]")].filter((el) => !el.closest("[data-curtain]"));
  // A curtain headline: the page holds while the two halves of the headline, each on its own
  // panel, part from the cut in the word and reveal the section waiting underneath.
  document.querySelectorAll("[data-curtain]").forEach((cur) => {
    if (still) return;
    root.classList.add("has-curtain");
    const inner = cur.querySelector(".ed-curtain");
    const right = cur.querySelector(".ed-ch--r");
    const measure = () => {
      cur.style.setProperty("--split", "0");
      if (right) inner.style.setProperty("--cut", `${Math.round(right.getBoundingClientRect().left)}px`);
    };
    let cq = false;
    const run = () => {
      cq = false;
      const span = cur.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, (scrollY - cur.offsetTop) / (span * 0.85 || 1)));
      cur.style.setProperty("--split", (p * p * (3 - 2 * p)).toFixed(4));
    };
    measure();
    run();
    addEventListener("resize", () => { measure(); run(); });
    if (document.fonts) document.fonts.ready.then(() => { measure(); run(); });
    addEventListener("scroll", () => { if (!cq) { cq = true; requestAnimationFrame(run); } }, { passive: true });
  });
  if (splits.length && !still) {
    let sq = false;
    const run = () => {
      sq = false;
      const vh = innerHeight;
      splits.forEach((el) => {
        const top = el.getBoundingClientRect().top + scrollY;
        const start = Math.max(0, top - vh * 0.5);
        const p = Math.min(1, Math.max(0, (scrollY - start) / (vh * 0.6)));
        el.style.setProperty("--split", (p * p * (3 - 2 * p)).toFixed(4));
      });
    };
    addEventListener("scroll", () => { if (!sq) { sq = true; requestAnimationFrame(run); } }, { passive: true });
    run();
  }

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

  // The desk: one card per interest. Hover a card (or its name) and the others
  // lean away; open it and the rest gather in a row below while what she loves
  // in that interest opens beside it. Cards can still be dragged when nothing is open.
  document.querySelectorAll("[data-desk]").forEach((desk) => {
    const sec = desk.closest(".ed-side") || document;
    const tags = [...sec.querySelectorAll(".ed-tags--live [data-interest]")];
    const cards = [...desk.querySelectorAll("[data-drag]")];
    const panel = desk.querySelector(".ed-desk__panel");
    const panels = [...desk.querySelectorAll(".ed-dp")];
    const TILT = [-6, 4, -3, 5, -5, 3];
    const st = cards.map((c, i) => ({ c, ox: 0, oy: 0, rot: TILT[i % TILT.length] }));
    const wide = () => innerWidth > 800;
    let open = null, hover = null, z = 10, baseH = 0, spread = still ? 1 : 0;
    const PILE = [-5, 4, -2, 6, -1];

    const layout = () => {
      if (!open) { desk.style.minHeight = ""; baseH = desk.clientHeight; }
      const W = desk.clientWidth, H = baseH || desk.clientHeight;
      const pickedIdx = open ? cards.findIndex((c) => c.dataset.interest === open) : -1;
      const hoverIdx = !open && hover ? cards.findIndex((c) => c.dataset.interest === hover) : -1;
      const others = st.filter((_, i) => i !== pickedIdx);
      // Where the row of other cards sits: under both the open card and its panel.
      let rowTop = 0;
      if (open && wide() && pickedIdx >= 0) {
        const pc = st[pickedIdx].c, pw = pc.offsetWidth;
        const psc = Math.min(1.35, (W * 0.42) / pw);
        panel.style.left = `${W * 0.03 + pw * psc + W * 0.05}px`;
        rowTop = Math.max(pc.offsetHeight * psc, panel.offsetTop + panel.offsetHeight) + 48;
        const rowH = pc.offsetHeight * 0.42;
        desk.style.minHeight = `${Math.max(H, rowTop + rowH + 24)}px`;
      } else desk.style.minHeight = "";
      st.forEach((s, i) => {
        const c = s.c;
        if (!wide()) { c.style.transform = ""; return; }
        const w = c.offsetWidth, h = c.offsetHeight, x0 = c.offsetLeft, y0 = c.offsetTop;
        let tx = s.ox, ty = s.oy, sc = 1, r = s.rot;
        if (open) {
          if (i === pickedIdx) {
            // the chosen card comes forward on the left
            sc = Math.min(1.35, (W * 0.42) / w);
            tx = W * 0.03 + (w * sc) / 2 - (x0 + w / 2);
            ty = (h * sc) / 2 - (y0 + h / 2);
            r = -2;
          } else {
            // the rest gather in a loose row along the bottom, ready to be opened next
            const k = others.indexOf(s), n = others.length;
            const s2 = 0.42, gap = 14;
            const cx = W * 0.03 + k * (w * s2 + gap) + (w * s2) / 2;
            const cy = rowTop + (h * s2) / 2;
            tx = cx - (x0 + w / 2); ty = cy - (y0 + h / 2); sc = s2; r = (k % 2 ? 4 : -4);
          }
        } else if (spread < 1) {
          // Before the section is in view the cards sit in one pile in the middle
          // of the desk; scrolling deals them out to their places.
          const e = spread * spread * (3 - 2 * spread), k = 1 - e;
          tx = s.ox + (W / 2 - (x0 + w / 2)) * k;
          ty = s.oy + (H * 0.42 - (y0 + h / 2)) * k;
          r = s.rot * e + PILE[i % PILE.length] * k;
          sc = 1 - 0.06 * k;
        } else if (hoverIdx >= 0) {
          if (i === hoverIdx) { sc = 1.06; r = 0; }
          else {
            // lean away from the card being looked at
            const hc = st[hoverIdx].c;
            const dx = (x0 + w / 2) - (hc.offsetLeft + hc.offsetWidth / 2);
            const dy = (y0 + h / 2) - (hc.offsetTop + hc.offsetHeight / 2);
            const d = Math.hypot(dx, dy) || 1;
            tx += (dx / d) * 46; ty += (dy / d) * 46; sc = 0.96;
          }
        }
        c.style.transform = `translate(${tx}px, ${ty}px) rotate(${still ? 0 : r}deg) scale(${sc})`;
      });
    };

    const setOpen = (key) => {
      open = key && key !== open ? key : null;
      hover = null;
      desk.classList.toggle("is-open", !!open);
      cards.forEach((c) => {
        const on = c.dataset.interest === open;
        c.classList.toggle("is-picked", on);
        c.setAttribute("aria-expanded", String(on));
        if (on) c.style.zIndex = ++z;
      });
      panels.forEach((p) => (p.hidden = p.dataset.for !== open));
      tags.forEach((t) => t.setAttribute("aria-pressed", String(t.dataset.interest === open)));
      focus();
      if (open) {
        track("side_open", open);
        if (!wide()) panel.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "nearest" });
      }
      layout();
    };
    // Tunnel vision: the card being looked at stays sharp; the rest falls back.
    const side = desk.closest(".ed-side");
    const focus = () => {
      const hot = open || hover;
      if (side) side.classList.toggle("is-focus", !!hot);
      cards.forEach((c) => c.classList.toggle("is-hot", c.dataset.interest === hover || c.dataset.interest === open));
    };
    const setHover = (key) => {
      if (open) { hover = key; focus(); return; } // in the open view, hovering a waiting card just brings it into focus
      if (!wide()) return;
      hover = key; layout(); focus();
    };

    tags.forEach((t) => {
      t.addEventListener("click", () => setOpen(t.dataset.interest));
      if (fine) { t.addEventListener("pointerenter", () => setHover(t.dataset.interest)); t.addEventListener("pointerleave", () => setHover(null)); }
    });
    desk.querySelectorAll(".ed-dp__close").forEach((b) => b.addEventListener("click", () => setOpen(null)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && open) setOpen(null); });

    st.forEach((s) => {
      const c = s.c;
      let sx, sy, down = false, moved = false;
      c.addEventListener("pointerenter", () => { if (fine && !down) setHover(c.dataset.interest); });
      c.addEventListener("pointerleave", () => { if (fine && !down) setHover(null); });
      c.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(c.dataset.interest); } });
      c.addEventListener("pointerdown", (e) => {
        down = true; moved = false;
        if (!(fine && wide()) || open) return;
        c.setPointerCapture(e.pointerId);
        c.style.zIndex = ++z;
        sx = e.clientX - s.ox; sy = e.clientY - s.oy;
      });
      c.addEventListener("pointermove", (e) => {
        if (!down || open || !(fine && wide()) || sx === undefined) return;
        const nx = e.clientX - sx, ny = e.clientY - sy;
        if (!moved && Math.abs(nx - s.ox) + Math.abs(ny - s.oy) < 5) return;
        moved = true; hover = null; c.classList.add("is-drag");
        s.ox = nx; s.oy = ny; s.rot = TILT[cards.indexOf(c) % TILT.length] + nx * 0.01;
        layout();
      });
      const end = () => { down = false; sx = undefined; c.classList.remove("is-drag"); };
      c.addEventListener("pointerup", () => { const wasMove = moved; end(); if (!wasMove) setOpen(c.dataset.interest); });
      c.addEventListener("pointercancel", end);
    });

    // Scroll deals the pile out: 0 while the desk is below the fold, 1 once it is well in view.
    if (!still) {
      let q = false;
      const deal = () => {
        q = false;
        const t = desk.getBoundingClientRect().top;
        const next = Math.min(1, Math.max(0, (innerHeight * 0.7 - t) / (innerHeight * 0.65)));
        if (Math.abs(next - spread) < 0.002 || open) return;
        spread = next;
        desk.classList.toggle("is-dealing", spread < 1);
        layout();
      };
      addEventListener("scroll", () => { if (!q) { q = true; requestAnimationFrame(deal); } }, { passive: true });
      deal();
    }
    let rt2;
    addEventListener("resize", () => { clearTimeout(rt2); rt2 = setTimeout(layout, 120); });
    layout();
  });

  // Music: each song plays its 30-second store preview; one at a time.
  const audio = new Audio();
  let playing = null;
  const stop = () => { audio.pause(); if (playing) playing.classList.remove("is-playing"); playing = null; };
  audio.addEventListener("ended", stop);
  document.querySelectorAll("[data-playlist] .ed-play__row").forEach((b) => {
    b.addEventListener("click", () => {
      const li = b.closest("li");
      if (playing === li) return stop();
      stop();
      if (!b.dataset.preview) return;
      audio.src = b.dataset.preview;
      audio.play().then(() => { playing = li; li.classList.add("is-playing"); track("side_play", b.querySelector(".ed-play__t").textContent); }).catch(() => {});
    });
  });
  // Leaving the desk or opening another interest stops the music.
  document.querySelectorAll(".ed-dp__close, .ed-tags--live [data-interest], .ed-desk__p").forEach((el) => el.addEventListener("click", () => { if (!el.closest(".ed-dp--playlist")) stop(); }));

  // About: the badge drops in on a spring, swings on its long strap, and settles.
  // Time-based, so it is equally smooth at 60Hz and 120Hz; the pointer can nudge it afterwards.
  const badge = document.querySelector("[data-badge]");
  if (badge && !still) {
    badge.classList.add("is-live");
    const H = innerHeight * 1.1;
    let y = -H, vy = 0, ang = 3.5, va = 0, last = 0, raf = 0, landed = false, lastX = null;
    const paint = () => { badge.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) rotate(${ang.toFixed(3)}deg)`; };
    paint();
    const step = (t) => {
      const dt = Math.min(0.032, last ? (t - last) / 1000 : 0.016);
      last = t;
      // drop: slightly underdamped, so it dips a touch past rest and eases back
      vy += (-y * 34 - vy * 9.5) * dt; y += vy * dt;
      // swing: a slow pendulum with light damping, a few long, shrinking arcs
      if (!landed && y > -40) { landed = true; va += -vy * 0.004; }
      va += (-ang * 9 - va * 1.5) * dt; ang += va * dt;
      paint();
      if (Math.abs(y) + Math.abs(vy) + Math.abs(ang) * 20 + Math.abs(va) * 20 > 0.05) raf = requestAnimationFrame(step);
      else { y = vy = ang = va = 0; badge.style.transform = ""; raf = 0; last = 0; }
    };
    setTimeout(() => (raf = requestAnimationFrame(step)), 200);
    if (fine) badge.closest("section").addEventListener("pointermove", (e) => {
      if (lastX !== null) {
        const r = badge.getBoundingClientRect();
        const near = Math.abs(e.clientX - (r.left + r.width / 2)) < r.width && e.clientY > r.top - 40 && e.clientY < r.bottom + 40;
        if (near) va += Math.max(-4, Math.min(4, (e.clientX - lastX) * 0.12));
        if (near && !raf) raf = requestAnimationFrame(step);
      }
      lastX = e.clientX;
    });
  }

  // About: the path draws itself through each stop as you scroll.
  document.querySelectorAll("[data-path]").forEach((wrap) => {
    const svg = wrap.querySelector("svg"), track = wrap.querySelector(".ed-path__track"), line = wrap.querySelector(".ed-path__line");
    const stops = [...wrap.querySelectorAll(".ed-path__stop")];
    let pts = [], len = 0, q = false;
    const build = () => {
      const w = wrap.getBoundingClientRect();
      pts = stops.map((st) => { const d = st.querySelector(".ed-path__dot").getBoundingClientRect(); return [d.left + d.width / 2 - w.left, d.top + d.height / 2 - w.top]; });
      if (!pts.length) return;
      let d = `M ${pts[0][0]} 0 L ${pts[0][0]} ${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], my = (y0 + y1) / 2;
        d += ` C ${x0} ${my}, ${x1} ${my}, ${x1} ${y1}`;
      }
      const last = pts[pts.length - 1];
      d += ` L ${last[0]} ${w.height}`;
      track.setAttribute("d", d); line.setAttribute("d", d);
      svg.setAttribute("viewBox", `0 0 ${w.width} ${w.height}`);
      len = line.getTotalLength();
      line.style.strokeDasharray = `${len}`;
      draw();
    };
    const draw = () => {
      q = false;
      if (!len) return;
      const r = wrap.getBoundingClientRect();
      const head = still ? r.height : Math.min(r.height, Math.max(0, innerHeight * 0.62 - r.top));
      // how much of the path lies above the drawing head
      let lo = 0, hi = len;
      for (let k = 0; k < 18; k++) { const mid = (lo + hi) / 2; if (line.getPointAtLength(mid).y < head) lo = mid; else hi = mid; }
      line.style.strokeDashoffset = `${len - lo}`;
      stops.forEach((st, i) => st.classList.toggle("is-on", pts[i] && pts[i][1] <= head));
    };
    build();
    if (document.fonts) document.fonts.ready.then(build);
    addEventListener("load", build);
    addEventListener("resize", build);
    addEventListener("scroll", () => { if (!q) { q = true; requestAnimationFrame(draw); } }, { passive: true });
  });

  // About: experience tabs.
  document.querySelectorAll(".ed-tabs").forEach((list) => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const show = (t) => {
      tabs.forEach((x) => {
        const on = x === t;
        x.setAttribute("aria-selected", String(on));
        x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
      });
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => show(t));
      t.addEventListener("keydown", (e) => {
        const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); show(n);
      });
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

  // Thoughts: the CV is given in exchange for a name and an email; the download starts on send.
  document.querySelectorAll("[data-lead]").forEach((f) => {
    const note = f.querySelector("[data-lead-note]");
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!f.reportValidity()) return;
      const btn = f.querySelector("button[type=submit]");
      btn.disabled = true;
      const v = (n) => f.elements[n] ? f.elements[n].value : "";
      try {
        await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: v("name"), email: v("email"), org: v("org"), asset: f.dataset.lead, page: location.pathname }) });
      } catch (err) {}
      track("download", f.dataset.lead);
      const a = document.createElement("a"); a.href = f.dataset.file; a.download = ""; document.body.appendChild(a); a.click(); a.remove();
      if (note) note.textContent = "Thanks, your download has started. ";
      if (note && !note.querySelector("a")) { const l = document.createElement("a"); l.href = f.dataset.file; l.download = ""; l.textContent = "Download it again"; note.appendChild(l); }
      btn.disabled = false;
    });
  });
  // Sideways scrollers (Talks): arrow buttons move one card at a time and dim at the ends.
  document.querySelectorAll("[data-scroller]").forEach((row) => {
    const wrap = row.parentElement;
    const btns = wrap.querySelectorAll("[data-scroll]");
    const step = () => { const c = row.querySelector("li"); return c ? c.getBoundingClientRect().width + parseFloat(getComputedStyle(row).columnGap || 0) : row.clientWidth; };
    let update = () => { btns.forEach((b) => { b.disabled = b.dataset.scroll < 0 ? row.scrollLeft < 4 : row.scrollLeft + row.clientWidth > row.scrollWidth - 4; }); };
    btns.forEach((b) => b.addEventListener("click", () => row.scrollBy({ left: step() * Number(b.dataset.scroll), behavior: still ? "auto" : "smooth" })));
    row.addEventListener("scroll", () => update(), { passive: true });
    addEventListener("resize", () => update());
    update();
    // Steps on by itself, one card every few seconds, and keeps going forward for ever:
    // the cards are repeated once, and after passing the last original the row quietly
    // shifts back by exactly one set, so it never rewinds to the first card on screen.
    // Holds while off screen, hovered, focused or touched, and never runs with reduced motion.
    if (still) return;
    const originals = [...row.children];
    originals.forEach((li) => { const c = li.cloneNode(true); c.setAttribute("aria-hidden", "true"); c.querySelectorAll("a, button").forEach((x) => x.setAttribute("tabindex", "-1")); row.appendChild(c); });
    const period = () => row.children[originals.length].offsetLeft - row.children[0].offsetLeft;
    const wrapBack = () => { const p = period(); if (row.scrollLeft >= p) { row.style.scrollSnapType = "none"; row.scrollLeft -= p; requestAnimationFrame(() => (row.style.scrollSnapType = "")); } };
    const wrapFwd = () => { const p = period(); if (row.scrollLeft < 4) { row.style.scrollSnapType = "none"; row.scrollLeft += p; requestAnimationFrame(() => (row.style.scrollSnapType = "")); } };
    let settle = 0;
    row.addEventListener("scroll", () => { clearTimeout(settle); settle = setTimeout(wrapBack, 160); }, { passive: true });
    btns.forEach((b) => { if (b.dataset.scroll < 0) b.addEventListener("click", wrapFwd, { capture: true }); });
    let held = false, seen = false;
    const hold = (v) => () => { held = v; };
    ["pointerenter", "focusin", "touchstart"].forEach((e) => wrap.addEventListener(e, hold(true), { passive: true }));
    ["pointerleave", "focusout"].forEach((e) => wrap.addEventListener(e, hold(false)));
    wrap.addEventListener("touchend", () => setTimeout(() => { held = false; }, 3000), { passive: true });
    new IntersectionObserver((es) => { seen = es[0].isIntersecting; }, { threshold: 0.3 }).observe(row);
    setInterval(() => { if (!held && seen && !document.hidden) row.scrollBy({ left: step(), behavior: "smooth" }); }, 3200);
    btns.forEach((b) => (b.disabled = false));
    update = () => {};
  });

  // Topics: one subject forward at a time; its line shows beside the list.
  document.querySelectorAll("[data-tops]").forEach((box) => {
    const btns = [...box.querySelectorAll(".ed-tops__t")];
    const caps = [...box.querySelectorAll(".ed-tops__cap [data-i]")];
    const show = (i) => {
      btns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.i === i)));
      caps.forEach((c) => { c.hidden = c.dataset.i !== i; });
    };
    btns.forEach((b) => {
      b.addEventListener("click", () => show(b.dataset.i));
      b.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(b.dataset.i); } });
      b.addEventListener("focus", () => show(b.dataset.i));
      b.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") show(b.dataset.i); });
    });
  });
})();
