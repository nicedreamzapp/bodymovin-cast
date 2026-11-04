import {
  BONES,
  ankleHeight,
  fpsGuard,
  ik2,
  loadBody,
  makePerson,
  outfitURL
} from "./chunk-WYC6O5BF.js";
import {
  create
} from "./chunk-A2W6QNSO.js";
import {
  Vector3
} from "./chunk-4IYDSAYK.js";

// dist/realyou.js
var V = (x = 0, y = 0, z = 0) => new Vector3(x, y, z);
var KEYS = ["head", "lShoulder", "rShoulder", "lHip", "rHip", "lElbow", "rElbow", "lWrist", "rWrist", "lKnee", "rKnee", "lAnkle", "rAnkle"];
function rigAnkle(J, s, len) {
  const h = J[s + "Hip"], k = J[s + "Knee"], a = J[s + "Ankle"];
  if (!h || !k || !a) return null;
  const t = k.clone().sub(h), c = a.clone().sub(k);
  if (t.lengthSq() < 1e-8 || c.lengthSq() < 1e-8) return null;
  return h.clone().addScaledVector(t.normalize(), len[s].thigh).addScaledVector(c.normalize(), len[s].calf);
}
function create2(o) {
  var _a, _b, _c;
  const MIR = o.view === "mirror", SC = (_a = o.scale) != null ? _a : 1;
  const fig = create(Object.assign({}, o, { draw: false }));
  const parent = o.scene;
  const st = { person: null, failed: false, restAnkle: 0.08, shadow: true, last: null, lift: 0, badAt: 0, junkA: 0, palm: { l: null, r: null }, leg: {}, lean: 0 };
  const outfit = o.outfit || "casual", tier = (_b = o.tier) != null ? _b : 1;
  const url = o.url || outfitURL(outfit, tier);
  const guard = fpsGuard({ min: (_c = o.minFps) != null ? _c : 28, onLow: () => {
    if (st.person) st.person.setLOD(1);
  } });
  function fallback(why) {
    st.failed = true;
    fig.draw = true;
    if (st.person) {
      st.person.root.visible = false;
      if (st.person.shadow) st.person.shadow.visible = false;
    }
    o.onFallback && o.onFallback(why);
  }
  if (parent) loadBody(url).then((t) => {
    var _a2, _b2, _c2, _d, _e;
    const p = makePerson(t, Object.assign({ look: o.look || "glass", outfit, lod: tier === 0 ? 1 : 0, groundY: (_a2 = o.y) != null ? _a2 : 0, renderOrder: (_b2 = o.renderOrder) != null ? _b2 : 20, glass: o.glass }, o.personOpts || {}));
    p.root.position.set((_c2 = o.x) != null ? _c2 : 0, (_d = o.y) != null ? _d : 0, (_e = o.z) != null ? _e : -2.1);
    p.root.rotation.y = MIR ? 0 : Math.PI;
    p.root.scale.setScalar(SC);
    parent.add(p.root);
    if (p.shadow) {
      p.shadow.scale.multiplyScalar(SC);
      parent.add(p.shadow);
    }
    const g = o.grip || {};
    p.grip("l", g.l || "relaxed");
    p.grip("r", g.r || "relaxed");
    p.root.updateMatrixWorld(true);
    st.restAnkle = ankleHeight(p) * 1;
    st.person = p;
    p.opacity = 0;
  }).catch((e) => fallback("load " + (e && e.message || e)));
  function uncross(J) {
    const ax = J.lHip.clone().sub(J.rHip);
    ax.y = 0;
    if (ax.lengthSq() < 1e-6) return;
    ax.normalize();
    const mid = J.lHip.clone().add(J.rHip).multiplyScalar(0.5), lat = (v) => (v.x - mid.x) * ax.x + (v.z - mid.z) * ax.z;
    for (const [a, b, min] of [["lAnkle", "rAnkle", 0.12], ["lKnee", "rKnee", 0.09]]) {
      if (!J[a] || !J[b]) continue;
      const need = min * SC - (lat(J[a]) - lat(J[b]));
      if (need > 0) {
        J[a].addScaledVector(ax, need / 2);
        J[b].addScaledVector(ax, -need / 2);
      }
    }
  }
  const cloneJ = (J) => {
    const c = {};
    for (const k in J) c[k] = J[k] && J[k].isVector3 ? J[k].clone() : J[k];
    return c;
  };
  function plantLegs(J, now) {
    var _a2, _b2;
    const pf = st.plant || (st.plant = { l: null, r: null, at: now }), dtP = Math.min(0.1, Math.max(5e-3, (now - pf.at) / 1e3));
    pf.at = now;
    const off = Math.max(0, Math.min(1, o.plantFeet.off ? o.plantFeet.off() : 0));
    const f2 = (() => {
      const l = J.lHip.clone().sub(J.rHip);
      l.y = 0;
      if (l.lengthSq() < 1e-6) return V(0, 0, MIR ? 1 : -1);
      return V().crossVectors(l.normalize(), V(0, 1, 0)).normalize();
    })();
    parent.updateMatrixWorld(true);
    const nat = {};
    for (const s of ["l", "r"]) nat[s] = parent.localToWorld(J[s + "Ankle"].clone());
    const STEP = (_a2 = o.plantFeet.step) != null ? _a2 : 0.2, DUR = (_b2 = o.plantFeet.dur) != null ? _b2 : 0.17;
    const side = { l: V(nat.l.x - nat.r.x, 0, nat.l.z - nat.r.z), r: V(nat.r.x - nat.l.x, 0, nat.r.z - nat.l.z) };
    for (const s of ["l", "r"]) {
      if (side[s].lengthSq() < 1e-6) side[s].set(s === "l" ? MIR ? 1 : -1 : MIR ? -1 : 1, 0, 0);
      side[s].normalize();
    }
    const lead = (s) => {
      const F = pf[s];
      return F && F.t >= 1 ? (nat[s].x - F.w.x) * side[s].x + (nat[s].z - F.w.z) * side[s].z : -9;
    };
    for (const s of lead("r") > lead("l") ? ["r", "l"] : ["l", "r"]) {
      const F = pf[s], o2 = s === "l" ? "r" : "l", kick = (fig.legLift[s] || 0) > 0.15;
      if (!F || kick || off > 0.6) {
        pf[s] = { w: nat[s].clone(), from: null, t: 1 };
        continue;
      }
      if (F.t < 1) {
        F.t = Math.min(1, F.t + dtP / DUR);
        if (F.t >= 1) F.w.copy(nat[s]);
        continue;
      }
      const drift = Math.hypot(nat[s].x - F.w.x, nat[s].z - F.w.z), busy = pf[o2] && pf[o2].t < 1;
      const crossed = (F.w.x - nat[o2].x) * side[s].x + (F.w.z - nat[o2].z) * side[s].z < 0.06 * SC;
      if (drift > STEP && (!busy || drift > STEP * 2.5) || crossed && drift > 0.03) {
        F.from = F.w.clone();
        F.t = 0;
      }
    }
    for (const s of ["l", "r"]) {
      const F = pf[s];
      if (!F || (fig.legLift[s] || 0) > 0.15) continue;
      let W;
      if (F.t < 1) {
        const e = F.t * F.t * (3 - 2 * F.t);
        W = F.from.clone().lerp(nat[s], e);
        W.y = nat[s].y + 0.09 * SC * Math.sin(Math.PI * F.t);
      } else {
        W = F.w.clone();
        W.y = nat[s].y;
      }
      const A = loc(W).lerp(J[s + "Ankle"], off), H = J[s + "Hip"], L = st.person.restLen[s], K0 = J[s + "Knee"];
      const pole = f2.clone().addScaledVector(side[s], 0.35).normalize();
      void K0;
      J[s + "Ankle"] = A;
      J[s + "Knee"] = ik2(H, A, L.thigh * SC, L.calf * SC, pole).elbow;
    }
  }
  function replant(now) {
    const p = st.person, J = cloneJ(st.plantJ);
    plantLegs(J, now);
    const dy = st.dy || 0;
    if (dy) {
      for (const k in J) if (J[k] && J[k].isVector3 && !/Dir$|Palm$/.test(k) && !(o.gripAbsolute && /Grip$/.test(k)) && !st.absG[k]) J[k].y += dy;
    }
    p.pose(J);
  }
  const baseUpdate = fig.update;
  const loc = (v) => parent && parent.parent ? parent.worldToLocal(v) : v;
  fig.real = false;
  fig.reachMiss = { l: 0, r: 0 };
  fig.update = function(now) {
    var _a2, _b2, _c2, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s;
    baseUpdate(now);
    const p = st.person;
    if (!p || st.failed) {
      fig.real = false;
      return fig;
    }
    guard.tick(now);
    fig.real = true;
    const I = o.BP.img;
    if (fig.newFrame && I && I.lShoulder && I.rShoulder && I.lHip && I.rHip) {
      const sx = (I.lShoulder[0] + I.rShoulder[0]) / 2 - (I.lHip[0] + I.rHip[0]) / 2, sy = (I.lHip[1] + I.rHip[1]) / 2 - (I.lShoulder[1] + I.rShoulder[1]) / 2;
      const len = Math.hypot(sx, sy);
      st.tLen = Math.max(len, (st.tLen || len) * 0.999);
      const bad = sy < -0.35 * st.tLen || len > 0.6 * st.tLen && Math.abs(Math.atan2(sx, sy)) > ((_a2 = o.maxLean) != null ? _a2 : 1.3);
      st.badAt = bad ? st.badAt || now : 0;
    }
    const junk = fig.junk = !!st.badAt;
    st.junkA += ((junk ? 1 : 0) - st.junkA) * (junk ? 0.25 : 0.2);
    p.opacity = fig.opacity * (1 - st.junkA);
    if (p.shadow) p.shadow.visible = p.opacity > 0.02;
    if (junk) {
      if (fig.newFrame) for (const s of ["l", "r"]) {
        fig._g[s].p.y += st.dy || 0;
        fig._f[s].p.y += st.dy || 0;
      }
      return fig;
    }
    if (fig.opacity >= 0.02 && !fig.newFrame && st.plantJ && fig.j3) {
      replant(now);
      return fig;
    }
    if (fig.opacity < 0.02 || !fig.newFrame || !fig.j3) return fig;
    const fr = Math.max(0.05, Math.min(1.5, (now - ((_b2 = st.solveAt) != null ? _b2 : now - 96)) / 96));
    st.solveAt = now;
    const rate = (a) => 1 - Math.pow(1 - a, fr);
    const j = fig.j3, J = {};
    for (const k of KEYS) if (j[k]) J[k] = V(j[k][0], j[k][1], j[k][2]);
    if (!J.lHip || !J.rHip || !J.lShoulder || !J.rShoulder) return fig;
    if (o.depthTurn) {
      const R3 = o.BP.rawJ && performance.now() - (o.BP.rawJAt || 0) < 300 ? o.BP.rawJ : o.BP.joints, sgn = MIR ? 1 : -1;
      if (R3 && R3.lHip && R3.rHip && R3.lShoulder && R3.rShoulder) {
        const hz = (R3.lHip[2] + R3.rHip[2]) / 2, sz = (R3.lShoulder[2] + R3.rShoulder[2]) / 2;
        const map = { lHip: ["lHip", hz], rHip: ["rHip", hz], lKnee: ["lKnee", hz], rKnee: ["rKnee", hz], lAnkle: ["lFoot", hz], rAnkle: ["rFoot", hz], lShoulder: ["lShoulder", hz], rShoulder: ["rShoulder", hz] };
        st.dz || (st.dz = {});
        for (const [k, [src, mid]] of Object.entries(map)) {
          if (!J[k] || !R3[src]) continue;
          const want = Math.max(-0.35, Math.min(0.35, R3[src][2] - mid));
          st.dz[k] = ((_c2 = st.dz[k]) != null ? _c2 : want) + (want - ((_d = st.dz[k]) != null ? _d : want)) * rate(0.4);
          J[k].z += sgn * st.dz[k];
        }
      }
    }
    if (o.board) {
      const sg = o.board.stance() < 0 ? -1 : 1, P0 = p, B = BONES;
      const hw = Math.abs(P0.rest[B.l.thigh].p.x - P0.rest[B.r.thigh].p.x) / 2 * SC, sw = Math.abs(P0.rest[B.l.up].p.x - P0.rest[B.r.up].p.x) / 2 * SC;
      const hipM = J.lHip.clone().add(J.rHip).multiplyScalar(0.5), shM = J.lShoulder.clone().add(J.rShoulder).multiplyScalar(0.5);
      const restHip = P0.rest[B.l.thigh].p.y * SC, hisLeg = 1.83 * j.t + 0.07 * SC;
      const I2 = o.BP.img || {}, pang2 = (h, k, f) => {
        if (!I2[h] || !I2[k] || !I2[f]) return null;
        const u = [I2[h][0] - I2[k][0], I2[h][1] - I2[k][1]], w = [I2[f][0] - I2[k][0], I2[f][1] - I2[k][1]];
        return Math.acos(Math.max(-1, Math.min(1, (u[0] * w[0] + u[1] * w[1]) / (Math.hypot(...u) * Math.hypot(...w) || 1))));
      };
      const ks = [pang2("lHip", "lKnee", "lFoot"), pang2("rHip", "rKnee", "rFoot")].filter((x) => x !== null);
      const kA = ks.length ? Math.max(1.75, Math.min(Math.PI, ks.reduce((a2, b2) => a2 + b2, 0) / ks.length)) : Math.PI * 0.92;
      st.kA = ((_e = st.kA) != null ? _e : kA) + (kA - ((_f = st.kA) != null ? _f : kA)) * rate(0.3);
      const L1 = P0.restLen.l.thigh * SC, L2 = P0.restLen.l.calf * SC, dHA = Math.sqrt(L1 * L1 + L2 * L2 - 2 * L1 * L2 * Math.cos(st.kA));
      const floorY = j.floorY, hy = floorY + st.restAnkle + Math.min(restHip - st.restAnkle, Math.sqrt(Math.max(0.01, dHA * dHA - 0.25 * 0.25)));
      void hisLeg;
      const front = o.board.feet ? o.board.feet[0] : -0.25, back = o.board.feet ? o.board.feet[1] : 0.25;
      const R3 = o.BP.rawJ && performance.now() - (o.BP.rawJAt || 0) < 300 ? o.BP.rawJ : o.BP.joints;
      let tw = 0;
      if (R3 && R3.lShoulder && R3.rShoulder && R3.lHip && R3.rHip) {
        const a = Math.atan2(R3.lShoulder[2] - R3.rShoulder[2], R3.lShoulder[0] - R3.rShoulder[0]), b = Math.atan2(R3.lHip[2] - R3.rHip[2], R3.lHip[0] - R3.rHip[0]);
        tw = Math.max(-0.3, Math.min(0.3, Math.atan2(Math.sin(a - b), Math.cos(a - b))));
      }
      st.tw = ((_g = st.tw) != null ? _g : tw) + (tw - ((_h = st.tw) != null ? _h : tw)) * rate(0.3);
      const hx = hipM.x, newHipM = V(hx, hy, (front + back) / 2), lift = hy - hipM.y;
      J.lHip = newHipM.clone().add(V(0, 0, -sg * hw));
      J.rHip = newHipM.clone().add(V(0, 0, sg * hw));
      const shNew = V(shM.x, shM.y + lift, newHipM.z), ca = Math.cos(st.tw) * sw, sa = Math.sin(st.tw) * sw;
      const oldL = J.lShoulder.clone(), oldR = J.rShoulder.clone();
      J.lShoulder = shNew.clone().add(V(sg * sa, 0, -sg * ca));
      J.rShoulder = shNew.clone().add(V(-sg * sa, 0, sg * ca));
      for (const [s2, old] of [["l", oldL], ["r", oldR]]) {
        const d = J[s2 + "Shoulder"].clone().sub(old);
        for (const k of [s2 + "Elbow", s2 + "Wrist"]) if (J[k]) J[k].add(d);
        if (j[s2 + "HandP"]) j[s2 + "HandP"] = [j[s2 + "HandP"][0] + d.x, j[s2 + "HandP"][1] + d.y, j[s2 + "HandP"][2] + d.z];
      }
      if (J.head) {
        J.head.add(V(0, lift, newHipM.z - J.head.z));
        J.head.x += sg * J.head.distanceTo(shNew) * (((_i = p.neckTilt) != null ? _i : 0) + 0.08);
      }
      const ank = floorY + st.restAnkle + (o.board.lift ? o.board.lift() : 0), toe = V(sg, 0, 0);
      for (const [s2, z] of [["l", sg > 0 ? front : back], ["r", sg > 0 ? back : front]]) {
        const A = V(0, ank, z), H = J[s2 + "Hip"], L = p.restLen[s2];
        J[s2 + "Ankle"] = A;
        J[s2 + "Knee"] = ik2(H, A, L.thigh * SC, L.calf * SC, toe.clone().add(V(0, 0, s2 === "l" ? -0.2 * sg : 0.2 * sg)).normalize()).elbow;
        const rf = p.rest[B[s2].ball].p.clone().sub(p.rest[B[s2].foot].p);
        J[s2 + "Toe"] = A.clone().add(V(sg * Math.hypot(rf.x, rf.z), rf.y, 0));
      }
      if (o.board.look !== false && J.head) J.nose = J.head.clone().add(V(sg * 0.05, -0.03, -0.09).normalize().multiplyScalar(0.1));
    }
    const fwdOf = () => {
      const l = J.lHip.clone().sub(J.rHip);
      l.y = 0;
      if (l.lengthSq() < 1e-6) return V(0, 0, MIR ? 1 : -1);
      return V().crossVectors(l.normalize(), V(0, 1, 0)).normalize();
    };
    if (j.legs && o.legDepth === true && !o.board) {
      const fwd = fwdOf();
      for (const s of ["l", "r"]) {
        const H = J[s + "Hip"], K = J[s + "Knee"], A = J[s + "Ankle"];
        if (!H || !K || !A) continue;
        const lt = Math.hypot(K.x - H.x, K.y - H.y) / j.t, ls = Math.hypot(A.x - K.x, A.y - K.y) / j.t;
        const R = (_j = st.leg)[s] || (_j[s] = { t: lt, s: ls });
        R.t = Math.max(lt, R.t - 15e-4 * fr);
        R.s = Math.max(ls, R.s - 15e-4 * fr);
        const kt = Math.max(0.57, Math.min(1, lt / Math.max(1e-3, R.t))), ks = Math.min(1, ls / Math.max(1e-3, R.s));
        const dzt = Math.sqrt(1 - kt * kt) * R.t * j.t, dzs = Math.sqrt(1 - ks * ks) * R.s * j.t;
        if (dzt > 0.01) {
          K.addScaledVector(fwd, dzt);
          A.addScaledVector(fwd, Math.min(0.45 * dzt, Math.max(-0.08, dzt - dzs)));
        }
      }
    }
    if (o.hinge !== false && !o.depthTurn && !o.board) {
      const R3 = o.BP.rawJ && performance.now() - (o.BP.rawJAt || 0) < 300 ? o.BP.rawJ : o.BP.joints;
      let lean = 0;
      if (R3 && R3.lShoulder && R3.rShoulder && R3.lHip && R3.rHip) {
        const sz = (R3.lShoulder[2] + R3.rShoulder[2]) / 2 - (R3.lHip[2] + R3.rHip[2]) / 2, sy = (R3.lShoulder[1] + R3.rShoulder[1]) / 2 - (R3.lHip[1] + R3.rHip[1]) / 2;
        lean = Math.max(0, Math.min(45, Math.atan2(sz, Math.max(0.05, sy)) * 57.3 - 5));
      }
      st.lean += (lean - st.lean) * rate(0.35);
      const shM = J.lShoulder.clone().add(J.rShoulder).multiplyScalar(0.5), hpM = J.lHip.clone().add(J.rHip).multiplyScalar(0.5), T = shM.distanceTo(hpM);
      const a = st.lean / 57.3, dz = T * Math.sin(a), dyy = T * (1 - Math.cos(a)), fwd = fwdOf();
      if (dz > 5e-3) for (const k of ["lShoulder", "rShoulder", "head", "lElbow", "rElbow", "lWrist", "rWrist", "lGrip", "rGrip"]) {
        if (!J[k] || o.gripAbsolute && /Grip$/.test(k)) continue;
        J[k].addScaledVector(fwd, dz);
        J[k].y -= dyy;
      }
    }
    if (!o.board && J.lAnkle && J.rAnkle) {
      const f2 = fwdOf(), aMin = Math.min(J.lAnkle.y, J.rAnkle.y), hipMin = aMin + 0.3 * SC;
      const hm = (J.lHip.y + J.rHip.y) / 2;
      if (hm < hipMin) {
        const up2 = hipMin - hm;
        for (const k of ["lHip", "rHip", "lShoulder", "rShoulder", "head", "lElbow", "rElbow", "lWrist", "rWrist"]) if (J[k]) J[k].y += up2;
        for (const s2 of ["l", "r"]) if (j[s2 + "HandP"] && !o.gripAbsolute) j[s2 + "HandP"] = [j[s2 + "HandP"][0], j[s2 + "HandP"][1] + up2, j[s2 + "HandP"][2]];
      }
      for (const s2 of ["l", "r"]) {
        const K = J[s2 + "Knee"], A = J[s2 + "Ankle"], H = J[s2 + "Hip"];
        if (K && A && H && K.y < A.y + 0.05) J[s2 + "Knee"] = ik2(H, A, 0.95 * j.t, 0.88 * j.t, f2).elbow;
      }
    }
    if (!o.board && J.lHip && J.rHip) {
      const I2 = o.BP.img || {}, vis = o.BP.vis || {}, now2 = performance.now();
      const ang = (a, b, c) => {
        const u = a.clone().sub(b), w = c.clone().sub(b);
        return u.angleTo(w) * 57.3;
      };
      const pang = (h, k, f) => {
        if (!I2[h] || !I2[k] || !I2[f]) return null;
        const u = [I2[h][0] - I2[k][0], I2[h][1] - I2[k][1]], w = [I2[f][0] - I2[k][0], I2[f][1] - I2[k][1]];
        return Math.acos(Math.max(-1, Math.min(1, (u[0] * w[0] + u[1] * w[1]) / (Math.hypot(...u) * Math.hypot(...w) || 1)))) * 57.3;
      };
      st.good || (st.good = {});
      st.badLeg || (st.badLeg = {});
      for (const s2 of ["l", "r"]) {
        const H = J[s2 + "Hip"], K = J[s2 + "Knee"], A = J[s2 + "Ankle"];
        if (!K || !A) continue;
        if ((fig.legLift[s2] || 0) > 0.15) {
          st.badLeg[s2] = 0;
          continue;
        }
        const pk = MIR ? s2 === "l" ? "r" : "l" : s2;
        const pic = pang(pk + "Hip", pk + "Knee", pk + "Foot"), jA = ang(H, K, A), conf = Math.min((_k = vis[pk + "Knee"]) != null ? _k : 1, (_l = vis[pk + "Foot"]) != null ? _l : 1);
        const sure = j.legs && conf >= 0.5 && pic !== null, ok = sure && Math.abs(jA - pic) < 35;
        if (sure && !ok && pic > 150 || !sure && j.legs && pic !== null && pic > 165 && conf >= 0.3 && jA < 150) {
          const L1 = 0.95 * j.t, L2 = 0.88 * j.t, d = H.distanceTo(A);
          const dir = d > 0.05 ? A.clone().sub(H).normalize() : V(0, -1, 0);
          if (dir.y > -0.5) {
            dir.y = -0.5 - 0.5 * Math.max(0, dir.y);
            dir.normalize();
          }
          A.copy(H).addScaledVector(dir, 0.97 * (L1 + L2));
          K.copy(H).lerp(A, L1 / (L1 + L2));
          st.good[s2] = { k: K.clone().sub(H), a: A.clone().sub(H) };
          st.badLeg[s2] = 0;
          continue;
        }
        if (ok && (H.distanceTo(K) < 0.05 || K.distanceTo(A) < 0.05)) {
          (_m = st.badLeg)[s2] || (_m[s2] = now2);
          const g0 = st.good[s2];
          const src0 = g0 || { k: V(0, -0.95 * j.t, 0), a: V(0, -1.83 * j.t, 0) };
          K.copy(H).add(src0.k);
          A.copy(H).add(src0.a);
          continue;
        }
        if (ok) {
          if (pic > 160 && jA < 150) {
            const L1 = H.distanceTo(K), L2 = K.distanceTo(A);
            K.copy(H).lerp(A, L1 / (L1 + L2));
          }
          st.good[s2] = { k: K.clone().sub(H), a: A.clone().sub(H) };
          st.badLeg[s2] = 0;
        } else {
          (_n = st.badLeg)[s2] || (_n[s2] = now2);
          const g = st.good[s2], lt = 0.95 * j.t, lc = 0.88 * j.t;
          const stand = { k: V(0, -lt, 0), a: V(0, -lt - lc, 0) };
          const e = Math.min(1, Math.max(0, (now2 - st.badLeg[s2] - 1500) / 800));
          const src = g ? { k: g.k.clone().lerp(stand.k, e), a: g.a.clone().lerp(stand.a, e) } : stand;
          K.copy(H).add(src.k);
          A.copy(H).add(src.a);
        }
      }
    }
    if (J.head && !o.board) {
      if (o.depthTurn && st.dz) J.head.z += (MIR ? 1 : -1) * (((_o = st.dz.lShoulder) != null ? _o : 0) + ((_p = st.dz.rShoulder) != null ? _p : 0)) / 2;
      const shM = J.lShoulder.clone().add(J.rShoulder).multiplyScalar(0.5), up = shM.clone().sub(J.lHip.clone().add(J.rHip).multiplyScalar(0.5)).normalize();
      const sx = J.lShoulder.clone().sub(J.rShoulder).normalize(), f = V().crossVectors(sx, up).normalize();
      const L = J.head.distanceTo(shM);
      J.head.addScaledVector(f, L * (p.neckTilt + 0.08));
      J.nose = J.head.clone().addScaledVector(f, 0.1).addScaledVector(up, -0.025);
    }
    for (const s of ["l", "r"]) {
      const hp = j[s + "HandP"];
      if (!hp || !J[s + "Wrist"]) continue;
      J[s + "Grip"] = V(hp[0], hp[1], hp[2]);
      J[s + "GripLen"] = 0.075 * SC;
      if (J[s + "Elbow"]) {
        const mid = J[s + "Shoulder"].clone().lerp(J[s + "Wrist"], 0.5), pole = J[s + "Elbow"].clone().sub(mid);
        if (pole.lengthSq() > 1e-6) J[s + "PoleDir"] = pole.normalize();
      }
      const pm = o.palm && o.palm(s, J);
      if (pm) J[s + "Palm"] = pm;
      st.palm[s] = pm || null;
      if (pm) {
        const hd = J[s + "Grip"].clone().sub(J[s + "Wrist"]);
        if (hd.lengthSq() > 1e-6) J[s + "HandDir"] = hd.normalize();
      }
    }
    if (o.adjust) {
      o.adjust(J, { fwd: fwdOf(), len: p.restLen, SC, j, fr, now });
      for (const s of ["l", "r"]) if (J[s + "Palm"]) st.palm[s] = J[s + "Palm"];
    }
    st.absG = {};
    if (o.grips) {
      const g = o.grips() || {};
      for (const s of ["l", "r"]) {
        const w = g[s];
        if (!w || !w.p) continue;
        J[s + "Grip"] = loc(w.p.clone());
        J[s + "GripLen"] = 0.075 * SC;
        st.absG[s + "Grip"] = true;
        J[s + "PoleDir"] = (w.pole || V(s === "r" ? 0.45 : -0.45, -0.7, (MIR ? -1 : 1) * 0.55)).clone().normalize();
        if (w.dir) J[s + "HandDir"] = w.dir.clone().normalize();
        else delete J[s + "HandDir"];
        delete J[s + "Palm"];
      }
    }
    if (o.plantFeet && !o.board && j.legs && J.lAnkle && J.rAnkle && parent && parent.parent) {
      uncross(J);
      st.plantJ = cloneJ(J);
      plantLegs(J, now);
    } else st.plantJ = null;
    let dy = 0;
    const la = rigAnkle(J, "l", scaled(p.restLen)), ra = rigAnkle(J, "r", scaled(p.restLen));
    if (la && ra && !o.board) {
      const his = j.legs ? Math.min(j.lAnkle[1], j.rAnkle[1]) - j.ankleY : 0;
      const up = o.jumps && his > 0.05 ? Math.min(0.6, his) : 0;
      st.lift += (up - st.lift) * rate(up > st.lift ? 0.6 : 0.35);
      const want = j.floorY + st.restAnkle + st.lift;
      dy = want - Math.min(la.y, ra.y);
      for (const k in J) if (J[k] && J[k].isVector3 && !/Dir$|Palm$/.test(k) && !(o.gripAbsolute && /Grip$/.test(k)) && !st.absG[k]) J[k].y += dy;
    }
    p.root.position.y = (_q = o.y) != null ? _q : 0;
    p.pose(J);
    if (la && ra) {
      const res = ((_r = o.y) != null ? _r : 0) + (j.floorY - ((_s = o.y) != null ? _s : 0)) + st.restAnkle + st.lift - Math.min(loc(p.world(BONES.l.foot)).y, loc(p.world(BONES.r.foot)).y);
      if (Math.abs(res) > 1e-4) {
        if (o.gripAbsolute || Object.keys(st.absG).length) {
          for (const k in J) if (J[k] && J[k].isVector3 && !/Dir$|Palm$/.test(k) && !(o.gripAbsolute && /Grip$/.test(k)) && !st.absG[k]) J[k].y += res;
          p.pose(J);
          dy += res;
        } else {
          p.root.position.y += res;
          p.root.updateMatrixWorld(true);
          dy += res;
        }
      }
    }
    st.last = J;
    st.dy = dy;
    if (o.shiftPose && fig.pose) for (const k of ["lS", "rS", "n", "hM", "lH", "rH", "head", "lE", "rE", "lW", "rW", "lP", "rP", "lK", "rK", "lA", "rA"]) {
      const v = fig.pose[k];
      if (v) fig.pose[k] = [v[0], v[1] + dy];
    }
    for (const s of ["l", "r"]) {
      fig._f[s].p.y += dy;
      fig.reachMiss[s] = 0;
      if (!fig._g[s].seen) {
        fig._g[s].p.y += dy;
        continue;
      }
      const hf = p.handFrame(s);
      hf.p = loc(hf.p);
      fig.reachMiss[s] = hf.p.distanceTo(fig._g[s].p.setY(fig._g[s].p.y + dy));
      fig._g[s].p.copy(hf.p);
    }
    return fig;
  };
  const scaled = (len) => SC === 1 ? len : Object.fromEntries(Object.entries(len).map(([s, L]) => [s, Object.fromEntries(Object.entries(L).map(([k, v]) => [k, v * SC]))]));
  Object.defineProperty(fig, "person", { get: () => st.person });
  fig.palmDir = (s) => st.palm[s];
  fig.handFrame = (s) => st.person && fig.real ? st.person.handFrame(s) : null;
  fig.realState = st;
  const baseObjects = fig.objects;
  Object.defineProperty(fig, "allObjects", { get: () => st.person ? [...baseObjects, st.person.root, ...st.person.shadow ? [st.person.shadow] : []] : baseObjects });
  return fig;
}

export {
  create2 as create
};
