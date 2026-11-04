import {
  RoundedBoxGeometry
} from "./chunk-UI5V7SMY.js";
import {
  environment,
  render,
  setup,
  sun
} from "./chunk-5EPBUA75.js";
import "./chunk-CPYHHAA5.js";
import "./chunk-GEQJXPAR.js";
import {
  ShaderPass
} from "./chunk-UBB4M7UR.js";
import {
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CapsuleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  LatheGeometry,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Quaternion,
  RepeatWrapping,
  RingGeometry,
  SRGBColorSpace,
  ShadowMaterial,
  SphereGeometry,
  TextureLoader,
  TorusGeometry,
  Vector2,
  Vector3
} from "./chunk-4IYDSAYK.js";
import "./chunk-NWIHTO7D.js";

// bmpage:bmpage:starjumps.html#0
(async () => {
  "use strict";
  const GAME = "starjumps", Q = new URLSearchParams(location.search), TV = Q.has("tv"), MUTE = Q.has("mute");
  const cv = document.getElementById("c"), ctx = cv.getContext("2d");
  let W = 0, H = 0, U = 0, DPR = 1;
  function resize() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = cv.width = Math.round(innerWidth * DPR);
    H = cv.height = Math.round(innerHeight * DPR);
    U = Math.min(W, H);
  }
  addEventListener("resize", resize);
  resize();
  const PINK = "#ff5c93", BLUE = "#4aa8ff", GOLD = "#ffcf5a", SUN = "#ff8a4c", GREEN = "#6fe0a0", PURPLE = "#a98bff";
  const rgba = (hex, a) => {
    const n = parseInt(hex.slice(1), 16);
    return "rgba(".concat(n >> 16, ",").concat(n >> 8 & 255, ",").concat(n & 255, ",").concat(Math.max(0, Math.min(1, a)), ")");
  };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;
  const FONT = '-apple-system, "SF Pro Display", "Segoe UI", system-ui, sans-serif';
  const glCanvas = document.createElement("canvas");
  document.getElementById("gl").appendChild(glCanvas);
  const RZ = setup(glCanvas, { fov: 42, near: 0.05, far: 80, tier: Q.has("tier") ? +Q.get("tier") : void 0 });
  const { renderer, scene, camera } = RZ;
  if (Q.has("tierlock")) RZ.quality.graceUntil = Infinity;
  renderer.toneMappingExposure = 1;
  camera.position.set(0, 1.3, 2.4);
  camera.lookAt(0, 0.95, -2.5);
  function fitCam() {
    const a = innerWidth / Math.max(1, innerHeight), need = 2.75, half = Math.tan(21 * Math.PI / 180) * a, base = 4.91;
    const d = Math.max(base, need / half), tx = 0, ty = 0.95, tz = -2.5, dy = (1.3 - ty) / base, dz = (2.4 - tz) / base;
    camera.position.set(tx, ty + dy * d, tz + dz * d);
    camera.lookAt(tx, ty, tz);
  }
  fitCam();
  addEventListener("resize", fitCam);
  const BG_ROT = Q.has("rot") ? +Q.get("rot") : 1.6;
  await environment(scene, renderer, "crossfit_gym", { background: true, blur: 0, intensity: 0.7, rotation: BG_ROT });
  const finishShader = {
    uniforms: { tDiffuse: { value: null }, uTime: { value: 0 } },
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader: "uniform sampler2D tDiffuse; uniform float uTime; varying vec2 vUv;\n    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + uTime) * 43758.5453); }\n    void main(){ vec4 c = texture2D(tDiffuse, vUv); vec2 d = vUv - 0.5; d.x *= 1.25;\n      c.rgb += (h(vUv * 911.0) - 0.5) * 0.016; gl_FragColor = c; }"
  };
  let finish = null, composerSeen = null;
  function decorateComposer() {
    const c = RZ.composer;
    if (c === composerSeen) return;
    composerSeen = c;
    finish = new ShaderPass(finishShader);
    c.addPass(finish);
    if (RZ.passes.bloom) {
      RZ.passes.bloom.strength = 0.15;
      RZ.passes.bloom.radius = 0.35;
      RZ.passes.bloom.threshold = 1.6;
    }
    if (RZ.passes.ao) RZ.passes.ao.blendIntensity = 0.9;
  }
  decorateComposer();
  const key = sun(scene, { intensity: 2.1, position: [1.2, 4.5, 1.2], target: [0, 0, -2.5], size: 3.8, color: 15988479 });
  key.shadow.radius = 5;
  scene.add(new HemisphereLight(15659775, 3821466, 0.3));
  const rim = new DirectionalLight(16052735, 2);
  rim.position.set(0.6, 3.2, -9);
  rim.target.position.set(0, 1, -2.5);
  scene.add(rim, rim.target);
  const catcher = new Mesh(new PlaneGeometry(14, 14), new ShadowMaterial({ opacity: 0.4 }));
  catcher.rotation.x = -Math.PI / 2;
  catcher.receiveShadow = true;
  scene.add(catcher);
  const blobTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(0,0,0,0.5)");
    gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
    return new CanvasTexture(c);
  })();
  const COACH_X = -1.95, YOU_X = 1.95, FIG_Z = -2.5;
  const TL = new TextureLoader();
  const mapsOf = (name, rep, kinds = ["nor_gl", "Rough", "AO"]) => {
    const base = "assets/textures/".concat(name, "/").concat(name, "_"), o = {};
    for (const k of kinds) {
      const t = TL.load(base + k + (window.BP_TV ? "_512.jpg" : "_2k.jpg"));
      t.wrapS = t.wrapT = RepeatWrapping;
      t.repeat.set(rep[0], rep[1]);
      t.anisotropy = 8;
      if (k === "Diffuse") t.colorSpace = SRGBColorSpace;
      o[k] = t;
    }
    return o;
  };
  const knit = mapsOf("waffle_pique_cotton", [6, 6]);
  const fabric = (color, { ns = 0.55, sheen = 0.5 } = {}) => {
    const c = new Color(color);
    const m = new MeshPhysicalMaterial({ color: c, normalMap: knit.nor_gl, roughnessMap: knit.Rough, aoMap: knit.AO, aoMapIntensity: 0.7, roughness: 1, side: DoubleSide, sheen, sheenRoughness: 0.75, sheenColor: c.clone().lerp(new Color(16777215), 0.25) });
    m.normalScale = new Vector2(ns, ns);
    return m;
  };
  const skinMat = (color, sheenColor) => new MeshPhysicalMaterial({ color, side: DoubleSide, roughness: 0.5, sheen: 0.35, sheenRoughness: 0.6, sheenColor: new Color(sheenColor), clearcoat: 0.12, clearcoatRoughness: 0.55 });
  function limbGeo(r0, r1, belly = 0, at = 0.35, seg2 = 22) {
    const pts = [], N = 18;
    for (let i = 0; i <= N; i++) {
      const t = i / N, cap = Math.min(t, 1 - t), r = (r0 + (r1 - r0) * t) * (1 + belly * Math.exp(-Math.pow((t - at) / 0.22, 2))) * (cap < 0.03 ? 0.86 + 0.14 * Math.sqrt(cap / 0.03) : 1);
      pts.push(new Vector2(i === 0 || i === N ? 1e-4 : r, t - 0.5));
    }
    return new LatheGeometry(pts, seg2);
  }
  const lathe = (prof, seg2, sx, sz) => {
    const g = new LatheGeometry(prof.map(([r, y]) => new Vector2(Math.max(1e-4, r), y)), seg2);
    g.scale(sx, 1, sz);
    return g;
  };
  const TORSO_M = lathe([[0, 0.14], [0.142, 0.14], [0.146, 0.22], [0.14, 0.36], [0.146, 0.5], [0.162, 0.64], [0.172, 0.75], [0.168, 0.83], [0.14, 0.9], [0.1, 0.955], [0.06, 0.99], [0, 1]], 44, 1.13, 0.64);
  const TORSO_F = lathe([[0, 0.14], [0.14, 0.14], [0.138, 0.22], [0.122, 0.36], [0.13, 0.5], [0.148, 0.64], [0.155, 0.74], [0.15, 0.83], [0.126, 0.9], [0.088, 0.955], [0.05, 0.99], [0, 1]], 44, 1.12, 0.66);
  const PELVIS_M = lathe([[0, -0.03], [0.12, -0.03], [0.15, -0.01], [0.16, -0.02], [0.155, 0.1], [0.147, 0.25], [0, 0.26]], 40, 1.1, 0.74);
  const PELVIS_F = lathe([[0, -0.03], [0.125, -0.03], [0.158, -0.01], [0.168, -0.02], [0.158, 0.1], [0.14, 0.25], [0, 0.26]], 40, 1.12, 0.74);
  const BUST = (() => {
    const g = new SphereGeometry(1, 24, 16);
    g.scale(0.15, 0.075, 0.07);
    return g;
  })();
  const NECK = limbGeo(0.056, 0.05, 0, 0.5, 18);
  const ARM_M = [[-0.06, 0.054], [0, 0.056], [0.12, 0.05], [0.24, 0.05], [0.42, 0.041], [0.5, 0.039], [0.6, 0.044], [0.72, 0.039], [0.95, 0.028], [1.05, 0.027]];
  const ARM_F = ARM_M.map(([t, r]) => [t, r * 0.86]);
  const LEG_M = [[-0.12, 0.1], [0, 0.096], [0.15, 0.088], [0.4, 0.063], [0.5, 0.055], [0.58, 0.056], [0.68, 0.061], [0.85, 0.042], [1.05, 0.035]];
  const LEG_F = [[-0.12, 0.1], [0, 0.097], [0.15, 0.087], [0.4, 0.06], [0.5, 0.052], [0.6, 0.053], [0.68, 0.057], [0.85, 0.039], [1.05, 0.032]];
  const _ca = new Vector3(), _cb = new Vector3(), _cp = new Vector3(), _ct = new Vector3(), _cn = new Vector3(), _cbn = new Vector3(), _p1 = new Vector3(), _p2 = new Vector3(), FWD = new Vector3(0, 0, 1);
  class Chain {
    constructor(prof, mat, { t0 = 0, t1 = 1, pad = 0, rings: rings2 = 34, sides = 22, parent = scene } = {}) {
      Object.assign(this, { prof, t0, t1, pad, R: rings2, S: sides });
      const n = (rings2 + 1) * (sides + 1), uv = new Float32Array(n * 2), idx = [];
      for (let i = 0; i <= rings2; i++) for (let j = 0; j <= sides; j++) {
        const k = i * (sides + 1) + j;
        uv[k * 2] = j / sides * 2;
        uv[k * 2 + 1] = i / rings2 * 3;
        if (i < rings2 && j < sides) {
          const a = k, b = k + sides + 1;
          idx.push(a, a + 1, b, b, a + 1, b + 1);
        }
      }
      const g = new BufferGeometry();
      this.P = new BufferAttribute(new Float32Array(n * 3), 3);
      this.N = new BufferAttribute(new Float32Array(n * 3), 3);
      g.setAttribute("position", this.P);
      g.setAttribute("normal", this.N);
      g.setAttribute("uv", new BufferAttribute(uv, 2));
      g.setIndex(idx);
      this.mesh = new Mesh(g, mat);
      this.mesh.castShadow = this.mesh.receiveShadow = true;
      this.mesh.frustumCulled = false;
      parent.add(this.mesh);
    }
    radius(tp) {
      const P = this.prof;
      if (tp <= P[0][0]) return P[0][1];
      for (let i = 1; i < P.length; i++) if (tp <= P[i][0]) {
        const [a, ra] = P[i - 1], [b, rb] = P[i];
        return ra + (rb - ra) * (tp - a) / (b - a);
      }
      return P[P.length - 1][1];
    }
    update(a, b, c) {
      _ca.subVectors(b, a);
      const L1 = Math.max(1e-3, _ca.length());
      _ca.divideScalar(L1);
      _cb.subVectors(c, b);
      const L2 = Math.max(1e-3, _cb.length());
      _cb.divideScalar(L2);
      const k = Math.min(0.3 * Math.min(L1, L2), 0.07);
      _p1.copy(b).addScaledVector(_ca, -k);
      _p2.copy(b).addScaledVector(_cb, k);
      const pos = this.P.array, nor = this.N.array, S = this.S;
      _cn.crossVectors(_ca, FWD);
      if (_cn.lengthSq() < 1e-4) _cn.set(1, 0, 0);
      _cn.normalize();
      for (let i = 0; i <= this.R; i++) {
        const tp = this.t0 + (this.t1 - this.t0) * i / this.R, s = tp < 0.5 ? tp * 2 * L1 : L1 + (tp - 0.5) * 2 * L2;
        if (s <= L1 - k) {
          _cp.copy(a).addScaledVector(_ca, s);
          _ct.copy(_ca);
        } else if (s >= L1 + k) {
          _cp.copy(b).addScaledVector(_cb, s - L1);
          _ct.copy(_cb);
        } else {
          const w = (s - (L1 - k)) / (2 * k), u = 1 - w;
          _cp.copy(_p1).multiplyScalar(u * u).addScaledVector(b, 2 * u * w).addScaledVector(_p2, w * w);
          _ct.copy(_ca).multiplyScalar(u).addScaledVector(_cb, w).normalize();
        }
        _cn.addScaledVector(_ct, -_cn.dot(_ct)).normalize();
        _cbn.crossVectors(_ct, _cn);
        const r = this.radius(tp) + this.pad;
        for (let j = 0; j <= S; j++) {
          const th = j / S * Math.PI * 2, cx = Math.cos(th), sy = Math.sin(th), q = (i * (S + 1) + j) * 3;
          const nx = _cn.x * cx + _cbn.x * sy, ny = _cn.y * cx + _cbn.y * sy, nz2 = _cn.z * cx + _cbn.z * sy;
          pos[q] = _cp.x + nx * r;
          pos[q + 1] = _cp.y + ny * r;
          pos[q + 2] = _cp.z + nz2 * r;
          nor[q] = nx;
          nor[q + 1] = ny;
          nor[q + 2] = nz2;
        }
      }
      this.P.needsUpdate = true;
      this.N.needsUpdate = true;
    }
  }
  const HAND = (() => {
    const g = new SphereGeometry(0.045, 18, 12);
    g.scale(0.82, 0.78, 0.5);
    return g;
  })();
  const FINGERS = (() => {
    const g = new SphereGeometry(0.045, 16, 10);
    g.scale(0.74, 0.72, 0.4);
    return g;
  })();
  const THUMB = new CapsuleGeometry(0.011, 0.03, 4, 8);
  const SHOE = (() => {
    const g = new SphereGeometry(1, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.62);
    g.scale(0.05, 0.068, 0.13);
    return g;
  })();
  const MIDSOLE = (() => {
    const g = new CapsuleGeometry(0.048, 0.162, 6, 16);
    g.rotateX(Math.PI / 2);
    g.scale(1.02, 0.26, 1);
    return g;
  })();
  const COLLAR = new TorusGeometry(0.04, 0.012, 8, 20);
  function makeAthlete({ skin, skinSheen, top, shorts, hair, female, band, shoe = 15856110, accent = 16735379, sleeves }) {
    const sk = skinMat(skin, skinSheen), hairM = new MeshStandardMaterial({ color: hair, roughness: 0.62, normalMap: knit.nor_gl, normalScale: new Vector2(1.2, 1.2) });
    const shoeM = new MeshPhysicalMaterial({ color: shoe, roughness: 0.55, normalMap: knit.nor_gl, normalScale: new Vector2(0.4, 0.4), sheen: 0.3 });
    const midM = new MeshStandardMaterial({ color: 16184816, roughness: 0.7 }), outM = new MeshStandardMaterial({ color: accent, roughness: 0.6 });
    const grp = new Group();
    scene.add(grp);
    const mesh = (geo, mat, parent = grp) => {
      const o = new Mesh(geo, mat);
      o.castShadow = true;
      o.receiveShadow = true;
      parent.add(o);
      return o;
    };
    const ball = (r, mat) => mesh(new SphereGeometry(r, 22, 14), mat);
    const A = {
      torso: mesh(female ? TORSO_F : TORSO_M, top),
      pelvis: mesh(female ? PELVIS_F : PELVIS_M, shorts),
      neck: mesh(NECK, sk),
      head: new Group()
    };
    grp.add(A.head);
    A.waist = mesh(new CylinderGeometry(0.152, 0.152, 0.03, 40, 1, true), female ? new MeshStandardMaterial({ color: 1381658, roughness: 0.7 }) : shorts, A.pelvis);
    A.waist.position.y = 0.24;
    A.waist.scale.set(1.1, 1, 0.74);
    const H_ = A.head;
    const skull = mesh(new SphereGeometry(0.1, 36, 26), sk, H_);
    skull.scale.set(female ? 0.78 : 0.8, 1.04, 0.97);
    const jaw = mesh(new SphereGeometry(0.07, 26, 16), sk, H_);
    jaw.scale.set(female ? 0.86 : 0.93, 0.92, 0.88);
    jaw.position.set(0, -0.05, 0.014);
    const brow = mesh(new CapsuleGeometry(0.01, 0.07, 4, 8), sk, H_);
    brow.rotation.z = Math.PI / 2;
    brow.position.set(0, 0.03, 0.083);
    const eyeW = new MeshStandardMaterial({ color: 15920614, roughness: 0.3 }), iris = new MeshStandardMaterial({ color: 2759440, roughness: 0.15 });
    const lashM = new MeshStandardMaterial({ color: hair, roughness: 0.8 });
    for (const sx of [-1, 1]) {
      const ir = mesh(new SphereGeometry(75e-4, 12, 8), iris, H_);
      ir.scale.set(1.25, 0.75, 0.5);
      ir.position.set(sx * 0.03, 0.011, 0.0895);
      const lid = mesh(new CapsuleGeometry(4e-3, 0.014, 3, 6), sk, H_);
      lid.rotation.z = Math.PI / 2;
      lid.position.set(sx * 0.03, 0.0185, 0.0905);
      const bw = mesh(new CapsuleGeometry(35e-4, 0.02, 3, 6), lashM, H_);
      bw.rotation.z = Math.PI / 2 + sx * 0.12;
      bw.position.set(sx * 0.031, 0.031, 0.092);
      const ear = mesh(new SphereGeometry(0.022, 14, 10), sk, H_);
      ear.scale.set(0.42, 1, 0.72);
      ear.position.set(sx * 0.081, -4e-3, -4e-3);
    }
    const nose = mesh(new ConeGeometry(0.013, 0.036, 12), sk, H_);
    nose.rotation.x = Math.PI / 2 + 0.38;
    nose.position.set(0, -9e-3, 0.092);
    const smile = mesh(new TorusGeometry(0.019, 42e-4, 6, 16, Math.PI), new MeshStandardMaterial({ color: female ? 10108732 : 7222312, roughness: 0.5 }), H_);
    smile.rotation.z = Math.PI;
    smile.position.set(0, -0.044, 0.08);
    smile.scale.set(0.85, 0.45, 0.6);
    const cap = mesh(new SphereGeometry(0.104, 34, 20, 0, Math.PI * 2, 0, Math.PI * (female ? 0.56 : 0.5)), hairM, H_);
    cap.scale.set(female ? 0.84 : 0.88, 1, 1.02);
    cap.position.set(0, female ? 4e-3 : 0.01, -0.01);
    cap.rotation.x = female ? -0.5 : -0.42;
    if (female) {
      A.pony = new Group();
      A.pony.position.set(0, 0.085, -0.075);
      H_.add(A.pony);
      const tie = mesh(new TorusGeometry(0.018, 7e-3, 8, 16), new MeshStandardMaterial({ color: accent, roughness: 0.5 }), A.pony);
      tie.rotation.x = 0.3;
      const tail = mesh(limbGeo(0.024, 0.012, 0.45, 0.35, 16), hairM, A.pony);
      tail.scale.y = 0.17;
      tail.position.set(0, -0.085, -0.012);
    }
    if (band) {
      const R0 = 0.104, prof = [];
      for (let i = 0; i <= 6; i++) {
        const y = 0.036 + 0.026 * i / 6;
        prof.push([Math.sqrt(R0 * R0 - y * y) * 1.035, y]);
      }
      const bg = lathe(prof, 40, female ? 0.84 : 0.88, 1.02);
      bg.translate(0, 0, 0);
      A.band = mesh(bg, new MeshPhysicalMaterial({ color: band, roughness: 0.85, sheen: 0.6, sheenColor: new Color(band), side: DoubleSide }), H_);
      A.band.position.set(0, female ? 4e-3 : 0.01, -0.01);
      A.band.rotation.x = 0.16;
    }
    for (const s of ["L", "R"]) {
      const armP = female ? ARM_F : ARM_M, legP = female ? LEG_F : LEG_M;
      A["arm" + s] = new Chain(armP, sk, { t0: -0.02, t1: 1.02 });
      if (sleeves) A["slv" + s] = new Chain(armP, top, { t0: -0.03, t1: 0.25, pad: 7e-3, rings: 12 });
      A["leg" + s] = new Chain(legP, sk, { t0: 0.02, t1: 1 });
      A["sho" + s] = new Chain(legP, shorts, { t0: -0.035, t1: female ? 0.36 : 0.3, pad: female ? 4e-3 : 0.014, rings: 14 });
      A["hd" + s] = mesh(HAND, sk);
      const fg = mesh(FINGERS, sk, A["hd" + s]);
      fg.position.set(0, -0.038, 9e-3);
      fg.rotation.x = -0.42;
      const tx = s === "L" ? -1 : 1, th = mesh(THUMB, sk, A["hd" + s]);
      th.position.set(tx * 0.026, -6e-3, 0.014);
      th.rotation.set(-0.3, 0, tx * 0.35);
      A["ft" + s] = mesh(SHOE, shoeM);
      const mid = mesh(MIDSOLE, midM, A["ft" + s]);
      mid.position.set(0, -4e-3, 2e-3);
      const out = mesh(MIDSOLE, outM, A["ft" + s]);
      out.position.set(0, -0.013, 2e-3);
      out.scale.set(1.01, 0.3, 1.01);
      const col = mesh(COLLAR, shoeM, A["ft" + s]);
      col.rotation.x = Math.PI / 2;
      col.position.set(0, 0.058, -0.052);
      const lace = mesh(new BoxGeometry(0.03, 6e-3, 0.07), midM, A["ft" + s]);
      lace.position.set(0, 0.052, 0.035);
      lace.rotation.x = 0.5;
    }
    const blobs = [0, 1, 2].map((i) => {
      const b = new Mesh(new PlaneGeometry(i === 2 ? 0.9 : 0.36, i === 2 ? 0.6 : 0.36), new MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, opacity: i === 2 ? 0.55 : 1 }));
      b.rotation.x = -Math.PI / 2;
      b.renderOrder = 2;
      scene.add(b);
      return b;
    });
    return { grp, A, blobs, female, pony: { a: 0, v: 0, hy: null, t: performance.now() } };
  }
  const COACH3 = makeAthlete({ skin: 12157024, skinSheen: 9058852, top: fabric(15884847), shorts: fabric(1579037, { ns: 0.35, sheen: 0.8 }), hair: 2824720, female: true, band: 16762161, shoe: 16053231, accent: 16735379 });
  const YOU3 = makeAthlete({ skin: 14264456, skinSheen: 10111536, top: fabric(3108824), shorts: fabric(3159101, { ns: 0.4 }), hair: 4863268, sleeves: true, shoe: 2829878, accent: 4892927 });
  const UP = new Vector3(0, 1, 0), _a = new Vector3(), _b = new Vector3(), _d = new Vector3(), _q = new Quaternion();
  function seg(m, a, b) {
    _d.subVectors(b, a);
    const L = _d.length();
    m.position.addVectors(a, b).multiplyScalar(0.5);
    m.scale.set(1, L, 1);
    m.quaternion.setFromUnitVectors(UP, _d.normalize());
  }
  function put(m, p, sx, sy, sz) {
    m.position.copy(p);
    if (sx) m.scale.set(sx, sy, sz);
  }
  const FU = 0.38, LIFT = 0.07, THIGH = 0.375, SHIN = 0.365, UPARM = 0.3, FOREARM = 0.265, ANKLE_H = 0.075;
  const _ik = new Vector3(), _ip = new Vector3();
  function ik2(a, c, l1, l2, pole) {
    _ik.subVectors(c, a);
    const D0 = Math.max(1e-4, _ik.length()), D = clamp(D0, Math.abs(l1 - l2) + 0.02, (l1 + l2) * 0.995);
    _ik.divideScalar(D0);
    const ca = clamp((l1 * l1 + D * D - l2 * l2) / (2 * l1 * D), -1, 1), sa = Math.sqrt(1 - ca * ca);
    _ip.copy(pole).addScaledVector(_ik, -pole.dot(_ik));
    if (_ip.lengthSq() < 1e-8) _ip.set(0, 0, -1).addScaledVector(_ik, _ik.z);
    _ip.normalize();
    return { mid: a.clone().addScaledVector(_ik, l1 * ca).addScaledVector(_ip, l1 * sa), end: a.clone().addScaledVector(_ik, D) };
  }
  function joints3(P, ox, oz, o) {
    var _a2, _b2;
    const t = o.t || 0, still = (_a2 = o.idle) != null ? _a2 : 1, sq = o.squat || 0;
    const breath = Math.sin(t * 6.283 / 4.4 + (o.seed || 0)), shift = Math.sin(t * 6.283 / 7.3 + (o.seed || 0) * 2) * still;
    const V = (q, z = 0, lift = LIFT) => new Vector3(ox + q[0] * FU, (2 - q[1]) * FU + lift, oz + z);
    const hip = V(P.hip, -0.24 * sq);
    hip.x += 0.011 * shift;
    const th = 0.5 * sq + (o.tip || 0), ct = Math.cos(th), st = Math.sin(th), up = 4e-3 * breath;
    const U2 = (q, z = 0) => {
      const v = V(q, z);
      const y = v.y - hip.y, zz = v.z - oz;
      v.set(v.x + 6e-3 * shift, hip.y + y * ct - zz * st + up, hip.z + y * st + zz * ct);
      return v;
    };
    const J = { hip, neck: U2(P.neck), head: U2(P.head, -0.01) };
    J.shL = U2([P.shL[0] * 0.86 + P.neck[0] * 0.14, P.shL[1] + 0.04]);
    J.shR = U2([P.shR[0] * 0.86 + P.neck[0] * 0.14, P.shR[1] + 0.04]);
    J.shL.y += up * 0.8;
    J.shR.y += up * 0.8;
    for (const [s, side] of [["L", -1], ["R", 1]]) {
      const hp = J["hp" + s] = V(P["hp" + s], -0.24 * sq);
      hp.x += 0.011 * shift;
      const lift = o["lift" + s] || 0, toe = 0.19 + 0.12 * sq;
      const ft = J["ft" + s] = V(P["ft" + s], 0.04 + 0.2 * lift, 0);
      if (!lift) ft.y = Math.max(0, ft.y);
      const ank = new Vector3(ft.x, ft.y + ANKLE_H, ft.z);
      const kp = new Vector3(side * Math.sin(toe) * (1 + 0.2 * sq), 0.15 * lift, Math.cos(toe));
      const L = ik2(hp, ank, THIGH, SHIN, kp);
      J["kn" + s] = L.mid;
      J["an" + s] = L.end;
      J["toe" + s] = toe;
      const sh = J["sh" + s];
      let hand, pole = new Vector3(side * 0.5, -0.3, -1);
      const A3 = o.arms && o.arms[s];
      if (A3) {
        hand = sh.clone().add(A3.h);
        if (A3.el) {
          const mid = sh.clone().lerp(hand, 0.5), pe = sh.clone().add(A3.el).sub(mid);
          if (pe.lengthSq() > 1e-4) {
            pe.normalize();
            pole.normalize().multiplyScalar(0.4).add(pe);
          }
        }
        if (hand.y < sh.y - 0.1) {
          pole.normalize();
          if (hand.z < sh.z - 0.06) pole.set(side, 0, -0.4);
          else if (pole.z > -0.12) pole.z = -0.35;
        }
      } else if (o.armsFwd) {
        const a = o.armsFwd * 1.45, R = (UPARM + FOREARM) * 0.97, d = new Vector3(side * 0.06, -Math.cos(a), Math.sin(a)).normalize();
        hand = sh.clone().addScaledVector(d, R);
      } else {
        const dx = P["h" + s][0] - P["sh" + s][0], dy = P["h" + s][1] - P["sh" + s][1], d = Math.hypot(dx, dy) * FU, R = (UPARM + FOREARM) * 0.97;
        const z = 0.05 + ((_b2 = o.handFwd) != null ? _b2 : 0.6) * Math.sqrt(Math.max(0, R * R - d * d));
        hand = new Vector3(sh.x + dx * FU, sh.y - dy * FU, sh.z + z);
        hand.x += side * 6e-3 * breath * still;
        hand.z += 0.012 * Math.sin(t * 6.283 / 5.1 + side) * still;
      }
      const A = ik2(sh, hand, UPARM, FOREARM, pole.normalize());
      J["el" + s] = A.mid;
      J["h" + s] = A.end;
    }
    return J;
  }
  const _hx = new Vector3(), _hy = new Vector3(), _hz = new Vector3(), _hm = new Matrix4();
  function poseAthlete(F, P, ox, oz, o) {
    var _a2;
    const J = joints3(P, ox, oz, o), A = F.A;
    const torsoDir = new Vector3().subVectors(J.neck, J.hip).normalize(), q = new Quaternion().setFromUnitVectors(UP, torsoDir);
    const tl = J.neck.distanceTo(J.hip), br = 1 + 0.012 * Math.sin((o.t || 0) * 6.283 / 4.4 + (o.seed || 0));
    A.torso.position.copy(J.hip);
    A.torso.quaternion.copy(q);
    A.torso.scale.set(br, tl, 1 + (br - 1) * 1.6);
    const pq = new Quaternion().setFromUnitVectors(UP, new Vector3().subVectors(J.neck, J.hip).setZ((J.neck.z - J.hip.z) * 0.5).normalize());
    A.pelvis.position.copy(J.hip);
    A.pelvis.quaternion.copy(pq);
    A.pelvis.scale.set(1, tl, 1);
    A.waist.scale.y = 1 / tl;
    const headC = new Vector3().copy(J.head).addScaledVector(torsoDir, -0.075);
    A.head.position.copy(headC);
    A.head.quaternion.copy(q);
    A.head.scale.setScalar(1.07);
    A.head.rotateX(0.04 - (o.squat || 0) * 0.45 + 0.015 * Math.sin((o.t || 0) * 6.283 / 4.4 + (o.seed || 0)));
    A.head.rotateZ(0.025 * Math.sin((o.t || 0) * 6.283 / 7.3 + (o.seed || 0) * 2) * ((_a2 = o.idle) != null ? _a2 : 1));
    seg(A.neck, new Vector3().copy(J.neck).addScaledVector(torsoDir, -0.03), new Vector3().copy(headC).addScaledVector(torsoDir, -0.075));
    if (A.pony) {
      const p = F.pony, now = performance.now(), dt = Math.min(0.05, (now - p.t) / 1e3) || 0.016;
      p.t = now;
      const vy = p.hy === null ? 0 : (headC.y - p.hy) / dt;
      p.hy = headC.y;
      p.v += (-p.a * 90 - p.v * 9 - vy * 6) * dt;
      p.a = clamp(p.a + p.v * dt, -0.6, 1.1);
      A.pony.rotation.x = 0.7 + p.a;
    }
    const side = { L: -1, R: 1 };
    for (const s of ["L", "R"]) {
      const root = _a.copy(J["sh" + s]).lerp(J.neck, 0.2).addScaledVector(torsoDir, -0.06);
      A["arm" + s].update(root, J["el" + s], J["h" + s]);
      if (A["slv" + s]) A["slv" + s].update(root, J["el" + s], J["h" + s]);
      _hy.subVectors(J["el" + s], J["h" + s]).normalize();
      _hz.set(-side[s], -0.2, 0.25).addScaledVector(_hy, -_hy.dot(_hz.set(-side[s], -0.2, 0.25)));
      if (_hz.lengthSq() < 1e-4) _hz.set(0, 0, 1).addScaledVector(_hy, -_hy.z);
      _hz.normalize();
      _hx.crossVectors(_hy, _hz).normalize();
      _hm.makeBasis(_hx, _hy, _hz);
      A["hd" + s].quaternion.setFromRotationMatrix(_hm);
      A["hd" + s].position.copy(J["h" + s]).addScaledVector(_hy, -0.04);
      const hp = J["hp" + s], kn = J["kn" + s], ankle = J["an" + s], ft = J["ft" + s];
      A["leg" + s].update(hp, kn, ankle);
      A["sho" + s].update(hp, kn, ankle);
      const lift = o["lift" + s] || 0;
      A["ft" + s].position.set(ankle.x, ankle.y - ANKLE_H + 0.045, ankle.z + 0.05);
      A["ft" + s].rotation.set(lift * 0.55, side[s] * J["toe" + s], 0, "YXZ");
      const blob = F.blobs[s === "L" ? 0 : 1];
      blob.position.set(ankle.x, 0.012, ankle.z + 0.05);
      const air2 = Math.max(0, ft.y);
      blob.material.opacity = clamp(1 - air2 * 3, 0.12, 1);
      blob.scale.setScalar(1 + air2 * 1.5);
    }
    const air = Math.max(0, Math.min(J.ftL.y, J.ftR.y)), body = F.blobs[2];
    body.position.set(J.hip.x, 0.011, oz + 0.05);
    body.material.opacity = 0.5 * clamp(1 - air * 2.5, 0.25, 1);
    body.scale.set(1 + Math.abs(J.ftL.x - J.ftR.x) * 0.8, 1, 1);
    return J;
  }
  const ARENA = (() => {
    const tierHi = RZ.quality.tier >= 2;
    const rub = mapsOf("rubber_tiles", [2, 1], ["Diffuse", "nor_gl", "Rough", "AO"]);
    const tileM = new MeshStandardMaterial({ map: rub.Diffuse, normalMap: rub.nor_gl, roughnessMap: rub.Rough, aoMap: rub.AO, color: 13817568, roughness: 1, envMapIntensity: 0.9 });
    const edgeM = new MeshStandardMaterial({ color: 1513500, roughness: 0.9 });
    const put3 = (o, x, y, z, ry = 0) => {
      o.position.set(x, y, z);
      o.rotation.y = ry;
      o.traverse((m) => {
        if (m.isMesh) {
          m.castShadow = true;
          m.receiveShadow = true;
        }
      });
      scene.add(o);
      return o;
    };
    for (const x of [COACH_X, YOU_X]) {
      const g = new Group();
      const top = new Mesh(new RoundedBoxGeometry(2, 0.014, 1, 2, 6e-3), tileM);
      top.position.y = 7e-3;
      g.add(top);
      put3(g, x, -4e-3, FIG_Z + 0.05, 0);
    }
    const iron = (c, rough = 0.48) => {
      const m = new MeshPhysicalMaterial({ color: c, roughness: rough, metalness: 0.55, clearcoat: 0.2, clearcoatRoughness: 0.6, normalMap: rub.nor_gl, normalScale: new Vector2(0.15, 0.15) });
      return m;
    };
    function kettlebell(r, mat) {
      const g = new Group();
      const b = new Mesh(new SphereGeometry(r, 36, 24, 0, Math.PI * 2, 0, Math.PI * 0.86), mat);
      b.position.y = r * 0.94;
      g.add(b);
      const base = new Mesh(new CylinderGeometry(r * 0.66, r * 0.62, r * 0.12, 32), mat);
      base.position.y = r * 0.06;
      g.add(base);
      const h = new Mesh(new TorusGeometry(r * 0.62, r * 0.13, 14, 36, Math.PI), mat);
      h.position.y = r * 1.62;
      h.scale.set(1, 1.05, 1);
      g.add(h);
      for (const sx of [-1, 1]) {
        const horn = new Mesh(new CylinderGeometry(r * 0.13, r * 0.16, r * 0.5, 14), mat);
        horn.position.set(sx * r * 0.62, r * 1.45, 0);
        horn.rotation.z = sx * 0.15;
        g.add(horn);
      }
      return g;
    }
    put3(kettlebell(0.105, iron(1842464)), COACH_X + 1.18, 0, FIG_Z + 0.32, 0.5);
    put3(kettlebell(0.088, iron(1842464)), COACH_X + 1.42, 0, FIG_Z + 0.08, -0.3);
    put3(kettlebell(0.1, iron(14242859, 0.4)), COACH_X - 1.18, 0, FIG_Z - 0.25, 0.9);
    const bumper = new MeshStandardMaterial({ color: 1710879, roughness: 0.82, normalMap: rub.nor_gl, normalScale: new Vector2(0.25, 0.25) });
    const steel = new MeshStandardMaterial({ color: 13225170, roughness: 0.28, metalness: 1 });
    function plate(r = 0.225, w = 0.055, ring = 16777215) {
      const g = new Group();
      const p = new Mesh(new CylinderGeometry(r, r, w, 48), bumper);
      g.add(p);
      const lip = new Mesh(new TorusGeometry(r - 5e-3, 9e-3, 8, 48), bumper);
      lip.rotation.x = Math.PI / 2;
      lip.position.y = w / 2 - 4e-3;
      g.add(lip);
      const hub = new Mesh(new CylinderGeometry(0.05, 0.05, w + 6e-3, 28), steel);
      g.add(hub);
      const hole = new Mesh(new CylinderGeometry(0.026, 0.026, w + 0.01, 20), new MeshStandardMaterial({ color: 328965, roughness: 1 }));
      g.add(hole);
      const dot = new Mesh(new RingGeometry(r * 0.62, r * 0.66, 48), new MeshStandardMaterial({ color: ring, roughness: 0.7 }));
      dot.rotation.x = -Math.PI / 2;
      dot.position.y = w / 2 + 1e-3;
      g.add(dot);
      return g;
    }
    put3(plate(0.225, 0.06, 4029401), YOU_X + 0.8, 0.03, FIG_Z - 0.78, 0.3);
    put3(plate(0.225, 0.05, 4173402), YOU_X + 0.81, 0.085, FIG_Z - 0.77, 1.1);
    const leather = mapsOf("fabric_leather_02", [2, 0.5]);
    const vinyl = new MeshPhysicalMaterial({ color: 1776414, roughnessMap: leather.Rough, normalMap: leather.nor_gl, roughness: 0.8, clearcoat: 0.35, clearcoatRoughness: 0.45 });
    const frameM = new MeshStandardMaterial({ color: 2763825, roughness: 0.42, metalness: 0.85 });
    const bench = new Group();
    const padG = new Mesh(new RoundedBoxGeometry(1.15, 0.085, 0.28, 5, 0.035), vinyl);
    padG.position.y = 0.43;
    bench.add(padG);
    const board = new Mesh(new BoxGeometry(1.08, 0.025, 0.24), new MeshStandardMaterial({ color: 3812384, roughness: 0.9 }));
    board.position.y = 0.38;
    bench.add(board);
    const rail = new Mesh(new BoxGeometry(0.92, 0.06, 0.07), frameM);
    rail.position.y = 0.34;
    bench.add(rail);
    for (const x of [-0.42, 0.42]) {
      const post = new Mesh(new BoxGeometry(0.07, 0.32, 0.07), frameM);
      post.position.set(x, 0.18, 0);
      bench.add(post);
      const foot = new Mesh(new BoxGeometry(0.08, 0.06, 0.46), frameM);
      foot.position.set(x, 0.03, 0);
      bench.add(foot);
      for (const z of [-0.2, 0.2]) {
        const cap = new Mesh(new CylinderGeometry(0.025, 0.025, 0.012, 14), edgeM);
        cap.position.set(x, 6e-3, z);
        bench.add(cap);
      }
    }
    const terry = mapsOf("terry_cloth", [1.5, 1.5], ["Diffuse", "nor_gl", "Rough", "AO"]);
    const towelM = new MeshPhysicalMaterial({ map: terry.Diffuse, normalMap: terry.nor_gl, roughnessMap: terry.Rough, aoMap: terry.AO, color: 12175064, roughness: 1, sheen: 0.8, sheenRoughness: 0.9, sheenColor: new Color(14542581), side: DoubleSide });
    towelM.normalScale = new Vector2(1.4, 1.4);
    const tg = new PlaneGeometry(0.34, 0.62, 18, 40), tp = tg.attributes.position;
    for (let i = 0; i < tp.count; i++) {
      const u = tp.getX(i), v = tp.getY(i) + 0.31, wob = Math.sin(u * 30 + v * 9) * 4e-3;
      let x = u, y, z;
      if (v < 0.3) {
        y = 0.475 + wob * 0.3;
        z = -0.13 + v * 0.95;
      } else {
        const k = v - 0.3, a = Math.min(Math.PI / 2, k / 0.05);
        y = 0.475 - (k < 0.078 ? 0.05 * Math.sin(a) : 0.05 + (k - 0.078));
        z = 0.155 + (k < 0.078 ? 0.05 * (1 - Math.cos(a)) : 0.05) + wob + k * 0.08;
      }
      tp.setXYZ(i, x, y, z);
    }
    tg.computeVertexNormals();
    const towel = new Mesh(tg, towelM);
    towel.position.x = 0.32;
    towel.rotation.y = 0.12;
    bench.add(towel);
    const bottle = new Group();
    const bodyB = new Mesh(lathe([[0, 0], [0.034, 0], [0.037, 8e-3], [0.037, 0.19], [0.03, 0.215], [0.02, 0.232], [0.02, 0.24], [0, 0.24]], 36, 1, 1), new MeshPhysicalMaterial({ color: 10466504, roughness: 0.32, metalness: 0.85, clearcoat: 0.6, clearcoatRoughness: 0.2 }));
    bottle.add(bodyB);
    const lid = new Mesh(new CylinderGeometry(0.023, 0.023, 0.03, 24), new MeshStandardMaterial({ color: 1316120, roughness: 0.5 }));
    lid.position.y = 0.255;
    bottle.add(lid);
    const loop = new Mesh(new TorusGeometry(0.014, 4e-3, 8, 16), lid.material);
    loop.position.set(0, 0.275, 0);
    bottle.add(loop);
    bottle.position.set(-0.4, 0.47, 0.02);
    bench.add(bottle);
    put3(bench, YOU_X + 1.05, 0, FIG_Z - 0.95, 1.15);
    const shaker = new Group();
    const sb = new Mesh(lathe([[0, 0], [0.04, 0], [0.043, 0.01], [0.045, 0.17], [0, 0.17]], 32, 1, 1), new MeshPhysicalMaterial({ color: 15660799, roughness: 0.18, transparent: true, opacity: 0.55, clearcoat: 1, depthWrite: false }));
    const water = new Mesh(new CylinderGeometry(0.04, 0.039, 0.1, 28), new MeshPhysicalMaterial({ color: 10474239, roughness: 0.05, transparent: true, opacity: 0.45, depthWrite: false }));
    water.position.y = 0.055;
    const sl = new Mesh(new CylinderGeometry(0.046, 0.046, 0.04, 28), new MeshStandardMaterial({ color: 16735379, roughness: 0.45 }));
    sl.position.y = 0.19;
    shaker.add(water, sb, sl);
    put3(shaker, COACH_X - 1.25, 0, FIG_Z + 0.35, 0);
    sb.castShadow = water.castShadow = false;
    let dust = null;
    if (RZ.quality.tier >= 1) {
      const N = tierHi ? 420 : 220, pos = new Float32Array(N * 3), seed = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 8;
        pos[i * 3 + 1] = 0.3 + Math.random() * 2.6;
        pos[i * 3 + 2] = -1.2 - Math.random() * 4.5;
        seed[i] = Math.random() * 100;
      }
      const g = new BufferGeometry();
      g.setAttribute("position", new BufferAttribute(pos, 3));
      g.setAttribute("seed", new BufferAttribute(seed, 1));
      const sprite = (() => {
        const c = document.createElement("canvas");
        c.width = c.height = 64;
        const x = c.getContext("2d"), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
        gr.addColorStop(0, "rgba(255,255,255,1)");
        gr.addColorStop(0.35, "rgba(255,255,255,0.35)");
        gr.addColorStop(1, "rgba(255,255,255,0)");
        x.fillStyle = gr;
        x.fillRect(0, 0, 64, 64);
        return new CanvasTexture(c);
      })();
      dust = new Points(g, new PointsMaterial({ size: 0.028, map: sprite, color: 16774108, transparent: true, opacity: 0.55, depthWrite: false, blending: AdditiveBlending, sizeAttenuation: true }));
      dust.frustumCulled = false;
      dust.renderOrder = 5;
      scene.add(dust);
    }
    return {
      tick(t) {
        if (!dust) return;
        const p = dust.geometry.attributes.position, s = dust.geometry.attributes.seed;
        for (let i = 0; i < p.count; i++) {
          const k = s.array[i];
          let y = p.array[i * 3 + 1] + Math.sin(t * 0.3 + k) * 4e-4 - 12e-5;
          if (y < 0.25) y = 2.9;
          p.array[i * 3] += Math.cos(t * 0.21 + k * 1.7) * 35e-5;
          p.array[i * 3 + 1] = y;
        }
        p.needsUpdate = true;
      }
    };
  })();
  function toScreen(p) {
    _a.copy(p).project(camera);
    return { x: (_a.x + 1) / 2 * W, y: (1 - _a.y) / 2 * H };
  }
  let coachJ = null, youJ = null;
  function render3D(dt, now) {
    decorateComposer();
    if (finish) finish.uniforms.uTime.value = now / 1e3 % 100;
    renderer.shadowMap.needsUpdate = true;
    ARENA.tick(now / 1e3);
    render(dt);
  }
  renderer.compile(scene, camera);
  RZ.quality.t0 = performance.now();
  RZ.quality.frames = 0;
  const CIRCUIT = [
    { move: "jacks", name: "JUMPING JACKS", how: "Jump your feet out, arms up high, then back in", label: "jumping jacks", secs: 15, tempo: 0.8, col: SUN },
    { move: "squats", name: "SQUATS", how: "Sit back halfway, like a chair, then stand up", label: "squats", secs: 15, tempo: 0.45, col: PINK },
    { move: "knees", name: "HIGH KNEES", how: "Jog on the spot and lift your knees", label: "steps", secs: 14, tempo: 1, col: GREEN },
    { move: "reach", name: "REACH UP", how: "Both hands up to the sky, then back down", label: "reaches", secs: 13, tempo: 0.6, col: BLUE },
    { move: "jacks", name: "JUMPING JACKS", how: "Last move! Feet out, arms up, as many as you can", label: "jumping jacks", secs: 13, tempo: 0.9, col: GOLD }
  ];
  const COUNT = 3, NICE = 2.6, LEAD_IN = 0.5, DEMO_REPS = 2;
  const demoRepT = (c) => clamp(1.4 / c.tempo, 2.2, 2.8);
  const cardSecs = (i) => (i === 0 ? 1 : 0) + LEAD_IN + DEMO_REPS * demoRepT(CIRCUIT[i]) + 0.7;
  const SKY = (() => {
    const tips = [];
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + i * 2 * Math.PI / 5;
      tips.push([0.8 + Math.cos(a) * 0.17, 0.45 + Math.sin(a) * 0.4]);
    }
    const arc = [];
    for (let i = 0; i <= 10; i++) {
      const a = Math.PI - i * Math.PI / 10;
      arc.push([0.5 + 0.44 * Math.cos(a), 0.95 - 0.85 * Math.sin(a)]);
    }
    return [
      { name: "THE SHOOTING STAR", pts: [[0.05, 0.9], [0.22, 0.78], [0.42, 0.66], [0.6, 0.56], ...tips], edges: [[0, 1], [1, 2], [2, 3], [3, 7], [4, 6], [6, 8], [8, 5], [5, 7], [7, 4]] },
      { name: "THE WHALE", pts: [[0.05, 0.55], [0.12, 0.28], [0.3, 0.14], [0.55, 0.17], [0.74, 0.34], [0.85, 0.5], [0.97, 0.18], [0.98, 0.75], [0.6, 0.76], [0.3, 0.82], [0.2, 0.42], [0.24, 0]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 5], [5, 8], [8, 9], [9, 0], [2, 11]] },
      { name: "THE ROCKET", pts: [[0.1, 0.5], [0.3, 0.5], [0.2, 0.02], [0.36, 0.25], [0.74, 0.25], [0.96, 0.5], [0.74, 0.75], [0.36, 0.75], [0.2, 0.98], [0.6, 0.5]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 1]] },
      { name: "THE CROWN", pts: [[0.18, 0.88], [0.12, 0.15], [0.32, 0.5], [0.5, 0.02], [0.68, 0.5], [0.88, 0.15], [0.82, 0.88], [0.5, 0.66]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0]] },
      { name: "THE RAINBOW", pts: arc, edges: arc.slice(1).map((_, i) => [i, i + 1]) }
    ];
  })();
  const MOVE_LABEL = { jacks: "JACKS", squats: "SQUATS", knees: "HIGH KNEES", reach: "REACHES" };
  let ac = null, master, music, musicLP, sfx, noiseBuf, acOff = null;
  function audioInit() {
    if (ac) {
      if (ac.state === "suspended") ac.resume().catch(() => {
      });
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ac = new AC();
    master = ac.createGain();
    master.gain.value = MUTE ? 0 : 0.9;
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 4;
    comp.attack.value = 3e-3;
    comp.release.value = 0.2;
    master.connect(comp);
    comp.connect(ac.destination);
    musicLP = ac.createBiquadFilter();
    musicLP.type = "lowpass";
    musicLP.frequency.value = 900;
    musicLP.Q.value = 0.8;
    music = ac.createGain();
    music.gain.value = 0.45;
    music.connect(musicLP);
    musicLP.connect(master);
    sfx = ac.createGain();
    sfx.gain.value = 0.9;
    sfx.connect(master);
    noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    if (ac.state === "suspended") ac.resume().catch(() => {
    });
  }
  const wake = () => {
    if (ac && ac.state === "suspended") ac.resume().catch(() => {
    });
  };
  addEventListener("pointerdown", wake);
  addEventListener("keydown", wake);
  const audioOK = () => ac && ac.state === "running";
  function env(g, t, a, peak, dec) {
    t = Math.max(t, ac.currentTime);
    g.gain.setValueAtTime(1e-4, t);
    g.gain.exponentialRampToValueAtTime(Math.max(2e-4, peak), t + a);
    g.gain.exponentialRampToValueAtTime(1e-4, t + a + dec);
  }
  function tone(dest, type, f, t, a, peak, dec, f2) {
    t = Math.max(t, ac.currentTime);
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + a + dec * 0.6);
    env(g, t, a, peak, dec);
    o.connect(g);
    g.connect(dest);
    o.start(t);
    o.stop(t + a + dec + 0.05);
    return o;
  }
  function nz(dest, t, dec, type, freq, q, peak, a = 1e-3) {
    t = Math.max(t, ac.currentTime);
    const n = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    n.buffer = noiseBuf;
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    env(g, t, a, peak, dec);
    n.connect(f);
    f.connect(g);
    g.connect(dest);
    n.start(t, Math.random() * 1.2);
    n.stop(t + a + dec + 0.05);
  }
  const VOW = { a: [800, 1250], e: [450, 2e3], i: [320, 2500], o: [480, 850], u: [350, 700] };
  function say(sylls, at = 0) {
    if (!audioOK()) return;
    let t = Math.max(ac.currentTime, ac.currentTime + at);
    for (const [v, f0, f1, dur] of sylls) {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(f0, t);
      o.frequency.linearRampToValueAtTime(f1, t + dur);
      env(g, t, 0.02, 0.5, dur);
      for (const [k, fq] of VOW[v].entries()) {
        const bp = ac.createBiquadFilter(), bg = ac.createGain();
        bp.type = "bandpass";
        bp.frequency.value = fq;
        bp.Q.value = 7;
        bg.gain.value = k ? 0.5 : 1;
        o.connect(bp);
        bp.connect(bg);
        bg.connect(g);
      }
      g.connect(sfx);
      o.start(t);
      o.stop(t + dur + 0.1);
      t += dur * 0.9;
    }
  }
  const VOICE = {
    ready: [["e", 260, 300, 0.13], ["i", 300, 420, 0.2]],
    go: [["o", 330, 520, 0.32]],
    nice: [["a", 300, 380, 0.12], ["i", 380, 330, 0.2]],
    yeah: [["e", 280, 360, 0.12], ["a", 380, 300, 0.28]],
    halfway: [["a", 300, 320, 0.11], ["a", 330, 330, 0.11], ["e", 360, 420, 0.18]],
    woo: [["u", 300, 600, 0.35]],
    rest: [["e", 330, 280, 0.16], ["u", 280, 240, 0.22]]
  };
  const PENTA = [523.25, 587.33, 659.26, 783.99, 880, 1046.5, 1174.66, 1318.5, 1567.98, 1760, 2093];
  function sfxRep(n) {
    if (!audioOK()) return;
    const t = ac.currentTime, f = PENTA[Math.min(PENTA.length - 1, n % 11)];
    tone(sfx, "triangle", f, t, 3e-3, 0.2, 0.35);
    tone(sfx, "sine", f * 2, t + 0.04, 3e-3, 0.07, 0.4);
    tone(sfx, "sine", f * 1.5, t + 0.08, 3e-3, 0.05, 0.3);
  }
  function sfxBeep(f, len = 0.12, v = 0.22) {
    if (!audioOK()) return;
    tone(sfx, "square", f, ac.currentTime, 2e-3, v * 0.5, len);
    tone(sfx, "sine", f, ac.currentTime, 2e-3, v, len);
  }
  function sfxGoal() {
    if (!audioOK()) return;
    const t = ac.currentTime;
    [523.25, 659.26, 783.99, 1046.5, 1318.5].forEach((f, i) => {
      tone(sfx, "triangle", f, t + i * 0.07, 4e-3, 0.16, 0.6);
      tone(sfx, "sine", f * 2, t + i * 0.07, 4e-3, 0.05, 0.5);
    });
  }
  function sfxEnd() {
    if (!audioOK()) return;
    const t = ac.currentTime + 0.05;
    [[261.63, 0], [329.63, 0.12], [392, 0.24], [523.25, 0.4], [659.26, 0.4]].forEach(([f, d]) => {
      tone(sfx, "triangle", f, t + d, 0.01, 0.14, 1.4);
      tone(sfx, "sine", f * 2, t + d, 0.01, 0.05, 1);
    });
  }
  const CH = [{ b: 65.41, c: [261.63, 329.63, 392] }, { b: 98, c: [246.94, 293.66, 392] }, { b: 110, c: [261.63, 329.63, 440] }, { b: 87.31, c: [261.63, 349.23, 440] }];
  const BPM = 124, BL = 60 / BPM;
  let nextMusic = 0;
  function scheduleMusic(g) {
    if (!audioOK() || acOff === null) return;
    while (nextMusic * BL < g + 0.4) {
      const i = nextMusic++, T = i * BL;
      let t = G.t0 / 1e3 + T + acOff;
      if (t < ac.currentTime - 0.02) continue;
      t = Math.max(t, ac.currentTime);
      const pos = i % 4, ch = CH[Math.floor(i / 4) % 4];
      tone(music, "sine", 150, t, 2e-3, 0.8, 0.28, 45);
      if (pos % 2) {
        nz(music, t, 0.15, "bandpass", 1500, 0.9, 0.35);
        nz(music, t + 0.012, 0.1, "bandpass", 1200, 0.9, 0.25);
      }
      nz(music, t + BL / 2, 0.04, "highpass", 8e3, 0.8, 0.08);
      const o = ac.createOscillator(), fl = ac.createBiquadFilter(), gg = ac.createGain();
      o.type = "square";
      o.frequency.value = ch.b * 2;
      fl.type = "lowpass";
      fl.frequency.setValueAtTime(1400, t + BL / 2);
      fl.frequency.exponentialRampToValueAtTime(250, t + BL);
      env(gg, t + BL / 2, 4e-3, 0.12, BL * 0.45);
      o.connect(fl);
      fl.connect(gg);
      gg.connect(music);
      o.start(t + BL / 2);
      o.stop(t + BL + 0.05);
      if (pos === 0 || pos === 2) ch.c.forEach((f) => tone(music, "triangle", f * (pos === 2 ? 2 : 1), t + BL * 0.75, 5e-3, 0.035, 0.18));
    }
  }
  function musicOpen(open) {
    if (!ac) return;
    musicLP.frequency.setTargetAtTime(open ? 9e3 : 700, ac.currentTime, 0.25);
  }
  const G = {
    state: "title",
    phase: "card",
    setIndex: 0,
    move: CIRCUIT[0].move,
    reps: 0,
    goal: 0,
    totalReps: 0,
    score: 0,
    time: 0,
    t0: 0,
    setLeft: 0,
    adapt: 1,
    sets: [],
    best: BodyMovin.best(GAME),
    result: null,
    circuit: CIRCUIT
  };
  window.__game = G;
  G.people = () => {
    const o = (J) => J && Object.fromEntries(Object.entries(J).filter(([k, v]) => v && v.isVector3).map(([k, v]) => [k, [+v.x.toFixed(4), +v.y.toFixed(4), +v.z.toFixed(4)]]));
    return { coach: o(coachJ), you: o(youJ) };
  };
  G.endNow = () => {
    if (G.state === "play") endGame();
  };
  G.drill = (m) => {
    G.state = "play";
    G.setIndex = CIRCUIT.findIndex((c) => c.move === m);
    beginWork(G.time);
    phaseStart = G.time + 1e5;
  };
  G.timeline = () => CIRCUIT.map((c, i) => ({ move: c.move, card: +cardSecs(i).toFixed(2), count: COUNT, work: c.secs, nice: NICE }));
  G.audio = () => ac ? ac.state : "none";
  G.quality = () => RZ.quality;
  G.buttons = () => buttons.map((b) => ({ x: b.x / W, y: b.y / H, w: b.w / W, h: b.h / H }));
  let phaseStart = 0, lastBeepSec = -1, coachPh = 0, repState = { armed: true }, stepAcc = 0, lastRepAt = 0, endAt = 0, lockUntil = 0, titleAt = performance.now();
  let sync = 0, syncHot = 0, alive = 0;
  let cheer = { s: "", life: 0, col: "#ffffff" }, nextCheerAt = 0, counterPop = 0, ringFlash = 0, saidHalf = false, saidGoal = false;
  let fix = { s: "", until: 0, next: 0 }, coachWait = 0;
  const parts = [], rings = [], floats = [], confetti = [];
  let SJ = null, kneePeak = 0;
  const SJDEF = { thigh: 0.72, hang: -1.05, upReach: 1, starUp: 0.8, feet0: 0.45, squat: 0.6, knee: 0 };
  const sjHist = { hip: [], feet: [] };
  const pctl = (a, q) => {
    const b = [...a].sort((x, y) => x - y);
    return b[Math.min(b.length - 1, Math.floor(q * b.length))];
  };
  function sjPic() {
    const I = BodyMovin.img;
    return BodyMovin.live && !BodyMovin.mouse && !BodyMovin.simulating && I && I.lShoulder && I.rShoulder && I.lHip && I.rHip && performance.now() - (BodyMovin.imgAt || 0) < 700 ? I : null;
  }
  function autoSJ() {
    const I = sjPic();
    if (!I) {
      SJ = null;
      G.calib = null;
      return;
    }
    const sh = (I.lShoulder[1] + I.rShoulder[1]) / 2, hy = (I.lHip[1] + I.rHip[1]) / 2, T = Math.max(0.03, Math.hypot((I.lShoulder[0] + I.rShoulder[0] - I.lHip[0] - I.rHip[0]) / 2, sh - hy));
    const feet0 = I.lFoot && I.rFoot ? clamp(Math.abs(I.lFoot[0] - I.rFoot[0]) / T, 0.1, 0.7) : SJDEF.feet0;
    SJ = Object.assign({}, SJDEF, { T, hipY: hy, feet0, feetStar: feet0 + 0.6 });
    sjHist.hip = [hy];
    sjHist.feet = [feet0];
  }
  function learnSJ() {
    const I = sjPic();
    if (!SJ || !I || BodyMovin.imgAt === SJ.at) return;
    SJ.at = BodyMovin.imgAt;
    const sh = (I.lShoulder[1] + I.rShoulder[1]) / 2, hy = (I.lHip[1] + I.rHip[1]) / 2, T = Math.hypot((I.lShoulder[0] + I.rShoulder[0] - I.lHip[0] - I.rHip[0]) / 2, sh - hy);
    if (T > 0.03) SJ.T += (T - SJ.T) * 0.01;
    sjHist.hip.push(hy);
    if (sjHist.hip.length > 120) sjHist.hip.shift();
    SJ.hipY = pctl(sjHist.hip, 0.3);
    if (I.lFoot && I.rFoot) {
      sjHist.feet.push(Math.abs(I.lFoot[0] - I.rFoot[0]) / SJ.T);
      if (sjHist.feet.length > 120) sjHist.feet.shift();
      SJ.feet0 = clamp(pctl(sjHist.feet, 0.2), 0.1, 1.2);
    }
    const grow = (k, v, lo, hi) => {
      if (v !== null && v > SJ[k]) SJ[k] = clamp(SJ[k] + (v - SJ[k]) * 0.05, lo, hi);
    };
    const up = (s) => I[s + "Hand"] ? (I[s + "Shoulder"][1] - I[s + "Hand"][1]) / SJ.T : null, ups = up("l") !== null && up("r") !== null ? Math.min(up("l"), up("r")) : null;
    if (G.move === "reach") grow("upReach", ups, 0.5, 1.6);
    if (G.move === "jacks") {
      grow("starUp", ups, 0.3, 1.5);
      if (I.lFoot && I.rFoot) grow("feetStar", Math.abs(I.lFoot[0] - I.rFoot[0]) / SJ.T, 0, 3);
    }
    SJ.feetStar = Math.max(SJ.feetStar, SJ.feet0 + 0.25);
    if (G.move === "squats") grow("squat", (hy - SJ.hipY) / SJ.T, 0.3, 1.6);
    G.calib = Object.fromEntries(Object.entries(SJ).filter(([k]) => k !== "at").map(([k, v]) => [k, +v.toFixed(3)]));
  }
  function kneeLift(I, thigh, T) {
    return I.lKnee && I.rKnee ? Math.abs(I.lKnee[1] - I.rKnee[1]) / T : 0;
  }
  function picBody() {
    const I = BodyMovin.img;
    if (!SJ || !BodyMovin.live || BodyMovin.mouse || BodyMovin.simulating || !I || !I.lShoulder || !I.rShoulder || !I.lHip || !I.rHip || performance.now() - (BodyMovin.imgAt || 0) > 700) return null;
    const T = SJ.T, up = (s) => I[s + "Hand"] ? (I[s + "Shoulder"][1] - I[s + "Hand"][1]) / T : null;
    const v = BodyMovin.vis || {}, seen = (j) => {
      var _a2;
      return I[j] && ((_a2 = v[j]) != null ? _a2 : 1) >= 0.35;
    };
    const feet = seen("lFoot") && seen("rFoot") ? Math.abs(I.lFoot[0] - I.rFoot[0]) / T : seen("lKnee") && seen("rKnee") ? Math.max(0, Math.abs(I.lKnee[0] - I.rKnee[0]) / T * 1.9 - 0.42) : I.lFoot && I.rFoot ? Math.abs(I.lFoot[0] - I.rFoot[0]) / T : null;
    return {
      upL: up("l"),
      upR: up("r"),
      feet,
      drop: ((I.lHip[1] + I.rHip[1]) / 2 - SJ.hipY) / T,
      knee: kneeLift(I, SJ.thigh, T)
    };
  }
  function startGame(now) {
    autoSJ();
    BodyMovin.uiCover = null;
    audioInit();
    if (ac) {
      music.gain.cancelScheduledValues(ac.currentTime);
      music.gain.setValueAtTime(trackOn ? 0 : 0.45, ac.currentTime);
      musicOpen(false);
    }
    Object.assign(G, { state: "play", phase: "card", setIndex: 0, move: CIRCUIT[0].move, reps: 0, totalReps: 0, score: 0, time: 0, t0: now, adapt: 1, sets: [], result: null });
    G.goal = goalFor(0);
    G.sky = [];
    G.syncReps = 0;
    G.halfReps = 0;
    kneePeak = 0;
    sync = 0;
    alive = 0;
    phaseStart = 0;
    lastBeepSec = -1;
    coachPh = 0;
    nextMusic = 0;
    repState = { armed: false };
    stepAcc = 0;
    lastRepAt = 0;
    nextCheerAt = 0;
    fix = { s: "", until: 0, next: 0 };
    coachWait = 0;
    cheer.life = 0;
    G.coachStep = "demo";
    parts.length = rings.length = floats.length = confetti.length = 0;
    BodyMovin.activity.activeSec = 0;
    BodyMovin.activity.kcal = 0;
    say(VOICE.ready, 0.15);
    const tr = BodyMovin.music(GAME);
    if (tr) tr.addEventListener("playing", () => {
      if (ac) music.gain.setTargetAtTime(0, ac.currentTime, 0.3);
      trackOn = true;
    }, { once: true });
  }
  let trackOn = false;
  function goHome() {
    if (ac) music.gain.setTargetAtTime(0, ac.currentTime, 0.05);
    location.href = "index.html";
  }
  const STEPS = (m) => m === "knees" ? 2 : 1;
  const goalFor = (i) => Math.max(4, Math.round(CIRCUIT[i].secs * CIRCUIT[i].tempo * STEPS(CIRCUIT[i].move) * 0.85 * G.adapt));
  function beginCard(g) {
    G.phase = "card";
    phaseStart = g;
    G.goal = goalFor(G.setIndex);
    G.move = CIRCUIT[G.setIndex].move;
    G.reps = 0;
    coachPh = 0;
    G.coachStep = "demo";
    musicOpen(false);
    if (G.setIndex) say(VOICE.ready, 0.2);
  }
  function beginCount(g) {
    G.phase = "count";
    phaseStart = g;
    coachPh = 0;
    lastBeepSec = -1;
    G.coachStep = "ready";
  }
  function beginWork(g) {
    G.phase = "work";
    phaseStart = g;
    G.reps = 0;
    G.goal = goalFor(G.setIndex);
    G.move = CIRCUIT[G.setIndex].move;
    repState = { armed: false };
    stepAcc = 0;
    lastRepAt = g;
    saidHalf = saidGoal = false;
    nextCheerAt = g + 3;
    coachPh = 0;
    coachWait = 0;
    fix = { s: "", until: 0, next: g + 3 };
    G.coachStep = "lead";
    sfxBeep(1318.5, 0.3, 0.3);
    say(VOICE.go, 0.05);
    musicOpen(true);
    ringFlash = 1;
  }
  function setFix(s, g) {
    if (g < fix.next) return;
    fix = { s, until: g + 2.2, next: g + 5 };
  }
  function finishSet(g) {
    const c = CIRCUIT[G.setIndex], ratio = G.reps / G.goal;
    G.sets.push({ move: c.move, name: c.name, reps: G.reps, goal: G.goal });
    G.sky.push({ i: G.setIndex, lit: Math.min(1, G.reps / G.goal) });
    if (G.reps >= G.goal) alive = 1;
    if (ratio < 0.5) G.adapt = Math.max(0.6, G.adapt * 0.85);
    else if (ratio >= 1) G.adapt = Math.min(1.25, G.adapt * 1.08);
    G.phase = "nice";
    phaseStart = g;
    G.niceReps = G.reps;
    G.coachStep = "wave";
    musicOpen(false);
    say(G.reps ? VOICE.yeah : VOICE.rest, 0.1);
  }
  function nextAfterNice(g) {
    if (G.setIndex === CIRCUIT.length - 1) return endGame();
    G.setIndex++;
    beginCard(g);
  }
  function endGame() {
    document.querySelectorAll(".bph-tip").forEach((e) => e.remove());
    const now = performance.now(), minutes = BodyMovin.activity.activeSec / 60, kcal = BodyMovin.activity.kcal, prev = BodyMovin.best(GAME);
    BodyMovin.saveSession({ game: GAME, score: G.score });
    if (BodyMovin.highScores) BodyMovin.highScores(GAME, G.score);
    G.best = BodyMovin.best(GAME);
    G.result = { score: G.score, totalReps: G.totalReps, syncReps: G.syncReps, sky: G.sky.slice(), minutes, kcal, newBest: G.score > prev && G.score > 0, sets: G.sets.slice() };
    G.state = "end";
    endAt = now;
    lockUntil = now + 1500;
    sfxEnd();
    musicOpen(false);
    if (ac) music.gain.setTargetAtTime(0, ac.currentTime, 1.5);
    for (let i = 0; i < 150; i++) confetti.push({ x: Math.random() * W, y: -Math.random() * H, vy: (0.12 + Math.random() * 0.22) * H, vx: (Math.random() - 0.5) * U * 0.08, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 8, w: U * (7e-3 + Math.random() * 0.01), col: [PINK, BLUE, GOLD, GREEN, SUN][i % 5], star: i % 4 === 0 });
  }
  function setCheer(s, col = "#ffffff", life = 1.4) {
    cheer = { s, col, life, max: life };
  }
  const CHEERS = ["YOU GOT THIS!", "KEEP IT UP!", "LOOKING STRONG!", "NICE RHYTHM!", "SO GOOD!", "WHOO HOO!", "FEEL THAT ENERGY!"];
  let hudR = [];
  BodyMovin.tips && BodyMovin.tips({ accent: GOLD, avoid: () => hudR, when: () => G.state === "play" && G.phase === "work" });
  function liveTips() {
    if (true) return;
    if (sync < 0.6) BodyMovin.tip("sync", G.move === "knees" ? "Double points: step as fast as Sunny" : "Double points: copy Sunny's arm and hip heights", 500, { hot: G.reps > 2 });
    if (G.reps >= G.goal) BodyMovin.tip("bonus", "Past the goal: +25 every 5 reps", 500);
    else if (G.goal - G.reps <= 5) BodyMovin.tip("goal", "Goal bonus +100: ".concat(G.goal - G.reps, " to go"), 500);
  }
  function addRep(g) {
    const inSync = sync > 0.6;
    G.reps++;
    G.totalReps++;
    G.score += inSync ? 20 : 10;
    if (inSync) G.syncReps++;
    lastRepAt = g;
    counterPop = 1;
    ringFlash = 0.6;
    sfxRep(G.reps - 1);
    const p = playerAnchor();
    burst(p.x, p.y, CIRCUIT[G.setIndex].col, 18);
    if (!saidHalf && G.reps === Math.ceil(G.goal / 2) && G.reps < G.goal) {
      saidHalf = true;
      say(VOICE.halfway, 0.15);
    }
    if (!saidGoal && G.reps === G.goal) {
      saidGoal = true;
      G.score += 100;
      sfxGoal();
      say(VOICE.woo, 0.35);
      rings.push({ x: W / 2, y: H * 0.6, r: U * 0.13, life: 0.7, max: 0.7, col: GOLD });
    } else if (G.reps > G.goal && (G.reps - G.goal) % 5 === 0) G.score += 25;
    else if (G.reps % 4 === 0 && G.reps < G.goal) {
      if (Math.random() < 0.5) say(VOICE.nice, 0.1);
    }
  }
  function burst(x, y, col, n, pw = 1) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283, sp = (0.2 + Math.random() * 0.8) * U * 0.8 * pw;
      parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - U * 0.2, life: 0.5 + Math.random() * 0.6, max: 1.1, col: Math.random() < 0.3 ? "#ffffff" : col, r: U * (4e-3 + Math.random() * 7e-3), star: Math.random() < 0.25 });
    }
  }
  BodyMovin.on("starjump", () => {
    if (G.state === "play" && G.phase === "work" && G.move === "jacks" && repState.armed && !picBody()) {
      repState.armed = false;
      addRep(G.time);
    }
  });
  BodyMovin.on("squat", () => {
    if (G.state === "play" && G.phase === "work" && G.move === "squats" && !picBody()) addRep(G.time);
  });
  BodyMovin.on("step", () => {
    if (G.state === "play" && G.phase === "work" && G.move === "knees") {
      if (SJ && SJ.knee && picBody()) {
        if (kneePeak < Math.max(0.1, SJ.knee * 0.45)) {
          G.lowSteps = (G.lowSteps || 0) + 1;
          return;
        }
        kneePeak = 0;
      }
      addRep(G.time);
    }
  });
  function repProgress(g, k, full, rest, half) {
    if (k < rest) {
      if (repState.armed && repState.peak >= 0.4 * full / 0.7 && repState.peak < full) {
        G.halfReps = (G.halfReps || 0) + 1;
        setFix(half, g);
      }
      repState.armed = true;
      repState.peak = 0;
      return;
    }
    if (!repState.armed) return;
    repState.peak = Math.max(repState.peak || 0, k);
    if (k >= full) {
      repState.armed = false;
      repState.peak = 0;
      addRep(g);
    }
  }
  function calReps(g, P) {
    const m = G.move, arms = (top) => P.upL === null || P.upR === null ? null : Math.min(P.upL, P.upR) - SJ.hang < 0 ? 0 : Math.min((P.upL - SJ.hang) / Math.max(0.3, top - SJ.hang), (P.upR - SJ.hang) / Math.max(0.3, top - SJ.hang));
    if (m === "jacks") {
      const a = arms(SJ.starUp);
      if (a === null) return;
      const f = P.feet === null ? a : (P.feet - SJ.feet0) / Math.max(0.25, SJ.feetStar - SJ.feet0);
      G.dbg = { a: +a.toFixed(2), f: +f.toFixed(2) };
      repProgress(g, Math.min(a / 0.6, f / 0.45) * 0.7, 0.7, 0.3, "Arms up high, feet out wide!");
    } else if (m === "reach") {
      const a = arms(SJ.upReach);
      if (a !== null) repProgress(g, a, 0.75, 0.35, "Reach all the way up!");
    } else if (m === "squats") {
      const D = clamp(SJ.squat * 0.37, 0.2, 0.26);
      repProgress(g, P.drop / D, 1, 0.45, "A little lower!");
      G.repK = +(P.drop / D).toFixed(2);
    } else if (m === "knees") kneePeak = Math.max(kneePeak, P.knee);
    if (m !== "squats") G.repK = 0;
  }
  const legsTracked = () => !!(BodyMovin.joints && (BodyMovin.joints.lFoot || BodyMovin.joints.lKnee) && (BodyMovin.joints.rFoot || BodyMovin.joints.rKnee));
  function detectReps(g, dt) {
    if (!SJ && sjPic()) autoSJ();
    learnSJ();
    const PB = picBody();
    if (PB) return calReps(g, PB);
    const L = BodyMovin.hands.left, R = BodyMovin.hands.right, B = BodyMovin.body, mouse = BodyMovin.mouse && !BodyMovin.live;
    const hs = mouse ? [R] : [L, R].filter((h) => h.seen);
    if (!hs.length) return;
    const up = (th) => hs.every((h) => h.y < th), down = (th) => hs.every((h) => h.y > th);
    const m = G.move;
    if (m === "jacks" || m === "reach" || mouse && m === "squats") {
      const upTh = m === "reach" ? 0.22 : 0.3;
      if (down(m === "reach" ? 0.45 : 0.5)) repState.armed = true;
      if (m === "jacks" && legsTracked() && !mouse) return;
      if (repState.armed && (up(upTh) || m !== "squats" && B.armsUp && !mouse)) {
        repState.armed = false;
        addRep(g);
      }
    } else if (m === "knees" && mouse) {
      if (R.speed > 0.6) stepAcc += dt * 2.4;
      while (stepAcc >= 1) {
        stepAcc -= 1;
        addRep(g);
      }
    }
  }
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  function pose(o) {
    const by = (o.y || 0) + (o.squat || 0) * 0.75, lean = o.lean || 0;
    const P = { hip: [lean * 0.15, by], neck: [lean * 0.55, by - 1.55], head: [lean * 0.7, by - 2.15] };
    P.shL = [P.neck[0] - 0.5, P.neck[1] + 0.12];
    P.shR = [P.neck[0] + 0.5, P.neck[1] + 0.12];
    P.hL = add(P.shL, o.hL);
    P.hR = add(P.shR, o.hR);
    for (const s of ["L", "R"]) {
      const sh = P["sh" + s], h = P["h" + s], d = Math.hypot(h[0] - sh[0], h[1] - sh[1]), side = s === "L" ? -1 : 1, seg2 = 0.78;
      const mid = [(sh[0] + h[0]) / 2, (sh[1] + h[1]) / 2], bulge = d < seg2 * 2 ? Math.sqrt(seg2 * seg2 - (d / 2) ** 2) : 0;
      let px = -(h[1] - sh[1]) / (d || 1), py = (h[0] - sh[0]) / (d || 1);
      if (px * side < 0 || Math.abs(px) < 0.2 && py < 0) {
        px = -px;
        py = -py;
      }
      P["el" + s] = [mid[0] + px * bulge, mid[1] + py * bulge];
      const hipS = [P.hip[0] + side * 0.24, by + 0.05], lift = o["lift" + s] || 0, ground = 2 + Math.min(0, o.y || 0), fx = o.ftX ? o.ftX[s] : null;
      if (lift > 0.03) {
        P["kn" + s] = [fx !== null ? fx * 0.9 : side * 0.28, by + 1 - 0.85 * lift];
        P["ft" + s] = [fx !== null ? fx * 0.85 : side * 0.24, P["kn" + s][1] + 1 - 0.25 * lift];
      } else {
        const ft = [fx !== null ? fx : side * (0.3 + 0.55 * (o.spread || 0)), ground], dl = Math.hypot(ft[0] - hipS[0], ft[1] - hipS[1]), L = 1.02;
        const mm = [(hipS[0] + ft[0]) / 2, (hipS[1] + ft[1]) / 2], bb = dl < 2 * L ? Math.sqrt(L * L - (dl / 2) ** 2) : 0;
        P["kn" + s] = [mm[0] + side * bb * 0.95, mm[1]];
        P["ft" + s] = ft;
      }
      P["hp" + s] = hipS;
    }
    return P;
  }
  const ARM = (side, ang, len = 1.45) => [side * Math.sin(ang) * len, Math.cos(ang) * len];
  function coachPose(move, ph) {
    const c = Math.cos(ph * 6.283), k = (1 - c) / 2, s = Math.sin(ph * 6.283);
    if (move === "jacks") {
      const a = lerp(0.18, 2.8, k);
      return pose({ y: -0.38 * Math.abs(s), hL: ARM(-1, a), hR: ARM(1, a), spread: k });
    }
    if (move === "squats") {
      const e = k * k * (3 - 2 * k);
      return pose({ squat: e, hL: [lerp(-0.25, -0.05, e), lerp(1.35, 0.15, e)], hR: [lerp(0.25, 0.05, e), lerp(1.35, 0.15, e)], spread: 0.36 });
    }
    if (move === "knees") {
      return pose({ y: -0.14 * Math.abs(s), liftL: Math.max(0, s), liftR: Math.max(0, -s), hL: [-0.12, lerp(1, 0.45, Math.max(0, -s))], hR: [0.12, lerp(1, 0.45, Math.max(0, s))] });
    }
    if (move === "reach") {
      const e = k * k * (3 - 2 * k);
      return pose({ y: -0.12 * e, hL: [lerp(-0.6, -0.25, e), lerp(0.25, -1.45, e)], hR: [lerp(0.6, 0.25, e), lerp(0.25, -1.45, e)] });
    }
    return pose({ y: -0.05 * Math.abs(s), hL: ARM(-1, 0.25), hR: [0.55 + 0.25 * s, -1.25] });
  }
  let pj = 0, pSpread = 0, pKnee = 0;
  function playerPose(dt, now) {
    var _a2, _b2;
    const B = BodyMovin.body, L = BodyMovin.hands.left, R = BodyMovin.hands.right, mouse = BodyMovin.mouse && !BodyMovin.live;
    pj += ((B.jumping ? -0.45 : 0) - pj) * Math.min(1, dt * 12);
    const both = L.y < 0.3 && R.y < 0.3;
    const pb = !mouse ? picBody() : null;
    if (pb && pb.feet !== null) {
      const f0 = (_a2 = SJ.feet0) != null ? _a2 : 0.45, f1 = Math.max(f0 + 0.35, (_b2 = SJ.feetStar) != null ? _b2 : 1.3);
      pSpread += (clamp((pb.feet - f0) / (f1 - f0), 0, 1) - pSpread) * Math.min(1, dt * 20);
      pj += (clamp(pb.drop, -0.6, 0) * 0.9 - pj) * Math.min(1, dt * 20);
    } else pSpread += (((B.starJump || both) && !mouse ? 1 : 0) - pSpread) * Math.min(1, dt * 10);
    pKnee += ((B.running > 0.05 && !mouse ? 1 : 0) - pKnee) * Math.min(1, dt * 6);
    const legs = !mouse ? picLegs(dt) : null;
    const realKnees = !legs && (B.kneeL > 0.02 || B.kneeR > 0.02);
    const s = Math.sin(now / 1e3 * 6.283 * Math.max(0.5, B.cadence / 120)) * pKnee;
    const toFig = (h, side) => {
      if (!h.seen) return ARM(side, 0.2);
      let v = [(h.x - (side < 0 ? 0.38 : 0.62)) * 3.6, (h.y - 0.42) * 4.4];
      const d = Math.hypot(v[0], v[1]);
      if (d > 1.6) v = [v[0] / d * 1.6, v[1] / d * 1.6];
      if (v[1] > 0.5 && Math.abs(v[0]) < 0.6) v = [side * 0.25, 1.42];
      return v;
    };
    if (legs) return pose({ y: pj, squat: B.crouch, lean: B.lean * 0.6, ftX: legs.x, liftL: legs.lift.L, liftR: legs.lift.R, hL: toFig(L, -1), hR: toFig(R, 1) });
    return pose({ y: pj, squat: B.crouch, lean: B.lean * 0.6, spread: pSpread, liftL: realKnees ? B.kneeL : Math.max(0, s), liftR: realKnees ? B.kneeR : Math.max(0, -s), hL: mouse ? ARM(-1, 0.2) : toFig(L, -1), hR: toFig(R, 1) });
  }
  const LEGS = { x: { L: -0.3, R: 0.3 }, lift: { L: 0, R: 0 }, at: -1e9 };
  const FIG_T = 1.55;
  function picLegs(dt) {
    const I = sjPic(), raw = BodyMovin.rawImg || {}, v = BodyMovin.vis || {}, k = Math.min(1, dt * 25);
    if (!I) {
      if (performance.now() - LEGS.at > 1500) return null;
      const d = Math.min(1, dt / 0.6);
      for (const s of ["L", "R"]) {
        LEGS.x[s] += ((s === "L" ? -0.3 : 0.3) - LEGS.x[s]) * d;
        LEGS.lift[s] *= 1 - d;
      }
      return LEGS;
    }
    const sh = (I.lShoulder[1] + I.rShoulder[1]) / 2, hy = (I.lHip[1] + I.rHip[1]) / 2;
    const T = Math.max(0.03, Math.hypot((I.lShoulder[0] + I.rShoulder[0] - I.lHip[0] - I.rHip[0]) / 2, sh - hy)), hx = (I.lHip[0] + I.rHip[0]) / 2;
    const ok = (j) => {
      var _a2;
      return I[j] && ((_a2 = v[j]) != null ? _a2 : 1) >= 0.35 && !(raw[j] && raw[j][1] > 0.985);
    };
    const fig = (p) => -(p[0] - hx) / T * FIG_T;
    for (const [s, j, side] of [["L", "l", -1], ["R", "r", 1]]) {
      let x;
      if (ok(j + "Foot")) x = fig(I[j + "Foot"]);
      else if (ok(j + "Knee")) {
        const h = fig(I[j + "Hip"]);
        x = h + (fig(I[j + "Knee"]) - h) * 2.1;
      } else x = fig(I[j + "Hip"]) + side * 0.06;
      x = side < 0 ? clamp(x, -1.45, -0.1) : clamp(x, 0.1, 1.45);
      LEGS.x[s] += (x - LEGS.x[s]) * k;
    }
    const lift = { L: 0, R: 0 };
    if (ok("lKnee") && ok("rKnee")) {
      const d = (I.rKnee[1] - I.lKnee[1]) / T;
      lift.L = clamp((d - 0.12) / 0.45, 0, 1);
      lift.R = clamp((-d - 0.12) / 0.45, 0, 1);
    }
    for (const s of ["L", "R"]) LEGS.lift[s] += (lift[s] - LEGS.lift[s]) * k;
    LEGS.at = performance.now();
    return LEGS;
  }
  const ARMS = { L: null, R: null, at: -1e9 };
  function picArms(dt) {
    var _a2, _b2;
    const I = sjPic(), v = BodyMovin.vis || {}, J = BodyMovin.rawJ || BodyMovin.joints, k = Math.min(1, dt * 18);
    if (!I) return performance.now() - ARMS.at < 600 && ARMS.L ? ARMS : null;
    const ar = BodyMovin.imgAR || 0.5625, P = (p) => [p[0] * ar, p[1]];
    const sh = [(I.lShoulder[0] + I.rShoulder[0]) / 2 * ar, (I.lShoulder[1] + I.rShoulder[1]) / 2], hp = [(I.lHip[0] + I.rHip[0]) / 2 * ar, (I.lHip[1] + I.rHip[1]) / 2];
    const m = FIG_T * FU / Math.max(0.03, Math.hypot(sh[0] - hp[0], sh[1] - hp[1]));
    for (const [s, j] of [["L", "l"], ["R", "r"]]) {
      const S = I[j + "Shoulder"], E = I[j + "Forearm"], H2 = I[j + "Hand"];
      if (!S || !H2 || ((_a2 = v[j + "Hand"]) != null ? _a2 : 1) < 0.3) continue;
      const dz = (a) => J && J[a] && J[j + "Shoulder"] ? clamp(J[a][2] - J[j + "Shoulder"][2], -0.2, 0.55) : 0.05;
      const vec = (q, key2) => [-(P(q)[0] - P(S)[0]) * m, -(q[1] - S[1]) * m, dz(key2)];
      const h = vec(H2, j + "Hand"), e = E && ((_b2 = v[j + "Forearm"]) != null ? _b2 : 1) >= 0.3 ? vec(E, j + "Forearm") : null;
      const cur = ARMS[s];
      if (!cur) ARMS[s] = { h: new Vector3(...h), el: e ? new Vector3(...e) : null };
      else {
        cur.h.lerp(_a.set(...h), k);
        if (e) {
          if (cur.el) cur.el.lerp(_a.set(...e), k);
          else cur.el = new Vector3(...e);
        }
      }
    }
    if (!ARMS.L || !ARMS.R) return null;
    ARMS.at = performance.now();
    return ARMS;
  }
  function figurePath(P) {
    const p = new Path2D(), seg2 = (a, b) => {
      p.moveTo(a[0], a[1]);
      p.lineTo(b[0], b[1]);
    };
    seg2(P.shL, P.elL);
    seg2(P.elL, P.hL);
    seg2(P.shR, P.elR);
    seg2(P.elR, P.hR);
    seg2(P.hpL, P.knL);
    seg2(P.knL, P.ftL);
    seg2(P.hpR, P.knR);
    seg2(P.knR, P.ftR);
    return p;
  }
  function drawFigure(cx, cy, u, P, st, now) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(u, u);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const sh = ctx.createRadialGradient(0, 2.1, 0, 0, 2.1, 1.5);
    sh.addColorStop(0, rgba(st.col, 0.35));
    sh.addColorStop(1, rgba(st.col, 0));
    ctx.fillStyle = sh;
    ctx.beginPath();
    ctx.ellipse(0, 2.1, 1.5, 0.3, 0, 0, 6.283);
    ctx.fill();
    if (!st.flat) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const hg = ctx.createRadialGradient(P.neck[0], P.hip[1] - 0.8, 0.2, P.neck[0], P.hip[1] - 0.8, 3.2);
      hg.addColorStop(0, rgba(st.col, st.halo));
      hg.addColorStop(1, rgba(st.col, 0));
      ctx.fillStyle = hg;
      ctx.beginPath();
      ctx.arc(P.neck[0], P.hip[1] - 0.8, 3.2, 0, 6.283);
      ctx.fill();
      ctx.restore();
    }
    const limbs = figurePath(P);
    ctx.shadowColor = st.flat ? "rgba(0,0,0,0.5)" : st.col;
    ctx.shadowBlur = u * 0.35;
    ctx.strokeStyle = rgba(st.col, 0.95);
    ctx.lineWidth = 0.42;
    ctx.stroke(limbs);
    ctx.beginPath();
    ctx.moveTo(P.shL[0] + 0.05, P.shL[1]);
    ctx.lineTo(P.shR[0] - 0.05, P.shR[1]);
    ctx.quadraticCurveTo(P.hip[0] + 0.6, (P.neck[1] + P.hip[1]) / 2, P.hpR[0] + 0.08, P.hip[1] + 0.12);
    ctx.lineTo(P.hpL[0] - 0.08, P.hip[1] + 0.12);
    ctx.quadraticCurveTo(P.hip[0] - 0.6, (P.neck[1] + P.hip[1]) / 2, P.shL[0] + 0.05, P.shL[1]);
    ctx.closePath();
    ctx.fillStyle = rgba(st.col, 0.95);
    ctx.fill();
    ctx.lineWidth = 0.3;
    ctx.strokeStyle = rgba(st.col, 0.95);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.lineWidth = 0.13;
    ctx.stroke(limbs);
    if (st.shirt) {
      ctx.fillStyle = st.shirt;
      ctx.beginPath();
      ctx.ellipse((P.neck[0] + P.hip[0]) / 2, (P.neck[1] + P.hip[1]) / 2 + 0.05, 0.42, 0.55, 0, 0, 6.283);
      ctx.fill();
    }
    if (st.star) drawStar((P.neck[0] + P.hip[0]) / 2, (P.neck[1] + P.hip[1]) / 2, 0.3, "#ffffff", 0);
    const hx = P.head[0], hy = P.head[1];
    ctx.shadowColor = st.col;
    ctx.shadowBlur = u * 0.3;
    ctx.fillStyle = rgba(st.col, 1);
    ctx.beginPath();
    ctx.arc(hx, hy, 0.56, 0, 6.283);
    ctx.fill();
    ctx.shadowBlur = 0;
    const fg = ctx.createRadialGradient(hx - 0.2, hy - 0.25, 0.05, hx, hy, 0.56);
    fg.addColorStop(0, "rgba(255,255,255,0.55)");
    fg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = fg;
    ctx.beginPath();
    ctx.arc(hx, hy, 0.56, 0, 6.283);
    ctx.fill();
    if (st.band) {
      ctx.strokeStyle = st.band;
      ctx.lineWidth = 0.16;
      ctx.beginPath();
      ctx.arc(hx, hy + 0.05, 0.52, Math.PI * 1.12, Math.PI * 1.88);
      ctx.stroke();
    }
    if (st.face) {
      const blink = now % 3100 < 110;
      ctx.fillStyle = "#2a1640";
      for (const d of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(hx + d * 0.19, hy + 0.02, 0.075, blink ? 0.015 : 0.1, 0, 0, 6.283);
        ctx.fill();
      }
      ctx.strokeStyle = "#2a1640";
      ctx.lineWidth = 0.07;
      ctx.beginPath();
      ctx.arc(hx, hy + 0.12, 0.2, Math.PI * 0.15, Math.PI * 0.85);
      ctx.stroke();
      ctx.fillStyle = "rgba(255,90,150,0.45)";
      for (const d of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(hx + d * 0.36, hy + 0.15, 0.09, 0.055, 0, 0, 6.283);
        ctx.fill();
      }
    }
    if (!st.flat) for (const [s, c] of [["L", st.hL || st.col], ["R", st.hR || st.col]]) {
      const h = P["h" + s];
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const g2 = ctx.createRadialGradient(h[0], h[1], 0, h[0], h[1], 0.6);
      g2.addColorStop(0, "rgba(255,255,255,0.95)");
      g2.addColorStop(0.3, rgba(c, 0.8));
      g2.addColorStop(1, rgba(c, 0));
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.arc(h[0], h[1], 0.6, 0, 6.283);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }
  function drawStar(x, y, r, col, blur = 0.5) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * 0.45 : r;
      ctx.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q);
    }
    ctx.closePath();
    ctx.fillStyle = col;
    if (blur) {
      ctx.shadowColor = col;
      ctx.shadowBlur = r * blur * 4;
    }
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  const COACH = { col: SUN, halo: 0.28, face: true, band: PINK, star: true };
  const YOU = { col: "#6f7cff", halo: 0.22, face: true, hL: PINK, hR: BLUE };
  let lastPlayerAnchor = { x: 0, y: 0 };
  const playerAnchor = () => lastPlayerAnchor;
  function txt(s, x, y, size, col, align = "center", weight = 800, glow = 0, spacing = 0) {
    if (innerWidth >= 900) size = Math.max(size, 14 * DPR);
    ctx.font = "".concat(weight, " ").concat(Math.round(size), "px ").concat(FONT);
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    if ("letterSpacing" in ctx) ctx.letterSpacing = spacing ? Math.round(spacing) + "px" : "0px";
    ctx.shadowColor = "rgba(0,0,0,0.55)";
    ctx.shadowBlur = Math.max(U * 8e-3, glow * 0.5);
    ctx.shadowOffsetY = U * 3e-3;
    ctx.fillStyle = col;
    ctx.fillText(s, x, y);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
  }
  function fitTxt(s, x, y, size, maxW, col, align, weight, glow, spacing) {
    ctx.font = "".concat(weight || 800, " ").concat(Math.round(size), "px ").concat(FONT);
    const w = ctx.measureText(s).width + (spacing || 0) * s.length;
    txt(s, x, y, w > maxW ? size * maxW / w : size, col, align, weight, glow, spacing);
  }
  function rr(x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  }
  function glass(x, y, w, h, r) {
    rr(x, y, w, h, r);
    ctx.fillStyle = "rgba(10,12,24,0.55)";
    ctx.fill();
    ctx.lineWidth = Math.max(1, DPR);
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.stroke();
  }
  function topLayout() {
    const vm = Math.min(innerWidth, innerHeight) / 100, row = BodyMovin.uiRow();
    return { top: Math.max(1.6 * vm, 8) * DPR, gap: Math.max(8, vm * 1.5) * DPR, rowBottom: row.bottom * DPR, below: (x) => BodyMovin.uiBelow(x / DPR) * DPR };
  }
  let buttons = [], pending = null;
  function button(id, x, y, w, h, label, now, action, opt = {}) {
    const hov = now >= lockUntil && BodyMovin.handOver({ x, y, w, h }, W, H), arm = G._arm || (G._arm = {});
    if (arm[id + "_f"] !== frameN - 1) arm[id] = !hov;
    else if (!hov) arm[id] = true;
    arm[id + "_f"] = frameN;
    const over = hov && arm[id];
    const k = BodyMovin.dwell(id, over, now, opt.ms || 700);
    if (k === 1) pending = action;
    buttons.push({ x, y, w, h, action });
    const col = opt.col || SUN, fill = k === 1 ? 1 : k;
    ctx.save();
    rr(x, y, w, h, h / 2);
    ctx.fillStyle = opt.primary ? rgba(col, 0.16) : "rgba(255,255,255,0.06)";
    ctx.fill();
    if (fill > 0) {
      ctx.save();
      rr(x, y, w, h, h / 2);
      ctx.clip();
      const gr = ctx.createLinearGradient(x, 0, x + w, 0);
      gr.addColorStop(0, rgba(col, 0.8));
      gr.addColorStop(1, rgba(col, 0.5));
      ctx.fillStyle = gr;
      ctx.fillRect(x, y, w * fill, h);
      ctx.restore();
    }
    rr(x, y, w, h, h / 2);
    ctx.lineWidth = Math.max(2, U * 4e-3);
    ctx.strokeStyle = rgba(col, over ? 1 : opt.primary ? 0.85 : 0.45);
    if (over || opt.primary) {
      ctx.shadowColor = col;
      ctx.shadowBlur = U * (over ? 0.04 : 0.02);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    txt(label, x + w / 2, y + h / 2 + h * 0.02, h * (opt.small ? 0.36 : 0.4), fill > 0.5 ? "#1c0d02" : "#fff6e6", "center", 800, 0, h * 0.06);
    ctx.restore();
  }
  cv.addEventListener("pointerdown", (e) => {
    const x = e.clientX * DPR, y = e.clientY * DPR;
    for (const b of buttons) if (x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h) {
      audioInit();
      b.action(performance.now());
      return;
    }
  });
  addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const now = performance.now();
      if (G.state === "title" || G.state === "end" && now > lockUntil - 1e3) startGame(now);
    } else if (e.key === "Escape" && G.state !== "title") goHome();
  });
  function drawShade(amount = 1) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "rgba(8,10,20,".concat(0.55 * amount, ")"));
    g.addColorStop(0.3, "rgba(8,10,20,".concat(0.1 * amount, ")"));
    g.addColorStop(0.7, "rgba(8,10,20,".concat(0.1 * amount, ")"));
    g.addColorStop(1, "rgba(8,10,20,".concat(0.6 * amount, ")"));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
  function drawCursors(a = 1) {
    for (const [h, col] of [[BodyMovin.hands.left, PINK], [BodyMovin.hands.right, BLUE]]) {
      if (!h.seen || !BodyMovin.mouse) continue;
      ctx.globalAlpha = a;
      ctx.lineWidth = U * 6e-3;
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.beginPath();
      ctx.arc(h.x * W, h.y * H, U * 0.028, 0, 6.283);
      ctx.stroke();
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(h.x * W, h.y * H, U * 0.016, 0, 6.283);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  function poseBoth(cp, coachMove, coachSq, P, dt) {
    const t = performance.now() / 1e3, calm = G.state !== "play" || G.phase === "count" || G.phase === "nice" || G.coachStep === "ready" || G.coachStep === "wait" ? 1 : 0.3;
    coachJ = poseAthlete(COACH3, cp, COACH_X, FIG_Z, { t, seed: 0, idle: calm, squat: coachSq, armsFwd: coachMove === "squats" ? coachSq : 0, liftL: coachMove === "knees" ? Math.max(0, cp.knL[1] < cp.hip[1] + 0.9 ? 1 - (cp.knL[1] - cp.hip[1]) / 1 : 0) : 0, liftR: coachMove === "knees" ? Math.max(0, 1 - (cp.knR[1] - cp.hip[1]) / 1) : 0 });
    const B = BodyMovin.body;
    const runningNow = G.move === "knees" || B.running > 0.05, lf = (k) => runningNow ? clamp(1 - (k[1] - P.hip[1]) / 1, 0, 1) : 0;
    const arms = BodyMovin.mouse && !BodyMovin.live ? null : picArms(dt);
    youJ = poseAthlete(YOU3, P, YOU_X, FIG_Z, { t, seed: 1.7, idle: arms ? 0.25 : 1, arms, squat: B.crouch, armsFwd: !arms && G.move === "squats" ? B.crouch : 0, liftL: lf(P.knL), liftR: lf(P.knR) });
    const chest = toScreen(_b.lerpVectors(youJ.neck, youJ.hip, 0.3));
    lastPlayerAnchor = { x: chest.x, y: chest.y };
  }
  function drawEffects(dt) {
    ctx.save();
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.life -= dt;
      if (p.life <= 0) {
        parts.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.93;
      p.vy = p.vy * 0.93 + U * 0.5 * dt;
      const a = p.life / p.max;
      if (p.star) {
        ctx.globalAlpha = a;
        drawStar(p.x, p.y, p.r * 2.2, p.col, 0);
        ctx.globalAlpha = 1;
      } else {
        ctx.fillStyle = rgba(p.col, a);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (0.5 + a), 0, 6.283);
        ctx.fill();
      }
    }
    for (let i = rings.length - 1; i >= 0; i--) {
      const q = rings[i];
      q.life -= dt;
      if (q.life <= 0) {
        rings.splice(i, 1);
        continue;
      }
      const e = 1 - q.life / q.max;
      ctx.strokeStyle = rgba(q.col, 1 - e);
      ctx.lineWidth = U * 0.015 * (1 - e);
      ctx.beginPath();
      ctx.arc(q.x, q.y, q.r * (1 + e * 1.4), 0, 6.283);
      ctx.stroke();
    }
    ctx.restore();
    for (let i = floats.length - 1; i >= 0; i--) {
      const f = floats[i];
      f.life -= dt;
      if (f.life <= 0) {
        floats.splice(i, 1);
        continue;
      }
      const e = 1 - f.life / f.max;
      ctx.globalAlpha = clamp(f.life / f.max * 2, 0, 1);
      txt(f.s, f.x, f.y - e * U * 0.1, U * 0.055, f.col, "center", 900, U * 0.02);
      ctx.globalAlpha = 1;
    }
  }
  function drawConfetti(dt, now) {
    for (const c of confetti) {
      c.y += c.vy * dt;
      c.x += c.vx * dt + Math.sin(now / 300 + c.rot) * U * 1e-3;
      c.rot += c.vr * dt;
      if (c.y > H + 20) continue;
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rot);
      ctx.globalAlpha = 0.9;
      if (c.star) drawStar(0, 0, c.w * 1.4, c.col, 0);
      else {
        ctx.scale(1, Math.cos(c.rot * 1.7));
        ctx.fillStyle = c.col;
        ctx.fillRect(-c.w, -c.w * 0.5, c.w * 2, c.w);
      }
      ctx.restore();
    }
  }
  function drawSyncBeam(x0, y0, x1, y1, now) {
    if (sync < 0.05) return;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const [w, al, amp, sp] of [[U * 0.03, 0.12, 0.05, 1], [U * 8e-3, 0.6, 0.035, 1.6], [U * 4e-3, 0.8, 0.02, -2.2]]) {
      ctx.beginPath();
      for (let i = 0; i <= 40; i++) {
        const t = i / 40, x = lerp(x0, x1, t), y = lerp(y0, y1, t) + Math.sin(t * 12 + now / 1e3 * 6 * sp) * U * amp * Math.sin(t * Math.PI);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      const gr = ctx.createLinearGradient(x0, 0, x1, 0);
      gr.addColorStop(0, rgba(SUN, al * sync));
      gr.addColorStop(0.5, rgba("#ffffff", al * sync));
      gr.addColorStop(1, rgba(PURPLE, al * sync));
      ctx.strokeStyle = gr;
      ctx.lineWidth = w;
      ctx.lineCap = "round";
      ctx.stroke();
    }
    ctx.restore();
  }
  const skyBox = () => {
    const w = Math.min(W * 0.36, U * 0.66), h = w / 2.4;
    return { x: W / 2 - w / 2, y: Math.max(H * 0.2, (G.hudBottom || 0) + U * 0.03), w, h };
  };
  function drawConstellation(k, lit, bx, by, bw, bh, now, a = 1, live = false) {
    const S = SKY[k], n = S.pts.length, on = Math.floor(lit * n + 1e-6), P = S.pts.map(([x, y]) => [bx + x * bw, by + y * bh]);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    for (const [i, j] of S.edges) {
      const both = i < on && j < on;
      ctx.strokeStyle = both ? "rgba(255,236,190,".concat(0.75 * a, ")") : "rgba(180,170,255,".concat(0.13 * a, ")");
      ctx.lineWidth = both ? Math.max(1.5, bw * 6e-3) : Math.max(1, bw * 3e-3);
      if (!both) ctx.setLineDash([bw * 0.01, bw * 0.015]);
      else ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(P[i][0], P[i][1]);
      ctx.lineTo(P[j][0], P[j][1]);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    P.forEach(([x, y], i) => {
      if (i < on) {
        const tw = 1 + 0.25 * Math.sin(now / 180 + i * 1.7) + (live && i === on - 1 ? counterPop * 1.5 : 0), r = bw * 0.022 * tw;
        const gr = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
        gr.addColorStop(0, "rgba(255,255,255,".concat(a, ")"));
        gr.addColorStop(0.25, rgba(GOLD, 0.8 * a));
        gr.addColorStop(1, rgba(GOLD, 0));
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(x, y, r * 3, 0, 6.283);
        ctx.fill();
        ctx.globalAlpha = a;
        drawStar(x, y, r * 1.1, "#ffffff", 0);
        ctx.globalAlpha = 1;
      } else {
        ctx.fillStyle = "rgba(200,190,255,".concat(0.3 * a, ")");
        ctx.beginPath();
        ctx.arc(x, y, bw * 7e-3, 0, 6.283);
        ctx.fill();
      }
    });
    ctx.restore();
  }
  function drawSky(now, dt) {
    const b = skyBox(), k = G.setIndex;
    if (G.phase === "work") drawConstellation(k, Math.min(1, G.reps / G.goal), b.x, b.y, b.w, b.h, now, 1, true);
    else if (G.sky.length) {
      const last = G.sky[G.sky.length - 1], el = G.time - phaseStart;
      alive = Math.max(0, alive - dt * 0.3);
      const lift = 0, sc = 1 + (last.lit >= 1 ? 0.06 * Math.sin(now / 160) : 0);
      ctx.save();
      ctx.translate(W / 2, b.y + b.h / 2 - lift * b.h * 0.25);
      ctx.scale(sc, sc);
      drawConstellation(last.i, last.lit, -b.w / 2, -b.h / 2, b.w, b.h, now, 1 - lift * 0.4);
      ctx.restore();
    } else drawConstellation(k, 0, b.x, b.y, b.w, b.h, now, 0.7);
  }
  function figureLayout() {
    const u = Math.min(H * 0.085, W * 0.055);
    return { u, cy: H * 0.86 - 2.1 * u, cx: W * 0.2, px: W * 0.8 };
  }
  function wrapTxt(s, x, y, size, maxW, col, weight = 700, lines = 2, lh = 1.22) {
    ctx.font = "".concat(weight, " ").concat(Math.round(size), "px ").concat(FONT);
    const words = s.split(" "), out = [];
    let cur = "";
    for (const w of words) {
      const t = cur ? cur + " " + w : w;
      if (ctx.measureText(t).width > maxW && cur) {
        out.push(cur);
        cur = w;
      } else cur = t;
    }
    if (cur) out.push(cur);
    if (out.length > lines) return wrapTxt(s, x, y, size * 0.9, maxW, col, weight, lines, lh);
    const y0 = y - (out.length - 1) * size * lh / 2;
    out.forEach((l, i) => fitTxt(l, x, y0 + i * size * lh, size, maxW, col, "center", weight));
    return out.length;
  }
  function cardRect() {
    const port = W < H * 1.05, w = port ? W * 0.9 : Math.min(W * 0.33, U * 0.9);
    const lab = U * (port ? 0.03 : 0.032), name = U * (port ? 0.085 : 0.1), how = U * (port ? 0.042 : 0.046), pad = U * 0.035;
    const h = pad * 2 + lab * 1.5 + name * 1.25 + how * 1.22 * 2 + U * 0.02;
    return { x: W / 2 - w / 2, y: (port ? H * 0.27 : H * 0.47) - h / 2, w, h, lab, name, how, pad };
  }
  function drawCard(c, el) {
    const r = cardRect(), a = clamp(el / 0.35, 0, 1), pop = 0.94 + 0.06 * a;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(W / 2, r.y + r.h / 2);
    ctx.scale(pop, pop);
    ctx.translate(-W / 2, -(r.y + r.h / 2));
    rr(r.x, r.y, r.w, r.h, U * 0.035);
    ctx.fillStyle = "rgba(10,12,24,0.78)";
    ctx.fill();
    ctx.lineWidth = Math.max(2, U * 4e-3);
    ctx.strokeStyle = rgba(c.col, 0.85);
    ctx.stroke();
    let y = r.y + r.pad + r.lab * 0.6;
    const last = G.setIndex === CIRCUIT.length - 1;
    txt(G.setIndex === 0 ? "FIRST MOVE" : last ? "LAST MOVE" : "NEXT MOVE · ".concat(G.setIndex + 1, " OF ").concat(CIRCUIT.length), W / 2, y, r.lab, rgba(c.col, 1), "center", 800, 0, r.lab * 0.12);
    y += r.lab * 0.9 + r.name * 0.7;
    fitTxt(c.name, W / 2, y, r.name, r.w - r.pad * 2, "#ffffff", "center", 900);
    y += r.name * 0.62 + U * 0.02 + r.how * 1.22;
    wrapTxt(c.how, W / 2, y, r.how, r.w - r.pad * 2, "rgba(255,255,255,0.92)", 700);
    ctx.restore();
    G.ui = { card: { x: r.x / DPR, y: r.y / DPR, w: r.w / DPR, h: r.h / DPR } };
  }
  function drawPlay(now, dt) {
    const g = G.time, c = CIRCUIT[G.setIndex], el = g - phaseStart;
    drawShade(0.5);
    let cp, cMove = c.move;
    if (G.phase === "card") {
      const t0 = (G.setIndex === 0 ? 1 : 0) + LEAD_IN;
      coachPh = clamp((el - t0) / demoRepT(c), 0, DEMO_REPS);
      G.coachStep = coachPh <= 0 || coachPh >= DEMO_REPS ? "ready" : "demo ".concat(Math.floor(coachPh) + 1, "/").concat(DEMO_REPS);
      cp = coachPose(c.move, coachPh);
    } else if (G.phase === "count") {
      coachPh = 0;
      G.coachStep = "ready";
      cp = coachPose(c.move, 0);
    } else if (G.phase === "work") {
      if (G.coachStep === "wait") {
        coachWait += dt;
        if (Math.floor(coachPh) - G.reps < 2 || coachWait > Math.min(1.5, 1 / c.tempo)) {
          coachWait = 0;
          G.coachStep = "lead";
        }
      } else {
        const next = coachPh + dt * c.tempo * G.adapt, n = Math.floor(next);
        if (n > Math.floor(coachPh) && c.move !== "knees" && n - G.reps >= 2) {
          coachPh = n;
          coachWait = 0;
          G.coachStep = "wait";
        } else coachPh = next;
      }
      cp = coachPose(c.move, coachPh);
    } else {
      cMove = "wave";
      G.coachStep = "wave";
      cp = coachPose("wave", now / 1e3 * 1.2);
    }
    const P = playerPose(dt, now);
    poseBoth(cp, cMove, clamp(cp.hip[1] / 0.75, 0, 1), P, dt);
    const cLab = toScreen(new Vector3(COACH_X, 0, FIG_Z + 0.3)), yLab = toScreen(new Vector3(YOU_X, 0, FIG_Z + 0.3));
    if (cLab.x > U * 0.12 && cLab.x < W - U * 0.12) txt("COACH SUNNY", cLab.x, Math.min(H * 0.96, cLab.y + U * 0.04), U * 0.032, SUN, "center", 800, 0, U * 4e-3);
    if (yLab.x > U * 0.12 && yLab.x < W - U * 0.12) txt("YOU", yLab.x, Math.min(H * 0.96, yLab.y + U * 0.04), U * 0.032, "#9cc2ff", "center", 800, 0, U * 4e-3);
    if (G.phase === "work") {
      let best = 9;
      for (const lag of [0, 0.08, 0.16, 0.26]) {
        const C = coachPose(c.move, coachPh - lag);
        for (const sw2 of [false, true]) {
          const a = sw2 ? C.hR : C.hL, b = sw2 ? C.hL : C.hR;
          const e = (Math.abs(a[1] - P.hL[1]) + Math.abs(b[1] - P.hR[1])) / 2 + Math.abs(C.hip[1] - P.hip[1]) * 1.5;
          best = Math.min(best, e);
        }
      }
      let target = clamp(1 - (best - 0.25) / 0.9, 0, 1);
      if (c.move === "knees") {
        const want = c.tempo * G.adapt * 120, B = BodyMovin.body;
        target = B.running > 0.02 ? clamp(1 - Math.abs(B.cadence - want) / 70, 0, 1) : 0;
      }
      sync += (target - sync) * Math.min(1, dt * 3);
    } else sync *= Math.exp(-dt * 2);
    const C0 = coachPose(c.move, coachPh), toScr = (v, side) => ({ x: v[0] / 3.6 + (side < 0 ? 0.38 : 0.62), y: v[1] / 4.4 + 0.42 });
    G.sync = sync;
    G.coachScreen = { L: toScr([C0.hL[0] - C0.shL[0], C0.hL[1] - C0.shL[1]], -1), R: toScr([C0.hR[0] - C0.shR[0], C0.hR[1] - C0.shR[1]], 1), squat: C0.hip[1] / 0.75 };
    G.coachPh = +coachPh.toFixed(2);
    if (G.phase === "work" || G.phase === "nice") drawSky(now, dt);
    const T = topLayout(), th_ = clamp(U * 0.09, 40 * DPR, 92 * DPR), title = G.phase === "work" ? c.name : "";
    ctx.font = "900 ".concat(th_ * 0.58, "px ").concat(FONT);
    const scW = Math.max(ctx.measureText("000").width, ctx.measureText(String(G.score)).width);
    ctx.font = "800 ".concat(th_ * 0.36, "px ").concat(FONT);
    const nmW = title ? Math.min(ctx.measureText(title).width, W * 0.42) : 0;
    const tw_ = nmW + scW + th_ * (title ? 1.4 : 1), tx_ = W / 2 - tw_ / 2, ty_ = Math.max(T.top, T.below(tx_));
    glass(tx_, ty_, tw_, th_, th_ / 2);
    if (title) fitTxt(title, tx_ + th_ * 0.5 + nmW / 2, ty_ + th_ / 2, th_ * 0.36, nmW, rgba(c.col, 1), "center", 800);
    txt(String(G.score), tx_ + tw_ - th_ * 0.5 - scW / 2, ty_ + th_ / 2, th_ * 0.58, "#ffffff", "center", 900);
    const sh = th_ * 0.72, setLab = "SET ".concat(G.setIndex + 1, " OF ").concat(CIRCUIT.length);
    ctx.font = "800 ".concat(sh * 0.42, "px ").concat(FONT);
    const sw = ctx.measureText(setLab).width + sh * 0.9;
    let sx = Math.min(W - T.gap, BodyMovin.freeRight ? BodyMovin.freeRight() * DPR : W) - sw, sy = T.top;
    if (sx < tx_ + tw_ + T.gap) sy = ty_ + th_ + T.gap;
    glass(sx, sy, sw, sh, sh / 2);
    txt(setLab, sx + sw / 2, sy + sh / 2, sh * 0.42, "#e8ecff", "center", 800);
    G.hudBottom = Math.max(ty_ + th_, sy + sh);
    {
      const d = DPR, sb = skyBox(), cH = toScreen(new Vector3(COACH_X, 1.9, FIG_Z)), cL = toScreen(new Vector3(COACH_X - 1.05, 1.2, FIG_Z)), cR = toScreen(new Vector3(COACH_X + 1.05, 1.2, FIG_Z));
      hudR = [
        { x: tx_ / d, y: ty_ / d, w: tw_ / d, h: th_ / d },
        { x: sx / d, y: sy / d, w: sw / d, h: sh / d },
        { x: sb.x / d, y: sb.y / d, w: sb.w / d, h: sb.h / d },
        { x: (W / 2 - U * 0.15) / d, y: (H * 0.6 - U * 0.15) / d, w: U * 0.3 / d, h: U * 0.3 / d },
        { x: (W / 2 - W * 0.3) / d, y: (H * 0.88 - U * 0.04) / d, w: W * 0.6 / d, h: U * 0.08 / d },
        { x: Math.min(cL.x, cR.x) / d, y: cH.y / d, w: Math.abs(cR.x - cL.x) / d, h: (cLab.y + U * 0.06 - cH.y) / d }
      ];
    }
    G.ui = null;
    if (G.phase === "card") drawCard(c, el);
    else {
      const rx = W / 2, ry = H * 0.6, R = U * 0.135;
      const disc = ctx.createRadialGradient(rx, ry, 0, rx, ry, R);
      disc.addColorStop(0, "rgba(8,10,22,0.85)");
      disc.addColorStop(1, "rgba(8,10,22,0.66)");
      ctx.fillStyle = disc;
      ctx.beginPath();
      ctx.arc(rx, ry, R, 0, 6.283);
      ctx.fill();
      ctx.lineWidth = U * 0.02;
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.beginPath();
      ctx.arc(rx, ry, R, 0, 6.283);
      ctx.stroke();
      let frac, ringCol, left;
      if (G.phase === "work") {
        left = c.secs - el;
        frac = clamp(left / c.secs, 0, 1);
        ringCol = c.col;
      } else if (G.phase === "count") {
        left = COUNT - el;
        frac = clamp(left / COUNT, 0, 1);
        ringCol = "#ffffff";
      } else {
        left = 0;
        frac = 1;
        ringCol = G.niceReps >= G.goal ? GOLD : GREEN;
      }
      ctx.save();
      ctx.strokeStyle = ringCol;
      ctx.lineCap = "round";
      ctx.lineWidth = U * (0.02 + ringFlash * 8e-3);
      ctx.beginPath();
      ctx.arc(rx, ry, R, -Math.PI / 2, -Math.PI / 2 + frac * 6.283);
      ctx.stroke();
      ctx.restore();
      if (G.phase === "work") {
        const gp = clamp(G.reps / G.goal, 0, 1);
        ctx.lineWidth = U * 8e-3;
        ctx.strokeStyle = rgba(GOLD, 0.9);
        ctx.beginPath();
        ctx.arc(rx, ry, R * 0.84, -Math.PI / 2, -Math.PI / 2 + gp * 6.283);
        ctx.stroke();
        const pop = 1 + counterPop * 0.25;
        if (el < 0.8 && !G.reps) txt("GO!", rx, ry, U * 0.1, GOLD, "center", 900, U * 0.04);
        else txt(String(G.reps), rx, ry - U * 0.01, U * 0.13 * pop, "#ffffff", "center", 900, U * 0.04 * (0.5 + counterPop));
        txt(G.reps >= G.goal ? "GOAL!" : "GOAL ".concat(G.goal), rx, ry + R * 0.56, U * 0.03, G.reps >= G.goal ? GOLD : "rgba(255,255,255,0.7)", "center", 800, 0, U * 3e-3);
        txt(Math.max(0, Math.ceil(left)) + "s", rx, ry - R * 0.6, U * 0.03, rgba(c.col, 0.95), "center", 800);
      } else if (G.phase === "count") {
        const n = Math.max(1, Math.ceil(left)), e = 1 - (left - Math.floor(left)), sc = 1.15 - 0.15 * Math.min(1, e * 4);
        txt(String(n), rx, ry - U * 0.01, U * 0.15 * sc, "#ffffff", "center", 900, U * 0.04);
        fitTxt(c.name, rx, ry + R * 0.58, U * 0.032, R * 1.6, rgba(c.col, 1), "center", 800);
      } else {
        fitTxt(G.niceReps ? "NICE!" : "GOOD TRY", rx, ry - U * 0.02, U * 0.075, R * 1.7, ringCol, "center", 900, U * 0.03);
        fitTxt(G.niceReps ? "".concat(G.niceReps, " ").concat(G.niceReps === 1 ? c.label.replace(/s$/, "").replace(/che$/, "ch") : c.label) : "Next one!", rx, ry + R * 0.45, U * 0.032, R * 1.6, "rgba(255,255,255,0.9)", "center", 800);
      }
    }
    counterPop *= Math.exp(-dt * 8);
    ringFlash *= Math.exp(-dt * 4);
    if (G.phase === "work") {
      const msgY = H * 0.88, msgW = innerWidth < 600 ? W * 0.92 : Math.min(W * 0.56, W - 2 * U * 0.3), on = g < fix.until;
      fitTxt(on ? fix.s : c.how, W / 2, msgY, U * (on ? 0.05 : 0.04), msgW, on ? "#ffffff" : "rgba(255,255,255,0.85)", "center", on ? 900 : 700, on ? U * 0.02 : 0);
    }
    drawEffects(dt);
  }
  function tickPhase(g, dt) {
    const el = g - phaseStart, c = CIRCUIT[G.setIndex];
    if (G.phase === "card") {
      if (el >= cardSecs(G.setIndex)) beginCount(g);
    } else if (G.phase === "count") {
      const left = COUNT - el, sec = Math.ceil(left);
      if (sec <= 3 && sec >= 1 && sec !== lastBeepSec) {
        lastBeepSec = sec;
        sfxBeep(660, 0.12);
      }
      if (left <= 0) {
        lastBeepSec = -1;
        beginWork(g);
      }
    } else if (G.phase === "nice") {
      if (el >= NICE) nextAfterNice(g);
    } else if (G.phase === "work") {
      detectReps(g, dt);
      const left = c.secs - el, sec = Math.ceil(left);
      if (sec <= 3 && sec >= 1 && sec !== lastBeepSec) {
        lastBeepSec = sec;
        sfxBeep(880, 0.07, 0.12);
      }
      if (left <= 0) {
        lastBeepSec = -1;
        sfxBeep(523.25, 0.35, 0.25);
        finishSet(g);
      }
    }
  }
  function drawTitle(now, dt) {
    const tcp = coachPose("jacks", now / 1e3 * 0.8);
    poseBoth(tcp, "jacks", 0, playerPose(dt, now), dt);
    drawShade(1.15);
    const cl = toScreen(new Vector3(COACH_X, 0, FIG_Z + 0.3));
    if (cl.x > U * 0.12 && cl.x < W - U * 0.12) txt("COACH SUNNY", cl.x, Math.min(H * 0.96, cl.y + U * 0.04), U * 0.028, SUN, "center", 800, 0, U * 4e-3);
    if (0) {
      ctx.save();
      const ts = Math.min(U * 0.13, W * 0.09);
      ctx.font = "900 ".concat(ts, "px ").concat(FONT);
      const tw = ctx.measureText("STAR JUMPS").width;
      const tg = ctx.createLinearGradient(0, H * 0.1, 0, H * 0.24);
      tg.addColorStop(0, "#ffffff");
      tg.addColorStop(1, "#ffe2c9");
      txt("STAR JUMPS", W / 2, H * 0.17, ts, tg, "center", 900, 0, ts * 0.04);
      ctx.restore();
      drawStar(W / 2 - tw / 2 - U * 0.075, H * 0.15, U * 0.03, GOLD, 0);
      drawStar(W / 2 + tw / 2 + U * 0.075, H * 0.15, U * 0.03, GOLD, 0);
      txt("C O A C H", W / 2, H * 0.27, U * 0.04, SUN, "center", 800, U * 0.02, U * 0.01);
      fitTxt("Mirror Coach Sunny through 5 quick moves. Every rep lights a star!", W / 2, H * 0.37, U * 0.036, W * 0.5, "rgba(255,245,235,0.9)", "center", 600);
      const moves = ["jacks", "squats", "knees", "reach"], sp = Math.min(W * 0.11, U * 0.2), iu = U * 0.025;
      rr(W / 2 - sp * 2.1, H * 0.5 - iu * 3.2, sp * 4.2, iu * 7.6, U * 0.03);
      ctx.fillStyle = "rgba(8,10,22,0.5)";
      ctx.fill();
      moves.forEach((m, i) => {
        const x = W / 2 + (i - 1.5) * sp, y = H * 0.5;
        drawFigure(x, y, iu, coachPose(m, now / 1e3 * CIRCUIT.find((c) => c.move === m).tempo * 0.7), { col: "#ffffff", halo: 0, face: false, flat: true }, now);
        txt(MOVE_LABEL[m], x, y + iu * 3.4, U * 0.024, "#ffffff", "center", 800, 0, U * 2e-3);
      });
    }
    const cardB = innerWidth < 600 ? 0.62 : 0.6, bh = clamp(U * 0.14, 50 * DPR, 140 * DPR), bw = Math.min(W * 0.8, Math.max(bh * 4, U * 0.42));
    const by = H * (cardB + 0.02) + Math.max(0, (H * (0.86 - cardB - 0.02) - bh) / 2);
    button("start", W / 2 - bw / 2, by, bw, bh, "START", now, startGame, { primary: true });
    drawEffects(dt);
    if (TV && now - titleAt > 2e3 && G.state === "title") pending = startGame;
  }
  function drawEnd(now, dt) {
    const R = G.result, e = clamp((now - endAt) / 700, 0, 1);
    poseBoth(coachPose("jacks", now / 1e3 * 1.2), "jacks", 0, playerPose(dt, now), dt);
    ctx.fillStyle = "rgba(8,10,22,0.6)";
    ctx.fillRect(0, 0, W, H);
    drawConfetti(dt, now);
    const E = BodyMovin.layout.end(W, H, { cy: H * 0.68 });
    const T = topLayout(), top = Math.max(T.rowBottom + T.gap, H * 0.14), room = E.again.y - Math.max(12 * DPR, U * 0.03) - top;
    const pw = Math.min(W * 0.9, U * 1.05), ph = Math.min(room, U * 0.6), px = W / 2 - pw / 2, py = top + (room - ph) / 2;
    glass(px, py, pw, ph, U * 0.04);
    BodyMovin.uiCover = { x: px / DPR, y: py / DPR, w: pw / DPR, h: ph / DPR };
    const shown = Math.round(R.score * (1 - Math.pow(1 - e, 3)));
    fitTxt("YOUR SCORE", W / 2, py + ph * 0.19, Math.min(Math.max(16 * DPR, U * 0.04), ph * 0.12), pw * 0.9, "rgba(255,235,215,0.8)", "center", 800);
    ctx.save();
    const ss = Math.min(U * 0.16, ph * 0.34);
    const sg = ctx.createLinearGradient(0, py + ph * 0.52 - ss / 2, 0, py + ph * 0.52 + ss / 2);
    sg.addColorStop(0, "#fff6d8");
    sg.addColorStop(1, GOLD);
    fitTxt(String(shown), W / 2, py + ph * 0.52, ss, pw * 0.9, sg, "center", 900);
    ctx.restore();
    fitTxt(R.newBest ? "New best!" : "Best ".concat(G.best), W / 2, py + ph * 0.83, Math.min(Math.max(16 * DPR, U * 0.045), ph * 0.12), pw * 0.9, R.newBest ? PINK : "rgba(255,255,255,0.8)", "center", 800);
    const a = E.again, h = E.home;
    button("again", a.x, a.y, a.w, a.h, "PLAY AGAIN", now, startGame, { primary: true, ms: 1e3 });
    button("home2", h.x, h.y, h.w, h.h, "HOME", now, goHome, { col: BLUE, ms: BodyMovin.LEAVE_MS || 1400 });
    drawEffects(dt);
  }
  let lastNow = 0;
  BodyMovin.start();
  let frameN = 0;
  function frame(now) {
    BodyMovin.update(now);
    if (++frameN === 40) {
      RZ.quality.t0 = performance.now();
      RZ.quality.frames = 0;
    }
    const dt = Math.min(0.05, (now - (lastNow || now)) / 1e3);
    lastNow = now;
    if (ac) {
      const s = ac.currentTime - performance.now() / 1e3;
      acOff = acOff === null || Math.abs(s - acOff) > 0.25 ? s : acOff + 0.02 * (s - acOff);
    }
    buttons = [];
    pending = null;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (G.state === "title") drawTitle(now, dt);
    else if (G.state === "end") drawEnd(now, dt);
    else {
      const g = G.time = (now - G.t0) / 1e3;
      scheduleMusic(g);
      tickPhase(g, dt);
      if (G.state === "play") {
        G.setLeft = G.phase === "work" ? CIRCUIT[G.setIndex].secs - (g - phaseStart) : 0;
        drawPlay(now, dt);
        liveTips();
      }
    }
    drawCursors(G.state === "play" ? 0.6 : 1);
    render3D(dt, now);
    if (pending) {
      const p = pending;
      pending = null;
      p(now);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})().catch((e) => setTimeout(() => {
  throw e;
}));
