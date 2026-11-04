import {
  FX,
  Person,
  clipInfo,
  freeSkeletons,
  itemLabel,
  loadMocap,
  loadPeople,
  makeItem,
  makeUzi,
  makeVehicle,
  makeViewArms,
  raySphere,
  setKit,
  vehicleHit
} from "../_lg/chunk-WSE6HGVT.js";
import "../_lg/chunk-5HD6ZFH7.js";
import {
  build,
  freeObject
} from "../_lg/chunk-2NRDKLEL.js";
import {
  BokehPass
} from "../_lg/chunk-7FP3ETJO.js";
import "../_lg/chunk-WYC6O5BF.js";
import "../_lg/chunk-2BP775VP.js";
import "../_lg/chunk-UI5V7SMY.js";
import {
  realism_exports,
  render,
  setup,
  shake,
  state,
  tv
} from "../_lg/chunk-5EPBUA75.js";
import "../_lg/chunk-CPYHHAA5.js";
import "../_lg/chunk-GEQJXPAR.js";
import "../_lg/chunk-UBB4M7UR.js";
import {
  Box3,
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  DoubleSide,
  Group,
  Line,
  LineBasicMaterial,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  Quaternion,
  Raycaster,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  Vector2,
  Vector3
} from "../_lg/chunk-4IYDSAYK.js";
import "../_lg/chunk-NWIHTO7D.js";

// dist/wolfstrike/game.js
var BP = window.BodyMovin;
var RU = window.WSRules;
var GRIP = window.WSGrip;
var ASSIST = window.WSAssist;
var GAME = "wolfstrike";
var TITLE = "WOLF STRIKE";
var Q = new URLSearchParams(location.search);
var MUTE = Q.has("mute");
var TV = Q.has("tv");
var clamp = (v, a, b) => Math.max(a, Math.min(b, v));
var lerp = (a, b, k) => a + (b - a) * k;
var rand = (a, b) => a + Math.random() * (b - a);
var V = (x = 0, y = 0, z = 0) => new Vector3(x, y, z);
var FONT = '"Avenir Next", "SF Pro Display", "Segoe UI", system-ui, -apple-system, sans-serif';
var font = (w, px) => "".concat(w, " ").concat(px, "px ").concat(FONT);
var G0 = window.__game = window.__game || { state: "loading" };
var errors = [];
addEventListener("error", (e) => errors.push(String(e.message)));
addEventListener("unhandledrejection", (e) => errors.push(String(e.reason && e.reason.message || e.reason)));
var glCanvas = document.getElementById("gl");
var RS = setup(glCanvas, { fov: 52, near: 0.05, far: 420, tier: Q.has("tier") ? +Q.get("tier") : void 0 });
var { renderer, scene, camera } = RS;
renderer.toneMappingExposure = 1;
scene.add(camera);
setKit(realism_exports);
var tier = () => state().quality.tier;
var bokeh = null;
function addBokeh() {
  const st = state();
  if (st.passes.ao) st.passes.ao.enabled = false;
  if (bokeh) {
    const i = st.composer.passes.indexOf(bokeh);
    if (i >= 0) st.composer.removePass(bokeh);
  }
  if (st.quality.tier < 2 || tv || Q.has("nodof")) {
    bokeh = null;
    return;
  }
  bokeh = new BokehPass(scene, camera, { focus: 16, aperture: 6e-5, maxblur: 4e-3 });
  const ps = st.composer.passes, oi = ps.findIndex((p) => p.constructor && p.constructor.name === "OutputPass");
  st.composer.insertPass(bokeh, oi > 0 ? oi : ps.length - 1);
}
state().onTier(() => addBokeh());
var hud = document.getElementById("hud");
var ctx = hud.getContext("2d");
var W = 0;
var H = 0;
var DPR = 1;
var S0 = 0;
var UI = {};
function resize() {
  DPR = Math.min(2, devicePixelRatio || 1);
  W = hud.width = Math.round(innerWidth * DPR);
  H = hud.height = Math.round(innerHeight * DPR);
  S0 = Math.min(W, H);
  const vmin = Math.min(innerWidth, innerHeight) / 100, d = DPR;
  const T = Math.max(10, 1.8 * vmin) * d, Hh = Math.max(36, 5.6 * vmin) * d, Wb = Math.max(108, 15 * vmin) * d;
  UI = { T, Hh, Wb, fs: Math.max(14, 1.9 * vmin) * d, home: { x: T, y: T, w: Wb, h: Hh }, portrait: innerWidth < innerHeight * 0.95 };
  const aspect = innerWidth / innerHeight;
  camera.fov = aspect < 1.2 ? 2 * Math.atan(Math.tan(28 * Math.PI / 180) / aspect) * 180 / Math.PI : 50;
  camera.updateProjectionMatrix();
}
addEventListener("resize", () => setTimeout(resize, 0));
resize();
var ac = null;
var master = null;
var sfxBus = null;
var ambBus = null;
var BUF = {};
var SFX_FILES = ["uzi_shot1", "uzi_shot2", "uzi_shot3", "uzi_tail", "rifle1", "rifle2", "shot_far1", "shot_far2", "boom_big", "mag_in", "bolt", "click", "heli_loop", "boat_loop", "engine_loop", "jungle"];
function audioInit() {
  if (ac) {
    if (ac.state === "suspended" && !BP.paused) ac.resume().catch(() => {
    });
    return;
  }
  try {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    master = ac.createGain();
    master.gain.value = MUTE ? 0 : 0.55;
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 4;
    comp.attack.value = 3e-3;
    comp.release.value = 0.2;
    const lim = ac.createDynamicsCompressor();
    lim.threshold.value = -4;
    lim.knee.value = 0;
    lim.ratio.value = 20;
    lim.attack.value = 1e-3;
    lim.release.value = 0.08;
    const head = ac.createGain();
    head.gain.value = 0.8;
    master.connect(comp);
    comp.connect(lim);
    lim.connect(head);
    head.connect(ac.destination);
    sfxBus = ac.createGain();
    sfxBus.connect(master);
    ambBus = ac.createGain();
    ambBus.gain.value = BP.musicOff ? 0 : 1;
    ambBus.connect(master);
    for (const n of SFX_FILES) fetch("assets/sfx/wolfstrike/".concat(n, ".mp3")).then((r) => r.arrayBuffer()).then((b) => ac.decodeAudioData(b)).then((b) => {
      BUF[n] = b;
    }).catch(() => {
    });
  } catch (_) {
    ac = null;
  }
}
BP.onMusic((off) => {
  if (ambBus) ambBus.gain.value = off ? 0 : 1;
});
setInterval(() => {
  if (!ac) return;
  if (BP.paused && ac.state === "running") ac.suspend().catch(() => {
  });
  else if (!BP.paused && ac.state === "suspended" && S.state !== "loading") ac.resume().catch(() => {
  });
}, 250);
function play(name, { gain = 1, rate = 1, vary = 0.08, pan = 0, at = 0, bus } = {}) {
  if (!ac || !BUF[name] || MUTE) return null;
  const s = ac.createBufferSource();
  s.buffer = BUF[name];
  s.playbackRate.value = rate * (1 + (Math.random() * 2 - 1) * vary);
  const g = ac.createGain(), t = ac.currentTime + at;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 4e-3);
  let node = g;
  if (ac.createStereoPanner) {
    const p = ac.createStereoPanner();
    p.pan.value = clamp(pan, -1, 1);
    g.connect(p);
    node = p;
  }
  s.connect(g);
  node.connect(bus || sfxBus);
  s.start(t);
  return { s, g };
}
function loop(name, gain, bus) {
  if (!ac || !BUF[name] || MUTE) return null;
  const s = ac.createBufferSource();
  s.buffer = BUF[name];
  s.loop = true;
  const g = ac.createGain();
  g.gain.value = 0;
  let node = g;
  let pn = null;
  if (ac.createStereoPanner) {
    pn = ac.createStereoPanner();
    g.connect(pn);
    node = pn;
  }
  s.connect(g);
  node.connect(bus || sfxBus);
  s.start();
  return { s, g, pn, gain };
}
var panOf = (p) => {
  const v = p.clone().project(camera);
  return clamp(v.x, -1, 1) * 0.8;
};
var distGain = (p, ref = 12) => clamp(ref / Math.max(ref, p.distanceTo(camera.position)), 0.12, 1);
var S = {
  state: "loading",
  mission: 0,
  world: null,
  camX: 0,
  dir: 1,
  walkV: 0.9,
  t: 0,
  last: 0,
  stageT: 0,
  endAt: 0,
  msg: null,
  msgT: 0,
  hitFlash: 0,
  tally: null,
  won: false,
  saved: false,
  best: 0,
  firing: false,
  wasFiring: false,
  aim: { x: 0.5, y: 0.45 },
  aimLive: false,
  ducking: false,
  duckFlash: 0,
  prompt: null,
  promptAt: 0,
  noGripT: 0,
  ready: 0,
  focus: 0,
  uziKick: 0,
  shake: 0,
  briefAt: 0,
  loadingNext: null,
  frames: 0,
  kills: 0
};
var G = RU.newGame();
var D = {};
var MODE = window.WS_MODE === "arcade" ? "arcade" : "easy";
var EASY = () => MODE === "easy";
var grip = GRIP.create({ easy: EASY() });
var assist = ASSIST.create();
function setMode(m) {
  if (m === MODE || S.state !== "title") return;
  MODE = m;
  try {
    localStorage.setItem("ws.mode", m);
  } catch (_) {
  }
  grip.setEasy(m === "easy");
  assist.reset();
  if (window.WSHowTo) window.WSHowTo(m);
}
var actors = [];
var vehicles = [];
var projectiles = [];
var items = [];
var birds = [];
var fx = null;
var uzi = null;
var ambience = null;
var arms = null;
var ray = new Raycaster();
ray.far = 400;
async function loadMission(i) {
  const St = RU.STAGES[i];
  if (S.world) {
    S.world.dispose();
    S.world = null;
  }
  for (const a of actors.splice(0)) {
    a.p.dispose();
    if (a.chute) freeObject(a.chute);
    if (a.stretcher) freeObject(a.stretcher);
  }
  for (const v of vehicles.splice(0)) {
    freeObject(v.g);
    if (v.snd) try {
      v.snd.s.stop();
    } catch (_) {
    }
  }
  for (const p of projectiles.splice(0)) freeObject(p.m);
  for (const it of items.splice(0)) freeObject(it.m);
  for (const b of birds.splice(0)) freeObject(b.g);
  S.dir = St.walk;
  S.camX = 0;
  const len = 260;
  S.world = await build({ R: realism_exports, scene, renderer, camera, stage: St, tier: tier(), x0: 0, len, dir: S.dir });
  if (uzi) {
    if (arms) {
      freeSkeletons(arms.person.root);
      arms.dispose();
    }
    arms = makeViewArms(camera, St.uniform);
  }
  if (ac) {
    if (ambience) try {
      ambience.s.stop();
    } catch (_) {
    }
    ambience = loop("jungle", 0, ambBus);
    if (ambience) ambience.g.gain.value = St.id === "jungle" || St.id === "village" ? 0.35 : 0.16;
  }
  try {
    const warm = new Group();
    warm.position.set(S.camX, -50, -30);
    scene.add(warm);
    const ps = ["soldier", "nurse", "boy", "hostage"].map((r) => new Person(r, { scene: warm, uniform: St.uniform, lod: 0 }));
    for (const p of ps) p.update(0.016, 1);
    const kinds = ["heli", "armor", "truck"].concat(St.river ? ["boat"] : []);
    const vs = await Promise.all(kinds.map((k) => makeVehicle(k, St.uniform)));
    for (const v of vs) warm.add(v);
    for (const k of ["mag", "grenade", "drink", "super"]) warm.add(makeItem(k));
    warm.add(makeChute());
    spawnBird();
    const bd = birds.pop();
    warm.add(bd.g);
    for (const geo of [new BoxGeometry(0.03, 0.03, 0.28), new SphereGeometry(0.1, 10, 8), new CylinderGeometry(0.06, 0.06, 0.5, 8)]) warm.add(new Mesh(geo, new MeshStandardMaterial({ color: 3817258, roughness: 0.4, metalness: 0.5 })));
    warm.add(new Mesh(new PlaneGeometry(1, 1), new MeshStandardMaterial({ color: 6253130, roughness: 0.95, side: DoubleSide })));
    if (fx) {
      fx.explosion(V(S.camX, -50, -30), 0.3);
      fx.update(0.01);
    }
    renderer.compile(scene, camera);
    await warmTextures();
    for (const p of ps) p.dispose();
    freeObject(warm);
  } catch (e) {
    console.warn("prewarm", e);
  }
  await warmTextures();
  state().grace && state().grace(9e3);
  return St;
}
async function warmTextures() {
  const tex = /* @__PURE__ */ new Set();
  scene.traverse((o) => {
    for (const m of [].concat(o.material || [])) if (m) {
      for (const k of ["map", "normalMap", "roughnessMap", "aoMap", "metalnessMap"]) if (m[k]) tex.add(m[k]);
    }
  });
  const t0 = performance.now();
  while (performance.now() - t0 < 6e3 && [...tex].some((t) => !t.image || t.image.complete === false || !t.image.width && !t.image.data)) await new Promise((r) => setTimeout(r, 100));
  for (const t of tex) try {
    renderer.initTexture(t);
  } catch (_) {
  }
}
var camHalf = (depth) => Math.tan(camera.fov * Math.PI / 360) * camera.aspect * depth;
function spawnSoldier(o) {
  const St = RU.STAGES[G.stage], Wd = S.world, depth = o.depth, z = camera.position.z - depth;
  const vest = o.kind === "vest";
  const p = new Person("soldier", { scene, uniform: St.uniform, vest, lod: depth > 18 ? 1 : 0 });
  const a = { p, kind: o.kind, hp: o.kind === "tough" ? 2 : 1, side: o.side, state: "enter", t: 0, volleys: 0, fireT: 0, v: 3.4, dead: false, role: "soldier", id: Math.random() };
  if (o.kind === "popper" && Wd.spots.windows.length) {
    const spots = Wd.spots.windows.concat(Wd.spots.roofs).filter((s) => !s.busy && Math.abs(s.p.x - S.camX) < camHalf(-s.p.z + camera.position.z) * 0.8 && s.p.z < -6);
    if (spots.length) {
      const sp = spots[Math.floor(Math.random() * spots.length)];
      sp.busy = true;
      a.spot = sp;
      p.root.position.set(sp.p.x, sp.p.y - (sp.tower ? 0 : 1.25), sp.p.z - (sp.tower ? 0 : 0.35));
      a.state = "pop";
      p.play("aimin");
      p.root.rotation.y = 0;
      actors.push(a);
      return a;
    }
    a.kind = "runner";
  }
  const x = S.camX + o.side * (camHalf(depth) + 2.5);
  if (o.kind === "para") {
    p.root.position.set(S.camX + rand(-0.6, 0.6) * camHalf(depth), 16, z);
    a.state = "para";
    p.play("handsup");
    a.chute = makeChute();
    scene.add(a.chute);
  } else {
    p.root.position.set(x, Wd.groundY(x, z), z);
    p.play(Math.random() < 0.25 ? "crouch" : "run");
    p.root.rotation.y = -o.side * Math.PI / 2;
  }
  a.stopX = S.camX + rand(-0.7, 0.7) * camHalf(depth) + S.dir * rand(0, 4);
  actors.push(a);
  return a;
}
function makeChute() {
  const g = new Group(), m = new MeshStandardMaterial({ color: 7039562, roughness: 0.9, side: DoubleSide });
  const c = new Mesh(new SphereGeometry(2.6, 18, 8, 0, Math.PI * 2, 0, 1.1), m);
  c.position.y = 4.2;
  c.castShadow = true;
  g.add(c);
  const lm = new LineBasicMaterial({ color: 3355443 });
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * Math.PI * 2;
    g.add(new Line(new BufferGeometry().setFromPoints([V(Math.cos(a) * 2.3, 5.4, Math.sin(a) * 2.3), V(0, 1.5, 0)]), lm));
  }
  return g;
}
function spawnCivilian(o) {
  const depth = rand(8, 13), z = camera.position.z - depth, x = S.camX + o.side * (camHalf(depth) + 2), Wd = S.world;
  const list = [];
  if (o.kind === "nurses") {
    const sm = new Group(), pm = new MeshStandardMaterial({ color: 9080724, roughness: 0.4, metalness: 0.7 }), cm = new MeshStandardMaterial({ color: 6253130, roughness: 0.95, side: DoubleSide });
    for (const z2 of [-0.26, 0.26]) {
      const pl = new Mesh(new CylinderGeometry(0.018, 0.018, 2.5, 8), pm);
      pl.rotation.z = Math.PI / 2;
      pl.position.z = z2;
      pl.castShadow = true;
      sm.add(pl);
    }
    const cv = new Mesh(new PlaneGeometry(1.8, 0.52), cm);
    cv.rotation.x = -Math.PI / 2;
    cv.position.y = -0.03;
    cv.receiveShadow = cv.castShadow = true;
    sm.add(cv);
    scene.add(sm);
    const pole = sm;
    for (let k = 0; k < 2; k++) {
      const p = new Person("nurse", { scene, lod: 0 });
      p.root.position.set(x + o.side * k * 2.2, Wd.groundY(x, z), z);
      p.root.rotation.y = -o.side * Math.PI / 2;
      p.play("walk");
      p.t = k * 0.3;
      p.over = (J) => {
        J.lWrist.set(0.26, 0.8, k ? 0.1 : -0.1);
        J.rWrist.set(-0.26, 0.8, k ? 0.1 : -0.1);
        J.lElbow.set(0.24, 1.07, -0.03);
        J.rElbow.set(-0.24, 1.07, -0.03);
        J.lHandDir.set(0, -1, 0);
        J.rHandDir.set(0, -1, 0);
      };
      const a = { p, kind: "nurse", role: "friendly", state: "walk", side: o.side, v: 1.25, dead: false, t: 0, stretcher: k === 0 ? pole : null, id: Math.random() };
      actors.push(a);
      list.push(a);
    }
    list[0].partner = list[1];
    list[1].partner = list[0];
  } else {
    const p = new Person("boy", { scene, scale: 0.74, lod: 0 });
    p.root.position.set(x, Wd.groundY(x, z), z);
    p.root.rotation.y = -o.side * Math.PI / 2;
    p.play("run");
    actors.push({ p, kind: "boy", role: "friendly", state: "walk", side: o.side, v: 2.6, dead: false, t: 0, id: Math.random() });
  }
}
function spawnHostage() {
  const St = RU.STAGES[G.stage], Wd = S.world, depth = rand(9, 13), z = camera.position.z - depth;
  const doors = (Wd.spots.doors || []).filter((d) => Math.abs(d.x - S.camX) < camHalf(-d.z + camera.position.z) * 0.7);
  const from = doors.length ? doors[0] : V(S.camX + S.dir * camHalf(depth) * 0.5, 0, z);
  const p = new Person("hostage", { scene, lod: 0 });
  p.root.position.set(from.x, Wd.groundY(from.x, from.z), from.z);
  p.play("handsup");
  const goal = St.escort && Wd.spots.plane ? Wd.spots.plane.clone() : V(S.camX - S.dir * (camHalf(depth) + 3), 0, z);
  actors.push({ p, kind: "hostage", role: "friendly", state: "call", t: 0, goal, v: 2.2, dead: false, id: Math.random() });
  banner("HOSTAGE! DON'T SHOOT", 1.6, "#9ff4ff");
}
async function spawnVehicle(o) {
  const St = RU.STAGES[G.stage], Wd = S.world, kind = o.kind;
  const g = await makeVehicle(kind, kind === "heli" ? 4608046 : St.uniform);
  if (S.state !== "play") return;
  let depth = kind === "heli" ? rand(26, 34) : kind === "boat" ? camera.position.z - Wd.spots.river.z : camera.position.z - Wd.spots.road.z;
  if (kind === "boat" && !Wd.spots.river) depth = 20;
  const z = camera.position.z - depth, x = S.camX + o.side * (camHalf(depth) + 9);
  const y = kind === "heli" ? rand(7, 10) : kind === "boat" ? -0.33 : Wd.groundY(x, z);
  g.position.set(x, y, z);
  g.rotation.y = o.side > 0 ? Math.PI : 0;
  scene.add(g);
  const v = { g, kind, hp: RU.R.vehicleHits[kind] || 5, side: o.side, state: "enter", t: 0, volleys: 0, stopX: S.camX + rand(-0.4, 0.4) * camHalf(depth), dead: false, sp: kind === "heli" ? 6 : kind === "boat" ? 5 : 5.5, fireT: 0 };
  const snd = kind === "heli" ? "heli_loop" : kind === "boat" ? "boat_loop" : "engine_loop";
  v.snd = loop(snd, 0);
  vehicles.push(v);
  if (kind === "truck") v.unload = 2;
}
function spawnItem(kind, p, ground = true) {
  const m = makeItem(kind);
  m.position.copy(p);
  scene.add(m);
  items.push({ m, kind, t: 0, ttl: ground ? 9 : 7, vy: ground ? 0 : 0.01, fall: !ground });
}
function spawnBird() {
  const g = new Group(), m = new MeshStandardMaterial({ color: 2366744, roughness: 0.95, side: DoubleSide });
  const body = new Mesh(new SphereGeometry(0.2, 12, 8), m);
  body.scale.set(2.6, 0.75, 0.9);
  g.add(body);
  const ruff = new Mesh(new SphereGeometry(0.1, 8, 6), new MeshStandardMaterial({ color: 13616304, roughness: 1 }));
  ruff.position.set(0.42, 0.05, 0);
  g.add(ruff);
  const head = new Mesh(new SphereGeometry(0.07, 8, 6), new MeshStandardMaterial({ color: 9067082, roughness: 0.8 }));
  head.position.set(0.58, 0.07, 0);
  g.add(head);
  const tail = new Mesh(new ShapeGeometry(new Shape([[0, -0.12], [-0.45, -0.2], [-0.45, 0.2], [0, 0.12]].map((p) => new Vector2(...p)))), m);
  tail.rotation.x = Math.PI / 2;
  tail.position.x = -0.45;
  g.add(tail);
  const wingShape = new Shape([[0.18, 0], [0.12, 1], [0, 1.55], [-0.12, 1.5], [-0.2, 1], [-0.22, 0]].map((p) => new Vector2(...p)));
  const wing = (s) => {
    const w = new Mesh(new ShapeGeometry(wingShape), m);
    w.rotation.x = s * Math.PI / 2;
    const h = new Group();
    h.add(w);
    g.add(h);
    return h;
  };
  g.userData.wings = [wing(-1), wing(1)];
  const side = Math.random() < 0.5 ? -1 : 1, depth = rand(14, 22);
  g.position.set(S.camX + side * (camHalf(depth) + 3), rand(6, 9), camera.position.z - depth);
  g.rotation.y = side > 0 ? Math.PI : 0;
  g.castShadow = true;
  scene.add(g);
  birds.push({ g, side, t: 0, dead: false, vy: 0 });
}
function banner(text, secs = 1.6, col = "#ffffff") {
  S.msg = { text, col };
  S.msgT = secs;
}
function newCampaign() {
  G = RU.newGame();
  D = {};
  S.saved = false;
  S.won = false;
}
async function startMission(i, keepScore = true) {
  S.state = "loading";
  G0.state = "loading";
  S.mission = i;
  await loadMission(i);
  const St = RU.startStage(G, i);
  D = {};
  S.state = "brief";
  S.briefAt = performance.now();
  S.stageT = 0;
  grip.calibrate();
  S.ready = 0;
  BP.howTo && BP.howTo.hide && BP.howTo.hide();
  return St;
}
function beginPlay() {
  S.state = "play";
  S.stageT = 0;
  state().grace && state().grace(5e3);
  if (S.reloaded) {
    S.holdQ = performance.now() + 15e3;
    S.reloaded = false;
  }
  banner("GO!", 1, "#ffd84a");
  play("bolt", { gain: 0.8 });
}
function missionClear() {
  S.state = "clear";
  S.endAt = performance.now();
  S.tally = RU.endStage(G);
  S.tally.mission = G.stage;
  play("mag_in", { gain: 0.7 });
  const next = G.stage + 1;
  S.loadingNext = next < RU.STAGES.length ? next : null;
}
function gameOver(won) {
  S.state = "end";
  S.endAt = performance.now();
  S.won = won;
  S.focus = 0;
  stopFire();
  if (!S.saved) {
    BP.saveSession({ game: GAME, score: G.score });
    if (BP.highScores) BP.highScores(GAME, G.score, { title: TITLE });
    S.saved = true;
  }
  S.best = BP.best(GAME);
}
async function continueMission() {
  const i = G.stage;
  S.reloaded = true;
  G.over = false;
  G.damage = 0;
  G.mags = Math.max(G.mags, RU.R.startMags);
  G.rounds = RU.R.magRounds;
  S.saved = false;
  await startMission(i);
}
async function newGame() {
  audioInit();
  newCampaign();
  await startMission(0);
}
var goHome = () => {
  location.href = "index.html" + (Q.has("demo") ? "?demo=1" : "");
};
var KEY = { fire: false, duck: false };
var mouse = null;
var mouseDown = false;
var buttons = [];
addEventListener("pointermove", (e) => {
  mouse = { x: e.clientX / innerWidth, y: e.clientY / innerHeight, at: performance.now() };
});
addEventListener("pointerdown", (e) => {
  audioInit();
  const x = e.clientX * DPR, y = e.clientY * DPR;
  for (const b of buttons) if (x > b.r.x && x < b.r.x + b.r.w && y > b.r.y && y < b.r.y + b.r.h) {
    play("click");
    b.action();
    return;
  }
  if (S.state === "play") {
    if (e.button === 2) throwGrenade();
    else {
      mouseDown = true;
      RU.trigger(G);
    }
  }
});
addEventListener("pointerup", () => {
  mouseDown = false;
});
addEventListener("contextmenu", (e) => e.preventDefault());
addEventListener("keydown", (e) => {
  if (BP.highScores && BP.highScores.active) return;
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    audioInit();
    if (S.state === "title") newGame();
    else if (S.state === "end" && performance.now() - S.endAt > 500) {
      if (S.focus === 1) goHome();
      else if (S.won) newGame();
      else continueMission();
    } else if (S.state === "brief") beginPlay();
    else if (S.state === "play" && e.key === " ") {
      if (!KEY.fire) RU.trigger(G);
      KEY.fire = true;
    }
  }
  if (S.state === "end" && (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Tab")) {
    e.preventDefault();
    S.focus = 1 - S.focus;
  }
  if (S.state === "title" && (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Tab")) {
    e.preventDefault();
    play("click");
    setMode(e.key === "ArrowLeft" ? "easy" : e.key === "ArrowRight" ? "arcade" : EASY() ? "arcade" : "easy");
  }
  if ((e.key === "g" || e.key === "G") && S.state === "play") throwGrenade();
  if (e.key === "c" || e.key === "C" || e.key === "Control") KEY.duck = true;
  if (e.key === "Escape" && S.state !== "play") goHome();
});
addEventListener("keyup", (e) => {
  if (e.key === " ") KEY.fire = false;
  if (e.key === "c" || e.key === "C" || e.key === "Control") KEY.duck = false;
});
function picFrom3D(J) {
  if (!J || !J.lShoulder || !J.rShoulder || !J.root || !J.lHand || !J.rHand) return null;
  const ch = J.lShoulder.map((c, i) => (c + J.rShoulder[i]) / 2);
  let rx = J.rShoulder[0] - J.lShoulder[0], rz = J.rShoulder[2] - J.lShoulder[2];
  const n = Math.hypot(rx, rz) || 1;
  rx /= n;
  rz /= n;
  const P = (h) => [-((h[0] - ch[0]) * rx + (h[2] - ch[2]) * rz), ch[1] - h[1]];
  return { lShoulder: P(J.lShoulder), rShoulder: P(J.rShoulder), lHip: P(J.root), rHip: P(J.root), lHand: P(J.lHand), rHand: P(J.rHand) };
}
var lastImgAt = 0;
function readInput(dt, now) {
  if (BP.mouse || mouse && now - mouse.at < 5e3 && !BP.live) {
    if (mouse) {
      S.aim.x = mouse.x;
      S.aim.y = mouse.y;
    }
    S.aimLive = !!mouse;
    S.firing = mouseDown || KEY.fire;
    S.ducking = KEY.duck;
    S.gripSeen = false;
    if (S.ezAuto || S.ezLock) {
      S.ezAuto = false;
      S.ezLock = false;
      assist.reset();
    }
    return;
  }
  if (BP.rawImg && BP.imgAt && BP.imgAt !== lastImgAt) {
    lastImgAt = BP.imgAt;
    if (grip.frame(BP.rawImg, BP.rawJ, BP.vis, BP.imgAR, BP.imgAt / 1e3) && S.state === "play") throwGrenade();
  }
  const fresh = now - (BP.imgAt || 0) < 700 && BP.img && BP.img.lShoulder;
  const I = fresh ? BP.img : picFrom3D(BP.joints);
  const st = grip.aimFrom(I, BP.vis, dt, now, !!I && BP.present !== false);
  S.gripSeen = st.seen;
  S.aimLive = st.seen && st.up;
  if (st.seen) {
    S.aim.x = lerp(S.aim.x, st.x, 1);
    S.aim.y = lerp(S.aim.y, st.y, 1);
  }
  S.gripT = st.firing ? (S.gripT || 0) + dt : 0;
  S.firing = st.firing && S.gripT >= 0.06 || KEY.fire;
  if (EASY()) easyAssist(dt);
  S.ducking = KEY.duck || BP.body && (BP.body.crouch || 0) > 0.45;
}
var _pt = V();
var _hm = V();
var _sm = V();
function toPx(p) {
  _pt.copy(p).project(camera);
  return _pt.z < 1 && _pt.x > -1 && _pt.x < 1 && _pt.y > -1 && _pt.y < 1 ? { x: (_pt.x + 1) / 2 * W, y: (1 - _pt.y) / 2 * H } : null;
}
function personPoint(a) {
  const p = a.p, J = p.J;
  if (!J || !J.head || !p.root.visible || p.opacity < 0.3) return null;
  const M = p.root.matrixWorld;
  if (a.kind === "vest") return _sm.copy(J.head).applyMatrix4(M);
  _hm.copy(J.lHip).lerp(J.rHip, 0.5);
  _sm.copy(J.lShoulder).lerp(J.rShoulder, 0.5);
  return _sm.lerp(_hm, 0.3).applyMatrix4(M);
}
function vehiclePoint(v) {
  const g = v.g, ud = g.userData;
  if (!ud.aimC) {
    const b = new Box3();
    for (const h of ud.hit || []) b.union(h);
    ud.aimC = b.isEmpty() ? V() : b.getCenter(V());
  }
  return _pt.copy(ud.aimC).applyMatrix4(g.matrixWorld);
}
function friendBox(a) {
  const p = a.p;
  if (!p.J || !p.J.head || !p.root.visible) return null;
  const hd = toPx(_hm.copy(p.J.head).applyMatrix4(p.root.matrixWorld)), ft = toPx(_sm.copy(p.root.position));
  const A0 = hd || ft, B0 = ft || hd;
  if (!A0) return null;
  const h = Math.max(S0 * 0.05, Math.abs(B0.y - A0.y)), w = h * 0.3;
  return { x0: Math.min(A0.x, B0.x) - w, x1: Math.max(A0.x, B0.x) + w, y0: Math.min(A0.y, B0.y) - h * 0.28, y1: Math.max(A0.y, B0.y) + h * 0.04 };
}
function easyAssist(dt) {
  if (S.state !== "play" || BP.mouse) {
    assist.reset();
    S.ezAuto = false;
    S.ezLock = false;
    return;
  }
  const targets = [], friends = [];
  for (const a of actors) {
    if (a.dead) continue;
    if (a.role === "friendly") {
      const b = friendBox(a);
      if (b) friends.push(b);
      if (a.stretcher) {
        const s = toPx(a.stretcher.getWorldPosition(_pt));
        if (s) friends.push({ x0: s.x - S0 * 0.06, x1: s.x + S0 * 0.06, y0: s.y - S0 * 0.04, y1: s.y + S0 * 0.04 });
      }
      continue;
    }
    if (a.role !== "soldier" || a.state === "leave") continue;
    const q = personPoint(a);
    const px = q && toPx(q);
    if (px) targets.push({ id: a.id, x: px.x, y: px.y });
  }
  for (const v of vehicles) if (!v.dead) {
    const px = toPx(vehiclePoint(v));
    if (px) targets.push({ id: v.aid || (v.aid = "v" + Math.random()), x: px.x, y: px.y });
  }
  const live = S.aimLive;
  const r = assist.step({ raw: live ? { x: S.aim.x * W, y: S.aim.y * H } : null, targets, friends, S0, dt, live });
  if (live) {
    S.aim.x = clamp(r.x / W, 0, 1);
    S.aim.y = clamp(r.y / H, 0, 1);
  }
  S.ezLock = r.lock !== null && r.pull > 0.5;
  if (S.frames % 3 === 0 || S.ezRay === void 0) {
    const h = live ? nearestHit(aimRay()) : null;
    S.ezRay = !h ? "none" : h.t === "person" ? h.o.role === "friendly" ? "friend" : "enemy" : h.t === "vehicle" ? "enemy" : h.t === "item" || h.t === "proj" ? "pick" : h.t;
  }
  S.ezClearT = r.nearFriend || S.ezRay === "friend" || !live ? 0 : (S.ezClearT || 0) + dt;
  S.ezAuto = live && S.ezClearT >= 0.15 && (r.fire && S.ezRay === "enemy" || S.ezRay === "pick" && r.pull < 0.2);
  S.firing = S.ezAuto || KEY.fire;
}
function stopFire() {
  if (S.wasFiring) play("uzi_tail", { gain: 0.6, vary: 0.04 });
  S.wasFiring = false;
}
function aimRay(nx = S.aim.x, ny = S.aim.y) {
  ray.setFromCamera(new Vector2(nx * 2 - 1, -ny * 2 + 1), camera);
  return ray.ray;
}
function nearestHit(r, { friendlyOnly = false } = {}) {
  let best = null;
  const take = (d, o) => {
    if (d !== null && d > 0.3 && (!best || d < best.d)) best = Object.assign({ d }, o);
  };
  for (const p of projectiles) if (p.shootable && !p.dead) take(raySphere(r, p.m.position, p.r), { t: "proj", o: p });
  for (const it of items) take(raySphere(r, it.m.position, 0.5), { t: "item", o: it });
  for (const a of actors) if (!a.dead) {
    const h = a.p.hitRay(r);
    if (h) take(h.d, { t: "person", o: a, part: h.part });
  }
  for (const v of vehicles) if (!v.dead) take(vehicleHit(v.g, r), { t: "vehicle", o: v });
  for (const b of birds) if (!b.dead) take(raySphere(r, b.g.position, 0.7), { t: "bird", o: b });
  if (S.world) {
    for (const d of S.world.spots.drums) if (!d.userData.down) take(raySphere(r, d.position.clone().add(V(0, 0.45, 0)), 0.42), { t: "drum", o: d });
  }
  if (friendlyOnly) return best;
  if (S.world) {
    ray.ray.copy(r);
    const hs = ray.intersectObjects(S.world.occluders, false);
    if (hs.length) take(hs[0].distance, { t: "wall", p: hs[0].point });
    const ground = S.world.group.getObjectByName("ground");
    if (ground) {
      const gh = ray.intersectObject(ground, false);
      if (gh.length) take(gh[0].distance, { t: "ground", p: gh[0].point });
    }
  }
  return best;
}
var muzzleW = () => uzi ? uzi.userData.muzzle.getWorldPosition(V()) : camera.position.clone();
function shootRound(n) {
  const r = aimRay(), h = nearestHit(r), m = muzzleW();
  if (S.ezAuto && !KEY.fire && h && h.t === "person" && h.o.role === "friendly") {
    S.ezHeld = (S.ezHeld || 0) + 1;
    return;
  }
  const end = h ? r.at(h.d, V()) : r.at(60, V());
  if (n % 3 === 0) fx.tracer(m.clone().addScaledVector(r.direction, 0.6), end);
  if (!h) return;
  if (h.t === "wall" || h.t === "ground") {
    fx.dust(end, 3, S.world && h.t === "ground" ? 11049080 : 11578016);
    if (h.t === "wall" && Math.random() < 0.4) fx.sparks(end, 3);
    return;
  }
  G.hits++;
  if (h.t === "proj") {
    const p = h.o;
    p.dead = true;
    fx.explosion(p.m.position, p.kind === "knife" ? 0.2 : 0.6);
    freeObject(p.m);
    RU.award(G, p.kind === "knife" ? RU.R.pts.knife : p.kind === "rocket" ? RU.R.pts.rocket : RU.R.pts.shotDown);
    pop(p.m.position, p.kind === "knife" ? "" : "+300");
    if (p.kind !== "knife") play("boom_big", { gain: 0.35, rate: 1.6 });
    return;
  }
  if (h.t === "item") {
    const it = h.o;
    RU.pickup(G, it.kind);
    freeObject(it.m);
    items.splice(items.indexOf(it), 1);
    pop(it.m.position, itemLabel(it.kind), "#9ff4ff");
    play("mag_in", { gain: 0.9 });
    return;
  }
  if (h.t === "bird") {
    const b = h.o;
    b.dead = true;
    fx.dust(b.g.position, 6, 2762274);
    spawnItem(RU.randomItem(G), b.g.position.clone(), false);
    play("click", { gain: 0.5 });
    return;
  }
  if (h.t === "drum") {
    const d = h.o;
    d.userData.down = true;
    d.userData.fall = 0;
    RU.award(G, RU.R.pts.drum);
    pop(d.position.clone().add(V(0, 1, 0)), "+100");
    fx.sparks(end, 6);
    play("bolt", { gain: 0.5, rate: 0.7 });
    return;
  }
  if (h.t === "vehicle") {
    const v = h.o;
    v.hp--;
    fx.sparks(end, 6);
    RU.award(G, RU.R.pts.vehicleHit);
    if (v.hp <= 0) destroyVehicle(v);
    return;
  }
  if (h.t === "person") hitPerson(h.o, h.part, end);
}
function hitPerson(a, part, at, blast2 = false) {
  if (a.role === "friendly") {
    if (a.dead) return;
    a.dead = true;
    a.p.play(Math.random() < 0.5 ? "fallb" : "fallf");
    a.deadT = 0;
    a.p.flash = 0;
    RU.friendlyHit(G, a.kind === "hostage" ? "hostage" : "civilian");
    S.hitFlash = 1;
    banner(a.kind === "hostage" ? "YOU HIT A HOSTAGE" : "DON'T SHOOT CIVILIANS", 1.6, "#ff8a8a");
    if (a.partner && !a.partner.dead) {
      a.partner.state = "flee";
    }
    return;
  }
  if (a.dead) return;
  if (a.kind === "vest" && part !== "head" && !blast2) {
    fx.sparks(at, 4);
    return;
  }
  a.hp--;
  if (a.hp > 0) {
    RU.award(G, RU.R.pts.toughHit);
    pop(at, "+50");
    a.p.play("duck");
    a.state = "stagger";
    a.t = 0;
    return;
  }
  a.dead = true;
  a.deadT = 0;
  a.p.flash = 0;
  a.p.play(Math.random() < 0.55 ? "fallb" : "fallf");
  if (a.spot) a.spot.busy = false;
  if (a.chute) {
    a.chuteFall = true;
  }
  const key = a.kind === "tough" ? "tough" : a.kind === "vest" ? "vest" : a.kind === "para" ? "para" : a.kind === "thrower" ? "thrower" : a.kind === "popper" ? "soldierFar" : "soldier";
  RU.kill(G, "soldier", key);
  S.kills++;
  pop(a.p.headWorld().add(V(0, 0.4, 0)), "+" + RU.R.pts[key]);
  fx.dust(at, 2, 9075306);
}
function destroyVehicle(v, blast2 = false) {
  if (v.dead) return;
  v.dead = true;
  v.deadT = 0;
  const key = v.kind === "heli" ? "heli" : v.kind === "boat" ? "boat" : v.kind === "truck" ? "truck" : "armor";
  RU.kill(G, v.kind, key);
  pop(v.g.position.clone().add(V(0, 2.5, 0)), "+" + RU.R.pts[key], "#ffd84a");
  fx.explosion(v.g.position.clone().add(V(0, 1, 0)), 1.6);
  S.shake = 0.9;
  shake(0.9);
  play("boom_big", { gain: 1, pan: panOf(v.g.position), vary: 0.1 });
  v.g.userData.paint.color.multiplyScalar(0.25);
  if (v.snd) {
    try {
      v.snd.s.stop();
    } catch (_) {
    }
    v.snd = null;
  }
  if (v.kind === "truck" && !blast2) {
  }
}
function throwGrenade() {
  if (S.state !== "play" || !RU.grenade(G)) {
    if (S.state === "play") play("click", { gain: 0.5 });
    return;
  }
  const r = aimRay(), h = nearestHit(r), target = h ? r.at(h.d, V()) : r.at(40, V());
  const m = new Mesh(new CylinderGeometry(0.045, 0.045, 0.3, 10), new MeshStandardMaterial({ color: 4212778, roughness: 0.6 }));
  const from = muzzleW();
  m.position.copy(from);
  scene.add(m);
  projectiles.push({ m, kind: "mine", mine: true, from, to: target, t: 0, dur: clamp(from.distanceTo(target) / 45, 0.2, 0.8), shootable: false, r: 0.2 });
  play("bolt", { gain: 0.9, rate: 0.75 });
  S.uziKick = 1.2;
  banner("GRENADE!", 0.9, "#ffd84a");
}
function blast(p, radius = 4.5) {
  fx.explosion(p, 1.3);
  shake(0.7);
  play("boom_big", { gain: 1, pan: panOf(p) });
  for (const a of actors) {
    if (a.dead) continue;
    a.p.root.updateMatrixWorld(true);
    const c = a.p.root.position;
    if (Math.hypot(c.x - p.x, c.z - p.z) < radius) hitPerson(a, "body", c.clone(), true);
  }
  for (const v of vehicles) if (!v.dead && v.g.position.distanceTo(p) < radius + 3) destroyVehicle(v, true);
  for (const q of projectiles) if (!q.mine && !q.dead && q.m.position.distanceTo(p) < radius) {
    q.dead = true;
    freeObject(q.m);
  }
  for (const b of birds) if (!b.dead && b.g.position.distanceTo(p) < radius) {
    b.dead = true;
    spawnItem(RU.randomItem(G), b.g.position.clone(), false);
  }
}
var pops = [];
function pop(p, text, col = "#ffffff") {
  if (text) pops.push({ p: p.clone(), text, col, t: 0 });
}
function enemyFire(src, kind = "bullet", from) {
  if (kind === "bullet") {
    fx.muzzle(from, 0.5, 16765056);
    play(Math.random() < 0.5 ? "rifle1" : "rifle2", { gain: 0.55 * distGain(from, 10), pan: panOf(from), vary: 0.1 });
    if (S.ducking) {
      S.duckFlash = 0.8;
      return;
    }
    RU.hurt(G, "bullet");
    S.hitFlash = 1;
    play("shot_far1", { gain: 0.35, rate: 1.4 });
    return;
  }
  const geo = kind === "knife" ? new BoxGeometry(0.03, 0.03, 0.28) : kind === "rocket" ? new CylinderGeometry(0.06, 0.06, 0.5, 8) : new SphereGeometry(0.1, 10, 8);
  const m = new Mesh(geo, new MeshStandardMaterial({ color: kind === "knife" ? 13158600 : 3817258, roughness: 0.4, metalness: kind === "knife" ? 0.9 : 0.3 }));
  m.position.copy(from);
  scene.add(m);
  const to = camera.position.clone().add(V(rand(-0.4, 0.4), -0.5, -0.6));
  const dur = kind === "rocket" ? 1.6 : kind === "knife" ? 1.1 : kind === "shell" ? 1.5 : 1.7;
  projectiles.push({ m, kind, from: from.clone(), to, t: 0, dur, shootable: true, r: kind === "knife" ? 0.3 : 0.38, arc: kind === "grenade" || kind === "mortar" ? 3.5 : kind === "knife" ? 0.8 : 0 });
  if (kind === "rocket" || kind === "shell") {
    fx.muzzle(from, 1, 16752720);
    play("boom_big", { gain: 0.3 * distGain(from, 15), rate: 1.8, pan: panOf(from) });
  }
}
var _v = V();
function updateActors(dt) {
  const Wd = S.world;
  for (let i = actors.length - 1; i >= 0; i--) {
    const a = actors[i], p = a.p, r = p.root;
    a.t += dt;
    if (a.dead) {
      a.deadT += dt;
      p.update(dt, 1);
      if (a.chute && a.chuteFall) {
        a.chute.position.y -= dt * 3;
        a.chute.rotation.z += dt;
      }
      if (a.state === "para" && r.position.y > Wd.groundY(r.position.x, r.position.z)) r.position.y = Math.max(Wd.groundY(r.position.x, r.position.z), r.position.y - dt * 7);
      if (a.deadT > 2.4) p.setOpacity(Math.max(0, 1 - (a.deadT - 2.4) / 0.8));
      if (a.deadT > 3.3) {
        p.dispose();
        if (a.chute) freeObject(a.chute);
        if (a.stretcher) freeObject(a.stretcher);
        actors.splice(i, 1);
      }
      continue;
    }
    const onScreen = Math.abs(r.position.x - S.camX) < camHalf(camera.position.z - r.position.z) + 4;
    if (a.role === "soldier") {
      if (a.state === "para") {
        r.position.y -= dt * 2.4;
        a.chute.position.copy(r.position);
        r.position.x += Math.sin(a.t * 0.7) * dt * 0.4;
        const gy = Wd.groundY(r.position.x, r.position.z);
        if (r.position.y <= gy) {
          r.position.y = gy;
          a.state = "aimwait";
          a.t = 0;
          p.play("aimin");
          a.chuteDrop = true;
        }
        p.update(dt, 0.6);
      } else if (a.state === "enter") {
        const dx = a.stopX - r.position.x, sp = p.clip === "crouch" ? 1.6 : clipInfo("run").speed * 0.95;
        r.rotation.y = Math.atan2(Math.sign(dx), 0);
        r.position.x += Math.sign(dx) * sp * dt;
        r.position.y = Wd.groundY(r.position.x, r.position.z);
        p.update(dt, 1);
        if (Math.abs(dx) < 0.3 || Math.sign(dx) !== Math.sign(a.stopX - r.position.x)) {
          a.state = "aimwait";
          a.t = 0;
          p.play("aimin");
        }
      } else if (a.state === "pop") {
        p.update(dt, 1);
        if (a.t > 0.6) {
          a.state = "aimwait";
          a.t = 0;
        }
      } else if (a.state === "stagger") {
        p.update(dt, 1);
        if (a.t > 1) {
          a.state = "aimwait";
          a.t = 0;
          p.play("aimin");
        }
      } else if (a.state === "aimwait" || a.state === "aim") {
        const toCam = Math.atan2(camera.position.x - r.position.x, camera.position.z - r.position.z);
        r.rotation.y += (toCam - r.rotation.y) * Math.min(1, dt * 6);
        if (a.state === "aimwait" && a.t > 0.85) {
          a.state = "aim";
          a.t = 0;
          p.play("aim");
          a.flashAt = rand(1, 2);
        }
        p.update(dt, a.state === "aim" ? 0.5 : 1);
        if (a.state === "aim") {
          p.flash = a.t > a.flashAt && S.state === "play" ? 1 : 0;
          if (a.t > a.flashAt + 1.15 && onScreen && S.state === "play") {
            if (a.kind === "thrower") enemyFire(a, Math.random() < 0.5 ? "grenade" : "knife", p.muzzleWorld());
            else if (G.stage === 3 && a.kind === "popper" && Math.random() < 0.4) enemyFire(a, "mortar", p.muzzleWorld());
            else enemyFire(a, "bullet", p.muzzleWorld());
            a.volleys++;
            p.flash = 0;
            a.t = 0;
            a.flashAt = rand(1.6, 3);
            if (a.volleys >= (a.kind === "popper" ? 3 : 2) && a.kind !== "popper") {
              a.state = "leave";
              p.play("run");
            }
          }
        }
      } else if (a.state === "leave") {
        const sx = -a.side;
        r.rotation.y = Math.atan2(sx, 0);
        r.position.x += sx * clipInfo("run").speed * 0.95 * dt;
        r.position.y = Wd.groundY(r.position.x, r.position.z);
        p.update(dt, 1);
        if (!onScreen && Math.abs(r.position.x - S.camX) > camHalf(camera.position.z - r.position.z) + 6) {
          p.dispose();
          actors.splice(i, 1);
          continue;
        }
      }
      if (a.chute && a.chuteDrop) {
        a.chute.position.y -= dt * 1.5;
        a.chute.scale.multiplyScalar(1 - dt * 0.6);
        if (a.chute.scale.x < 0.1) {
          freeObject(a.chute);
          a.chute = null;
        }
      }
    } else {
      if (a.state === "call") {
        p.update(dt, 1);
        if (a.t > 1.6) {
          a.state = "run";
          p.play("limp");
        }
      } else if (a.state === "run" && a.kind === "hostage") {
        const to = _v.copy(a.goal).sub(r.position);
        to.y = 0;
        const d = to.length(), sp = clipInfo("limp").speed * 1.1;
        r.rotation.y = Math.atan2(to.x, to.z);
        r.position.addScaledVector(to.normalize(), Math.min(d, sp * dt));
        r.position.y = Wd.groundY(r.position.x, r.position.z);
        p.update(dt, 1.1);
        if (d < 1.2 || !onScreen && a.t > 3) {
          RU.hostageOut(G);
          banner("HOSTAGE SAFE", 1.4, "#9ff4ff");
          RU.award(G, 0);
          p.dispose();
          actors.splice(i, 1);
          continue;
        }
      } else {
        const sx = a.state === "flee" ? a.side : -a.side, sp = a.kind === "boy" ? clipInfo("run").speed * 0.7 : clipInfo("walk").speed;
        r.rotation.y = Math.atan2(sx, 0);
        r.position.x += sx * sp * dt * (a.kind === "boy" ? 0.74 : 1);
        r.position.y = Wd.groundY(r.position.x, r.position.z);
        p.update(dt, 1);
        if (a.stretcher && a.partner) {
          const q = a.partner.p.root.position;
          a.stretcher.position.set((r.position.x + q.x) / 2, r.position.y + 0.78, r.position.z);
          a.stretcher.visible = !a.partner.dead;
        }
        if (Math.abs(r.position.x - S.camX) > camHalf(camera.position.z - r.position.z) + 6 && a.t > 2) {
          p.dispose();
          if (a.stretcher) freeObject(a.stretcher);
          actors.splice(i, 1);
          continue;
        }
      }
    }
  }
}
function updateVehicles(dt) {
  for (let i = vehicles.length - 1; i >= 0; i--) {
    const v = vehicles[i], g = v.g;
    v.t += dt;
    const ud = g.userData;
    if (ud.rotor) {
      ud.rotor.rotation.y += dt * 38;
      ud.tail.rotation.z += dt * 60;
    }
    if (ud.radar) ud.radar.rotation.y += dt * 2.5;
    if (ud.flag) ud.flag.rotation.y = Math.sin(v.t * 5) * 0.25;
    if (ud.wake && !v.dead && v.state !== "stop" && fx && Math.random() < dt * 30) {
      const bow = new Vector3(3.8, 0.05, (Math.random() - 0.5) * 1.6).applyMatrix4(g.matrixWorld), st = new Vector3(-4.2, 0.05, (Math.random() - 0.5) * 2).applyMatrix4(g.matrixWorld);
      for (const pp of [bow, st]) fx.sprite(fx.foamM, pp, V(rand(-0.4, 0.4), 0.3, rand(-0.4, 0.4)), 0.5, 3, 1.4, 0.55, 0.3);
    }
    if (ud.wake) g.rotation.z = Math.sin(v.t * 1.7) * 0.02, g.position.y = -0.33 + Math.sin(v.t * 2.3) * 0.03 - (v.dead ? v.deadT * 0.35 : 0);
    for (const w of ud.wheels) w.rotation.z -= dt * (v.state === "stop" || v.dead ? 0 : v.sp / 0.5) * (v.side > 0 ? -1 : 1);
    const depth = camera.position.z - g.position.z, onScreen = Math.abs(g.position.x - S.camX) < camHalf(depth) + 8;
    if (v.snd) {
      v.snd.g.gain.value = (v.kind === "heli" ? 0.7 : 0.4) * distGain(g.position, 14) * (onScreen ? 1 : 0.5);
      if (v.snd.pn) v.snd.pn.pan.value = panOf(g.position);
    }
    if (v.dead) {
      v.deadT += dt;
      if (v.kind === "heli") {
        g.position.y -= dt * (2 + v.deadT * 6);
        g.rotation.z += dt * 0.8;
        g.rotation.y += dt * 2;
        if (g.position.y < 0.5 && !v.boomed) {
          v.boomed = true;
          fx.explosion(g.position.clone(), 1.4);
          play("boom_big", { gain: 0.8, pan: panOf(g.position) });
        }
      }
      if (Math.random() < dt * 8) fx.sprite(fx.smokeM, g.position.clone().add(V(rand(-1, 1), 1.5, 0)), V(rand(-0.3, 0.3), 2, 0), 1.2, 3, 2.5, 0.6, -0.2).sp.material.color.set(2894376);
      if (v.deadT > 6) {
        freeObject(g);
        vehicles.splice(i, 1);
      }
      continue;
    }
    if (v.kind === "heli") g.position.y += Math.sin(v.t * 1.3) * dt * 0.4;
    if (v.state === "enter") {
      const dx = v.stopX - g.position.x;
      g.position.x += Math.sign(dx) * v.sp * dt;
      if (v.kind !== "heli" && v.kind !== "boat") g.position.y = S.world.groundY(g.position.x, g.position.z);
      if (v.kind === "heli") g.rotation.z = -Math.sign(dx) * 0.12 * (g.rotation.y ? -1 : 1);
      if (Math.abs(dx) < 0.4) {
        v.state = v.kind === "truck" ? "pass" : "stop";
        v.t = 0;
        v.fireT = 1.2;
      }
    } else if (v.state === "stop") {
      if (v.kind === "heli") {
        g.rotation.z *= 0.95;
        g.rotation.y += (Math.atan2(camera.position.x - g.position.x, camera.position.z - g.position.z) - Math.PI / 2 - g.rotation.y) * dt * 0.8;
      }
      v.fireT -= dt;
      if (v.fireT <= 0 && onScreen) {
        const m = ud.muzzle ? ud.muzzle.getWorldPosition(V()) : g.position.clone();
        enemyFire(v, v.kind === "heli" ? "rocket" : v.kind === "armor" ? "shell" : "bullet", m);
        v.volleys++;
        v.fireT = rand(2.2, 3.4);
        if (v.volleys >= (v.kind === "heli" ? 3 : 2)) {
          v.state = "leave";
          v.t = 0;
        }
      }
    } else {
      g.position.x -= v.side * v.sp * dt;
      if (v.kind !== "heli" && v.kind !== "boat") g.position.y = S.world.groundY(g.position.x, g.position.z);
      if (v.kind === "heli") {
        g.position.y += dt * 1.2;
        g.rotation.y += (-(v.side > 0 ? Math.PI : 0) - g.rotation.y) * 0;
      }
      if (v.kind === "truck" && v.unload && v.t > 1) {
        v.unload = 0;
        for (let k = 0; k < 2; k++) if ((G.quota.soldier || 0) > 0) spawnSoldier({ kind: "runner", side: -v.side, depth: camera.position.z - g.position.z + 1 });
      }
      if (!onScreen && v.t > 2) {
        if (v.snd) try {
          v.snd.s.stop();
        } catch (_) {
        }
        freeObject(g);
        vehicles.splice(i, 1);
      }
    }
  }
}
function updateProjectiles(dt) {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    if (p.dead) {
      projectiles.splice(i, 1);
      continue;
    }
    p.t += dt;
    const k = Math.min(1, p.t / p.dur);
    p.m.position.lerpVectors(p.from, p.to, k);
    if (p.arc) p.m.position.y += Math.sin(k * Math.PI) * p.arc;
    p.m.rotation.x += dt * (p.kind === "knife" ? 14 : 3);
    if (p.kind === "rocket") {
      p.m.lookAt(p.to);
      p.m.rotateX(Math.PI / 2);
      if (Math.random() < 0.7) fx.sprite(fx.smokeM, p.m.position, V(0, 0.3, 0), 0.25, 3, 0.8, 0.5).sp.material.color.set(9078144);
    }
    if (k >= 1) {
      freeObject(p.m);
      projectiles.splice(i, 1);
      if (p.mine) {
        blast(p.to);
        continue;
      }
      if (S.ducking && p.kind !== "rocket" && p.kind !== "shell") {
        S.duckFlash = 0.8;
        fx.dust(p.m.position, 4);
        continue;
      }
      RU.hurt(G, p.kind === "shell" ? "shell" : p.kind);
      S.hitFlash = 1.2;
      shake(0.5);
      if (p.kind !== "knife") {
        fx.explosion(camera.position.clone().add(V(0, -1.2, -2.5)), 0.5);
        play("boom_big", { gain: 0.6, rate: 1.2 });
      }
    }
  }
}
function updateItems(dt) {
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i];
    it.t += dt;
    if (it.fall) {
      it.vy -= 9 * dt;
      it.m.position.y += it.vy * dt;
      const gy = S.world.groundY(it.m.position.x, it.m.position.z) + 0.25;
      if (it.m.position.y < gy) {
        it.m.position.y = gy;
        it.fall = false;
        it.t = 0;
      }
    }
    it.m.rotation.y += dt * 1.6;
    it.m.userData.glow.material.opacity = 0.45 + 0.4 * Math.sin(it.t * 8);
    if (it.t > it.ttl || Math.abs(it.m.position.x - S.camX) > camHalf(camera.position.z - it.m.position.z) + 3) {
      freeObject(it.m);
      items.splice(i, 1);
    }
  }
  for (let i = birds.length - 1; i >= 0; i--) {
    const b = birds[i];
    b.t += dt;
    if (b.dead) {
      b.vy -= 9 * dt;
      b.g.position.y += b.vy * dt;
      b.g.rotation.z += dt * 4;
      if (b.g.position.y < 0) {
        freeObject(b.g);
        birds.splice(i, 1);
      }
      continue;
    }
    b.g.position.x -= b.side * 4.2 * dt;
    b.g.position.y += Math.sin(b.t * 1.5) * dt * 0.5;
    const f = 0.15 + Math.sin(b.t * 3.2) * 0.32;
    b.g.userData.wings[0].rotation.x = -f;
    b.g.userData.wings[1].rotation.x = f;
    if (Math.abs(b.g.position.x - S.camX) > camHalf(camera.position.z - b.g.position.z) + 6 && b.t > 3) {
      freeObject(b.g);
      birds.splice(i, 1);
    }
  }
  if (S.world) {
    for (const d of S.world.spots.drums) if (d.userData.down && d.userData.fall < 1) {
      d.userData.fall = Math.min(1, d.userData.fall + dt * 3);
      d.rotation.z = d.userData.fall * Math.PI / 2;
      d.position.y = S.world.groundY(d.position.x, d.position.z) + d.userData.fall * 0.3;
    }
  }
}
function runDirector(dt) {
  const live = { soldiers: actors.filter((a) => a.role === "soldier" && !a.dead).length, vehicles: vehicles.filter((v) => !v.dead).length, hostages: actors.filter((a) => a.kind === "hostage" && !a.dead).length };
  for (const c of RU.director(G, D, live, dt)) {
    if (c.t === "soldier") spawnSoldier(c);
    else if (c.t === "vehicle") {
      if (c.kind === "boat" && !S.world.spots.river) continue;
      spawnVehicle(c);
    } else if (c.t === "civilian") spawnCivilian(c);
    else if (c.t === "item") {
      const depth = rand(6, 12);
      spawnItem("mag", V(S.camX + S.dir * rand(0.1, 0.6) * camHalf(depth), 0, camera.position.z - depth).setY(S.world.groundY(S.camX, camera.position.z - depth) + 0.25), true);
    } else if (c.t === "carrier") spawnBird();
    else if (c.t === "hostage") spawnHostage();
  }
}
function placeUzi(dt) {
  if (!uzi) return;
  const show = S.state === "play" || S.state === "brief";
  uzi.visible = show;
  if (!show) {
    if (arms) arms.holder.visible = false;
    return;
  }
  const target = aimRay().at(30, V());
  const base = UI.portrait ? V(0.07, -0.27, -0.52) : V(0.14, -0.15, -0.4);
  uzi.scale.setScalar(1);
  uzi.position.copy(base);
  uzi.position.z += S.uziKick * 0.03;
  uzi.position.y += S.uziKick * 8e-3 + (S.ducking ? -0.02 : 0);
  camera.updateMatrixWorld(true);
  const local = camera.worldToLocal(target.clone());
  uzi.lookAt(camera.localToWorld(local.clone()));
  uzi.rotateX(S.uziKick * 0.06);
  uzi.quaternion.copy(new Quaternion().setFromRotationMatrix(new Matrix4().lookAt(base, local, V(0, 1, 0))));
  uzi.rotateX(S.uziKick * 0.05);
  uzi.rotateZ(-0.12);
  S.uziKick = Math.max(0, S.uziKick - dt * 9);
  if (arms) {
    arms.holder.visible = uzi.visible;
    if (uzi.visible) arms.update(uzi, S.ducking);
  }
  uzi.userData.flash.material.opacity = S.uziKick > 0.6 ? 1 : 0;
  uzi.userData.flash.material.rotation = Math.random() * 6;
  uzi.userData.flash.scale.setScalar(0.022 + Math.random() * 0.016);
}
function cameraRail(dt, t) {
  if (S.state === "play") S.camX += S.dir * S.walkV * dt;
  const duck = S.ducking && S.state === "play" ? 1 : 0;
  S.duckK = lerp(S.duckK || 0, duck, 1 - Math.exp(-dt * 10));
  const bob = S.state === "play" ? Math.sin(t * 6.2) * 0.012 : 0;
  camera.position.set(S.camX, 1.62 - S.duckK * 0.45 + bob, 2);
  camera.rotation.set(-0.03 - S.duckK * 0.02, 0, Math.sin(t * 3.1) * 2e-3 * (S.state === "play" ? 1 : 0));
}
function glass(x, y, w, h, card, a) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, card ? Math.min(w, h) * 0.08 : h / 2);
  ctx.fillStyle = "rgba(10,12,18,".concat(a != null ? a : card ? 0.78 : 0.58, ")");
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = Math.max(1, DPR);
  ctx.stroke();
  ctx.restore();
}
function label(t, x, y, px, col = "#fff", w = 800, align = "center", maxW) {
  ctx.save();
  ctx.font = font(w, px);
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  if (maxW) {
    const tw = ctx.measureText(t).width;
    if (tw > maxW) ctx.font = font(w, px * maxW / tw);
  }
  ctx.fillStyle = col;
  ctx.fillText(t, x, y);
  ctx.restore();
}
function button(id, txt, cx, cy, w, h, now, action, focused, ms = 700, sel = false) {
  const rect = { x: cx - w / 2, y: cy - h / 2, w, h }, hand = BP.handOver(rect, W, H), k = sel ? 0 : BP.dwell(id, hand, now, ms);
  buttons.push({ id, r: rect, action, fill: k });
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y, w, h, h / 2);
  ctx.fillStyle = sel ? "rgba(255,200,90,0.92)" : focused ? "rgba(170,40,24,0.86)" : "rgba(10,12,18,0.72)";
  ctx.fill();
  if (k > 0) {
    ctx.save();
    ctx.clip();
    ctx.fillStyle = "rgba(255,140,90,0.55)";
    ctx.fillRect(rect.x, rect.y, w * k, h);
    ctx.restore();
  }
  ctx.lineWidth = Math.max(1, DPR) * (hand || focused ? 2.5 : 1);
  ctx.strokeStyle = hand || focused ? "#ffb08a" : "rgba(255,255,255,0.25)";
  ctx.stroke();
  ctx.restore();
  label(txt, cx, cy + h * 0.03, Math.max(UI.fs, h * 0.4), sel ? "#1a1206" : "#fff", 900, "center", w * 0.86);
  if (k >= 1) {
    play("click");
    action();
  }
}
function homeButton(now) {
  if (BP.sysMode && BP.sysMode() === "play") return;
  const b = UI.home;
  button("home", "← HOME", b.x + b.w / 2, b.y + b.h / 2, b.w, b.h, now, goHome, false, 1200);
}
function icon(kind, x, y, s, col = "#fff") {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = col;
  ctx.strokeStyle = col;
  ctx.lineWidth = Math.max(1.5, s * 0.08);
  ctx.beginPath();
  if (kind === "soldier") {
    ctx.arc(0, -s * 0.32, s * 0.14, 0, 7);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-s * 0.2, -s * 0.12);
    ctx.lineTo(s * 0.2, -s * 0.12);
    ctx.lineTo(s * 0.14, s * 0.15);
    ctx.lineTo(s * 0.18, s * 0.45);
    ctx.lineTo(s * 0.06, s * 0.45);
    ctx.lineTo(0, s * 0.2);
    ctx.lineTo(-s * 0.06, s * 0.45);
    ctx.lineTo(-s * 0.18, s * 0.45);
    ctx.lineTo(-s * 0.14, s * 0.15);
    ctx.closePath();
    ctx.fill();
  } else if (kind === "heli") {
    ctx.ellipse(0, s * 0.05, s * 0.28, s * 0.15, 0, 0, 7);
    ctx.fill();
    ctx.fillRect(-s * 0.55, 0, s * 0.3, s * 0.06);
    ctx.fillRect(-s * 0.45, -s * 0.2, s * 0.9, s * 0.05);
    ctx.fillRect(-s * 0.02, -s * 0.2, s * 0.04, s * 0.12);
    ctx.fillRect(-s * 0.25, s * 0.25, s * 0.5, s * 0.04);
  } else if (kind === "armor") {
    ctx.fillRect(-s * 0.45, -s * 0.05, s * 0.9, s * 0.25);
    ctx.fillRect(-s * 0.15, -s * 0.22, s * 0.32, s * 0.18);
    ctx.fillRect(s * 0.15, -s * 0.16, s * 0.35, s * 0.05);
    for (const xx of [-0.3, 0, 0.3]) {
      ctx.beginPath();
      ctx.arc(xx * s, s * 0.25, s * 0.1, 0, 7);
      ctx.fill();
    }
  } else if (kind === "boat") {
    ctx.moveTo(-s * 0.5, 0);
    ctx.lineTo(s * 0.5, 0);
    ctx.lineTo(s * 0.3, s * 0.2);
    ctx.lineTo(-s * 0.4, s * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(-s * 0.2, -s * 0.2, s * 0.25, s * 0.2);
  } else if (kind === "mag") {
    ctx.save();
    ctx.rotate(0.15);
    ctx.fillRect(-s * 0.1, -s * 0.38, s * 0.2, s * 0.76);
    ctx.restore();
  } else if (kind === "grenade") {
    ctx.save();
    ctx.rotate(-0.6);
    ctx.fillRect(-s * 0.08, -s * 0.3, s * 0.16, s * 0.48);
    ctx.beginPath();
    ctx.moveTo(-s * 0.08, -s * 0.3);
    ctx.lineTo(0, -s * 0.48);
    ctx.lineTo(s * 0.08, -s * 0.3);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}
function panelRect() {
  const p = UI.portrait, m = Math.max(8 * DPR, S0 * 0.018);
  if (p) {
    const h = Math.max(70 * DPR, H * 0.11);
    return { x: m, y: H - h - m, w: W - 2 * m, h, row: true };
  }
  const w = Math.max(132 * DPR, S0 * 0.16), top = UI.T + Math.max(76, 11 * Math.min(innerWidth, innerHeight) / 100) * DPR + m;
  const fs = Math.max(UI.fs * 1.05, S0 * 0.028), nk = Object.keys(G.quota || {}).length;
  return { x: W - w - m, y: top, w, h: Math.min(H - top - m, w * 0.14 + fs * (1.1 + nk * 1.55 + 0.2 + 0.75 + 0.7 + 0.9 + 0.95 + 1 + 1.2)), row: false };
}
function drawPanel() {
  const P = panelRect();
  glass(P.x, P.y, P.w, P.h, true, 0.5);
  const q = G.quota || {}, kinds = ["soldier", "heli", "armor", "boat"].filter((k) => q[k] !== void 0);
  const fs = Math.max(UI.fs * 1.05, S0 * 0.028);
  if (!P.row) {
    let y = P.y + P.w * 0.14;
    const ix = P.x + P.w * 0.26, tx = P.x + P.w * 0.84;
    label("ENEMY", P.x + P.w / 2, y, fs * 0.62, "rgba(255,220,200,0.85)", 800);
    y += fs * 1.1;
    for (const k2 of kinds) {
      icon(k2, ix, y, fs * 1.4, q[k2] > 0 ? "#e8e4dc" : "#6a6a6a");
      label(String(Math.max(0, q[k2])), tx, y, fs, q[k2] > 0 ? "#fff" : "#7a7a7a", 900, "right");
      y += fs * 1.55;
    }
    y += fs * 0.2;
    label("DAMAGE", P.x + P.w / 2, y, fs * 0.62, "rgba(255,220,200,0.85)", 800);
    y += fs * 0.75;
    const bw = P.w * 0.76, bh = fs * 0.7, bx = P.x + (P.w - bw) / 2, k = clamp(G.damage / RU.R.damageMax, 0, 1);
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(bx, y, bw, bh);
    ctx.fillStyle = k > 0.75 ? Math.sin(performance.now() / 120) > 0 ? "#ff3b30" : "#a01810" : k > 0.5 ? "#ff8a30" : "#e8c040";
    ctx.fillRect(bx, y, bw * k, bh);
    y += bh + fs * 0.9;
    icon("mag", ix, y, fs * 1.3, G.mags > 0 || G.rounds > 0 ? "#e8d090" : "#ff6a5a");
    label("× " + G.mags, tx, y, fs, "#fff", 900, "right");
    y += fs * 0.95;
    const rb = P.w * 0.76;
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(P.x + (P.w - rb) / 2, y, rb, fs * 0.32);
    ctx.fillStyle = G.superT > 0 ? "#ff7a3a" : "#e8d090";
    ctx.fillRect(P.x + (P.w - rb) / 2, y, rb * (G.superT > 0 ? G.superT / RU.R.superSecs : G.rounds / RU.R.magRounds), fs * 0.32);
    y += fs * 1;
    icon("grenade", ix, y, fs * 1.3, "#a8d870");
    label("× " + G.grenades, tx, y, fs, "#fff", 900, "right");
  } else {
    const cols = kinds.length + 3, cw = P.w / cols, cy = P.y + P.h * 0.36, fy = P.y + P.h * 0.76, f2 = Math.min(Math.max(fs, UI.fs * 1.35), P.h * 0.27);
    kinds.forEach((k2, i2) => {
      icon(k2, P.x + cw * (i2 + 0.5), cy, f2 * 1.4, q[k2] > 0 ? "#e8e4dc" : "#6a6a6a");
      label(String(Math.max(0, q[k2])), P.x + cw * (i2 + 0.5), fy, f2, "#fff", 900);
    });
    let i = kinds.length;
    const bx = P.x + cw * i + cw * 0.12, bw = cw * 0.76, k = clamp(G.damage / RU.R.damageMax, 0, 1);
    label("DAMAGE", P.x + cw * (i + 0.5), cy - f2 * 0.2, f2 * 0.6, "rgba(255,220,200,0.85)");
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(bx, fy - f2 * 0.3, bw, f2 * 0.6);
    ctx.fillStyle = k > 0.75 ? "#ff3b30" : "#e8c040";
    ctx.fillRect(bx, fy - f2 * 0.3, bw * k, f2 * 0.6);
    i++;
    icon("mag", P.x + cw * (i + 0.5), cy, f2 * 1.3, "#e8d090");
    label("× " + G.mags, P.x + cw * (i + 0.5), fy, f2, "#fff", 900);
    i++;
    icon("grenade", P.x + cw * (i + 0.5), cy, f2 * 1.3, "#a8d870");
    label("× " + G.grenades, P.x + cw * (i + 0.5), fy, f2, "#fff", 900);
  }
}
function drawCrosshair(now) {
  if (!S.aimLive && !BP.mouse) return;
  const x = S.aim.x * W, y = S.aim.y * H, r = S0 * 0.034;
  const over = S.overFriendly || EASY() && assist.state.nearFriend && S.state === "play", col = over ? "#ff3b30" : S.firing ? "#ffd27a" : "#ffffff";
  ctx.save();
  ctx.translate(x, y);
  ctx.shadowColor = "rgba(0,0,0,0.8)";
  ctx.shadowBlur = 4 * DPR;
  ctx.strokeStyle = col;
  ctx.lineWidth = Math.max(2, S0 * 4e-3);
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, 7);
  ctx.stroke();
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * r * 0.45, Math.sin(a) * r * 0.45);
    ctx.lineTo(Math.cos(a) * r * 1.45, Math.sin(a) * r * 1.45);
    ctx.stroke();
  }
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.arc(0, 0, Math.max(2, S0 * 4e-3), 0, 7);
  ctx.fill();
  if (S.ezLock && !over) {
    const q = r * 1.75, e = r * 0.55;
    ctx.strokeStyle = "#ff7a4a";
    ctx.lineWidth = Math.max(2, S0 * 5e-3);
    ctx.beginPath();
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      ctx.moveTo(sx * q, sy * (q - e));
      ctx.lineTo(sx * q, sy * q);
      ctx.lineTo(sx * (q - e), sy * q);
    }
    ctx.stroke();
  }
  if (over) {
    const fs = Math.max(UI.fs, S0 * 0.03);
    ctx.font = font(900, fs);
    const tw = ctx.measureText("DON'T SHOOT").width + fs;
    ctx.fillStyle = "rgba(70,0,0,0.78)";
    ctx.beginPath();
    ctx.roundRect(-tw / 2, -r * 2.4 - fs * 0.7, tw, fs * 1.4, fs * 0.7);
    ctx.fill();
    ctx.fillStyle = "#ffd0d0";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("DON'T SHOOT", 0, -r * 2.4);
  }
  ctx.restore();
}
function drawScorePill() {
  const fs = Math.max(UI.fs * (UI.portrait ? 1.35 : 1.1), S0 * 0.032), t = "".concat(G.score.toLocaleString()), sub = "MISSION ".concat(G.stage + 1);
  ctx.font = font(900, fs);
  const w = ctx.measureText(t).width + fs * 5.2, h = fs * 1.6, x = W / 2 - w / 2, y = UI.T;
  glass(x, y, w, h);
  label(sub, x + fs * 2.2, y + h / 2, fs * 0.55, "rgba(255,220,200,0.9)", 800);
  label(t, x + w - fs * 0.8, y + h / 2, fs, "#fff", 900, "right");
}
function drawPops(dt) {
  for (let i = pops.length - 1; i >= 0; i--) {
    const p = pops[i];
    p.t += dt;
    if (p.t > 1.1) {
      pops.splice(i, 1);
      continue;
    }
    const v = p.p.clone().add(V(0, p.t * 0.8, 0)).project(camera);
    if (v.z > 1) continue;
    label(p.text, (v.x + 1) / 2 * W, (1 - v.y) / 2 * H, Math.max(UI.fs, S0 * 0.03), p.col, 900);
  }
  for (const it of items) {
    const v = it.m.position.clone().add(V(0, 0.55, 0)).project(camera);
    if (v.z > 1 || Math.abs(v.x) > 1) continue;
    const fs = Math.max(UI.fs * 0.85, S0 * 0.022), t = itemLabel(it.kind);
    ctx.font = font(900, fs);
    const tw = ctx.measureText(t).width + fs, x = (v.x + 1) / 2 * W, y = (1 - v.y) / 2 * H;
    if (Math.sin(it.t * 8) > -0.3) {
      glass(x - tw / 2, y - fs * 0.75, tw, fs * 1.5, false, 0.6);
      label(t, x, y, fs, "#ffe8a0", 900);
    }
  }
}
function drawEdgeFlash(dt) {
  S.hitFlash = Math.max(0, S.hitFlash - dt * 3);
  if (S.hitFlash <= 0) return;
  const k = Math.min(1, S.hitFlash), e = S0 * 0.035;
  for (const [x, y, w, h, x1, y1] of [[0, 0, W, e, 0, e], [0, H - e, W, e, 0, H - e], [0, 0, e, H, e, 0], [W - e, 0, e, H, W - e, 0]]) {
    const g = ctx.createLinearGradient(x === W - e ? W : x, y === H - e ? H : y, x1, y1);
    g.addColorStop(0, "rgba(230,20,10,".concat(0.38 * k, ")"));
    g.addColorStop(1, "rgba(230,20,10,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, h);
  }
}
function drawPrompt(now, dt) {
  let msg = null;
  if (S.state === "play") {
    if (S.duckFlash > 0) msg = "DODGED!";
    else if (G.rounds <= 0 && G.mags <= 0 && G.superT <= 0) msg = "Out of magazines! Shoot the ammo";
    else if (EASY() && BP.live && !BP.mouse && S.gripSeen && !S.aimLive && S.noGripT > 2.5) msg = "Point one hand to aim";
    else if (!EASY() && BP.live && !BP.mouse && S.gripSeen && !S.firing && S.noGripT > 2.5) msg = "Hands together to fire";
  }
  S.duckFlash = Math.max(0, S.duckFlash - dt);
  if (!msg) return;
  const fs = Math.max(UI.fs * 1.15, S0 * 0.032);
  ctx.font = font(800, fs);
  const tw = ctx.measureText(msg).width + fs * 1.6, h = fs * 1.7;
  const P = panelRect(), y = P.row ? P.y - h - S0 * 0.02 : H - h - S0 * 0.04;
  glass(W / 2 - tw / 2, y, tw, h);
  label(msg, W / 2, y + h / 2, fs, msg === "DODGED!" ? "#9ff4ff" : "#ffe0a8");
}
function drawBanner(dt) {
  if (!S.msg) return;
  S.msgT -= dt;
  if (S.msgT <= 0) {
    S.msg = null;
    return;
  }
  const fs = Math.max(UI.fs * 1.6, S0 * 0.06);
  ctx.font = font(900, fs);
  const tw = ctx.measureText(S.msg.text).width + fs * 1.4, h = fs * 1.5, y = H * (UI.portrait ? 0.22 : 0.17);
  ctx.save();
  ctx.globalAlpha = Math.min(1, S.msgT * 3);
  glass(W / 2 - tw / 2, y, tw, h);
  label(S.msg.text, W / 2, y + h / 2, fs, S.msg.col, 900, "center", W * 0.9);
  ctx.restore();
}
function cardLines(lines, top, now) {
  const pw = Math.min(W * 0.9, Math.max(S0 * 0.9, W * 0.48)), pad = S0 * 0.035;
  let h = pad * 2;
  for (const l of lines) h += l[1] * 1.45;
  const x = W / 2 - pw / 2;
  glass(x, top, pw, h, true);
  let y = top + pad;
  for (const l of lines) {
    label(l[0], W / 2, y + l[1] * 0.72, l[1], l[2] || "#fff", l[3] || 800, "center", pw - pad * 2);
    y += l[1] * 1.45;
  }
  return { x, y: top, w: pw, h };
}
function drawBrief(now) {
  const St = RU.STAGES[G.stage], f = Math.max(UI.fs * (UI.portrait ? 1.25 : 1), S0 * 0.03);
  const live = BP.live && !BP.mouse;
  const lines = [
    ["MISSION ".concat(G.stage + 1), f * 0.9, "rgba(255,200,180,0.9)"],
    [St.name, f * 2.1, "#ffffff", 900],
    [St.brief, f * 0.95, "rgba(255,255,255,0.85)", 600],
    ["Begin with ".concat(G.mags, " magazines and ").concat(G.grenades, " grenades"), f * 0.9, "#ffd27a", 700]
  ];
  if (EASY()) {
    lines.push(["Point one hand to aim: it locks on and fires by itself", f * 0.9, "#ffffff", 700], ["Squat to dodge. Push both hands forward = grenade", f * 0.9, "#ffffff", 700]);
    if (live) lines.push([S.gripSeen ? "Point at the middle of the screen and hold" : "Point one hand out in front", f * 1, "#9ff4ff", 800]);
  } else if (live) lines.push([S.gripSeen ? "Hold your grip on the middle of the screen" : "Hands together, out in front", f * 1, "#9ff4ff", 800]);
  cardLines(lines, H * (UI.portrait ? 0.16 : 0.14), now);
  if (live && S.ready > 0) {
    const k = clamp(S.ready, 0, 1);
    ctx.strokeStyle = "#9ff4ff";
    ctx.lineWidth = 6 * DPR;
    ctx.beginPath();
    ctx.arc(W / 2, H * 0.62, S0 * 0.06, -Math.PI / 2, -Math.PI / 2 + k * Math.PI * 2);
    ctx.stroke();
  }
}
function drawClear(now) {
  const T = S.tally, St = RU.STAGES[T.mission], f = Math.max(UI.fs * (UI.portrait ? 1.25 : 1), S0 * 0.03);
  const lines = [["MISSION CLEAR", f * 2, "#ffd84a", 900], [St.name, f * 1, "#ffffff", 700]];
  if (St.hostages || St.escort) lines.push(["Hostages rescued: ".concat(T.hostages), f * 1.1, "#9ff4ff", 800], ["Bonus +".concat(T.bonus.toLocaleString()), f * 1, "#ffffff", 700]);
  lines.push(["Damage repaired", f * 0.85, "rgba(255,255,255,0.75)", 600]);
  if (S.loadingNext !== null) lines.push(["Next: ".concat(RU.STAGES[S.loadingNext].name), f * 0.95, "rgba(255,220,200,0.9)", 700]);
  cardLines(lines, H * 0.18, now);
}
function drawTitle(now) {
  const bh = Math.min(S0 * 0.11, H * 0.09), bw = Math.max(bh * 3.6, S0 * 0.42);
  button("start", "START", W / 2, H * 0.85, bw, bh, now, () => newGame(), true);
  const startTop = H * 0.85 - bh / 2, band = startTop - H * 0.7, th = Math.min(bh * 0.85, band * 0.62), gap = Math.max(th * 0.35, 10 * DPR);
  const tw = Math.min(W * 0.86, Math.max(bw * 1.45, th * 7.5)), pw = (tw - gap) / 2, cy = H * 0.7 + band * 0.48;
  for (const [m, txt, cx] of [["easy", "EASY", W / 2 - gap / 2 - pw / 2], ["arcade", "ARCADE", W / 2 + gap / 2 + pw / 2]])
    button("mode_" + m, txt, cx, cy, pw, th, now, () => setMode(m), false, 700, MODE === m);
  homeButton(now);
}
function drawEnd(now) {
  if (BP.highScores && BP.highScores.active) {
    homeButton(now);
    return;
  }
  const L = BP.layout.end(W, H, { cy: H * 0.74 }), Ag = L.again, Hm = L.home, f = Math.max(UI.fs * (UI.portrait ? 1.25 : 1), S0 * 0.03);
  const resc = G.rescued || 0;
  const lines = S.won ? [["MISSION COMPLETE", f * 1.6, "#ffd84a", 900], [resc >= 5 ? "Every hostage is home" : resc > 0 ? "".concat(resc, " of 5 hostages made it out") : "No hostage made it out", f, "#9ff4ff", 800]] : [["GAME OVER", f * 1.6, "#ff8a7a", 900], ["Mission ".concat(G.stage + 1, ": ").concat(RU.STAGES[G.stage].name), f * 0.95, "#ffffff", 700]];
  lines.push(["SCORE", f * 0.8, "rgba(255,220,200,0.9)", 800], [G.score.toLocaleString(), f * 2.4, "#ffffff", 900]);
  cardLines(lines, H * 0.12, now);
  if (now - S.endAt > 500) {
    button("again", S.won ? "PLAY AGAIN" : "CONTINUE", Ag.x + Ag.w / 2, Ag.y + Ag.h / 2, Ag.w, Ag.h, now, () => S.won ? newGame() : continueMission(), S.focus === 0);
    button("endhome", "HOME", Hm.x + Hm.w / 2, Hm.y + Hm.h / 2, Hm.w, Hm.h, now, goHome, S.focus === 1, BP.LEAVE_MS);
  } else homeButton(now);
}
var lastT = 0;
var PROF = Q.has("prof");
var PT = {};
var pmark = (k) => {
  if (PROF) PT[k] = performance.now();
};
function frame(now) {
  pmark("a");
  requestAnimationFrame(frame);
  BP.update(now);
  const dt = Math.min(0.05, (now - (lastT || now)) / 1e3);
  lastT = now;
  S.t += dt;
  S.frames++;
  readInput(dt, now);
  if (S.state === "brief") {
    S.stageT += dt;
    const live = BP.live && !BP.mouse;
    if (live) {
      if (grip.ready(dt)) {
        play("mag_in", { gain: 0.6 });
        S.readyDone = true;
      }
      S.ready = clamp(grip.state.hold, 0, 1);
    }
    const el = (now - S.briefAt) / 1e3;
    if (el > 2.6 && (!live || S.readyDone || el > 6)) {
      S.readyDone = false;
      beginPlay();
    }
  }
  if (S.state === "play") {
    S.stageT += dt;
    RU.tick(G, dt);
    if (S.firing && !S.wasFiring) RU.trigger(G);
    const n = RU.fire(G, dt, S.firing);
    for (let k = 0; k < n; k++) {
      shootRound(G.shots);
      const dry = G.rounds <= 0 && G.mags <= 0 && G.superT <= 0;
      play(["uzi_shot1", "uzi_shot2", "uzi_shot3"][Math.floor(Math.random() * 3)], { gain: dry ? 0.5 : 0.75, vary: 0.07, at: k * 0.02 });
      S.uziKick = 1;
      if (fx) fx.light(muzzleW(), 16756832, 6, 0.05);
    }
    if (S.wasFiring && !S.firing) stopFire();
    S.wasFiring = S.firing;
    S.noGripT = S.firing ? 0 : S.noGripT + dt;
    if (S.frames % 3 === 0) {
      S.overFriendly = false;
      const h = nearestHit(aimRay(), { friendlyOnly: true });
      if (h && h.t === "person" && h.o.role === "friendly" && !h.o.dead) S.overFriendly = true;
    }
    for (const ev of G.events.splice(0)) {
      if (ev.t === "reload") play("mag_in", { gain: 0.7 });
      if (ev.t === "dead") {
      }
    }
    pmark("b");
    runDirector(dt);
    pmark("c");
    updateActors(dt);
    pmark("d");
    updateVehicles(dt);
    updateProjectiles(dt);
    updateItems(dt);
    pmark("e");
    if (G.over) gameOver(false);
    else if (G.clear && !actors.some((a) => a.kind === "hostage" && !a.dead) && G.hostagesHeld <= 0) missionClear();
    else if (G.clear && G.hostagesHeld > 0) {
      D.nextHostage = Math.min(D.nextHostage || 0, (D.t || 0) + 2);
      const live = { soldiers: 0, vehicles: 1, hostages: actors.filter((a) => a.kind === "hostage" && !a.dead).length };
      D.t = (D.t || 0) + dt;
      if (live.hostages === 0 && D.t >= D.nextHostage) {
        G.hostagesHeld--;
        spawnHostage();
        D.nextHostage = D.t + 6;
      }
    }
  } else if (S.state === "clear") {
    updateActors(dt);
    updateVehicles(dt);
    updateProjectiles(dt);
    updateItems(dt);
    if (now - S.endAt > 4800 && !S.switching) {
      S.switching = true;
      if (S.loadingNext === null) {
        S.switching = false;
        G.events.length = 0;
        gameOver(true);
      } else startMission(S.loadingNext).then(() => {
        S.switching = false;
      });
    }
  } else if (S.state === "title" || S.state === "end") {
    updateActors(dt);
    updateVehicles(dt);
    updateItems(dt);
    if (S.state === "title") S.camX += dt * 0.35;
  }
  if (S.world) S.world.update(dt, S.camX, S.t);
  cameraRail(dt, S.t);
  placeUzi(dt);
  if (fx) fx.update(dt);
  if (bokeh && S.frames % 6 === 0) {
    const h = nearestHit(aimRay());
    bokeh.uniforms.focus.value = lerp(bokeh.uniforms.focus.value, h ? clamp(h.d, 5, 40) : 18, 1 - Math.exp(-dt * 24));
  }
  pmark("f");
  if (S.state !== "loading") render(dt);
  pmark("g");
  if (S.state === "play") S.playedT = (S.playedT || 0) + dt;
  S.fpsWin = S.fpsWin || [];
  S.fpsWin.push(now);
  while (S.fpsWin.length && now - S.fpsWin[0] > 2e3) S.fpsWin.shift();
  const struggling = S.fpsWin.length < 64 && now - (S.firstFrame || now) > 5e3;
  if (now - (S.firstFrame || (S.firstFrame = now)) < 3e3 || Q.has("lockq") || now < (S.holdQ || 0) || S.state === "loading" || S.state === "brief" || (S.playedT || 0) > 25 && !struggling) {
    const q = state().quality;
    q.t0 = now;
    q.frames = 0;
  }
  ctx.clearRect(0, 0, W, H);
  buttons = [];
  if (S.state === "play" || S.state === "brief") {
    drawScorePill();
    drawPanel();
    drawPops(dt);
    drawCrosshair(now);
    drawEdgeFlash(dt);
    drawBanner(dt);
    drawPrompt(now, dt);
    if (S.state === "brief") drawBrief(now);
  } else if (S.state === "clear") {
    drawScorePill();
    drawPanel();
    drawPops(dt);
    drawClear(now);
  } else if (S.state === "title") drawTitle(now);
  else if (S.state === "end") drawEnd(now);
  else if (S.state === "loading") {
    const f = Math.max(UI.fs, S0 * 0.03);
    glass(W / 2 - S0 * 0.2, H * 0.45, S0 * 0.4, f * 2);
    label("Loading…", W / 2, H * 0.45 + f, f, "#fff", 800);
  }
  if (S.state !== "play") BP.drawHands && BP.drawHands(ctx, W, H);
  publish();
  if (PROF) {
    const T = performance.now() - PT.a;
    if (T > 30) (G0.slow || (G0.slow = [])).push({ T: +T.toFixed(0), fire: +((PT.b || PT.a) - PT.a).toFixed(0), director: +((PT.c || 0) - (PT.b || 0)).toFixed(0), actors: +((PT.d || 0) - (PT.c || 0)).toFixed(0), rest: +((PT.e || 0) - (PT.d || 0)).toFixed(0), render: +(PT.g - PT.f).toFixed(0), st: S.state });
  }
}
function publish() {
  Object.assign(G0, {
    state: S.state,
    score: G.score,
    stage: G.stage,
    mission: RU.STAGES[G.stage] && RU.STAGES[G.stage].id,
    damage: G.damage,
    mags: G.mags,
    rounds: G.rounds,
    grenades: G.grenades,
    kills: G.kills,
    shots: G.shots,
    hits: G.hits,
    firing: S.firing,
    ducking: S.ducking,
    aimX: +S.aim.x.toFixed(3),
    aimY: +S.aim.y.toFixed(3),
    grip: !!grip.state.joined,
    grenadesThrown: grip.state.grenades,
    soldiersLeft: G.quota ? G.quota.soldier : null,
    actors: actors.length,
    vehicles: vehicles.length,
    errors: errors.length,
    frames: S.frames,
    fps: state().quality.fps,
    tier: tier(),
    play: MODE,
    lock: !!S.ezLock,
    autoFire: !!S.ezAuto,
    nearFriend: !!assist.state.nearFriend,
    friendlyHits: G.friendlyHits,
    heldRounds: S.ezHeld || 0,
    aimHand: grip.state.eHand
  });
}
G0.api = {
  G: () => G,
  S,
  RU,
  grip,
  arms: () => arms,
  actors,
  vehicles,
  items,
  projectiles,
  start: () => newGame(),
  mission: (i) => {
    audioInit();
    newCampaign();
    return startMission(i);
  },
  spawn: (c) => {
    if (c.t === "soldier") return spawnSoldier(c);
    if (c.t === "vehicle") return spawnVehicle(c);
    if (c.t === "civilian") return spawnCivilian(c);
    if (c.t === "hostage") return spawnHostage();
    if (c.t === "bird") return spawnBird();
    if (c.t === "item") return spawnItem(c.item || "mag", c.p, true);
  },
  mode: () => MODE,
  setMode,
  assist,
  aim: (x, y) => {
    S.aim.x = x;
    S.aim.y = y;
  },
  fire: (on) => {
    mouse = { x: S.aim.x, y: S.aim.y, at: performance.now() };
    mouseDown = on;
  },
  grenade: () => throwGrenade(),
  camera,
  scene,
  renderer,
  R: realism_exports
};
G0.endNow = () => {
  if (S.state === "play") {
    G.damage = RU.R.damageMax;
    G.over = true;
  }
};
(async () => {
  BP.pauseHold = 3;
  BP.pointerFor = (side) => S.state === "play" && side === "right" && S.aimLive ? { x: S.aim.x, y: S.aim.y } : null;
  await loadMocap();
  await loadPeople(tier());
  fx = new FX(scene);
  uzi = makeUzi();
  camera.add(uzi);
  uzi.visible = false;
  arms = makeViewArms(camera, RU.STAGES[0].uniform);
  const St = await loadMission(0);
  void St;
  G.stage = 0;
  G.quota = Object.assign({}, RU.STAGES[0].quota);
  addBokeh();
  S.state = "title";
  S.best = BP.best(GAME);
  BP.start();
  G0.ready = true;
  if (TV) setTimeout(() => {
    if (S.state === "title") newGame();
  }, 2500);
  requestAnimationFrame(frame);
  setTimeout(() => {
    if (S.state === "title") {
      spawnSoldier({ kind: "runner", side: 1, depth: 16 });
    }
  }, 600);
})().catch((e) => {
  errors.push(String(e && e.message || e));
  console.error(e);
});
