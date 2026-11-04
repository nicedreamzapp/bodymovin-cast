import {
  fpsGuard,
  ik2,
  loadBody,
  makePerson,
  oneEuro,
  outfitURL
} from "./_lg/chunk-WYC6O5BF.js";
import "./_lg/chunk-2BP775VP.js";
import "./_lg/chunk-CPYHHAA5.js";
import "./_lg/chunk-GEQJXPAR.js";
import {
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  Quaternion,
  SphereGeometry,
  Vector3
} from "./_lg/chunk-4IYDSAYK.js";
import "./_lg/chunk-NWIHTO7D.js";

// dist/realgolf.js
var V = (x = 0, y = 0, z = 0) => new Vector3(x, y, z);
var clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
var smooth = (x) => x * x * (3 - 2 * x);
var D2R = Math.PI / 180;
var G_SH = 0.8;
var G_HIP = 0.5;
var HINGE_TOP = 45;
var CLUB = { total: 1.14, butt: 0.06, gripGap: 0.085, head: { depth: 0.11, height: 0.06, toe: 0.11 } };
CLUB.handToSole = CLUB.total - CLUB.butt;
var SW = (k) => k[0] === "l" && k[1] >= "A" && k[1] <= "Z" ? "r" + k.slice(1) : k[0] === "r" && k[1] >= "A" && k[1] <= "Z" ? "l" + k.slice(1) : k;
function frameOf(BP, lefty) {
  const I = BP.img;
  if (!I) return null;
  const J = BP.rawJ && (typeof performance !== "undefined" ? performance.now() : 0) - (BP.rawJAt || 0) < 300 ? BP.rawJ : BP.joints;
  if (!lefty) return { I, J };
  const I2 = {}, J2 = J ? {} : null;
  for (const [k, v] of Object.entries(I)) if (v) I2[SW(k)] = [-v[0], v[1]];
  if (J) {
    for (const [k, v] of Object.entries(J)) if (v) J2[SW(k)] = [-v[0], v[1], v[2]];
  }
  return { I: I2, J: J2 };
}
var mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
var dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
var ang3 = (a, b, c) => {
  const u = a.map((x, i) => x - b[i]), v = c.map((x, i) => x - b[i]);
  const d = u.reduce((s, x, i) => s + x * v[i], 0) / (Math.hypot(...u) * Math.hypot(...v) || 1);
  return Math.acos(clamp(d, -1, 1)) / D2R;
};
function reader() {
  return { f: {}, wL0: null, tL0: null, addr: null, sideOn: 0, dir: 1, high: 0, lowT: 0, r0: 0.95, lastKey: null, th: 0, hist: [], k: null, stance: null };
}
function read(BP, S, now, o = {}) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q;
  const F = frameOf(BP, o.lefty);
  if (!F) return null;
  const { I, J } = F;
  if (!I.lShoulder || !I.rShoulder || !I.lHip || !I.rHip || !I.lHand || !I.rHand) return null;
  const filt = (key, v2, sc = 1) => {
    var _a2;
    return ((_a2 = S.f)[key] || (_a2[key] = oneEuro(1.6, 0.9, 1, 1e9)))(v2, now, sc);
  };
  const c = mid(I.lShoulder, I.rShoulder), h = mid(I.lHip, I.rHip), T = Math.max(0.02, dist(c, h));
  const hand = mid(I.lHand, I.rHand), sep = dist(I.lHand, I.rHand) / T;
  const legOk = (s) => I[s + "Knee"] && I[s + "Foot"] && I[s + "Foot"][1] < 0.99;
  const legs = ["l", "r"].filter(legOk).map((s) => dist(I[s + "Hip"], I[s + "Knee"]) + dist(I[s + "Knee"], I[s + "Foot"]));
  const Lg = legs.length ? legs.reduce((a, b) => a + b) / legs.length : S.lgT ? S.lgT * T : 1.85 * T;
  if (legs.length) S.lgT = Lg / T;
  const med = (key, v2) => {
    var _a2;
    const b = S[_a2 = "m" + key] || (S[_a2] = []);
    b.push(v2);
    if (b.length > 5) b.shift();
    return [...b].sort((p, q) => p - q)[b.length >> 1];
  };
  const wL = med("w", Math.abs(I.lShoulder[0] - I.rShoulder[0]) / Lg), hL = med("h", Math.abs(I.lHip[0] - I.rHip[0]) / Lg), tL = T / Lg;
  const dt = Math.min(0.2, Math.max(8e-3, (now - ((_a = S.at) != null ? _a : now)) / 1e3));
  S.at = now;
  S.wL0 = clamp(Math.max(S.wL0 === null ? 0.52 : S.wL0 * (1 - 4e-3 * dt), wL), 0.36, 0.66);
  S.hL0 = clamp(Math.max(S.hL0 == null ? 0.31 : S.hL0 * (1 - 4e-3 * dt), hL), 0.2, 0.4);
  if (J && J.lShoulder && J.rShoulder && Math.abs(Math.atan2(J.lShoulder[2] - J.rShoulder[2], Math.abs(J.lShoulder[0] - J.rShoulder[0]))) < 15 * D2R) {
    const a = 1 - Math.exp(-dt * 3);
    S.wL0 = clamp(S.wL0 + a * (wL - S.wL0), 0.36, 0.66);
    S.hL0 = clamp(S.hL0 + a * (hL - S.hL0), 0.2, 0.4);
  }
  S.tL0 = clamp(Math.max(S.tL0 === null ? tL : S.tL0 * (1 - 2e-3 * dt), Math.min(tL, 0.95)), 0.45, 0.95);
  const k = ((_b = o.T0) != null ? _b : 0.5) / (S.tL0 * Lg);
  S.k = k;
  const down = (hand[1] - c[1]) / T, speed = S.prevHand ? dist(hand, S.prevHand) / T / dt : 0;
  S.prevHand = hand;
  const low = down > 0.6, together = sep < 0.45, still = speed < 1.2;
  const swingPhase = o.phase || "";
  const swinging = swingPhase === "back" || swingPhase === "down" || swingPhase === "follow";
  const ratio = clamp(wL / S.wL0, 0, 1.2);
  if (low && together && still && !swinging) {
    const a = 1 - Math.exp(-dt * 4);
    S.ratioA = S.ratioA == null ? ratio : S.ratioA + a * (ratio - S.ratioA);
    S.hRatioA = S.hRatioA == null ? clamp(hL / S.hL0, 0, 1.2) : S.hRatioA + a * (clamp(hL / S.hL0, 0, 1.2) - S.hRatioA);
    S.hipXA = S.hipXA == null ? h[0] : S.hipXA + a * (h[0] - S.hipXA);
    S.r0 += a * (clamp(down, 0.5, 1.6) - S.r0);
    const st0 = [c[0] + (h[0] - c[0]) * 0.14, c[1] + (h[1] - c[1]) * 0.14];
    const ah = [(hand[0] - st0[0]) / T, (hand[1] - st0[1]) / T];
    S.aH = S.aH ? [S.aH[0] + a * (ah[0] - S.aH[0]), S.aH[1] + a * (ah[1] - S.aH[1])] : ah;
    S.addrSeen = true;
    S.addrT = now;
    const f = (hand[0] - h[0]) / T + (I.head ? (I.head[0] - c[0]) / T : 0);
    S.fwd = clamp(((_c = S.fwd) != null ? _c : -0.3) + a * (clamp(f * 4, -1, 1) - ((_d = S.fwd) != null ? _d : -0.3)), -1, 1);
  }
  const fwd = Math.abs((_e = S.fwd) != null ? _e : -1) < 0.15 ? -1 : Math.sign((_f = S.fwd) != null ? _f : -1);
  const takeaway = !swinging && now - ((_g = S.addrT) != null ? _g : -1e9) < 1500 && !(low && together && still) && ((_h = S.thPrev) != null ? _h : 0) > 12;
  const phase2 = takeaway ? "back" : swingPhase;
  const live = (swinging || takeaway) && now - ((_i = S.addrT) != null ? _i : -1e9) < 5e3;
  const atAddr0 = low && together && still && !swinging;
  const relax = atAddr0 ? 4 : !live && low ? 1.5 : 0, ra = 1 - Math.exp(-dt * relax);
  const ratioA = (_j = S.ratioA) != null ? _j : ratio;
  const sideOn = smooth(clamp((0.6 - ratioA) / 0.25));
  S.sideOn = sideOn;
  const uR = -(hand[0] - c[0]) / T, v = -(hand[1] - c[1]) / T;
  const lift = v + S.r0;
  if (lift < 0.3) {
    S.lowT += dt;
    if (S.high && S.dir === 1) {
      S.dir = -1;
      S.high = 0;
    }
    if (S.lowT > 0.35) S.dir = 1;
  } else S.lowT = 0;
  if (lift > 0.6) S.high = 1;
  if (swingPhase === "back") {
    S.dir = 1;
    S.high = 1;
  } else if (swingPhase === "follow") {
    S.dir = -1;
    S.high = 0;
  }
  const stn = [c[0] + (h[0] - c[0]) * 0.14, c[1] + (h[1] - c[1]) * 0.14];
  const hs = [(hand[0] - stn[0]) / T, (hand[1] - stn[1]) / T], aH = S.aH || [0, S.r0];
  const thFace = ((Math.atan2(-hs[0], hs[1]) - Math.atan2(-aH[0], aH[1])) / D2R + 540) % 360 - 180;
  const aL2 = aH[0] * aH[0] + aH[1] * aH[1] || 1;
  const thSide = S.dir * Math.acos(clamp((hs[0] * aH[0] + hs[1] * aH[1]) / aL2, -1, 1)) / D2R;
  let th = sideOn > 0.5 ? thSide : thFace;
  if (swinging && now - ((_k = S.addrT) != null ? _k : -1e9) < 5e3) {
    if (swingPhase === "back") {
      if (Math.abs(th) > 30) S.thSign = ((_l = S.thSign) != null ? _l : 0) * 0.8 + Math.sign(th) * 0.2;
      th = Math.abs(th);
    } else if (swingPhase === "down") th = th * (((_m = S.thSign) != null ? _m : 1) < 0 ? -1 : 1);
    else if (swingPhase === "follow") th = -Math.abs(th);
  } else if (!swinging) S.thSign = null;
  S.thPrev = th;
  const al = (r) => Math.acos(clamp(r, 0, 1)) / D2R;
  const tiltFace = al(clamp(tL / S.tL0, 0, 1));
  const tiltSide = Math.atan2(fwd * (c[0] - h[0]), h[1] - c[1]) / D2R;
  let b3 = null;
  if (J && J.lShoulder && J.rShoulder && J.lHip && J.rHip) {
    const sx = (J.lShoulder[0] + J.rShoulder[0] - J.lHip[0] - J.rHip[0]) / 2, sy = (J.lShoulder[1] + J.rShoulder[1] - J.lHip[1] - J.rHip[1]) / 2, sz = (J.lShoulder[2] + J.rShoulder[2] - J.lHip[2] - J.rHip[2]) / 2;
    b3 = med("b3", Math.acos(clamp(sy / (Math.hypot(sx, sy, sz) || 1), -1, 1)) / D2R);
  }
  const side2 = sideOn * sideOn;
  const now0 = legs.length === 2 ? tiltFace * (1 - sideOn) + tiltSide * sideOn : (_n = S.tiltOk) != null ? _n : 5;
  const inst = clamp(b3 == null ? now0 : b3 * (1 - side2) + now0 * side2, -5, 55);
  if (legs.length === 2 || b3 != null) S.tiltOk = inst;
  const hgt = I.head ? med("hg", h[1] - I.head[1]) : null;
  if (low && together && still && !swinging) {
    const a = 1 - Math.exp(-dt * 4);
    S.bendA = S.bendA == null ? inst : S.bendA + a * (inst - S.bendA);
    if (hgt != null) S.hgtA = S.hgtA == null ? hgt : S.hgtA + a * (hgt - S.hgtA);
  }
  let tilt = (_o = S.tiltOk) != null ? _o : 5;
  if (live && S.bendA != null) {
    tilt = S.bendA;
    if (hgt != null && S.hgtA > 0.02) tilt = Math.acos(clamp(Math.cos(clamp(S.bendA, 0, 70) * D2R) * hgt / S.hgtA, -1, 1)) / D2R;
    tilt = Math.min(tilt, S.bendA + 4);
    if (phase2 !== "follow") tilt = Math.max(tilt, S.bendA - 10);
  }
  tilt = clamp(tilt, 3, 55);
  const bendHeld = clamp((_p = S.bendA) != null ? _p : tilt, 0, 60) * D2R;
  const tauTrack = (key, w, wA, W0, gain, lim) => {
    var _a2;
    const rA = clamp(wA / W0, 0, 1.5), sq = smooth(clamp((rA - 0.7) / 0.15));
    const W = Math.max(wA, W0 * (1 - sq) + wA * sq), cA = clamp(wA / W, 0, 1);
    const sa = Math.sqrt(1 - cA * cA), A = Math.hypot(cA, sa * Math.cos(bendHeld)) || 1e-3, phi = Math.atan2(sa * Math.cos(bendHeld), cA) / D2R;
    const q = Math.acos(clamp(w / W / A, 0, 1)) / D2R;
    const prev = live ? (_a2 = S["tau" + key]) != null ? _a2 : 0 : 0, bias = phase2 === "back" ? 4 : phase2 === "down" ? -6 : phase2 === "follow" ? -3 : 0;
    let best = prev, bc = 1e9;
    for (const s of [1, -1]) for (const v2 of [q, -q, 180 - q, q - 180]) {
      const t = s * (v2 + phi) * 1;
      if (Math.abs(t) > lim) continue;
      if (live && phase2 === "back" && t < prev - 4) continue;
      if (live && (phase2 === "down" || phase2 === "follow") && t > prev + 4) continue;
      const cst = Math.abs(t - (prev + bias));
      if (cst < bc) {
        bc = cst;
        best = t;
      }
    }
    if (live && Math.abs(best - prev) > 30) best = prev + Math.sign(best - prev) * 30;
    if (!live) best = Math.abs(best);
    S["tau" + key] = best;
    return best;
  };
  const yaw3 = (a, b) => J && J[a] && J[b] ? Math.atan2(J[a][2] - J[b][2], J[a][0] - J[b][0]) / D2R : null;
  const wrap = (d) => (d + 540) % 360 - 180;
  const y3S0 = yaw3("lShoulder", "rShoulder"), y3H0 = yaw3("lHip", "rHip");
  const y3S = y3S0 == null ? null : med("ys", y3S0), y3H = y3H0 == null ? null : med("yh", y3H0);
  if (relax) {
    if (y3S != null) S.y3S = S.y3S == null ? y3S : S.y3S + ra * wrap(y3S - S.y3S);
    if (y3H != null) S.y3H = S.y3H == null ? y3H : S.y3H + ra * wrap(y3H - S.y3H);
  }
  const combine = (key, tw, y, yA, gain, lim, capBack, capThru) => {
    var _a2;
    let t = tw;
    if (live && y != null && yA != null) {
      const d = wrap(y - yA), t3 = [d, d - 180, d + 180].reduce((a, b) => Math.abs(b - t) < Math.abs(a - t) ? b : a);
      if (phase2 === "follow") t = Math.min(t, t3);
      else if (t3 > 0) t = Math.max(t, t3);
    }
    const hk = "hold" + key;
    if (live && phase2 === "back") t = S[hk] = Math.max((_a2 = S[hk]) != null ? _a2 : 0, t);
    else if (live && phase2 === "down" && S[hk] > 0) {
      S[hk] *= Math.exp(-dt * 12);
      t = t >= 0 ? Math.max(t, S[hk]) : t;
    } else if (live && phase2 === "follow") {
      if (!(S[hk] <= 0)) S[hk] = 0;
      if (t < 0) t = S[hk] = Math.min(S[hk], t);
      else t = Math.min(t, S[hk] * 0.7 + t * 0.3);
    } else S[hk] = null;
    const m = Math.abs(t), cap = t >= 0 ? capBack : capThru;
    return Math.sign(t) * Math.min(m + gain * Math.max(0, m - 10), Math.max(m, cap));
  };
  S.wSA = S.wSA == null ? wL : S.wSA + ra * (wL - S.wSA);
  S.wHA = S.wHA == null ? hL : S.wHA + ra * (hL - S.wHA);
  const turnS = clamp(combine("S", tauTrack("S", wL, S.wSA, S.wL0, 0, 130), y3S, S.y3S, G_SH, 130, 100, 100), -100, 100);
  let hipS = combine("H", tauTrack("H", hL, S.wHA, S.hL0, 0, 130), y3H, S.y3H, G_HIP, 130, 55, 80);
  if (live && turnS > 0) hipS = Math.max(hipS, 0.5 * turnS);
  hipS = clamp(hipS, -80, 55);
  const turn = Math.abs(turnS), hipTurn = Math.abs(hipS);
  let bend = 0;
  if (sideOn < 0.5) bend = Math.atan2(I.lShoulder[1] - I.rShoulder[1], Math.abs(I.lShoulder[0] - I.rShoulder[0]) + 1e-4) / D2R * -1;
  else if (J && J.lShoulder && J.rShoulder) bend = Math.atan2(J.lShoulder[1] - J.rShoulder[1], Math.hypot(J.lShoulder[0] - J.rShoulder[0], J.lShoulder[2] - J.rShoulder[2]) + 1e-4) / D2R;
  bend = clamp(bend, -15, 25);
  const knee = (s) => {
    var _a2;
    if (!(I[s + "Hip"] && I[s + "Knee"] && I[s + "Foot"] && I[s + "Foot"][1] < 0.99)) return (_a2 = S["knee" + s]) != null ? _a2 : 172;
    let a = ang3(I[s + "Hip"], I[s + "Knee"], I[s + "Foot"]);
    if (sideOn < 0.5 && J && J[s + "Hip"] && J[s + "Knee"] && J[s + "Foot"]) {
      const q = ang3(J[s + "Hip"], J[s + "Knee"], J[s + "Foot"]);
      if (Math.abs(q - a) < 25) a = q;
    }
    return S["knee" + s] = clamp(a, 110, 180);
  };
  let stance = (_q = S.stance) != null ? _q : 0.42;
  if (sideOn < 0.5 && I.lFoot && I.rFoot && legs.length === 2) stance = clamp(Math.abs(I.lFoot[0] - I.rFoot[0]) * k, 0.2, 0.8);
  const hipShift = sideOn < 0.5 && S.hipXA != null ? clamp((h[0] - S.hipXA) * k, -0.18, 0.18) : 0;
  const handDrop = (hand[1] - c[1]) * k, handLat = (hand[0] - c[0]) * k, handFwdSide = fwd * (hand[0] - c[0]) * k;
  const head = I.head ? { dy: (I.head[1] - c[1]) * k, dx: (I.head[0] - c[0]) * k, fx: fwd * (I.head[0] - c[0]) * k } : null;
  const out = {
    T,
    k,
    sideOn,
    ratio,
    ratioA,
    sep,
    together,
    low,
    still,
    th: filt("th", [th])[0],
    turnS: filt("turn", [turnS])[0],
    hipS: filt("hip", [hipS])[0],
    tilt: filt("tilt", [tilt])[0],
    bend: filt("bend", [bend])[0],
    knee: (() => {
      let a = knee("l"), b = knee("r");
      const thru = live && (swingPhase === "follow" || swingPhase === "down" && th < -20);
      if (thru && b > a) {
        const t = a;
        a = b;
        b = t;
      }
      a = clamp(a, 148, 180);
      b = clamp(b, thru ? 125 : 148, 180);
      S.post = thru ? Math.min(1, (S.post || 0) + dt * 4) : Math.max(0, (S.post || 0) - dt * 2);
      return { l: filt("knl", [a])[0], r: filt("knr", [b])[0], post: S.post };
    })(),
    stance: filt("st", [stance])[0],
    hipShift: filt("hs", [hipShift])[0],
    hand: { drop: filt("hd", [handDrop])[0], lat: filt("hl", [handLat])[0], fwdSide: filt("hf", [handFwdSide])[0] },
    head: head && { dy: filt("ny", [head.dy])[0], dx: filt("nx", [head.dx])[0], fx: filt("nf", [head.fx])[0] },
    atAddress: low && together && still && !swinging
  };
  out.live = live;
  out.turn = Math.abs(out.turnS);
  out.hipTurn = Math.abs(out.hipS);
  void turn;
  void hipTurn;
  if (Math.abs(out.th) > 178) out.th = Math.sign(out.th) * 178;
  return out;
}
function build(R, H, dims, ball, ground) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const L = dims.len.l, T0 = dims.T0, SH = 0.2, HIP = 0.11, ANK = 0.078;
  const arm1 = L.up, arm2 = L.fore + 0.075;
  const tau = R.tilt * D2R, sig = R.bend * D2R;
  const u = V(Math.sin(tau), Math.cos(tau), Math.tan(sig) * Math.cos(tau)).normalize();
  const sgn = Math.sign(R.th || 0) || 1;
  const tS = (_a = R.turnS) != null ? _a : sgn * R.turn, hS = (_b = R.hipS) != null ? _b : sgn * R.hipTurn;
  const yawSh = -tS * D2R, yawHip = -hS * D2R;
  if (!H.addr || R.atAddress || H.forceAddr) {
    const N0x = T0 * Math.sin(tau);
    const zC = -0.05 + R.stance / 2;
    const lead = V(N0x - 0.12, 0, zC - R.stance / 2), trail = V(N0x - 0.12, 0, zC + R.stance / 2);
    const A2 = H.addr || (H.addr = {});
    const k = A2.init ? 1 - Math.exp(-((_c = H.dt) != null ? _c : 0.016) * 3) : 1;
    A2.init = true;
    A2.sinA = ((_d = A2.sinA) != null ? _d : Math.sin(tau)) + (Math.sin(tau) - ((_e = A2.sinA) != null ? _e : Math.sin(tau))) * k;
    A2.ankL = (A2.ankL || lead.clone()).lerp(lead, k);
    A2.ankR = (A2.ankR || trail.clone()).lerp(trail, k);
    A2.zC = ((_f = A2.zC) != null ? _f : zC) + (zC - ((_g = A2.zC) != null ? _g : zC)) * k;
  }
  const A = H.addr;
  const legLen = (kneeDeg) => {
    const a2 = L.thigh, b2 = L.calf;
    return Math.sqrt(a2 * a2 + b2 * b2 - 2 * a2 * b2 * Math.cos(kneeDeg * D2R));
  };
  const pel = V(T0 * (A.sinA - Math.sin(tau)), 0, A.zC + R.hipShift * -1);
  pel.x = Math.min(pel.x, (A.ankL.x + A.ankR.x) / 2 + 0.03);
  const hipAxis = V(0, 0, 1).applyAxisAngle(V(0, 1, 0), yawHip);
  const hipL0 = pel.clone().addScaledVector(hipAxis, -HIP), hipR0 = pel.clone().addScaledVector(hipAxis, HIP);
  const hy = (s) => {
    const hp = s === "l" ? hipL0 : hipR0, an = s === "l" ? A.ankL : A.ankR, Lg = legLen(R.knee[s]);
    const dx = hp.x - an.x, dz = hp.z - an.z;
    return Math.sqrt(Math.max(0.05, Lg * Lg - dx * dx - dz * dz));
  };
  const post = clamp((_h = R.knee.post) != null ? _h : 0), yL = hy("l"), yR = hy("r");
  const pelY = ground + ANK + Math.min(yL, yR) + post * Math.max(0, yL - Math.min(yL, yR));
  const heelUp = post * clamp(yL - yR, 0, 0.11);
  const off = V(0, pelY, 0);
  const P = pel.clone().add(off), lHip = hipL0.clone().add(off), rHip = hipR0.clone().add(off);
  const ankL = A.ankL.clone().setY(ground + ANK), ankR = A.ankR.clone().setY(ground + ANK + heelUp);
  const rToe = heelUp > 5e-3 ? V(A.ankR.x + 0.05, ground + 0.02, A.ankR.z - 0.13) : null;
  if (rToe) ankR.add(V(0.02, 0, -0.04).multiplyScalar(heelUp / 0.11));
  const N = P.clone().addScaledVector(u, T0);
  const shAxis = V(0, 0, 1).addScaledVector(u, -u.z).normalize().applyAxisAngle(u, yawSh);
  const lSh = N.clone().addScaledVector(shAxis, -SH), rSh = N.clone().addScaledVector(shAxis, SH);
  const chestF = V().crossVectors(u, shAxis).negate().normalize();
  const reach = arm1 + arm2;
  const hd0 = CLUB.head, heel0 = V(ball.x - hd0.toe * 0.5, ground + 0.012, ball.z + 0.021 + hd0.depth * 0.45);
  let HA = null;
  for (let kk = 0.93; kk >= 0.7; kk -= 0.01) {
    HA = V(N.x + 0.04, N.y - reach * kk, N.z - 0.05);
    const dy = HA.y - heel0.y, dz = HA.z - heel0.z, Lh = CLUB.handToSole, hz = Math.sqrt(Math.max(0.01, Lh * Lh - dy * dy - dz * dz));
    const trailP = HA.clone().add(V(hz, -dy, -dz).multiplyScalar(CLUB.gripGap / Lh));
    if (trailP.distanceTo(rSh) <= reach * 0.985 && HA.distanceTo(lSh) <= reach * 0.985) break;
  }
  const hd = CLUB.head;
  const heel = V(ball.x - hd.toe * 0.5, ground + 0.012, ball.z + 0.021 + hd.depth * 0.45);
  if (R.atAddress || H.forceAddr || H.dx == null) {
    const dy = HA.y - heel.y, dz = HA.z - heel.z, Lh = CLUB.handToSole;
    const hz = Math.sqrt(Math.max(0.01, Lh * Lh - dy * dy - dz * dz));
    const want = heel.x - hz - HA.x;
    H.dx = H.dx == null || H.forceAddr ? want : H.dx + (want - H.dx) * (1 - Math.exp(-((_i = H.dt) != null ? _i : 0.016) * 3));
    const C = N.clone().addScaledVector(u, -0.07);
    const D = HA.clone().sub(C), Rr = D.length();
    D.normalize();
    const E = V(0, 0, 1).addScaledVector(D, -D.z).normalize();
    const Nn = V().crossVectors(D, E);
    const cd0 = heel.clone().sub(V(H.dx, 0, 0)).sub(HA).normalize();
    H.plane = { C: C.clone(), D, E, Nn, R: Rr, a: cd0.dot(D), b: cd0.dot(E), c: cd0.dot(Nn), N: N.clone() };
  }
  const shift = V(H.dx, 0, 0);
  const pl = H.plane;
  const th = R.th * D2R;
  const Cn = pl.C.clone().add(N.clone().sub(pl.N));
  const hands = Cn.clone().addScaledVector(pl.D, pl.R * Math.cos(th)).addScaledVector(pl.E, pl.R * Math.sin(th));
  const hinge = Math.sign(th) * (Math.PI / 2) * smooth(clamp(Math.abs(R.th) / 100)) + (th > 0 ? HINGE_TOP * D2R * smooth(clamp((R.th - 80) / 70)) : 0);
  const phi = th + hinge;
  const a = pl.a * Math.cos(phi) - pl.b * Math.sin(phi), b = pl.a * Math.sin(phi) + pl.b * Math.cos(phi);
  const cd = pl.D.clone().multiplyScalar(a).addScaledVector(pl.E, b).addScaledVector(pl.Nn, pl.c).normalize();
  const dcd = pl.D.clone().multiplyScalar(-pl.a * Math.sin(phi) - pl.b * Math.cos(phi)).addScaledVector(pl.E, pl.a * Math.cos(phi) - pl.b * Math.sin(phi));
  dcd.addScaledVector(cd, -dcd.dot(cd)).normalize();
  const leadHand = hands, trailHand = hands.clone().addScaledVector(cd, CLUB.gripGap);
  const down = u.clone().negate(), inward = V(-1, 0, 0);
  const lPole = down.clone().addScaledVector(inward, 0.4).addScaledVector(shAxis, -0.3).normalize();
  const rPole = down.clone().addScaledVector(inward, 0.5).addScaledVector(shAxis, 0.35).normalize();
  const steady = (key, sh, hnd, pole) => {
    const d = hnd.clone().sub(sh).normalize(), b2 = pole.clone().addScaledVector(d, -pole.dot(d)), prev = H["pole" + key];
    if (prev) {
      const pp = prev.clone().addScaledVector(d, -prev.dot(d)), bl = b2.length();
      if (pp.lengthSq() > 1e-6 && bl < 0.7) b2.addScaledVector(pp.normalize(), (0.7 - bl) * 4);
    }
    if (b2.lengthSq() < 1e-8) return prev || pole;
    b2.normalize();
    H["pole" + key] = b2.clone();
    return b2;
  };
  const ikArm = (sh, hnd, pole) => {
    const r = ik2(sh, hnd, arm1, arm2, pole);
    const wrist = r.elbow.clone().addScaledVector(r.end.clone().sub(r.elbow).normalize(), L.fore);
    return { elbow: r.elbow, wrist, end: r.end };
  };
  const lPoleS = steady("l", lSh, leadHand, lPole), rPoleS = steady("r", rSh, trailHand, rPole);
  const lA = ikArm(lSh, leadHand, lPoleS), rA = ikArm(rSh, trailHand, rPoleS);
  const hDir = (A2) => A2.end.clone().sub(A2.elbow).normalize().add(cd).normalize();
  const kneePole = (s) => V(1, 0, s === "l" ? -0.25 : 0.25).normalize();
  const lK = ik2(lHip, ankL, L.thigh, L.calf, kneePole("l")).elbow, rK = ik2(rHip, ankR, L.thigh, L.calf, kneePole("r")).elbow;
  const neckTop = N.clone().addScaledVector(u, 0.07);
  const headC = neckTop.clone().addScaledVector(u, 0.1).addScaledVector(chestF, 0.1 * (((_j = dims.neckTilt) != null ? _j : 0.15) + 0.08));
  let nose;
  if (R.head) {
    const ny = Math.min(headC.y - 0.015, headC.y - 0.015 + (N.y - R.head.dy) - (N.y + 0.25)), nz = N.z + -R.head.dx * (1 - R.sideOn), nxs = N.x + ((_k = R.head.fx) != null ? _k : -R.head.dx) * R.sideOn;
    const nx = R.sideOn > 0.5 ? nxs : headC.x + 0.1;
    nose = V(nx, ny, nz);
    if (nose.distanceTo(headC) < 0.05) nose = headC.clone().add(V(0.1, -0.05, 0));
    const f = chestF.clone().setY(0);
    if (f.lengthSq() < 1e-6) f.set(1, 0, 0);
    f.normalize();
    const d = nose.clone().sub(headC), a2 = d.dot(f);
    if (a2 < 0.08) d.addScaledVector(f, 0.08 - a2);
    const fa = d.dot(f), side = d.clone().addScaledVector(f, -fa).setY(0), sl = side.length();
    if (sl > fa) d.addScaledVector(side, (fa - sl) / sl);
    nose = headC.clone().add(d);
  } else nose = headC.clone().add(V(0.09, -0.06, 0));
  const J = {
    lHip,
    rHip,
    lShoulder: lSh,
    rShoulder: rSh,
    lElbow: lA.elbow,
    rElbow: rA.elbow,
    lWrist: lA.wrist,
    rWrist: rA.wrist,
    lKnee: lK,
    rKnee: rK,
    lAnkle: ankL,
    rAnkle: ankR,
    head: headC,
    nose,
    lHandDir: hDir(lA),
    rHandDir: hDir(rA),
    lPalm: dcd.clone(),
    rPalm: dcd.clone().negate(),
    lGrip: leadHand.clone(),
    rGrip: trailHand.clone(),
    lPoleDir: lPoleS,
    rPoleDir: rPoleS,
    lGripLen: 0.075,
    rGripLen: 0.075,
    lFlare: 0.35,
    rFlare: 0.08,
    pelvisTip: 0.75,
    ...rToe ? { rToe } : {}
  };
  for (const k in J) if (J[k] && J[k].isVector3 && !/Dir$|Palm$/.test(k)) J[k].add(shift);
  const butt = leadHand.clone().addScaledVector(cd, -CLUB.butt).add(shift), hosel = leadHand.clone().addScaledVector(cd, CLUB.handToSole).add(shift);
  return { J, club: { butt, hosel, dir: cd, lead: leadHand.clone().add(shift), trail: trailHand.clone().add(shift) }, shift: H.dx, u, N: N.clone().add(shift) };
}
function makeClub() {
  const g = new Group();
  g.name = "realclub";
  const std = (c, r, m) => new MeshStandardMaterial({ color: c, roughness: r, metalness: m });
  const cyl = (r0, r1, m) => {
    const o = new Mesh(new CylinderGeometry(r1, r0, 1, 14, 1), m);
    o.castShadow = true;
    g.add(o);
    return o;
  };
  const shaft = cyl(75e-4, 45e-4, std(14278114, 0.25, 1)), grip = cyl(0.0135, 0.011, std(1447450, 0.9, 0));
  const head = new Group();
  g.add(head);
  const body = new Mesh(new SphereGeometry(1, 28, 16), std(1974310, 0.3, 0.8));
  body.scale.set(CLUB.head.toe / 2, CLUB.head.height / 2, CLUB.head.depth / 2);
  body.position.set(CLUB.head.toe / 2, CLUB.head.height / 2, CLUB.head.depth * 0.45 - 0.01);
  body.castShadow = true;
  head.add(body);
  const face = new Mesh(new PlaneGeometry(CLUB.head.toe * 0.8, CLUB.head.height * 0.75), std(9080726, 0.35, 0.9));
  face.position.set(CLUB.head.toe * 0.5, CLUB.head.height * 0.5, -6e-3);
  face.rotation.y = Math.PI;
  head.add(face);
  const UP = V(0, 1, 0), _a = V();
  const bone = (o, a, b) => {
    _a.subVectors(b, a);
    const L = _a.length() || 1e-4;
    o.position.addVectors(a, b).multiplyScalar(0.5);
    o.scale.set(1, L, 1);
    o.quaternion.setFromUnitVectors(UP, _a.divideScalar(L));
  };
  const st = { sole: null };
  return {
    group: g,
    head,
    // place it: butt, hosel (where the shaft meets the head); the head keeps the sole frame it had at address
    set(cl, atAddress) {
      bone(grip, cl.butt, cl.butt.clone().addScaledVector(cl.dir, 0.27));
      bone(shaft, cl.butt.clone().addScaledVector(cl.dir, 0.25), cl.hosel);
      const shaftQ = new Quaternion().setFromUnitVectors(UP, cl.dir.clone().negate());
      if (atAddress || !st.sole) st.sole = shaftQ.clone().invert();
      head.quaternion.copy(shaftQ).multiply(st.sole);
      head.position.copy(cl.hosel);
    }
  };
}
var IDLE_FRAME = { "i": { "lHip": [0.4128, 0.5034], "rHip": [0.3382, 0.5057], "lShoulder": [0.4547, 0.3342], "rShoulder": [0.2958, 0.3362], "head": [0.3752, 0.2262], "rHand": [0.388, 0.5638], "lHand": [0.3994, 0.5668], "lForearm": [0.4515, 0.4509], "rForearm": [0.3272, 0.4495], "lKnee": [0.4292, 0.6451], "lFoot": [0.4388, 0.7857], "rKnee": [0.3217, 0.6469], "rFoot": [0.3123, 0.7865] }, "j": { "lHip": [0.101, -4e-3, -2.027], "rHip": [-0.093, 4e-3, -2.025], "lShoulder": [0.186, 0.408, -1.775], "rShoulder": [-0.187, 0.399, -1.765], "head": [3e-3, 0.633, -1.677], "rHand": [0.031, -0.121, -1.681], "lHand": [0.063, -0.136, -1.677], "lForearm": [0.174, 0.127, -1.726], "rForearm": [-0.114, 0.13, -1.728], "lKnee": [0.131, -0.357, -1.878], "lFoot": [0.172, -0.755, -2.022], "rKnee": [-0.127, -0.363, -1.898], "rFoot": [-0.166, -0.76, -2.019], "root": [1e-3, 0, -2] } };
var DEMO = typeof location !== "undefined" && new URLSearchParams(location.search).get("demo") === "1";
function create(o) {
  var _a;
  const st = { ready: false, failed: false, S: reader(), H: {}, person: null, club: makeClub(), last: null };
  st.club.group.visible = false;
  o.scene.add(st.club.group);
  const url = o.url || outfitURL("golfer", o.tier);
  const guard = fpsGuard({ min: (_a = o.minFps) != null ? _a : 28, onLow: (fps) => {
    if (st.person) st.person.setLOD(1);
    o.onLowFps && o.onLowFps(fps);
  } });
  function fail(why) {
    st.failed = true;
    if (st.person) {
      st.person.root.visible = false;
      if (st.person.shadow) st.person.shadow.visible = false;
    }
    st.club.group.visible = false;
    o.onFallback && o.onFallback(why);
  }
  loadBody(url).then((t) => {
    const p = makePerson(t, { look: o.look || "glass", outfit: "golfer", lod: o.tier === 0 ? 1 : 0, groundY: o.ground, clavFollow: true, rollMax: 1.3, plainLook: o.plainLook });
    p.grip("l", "club");
    p.grip("r", "club");
    o.scene.add(p.root);
    if (p.shadow) o.scene.add(p.shadow);
    st.person = p;
    st.ready = true;
    p.opacity = 0;
  }).catch((e) => fail("load " + e));
  function apply(R, B, lefty) {
    const J = {};
    for (const [k, v] of Object.entries(B.J)) {
      const kk = lefty ? SW(k) : k;
      if (v && v.isVector3) {
        const w = v.clone();
        if (lefty) w.x = -w.x;
        J[kk] = w;
      } else J[kk] = v;
    }
    st.person.pose(J);
    const cl = { butt: B.club.butt.clone(), hosel: B.club.hosel.clone(), dir: B.club.dir.clone() };
    if (lefty) {
      cl.butt.x *= -1;
      cl.hosel.x *= -1;
      cl.dir.x *= -1;
    }
    st.club.set(cl, R.atAddress);
    st.club.head.scale.x = lefty ? -1 : 1;
    return J;
  }
  function idle(lefty) {
    const key = lefty ? "L" : "R";
    if (!st.idle) st.idle = {};
    if (!st.idle[key]) {
      const S = reader(), H = {}, BPi = { img: IDLE_FRAME.i, joints: IDLE_FRAME.j };
      let R = null, B = null;
      for (let k = 0; k < 30; k++) {
        const r = read(BPi, S, 1e3 + k * 33, { lefty: false, phase: "idle", T0: st.person.T0 });
        if (r) {
          R = r;
          R.head = null;
          H.dt = 0.033;
          B = build(R, H, { len: st.person.restLen, T0: st.person.T0, neckTilt: st.person.neckTilt }, o.ball, o.ground);
        }
      }
      st.idle[key] = R && B ? { R, B } : null;
    }
    return st.idle[key];
  }
  return {
    st,
    get ready() {
      return st.ready && !st.failed;
    },
    update(now, rdt, info = {}) {
      var _a2, _b, _c;
      if (!st.ready || st.failed) return null;
      guard.tick(now);
      const lefty = !!(o.lefty && o.lefty());
      if (st.lefty !== lefty) {
        st.lefty = lefty;
        st.S = reader();
        st.H = {};
        st.resting = null;
      }
      const fresh = o.BP.img && o.BP.img.lShoulder && performance.now() - (o.BP.imgAt || 0) < 700 && (o.BP.live || o.BP.simulating) && o.BP.present !== false;
      const held = !fresh && st.last && performance.now() - (o.BP.imgAt || 0) < 1500 && o.BP.present !== false;
      const want = fresh || held || DEMO ? 1 : 0, dtA = Math.min(0.1, Math.max(0, (now - ((_a2 = st.aAt) != null ? _a2 : now)) / 1e3));
      st.aAt = now;
      st.A = ((_b = st.A) != null ? _b : 0) + (want - ((_c = st.A) != null ? _c : 0)) * Math.min(1, dtA * 6);
      st.person.opacity = st.A;
      st.club.group.visible = st.A > 0.05;
      if (held) return st.last;
      if (!fresh) {
        if (st.resting !== (lefty ? "L" : "R")) {
          const I = idle(lefty);
          if (I) {
            apply(I.R, I.B, lefty);
            st.resting = lefty ? "L" : "R";
          }
        }
        st.last = null;
        st.lastKey = null;
        return null;
      }
      if (st.resting) {
        st.resting = null;
        st.S = reader();
        st.H = {};
      }
      const key = o.BP.imgDrawAt && o.BP.imgDrawAt >= o.BP.imgAt ? o.BP.imgDrawAt : o.BP.imgAt;
      if (key === st.lastKey && st.last) return st.last;
      st.lastKey = key;
      const R = read(o.BP, st.S, now, { lefty, phase: info.phase, T0: st.person.T0 });
      if (!R) return null;
      if (info.th != null) R.th = info.th;
      st.H.dt = rdt;
      const B = build(R, st.H, { len: st.person.restLen, T0: st.person.T0, neckTilt: st.person.neckTilt }, o.ball, o.ground);
      const J = apply(R, B, lefty);
      st.last = { R, B, J };
      return st.last;
    },
    // Matt's camera (10/22 3:40-3:47 AM): golf's ORIGINAL down-the-line view (BAY_CAM before the face-on change, still the
    // title's): behind the ball, x = +0.3 (a lefty -0.3), 1.35 m high, 4.2 m back, looking out at the range and flags
    // (0.1, -6.5, -60), fov 38; an upright phone stands back at (-0.5, 1.45, 5.6). The same camera holds for address, the
    // swing and the start of the flight. The golfer stands side-on left of the ball (a lefty right of it), in profile;
    // his body never crosses between this camera and the ball (tests: every bone >= 0.30 m to the golfer's side of x = 0).
    aimCam(cam, s = 1, tall = false) {
      if (tall) cam.pos.set(s * -0.5, 1.45, 5.6);
      else cam.pos.set(s * 0.3, 1.35, 4.2);
      cam.look.set(s * 0.1, -6.5, -60);
    }
  };
}
export {
  CLUB,
  G_HIP,
  G_SH,
  HINGE_TOP,
  build,
  create,
  makeClub,
  read,
  reader
};
