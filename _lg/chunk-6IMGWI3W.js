import {
  BONES,
  ankleHeight,
  ik2,
  loadBody,
  makePerson,
  outfitURL
} from "./chunk-WYC6O5BF.js";
import {
  Color,
  Quaternion,
  ShaderMaterial,
  Vector3
} from "./chunk-4IYDSAYK.js";

// dist/stance.js
var V = (x = 0, y = 0, z = 0) => new Vector3(x, y, z);
var clamp = (v, a, b) => Math.max(a, Math.min(b, v));
var D2R = Math.PI / 180;
function measure(J) {
  const K = ["lShoulder", "rShoulder", "lHand", "rHand", "lHip", "rHip", "lKnee", "rKnee", "lFoot", "rFoot"];
  if (!J || K.some((k) => !J[k])) return null;
  const v = (k) => V(...J[k]);
  const sh = v("lShoulder").add(v("rShoulder")).multiplyScalar(0.5), hp = v("lHip").add(v("rHip")).multiplyScalar(0.5);
  const T = sh.distanceTo(hp) || 1e-6, UP = V(0, 1, 0);
  const flat = (a) => a.clone().addScaledVector(UP, -a.dot(UP));
  const hipX = flat(v("lHip").sub(v("rHip"))).normalize(), fwd = V().crossVectors(hipX, UP).normalize();
  const af = flat(v("lFoot").sub(v("rFoot")));
  const spine = sh.clone().sub(hp).normalize();
  let hinge = Math.acos(clamp(spine.dot(UP), -1, 1)) / D2R;
  if (spine.dot(fwd) < 0) hinge = -hinge;
  const ang = (a, b, c) => {
    const u = v(a).sub(v(b)), w = v(c).sub(v(b));
    return Math.acos(clamp(u.dot(w) / (u.length() * w.length() || 1), -1, 1)) / D2R;
  };
  const kl = ang("lHip", "lKnee", "lFoot"), kr = ang("rHip", "rKnee", "rFoot");
  const hand = (s) => v(s + "Hand").sub(sh).dot(UP) / T;
  const hl = v("lHip").sub(v("rHip"));
  const sideOn = Math.atan2(Math.abs(hl.z), Math.abs(hl.x)) / D2R;
  return {
    T,
    sideOn,
    feet: af.length() / T,
    stagger: af.dot(fwd),
    knee: (kl + kr) / 2,
    kneeMin: Math.min(kl, kr),
    kneeL: kl,
    kneeR: kr,
    hinge,
    hands: (hand("l") + hand("r")) / 2,
    handL: hand("l"),
    handR: hand("r"),
    reach: (v("lHand").sub(sh).dot(fwd) + v("rHand").sub(sh).dot(fwd)) / 2 / T,
    handsApart: v("lHand").distanceTo(v("rHand")) / T
  };
}
var CAL = { knee: -22, hinge: 5 };
function toLiveScale(m) {
  return m && Object.assign({}, m, { knee: m.knee + CAL.knee, kneeMin: m.kneeMin + CAL.knee, kneeL: m.kneeL + CAL.knee, kneeR: m.kneeR + CAL.knee, hinge: m.hinge + CAL.hinge });
}
function stanceJoints(def, P, restAnkle = 0.08) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const T = P.T0, L = P.restLen, R = P.rest, B = BONES;
  const hw = Math.abs(R[B.l.thigh].p.x - R[B.r.thigh].p.x) / 2, sw = Math.abs(R[B.l.up].p.x - R[B.r.up].p.x) / 2;
  const th = (180 - ((_a = def.knee) != null ? _a : 170)) * D2R;
  const J = {};
  const legs = {};
  for (const s of ["l", "r"]) {
    const sg = s === "l" ? 1 : -1, ax = sg * ((_b = def.feet) != null ? _b : 0.6) * T / 2, az = sg * ((_c = def.stagger) != null ? _c : 0) / 2 + ((_d = def.footZ) != null ? _d : 0);
    const dx = ax - sg * hw, L1 = L[s].thigh, L2 = L[s].calf;
    const k1 = Math.sqrt(Math.max(0.2, 1 - (dx * L1 / (L1 + L2) / L1) ** 2)), k2 = Math.sqrt(Math.max(0.2, 1 - (dx * L2 / (L1 + L2) / L2) ** 2));
    const a = th * 0.5, b = th - a;
    const knee = V(ax - dx * L2 / (L1 + L2), restAnkle + L2 * k2 * Math.cos(a), az + L2 * k2 * Math.sin(a));
    const hip = V(sg * hw, knee.y + L1 * k1 * Math.cos(b), knee.z - L1 * k1 * Math.sin(b));
    legs[s] = { ankle: V(ax, restAnkle, az), knee, hip };
  }
  const hy = Math.min(legs.l.hip.y, legs.r.hip.y), hz = (legs.l.hip.z + legs.r.hip.z) / 2;
  for (const s of ["l", "r"]) {
    const sg = s === "l" ? 1 : -1, H = V(sg * hw, hy, hz), A = legs[s].ankle;
    const r = ik2(H, A, L[s].thigh, L[s].calf, V(sg * 0.25, 0, 1).normalize());
    J[s + "Hip"] = H;
    J[s + "Knee"] = r.elbow;
    J[s + "Ankle"] = A;
  }
  const hipM = V(0, hy, hz), h = ((_e = def.hinge) != null ? _e : 5) * D2R, spine = V(0, Math.cos(h), Math.sin(h));
  const shM = hipM.clone().addScaledVector(spine, T);
  J.lShoulder = shM.clone().add(V(sw, 0, 0));
  J.rShoulder = shM.clone().add(V(-sw, 0, 0));
  const hu = V(0, 1, 0).lerp(spine, 0.5).normalize();
  J.head = shM.clone().addScaledVector(hu, 0.24).add(V(0, 0, 0.24 * (((_f = P.neckTilt) != null ? _f : 0) + 0.1)));
  J.nose = J.head.clone().add(V(0, -0.03, 0.1));
  for (const s of ["l", "r"]) {
    const sg = s === "l" ? 1 : -1, hd = def.hands && def.hands[s] || { y: -1.2, fwd: 0.1, x: 0.5 };
    const tgt = V(sg * ((_g = hd.x) != null ? _g : 0.5) * T, shM.y + ((_h = hd.y) != null ? _h : -1) * T, shM.z + ((_i = hd.fwd) != null ? _i : 0.1) * T);
    J[s + "Grip"] = tgt;
    J[s + "GripLen"] = 0.075;
    J[s + "PoleDir"] = V(sg * 0.6, -1, -0.5).normalize();
    J[s + "Elbow"] = J[s + "Shoulder"].clone().lerp(tgt, 0.5).add(V(sg * 0.1, -0.1, -0.05));
    J[s + "Wrist"] = tgt.clone();
  }
  if (def.yaw) {
    const q = new Quaternion().setFromAxisAngle(V(0, 1, 0), def.yaw * D2R);
    for (const k in J) if (J[k] && J[k].isVector3) J[k].applyQuaternion(q);
  }
  return J;
}
var GVS = (
  /* glsl */
  "\n#include <common>\n#include <skinning_pars_vertex>\nuniform float uOk[64];\nvarying vec3 vN; varying vec3 vV; varying float vOk;\nvoid main() {\n  #include <skinbase_vertex>\n  #include <begin_vertex>\n  #include <beginnormal_vertex>\n  #include <skinnormal_vertex>\n  #include <defaultnormal_vertex>\n  #include <skinning_vertex>\n  #include <project_vertex>\n  vN = normalize(transformedNormal); vV = -mvPosition.xyz;\n  vOk = 0.0;\n  #ifdef USE_SKINNING\n  vOk = skinWeight.x * uOk[int(skinIndex.x)] + skinWeight.y * uOk[int(skinIndex.y)] + skinWeight.z * uOk[int(skinIndex.z)] + skinWeight.w * uOk[int(skinIndex.w)];\n  #endif\n}"
);
var GFS = (
  /* glsl */
  "\nuniform float uA; uniform float uFlash; uniform vec3 uCol; uniform vec3 uOkCol;\nvarying vec3 vN; varying vec3 vV; varying float vOk;\nvoid main() {\n  vec3 n = normalize(vN), v = normalize(vV);\n  float f = pow(1.0 - clamp(abs(dot(n, v)), 0.0, 1.0), 2.2);\n  vec3 c = mix(uCol, uOkCol, clamp(max(vOk, uFlash), 0.0, 1.0));\n  gl_FragColor = vec4(c, clamp((0.35 + f * 1.4) * uA, 0.0, 1.0));\n  #include <colorspace_fragment>\n}"
);
var _chime = null;
function chime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    _chime || (_chime = new AC());
    const a = _chime, t = a.currentTime;
    for (const [f, d] of [[880, 0], [1320, 0.09]]) {
      const o = a.createOscillator(), g = a.createGain();
      o.type = "sine";
      o.frequency.value = f;
      g.gain.setValueAtTime(0, t + d);
      g.gain.linearRampToValueAtTime(0.07, t + d + 0.02);
      g.gain.exponentialRampToValueAtTime(5e-4, t + d + 0.5);
      o.connect(g).connect(a.destination);
      o.start(t + d);
      o.stop(t + d + 0.55);
    }
  } catch (_) {
  }
}
var PARTS = {
  legs: ["thigh_l", "calf_l", "thigh_r", "calf_r", "foot_l", "foot_r", "ball_l", "ball_r"],
  feet: ["foot_l", "foot_r", "ball_l", "ball_r", "calf_l", "calf_r"],
  arms: ["upperarm_l", "lowerarm_l", "hand_l", "upperarm_r", "lowerarm_r", "hand_r", "clavicle_l", "clavicle_r"],
  spine: ["pelvis", "spine_01", "spine_02", "spine_03", "neck_01", "head"]
};
var STANCE_ON = typeof location !== "undefined" && new URLSearchParams(location.search).get("stance") === "1";
function create(o) {
  var _a, _b;
  if (!STANCE_ON) return { st: {}, matched: false, numbers: null, passing: [], update() {
  }, setDef() {
  }, dispose() {
  } };
  const st = { person: null, A: 0, ok: 0, okT: 0, matched: false, flash: 0, fadeOut: 0, prevWant: false, failT: 0, faint: false, m: null, pass: [] };
  const uOk = new Array(64).fill(0);
  const uni = { uA: { value: 0 }, uFlash: { value: 0 }, uCol: { value: new Color((_a = o.color) != null ? _a : 16777215) }, uOkCol: { value: new Color(4644986) }, uOk: { value: uOk } };
  const url = o.url || outfitURL(o.outfit || "casual", (_b = o.tier) != null ? _b : 1);
  loadBody(url).then((t) => {
    var _a2, _b2;
    const p = makePerson(t, { look: "glass", outfit: o.outfit || "casual", lod: ((_a2 = o.tier) != null ? _a2 : 1) === 0 ? 1 : 0, ghost: false, shadow: false, renderOrder: (_b2 = o.renderOrder) != null ? _b2 : 14 });
    const mat = new ShaderMaterial({ uniforms: uni, vertexShader: GVS, fragmentShader: GFS, transparent: true, depthWrite: false, toneMapped: false });
    p.root.traverse((m) => {
      if (m.isSkinnedMesh && !/_depth$/.test(m.name)) m.material = mat;
    });
    p.root.visible = false;
    o.scene.add(p.root);
    const bonesIdx = {};
    p.skeleton.bones.forEach((b, i) => bonesIdx[b.name] = i);
    st.boneIdx = bonesIdx;
    p.root.updateMatrixWorld(true);
    p.pose(stanceJoints(o.def, p, ankleHeight(p)));
    st.person = p;
  }).catch(() => {
  });
  function place() {
    var _a2;
    const y = o.you && (o.you.person ? o.you.person.root : o.you.root);
    const p = st.person;
    if (!y || !p) return;
    const pel = o.you.person ? o.you.person.world(BONES.pelvis) : y.getWorldPosition(V());
    if (p.root.parent) p.root.parent.worldToLocal(pel);
    p.root.position.set(pel.x, typeof o.floorY === "function" ? o.floorY() : (_a2 = o.floorY) != null ? _a2 : 0, pel.z);
    p.root.rotation.copy(y.rotation);
    p.root.scale.copy(y.scale);
    if (o.offset) p.root.position.add(o.offset);
  }
  return {
    st,
    get matched() {
      return st.matched;
    },
    get numbers() {
      return st.m;
    },
    get passing() {
      return st.pass;
    },
    update(now, want) {
      var _a2;
      const p = st.person;
      if (!p) return;
      const dt = Math.min(0.1, (now - (st.t || now)) / 1e3);
      st.t = now;
      if (want && !st.prevWant) {
        st.matched = false;
        st.okT = 0;
        st.fadeOut = 0;
        st.faint = false;
        st.failT = 0;
      }
      st.prevWant = want;
      const J = o.BP.rawJ && performance.now() - (o.BP.rawJAt || 0) < 300 ? o.BP.rawJ : o.BP.joints;
      const m = st.m = measure(J);
      uOk.fill(0);
      st.pass = [];
      let all = !!m;
      for (const c of o.checks) {
        const ok = !!(m && c.ok(m));
        if (ok) st.pass.push(c.name);
        all = all && ok;
        if (ok) {
          for (const part of c.parts) for (const b of PARTS[part] || []) if (st.boneIdx[b] != null) uOk[st.boneIdx[b]] = 1;
        }
      }
      if (want && !st.matched) {
        st.okT = all ? st.okT + dt : 0;
        if (st.okT >= 0.5) {
          st.matched = true;
          st.flash = 1;
          st.fadeOut = 1;
          chime();
          o.onMatch && o.onMatch();
        }
      } else if (want && st.matched) {
        st.failT = all ? 0 : st.failT + dt;
        if (st.failT > 4) {
          st.matched = false;
          st.faint = true;
          st.okT = 0;
        }
      }
      const target = !want ? 0 : st.matched ? 0 : st.faint ? 0.08 : (_a2 = o.alpha) != null ? _a2 : 0.15;
      const rate = st.matched ? 1 : 3;
      st.A += (target - st.A) * Math.min(1, dt * (target > st.A ? 4 : rate) * (st.matched ? 2.2 : 1));
      st.flash = Math.max(0, st.flash - dt * 1.2);
      uni.uA.value = st.A + st.flash * 0.35 * (want ? 1 : 0);
      uni.uFlash.value = st.flash;
      p.root.visible = uni.uA.value > 4e-3;
      if (p.root.visible) place();
    },
    setDef(def) {
      o.def = def;
      const p = st.person;
      if (p) {
        p.root.updateMatrixWorld(true);
        const keep = p.root.position.clone(), rot = p.root.rotation.clone(), sc = p.root.scale.clone();
        p.root.position.set(0, 0, 0);
        p.root.rotation.set(0, 0, 0);
        p.root.scale.set(1, 1, 1);
        p.root.updateMatrixWorld(true);
        p.pose(stanceJoints(def, p, ankleHeight(p)));
        p.root.position.copy(keep);
        p.root.rotation.copy(rot);
        p.root.scale.copy(sc);
      }
    },
    dispose() {
      if (st.person) st.person.dispose();
    }
  };
}

export {
  measure,
  CAL,
  toLiveScale,
  stanceJoints,
  create
};
