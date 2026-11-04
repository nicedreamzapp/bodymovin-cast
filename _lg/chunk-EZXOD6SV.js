import {
  BONES,
  ankleHeight,
  loadBody,
  makePerson,
  outfitURL
} from "./chunk-WYC6O5BF.js";
import {
  Group,
  Vector3
} from "./chunk-4IYDSAYK.js";

// dist/realnpc.js
var V = (x = 0, y = 0, z = 0) => new Vector3(x, y, z);
var D = Math.PI / 180;
var dirOf = (pitch, out, side) => V(side * Math.sin(out * D) * Math.cos(pitch * D), -Math.cos(pitch * D) * Math.cos(out * D), Math.sin(pitch * D) * Math.cos(out * D)).normalize();
function jointsFromAngles(P, A, ankle = 0.09) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  const R = P.rest, B = BONES, L = P.restLen;
  const hw = Math.abs(R[B.l.thigh].p.x - R[B.r.thigh].p.x) / 2, sw = Math.abs(R[B.l.up].p.x - R[B.r.up].p.x) / 2;
  const J = {};
  const leg = {};
  for (const s of ["l", "r"]) {
    const sg = s === "l" ? 1 : -1, a = A[s] || {}, hip = V(sg * hw, 0, 0);
    const td = dirOf((_a = a.thigh) != null ? _a : 0, (_b = a.out) != null ? _b : 4, sg), cd = dirOf(((_c = a.thigh) != null ? _c : 0) - ((_d = a.knee) != null ? _d : 0), (_e = a.out) != null ? _e : 4, sg);
    const knee = hip.clone().addScaledVector(td, L[s].thigh), an = knee.clone().addScaledVector(cd, L[s].calf);
    leg[s] = { hip, knee, an };
  }
  const lift = ankle - Math.min(leg.l.an.y, leg.r.an.y) + ((_f = A.air) != null ? _f : 0);
  for (const s of ["l", "r"]) {
    J[s + "Hip"] = leg[s].hip.setY(leg[s].hip.y + lift);
    J[s + "Knee"] = leg[s].knee.setY(leg[s].knee.y + lift);
    J[s + "Ankle"] = leg[s].an.setY(leg[s].an.y + lift);
  }
  const hipM = V(0, lift, 0), lean = ((_g = A.lean) != null ? _g : 3) * D, tw = ((_h = A.twist) != null ? _h : 0) * D;
  const up = V(0, Math.cos(lean), Math.sin(lean)), shM = hipM.clone().addScaledVector(up, P.T0);
  const sx = V(Math.cos(tw), 0, -Math.sin(tw));
  J.lShoulder = shM.clone().addScaledVector(sx, sw);
  J.rShoulder = shM.clone().addScaledVector(sx, -sw);
  const fwd = V().crossVectors(sx, up).normalize();
  J.head = shM.clone().addScaledVector(V(0, 1, 0).lerp(up, 0.4).normalize(), 0.24).addScaledVector(fwd, 0.24 * (((_i = P.neckTilt) != null ? _i : 0) + 0.06));
  J.nose = J.head.clone().addScaledVector(fwd, 0.1).add(V(0, -0.02, 0));
  const basis = (v, sg) => sx.clone().multiplyScalar(v.x * sg).addScaledVector(up, v.y).addScaledVector(fwd, v.z);
  for (const s of ["l", "r"]) {
    const sg = s === "l" ? 1 : -1, a = A[s] || {}, ab = (_j = a.armOut) != null ? _j : 10;
    const ud = basis(dirOf((_k = a.arm) != null ? _k : 0, ab, 1), sg), fd = basis(dirOf(((_l = a.arm) != null ? _l : 0) + ((_m = a.elbow) != null ? _m : 15), ab * 0.6, 1), sg);
    const el = J[s + "Shoulder"].clone().addScaledVector(ud, L[s].up), wr = el.clone().addScaledVector(fd, L[s].fore);
    J[s + "Elbow"] = el;
    J[s + "Wrist"] = wr;
    J[s + "HandDir"] = fd.clone();
  }
  return J;
}
var lerp = (a, b, k) => a + (b - a) * k;
function blend(A, B, k) {
  const out = {};
  for (const key of /* @__PURE__ */ new Set([...Object.keys(A), ...Object.keys(B)])) {
    const a = A[key], b = B[key];
    if (typeof a === "object" || typeof b === "object") out[key] = blend(a || {}, b || {}, k);
    else out[key] = lerp(a != null ? a : 0, b != null ? b : 0, k);
  }
  return out;
}
var sm = (k) => k * k * (3 - 2 * k);
function sample(clip, t) {
  const T = clip[clip.length - 1][0];
  if (clip.loop) t = (t % T + T) % T;
  else t = Math.max(0, Math.min(T, t));
  for (let i = 0; i < clip.length - 1; i++) if (t <= clip[i + 1][0]) {
    const [t0, A] = clip[i], [t1, B] = clip[i + 1];
    return blend(A, B, sm((t - t0) / Math.max(1e-6, t1 - t0)));
  }
  return clip[clip.length - 1][1];
}
var KICK = [
  [0, { lean: 10, l: { thigh: 25, knee: 25, arm: -25, armOut: 15, elbow: 70 }, r: { thigh: -20, knee: 40, arm: 25, armOut: 12, elbow: 70 } }],
  [0.45, { lean: 6, twist: -10, l: { thigh: 12, knee: 22, arm: 10, armOut: 80, elbow: 25 }, r: { thigh: -30, knee: 95, arm: -30, armOut: 20, elbow: 45 } }],
  [0.6, { lean: 14, twist: 0, l: { thigh: 8, knee: 25, arm: 5, armOut: 85, elbow: 20 }, r: { thigh: 30, knee: 25, arm: -15, armOut: 25, elbow: 40 } }],
  [1, { lean: 20, twist: 10, air: 0.02, l: { thigh: -5, knee: 10, arm: 0, armOut: 85, elbow: 20 }, r: { thigh: 95, knee: 48, arm: -25, armOut: 30, elbow: 50 } }]
];
var RUN = Object.assign([
  [0, { lean: 8, l: { thigh: 45, knee: 30, arm: -40, elbow: 90 }, r: { thigh: -20, knee: 95, arm: 40, elbow: 85 } }],
  [0.25, { lean: 8, air: 0.06, l: { thigh: 15, knee: 15, arm: 0, elbow: 90 }, r: { thigh: 20, knee: 110, arm: 0, elbow: 90 } }],
  [0.5, { lean: 8, r: { thigh: 45, knee: 30, arm: -40, elbow: 90 }, l: { thigh: -20, knee: 95, arm: 40, elbow: 85 } }],
  [0.75, { lean: 8, air: 0.06, r: { thigh: 15, knee: 15, arm: 0, elbow: 90 }, l: { thigh: 20, knee: 110, arm: 0, elbow: 90 } }],
  [1, { lean: 8, l: { thigh: 45, knee: 30, arm: -40, elbow: 90 }, r: { thigh: -20, knee: 95, arm: 40, elbow: 85 } }]
], { loop: true });
var TT_READY = { lean: 24, l: { thigh: 22, out: 12, knee: 42, arm: 35, armOut: 18, elbow: 70 }, r: { thigh: 18, out: 12, knee: 40, arm: 25, armOut: 20, elbow: 60 } };
var TT_FORE = [
  [0, TT_READY],
  [0.35, { lean: 26, twist: -35, l: { thigh: 22, out: 12, knee: 38, arm: 45, armOut: 25, elbow: 75 }, r: { thigh: 14, out: 12, knee: 50, arm: -10, armOut: 30, elbow: 40 } }],
  [0.6, { lean: 24, twist: 12, l: { thigh: 24, out: 12, knee: 44, arm: 30, armOut: 20, elbow: 80 }, r: { thigh: 20, out: 12, knee: 36, arm: 30, armOut: 15, elbow: 50 } }],
  [1, { lean: 20, twist: 30, l: { thigh: 20, out: 12, knee: 40, arm: 20, armOut: 15, elbow: 90 }, r: { thigh: 22, out: 12, knee: 34, arm: 70, armOut: 10, elbow: 80 } }]
];
var STAND = { lean: 3, l: { thigh: 2, knee: 6, out: 6, arm: 0, armOut: 8, elbow: 12 }, r: { thigh: -2, knee: 4, out: 6, arm: 0, armOut: 8, elbow: 12 } };
function create(o) {
  var _a;
  const st = { person: null, ankle: 0.09 };
  const outfit = o.outfit || "sport", url = o.url || outfitURL(outfit, (_a = o.tier) != null ? _a : 1);
  const root = new Group();
  if (o.scene) o.scene.add(root);
  loadBody(url).then((t) => {
    var _a2;
    const p = makePerson(t, { look: "clothed", outfit, colors: o.colors, lod: (_a2 = o.lod) != null ? _a2 : 1, shadow: o.shadow !== false && o.contact !== false });
    root.add(p.root);
    if (p.shadow) root.add(p.shadow);
    p.root.updateMatrixWorld(true);
    st.ankle = ankleHeight(p);
    p.grip("l", o.grip || "relaxed");
    p.grip("r", o.grip || "relaxed");
    st.person = p;
    if (st.pending) npc.set(st.pending);
  }).catch((e) => {
    o.onFail && o.onFail(e);
  });
  const npc = {
    root,
    st,
    get person() {
      return st.person;
    },
    get ready() {
      return !!st.person;
    },
    // over: extra pose() joints in npc.root's space (a hand on a prop: { rGrip, rPoleDir, rGripLen }); look: a world point the head turns to
    // idle life (10/23, "stiff dolls"): breathing (~4.4 s, the chest rises ~1 deg) and a slow weight shift hip to hip
    // (~7 s, a degree of thigh each way), on top of whatever the game poses; o.idle === false turns it off
    set(A, over, look) {
      var _a2, _b, _c, _d, _e, _f;
      const p = st.person;
      if (!p) {
        st.pending = A;
        return;
      }
      if (o.idle !== false && A) {
        const t = performance.now() / 1e3 + ((_a2 = st.seed) != null ? _a2 : st.seed = Math.random() * 9), b = Math.sin(t * 6.283 / 4.4), w = Math.sin(t * 6.283 / 7.3);
        A = Object.assign({}, A, {
          lean: ((_b = A.lean) != null ? _b : 3) + 0.9 * b,
          l: Object.assign({}, A.l, { out: ((_c = (A.l || {}).out) != null ? _c : 4) + 1.2 * w, elbow: ((_d = (A.l || {}).elbow) != null ? _d : 15) + 2 * b }),
          r: Object.assign({}, A.r, { out: ((_e = (A.r || {}).out) != null ? _e : 4) - 1.2 * w, elbow: ((_f = (A.r || {}).elbow) != null ? _f : 15) + 2 * b })
        });
      }
      const J = jointsFromAngles(p, A, st.ankle);
      if (over) Object.assign(J, over);
      p.pose(J);
      if (look) p.lookAt(look, 0.8);
    }
  };
  return npc;
}

export {
  jointsFromAngles,
  blend,
  sample,
  KICK,
  RUN,
  TT_READY,
  TT_FORE,
  STAND,
  create
};
