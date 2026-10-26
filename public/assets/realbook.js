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

  /* ================= the book ================= */

  const stage = document.querySelector(".bk-stage");
  if (!stage) return;
  const book = stage.querySelector("[data-book]");
  const scene = stage.querySelector(".bk-scene");
  const faces = [...stage.querySelectorAll("[data-p]")];
  const blank = stage.querySelector("[data-blank]");
  const fxU = stage.querySelector(".bk-fx--under");
  const fxF = stage.querySelector(".bk-fx--flap");
  const where = stage.querySelector("[data-where]");
  const hint = stage.querySelector(".bk-hint");
  const prevBtn = stage.querySelector('[data-turn="-1"]');
  const nextBtn = stage.querySelector('[data-turn="1"]');
  const soundBtn = stage.querySelector("[data-sound]");
  const chapters = JSON.parse(stage.dataset.chapters || "{}");
  const M = faces.length;
  const S = M / 2; // last spread: the back cover on its own
  const hard = (k) => !!faces[k] && faces[k].classList.contains("bk-face--hard");

  root.classList.add("bk-on");
  const mqSingle = matchMedia("(max-width: 760px)");
  let single = mqSingle.matches;
  stage.classList.toggle("is-single", single);

  let pos = 0; // desktop: the open spread (0 closed … S closed at the back); single: the page showing
  let pw = 0, ph = 0;
  const measure = () => { ph = book.offsetHeight; pw = single ? book.offsetWidth : book.offsetWidth / 2; };

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const maxPos = () => (single ? M - 1 : S);

  /* ---------- sound: paper, made on the spot, silent until asked for ---------- */
  let actx = null, soundOn = false;
  const noise = (len, f, q, gain, hp = 700) => {
    if (!soundOn || !actx) return;
    const now = actx.currentTime;
    const buf = actx.createBuffer(1, Math.floor(actx.sampleRate * len), actx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) { const t = i / d.length; d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2) * (0.55 + 0.45 * Math.sin(t * 38 + Math.random() * 2)); }
    const src = actx.createBufferSource(); src.buffer = buf;
    const bp = actx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = f; bp.Q.value = q;
    const hpf = actx.createBiquadFilter(); hpf.type = "highpass"; hpf.frequency.value = hp;
    const g = actx.createGain(); g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(gain, now + 0.025); g.gain.exponentialRampToValueAtTime(0.0001, now + len);
    src.connect(bp).connect(hpf).connect(g).connect(actx.destination); src.start(now);
  };
  const rustle = () => noise(0.34, 2400 + Math.random() * 1600, 0.6, 0.2);
  const settle = () => noise(0.12, 600, 1.2, 0.12, 120);
  const thud = () => noise(0.18, 220, 0.9, 0.3, 40);
  soundBtn.addEventListener("click", () => {
    soundOn = !soundOn;
    if (soundOn && !actx) { const AC = window.AudioContext || window.webkitAudioContext; if (AC) actx = new AC(); }
    if (actx && actx.state === "suspended") actx.resume();
    soundBtn.setAttribute("aria-pressed", String(soundOn));
    soundBtn.textContent = soundOn ? "Sound on" : "Sound off";
    if (soundOn) rustle();
  });

  /* ---------- the book at rest ---------- */
  const SLOT_CLASSES = ["is-l", "is-r", "is-under", "is-static", "is-front", "is-back"];
  const reset = (el) => {
    if (!el) return;
    el.classList.remove(...SLOT_CLASSES);
    el.style.clipPath = el.style.transform = el.style.transformOrigin = el.style.left = el.style.filter = el.style.visibility = "";
  };
  const hideFx = () => { [fxU, fxF].forEach((f) => { f.classList.remove("is-on"); f.style.cssText = ""; }); };

  const visibleFaces = () => (single ? [pos] : [2 * pos - 1, 2 * pos]).filter((k) => k >= 0 && k < M);

  const rest = () => {
    faces.forEach(reset); reset(blank); hideFx();
    book.classList.remove("is-live");
    if (single) {
      faces[pos].classList.add("is-r", "is-static");
    } else {
      if (faces[2 * pos - 1]) faces[2 * pos - 1].classList.add("is-l", "is-static");
      if (faces[2 * pos]) faces[2 * pos].classList.add("is-r", "is-static");
    }
    setShift(single ? 0 : pos === 0 ? -0.5 : pos === S ? 0.5 : 0);
    const f = pos / maxPos();
    book.style.setProperty("--el", `${pos === 0 ? 0 : Math.max(2, f * 14).toFixed(1)}px`);
    book.style.setProperty("--er", `${pos === maxPos() ? 0 : Math.max(2, (1 - f) * 14).toFixed(1)}px`);
    const vis = visibleFaces();
    faces.forEach((el, k) => { const on = vis.includes(k); el.inert = !on; el.setAttribute("aria-hidden", String(!on)); });
    prevBtn.disabled = pos <= 0;
    nextBtn.disabled = pos >= maxPos();
    where.textContent = label();
  };
  const setShift = (v) => {
    book.style.setProperty("--shift", v.toFixed(4));
    book.style.setProperty("--shadow-left", v < 0 ? `${(50 + v * 100).toFixed(1)}%` : "-2%");
    book.style.setProperty("--shadow-right", v > 0 ? `${(50 - (0.5 - v) * 100).toFixed(1)}%` : "-2%");
  };
  const label = () => {
    if (pos === 0) return "Lift the cover";
    if (pos === maxPos()) return "The end";
    if (single) return pos === 1 ? "Inside cover" : pos === 2 ? "Title page" : `Page ${pos - 1}`;
    return pos === 1 ? "Title page" : `Pages ${2 * pos - 2} and ${2 * pos - 1}`;
  };

  /* ---------- a page in the hand ---------- */
  // A turn folds one sheet. Geometry is worked out in "sheet" space: the
  // spine is at x = 0 and the free edge at x = pw, whichever side it is on.
  let turn = null;

  const begin = (dir, corner) => {
    let t = null;
    if (single) {
      if (dir > 0 && pos < M - 1) t = { dir, front: faces[pos], back: blank, under: faces[pos + 1], slot: "r", hard: hard(pos) };
      if (dir < 0 && pos > 0) t = { dir, front: faces[pos - 1], back: blank, under: faces[pos], slot: "r", hard: hard(pos - 1), reverse: true };
    } else {
      if (dir > 0 && pos < S) t = { dir, front: faces[2 * pos], back: faces[2 * pos + 1], under: faces[2 * pos + 2], slot: "r", hard: hard(2 * pos) || hard(2 * pos + 1) };
      if (dir < 0 && pos > 0) t = { dir, front: faces[2 * pos - 1], back: faces[2 * pos - 2], under: faces[2 * pos - 3], slot: "l", hard: hard(2 * pos - 1) || hard(2 * pos - 2) };
    }
    if (!t) return null;
    t.O = { x: pw, y: corner === "top" ? 0 : ph };
    t.L = { x: -pw, y: t.O.y };
    t.P = t.reverse ? { ...t.L } : { ...t.O };
    // lay the sheet out
    [t.front, t.back, t.under].forEach(reset);
    if (t.under) t.under.classList.add(t.slot === "l" ? "is-l" : "is-r", "is-under");
    t.front.classList.add(t.slot === "l" ? "is-l" : "is-r", "is-front");
    if (t.back) t.back.classList.add("is-back");
    book.classList.add("is-live");
    if (hint) hint.classList.add("is-gone");
    turn = t;
    draw(t);
    return t;
  };

  const progress = (t) => clamp((t.O.x - t.P.x) / (2 * pw), 0, 1); // 0 flat, 1 turned

  const draw = (t) => (t.hard ? drawHard(t) : drawSoft(t));

  // Hard boards (the covers) swing on the hinge.
  const drawHard = (t) => {
    const p = progress(t), deg = 180 * (still ? Math.round(p) : p);
    const persp = `perspective(${Math.round(pw * 4)}px)`;
    const fl = t.slot === "l";
    t.front.style.transformOrigin = fl ? "100% 50%" : "0 50%";
    t.front.style.transform = `${persp} rotateY(${fl ? deg : -deg}deg)`;
    t.front.style.visibility = deg < 90 ? "visible" : "hidden";
    t.front.style.filter = `brightness(${(1 - 0.35 * Math.sin((deg * Math.PI) / 180)).toFixed(3)})`;
    if (t.back && t.back !== blank) {
      t.back.classList.add(fl ? "is-r" : "is-l");
      t.back.style.transformOrigin = fl ? "0 50%" : "100% 50%";
      t.back.style.transform = `${persp} rotateY(${fl ? -(180 - deg) : 180 - deg}deg)`;
      t.back.style.visibility = deg >= 90 ? "visible" : "hidden";
      t.back.style.filter = `brightness(${(1 - 0.35 * Math.sin((deg * Math.PI) / 180)).toFixed(3)})`;
    }
    if (!single) {
      const from = pos === 0 && t.dir > 0 ? -0.5 : pos === S && t.dir < 0 ? 0.5 : 0;
      const to = pos === 0 && t.dir > 0 ? 0 : pos === S - 1 && t.dir > 0 ? 0.5 : pos === 1 && t.dir < 0 ? -0.5 : pos === S && t.dir < 0 ? 0 : 0;
      setShift(from + (to - from) * p);
    }
  };

  // Paper folds along the line halfway between the corner and the hand.
  const drawSoft = (t) => {
    const O = t.O;
    let P = constrain(t.P, O);
    const dx = O.x - P.x, dy = O.y - P.y, d = Math.hypot(dx, dy);
    const fl = t.slot === "l";
    const slotLeft = single ? 0 : fl ? 0 : pw;
    if (d < 0.5) {
      t.front.style.clipPath = "";
      if (t.back) t.back.style.visibility = "hidden";
      hideFx();
      return;
    }
    const n = { x: dx / d, y: dy / d };
    const Mid = { x: (O.x + P.x) / 2, y: (O.y + P.y) / 2 };
    const side = (q) => (q[0] - Mid.x) * n.x + (q[1] - Mid.y) * n.y;
    const rect = [[0, 0], [pw, 0], [pw, ph], [0, ph]];
    const vis = clipPoly(rect, (q) => -side(q));
    const R = clipPoly(rect, side);
    const refl = (q) => { const s = side(q); return [q[0] - 2 * s * n.x, q[1] - 2 * s * n.y]; };
    const Rr = R.map(refl);
    const mir = (pts) => pts.map(([x, y]) => [pw - x, y]);

    // the part of the page still lying flat
    t.front.style.clipPath = poly(fl ? mir(vis) : vis);

    // the underside, folded over
    if (t.back) {
      const r00 = 1 - 2 * n.x * n.x, r01 = -2 * n.x * n.y, r11 = 1 - 2 * n.y * n.y;
      const tx = 2 * n.x * (n.x * Mid.x + n.y * Mid.y), ty = 2 * n.y * (n.x * Mid.x + n.y * Mid.y);
      let A, b, clip;
      if (!fl) { A = [-r00, r01, -r01, r11]; b = [r00 * pw + tx, r01 * pw + ty]; clip = mir(R); }
      else { A = [-r00, -r01, r01, r11]; b = [pw - tx, ty]; clip = R; }
      const el = t.back;
      el.classList.add(single ? "is-r" : fl ? "is-l" : "is-r");
      el.style.left = `${slotLeft}px`;
      el.style.visibility = "visible";
      el.style.transformOrigin = "0 0";
      // CSS matrix(a, b, c, d, e, f): x' = a x + c y + e, y' = b x + d y + f
      el.style.transform = `matrix(${A[0]}, ${A[2]}, ${A[1]}, ${A[3]}, ${b[0]}, ${b[1]})`;
      el.style.clipPath = poly(clip);
    }

    // shadow on the page underneath, darkest at the fold
    const depth = d / 2;
    const toSlot = (pts) => (fl ? mir(pts) : pts);
    const dirSlot = fl ? { x: -n.x, y: n.y } : n;
    const foldPt = fl ? { x: pw - Mid.x, y: Mid.y } : Mid;
    fxU.classList.add("is-on");
    fxU.style.left = `${slotLeft}px`;
    fxU.style.clipPath = poly(toSlot(R));
    fxU.style.background = gradient(dirSlot, foldPt, pw, ph, [["rgba(0,0,0,.38)", 0], ["rgba(0,0,0,.12)", Math.min(depth, pw * 0.08)], ["rgba(0,0,0,0)", Math.min(depth * 1.4, pw * 0.22)]]);

    // light falling across the folded flap
    const ox = pw, oy = ph / 2; // the flap layer is larger than a page, offset by this much
    fxF.classList.add("is-on");
    fxF.style.left = `${slotLeft - ox}px`;
    fxF.style.top = `${-oy}px`;
    fxF.style.width = `${pw * 3}px`;
    fxF.style.height = `${ph * 2}px`;
    fxF.style.clipPath = poly(toSlot(Rr).map(([x, y]) => [x + ox, y + oy]));
    const back = { x: -dirSlot.x, y: -dirSlot.y };
    fxF.style.background = gradient(back, { x: foldPt.x + ox, y: foldPt.y + oy }, pw * 3, ph * 2, [["rgba(0,0,0,.22)", 0], ["rgba(255,255,255,.12)", depth * 0.3], ["rgba(255,255,255,0)", depth * 0.55], ["rgba(0,0,0,.1)", depth]]);

    // the page edges thin on one side and grow on the other as the sheet crosses
    if (!single) {
      const p = progress(t), f0 = pos / S, f1 = (pos + t.dir) / S, f = f0 + (f1 - f0) * p;
      book.style.setProperty("--el", `${Math.max(2, f * 14).toFixed(1)}px`);
      book.style.setProperty("--er", `${Math.max(2, (1 - f) * 14).toFixed(1)}px`);
    }
  };

  // The paper can't tear from the spine.
  const constrain = (P, O) => {
    const A = { x: 0, y: O.y }, B = { x: 0, y: ph - O.y }, diag = Math.hypot(pw, ph);
    let q = { ...P };
    let dA = Math.hypot(q.x - A.x, q.y - A.y);
    if (dA > pw) q = { x: A.x + ((q.x - A.x) * pw) / dA, y: A.y + ((q.y - A.y) * pw) / dA };
    const dB = Math.hypot(q.x - B.x, q.y - B.y);
    if (dB > diag) q = { x: B.x + ((q.x - B.x) * diag) / dB, y: B.y + ((q.y - B.y) * diag) / dB };
    return q;
  };

  const poly = (pts) => (pts.length < 3 ? "polygon(0 0, 0 0, 0 0)" : `polygon(${pts.map(([x, y]) => `${x.toFixed(2)}px ${y.toFixed(2)}px`).join(", ")})`);

  // Keep the part of a polygon where f(point) >= 0 (one straight cut).
  function clipPoly(pts, f) {
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length], fa = f(a), fb = f(b);
      if (fa >= 0) out.push(a);
      if ((fa >= 0) !== (fb >= 0)) { const k = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]); }
    }
    return out;
  }

  // A linear gradient running along `dir`, with stops measured from point F.
  function gradient(dir, F, w, h, stops) {
    const th = Math.atan2(dir.x, -dir.y);
    const len = Math.abs(w * Math.sin(th)) + Math.abs(h * Math.cos(th));
    const sx = w / 2 - (dir.x * len) / 2, sy = h / 2 - (dir.y * len) / 2;
    const at = (F.x - sx) * dir.x + (F.y - sy) * dir.y;
    return `linear-gradient(${((th * 180) / Math.PI).toFixed(2)}deg, ${stops.map(([c, o]) => `${c} ${(at + o).toFixed(1)}px`).join(", ")})`;
  }

  /* ---------- letting go ---------- */
  let anim = 0;
  const animate = (t, target, dur, done) => {
    cancelAnimationFrame(anim);
    const from = { ...t.P }, t0 = performance.now();
    const travel = Math.abs(target.x - from.x) / (2 * pw);
    const lift = (t.O.y === 0 ? 1 : -1) * ph * 0.14 * travel;
    const step = (now) => {
      const k = still ? 1 : clamp((now - t0) / dur, 0, 1), e = ease(k);
      t.P = { x: from.x + (target.x - from.x) * e, y: from.y + (target.y - from.y) * e + lift * Math.sin(Math.PI * e) };
      draw(t);
      if (k < 1) anim = requestAnimationFrame(step);
      else done();
    };
    anim = requestAnimationFrame(step);
  };

  let queue = 0, riffleDur = 0;
  const finish = (t, turned) => {
    if (turned) { pos = clamp(pos + t.dir, 0, maxPos()); track("home_engaged", "turn"); }
    turn = null;
    rest();
    if (turned) (t.hard ? thud : settle)();
    if (queue) { const d = Math.sign(queue); queue -= d; autoTurn(d, riffleDur); }
  };
  const release = (t, turned, dur = 620) => {
    const done = t.reverse ? !turned : turned;
    animate(t, done ? t.L : t.O, dur, () => finish(t, turned));
  };
  const autoTurn = (dir, dur = 760) => {
    if (turn) return false;
    const t = begin(dir, "bottom");
    if (!t) { queue = 0; return false; }
    rustle();
    release(t, true, dur);
    return true;
  };
  const goToFace = (k, instant = false) => {
    const target = single ? clamp(k, 0, M - 1) : clamp(Math.ceil(k / 2), 0, S);
    if (instant || still) { pos = target; rest(); return; }
    const steps = target - pos;
    if (!steps) return;
    riffleDur = Math.abs(steps) > 1 ? 300 : 760;
    queue = steps - Math.sign(steps);
    autoTurn(Math.sign(steps), riffleDur);
  };

  prevBtn.addEventListener("click", () => autoTurn(-1));
  nextBtn.addEventListener("click", () => autoTurn(1));
  document.addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea, select, [contenteditable], dialog")) return;
    const r = scene.getBoundingClientRect();
    if (r.bottom < innerHeight * 0.4 || r.top > innerHeight * 0.6) return;
    if (e.key === "ArrowRight") { e.preventDefault(); autoTurn(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); autoTurn(-1); }
  });
  let wheelAt = 0;
  scene.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaX) < 24 || Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
    e.preventDefault();
    const now = performance.now();
    if (now - wheelAt < 650) return;
    wheelAt = now;
    autoTurn(e.deltaX > 0 ? 1 : -1);
  }, { passive: false });
  stage.querySelectorAll("[data-goto]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); goToFace(+a.dataset.goto); }));

  /* ---------- the hand: hover, grab, drag ---------- */
  const local = (e) => { const r = book.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  // where the pointer is, in the sheet space of a turn going `dir`
  const sheet = (q, dir) => {
    if (single) return { x: q.x, y: q.y };
    return dir > 0 ? { x: q.x - pw, y: q.y } : { x: pw - q.x, y: q.y };
  };
  const sideOf = (q) => (single ? (q.x < pw * 0.28 ? -1 : 1) : q.x >= pw ? 1 : -1);

  let drag = null, peek = null, peekTarget = null, peekRaf = 0;
  const ZONE = () => Math.min(pw * 0.2, 120);

  const peekLoop = () => {
    if (!peek || drag) { peekRaf = 0; return; }
    peek.P = { x: peek.P.x + (peekTarget.x - peek.P.x) * 0.25, y: peek.P.y + (peekTarget.y - peek.P.y) * 0.25 };
    draw(peek);
    peekRaf = requestAnimationFrame(peekLoop);
  };
  const endPeek = () => {
    if (!peek) return;
    const t = peek; peek = null;
    cancelAnimationFrame(peekRaf); peekRaf = 0;
    animate(t, t.O, 220, () => { turn = null; rest(); });
  };

  book.addEventListener("pointermove", (e) => {
    if (drag || !fine) return;
    const q = local(e), dir = sideOf(q);
    const s = sheet(q, dir);
    const corner = s.y < ph / 2 ? "top" : "bottom";
    const C = { x: pw, y: corner === "top" ? 0 : ph };
    const near = Math.hypot(s.x - C.x, s.y - C.y) < ZONE() && !single;
    book.classList.toggle("can-grab", near || (q.y >= 0 && q.y <= ph));
    if (near) {
      if (peek && (peek.dir !== dir || peek.O.y !== C.y)) endPeek();
      if (!peek && !turn) {
        const t = begin(dir, corner);
        if (t && !t.hard) { peek = t; peekRaf = requestAnimationFrame(peekLoop); }
        else if (t) { turn = null; rest(); }
      }
      if (peek) peekTarget = { x: Math.min(s.x, pw - 6), y: s.y };
    } else if (peek) endPeek();
  });
  book.addEventListener("pointerleave", () => { if (!drag) { endPeek(); book.classList.remove("can-grab"); } });

  book.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || e.target.closest("a, button, input, textarea, label")) return;
    const q = local(e);
    const dir = sideOf(q);
    let t = peek && peek.dir === dir ? peek : null;
    if (peek && !t) { cancelAnimationFrame(peekRaf); peek = null; turn = null; rest(); }
    if (!t && turn) return; // a page is already moving
    if (!t) {
      const s = sheet(q, dir);
      t = begin(dir, s.y < ph / 2 ? "top" : "bottom");
      if (!t) return;
    }
    peek = null; cancelAnimationFrame(peekRaf);
    drag = { t, x0: q.x, y0: q.y, moved: false, id: e.pointerId, lastX: q.x, lastT: performance.now(), v: 0 };
    rustle();
    try { book.setPointerCapture(e.pointerId); } catch {}
  });
  book.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const q = local(e), t = drag.t;
    if (!drag.moved && Math.hypot(q.x - drag.x0, q.y - drag.y0) > 6) { drag.moved = true; book.classList.add("is-drag"); }
    if (!drag.moved) return;
    const now = performance.now();
    drag.v = (q.x - drag.lastX) / Math.max(1, now - drag.lastT);
    drag.lastX = q.x; drag.lastT = now;
    if (t.reverse) t.P = { x: -pw + 2 * Math.max(0, q.x - drag.x0), y: q.y };
    else t.P = sheet(q, t.dir);
    draw(t);
  });
  const up = (e) => {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    const d = drag; drag = null;
    book.classList.remove("is-drag");
    const t = d.t;
    if (!d.moved) { release(t, true, 760); return; } // a tap turns the page
    const p = t.reverse ? 1 - progress(t) : progress(t);
    const towards = t.slot === "l" || t.reverse ? d.v : -d.v; // speed in the direction of turning
    release(t, p > 0.33 || towards > 0.5, 520);
  };
  book.addEventListener("pointerup", up);
  book.addEventListener("pointercancel", (e) => { if (drag) { const t = drag.t; drag = null; book.classList.remove("is-drag"); release(t, false, 300); } });

  // Prints on a page lift when touched
  stage.querySelectorAll(".bk-snap").forEach((s) => {
    s.addEventListener("pointerenter", () => s.classList.add("is-up"));
    s.addEventListener("pointerleave", () => s.classList.remove("is-up"));
  });

  /* ---------- the lamp follows the reader ---------- */
  if (fine && !still) {
    scene.addEventListener("pointermove", (e) => {
      const r = scene.getBoundingClientRect();
      scene.style.setProperty("--lx", `${40 + ((e.clientX - r.left) / r.width) * 20}%`);
      scene.style.setProperty("--ly", `${36 + ((e.clientY - r.top) / r.height) * 16}%`);
    });
  }

  /* ---------- start ---------- */
  const fromHash = () => { const k = chapters[location.hash.slice(1)]; if (k != null) goToFace(k, true); };
  addEventListener("hashchange", () => { const k = chapters[location.hash.slice(1)]; if (k != null) goToFace(k); });
  addEventListener("resize", () => {
    const was = single;
    single = mqSingle.matches;
    if (was !== single) {
      if (turn) { cancelAnimationFrame(anim); turn = null; peek = null; }
      pos = single ? (pos >= S ? M - 1 : 2 * pos) : Math.ceil(pos / 2);
      stage.classList.toggle("is-single", single);
    }
    measure(); rest();
  });
  measure();
  rest();
  if (location.hash) fromHash();
})();
