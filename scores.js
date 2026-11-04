(function() {
  const BP = window.BodyMovin = window.BodyMovin || {};
  const KEY = "bp_scores", LAST = "bp_initials", MAX = 5, ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const NAMES = {
    airband: "AIR BAND LIVE",
    balloon: "BALLOON KEEP-UP",
    blaster: "STAR BLASTER",
    bowling: "STRIKE LANES",
    boxing: "BOP BOXING",
    breaker: "BODY BREAKER",
    bubbles: "BUBBLE POP",
    extreme: "SUMMIT SEND",
    fruit: "FRUIT SLASH",
    gallery: "PEEKABOO GALLERY",
    golf: "TOP DRIVE",
    keeper: "GOALKEEPER",
    moles: "WHACK-A-MOLE",
    posematch: "POSE PARTY",
    runner: "SKY RUNNER",
    starjumps: "STAR JUMPS",
    track: "TRACK & FIELD",
    walls: "WALL DODGE",
    pingpong: "TABLE TENNIS"
  };
  const load = () => {
    try {
      return JSON.parse(localStorage[KEY] || "{}") || {};
    } catch (_) {
      return {};
    }
  };
  const list = (id) => (load()[id] || []).filter((e) => e && typeof e.s === "number").sort((a, b) => b.s - a.s).slice(0, MAX);
  const clean = (s) => (String(s || "").toUpperCase().replace(/[^A-Z]/g, "") + "AAA").slice(0, 3);
  const lastInitials = () => {
    try {
      return localStorage[LAST] ? clean(localStorage[LAST]) : "AAA";
    } catch (_) {
      return "AAA";
    }
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const fmt = (e) => e.d != null ? String(e.d) : Number(e.s).toLocaleString();
  const CSS = '\n  /* no backdrop dim (Matt 10/23: nothing ever dims the screen); the card is near-opaque instead */\n  .bphs-wrap{position:fixed;top:0;right:0;bottom:0;left:0;z-index:9000;display:flex;align-items:center;justify-content:center;background:none;\n    opacity:0;transition:opacity .35s ease;user-select:none;-webkit-user-select:none;\n    font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display",system-ui,"Segoe UI",Roboto,sans-serif;color:#fff;touch-action:none}\n  .bphs-wrap.on{opacity:1}\n  .bphs-card{box-sizing:border-box;max-width:min(94vw,1100px);max-height:96vh;padding:2.4vmin 4vmin 2vmin;border-radius:3.4vmin;text-align:center;\n    background:linear-gradient(180deg,rgba(18,22,44,.94),rgba(8,10,24,.96));border:1px solid rgba(255,255,255,.16);\n    box-shadow:0 2.4vmin 7vmin rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.12)}\n  .bphs-h1{font-weight:900;font-size:max(30px,7.4vmin);line-height:1.02;letter-spacing:.02em;margin:0 0 .6vmin;\n    background:linear-gradient(180deg,#fff3b0,#ffc83d 55%,#ff8a3d);-webkit-background-clip:text;background-clip:text;color:transparent;\n    filter:drop-shadow(0 0 2.2vmin rgba(255,190,60,.45));animation:bphs-pulse 1.1s ease-in-out infinite alternate}\n  @keyframes bphs-pulse{from{transform:scale(1)}to{transform:scale(1.045)}}\n  .bphs-sub{font-weight:800;font-size:max(17px,3.6vmin);color:#d8e4ff;margin:0 0 1.6vmin}\n  .bphs-sub b{color:#fff;font-size:1.25em}\n  .bphs-slots{display:flex;gap:3vmin;justify-content:center;margin:0 0 1.6vmin}\n  .bphs-slot{display:flex;flex-direction:column;align-items:center;gap:.9vmin}\n  .bphs-btn{--p:0%;position:relative;box-sizing:border-box;border:2px solid rgba(255,255,255,.35);border-radius:2.2vmin;cursor:pointer;color:#fff;font-weight:900;\n    background:linear-gradient(90deg,rgba(110,230,255,.55) var(--p),rgba(255,255,255,.08) var(--p));display:flex;align-items:center;justify-content:center;\n    letter-spacing:.12em;transition:border-color .15s,box-shadow .15s}\n  .bphs-btn.hov{border-color:#9ff0ff;box-shadow:0 0 2.4vmin rgba(110,230,255,.55)}\n  .bphs-arrow{width:16vmin;height:9.5vmin;font-size:6vmin;letter-spacing:0}\n  .bphs-letter{width:16vmin;height:17vmin;border-radius:2.2vmin;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:13vmin;\n    background:rgba(255,255,255,.07);border:2px solid rgba(255,255,255,.22);color:#fff;font-variant-numeric:tabular-nums;text-shadow:0 0 2.4vmin rgba(130,200,255,.5)}\n  .bphs-letter.cur{border-color:#ffd34d;box-shadow:0 0 2.6vmin rgba(255,211,77,.5),inset 0 0 2vmin rgba(255,211,77,.15)}\n  .bphs-actions{display:flex;gap:3vmin;justify-content:center;align-items:center}\n  .bphs-ok{width:36vmin;height:11vmin;font-size:6vmin;border-color:#7dffb0;background:linear-gradient(90deg,rgba(125,255,176,.75) var(--p),rgba(60,200,120,.22) var(--p))}\n  .bphs-skip{width:22vmin;height:8vmin;font-size:3.4vmin;color:#c9d3ea;border-color:rgba(255,255,255,.25)}\n  .bphs-note{margin-top:1.4vmin;font-weight:700;font-size:max(13px,2.3vmin);color:rgba(200,215,255,.7)}\n  .bphs-head{font-weight:800;font-size:max(13px,2.2vmin);letter-spacing:.32em;color:rgba(200,215,255,.72);margin:0 0 .4vmin}\n  .bphs-game{font-weight:900;font-size:max(26px,6vmin);line-height:1.05;margin:0 0 1.6vmin;text-shadow:0 0 3vmin rgba(130,200,255,.35)}\n  .bphs-table{display:grid;grid-template-columns:auto auto auto;column-gap:0;row-gap:.5vmin;justify-content:center;align-items:center;\n    font-weight:900;font-size:max(22px,5.4vmin);font-variant-numeric:tabular-nums;margin:0 auto}\n  .bphs-table>div{padding:.3vmin 2.6vmin}\n  .bphs-table .r.me{border-radius:1.4vmin 0 0 1.4vmin}.bphs-table .s.me{border-radius:0 1.4vmin 1.4vmin 0}\n  .bphs-table .r{color:rgba(200,215,255,.75);text-align:right}.bphs-table .n{letter-spacing:.18em;text-align:left}.bphs-table .s{text-align:right}\n  .bphs-table .me{color:#ffd34d;background:rgba(255,211,77,.14);animation:bphs-glow .8s ease-in-out infinite alternate}\n  @keyframes bphs-glow{from{text-shadow:0 0 .6vmin rgba(255,211,77,.4)}to{text-shadow:0 0 2.6vmin rgba(255,211,77,.95)}}\n  .bphs-close{margin:1.8vmin auto 0;width:30vmin;height:8.5vmin;font-size:3.8vmin}\n  .bphs-hands{position:fixed;top:0;right:0;bottom:0;left:0;width:100%;height:100%;pointer-events:none}\n  @media (max-aspect-ratio:4/5){\n    .bphs-card{width:94vw;padding:4vw 4vw 3.4vw;border-radius:5vw}\n    .bphs-h1{font-size:10.4vw}.bphs-sub{font-size:5vw;margin-bottom:4vw}\n    .bphs-slots{gap:4vw;margin-bottom:4vw}.bphs-slot{gap:2.2vw}\n    .bphs-arrow{width:24vw;height:15vw;font-size:9vw;border-radius:3.4vw}\n    .bphs-letter{width:24vw;height:26vw;font-size:20vw;border-radius:3.4vw}\n    .bphs-actions{flex-direction:column;gap:3vw}\n    .bphs-ok{width:70vw;height:17vw;font-size:9vw;border-radius:4vw}.bphs-skip{width:44vw;height:11vw;font-size:5vw;border-radius:3vw}\n    .bphs-note{font-size:3.6vw;margin-top:3vw}.bphs-head{font-size:3.2vw}.bphs-game{font-size:8.6vw;margin-bottom:3vw}\n    .bphs-table{font-size:8vw}.bphs-table>div{padding:.4vw 3.6vw}.bphs-close{width:52vw;height:13vw;font-size:6vw;margin-top:4vw;border-radius:3.4vw}\n  }';
  let wrap = null, card = null, hcv = null, raf = 0, keyFn = null, run = null, closeTimer = 0;
  const S = { phase: null, gameId: null, letters: "AAA", cursor: 0, rank: -1, qualifies: false };
  let btns = [];
  const origOver = BP.handOver ? BP.handOver.bind(BP) : null;
  let after = 0;
  const held = /* @__PURE__ */ new Map();
  if (origOver) BP.handOver = function(r, W, H) {
    if (S.phase) return false;
    const o = origOver(r, W, H);
    if (!after) return o;
    if (performance.now() > after) {
      after = 0;
      held.clear();
      return o;
    }
    const k = r && [r.x, r.y, r.w, r.h].map((v) => Math.round(v / 8)).join(",");
    if (!held.has(k)) held.set(k, !!o);
    if (held.get(k)) {
      if (!o) held.set(k, false);
      return false;
    }
    return o;
  };
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function stop(e) {
    e.stopPropagation();
  }
  function mount() {
    if (!document.getElementById("bphs-css")) {
      const st = el("style");
      st.id = "bphs-css";
      st.textContent = CSS;
      document.head.appendChild(st);
    }
    wrap = el("div", "bphs-wrap");
    wrap.id = "bphs";
    for (const t of ["pointerdown", "pointerup", "pointermove", "mousedown", "mouseup", "mousemove", "click", "dblclick", "touchstart", "touchmove", "touchend", "wheel", "contextmenu"]) wrap.addEventListener(t, stop);
    card = el("div", "bphs-card");
    wrap.appendChild(card);
    hcv = el("canvas", "bphs-hands");
    wrap.appendChild(hcv);
    (document.body || document.documentElement).appendChild(wrap);
    requestAnimationFrame(() => requestAnimationFrame(() => wrap && wrap.classList.add("on")));
    try {
      for (const c of document.querySelectorAll("canvas")) if (!wrap.contains(c)) c.dispatchEvent(new PointerEvent("pointermove", { clientX: -9999, clientY: -9999, bubbles: true }));
    } catch (_) {
    }
    keyFn = onKey;
    addEventListener("keydown", keyFn, true);
    addEventListener("keyup", swallow, true);
    addEventListener("keypress", swallow, true);
    if (!raf) raf = requestAnimationFrame(loop);
  }
  function swallow(e) {
    if (S.phase) {
      e.stopImmediatePropagation();
    }
  }
  function button(cls, html, id, act, repeat) {
    const b = el("div", "bphs-btn " + cls, html);
    b.dataset.id = id;
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      act();
    });
    btns.push({ el: b, id, act, repeat, next: 0 });
    return b;
  }
  function renderEntry() {
    btns = [];
    card.innerHTML = "";
    card.appendChild(el("div", "bphs-h1", "NEW HIGH SCORE!"));
    card.appendChild(el("div", "bphs-sub", "<b>".concat(esc(run.show), "</b> &nbsp;·&nbsp; #").concat(S.rank + 1, " on this screen")));
    const slots = el("div", "bphs-slots");
    for (let i = 0; i < 3; i++) {
      const s = el("div", "bphs-slot");
      s.appendChild(button("bphs-arrow", "&#9650;", "up" + i, () => bump(i, -1), true));
      const L = el("div", "bphs-letter");
      L.dataset.slot = i;
      L.addEventListener("click", (e) => {
        e.stopPropagation();
        S.cursor = i;
        paint();
      });
      s.appendChild(L);
      s.appendChild(button("bphs-arrow", "&#9660;", "dn" + i, () => bump(i, 1), true));
      slots.appendChild(s);
    }
    card.appendChild(slots);
    const act = el("div", "bphs-actions");
    act.appendChild(button("bphs-ok", "OK", "ok", () => confirm(true)));
    act.appendChild(button("bphs-skip", "SKIP", "skip", () => confirm(false)));
    card.appendChild(act);
    card.appendChild(el("div", "bphs-note", "Saved only on this screen."));
    paint();
  }
  function paint() {
    if (S.phase !== "entry") return;
    card.querySelectorAll(".bphs-letter").forEach((L, i) => {
      L.textContent = S.letters[i];
      L.classList.toggle("cur", i === S.cursor);
    });
  }
  function bump(i, d) {
    S.full = false;
    const k = ABC.indexOf(S.letters[i]);
    const c = ABC[(k + d + 26) % 26];
    S.letters = S.letters.slice(0, i) + c + S.letters.slice(i + 1);
    S.cursor = i;
    paint();
  }
  function confirm(ok) {
    if (S.phase !== "entry") return;
    const ini = clean(S.letters);
    if (ok) try {
      localStorage[LAST] = ini;
    } catch (_) {
    }
    save(ini);
    showTable(6e3);
  }
  function save(ini) {
    const all = load(), L = list(run.id), e = { i: ini, s: run.score };
    if (run.display != null) e.d = String(run.display);
    L.splice(S.rank, 0, e);
    all[run.id] = L.slice(0, MAX);
    run.saved = true;
    try {
      localStorage[KEY] = JSON.stringify(all);
    } catch (_) {
    }
  }
  function showTable(ms) {
    S.phase = "table";
    btns = [];
    card.innerHTML = "";
    card.appendChild(el("div", "bphs-head", "HIGH SCORES"));
    card.appendChild(el("div", "bphs-game", esc(run.title)));
    const t = el("div", "bphs-table"), L = list(run.id);
    L.forEach((e, i) => {
      const me = run.saved && i === S.rank ? " me" : "";
      t.appendChild(el("div", "r" + me, "".concat(i + 1, ".")));
      t.appendChild(el("div", "n" + me, esc(e.i)));
      t.appendChild(el("div", "s" + me, esc(fmt(e))));
    });
    card.appendChild(t);
    card.appendChild(button("bphs-close", "CLOSE", "close", close));
    card.appendChild(el("div", "bphs-note", "Saved only on this screen."));
    clearTimeout(closeTimer);
    closeTimer = setTimeout(close, ms);
  }
  function close() {
    if (!S.phase || !wrap) return;
    clearTimeout(closeTimer);
    S.phase = null;
    btns = [];
    after = performance.now() + 8e3;
    held.clear();
    removeEventListener("keydown", keyFn, true);
    removeEventListener("keyup", swallow, true);
    removeEventListener("keypress", swallow, true);
    const w = wrap;
    wrap = null;
    w.classList.remove("on");
    setTimeout(() => w.remove(), 400);
    const cb = run && run.onDone;
    if (cb) try {
      cb();
    } catch (_) {
    }
  }
  function onKey(e) {
    if (!S.phase) return;
    e.stopImmediatePropagation();
    e.preventDefault();
    if (e.repeat && !/^Arrow/.test(e.key)) return;
    const k = e.key;
    if (S.phase === "table") {
      if (k === "Enter" || k === " " || k === "Escape") close();
      return;
    }
    if (S.phase !== "entry") return;
    if (/^[a-zA-Z]$/.test(k)) {
      const i = S.cursor;
      S.letters = S.letters.slice(0, i) + k.toUpperCase() + S.letters.slice(i + 1);
      S.full = i === 2;
      S.cursor = Math.min(2, i + 1);
      paint();
    } else if (k === "Backspace") {
      if (S.full) S.full = false;
      else S.cursor = Math.max(0, S.cursor - 1);
      paint();
    } else if (k === "ArrowUp") bump(S.cursor, -1);
    else if (k === "ArrowDown") bump(S.cursor, 1);
    else if (k === "ArrowLeft") {
      S.cursor = Math.max(0, S.cursor - 1);
      paint();
    } else if (k === "ArrowRight") {
      S.cursor = Math.min(2, S.cursor + 1);
      paint();
    } else if (k === "Enter") confirm(true);
    else if (k === "Escape") confirm(false);
  }
  function loop(now) {
    raf = 0;
    if (!wrap) return;
    const W = innerWidth, H = innerHeight;
    for (const b of btns) {
      const r = b.el.getBoundingClientRect(), pad = Math.min(W, H) * 0.012;
      const over = !!(origOver && r.width && origOver({ x: r.left - pad, y: r.top - pad, w: r.width + pad * 2, h: r.height + pad * 2 }, W, H));
      const ms = b.repeat ? 550 : b.id === "ok" ? 800 : 900;
      const k = BP.dwell ? BP.dwell("bphs-" + S.phase + "-" + b.id, over, now, ms) : 0;
      b.el.classList.toggle("hov", over);
      if (k >= 1) {
        b.el.style.setProperty("--p", "0%");
        b.next = now + 420;
        b.act();
        if (!wrap || !btns.includes(b)) break;
        continue;
      }
      if (b.repeat && over && b.next && now >= b.next) {
        b.next = now + 330;
        b.act();
        b.el.style.setProperty("--p", "100%");
        continue;
      }
      if (!over) b.next = 0;
      b.el.style.setProperty("--p", (b.next && over ? 100 : Math.round(k * 100)) + "%");
    }
    drawHands(W, H);
    raf = requestAnimationFrame(loop);
  }
  function drawHands(W, H) {
    const d = Math.min(2, devicePixelRatio || 1), cw = Math.round(W * d), ch = Math.round(H * d);
    if (hcv.width !== cw || hcv.height !== ch) {
      hcv.width = cw;
      hcv.height = ch;
    }
    const c = hcv.getContext("2d");
    c.setTransform(d, 0, 0, d, 0, 0);
    c.clearRect(0, 0, W, H);
    if (!(BP.live || BP.simulating) || !BP.hands) return;
    const r = Math.min(W, H) * 0.05;
    for (const [side, col] of [["left", "255,122,217"], ["right", "102,224,255"]]) {
      const h = BP.hands[side];
      if (!h || !h.seen) continue;
      const x = h.x * W, y = h.y * H, g = c.createRadialGradient(x, y, 0, x, y, r * 1.6);
      g.addColorStop(0, "rgba(255,255,255,.95)");
      g.addColorStop(0.35, "rgba(".concat(col, ",.85)"));
      g.addColorStop(1, "rgba(".concat(col, ",0)"));
      c.fillStyle = g;
      c.beginPath();
      c.arc(x, y, r * 1.6, 0, 6.283);
      c.fill();
    }
  }
  function highScores(gameId, score, opts) {
    BP.inPlay = false;
    opts = opts || {};
    const id = String(gameId || "game"), sc = Number(score);
    if (!isFinite(sc)) return;
    calls.push({ gameId: id, score: sc });
    if (S.phase) close();
    const L = list(id);
    let rank = L.findIndex((e) => sc > e.s);
    if (rank < 0) rank = L.length;
    const qualifies = sc > 0 && rank < MAX;
    if (!qualifies && !L.length) return;
    run = { id, score: sc, display: opts.display, show: opts.display != null ? String(opts.display) : sc.toLocaleString(), title: opts.title || NAMES[id] || id.toUpperCase(), onDone: opts.onDone, saved: false };
    Object.assign(S, { phase: "wait", gameId: id, letters: lastInitials(), cursor: 0, full: false, rank: qualifies ? rank : -1, qualifies });
    const g = window.__game, st0 = g && g.state, myRun = run;
    setTimeout(() => {
      if (run !== myRun || S.phase !== "wait") return;
      const g2 = window.__game;
      if (g && g2 === g && st0 != null && g2.state !== st0 && !/end|over|result|medal|final/i.test(String(g2.state))) {
        S.phase = null;
        if (qualifies) save("---");
        return;
      }
      mount();
      if (qualifies) {
        S.phase = "entry";
        renderEntry();
      } else showTable(4500);
    }, opts.delay != null ? opts.delay : 1100);
  }
  const calls = [];
  highScores.calls = calls;
  highScores.list = list;
  highScores.close = close;
  Object.defineProperty(highScores, "active", { get: () => !!S.phase && S.phase !== "wait" });
  Object.defineProperty(highScores, "state", { get: () => ({ ...S }) });
  BP.highScores = highScores;
})();
(function() {
  const BP = window.BodyMovin = window.BodyMovin || {};
  const hs = function(gameId, score, opts = {}) {
    hs.calls.push({ gameId, score });
    if (typeof opts.onDone === "function") setTimeout(opts.onDone, 0);
  };
  hs.active = false;
  hs.state = { phase: null };
  hs.list = () => [];
  hs.calls = [];
  BP.highScores = hs;
  if (window.BodyPlay) window.BodyPlay.highScores = hs;
  try {
    const p = document.getElementById("bphs");
    if (p) p.remove();
  } catch (_) {
  }
})();
