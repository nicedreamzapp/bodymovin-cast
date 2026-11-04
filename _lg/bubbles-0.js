import {
  environment,
  flash,
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
  CanvasTexture,
  Color,
  DynamicDrawUsage,
  FrontSide,
  InstancedMesh,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  Plane,
  PlaneGeometry,
  Raycaster,
  RepeatWrapping,
  SRGBColorSpace,
  SphereGeometry,
  Vector3
} from "./chunk-4IYDSAYK.js";
import "./chunk-NWIHTO7D.js";

// bmpage:bmpage:bubbles.html#0
(async () => {
  var _a, _b, _c;
  const BodyMovin = window.BodyMovin;
  const Q = new URLSearchParams(location.search), TV = Q.has("tv"), MUTE = Q.has("mute");
  const TVM = !!window.BP_TV;
  const NOSPAWN = Q.has("nospawn");
  const GAME_ID = "bubbles", ROUND = Math.max(15, +Q.get("round") || 75);
  const rnd = (a, b) => a + Math.random() * (b - a), clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;
  const pick = (a) => a[Math.random() * a.length | 0];
  const TAU = Math.PI * 2;
  window.__game = { round: ROUND, ready: false };
  const STILL = +((_a = Q.get("still")) != null ? _a : 0.08);
  const FAST = +((_b = Q.get("fast")) != null ? _b : 3.4);
  const COOL = +((_c = Q.get("cool")) != null ? _c : 350);
  const COLORS = [
    { id: "pink", name: "PINK", css: "#ff8fd0", tint: 16752856 },
    { id: "blue", name: "BLUE", css: "#6cc8ff", tint: 9228287 },
    { id: "green", name: "GREEN", css: "#78eb98", tint: 10285234 },
    { id: "violet", name: "PURPLE", css: "#b892ff", tint: 12888319 }
  ];
  const CRITTERS = ["butterfly", "blossom", "firefly"];
  const { scene, camera, renderer } = setup(document.getElementById("c"), { fov: 45 });
  const ENV = "greenwich_park", ENV_ROT = -1.4, D = 1.2;
  const SUN = new Vector3(0.682, 0.383, -0.623).normalize();
  camera.position.set(0, 1.3, 0);
  camera.lookAt(0, 1.36, -1);
  const hud = document.getElementById("hud"), ctx = hud.getContext("2d");
  let W = 0, H = 0, U = 0, DPR = 1, RB = 60, planeH = 1, planeW = 1.8;
  function resize() {
    DPR = Math.min(TVM ? 1 : 2, devicePixelRatio || 1);
    W = hud.width = Math.round(innerWidth * DPR);
    H = hud.height = Math.round(innerHeight * DPR);
    U = Math.min(W, H);
    RB = Math.max(0.075 * U, 0.043 * W);
    planeH = 2 * D * Math.tan(MathUtils.degToRad(camera.fov / 2));
    planeW = planeH * camera.aspect;
  }
  addEventListener("resize", () => setTimeout(resize, 0));
  resize();
  const ray = new Raycaster(), bubblePlane = new Plane(new Vector3(0, 0, 1), D);
  function worldAt(x, y, out = new Vector3()) {
    ray.setFromCamera({ x: x * 2 - 1, y: -(y * 2 - 1) }, camera);
    if (!ray.ray.intersectPlane(bubblePlane, out)) out.set(0, 1.3, -D);
    return out;
  }
  const pxToWorld = (px) => px / H * planeH;
  sun(scene, { position: SUN.clone().multiplyScalar(9).add(new Vector3(0, 1.3, -D)).toArray(), target: [0, 1.3, -D], size: 2, intensity: 2.2, color: 16774372 });
  function canvasTex(draw, n = 512, srgb = true) {
    const c = document.createElement("canvas");
    c.width = c.height = n;
    const g = c.getContext("2d");
    draw(g, n);
    const t = new CanvasTexture(c);
    if (srgb) t.colorSpace = SRGBColorSpace;
    t.wrapS = t.wrapT = RepeatWrapping;
    return t;
  }
  const filmTex = canvasTex((g, n) => {
    const im = g.createImageData(n, n);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const u = x / n * TAU, v = y / n * TAU;
      const s = 0.5 + 0.22 * Math.sin(u * 2 + Math.sin(v * 3) * 1.4) + 0.18 * Math.sin(v * 2 + Math.cos(u * 3) * 1.2) + 0.1 * Math.sin((u + v) * 5);
      const k = (y * n + x) * 4, val = clamp(s, 0, 1) * 255;
      im.data[k] = im.data[k + 1] = im.data[k + 2] = val;
      im.data[k + 3] = 255;
    }
    g.putImageData(im, 0, 0);
  }, 256, false);
  function filmMaterial(opts = {}) {
    var _a2, _b2, _c2, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q;
    if (window.BP_TV) return new MeshPhysicalMaterial({
      color: (_a2 = opts.color) != null ? _a2 : 16777215,
      metalness: 0,
      roughness: (_b2 = opts.rough) != null ? _b2 : 0.1,
      transmission: 0,
      opacity: 0.32 * (1.4 - ((_c2 = opts.transmission) != null ? _c2 : 1)),
      iridescence: (_d = opts.iri) != null ? _d : 1,
      iridescenceIOR: 1.33,
      iridescenceThicknessRange: (_e = opts.range) != null ? _e : [250, 620],
      iridescenceThicknessMap: filmTex,
      specularIntensity: 1,
      envMapIntensity: (_f = opts.env) != null ? _f : 3.4,
      transparent: true,
      depthWrite: false,
      side: FrontSide,
      sheen: (_g = opts.sheen) != null ? _g : 0.9,
      sheenColor: new Color((_h = opts.sheenColor) != null ? _h : 15267071),
      sheenRoughness: 0.35
    });
    return new MeshPhysicalMaterial({
      color: (_i = opts.color) != null ? _i : 16777215,
      metalness: 0,
      roughness: (_j = opts.rough) != null ? _j : 0.1,
      transmission: (_k = opts.transmission) != null ? _k : 1,
      thickness: 0,
      ior: 1.02,
      iridescence: (_l = opts.iri) != null ? _l : 1,
      iridescenceIOR: 1.33,
      iridescenceThicknessRange: (_m = opts.range) != null ? _m : [250, 620],
      iridescenceThicknessMap: filmTex,
      specularIntensity: 1,
      envMapIntensity: (_n = opts.env) != null ? _n : 3.4,
      transparent: true,
      depthWrite: false,
      side: FrontSide,
      attenuationColor: (_o = opts.att) != null ? _o : 16777215,
      attenuationDistance: 0.5,
      sheen: (_p = opts.sheen) != null ? _p : 0.9,
      sheenColor: new Color((_q = opts.sheenColor) != null ? _q : 15267071),
      sheenRoughness: 0.35
    });
  }
  const CLEAR = [filmMaterial(), filmMaterial({ range: [300, 750] }), filmMaterial({ range: [200, 520] })];
  const TINTED = COLORS.map((c) => filmMaterial({ color: c.tint, sheenColor: c.tint, range: [260, 640], env: 3 }));
  const GOLD = filmMaterial({ color: 16764762, transmission: 0.7, range: [300, 640], env: 3, att: 16760896, sheenColor: 16769696 });
  const RAINBOW = filmMaterial({ range: [120, 1100], env: 3.8, sheen: 1 });
  const STORM = filmMaterial({ color: 9080729, transmission: 0.55, range: [380, 520], env: 1.6, iri: 0.35, rough: 0.25, sheenColor: 10133674 });
  const sphereGeo = new SphereGeometry(1, 64, 40);
  function matFor(kind, col) {
    if (kind === "gold") return GOLD;
    if (kind === "rainbow") return RAINBOW;
    if (kind === "storm") return STORM;
    if (col >= 0) return TINTED[col];
    return pick(CLEAR);
  }
  function makeBubbleMesh(kind, col = -1) {
    const m = new Mesh(sphereGeo, matFor(kind, col));
    m.renderOrder = 3;
    m.rotation.set(rnd(-0.5, 0.5), rnd(0, TAU), rnd(-0.4, 0.4));
    scene.add(m);
    return m;
  }
  const MAXD = 700, mist = new InstancedMesh(new SphereGeometry(1, 8, 6), new MeshPhysicalMaterial({ roughness: 0.05, transparent: true, opacity: 0.6, depthWrite: false, clearcoat: 1 }), MAXD);
  mist.instanceMatrix.setUsage(DynamicDrawUsage);
  mist.frustumCulled = false;
  mist.renderOrder = 5;
  scene.add(mist);
  const drops = [], dM = new Matrix4(), dCol = new Color();
  for (let i = 0; i < MAXD; i++) {
    mist.setMatrixAt(i, new Matrix4().makeScale(0, 0, 0));
    mist.setColorAt(i, dCol.set("#ffffff"));
  }
  function popMist(pos, r, n, css) {
    for (let i = 0; i < n && drops.length < MAXD; i++) {
      const d = new Vector3(rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)).normalize();
      drops.push({
        p: pos.clone().addScaledVector(d, r * rnd(0.85, 1)),
        v: d.multiplyScalar(r * rnd(2, 6)),
        s: r * rnd(0.012, 0.03),
        t: 0,
        life: rnd(0.35, 0.7),
        col: css ? new Color(css).lerp(new Color("#ffffff"), Math.random() * 0.5) : new Color().setHSL(Math.random(), 0.6, 0.85)
      });
    }
  }
  mist.count = 0;
  function stepMist(dt) {
    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i];
      d.t += dt;
      d.v.y -= 1.2 * dt;
      d.v.multiplyScalar(0.94);
      d.p.addScaledVector(d.v, dt);
      if (d.t > d.life) drops.splice(i, 1);
    }
    const n = drops.length;
    if (!n && !mist.count) return;
    for (let i = 0; i < n; i++) {
      const d = drops[i], k = 1 - d.t / d.life;
      dM.makeScale(d.s * k, d.s * k, d.s * k).setPosition(d.p);
      mist.setMatrixAt(i, dM);
      mist.setColorAt(i, d.col);
    }
    mist.count = n;
    if (n) {
      mist.instanceMatrix.clearUpdateRanges();
      mist.instanceMatrix.addUpdateRange(0, n * 16);
      mist.instanceMatrix.needsUpdate = true;
      mist.instanceColor.clearUpdateRanges();
      mist.instanceColor.addUpdateRange(0, n * 3);
      mist.instanceColor.needsUpdate = true;
    }
  }
  const rainbowTex = canvasTex((g, n) => {
    const c = n / 2, R2 = n * 0.46, w = n * 0.05;
    const cols = ["#ff3b30", "#ff9500", "#ffcc00", "#34c759", "#30b0ff", "#5856d6", "#af52de"];
    cols.forEach((col, i) => {
      const r = R2 - i * w / cols.length * 1.6;
      g.strokeStyle = col;
      g.globalAlpha = 0.85;
      g.lineWidth = w * 0.42;
      g.filter = "blur(".concat(n * 6e-3, "px)");
      g.beginPath();
      g.arc(c, c, r, Math.PI, TAU);
      g.stroke();
    });
  }, 1024);
  const rainbow = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ map: rainbowTex, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false, toneMapped: false }));
  rainbow.position.set(0, -4, -40);
  rainbow.scale.set(46, 46, 1);
  rainbow.renderOrder = 1;
  scene.add(rainbow);
  let ac = null, master = null, dry = null, verbIn = null, noiseBuf = null, pad = null, audioErrors = 0;
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
      comp.threshold.value = -16;
      comp.ratio.value = 3;
      master.connect(comp);
      comp.connect(ac.destination);
      const len = ac.sampleRate * 3 | 0, ir = ac.createBuffer(2, len, ac.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const d = ir.getChannelData(ch);
        let lp = 0;
        for (let i = 0; i < len; i++) {
          lp += 0.5 * (Math.random() * 2 - 1 - lp);
          d[i] = lp * Math.pow(1 - i / len, 2.5) * 1.4;
        }
      }
      const verb = ac.createConvolver();
      verb.buffer = ir;
      verbIn = ac.createGain();
      const wet = ac.createGain();
      wet.gain.value = 0.45;
      verbIn.connect(verb);
      verb.connect(wet);
      wet.connect(master);
      dry = ac.createGain();
      dry.gain.value = 0.85;
      dry.connect(master);
      noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
      const nd = noiseBuf.getChannelData(0);
      for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
      if (ac.state === "suspended") ac.resume().catch(() => {
      });
    } catch (e) {
      ac = null;
      audioErrors++;
    }
  }
  addEventListener("pointerdown", () => {
    if (ac && ac.state === "suspended") ac.resume().catch(() => {
    });
  });
  function bus(pan = 0, send = 0.5) {
    const g = ac.createGain(), p = ac.createStereoPanner(), s = ac.createGain();
    p.pan.value = clamp(pan, -1, 1);
    s.gain.value = send;
    g.connect(p);
    p.connect(dry);
    p.connect(s);
    s.connect(verbIn);
    return g;
  }
  function tone(dest, type, f0, f1, t, dur, amp, attack = 3e-3) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + Math.min(dur, 0.06));
    g.gain.setValueAtTime(1e-4, t);
    g.gain.exponentialRampToValueAtTime(Math.max(2e-4, amp), t + attack);
    g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
    o.connect(g);
    g.connect(dest);
    o.start(t);
    o.stop(t + dur + 0.05);
  }
  function nz(dest, t, dur, type, f, q, amp, f1) {
    const n = ac.createBufferSource(), fl = ac.createBiquadFilter(), g = ac.createGain();
    n.buffer = noiseBuf;
    fl.type = type;
    fl.frequency.value = f;
    fl.Q.value = q;
    if (f1) fl.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(1e-4, t);
    g.gain.exponentialRampToValueAtTime(amp, t + Math.min(0.02, dur / 3));
    g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
    n.loop = true;
    n.connect(fl);
    fl.connect(g);
    g.connect(dest);
    n.start(t, Math.random() * 0.5);
    n.stop(t + dur + 0.02);
  }
  const PENTA = [196, 220, 261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.26, 783.99, 880, 1046.5, 1174.66];
  const noteFor = (y) => PENTA[clamp(Math.round((1 - clamp(y, 0, 1)) * (PENTA.length - 1)), 0, PENTA.length - 1)];
  const SND = {
    pop(f, pan, gold) {
      const t = ac.currentTime, o = bus(pan, 0.55);
      tone(o, "sine", f * 0.55, f, t, 0.07, 0.22, 2e-3);
      tone(o, "sine", f, f, t + 0.012, 1.1, 0.16, 5e-3);
      tone(o, "triangle", f * 2, f * 2, t + 0.012, 0.35, 0.03);
      nz(o, t, 0.025, "highpass", 3500, 0.7, 0.1);
      if (gold) {
        tone(o, "sine", f * 2.76, f * 2.76, t + 0.02, 1.6, 0.05);
        tone(o, "sine", f * 5.4, f * 5.4, t + 0.02, 0.8, 0.025);
        for (let i = 0; i < 5; i++) tone(o, "sine", PENTA[9 + i % 5], PENTA[9 + i % 5], t + 0.06 + i * 0.05, 0.4, 0.035);
      }
    },
    free(pan) {
      const t = ac.currentTime, o = bus(pan, 0.8);
      [1046.5, 1318.5, 1568, 2093].forEach((f, i) => {
        tone(o, "sine", f, f, t + 0.08 + i * 0.07, 0.9, 0.05);
        tone(o, "sine", f * 2.01, f * 2.01, t + 0.08 + i * 0.07, 0.4, 0.012);
      });
    },
    whoosh(pan) {
      const t = ac.currentTime, o = bus(pan, 0.3);
      nz(o, t, 0.32, "bandpass", 700, 1.2, 0.09, 2400);
    },
    storm(pan) {
      const t = ac.currentTime, o = bus(pan, 0.5);
      nz(o, t, 1.3, "lowpass", 160, 0.8, 0.35, 70);
      nz(o, t + 0.05, 1.4, "bandpass", 5200, 0.6, 0.05);
      tone(o, "sine", 330, 220, t, 0.4, 0.08);
      tone(o, "sine", 262, 196, t + 0.18, 0.5, 0.07);
    },
    dodge() {
      const t = ac.currentTime, o = bus(0, 0.6);
      tone(o, "sine", 880, 880, t, 0.5, 0.05);
      tone(o, "sine", 1174.66, 1174.66, t + 0.07, 0.6, 0.04);
    },
    grass(pan) {
      const t = ac.currentTime, o = bus(pan, 0.3);
      tone(o, "sine", 300, 180, t, 0.08, 0.05, 2e-3);
      nz(o, t, 0.02, "highpass", 3e3, 0.7, 0.03);
    },
    wave() {
      const t = ac.currentTime, o = bus(0, 0.8);
      [523.25, 659.26, 783.99, 1046.5, 1318.5].forEach((f, i) => tone(o, "sine", f, f, t + i * 0.09, 1.1, 0.07));
    },
    beep(hi) {
      const t = ac.currentTime, o = bus(0, 0.4), f = hi ? 783.99 : 392;
      tone(o, "sine", f * 0.6, f, t, hi ? 0.9 : 0.35, 0.18);
    },
    fanfare() {
      const t = ac.currentTime, o = bus(0, 0.7);
      [392, 523.25, 659.26, 783.99, 1046.5].forEach((f, i) => {
        tone(o, "sine", f * 0.6, f, t + i * 0.1, 1.2, 0.13);
        tone(o, "triangle", f / 2, f / 2, t + i * 0.1, 0.9, 0.05);
      });
    },
    hug(two) {
      const t = ac.currentTime, o = bus(0, 0.8);
      tone(o, "sine", 90, 180, t, 0.5, 0.35, 4e-3);
      nz(o, t, 0.05, "highpass", 2500, 0.7, 0.2);
      [261.63, 329.63, 392, 523.25, 659.26, 783.99, 1046.5].forEach((f, i) => {
        if (!two && i > 4) return;
        tone(o, "sine", f * 0.6, f, t + 0.04 + i * 0.06, 1.4, 0.1);
        tone(o, "triangle", f * 2, f * 2, t + 0.04 + i * 0.06, 0.5, 0.025);
      });
    },
    rainbow() {
      const t = ac.currentTime, o = bus(0, 0.9);
      PENTA.forEach((f, i) => tone(o, "sine", f, f, t + i * 0.035, 1, 0.07));
      nz(o, t, 1, "bandpass", 6e3, 2, 0.06);
    },
    click() {
      const t = ac.currentTime, o = bus(0, 0.3);
      tone(o, "sine", 660, 990, t, 0.15, 0.12);
    }
  };
  function play(name, ...a) {
    if (!ac) return;
    try {
      SND[name](...a);
    } catch (e) {
      audioErrors++;
    }
  }
  function padOn() {
    if (!ac || pad) return;
    try {
      const g = ac.createGain();
      g.gain.value = 1e-4;
      const o = bus(0, 0.9);
      g.connect(o);
      const nodes = [];
      for (const [f, d] of [[130.81, -5], [196, 4], [261.63, 0], [329.63, -3], [392, 6]]) {
        const os = ac.createOscillator();
        os.type = "triangle";
        os.frequency.value = f;
        os.detune.value = d;
        const lp = ac.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 900;
        os.connect(lp);
        lp.connect(g);
        os.start();
        nodes.push(os);
      }
      const lfo = ac.createOscillator(), la = ac.createGain();
      lfo.frequency.value = 0.12;
      la.gain.value = 6e-3;
      lfo.connect(la);
      la.connect(g.gain);
      lfo.start();
      nodes.push(lfo);
      g.gain.setTargetAtTime(0.018, ac.currentTime, 1.5);
      pad = { g, nodes };
    } catch (e) {
      audioErrors++;
    }
  }
  function padOff() {
    if (!pad) return;
    const p = pad;
    pad = null;
    try {
      p.g.gain.setTargetAtTime(1e-4, ac.currentTime, 0.8);
      setTimeout(() => p.nodes.forEach((n) => n.stop()), 4e3);
    } catch (e) {
      audioErrors++;
    }
  }
  const WAVES = [
    {
      name: "A gentle breeze",
      sub: "bubbles float down from the sky",
      a: 0,
      b: 0.3,
      from: { top: 1 },
      cap: [4, 5],
      gap: [1500, 1250],
      speed: 0.9,
      mix: { treasure: 0.16, gold: 0.05 },
      cluster: [0.45],
      hug: []
    },
    {
      name: "Wind from the sides",
      sub: "leave the grey storm bubbles alone",
      a: 0.335,
      b: 0.645,
      from: { top: 0.4, left: 0.3, right: 0.3 },
      cap: [5, 7],
      gap: [1300, 1e3],
      speed: 1,
      mix: { treasure: 0.12, gold: 0.06, split: 0.12, storm: 0.13, cluster: 0.07 },
      cluster: [],
      hug: [0.45]
    },
    {
      name: "Bubble party!",
      sub: "catch the rainbow bubble",
      a: 0.68,
      b: 1,
      from: { top: 0.4, left: 0.3, right: 0.3 },
      cap: [6, 8],
      gap: [1100, 850],
      speed: 1.12,
      mix: { treasure: 0.12, gold: 0.06, split: 0.1, storm: 0.15, cluster: 0.1 },
      cluster: [],
      hug: [0.2],
      rainbow: [0.5]
    }
  ];
  let state2 = "loading", tState = 0, roundStart = 0, lastNow = 0, frames = 0;
  let score = 0, popped = 0, golds = 0, treasures = 0, rainbows = 0, hugs = 0, hugsTwo = 0, splits = 0, clusters = 0, storms = 0, stormsDodged = 0;
  let missed = 0, spawned = 0, blown = 0, bounced = 0, streak = 0, streakCol = -1, bestStreak = 0, ease = 0;
  let nextSpawn = 0, nextAttract = 0, scoreBump = 0, waveIdx = -1, waveDone = {}, stormsSeen = 0, lastGentleHint = 0, rainbowAt = 0;
  let endStats = null, tvAutoAt = 0, armedAt = 0, focus = 0, lastBeep = -1, uid = 0;
  const bubbles = [], notes = [], texts = [], critters = [], rain = [], popQueue = [];
  const handCool = { left: 0, right: 0 }, prevHand = { left: null, right: null };
  const clicks = [];
  let keyPress = null;
  addEventListener("pointerdown", (e) => clicks.push({ x: e.clientX * DPR, y: e.clientY * DPR }));
  addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      keyPress = "enter";
      e.preventDefault();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Tab") {
      keyPress = e.key === "ArrowLeft" ? "left" : "right";
      e.preventDefault();
    } else if (e.key === "Escape") keyPress = "escape";
  });
  const progress = () => state2 === "play" ? clamp((lastNow - roundStart) / 1e3 / ROUND, 0, 1) : 0;
  function waveAt(p) {
    return WAVES.findIndex((w) => p >= w.a && p < w.b);
  }
  function weighted(obj) {
    let s = 0;
    for (const k in obj) s += obj[k];
    let r = Math.random() * s;
    for (const k in obj) {
      r -= obj[k];
      if (r <= 0) return k;
    }
    return Object.keys(obj)[0];
  }
  const SIZE = { normal: [0.85, 1.2], cluster: [0.78, 0.78], split: [1.55, 1.55], mini: [0.72, 0.8], gold: [1, 1], rainbow: [1.12, 1.12], treasure: [1.3, 1.3], storm: [1.08, 1.15], hug: [2.1, 2.1] };
  function spawnBubble(kind = "normal", o = {}) {
    var _a2, _b2, _c2, _d;
    const wv = WAVES[Math.max(0, waveIdx)] || WAVES[0];
    const sc = ((_a2 = o.speed) != null ? _a2 : state2 === "play" ? wv.speed : 0.8) * (1 - 0.3 * ease);
    const size = (_b2 = o.size) != null ? _b2 : rnd(...SIZE[kind]);
    const from = (_c2 = o.from) != null ? _c2 : kind === "hug" ? "top" : weighted(state2 === "play" ? wv.from : { top: 0.6, left: 0.2, right: 0.2 });
    const rx = size * RB / W, ry = size * RB / H;
    let x, y, vx, vy;
    const clearOf = (px, py) => !bubbles.some((b2) => !b2.dead && Math.hypot((b2.x - px) * W, (b2.y - py) * H) < (b2.r + size) * RB * 1.05);
    if (from === "top") {
      for (let t = 0; t < 8; t++) {
        x = rnd(0.2, 0.8);
        if (clearOf(x, -ry)) break;
      }
      y = -ry - 0.01;
      vx = rnd(-0.025, 0.025);
      vy = rnd(0.055, 0.1) * sc;
    } else {
      const s = from === "left" ? 1 : -1;
      for (let t = 0; t < 8; t++) {
        y = rnd(0.26, 0.66);
        if (clearOf(s > 0 ? -rx : 1 + rx, y)) break;
      }
      x = s > 0 ? -rx - 0.01 : 1 + rx + 0.01;
      vx = s * rnd(0.065, 0.115) * sc;
      vy = rnd(-6e-3, 0.02);
    }
    if (o.x !== void 0) x = o.x;
    if (o.y !== void 0) y = o.y;
    if (o.vx !== void 0) vx = o.vx;
    if (o.vy !== void 0) vy = o.vy;
    let col = -1;
    if (kind === "normal" || kind === "cluster" || kind === "split" || kind === "mini") {
      col = (_d = o.col) != null ? _d : streakCol >= 0 && Math.random() < 0.3 ? streakCol : Math.random() * COLORS.length | 0;
    }
    const b = {
      id: ++uid,
      kind,
      col,
      x,
      y,
      vx,
      vy,
      ix: 0,
      iy: 0,
      r: size,
      from,
      born: lastNow,
      ph: rnd(0, TAU),
      wf: rnd(0.35, 0.7),
      wob: rnd(0.01, 0.022),
      spin: rnd(-0.4, 0.4),
      attract: !!o.attract,
      entered: false,
      immune: o.immune || 0,
      appear: 0,
      nudgeAt: 0,
      blowAt: 0
    };
    if (kind === "treasure") b.critter = o.critter || pick(CRITTERS);
    if (kind === "hug") {
      b.x = rnd(0.42, 0.58);
      b.y = -ry - 0.01;
      b.vx = 0;
      b.vy = 0.22;
      b.stopY = rnd(0.38, 0.44);
      b.hold = 9e3;
      b.hugT = 0;
      b.solo = 0;
    }
    if (kind === "storm" && !b.attract) b.warn = ++stormsSeen <= 3;
    b.obj = makeBubbleMesh(kind, col);
    bubbles.push(b);
    if (!b.attract && kind !== "mini") spawned++;
    return b;
  }
  function spawnCluster(o = {}) {
    var _a2;
    const n = o.n || (Math.random() < 0.5 ? 3 : 4), col = (_a2 = o.col) != null ? _a2 : Math.random() * COLORS.length | 0;
    const lead = spawnBubble("cluster", { ...o, col }), d = lead.r * RB * 1.72;
    const offs = n === 3 ? [[0, 0], [d, 0], [d / 2, d * 0.866]] : [[0, 0], [d, 0], [d / 2, d * 0.866], [d / 2, -d * 0.866]];
    const tv = lead.from === "top" ? [0, 1] : lead.from === "left" ? [1, 0] : [-1, 0], nv = [-tv[1], tv[0]];
    const grp = [lead];
    for (let i = 1; i < n; i++) {
      const [bk, sd] = offs[i];
      grp.push(spawnBubble("cluster", { ...o, col, size: lead.r, from: lead.from, x: lead.x + (-tv[0] * bk + nv[0] * sd) / W, y: lead.y + (-tv[1] * bk + nv[1] * sd) / H, vx: lead.vx, vy: lead.vy }));
    }
    for (const m of grp) {
      m.grp = grp;
      m.ph = lead.ph;
      m.wf = lead.wf;
      m.wob = lead.wob;
    }
    return grp;
  }
  function spawnKind(kind, o = {}) {
    return kind === "cluster" ? spawnCluster(o)[0] : spawnBubble(kind, o);
  }
  function removeBubble(b) {
    scene.remove(b.obj);
  }
  function impulse(b, ix, iy) {
    for (const m of b.grp ? b.grp.filter((m2) => !m2.dead) : [b]) {
      m.ix = clamp(m.ix + ix, -0.9, 0.9);
      m.iy = clamp(m.iy + iy, -0.9, 0.9);
    }
  }
  function bubbleCss(b) {
    return b.kind === "gold" ? "#ffd36a" : b.kind === "storm" ? "#9aa3ad" : b.col >= 0 ? COLORS[b.col].css : null;
  }
  function popBubble(b, now, how) {
    if (b.dead) return;
    b.dead = true;
    const x = b.x * W, y = b.y * H, r = b.r * RB, scoring = state2 === "play" && !b.attract, pan = b.x * 2 - 1;
    popMist(b.obj.position, b.obj.scale.x, b.kind === "gold" || b.kind === "rainbow" ? 70 : b.kind === "hug" ? 260 : 40, bubbleCss(b));
    removeBubble(b);
    if (how === "grass") {
      play("grass", pan);
      if (b.kind === "treasure") releaseCritter(b.critter, x, y, r, now);
      if (scoring && b.kind !== "mini") {
        missed++;
        ease = Math.min(1, ease + 0.08);
      }
      return;
    }
    if (b.kind === "storm") {
      play("storm", pan);
      flash(4212826, 0.12);
      for (let i = 0; i < 46; i++) rain.push({ x: x + rnd(-r, r) * 1.1, y: y + rnd(-r * 0.3, r * 0.5), vy: rnd(0.9, 1.3) * U, t: now + i * 22, len: rnd(0.02, 0.035) * U });
      texts.push({ x: clamp(x, W * 0.15, W * 0.85), y: clamp(y - r * 1.1, H * 0.24, H * 0.9), text: "oops!", col: "#cfd8e6", size: 0.045, t: now, life: 1300 });
      if (!scoring) return;
      storms++;
      score = Math.max(0, score - 20);
      streak = 0;
      streakCol = -1;
      scoreBump = 0.6;
      return;
    }
    let note = noteFor(b.y);
    if (b.col >= 0 && b.col === streakCol && streak >= 1) note = PENTA[clamp(5 + streak, 0, PENTA.length - 1)];
    play("pop", note, pan, b.kind === "gold" || b.kind === "rainbow");
    notes.push({ x, y: y - r * 0.2, hue: b.col >= 0 ? [325, 200, 140, 265][b.col] : b.kind === "gold" ? 45 : rnd(0, 360), t: now, glyph: Math.random() < 0.5 ? "♪" : "♫", dx: rnd(-0.05, 0.05) * U });
    if (b.kind === "treasure") {
      releaseCritter(b.critter, x, y, r, now);
      play("free", pan);
    }
    if (b.kind === "split") {
      for (let i = 0; i < 3; i++) {
        const a = -Math.PI / 2 + (i - 1) * 2.1 + rnd(-0.2, 0.2);
        const m = spawnBubble("mini", { col: b.col, size: 0.72, x: b.x, y: b.y, vx: b.vx * 0.5, vy: Math.min(0.05, b.vy), from: b.from, attract: b.attract, immune: now + 350 });
        m.entered = true;
        m.ix = Math.cos(a) * 0.32;
        m.iy = Math.sin(a) * 0.32;
        m.born = now;
      }
    }
    if (b.grp) {
      let k = 0;
      for (const m of b.grp) if (!m.dead && m !== b && !popQueue.some((q) => q.b === m)) popQueue.push({ b: m, at: now + 90 * ++k, how: "chain" });
      if (k && scoring && how !== "chain") clusters++;
    }
    if (b.kind === "rainbow") {
      rainbowAt = now;
      play("rainbow");
      flash(16777215, 0.15);
      let c = streakCol;
      if (c < 0) {
        const cnt = [0, 0, 0, 0];
        bubbles.forEach((o) => {
          if (!o.dead && o.col >= 0) cnt[o.col]++;
        });
        c = cnt.indexOf(Math.max(...cnt));
      }
      if (!b.attract) bubbles.filter((o) => !o.dead && o.col === c && !o.attract).sort((p, q) => Math.hypot(p.x - b.x, p.y - b.y) - Math.hypot(q.x - b.x, q.y - b.y)).forEach((o, i) => {
        if (!popQueue.some((q) => q.b === o)) popQueue.push({ b: o, at: now + 160 + i * 110, how: "chain" });
      });
      if (scoring) {
        streakCol = c;
        streak = Math.max(1, streak);
      }
    }
    if (!scoring) return;
    popped++;
    ease = Math.max(0, ease - 0.03);
    let pts, lbl, lcol = "#ffffff";
    if (b.kind === "gold") {
      golds++;
      pts = 40;
      lbl = "+".concat(pts, " ★");
      lcol = "#ffd84a";
    } else if (b.kind === "treasure") {
      treasures++;
      pts = 25;
      lbl = "".concat({ butterfly: "butterfly", blossom: "blossom", firefly: "firefly" }[b.critter], " free! +").concat(pts);
      lcol = "#fff2b0";
    } else if (b.kind === "rainbow") {
      rainbows++;
      pts = 50;
      lbl = "RAINBOW! +".concat(pts);
      lcol = "#fff3a0";
    } else {
      if (b.col === streakCol) streak++;
      else {
        streak = 1;
        streakCol = b.col;
      }
      bestStreak = Math.max(bestStreak, streak);
      const mult = Math.min(5, streak);
      pts = 10 * mult;
      lbl = mult > 1 ? "+".concat(pts, "  x").concat(mult) : "+".concat(pts);
      lcol = mult > 1 ? COLORS[b.col].css : "#ffffff";
      if (b.kind === "split") splits++;
      if (streak === 5 && how !== "chain") banner("".concat(COLORS[b.col].name, " x5 COMBO!"), COLORS[b.col].css, 0.07, 1300);
    }
    score += pts;
    scoreBump = b.kind === "normal" || b.kind === "mini" || b.kind === "cluster" ? 1 : 1.6;
    texts.push({ x: clamp(x, W * 0.15, W * 0.85), y: clamp(y - r * 0.95, H * 0.24, H * 0.92), text: lbl, col: lcol, size: b.kind === "normal" || b.kind === "mini" || b.kind === "cluster" ? 0.045 : 0.055, t: now, life: 950 });
  }
  function banner(text, col, size, life) {
    for (let i = texts.length - 1; i >= 0; i--) if (texts[i].banner) texts.splice(i, 1);
    texts.push({ x: W * 0.025, y: H * 0.32, text, col, size, t: lastNow, life, banner: true, side: true });
  }
  function hugPop(b, now, two) {
    b.dead = true;
    const x = b.x * W, y = b.y * H, r = b.r * RB, scoring = state2 === "play" && !b.attract;
    popMist(b.obj.position, b.obj.scale.x, 260, null);
    removeBubble(b);
    shake(0.25);
    flash(16777215, 0.18);
    for (let i = 0; i < 4; i++) notes.push({ x: x + rnd(-r, r) * 0.6, y: y + rnd(-r, r) * 0.4, hue: rnd(0, 360), t: now + i * 90, glyph: i % 2 ? "♫" : "♪", dx: rnd(-0.08, 0.08) * U });
    const col = Math.random() * COLORS.length | 0;
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI / 2 + (i - 3) * 0.5, m = spawnBubble("mini", { col, size: 0.75, x: b.x + Math.cos(a) * r * 0.4 / W, y: b.y + Math.sin(a) * r * 0.4 / H, vx: 0, vy: rnd(0.03, 0.06), attract: !scoring, immune: now + 400 });
      m.entered = true;
      m.ix = Math.cos(a) * rnd(0.25, 0.4);
      m.iy = Math.sin(a) * rnd(0.25, 0.4);
      m.born = now;
    }
    play("hug", two);
    scoreBump = 2;
    if (!scoring) return;
    hugs++;
    if (two) hugsTwo++;
    popped++;
    const pts = two ? 60 : 30;
    score += pts;
    banner(two ? "BIG HUG!  +".concat(pts) : "POP!  +".concat(pts), "#ffc8ec", 0.08, 1400);
  }
  function checkHands(now, dt) {
    if (state2 === "count" || state2 === "end" || state2 === "loading") return;
    const handR = 0.034 * U;
    for (const side of ["left", "right"]) {
      const h = BodyMovin.hands[side];
      if (!h.seen) {
        prevHand[side] = null;
        continue;
      }
      const hx = h.x * W, hy = h.y * H, p0 = prevHand[side] || { x: hx, y: hy };
      prevHand[side] = { x: hx, y: hy };
      const up = h.raised !== false || BodyMovin.mouse || BodyMovin.simulating;
      const sp = h.speed, mode = sp < STILL ? "still" : sp > FAST ? "fast" : "touch", ready = now >= handCool[side];
      for (const b of bubbles) {
        if (b.dead || b.kind === "hug" || b.appear < 0.6) continue;
        const rr = b.r * RB * b.appear, sx = rr + handR, sy = (rr + handR) * 1.15;
        const ax = (p0.x - b.x * W) / sx, ay = (p0.y - b.y * H) / sy, bx = (hx - b.x * W) / sx, by = (hy - b.y * H) / sy;
        const ddx = bx - ax, ddy = by - ay, l2 = ddx * ddx + ddy * ddy, t = l2 ? clamp(-(ax * ddx + ay * ddy) / l2, 0, 1) : 1;
        const qx = ax + ddx * t, qy = ay + ddy * t, d2 = qx * qx + qy * qy;
        let hit = d2 < 1;
        if (!hit && mode === "touch" && d2 < 1.35 * 1.35 && sp > 0.4) {
          const dx = b.x * W - hx, dy = b.y * H - hy, dl = Math.hypot(dx, dy) || 1;
          hit = (h.vx * W * dx + h.vy * H * dy) / (dl * Math.hypot(h.vx * W, h.vy * H) || 1) > 0.8;
        }
        if (!hit || !up) continue;
        if (mode === "touch" && ready && now >= b.immune) {
          popBubble(b, now, "hand");
          handCool[side] = now + COOL;
          break;
        }
        if (mode === "fast") {
          if (now - b.blowAt > 500) {
            b.blowAt = now;
            if (state2 === "play") blown++;
            play("whoosh", b.x * 2 - 1);
            if (state2 === "play" && now - lastGentleHint > 3500) {
              lastGentleHint = now;
              texts.push({ x: clamp(b.x * W, W * 0.15, W * 0.85), y: clamp(b.y * H - rr * 1.2, H * 0.24, H * 0.9), text: "gently!", col: "#e8f6ff", size: 0.045, t: now, life: 1100 });
            }
          }
          const k = clamp(0.35 / Math.max(0.01, sp), 0, 0.25);
          impulse(b, h.vx * k, h.vy * k);
        } else if (mode === "still" && ready && now >= b.immune && (b.rest = (now - (b.restAt || 0) < 150 ? b.rest || 0 : 0) + dt, b.restAt = now, b.rest > 0.45)) {
          popBubble(b, now, "hand");
          handCool[side] = now + COOL;
          break;
        } else {
          const dx = b.x * W - hx, dy = b.y * H - hy, dl = Math.hypot(dx, dy) || 1;
          if (now - b.nudgeAt > 400) {
            b.nudgeAt = now;
            if (state2 === "play") bounced++;
          }
          impulse(b, dx / dl * 4 * dt * H / W, dy / dl * 4 * dt);
        }
      }
    }
    for (const b of bubbles) {
      if (b.dead || b.kind !== "hug") continue;
      const r = b.r * RB, inn = ["left", "right"].map((sd) => {
        const h = BodyMovin.hands[sd];
        if (!h.seen) return false;
        const dx = (h.x * W - b.x * W) / (r * 1.35), dy = (h.y * H - b.y * H) / (r * 1.45);
        return dx * dx + dy * dy < 1;
      });
      b.inL = inn[0];
      b.inR = inn[1];
      if (inn[0] && inn[1]) {
        b.hugT += dt;
        if (b.hugT > 0.12) hugPop(b, now, true);
      } else {
        b.hugT = 0;
        if (inn[0] || inn[1]) {
          b.solo += dt;
          if (b.solo > 1.6) hugPop(b, now, false);
        } else b.solo = Math.max(0, b.solo - dt * 2);
      }
    }
    if (state2 === "play" || state2 === "title") for (const c of clicks) {
      const b = bubbles.find((o) => !o.dead && o.kind !== "hug" && Math.hypot(c.x - o.x * W, c.y - o.y * H) < o.r * RB * 1.1);
      if (b) {
        popBubble(b, now, "hand");
        c.used = true;
      }
    }
  }
  function releaseCritter(type, x, y, r, now) {
    const dir = x < W / 2 ? 1 : -1, s = r * 0.62;
    if (type === "blossom") {
      for (let i = 0; i < 6; i++) {
        const a = i * TAU / 6;
        critters.push({ type: "petal", x: x + Math.cos(a) * s * 0.35, y: y + Math.sin(a) * s * 0.35, vx: Math.cos(a) * U * rnd(0.08, 0.16), vy: Math.sin(a) * U * 0.1 - U * 0.05, rot: a, vr: rnd(-3, 3), s: s * 0.42, t0: now, life: 3600, ph: rnd(0, TAU) });
      }
      critters.push({ type: "sparkle", x, y, s: s * 1.6, t0: now, life: 900 });
      return;
    }
    critters.push({ type, x0: x, y0: y, x, y, dir, s, t0: now, life: type === "butterfly" ? 4800 : 4200, ph: rnd(0, TAU) });
    critters.push({ type: "sparkle", x, y, s: s * 1.6, t0: now, life: 900 });
  }
  const parts = /* @__PURE__ */ new Map();
  function partSprite(kind, s, draw, ext) {
    const step = Math.round(Math.log(Math.max(4, s)) / Math.log(1.08)), ss = Math.pow(1.08, step), key = kind + step;
    let sp = parts.get(key);
    if (!sp) {
      if (parts.size > 120) parts.clear();
      const pad2 = 3, c = document.createElement("canvas");
      c.width = Math.ceil((ext[2] - ext[0]) * ss) + pad2 * 2;
      c.height = Math.ceil((ext[3] - ext[1]) * ss) + pad2 * 2;
      const g = c.getContext("2d");
      g.translate(pad2 - ext[0] * ss, pad2 - ext[1] * ss);
      draw(g, ss);
      sp = { c, ox: pad2 - ext[0] * ss, oy: pad2 - ext[1] * ss, ss };
      parts.set(key, sp);
    }
    const k = s / sp.ss;
    ctx.drawImage(sp.c, -sp.ox * k, -sp.oy * k, sp.c.width * k, sp.c.height * k);
  }
  function drawWings(ctx2, s) {
    for (const [up, w, h, oy] of [[1, 0.95, 0.72, -0.12], [0, 0.66, 0.56, 0.24]]) {
      const p = new Path2D();
      const cx = w * 0.52 * s, cy = (oy - (up ? 0.12 : -0.08)) * s;
      p.ellipse(cx, cy, w * 0.52 * s, h * 0.5 * s, up ? -0.5 : 0.45, 0, TAU);
      const g = ctx2.createRadialGradient(s * 0.12, oy * s, s * 0.05, cx, cy, w * 0.62 * s);
      g.addColorStop(0, "#ffb53c");
      g.addColorStop(0.55, "#f07a12");
      g.addColorStop(0.85, "#b5420a");
      g.addColorStop(1, "#2a160c");
      ctx2.fillStyle = g;
      ctx2.fill(p);
      ctx2.lineWidth = Math.max(1, s * 0.07);
      ctx2.strokeStyle = "#1d120c";
      ctx2.stroke(p);
      ctx2.strokeStyle = "rgba(30,18,10,0.75)";
      ctx2.lineWidth = Math.max(0.7, s * 0.025);
      for (let v = 0; v < 3; v++) {
        const a = (up ? -0.9 : 0.2) + v * 0.35;
        ctx2.beginPath();
        ctx2.moveTo(s * 0.05, oy * s * 0.5);
        ctx2.lineTo(Math.cos(a) * w * 0.9 * s, oy * s + Math.sin(a) * h * 0.55 * s);
        ctx2.stroke();
      }
      ctx2.fillStyle = "rgba(255,255,255,0.92)";
      for (let v = 0; v < 4; v++) {
        const a = (up ? -1.2 : -0.1) + v * 0.42;
        ctx2.beginPath();
        ctx2.arc(cx + Math.cos(a) * w * 0.44 * s, cy + Math.sin(a) * h * 0.42 * s, s * 0.035, 0, TAU);
        ctx2.fill();
      }
    }
  }
  function drawButterfly(x, y, s, flap, alpha = 1, tilt = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);
    ctx.globalAlpha *= alpha;
    const open = 0.18 + 0.82 * Math.abs(Math.cos(flap));
    for (const sd of [-1, 1]) {
      ctx.save();
      ctx.scale(sd * open, 1);
      if (TVM) partSprite("wing", s, drawWings, [-0.1, -0.8, 1.15, 0.65]);
      else drawWings(ctx, s);
      ctx.restore();
    }
    ctx.fillStyle = "#20140e";
    ctx.beginPath();
    ctx.ellipse(0, s * 0.05, s * 0.07, s * 0.42, 0, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "#20140e";
    ctx.lineWidth = Math.max(1, s * 0.03);
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.33);
    ctx.quadraticCurveTo(-s * 0.12, -s * 0.6, -s * 0.22, -s * 0.66);
    ctx.moveTo(0, -s * 0.33);
    ctx.quadraticCurveTo(s * 0.12, -s * 0.6, s * 0.22, -s * 0.66);
    ctx.stroke();
    ctx.restore();
  }
  function drawPetal(x, y, s, rot, alpha = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.globalAlpha *= alpha;
    if (TVM) {
      partSprite("petal", s, petalArt, [-0.05, -0.4, 1.05, 0.4]);
      ctx.restore();
      return;
    }
    petalArt(ctx, s);
    ctx.restore();
  }
  function petalArt(ctx2, s) {
    const g = ctx2.createLinearGradient(0, 0, s, 0);
    g.addColorStop(0, "#ffd2e6");
    g.addColorStop(0.6, "#ff9cc8");
    g.addColorStop(1, "#ff7fb6");
    ctx2.fillStyle = g;
    ctx2.beginPath();
    ctx2.moveTo(0, 0);
    ctx2.bezierCurveTo(s * 0.35, -s * 0.42, s * 0.95, -s * 0.32, s, 0);
    ctx2.bezierCurveTo(s * 0.95, s * 0.32, s * 0.35, s * 0.42, 0, 0);
    ctx2.fill();
    ctx2.strokeStyle = "rgba(200,60,120,0.35)";
    ctx2.lineWidth = Math.max(0.7, s * 0.04);
    ctx2.beginPath();
    ctx2.moveTo(s * 0.1, 0);
    ctx2.lineTo(s * 0.75, 0);
    ctx2.stroke();
  }
  function drawBlossom(x, y, s, rot) {
    for (let i = 0; i < 6; i++) drawPetal(x, y, s * 0.55, rot + i * TAU / 6);
    const g = ctx.createRadialGradient(x, y, 0, x, y, s * 0.18);
    g.addColorStop(0, "#fff7b0");
    g.addColorStop(1, "#f2b81e");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, s * 0.16, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#c47a10";
    for (let i = 0; i < 7; i++) {
      const a = i * TAU / 7 + rot;
      ctx.beginPath();
      ctx.arc(x + Math.cos(a) * s * 0.1, y + Math.sin(a) * s * 0.1, s * 0.022, 0, TAU);
      ctx.fill();
    }
  }
  function drawFirefly(x, y, s, glow, alpha = 1) {
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.globalCompositeOperation = "lighter";
    const g = ctx.createRadialGradient(x, y, 0, x, y, s * (0.55 + 0.45 * glow));
    g.addColorStop(0, "rgba(255,255,200,".concat(0.95 * glow + 0.05, ")"));
    g.addColorStop(0.25, "rgba(220,255,90,".concat(0.6 * glow, ")"));
    g.addColorStop(1, "rgba(160,255,60,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, s, 0, TAU);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.fillStyle = "#2a2418";
    ctx.beginPath();
    ctx.ellipse(x, y - s * 0.12, s * 0.07, s * 0.12, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "rgba(230,240,255,0.55)";
    ctx.beginPath();
    ctx.ellipse(x - s * 0.1, y - s * 0.2, s * 0.1, s * 0.05, 0.6, 0, TAU);
    ctx.ellipse(x + s * 0.1, y - s * 0.2, s * 0.1, s * 0.05, -0.6, 0, TAU);
    ctx.fill();
    ctx.restore();
  }
  function drawCloud(x, y, s, now) {
    ctx.save();
    const fl = Math.sin(now / 90) > 0.93 ? 1 : 0;
    ctx.strokeStyle = "rgba(200,220,255,0.75)";
    ctx.lineWidth = Math.max(1, s * 0.04);
    ctx.lineCap = "round";
    for (let i = 0; i < 4; i++) {
      const dx = (i - 1.5) * s * 0.22, k = (now / 600 + i * 0.27) % 1;
      ctx.globalAlpha = 1 - k;
      ctx.beginPath();
      ctx.moveTo(x + dx, y + s * 0.18 + k * s * 0.4);
      ctx.lineTo(x + dx - s * 0.04, y + s * 0.3 + k * s * 0.4);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    const g = ctx.createLinearGradient(0, y - s * 0.4, 0, y + s * 0.2);
    g.addColorStop(0, "#9aa2ae");
    g.addColorStop(1, "#4c5260");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x - s * 0.25, y, s * 0.2, 0, TAU);
    ctx.arc(x, y - s * 0.12, s * 0.27, 0, TAU);
    ctx.arc(x + s * 0.27, y + s * 0.01, s * 0.19, 0, TAU);
    ctx.rect(x - s * 0.25, y, s * 0.52, s * 0.18);
    ctx.fill();
    if (fl) {
      ctx.fillStyle = "#fff6b0";
      ctx.beginPath();
      ctx.moveTo(x + s * 0.02, y + s * 0.1);
      ctx.lineTo(x - s * 0.08, y + s * 0.34);
      ctx.lineTo(x + s * 0.02, y + s * 0.32);
      ctx.lineTo(x - s * 0.04, y + s * 0.52);
      ctx.lineTo(x + s * 0.12, y + s * 0.26);
      ctx.lineTo(x + s * 0.03, y + s * 0.28);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
  function drawCritters(now, dt) {
    for (let i = critters.length - 1; i >= 0; i--) {
      const c = critters[i], k = (now - c.t0) / c.life;
      if (k >= 1) {
        critters.splice(i, 1);
        continue;
      }
      const a = k > 0.8 ? (1 - k) / 0.2 : 1, t = (now - c.t0) / 1e3;
      if (c.type === "butterfly") {
        const x = c.x0 + c.dir * U * 0.2 * t + Math.sin(t * 2.4 + c.ph) * U * 0.05, y = c.y0 - U * 0.15 * t - Math.abs(Math.sin(t * 4)) * U * 0.02;
        drawButterfly(x, y, c.s * (1 + 0.25 * k), t * 15, a, c.dir * 0.25 + Math.sin(t * 3) * 0.15);
      } else if (c.type === "firefly") {
        const x = c.x0 + Math.sin(t * 1.7 + c.ph) * U * 0.08 + c.dir * U * 0.05 * t, y = c.y0 - U * 0.11 * t;
        drawFirefly(x, y, c.s * 0.8, 0.5 + 0.5 * Math.sin(t * 7), a);
      } else if (c.type === "petal") {
        c.vx *= Math.pow(0.4, dt);
        c.vy = c.vy * Math.pow(0.4, dt) + U * 0.09 * dt;
        c.x += (c.vx + Math.sin(t * 3 + c.ph) * U * 0.03) * dt;
        c.y += c.vy * dt;
        c.rot += c.vr * dt;
        drawPetal(c.x, c.y, c.s, c.rot, a);
      } else if (c.type === "sparkle") {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 1 - k;
        for (let j = 0; j < 8; j++) {
          const an = j * TAU / 8 + k, rr = c.s * (0.3 + k * 0.8);
          ctx.fillStyle = "#fff6d0";
          ctx.beginPath();
          ctx.arc(c.x + Math.cos(an) * rr, c.y + Math.sin(an) * rr, U * 6e-3 * (1 - k), 0, TAU);
          ctx.fill();
        }
        ctx.restore();
      }
    }
    const showers = rain.length > 0;
    if (showers) ctx.save();
    for (let i = rain.length - 1; i >= 0; i--) {
      const d = rain[i];
      if (now < d.t) continue;
      const age = (now - d.t) / 1e3;
      const y = d.y + d.vy * age * 0.6;
      if (age > 0.9 || y > H) {
        rain.splice(i, 1);
        continue;
      }
      ctx.strokeStyle = "rgba(190,215,255,".concat(0.7 * (1 - age / 0.9), ")");
      ctx.lineWidth = Math.max(1, U * 3e-3);
      ctx.beginPath();
      ctx.moveTo(d.x, y);
      ctx.lineTo(d.x - d.len * 0.15, y + d.len);
      ctx.stroke();
    }
    if (showers) ctx.restore();
  }
  const FONT = '-apple-system, "SF Pro Display", "Segoe UI", system-ui, sans-serif';
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
  const font = (wt, px) => "".concat(wt, " ").concat(Math.round(px), "px ").concat(FONT);
  const widths = /* @__PURE__ */ new Map();
  function textW(text) {
    const k = ctx.font + "|" + text;
    let w = widths.get(k);
    if (w === void 0) {
      if (widths.size > 400) widths.clear();
      w = ctx.measureText(text).width;
      widths.set(k, w);
    }
    return w;
  }
  const sprites = /* @__PURE__ */ new Map();
  function labelSprite(text, x, y, px, col, wt, align) {
    const step = Math.round(Math.log(Math.max(4, px)) / Math.log(1.08)), spx = Math.pow(1.08, step), key = "".concat(text, "|").concat(col, "|").concat(wt, "|").concat(step);
    let sp = sprites.get(key);
    if (!sp) {
      if (sprites.size > 160) sprites.clear();
      const f = font(wt, spx);
      ctx.font = f;
      const tw = textW(text), pad2 = Math.ceil(spx * 0.75 + 4);
      const c = document.createElement("canvas");
      c.width = Math.ceil(tw + pad2 * 2);
      c.height = Math.ceil(spx * 1.4 + pad2 * 2);
      const g = c.getContext("2d");
      g.font = f;
      g.textAlign = "left";
      g.textBaseline = "middle";
      const ly = c.height / 2;
      g.lineJoin = "round";
      g.lineWidth = Math.max(2, spx * 0.09);
      g.strokeStyle = "rgba(0,0,0,0.35)";
      g.strokeText(text, pad2, ly);
      g.shadowColor = "rgba(0,0,0,0.55)";
      g.shadowBlur = spx * 0.3;
      g.shadowOffsetY = spx * 0.05;
      g.fillStyle = col;
      g.fillText(text, pad2, ly);
      sp = { c, pad: pad2, tw, ly };
      sprites.set(key, sp);
    }
    const k = px / spx, ox = align === "left" ? 0 : align === "right" ? sp.tw : sp.tw / 2;
    ctx.drawImage(sp.c, x - (sp.pad + ox) * k, y - sp.ly * k, sp.c.width * k, sp.c.height * k);
  }
  function label(text, x, y, px, col = "#fff", wt = 800, align = "center") {
    if (TVM) return labelSprite(String(text), x, y, px, col, wt, align);
    ctx.font = font(wt, px);
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(2, px * 0.09);
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.strokeText(text, x, y);
    ctx.shadowColor = "rgba(0,0,0,0.55)";
    ctx.shadowBlur = px * 0.3;
    ctx.shadowOffsetY = px * 0.05;
    ctx.fillStyle = col;
    ctx.fillText(text, x, y);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  }
  function panel(x, y, w, h, r = U * 0.03, a = 0.42) {
    ctx.save();
    ctx.fillStyle = "rgba(12,16,10,".concat(a, ")");
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = Math.max(1.5, U * 2e-3);
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  function rgba(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return "rgba(".concat(n >> 16, ",").concat(n >> 8 & 255, ",").concat(n & 255, ",").concat(clamp(a, 0, 1), ")");
  }
  const grain = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d"), im = g.createImageData(256, 256);
    for (let i = 0; i < im.data.length; i += 4) {
      const v = 128 + (Math.random() - 0.5) * 90;
      im.data[i] = im.data[i + 1] = im.data[i + 2] = v;
      im.data[i + 3] = 7;
    }
    g.putImageData(im, 0, 0);
    return c;
  })();
  let grainPat = null, vg = null, vgW = 0, vgH = 0;
  function drawFilm() {
    if (!vg || vgW !== W || vgH !== H) {
      vgW = W;
      vgH = H;
      vg = ctx.createRadialGradient(W / 2, H * 0.48, Math.min(W, H) * 0.45, W / 2, H / 2, Math.hypot(W, H) * 0.6);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(10,8,0,0.32)");
    }
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);
    if (TVM) return;
    grainPat || (grainPat = ctx.createPattern(grain, "repeat"));
    ctx.save();
    ctx.translate(Math.random() * 256 | 0, Math.random() * 256 | 0);
    ctx.fillStyle = grainPat;
    ctx.fillRect(-256, -256, W + 512, H + 512);
    ctx.restore();
  }
  function drawNotes(now) {
    for (let i = notes.length - 1; i >= 0; i--) {
      const n = notes[i], k = (now - n.t) / 1300;
      if (k >= 1) {
        notes.splice(i, 1);
        continue;
      }
      if (k < 0) continue;
      ctx.save();
      ctx.globalAlpha = (k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85) * 0.9;
      label(n.glyph, n.x + n.dx * k + Math.sin(k * 8) * U * 0.01, n.y - k * U * 0.16, U * 0.05, "hsl(".concat(n.hue, ",70%,90%)"), 700);
      ctx.restore();
    }
  }
  function drawTexts(now) {
    const drawn = [];
    for (let i = texts.length - 1; i >= 0; i--) {
      const t = texts[i], k = (now - t.t) / t.life;
      if (k >= 1) {
        texts.splice(i, 1);
        continue;
      }
      const pop = k < 0.15 ? 0.6 + k / 0.15 * 0.5 : 1.1 - Math.min(0.1, k - 0.15);
      if (t.side) {
        const L = sideLines(t.text, sidePx(W, H) * pop, sideW(W, H, 0.17), (px) => font(900, px)), y0 = t.y - k * U * 0.06;
        drawn.push({ x: t.x, y: y0 - L.px * 0.6, w: L.w, h: L.h });
        ctx.save();
        ctx.globalAlpha = k > 0.7 ? (1 - k) / 0.3 : 1;
        L.lines.forEach((l, j) => label(l, t.x, y0 + j * L.px * 1.1, L.px, t.col, 900, "left"));
        ctx.restore();
        if (state2 === "play") tipAvoid.push({ x: t.x / DPR, y: (y0 - L.px * 0.6) / DPR, w: L.w / DPR, h: L.h / DPR });
        continue;
      }
      const sz = t.size * U * pop;
      ctx.font = font(900, sz);
      const tw = textW(t.text);
      {
        const r = { x: t.x - tw / 2, y: t.y - k * U * 0.06 - sz * 0.6, w: tw, h: sz * 1.2 };
        if (k >= 0 && drawn.some((d) => r.x < d.x + d.w && d.x < r.x + r.w && r.y < d.y + d.h && d.y < r.y + r.h)) {
          texts.splice(i, 1);
          continue;
        }
        if (k >= 0) drawn.push(r);
      }
      ctx.save();
      ctx.globalAlpha = k > 0.7 ? (1 - k) / 0.3 : 1;
      label(t.text, t.x, t.y - k * U * 0.06, t.size * U * pop, t.col, 900);
      ctx.restore();
      if (state2 === "play") {
        tipAvoid.push({ x: (t.x - tw / 2) / DPR, y: (t.y - k * U * 0.06 - sz * 0.6) / DPR, w: tw / DPR, h: sz * 1.2 / DPR });
      }
    }
  }
  const rims = /* @__PURE__ */ new Map();
  function rimSprite(col, outer, combo, x, y, r) {
    const q = combo ? Math.round((outer - 1.22) / 0.02) : -1, key = col * 10 + q + 1;
    let c = rims.get(key);
    if (!c) {
      const R0 = 96, n = Math.ceil(R0 * 1.3) * 2 + 2, o = n / 2, cs = COLORS[col].css, out = combo ? 1.22 + 0.02 * q : 1.08;
      c = document.createElement("canvas");
      c.width = c.height = n;
      const g = c.getContext("2d");
      const gr = g.createRadialGradient(o, o, R0 * 0.78, o, o, R0 * out);
      gr.addColorStop(0, rgba(cs, 0));
      gr.addColorStop(0.55, rgba(cs, combo ? 0.42 : 0.3));
      gr.addColorStop(1, rgba(cs, 0));
      g.fillStyle = gr;
      g.beginPath();
      g.arc(o, o, R0 * 1.3, 0, TAU);
      g.fill();
      rims.set(key, c);
    }
    const k = r / 96;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(c, x - c.width / 2 * k, y - c.height / 2 * k, c.width * k, c.height * k);
    ctx.restore();
  }
  function drawBubbleArt(now) {
    const pulse = 0.5 + 0.5 * Math.sin(now / 220);
    for (const b of bubbles) {
      if (b.dead) continue;
      const r = b.r * RB * b.appear * (1 + 0.03 * Math.sin((now - b.born) / 1e3 * 4.2 + b.ph)), x = b.x * W, y = b.y * H;
      if (x < -r * 1.5 || x > W + r * 1.5 || y < -r * 1.5 || y > H + r * 1.5) continue;
      if (b.col >= 0) {
        const c = COLORS[b.col].css, combo = b.col === streakCol && streak >= 1 && state2 === "play";
        if (TVM) rimSprite(b.col, combo ? 1.22 + 0.06 * pulse : 1.08, combo, x, y, r);
        else {
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          const g = ctx.createRadialGradient(x, y, r * 0.78, x, y, r * (combo ? 1.22 + 0.06 * pulse : 1.08));
          g.addColorStop(0, rgba(c, 0));
          g.addColorStop(0.55, rgba(c, combo ? 0.42 : 0.3));
          g.addColorStop(1, rgba(c, 0));
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, r * 1.3, 0, TAU);
          ctx.fill();
          ctx.restore();
        }
        if (b.kind === "split") {
          ctx.save();
          ctx.strokeStyle = rgba(c, 0.55);
          ctx.lineWidth = Math.max(1, U * 25e-4);
          for (let i = 0; i < 3; i++) {
            const a = now / 1800 + i * TAU / 3;
            ctx.beginPath();
            ctx.arc(x + Math.cos(a) * r * 0.36, y + Math.sin(a) * r * 0.36, r * 0.26, 0, TAU);
            ctx.stroke();
          }
          ctx.strokeStyle = "rgba(255,255,255,0.7)";
          for (let i = 0; i < 3; i++) {
            const a = now / 1800 + i * TAU / 3;
            ctx.beginPath();
            ctx.arc(x + Math.cos(a) * r * 0.36, y + Math.sin(a) * r * 0.36, r * 0.2, Math.PI * 1.1, Math.PI * 1.45);
            ctx.stroke();
          }
          ctx.restore();
        }
      }
      if (b.kind === "treasure") {
        const t = (now - b.born) / 1e3, s = r * 0.62;
        if (b.critter === "butterfly") drawButterfly(x, y + s * 0.05, s, t * 2.2, 0.95, Math.sin(t) * 0.2);
        else if (b.critter === "blossom") drawBlossom(x, y, s, t * 0.4);
        else drawFirefly(x + Math.sin(t * 1.3) * r * 0.15, y + Math.cos(t * 1.1) * r * 0.12, s * 1.25, 0.7 + 0.3 * Math.sin(t * 5));
        ctx.save();
        ctx.strokeStyle = "rgba(255,255,255,0.55)";
        ctx.lineWidth = Math.max(1.5, r * 0.04);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(x, y, r * 0.84, Math.PI * 1.12, Math.PI * 1.42);
        ctx.stroke();
        ctx.restore();
      }
      if (b.kind === "storm") {
        drawCloud(x, y - r * 0.08, r * 0.9, now);
        if (b.warn && state2 === "play") label("don't pop!", x, y + r * 1.32, U * 0.034, "#e3ebf7", 900);
      }
      if (b.kind === "gold" || b.kind === "rainbow") for (let i = 0; i < 3; i++) {
        const age = (now - b.born) / 1e3, a = age * 1.3 + i * 2.1, gx = x + Math.cos(a) * r * 0.75, gy = y + Math.sin(a) * r * 0.75, gs = r * (0.18 + 0.08 * Math.sin(age * 6 + i * 2));
        const tint = b.kind === "gold" ? "255,220,140" : "".concat(["255,150,200", "150,220,255", "190,255,170"][i]);
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        const gg = ctx.createRadialGradient(gx, gy, 0, gx, gy, gs);
        gg.addColorStop(0, "rgba(255,250,225,0.95)");
        gg.addColorStop(0.3, "rgba(".concat(tint, ",0.35)"));
        gg.addColorStop(1, "rgba(".concat(tint, ",0)"));
        ctx.fillStyle = gg;
        ctx.beginPath();
        ctx.arc(gx, gy, gs, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,248,220,0.8)";
        ctx.lineWidth = Math.max(1, U * 2e-3);
        ctx.beginPath();
        ctx.moveTo(gx - gs * 1.4, gy);
        ctx.lineTo(gx + gs * 1.4, gy);
        ctx.moveTo(gx, gy - gs * 1.4);
        ctx.lineTo(gx, gy + gs * 1.4);
        ctx.stroke();
        ctx.restore();
      }
      if (b.kind === "rainbow") {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.lineWidth = Math.max(2, r * 0.07);
        ["#ff5a5a", "#ffb347", "#fff36b", "#6bff8a", "#5ac8ff", "#a78bff"].forEach((c, i) => {
          ctx.strokeStyle = rgba(c, 0.35);
          ctx.beginPath();
          ctx.arc(x, y, r * (1 - i * 0.05), Math.PI * 1.05 + now / 1500, Math.PI * 1.75 + now / 1500);
          ctx.stroke();
        });
        ctx.restore();
      }
      if (b.kind === "hug" && !b.attract && b.y > 0.22) {
        const sp = Math.sin(now / 260) * r * 0.08;
        label("→", x - r * 1.42 + sp, y, r * 0.42, "#ffe3f6", 900);
        label("←", x + r * 1.42 - sp, y, r * 0.42, "#ffe3f6", 900);
        const ly = y + r * 1.2 + U * 0.09 > H ? y - r * 1.25 - U * 0.045 : y + r * 1.2;
        label("HUG IT!", x, ly, U * 0.05, "#ffffff", 900);
        label("both arms around it", x, ly + U * 0.045, U * 0.03, "rgba(255,255,255,0.9)", 700);
        ctx.save();
        ctx.lineCap = "round";
        for (const [on, sd] of [[b.inL, -1], [b.inR, 1]]) {
          ctx.strokeStyle = on ? "rgba(255,200,240,0.9)" : "rgba(255,255,255,".concat(0.2 + 0.15 * pulse, ")");
          ctx.lineWidth = U * 8e-3;
          ctx.beginPath();
          ctx.arc(x, y, r * 1.08, sd < 0 ? Math.PI * 0.62 : -Math.PI * 0.38, sd < 0 ? Math.PI * 1.38 : Math.PI * 0.38);
          ctx.stroke();
        }
        if (b.solo > 0.05) {
          ctx.strokeStyle = "rgba(255,255,255,0.9)";
          ctx.lineWidth = U * 8e-3;
          ctx.beginPath();
          ctx.arc(x, y, r * 1.18, -Math.PI / 2, -Math.PI / 2 + TAU * Math.min(1, b.solo / 1.6));
          ctx.stroke();
        }
        ctx.restore();
      }
    }
  }
  let buttons = [];
  function button(id, label_, x, y, w, h, opts = {}) {
    const b = { id, label: label_, x, y, w, h, ms: opts.ms || 700, small: !!opts.small, fill: 0, action: opts.action };
    buttons.push(b);
    return b;
  }
  function processButtons(now) {
    let fired = null;
    const big = buttons.filter((b) => !b.small);
    buttons.forEach((b) => {
      const over = now > armedAt && BodyMovin.handOver(b, W, H);
      const f = BodyMovin.dwell(b.id, over, now, b.ms);
      if (f === 1) fired = b;
      else b.fill = f;
      b.over = over;
      for (const c of clicks) if (!c.used && c.x > b.x && c.x < b.x + b.w && c.y > b.y && c.y < b.y + b.h) fired = b;
      if (keyPress === "enter" && !b.small && big.indexOf(b) === focus) fired = b;
    });
    if ((keyPress === "left" || keyPress === "right") && big.length) focus = (focus + (keyPress === "left" ? -1 : 1) + big.length) % big.length;
    if (keyPress === "escape" && state2 === "play") fired = buttons.find((b) => b.id === "home") || { action: goHome };
    if (fired) {
      play("click");
      fired.action(now);
    }
  }
  function drawButton(b, focused, now) {
    ctx.save();
    const path = new Path2D();
    path.roundRect(b.x, b.y, b.w, b.h, b.h / 2);
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = U * 0.02;
    ctx.shadowOffsetY = U * 6e-3;
    ctx.fillStyle = "rgba(14,18,12,0.55)";
    ctx.fill(path);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    if (b.fill > 0) {
      ctx.save();
      ctx.clip(path);
      const g = ctx.createLinearGradient(b.x, 0, b.x + b.w, 0);
      g.addColorStop(0, "rgba(255,190,70,0.95)");
      g.addColorStop(1, "rgba(255,110,60,0.95)");
      ctx.fillStyle = g;
      ctx.fillRect(b.x, b.y, b.w * b.fill, b.h);
      ctx.restore();
    }
    const hot = focused || b.over, pulse = 0.5 + 0.5 * Math.sin(now / 300);
    ctx.lineWidth = Math.max(2, U * (b.small ? 3e-3 : 5e-3));
    ctx.strokeStyle = hot ? "rgba(255,225,160,".concat(0.8 + 0.2 * pulse, ")") : "rgba(255,255,255,0.55)";
    ctx.stroke(path);
    ctx.fillStyle = "#fff";
    ctx.font = font(800, b.h * 0.42);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(b.label, b.x + b.w / 2, b.y + b.h / 2 + b.h * 0.02);
    ctx.restore();
  }
  function clearBubbles() {
    for (const b of bubbles) removeBubble(b);
    bubbles.length = 0;
    popQueue.length = 0;
  }
  function startRound(now) {
    audioInit();
    try {
      BodyMovin.music && BodyMovin.music(GAME_ID);
    } catch (e) {
    }
    score = popped = golds = treasures = rainbows = hugs = hugsTwo = splits = clusters = storms = stormsDodged = 0;
    missed = spawned = blown = bounced = streak = bestStreak = stormsSeen = 0;
    streakCol = -1;
    ease = 0;
    endStats = null;
    waveIdx = -1;
    waveDone = {};
    rainbowAt = 0;
    clearBubbles();
    texts.length = critters.length = rain.length = 0;
    BodyMovin.activity.activeSec = 0;
    BodyMovin.activity.kcal = 0;
    state2 = "count";
    tState = now;
    lastBeep = -1;
  }
  function endRound(now) {
    const prevBest = BodyMovin.best(GAME_ID), act = { min: BodyMovin.activity.activeSec / 60, kcal: BodyMovin.activity.kcal };
    BodyMovin.saveSession({ game: GAME_ID, score });
    if (BodyMovin.highScores) BodyMovin.highScores(GAME_ID, score);
    endStats = {
      score,
      prevBest,
      best: Math.max(prevBest, score),
      newBest: score > prevBest && score > 0,
      activeMin: act.min,
      kcal: act.kcal,
      popped,
      golds,
      treasures,
      rainbows,
      hugs,
      hugsTwo,
      splits,
      clusters,
      storms,
      stormsDodged,
      missed,
      blown,
      bounced,
      bestStreak
    };
    for (const b of bubbles) b.attract = true;
    state2 = "end";
    tState = now;
    armedAt = now + 1500;
    focus = 0;
    padOff();
    play("fanfare");
  }
  const goHome = () => {
    location.href = "index.html";
  };
  function spawnPlay(now, p) {
    const wi = waveAt(p);
    if (wi !== waveIdx) {
      if (wi >= 0) {
        const w2 = WAVES[wi];
        banner("WAVE ".concat(wi + 1), "#ffffff", 0.065, 1600);
        play("wave");
        nextSpawn = now + 900;
      }
      waveIdx = wi;
    }
    if (wi < 0) return;
    const w = WAVES[wi], wp = (p - w.a) / (w.b - w.a);
    for (const [key, list] of [["hug", w.hug], ["rainbow", w.rainbow || []], ["cluster", w.cluster]]) list.forEach((at, j) => {
      const id = "".concat(wi, "-").concat(key, "-").concat(j);
      if (waveDone[id] || wp < at) return;
      if (key === "hug" && bubbles.some((b) => b.kind === "hug" && !b.dead)) return;
      waveDone[id] = true;
      spawnKind(key);
    });
    const live = bubbles.filter((b) => !b.attract && !b.dead && b.kind !== "mini").length;
    const cap = Math.round(lerp(w.cap[0], w.cap[1], wp) * (1 - 0.35 * ease));
    if (now >= nextSpawn && live < cap && p < 0.985) {
      let kind = "normal";
      const r = Math.random();
      let acc = 0;
      for (const [k, c] of Object.entries(w.mix)) {
        acc += c;
        if (r < acc) {
          kind = k;
          break;
        }
      }
      if (kind === "storm" && bubbles.filter((b) => b.kind === "storm" && !b.dead).length >= 2) kind = "normal";
      spawnKind(kind);
      nextSpawn = now + lerp(w.gap[0], w.gap[1], wp) * (1 + 0.6 * ease) * rnd(0.8, 1.2);
    }
  }
  function moveBubbles(now, dt) {
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      if (b.dead) {
        bubbles.splice(i, 1);
        continue;
      }
      const age = (now - b.born) / 1e3, rx = b.r * RB / W, ry = b.r * RB / H;
      if (b.kind === "hug" && b.hold > 0) {
        if (b.y < b.stopY) b.y = Math.min(b.stopY, b.y + b.vy * dt);
        else {
          b.hold -= dt * 1e3;
          b.y = b.stopY + Math.sin(age * 1.8) * 0.012;
        }
        if (b.hold <= 0) b.vy = -0.12;
      } else {
        const k = Math.exp(-dt * 1.6);
        b.ix *= k;
        b.iy *= k;
        b.x += (b.vx + b.ix) * dt + Math.cos(age * b.wf * TAU + b.ph) * b.wob * TAU * b.wf * dt * (b.from === "top" ? 1 : 0.4);
        b.y += (b.vy + b.iy) * dt + (b.from === "top" ? 0 : Math.sin(age * b.wf * TAU + b.ph) * b.wob * 2 * dt);
      }
      if (!b.entered && b.x > rx * 0.5 && b.x < 1 - rx * 0.5 && b.y > ry * 0.5 && b.y < 1) b.entered = true;
      b.appear = b.attract ? 1 : clamp(age / 0.35, 0, 1);
      const sq = 1 + 0.03 * Math.sin(age * 4.2 + b.ph), rw = pxToWorld(b.r * RB) * b.appear;
      worldAt(b.x, b.y, b.obj.position);
      b.obj.scale.set(rw * sq, rw * (2 - sq), rw * sq);
      b.obj.rotation.y += b.spin * dt;
      b.obj.rotation.x = Math.sin(age * 0.5 + b.ph) * 0.4;
      const scoring = state2 === "play" && !b.attract;
      if (b.kind !== "hug" && b.y + ry * 0.55 > 0.985 && b.vy + b.iy > 0) {
        popBubble(b, now, "grass");
        if (b.kind === "storm" && scoring) dodged(b, now);
        continue;
      }
      const gone = b.entered && (b.x + rx < -0.01 || b.x - rx > 1.01 || b.y + ry < -0.02);
      if (gone || age > 40 || b.kind === "hug" && b.y + ry < -0.02) {
        bubbles.splice(i, 1);
        removeBubble(b);
        if (scoring) {
          if (b.kind === "storm") dodged(b, now);
          else if (b.kind !== "mini" && b.kind !== "hug") {
            missed++;
            ease = Math.min(1, ease + 0.08);
          }
        }
      }
    }
    for (let i = 0; i < bubbles.length; i++) for (let j = i + 1; j < bubbles.length; j++) {
      const a = bubbles[i], c = bubbles[j];
      if (a.dead || c.dead || a.grp && a.grp === c.grp || a.kind === "hug" || c.kind === "hug") continue;
      const dx = (c.x - a.x) * W, dy = (c.y - a.y) * H, d = Math.hypot(dx, dy) || 1, min = (a.r + c.r) * RB * 0.98;
      if (d < min) {
        const f = (min - d) / min * 0.6 * dt * 6, ux = dx / d, uy = dy / d;
        impulse(a, -ux * f * H / W, -uy * f);
        impulse(c, ux * f * H / W, uy * f);
      }
    }
  }
  function dodged(b, now) {
    stormsDodged++;
    score += 5;
    play("dodge");
    texts.push({ x: clamp(b.x * W, W * 0.15, W * 0.85), y: clamp(b.y * H - b.r * RB, H * 0.24, H * 0.9), text: "+5", col: "#d8e6ff", size: 0.036, t: now, life: 1200 });
  }
  function frame(now) {
    BodyMovin.update(now);
    const dt = Math.min(0.05, Math.max(1e-3, (now - (lastNow || now)) / 1e3));
    lastNow = now;
    frames++;
    buttons = [];
    if (state2 === "title") {
      if (now > nextAttract && bubbles.length < 7) {
        const r = Math.random();
        spawnKind(r < 0.18 ? "treasure" : r < 0.26 ? "gold" : "normal", { attract: true });
        nextAttract = now + rnd(900, 1500);
      }
      if (tvAutoAt && now > tvAutoAt) {
        tvAutoAt = 0;
        startRound(now);
      }
    } else if (state2 === "count") {
      const k = Math.floor((now - tState) / 800);
      if (k !== lastBeep && k <= 3) {
        lastBeep = k;
        play("beep", k === 3);
      }
      if (now - tState > 3200) {
        state2 = "play";
        roundStart = now;
        nextSpawn = now;
      }
    } else if (state2 === "play") {
      const t = (now - roundStart) / 1e3, p = clamp(t / ROUND, 0, 1);
      if (!NOSPAWN) spawnPlay(now, p);
      if (t >= ROUND) endRound(now);
    }
    for (let i = popQueue.length - 1; i >= 0; i--) if (now >= popQueue[i].at) {
      const q = popQueue.splice(i, 1)[0];
      if (!q.b.dead) popBubble(q.b, now, q.how);
    }
    moveBubbles(now, dt);
    filmTex.offset.y = now / 9e3 % 1;
    filmTex.offset.x = Math.sin(now / 7e3) * 0.1;
    {
      const k = rainbowAt ? (now - rainbowAt) / 3600 : 2;
      rainbow.material.opacity = k < 0 || k > 1 ? 0 : (k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85) * 0.75;
      rainbow.visible = rainbow.material.opacity > 0;
    }
    checkHands(now, dt);
    stepMist(dt);
    render(dt);
    ctx.clearRect(0, 0, W, H);
    tipAvoid = [];
    if (state2 === "play") liveTips(now);
    scoreBump *= Math.pow(4e-3, dt);
    drawFilm();
    drawBubbleArt(now);
    drawCritters(now, dt);
    drawNotes(now);
    if (state2 === "title") drawTitle(now);
    else if (state2 === "count") drawCount(now);
    else if (state2 === "play") drawHud(now);
    else if (state2 === "end") drawEnd(now);
    drawTexts(now);
    processButtons(now);
    const big = buttons.filter((b) => !b.small);
    for (const b of buttons) drawButton(b, !b.small && big.indexOf(b) === focus && state2 !== "play", now);
    BodyMovin.drawHands(ctx, W, H, 0.62);
    clicks.length = 0;
    keyPress = null;
    Object.assign(window.__game, {
      state: state2,
      score,
      popped,
      golds,
      treasures,
      rainbows,
      hugs,
      hugsTwo,
      splits,
      clusters,
      storms,
      stormsDodged,
      missed,
      spawned,
      blown,
      bounced,
      streak,
      streakColor: streakCol >= 0 ? COLORS[streakCol].id : null,
      bestStreak,
      ease,
      frames,
      wave: waveIdx + 1,
      timeLeft: state2 === "play" ? Math.max(0, ROUND - (now - roundStart) / 1e3) : state2 === "end" ? 0 : ROUND,
      onScreen: bubbles.filter((b) => !b.dead && b.x > 0 && b.x < 1 && b.y > 0 && b.y < 1).length,
      critters: critters.length,
      audioErrors,
      audio: ac ? ac.state : "none",
      endStats,
      quality: { ...state().quality },
      buttons: buttons.map((b) => ({ id: b.id, x: (b.x + b.w / 2) / W, y: (b.y + b.h / 2) / H, fill: b.fill }))
    });
    requestAnimationFrame(frame);
  }
  Object.assign(window.__game, {
    endNow: () => {
      if (state2 === "play" || state2 === "count") endRound(performance.now());
    },
    // test hook: reach the end screen (the UI audit could not)
    spawn: (k, o) => {
      const b = spawnKind(k || "normal", o || {});
      return b && b.id;
    },
    rules: { STILL, FAST, COOL },
    targets: () => bubbles.filter((b) => !b.dead && !b.attract).map((b) => ({ id: b.id, x: b.x, y: b.y, kind: b.kind, color: b.col >= 0 ? COLORS[b.col].id : null, r: b.r * RB / W, ry: b.r * RB / H, appear: b.appear, immune: b.immune > lastNow }))
  });
  let tipAvoid = [];
  function liveTips() {
  }
  function drawTitle(now) {
    const bw = U * 0.5, bh = U * 0.13, by = H * 0.77;
    button("start", "START", W / 2 - bw / 2, by, bw, bh, { action: startRound });
    if (tvAutoAt) label("starting in ".concat(Math.max(1, Math.ceil((tvAutoAt - now) / 1e3)), "…"), W / 2, by - U * 0.035, U * 0.032, "#c8ffd8", 700);
  }
  function drawCount(now) {
    const k = (now - tState) / 800, i = Math.floor(k), f = k - i, lbl = i < 3 ? String(3 - i) : "POP!";
    ctx.save();
    ctx.globalAlpha = i < 3 ? 1 - f * 0.5 : clamp(5 - k, 0, 1);
    label(lbl, W / 2, H * 0.45, U * (i < 3 ? 0.3 : 0.22) * (1.25 - 0.25 * Math.min(1, f * 3)), i < 3 ? "#ffffff" : "#ffd6f0", 900);
    ctx.restore();
    label("Touch them gently", W / 2, H * 0.72, U * 0.04, "#ffffff", 700);
  }
  function drawHud(now) {
    const left = Math.max(0, ROUND - (now - roundStart) / 1e3);
    const sph = Math.min(U * 0.075, H * 0.095 - U * 0.018);
    panel(W / 2 - U * 0.14, U * 0.018, U * 0.28, sph, sph / 2, 0.32);
    label(String(score), W / 2, U * 0.018 + sph * 0.53, sph * 0.72 * (1 + 0.12 * scoreBump), scoreBump > 0.3 ? "#dff6ff" : "#ffffff", 900);
    if (streak >= 2 && streakCol >= 0) {
      const c = COLORS[streakCol], m = Math.min(5, streak), cy = U * 0.19, txt = "".concat(c.name, "  x").concat(m);
      ctx.font = font(900, U * 0.042);
      const tw = textW(txt), cr = U * 0.022, w = tw + cr * 2 + U * 0.05;
      panel(W / 2 - w / 2, cy - U * 0.035, w, U * 0.07, U * 0.035, 0.38);
      tipAvoid.push({ x: (W / 2 - w / 2) / DPR, y: (cy - U * 0.035) / DPR, w: w / DPR, h: U * 0.07 / DPR });
      const g = ctx.createRadialGradient(W / 2 - w / 2 + U * 0.04 - cr * 0.3, cy - cr * 0.3, cr * 0.1, W / 2 - w / 2 + U * 0.04, cy, cr);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(0.35, c.css);
      g.addColorStop(1, rgba(c.css, 0.5));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(W / 2 - w / 2 + U * 0.04, cy, cr, 0, TAU);
      ctx.fill();
      label(txt, W / 2 - w / 2 + U * 0.04 + cr + U * 0.015, cy + U * 2e-3, U * 0.042, c.css, 900, "left");
    }
    const tr = U * 0.05, tx = Math.min(W - U * 0.1, (BodyMovin.freeRight ? BodyMovin.freeRight() * DPR : W) - tr * 1.25), ty = U * 0.025 + tr * 1.25, low = left < 10, pulse = low ? 0.5 + 0.5 * Math.sin(now / 150) : 0;
    ctx.save();
    ctx.fillStyle = "rgba(12,16,10,0.35)";
    ctx.beginPath();
    ctx.arc(tx, ty, tr * 1.25, 0, TAU);
    ctx.fill();
    ctx.lineWidth = U * 0.011;
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.beginPath();
    ctx.arc(tx, ty, tr, 0, TAU);
    ctx.stroke();
    ctx.strokeStyle = low ? "rgb(255,".concat(Math.round(140 + 60 * pulse), ",200)") : "#9fe6ff";
    ctx.beginPath();
    ctx.arc(tx, ty, tr, -Math.PI / 2, -Math.PI / 2 + TAU * (left / ROUND));
    ctx.stroke();
    ctx.restore();
    label(String(Math.ceil(left)), tx, ty + U * 3e-3, U * 0.045, "#ffffff", 800);
    if (!(BodyMovin.sysMode && BodyMovin.sysMode() === "play")) button("home", "← HOME", U * 0.03, U * 0.035, U * 0.24, U * 0.085, { small: true, ms: 1e3, action: goHome });
  }
  function drawEnd(now) {
    const e = endStats, k = clamp((now - tState) / 600, 0, 1);
    ctx.save();
    ctx.globalAlpha = k;
    {
      ctx.font = font(900, U * 0.17);
      const tw = textW(String(e.score)), pw = tw + U * 0.12, ph = U * 0.21;
      panel(W / 2 - pw / 2, H * 0.36 - ph / 2, pw, ph, ph / 2, 0.55);
    }
    label(String(e.score), W / 2, H * 0.36, U * 0.17, "#ffffff", 900);
    if (e.newBest) label("NEW BEST!", W / 2, H * 0.36 + U * 0.15, U * 0.055, "#ffd84a", 900);
    ctx.restore();
    const L = BodyMovin.layout.end(W, H, { cy: H * 0.74 }), A = L.again, Hm = L.home;
    button("again", "PLAY AGAIN", A.x, A.y, A.w, A.h, { action: startRound });
    button("endhome", "HOME", Hm.x, Hm.y, Hm.w, Hm.h, { action: goHome, ms: BodyMovin.LEAVE_MS });
  }
  ctx.clearRect(0, 0, W, H);
  label("loading the park…", W / 2, H / 2, U * 0.05, "#ffffff", 700);
  BodyMovin.start();
  await environment(scene, renderer, ENV, { background: true, rotation: ENV_ROT });
  {
    const warm = [makeBubbleMesh("normal"), makeBubbleMesh("gold"), makeBubbleMesh("storm"), makeBubbleMesh("rainbow"), ...COLORS.map((c, i) => makeBubbleMesh("normal", i))];
    warm.forEach((m) => {
      m.position.set(0, 1.3, -D);
      m.scale.setScalar(0.05);
    });
    popMist(new Vector3(0, 1.3, -D), 0.05, 2, null);
    rainbow.material.opacity = 0.01;
    renderer.compile(scene, camera);
    render(1 / 60);
    render(1 / 60);
    warm.forEach((m) => scene.remove(m));
    drops.length = 0;
    rainbow.material.opacity = 0;
  }
  const Qy = state().quality;
  Qy.frames = 0;
  Qy.t0 = performance.now();
  state2 = "title";
  tState = performance.now();
  if (TV) tvAutoAt = tState + 2e3;
  window.__game.ready = true;
  requestAnimationFrame(frame);
})().catch((e) => setTimeout(() => {
  throw e;
}));
