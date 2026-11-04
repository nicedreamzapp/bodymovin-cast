import {
  RoundedBoxGeometry
} from "./chunk-UI5V7SMY.js";
import {
  environment,
  flash,
  pbr,
  render,
  setup,
  shake,
  state,
  sun
} from "./chunk-5EPBUA75.js";
import "./chunk-CPYHHAA5.js";
import "./chunk-GEQJXPAR.js";
import "./chunk-UBB4M7UR.js";
import {
  AdditiveBlending,
  BoxGeometry,
  CanvasTexture,
  CapsuleGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Euler,
  Group,
  HemisphereLight,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NeutralToneMapping,
  Object3D,
  Plane,
  PlaneGeometry,
  PointLight,
  Raycaster,
  ShadowMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  Vector3
} from "./chunk-4IYDSAYK.js";
import "./chunk-NWIHTO7D.js";

// bmpage:bmpage:breaker.html#0
(async () => {
  var _a;
  const BodyMovin = window.BodyMovin;
  const GAME = "breaker";
  const Q = new URLSearchParams(location.search);
  const ROUND = Math.max(10, +Q.get("secs") || +Q.get("round") || 90), MUTE = Q.has("mute"), TV = Q.has("tv");
  const hud = document.getElementById("hud"), ctx = hud.getContext("2d");
  let W = 0, H = 0, S = 1, DPR = 1;
  const FONT = '"Avenir Next", "SF Pro Display", "Segoe UI", system-ui, -apple-system, sans-serif';
  const font = (w, px) => "".concat(w, " ").concat(px, "px ").concat(FONT);
  const rnd = (a, b) => a + Math.random() * (b - a), clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, k) => a + (b - a) * k;
  const TAU = Math.PI * 2;
  const inBox = (b, x, y) => x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h;
  window.__game = { round: ROUND, ready: false };
  const ENV = "squash_court", ENV_ROT = +((_a = Q.get("rot")) != null ? _a : 1.282), D = 3;
  const { scene, camera, renderer } = setup(document.getElementById("c"), { fov: 50 });
  camera.far = 1200;
  camera.updateProjectionMatrix();
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1;
  camera.position.set(0, 1.5, 0);
  camera.lookAt(0, 1.25, -D);
  camera.updateMatrixWorld();
  const ray = new Raycaster(), playPlane = new Plane(new Vector3(0, 0, 1), D);
  function worldAt(fx2, fy, out = new Vector3()) {
    ray.setFromCamera({ x: fx2 * 2 - 1, y: -(fy * 2 - 1) }, camera);
    if (!ray.ray.intersectPlane(playPlane, out)) out.set(0, 1.2, -D);
    return out;
  }
  let planeH = 2.8;
  const pxW = (px) => px / H * planeH;
  const key = sun(scene, { position: [0.7, 7, -1.2], target: [0, 0.5, -D], size: 4.5, intensity: 2.8, color: 16774374 });
  key.shadow.camera.far = 30;
  key.shadow.camera.updateProjectionMatrix();
  const floor = new Mesh(new PlaneGeometry(30, 30), new ShadowMaterial({ opacity: 0.35, color: 2759178 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  const wall = new Mesh(new PlaneGeometry(30, 12), new ShadowMaterial({ opacity: 0.18, color: 2105376 }));
  wall.position.set(0, 4, -6.9);
  wall.receiveShadow = true;
  scene.add(wall);
  scene.add(new HemisphereLight(16777215, 11569760, 0.25));
  const fill = new DirectionalLight(16775408, 0.35);
  fill.position.set(-1.5, 2.2, 3);
  fill.target.position.set(0, 2, -D);
  scene.add(fill, fill.target);
  const WOOD = {};
  let woodBase = null;
  function woodMat(hex, variant = 0) {
    const key2 = hex + variant;
    if (WOOD[key2]) return WOOD[key2];
    const m = woodBase.clone();
    m.color = new Color(hex).lerp(new Color(16777215), 0.06);
    m.clearcoat = 0.2;
    m.clearcoatRoughness = 0.45;
    for (const k of ["map", "normalMap", "roughnessMap", "aoMap"]) {
      const t = woodBase[k].clone();
      t.offset.set(variant * 0.37, variant * 0.21);
      t.needsUpdate = true;
      m[k] = t;
    }
    return WOOD[key2] = m;
  }
  let steelMat, steelCrackMat, chromeMat, rubberMat, ledMat, ballMat, fireMat, capMats = {}, laserMat, shardMat;
  const brickGeo = new RoundedBoxGeometry(1, 1, 1, 2, 0.07), ballGeo = new SphereGeometry(1, 32, 20);
  const sphereGeo = new SphereGeometry(1, 24, 16), cylGeo = new CylinderGeometry(1, 1, 1, 28), capGeo = new CapsuleGeometry(0.5, 1, 8, 20);
  const glintTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d");
    const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, "rgba(255,255,255,1)");
    r.addColorStop(0.25, "rgba(255,240,220,0.6)");
    r.addColorStop(1, "rgba(255,220,180,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, 64, 64);
    return new CanvasTexture(c);
  })();
  const paddle = new Group();
  scene.add(paddle);
  let padBody, padCapL, padCapR, padLed;
  function buildPaddle() {
    padBody = new Mesh(cylGeo, rubberMat);
    padBody.rotation.z = Math.PI / 2;
    padBody.castShadow = padBody.receiveShadow = true;
    paddle.add(padBody);
    padCapL = new Mesh(sphereGeo, chromeMat);
    padCapR = new Mesh(sphereGeo, chromeMat);
    for (const c of [padCapL, padCapR]) {
      c.castShadow = true;
      paddle.add(c);
    }
    padLed = new Mesh(boxGeoUnit(), ledMat);
    paddle.add(padLed);
  }
  function boxGeoUnit() {
    return new BoxGeometry(1, 1, 1);
  }
  const rails = new Group();
  scene.add(rails);
  const fx = new Group();
  scene.add(fx);
  function guardAO(ao) {
    if (!ao || ao.__fxGuard) return;
    const r = ao.render.bind(ao);
    ao.render = (...a) => {
      fx.visible = false;
      try {
        r(...a);
      } finally {
        fx.visible = true;
      }
    };
    ao.__fxGuard = true;
  }
  function buildRails() {
    rails.clear();
    const tl = worldAt(FIELD.l / W, FIELD.top / H), tr = worldAt(FIELD.r / W, FIELD.top / H), bl = worldAt(FIELD.l / W, 1.02), br = worldAt(FIELD.r / W, 1.02), rr = 0.018;
    const tube = (a, b) => {
      const m = new Mesh(cylGeo, chromeMat), d = b.clone().sub(a);
      m.position.copy(a).add(b).multiplyScalar(0.5);
      m.scale.set(rr, d.length(), rr);
      m.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), d.normalize());
      m.castShadow = true;
      rails.add(m);
    };
    const z = new Vector3(0, 0, -0.06);
    tube(tl.clone().add(z), bl.clone().add(z).setY(0));
    tube(tr.clone().add(z), br.clone().add(z).setY(0));
    tube(tl.clone().add(z), tr.clone().add(z));
    for (const p of [tl, tr]) {
      const k = new Mesh(sphereGeo, chromeMat);
      k.position.copy(p).add(z);
      k.scale.setScalar(rr * 1.8);
      rails.add(k);
    }
    for (const p of [bl, br]) {
      const f = new Mesh(cylGeo, chromeMat);
      f.position.copy(p).add(z).setY(0.01);
      f.scale.set(0.06, 0.02, 0.06);
      f.castShadow = true;
      rails.add(f);
    }
  }
  let ac = null, master = null, sfxBus = null, noiseBuf = null, audioErrors = 0;
  function audioInit() {
    if (ac) {
      if (ac.state === "suspended") ac.resume().catch(() => {
      });
      return;
    }
    try {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      master = ac.createGain();
      master.gain.value = MUTE ? 0 : 0.8;
      const comp = ac.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 4;
      master.connect(comp);
      comp.connect(ac.destination);
      const len = ac.sampleRate * 0.9, ir = ac.createBuffer(2, len, ac.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const d2 = ir.getChannelData(ch);
        for (let i = 0; i < len; i++) d2[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
      }
      const verb = ac.createConvolver();
      verb.buffer = ir;
      const wet = ac.createGain();
      wet.gain.value = 0.22;
      sfxBus = ac.createGain();
      sfxBus.gain.value = 0.9;
      sfxBus.connect(master);
      sfxBus.connect(verb);
      verb.connect(wet);
      wet.connect(master);
      noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      if (ac.state === "suspended") ac.resume().catch(() => {
      });
    } catch (e) {
      ac = null;
      audioErrors++;
    }
  }
  function tone(type, f0, f1, t, dur, amp, pan = 0) {
    const o = ac.createOscillator(), g = ac.createGain(), p = ac.createStereoPanner();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(1e-4, t);
    g.gain.exponentialRampToValueAtTime(amp, t + 3e-3);
    g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
    p.pan.value = clamp(pan, -1, 1);
    o.connect(g);
    g.connect(p);
    p.connect(sfxBus);
    o.start(t);
    o.stop(t + dur + 0.05);
  }
  function noiz(t, dur, type, freq, q, amp, pan = 0, f1) {
    const n = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), p = ac.createStereoPanner();
    n.buffer = noiseBuf;
    n.loop = true;
    f.type = type;
    f.frequency.setValueAtTime(freq, t);
    if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    f.Q.value = q;
    g.gain.setValueAtTime(1e-4, t);
    g.gain.exponentialRampToValueAtTime(amp, t + 2e-3);
    g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
    p.pan.value = clamp(pan, -1, 1);
    n.connect(f);
    f.connect(g);
    g.connect(p);
    p.connect(sfxBus);
    n.start(t, Math.random() * 0.5);
    n.stop(t + dur + 0.05);
  }
  const sfx = (fn) => (...a) => {
    if (!ac) return;
    try {
      fn(ac.currentTime, ...a);
    } catch (e) {
      audioErrors++;
    }
  };
  const SFX = {
    paddle: sfx((t, pan) => {
      tone("sine", 170, 110, t, 0.09, 0.5, pan);
      noiz(t, 0.04, "bandpass", 1400, 1.2, 0.35, pan);
    }),
    // a hardwood block cracking: a dry knock, a woody split, then the splinters clattering on the court floor
    brick: sfx((t, row, pan, combo) => {
      const f = 430 + combo * 12 + row * 18;
      tone("triangle", f, f * 0.7, t, 0.09, 0.45, pan);
      noiz(t, 0.06, "bandpass", 1100, 1.4, 0.75, pan);
      noiz(t, 0.03, "highpass", 3e3, 0.8, 0.35, pan);
      for (let i = 0; i < 5; i++) {
        const d = t + 0.28 + Math.random() * 0.4;
        noiz(d, 0.025, "bandpass", 1600 + Math.random() * 2200, 3, 0.08 + Math.random() * 0.08, pan + rnd(-0.3, 0.3));
      }
    }),
    steel: sfx((t, pan) => {
      [620, 1480, 2390, 3510].forEach((f, i) => tone("triangle", f, f * 0.99, t, 0.6 - i * 0.1, 0.06, pan));
      noiz(t, 0.05, "highpass", 4e3, 1, 0.3, pan);
    }),
    wall: sfx((t, pan) => {
      tone("sine", 140, 90, t, 0.07, 0.25, pan);
      noiz(t, 0.03, "lowpass", 900, 0.8, 0.2, pan);
    }),
    launch: sfx((t) => {
      noiz(t, 0.25, "bandpass", 600, 1.5, 0.3, 0, 3e3);
      tone("sine", 220, 440, t, 0.15, 0.1);
    }),
    power: sfx((t) => [784, 988, 1175, 1568].forEach((f, i) => tone("triangle", f, f, t + i * 0.06, 0.25, 0.1))),
    laser: sfx((t, pan) => {
      tone("sawtooth", 1600, 400, t, 0.12, 0.06, pan);
      noiz(t, 0.08, "highpass", 3e3, 1, 0.12, pan);
    }),
    fire: sfx((t, pan) => {
      noiz(t, 0.5, "bandpass", 250, 1.2, 0.7, pan, 2600);
      tone("sine", 90, 260, t, 0.35, 0.3, pan);
    }),
    lose: sfx((t) => {
      [392, 330, 262].forEach((f, i) => tone("triangle", f, f * 0.98, t + i * 0.14, 0.2, 0.12));
    }),
    clear: sfx((t) => {
      [523, 659, 784, 1047, 1319].forEach((f, i) => tone("triangle", f, f, t + i * 0.08, 0.4, 0.12));
    }),
    click: sfx((t) => tone("triangle", 880, 1320, t, 0.1, 0.12)),
    start: sfx((t) => {
      tone("sine", 1500, 2200, t, 0.18, 0.12);
      tone("sine", 2200, 1500, t + 0.2, 0.3, 0.12);
    }),
    fanfare: sfx((t) => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone("triangle", f, f, t + i * 0.12, i === 5 ? 0.6 : 0.14, 0.12)))
  };
  const LEVELS = [
    ["", "", "777777777777", "666666666666", "555555555555", "444444444444"],
    ["", ".....77.....", "....6666....", "...555555...", "..44444444..", ".3333333333.", "222222222222"],
    ["", "..7......7..", "...7....7...", "..66666666..", ".55S5555S55.", "444444444444", "3.333333333.3".slice(0, 12), "3.3......3.3", "...22..22..."],
    ["", ".77.....77..".replace(/^/, ""), "7777...7777.", "666666666666", ".5555555555.", "..44444444..", "...333333...", "....2222....", ".....11....."],
    ["", "SSSSSSSSSSSS", "7.7.7.7.7.7.", ".6.6.6.6.6.6", "5.5.5.5.5.5.", ".4.4.4.4.4.4", "S3S3S3S3S3S3", "2.2.2.2.2.2."],
    ["", ".....SS.....", "....7777....", "...666666...", "..55555555..", ".4444SS4444.", "..33333333..", "...222222...", "....1111....", ".....SS....."]
  ];
  const LEVEL_NAMES = ["FRONT WALL", "PYRAMID", "INVADER", "WINGS", "CHECKMATE", "DIAMOND"];
  const BCOL = { 1: "#2fae62", 2: "#22a8b8", 3: "#2a62d0", 4: "#6a42c8", 5: "#c03c96", 6: "#d03232", 7: "#e2861e", S: "#c9d6ea" };
  const G = { state: "title", score: 0, t: 0, level: 0, combo: 0, bestCombo: 0, bricksBroken: 0, drops: 0, fireballs: 0, catches: 0, assist: 0, shake: 0, saved: false, focus: 0, levelsCleared: 0, flash: 0 };
  let bricks = [], balls = [], caps = [], lasers = [], parts = [], pops = [], banner = null, brickDirty = true;
  const pad = { x: 0.5, w: 0.17, cx: 0, spread: 0.5, wideT: 0, laserT: 0, slowT: 0, glow: 0, flex: 0, lastFire: 0 };
  let FIELD = { top: 0, l: 0, r: 0, padY: 0 };
  function resize() {
    DPR = Math.min(2, devicePixelRatio || 1);
    W = hud.width = Math.round(innerWidth * DPR);
    H = hud.height = Math.round(innerHeight * DPR);
    S = Math.min(W, H);
    FIELD = { top: H * 0.17, l: W * 0.035, r: W * 0.965, padY: H * 0.885 };
    camera.updateMatrixWorld();
    planeH = worldAt(0.5, 0).distanceTo(worldAt(0.5, 1));
    uiLayout();
    layoutBricks();
    if (chromeMat) buildRails();
  }
  let UI = {};
  function uiLayout() {
    const vmin = Math.min(innerWidth, innerHeight) / 100, d = DPR;
    const T = Math.max(10, 1.8 * vmin) * d, L = T, Hh = Math.max(36, 5.6 * vmin) * d, Wb = Math.max(108, 15 * vmin) * d, Gp = Math.max(8, 1.2 * vmin) * d;
    const fs = Math.max(14, 1.9 * vmin) * d;
    UI = { T, L, Hh, Wb, G: Gp, fs, home: { x: L, y: T, w: Wb, h: Hh }, sysRight: L + 2 * Wb + 2 * Gp + Hh };
    return UI;
  }
  function layoutBricks() {
    const cols = 12, gx = W * 4e-3, bw = (FIELD.r - FIELD.l - gx * (cols - 1)) / cols, bh = H * 0.042, gy = H * 8e-3;
    for (const b of bricks) {
      b.x = FIELD.l + b.c * (bw + gx);
      b.y = FIELD.top + H * 0.02 + b.r * (bh + gy);
      b.w = bw;
      b.h = bh;
    }
  }
  function loadLevel(n) {
    const L = LEVELS[n % LEVELS.length], extra = Math.floor(n / LEVELS.length);
    for (const b of bricks) if (b.mesh) {
      scene.remove(b.mesh);
      b.mesh = null;
    }
    bricks = [];
    L.forEach((row, r) => {
      for (let c = 0; c < 12; c++) {
        const ch = row[c];
        if (!ch || ch === ".") continue;
        const steel = ch === "S" || extra && r === 1;
        bricks.push({ r, c, kind: steel ? "S" : ch, hp: steel ? 2 : 1, col: BCOL[steel ? "S" : ch], jy: rnd(-0.035, 0.035), jz: rnd(-8e-3, 8e-3), jd: rnd(-0.012, 0.012), flash: 0, born: performance.now() + (r * 12 + c) * 8 });
      }
    });
    layoutBricks();
    brickDirty = true;
  }
  function ballSpeed() {
    return H * (0.7 + 0.05 * G.level + 0.18 * clamp(G.t / ROUND, 0, 1)) * (1 - 0.25 * G.assist) * (pad.slowT > 0 ? 0.6 : 1);
  }
  function newBall(stuck) {
    return { x: pad.cx, y: FIELD.padY - S * 0.03, vx: 0, vy: 0, r: S * 0.016, stuck, off: (Math.random() < 0.5 ? -1 : 1) * rnd(0.3, 0.55), fire: 0, trail: [], id: Math.random() };
  }
  function resetRound() {
    Object.assign(G, { score: 0, t: 0, level: 0, combo: 0, bestCombo: 0, bricksBroken: 0, drops: 0, fireballs: 0, catches: 0, assist: 0, shake: 0, saved: false, levelsCleared: 0, flash: 0, curve: 0 });
    Object.assign(pad, { wideT: 0, laserT: 0, slowT: 0 });
    caps = [];
    lasers = [];
    parts = [];
    pops = [];
    G.notice = null;
    G.final15 = false;
    G.lastBrickAt = performance.now();
    loadLevel(0);
    balls = [newBall(true)];
    G.stuckAt = performance.now();
  }
  function startRound(now) {
    audioInit();
    SFX.start();
    try {
      BodyMovin.music && BodyMovin.music(GAME);
      if (MUTE) BodyMovin.musicVolume(0);
    } catch (e) {
    }
    resetRound();
    G.state = "play";
    G.startAt = now;
    state().grace(2500);
    LEAN.pos = 0.5;
    steerReset(now);
    try {
      BodyMovin.howTo && BodyMovin.howTo.hide && BodyMovin.howTo.hide();
    } catch (e) {
    }
    BodyMovin.activity.activeSec = 0;
    BodyMovin.activity.kcal = 0;
    showBanner("LEVEL 1", LEVEL_NAMES[0], "#5ef2ff");
  }
  function endRound(now) {
    G.state = "end";
    G.endAt = now;
    G.focus = 0;
    SFX.fanfare();
    pops = [];
    banner = null;
    G.notice = null;
    G.active = BodyMovin.activity.activeSec;
    G.kcal = BodyMovin.activity.kcal;
    G.prevBest = BodyMovin.best(GAME);
    if (!G.saved) {
      BodyMovin.saveSession({ game: GAME, score: G.score });
      if (BodyMovin.highScores) BodyMovin.highScores(GAME, G.score);
      G.saved = true;
    }
    G.best = BodyMovin.best(GAME);
    G.newBest = G.score > G.prevBest && G.score > 0;
    for (let i = 0; i < (G.newBest ? 200 : 80); i++) parts.push({ x: rnd(0, W), y: rnd(-H * 0.5, 0), vx: rnd(-1, 1) * S * 0.1, vy: rnd(0.1, 0.3) * S, a: 3, r: S * rnd(6e-3, 0.012), col: ["#ff4fd8", "#5ef2ff", "#ffb15a", "#7dffb0", "#ffffff"][i % 5], conf: true, rot: rnd(0, 6), vr: rnd(-6, 6) });
  }
  function showBanner(text, sub, col = "#ff4fd8") {
    banner = { text, sub, t: performance.now(), col };
  }
  function popText(x, y, text, col, size = 1) {
    if (pops.some((p) => p.text === text && p.t < 0.6)) return;
    pops.push({ x: clamp(x, S * 0.2, W - S * 0.2), y, text, col, size, t: 0 });
  }
  let jumpAt = -1e9, punchAt = -1e9, launchReq = false;
  function bodyAction() {
    jumpAt = performance.now();
  }
  BodyMovin.on("jump", bodyAction);
  BodyMovin.on("starjump", bodyAction);
  BodyMovin.on("punchL", () => {
    punchAt = performance.now();
  });
  BodyMovin.on("punchR", () => {
    punchAt = performance.now();
  });
  let armsWere = false, simShoulders = false;
  const RAISE = { t: 0, down: false };
  const LEAN = { pos: 0.5, maxV: 1.9 };
  function leanAxis(now, dt) {
    return BodyMovin.steer(LEAN, dt, { mode: "place", push: false, dead: 0.18, curve: 1.5, tau: 0.11 });
  }
  const STEER = { home: null, sw: 0, pos: 0.5, prevX: null, prevAt: 0, v: 0, at: 0, hist: [], calm: 0, t0: 0, k0: null }, STEER_R = 0.55, STEER_DEAD = 0.03;
  const STEER_WIN = 500, STEER_CREEP = 2;
  function steerReset(now) {
    STEER.home = null;
    STEER.pos = 0.5;
    STEER.hist = [];
    STEER.calm = 0;
    STEER.k0 = null;
    STEER.t0 = now;
    STEER.v = 0;
    STEER.prevX = null;
  }
  class SteerEuro {
    constructor(mc, b) {
      this.mc = mc;
      this.b = b;
      this.x = null;
      this.dx = 0;
    }
    static a(c, dt) {
      return 1 / (1 + 1 / (2 * Math.PI * c * dt));
    }
    f(v, dt) {
      if (this.x === null) {
        this.x = v;
        return v;
      }
      const d = (v - this.x) / dt;
      this.dx += SteerEuro.a(1, dt) * (d - this.dx);
      this.x += SteerEuro.a(this.mc + this.b * Math.abs(this.dx), dt) * (v - this.x);
      return this.x;
    }
  }
  const SF = { cx: new SteerEuro(2, 6), sw: new SteerEuro(1, 0), at: 0, t: 0, p: null, v: 0, x: 0.5, w: 0.15 }, STEER_LEAD = 0.015;
  function rawShoulders(now) {
    const RI = BodyMovin.rawImg, at = BodyMovin.imgAt || 0;
    if (!(RI && RI.lShoulder && RI.rShoulder)) return null;
    if (at !== SF.at) {
      const dt = SF.t ? Math.min(0.1, Math.max(1 / 120, (now - SF.t) / 1e3)) : 1 / 50;
      SF.t = now;
      SF.at = at;
      const x = SF.cx.f((RI.lShoulder[0] + RI.rShoulder[0]) / 2, dt);
      if (SF.p !== null) SF.v += 0.4 * ((x - SF.p) / dt - SF.v);
      SF.p = x;
      SF.w = SF.sw.f(Math.max(0.02, Math.abs(RI.lShoulder[0] - RI.rShoulder[0])), dt);
      SF.x = x + Math.max(-0.05, Math.min(0.05, SF.v * STEER_LEAD));
    }
    return [SF.x, SF.w];
  }
  function bodyAxis(now, dt) {
    const I = BodyMovin.img, at = BodyMovin.imgAt || 0;
    if (!(I && I.lShoulder && I.rShoulder && now - at < 700)) return null;
    const rs = rawShoulders(now);
    const cx = rs ? rs[0] : (I.lShoulder[0] + I.rShoulder[0]) / 2, sw = rs ? rs[1] : Math.max(0.02, Math.abs(I.lShoulder[0] - I.rShoulder[0]));
    const RH = BodyMovin.rawImg, hx = rs && RH.lHip && RH.rHip ? (RH.lHip[0] + RH.rHip[0]) / 2 : !rs && I.lHip && I.rHip ? (I.lHip[0] + I.rHip[0]) / 2 : null;
    if (at !== STEER.at) {
      const ref = STEER.sw || sw;
      if (STEER.prevX !== null && at > STEER.prevAt) STEER.v += (Math.abs(cx - STEER.prevX) / ref / ((at - STEER.prevAt) / 1e3) - STEER.v) * 0.5;
      STEER.prevX = cx;
      STEER.prevAt = at;
      STEER.at = at;
      STEER.hist.push([now, cx, sw, hx === null ? null : cx - hx]);
      while (STEER.hist.length && now - STEER.hist[0][0] > STEER_WIN) STEER.hist.shift();
    }
    if (STEER.home === null) {
      const H2 = STEER.hist, med = (a2) => a2.slice().sort((p, q) => p - q)[a2.length >> 1];
      if (!H2.length) return STEER.pos;
      const sws = H2.map((h) => h[2]), cxs = H2.map((h) => h[1]), m = med(sws);
      const steady = H2[H2.length - 1][0] - H2[0][0] >= STEER_WIN * 0.8 && Math.max(...sws) - Math.min(...sws) < 0.15 * m && Math.max(...cxs) - Math.min(...cxs) < 0.25 * m;
      if (!steady && now - STEER.t0 < 4e3) return STEER.pos;
      STEER.home = med(cxs);
      STEER.sw = m;
      const ds = H2.map((h) => h[3]).filter((d) => d !== null);
      STEER.k0 = ds.length ? med(ds) : null;
    }
    STEER.sw += (sw - STEER.sw) * (1 - Math.exp(-dt / 2));
    let u = -(cx - STEER.home) / STEER.sw;
    const upright = STEER.k0 !== null && hx !== null ? Math.abs(cx - hx - STEER.k0) < 0.1 * STEER.sw : Math.abs(BodyMovin.body.tilt || 0) < 0.05;
    STEER.calm = STEER.v < 0.4 && upright ? STEER.calm + dt : 0;
    if (STEER.calm > 0.6) STEER.home += (cx - STEER.home) * (1 - Math.exp(-dt / STEER_CREEP));
    const lim = STEER_R * 1.4;
    if (Math.abs(u) > lim) {
      STEER.home = cx + Math.sign(u) * lim * STEER.sw;
      u = Math.sign(u) * lim;
    }
    const a = Math.max(0, Math.abs(u) - STEER_DEAD) / (STEER_R - STEER_DEAD);
    const want = clamp(0.5 + 0.5 * Math.sign(u) * a, 0, 1);
    if (Math.abs(want - STEER.pos) > 4e-3) STEER.pos += (want - STEER.pos) * (1 - Math.exp(-dt / 0.012));
    return STEER.pos;
  }
  function updatePaddle(now, dt) {
    var _a2, _b, _c;
    const L = BodyMovin.hands.left, R = BodyMovin.hands.right, B = BodyMovin.body;
    let hx = 0.5, spread = 0.45;
    if (L.seen && R.seen) {
      hx = (L.x + R.x) / 2;
      spread = Math.abs(R.x - L.x);
    } else if (R.seen) hx = R.x;
    else if (L.seen) hx = L.x;
    const px = BodyMovin.mouse || BodyMovin.simulating && !simShoulders || !BodyMovin.live ? hx : (_a2 = bodyAxis(now, dt)) != null ? _a2 : leanAxis(now, dt);
    pad.spread += (spread - pad.spread) * Math.min(1, dt * 6);
    const levelW = Math.max(0.11, 0.17 - 0.012 * G.level) * (1 + 0.45 * G.assist);
    const wing = BodyMovin.mouse || !(L.seen && R.seen) ? 1 : lerp(0.85, 1.35, clamp((pad.spread - 0.2) / 0.5, 0, 1));
    const target = levelW * wing * (pad.wideT > 0 ? 1.6 : 1);
    pad.w += (target - pad.w) * Math.min(1, dt * 5);
    const wpx = pad.w * W, tx = FIELD.l + wpx / 2 + px * (FIELD.r - FIELD.l - wpx);
    pad.cx += (tx - pad.cx) * (1 - Math.exp(-dt * 70));
    pad.x = pad.cx / W;
    pad.glow *= Math.exp(-dt * 5);
    pad.flex *= Math.exp(-dt * 8);
    {
      const I = BodyMovin.img, fresh = I && I.lHand && I.rHand && I.lShoulder && I.rShoulder && performance.now() - (BodyMovin.imgAt || 0) < 700;
      let up = false;
      if (fresh) {
        const T = I.lHip && I.rHip ? Math.max(0.05, (I.lHip[1] + I.rHip[1] - (I.lShoulder[1] + I.rShoulder[1])) / 2) : 0.15;
        const top = (I.head ? I.head[1] : Math.min(I.lShoulder[1], I.rShoulder[1]) - 0.35 * T) - 0.12 * T, v = BodyMovin.vis || {};
        up = I.lHand[1] < top && ((_b = v.lHand) != null ? _b : 1) > 0.6 || I.rHand[1] < top && ((_c = v.rHand) != null ? _c : 1) > 0.6;
      } else up = B.armsUp;
      RAISE.t = up ? RAISE.t + dt : 0;
      if (!up) RAISE.down = true;
      if (RAISE.down && RAISE.t > 0.35) {
        launchReq = true;
        RAISE.down = false;
      }
    }
    armsWere = B.armsUp;
    pad.armsUp = B.armsUp;
  }
  function hitBrick(b, ball, viaLaser) {
    b.hp--;
    b.flash = 1;
    brickDirty = true;
    const cx = b.x + b.w / 2, cy = b.y + b.h / 2, pan = (cx / W - 0.5) * 1.4;
    if (b.hp > 0) {
      SFX.steel(pan);
      glints(worldAt(cx / W, cy / H), 5, 16773312, 0.05);
      G.score += 10;
      return;
    }
    G.lastBrickAt = performance.now();
    G.combo++;
    G.bestCombo = Math.max(G.bestCombo, G.combo);
    G.bricksBroken++;
    const pts = Math.round((b.kind === "S" ? 120 : 40 + 10 * (8 - b.r)) * (1 + Math.min(2, G.combo * 0.1)) * (ball && ball.fire ? 1.5 : 1));
    G.score += pts;
    SFX.brick(b.r, pan, G.combo);
    burst(cx, cy, [b.col, "#ffffff"], 12, ball && ball.fire ? 1.5 : 1);
    if (G.combo >= 3 && G.combo % 3 === 0) popText(cx, cy, "".concat(G.combo, " CHAIN  +").concat(pts), "#ffffff", 0.8);
    bricks.splice(bricks.indexOf(b), 1);
    shatter(b, ball);
    shake(ball && ball.fire ? 0.25 : 0.1);
    const chance = 0.16 + 0.1 * G.assist;
    if (Math.random() < chance && caps.length < 3) {
      const pool = ["M", "W", "L", "S"];
      let k = pool[Math.floor(Math.random() * 4)];
      if (k === "M" && balls.length > 4) k = "W";
      caps.push({ x: cx, y: cy, k, vy: H * 0.24, rot: 0 });
    }
    if (!bricks.length) levelClear();
  }
  function levelClear() {
    G.levelsCleared++;
    const bonus = 1e3 + 500 * G.level;
    G.score += bonus;
    SFX.clear();
    G.flash = 1;
    showBanner("LEVEL CLEAR!", "+".concat(bonus), "#7dffb0");
    flash(16777215, 0.25);
    G.level++;
    setTimeout(() => {
      if (G.state !== "play") return;
      loadLevel(G.level);
      balls = [newBall(true)];
      G.stuckAt = performance.now();
      caps = [];
      lasers = [];
      showBanner("LEVEL ".concat(G.level + 1), LEVEL_NAMES[G.level % LEVEL_NAMES.length], "#5ef2ff");
    }, 1400);
    balls.forEach((b) => {
      b.dead = true;
      burst(b.x, b.y, "#ffffff", 10);
    });
    balls = [];
  }
  function launch(ball, now) {
    const sp = ballSpeed(), a = -Math.PI / 2 + clamp(ball.off, -0.5, 0.5) + rnd(-0.15, 0.15);
    ball.stuck = false;
    ball.vx = Math.cos(a) * sp;
    ball.vy = Math.sin(a) * sp;
    SFX.launch();
    G.catches = G.catches;
  }
  function stepBall(ball, dt, now) {
    if (ball.stuck) {
      ball.x = pad.cx + ball.off * pad.w * W * 0.5;
      ball.y = FIELD.padY - ball.r - H * 0.012;
      return;
    }
    const lean = BodyMovin.body.lean || 0;
    ball.curving = 0;
    void lean;
    if (G.state === "play" && ball.vy < 0 && bricks.length && now - (G.lastBrickAt || now) > 5e3) {
      let tb = bricks[0], bd = 1e9;
      for (const b of bricks) {
        const d = Math.abs(b.x + b.w / 2 - ball.x) + Math.abs(b.y - ball.y) * 0.3;
        if (d < bd) {
          bd = d;
          tb = b;
        }
      }
      ball.vx += Math.sign(tb.x + tb.w / 2 - ball.x) * H * 0.9 * dt;
      ball.homing = 1;
    } else ball.homing = 0;
    let sp = Math.hypot(ball.vx, ball.vy) || 1;
    const want = ballSpeed() * (ball.fire ? 1.15 : 1);
    sp = sp + (want - sp) * Math.min(1, dt * 3);
    const k0 = sp / Math.hypot(ball.vx, ball.vy);
    ball.vx *= k0;
    ball.vy *= k0;
    if (Math.abs(ball.vy) < sp * 0.35) {
      ball.vy = Math.sign(ball.vy || -1) * sp * 0.35;
      const vx = Math.sqrt(Math.max(0, sp * sp - ball.vy * ball.vy));
      ball.vx = Math.sign(ball.vx || 1) * vx;
    }
    const steps = Math.ceil(Math.hypot(ball.vx, ball.vy) * dt / (ball.r * 0.5)), h = dt / steps;
    for (let i = 0; i < steps; i++) {
      ball.x += ball.vx * h;
      ball.y += ball.vy * h;
      if (ball.x < FIELD.l + ball.r) {
        ball.x = FIELD.l + ball.r;
        ball.vx = Math.abs(ball.vx);
        SFX.wall(-0.9);
      }
      if (ball.x > FIELD.r - ball.r) {
        ball.x = FIELD.r - ball.r;
        ball.vx = -Math.abs(ball.vx);
        SFX.wall(0.9);
      }
      if (ball.y < FIELD.top + ball.r) {
        ball.y = FIELD.top + ball.r;
        ball.vy = Math.abs(ball.vy);
        SFX.wall(0);
      }
      const pw = pad.w * W, ph = H * 0.024, py = FIELD.padY;
      if (ball.vy > 0 && ball.y + ball.r > py && ball.y - ball.r < py + ph && ball.x > pad.cx - pw / 2 - ball.r && ball.x < pad.cx + pw / 2 + ball.r) {
        const off = clamp((ball.x - pad.cx) / (pw / 2), -1, 1), a = -Math.PI / 2 + off * 1.05, s = Math.hypot(ball.vx, ball.vy);
        ball.vx = Math.cos(a) * s;
        ball.vy = Math.sin(a) * s;
        ball.y = py - ball.r;
        if (now - (G.lastBrickAt || now) > 4e3 && bricks.length) {
          const tb = bricks[Math.floor(Math.random() * bricks.length)], aa = Math.atan2(tb.y + tb.h / 2 - ball.y, tb.x + tb.w / 2 - ball.x);
          const na = clamp(aa, -Math.PI / 2 - 1.1, -Math.PI / 2 + 1.1);
          ball.vx = Math.cos(na) * s;
          ball.vy = Math.sin(na) * s;
          G.lastBrickAt = now - 2e3;
        }
        pad.glow = 1;
        pad.flex = 1;
        G.combo = 0;
        if (now - jumpAt < 450 || now - punchAt < 350 || BodyMovin.body.jumping) {
          ball.fire = 5;
          G.fireballs++;
          shake(0.5);
          flash(16765088, 0.15);
          SFX.fire((ball.x / W - 0.5) * 1.4);
          G.shake = 1;
          if (now - (G.firePopAt || 0) > 700) {
            G.firePopAt = now;
            popText(ball.x, py - H * 0.08, "FIREBALL!", "#ffb15a", 1.3);
          }
          burst(ball.x, py, ["#ffb15a", "#ff4d6d", "#ffe066"], 22, 1.3);
        } else SFX.paddle((ball.x / W - 0.5) * 1.4);
        continue;
      }
      if (ball.y - ball.r > H) {
        ball.dead = true;
        return;
      }
      for (const b of bricks) {
        const nx = clamp(ball.x, b.x, b.x + b.w), ny = clamp(ball.y, b.y, b.y + b.h), dx = ball.x - nx, dy = ball.y - ny;
        if (dx * dx + dy * dy > ball.r * ball.r) continue;
        if (ball.fire > 0 && b.kind !== "S") {
          ball.fire--;
          hitBrick(b, ball);
          if (!ball.fire) {
            ball.vy = Math.abs(ball.vy) * (ball.vy < 0 ? -1 : 1);
          }
          break;
        }
        const penX = Math.min(Math.abs(ball.x + ball.r - b.x), Math.abs(b.x + b.w - (ball.x - ball.r)));
        const penY = Math.min(Math.abs(ball.y + ball.r - b.y), Math.abs(b.y + b.h - (ball.y - ball.r)));
        if (penX < penY) {
          ball.vx = ball.x < b.x + b.w / 2 ? -Math.abs(ball.vx) : Math.abs(ball.vx);
        } else {
          ball.vy = ball.y < b.y + b.h / 2 ? -Math.abs(ball.vy) : Math.abs(ball.vy);
        }
        if (ball.fire > 0) ball.fire = 0;
        hitBrick(b, ball);
        break;
      }
      if (!balls.includes(ball)) return;
    }
    ball.trail.push({ x: ball.x, y: ball.y });
    if (ball.trail.length > 14) ball.trail.shift();
  }
  function update(now, dt) {
    updatePaddle(now, dt);
    for (const b of bricks) b.flash *= Math.exp(-dt * 8);
    if (G.state === "play") {
      G.t = (now - G.startAt) / 1e3;
      if (G.t >= ROUND) {
        endRound(now);
        return;
      }
      if (ROUND - G.t < 15 && !G.final15) {
        G.final15 = true;
        showBanner("FINAL 15!", "go go go", "#ff4d6d");
      }
      pad.wideT -= dt;
      pad.laserT -= dt;
      pad.slowT -= dt;
      const stuck = balls.filter((b) => b.stuck);
      if (stuck.length && launchReq && now - G.stuckAt > 500) {
        stuck.forEach((b) => launch(b, now));
        launchReq = false;
      } else if (launchReq && pad.laserT > 0 && now - pad.lastFire > 250) {
        fireLaser(now);
        launchReq = false;
      } else launchReq = false;
      if (pad.laserT > 0 && pad.armsUp && now - pad.lastFire > 380) fireLaser(now);
      for (const b of balls) stepBall(b, dt, now);
      const before = balls.length;
      balls = balls.filter((b) => !b.dead);
      if (before && !balls.length && bricks.length) {
        G.drops++;
        G.combo = 0;
        G.assist = Math.min(1, G.assist + 0.25);
        SFX.lose();
        shake(0.3);
        G.notice = { text: G.assist > 0.4 ? "paddle bigger, ball slower" : "oops! new ball", col: "#ffc4dc", t: now };
        balls = [newBall(true)];
        G.stuckAt = now;
      }
      G.assist = Math.max(0, G.assist - dt * 0.012);
      for (let i = caps.length - 1; i >= 0; i--) {
        const c = caps[i];
        c.y += c.vy * dt;
        c.rot += dt * 3;
        const pw = pad.w * W;
        if (c.y > FIELD.padY - H * 0.02 && c.y < FIELD.padY + H * 0.04 && Math.abs(c.x - pad.cx) < pw / 2 + W * 0.025) {
          caps.splice(i, 1);
          collect(c, now);
          continue;
        }
        if (c.y > H + S * 0.05) caps.splice(i, 1);
      }
      for (let i = lasers.length - 1; i >= 0; i--) {
        const l = lasers[i];
        l.y -= H * 1.8 * dt;
        const hit = bricks.find((b) => l.x > b.x && l.x < b.x + b.w && l.y > b.y && l.y < b.y + b.h);
        if (hit) {
          hitBrick(hit, null, true);
          lasers.splice(i, 1);
          continue;
        }
        if (l.y < FIELD.top) lasers.splice(i, 1);
      }
    }
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.conf) {
        p.vy = Math.min(p.vy + S * 0.5 * dt, S * 0.3);
        p.rot += p.vr * dt;
        if (p.y > H) parts.splice(i, 1);
        continue;
      }
      p.vy += S * 0.6 * dt;
      p.a -= dt * 1.6;
      if (p.a <= 0) parts.splice(i, 1);
    }
    for (let i = pops.length - 1; i >= 0; i--) {
      pops[i].t += dt;
      if (pops[i].t > 1.1) pops.splice(i, 1);
    }
    G.shake *= Math.exp(-dt * 9);
    G.flash *= Math.exp(-dt * 3);
  }
  function fireLaser(now) {
    pad.lastFire = now;
    const pw = pad.w * W;
    lasers.push({ x: pad.cx - pw * 0.42, y: FIELD.padY }, { x: pad.cx + pw * 0.42, y: FIELD.padY });
    SFX.laser((pad.x - 0.5) * 1.4);
  }
  const CAPINFO = { M: ["MULTI-BALL", "#5ef2ff"], W: ["WIDE", "#7dffb0"], L: ["LASER", "#ff4d6d"], S: ["SLOW-MO", "#ffb15a"] };
  function collect(c, now) {
    SFX.power();
    G.score += 100;
    const [name, col] = CAPINFO[c.k];
    if (c.k !== "L") popText(c.x, FIELD.padY - H * 0.1, name + "!", col, 1.2);
    burst(c.x, FIELD.padY, col, 16);
    if (c.k === "W") pad.wideT = 12;
    if (c.k === "L") {
      pad.laserT = 10;
      showBanner("LASER: ARMS UP!", null, "#ff4d6d");
    }
    if (c.k === "S") pad.slowT = 8;
    if (c.k === "M") {
      const add = [];
      for (const b of balls) {
        if (b.stuck) launch(b, now);
        for (const da of [-0.45, 0.45]) {
          const s = Math.hypot(b.vx, b.vy) || ballSpeed(), a = Math.atan2(b.vy || -1, b.vx) + da;
          add.push({ ...newBall(false), x: b.x, y: b.y, vx: Math.cos(a) * s, vy: -Math.abs(Math.sin(a) * s) });
        }
      }
      balls.push(...add.slice(0, 6));
    }
  }
  const meshOf = /* @__PURE__ */ new Map(), cables = [], tmpV = new Vector3();
  let cableMat = null;
  function syncBricks(now) {
    const bw = pxW((FIELD.r - FIELD.l) / 12), dz = 0.12;
    for (const b of bricks) {
      if (!b.mesh) {
        b.mesh = new Mesh(brickGeo, b.kind === "S" ? steelMat : woodMat(b.col, (b.r * 5 + b.c * 7) % 3));
        b.mesh.castShadow = true;
        b.mesh.receiveShadow = true;
        scene.add(b.mesh);
      }
      const k = clamp((now - b.born) / 350, 0, 1), e = 1 - Math.pow(1 - k, 3);
      worldAt((b.x + b.w / 2) / W, (b.y + b.h / 2) / H, b.mesh.position);
      b.mesh.position.z -= (1 - e) * 1.5;
      b.mesh.position.y += (1 - e) * 0.4;
      b.mesh.scale.set(pxW(b.w) * 0.97, pxW(b.h) * 0.9, dz);
      b.mesh.visible = k > 0;
      b.mesh.rotation.set((1 - e) * 1.2, b.jy, b.jz);
      b.mesh.position.z += b.jd;
      if (b.kind === "S" && b.hp < 2 && b.mesh.material !== steelCrackMat) b.mesh.material = steelCrackMat;
      if (b.flash > 0.05) b.mesh.scale.multiplyScalar(1 + b.flash * 0.08);
    }
    void bw;
    if (!cableMat) return;
    const low = [];
    for (const b of bricks) if (b.mesh && now - b.born > 350 && (!low[b.c] || b.r > low[b.c].r)) low[b.c] = b;
    for (let c = 0; c < 12; c++) {
      const m = cables[c] || (cables[c] = (() => {
        const k = new Mesh(cylGeo, cableMat);
        k.castShadow = true;
        scene.add(k);
        return k;
      })());
      const b = low[c];
      m.visible = !!b;
      if (!b) continue;
      const bot = b.mesh.position, top = worldAt((b.x + b.w / 2) / W, FIELD.top / H, tmpV);
      top.z = bot.z - 4e-3;
      m.position.set(bot.x, (top.y + bot.y) / 2, (top.z + bot.z) / 2);
      m.scale.set(32e-4, top.y - bot.y, 32e-4);
    }
  }
  const MAXS = 500, RAW = new Color(15786700);
  let shardIM = null;
  const shards = [];
  const dummy = new Object3D();
  function shatter(b, ball) {
    if (b.mesh) {
      scene.remove(b.mesh);
      b.mesh = null;
    }
    const c = worldAt((b.x + b.w / 2) / W, (b.y + b.h / 2) / H), w = pxW(b.w), h = pxW(b.h), col = new Color(b.kind === "S" ? "#9aa2ae" : b.col);
    const n = ball && ball.fire ? 16 : 11;
    const push = ball ? new Vector3(ball.vx / W, -ball.vy / H, 0).multiplyScalar(1.2) : new Vector3(0, 0.6, 0);
    for (let i = 0; i < n; i++) {
      const p = c.clone().add(new Vector3(rnd(-0.5, 0.5) * w, rnd(-0.5, 0.5) * h, rnd(-0.04, 0.04)));
      shards.push({ p, v: new Vector3(rnd(-1.2, 1.2), rnd(-0.2, 1.6), rnd(0.2, 1.8)).add(push), r: new Euler(rnd(0, 6), rnd(0, 6), rnd(0, 6)), w: new Vector3(rnd(-12, 12), rnd(-12, 12), rnd(-12, 12)), s: rnd(0.018, 0.045), col: Math.random() < 0.45 ? RAW : col, life: rnd(2.6, 3.6) });
    }
    while (shards.length > MAXS) shards.shift();
    glints(c, 6);
  }
  const sprites = [];
  function glints(pos, n, col = 16777215, size = 0.05) {
    for (let i = 0; i < n; i++) {
      const s = new Sprite(new SpriteMaterial({ map: glintTex, color: col, transparent: true, blending: AdditiveBlending, depthWrite: false }));
      s.position.copy(pos).add(new Vector3(rnd(-0.08, 0.08), rnd(-0.05, 0.05), 0.05));
      s.scale.setScalar(size * rnd(0.6, 1.6));
      fx.add(s);
      sprites.push({ s, v: new Vector3(rnd(-0.6, 0.6), rnd(-0.3, 0.8), rnd(0, 0.5)), life: 0, max: rnd(0.25, 0.5) });
    }
  }
  function burst(x, y, col, n) {
    glints(worldAt(x / W, y / H), Math.min(6, Math.ceil(n / 3)), 16777215, 0.06);
  }
  function stepShards(dt) {
    for (let i = shards.length - 1; i >= 0; i--) {
      const s = shards[i];
      s.life -= dt;
      s.v.y -= 9.8 * dt;
      s.p.addScaledVector(s.v, dt);
      s.r.x += s.w.x * dt;
      s.r.y += s.w.y * dt;
      s.r.z += s.w.z * dt;
      if (s.p.y < s.s * 0.23) {
        s.p.y = s.s * 0.23;
        s.v.y = Math.abs(s.v.y) * 0.25;
        s.v.x *= 0.5;
        s.v.z *= 0.5;
        s.w.multiplyScalar(0.4);
        if (s.v.y < 0.4) {
          s.v.set(s.v.x * 0.5, 0, s.v.z * 0.5);
          s.w.set(0, s.w.y * 0.5, 0);
          s.r.x = 0;
          s.r.z = 0;
        }
      }
      if (s.life <= 0) shards.splice(i, 1);
    }
    for (let i = 0; i < shards.length; i++) {
      const s = shards[i];
      dummy.position.copy(s.p);
      dummy.rotation.copy(s.r);
      const k = Math.min(1, s.life * 2);
      dummy.scale.set(s.s * 2.2 * k, s.s * 0.45 * k, s.s * 0.7 * k);
      dummy.updateMatrix();
      shardIM.setMatrixAt(i, dummy.matrix);
      shardIM.setColorAt(i, s.col);
    }
    shardIM.count = shards.length;
    shardIM.instanceMatrix.needsUpdate = true;
    if (shardIM.instanceColor) shardIM.instanceColor.needsUpdate = true;
    for (let i = sprites.length - 1; i >= 0; i--) {
      const g = sprites[i];
      g.life += dt;
      g.s.position.addScaledVector(g.v, dt);
      g.s.material.opacity = 1 - g.life / g.max;
      if (g.life >= g.max) {
        fx.remove(g.s);
        g.s.material.dispose();
        sprites.splice(i, 1);
      }
    }
  }
  let fireLight = null;
  function syncDynamic(now, dt) {
    const pw = pxW(pad.w * W), ph = pxW(H * 0.034), c = worldAt(pad.cx / W, (FIELD.padY + H * 0.012) / H);
    paddle.position.copy(c);
    const sq = 1 - pad.flex * 0.25;
    padBody.scale.set(ph * 0.5 * sq, Math.max(0.01, pw - ph), ph * 0.5 * (2 - sq));
    padCapL.position.set(-(pw - ph) / 2, 0, 0);
    padCapR.position.set((pw - ph) / 2, 0, 0);
    padCapL.scale.setScalar(ph * 0.56);
    padCapR.scale.setScalar(ph * 0.56);
    padLed.scale.set(Math.max(0.01, pw - ph * 1.2), ph * 0.12, ph * 0.12);
    padLed.position.set(0, ph * 0.1, ph * 0.47);
    ledMat.emissive.set(pad.laserT > 0 ? 16726586 : 7002367);
    ledMat.emissiveIntensity = 2 + 6 * pad.glow;
    const live = /* @__PURE__ */ new Set();
    let fire = null;
    for (const b of balls) {
      live.add(b);
      let m = meshOf.get(b);
      if (!m) {
        m = new Mesh(ballGeo, ballMat);
        m.castShadow = true;
        scene.add(m);
        meshOf.set(b, m);
        m.userData.ghosts = [1, 2, 3, 4].map((k) => {
          const g = new Mesh(ballGeo, new MeshBasicMaterial({ color: 2241365, transparent: true, opacity: 0.12 / k, depthWrite: false }));
          fx.add(g);
          return g;
        });
      }
      worldAt(b.x / W, b.y / H, m.position);
      m.scale.setScalar(pxW(b.r) * (b.fire ? 1.25 : 1));
      m.material = b.fire ? fireMat : ballMat;
      m.rotation.x += dt * 12;
      m.rotation.z += dt * 7;
      m.userData.ghosts.forEach((g, i) => {
        const tp = b.trail[b.trail.length - 3 - i * 3];
        g.visible = !!tp && !b.stuck;
        if (tp) {
          worldAt(tp.x / W, tp.y / H, g.position);
          g.scale.copy(m.scale);
          g.material.color.set(b.fire ? 16742954 : 2241365);
          g.material.opacity = (b.fire ? 0.35 : 0.1) / (i + 1);
        }
      });
      if (b.fire) {
        fire = m.position;
        if (Math.random() < 0.5) glints(m.position, 1, 16751162, 0.05);
      }
    }
    for (const [b, m] of meshOf) if (b.vx !== void 0 && !live.has(b)) {
      scene.remove(m);
      m.userData.ghosts && m.userData.ghosts.forEach((g) => fx.remove(g));
      meshOf.delete(b);
    }
    fireLight.intensity = fire ? 3 + Math.random() : 0;
    if (fire) fireLight.position.copy(fire);
    for (const cp of caps) {
      let m = meshOf.get(cp);
      if (!m) {
        m = new Mesh(capGeo, capMats[cp.k]);
        m.castShadow = true;
        scene.add(m);
        meshOf.set(cp, m);
      }
      worldAt(cp.x / W, cp.y / H, m.position);
      const s = pxW(S * 0.042);
      m.scale.set(s, s, s);
      m.rotation.set(0, cp.rot, Math.PI / 2);
    }
    for (const l of lasers) {
      let m = meshOf.get(l);
      if (!m) {
        m = new Mesh(cylGeo, laserMat);
        fx.add(m);
        meshOf.set(l, m);
      }
      worldAt(l.x / W, (l.y - H * 0.025) / H, m.position);
      m.scale.set(6e-3, pxW(H * 0.05), 6e-3);
    }
    for (const [o, m] of meshOf) if (o && o.k && !caps.includes(o)) {
      scene.remove(m);
      meshOf.delete(o);
    } else if (o && o.k === void 0 && o.y !== void 0 && o.vx === void 0 && !lasers.includes(o)) {
      m.parent && m.parent.remove(m);
      meshOf.delete(o);
    }
  }
  function label(text, x, y, size, col = "#fff", weight = 800, align = "center") {
    ctx.save();
    ctx.font = font(weight, size);
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.55)";
    ctx.shadowBlur = size * 0.25;
    ctx.shadowOffsetY = size * 0.05;
    ctx.fillStyle = col;
    ctx.fillText(text, x, y);
    ctx.restore();
  }
  function outline(text, x, y, size, col, weight = 900, align = "center") {
    ctx.save();
    ctx.font = font(weight, size);
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    ctx.lineWidth = size * 0.14;
    ctx.strokeStyle = "rgba(14,18,28,0.8)";
    ctx.strokeText(text, x, y);
    ctx.shadowColor = "rgba(0,0,0,0.4)";
    ctx.shadowBlur = size * 0.2;
    ctx.fillStyle = col;
    ctx.fillText(text, x, y);
    ctx.restore();
  }
  function panel(x, y, w, h, r, a = 0.5) {
    ctx.save();
    ctx.fillStyle = "rgba(16,20,30,".concat(a, ")");
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,".concat(a * 0.35, ")");
    ctx.lineWidth = Math.max(1, S * 15e-4);
    ctx.stroke();
    ctx.restore();
  }
  let buttons = [], mouseXY = null;
  function button(id, text, cx, cy, w, h, now, action, focused, ms = 700, fsz = h * 0.42) {
    const rect = { x: cx - w / 2, y: cy - h / 2, w, h }, hand = BodyMovin.handOver(rect, W, H), over = hand || mouseXY && inBox(rect, mouseXY.x, mouseXY.y);
    const k = BodyMovin.dwell(id, hand, now, ms);
    buttons.push({ id, rect, action, fill: k });
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(rect.x, rect.y, w, h, h / 2);
    ctx.fillStyle = "rgba(10,12,24,0.62)";
    ctx.fill();
    if (k > 0) {
      ctx.save();
      ctx.clip();
      ctx.fillStyle = "rgba(122,208,255,0.55)";
      ctx.fillRect(rect.x, rect.y, w * k, h);
      ctx.restore();
    }
    const pulse = 0.5 + 0.5 * Math.sin(now / 300);
    ctx.lineWidth = Math.max(1, DPR) * (focused || over ? 2 : 1);
    ctx.strokeStyle = over || focused ? "rgba(122,208,255,".concat(0.75 + 0.25 * pulse, ")") : "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.roundRect(rect.x, rect.y, w, h, h / 2);
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.font = font(800, fsz);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, cx, cy + h * 0.03);
    ctx.restore();
    if (k >= 1) {
      SFX.click();
      action();
    }
  }
  function homeButton(now) {
    if (BodyMovin.sysMode && BodyMovin.sysMode() === "play") return;
    const b = UI.home;
    button("home", "← HOME", b.x + b.w / 2, b.y + b.h / 2, b.w, b.h, now, goHome, false, 1200, UI.fs);
  }
  function glassPill(x, y, w, h, card) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, card ? Math.min(w, h) * 0.08 : h / 2);
    ctx.fillStyle = card ? "rgba(10,12,24,0.78)" : "rgba(10,12,24,0.55)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = Math.max(1, DPR);
    ctx.stroke();
    ctx.restore();
  }
  function centerPillY(w) {
    return W / 2 - w / 2 >= UI.sysRight + UI.G ? UI.T : UI.T + UI.Hh + UI.G;
  }
  function hudBottom() {
    return centerPillY(UI.Hh * 4.2) + UI.Hh + UI.G;
  }
  const goHome = () => {
    location.href = "index.html";
  };
  const CAPCOL = { M: "#5ab8ff", W: "#5ad88a", L: "#ff5a5a", S: "#ffb44a" };
  function drawHUD(now) {
    const left = Math.max(0, ROUND - G.t), low = left < 10, h = UI.Hh, fs = Math.max(UI.fs, h * 0.5);
    const tTxt = "".concat(Math.floor(Math.ceil(left) / 60), ":").concat(String(Math.ceil(left) % 60).padStart(2, "0")), sTxt = G.score.toLocaleString();
    ctx.save();
    ctx.font = font(900, fs);
    const tw = ctx.measureText(tTxt).width, sw = Math.max(ctx.measureText(sTxt).width, ctx.measureText("0000").width);
    ctx.restore();
    const pw = tw + sw + fs * 3.2, py = centerPillY(pw), px = W / 2 - pw / 2;
    glassPill(px, py, pw, h);
    label(tTxt, px + fs * 0.9 + tw / 2, py + h / 2, fs, low ? "#ff9a8a" : "#7ad0ff", 900);
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillRect(px + fs * 1.6 + tw - DPR / 2, py + h * 0.25, Math.max(1, DPR), h * 0.5);
    ctx.restore();
    label(sTxt, px + fs * 2.3 + tw + sw / 2, py + h / 2, fs, "#ffffff", 900);
    ctx.save();
    ctx.font = font(900, fs);
    const lt = "LEVEL ".concat(G.level + 1), lw = ctx.measureText(lt).width + fs * 1.6;
    ctx.restore();
    const lx = Math.min(W - UI.L, BodyMovin.freeRight ? BodyMovin.freeRight() * DPR : W) - lw, ly = (
      // left of the music switch during play
      lx >= (py === UI.T ? px + pw : UI.sysRight) + UI.G ? UI.T : py === UI.T || lx >= px + pw + UI.G ? UI.T + UI.Hh + UI.G : UI.T + 2 * (UI.Hh + UI.G)
    );
    glassPill(lx, ly, lw, h);
    label(lt, lx + lw / 2, ly + h / 2, fs, "#ffffff", 900);
    for (const c of caps) label(c.k, c.x, c.y + S * 2e-3, Math.max(14 * DPR, S * 0.026), "#ffffff", 900);
    homeButton(now);
  }
  let occupied = [], overlapFrames = 0;
  const hits = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  function reserve(box) {
    occupied.push(box);
    return box;
  }
  function textBox(text, size, weight, cx, cy) {
    ctx.save();
    ctx.font = font(weight, size);
    const w = ctx.measureText(text).width;
    ctx.restore();
    return { x: cx - w / 2 - size * 0.2, y: cy - size * 0.62, w: w + size * 0.4, h: size * 1.24 };
  }
  function freeY(box) {
    const gap = S * 6e-3, top = hudBottom(), bottom = FIELD.padY + H * 0.02;
    for (const dir of [-1, 1]) {
      let y = box.y;
      for (let i = 0; i < 16; i++) {
        const o = occupied.find((o2) => hits({ ...box, y }, o2));
        if (!o) break;
        y = dir < 0 ? o.y - box.h - gap : o.y + o.h + gap;
      }
      if (y >= top && y + box.h <= bottom && !occupied.some((o) => hits({ ...box, y }, o))) return y - box.y;
    }
    return null;
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
  function drawCenter(now) {
    const items = [];
    if (banner) {
      const k = (now - banner.t) / 1e3;
      if (k > 1.8) banner = null;
      else {
        const sc = k < 0.15 ? 0.4 + k / 0.15 * 0.7 : k < 0.25 ? 1.1 - (k - 0.15) : 1, a = clamp((1.8 - k) / 0.4, 0, 1), b = banner;
        const L = sideLines(b.text, sidePx(W, H), sideW(W, H, 0.3), (px) => font(900, px)), x0 = W * 0.025, y0 = Math.max(hudBottom(), H * 0.14) + L.px * 0.6;
        reserve({ x: x0, y: y0 - L.px * 0.6, w: L.w, h: L.h, tag: "banner" });
        ctx.save();
        ctx.globalAlpha = a;
        ctx.translate(x0, y0);
        ctx.scale(sc, sc);
        L.lines.forEach((l, j) => outline(l, 0, j * L.px * 1.1, L.px, "#ffffff", 900, "left"));
        ctx.restore();
      }
    }
    if (G.notice) {
      const k = (now - G.notice.t) / 1e3, n = G.notice;
      if (k > 2.4) G.notice = null;
      else items.push({ at: n.t, h: S * 0.06, w: textBox(n.text, S * 0.042, 900, 0, 0).w, draw: (y2) => {
        ctx.save();
        ctx.globalAlpha = clamp((2.4 - k) / 0.4, 0, 1) * clamp(k / 0.12, 0, 1);
        outline(n.text, W / 2, y2 + S * 0.03, S * 0.042, n.col);
        ctx.restore();
      } });
    }
    if (balls.some((b) => b.stuck)) {
      const t1 = "Lift a hand to launch", fz = Math.max(15 * DPR, S * 0.028), tw = textBox(t1, fz, 800, 0, 0).w, ph = fz * 1.9, pw2 = tw + fz * 1.8;
      const py = Math.min(H - ph - Math.max(6 * DPR, H * 0.012), FIELD.padY + H * 0.03);
      glassPill(W / 2 - pw2 / 2, py, pw2, ph);
      label(t1, W / 2, py + ph / 2, fz, "#ffffff", 800);
      reserve({ x: W / 2 - pw2 / 2, y: py, w: pw2, h: ph, tag: "bottom" });
    }
    const pw = pad.w * W, fireReady = balls.some((b) => !b.stuck && b.vy > 0 && b.y > FIELD.padY - H * 0.22 && Math.abs(b.x - pad.cx) < pw);
    if (!items.length && fireReady) {
      const t2 = "Jump for a fireball!", fz = Math.max(14 * DPR, S * 0.032);
      items.push({ at: 0, h: fz * 1.3, w: textBox(t2, fz, 900, 0, 0).w, draw: (y2) => {
        ctx.save();
        ctx.globalAlpha = 0.6 + 0.4 * Math.sin(now / 50);
        label(t2, W / 2, y2 + fz * 0.65, fz, "#ffc070", 900);
        ctx.restore();
      } });
    }
    if (!items.length) return;
    const it = items.reduce((m, i) => i.at >= m.at ? i : m, items[0]);
    let y = Math.min(H * 0.62 - S * 0.035, FIELD.padY - S * 0.13);
    y = Math.max(hudBottom(), y);
    reserve({ x: W / 2 - it.w / 2, y, w: it.w, h: it.h, tag: "center" });
    it.draw(y);
  }
  function drawPops() {
    const placed = [];
    for (const p of pops) {
      const k = p.t / 1.1, sc = p.size * (k < 0.12 ? 0.6 + k / 0.12 * 0.5 : 1.1 - (k - 0.12) * 0.15);
      const cy = p.y - k * S * 0.07, box = textBox(p.text, S * 0.042 * Math.max(1, sc), 900, p.x, cy);
      const dy = freeY(box);
      if (dy === null) continue;
      p.dy = dy;
      const fin = { ...box, y: box.y + p.dy, tag: p.text };
      reserve(fin);
      placed.push(fin);
      ctx.save();
      ctx.globalAlpha = clamp(1.3 - k * 1.3, 0, 1);
      ctx.translate(p.x, cy + p.dy);
      ctx.scale(sc, sc);
      outline(p.text, 0, 0, S * 0.042, p.col.startsWith("#") ? p.col : "#ffffff");
      ctx.restore();
    }
    for (const p of parts) if (p.conf) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, Math.cos(p.rot * 2));
      ctx.fillStyle = p.col;
      ctx.fillRect(-p.r, -p.r * 0.5, p.r * 2, p.r);
      ctx.restore();
    }
    return placed;
  }
  function countOverlaps() {
    let n = 0;
    for (let i = 0; i < occupied.length; i++) for (let j = i + 1; j < occupied.length; j++) if (hits(occupied[i], occupied[j])) {
      n++;
      window.__game.lastOverlap = [occupied[i], occupied[j]].map((o) => o.tag || "?");
    }
    return n;
  }
  function stick(x, y, s, armL, armR, lean = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(lean);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = s * 0.09;
    ctx.lineCap = "round";
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = s * 0.15;
    ctx.beginPath();
    ctx.arc(0, -s * 0.55, s * 0.15, 0, TAU);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.4);
    ctx.lineTo(0, s * 0.15);
    ctx.moveTo(0, s * 0.15);
    ctx.lineTo(-s * 0.2, s * 0.55);
    ctx.moveTo(0, s * 0.15);
    ctx.lineTo(s * 0.2, s * 0.55);
    ctx.moveTo(0, -s * 0.3);
    ctx.lineTo(armL[0] * s, armL[1] * s);
    ctx.moveTo(0, -s * 0.3);
    ctx.lineTo(armR[0] * s, armR[1] * s);
    ctx.stroke();
    ctx.restore();
  }
  function drawTitle(now) {
    const t = now / 1e3, pw = Math.min(W * 0.92, S * 1.5);
    if (0) {
      ctx.save();
      ctx.font = font(900, S * 0.13);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const g = ctx.createLinearGradient(0, H * 0.11, 0, H * 0.25);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(0.55, "#bfe6ff");
      g.addColorStop(1, "#5aa8ff");
      ctx.lineJoin = "round";
      ctx.lineWidth = S * 0.012;
      ctx.strokeStyle = "rgba(10,20,40,0.65)";
      ctx.strokeText("BODY BREAKER", W / 2, H * 0.18);
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = S * 0.03;
      ctx.shadowOffsetY = S * 8e-3;
      ctx.fillStyle = g;
      ctx.fillText("BODY BREAKER", W / 2, H * 0.18);
      ctx.restore();
      label("you are the paddle  ·  smash the blocks", W / 2, H * 0.285, S * 0.036, "#dff0ff", 700);
      const iy = H * 0.43, is = S * 0.085, xs = [0.2, 0.4, 0.6, 0.8].map((f) => W / 2 + (f - 0.5) * pw);
      const dx = Math.sin(t * 2) * is * 0.3, up = Math.sin(t * 3) > 0, l = Math.sin(t * 1.5) * 0.3;
      stick(xs[0] + dx, iy, is, [-0.4, 0], [0.4, 0]);
      stick(xs[1], iy, is, up ? [-0.35, -0.85] : [-0.35, 0.05], up ? [0.35, -0.85] : [0.35, 0.05]);
      stick(xs[2], iy, is, [-0.4, 0], [0.4, 0], l);
      stick(xs[3], iy - Math.abs(Math.sin(t * 3)) * is * 0.15, is, [-0.3, -0.85], [0.3, -0.85]);
      [["LEAN: move", "#bfe6ff"], ["lift a hand: launch", "#ffffff"], ["jump: FIREBALL", "#ffc070"]].forEach(([txt, col], i) => label(txt, xs[i], iy + S * 0.095, S * 0.032, col, 800));
      label("spread your arms wide for a wider paddle", W / 2, H * 0.6, S * 0.03, "#ffe0a8", 700);
    }
    const bh = Math.min(S * 0.11, H * 0.085), bw = Math.max(bh * 3.6, S * 0.4);
    const tvLeft = TV && G.tvAt ? Math.max(1, Math.ceil((G.tvAt - now) / 1e3)) : 0;
    button("start", tvLeft ? "STARTING ".concat(tvLeft, "…") : "START", W / 2, H * 0.8, bw, bh, now, () => startRound(performance.now()), true, 700, Math.max(UI.fs, bh * 0.45));
    homeButton(now);
  }
  function drawEnd(now) {
    if (BodyMovin.highScores && BodyMovin.highScores.active) {
      homeButton(now);
      return;
    }
    const k = Math.min(1, (now - G.endAt) / 500), L = BodyMovin.layout.end(W, H, { cy: H * 0.7 }), A = L.again, Hm = L.home;
    const top = H * 0.13, ph = Math.min(S * 0.34, Math.max(S * 0.24, A.y - S * 0.05 - top)), pw = Math.min(W * 0.9, Math.max(A.w * 1.4, S * 0.7));
    ctx.save();
    ctx.globalAlpha = k;
    glassPill(W / 2 - pw / 2, top, pw, ph, true);
    label("SCORE", W / 2, top + ph * 0.2, Math.max(UI.fs, S * 0.04), "rgba(207,232,255,0.85)", 800);
    label(G.score.toLocaleString(), W / 2, top + ph * 0.6, Math.min(S * 0.15, ph * 0.5), "#ffffff", 900);
    ctx.restore();
    const showButtons = now - G.endAt > 100;
    if (showButtons) {
      const bfs = Math.max(UI.fs, Math.min(A.h * 0.42, A.w * 0.12));
      button("again", "PLAY AGAIN", A.x + A.w / 2, A.y + A.h / 2, A.w, A.h, now, () => startRound(performance.now()), G.focus === 0, 700, bfs);
      button("endhome", "HOME", Hm.x + Hm.w / 2, Hm.y + Hm.h / 2, Hm.w, Hm.h, now, goHome, G.focus === 1, BodyMovin.LEAVE_MS, Math.max(UI.fs, Hm.h * 0.36));
    } else homeButton(now);
  }
  let last = 0, frames = 0;
  const BLOOM = Q.has("bloom") ? +Q.get("bloom") : 0.12;
  function frame(now) {
    BodyMovin.update(now);
    const dt = Math.min(0.05, (now - (last || now)) / 1e3) || 1 / 60;
    last = now;
    frames++;
    if (G.state === "title" && TV && G.tvAt && now > G.tvAt) {
      G.tvAt = 0;
      startRound(now);
    }
    update(now, dt);
    if (G.state === "title") {
      pad.cx = W / 2 + Math.sin(now / 900) * W * 0.2;
    }
    syncBricks(now);
    syncDynamic(now, dt);
    stepShards(dt);
    {
      const ps = state().passes;
      if (ps.bloom) {
        ps.bloom.strength = BLOOM;
        ps.bloom.threshold = 0.97;
        ps.bloom.radius = 0.3;
      }
      if (ps.ao) {
        guardAO(ps.ao);
        ps.ao.enabled = !Q.has("noao");
        ps.ao.blendIntensity = 1;
      }
    }
    render(dt);
    ctx.clearRect(0, 0, W, H);
    buttons = [];
    if (G.state === "title") drawTitle(now);
    occupied = [];
    if (G.state === "play") {
      reserve({ x: 0, y: 0, w: W, h: hudBottom(), tag: "hud" });
      drawHUD(now);
      drawCenter(now);
      drawPops();
      if (countOverlaps()) overlapFrames++;
    }
    if (G.state === "end") {
      drawPops();
      drawEnd(now);
    }
    if (G.state === "play") {
      ctx.save();
      ctx.globalAlpha = 0.55;
      BodyMovin.drawHands(ctx, W, H, 0.7);
      ctx.restore();
    } else BodyMovin.drawHands(ctx, W, H);
    Object.assign(window.__game, {
      state: G.state,
      score: G.score,
      timeLeft: Math.max(0, ROUND - G.t),
      level: G.level,
      levelsCleared: G.levelsCleared,
      bricksLeft: bricks.length,
      bricksBroken: G.bricksBroken,
      drops: G.drops,
      fireballs: G.fireballs,
      assist: G.assist,
      bestCombo: G.bestCombo,
      best: BodyMovin.best(GAME),
      active: G.active,
      kcal: G.kcal,
      powers: { wide: pad.wideT > 0, laser: pad.laserT > 0, slow: pad.slowT > 0 },
      frames,
      audioErrors,
      shards: shards.length,
      quality: { ...state().quality },
      overlaps: overlapFrames,
      buttons: buttons.map((b) => ({ id: b.id, x: (b.rect.x + b.rect.w / 2) / W, y: (b.rect.y + b.rect.h / 2) / H, fill: b.fill }))
    });
    requestAnimationFrame(frame);
  }
  Object.defineProperty(window.__game, "balls", { get: () => balls.map((b) => ({ x: b.x / W, y: b.y / H, vx: b.vx / W, vy: b.vy / H, stuck: b.stuck, fire: b.fire })) });
  Object.defineProperty(window.__game, "paddle", { get: () => ({ x: pad.cx / W, w: pad.w, y: FIELD.padY / H, left: FIELD.l / W, right: FIELD.r / W }) });
  Object.defineProperty(window.__game, "caps", { get: () => caps.map((c) => ({ x: c.x / W, y: c.y / H, k: c.k })) });
  addEventListener("resize", () => setTimeout(resize, 0));
  addEventListener("pointermove", (e) => {
    mouseXY = { x: e.clientX * DPR, y: e.clientY * DPR };
  });
  addEventListener("pointerdown", (e) => {
    audioInit();
    const x = e.clientX * DPR, y = e.clientY * DPR;
    for (const b of buttons) if (inBox(b.rect, x, y)) {
      SFX.click();
      b.action();
      return;
    }
    if (G.state === "play") {
      launchReq = true;
      jumpAt = performance.now();
    }
  });
  addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      audioInit();
      if (G.state === "title") startRound(performance.now());
      else if (G.state === "end" && performance.now() - G.endAt > 100) {
        SFX.click();
        if (G.focus === 0) startRound(performance.now());
        else goHome();
      } else if (G.state === "play") {
        launchReq = true;
        jumpAt = performance.now();
      }
    } else if (G.state === "end" && (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Tab")) {
      e.preventDefault();
      G.focus = 1 - G.focus;
    } else if (e.key === "Escape" && G.state === "play") goHome();
  });
  G.state = "loading";
  resize();
  ctx.fillStyle = "#333";
  ctx.font = font(700, S * 0.05);
  ctx.textAlign = "center";
  ctx.fillText("warming up the court…", W / 2, H / 2);
  BodyMovin.start();
  await environment(scene, renderer, ENV, { background: true, rotation: ENV_ROT, exact: true, intensity: 1 });
  woodBase = pbr("white_maple_veneer", { repeat: [0.42, 0.14], physical: true, normalScale: 0.8 });
  steelMat = pbr("metal_plate", { metalness: 0.92, roughness: 0.28, color: "#d0d6de" });
  steelCrackMat = pbr("metal_plate", { metalness: 0.85, roughness: 0.5, color: "#9aa2ae", normalScale: 2.5 });
  cableMat = new MeshStandardMaterial({ color: 9080468, metalness: 1, roughness: 0.32 });
  chromeMat = new MeshPhysicalMaterial({ color: 15922424, metalness: 1, roughness: 0.08, clearcoat: 1 });
  rubberMat = new MeshPhysicalMaterial({ color: 1711138, roughness: 0.55, clearcoat: 0.3, clearcoatRoughness: 0.4, sheen: 0.4, sheenColor: new Color(8425632) });
  ledMat = new MeshStandardMaterial({ color: 0, emissive: 7002367, emissiveIntensity: 2 });
  ballMat = new MeshPhysicalMaterial({ color: 1723088, roughness: 0.32, clearcoat: 0.8, clearcoatRoughness: 0.2 });
  fireMat = new MeshStandardMaterial({ color: 16747050, emissive: 16738842, emissiveIntensity: 4, roughness: 0.4 });
  laserMat = new MeshBasicMaterial({ color: 16756912, toneMapped: false });
  for (const k of Object.keys(CAPCOL)) capMats[k] = new MeshPhysicalMaterial({ color: CAPCOL[k], roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08 });
  shardMat = woodBase.clone();
  shardMat.color = new Color(16777215);
  shardIM = new InstancedMesh(new BoxGeometry(1, 1, 1), shardMat, MAXS);
  shardIM.count = 0;
  shardIM.frustumCulled = false;
  shardIM.castShadow = true;
  shardIM.receiveShadow = true;
  scene.add(shardIM);
  shardIM.setColorAt(0, new Color(16777215));
  fireLight = new PointLight(16747066, 0, 2.5, 2);
  scene.add(fireLight);
  buildPaddle();
  buildRails();
  loadLevel(0);
  renderer.compile(scene, camera);
  render(1 / 60);
  render(1 / 60);
  const Qy = state().quality;
  Qy.frames = 0;
  Qy.t0 = performance.now();
  state().grace(3e3);
  G.state = "title";
  if (TV) G.tvAt = performance.now() + 2e3;
  window.__game.dbg = () => ({ n: shardIM.count, col: shardIM.instanceColor ? Array.from(shardIM.instanceColor.array.slice(0, 6)) : null, hasAttr: !!shardIM.geometry.attributes.instanceColor, mat: shardMat.type });
  window.__game.endNow = () => {
    if (G.state === "play") endRound(performance.now());
  };
  window.__game.ready = true;
  requestAnimationFrame(frame);
})().catch((e) => setTimeout(() => {
  throw e;
}));
