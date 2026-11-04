import {
  create as create2
} from "./chunk-6IMGWI3W.js";
import {
  STANCES
} from "./chunk-QDPXG5OX.js";
import {
  create
} from "./chunk-YHKKMJ2Y.js";
import "./chunk-WYC6O5BF.js";
import "./chunk-2BP775VP.js";
import "./chunk-A2W6QNSO.js";
import {
  environment,
  flash,
  model,
  pbr,
  realism_exports,
  render,
  setup,
  shake,
  state
} from "./chunk-5EPBUA75.js";
import "./chunk-CPYHHAA5.js";
import "./chunk-GEQJXPAR.js";
import "./chunk-UBB4M7UR.js";
import {
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CapsuleGeometry,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  DynamicDrawUsage,
  Euler,
  ExtrudeGeometry,
  Group,
  InstancedMesh,
  LatheGeometry,
  Line,
  LineBasicMaterial,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NormalBlending,
  PlaneGeometry,
  PointLight,
  Points,
  Quaternion,
  Raycaster,
  RepeatWrapping,
  SRGBColorSpace,
  ShaderMaterial,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  SpotLight,
  Sprite,
  SpriteMaterial,
  TorusGeometry,
  Vector2,
  Vector3,
  three_module_exports
} from "./chunk-4IYDSAYK.js";
import "./chunk-NWIHTO7D.js";

// bmpage:bmpage:gallery.html#0
(async () => {
  const BP = window.BodyMovin;
  const Q = new URLSearchParams(location.search);
  const GAME_ID = "gallery", ROUND = +Q.get("round") || 90;
  const lerp = (a, b, t) => a + (b - a) * t, clamp = (v, a, b) => Math.max(a, Math.min(b, v)), rand = (a, b) => a + Math.random() * (b - a);
  const pick = (a) => a[Math.random() * a.length | 0];
  const G = window.__game = {
    state: "loading",
    score: 0,
    hits: 0,
    shots: 0,
    escaped: 0,
    combo: 0,
    bestCombo: 0,
    mult: 1,
    wave: 0,
    timeLeft: ROUND,
    hardcore: localStorage.gallery_hc === "1",
    ammo: 10,
    maxAmmo: 10,
    special: 0,
    struggle: 0,
    secrets: 0,
    storms: 0,
    reloads: 0,
    fps: 60,
    quality: 2,
    errors: [],
    best: BP.best(GAME_ID),
    prize: null,
    targets: [],
    peek: { x: 0, y: 0 },
    timeScale: 1
  };
  G.endNow = () => {
    if (G.state === "play") endRound(performance.now());
  };
  addEventListener("error", (e) => G.errors.push(String(e.message)));
  addEventListener("unhandledrejection", (e) => G.errors.push(String(e.reason && e.reason.message || e.reason)));
  const glCanvas = document.getElementById("gl");
  const RS = setup(glCanvas, { fov: 50, near: 0.05, far: 400, tier: Q.has("tier") ? +Q.get("tier") : void 0 });
  const { renderer, scene, camera } = RS;
  renderer.toneMappingExposure = 1.05;
  await environment(scene, renderer, "circus_arena", { background: true, blur: 0, intensity: 0.55, rotation: Math.PI / 2 });
  scene.backgroundIntensity = 0.42;
  scene.add(camera);
  const hud = document.getElementById("hud"), ctx = hud.getContext("2d");
  let W = 0, H = 0, S = 0;
  function resizeHud() {
    W = innerWidth;
    H = innerHeight;
    S = Math.min(W, H);
    const d = Math.min(devicePixelRatio || 1, 2);
    hud.width = W * d;
    hud.height = H * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
  }
  addEventListener("resize", resizeHud);
  resizeHud();
  const WZ = 2.4, WCY = 1.55, EYE0 = new Vector3(0, 1.6, 5);
  const eye = EYE0.clone();
  const win = { hw: 2.155, hh: 1.212 };
  function updateProjection() {
    const a = W / H;
    win.hh = 1.212;
    win.hw = win.hh * a;
    if (a < 16 / 9) {
      win.hw = 2.155;
      win.hh = win.hw / a;
    }
    const n = camera.near, d = eye.z - WZ;
    const l = (-win.hw - eye.x) * n / d, r = (win.hw - eye.x) * n / d, t = (WCY + win.hh - eye.y) * n / d, b = (WCY - win.hh - eye.y) * n / d;
    camera.projectionMatrix.makePerspective(l, r, t, b, n, camera.far);
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
  }
  function canvasTex(w, h, draw, { repeat = false, srgb = true } = {}) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d"), w, h);
    const t = new CanvasTexture(c);
    if (srgb) t.colorSpace = SRGBColorSpace;
    t.anisotropy = 8;
    if (repeat) t.wrapS = t.wrapT = RepeatWrapping;
    return t;
  }
  const glowTex = canvasTex(64, 64, (g, w) => {
    const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    gr.addColorStop(0, "rgba(255,255,255,1)");
    gr.addColorStop(0.2, "rgba(255,255,255,0.7)");
    gr.addColorStop(0.5, "rgba(255,255,255,0.18)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, w);
  }, { srgb: false });
  const smokeTex = canvasTex(64, 64, (g, w) => {
    for (let i = 0; i < 9; i++) {
      const x = w / 2 + rand(-10, 10), y = w / 2 + rand(-10, 10), r = rand(12, 22);
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, "rgba(255,255,255,0.35)");
      gr.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gr;
      g.fillRect(0, 0, w, w);
    }
  }, { srgb: false });
  const scuffTex = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = "#6a6a6a";
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 900; i++) {
      g.fillStyle = "rgba(".concat(Math.random() < 0.5 ? "255,255,255" : "0,0,0", ",").concat(rand(0.02, 0.09), ")");
      g.fillRect(rand(0, w), rand(0, h), rand(1, 30), rand(0.5, 2));
    }
    for (let i = 0; i < 60; i++) {
      g.strokeStyle = "rgba(255,255,255,".concat(rand(0.05, 0.2), ")");
      g.lineWidth = rand(0.3, 1.2);
      g.beginPath();
      const x = rand(0, w), y = rand(0, h);
      g.moveTo(x, y);
      g.lineTo(x + rand(-40, 40), y + rand(-12, 12));
      g.stroke();
    }
  }, { repeat: true, srgb: false });
  const paint = (color, o = {}) => new MeshPhysicalMaterial({ color, roughness: 0.42, roughnessMap: scuffTex, metalness: 0.25, clearcoat: 0.6, clearcoatRoughness: 0.25, ...o });
  const planks = pbr("brown_planks_03", { repeat: [3, 1] });
  const plankRed = pbr("brown_planks_03", { repeat: [1, 2], color: 12595242 });
  const plankCream = pbr("brown_planks_03", { repeat: [4, 1], color: 15785152 });
  const counterWood = pbr("wood_floor", { repeat: [6, 0.6], physical: true, clearcoat: 0.8 });
  const shelfWood = pbr("wood_floor", { repeat: [5, 0.3] });
  const brass = new MeshPhysicalMaterial({ color: 14263361, metalness: 1, roughness: 0.28, roughnessMap: scuffTex });
  const chrome = new MeshStandardMaterial({ color: 13620186, metalness: 1, roughness: 0.18 });
  const ironMat = new MeshStandardMaterial({ color: 2369067, metalness: 0.8, roughness: 0.5, roughnessMap: scuffTex });
  class Particles {
    constructor(max, additive) {
      this.max = max;
      this.i = 0;
      this.n = 0;
      const g = new BufferGeometry();
      this.g = g;
      this.pos = new Float32Array(max * 3);
      this.col = new Float32Array(max * 3);
      this.sz = new Float32Array(max);
      this.al = new Float32Array(max);
      this.vel = new Float32Array(max * 3);
      this.life = new Float32Array(max);
      this.ml = new Float32Array(max);
      this.s0 = new Float32Array(max);
      this.s1 = new Float32Array(max);
      this.a0 = new Float32Array(max);
      this.grav = new Float32Array(max);
      this.drag = new Float32Array(max);
      const A = (a, n) => new BufferAttribute(a, n).setUsage(DynamicDrawUsage);
      g.setAttribute("position", A(this.pos, 3));
      g.setAttribute("pcol", A(this.col, 3));
      g.setAttribute("psize", A(this.sz, 1));
      g.setAttribute("palpha", A(this.al, 1));
      this.mat = new ShaderMaterial({
        uniforms: { uScale: { value: 400 }, uTex: { value: additive ? glowTex : smokeTex } },
        vertexShader: "attribute vec3 pcol; attribute float psize; attribute float palpha; varying vec3 vC; varying float vA; uniform float uScale;\n        void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = psize * uScale / max(0.05, -mv.z); vC = pcol; vA = palpha; }",
        fragmentShader: "uniform sampler2D uTex; varying vec3 vC; varying float vA; void main(){ float t = texture2D(uTex, gl_PointCoord).r; if (t * vA < 0.003) discard; gl_FragColor = vec4(vC, t * vA); }",
        transparent: true,
        depthWrite: false,
        blending: additive ? AdditiveBlending : NormalBlending
      });
      this.points = new Points(g, this.mat);
      this.points.frustumCulled = false;
      this.points.renderOrder = additive ? 5 : 4;
      scene.add(this.points);
    }
    emit(x, y, z, vx, vy, vz, life, s0, s1, r, gg, b, a = 1, grav = 0, drag = 0) {
      const i = this.i;
      this.i = (this.i + 1) % this.max;
      const j = i * 3;
      this.pos[j] = x;
      this.pos[j + 1] = y;
      this.pos[j + 2] = z;
      this.vel[j] = vx;
      this.vel[j + 1] = vy;
      this.vel[j + 2] = vz;
      this.col[j] = r;
      this.col[j + 1] = gg;
      this.col[j + 2] = b;
      this.life[i] = this.ml[i] = life;
      this.s0[i] = s0;
      this.s1[i] = s1;
      this.a0[i] = a;
      this.grav[i] = grav;
      this.drag[i] = drag;
      this.sz[i] = s0;
      this.al[i] = a;
    }
    update(dt) {
      let alive = 0;
      for (let i = 0; i < this.max; i++) {
        if (this.life[i] <= 0) continue;
        const l = this.life[i] -= dt, j = i * 3;
        if (l <= 0) {
          this.al[i] = 0;
          this.sz[i] = 0;
          continue;
        }
        alive++;
        const k = 1 - l / this.ml[i], dr = Math.exp(-this.drag[i] * dt);
        this.vel[j] *= dr;
        this.vel[j + 1] = this.vel[j + 1] * dr - this.grav[i] * dt;
        this.vel[j + 2] *= dr;
        this.pos[j] += this.vel[j] * dt;
        this.pos[j + 1] += this.vel[j + 1] * dt;
        this.pos[j + 2] += this.vel[j + 2] * dt;
        this.sz[i] = this.s0[i] + (this.s1[i] - this.s0[i]) * k;
        this.al[i] = this.a0[i] * (k < 0.08 ? k / 0.08 : Math.pow(1 - (k - 0.08) / 0.92, 1.3));
      }
      this.n = alive;
      const at = this.g.attributes;
      at.position.needsUpdate = at.pcol.needsUpdate = at.psize.needsUpdate = at.palpha.needsUpdate = true;
    }
  }
  const sparks = new Particles(5e3, true), smoke = new Particles(1200, false);
  class Debris {
    constructor(geom, mat, max) {
      this.mesh = new InstancedMesh(geom, mat, max);
      this.mesh.frustumCulled = false;
      this.mesh.castShadow = false;
      this.mesh.instanceMatrix.setUsage(DynamicDrawUsage);
      this.max = max;
      this.i = 0;
      this.d = [];
      const m = new Matrix4().makeScale(0, 0, 0);
      for (let k = 0; k < max; k++) {
        this.d.push({ life: 0, p: new Vector3(), v: new Vector3(), q: new Quaternion(), ax: new Vector3(1, 0, 0), w: 0, s: 1, drag: 1, flutter: 0 });
        this.mesh.setMatrixAt(k, m);
        this.mesh.setColorAt(k, new Color(1, 1, 1));
      }
      scene.add(this.mesh);
    }
    spawn(p, v, s, color, life = 2, drag = 1, flutter = 0) {
      const k = this.i;
      this.i = (this.i + 1) % this.max;
      const d = this.d[k];
      d.life = d.ml = life;
      d.p.copy(p);
      d.v.copy(v);
      d.s = s;
      d.drag = drag;
      d.flutter = flutter;
      d.q.setFromEuler(new Euler(rand(0, 6), rand(0, 6), rand(0, 6)));
      d.ax.set(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize();
      d.w = rand(6, 16);
      this.mesh.setColorAt(k, _c.set(color));
      this.mesh.instanceColor.needsUpdate = true;
    }
    update(dt) {
      let any = false;
      for (let k = 0; k < this.max; k++) {
        const d = this.d[k];
        if (d.life <= 0) continue;
        d.life -= dt;
        any = true;
        if (d.life <= 0) {
          this.mesh.setMatrixAt(k, _m.makeScale(0, 0, 0));
          continue;
        }
        const dr = Math.exp(-d.drag * dt);
        d.v.multiplyScalar(dr);
        d.v.y -= 9.8 * dt * (d.flutter ? 0.25 : 1);
        if (d.flutter) d.v.x += Math.sin(d.life * 9 + k) * d.flutter * dt;
        d.p.addScaledVector(d.v, dt);
        if (d.p.y < 0.02) {
          d.p.y = 0.02;
          d.v.y *= -0.3;
          d.v.x *= 0.6;
          d.v.z *= 0.6;
          d.w *= 0.6;
        }
        d.q.multiply(_q.setFromAxisAngle(d.ax, d.w * dt));
        const s = d.s * Math.min(1, d.life / 0.4);
        this.mesh.setMatrixAt(k, _m.compose(d.p, d.q, _v.set(s, s, s)));
      }
      if (any) this.mesh.instanceMatrix.needsUpdate = true;
    }
  }
  const _c = new Color(), _m = new Matrix4(), _q = new Quaternion(), _v = new Vector3(), _v2 = new Vector3(), _v3 = new Vector3();
  const confetti = new Debris(new PlaneGeometry(0.05, 0.03), new MeshStandardMaterial({ side: DoubleSide, roughness: 0.5, metalness: 0.3 }), 900);
  const chips = new Debris(new BoxGeometry(0.06, 0.012, 0.04), new MeshStandardMaterial({ roughness: 0.4, metalness: 0.6 }), 400);
  const coins = new Debris(new CylinderGeometry(0.045, 0.045, 8e-3, 16), new MeshStandardMaterial({ color: 16777215, metalness: 1, roughness: 0.2 }), 200);
  const flashes = [];
  for (let i = 0; i < 5; i++) {
    const l = new PointLight(16777215, 0, 7, 2);
    scene.add(l);
    flashes.push({ l, t: 0, d: 1, peak: 0 });
  }
  function lightFlash(p, color, peak, dur) {
    const f = flashes.reduce((a, b) => a.t < b.t ? a : b);
    f.l.position.copy(p);
    f.l.color.set(color);
    f.peak = peak;
    f.t = f.d = dur;
  }
  function updateFlashes(dt) {
    for (const f of flashes) {
      f.t = Math.max(0, f.t - dt);
      f.l.intensity = f.peak * Math.pow(f.t / f.d, 2);
    }
  }
  function burstSparks(p, n, speed, col, size = 0.05, life = 0.6, grav = 4) {
    for (let i = 0; i < n; i++) {
      const u = rand(-1, 1), th = rand(0, 6.283), s = speed * rand(0.3, 1), r = Math.sqrt(1 - u * u);
      sparks.emit(p.x, p.y, p.z, Math.cos(th) * r * s, u * s + speed * 0.2, Math.sin(th) * r * s, life * rand(0.5, 1.2), size, size * 0.2, col[0], col[1], col[2], 1, grav, 2.2);
    }
  }
  function puff(p, n, col = [0.9, 0.88, 0.85], size = 0.25, spread = 0.6) {
    for (let i = 0; i < n; i++) smoke.emit(p.x + rand(-0.05, 0.05), p.y + rand(-0.05, 0.05), p.z + rand(-0.05, 0.05), rand(-spread, spread), rand(0, spread), rand(-spread, spread), rand(0.6, 1.2), size * 0.4, size * 1.6, col[0], col[1], col[2], 0.55, -0.3, 2.5);
  }
  const CONF = [16726876, 16765503, 3919532, 5082111, 16747586, 13135319, 16777215];
  function confettiBurst(p, n, power2 = 3) {
    for (let i = 0; i < n; i++) confetti.spawn(p, _v.set(rand(-1, 1) * power2, rand(0.4, 1.4) * power2, rand(-0.6, 1.2) * power2), rand(0.8, 1.6), pick(CONF), rand(2.2, 3.6), 2.2, 6);
  }
  function firework(p, hue) {
    const c = new Color().setHSL(hue, 1, 0.6);
    for (let i = 0; i < 140; i++) {
      const u = rand(-1, 1), th = rand(0, 6.283), r = Math.sqrt(1 - u * u), s = rand(5, 7);
      sparks.emit(p.x, p.y, p.z, Math.cos(th) * r * s, u * s, Math.sin(th) * r * s, rand(1.2, 1.9), 0.55, 0.12, c.r * 3, c.g * 3, c.b * 3, 1, 3, 1.2);
    }
  }
  const occluders = [];
  const FLIP_Y = 1.72, GOLD_Y = 2.42;
  function box(w, h, d, mat, x, y, z, { cast = true, recv = true, occ = false, parent = scene } = {}) {
    const m = new Mesh(new BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    m.castShadow = cast;
    m.receiveShadow = recv;
    parent.add(m);
    if (occ) occluders.push(m);
    return m;
  }
  box(15, 0.08, 0.6, counterWood, 0, 0.91, 2.62, { occ: true });
  box(15, 0.9, 0.06, plankRed, 0, 0.45, 2.92, { occ: true });
  const rail = new Mesh(new CylinderGeometry(0.025, 0.025, 15, 16), brass);
  rail.rotation.z = Math.PI / 2;
  rail.position.set(0, 0.99, 2.86);
  scene.add(rail);
  for (let x = -7; x <= 7; x += 1.4) {
    const p = new Mesh(new CylinderGeometry(0.012, 0.012, 0.08, 8), brass);
    p.position.set(x, 0.95, 2.86);
    scene.add(p);
  }
  for (const sx of [-1, 1]) {
    box(0.32, 3.4, 0.3, plankRed, sx * 2.22, 1.7, 2.4, { occ: true });
    box(0.36, 0.06, 0.34, brass, sx * 2.22, 0.98, 2.4);
    box(5.2, 3.4, 0.12, plankRed, sx * (2.38 + 2.6), 1.7, 2.46, { occ: true });
  }
  const valTex = canvasTex(1024, 128, (g, w, h) => {
    for (let i = 0; i < 32; i++) {
      g.fillStyle = i % 2 ? "#f3e6cf" : "#b3121c";
      g.fillRect(i * w / 32, 0, w / 32 + 1, h);
    }
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, "rgba(0,0,0,0.35)");
    gr.addColorStop(0.3, "rgba(0,0,0,0)");
    gr.addColorStop(1, "rgba(0,0,0,0.25)");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
  });
  valTex.wrapS = RepeatWrapping;
  valTex.repeat.set(4, 1);
  {
    const sh = new Shape();
    const L = 15, top = 3.3, base = 2.62, n = 30, sw = L / n;
    sh.moveTo(-L / 2, top);
    sh.lineTo(L / 2, top);
    sh.lineTo(L / 2, base);
    for (let i = n - 1; i >= 0; i--) {
      const x0 = -L / 2 + i * sw;
      sh.quadraticCurveTo(x0 + sw / 2, base - 0.2, x0, base);
    }
    sh.lineTo(-L / 2, top);
    const geo = new ShapeGeometry(sh, 6);
    const uv = geo.attributes.uv, P = geo.attributes.position;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (P.getX(i) + L / 2) / L, (P.getY(i) - 2.4) / 0.9);
    const val = new Mesh(geo, new MeshStandardMaterial({ map: valTex, roughness: 0.85, side: DoubleSide }));
    val.position.z = 2.3;
    val.castShadow = true;
    scene.add(val);
    occluders.push(val);
    const trim = new Mesh(new BoxGeometry(L, 0.07, 0.06), brass);
    trim.position.set(0, 2.66, 2.32);
    scene.add(trim);
  }
  const TRACK = { B: { y: 0.75, z: 0.6, L: 9.8, n: 7, dir: -1 }, A: { y: 2.35, z: -1, L: 10.5, n: 7, dir: 1 } };
  for (const t of Object.values(TRACK)) {
    const Lw = t.L - 0.6;
    box(Lw, 0.08, 0.42, shelfWood, 0, t.y - 0.04, t.z);
    box(Lw, t.y - 0.08, 0.05, t === TRACK.B ? plankCream : plankRed, 0, (t.y - 0.08) / 2, t.z + 0.19, { occ: t === TRACK.B });
    const r = new Mesh(new CylinderGeometry(0.018, 0.018, Lw, 10), chrome);
    r.rotation.z = Math.PI / 2;
    r.position.set(0, t.y + 0.02, t.z + 0.17);
    scene.add(r);
    box(Lw, 0.05, 0.06, brass, 0, t.y - 0.06, t.z + 0.22, { cast: false });
    for (const sx of [-1, 1]) {
      const hx = sx * (t.L / 2 - 0.05);
      box(1, t.y + 1.15, 0.6, plankRed, hx, (t.y + 1.15) / 2, t.z, { occ: true });
      box(1.08, 0.08, 0.68, brass, hx, t.y + 1.17, t.z, { cast: false });
      const roof = new Mesh(new ConeGeometry(0.78, 0.45, 4), plankCream);
      roof.rotation.y = Math.PI / 4;
      roof.scale.z = 0.62;
      roof.position.set(hx, t.y + 1.42, t.z);
      roof.castShadow = true;
      scene.add(roof);
    }
  }
  box(7.2, 0.06, 0.25, shelfWood, 0, FLIP_Y - 0.03, -0.2);
  {
    const t = canvasTex(1024, 128, (g, w, h) => {
      for (let i = 0; i < 40; i++) {
        g.fillStyle = i % 2 ? "#e9d7b8" : "#a11620";
        g.fillRect(i * w / 40, 0, w / 40 + 1, h);
      }
      g.fillStyle = "rgba(0,0,0,0.25)";
      g.fillRect(0, 0, w, 10);
    });
    const m = new Mesh(new PlaneGeometry(16, 0.86), new MeshStandardMaterial({ map: t, roughness: 0.8 }));
    m.position.set(0, 0.46, TRACK.B.z + 0.22);
    m.receiveShadow = true;
    scene.add(m);
  }
  {
    const curtTex = canvasTex(512, 256, (g, w, h) => {
      for (let x = 0; x < w; x++) {
        const v = 0.55 + 0.45 * Math.sin(x * 0.11) * Math.sin(x * 0.031 + 1);
        g.fillStyle = "rgb(".concat(70 * v + 30 | 0, ",").concat(8 * v + 4 | 0, ",").concat(18 * v + 8 | 0, ")");
        g.fillRect(x, 0, 1, h);
      }
    }, { repeat: true });
    curtTex.repeat.set(5, 1);
    const curt = new Mesh(new PlaneGeometry(18, 3.4, 120, 1), new MeshStandardMaterial({ map: curtTex, roughness: 0.95 }));
    const P = curt.geometry.attributes.position;
    for (let i = 0; i < P.count; i++) P.setZ(i, Math.sin(P.getX(i) * 7) * 0.06);
    curt.geometry.computeVertexNormals();
    curt.position.set(0, 1.55, -2.3);
    curt.receiveShadow = true;
    scene.add(curt);
    const pelmet = box(18, 0.14, 0.12, brass, 0, 3.27, -2.25, { cast: false });
  }
  const marqTex = canvasTex(1024, 220, (g, w, h) => {
    g.fillStyle = "#1a0c06";
    g.fillRect(0, 0, w, h);
    g.font = '900 120px Georgia, "Times New Roman", serif';
    g.textAlign = "center";
    g.textBaseline = "middle";
    const tw = g.measureText("PEEKABOO GALLERY").width;
    if (tw > w * 0.92) g.font = "900 ".concat(Math.floor(120 * w * 0.92 / tw), 'px Georgia, "Times New Roman", serif');
    const gr = g.createLinearGradient(0, 40, 0, 180);
    gr.addColorStop(0, "#fff6c8");
    gr.addColorStop(0.5, "#ffc93c");
    gr.addColorStop(1, "#d9861a");
    g.lineWidth = 14;
    g.strokeStyle = "#7a0d10";
    g.strokeText("PEEKABOO GALLERY", w / 2, h / 2 + 6);
    g.fillStyle = gr;
    g.fillText("PEEKABOO GALLERY", w / 2, h / 2 + 6);
  });
  const marq = new Mesh(new PlaneGeometry(4.4, 0.95), new MeshStandardMaterial({ map: marqTex, emissiveMap: marqTex, emissive: 16777215, emissiveIntensity: 0.9, roughness: 0.6 }));
  marq.position.set(0, 3.75, -2.2);
  scene.add(marq);
  box(4.6, 1.12, 0.1, plankRed, 0, 3.75, -2.27, { cast: false });
  const key = new SpotLight(16767400, 90, 22, 0.78, 0.65, 1.6);
  key.position.set(0.6, 5.2, 4);
  key.target.position.set(0, 1.4, -0.8);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.bias = -2e-4;
  key.shadow.normalBias = 0.02;
  key.shadow.radius = 4;
  scene.add(key, key.target);
  const fill = new PointLight(16751194, 6, 10, 2);
  fill.position.set(-3, 2.4, 1.5);
  scene.add(fill);
  const fill2 = new PointLight(16756848, 6, 10, 2);
  fill2.position.set(3, 2.4, 1.5);
  scene.add(fill2);
  const rim = new PointLight(8023295, 12, 12, 2);
  rim.position.set(0, 3.2, -1.9);
  scene.add(rim);
  const prizeLight = new SpotLight(16773341, 0, 8, 0.5, 0.6, 1.5);
  prizeLight.position.set(0, 1.2, 1);
  scene.add(prizeLight, prizeLight.target);
  const BULBS = [];
  function strand(a, b, sag, n, mode) {
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const p = new Vector3().lerpVectors(a, b, t);
      p.y -= sag * 4 * t * (1 - t);
      pts.push(p);
      if (i > 0 && i < n) BULBS.push({ p: p.clone(), mode, ph: Math.random() * 6, hang: true });
    }
    const wire2 = new Line(new BufferGeometry().setFromPoints(pts), new LineBasicMaterial({ color: 1118481 }));
    scene.add(wire2);
  }
  strand(new Vector3(-2.2, 3.2, 2.3), new Vector3(2.2, 3.2, 2.3), 0.25, 18, "warm");
  strand(new Vector3(-6.5, 3.6, -2), new Vector3(0, 3.35, -2.1), 0.45, 14, "color");
  strand(new Vector3(0, 3.35, -2.1), new Vector3(6.5, 3.6, -2), 0.45, 14, "color");
  strand(new Vector3(-2.2, 3.25, 2.3), new Vector3(-6.5, 3.6, -2), 0.4, 12, "warm");
  strand(new Vector3(2.2, 3.25, 2.3), new Vector3(6.5, 3.6, -2), 0.4, 12, "warm");
  for (const sx of [-1, 1]) for (let i = 0; i < 8; i++) BULBS.push({ p: new Vector3(sx * 2.22 - sx * 0.17, 1.2 + i * 0.27, 2.25), mode: "post", ph: i, side: true });
  for (let i = 0; i < 22; i++) {
    const t = i / 21;
    BULBS.push({ p: new Vector3(-2.15 + t * 4.3, 3.27, -2.14), mode: "chase", ph: i });
    BULBS.push({ p: new Vector3(-2.15 + t * 4.3, 4.23, -2.14), mode: "chase", ph: i + 11 });
  }
  let bulbMesh = null;
  const bulbCol = [];
  {
    const bulb = await model("lightbulb_01");
    const meshes = [];
    bulb.traverse((o) => {
      if (o.isMesh) meshes.push(o);
    });
    const glassGeo = meshes.find((m) => /glass/.test(m.material.name)) || meshes[0];
    const baseM = meshes.find((m) => /base/.test(m.material.name));
    const S_ = 2.2, N = BULBS.length;
    const glass = new InstancedMesh(glassGeo.geometry, new MeshBasicMaterial({ color: 16777215 }), N);
    const base = baseM ? new InstancedMesh(baseM.geometry, new MeshStandardMaterial({ color: 10127978, metalness: 1, roughness: 0.35 }), N) : null;
    BULBS.forEach((b, i) => {
      const q = new Quaternion();
      if (b.hang) q.setFromAxisAngle(new Vector3(1, 0, 0), Math.PI);
      else if (b.side) q.setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2);
      const off = new Vector3(0, b.hang ? 0.02 : -0.02, 0);
      const sc = b.side ? 1.2 : S_;
      _m.compose(b.p.clone().add(off), q, new Vector3(sc, sc, sc));
      glass.setMatrixAt(i, _m);
      if (base) base.setMatrixAt(i, _m);
      b.col = b.mode === "color" ? new Color().setHSL([0, 0.08, 0.14, 0.33, 0.58, 0.8][i % 6], 1, 0.55) : new Color(1, 0.62, 0.28);
      glass.setColorAt(i, b.col);
    });
    scene.add(glass);
    if (base) scene.add(base);
    bulbMesh = glass;
  }
  function updateBulbs(t) {
    if (!bulbMesh) return;
    BULBS.forEach((b, i) => {
      let k = 1;
      if (calm()) k = b.mode === "post" ? 0.7 : 2.2;
      else if (b.mode === "chase") k = (Math.floor(t * 7) + b.ph) % 3 === 0 ? 2.6 : 0.9;
      else if (b.mode === "post") k = (Math.floor(t * 5) + b.ph) % 4 === 0 ? 1 : 0.45;
      else if (b.mode === "color") k = 2.6 + Math.sin(t * 2 + b.ph) * 0.6;
      else k = 3 + (Math.random() < 4e-3 ? -1.8 : 0) + Math.sin(t * 13 + b.ph * 7) * 0.08;
      bulbMesh.setColorAt(i, _c.copy(b.col).multiplyScalar(k * (G.frenzy ? 1.3 : 1)));
    });
    bulbMesh.instanceColor.needsUpdate = true;
  }
  for (const sx of [-1, 1]) {
    const lan = await model("Lantern_01");
    lan.traverse((o) => {
      if (o.isMesh) {
        const m = o.material;
        o.material = /glass/.test(m.name) ? new MeshStandardMaterial({ color: 16760944, emissive: 16752704, emissiveIntensity: 3, transparent: true, opacity: 0.9 }) : new MeshStandardMaterial({ map: m.map, normalMap: m.normalMap, roughnessMap: m.roughnessMap, metalnessMap: m.metalnessMap, metalness: 1, roughness: 0.5 });
      }
    });
    lan.scale.setScalar(2.2);
    lan.position.set(sx * 6, 2.3, -0.5);
    scene.add(lan);
    const ll = new PointLight(16754768, 6, 6, 2);
    ll.position.set(sx * 6, 2.6, -0.3);
    scene.add(ll);
  }
  function plushMat(color, sheen) {
    return new MeshPhysicalMaterial({ color, roughness: 0.95, sheen: 1, sheenRoughness: 0.45, sheenColor: new Color(sheen != null ? sheen : color).lerp(new Color(16777215), 0.35) });
  }
  function makePlush(type, s = 1) {
    const g = new Group();
    const C = { bear: [9067060, 14267530], bunny: [15984622, 16165058], panda: [15921902, 1710618], unicorn: [16512255, 13215743], duckie: [16765503, 16747562] }[type];
    const main = plushMat(C[0]), acc = plushMat(C[1]), black = new MeshPhysicalMaterial({ color: 657930, roughness: 0.15, clearcoat: 1 });
    const sph = (r, m, x, y, z, sx = 1, sy = 1, sz = 1) => {
      const o = new Mesh(new SphereGeometry(r, 32, 24), m);
      o.position.set(x, y, z);
      o.scale.set(sx, sy, sz);
      o.castShadow = true;
      g.add(o);
      return o;
    };
    if (type === "duckie") {
      sph(0.26, main, 0, 0.24, 0, 1, 0.85, 1.15);
      sph(0.17, main, 0, 0.55, 0.12);
      sph(0.07, acc, 0, 0.53, 0.29, 1.3, 0.5, 1.2);
      for (const sx of [-1, 1]) sph(0.025, black, sx * 0.07, 0.6, 0.26);
    } else {
      const limbM = type === "panda" ? acc : main;
      sph(0.27, main, 0, 0.3, 0, 1, 1.05, 0.9);
      if (type !== "panda") sph(0.16, acc, 0, 0.27, 0.16, 1, 1.1, 0.6);
      const head = sph(0.22, main, 0, 0.7, 0.02);
      sph(0.09, type === "panda" ? main : acc, 0, 0.64, 0.2, 1.2, 0.85, 0.9);
      sph(0.025, black, 0, 0.67, 0.29);
      for (const sx of [-1, 1]) {
        if (type === "panda") sph(0.06, acc, sx * 0.085, 0.74, 0.17, 0.8, 1.1, 0.6);
        sph(0.028, black, sx * 0.085, 0.74, 0.205);
        if (type === "bunny") {
          const e = sph(0.06, main, sx * 0.09, 1.02, -0.02, 0.7, 2.6, 0.5);
          e.rotation.z = -sx * 0.18;
          sph(0.04, acc, sx * 0.09, 1.02, 0.01, 0.6, 2.1, 0.3).rotation.z = -sx * 0.18;
        } else if (type === "unicorn") {
          sph(0.05, main, sx * 0.13, 0.9, 0, 0.8, 1.4, 0.6);
        } else sph(0.075, type === "panda" ? acc : main, sx * 0.16, 0.88, 0, 1, 1, 0.6);
        sph(0.085, limbM, sx * 0.25, 0.36, 0.08, 0.8, 1.5, 0.8).rotation.z = sx * 0.6;
        sph(0.1, limbM, sx * 0.14, 0.08, 0.16, 0.85, 0.8, 1.3);
      }
      if (type === "unicorn") {
        const horn = new Mesh(new ConeGeometry(0.04, 0.22, 24), brass);
        horn.position.set(0, 0.96, 0.1);
        horn.rotation.x = 0.3;
        g.add(horn);
        ["#ff6b9a", "#ffd23f", "#5ee0c6", "#7aa0ff", "#c86dd7"].forEach((c, i) => sph(0.06, plushMat(new Color(c)), 0, 0.92 - i * 0.07, -0.16 - i * 0.01, 0.8, 1, 1));
      }
    }
    g.scale.setScalar(s);
    return g;
  }
  const displayPlush = [["bear", -6.5, -0.2], ["panda", -5.7, -1.3], ["bunny", 5.7, -1.3], ["unicorn", 6.5, -0.2]];
  for (const [t, x, z] of displayPlush) {
    const p = makePlush(t, 1.25);
    p.position.set(x, 0.62, z);
    p.rotation.y = -Math.sign(x) * 0.5;
    scene.add(p);
  }
  for (const sx of [-1, 1]) {
    box(2.2, 0.6, 2.2, plankRed, sx * 6.2, 0.3, -0.7);
    box(2.3, 0.05, 2.3, brass, sx * 6.2, 0.61, -0.7, { cast: false });
  }
  let ac = null, master = null, noiseBuf = null;
  function audioInit() {
    try {
      if (!ac) {
        ac = new (window.AudioContext || window.webkitAudioContext)();
        const comp = ac.createDynamicsCompressor();
        comp.threshold.value = -12;
        comp.ratio.value = 5;
        comp.connect(ac.destination);
        master = ac.createGain();
        master.gain.value = Q.has("mute") ? 0 : 0.85;
        master.connect(comp);
        noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
        const d = noiseBuf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      if (ac.state === "suspended") ac.resume().catch(() => {
      });
    } catch (e) {
      ac = null;
    }
  }
  function tone(f0, f1, dur, vol, type = "sine", delay = 0, dest) {
    if (!ac) return;
    const t = ac.currentTime + delay, o = ac.createOscillator(), g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(1e-4, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 4e-3);
    g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
    o.connect(g).connect(dest || master);
    o.start(t);
    o.stop(t + dur + 0.05);
  }
  function noise(dur, vol, type = "bandpass", freq = 1e3, q = 1, delay = 0, f1) {
    if (!ac) return;
    const t = ac.currentTime + delay, s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = noiseBuf;
    f.type = type;
    f.frequency.setValueAtTime(freq, t);
    if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    f.Q.value = q;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
    s.connect(f).connect(g).connect(master);
    s.start(t, Math.random() * 0.5);
    s.stop(t + dur + 0.05);
  }
  const sfx = {
    pop() {
      noise(0.07, 0.55, "bandpass", 1100, 0.9);
      tone(720, 160, 0.09, 0.35);
      tone(260, 90, 0.05, 0.25, "triangle");
    },
    ding(p = 1) {
      [[1, 0.32, 1.1], [2.76, 0.16, 0.6], [5.4, 0.08, 0.35], [8.93, 0.04, 0.2]].forEach(([m, v, d]) => tone(980 * p * m, 980 * p * m * 0.998, d, v));
      noise(0.03, 0.25, "highpass", 5e3);
    },
    clang() {
      [1, 1.47, 2.09, 2.56, 3.2].forEach((m, i) => tone(380 * m, 370 * m, 0.45 - i * 0.05, 0.14, "triangle"));
      noise(0.08, 0.4, "bandpass", 2200, 1.4);
    },
    balloon() {
      noise(0.1, 0.9, "highpass", 1400);
      tone(240, 60, 0.06, 0.4);
    },
    jackpot() {
      [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => {
        tone(f, f, 0.5, 0.18, "sine", i * 0.07);
        tone(f * 2.01, f * 2.01, 0.3, 0.06, "sine", i * 0.07);
      });
      noise(0.8, 0.12, "highpass", 7e3, 1, 0.1);
    },
    reload() {
      [0, 0.07, 0.14].forEach((d) => noise(0.025, 0.5, "bandpass", 3200, 3, d));
      tone(300, 900, 0.18, 0.12, "triangle", 0.05);
    },
    empty() {
      noise(0.02, 0.4, "bandpass", 4500, 4);
    },
    combo(n) {
      tone(440 * Math.pow(2, Math.min(n, 24) / 12), 440 * Math.pow(2, Math.min(n, 24) / 12), 0.09, 0.08, "square");
    },
    wave() {
      [523, 659, 784, 1047].forEach((f, i) => {
        tone(f, f, 0.32, 0.14, "sawtooth", i * 0.11);
        tone(f / 2, f / 2, 0.32, 0.08, "square", i * 0.11);
      });
    },
    tick() {
      tone(1200, 1200, 0.05, 0.12);
    },
    whoosh() {
      noise(0.6, 0.25, "bandpass", 400, 2, 0, 3e3);
    },
    bad() {
      tone(300, 120, 0.35, 0.25, "sawtooth");
    },
    oops() {
      tone(150, 150, 0.16, 0.3, "square");
      tone(150, 150, 0.16, 0.3, "square", 0.21);
      tone(620, 430, 0.22, 0.2, "sine", 0.45);
      tone(560, 360, 0.3, 0.2, "sine", 0.72);
    },
    // buzz buzz, hoo-hoo: you shot an owl
    press() {
      tone(660, 990, 0.12, 0.2);
    },
    autoOn() {
      [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, f * 1.5, 0.22, 0.12, "sawtooth", i * 0.05));
      noise(0.5, 0.25, "bandpass", 600, 1, 0, 5e3);
    },
    autoOff() {
      tone(880, 220, 0.5, 0.16, "sawtooth");
      tone(440, 110, 0.5, 0.1, "square", 0.05);
    },
    powerUp() {
      [1319, 1760].forEach((f, i) => tone(f, f, 0.18, 0.1, "sine", i * 0.1));
    },
    storm() {
      for (let i = 0; i < 6; i++) tone(200 + i * 120, 600 + i * 200, 0.25, 0.08, "sawtooth", i * 0.04);
      noise(0.6, 0.3, "bandpass", 300, 1, 0, 4e3);
    },
    end() {
      [784, 659, 784, 1047, 988, 1047].forEach((f, i) => tone(f, f, 0.4, 0.15, "square", i * 0.16));
    },
    secret() {
      [880, 1175, 1568].forEach((f, i) => tone(f, f, 0.6, 0.14, "sine", i * 0.09));
    }
  };
  let nextId = 1;
  const targets = [];
  function addTarget(t) {
    t.id = nextId++;
    targets.push(t);
    return t;
  }
  const duckShape = new Shape();
  duckShape.moveTo(-0.3, 0);
  duckShape.lineTo(0.27, 0);
  duckShape.bezierCurveTo(0.36, 0.09, 0.32, 0.25, 0.17, 0.29);
  duckShape.bezierCurveTo(0.23, 0.35, 0.27, 0.45, 0.21, 0.53);
  duckShape.bezierCurveTo(0.15, 0.62, 0, 0.62, -0.03, 0.51);
  duckShape.bezierCurveTo(-0.05, 0.43, 0.02, 0.37, 0, 0.31);
  duckShape.bezierCurveTo(-0.11, 0.31, -0.23, 0.31, -0.33, 0.4);
  duckShape.bezierCurveTo(-0.36, 0.27, -0.36, 0.1, -0.3, 0);
  const duckGeo = new ExtrudeGeometry(duckShape, { depth: 0.035, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 3, curveSegments: 18 });
  duckGeo.translate(0, 0, -0.0175);
  const beakShape = new Shape();
  beakShape.moveTo(0.19, 0.47);
  beakShape.quadraticCurveTo(0.3, 0.5, 0.35, 0.46);
  beakShape.quadraticCurveTo(0.29, 0.42, 0.19, 0.43);
  const beakGeo = new ExtrudeGeometry(beakShape, { depth: 0.05, bevelEnabled: true, bevelThickness: 8e-3, bevelSize: 6e-3, bevelSegments: 2 });
  beakGeo.translate(0, 0, -0.025);
  const wingShape = new Shape();
  wingShape.moveTo(-0.2, 0.12);
  wingShape.bezierCurveTo(-0.1, 0.27, 0.08, 0.26, 0.12, 0.15);
  wingShape.bezierCurveTo(0.02, 0.1, -0.1, 0.08, -0.2, 0.12);
  const wingGeo = new ExtrudeGeometry(wingShape, { depth: 0.07, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 8e-3, bevelSegments: 2 });
  wingGeo.translate(0, 0, -0.035);
  const eyeGeo = new CylinderGeometry(0.028, 0.028, 0.075, 16);
  eyeGeo.rotateX(Math.PI / 2);
  const ringTex = canvasTex(256, 256, (g, w) => {
    const c = w / 2;
    ["#c8101e", "#f6efe2", "#c8101e", "#f6efe2", "#c8101e"].forEach((col, i) => {
      g.fillStyle = col;
      g.beginPath();
      g.arc(c, c, c * (1 - i * 0.2), 0, 7);
      g.fill();
    });
  });
  const decalGeo = new CircleGeometry(0.085, 32);
  const MAT = {
    duckY: paint(15909912),
    duckW: paint(16052454),
    duckG: paint(16762432, { metalness: 1, roughness: 0.18, clearcoat: 1, emissive: 3810304 }),
    beak: paint(15759898),
    eye: new MeshPhysicalMaterial({ color: 328965, roughness: 0.1, clearcoat: 1 }),
    wing: paint(15247378),
    decal: new MeshStandardMaterial({ map: ringTex, roughness: 0.4, metalness: 0.2, polygonOffset: true, polygonOffsetFactor: -2 }),
    owl: paint(8011007, { emissive: 3805082 }),
    owlBelly: paint(15919871, { emissive: 2761792 }),
    // the NO-SHOOT sign around every owl (Matt 10/22: "hard to know what not to shoot at"): a glowing red prohibition ring
    noShoot: new MeshBasicMaterial({ color: 15207436 })
    // flat, unlit red: reads as a sign under the warm booth lights
  };
  function makeDuck(kind = "duck") {
    const hinge = new Group(), inner = new Group();
    hinge.add(inner);
    const gold = kind === "golden", owl = kind === "owl";
    if (owl) {
      const body = new Mesh(new CylinderGeometry(0.24, 0.27, 0.5, 32, 1, false), MAT.owl);
      body.position.y = 0.27;
      body.scale.z = 0.25;
      inner.add(body);
      const head = new Mesh(new SphereGeometry(0.22, 32, 20), MAT.owl);
      head.position.y = 0.55;
      head.scale.z = 0.3;
      inner.add(head);
      for (const sx of [-1, 1]) {
        const e = new Mesh(new CylinderGeometry(0.075, 0.075, 0.1, 24), MAT.duckW);
        e.rotation.x = Math.PI / 2;
        e.position.set(sx * 0.09, 0.57, 0);
        inner.add(e);
        const p = new Mesh(new CylinderGeometry(0.035, 0.035, 0.12, 16), MAT.eye);
        p.rotation.x = Math.PI / 2;
        p.position.set(sx * 0.09, 0.57, 0);
        inner.add(p);
        const ear = new Mesh(new ConeGeometry(0.06, 0.16, 12), MAT.owl);
        ear.position.set(sx * 0.15, 0.76, 0);
        ear.scale.z = 0.4;
        ear.rotation.z = -sx * 0.4;
        inner.add(ear);
      }
      const belly = new Mesh(new CircleGeometry(0.16, 24), MAT.owlBelly);
      belly.position.set(0, 0.24, 0.07);
      inner.add(belly);
      const b2 = belly.clone();
      b2.position.z = -0.07;
      b2.rotation.y = Math.PI;
      inner.add(b2);
      const ring = new Mesh(new TorusGeometry(0.6, 0.075, 14, 64), MAT.noShoot);
      ring.position.set(0, 0.56, 0.02);
      hinge.add(ring);
      const slash = new Mesh(new BoxGeometry(1.14, 0.13, 0.04), MAT.noShoot);
      slash.rotation.z = -Math.PI / 4;
      slash.position.set(0, 0.56, 0.16);
      hinge.add(slash);
    } else {
      const body = new Mesh(duckGeo, gold ? MAT.duckG : MAT.duckY);
      inner.add(body);
      const beak = new Mesh(beakGeo, gold ? MAT.duckG : MAT.beak);
      inner.add(beak);
      const wing = new Mesh(wingGeo, gold ? MAT.duckG : MAT.wing);
      inner.add(wing);
      const eye2 = new Mesh(eyeGeo, MAT.eye);
      eye2.position.set(0.12, 0.5, 0);
      inner.add(eye2);
      if (!gold) for (const sz of [1, -1]) {
        const d = new Mesh(decalGeo, MAT.decal);
        d.position.set(-0.04, 0.18, sz * 0.054);
        if (sz < 0) d.rotation.y = Math.PI;
        inner.add(d);
      }
    }
    const rod = new Mesh(new CylinderGeometry(0.012, 0.012, 0.12, 8), chrome);
    rod.position.y = -0.04;
    hinge.add(rod);
    inner.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    inner.scale.setScalar(1.35);
    return { hinge, inner };
  }
  function hingeStep(o, dt, goal = null) {
    if (goal !== null) {
      o.w += (-(o.phi - goal) * 90 - o.w * 11) * dt;
    } else o.w += 22 * Math.sin(Math.max(0.02, o.phi)) * dt;
    o.phi += o.w * dt;
    if (o.phi >= Math.PI / 2) {
      o.phi = Math.PI / 2;
      o.w = -o.w * 0.32;
      if (Math.abs(o.w) < 0.6) o.w = 0;
    }
    if (o.phi < 0 && goal === null) {
      o.phi = 0;
      o.w = 0;
    }
  }
  const tracks = [];
  for (const [name, T] of Object.entries(TRACK)) {
    const tr = { name, ...T, slots: [], spacing: T.L / T.n, off: 0 };
    for (let i = 0; i < T.n; i++) {
      const slot = { tr, i, x: -T.L / 2 + i * tr.spacing, kind: null, phi: 0, w: 0, state: "empty", obj: null, shake: 0, objs: {} };
      for (const k of ["duck", "golden", "owl"]) {
        const d = makeDuck(k);
        d.hinge.visible = false;
        d.hinge.position.set(0, T.y + 0.08, T.z);
        if (T.dir < 0) d.inner.rotation.y = Math.PI;
        scene.add(d.hinge);
        slot.objs[k] = d;
      }
      tr.slots.push(slot);
      addTarget({
        kind: "duck",
        slot,
        radius: 0.42,
        decoyFn: () => slot.kind === "owl",
        center(v) {
          return v.set(slot.x, T.y + 0.08 + 0.42 * Math.cos(slot.phi), T.z - 0.42 * Math.sin(slot.phi));
        },
        hittable() {
          return slot.state === "up" && Math.abs(slot.x) < T.L / 2 - 0.4;
        },
        hit(shot) {
          knockDuck(slot, shot);
        }
      });
    }
    tracks.push(tr);
  }
  const calm = () => G.state === "play" && (G.phase === "ready" || G.phase === "practice");
  function fillSlot(slot) {
    const W_ = G.waveDef || WAVES[0];
    const p = W_.duckFill * (1 - 0.3 * G.struggle);
    for (const k in slot.objs) slot.objs[k].hinge.visible = false;
    slot.phi = 0;
    slot.w = 0;
    slot.kind = null;
    slot.state = "empty";
    if (G.state !== "play" && G.state !== "title" || calm()) return;
    if (Math.random() < p || G.state === "title") {
      slot.kind = Math.random() < (G.state !== "play" ? 0.15 : G.hardcore ? 0.16 : 0.1) ? "owl" : "duck";
      slot.state = "up";
      slot.counted = false;
      slot.obj = slot.objs[slot.kind];
      slot.obj.hinge.visible = true;
    }
  }
  function knockDuck(slot, shot) {
    if (slot.state !== "up") return;
    slot.state = "down";
    slot.w = 7 + rand(0, 3);
    slot.shake = 1;
    const c = targets.find((t) => t.slot === slot).center(new Vector3());
    if (slot.kind === "owl") {
      penalty(c, "DON'T SHOOT THE OWLS");
      for (let i = 0; i < 12; i++) chips.spawn(c, _v.set(rand(-2, 2), rand(1, 3), rand(-2, 0.5)), rand(0.6, 1.1), pick([6963152, 15656191]), 1.2, 0.8);
      return;
    }
    score(c, 100, "duck", shot);
    sfx.ding(rand(0.95, 1.08));
    hitFx(c, [1, 0.85, 0.3], 16765503);
    for (let i = 0; i < 10; i++) chips.spawn(c, _v.set(rand(-2, 2), rand(1, 3.5), rand(-2.5, 0.5)), rand(0.6, 1.2), pick([15909912, 16777215, 13111326]), 1.6, 0.6);
  }
  function updateTracks(dt) {
    const W_ = G.waveDef || WAVES[0];
    if (calm()) {
      for (const tr of tracks) for (const s of tr.slots) {
        s.state = "empty";
        s.kind = null;
        for (const k in s.objs) s.objs[k].hinge.visible = false;
      }
      return;
    }
    for (const tr of tracks) {
      const sp = W_.speed * (tr.name === "A" ? 1.12 : 1) * (G.hardcore ? 1.6 : 1) * (1 - 0.28 * G.struggle) * (G.state === "play" ? 1 : 0.45);
      for (const s of tr.slots) {
        s.x += tr.dir * sp * dt;
        if (s.x > tr.L / 2) {
          s.x -= tr.L;
          if (s.state === "up" && !s.counted && s.kind === "duck" && G.state === "play") escaped(0.02);
          fillSlot(s);
        }
        if (s.x < -tr.L / 2) {
          s.x += tr.L;
          if (s.state === "up" && !s.counted && s.kind === "duck" && G.state === "play") escaped(0.02);
          fillSlot(s);
        }
        if (!s.obj || !s.obj.hinge.visible) continue;
        if (s.state === "down") hingeStep(s, dt);
        s.shake = Math.max(0, s.shake - dt * 3);
        s.obj.hinge.position.x = s.x;
        s.obj.hinge.rotation.x = -s.phi;
        s.obj.inner.position.y = Math.abs(Math.sin(s.x * 9)) * 0.012;
        s.obj.hinge.rotation.z = Math.sin(performance.now() / 30) * 0.08 * s.shake;
      }
    }
  }
  const dart = await model("dartboard");
  dart.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  const FLIP_X = [-2.6, -1.3, 0, 1.3, 2.6];
  const flips = FLIP_X.map((x, i) => {
    const hinge = new Group();
    hinge.position.set(x, FLIP_Y, -0.2);
    scene.add(hinge);
    const b = dart.clone(true);
    b.scale.setScalar(1.55);
    b.position.set(0, 0.39, -0.03);
    hinge.add(b);
    const back = new Mesh(new CylinderGeometry(0.37, 0.37, 0.04, 40), plankRed);
    back.rotation.x = Math.PI / 2;
    back.position.set(0, 0.39, -0.05);
    back.castShadow = true;
    hinge.add(back);
    const f = { hinge, x, phi: Math.PI / 2, w: 0, state: "down", t: 0, goal: Math.PI / 2, i };
    f.target = addTarget({
      kind: "board",
      radius: 0.38,
      center(v) {
        return v.set(x, FLIP_Y + 0.39 * Math.cos(f.phi), -0.2 - 0.39 * Math.sin(f.phi));
      },
      hittable() {
        return f.state === "up" && f.phi < 0.5 && !(G.wave >= 2 && (i === 1 || i === 3));
      },
      hit(shot) {
        f.state = "falling";
        f.goal = Math.PI / 2;
        f.w = 12;
        const c = this.center(new Vector3());
        const bull = shot && shot.dist !== void 0 && shot.dist < 0.33;
        score(c, bull ? 300 : 150, bull ? "BULLSEYE!" : "board", shot);
        sfx.ding(bull ? 1.5 : 1.25);
        if (bull) sfx.ding(2);
        hitFx(c, bull ? [1, 0.4, 0.3] : [1, 0.9, 0.6], 16777215, bull ? 1.6 : 1);
      }
    });
    return f;
  });
  function updateFlips(dt) {
    const W_ = G.waveDef || WAVES[0];
    for (const f of flips) {
      const blocked = G.wave >= 2 && (f.i === 1 || f.i === 3);
      if (f.state === "down" && !blocked && G.state === "play" && !calm() && Math.random() < dt * W_.flipRate * (1 - 0.4 * G.struggle) / 5) {
        f.state = "up";
        f.goal = 0;
        f.t = W_.flipStay * (G.hardcore ? 0.6 : 1) * (1 + 0.5 * G.struggle);
      }
      if (f.state === "up") {
        f.t -= dt;
        if (f.t <= 0) {
          f.state = "falling";
          f.goal = Math.PI / 2;
          escaped(0.06);
        }
      }
      if (f.state === "falling" && f.phi > 1.5) f.state = "down";
      if ((G.state !== "play" || calm()) && f.state === "up") {
        f.state = "falling";
        f.goal = Math.PI / 2;
      }
      f.w += (-(f.phi - f.goal) * 140 - f.w * 12) * dt;
      f.phi = clamp(f.phi + f.w * dt, -0.2, Math.PI / 2);
      f.hinge.rotation.x = -f.phi;
    }
  }
  const starShape = new Shape();
  for (let i = 0; i <= 10; i++) {
    const a = i / 10 * Math.PI * 2 + Math.PI / 2, r = i % 2 ? 0.17 : 0.4;
    i ? starShape.lineTo(Math.cos(a) * r, Math.sin(a) * r) : starShape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  const starGeo = new ExtrudeGeometry(starShape, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 3 });
  starGeo.translate(0, 0, -0.02);
  const spinners = [-1.3, 1.3].map((x) => {
    const g = new Group();
    g.position.set(x, FLIP_Y + 0.42, -0.2);
    scene.add(g);
    const post = new Mesh(new CylinderGeometry(0.02, 0.02, 0.5, 10), chrome);
    post.position.y = -0.3;
    g.add(post);
    const disc = new Mesh(starGeo, paint(3108095, { metalness: 0.6, roughness: 0.25 }));
    disc.castShadow = true;
    g.add(disc);
    const sp = { g, disc, x, ang: rand(0, 6), w: 2.2, hp: 3, state: "off", fly: null, scale: 0 };
    g.scale.setScalar(1e-3);
    sp.target = addTarget({
      kind: "spinner",
      radius: 0.42,
      center(v) {
        return v.set(x, FLIP_Y + 0.42, -0.2).add(sp.fly ? sp.fly.p : _v3.set(0, 0, 0));
      },
      hittable() {
        return sp.state === "on" && sp.scale > 0.9 && Math.abs(Math.cos(sp.ang)) > 0.3;
      },
      hit(shot) {
        sp.w += 10;
        sp.hp--;
        const c = this.center(new Vector3());
        score(c, 120, "spin", shot);
        sfx.clang();
        hitFx(c, [0.5, 0.7, 1], 8956671);
        if (sp.hp <= 0) {
          sp.state = "fly";
          sp.fly = { p: new Vector3(), v: new Vector3(rand(-1.5, 1.5), 4.5, -2), t: 0 };
          score(c, 250, "SPINNER DOWN!", null, true);
          burstSparks(c, 60, 5, [0.6, 0.8, 2]);
        }
      }
    });
    return sp;
  });
  function updateSpinners(dt) {
    var _a;
    for (const sp of spinners) {
      const want = G.wave >= 2 && G.state === "play";
      if (sp.state === "off" && want) {
        sp.state = "on";
        sp.hp = G.hardcore ? 4 : 3;
      }
      if (sp.state === "on" && !want) sp.state = "off";
      if (sp.state === "fly") {
        const f = sp.fly;
        f.t += dt;
        f.v.y -= 9.8 * dt;
        f.p.addScaledVector(f.v, dt);
        sp.disc.rotation.x += dt * 14;
        if (f.t > 1.4) {
          sp.state = "respawn";
          sp.respawn = 2.5;
          sp.fly = null;
          sp.disc.rotation.x = 0;
          sp.scale = 0;
        }
      }
      if (sp.state === "respawn") {
        sp.respawn -= dt;
        if (sp.respawn <= 0) {
          sp.state = want ? "on" : "off";
          sp.hp = G.hardcore ? 4 : 3;
        }
      }
      const targetScale = sp.state === "on" || sp.state === "fly" ? 1 : 0;
      sp.scale = lerp(sp.scale, targetScale, 1 - Math.exp(-dt * 8));
      sp.g.scale.setScalar(Math.max(1e-3, sp.scale));
      sp.w = lerp(sp.w, (G.hardcore ? 3.6 : 2.2) * (((_a = G.waveDef) == null ? void 0 : _a.speed) || 1), 1 - Math.exp(-dt * 0.8));
      sp.ang += sp.w * dt;
      sp.disc.rotation.y = sp.ang;
      sp.disc.position.copy(sp.fly ? sp.fly.p : _v.set(0, 0, 0));
    }
  }
  const canTex = canvasTex(512, 256, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, "#d0d4da");
    gr.addColorStop(0.12, "#c8101e");
    gr.addColorStop(0.88, "#c8101e");
    gr.addColorStop(1, "#d0d4da");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#ffd23f";
    g.fillRect(0, h * 0.42, w, h * 0.18);
    g.font = "900 54px Georgia, serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillStyle = "#fff6dc";
    g.fillText("POP!", w * 0.25, h * 0.28);
    g.fillText("POP!", w * 0.75, h * 0.28);
    g.fillStyle = "#7a0d10";
    g.font = "700 30px Georgia, serif";
    g.fillText("★ CARNIVAL ★", w * 0.25, h * 0.51);
    g.fillText("★ CARNIVAL ★", w * 0.75, h * 0.51);
  });
  const canGeo = new CylinderGeometry(0.16, 0.16, 0.42, 32);
  const canMats = [new MeshPhysicalMaterial({ map: canTex, metalness: 0.75, roughness: 0.3, roughnessMap: scuffTex, clearcoat: 0.5 }), new MeshStandardMaterial({ color: 14212322, metalness: 1, roughness: 0.25 }), new MeshStandardMaterial({ color: 14212322, metalness: 1, roughness: 0.25 })];
  const stools = [-2.35, 2.35].map((x) => {
    const g = new Group();
    scene.add(g);
    const top = new Mesh(new CylinderGeometry(0.62, 0.62, 0.08, 40), shelfWood);
    top.position.y = 1;
    top.castShadow = top.receiveShadow = true;
    g.add(top);
    const leg = new Mesh(new CylinderGeometry(0.1, 0.16, 1, 20), plankRed);
    leg.position.y = 0.5;
    g.add(leg);
    g.position.set(x, -1.6, 1.45);
    const st = { g, x, rise: 0, cans: [], restack: 0, cleared: false };
    const layout = [[-0.34, 0], [0, 0], [0.34, 0], [-0.17, 1], [0.17, 1], [0, 2]];
    layout.forEach(([cx, row], i) => {
      const m = new Mesh(canGeo, canMats);
      m.castShadow = m.receiveShadow = true;
      scene.add(m);
      const can = { m, home: new Vector3(x + cx, 1.04 + 0.21 + row * 0.425, 1.45), row, cx, p: new Vector3(), v: new Vector3(), q: new Quaternion(), ax: new Vector3(1, 0, 0), w: 0, state: "static", st, i, juggles: 0 };
      can.p.copy(can.home);
      st.cans.push(can);
      can.target = addTarget({
        kind: "can",
        radius: 0.24,
        center(v) {
          return v.copy(can.p);
        },
        hittable() {
          return st.rise > 0.95 && (can.state === "static" || can.state === "dyn" && can.p.y > 1.3 && can.air > 0.12);
        },
        hit(shot) {
          knockCan(can, shot);
        }
      });
    });
    return st;
  });
  function knockCan(can, shot) {
    const c = can.p.clone();
    if (can.state === "dyn") {
      can.juggles++;
      score(c, 200 * can.juggles, "JUGGLE!", shot);
    } else score(c, 80, "can", shot);
    can.state = "dyn";
    can.air = 0;
    can.v.set(rand(-1.2, 1.2) + can.cx * 3, rand(3.2, 4.6), rand(-2.6, -1.2));
    can.ax.set(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize();
    can.w = rand(8, 16);
    sfx.clang();
    hitFx(c, [1, 0.8, 0.6], 16769200);
    shake(0.25);
    for (const o of can.st.cans) if (o.state === "static" && o.row > can.row && Math.abs(o.cx - can.cx) < 0.36) setTimeout(() => {
      if (o.state === "static") {
        o.state = "dyn";
        o.air = 0;
        o.v.set(rand(-0.8, 0.8), rand(0.5, 1.5), rand(-1, 0.3));
        o.w = rand(3, 8);
        o.ax.set(rand(-1, 1), 0, rand(-1, 1)).normalize();
      }
    }, 60);
    if (!can.st.cleared && can.st.cans.every((o) => o.state !== "static")) {
      can.st.cleared = true;
      score(c.clone().add(_v.set(0, 0.4, 0)), 500, "PYRAMID!", null, true);
      confettiBurst(c, 80, 3);
      can.st.restack = 2.8;
    }
  }
  function updateCans(dt) {
    var _a, _b;
    for (const st of stools) {
      const want = G.state === "play" && G.wave >= 3;
      st.rise = clamp(st.rise + (want ? dt : -dt) * 0.8, 0, 1);
      const e = st.rise < 1 ? 1 - Math.pow(1 - st.rise, 3) : 1;
      st.g.position.y = -1.6 + 1.6 * e;
      if (st.restack > 0) {
        st.restack -= dt;
        if (st.restack <= 0) {
          st.cleared = false;
          for (const c of st.cans) {
            c.state = "static";
            c.juggles = 0;
            c.p.copy(c.home);
            c.q.identity();
            c.pop = 0;
          }
        }
      }
      for (const c of st.cans) {
        if (c.state === "static") {
          c.p.copy(c.home);
          c.p.y += st.g.position.y;
          c.q.identity();
          c.pop = Math.min(1, ((_a = c.pop) != null ? _a : 1) + dt * 4);
        } else {
          c.air += dt;
          c.v.y -= 9.8 * dt;
          c.p.addScaledVector(c.v, dt);
          c.q.premultiply(_q.setFromAxisAngle(c.ax, c.w * dt));
          const onStool = Math.hypot(c.p.x - st.x, c.p.z - 1.45) < 0.62;
          const floor = onStool && c.p.y > 0.9 ? 1.04 + 0.16 : 0.16;
          if (c.p.y < floor) {
            c.p.y = floor;
            if (c.v.y < -1.2) {
              sfx.clang();
              c.v.y *= -0.35;
            } else c.v.y = 0;
            c.v.x *= 0.6;
            c.v.z *= 0.6;
            c.w *= 0.6;
            c.air = 0;
          }
        }
        c.m.position.copy(c.p);
        c.m.quaternion.copy(c.q);
        c.m.visible = st.rise > 0.01;
        c.m.scale.setScalar(c.state === "static" ? Math.max(0.01, (_b = c.pop) != null ? _b : 1) : 1);
      }
    }
  }
  const balloonGeo = new SphereGeometry(0.22, 40, 28);
  {
    const P = balloonGeo.attributes.position;
    for (let i = 0; i < P.count; i++) {
      const y = P.getY(i);
      P.setY(i, y * 1.18 - (y < 0 ? y * y * 0.6 : 0));
    }
    balloonGeo.computeVertexNormals();
  }
  const knotGeo = new ConeGeometry(0.035, 0.05, 12);
  const BCOL = [15208749, 2063359, 1491314, 16752412, 11619583, 16732067];
  const balloons = [];
  for (let i = 0; i < 12; i++) {
    const col = BCOL[i % BCOL.length];
    const mat = new MeshPhysicalMaterial({ color: col, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08, sheen: 0.4, sheenColor: new Color(col).lerp(new Color(1, 1, 1), 0.5), transparent: true, opacity: 0.94 });
    const g = new Group();
    const b = new Mesh(balloonGeo, mat);
    b.castShadow = true;
    g.add(b);
    const k = new Mesh(knotGeo, mat);
    k.position.y = -0.27;
    k.rotation.x = Math.PI;
    g.add(k);
    const str = new Line(new BufferGeometry().setFromPoints(Array.from({ length: 12 }, (_, j) => new Vector3(Math.sin(j * 0.8) * 0.03, -0.3 - j * 0.07, 0))), new LineBasicMaterial({ color: 14540253, transparent: true, opacity: 0.6 }));
    g.add(str);
    g.visible = false;
    scene.add(g);
    const bl = { g, col, active: false, p: new Vector3(), vy: 0, ph: rand(0, 6), golden: false, mat };
    bl.target = addTarget({
      kind: "balloon",
      radius: 0.3,
      center(v) {
        return v.copy(bl.p);
      },
      hittable() {
        return bl.active;
      },
      hit(shot) {
        bl.active = false;
        g.visible = false;
        score(bl.p.clone(), bl.secret ? 600 : 60, bl.secret ? "SKY PRIZE!" : "balloon", shot, bl.secret);
        if (bl.secret) {
          G.secrets++;
          sfx.secret();
          firework(bl.p.clone().add(_v.set(0, 0.5, -1)), Math.random());
        }
        sfx.balloon();
        shake(0.12);
        for (let j = 0; j < 22; j++) chips.spawn(bl.p, _v.set(rand(-3, 3), rand(-1, 3), rand(-3, 2)), rand(0.8, 1.6), col, 1.4, 1.5);
        burstSparks(bl.p, 30, 3, [1, 1, 1], 0.04, 0.4, 1);
        lightFlash(bl.p, col, 4, 0.2);
      }
    });
    balloons.push(bl);
  }
  function launchBalloon(secret = false) {
    const bl = balloons.find((b) => !b.active);
    if (!bl) return;
    bl.active = true;
    bl.g.visible = true;
    bl.secret = secret;
    if (secret) {
      bl.p.set(rand(-2.2, 2.2), 4.75, -1.5);
      bl.vy = 0;
      bl.life = 7;
      bl.mat.color.set(16762432);
      bl.mat.metalness = 0.9;
      bl.mat.roughness = 0.12;
    } else {
      bl.p.set(rand(-2.6, 2.6), 0.2, rand(-0.9, -0.5));
      bl.vy = (G.hardcore ? 0.7 : 0.42) * rand(0.85, 1.15) * (1 - 0.3 * G.struggle);
      bl.life = 99;
      bl.mat.color.set(bl.col);
      bl.mat.metalness = 0;
      bl.mat.roughness = 0.18;
    }
  }
  function updateBalloons(dt, t) {
    for (const bl of balloons) {
      if (!bl.active) continue;
      bl.p.y += bl.vy * dt;
      bl.p.x += Math.sin(t * 1.3 + bl.ph) * dt * (G.hardcore ? 0.6 : 0.25);
      bl.life -= dt;
      if (bl.p.y > 4.2 && !bl.secret || bl.life <= 0 || G.state === "end") {
        bl.active = false;
        bl.g.visible = false;
        if (!bl.secret && G.state === "play") escaped(0.03);
      }
      bl.g.position.copy(bl.p);
      bl.g.position.y += bl.secret ? Math.sin(t * 2 + bl.ph) * 0.06 : 0;
      bl.g.rotation.z = Math.sin(t * 1.7 + bl.ph) * 0.12;
    }
  }
  const golden = { d: makeDuck("golden"), active: false, x: 0, dir: 1, speed: 3, phi: 0, w: 0, fly: null };
  golden.d.inner.scale.setScalar(1.55);
  golden.d.hinge.visible = false;
  scene.add(golden.d.hinge);
  const wire = new Mesh(new CylinderGeometry(0.014, 0.014, 16, 8), brass);
  wire.rotation.z = Math.PI / 2;
  wire.position.set(0, GOLD_Y - 0.02, -0.7);
  scene.add(wire);
  golden.target = addTarget({
    kind: "golden",
    radius: 0.5,
    center(v) {
      return v.copy(golden.d.hinge.position).add(_v3.set(0, 0.45, 0));
    },
    hittable() {
      return golden.active && !golden.fly && Math.abs(golden.x) < 4.5;
    },
    hit(shot) {
      const c = this.center(new Vector3());
      golden.fly = { v: new Vector3(rand(-1, 1), 5, -3), w: 14 };
      score(c, 1e3, "GOLDEN DUCK!", shot, true);
      sfx.jackpot();
      slowmo(0.22, 0.9);
      for (let i = 0; i < 70; i++) coins.spawn(c, _v.set(rand(-3, 3), rand(2, 6), rand(-2, 2)), 1, 16762432, 2.5, 0.3);
      burstSparks(c, 140, 6, [3, 2.2, 0.6], 0.07, 1);
      lightFlash(c, 16762432, 30, 0.6);
      flash(16770720, 0.25);
      shake(0.5);
      firework(new Vector3(rand(-6, 6), 9, -14), 0.12);
    }
  });
  function launchGolden() {
    if (golden.active) return;
    golden.active = true;
    golden.dir = Math.random() < 0.5 ? 1 : -1;
    golden.x = -golden.dir * 6;
    golden.speed = (G.hardcore ? 4.2 : 2.6) * (1 - 0.25 * G.struggle);
    golden.fly = null;
    golden.d.hinge.visible = true;
    golden.d.hinge.rotation.set(0, 0, 0);
    golden.d.inner.rotation.y = golden.dir > 0 ? 0 : Math.PI;
    sfx.whoosh();
  }
  function updateGolden(dt, t) {
    if (!golden.active) return;
    const h = golden.d.hinge;
    if (golden.fly) {
      golden.fly.v.y -= 9.8 * dt;
      h.position.addScaledVector(golden.fly.v, dt);
      h.rotation.x += golden.fly.w * dt;
      h.rotation.z += golden.fly.w * 0.5 * dt;
      if (h.position.y < -1) {
        golden.active = false;
        h.visible = false;
      }
    } else {
      golden.x += golden.dir * golden.speed * dt;
      h.position.set(golden.x, GOLD_Y + Math.abs(Math.sin(t * 8)) * 0.05, -0.7);
      if (Math.random() < 0.6) sparks.emit(h.position.x - golden.dir * 0.3, h.position.y + 0.3 + rand(0, 0.4), -0.7, rand(-0.3, 0.3), rand(-0.2, 0.4), 0, 0.6, 0.06, 0, 3, 2.2, 0.6, 1, -0.5, 1);
      if (Math.abs(golden.x) > 6.5) {
        golden.active = false;
        h.visible = false;
        escaped(0.02);
      }
    }
  }
  const secretStars = [-1, 1].map((sx) => {
    const g = new Group();
    g.position.set(sx * 5.4, 1.55, -0.6);
    scene.add(g);
    const star = new Mesh(starGeo, new MeshPhysicalMaterial({ color: 16762432, metalness: 1, roughness: 0.15, emissive: 5583616, clearcoat: 1 }));
    star.scale.setScalar(1.15);
    star.castShadow = true;
    g.add(star);
    const halo = new Sprite(new SpriteMaterial({ map: glowTex, color: 16760928, transparent: true, opacity: 0.55, depthWrite: false, blending: AdditiveBlending }));
    halo.scale.setScalar(1.6);
    g.add(halo);
    const s = { g, star, sx, active: false, t: 0, cool: 3 };
    g.visible = false;
    s.target = addTarget({
      kind: "secret",
      radius: 0.45,
      secret: true,
      center(v) {
        return v.copy(g.position);
      },
      hittable() {
        return s.active;
      },
      hit(shot) {
        s.active = false;
        g.visible = false;
        s.cool = rand(7, 11);
        G.secrets++;
        score(g.position.clone(), 500, "SECRET STAR!", shot, true);
        sfx.secret();
        sfx.ding(1.6);
        burstSparks(g.position, 120, 5, [3, 2.2, 0.5], 0.07, 0.9);
        for (let i = 0; i < 30; i++) coins.spawn(g.position, _v.set(rand(-2, 2), rand(2, 5), rand(-1, 2)), 1, 16762432, 2.2, 0.3);
        lightFlash(g.position, 16760928, 20, 0.5);
        shake(0.3);
      }
    });
    return s;
  });
  function updateSecrets(dt, t) {
    for (const s of secretStars) {
      if (!s.active && G.state === "play" && !calm() && G.wave >= 1) {
        s.cool -= dt;
        if (s.cool <= 0) {
          s.active = true;
          s.g.visible = true;
          s.t = 0;
        }
      }
      if (G.state !== "play" || calm()) {
        s.active = false;
        s.g.visible = false;
      }
      s.t += dt;
      s.star.rotation.y = t * 2.2;
      s.g.position.y = 1.55 + Math.sin(t * 2) * 0.08;
    }
  }
  const WAVES = [
    { name: "DUCK PARADE", speed: 0.95, duckFill: 0.7, flipRate: 1.6, flipStay: 3, balloons: 0, golden: 1 },
    { name: "SPIN CITY", speed: 1.15, duckFill: 0.7, flipRate: 1.8, flipStay: 2.6, balloons: 0.18, golden: 1 },
    { name: "TIN CAN ALLEY", speed: 1.2, duckFill: 0.6, flipRate: 1.2, flipStay: 2.6, balloons: 0.45, golden: 1 },
    { name: "GOLDEN FRENZY", speed: 1.5, duckFill: 0.9, flipRate: 2.6, flipStay: 2.2, balloons: 0.6, golden: 3 }
  ];
  const WAVE_LEN = ROUND / 4;
  G.waveDef = WAVES[0];
  let goldenPlan = [], skyPlan = [];
  function startWave(i) {
    G.wave = i + 1;
    G.waveDef = WAVES[i];
    if (!(i === 0 && G.banner && G.banner.text === "GO!")) G.banner = { t: 0, text: "WAVE ".concat(i + 1), sub: "" };
    sfx.wave();
    const t0 = i * WAVE_LEN;
    goldenPlan.push(...Array.from({ length: WAVES[i].golden }, (_, k) => t0 + rand(4, WAVE_LEN - 4) * (k + 1) / WAVES[i].golden));
    skyPlan.push(t0 + rand(8, 12), t0 + rand(15, 19));
    if (i === 3) G.frenzy = true;
    firework(new Vector3(rand(-8, 8), 10, -16), Math.random());
  }
  const popups = [];
  function screenOf(p) {
    _v2.copy(p).project(camera);
    return { x: (_v2.x + 1) / 2 * W, y: (1 - _v2.y) / 2 * H };
  }
  function score(p, base, label, shot, big) {
    if (G.state !== "play") return;
    G.combo++;
    G.bestCombo = Math.max(G.bestCombo, G.combo);
    G.comboT = G.hardcore ? 1.9 : 3.2;
    const cap = G.hardcore ? 10 : 5, step = G.hardcore ? 3 : 4;
    const newMult = Math.min(cap, 1 + Math.floor(G.combo / step));
    if (newMult > G.mult) {
      sfx.combo(newMult * 2);
      G.multPulse = 1;
    }
    G.mult = newMult;
    const frenzy = G.frenzy && G.timeLeft < 12 ? 2 : 1;
    const quick = shot && shot.quick ? 1.25 : 1;
    const pts = Math.round(base * G.mult * frenzy * quick / 10) * 10;
    G.score += pts;
    G.hits++;
    G.struggle = Math.max(0, G.struggle - 0.05);
    const s = screenOf(p);
    popups.length = 0;
    popups.push({ x: s.x, y: s.y, t: 0, text: /^[A-Z]/.test(label) ? "".concat(label, " +").concat(pts) : "+".concat(pts), sub: "", big: big || /^[A-Z]/.test(label) });
  }
  function penalty(p, label) {
    G.score = Math.max(0, G.score - 300);
    G.combo = 0;
    G.mult = 1;
    G.oops = (G.oops || 0) + 1;
    G.oopsFlash = 1;
    sfx.oops();
    shake(0.35);
    flash(16719904, 0.3);
    const s = screenOf(p);
    popups.length = 0;
    popups.push({ x: s.x, y: s.y, t: 0, text: "-300", sub: "", big: true, bad: true });
  }
  function escaped(k) {
    G.escaped++;
    G.struggle = Math.min(1, G.struggle + k);
  }
  function hitFx(c, col, light, k = 1) {
    burstSparks(c, Math.round(40 * k), 4.5 * k, [col[0] * 2.5, col[1] * 2.5, col[2] * 2.5], 0.05, 0.6);
    puff(c, 6, [0.95, 0.92, 0.88], 0.3);
    lightFlash(c, light, 9 * k, 0.25);
    shake(0.08 * k);
  }
  let slowT = 0, slowDur = 0, slowAmt = 1;
  function slowmo(amt, dur) {
    slowAmt = amt;
    slowT = slowDur = dur;
  }
  const ghostMat = new ShaderMaterial({
    uniforms: { uCol: { value: new Color(0.32, 0.86, 1) }, uT: { value: 0 }, uA: { value: 1 } },
    vertexShader: "varying vec3 vN; varying vec3 vV; varying vec3 vW;\n    void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz); gl_Position = projectionMatrix * viewMatrix * w; }",
    fragmentShader: "uniform vec3 uCol; uniform float uT; uniform float uA; varying vec3 vN; varying vec3 vV; varying vec3 vW;\n    void main(){\n      float f = 1.0 - abs(dot(normalize(vN), normalize(vV)));\n      float rim = pow(f, 2.4);\n      float scan = 0.82 + 0.18 * sin(vW.y * 120.0 - uT * 5.0);\n      float fade = smoothstep(0.35, 0.8, vW.y);                     // dissolve toward the counter\n      vec3 c = uCol * (0.12 + rim * 2.6) * scan;\n      gl_FragColor = vec4(c, (0.1 + rim * 0.9) * uA * fade);\n    }",
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending
  });
  const avatar = new Group();
  scene.add(avatar);
  const gpart = (geo) => {
    const m = new Mesh(geo, ghostMat);
    m.renderOrder = 6;
    avatar.add(m);
    return m;
  };
  const unitCap = (r) => new CapsuleGeometry(r, 1, 8, 20);
  function torsoGeo() {
    const pts = [[1e-3, -0.02], [0.15, 0], [0.16, 0.06], [0.145, 0.17], [0.17, 0.28], [0.21, 0.37], [0.225, 0.42], [0.16, 0.48], [0.065, 0.515], [1e-3, 0.52]].map(([r, y]) => new Vector2(r, y));
    const g = new LatheGeometry(pts, 40);
    g.scale(1, 1, 0.62);
    return g;
  }
  const AV = {
    pelvis: gpart(new SphereGeometry(0.15, 32, 20)),
    chest: gpart(torsoGeo()),
    neck: gpart(unitCap(0.045)),
    head: gpart(new SphereGeometry(0.098, 40, 28)),
    // HUMAN PROPORTIONS (Matt 10/20: a normal silhouette, broad shoulders, thick limbs, arm ~1.45x the torso, never stretched)
    arm: { right: [gpart(unitCap(0.062)), gpart(unitCap(0.05)), gpart(new SphereGeometry(0.05, 24, 16))], left: [gpart(unitCap(0.062)), gpart(unitCap(0.05)), gpart(new SphereGeometry(0.05, 24, 16))] },
    sh: { right: gpart(new SphereGeometry(0.078, 24, 16)), left: gpart(new SphereGeometry(0.078, 24, 16)) }
  };
  AV.pelvis.visible = false;
  AV.head.scale.set(0.9, 1.08, 1);
  const REAL = Q.get("body") !== "fig";
  const realGrips = { l: null, r: null };
  const youReal = REAL ? create({
    scene,
    camera,
    BP,
    x: 0,
    z: 3.2,
    tier: RS.quality ? RS.quality.tier : 1,
    gloves: false,
    levelFeet: false,
    stepRange: 0,
    guardDepth: 0.04,
    outfit: "casual",
    grip: { l: "fist", r: "fist" },
    grips: () => realGrips,
    onFallback: (w) => console.warn("real you off:", w)
  }) : null;
  const galGhost = REAL ? create2(Object.assign({ scene, BP, you: youReal, outfit: "casual", tier: RS.quality ? RS.quality.tier : 1 }, STANCES.gallery)) : null;
  function stretch(mesh, a, b, r) {
    const d = _v.subVectors(b, a), len = Math.max(0.01, d.length());
    mesh.position.copy(a).addScaledVector(d, 0.5);
    mesh.quaternion.setFromUnitVectors(_v2.set(0, 1, 0), d.normalize());
    mesh.scale.set(1, Math.max(0.01, len - 2 * r), 1);
  }
  function elbowOf(a, c, la, lb, hint) {
    const d = new Vector3().subVectors(c, a), dist = Math.min(d.length(), la + lb - 1e-3);
    const x = (la * la - lb * lb + dist * dist) / (2 * dist), h = Math.sqrt(Math.max(0, la * la - x * x));
    const dn = d.clone().normalize(), side = hint.clone().sub(dn.clone().multiplyScalar(hint.dot(dn))).normalize();
    return a.clone().addScaledVector(dn, x).addScaledVector(side, h);
  }
  const GUNS = { two: "TWO PISTOLS", grip: "ONE PISTOL, BOTH HANDS", one: "ONE PISTOL, ONE HAND" };
  const GUN_SAY = { two: "A pistol in each hand. Each one shoots on its own.", grip: "Hold one pistol out in front with both hands together.", one: "Point with either hand. The raised hand holds the pistol; switch any time." };
  G.gun = GUNS[localStorage.gallery_gun] ? localStorage.gallery_gun : "two";
  G.gunHand = "right";
  G.gunPicked = true;
  const gunLight = new SpotLight(16769208, 18, 6, 0.6, 0.7, 1.5);
  gunLight.position.set(0, 3, 3.9);
  scene.add(gunLight, gunLight.target);
  const gunWalnut = pbr("wood_floor", { repeat: [0.4, 0.4], color: 12614212, physical: true, clearcoat: 1 });
  const gunBlued = new MeshPhysicalMaterial({ color: 1909289, metalness: 1, roughness: 0.22, roughnessMap: scuffTex, clearcoat: 0.6 });
  const gunCorkMat = new MeshStandardMaterial({ color: 12093274, roughness: 0.95 });
  function makePistol() {
    const g = new Group(), body = new Group();
    g.add(body);
    scene.add(g);
    body.scale.setScalar(1.35);
    const part = (geo, mat, x, y, z) => {
      const m = new Mesh(geo, mat);
      m.position.set(x, y, z);
      m.castShadow = true;
      body.add(m);
      return m;
    };
    part(new BoxGeometry(0.032, 0.03, 0.19), gunBlued, 0, 0.032, 0.07);
    for (let i = 0; i < 5; i++) part(new BoxGeometry(0.034, 0.022, 3e-3), ironMat, 0, 0.032, -0.012 + i * 8e-3);
    const bar = part(new CylinderGeometry(0.011, 0.012, 0.06, 20), gunBlued, 0, 0.03, 0.185);
    bar.rotation.x = Math.PI / 2;
    part(new BoxGeometry(0.03, 0.022, 0.15), brass, 0, 6e-3, 0.055);
    const grip = part(new BoxGeometry(0.03, 0.105, 0.046), brass, 0, -0.05, -8e-3);
    grip.rotation.x = -0.28;
    for (const sx of [-1, 1]) {
      const pnl = part(new BoxGeometry(4e-3, 0.085, 0.036), gunWalnut, sx * 0.017, -0.052, -0.01);
      pnl.rotation.x = -0.28;
    }
    const guard = part(new TorusGeometry(0.02, 35e-4, 8, 24, Math.PI), brass, 0, -6e-3, 0.05);
    guard.rotation.set(0, Math.PI / 2, Math.PI);
    const trig = part(new BoxGeometry(5e-3, 0.02, 5e-3), gunBlued, 0, -0.012, 0.045);
    trig.rotation.x = 0.3;
    part(new BoxGeometry(4e-3, 0.01, 8e-3), brass, 0, 0.051, 0.155);
    part(new BoxGeometry(0.02, 9e-3, 6e-3), gunBlued, 0, 0.05, -0.015);
    part(new TorusGeometry(0.0125, 35e-4, 10, 24), brass, 0, 0.03, 0.215);
    const cork = part(new CylinderGeometry(0.012, 0.0105, 0.024, 16), gunCorkMat, 0, 0.03, 0.222);
    cork.rotation.x = Math.PI / 2;
    return { g, body, cork, recoil: 0, gripR: new Vector3(4e-3, -0.045, -0.012), gripL: new Vector3(-0.022, -0.055, 0.012), muzzle: new Vector3(0, 0.03, 0.23) };
  }
  const PISTOLS = { right: makePistol(), left: makePistol() };
  const heldGun = () => G.gun !== "grip" && G.aim && G.aim.merged && G.state === "play" && G.phase !== "ready" ? "grip" : G.gun;
  const pistolFor = (side) => heldGun() === "two" ? PISTOLS[side] : heldGun() === "one" ? PISTOLS[G.gunHand] : PISTOLS.right;
  const aimLines = {};
  for (const s of ["right", "left"]) {
    const m = new Mesh(new CylinderGeometry(4e-3, 4e-3, 1, 6, 1, true), new MeshBasicMaterial({ color: 16769696, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false }));
    scene.add(m);
    aimLines[s] = m;
  }
  const pose = { lean: 0, tilt: 0, headX: 0, headY: 0, twist: 0 };
  function readPose(dt) {
    const J = BP.joints, k = 1 - Math.exp(-dt * 8);
    let lean = 0, tilt = 0, hx = 0, hy = 0;
    if (BP.live && J && J.lShoulder && J.rShoulder && J.root) {
      let r = [J.rShoulder[0] - J.lShoulder[0], 0, J.rShoulder[2] - J.lShoulder[2]];
      const n = Math.hypot(r[0], r[2]) || 1;
      r = r.map((c) => c / n);
      const sw = Math.hypot(J.rShoulder[0] - J.lShoulder[0], J.rShoulder[2] - J.lShoulder[2]) || 0.3;
      tilt = clamp(Math.atan2(J.rShoulder[1] - J.lShoulder[1], sw), -0.5, 0.5);
      lean = clamp(BP.body.lean, -1, 1) * 0.25;
      if (J.head) {
        const mid = [(J.lShoulder[0] + J.rShoulder[0]) / 2, (J.lShoulder[1] + J.rShoulder[1]) / 2, (J.lShoulder[2] + J.rShoulder[2]) / 2];
        hx = clamp(((J.head[0] - mid[0]) * r[0] + (J.head[2] - mid[2]) * r[2]) * 0.8, -0.08, 0.08);
        hy = clamp(J.head[1] - mid[1] - 0.15, -0.1, 0.06);
      }
    }
    pose.lean += (lean - pose.lean) * k;
    pose.tilt += (tilt - pose.tilt) * k;
    pose.headX += (hx - pose.headX) * k;
    pose.headY += (hy - pose.headY) * k;
  }
  const aimPt = { right: new Vector3(0.3, 1.6, -0.6), left: new Vector3(-0.3, 1.6, -0.6) };
  function reticleWorld(r, out) {
    const nd = _v.set(r.x / W * 2 - 1, -(r.y / H) * 2 + 1, 0.5).unproject(camera), cp = camera.position;
    const dir = nd.sub(cp).normalize();
    return out.copy(cp).addScaledVector(dir, (cp.z + 0.3) / -dir.z);
  }
  const TORSO = 0.42, ARM_U = 0.32, ARM_F = 0.29;
  function updateAvatar(dt, t) {
    readPose(dt);
    const show = G.state === "play" || G.state === "title";
    avatar.visible = show;
    ghostMat.uniforms.uT.value = t;
    ghostMat.uniforms.uA.value = lerp(ghostMat.uniforms.uA.value, G.state === "play" ? 1 : 0.7, 1 - Math.exp(-dt * 4));
    for (const s of ["right", "left"]) {
      PISTOLS[s].g.visible = false;
      if (!show) aimLines[s].material.opacity = 0;
    }
    if (!show) return;
    const base = _v3.set(eye.x * (1 - (EYE0.z - 3.2) / (EYE0.z - WZ)), 0.8 - G.peek.y * 0.62, 3.2);
    const realOn = youReal && youReal.real && youReal.opacity > 0.05 && youReal.person;
    if (youReal) {
      youReal.setSpot(base.x, 3.2);
      youReal.enabled = show;
    }
    if (realOn) {
      const P0 = youReal.person, a = P0.world("upperarm_l"), b = P0.world("upperarm_r");
      base.y = (a.y + b.y) / 2 - TORSO;
    }
    const mode = heldGun(), aiming = { right: false, left: false };
    for (const s of ["right", "left"]) {
      const r = RETS[s];
      if (G.state === "title") {
        const used = mode === "two" || s === "right";
        if (used) {
          aiming[s] = true;
          aimPt[s].set(Math.sin(t * 0.7 + (s === "left" ? 2 : 0)) * 1.6, 1.7 + Math.sin(t * 1.1 + (s === "left" ? 1 : 0)) * 0.35, -0.6);
        }
      } else if (G.phase === "ready") {
        if (mode === "two" || (mode === "grip" ? s === "right" : s === G.gunHand)) {
          aiming[s] = true;
          aimPt[s].set(s === "left" && mode === "two" ? -0.25 : mode === "two" ? 0.25 : 0, 1.55, -0.6);
        }
      } else if (r.active && r.a > 0.2) {
        aiming[s] = true;
        reticleWorld(r, aimPt[s]);
      }
    }
    const tgt = mode === "grip" ? aimPt.right : mode === "one" ? aimPt[G.gunHand] : aiming.right && aiming.left ? _v.addVectors(aimPt.right, aimPt.left).multiplyScalar(0.5) : aiming.left ? aimPt.left : aimPt.right;
    const yaw = aiming.right || aiming.left ? clamp(Math.atan2(tgt.x - base.x, base.z - tgt.z), -0.6, 0.6) * 0.45 : 0;
    pose.yaw = (pose.yaw || 0) + (yaw - (pose.yaw || 0)) * (1 - Math.exp(-dt * 12));
    const up = new Vector3(Math.sin(pose.lean + pose.tilt * 0.3), Math.cos(pose.lean), 0).normalize();
    const pelvis = base.clone(), chestTop = pelvis.clone().addScaledVector(up, TORSO);
    const sideV = new Vector3(Math.cos(pose.tilt * 0.6) * Math.cos(pose.yaw), Math.sin(pose.tilt * 0.6), Math.sin(pose.yaw));
    const SH = { right: chestTop.clone().addScaledVector(sideV, 0.2), left: chestTop.clone().addScaledVector(sideV, -0.2) };
    const neckTop = chestTop.clone().addScaledVector(up, 0.12);
    AV.pelvis.position.copy(pelvis);
    AV.chest.position.copy(pelvis).addScaledVector(up, -0.04);
    AV.chest.quaternion.setFromUnitVectors(_v2.set(0, 1, 0), up);
    AV.chest.rotateY(-pose.yaw);
    stretch(AV.neck, chestTop, neckTop, 0.045);
    AV.head.position.copy(neckTop).add(_v2.set(pose.headX, 0.09 + pose.headY, 0));
    AV.sh.right.position.copy(SH.right);
    AV.sh.left.position.copy(SH.left);
    const hands = {};
    const hold = (P, from, at, reach) => {
      P.recoil = Math.max(0, P.recoil - dt * 7);
      P.g.visible = true;
      const dir = _v2.subVectors(at, from).normalize();
      P.g.position.copy(from).addScaledVector(dir, reach - P.recoil * 0.05);
      P.g.lookAt(at);
      P.body.position.set(0, P.recoil * 0.012, -P.recoil * 0.03);
      P.body.rotation.x = -P.recoil * 0.35;
      P.cork.visible = G.ammo > 0 && P.recoil < 0.35;
      P.g.updateMatrixWorld(true);
    };
    const lower = (P, s) => {
      P.recoil = 0;
      P.g.visible = true;
      const sx = s === "right" ? 1 : -1;
      P.g.position.copy(SH[s]).add(_v2.set(sx * 0.07, -0.5, -0.08));
      P.g.lookAt(_v3.copy(P.g.position).add(_v2.set(sx * 0.05, -0.7, -0.6)));
      P.body.position.set(0, 0, 0);
      P.body.rotation.x = 0;
      P.cork.visible = G.ammo > 0;
      P.g.updateMatrixWorld(true);
    };
    const handOn = (P, k) => P.body.localToWorld(P[k].clone());
    if (mode === "grip") {
      const P = PISTOLS.right;
      if (aiming.right) hold(P, chestTop.clone().add(_v2.set(0, -0.07, 0)), aimPt.right, realOn ? 0.55 : 0.47);
      else lower(P, "right");
      hands.right = handOn(P, "gripR");
      hands.left = aiming.right ? handOn(P, "gripL") : SH.left.clone().add(_v2.set(-0.05, -0.52, -0.04));
    } else {
      for (const s of ["right", "left"]) {
        const P = PISTOLS[s], has = mode === "two" || s === G.gunHand;
        if (!has) {
          hands[s] = SH[s].clone().add(_v2.set(s === "right" ? 0.05 : -0.05, -0.52, -0.04));
          continue;
        }
        if (aiming[s]) hold(P, SH[s].clone().add(_v2.set(0, -0.03, 0)), aimPt[s], realOn ? 0.58 : 0.5);
        else lower(P, s);
        hands[s] = handOn(P, "gripR");
      }
    }
    for (const s of ["right", "left"]) {
      const P = s === "right" || mode === "two" || mode === "grip" ? pistolFor(s) : null, has = mode === "grip" ? aiming.right : mode === "two" || s === G.gunHand;
      realGrips[s === "right" ? "r" : "l"] = has && P && P.g.visible ? { p: hands[s].clone() } : null;
    }
    for (const k in AV) {
      const v = AV[k];
      const hide = (m) => {
        m.visible = !realOn && m !== AV.pelvis;
      };
      if (v.isMesh) hide(v);
      else for (const q of Object.values(v)) Array.isArray(q) ? q.forEach(hide) : hide(q);
    }
    for (const s of ["right", "left"]) {
      const [ua, fa, hd] = AV.arm[s];
      const el = elbowOf(SH[s], hands[s], ARM_U, ARM_F, new Vector3(s === "right" ? 0.9 : -0.9, -0.8, 0.2));
      stretch(ua, SH[s], el, 0.062);
      stretch(fa, el, hands[s], 0.05);
      hd.position.copy(hands[s]);
      const L = aimLines[s], r = RETS[s], lf = G.state === "play" && aiming[s] ? r.lockFrac || 0 : 0;
      L.material.opacity = lerp(L.material.opacity, lf > 0 ? 0.12 + 0.5 * lf : 0, 1 - Math.exp(-dt * 12));
      if (L.material.opacity > 0.01) stretch(L, pistolFor(s).body.localToWorld(pistolFor(s).muzzle.clone()), aimPt[s], 0);
    }
    const gp = (aiming.left && !aiming.right && mode === "two" ? PISTOLS.left : pistolFor("right")).g.position;
    gunLight.target.position.copy(gp);
    gunLight.position.set(gp.x + 0.4, 2.9, 3.9);
  }
  function muzzleWorld(side = "right") {
    const P = pistolFor(side);
    return P.body.localToWorld(P.muzzle.clone());
  }
  const corks = [];
  const corkGeo = new CylinderGeometry(0.03, 0.024, 0.06, 14);
  corkGeo.rotateX(Math.PI / 2);
  const corkMat = new MeshStandardMaterial({ color: 12093274, roughness: 0.95 });
  for (let i = 0; i < 16; i++) {
    const m = new Mesh(corkGeo, corkMat);
    m.visible = false;
    scene.add(m);
    corks.push({ m, active: false });
  }
  const RETS = G._rets = { right: { side: "right", x: 0.5, y: 0.5, sx: 0, sy: 0, a: 0, lock: null, lt: 0, cool: 0, pulse: 0, init: false }, left: { side: "left", x: 0.5, y: 0.5, sx: 0, sy: 0, a: 0, lock: null, lt: 0, cool: 0, pulse: 0, init: false } };
  const COLS = Object.assign({ right: "#66e0ff", left: "#ff7ad9" }, BP.handColor || {});
  BP.pointerFor = (side) => {
    const r = RETS[side];
    return G.state === "play" && G.phase !== "ready" && r.active && r.a > 0.2 && W ? { x: r.x / W, y: r.y / H } : null;
  };
  const tmpC = new Vector3(), tmpCam = new Vector3();
  function projectTargets() {
    const list = [];
    camera.updateMatrixWorld();
    const tanV = camera.projectionMatrix.elements[5];
    for (const t of targets) {
      if (!t.hittable()) continue;
      t.center(tmpC);
      tmpCam.copy(tmpC).applyMatrix4(camera.matrixWorldInverse);
      const depth = -tmpCam.z;
      if (depth < 0.3) continue;
      _v2.copy(tmpC).project(camera);
      if (_v2.x < -1.02 || _v2.x > 1.02 || _v2.y < -1.02 || _v2.y > 1.02) continue;
      if (occluded(tmpC, t.radius * 0.5)) continue;
      const sx = (_v2.x + 1) / 2 * W, sy = (1 - _v2.y) / 2 * H, r = t.radius * tanV / depth * H / 2;
      list.push({ t, x: sx, y: sy, r, decoy: t.decoyFn ? t.decoyFn() : false });
    }
    G.targets = list.map((o) => ({ x: o.x / W, y: o.y / H, r: o.r / W, kind: o.t.kind, id: o.t.id, decoy: o.decoy, secret: !!o.t.secret }));
    return list;
  }
  const ray = new Raycaster();
  function occluded(p, rr) {
    const camPos2 = camera.getWorldPosition(_v3);
    const dir = _v.copy(p).sub(camPos2);
    const dist = dir.length();
    dir.normalize();
    ray.set(camPos2, dir);
    ray.far = dist - rr;
    return ray.intersectObjects(occluders, false).length > 0;
  }
  function hitRadius(o) {
    if (o.exact) return o.r;
    return Math.max(o.r * 1.12, W * (G.phase === "practice" ? 0.05 : G.hardcore ? 0.034 : 0.046));
  }
  function under(r, list) {
    let best = null, bd = 1e9;
    for (const o of list) {
      const dx = r.x - o.x, dy = (r.y - o.y) / (o.exact ? 1 : 1.3), d = Math.hypot(dx, dy), hr = hitRadius(o);
      if (d < hr && d / hr < bd) {
        bd = d / hr;
        best = o;
      }
    }
    return best;
  }
  const AIM = {
    RX: 0.4,
    RY: 0.3,
    CX: 0.5,
    CY: 0.42,
    SX: 0.5,
    SY: 0.34,
    DZ: 0.012,
    JOIN: 0.55,
    UP: 0.62,
    DOWN: 0.82,
    // CLASPED HANDS (Matt 10/26: "it's really hard to shoot with 2 hands... it doesn't want to follow both hands, it
    // distorts"): with the two-pistol or one-hand gun picked, hands held together used to drive two crosshairs from two
    // separate dead centres (each hand's own, +-0.3 apart), so the joined hands split them apart and the drawn arms
    // crossed reaching for two pistols. Now hands held together ARE the two-handed grip in every gun mode: one pistol,
    // one crosshair at the midpoint of both wrists. In: closer than J2_IN for J_ENTER s; out: wider than J2_OUT for J_LEAVE s
    // (from his 10/20 play: clasped hands sit 0.1-0.4 torso lengths apart, two separate pistols 0.6 and up).
    J2_IN: 0.42,
    J2_OUT: 0.62,
    J_ENTER: 0.12,
    J_LEAVE: 0.22,
    VIS_LOW: 0.35,
    VIS_OK: 0.5
  };
  const DEFC = { grip: { x: 0, y: 0.13 }, right: { x: 0.3, y: 0.13 }, left: { x: -0.3, y: 0.13 } };
  class Euro1 {
    // One Euro filter, for the aim point (units: torso lengths)
    constructor(minCut, beta) {
      this.mc = minCut;
      this.b = beta;
      this.x = null;
      this.dx = 0;
    }
    static a(c, dt) {
      const tau = 1 / (2 * Math.PI * c);
      return 1 / (1 + tau / dt);
    }
    f(v, dt) {
      if (this.x === null) {
        this.x = v;
        return v;
      }
      const d = (v - this.x) / dt;
      this.dx += Euro1.a(1, dt) * (d - this.dx);
      this.x += Euro1.a(this.mc + this.b * Math.abs(this.dx), dt) * (v - this.x);
      return this.x;
    }
  }
  const EURO = { min: 1.6, beta: 3 };
  const newAim = (def) => ({ fx: new Euro1(EURO.min, EURO.beta), fy: new Euro1(EURO.min, EURO.beta), hx: 0, hy: 0, up: false, at: 0, x: AIM.CX, y: AIM.CY, c: null, def, raw: null, speed: 0 });
  const AIMS = G.aims = { grip: newAim(DEFC.grip), right: newAim(DEFC.right), left: newAim(DEFC.left) };
  const aim = G.aim = { T: 0, joined: false, hold: 0, buf: [], readyT: 0 };
  function readHands(dt) {
    var _a, _b;
    const I = BP.img, now = performance.now();
    let rel = null;
    if (now - (BP.imgAt || 0) < 700 && I.lShoulder && I.rShoulder && I.lHip && I.rHip && I.lHand && I.rHand) {
      const cx = (I.lShoulder[0] + I.rShoulder[0]) / 2, cy = (I.lShoulder[1] + I.rShoulder[1]) / 2, hx = (I.lHip[0] + I.rHip[0]) / 2, hy = (I.lHip[1] + I.rHip[1]) / 2;
      rel = { T: Math.max(0.05, Math.hypot(cx - hx, cy - hy)), l: [-(I.lHand[0] - cx), I.lHand[1] - cy], r: [-(I.rHand[0] - cx), I.rHand[1] - cy] };
    } else {
      const J = BP.joints;
      if (J && J.lShoulder && J.rShoulder && J.root && J.lHand && J.rHand) {
        const ch = J.lShoulder.map((c, i) => (c + J.rShoulder[i]) / 2);
        let rx = J.rShoulder[0] - J.lShoulder[0], rz = J.rShoulder[2] - J.lShoulder[2];
        const n = Math.hypot(rx, rz) || 1;
        rx /= n;
        rz /= n;
        const p = (h) => [(h[0] - ch[0]) * rx + (h[2] - ch[2]) * rz, ch[1] - h[1]];
        rel = { T: Math.max(0.25, ch[1] - J.root[1]), l: p(J.lHand), r: p(J.rHand) };
      }
    }
    if (!rel) return null;
    aim.T = aim.T ? aim.T + (rel.T - aim.T) * (1 - Math.exp(-dt / 0.8)) : rel.T;
    const T = aim.T, L = [rel.l[0] / T, rel.l[1] / T], Rr = [rel.r[0] / T, rel.r[1] / T];
    const v = BP.vis || {}, vl = (_a = v.lHand) != null ? _a : 1, vr = (_b = v.rHand) != null ? _b : 1, gap = Math.hypot(L[0] - Rr[0], L[1] - Rr[1]);
    const grip = G.gun === "grip", IN = grip ? AIM.JOIN : AIM.J2_IN, OUT = grip ? AIM.JOIN + 0.15 : AIM.J2_OUT;
    const oneLost = vl < AIM.VIS_LOW !== vr < AIM.VIS_LOW;
    aim.lostT = oneLost ? (aim.lostT || 0) + dt : 0;
    const want = aim.joined ? gap < OUT || oneLost && aim.lostT < 0.8 : gap < IN;
    aim.jt = want !== aim.joined ? (aim.jt || 0) + dt : 0;
    if (aim.jt >= (aim.joined ? AIM.J_LEAVE : AIM.J_ENTER)) {
      aim.joined = want;
      aim.jt = 0;
    }
    let mid = [(L[0] + Rr[0]) / 2, (L[1] + Rr[1]) / 2];
    if (vl >= AIM.VIS_OK && vr >= AIM.VIS_OK) aim.off = { l: [mid[0] - L[0], mid[1] - L[1]], r: [mid[0] - Rr[0], mid[1] - Rr[1]] };
    else if (aim.joined && oneLost && aim.off) {
      const [h, o] = vl < AIM.VIS_LOW ? [Rr, aim.off.r] : [L, aim.off.l];
      mid = [h[0] + o[0], h[1] + o[1]];
    }
    return { left: L, right: Rr, joined: aim.joined, mid };
  }
  function track(A, p, dt, now) {
    if (!p) {
      A.up = false;
      A.raw = null;
      return;
    }
    if (now - A.at > 400) {
      A.fx.x = null;
      A.fy.x = null;
      A.hx = p[0];
      A.hy = p[1];
    }
    A.at = now;
    const fx = A.fx.f(p[0], dt), fy = A.fy.f(p[1], dt);
    const ddx = fx - A.hx, ddy = fy - A.hy, dd = Math.hypot(ddx, ddy);
    if (dd > AIM.DZ) {
      const k = (dd - AIM.DZ) / dd;
      A.hx += ddx * k;
      A.hy += ddy * k;
    }
    A.raw = p;
    A.speed = Math.hypot(A.fx.dx, A.fy.dx);
    A.up = A.up ? fy < AIM.DOWN : fy < AIM.UP;
    const c = A.c || A.def;
    A.x = clamp(AIM.CX + (A.hx - c.x) / (A.rx || AIM.RX) * AIM.SX, 0.015, 0.985);
    A.y = clamp(AIM.CY + (A.hy - c.y) / (A.ry || AIM.RY) * AIM.SY, 0.03, 0.95);
  }
  function updatePistolAim(dt) {
    const now = performance.now(), out = { right: null, left: null }, mode = G.gun;
    if (BP.mouse || BP.simulating || !BP.live) {
      const R_ = BP.hands.right, L_ = BP.hands.left;
      if (R_.seen || BP.mouse || BP.simulating) out[mode === "one" ? G.gunHand : "right"] = { x: R_.x, y: R_.y };
      if (mode === "two" && BP.simulating && L_.seen !== false) out.left = { x: L_.x, y: L_.y };
      return out;
    }
    const h = BP.present === false ? null : readHands(dt);
    if (mode === "grip") {
      let p = null;
      if (h) {
        if (h.joined) p = h.mid;
        else {
          const lu = h.left[1] < AIM.UP, ru = h.right[1] < AIM.UP;
          if (lu !== ru) p = lu ? h.left : h.right;
        }
      }
      track(AIMS.grip, p, dt, now);
      if (AIMS.grip.up) out.right = AIMS.grip;
      return out;
    }
    track(AIMS.right, h && h.right, dt, now);
    track(AIMS.left, h && h.left, dt, now);
    const merged = !!(h && h.joined);
    if (merged !== aim.merged) {
      aim.merged = merged;
      RETS.right.blendT = 0.2;
    }
    if (merged) {
      const G_ = AIMS.grip, a = AIMS.right, b = AIMS.left, ca = a.c || a.def, cb = b.c || b.def;
      G_.c = { x: (ca.x + cb.x) / 2, y: (ca.y + cb.y) / 2 };
      G_.rx = ((a.rx || AIM.RX) + (b.rx || AIM.RX)) / 2;
      G_.ry = ((a.ry || AIM.RY) + (b.ry || AIM.RY)) / 2;
      track(G_, h.mid, dt, now);
      if (G_.up) out.right = G_;
      return out;
    }
    track(AIMS.grip, null, dt, now);
    if (mode === "two") {
      for (const s of ["right", "left"]) if (AIMS[s].up) out[s] = AIMS[s];
      return out;
    }
    const g = G.gunHand, o = g === "right" ? "left" : "right";
    if (!AIMS[g].up && AIMS[o].up) {
      G.gunHand = o;
      G.switchedAt = now;
    }
    if (AIMS[G.gunHand].up) out[G.gunHand] = AIMS[G.gunHand];
    return out;
  }
  const READY_HOLD = 1, READY_MAX = 5;
  const READY_SAY = { two: "Point both pistols straight at the camera", grip: "Both hands together, aim straight at the camera", one: "Point your pistol hand straight at the camera" };
  function updateReady(dt, now) {
    if (G.phase !== "ready") return;
    G.startedAt = now;
    aim.readyT = (now - (aim.readyAt || now)) / 1e3;
    if (PRAC_TEST && aim.readyT > 1.2) {
      startPractice(now);
      return;
    }
    if (!PRAC_TEST && (!BP.live && aim.readyT > 1.5 || BP.mouse || BP.simulating)) {
      G.phase = null;
      G.startedAt = now;
      return;
    }
    const ok = (A, joined) => A.raw && A.up && A.speed < 0.6 && (joined === void 0 || joined) && Math.abs(A.raw[0]) < 0.7 && A.raw[1] > -0.4 && A.raw[1] < 0.45;
    let use = null;
    if (G.gun === "grip") use = ok(AIMS.grip, aim.joined) ? ["grip"] : null;
    else if (aim.merged) use = ok(AIMS.grip) ? ["grip"] : null;
    else if (G.gun === "two") use = ok(AIMS.right) && ok(AIMS.left) ? ["right", "left"] : null;
    else use = ok(AIMS[G.gunHand]) ? [G.gunHand] : null;
    if (use) {
      aim.hold += dt;
      aim.buf.push(use.map((k) => [k, AIMS[k].raw[0], AIMS[k].raw[1]]));
      if (aim.buf.length > 40) aim.buf.shift();
    } else {
      aim.hold = Math.max(0, aim.hold - dt * 1.5);
      if (!aim.hold) aim.buf.length = 0;
    }
    G.readyFrac = clamp(aim.hold / READY_HOLD, 0, 1);
    if (aim.hold >= READY_HOLD && aim.buf.length >= 3) {
      const keys2 = aim.buf[aim.buf.length - 1].map((e) => e[0]);
      for (const k of keys2) {
        const pts = aim.buf.flatMap((f) => f.filter((e) => e[0] === k));
        const c = { x: pts.reduce((a, e) => a + e[1], 0) / pts.length, y: pts.reduce((a, e) => a + e[2], 0) / pts.length };
        AIMS[k].c = c;
        AIMS[k].hx = c.x;
        AIMS[k].hy = c.y;
        if (k !== "grip" && G.gun === "one") {
          const o = k === "right" ? "left" : "right";
          AIMS[o].c = { x: -c.x, y: c.y };
        }
        if (k === "grip" && G.gun !== "grip") for (const s of ["right", "left"]) {
          const d = DEFC[s].x - DEFC.grip.x;
          AIMS[s].c = { x: c.x + d, y: c.y };
          AIMS[s].hx = c.x + d;
          AIMS[s].hy = c.y;
        }
      }
      afterReady(now);
    } else if (aim.readyT > READY_MAX) afterReady(now);
  }
  const PRAC_TEST = Q.has("practice");
  const PRAC = [[0.3, 0.5], [0.7, 0.5], [0.5, 0.33], [0.5, 0.67]], PRAC_WAIT = 6;
  const prac = { i: 0, t: 0, pts: [], pop: 0, obj: null };
  function startPractice(now) {
    G.phase = "practice";
    prac.i = 0;
    prac.t = 0;
    prac.pts = [];
    prac.pop = 0;
    G.pracDone = 0;
    G.startedAt = now;
    for (const s of ["right", "left"]) {
      RETS[s].lock = null;
      RETS[s].lt = 0;
    }
  }
  function pracTarget() {
    if (G.phase !== "practice" || prac.i >= PRAC.length) return null;
    const [x, y] = PRAC[prac.i];
    if (!prac.obj || prac.obj.i !== prac.i) {
      const t = {
        id: "prac" + prac.i,
        kind: "practice",
        hittable: () => G.phase === "practice" && prac.obj && prac.obj.t === t && !t.done,
        center: (out) => reticleWorld({ x: prac.obj.x, y: prac.obj.y }, out),
        hit: () => {
          if (t.done) return;
          t.done = true;
          pracNext(true);
        }
      };
      prac.obj = { i: prac.i, t, decoy: false };
    }
    const r = pracR(), lab = pracLabel(), top = lab.y + lab.h + r + S * 0.03;
    Object.assign(prac.obj, { x: x * W, y: Math.max(y * H, top), r });
    return prac.obj;
  }
  function pracShot(side) {
    if (G.gun !== "grip" && aim.merged) return;
    const k = G.gun === "grip" ? "grip" : side, A = AIMS[k];
    if (BP.live && !BP.mouse && !BP.simulating && A.raw) prac.pts.push({ k, hx: A.hx, hy: A.hy, tx: prac.obj.x / W, ty: prac.obj.y / H });
  }
  function pracNext(hit) {
    if (hit) {
      sfx.ding(1.2);
      G.pracDone++;
      prac.pop = 1;
      const c = reticleWorld({ x: prac.obj.x, y: prac.obj.y }, new Vector3());
      hitFx(c, [1, 0.85, 0.4], 16765562, 0.7);
    }
    prac.i++;
    prac.t = 0;
    if (prac.i >= PRAC.length) {
      pracTune();
      G.calibrated = G.gun;
      goNow(performance.now());
    }
  }
  function pracTune() {
    for (const k of ["grip", "right", "left"]) {
      const P = prac.pts.filter((p) => p.k === k);
      if (!P.length) continue;
      const A = AIMS[k], c = A.c || { ...A.def };
      A.rx = A.rx || AIM.RX;
      A.ry = A.ry || AIM.RY;
      for (const ax of ["x", "y"]) {
        const R0 = ax === "x" ? A.rx : A.ry, C0 = ax === "x" ? AIM.CX : AIM.CY, S0 = ax === "x" ? AIM.SX : AIM.SY;
        const pts = P.map((p) => ({ t: (ax === "x" ? p.tx : p.ty) - C0, h: ax === "x" ? p.hx : p.hy }));
        const mt = pts.reduce((a, p) => a + p.t, 0) / pts.length, mh = pts.reduce((a, p) => a + p.h, 0) / pts.length;
        const stt = pts.reduce((a, p) => a + (p.t - mt) ** 2, 0), sth = pts.reduce((a, p) => a + (p.t - mt) * (p.h - mh), 0);
        let R1 = R0;
        if (pts.length >= 2 && stt > 0.05) {
          const slope = sth / stt;
          if (slope > 0) R1 = clamp(slope * S0, R0 * 0.75, R0 * 1.3);
        }
        const c1 = mh - mt * R1 / S0;
        const R2 = R0 + (R1 - R0) * 0.5, c2 = c[ax] + clamp(c1 - c[ax], -0.25, 0.25) * 0.5;
        if (ax === "x") {
          A.rx = R2;
          c.x = c2;
        } else {
          A.ry = R2;
          c.y = c2;
        }
      }
      A.c = c;
      if (G.gun === "one" && k !== "grip" && !prac.pts.some((p) => p.k !== k)) {
        const o = k === "right" ? "left" : "right";
        AIMS[o].c = { x: -c.x, y: c.y };
        AIMS[o].rx = A.rx;
        AIMS[o].ry = A.ry;
      }
    }
    G.tune = Object.fromEntries(["grip", "right", "left"].map((k) => [k, { c: AIMS[k].c, rx: AIMS[k].rx || AIM.RX, ry: AIMS[k].ry || AIM.RY }]));
  }
  function updatePractice(dt) {
    if (G.phase !== "practice") return;
    G.startedAt = performance.now();
    if (!PRAC_TEST && (BP.mouse || BP.simulating || !BP.live)) {
      G.phase = null;
      return;
    }
    prac.t += dt;
    prac.pop = Math.max(0, prac.pop - dt * 3);
    if (prac.t > PRAC_WAIT) pracNext(false);
  }
  const pracR = () => clamp(S * 0.12, 44, 150);
  function pracLabel() {
    const fs = clamp(S * 0.06, 24, 64), sub = clamp(S * 0.034, 15, 36), w = Math.min(W * 0.9, Math.max(fs * 6.2, sub * 13)), h = fs * 1.15 + sub * 1.5, x = W / 2 - w / 2;
    let y = Math.max(8, S * 0.02);
    for (const id of ["bp-pause", "bp-home", "bp-menu", "bp-music", "bp-cam"]) {
      const e = document.getElementById(id);
      if (!e) continue;
      const r = e.getBoundingClientRect();
      if (!r.width || !r.height || getComputedStyle(e).display === "none" || getComputedStyle(e).visibility === "hidden") continue;
      if (r.right > x - 6 && r.left < x + w + 6 && r.top < y + h) y = Math.max(y, r.bottom + Math.max(8, S * 0.015));
    }
    const sb = marqRect();
    if (sb && sb.r > x && sb.l < x + w && sb.t < y + h && sb.b + h < H * 0.6) y = Math.max(y, sb.b + Math.max(6, S * 0.012));
    const now = performance.now();
    if (!pracLab.t || now - pracLab.t > 400) pracLab.y = y;
    else pracLab.y += (y - pracLab.y) * (1 - Math.exp(-(now - pracLab.t) / 90));
    pracLab.t = now;
    y = pracLab.y;
    return { x, y, w, h, fs, sub };
  }
  const pracLab = { y: 0, t: 0 };
  function marqRect() {
    let l = 1e9, r = -1e9, t = 1e9, b = -1e9;
    for (const sx of [-2.3, 2.3]) for (const sy of [3.75 - 0.56, 3.75 + 0.56]) {
      const p = screenOf(_v3m.set(sx, sy, -2.2));
      l = Math.min(l, p.x);
      r = Math.max(r, p.x);
      t = Math.min(t, p.y);
      b = Math.max(b, p.y);
    }
    return isFinite(b) ? { l, r, t, b } : null;
  }
  const _v3m = new Vector3();
  function drawPractice(now) {
    const o = pracTarget();
    if (!o) return;
    const pulse = 1 + 0.05 * Math.sin(now / 180), r = o.r * pulse, appear = clamp(prac.t / 0.25, 0, 1), rr = r * (0.6 + 0.4 * appear);
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.beginPath();
    ctx.arc(o.x, o.y, rr * 1.22, 0, 7);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,236,170,".concat(0.5 + 0.4 * Math.sin(now / 180), ")");
    ctx.lineWidth = Math.max(3, S * 6e-3);
    ctx.beginPath();
    ctx.arc(o.x, o.y, rr * (1.32 + 0.1 * (now / 900 % 1)), 0, 7);
    ctx.stroke();
    ctx.shadowColor = "#ffb030";
    ctx.shadowBlur = S * 0.04;
    [["#ffffff", 1], ["#e01b24", 0.84], ["#ffffff", 0.64], ["#e01b24", 0.44], ["#ffd23f", 0.22]].forEach(([c, k], i) => {
      if (i === 1) ctx.shadowBlur = 0;
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(o.x, o.y, rr * k, 0, 7);
      ctx.fill();
    });
    ctx.restore();
    const L = pracLabel(), n = PRAC.length;
    ctx.save();
    ctx.fillStyle = "rgba(22,8,6,0.72)";
    ctx.strokeStyle = "rgba(255,214,140,0.45)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(L.x, L.y, L.w, L.h, Math.min(L.h / 2, S * 0.03));
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    txt("PRACTICE", W / 2, L.y + L.fs * 0.68, L.fs, "#ffe6a0", "center", 900, "#ff7a00", SERIF, L.w * 0.9);
    txt("Hold your aim on the target  ·  ".concat(Math.min(n, prac.i + 1), " of ").concat(n), W / 2, L.y + L.fs * 1.15 + L.sub * 0.72, L.sub, "#fff", "center", 800, null, void 0, L.w * 0.92);
    G._pracRects = { label: { x: L.x, y: L.y, w: L.w, h: L.h }, target: { x: o.x - r * 1.42, y: o.y - r * 1.42, w: r * 2.84, h: r * 2.84 } };
  }
  function drawCalm() {
  }
  function afterReady(now) {
    if (G.calibrated === G.gun) goNow(now);
    else startPractice(now);
  }
  function goNow(now) {
    if (G.gun === "one") G.switchedAt = now;
    G.phase = null;
    G.startedAt = now;
    G.banner = { t: 0, text: "GO!", sub: "", short: true };
    sfx.reload();
  }
  function updateAim(dt, now, list) {
    const live = updatePistolAim(dt);
    if (G.phase === "practice") {
      const o = pracTarget();
      list = o ? [o] : [];
    }
    const assist = (G.hardcore ? 0.25 : 0.45) + 0.25 * G.struggle;
    const lockTime = G.phase === "practice" ? 0.12 : (G.hardcore ? 0.17 : 0.12) - 0.03 * G.struggle;
    const anyActive = !!(live.right || live.left) && G.state === "play";
    G.noAim = G.state === "play" && G.phase !== "ready" && BP.live && !BP.mouse && !BP.simulating && !anyActive ? (G.noAim || 0) + dt : 0;
    G.aimer = live.right ? "right" : live.left ? "left" : null;
    for (const side of ["right", "left"]) {
      const r = RETS[side], p = live[side], active = !!p && G.state === "play";
      r.a = lerp(r.a, active ? 1 : 0, 1 - Math.exp(-dt * 14));
      r.active = active;
      if (!p) {
        r.lock = null;
        r.lt = 0;
        r.lockFrac = 0;
        r.init = false;
        continue;
      }
      const hx = p.x * W, hy = p.y * H;
      if (!r.init) {
        r.sx = hx;
        r.sy = hy;
        r.init = true;
      }
      if (BP.mouse) {
        const k = 1 - Math.exp(-dt * 40);
        r.sx += (hx - r.sx) * k;
        r.sy += (hy - r.sy) * k;
      } else if (r.blendT > 0) {
        r.blendT -= dt;
        const k = 1 - Math.exp(-dt * 22);
        r.sx += (hx - r.sx) * k;
        r.sy += (hy - r.sy) * k;
      } else {
        r.sx = hx;
        r.sy = hy;
      }
      let near = null, nd = S * 0.14;
      for (const o of list) {
        if (o.decoy || o.exact) continue;
        const d = Math.hypot(o.x - r.sx, (o.y - r.sy) / 1.2);
        const pref = r.lock && r.lock.t === o.t ? 0.75 : 1;
        if (d * pref < nd) {
          nd = d * pref;
          near = o;
        }
      }
      let tx = r.sx, ty = r.sy;
      if (near) {
        const pull = assist * Math.pow(1 - nd / (S * 0.14), 0.6);
        tx += (near.x - r.sx) * pull;
        ty += (near.y - r.sy) * pull;
      }
      r.x = tx;
      r.y = ty;
      r.cool = Math.max(0, r.cool - dt);
      r.pulse = Math.max(0, r.pulse - dt * 4);
      if (!active || G.phase === "ready") {
        r.lock = null;
        r.lt = 0;
        r.lockFrac = 0;
        continue;
      }
      if (G.phase === "practice" && !list.length) {
        r.lock = null;
        r.lt = 0;
        r.lockFrac = 0;
        continue;
      }
      if (G.autoT > 0 && !G.phase) {
        r.lock = null;
        r.lt = 0;
        r.lockFrac = 0;
        const u2 = under(r, list);
        if (!(u2 && u2.decoy && !G.hardcore) && r.cool <= 0) fire(side, u2, false, true);
        continue;
      }
      const u = under(r, list);
      if (u && (!G.hardcore && u.decoy)) {
        r.lock = null;
        r.lt = 0;
        r.lockFrac = 0;
        continue;
      }
      if (u && r.lock && r.lock.t === u.t) {
        r.lt += dt;
        r.off = 0;
      } else if (!u && r.lock && (r.off = (r.off || 0) + dt) < 0.15 && r.lock.t.hittable()) {
      } else {
        r.lock = u;
        r.lt = 0;
        r.off = 0;
      }
      r.lockFrac = r.lock ? clamp(r.lt / lockTime, 0, 1) : 0;
      if (u && r.lock && r.lock.t === u.t && r.lt >= lockTime && r.cool <= 0) {
        fire(side, u, false);
        r.lt = -0.08;
      }
    }
    for (const s of ["right", "left"]) if (G.state === "play" && RETS[s].a > 0.2) reticleWorld(RETS[s], aimPt[s]);
  }
  function fire(side, o, quick, auto = false) {
    if (G.state !== "play") return;
    const r = RETS[side], free = G.autoT > 0 || !!(o && o.t.kind === "power");
    if (r.cool > 0 && !quick) return;
    if (G.ammo <= 0 && G.phase !== "practice" && !free) {
      sfx.empty();
      G.reloadHint = 1.6;
      return;
    }
    if (quick && r.cool > 0.05) return;
    r.cool = auto ? AUTO.GAP : quick ? 0.1 : 0.18;
    r.pulse = 1;
    if (G.phase === "practice") {
      if (o && o.t.kind === "practice") pracShot(side);
    } else {
      if (!G.storming && !free) G.ammo--;
      G.shots++;
    }
    sfx.pop();
    const P = pistolFor(side);
    P.recoil = 1;
    shake(auto ? 0.03 : 0.06);
    const muzzle = muzzleWorld(side);
    for (let i = 0; i < 14; i++) sparks.emit(muzzle.x, muzzle.y, muzzle.z, rand(-0.4, 0.4), rand(-0.2, 0.5), rand(-0.4, 0.4), 0.12, 0.04, 0, 3, 2.2, 1.2, 1, 0, 4);
    lightFlash(muzzle, 16765600, 3, 0.12);
    for (let i = 0; i < 4; i++) smoke.emit(muzzle.x, muzzle.y, muzzle.z, rand(-0.1, 0.1), rand(0, 0.15), rand(-0.3, 0), 0.4, 0.01, 0.05, 0.9, 0.9, 0.9, 0.4, -0.2, 3);
    let end;
    if (o) end = o.t.center(new Vector3());
    else {
      const nd = new Vector3(r.x / W * 2 - 1, -(r.y / H) * 2 + 1, 0.5).unproject(camera);
      const cp = camera.getWorldPosition(new Vector3());
      const dir = nd.sub(cp).normalize();
      end = cp.addScaledVector(dir, (cp.z + 2.2) / -dir.z);
    }
    const shot = { quick, dist: o ? Math.hypot(r.x - o.x, r.y - o.y) / Math.max(1, o.r) : 9 };
    const c = corks.find((c2) => !c2.active) || corks[0];
    c.active = true;
    c.m.visible = true;
    c.from = muzzle;
    c.to = end;
    c.t = 0;
    c.dur = Math.max(0.08, muzzle.distanceTo(end) / 34);
    c.target = o ? o.t : null;
    c.shot = shot;
    if (!o && G.hardcore && !auto) {
      G.combo = 0;
      G.mult = 1;
    }
  }
  function updateCorks(dt) {
    for (const c of corks) {
      if (!c.active) continue;
      c.t += dt;
      const k = Math.min(1, c.t / c.dur);
      if (c.target && c.target.hittable()) c.target.center(c.to);
      c.m.position.lerpVectors(c.from, c.to, k);
      c.m.position.y += Math.sin(k * Math.PI) * 0.05;
      c.m.lookAt(c.to);
      if (Math.random() < 0.7) smoke.emit(c.m.position.x, c.m.position.y, c.m.position.z, 0, 0.1, 0, 0.35, 0.015, 0.06 * Math.min(1, c.t / c.dur + 0.2), 0.95, 0.95, 0.95, 0.3, -0.2, 2);
      if (k >= 1) {
        c.active = false;
        c.m.visible = false;
        if (c.target && c.target.hittable()) c.target.hit(c.shot);
        else {
          puff(c.to, 5, [0.6, 0.55, 0.5], 0.2);
          for (let i = 0; i < 4; i++) chips.spawn(c.to, _v.set(rand(-1, 1), rand(1, 2), rand(0, 1.5)), 0.6, 12093274, 1.2, 0.5);
        }
      }
    }
  }
  function camLocal(ndcX, ndcY, d, out) {
    const pe = camera.projectionMatrix.elements;
    return out.set((ndcX + pe[8]) * d / pe[0], (ndcY + pe[9]) * d / pe[5], -d);
  }
  function bodyMove() {
    if (G.state !== "play") return;
    if (G.ammo < G.maxAmmo) reload();
  }
  function reload() {
    G.ammo = G.maxAmmo;
    G.reloads++;
    sfx.reload();
    G.reloadFlash = 1;
    G.emptyT = 0;
  }
  let stormQueue = [];
  function corkStorm() {
    G.special = 0;
    G.storms++;
    G.storming = true;
    reload();
    sfx.storm();
    flash(16769184, 0.3);
    shake(0.5);
    G.banner = { t: 0, text: "CORK STORM!", sub: "", short: true };
    const list = projectTargets().filter((o) => !o.decoy).sort((a, b) => a.x - b.x);
    stormQueue = list.map((o, i) => ({ o, at: i * 0.07, side: i % 2 ? "left" : "right" }));
    G.stormT = 0;
    for (let i = 0; i < 4; i++) firework(new Vector3(rand(-8, 8), rand(8, 12), -15), Math.random());
  }
  function updateStorm(dt) {
    if (!G.storming) return;
    G.stormT += dt;
    while (stormQueue.length && stormQueue[0].at <= G.stormT) {
      const s = stormQueue.shift();
      if (s.o.t.hittable()) {
        RETS[s.side].cool = 0;
        fire(s.side, s.o, true);
      }
    }
    if (!stormQueue.length && G.stormT > 0.6) G.storming = false;
  }
  BP.on("jump", bodyMove);
  let wasArmsUp = false;
  BP.on("punchR", () => quickShot("right"));
  BP.on("punchL", () => quickShot("left"));
  const lastQuick = { right: 0, left: 0 };
  function quickShot(side) {
    if (G.state !== "play" || G.phase === "ready") return;
    if (G.phase === "practice") lastList = (() => {
      const o = pracTarget();
      return o ? [o] : [];
    })();
    if (heldGun() !== "two") side = heldGun() === "one" ? G.gunHand : "right";
    const now = performance.now();
    if (now - lastQuick[side] < 300) return;
    const r = RETS[side];
    if (!r.active && !BP.mouse) return;
    lastQuick[side] = now;
    const list = lastList;
    let u = under(r, list);
    if (u && u.decoy && !G.hardcore) u = null;
    if (!u) {
      let bd = 1e9;
      for (const o of list) {
        if (o.decoy || o.exact) continue;
        const d = Math.hypot(o.x - r.x, o.y - r.y);
        if (d < hitRadius(o) * 1.6 && d < bd) {
          bd = d;
          u = o;
        }
      }
    }
    r.cool = 0;
    fire(side, u, true);
  }
  let lastList = [];
  const AUTO = { SECS: 30, GAP: 0.12, FIRST: [12, 18], MISSED: [14, 20], AFTER: [16, 24], STAY: 7 };
  const power = G.power = { active: false, t: 0, fx: 0, fy: 0, next: 1e9 };
  const powerT = {
    kind: "power",
    id: -1,
    radius: 0.1,
    hittable() {
      return power.active && G.state === "play";
    },
    center(v) {
      camera.updateMatrixWorld();
      const cp = camera.getWorldPosition(_pv);
      return v.set(power.fx * 2 - 1, 1 - power.fy * 2, 0.5).unproject(camera).sub(cp).normalize().multiplyScalar(2.2).add(cp);
    },
    hit() {
      startAuto();
    }
  };
  const _pv = new Vector3();
  const powerR = () => clamp(S * 0.062, 30, 74);
  function powerLabel() {
    const fs = clamp(S * 0.03, 13, 30);
    return { fs, lines: ["SHOOT FOR", "30s AUTO FIRE"] };
  }
  function powerBox(fx, fy) {
    const r = powerR(), { fs, lines } = powerLabel();
    ctx.font = "900 ".concat(fs, 'px system-ui, -apple-system, "Segoe UI", sans-serif');
    const lw = Math.max(...lines.map((l) => ctx.measureText(l).width)) + fs * 1.4, lh = fs * 2.6;
    const x = fx * W, y = fy * H, lx = clamp(x - lw / 2, 6, W - 6 - lw), ly = y - r * 1.25 - lh;
    return { x, y, r, fs, lines, lx, ly, lw, lh, box: { x: Math.min(x - r * 1.25, lx), y: ly, w: Math.max(x + r * 1.25, lx + lw) - Math.min(x - r * 1.25, lx), h: y + r * 1.25 - ly } };
  }
  function powerAvoid() {
    const out = (G._hud || []).slice();
    for (const e of document.querySelectorAll("#bp-pause, #bp-home, #bp-menu, #bp-music, #bp-cam, #bp-sys > *")) {
      const r = e.getBoundingClientRect();
      if (!r.width || !r.height || getComputedStyle(e).display === "none" || getComputedStyle(e).visibility === "hidden") continue;
      out.push({ x: r.left, y: r.top, w: r.width, h: r.height });
    }
    return out;
  }
  const overlaps = (a, b, m) => a.x < b.x + b.w + m && a.x + a.w > b.x - m && a.y < b.y + b.h + m && a.y + a.h > b.y - m;
  function showPower() {
    const side = Math.random() < 0.5 ? -1 : 1, m = Math.max(8, S * 0.015);
    const spots = [[0.13, 0.82], [0.1, 0.72], [0.18, 0.86]].flatMap(([dx, y]) => [[0.5 + side * (0.5 - dx), y], [0.5 - side * (0.5 - dx), y]]);
    const avoid = powerAvoid();
    let pick_ = spots[0];
    for (const sp of spots) {
      const b = powerBox(sp[0], sp[1]);
      if (b.box.x >= 0 && b.box.x + b.box.w <= W && !avoid.some((a) => overlaps(b.box, a, m))) {
        pick_ = sp;
        break;
      }
    }
    power.fx = pick_[0];
    power.fy = pick_[1];
    power.active = true;
    power.t = 0;
    sfx.powerUp();
  }
  function startAuto() {
    power.active = false;
    G.autoT = AUTO.SECS;
    G.autos = (G.autos || 0) + 1;
    G.ammo = G.maxAmmo;
    G.emptyT = 0;
    sfx.autoOn();
    flash(12580607, 0.25);
    shake(0.35);
    G.banner = { t: 0, text: "AUTO FIRE!", sub: "30 seconds. Just aim." };
    for (let i = 0; i < 3; i++) firework(new Vector3(rand(-8, 8), rand(8, 12), -15), 0.52);
  }
  function endAuto(el) {
    G.autoT = 0;
    G.ammo = G.maxAmmo;
    G.autoEndT = 1.6;
    power.next = el + rand(...AUTO.AFTER);
    sfx.autoOff();
    G.banner = { t: 0, text: "AUTO FIRE OVER", sub: "Hold on a target to fire" };
    for (const s of ["right", "left"]) {
      RETS[s].lock = null;
      RETS[s].lt = 0;
    }
  }
  function updatePower(rdt, el) {
    if (G.autoT > 0) {
      G.autoT -= rdt;
      if (G.autoT <= 0) endAuto(el);
      return;
    }
    if (power.active) {
      power.t += rdt;
      if (power.t > AUTO.STAY) {
        power.active = false;
        power.next = el + rand(...AUTO.MISSED);
      }
      return;
    }
    if (el >= power.next && G.timeLeft > 10) showPower();
  }
  function powerHit() {
    const x = power.fx * W, y = power.fy * H;
    return { t: powerT, x, y, r: powerR(), decoy: false, exact: true };
  }
  function drawPower(now) {
    if (!power.active || G.state !== "play" || G.phase) return;
    const b = powerBox(power.fx, power.fy), ap = clamp(power.t / 0.3, 0, 1), late = power.t > AUTO.STAY - 2;
    const on = Math.sin(now / (late ? 70 : 140)) > 0, rr = b.r * (0.6 + 0.4 * ap) * (1 + 0.05 * Math.sin(now / 110));
    ctx.save();
    ctx.globalAlpha = ap;
    ctx.shadowColor = on ? "#ffffff" : "#38e8ff";
    ctx.shadowBlur = S * 0.05;
    ctx.fillStyle = "rgba(10,30,44,0.85)";
    ctx.beginPath();
    ctx.arc(b.x, b.y, rr, 0, 7);
    ctx.fill();
    ctx.lineWidth = Math.max(4, rr * 0.14);
    ctx.strokeStyle = on ? "#ffffff" : "#38e8ff";
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.lineWidth = Math.max(2, rr * 0.06);
    ctx.strokeStyle = on ? "#38e8ff" : "#ffffff";
    ctx.beginPath();
    ctx.arc(b.x, b.y, rr * 0.66, 0, 7);
    ctx.stroke();
    const q = rr * 0.5;
    ctx.fillStyle = "#ffd84a";
    ctx.beginPath();
    ctx.moveTo(b.x + q * 0.25, b.y - q);
    ctx.lineTo(b.x - q * 0.55, b.y + q * 0.12);
    ctx.lineTo(b.x - q * 0.02, b.y + q * 0.12);
    ctx.lineTo(b.x - q * 0.25, b.y + q);
    ctx.lineTo(b.x + q * 0.55, b.y - q * 0.12);
    ctx.lineTo(b.x + q * 0.02, b.y - q * 0.12);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = Math.max(3, rr * 0.07);
    ctx.strokeStyle = "rgba(255,216,74,0.9)";
    ctx.beginPath();
    ctx.arc(b.x, b.y, rr * 1.18, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - power.t / AUTO.STAY));
    ctx.stroke();
    ctx.fillStyle = on ? "rgba(0,70,96,0.82)" : "rgba(22,8,6,0.72)";
    ctx.strokeStyle = on ? "#ffffff" : "#38e8ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(b.lx, b.ly, b.lw, b.lh, b.fs * 0.7);
    ctx.fill();
    ctx.stroke();
    txt(b.lines[0], b.lx + b.lw / 2, b.ly + b.lh * 0.32, b.fs, "#ffffff", "center", 900, null, void 0, b.lw);
    txt(b.lines[1], b.lx + b.lw / 2, b.ly + b.lh * 0.7, b.fs, on ? "#ffd84a" : "#9ff4ff", "center", 900, null, void 0, b.lw);
    ctx.restore();
  }
  function txt(s, x, y, size, col = "#fff", align = "center", weight = 800, glow, font = 'system-ui, -apple-system, "Segoe UI", sans-serif', maxW = W * 0.92) {
    ctx.font = "".concat(weight, " ").concat(size, "px ").concat(font);
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    const tw = ctx.measureText(s).width;
    if (tw > maxW) {
      size *= maxW / tw;
      ctx.font = "".concat(weight, " ").concat(size, "px ").concat(font);
    }
    if (glow) {
      ctx.shadowColor = glow;
      ctx.shadowBlur = size * 0.5;
    }
    ctx.fillStyle = col;
    ctx.fillText(s, x, y);
    ctx.shadowBlur = 0;
  }
  const SERIF = 'Georgia, "Times New Roman", serif';
  function pill(x, y, w, h, a = 0.62) {
    ctx.fillStyle = "rgba(22,8,6,".concat(a, ")");
    ctx.strokeStyle = "rgba(255,214,140,0.35)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, h / 2);
    ctx.fill();
    ctx.stroke();
  }
  let buttons = [], clickAt = null, keyPress = false;
  const keys = {};
  addEventListener("pointerdown", (e) => {
    audioInit();
    if (G.state === "play" && !(e.clientX < BP.uiRow().right && e.clientY < BP.uiRow().bottom)) {
      const r = RETS[G.gun === "one" ? G.gunHand : "right"];
      if (BP.mouse || !BP.live) {
        r.x = e.clientX;
        r.y = e.clientY;
      }
      quickShot("right");
      return;
    }
    clickAt = { x: e.clientX, y: e.clientY };
  });
  addEventListener("keydown", (e) => {
    keys[e.key] = true;
    if (e.key === "Enter" || e.key === " ") {
      keyPress = true;
      e.preventDefault();
    }
    if (e.key === "Escape") goHome();
    if ((e.key === "h" || e.key === "H") && G.state === "title") toggleHardcore();
    if ((e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "c" || e.key === "C") && G.state === "title") pickSetup();
    if ((e.key === "r" || e.key === "R") && G.state === "play") bodyMove();
  });
  addEventListener("keyup", (e) => {
    keys[e.key] = false;
  });
  function goHome() {
    location.href = "index.html" + (Q.has("demo") ? "?demo=1" : "");
  }
  function toggleHardcore() {
    setHard(!G.hardcore);
  }
  function setHard(on) {
    G.hardcore = on;
    localStorage.gallery_hc = on ? "1" : "0";
  }
  function pickGun(id) {
    const changed = G.gun !== id;
    G.gun = id;
    G.gunPicked = true;
    localStorage.gallery_gun = id;
    G.gunHand = "right";
    if (changed) showHowTo();
  }
  function button(id, label, x, y, w, h, now, primary, action, style, ms = 650) {
    const r = { x, y, w, h }, over = BP.handOver(r, W, H);
    const k = BP.dwell(id, over, now, ms);
    buttons.push({ r, action, primary });
    ctx.save();
    const rad = h / 2;
    ctx.shadowColor = style === "hc" ? "rgba(255,60,60,0.8)" : primary ? "rgba(255,190,80,0.75)" : "rgba(255,255,255,0.25)";
    ctx.shadowBlur = over ? S * 0.05 : S * 0.02;
    const g = ctx.createLinearGradient(x, y, x, y + h);
    if (style === "hc") {
      g.addColorStop(0, G.hardcore ? "#ff3b3b" : "rgba(60,20,20,0.85)");
      g.addColorStop(1, G.hardcore ? "#9c0d14" : "rgba(30,8,8,0.85)");
    } else if (style === "last") {
      g.addColorStop(0, "rgba(90,40,18,0.9)");
      g.addColorStop(1, "rgba(50,18,8,0.9)");
    } else if (style === "on") {
      g.addColorStop(0, "rgba(255,214,120,0.95)");
      g.addColorStop(1, "rgba(214,120,40,0.95)");
    } else if (primary) {
      g.addColorStop(0, "#ffd56a");
      g.addColorStop(1, "#e0761c");
    } else {
      g.addColorStop(0, "rgba(60,24,14,0.85)");
      g.addColorStop(1, "rgba(30,10,6,0.85)");
    }
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, rad);
    ctx.fill();
    ctx.shadowBlur = 0;
    if (k > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, rad);
      ctx.clip();
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillRect(x, y, w * k, h);
      ctx.restore();
    }
    ctx.lineWidth = Math.max(2, S * (style === "last" ? 7e-3 : 4e-3));
    ctx.strokeStyle = over ? "#fff" : style === "last" ? "#ffd56a" : "rgba(255,220,160,0.6)";
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, rad);
    ctx.stroke();
    txt(label, x + w / 2, y + h / 2 + h * 0.03, h * 0.4, primary || style === "on" ? "#3a1404" : "#fff", "center", 900, void 0, void 0, w * 0.86);
    ctx.restore();
    if (k === 1) {
      audioInit();
      sfx.press();
      action();
    }
  }
  function handleClicksAndKeys() {
    if (clickAt) {
      for (const b of buttons) if (clickAt.x > b.r.x && clickAt.x < b.r.x + b.r.w && clickAt.y > b.r.y && clickAt.y < b.r.y + b.r.h) {
        audioInit();
        sfx.press();
        b.action();
        break;
      }
      clickAt = null;
    }
    if (keyPress) {
      const b = buttons.find((b2) => b2.primary);
      if (b) {
        audioInit();
        sfx.press();
        b.action();
      }
      keyPress = false;
    }
  }
  function drawReticle(r, now) {
    if (r.a < 0.03) return;
    const ov = r.active && G.phase !== "practice" ? under(r, lastList) : null, onOwl = !!(ov && ov.decoy);
    const col = onOwl ? "#ff3030" : COLS[r.side], x = r.x, y = r.y, lf = r.lockFrac || 0, locked = r.lock && !r.lock.decoy && !onOwl;
    const base = S * 0.05 * (1 - lf * 0.25) * (1 + r.pulse * 0.35);
    ctx.save();
    ctx.globalAlpha = r.a;
    ctx.translate(x, y);
    ctx.shadowColor = locked ? "#ffcf5a" : col;
    ctx.shadowBlur = S * 0.02;
    ctx.strokeStyle = locked ? "#ffd76a" : col;
    ctx.lineWidth = Math.max(2.5, S * 6e-3);
    ctx.beginPath();
    ctx.arc(0, 0, base, 0, 7);
    ctx.stroke();
    ctx.rotate(now / 900 * (locked ? 3 : 1));
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(base * 0.62, 0);
      ctx.lineTo(base * 1.28, 0);
      ctx.stroke();
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(hud.width / W, hud.height / H);
    ctx.translate(x, y);
    if (lf > 0) {
      ctx.strokeStyle = "#fff2b0";
      ctx.lineWidth = Math.max(4, S * 0.01);
      ctx.beginPath();
      ctx.arc(0, 0, base * 1.45, -Math.PI / 2, -Math.PI / 2 + lf * Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(2.5, S * 6e-3), 0, 7);
    ctx.fill();
    if (onOwl) {
      ctx.strokeStyle = "#ff3030";
      ctx.lineWidth = Math.max(4, S * 0.01);
      ctx.lineCap = "round";
      const q = base * 0.55;
      ctx.beginPath();
      ctx.moveTo(-q, -q);
      ctx.lineTo(q, q);
      ctx.moveTo(q, -q);
      ctx.lineTo(-q, q);
      ctx.stroke();
      const fs = clamp(S * 0.034, 15, 34);
      ctx.font = "900 ".concat(fs, 'px system-ui, -apple-system, "Segoe UI", sans-serif');
      const tw = ctx.measureText("DON'T SHOOT").width + fs;
      ctx.fillStyle = "rgba(60,0,0,0.75)";
      ctx.beginPath();
      ctx.roundRect(-tw / 2, -base * 1.9 - fs * 0.7, tw, fs * 1.4, fs * 0.7);
      ctx.fill();
      txt("DON'T SHOOT", 0, -base * 1.9, fs, "#ffd0d0", "center", 900);
    }
    ctx.restore();
  }
  function drawCork(x, y, s, full) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = full ? "#c99260" : "rgba(255,255,255,0.12)";
    ctx.strokeStyle = full ? "#7a4f2a" : "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-s * 0.32, -s * 0.5);
    ctx.lineTo(s * 0.32, -s * 0.5);
    ctx.lineTo(s * 0.26, s * 0.5);
    ctx.lineTo(-s * 0.26, s * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (full) {
      ctx.fillStyle = "rgba(90,50,20,0.5)";
      for (let i = 0; i < 4; i++) ctx.fillRect(-s * 0.2 + i % 2 * s * 0.2, -s * 0.3 + i * s * 0.18, s * 0.06, s * 0.05);
    }
    ctx.restore();
  }
  function drawOops(dt) {
    G.oopsFlash = Math.max(0, (G.oopsFlash || 0) - dt * 1.6);
    if (!G.oopsFlash) return;
    const g = ctx.createRadialGradient(W / 2, H / 2, S * 0.35, W / 2, H / 2, Math.hypot(W, H) * 0.6);
    g.addColorStop(0, "rgba(255,0,0,0)");
    g.addColorStop(1, "rgba(255,20,20,".concat(0.55 * G.oopsFlash, ")"));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
  function drawHUD(now, dt) {
    const row = BP.uiRow(), gap = Math.max(8, S * 0.015), ph = clamp(S * 0.1, 40, 96), top0 = row.bottom - Math.max(38, S * 0.058);
    const tl = Math.max(0, Math.ceil(G.timeLeft)), low = G.timeLeft < 10, tStr = "".concat(Math.floor(tl / 60), ":").concat(String(tl % 60).padStart(2, "0"));
    ctx.font = "900 ".concat(ph * 0.6, 'px system-ui, -apple-system, "Segoe UI", sans-serif');
    const sw = Math.max(ctx.measureText("0000").width, ctx.measureText(String(G.score)).width);
    ctx.font = "800 ".concat(ph * 0.44, 'px system-ui, -apple-system, "Segoe UI", sans-serif');
    const tw = ctx.measureText("0:00").width;
    const pw = tw + sw + ph * 1.5, px = W / 2 - pw / 2, py = Math.max(top0, BP.uiBelow(px));
    pill(px, py, pw, ph);
    G._hud = [{ x: px, y: py, w: pw, h: ph }];
    txt(tStr, px + ph * 0.5 + tw / 2, py + ph / 2, ph * 0.44, low ? "#ff8a7a" : "#ffe2b0", "center", 800);
    txt(String(G.score), px + pw - ph * 0.5 - sw / 2, py + ph / 2, ph * 0.6, "#fff4d6", "center", 900, "#ff9a2a");
    G.multPulse = Math.max(0, (G.multPulse || 0) - dt * 2);
    if (G.mult > 1) {
      const sh = ph * 0.7 * (1 + G.multPulse * 0.15), label = "COMBO x".concat(G.mult * (G.frenzy && G.timeLeft < 12 ? 2 : 1));
      ctx.font = "900 ".concat(sh * 0.44, 'px system-ui, -apple-system, "Segoe UI", sans-serif');
      const sw2 = ctx.measureText(label).width + sh * 0.9;
      let sx = W - gap - sw2, sy = top0;
      if (sx < px + pw + gap) sy = py + ph + gap;
      pill(sx, sy, sw2, sh);
      G._hud.push({ x: sx, y: sy, w: sw2, h: sh });
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(sx, sy, sw2, sh, sh / 2);
      ctx.clip();
      ctx.fillStyle = "#ffcf5a";
      ctx.fillRect(sx, sy + sh - Math.max(3, sh * 0.08), sw2 * clamp((G.comboT || 0) / (G.hardcore ? 1.9 : 3.2), 0, 1), Math.max(3, sh * 0.08));
      ctx.restore();
      txt(label, sx + sw2 / 2, sy + sh / 2, sh * 0.44, "#fff", "center", 900, "#ffb030");
    }
    const cs = clamp(S * 0.042, 18, 44), aw = G.maxAmmo * cs * 0.8, ax = W / 2 - aw / 2, ay = H - gap - cs * 1.05;
    if (G.autoT > 0) {
      const fs = cs * 0.78, secs = Math.ceil(G.autoT), label = "AUTO FIRE  0:".concat(String(secs).padStart(2, "0"));
      ctx.font = "900 ".concat(fs, 'px system-ui, -apple-system, "Segoe UI", sans-serif');
      const lw = ctx.measureText(label).width + fs * 1.6, lh = cs * 1.75, lx = W / 2 - lw / 2, ly = ay - cs * 0.8, warn = G.autoT < 4 && Math.sin(now / 110) > 0;
      ctx.save();
      ctx.shadowColor = "#38e8ff";
      ctx.shadowBlur = S * 0.03;
      pill(lx, ly, lw, lh, 0.72);
      ctx.restore();
      G._hud.push({ x: lx, y: ly, w: lw, h: lh });
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(lx, ly, lw, lh, lh / 2);
      ctx.clip();
      const bh = Math.max(4, lh * 0.12);
      ctx.fillStyle = G.autoT < 4 ? "#ff8a5a" : "#38e8ff";
      ctx.fillRect(lx, ly + lh - bh, lw * clamp(G.autoT / AUTO.SECS, 0, 1), bh);
      ctx.restore();
      txt(label, W / 2, ly + lh * 0.46, fs, warn ? "#ff8a5a" : "#ffffff", "center", 900, "#00a0c8");
    } else {
      pill(ax - cs * 0.6, ay - cs * 0.8, aw + cs * 1.2, cs * 1.75, 0.5);
      G._hud.push({ x: ax - cs * 0.6, y: ay - cs * 0.8, w: aw + cs * 1.2, h: cs * 1.75 });
      for (let i = 0; i < G.maxAmmo; i++) drawCork(ax + i * cs * 0.8 + cs * 0.4, ay, cs, i < G.ammo);
    }
    G.reloadFlash = Math.max(0, (G.reloadFlash || 0) - dt * 2);
    const hiddenStar = secretStars.find((s) => s.active && !G.targets.some((t) => t.id === s.target.id));
    const sky = balloons.find((b) => b.active && b.secret && !G.targets.some((t) => t.id === b.target.id));
    G.hiddenStar = hiddenStar ? hiddenStar.sx : 0;
    G.hiddenSky = !!sky;
    let msg = null, col = "#ffffff", blink = false;
    if (!G.phase && G.owlWarnT === void 0 && G.targets.some((t) => t.decoy)) G.owlWarnT = 3.5;
    if (G.owlWarnT > 0) G.owlWarnT -= dt;
    if (G.ammo <= 0 && !G.phase) {
      G.emptyT = (G.emptyT || 0) + dt;
      msg = "Arms up or jump to reload";
      blink = true;
      if (G.emptyT > (G.hardcore ? 3.5 : 1.6)) reload();
    } else if (G.phase === "ready" || G.phase === "practice") msg = null;
    else if (G.owlWarnT > 0) {
      msg = "Don't shoot the purple owls!";
      col = "#ff8a8a";
    } else if (G.noAim > 2.5) msg = "Hold both hands together out in front to aim";
    else if (G.shots === 0 && G.timeLeft > ROUND - 10) {
      msg = "Keep the crosshair on a target and it fires";
      col = "#ffe8b0";
    } else if (power.active) {
      msg = "Aim low and shoot the AUTO FIRE target!";
      col = "#9ff4ff";
      blink = true;
    } else if (G.autoT > 0) {
      msg = "AUTO FIRE: just aim, it shoots";
      col = "#9ff4ff";
    } else if (hiddenStar) {
      msg = hiddenStar.sx > 0 ? "Secret prize! Lean left to peek" : "Secret prize! Lean right to peek";
      col = "#ffe08a";
    } else if (sky) {
      msg = "Prize up high! Squat to look up";
      col = "#ffe08a";
    } else if (G.reloadFlash > 0) {
      msg = "Reloaded!";
      col = "rgba(255,230,150,".concat(G.reloadFlash, ")");
    }
    if (msg && !(G.banner && G.ammo > 0)) {
      const fs = clamp(S * 0.045, 16, 48), my = ay - cs * 0.8 - gap - fs * 0.7;
      const pb = power.active ? powerBox(power.fx, power.fy).box : null;
      const pClear = pb && pb.y < my + fs * 0.7 && pb.y + pb.h > my - fs * 0.7 ? pb.x < W / 2 ? pb.x + pb.w : W - pb.x : 0;
      txt(msg, W / 2, my, fs, blink && Math.sin(now / 140) > 0 ? "#ffcf5a" : col, "center", 900, "#000", void 0, Math.min(W * 0.92, W - 2 * (Math.max(90, S * 0.15, pClear) + gap * 2)));
    }
  }
  function drawPopups(dt) {
    for (let i = popups.length - 1; i >= 0; i--) {
      const p = popups[i];
      p.t += dt;
      if (p.t > 1.2) {
        popups.splice(i, 1);
        continue;
      }
      const a = p.t > 0.8 ? 1 - (p.t - 0.8) / 0.4 : 1, sc = p.t < 0.12 ? 0.6 + p.t / 0.12 * 0.5 : 1.1 - Math.min(0.1, p.t - 0.12);
      ctx.save();
      ctx.globalAlpha = a;
      const y = p.y - S * 0.06 - p.t * S * 0.08, sz = S * (p.big ? 0.06 : 0.042) * sc;
      txt(p.text, p.x, y, sz, p.bad ? "#ff7070" : "#fff6d0", "center", 900, p.bad ? "#a00" : "#ff8a00");
      if (p.sub) txt(p.sub, p.x, y + sz * 0.9, sz * 0.55, p.bad ? "#ffb0b0" : "#ffd060", "center", 900, "#000");
      ctx.restore();
    }
  }
  function sideLines(text, px, maxW, fontOf) {
    const words = String(text).split(/\s+/).filter(Boolean);
    let lines = [], mw = 0;
    for (let i = 0; i < 4; i++) {
      ctx.font = fontOf(px);
      lines = [];
      let cur = "";
      for (const w of words) {
        const t = cur ? cur + " " + w : w;
        if (cur && ctx.measureText(t).width > maxW) {
          lines.push(cur);
          cur = w;
        } else cur = t;
      }
      if (cur) lines.push(cur);
      mw = Math.max(0, ...lines.map((l) => ctx.measureText(l).width));
      if (mw <= maxW) break;
      px *= maxW / mw * 0.98;
    }
    return { lines, px, w: Math.min(mw, maxW), h: lines.length * px * 1.1 };
  }
  function sidePx(w, h) {
    return Math.min(Math.min(w, h) * 0.052, w * 0.042);
  }
  function sideW(w, h, f = 0.22) {
    return Math.max(w * f, Math.min(w, h) * 0.34);
  }
  function drawBanner(dt) {
    if (!G.banner) return;
    const b = G.banner;
    b.t += dt;
    const life = b.short ? 1.1 : 2;
    if (b.t > life) {
      G.banner = null;
      return;
    }
    const k = b.t < 0.25 ? b.t / 0.25 : b.t > life - 0.4 ? (life - b.t) / 0.4 : 1;
    ctx.save();
    ctx.globalAlpha = k;
    const x0 = W * 0.025, y = Math.max(H * 0.19, S * 0.13 + sidePx(W, H)), L = sideLines(b.text, sidePx(W, H) * 1.1, sideW(W, H, 0.22), (px) => "900 ".concat(px, "px ").concat(SERIF)), sp = L.px * 0.45;
    const pd = L.px * 0.35, bw = L.w + pd * 2, bh = L.h + pd * 1.2 + (b.sub ? sp * 1.5 : 0), sx = -(1 - k) * S * 0.1;
    ctx.fillStyle = "rgba(30,6,4,0.55)";
    ctx.beginPath();
    ctx.roundRect(x0 + sx, y - L.px * 0.55 - pd * 0.6, bw, bh, Math.min(bh, L.px) * 0.4);
    ctx.fill();
    L.lines.forEach((l, n) => txt(l, x0 + pd + sx, y + n * L.px * 1.1, L.px, "#ffe6a0", "left", 900, "#ff7a00", SERIF, L.w + 1));
    if (b.sub) txt(b.sub, x0 + pd + sx, y + L.h - L.px * 0.35 + sp * 0.75, sp, "#fff", "left", 800, null, void 0, L.w + 1);
    ctx.restore();
  }
  function drawReady(now) {
    const k = G.readyFrac || 0, fs = clamp(S * 0.05, 18, 54), sub = clamp(S * 0.032, 14, 34);
    const head = G.gun === "two" ? "Ready your pistols" : "Ready your pistol";
    ctx.font = "900 ".concat(fs, "px ").concat(SERIF);
    const w1 = ctx.measureText(head).width;
    ctx.font = "800 ".concat(sub, 'px system-ui, -apple-system, "Segoe UI", sans-serif');
    const line = READY_SAY[G.gun];
    const w2 = ctx.measureText(line).width, rr = fs * 0.75;
    const bw = Math.min(W * 0.86, Math.max(w1, w2) + S * 0.1), bh = fs * 1.3 + sub * 1.5 + rr * 2.6, x = W / 2 - bw / 2, y = H * 0.4 - bh / 2;
    ctx.save();
    ctx.fillStyle = "rgba(22,8,6,0.66)";
    ctx.strokeStyle = "rgba(255,214,140,0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, bw, bh, S * 0.03);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    txt(head, W / 2, y + fs * 0.85, fs, "#ffe6a0", "center", 900, "#ff7a00", SERIF, bw * 0.92);
    txt(line, W / 2, y + fs * 1.3 + sub * 0.9, sub, "#fff", "center", 800, null, void 0, bw * 0.92);
    const cy = y + bh - rr * 1.35;
    ctx.save();
    ctx.lineWidth = Math.max(4, S * 9e-3);
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.arc(W / 2, cy, rr, 0, 7);
    ctx.stroke();
    ctx.strokeStyle = "#ffd76a";
    ctx.shadowColor = "#ffb030";
    ctx.shadowBlur = S * 0.02;
    ctx.beginPath();
    ctx.arc(W / 2, cy, rr, -Math.PI / 2, -Math.PI / 2 + k * Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = "#ffd76a";
    ctx.lineWidth = Math.max(2, S * 4e-3);
    for (const [a, b, c, d] of [[-rr * 0.55, 0, -rr * 0.2, 0], [rr * 0.2, 0, rr * 0.55, 0], [0, -rr * 0.55, 0, -rr * 0.2], [0, rr * 0.2, 0, rr * 0.55]]) {
      ctx.beginPath();
      ctx.moveTo(W / 2 + a, cy + b);
      ctx.lineTo(W / 2 + c, cy + d);
      ctx.stroke();
    }
    ctx.restore();
  }
  function pictogram(cx, cy, s, t) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const step = Math.sin(t * 1.6) * s * 0.18, sq = Math.max(0, Math.sin(t * 0.8 + 1)) * s * 0;
    ctx.translate(-s * 0.55 + step, sq);
    ctx.strokeStyle = "#ffe2b0";
    ctx.lineWidth = s * 0.06;
    ctx.shadowColor = "#ff9a2a";
    ctx.shadowBlur = s * 0.12;
    ctx.beginPath();
    ctx.arc(0, -s * 0.42, s * 0.08, 0, 7);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.32);
    ctx.lineTo(0, 0);
    ctx.lineTo(-s * 0.13, s * 0.32);
    ctx.moveTo(0, 0);
    ctx.lineTo(s * 0.13, s * 0.32);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.26);
    ctx.lineTo(s * 0.38, -s * 0.36);
    ctx.moveTo(0, -s * 0.26);
    ctx.lineTo(-s * 0.2, -s * 0.12);
    ctx.stroke();
    ctx.translate(s * 0.55 - step, -sq);
    ctx.setLineDash([s * 0.05, s * 0.05]);
    ctx.lineDashOffset = -t * 60;
    ctx.strokeStyle = "rgba(255,220,150,0.6)";
    ctx.lineWidth = s * 0.02;
    ctx.beginPath();
    ctx.moveTo(-s * 0.1 + step, -s * 0.36);
    ctx.lineTo(s * 0.48, -s * 0.2);
    ctx.stroke();
    ctx.setLineDash([]);
    const lf = t * 1.5 % 1;
    ctx.strokeStyle = "#5fe3ff";
    ctx.lineWidth = s * 0.03;
    ctx.beginPath();
    ctx.arc(s * 0.6, -s * 0.18, s * 0.13, 0, 7);
    ctx.stroke();
    ctx.strokeStyle = "#fff2b0";
    ctx.beginPath();
    ctx.arc(s * 0.6, -s * 0.18, s * 0.18, -Math.PI / 2, -Math.PI / 2 + lf * 6.283);
    ctx.stroke();
    ctx.fillStyle = "#f2c418";
    ctx.beginPath();
    ctx.ellipse(s * 0.6, -s * 0.12, s * 0.12, s * 0.07, 0, 0, 7);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(s * 0.67, -s * 0.24, s * 0.05, 0, 7);
    ctx.fill();
    ctx.fillStyle = "#f07a1a";
    ctx.beginPath();
    ctx.moveTo(s * 0.71, -s * 0.25);
    ctx.lineTo(s * 0.78, -s * 0.23);
    ctx.lineTo(s * 0.71, -s * 0.21);
    ctx.fill();
    ctx.restore();
  }
  function drawTitle(now) {
    if (0) {
      ctx.save();
      const tg = ctx.createLinearGradient(0, H * 0.13, 0, H * 0.3);
      tg.addColorStop(0, "#fff6c8");
      tg.addColorStop(0.5, "#ffc93c");
      tg.addColorStop(1, "#e0761c");
      ctx.font = "900 ".concat(S * 0.135, "px ").concat(SERIF);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = S * 0.016;
      ctx.strokeStyle = "#7a0d10";
      ctx.shadowColor = "#ff7a00";
      ctx.shadowBlur = S * 0.05;
      ctx.strokeText("PEEKABOO GALLERY", W / 2, H * 0.21);
      ctx.shadowBlur = 0;
      ctx.fillStyle = tg;
      ctx.fillText("PEEKABOO GALLERY", W / 2, H * 0.21);
      ctx.restore();
      txt("the carnival shooting gallery where your TV is a window", W / 2, H * 0.305, S * 0.034, "#ffe2b0", "center", 700, null, SERIF);
      pictogram(W / 2, H * 0.49, S * 0.24, now / 1e3);
      txt("Hold both hands together like a pistol · keep it on a target to fire · arms up or jump to reload", W / 2, H * 0.635, S * 0.031, "#fff", "center", 800);
      txt("Lean to peek around corners · squat to look up · secret prizes hide off-screen", W / 2, H * 0.68, S * 0.028, "#ffd38a", "center", 700);
    }
    const L = titleLayout();
    button("start", "START", L.start.x, L.start.y, L.start.w, L.start.h, now, true, () => startRound(performance.now()));
    const c = L.chg;
    button("chg", "", c.x, c.y, c.w, c.h, now, false, pickSetup);
    txt("CHANGE GUN", c.x + c.w / 2, c.y + c.h * 0.4, c.h * 0.27, "#fff", "center", 900, void 0, void 0, c.w * 0.86);
    txt((GUN_SHORT[G.gun] + " · " + (G.hardcore ? "HARD" : "EASY")).toUpperCase(), c.x + c.w / 2, c.y + c.h * 0.7, c.h * 0.17, "#ffd38a", "center", 800, void 0, void 0, c.w * 0.86);
    if (Q.has("tv") && !G._tvAt) G._tvAt = now + 2e3;
    if (G._tvAt && now > G._tvAt) {
      G._tvAt = 0;
      startRound(now);
    }
  }
  function titleLayout() {
    const gap = BP.layout.gap(W, H), sh = Math.max(0.16 * S, 60), sw = Math.max(0.42 * S, 200), ch = Math.max(0.13 * S, 52), cw = Math.max(0.3 * S, 150);
    const sayY = Math.max(H * 0.63, BP.uiRow().bottom + 20);
    if (W >= sw / 2 + gap + cw + W / 2 + 0.04 * W) {
      const y2 = Math.min(H * 0.86 - sh, sayY + Math.max(18, S * 0.035));
      return { sayY, start: { x: W / 2 - sw / 2, y: y2, w: sw, h: sh }, chg: { x: W / 2 + sw / 2 + gap, y: y2 + (sh - ch) / 2, w: cw, h: ch } };
    }
    const y = Math.min(H * 0.9 - sh - 0.13 * S - ch, sayY + Math.max(18, S * 0.035));
    return { sayY, start: { x: W / 2 - sw / 2, y, w: sw, h: sh }, chg: { x: W / 2 - cw / 2, y: y + sh + Math.max(0.13 * S, gap * 0.6), w: cw, h: ch } };
  }
  const GUN_SHORT = { two: "Two pistols", grip: "Both hands", one: "One hand" };
  function pickSetup() {
    BP.pick({
      title: "Pick your gun",
      sub: "The lit one is your gun now",
      value: G.gun,
      options: [{ id: "two", label: "TWO PISTOLS", sub: "one in each hand" }, { id: "grip", label: "ONE PISTOL", sub: "both hands together" }, { id: "one", label: "ONE HAND", sub: "point with either hand" }],
      onCancel: () => {
      },
      onPick: (id) => {
        pickGun(id);
        BP.pick({
          title: "How hard?",
          value: G.hardcore ? "hard" : "easy",
          onCancel: () => {
          },
          options: [{ id: "easy", label: "EASY", sub: "the owls can't be hit" }, { id: "hard", label: "HARD", sub: "faster ducks, never hit an owl" }],
          onPick: (v) => setHard(v === "hard")
        });
      }
    });
  }
  const PRIZES = [
    { min: 0, name: "RUBBER DUCKIE", type: "duckie" },
    { min: 4e3, name: "BUNNY", type: "bunny" },
    { min: 1e4, name: "TEDDY BEAR", type: "bear" },
    { min: 2e4, name: "GIANT PANDA", type: "panda" },
    { min: 35e3, name: "JUMBO UNICORN", type: "unicorn" }
  ];
  let prizeObj = null, endAt = 0;
  function drawEnd(now) {
    const E = BP.layout.end(W, H, { cy: H * (W > H ? 0.7 : 0.72) });
    const row = BP.uiRow(), gap = Math.max(10, S * 0.02), top = Math.max(row.bottom + 12, H * 0.14), room = E.again.y - Math.max(12, S * 0.03) - top;
    const pw = W < H ? W * 0.9 : Math.min(W * 0.5, S * 0.95), ph = Math.min(room, S * 0.6), px = W < H ? W * 0.05 : Math.max(gap, W * 0.27 - pw / 2), py = top + (room - ph) / 2;
    ctx.save();
    ctx.shadowColor = "rgba(255,140,40,0.3)";
    ctx.shadowBlur = S * 0.05;
    const pg = ctx.createLinearGradient(0, py, 0, py + ph);
    pg.addColorStop(0, "rgba(44,14,8,0.9)");
    pg.addColorStop(1, "rgba(20,6,4,0.92)");
    ctx.fillStyle = pg;
    ctx.beginPath();
    ctx.roundRect(px, py, pw, ph, S * 0.04);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255,214,140,0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    BP.uiCover = { x: px, y: py, w: pw, h: ph };
    const cx = px + pw / 2, name = G.prize ? G.prize.name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) : "";
    txt(G.prize ? "You won a ".concat(name, "!") : "Your score", cx, py + ph * 0.19, Math.min(Math.max(16, S * 0.045), ph * 0.12), "#ffe6a0", "center", 900, "#ff7a00", SERIF, pw * 0.9);
    const k = clamp((now - endAt) / 1e3, 0, 1), shown = Math.round(G.score * (1 - Math.pow(1 - k, 3)));
    txt(String(shown), cx, py + ph * 0.52, Math.min(S * 0.15, ph * 0.34), "#fff", "center", 900, "#ff9a2a", void 0, pw * 0.9);
    txt(G.newBest ? "New best!" : "Best ".concat(G.best), cx, py + ph * 0.83, Math.min(Math.max(16, S * 0.045), ph * 0.12), G.newBest ? "#ffd166" : "rgba(255,230,200,0.8)", "center", 800, null, void 0, pw * 0.9);
    if (now - endAt > 1e3) {
      const a = E.again, h = E.home;
      button("again", "PLAY AGAIN", a.x, a.y, a.w, a.h, now, true, () => startRound(performance.now()), null, 900);
      button("home2", "HOME", h.x, h.y, h.w, h.h, now, false, goHome, null, BP.LEAVE_MS || 1400);
    }
  }
  function resetTargets() {
    for (const tr of tracks) for (const s of tr.slots) fillSlot(s);
    for (const f of flips) {
      f.state = "down";
      f.goal = Math.PI / 2;
    }
    for (const b of balloons) {
      b.active = false;
      b.g.visible = false;
    }
    golden.active = false;
    golden.d.hinge.visible = false;
  }
  function startRound(now) {
    try {
      if (BP.howTo && BP.howTo.hide) BP.howTo.hide();
      document.querySelectorAll(".bph-wrap").forEach((e) => {
        e.style.display = "none";
      });
    } catch (e) {
    }
    BP.uiCover = null;
    audioInit();
    try {
      BodyMovin.music("gallery");
    } catch (e) {
    }
    Object.assign(G, { state: "play", score: 0, hits: 0, shots: 0, escaped: 0, combo: 0, bestCombo: 0, mult: 1, wave: 0, timeLeft: ROUND, special: 0, struggle: 0, secrets: 0, storms: 0, reloads: 0, frenzy: false, prize: null, banner: null, comboT: 0, storming: false, newBest: false, owlWarnT: void 0, oops: 0, oopsFlash: 0, autoT: 0, autos: 0 });
    power.active = false;
    power.next = rand(...AUTO.FIRST);
    G.maxAmmo = G.hardcore ? 8 : 10;
    G.ammo = G.maxAmmo;
    G._prevBest = BP.best(GAME_ID);
    BP.activity.activeSec = 0;
    BP.activity.kcal = 0;
    goldenPlan = [];
    skyPlan = [];
    popups.length = 0;
    if (prizeObj) {
      camera.remove(prizeObj);
      prizeObj = null;
    }
    prizeLight.intensity = 0;
    for (const s of secretStars) {
      s.active = false;
      s.g.visible = false;
      s.cool = rand(6, 10);
    }
    G.startedAt = now;
    G.phase = !BP.mouse && !BP.simulating || PRAC_TEST ? "ready" : null;
    G.readyFrac = 0;
    if (G.calibrated !== G.gun) for (const A of Object.values(AIMS)) {
      A.c = null;
      A.rx = A.ry = 0;
    }
    if (G.calibrated === G.gun && G.phase === "ready" && !PRAC_TEST) G.phase = null;
    G._wasCalm = calm();
    resetTargets();
    if (!calm()) startWave(0);
    aim.readyT = 0;
    aim.readyAt = now;
    aim.hold = 0;
    aim.buf.length = 0;
  }
  function endRound(now) {
    document.querySelectorAll(".bph-tip").forEach((e) => e.remove());
    G.state = "end";
    sfx.end();
    G.autoT = 0;
    power.active = false;
    if (BP.tips && BP.tips.clear) BP.tips.clear();
    G.round = { active: BP.activity.activeSec, kcal: BP.activity.kcal };
    G.best = Math.max(BP.best(GAME_ID), G.score);
    G.newBest = G.score > 0 && G.score > (G._prevBest || 0);
    BP.saveSession({ game: GAME_ID, score: G.score });
    if (BP.highScores) BP.highScores(GAME_ID, G.score);
    G.sessionsSaved = (G.sessionsSaved || 0) + 1;
    G.prize = [...PRIZES].reverse().find((p) => G.score >= p.min);
    prizeObj = makePlush(G.prize.type, 0.95);
    camera.add(prizeObj);
    prizeObj.userData.t = 0;
    prizeLight.intensity = 7;
    endAt = now;
    for (let i = 0; i < 6; i++) setTimeout(() => firework(new Vector3(rand(-8, 8), rand(8, 13), -16), Math.random()), i * 300);
    for (const tr of tracks) for (const s of tr.slots) if (s.state === "up") {
      s.state = "down";
      s.w = 3;
    }
    for (const s of secretStars) {
      s.active = false;
      s.g.visible = false;
    }
  }
  let last = performance.now(), fpsAcc = 0, fpsN = 0, fpsT = 0;
  const camPos = new Vector3();
  function frame(now) {
    var _a, _b, _c2;
    requestAnimationFrame(frame);
    BP.update(now);
    const rdt = Math.min(0.05, (now - last) / 1e3) || 1 / 60;
    last = now;
    fpsAcc += rdt;
    fpsN++;
    if (now - fpsT > 1e3) {
      G.fps = Math.round(fpsN / fpsAcc);
      fpsAcc = 0;
      fpsN = 0;
      fpsT = now;
      G.quality = state().quality.tier;
    }
    if (slowT > 0) {
      slowT -= rdt;
      G.timeScale = lerp(slowAmt, 1, 1 - slowT / slowDur > 0.7 ? (1 - slowT / slowDur - 0.7) / 0.3 : 0);
    } else G.timeScale = 1;
    const dt = rdt * G.timeScale, t = now / 1e3;
    const B = BP.body;
    let bx = BP.live ? clamp((BP.simulating ? (_a = B.shoulders) != null ? _a : B.x : (_c2 = (_b = B.steer) != null ? _b : B.shoulders) != null ? _c2 : B.x) * 1.2, -1, 1) : 0, cr = BP.live ? B.crouch : 0;
    if (keys.ArrowLeft) bx = -1;
    if (keys.ArrowRight) bx = 1;
    if (keys.ArrowDown) cr = 1;
    G.peek.x = lerp(G.peek.x, clamp(bx, -1, 1), 1 - Math.exp(-rdt * 7));
    G.peek.y = lerp(G.peek.y, clamp(cr, 0, 1), 1 - Math.exp(-rdt * 7));
    if (G.state === "title") {
      G.peek.x = Math.sin(t * 0.35) * 0.7;
      G.peek.y = 0.15 + 0.15 * Math.sin(t * 0.23);
    }
    eye.set(EYE0.x + G.peek.x * 1.6, EYE0.y - G.peek.y * 1.05, EYE0.z);
    camera.position.copy(eye);
    camera.quaternion.identity();
    if (BP.live && B.armsUp && !wasArmsUp) bodyMove();
    wasArmsUp = BP.live && B.armsUp;
    const isCalm = calm();
    if (G._wasCalm && !isCalm && G.state === "play") {
      G.startedAt = now;
      resetTargets();
    }
    G._wasCalm = isCalm;
    if (G.state === "play" && !isCalm) {
      const el = (now - G.startedAt) / 1e3;
      G.timeLeft = Math.max(0, ROUND - el);
      const wi = Math.min(3, Math.floor(el / WAVE_LEN));
      if (wi + 1 > G.wave) startWave(wi);
      if (goldenPlan.length && el >= goldenPlan[0]) {
        goldenPlan.shift();
        launchGolden();
      }
      if (skyPlan.length && el >= skyPlan[0]) {
        skyPlan.shift();
        launchBalloon(true);
      }
      if (Math.random() < dt * G.waveDef.balloons * (G.hardcore ? 1.5 : 1) * 2) launchBalloon(false);
      updatePower(rdt, el);
      if (G.comboT > 0) {
        G.comboT -= rdt;
        if (G.comboT <= 0) {
          G.combo = 0;
          G.mult = 1;
        }
      }
      if (G.timeLeft <= 5.5 && Math.ceil(G.timeLeft) !== G._tick) {
        G._tick = Math.ceil(G.timeLeft);
        if (G._tick > 0) sfx.tick();
      }
      if (G.timeLeft <= 0) endRound(now);
    }
    if (!isCalm && Math.random() < rdt * 0.25) firework(new Vector3(rand(-14, 14), rand(9, 14), rand(-20, -14)), Math.random());
    updateTracks(dt);
    updateFlips(dt);
    updateSpinners(dt);
    updateCans(dt);
    updateBalloons(dt, t);
    updateGolden(dt, t);
    updateSecrets(dt, t);
    updateBulbs(t);
    updateProjection();
    const list = projectTargets();
    if (power.active && G.state === "play" && !G.phase) {
      const ph = powerHit();
      list.push(ph);
      G.targets.push({ x: ph.x / W, y: ph.y / H, r: ph.r / W, kind: "power", id: -1, decoy: false, secret: false });
    }
    lastList = list;
    updateAim(rdt, now, list);
    if (G.state === "play") {
      updateReady(rdt, now);
      updatePractice(rdt);
    }
    if (false) BP.tip("hand", "Gun hand: ".concat(G.gunHand, ". Raise the other hand to switch"), 400, { hot: true });
    updateStorm(rdt);
    updateCorks(dt);
    updateAvatar(rdt, t);
    if (youReal) youReal.update(now);
    if (galGhost) galGhost.update(now, G.state === "play" && G.phase === "ready" && (BP.live || BP.simulating) && !BP.mouse);
    sparks.update(dt);
    smoke.update(dt);
    confetti.update(dt);
    chips.update(dt);
    coins.update(dt);
    updateFlashes(dt);
    sparks.mat.uniforms.uScale.value = smoke.mat.uniforms.uScale.value = renderer.getDrawingBufferSize(_v2).y * camera.projectionMatrix.elements[5] / 2;
    if (prizeObj) {
      const u = prizeObj.userData;
      u.t += rdt;
      const d = 2.3, k = Math.min(1, u.t / 0.8), e = 1 - Math.pow(1 - k, 3);
      camLocal(0.58, -0.1, d, prizeObj.position);
      prizeObj.position.y += -0.45 + (1 - e) * -1.2;
      prizeObj.rotation.y = Math.sin(u.t * 0.9) * 0.6;
      prizeObj.scale.setScalar(0.95 * (0.3 + 0.7 * e));
      prizeLight.position.copy(camera.position).add(_v.set(0.3, 1.2, 0.4));
      prizeLight.target.position.copy(prizeObj.getWorldPosition(_v3));
      if (Math.random() < rdt * 6) {
        const wp = prizeObj.getWorldPosition(_v3);
        confetti.spawn(_v.set(wp.x + rand(-1, 1), wp.y + 1.6, wp.z + rand(-0.5, 0.5)), _v2.set(rand(-0.3, 0.3), 0, rand(-0.3, 0.3)), rand(0.8, 1.3), pick(CONF), 3, 2.5, 5);
      }
    }
    if (!G._firstFrame) G._firstFrame = now;
    if (now - G._firstFrame < 3e3 || now - (G.startedAt || 0) < 1500 || Q.has("lockq")) {
      const q = state().quality;
      q.t0 = now;
      q.frames = 0;
    }
    if (state().passes.bloom) {
      const b = state().passes.bloom;
      b.strength = 0.55;
      b.radius = 0.55;
      b.threshold = 0.82;
    }
    render(rdt);
    ctx.clearRect(0, 0, W, H);
    buttons = [];
    if (G.state === "play") {
      if (calm()) drawCalm();
      drawOops(rdt);
      drawPopups(rdt);
      if (G.phase === "practice") drawPractice(now);
      drawPower(now);
      if (G.phase !== "ready") for (const s of ["left", "right"]) drawReticle(RETS[s], now);
      if (!calm()) drawHUD(now, rdt);
      else G._hud = [];
      if (G.phase === "ready") drawReady(now);
      else drawBanner(rdt);
    }
    if (G.state === "title") drawTitle(now);
    if (G.state === "end") drawEnd(now);
    if (G.state === "loading") {
      txt("setting up the booth…", W / 2, H / 2, S * 0.04, "#ffe2b0");
    }
    G.buttons = buttons.map((b) => ({ x: (b.r.x + b.r.w / 2) / W, y: (b.r.y + b.r.h / 2) / H, primary: b.primary }));
    handleClicksAndKeys();
    if (G.state !== "play") BP.drawHands(ctx, W, H);
  }
  {
    const hidden = [];
    scene.traverse((o) => {
      if (!o.visible) {
        hidden.push(o);
        o.visible = true;
      }
    });
    updateProjection();
    renderer.compile(scene, camera);
    hidden.forEach((o) => o.visible = false);
  }
  G.state = "title";
  for (const tr of tracks) for (const s of tr.slots) fillSlot(s);
  G._dbg = { R: realism_exports, scene, renderer, THREE: three_module_exports, camera };
  if (false) {
    BP.tips({
      accent: "#ffd36b",
      max: 3,
      bottom: 0.78,
      when: () => G.state === "play" && !G.phase,
      avoid: () => G._hud || [],
      items: [
        { id: "aim2", text: "Aim: point each hand at a target. Two pistols, two crosshairs", when: () => G.gun === "two" },
        { id: "aimg", text: "Aim: both hands together out in front. A small swing covers the booth", when: () => G.gun === "grip" },
        { id: "aim1", text: "Aim: point with one hand. Lower it and raise the other to switch hands", when: () => G.gun === "one" },
        { id: "fire2", text: "Fire: hold a crosshair on a target until its ring fills. Each pistol fires on its own", when: () => G.gun === "two" },
        { id: "fire", text: "Fire: hold the crosshair on a target until the ring fills", when: () => G.gun !== "two" },
        { id: "peek", text: "Peek: lean left or right to find hidden prizes" }
      ]
    });
  }
  G.api = { pickGun: (id) => pickGun(id), setHard: (on) => setHard(on), startRound: () => startRound(performance.now()), endRound: () => endRound(performance.now()), corkStorm, reload, showPower, startAuto, launchGolden, launchBalloon, projectTargets };
  BP.start();
  requestAnimationFrame(frame);
})().catch((e) => setTimeout(() => {
  throw e;
}));
