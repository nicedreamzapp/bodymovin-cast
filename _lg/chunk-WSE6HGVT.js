import {
  makeVehicle
} from "./chunk-5HD6ZFH7.js";
import {
  glowTexture,
  keepAlpha,
  loadModel,
  smokeTexture
} from "./chunk-2NRDKLEL.js";
import {
  ik2,
  loadBody,
  makePerson
} from "./chunk-WYC6O5BF.js";
import {
  RoundedBoxGeometry
} from "./chunk-UI5V7SMY.js";
import {
  AdditiveBlending,
  BoxGeometry,
  BufferGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  Group,
  Line,
  LineBasicMaterial,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PointLight,
  Ray,
  Sprite,
  SpriteMaterial,
  TorusGeometry,
  Vector3
} from "./chunk-4IYDSAYK.js";

// dist/wolfstrike/actors.js
var V = (x = 0, y = 0, z = 0) => new Vector3(x, y, z);
var clamp = (v, a, b) => Math.max(a, Math.min(b, v));
var MOCAP = null;
async function loadMocap() {
  if (MOCAP) return MOCAP;
  MOCAP = await (await fetch(new URL("./mocap.json", new URL("wolfstrike/actors.js", location.href).href))).json();
  return MOCAP;
}
function clipInfo(name) {
  const c = MOCAP.clips[name];
  const n = c.loop ? c.n - 1 : c.n;
  return { dur: n / MOCAP.fps, loop: c.loop, speed: c.loop ? Math.hypot(c.tr[(c.n - 1) * 2], c.tr[(c.n - 1) * 2 + 1]) / 1e3 / (n / MOCAP.fps) : 0 };
}
function sampleClip(name, t, out = {}) {
  const c = MOCAP.clips[name], K = MOCAP.keys, nk = K.length, n = c.loop ? c.n - 1 : c.n;
  let f = t * MOCAP.fps;
  f = c.loop ? (f % n + n) % n : clamp(f, 0, n - 1);
  const i0 = Math.floor(f), i1 = c.loop ? (i0 + 1) % n : Math.min(n - 1, i0 + 1), k = f - i0, J = c.j;
  for (let j = 0; j < nk; j++) {
    const a = (i0 * nk + j) * 3, b = (i1 * nk + j) * 3, v = out[K[j]] || (out[K[j]] = V());
    v.set((J[a] + (J[b] - J[a]) * k) / 1e3, (J[a + 1] + (J[b + 1] - J[a + 1]) * k) / 1e3, (J[a + 2] + (J[b + 2] - J[a + 2]) * k) / 1e3);
  }
  return out;
}
function toRig(P, M, s, out) {
  var _a;
  for (const k of ["lHip", "rHip", "lKnee", "rKnee", "lAnkle", "rAnkle", "lShoulder", "rShoulder", "lElbow", "rElbow", "lWrist", "rWrist", "lToe", "rToe"])
    (out[k] || (out[k] = V())).copy(M[k]).multiplyScalar(s);
  const up = M.top.clone().sub(M.neck).normalize(), left = M.lShoulder.clone().sub(M.rShoulder), fwd = V().crossVectors(left, up).normalize();
  const shM = out.lShoulder.clone().add(out.rShoulder).multiplyScalar(0.5);
  (out.head || (out.head = V())).copy(shM).addScaledVector(V(0, 1, 0).lerp(up, 0.6).normalize(), 0.24).addScaledVector(fwd, 0.24 * (((_a = P.neckTilt) != null ? _a : 0) + 0.06));
  (out.nose || (out.nose = V())).copy(out.head).addScaledVector(fwd, 0.1).addScaledVector(V(0, 1, 0), -0.02);
  (out.lHandDir || (out.lHandDir = V())).copy(M.lHand).sub(M.lWrist).normalize();
  (out.rHandDir || (out.rHandDir = V())).copy(M.rHand).sub(M.rWrist).normalize();
  return out;
}
var OUTFIT_URL = { soldier: "man_snow.glb", soldier0: "man_snow_t0.glb", civil: "man_sport.glb", civil0: "man_sport_t0.glb", hostage: "man.glb", hostage0: "man_t0.glb" };
function peopleURLs(tier) {
  const t = tier === 0 ? "0" : "";
  return { soldier: "./assets/people/" + OUTFIT_URL["soldier" + t], civil: "./assets/people/" + OUTFIT_URL["civil" + t], hostage: "./assets/people/" + OUTFIT_URL["hostage" + t] };
}
var TEMPL = {};
async function loadPeople(tier) {
  const U = peopleURLs(tier);
  for (const [k, u] of Object.entries(U)) TEMPL[k] = await loadBody(u);
}
function makeRifle() {
  const g = new Group(), steel = new MeshStandardMaterial({ color: 1974049, roughness: 0.45, metalness: 0.8 }), wood = new MeshStandardMaterial({ color: 5911576, roughness: 0.6 });
  const add = (geo, m, x, y, z, rx = 0) => {
    const o = new Mesh(geo, m);
    o.position.set(x, y, z);
    o.rotation.x = rx;
    o.castShadow = true;
    g.add(o);
    return o;
  };
  add(new BoxGeometry(0.05, 0.07, 0.36), steel, 0, 0.02, 0.1);
  add(new CylinderGeometry(0.011, 0.011, 0.42, 6), steel, 0, 0.04, 0.48, Math.PI / 2);
  add(new BoxGeometry(0.045, 0.06, 0.24), wood, 0, 0, -0.2);
  add(new BoxGeometry(0.045, 0.05, 0.18), wood, 0, 0, 0.32);
  add(new BoxGeometry(0.03, 0.12, 0.05), wood, 0, -0.06, -0.02, 0.3);
  add(new BoxGeometry(0.035, 0.16, 0.06), steel, 0, -0.09, 0.14, -0.35);
  const muzzle = new Object3D();
  muzzle.position.set(0, 0.04, 0.7);
  g.add(muzzle);
  g.userData.muzzle = muzzle;
  return g;
}
var SOLDIER_COLORS = (uni, vest) => ({ jacket: vest ? 1974822 : uni, pants: new Color(uni).multiplyScalar(0.72).getHex(), helmet: new Color(uni).multiplyScalar(0.85).getHex(), glove: 1710618, shoes: 1446671 });
function freeSkeletons(root) {
  const seen = /* @__PURE__ */ new Set();
  root.traverse((m) => {
    if (m.isSkinnedMesh && m.skeleton && !seen.has(m.skeleton)) {
      seen.add(m.skeleton);
      m.skeleton.dispose();
    }
  });
}
var Person = class {
  // role: soldier | nurse | boy | hostage ; o: { scene, uniform, vest, scale, lod }
  constructor(role, o) {
    var _a;
    this.role = role;
    this.root = new Group();
    o.scene.add(this.root);
    const tpl = role === "soldier" ? TEMPL.soldier : role === "hostage" ? TEMPL.hostage : TEMPL.civil;
    const outfit = role === "soldier" ? "snowboarder" : role === "hostage" ? "casual" : "sport";
    const colors = role === "soldier" ? SOLDIER_COLORS(o.uniform, o.vest) : role === "nurse" ? { shirt: 16053488, shorts: 15263972, socks: 15921906 } : role === "boy" ? { shirt: [13650474, 2783952, 14725162][Math.floor(Math.random() * 3)], shorts: 2763312 } : { clothes: 11577496 };
    this.p = makePerson(tpl, { look: "clothed", outfit, colors, lod: (_a = o.lod) != null ? _a : 1, shadow: true });
    this.p.root.traverse((m) => {
      if (m.isMesh) {
        m.castShadow = true;
        m.frustumCulled = false;
      }
    });
    this.root.add(this.p.root);
    if (this.p.shadow) this.root.add(this.p.shadow);
    this.s = o.scale || 1;
    this.root.scale.setScalar(this.s);
    const L = this.p.restLen;
    this.legRig = L.l.thigh + L.l.calf;
    this.J = {};
    this.M = {};
    this.clip = "walk";
    this.t = 0;
    this.blend = null;
    if (role === "soldier") {
      this.rifle = makeRifle();
      o.scene.add(this.rifle);
      this.p.grip("r", "club");
      this.p.grip("l", "club");
    }
    this.mats = [];
    this.p.root.traverse((m) => {
      if (m.isMesh && m.material && m.material.emissive) {
        m.material = m.material.clone();
        this.mats.push(m.material);
      }
    });
    this.flash = 0;
    this.opacity = 1;
    this.alive = true;
  }
  legScale(M) {
    const l = M.lHip.distanceTo(M.lKnee) + M.lKnee.distanceTo(M.lAnkle);
    return this.legRig / Math.max(0.3, l);
  }
  play(clip, { t = 0, fade = 0.18 } = {}) {
    if (clip === this.clip) return;
    this.blend = { from: this.clip, ft: this.t, k: 0, dur: fade };
    this.clip = clip;
    this.t = t;
  }
  update(dt, rate = 1) {
    this.t += dt * rate;
    const M = sampleClip(this.clip, this.t, this.M), s = this.ls || (this.ls = this.legScale(M));
    toRig(this.p, M, s, this.J);
    if (this.blend && this.blend.dur > 0) {
      this.blend.k += dt / this.blend.dur;
      this.blend.ft += dt * rate;
      if (this.blend.k >= 1) this.blend = null;
      else {
        const B = toRig(this.p, sampleClip(this.blend.from, this.blend.ft, this._bm || (this._bm = {})), s, this._bj || (this._bj = {})), k = this.blend.k * this.blend.k * (3 - 2 * this.blend.k);
        for (const key in this.J) if (B[key]) this.J[key].lerp(B[key], 1 - k);
      }
    }
    if (this.over) this.over(this.J);
    this.p.pose(this.J);
    if (this.rifle) {
      this.root.updateMatrixWorld(true);
      const hf = this.p.handFrame("r"), lf = this.p.handFrame("l");
      const dirv = lf.p.distanceTo(hf.p) < 0.55 * this.s ? lf.p.clone().sub(hf.p).normalize() : hf.fwd.clone();
      this.rifle.position.copy(hf.p);
      this.rifle.scale.setScalar(this.s);
      this.rifle.quaternion.setFromUnitVectors(V(0, 0, 1), dirv);
      this.rifle.visible = this.root.visible;
    }
    const f = this.flash > 0 ? Math.sin(performance.now() / 55) > 0 ? 1 : 0 : 0;
    for (const m of this.mats) m.emissive.setRGB(0.42 * f, 0.12 * f, 0.02 * f);
  }
  setOpacity(a) {
    this.opacity = a;
    this.p.opacity = a;
    if (this.rifle) this.rifle.visible = a > 0.05;
  }
  // ---- exact hit test: capsules along the drawn bones (world space). returns { d, part } or null
  hitRay(ray) {
    if (!this.root.visible || this.opacity < 0.3 || !this.J.head) return null;
    this.root.updateMatrixWorld(true);
    const w = (k) => this.J[k].clone().applyMatrix4(this.root.matrixWorld), s = this.s;
    const hipM = w("lHip").lerp(w("rHip"), 0.5), shM = w("lShoulder").lerp(w("rShoulder"), 0.5);
    const segs = [
      ["head", w("head").addScaledVector(V(0, 1, 0), -0.03 * s), w("head").addScaledVector(V(0, 1, 0), 0.07 * s), 0.11 * s],
      ["body", hipM, shM, 0.17 * s],
      ["body", w("lShoulder"), w("lElbow"), 0.06 * s],
      ["body", w("lElbow"), w("lWrist"), 0.05 * s],
      ["body", w("rShoulder"), w("rElbow"), 0.06 * s],
      ["body", w("rElbow"), w("rWrist"), 0.05 * s],
      ["body", w("lHip"), w("lKnee"), 0.085 * s],
      ["body", w("lKnee"), w("lAnkle"), 0.065 * s],
      ["body", w("rHip"), w("rKnee"), 0.085 * s],
      ["body", w("rKnee"), w("rAnkle"), 0.065 * s]
    ];
    let best = null;
    for (const [part, a, b, rad] of segs) {
      const d = rayCapsule(ray, a, b, rad);
      if (d !== null && (!best || d < best.d)) best = { d, part };
    }
    return best;
  }
  headWorld() {
    this.root.updateMatrixWorld(true);
    return this.J.head.clone().applyMatrix4(this.root.matrixWorld);
  }
  muzzleWorld() {
    return this.rifle ? this.rifle.userData.muzzle.getWorldPosition(V()) : this.headWorld();
  }
  dispose() {
    this.root.removeFromParent();
    freeSkeletons(this.p.root);
    if (this.rifle) {
      this.rifle.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
      });
      this.rifle.removeFromParent();
    }
  }
  // materials stay (their shader programs too)
};
var _u = V();
var _v = V();
var _w = V();
var _p = V();
function rayCapsule(ray, a, b, r) {
  const d = ray.direction, o = ray.origin;
  _u.copy(b).sub(a);
  _w.copy(o).sub(a);
  const aa = _u.dot(_u), bb = _u.dot(d), cc = d.dot(d), dd = _u.dot(_w), ee = d.dot(_w), den = aa * cc - bb * bb;
  let sc = den > 1e-9 ? clamp((cc * dd - bb * ee) / den, 0, 1) : clamp(dd / Math.max(aa, 1e-9), 0, 1);
  let tc = (bb * sc - ee) / cc;
  if (tc < 0) {
    tc = 0;
    sc = clamp(dd / Math.max(aa, 1e-9), 0, 1);
  }
  _p.copy(a).addScaledVector(_u, sc);
  _v.copy(o).addScaledVector(d, tc);
  const dist = _p.distanceTo(_v);
  if (dist > r) return null;
  return Math.max(0, tc - Math.sqrt(r * r - dist * dist));
}
function raySphere(ray, c, r) {
  const t = ray.direction.dot(_w.copy(c).sub(ray.origin));
  if (t < 0) return null;
  _p.copy(ray.origin).addScaledVector(ray.direction, t);
  const d = _p.distanceTo(c);
  return d <= r ? t - Math.sqrt(r * r - d * d) : null;
}
var PBR = null;
function setKit(R) {
  PBR = R;
}
var SHARED = new Proxy({}, { set(o, k, v) {
  o[k] = v;
  if (v && v.isMaterial) {
    v.userData.keep = true;
    if (v.map) v.map.userData.keep = true;
  }
  return true;
} });
async function makeVehicle2(kind, colour) {
  const [tyre, jerrycan] = await Promise.all([loadModel("old_tyre").catch(() => null), loadModel("metal_jerrycan_green").catch(() => null)]);
  return makeVehicle(kind, colour, { R: PBR, tyre, jerrycan });
}
var _inv = new Matrix4();
var _ray = new Ray();
function vehicleHit(g, ray) {
  g.updateMatrixWorld(true);
  _inv.copy(g.matrixWorld).invert();
  _ray.copy(ray).applyMatrix4(_inv);
  let best = null;
  for (const b of g.userData.hit) {
    const p = _ray.intersectBox(b, V());
    if (p) {
      const d = p.applyMatrix4(g.matrixWorld).distanceTo(ray.origin);
      if (best === null || d < best) best = d;
    }
  }
  return best;
}
var ITEM_LOOK = { mag: { c: 14200906, label: "AMMO" }, grenade: { c: 9097290, label: "GRENADE" }, drink: { c: 4903167, label: "HEALTH" }, super: { c: 16742970, label: "SUPER GUN" } };
function itemLabel(k) {
  return ITEM_LOOK[k].label;
}
function makeItem(kind) {
  const g = new Group(), steel = SHARED.steel || (SHARED.steel = new MeshStandardMaterial({ color: 2763566, roughness: 0.4, metalness: 0.85 }));
  if (kind === "mag") {
    const m = new Mesh(new BoxGeometry(0.06, 0.26, 0.11), steel);
    m.rotation.z = 0.15;
    g.add(m);
    const m2 = m.clone();
    m2.position.x = 0.09;
    m2.rotation.z = -0.1;
    g.add(m2);
  } else if (kind === "grenade") {
    const b = new Mesh(new CylinderGeometry(0.05, 0.05, 0.26, 12), new MeshStandardMaterial({ color: 4872746, roughness: 0.6 }));
    b.rotation.z = Math.PI / 2;
    g.add(b);
    const tip = new Mesh(new ConeGeometry(0.05, 0.12, 12), steel);
    tip.rotation.z = -Math.PI / 2;
    tip.position.x = 0.19;
    g.add(tip);
  } else if (kind === "drink") {
    const c = new Mesh(new CylinderGeometry(0.08, 0.08, 0.24, 14), new MeshStandardMaterial({ color: 3824186, roughness: 0.8 }));
    g.add(c);
    const cap = new Mesh(new CylinderGeometry(0.03, 0.03, 0.05, 10), steel);
    cap.position.y = 0.14;
    g.add(cap);
  } else {
    const b = new Mesh(new BoxGeometry(0.34, 0.08, 0.06), steel);
    g.add(b);
    const brl = new Mesh(new CylinderGeometry(0.012, 0.012, 0.2, 8), steel);
    brl.rotation.z = Math.PI / 2;
    brl.position.x = 0.26;
    g.add(brl);
    const mg = new Mesh(new BoxGeometry(0.04, 0.16, 0.04), steel);
    mg.position.set(-0.04, -0.1, 0);
    g.add(mg);
  }
  g.traverse((o) => {
    if (o.isMesh) o.castShadow = true;
  });
  const glow = new Sprite(new SpriteMaterial({ map: glowTexture(), color: ITEM_LOOK[kind].c, transparent: true, depthWrite: false, blending: AdditiveBlending, opacity: 0.8 }));
  keepAlpha(glow.material, true);
  glow.scale.setScalar(0.9);
  g.add(glow);
  g.userData.glow = glow;
  g.scale.setScalar(1.6);
  return g;
}
var FX = class {
  constructor(scene) {
    this.scene = scene;
    this.parts = [];
    this.lights = [];
    this.smokeM = new SpriteMaterial({ map: smokeTexture(), color: 7104610, transparent: true, depthWrite: false });
    this.fireM = new SpriteMaterial({ map: glowTexture(), color: 16752704, transparent: true, depthWrite: false, blending: AdditiveBlending });
    this.sparkM = new SpriteMaterial({ map: glowTexture(), color: 16767120, transparent: true, depthWrite: false, blending: AdditiveBlending });
    this.dustM = new SpriteMaterial({ map: smokeTexture(), color: 12101768, transparent: true, depthWrite: false });
    this.foamM = new SpriteMaterial({ map: smokeTexture(), color: 15922418, transparent: true, depthWrite: false });
    const tg = new BufferGeometry().setFromPoints([V(), V(0, 0, 1)]);
    this.tracerM = new LineBasicMaterial({ color: 16769184, transparent: true, opacity: 0.9, blending: AdditiveBlending, depthWrite: false });
    this.tracers = [];
    for (let i = 0; i < 24; i++) {
      const l = new Line(tg, keepAlpha(this.tracerM.clone(), true));
      l.visible = false;
      l.frustumCulled = false;
      scene.add(l);
      this.tracers.push({ l, t: 0 });
    }
    for (let i = 0; i < 4; i++) {
      const pl = new PointLight(16756832, 0, 18, 2);
      scene.add(pl);
      this.lights.push({ pl, t: 0, d: 1, peak: 0 });
    }
  }
  sprite(mat, p, v, size, grow, life, opacity, grav = 0, spin = 0) {
    let s = this.parts.find((q) => !q.alive && q.mat === mat);
    if (!s) {
      const sp = new Sprite(keepAlpha(mat.clone(), mat.blending === AdditiveBlending));
      this.scene.add(sp);
      s = { sp, mat, alive: false };
      this.parts.push(s);
    }
    Object.assign(s, { alive: true, v: v.clone(), size, grow, life, t: 0, opacity, grav, spin });
    s.sp.position.copy(p);
    s.sp.visible = true;
    s.sp.scale.setScalar(size);
    s.sp.material.rotation = Math.random() * 6;
    s.sp.material.opacity = opacity;
    return s;
  }
  light(p, color, peak, dur) {
    const L = this.lights.find((l) => l.t <= 0) || this.lights[0];
    L.pl.position.copy(p);
    L.pl.color.set(color);
    L.peak = peak;
    L.t = L.d = dur;
  }
  tracer(a, b) {
    const T = this.tracers.find((t) => t.t <= 0) || this.tracers[0];
    const dir = b.clone().sub(a);
    T.l.position.copy(a);
    T.l.lookAt(b);
    T.l.scale.set(1, 1, dir.length());
    T.l.visible = true;
    T.t = 0.06;
    T.l.material.opacity = 0.9;
  }
  dust(p, n = 4, col) {
    for (let i = 0; i < n; i++) this.sprite(this.dustM, p, V((Math.random() - 0.5) * 0.8, 0.5 + Math.random() * 0.8, (Math.random() - 0.5) * 0.8), 0.25, 1.4, 0.9 + Math.random() * 0.6, 0.55, -0.3).sp.material.color.set(col || 12101768);
  }
  sparks(p, n = 6) {
    for (let i = 0; i < n; i++) this.sprite(this.sparkM, p, V((Math.random() - 0.5) * 6, Math.random() * 4, (Math.random() - 0.5) * 6), 0.12, -0.08, 0.18 + Math.random() * 0.2, 1, 9);
  }
  explosion(p, big = 1) {
    this.light(p, 16752720, 60 * big, 0.5);
    for (let i = 0; i < 10 * big; i++) this.sprite(this.fireM, p.clone().add(V((Math.random() - 0.5) * big, Math.random() * big, (Math.random() - 0.5) * big)), V((Math.random() - 0.5) * 5, 1 + Math.random() * 4, (Math.random() - 0.5) * 5).multiplyScalar(big), 1.2 * big, 2.5, 0.35 + Math.random() * 0.3, 1);
    for (let i = 0; i < 12 * big; i++) this.sprite(this.smokeM, p.clone().add(V(0, 0.5, 0)), V((Math.random() - 0.5) * 3, 1.5 + Math.random() * 2.5, (Math.random() - 0.5) * 3).multiplyScalar(big), 1.5 * big, 3.5, 1.8 + Math.random() * 1.5, 0.75, -0.4).sp.material.color.set(3815220);
    this.sparks(p, 20);
  }
  muzzle(p, size = 0.35, color = 16760944) {
    this.sprite(this.fireM, p, V(), size, 0.5, 0.05, 1).sp.material.color.set(color);
    this.light(p, 16756832, 8, 0.05);
  }
  update(dt) {
    for (const s of this.parts) {
      if (!s.alive) continue;
      s.t += dt;
      if (s.t >= s.life) {
        s.alive = false;
        s.sp.visible = false;
        continue;
      }
      s.v.y -= s.grav * dt;
      s.sp.position.addScaledVector(s.v, dt);
      s.v.multiplyScalar(Math.exp(-dt * 1.2));
      const k = s.t / s.life;
      s.sp.scale.setScalar(Math.max(0.01, s.size * (1 + s.grow * k)));
      s.sp.material.opacity = s.opacity * (1 - k) * Math.min(1, s.t * 20);
    }
    for (const T of this.tracers) {
      if (T.t > 0) {
        T.t -= dt;
        T.l.material.opacity = Math.max(0, T.t / 0.06);
        if (T.t <= 0) T.l.visible = false;
      }
    }
    for (const L of this.lights) {
      if (L.t > 0) {
        L.t -= dt;
        L.pl.intensity = L.peak * Math.pow(Math.max(0, L.t / L.d), 2);
      } else L.pl.intensity = 0;
    }
  }
};
function makeUzi() {
  const g = new Group();
  const steel = PBR.pbr("green_metal_rust", { repeat: [0.5, 0.5], metalness: 0.55, roughness: 0.78 });
  steel.color = new Color(6317151);
  const worn = PBR.pbr("blue_metal_plate", { repeat: [0.3, 0.3], metalness: 0.8, roughness: 0.5 });
  worn.color = new Color(5922144);
  const poly = PBR.pbr("fabric_leather_02", { repeat: [0.4, 0.4], roughness: 0.88 });
  poly.color = new Color(3026994);
  const hole = new MeshStandardMaterial({ color: 328965, roughness: 1 });
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => {
    const o = new Mesh(geo, m);
    o.position.set(x, y, z);
    o.rotation.set(rx, ry, rz);
    g.add(o);
    return o;
  };
  const C = (r0, r1, h, n = 14) => new CylinderGeometry(r0, r1, h, n);
  add(new RoundedBoxGeometry(0.042, 0.05, 0.27, 3, 6e-3), steel, 0, 0, -0.05);
  add(new RoundedBoxGeometry(0.044, 0.016, 0.24, 3, 7e-3), steel, 0, 0.03, -0.06);
  for (let i = 0; i < 9; i++) add(new BoxGeometry(0.03, 3e-3, 4e-3), hole, 0, 0.0385, -0.16 + i * 0.022);
  add(new BoxGeometry(6e-3, 4e-3, 0.11), hole, -8e-3, 0.0385, -0.03);
  add(C(7e-3, 7e-3, 0.016, 10), worn, -8e-3, 0.046, -0.06);
  add(C(9e-3, 9e-3, 5e-3, 12), worn, -8e-3, 0.054, -0.06);
  add(C(0.017, 0.017, 0.07, 18), steel, 0, -2e-3, -0.215, Math.PI / 2);
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * Math.PI * 2;
    add(new BoxGeometry(4e-3, 4e-3, 0.04), hole, Math.cos(a) * 0.0172, -2e-3 + Math.sin(a) * 0.0172, -0.215, 0, 0, a);
  }
  add(C(0.021, 0.021, 0.012, 16), worn, 0, -2e-3, -0.185, Math.PI / 2);
  add(C(8e-3, 8e-3, 0.03, 10), steel, 0, -2e-3, -0.262, Math.PI / 2);
  add(C(35e-4, 35e-4, 6e-3, 8), hole, 0, -2e-3, -0.278, Math.PI / 2);
  add(new BoxGeometry(3e-3, 0.018, 5e-3), worn, 0, 0.04, -0.168);
  for (const x of [-9e-3, 9e-3]) add(new BoxGeometry(3e-3, 0.022, 0.012), steel, x, 0.04, -0.168);
  for (const x of [-8e-3, 8e-3]) add(new BoxGeometry(3e-3, 0.014, 8e-3), steel, x, 0.045, 0.065);
  add(new BoxGeometry(0.014, 0.012, 4e-3), worn, 0, 0.045, 0.066);
  add(new RoundedBoxGeometry(0.034, 0.12, 0.048, 2, 8e-3), poly, 0, -0.085, 0.01, 0.12);
  add(new BoxGeometry(0.03, 0.01, 0.042), steel, 0, -0.152, 0.019, 0.12);
  add(new BoxGeometry(0.012, 0.06, 8e-3), steel, 0, -0.07, 0.038, 0.12);
  add(new TorusGeometry(0.018, 28e-4, 6, 14, Math.PI), steel, 0, -0.03, -0.034, 0, Math.PI / 2, Math.PI);
  add(new BoxGeometry(5e-3, 0.02, 5e-3), worn, 0, -0.036, -0.032, 0.3);
  add(new RoundedBoxGeometry(0.036, 0.034, 0.1, 2, 8e-3), poly, 0, -0.035, -0.115);
  for (const x of [-0.019, 0.019]) add(new BoxGeometry(4e-3, 8e-3, 0.25), steel, x, -0.03, 0);
  add(C(8e-3, 8e-3, 0.048, 10), worn, 0, -0.03, 0.12, 0, 0, Math.PI / 2);
  add(new RoundedBoxGeometry(0.044, 0.016, 0.03, 2, 5e-3), steel, 0, -0.03, -0.12);
  add(new TorusGeometry(6e-3, 15e-4, 4, 10), worn, 0.023, -0.01, 0.1, 0, Math.PI / 2, 0);
  const muzzle = new Object3D();
  muzzle.position.set(0, -2e-3, -0.285);
  g.add(muzzle);
  g.userData.muzzle = muzzle;
  const flash = new Sprite(new SpriteMaterial({ map: glowTexture(), color: 16760944, transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending, opacity: 0 }));
  keepAlpha(flash.material, true);
  flash.scale.setScalar(0.12);
  muzzle.add(flash);
  g.userData.flash = flash;
  g.userData.grips = { r: [0, -0.088, 0.03], l: [0, -0.05, -0.115] };
  g.traverse((o) => {
    if (o.isMesh) {
      o.renderOrder = 50;
      o.castShadow = false;
    }
  });
  return g;
}
function makeViewArms(camera, uniform) {
  const holder = new Group();
  holder.rotation.y = Math.PI;
  camera.add(holder);
  const p = makePerson(TEMPL.soldier, { look: "clothed", outfit: "snowboarder", colors: SOLDIER_COLORS(uniform, false), lod: 0, shadow: false });
  let cloth = null;
  p.root.traverse((m) => {
    if (m.isMesh && m.userData.part === "jacket" && !cloth) cloth = m.material;
  });
  p.root.traverse((m) => {
    if (m.isMesh) {
      m.frustumCulled = false;
      m.castShadow = false;
      if (/helmet|hair|eyes|brows/.test(m.userData.part || "")) m.visible = false;
      if (m.userData.part === "body" && cloth) m.material = cloth;
    }
  });
  holder.add(p.root);
  p.grip("r", "club");
  p.grip("l", "club");
  for (const n of ["head", "neck_01"]) if (p.bones[n]) p.bones[n].scale.setScalar(1e-3);
  const J = {}, w = (gun, x, y, z) => holder.worldToLocal(gun.localToWorld(V(x, y, z))), c = (x, y, z) => holder.worldToLocal(camera.localToWorld(V(x, y, z)));
  const dir = (gun, x, y, z) => {
    const a = gun.localToWorld(V()), b = gun.localToWorld(V(x, y, z));
    return holder.worldToLocal(b).sub(holder.worldToLocal(a)).normalize();
  };
  return {
    holder,
    person: p,
    update(gun, ducking) {
      camera.updateMatrixWorld(true);
      gun.updateMatrixWorld(true);
      holder.updateMatrixWorld(true);
      const dy = ducking ? -0.02 : 0;
      J.lShoulder = c(-0.16, -0.22 + dy, -0.02);
      J.rShoulder = c(0.2, -0.22 + dy, 0.02);
      {
        const T = p.T0 || 0.5;
        J.lHip = c(-0.1, -0.22 + dy - T, 0.1);
        J.rHip = c(0.1, -0.22 + dy - T, 0.1);
      }
      J.head = c(0, -0.02, 0.1);
      J.nose = c(0, -0.04, -0.02);
      const G_ = gun.userData.grips;
      J.rWrist = w(gun, 8e-3, G_.r[1] - 0.03, G_.r[2] + 0.035);
      J.lWrist = w(gun, -0.012, G_.l[1] - 0.045, G_.l[2] + 0.01);
      J.rHandDir = dir(gun, -0.25, 0.75, -0.6);
      J.lHandDir = dir(gun, 0.25, 0.8, -0.5);
      J.rPalm = dir(gun, -1, 0.1, 0);
      J.lPalm = dir(gun, 0.5, 0.8, 0);
      for (const s of ["l", "r"]) {
        const sh = J[s + "Shoulder"], L1 = p.restLen[s].up, L2 = p.restLen[s].fore, d = J[s + "Wrist"].clone().sub(sh);
        if (d.length() > (L1 + L2) * 0.98) J[s + "Wrist"] = sh.clone().addScaledVector(d.normalize(), (L1 + L2) * 0.98);
        const pole = c(s === "l" ? -0.5 : 0.5, -1, 0.3).sub(c(0, 0, 0)).normalize();
        const k = ik2(sh, J[s + "Wrist"], L1, L2, pole);
        J[s + "Elbow"] = k.elbow;
        J[s + "Wrist"] = k.end;
      }
      p.pose(J);
    },
    dispose() {
      camera.remove(holder);
    }
  };
}

export {
  loadMocap,
  clipInfo,
  sampleClip,
  peopleURLs,
  loadPeople,
  freeSkeletons,
  Person,
  rayCapsule,
  raySphere,
  setKit,
  makeVehicle2 as makeVehicle,
  vehicleHit,
  itemLabel,
  makeItem,
  FX,
  makeUzi,
  makeViewArms
};
