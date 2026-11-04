import {
  create
} from "./chunk-A2W6QNSO.js";
import {
  environment,
  flash,
  pbr,
  render,
  setup,
  shake,
  sun
} from "./chunk-5EPBUA75.js";
import "./chunk-CPYHHAA5.js";
import "./chunk-GEQJXPAR.js";
import {
  ShaderPass
} from "./chunk-UBB4M7UR.js";
import {
  BoxGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  Group,
  HemisphereLight,
  LatheGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  Quaternion,
  RepeatWrapping,
  SRGBColorSpace,
  ShaderMaterial,
  ShadowMaterial,
  Sprite,
  SpriteMaterial,
  TextureLoader,
  TorusGeometry,
  Vector2,
  Vector3
} from "./chunk-4IYDSAYK.js";
import "./chunk-NWIHTO7D.js";

// bmpage:bmpage:boxing.html#0
(async () => {
  "use strict";
  const GAME = "boxing", Q = new URLSearchParams(location.search), TV = Q.has("tv"), MUTE = Q.has("mute");
  const ROUND = Q.has("round") ? +Q.get("round") : 60;
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
  const PINK = "#ff5c93", BLUE = "#4aa8ff", GOLD = "#ffcf5a", GREEN = "#7fe8a6", ORANGE = "#ffa24a", RED = "#ff5a5a";
  const rgba = (hex, a) => {
    const n = parseInt(hex.slice(1), 16);
    return "rgba(".concat(n >> 16, ",").concat(n >> 8 & 255, ",").concat(n & 255, ",").concat(Math.max(0, Math.min(1, a)), ")");
  };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;
  const FONT = '-apple-system, "SF Pro Display", "Segoe UI", system-ui, sans-serif';
  const glCanvas = document.createElement("canvas");
  document.getElementById("gl").appendChild(glCanvas);
  const RZ = setup(glCanvas, { fov: 44, near: 0.03, far: 80, tier: Q.has("tier") ? +Q.get("tier") : void 0 });
  const { renderer, scene, camera } = RZ;
  renderer.toneMappingExposure = 1;
  const EYE = 1.42;
  const FIGHTER = { x: 0, z: -1.2 }, CAMPOS = new Vector3(FIGHTER.x + 0.12, EYE, FIGHTER.z + 2.95);
  camera.position.copy(CAMPOS);
  const BG_ROT = Q.has("rot") ? +Q.get("rot") : -1.85;
  await environment(scene, renderer, "basement_boxing_ring", { background: true, blur: 0, intensity: 0.9, rotation: BG_ROT });
  const finishShader = {
    // film finish: vignette + fine grain
    uniforms: { tDiffuse: { value: null }, uTime: { value: 0 } },
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader: "uniform sampler2D tDiffuse; uniform float uTime; varying vec2 vUv;\n    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + uTime) * 43758.5453); }\n    void main(){ vec4 c = texture2D(tDiffuse, vUv); vec2 d = vUv - 0.5; d.x *= 1.25;\n      c.rgb += (h(vUv * 911.0) - 0.5) * 0.018; gl_FragColor = c; }"
  };
  let finish = null, composerSeen = null;
  function decorateComposer() {
    const c = RZ.composer;
    if (c === composerSeen) return;
    composerSeen = c;
    finish = new ShaderPass(finishShader);
    c.addPass(finish);
    if (RZ.passes.bloom) {
      RZ.passes.bloom.strength = 0.16;
      RZ.passes.bloom.radius = 0.35;
      RZ.passes.bloom.threshold = 1.6;
    }
    if (RZ.passes.ao) {
      const ao = RZ.passes.ao, r0 = ao.render.bind(ao);
      ao.blendIntensity = 0.9;
      ao.render = (...a) => {
        const hid = noAO.filter((o) => o.visible);
        hid.forEach((o) => o.visible = false);
        try {
          r0(...a);
        } finally {
          hid.forEach((o) => o.visible = true);
        }
      };
    }
  }
  const noAO = [];
  const key = sun(scene, { intensity: 1.5, position: [0.9, 3.4, 0.4], target: [0, 0, -2.1], size: 3, color: 16773604 });
  key.shadow.radius = 6;
  scene.add(new HemisphereLight(16773354, 9058874, 0.25));
  const catcher = new Mesh(new PlaneGeometry(14, 14), new ShadowMaterial({ opacity: 0.42 }));
  catcher.rotation.x = -Math.PI / 2;
  catcher.receiveShadow = true;
  scene.add(catcher);
  const leatherBase = (() => {
    const L = new TextureLoader(), base = "assets/textures/leather_red_02/leather_red_02_";
    const ld = (k) => {
      const t = L.load(base + k + (window.BP_TV ? "_512.jpg" : "_2k.jpg"));
      t.wrapS = t.wrapT = RepeatWrapping;
      t.repeat.set(3, 3);
      t.anisotropy = 8;
      return t;
    };
    const m = new MeshStandardMaterial({ normalMap: ld("nor_gl"), roughnessMap: ld("Rough"), aoMap: ld("AO") });
    m.normalScale = new Vector2(1.3, 1.3);
    return m;
  })();
  function leather(color, rough = 0.72, env2 = 0.8) {
    const m = leatherBase.clone();
    m.map = null;
    m.color = new Color(color);
    m.roughness = rough;
    m.envMapIntensity = env2;
    return m;
  }
  const LEATHER = { bag: leather(4853517, 0.62, 0.9), cap: leather(1315349, 0.7), band: leather(14209736, 0.7), speed: leather(7019028, 0.5, 1), strap: leather(1776157, 0.75) };
  const steel = new MeshStandardMaterial({ color: 12896463, metalness: 1, roughness: 0.28 });
  const darkSteel = new MeshStandardMaterial({ color: 2763824, metalness: 0.8, roughness: 0.45 });
  const wood = pbr("white_maple_veneer", { repeat: [1, 1], roughness: 0.5, color: 9067058 });
  function makeChain(n, linkLen, wire) {
    const g = new Group(), geo = new TorusGeometry(linkLen * 0.32, wire, 8, 18);
    geo.scale(1, 1.55, 1);
    for (let i = 0; i < n; i++) {
      const m = new Mesh(geo, steel);
      m.castShadow = true;
      g.add(m);
    }
    g.userData.n = n;
    scene.add(g);
    return g;
  }
  const _a = new Vector3(), _b = new Vector3(), _d = new Vector3(), _q = new Quaternion(), _up = new Vector3(0, 1, 0);
  function layChain(ch, from, to, sag = 0) {
    const n = ch.userData.n;
    _d.subVectors(to, from);
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n, m = ch.children[i];
      m.position.copy(from).addScaledVector(_d, t);
      m.position.x += Math.sin(t * Math.PI) * sag;
      _q.setFromUnitVectors(_up, _a.copy(_d).normalize());
      m.quaternion.copy(_q);
      m.rotateY(i % 2 ? Math.PI / 2 : 0);
    }
  }
  const BAG_S = 1.5;
  const HB = { x: FIGHTER.x + 0.04, hookY: 0, chain: 0.5, straps: 0.3, len: 1.2 * BAG_S, r: 0.175 * BAG_S, bottom: 0.35 };
  HB.z = FIGHTER.z - (0.22 + 0.12 + HB.r + 0.09);
  HB.hookY = HB.bottom + HB.len + HB.straps + HB.chain;
  HB.topY = HB.hookY - HB.chain - HB.straps;
  const heavy = new Group();
  scene.add(heavy);
  const hbHook = new Vector3(HB.x, HB.hookY, HB.z);
  const swing = new Group();
  swing.position.copy(hbHook);
  heavy.add(swing);
  const bagRig = new Group();
  bagRig.position.y = -HB.chain;
  swing.add(bagRig);
  const bagTw = new Group();
  bagRig.add(bagTw);
  const hbRing = new Mesh(new TorusGeometry(0.045, 9e-3, 8, 24), steel);
  hbRing.castShadow = true;
  bagTw.add(hbRing);
  const bagGeo = (() => {
    const pts = [], N = 60;
    for (let i = 0; i <= N; i++) {
      const t = i / N, y = -HB.straps - t * HB.len, end = Math.min(t, 1 - t);
      const r = HB.r * (1 + 0.025 * Math.sin(t * Math.PI)) * (end < 0.045 ? 0.55 + 0.45 * Math.sqrt(end / 0.045) : 1);
      pts.push(new Vector2(i === 0 || i === N ? 1e-4 : r, y));
    }
    return new LatheGeometry(pts, 64);
  })();
  const bagMesh = new Mesh(bagGeo, LEATHER.bag);
  bagMesh.castShadow = true;
  bagMesh.receiveShadow = true;
  bagTw.add(bagMesh);
  const bagBase = Float32Array.from(bagGeo.attributes.position.array);
  for (const [t, h, mat] of [[0, 0.07 * BAG_S, LEATHER.cap], [1, 0.07 * BAG_S, LEATHER.cap], [0.5, 0.05 * BAG_S, LEATHER.band]]) {
    const y = -HB.straps - t * HB.len, band = new Mesh(new CylinderGeometry(HB.r * 1.012 * (t === 0.5 ? 1.02 : 0.97), HB.r * 1.012 * (t === 0.5 ? 1.02 : 0.97), h, 64, 1, true), mat);
    band.position.y = t === 0 ? y - h / 2 + 0.012 : t === 1 ? y + h / 2 - 0.012 : y;
    band.castShadow = true;
    bagTw.add(band);
  }
  for (const t of []) {
    const seam = new Mesh(new TorusGeometry(HB.r * 1.008, 35e-4, 6, 64), leather(2754567));
    seam.rotation.x = Math.PI / 2;
    seam.position.y = -HB.straps - t * HB.len;
    bagTw.add(seam);
  }
  const patchTex = (() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 256;
    const g = c.getContext("2d");
    g.clearRect(0, 0, 512, 256);
    g.fillStyle = "rgba(236,230,220,0.92)";
    g.font = "900 92px -apple-system, system-ui, sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("BODY MOVIN'", 256, 108);
    g.font = "700 40px -apple-system, system-ui, sans-serif";
    g.fillText("HEAVY BAG · 100 LB", 256, 186);
    g.globalCompositeOperation = "destination-out";
    for (let i = 0; i < 1400; i++) {
      g.fillStyle = "rgba(0,0,0,".concat(Math.random() * 0.5, ")");
      g.fillRect(Math.random() * 512, Math.random() * 256, 1 + Math.random() * 3, 1 + Math.random() * 3);
    }
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  })();
  const patch = new Mesh(new CylinderGeometry(HB.r * 1.03, HB.r * 1.03, 0.2 * BAG_S, 48, 1, true, -0.85, 1.7), new MeshStandardMaterial({ map: patchTex, transparent: true, roughness: 0.6, depthWrite: false }));
  patch.position.y = -HB.straps - 0.33 * HB.len;
  bagTw.add(patch);
  const straps = [];
  for (let i = 0; i < 4; i++) {
    const s = new Mesh(new CylinderGeometry(6e-3, 6e-3, 1, 6), steel);
    s.castShadow = true;
    bagTw.add(s);
    straps.push(s);
  }
  {
    const a0 = new Vector3(0, -0.02, 0);
    straps.forEach((s, i) => {
      const a = i * Math.PI / 2 + Math.PI / 4, b = new Vector3(Math.cos(a) * HB.r * 0.8, -HB.straps + 0.01, Math.sin(a) * HB.r * 0.8);
      s.position.copy(a0).add(b).multiplyScalar(0.5);
      s.scale.y = a0.distanceTo(b);
      s.quaternion.setFromUnitVectors(_up, b.clone().sub(a0).normalize());
    });
  }
  const hbChain = makeChain(9, 0.06, 6e-3);
  const hbHookMesh = new Mesh(new CylinderGeometry(0.03, 0.03, 0.08, 16), darkSteel);
  hbHookMesh.position.copy(hbHook).add(new Vector3(0, 0.04, 0));
  heavy.add(hbHookMesh);
  const blobTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(0,0,0,0.55)");
    gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
    return new CanvasTexture(c);
  })();
  const blob = new Mesh(new PlaneGeometry(BAG_S, BAG_S), new MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false }));
  blob.rotation.x = -Math.PI / 2;
  blob.position.set(HB.x, 3e-3, HB.z);
  heavy.add(blob);
  const SPEED_FACE = 1.74, SPEED_FIG = { x: FIGHTER.x, z: FIGHTER.z };
  const SB = { x: SPEED_FIG.x, z: SPEED_FIG.z - 0.5, boardY: SPEED_FACE + 0.6 * 0.27 * BAG_S, len: 0.27 * BAG_S, rMax: 0.095 * BAG_S, phiMax: 1.72, board: 0.3 * Math.sqrt(BAG_S) };
  const speed = new Group();
  scene.add(speed);
  const board = new Mesh(new CylinderGeometry(SB.board, SB.board, 0.06, 64), wood);
  board.position.set(SB.x, SB.boardY + 0.025, SB.z);
  board.castShadow = true;
  board.receiveShadow = true;
  speed.add(board);
  const boardRim = new Mesh(new TorusGeometry(SB.board, 0.012, 8, 64), darkSteel);
  boardRim.rotation.x = Math.PI / 2;
  boardRim.position.set(SB.x, SB.boardY + 0.025, SB.z);
  speed.add(boardRim);
  for (const dx of [-0.2, 0.2]) {
    const post = new Mesh(new BoxGeometry(0.05, 1.2, 0.05), darkSteel);
    post.position.set(SB.x + dx, SB.boardY + 0.65, SB.z - 0.25);
    post.castShadow = true;
    speed.add(post);
    const arm = new Mesh(new BoxGeometry(0.05, 0.05, 0.3), darkSteel);
    arm.position.set(SB.x + dx, SB.boardY + 0.085, SB.z - 0.12);
    speed.add(arm);
  }
  const sbPivot = new Group();
  sbPivot.position.set(SB.x, SB.boardY - 0.035, SB.z);
  speed.add(sbPivot);
  const swivel = new Mesh(new CylinderGeometry(0.018, 0.022, 0.05, 16), steel);
  swivel.position.set(SB.x, SB.boardY - 0.012, SB.z);
  speed.add(swivel);
  const sbBag = new Group();
  sbPivot.add(sbBag);
  const sbGeo = (() => {
    const pts = [], N = 40;
    for (let i = 0; i <= N; i++) {
      const t = i / N, y = -0.01 - t * SB.len;
      const r = SB.rMax * (t < 0.12 ? 0.18 + 1.6 * t : Math.sin(Math.PI * Math.pow((t - 0.05) / 0.95, 0.75)) * 0.98 + 0.02);
      pts.push(new Vector2(i === N ? 1e-4 : Math.max(0.012, r), y));
    }
    return new LatheGeometry(pts, 40);
  })();
  const sbMesh = new Mesh(sbGeo, LEATHER.speed);
  sbMesh.castShadow = true;
  sbBag.add(sbMesh);
  const sbLoop = new Mesh(new TorusGeometry(0.014, 4e-3, 6, 16), steel);
  sbLoop.position.y = -6e-3;
  sbBag.add(sbLoop);
  const lace = new Mesh(new CylinderGeometry(25e-4, 25e-4, SB.len * 0.55, 6), leather(10127992));
  lace.position.set(0, -0.03 - SB.len * 0.32, SB.rMax * 0.93);
  lace.rotation.x = -0.25;
  sbBag.add(lace);
  const dustTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d");
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "rgba(255,245,230,0.75)");
    gr.addColorStop(0.5, "rgba(230,215,195,0.25)");
    gr.addColorStop(1, "rgba(230,215,195,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
    return new CanvasTexture(c);
  })();
  const dust = Array.from({ length: 70 }, () => {
    const s = new Sprite(new SpriteMaterial({ map: dustTex, transparent: true, depthWrite: false, opacity: 0 }));
    s.visible = false;
    s.userData = { life: 0, v: new Vector3() };
    scene.add(s);
    return s;
  });
  function puff(p, n, power, dir) {
    for (let k = 0; k < n; k++) {
      const s = dust.find((d) => !d.visible);
      if (!s) return;
      s.visible = true;
      s.position.copy(p);
      s.userData.life = s.userData.max = 0.5 + Math.random() * 0.6;
      s.userData.v.set((Math.random() - 0.5) * 0.9, (Math.random() - 0.2) * 0.6, Math.random() * 0.6 + 0.3).multiplyScalar(0.4 + power * 0.8).addScaledVector(dir, -0.15);
      s.userData.s = 0.04 + Math.random() * 0.06;
    }
  }
  function updateDust(dt) {
    for (const s of dust) {
      if (!s.visible) continue;
      const u = s.userData;
      u.life -= dt;
      if (u.life <= 0) {
        s.visible = false;
        continue;
      }
      u.v.multiplyScalar(Math.exp(-dt * 3));
      u.v.y -= dt * 0.15;
      s.position.addScaledVector(u.v, dt);
      const e = 1 - u.life / u.max;
      s.scale.setScalar(u.s * (1 + e * 3));
      s.material.opacity = 0.55 * (1 - e) * Math.min(1, e * 8);
    }
  }
  const fighterH = create({ scene, camera, BP: BodyMovin, x: FIGHTER.x, z: FIGHTER.z, tier: RZ.quality.tier, gloves: true, colors: { l: "#ff5c93", r: "#4aa8ff" } });
  const fighterS = create({ scene, camera, BP: BodyMovin, x: SPEED_FIG.x, z: SPEED_FIG.z, tier: RZ.quality.tier, gloves: true, colors: { l: "#ff5c93", r: "#4aa8ff" }, headY: SPEED_FACE + 0.02 });
  let fighter = fighterH;
  fighterS.enabled = false;
  const VEIL_A = 0.15;
  function addVeil(fig) {
    const pl = fig.plane;
    if (!pl || !pl.material.map) return null;
    const m = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      uniforms: { map: { value: pl.material.map }, uOp: { value: 0 }, uA: { value: VEIL_A }, uCol: { value: new Color(15266815) } },
      vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: "uniform sampler2D map; uniform float uOp, uA; uniform vec3 uCol; varying vec2 vUv; void main(){ float a = texture2D(map, vUv).a; gl_FragColor = vec4(uCol, smoothstep(0.012, 0.04, a) * uA * uOp); }"
    });
    const v = new Mesh(pl.geometry, m);
    v.position.z = -2e-3;
    v.renderOrder = pl.renderOrder;
    pl.add(v);
    v.onBeforeRender = () => {
      m.uniforms.uOp.value = pl.material.opacity;
    };
    return v;
  }
  const veils = [addVeil(fighterH), addVeil(fighterS)].filter(Boolean);
  const RH = { cT: [0.8, -0.12, 0.58], sT: [0.74, 0.1, 0.66], cS: [0.12, -0.78, -0.6], sS: [0.5, 0.16, 0.85] };
  const nrm3 = (a) => {
    const l = Math.hypot(a[0], a[1], a[2]) || 1;
    return [a[0] / l, a[1] / l, a[2] / l];
  };
  const smooth01 = (x) => x * x * (3 - 2 * x);
  const mix3 = (a, b, k) => nrm3([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]);
  fighterH.legHook = ({ B, t, LL, fdz, proj, pz, DS, thigh, shin }) => {
    for (const s of ["l", "r"]) {
      const w = LL[s];
      if (w <= 0.01) continue;
      const so = s === "r" ? 1 : -1, o = s === "r" ? "l" : "r", e = smooth01(clamp(kd.ext[s], 0, 1));
      B[s + "H"] = [B[s + "H"][0] + (B[o + "H"][0] - B[s + "H"][0]) * 0.12 * w, B[s + "H"][1] + 0.05 * t * w];
      const H2 = B[s + "H"], fl = (d) => [d[0] * so, d[1], d[2]];
      const dT = fl(mix3(RH.cT, RH.sT, e)), dS = fl(mix3(RH.cS, RH.sS, e));
      const K = [H2[0] + dT[0] * thigh, H2[1] + dT[1] * thigh], kz = dT[2] * thigh;
      const A = [K[0] + dS[0] * shin, K[1] + dS[1] * shin], az = kz + dS[2] * shin;
      const mx = (p, q) => [p[0] + (q[0] - p[0]) * w, p[1] + (q[1] - p[1]) * w], K0 = B[s + "K3"] || B[s + "K"], A0 = B[s + "A3"] || B[s + "A"];
      B[s + "K3"] = [...mx(K0, K), pz - DS * ((B[s + "K3"] ? (pz - B[s + "K3"][2]) * DS : 0) + (kz - (B[s + "K3"] ? (pz - B[s + "K3"][2]) * DS : 0)) * w)];
      B[s + "A3"] = mx(A0, A);
      fdz[s] = fdz[s] + (az - fdz[s]) * w;
      B[s + "K"] = mx(B[s + "K"], proj(K, kz));
      B[s + "A"] = mx(B[s + "A"], proj(A, az));
    }
  };
  noAO.push(...dust, patch, ...fighterH.objects, ...fighterS.objects, ...veils);
  decorateComposer();
  RZ.quality.t0 = performance.now();
  RZ.quality.frames = 0;
  const HP = { ax: 0, vx: 0, az: 0, vz: 0, tw: 0, vt: 0, wx: 0, wvx: 0, wz: 0, wvz: 0, sq: 0, vsq: 0, dents: [] };
  const LP = 1.55 * (HB.chain + HB.straps + HB.len / 2) / 1.4, GRAV = 9.81;
  const AX_NEAR = -Math.asin(clamp((FIGHTER.z - 0.35 - (HB.z + HB.r)) / (HB.chain + HB.straps + HB.len / 2), 0, 0.5));
  function stepHeavy(dt) {
    const n = 4, h = dt / n;
    for (let i = 0; i < n; i++) {
      HP.vx += (-(GRAV / LP) * Math.sin(HP.ax) - 0.32 * HP.vx) * h;
      HP.ax += HP.vx * h;
      HP.vz += (-(GRAV / LP) * Math.sin(HP.az) - 0.32 * HP.vz) * h;
      HP.az += HP.vz * h;
      HP.vt += (-5.5 * HP.tw - 0.55 * HP.vt) * h;
      HP.tw += HP.vt * h;
      HP.wvx += (-160 * HP.wx - 7 * HP.wvx) * h;
      HP.wx += HP.wvx * h;
      HP.wvz += (-160 * HP.wz - 7 * HP.wvz) * h;
      HP.wz += HP.wvz * h;
      HP.vsq += (-520 * HP.sq - 16 * HP.vsq) * h;
      HP.sq += HP.vsq * h;
    }
    HP.ax = clamp(HP.ax, -0.7, 0.7);
    HP.az = clamp(HP.az, -0.7, 0.7);
    if (HP.ax < AX_NEAR) {
      HP.ax = AX_NEAR;
      if (HP.vx < 0) HP.vx = -HP.vx * 0.3;
    }
  }
  const SP = { phi: 0, vphi: 0, psi: 0, vpsi: 0, contacts: 0, sincePunch: 0, lastContact: 0, ring: 0 };
  function stepSpeed(dt, now) {
    const n = 10, h = dt / n, L = 0.27 * 0.62;
    for (let i = 0; i < n; i++) {
      SP.vphi += (-(GRAV / L) * Math.sin(SP.phi) - 0.3 * SP.vphi) * h;
      SP.phi += SP.vphi * h;
      SP.vpsi += (-(GRAV / L) * Math.sin(SP.psi) - 1.2 * SP.vpsi) * h;
      SP.psi += SP.vpsi * h;
      if (Math.abs(SP.phi) > SB.phiMax) {
        const sp = Math.abs(SP.vphi);
        SP.phi = Math.sign(SP.phi) * SB.phiMax;
        SP.vphi = -SP.vphi * 0.75;
        if (sp > 2.5) {
          SP.contacts++;
          SP.sincePunch++;
          SP.lastContact = now;
          SP.ring = 1;
          sfxBoard(clamp(sp / 16, 0.15, 1), SP.phi > 0);
          G.sb.contacts++;
        }
      }
    }
    SP.psi = clamp(SP.psi, -0.9, 0.9);
  }
  const PD = { win: 0.12, v: 2.5, ext1: 0.55, above: 0.6, below: 0.45, side: 0.7, ys: 0.12, rise: 0.25, rwin: 0.3, back: 0.12, gap: 0.3, hipv: 0.8 };
  const PDS = { v: 1.6, below: 0.3, gap: 0.16 };
  const det = { raw: null, torso: null, l: { h: [], h2: [], last: -9, armed: true }, r: { h: [], h2: [], last: -9, armed: true }, hip: [], lastAny: -9 };
  function readPicturePunches(nowS) {
    const ri = BodyMovin.rawImg;
    if (!ri || ri === det.raw || !ri.lShoulder || !ri.rShoulder || !ri.lHip || !ri.rHip || !ri.lHand || !ri.rHand) return;
    det.raw = ri;
    if (performance.now() - (BodyMovin.imgAt || 0) > 300) return;
    const ar = BodyMovin.imgAR || 0.5625, S = (k) => [ri[k][0] * ar, ri[k][1]];
    const ls = S("lShoulder"), rs = S("rShoulder"), lh = S("lHip"), rh = S("rHip");
    const ch = [(ls[0] + rs[0]) / 2, (ls[1] + rs[1]) / 2], hp = [(lh[0] + rh[0]) / 2, (lh[1] + rh[1]) / 2];
    const T = Math.hypot(ch[0] - hp[0], ch[1] - hp[1]);
    if (T < 0.03) return;
    det.torso = det.torso === null ? T : det.torso + 0.05 * (T - det.torso);
    const torso = det.torso;
    det.hip.push([nowS, hp[1] / torso]);
    while (det.hip.length > 1 && nowS - det.hip[0][0] > 0.12) det.hip.shift();
    const hipv = det.hip.length > 1 ? Math.abs(det.hip[det.hip.length - 1][1] - det.hip[0][1]) / Math.max(1e-3, det.hip[det.hip.length - 1][0] - det.hip[0][0]) : 0;
    const ok = (BodyMovin.present === true || BodyMovin.simulating) && G.state === "play";
    if (G.mode === "heavy") readPictureKicks(nowS, ri, S, hp, torso, ok);
    const kicking = kd.cand.l || kd.cand.r || nowS - kd.last < 0.3;
    for (const s of ["l", "r"]) {
      const d = det[s], sh = S(s + "Shoulder"), hd = S(s + "Hand"), rel = [(hd[0] - sh[0]) / torso, (hd[1] - sh[1]) / torso];
      d.h.push([nowS, rel]);
      while (d.h.length > 1 && nowS - d.h[0][0] > PD.win) d.h.shift();
      d.h2.push([nowS, rel]);
      while (d.h2.length > 1 && nowS - d.h2[0][0] > PD.rwin) d.h2.shift();
      if (d.h.length < 2 || nowS - d.h[0][0] < PD.win * 0.6) continue;
      const r0 = d.h[0][1], v = Math.hypot(rel[0] - r0[0], rel[1] - r0[1]) / Math.max(1e-3, nowS - d.h[0][0]);
      const ext = Math.hypot(rel[0], rel[1]), rise = Math.max(...d.h2.map((x) => x[1][1])) - rel[1];
      let jump = 0;
      for (let i = 1; i < d.h.length; i++) jump = Math.max(jump, Math.hypot(d.h[i][1][0] - d.h[i - 1][1][0], d.h[i][1][1] - d.h[i - 1][1][1]));
      const teleport = jump > 0.55 && jump > 0.75 * Math.hypot(rel[0] - r0[0], rel[1] - r0[1]);
      let strike, power;
      if (teleport) {
        d.last = nowS;
        continue;
      }
      if (G.mode === "speed") {
        strike = v > PDS.v && rel[1] < PDS.below && rel[1] > -PD.above - 0.2 && Math.abs(rel[0]) < PD.side + 0.1 && hipv < PD.hipv;
        power = clamp((v - 1.2) / 5, 0.2, 1);
        if (!d.armed && (v < PDS.v * 0.6 || nowS - d.last > 0.45)) d.armed = true;
      } else {
        const a1 = v > PD.v && ext < PD.ext1 && rel[1] > -PD.above && rel[1] < PD.below && Math.abs(rel[0]) < PD.side;
        const a2 = rel[1] < PD.ys && rel[1] > -PD.above && ext < PD.ext1 && rise > PD.rise && Math.abs(rel[0]) < PD.side;
        strike = (a1 || a2) && hipv < PD.hipv;
        power = clamp(Math.max((v - 1.5) / 6, rise / 0.75), 0.25, 1);
        if (!d.armed && rel[1] > PD.ys + PD.back) d.armed = true;
      }
      if (strike && d.armed && nowS - d.last > (G.mode === "speed" ? PDS.gap : PD.gap)) {
        d.last = nowS;
        d.armed = false;
        if (ok && !kicking) fallbackHand(s === "l" ? "L" : "R", power, "picture", rel[0] - r0[0]);
      }
    }
  }
  BodyMovin.on("punchL", (e) => {
    if (e && e.from === "picture") return;
    fallbackHand("L", clamp(e && e.power || 0.6, 0.3, 1), "engine");
  });
  BodyMovin.on("punchR", (e) => {
    if (e && e.from === "picture") return;
    fallbackHand("R", clamp(e && e.power || 0.6, 0.3, 1), "engine");
  });
  const KD = { lift: 0.55, knee: 0.3, rise: 0.45, win: 0.4, back: 0.3, hold: 2, plant: 0.5, gap: 0.4, bwin: 3, nmin: 8, reset: 1, stand: 1.05 };
  const kd = { base: null, buf: [], out: null, h: [], cand: { l: null, r: null }, armed: { l: true, r: true }, last: -9, ext: { l: 0, r: 0 } };
  const median = (a) => {
    const b = [...a].sort((x, y) => x - y), n = b.length;
    return n % 2 ? b[(n - 1) / 2] : (b[n / 2 - 1] + b[n / 2]) / 2;
  };
  function readPictureKicks(nowS, ri, S, hp, torso, ok) {
    const inside = (k) => ri[k] && ri[k][1] > 0.01 && ri[k][1] < 0.985;
    if (!ri.lKnee || !ri.rKnee || !inside("lFoot") || !inside("rFoot")) {
      kd.h.length = 0;
      kd.cand.l = kd.cand.r = null;
      legsDown();
      if (kd.out === null) kd.out = nowS;
      else if (nowS - kd.out > KD.reset) {
        kd.buf.length = 0;
        kd.base = null;
      }
      return;
    }
    kd.out = null;
    const v = {};
    for (const s of ["l", "r"]) {
      const f = S(s + "Foot"), k = S(s + "Knee");
      v["f" + s] = (f[1] - hp[1]) / torso;
      v["k" + s] = (k[1] - hp[1]) / torso;
      v["a" + s] = f[1] / torso;
      v["x" + s] = f[0] / torso;
      const h = S(s + "Hip"), lt = Math.hypot(k[0] - h[0], k[1] - h[1]) + Math.hypot(f[0] - k[0], f[1] - k[1]);
      v["e" + s] = lt > 0.2 * torso ? Math.hypot(f[0] - h[0], f[1] - h[1]) / lt : 0;
    }
    const B = kd.base || (kd.base = { fl: v.fl, fr: v.fr, kl: v.kl, kr: v.kr });
    const standing = Math.min(B.fl, B.fr) > KD.stand;
    const up = { l: B.fl - v.fl, r: B.fr - v.fr };
    {
      const L = fighter.legLift;
      for (const s of ["l", "r"]) {
        const o = s === "l" ? "r" : "l", rel = up[s] - up[o], kn = B["k" + s] - v["k" + s];
        let w = kn > 0.12 && standing ? clamp((rel - 0.25) / 0.35, 0, 1) : 0;
        const c = kd.cand[s], e = clamp((v["e" + s] - 0.72) / 0.22, 0, 1);
        if (c) w = Math.max(w, nowS - c.t < 0.35 ? 1 : 0);
        const ext = c ? Math.max(e, clamp((nowS - c.t) / 0.18, 0, 1)) : e;
        kd.ext[s] += (ext - kd.ext[s]) * 0.5;
        L[s] += (w - L[s]) * (w > L[s] ? 0.6 : 0.35);
        if (L[s] < 0.02) L[s] = 0;
      }
    }
    kd.h.push([nowS, v, up]);
    while (kd.h.length > 1 && nowS - kd.h[0][0] > KD.win) kd.h.shift();
    let busy = false;
    for (const s of ["l", "r"]) {
      const o = s === "l" ? "r" : "l", rel = up[s] - up[o], kn = B["k" + s] - v["k" + s], c = kd.cand[s];
      if (c) {
        busy = true;
        if (rel > c.peak) {
          c.peak = rel;
          c.x = ri[s + "Foot"][0];
        }
        if (nowS - c.t > KD.hold) {
          kd.cand[s] = null;
          kd.armed[s] = false;
        } else if (rel < KD.back) {
          kd.cand[s] = null;
          kd.armed[s] = false;
          kd.last = nowS;
        }
        continue;
      }
      if (!kd.armed[s]) {
        if (rel < KD.back) kd.armed[s] = true;
        continue;
      }
      if (nowS - kd.h[0][0] < KD.win * 0.5 || nowS - kd.last < KD.gap || kd.cand[o]) continue;
      let lo = Infinity, om = 0;
      for (const [, hv, hu] of kd.h) {
        lo = Math.min(lo, hu[s] - hu[o]);
        om = Math.max(om, Math.hypot(v["x" + o] - hv["x" + o], v["a" + o] - hv["a" + o]));
      }
      if (standing && rel > KD.lift && kn > KD.knee && rel - lo > KD.rise && om < KD.plant) {
        kd.cand[s] = { t: nowS, peak: rel, x: ri[s + "Foot"][0] };
        kd.last = nowS;
        G.picKicks++;
        fighter.legLift[s] = Math.max(fighter.legLift[s], 0.85);
        if (ok) strikeFoot(s === "l" ? "L" : "R", rel, ri[s + "Foot"][0]);
      }
    }
    if (!busy) {
      kd.buf.push([nowS, v.fl, v.fr, v.kl, v.kr]);
      while (kd.buf.length && nowS - kd.buf[0][0] > KD.bwin) kd.buf.shift();
      if (kd.buf.length >= KD.nmin) ["fl", "fr", "kl", "kr"].forEach((k, i) => {
        B[k] = median(kd.buf.map((r) => r[i + 1]));
      });
      else Object.assign(B, { fl: v.fl, fr: v.fr, kl: v.kl, kr: v.kr });
    }
  }
  function legsDown() {
    fighter.legLift.l = fighter.legLift.r = 0;
  }
  function strikeFoot(side, peak, px) {
    if (G.state !== "play" || G.mode !== "heavy") return;
    const ft = fighter.foot(side === "L" ? "l" : "r"), v = ft.v;
    const lat = Math.abs(v.x) > 0.5 ? v.x : (side === "R" ? -1 : 1) * 1;
    const dir = new Vector3(lat, 0, -clamp(-v.z, 0.35, 0.8)).normalize();
    heavyStrike({ limb: "foot", side, power: clamp(0.3 + 0.45 * (peak - 0.4), 0.3, 1), height: peak, px, dir, src: "picture" });
  }
  const GLOVE_R = 0.09, contact = { l: { armed: true, at: -1e9 }, r: { armed: true, at: -1e9 } }, pend = { L: null, R: null };
  const _gl = new Vector3(), _ax = new Vector3();
  const sbC = { l: { armed: true, at: -1e9 }, r: { armed: true, at: -1e9 } }, _sb = new Vector3();
  function readSpeedContacts(now) {
    if (!fighter.has3D) return;
    sbBag.updateMatrixWorld(true);
    sbBag.localToWorld(_sb.set(0, -0.62 * SB.len, 0));
    const ok = (BodyMovin.present === true || BodyMovin.simulating) && G.state === "play", reach = SB.rMax + GLOVE_R;
    for (const s of ["l", "r"]) {
      const g = fighter.glove(s), C = sbC[s];
      if (!g.seen) continue;
      const dx = _sb.x - g.p.x, dy = _sb.y - g.p.y, dz = _sb.z - g.p.z, d = Math.hypot(dx, dy * 0.6, dz);
      if (!C.armed && d > reach + 0.06) C.armed = true;
      if (!fighter.newFrame || !C.armed || d > reach) continue;
      const into = (g.v.x * dx + g.v.y * dy + g.v.z * dz) / Math.max(1e-3, d), sp = g.v.length();
      if (into < 0.35 || sp < 0.6) continue;
      C.armed = false;
      C.at = now;
      contact[s].at = now;
      if (!ok) continue;
      G.sbTouch = (G.sbTouch || 0) + 1;
      const t = performance.now() / 1e3, side = s === "l" ? "L" : "R";
      if (t - lastHand[side] < 0.12) continue;
      lastHand[side] = t;
      const nx = g.v.x / sp * 0.6 + dx / d * 0.4, nz2 = g.v.z / sp * 0.6 + dz / d * 0.4;
      speedPunch(side, clamp((sp - 0.5) / 2.2, 0.25, 1), { fwd: -nz2, lat: nx });
    }
  }
  function readContacts(now) {
    if (G.mode === "speed") return readSpeedContacts(now);
    if (G.mode !== "heavy" || !fighter.has3D) return;
    bagTw.updateMatrixWorld(true);
    const ok = (BodyMovin.present === true || BodyMovin.simulating) && G.state === "play", kicking = kd.cand.l || kd.cand.r;
    for (const s of ["l", "r"]) {
      const g = fighter.glove(s);
      if (!g.seen) continue;
      _gl.copy(g.p);
      bagTw.worldToLocal(_gl);
      const inY = _gl.y < -HB.straps + 0.03 && _gl.y > -HB.straps - HB.len, rad = Math.hypot(_gl.x, _gl.z), reach = HB.r + GLOVE_R, C = contact[s];
      if (inY && rad < HB.r + GLOVE_R * 0.6) {
        const k = (HB.r + GLOVE_R * 0.6) / Math.max(1e-4, rad);
        _gl.x *= k;
        _gl.z *= k;
        bagTw.localToWorld(_gl);
        fighter.sprites[s].position.copy(_gl);
        _gl.copy(g.p);
        bagTw.worldToLocal(_gl);
      }
      if (!C.armed && (rad > reach + 0.05 || !inY)) C.armed = true;
      if (!fighter.newFrame || !C.armed || !inY || rad > reach) continue;
      bagTw.getWorldPosition(_ax);
      const tx = _ax.x - g.p.x, tz = _ax.z - g.p.z, tl = Math.hypot(tx, tz) || 1;
      const into = (g.v.x * tx + g.v.z * tz) / tl, sp = g.v.length();
      if (into < 0.45 || sp < 0.7) continue;
      C.armed = false;
      C.at = now;
      if (!ok || kicking) continue;
      contactStrike("hand", s === "l" ? "L" : "R", g.p.clone().add(_a.set(tx, 0, tz).multiplyScalar(-HB.r / tl + 1)).setY(g.p.y), g.v.clone());
    }
  }
  function contactStrike(limb, side, p, v) {
    if (G.state !== "play") return;
    const t = performance.now() / 1e3;
    if (t - lastHand[side] < 0.25) return;
    lastHand[side] = t;
    const fwd = -v.z, lat = v.x, up = v.y, lead = G.lead || "L";
    const kind = up > 0.9 && up > Math.max(fwd, 0) && up > Math.abs(lat) ? "UPPERCUT" : Math.abs(lat) > 0.6 && Math.abs(lat) > 0.8 * Math.max(fwd, 0) ? "HOOK" : side === lead ? "JAB" : "CROSS";
    const dir = new Vector3(lat, 0, v.z);
    if (dir.lengthSq() < 0.04) dir.set(0, 0, -1);
    dir.normalize();
    heavyStrike({ limb, side, power: clamp((v.length() - 0.6) / 2.4, 0.25, 1), p, dir, kind, src: "3d" });
  }
  function fallbackHand(side, power, src, sweep = 0) {
    if (G.state !== "play") return;
    const c = contact[side === "L" ? "l" : "r"], now = performance.now();
    if (!fighter.has3D) return strikeHand(side, power, src, sweep);
    if (now - c.at < 150) return;
    pend[side] = { power, src, sweep, t: now };
  }
  function flushFallback(now) {
    for (const side of ["L", "R"]) {
      const q = pend[side];
      if (!q || now - q.t < 150) continue;
      pend[side] = null;
      if (contact[side === "L" ? "l" : "r"].at > q.t - 150) continue;
      strikeHand(side, q.power, q.src, q.sweep);
    }
  }
  const lastHand = { L: -9, R: -9 };
  function strikeHand(side, power, src, sweep = 0) {
    if (G.state !== "play") return;
    const t = performance.now() / 1e3;
    if (t - lastHand[side] < 0.25) return;
    lastHand[side] = t;
    if (G.mode === "speed") return speedPunch(side, power);
    heavyStrike({ limb: "hand", side, power, sweep, src });
  }
  const _v = new Vector3(), _w = new Vector3(), _c = new Vector3();
  function toScreen(p) {
    _v.copy(p).project(camera);
    return { x: (_v.x + 1) / 2 * W, y: (1 - _v.y) / 2 * H };
  }
  function bagPoint(f, s, out = new Vector3()) {
    bagTw.updateMatrixWorld(true);
    _c.copy(camera.position);
    bagTw.worldToLocal(_c);
    const a0 = Math.atan2(_c.x, _c.z), a = a0 + s * 0.95;
    out.set(Math.sin(a) * HB.r, -HB.straps - f * HB.len, Math.cos(a) * HB.r);
    return bagTw.localToWorld(out);
  }
  function bagScreen() {
    const top = toScreen(bagPoint(0, 0)), bot = toScreen(bagPoint(1, 0)), l = toScreen(bagPoint(0.4, -1)), r = toScreen(bagPoint(0.4, 1));
    return { top, bot, cx: (top.x + bot.x) / 2, half: Math.abs(r.x - l.x) / 2 };
  }
  function limbScreen(limb, side) {
    const g = limb === "hand" ? fighter.glove(side === "L" ? "l" : "r") : fighter.foot(side === "L" ? "l" : "r");
    if (g && g.seen && fighter.fresh) return toScreen(limb === "hand" ? fighter.sprites[side === "L" ? "l" : "r"].position : g.p);
    if (limb === "hand") {
      const h = side === "L" ? BodyMovin.hands.left : BodyMovin.hands.right;
      return h.seen ? { x: h.x * W, y: h.y * H } : null;
    }
    return { x: W / 2 + (side === "L" ? -1 : 1) * U * 0.15, y: H * 0.92 };
  }
  const NAMES = { hand: { L: "LEFT", R: "RIGHT" } };
  function heavyStrike(o) {
    const bs = bagScreen(), from = limbScreen(o.limb, o.side);
    let f, s, lateral, name;
    if (o.limb === "hand") {
      const hy = from ? from.y : H * 0.35, hx = from ? from.x : bs.cx + (o.side === "L" ? -1 : 1) * bs.half * 0.5;
      if (from && Math.abs(hx - bs.cx) > Math.max(bs.half * 5, W * 0.3)) {
        G.stats.whiff++;
        sfxWhiff();
        return;
      }
      f = clamp((hy - bs.top.y) / Math.max(1, bs.bot.y - bs.top.y), 0.08, 0.6);
      s = clamp((hx - bs.cx) / Math.max(1, bs.half) * 0.55, -0.85, 0.85);
      const hook = Math.abs(o.sweep || 0) > 0.35;
      lateral = hook ? -Math.sign(o.sweep) * 1.2 : -s * 0.6;
      name = (o.side === "L" ? "LEFT " : "RIGHT ") + (hook ? "HOOK" : f > 0.42 ? "BODY SHOT" : o.side === (G.lead || "L") ? "JAB" : "CROSS");
    } else {
      f = clamp(0.98 - 0.22 * (o.height || 0.8), 0.55, 0.92);
      s = clamp((o.side === "L" ? -1 : 1) * 0.35, -0.85, 0.85);
      lateral = -s * 0.4;
      name = (o.side === "L" ? "LEFT " : "RIGHT ") + "KICK";
    }
    const kick = o.limb === "foot", power = clamp(o.power, 0.2, 1);
    const dir = o.dir ? _w.copy(o.dir).setY(0).normalize() : _w.set(lateral, 0, -1).normalize();
    let p;
    if (o.p) {
      p = o.p.clone();
      const lp2 = p.clone();
      bagTw.worldToLocal(lp2);
      f = clamp((-HB.straps - lp2.y) / HB.len, 0, 1);
    } else if (o.dir) {
      p = bagPoint(f, 0);
      bagTw.getWorldPosition(_a);
      p.x = _a.x - dir.x * HB.r;
      p.z = _a.z - dir.z * HB.r;
    } else p = bagPoint(f, s);
    {
      bagTw.getWorldPosition(_a);
      const nx = _a.x - p.x, nz2 = _a.z - p.z, nl = Math.hypot(nx, nz2);
      if (nl > 1e-3) {
        dir.x = dir.x * 0.55 + nx / nl * 0.45;
        dir.z = dir.z * 0.55 + nz2 / nl * 0.45;
      }
      dir.x *= 1.9;
      dir.normalize();
    }
    if (o.kind) name = (o.side === "L" ? "LEFT " : "RIGHT ") + (o.kind !== "HOOK" && o.kind !== "UPPERCUT" && f > 0.42 ? "BODY SHOT" : o.kind);
    {
      const sc = toScreen(p), bs2 = bagScreen();
      s = clamp((sc.x - bs2.cx) / Math.max(1, bs2.half), -1, 1);
    }
    const J = (kick ? 0.45 : 0.34) * (0.45 + 0.75 * power);
    const depth = HB.hookY - p.y, lev = depth / (LP * LP) * 1.6;
    const returning = HP.vx < -0.12 && HP.ax > 0.025;
    HP.vx += -dir.z * J * lev;
    HP.vz += dir.x * J * lev;
    bagTw.getWorldPosition(_a);
    const rx = p.x - _a.x, rz = p.z - _a.z;
    HP.vt += (rz * dir.x - rx * dir.z) * J * 15;
    HP.wvx -= -dir.z * J * 1.4;
    HP.wvz -= dir.x * J * 1.4;
    HP.vsq += J * 3.2;
    const lp = p.clone();
    bagMesh.worldToLocal(lp);
    HP.dents.push({ p: lp, depth: 0.03 + 0.035 * power * (kick ? 1.3 : 1), rad: kick ? 0.13 : 0.09 });
    if (HP.dents.length > 5) HP.dents.shift();
    puff(p, Math.round(4 + power * 8 * (kick ? 1.4 : 1)), power, dir);
    const t = G.time;
    G.combo = t - G.lastStrikeT < 2 ? G.combo + 1 : 1;
    G.lastStrikeT = t;
    G.maxCombo = Math.max(G.maxCombo, G.combo);
    G.mult = Math.min(4, 1 + Math.floor(G.combo / 5));
    let bull = false;
    if (G.target && G.target.live) {
      const tg = G.target;
      if (Math.abs(f - tg.f) < 0.2 && Math.abs(s - tg.s) < 0.65 && (tg.kick ? kick : !kick || tg.f > 0.4)) {
        bull = true;
        tg.live = false;
        tg.hitAt = t;
        G.stats.bulls++;
      }
    }
    const pts = Math.round((50 + 150 * power) * (kick ? 1.5 : 1) * (returning ? 1.5 : 1) * (bull ? 2 : 1)) * G.mult;
    if (t >= 0) G.score += pts;
    G.stats.strikes++;
    if (kick) G.stats.kicks++;
    else G.stats.punches++;
    if (returning) G.stats.counters++;
    G.stats.bestPower = Math.max(G.stats.bestPower, power);
    G.lastPower = power;
    G.powerFlash = 1;
    G.strikeTimes.push(t);
    G.lastStrike = { limb: o.limb, side: o.side, power: +power.toFixed(2), f: +f.toFixed(2), s: +s.toFixed(2), name, returning, bull, src: o.src || "engine", t: +t.toFixed(2) };
    G.log.push(G.lastStrike);
    if (G.log.length > 200) G.log.shift();
    sfxThud(power, kick);
    shake(0.12 + power * (kick ? 0.55 : 0.35));
    if (power > 0.8 || returning) flash(16774368, 0.1);
    const sp = toScreen(p), col = kick ? ORANGE : o.side === "L" ? PINK : BLUE;
    rings.push({ x: sp.x, y: sp.y, r: U * (0.03 + 0.03 * power), life: 0.45, max: 0.45, col, w: 1 + power * 1.5 });
    if (from) streaks.push({ x0: from.x, y0: from.y, x1: sp.x, y1: sp.y, col, life: 0.22, max: 0.22, w: kick ? 1.6 : 1 });
    for (let i = 0; i < 10 + power * 16; i++) {
      const a = Math.random() * 6.283, v = U * (0.3 + Math.random() * 0.9) * (0.5 + power);
      sparks.push({ x: sp.x, y: sp.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v * 0.7, life: 0.25 + Math.random() * 0.25, max: 0.5, col: Math.random() < 0.6 ? "#fff6ea" : col, r: U * (3e-3 + Math.random() * 4e-3) });
    }
    const label = returning ? "COUNTER!" : bull ? "BULLSEYE!" : power > 0.82 ? "POWER!" : name;
    const side = s >= 0 ? 1 : -1, size0 = returning || bull || power > 0.82 ? 0.06 : 0.045;
    let edge = toScreen(bagPoint(clamp(f, 0.1, 0.9), side)).x;
    const fp = fighterH.pose;
    if (fp && fighterH.opacity > 0.3) {
      for (const k of ["lS", "rS", "lE", "rE", "lP", "rP", "lH", "rH"]) if (fp[k]) {
        const q = toScreen(_a.set(fp[k][0], fp[k][1], FIGHTER.z));
        edge = side > 0 ? Math.max(edge, q.x) : Math.min(edge, q.x);
      }
    }
    const halfW = Math.max(label.length * size0 * 0.34, 0.12) * U;
    texts.length = 0;
    texts.push({ s: label, sub: t >= 0 ? "+" + pts : "", x: edge + side * (halfW + U * 0.03), y: sp.y - U * 0.04, col: returning || bull ? GOLD : "#ffffff", life: 0.95, max: 0.95, size: returning || bull || power > 0.82 ? 0.06 : 0.045 });
    if (G.combo >= 5 && G.combo % 5 === 0) {
      G.comboFlash = 1;
      sfxCombo();
    }
  }
  function updateDents(dt) {
    if (!HP.dents.length && !HP.dentsOn) return;
    const pos = bagGeo.attributes.position.array;
    for (const d of HP.dents) d.depth *= Math.exp(-dt * 7);
    HP.dents = HP.dents.filter((d) => d.depth > 8e-4);
    for (let i = 0; i < pos.length; i += 3) {
      const bx = bagBase[i], by = bagBase[i + 1], bz = bagBase[i + 2], r = Math.hypot(bx, bz);
      let push = 0;
      for (const d of HP.dents) {
        const q = ((bx - d.p.x) ** 2 + (by - d.p.y) ** 2 + (bz - d.p.z) ** 2) / (d.rad * d.rad);
        if (q < 4) push += d.depth * Math.exp(-q);
      }
      const k = r > 1e-4 ? Math.max(0, r - push) / r : 1;
      pos[i] = bx * k;
      pos[i + 1] = by;
      pos[i + 2] = bz * k;
    }
    bagGeo.attributes.position.needsUpdate = true;
    bagGeo.computeVertexNormals();
    HP.dentsOn = HP.dents.length > 0;
  }
  function speedPunch(side, power, dir = null) {
    const t = G.time, sb = G.sb;
    const inRhythm = sb.hits > 0 && t - sb.lastHitT < 1.6 && t - sb.lastHitT > 0.2 && SP.sincePunch >= 1;
    const fresh = Math.abs(SP.vphi) < 1.5 && Math.abs(SP.phi) < 0.35;
    if (!dir) {
      SP.vphi = Math.max(SP.vphi, 0) + 15.5 + 8 * power;
      SP.vpsi += (side === "L" ? 1 : -1) * 0.9;
    } else {
      const f = dir.fwd, J = 15.5 + 8 * power;
      if (f >= -0.2) SP.vphi = Math.max(SP.vphi, 0) + J * clamp(0.6 + f * 0.5, 0.6, 1.1);
      else SP.vphi = Math.min(SP.vphi, 0) - J * clamp(0.6 - f * 0.5, 0.6, 1.1);
      SP.vpsi += clamp(dir.lat, -1, 1) * 4.5;
    }
    SP.sincePunch = 0;
    sb.hits++;
    sb.streak = inRhythm ? sb.streak + 1 : fresh ? Math.max(1, sb.streak) : t - sb.lastHitT < 0.2 ? sb.streak : 1;
    sb.maxStreak = Math.max(sb.maxStreak, sb.streak);
    if (inRhythm) sb.rhythm++;
    sb.lastHitT = t;
    sb.times.push(t);
    const pts = Math.round((inRhythm ? 40 : 15) + 8 * Math.min(25, sb.streak)) * (sb.pace >= 1 ? 2 : 1);
    if (t >= 0) G.score += pts;
    G.stats.strikes++;
    G.stats.punches++;
    G.lastStrike = { limb: "hand", side, power: +power.toFixed(2), rhythm: inRhythm, t: +t.toFixed(2) };
    G.log.push(G.lastStrike);
    sfxSpeedHit(power);
    sbMesh.getWorldPosition(_a);
    const sp = toScreen(_a.add(_w.set(0, -SB.len * 0.6, 0)));
    rings.push({ x: sp.x, y: sp.y, r: U * 0.03, life: 0.3, max: 0.3, col: side === "L" ? PINK : BLUE, w: 1 });
    const from = limbScreen("hand", side);
    if (from) streaks.push({ x0: from.x, y0: from.y, x1: sp.x, y1: sp.y, col: side === "L" ? PINK : BLUE, life: 0.18, max: 0.18, w: 0.8 });
    if (inRhythm && sb.streak > 1 && sb.streak % 5 === 0) {
      G.comboFlash = 1;
      sfxCombo();
    }
  }
  const TARGETS = [{ f: 0.15, s: -0.45 }, { f: 0.15, s: 0.45 }, { f: 0.42, s: 0 }, { f: 0.3, s: -0.4 }, { f: 0.3, s: 0.4 }, { f: 0.3, s: 0 }];
  const TARGETS_ON = new URLSearchParams(location.search).has("targets");
  function updateTarget(t) {
    var _a2;
    if (G.mode !== "heavy") return;
    const tg = G.target;
    const life = lerp(6, 3.2, clamp(t / ROUND, 0, 1)) + G.ease * 3;
    if (!tg || !tg.live && t - ((_a2 = tg.hitAt) != null ? _a2 : tg.endAt) > 0.9 || tg.live && t > tg.until) {
      if (tg && tg.live) {
        tg.live = false;
        tg.endAt = t;
        G.ease = Math.min(1, G.ease + 0.25);
        G.target = { ...tg, live: false, endAt: t, gone: true };
        return;
      }
      if (tg && tg.hitAt !== void 0) G.ease = Math.max(0, G.ease - 0.2);
      if (t > ROUND - 2) return;
      let k;
      do {
        k = Math.floor(Math.random() * TARGETS.length);
      } while (tg && TARGETS[k] === tg.def);
      G.target = { ...TARGETS[k], def: TARGETS[k], live: true, born: t, until: t + life };
    }
  }
  let ac = null, master, sfxBus, noiseBuf;
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
    comp.threshold.value = -12;
    comp.ratio.value = 4;
    comp.attack.value = 3e-3;
    comp.release.value = 0.2;
    const lim = ac.createDynamicsCompressor();
    lim.threshold.value = -4;
    lim.knee.value = 0;
    lim.ratio.value = 20;
    lim.attack.value = 1e-3;
    lim.release.value = 0.12;
    master.connect(comp);
    comp.connect(lim);
    lim.connect(ac.destination);
    sfxBus = ac.createGain();
    sfxBus.gain.value = SFX_GAIN;
    sfxBus.connect(master);
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
  const ATTACK_MIN = 8e-3, SFX_GAIN = 0.34;
  function env(g, t, a, peak, dec) {
    a = Math.max(a, ATTACK_MIN);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(Math.max(2e-4, peak), t + a);
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
  }
  function nz(dest, t, dec, type, freq, q, peak, a = 1e-3, f2) {
    t = Math.max(t, ac.currentTime);
    const n = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    n.buffer = noiseBuf;
    f.type = type;
    f.frequency.setValueAtTime(freq, t);
    f.Q.value = q;
    if (f2) f.frequency.exponentialRampToValueAtTime(f2, t + a + dec);
    env(g, t, a, peak, dec);
    n.connect(f);
    f.connect(g);
    g.connect(dest);
    n.start(t, Math.random() * 1.2);
    n.stop(t + a + dec + 0.05);
  }
  function sfxThud(power, kick) {
    if (!audioOK()) return;
    const t = ac.currentTime, v = 0.3 + 0.45 * power;
    tone(sfxBus, "sine", kick ? 85 : 105, t, 2e-3, 0.9 * v, 0.22 + 0.2 * power, 38);
    nz(sfxBus, t, 0.13 + 0.08 * power, "lowpass", kick ? 420 : 620, 0.9, 0.8 * v, 1e-3, 140);
    nz(sfxBus, t, 0.035, "highpass", 2600, 0.8, 0.45 * v);
    for (let i = 0; i < 3 + Math.round(power * 4); i++) nz(sfxBus, t + 0.05 + Math.random() * 0.35, 0.025, "bandpass", 4200 + Math.random() * 2500, 6, 0.05 * v);
  }
  function sfxBoard(v, back) {
    if (!audioOK()) return;
    const t = ac.currentTime;
    nz(sfxBus, t, 0.03, "bandpass", back ? 1500 : 1900, 1.4, 0.55 * v);
    tone(sfxBus, "sine", back ? 150 : 175, t, 1e-3, 0.4 * v, 0.06, 90);
  }
  function sfxSpeedHit(power) {
    if (!audioOK()) return;
    const t = ac.currentTime;
    nz(sfxBus, t, 0.04, "highpass", 1800, 0.8, 0.35 + 0.3 * power);
    tone(sfxBus, "sine", 210, t, 1e-3, 0.3, 0.05, 120);
  }
  function sfxWhiff() {
    if (!audioOK()) return;
    nz(sfxBus, ac.currentTime, 0.18, "bandpass", 700, 1.2, 0.18, 0.03, 2200);
  }
  function sfxCombo() {
    if (!audioOK()) return;
    const t = ac.currentTime;
    [523.25, 659.26, 783.99, 1046.5].forEach((f, i) => tone(sfxBus, "triangle", f, t + i * 0.06, 3e-3, 0.08, 0.25));
  }
  function sfxBlip(f = 880) {
    if (!audioOK()) return;
    tone(sfxBus, "sine", f, ac.currentTime, 2e-3, 0.15, 0.12, f * 1.5);
  }
  function sfxBell() {
    if (!audioOK()) return;
    const t = ac.currentTime;
    for (let i = 0; i < 3; i++) {
      tone(sfxBus, "sine", 1180, t + i * 0.22, 2e-3, 0.25, 0.9);
      tone(sfxBus, "sine", 2950, t + i * 0.22, 2e-3, 0.06, 0.5);
    }
  }
  const G = {
    state: "title",
    mode: Q.get("mode") === "speed" ? "speed" : localStorage.bop_mode === "speed" ? "speed" : "heavy",
    score: 0,
    combo: 0,
    maxCombo: 0,
    mult: 1,
    time: 0,
    t0: 0,
    lastStrikeT: -9,
    strikeTimes: [],
    log: [],
    lastStrike: null,
    lastPower: 0,
    powerFlash: 0,
    target: null,
    ease: 0,
    stats: null,
    sb: null,
    best: 0,
    result: null
  };
  if (Q.get("mode") === "heavy") G.mode = "heavy";
  window.__game = G;
  G.audio = () => ac ? ac.state : "none";
  G.quality = () => RZ.quality;
  G.bag = () => ({ ax: +HP.ax.toFixed(4), az: +HP.az.toFixed(4), tw: +HP.tw.toFixed(4), vx: +HP.vx.toFixed(4), vz: +HP.vz.toFixed(4), dents: HP.dents.length });
  G.speedBag = () => ({ phi: +SP.phi.toFixed(3), vphi: +SP.vphi.toFixed(3), contacts: SP.contacts });
  G.buttons = () => buttons.map((b) => ({ id: b.id, x: b.x / W, y: b.y / H, w: b.w / W, h: b.h / H }));
  G.det = det;
  G.kd = kd;
  G.fighter = fighter;
  G.contact = contact;
  G.picKicks = 0;
  G.endRound = () => endRound(performance.now());
  G.testStrike = () => heavyStrike({ limb: "foot", side: "R", power: 0.95, lift: 0.8 });
  const freshStats = () => ({ strikes: 0, punches: 0, kicks: 0, counters: 0, bulls: 0, whiff: 0, bestPower: 0 });
  G.stats = freshStats();
  G.sb = { hits: 0, rhythm: 0, streak: 0, maxStreak: 0, contacts: 0, lastHitT: -9, times: [], pace: 0, paceTarget: 70 };
  let endAt = 0, lockUntil = 0, titleAt = performance.now();
  const rings = [], texts = [], sparks = [], streaks = [];
  function showMode(m) {
    heavy.visible = hbChain.visible = m === "heavy";
    speed.visible = m === "speed";
    if (m !== "heavy") legsDown();
    fighterH.enabled = m === "heavy";
    fighterS.enabled = m === "speed";
    fighter = m === "speed" ? fighterS : fighterH;
    G.fighter = fighter;
  }
  showMode(G.mode);
  function startRound(now, mode = G.mode) {
    audioInit();
    try {
      BodyMovin.music("boxing");
    } catch (e) {
    }
    G.mode = mode;
    try {
      localStorage.bop_mode = mode;
    } catch (_) {
    }
    showMode(mode);
    Object.assign(HP, { ax: 0, vx: 0, az: 0, vz: 0, tw: 0, vt: 0, wx: 0, wvx: 0, wz: 0, wvz: 0, sq: 0, vsq: 0 });
    Object.assign(SP, { phi: 0, vphi: 0, psi: 0, vpsi: 0, sincePunch: 0 });
    Object.assign(G, { state: "play", score: 0, combo: 0, maxCombo: 0, mult: 1, time: -2, t0: now + 2e3, lastStrikeT: -9, strikeTimes: [], log: [], lastStrike: null, lastPower: 0, target: null, ease: 0, result: null });
    G.stats = freshStats();
    G.sb = { hits: 0, rhythm: 0, streak: 0, maxStreak: 0, contacts: 0, lastHitT: -9, times: [], pace: 0, paceTarget: 70 };
    rings.length = texts.length = sparks.length = streaks.length = 0;
    G.bellRung = false;
    BodyMovin.activity.activeSec = 0;
    BodyMovin.activity.kcal = 0;
    RZ.grace && RZ.grace(2500);
    sfxBlip(660);
  }
  function goHome() {
    location.href = "index.html";
  }
  function endRound(now) {
    const minutes = BodyMovin.activity.activeSec / 60, kcal = BodyMovin.activity.kcal, prevBest = BodyMovin.best(GAME);
    BodyMovin.saveSession({ game: GAME, score: G.score });
    if (BodyMovin.highScores) BodyMovin.highScores(GAME, G.score);
    G.best = BodyMovin.best(GAME);
    const spm = Math.round(G.stats.strikes / (ROUND / 60));
    G.result = { score: G.score, minutes, kcal, newBest: G.score > prevBest && G.score > 0, mode: G.mode, ...G.stats, maxCombo: G.maxCombo, spm, sb: { ...G.sb, times: void 0 } };
    G.state = "end";
    endAt = now;
    lockUntil = now + 1400;
    sfxBell();
  }
  function txt(s, x, y, size, col, align = "center", weight = 800, glow = 0, spacing = 0) {
    ctx.font = "".concat(weight, " ").concat(Math.round(size), "px ").concat(FONT);
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    if ("letterSpacing" in ctx) ctx.letterSpacing = spacing ? Math.round(spacing) + "px" : "0px";
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = Math.max(U * 8e-3, glow * 0.5);
    ctx.shadowOffsetY = U * 3e-3;
    ctx.fillStyle = col;
    ctx.fillText(s, x, y);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
  }
  function rr(x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  }
  let buttons = [], pending = null;
  Object.defineProperty(G, "buttons", { get: () => buttons.map((b) => ({ id: b.id, x: b.x / DPR, y: b.y / DPR, w: b.w / DPR, h: b.h / DPR })) });
  const HOV = { id: null, at: 0 };
  function button(id, x, y, w, h, label, now, action, opt = {}) {
    const locked = now < lockUntil;
    const raw = !locked && BodyMovin.handOver({ x, y, w, h }, W, H);
    if (HOV.id && HOV.id !== id && now - HOV.at > 300) HOV.id = null;
    const over = raw && (HOV.id === null || HOV.id === id);
    if (over) {
      HOV.id = id;
      HOV.at = now;
    } else if (HOV.id === id && !raw) HOV.id = null;
    const k = BodyMovin.dwell(id, over, now, opt.ms || 800);
    if (k === 1) pending = action;
    buttons.push({ id, x, y, w, h, action });
    const col = opt.col || GOLD, fill = k === 1 ? 1 : k, hl = opt.primary && (HOV.id === null || HOV.id === id);
    ctx.save();
    rr(x, y, w, h, Math.min(h / 2, U * 0.05));
    ctx.fillStyle = hl ? rgba(col, 0.18) : "rgba(12,8,10,0.55)";
    ctx.fill();
    if (fill > 0) {
      ctx.save();
      rr(x, y, w, h, Math.min(h / 2, U * 0.05));
      ctx.clip();
      const gr = ctx.createLinearGradient(x, 0, x + w, 0);
      gr.addColorStop(0, rgba(col, 0.8));
      gr.addColorStop(1, rgba(col, 0.5));
      ctx.fillStyle = gr;
      ctx.fillRect(x, y, w * fill, h);
      ctx.restore();
    }
    rr(x, y, w, h, Math.min(h / 2, U * 0.05));
    ctx.lineWidth = Math.max(2, U * (hl ? 6e-3 : 4e-3));
    ctx.strokeStyle = rgba(col, over ? 1 : hl ? 0.95 : 0.5);
    if (over || hl) {
      ctx.shadowColor = col;
      ctx.shadowBlur = U * (over ? 0.04 : 0.02);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    if (opt.draw) opt.draw(x, y, w, h, fill > 0.5);
    else txt(label, x + w / 2, y + h / 2 + h * 0.02, Math.min(h * (opt.small ? 0.36 : 0.4), w * 0.84 / Math.max(1, label.length * 0.78)), fill > 0.5 ? "#160b02" : "#fff6e6", "center", 800, 0, h * 0.04);
    ctx.restore();
  }
  cv.addEventListener("pointerdown", (e) => {
    const x = e.clientX * DPR, y = e.clientY * DPR;
    for (const b of buttons) if (x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h) {
      audioInit();
      b.action(performance.now());
      return;
    }
    if (G.state === "play" && !BodyMovin.live) {
      const side = x < W / 2 ? "L" : "R", h = side === "L" ? BodyMovin.hands.left : BodyMovin.hands.right;
      if (G.mode === "heavy") {
        const bs = bagScreen();
        if (Math.abs(x - bs.cx) < bs.half * 3 && y > bs.top.y - U * 0.05 && y < bs.bot.y + U * 0.05) {
          const f = clamp((y - bs.top.y) / (bs.bot.y - bs.top.y), 0, 1);
          if (f > 0.65) heavyStrike({ limb: "foot", side, power: 0.8, lift: 0 });
          else {
            h.x = x / W;
            h.y = y / H;
            h.seen = true;
            heavyStrike({ limb: "hand", side, power: 0.8, sweep: 0, src: "mouse" });
          }
        }
      } else speedPunch(side, 0.8);
    }
  });
  addEventListener("keydown", (e) => {
    const now = performance.now();
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      if (G.state === "title") {
        G.mode = G.mode === "heavy" ? "speed" : "heavy";
        showMode(G.mode);
        sfxBlip(520);
      }
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (G.state === "title") {
        if (titleView === "pick") setTitleView("start");
        else startRound(now);
      } else if (G.state === "end" && now > lockUntil - 900) startRound(now);
    } else if (e.key === "Escape" && G.state !== "title") goHome();
  });
  function drawShade(amount = 1) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "rgba(10,6,8,".concat(0.55 * amount, ")"));
    g.addColorStop(0.28, "rgba(10,6,8,".concat(0.1 * amount, ")"));
    g.addColorStop(0.7, "rgba(10,6,8,".concat(0.1 * amount, ")"));
    g.addColorStop(1, "rgba(10,6,8,".concat(0.55 * amount, ")"));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
  function drawCursors() {
    for (const [h, col] of [[BodyMovin.hands.left, PINK], [BodyMovin.hands.right, BLUE]]) {
      if (!h.seen || !BodyMovin.mouse) continue;
      ctx.lineWidth = U * 6e-3;
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.beginPath();
      ctx.arc(h.x * W, h.y * H, U * 0.028, 0, 6.283);
      ctx.stroke();
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(h.x * W, h.y * H, U * 0.016, 0, 6.283);
      ctx.fill();
    }
  }
  function drawEffects(dt) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = streaks.length - 1; i >= 0; i--) {
      const q = streaks[i];
      q.life -= dt;
      if (q.life <= 0) {
        streaks.splice(i, 1);
        continue;
      }
      const e = 1 - q.life / q.max, hx = lerp(q.x0, q.x1, Math.min(1, e * 2.2)), hy = lerp(q.y0, q.y1, Math.min(1, e * 2.2));
      const gr = ctx.createLinearGradient(q.x0, q.y0, hx, hy);
      gr.addColorStop(0, rgba(q.col, 0));
      gr.addColorStop(1, rgba(q.col, 0.7 * (1 - e)));
      ctx.strokeStyle = gr;
      ctx.lineCap = "round";
      ctx.lineWidth = U * 0.03 * q.w * (1 - e * 0.6);
      ctx.beginPath();
      ctx.moveTo(q.x0, q.y0);
      ctx.lineTo(hx, hy);
      ctx.stroke();
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const p = sparks[i];
      p.life -= dt;
      if (p.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.9;
      p.vy = p.vy * 0.9 + U * 0.8 * dt;
      ctx.fillStyle = rgba(p.col, p.life / p.max);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 6.283);
      ctx.fill();
    }
    for (let i = rings.length - 1; i >= 0; i--) {
      const q = rings[i];
      q.life -= dt;
      if (q.life <= 0) {
        rings.splice(i, 1);
        continue;
      }
      const e = 1 - q.life / q.max;
      ctx.strokeStyle = rgba(q.col, 0.9 * (1 - e));
      ctx.lineWidth = U * 0.01 * q.w * (1 - e);
      ctx.beginPath();
      ctx.ellipse(q.x, q.y, q.r * (1 + e * 2.2), q.r * (1 + e * 2.2) * 0.8, 0, 0, 6.283);
      ctx.stroke();
    }
    ctx.restore();
    for (let i = texts.length - 1; i >= 0; i--) {
      const t = texts[i];
      t.life -= dt;
      if (t.life <= 0) {
        texts.splice(i, 1);
        continue;
      }
      const e = 1 - t.life / t.max, pop = e < 0.15 ? 0.7 + e * 2 : 1, x = clamp(t.x, U * 0.25, W - U * 0.25);
      t.y = Math.max(t.y, (G.topBottom || 0) * DPR + U * 0.09);
      ctx.globalAlpha = clamp(t.life / t.max * 1.8, 0, 1);
      txt(t.s, x, t.y - e * U * 0.06, U * t.size * pop, t.col, "center", 900, U * 0.02, U * 4e-3);
      if (t.sub) txt(t.sub, x, t.y - e * U * 0.06 + U * t.size * 0.85, U * 0.028, "#ffffff", "center", 700);
      ctx.globalAlpha = 1;
    }
  }
  function drawTarget(t, now) {
    var _a2;
    const tg = G.target;
    if (!tg || G.mode !== "heavy") return;
    const p = toScreen(bagPoint(tg.f, tg.s)), r = U * (tg.kick ? 0.06 : 0.05);
    let a = tg.live ? clamp((t - tg.born) / 0.3, 0, 1) : clamp(1 - (t - ((_a2 = tg.hitAt) != null ? _a2 : tg.endAt)) / 0.5, 0, 1);
    if (a <= 0) return;
    const col = tg.kick ? ORANGE : GOLD, pulse = 1 + 0.08 * Math.sin(now / 110), hit = tg.hitAt !== void 0;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.shadowColor = col;
    ctx.shadowBlur = U * 0.03;
    ctx.lineWidth = U * 8e-3;
    ctx.strokeStyle = hit ? "#ffffff" : col;
    const rr2 = r * pulse * (hit ? 1 + (t - tg.hitAt) * 3 : 1);
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, rr2 * 0.75, rr2, 0, 0, 6.283);
    ctx.stroke();
    ctx.lineWidth = U * 4e-3;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, rr2 * 0.32, rr2 * 0.42, 0, 0, 6.283);
    ctx.stroke();
    ctx.shadowBlur = 0;
    if (tg.live) {
      const left = clamp((tg.until - t) / (tg.until - tg.born), 0, 1);
      ctx.strokeStyle = rgba(col, 0.9);
      ctx.lineWidth = U * 5e-3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 1.45, -Math.PI / 2, -Math.PI / 2 + left * 6.283);
      ctx.stroke();
      txt(tg.kick ? "KICK IT" : "HIT IT", p.x + (tg.s >= 0 ? 1 : -1) * r * 2.6, p.y, U * 0.03, col, "center", 900);
    }
    ctx.restore();
  }
  const fmtTime = (s) => {
    s = Math.max(0, Math.ceil(s));
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  };
  function glassCard(cx, cy, w, h, a = 0.8) {
    rr(cx - w / 2, cy - h / 2, w, h, Math.min(h / 2, U * 0.03));
    ctx.fillStyle = "rgba(10,12,24,".concat(a, ")");
    ctx.fill();
    ctx.lineWidth = Math.max(1, DPR);
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.stroke();
  }
  function panel(x, y, w, h) {
    rr(x, y, w, h, U * 0.03);
    ctx.fillStyle = "rgba(12,8,10,0.55)";
    ctx.fill();
  }
  function drawHUD(g, now) {
    const left = ROUND - Math.max(0, g), ph = Math.max(40, U / DPR * 0.064) * DPR, fs = ph * 0.5, pad = ph * 0.45;
    const tStr = fmtTime(left), sStr = G.score.toLocaleString();
    ctx.font = "900 ".concat(fs, "px ").concat(FONT);
    const tw = ctx.measureText(tStr).width, sw = ctx.measureText(sStr).width, cw = tw + sw + pad * 3;
    let rStr = "";
    if (G.mode === "heavy") {
      if (G.combo >= 2 && g - G.lastStrikeT < 2) rStr = "COMBO ".concat(G.combo) + (G.mult > 1 ? "  ×".concat(G.mult) : "");
    } else {
      const sb = G.sb, recent = sb.times.filter((t) => t > g - 10).length, hpm = Math.round(recent * 60 / clamp(g, 4, 10));
      sb.paceTarget = Math.round(lerp(60, 120, clamp(g / ROUND, 0, 1)) * (1 - 0.25 * G.ease));
      sb.pace = g > 3 ? hpm / sb.paceTarget : 0;
      if (g > 6 && sb.pace < 0.5) G.ease = Math.min(1, G.ease + dtF * 0.05);
      else G.ease = Math.max(0, G.ease - dtF * 0.05);
      if (sb.streak >= 2) rStr = "RHYTHM ".concat(sb.streak) + (sb.pace >= 1 ? "  ×2" : "");
    }
    ctx.font = "900 ".concat(fs * 0.72, "px ").concat(FONT);
    const rw = rStr ? ctx.measureText(rStr).width + pad * 2 : 0;
    const L = window.BPUI ? BPUI.top(cw / DPR, ph / DPR, rw / DPR, ph / DPR) : { c: { x: (W / DPR - cw / DPR) / 2, y: 10 }, r: { x: W / DPR - rw / DPR - 10, y: 10 }, bottom: 10 + ph / DPR };
    G.topBottom = L.bottom;
    hudRects = [{ x: L.c.x, y: L.c.y, w: cw / DPR, h: ph / DPR }];
    if (rStr) hudRects.push({ x: L.r.x, y: L.r.y, w: rw / DPR, h: ph / DPR });
    const pill = (x, y, w, h, hot) => {
      rr(x, y, w, h, h / 2);
      ctx.fillStyle = "rgba(10,12,24,0.55)";
      ctx.fill();
      ctx.lineWidth = Math.max(1, DPR);
      ctx.strokeStyle = hot ? rgba(GOLD, 0.9) : "rgba(255,255,255,0.18)";
      ctx.stroke();
    };
    const cx = L.c.x * DPR, cy = L.c.y * DPR;
    pill(cx, cy, cw, ph, false);
    txt(tStr, cx + pad + tw / 2, cy + ph / 2, fs, left < 10 ? "#ffd0d0" : "#ffffff", "center", 900);
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.fillRect(cx + pad * 1.5 + tw - DPR / 2, cy + ph * 0.25, Math.max(1, DPR), ph * 0.5);
    txt(sStr, cx + pad * 2 + tw + sw / 2, cy + ph / 2, fs, GOLD, "center", 900);
    G.comboFlash = (G.comboFlash || 0) * Math.exp(-dtF * 2);
    if (rStr) {
      const x = L.r.x * DPR, y = L.r.y * DPR;
      pill(x, y, rw, ph, G.comboFlash > 0.2);
      txt(rStr, x + rw / 2, y + ph / 2, fs * 0.72, GOLD, "center", 900, 0, fs * 0.04);
    }
    if (g < 0) {
      const n = Math.ceil(-g);
      txt(n >= 2 ? String(n - 1) : "GO!", W / 2, H * 0.4, U * 0.18, n >= 2 ? "#ffffff" : GOLD, "center", 900, U * 0.05);
    }
  }
  function drawHeavyIcon(x, y, s, dark) {
    ctx.save();
    ctx.strokeStyle = dark ? "#160b02" : "#d9d2c8";
    ctx.lineWidth = s * 0.05;
    ctx.beginPath();
    ctx.moveTo(x, y - s * 0.95);
    ctx.lineTo(x, y - s * 0.6);
    ctx.stroke();
    const gr = ctx.createLinearGradient(x - s * 0.3, 0, x + s * 0.3, 0);
    gr.addColorStop(0, "#3a0b09");
    gr.addColorStop(0.45, "#8a2a22");
    gr.addColorStop(1, "#2a0706");
    rr(x - s * 0.24, y - s * 0.6, s * 0.48, s * 1.3, s * 0.12);
    ctx.fillStyle = gr;
    ctx.fill();
    ctx.fillStyle = "#e8e1d6";
    ctx.fillRect(x - s * 0.24, y + s * 0.02, s * 0.48, s * 0.06);
    ctx.restore();
  }
  function drawSpeedIcon(x, y, s, dark) {
    ctx.save();
    ctx.fillStyle = dark ? "#3a2410" : "#b98a55";
    rr(x - s * 0.6, y - s * 0.75, s * 1.2, s * 0.14, s * 0.05);
    ctx.fill();
    const gr = ctx.createRadialGradient(x - s * 0.08, y - s * 0.1, s * 0.05, x, y, s * 0.4);
    gr.addColorStop(0, "#b0443a");
    gr.addColorStop(1, "#4a0f0b");
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.moveTo(x, y - s * 0.6);
    ctx.bezierCurveTo(x + s * 0.12, y - s * 0.5, x + s * 0.38, y - s * 0.1, x + s * 0.3, y + s * 0.2);
    ctx.bezierCurveTo(x + s * 0.2, y + s * 0.45, x - s * 0.2, y + s * 0.45, x - s * 0.3, y + s * 0.2);
    ctx.bezierCurveTo(x - s * 0.38, y - s * 0.1, x - s * 0.12, y - s * 0.5, x, y - s * 0.6);
    ctx.fill();
    ctx.strokeStyle = dark ? "#160b02" : "rgba(255,255,255,0.6)";
    ctx.lineWidth = s * 0.04;
    for (const k of [0.55, 0.75]) {
      ctx.beginPath();
      ctx.arc(x + s * 0.45, y - s * 0.1, s * k, -0.6, 0.6);
      ctx.stroke();
    }
    ctx.restore();
  }
  let titleView = "start";
  function setTitleView(v) {
    titleView = v;
    window.__boxPick = v === "pick";
    const w = document.querySelector(".bph-wrap");
    if (w) w.style.visibility = v === "pick" ? "hidden" : "";
  }
  function bagCard(id, x, y, w, h, mode, now) {
    const heavyBag = mode === "heavy", label = heavyBag ? "HEAVY BAG" : "SPEED BAG", icon = heavyBag ? drawHeavyIcon : drawSpeedIcon;
    button(
      id,
      x,
      y,
      w,
      h,
      "",
      now,
      () => {
        G.mode = mode;
        showMode(mode);
        try {
          localStorage.bop_mode = mode;
        } catch (_) {
        }
        sfxBlip(520);
        setTitleView("start");
      },
      { col: heavyBag ? GOLD : BLUE, primary: G.mode === mode, ms: 900, draw: (bx, by, bw, bh, dark) => {
        icon(bx + bw / 2, by + bh * 0.36, bh * 0.2, dark);
        const fs = Math.min(bh * 0.14, bw / 6.4);
        txt(label, bx + bw / 2, by + bh * 0.7, fs, dark ? "#160b02" : "#ffffff", "center", 900, 0, fs * 0.08);
        txt(G.mode === mode ? "picked" : "hold to pick", bx + bw / 2, by + bh * 0.86, Math.min(bh * 0.09, bw / 9), dark ? "#160b02" : "rgba(255,255,255,0.85)", "center", 800);
      } }
    );
  }
  function drawTitle(now) {
    const tall = H > W * 1.1;
    if (titleView === "pick") {
      {
        const fs = Math.min(U * 0.075, W * 0.09);
        ctx.font = "900 ".concat(fs, "px ").concat(FONT);
        glassCard(W / 2, H * 0.2, ctx.measureText("PICK A BAG").width + fs * 2.2, fs * 1.7);
      }
      txt("PICK A BAG", W / 2, H * (tall ? 0.2 : 0.2), Math.min(U * 0.075, W * 0.09), "#ffffff", "center", 900, 0, U * 0.01);
      if (tall) {
        const cw2 = W * 0.8, ch2 = Math.max(150 * DPR, U * 0.36), gy = Math.max(U * 0.15, 60 * DPR), y0 = H * 0.28;
        bagCard("pick_heavy", (W - cw2) / 2, y0, cw2, ch2, "heavy", now);
        bagCard("pick_speed", (W - cw2) / 2, y0 + ch2 + gy, cw2, ch2, "speed", now);
      } else {
        const gx = W * 0.14, cw2 = Math.min(W * 0.32, (W * 0.84 - gx) / 2), ch2 = Math.min(H * 0.5, Math.max(cw2 * 0.85, U * 0.3)), y0 = H * 0.3;
        bagCard("pick_heavy", W / 2 - gx / 2 - cw2, y0, cw2, ch2, "heavy", now);
        bagCard("pick_speed", W / 2 + gx / 2, y0, cw2, ch2, "speed", now);
      }
      return;
    }
    const card = document.querySelector(".bph-card"), cr = card && card.getBoundingClientRect(), gap = Math.max(10 * DPR, U * 0.025);
    const y1 = cr && cr.height ? cr.bottom * DPR + gap : H * 0.62;
    const sh = Math.max(110 * DPR, U * 0.17), sw = tall ? W * 0.8 : Math.max(U * 0.46, 300 * DPR);
    const ch = Math.max(80 * DPR, U * 0.12), cw = tall ? W * 0.6 : Math.max(U * 0.3, 190 * DPR);
    const bagName = G.mode === "speed" ? "SPEED BAG" : "HEAVY BAG";
    const startDraw = (bx, by, w, h, dark) => {
      const fs = Math.min(h * 0.36, w / 4.2);
      txt("START", bx + w / 2, by + h * 0.42, fs, dark ? "#160b02" : "#fff6e6", "center", 900, 0, fs * 0.08);
      txt(bagName + "  ·  hold to start", bx + w / 2, by + h * 0.76, Math.min(h * 0.15, w / 14), dark ? "#160b02" : "rgba(255,255,255,0.9)", "center", 800);
    };
    const changeDraw = (bx, by, w, h, dark) => {
      const fs = Math.min(h * 0.28, w / 7.5);
      txt("CHANGE BAG", bx + w / 2, by + h / 2, fs, dark ? "#160b02" : "#ffffff", "center", 800, 0, fs * 0.06);
    };
    if (tall) {
      const ys = Math.min(H * 0.94 - sh - ch - Math.max(U * 0.1, 60 * DPR), Math.max(y1, H * 0.45));
      button("start", (W - sw) / 2, ys, sw, sh, "", now, (n) => startRound(n), { primary: true, col: GOLD, ms: 900, draw: startDraw });
      button("change_bag", (W - cw) / 2, ys + sh + Math.max(U * 0.1, 60 * DPR), cw, ch, "", now, () => setTitleView("pick"), { col: BLUE, ms: 900, draw: changeDraw });
    } else {
      const ys = Math.min(H - sh - U * 0.04, Math.max(y1, H * 0.6)), xs = W / 2 - sw / 2, m = Math.max(12 * DPR, U * 0.03);
      const cw2 = Math.min(cw, W * 0.24), xc = W - cw2 - m;
      button("start", xs, ys, sw, sh, "", now, (n) => startRound(n), { primary: true, col: GOLD, ms: 900, draw: startDraw });
      button("change_bag", xc, m, cw2, ch, "", now, () => setTitleView("pick"), { col: BLUE, ms: 900, draw: changeDraw });
    }
    if (TV && now - titleAt > 2e3 && G.state === "title") pending = (n) => startRound(n);
  }
  function drawEnd(now) {
    const R = G.result, e = clamp((now - endAt) / 600, 0, 1);
    {
      const fs = Math.min(U * 0.2, W * 0.16);
      ctx.font = "900 ".concat(fs, "px ").concat(FONT);
      const w = Math.max(ctx.measureText(R.score.toLocaleString()).width, U * 0.3) + U * 0.12;
      const top = H * 0.24 - U * 0.05, bot = H * 0.42 + fs * 0.42 + U * 0.03;
      ctx.globalAlpha = 1;
      glassCard(W / 2, (top + bot) / 2, w, bot - top, 0.9);
    }
    txt("ROUND OVER", W / 2, H * 0.24, Math.max(15 * DPR, U * 0.035), "rgba(255,255,255,0.75)", "center", 800, 0, U * 8e-3);
    const shown = Math.round(R.score * (e < 1 ? 1 - Math.pow(1 - e, 3) : 1));
    txt(shown.toLocaleString(), W / 2, H * 0.42, Math.min(U * 0.2, W * 0.16), GOLD, "center", 900);
    const tall = H > W * 1.1, bh = Math.max(110 * DPR, U * 0.16), ch = Math.max(80 * DPR, U * 0.12), m = Math.max(12 * DPR, U * 0.03);
    const changeDraw = (bx, by, w, h, dark) => {
      const fs = Math.min(h * 0.28, w / 7.5);
      txt("CHANGE BAG", bx + w / 2, by + h / 2, fs, dark ? "#160b02" : "#ffffff", "center", 800, 0, fs * 0.06);
    };
    const toPick = () => {
      G.state = "title";
      titleAt = performance.now();
      setTitleView("pick");
    };
    if (tall) {
      const bw = W * 0.8, cw = W * 0.6, y0 = H * 0.55;
      button("again", (W - bw) / 2, y0, bw, bh, "PLAY AGAIN", now, (n) => startRound(n, R.mode), { primary: true, ms: 900 });
      button("change_bag", (W - cw) / 2, Math.min(H * 0.92 - ch, y0 + bh + Math.max(U * 0.12, 70 * DPR)), cw, ch, "", now, toPick, { col: BLUE, ms: 900, draw: changeDraw });
    } else {
      const bw = Math.max(U * 0.46, 300 * DPR), cw = Math.min(Math.max(U * 0.3, 190 * DPR), W * 0.24);
      button("again", W / 2 - bw / 2, H * 0.58, bw, bh, "PLAY AGAIN", now, (n) => startRound(n, R.mode), { primary: true, ms: 900 });
      button("change_bag", W - cw - m, m, cw, ch, "", now, toPick, { col: BLUE, ms: 900, draw: changeDraw });
    }
  }
  const camTarget = new Vector3(), CAM = { heavy: new Vector3(HB.x, 1.15, HB.z), speed: new Vector3(SB.x - 0.05, SPEED_FACE - 0.3, SB.z + 0.2) };
  const CAMP = { heavy: CAMPOS.clone(), speed: new Vector3(SPEED_FIG.x + 1, SPEED_FACE + 0.18, SPEED_FIG.z + 1.7) }, camPos = CAMP[G.mode].clone();
  camTarget.copy(CAM[G.mode]);
  function update3D(dt, now) {
    camTarget.lerp(CAM[G.mode], 1 - Math.exp(-dt * 4));
    const asp = innerWidth / Math.max(1, innerHeight), back = asp < 1.25 ? (1.25 / asp - 1) * 1.5 : 0;
    camPos.lerp(CAMP[G.mode], 1 - Math.exp(-dt * 4));
    camera.position.set(camPos.x, camPos.y + back * 0.15, camPos.z + back);
    camera.lookAt(camTarget);
    if (heavy.visible) {
      stepHeavy(dt);
      swing.rotation.set(HP.ax + Math.sin(now / 1700) * 4e-3, 0, HP.az);
      bagRig.rotation.set(-HP.wx * 0.5, 0, -HP.wz * 0.5);
      bagTw.rotation.y = HP.tw;
      const sq = clamp(HP.sq, -0.08, 0.08);
      bagMesh.scale.set(1 + sq * 0.5, 1 - sq * 0.25, 1 + sq * 0.5);
      updateDents(dt);
      bagRig.updateMatrixWorld(true);
      bagRig.getWorldPosition(_b);
      layChain(hbChain, hbHook, _b, clamp(-HP.wz * 0.1, -0.03, 0.03));
      blob.position.x = _b.x + Math.sin(HP.az) * 0.9;
      blob.position.z = HB.z - Math.sin(HP.ax) * 1.4;
      blob.material.opacity = 1 - Math.min(0.5, Math.hypot(HP.ax, HP.az));
    }
    if (speed.visible) {
      stepSpeed(dt, now);
      sbPivot.rotation.set(SP.phi, 0, SP.psi);
      sbBag.rotation.y += SP.vphi * dt * 0.05;
      SP.ring *= Math.exp(-dt * 20);
      board.position.y = SB.boardY + 0.025 + SP.ring * 3e-3;
      if (G.state === "play" && G.time - G.sb.lastHitT > 1.8 && G.sb.streak > 0 && Math.abs(SP.vphi) < 1) G.sb.streak = 0;
    }
    updateDust(dt);
    renderer.shadowMap.needsUpdate = true;
    decorateComposer();
    if (finish) finish.uniforms.uTime.value = now / 1e3 % 100;
    render(dt);
  }
  let hudRects = [];
  function liveTips() {
    if (!BodyMovin.tip || G.state !== "play" || G.time < 0) return;
    const g = G.time;
    if (G.mode === "heavy") {
      const back = HP.vx < -0.12 && HP.ax > 0.025;
      BodyMovin.tip("counter", back ? "Counter now: hit it as it swings back for 1.5x!" : "Counter: hit the bag as it swings back at you for 1.5x points", 1200, { hot: back });
      if (G.combo >= 1 && g - G.lastStrikeT < 2 && G.mult < 4) {
        const need = 5 - G.combo % 5;
        BodyMovin.tip("combo", "Combo: ".concat(need, " more hit").concat(need > 1 ? "s" : "", ", each within 2 s, for ×").concat(G.mult + 1), 1200);
      }
    } else if (g > 3) {
      BodyMovin.tip("pace", G.sb.pace >= 1 ? "Pace: every hit counts double, keep it up" : "Speed up: hit faster to reach the pace for double points", 1200, { hot: G.sb.pace < 1 && G.sb.pace > 0.7 });
    }
  }
  let lastNow = 0, dtF = 1 / 60;
  BodyMovin.start();
  function frame(now) {
    BodyMovin.update(now);
    const dt = dtF = Math.min(0.05, (now - (lastNow || now)) / 1e3);
    lastNow = now;
    buttons = [];
    pending = null;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);
    fighterH.update(now);
    fighterS.update(now);
    if (G.state === "play") {
      G.time = (now - G.t0) / 1e3;
      readPicturePunches(now / 1e3);
      readContacts(now);
      flushFallback(now);
    } else readContacts(now);
    update3D(dt, now);
    if (G.state === "title") drawTitle(now);
    else if (G.state === "end") drawEnd(now);
    else {
      const g = G.time;
      if (g >= 0 && !G.bellRung) {
        G.bellRung = true;
        sfxBell();
      }
      if (g >= 0 && TARGETS_ON) updateTarget(g);
      if (G.combo && g - G.lastStrikeT > 2) G.combo = 0, G.mult = 1;
      if (TARGETS_ON) drawTarget(g, now);
      drawEffects(dt);
      drawHUD(g, now);
      if (g >= ROUND) endRound(now);
    }
    if (G.state !== "play") {
      drawEffects(dt);
      drawCursors();
    }
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
