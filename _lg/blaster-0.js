import {
  RoundedBoxGeometry
} from "./chunk-UI5V7SMY.js";
import {
  SimplexNoise,
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
  AddEquation,
  AdditiveBlending,
  BackSide,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CapsuleGeometry,
  CatmullRomCurve3,
  CircleGeometry,
  Color,
  CustomBlending,
  CylinderGeometry,
  DataTexture,
  DirectionalLight,
  DoubleSide,
  DynamicDrawUsage,
  Euler,
  ExtrudeGeometry,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  LatheGeometry,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NormalBlending,
  Object3D,
  OneFactor,
  PMREMGenerator,
  PlaneGeometry,
  PointLight,
  Points,
  Quaternion,
  RepeatWrapping,
  RingGeometry,
  SRGBColorSpace,
  Scene,
  ShaderMaterial,
  Shape,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  TextureLoader,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  ZeroFactor,
  three_module_exports
} from "./chunk-4IYDSAYK.js";
import "./chunk-NWIHTO7D.js";

// dist/three/addons/environments/RoomEnvironment.js
var RoomEnvironment = class extends Scene {
  constructor() {
    super();
    const geometry = new BoxGeometry();
    geometry.deleteAttribute("uv");
    const roomMaterial = new MeshStandardMaterial({ side: BackSide });
    const boxMaterial = new MeshStandardMaterial();
    const mainLight = new PointLight(16777215, 900, 28, 2);
    mainLight.position.set(0.418, 16.199, 0.3);
    this.add(mainLight);
    const room = new Mesh(geometry, roomMaterial);
    room.position.set(-0.757, 13.219, 0.717);
    room.scale.set(31.713, 28.305, 28.591);
    this.add(room);
    const box1 = new Mesh(geometry, boxMaterial);
    box1.position.set(-10.906, 2.009, 1.846);
    box1.rotation.set(0, -0.195, 0);
    box1.scale.set(2.328, 7.905, 4.651);
    this.add(box1);
    const box2 = new Mesh(geometry, boxMaterial);
    box2.position.set(-5.607, -0.754, -0.758);
    box2.rotation.set(0, 0.994, 0);
    box2.scale.set(1.97, 1.534, 3.955);
    this.add(box2);
    const box3 = new Mesh(geometry, boxMaterial);
    box3.position.set(6.167, 0.857, 7.803);
    box3.rotation.set(0, 0.561, 0);
    box3.scale.set(3.927, 6.285, 3.687);
    this.add(box3);
    const box4 = new Mesh(geometry, boxMaterial);
    box4.position.set(-2.017, 0.018, 6.124);
    box4.rotation.set(0, 0.333, 0);
    box4.scale.set(2.002, 4.566, 2.064);
    this.add(box4);
    const box5 = new Mesh(geometry, boxMaterial);
    box5.position.set(2.291, -0.756, -2.621);
    box5.rotation.set(0, -0.286, 0);
    box5.scale.set(1.546, 1.552, 1.496);
    this.add(box5);
    const box6 = new Mesh(geometry, boxMaterial);
    box6.position.set(-2.193, -0.369, -5.547);
    box6.rotation.set(0, 0.516, 0);
    box6.scale.set(3.875, 3.487, 2.986);
    this.add(box6);
    const light1 = new Mesh(geometry, createAreaLightMaterial(50));
    light1.position.set(-16.116, 14.37, 8.208);
    light1.scale.set(0.1, 2.428, 2.739);
    this.add(light1);
    const light2 = new Mesh(geometry, createAreaLightMaterial(50));
    light2.position.set(-16.109, 18.021, -8.207);
    light2.scale.set(0.1, 2.425, 2.751);
    this.add(light2);
    const light3 = new Mesh(geometry, createAreaLightMaterial(17));
    light3.position.set(14.904, 12.198, -1.832);
    light3.scale.set(0.15, 4.265, 6.331);
    this.add(light3);
    const light4 = new Mesh(geometry, createAreaLightMaterial(43));
    light4.position.set(-0.462, 8.89, 14.52);
    light4.scale.set(4.38, 5.441, 0.088);
    this.add(light4);
    const light5 = new Mesh(geometry, createAreaLightMaterial(20));
    light5.position.set(3.235, 11.486, -12.541);
    light5.scale.set(2.5, 2, 0.1);
    this.add(light5);
    const light6 = new Mesh(geometry, createAreaLightMaterial(100));
    light6.position.set(0, 20, 0);
    light6.scale.set(1, 0.1, 1);
    this.add(light6);
  }
  dispose() {
    const resources = /* @__PURE__ */ new Set();
    this.traverse((object) => {
      if (object.isMesh) {
        resources.add(object.geometry);
        resources.add(object.material);
      }
    });
    for (const resource of resources) {
      resource.dispose();
    }
  }
};
function createAreaLightMaterial(intensity) {
  const material = new MeshBasicMaterial();
  material.color.setScalar(intensity);
  return material;
}

// bmpage:bmpage:blaster.html#0
(async () => {
  const BP = window.BodyMovin;
  const Q = new URLSearchParams(location.search);
  const GAME_ID = "blaster", ROUND = 90, BOSS_AT = 60;
  const lerp = (a, b, t) => a + (b - a) * t, clamp = (v, a, b) => Math.max(a, Math.min(b, v)), rand = (a, b) => a + Math.random() * (b - a);
  const pick = (a) => a[Math.random() * a.length | 0];
  const G = window.__game = {
    state: "loading",
    score: 0,
    hits: 0,
    shots: 0,
    kills: 0,
    combo: 0,
    bestCombo: 0,
    mult: 1,
    wave: 0,
    timeLeft: ROUND,
    hardcore: localStorage.blaster_hc === "1",
    shield: 100,
    special: 0,
    struggle: 0,
    deflects: 0,
    dodges: 0,
    ducks: 0,
    damage: 0,
    novas: 0,
    power: {},
    bossHp: null,
    bossKilled: false,
    fps: 60,
    quality: 2,
    errors: [],
    best: BP.best(GAME_ID),
    targets: [],
    threats: [],
    timeScale: 1,
    ship: { x: 0, y: 0 }
  };
  addEventListener("error", (e) => G.errors.push(String(e.message)));
  addEventListener("unhandledrejection", (e) => G.errors.push(String(e.reason && e.reason.message || e.reason)));
  const RS = setup(document.getElementById("gl"), { fov: 64, near: 0.05, far: 2e3, tier: Q.has("tier") ? +Q.get("tier") : void 0 });
  const { renderer, scene, camera } = RS;
  renderer.toneMappingExposure = 1;
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
  function canvasTex(w, h, draw, { srgb = true } = {}) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d"), w, h);
    const t = new CanvasTexture(c);
    if (srgb) t.colorSpace = SRGBColorSpace;
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
  const ringTex = canvasTex(256, 256, (g, w) => {
    const gr = g.createRadialGradient(w / 2, w / 2, w * 0.3, w / 2, w / 2, w / 2);
    gr.addColorStop(0, "rgba(255,255,255,0)");
    gr.addColorStop(0.75, "rgba(255,255,255,0.9)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, w);
  }, { srgb: false });
  const SUN = new Vector3(0.55, 0.28, -1).normalize();
  const PLANET_DIR = new Vector3(-0.62, -0.5, -1).normalize(), PLANET_R = 560, PLANET_D = 1350;
  const SPACE = "./assets/space/";
  const blankTex = new DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
  blankTex.needsUpdate = true;
  const loadTex = (u, srgb = true) => new TextureLoader().loadAsync(u).then((t) => {
    if (srgb) t.colorSpace = SRGBColorSpace;
    t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    return t;
  }).catch(() => blankTex);
  const bigSky = RS.quality.tier >= 2 && renderer.capabilities.maxTextureSize >= 8192;
  const LT = RS.quality.tier;
  const [starTex, dayTex, cloudTex, nightTex] = await Promise.all([
    loadTex(SPACE + (bigSky ? "starfield_8k.jpg" : LT >= 1 ? "starfield_4k.jpg" : "starfield_2k.jpg")),
    loadTex(SPACE + (LT >= 2 ? "earth_day_4k.jpg" : LT === 1 ? "earth_day_2k.jpg" : "earth_day_1k.jpg")),
    loadTex(SPACE + (LT >= 2 ? "earth_clouds_2k.jpg" : "earth_clouds_1k.jpg"), false),
    loadTex(SPACE + (LT >= 2 ? "earth_night_2k.jpg" : "earth_night_1k.jpg"))
  ]);
  {
    const sky = new Mesh(new SphereGeometry(1900, 96, 48), new MeshBasicMaterial({ map: starTex, side: BackSide, toneMapped: false, depthWrite: false, fog: false, color: new Color(0.3, 0.3, 0.33) }));
    sky.rotation.set(0.42, 2.25, 0.5);
    Object.assign(sky.material, {
      blending: CustomBlending,
      blendEquation: AddEquation,
      blendSrc: OneFactor,
      blendDst: ZeroFactor,
      blendEquationAlpha: AddEquation,
      blendSrcAlpha: ZeroFactor,
      blendDstAlpha: ZeroFactor
    });
    sky.renderOrder = -1e3;
    sky.frustumCulled = false;
    sky.name = "photoSky";
    sky.userData.trueColor = true;
    sky.onBeforeRender = (r, s, cam) => {
      sky.position.setFromMatrixPosition(cam.matrixWorld);
      sky.updateMatrixWorld();
    };
    scene.add(sky);
    RS.sky = sky;
    scene.background = null;
  }
  const planet = new Group();
  scene.add(planet);
  {
    const uni = { tDay: { value: dayTex }, tNight: { value: nightTex }, tCloud: { value: cloudTex }, uSun: { value: SUN }, uT: { value: 0 }, uDim: { value: 0.42 } };
    planet.userData.uni = uni;
    const surf = new Mesh(new SphereGeometry(PLANET_R, 160, 96), new ShaderMaterial({
      uniforms: uni,
      vertexShader: "varying vec3 vN; varying vec3 vP; varying vec2 vUv; void main(){ vUv = uv; vN = normalize(mat3(modelMatrix) * normal); vec4 w = modelMatrix * vec4(position, 1.0); vP = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",
      fragmentShader: "uniform sampler2D tDay, tNight, tCloud; uniform vec3 uSun; uniform float uT, uDim; varying vec3 vN; varying vec3 vP; varying vec2 vUv;\n      void main(){\n        vec3 n = normalize(vN), v = normalize(cameraPosition - vP);\n        float ndl = dot(n, uSun), mu = max(dot(n, v), 0.0);\n        vec3 day = texture2D(tDay, vUv).rgb;\n        vec2 cuv = vUv + vec2(uT * 0.0015, 0.0);\n        float cl = texture2D(tCloud, cuv).r; cl = smoothstep(0.08, 0.85, cl);\n        float clS = smoothstep(0.08, 0.85, texture2D(tCloud, cuv + vec2(0.0015, 0.001)).r);          // cloud shadow on the ground\n        float ocean = smoothstep(0.02, -0.04, day.r - day.b * 0.55) * smoothstep(0.25, 0.05, day.g);\n        vec3 ground = day * (1.0 - clS * 0.45);\n        vec3 albedo = mix(ground, vec3(0.92, 0.93, 0.95), cl);\n        float lit = max(ndl, 0.0);\n        vec3 tw = mix(vec3(1.0, 0.45, 0.22), vec3(1.0), smoothstep(0.0, 0.35, ndl));                   // sunset light along the terminator\n        vec3 col = albedo * lit * tw * 2.0;\n        vec3 h = normalize(uSun + v); col += vec3(1.0, 0.9, 0.75) * pow(max(dot(n, h), 0.0), 90.0) * ocean * (1.0 - cl) * 1.6 * step(0.0, ndl);\n        vec3 night = texture2D(tNight, vUv).rgb; col += night * night * vec3(1.0, 0.78, 0.5) * 5.0 * (1.0 - smoothstep(-0.12, 0.06, ndl)) * (1.0 - cl * 0.85);\n        float fr = pow(1.0 - mu, 2.2);\n        col = mix(col, vec3(0.28, 0.52, 1.0) * 1.6 * smoothstep(-0.2, 0.45, ndl), fr * 0.75);                // looking through more air at the limb\n        col += vec3(0.05, 0.1, 0.22) * smoothstep(-0.15, 0.3, ndl) * 0.35;                                  // the air itself, lit\n        gl_FragColor = vec4(col * uDim, 1.0);\n      }"
    }));
    planet.add(surf);
    const atm = new Mesh(new SphereGeometry(PLANET_R * 1.06, 128, 64), new ShaderMaterial({
      uniforms: { uSun: uni.uSun, uC: { value: new Vector3() }, uR: { value: PLANET_R } },
      vertexShader: "varying vec3 vP; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vP = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",
      fragmentShader: "uniform vec3 uSun, uC; uniform float uR; varying vec3 vP;\n      void main(){\n        vec3 rd = normalize(vP - cameraPosition), oc = uC - cameraPosition; float tc = dot(oc, rd);\n        vec3 closest = cameraPosition + rd * tc; float b = length(closest - uC) / uR;\n        if (b < 0.996) discard;                                                   // in front of the planet: the surface shader owns it (a hair of overlap hides the facets)\n        float bb = max(b, 1.0), g = exp(-(bb - 1.0) / 0.012) * 0.9 + exp(-(bb - 1.0) / 0.04) * 0.25;\n        vec3 up = normalize(closest - uC); float sl = dot(up, uSun);\n        float day = smoothstep(-0.35, 0.35, sl);\n        vec3 col = mix(vec3(1.0, 0.42, 0.18), vec3(0.32, 0.58, 1.0), smoothstep(-0.1, 0.4, sl)) * g * day * 0.9;\n        gl_FragColor = vec4(col, 1.0);\n      }",
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      side: BackSide
    }));
    planet.add(atm);
    planet.userData.atm = atm;
    planet.position.copy(PLANET_DIR).multiplyScalar(PLANET_D);
    planet.rotation.set(0.35, 2.4, -0.25);
    atm.material.uniforms.uC.value.copy(planet.position);
    planet.renderOrder = -900;
  }
  const sunGroup = new Group();
  scene.add(sunGroup);
  const burstTex = canvasTex(512, 512, (g, w) => {
    g.translate(w / 2, w / 2);
    g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 6; i++) {
      g.save();
      g.rotate(i * Math.PI / 3 + 0.26);
      const gr = g.createLinearGradient(0, 0, w / 2, 0);
      gr.addColorStop(0, "rgba(255,250,240,0.9)");
      gr.addColorStop(1, "rgba(255,250,240,0)");
      g.fillStyle = gr;
      g.beginPath();
      g.moveTo(0, -3);
      g.lineTo(w / 2, 0);
      g.lineTo(0, 3);
      g.lineTo(-w / 2, 0);
      g.closePath();
      g.fill();
      g.restore();
    }
    for (let i = 0; i < 90; i++) {
      g.save();
      g.rotate(Math.random() * 6.283);
      const L = w * (0.08 + Math.random() * 0.25);
      const gr = g.createLinearGradient(0, 0, L, 0);
      gr.addColorStop(0, "rgba(255,240,225,0.12)");
      gr.addColorStop(1, "rgba(255,240,225,0)");
      g.fillStyle = gr;
      g.fillRect(0, -0.6, L, 1.2);
      g.restore();
    }
  }, { srgb: false });
  {
    const core = new Mesh(new SphereGeometry(9, 32, 16), new MeshBasicMaterial({ color: new Color(1, 0.97, 0.92).multiplyScalar(30) }));
    sunGroup.add(core);
    const hot = new Sprite(new SpriteMaterial({ map: glowTex, color: new Color(1, 0.97, 0.92).multiplyScalar(4), transparent: true, depthWrite: false, blending: AdditiveBlending }));
    hot.scale.setScalar(26);
    sunGroup.add(hot);
    const corona = new Sprite(new SpriteMaterial({ map: glowTex, color: new Color(1, 0.9, 0.78).multiplyScalar(0.45), transparent: true, depthWrite: false, blending: AdditiveBlending }));
    corona.scale.setScalar(150);
    sunGroup.add(corona);
    const burst = new Sprite(new SpriteMaterial({ map: burstTex, color: new Color(1, 0.96, 0.9).multiplyScalar(0.4), transparent: true, depthWrite: false, blending: AdditiveBlending }));
    burst.scale.setScalar(220);
    sunGroup.add(burst);
    sunGroup.userData.burst = burst;
  }
  const sunLight = new DirectionalLight(16774118, 5.2);
  sunLight.position.copy(SUN).multiplyScalar(10);
  scene.add(sunLight, sunLight.target);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(RS.quality.tier >= 2 ? 2048 : 1024, RS.quality.tier >= 2 ? 2048 : 1024);
  Object.assign(sunLight.shadow.camera, { left: -2.2, right: 2.2, top: 2.2, bottom: -2.2, near: 0.5, far: 24 });
  sunLight.shadow.bias = -4e-4;
  sunLight.shadow.normalBias = 0.01;
  const earthShine = new DirectionalLight(6982911, 0.22);
  earthShine.position.copy(PLANET_DIR).multiplyScalar(10);
  scene.add(earthShine);
  {
    const envScene = new Scene();
    envScene.background = new Color(0);
    const ball = (r, col, dir, d) => {
      const m = new Mesh(new SphereGeometry(r, 24, 12), new MeshBasicMaterial({ color: col }));
      m.position.copy(dir).multiplyScalar(d);
      envScene.add(m);
    };
    ball(4, new Color(1, 0.96, 0.9).multiplyScalar(40), SUN, 60);
    ball(26, new Color(0.045, 0.075, 0.14), PLANET_DIR, 60);
    const band = new Mesh(new TorusGeometry(60, 6, 8, 48), new MeshBasicMaterial({ color: new Color(0.012, 0.011, 0.01) }));
    band.rotation.set(1.1, 0.3, 0.4);
    envScene.add(band);
    const pm = new PMREMGenerator(renderer);
    scene.environment = pm.fromScene(envScene, 0.03).texture;
    scene.environmentIntensity = 1;
  }
  class Particles {
    constructor(max, additive) {
      this.max = max;
      this.i = 0;
      const g = new BufferGeometry();
      this.g = g;
      for (const k of ["pos", "col", "vel"]) this[k] = new Float32Array(max * 3);
      for (const k of ["sz", "al", "life", "ml", "s0", "s1", "a0", "drag"]) this[k] = new Float32Array(max);
      const A = (a, n) => new BufferAttribute(a, n).setUsage(DynamicDrawUsage);
      g.setAttribute("position", A(this.pos, 3));
      g.setAttribute("pcol", A(this.col, 3));
      g.setAttribute("psize", A(this.sz, 1));
      g.setAttribute("palpha", A(this.al, 1));
      this.mat = new ShaderMaterial({
        uniforms: { uScale: { value: 400 }, uTex: { value: additive ? glowTex : smokeTex } },
        vertexShader: "attribute vec3 pcol; attribute float psize; attribute float palpha; varying vec3 vC; varying float vA; uniform float uScale;\n        void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = min(300.0, psize * uScale / max(0.05, -mv.z)); vC = pcol; vA = palpha * smoothstep(1.5, 6.0, -mv.z); }",
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
    emit(x, y, z, vx, vy, vz, life, s0, s1, r, gg, b, a = 1, drag = 0) {
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
      this.drag[i] = drag;
      this.sz[i] = s0;
      this.al[i] = a;
    }
    update(dt, worldV2) {
      for (let i = 0; i < this.max; i++) {
        if (this.life[i] <= 0) continue;
        const l = this.life[i] -= dt, j = i * 3;
        if (l <= 0) {
          this.al[i] = 0;
          this.sz[i] = 0;
          continue;
        }
        const k = 1 - l / this.ml[i], dr = Math.exp(-this.drag[i] * dt);
        this.vel[j] *= dr;
        this.vel[j + 1] *= dr;
        this.vel[j + 2] *= dr;
        this.pos[j] += this.vel[j] * dt;
        this.pos[j + 1] += this.vel[j + 1] * dt;
        this.pos[j + 2] += (this.vel[j + 2] + worldV2) * dt;
        this.sz[i] = this.s0[i] + (this.s1[i] - this.s0[i]) * k;
        this.al[i] = this.a0[i] * (k < 0.06 ? k / 0.06 : Math.pow(1 - (k - 0.06) / 0.94, 1.4));
      }
      const at = this.g.attributes;
      at.position.needsUpdate = at.pcol.needsUpdate = at.psize.needsUpdate = at.palpha.needsUpdate = true;
    }
  }
  const fire = new Particles(7e3, true), smoke = new Particles(1800, false);
  const _c = new Color(), _m = new Matrix4(), _q = new Quaternion(), _v = new Vector3(), _v2 = new Vector3(), _v3 = new Vector3(), _s = new Vector3();
  class Debris {
    constructor(geom, mat, max) {
      this.mesh = new InstancedMesh(geom, mat, max);
      this.mesh.frustumCulled = false;
      this.mesh.instanceMatrix.setUsage(DynamicDrawUsage);
      this.max = max;
      this.i = 0;
      this.d = [];
      for (let k = 0; k < max; k++) {
        this.d.push({ life: 0, p: new Vector3(), v: new Vector3(), q: new Quaternion(), ax: new Vector3(1, 0, 0), w: 0, s: 1, hot: 0 });
        this.mesh.setMatrixAt(k, _m.makeScale(0, 0, 0));
        this.mesh.setColorAt(k, _c.set(1, 1, 1));
      }
      scene.add(this.mesh);
    }
    spawn(p, v, s, color, life = 2.5) {
      const k = this.i;
      this.i = (this.i + 1) % this.max;
      const d = this.d[k];
      d.life = d.ml = life;
      d.p.copy(p);
      d.v.copy(v);
      d.s = s;
      d.q.setFromEuler(new Euler(rand(0, 6), rand(0, 6), rand(0, 6)));
      d.ax.set(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize();
      d.w = rand(2, 9);
      d.hot = Math.random() < 0.2 ? 1 : 0;
      this.mesh.setColorAt(k, _c.set(color));
      this.mesh.instanceColor.needsUpdate = true;
    }
    update(dt, worldV2) {
      for (let k = 0; k < this.max; k++) {
        const d = this.d[k];
        if (d.life <= 0) continue;
        d.life -= dt;
        if (d.life <= 0) {
          this.mesh.setMatrixAt(k, _m.makeScale(0, 0, 0));
          continue;
        }
        d.p.addScaledVector(d.v, dt);
        d.p.z += worldV2 * dt;
        d.q.multiply(_q.setFromAxisAngle(d.ax, d.w * dt));
        if (d.hot && Math.random() < 0.15) smoke.emit(d.p.x, d.p.y, d.p.z, 0, 0, 0, 0.8, d.s * 0.6, d.s * 2.2, 0.2, 0.18, 0.2, 0.5, 1);
        const s = d.s * Math.min(1, d.life / 0.5);
        this.mesh.setMatrixAt(k, _m.compose(d.p, d.q, _s.set(s, s, s)));
      }
      this.mesh.instanceMatrix.needsUpdate = true;
    }
  }
  async function rockShape(name) {
    try {
      const g = await model(name);
      let mesh = null;
      g.updateWorldMatrix(true, true);
      g.traverse((o) => {
        if (o.isMesh && !mesh) mesh = o;
      });
      const geo = mesh.geometry.clone();
      geo.applyMatrix4(mesh.matrixWorld);
      geo.computeBoundingSphere();
      const bs = geo.boundingSphere, k = 1.22 / bs.radius;
      geo.translate(-bs.center.x, -bs.center.y, -bs.center.z);
      geo.scale(k, k, k);
      geo.computeBoundingSphere();
      const mat = mesh.material.clone();
      mat.envMapIntensity = 0.35;
      return { geo, mat };
    } catch (e) {
      return null;
    }
  }
  const ROCK_SHAPES = (await Promise.all([rockShape("moon_rock_03"), rockShape("moon_rock_05")])).filter(Boolean);
  const rockMat = ROCK_SHAPES.length ? ROCK_SHAPES[0].mat.clone() : pbr("rocky_terrain_02", { repeat: [2, 2], roughness: 0.9, color: 16772829 });
  function shipMetal(color, { repeat = [2, 2], metalness = 0.55, roughness = 0.55, env = 0.8 } = {}) {
    const m = pbr("blue_metal_plate", { repeat, metalness, roughness: void 0, color, envMapIntensity: env, normalScale: 1.2 });
    m.map = null;
    m.roughness = roughness * 1.5;
    return m;
  }
  const hullMat = shipMetal(7173244, { repeat: [1.5, 1.5], metalness: 0.6, roughness: 0.5 });
  const chunkGeo = (() => {
    const g = new IcosahedronGeometry(1, 1), P = g.attributes.position;
    for (let i = 0; i < P.count; i++) {
      _v.fromBufferAttribute(P, i).multiplyScalar(rand(0.7, 1.2));
      P.setXYZ(i, _v.x, _v.y * 0.7, _v.z);
    }
    g.computeVertexNormals();
    return g;
  })();
  const rockChunks = new Debris(chunkGeo, rockMat, 220);
  const hullChunks = new Debris(new BoxGeometry(1, 0.08, 0.7), shipMetal(10133928, { repeat: [0.5, 0.5], metalness: 0.75, roughness: 0.4 }), 160);
  const flashes = [];
  for (let i = 0; i < 6; i++) {
    const l = new PointLight(16777215, 0, 60, 1.6);
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
  const rings = [];
  for (let i = 0; i < 8; i++) {
    const m = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ map: ringTex, transparent: true, depthWrite: false, blending: AdditiveBlending, color: 16752736 }));
    m.visible = false;
    scene.add(m);
    rings.push({ m, t: 0, d: 1, s: 1 });
  }
  function shockwave(p, size, color = 16752736, dur = 0.6) {
    const r = rings.reduce((a, b) => a.t < b.t ? a : b);
    r.m.position.copy(p);
    r.m.material.color.set(color);
    r.t = r.d = dur;
    r.s = size;
    r.m.visible = true;
  }
  function explode(p, size, kind = "rock") {
    const n = Math.round(60 + size * 30);
    for (let i = 0; i < n; i++) {
      const u = rand(-1, 1), th = rand(0, 6.283), r = Math.sqrt(1 - u * u), sp = rand(2, 14) * Math.sqrt(size);
      const hot = Math.random();
      fire.emit(p.x, p.y, p.z, Math.cos(th) * r * sp, u * sp, Math.sin(th) * r * sp, rand(0.4, 1.1), size * rand(0.6, 1.4), size * 0.3, 2 + hot * 1.5, 0.7 + hot * 1.2, 0.15 + hot * 0.35, 0.8, 2.2);
    }
    for (let i = 0; i < n * 0.6; i++) fire.emit(p.x, p.y, p.z, rand(-1, 1) * 30, rand(-1, 1) * 30, rand(-1, 1) * 30, rand(0.3, 0.8), 0.12, 0.02, 4, 3, 1.5, 1, 3);
    for (let i = 0; i < n * 0.3; i++) smoke.emit(p.x + rand(-1, 1) * size, p.y + rand(-1, 1) * size, p.z, rand(-3, 3), rand(-3, 3), rand(-3, 3), rand(1.4, 3), size * 0.8, size * 3.6, kind === "rock" ? 0.2 : 0.13, kind === "rock" ? 0.18 : 0.13, kind === "rock" ? 0.16 : 0.14, 0.55, 1.2);
    const chunks = kind === "rock" ? rockChunks : hullChunks;
    for (let i = 0; i < 6 + size * 4; i++) chunks.spawn(p, _v.set(rand(-1, 1), rand(-1, 1), rand(-1, 1)).multiplyScalar(rand(4, 16)), rand(0.2, 0.6) * size, kind === "rock" ? 13156536 : 13685978, rand(1.5, 3));
    shockwave(p, size * 7, kind === "rock" ? 16756848 : 8442111, 0.5 + size * 0.1);
    lightFlash(p, 16752720, 40 * size, 0.35 + size * 0.05);
    const dist = p.distanceTo(camera.position);
    shake(clamp(size * 6 / Math.max(10, dist), 0.05, 0.7));
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
        master.gain.value = Q.has("mute") ? 0 : 0.8;
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
  function noise(dur, vol, type = "bandpass", freq = 1e3, q = 1, delay = 0, f1, dest) {
    if (!ac) return;
    const t = ac.currentTime + delay, s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = noiseBuf;
    f.type = type;
    f.frequency.setValueAtTime(freq, t);
    if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    f.Q.value = q;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
    s.connect(f).connect(g).connect(dest || master);
    s.start(t, Math.random() * 0.5);
    s.stop(t + dur + 0.05);
  }
  const panned = (p) => {
    if (!ac || !ac.createStereoPanner) return master;
    const n = ac.createStereoPanner();
    n.pan.value = p;
    n.connect(master);
    setTimeout(() => n.disconnect(), 2500);
    return n;
  };
  const sfx = {
    crack() {
      noise(0.22, 0.9, "highpass", 2600, 0.7);
      noise(0.7, 0.8, "lowpass", 500, 0.8, 0, 60);
      tone(150, 38, 0.55, 0.65, "sawtooth");
      tone(2600, 800, 0.09, 0.16, "square");
    },
    dodge(side) {
      const d = panned(side * 0.85);
      noise(0.6, 0.6, "bandpass", 260, 1.3, 0, 3400, d);
      tone(700, 1400, 0.22, 0.09, "sine", 0.1, d);
    },
    alarm() {
      tone(740, 740, 0.09, 0.08, "triangle");
      tone(988, 988, 0.09, 0.08, "triangle", 0.11);
    },
    charged() {
      tone(260, 1300, 0.28, 0.16, "sawtooth");
      noise(0.8, 0.6, "lowpass", 3200, 0.6, 0, 80);
    },
    ready() {
      tone(1320, 1760, 0.12, 0.07, "sine");
    },
    laser(p = 1) {
      tone(1400 * p, 220 * p, 0.12, 0.12, "sawtooth");
      tone(2200 * p, 600, 0.06, 0.06, "square");
    },
    boom(k = 1) {
      noise(0.5 + k * 0.4, 0.5 + k * 0.3, "lowpass", 900, 0.7, 0, 80);
      tone(110, 30, 0.4 + k * 0.3, 0.5 * k, "sine");
    },
    hitm() {
      tone(500, 300, 0.05, 0.1, "square");
      noise(0.04, 0.2, "bandpass", 3e3, 2);
    },
    shieldHit() {
      tone(200, 60, 0.35, 0.45, "sawtooth");
      noise(0.3, 0.4, "bandpass", 600, 1);
    },
    deflect() {
      tone(300, 1800, 0.2, 0.25, "square");
      tone(900, 2700, 0.25, 0.12, "sine", 0.03);
      noise(0.15, 0.3, "highpass", 3e3);
    },
    orb() {
      tone(260, 180, 0.3, 0.08, "triangle");
    },
    power() {
      [523, 784, 1047, 1568].forEach((f, i) => tone(f, f, 0.2, 0.14, "square", i * 0.05));
    },
    nova() {
      noise(1.6, 0.8, "lowpass", 4e3, 0.5, 0, 60);
      tone(60, 30, 1.4, 0.7);
      [200, 300, 400].forEach((f, i) => tone(f, f * 4, 0.8, 0.1, "sawtooth", i * 0.05));
    },
    warn() {
      tone(880, 880, 0.12, 0.15, "square");
      tone(660, 660, 0.12, 0.15, "square", 0.15);
    },
    whoosh() {
      noise(0.7, 0.4, "bandpass", 200, 1.5, 0, 2500);
    },
    combo(n) {
      tone(440 * Math.pow(2, Math.min(n, 24) / 12), 440 * Math.pow(2, Math.min(n, 24) / 12), 0.08, 0.07, "square");
    },
    press() {
      tone(660, 990, 0.12, 0.2);
    },
    boss() {
      [0, 0.3, 0.6].forEach((d) => {
        tone(90, 85, 0.5, 0.35, "sawtooth", d);
        tone(180, 170, 0.5, 0.15, "square", d);
      });
    },
    tick() {
      tone(1200, 1200, 0.05, 0.12);
    },
    end() {
      [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, f, 0.35, 0.15, "square", i * 0.14));
    }
  };
  const cockpit = new Group();
  camera.add(cockpit);
  const cabinEnv = (() => {
    const pm = new PMREMGenerator(renderer);
    const t = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    pm.dispose();
    return t;
  })();
  const cabin = (m) => {
    m.envMap = cabinEnv;
    return m;
  };
  const frameMat = cabin(shipMetal(3159355, { repeat: [4, 1], metalness: 0.35, roughness: 0.6, env: 0.35 }));
  const panelMat = cabin(shipMetal(1842979, { repeat: [3, 1], metalness: 0.25, roughness: 0.75, env: 0.12 }));
  const darkMat = cabin(new MeshStandardMaterial({ color: 724240, metalness: 0.4, roughness: 0.55, envMapIntensity: 0.3 }));
  const browMat = cabin(new MeshStandardMaterial({ color: 921618, metalness: 0.1, roughness: 0.92, envMapIntensity: 0.25 }));
  const sealMat = cabin(new MeshStandardMaterial({ color: 395015, metalness: 0, roughness: 0.85, envMapIntensity: 0.2 }));
  const gunMat = cabin(shipMetal(2764598, { repeat: [0.6, 0.6], metalness: 0.75, roughness: 0.42, env: 0.5 }));
  const HAND_COL = Object.assign({ left: "#ff7ad9", right: "#66e0ff" }, BP.handColor || {});
  function camPt(ndcX, ndcY, d) {
    const pe = camera.projectionMatrix.elements;
    return new Vector3((ndcX + pe[8]) * d / pe[0], (ndcY + pe[9]) * d / pe[5], -d);
  }
  function screenCanvas(w, h) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 4;
    return { c, g: c.getContext("2d"), t, w, h };
  }
  const MFD = { radar: screenCanvas(320, 200), att: screenCanvas(320, 200), shield: screenCanvas(320, 200), t: 0 };
  function mfdFrame(s, tint) {
    const { g, w, h } = s;
    g.fillStyle = "#020604";
    g.fillRect(0, 0, w, h);
    const v = g.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, w * 0.7);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, "rgba(0,0,0,0.55)");
    g.strokeStyle = tint;
    g.lineWidth = 1.5;
    return v;
  }
  function drawMFDs(now) {
    {
      const s = MFD.radar, g = s.g, v = mfdFrame(s, "rgba(90,255,170,0.35)"), cx = s.w / 2, cy = s.h * 0.92, R0 = s.h * 0.86;
      for (let i = 1; i <= 3; i++) {
        g.beginPath();
        g.arc(cx, cy, R0 * i / 3, Math.PI * 1.08, Math.PI * 1.92);
        g.stroke();
      }
      g.beginPath();
      g.moveTo(cx, cy);
      g.lineTo(cx, cy - R0);
      g.moveTo(cx, cy);
      g.lineTo(cx - R0 * 0.93, cy - R0 * 0.36);
      g.moveTo(cx, cy);
      g.lineTo(cx + R0 * 0.93, cy - R0 * 0.36);
      g.stroke();
      const sw = Math.PI * 1.08 + now / 1600 % 1 * Math.PI * 0.84, gr = g.createLinearGradient(cx, cy, cx + Math.cos(sw) * R0, cy + Math.sin(sw) * R0);
      gr.addColorStop(0, "rgba(120,255,180,0.0)");
      gr.addColorStop(1, "rgba(120,255,180,0.5)");
      g.strokeStyle = gr;
      g.lineWidth = 3;
      g.beginPath();
      g.moveTo(cx, cy);
      g.lineTo(cx + Math.cos(sw) * R0, cy + Math.sin(sw) * R0);
      g.stroke();
      const blip = (x, z, col, r) => {
        const px = cx + clamp((x - G.ship.x) / 60, -1, 1) * R0 * 0.9, py = cy - clamp(-z / 220, 0, 1) * R0;
        g.fillStyle = col;
        g.shadowColor = col;
        g.shadowBlur = 8;
        g.beginPath();
        g.arc(px, py, r, 0, 7);
        g.fill();
        g.shadowBlur = 0;
      };
      for (const r of rocks) if (r.alive) blip(r.p.x, r.p.z, "#7fe6ff", r.big ? 5 : 3.5);
      for (const d of drones) if (d.alive) blip(d.p.x, d.p.z, d.charging > 0 ? "#ff5050" : "#7fe6ff", 5);
      for (const m of meteors) if (m.alive) blip(m.p.x, m.p.z, "#ff5a3a", 4.5);
      if (boss.alive) blip(boss.p.x, boss.p.z, "#ffd0a0", 9);
      g.fillStyle = "#9dffc8";
      g.beginPath();
      g.moveTo(cx, cy - 9);
      g.lineTo(cx + 6, cy + 3);
      g.lineTo(cx - 6, cy + 3);
      g.fill();
      g.fillStyle = v;
      g.fillRect(0, 0, s.w, s.h);
      s.t.needsUpdate = true;
    }
    {
      const s = MFD.att, g = s.g, v = mfdFrame(s, "rgba(255,190,90,0.6)"), cx = s.w / 2, cy = s.h / 2, roll = camera.rotation.z;
      g.save();
      g.translate(cx, cy);
      g.rotate(-roll * 4);
      g.fillStyle = "rgba(40,90,150,0.55)";
      g.fillRect(-s.w, -s.h, s.w * 2, s.h);
      g.fillStyle = "rgba(90,60,30,0.55)";
      g.fillRect(-s.w, 0, s.w * 2, s.h);
      g.strokeStyle = "rgba(255,230,190,0.9)";
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(-s.w, 0);
      g.lineTo(s.w, 0);
      g.stroke();
      g.lineWidth = 1.2;
      for (let i = -3; i <= 3; i++) if (i) {
        const y = i * 22, L = i % 2 ? 26 : 44;
        g.beginPath();
        g.moveTo(-L, y);
        g.lineTo(L, y);
        g.stroke();
      }
      g.restore();
      g.strokeStyle = "#ffd27a";
      g.lineWidth = 3;
      g.beginPath();
      g.moveTo(cx - 60, cy);
      g.lineTo(cx - 18, cy);
      g.lineTo(cx - 10, cy + 8);
      g.moveTo(cx + 60, cy);
      g.lineTo(cx + 18, cy);
      g.lineTo(cx + 10, cy + 8);
      g.stroke();
      g.fillStyle = "rgba(0,0,0,0.6)";
      g.fillRect(0, 0, s.w, 22);
      g.strokeStyle = "rgba(255,210,140,0.8)";
      g.lineWidth = 1.2;
      const hd = G.ship.x * 4 + now / 300;
      for (let i = -8; i <= 8; i++) {
        const x = cx + (i - hd % 1) * 18;
        g.beginPath();
        g.moveTo(x, 22);
        g.lineTo(x, Math.round(i + hd) % 3 ? 15 : 8);
        g.stroke();
      }
      g.fillStyle = v;
      g.fillRect(0, 0, s.w, s.h);
      s.t.needsUpdate = true;
    }
    {
      const s = MFD.shield, g = s.g, v = mfdFrame(s, "rgba(120,220,255,0.35)"), cx = s.w * 0.36, cy = s.h * 0.58, k = clamp(G.shield / 100, 0, 1), low = G.shield < 35, hit = (G.hitFlash || 0) > 0.2 && Math.sin(now / 50) > 0;
      g.lineWidth = 14;
      g.strokeStyle = "rgba(120,200,255,0.15)";
      g.beginPath();
      g.arc(cx, cy, 62, Math.PI * 0.75, Math.PI * 2.25);
      g.stroke();
      g.strokeStyle = hit ? "#ffffff" : low ? "#ff5a4a" : "#6fe0ff";
      g.shadowColor = g.strokeStyle;
      g.shadowBlur = 10;
      g.beginPath();
      g.arc(cx, cy, 62, Math.PI * 0.75, Math.PI * (0.75 + 1.5 * k));
      g.stroke();
      g.shadowBlur = 0;
      for (let i = 0; i < 5; i++) {
        g.fillStyle = G.shield > i * 20 + 4 ? low ? "#ff6a50" : "#57d0ff" : "rgba(255,255,255,0.08)";
        g.fillRect(cx - 40 + i * 17, cy - 8, 13, 16);
      }
      for (let i = 0; i < 4; i++) {
        const hgt = 30 + 40 * (0.6 + 0.4 * Math.sin(now / (380 + i * 90) + i));
        g.fillStyle = "rgba(255,255,255,0.08)";
        g.fillRect(s.w * 0.7 + i * 18, s.h * 0.2, 11, 90);
        g.fillStyle = "#9dffc8";
        g.fillRect(s.w * 0.7 + i * 18, s.h * 0.2 + 90 - hgt, 11, hgt);
      }
      g.fillStyle = v;
      g.fillRect(0, 0, s.w, s.h);
      s.t.needsUpdate = true;
    }
  }
  let cannons = {}, glass = null;
  function buildCockpit() {
    while (cockpit.children.length) cockpit.remove(cockpit.children[0]);
    camera.updateProjectionMatrix();
    const add = (geo, mat, cast = true) => {
      const m = new Mesh(geo, mat);
      m.castShadow = cast;
      m.receiveShadow = true;
      cockpit.add(m);
      return m;
    };
    const strut = (pts, r, mat, seg = 10) => add(new TubeGeometry(new CatmullRomCurve3(pts), 48, r, seg, false), mat);
    const d = 1.2;
    for (const sx of [-1, 1]) {
      strut([camPt(sx * 1.08, -0.78, d), camPt(sx * 1, 0, d), camPt(sx * 0.82, 0.84, d), camPt(sx * 0.3, 1.06, d), camPt(0, 1.08, d)], 0.05, frameMat);
      strut([camPt(sx * 1, -0.72, d * 0.99), camPt(sx * 0.935, 0, d * 0.99), camPt(sx * 0.77, 0.79, d * 0.99), camPt(sx * 0.3, 1, d * 0.99)], 0.012, sealMat, 6);
      const rv = new InstancedMesh(new SphereGeometry(6e-3, 8, 4), frameMat, 14), c = new CatmullRomCurve3([camPt(sx * 1.08, -0.78, d * 0.97), camPt(sx * 1, 0, d * 0.97), camPt(sx * 0.82, 0.84, d * 0.97)]);
      for (let i = 0; i < 14; i++) {
        const p = c.getPoint(i / 13);
        p.x -= sx * 0.03;
        rv.setMatrixAt(i, _m.makeTranslation(p.x, p.y, p.z + 0.03));
      }
      cockpit.add(rv);
    }
    const TH = 1.25, top = -0.78, rTop = 0.95, rBot = 0.83, yTop = top * rTop / camera.projectionMatrix.elements[5], yBot = yTop - 0.17;
    const pan = new CylinderGeometry(rTop, rBot, yTop - yBot, 96, 4, true, Math.PI - TH, TH * 2);
    pan.translate(0, (yTop + yBot) / 2, 0);
    panelMat.side = DoubleSide;
    add(pan, panelMat);
    const brow = new RingGeometry(rTop - 5e-3, rTop + 0.06, 96, 1, Math.PI / 2 - TH, TH * 2);
    brow.rotateX(-Math.PI / 2);
    brow.translate(0, yTop, 0);
    add(brow, browMat);
    const lip = new CylinderGeometry(rTop + 0.06, rTop + 0.06, 0.025, 96, 1, true, Math.PI - TH, TH * 2);
    lip.translate(0, yTop - 0.012, 0);
    add(lip, darkMat);
    const edge = new TorusGeometry(rTop, 8e-3, 6, 96, TH * 2);
    edge.rotateX(Math.PI / 2);
    edge.rotateY(Math.PI / 2 + TH);
    edge.translate(0, yTop, 0);
    add(edge, sealMat);
    const tilt = Math.atan2(rTop - rBot, yTop - yBot);
    const mount = (o, th, y) => {
      const r = lerp(rBot, rTop, (y - yBot) / (yTop - yBot)) - 4e-3;
      o.position.set(Math.sin(th) * r, y, -Math.cos(th) * r);
      o.quaternion.setFromRotationMatrix(_m.lookAt(_v.set(0, y + r * Math.tan(tilt), 0), o.position, _v2.set(0, 1, 0)));
      cockpit.add(o);
      return o;
    };
    const yMid = yTop - 0.046;
    for (const [key, th, w, hgt] of [["radar", -0.36, 0.13, 0.08], ["att", 0, 0.125, 0.078], ["shield", 0.36, 0.13, 0.08]]) {
      const grp = new Group();
      const bez = new Mesh(new RoundedBoxGeometry(w + 0.03, hgt + 0.03, 0.014, 2, 6e-3), darkMat);
      bez.castShadow = bez.receiveShadow = true;
      bez.position.z = 2e-3;
      grp.add(bez);
      const scr = new Mesh(new PlaneGeometry(w, hgt), new MeshStandardMaterial({ color: 197637, roughness: 0.32, metalness: 0, emissive: 16777215, emissiveMap: MFD[key].t, emissiveIntensity: 0.55, envMap: cabinEnv, envMapIntensity: 0.12 }));
      scr.position.z = 0.0105;
      scr.receiveShadow = true;
      grp.add(scr);
      const btn = new InstancedMesh(new RoundedBoxGeometry(0.011, 8e-3, 6e-3, 1, 2e-3), sealMat, 10);
      for (let i = 0; i < 5; i++) for (const s of [-1, 1]) btn.setMatrixAt(i * 2 + (s > 0), _m.makeTranslation(s * (w / 2 + 8e-3) * 1 - s * 0, -hgt / 2 + 0.012 + i * (hgt - 0.024) / 4, 0.011));
      btn.position.x = 0;
      grp.add(btn);
      mount(grp, th, yMid);
    }
    const ledCols = [new Color(0.3, 1.6, 0.5), new Color(1.8, 0.9, 0.2), new Color(0.3, 1, 1.8)];
    for (const sx of [-1, 1]) for (let b = 0; b < 2; b++) {
      const grp = new Group(), plate = new Mesh(new RoundedBoxGeometry(0.15, 0.06, 0.01, 2, 4e-3), darkMat);
      plate.receiveShadow = true;
      grp.add(plate);
      const tog = new InstancedMesh(new CylinderGeometry(35e-4, 35e-4, 0.018, 8), cabin(new MeshStandardMaterial({ color: 12106946, metalness: 0.9, roughness: 0.3 })), 6);
      for (let i = 0; i < 6; i++) {
        _q.setFromEuler(new Euler(Math.PI / 2 + (Math.random() < 0.5 ? 0.5 : -0.5), 0, 0));
        tog.setMatrixAt(i, _m.compose(_v.set(-0.06 + i * 0.024, 6e-3, 0.012), _q, _s.set(1, 1, 1)));
      }
      grp.add(tog);
      const led = new InstancedMesh(new SphereGeometry(35e-4, 8, 6), new MeshBasicMaterial({ color: 16777215 }), 6);
      for (let i = 0; i < 6; i++) {
        led.setMatrixAt(i, _m.makeTranslation(-0.06 + i * 0.024, -0.017, 6e-3));
        led.setColorAt(i, ledCols[(i + b + (sx > 0 ? 1 : 0)) % 3]);
      }
      grp.add(led);
      mount(grp, sx * (0.66 + b * 0.2), yMid - 0.01 - b * 0.012);
    }
    cannons = {};
    for (const [side, sx] of [["left", -1], ["right", 1]]) {
      const g = new Group(), body = new Group();
      g.add(body);
      const hc = new Color(HAND_COL[side]), glow = new MeshBasicMaterial({ color: hc.clone().multiplyScalar(1.25) });
      const m = (geo, mat, z, rotX = true) => {
        if (rotX) geo.rotateX(Math.PI / 2);
        const o = new Mesh(geo, mat);
        o.position.z = z;
        o.castShadow = true;
        body.add(o);
        return o;
      };
      m(new RoundedBoxGeometry(0.12, 0.1, 0.32, 3, 0.02), gunMat, 0, false);
      m(new CylinderGeometry(0.03, 0.034, 0.52, 20), gunMat, 0.36);
      for (let i = 0; i < 5; i++) m(new CylinderGeometry(0.042, 0.042, 0.018, 16), darkMat, 0.2 + i * 0.045);
      m(new CylinderGeometry(0.04, 0.036, 0.07, 16), darkMat, 0.6);
      for (const fy of [-1, 1]) {
        const strip = new Mesh(new BoxGeometry(8e-3, 0.012, 0.26), glow);
        strip.position.set(0, fy * 0.052, 0);
        body.add(strip);
      }
      const ring = new Mesh(new TorusGeometry(0.03, 4e-3, 8, 24), glow);
      ring.position.z = 0.645;
      body.add(ring);
      const tail = new Mesh(new RoundedBoxGeometry(0.07, 0.034, 0.01, 2, 8e-3), glow);
      tail.position.z = -0.163;
      body.add(tail);
      const tip2 = new Object3D();
      tip2.position.z = 0.66;
      body.add(tip2);
      const p = camPt(sx * 0.76, -0.6, 1.3);
      g.position.copy(p);
      cockpit.add(g);
      const py = new Mesh(new RoundedBoxGeometry(0.06, 0.16, 0.16, 2, 0.012), gunMat);
      py.position.set(p.x, p.y - 0.1, p.z - 0.02);
      py.castShadow = true;
      cockpit.add(py);
      cannons[side] = { g, body, tip: tip2, glow, recoil: 0, heat: 0, home: p.clone() };
    }
    glass = new Mesh(new PlaneGeometry(2, 2), new ShaderMaterial({
      uniforms: { tGlass: { value: glassTex }, uSun: { value: new Vector3(0.5, 0.5, 1) }, uAspect: { value: innerWidth / innerHeight }, uHit: { value: 0 } },
      vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
      fragmentShader: "uniform sampler2D tGlass; uniform vec3 uSun; uniform float uAspect, uHit; varying vec2 vUv;\n      void main(){\n        vec3 tx = texture2D(tGlass, vUv * vec2(uAspect, 1.0) * 0.55).rgb;\n        vec2 d = (vUv - uSun.xy) * vec2(uAspect, 1.0); float r = length(d);\n        float glare = uSun.z * (exp(-r * 6.5) + exp(-r * 2.2) * 0.12);                                // only glass near the sun lights up\n        float scratch = tx.r * glare * 1.3, smudge = tx.g * glare * 0.22, dust = tx.b * (glare * 0.7 + 0.008);\n        vec3 col = vec3(1.0, 0.96, 0.9) * (scratch + smudge + dust);\n        col += vec3(0.25, 0.55, 0.7) * smoothstep(0.32, 0.0, vUv.y) * 0.012;                         // the panel's glow reflected low in the glass\n        gl_FragColor = vec4(col, 1.0);\n      }",
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: CustomBlending,
      blendEquation: AddEquation,
      blendSrc: OneFactor,
      blendDst: OneFactor,
      blendSrcAlpha: ZeroFactor,
      blendDstAlpha: OneFactor
    }));
    glass.frustumCulled = false;
    glass.renderOrder = 30;
    cockpit.add(glass);
  }
  const glassTex = canvasTex(1024, 1024, (g, w) => {
    g.fillStyle = "#000";
    g.fillRect(0, 0, w, w);
    g.globalCompositeOperation = "lighter";
    g.strokeStyle = "rgba(255,0,0,0.22)";
    g.lineWidth = 0.7;
    for (let i = 0; i < 420; i++) {
      const cx = rand(-w * 0.3, w * 1.3), cy = rand(-w * 0.3, w * 1.3), r = rand(w * 0.1, w * 0.7), a0 = rand(0, 6.283);
      g.globalAlpha = rand(0.15, 0.8);
      g.beginPath();
      g.arc(cx, cy, r, a0, a0 + rand(0.02, 0.09));
      g.stroke();
    }
    for (let i = 0; i < 5; i++) {
      g.globalAlpha = rand(0.3, 1);
      g.beginPath();
      const x = rand(0, w), y = rand(0, w), a = rand(0, 6.283), L = rand(40, 260);
      g.moveTo(x, y);
      g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L);
      g.stroke();
    }
    for (let i = 0; i < 22; i++) {
      const x = rand(0, w), y = rand(0, w), r = rand(30, 140), gr = g.createRadialGradient(x, y, 0, x, y, r);
      g.globalAlpha = rand(0.15, 0.45);
      gr.addColorStop(0, "rgba(0,255,0,0.5)");
      gr.addColorStop(1, "rgba(0,255,0,0)");
      g.fillStyle = gr;
      g.fillRect(x - r, y - r, r * 2, r * 2);
    }
    for (let i = 0; i < 900; i++) {
      g.globalAlpha = rand(0.2, 1);
      g.fillStyle = "rgb(0,0,255)";
      g.fillRect(rand(0, w), rand(0, w), rand(0.6, 1.8), rand(0.6, 1.8));
    }
    g.globalAlpha = 1;
  }, { srgb: false });
  glassTex.wrapS = glassTex.wrapT = RepeatWrapping;
  const cockpitLight = new PointLight(13162730, 0.5, 3, 2);
  camera.add(cockpitLight);
  cockpitLight.position.set(0, 0.35, 0.25);
  const screenLight = new PointLight(8376512, 0.25, 1.2, 2);
  camera.add(screenLight);
  screenLight.position.set(0, -0.3, -0.6);
  const STREAKS = 90;
  const streakGeo = new BufferGeometry();
  const streakPos = new Float32Array(STREAKS * 6);
  streakGeo.setAttribute("position", new BufferAttribute(streakPos, 3).setUsage(DynamicDrawUsage));
  const streakCol = new Float32Array(STREAKS * 6);
  for (let i = 0; i < STREAKS; i++) {
    const c = rand(0.03, 0.09);
    streakCol.set([c, c * 0.96, c * 0.9, 0, 0, 0], i * 6);
  }
  streakGeo.setAttribute("color", new BufferAttribute(streakCol, 3));
  const streaks = new LineSegments(streakGeo, new LineBasicMaterial({ vertexColors: true, transparent: true, blending: AdditiveBlending, depthWrite: false }));
  streaks.frustumCulled = false;
  scene.add(streaks);
  const streakData = Array.from({ length: STREAKS }, () => {
    const a = rand(0, 6.283), rr = rand(18, 70);
    return { x: Math.cos(a) * rr * 1.4, y: Math.sin(a) * rr * 0.8, z: rand(-400, 0) };
  });
  const dust = [];
  const hexTex = canvasTex(128, 128, (g, w) => {
    g.translate(w / 2, w / 2);
    g.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3 + 0.3;
      g[i ? "lineTo" : "moveTo"](Math.cos(a) * w * 0.46, Math.sin(a) * w * 0.46);
    }
    g.closePath();
    const gr = g.createRadialGradient(0, 0, 0, 0, 0, w * 0.46);
    gr.addColorStop(0, "rgba(255,255,255,0.35)");
    gr.addColorStop(0.85, "rgba(255,255,255,0.6)");
    gr.addColorStop(1, "rgba(255,255,255,0.15)");
    g.fillStyle = gr;
    g.fill();
  }, { srgb: false });
  const flareEls = [[0.45, 0.05, 16769200], [-0.6, 0.08, 11589887]].map(([f, s, c]) => {
    const m = new Sprite(new SpriteMaterial({ map: hexTex, color: c, transparent: true, depthTest: false, depthWrite: false, blending: AdditiveBlending, opacity: 0.1 }));
    m.renderOrder = 20;
    camera.add(m);
    return { m, f, s };
  });
  function updateFlare() {
    sunGroup.position.copy(camera.position).addScaledVector(SUN, 1500);
    sunLight.position.copy(camera.position).addScaledVector(SUN, 10);
    sunLight.target.position.copy(camera.position);
    sunLight.target.updateMatrixWorld();
    const p = _v.copy(SUN).multiplyScalar(1e3).add(camera.position).project(camera);
    const vis = p.z < 1 && Math.abs(p.x) < 1.3 && Math.abs(p.y) < 1.3 ? 1 - Math.max(0, Math.max(Math.abs(p.x), Math.abs(p.y)) - 0.9) / 0.4 : 0;
    for (const e of flareEls) {
      e.m.position.copy(camPt(p.x * e.f, p.y * e.f, 2));
      e.m.scale.setScalar(e.s * 1.4);
      e.m.material.opacity = 0.018 * clamp(vis, 0, 1);
    }
    sunGroup.userData.burst.material.rotation = camera.rotation.z * 0.5;
    if (glass) {
      const u = glass.material.uniforms;
      u.uSun.value.set((p.x + 1) / 2, (p.y + 1) / 2, clamp(vis, 0, 1) * (p.z < 1 ? 1 : 0));
      u.uAspect.value = innerWidth / innerHeight;
    }
  }
  const simplex = new SimplexNoise();
  const rockGeo = ROCK_SHAPES.length ? ROCK_SHAPES[0].geo : (() => {
    const g = new IcosahedronGeometry(1, 5), P = g.attributes.position;
    for (let i = 0; i < P.count; i++) {
      _v.fromBufferAttribute(P, i);
      const n = simplex.noise3d(_v.x * 1.3, _v.y * 1.3, _v.z * 1.3) * 0.28 + simplex.noise3d(_v.x * 4, _v.y * 4, _v.z * 4) * 0.07;
      _v.multiplyScalar(1 + n);
      _v.y *= 0.82;
      P.setXYZ(i, _v.x, _v.y, _v.z);
    }
    g.computeVertexNormals();
    return g;
  })();
  const ROCK_GEOS = ROCK_SHAPES.length ? ROCK_SHAPES.map((s) => s.geo) : [rockGeo];
  function rimify(mat, col, power, lava) {
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uRim = { value: col };
      if (lava) sh.uniforms.uLava = { value: lava };
      sh.fragmentShader = sh.fragmentShader.replace("void main() {", "uniform vec3 uRim;\n" + (lava ? "uniform vec3 uLava;\n" : "") + "void main() {\n  float bpLum = 0.5;").replace("#include <map_fragment>", "#include <map_fragment>\n#ifdef USE_MAP\n  bpLum = dot(sampledDiffuseColor.rgb, vec3(0.333));\n#endif").replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n  totalEmissiveRadiance += uRim * pow(1.0 - clamp(abs(dot(normal, normalize(vViewPosition))), 0.0, 1.0), ".concat(power.toFixed(2), ");") + (lava ? "\n  totalEmissiveRadiance += uLava * smoothstep(0.36, 0.2, bpLum);" : ""));
    };
    mat.customProgramCacheKey = () => "rim-" + col.r.toFixed(2) + col.g.toFixed(2) + col.b.toFixed(2) + power + (lava ? "lava" : "");
    return mat;
  }
  const targetRockMat = rimify(rockMat.clone(), new Color(0.45, 1.5, 3.2), 1.7);
  targetRockMat.color = new Color(13164799);
  targetRockMat.emissive = new Color(801372);
  targetRockMat.emissiveIntensity = 1;
  targetRockMat.envMapIntensity = 0.5;
  const dangerMat = rimify(rockMat.clone(), new Color(4.5, 0.35, 0.08), 1.1, new Color(4, 0.45, 0.08));
  dangerMat.color = new Color(5907480);
  dangerMat.emissive = new Color(11538948);
  dangerMat.emissiveIntensity = 0.9;
  let nextId = 1;
  const SHIP_R = 1.1;
  const MAXR = 24;
  const rockMeshes = ROCK_GEOS.map((g) => {
    const M = new InstancedMesh(g, targetRockMat, MAXR);
    M.frustumCulled = false;
    M.instanceMatrix.setUsage(DynamicDrawUsage);
    scene.add(M);
    return M;
  });
  const rockMesh = { setMatrixAt: (i, m) => {
    for (const M of rockMeshes) {
      M.setMatrixAt(i, m);
      M.instanceMatrix.needsUpdate = true;
    }
  } };
  const rocks = Array.from({ length: MAXR }, (_, i) => {
    rockMesh.setMatrixAt(i, _m.makeScale(0, 0, 0));
    return { i, shape: i % ROCK_GEOS.length, alive: false, p: new Vector3(), v: new Vector3(), q: new Quaternion(), ax: new Vector3(), w: 0, s: 1, hp: 1, kind: "rock", age: 0 };
  });
  function spawnRock(big, at, vel, opts = {}) {
    const r = rocks.find((r2) => !r2.alive);
    if (!r) return null;
    r.shape = Math.random() * ROCK_GEOS.length | 0;
    r.alive = true;
    r.id = nextId++;
    r.s = big ? rand(3.9, 4.5) : rand(2.5, 3);
    if (vel) r.v.copy(vel);
    if (at) r.p.copy(at);
    else {
      const tanV = Math.tan(MathUtils.degToRad(camera.fov / 2)), tanH = tanV * camera.aspect;
      const spread = 1 - 0.3 * G.struggle, side = opts.side || (Math.random() < 0.5 ? -1 : 1);
      const ax = side * rand(0.12, 0.86) * spread, ay = rand(-0.5, 0.68) * spread;
      const bx = clamp(ax + rand(-0.4, 0.4) * spread, -0.88, 0.88), by = clamp(ay + rand(-0.3, 0.3) * spread, -0.55, 0.7);
      const z0 = rand(145, 160), z1 = 34;
      r.p.set(G.ship.x + ax * tanH * z0, G.ship.y + ay * tanV * z0, -z0);
      const e = _v.set(G.ship.x + bx * tanH * z1, G.ship.y + by * tanV * z1, -z1).sub(r.p), t = e.z / G.targetV;
      if (!vel) r.v.set(e.x / t, e.y / t, 0);
    }
    r.ax.set(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize();
    r.w = rand(0.3, 1);
    r.q.setFromEuler(new Euler(rand(0, 6), rand(0, 6), rand(0, 6)));
    return r;
  }
  const droneProto = (() => {
    const g = new Group(), hull = shipMetal(6186349, { repeat: [1, 1], metalness: 0.6, roughness: 0.5 }), dark = shipMetal(1909030, { repeat: [1, 1], metalness: 0.7, roughness: 0.45 });
    const glow = new MeshBasicMaterial({ color: new Color(0.5, 2, 3.2) }), eye = new MeshBasicMaterial({ color: new Color(0.6, 2.2, 3.2) });
    glow.name = "droneGlow";
    eye.name = "droneEye";
    const add = (geo, mat, x = 0, y = 0, z = 0, cast = false) => {
      const m = new Mesh(geo, mat);
      m.position.set(x, y, z);
      g.add(m);
      return m;
    };
    const fus = new LatheGeometry([[1e-3, 2.4], [0.12, 2.25], [0.32, 1.8], [0.5, 1.1], [0.62, 0.2], [0.6, -0.8], [0.5, -1.6], [0.38, -2], [1e-3, -2]].map(([x, y]) => new Vector2(x, y)), 28);
    fus.rotateX(Math.PI / 2);
    fus.scale(1.15, 0.62, 1);
    add(fus, hull);
    const can = new SphereGeometry(0.42, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    can.scale(0.85, 0.6, 1.8);
    add(can, new MeshPhysicalMaterial({ color: 395533, metalness: 0.3, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.6 }), 0, 0.26, 0.85);
    const wShape = new Shape([[0.45, -0.7], [2.25, 0.75], [2.25, 1.35], [0.45, 1.55]].map(([x, y]) => new Vector2(x, y)));
    const wing = new ExtrudeGeometry(wShape, { depth: 0.1, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 2 });
    wing.rotateX(-Math.PI / 2);
    wing.translate(0, -0.05, 0);
    for (const sx of [-1, 1]) {
      const w = add(wing, hull, 0, -0.04, 0);
      w.scale.x = sx;
      w.rotation.z = -sx * 0.07;
      const nac = new CylinderGeometry(0.26, 0.31, 2, 22);
      nac.rotateX(Math.PI / 2);
      add(nac, hull, sx * 0.88, -0.05, -0.85);
      const lip = new TorusGeometry(0.25, 0.05, 8, 22);
      add(lip, dark, sx * 0.88, -0.05, 0.16);
      add(new CircleGeometry(0.21, 22), glow, sx * 0.88, -0.05, 0.08).material = glow;
      const noz = new CylinderGeometry(0.3, 0.22, 0.34, 22, 1, true);
      noz.rotateX(Math.PI / 2);
      add(noz, dark, sx * 0.88, -0.05, -2);
      const ex = add(new CircleGeometry(0.2, 22), glow, sx * 0.88, -0.05, -2.1);
      ex.rotation.y = Math.PI;
      const plume = new Sprite(new SpriteMaterial({ map: glowTex, color: 5945599, transparent: true, depthWrite: false, blending: AdditiveBlending, opacity: 0.7 }));
      plume.position.set(sx * 0.88, -0.05, -2.5);
      plume.scale.set(1, 1, 1);
      plume.name = "plume";
      g.add(plume);
      const fin = new ExtrudeGeometry(new Shape([[0, 0], [0.75, 0], [0.75, 0.15], [0.25, 0.62], [0, 0.62]].map(([x, y]) => new Vector2(x, y))), { depth: 0.05, bevelEnabled: false });
      fin.rotateY(Math.PI / 2);
      const f = add(fin, hull, sx * 0.88, 0.2, -1.05);
      f.rotation.z = -sx * 0.25;
      add(new SphereGeometry(0.075, 12, 8), glow, sx * 2.27, -0.04, -1.05);
      const gun = new CylinderGeometry(0.045, 0.06, 1.1, 10);
      gun.rotateX(Math.PI / 2);
      add(gun, dark, sx * 1.45, -0.1, 0.45);
    }
    for (let i = 0; i < 5; i++) add(new RoundedBoxGeometry(rand(0.25, 0.42), 0.06, rand(0.25, 0.5), 2, 0.02), i % 2 ? dark : hull, rand(-0.22, 0.22), 0.36 - i * 0.015, -0.2 - i * 0.36);
    const nose = new CylinderGeometry(0.07, 0.11, 0.5, 12);
    nose.rotateX(Math.PI / 2);
    add(nose, dark, 0, -0.2, 2);
    const e = add(new SphereGeometry(0.16, 20, 12), eye, 0, -0.2, 2.24);
    e.scale.z = 0.5;
    g.userData.glow = glow;
    g.userData.eye = eye;
    return g;
  })();
  const drones = Array.from({ length: 6 }, () => {
    const g = droneProto.clone(true), glow = droneProto.userData.glow.clone(), eye = droneProto.userData.eye.clone(), plumes = [];
    g.traverse((o) => {
      if (o.material === droneProto.userData.glow) o.material = glow;
      else if (o.material === droneProto.userData.eye) o.material = eye;
      if (o.name === "plume") {
        o.material = o.material.clone();
        plumes.push(o);
      }
    });
    g.visible = false;
    scene.add(g);
    return { g, glow, eye, plumes, yaw: 0, lx: 0, alive: false, p: new Vector3(), hp: 2, t: 0, kind: "drone" };
  });
  function spawnDrone(slot, n) {
    const d = drones.find((d2) => !d2.alive);
    if (!d) return;
    d.alive = true;
    d.id = nextId++;
    d.hp = G.hardcore ? 3 : 2;
    d.t = 0;
    d.slot = slot;
    d.n = n;
    d.fireT = rand(4, 5.5) * (1 + 0.5 * G.struggle);
    d.flash = 0;
    d.charging = 0;
    d.home = new Vector3((slot - (n - 1) / 2) * 13 + rand(-1.5, 1.5), rand(-3, 7), -rand(50, 62));
    d.p.set(d.home.x * 2.5, d.home.y + rand(10, 20), -320);
    d.lx = d.p.x;
    d.yaw = 0;
    d.leave = rand(11, 14);
    d.g.visible = true;
    d.g.scale.setScalar(1.7);
  }
  const MAXM = 6;
  const metMesh = new InstancedMesh(ROCK_GEOS[ROCK_GEOS.length - 1], dangerMat, MAXM);
  metMesh.frustumCulled = false;
  metMesh.instanceMatrix.setUsage(DynamicDrawUsage);
  scene.add(metMesh);
  const redHalo = () => {
    const s = new Sprite(new SpriteMaterial({ map: glowTex, color: 16726554, transparent: true, depthWrite: false, blending: AdditiveBlending }));
    s.visible = false;
    scene.add(s);
    return s;
  };
  const meteors = Array.from({ length: MAXM }, (_, i) => {
    metMesh.setMatrixAt(i, _m.makeScale(0, 0, 0));
    return { i, kind: "meteor", alive: false, p: new Vector3(), v: new Vector3(), q: new Quaternion(), ax: new Vector3(1, 0, 0), w: 1, s: 1.8, r: 1.8, halo: redHalo(), cross: { x: 0, y: 0 } };
  });
  const orbMat = new MeshBasicMaterial({ color: new Color(4, 0.45, 0.3) });
  const orbs = Array.from({ length: 8 }, () => {
    const m = new Mesh(new SphereGeometry(1.1, 20, 14), orbMat);
    m.visible = false;
    scene.add(m);
    const halo = new Sprite(new SpriteMaterial({ map: glowTex, color: 16724e3, transparent: true, depthWrite: false, blending: AdditiveBlending }));
    halo.scale.setScalar(7);
    m.add(halo);
    return { m, halo, kind: "orb", alive: false, p: new Vector3(), v: new Vector3(), r: 1, cross: { x: 0, y: 0 } };
  });
  const liveDangers = () => meteors.filter((m) => m.alive && !m.done).concat(orbs.filter((o) => o.alive && !o.done));
  function dangerRoom(tta) {
    const live = liveDangers(), cap = G.dangerCap;
    const charging = drones.filter((d) => d.alive && d.charging > 0).length;
    if (live.length + charging + (boss.beamOn ? 1 : 0) >= cap) return false;
    const at = G.gt + tta, gap = G.gap;
    for (const d of live) if (Math.abs(d.arriveAt - at) < gap) return false;
    if (boss.beamOn && Math.abs(boss.beamAt - at) < gap) return false;
    return true;
  }
  function aimDanger(o, speed, locked) {
    const tta = Math.max(0.05, -o.p.z / speed);
    o.cross.x = G.ship.x + (o.off || 0);
    o.cross.y = G.ship.y + (o.offY || 0);
    o.v.set((o.cross.x - o.p.x) / tta, (o.cross.y - o.p.y) / tta, speed);
    o.arriveAt = G.gt + tta;
    o.locked = locked;
  }
  function spawnMeteor() {
    const m = meteors.find((m2) => !m2.alive);
    if (!m) return null;
    const speed = G.metV;
    m.alive = true;
    m.done = false;
    m.id = nextId++;
    m.s = rand(1.7, 2.1);
    m.r = m.s * 0.95;
    m.alarmed = false;
    m.trail = 0;
    m.off = G.hardcore && Math.random() < 0.3 ? rand(-2.5, 2.5) : 0;
    m.offY = rand(-0.3, 0.5);
    m.p.set(G.ship.x + pick([-1, 1]) * rand(6, 14), rand(-2, 7), -210);
    aimDanger(m, speed, false);
    m.speed = speed;
    m.ax.set(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize();
    m.w = rand(0.8, 2);
    m.halo.visible = true;
    m.halo.scale.setScalar(m.s * 4);
    return m;
  }
  function fireOrb(from, src, speed = 24) {
    const o = orbs.find((o2) => !o2.alive);
    if (!o) return null;
    o.alive = true;
    o.done = false;
    o.id = nextId++;
    o.src = src;
    o.p.copy(from);
    o.alarmed = false;
    o.off = 0;
    o.offY = 0;
    o.speed = speed * (G.hardcore ? 1.2 : 1) * (1 - 0.2 * G.struggle);
    aimDanger(o, o.speed, true);
    o.m.visible = true;
    sfx.orb();
    return o;
  }
  const capsules = Array.from({ length: 2 }, () => {
    const g = new Group();
    const shell = new Mesh(new CapsuleGeometry(0.9, 1.2, 8, 24), new MeshPhysicalMaterial({ color: 16777215, metalness: 0.3, roughness: 0.1, clearcoat: 1, transparent: true, opacity: 0.55 }));
    g.add(shell);
    const core = new Mesh(new SphereGeometry(0.62, 20, 14), new MeshBasicMaterial({ color: new Color(0.6, 3.2, 1.2) }));
    g.add(core);
    const halo = new Sprite(new SpriteMaterial({ map: glowTex, color: 4063114, transparent: true, depthWrite: false, blending: AdditiveBlending }));
    halo.scale.setScalar(6);
    g.add(halo);
    g.visible = false;
    scene.add(g);
    return { g, core, alive: false, p: new Vector3(), kind: "power" };
  });
  function spawnCapsule() {
    const c = capsules.find((c2) => !c2.alive);
    if (!c) return;
    c.alive = true;
    c.id = nextId++;
    c.p.set(G.ship.x + pick([-1, 1]) * rand(4, 9), rand(-2, 5), -200);
    c.g.visible = true;
    G.lastCapsule = G.gt;
  }
  const beamMat = new ShaderMaterial({
    uniforms: { uCol: { value: new Color(3, 0.35, 0.6) }, uT: { value: 0 } },
    vertexShader: "varying vec3 vN; varying vec3 vV; varying vec2 vU; varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz); vU = uv; gl_Position = projectionMatrix * viewMatrix * w; }",
    fragmentShader: "uniform vec3 uCol; uniform float uT; varying vec3 vN; varying vec3 vV; varying vec2 vU; varying vec3 vW;\n    void main(){ float f = abs(dot(normalize(vN), normalize(vV))); float core = pow(f, 3.0); float flick = 0.85 + 0.15 * sin(vU.y * 80.0 + uT * 40.0);\n      float near = smoothstep(2.0, 14.0, length(cameraPosition - vW));\n      gl_FragColor = vec4(uCol * (0.22 + core * 1.3) * flick + vec3(core * core * 0.9), (0.12 + core * 0.7) * near); }",
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide
  });
  const boss = { g: new Group(), alive: false, hp: 0, cores: [], eye: null, p: new Vector3(0, 6, -400), t: 0, attackT: 4, beamT: 0, dying: 0 };
  {
    const g = boss.g;
    scene.add(g);
    g.visible = false;
    g.scale.setScalar(1.15);
    const bl = new PointLight(10139903, 0, 80, 1.2);
    scene.add(bl);
    boss.light = bl;
    const prof = [[0.01, -3.5], [6, -3], [13, -1], [14.5, 0], [13, 1], [8, 2.6], [4, 4.2], [0.01, 4.6]].map(([x, y]) => new Vector2(x, y));
    const bossMetal = shipMetal(9080983, { repeat: [10, 3], metalness: 0.65, roughness: 0.5 }), bossDark = shipMetal(2764597, { repeat: [3, 3], metalness: 0.7, roughness: 0.45 });
    const hull = new Mesh(new LatheGeometry(prof, 96), bossMetal);
    g.add(hull);
    const rimRing = new Mesh(new TorusGeometry(14.3, 0.55, 14, 160), bossDark);
    rimRing.rotation.x = Math.PI / 2;
    g.add(rimRing);
    const ring = new Mesh(new TorusGeometry(14.86, 0.07, 6, 160), new MeshBasicMaterial({ color: new Color(0.6, 1.4, 2.2) }));
    ring.rotation.x = Math.PI / 2;
    g.add(ring);
    boss.ring = ring;
    for (let i = 0; i < 14; i++) {
      const fin = new Mesh(new RoundedBoxGeometry(0.6, 2.4, 5, 2, 0.12), bossDark);
      const a = i / 14 * Math.PI * 2;
      fin.position.set(Math.cos(a) * 11, -1.6, Math.sin(a) * 11);
      fin.rotation.y = -a;
      g.add(fin);
    }
    const surfY = (r, top) => {
      const pts = top ? [[14.5, 0], [13, 1], [8, 2.6], [4, 4.2], [0, 4.6]] : [[14.5, 0], [13, -1], [6, -3], [0, -3.5]];
      for (let i = 0; i < pts.length - 1; i++) {
        const [r0, y0] = pts[i], [r1, y1] = pts[i + 1];
        if (r <= r0 && r >= r1) return y0 + (y1 - y0) * (r - r0) / (r1 - r0);
      }
      return pts[pts.length - 1][1];
    };
    const N = 340, greeb = new InstancedMesh(new RoundedBoxGeometry(1, 1, 1, 1, 0.08), bossMetal, N), gm = new Matrix4(), gq = new Quaternion(), gs = new Vector3(), gp = new Vector3(), up = new Vector3(0, 1, 0);
    for (let i = 0; i < N; i++) {
      const top = i < N * 0.62, a = Math.random() * Math.PI * 2, r = rand(2.5, 13.6), y = surfY(r, top);
      gp.set(Math.cos(a) * r, y + (top ? 0.05 : -0.05), Math.sin(a) * r);
      gq.setFromAxisAngle(up, -a + (Math.random() < 0.5 ? 0 : Math.PI / 2));
      gs.set(rand(0.4, 2), rand(0.15, 0.7), rand(0.4, 1.6));
      greeb.setMatrixAt(i, gm.compose(gp, gq, gs));
      greeb.setColorAt(i, _c.setScalar(rand(0.55, 1.15)));
    }
    g.add(greeb);
    const W2 = 220, win = new InstancedMesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: new Color(1.6, 1.45, 1.15) }), W2);
    for (let i = 0; i < W2; i++) {
      const row = i % 3, a = i / W2 * Math.PI * 2 * 3 + row * 0.01, r = [13.4, 10.2, 6.5][row], y = surfY(r, true) + 0.04;
      gp.set(Math.cos(a) * r, y, Math.sin(a) * r);
      gq.setFromAxisAngle(up, -a);
      gs.set(0.12, 0.08, Math.random() < 0.25 ? 1e-3 : 0.32);
      win.setMatrixAt(i, gm.compose(gp, gq, gs));
    }
    g.add(win);
    const coreMat = () => new MeshBasicMaterial({ color: new Color(0.6, 2.4, 3.6) });
    for (let i = 0; i < 4; i++) {
      const a = (i + 0.5) / 4 * Math.PI * 2, c = new Group();
      const orb = new Mesh(new SphereGeometry(1.6, 28, 20), coreMat());
      c.add(orb);
      const cage = new Mesh(new TorusGeometry(2, 0.25, 10, 40), hullMat);
      c.add(cage);
      const halo = new Sprite(new SpriteMaterial({ map: glowTex, color: 6344959, transparent: true, depthWrite: false, blending: AdditiveBlending }));
      halo.scale.setScalar(8);
      c.add(halo);
      c.position.set(Math.cos(a) * 9.5, 0.6, Math.sin(a) * 9.5);
      c.scale.setScalar(1.5);
      g.add(c);
      boss.cores.push({ c, orb, alive: true, hp: 10, kind: "core", id: nextId++ });
    }
    const eye = new Group();
    const iris = new Mesh(new SphereGeometry(2.6, 32, 24), new MeshBasicMaterial({ color: new Color(0.4, 2.8, 3.2) }));
    eye.add(iris);
    const lid = new Mesh(new SphereGeometry(2.9, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2), hullMat);
    eye.add(lid);
    boss.lid = lid;
    boss.iris = iris;
    eye.position.set(0, -2.6, 6);
    g.add(eye);
    boss.eye = { c: eye, alive: false, hp: 30, kind: "eye", id: nextId++ };
  }
  let bossBeam = null;
  {
    const m = new Mesh(new CylinderGeometry(1, 1, 1, 24, 1, true), beamMat.clone());
    m.material.uniforms.uCol.value = new Color(0.6, 1.8, 3.2);
    m.visible = false;
    scene.add(m);
    bossBeam = { m, t: 0, type: "low", phase: "off" };
  }
  const WAVES = [
    // 10/21 (Matt: too easy): rocks come faster and more at once, and from wave 2 some arrive as VOLLEYS (2 or 3 together on
    // opposite sides of the screen, so both guns have to work). The wave ramps inside itself too (ramp: speed added by its end).
    { at: 0, name: "TARGET PRACTICE", tip: "Point a hand at a blue rock to shoot", icon: "point", tMax: 3, tEvery: 1.15, tV: 40, ramp: 6, big: 0.12, volley: 0, met: 0, metV: 0, drones: 0, dCap: 0 },
    { at: 20, name: "RED METEORS", tip: "Red rocks: step or lean out of the way", icon: "lean", tMax: 3, tEvery: 1.35, tV: 44, ramp: 6, big: 0.25, volley: 0.3, met: [5, 6.2], metV: 36, drones: 0, dCap: 1, lesson: true },
    { at: 43, name: "ALIEN DRONES", tip: "Shoot the drones before they turn red", icon: "point", tMax: 4, tEvery: 1.5, tV: 48, ramp: 6, big: 0.25, volley: 0.4, met: [8, 10], metV: 38, drones: [7, 9], dCap: 2 },
    { at: 65, name: "THE MOTHERSHIP", tip: "Mothership! Shoot its 4 blue cores", icon: "point", tMax: 3, tEvery: 2.6, tV: 46, ramp: 0, big: 0.2, volley: 0.3, met: 0, metV: 38, drones: 0, dCap: 2, boss: true }
  ];
  const CALM = 3.4, PRE = 3.5;
  G.waveDef = WAVES[0];
  function worldV() {
    return (G.hardcore ? 46 : 36) * (G.boss ? 0.6 : 1);
  }
  function startWave(i) {
    const w = WAVES[i];
    G.wave = i + 1;
    G.waveDef = w;
    G.waveAt = G.gt;
    showTip(w.tip, i === 1 || i === 3);
    if (w.boss) {
      sfx.boss();
      spawnBoss();
    } else sfx.warn();
    G.nextT = G.gt + CALM;
    G.nextM = G.gt + CALM + (w.drones ? 5 : 0);
    G.nextD = G.gt + CALM;
    G.lessonDone = !w.lesson;
  }
  function spawnBoss() {
    boss.alive = true;
    boss.g.visible = true;
    boss.p.set(0, 7, -420);
    boss.t = 0;
    boss.dying = 0;
    boss.attackT = 2.5;
    boss.beamT = 8;
    G.boss = true;
    boss.final = false;
    const hp = Math.round((G.hardcore ? 16 : 12) * (1 - 0.4 * G.struggle));
    for (const c of boss.cores) {
      c.alive = true;
      c.hp = hp;
      c.c.visible = true;
    }
    boss.eye.alive = false;
    boss.eye.hp = Math.round((G.hardcore ? 40 : 30) * (1 - 0.4 * G.struggle));
    boss.eye.max = boss.eye.hp;
    boss.coreMax = hp * 4;
  }
  const popups = [];
  function screenOf(p) {
    _v2.copy(p).project(camera);
    return { x: (_v2.x + 1) / 2 * W, y: (1 - _v2.y) / 2 * H, front: _v2.z < 1 };
  }
  function score(p, base, label, big) {
    if (G.state !== "play") return 0;
    G.combo++;
    G.bestCombo = Math.max(G.bestCombo, G.combo);
    G.comboT = G.hardcore ? 2.2 : 3.2;
    const nm = Math.min(5, 1 + Math.floor(G.combo / 5));
    if (nm > G.mult) {
      sfx.combo(nm * 2);
      G.multPulse = 1;
    }
    G.mult = nm;
    const pts = Math.round(base * G.mult * (G._cross ? 1.5 : 1) / 10) * 10;
    if (G._cross) label = "CROSSFIRE!";
    G.score += pts;
    G.kills++;
    G.scorePulse = 1;
    G.struggle = Math.max(0, G.struggle - 0.03);
    const s = p ? screenOf(p) : { x: W / 2, y: H / 2, front: true };
    if (s.front) popups.length = 0, popups.push({ x: clamp(s.x, W * 0.1, W * 0.9), y: clamp(s.y, H * 0.2, H * 0.8), t: 0, text: "+".concat(pts), sub: label || (G.mult > 1 ? "x".concat(G.mult) : ""), big });
    return pts;
  }
  function takeHit(dmg, label, side) {
    if (G.state !== "play" || G.invuln > 0) return;
    const before = G.shield;
    G.shield = Math.max(0, G.shield - dmg * (G.hardcore ? 1.5 : 1));
    G.damage++;
    G.chunk = { from: before, to: G.shield, t: 0 };
    G.combo = 0;
    G.mult = 1;
    G.dodgeRun = 0;
    G.struggle = Math.min(1, G.struggle + 0.2);
    G.hitFlash = 1;
    G.hitLabel = label;
    G.invuln = 0.8;
    G.lastHitAt = G.gt;
    makeCracks(side || pick([-1, 1]));
    sfx.crack();
    shake(0.9);
    flash(16722474, 0.18);
    if (G.shield <= 0) {
      if (G.hardcore) {
        G.shipDown = true;
        G.endAt = performance.now() + 1800;
        showTip("Ship down", true);
        explode(camera.position.clone().add(_v.set(0, 0, -6)), 2, "hull");
      } else {
        G.invuln = 3;
        G.shield = 60;
        G.chunk = { from: 100, to: 60, t: 0 };
        G.score = Math.max(0, G.score - 500);
        showTip("Shield down  -500", true);
      }
    }
  }
  let cracks = [];
  function makeCracks(side) {
    cracks = [];
    const ox = side < 0 ? 0 : W, oy = H * rand(0.3, 0.7);
    for (let k = 0; k < 7; k++) {
      const pts = [[ox, oy + rand(-H * 0.2, H * 0.2)]];
      let a = (side < 0 ? 0 : Math.PI) + rand(-0.9, 0.9);
      for (let s = 0; s < 6; s++) {
        a += rand(-0.5, 0.5);
        const L = S * rand(0.04, 0.09);
        const p = pts[pts.length - 1];
        pts.push([p[0] + Math.cos(a) * L, p[1] + Math.sin(a) * L]);
      }
      cracks.push(pts);
    }
  }
  function dodged(o) {
    const side = o.cross.x - G.ship.x >= 0 ? 1 : -1;
    G.dodges++;
    G.dodgeRun = Math.min(4, (G.dodgeRun || 0) + 1);
    G.dodgeFx = { t: 0, side, n: G.dodgeRun };
    sfx.dodge(side);
    if (G.state === "play") {
      const pts = 100 * G.dodgeRun;
      G.score += pts;
      G.dodgeFx.pts = pts;
    }
  }
  const RETS = { right: { side: "right", x: 0.5, y: 0.5, sx: 0, sy: 0, a: 0, lock: null, lt: 0, cool: 0, pulse: 0, init: false, flash: 0 }, left: { side: "left", x: 0.5, y: 0.5, sx: 0, sy: 0, a: 0, lock: null, lt: 0, cool: 0, pulse: 0, init: false, flash: 0 } };
  const COLS = HAND_COL;
  G.guns = { left: { live: false, x: 0, y: 0, shots: 0, hits: 0, kills: 0 }, right: { live: false, x: 0, y: 0, shots: 0, hits: 0, kills: 0 } };
  BP.pointerFor = (side) => {
    const g = G.guns[side], r = RETS[side];
    return G.state === "play" && g.live && r && r.a > 0.2 ? { x: g.x, y: g.y } : null;
  };
  const tmpCam = new Vector3();
  function allTargets() {
    const out = [];
    for (const r of rocks) if (r.alive && r.p.z < -6) out.push({ o: r, p: r.p, rad: r.s * 1.05 });
    for (const d of drones) if (d.alive && d.p.z < -6) out.push({ o: d, p: d.p, rad: 3.6 });
    for (const c of capsules) if (c.alive && c.p.z < -6) out.push({ o: c, p: c.p, rad: 1.8 });
    if (boss.alive && !boss.dying) {
      for (const c of boss.cores) if (c.alive) {
        c.wp = c.c.getWorldPosition(c.wp || new Vector3());
        out.push({ o: c, p: c.wp, rad: 2.6 });
      }
      if (boss.eye.alive) {
        boss.eye.wp = boss.eye.c.getWorldPosition(boss.eye.wp || new Vector3());
        out.push({ o: boss.eye, p: boss.eye.wp, rad: 3 });
      }
    }
    return out;
  }
  function projectTargets() {
    const list = [];
    camera.updateMatrixWorld();
    const f = camera.projectionMatrix.elements[5];
    for (const t of allTargets()) {
      tmpCam.copy(t.p).applyMatrix4(camera.matrixWorldInverse);
      const depth = -tmpCam.z;
      if (depth < 2) continue;
      _v2.copy(t.p).project(camera);
      if (Math.abs(_v2.x) > 1.02 || Math.abs(_v2.y) > 1.02) continue;
      list.push({ t: t.o, x: (_v2.x + 1) / 2 * W, y: (1 - _v2.y) / 2 * H, r: t.rad * f / depth * H / 2, depth });
    }
    G.targets = list.map((o) => ({ x: o.x / W, y: o.y / H, r: o.r / W, kind: o.t.kind, id: o.t.id, depth: Math.round(o.depth) }));
    return list;
  }
  function hitRadius(o) {
    return Math.max(o.r * 1.35, W * ((G.hardcore ? 0.036 : 0.048) + 0.02 * G.struggle));
  }
  function under(r, list) {
    let best = null, bd = 1e9;
    for (const o of list) {
      const d = Math.hypot(r.x - o.x, (r.y - o.y) / 1.3), hr = hitRadius(o);
      if (d < hr && d / hr < bd) {
        bd = d / hr;
        best = o;
      }
    }
    return best;
  }
  const POINT_GAIN = 1.7;
  function pointAt(side) {
    const h = BP.hands[side];
    if (BP.mouse || BP.simulating || !BP.live || BP.handMode === "box" || !BP.mirrorPt) return { x: h.x, y: h.y, up: true };
    const sh = BP.mirrorPt(side === "left" ? "lShoulder" : "rShoulder");
    if (!sh) return { x: h.x, y: h.y, up: h.raised !== false };
    const up = h.raised !== false || h.y < sh[1] + 0.22;
    return reCentre(side, sh[0] + (h.x - sh[0]) * POINT_GAIN, sh[1] + (h.y - sh[1]) * POINT_GAIN, up);
  }
  const AIM_BOX = { x0: 0.05, x1: 0.95, y0: 0.2, y1: 0.93 }, AIM_HOME = { left: [0.4, 0.47], right: [0.6, 0.47] };
  const AIM_CORNER = { x1: 0.14, y0: 0.03 };
  const aimRest = { left: null, right: null };
  let aimDt = 1 / 60;
  function reCentre(side, rx, ry, up) {
    if (!Number.isFinite(rx) || !Number.isFinite(ry)) {
      const g = G.guns[side];
      return { x: g.x || AIM_HOME[side][0], y: g.y || AIM_HOME[side][1], up: false };
    }
    let c = aimRest[side];
    if (!c) c = aimRest[side] = [rx - AIM_HOME[side][0], ry - AIM_HOME[side][1]];
    else if (up && !(G.guns[side].x < AIM_CORNER.x1 && G.guns[side].y < AIM_BOX.y0)) {
      const k = 1 - Math.exp(-aimDt / 4);
      c[0] += (rx - AIM_HOME[side][0] - c[0]) * k;
      c[1] += (ry - AIM_HOME[side][1] - c[1]) * k;
    }
    let x = rx - c[0], y = ry - c[1];
    if (x < AIM_BOX.x0) {
      c[0] -= AIM_BOX.x0 - x;
      x = AIM_BOX.x0;
    } else if (x > AIM_BOX.x1) {
      c[0] += x - AIM_BOX.x1;
      x = AIM_BOX.x1;
    }
    const y0 = x < AIM_CORNER.x1 ? AIM_CORNER.y0 : AIM_BOX.y0;
    if (y < y0) {
      c[1] -= y0 - y;
      y = y0;
    } else if (y > AIM_BOX.y1) {
      c[1] += y - AIM_BOX.y1;
      y = AIM_BOX.y1;
    }
    return { x, y, up };
  }
  const REFIRE = 0.24;
  function updateAim(dt, list) {
    aimDt = dt;
    const assist = (G.hardcore ? 0.25 : 0.4) + 0.3 * G.struggle;
    G.noAim = G.state === "play" && list.length && BP.live && !BP.mouse && !BP.simulating && !RETS.left.active && !RETS.right.active ? (G.noAim || 0) + dt : 0;
    for (const side of ["right", "left"]) {
      const r = RETS[side], h = BP.hands[side];
      const pt = pointAt(side);
      const active = h.seen && pt.up && (BP.mouse ? side === "right" : true) && G.state === "play" && !G.killcam;
      r.a = lerp(r.a, active ? 1 : 0, 1 - Math.exp(-dt * 10));
      r.active = active;
      const hx = pt.x * W, hy = pt.y * H;
      if (!r.init) {
        r.sx = hx;
        r.sy = hy;
        r.init = true;
      }
      const k = BP.mouse ? 1 - Math.exp(-dt * 40) : 1 - Math.exp(-dt * 15);
      r.sx += (hx - r.sx) * k;
      r.sy += (hy - r.sy) * k;
      if (!Number.isFinite(r.sx + r.sy)) {
        r.sx = W / 2;
        r.sy = H / 2;
      }
      let near = null, nd = S * 0.16;
      for (const o of list) {
        const d = Math.hypot(o.x - r.sx, (o.y - r.sy) / 1.2) * (r.lock && r.lock.t === o.t ? 0.75 : 1);
        if (d < nd) {
          nd = d;
          near = o;
        }
      }
      r.x = r.sx;
      r.y = r.sy;
      if (near) {
        const pull = assist * Math.pow(1 - nd / (S * 0.16), 0.6);
        r.x += (near.x - r.sx) * pull;
        r.y += (near.y - r.sy) * pull;
      }
      r.cool = Math.max(0, r.cool - dt);
      r.pulse = Math.max(0, r.pulse - dt * 4);
      r.flash = Math.max(0, r.flash - dt * 7);
      const gs = G.guns[side];
      gs.live = active;
      gs.x = +(r.x / W).toFixed(3);
      gs.y = +(r.y / H).toFixed(3);
      const u = active ? under(r, list) : null;
      if (!active) {
        r.lock = null;
        r.lt = 0;
        r.lockFrac = 0;
        continue;
      }
      if (u && r.lock && r.lock.t === u.t) r.lt += dt;
      else {
        if (u) r.cool = 0;
        r.lock = u;
        r.lt = 0;
      }
      r.lockFrac = u ? 1 : 0;
      if (u && r.cool <= 0) {
        shoot(side, u);
        r.cool = REFIRE;
      }
    }
  }
  const bolts = Array.from({ length: 30 }, () => {
    const g = new Group();
    const outer = new Mesh(new CylinderGeometry(0.22, 0.22, 1, 14, 1, true), beamMat.clone());
    outer.material.uniforms.uCol.value = new Color(0.3, 1.4, 3);
    g.add(outer);
    const core = new Mesh(new CylinderGeometry(0.06, 0.06, 1, 8), new MeshBasicMaterial({ color: new Color(3, 3, 3.5) }));
    g.add(core);
    g.visible = false;
    scene.add(g);
    return { g, outer, alive: false };
  });
  function shoot(side, o, charged = false) {
    if (G.state !== "play") return;
    const c = cannons[side];
    if (!c) return;
    c.recoil = 1;
    RETS[side].flash = 1;
    G.guns[side].shots++;
    const from = c.tip.getWorldPosition(new Vector3());
    const b = bolts.find((b2) => !b2.alive);
    if (!b) return;
    G.shots++;
    b.alive = true;
    b.g.visible = true;
    b.from = from.clone();
    b.target = o ? o.t : null;
    b.t = 0;
    b.charged = charged;
    b.toPt = o ? (o.t.wp || o.t.p).clone() : new Vector3(RETS[side].x / W * 2 - 1, -(RETS[side].y / H) * 2 + 1, 0.5).unproject(camera).sub(camera.position).normalize().multiplyScalar(200).add(camera.position);
    b.dur = clamp(from.distanceTo(b.toPt) / 420, 0.05, 0.3);
    b.side = side;
    b.g.scale.x = b.g.scale.z = charged ? 2 : 1;
    b.outer.material.uniforms.uCol.value.set(charged ? 16760896 : HAND_COL[side]).multiplyScalar(1.6);
    if (charged) sfx.charged();
    else sfx.laser(side === "right" ? 1 : 0.85);
    lightFlash(from.clone().add(_v.set(0, 0, -2)), charged ? 16760928 : HAND_COL[side], charged ? 20 : 8, 0.1);
  }
  function updateBolts(dt) {
    for (const b of bolts) {
      if (!b.alive) continue;
      b.t += dt;
      if (b.target && b.target.alive !== false) b.toPt.copy(b.target.wp || b.target.p);
      const k = Math.min(1, b.t / b.dur);
      const head = _v.lerpVectors(b.from, b.toPt, k), tail = _v2.lerpVectors(b.from, b.toPt, Math.max(0, k - 0.35));
      const d = _v3.subVectors(head, tail), len = Math.max(0.1, d.length());
      b.g.position.copy(tail).addScaledVector(d, 0.5);
      b.g.quaternion.setFromUnitVectors(_s.set(0, 1, 0), d.normalize());
      b.g.scale.y = len;
      if (k >= 1) {
        b.alive = false;
        b.g.visible = false;
        if (b.target) {
          const t = b.target, was = t.alive !== false, gs = G.guns[b.side];
          G.hits++;
          gs.hits++;
          (t.hitBy || (t.hitBy = {}))[b.side] = G.gt;
          const other = b.side === "left" ? "right" : "left", cross = t.hitBy[other] !== void 0 && G.gt - t.hitBy[other] < 1;
          G._cross = cross;
          damage(t, b.charged ? 3 : 1);
          G._cross = false;
          if (was && t.alive === false) {
            gs.kills++;
            if (cross) G.crossfires = (G.crossfires || 0) + 1;
          }
        }
        if (b.charged) chargedBlast(b.toPt.clone(), b.target);
      }
    }
  }
  function chargedBlast(p, main) {
    G.charged = (G.charged || 0) + 1;
    shockwave(p, 26, 16760928, 0.7);
    lightFlash(p, 16760928, 60, 0.4);
    shake(0.4);
    const sp = screenOf(p);
    let n = 0;
    for (const o of lastList) if (o.t !== main && Math.hypot(o.x - sp.x, o.y - sp.y) < S * 0.22) {
      damage(o.t, 2);
      n++;
    }
    popups.length = 0;
    popups.push({ x: clamp(sp.x, W * 0.15, W * 0.85), y: clamp(sp.y - S * 0.06, H * 0.2, H * 0.8), t: 0, text: n ? "CHARGED BLAST x".concat(n + 1, "!") : "CHARGED BLAST!", sub: "", big: true, gold: true });
  }
  function damage(o, n) {
    if (o.kind === "rock") {
      if (!o.alive) return;
      o.hp -= n;
      sfx.hitm();
      for (let i = 0; i < 12; i++) fire.emit(o.p.x, o.p.y, o.p.z + o.s, rand(-4, 4), rand(-4, 4), rand(0, 6), 0.3, 0.3, 0.05, 1, 2.4, 3.2, 1, 3);
      if (o.hp <= 0) {
        o.alive = false;
        rockMesh.setMatrixAt(o.i, _m.makeScale(0, 0, 0));
        explode(o.p, o.big ? 2.2 : 1.2, "rock");
        sfx.boom(o.big ? 1 : 0.5);
        score(o.p, o.big ? 250 : 100, o.big ? "BIG ONE!" : null, o.big);
        if (o.big) for (let i = 0; i < 2; i++) spawnRock(false, o.p.clone().add(_v.set(i ? 2 : -2, rand(-1, 1), 0)), _v2.set(i ? 6 : -6, rand(-2, 2), -4));
      }
    } else if (o.kind === "drone") {
      if (!o.alive) return;
      o.hp -= n;
      o.flash = 1;
      sfx.hitm();
      if (o.hp <= 0) {
        o.alive = false;
        o.g.visible = false;
        explode(o.p, 1.8, "hull");
        sfx.boom(0.8);
        score(o.p, o.charging > 0 ? 450 : 300, o.charging > 0 ? "STOPPED IT!" : "DRONE DOWN", true);
      }
    } else if (o.kind === "power") {
      if (!o.alive) return;
      o.alive = false;
      o.g.visible = false;
      sfx.power();
      lightFlash(o.p, 4063114, 30, 0.4);
      shockwave(o.p, 12, 4063114, 0.6);
      const add = Math.min(35, 100 - G.shield);
      G.shield = Math.min(100, G.shield + 35);
      G.repairFx = 1;
      G.repairs = (G.repairs || 0) + 1;
      const s = screenOf(o.p);
      popups.length = 0;
      popups.push({ x: clamp(s.x, W * 0.15, W * 0.85), y: clamp(s.y, H * 0.2, H * 0.8), t: 0, text: "SHIELD +".concat(Math.round(add)), sub: "", big: true, green: true });
    } else if (o.kind === "core") {
      if (!o.alive) return;
      o.hp -= n;
      sfx.hitm();
      o.orb.material.color.setRGB(4, 4, 4);
      setTimeout(() => o.orb.material.color.setRGB(0.6, 2.4, 3.6), 60);
      const wp = o.wp;
      for (let i = 0; i < 10; i++) fire.emit(wp.x, wp.y, wp.z + 1.5, rand(-5, 5), rand(-5, 5), rand(0, 8), 0.3, 0.6, 0.1, 1, 2.4, 3.2, 1, 3);
      if (o.hp <= 0) {
        o.alive = false;
        o.c.visible = false;
        explode(wp, 3, "hull");
        sfx.boom(1.2);
        score(wp, 800, "CORE DOWN!", true);
        slowmo(0.35, 0.5);
        if (boss.cores.every((c) => !c.alive)) {
          boss.eye.alive = true;
          showTip("The eye is open: shoot it!", true);
        }
      }
    } else if (o.kind === "eye") {
      if (!o.alive) return;
      o.hp -= n;
      sfx.hitm();
      boss.iris.material.color.setRGB(4, 4, 4);
      setTimeout(() => boss.iris.material.color.setRGB(0.4, 2.8, 3.2), 60);
      if (o.hp <= 0) killBoss();
    }
  }
  let slowT = 0, slowDur = 0, slowAmt = 1;
  function slowmo(amt, dur) {
    slowAmt = amt;
    slowT = slowDur = dur;
  }
  function killBoss() {
    boss.eye.alive = false;
    boss.dying = 1e-3;
    G.bossKilled = true;
    G.killcam = { t: 0, start: camera.position.clone() };
    slowmo(0.15, 3.6);
    sfx.boom(2);
    sfx.boom(1.5);
    for (const d of liveDangers()) {
      d.alive = false;
      d.done = true;
      if (d.m) d.m.visible = false;
      if (d.halo) d.halo.visible = false;
    }
    const bonus = 5e3 + Math.round(G.timeLeft) * 50;
    G.score += bonus * (G.hardcore ? 2 : 1);
    showTip("Mothership destroyed!  +".concat(bonus * (G.hardcore ? 2 : 1)));
  }
  function txt(s, x, y, size, col = "#fff", align = "center", weight = 800, glow, maxW = W * 0.92) {
    ctx.font = "".concat(weight, " ").concat(size, 'px system-ui, -apple-system, "Segoe UI", sans-serif');
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    let tw = ctx.measureText(s).width;
    if (tw > maxW) {
      size *= maxW / tw;
      tw = maxW;
      ctx.font = "".concat(weight, " ").concat(size, 'px system-ui, -apple-system, "Segoe UI", sans-serif');
    }
    if (glow) {
      ctx.shadowColor = glow;
      ctx.shadowBlur = size * 0.5;
    }
    ctx.fillStyle = col;
    ctx.fillText(s, x, y);
    ctx.shadowBlur = 0;
    const T = ctx.getTransform(), d = Math.min(devicePixelRatio || 1, 2), x0 = align === "center" ? x - tw / 2 : align === "right" ? x - tw : x;
    if (ctx.globalAlpha > 0.1) UI.push({ kind: "text", text: String(s).slice(0, 40), own: UI_OWN, x: T.e / d + x0 * T.a / d, y: T.f / d + (y - size * 0.5) * T.d / d, w: tw * T.a / d, h: size * T.d / d });
  }
  let UI = [], UI_OWN = null;
  function pill(x, y, w, h, a = 0.55, id = "pill") {
    ctx.fillStyle = "rgba(4,10,24,".concat(a, ")");
    ctx.strokeStyle = "rgba(120,210,255,0.35)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, Math.min(h / 2, S * 0.05));
    ctx.fill();
    ctx.stroke();
    UI.push({ kind: "box", id, x, y, w, h });
    UI_OWN = id;
  }
  let buttons = [], clickAt = null, keyPress = false;
  const keys = {};
  addEventListener("pointerdown", (e) => {
    audioInit();
    const row = BP.uiRow();
    if (G.state === "play" && !(e.clientX < row.right && e.clientY < row.bottom)) {
      const r = RETS.right;
      r.x = e.clientX;
      r.y = e.clientY;
      fireNow("right");
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
    if ((e.key === "c" || e.key === "C") && G.state === "title") pickMode();
  });
  addEventListener("keyup", (e) => {
    keys[e.key] = false;
  });
  function goHome() {
    location.href = "index.html" + (Q.has("demo") ? "?demo=1" : "");
  }
  function toggleHardcore() {
    G.hardcore = !G.hardcore;
    localStorage.blaster_hc = G.hardcore ? "1" : "0";
    sfx.press();
  }
  function setHard(on) {
    G.hardcore = on;
    localStorage.blaster_hc = on ? "1" : "0";
  }
  function pickMode() {
    BP.pick({
      title: "Pick a mode",
      value: G.hardcore ? "hard" : "normal",
      onCancel: () => {
      },
      options: [{ id: "normal", label: "NORMAL", sub: "for everyone" }, { id: "hard", label: "HARD", sub: "faster rocks, one ship" }],
      onPick: (v) => setHard(v === "hard")
    });
  }
  function button(id, label, x, y, w, h, now, primary, action, style, ms = 650) {
    const r = { x, y, w, h }, over = BP.handOver(r, W, H), k = BP.dwell(id, over, now, ms);
    buttons.push({ r, action, primary, id });
    UI.push({ kind: "box", id, x, y, w, h });
    UI_OWN = id;
    ctx.save();
    const rad = h / 2;
    ctx.shadowColor = style === "hc" ? "rgba(255,60,60,0.8)" : primary ? "rgba(80,200,255,0.75)" : "rgba(255,255,255,0.25)";
    ctx.shadowBlur = over ? S * 0.05 : S * 0.02;
    const g = ctx.createLinearGradient(x, 0, x + w, 0);
    if (style === "hc") {
      g.addColorStop(0, G.hardcore ? "#ff3b3b" : "rgba(40,10,14,0.85)");
      g.addColorStop(1, G.hardcore ? "#a00d2a" : "rgba(20,6,10,0.85)");
    } else if (primary) {
      g.addColorStop(0, "#2b6cff");
      g.addColorStop(1, "#13c4ff");
    } else {
      g.addColorStop(0, "rgba(255,255,255,0.12)");
      g.addColorStop(1, "rgba(255,255,255,0.06)");
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
      ctx.fillStyle = "rgba(255,255,255,0.32)";
      ctx.fillRect(x, y, w * k, h);
      ctx.restore();
    }
    ctx.lineWidth = Math.max(2, S * 4e-3);
    ctx.strokeStyle = over ? "#fff" : "rgba(255,255,255,0.45)";
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, rad);
    ctx.stroke();
    txt(label, x + w / 2, y + h / 2 + h * 0.02, h * 0.4, "#fff", "center", 900);
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
  function hexA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return "rgba(".concat(n >> 16, ",").concat(n >> 8 & 255, ",").concat(n & 255, ",").concat(clamp(a, 0, 1), ")");
  }
  function drawReticle(r) {
    if (r.a < 0.03) return;
    const col = COLS[r.side], on = !!r.lock && r.lockFrac > 0, rad = S * 0.034 * (1 + r.flash * 0.15);
    ctx.save();
    ctx.globalAlpha = r.a;
    ctx.translate(r.x, r.y);
    if (on) {
      ctx.fillStyle = hexA(col, 0.28);
      ctx.beginPath();
      ctx.arc(0, 0, rad, 0, 7);
      ctx.fill();
    }
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = S * 0.01;
    ctx.strokeStyle = col;
    ctx.lineWidth = Math.max(3, S * 75e-4);
    ctx.beginPath();
    ctx.arc(0, 0, rad, 0, 7);
    ctx.stroke();
    ctx.fillStyle = on ? "#ffffff" : col;
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(2.5, S * 55e-4), 0, 7);
    ctx.fill();
    ctx.restore();
  }
  const LANE_X = 6.5;
  function laneGeom() {
    const m = Math.max(6, S * 0.012), tipH = Math.max(30, S * 0.058), barH = Math.max(6, S * 0.011), figH = clamp(S * 0.15, 64, 130);
    const half = Math.min(W * 0.3, S * 0.55), barY = H - m - tipH - Math.max(8, S * 0.018) - barH;
    return { m, tipH, tipY: H - m - tipH, barH, barY, figH, half, cx: W / 2 };
  }
  const laneX = (L, wx) => L.cx + clamp(wx / LANE_X, -1.12, 1.12) * L.half;
  function readDangers() {
    G.dangers = [];
    let worst = null;
    for (const d of liveDangers()) {
      const tta = d.arriveAt - G.gt;
      if (tta > 4.5) continue;
      const onYou = Math.hypot(d.cross.x - G.ship.x, d.cross.y - G.ship.y) < d.r + SHIP_R;
      G.dangers.push({ kind: d.kind, tta: +tta.toFixed(2), onYou, locked: !!d.locked, x: +(d.cross.x / LANE_X).toFixed(2) });
      if (onYou && d.locked && (!worst || tta < worst.tta)) worst = { tta, d };
    }
    if (boss.beamOn && bossBeam.t < bossBeam.charge) {
      const side = bossBeam.type === "left" ? -1 : 1, safe = side < 0 ? G.ship.x > 1.2 : G.ship.x < -1.2, tta = bossBeam.charge - bossBeam.t;
      G.dangers.push({ kind: "beam", tta: +tta.toFixed(2), onYou: !safe });
      if (!safe && (!worst || tta < worst.tta)) worst = { tta, beam: side };
    }
    G.leanHint = 0;
    if (worst && worst.tta < 3.2) {
      if (worst.beam) G.leanHint = -worst.beam;
      else {
        const d = worst.d, need = d.r + SHIP_R + 0.5, goR = d.cross.x + need, goL = d.cross.x - need, canR = goR <= LANE_X - 0.2, canL = goL >= -LANE_X + 0.2;
        G.leanHint = canR && canL ? Math.abs(goR - G.ship.x) <= Math.abs(goL - G.ship.x) ? 1 : -1 : canR ? 1 : -1;
      }
    }
    return worst;
  }
  function drawEdgeArrows(now) {
    for (const d of liveDangers()) {
      const tta = d.arriveAt - G.gt;
      if (tta > 4.5) continue;
      const sp = screenOf(d.p), mx = W * 0.05, my = H * 0.07;
      if (sp.front && sp.x > mx && sp.x < W - mx && sp.y > my && sp.y < H - my) continue;
      let dx = sp.x - W / 2, dy = sp.y - H / 2;
      if (!sp.front) {
        dx = -dx;
        dy = -dy;
      }
      const k = Math.min((W / 2 - mx) / Math.max(1e-3, Math.abs(dx)), (H / 2 - my) / Math.max(1e-3, Math.abs(dy))), ax = W / 2 + dx * k, ay = H / 2 + dy * k, a = Math.atan2(dy, dx);
      const sz = S * 0.04 * (1 + 0.15 * Math.sin(now / 80));
      ctx.save();
      ctx.translate(ax, ay);
      ctx.rotate(a);
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = "#ff3b2a";
      ctx.shadowColor = "#ff2010";
      ctx.shadowBlur = S * 0.025;
      ctx.beginPath();
      ctx.moveTo(sz, 0);
      ctx.lineTo(-sz * 0.6, -sz * 0.75);
      ctx.lineTo(-sz * 0.25, 0);
      ctx.lineTo(-sz * 0.6, sz * 0.75);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    if (boss.beamOn && bossBeam.t < bossBeam.charge) {
      const side = bossBeam.type === "left" ? -1 : 1, k = clamp(bossBeam.t / bossBeam.charge, 0, 1);
      const gr = ctx.createLinearGradient(side < 0 ? 0 : W, 0, W / 2, 0);
      gr.addColorStop(0, "rgba(255,30,30,".concat(0.15 + 0.25 * k, ")"));
      gr.addColorStop(1, "rgba(255,30,30,0)");
      ctx.fillStyle = gr;
      ctx.fillRect(side < 0 ? 0 : W / 2, 0, W / 2, H);
    }
  }
  function drawYou(x, gy, h, danger, now) {
    const I = BP.img, fresh = !BP.simulating && I && I.lShoulder && I.rShoulder && I.lHip && I.rHip && performance.now() - (BP.imgAt || 0) < 700;
    const torso = h * 0.3, hipY = gy - h * 0.46, P = {};
    const box = (p) => p && [clamp(p[0], x - h * 0.62, x + h * 0.62), clamp(p[1], gy - h * 1.2, gy)];
    if (fresh) {
      const hc = [(I.lHip[0] + I.rHip[0]) / 2, (I.lHip[1] + I.rHip[1]) / 2], sc = [(I.lShoulder[0] + I.rShoulder[0]) / 2, (I.lShoulder[1] + I.rShoulder[1]) / 2];
      const k = torso / Math.max(0.03, Math.hypot(sc[0] - hc[0], sc[1] - hc[1]));
      const at = (j) => I[j] ? box([x - (I[j][0] - hc[0]) * k, hipY + (I[j][1] - hc[1]) * k]) : null;
      for (const [n, j] of [["lS", "lShoulder"], ["rS", "rShoulder"], ["lE", "lForearm"], ["rE", "rForearm"], ["lH", "lHand"], ["rH", "rHand"], ["lP", "lHip"], ["rP", "rHip"], ["hd", "head"]]) P[n] = at(j);
    } else {
      const cy = hipY - torso;
      Object.assign(P, {
        lS: [x - torso * 0.42, cy],
        rS: [x + torso * 0.42, cy],
        lE: [x - torso * 0.8, cy - torso * 0.2],
        rE: [x + torso * 0.8, cy - torso * 0.2],
        lH: [x - torso * 1.1, cy - torso * 0.55],
        rH: [x + torso * 1.1, cy - torso * 0.55],
        lP: [x - torso * 0.25, hipY],
        rP: [x + torso * 0.25, hipY],
        hd: null
      });
    }
    const sM = [(P.lS[0] + P.rS[0]) / 2, (P.lS[1] + P.rS[1]) / 2], hM = [(P.lP[0] + P.rP[0]) / 2, (P.lP[1] + P.rP[1]) / 2];
    const up = [sM[0] - hM[0], sM[1] - hM[1]], ul = Math.hypot(up[0], up[1]) || 1;
    const head = [sM[0] + up[0] / ul * torso * 0.5, sM[1] + up[1] / ul * torso * 0.5];
    const feet = [[x - torso * 0.38, gy], [x + torso * 0.38, gy]];
    const col = danger ? Math.sin(now / 90) > 0 ? "#ff5040" : "#ffffff" : "#c8f4ff";
    const lines = [[P.lS, P.rS], [P.lS, P.lE], [P.lE, P.lH], [P.rS, P.rE], [P.rE, P.rH], [sM, hM], [P.lP, P.rP], [P.lP, feet[0]], [P.rP, feet[1]]];
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const pass of [0, 1]) {
      ctx.strokeStyle = pass ? col : "rgba(0,0,0,0.75)";
      ctx.fillStyle = ctx.strokeStyle;
      ctx.lineWidth = torso * (pass ? 0.24 : 0.24) + (pass ? 0 : 5);
      if (pass) {
        ctx.shadowColor = danger ? "#ff2010" : "#3fc8ff";
        ctx.shadowBlur = S * 0.02;
      }
      ctx.beginPath();
      for (const [a, b] of lines) if (a && b) {
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
      }
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(head[0], head[1], torso * 0.3 + (pass ? 0 : 2.5), 0, 7);
      ctx.fill();
    }
    ctx.restore();
  }
  function drawLane(now, dt, worst) {
    const L = laneGeom(), y = L.barY, x0 = L.cx - L.half, x1 = L.cx + L.half;
    ctx.save();
    ctx.fillStyle = "rgba(6,10,22,0.6)";
    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x0 - L.barH, y, x1 - x0 + L.barH * 2, L.barH, L.barH / 2);
    ctx.fill();
    ctx.stroke();
    for (const d of liveDangers()) {
      const tta = d.arriveAt - G.gt;
      if (tta > 4.5) continue;
      const zr = d.r + SHIP_R, a0 = laneX(L, d.cross.x - zr), a1 = laneX(L, d.cross.x + zr), urg = clamp(1 - (tta - 0.3) / 2.6, 0, 1);
      ctx.globalAlpha = d.locked ? 0.55 + 0.45 * urg : 0.35;
      ctx.fillStyle = "#ff3b2a";
      ctx.shadowColor = "#ff2010";
      ctx.shadowBlur = S * 0.015;
      ctx.beginPath();
      ctx.roundRect(a0, y - L.barH * 0.5, Math.max(4, a1 - a0), L.barH * 2, L.barH);
      ctx.fill();
    }
    if (boss.beamOn && bossBeam.t < bossBeam.charge) {
      const side = bossBeam.type === "left" ? -1 : 1, k = clamp(bossBeam.t / bossBeam.charge, 0, 1);
      ctx.globalAlpha = 0.4 + 0.5 * k;
      ctx.fillStyle = "#ff3b2a";
      const a0 = side < 0 ? x0 : laneX(L, -1.2), a1 = side < 0 ? laneX(L, 1.2) : x1;
      ctx.beginPath();
      ctx.roundRect(a0, y - L.barH * 0.5, a1 - a0, L.barH * 2, L.barH);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    const yx = laneX(L, G.ship.x);
    if (G.dodgeFx) {
      const d = G.dodgeFx;
      d.t += dt;
      if (d.t > 0.7) G.dodgeFx = null;
      else {
        const g = ctx.createRadialGradient(yx, y, 0, yx, y, L.figH * 0.9);
        g.addColorStop(0, "rgba(120,230,255,".concat(0.55 * (1 - d.t / 0.7), ")"));
        g.addColorStop(1, "rgba(120,230,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(yx - L.figH, y - L.figH, L.figH * 2, L.figH * 2);
      }
    }
    drawYou(yx, y, L.figH, !!worst, now);
    if (worst && worst.tta < 3.2 && G.leanHint) {
      const dir = G.leanHint, cx = yx + dir * L.figH * 0.78, cy = y - L.figH * 0.55, s = L.figH * 0.26, a = clamp((3.2 - worst.tta) / 0.5, 0, 1);
      ctx.globalAlpha = a * (Math.sin(now / 110) > -0.3 ? 1 : 0.55);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      for (const pass of [0, 1]) {
        ctx.strokeStyle = pass ? "#ffffff" : "rgba(200,20,10,0.9)";
        ctx.lineWidth = s * (pass ? 0.34 : 0.6);
        ctx.beginPath();
        for (const o of [0, 0.75]) {
          ctx.moveTo(cx + dir * (o - 0.4) * s, cy - s * 0.7);
          ctx.lineTo(cx + dir * (o + 0.3) * s, cy);
          ctx.lineTo(cx + dir * (o - 0.4) * s, cy + s * 0.7);
        }
        ctx.stroke();
      }
    }
    ctx.restore();
    G.lane = { you: +(yx / W).toFixed(3), x0: +(x0 / W).toFixed(3), x1: +(x1 / W).toFixed(3), y: +(y / H).toFixed(3) };
    UI.push({ kind: "box", id: "lane", x: x0 - L.figH * 0.7, y: y - L.figH * 1.2, w: x1 - x0 + L.figH * 1.4, h: L.figH * 1.2 + L.barH * 1.5 });
    UI_OWN = null;
  }
  function domRect(id) {
    const e = document.getElementById(id);
    if (!e || !e.getClientRects().length) return null;
    const r = e.getBoundingClientRect();
    return r.width > 1 ? r : null;
  }
  function topSlot(pw) {
    const gp = Math.max(8, S * 0.015), m = Math.max(8, S * 0.016), P = domRect("bp-pause"), M = domRect("bp-music");
    const lo = P ? P.right + gp : m, hi = M ? M.left - gp : W - m;
    let x = clamp(W / 2 - pw / 2, lo, hi - pw), y = m;
    if (x < lo - 0.5 || x + pw > hi + 0.5) {
      x = W / 2 - pw / 2;
      y = Math.max(P ? P.bottom : 0, M ? M.bottom : 0, m) + gp;
    }
    return { x, y };
  }
  function drawHUD(now, dt) {
    if (G.noAim > 2.5 && now - (G._noAimTip || -1e9) > 9e3) {
      G._noAimTip = now;
      showTip("Raise a hand and point it at a blue rock");
    }
    const ph = clamp(S * 0.095, 40, 90), boss1 = boss.alive && !boss.dying;
    const tl = Math.max(0, Math.ceil(G.timeLeft)), tStr = "".concat(Math.floor(tl / 60), ":").concat(String(tl % 60).padStart(2, "0"));
    ctx.font = "900 ".concat(ph * 0.56, 'px system-ui, -apple-system, "Segoe UI", sans-serif');
    const scw = Math.max(ctx.measureText("00000").width, ctx.measureText(String(G.score)).width);
    ctx.font = "800 ".concat(ph * 0.42, 'px system-ui, -apple-system, "Segoe UI", sans-serif');
    const tmw = ctx.measureText("0:00").width;
    const pw = tmw + scw + ph * 1.4, { x: px, y: py } = topSlot(pw);
    pill(px, py, pw, ph, 0.78, "top");
    const pulse = G.scorePulse = Math.max(0, (G.scorePulse || 0) - dt * 3), ty = py + ph * 0.45;
    txt(tStr, px + ph * 0.5 + tmw / 2, ty, ph * 0.42, G.timeLeft < 10 ? "#ff8a8a" : "#cfe8ff", "center", 800, null, tmw * 1.05);
    txt(String(G.score), px + pw - ph * 0.5 - scw / 2, ty, ph * 0.56, pulse > 0 ? "#e6fbff" : "#fff", "center", 900, pulse > 0 ? "#3fb8ff" : null, scw * 1.02);
    const bx0 = px + ph * 0.45, bw0 = pw - ph * 0.9, bh0 = Math.max(4, ph * 0.08), by0 = py + ph * 0.8;
    const hitK = G.hitFlash || 0, rep = G.repairFx = Math.max(0, (G.repairFx || 0) - dt * 1.5), low = G.shield < 35;
    if (G.chunk) {
      G.chunk.t += dt;
      if (G.chunk.t > 1.4) G.chunk = null;
    }
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    ctx.beginPath();
    ctx.roundRect(bx0, by0, bw0, bh0, bh0 / 2);
    ctx.fill();
    if (G.chunk) {
      const ghost = clamp(lerp(G.chunk.from, G.chunk.to, clamp((G.chunk.t - 0.5) / 0.9, 0, 1)) / 100, 0, 1);
      ctx.fillStyle = Math.sin(now / 60) > 0 ? "#ffffff" : "#ff3030";
      ctx.beginPath();
      ctx.roundRect(bx0, by0, bw0 * ghost, bh0, bh0 / 2);
      ctx.fill();
    }
    ctx.fillStyle = rep > 0 ? "#5dff9a" : low ? "#ff5a4a" : "#57d0ff";
    ctx.beginPath();
    ctx.roundRect(bx0, by0, Math.max(bh0, bw0 * clamp(G.shield / 100, 0, 1)), bh0, bh0 / 2);
    ctx.fill();
    if (boss1) {
      const tot = boss.cores.reduce((a, c) => a + Math.max(0, c.hp), 0) + (boss.eye.alive ? boss.eye.hp : boss.eye.max), max = boss.coreMax + boss.eye.max;
      G.bossHp = tot;
      const y2 = py + ph * 0.1;
      ctx.fillStyle = "rgba(255,255,255,0.14)";
      ctx.beginPath();
      ctx.roundRect(bx0, y2, bw0, bh0 * 0.8, bh0 / 2);
      ctx.fill();
      ctx.fillStyle = "#ff6a8a";
      ctx.beginPath();
      ctx.roundRect(bx0, y2, Math.max(bh0, bw0 * tot / max), bh0 * 0.8, bh0 / 2);
      ctx.fill();
    }
    UI_OWN = null;
    G.hitFlash = Math.max(0, hitK - dt * 1.8);
    if (hitK > 0) {
      const vg = ctx.createRadialGradient(W / 2, H / 2, S * 0.32, W / 2, H / 2, Math.max(W, H) * 0.68);
      vg.addColorStop(0, "rgba(255,20,20,0)");
      vg.addColorStop(1, "rgba(255,20,20,".concat(0.55 * hitK, ")"));
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);
      ctx.save();
      ctx.globalAlpha = Math.min(1, hitK * 1.5);
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = Math.max(1.5, S * 3e-3);
      for (const c of cracks) {
        ctx.beginPath();
        ctx.moveTo(...c[0]);
        for (const p of c) ctx.lineTo(...p);
        ctx.stroke();
      }
      ctx.restore();
    }
  }
  let tip = null;
  function showTip(text, warn) {
    tip = { text, warn: !!warn, t0: performance.now() };
    G.tip = text;
    G.tips = (G.tips || 0) + 1;
  }
  function drawTip(now) {
    if (!tip) return;
    const age = (now - tip.t0) / 1e3;
    if (age > 3) {
      tip = null;
      G.tip = null;
      return;
    }
    const L = laneGeom(), fs = clamp(L.tipH * 0.5, 15, 30), maxW = Math.min(W * 0.8, W - 2 * Math.max(70, S * 0.16));
    ctx.font = "800 ".concat(fs, 'px system-ui, -apple-system, "Segoe UI", sans-serif');
    const tw = Math.min(maxW, ctx.measureText(tip.text).width);
    const pw = tw + fs * 1.6, x = W / 2 - pw / 2, y = L.tipY;
    ctx.save();
    ctx.globalAlpha = age < 0.2 ? age / 0.2 : age > 2.5 ? (3 - age) / 0.5 : 1;
    ctx.fillStyle = "rgba(6,8,18,0.95)";
    ctx.strokeStyle = tip.warn ? "rgba(255,110,90,0.7)" : "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, pw, L.tipH, L.tipH / 2);
    ctx.fill();
    ctx.stroke();
    UI.push({ kind: "box", id: "tip", x, y, w: pw, h: L.tipH });
    UI_OWN = "tip";
    txt(tip.text, W / 2, y + L.tipH / 2, fs, tip.warn ? "#ffc2b5" : "#ffffff", "center", 800, null, maxW);
    UI_OWN = null;
    ctx.restore();
  }
  function pictogram(cx, cy, s, t, kind) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const lean = kind === "lean" ? Math.sin(t * 2.4) * 0.3 : 0;
    ctx.save();
    ctx.rotate(lean);
    ctx.strokeStyle = "#e8f6ff";
    ctx.lineWidth = s * 0.06;
    ctx.shadowColor = "#4fd8ff";
    ctx.shadowBlur = s * 0.1;
    ctx.beginPath();
    ctx.arc(0, -s * 0.42, s * 0.08, 0, 7);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.32);
    ctx.lineTo(0, 0);
    ctx.lineTo(-s * 0.12, s * 0.3);
    ctx.moveTo(0, 0);
    ctx.lineTo(s * 0.12, s * 0.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.26);
    if (kind === "point") {
      ctx.lineTo(s * 0.32, -s * 0.48);
      ctx.moveTo(0, -s * 0.26);
      ctx.lineTo(-s * 0.32, -s * 0.48);
    } else {
      ctx.lineTo(s * 0.14, -s * 0.05);
      ctx.moveTo(0, -s * 0.26);
      ctx.lineTo(-s * 0.14, -s * 0.05);
    }
    ctx.stroke();
    ctx.restore();
    if (kind === "point") for (const sd of [-1, 1]) {
      const c = HAND_COL[sd < 0 ? "left" : "right"];
      ctx.strokeStyle = c;
      ctx.lineWidth = s * 0.035;
      ctx.shadowColor = c;
      ctx.shadowBlur = s * 0.12;
      ctx.beginPath();
      ctx.arc(sd * s * 0.5, -s * 0.62, s * (0.08 + 0.02 * Math.sin(t * 6 + sd)), 0, 7);
      ctx.stroke();
    }
    else {
      const k = t * 0.9 % 1;
      ctx.fillStyle = "#ff4a2a";
      ctx.shadowColor = "#ff2a2a";
      ctx.shadowBlur = s * 0.15;
      ctx.beginPath();
      ctx.arc(-Math.sin(t * 2.4) * s * 0.25 * 0 + s * 0.02, -s * 0.9 + k * s * 0.9, s * 0.07 + k * s * 0.05, 0, 7);
      ctx.fill();
    }
    ctx.restore();
  }
  function drawTitle(now) {
    if (!BP.howTo) {
      ctx.save();
      ctx.font = "900 italic ".concat(S * 0.15, "px system-ui, sans-serif");
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const tg = ctx.createLinearGradient(0, H * 0.13, 0, H * 0.28);
      tg.addColorStop(0, "#ffffff");
      tg.addColorStop(0.5, "#7fe0ff");
      tg.addColorStop(1, "#2a6cff");
      ctx.shadowColor = "#2a8aff";
      ctx.shadowBlur = S * 0.06;
      ctx.fillStyle = tg;
      ctx.fillText("STAR BLASTER", W / 2, H * 0.2);
      ctx.restore();
      pictogram(W / 2 - S * 0.3, H * 0.5, S * 0.22, now / 1e3, "point");
      pictogram(W / 2 + S * 0.3, H * 0.5, S * 0.22, now / 1e3, "lean");
      txt("Point with each hand to shoot", W / 2 - S * 0.3, H * 0.66, S * 0.034, "#9fe8ff", "center", 900);
      txt("Lean to dodge", W / 2 + S * 0.3, H * 0.66, S * 0.034, "#ffb0a0", "center", 900);
    }
    if (coachUp()) return;
    const gap = BP.layout.gap(W, H), sh = Math.max(0.16 * S, 60), sw = Math.max(0.42 * S, 200), ch = Math.max(0.13 * S, 52), cw = Math.max(0.3 * S, 150);
    const by = Math.min(H * 0.715, H * 0.93 - sh), row = W / 2 >= sw / 2 + gap + cw + 0.04 * W;
    const cr = row ? { x: W / 2 + sw / 2 + gap, y: by + (sh - ch) / 2 } : { x: W / 2 - cw / 2, y: Math.min(H * 0.95 - ch, by + sh + 0.13 * S) };
    const sy = row ? by : Math.min(by, cr.y - 0.13 * S - sh);
    button("start", "START", W / 2 - sw / 2, sy, sw, sh, now, true, () => startRound(performance.now()));
    button("mode", "", cr.x, cr.y, cw, ch, now, false, pickMode, G.hardcore ? "hc" : null);
    txt("CHANGE MODE", cr.x + cw / 2, cr.y + ch * 0.4, ch * 0.27, "#fff", "center", 900, null, cw * 0.86);
    txt(G.hardcore ? "HARD" : "NORMAL", cr.x + cw / 2, cr.y + ch * 0.7, ch * 0.18, G.hardcore ? "#ffb0b0" : "#9fe8ff", "center", 800, null, cw * 0.86);
    UI_OWN = null;
    if (Q.has("tv") && !G._tvAt) G._tvAt = now + 2e3;
    if (G._tvAt && now > G._tvAt) {
      G._tvAt = 0;
      startRound(now);
    }
  }
  let endAt = 0;
  function coachUp() {
    return !!document.querySelector(".bphs-wrap.on");
  }
  function domChrome() {
    const coach = coachUp();
    if (BP.uiHome) {
      const want = G.state === "end" || coach ? "none" : "";
      if (BP.uiHome.style.display !== want) BP.uiHome.style.display = want;
    }
    const wrap = document.querySelector(".bph-wrap");
    if (wrap) {
      const v = coach ? "hidden" : "";
      if (wrap.style.visibility !== v) wrap.style.visibility = v;
    }
  }
  G.uiCheck = () => {
    const items = UI.map((u) => Object.assign({}, u)), vis = (e) => {
      if (!e || !e.getClientRects().length) return null;
      const cs = getComputedStyle(e);
      if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity < 0.1) return null;
      const r = e.getBoundingClientRect();
      return r.width > 1 && r.height > 1 ? r : null;
    };
    for (const id of ["bp-pause", "bp-music", "bp-home", "bp-menu", "bp-cam"]) {
      const r = vis(document.getElementById(id));
      if (r) items.push({ kind: "box", id, dom: true, x: r.left, y: r.top, w: r.width, h: r.height });
    }
    for (const [sel, id] of [[".bph-wrap:not(.bph-gone) .bph-card", "howto"], [".bphs-wrap.on .bphs-card", "scores"], ["#bp-pick", "pick"]]) {
      const r = vis(document.querySelector(sel));
      if (r) items.push({ kind: "box", id, dom: true, x: r.left, y: r.top, w: r.width, h: r.height });
    }
    if (BP.prompt) items.push({ kind: "box", id: "prompt:" + BP.prompt.kind, dom: true, x: BP.prompt.x, y: BP.prompt.y, w: BP.prompt.w, h: BP.prompt.h });
    const bad = [], inter = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
    for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
      const a = items[i], b = items[j], ov = inter(a, b);
      if (ov <= 4) continue;
      if (a.kind === "text" && a.own && a.own === b.id) continue;
      if (b.kind === "text" && b.own && b.own === a.id) continue;
      if (a.kind === "text" && b.kind === "text" && a.own && a.own === b.own && a.text === b.text) continue;
      bad.push([a.text || a.id, b.text || b.id, Math.round(ov)]);
    }
    return { state: G.state, n: items.length, items: items.map((u) => u.text || u.id), bad };
  };
  function rank() {
    const s = G.score;
    return s >= 3e4 ? "STAR ADMIRAL" : s >= 18e3 ? "ACE PILOT" : s >= 1e4 ? "CAPTAIN" : s >= 4e3 ? "WINGMATE" : "CADET";
  }
  function drawEnd(now) {
    if (coachUp()) {
      BP.uiCover = null;
      return;
    }
    const E = BP.layout.end(W, H, { cy: H * 0.7 });
    const row = BP.uiRow(), top = Math.max(row.bottom + 12, H * 0.14), room = E.again.y - Math.max(12, S * 0.03) - top;
    const pw = Math.min(W * 0.9, S * 1.05), ph = Math.min(room, S * 0.6), px = W / 2 - pw / 2, py = top + (room - ph) / 2;
    BP.uiCover = { x: px, y: py, w: pw, h: ph };
    UI.push({ kind: "box", id: "panel", x: px, y: py, w: pw, h: ph });
    UI_OWN = "panel";
    ctx.save();
    ctx.shadowColor = "rgba(40,120,255,0.4)";
    ctx.shadowBlur = S * 0.06;
    const g = ctx.createLinearGradient(0, py, 0, py + ph);
    g.addColorStop(0, "rgba(10,22,52,0.9)");
    g.addColorStop(1, "rgba(4,8,24,0.94)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(px, py, pw, ph, S * 0.04);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(140,200,255,0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    const k = clamp((now - endAt) / 100, 0, 1);
    txt(G.shipDown ? "SHIP DOWN" : "YOUR SCORE", W / 2, py + ph * 0.19, Math.min(Math.max(16, S * 0.04), ph * 0.12), G.shipDown ? "#ff8aa0" : "rgba(200,225,255,0.75)", "center", 800, null, pw * 0.9);
    txt(String(Math.round(G.score * (1 - Math.pow(1 - k, 3)))), W / 2, py + ph * 0.52, Math.min(S * 0.16, ph * 0.34), "#fff", "center", 900, "#2f9bff", pw * 0.9);
    txt(G.newBest ? "New best!" : "Best ".concat(G.best), W / 2, py + ph * 0.83, Math.min(Math.max(16, S * 0.045), ph * 0.12), G.newBest ? "#ffd166" : "rgba(255,255,255,0.75)", "center", 800, null, pw * 0.9);
    UI_OWN = null;
    const showButtons = now - endAt > 100;
    if (showButtons) {
      const a = E.again, h = E.home;
      button("again", "PLAY AGAIN", a.x, a.y, a.w, a.h, now, true, () => startRound(performance.now()), null, 900);
      button("home2", "HOME", h.x, h.y, h.w, h.h, now, false, goHome, null, BP.LEAVE_MS || 1400);
    }
  }
  function clearWorld() {
    for (const r of rocks) {
      r.alive = false;
      rockMesh.setMatrixAt(r.i, _m.makeScale(0, 0, 0));
    }
    for (const m of meteors) {
      m.alive = false;
      m.halo.visible = false;
      metMesh.setMatrixAt(m.i, _m.makeScale(0, 0, 0));
    }
    for (const d of drones) {
      d.alive = false;
      d.g.visible = false;
    }
    for (const o of orbs) {
      o.alive = false;
      o.m.visible = false;
    }
    for (const c of capsules) {
      c.alive = false;
      c.g.visible = false;
    }
    boss.alive = false;
    boss.g.visible = false;
    boss.beamOn = false;
    bossBeam.m.visible = false;
    G.boss = false;
  }
  function startRound(now) {
    BP.uiCover = null;
    audioInit();
    try {
      BodyMovin.music("blaster");
    } catch (e) {
    }
    clearWorld();
    Object.assign(G, { state: "play", score: 0, hits: 0, shots: 0, kills: 0, combo: 0, bestCombo: 0, mult: 1, wave: 0, timeLeft: ROUND, shield: 100, struggle: 0, dodges: 0, dodgeRun: 0, damage: 0, charged: 0, repairs: 0, power: {}, bossHp: null, bossKilled: false, killcam: null, shipDown: false, endAt: 0, invuln: 0, banner: null, newBest: false, comboT: 0, chunk: null, hitFlash: 0, dodgeFx: null, lastHitAt: -99, lastCapsule: -99 });
    G._prevBest = BP.best(GAME_ID);
    BP.activity.activeSec = 0;
    BP.activity.kcal = 0;
    popups.length = 0;
    G.crossfires = 0;
    aimRest.left = aimRest.right = null;
    for (const s of ["left", "right"]) Object.assign(G.guns[s], { live: false, shots: 0, hits: 0, kills: 0 });
    G.startedAt = now;
    G.roundGt = G.gt;
    sfx.whoosh();
    DODGE.rcUntil = performance.now() + 1e3;
    tip = null;
    G.tip = null;
    if (BP.howTo && BP.howTo.hide) try {
      BP.howTo.hide();
    } catch (_) {
    }
  }
  function endRound(now) {
    if (G.state !== "play") return;
    document.querySelectorAll(".bph-tip").forEach((e) => e.remove());
    G.state = "end";
    sfx.end();
    G.killcam = null;
    cockpit.visible = true;
    tip = null;
    G.tip = null;
    G.round = { active: BP.activity.activeSec, kcal: BP.activity.kcal };
    G.best = Math.max(BP.best(GAME_ID), G.score);
    G.newBest = G.score > 0 && G.score > (G._prevBest || 0);
    BP.saveSession({ game: GAME_ID, score: G.score });
    if (BP.highScores) BP.highScores(GAME_ID, G.score);
    G.sessionsSaved = (G.sessionsSaved || 0) + 1;
    endAt = now;
  }
  const DODGE = { c: null, len: null, seen: 0, rcUntil: 0, FULL: 0.42, DEAD: 0.06, SH: 0.65 };
  function bodyLane(dt) {
    var _a, _b, _c2, _d;
    const B = BP.body;
    if (BP.simulating) return clamp((_b = (_a = B.shoulders) != null ? _a : B.x) != null ? _b : 0, -1, 1);
    const I = BP.img, now = performance.now(), fresh = I && I.lShoulder && I.rShoulder && now - (BP.imgAt || 0) < 700;
    if (!fresh) return B && B.shoulders !== void 0 ? clamp((B.shoulders || 0) * 1.3, -1, 1) : null;
    const v = BP.vis || {}, hipOk = I.lHip && I.rHip && ((_c2 = v.lHip) != null ? _c2 : 1) > 0.5 && ((_d = v.rHip) != null ? _d : 1) > 0.5;
    const sx = (I.lShoulder[0] + I.rShoulder[0]) / 2, sy = (I.lShoulder[1] + I.rShoulder[1]) / 2;
    const hx = hipOk ? (I.lHip[0] + I.rHip[0]) / 2 : sx, len = hipOk ? Math.hypot(hx - sx, (I.lHip[1] + I.rHip[1]) / 2 - sy) : Math.abs(I.lShoulder[0] - I.rShoulder[0]) * 1.3;
    if (len > 0.02) DODGE.len = DODGE.len ? DODGE.len + (len - DODGE.len) * Math.min(1, dt * 1.5) : len;
    const x = sx * DODGE.SH + hx * (1 - DODGE.SH);
    if (DODGE.c === null || now - DODGE.seen > 3e3) DODGE.c = x;
    DODGE.seen = now;
    if (now < DODGE.rcUntil || G.state !== "play") DODGE.c += (x - DODGE.c) * (1 - Math.exp(-dt / (G.state === "play" ? 0.15 : 0.8)));
    let off = -(x - DODGE.c) / Math.max(0.04, DODGE.len || 0.3);
    if (Math.abs(off) > DODGE.FULL * 1.8) DODGE.c += (x - DODGE.c) * Math.min(1, dt * 0.25);
    G.bodyOff = +off.toFixed(3);
    const a = clamp((Math.abs(off) - DODGE.DEAD) / (DODGE.FULL - DODGE.DEAD), 0, 1);
    return Math.sign(off) * a;
  }
  G.shipV = new Vector3();
  G.gt = 0;
  const ZERO_M = new Matrix4().makeScale(0, 0, 0);
  const AIM_V = new Vector3(), AIM_M = new Matrix4(), AIM_Q = new Quaternion(), FLIP_Q = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI);
  let last = performance.now(), fpsN = 0, fpsAcc = 0, fpsT = 0, lastList = [];
  BP.on("punchR", () => fireNow("right"));
  BP.on("punchL", () => fireNow("left"));
  function fireNow(side) {
    if (G.state !== "play" || G.killcam) return;
    const r = RETS[side];
    if (r.cool > 0) return;
    let u = under(r, lastList), bd = 1e9;
    if (!u) for (const o of lastList) {
      const d = Math.hypot(o.x - r.x, o.y - r.y);
      if (d < hitRadius(o) * 1.6 && d < bd) {
        bd = d;
        u = o;
      }
    }
    shoot(side, u || null);
    r.cool = REFIRE * 0.75;
  }
  function direct(el) {
    const w = G.waveDef, wi = G.wave - 1, nextAt = WAVES[wi + 1] ? WAVES[wi + 1].at : 1e9;
    const open = G.gt - G.waveAt >= CALM && el < nextAt - PRE;
    const hc = G.hardcore, ease = 1 - 0.35 * G.struggle;
    const wEnd = WAVES[wi + 1] ? WAVES[wi + 1].at : el + 1, wk = clamp((el - w.at) / Math.max(1, wEnd - w.at), 0, 1);
    G.targetV = (w.tV + (w.ramp || 0) * wk) * (hc ? 1.2 : 1) * (1 - 0.2 * G.struggle);
    G.metV = w.metV * (hc ? 1.25 : 1) * (1 - 0.2 * G.struggle);
    G.dangerCap = Math.max(w.dCap ? 1 : 0, w.dCap + (hc ? 1 : 0) - (G.struggle > 0.5 ? 1 : 0));
    G.gap = (hc ? 1.1 : 1.7) + 0.6 * G.struggle;
    if (!open) {
      if (G.gt - G.waveAt >= CALM) {
        for (const d of drones) if (d.alive && d.t < d.leave) d.leave = d.t;
      }
      return;
    }
    const nT = rocks.filter((r) => r.alive && r.p.z < -6).length + drones.filter((d) => d.alive).length;
    const lessonLive = meteors.some((m) => m.alive && m.lesson && !m.done);
    if (G.gt >= G.nextT && nT < w.tMax + (hc ? 1 : 0) && !lessonLive) {
      const cap = w.tMax + (hc ? 1 : 0) - nT, vol = cap >= 2 && Math.random() < (w.volley || 0) * (1 - G.struggle) ? Math.min(cap, Math.random() < 0.35 ? 3 : 2) : 1;
      const s0 = Math.random() < 0.5 ? -1 : 1;
      for (let k = 0; k < vol; k++) spawnRock(vol === 1 && Math.random() < w.big && G.gt - G.waveAt > 6, null, null, { side: vol > 1 ? k % 2 ? -s0 : s0 : 0 });
      G.nextT = G.gt + w.tEvery * (vol > 1 ? 1.6 : 1) * rand(0.8, 1.2) / ease;
    }
    if (w.met && G.gt >= G.nextM) {
      if (dangerRoom(210 / G.metV)) {
        const m = spawnMeteor();
        if (m) {
          m.lesson = !G.lessonDone;
          G.lessonDone = true;
        }
        G.nextM = G.gt + rand(w.met[0], w.met[1]) / ease;
      } else G.nextM = G.gt + 0.5;
    }
    if (w.drones && G.gt >= G.nextD && drones.filter((d) => d.alive).length < 2) {
      const n = hc ? 3 : 2;
      for (let k = 0; k < n; k++) spawnDrone(k, n);
      G.nextD = G.gt + rand(w.drones[0], w.drones[1]) / ease;
    }
    if (G.shield <= 70 && G.gt - G.lastCapsule > 14 && G.gt - G.lastHitAt > 1.5 && !capsules.some((c) => c.alive)) spawnCapsule();
  }
  function frame(now) {
    requestAnimationFrame(frame);
    BP.update(now);
    if (now < last) G._negDt = (G._negDt || 0) + 1;
    const rdt = Math.min(0.05, Math.max(0, (now - last) / 1e3)) || 1 / 60;
    last = Math.max(last, now);
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
      const k = 1 - slowT / slowDur;
      G.timeScale = k > 0.75 ? lerp(slowAmt, 1, (k - 0.75) / 0.25) : slowAmt;
    } else G.timeScale = 1;
    const dt = rdt * G.timeScale, wdt = dt, t = now / 1e3;
    G.gt += wdt;
    const V = worldV();
    let bx = BP.live ? bodyLane(rdt) : 0;
    if (bx === null) bx = G._lastLane || 0;
    G._lastLane = bx;
    if (keys.ArrowLeft || keys.a) bx = -1;
    if (keys.ArrowRight || keys.d) bx = 1;
    if (G.state === "title") bx = Math.sin(t * 0.4) * 0.6;
    G.laneIn = +bx.toFixed(3);
    const tx = bx * LANE_X, ty = 0;
    const ox = G.ship.x, oy = G.ship.y;
    G.ship.x = lerp(G.ship.x, tx, 1 - Math.exp(-rdt * 18));
    G.ship.y = lerp(G.ship.y, ty, 1 - Math.exp(-rdt * 6));
    G.shipV.set((G.ship.x - ox) / rdt, (G.ship.y - oy) / rdt, 0);
    if (!G.killcam) {
      camera.position.set(G.ship.x, G.ship.y, 0);
      camera.rotation.set(0, -G.ship.x * 0.012, -G.shipV.x * 0.012);
      cockpit.visible = true;
    }
    G.invuln = Math.max(0, (G.invuln || 0) - rdt);
    if (G.state === "play") {
      const el = (now - G.startedAt) / 1e3;
      if (!G.killcam) G.timeLeft = Math.max(0, ROUND - el);
      let wi = 0;
      for (let i = 0; i < WAVES.length; i++) if (el >= WAVES[i].at) wi = i;
      if (wi + 1 > G.wave) startWave(wi);
      if (!G.killcam) direct(el);
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
      if (G.timeLeft <= 0 && !G.killcam) endRound(now);
      if (G.shipDown && now > G.endAt) endRound(now);
    } else if (G.state === "title" && Math.random() < rdt * 0.5 && rocks.filter((r) => r.alive).length < 3) {
      G.targetV = 30;
      spawnRock(Math.random() < 0.3);
    }
    const pf0 = performance.now();
    for (const r of rocks) {
      if (!r.alive) continue;
      const slow = clamp((-r.p.z - 22) / 80, 0.35, 1);
      r.age += wdt;
      r.p.addScaledVector(r.v, wdt * slow);
      r.p.z += (G.targetV || 30) * slow * wdt;
      r.q.multiply(_q.setFromAxisAngle(r.ax, r.w * wdt));
      if (r.p.z > -26) {
        const dx = r.p.x - G.ship.x, dy = r.p.y - G.ship.y, dl = Math.hypot(dx, dy) || 1;
        if (dl < 16) {
          r.v.x += dx / dl * 70 * wdt;
          r.v.y += dy / dl * 45 * wdt;
        }
      }
      if (r.p.z > 20) {
        r.alive = false;
        if (G.state === "play") G.struggle = Math.min(1, G.struggle + 0.04);
      }
      const sc = r.s * Math.min(1, r.age / 0.5);
      _m.compose(r.p, r.q, _s.set(sc, sc, sc));
      for (let k = 0; k < rockMeshes.length; k++) rockMeshes[k].setMatrixAt(r.i, r.alive && r.shape === k ? _m : ZERO_M);
    }
    for (const M of rockMeshes) M.instanceMatrix.needsUpdate = true;
    const lockAt = (G.hardcore ? 1.6 : 2.1) + 0.5 * G.struggle;
    const resolve = (o) => {
      o.done = true;
      if (G.state !== "play" || G.killcam) return;
      const d = Math.hypot(o.cross.x - G.ship.x, o.cross.y - G.ship.y);
      if (d < o.r + SHIP_R) {
        takeHit(o.kind === "meteor" ? 20 : 15, o.kind === "meteor" ? "METEOR" : "PLASMA", o.p.x - G.ship.x >= 0 ? 1 : -1);
        explode(_v3.set(o.p.x, o.p.y, -3), o.kind === "meteor" ? 1.2 : 0.8, "rock");
        return "hit";
      }
      dodged(o);
      return "dodge";
    };
    for (const m of meteors) {
      if (!m.alive) continue;
      const tta = m.arriveAt - G.gt;
      if (!m.locked) {
        if (tta <= lockAt) {
          aimDanger(m, m.speed, true);
          sfx.alarm();
        } else aimDanger(m, m.speed, false);
      }
      m.p.addScaledVector(m.v, wdt);
      m.q.multiply(_q.setFromAxisAngle(m.ax, m.w * wdt));
      if (!m.done && m.p.z > -0.5) {
        if (resolve(m) === "hit") m.alive = false;
      }
      if (m.p.z > 25) m.alive = false;
      const near = clamp(1 - (tta - 0.3) / 3, 0, 1), onMe = Math.hypot(m.cross.x - G.ship.x, m.cross.y - G.ship.y) < m.r + SHIP_R;
      m.halo.visible = m.alive;
      m.halo.position.copy(m.p);
      m.halo.scale.setScalar(m.s * (5 + 2.5 * near * (onMe ? 1 : 0.4) + Math.sin(t * (10 + 16 * near)) * (0.5 + near)));
      m.halo.material.opacity = onMe ? 1 : 0.7;
      if (m.alive && (m.trail = (m.trail || 0) + wdt) > 0.03) {
        m.trail = 0;
        fire.emit(m.p.x + rand(-0.4, 0.4) * m.s, m.p.y + rand(-0.4, 0.4) * m.s, m.p.z - m.s * 0.8, rand(-1, 1), rand(-1, 1), -m.speed * 0.3, 0.45, m.s * 0.9, m.s * 0.2, 3.2, 0.8, 0.25, 0.8, 1);
      }
      const vs = m.s * 1.35;
      metMesh.setMatrixAt(m.i, m.alive ? _m.compose(m.p, m.q, _s.set(vs, vs, vs)) : _m.makeScale(0, 0, 0));
    }
    metMesh.instanceMatrix.needsUpdate = true;
    for (const o of orbs) {
      if (!o.alive) continue;
      o.p.addScaledVector(o.v, wdt);
      o.m.position.copy(o.p);
      o.halo.scale.setScalar(7 + Math.sin(t * 20) * 1.2);
      if (!o.done && o.p.z > -0.5) {
        if (resolve(o) === "hit") {
          o.alive = false;
          o.m.visible = false;
        }
      }
      if (o.p.z > 20) {
        o.alive = false;
        o.m.visible = false;
      }
    }
    for (const d of drones) {
      if (!d.alive) continue;
      d.t += wdt;
      d.flash = Math.max(0, d.flash - rdt * 6);
      const want = _v.copy(d.home);
      want.x += Math.sin(d.t * 0.7 + d.slot) * 4;
      want.y += Math.cos(d.t * 1.1 + d.slot) * 1.2;
      if (d.t > d.leave) want.set(d.home.x * 3, d.home.y + 30, d.home.z - 100);
      d.p.lerp(want, 1 - Math.exp(-wdt * (d.t > d.leave ? 0.8 : 1.6)));
      const vx = (d.p.x - d.lx) / Math.max(1e-3, wdt);
      d.lx = d.p.x;
      d.yaw = lerp(d.yaw, d.t > d.leave ? Math.PI : Math.sin(d.t * 0.7 + d.slot) * 0.22 - d.p.x * 0.012, 1 - Math.exp(-wdt * 1.6));
      d.g.position.copy(d.p);
      d.g.rotation.set(0.1 + Math.sin(d.t * 1.3 + d.slot) * 0.05, d.yaw, clamp(-vx * 0.06, -0.7, 0.7));
      const ch = d.charging > 0 ? 0.5 + 0.5 * Math.sin(d.t * 30) : 0;
      d.glow.color.setRGB(d.charging > 0 ? 4 : 0.5 + d.flash * 3, d.charging > 0 ? 0.4 + ch : 2 + d.flash * 2, d.charging > 0 ? 0.3 : 3.2 + d.flash * 2);
      d.eye.color.setRGB(d.charging > 0 ? 4 : 0.6, d.charging > 0 ? 0.5 : 2.2, d.charging > 0 ? 0.3 : 3.2);
      for (const pl of d.plumes) {
        pl.material.color.set(d.charging > 0 ? 16732208 : 5945599);
        const k = d.t > d.leave ? 2.4 : 1;
        pl.scale.set(0.9 * k, 0.9 * k, 1);
      }
      if (G.state === "play" && !G.killcam && d.t > 2 && d.t < d.leave && d.p.z > -90) {
        d.fireT -= wdt;
        if (d.fireT <= 1.3 && d.charging <= 0) {
          if (dangerRoom(1.3 + 55 / 24)) d.charging = 1.3;
          else d.fireT = 2 + rand(0, 1.5);
        }
        if (d.charging > 0) {
          d.charging -= wdt;
          if (d.charging <= 0) {
            d.charging = 0;
            fireOrb(d.p.clone().add(_v.set(0, -0.3, 2)), d);
            d.fireT = rand(5, 7) * (1 + G.struggle);
          }
        }
      } else d.charging = 0;
      if (d.t > d.leave + 3) {
        d.alive = false;
        d.g.visible = false;
      }
    }
    for (const c of capsules) {
      if (!c.alive) continue;
      c.p.z += (G.targetV || 30) * 0.6 * wdt;
      c.g.position.copy(c.p);
      c.g.rotation.set(t * 1.5, t * 2, 0.4);
      if (c.p.z > 5) {
        c.alive = false;
        c.g.visible = false;
      }
    }
    if (boss.alive) {
      boss.t += wdt;
      const hold = _v3.set(Math.sin(boss.t * 0.3) * 7, 5 + Math.sin(boss.t * 0.6) * 2, -62);
      if (!boss.dying) boss.p.lerp(hold, 1 - Math.exp(-wdt * 0.7));
      boss.g.position.copy(boss.p);
      boss.g.rotation.set(0.32, boss.t * 0.25, Math.sin(boss.t * 0.5) * 0.05);
      boss.ring.material.color.setHSL(0.56 + 0.03 * Math.sin(t * 0.5), 0.7, 0.55).multiplyScalar(1.6);
      boss.light.intensity = boss.dying ? 0 : 900;
      boss.light.position.copy(boss.p).add(_v.set(0, -8, 16));
      boss.lid.rotation.x = lerp(boss.lid.rotation.x, boss.eye.alive || boss.dying ? -1.6 : 0, 1 - Math.exp(-dt * 3));
      if (!boss.dying && G.state === "play" && !G.killcam && boss.p.z > -120) {
        boss.attackT -= wdt;
        if (boss.attackT <= 0) {
          const src = boss.cores.filter((c) => c.alive);
          const from = (src.length ? pick(src).c : boss.eye.c).getWorldPosition(new Vector3());
          if (dangerRoom(-from.z / 24)) {
            fireOrb(from, null, 24);
            boss.attackT = (G.hardcore ? 2.4 : 3.6) * (1 + 0.6 * G.struggle);
          } else boss.attackT = 0.6;
        }
        boss.beamT -= wdt;
        if (boss.beamT <= 0 && !boss.beamOn) {
          bossBeam.charge = (G.hardcore ? 2 : 2.6) + 0.6 * G.struggle;
          if (dangerRoom(bossBeam.charge)) {
            boss.beamOn = true;
            bossBeam.t = 0;
            bossBeam.hitDone = false;
            boss.beamAt = G.gt + bossBeam.charge;
            bossBeam.type = G.ship.x > 0.5 ? "right" : G.ship.x < -0.5 ? "left" : pick(["left", "right"]);
            sfx.warn();
          } else boss.beamT = 0.7;
        }
      }
      if (boss.beamOn) {
        bossBeam.t += wdt;
        const m = bossBeam.m;
        m.visible = true;
        const charge = bossBeam.t < bossBeam.charge, from = boss.eye.c.getWorldPosition(new Vector3());
        const end = _v.set(bossBeam.type === "left" ? -4.5 : 4.5, 0, 6);
        m.material.uniforms.uT.value = t;
        const d = _v2.subVectors(end, from), len = d.length();
        m.position.copy(from).addScaledVector(d, 0.5);
        m.quaternion.setFromUnitVectors(_s.set(0, 1, 0), d.normalize());
        const wdth = charge ? 0.15 + bossBeam.t * 0.1 : 3.4;
        m.scale.set(wdth, len, wdth);
        m.material.uniforms.uCol.value.setRGB(3.2, charge ? 0.3 : 0.6, charge ? 0.3 : 0.4);
        if (!charge && !bossBeam.hitDone && G.state === "play") {
          bossBeam.hitDone = true;
          const ok = bossBeam.type === "left" ? G.ship.x > 1.2 : G.ship.x < -1.2;
          if (ok) dodged({ cross: { x: bossBeam.type === "left" ? -4.5 : 4.5 } });
          else takeHit(20, "BEAM", bossBeam.type === "left" ? -1 : 1);
          shake(0.4);
        }
        if (bossBeam.t > bossBeam.charge + 0.8) {
          boss.beamOn = false;
          m.visible = false;
          bossBeam.hitDone = false;
          boss.beamT = (G.hardcore ? 7 : 11) * (1 + 0.5 * G.struggle);
        }
      }
      if (boss.dying) {
        boss.dying += dt;
        if (Math.random() < dt * 8) explode(boss.p.clone().add(_v.set(rand(-14, 14), rand(-3, 4), rand(-14, 14))), rand(1, 2.4), "hull");
        if (boss.dying > 2.6 && !boss.final) {
          boss.final = true;
          explode(boss.p, 6, "hull");
          shockwave(boss.p, 200, 16760960, 1.6);
          lightFlash(boss.p, 16765088, 300, 1.2);
          flash(16777215, 0.45);
          sfx.boom(3);
          boss.g.visible = false;
        }
      }
    }
    if (G.killcam) {
      const kc = G.killcam;
      kc.t += rdt;
      cockpit.visible = false;
      boss.beamOn = false;
      bossBeam.m.visible = false;
      const a = 0.4 + kc.t * 0.45, rad = 46 - kc.t * 4;
      const want = _v.set(boss.p.x + Math.sin(a) * rad, boss.p.y + 8 - kc.t, boss.p.z + Math.cos(a) * rad);
      camera.position.lerp(want, 1 - Math.exp(-rdt * (kc.t < 0.4 ? 3 : 2)));
      camera.lookAt(boss.p);
      if (kc.t > 4.4) {
        boss.alive = false;
        boss.final = false;
        endRound(now);
      }
    }
    const sv = V * wdt * (G.boss ? 0.6 : 1);
    for (let i = 0; i < STREAKS; i++) {
      const s = streakData[i];
      s.z += sv * 1.6;
      if (s.z > 5) {
        s.z = -400;
        const a = rand(0, 6.283), rr = rand(26, 70);
        s.x = Math.cos(a) * rr * 1.4 + camera.position.x;
        s.y = Math.sin(a) * rr * 0.8;
      }
      const len = Math.min(2.2, sv * 2.5 + 0.15);
      const j = i * 6;
      streakPos[j] = streakPos[j + 3] = s.x;
      streakPos[j + 1] = streakPos[j + 4] = s.y;
      streakPos[j + 2] = s.z;
      streakPos[j + 5] = s.z - len;
    }
    streakGeo.attributes.position.needsUpdate = true;
    for (const d of dust) {
      d.position.z += sv * 0.9;
      if (d.position.z > 40) {
        d.position.z = -600;
        d.position.x = rand(-120, 120);
      }
    }
    updateFlare();
    planet.userData.uni.uT.value = t;
    if (cockpit.visible && now - MFD.t > 66) {
      MFD.t = now;
      drawMFDs(now);
    }
    const pf1 = performance.now();
    const list = projectTargets();
    lastList = list;
    updateAim(rdt, list);
    for (const side of ["left", "right"]) {
      const c = cannons[side];
      if (!c) continue;
      const r = RETS[side];
      c.recoil = Math.max(0, c.recoil - rdt * 8);
      const aim = AIM_V.set(r.x / W * 2 - 1, -(r.y / H) * 2 + 1, 0.5).unproject(camera).sub(camera.position).normalize().multiplyScalar(80).add(camera.position);
      AIM_M.lookAt(c.g.getWorldPosition(_v3), aim, _s.set(0, 1, 0));
      const qW = _q.setFromRotationMatrix(AIM_M);
      qW.premultiply(camera.getWorldQuaternion(AIM_Q).invert());
      c.g.quaternion.slerp(qW.multiply(FLIP_Q), 1 - Math.exp(-rdt * 18));
      c.body.position.z = -c.recoil * 0.08;
      c.scr = screenOf(c.tip.getWorldPosition(c.tipW || (c.tipW = new Vector3())));
      c.glow.color.set(HAND_COL[side]).multiplyScalar(0.45 + 0.8 * r.a + 0.6 * r.flash);
    }
    updateBolts(dt);
    for (const rr of rings) {
      if (rr.t <= 0) continue;
      rr.t -= dt;
      const k = 1 - rr.t / rr.d;
      rr.m.scale.setScalar(rr.s * (0.2 + 0.8 * Math.sqrt(k)));
      rr.m.material.opacity = (1 - k) * 0.35;
      rr.m.lookAt(camera.position);
      if (rr.t <= 0) rr.m.visible = false;
    }
    for (const f of flashes) {
      f.t = Math.max(0, f.t - dt);
      f.l.intensity = f.peak * Math.pow(f.t / f.d, 2);
    }
    fire.update(dt, V * 0.35);
    smoke.update(dt, V * 0.35);
    rockChunks.update(dt, V * 0.4);
    hullChunks.update(dt, V * 0.4);
    fire.mat.uniforms.uScale.value = smoke.mat.uniforms.uScale.value = renderer.getDrawingBufferSize(_v2).y * camera.projectionMatrix.elements[5] / 2;
    const pf2 = performance.now();
    if (!G._firstFrame) G._firstFrame = now;
    if (now - G._firstFrame < 3e3 || now - (G.startedAt || 0) < 1500 || Q.has("lockq")) {
      const q = state().quality;
      q.t0 = now;
      q.frames = 0;
    }
    const P = state().passes;
    if (P.ao) P.ao.enabled = false;
    if (P.bloom) {
      P.bloom.strength = 0.7;
      P.bloom.radius = 0.5;
      P.bloom.threshold = 0.85;
    }
    render(rdt);
    const pf3 = performance.now();
    ctx.clearRect(0, 0, W, H);
    buttons = [];
    UI = [];
    UI_OWN = null;
    if (G.state === "play") {
      const worst = readDangers();
      if (!G.killcam) {
        drawEdgeArrows(now);
        for (const s of ["left", "right"]) drawReticle(RETS[s]);
        drawLane(now, rdt, worst);
      }
      drawHUD(now, rdt);
      drawTip(now);
    }
    if (G.state === "title") drawTitle(now);
    if (G.state === "end") drawEnd(now);
    handleClicksAndKeys();
    domChrome();
    G.buttons = buttons.map((b) => ({ x: (b.r.x + b.r.w / 2) / W, y: (b.r.y + b.r.h / 2) / H, primary: b.primary }));
    if (G.state !== "play") BP.drawHands(ctx, W, H);
    const pf4 = performance.now(), pe = G.perf || (G.perf = { world: 0, fx: 0, render: 0, hud: 0 }), em = (k, v) => pe[k] = +(pe[k] * 0.95 + v * 0.05).toFixed(2);
    em("world", pf1 - pf0);
    em("fx", pf2 - pf1);
    em("render", pf3 - pf2);
    em("hud", pf4 - pf3);
  }
  buildCockpit();
  addEventListener("resize", () => setTimeout(buildCockpit, 50));
  {
    const hidden = [];
    scene.traverse((o) => {
      if (!o.visible) {
        hidden.push(o);
        o.visible = true;
      }
    });
    renderer.compile(scene, camera);
    const seen = /* @__PURE__ */ new Set();
    scene.traverse((o) => {
      const ms = o.material ? [].concat(o.material) : [];
      for (const m of ms) for (const k of ["map", "normalMap", "roughnessMap", "aoMap", "metalnessMap", "emissiveMap"]) {
        const tx = m[k];
        if (tx && !seen.has(tx)) {
          seen.add(tx);
          renderer.initTexture(tx);
        }
      }
    });
    hidden.forEach((o) => o.visible = false);
  }
  G.state = "title";
  G.targetV = 30;
  G.endNow = () => endRound(performance.now());
  G._dbg = { R: realism_exports, scene, renderer, THREE: three_module_exports, camera };
  G.api = {
    startRound: () => startRound(performance.now()),
    endRound: () => endRound(performance.now()),
    spawnCapsule,
    spawnMeteor,
    killBoss,
    skipTo: (sec) => {
      G.startedAt = performance.now() - sec * 1e3;
    },
    skipToBoss: () => {
      G.startedAt = performance.now() - WAVES[3].at * 1e3;
    },
    hit: () => takeHit(20, "TEST", 1)
  };
  BP.start();
  requestAnimationFrame(frame);
})().catch((e) => setTimeout(() => {
  throw e;
}));
