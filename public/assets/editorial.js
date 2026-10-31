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
      name.style.setProperty("--split", (p * p * (3 - 2 * p)).toFixed(4));
    };
    addEventListener("scroll", () => { if (!hq) { hq = true; requestAnimationFrame(split); } }, { passive: true });
    split();
  }

  // Page headlines with the same giant type break in the middle too, once they
  // are in the top half of the screen and you keep scrolling.
  const splits = [...document.querySelectorAll("[data-split]")];
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
})();
