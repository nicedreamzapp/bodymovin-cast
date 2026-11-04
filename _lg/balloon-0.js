import {
  environment,
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
  BufferGeometry,
  CanvasTexture,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  DynamicDrawUsage,
  Euler,
  Float32BufferAttribute,
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
  NeutralToneMapping,
  Object3D,
  Plane,
  PlaneGeometry,
  PointLight,
  Quaternion,
  Raycaster,
  SRGBColorSpace,
  Shape,
  ShapeGeometry,
  SpotLight,
  Sprite,
  SpriteMaterial,
  Vector2,
  Vector3,
  three_module_exports
} from "./chunk-4IYDSAYK.js";
import "./chunk-NWIHTO7D.js";

// bmpage:bmpage:balloon.html#0
(async () => {
  const BP = window.BodyMovin;
  const Q = new URLSearchParams(location.search);
  const GAME_ID = "balloon", ROUND = Q.has("round") ? +Q.get("round") : 75;
  const lerp = (a, b, t) => a + (b - a) * t, clamp = (v, a, b) => Math.max(a, Math.min(b, v)), rand = (a, b) => a + Math.random() * (b - a);
  const RR = setup(document.getElementById("gl"), { fov: 50, far: 1200, tier: Q.has("tier") ? +Q.get("tier") : void 0 });
  const { renderer, scene, camera } = RR;
  const BG_ROT = Q.has("rot") ? parseFloat(Q.get("rot")) : 1.5708;
  const envTex = await environment(scene, renderer, "circus_arena", { background: true, intensity: 1.1, rotation: BG_ROT, exact: !Q.has("noexact") });
  {
    const sky = scene.getObjectByName("photoSky");
    if (sky) {
      const gr = (Q.get("grade") || "1,0.9,0.78").split(",").map(Number);
      sky.material.color.setRGB(gr[0], gr[1], gr[2], SRGBColorSpace);
    }
  }
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = Q.has("exp") ? parseFloat(Q.get("exp")) : 0.95;
  const CAM = new Vector3(0, 1.65, 3.9), LOOK = new Vector3(0, 1.5, 0);
  const FLOOR = 0, CEIL = 2.88, BR = 0.3;
  let HALF_W = 3;
  const spot = new SpotLight(16773858, Q.has("spot") ? +Q.get("spot") : 300, 0, 0.64, 0.6, 2);
  spot.position.set(0.4, 7.6, 0.4);
  spot.target.position.set(0, 0, -1.5);
  spot.castShadow = true;
  spot.shadow.mapSize.set(1024, 1024);
  spot.shadow.intensity = 0.45;
  spot.shadow.bias = -4e-4;
  spot.shadow.normalBias = 0.02;
  spot.shadow.radius = 6;
  spot.shadow.camera.near = 2;
  spot.shadow.camera.far = 14;
  scene.add(spot, spot.target);
  const rim = new DirectionalLight(12578559, 0.15);
  const bounce = new PointLight(16743002, 6, 10);
  bounce.position.set(0, 0.6, 3.2);
  scene.add(bounce);
  const foh = new DirectionalLight(16773346, 1.3);
  foh.position.set(0.6, 3.2, 6);
  scene.add(foh);
  const STAGE_R = 4.4, STAGE_Z = -1.1;
  const ownEnv = (m, k) => {
    m.envMap = envTex;
    m.envMapRotation = new Euler(0, BG_ROT, 0);
    m.envMapIntensity = k;
    return m;
  };
  const stageTop = ownEnv(pbr("wood_floor", { repeat: [5.2, 5.2] }), 0.16);
  stageTop.color = new Color(15258300);
  const stageSide = new MeshStandardMaterial({ color: 1707016, roughness: 0.9 });
  const stage = new Mesh(new CylinderGeometry(STAGE_R, STAGE_R, 0.5, 128), [stageSide, stageTop, stageSide]);
  stage.geometry.setAttribute("uv1", stage.geometry.attributes.uv);
  stage.position.set(0, FLOOR - 0.25, STAGE_Z);
  stage.receiveShadow = true;
  scene.add(stage);
  {
    const cp = [[0, 0], [0.2, 0], [0.24, 0.05], [0.26, 0.17], [0.24, 0.27], [0.17, 0.32], [0.08, 0.32], [0.02, 0.28], [0, 0.2], [0, 0]].map(([r, y]) => new Vector2(STAGE_R - 0.24 + r, y));
    const curbGeo = new LatheGeometry(cp, 192);
    curbGeo.setAttribute("uv1", curbGeo.attributes.uv);
    const leather = ownEnv(pbr("leather_red_02", { repeat: [60, 1] }), 0.45);
    leather.map = null;
    leather.color = new Color(9049616);
    const curb = new Mesh(curbGeo, leather);
    curb.position.set(0, FLOOR, STAGE_Z);
    curb.receiveShadow = true;
    scene.add(curb);
    const brass = new Mesh(new CylinderGeometry(STAGE_R + 0.025, STAGE_R + 0.025, 0.035, 192, 1, true), new MeshStandardMaterial({ color: 13213776, metalness: 1, roughness: 0.35 }));
    brass.position.set(0, FLOOR + 0.03, STAGE_Z);
    scene.add(brass);
  }
  const blobTex = canvasTex(128, 128, (g, w) => {
    const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    gr.addColorStop(0, "rgba(255,255,255,0.85)");
    gr.addColorStop(0.45, "rgba(255,255,255,0.4)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, w);
  });
  const blobGeo = new PlaneGeometry(1, 1);
  blobGeo.rotateX(-Math.PI / 2);
  function canvasTex(w, h, draw) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d"), w, h);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  }
  const glowTex = canvasTex(128, 128, (g, w) => {
    const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    gr.addColorStop(0, "rgba(255,255,255,1)");
    gr.addColorStop(0.3, "rgba(255,255,255,0.45)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, w);
  });
  const beamWood = pbr("wood_floor", { repeat: [3, 0.12], envMapIntensity: 0.5 });
  beamWood.color = new Color(13146744);
  const steelM = new MeshStandardMaterial({ color: 14212578, metalness: 1, roughness: 0.22 });
  const barrelM = new MeshStandardMaterial({ color: 9080210, metalness: 1, roughness: 0.38 });
  const brassM = new MeshStandardMaterial({ color: 13213776, metalness: 1, roughness: 0.3 });
  const flightM = new MeshStandardMaterial({ side: DoubleSide, roughness: 0.55, envMapIntensity: 0.6 });
  const DART = { tip: 0.085, barrel: 0.075, shaft: 0.045, flight: 0.075 };
  const tipGeo = new CylinderGeometry(55e-4, 8e-4, DART.tip, 8);
  tipGeo.translate(0, DART.tip / 2, 0);
  const barrelGeo = (() => {
    const pts = [];
    for (let i = 0; i <= 14; i++) {
      const t = i / 14;
      pts.push(new Vector2(0.0105 + 35e-4 * Math.sin(Math.PI * t) + (i % 2 ? 12e-4 : 0), t * DART.barrel));
    }
    const g = new LatheGeometry(pts, 14);
    g.translate(0, DART.tip, 0);
    return g;
  })();
  const shaftGeo = new CylinderGeometry(45e-4, 6e-3, DART.shaft, 8);
  shaftGeo.translate(0, DART.tip + DART.barrel + DART.shaft / 2, 0);
  const flightGeo = (() => {
    const s = new Shape();
    s.moveTo(0, 0);
    s.lineTo(0.03, 0.03);
    s.lineTo(0.03, DART.flight);
    s.lineTo(0, DART.flight * 0.92);
    s.lineTo(0, 0);
    const parts = [0, 1, 2, 3].map((k) => {
      const g2 = new ShapeGeometry(s);
      g2.rotateY(k * Math.PI / 2 + 0.6);
      return g2;
    });
    const pos = [], idx = [];
    let off = 0;
    for (const g2 of parts) {
      const p = g2.attributes.position.array;
      for (let i = 0; i < p.length; i++) pos.push(p[i]);
      for (const i of g2.index.array) idx.push(i + off);
      off += p.length / 3;
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    g.translate(0, DART.tip + DART.barrel + DART.shaft - 0.01, 0);
    return g;
  })();
  const DS = 1.3, DART_LEN = (DART.tip + DART.barrel + DART.shaft + DART.flight - 0.01) * DS;
  const flightCols = [14165548, 15909424, 2056127, 2792010, 15921902].map((c) => new Color(c));
  const spikeBar = new Group();
  scene.add(spikeBar);
  let spikeMesh = null, barMesh = null;
  function buildSpikes() {
    spikeBar.clear();
    const w = HALF_W * 2 + 1.6, beamY = CEIL + DART_LEN + 0.04;
    barMesh = new Mesh(new BoxGeometry(w, 0.13, 0.15), beamWood);
    barMesh.position.set(0, beamY + 0.04, -0.02);
    spikeBar.add(barMesh);
    const lip = new Mesh(new BoxGeometry(w, 0.018, 0.17), brassM);
    lip.position.set(0, beamY - 0.025, -0.02);
    spikeBar.add(lip);
    const n = Math.round(w / 0.2), geos = [tipGeo, barrelGeo, shaftGeo, flightGeo], mats = [steelM, barrelM, barrelM, flightM];
    const m = new Matrix4(), q = new Quaternion(), e = new Euler(), sc = new Vector3(DS, DS, DS), pos = new Vector3();
    geos.forEach((geo, gi) => {
      const im = new InstancedMesh(geo, mats[gi], n);
      for (let i = 0; i < n; i++) {
        const sway = Math.sin(i * 12.9898) * 0.06;
        e.set(Math.sin(i * 4.1) * 0.05, i * 2.3, sway);
        q.setFromEuler(e);
        pos.set(-w / 2 + (i + 0.5) * w / n + Math.sin(i * 7.7) * 0.02, beamY - DART_LEN + 0.015 + Math.abs(Math.sin(i * 3.3)) * 0.015, 0.01);
        m.compose(pos, q, sc);
        im.setMatrixAt(i, m);
        if (gi === 3) im.setColorAt(i, flightCols[(i * 3 + (i >> 2)) % flightCols.length]);
      }
      spikeBar.add(im);
      if (gi === 0) spikeMesh = im;
    });
    for (const sx of [-1, 1]) {
      const cable = new Mesh(new CylinderGeometry(6e-3, 6e-3, 6, 6), steelM);
      cable.position.set(sx * (w / 2 - 0.4), beamY + 3.1, -0.02);
      spikeBar.add(cable);
    }
  }
  const prof = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40, r = Math.pow(Math.sin(Math.PI * t), 0.85) * (0.78 + 0.22 * t) * (t < 0.06 ? t / 0.06 * 0.6 + 0.4 : 1);
    prof.push(new Vector2(Math.max(1e-3, r), -Math.cos(Math.PI * t) * 1.12));
  }
  const balloonGeo = new LatheGeometry(prof, 48);
  balloonGeo.scale(BR, BR, BR);
  const knotGeo = new ConeGeometry(BR * 0.12, BR * 0.2, 12);
  knotGeo.translate(0, -BR * 1.18, 0);
  const COLORS = { pink: 16729582, cyan: 5235967, gold: 16761402 };
  function latex(hex, gold) {
    return gold ? new MeshPhysicalMaterial({ color: hex, metalness: 1, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.4 }) : new MeshPhysicalMaterial({ color: hex, roughness: 0.32, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.12, sheen: 0.2, sheenRoughness: 0.5, sheenColor: 16777215, envMapIntensity: 1.25, transparent: true, opacity: 0.96 });
  }
  const MATS = { pink: latex(COLORS.pink), cyan: latex(COLORS.cyan), gold: latex(COLORS.gold, true) };
  const STR_N = 12, STR_L = 0.85;
  const balloons = [];
  function makeBalloon(kind) {
    const mat = MATS[kind];
    const g = new Group();
    const body = new Mesh(balloonGeo, mat);
    body.castShadow = true;
    g.add(body);
    const knot = new Mesh(knotGeo, mat);
    g.add(knot);
    scene.add(g);
    const blob = new Mesh(blobGeo, new MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, color: 1312260 }));
    blob.renderOrder = 1;
    scene.add(blob);
    const pts = Array.from({ length: STR_N }, () => new Vector3());
    const strGeo = new BufferGeometry().setFromPoints(pts);
    const str = new Line(strGeo, new LineBasicMaterial({ color: 15921906, transparent: true, opacity: 0.85 }));
    scene.add(str);
    const b = { kind, g, mat, str, strGeo, pts, prev: pts.map((p) => p.clone()), p: new Vector3(), v: new Vector3(), alive: true, scale: 0, squash: 0, spin: rand(-1, 1), cd: { left: 0, right: 0 }, dying: 0, id: Math.random(), blob };
    return b;
  }
  function placeBalloon(b, x, y, vy = 0) {
    b.p.set(x, y, 0);
    b.v.set(rand(-0.2, 0.2), vy, 0);
    b.scale = 0.01;
    b.dying = 0;
    b.alive = true;
    b.g.visible = true;
    b.str.visible = true;
    const k = b.p.clone().add(new Vector3(0, -BR * 1.3, 0));
    b.pts.forEach((p, i) => {
      p.set(k.x, k.y - i * STR_L / (STR_N - 1), 0);
      b.prev[i].copy(p);
    });
  }
  function removeBalloon(b) {
    scene.remove(b.g);
    scene.remove(b.str);
    scene.remove(b.blob);
    b.blob.material.dispose();
    b.strGeo.dispose();
    balloons.splice(balloons.indexOf(b), 1);
  }
  const CONF = 420, confGeo = new PlaneGeometry(0.035, 0.022);
  const confMat = new MeshStandardMaterial({ side: DoubleSide, roughness: 0.45, metalness: 0.3 });
  const conf = new InstancedMesh(confGeo, confMat, CONF);
  conf.instanceMatrix.setUsage(DynamicDrawUsage);
  conf.frustumCulled = false;
  scene.add(conf);
  const cf = Array.from({ length: CONF }, () => ({ p: new Vector3(0, -50, 0), v: new Vector3(), r: new Euler(), w: new Vector3(), life: 0 }));
  const confCols = [16732067, 2279679, 16761402, 8191850, 11893759, 16777215].map((c) => new Color(c));
  for (let i = 0; i < CONF; i++) conf.setColorAt(i, confCols[i % confCols.length]);
  let cfNext = 0;
  const dummy = new Object3D();
  function confettiBurst(at, n, power = 1) {
    for (let k = 0; k < n; k++) {
      const c = cf[cfNext++ % CONF];
      c.p.copy(at).add(new Vector3(rand(-0.1, 0.1), rand(-0.1, 0.1), rand(-0.1, 0.1)));
      c.v.set(rand(-1, 1), rand(-0.6, 1), rand(-0.6, 0.8)).normalize().multiplyScalar(rand(1.2, 3.6) * power);
      c.r.set(rand(0, 6), rand(0, 6), rand(0, 6));
      c.w.set(rand(-12, 12), rand(-12, 12), rand(-12, 12));
      c.life = rand(2, 3.5);
    }
  }
  const gustSprites = Array.from({ length: 40 }, () => {
    const s = new Sprite(new SpriteMaterial({ map: glowTex, color: 13627391, transparent: true, opacity: 0, depthWrite: false, blending: AdditiveBlending }));
    s.scale.set(0.08, 0.6, 1);
    s.visible = false;
    scene.add(s);
    return { s, v: 0, life: 0 };
  });
  const hud = document.getElementById("hud"), ctx = hud.getContext("2d");
  let W = 1280, H = 720, S = 720, DPR = 1;
  function resize() {
    W = innerWidth;
    H = innerHeight;
    S = Math.min(W, H);
    DPR = Math.min(devicePixelRatio || 1, 2);
    hud.width = Math.round(W * DPR);
    hud.height = Math.round(H * DPR);
    camera.aspect = W / H;
    camera.fov = 50;
    camera.updateProjectionMatrix();
    camera.position.copy(CAM);
    camera.lookAt(LOOK);
    const p = screenToWorld(1, 0.5, new Vector3());
    HALF_W = clamp(Math.abs(p.x) - 0.05, 1.6, 4.2);
    buildSpikes();
  }
  const ray = new Raycaster(), plane0 = new Plane(new Vector3(0, 0, 1), 0), tmp = new Vector3(), tmpV = new Vector3();
  function screenToWorld(sx, sy, out) {
    ray.setFromCamera({ x: sx * 2 - 1, y: -(sy * 2 - 1) }, camera);
    if (!ray.ray.intersectPlane(plane0, out)) out.set(0, 1.5, 0);
    return out;
  }
  function toScreen(v) {
    tmpV.copy(v).project(camera);
    return { x: (tmpV.x + 1) / 2, y: (1 - tmpV.y) / 2 };
  }
  addEventListener("resize", resize);
  resize();
  let AC = null, master = null, noiseBuf = null, musicOn = false;
  const MUTE = Q.has("mute");
  function audioInit() {
    var _a;
    if (AC) {
      (_a = AC.resume) == null ? void 0 : _a.call(AC);
      return;
    }
    try {
      AC = new (window.AudioContext || window.webkitAudioContext)();
      master = AC.createGain();
      master.gain.value = MUTE ? 0 : 0.75;
      const lim = AC.createDynamicsCompressor();
      lim.threshold.value = -10;
      lim.knee.value = 6;
      lim.ratio.value = 10;
      lim.attack.value = 4e-3;
      lim.release.value = 0.2;
      master.connect(lim).connect(AC.destination);
      noiseBuf = AC.createBuffer(1, AC.sampleRate, AC.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    } catch (e) {
      AC = null;
    }
  }
  function tone(freq, dur, peak, type = "sine", toFreq, delay = 0) {
    if (!AC) return;
    const t = AC.currentTime + delay;
    const o = AC.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (toFreq) o.frequency.exponentialRampToValueAtTime(toFreq, t + dur);
    const g = AC.createGain(), a = Math.min(0.022, dur * 0.3);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(1e-4, t + Math.max(dur, a + 0.02));
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + Math.max(dur, a + 0.02) + 0.05);
  }
  function noise(dur, freq, q, peak, type = "bandpass", sweepTo, attack = 5e-3) {
    if (!AC) return;
    const t = AC.currentTime;
    const s = AC.createBufferSource();
    s.buffer = noiseBuf;
    s.loop = true;
    const f = AC.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(freq, t);
    f.Q.value = q;
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
    const at = Math.max(0.012, attack), g = AC.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + at);
    g.gain.exponentialRampToValueAtTime(1e-4, t + Math.max(dur, at + 0.02));
    s.connect(f).connect(g).connect(master);
    s.start(t, Math.random() * 0.5);
    s.stop(t + Math.max(dur, at + 0.02) + 0.05);
  }
  const PENTA = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.5];
  const sfx = {
    boop(n, match) {
      const f = PENTA[Math.min(PENTA.length - 1, n % PENTA.length)];
      tone(f * 0.5, 0.2, 0.22, "triangle", f * 0.75);
      tone(f, 0.14, 0.08, "sine");
      if (match) {
        tone(f * 2, 0.25, 0.08, "sine", null, 0.05);
        tone(f * 3, 0.3, 0.05, "sine", null, 0.1);
      }
    },
    pop() {
      noise(0.14, 2200, 0.5, 0.32, "highpass", null, 0.015);
      tone(160, 0.14, 0.24, "triangle", 60);
      for (let i = 0; i < 6; i++) tone(rand(1500, 3e3), 0.18, 0.05, "sine", null, 0.06 + i * 0.04);
    },
    drop() {
      tone(330, 0.45, 0.25, "sine", 110);
      noise(0.2, 300, 0.8, 0.2, "lowpass");
    },
    inflate() {
      noise(0.45, 600, 1.2, 0.12, "bandpass", 2400, 0.1);
    },
    gust() {
      noise(1.2, 300, 0.7, 0.5, "bandpass", 3e3, 0.15);
      tone(220, 0.8, 0.15, "sine", 880);
    },
    cheer() {
      for (let i = 0; i < 4; i++) tone(PENTA[i * 2 % 8], 0.3, 0.12, "triangle", null, i * 0.09);
    },
    press() {
      tone(660, 0.08, 0.2, "triangle");
      tone(990, 0.12, 0.18, "triangle", null, 0.07);
    }
  };
  const SONG = [0, 2, 4, 2, 5, 4, 2, -1, 0, 2, 4, 5, 7, 5, 4, -1, 4, 5, 7, 5, 4, 2, 0, -1, 2, 4, 2, 0, 1, 0, -1, -1];
  const SCALE = [392, 440, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99];
  let musicStep = 0, musicNext = 0;
  function musicTick() {
    if (!AC || !musicOn) return;
    while (musicNext < AC.currentTime + 0.25) {
      const n = SONG[musicStep % SONG.length], t = musicNext;
      if (n >= 0) {
        const o = AC.createOscillator(), g = AC.createGain();
        o.type = "triangle";
        o.frequency.value = SCALE[n];
        g.gain.setValueAtTime(1e-4, t);
        g.gain.exponentialRampToValueAtTime(0.045, t + 0.01);
        g.gain.exponentialRampToValueAtTime(1e-4, t + 0.2);
        o.connect(g).connect(master);
        o.start(t);
        o.stop(t + 0.25);
      }
      if (musicStep % 4 === 0) {
        const o = AC.createOscillator(), g = AC.createGain();
        o.type = "sine";
        o.frequency.value = [130.81, 98, 110, 87.31][Math.floor(musicStep / 8) % 4];
        g.gain.setValueAtTime(1e-4, t);
        g.gain.exponentialRampToValueAtTime(0.06, t + 0.01);
        g.gain.exponentialRampToValueAtTime(1e-4, t + 0.3);
        o.connect(g).connect(master);
        o.start(t);
        o.stop(t + 0.35);
      }
      musicStep++;
      musicNext = Math.max(musicNext + 0.2, AC.currentTime);
    }
  }
  const G = window.__game = { state: "title", score: 0, touches: 0, drops: 0, pops: 0, gusts: 0, matches: 0, streak: 0, bestStreak: 0, timeLeft: ROUND, gust: 0, balloons: [], best: BP.best(GAME_ID), errors: [] };
  let tStart = 0, gameT = 0, lastT = 0, ending = false, nextAllUp = 5, dropTimes = [], respawns = [], endAt = 0;
  const popups = [], hudParts = [], handW = { left: new Vector3(), right: new Vector3() }, handPrev = { left: new Vector3(), right: new Vector3() }, handVel = { left: new Vector3(), right: new Vector3() };
  function popup(text, sub, col, big = 1, at) {
    popups.push({ text, sub, col, t: 0, big, at });
    if (popups.length > 4) popups.shift();
  }
  const diff = () => clamp(gameT / ROUND, 0, 1);
  function kindFor(i) {
    if (G.state === "play" && gameT > 20 && Math.random() < 0.14) return "gold";
    return i % 2 ? "cyan" : "pink";
  }
  function spawn(kind, x, y, vy) {
    const b = makeBalloon(kind);
    placeBalloon(b, x, y, vy);
    balloons.push(b);
    sfx.inflate();
    return b;
  }
  function desired() {
    const recent = dropTimes.filter((t) => gameT - t < 12).length;
    let n = gameT < 12 ? 1 : gameT < 35 ? 2 : 3;
    if (recent >= 2) n--;
    if (recent >= 4) n--;
    return clamp(n, 1, 3);
  }
  function startRound(now) {
    var _a, _b;
    audioInit();
    BP.music("balloon");
    if (MUTE) BP.musicVolume(0);
    (_b = (_a = state()).grace) == null ? void 0 : _b.call(_a, 1500);
    while (balloons.length) removeBalloon(balloons[0]);
    Object.assign(G, { state: "play", score: 0, touches: 0, drops: 0, pops: 0, gusts: 0, matches: 0, streak: 0, bestStreak: 0, timeLeft: ROUND, gust: 0.6, fpsMin: 999 });
    BP.activity.activeSec = 0;
    BP.activity.kcal = 0;
    tStart = now;
    gameT = 0;
    ending = false;
    nextAllUp = 5;
    dropTimes = [];
    respawns = [];
    popups.length = 0;
    spawn("pink", 0, 2.2, 0.3);
    popup("TAP IT UP!", "keep the balloons off the floor", "#ffd1e6", 0.8);
  }
  function endRound() {
    G.state = "end";
    musicOn = false;
    sfx.cheer();
    G.round = { active: BP.activity.activeSec, kcal: BP.activity.kcal };
    G.newBest = G.score > 0 && G.score > (G._prevBest || 0);
    G.best = Math.max(BP.best(GAME_ID), G.score);
    BP.saveSession({ game: GAME_ID, score: G.score });
    if (BP.highScores) BP.highScores(GAME_ID, G.score);
    G.sessionsSaved = (G.sessionsSaved || 0) + 1;
    for (const b of balloons.slice()) {
      confettiBurst(b.p, 40, 0.8);
      removeBalloon(b);
    }
    endAt = performance.now();
  }
  function hit(b, side) {
    const up = balloons.filter((o) => o.alive && !o.dying).length;
    const match = side === "left" && b.kind === "pink" || side === "right" && b.kind === "cyan";
    const mult = up * (match ? 2 : 1) * (b.kind === "gold" ? 3 : 1);
    const pts = 10 * mult;
    G.score += pts;
    G.touches++;
    G.streak++;
    G.bestStreak = Math.max(G.bestStreak, G.streak);
    if (match) G.matches++;
    sfx.boop(G.streak, match || b.kind === "gold");
    const sp = toScreen(b.p);
    hudParts.push({ kind: "num", x: sp.x * W, y: sp.y * H - S * 0.08, vy: -S * 0.25, life: 0.9, text: "+".concat(pts), col: match ? side === "left" ? "#ff9ad0" : "#8fe6ff" : b.kind === "gold" ? "#ffd76a" : "#ffffff", big: match || b.kind === "gold" });
    if (match) for (let i = 0; i < 14; i++) {
      const a = rand(0, 6.283), v = rand(0.2, 0.6) * S;
      hudParts.push({ kind: "spark", x: sp.x * W, y: sp.y * H, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rand(0.4, 0.8), c: side === "left" ? "#ff9ad0" : "#8fe6ff", r: S * 6e-3 });
    }
    if (G.streak > 0 && G.streak % 10 === 0) popup(G.streak >= 30 ? "BALLOON MASTER" : G.streak >= 20 ? "AMAZING!" : "GREAT KEEP-UP!", "".concat(G.streak, " taps, no drops"), "#ffe08a", 0.8);
  }
  function popBalloon(b) {
    G.pops++;
    const pts = 100 * (b.kind === "gold" ? 2 : 1);
    G.score += pts;
    sfx.pop();
    confettiBurst(b.p, b.kind === "gold" ? 160 : 110, 1.2);
    shake(0.25);
    const sp = toScreen(b.p);
    popup("POP! +".concat(pts), null, b.kind === "gold" ? "#ffd76a" : "#ffffff", 0.9);
    for (let i = 0; i < 40; i++) {
      const a = rand(0, 6.283), v = rand(0.3, 1) * S;
      hudParts.push({ kind: "conf", x: sp.x * W, y: sp.y * H, vx: Math.cos(a) * v, vy: Math.sin(a) * v - S * 0.3, r: rand(5e-3, 0.011) * S, rot: rand(0, 6), vr: rand(-12, 12), c: ["#ff4fa3", "#22c8ff", "#ffc23a", "#7cff6a", "#b57bff", "#fff"][i % 6], life: rand(0.8, 1.4) });
    }
    b.alive = false;
    removeBalloon(b);
    respawns.push({ at: gameT + 0.9, side: Math.random() < 0.5 ? -1 : 1 });
  }
  function doGust() {
    if (G.state !== "play" || G.gust < 1) return;
    G.gust = 0;
    G.gusts++;
    sfx.gust();
    shake(0.2);
    for (const b of balloons) if (b.alive && !b.dying) {
      b.v.y = Math.max(b.v.y, 2.6 + (2.2 - b.p.y) * 0.5);
      b.v.x *= 0.5;
      b.squash = 0.4;
    }
    for (const gs of gustSprites) {
      gs.s.position.set(rand(-HALF_W, HALF_W), rand(-0.2, 1.2), rand(-0.3, 0.6));
      gs.v = rand(4, 8);
      gs.life = rand(0.5, 0.9);
    }
    popup("WHOOSH!", "star-jump gust lifts them all", "#bfe9ff", 1);
  }
  BP.on("starjump", doGust);
  BP.on("jump", doGust);
  function kickUp(side) {
    if (G.state !== "play") return;
    let best = null;
    for (const b of balloons) if (!b.dying && b.p.y < 1.1 && (!best || b.p.y < best.p.y)) best = b;
    if (!best) return;
    best.v.set((side === "left" ? 0.4 : -0.4) + rand(-0.3, 0.3), 2.4, 0);
    best.squash = 0.6;
    best.hitAt = gameT;
    G.kicks = (G.kicks || 0) + 1;
    hit(best, "kick");
    G.score += 20;
    popup("KICK UP! +20", null, "#c6ffb0", 0.7);
  }
  BP.on("kickL", () => kickUp("left"));
  BP.on("kickR", () => kickUp("right"));
  let buttons = [], clickAt = null, keyPress = false;
  addEventListener("pointerdown", (e) => {
    clickAt = { x: e.clientX, y: e.clientY };
    audioInit();
  });
  addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      keyPress = true;
      e.preventDefault();
    }
    if (e.key === "Escape" || e.key === "h") {
      if (G.state === "play") goHome();
    }
    if (e.key === "g") doGust();
  });
  function goHome() {
    location.href = "index.html";
  }
  function button(id, label, x, y, w, h, now, primary, action, ms = 650, fsz) {
    const r = { x, y, w, h }, hov = BP.handOver(r, W, H);
    const arm = G._arm || (G._arm = {});
    if (arm[id + "_f"] !== G._frame - 1) arm[id] = !hov || ms < 1e3;
    else if (!hov) arm[id] = true;
    arm[id + "_f"] = G._frame;
    const over = hov && arm[id], k = BP.dwell(id, over, now, ms);
    buttons.push({ r, action, primary });
    ctx.save();
    const rad = h / 2;
    ctx.fillStyle = "rgba(10,12,24,0.6)";
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, rad);
    ctx.fill();
    if (k > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, rad);
      ctx.clip();
      ctx.fillStyle = "rgba(255,111,180,0.55)";
      ctx.fillRect(x, y, w * k, h);
      ctx.restore();
    }
    ctx.lineWidth = primary || over ? 2 : 1;
    ctx.strokeStyle = over ? "#ffffff" : primary ? "rgba(255,111,180,0.9)" : "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, rad);
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.font = "800 ".concat(fsz || h * 0.42, "px system-ui, -apple-system, sans-serif");
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x + w / 2, y + h / 2 + h * 0.02);
    ctx.restore();
    if (k === 1) {
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
  function txt(s, x, y, size, col = "#fff", align = "center", weight = 800, glow) {
    ctx.font = "".concat(weight, " ").concat(size, 'px system-ui, -apple-system, "Segoe UI", sans-serif');
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    if (glow) {
      ctx.shadowColor = glow;
      ctx.shadowBlur = size * 0.5;
    }
    ctx.fillStyle = col;
    ctx.fillText(s, x, y);
    ctx.shadowBlur = 0;
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
  function shadowTxt(s, x, y, size, col, glow, weight = 900) {
    ctx.shadowColor = "rgba(20,0,10,0.8)";
    ctx.shadowBlur = size * 0.35;
    ctx.shadowOffsetY = size * 0.05;
    txt(s, x, y, size, col, "center", weight);
    ctx.shadowOffsetY = 0;
    if (glow) txt(s, x, y, size, col, "center", weight, glow);
  }
  function pill(x, y, w, h) {
    ctx.fillStyle = "rgba(10,12,24,0.55)";
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, h / 2);
    ctx.fill();
    ctx.stroke();
  }
  function panel(x, y, w, h) {
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = S * 0.06;
    ctx.fillStyle = "rgba(10,12,24,0.7)";
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, S * 0.04);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }
  function stepBalloon(b, dt) {
    var _a;
    const d = diff(), assist = dropTimes.filter((t) => gameT - t < 10).length >= 2 ? 0.75 : 1;
    const gEff = (G.state === "play" ? lerp(0.75, 1.15, d) : 0) * assist;
    b.scale = Math.min(1, b.scale + dt * 3);
    b.squash *= Math.exp(-dt * 8);
    if (b.dying) {
      b.dying += dt;
      b.v.y = Math.max(b.v.y, 0);
      b.p.addScaledVector(b.v, dt);
      b.v.multiplyScalar(0.9);
      return;
    }
    const wind = G.state === "play" ? Math.sin(gameT * 0.6 + b.id * 10) * lerp(0.1, 0.35, d) : 0;
    b.v.y -= gEff * dt;
    b.v.x += wind * dt;
    if (G.state !== "play") {
      b.v.y += (1.6 + Math.sin(performance.now() / 900 + b.id * 7) * 0.25 - b.p.y) * dt * 1.2;
      b.v.x += -b.p.x * 0.05 * dt;
    }
    const drag = Math.exp(-dt * 0.9);
    b.v.multiplyScalar(drag);
    b.v.y = Math.max(b.v.y, -1.9);
    b.p.addScaledVector(b.v, dt);
    const reachX = HALF_W * 0.72;
    if (G.state === "play" && Math.abs(b.p.x) > reachX) b.v.x -= Math.sign(b.p.x) * (Math.abs(b.p.x) - reachX) * 4 * dt;
    if (b.p.x < -HALF_W + BR) {
      b.p.x = -HALF_W + BR;
      b.v.x = Math.abs(b.v.x) * 0.7;
    }
    if (b.p.x > HALF_W - BR) {
      b.p.x = HALF_W - BR;
      b.v.x = -Math.abs(b.v.x) * 0.7;
    }
    if (b.p.y + BR * 1.15 > CEIL && G.state === "play" && gameT - ((_a = b.hitAt) != null ? _a : -9) < 2.5) {
      popBalloon(b);
      return;
    }
    if (b.p.y + BR * 1.15 > CEIL) {
      b.p.y = CEIL - BR * 1.15;
      b.v.y = -Math.abs(b.v.y) * 0.3;
    }
    if (b.p.y - BR * 1.12 < FLOOR + 0.02) {
      b.p.y = FLOOR + 0.02 + BR * 1.12;
      if (G.state === "play") {
        b.dying = 1e-3;
        b.v.set(b.v.x * 0.3, 0.2, 0);
        G.drops++;
        G.streak = 0;
        dropTimes.push(gameT);
        sfx.drop();
        popup("OOPS!", ["it floated down", "next one!", "reach under it", "tap it up early"][Math.floor(Math.random() * 4)], "#ffb3c8", 0.8);
        respawns.push({ at: gameT + 1.2, side: 0 });
      } else b.v.y = Math.abs(b.v.y) * 0.4;
    }
  }
  function collideHands(b, dt) {
    if (!b.alive || b.dying || G.state !== "play") return;
    for (const side of ["left", "right"]) {
      const h = BP.hands[side];
      b.cd[side] = Math.max(0, b.cd[side] - dt);
      if (!h.seen || b.cd[side] > 0) continue;
      const up = h.raised !== false || BP.mouse || BP.simulating, lifting = handVel[side].y > 0.6;
      if (!up && !lifting) continue;
      const hp = handW[side], dx = b.p.x - hp.x, dy = (b.p.y - hp.y) / 1.35, dist = Math.hypot(dx, dy);
      if (dist < BR * 1.05 + 0.26 && b.v.y < 0.9) {
        const n = new Vector3(dx, Math.max(dy, 0) + 0.45, 0).normalize();
        const hv = handVel[side], push = Math.max(0, hv.x * n.x + hv.y * n.y);
        const spd = clamp(1.3 + push * 0.1, 1.3, 2.45);
        b.v.set(n.x * spd * 0.6 + hv.x * 0.12, Math.max(1.3, n.y * spd), 0);
        b.squash = 0.55;
        b.spin = rand(-2, 2);
        b.cd[side] = 0.28;
        b.cd[side === "left" ? "right" : "left"] = Math.max(b.cd[side === "left" ? "right" : "left"], 0.12);
        b.hitAt = gameT;
        hit(b, side);
      }
    }
  }
  function collideBalloons() {
    for (let i = 0; i < balloons.length; i++) for (let j = i + 1; j < balloons.length; j++) {
      const a = balloons[i], b = balloons[j];
      if (a.dying || b.dying) continue;
      const d = tmp.subVectors(b.p, a.p), l = d.length(), min = BR * 2.05;
      if (l < min && l > 1e-4) {
        d.multiplyScalar(1 / l);
        const push = (min - l) / 2;
        a.p.addScaledVector(d, -push);
        b.p.addScaledVector(d, push);
        const rv = b.v.clone().sub(a.v).dot(d);
        if (rv < 0) {
          a.v.addScaledVector(d, rv * 0.9);
          b.v.addScaledVector(d, -rv * 0.9);
        }
      }
    }
  }
  function stepString(b, dt) {
    const knot = tmp.set(b.p.x, b.p.y - BR * 1.25 * b.scale, b.p.z), seg = STR_L / (STR_N - 1);
    b.pts[0].copy(knot);
    for (let i = 1; i < STR_N; i++) {
      const p = b.pts[i], q = b.prev[i], vx = (p.x - q.x) * 0.96, vy = (p.y - q.y) * 0.96, vz = (p.z - q.z) * 0.96;
      q.copy(p);
      p.x += vx;
      p.y += vy - 9.8 * dt * dt * 0.6;
      p.z += vz;
    }
    for (let it = 0; it < 4; it++) for (let i = 1; i < STR_N; i++) {
      const a = b.pts[i - 1], c = b.pts[i], dx = c.x - a.x, dy = c.y - a.y, dz = c.z - a.z, l = Math.hypot(dx, dy, dz) || 1, k = (l - seg) / l;
      if (i === 1) {
        c.x -= dx * k;
        c.y -= dy * k;
        c.z -= dz * k;
      } else {
        a.x += dx * k * 0.5;
        a.y += dy * k * 0.5;
        a.z += dz * k * 0.5;
        c.x -= dx * k * 0.5;
        c.y -= dy * k * 0.5;
        c.z -= dz * k * 0.5;
      }
      b.pts[0].copy(knot);
    }
    for (const p of b.pts) if (p.y < FLOOR + 5e-3) p.y = FLOOR + 5e-3;
    b.strGeo.setFromPoints(b.pts);
  }
  function frame(now) {
    BP.update(now);
    const dt = Math.min(0.05, (now - (lastT || now)) / 1e3) || 0.016;
    lastT = now;
    if (G.state === "play") {
      gameT = (now - tStart) / 1e3;
      G.timeLeft = Math.max(0, ROUND - gameT);
      G.gust = Math.min(1, G.gust + dt / 9);
    }
    G.fpsN = (G.fpsN || 0) + 1;
    if (!G._fpsT) G._fpsT = now;
    if (now - G._fpsT > 1e3) {
      G.fps = Math.round(G.fpsN * 1e3 / (now - G._fpsT));
      G._fpsT = now;
      G.fpsN = 0;
      G.fpsMin = Math.min(G.fpsMin || 999, G.fps);
      (G.fpsHist || (G.fpsHist = [])).push(G.fps + ":" + state().quality.tier);
      if (G.fpsHist.length > 120) G.fpsHist.shift();
    }
    for (const side of ["left", "right"]) {
      const h = BP.hands[side];
      handPrev[side].copy(handW[side]);
      if (h.seen) screenToWorld(h.x, h.y, handW[side]);
      handVel[side].subVectors(handW[side], handPrev[side]).divideScalar(dt).clampLength(0, 12);
    }
    if (G.state === "title" && balloons.length < 3) spawn(["pink", "gold", "cyan"][balloons.length], [-1.6, 0, 1.6][balloons.length], 1.6, 0);
    if (G.state === "play") {
      for (let i = respawns.length - 1; i >= 0; i--) if (gameT >= respawns[i].at) {
        respawns.splice(i, 1);
      }
      const want = desired(), live = balloons.filter((b) => !b.dying).length + respawns.length;
      if (!ending && live < want && !respawns.some((r) => r.pending)) {
        const n = balloons.length, x = rand(-HALF_W * 0.6, HALF_W * 0.6);
        spawn(kindFor(G.touches + n), x, 2.25, -0.1);
      }
      if (gameT >= nextAllUp) {
        const up = balloons.filter((b) => !b.dying).length;
        if (up >= 2 && !dropTimes.some((t) => gameT - t < 5)) {
          const pts = 25 * up;
          G.score += pts;
          popup("ALL UP! +".concat(pts), null, "#c6ffb0", 0.7);
        }
        nextAllUp += 5;
      }
      if (G.timeLeft <= 0) {
        ending = true;
        endRound();
      }
    }
    for (const b of balloons.slice()) {
      stepBalloon(b, dt);
      if (!balloons.includes(b)) continue;
      collideHands(b, dt);
      if (b.dying > 0.7) {
        removeBalloon(b);
        continue;
      }
    }
    collideBalloons();
    for (const b of balloons) {
      const k = b.dying ? Math.max(0.01, 1 - b.dying / 0.7) : b.scale, sq = Math.sin(performance.now() / 40) * b.squash * 0.25;
      b.g.position.copy(b.p);
      b.g.scale.set(k * (1 + sq), k * (1 - sq), k * (1 + sq));
      b.g.rotation.z += (-b.v.x * 0.12 - b.g.rotation.z) * Math.min(1, dt * 4);
      b.g.rotation.y += b.spin * dt;
      b.spin *= Math.exp(-dt);
      stepString(b, dt);
      {
        const h = Math.max(0, b.p.y - BR * 1.12 - FLOOR), k2 = b.dying ? Math.max(0, 1 - b.dying / 0.7) : b.scale, s2 = BR * (0.95 + h * 0.4);
        b.blob.position.set(b.p.x, FLOOR + 4e-3, b.p.z);
        b.blob.scale.set(s2 * 2, 1, s2 * 1.6);
        b.blob.material.opacity = k2 * clamp(0.7 / (1 + h * 1.8), 0.08, 0.7);
      }
    }
    G.balloons = balloons.map((b) => {
      const s = toScreen(b.p);
      return { x: s.x, y: s.y, vy: b.v.y, wy: b.p.y, kind: b.kind, dying: !!b.dying };
    });
    for (let i = 0; i < CONF; i++) {
      const c = cf[i];
      if (c.life > 0) {
        c.life -= dt;
        c.v.y -= 3.2 * dt;
        c.v.multiplyScalar(Math.exp(-dt * 1.8));
        c.p.addScaledVector(c.v, dt);
        if (c.p.y < 0.01) {
          c.p.y = 0.01;
          c.v.set(0, 0, 0);
          c.w.set(0, 0, 0);
        }
        c.r.x += c.w.x * dt;
        c.r.y += c.w.y * dt;
        c.r.z += c.w.z * dt;
      }
      dummy.position.copy(c.life > 0 ? c.p : tmp.set(0, -50, 0));
      dummy.rotation.copy(c.r);
      dummy.scale.setScalar(c.life > 0 ? Math.min(1, c.life) : 0);
      dummy.updateMatrix();
      conf.setMatrixAt(i, dummy.matrix);
    }
    conf.instanceMatrix.needsUpdate = true;
    for (const gs of gustSprites) {
      if (gs.life > 0) {
        gs.life -= dt;
        gs.s.position.y += gs.v * dt;
        gs.s.material.opacity = Math.min(0.5, gs.life);
        gs.s.visible = true;
      } else {
        gs.s.material.opacity = 0;
        gs.s.visible = false;
      }
    }
    const tt = now / 1e3;
    camera.position.set(CAM.x + Math.sin(tt * 0.21) * 0.08, CAM.y + Math.sin(tt * 0.33) * 0.04, CAM.z);
    camera.lookAt(LOOK);
    if (Q.has("locktier")) state().quality.t0 = performance.now();
    {
      const bl = state().passes.bloom;
      if (bl) {
        bl.strength = 0.2;
        bl.threshold = 0.92;
      }
    }
    render(dt);
    G.quality = state().quality;
    if (!Q.has("nohud")) drawHUD(now, dt);
    requestAnimationFrame(frame);
  }
  let tipAvoid = [];
  function ui() {
    const vmin = S / 100, T = Math.max(10, 1.8 * vmin), Hh = Math.max(36, 5.6 * vmin), Wb = Math.max(108, 15 * vmin), Gp = Math.max(8, 1.2 * vmin);
    return { T, L: T, Hh, Wb, G: Gp, fs: Math.max(14, 1.9 * vmin), sysRight: T + 2 * Wb + 2 * Gp + Hh };
  }
  function homeButton(now) {
    if (BodyMovin.sysMode && BodyMovin.sysMode() === "play") return;
    const u = ui();
    button("home", "← HOME", u.L, u.T, u.Wb, u.Hh, now, false, goHome, 1400, u.fs);
  }
  function drawHUD(now, dt) {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);
    G._frame = (G._frame || 0) + 1;
    buttons = [];
    tipAvoid = [];
    if (G.state === "play") {
      for (const b of balloons) {
        if (b.dying) continue;
        const h = b.p.y - BR * 1.12;
        if (h < 0.9 && b.v.y < 0) {
          const s = toScreen(tmp.set(b.p.x, FLOOR, 0)), a = (1 - h / 0.9) * (0.5 + 0.5 * Math.sin(now / 90));
          ctx.strokeStyle = "rgba(255,230,120,".concat(a * 0.9, ")");
          ctx.lineWidth = S * 6e-3;
          ctx.beginPath();
          ctx.ellipse(s.x * W, s.y * H - S * 0.01, S * 0.07, S * 0.018, 0, 0, 7);
          ctx.stroke();
        }
      }
      const u = ui(), ph = u.Hh, fs = Math.max(u.fs, ph * 0.5), tl = Math.ceil(G.timeLeft), tTxt = "".concat(Math.floor(tl / 60), ":").concat(String(tl % 60).padStart(2, "0"));
      ctx.font = "900 ".concat(fs, "px system-ui, -apple-system, sans-serif");
      const tw = ctx.measureText(tTxt).width, sw = Math.max(ctx.measureText(String(G.score)).width, ctx.measureText("0000").width);
      const pw = tw + sw + fs * 3.2, px = W / 2 - pw / 2, py = px >= u.sysRight + u.G ? u.T : u.T + u.Hh + u.G;
      pill(px, py, pw, ph);
      tipAvoid.push({ x: px, y: py, w: pw, h: ph });
      txt(tTxt, px + fs * 0.9 + tw / 2, py + ph / 2, fs, G.timeLeft < 10 ? "#ff9a9a" : "#ffb3d6", "center", 900);
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillRect(px + fs * 1.6 + tw - 0.5, py + ph * 0.25, 1, ph * 0.5);
      txt(String(G.score), px + fs * 2.3 + tw + sw / 2, py + ph / 2, fs, "#fff", "center", 900);
      if (G.streak > 1) {
        const st = "".concat(G.streak, " in a row");
        ctx.font = "800 ".concat(fs, "px system-ui, -apple-system, sans-serif");
        const bw2 = ctx.measureText(st).width + fs * 1.6, bx2 = Math.min(W - u.L, BP.freeRight ? BP.freeRight() : W) - bw2;
        const by2 = bx2 < (py === u.T ? px + pw : u.sysRight) + u.G ? Math.max(py, u.T + u.Hh) + u.Hh + u.G : u.T;
        pill(bx2, by2, bw2, ph);
        tipAvoid.push({ x: bx2, y: by2, w: bw2, h: ph });
        txt(st, bx2 + bw2 / 2, by2 + ph / 2, fs, "#ffe08a", "center", 800);
      }
      const ready = G.gust >= 1, hint = ready ? "Jump for a gust!" : "";
      if (hint && !popups.length) {
        const hf = Math.max(u.fs, S * 0.03);
        ctx.font = "800 ".concat(hf, "px system-ui, -apple-system, sans-serif");
        const hw = Math.min(W - u.L * 2, ctx.measureText(hint).width + hf * 1.6), hh = hf * 2, hy = H - hh - u.T;
        tipAvoid.push({ x: W / 2 - hw / 2, y: hy, w: hw, h: hh });
        ctx.save();
        if (ready) ctx.globalAlpha = 0.75 + 0.25 * Math.sin(now / 120);
        pill(W / 2 - hw / 2, hy, hw, hh);
        txt(hint, W / 2, hy + hh / 2, hf, ready ? "#ffffff" : "#ffe6f5", "center", 800);
        ctx.restore();
      }
    }
    for (let i = hudParts.length - 1; i >= 0; i--) {
      const p = hudParts[i];
      p.life -= dt;
      if (p.life <= 0) {
        hudParts.splice(i, 1);
        continue;
      }
      if (p.kind === "num") {
        p.y += p.vy * dt;
        p.vy *= 0.94;
        ctx.globalAlpha = Math.min(1, p.life * 2);
        shadowTxt(p.text, p.x, p.y, S * (p.big ? 0.06 : 0.045), p.col);
        ctx.globalAlpha = 1;
        continue;
      }
      if (p.kind === "spark") {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        ctx.globalAlpha = Math.min(1, p.life * 2);
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 7);
        ctx.fill();
        ctx.globalAlpha = 1;
        continue;
      }
      p.vy += S * 1.6 * dt;
      p.vx *= 1 - dt * 1.5;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.min(1, p.life * 2);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.r, -p.r * 0.45, p.r * 2, p.r * 0.9);
      ctx.restore();
    }
    while (popups.length > 1) popups.shift();
    for (let i = popups.length - 1; i >= 0; i--) {
      const p = popups[i];
      p.t += dt;
      if (p.t > 1.4) {
        popups.splice(i, 1);
        continue;
      }
      const k = p.t < 0.15 ? p.t / 0.15 : 1, a = p.t > 1 ? 1 - (p.t - 1) / 0.4 : 1, sc = (0.7 + 0.3 * k) * p.big;
      ctx.save();
      ctx.globalAlpha = Math.max(0, a);
      const y = H * 0.34 - p.t * S * 0.04, x0 = W * 0.025;
      const L = sideLines(p.text, sidePx(W, H) * (0.75 + 0.25 * k), sideW(W, H, 0.22), (px) => "900 ".concat(px, "px system-ui, -apple-system, sans-serif"));
      tipAvoid.push({ x: x0, y: y - L.px * 0.6, w: L.w, h: L.h });
      L.lines.forEach((l, j) => {
        const ly = y + j * L.px * 1.1;
        ctx.shadowColor = "rgba(20,0,10,0.8)";
        ctx.shadowBlur = L.px * 0.35;
        ctx.shadowOffsetY = L.px * 0.05;
        txt(l, x0, ly, L.px, "#fff", "left", 900);
        ctx.shadowOffsetY = 0;
        txt(l, x0, ly, L.px, "#fff", "left", 900, p.col);
      });
      ctx.restore();
    }
    if (G.state === "title") drawTitle(now);
    if (G.state === "end") drawEnd(now);
    if (!(G.state === "end" && !(BP.highScores && BP.highScores.active) && now - endAt > 100)) homeButton(now);
    handleClicksAndKeys();
    BP.drawHands(ctx, W, H);
  }
  function drawTitle(now) {
    const bh = Math.min(S * 0.11, H * 0.085), bw = Math.max(bh * 3.6, S * 0.4);
    button("start", "START", W / 2 - bw / 2, H * 0.8 - bh / 2, bw, bh, now, true, () => startRound(performance.now()), 650, Math.max(ui().fs, bh * 0.45));
    const best = BP.best(GAME_ID);
    if (Q.has("tv") && !G._tvAt) G._tvAt = now + 2e3;
    if (G._tvAt && now > G._tvAt) {
      G._tvAt = 0;
      startRound(now);
    }
    G._prevBest = best;
  }
  function drawEnd(now) {
    if (BP.highScores && BP.highScores.active) return;
    const u = ui(), L = BP.layout.end(W, H, { cy: H * 0.7 }), A = L.again, Hm = L.home;
    const py = H * 0.13, ph = Math.min(S * 0.34, Math.max(S * 0.24, A.y - S * 0.05 - py)), pw = Math.min(W * 0.9, Math.max(A.w * 1.4, S * 0.7)), px = W / 2 - pw / 2;
    panel(px, py, pw, ph);
    txt("SCORE", W / 2, py + ph * 0.2, Math.max(u.fs, S * 0.04), "#ffb3d6", "center", 800);
    const k = clamp((now - endAt) / 100, 0, 1), shown = Math.round(G.score * (1 - Math.pow(1 - k, 3)));
    shadowTxt(String(shown), W / 2, py + ph * 0.6, Math.min(S * 0.15, ph * 0.5), "#fff", "#ff4fa3");
    const showButtons = now - endAt > 100;
    if (showButtons) {
      button("again", "PLAY AGAIN", A.x, A.y, A.w, A.h, now, true, () => startRound(performance.now()), 1e3, Math.max(u.fs, Math.min(A.h * 0.42, A.w * 0.12)));
      button("home2", "HOME", Hm.x, Hm.y, Hm.w, Hm.h, now, false, goHome, BP.LEAVE_MS, Math.max(u.fs, Hm.h * 0.36));
    }
  }
  addEventListener("error", (e) => G.errors.push(String(e.message)));
  for (const k of ["pink", "cyan", "gold"]) spawn(k, 0, 1.5, 0);
  confettiBurst(new Vector3(0, -5, 0), 5);
  renderer.compile(scene, camera);
  render(0.016);
  for (const c of cf) c.life = 0;
  while (balloons.length) removeBalloon(balloons[0]);
  {
    const q = state().quality;
    q.frames = 0;
    q.t0 = performance.now() + 500;
  }
  window.__dbg = { THREE: three_module_exports, scene, renderer, camera, RK: realism_exports };
  G.endNow = () => {
    if (G.state === "play") {
      ending = true;
      endRound();
    }
  };
  document.getElementById("loading").remove();
  BP.start();
  requestAnimationFrame(frame);
})().catch((e) => setTimeout(() => {
  throw e;
}));
