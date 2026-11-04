(function() {
  const BP = window.BodyMovin = window.BodyMovin || {};
  const D2R = Math.PI / 180, clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = (k) => k * k * (3 - 2 * k);
  const ACC = ["#6be6ff", "#ffd36b", "#ff86d8"];
  const BASE = { x: 0, y: 0, tilt: 0, side: 0, aL: [10, 6, 1, 1], aR: [10, 6, 1, 1], lL: [4, 2, 1], lR: [4, 2, 1], fist: 1 };
  const P = (o) => Object.assign({}, BASE, o);
  const SH = 9, HIP = 5, TORSO = 30, UA = 16, FA = 15, TH = 22, SN = 22, HR = 7;
  function joints(p) {
    const side = p.side ? 1 : 0, J = {};
    const dir = (a, s) => {
      const t2 = (side ? a : a * s) * D2R;
      return [Math.sin(t2), -Math.cos(t2)];
    };
    const leg = (l, s) => {
      var _a;
      const h = [s * (side ? 0 : HIP), 0], k = dir(l[0], s), f = dir(l[1], s), ts = (_a = l[2]) != null ? _a : 1;
      const kn = [h[0] + k[0] * TH * ts, h[1] + k[1] * TH * ts];
      return [h, kn, [kn[0] + f[0] * SN, kn[1] + f[1] * SN]];
    };
    const LL = leg(p.lL, -1), LR = leg(p.lR, 1);
    const low = Math.min(LL[2][1], LR[2][1]);
    const pel = [p.x, -low + p.y], add = (a, b) => [a[0] + b[0], a[1] + b[1]];
    [["hipL", "kneeL", "footL", LL], ["hipR", "kneeR", "footR", LR]].forEach(([a, b, c, L]) => {
      J[a] = add(pel, L[0]);
      J[b] = add(pel, L[1]);
      J[c] = add(pel, L[2]);
    });
    const t = p.tilt * D2R, up = [Math.sin(t), Math.cos(t)], perp = [Math.cos(t), -Math.sin(t)];
    J.pel = pel;
    J.neck = [pel[0] + up[0] * TORSO, pel[1] + up[1] * TORSO];
    J.head = [J.neck[0] + up[0] * (HR + 3), J.neck[1] + up[1] * (HR + 3)];
    const sc = [pel[0] + up[0] * (TORSO - 3), pel[1] + up[1] * (TORSO - 3)];
    const arm = (a, s) => {
      var _a, _b, _c, _d;
      const sh = side ? sc : [sc[0] + s * perp[0] * SH, sc[1] + s * perp[1] * SH], u = dir(a[0], s), f = dir(a[1], s);
      const el2 = [sh[0] + u[0] * UA * ((_a = a[2]) != null ? _a : 1), sh[1] + u[1] * UA * ((_b = a[2]) != null ? _b : 1)];
      return [sh, el2, [el2[0] + f[0] * FA * ((_c = a[3]) != null ? _c : 1), el2[1] + f[1] * FA * ((_d = a[3]) != null ? _d : 1)]];
    };
    const AL = arm(p.aL, -1), AR = arm(p.aR, 1);
    J.shL = AL[0];
    J.elL = AL[1];
    J.handL = AL[2];
    J.shR = AR[0];
    J.elR = AR[1];
    J.handR = AR[2];
    J.side = side;
    J.fist = p.fist;
    J.p = p;
    return J;
  }
  function lerpPose(a, b, k) {
    const o = {};
    for (const key of Object.keys(BASE)) {
      const va = a[key], vb = b[key];
      if (Array.isArray(va)) o[key] = va.map((v, i) => {
        var _a;
        return v + (((_a = vb[i]) != null ? _a : v) - v) * k;
      });
      else if (typeof va === "number") o[key] = va + (vb - va) * k;
      else o[key] = k < 0.5 ? va : vb;
    }
    return o;
  }
  function sample(A2, t) {
    const K = A2.keys;
    t = (t % 1 + 1) % 1;
    for (let i = 0; i < K.length - 1; i++) if (t >= K[i][0] && t <= K[i + 1][0]) {
      const k = (t - K[i][0]) / Math.max(1e-6, K[i + 1][0] - K[i][0]);
      return joints(lerpPose(K[i][1], K[i + 1][1], ease(k)));
    }
    return joints(K[K.length - 1][1]);
  }
  const STAND = P({}), GUARD = { side: 1, aL: [55, 160, 0.95, 0.9], aR: [45, 165, 0.95, 0.9], lL: [16, 6], lR: [-14, -6] };
  const swingTop = P({ aL: [65, -173], aR: [-109, -109] }), swingAddr = P({ aL: [-17, -17], aR: [-17, -17], lL: [8, 3], lR: [8, 3] }), swingThru = P({ aL: [-109, -109], aR: [65, -173] });
  const A = {
    jog: { dur: 0.8, keys: [
      [0, P({ side: 1, y: 3, lR: [75, -5], lL: [-6, -10], aR: [-35, 55], aL: [35, 125] })],
      [0.5, P({ side: 1, y: 3, lL: [75, -5], lR: [-6, -10], aL: [-35, 55], aR: [35, 125] })],
      [1, P({ side: 1, y: 3, lR: [75, -5], lL: [-6, -10], aR: [-35, 55], aL: [35, 125] })]
    ] },
    kneeup: null,
    jump: { dur: 1.6, fx: "up", keys: [
      [0, STAND],
      [0.18, P({ lL: [40, -18], lR: [40, -18], aL: [35, 30], aR: [35, 30], tilt: 0 })],
      [0.36, P({ y: 16, aL: [160, 172], aR: [160, 172], lL: [6, 0], lR: [6, 0] })],
      [0.5, P({ y: 14, aL: [150, 165], aR: [150, 165], lL: [10, -4], lR: [10, -4] })],
      [0.66, P({ lL: [38, -16], lR: [38, -16], aL: [50, 40], aR: [50, 40] })],
      [0.84, STAND],
      [1, STAND]
    ] },
    squat: { dur: 1.9, fx: "down", keys: [
      [0, STAND],
      [0.12, STAND],
      [0.38, P({ lL: [68, -22], lR: [68, -22], aL: [80, 80, 0.4, 0.4], aR: [80, 80, 0.4, 0.4] })],
      [0.66, P({ lL: [68, -22], lR: [68, -22], aL: [80, 80, 0.4, 0.4], aR: [80, 80, 0.4, 0.4] })],
      [0.9, STAND],
      [1, STAND]
    ] },
    step: { dur: 2.6, fx: "side", keys: [
      [0, STAND],
      [0.1, P({ x: -8, lL: [22, 18] })],
      [0.2, P({ x: -18 })],
      [0.4, P({ x: -18 })],
      [0.5, P({ x: -2, lR: [22, 18] })],
      [0.6, P({ x: 18 })],
      [0.8, P({ x: 18 })],
      [0.9, P({ x: 6, lL: [20, 16] })],
      [1, STAND]
    ] },
    lean: { dur: 2.6, fx: "lean", keys: [
      [0, STAND],
      [0.12, STAND],
      [0.3, P({ tilt: -20, aL: [14, 10], aR: [4, 2] })],
      [0.45, P({ tilt: -20, aL: [14, 10], aR: [4, 2] })],
      [0.62, P({ tilt: 20, aR: [14, 10], aL: [4, 2] })],
      [0.8, P({ tilt: 20, aR: [14, 10], aL: [4, 2] })],
      [0.95, STAND],
      [1, STAND]
    ] },
    punch: { dur: 1.3, fx: "hitR", keys: [
      [0, P(GUARD)],
      [0.12, P(GUARD)],
      [0.24, P({ ...GUARD, tilt: 8, aR: [90, 90] })],
      [0.36, P({ ...GUARD, tilt: 8, aR: [90, 90] })],
      [0.5, P(GUARD)],
      [0.62, P({ ...GUARD, tilt: 8, aL: [90, 90] })],
      [0.74, P({ ...GUARD, tilt: 8, aL: [90, 90] })],
      [0.88, P(GUARD)],
      [1, P(GUARD)]
    ] },
    push: { dur: 1.5, fx: "hitR", keys: [
      [0, P({ side: 1, aL: [40, 150, 1, 0.9], aR: [40, 150, 1, 0.9] })],
      [0.2, P({ side: 1, aL: [40, 150, 1, 0.9], aR: [40, 150, 1, 0.9] })],
      [0.38, P({ side: 1, tilt: 6, aL: [88, 92], aR: [88, 92], lL: [14, 4], lR: [-10, -4] })],
      [0.6, P({ side: 1, tilt: 6, aL: [88, 92], aR: [88, 92], lL: [14, 4], lR: [-10, -4] })],
      [0.85, P({ side: 1, aL: [40, 150, 1, 0.9], aR: [40, 150, 1, 0.9] })],
      [1, P({ side: 1, aL: [40, 150, 1, 0.9], aR: [40, 150, 1, 0.9] })]
    ] },
    kick: { dur: 1.5, fx: "kick", keys: [
      [0, P({ side: 1, aL: [-10, -10], aR: [20, 30] })],
      [0.15, P({ side: 1, aL: [-10, -10], aR: [20, 30], lR: [-25, -40] })],
      [0.32, P({ side: 1, tilt: -10, aL: [-25, -20], aR: [40, 50], lR: [80, 75] })],
      [0.45, P({ side: 1, tilt: -10, aL: [-25, -20], aR: [40, 50], lR: [80, 75] })],
      [0.65, P({ side: 1, aL: [-10, -10], aR: [20, 30] })],
      [1, P({ side: 1, aL: [-10, -10], aR: [20, 30] })]
    ] },
    bowl: { dur: 2.4, fx: "bowl", keys: [
      [0, P({ side: 1, aR: [25, 120], aL: [25, 110] })],
      [0.12, P({ side: 1, aR: [25, 120], aL: [25, 110] })],
      [0.38, P({ side: 1, tilt: 10, aR: [-75, -75], aL: [35, 40], lL: [20, 0], lR: [-12, -10] })],
      [0.55, P({ side: 1, tilt: 22, aR: [70, 80], aL: [-30, -30], lL: [35, -8], lR: [-35, -25] })],
      [0.7, P({ side: 1, tilt: 14, aR: [140, 150], aL: [-30, -30], lL: [30, -6], lR: [-30, -20] })],
      [0.86, P({ side: 1, tilt: 14, aR: [140, 150], aL: [-30, -30], lL: [30, -6], lR: [-30, -20] })],
      [1, P({ side: 1, aR: [25, 120], aL: [25, 110] })]
    ] },
    swing2: { dur: 2.6, fx: "golf", keys: [[0, swingAddr], [0.12, swingAddr], [0.42, swingTop], [0.52, swingTop], [0.62, swingAddr], [0.74, swingThru], [0.88, swingThru], [1, swingAddr]] },
    bat: { dur: 2.2, fx: "bat", keys: [
      [0, P({ aL: [60, -170, 0.9, 0.8], aR: [-60, -150, 0.9, 0.9], lL: [12, 4], lR: [12, 4] })],
      [0.25, P({ aL: [60, -170, 0.9, 0.8], aR: [-60, -150, 0.9, 0.9], lL: [12, 4], lR: [12, 4] })],
      [0.45, P({ aL: [-80, -85], aR: [80, 85], lL: [12, 4], lR: [12, 4], tilt: 6 })],
      [0.6, P({ aL: [-150, -170, 0.9, 0.8], aR: [60, 170, 0.9, 0.8], lL: [12, 4], lR: [12, 4], tilt: 8 })],
      [0.8, P({ aL: [-150, -170, 0.9, 0.8], aR: [60, 170, 0.9, 0.8], lL: [12, 4], lR: [12, 4], tilt: 8 })],
      [1, P({ aL: [60, -170, 0.9, 0.8], aR: [-60, -150, 0.9, 0.9], lL: [12, 4], lR: [12, 4] })]
    ] },
    point: { dur: 2.8, fx: "aim", keys: [[0, P({ aR: [112, 112] })], [0.3, P({ aR: [112, 112] })], [0.45, P({ aR: [135, 135] })], [0.75, P({ aR: [135, 135] })], [0.9, P({ aR: [112, 112] })], [1, P({ aR: [112, 112] })]] },
    raise: { dur: 1.8, fx: "spark", keys: [[0, STAND], [0.15, STAND], [0.42, P({ aL: [168, 176], aR: [168, 176] })], [0.75, P({ aL: [168, 176], aR: [168, 176] })], [0.95, STAND], [1, STAND]] },
    reach: { dur: 2.6, fx: "touch", keys: [
      [0, STAND],
      [0.22, P({ tilt: 8, aR: [138, 140] })],
      [0.36, P({ tilt: 8, aR: [138, 140] })],
      [0.5, STAND],
      [0.72, P({ tilt: -8, aL: [138, 140] })],
      [0.86, P({ tilt: -8, aL: [138, 140] })],
      [1, STAND]
    ] },
    starjump: { dur: 1.1, keys: [
      [0, STAND],
      [0.35, P({ y: 6, aL: [150, 158], aR: [150, 158], lL: [26, 26], lR: [26, 26] })],
      [0.5, P({ y: 2, aL: [150, 158], aR: [150, 158], lL: [26, 26], lR: [26, 26] })],
      [0.85, STAND],
      [1, STAND]
    ] },
    // spin (Summit Send, Matt 10/21): one hand straight up, the other straight down, held; then arms level to land
    spin: { dur: 2.8, fx: "spark", keys: [
      [0, P({ aL: [90, 92], aR: [90, 92] })],
      [0.12, P({ aL: [90, 92], aR: [90, 92] })],
      [0.3, P({ aR: [168, 176], aL: [8, 4] })],
      [0.62, P({ aR: [168, 176], aL: [8, 4] })],
      [0.8, P({ aL: [90, 92], aR: [90, 92] })],
      [1, P({ aL: [90, 92], aR: [90, 92] })]
    ] },
    armsout: { dur: 2.2, fx: "wide", keys: [[0, STAND], [0.3, P({ aL: [90, 92], aR: [90, 92], lL: [12, 8], lR: [12, 8] })], [0.8, P({ aL: [90, 92], aR: [90, 92], lL: [12, 8], lR: [12, 8] })], [1, STAND]] },
    swipe: { dur: 1.6, fx: "trail", keys: [
      [0, P({ aR: [-130, -130] })],
      [0.1, P({ aR: [-130, -130] })],
      [0.3, P({ aR: [55, 55], tilt: 6 })],
      [0.45, P({ aR: [20, 10], aL: [-130, -130] })],
      [0.55, P({ aL: [-130, -130] })],
      [0.75, P({ aL: [55, 55], tilt: -6 })],
      [0.9, P({ aR: [-130, -130] })],
      [1, P({ aR: [-130, -130] })]
    ] },
    flap: { dur: 1.2, fx: "wings", keys: [[0, P({ y: 10, aL: [140, 150], aR: [140, 150] })], [0.4, P({ y: 14, aL: [55, 50], aR: [55, 50] })], [0.6, P({ y: 14, aL: [55, 50], aR: [55, 50] })], [1, P({ y: 10, aL: [140, 150], aR: [140, 150] })]] },
    hug: { dur: 2, keys: [[0, P({ aL: [100, 110], aR: [100, 110] })], [0.35, P({ aL: [70, -40, 1, 0.9], aR: [70, -40, 1, 0.9] })], [0.65, P({ aL: [70, -40, 1, 0.9], aR: [70, -40, 1, 0.9] })], [1, P({ aL: [100, 110], aR: [100, 110] })]] },
    whack: { dur: 1.3, fx: "whack", keys: [
      [0, P({ aR: [150, 165] })],
      [0.25, P({ aR: [165, 178], tilt: -4 })],
      [0.42, P({ aR: [55, 30], tilt: 10, lL: [12, 4], lR: [12, 4] })],
      [0.6, P({ aR: [55, 30], tilt: 10, lL: [12, 4], lR: [12, 4] })],
      [1, P({ aR: [150, 165] })]
    ] },
    circle: { dur: 1.6, fx: "circle", keys: [[0, P({ aR: [55, 105] })], [0.25, P({ aR: [80, 135] })], [0.5, P({ aR: [100, 100] })], [0.75, P({ aR: [75, 65] })], [1, P({ aR: [55, 105] })]] }
  };
  A.climb = { dur: 1.4, keys: [[0, P({ aL: [165, 175], aR: [40, 120] })], [0.45, P({ aR: [165, 175], aL: [40, 120] })], [0.5, P({ aR: [165, 175], aL: [40, 120] })], [0.95, P({ aL: [165, 175], aR: [40, 120] })], [1, P({ aL: [165, 175], aR: [40, 120] })]] };
  A.throw = Object.assign({}, A.whack, { fx: "throw" });
  A.kneeup = A.jog;
  A.golf = A.swing2;
  A.swing = A.bowl;
  A.aim = A.point;
  A.touch = A.reach;
  A.jumpingjack = A.starjump;
  A.slash = A.swipe;
  A.punchR = A.punch;
  const PROPS = { aim: [[52, 74], [40, 108]], touch: [[-36, 104], [36, 104]], up: [[30, 44]], down: [[30, 70]], golf: [[42, 40]], bowl: [[50, 5]], whack: [[30, 0]], lean: [[30, 104], [-30, 104]], kick: [[50, 40]] };
  function bounds(an) {
    let x0 = -26, x1 = 26, y1 = 100;
    for (let i = 0; i < 24; i++) {
      const J = sample(an, i / 24);
      for (const k of ["head", "handL", "handR", "footL", "footR", "kneeL", "kneeR", "elL", "elR"]) {
        const p = J[k];
        x0 = Math.min(x0, p[0] - 7);
        x1 = Math.max(x1, p[0] + 7);
        y1 = Math.max(y1, p[1] + (k === "head" ? 8 : 6));
      }
    }
    for (const p of PROPS[an.fx] || []) {
      x0 = Math.min(x0, p[0] - 9);
      x1 = Math.max(x1, p[0] + 9);
      y1 = Math.max(y1, p[1] + 9);
    }
    if (an.fx === "golf" || an.fx === "bat") {
      x0 -= 12;
      x1 += 12;
      y1 += 12;
    }
    const m = Math.max(-x0, x1);
    return [-m, 0, m, y1];
  }
  function hexA(h, a) {
    const n = parseInt(h.slice(1), 16);
    return "rgba(".concat(n >> 16, ",").concat(n >> 8 & 255, ",").concat(n & 255, ",").concat(a, ")");
  }
  function draw(cv, name, t, col) {
    const an = A[name] || A.raise, ctx = cv.getContext("2d"), w = cv.width, h = cv.height;
    ctx.clearRect(0, 0, w, h);
    const B = an._b || (an._b = bounds(an)), s = Math.min(w / (B[2] - B[0] + 16), h / (B[3] + 14)), ox = w / 2 - (B[0] + B[2]) / 2 * s, oy = h - 7 * s;
    const X = (p) => [ox + p[0] * s, oy - p[1] * s];
    const ph = t / an.dur % 1, J = sample(an, t / an.dur);
    const air = J.p.y, shw = (26 - air * 0.6) * s;
    let g = ctx.createRadialGradient(ox + J.pel[0] * s, oy, 0, ox + J.pel[0] * s, oy, shw);
    g.addColorStop(0, "rgba(0,0,0,0.55)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(ox + J.pel[0] * s, oy, shw, shw * 0.22, 0, 0, 6.283);
    ctx.fill();
    ctx.strokeStyle = hexA(col, 0.35);
    ctx.lineWidth = Math.max(1, 1.2 * s);
    ctx.beginPath();
    ctx.moveTo(w * 0.1, oy);
    ctx.lineTo(w * 0.9, oy);
    ctx.stroke();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const line = (pts, lw, c) => {
      ctx.strokeStyle = c;
      ctx.lineWidth = lw;
      ctx.beginPath();
      pts.forEach((p, i) => {
        const q = X(p);
        i ? ctx.lineTo(...q) : ctx.moveTo(...q);
      });
      ctx.stroke();
    };
    const arrow = (a, b, c) => {
      const A2 = X(a), B2 = X(b), an2 = Math.atan2(B2[1] - A2[1], B2[0] - A2[0]), hl = 6 * s;
      ctx.strokeStyle = c;
      ctx.fillStyle = c;
      ctx.lineWidth = 2.6 * s;
      ctx.beginPath();
      ctx.moveTo(...A2);
      ctx.lineTo(B2[0] - Math.cos(an2) * hl * 0.6, B2[1] - Math.sin(an2) * hl * 0.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(...B2);
      ctx.lineTo(B2[0] - Math.cos(an2 - 0.55) * hl, B2[1] - Math.sin(an2 - 0.55) * hl);
      ctx.lineTo(B2[0] - Math.cos(an2 + 0.55) * hl, B2[1] - Math.sin(an2 + 0.55) * hl);
      ctx.closePath();
      ctx.fill();
    };
    const burst = (p, k, c) => {
      if (k <= 0) return;
      const q = X(p);
      ctx.strokeStyle = hexA(c, k);
      ctx.lineWidth = 2.2 * s;
      for (let i = 0; i < 8; i++) {
        const a = i * 0.785, r0 = (6 + 5 * (1 - k)) * s, r1 = r0 + 6 * s * k;
        ctx.beginPath();
        ctx.moveTo(q[0] + Math.cos(a) * r0, q[1] + Math.sin(a) * r0);
        ctx.lineTo(q[0] + Math.cos(a) * r1, q[1] + Math.sin(a) * r1);
        ctx.stroke();
      }
    };
    const fx = an.fx, hand = J.handR, faint = hexA(col, 0.8);
    if (fx === "trail" || fx === "circle" || fx === "throw" || fx === "wings" || fx === "golf" || fx === "bat" || fx === "bowl") {
      for (let i = 8; i >= 1; i--) {
        const Jp = sample(an, (t - i * 0.03) / an.dur), hp = fx === "trail" ? ph > 0.5 ? Jp.handL : Jp.handR : Jp.handR;
        if (fx === "circle" && i > 6) continue;
        if (fx === "wings") {
          const q2 = X(Jp.handL);
          ctx.fillStyle = hexA(col, 0.32 * (1 - i / 9));
          ctx.beginPath();
          ctx.arc(q2[0], q2[1], (4.5 - i * 0.3) * s, 0, 6.283);
          ctx.fill();
        }
        const q = X(hp);
        ctx.fillStyle = hexA(col, 0.32 * (1 - i / 9));
        ctx.beginPath();
        ctx.arc(q[0], q[1], (4.5 - i * 0.3) * s, 0, 6.283);
        ctx.fill();
      }
    }
    if (fx === "up" && ph > 0.1 && ph < 0.42) arrow([30, 12], [30, 44], faint);
    if (fx === "down" && ph > 0.15 && ph < 0.6) arrow([30, 70], [30, 40], faint);
    if (fx === "side") {
      const dirn = ph < 0.45 ? -1 : 1;
      arrow([J.pel[0] - dirn * 4, 4], [J.pel[0] + dirn * 26, 4], faint);
    }
    if (fx === "lean" && (ph > 0.15 && ph < 0.45 || ph > 0.5 && ph < 0.8)) {
      const d = ph < 0.5 ? -1 : 1;
      arrow([d * 6, 100], [d * 30, 92], faint);
    }
    if (fx === "wide" && ph > 0.25 && ph < 0.8) {
      arrow([-34, 76], [-50, 76], faint);
      arrow([34, 76], [50, 76], faint);
    }
    if (fx === "aim") {
      const tg = ph < 0.4 || ph > 0.85 ? [52, 74] : [40, 108], q = X(tg), hq = X(hand);
      ctx.setLineDash([3 * s, 4 * s]);
      ctx.strokeStyle = hexA(col, 0.7);
      ctx.lineWidth = 1.6 * s;
      ctx.beginPath();
      ctx.moveTo(...hq);
      ctx.lineTo(...q);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = col;
      ctx.lineWidth = 2.2 * s;
      ctx.beginPath();
      ctx.arc(q[0], q[1], 7 * s, 0, 6.283);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(q[0], q[1], 2 * s, 0, 6.283);
      ctx.fillStyle = col;
      ctx.fill();
      const hit = ph > 0.2 && ph < 0.3 ? (ph - 0.2) / 0.1 : ph > 0.6 && ph < 0.7 ? (ph - 0.6) / 0.1 : 0;
      burst(tg, hit ? 1 - hit : 0, col);
    }
    if (fx === "touch") {
      const left = ph > 0.5, tg = left ? [-36, 104] : [36, 104], q = X(tg), on = left ? ph > 0.7 && ph < 0.88 : ph > 0.2 && ph < 0.38;
      ctx.fillStyle = hexA(col, on ? 0.6 : 0.25);
      ctx.strokeStyle = col;
      ctx.lineWidth = 2 * s;
      ctx.beginPath();
      ctx.arc(q[0], q[1], 7 * s, 0, 6.283);
      ctx.fill();
      ctx.stroke();
    }
    if (fx === "golf") {
      const k = ph > 0.62 && ph < 0.95 ? (ph - 0.62) / 0.33 : -1, b = k < 0 ? [8, 2] : [8 + k * 34, 2 + Math.sin(k * 3.1) * 40];
      const q = X(b);
      if (k < 0.95) {
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(q[0], q[1], 2.6 * s, 0, 6.283);
        ctx.fill();
      }
    }
    const limbs = [[J.shL, J.elL, J.handL], [J.shR, J.elR, J.handR], [J.hipL, J.kneeL, J.footL], [J.hipR, J.kneeR, J.footR]];
    const far = J.side ? [0, 2] : [];
    const LW = 7.5 * s;
    ctx.shadowColor = hexA(col, 0.75);
    for (const pass of [0, 1]) {
      const c = pass ? "#ffffff" : "rgba(5,10,25,0.85)", lw = pass ? LW : LW + 4 * s;
      ctx.shadowBlur = pass ? 5 * s : 0;
      limbs.forEach((L, i) => {
        if (far.includes(i)) line(L, lw, pass ? hexA("#c8d4ee", 1) : c);
      });
      line([J.pel, J.neck], lw * 1.25, c);
      if (!J.side) {
        line([J.shL, J.shR], lw, c);
        line([J.hipL, J.hipR], lw, c);
      }
      limbs.forEach((L, i) => {
        if (!far.includes(i)) line(L, lw, c);
      });
      const hq = X(J.head);
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(hq[0], hq[1], HR * s + (pass ? 0 : 2 * s), 0, 6.283);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    for (const hp of [J.handL, J.handR]) {
      const q = X(hp), r = 5 * s;
      const gg = ctx.createRadialGradient(q[0], q[1], 0, q[0], q[1], r * 1.8);
      gg.addColorStop(0, hexA(col, 0.95));
      gg.addColorStop(1, hexA(col, 0));
      ctx.fillStyle = gg;
      ctx.beginPath();
      ctx.arc(q[0], q[1], r * 1.8, 0, 6.283);
      ctx.fill();
    }
    if (fx === "golf" || fx === "bat") {
      const mid = [(J.handL[0] + J.handR[0]) / 2, (J.handL[1] + J.handR[1]) / 2], sm = [(J.shL[0] + J.shR[0]) / 2, (J.shL[1] + J.shR[1]) / 2];
      const d = [mid[0] - sm[0], mid[1] - sm[1]], n = Math.hypot(...d) || 1, len = fx === "golf" ? 34 : 30, tip2 = [mid[0] + d[0] / n * len, mid[1] + d[1] / n * len];
      line([mid, tip2], 3 * s, "#e8eefc");
      if (fx === "golf") {
        const q = X(tip2);
        ctx.fillStyle = "#e8eefc";
        ctx.beginPath();
        ctx.arc(q[0], q[1], 3 * s, 0, 6.283);
        ctx.fill();
      }
    }
    if (fx === "bowl") {
      const rel = ph > 0.55 && ph < 0.95, k = rel ? (ph - 0.55) / 0.4 : 0, b = rel ? [20 + k * 32, 5] : hand, q = X(b);
      if (!rel || k < 0.9) {
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(q[0], q[1], 5 * s, 0, 6.283);
        ctx.fill();
        ctx.strokeStyle = "rgba(5,10,25,0.8)";
        ctx.lineWidth = 1.2 * s;
        ctx.stroke();
      }
    }
    if (fx === "hitR") {
      const k = ph > 0.24 && ph < 0.42 ? 1 - (ph - 0.24) / 0.18 : ph > 0.62 && ph < 0.8 && an !== A.push ? 1 - (ph - 0.62) / 0.18 : 0;
      const hp = ph > 0.55 && an !== A.push ? J.handL : J.handR;
      burst([hp[0] + 4, hp[1]], k, col);
    }
    if (fx === "whack") {
      const k = ph > 0.42 && ph < 0.62 ? 1 - (ph - 0.42) / 0.2 : 0;
      const q = X([J.handR[0] + 6, -2]);
      ctx.fillStyle = "#6b4a2e";
      ctx.beginPath();
      ctx.ellipse(q[0], q[1], 13 * s, 4 * s, 0, 0, 6.283);
      ctx.fill();
      burst([J.handR[0], J.handR[1] - 3], k, col);
    }
    if (fx === "kick") {
      const k = ph > 0.3 && ph < 0.5 ? 1 - (ph - 0.3) / 0.2 : 0;
      burst([J.footR[0] + 4, J.footR[1]], k, col);
    }
    if (fx === "spark" && ph > 0.4 && ph < 0.8) {
      for (const hp of [J.handL, J.handR]) burst([hp[0], hp[1] + 3], 0.7, col);
    }
  }
  const CSS = '\n  .bph-wrap{position:fixed;left:0;right:0;z-index:7;display:flex;align-items:center;justify-content:center;pointer-events:none;\n    font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display",system-ui,"Segoe UI",Roboto,sans-serif;transition:opacity .7s ease,transform .7s ease}\n  .bph-wrap.bph-mounted{position:relative;left:auto;right:auto;top:auto!important;height:auto!important;margin:1.2vmin auto}\n  .bph-wrap.bph-gone{opacity:0;transform:scale(.96)}\n  .bph-card{box-sizing:border-box;max-width:min(94vw,1180px);padding:2.6vmin 3.6vmin 2.8vmin;border-radius:3.4vmin;color:#fff;text-align:center;\n    background:linear-gradient(180deg,rgba(18,22,44,.9),rgba(8,10,24,.92));border:1px solid rgba(255,255,255,.16);\n    box-shadow:0 2.4vmin 7vmin rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.12);-webkit-backdrop-filter:blur(16px) saturate(1.3);backdrop-filter:blur(16px) saturate(1.3)}\n  .bph-head{font-weight:800;font-size:max(13px,2.2vmin);letter-spacing:.32em;color:rgba(200,215,255,.8);margin:0 0 1.4vmin;line-height:1}\n  .bph-title{font-weight:900;font-size:max(30px,7.6vmin);line-height:1.02;letter-spacing:.01em;margin:0 0 2vmin;text-shadow:0 0 3vmin rgba(130,200,255,.35)}\n  .bph-moves{display:flex;gap:2.4vmin;justify-content:center;align-items:stretch}\n  .bph-move{flex:1 1 0;min-width:0;max-width:38vmin;display:flex;flex-direction:column;align-items:center;background:rgba(255,255,255,.055);\n    border:1px solid rgba(255,255,255,.10);border-radius:2.4vmin;padding:1.4vmin 1.6vmin 2vmin}\n  .bph-wrap canvas,.bph-tip canvas{position:static!important;top:auto!important;right:auto!important;bottom:auto!important;left:auto!important;transform:none!important;z-index:auto!important;margin:0!important;max-width:none!important;max-height:none!important;display:block!important;flex:none}\n  .bph-move canvas{width:24vmin!important;height:24vmin!important}\n  .bph-txt{font-weight:800;font-size:max(19px,4vmin);line-height:1.16;margin-top:.6vmin;text-wrap:balance}\n  .bph-n{display:inline-block;min-width:1.5em;height:1.5em;line-height:1.5em;border-radius:50%;font-size:.62em;font-weight:900;color:#08101e;margin-right:.45em;vertical-align:.18em}\n  .bph-compact .bph-card{padding:1.4vmin 2.4vmin 1.6vmin}\n  .bph-compact .bph-title{font-size:max(24px,5.6vmin);margin-bottom:1.2vmin}\n  .bph-compact .bph-move{flex-direction:row;text-align:left;max-width:46vmin;padding:.8vmin 1.8vmin .8vmin .8vmin}\n  .bph-compact .bph-move canvas{width:14vmin!important;height:14vmin!important}\n  .bph-compact .bph-txt{font-size:max(16px,3vmin);margin:0 0 0 1.2vmin}\n  .bph-compact .bph-you{margin-top:1.2vmin;font-size:max(14px,2.6vmin)}\n  .bph-you{margin-top:2vmin;font-weight:800;font-size:max(16px,3.3vmin);color:#ffe08a}\n  .bph-you:before{content:"";display:inline-block;width:.55em;height:.55em;border-radius:50%;background:#ffe08a;box-shadow:0 0 1.2vmin #ffcf55;margin-right:.55em;vertical-align:.1em}\n  .bph-tip{position:fixed;z-index:7;display:flex;align-items:center;gap:1.2vmin;padding:1vmin 2.2vmin 1vmin 1vmin;border-radius:2.2vmin;pointer-events:none;\n    background:rgba(8,10,24,.9);border:1px solid rgba(255,255,255,.16);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:#fff;\n    font:800 max(15px,3vmin)/1.15 -apple-system,BlinkMacSystemFont,system-ui,sans-serif;transition:opacity .8s ease;opacity:0}\n  .bph-tip canvas{width:11vmin!important;height:11vmin!important}\n  @media (max-aspect-ratio:4/5){\n    .bph-card{padding:4vw 4.5vw 4.5vw;border-radius:5vw;width:94vw}\n    .bph-title{font-size:10.5vw;margin-bottom:3vw}\n    .bph-head{font-size:3.2vw}\n    .bph-moves{flex-direction:column;gap:2.6vw}\n    .bph-move{max-width:none;flex-direction:row;padding:2vw 3vw 2vw 1.6vw;border-radius:4vw;text-align:left}\n    .bph-move canvas{width:27vw!important;height:27vw!important}\n    .bph-txt{font-size:6.2vw;margin:0 0 0 3vw}\n    .bph-you{font-size:5vw;margin-top:3.4vw}\n    .bph-tip{font-size:4.4vw}\n    .bph-compact .bph-move{max-width:none}\n    .bph-compact .bph-txt{font-size:4.8vw}\n    .bph-compact .bph-title{font-size:8vw}\n    .bph-compact .bph-you{font-size:4vw}\n    .bph-compact .bph-move canvas{width:18vw!important;height:18vw!important}\n    .bph-tip canvas{width:16vw!important;height:16vw!important}\n  }\n  .bph-side .bph-card{max-width:100%;padding:2vmin 2.6vmin 2.2vmin}\n  .bph-side .bph-title{font-size:max(26px,6vmin);margin-bottom:1.6vmin}\n  .bph-side .bph-moves{flex-direction:column;gap:1.4vmin}\n  .bph-side .bph-move{max-width:none;flex-direction:row;text-align:left;padding:.8vmin 2vmin .8vmin .8vmin}\n  .bph-side .bph-move canvas{width:13vmin!important;height:13vmin!important}\n  .bph-side .bph-txt{font-size:max(17px,3.3vmin);margin:0 0 0 1.6vmin}\n  .bph-side .bph-you{margin-top:1.6vmin;font-size:max(15px,2.8vmin)}\n  .bph-tip{position:fixed!important;left:50%!important;right:auto!important;top:auto!important;bottom:max(1vmin,6px,env(safe-area-inset-bottom))!important;transform:translateX(-50%)!important;z-index:7;display:block!important;max-width:60vw;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:.28em .9em .32em!important;border-radius:999px!important;background:rgba(6,8,18,.9)!important;border:1px solid rgba(255,255,255,.2)!important;color:#fff;font:800 max(15px,min(28px,2.5vmin)) -apple-system,system-ui,sans-serif!important;pointer-events:none;opacity:0;transition:opacity .4s}\n  .bph-tip canvas{display:none!important}';
  let cfg = null, wrap = null, tip = null, canvases = [], tipCv = null, gone = false, raf = 0, t0 = 0, tipUntil = 0, sawTitle = false;
  const START_STATES = /^(title|menu|ready|pick|select|attract)$/i;
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  }
  function sizeCanvas(cv) {
    const r = cv.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
    const w = Math.round(r.width * d), h = Math.round(r.height * d);
    if (w && (cv.width !== w || cv.height !== h)) {
      cv.width = w;
      cv.height = h;
    }
  }
  function loop(now) {
    raf = 0;
    const t = (now - t0) / 1e3;
    if (wrap && !gone) for (const [cv, m, col] of canvases) {
      sizeCanvas(cv);
      draw(cv, m.anim, t, col);
    }
    autoHide();
    if (wrap && !gone || tip && now < tipUntil + 900) raf = requestAnimationFrame(loop);
    else if (tip) {
      tip.remove();
      tip = null;
    }
  }
  function kick() {
    if (!raf) raf = requestAnimationFrame(loop);
  }
  function autoHide() {
    if (gone || !wrap) return;
    const g = window.__game, s = g && g.state != null ? String(g.state) : null;
    if (s != null) {
      if (START_STATES.test(s)) sawTitle = true;
      else if (sawTitle && !/load/i.test(s)) return hide();
    }
    if (cfg.mount) {
      let e = wrap, vis = wrap.getBoundingClientRect().width > 0;
      while (vis && e && e !== document.body) {
        const cs = getComputedStyle(e);
        if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity < 0.05) vis = false;
        e = e.parentElement;
      }
      if (!vis && sawMountVisible) return hide();
      if (vis) sawMountVisible = true;
    }
  }
  let sawMountVisible = false;
  function layout() {
    var _a, _b, _c, _d;
    if (!wrap || cfg.mount) return;
    const sideOn = !!cfg.side && innerWidth > innerHeight * 1.05, P2 = !sideOn && cfg.portrait && innerWidth <= innerHeight ? cfg.portrait : null;
    wrap.classList.toggle("bph-side", sideOn);
    wrap.style.left = sideOn ? cfg.side === "left" ? "1.6vw" : "auto" : "";
    wrap.style.right = sideOn ? cfg.side === "right" ? "1.6vw" : "auto" : "";
    wrap.style.width = sideOn ? (cfg.width || 0.42) * 100 + "vw" : "";
    const top = (_b = (_a = P2 && P2.top) != null ? _a : cfg.top) != null ? _b : 0.04, bot = (_d = (_c = P2 && P2.bottom) != null ? _c : cfg.bottom) != null ? _d : 0.76;
    wrap.style.top = top * 100 + "vh";
    wrap.style.height = (bot - top) * 100 + "vh";
    const card = wrap.firstChild;
    card.style.transform = "";
    const r = card.getBoundingClientRect(), room = (bot - top) * innerHeight;
    const roomW = sideOn ? (cfg.width || 0.42) * innerWidth : innerWidth;
    if (r.height > room || r.width > roomW) {
      card.style.transform = "scale(".concat(Math.max(0.55, Math.min(room / r.height, roomW / r.width)), ")");
    }
  }
  function howTo(o) {
    cfg = Object.assign({ corner: "bl" }, o || {});
    cfg.moves = (cfg.moves || []).slice(0, 3);
    if (!document.getElementById("bph-css")) {
      const st = el("style");
      st.id = "bph-css";
      st.textContent = CSS;
      document.head.appendChild(st);
    }
    if (wrap) wrap.remove();
    restoreEls();
    wrap = el("div", "bph-wrap" + (cfg.compact ? " bph-compact" : ""));
    const card = el("div", "bph-card");
    wrap.appendChild(card);
    card.appendChild(el("div", "bph-head", "HOW TO PLAY"));
    if (cfg.title) card.appendChild(el("div", "bph-title", esc(cfg.title)));
    const mv = el("div", "bph-moves");
    card.appendChild(mv);
    canvases = [];
    cfg.moves.forEach((m, i) => {
      const b = el("div", "bph-move"), cv = el("canvas"), col = m.color || ACC[i % 3];
      const tx = el("div", "bph-txt", (cfg.moves.length > 1 ? '<span class="bph-n" style="background:'.concat(col, '">').concat(i + 1, "</span>") : "") + esc(m.text));
      b.style.borderColor = hexA(col, 0.35);
      b.appendChild(cv);
      b.appendChild(tx);
      mv.appendChild(b);
      canvases.push([cv, m, col]);
    });
    if (cfg.you) card.appendChild(el("div", "bph-you", esc(cfg.you)));
    const mount = typeof cfg.mount === "string" ? document.querySelector(cfg.mount) : cfg.mount;
    if (mount) {
      cfg.mount = mount;
      wrap.classList.add("bph-mounted");
      if (cfg.before) mount.insertBefore(wrap, typeof cfg.before === "string" ? mount.querySelector(cfg.before) : cfg.before);
      else mount.appendChild(wrap);
    } else (document.body || document.documentElement).appendChild(wrap);
    if (cfg.hideEls) for (const e of (mount || document).querySelectorAll(cfg.hideEls)) {
      if (wrap.contains(e)) continue;
      hiddenEls.push([e, e.style.display]);
      e.style.display = "none";
    }
    gone = false;
    sawTitle = false;
    sawMountVisible = false;
    t0 = performance.now();
    layout();
    requestAnimationFrame(layout);
    kick();
    return wrap;
  }
  let hiddenEls = [];
  function restoreEls() {
    for (const [e, d] of hiddenEls) e.style.display = d;
    hiddenEls = [];
  }
  function hide() {
    BP.inPlay = true;
    if (!wrap || gone) return;
    gone = true;
    wrap.classList.add("bph-gone");
    setTimeout(() => {
      if (gone) restoreEls();
    }, 900);
    const w = wrap;
    setTimeout(() => {
      if (gone && w) w.style.display = "none";
    }, 750);
    if (cfg.corner && cfg.moves[0]) {
      if (tip) tip.remove();
      tip = el("div", "bph-tip", esc(cfg.moves[0].tip || cfg.moves[0].text));
      tipCv = null;
      document.body.appendChild(tip);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (tip) tip.style.opacity = 1;
      }));
      const ms = Math.min(3e3, cfg.tipMs || 3e3);
      tipUntil = performance.now() + ms;
      setTimeout(() => {
        if (tip) tip.style.opacity = 0;
      }, ms);
    }
    kick();
  }
  function show() {
    if (!wrap) return;
    gone = false;
    wrap.style.display = "";
    requestAnimationFrame(() => wrap && wrap.classList.remove("bph-gone"));
    sawTitle = false;
    layout();
    kick();
  }
  howTo.hide = hide;
  howTo.show = show;
  howTo.anims = Object.keys(A);
  howTo.draw = draw;
  Object.defineProperty(howTo, "visible", { get: () => !!wrap && !gone });
  addEventListener("resize", () => {
    layout();
  });
  BP.howTo = howTo;
})();
