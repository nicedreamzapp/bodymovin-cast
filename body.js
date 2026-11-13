(function() {
  try {
    if (typeof location === "undefined") return;
    if (/[?&]app=1(&|$)/.test(location.search)) sessionStorage.bp_phoneui = "1";
    if (/[?&]tv=1(&|$)/.test(location.search)) sessionStorage.removeItem("bp_phoneui");
    window.BP_PHONEUI = sessionStorage.bp_phoneui === "1";
    if (window.BP_PHONEUI) {
      document.documentElement.classList.add("bp-phone");
      const st = document.createElement("style");
      st.textContent = "html.bp-phone #bp-home,html.bp-phone #bpHome,html.bp-phone body > #home{font-size:20px!important;min-height:52px!important;min-width:112px!important;padding:0 18px!important;border-radius:999px!important;font-weight:800!important}";
      (document.head || document.documentElement).appendChild(st);
    }
  } catch (_) {
  }
})();
(function() {
  if (typeof window !== "undefined" && window.BP_TV === void 0) {
    let on = null;
    const q = new URLSearchParams(location.search);
    try {
      if (q.get("tvmode") === "0") on = false;
      else if (q.get("tvmode") === "1" || q.get("cast") === "1") on = true;
      if (on !== null) sessionStorage.bp_tv = on ? "1" : "0";
      else if (sessionStorage.bp_tv) on = sessionStorage.bp_tv === "1";
    } catch (_) {
    }
    if (on === null) {
      try {
        if (window.parent !== window && window.parent.BP_TV !== void 0) on = !!window.parent.BP_TV;
      } catch (_) {
      }
    }
    if (on === null) on = /BodyMovinTV\/|\bAFT[A-Z0-9]{1,6}\b|CrKey\/|Android ?TV|AndroidTV|Google ?TV|GoogleTV|BRAVIA|SMART-?TV|SmartTV|HbbTV|Tizen|Web0S|webOS|NetCast|AFTB|Roku/i.test(navigator.userAgent || "");
    window.BP_TV = on;
    if (on) document.documentElement.classList.add("bp-tv");
  }
  const RAF0 = typeof window !== "undefined" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : ((f) => setTimeout(() => f(performance.now()), 16));
  const FROM_PHONE = location.port === "8080";
  const ONLINE = location.pathname.startsWith("/play/");
  const qsRoom = new URLSearchParams(location.search).get("room");
  if (qsRoom) localStorage.bp_room = qsRoom.toUpperCase();
  const ROOM = localStorage.bp_room || "";
  const qsKey = new URLSearchParams(location.search).get("k");
  if (qsKey) localStorage.bp_key = qsKey;
  const KEY = localStorage.bp_key || "";
  const WS_URL = FROM_PHONE ? "ws://".concat(location.hostname, ":8081") : ONLINE ? "".concat(location.protocol === "https:" ? "wss" : "ws", "://").concat(location.host, "/play/relay?room=").concat(ROOM, "&role=tv") : "ws://localhost:8794";
  const DEMO = new URLSearchParams(location.search).has("demo");
  const HOSTED = (() => {
    try {
      if (window.parent === window) return false;
      if (new URLSearchParams(location.search).has("castfeed")) sessionStorage.bp_castfeed = "1";
      return sessionStorage.bp_castfeed === "1";
    } catch (_) {
      return false;
    }
  })();
  class OneEuro {
    constructor(minCutoff = 1.4, beta = 0.5) {
      this.minCutoff = minCutoff;
      this.beta = beta;
      this.x = null;
      this.dx = 0;
    }
    static a(c, dt) {
      const tau = 1 / (2 * Math.PI * c);
      return 1 / (1 + tau / dt);
    }
    filter(v, dt) {
      if (this.x === null) {
        this.x = v;
        return v;
      }
      const d = (v - this.x) / dt;
      this.dx += OneEuro.a(1, dt) * (d - this.dx);
      this.x += OneEuro.a(this.minCutoff + this.beta * Math.abs(this.dx), dt) * (v - this.x);
      return this.x;
    }
  }
  const JF = {}, IF = {};
  const FEEL = Object.assign({ imgMin: 2, imgBeta: 5, cursorRate: 0, capScreens: 0, predictMs: 30, interpMs: 30, interpHz: 7 }, typeof window !== "undefined" && window.BP_TUNE || {});
  let lastAt = 0;
  const PTR = Object.assign({ minCut: 1.2, beta: 6, dCut: 1.5 }, typeof window !== "undefined" && window.BP_PTR || {});
  const lagSamples = [];
  function feed(m) {
    if (typeof window !== "undefined" && window.__poseHook) {
      try {
        m = window.__poseHook(m) || m;
      } catch (_) {
      }
    }
    if (m && m.t > 1e9) {
      const lag = Date.now() - m.t * 1e3;
      if (lag > -50 && lag < 3e3) {
        lagSamples.push(Math.max(0, lag));
        if (lagSamples.length > 120) lagSamples.shift();
      }
    }
    if (!m || !m.tracked || !m.j || !m.j.root) return;
    BP.vis = m.vis || null;
    if (m.src === "web") BP._oldPhone = !m.i;
    if (m.src === "web" && !m.i && m.j.lShoulder && m.j.rShoulder && m.j.lShoulder[0] < m.j.rShoulder[0]) {
      for (const [l, r] of [["lShoulder", "rShoulder"], ["lForearm", "rForearm"], ["lHand", "rHand"], ["lHip", "rHip"], ["lKnee", "rKnee"], ["lFoot", "rFoot"]]) {
        const t1 = m.j[l];
        m.j[l] = m.j[r];
        m.j[r] = t1;
        if (m.vis) {
          const t2 = m.vis[l];
          m.vis[l] = m.vis[r];
          m.vis[r] = t2;
        }
      }
    }
    if (m.i && m.i.lShoulder && m.i.rShoulder) {
      const ts = m.t || performance.now() / 1e3;
      BP.imgAR = m.ar || 0.5625;
      for (const [k, xy] of Object.entries(m.i)) {
        const f = IF[k] || (IF[k] = { fx: [new OneEuro(FEEL.imgMin, FEEL.imgBeta), new OneEuro(FEEL.imgMin, FEEL.imgBeta)], t: ts, p: null, v: [0, 0] });
        const dt = Math.min(0.1, Math.max(1 / 120, ts - f.t || 1 / 60));
        f.t = ts;
        const np = [f.fx[0].filter(xy[0] * BP.imgAR, dt), f.fx[1].filter(xy[1], dt)];
        if (f.p) f.v = f.v.map((v, i) => v + 0.4 * ((np[i] - f.p[i]) / dt - v));
        f.p = np;
        const lead = FEEL.predictMs / 1e3;
        BP.img[k] = lead ? [np[0] + Math.max(-0.08, Math.min(0.08, f.v[0] * lead)), np[1] + Math.max(-0.08, Math.min(0.08, f.v[1] * lead))] : np;
      }
      BP.imgAt = performance.now();
      BP.rawImg = m.i;
      BP.rawJ = m.j;
      BP.imgTarget = {};
      for (const k of Object.keys(BP.img)) {
        const f = IF[k];
        if (!f || !f.p) continue;
        const g = (FEEL.predictMs + FEEL.interpMs) / 1e3;
        BP.imgTarget[k] = [f.p[0] + Math.max(-0.1, Math.min(0.1, f.v[0] * g)), f.p[1] + Math.max(-0.1, Math.min(0.1, f.v[1] * g))];
      }
      if (!BP.imgSpring) BP.imgSpring = {};
    }
    const prevP = (k) => JF[k] && JF[k].p, d3 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
    const swapPair = (j, v, l, r) => {
      const t1 = j[l];
      j[l] = j[r];
      j[r] = t1;
      if (v) {
        const t2 = v[l];
        v[l] = v[r];
        v[r] = t2;
      }
    };
    const PAIRS = [["lShoulder", "rShoulder"], ["lForearm", "rForearm"], ["lHand", "rHand"], ["lHip", "rHip"], ["lKnee", "rKnee"], ["lFoot", "rFoot"]];
    if (m.j.lShoulder && m.j.rShoulder && prevP("lShoulder") && prevP("rShoulder") && performance.now() - lastAt < 400) {
      const was = sub(prevP("rShoulder"), prevP("lShoulder")), now = sub(m.j.rShoulder, m.j.lShoulder);
      if (was[0] * now[0] + was[2] * now[2] < 0) {
        for (const [l, r] of PAIRS) swapPair(m.j, m.vis, l, r);
        BP.flipsFixed = (BP.flipsFixed || 0) + 1;
      }
    }
    const t = m.t || performance.now() / 1e3;
    for (const [k, a] of Object.entries(m.j)) {
      if (m.vis && m.vis[k] !== void 0 && m.vis[k] < 0.45 && JF[k] && JF[k].p) continue;
      const f = JF[k] || (JF[k] = { fx: [new OneEuro(), new OneEuro(), new OneEuro()], p: null, v: [0, 0, 0], t });
      const dt = Math.min(0.1, Math.max(1 / 120, t - f.t || 1 / 60));
      f.t = t;
      if (f.raw && Math.hypot(a[0] - f.raw[0], a[1] - f.raw[1], a[2] - f.raw[2]) > 0.35 && (f.odd = (f.odd || 0) + 1) < 3) continue;
      f.odd = 0;
      f.raw = a;
      const np = a.map((c, i) => f.fx[i].filter(c, dt));
      if (f.p) f.v = f.v.map((v, i) => v + 0.35 * ((np[i] - f.p[i]) / dt - v));
      f.p = np;
    }
    lastAt = performance.now();
  }
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  let lastSeenShoulders = 0;
  let right = [1, 0, 0], center = null, standY = null, lastSeen = 0, crouchY = null, airUntil = 0;
  const SQ = { d0: 0.04, span: 0.24, on: 0.4, off: 0.15 };
  const handState = () => ({ x: 0.5, y: 0.6, vx: 0, vy: 0, speed: 0, push: 0, seen: false });
  const BP = {
    live: false,
    joints: {},
    img: {},
    hands: { left: handState(), right: handState() },
    body: { x: 0, crouch: 0, jumping: false, lean: 0, armsUp: false, starJump: false, running: 0, cadence: 0, steps: 0, kneeL: 0, kneeR: 0 },
    activity: { activeSec: 0, kcal: 0, intensity: 0 },
    _on: {},
    fromPhone: FROM_PHONE,
    online: ONLINE,
    room: ROOM,
    demo: DEMO
  };
  BP.on = (ev, fn) => {
    var _a;
    ((_a = BP._on)[ev] || (_a[ev] = [])).push(fn);
  };
  const lastEv = {};
  const NOT_GATED = /* @__PURE__ */ new Set(["ready", "video", "present"]);
  const emit = (ev, d) => {
    if (!sim && BP.present === false && !NOT_GATED.has(ev)) return;
    lastEv[ev] = performance.now();
    (BP._on[ev] || []).forEach((fn) => fn(d));
  };
  BP.latency = () => {
    if (lagSamples.length < 10) return null;
    const s = [...lagSamples].sort((a, b) => a - b);
    return Math.round(s[Math.floor(s.length / 2)]);
  };
  BP.recent = (ev, ms = 250) => performance.now() - (lastEv[ev] || -1e9) <= ms;
  const BOX = { w: 0.9, h: 1, out: 0.15, down: 0.67 };
  function reach(J, handK, shK, out, T) {
    const rel = sub(J[handK], J[shK]);
    const u = (dot(rel, right) - out * BOX.out * T) / (BOX.w * T) + 0.5;
    const v = (rel[1] + BOX.down * T) / (BOX.h * T) + 0.5;
    return [u * 1.07 - 0.035, 1 - (v * 1.07 - 0.035)];
  }
  const MIR = { scale: 1 / 1.9, chestV: 0.3, armGain: 1.8, step: 0.32, squat: 0.22 };
  const ARM = { lForearm: "lShoulder", lHand: "lShoulder", rForearm: "rShoulder", rHand: "rShoulder" };
  const IM = { torso: 0.17, chestV: 0.38, step: 1.1, base: null, len: null };
  const FG = () => BP.figure || {};
  const GA = { at: 0, off: null };
  const UPPER = { torso: 0.3, chestY: 0.45 };
  const figT = () => FG().torso || (BP.needs === "full" ? IM.torso : UPPER.torso), figC = () => FG().chestY || (BP.needs === "full" ? IM.chestV : UPPER.chestY), figA = () => FG().armGain || MIR.armGain;
  const figLegs = () => FG().legs !== void 0 ? FG().legs : BP.needs === "full";
  function mirrorImgBase(k, forDraw) {
    var _a;
    const I = BP.img;
    if (!I[k] || !I.lShoulder || !I.rShoulder || performance.now() - (BP.imgAt || 0) > 700) return null;
    const chest = [(I.lShoulder[0] + I.rShoulder[0]) / 2, (I.lShoulder[1] + I.rShoulder[1]) / 2];
    const hip = I.lHip && I.rHip ? [(I.lHip[0] + I.rHip[0]) / 2, (I.lHip[1] + I.rHip[1]) / 2] : null;
    const len = hip ? Math.hypot(hip[0] - chest[0], hip[1] - chest[1]) : IM.len || 0.3;
    IM.len = IM.len ? IM.len + 0.03 * (len - IM.len) : len;
    if (IM.base === null || chest[1] < IM.base) IM.base = chest[1];
    else IM.base += 2e-3 * (chest[1] - IM.base);
    let p = I[k];
    if (ARM[k] && I[ARM[k]]) {
      const sh = I[ARM[k]];
      const ag = forDraw ? FG().drawArm || 1 : figA();
      p = [sh[0] + ag * (p[0] - sh[0]), sh[1] + ag * (p[1] - sh[1])];
    }
    const sv = figT() / Math.max(0.05, IM.len), su = sv * (innerHeight || 720) / (innerWidth || 1280);
    const midX = (_a = BP._mirC) != null ? _a : (BP.imgAR || 0.5625) / 2;
    const step = !BP.mirrorFollow ? 0 : Math.max(-0.42, Math.min(0.42, -(chest[0] - midX) / (BP.imgAR || 0.5625) * IM.step));
    const drop = Math.max(-0.12, Math.min(0.3, (chest[1] - IM.base) * sv));
    let ground = 0;
    if (figLegs() && I.lFoot && I.rFoot) {
      if (GA.at !== BP.imgAt) {
        GA.at = BP.imgAt;
        const fy = Math.max(I.lFoot[1], I.rFoot[1]);
        const want = (FG().floorY || 0.86) - (figC() + drop + (fy - chest[1]) * sv);
        GA.off = GA.off === null ? want : GA.off + (want - GA.off) * 0.08;
      }
      ground = GA.off || 0;
    }
    return [0.5 + step - (p[0] - chest[0]) * su, figC() + drop + (p[1] - chest[1]) * sv + ground];
  }
  function frameReach(side, ptr) {
    const I = BP.img, h = I[side + "Hand"], ar = BP.imgAR || 0.5625;
    if (!h || !I.lShoulder || !I.rShoulder) return null;
    const cx = (I.lShoulder[0] + I.rShoulder[0]) / 2, cy = (I.lShoulder[1] + I.rShoulder[1]) / 2;
    const xm = ar - h[0], cm = ar - cx;
    const arm = 1.45 * (IM.len || 0.3);
    const sideR = ptr ? (s) => 0.88 * Math.max(0.05, Math.min(s, 0.9 * (IM.len || 0.3) / 0.88)) : (s) => 0.88 * Math.max(0.05, Math.min(s, arm));
    const u = xm >= cm ? 0.5 + 0.5 * Math.min(1, (xm - cm) / sideR(ar - cm)) : 0.5 - 0.5 * Math.min(1, (cm - xm) / sideR(cm));
    const hipY = I.lHip && I.rHip ? (I.lHip[1] + I.rHip[1]) / 2 : cy + 0.3;
    const upR = 0.85 * Math.max(0.05, Math.min(cy, (ptr ? 0.8 / 0.85 : 1.3) * (IM.len || 0.3)));
    const v = h[1] <= cy ? figC() - figC() * Math.min(1, (cy - h[1]) / upR) : figC() + (1 - figC()) * Math.min(1.08, (h[1] - cy) / (0.8 * Math.max(0.05, hipY - cy)));
    return [u, v];
  }
  function mirrorImg(k, forDraw, pointer) {
    const base = mirrorImgBase(k, forDraw);
    if (!base) return null;
    if (!ARM[k] || forDraw) return base;
    const side = k[0], sh = mirrorImgBase(side + "Shoulder"), hr = mirrorImgBase(side + "Hand"), fr = FG().frameReach === false && !pointer ? hr : frameReach(side, pointer);
    if (!sh || !hr || !fr) return base;
    const hx = Math.abs(fr[0] - 0.5) > Math.abs(hr[0] - 0.5) ? fr[0] : hr[0];
    const hy = fr[1] > figC() ? fr[1] : Math.abs(fr[1] - figC()) > Math.abs(hr[1] - figC()) ? fr[1] : hr[1];
    const RG = forDraw || pointer ? 1 : BP.reachGain || 1;
    if (k.endsWith("Hand")) {
      const g = RG;
      return g === 1 ? [hx, hy] : [Math.max(0, Math.min(1, sh[0] + (hx - sh[0]) * g)), Math.max(0, Math.min(1.05, sh[1] + (hy - sh[1]) * g))];
    }
    const d0 = Math.hypot(hr[0] - sh[0], hr[1] - sh[1]), s = (d0 > 1e-4 ? Math.hypot(hx - sh[0], hy - sh[1]) / d0 : 1) * RG;
    return [sh[0] + (base[0] - sh[0]) * s, sh[1] + (base[1] - sh[1]) * s];
  }
  function mirrorPt(J, k, forDraw) {
    const mi = mirrorImg(k, forDraw);
    if (mi) return mi;
    if (!J[k] || !J.lShoulder || !J.rShoulder || !J.root) return null;
    const chest = J.lShoulder.map((c, i) => (c + J.rShoulder[i]) / 2);
    const T = Math.max(0.3, Math.min(0.75, chest[1] - J.root[1]));
    let p = J[k];
    if (ARM[k] && J[ARM[k]]) {
      const sh = J[ARM[k]];
      p = sh.map((c, i) => c + figA() * (p[i] - c));
    }
    const size = 0.5 / Math.max(0.3, Math.min(0.7, BP._Ts || T));
    const aspect = (innerHeight || 720) / (innerWidth || 1280), su = MIR.scale * size * aspect, sv = MIR.scale * size;
    const bd = BP.body, step = !BP.mirrorFollow ? 0 : Math.max(-1, Math.min(1, BP._mirC3 ? dot(sub(J.root, BP._mirC3), right) / 0.6 : bd.x || 0)) * MIR.step, drop = (bd.crouch || 0) * MIR.squat - (bd.jumping ? 0.06 : 0);
    const u = 0.5 + step + dot(sub(p, chest), right) * su;
    const v = MIR.chestV + drop + (chest[1] - p[1]) * sv;
    return [u, v];
  }
  BP.mirrorPt = (k) => mirrorPt(BP.joints, k);
  BP.steer = function(st, dt, o = {}) {
    var _a, _b, _c;
    if (o.mode === "place") {
      const t2 = BP.body.tiltLive ? BP.body.tilt || 0 : Math.max(-1, Math.min(1, (BP.body.shoulders || 0) * 1.3));
      const dz = o.dead || 0, a = Math.max(0, (Math.abs(t2) - dz) / (1 - dz));
      const want = 0.5 + 0.5 * Math.sign(t2) * Math.pow(a, o.curve || 0.85);
      st.pos = ((_a = st.pos) != null ? _a : 0.5) + (want - ((_b = st.pos) != null ? _b : 0.5)) * (1 - Math.exp(-dt / (o.tau || 0.07)));
      return st.pos;
    }
    const t = BP.body.tiltLive ? BP.body.tilt || 0 : Math.max(-1, Math.min(1, (BP.body.shoulders || 0) * 1.3));
    let u = Math.sign(t) * Math.pow(Math.abs(t), 1.5);
    u = Math.max(-1, Math.min(1, u + (o.push === false ? 0 : 0.55 * (BP.body.push || 0))));
    st.pos = Math.max(0, Math.min(1, ((_c = st.pos) != null ? _c : 0.5) + u * (o.maxV || 1.9) * dt));
    return st.pos;
  };
  BP.recenter = (ms = 1100) => {
    const t = performance.now();
    BP._rcUntil = t + ms;
    BP._rcMax = t + ms + 3e3;
  };
  const PAGE = typeof location !== "undefined" ? (location.pathname.split("/").pop() || "").replace(/\.html$/, "") : "";
  const PAUSE_HOLD = { walls: 3.5, keeper: 3, airband: 3, posematch: 3, gallery: 3, starjumps: 3, track: 3, blaster: 3, breaker: 4, fruit: 3, balloon: 3, bubbles: 3, runner: 3, moles: 3 };
  BP.handMode = "mirror";
  BP.needs = "upper";
  let lastNow = 0, stillFor = 0;
  let sim = null, mouse = null;
  BP.simulate = (fn) => {
    sim = fn;
    BP.simulating = !!fn;
  };
  const START_STATES = /^(title|end|over|gameover|menu|results?|done|finish|ready)$/i;
  function startButton() {
    return [...document.querySelectorAll("#start, #again, button, .btn, [data-hover]")].find((e) => {
      const r = e.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== "hidden" && /^\s*(start|play again|again|play)\b/i.test(e.innerText || "");
    });
  }
  const UPS = { p: null, t: 0, sp: 9 };
  function bothUpStill(now) {
    const I = BP.img, fresh = I && I.head && I.lHand && I.rHand && I.lShoulder && I.rShoulder && I.lHip && I.rHip && performance.now() - (BP.imgAt || 0) < 700;
    if (!fresh) {
      UPS.p = null;
      return !!(BP.body && BP.body.armsUp) && (BP.hands.left.speed || 0) < 0.6 && (BP.hands.right.speed || 0) < 0.6;
    }
    const cx = (I.lShoulder[0] + I.rShoulder[0]) / 2, cy = (I.lShoulder[1] + I.rShoulder[1]) / 2, L = Math.max(0.05, Math.hypot(cx - (I.lHip[0] + I.rHip[0]) / 2, cy - (I.lHip[1] + I.rHip[1]) / 2));
    const up = I.lHand[1] < I.head[1] - 0.15 * L && I.rHand[1] < I.head[1] - 0.15 * L;
    if (BP.imgAt !== UPS.t) {
      const p = [I.lHand[0], I.lHand[1], I.rHand[0], I.rHand[1]], dt = (BP.imgAt - UPS.t) / 1e3;
      if (UPS.p && dt > 0 && dt < 0.5) {
        const v = Math.max(Math.hypot(p[0] - UPS.p[0], p[1] - UPS.p[1]), Math.hypot(p[2] - UPS.p[2], p[3] - UPS.p[3])) / dt / L;
        UPS.sp += (v - UPS.sp) * 0.35;
      }
      UPS.p = p;
      UPS.t = BP.imgAt;
    }
    return up && UPS.sp < 1.2;
  }
  function armsStartable() {
    if (/(^|\/)(index\.html)?$/.test(location.pathname)) return false;
    const s = window.__game && window.__game.state;
    return s ? START_STATES.test(String(s)) : !!startButton();
  }
  BP._dbgStart = () => ({ startable: armsStartable(), lock: !!BP._armsStartLock, up: !!(BP.body && BP.body.armsUp), present: BP.present, legs: BP.legsSeen, framing: BP.framing || "" });
  function pressStart() {
    const s = window.__game && window.__game.state;
    if (s && START_STATES.test(String(s))) {
      for (const tgt of [window, document]) tgt.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true }));
    } else {
      const b = startButton();
      if (b) b.click();
    }
    emit("armsStart");
  }
  try {
    BP.ready = Date.now() - (+localStorage.bp_ready || 0) < 12e4;
  } catch (_) {
    BP.ready = false;
  }
  const onPtr = (e) => {
    if (e.pointerType === "touch" && e.type === "pointermove") return;
    mouse = { x: e.clientX / innerWidth, y: e.clientY / innerHeight, t: performance.now() };
  };
  addEventListener("pointermove", onPtr);
  addEventListener("pointerdown", onPtr);
  function setHand(h, x, y, dt) {
    const ox = h.x, oy = h.y;
    h.x = x;
    h.y = y;
    h.px = x;
    h.py = y;
    const b = 1 - Math.exp(-dt * 18);
    h.vx += b * ((h.x - ox) / dt - h.vx);
    h.vy += b * ((h.y - oy) / dt - h.vy);
    h.speed = Math.hypot(h.vx, h.vy);
    h.seen = true;
  }
  function stepped(now) {
    const bd = BP.body, gap = now - (bd._lastStep || 0);
    bd._lastStep = now;
    bd.steps++;
    if (gap > 150 && gap < 1200) {
      const spm = 6e4 / gap;
      bd.cadence = bd.cadence ? bd.cadence * 0.6 + spm * 0.4 : spm;
    }
    emit("step", { cadence: bd.cadence });
  }
  const PJ = BP._pj = { hb: null, fb: null, Tb: null, prev: null, on: false, at: 0 };
  function picJump(now, dt) {
    var _a, _b;
    const I = BP.img, v = BP.vis || {};
    const fresh = I && performance.now() - (BP.imgAt || 0) < 700 && I.lShoulder && I.rShoulder && I.lHip && I.rHip;
    if (!fresh) {
      PJ.prev = null;
      return null;
    }
    const ri = BP.rawImg || {}, inside = (p) => p && p[0] > 0.01 && p[0] < 0.99 && p[1] > 0.01 && p[1] < 0.99;
    const sure = ["lShoulder", "rShoulder", "lHip", "rHip"].every((k) => {
      var _a2;
      return ((_a2 = v[k]) != null ? _a2 : 1) > 0.6 && inside(ri[k]);
    });
    if (!sure) {
      PJ.prev = null;
      PJ.on = false;
      return false;
    }
    const sy = (I.lShoulder[1] + I.rShoulder[1]) / 2, hy = (I.lHip[1] + I.rHip[1]) / 2, T = Math.max(0.03, hy - sy);
    const feet = I.lFoot && I.rFoot && ri.lFoot && ri.rFoot && ri.lFoot[1] < 0.985 && ri.rFoot[1] < 0.985 && ((_a = v.lFoot) != null ? _a : 1) > 0.4 && ((_b = v.rFoot) != null ? _b : 1) > 0.4;
    const fy = feet ? Math.max(I.lFoot[1], I.rFoot[1]) : null;
    if (BP.imgAt === PJ.key) return PJ.on;
    PJ.key = BP.imgAt;
    const t = BP.imgAt / 1e3;
    if (!PJ.prev || t - PJ.prev[0] > 0.4) {
      PJ.hb = hy;
      PJ.fb = fy;
      PJ.Tb = T;
      PJ.prev = [t, hy, sy];
      PJ.h = [[t, hy, sy]];
      PJ.on = false;
      return false;
    }
    PJ.prev = [t, hy, sy];
    PJ.h.push(PJ.prev);
    while (PJ.h.length > 2 && t - PJ.h[1][0] >= 0.1) PJ.h.shift();
    const h0 = PJ.h[0], d = Math.max(0.02, t - h0[0]);
    const vh = (hy - h0[1]) / d / PJ.Tb, vs = (sy - h0[2]) / d / PJ.Tb;
    const sane = T > 0.75 * PJ.Tb && T < 1.3 * PJ.Tb;
    PJ.bad = sane ? 0 : (PJ.bad || 0) + 1;
    if (PJ.bad > 8) {
      PJ.Tb = T;
      PJ.hb = hy;
      PJ.fb = fy;
      PJ.bad = 0;
      PJ.on = false;
      return false;
    }
    const up = (PJ.hb - hy) / PJ.Tb, fup = feet && PJ.fb !== null ? (PJ.fb - fy) / PJ.Tb : null;
    PJ.dbg = [+up.toFixed(2), +vh.toFixed(2), +vs.toFixed(2), fup === null ? null : +fup.toFixed(2), sane];
    if (!PJ.on) {
      const feetOk = fup === null ? up > 0.18 : fup > 0.05 && Math.abs(fup - up) < 0.45 || up > 0.18 && fup > -0.05;
      if (sane && up > 0.12 && up < 0.9 && vh < -0.9 && vs < -0.55 && feetOk) {
        PJ.on = true;
        PJ.at = t;
      } else {
        PJ.hb += (hy - PJ.hb) * (Math.abs(vh) < 0.6 ? 0.04 : 5e-3);
        if (sane) PJ.Tb += (T - PJ.Tb) * 0.03;
        if (feet) PJ.fb = PJ.fb === null ? fy : PJ.fb + (fy - PJ.fb) * (fy > PJ.fb ? 0.3 : 0.02);
      }
    } else if (up < 0.06 || t - PJ.at > 0.9) PJ.on = false;
    return PJ.on;
  }
  BP.update = function(now) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
    {
      const g = now - (lastNow || now);
      if (g > 0 && g < 1e3) BP._fdt = (BP._fdt || 16) + 0.1 * (g - (BP._fdt || 16));
    }
    const dt = Math.min(0.05, Math.max(1 / 240, (now - (lastNow || now)) / 1e3)) || 1 / 60;
    lastNow = now;
    if (sim) {
      const o = sim(now) || {}, bd2 = BP.body;
      BP.live = true;
      for (const side of ["left", "right"]) if (o[side]) setHand(BP.hands[side], o[side].x, o[side].y, dt);
      bd2.crouch = o.crouch || 0;
      bd2.x = o.x || 0;
      bd2.shoulders = (_b = (_a = o.shoulders) != null ? _a : o.x) != null ? _b : 0;
      bd2.lean = o.lean || 0;
      bd2.armsUp = !!o.armsUp;
      if (bd2.crouch > SQ.on && !bd2._sq) {
        bd2._sq = true;
        emit("squat");
      }
      if (bd2.crouch < SQ.off) bd2._sq = false;
      if (o.jump && !bd2.jumping) emit("jump");
      bd2.jumping = !!o.jump;
      if (o.starJump && !bd2.starJump) emit("starjump");
      bd2.starJump = !!o.starJump;
      if (o.punchL) emit("punchL", { x: BP.hands.left.x, y: BP.hands.left.y, power: 0.8 });
      if (o.punchR) emit("punchR", { x: BP.hands.right.x, y: BP.hands.right.y, power: 0.8 });
      if (o.kickL) emit("kickL", { power: 0.8 });
      if (o.kickR) emit("kickR", { power: 0.8 });
      if (o.running !== void 0) {
        bd2.running = o.running;
        bd2.cadence = 60 + 140 * o.running;
        if (o.running > 0.05 && now - (bd2._lastStep || 0) > 6e4 / bd2.cadence) {
          bd2._lastStep = now;
          bd2.steps++;
          emit("step", { cadence: bd2.cadence });
        }
      } else {
        bd2.running = 0;
        bd2.cadence = 0;
      }
      const effort = (_c = o.intensity) != null ? _c : Math.min(1, (BP.hands.left.speed + BP.hands.right.speed) / 3 + (o.running || 0) + (o.jump ? 0.5 : 0) + (o.crouch || 0) * 0.3);
      BP.activity.intensity += (effort - BP.activity.intensity) * Math.min(1, dt * 2);
      if (BP.activity.intensity > 0.12) BP.activity.activeSec += dt;
      BP.activity.kcal += (1.5 + 7 * BP.activity.intensity) * 3.5 * 75 / 200 / 60 * dt;
      return;
    }
    const age = (now - lastAt) / 1e3;
    BP.phoneLive = lastAt > 0 && age < 0.7;
    const mouseNow = !!(mouse && now - mouse.t < 5e3);
    BP.live = BP.phoneLive && !mouseNow;
    if (!BP.live) {
      BP.activity.intensity *= 0.95;
      if (mouse && now - mouse.t < 5e3) {
        BP.mouse = true;
        setHand(BP.hands.right, mouse.x, mouse.y, dt);
        BP.hands.left.seen = false;
      } else BP.mouse = false;
      return;
    }
    BP.mouse = false;
    if (BP.imgTarget && BP.imgSpring && FEEL.interpHz > 0) {
      const w = 2 * Math.PI * FEEL.interpHz;
      for (const k of Object.keys(BP.imgTarget)) {
        const t = BP.imgTarget[k];
        if (!t) continue;
        let s = BP.imgSpring[k];
        if (!s || !s.p) {
          s = BP.imgSpring[k] = { p: t.slice(), v: [0, 0] };
          BP.img[k] = t.slice();
          continue;
        }
        const e = Math.exp(-w * dt);
        for (let k2 = 0; k2 < 2; k2++) {
          const x = s.p[k2] - t[k2], v = s.v[k2];
          s.p[k2] = t[k2] + (x + (v + w * x) * dt) * e;
          s.v[k2] = (v - (v + w * x) * w * dt) * e;
        }
        BP.img[k] = [s.p[0], s.p[1]];
      }
      BP.imgDrawAt = now;
    }
    const decay = Math.exp(-age * 4), J = {};
    for (const [k, f] of Object.entries(JF)) if (f.p) J[k] = f.p.map((c, i) => c + Math.max(-0.12, Math.min(0.12, f.v[i] * Math.min(0.08, 0.02 + age) * decay)));
    BP.joints = J;
    if (!J.root || !J.lShoulder || !J.rShoulder) return;
    let r = sub(J.rShoulder, J.lShoulder);
    r[1] = 0;
    const n = Math.hypot(r[0], r[2]);
    if (n > 0.05) {
      r = r.map((c) => c / n);
      if (!BP._rightSet) right = r;
      else if (dot(r, right) > 0) right = right.map((c, i) => c + 0.08 * (r[i] - c));
      BP._rightSet = true;
      const m = Math.hypot(...right);
      right = right.map((c) => c / m);
    }
    const fwd = [right[2], 0, -right[0]];
    if (!center || now - lastSeen > 1500) {
      center = J.root.slice();
      standY = J.root[1];
      crouchY = J.root[1];
      BP._rightSet = false;
    }
    lastSeen = now;
    center = center.map((c, i) => c + (now < (BP._rcUntil || 0) ? 1 - Math.exp(-dt / 0.12) : 6e-4) * (J.root[i] - c));
    BP._mirC3 = BP._mirC3 && now - lastSeen < 1500 ? BP._mirC3.map((c, i) => c + 4e-3 * (J.root[i] - c)) : J.root.slice();
    const T = Math.max(0.3, Math.min(0.75, (J.rShoulder[1] + J.lShoulder[1]) / 2 - J.root[1]));
    BP._Ts = BP._Ts && now - lastSeen < 50 ? BP._Ts + 0.02 * (T - BP._Ts) : T;
    for (const [side, hk, sk, out, fk] of [["left", "lHand", "lShoulder", -1, "lHand"], ["right", "rHand", "rShoulder", 1, "rHand"]]) {
      const h = BP.hands[side];
      if (!J[hk] || !J[sk]) {
        h.seen = false;
        continue;
      }
      const [tx, ty] = BP.handMode === "box" ? reach(J, hk, sk, out, T) : mirrorPt(J, hk);
      const a = FEEL.cursorRate > 0 ? 1 - Math.exp(-dt * FEEL.cursorRate) : 1, ox = h.x, oy = h.y;
      let mx = (tx - h.x) * a, my = (ty - h.y) * a;
      const step = Math.hypot(mx, my), cap = FEEL.capScreens * dt;
      if (FEEL.capScreens > 0 && step > cap) {
        mx *= cap / step;
        my *= cap / step;
      }
      h.x = Math.max(0, Math.min(1, h.x + mx));
      h.y = Math.max(0, Math.min(1, h.y + my));
      {
        const pt = BP.handMode === "box" ? null : mirrorImg(hk, false, true), px = pt ? pt[0] : tx, py = pt ? pt[1] : ty;
        if (h.px === void 0) {
          h.px = h.x;
          h.py = h.y;
        }
        const qx = h.px, qy = h.py;
        const pf = h._pf || (h._pf = { x: px, y: py, dx: 0, dy: 0 }), al = (c) => 1 / (1 + 1 / (2 * Math.PI * c * dt));
        const ad = al(PTR.dCut);
        pf.dx += ad * ((px - pf.x) / dt - pf.dx);
        pf.dy += ad * ((py - pf.y) / dt - pf.dy);
        const ap = al(PTR.minCut + PTR.beta * Math.hypot(pf.dx, pf.dy));
        pf.x += ap * (px - pf.x);
        pf.y += ap * (py - pf.y);
        h.px = Math.max(0, Math.min(1, h.px + (pf.x - h.px) * a));
        h.py = Math.max(0, Math.min(1, h.py + (pf.y - h.py) * a));
        h.pspeed = (h.pspeed || 0) + (1 - Math.exp(-dt * 8)) * (Math.hypot(h.px - qx, (h.py - qy) * (innerHeight || 720) / (innerWidth || 1280)) / dt - (h.pspeed || 0));
      }
      const b = 1 - Math.exp(-dt * 18);
      h.vx += b * ((h.x - ox) / dt - h.vx);
      h.vy += b * ((h.y - oy) / dt - h.vy);
      h.speed = Math.hypot(h.vx, h.vy);
      const pushNow = JF[fk] ? dot(JF[fk].v, fwd) - (JF.root ? dot(JF.root.v, fwd) : 0) : 0;
      h.push += b * (pushNow - h.push);
      h.seen = true;
      {
        const I = BP.img, ok = I[hk] && I.lShoulder && I.rShoulder && I.lHip && I.rHip && performance.now() - (BP.imgAt || 0) < 700;
        if (ok) {
          const cy = (I.lShoulder[1] + I.rShoulder[1]) / 2, hy = (I.lHip[1] + I.rHip[1]) / 2;
          h.raised = I[hk][1] < hy - 0.35 * (hy - cy);
        } else h.raised = J[hk][1] > J.root[1] + 0.3 * T;
      }
      if (h.push > 1.6 && !h._punched && now - (PP.last[side] || -9e9) > 300) {
        h._punched = true;
        PP.last[side] = now;
        emit(side === "left" ? "punchL" : "punchR", { x: h.x, y: h.y, power: Math.min(1, h.push / 3.5) });
      }
      if (h.push < 0.4) h._punched = false;
    }
    if (BP.present === false && !sim) {
      BP.hands.left.seen = false;
      BP.hands.right.seen = false;
    }
    picturePunches(now);
    const bd = BP.body, rootV = JF.root ? JF.root.v : [0, 0, 0];
    bd.x = Math.max(-1, Math.min(1, dot(sub(J.root, center), right) / 0.6));
    if (J.root[1] > standY) standY = J.root[1];
    else standY += (J.root[1] - standY) * 15e-4;
    if (crouchY === null || !center) crouchY = J.root[1];
    if (rootV[1] > 0.45 || bd.jumping) airUntil = now + 380;
    if (J.root[1] > crouchY) {
      if (now > airUntil) crouchY += (J.root[1] - crouchY) * Math.min(1, dt * 6);
    } else crouchY += (J.root[1] - crouchY) * (1 - Math.exp(-dt / 11));
    const drop = Math.max(0, crouchY - J.root[1]);
    if (drop < 0.05 && BP._Ts) BP._Tstand = BP._Tstand ? BP._Tstand + (BP._Ts - BP._Tstand) * Math.min(1, dt * 0.5) : BP._Ts;
    const size = Math.max(0.65, Math.min(1.15, (BP._Tstand || 0.5) / 0.5));
    bd.crouch = Math.max(0, Math.min(1, (drop / size - SQ.d0) / SQ.span));
    bd.crouchM = drop / size;
    if (bd.crouch > SQ.on && !bd._sq) {
      bd._sq = true;
      emit("squat");
    }
    if (bd.crouch < SQ.off) bd._sq = false;
    const wasJumping = bd.jumping;
    const pj = picJump(now, dt);
    bd.jumping = pj !== null ? pj : rootV[1] > 0.9 || J.root[1] - standY > 0.07 && rootV[1] > 0.3;
    if (bd.jumping && !wasJumping) emit("jump");
    {
      const I = BP.img, fresh = I && I.lShoulder && I.rShoulder && performance.now() - (BP.imgAt || 0) < 700;
      let push = 0;
      if (fresh && I.lHand && I.rHand) {
        const near = (sd) => now - (BP.hands[sd].nearAt || -1e9) < 600;
        const l = I.lHand[1] < I.lShoulder[1] - 0.02 && !near("left"), r2 = I.rHand[1] < I.rShoulder[1] - 0.02 && !near("right");
        push = r2 && !l ? 1 : l && !r2 ? -1 : 0;
      }
      bd.push = push;
      if (fresh) {
        const sw = Math.max(0.03, Math.hypot(I.lShoulder[0] - I.rShoulder[0], I.lShoulder[1] - I.rShoulder[1]));
        const tl = (I.rShoulder[1] - I.lShoulder[1]) / sw;
        let raw = push ? 0 : tl;
        if (I.lHip && I.rHip) {
          const cx = (I.lShoulder[0] + I.rShoulder[0]) / 2, cy = (I.lShoulder[1] + I.rShoulder[1]) / 2;
          const hx = (I.lHip[0] + I.rHip[0]) / 2, hy = (I.lHip[1] + I.rHip[1]) / 2, T2 = Math.max(0.05, Math.hypot(cx - hx, cy - hy));
          const sway = (hx - cx) / T2;
          raw = push ? sway : 0.35 * tl + 0.65 * sway;
        }
        const L = BP._lean || (BP._lean = { bias: null, s: 0, at: 0 });
        if (L.bias === null || now - L.at > 3e3) {
          L.bias = 0.5 * Math.max(-0.05, Math.min(0.05, raw));
          L.s = raw;
        }
        L.at = now;
        L.s += (raw - L.s) * (1 - Math.exp(-dt / 0.13));
        const e = L.s - L.bias, DZ = 0.03, FULL = 0.17;
        L.bias += (Math.max(-0.12, Math.min(0.12, L.s)) - L.bias) * (1 - Math.exp(-dt / (Math.abs(e) < DZ * 1.5 ? 4 : 10)));
        bd.tilt = Math.sign(e) * Math.min(1, Math.max(0, (Math.abs(e) - DZ) / (FULL - DZ)));
        bd.straightFor = Math.abs(e) < DZ * 1.5 ? (bd.straightFor || 0) + dt : 0;
        bd.tiltLive = true;
      } else {
        bd.tilt = (bd.tilt || 0) * 0.9;
        bd.tiltLive = false;
      }
    }
    {
      const I = BP.img, fresh = performance.now() - (BP.imgAt || 0) < 700 && I.lShoulder && I.rShoulder;
      let off = null;
      if (fresh) {
        const cx = (I.lShoulder[0] + I.rShoulder[0]) / 2, len = IM.len || 0.3;
        if (BP._shC === void 0 || now - lastSeenShoulders > 5e3) BP._shC = cx;
        if (now < (BP._rcUntil || 0)) {
          if (BP._rcX !== void 0 && Math.abs(cx - BP._rcX) / len / Math.max(dt, 1e-3) > 0.5) BP._rcUntil = Math.min(BP._rcMax, now + 400);
          BP._rcX = cx;
          BP._shC += (cx - BP._shC) * (1 - Math.exp(-dt / 0.12));
        } else BP._rcX = void 0;
        off = -(cx - BP._shC) / len / 0.6;
        if (Math.abs(off) > 1.3) BP._shC += 4e-3 * (cx - BP._shC);
        BP._mirC = BP._shC;
      } else {
        const ch = J.lShoulder.map((c, i) => (c + J.rShoulder[i]) / 2);
        off = dot(sub(ch, center), right) / 0.3;
      }
      lastSeenShoulders = now;
      bd.shoulders = Math.max(-1, Math.min(1, off));
    }
    bd.lean = J.head ? Math.max(-1, Math.min(1, dot(sub(J.head, J.root), right) / 0.22)) : 0;
    bd.steer = bd.tiltLive ? bd.tilt || 0 : bd.shoulders || 0;
    bd.armsUp = !!(J.lHand && J.rHand && J.lHand[1] > ((_d = J.head) == null ? void 0 : _d[1]) && J.rHand[1] > ((_e = J.head) == null ? void 0 : _e[1]));
    {
      const v = BP.vis, whole = !v || ((_f = v.lHip) != null ? _f : 1) > 0.5 && ((_g = v.rHip) != null ? _g : 1) > 0.5 && ((_h = v.lKnee) != null ? _h : 1) > 0.4 && ((_i = v.rKnee) != null ? _i : 1) > 0.4;
      BP.wholeBody = whole;
      if (!BP.ready) {
        BP.checkIn = (bd.armsUp || typeof window !== "undefined" && window.BP_PHONEUI) && whole && BP.present !== false ? Math.min(1, (BP.checkIn || 0) + dt / 0.7) : Math.max(0, (BP.checkIn || 0) - dt * 2);
        if (BP.checkIn >= 1) {
          BP.ready = true;
          BP.readyAt = now;
          IM.base = null;
          BP._mirC3 = null;
          emit("ready");
        }
      }
      if (BP.ready && !BP._armsStartLock && armsStartable() && BP.present !== false) {
        const upStill = bothUpStill(now);
        BP.armsStart = upStill ? Math.min(1, (BP.armsStart || 0) + dt / 1) : Math.max(0, (BP.armsStart || 0) - dt * 3);
        if (BP.armsStart >= 1) {
          BP.armsStart = 0;
          BP._armsStartLock = true;
          pressStart();
        }
      } else if (!armsStartable()) BP.armsStart = 0;
      if (!bd.armsUp) BP._armsStartLock = false;
      {
        const ri = BP.rawImg, fresh = ri && performance.now() - (BP.imgAt || 0) < 700 && ri.lShoulder && ri.rShoulder && ri.lHip && ri.rHip;
        let ok;
        if (fresh) {
          const ar = BP.imgAR || 0.5625, inside = (p) => p[1] > 0.01 && p[1] < 0.99 && p[0] > 0 && p[0] < 1;
          const torso = Math.hypot((ri.lShoulder[0] + ri.rShoulder[0] - (ri.lHip[0] + ri.rHip[0])) / 2 * ar, (ri.lShoulder[1] + ri.rShoulder[1] - (ri.lHip[1] + ri.rHip[1])) / 2);
          ok = inside(ri.lShoulder) && inside(ri.rShoulder) && inside(ri.lHip) && inside(ri.rHip) && torso > 0.06 && torso < 0.42;
          const v2 = BP.vis || {}, sure = (k) => {
            var _a2;
            return ((_a2 = v2[k]) != null ? _a2 : 1) > 0.6;
          };
          const seenWhole = ri.head && inside(ri.head) && sure("head") && sure("lShoulder") && sure("rShoulder") && sure("lHip") && sure("rHip") && ri.lHand && ri.rHand && inside(ri.lHand) && inside(ri.rHand) && ((_j = v2.lHand) != null ? _j : 1) > 0.5 && ((_k = v2.rHand) != null ? _k : 1) > 0.5;
          const legs = BP.needs !== "full" || ri.lKnee && ri.rKnee && ri.lFoot && ri.rFoot && inside(ri.lKnee) && inside(ri.rKnee) && ri.lFoot[1] < 0.985 && ri.rFoot[1] < 0.985 && (BP.sideOnFeet ? Math.max((_l = v2.lFoot) != null ? _l : 1, (_m = v2.rFoot) != null ? _m : 1) > 0.5 : ((_n = v2.lFoot) != null ? _n : 1) > 0.35 && ((_o = v2.rFoot) != null ? _o : 1) > 0.35);
          BP.legsSeen = !!legs;
          const playing = !!BP.inPlay, mid = [(ri.lShoulder[0] + ri.rShoulder[0]) / 2, (ri.lShoulder[1] + ri.rShoulder[1]) / 2];
          if (playing) ok = inside(mid) && ((_p = v2.lShoulder) != null ? _p : 1) > 0.3 && ((_q = v2.rShoulder) != null ? _q : 1) > 0.3;
          else ok = ok && legs && (BP.present === true ? ri.head && inside(ri.head) && sure("lShoulder") && sure("rShoulder") : seenWhole);
          const hipsIn = ri.lHip[1] < 0.97 && ri.rHip[1] < 0.97;
          BP.framing = !ok ? "away" : BP.needs === "full" && !hipsIn ? "close" : null;
        } else {
          const v2 = BP.vis;
          ok = !v2 || ((_r = v2.lHip) != null ? _r : 1) > 0.5 && ((_s = v2.rHip) != null ? _s : 1) > 0.5;
          BP.framing = ok ? null : "away";
        }
        BP._presT = ok === BP._presOk ? (BP._presT || 0) + dt : 0;
        BP._presOk = ok;
        const was = BP.present;
        if (BP.present === void 0) BP.present = false;
        if (BP._presT > (ok ? 0.5 : 0.4)) BP.present = ok;
        if (was !== BP.present) emit("present", BP.present);
      }
      if (BP.ready && now - (BP._readySaved || 0) > 1e3) {
        BP._readySaved = now;
        try {
          localStorage.bp_ready = Date.now();
        } catch (_) {
        }
      }
    }
    {
      const I = BP.img, fresh = I.head && I.lHand && I.rHand && I.lShoulder && I.rShoulder && I.lHip && I.rHip && performance.now() - (BP.imgAt || 0) < 700;
      let up = false;
      if (fresh) {
        const cx = (I.lShoulder[0] + I.rShoulder[0]) / 2, cy = (I.lShoulder[1] + I.rShoulder[1]) / 2, L = Math.max(0.05, Math.hypot(cx - (I.lHip[0] + I.rHip[0]) / 2, cy - (I.lHip[1] + I.rHip[1]) / 2));
        up = [I.lHand, I.rHand].every((h) => h[1] < I.head[1] - 0.25 * L && Math.abs(h[0] - cx) < 0.9 * L);
      }
      BP._bothUp = up;
      const hold = BP.pauseHold === void 0 ? (_t = PAUSE_HOLD[PAGE]) != null ? _t : 1.5 : BP.pauseHold, on = typeof hold === "number" && hold > 0;
      const can = isGamePage && on && !BP.paused && BP.inPlay && !BP.warmingUp && !armsStartable() && BP.present !== false;
      BP._pauseHold = up && can ? (BP._pauseHold || 0) + dt : 0;
      if (on && BP._pauseHold >= hold && !BP._pauseLock) {
        BP._pauseLock = true;
        BP._pauseHold = 0;
        BP.setPaused && BP.setPaused(true);
        emit("pausegesture");
      }
      if (!up) BP._pauseLock = false;
      if (can && !BP._pauseHinted) {
        BP._pauseHinted = true;
        let n2 = 0;
        try {
          n2 = +localStorage.bp_pausehint || 0;
          localStorage.bp_pausehint = n2 + 1;
        } catch (_) {
        }
        if (n2 < 1) showPauseHint();
      }
    }
    {
      const st = window.__game && window.__game.state, startish = st !== void 0 && st !== null && START_STATES.test(String(st));
      if (BP.inPlay && !BP._rcIn || BP._rcSt === true && st !== void 0 && !startish) BP.recenter();
      BP._rcIn = !!BP.inPlay;
      BP._rcSt = st === void 0 ? null : startish;
    }
    const feetWide = J.lFoot && J.rFoot ? Math.abs(dot(sub(J.rFoot, J.lFoot), right)) > T * 0.95 : bd.armsUp;
    const star = bd.armsUp && feetWide;
    if (star && !bd.starJump) emit("starjump");
    bd.starJump = star;
    const legA = J.lKnee || J.lFoot, legB = J.rKnee || J.rFoot;
    if (legA && legB) {
      const hipY = J.lHip && J.rHip ? (J.lHip[1] + J.rHip[1]) / 2 : J.root[1];
      const lift = (k) => J[k] ? Math.max(0, Math.min(1, (J[k][1] - (hipY - T * 0.95)) / (T * 0.8))) : 0;
      bd.kneeL = lift("lKnee");
      bd.kneeR = lift("rKnee");
      const diff = legA[1] - legB[1], th = 0.025;
      if (diff > th && bd._legSide !== "L") {
        if (bd._legSide) stepped(now);
        bd._legSide = "L";
      } else if (diff < -th && bd._legSide !== "R") {
        if (bd._legSide) stepped(now);
        bd._legSide = "R";
      }
      for (const [foot, ev] of [["lFoot", "kickL"], ["rFoot", "kickR"]]) {
        const fv = JF[foot] ? JF[foot].v : null;
        const kick = fv ? dot(fv, fwd) + Math.max(0, fv[1]) * 0.6 : 0;
        if (kick > 2.2 && !bd["_" + ev]) {
          bd["_" + ev] = true;
          emit(ev, { power: Math.min(1, kick / 4.5) });
        }
        if (kick < 0.6) bd["_" + ev] = false;
      }
    } else if (Math.abs(rootV[1]) > 0.25) {
      const dir = rootV[1] > 0 ? "U" : "D";
      if (bd._legSide && dir !== bd._legSide && dir === "U") stepped(now);
      bd._legSide = dir;
    }
    if (now - (bd._lastStep || 0) > 900) bd.cadence *= 0.9;
    bd.running = Math.max(0, Math.min(1, (bd.cadence - 60) / 140));
    const motion = Math.min(4, (JF.lHand ? Math.hypot(...JF.lHand.v) : 0) + (JF.rHand ? Math.hypot(...JF.rHand.v) : 0) + 2.5 * Math.hypot(...rootV));
    const target = Math.min(1, motion / 3.2);
    BP.activity.intensity += (target - BP.activity.intensity) * Math.min(1, dt * 2);
    if (BP.activity.intensity > 0.12) BP.activity.activeSec += dt;
    const met = 1.5 + 7 * BP.activity.intensity;
    BP.activity.kcal += met * 3.5 * 75 / 200 / 60 * dt;
  };
  const dwells = {};
  const SYS_IDS = /^(bp-home|bp-menu|bp-pause|bp-music|bp-resume|bp-pm-.*)$/, LEAVE_IDS = /^(bp-home|bp-menu)$/;
  const PM_LEAVE = /^bp-pm-(menu|home)$/;
  const SETTLE = { ms: 220, speed: 0.5, fast: 0.9 };
  const ptrSp = (h) => h._gpAt && performance.now() - h._gpAt < 150 ? h._gps || 0 : h.pspeed || 0;
  BP.dwell = function(id, over, now, ms = 700) {
    if (id === "bp-pm-resume") ms = 600;
    else if (id === "bp-music" && BP._mode === "play") ms = 1200;
    else if (PM_LEAVE.test(id)) ms = 1400;
    else if (SYS_IDS.test(id)) ms = LEAVE_IDS.test(id) && BP.inPlay && !BP.paused && !BP.warmingUp && !armsStartable() ? 1400 : Math.min(ms, 800);
    if (typeof window !== "undefined" && window.BP_PHONEUI && LEAVE_IDS.test(id) && !BP.mouse) {
      if (BP.inPlay && !BP.paused && !armsStartable()) return 0;
      ms = 2e3;
    }
    if (/home|leave/i.test(id) && !SYS_IDS.test(id) && BP._lastRect && (BP._lastRect.y > 0.25 || BP._lastRect.x > 0.4)) {
      BP._gameHomeAt = performance.now();
      BP._gameHomeTick = BP._modeTick || 0;
    }
    const d = dwells[id] || (dwells[id] = { t: 0, fired: false, armed: false });
    if (!over) {
      if (d.t && !d.fired && now - (d.lastOver || 0) < Math.max(HOV.grace, slow())) {
        const k2 = Math.min(1, (d.lastOver - d.t) / ms) * 0.999;
        if (RING.id === id) RING.t = now;
        return k2;
      }
      d.t = 0;
      d.fired = false;
      d.armed = true;
      d.hard = false;
      return 0;
    }
    if (!d.armed && (d.hard || !BP.mouse && !sim)) return 0;
    if (!BP.mouse && !sim && !d.t) {
      if (!d.ov || now - (d.ovAt || 0) > Math.max(HOV.grace, slow())) d.ov = now;
      d.ovAt = now;
      const hs = BP.hovered && BP.hands[BP.hovered.side], sp = hs ? ptrSp(hs) : 0;
      if (now - d.ov < SETTLE.ms || sp > SETTLE.speed) return 0;
    }
    if (!d.t || now - (d.lastOver || 0) >= Math.max(HOV.grace, slow())) d.t = now;
    else if (!BP.mouse && !sim && d.lastOver) {
      const hs = BP.hovered && BP.hands[BP.hovered.side];
      if (hs && ptrSp(hs) > SETTLE.fast) d.t += now - d.lastOver;
    } else if (d.lastOver) d.t += Math.max(0, now - d.lastOver - Math.max(150, 1.5 * (BP._fdt || 16)));
    d.lastOver = now;
    const k = Math.min(1, (now - d.t) / ms);
    if (!BP.mouse) {
      RING.id = id;
      RING.k = k;
      RING.t = now;
      RING.leave = PM_LEAVE.test(id) || ms >= 1300;
    }
    if (k >= 1 && !d.fired) {
      d.fired = true;
      return 1;
    }
    return d.fired ? 0 : k * 0.999;
  };
  const MAG = { right: 0.07, below: 0.11, still: 0.5 };
  const SYS = {}, isGamePage = typeof location !== "undefined" && !/\/(index|phone|lab|join)\.html$|\/$/.test(location.pathname);
  let sysEls = { t: 0, r: [] };
  const sysList = () => {
    const now = performance.now();
    if (now - sysEls.t < 100) return sysEls.r;
    sysEls.t = now;
    sysEls.r = typeof document === "undefined" ? [] : [...document.querySelectorAll("#bp-sys > *, #bp-pause, #bp-home, #bp-menu, #bpHome, body > #home, [data-bp-sys]")].map((e) => e.getBoundingClientRect()).filter((q) => q.width > 0).map((q) => ({ x: q.left / innerWidth, y: q.top / innerHeight, w: q.width / innerWidth, h: q.height / innerHeight }));
    return sysEls.r;
  };
  const isSysRect = (r, W, H) => isGamePage && !BP.paused && r.w > 0 && r.y + r.h / 2 < H * 0.2 && r.x + r.w / 2 < W * 0.45 && r.w < W * 0.3 && r.h < H * 0.16 && sysList().some((q) => Math.abs(q.x + q.w / 2 - (r.x + r.w / 2) / W) < Math.max(0.01, q.w * 0.35) && Math.abs(q.y + q.h / 2 - (r.y + r.h / 2) / H) < Math.max(0.015, q.h * 0.35));
  function sysTarget(x, y, W, H, now) {
    let x1 = 0, y1 = 0, best = null, bd = 1e9;
    for (const k in SYS) {
      const q = SYS[k];
      if (now - q.t > 500) {
        delete SYS[k];
        continue;
      }
      x1 = Math.max(x1, q.r.x + q.r.w);
      y1 = Math.max(y1, q.r.y + q.r.h);
    }
    const mn = Math.min(W, H);
    if (!(x < x1 + mn * MAG.right && y < y1 + mn * MAG.below)) return null;
    for (const k in SYS) {
      const r = SYS[k].r, d = Math.hypot(Math.max(r.x - x, 0, x - r.x - r.w), Math.max(r.y - y, 0, y - r.y - r.h)) + r.w * r.h * 1e-7;
      if (d < bd) {
        bd = d;
        best = k;
      }
    }
    return best;
  }
  const pauseRect = (W, H) => {
    const e = typeof document !== "undefined" && document.getElementById("bp-pause");
    if (!e) return null;
    const r = e.getBoundingClientRect();
    if (!r.width) return null;
    const kx = W / (innerWidth || W), ky = H / (innerHeight || H);
    return { x: r.left * kx, y: r.top * ky, w: r.width * kx, h: r.height * ky };
  };
  const GP = {};
  function gamePtr(side, now) {
    if (typeof BP.pointerFor !== "function" || BP.mouse || sim) return null;
    const c = GP[side] || (GP[side] = { p: null, at: 0, sp: 0 });
    if (now - c.at < 4) return c.p;
    let p = null;
    try {
      p = BP.pointerFor(side);
    } catch (_) {
    }
    p = p && Number.isFinite(p.x) && Number.isFinite(p.y) ? { x: Math.max(0, Math.min(1, p.x)), y: Math.max(0, Math.min(1, p.y)) } : null;
    if (p && c.p && now - c.at < 250) {
      const dt = Math.max(4e-3, (now - c.at) / 1e3);
      c.sp += (1 - Math.exp(-dt * 8)) * (Math.hypot(p.x - c.p.x, (p.y - c.p.y) * (innerHeight || 720) / (innerWidth || 1280)) / dt - c.sp);
    } else c.sp = p ? 1 : 0;
    c.p = p;
    c.at = now;
    return p;
  }
  function gameIn(h, side, gp, rect, W, H) {
    const pr = pauseRect(W, H);
    if (!pr || Math.abs(pr.x + pr.w / 2 - rect.x - rect.w / 2) > pr.w / 2 || Math.abs(pr.y + pr.h / 2 - rect.y - rect.h / 2) > pr.h / 2) return false;
    const now = performance.now(), key = Math.round(rect.x) + "," + Math.round(rect.y) + "," + Math.round(rect.w) + "," + Math.round(rect.h);
    SYS[key] = { r: rect, t: now };
    h._gpAt = now;
    h._gps = GP[side].sp;
    const og = gamePtr(side === "left" ? "right" : "left", now), twoUp = !!(og && og.x < 0.15 && og.y < 0.25);
    const gx = gp.x * W, gy = gp.y * H, m = Math.min(rect.w, rect.h) * 0.25;
    if (!(gx > rect.x - m && gx < rect.x + rect.w + m && gy > rect.y - m && gy < rect.y + rect.h + m)) return false;
    h.nearAt = now;
    h.sysAt = now;
    if (twoUp || GP[side].sp >= MAG.still) return false;
    h.magnet = { r: rect, t: now };
    BP.hovered = { key: "sys:" + key, f: { x: rect.x / W, y: rect.y / H, w: rect.w / W, h: rect.h / H }, t: now, side };
    return true;
  }
  const handIn = (h, rect, W, H) => {
    var _a, _b, _c, _d, _e;
    if (!rect || !(rect.w > 0 && rect.h > 0)) return false;
    if (!sim && !BP.mouse && BP.live && BP._mode === "play" && typeof BP.pointerFor === "function" && isSysRect(rect, W, H)) {
      const side = h === BP.hands.left ? "left" : "right", gp = gamePtr(side, performance.now());
      if (gp) return gameIn(h, side, gp, rect, W, H);
    }
    if (!h.seen || !(sim || BP.mouse || h.raised !== false)) return false;
    if (!sim && !BP.mouse && !BP.live) return false;
    const x = ((_a = h.px) != null ? _a : h.x) * W, y = ((_b = h.py) != null ? _b : h.y) * H, mn = Math.min(W, H), m = mn * 0.06, n = mn * 0.16;
    if (!BP.mouse && isSysRect(rect, W, H)) {
      if (BP._mode === "play") {
        const pr = pauseRect(W, H);
        if (!pr || Math.abs(pr.x + pr.w / 2 - rect.x - rect.w / 2) > pr.w / 2 || Math.abs(pr.y + pr.h / 2 - rect.y - rect.h / 2) > pr.h / 2) return false;
      }
      const now2 = performance.now(), key2 = Math.round(rect.x) + "," + Math.round(rect.y) + "," + Math.round(rect.w) + "," + Math.round(rect.h);
      SYS[key2] = { r: rect, t: now2 };
      const o2 = h === BP.hands.left ? BP.hands.right : BP.hands.left, twoUp = !sim && o2.seen && o2.raised !== false && ((_c = o2.py) != null ? _c : o2.y) < 0.35;
      if (sim || ((_d = h.py) != null ? _d : h.y) < 0.99) {
        const t = sysTarget(x, y, W, H, now2);
        if (t) {
          h.nearAt = now2;
          h.sysAt = now2;
          if (t === key2 && !twoUp && (sim || (h.pspeed || 0) < MAG.still)) {
            h.magnet = { r: rect, t: now2 };
            BP.hovered = { key: "sys:" + key2, f: { x: rect.x / W, y: rect.y / H, w: rect.w / W, h: rect.h / H }, t: now2, side: h === BP.hands.left ? "left" : "right" };
            return true;
          }
          return false;
        }
      }
    }
    if (x > rect.x - n && x < rect.x + rect.w + n && y > rect.y - n && y < rect.y + rect.h + n) h.nearAt = performance.now();
    if (BP.mouse) return x > rect.x - m && x < rect.x + rect.w + m && y > rect.y - m && y < rect.y + rect.h + m;
    if (!(((_e = h.py) != null ? _e : h.y) < 0.99 || sim)) return false;
    if (BP._modal && !BP._modalOwn) return false;
    const now = performance.now(), key = offerTarget(rect, W, H, now);
    if (now - (h.sysAt || -1e9) < Math.max(120, slow())) return false;
    const win = resolveHover(h, x / W, y / H, now);
    if (win !== key) return false;
    const o = h === BP.hands.left ? BP.hands.right : BP.hands.left;
    if (o.hov && o.hov.key && o.hov.key !== key && now - o.hov.at < Math.max(120, slow()) && o.hov.since < h.hov.since) return false;
    if (o.magnet && now - o.magnet.t < Math.max(120, slow())) return false;
    BP.hovered = { key, f: TG[key].f, t: now, side: h === BP.hands.left ? "left" : "right" };
    return true;
  };
  const TG = {}, HOV = { stick: 0.05, switchBy: 0.04, grace: 300, fresh: 180 };
  const slow = () => Math.min(600, 2.5 * (BP._fdt || 16));
  function offerTarget(rect, W, H, now) {
    const f = { x: rect.x / W, y: rect.y / H, w: rect.w / W, h: rect.h / H };
    const key = Math.round(f.x * 2e3) + "," + Math.round(f.y * 2e3) + "," + Math.round(f.w * 2e3) + "," + Math.round(f.h * 2e3);
    if (!TG[key]) for (const k in TG) {
      const q = TG[k].f, ix = Math.min(f.x + f.w, q.x + q.w) - Math.max(f.x, q.x), iy = Math.min(f.y + f.h, q.y + q.h) - Math.max(f.y, q.y);
      if (ix > 0 && iy > 0 && ix * iy / (f.w * f.h + q.w * q.h - ix * iy) > 0.55) {
        for (const s of ["left", "right"]) {
          const hv = BP.hands[s].hov;
          if (hv && hv.key === k) hv.key = key;
        }
        delete TG[k];
      }
    }
    TG[key] = { f, t: now };
    return key;
  }
  function resolveHover(h, px, py, now) {
    const iw = innerWidth || 1280, ih = innerHeight || 720, mn = Math.min(iw, ih), m = mn * 0.06, x = px * iw, y = py * ih;
    const hv = h.hov || (h.hov = { key: null, since: 0, at: 0, out: 0 });
    let best = null, bd = 1e9, dc = 1e9, dcIn = false;
    for (const k in TG) {
      const q = TG[k];
      if (now - q.t > Math.max(HOV.fresh, slow())) {
        if (now - q.t > 3e3) delete TG[k];
        continue;
      }
      const r = q.f, rx = r.x * iw, ry = r.y * ih, rw = r.w * iw, rh = r.h * ih;
      const ex = Math.max(rx - x, 0, x - rx - rw), ey = Math.max(ry - y, 0, y - ry - rh);
      const d = Math.hypot(ex, ey) + 1e-3 * Math.hypot(x - rx - rw / 2, y - ry - rh / 2);
      const reach2 = m + (k === hv.key ? mn * HOV.stick : 0), inR = ex <= reach2 && ey <= reach2;
      if (k === hv.key) {
        dc = d;
        dcIn = inR;
      }
      if (inR && d < bd) {
        bd = d;
        best = k;
      }
    }
    let win = best;
    if (hv.key && dc < 1e9) {
      if (dcIn) {
        hv.out = 0;
        if (dc - bd < mn * HOV.switchBy) win = hv.key;
      } else {
        if (!hv.out) hv.out = now;
        if (now - hv.out < Math.max(HOV.grace, slow()) && !(best && dc - bd >= mn * HOV.switchBy)) win = null;
      }
    }
    if (win && win !== hv.key) {
      hv.key = win;
      hv.since = now;
      hv.out = 0;
    } else if (!win && hv.key && (dc >= 1e9 || hv.out && now - hv.out >= Math.max(HOV.grace, slow()))) hv.key = null;
    if (win) hv.at = now;
    return win;
  }
  BP.hovered = null;
  BP.disarmAll = () => {
    for (const id in dwells) {
      const d = dwells[id];
      d.armed = false;
      d.hard = true;
      d.t = 0;
      d.fired = false;
    }
    for (const k in TG) delete TG[k];
    for (const s of ["left", "right"]) BP.hands[s].hov = null;
    BP.hovered = null;
  };
  const RING = { id: null, k: 0, t: 0, leave: false };
  BP.handsOver = (rect, W, H) => {
    BP._lastRect = { y: (rect.y + rect.h / 2) / H, x: (rect.x + rect.w / 2) / W };
    return sim || BP.ready && !BP.mouse ? ["left", "right"].filter((s) => handIn(BP.hands[s], rect, W, H)).length : 0;
  };
  BP.handOver = (rect, W, H) => BP.handsOver(rect, W, H) > 0;
  BP.LEAVE_MS = 1400;
  BP.layout = {
    gap(W, H) {
      const mn = Math.min(W, H);
      return Math.max(0.08 * W, 0.13 * mn);
    },
    row(n, W, H, o = {}) {
      var _a;
      const mn = Math.min(W, H), gap = this.gap(W, H), h = o.h || Math.max(0.16 * mn, 0.12 * mn);
      const w = Math.min(o.w || 0.42 * mn, (0.9 * W - (n - 1) * gap) / n), cy = (_a = o.cy) != null ? _a : 0.62 * H, x0 = W / 2 - (n * w + (n - 1) * gap) / 2;
      return Array.from({ length: n }, (_, i) => ({ x: x0 + i * (w + gap), y: cy - h / 2, w, h }));
    },
    end(W, H, o = {}) {
      var _a;
      const mn = Math.min(W, H), cy = (_a = o.cy) != null ? _a : 0.66 * H;
      const aw = Math.min(0.44 * W, 0.5 * mn), ah = 0.16 * mn, again = { x: W / 2 - aw * 0.4, y: cy - ah / 2, w: aw, h: ah };
      if (o.side && W > H * 1.05) again.x = Math.min(W * 0.96 - aw, W * 0.74 - aw / 2);
      const hw = Math.min(0.26 * W, 0.3 * mn), hh = 0.11 * mn, home = {
        x: Math.max(0.05 * W, 0.03 * mn),
        w: hw,
        h: hh,
        y: W > H ? Math.min(0.9 * H - hh, Math.max(cy + ah / 2 - hh, 0.72 * H)) : Math.min(0.92 * H - hh, cy + ah / 2 + 0.13 * mn)
      };
      return { again, home };
    }
  };
  BP.pick = function(o) {
    if (typeof document === "undefined") return;
    BP.pickClose && BP.pickClose();
    if (!document.getElementById("bp-pick-css")) {
      const st = document.createElement("style");
      st.id = "bp-pick-css";
      st.textContent = "body.bp-picking .bph-wrap,body.bp-picking .bph-tip{visibility:hidden}#bp-pick{position:fixed;top:0;right:0;bottom:0;left:0;z-index:2147481000;background:radial-gradient(ellipse at 50% 45%,#141032,#05040b);color:#fff;font-family:-apple-system,system-ui,sans-serif}#bp-pick .t{position:absolute;left:0;right:0;top:18%;text-align:center;font:900 max(26px,6.5vmin)/1.1 -apple-system,system-ui,sans-serif;letter-spacing:.04em;text-shadow:0 0 3vmin #000}#bp-pick .s{position:absolute;left:0;right:0;top:calc(18% + max(34px,8vmin));text-align:center;font:700 max(15px,2.6vmin) -apple-system,system-ui,sans-serif;opacity:.75}#bp-pick button{position:absolute;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1vmin;border-radius:3vmin;border:2px solid #ffffff40;background:#ffffff14;color:#fff;cursor:pointer;font:900 max(20px,4.6vmin)/1.05 -apple-system,system-ui,sans-serif;letter-spacing:.04em;padding:1vmin;box-shadow:0 1.2vmin 3vmin #0008;transition:transform .15s,border-color .15s,background .15s}#bp-pick button small{font:700 max(13px,2.2vmin)/1.2 -apple-system,system-ui,sans-serif;opacity:.8;letter-spacing:.02em}#bp-pick button.sel{background:linear-gradient(135deg,#ff7ad9cc,#66e0ffcc);border-color:#fff}#bp-pick button.over{transform:scale(1.04);border-color:#fff}#bp-pick .k{position:absolute;left:0;right:0;bottom:7%;text-align:center;font:700 max(14px,2.3vmin) -apple-system,system-ui,sans-serif;opacity:.7}";
      document.head.appendChild(st);
    }
    const ov = document.createElement("div");
    ov.id = "bp-pick";
    const opts = o.options.slice(0, 3);
    let sel = Math.max(0, opts.findIndex((x) => x.id === o.value));
    ov.innerHTML = '<div class="t"></div><div class="s"></div><div class="k">Hold a hand on one · or click</div>';
    ov.querySelector(".t").textContent = o.title || "Choose";
    ov.querySelector(".s").textContent = o.sub || "The lit one is picked now";
    const btns = opts.map((x, i) => {
      const b = document.createElement("button");
      b.innerHTML = "<span></span>" + (x.sub ? "<small></small>" : "");
      b.firstChild.textContent = x.label;
      if (x.sub) b.lastChild.textContent = x.sub;
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        done(i);
      });
      ov.appendChild(b);
      return b;
    });
    for (const t of ["pointerdown", "pointerup", "mousedown", "mouseup", "click", "touchstart", "touchend"]) ov.addEventListener(t, (e) => e.stopPropagation());
    const lay = () => {
      const W = innerWidth, H = innerHeight, R = BP.layout.row(opts.length, W, H, { cy: 0.56 * H, h: Math.max(0.28 * Math.min(W, H), 90), w: 0.5 * Math.min(W, H) });
      btns.forEach((b, i) => Object.assign(b.style, { left: R[i].x + "px", top: R[i].y + "px", width: R[i].w + "px", height: R[i].h + "px" }));
    };
    const mark = () => btns.forEach((b, i) => b.classList.toggle("sel", i === sel));
    lay();
    mark();
    addEventListener("resize", lay);
    const key = (e) => {
      var _a;
      e.stopImmediatePropagation();
      (_a = e.preventDefault) == null ? void 0 : _a.call(e);
      if (e.key === "ArrowLeft") {
        sel = (sel + opts.length - 1) % opts.length;
        mark();
      } else if (e.key === "ArrowRight") {
        sel = (sel + 1) % opts.length;
        mark();
      } else if (e.key === "Enter" || e.key === " ") done(sel);
      else if (/^[1-9]$/.test(e.key) && +e.key <= opts.length) done(+e.key - 1);
      else if (e.key === "Escape") cancel();
    };
    addEventListener("keydown", key, true);
    document.body.appendChild(ov);
    BP._modal = "pick";
    const t0 = performance.now();
    let live = true;
    BP.disarmAll();
    for (const x of opts) dwells["pick:" + x.id] = { t: 0, fired: false, armed: false, hard: true };
    function close() {
      if (!live) return;
      live = false;
      ov.remove();
      document.body.classList.remove("bp-picking");
      removeEventListener("keydown", key, true);
      removeEventListener("resize", lay);
      BP._modal = null;
      BP.pickClose = null;
      BP.disarmAll();
    }
    function done(i) {
      close();
      o.onPick && o.onPick(opts[i].id);
    }
    function cancel() {
      close();
      o.onCancel ? o.onCancel() : o.onPick && o.onPick(opts[sel].id);
    }
    BP.pickClose = close;
    document.body.classList.add("bp-picking");
    (function loop(now) {
      if (!live) return;
      RAF0(loop);
      if (BP.paused) return;
      BP._modalOwn = true;
      try {
        btns.forEach((b, i) => {
          const r = b.getBoundingClientRect(), over = now - t0 > 500 && BP.handOver({ x: r.left, y: r.top, w: r.width, h: r.height }, innerWidth, innerHeight);
          const k = BP.dwell("pick:" + opts[i].id, over, now, 900);
          b.classList.toggle("over", !!over);
          if (k === 1 && live) done(i);
        });
      } finally {
        BP._modalOwn = false;
      }
    })(performance.now());
    return close;
  };
  const COL = { left: "#ffb3e8", right: "#a8eeff" };
  const hexA = (hex, a) => {
    const n = parseInt(hex.slice(1), 16);
    return "rgba(".concat(n >> 16, ",").concat(n >> 8 & 255, ",").concat(n & 255, ",").concat(Math.max(0, Math.min(1, a)), ")");
  };
  function capsule(x0, y0, x1, y1, r) {
    const p = new Path2D(), a = Math.atan2(y1 - y0, x1 - x0);
    p.arc(x1, y1, r, a - Math.PI / 2, a + Math.PI / 2);
    p.arc(x0, y0, r, a + Math.PI / 2, a + Math.PI * 1.5);
    p.closePath();
    return p;
  }
  BP.drawHands = function(ctx, W, H, size = 1) {
    if (!BP.mouse) return;
    const sz = Math.min(W, H) * 0.075 * size;
    for (const side of ["left", "right"]) {
      const h = BP.hands[side];
      if (!h.seen) continue;
      const x = h.x * W, y = h.y * H, col = COL[side];
      ctx.save();
      h.trail = h.trail || [];
      if (h.speed > 0.6) h.trail.push({ x, y, a: 1, r: (1 + Math.random() * 2) * sz / 60, dx: (Math.random() - 0.5) * sz / 30, dy: (Math.random() - 0.5) * sz / 30 });
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = h.trail.length - 1; i >= 0; i--) {
        const p = h.trail[i];
        p.a *= 0.93;
        p.x += p.dx;
        p.y += p.dy;
        if (p.a < 0.03) {
          h.trail.splice(i, 1);
          continue;
        }
        ctx.fillStyle = hexA(col, p.a * 0.8);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fill();
      }
      const halo = ctx.createRadialGradient(x, y, 0, x, y, sz * 2.4);
      halo.addColorStop(0, hexA(col, 0.28));
      halo.addColorStop(1, hexA(col, 0));
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(x, y, sz * 2.4, 0, 6.283);
      ctx.fill();
      ctx.translate(x, y);
      if (side === "left") ctx.scale(-1, 1);
      const shape = new Path2D();
      shape.roundRect(-sz * 0.42, -sz * 0.35, sz * 0.84, sz * 0.78, sz * 0.22);
      const tips = [];
      for (const [fx, len, tilt] of [[-0.3, 0.58, -0.1], [-0.1, 0.66, -0.03], [0.1, 0.62, 0.03], [0.29, 0.48, 0.11]]) {
        const bx = fx * sz, by = -sz * 0.3, L = len * sz, ex = bx + Math.sin(tilt) * L, ey = by - Math.cos(tilt) * L;
        shape.addPath(capsule(bx, by, ex, ey, sz * 0.085));
        tips.push([ex, ey]);
      }
      shape.addPath(capsule(-sz * 0.4, sz * 0.12, -sz * 0.78, -sz * 0.28, sz * 0.095));
      tips.push([-sz * 0.78, -sz * 0.28]);
      const g = ctx.createLinearGradient(0, sz * 0.5, 0, -sz);
      g.addColorStop(0, hexA(col, 0.18));
      g.addColorStop(1, hexA(col, 0.5));
      ctx.fillStyle = g;
      ctx.fill(shape);
      ctx.strokeStyle = hexA(col, 0.9);
      ctx.lineWidth = Math.max(1.5, sz / 35);
      ctx.stroke(shape);
      for (const [ex, ey] of tips) {
        const tg = ctx.createRadialGradient(ex, ey, 0, ex, ey, sz * 0.22);
        tg.addColorStop(0, "rgba(255,255,255,0.9)");
        tg.addColorStop(0.35, hexA(col, 0.7));
        tg.addColorStop(1, hexA(col, 0));
        ctx.fillStyle = tg;
        ctx.beginPath();
        ctx.arc(ex, ey, sz * 0.22, 0, 6.283);
        ctx.fill();
      }
      ctx.restore();
      ctx.restore();
    }
  };
  BP.handColor = COL;
  let ptrCv = null;
  const ovDpr = () => {
    const d = Math.min(2, devicePixelRatio || 1);
    return window.BP_TV ? Math.min(d, Math.sqrt(960 * 540 / Math.max(1, innerWidth * innerHeight))) : d;
  };
  const DRAWS = ["fill", "stroke", "fillRect", "strokeRect", "fillText", "strokeText", "drawImage", "putImageData"];
  const trackDraws = (ctx) => {
    if (ctx.__trk) return ctx;
    ctx.__trk = true;
    ctx.__drew = true;
    for (const m of DRAWS) {
      const f = ctx[m];
      ctx[m] = function() {
        ctx.__drew = true;
        return f.apply(this, arguments);
      };
    }
    return ctx;
  };
  const clearIfDrawn = (ctx, W, H) => {
    if (ctx.__drew) {
      ctx.clearRect(0, 0, W, H);
      ctx.__drew = false;
    }
  };
  const menuMode = () => BP._mode !== "play";
  const ptrShown = (side, now) => {
    const h = BP.hands[side];
    return !!(BP.live && !BP.mouse && h.seen && h.raised !== false && h.px !== void 0 && !(h._gpAt && now - h._gpAt < 300) && (menuMode() || h.magnet && now - h.magnet.t < 300 || BP.hovered && BP.hovered.side === side && now - BP.hovered.t < 300));
  };
  BP.ptrShown = ptrShown;
  function drawPointer(now) {
    RAF0(drawPointer);
    if (!document.body) return;
    if (!ptrCv) {
      ptrCv = document.createElement("canvas");
      ptrCv.id = "bp-pointer";
      ptrCv.style.cssText = "position:fixed;top:0;right:0;bottom:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2147483000";
      document.body.appendChild(ptrCv);
    }
    const dpr = ovDpr(), W = Math.round(innerWidth * dpr), H = Math.round(innerHeight * dpr);
    if (ptrCv.width !== W || ptrCv.height !== H) {
      ptrCv.width = W;
      ptrCv.height = H;
    }
    const ctx = trackDraws(ptrCv.getContext("2d"));
    clearIfDrawn(ctx, W, H);
    if (BP.live && !BP.mouse) for (const side of ["left", "right"]) {
      const mg = BP.hands[side].magnet;
      if (!mg || now - mg.t > 150) continue;
      const r = mg.r, pad = 7 * dpr, rr = Math.min(r.h * dpr / 2 + pad, 32 * dpr);
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(r.x * dpr - pad, r.y * dpr - pad, r.w * dpr + 2 * pad, r.h * dpr + 2 * pad, rr);
      ctx.fillStyle = hexA(COL[side], 0.22);
      ctx.fill();
      ctx.strokeStyle = hexA(COL[side], 0.95);
      ctx.lineWidth = 3.5 * dpr;
      ctx.shadowColor = COL[side];
      ctx.shadowBlur = 16 * dpr;
      ctx.stroke();
      ctx.restore();
    }
    const hv = BP.hovered;
    if (BP.live && !BP.mouse && hv && now - hv.t < Math.max(150, slow())) {
      const iw = innerWidth, ih = innerHeight, f = hv.f, x = f.x * iw * dpr, y = f.y * ih * dpr, w = f.w * iw * dpr, h = f.h * ih * dpr;
      if (w > 0 && h > 0 && w < W * 1.2 && h < H * 1.2) {
        const pad = Math.max(6, Math.min(W, H) * 8e-3), rr = Math.min(h / 2 + pad, 26 * dpr, w / 2 + pad), lw = Math.max(4, Math.min(W, H) * 7e-3);
        const k = RING.t && now - RING.t < Math.max(150, slow()) ? Math.max(0, Math.min(1, RING.k)) : 0, col = RING.leave ? "#ffc23c" : "#7ff3ff";
        const X = x - pad, Y = y - pad, RW = w + 2 * pad, RH = h + 2 * pad;
        const path = new Path2D();
        path.moveTo(X + RW / 2, Y);
        path.lineTo(X + RW - rr, Y);
        path.arcTo(X + RW, Y, X + RW, Y + rr, rr);
        path.lineTo(X + RW, Y + RH - rr);
        path.arcTo(X + RW, Y + RH, X + RW - rr, Y + RH, rr);
        path.lineTo(X + rr, Y + RH);
        path.arcTo(X, Y + RH, X, Y + RH - rr, rr);
        path.lineTo(X, Y + rr);
        path.arcTo(X, Y, X + rr, Y, rr);
        path.closePath();
        const per = 2 * (RW + RH - 4 * rr) + 2 * Math.PI * rr;
        ctx.save();
        ctx.strokeStyle = "rgba(255,255,255,0.45)";
        ctx.lineWidth = lw * 0.6;
        ctx.shadowColor = col;
        ctx.shadowBlur = 12 * dpr;
        ctx.stroke(path);
        if (k > 0.01) {
          ctx.setLineDash([per * k, per + 10]);
          ctx.lineCap = "round";
          ctx.strokeStyle = col;
          ctx.lineWidth = lw;
          ctx.shadowBlur = 18 * dpr;
          ctx.stroke(path);
        }
        ctx.restore();
      }
    }
    if (!BP.live || BP.mouse) return;
    if (BP._mode === "play" && !BP.paused) {
      const pe = document.getElementById("bp-pause"), pr = pe && pe.getBoundingClientRect();
      if (pr && pr.width > 0) {
        const iw = innerWidth || 1, ih = innerHeight || 1, mn = Math.min(iw, ih), zx = pr.right + mn * 0.22, zy = pr.bottom + mn * 0.26;
        for (const side of ["left", "right"]) {
          const h = BP.hands[side];
          if (ptrShown(side, now) || h.magnet && now - h.magnet.t < 300) continue;
          let p = null;
          if (typeof BP.pointerFor === "function") {
            try {
              p = BP.pointerFor(side);
            } catch (_) {
            }
          }
          if (p && Number.isFinite(p.x) && Number.isFinite(p.y)) p = { x: p.x * iw, y: p.y * ih };
          else if (h.seen && h.raised !== false && h.px !== void 0) p = { x: h.px * iw, y: h.py * ih };
          else continue;
          if (p.x > zx || p.y > zy) continue;
          const dx = Math.max(pr.left - p.x, 0, p.x - pr.right), dy = Math.max(pr.top - p.y, 0, p.y - pr.bottom);
          const k = Math.max(0, 1 - Math.hypot(dx / (zx - pr.right), dy / (zy - pr.bottom)));
          if (k < 0.03) continue;
          const x = p.x / iw * W, y = p.y / ih * H, r = Math.min(W, H) * 0.028, col = COL[side];
          ctx.save();
          ctx.globalAlpha = 0.85 * k;
          ctx.strokeStyle = hexA(col, 0.9);
          ctx.lineWidth = Math.max(2, r / 6);
          ctx.shadowColor = col;
          ctx.shadowBlur = 10 * dpr;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, 6.283);
          ctx.stroke();
          ctx.restore();
          (BP._approach || (BP._approach = {}))[side] = { k, at: now, x: p.x / iw, y: p.y / ih };
        }
      }
    }
    for (const side of ["left", "right"]) {
      const h = BP.hands[side];
      if (!ptrShown(side, now)) continue;
      const x = h.px * W, y = h.py * H, r = Math.min(W, H) * 0.035, col = COL[side];
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2);
      g.addColorStop(0, hexA(col, 0.35));
      g.addColorStop(1, hexA(col, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r * 2, 0, 6.283);
      ctx.fill();
      ctx.strokeStyle = hexA(col, 0.95);
      ctx.lineWidth = Math.max(2, r / 6);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 6.283);
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(x, y, r * 0.22, 0, 6.283);
      ctx.fill();
      ctx.restore();
    }
  }
  if (typeof document !== "undefined") RAF0(drawPointer);
  const Q2 = {
    add: (a, b) => [a[0] + b[0], a[1] + b[1]],
    sub: (a, b) => [a[0] - b[0], a[1] - b[1]],
    mul: (a, k) => [a[0] * k, a[1] * k],
    len: (a) => Math.hypot(a[0], a[1]),
    mid: (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2],
    lerp: (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k],
    nrm: (a, fb = [0, 1]) => {
      const l = Math.hypot(a[0], a[1]);
      return l > 1e-6 ? [a[0] / l, a[1] / l] : fb;
    },
    perp: (a) => [-a[1], a[0]],
    dot: (a, b) => a[0] * b[0] + a[1] * b[1],
    cross: (a, b) => a[0] * b[1] - a[1] * b[0],
    rot: (a, t) => [a[0] * Math.cos(t) - a[1] * Math.sin(t), a[0] * Math.sin(t) + a[1] * Math.cos(t)],
    at: (o, f, n, x, y) => [o[0] + f[0] * x + n[0] * y, o[1] + f[1] * x + n[1] * y]
    // point in a local frame
  };
  const clampDir = (d, ref, max) => {
    const a = Math.atan2(Q2.cross(ref, d), Q2.dot(ref, d));
    return Q2.rot(ref, Math.max(-max, Math.min(max, a)));
  };
  const clampN = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  function smoothClosed(pts) {
    const p = new Path2D(), n = pts.length;
    p.moveTo(pts[0][0], pts[0][1]);
    for (let i = 0; i < n; i++) {
      const a = pts[(i - 1 + n) % n], b = pts[i], c = pts[(i + 1) % n], d = pts[(i + 2) % n];
      p.bezierCurveTo(b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6, c[0] - (d[0] - b[0]) / 6, c[1] - (d[1] - b[1]) / 6, c[0], c[1]);
    }
    p.closePath();
    return p;
  }
  function limbShape(A, B, prof) {
    const f = Q2.nrm(Q2.sub(B, A)), n = Q2.perp(f), L = Q2.len(Q2.sub(B, A)), pts = [];
    for (const [k, wp] of prof) pts.push(Q2.at(A, f, n, L * k, wp));
    const e = prof[prof.length - 1], s = prof[0];
    pts.push(Q2.at(A, f, n, L * e[0] + (e[1] + e[2]) * 0.42, (e[1] - e[2]) / 2));
    for (let i = prof.length - 1; i >= 0; i--) pts.push(Q2.at(A, f, n, L * prof[i][0], -prof[i][2]));
    pts.push(Q2.at(A, f, n, L * s[0] - (s[1] + s[2]) * 0.42, (s[1] - s[2]) / 2));
    return smoothClosed(pts);
  }
  function ik(S, T, L1, L2, bend) {
    let d = Q2.sub(T, S), D = Q2.len(d);
    const u = Q2.nrm(d, [0, 1]);
    if (D > (L1 + L2) * 0.999) {
      const k = D / (L1 + L2);
      L1 *= k;
      L2 *= k;
      D = (L1 + L2) * 0.999;
    }
    D = Math.max(D, Math.abs(L1 - L2) + 1e-3);
    const a = (L1 * L1 - L2 * L2 + D * D) / (2 * D), h = Math.sqrt(Math.max(0, L1 * L1 - a * a)), n = Q2.perp(u);
    return { E: [S[0] + u[0] * a + n[0] * h * bend, S[1] + u[1] * a + n[1] * h * bend], L1, L2 };
  }
  const bendOf = (S, T, E, fb) => {
    const c = Q2.cross(Q2.sub(T, S), Q2.sub(E, S));
    return Math.abs(c) > 1e-3 * Q2.len(Q2.sub(T, S)) * Q2.len(Q2.sub(E, S)) + 1e-9 ? Math.sign(c) : fb;
  };
  const PR = { up: 0.6, fore: 0.52, hand: 0.36, thigh: 0.95, shin: 0.88, head: 0.52, headW: 0.41, chin: 0.2 };
  const FIGS = { T: null, k: 1, prev: {}, at: 0 };
  const pulse = (h) => {
    if (!h || !h.t) return 0;
    const d = performance.now() - h.t;
    return d < 0 || d > 420 ? 0 : d < 90 ? d / 90 : d < 170 ? 1 : 1 - (d - 170) / 250;
  };
  function figPose(R, o, W, H, reachK) {
    const nS0 = Q2.mid(R.lShoulder, R.rShoulder), hM0 = Q2.mid(R.lHip, R.rHip), T0 = Math.max(4, Q2.len(Q2.sub(nS0, hM0)));
    if (!FIGS.T || performance.now() - FIGS.at > 600) FIGS.T = T0;
    FIGS.T += (clampN(T0, FIGS.T * 0.7, FIGS.T * 1.4) - FIGS.T) * 0.05;
    FIGS.at = performance.now();
    const T = FIGS.T, k = reachK || 1, t = T * k;
    const u = clampDir(Q2.nrm(Q2.sub(nS0, hM0), [0, -1]), [0, -1], 0.36);
    let s0 = Q2.perp(u);
    if (Q2.dot(s0, Q2.sub(R.lShoulder, R.rShoulder)) < 0) s0 = Q2.mul(s0, -1);
    const B = { t, T, u, s0 };
    B.n = nS0;
    const tl = clampN(T0, 0.78 * T, 1.15 * T) * k;
    B.hM = Q2.sub(B.n, Q2.mul(u, tl));
    const sd = clampDir(Q2.nrm(Q2.sub(R.lShoulder, R.rShoulder), s0), s0, 0.3);
    const ws = clampN(Q2.len(Q2.sub(R.lShoulder, R.rShoulder)), (o.minShoulder || 0.62) * T, 0.8 * T) * k;
    B.sd = sd;
    B.lS = Q2.add(B.n, Q2.mul(sd, ws / 2));
    B.rS = Q2.sub(B.n, Q2.mul(sd, ws / 2));
    const hd = clampDir(Q2.nrm(Q2.sub(R.lHip, R.rHip), s0), s0, 0.35);
    const wh = clampN(Q2.len(Q2.sub(R.lHip, R.rHip)), 0.42 * T, 0.58 * T) * k;
    B.hd = hd;
    B.lH = Q2.add(B.hM, Q2.mul(hd, wh / 2));
    B.rH = Q2.sub(B.hM, Q2.mul(hd, wh / 2));
    const hu = R.head ? clampDir(Q2.nrm(Q2.sub(R.head, B.n), u), u, 0.3) : u;
    B.hu = hu;
    B.head = Q2.add(B.n, Q2.mul(hu, (PR.chin + PR.head / 2) * t));
    for (const sd2 of ["l", "r"]) {
      const S = B[sd2 + "S"], rs = R[sd2 + "Shoulder"], re = R[sd2 + "Forearm"], rw = R[sd2 + "Hand"];
      const L1 = PR.up * t, L2 = PR.fore * t;
      if (o.reachTo && o.reachTo[sd2]) {
        const tg = o.reachTo[sd2], L2h = L2 + PR.hand * 0.45 * t;
        const fb = Q2.dot(Q2.sub(tg, S), sd2 === "l" ? s0 : Q2.mul(s0, -1)) >= 0 ? 1 : -1;
        const bend0 = re ? bendOf(S, tg, Q2.add(S, Q2.sub(re, rs)), 0) : 0;
        const r = ik(S, tg, L1, L2h, bend0 || (Q2.cross(Q2.sub(tg, S), [0, 1]) > 0 ? 1 : -1) * (fb ? 1 : 1));
        B[sd2 + "E"] = r.E;
        const fd = Q2.nrm(Q2.sub(tg, r.E));
        B[sd2 + "W"] = Q2.add(r.E, Q2.mul(fd, r.L2 * L2 / L2h));
        B[sd2 + "P"] = tg;
        continue;
      }
      if (!re || !rw) {
        B[sd2 + "E"] = Q2.add(S, Q2.mul(Q2.sub([0, 0], u), L1));
        B[sd2 + "W"] = Q2.add(B[sd2 + "E"], Q2.mul(Q2.sub([0, 0], u), L2));
      } else {
        const a = Q2.sub(re, rs), b = Q2.sub(rw, re);
        B[sd2 + "E"] = Q2.add(S, Q2.mul(Q2.nrm(a, Q2.mul(u, -1)), Math.min(Q2.len(a), L1)));
        B[sd2 + "W"] = Q2.add(B[sd2 + "E"], Q2.mul(Q2.nrm(b, Q2.mul(u, -1)), Math.min(Q2.len(b), L2)));
      }
      B[sd2 + "P"] = Q2.add(B[sd2 + "W"], Q2.mul(Q2.nrm(Q2.sub(B[sd2 + "W"], B[sd2 + "E"]), Q2.mul(u, -1)), PR.hand * 0.45 * t));
    }
    B.legs = !!(R.lKnee && R.rKnee && R.lFoot && R.rFoot) && o.legs;
    for (const sd2 of ["l", "r"]) {
      const Hp = B[sd2 + "H"], rh = R[sd2 + "Hip"], rk = R[sd2 + "Knee"], ra = R[sd2 + "Foot"], down = Q2.mul(u, -1);
      if (!B.legs) {
        B[sd2 + "K"] = Q2.add(Hp, Q2.mul(down, PR.thigh * t));
        B[sd2 + "A"] = Q2.add(B[sd2 + "K"], Q2.mul(down, PR.shin * t));
        continue;
      }
      const a = Q2.sub(rk, rh), b = Q2.sub(ra, rk);
      B[sd2 + "K"] = Q2.add(Hp, Q2.mul(Q2.nrm(a, down), Math.min(Q2.len(a), PR.thigh * t)));
      B[sd2 + "A"] = Q2.add(B[sd2 + "K"], Q2.mul(Q2.nrm(b, down), Math.min(Q2.len(b), PR.shin * t)));
    }
    if (o.stance === "guard") guardStance(B, R, o, W, H);
    return B;
  }
  function guardStance(B, R, o, W, H) {
    if (o.upright) B.u = [0, -1];
    const t = B.t, u = B.u, down = Q2.mul(u, -1), lead = o.lead === "r" ? "r" : "l", rear = lead === "l" ? "r" : "l";
    if (o.upright) {
      const sx = B.s0[0] >= 0 ? 1 : -1;
      B.u = [0, -1];
      B.sd = B.hd = B.s0 = [sx, 0];
      B.hu = [0, -1];
      const ws = 0.72 * t, wh = 0.5 * t;
      B.hM = [B.n[0], B.n[1] + t];
      B.lS = [B.n[0] + sx * ws / 2, B.n[1]];
      B.rS = [B.n[0] - sx * ws / 2, B.n[1]];
      B.lH = [B.hM[0] + sx * wh / 2, B.hM[1]];
      B.rH = [B.hM[0] - sx * wh / 2, B.hM[1]];
      B.head = [B.n[0], B.n[1] - (PR.chin + PR.head / 2) * t];
    }
    const sideOf = (s) => s === "l" ? B.sd : Q2.mul(B.sd, -1);
    const drop = 0.09 * t, sh = Q2.mul(down, drop);
    for (const k of ["n", "hM", "lS", "rS", "lH", "rH", "head"]) B[k] = Q2.add(B[k], sh);
    if (!o.upright) {
      for (const [a, b, c, f] of [["lS", "rS", "n", 0.8], ["lH", "rH", "hM", 0.82]]) {
        B[a] = Q2.lerp(B[c], B[a], f);
        B[b] = Q2.lerp(B[c], B[b], f);
      }
      B[lead + "S"] = Q2.add(B[lead + "S"], Q2.mul(u, 0.035 * t));
      B.head = Q2.add(B.head, Q2.add(Q2.mul(down, 0.05 * t), Q2.mul(sideOf(rear), 0.03 * t)));
    } else B.head = Q2.add(B.head, Q2.mul(down, 0.04 * t));
    const hits = o.hits || {}, hipY = B.hM;
    const chin = Q2.add(B.head, Q2.mul(B.hu, -PR.head / 2 * t));
    for (const s of ["l", "r"]) {
      const S = B[s + "S"], arm = (PR.up + PR.fore + PR.hand * 0.45) * t;
      const guard = s === lead ? Q2.add(B.head, Q2.add(Q2.mul(sideOf(s), 0.2 * t), Q2.mul(u, -0.03 * t))) : Q2.add(chin, Q2.add(Q2.mul(sideOf(s), 0.19 * t), Q2.mul(u, 0.05 * t)));
      const real = B[s + "P"], dReal = Q2.len(Q2.sub(real, S)) / arm;
      const above = Q2.dot(Q2.sub(real, hipY), u) > 0.35 * t;
      const wExt = above ? clampN((dReal - 0.72) / 0.22, 0, 1) : 0;
      const hp = hits[s + "Hand"], wHit = pulse(hp);
      let tg = guard, w = 0;
      if (wHit > 0 && wHit >= wExt) {
        let hpt = [hp.x * W, hp.y * H];
        const v = Q2.sub(hpt, S), l = Q2.len(v);
        if (l > arm * 1.02) hpt = Q2.add(S, Q2.mul(v, arm * 1.02 / l));
        tg = Q2.lerp(guard, hpt, wHit);
        w = wHit;
      } else if (wExt > 0) {
        tg = Q2.lerp(guard, real, wExt);
        w = wExt;
      }
      const fo = 0.42 + 0.58 * w, L1 = PR.up * t * fo, L2h = (PR.fore * (0.62 + 0.38 * w) + PR.hand * 0.45) * t;
      const c1 = ik(S, tg, L1, L2h, 1), c2 = ik(S, tg, L1, L2h, -1);
      const sc = (c) => Q2.dot(Q2.sub(c.E, S), down) + 0.35 * Q2.dot(Q2.sub(c.E, S), sideOf(s));
      const r = sc(c1) >= sc(c2) ? c1 : c2;
      B[s + "E"] = r.E;
      B[s + "W"] = Q2.add(r.E, Q2.mul(Q2.nrm(Q2.sub(tg, r.E)), r.L2 - PR.hand * 0.45 * t));
      B[s + "P"] = tg;
    }
    for (const s of ["l", "r"]) {
      const Hp = B[s + "H"], o2 = s === "l" ? "r" : "l", side = sideOf(s);
      const dx = (o.upright ? 0.36 : s === lead ? 0.3 : 0.38) * t, reach2 = (PR.thigh + PR.shin) * t * 0.93, dy = Math.sqrt(Math.max(0, reach2 * reach2 - dx * dx));
      const stanceFoot = [B[s + "H"][0] + side[0] * (dx - Q2.len(Q2.sub(B[s + "H"], B.hM))), B[s + "H"][1] + dy - (s === lead ? o.upright ? 0.025 : 0.06 : 0) * t];
      const rf = R[s + "Foot"], of = R[o2 + "Foot"];
      const lift = rf && of && o.kicks !== false ? (of[1] - rf[1]) / t : 0;
      const LL = o.legLift ? o.legLift[s] : null, wK = LL !== null && LL !== void 0 ? clampN(LL, 0, 1) : clampN((lift - 0.14) / 0.28, 0, 1);
      const hp = hits[s + "Foot"], wHit = pulse(hp);
      let tg = stanceFoot, realLeg = false;
      if (wHit > 0 && wHit >= wK) {
        tg = Q2.lerp(stanceFoot, [hp.x * W, hp.y * H], wHit * 0.85);
      } else if (wK > 0 && rf) {
        tg = Q2.lerp(stanceFoot, rf, wK);
        realLeg = wK > 0.5;
      }
      const wl = Math.max(wK, wHit), L1 = PR.thigh * t * (0.93 + 0.07 * wl), L2 = PR.shin * t * (0.95 + 0.05 * wl);
      const vv = Q2.sub(tg, Hp), nn = Q2.perp(Q2.nrm(vv, down));
      let bend = Q2.dot(nn, side) >= 0 ? 1 : -1;
      if (realLeg && R[s + "Knee"]) bend = bendOf(Hp, tg, Q2.add(Hp, Q2.sub(R[s + "Knee"], R[s + "Hip"])), bend);
      const r = ik(Hp, tg, L1, L2, bend);
      B[s + "K"] = r.E;
      B[s + "A"] = Q2.add(r.E, Q2.mul(Q2.nrm(Q2.sub(tg, r.E)), r.L2));
    }
    B.legs = true;
    B.guard = true;
  }
  function figShapes(B, o) {
    const t = B.t, u = B.u, out = [], lim = 1 + ((o.limb || 1) - 1) * 0.35;
    const W_ = (x) => x * t * lim;
    const pts = [], hu = B.hu;
    const side = (s, f) => s === "l" ? Q2.mul(B.sd, f) : Q2.mul(B.sd, -f), hside = (s, f) => s === "l" ? Q2.mul(B.hd, f) : Q2.mul(B.hd, -f);
    const chin = Q2.add(B.n, Q2.mul(hu, PR.chin * t));
    const P = (o2, ...vs) => vs.reduce((a, b) => Q2.add(a, b), o2);
    const ring = (s) => {
      const S = B[s + "S"], Hp = B[s + "H"];
      return [
        P(chin, Q2.mul(hu, 0.07 * t), side(s, 0.085 * t)),
        // neck, up inside the jaw
        P(B.n, side(s, 0.1 * t), Q2.mul(u, 0.12 * t)),
        // side of the neck
        P(B.n, side(s, 0.16 * t), Q2.mul(u, 0.07 * t)),
        // neck meets the trapezius
        P(B.n, Q2.lerp([0, 0], Q2.sub(S, B.n), 0.7), Q2.mul(u, 0.035 * t)),
        // trapezius slope
        P(S, side(s, 0.08 * t), Q2.mul(u, 0 * t)),
        // round of the shoulder
        P(S, side(s, 0.115 * t), Q2.mul(u, -0.07 * t)),
        // deltoid
        P(S, side(s, 0.05 * t), Q2.mul(u, -0.28 * t)),
        // under the arm
        Q2.lerp(P(S, side(s, 0.045 * t)), P(Hp, hside(s, 0.1 * t)), 0.5),
        // lats / ribs: a straight, gently tapering side
        Q2.lerp(P(S, side(s, 0.04 * t)), P(Hp, hside(s, 0.1 * t)), 0.8),
        // waist
        P(Hp, hside(s, 0.105 * t), Q2.mul(u, 0.02 * t)),
        // hip
        P(Hp, hside(s, 0.1 * t), Q2.mul(u, -0.17 * t))
        // top of the thigh
      ];
    };
    const L = ring("l"), R = ring("r");
    pts.push(...L, P(B.hM, Q2.mul(u, -0.2 * t)), ...R.reverse());
    out.push(smoothClosed(pts));
    {
      const c = B.head, f = hu, n = Q2.perp(hu), a = PR.headW / 2 * t, b = PR.head / 2 * t;
      const hp = [[0, 1], [0.7, 0.74], [0.98, 0.18], [0.92, -0.28], [0.66, -0.72], [0.28, -0.97], [0, -1], [-0.28, -0.97], [-0.66, -0.72], [-0.92, -0.28], [-0.98, 0.18], [-0.7, 0.74]];
      out.push(smoothClosed(hp.map(([x, y]) => Q2.at(c, f, n, y * b, x * a))));
    }
    for (const s of ["l", "r"]) {
      out.push(limbShape(Q2.lerp(B[s + "S"], B[s + "E"], 0.1), B[s + "E"], [[0, W_(0.11), W_(0.11)], [0.14, W_(0.118), W_(0.11)], [0.5, W_(0.105), W_(0.1)], [1, W_(0.075), W_(0.075)]]));
      out.push(limbShape(B[s + "E"], B[s + "W"], [[0, W_(0.078), W_(0.078)], [0.25, W_(0.092), W_(0.085)], [0.62, W_(0.07), W_(0.066)], [1, W_(0.052), W_(0.052)]]));
    }
    for (const s of ["l", "r"]) {
      const fade = !B.legs;
      out.push(limbShape(B[s + "H"], B[s + "K"], [[0, W_(0.18), W_(0.18)], [0.22, W_(0.175), W_(0.165)], [0.7, W_(0.128), W_(0.118)], [1, W_(0.095), W_(0.095)]]));
      if (fade) continue;
      out.push(limbShape(B[s + "K"], B[s + "A"], [[0, W_(0.095), W_(0.095)], [0.28, W_(0.11), W_(0.1)], [0.7, W_(0.07), W_(0.068)], [1, W_(0.052), W_(0.052)]]));
      const dn = Q2.nrm(Q2.sub(B[s + "A"], B[s + "K"]), [0, 1]), side2 = Q2.dot(Q2.perp(dn), side(s, 1)) >= 0 ? 1 : -1, n = Q2.mul(Q2.perp(dn), side2);
      const A = B[s + "A"], fp = [[-0.03, -0.055], [0.05, -0.075], [0.12, -0.07], [0.145, 0], [0.14, 0.1], [0.12, 0.155], [0.08, 0.165], [0.035, 0.11], [-0.03, 0.055]];
      out.push(smoothClosed(fp.map(([x, y]) => Q2.at(A, dn, n, x * t * lim, y * t * lim))));
    }
    return out;
  }
  function handShape(B, s, glove) {
    const t = B.t, W0 = B[s + "W"], P0 = B[s + "P"], f = Q2.nrm(Q2.sub(P0, W0), Q2.mul(B.u, -1));
    const toMid = Q2.sub(B.n, W0), th = Q2.dot(Q2.perp(f), toMid) >= 0 ? 1 : -1, n = Q2.mul(Q2.perp(f), th);
    const pts = glove ? [[0, 0.075], [0.06, 0.1], [0.1, 0.14], [0.17, 0.155], [0.24, 0.135], [0.32, 0.095], [0.355, 0], [0.33, -0.09], [0.25, -0.135], [0.14, -0.13], [0.06, -0.1], [0, -0.075]] : [[0, 0.05], [0.07, 0.072], [0.13, 0.115], [0.19, 0.12], [0.175, 0.078], [0.2, 0.06], [0.28, 0.06], [0.345, 0.04], [0.37, 5e-3], [0.355, -0.035], [0.3, -0.065], [0.19, -0.075], [0.09, -0.068], [0, -0.05]];
    return smoothClosed(pts.map(([x, y]) => Q2.at(W0, f, n, x * t, y * t)));
  }
  let selfMk = null;
  const REALSELF = { inst: null, loading: false, failed: false, base: document.currentScript && document.currentScript.src || location.href };
  function realSelfReady() {
    if (REALSELF.inst) return true;
    if (REALSELF.loading || REALSELF.failed || !BP.realSelf || /[?&]body=fig\b/.test(location.search) || !document.querySelector("script[type=importmap]")) return false;
    REALSELF.loading = true;
    import(new URL("realself.js", REALSELF.base).href).then((m) => {
      REALSELF.inst = m.create(BP, { base: new URL("assets/people/", REALSELF.base).href });
      if (!REALSELF.inst) REALSELF.failed = true;
    }).catch((e) => {
      REALSELF.failed = true;
      console.warn("real body off:", e);
    }).finally(() => {
      REALSELF.loading = false;
    });
    return false;
  }
  BP.selfView = { x: 0.9, y: 0.965, h: 0.3 };
  let selfCv = null, selfA = 0, lastSelf = 0;
  const BONES = [
    ["lShoulder", "rShoulder", 1],
    ["lShoulder", "lForearm", 0.8],
    ["lForearm", "lHand", 0.7],
    ["rShoulder", "rForearm", 0.8],
    ["rForearm", "rHand", 0.7],
    ["lHip", "lKnee", 1.05],
    ["lKnee", "lFoot", 0.85],
    ["rHip", "rKnee", 1.05],
    ["rKnee", "rFoot", 0.85]
  ];
  let selfOkT = 0;
  function drawSelf(now) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    RAF0(drawSelf);
    const cfg = BP.selfView, J = BP.joints;
    if (!selfCv) {
      selfCv = document.createElement("canvas");
      selfCv.id = "bp-self";
      selfCv.style.cssText = "position:fixed;top:0;right:0;bottom:0;left:0;width:100%;height:100%;pointer-events:none;z-index:8";
      document.body.appendChild(selfCv);
    }
    const dpr = ovDpr(), W = Math.round(innerWidth * dpr), H = Math.round(innerHeight * dpr);
    if (selfCv.width !== W || selfCv.height !== H) {
      selfCv.width = W;
      selfCv.height = H;
    }
    const ctx = trackDraws(selfCv.getContext("2d")), dt = Math.min(0.1, (now - (lastSelf || now)) / 1e3);
    lastSelf = now;
    const vv = BP.vis || {}, clear = ((_a = vv.lShoulder) != null ? _a : 1) > 0.6 && ((_b = vv.rShoulder) != null ? _b : 1) > 0.6 && ((_d = (_c = vv.lHand) != null ? _c : vv.lWrist) != null ? _d : 1) > 0.5 && ((_f = (_e = vv.rHand) != null ? _e : vv.rWrist) != null ? _f : 1) > 0.5;
    selfOkT = BP.present !== false && clear ? (selfOkT || 0) + dt : 0;
    const overUI = BP.howTo && BP.howTo.visible || !!document.getElementById("bphs");
    const hipsSeen = ((_g = vv.lHip) != null ? _g : 1) > 0.6 && ((_h = vv.rHip) != null ? _h : 1) > 0.6;
    const menuFig = !cfg && isGamePage && menuMode() && BP.menuFigure === true;
    const show = (cfg || menuFig) && BP.live && !sim && J.root && J.lShoulder && J.rShoulder && selfOkT > 0.5 && hipsSeen && !(menuMode() && isGamePage && !(window.BP_PHONEUI && cfg && !document.getElementById("bphs")) && (overUI || BP.menuFigure !== true));
    selfA += ((show ? 1 : 0) - selfA) * Math.min(1, dt * 4);
    clearIfDrawn(ctx, W, H);
    const big = BP.handMode !== "box";
    if (REALSELF.inst && (selfA < 0.02 || !J.root || !J.lShoulder || !J.rShoulder)) {
      REALSELF.inst.hide();
      REALSELF.ok = false;
    }
    fig: {
      if (selfA < 0.02 || !J.root || !J.lShoulder || !J.rShoulder) break fig;
      const hasLegs = !!(J.lFoot && J.rFoot && J.lHip && J.rHip);
      const floorY = (standY != null ? standY : J.root[1]) - (hasLegs ? 0.92 : 0.95);
      const s = (cfg ? cfg.h : 0.3) * H / 1.85;
      const cx = (cfg ? cfg.x : 0.9) * W + Math.max(-0.5, Math.min(0.5, center ? dot(sub(J.root, center), right) : 0)) * s;
      const by = (cfg ? cfg.y : 0.965) * H;
      const P0 = big ? ((k) => {
        const m = mirrorPt(J, k, true);
        return m && [m[0] * W, m[1] * H];
      }) : ((k) => J[k] && [cx + dot(sub(J[k], J.root), right) * s, by - (J[k][1] - floorY) * s]);
      const R = {};
      for (const k of ["head", "lShoulder", "rShoulder", "lForearm", "rForearm", "lHand", "rHand", "lHip", "rHip", "lKnee", "rKnee", "lFoot", "rFoot"]) R[k] = P0(k);
      if (!R.lShoulder || !R.rShoulder) break fig;
      const rootP = P0("root") || Q2.add(Q2.mid(R.lShoulder, R.rShoulder), [0, H * 0.15]), uw = Q2.len(Q2.sub(R.lShoulder, R.rShoulder)) * 0.3 || H * 0.03;
      if (!R.lHip || !R.rHip) {
        R.lHip = [rootP[0] - uw, rootP[1]];
        R.rHip = [rootP[0] + uw, rootP[1]];
      }
      const VS = BP.vis || {}, seen = (k) => {
        var _a2;
        return ((_a2 = VS[k]) != null ? _a2 : 1) > 0.55;
      };
      const Tg = FIGS.T || Q2.len(Q2.sub(Q2.mid(R.lShoulder, R.rShoulder), Q2.mid(R.lHip, R.rHip)));
      for (const k in R) {
        const p = R[k], q = FIGS.prev[k];
        if (!p) continue;
        if (q && performance.now() - FIGS.at < 300 && Q2.len(Q2.sub(p, q)) > 0.45 * Tg) R[k] = Q2.lerp(q, p, 0.3);
        FIGS.prev[k] = R[k];
      }
      const o = { legs: figLegs(), limb: FG().limb, stance: FG().stance, lead: FG().lead, hits: FG().hits, upright: FG().upright, kicks: FG().kicks, legLift: FG().legLift, minShoulder: FG().stance ? 0.6 : 0.62 };
      if (big && (FG().drawReach !== false || menuMode())) {
        const reachTo = {}, armL = (PR.up + PR.fore + PR.hand * 0.45) * (FIGS.T || Tg);
        let need = 1, ex = [0, 0], nx = 0;
        for (const [sd2, side] of [["l", "left"], ["r", "right"]]) {
          const h = BP.hands[side];
          if (!h || !h.seen) continue;
          reachTo[sd2] = ptrShown(side, now) ? [h.px * W, h.py * H] : [h.x * W, h.y * H];
          const v2 = Q2.sub(reachTo[sd2], R[sd2 + "Shoulder"]), d = Q2.len(v2);
          ex = Q2.add(ex, Q2.mul(Q2.nrm(v2), Math.max(0, d - armL * 0.92)));
          nx++;
        }
        if (nx) ex = Q2.mul(ex, 1 / nx);
        const want2 = [clampN(ex[0], -0.9 * armL, 0.9 * armL), clampN(ex[1], -0.3 * armL, 0.3 * armL)];
        FIGS.sh = FIGS.sh ? Q2.lerp(FIGS.sh, want2, 0.18) : want2;
        for (const k in R) if (R[k]) R[k] = Q2.add(R[k], FIGS.sh);
        for (const sd2 in reachTo) need = Math.max(need, Q2.len(Q2.sub(reachTo[sd2], R[sd2 + "Shoulder"])) / (armL * 0.97));
        need = Math.min(1.7, need);
        FIGS.k += (need - FIGS.k) * (need > FIGS.k ? 0.35 : 0.04);
        o.reachTo = reachTo;
      } else {
        FIGS.k += (1 - FIGS.k) * 0.1;
        FIGS.sh = null;
      }
      const Bd = figPose(R, o, W, H, FIGS.k);
      if (!Bd) break fig;
      const t = Bd.t, glove = !!FG().gloves;
      const tvSkip = window.BP_TV && REALSELF.ok && (REALSELF.odd = !REALSELF.odd);
      const real3d = realSelfReady() && (tvSkip || (REALSELF.ok = REALSELF.inst.draw(Bd, { W, H, dpr, alpha: selfA * Math.min(1, (FG().alpha || 0.13) * 1.25 + 0.55) })));
      if (!real3d) {
        if (!selfMk) selfMk = document.createElement("canvas");
        if (selfMk.width !== W || selfMk.height !== H) {
          selfMk.width = W;
          selfMk.height = H;
        }
        const m = selfMk.getContext("2d");
        m.globalCompositeOperation = "source-over";
        m.clearRect(0, 0, W, H);
        m.fillStyle = "#fff";
        for (const p of figShapes(Bd, o)) m.fill(p);
        if (!glove) for (const sd2 of ["l", "r"]) m.fill(handShape(Bd, sd2, false));
        m.globalCompositeOperation = "source-in";
        const core = Q2.add(Bd.n, Q2.mul(Bd.u, -0.25 * t)), sg = m.createRadialGradient(core[0], core[1], t * 0.2, core[0], core[1], t * 2.6);
        sg.addColorStop(0, "rgba(228,246,255,1)");
        sg.addColorStop(1, "rgba(180,218,255,0.72)");
        m.fillStyle = sg;
        m.fillRect(0, 0, W, H);
        if (!Bd.legs) {
          m.globalCompositeOperation = "destination-out";
          const a0 = Bd.hM, a1 = Q2.add(Bd.hM, Q2.mul(Bd.u, -0.75 * t));
          const fg = m.createLinearGradient(a0[0], a0[1], a1[0], a1[1]);
          fg.addColorStop(0, "rgba(0,0,0,0)");
          fg.addColorStop(1, "rgba(0,0,0,1)");
          m.fillStyle = fg;
          m.fillRect(0, 0, W, H);
        }
        m.globalCompositeOperation = "source-over";
        const FA2 = FG().alpha || (menuFig ? 0.2 : 0.13);
        ctx.save();
        ctx.globalAlpha = selfA * (big ? Math.min(1, FA2 * 1.25) : 0.5) * (menuFig ? 1 : 0.35);
        if (!big) {
          ctx.save();
          ctx.globalAlpha = selfA;
          const sh = ctx.createRadialGradient(cx, by, 0, cx, by, s * 0.35);
          sh.addColorStop(0, "rgba(0,0,0,0.35)");
          sh.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = sh;
          ctx.beginPath();
          ctx.ellipse(cx, by, s * 0.35, s * 0.07, 0, 0, 6.283);
          ctx.fill();
          ctx.restore();
        }
        if (big && FG().shadow) {
          ctx.save();
          ctx.shadowColor = "rgba(0,0,0,".concat(FG().shadow, ")");
          ctx.shadowBlur = t * 0.22;
          ctx.shadowOffsetX = W * 4;
          ctx.globalAlpha = selfA;
          ctx.globalCompositeOperation = "source-over";
          ctx.drawImage(selfMk, -W * 4, 0);
          ctx.restore();
        }
        ctx.drawImage(selfMk, 0, 0);
        ctx.restore();
      }
      if (glove) for (const [sd2, col] of [["l", COL.left], ["r", COL.right]]) {
        const gp = handShape(Bd, sd2, true);
        ctx.save();
        ctx.globalAlpha = selfA * Math.min(1, FA * 2.4 + 0.12);
        const c = Bd[sd2 + "P"], gg = ctx.createRadialGradient(c[0] - t * 0.04, c[1] - t * 0.05, t * 0.02, c[0], c[1], t * 0.22);
        gg.addColorStop(0, hexA(col, 0.95));
        gg.addColorStop(1, hexA(col, 0.55));
        ctx.fillStyle = gg;
        ctx.fill(gp);
        ctx.restore();
      }
      for (const [sd2, col] of [["l", COL.left], ["r", COL.right]]) {
        const p = Bd[sd2 + "P"];
        if (!p || ptrShown(sd2 === "l" ? "left" : "right", now)) continue;
        const r = t * 0.3;
        ctx.save();
        ctx.globalAlpha = selfA;
        const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], r);
        g.addColorStop(0, hexA(col, big ? 0.55 : 0.9));
        g.addColorStop(1, hexA(col, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p[0], p[1], r, 0, 6.283);
        ctx.fill();
        ctx.restore();
      }
      BP._figPose = Bd;
    }
    const v = BP.vis, ri = BP.rawImg, feetOk = ri && ri.lFoot && performance.now() - (BP.imgAt || 0) < 700 ? ri.lFoot[1] < 0.97 && ri.rFoot[1] < 0.97 : !v || v.lFoot === void 0 || v.lFoot > 0.3 && v.rFoot > 0.3;
    if (BP._oldPhone && !sim) {
      const fs = Math.max(16, H * 0.04);
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.font = "900 ".concat(fs, "px -apple-system, system-ui, sans-serif");
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const m1 = "Your phone has an old version", m2 = "close the page on your phone and scan the QR code again", tw = Math.max(ctx.measureText(m1).width, fs * 13);
      ctx.fillStyle = "rgba(120,20,30,0.88)";
      ctx.beginPath();
      ctx.roundRect(W / 2 - tw / 2 - fs, H * 0.06, tw + fs * 2, fs * 2.8, fs * 0.8);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.fillText(m1, W / 2, H * 0.06 + fs * 0.95);
      ctx.font = "700 ".concat(fs * 0.5, "px -apple-system, system-ui, sans-serif");
      ctx.fillText(m2, W / 2, H * 0.06 + fs * 2);
      ctx.restore();
    }
    const phoneOn = BP.live && !BP.mouse;
    let want = null;
    if (BP._forcePrompt) want = BP._forcePrompt === "absent" ? "away" : BP._forcePrompt;
    else if (phoneOn && !sim) {
      if (BP.present === false) want = "away";
      else if (BP.inPlay && BP.framing === "close") want = "close";
      else if (!BP.ready && !BP.inPlay) want = "checkin";
    }
    if (!want && (BP.armsStart || 0) > 0.05) want = "starting";
    else if (!want && BP.readyAt && performance.now() - BP.readyAt < 1600) want = "seen";
    const PRm = BP._prm || (BP._prm = { kind: null, want: null, since: 0, gone: 0, a: 0 });
    const problem = (k) => k === "away" || k === "close" || k === "checkin";
    if (want !== PRm.want) {
      PRm.want = want;
      PRm.since = now;
    }
    if (want) PRm.gone = now;
    const wait = problem(want) ? problem(PRm.kind) ? 0 : BP.inPlay ? 2e3 : 800 : 0;
    if (want && now - PRm.since >= wait) PRm.kind = want;
    else if (!want && PRm.kind && (!problem(PRm.kind) || now - PRm.gone >= 500)) PRm.kind = null;
    {
      const pd = Math.min(2, devicePixelRatio || 1);
      drawPrompt(PRm, now, dt, pd, Math.round(innerWidth * pd), Math.round(innerHeight * pd));
    }
    BP._feetNag = null;
    ctx.restore();
  }
  let prCv = null;
  function noticeText(kind) {
    if (typeof window !== "undefined" && window.BP_PHONEUI) {
      if (kind === "away") return "Step into view";
      if (kind === "close") return "Walk back a little";
      if (kind === "checkin") return BP.wholeBody === false ? "Walk back so I see you" : "Hands up to start";
      if (kind === "starting") return "Starting";
      return "I see you!";
    }
    if (kind === "away") return BP.inPlay ? "Step into view" : BP.needs === "full" && BP.legsSeen === false ? "Step back so I can see your feet" : "Step into view";
    if (kind === "close") return "Step back a little";
    if (kind === "checkin") return BP.wholeBody === false ? "Step back so I can see all of you" : "Raise both hands to start";
    if (kind === "starting") return "Starting";
    return "I see you!";
  }
  function drawPrompt(PRm, now, dt, dpr, W, H) {
    var _a;
    if (!prCv) {
      prCv = document.createElement("canvas");
      prCv.id = "bp-prompt";
      prCv.style.cssText = "position:fixed;top:0;right:0;bottom:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2147482000";
      document.body.appendChild(prCv);
    }
    if (prCv.width !== W || prCv.height !== H) {
      prCv.width = W;
      prCv.height = H;
    }
    const c = prCv.getContext("2d"), kind = PRm.kind || PRm.last;
    PRm.a += ((PRm.kind ? 1 : 0) - PRm.a) * Math.min(1, dt * 8);
    if (PRm.kind) PRm.last = PRm.kind;
    if (PRm.drawn) {
      const d = PRm.drawn;
      c.clearRect(d[0] - 4, d[1] - 4, d[2] + 8, d[3] + 8);
      PRm.drawn = null;
    }
    BP.prompt = null;
    BP.notice = null;
    if (PRm.a < 0.02 || !kind) {
      PRm.a = PRm.kind ? PRm.a : 0;
      return;
    }
    const msg = noticeText(kind), ring = kind === "checkin" ? BP.checkIn || 0 : kind === "starting" ? BP.armsStart || 0 : null;
    const col = kind === "seen" ? "#7dff9a" : kind === "starting" ? "#ffffff" : "#ffd36b";
    const fs = typeof window !== "undefined" && window.BP_PHONEUI ? Math.max(22 * dpr, Math.min(W, H) * 0.05) : Math.max(13 * dpr, Math.min(W, H) * 0.024);
    c.font = "800 ".concat(fs, "px -apple-system, system-ui, sans-serif");
    const ic = fs * 1.05, tw = c.measureText(msg).width, ph = fs * 1.75, pw = tw + ic + fs * 1.6;
    let y0 = Math.max(3 * dpr, (BP.inPlay ? (_a = BP.noticeTop) != null ? _a : W < H ? 0.19 : 0.105 : 6e-3) * H);
    const x0 = W / 2 - pw / 2;
    if (typeof window !== "undefined" && window.BP_PHONEUI) y0 = Math.max(y0, 76 * dpr);
    c.save();
    c.globalAlpha = PRm.a;
    c.fillStyle = "rgba(10,12,24,0.72)";
    c.beginPath();
    c.roundRect(x0, y0, pw, ph, ph / 2);
    c.fill();
    c.strokeStyle = "rgba(255,255,255,0.18)";
    c.lineWidth = Math.max(1, dpr);
    c.stroke();
    const ix = x0 + fs * 0.6 + ic / 2, iy = y0 + ph / 2;
    if (ring !== null) {
      c.lineWidth = fs * 0.16;
      c.strokeStyle = "rgba(255,255,255,0.25)";
      c.beginPath();
      c.arc(ix, iy, ic * 0.38, 0, 6.283);
      c.stroke();
      c.strokeStyle = "#7dff9a";
      c.beginPath();
      c.arc(ix, iy, ic * 0.38, -Math.PI / 2, -Math.PI / 2 + Math.max(0, Math.min(1, ring)) * 6.283);
      c.stroke();
    } else {
      c.fillStyle = col;
      c.beginPath();
      c.arc(ix, iy - ic * 0.24, ic * 0.15, 0, 6.283);
      c.fill();
      c.beginPath();
      c.roundRect(ix - ic * 0.15, iy - ic * 0.05, ic * 0.3, ic * 0.42, ic * 0.12);
      c.fill();
    }
    c.textAlign = "left";
    c.textBaseline = "middle";
    c.fillStyle = col;
    c.fillText(msg, ix + ic / 2 + fs * 0.35, iy + fs * 0.04);
    c.restore();
    PRm.drawn = [x0, y0, pw, ph];
    BP.notice = BP.prompt = { kind, msg, veil: false, x: x0 / dpr, y: y0 / dpr, w: pw / dpr, h: ph / dpr };
  }
  if (typeof document !== "undefined") document.readyState === "loading" ? addEventListener("DOMContentLoaded", () => RAF0(drawSelf)) : RAF0(drawSelf);
  const dayKey = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  BP.today = function() {
    const all = JSON.parse(localStorage.bp_days || "{}"), d = all[dayKey()] || { minutes: 0, kcal: 0, sessions: 0 };
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const k = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
      if (all[k] && all[k].minutes >= 1) streak++;
      else if (i > 0) break;
    }
    return { ...d, streak };
  };
  BP.saveSession = function({ game, score } = {}) {
    const all = JSON.parse(localStorage.bp_days || "{}"), k = dayKey(), d = all[k] || { minutes: 0, kcal: 0, sessions: 0 };
    d.minutes += BP.activity.activeSec / 60;
    d.kcal += BP.activity.kcal;
    d.sessions += 1;
    all[k] = d;
    localStorage.bp_days = JSON.stringify(all);
    if (game && score !== void 0) {
      const best = JSON.parse(localStorage.bp_best || "{}");
      if (!(best[game] >= score)) {
        best[game] = score;
        localStorage.bp_best = JSON.stringify(best);
      }
    }
    BP.activity.activeSec = 0;
    BP.activity.kcal = 0;
  };
  BP.best = (game) => JSON.parse(localStorage.bp_best || "{}")[game] || 0;
  BP.labMark = (o) => {
    try {
      if (BP._ws && BP._ws.readyState === 1) BP._ws.send(JSON.stringify({ type: "lab", t: Date.now() / 1e3, ...o }));
    } catch (_) {
    }
  };
  const TV_ID = Math.random().toString(36).slice(2);
  const PP = {
    win: 0.12,
    v: 2.5,
    ext1: 0.55,
    above: 0.6,
    below: 0.45,
    side: 0.7,
    ys: 0.12,
    rise: 0.25,
    rwin: 0.3,
    back: 0.12,
    gap: 0.3,
    hipv: 0.8,
    back6: 0.6,
    ahead: 0.35,
    band: 0.65,
    yh: { l: [], r: [] },
    pend: [],
    raw: null,
    torso: null,
    hip: [],
    last: {},
    l: { h: [], h2: [], last: -9, armed: true },
    r: { h: [], h2: [], last: -9, armed: true }
  };
  function picturePunches(now) {
    const ri = BP.rawImg;
    if (sim || !ri || ri === PP.raw || !ri.lShoulder || !ri.rShoulder || !ri.lHip || !ri.rHip || !ri.lHand || !ri.rHand) return;
    PP.raw = ri;
    if (performance.now() - (BP.imgAt || 0) > 300) return;
    const nowS = now / 1e3, ar = BP.imgAR || 0.5625, S = (k) => [ri[k][0] * ar, ri[k][1]];
    const ls = S("lShoulder"), rs = S("rShoulder"), lh = S("lHip"), rh = S("rHip");
    const ch = [(ls[0] + rs[0]) / 2, (ls[1] + rs[1]) / 2], hp = [(lh[0] + rh[0]) / 2, (lh[1] + rh[1]) / 2];
    const T = Math.hypot(ch[0] - hp[0], ch[1] - hp[1]);
    if (T < 0.03) return;
    PP.torso = PP.torso === null ? T : PP.torso + 0.05 * (T - PP.torso);
    const torso = PP.torso;
    PP.hip.push([nowS, hp[1] / torso]);
    while (PP.hip.length > 1 && nowS - PP.hip[0][0] > 0.12) PP.hip.shift();
    const hipv = PP.hip.length > 1 ? Math.abs(PP.hip[PP.hip.length - 1][1] - PP.hip[0][1]) / Math.max(1e-3, PP.hip[PP.hip.length - 1][0] - PP.hip[0][0]) : 0;
    for (const s of ["l", "r"]) {
      const d = PP[s], sh = S(s + "Shoulder"), hd = S(s + "Hand"), rel = [(hd[0] - sh[0]) / torso, (hd[1] - sh[1]) / torso];
      d.h.push([nowS, rel]);
      while (d.h.length > 1 && nowS - d.h[0][0] > PP.win) d.h.shift();
      d.h2.push([nowS, rel]);
      while (d.h2.length > 1 && nowS - d.h2[0][0] > PP.rwin) d.h2.shift();
      PP.yh[s].push([nowS, rel[1]]);
      while (PP.yh[s].length > 1 && nowS - PP.yh[s][0][0] > 1.2) PP.yh[s].shift();
      if (d.h.length < 2 || nowS - d.h[0][0] < PP.win * 0.6) continue;
      const r0 = d.h[0][1], v = Math.hypot(rel[0] - r0[0], rel[1] - r0[1]) / Math.max(1e-3, nowS - d.h[0][0]);
      const ext = Math.hypot(rel[0], rel[1]), rise = Math.max(...d.h2.map((x) => x[1][1])) - rel[1];
      let jump = 0;
      for (let i = 1; i < d.h.length; i++) jump = Math.max(jump, Math.hypot(d.h[i][1][0] - d.h[i - 1][1][0], d.h[i][1][1] - d.h[i - 1][1][1]));
      if (jump > 0.55 && jump > 0.75 * Math.hypot(rel[0] - r0[0], rel[1] - r0[1])) {
        d.last = nowS;
        continue;
      }
      const a1 = v > PP.v && ext < PP.ext1 && rel[1] > -PP.above && rel[1] < PP.below && Math.abs(rel[0]) < PP.side;
      const a2 = rel[1] < PP.ys && rel[1] > -PP.above && ext < PP.ext1 && rise > PP.rise && Math.abs(rel[0]) < PP.side;
      if (!d.armed && rel[1] > PP.ys + PP.back) d.armed = true;
      if ((a1 || a2) && hipv < PP.hipv && d.armed && nowS - d.last > PP.gap) {
        d.last = nowS;
        d.armed = false;
        PP.pend.push({ s, t: nowS, power: Math.max(0.25, Math.min(1, Math.max((v - 1.5) / 6, rise / 0.75))) });
      }
    }
    while (PP.pend.length && nowS - PP.pend[0].t >= PP.ahead) {
      const c = PP.pend.shift(), o = c.s === "l" ? "r" : "l";
      const ys = PP.yh[c.s].filter((x) => x[0] >= c.t - PP.back6 && x[0] <= c.t + PP.ahead).map((x) => x[1]);
      const os = PP.yh[o].filter((x) => x[0] >= c.t - PP.back6 && x[0] <= c.t + PP.ahead).map((x) => x[1]);
      if (!ys.length || Math.max(...ys) > PP.band || Math.min(...ys) < -PP.band || os.length && Math.max(...os) > PP.band + 0.15) continue;
      const side = c.s === "l" ? "left" : "right";
      if (BP.present === true && now - (PP.last[side] || -9e9) > 300) {
        PP.last[side] = now;
        const h = BP.hands[side];
        emit(side === "left" ? "punchL" : "punchR", { x: h.x, y: h.y, power: c.power, from: "picture" });
      }
    }
  }
  BP.start = function() {
    if (DEMO) return startDemo();
    if (HOSTED) return startHosted();
    (function connect() {
      const ws = new WebSocket(WS_URL);
      let pc = null, pcId = null;
      BP._ws = ws;
      ws.onopen = () => {
        if (FROM_PHONE) ws.send(JSON.stringify({
          type: "hello",
          video: !!BP.wantVideo,
          room: ROOM,
          k: KEY
          /* the phone only streams to its own TV pages */
        }));
        if (ONLINE) {
          ws.send(JSON.stringify({ type: "tv-claim", id: TV_ID }));
          ws.send(JSON.stringify({ type: "rtc-hello", video: !!BP.wantVideo, recAll: !!BP.recordAll }));
        }
      };
      ws.onmessage = (e) => {
        let m;
        try {
          m = JSON.parse(e.data);
        } catch (_) {
          return;
        }
        if (m.type === "tv-claim") {
          if (m.id !== TV_ID) {
            BP.standby = true;
            try {
              if (pc) pc.close();
            } catch (_) {
            }
            ws.onclose = null;
            ws.close();
            BP.live = false;
            try {
              document.body.insertAdjacentHTML("beforeend", '<div style="position:fixed;top:0;right:0;bottom:0;left:0;z-index:99;display:flex;align-items:center;justify-content:center;background:#000c;color:#fff;font:800 4vmin -apple-system,system-ui,sans-serif;text-align:center">Playing on another screen now.<br><span style="font-size:2.4vmin;opacity:.7">Reload this page to play here instead.</span></div>');
            } catch (_) {
            }
          }
          return;
        }
        if (m.type === "rtc-want" || m.type === "peer" && m.role === "phone" && m.joined) {
          ws.send(JSON.stringify({ type: "rtc-hello", video: !!BP.wantVideo, recAll: !!BP.recordAll }));
          return;
        }
        if (m.type === "rtc") {
          if (m.sdp && m.sdp.type === "offer") {
            try {
              if (pc) pc.close();
            } catch (_) {
            }
            pcId = m.id;
            pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
            const id = m.id;
            pc.onicecandidate = (ev) => {
              if (ev.candidate) ws.send(JSON.stringify({ type: "rtc", id, ice: ev.candidate }));
            };
            pc.ontrack = (ev) => {
              BP.videoStream = ev.streams[0] || new MediaStream([ev.track]);
              emit("video", BP.videoStream);
            };
            pc.ondatachannel = (ev) => {
              if (ev.channel.label === "cam") {
                ev.channel.onmessage = (x) => {
                  try {
                    BP._camThumb(JSON.parse(x.data));
                  } catch (_) {
                  }
                };
                return;
              }
              ev.channel.onmessage = (x) => {
                try {
                  BP.directAt = performance.now();
                  BP.link = "direct";
                  feed(JSON.parse(x.data));
                } catch (_) {
                }
              };
            };
            pc.setRemoteDescription(m.sdp).then(() => pc.createAnswer()).then((a) => pc.setLocalDescription(a)).then(() => ws.send(JSON.stringify({ type: "rtc", id, sdp: pc.localDescription }))).catch(() => {
            });
          } else if (m.ice && pc && m.id === pcId) pc.addIceCandidate(m.ice).catch(() => {
          });
          return;
        }
        if (m.type === "peer" || m.type === "rtc-hello") return;
        if (m.type === "thumb") {
          if (FROM_PHONE) BP._camThumb(m);
          return;
        }
        if (performance.now() - (BP.directAt || 0) < 500) return;
        BP.link = "server";
        feed(m);
      };
      ws.onclose = () => setTimeout(connect, 1e3);
    })();
  };
  function startHosted() {
    addEventListener("message", (e) => {
      if (e.source !== window.parent || e.origin !== location.origin) return;
      const m = e.data;
      if (!m || typeof m !== "object") return;
      if (m.type === "thumb") {
        BP._camThumb(m);
        return;
      }
      if (m.type && m.type !== "body") return;
      BP.link = "cast";
      feed(m);
    });
    try {
      window.parent.postMessage({ type: "hello", video: !!BP.wantVideo }, location.origin);
    } catch (_) {
    }
  }
  function startDemo() {
    fetch((location.pathname.includes("/bodymovin/") ? "" : "./") + "demo_body.jsonl").then((r) => r.text()).then((t) => {
      const rows = t.trim().split("\n").map((l) => JSON.parse(l)), total = rows[rows.length - 1].dt, t0 = performance.now();
      let i = 0, last = -1;
      setInterval(() => {
        const el = (performance.now() - t0) / 1e3 % total;
        if (rows[i].dt > el + 0.05) i = 0;
        while (i < rows.length - 1 && rows[i + 1].dt <= el) i++;
        if (i === last) return;
        last = i;
        feed({ tracked: true, t: performance.now() / 1e3, j: rows[i].j, vis: rows[i].vis, i: rows[i].i, ar: rows[i].ar });
      }, 16);
    });
  }
  let track = null;
  BP.music = function(name, volume = 0.32) {
    volume *= 0.5;
    if (new URLSearchParams(location.search).has("mute")) return null;
    if (track && track.dataset.name === name) return track;
    if (track) {
      const old = track;
      const fade = setInterval(() => {
        old.volume = Math.max(0, old.volume - 0.03);
        if (old.volume <= 0) {
          old.pause();
          clearInterval(fade);
        }
      }, 50);
      setTimeout(() => {
        old.pause();
        clearInterval(fade);
      }, 1800);
    }
    track = new Audio("".concat(typeof BP_DIR !== "undefined" ? BP_DIR : "", "assets/music/").concat(name, ".mp3"));
    track.loop = true;
    track.volume = 0;
    track.muted = !!BP.musicOff;
    track.dataset.name = name;
    track.dataset.vol = volume;
    setTimeout(showMusicBtn, 0);
    track.play().then(() => {
      const up = setInterval(() => {
        if (BP.musicOff) {
          track.volume = 0;
          clearInterval(up);
          return;
        }
        track.volume = Math.min(volume, track.volume + 0.02);
        if (track.volume >= volume) clearInterval(up);
      }, 50);
    }).catch(() => {
    });
    return track;
  };
  if (BP.wantVideo === void 0) BP.wantVideo = true;
  const CAM = { box: null, vid: null, img: null, stream: null, thumbAt: 0, userHid: false };
  function camBox() {
    if (CAM.box || typeof document === "undefined" || !document.body) return CAM.box;
    const box = CAM.box = document.createElement("div");
    box.id = "bp-cam";
    box.style.cssText = "position:fixed;left:max(1.4vmin,env(safe-area-inset-left));bottom:max(1.4vmin,env(safe-area-inset-bottom));width:7.5vmin;min-width:52px;max-width:110px;z-index:29;cursor:pointer;opacity:.8;display:none;border-radius:1.2vmin;overflow:hidden;border:1px solid rgba(255,255,255,.35);box-shadow:0 .6vmin 2vmin rgba(0,0,0,.5);background:#000" + (BP.camStyle ? ";" + BP.camStyle : "");
    box.innerHTML = '<video autoplay playsinline muted style="width:100%;display:none;transform:scaleX(-1)"></video><img alt="" style="width:100%;display:none;transform:scaleX(-1)"><canvas style="position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;pointer-events:none"></canvas>';
    CAM.vid = box.querySelector("video");
    CAM.img = box.querySelector("img");
    box.addEventListener("click", (e) => {
      e.stopPropagation();
      CAM.userHid = true;
      box.style.display = "none";
    });
    (document.getElementById("bp-cam-slot") || document.body).appendChild(box);
    if (CAM.vid.requestVideoFrameCallback) {
      const f = () => {
        CAM.frameAt = performance.now();
        CAM.vid.requestVideoFrameCallback(f);
      };
      CAM.vid.requestVideoFrameCallback(f);
    }
    const cv = box.querySelector("canvas"), SK = [["head", "lShoulder"], ["head", "rShoulder"], ["lShoulder", "rShoulder"], ["lShoulder", "lForearm"], ["lForearm", "lHand"], ["rShoulder", "rForearm"], ["rForearm", "rHand"], ["lShoulder", "lHip"], ["rShoulder", "rHip"], ["lHip", "rHip"], ["lHip", "lKnee"], ["lKnee", "lFoot"], ["rHip", "rKnee"], ["rKnee", "rFoot"]];
    (function skel() {
      RAF0(skel);
      if (box.style.display === "none") return;
      const w = cv.clientWidth, h = cv.clientHeight;
      if (cv.width !== w * 2) {
        cv.width = w * 2;
        cv.height = h * 2;
      }
      const c = cv.getContext("2d"), ri = BP.rawImg;
      c.clearRect(0, 0, cv.width, cv.height);
      if (!ri || performance.now() - (BP.imgAt || 0) > 500) return;
      const P = (k) => ri[k] && [(1 - ri[k][0]) * cv.width, ri[k][1] * cv.height];
      c.lineCap = "round";
      c.lineWidth = Math.max(1.5, cv.width * 0.02);
      c.strokeStyle = BP.present ? "rgba(125,255,154,.9)" : "rgba(255,211,107,.9)";
      c.beginPath();
      for (const [a, b] of SK) {
        const pa = P(a), pb = P(b);
        if (pa && pb) {
          c.moveTo(...pa);
          c.lineTo(...pb);
        }
      }
      c.stroke();
    })();
    setInterval(camTick, 250);
    return box;
  }
  function camTick() {
    const box = CAM.box;
    if (!box) return;
    const now = performance.now(), tr = CAM.stream && CAM.stream.getVideoTracks()[0];
    const vidOk = !!(tr && tr.readyState === "live" && !tr.muted && CAM.vid.videoWidth && now - (BP.directAt || 0) < 3e3 && (!CAM.vid.requestVideoFrameCallback || now - (CAM.frameAt || 0) < 2500));
    const imgOk = now - CAM.thumbAt < 2e3 && CAM.img.naturalWidth > 0;
    const mode = vidOk ? "vid" : imgOk ? "img" : null;
    CAM.vid.style.display = mode === "vid" ? "block" : "none";
    CAM.img.style.display = mode === "img" ? "block" : "none";
    box.style.display = mode && !CAM.userHid && BP.camPanel !== false ? "block" : "none";
  }
  BP.on("video", (s) => {
    if (BP.camPanel === false || !camBox()) return;
    CAM.stream = s;
    CAM.vid.srcObject = s;
    CAM.vid.play && CAM.vid.play().catch(() => {
    });
    CAM.vid.onloadeddata = camTick;
  });
  BP._camThumb = (m) => {
    if (BP.camPanel === false || !m || typeof m.jpg !== "string" || m.jpg.length > 2e5 || !camBox()) return;
    CAM.img.onload = () => {
      CAM.thumbAt = performance.now();
      camTick();
    };
    CAM.img.src = "data:image/jpeg;base64," + m.jpg;
  };
  BP.musicVolume = (v) => {
    if (track) {
      track.volume = v * (BP.musicOff ? 0 : 1);
      track.muted = BP.musicOff || v <= 0;
    }
  };
  BP.musicOff = (() => {
    try {
      return localStorage.bp_music_off === "1";
    } catch (_) {
      return false;
    }
  })();
  BP._musicHooks = [];
  BP.onMusic = (fn, now = true) => {
    BP._musicHooks.push(fn);
    if (now) fn(BP.musicOff);
    showMusicBtn();
  };
  BP.setMusicOff = (off) => {
    BP.musicOff = !!off;
    try {
      localStorage.bp_music_off = off ? "1" : "0";
    } catch (_) {
    }
    if (track) {
      track.volume = off ? 0 : +track.dataset.vol || 0.32;
      track.muted = !!off;
    }
    BP._musicHooks.forEach((fn) => {
      try {
        fn(BP.musicOff);
      } catch (_) {
      }
    });
    showMusicBtn();
  };
  let musicBtn = null;
  BP.paused = false;
  const HELD = [], ACS = [];
  if (typeof window !== "undefined") {
    window.requestAnimationFrame = (cb) => BP.paused ? (HELD.push(cb), 0) : RAF0(cb);
    for (const K of ["AudioContext", "webkitAudioContext"]) {
      const A = window[K];
      if (!A) continue;
      window[K] = class extends A {
        constructor(...a) {
          super(...a);
          ACS.push(this);
        }
      };
    }
  }
  BP.setPaused = (on) => {
    if (on === BP.paused) return;
    if (on && BP._mode === "menu" && typeof document !== "undefined" && document.documentElement.dataset.bpMode === "menu" && !/\/(index|phone|lab|join)\.html$|\/$/.test(location.pathname)) return;
    BP.paused = on;
    if (on) BP._pausedAt = performance.now();
    ACS.forEach((c) => {
      try {
        on ? c.suspend() : c.resume();
      } catch (_) {
      }
    });
    if (track) {
      try {
        on ? track.pause() : track.play();
      } catch (_) {
      }
    }
    const ov = typeof document !== "undefined" && document.getElementById("bp-pause-ov");
    if (ov) {
      ov.style.display = on ? "flex" : "none";
      ov.classList.toggle("bp-right", BP.pauseSide === "right");
    }
    if (typeof document !== "undefined") for (const e of document.querySelectorAll("#hud, #bp-tips, .bph-tip, #bp-pausehint" + (BP.pauseHide ? ", " + BP.pauseHide : ""))) e.style.visibility = on ? "hidden" : "";
    if (!on) {
      const h = HELD.splice(0);
      h.forEach((cb) => RAF0(cb));
    }
  };
  const isGame = typeof location !== "undefined" && !/\/(index|phone|lab|join)\.html$|\/$/.test(location.pathname);
  if (typeof document !== "undefined") {
    const away = (hidden) => {
      if (hidden) {
        if (isGame) BP.setPaused(true);
        ACS.forEach((c) => {
          try {
            c.suspend();
          } catch (_) {
          }
        });
        if (track) {
          try {
            track.pause();
          } catch (_) {
          }
        }
        document.querySelectorAll("audio").forEach((m) => {
          try {
            m.pause();
          } catch (_) {
          }
        });
      } else if (!BP.paused) {
        ACS.forEach((c) => {
          try {
            c.resume();
          } catch (_) {
          }
        });
        if (track) {
          try {
            track.play().catch(() => {
            });
          } catch (_) {
          }
        }
      }
    };
    document.addEventListener("visibilitychange", () => away(document.visibilityState === "hidden"));
    addEventListener("pagehide", () => away(true));
    addEventListener("pageshow", (e) => {
      if (e.persisted) away(false);
    });
  }
  if (typeof document !== "undefined" && isGame) {
    if (!document.getElementById("bp-sys-css")) {
      const st = document.createElement("style");
      st.id = "bp-sys-css";
      st.textContent = '#bp-sys{position:fixed;z-index:31;top:max(1.6vmin,env(safe-area-inset-top));left:max(1.6vmin,env(safe-area-inset-left));display:flex;gap:max(8px,1.2vmin);align-items:center;pointer-events:none}#bp-sys > *{position:relative!important;top:auto!important;right:auto!important;bottom:auto!important;left:auto!important;margin:0!important;transform:none!important;box-sizing:border-box!important;flex:none;height:max(60px,8vmin)!important;min-height:0!important;min-width:0!important;width:auto!important;padding:0 max(16px,2.4vmin)!important;border-radius:999px!important;border:1px solid rgba(255,255,255,.18)!important;background:rgba(10,12,24,.55)!important;color:#fff!important;text-shadow:none!important;font:800 max(16px,2.2vmin)/1 -apple-system,system-ui,"Segoe UI",sans-serif!important;letter-spacing:.08em!important;white-space:nowrap;display:inline-flex!important;align-items:center;justify-content:center;opacity:1!important;cursor:pointer;pointer-events:auto;text-decoration:none!important;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);overflow:hidden}#bp-sys > #bp-music{width:max(60px,8vmin)!important;padding:0!important}#bp-sys > .sys-hide,#bp-sys > .hide{display:none!important}html[data-bp-mode=play] #bp-menu,html[data-bp-mode=play] #bp-home,html[data-bp-mode=play] #bpHome,html[data-bp-mode=play] body > #home,html[data-bp-mode=play] #bp-sys > :not(#bp-pause):not(#bp-music),html[data-bp-mode=paused] #bp-menu,html[data-bp-mode=paused] #bp-music,html[data-bp-mode=paused] #bp-pause,html[data-bp-mode=paused] #bp-home,html[data-bp-mode=paused] #bpHome,html[data-bp-mode=paused] body > #home,html[data-bp-mode=paused] #bp-sys,html[data-bp-mode=menu] #bp-menu,html[data-bp-mode=menu] #bp-music,html[data-bp-mode=menu] #bp-pause{display:none!important}#bp-pause{position:fixed!important;left:max(1.6vmin,env(safe-area-inset-left))!important;top:max(1.6vmin,env(safe-area-inset-top))!important;right:auto!important;width:max(76px,11vmin)!important;height:max(76px,11vmin)!important;min-width:0!important;min-height:0!important;padding:0!important;margin:0!important;border-radius:50%!important;font:800 max(28px,4.6vmin)/1 -apple-system,system-ui,sans-serif!important;z-index:32!important;display:flex;align-items:center;justify-content:center;background:rgba(10,12,24,.6)!important;border:2px solid rgba(255,255,255,.45)!important;color:#fff!important;opacity:1!important;transform:none!important}html[data-bp-leave="1"] #bp-home:not(.bp-leave),html[data-bp-leave="1"] #bpHome:not(.bp-leave),html[data-bp-leave="1"] #home:not(.bp-leave){display:none!important}html[data-bp-mode=play] #bp-music{position:fixed!important;right:max(1.6vmin,env(safe-area-inset-right))!important;left:auto!important;top:max(1.6vmin,env(safe-area-inset-top))!important;width:max(76px,11vmin)!important;height:max(76px,11vmin)!important;min-width:0!important;min-height:0!important;padding:0!important;margin:0!important;border-radius:50%!important;z-index:32!important;display:flex!important;align-items:center;justify-content:center;background:rgba(10,12,24,.6)!important;border:2px solid rgba(255,255,255,.45)!important;opacity:1!important;transform:none!important}.bp-leave{position:fixed!important;left:max(5vw,16px)!important;bottom:max(10vh,24px)!important;top:auto!important;right:auto!important;margin:0!important;font-size:max(15px,2.4vmin)!important;min-width:max(140px,20vmin)!important;min-height:max(60px,10vmin)!important;box-sizing:border-box!important;z-index:8}';
      (document.head || document.documentElement).appendChild(st);
    }
    const modeOf = () => {
      if (BP.paused) return "paused";
      if (BP._modal) return "menu";
      const G = window.__game, st = G && G.state;
      if (st !== void 0 && st !== null) return MENU_STATES.test(String(st)) ? "menu" : "play";
      return BP.inPlay && !startButton() ? "play" : "menu";
    };
    const MENU_STATES = /^(title|end|over|gameover|menu|done|finish|ready|loading|medals|results)$/i;
    BP._mode = "menu";
    BP.sysMode = () => BP._mode;
    (function modeLoop(now) {
      RAF0(modeLoop);
      if (now - (BP._modeAt || 0) < 120) return;
      BP._modeAt = now;
      BP._modeTick = (BP._modeTick || 0) + 1;
      let m = "menu";
      try {
        m = modeOf();
      } catch (_) {
      }
      if (m !== BP._mode || document.documentElement.dataset.bpMode !== m) {
        BP._mode = m;
        document.documentElement.dataset.bpMode = m;
      }
      if (m !== "menu") BP._gameHomeAt = -1e9;
      const lv = m === "menu" && (performance.now() - (BP._gameHomeAt || -1e9) < 2500 || BP._gameHomeAt > 0 && BP._modeTick - (BP._gameHomeTick || 0) < 20 || [...document.querySelectorAll(".bp-leave")].some((e) => e.getClientRects().length && getComputedStyle(e).visibility !== "hidden" && !e.matches("#bp-home, #bpHome, #home")));
      if (lv !== (document.documentElement.dataset.bpLeave === "1")) document.documentElement.dataset.bpLeave = lv ? "1" : "";
    })(performance.now());
    const mkPause = () => {
      if (document.getElementById("bp-pause")) return;
      const b = document.createElement("button");
      b.id = "bp-pause";
      b.textContent = "⏸";
      b.setAttribute("aria-label", "pause");
      b.style.cssText = "position:fixed;top:max(1.2vmin,env(safe-area-inset-top));right:max(1.6vmin,env(safe-area-inset-right));z-index:31;width:7vmin;height:7vmin;min-width:56px;min-height:56px;border-radius:50%;border:1px solid #ffffff40;background:#00000040;color:#fff;font:800 max(18px,3vmin) -apple-system,system-ui,sans-serif;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);cursor:pointer;opacity:.85;padding:0" + (BP.pauseBtnStyle ? ";" + BP.pauseBtnStyle : "");
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        BP.setPaused(!BP.paused);
      });
      document.body.appendChild(b);
      if (!document.getElementById("bp-pm-css")) {
        const st = document.createElement("style");
        st.id = "bp-pm-css";
        st.textContent = "#bp-pm-card{display:flex;flex-direction:column;align-items:stretch;gap:max(16px,3vmin);box-sizing:border-box;width:min(92vw,max(340px,64vmin));padding:max(18px,3vmin);border-radius:max(20px,3.6vmin);background:rgba(10,12,24,.72);border:1px solid rgba(255,255,255,.18);box-shadow:0 1.2vmin 4vmin #0007;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}#bp-pause-ov button{font:900 max(18px,3.2vmin) -apple-system,system-ui,sans-serif;letter-spacing:.04em;color:#fff;border:2px solid #ffffff55;border-radius:max(16px,2.6vmin);cursor:pointer;position:relative;overflow:hidden;padding:0 1vmin;transition:transform .15s,border-color .15s;margin:0}#bp-pm-resume{height:max(88px,16vmin);font-size:max(26px,5.4vmin);background:linear-gradient(135deg,#ff7ad9,#66e0ff)}#bp-pm-row{display:flex;gap:max(24px,5vmin)}#bp-pm-row button{flex:1;height:max(72px,12vmin);background:#ffffff26}#bp-pm-title{text-align:center;font:900 max(20px,3.6vmin)/1 -apple-system,system-ui,sans-serif;letter-spacing:.12em;opacity:.9}#bp-pm-say{text-align:center;font:800 max(16px,2.4vmin)/1.2 -apple-system,system-ui,sans-serif;opacity:.9;margin-top:calc(-1 * max(6px,1vmin))}#bp-pm-say:empty{display:none}#bp-pause-ov button.over{border-color:#fff;transform:scale(1.04)}@media (min-aspect-ratio:21/20){#bp-pause-ov{justify-content:flex-start!important;padding:0 max(16px,3vw)!important;box-sizing:border-box}#bp-pause-ov.bp-right{justify-content:flex-end!important}#bp-pm-card{width:min(40vw,max(340px,64vmin))!important}}@media (max-aspect-ratio:1/1){#bp-pause-ov{align-items:flex-end!important;padding-bottom:max(16px,3vh)!important;box-sizing:border-box}}";
        document.head.appendChild(st);
      }
      const ov = document.createElement("div");
      ov.id = "bp-pause-ov";
      ov.style.cssText = "position:fixed;top:0;right:0;bottom:0;left:0;z-index:2147482000;display:none;align-items:center;justify-content:center;background:transparent;color:#fff;font-family:-apple-system,system-ui,sans-serif";
      ov.innerHTML = '<div id="bp-pm-card"><div id="bp-pm-title">PAUSED</div><button id="bp-pm-resume">▶ RESUME</button><div id="bp-pm-say"></div><div id="bp-pm-row"><button id="bp-pm-menu">↻ RESTART</button><button id="bp-pm-home">⌂ HOME</button></div></div>';
      document.body.appendChild(ov);
      const say = ov.querySelector("#bp-pm-say"), setSay = (t) => {
        if (say.textContent !== t) say.textContent = t;
      };
      const homeUrl = () => (typeof BP_DIR !== "undefined" ? BP_DIR : "") + "index.html";
      const PM = { "bp-pm-resume": () => BP.setPaused(false), "bp-pm-menu": () => location.reload(), "bp-pm-home": () => {
        location.href = homeUrl();
      } };
      for (const id in PM) ov.querySelector("#" + id).addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        PM[id]();
      });
      addEventListener("keydown", (e) => {
        if (e.key === "p" || e.key === "P" || BP.paused && e.key === "Escape") {
          e.stopImmediatePropagation();
          BP.setPaused(e.key === "Escape" ? false : !BP.paused);
        }
      }, true);
      let downSince = 0;
      (function loop(now) {
        var _a;
        RAF0(loop);
        if (!BP.handOver || !BP.dwell) return;
        if (BP.paused && now - (BP._pauseUpd || 0) > 5) {
          BP._pauseUpd = now;
          try {
            BP.update(now);
          } catch (_) {
          }
        }
        const ids = BP.paused ? Object.keys(PM) : ["bp-pause"];
        const Lh = BP.hands.left, Rh = BP.hands.right, upTo = (y) => {
          var _a2, _b;
          return !BP.simulating && Lh.seen && Rh.seen && Lh.raised !== false && Rh.raised !== false && ((_a2 = Lh.py) != null ? _a2 : 1) < y && ((_b = Rh.py) != null ? _b : 1) < y;
        };
        if (BP._bothUp && !BP.simulating) BP._bothUpAt = now;
        const up2 = upTo(0.62) || upTo(0.75) && (BP._bothUp || now - ((_a = BP._bothUpAt) != null ? _a : -1e9) < 1500);
        const quiet = BP.paused && (now - (BP._pausedAt || 0) < 700 || up2);
        if (BP.paused) {
          const raised = (h) => {
            var _a2, _b;
            return h.seen && h.raised !== false && ((_b = (_a2 = h.py) != null ? _a2 : h.y) != null ? _b : 1) < 0.99;
          };
          const can = BP.live && !BP.mouse && (!BP.simulating || window.__bpAutoResumeTest) && now - (BP._pausedAt || 0) > 1500;
          if (!can || raised(Lh) || raised(Rh)) downSince = 0;
          else if (!downSince) downSince = now;
          const left = downSince ? 4.2 - (now - downSince) / 1e3 : 9;
          if (left <= 0) {
            downSince = 0;
            BP.setPaused(false);
          } else if (left <= 3) setSay("Resuming in " + Math.ceil(left) + " · raise a hand to stay");
          else setSay(up2 ? "Lower one hand" : "");
        } else downSince = 0;
        for (const id of ids) {
          const tgt = id === "bp-pause" ? b : ov.querySelector("#" + id), r = tgt.getBoundingClientRect();
          const over = !quiet && BP.handOver({ x: r.left, y: r.top, w: r.width, h: r.height }, innerWidth, innerHeight);
          const k = BP.dwell(id, over, now, 800);
          if (id === "bp-pause") tgt.style.boxShadow = over ? "inset " + Math.round((k || 0) * r.width) + "px 0 0 #ffffff66" : "none";
          else tgt.classList.toggle("over", !!over);
          if (k === 1) {
            if (id === "bp-pause") BP.setPaused(true);
            else PM[id]();
          }
        }
      })(performance.now());
    };
    document.readyState === "loading" ? addEventListener("DOMContentLoaded", mkPause) : setTimeout(mkPause, 0);
  }
  if (typeof document !== "undefined" && !/\/(index|phone|lab|join)\.html$|\/$/.test(location.pathname)) {
    const mk = () => {
      if (document.getElementById("bp-menu")) return;
      const b = document.createElement("button");
      b.id = "bp-menu";
      b.textContent = "↩ MENU";
      b.setAttribute("aria-label", "back to this game's menu");
      b.style.cssText = "position:fixed;top:calc(max(1.2vmin,env(safe-area-inset-top)) + 11.4vmin);left:calc(max(2.2vmin,env(safe-area-inset-left)) + 6.6vmin);z-index:30;height:7vmin;min-height:60px;padding:0 2vmin;border-radius:999px;border:1px solid #ffffff40;background:#00000038;color:#ffffffd8;font:800 max(13px,2vmin) -apple-system,system-ui,sans-serif;letter-spacing:.08em;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);cursor:pointer;opacity:.8;overflow:hidden;" + (BP.menuBtnStyle || "");
      const go = () => {
        location.reload();
      };
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        go();
      });
      document.body.appendChild(b);
      const st = document.createElement("style");
      st.textContent = "@media (max-width:600px){.bph-tip{margin-top:13vw!important}}";
      document.head.appendChild(st);
      (function loop(now) {
        RAF0(loop);
        if (!BP.handOver || !BP.dwell || BP.paused) return;
        const r = b.getBoundingClientRect(), over = BP.handOver({ x: r.left, y: r.top, w: r.width, h: r.height }, innerWidth, innerHeight);
        const k = BP.dwell("bp-menu", over, now, 800);
        b.style.boxShadow = over ? "inset " + Math.round((k || 0) * r.width) + "px 0 0 #66e0ff55" : "none";
        if (k === 1) go();
      })(performance.now());
    };
    document.readyState === "loading" ? addEventListener("DOMContentLoaded", mk) : setTimeout(mk, 0);
  }
  function showPauseHint() {
    if (typeof document === "undefined" || !document.body || BP._pauseHintDone) return;
    BP._pauseHintDone = true;
    const d = document.createElement("div");
    d.id = "bp-pausehint";
    d.textContent = "Both hands up to pause";
    d.style.cssText = "position:fixed;left:50%;bottom:max(1vmin,6px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:40;pointer-events:none;padding:.28em .9em .32em;border-radius:999px;background:rgba(6,8,18,.9);border:1px solid #ffffff33;color:#fff;font:800 max(15px,min(28px,2.5vmin)) -apple-system,system-ui,sans-serif;letter-spacing:.02em;white-space:nowrap;opacity:0;transition:opacity .4s";
    const go = () => {
      if (document.querySelector(".bph-tip")) return setTimeout(go, 400);
      document.body.appendChild(d);
      requestAnimationFrame(() => {
        d.style.opacity = "1";
      });
      setTimeout(() => {
        d.style.opacity = "0";
        setTimeout(() => d.remove(), 700);
      }, 3e3);
    };
    go();
  }
  function showMusicBtn() {
    if (typeof document === "undefined" || !document.body) return;
    if (!musicBtn) {
      musicBtn = document.createElement("button");
      musicBtn.id = "bp-music";
      musicBtn.setAttribute("aria-label", "music on or off");
      musicBtn.style.cssText = "position:fixed;top:calc(max(1.2vmin,env(safe-area-inset-top)) + 11.4vmin);left:max(2.2vmin,env(safe-area-inset-left));z-index:30;width:7vmin;height:7vmin;min-width:56px;min-height:56px;border-radius:50%;border:1px solid #ffffff40;background:#00000038;color:#ffffffd0;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;opacity:.75";
      if (BP.musicBtnStyle) musicBtn.style.cssText += ";" + BP.musicBtnStyle;
      musicBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        BP.setMusicOff(!BP.musicOff);
      });
      addEventListener("keydown", (e) => {
        if (e.key === "m" || e.key === "M") BP.setMusicOff(!BP.musicOff);
      });
      document.body.appendChild(musicBtn);
      if (isGamePage) (function loop(now) {
        RAF0(loop);
        if (!BP.handOver || !BP.dwell || BP.paused || getComputedStyle(musicBtn).display === "none") return;
        const r = musicBtn.getBoundingClientRect();
        if (!r.width) return;
        const over = BP.handOver({ x: r.left, y: r.top, w: r.width, h: r.height }, innerWidth, innerHeight), k = BP.dwell("bp-music", over, now, 800);
        musicBtn.style.boxShadow = over ? "inset " + Math.round((k || 0) * r.width) + "px 0 0 #66e0ff55" : "none";
        if (k === 1) BP.setMusicOff(!BP.musicOff);
      })(performance.now());
    }
    const note = '<path d="M9 18V5l11-2v13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6" cy="18" r="3" fill="currentColor"/><circle cx="17" cy="16" r="3" fill="currentColor"/>';
    const slash = BP.musicOff ? '<path d="M3 3l18 18" stroke="#ff8fa3" stroke-width="2.4" stroke-linecap="round"/>' : "";
    musicBtn.innerHTML = '<svg viewBox="0 0 24 24" style="width:55%;height:55%">'.concat(note).concat(slash, "</svg>");
    musicBtn.title = BP.musicOff ? "music off (M)" : "music on (M)";
  }
  BP.freeRight = () => {
    const mb = typeof document !== "undefined" && document.getElementById("bp-music");
    if (!mb || BP._mode !== "play") return innerWidth;
    const r = mb.getBoundingClientRect();
    return r.width ? r.left - Math.max(8, Math.min(innerWidth, innerHeight) * 0.012) : innerWidth;
  };
  BP._feed = feed;
  BP.tv = !!window.BP_TV;
  window.BodyMovin = BP;
  window.BodyPlay = window.BodyMovin;
})();
