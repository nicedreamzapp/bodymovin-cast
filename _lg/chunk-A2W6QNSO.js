import {
  CanvasTexture,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  SRGBColorSpace,
  Sprite,
  SpriteMaterial,
  Vector3
} from "./chunk-4IYDSAYK.js";

// dist/bodyfig.js
var Q2 = {
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
};
var clamp = (v, a, b) => Math.max(a, Math.min(b, v));
var clampDir = (d, ref, max) => {
  const a = Math.atan2(Q2.cross(ref, d), Q2.dot(ref, d));
  return Q2.rot(ref, clamp(a, -max, max));
};
var PR = { up: 0.6, fore: 0.52, hand: 0.36, thigh: 0.95, shin: 0.88, head: 0.52, headW: 0.41, chin: 0.2 };
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
function jointFilter(minCut = 2.2, beta = 1.6, dCut = 1.2, spike = 0.32) {
  let x = null, dx = [0, 0], tp = 0, held = 0;
  const al = (c, dt) => 1 / (1 + 1 / (2 * Math.PI * c * dt));
  return (v, t, scale) => {
    if (!v) return x;
    if (x === null) {
      x = v.slice();
      tp = t;
      return x;
    }
    const dt = Math.max(8e-3, Math.min(0.2, (t - tp) / 1e3));
    tp = t;
    if (Math.hypot(v[0] - x[0], v[1] - x[1]) > spike * scale && held < 1) {
      held++;
      return x;
    }
    held = 0;
    const ad = al(dCut, dt);
    dx = [dx[0] + ad * ((v[0] - x[0]) / dt - dx[0]), dx[1] + ad * ((v[1] - x[1]) / dt - dx[1])];
    const a = al(minCut + beta * Math.hypot(dx[0], dx[1]), dt);
    x = [x[0] + a * (v[0] - x[0]), x[1] + a * (v[1] - x[1])];
    return x;
  };
}
var smooth01 = (x) => x * x * (3 - 2 * x);
var capTo = (A, B, max) => {
  const v = Q2.sub(B, A), l = Q2.len(v);
  return l > max ? Q2.add(A, Q2.mul(v, max / l)) : B;
};
function gloveTexture(col, flip) {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 144;
  const g = c.getContext("2d");
  if (flip) {
    g.translate(128, 0);
    g.scale(-1, 1);
  }
  const gr = g.createRadialGradient(54, 50, 6, 64, 62, 64);
  gr.addColorStop(0, "#ffffff");
  gr.addColorStop(0.18, col);
  gr.addColorStop(1, shade(col, 0.45));
  g.fillStyle = gr;
  g.beginPath();
  g.ellipse(64, 60, 50, 54, 0, 0, 6.283);
  g.fill();
  g.fillStyle = shade(col, 0.75);
  g.beginPath();
  g.ellipse(22, 74, 14, 26, -0.25, 0, 6.283);
  g.fill();
  g.strokeStyle = "rgba(0,0,0,0.28)";
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(32, 54);
  g.quadraticCurveTo(64, 44, 98, 54);
  g.stroke();
  g.fillStyle = "#efe9e0";
  g.beginPath();
  g.roundRect(34, 108, 60, 30, 8);
  g.fill();
  g.fillStyle = "rgba(0,0,0,0.18)";
  g.fillRect(34, 116, 60, 3);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}
function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const f = (x) => Math.round(x * k);
  return "rgb(".concat(f(n >> 16), ",").concat(f(n >> 8 & 255), ",").concat(f(n & 255), ")");
}
function blobTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(0,0,0,0.5)");
  gr.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  return new CanvasTexture(c);
}
var KEYS = ["head", "lShoulder", "rShoulder", "lForearm", "rForearm", "lHand", "rHand", "lHip", "rHip", "lKnee", "rKnee", "lFoot", "rFoot"];
function create(o) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
  const { scene, camera, BP } = o, tier = (_a = o.tier) != null ? _a : 1;
  const PLAIN = o.plain !== false;
  const MIR = o.view === "mirror", SC = (_b = o.scale) != null ? _b : 1, LEVEL = (_c = o.levelFeet) != null ? _c : true, STEP = (_d = o.stepRange) != null ? _d : 0.35, ALPHA = (_e = o.alpha) != null ? _e : 0.42;
  const OUT = Object.assign({ shorts: "rgba(190,30,45,0.85)", band: "#ffffff", seam: "rgba(120,10,25,0.7)" }, o.outfit || {});
  const GOLF = OUT.style === "golf";
  if (GOLF) {
    for (const [k2, v2] of Object.entries({
      polo: "#1f2f5c",
      collar: "#2a3d72",
      trim: "rgba(236,240,248,0.9)",
      pants: "#c9b68e",
      crease: "rgba(110,90,58,0.55)",
      belt: "#2e1f14",
      buckle: "#d9dbe0",
      cap: "#f7f7f3",
      capUnder: "#24345f",
      gloveC: "#fbfbf8",
      shoe: "#f4f4f1",
      saddle: "#2a2d36",
      clothAlpha: 0.9
    })) if (((_f = o.outfit) == null ? void 0 : _f[k2]) === void 0) OUT[k2] = v2;
  }
  const PROPS = o.props || {}, DMIN = (_g = o.depthMin) != null ? _g : -0.08;
  const F = { x: (_h = o.x) != null ? _h : 0, z: (_i = o.z) != null ? _i : -2.1, G0: (_j = o.guardDepth) != null ? _j : o.gloves === false || o.gloves === void 0 && o.props ? 0.08 : 0.22 };
  const ROOM = o.headY ? 1.45 : 1;
  const PW = 2.1 * SC * ((_k = o.wide) != null ? _k : 1) * ROOM, PH = 2.35 * SC * ROOM, CW = tier === 0 ? 384 : 768, CH = Math.round(CW * PH / PW);
  const cv = document.createElement("canvas");
  cv.width = CW;
  cv.height = CH;
  const ctx = cv.getContext("2d");
  const mk = () => {
    const c = document.createElement("canvas");
    c.width = CW;
    c.height = CH;
    return c;
  };
  const glass = mk(), rim = mk(), cloth = GOLF ? mk() : null;
  const tex = new CanvasTexture(cv);
  tex.colorSpace = SRGBColorSpace;
  tex.generateMipmaps = false;
  tex.minFilter = LinearFilter;
  const plane = new Mesh(new PlaneGeometry(PW, PH), new MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false, opacity: 0 }));
  plane.position.set(F.x, PH / 2 - 0.03 * SC + ((_l = o.y) != null ? _l : 0), F.z);
  plane.renderOrder = (_m = o.renderOrder) != null ? _m : 1;
  if (scene) scene.add(plane);
  const col = o.colors || { l: "#ff5c93", r: "#4aa8ff" };
  const sprite = (s) => {
    const m = new SpriteMaterial({ map: gloveTexture(col[s], s === "l"), transparent: true, depthWrite: false, toneMapped: false, opacity: 0 });
    const sp = new Sprite(m);
    sp.scale.set(0.15 * SC, 0.17 * SC, 1);
    sp.renderOrder = 2;
    if (scene) scene.add(sp);
    return sp;
  };
  const GLOVES = (_n = o.gloves) != null ? _n : !o.props;
  const gl = { l: sprite("l"), r: sprite("r") };
  if (!GLOVES) {
    gl.l.visible = gl.r.visible = false;
  }
  const blob = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ map: blobTexture(), transparent: true, depthWrite: false, opacity: 0 }));
  blob.rotation.x = -Math.PI / 2;
  blob.position.set(F.x, 4e-3 + ((_o = o.y) != null ? _o : 0), F.z - 0.05);
  blob.scale.set(0.9 * SC, 0.5 * SC, 1);
  if (scene && o.shadow !== false) scene.add(blob);
  else blob.visible = false;
  const LF = { lKnee: jointFilter(), rKnee: jointFilter(), lFoot: jointFilter(), rFoot: jointFilter() }, LW = { l: 0, r: 0 }, FZ = { l: jointFilter(1.5, 4, 1.2, 9), r: jointFilter(1.5, 4, 1.2, 9) };
  const S = { k: null, g: null, cx0: null, at: 0, A: 0, base: { l: null, r: null }, baseE: { l: null, r: null }, baseF: { l: null, r: null }, guard: null, gs: { l: [], r: [] }, prev: {}, T: null };
  const hist = [];
  const out = {
    reach: { l: null, r: null },
    // [x, y] in the figure's own frame (metres): that hand is drawn reaching there (a game's glove it must hold)
    draw: o.draw !== false,
    // false: solve only (a rigged body draws him from out.j3; realyou.js); the plane stays hidden
    enabled: true,
    // false: fades out and stops drawing (a game with two spots for you, e.g. boxing's heavy bag and speed bag)
    plane,
    sprites: gl,
    objects: [plane, gl.l, gl.r, blob],
    legLift: { l: 0, r: 0 },
    fresh: false,
    newFrame: false,
    pose: null,
    has3D: false,
    glove: (s) => out._g[s],
    foot: (s) => out._f[s],
    _g: { l: { p: new Vector3(), v: new Vector3(), seen: false }, r: { p: new Vector3(), v: new Vector3(), seen: false } },
    _f: { l: { p: new Vector3(), v: new Vector3(), seen: false }, r: { p: new Vector3(), v: new Vector3(), seen: false } },
    fwdRaw: { l: null, r: null },
    // warm-up: the guard is measured while you hold it, then your punches are depth from YOUR guard
    sampleGuard() {
      for (const s of ["l", "r"]) if (out.fwdRaw[s] !== null) {
        S.gs[s].push(out.fwdRaw[s]);
        if (S.gs[s].length > 90) S.gs[s].shift();
      }
    },
    lockGuard() {
      for (const s of ["l", "r"]) {
        const a = [...S.gs[s]].sort((x, y) => x - y);
        if (a.length > 5) S.base[s] = a[Math.floor(a.length / 2)];
      }
      S.guard = { l: S.base.l, r: S.base.r };
      return S.guard;
    },
    update,
    get opacity() {
      return S.A;
    },
    // move where you stand in the scene (a game following your aim, a lane, a run-up): feet centre at (x, z)
    setSpot(x, z = F.z) {
      F.x = x;
      F.z = z;
      plane.position.z = z;
      blob.position.z = z - 0.05;
    },
    // draw the body as a 2D picture: feet centre at (x, y), h pixels for a 1.8 m person (create2D games)
    drawTo(c, x, y, h, alpha = 1) {
      var _a2;
      if (S.A < 0.02 || !out.pose) return;
      const s = h / (1.8 * SC), ox = plane.position.x - PW / 2, top = plane.position.y + PH / 2 - ((_a2 = o.y) != null ? _a2 : 0);
      c.save();
      c.globalAlpha = S.A * alpha;
      c.drawImage(cv, x + (ox - F.x) * s, y - top * s, PW * s, PH * s);
      c.restore();
    }
  };
  const J3 = () => {
    const J = BP.rawJ && performance.now() - (BP.rawJAt || 0) < 300 ? BP.rawJ : BP.joints;
    return J && J.lShoulder && J.rShoulder ? J : null;
  };
  function velOf(get, now) {
    const cur = get(hist[hist.length - 1]);
    let ref = null;
    for (let i = hist.length - 2; i >= 0; i--) {
      ref = hist[i];
      if (now - ref.t >= 60) break;
    }
    if (!ref || !cur) return [0, 0, 0];
    const p0 = get(ref), dt = Math.max(0.016, (hist[hist.length - 1].t - ref.t) / 1e3);
    return p0 ? [(cur[0] - p0[0]) / dt, (cur[1] - p0[1]) / dt, (cur[2] - p0[2]) / dt] : [0, 0, 0];
  }
  const still = {};
  function adapt(B, s, key, v, learn = true) {
    if (B[s] === null) B[s] = v;
    if (!learn) return v - B[s];
    const id = key + s, st = still[id] || (still[id] = { p: v, n: 0 });
    st.n = Math.abs(v - st.p) < 0.025 ? st.n + 1 : 0;
    st.p = v;
    const e = v - B[s];
    B[s] += e * (e < 0 ? 0.25 : e < 0.06 ? 0.03 : st.n > 8 ? 0.06 : 2e-3);
    return v - B[s];
  }
  let lastDraw = 0;
  function update(now) {
    var _a2, _b2, _c2, _d2, _e2;
    const I = BP.img, dtA = Math.min(0.1, (now - (S.at || now)) / 1e3);
    S.at = now;
    const fresh = !!(I && I.lShoulder && I.rShoulder && I.lHip && I.rHip && now - (BP.imgAt || 0) < 700 && (BP.live || BP.simulating));
    out.fresh = fresh;
    out.newFrame = false;
    const onMenu = !o.menu && BP._mode && BP._mode !== "play";
    S.A += ((fresh && BP.present !== false && !onMenu && out.enabled ? 1 : 0) - S.A) * Math.min(1, dtA * 6);
    plane.visible = out.draw;
    if (!out.draw && o.shadow !== false) blob.visible = false;
    else if (o.shadow !== false && scene) blob.visible = true;
    plane.material.opacity = S.A;
    blob.material.opacity = S.A * 0.8;
    for (const s of ["l", "r"]) gl[s].material.opacity = S.A * (out._g[s].seen ? 1 : 0);
    const key = BP.imgDrawAt && BP.imgDrawAt >= BP.imgAt ? BP.imgDrawAt : BP.imgAt;
    if (!fresh || key === S.frame || !out.enabled && S.A < 0.02) return out;
    S.frame = key;
    out.newFrame = true;
    const pic = BP.imgAt !== S.pic;
    S.pic = BP.imgAt;
    out.newPicture = pic;
    const fr = clamp((now - ((_a2 = S.solveAt) != null ? _a2 : now - 96)) / 96, 0.05, 1.5);
    S.solveAt = now;
    const ra = (a) => 1 - Math.pow(1 - a, fr);
    const chest = Q2.mid(I.lShoulder, I.rShoulder), hip = Q2.mid(I.lHip, I.rHip), Tp = Math.max(0.02, Q2.len(Q2.sub(chest, hip)));
    const J = J3();
    out.has3D = !!(J && J.lHand && J.rHand);
    let t3 = 0.5;
    if (J && J.lHip && J.rHip) {
      const c3 = J.lShoulder.map((c, i) => (c + J.rShoulder[i]) / 2), h3 = J.lHip.map((c, i) => (c + J.rHip[i]) / 2);
      t3 = clamp(Math.hypot(c3[0] - h3[0], c3[1] - h3[1], c3[2] - h3[2]), 0.4, 0.6);
    }
    const kNew = t3 / Tp;
    S.k = S.k === null ? kNew : S.k + (clamp(kNew, S.k * 0.6, S.k * 1.6) - S.k) * ra(0.08);
    const HS = (_b2 = S.hs) != null ? _b2 : 1, k = S.k * SC * HS;
    const inside = (p) => p && p[1] < 0.985 && p[1] > 0.01;
    const feet = inside(I.lFoot) && inside(I.rFoot) && I.lKnee && I.rKnee;
    const g = feet ? Math.max(I.lFoot[1], I.rFoot[1]) : hip[1] + 1.75 * Tp;
    S.g = S.g === null ? g : S.g + (g - S.g) * ra(g > S.g ? 0.35 : 0.1);
    S.cx0 = S.cx0 === null ? chest[0] : S.cx0 + ra(0.01) * (chest[0] - S.cx0);
    const stepX = clamp(-(chest[0] - S.cx0) * k, -STEP * SC, STEP * SC);
    const M = (p) => {
      var _a3;
      return p && [F.x + stepX - (p[0] - chest[0]) * k, (S.g - p[1]) * k + 0.07 * SC + ((_a3 = o.y) != null ? _a3 : 0)];
    };
    const R = {};
    for (const key2 of KEYS) R[key2] = M(I[key2]);
    const t = (S.T = S.T === null ? t3 * SC : S.T + (t3 * SC - S.T) * ra(0.05)) * HS;
    for (const key2 in R) {
      const p = R[key2], q = S.prev[key2];
      if (p && q && Q2.len(Q2.sub(p, q)) > 0.45 * t * 2.2) R[key2] = Q2.lerp(q, p, ra(0.4));
      S.prev[key2] = R[key2];
    }
    const B = { t };
    const nS = Q2.mid(R.lShoulder, R.rShoulder), hM0 = Q2.mid(R.lHip, R.rHip);
    const u = clampDir(Q2.nrm(Q2.sub(nS, hM0), [0, 1]), [0, 1], 0.4);
    B.u = u;
    B.n = nS;
    B.hM = Q2.sub(nS, Q2.mul(u, clamp(Q2.len(Q2.sub(nS, hM0)), 0.78 * t, 1.15 * t)));
    let s0 = [-u[1], u[0]];
    if (Q2.dot(s0, Q2.sub(R.lShoulder, R.rShoulder)) < 0) s0 = Q2.mul(s0, -1);
    const sd = clampDir(Q2.nrm(Q2.sub(R.lShoulder, R.rShoulder), s0), s0, 0.3), ws = clamp(Q2.len(Q2.sub(R.lShoulder, R.rShoulder)), 0.3 * t, 0.85 * t);
    B.sd = sd;
    B.lS = Q2.add(nS, Q2.mul(sd, ws / 2));
    B.rS = Q2.sub(nS, Q2.mul(sd, ws / 2));
    const hd = clampDir(Q2.nrm(Q2.sub(R.lHip, R.rHip), s0), s0, 0.35), wh = clamp(Q2.len(Q2.sub(R.lHip, R.rHip)), 0.16 * t, 0.62 * t);
    B.hd = hd;
    B.lH = Q2.add(B.hM, Q2.mul(hd, wh / 2));
    B.rH = Q2.sub(B.hM, Q2.mul(hd, wh / 2));
    B.hipW = wh / t;
    B.shW = ws / t;
    B.hu = R.head ? clampDir(Q2.nrm(Q2.sub(R.head, nS), u), u, 0.3) : u;
    B.head = Q2.add(nS, Q2.mul(B.hu, (PR.chin + PR.head / 2) * t));
    if (o.headY) {
      const base = 0.07 * SC + ((_c2 = o.y) != null ? _c2 : 0), h0 = (B.head[1] - base) / HS;
      if (h0 > 0.3) S.hs = HS + (clamp((o.headY - base) / h0, 0.8, 1.45) - HS) * (S.hs === void 0 ? 1 : ra(0.04));
    }
    const dep = { l: {}, r: {} };
    const shZ = J ? (J.lShoulder[2] + J.rShoulder[2]) / 2 : 0, hpZ = J && J.lHip && J.rHip ? (J.lHip[2] + J.rHip[2]) / 2 : 0;
    for (const s of ["l", "r"]) {
      const h = J && J[s + "Hand"], e = J && J[s + "Forearm"], f = J && J[s + "Foot"];
      out.fwdRaw[s] = h ? h[2] - shZ : null;
      dep[s].h = h ? clamp(adapt(S.base, s, "h", h[2] - shZ, pic), DMIN, 0.65) : 0;
      dep[s].e = e ? clamp(adapt(S.baseE, s, "e", e[2] - shZ, pic), -0.08, 0.45) : 0;
      dep[s].f = f ? clamp(adapt(S.baseF, s, "f", f[2] - hpZ, pic), -0.1, 0.6) : 0;
    }
    const cam = camera.position, pz = F.z, DS = MIR ? -1 : 1;
    const proj = (p, d) => {
      const sP = (pz - cam.z) / (pz - DS * d - cam.z);
      return [cam.x + (p[0] - cam.x) * sP, cam.y + (p[1] - cam.y) * sP];
    };
    const bone = (A, v2, dz, L, fb) => {
      const l3 = Math.hypot(Q2.len(v2), dz);
      if (l3 < 0.2 * L) return { p: Q2.add(A, Q2.mul(fb, L)), dz: 0 };
      const kk = L / Math.max(l3, 0.45 * L);
      return { p: Q2.add(A, Q2.mul(v2, kk)), dz: dz * kk };
    };
    const g3 = {}, down = Q2.mul(u, -1);
    for (const s of ["l", "r"]) {
      const Sh = B[s + "S"], re = R[s + "Forearm"], rw = R[s + "Hand"], rs = R[s + "Shoulder"];
      const E0 = re ? Q2.add(Sh, Q2.sub(re, rs)) : Q2.add(Sh, Q2.mul(down, PR.up * t));
      const W0 = rw && re ? Q2.add(E0, Q2.sub(rw, re)) : Q2.add(E0, Q2.mul(down, PR.fore * t));
      const dh0 = (F.G0 * clamp(0.4 + Q2.dot(Q2.sub(W0, B.hM), u) / t, 0, 1) + dep[s].h) * SC;
      const de0 = Math.min(dh0 * 0.6, (dep[s].e + F.G0 * 0.3) * SC);
      const up = bone(Sh, Q2.sub(E0, Sh), de0, PR.up * t, down);
      const fo = bone(up.p, Q2.sub(W0, E0), dh0 - de0, PR.fore * t, Q2.nrm(Q2.sub(up.p, Sh), down));
      const de = up.dz, dw = de + fo.dz, fd = Q2.nrm(Q2.sub(fo.p, up.p), down), hx = PR.hand * 0.45 * t;
      const P = Q2.add(fo.p, Q2.mul(fd, hx)), dh = dw + fo.dz / (PR.fore * t) * hx;
      B[s + "E"] = proj(up.p, de);
      B[s + "W"] = proj(fo.p, dw);
      B[s + "P"] = proj(P, dh);
      B[s + "E3"] = [up.p[0], up.p[1], pz - DS * de];
      B[s + "W3"] = [fo.p[0], fo.p[1], pz - DS * dw];
      const RT = out.reach[s];
      if (RT) {
        const v = Q2.sub(RT, Sh), d = Q2.len(v), L1 = PR.up * t, L2 = (PR.fore + PR.hand * 0.45) * t, kS = clamp(d / ((L1 + L2) * 0.98), 1, 1.25);
        const a1 = L1 * kS, a2 = L2 * kS, D = Math.min(d, (a1 + a2) * 0.999), u2 = Q2.nrm(v, down), n2 = Q2.perp(u2);
        const side = Math.sign(Q2.cross(u2, Q2.sub(B[s + "E"], Sh)) || (s === "l" ? 1 : -1));
        const ax = (a1 * a1 - a2 * a2 + D * D) / (2 * Math.max(D, 1e-4)), hh = Math.sqrt(Math.max(0, a1 * a1 - ax * ax));
        const E = Q2.add(Q2.add(Sh, Q2.mul(u2, ax)), Q2.mul(n2, hh * side)), Pp = Q2.add(Sh, Q2.mul(u2, D));
        B[s + "E"] = E;
        B[s + "P"] = Pp;
        B[s + "W"] = Q2.lerp(E, Pp, PR.fore / (PR.fore + PR.hand * 0.45));
        g3[s] = [Pp[0], Pp[1], pz];
        out._g[s].dz = 0;
        B[s + "E3"] = [E[0], E[1], pz];
        B[s + "W3"] = [B[s + "W"][0], B[s + "W"][1], pz];
      }
      g3[s] = [P[0], P[1], pz - DS * dh];
      out._g[s].dz = dh;
      out._g[s].seen = !!rw;
    }
    B.legs = feet;
    for (const key2 of ["lKnee", "rKnee", "lFoot", "rFoot"]) if (R[key2]) R[key2] = LF[key2](R[key2], now, t);
    for (const s of ["l", "r"]) {
      const tgt = clamp(out.legLift[s] || 0, 0, 1), dtL = Math.min(0.12, Math.max(8e-3, (now - (S.lwAt || now)) / 1e3));
      LW[s] += (tgt - LW[s]) * (1 - Math.exp(-dtL / (tgt > LW[s] ? 0.05 : 0.11)));
      dep[s].f = FZ[s]([dep[s].f, 0], now, 1)[0];
    }
    S.lwAt = now;
    const LL = { l: smooth01(LW.l), r: smooth01(LW.r) }, fdz = { l: 0, r: 0 };
    if (feet) for (const s of ["l", "r"]) {
      const w = LL[s];
      if (w <= 0.01) continue;
      const o2 = s === "l" ? "r" : "l";
      B[s + "H"] = Q2.add(Q2.lerp(B[s + "H"], B[o2 + "H"], 0.3 * w), Q2.mul(u, 0.1 * t * w));
    }
    for (const s of ["l", "r"]) {
      const Hp = B[s + "H"];
      if (!feet) {
        B[s + "K"] = Q2.add(Hp, Q2.mul(down, PR.thigh * t));
        B[s + "A"] = Q2.add(B[s + "K"], Q2.mul(down, PR.shin * t));
        continue;
      }
      const w = LL[s];
      const K0 = capTo(Hp, Q2.add(Hp, Q2.sub(R[s + "Knee"], R[s + "Hip"])), PR.thigh * t);
      const A0 = capTo(K0, Q2.add(K0, Q2.sub(R[s + "Foot"], R[s + "Knee"])), PR.shin * t);
      if (w <= 0.01) {
        B[s + "K"] = K0;
        B[s + "A"] = A0;
        continue;
      }
      const df = Math.max(0, dep[s].f) * w * SC;
      const th = bone(Hp, Q2.sub(R[s + "Knee"], R[s + "Hip"]), df * 0.5, PR.thigh * t, down);
      const sh = bone(th.p, Q2.sub(R[s + "Foot"], R[s + "Knee"]), df * 0.5, PR.shin * t, Q2.nrm(Q2.sub(th.p, Hp), down));
      fdz[s] = th.dz + sh.dz;
      B[s + "A3"] = Q2.lerp(A0, sh.p, w);
      B[s + "K3"] = [...Q2.lerp(K0, th.p, w), pz - DS * th.dz * w];
      B[s + "K"] = Q2.lerp(K0, proj(th.p, th.dz), w);
      B[s + "A"] = Q2.lerp(A0, proj(sh.p, fdz[s]), w);
    }
    if (feet && LEVEL) {
      const pl = ["l", "r"].filter((s) => LL[s] < 0.5), lowY = pl.length ? Math.min(...pl.map((s) => B[s + "A"][1])) : null;
      if (lowY !== null) for (const s of ["l", "r"]) {
        const dy = (B[s + "A"][1] - lowY) * (1 - LL[s]);
        if (dy > 0) {
          B[s + "A"] = [B[s + "A"][0], B[s + "A"][1] - dy];
          B[s + "K"] = [B[s + "K"][0], B[s + "K"][1] - dy * 0.5];
        }
      }
    }
    if (feet && out.legHook) out.legHook({ B, t, u, LL, fdz, proj, pz, DS, thigh: PR.thigh * t, shin: PR.shin * t });
    for (const s of ["l", "r"]) {
      out._f[s].seen = feet;
      out._f[s].d = dep[s].f;
    }
    const ft3 = (s) => {
      const A = B[s + "A3"] || B[s + "A"];
      return [A[0], A[1], pz - DS * fdz[s]];
    };
    const f3 = { l: ft3("l"), r: ft3("r") };
    hist.push({ t: now, gl: g3, ft: f3 });
    while (hist.length > 12 || hist.length > 2 && now - hist[0].t > 300) hist.shift();
    for (const s of ["l", "r"]) {
      const G = out._g[s];
      G.p.set(...g3[s]);
      G.v.set(...velOf((h) => h.gl[s], now));
      G.d = dep[s].h;
      const Fo = out._f[s];
      Fo.p.set(...f3[s]);
      Fo.v.set(...velOf((h) => h.ft[s], now));
      gl[s].position.copy(G.p);
      gl[s].renderOrder = G.dz > 0.12 && !MIR ? 0 : 2;
      const dir = Q2.nrm(Q2.sub(B[s + "P"], B[s + "W"]), [0, 1]);
      gl[s].material.rotation = Math.atan2(dir[1], dir[0]) - Math.PI / 2;
    }
    blob.position.x = (B.lA[0] + B.rA[0]) / 2;
    plane.position.x = F.x + stepX;
    out.pose = B;
    const z0 = pz, P3 = (p, z = z0) => p && [p[0], p[1], z];
    out.j3 = {
      head: P3(B.head),
      lShoulder: P3(B.lS),
      rShoulder: P3(B.rS),
      lHip: P3(B.lH),
      rHip: P3(B.rH),
      lElbow: B.lE3,
      rElbow: B.rE3,
      lWrist: B.lW3,
      rWrist: B.rW3,
      lHandP: g3.l,
      rHandP: g3.r,
      lKnee: B.lK3 || P3(B.lK),
      rKnee: B.rK3 || P3(B.rK),
      lAnkle: B.lA3 ? [B.lA3[0], B.lA3[1], z0 - DS * fdz.l] : P3(B.lA),
      rAnkle: B.rA3 ? [B.rA3[0], B.rA3[1], z0 - DS * fdz.r] : P3(B.rA),
      floorY: (_d2 = o.y) != null ? _d2 : 0,
      ankleY: 0.07 * SC + ((_e2 = o.y) != null ? _e2 : 0),
      legs: !!feet,
      t
    };
    for (const s of ["l", "r"]) {
      delete B[s + "K3"];
      delete B[s + "A3"];
    }
    if (out.draw) draw(B);
    return out;
  }
  function drawProps(c, P, B, t) {
    for (const s of ["l", "r"]) {
      const kind = PROPS[s];
      if (!kind || !P[s + "P"] || !P[s + "W"]) continue;
      if (typeof kind === "function") {
        try {
          kind(c, { P, B, t, side: s, view: MIR ? "mirror" : "behind" });
        } catch (_) {
        }
        continue;
      }
      const h = P[s + "P"], d = Q2.nrm(Q2.sub(h, P[s + "W"]), [0, -1]), n = Q2.perp(d), at = (x, y) => Q2.at(h, d, n, x * t, y * t);
      c.save();
      c.lineCap = "round";
      c.lineJoin = "round";
      if (kind === "paddle") {
        c.strokeStyle = "#6b4a2b";
        c.lineWidth = t * 0.07;
        c.beginPath();
        c.moveTo(...at(-0.04, 0));
        c.lineTo(...at(0.12, 0));
        c.stroke();
        c.fillStyle = MIR ? "#d22a2a" : "#1d1d22";
        c.strokeStyle = "#e8d3b0";
        c.lineWidth = Math.max(1, t * 0.02);
        const m = at(0.27, 0);
        c.beginPath();
        c.ellipse(m[0], m[1], t * 0.16, t * 0.15, Math.atan2(d[1], d[0]), 0, 6.283);
        c.fill();
        c.stroke();
      } else if (kind === "ball") {
        const m = at(0.08, 0), r = t * 0.2, gr = c.createRadialGradient(m[0] - r * 0.35, m[1] - r * 0.35, r * 0.1, m[0], m[1], r);
        gr.addColorStop(0, "#7fa8ff");
        gr.addColorStop(0.5, "#2a3f9e");
        gr.addColorStop(1, "#0f1640");
        c.fillStyle = gr;
        c.beginPath();
        c.arc(m[0], m[1], r, 0, 6.283);
        c.fill();
        if (MIR) {
          c.fillStyle = "#05070f";
          for (const [x, y] of [[-0.05, -0.06], [0.05, -0.06], [0, 0.06]]) {
            c.beginPath();
            c.arc(m[0] + x * t, m[1] + y * t, t * 0.025, 0, 6.283);
            c.fill();
          }
        }
      } else if (kind === "club") {
        if (s === "l" && PROPS.r === "club") continue;
        const o2 = s === "l" ? "r" : "l", two = P[o2 + "P"] && Q2.len(Q2.sub(P[o2 + "P"], h)) < 0.6 * t;
        const g0 = two ? Q2.mid(h, P[o2 + "P"]) : h, dd = two ? Q2.nrm(Q2.add(d, Q2.nrm(Q2.sub(P[o2 + "P"], P[o2 + "W"]), d)), d) : d;
        const tip = Q2.add(g0, Q2.mul(dd, 2 * t));
        c.strokeStyle = "#1b1b1f";
        c.lineWidth = t * 0.06;
        c.beginPath();
        c.moveTo(...Q2.add(g0, Q2.mul(dd, -0.08 * t)));
        c.lineTo(...Q2.add(g0, Q2.mul(dd, 0.3 * t)));
        c.stroke();
        c.strokeStyle = "#c9ced6";
        c.lineWidth = Math.max(1.5, t * 0.025);
        c.beginPath();
        c.moveTo(...Q2.add(g0, Q2.mul(dd, 0.3 * t)));
        c.lineTo(...tip);
        c.stroke();
        const dn = Q2.perp(dd);
        c.fillStyle = "#d9dde3";
        c.beginPath();
        c.ellipse(...Q2.add(tip, Q2.mul(dn, 0.07 * t)), t * 0.1, t * 0.045, Math.atan2(dn[1], dn[0]), 0, 6.283);
        c.fill();
      } else if (kind === "pistol") {
        c.fillStyle = "#2a2d36";
        c.strokeStyle = "#ffcf6b";
        c.lineWidth = Math.max(1, t * 0.015);
        const p = [at(-0.02, -0.05), at(0.36, -0.05), at(0.36, 0.04), at(0.1, 0.04), at(0.06, 0.16), at(-0.04, 0.16)];
        c.beginPath();
        p.forEach((q, i) => i ? c.lineTo(...q) : c.moveTo(...q));
        c.closePath();
        c.fill();
        c.stroke();
      } else if (kind === "mitt") {
        const m = at(0.06, 0);
        c.fillStyle = "#f2f6f2";
        c.strokeStyle = "#2bb673";
        c.lineWidth = Math.max(1.5, t * 0.03);
        c.beginPath();
        c.ellipse(m[0], m[1], t * 0.12, t * 0.15, Math.atan2(d[1], d[0]) - Math.PI / 2, 0, 6.283);
        c.fill();
        c.stroke();
      } else if (kind === "stick") {
        c.strokeStyle = "#e9cf9c";
        c.lineWidth = Math.max(1.5, t * 0.035);
        c.beginPath();
        c.moveTo(...at(-0.05, 0));
        c.lineTo(...at(0.75, 0));
        c.stroke();
      } else if (kind === "mic") {
        c.strokeStyle = "#15161a";
        c.lineWidth = t * 0.07;
        c.beginPath();
        c.moveTo(...at(-0.05, 0));
        c.lineTo(...at(0.18, 0));
        c.stroke();
        c.fillStyle = "#b9c0c9";
        c.beginPath();
        c.arc(...at(0.25, 0), t * 0.065, 0, 6.283);
        c.fill();
      } else if (kind === "guitar") {
        const lh = P.lP || h, body = Q2.lerp(P.hM, P.rH || P.hM, 0.35), nd = Q2.nrm(Q2.sub(lh, body), [-1, 0]), nn = Q2.perp(nd);
        c.fillStyle = MIR ? "#c8452d" : "#5a2a1a";
        c.strokeStyle = "#f1e2c6";
        c.lineWidth = Math.max(1, t * 0.015);
        c.beginPath();
        c.ellipse(body[0], body[1], t * 0.3, t * 0.22, Math.atan2(nd[1], nd[0]), 0, 6.283);
        c.fill();
        c.stroke();
        c.strokeStyle = "#3b2616";
        c.lineWidth = t * 0.06;
        c.beginPath();
        c.moveTo(...Q2.add(body, Q2.mul(nd, 0.25 * t)));
        c.lineTo(...Q2.add(lh, Q2.mul(nd, 0.12 * t)));
        c.stroke();
        void nn;
      }
      c.restore();
    }
  }
  function dress(P, B, t, K) {
    const { torso, arms, legs, shoes, capC, u, hu, side, hside, add } = K, c = cloth.getContext("2d");
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalCompositeOperation = "source-over";
    c.clearRect(0, 0, CW, CH);
    c.lineCap = "round";
    c.lineJoin = "round";
    const lw = (k) => Math.max(1, t * k);
    c.fillStyle = OUT.polo;
    c.fill(torso);
    const bl = Q2.lerp(P.lS, P.lH, 0.82), br = Q2.lerp(P.rS, P.rH, 0.82), bd = Q2.nrm(Q2.sub(bl, br), [1, 0]), bn = [-bd[1], bd[0]];
    const dn = Q2.dot(bn, u) > 0 ? Q2.mul(bn, -1) : bn;
    c.save();
    c.clip(torso);
    c.fillStyle = OUT.pants;
    c.beginPath();
    c.moveTo(...Q2.add(bl, Q2.mul(bd, t)));
    c.lineTo(...Q2.add(br, Q2.mul(bd, -t)));
    c.lineTo(...add(br, Q2.mul(bd, -t), Q2.mul(dn, 2 * t)));
    c.lineTo(...add(bl, Q2.mul(bd, t), Q2.mul(dn, 2 * t)));
    c.closePath();
    c.fill();
    c.strokeStyle = "rgba(10,16,34,0.45)";
    c.lineWidth = lw(0.014);
    for (const f of [-0.12, 0.02, 0.15]) {
      const m = Q2.add(Q2.lerp(bl, br, 0.5 + f), Q2.mul(dn, -0.03 * t));
      c.beginPath();
      c.moveTo(...m);
      c.lineTo(...Q2.add(m, Q2.mul(dn, -0.09 * t)));
      c.stroke();
    }
    c.restore();
    c.fillStyle = OUT.pants;
    for (const p of legs) c.fill(p);
    if (B.legs) {
      c.strokeStyle = OUT.crease;
      c.lineWidth = lw(0.016);
      for (const s of ["l", "r"]) {
        const k0 = Q2.lerp(P[s + "H"], P[s + "K"], 0.12);
        c.beginPath();
        c.moveTo(...k0);
        c.lineTo(...P[s + "K"]);
        c.lineTo(...Q2.add(P[s + "A"], Q2.mul(u, 0.1 * t)));
        c.stroke();
      }
    }
    for (const [sh, A] of shoes) {
      const y0 = A[1] - t * 0.035;
      c.save();
      c.beginPath();
      c.rect(A[0] - t * 0.3, y0, t * 0.6, t * 0.4);
      c.clip();
      c.clearRect(A[0] - t * 0.3, y0, t * 0.6, t * 0.4);
      c.fillStyle = OUT.shoe;
      c.fill(sh);
      c.clip(sh);
      c.fillStyle = "#16181d";
      c.fillRect(A[0] - t * 0.2, A[1] + t * 0.03, t * 0.4, t * 0.06);
      c.fillStyle = OUT.saddle;
      c.fillRect(A[0] - t * 0.2, y0, t * 0.4, t * 0.018);
      c.restore();
    }
    const bw = 0.06 * t;
    c.strokeStyle = OUT.belt;
    c.lineWidth = bw;
    c.lineCap = "butt";
    c.save();
    c.clip(torso);
    c.beginPath();
    c.moveTo(...Q2.add(bl, Q2.mul(bd, 0.3 * t)));
    c.lineTo(...Q2.add(br, Q2.mul(bd, -0.3 * t)));
    c.stroke();
    c.restore();
    const bk = Q2.lerp(bl, br, 0.5);
    c.save();
    c.translate(...bk);
    c.rotate(Math.atan2(bd[1], bd[0]));
    c.strokeStyle = OUT.buckle;
    c.lineWidth = lw(0.014);
    c.strokeRect(-t * 0.05, -bw * 0.62, t * 0.1, bw * 1.24);
    c.restore();
    c.lineCap = "round";
    const nk = (s, k, d) => add(P.n, side(s, k * t), Q2.mul(u, d * t));
    if (MIR) {
      c.strokeStyle = "rgba(8,14,32,0.6)";
      c.lineWidth = lw(0.014);
      const p0 = nk("l", 0, -0.03), p1 = nk("l", 0, -0.26);
      c.fillStyle = "rgba(12,20,44,0.35)";
      c.beginPath();
      c.moveTo(...nk("l", 0.025, -0.03));
      c.lineTo(...nk("l", 0.025, -0.26));
      c.lineTo(...nk("r", 0.025, -0.26));
      c.lineTo(...nk("r", 0.025, -0.03));
      c.closePath();
      c.fill();
      c.beginPath();
      c.moveTo(...p0);
      c.lineTo(...p1);
      c.stroke();
      c.fillStyle = OUT.trim;
      for (const d of [-0.08, -0.15, -0.22]) {
        c.beginPath();
        c.arc(...nk("l", 0, d), lw(0.012), 0, 6.283);
        c.fill();
      }
      for (const s of ["l", "r"]) {
        c.fillStyle = OUT.collar;
        c.beginPath();
        c.moveTo(...nk(s, 0.02, 0.06));
        c.lineTo(...nk(s, 0.13, 0.05));
        c.lineTo(...nk(s, 0.15, -0.02));
        c.lineTo(...nk(s, 0.05, -0.12));
        c.lineTo(...nk(s, 5e-3, -0.04));
        c.closePath();
        c.fill();
        c.strokeStyle = OUT.trim;
        c.lineWidth = lw(0.012);
        c.stroke();
      }
      const lg = nk("l", 0.2, -0.2);
      c.fillStyle = OUT.trim;
      c.beginPath();
      c.arc(...lg, lw(0.02), 0, 6.283);
      c.fill();
    } else {
      c.strokeStyle = OUT.collar;
      c.lineWidth = t * 0.05;
      c.beginPath();
      c.moveTo(...nk("l", 0.12, 0.03));
      c.quadraticCurveTo(...nk("l", 0, 0.09), ...nk("r", 0.12, 0.03));
      c.stroke();
    }
    c.globalCompositeOperation = "destination-out";
    c.fillStyle = "#000";
    for (const p of arms) c.fill(p);
    c.globalCompositeOperation = "source-over";
    for (const s of ["l", "r"]) {
      const A = Q2.lerp(P[s + "S"], P[s + "E"], 0.02), E = Q2.lerp(P[s + "S"], P[s + "E"], 0.56);
      c.fillStyle = OUT.polo;
      c.fill(limbShape(A, E, [[0, t * 0.135, t * 0.135], [0.5, t * 0.128, t * 0.124], [1, t * 0.118, t * 0.118]]));
      const ed = Q2.nrm(Q2.sub(E, A), [0, 1]), en = Q2.perp(ed);
      c.strokeStyle = OUT.trim;
      c.lineWidth = lw(0.016);
      c.beginPath();
      c.moveTo(...Q2.add(E, Q2.mul(en, 0.11 * t)));
      c.lineTo(...Q2.add(E, Q2.mul(en, -0.11 * t)));
      c.stroke();
    }
    const gs = OUT.glove;
    if (gs && P[gs + "P"] && P[gs + "W"]) {
      const pp = P[gs + "P"], wd = Q2.nrm(Q2.sub(pp, P[gs + "W"]), [0, 1]);
      c.fillStyle = OUT.gloveC;
      c.beginPath();
      c.ellipse(pp[0], pp[1], t * 0.08, t * 0.1, Math.atan2(wd[1], wd[0]) - Math.PI / 2, 0, 6.283);
      c.fill();
      const cf = Q2.add(pp, Q2.mul(wd, -0.08 * t));
      c.strokeStyle = "rgba(150,160,175,0.9)";
      c.lineWidth = lw(0.02);
      c.beginPath();
      c.moveTo(...Q2.add(cf, Q2.mul(Q2.perp(wd), 0.06 * t)));
      c.lineTo(...Q2.add(cf, Q2.mul(Q2.perp(wd), -0.06 * t)));
      c.stroke();
    }
    if (capC) {
      c.fillStyle = OUT.cap;
      c.fill(capC.crown);
      c.fillStyle = OUT.capUnder;
      c.fill(capC.brim);
      c.save();
      c.clip(capC.brim);
      c.fillStyle = OUT.cap;
      c.beginPath();
      const bt = capC.at(0, 0.36);
      c.ellipse(bt[0], bt[1], capC.a * 1.16, capC.b * 0.13, Math.atan2(Q2.perp(hu)[1], Q2.perp(hu)[0]), 0, 6.283);
      c.fill();
      c.restore();
      c.strokeStyle = "rgba(150,158,172,0.8)";
      c.lineWidth = lw(0.012);
      c.beginPath();
      c.moveTo(...capC.at(0, 1.1));
      c.lineTo(...capC.at(0, 0.45));
      c.stroke();
      c.fillStyle = OUT.capUnder;
      c.beginPath();
      c.arc(...capC.at(0, 1.13), lw(0.018), 0, 6.283);
      c.fill();
    }
    c.globalCompositeOperation = "destination-in";
    c.drawImage(glass, 0, 0);
    c.globalCompositeOperation = "source-atop";
    const hl = c.createLinearGradient(...add(P.n, side("l", 0.45 * t)), ...add(P.n, side("r", 0.45 * t)));
    hl.addColorStop(0, "rgba(255,255,255,0.22)");
    hl.addColorStop(0.4, "rgba(255,255,255,0)");
    hl.addColorStop(1, "rgba(0,0,0,0.12)");
    c.fillStyle = hl;
    c.fillRect(0, 0, CW, CH);
    c.globalCompositeOperation = "source-over";
  }
  function draw(B) {
    const px = CW / PW, ox = plane.position.x - PW / 2, oy = plane.position.y + PH / 2;
    const T = (p) => [(p[0] - ox) * px, (oy - p[1]) * px];
    const P = {};
    for (const k in B) if (Array.isArray(B[k]) && B[k].length === 2 && typeof B[k][0] === "number" && !["u", "sd", "hd", "hu"].includes(k)) P[k] = T(B[k]);
    const t = B.t * px, u = [B.u[0], -B.u[1]], sd = [B.sd[0], -B.sd[1]], hd = [B.hd[0], -B.hd[1]], hu = [B.hu[0], -B.hu[1]];
    const Wd = (x) => x * t, add = (o2, ...vs) => vs.reduce((a, b) => Q2.add(a, b), o2);
    const side = (s, f) => s === "l" ? Q2.mul(sd, f) : Q2.mul(sd, -f), hside = (s, f) => s === "l" ? Q2.mul(hd, f) : Q2.mul(hd, -f);
    const chin = Q2.add(P.n, Q2.mul(hu, PR.chin * t));
    const shapes = [];
    const ring = (s) => {
      const Sh = P[s + "S"], Hp = P[s + "H"];
      return [
        add(chin, Q2.mul(hu, 0.07 * t), side(s, 0.085 * t)),
        add(P.n, side(s, 0.1 * t), Q2.mul(u, 0.12 * t)),
        add(P.n, side(s, 0.16 * t), Q2.mul(u, 0.07 * t)),
        add(P.n, Q2.lerp([0, 0], Q2.sub(Sh, P.n), 0.7), Q2.mul(u, 0.035 * t)),
        add(Sh, side(s, 0.08 * t)),
        add(Sh, side(s, 0.115 * t), Q2.mul(u, -0.07 * t)),
        add(Sh, side(s, 0.05 * t), Q2.mul(u, -0.28 * t)),
        Q2.lerp(add(Sh, side(s, 0.045 * t)), add(Hp, hside(s, 0.1 * t)), 0.5),
        Q2.lerp(add(Sh, side(s, 0.04 * t)), add(Hp, hside(s, 0.1 * t)), 0.8),
        add(Hp, hside(s, 0.105 * t), Q2.mul(u, 0.02 * t)),
        add(Hp, hside(s, 0.1 * t), Q2.mul(u, -0.17 * t))
      ];
    };
    const L = ring("l"), Rr = ring("r");
    shapes.push(smoothClosed([...L, add(P.hM, Q2.mul(u, -0.2 * t)), ...Rr.reverse()]));
    const torso = shapes[0], arms = [], legs = [], shoes = [];
    const headPath = (() => {
      const c = P.head, f = hu, n = Q2.perp(hu), a = PR.headW / 2 * t, b = PR.head / 2 * t;
      const hp = [[0, 1], [0.7, 0.74], [0.98, 0.18], [1.08, 0.02], [0.92, -0.28], [0.66, -0.72], [0.28, -0.97], [0, -1], [-0.28, -0.97], [-0.66, -0.72], [-0.92, -0.28], [-1.08, 0.02], [-0.98, 0.18], [-0.7, 0.74]];
      return smoothClosed(hp.map(([x, y]) => Q2.at(c, f, n, y * b, x * a)));
    })();
    shapes.push(headPath);
    const capC = GOLF && (() => {
      const c = P.head, n = Q2.perp(hu), a = PR.headW / 2 * t, b = PR.head / 2 * t, at = (x, y) => Q2.at(c, hu, n, y * b, x * a);
      const crown = smoothClosed([[-1.06, 0.3], [-0.98, 0.66], [-0.66, 0.98], [0, 1.14], [0.66, 0.98], [0.98, 0.66], [1.06, 0.3], [0, 0.26]].map(([x, y]) => at(x, y)));
      const bc = at(0, 0.3), brim = new Path2D();
      brim.ellipse(bc[0], bc[1], a * 1.12, b * 0.17, Math.atan2(n[1], n[0]), 0, 6.283);
      shapes.push(crown, brim);
      return { crown, brim, at, a, b };
    })();
    for (const s of ["l", "r"]) {
      shapes.push(limbShape(Q2.lerp(P[s + "S"], P[s + "E"], 0.1), P[s + "E"], [[0, Wd(0.11), Wd(0.11)], [0.14, Wd(0.118), Wd(0.11)], [0.5, Wd(0.105), Wd(0.1)], [1, Wd(0.075), Wd(0.075)]]));
      shapes.push(limbShape(P[s + "E"], P[s + "P"], [[0, Wd(0.078), Wd(0.078)], [0.25, Wd(0.092), Wd(0.085)], [0.62, Wd(0.07), Wd(0.066)], [1, Wd(0.06), Wd(0.06)]]));
      arms.push(shapes[shapes.length - 2], shapes[shapes.length - 1]);
      if (!GLOVES) {
        const pp = P[s + "P"];
        const hp = new Path2D();
        hp.ellipse(pp[0], pp[1], t * 0.075, t * 0.095, 0, 0, 6.283);
        shapes.push(hp);
        arms.push(hp);
      }
      if (GLOVES || !GOLF) {
        shapes.push(limbShape(P[s + "H"], P[s + "K"], [[0, Wd(0.18), Wd(0.18)], [0.22, Wd(0.175), Wd(0.165)], [0.7, Wd(0.128), Wd(0.118)], [1, Wd(0.095), Wd(0.095)]]));
        shapes.push(limbShape(P[s + "K"], P[s + "A"], [[0, Wd(0.095), Wd(0.095)], [0.28, Wd(0.11), Wd(0.1)], [0.7, Wd(0.07), Wd(0.068)], [1, Wd(0.052), Wd(0.052)]]));
      } else {
        shapes.push(limbShape(P[s + "H"], P[s + "K"], [[0, Wd(0.19), Wd(0.19)], [0.22, Wd(0.185), Wd(0.178)], [0.7, Wd(0.15), Wd(0.145)], [1, Wd(0.13), Wd(0.13)]]));
        shapes.push(limbShape(P[s + "K"], add(P[s + "A"], Q2.mul(u, 0.06 * t)), [[0, Wd(0.13), Wd(0.13)], [0.5, Wd(0.122), Wd(0.12)], [1, Wd(0.112), Wd(0.112)]]));
        legs.push(shapes[shapes.length - 2], shapes[shapes.length - 1]);
        if (B.legs) {
          const A = P[s + "A"], sh = new Path2D();
          sh.ellipse(A[0], A[1] + t * 0.01, t * 0.13, t * 0.07, 0, 0, 6.283);
          shapes.push(sh);
          shoes.push([sh, A]);
        }
      }
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, CW, CH);
    const g = glass.getContext("2d");
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, CW, CH);
    const core = Q2.add(P.n, Q2.mul(u, -0.35 * t)), bg = g.createRadialGradient(core[0] - t * 0.25, core[1] - t * 0.35, t * 0.05, core[0], core[1], t * 2.2);
    bg.addColorStop(0, "#f4fbff");
    bg.addColorStop(0.45, "#bcd9ee");
    bg.addColorStop(1, "#7ea6c4");
    g.fillStyle = PLAIN ? "#e8f3ff" : bg;
    for (const p of shapes) g.fill(p);
    if (!PLAIN) {
      g.save();
      g.globalCompositeOperation = "source-atop";
      if (MIR) {
        {
          const c = P.head, n = Q2.perp(hu), a = PR.headW / 2 * t, b = PR.head / 2 * t;
          g.fillStyle = "rgba(40,52,66,0.55)";
          g.beginPath();
          g.ellipse(...Q2.at(c, hu, n, b * 0.55, 0), a * 1.02, b * 0.48, Math.atan2(n[1], n[0]), 0, 6.283);
          g.fill();
          g.fillStyle = "rgba(30,50,70,0.5)";
          for (const x of [-0.38, 0.38]) {
            g.beginPath();
            g.arc(...Q2.at(c, hu, n, b * 0.08, x * a), Math.max(1, t * 0.022), 0, 6.283);
            g.fill();
          }
        }
        if (!GOLF) {
          const shorts = (s) => {
            const Hp = P[s + "H"], K = P[s + "K"];
            return [Q2.lerp(P[s + "S"], Hp, 0.86), add(Hp, hside(s, 0.16 * t)), Q2.add(Q2.lerp(Hp, K, 0.5), hside(s, 0.2 * t)), Q2.add(Q2.lerp(Hp, K, 0.5), hside(s, -0.2 * t))];
          };
          const sl = shorts("l"), sr = shorts("r");
          g.fillStyle = OUT.shorts;
          g.beginPath();
          g.moveTo(...sl[0]);
          g.lineTo(...sl[1]);
          g.lineTo(...sl[2]);
          g.lineTo(...sl[3]);
          g.lineTo(...add(P.hM, Q2.mul(u, -0.22 * t)));
          g.lineTo(...sr[3]);
          g.lineTo(...sr[2]);
          g.lineTo(...sr[1]);
          g.lineTo(...sr[0]);
          g.closePath();
          g.fill();
          g.strokeStyle = OUT.band;
          g.lineWidth = t * 0.07;
          g.beginPath();
          g.moveTo(...sl[0]);
          g.lineTo(...sr[0]);
          g.stroke();
          g.strokeStyle = OUT.seam;
          g.lineWidth = Math.max(1, t * 0.018);
          g.beginPath();
          g.moveTo(...add(P.hM, Q2.mul(u, 0.06 * t)));
          g.lineTo(...add(P.hM, Q2.mul(u, -0.2 * t)));
          g.stroke();
          g.strokeStyle = "rgba(40,70,100,0.5)";
          g.lineWidth = Math.max(1, t * 0.02);
          g.lineCap = "round";
          for (const s of ["l", "r"]) {
            const c0 = add(P.n, side(s, 0.04 * t), Q2.mul(u, -0.05 * t)), c1 = add(P[s + "S"], side(s, -0.05 * t), Q2.mul(u, -0.04 * t));
            g.beginPath();
            g.moveTo(...c0);
            g.quadraticCurveTo(...add(Q2.mid(c0, c1), Q2.mul(u, -0.04 * t)), ...c1);
            g.stroke();
            const p0 = add(P.n, Q2.mul(u, -0.42 * t)), p1 = add(P.n, side(s, 0.3 * t), Q2.mul(u, -0.36 * t));
            g.beginPath();
            g.moveTo(...p0);
            g.quadraticCurveTo(...add(P.n, side(s, 0.16 * t), Q2.mul(u, -0.5 * t)), ...p1);
            g.stroke();
          }
          g.beginPath();
          g.moveTo(...add(P.n, Q2.mul(u, -0.45 * t)));
          g.lineTo(...add(P.hM, Q2.mul(u, 0.22 * t)));
          g.stroke();
        }
      } else {
        {
          const c = P.head, n = Q2.perp(hu), a = PR.headW / 2 * t, b = PR.head / 2 * t;
          g.fillStyle = "rgba(40,52,66,0.55)";
          g.beginPath();
          g.ellipse(...Q2.at(c, hu, n, b * 0.12, 0), a * 1.04, b * 0.9, Math.atan2(n[1], n[0]), 0, 6.283);
          g.fill();
        }
        const shorts = (s) => {
          const Hp = P[s + "H"], K = P[s + "K"];
          return [Q2.lerp(P[s + "S"], Hp, 0.86), add(Hp, hside(s, 0.16 * t)), Q2.add(Q2.lerp(Hp, K, 0.5), hside(s, 0.2 * t)), Q2.add(Q2.lerp(Hp, K, 0.5), hside(s, -0.2 * t))];
        };
        const sl = shorts("l"), sr = shorts("r");
        g.fillStyle = OUT.shorts;
        g.beginPath();
        g.moveTo(...sl[0]);
        g.lineTo(...sl[1]);
        g.lineTo(...sl[2]);
        g.lineTo(...sl[3]);
        g.lineTo(...add(P.hM, Q2.mul(u, -0.22 * t)));
        g.lineTo(...sr[3]);
        g.lineTo(...sr[2]);
        g.lineTo(...sr[1]);
        g.lineTo(...sr[0]);
        g.closePath();
        g.fill();
        g.strokeStyle = OUT.band;
        g.lineWidth = t * 0.07;
        g.beginPath();
        g.moveTo(...sl[0]);
        g.lineTo(...sr[0]);
        g.stroke();
        g.strokeStyle = OUT.seam;
        g.lineWidth = Math.max(1, t * 0.018);
        g.beginPath();
        g.moveTo(...add(P.hM, Q2.mul(u, 0.06 * t)));
        g.lineTo(...add(P.hM, Q2.mul(u, -0.2 * t)));
        g.stroke();
        g.strokeStyle = "rgba(40,70,100,0.55)";
        g.lineWidth = Math.max(1, t * 0.022);
        g.lineCap = "round";
        g.beginPath();
        g.moveTo(...add(P.n, Q2.mul(u, -0.04 * t)));
        g.quadraticCurveTo(...add(Q2.lerp(P.n, P.hM, 0.5), side("l", 0.01 * t)), ...add(P.hM, Q2.mul(u, 0.12 * t)));
        g.stroke();
        for (const s of ["l", "r"]) {
          const b0 = add(P.n, side(s, 0.09 * t), Q2.mul(u, -0.1 * t)), b1 = add(P.n, side(s, 0.26 * t), Q2.mul(u, -0.42 * t)), bc = add(P.n, side(s, 0.3 * t), Q2.mul(u, -0.12 * t));
          g.beginPath();
          g.moveTo(...b0);
          g.quadraticCurveTo(...bc, ...b1);
          g.stroke();
          const tr0 = add(chin, side(s, 0.06 * t), Q2.mul(hu, -0.02 * t)), tr1 = add(P[s + "S"], side(s, -0.02 * t), Q2.mul(u, 0.04 * t));
          g.beginPath();
          g.moveTo(...tr0);
          g.quadraticCurveTo(...add(Q2.mid(tr0, tr1), Q2.mul(u, 0.02 * t)), ...tr1);
          g.stroke();
        }
      }
      const sh = g.createLinearGradient(...add(P.n, side("l", 0.45 * t)), ...add(P.n, side("r", 0.45 * t)));
      sh.addColorStop(0, "rgba(255,255,255,0.35)");
      sh.addColorStop(0.35, "rgba(255,255,255,0)");
      sh.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = sh;
      g.fillRect(0, 0, CW, CH);
      g.restore();
      if (B.legs && !GOLF) for (const s of ["l", "r"]) {
        const A = P[s + "A"];
        g.fillStyle = "#20232a";
        g.beginPath();
        g.ellipse(A[0], A[1] + t * 0.05, t * 0.075, t * 0.06, 0, 0, 6.283);
        g.fill();
        g.fillStyle = "#f2ece2";
        g.fillRect(A[0] - t * 0.06, A[1] + t * 0.075, t * 0.12, t * 0.02);
      }
    }
    ctx.globalAlpha = PLAIN ? 0.05 : ALPHA;
    ctx.drawImage(glass, 0, 0);
    ctx.globalAlpha = 1;
    if (GOLF && !PLAIN) {
      dress(P, B, t, { torso, arms, legs, shoes, capC, u, sd, hd, hu, side, hside, add });
      ctx.globalAlpha = OUT.clothAlpha;
      ctx.drawImage(cloth, 0, 0);
      ctx.globalAlpha = 1;
    }
    const r = rim.getContext("2d");
    r.setTransform(1, 0, 0, 1, 0, 0);
    r.clearRect(0, 0, CW, CH);
    r.strokeStyle = PLAIN ? "rgba(235,248,255,0.12)" : "rgba(235,248,255,0.95)";
    r.lineWidth = Math.max(2, t * 0.03);
    r.lineJoin = "round";
    for (const p of shapes) r.stroke(p);
    r.globalCompositeOperation = "destination-out";
    r.fillStyle = "#000";
    for (const p of shapes) r.fill(p);
    r.globalCompositeOperation = "source-over";
    if (tier > 0 && !PLAIN) {
      ctx.save();
      ctx.shadowColor = "rgba(120,200,255,0.8)";
      ctx.shadowBlur = t * 0.05;
      ctx.drawImage(rim, 0, 0);
      ctx.restore();
    }
    ctx.drawImage(rim, 0, 0);
    drawProps(ctx, P, B, t);
    out.P = P;
    out.tpx = t;
    tex.needsUpdate = true;
  }
  return out;
}
function create2D(o) {
  var _a, _b;
  const sc = (_a = o.scale) != null ? _a : 1;
  return create(Object.assign({}, o, { scene: null, camera: { position: { x: (_b = o.x) != null ? _b : 0, y: 1.05 * sc, z: 0 } }, z: -2.1 * sc, shadow: false }));
}

export {
  create,
  create2D
};
