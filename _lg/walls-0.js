import {
  Reflector
} from "./chunk-WTUFNU2L.js";
import {
  create as create3
} from "./chunk-6IMGWI3W.js";
import {
  STANCES
} from "./chunk-QDPXG5OX.js";
import {
  create as create2
} from "./chunk-YHKKMJ2Y.js";
import "./chunk-WYC6O5BF.js";
import "./chunk-2BP775VP.js";
import {
  create
} from "./chunk-A2W6QNSO.js";
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
import {
  mergeGeometries
} from "./chunk-GEQJXPAR.js";
import "./chunk-UBB4M7UR.js";
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AgXToneMapping,
  BoxGeometry,
  CanvasTexture,
  CapsuleGeometry,
  CatmullRomCurve3,
  CineonToneMapping,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DataTexture,
  DoubleSide,
  Euler,
  ExtrudeGeometry,
  FogExp2,
  Group,
  InstancedMesh,
  LatheGeometry,
  LinearMipmapLinearFilter,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Path,
  PlaneGeometry,
  PointLight,
  Quaternion,
  RepeatWrapping,
  RingGeometry,
  SRGBColorSpace,
  ShaderMaterial,
  Shape,
  SphereGeometry,
  SpotLight,
  Sprite,
  SpriteMaterial,
  TextureLoader,
  TubeGeometry,
  Vector2,
  Vector3,
  Vector4
} from "./chunk-4IYDSAYK.js";
import "./chunk-NWIHTO7D.js";

// bmpage:bmpage:walls.html#0
(async () => {
  var _a, _b, _c, _d, _e2, _f, _g, _h;
  const GAME = "walls", ROUND = 75;
  const TVM = !!window.BP_TV;
  const Q = new URLSearchParams(location.search), TV = Q.has("tv"), MUTE = Q.has("mute");
  const cv = document.getElementById("c");
  let ctx = cv.getContext("2d");
  let W, H, U, DPR, K0;
  function size() {
    DPR = Math.min(2, devicePixelRatio || 1);
    W = cv.width = Math.round(innerWidth * DPR);
    H = cv.height = Math.round(innerHeight * DPR);
    U = Math.min(W, H);
    K0 = Math.min(0.22 * H, 0.15 * W);
  }
  addEventListener("resize", size);
  size();
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t, ease = (t) => t * t * (3 - 2 * t);
  const rgba = (c, a) => "rgba(".concat(c[0], ",").concat(c[1], ",").concat(c[2], ",").concat(clamp(a, 0, 1), ")");
  const FONT = '-apple-system, "SF Pro Display", "Segoe UI", system-ui, sans-serif';
  let ac = null, master = null, noiseBuf = null, beatTimer = null;
  function audioInit() {
    if (ac) {
      if (ac.state === "suspended") ac.resume();
      return;
    }
    try {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      master = ac.createGain();
      master.gain.value = MUTE ? 0 : 0.55;
      const comp = ac.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 4;
      master.connect(comp);
      comp.connect(ac.destination);
      noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    } catch (e) {
      ac = null;
    }
  }
  function tone(f, dur, { type = "sine", vol = 0.2, slide = 0, at = 0, attack = 5e-3 } = {}) {
    if (!ac) return;
    const t = ac.currentTime + at, o = ac.createOscillator(), g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, f * slide), t + dur);
    g.gain.setValueAtTime(1e-4, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
    o.connect(g);
    g.connect(master);
    o.start(t);
    o.stop(t + dur + 0.05);
  }
  function hiss(dur, { f = 2e3, q = 1, vol = 0.15, type = "bandpass", at = 0, sweep = 0 } = {}) {
    if (!ac) return;
    const t = ac.currentTime + at, n = ac.createBufferSource(), fl = ac.createBiquadFilter(), g = ac.createGain();
    n.buffer = noiseBuf;
    fl.type = type;
    fl.frequency.setValueAtTime(f, t);
    if (sweep) fl.frequency.exponentialRampToValueAtTime(f * sweep, t + dur);
    fl.Q.value = q;
    g.gain.setValueAtTime(1e-4, t);
    g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.3);
    g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
    n.connect(fl);
    fl.connect(g);
    g.connect(master);
    n.start(t, Math.random());
    n.stop(t + dur + 0.05);
  }
  const SFX = {
    pass(combo2) {
      const base = 523 * Math.pow(2, Math.min(12, combo2) / 12);
      [1, 1.25, 1.5].forEach((r, i) => tone(base * r, 0.35, { type: "triangle", vol: 0.14, at: i * 0.06 }));
      hiss(0.35, { f: 3e3, sweep: 0.3, vol: 0.08 });
    },
    perfect() {
      [1047, 1319, 1568, 2093, 2637].forEach((f, i) => tone(f, 0.5, { type: "sine", vol: 0.07, at: 0.1 + i * 0.05 }));
    },
    great() {
      tone(1568, 0.5, { vol: 0.08, at: 0.18 });
      tone(2093, 0.6, { vol: 0.06, at: 0.24 });
    },
    miss() {
      tone(140, 0.45, { type: "sawtooth", vol: 0.2, slide: 0.4 });
      hiss(0.3, { f: 400, type: "lowpass", vol: 0.3 });
    },
    whoosh() {
      hiss(0.6, { f: 500, sweep: 4, q: 0.8, vol: 0.05 });
    },
    tick() {
      tone(880, 0.08, { type: "square", vol: 0.05 });
    },
    go() {
      tone(660, 0.12, { type: "square", vol: 0.06 });
      tone(1320, 0.3, { type: "triangle", vol: 0.1, at: 0.1 });
    },
    click() {
      tone(990, 0.12, { type: "triangle", vol: 0.1 });
    },
    end() {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.6, { type: "triangle", vol: 0.12, at: i * 0.12 }));
    },
    // a voice-like "oof" when the wall shoves you: a buzzy pitch drop through two vowel formants
    oof() {
      if (!ac) return;
      const t = ac.currentTime, o = ac.createOscillator(), f1 = ac.createBiquadFilter(), f2 = ac.createBiquadFilter(), g = ac.createGain(), g2 = ac.createGain();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(210, t);
      o.frequency.exponentialRampToValueAtTime(115, t + 0.32);
      f1.type = "bandpass";
      f1.frequency.setValueAtTime(520, t);
      f1.frequency.exponentialRampToValueAtTime(330, t + 0.3);
      f1.Q.value = 6;
      f2.type = "bandpass";
      f2.frequency.setValueAtTime(950, t);
      f2.frequency.exponentialRampToValueAtTime(700, t + 0.3);
      f2.Q.value = 8;
      g.gain.setValueAtTime(1e-4, t);
      g.gain.exponentialRampToValueAtTime(0.9, t + 0.025);
      g.gain.exponentialRampToValueAtTime(1e-4, t + 0.38);
      g2.gain.value = 0.45;
      o.connect(f1);
      o.connect(f2);
      f1.connect(g);
      f2.connect(g2);
      g2.connect(g);
      g.connect(master);
      o.start(t);
      o.stop(t + 0.42);
      tone(70, 0.3, { vol: 0.3, slide: 0.5 });
      hiss(0.12, { f: 900, type: "lowpass", vol: 0.25 });
    },
    splash() {
      hiss(1.1, { f: 4e3, sweep: 0.12, q: 0.5, type: "lowpass", vol: 0.55 });
      hiss(0.5, { f: 700, sweep: 0.5, q: 1.2, vol: 0.3 });
      tone(85, 0.45, { vol: 0.28, slide: 0.45 });
      for (let i = 0; i < 10; i++) hiss(0.08, { f: 2500 + Math.random() * 3e3, q: 3, vol: 0.06, at: 0.25 + Math.random() * 0.7 });
    },
    // the studio crowd: a roar that swells and fades, claps, a couple of whistles
    cheer(big = 1) {
      hiss(1.8, { f: 1400, q: 0.5, vol: 0.13 * big });
      hiss(1.5, { f: 600, q: 0.7, vol: 0.08 * big, at: 0.05 });
      for (let i = 0; i < 26; i++) hiss(0.035, { f: 2200 + Math.random() * 1500, q: 1.5, type: "bandpass", vol: 0.05, at: Math.random() * 1.4 });
      if (big > 1) [0.15, 0.55].forEach((at) => tone(2300, 0.32, { vol: 0.035, slide: 1.35, at }));
    },
    aww() {
      for (let i = 0; i < 5; i++) tone(170 + Math.random() * 90, 0.8, { type: "triangle", vol: 0.035, slide: 0.72, at: Math.random() * 0.08, attack: 0.08 });
    }
  };
  function beatStart() {
    if (!ac || beatTimer) return;
    let next = ac.currentTime + 0.1, step = 0;
    const spb = 60 / 118 / 2;
    const bass = [55, 55, 65.4, 55, 49, 49, 58.3, 49];
    beatTimer = setInterval(() => {
      while (next < ac.currentTime + 0.2) {
        const at = next - ac.currentTime;
        if (step % 2 === 0) {
          tone(110, 0.25, { vol: 0.22, slide: 0.35, at });
        } else hiss(0.06, { f: 8e3, type: "highpass", vol: 0.025, at });
        if (step % 4 === 2) tone(bass[(step / 4 | 0) % 8], spb * 1.8, { type: "sawtooth", vol: 0.035, at, attack: 0.02 });
        next += spb;
        step++;
      }
    }, 50);
  }
  function beatStop() {
    clearInterval(beatTimer);
    beatTimer = null;
  }
  let simOn = false;
  {
    const s = BodyMovin.simulate;
    BodyMovin.simulate = (fn) => {
      simOn = !!fn;
      s(fn);
    };
  }
  let xDrift = 0, lastLiveAt = 0, airUntil = 0, keys = {}, lastKeyAt = -1e9, mouseJumpArmed = true;
  BodyMovin.on("jump", () => {
    airUntil = performance.now() + 620;
  });
  const pose = { side: 0, crouch: 0, air: 0, armsUp: false, lean: 0, src: "none" };
  function readPose(now) {
    const B = BodyMovin.body, R = BodyMovin.hands.right, L = BodyMovin.hands.left;
    const keyMode = now - lastKeyAt < 4e3;
    if (BodyMovin.live) {
      if (!simOn) {
        if (now - lastLiveAt > 1500) xDrift = 0;
        xDrift = xDrift * 0.9995 + 2e-3 * B.x;
      }
      lastLiveAt = now;
      const raw = B.x + (simOn ? 0 : xDrift);
      pose.side = clamp(raw * 1.15 + B.lean * 0.4, -1.3, 1.3);
      pose.crouch = B.crouch;
      pose.lean = B.lean;
      pose.armsUp = B.armsUp || L.seen && R.seen && L.y < 0.26 && R.y < 0.26;
      if (B.jumping) airUntil = Math.max(airUntil, now + 250);
      pose.src = simOn ? "sim" : "body";
    } else if (keyMode) {
      pose.side = (keys.ArrowLeft ? -0.8 : 0) + (keys.ArrowRight ? 0.8 : 0);
      pose.crouch = keys.ArrowDown ? 1 : 0;
      pose.armsUp = !!keys.KeyA;
      pose.lean = 0;
      if (keys.ArrowUp) airUntil = Math.max(airUntil, now + 120);
      pose.src = "keys";
    } else if (BodyMovin.mouse) {
      pose.side = R.x < 0.36 ? -0.8 : R.x > 0.64 ? 0.8 : (R.x - 0.5) * 2;
      pose.crouch = R.y > 0.7 ? 1 : 0;
      pose.lean = 0;
      pose.armsUp = R.y < 0.3;
      if (R.y < 0.3) {
        airUntil = Math.max(airUntil, now + 120);
      }
      pose.src = "mouse";
    } else {
      pose.side *= 0.9;
      pose.crouch *= 0.9;
      pose.armsUp = false;
      pose.src = "none";
    }
    pose.airborne = now < airUntil;
    pose.air = lerp(pose.air, pose.airborne ? 1 : 0, pose.airborne ? 0.3 : 0.18);
  }
  let studioReady = false, startQueued = false;
  addEventListener("keydown", (e) => {
    keys[e.code] = true;
    if (e.code.startsWith("Arrow") || e.code === "KeyA") {
      lastKeyAt = performance.now();
      if (e.code === "ArrowUp" && !e.repeat) airUntil = performance.now() + 620;
    }
    onKey(e);
  });
  addEventListener("keyup", (e) => {
    keys[e.code] = false;
  });
  const MOVES = {
    squat: { label: "SQUAT", col: [90, 255, 190], ok: (p) => p.crouch > 0.42 },
    jump: { label: "JUMP", col: [255, 210, 90], ok: (p) => p.airborne },
    left: { label: "STEP LEFT", col: [110, 200, 255], ok: (p) => p.side < -0.28 },
    right: { label: "STEP RIGHT", col: [255, 120, 220], ok: (p) => p.side > 0.28 },
    arms: { label: "ARMS UP", col: [190, 140, 255], ok: (p) => p.armsUp },
    squatL: { label: "SQUAT LEFT", col: [110, 230, 230], ok: (p) => p.crouch > 0.42 && p.side < -0.25, combo: true },
    squatR: { label: "SQUAT RIGHT", col: [255, 150, 190], ok: (p) => p.crouch > 0.42 && p.side > 0.25, combo: true }
  };
  const HOLES = {
    squat: [-1, 1, 0, 1.05],
    jump: [-1.1, 1.1, 0.55, 2.35],
    left: [-2, -0.35, 0, 2.15],
    right: [0.35, 2, 0, 2.15],
    arms: [-0.5, 0.5, 0, 2.55],
    squatL: [-2, -0.3, 0, 1.05],
    squatR: [0.3, 2, 0, 1.05]
  };
  const GHOST = {
    squat: { crouch: 1, side: 0 },
    jump: { air: 1, side: 0 },
    left: { side: -1 },
    right: { side: 1 },
    arms: { armsUp: true },
    squatL: { crouch: 1, side: -1 },
    squatR: { crouch: 1, side: 1 }
  };
  const SLOTS = {
    squat: [[0.3, 0.56], [0.7, 0.56]],
    jump: [[0.34, 0.22], [0.66, 0.22]],
    left: [[0.26, 0.32], [0.46, 0.56]],
    right: [[0.54, 0.56], [0.74, 0.32]],
    arms: [[0.42, 0.14], [0.58, 0.14]],
    squatL: [[0.28, 0.62], [0.46, 0.72]],
    squatR: [[0.54, 0.72], [0.72, 0.62]]
  };
  const SLOT_TOL = { x: 0.1, y: 0.15 };
  function slotWorld(sl) {
    return [(sl.x * W - W / 2) / K0, CAM.h - (sl.y * H - H * CAM.hor) / K0];
  }
  function handprint(x, y, r, col, alpha, lit, mirror2) {
    ctx.save();
    ctx.translate(x, y);
    if (mirror2) ctx.scale(-1, 1);
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 1.8);
    g.addColorStop(0, rgba(lit ? [255, 255, 255] : col, (lit ? 0.5 : 0.22) * alpha));
    g.addColorStop(1, rgba(col, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.8, 0, 6.283);
    ctx.fill();
    const shape = new Path2D();
    shape.roundRect(-r * 0.5, -r * 0.35, r, r * 0.95, r * 0.3);
    ctx.fillStyle = rgba(col, (lit ? 0.6 : 0.25) * alpha);
    ctx.fill(shape);
    ctx.strokeStyle = rgba(lit ? [255, 255, 255] : col, 0.95 * alpha);
    ctx.lineWidth = Math.max(1.5, r * 0.09);
    ctx.stroke(shape);
    ctx.lineWidth = Math.max(2, r * 0.2);
    for (const [fx, len] of [[-0.36, 0.55], [-0.12, 0.66], [0.12, 0.62], [0.35, 0.5]]) {
      ctx.beginPath();
      ctx.moveTo(fx * r, -r * 0.4);
      ctx.lineTo(fx * r * 1.1, -r * (0.4 + len));
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(-r * 0.5, r * 0.15);
    ctx.lineTo(-r * 0.92, -r * 0.3);
    ctx.stroke();
    ctx.restore();
  }
  const HAND_COL = { left: [255, 122, 217], right: [102, 224, 255] };
  const CAM = { d: 5, h: 2, hor: 0.36 }, HALF = 2.2, TOP = 2.75, FAR = 26;
  function P(X, Y, Z) {
    const s = K0 * CAM.d / Math.max(0.05, Z + CAM.d);
    return [W / 2 + X * s, H * CAM.hor - (Y - CAM.h) * s, s];
  }
  function figure(x, y, h, p, col, alpha, lw, glow = true) {
    const cr = clamp(p.crouch || 0, 0, 1), air = p.air || 0, lean = clamp(p.lean || 0, -1, 1) * 0.12, up = !!p.armsUp, run = p.run;
    const legL = h * 0.47 * (1 - 0.42 * cr), torso = h * 0.32 * (1 - 0.1 * cr), headR = h * 0.075;
    const fy = y - air * h * 0.32;
    const hip = [x + lean * h * 0.15, fy - legL], sh = [hip[0] + lean * h * 0.6 + cr * h * 0.03, hip[1] - torso], head = [sh[0] + lean * h * 0.2, sh[1] - headR * 1.6];
    const knee = (s) => [hip[0] + s * h * (0.08 + 0.12 * cr) + (run ? Math.sin(run + (s > 0 ? 0 : Math.PI)) * h * 0.06 : 0), hip[1] + legL * 0.5 - (air ? h * 0.05 : 0)];
    const foot = (s) => [x + s * h * (0.09 + 0.03 * cr) + (run ? Math.sin(run + (s > 0 ? 0 : Math.PI) - 0.6) * h * 0.08 : 0), fy - (air ? h * 0.06 * (s > 0 ? 1 : 0.4) : 0)];
    const hand = (s) => up ? [sh[0] + s * h * 0.17, sh[1] - h * 0.34] : cr > 0.5 ? [sh[0] + s * h * 0.2, sh[1] + h * 0.08] : [sh[0] + s * h * 0.17 + (run ? Math.sin(run + (s > 0 ? Math.PI : 0)) * h * 0.05 : 0), sh[1] + h * 0.27 - air * h * 0.12];
    const elbow = (s) => {
      const hd = hand(s);
      return up ? [sh[0] + s * h * 0.13, sh[1] - h * 0.16] : [(sh[0] + hd[0]) / 2 + s * h * 0.05, (sh[1] + hd[1]) / 2];
    };
    const path = new Path2D();
    for (const s of [-1, 1]) {
      const k = knee(s), f = foot(s), e = elbow(s), hd = hand(s);
      path.moveTo(hip[0] + s * h * 0.04, hip[1]);
      path.lineTo(k[0], k[1]);
      path.lineTo(f[0], f[1]);
      path.moveTo(sh[0] + s * h * 0.07, sh[1] + h * 0.01);
      path.lineTo(e[0], e[1]);
      path.lineTo(hd[0], hd[1]);
    }
    path.moveTo(sh[0] - h * 0.07, sh[1] + h * 0.01);
    path.lineTo(sh[0] + h * 0.07, sh[1] + h * 0.01);
    const body = new Path2D();
    body.moveTo(hip[0], hip[1] - h * 0.02);
    body.lineTo(sh[0], sh[1] + h * 0.03);
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (glow) {
      ctx.globalCompositeOperation = "lighter";
      for (const [w, a] of [[3.6, 0.07], [2.2, 0.14]]) {
        ctx.strokeStyle = rgba(col, alpha * a);
        ctx.lineWidth = lw * w;
        ctx.stroke(path);
        ctx.fillStyle = rgba(col, alpha * a);
        ctx.beginPath();
        ctx.arc(head[0], head[1], headR + lw * w * 0.5, 0, 6.283);
        ctx.fill();
      }
    }
    if (glow) {
      ctx.strokeStyle = rgba(col, alpha * 0.14);
      ctx.lineWidth = lw * 5.2;
      ctx.stroke(body);
    }
    ctx.strokeStyle = rgba(col, alpha);
    ctx.lineWidth = lw;
    ctx.stroke(path);
    ctx.lineWidth = lw * 2.6;
    ctx.stroke(body);
    if (glow) {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = rgba([12, 10, 40], alpha * 0.55);
      ctx.lineWidth = lw * 0.45;
      ctx.stroke(path);
      ctx.lineWidth = lw * 1.9;
      ctx.stroke(body);
      ctx.globalCompositeOperation = "lighter";
    }
    ctx.strokeStyle = rgba([255, 255, 255], alpha * (glow ? 0.35 : 0.7));
    ctx.lineWidth = lw * (glow ? 0.18 : 0.35);
    ctx.stroke(path);
    ctx.fillStyle = rgba(col, alpha);
    ctx.beginPath();
    ctx.arc(head[0], head[1], headR * (glow ? 1.25 : 1), 0, 6.283);
    ctx.fill();
    if (glow) {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = rgba([12, 10, 40], alpha * 0.55);
      ctx.beginPath();
      ctx.arc(head[0], head[1], headR * 1.25 - lw * 0.5, 0, 6.283);
      ctx.fill();
      ctx.fillStyle = rgba(col, alpha);
      const ey = head[1] - headR * 0.1;
      ctx.beginPath();
      ctx.arc(head[0] - headR * 0.38, ey, headR * 0.14, 0, 6.283);
      ctx.arc(head[0] + headR * 0.38, ey, headR * 0.14, 0, 6.283);
      ctx.fill();
      ctx.strokeStyle = rgba(col, alpha);
      ctx.lineWidth = headR * 0.14;
      ctx.beginPath();
      ctx.arc(head[0], head[1] + headR * 0.12, headR * 0.42, 0.5, Math.PI - 0.5);
      ctx.stroke();
    } else {
      ctx.fillStyle = rgba([255, 255, 255], alpha * 0.6);
      ctx.beginPath();
      ctx.arc(head[0], head[1], headR * 0.55, 0, 6.283);
      ctx.fill();
    }
    ctx.restore();
  }
  function icon(kind, cx, cy, r, alpha = 1) {
    const m = MOVES[kind], col = m.col;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.4);
    g.addColorStop(0, rgba(col, 0.28 * alpha));
    g.addColorStop(1, rgba(col, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.4, 0, 6.283);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = rgba([8, 6, 22], 0.78 * alpha);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 6.283);
    ctx.fill();
    ctx.strokeStyle = rgba(col, 0.9 * alpha);
    ctx.lineWidth = r * 0.07;
    ctx.stroke();
    const gp = GHOST[kind], fh = r * 1.15;
    figure(cx + (gp.side || 0) * r * 0.32, cy + r * 0.55, fh, { crouch: gp.crouch, air: gp.air ? 0.6 : 0, armsUp: gp.armsUp }, col, alpha, r * 0.085, false);
    ctx.strokeStyle = rgba([255, 255, 255], alpha);
    ctx.fillStyle = rgba([255, 255, 255], alpha);
    ctx.lineWidth = r * 0.07;
    ctx.lineCap = "round";
    const arrow = (x0, y0, x1, y1) => {
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      const a = Math.atan2(y1 - y0, x1 - x0), hl = r * 0.2;
      ctx.beginPath();
      ctx.moveTo(x1 + Math.cos(a) * hl * 0.4, y1 + Math.sin(a) * hl * 0.4);
      ctx.lineTo(x1 - Math.cos(a - 0.6) * hl, y1 - Math.sin(a - 0.6) * hl);
      ctx.lineTo(x1 - Math.cos(a + 0.6) * hl, y1 - Math.sin(a + 0.6) * hl);
      ctx.fill();
    };
    if (kind === "squat" || kind === "squatL" || kind === "squatR") arrow(cx + r * 0.55 * (kind === "squatL" ? -1 : 1) * (kind === "squat" ? 1 : -1), cy - r * 0.55, cx + r * 0.55 * (kind === "squatL" ? -1 : 1) * (kind === "squat" ? 1 : -1), cy - r * 0.05);
    if (kind === "jump") arrow(cx + r * 0.55, cy + r * 0.15, cx + r * 0.55, cy - r * 0.5);
    if (kind === "left" || kind === "squatL") arrow(cx + r * 0.25, cy - r * 0.62, cx - r * 0.5, cy - r * 0.62);
    if (kind === "right" || kind === "squatR") arrow(cx - r * 0.25, cy - r * 0.62, cx + r * 0.5, cy - r * 0.62);
    if (kind === "arms") {
      ctx.beginPath();
      ctx.arc(cx, cy - r * 0.62, r * 0.08, 0, 6.283);
      ctx.fill();
    }
  }
  const STAMP = /* @__PURE__ */ new Map();
  function stamp(id, key2, w, h, pad, draw) {
    let st = STAMP.get(id);
    if (!st) STAMP.set(id, st = { c: document.createElement("canvas"), key: null });
    if (st.key !== key2) {
      st.key = key2;
      st.c.width = Math.ceil(w + 2 * pad);
      st.c.height = Math.ceil(h + 2 * pad);
      const main = ctx;
      ctx = st.c.getContext("2d");
      try {
        draw(pad, pad);
      } finally {
        ctx = main;
      }
    }
    return st.c;
  }
  function iconTV(kind, cx, cy, r, alpha) {
    const rb = Math.pow(2, Math.round(Math.log2(Math.max(4, r)) * 4) / 4), pad = Math.ceil(rb * 1.45), c = stamp("icon:" + kind + ":" + rb, 1, 2 * pad, 2 * pad, 0, () => icon(kind, pad, pad, rb));
    const k = r / rb;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.drawImage(c, cx - pad * k, cy - pad * k, c.width * k, c.height * k);
    ctx.restore();
    ctx.lineCap = "round";
  }
  const ENV_ROT = +((_a = Q.get("rot")) != null ? _a : 0), EXP = +((_b = Q.get("exp")) != null ? _b : 0.92), ENVI = +((_c = Q.get("env")) != null ? _c : 0.3);
  const RR = setup(document.getElementById("gl"), { fov: 50, near: 0.1, far: 300, tier: Q.has("tier") ? +Q.get("tier") : void 0 });
  const { scene, camera, renderer } = RR;
  await environment(scene, renderer, "tv_studio", { background: false, intensity: ENVI, rotation: ENV_ROT });
  scene.background = new Color(131848);
  scene.fog = new FogExp2(395279, +((_d = Q.get("fog")) != null ? _d : 0.012));
  {
    const TM = { agx: AgXToneMapping, aces: ACESFilmicToneMapping, cineon: CineonToneMapping };
    renderer.toneMapping = (_e2 = TM[Q.get("tm")]) != null ? _e2 : ACESFilmicToneMapping;
  }
  renderer.toneMappingExposure = EXP;
  function fitCam() {
    const w = innerWidth, h = innerHeight, k0 = Math.min(0.22 * h, 0.15 * w), f = k0 * CAM.d, Hf = 2 * h * (1 - CAM.hor);
    camera.position.set(0, CAM.h, CAM.d);
    camera.rotation.set(0, 0, 0);
    camera.fov = 2 * Math.atan(Hf / 2 / f) * 180 / Math.PI;
    camera.aspect = w / Hf;
    camera.setViewOffset(w, Hf, 0, Hf / 2 - h * CAM.hor, w, h);
    camera.updateProjectionMatrix();
  }
  addEventListener("resize", fitCam);
  fitCam();
  const key = sun(scene, { color: 16773600, intensity: +((_f = Q.get("sun")) != null ? _f : 1.25), position: [2.5, 12, 6], target: [0, 0, -6], size: 16 });
  key.shadow.camera.far = 50;
  key.shadow.radius = 4;
  const follow = new SpotLight(16774114, +((_g = Q.get("spot")) != null ? _g : 520), 45, 0.3, 0.8, 2);
  follow.position.set(0.4, 9.5, 11.5);
  follow.target.position.set(0, 0.8, -0.8);
  follow.castShadow = true;
  follow.shadow.mapSize.set(1024, 1024);
  follow.shadow.bias = -2e-4;
  follow.shadow.normalBias = 0.02;
  follow.shadow.radius = 3;
  Object.assign(follow.shadow.camera, { near: 4, far: 32 });
  scene.add(follow, follow.target);
  const washA = new PointLight(16726696, 9, 22, 1.8), washB = new PointLight(3393791, 9, 22, 1.8);
  washA.position.set(-4, 4.5, -18);
  washB.position.set(4, 4.5, -18);
  scene.add(washA, washB);
  const canvasTex = (w, h, draw, srgb = true) => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d"), w, h);
    const t = new CanvasTexture(c);
    if (srgb) t.colorSpace = SRGBColorSpace;
    t.anisotropy = 8;
    t.wrapS = t.wrapT = RepeatWrapping;
    return t;
  };
  const put = (geo, mat, x = 0, y = 0, z = 0, cast = false) => {
    const m = new Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = cast;
    m.receiveShadow = true;
    scene.add(m);
    STATIC.push(m);
    return m;
  };
  const STATIC = [];
  const _c0 = new Color(), _m0 = new Matrix4();
  const STAGE_HW = 2.7, STAGE_BACK = 0.45, STAGE_FAR = -46, WATER_Y = -0.38, POOL = { x: 7.5, z0: 7, z1: -16, floor: -1.7 };
  const SHOW_T = { value: 0 };
  const mirror = new Reflector(new PlaneGeometry(1, 1), { textureWidth: 8, textureHeight: 8, multisample: 0, clipBias: 2e-3 });
  mirror.rotation.x = -Math.PI / 2;
  mirror.updateMatrixWorld();
  const mirRT = mirror.getRenderTarget();
  Object.assign(mirRT.texture, { generateMipmaps: true, minFilter: LinearMipmapLinearFilter });
  const MIR = { uMir: { value: mirRT.texture }, uMirVP: { value: new Matrix4() }, uMirOn: { value: 0 } };
  const mirHide = [], MIR_NONE = new DataTexture(new Uint8Array(4), 1, 1);
  MIR_NONE.needsUpdate = true;
  function renderMirror() {
    const q = state().quality, on = q.tier >= 1 && !Q.has("nomir");
    MIR.uMirOn.value = on ? 1 : 0;
    if (!on) return;
    const k = q.tier >= 2 ? 0.5 : 0.33, w = Math.max(64, Math.round(innerWidth * k)), h = Math.max(64, Math.round(innerHeight * k));
    if (mirRT.width !== w || mirRT.height !== h) mirRT.setSize(w, h);
    const hidden = [...mirHide, athleteBlob, ...walls.filter((w2) => w2.blob).map((w2) => w2.blob)].filter((o) => o.visible);
    hidden.forEach((o) => o.visible = false);
    MIR.uMir.value = MIR_NONE;
    MIR.uMirOn.value = 0;
    mirror.onBeforeRender(renderer, scene, camera);
    hidden.forEach((o) => o.visible = true);
    MIR.uMir.value = mirRT.texture;
    MIR.uMirOn.value = 1;
    MIR.uMirVP.value.multiplyMatrices(mirror.camera.projectionMatrix, mirror.camera.matrixWorldInverse);
  }
  const MIR_HEAD = "uniform sampler2D uMir; uniform mat4 uMirVP; uniform float uMirOn; varying vec3 vMirW;\n";
  const mirVert = (sh) => {
    sh.vertexShader = "varying vec3 vMirW;\n" + sh.vertexShader.replace("#include <project_vertex>", "#include <project_vertex>\n  vMirW = (modelMatrix * vec4(transformed, 1.0)).xyz;");
  };
  function mirrorize(mat, { k = 1, f0 = 0.04, lod = 1, lodR = 6, dist = 0.035 } = {}) {
    mat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, MIR, { uMirK: { value: new Vector4(k, f0, lod, lodR) }, uMirD: { value: dist } });
      mirVert(sh);
      sh.fragmentShader = MIR_HEAD + "uniform vec4 uMirK; uniform float uMirD;\n" + sh.fragmentShader.replace("#include <opaque_fragment>", "\n  if (uMirOn > 0.5) {\n    vec4 mc = uMirVP * vec4(vMirW, 1.0); vec2 muv = mc.xy / mc.w * 0.5 + 0.5 + normal.xy * uMirD;\n    float nv = clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), fr = uMirK.y + (1.0 - uMirK.y) * pow(1.0 - nv, 5.0);\n    outgoingLight += textureLod(uMir, clamp(muv, 0.001, 0.999), uMirK.z + roughnessFactor * uMirK.w).rgb * fr * uMirK.x;\n  }\n#include <opaque_fragment>");
    };
    mat.customProgramCacheKey = () => "mirror-v1";
    return mat;
  }
  const stageLen = STAGE_BACK - STAGE_FAR, stageZ = (STAGE_BACK + STAGE_FAR) / 2;
  const deckTop = mirrorize(pbr("blue_metal_plate", { repeat: [STAGE_HW * 2 / 2.6, stageLen / 2.6], physical: true, clearcoat: 1, normalScale: 0.7, envMapIntensity: 0.55 }), { k: 0.8, lod: 0.5, lodR: 5 });
  deckTop.clearcoatRoughness = 0.07;
  deckTop.color = new Color(0.82, 0.88, 1);
  const padM = new MeshPhysicalMaterial({ color: 12067100, roughness: 0.5, clearcoat: 0.5, clearcoatRoughness: 0.25, sheen: 0.3, sheenColor: new Color(16751242) });
  const stage = put(new BoxGeometry(STAGE_HW * 2, 2, stageLen), [padM, padM, deckTop, padM, padM, padM], 0, -1, stageZ);
  mirHide.push(stage);
  {
    const scuff = canvasTex(64, 2048, (g, w, h) => {
      g.fillStyle = "#fff";
      g.fillRect(0, 0, w, h);
      for (let i = 0; i < 900; i++) {
        g.fillStyle = "rgba(0,0,0,".concat(0.25 + Math.random() * 0.6, ")");
        g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 5, 1 + Math.random() * 14);
      }
      for (let i = 0; i < 26; i++) {
        g.fillStyle = "rgba(0,0,0,0.5)";
        g.fillRect(0, Math.random() * h, w, 2 + Math.random() * 10);
      }
    }, false);
    const paintM = new MeshPhysicalMaterial({ color: 15658730, roughness: 0.32, clearcoat: 0.8, clearcoatRoughness: 0.1, alphaMap: scuff, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
    for (const s of [-1, 1]) {
      const l = put(new PlaneGeometry(0.09, stageLen - 0.4), paintM, s * 2.56, 2e-3, stageZ - 0.2);
      l.rotation.x = -Math.PI / 2;
      l.receiveShadow = true;
      mirHide.push(l);
    }
  }
  const chromeM = new MeshStandardMaterial({ color: 15659509, metalness: 1, roughness: 0.1, envMapIntensity: 1.4 });
  const brushedM = new MeshStandardMaterial({ color: 12896721, metalness: 1, roughness: 0.32, envMapIntensity: 1.1 });
  for (const s of [-1, 1]) put(new BoxGeometry(0.05, 0.035, stageLen), chromeM, s * (STAGE_HW - 0.025), 0.017, stageZ);
  const vinylY = new MeshPhysicalMaterial({ color: 15311634, roughness: 0.42, clearcoat: 0.4, clearcoatRoughness: 0.28, sheen: 0.35, sheenColor: new Color(16773296) });
  {
    const PL = 1.96, n = Math.floor(stageLen / 2), pads = new InstancedMesh(new RoundedBoxGeometry(0.28, 0.28, PL, 3, 0.11), vinylY, n * 2);
    for (let i = 0; i < n; i++) for (const s of [0, 1]) {
      _m0.makeTranslation((s ? 1 : -1) * (STAGE_HW + 0.07), -0.1, STAGE_BACK - 1 - i * 2);
      pads.setMatrixAt(i * 2 + s, _m0);
    }
    pads.castShadow = pads.receiveShadow = true;
    scene.add(pads);
  }
  put(new RoundedBoxGeometry(STAGE_HW * 2 + 0.4, 0.24, 0.3, 3, 0.1), new MeshPhysicalMaterial({ color: 1525944, roughness: 0.45, clearcoat: 0.45, clearcoatRoughness: 0.3, sheen: 0.35, sheenColor: new Color(10139903) }), 0, -0.1, STAGE_BACK + 0.08, true);
  {
    const ring = put(new RingGeometry(0.62, 0.72, 64), new MeshPhysicalMaterial({ color: 16761375, roughness: 0.35, clearcoat: 0.8, emissive: 16756736, emissiveIntensity: 0.06 }), 0, 4e-3, 0);
    ring.rotation.x = -Math.PI / 2;
    mirHide.push(ring);
  }
  for (const s of [-1, 1]) put(new BoxGeometry(0.07, 0.035, stageLen - 0.4), chromeM, s * 2.33, 0.017, stageZ - 0.2);
  const stripM = new MeshBasicMaterial({ color: new Color(3854591).multiplyScalar(2.2), fog: false });
  for (const s of [-1, 1]) put(new BoxGeometry(0.03, 0.04, stageLen), stripM, s * (STAGE_HW + 5e-3), -0.3, stageZ);
  const tileTex = canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = "#d9e6ea";
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) {
      g.fillStyle = "hsl(".concat(190 + Math.random() * 8, ",").concat(50 + Math.random() * 12, "%,").concat(50 + Math.random() * 9, "%)");
      g.fillRect(i * 85.3 + 3, j * 85.3 + 3, 79, 79);
    }
  });
  let tileTV = null;
  const tileUV = (g, rx, ry) => {
    if (TVM) {
      const uv = g.attributes.uv;
      for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * rx, uv.getY(i) * ry);
    }
    return g;
  };
  const tileM = (rx, ry) => {
    if (TVM) {
      if (tileTV) return tileTV;
      rx = ry = 1;
    }
    const t = tileTex.clone();
    t.needsUpdate = true;
    t.repeat.set(rx, ry);
    const m = new MeshPhysicalMaterial({ map: t, roughness: 0.2, clearcoat: 0.6, clearcoatRoughness: 0.1 });
    if (TVM) tileTV = m;
    return m;
  };
  const poolLen = POOL.z0 - POOL.z1, poolZ = (POOL.z0 + POOL.z1) / 2, poolD = -POOL.floor;
  for (const s of [-1, 1]) {
    const wl = put(tileUV(new PlaneGeometry(poolLen, poolD), poolLen / 1.2, poolD / 1.2), tileM(poolLen / 1.2, poolD / 1.2), s * POOL.x, POOL.floor / 2, poolZ);
    wl.rotation.y = -s * Math.PI / 2;
  }
  put(tileUV(new PlaneGeometry(POOL.x * 2, poolD), POOL.x * 2 / 1.2, poolD / 1.2), tileM(POOL.x * 2 / 1.2, poolD / 1.2), 0, POOL.floor / 2, POOL.z1);
  function waterNormals(n = 256) {
    const waves = Array.from({ length: 9 }, () => ({ kx: (Math.random() * 7 | 0) - 3, ky: 1 + (Math.random() * 6 | 0), a: 0.4 + Math.random(), p: Math.random() * 6.283 }));
    return canvasTex(n, n, (g) => {
      const img = g.createImageData(n, n);
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
        let dx = 0, dy = 0;
        for (const w of waves) {
          const ph = 6.283 * (w.kx * x + w.ky * y) / n + w.p, c = Math.cos(ph) * w.a;
          dx += c * w.kx;
          dy += c * w.ky;
        }
        const nx = -dx * 0.05, ny = -dy * 0.05, l = Math.hypot(nx, ny, 1), i = (y * n + x) * 4;
        img.data[i] = (nx / l * 0.5 + 0.5) * 255;
        img.data[i + 1] = (ny / l * 0.5 + 0.5) * 255;
        img.data[i + 2] = (1 / l * 0.5 + 0.5) * 255;
        img.data[i + 3] = 255;
      }
      g.putImageData(img, 0, 0);
    }, false);
  }
  const wN1 = waterNormals(), wN2 = waterNormals();
  wN1.repeat.set(7, 11);
  wN2.repeat.set(3, 5);
  const WU = { uT: SHOW_T, uAgit: { value: 0 }, uSplash: { value: new Vector4(0, 0, 99, 0) }, uUnder: { value: +((_h = Q.get("under")) != null ? _h : 1) } };
  const waterM = new MeshPhysicalMaterial({
    color: 0,
    roughness: 0.06,
    metalness: 0,
    normalMap: wN1,
    normalScale: new Vector2(0.3, 0.3),
    specularIntensity: 0.6,
    clearcoat: 0.6,
    clearcoatRoughness: 0.02,
    clearcoatNormalMap: wN2,
    clearcoatNormalScale: new Vector2(0.45, 0.45),
    envMapIntensity: 0.35
  });
  const f3 = (v) => v.toFixed(3);
  waterM.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, MIR, WU);
    mirVert(sh);
    sh.fragmentShader = MIR_HEAD + "uniform float uT, uAgit, uUnder; uniform vec4 uSplash;\n#define POOLX ".concat(f3(POOL.x), "\n#define FLOORY ").concat(f3(POOL.floor), "\n#define POOLZ1 ").concat(f3(POOL.z1), "\n#define STAGEX ").concat(f3(STAGE_HW + 0.02), "\n#define STAGEZB ").concat(f3(STAGE_BACK + 0.02), "\n#define WATERY ").concat(f3(WATER_Y), "\nfloat wHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }\nfloat wNoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);\n  return mix(mix(wHash(i), wHash(i + vec2(1, 0)), f.x), mix(wHash(i + vec2(0, 1)), wHash(i + vec2(1, 1)), f.x), f.y); }\nfloat caustic(vec2 uv, float time) {   // tileable water caustic (after joltz0r's well-known pattern)\n  vec2 p = mod(uv * 6.28318, 6.28318) - 250.0, i = p; float c = 1.0, inten = 0.005;\n  for (int n = 0; n < 4; n++) { float t = time * (1.0 - (3.5 / float(n + 1)));\n    i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));\n    c += 1.0 / length(vec2(p.x / (sin(i.x + t) / inten), p.y / (cos(i.y + t) / inten))); }\n  c /= 4.0; c = 1.17 - pow(c, 1.4); return pow(abs(c), 8.0); }\nvec3 poolTile(vec2 p) {\n  vec2 g = p / 0.2, f = abs(fract(g) - 0.5); float aa = clamp(length(fwidth(g)), 0.002, 0.5);\n  float grout = smoothstep(0.43 - aa, 0.43 + aa, max(f.x, f.y)) * (1.0 - smoothstep(0.25, 0.5, aa));\n  float v = wHash(floor(g));\n  return mix(mix(vec3(0.16, 0.46, 0.58), vec3(0.24, 0.58, 0.68), v), vec3(0.62, 0.70, 0.72), grout * 0.8);\n}\n") + sh.fragmentShader.replace("#include <opaque_fragment>", "\n  {\n    vec3 Vw = normalize(vMirW - cameraPosition), Nw = normalize((vec4(normal, 0.0) * viewMatrix).xyz);\n    vec3 o = vMirW, Rf = refract(Vw, Nw, 0.752);\n    float t = (FLOORY - o.y) / min(Rf.y, -0.02); int kind = 0;\n    if (abs(Rf.x) > 1e-4) { float tw = (sign(Rf.x) * POOLX - o.x) / Rf.x; if (tw > 0.0 && tw < t) { t = tw; kind = 1; } }\n    if (Rf.z < 0.0) { float tz = (POOLZ1 - o.z) / Rf.z; if (tz > 0.0 && tz < t) { t = tz; kind = 2; } }\n    if (abs(o.x) > STAGEX && o.x * Rf.x < 0.0) { float ts = (sign(o.x) * STAGEX - o.x) / Rf.x; if (ts > 0.0 && ts < t) { t = ts; kind = 3; } }\n    vec3 hp = o + Rf * t;\n    vec3 alb;\n    if (kind == 3) alb = vec3(0.32, 0.035, 0.03);\n    else {\n      alb = poolTile(kind == 0 ? hp.xz : kind == 1 ? hp.zy : hp.xy);\n      if (kind == 0) { float lane = 1.0 - smoothstep(0.12, 0.14, abs(abs(hp.x) - 5.2)); alb = mix(alb, vec3(0.02, 0.05, 0.16), lane * step(POOLZ1 + 1.0, hp.z)); }\n    }\n    // light on the basin: the rig from above, focused into caustics, shaded beside the runway, plus the underwater lamps\n    float cs = caustic(hp.xz / 1.9 + vec2(0.0, hp.y * 0.15), uT * 0.55) + 0.6 * caustic(hp.xz / 1.1 + 3.7, uT * 0.4);\n    float shade = mix(0.3, 1.0, smoothstep(STAGEX, STAGEX + 1.6, abs(hp.x)));\n    float zl = clamp(4.0 - 4.0 * floor((4.0 - hp.z) / 4.0 + 0.5), -12.0, 4.0);\n    vec3 dl = hp - vec3(sign(hp.x) * POOLX, -1.0, zl);\n    float lamp = 1.0 / (1.0 + 5.0 * dot(dl, dl));\n    float lens = kind == 1 ? 1.0 - smoothstep(0.12, 0.17, length(dl.zy)) : 0.0;\n    vec3 under = alb * (vec3(0.85, 0.95, 1.0) * uUnder * (0.55 + 1.5 * cs) * shade + vec3(0.5, 0.85, 1.0) * lamp * 1.4) + vec3(0.7, 0.95, 1.0) * lens * 6.0;\n    float depth = WATERY - hp.y, L = t + depth;   // down through the water and back up\n    vec3 refr = under * exp(-vec3(0.55, 0.16, 0.09) * L) + vec3(0.004, 0.035, 0.055) * uUnder * (1.0 - exp(-0.5 * L));\n    // reflection: the mirror is at stage level, the water 0.38 m lower, so look the same way from 2 x 0.38 m higher\n    float nv = clamp(dot(-Vw, Nw), 0.0, 1.0), fr = 0.02 + 0.98 * pow(1.0 - nv, 5.0);\n    vec3 refl = vec3(0.0);\n    if (uMirOn > 0.5) { vec4 mc = uMirVP * vec4(vMirW + vec3(0.0, -2.0 * WATERY, 0.0), 1.0); refl = textureLod(uMir, clamp(mc.xy / mc.w * 0.5 + 0.5 + normal.xy * (0.05 + 0.08 * uAgit), 0.001, 0.999), 1.0).rgb; }\n    outgoingLight = outgoingLight * 0.7 + mix(refr, refl, fr);\n    // foam: churned along the runway's sides and the pool walls, and a white patch spreading after a splash\n    float n1 = wNoise(mat2(0.94, -0.34, 0.34, 0.94) * o.xz * vec2(5.0, 2.2) + vec2(uT * 0.25, uT * 0.7)), n2 = wNoise(mat2(0.8, 0.6, -0.6, 0.8) * o.xz * 13.0 - uT * 0.9);   // turned off the grid: value noise shows its square cells when two layers line up\n    float edge = 1.0 - smoothstep(0.0, 0.22 + 0.5 * uAgit, max(abs(o.x) - STAGEX, (o.z - STAGEZB) * 3.0)), wall = 1.0 - smoothstep(0.0, 0.18, POOLX - abs(o.x));\n    float sd = length(o.xz - uSplash.xy), age = uSplash.z;\n    float spl = (1.0 - smoothstep(0.2, 0.8 + 1.6 * age, sd)) * exp(-age * 0.45);\n    float foam = clamp(max(max(edge, wall * 0.7) * smoothstep(0.35, 0.8, n1 * 0.65 + n2 * 0.5), spl * smoothstep(0.25, 0.65, n1 * 0.5 + n2 * 0.6)), 0.0, 1.0);\n    outgoingLight = mix(outgoingLight, vec3(0.82, 0.88, 0.9) * (0.35 + 0.65 * uUnder), foam * 0.85);\n  }\n#include <opaque_fragment>");
  };
  waterM.customProgramCacheKey = () => "pool-water-v1";
  {
    const wt = put(new PlaneGeometry(POOL.x * 2, poolLen), waterM, 0, WATER_Y, poolZ);
    wt.rotation.x = -Math.PI / 2;
    wt.receiveShadow = false;
    mirHide.push(wt);
  }
  const copeM = new MeshPhysicalMaterial({ color: 15330286, roughness: 0.4, clearcoat: 0.3 });
  for (const s of [-1, 1]) put(new RoundedBoxGeometry(0.4, 0.12, poolLen + 0.4, 2, 0.05), copeM, s * (POOL.x + 0.2), -0.04, poolZ);
  put(new RoundedBoxGeometry(POOL.x * 2 + 0.8, 0.12, 0.4, 2, 0.05), copeM, 0, -0.04, POOL.z1 - 0.2);
  const deckM = mirrorize(pbr("concrete_floor_02", { repeat: [6, 30], color: 1711140, roughness: 0.3, envMapIntensity: 0.4 }), { k: 0.55, lod: 1.5, lodR: 4 });
  for (const s of [-1, 1]) mirHide.push(put(new BoxGeometry(12, 0.4, 60), deckM, s * (POOL.x + 0.4 + 6), -0.22, -20));
  mirHide.push(put(new BoxGeometry(POOL.x * 2 + 0.8, 0.4, 40), deckM, 0, -0.22, POOL.z1 - 0.4 - 20));
  function ledMat(map, cols, rows, { cab = 16, gain = 1.5, offset = false } = {}) {
    return new ShaderMaterial({
      fog: false,
      uniforms: { map: { value: map }, uGrid: { value: new Vector2(cols, rows) }, uCab: { value: cab }, uGain: { value: gain }, uOff: { value: new Vector2() }, uTint: { value: new Color(1, 1, 1) } },
      vertexShader: "varying vec2 vUv; varying vec3 vN, vV; void main() { vUv = uv; vec4 mv = modelViewMatrix * vec4(position, 1.0); vV = -mv.xyz; vN = normalMatrix * normal; gl_Position = projectionMatrix * mv; }",
      fragmentShader: "uniform sampler2D map; uniform vec2 uGrid, uOff; uniform float uCab, uGain; uniform vec3 uTint; varying vec2 vUv; varying vec3 vN, vV;\n      float hh(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }\n      void main() {\n        vec2 g = vUv * uGrid, cell = floor(g), f = fract(g) - 0.5;\n        vec3 c = texture2D(map, (cell + 0.5) / uGrid + uOff).rgb * uTint;\n        float px = length(fwidth(g)), d = length(f);\n        float led = 1.0 - smoothstep(0.34 - px, 0.34 + px, d);\n        float lit = mix(led, 0.4, clamp((px - 0.3) / 0.5, 0.0, 1.0));          // smaller than a screen pixel: average, no moire\n        vec2 cb = floor(cell / uCab), fc = fract(cell / uCab);\n        float cabv = 0.9 + 0.14 * hh(cb), seam = 1.0 - 0.6 * step(fc.x, 0.5 / uCab) * (1.0 - clamp((px - 0.4) / 0.4, 0.0, 1.0));\n        float view = mix(0.45, 1.0, clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0));   // dimmer seen from the side\n        gl_FragColor = vec4(c * uGain * 2.5 * lit * cabv * seam * view + vec3(0.006, 0.007, 0.01) * (1.0 - lit), 1.0);\n      }"
    });
  }
  const standM = new MeshStandardMaterial({ color: 855572, roughness: 0.95 });
  const ROWS = 6, ROW_D = 0.85, ROW_H = 0.45, STAND_X = 8.3, STAND_Z0 = -2.5, STAND_Z1 = -28, STAND_L = STAND_Z0 - STAND_Z1, STAND_ZC = (STAND_Z0 + STAND_Z1) / 2;
  const ribbonTex = canvasTex(512, 8, (g, w, h) => {
    for (let x = 0; x < w; x++) {
      const u = x / w;
      g.fillStyle = "hsl(".concat(u * 720 % 360, ",90%,").concat(48 + 14 * Math.sin(u * 50), "%)");
      g.fillRect(x, 0, 1, h);
    }
    g.fillStyle = "rgba(255,255,255,0.85)";
    for (let x = 0; x < w; x += 32) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x + 6, h / 2);
      g.lineTo(x, h);
      g.lineTo(x + 4, h);
      g.lineTo(x + 10, h / 2);
      g.lineTo(x + 4, 0);
      g.fill();
    }
  });
  const ribbons = [];
  const stepM = new MeshBasicMaterial({ color: new Color(16767392).multiplyScalar(0.9) });
  for (const s of [-1, 1]) {
    put(new RoundedBoxGeometry(0.3, 1, STAND_L, 2, 0.05), new MeshPhysicalMaterial({ color: 790300, roughness: 0.35, clearcoat: 0.6 }), s * (STAND_X - 0.2), 0.48, STAND_ZC);
    const rail = put(new CylinderGeometry(0.035, 0.035, STAND_L, 12), chromeM, s * (STAND_X - 0.2), 1.04, STAND_ZC);
    rail.rotation.x = Math.PI / 2;
    const rb = TVM && ribbons[0] || ledMat(ribbonTex, 510, 10, { cab: 20, gain: 0.9 });
    if (!ribbons.includes(rb)) ribbons.push(rb);
    const rp = put(new PlaneGeometry(STAND_L, 0.5), rb, s * (STAND_X - 0.2) - s * 0.152, 0.58, STAND_ZC);
    rp.rotation.y = -s * Math.PI / 2;
    rp.receiveShadow = false;
    for (let r = 0; r < ROWS; r++) {
      const top = 0.35 + r * ROW_H, x = s * (STAND_X + r * ROW_D + ROW_D / 2);
      put(new BoxGeometry(ROW_D, top, STAND_L), standM, x, top / 2, STAND_ZC);
      put(new BoxGeometry(0.02, 0.02, STAND_L), stepM, x - s * (ROW_D / 2 + 0.01), top - 0.03, STAND_ZC);
    }
    put(new BoxGeometry(1, 9, 70), standM, s * 15.5, 4, -20);
  }
  put(new BoxGeometry(40, 14, 1), new MeshStandardMaterial({ color: 460815, roughness: 0.9 }), 0, 6, -34);
  const PEOPLE = [], SEATS = [];
  for (const s of [-1, 1]) for (let r = 0; r < ROWS; r++) for (let z = STAND_Z0 - 0.4; z > STAND_Z1 + 0.3; z -= 0.62) {
    const seat = { s, x: s * (STAND_X + r * ROW_D + ROW_D * 0.6), y: 0.35 + r * ROW_H + 0.42, z, r };
    SEATS.push(seat);
    if (Math.random() < 0.06) continue;
    PEOPLE.push({
      ...seat,
      x: seat.x + (Math.random() - 0.5) * 0.06,
      z: z + (Math.random() - 0.5) * 0.12,
      e: 0.45 + Math.random() * 0.55,
      ph: Math.random() * 6.283,
      d: Math.random() * 0.35,
      h: 0.9 + Math.random() * 0.17,
      wide: 0.88 + Math.random() * 0.28,
      lean: (Math.random() - 0.5) * 0.12,
      bald: Math.random() < 0.1,
      long: Math.random() < 0.3,
      sleeve: Math.random() < 0.45
    });
  }
  const NP = PEOPLE.length;
  const jerseyN = new TextureLoader().load("assets/textures/cotton_jersey/cotton_jersey_nor_gl_" + (window.BP_TV ? "512" : "2k") + ".jpg");
  jerseyN.wrapS = jerseyN.wrapT = RepeatWrapping;
  jerseyN.repeat.set(3, 3);
  const clothM = new MeshStandardMaterial({ roughness: 0.92, normalMap: jerseyN, normalScale: new Vector2(0.8, 0.8), envMapIntensity: 0.5 });
  const skinCM = new MeshPhysicalMaterial({ roughness: 0.55, sheen: 0.3, sheenColor: new Color(16763056), envMapIntensity: 0.5 }), hairCM = new MeshStandardMaterial({ roughness: 0.65, envMapIntensity: 0.5 });
  const torsoG = new LatheGeometry([[1e-3, 0], [0.15, 0.01], [0.16, 0.12], [0.155, 0.25], [0.18, 0.39], [0.19, 0.46], [0.15, 0.54], [0.06, 0.58], [1e-3, 0.59]].map(([x, y]) => new Vector2(x, y)), 14);
  torsoG.scale(0.62, 1, 1);
  const limbG = (r, L) => {
    const g = new CapsuleGeometry(r, L, 3, 8);
    g.userData.len = L + 2 * r;
    return g;
  };
  const headG = new SphereGeometry(0.1, 14, 10);
  headG.scale(0.9, 1.08, 0.86);
  const hairG = new SphereGeometry(0.106, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.56);
  hairG.scale(0.92, 1.1, 0.9);
  const inst = (g, m, n) => {
    const o = new InstancedMesh(g, m, n);
    o.castShadow = false;
    o.receiveShadow = true;
    o.frustumCulled = false;
    scene.add(o);
    return o;
  };
  const torsoI = inst(torsoG, clothM, NP), headI = inst(headG, skinCM, NP), hairI = inst(hairG, hairCM, NP);
  const thighI = inst(limbG(0.075, 0.3), clothM, NP * 2), shinI = inst(limbG(0.055, 0.32), clothM, NP * 2), uarmI = inst(limbG(0.05, 0.2), clothM, NP * 2), farmI = inst(limbG(0.042, 0.18), skinCM, NP * 2);
  const seatI = inst(new RoundedBoxGeometry(0.08, 0.5, 0.5, 2, 0.03), new MeshPhysicalMaterial({ color: 3804178, roughness: 0.7, sheen: 0.5, sheenColor: new Color(8405072) }), SEATS.length);
  SEATS.forEach((p, i) => {
    _m0.makeTranslation(p.x + p.s * 0.2, p.y + 0.2, p.z);
    seatI.setMatrixAt(i, _m0);
  });
  {
    const shirts = [2830138, 2042436, 7041664, 15131871, 8003371, 3104080, 13150571, 4026293, 12073530, 1184274, 9203102, 14268490, 5210015, 14121610, 15658734, 3049182, 15766315], pants = [2766160, 1776930, 4149099, 9075292, 4868682, 2899558, 1118481], skins = [15845030, 14262396, 12156250, 9263675, 6175270, 15250575], hairs = [1708556, 3875860, 7029795, 12159562, 2236962, 9079434, 5913120];
    const pick = (a) => a[Math.random() * a.length | 0], dim = (c, k) => _c0.set(c).multiplyScalar(k);
    PEOPLE.forEach((p, i) => {
      const k = 1 - 0.09 * p.r, sk = pick(skins), sh = pick(shirts), pa = pick(pants);
      torsoI.setColorAt(i, dim(sh, k));
      headI.setColorAt(i, dim(sk, k));
      hairI.setColorAt(i, dim(pick(hairs), k));
      for (let a = 0; a < 2; a++) {
        thighI.setColorAt(i * 2 + a, dim(pa, k));
        shinI.setColorAt(i * 2 + a, dim(pa, k));
        uarmI.setColorAt(i * 2 + a, dim(sh, k));
        farmI.setColorAt(i * 2 + a, dim(p.sleeve ? sh : sk, k));
      }
    });
  }
  const crowd = { t0: -1e9, amp: 0, hot: false };
  function cheerCrowd(amp) {
    crowd.t0 = performance.now();
    crowd.amp = amp;
  }
  const _cm = new Matrix4(), _cq = new Quaternion(), _cs = new Vector3(1, 1, 1), _cp = new Vector3(), _cd = new Vector3(), _cUP = new Vector3(0, 1, 0);
  const _ca = new Vector3(), _cb = new Vector3(), _ch = new Vector3(), _ce = new Vector3(), _cf = new Vector3(), _cl = new Vector3(), _cu = new Vector3();
  function seg(mesh, i, a, b) {
    _cd.subVectors(b, a);
    const len = _cd.length() || 1e-4;
    _cm.compose(_cp.addVectors(a, b).multiplyScalar(0.5), _cq.setFromUnitVectors(_cUP, _cd.multiplyScalar(1 / len)), _cs.set(1, len / mesh.geometry.userData.len, 1));
    mesh.setMatrixAt(i, _cm);
  }
  function updateCrowd(now) {
    const T = now / 1e3, since = (now - crowd.t0) / 1e3, hot = since < 2.8;
    if (!hot && !crowd.hot && frameNo % (TVM ? 12 : 3)) return;
    if (TVM && hot && frameNo % 2) return;
    crowd.hot = hot;
    for (let i = 0; i < NP; i++) {
      const p = PEOPLE[i], u = since - p.d;
      const a = u > 0 ? clamp(crowd.amp * p.e * Math.min(1, u * 6) * Math.max(0, 1 - u / 2.2), 0, 1.3) : 0;
      const lift = a * 0.28 + a * 0.06 * Math.abs(Math.sin(T * 11 + p.ph)), sway = 0.025 * Math.sin(T * 1.3 + p.ph);
      _cf.set(-p.s, 0, 0);
      _cl.set(0, 0, 1);
      _cu.set(p.s * (0.06 - 0.12 * Math.min(1, a)) + p.lean * 0.3, 1, sway).normalize();
      _ch.set(p.x, p.y + lift * 0.9, p.z);
      _cm.compose(_ch, _cq.setFromUnitVectors(_cUP, _cu), _cs.set(1, p.h, p.wide));
      torsoI.setMatrixAt(i, _cm);
      _cp.copy(_ch).addScaledVector(_cu, 0.69 * p.h);
      _cm.compose(_cp, _cq.setFromUnitVectors(_cUP, _cu), _cs.set(1, 1, 1));
      headI.setMatrixAt(i, _cm);
      _cp.addScaledVector(_cu, 0.012).addScaledVector(_cf, -8e-3);
      _cm.compose(_cp, _cq, p.bald ? _cs.set(1e-3, 1e-3, 1e-3) : _cs.set(1, p.long ? 1.25 : 1, 1));
      hairI.setMatrixAt(i, _cm);
      const up = clamp(a * 1.2 + (Math.max(0, Math.sin(T * 2 + p.ph * 3)) > 0.97 ? 0.35 : 0), 0, 1), stand = Math.min(1, a * 1.4);
      for (let k = 0; k < 2; k++) {
        const sd = k ? 1 : -1, j = i * 2 + k;
        _ca.copy(_ch).addScaledVector(_cl, sd * 0.1 * p.wide);
        _cb.copy(_ca).addScaledVector(_cf, 0.42 * (1 - 0.5 * stand)).addScaledVector(_cUP, -0.03 - 0.3 * stand);
        seg(thighI, j, _ca, _cb);
        _ca.copy(_cb).addScaledVector(_cUP, -0.42 + 0.05 * stand).addScaledVector(_cf, 0.04);
        seg(shinI, j, _cb, _ca);
        const S = _ce.copy(_ch).addScaledVector(_cu, 0.49 * p.h).addScaledVector(_cl, sd * 0.19 * p.wide);
        _ca.copy(_ch).addScaledVector(_cf, 0.3).addScaledVector(_cUP, 0.12).addScaledVector(_cl, sd * 0.13);
        _cb.copy(S).addScaledVector(_cUP, 0.52).addScaledVector(_cf, 0.12).addScaledVector(_cl, sd * (0.12 + 0.06 * Math.sin(T * 9 + p.ph)));
        _ca.lerp(_cb, up);
        _cb.copy(S).lerp(_ca, 0.5).addScaledVector(_cl, sd * 0.09).addScaledVector(_cUP, -0.08 * (1 - up)).addScaledVector(_cf, -0.04);
        seg(uarmI, j, S, _cb);
        seg(farmI, j, _cb, _ca);
      }
    }
    for (const m of [torsoI, headI, hairI, thighI, shinI, uarmI, farmI]) m.instanceMatrix.needsUpdate = true;
  }
  const trussTex = canvasTex(128, 64, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.strokeStyle = "#fff";
    g.lineWidth = 6;
    g.beginPath();
    g.moveTo(0, 3);
    g.lineTo(w, 3);
    g.moveTo(0, h - 3);
    g.lineTo(w, h - 3);
    g.stroke();
    g.lineWidth = 3.5;
    g.beginPath();
    g.moveTo(2, h - 3);
    g.lineTo(w / 2, 3);
    g.lineTo(w - 2, h - 3);
    g.moveTo(w / 2, 3);
    g.lineTo(w / 2, h - 3);
    g.stroke();
  }, false);
  let trussTV = null;
  const trussM = (len) => {
    if (TVM) return trussTV || (trussTV = trussM0(0.9));
    return trussM0(len);
  };
  const trussM0 = (len) => {
    const t = trussTex.clone();
    t.needsUpdate = true;
    t.repeat.set(len / 0.9, 1);
    return new MeshStandardMaterial({ color: 12896721, metalness: 1, roughness: 0.32, alphaMap: t, alphaTest: 0.5, side: DoubleSide, envMapIntensity: 1.1 });
  };
  const trussG = (g, len) => {
    if (TVM) {
      const uv = g.attributes.uv;
      for (let i = 0; i < uv.count; i++) uv.setX(i, uv.getX(i) * len / 0.9);
    }
    return g;
  };
  for (const s of [-1, 1]) {
    const b = put(trussG(new BoxGeometry(0.45, 0.45, 36), 36), trussM(36), s * 3.8, 6.8, -14);
    b.receiveShadow = false;
  }
  const RIG_Z = [-2, -9, -16, -23];
  for (const z of RIG_Z) {
    const b = put(trussG(new BoxGeometry(20, 0.45, 0.45), 20), trussM(20), 0, 6.8, z);
    b.receiveShadow = false;
  }
  const BEAM_COLS = [16726696, 3397375, 16757568, 9067775, 6160282, 16734778];
  const beamMat = (col) => new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
    fog: false,
    uniforms: { uCol: { value: col.clone() }, uI: { value: 0.1 }, uT: SHOW_T },
    vertexShader: "varying float vA; varying vec3 vN, vV, vW; void main() { vA = -position.y / 8.0; vec4 mv = modelViewMatrix * vec4(position, 1.0); vV = -mv.xyz; vN = normalMatrix * normal; vW = (modelMatrix * vec4(position, 1.0)).xyz; gl_Position = projectionMatrix * mv; }",
    fragmentShader: "uniform vec3 uCol; uniform float uI, uT; varying float vA; varying vec3 vN, vV, vW;\n    float h3(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }\n    float n3(vec3 p) { vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);\n      return mix(mix(mix(h3(i), h3(i + vec3(1, 0, 0)), f.x), mix(h3(i + vec3(0, 1, 0)), h3(i + vec3(1, 1, 0)), f.x), f.y), mix(mix(h3(i + vec3(0, 0, 1)), h3(i + vec3(1, 0, 1)), f.x), mix(h3(i + vec3(0, 1, 1)), h3(i + vec3(1, 1, 1)), f.x), f.y), f.z); }\n    void main() {\n      float e = pow(abs(dot(normalize(vN), normalize(vV))), 2.2);                         // soft edges: the beam is a glowing volume, not a cone\n      float a = clamp(vA, 0.0, 1.0), along = smoothstep(0.0, 0.05, a) * pow(1.0 - a, 1.4) * (1.0 + 3.0 * exp(-a * 12.0));   // hot at the lens, fading into haze\n      float haze = 0.45 + 0.55 * n3(vW * 0.8 + vec3(0.0, uT * 0.12, uT * 0.05)) * n3(vW * 2.1 - vec3(uT * 0.1, 0.0, 0.0)) * 1.6;\n      gl_FragColor = vec4(uCol * uI * e * along * haze, 1.0); }"
  });
  const beams = [], beamTV = {}, _bm = new Matrix4();
  {
    const headG2 = new CylinderGeometry(0.15, 0.19, 0.34, 18), baseG = new RoundedBoxGeometry(0.42, 0.12, 0.32, 2, 0.03), armG = new BoxGeometry(0.04, 0.3, 0.12);
    const yokeM = new MeshStandardMaterial({ color: 1382173, metalness: 0.6, roughness: 0.38 });
    const coneG = new ConeGeometry(1.25, 8, 32, 1, true);
    coneG.translate(0, -4, 0);
    let lit = 0;
    const lensG = TVM && new CircleGeometry(0.13, 24), lensTVM = TVM && new MeshBasicMaterial({ fog: false });
    if (TVM) {
      beamTV.head = new InstancedMesh(headG2, yokeM, RIG_Z.length * 6);
      beamTV.lens = new InstancedMesh(lensG, lensTVM, RIG_Z.length * 6);
      const bm = beamMat(new Color());
      bm.vertexShader = "varying float vA; varying vec3 vN, vV, vW, vC; void main() { vA = -position.y / 8.0; mat4 m = modelMatrix * instanceMatrix; vec4 w = m * vec4(position, 1.0); vec4 mv = viewMatrix * w; vV = -mv.xyz; vN = mat3(viewMatrix) * mat3(m) * normal; vW = w.xyz; vC = instanceColor; gl_Position = projectionMatrix * mv; }";
      bm.fragmentShader = bm.fragmentShader.replace("uniform vec3 uCol; uniform float uI, uT;", "uniform float uT; varying vec3 vC;").replace("uCol * uI", "vC");
      beamTV.cone = new InstancedMesh(coneG, bm, RIG_Z.length * 3);
      beamTV.nCone = 0;
      beamTV.cone.frustumCulled = false;
      scene.add(beamTV.cone);
      for (const m of [beamTV.head, beamTV.lens]) {
        m.frustumCulled = false;
        m.receiveShadow = true;
        scene.add(m);
      }
    }
    RIG_Z.forEach((z, zi) => [-6.5, -3.8, -1.3, 1.3, 3.8, 6.5].forEach((x, xi) => {
      const mount = new Group();
      mount.position.set(x, 6.58, z);
      scene.add(mount);
      mount.add(new Mesh(baseG, yokeM));
      for (const s of [-1, 1]) {
        const a = new Mesh(armG, yokeM);
        a.position.set(s * 0.2, -0.18, 0);
        mount.add(a);
      }
      if (TVM) STATIC.push(...mount.children);
      const grp = new Group();
      grp.position.set(x, 6.4, z);
      scene.add(grp);
      const head = TVM ? null : new Mesh(headG2, yokeM);
      if (head) grp.add(head);
      const col = new Color(BEAM_COLS[(zi * 2 + xi) % BEAM_COLS.length]);
      const lens = new Mesh(TVM ? lensG : new CircleGeometry(0.13, 24), TVM ? lensTVM : new MeshBasicMaterial({ color: col.clone().multiplyScalar(4), fog: false }));
      lens.rotation.x = Math.PI / 2;
      lens.position.y = -0.175;
      if (!TVM) grp.add(lens);
      else lens.updateMatrix();
      let cone = null, spot = null;
      if (zi > 0 && (xi + zi) % 2 === 0) {
        if (TVM) cone = { tv: beamTV.nCone++ };
        else {
          cone = new Mesh(coneG, beamMat(col));
          grp.add(cone);
        }
        if (lit < 4 && (xi === 1 || xi === 4)) {
          lit++;
          spot = new SpotLight(col, 170, 16, 0.17, 0.55, 2);
          spot.target.position.set(0, -8, 0);
          grp.add(spot, spot.target);
        }
      }
      beams.push({ grp, lens, cone, spot, col, base: col.clone(), ph: Math.random() * 6.283, sp: 0.35 + Math.random() * 0.35, x });
      if (TVM) beamTVSet(beams[beams.length - 1], beams.length - 1, 0);
    }));
    if (TVM) beamTV.cone.count = beamTV.nCone;
  }
  const ARCH_Z = -27.6;
  const archCurve = new CatmullRomCurve3([[-3.7, 0], [-3.7, 3.6], [-3.3, 4.7], [-1.8, 5.35], [0, 5.5], [1.8, 5.35], [3.3, 4.7], [3.7, 3.6], [3.7, 0]].map(([x, y]) => new Vector3(x, y, ARCH_Z)));
  put(new TubeGeometry(archCurve, 140, 0.32, 20, false), new MeshPhysicalMaterial({ color: 11542560, metalness: 0, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.05 }), 0, 0, 0, true);
  for (const s of [-1, 1]) put(new CylinderGeometry(0.42, 0.46, 0.3, 24), brushedM, s * 3.7, 0.15, ARCH_Z, true);
  const BULBS = 64, bulbI = new InstancedMesh(new SphereGeometry(0.075, 12, 8), new MeshBasicMaterial({ fog: false }), BULBS);
  for (let i = 0; i < BULBS; i++) {
    const p = archCurve.getPointAt((i + 0.5) / BULBS);
    _m0.makeTranslation(p.x * 0.985, p.y * 0.985 + 0.02, ARCH_Z + 0.33);
    bulbI.setMatrixAt(i, _m0);
    bulbI.setColorAt(i, _c0.set(16777215));
  }
  scene.add(bulbI);
  const scr = document.createElement("canvas");
  scr.width = 192;
  scr.height = 84;
  const sg = scr.getContext("2d"), scrTex = new CanvasTexture(scr);
  scrTex.colorSpace = SRGBColorSpace;
  put(new PlaneGeometry(16, 7), ledMat(scrTex, 192, 84, { cab: 12, gain: 1.1 }), 0, 4.1, -31.5);
  let scrSideM = null, scrFrameM = null;
  for (const s of [-1, 1]) {
    const sc = put(new PlaneGeometry(6.4, 2.8), TVM && scrSideM || (scrSideM = ledMat(scrTex, 192, 84, { cab: 12, gain: 0.95 })), s * 11.5, 5.2, -24);
    sc.rotation.y = -s * 0.75;
    const fr = put(new BoxGeometry(6.6, 3, 0.2), TVM && scrFrameM || (scrFrameM = new MeshStandardMaterial({ color: 723986, metalness: 0.5, roughness: 0.4 })), s * 11.5 + s * 0.08, 5.2, -24 - 0.1);
    fr.rotation.y = -s * 0.75;
  }
  put(new BoxGeometry(16.6, 7.6, 0.3), new MeshStandardMaterial({ color: 790040, metalness: 0.5, roughness: 0.4 }), 0, 4.1, -31.75);
  let scrTW = null;
  const show = { mood: "idle", t: -1e9 };
  function drawScreen(now) {
    const T = now / 1e3, k = clamp(1 - (now - show.t) / 1400, 0, 1), w = scr.width, h = scr.height, mood = k > 0 ? show.mood : "idle";
    const hue = mood === "miss" ? 205 : mood !== "idle" ? 42 : 255 + 25 * Math.sin(T * 0.15);
    const gr = sg.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, "hsl(".concat(hue, ",85%,").concat(7 + 30 * k, "%)"));
    gr.addColorStop(1, "hsl(".concat(hue + 45, ",80%,").concat(16 + 30 * k, "%)"));
    sg.globalCompositeOperation = "source-over";
    sg.fillStyle = gr;
    sg.fillRect(0, 0, w, h);
    sg.globalCompositeOperation = "lighter";
    for (let i = 0; i < 4; i++) {
      const x = (T * 34 + i * 61) % (w + 90) - 45, g2 = sg.createLinearGradient(x - 16, 0, x + 16, 0);
      g2.addColorStop(0, "rgba(0,0,0,0)");
      g2.addColorStop(0.5, "hsla(".concat(hue + 25, ",100%,62%,").concat(0.3 + 0.3 * k, ")"));
      g2.addColorStop(1, "rgba(0,0,0,0)");
      sg.fillStyle = g2;
      sg.setTransform(1, 0, -0.45, 1, h * 0.45, 0);
      sg.fillRect(x - 16, 0, 32, h);
      sg.setTransform(1, 0, 0, 1, 0, 0);
    }
    if (mood === "miss") {
      sg.fillStyle = "rgba(200,240,255,".concat(0.55 * k, ")");
      for (let i = 0; i < 40; i++) {
        const a = i * 2.4, rr = (1 - k) * w * 0.5 * (0.5 + i % 5 / 5);
        sg.beginPath();
        sg.arc(w / 2 + Math.cos(a) * rr, h / 2 + Math.sin(a) * rr * 0.6, 2 + i % 4, 0, 6.283);
        sg.fill();
      }
    }
    sg.globalCompositeOperation = "source-over";
    let fs = h * 0.34;
    sg.font = "900 ".concat(fs, "px ").concat(FONT);
    const tw = scrTW != null ? scrTW : scrTW = sg.measureText("WALL DODGE").width;
    if (tw > w * 0.84) {
      fs *= w * 0.84 / tw;
      sg.font = "900 ".concat(fs, "px ").concat(FONT);
    }
    sg.textAlign = "center";
    sg.textBaseline = "middle";
    sg.lineJoin = "round";
    sg.lineWidth = 4;
    sg.strokeStyle = mood === "miss" ? "#3ab8ff" : "#ffc21f";
    sg.strokeText("WALL DODGE", w / 2, h * 0.52);
    sg.fillStyle = "#fff";
    sg.fillText("WALL DODGE", w / 2, h * 0.52);
    scrTex.needsUpdate = true;
  }
  function beamTVSet(b, i, k) {
    b.grp.updateMatrix();
    beamTV.head.setMatrixAt(i, b.grp.matrix);
    beamTV.lens.setMatrixAt(i, _bm.multiplyMatrices(b.grp.matrix, b.lens.matrix));
    beamTV.lens.setColorAt(i, _c0.copy(b.col).multiplyScalar(4 + 3 * k));
    if (b.cone) {
      beamTV.cone.setMatrixAt(b.cone.tv, b.grp.matrix);
      beamTV.cone.setColorAt(b.cone.tv, _c0.copy(b.col).multiplyScalar(0.1 + 0.08 * k));
    }
  }
  function updateShow(now, dt) {
    const T = now / 1e3, k = clamp(1 - (now - show.t) / 1400, 0, 1), mood = k > 0 ? show.mood : "idle";
    SHOW_T.value = T % 1e3;
    for (const b of beams) {
      b.grp.rotation.z = Math.sin(T * b.sp + b.ph) * 0.42 + (b.x < 0 ? 0.12 : -0.12);
      b.grp.rotation.x = 0.35 + Math.sin(T * b.sp * 0.7 + b.ph * 2) * 0.3;
      const c = mood === "miss" ? _c0.set(3848447) : mood !== "idle" ? _c0.set(16769162) : b.base;
      b.col.lerp(c, Math.min(1, dt * 8));
      if (TVM) beamTVSet(b, beams.indexOf(b), k);
      else b.lens.material.color.copy(b.col).multiplyScalar(4 + 3 * k);
      if (b.cone && !TVM) {
        b.cone.material.uniforms.uCol.value.copy(b.col);
        b.cone.material.uniforms.uI.value = 0.1 + 0.08 * k;
      }
      if (b.spot) {
        b.spot.color.copy(b.col);
        b.spot.intensity = 170 + 120 * k;
      }
    }
    if (TVM) for (const m of [beamTV.head, beamTV.lens, beamTV.cone]) {
      m.instanceMatrix.needsUpdate = true;
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
    }
    follow.target.position.x += (athlete.root.position.x * 0.8 - follow.target.position.x) * Math.min(1, dt * 4);
    const chase = T * (mood === "idle" ? 9 : 26);
    const bk = (mood === "miss" ? 16 : mood !== "idle" ? 8 : 0) + (k > 0.5 ? 4 : 0) + Math.floor(chase) % 4;
    if (bk !== bulbKey) {
      bulbKey = bk;
      for (let i = 0; i < BULBS; i++) {
        const on = (i + Math.floor(chase)) % 4 < 2 || k > 0.5;
        bulbI.setColorAt(i, _c0.set(mood === "miss" ? 9428223 : mood !== "idle" ? 16765786 : i % 8 < 4 ? 16773576 : 16754912).multiplyScalar(on ? 3.2 : 0.3));
      }
      bulbI.instanceColor.needsUpdate = true;
    }
    stripM.color.setHSL(mood === "miss" ? 0.55 : mood !== "idle" ? 0.13 : T * 0.05 % 1, 1, 0.55).multiplyScalar(2.2);
    for (const rb of ribbons) {
      rb.uniforms.uOff.value.x = T * 0.02 % 1;
      rb.uniforms.uTint.value.set(mood === "miss" ? 8376575 : mood !== "idle" ? 16769162 : 16777215).multiplyScalar(1 + k);
    }
    if (frameNo % (TVM ? 4 : 2) === 0) drawScreen(now);
    wN1.offset.set(T * 0.012, T * 0.02);
    wN2.offset.set(-T * 0.016, T * 0.011);
    waterAgit = Math.max(0, waterAgit - dt * 0.6);
    WU.uAgit.value = waterAgit;
    WU.uSplash.value.z = Math.min(99, WU.uSplash.value.z + dt);
    waterM.normalScale.setScalar(0.3 + 1.1 * waterAgit);
    waterM.clearcoatNormalScale.setScalar(0.45 + 1.2 * waterAgit);
  }
  let waterAgit = 0, bulbKey = -1;
  function makePerson(scene2, look = {}) {
    var _a2, _b2, _c2, _d2, _e3;
    const cloth = (color, sheen = 0.5, rough = 0.85) => new MeshPhysicalMaterial({ color, roughness: rough, sheen, sheenRoughness: 0.6, sheenColor: new Color(color).lerp(new Color(1, 1, 1), 0.4) });
    const skinM = new MeshPhysicalMaterial({ color: (_a2 = look.skin) != null ? _a2 : 12157030, roughness: 0.55, sheen: 0.35, sheenRoughness: 0.4, sheenColor: new Color(16763056) });
    const shirtM = cloth((_b2 = look.shirt) != null ? _b2 : 3108789, 0.6), legM = cloth((_c2 = look.legs) != null ? _c2 : 1908518, 0.4, 0.7), hairM = cloth((_d2 = look.hair) != null ? _d2 : 2759186, 0.9, 0.55);
    const shoeM = new MeshPhysicalMaterial({ color: 15921904, roughness: 0.5, clearcoat: 0.3 }), soleM = new MeshPhysicalMaterial({ color: (_e3 = look.sole) != null ? _e3 : 16734762, roughness: 0.6 });
    const root = new Group(), body = new Group();
    root.add(body);
    scene2.add(root);
    const mk = (geo, mat, parent = body) => {
      const m = new Mesh(geo, mat);
      m.castShadow = true;
      m.receiveShadow = true;
      parent.add(m);
      return m;
    };
    const limb = (r0, r1, mat) => mk(new CylinderGeometry(r1, r0, 1, 16, 1), mat);
    const ball = (r, mat) => mk(new SphereGeometry(r, 16, 12), mat);
    const P2 = {
      pelvis: ball(0.15, legM),
      torso: mk(new CapsuleGeometry(0.16, 0.3, 8, 20), shirtM),
      neck: limb(0.05, 0.048, skinM),
      thighL: limb(0.085, 0.07, legM),
      thighR: limb(0.085, 0.07, legM),
      shinL: limb(0.066, 0.05, legM),
      shinR: limb(0.066, 0.05, legM),
      kneeL: ball(0.07, legM),
      kneeR: ball(0.07, legM),
      shL: ball(0.075, shirtM),
      shR: ball(0.075, shirtM),
      uarmL: limb(0.078, 0.064, shirtM),
      uarmR: limb(0.078, 0.064, shirtM),
      farmL: limb(0.058, 0.044, skinM),
      farmR: limb(0.058, 0.044, skinM),
      elbL: ball(0.058, skinM),
      elbR: ball(0.058, skinM),
      handL: ball(0.055, skinM),
      handR: ball(0.055, skinM)
    };
    P2.torso.geometry.scale(1.08, 1, 0.68);
    const shoe = () => {
      const g = new Group();
      body.add(g);
      const up = mk(new RoundedBoxGeometry(0.11, 0.08, 0.27, 3, 0.035), shoeM, g);
      up.position.set(0, 0.055, -0.03);
      const so = mk(new RoundedBoxGeometry(0.115, 0.03, 0.285, 2, 0.012), soleM, g);
      so.position.set(0, 0.015, -0.03);
      return g;
    };
    const shoeL = shoe(), shoeR = shoe();
    const head = new Group();
    body.add(head);
    mk(new SphereGeometry(0.105, 24, 18), skinM, head).scale.set(0.92, 1.1, 1);
    const hair = mk(new SphereGeometry(0.112, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.62), hairM, head);
    hair.scale.set(0.95, 1.1, 1.04);
    hair.rotation.x = 0.35;
    hair.position.set(0, 0.012, 6e-3);
    const tail = mk(new CapsuleGeometry(0.035, 0.12, 6, 10), hairM, head);
    tail.position.set(0, -0.02, 0.12);
    tail.rotation.x = -0.5;
    for (const s of [-1, 1]) {
      const ear = mk(new SphereGeometry(0.022, 10, 8), skinM, head);
      ear.position.set(s * 0.097, 0, 0);
      ear.scale.set(0.5, 1, 0.8);
    }
    const V = () => new Vector3(), T = { a: V(), b: V(), pel: V(), chest: V(), up: V(), hip: [V(), V()], foot: [V(), V()], knee: [V(), V()], sh: [V(), V()], elb: [V(), V()], hand: [V(), V()], pole: V() };
    const UP = new Vector3(0, 1, 0), M4 = new Matrix4();
    function bone(m, a, b) {
      T.a.subVectors(b, a);
      const len = T.a.length() || 1e-4;
      m.position.addVectors(a, b).multiplyScalar(0.5);
      m.quaternion.setFromUnitVectors(UP, T.a.multiplyScalar(1 / len));
      m.scale.set(1, len, 1);
    }
    function ik(rootP, target, l1, l2, pole, mid, end) {
      T.a.subVectors(target, rootP);
      let d = T.a.length();
      const dir = T.a.normalize();
      d = clamp(d, 0.05, l1 + l2 - 2e-3);
      const x = (l1 * l1 - l2 * l2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, l1 * l1 - x * x));
      T.b.copy(pole).addScaledVector(dir, -pole.dot(dir)).normalize();
      mid.copy(rootP).addScaledVector(dir, x).addScaledVector(T.b, h);
      end.copy(rootP).addScaledVector(dir, d);
    }
    function pose2(o) {
      const c = clamp(o.crouch || 0, 0, 1), lean = clamp(o.lean || 0, -1, 1), tuck = o.tuck || 0, ra = o.runAmt || 0, ph = o.run || 0;
      const bob = ra * 0.04 * Math.abs(Math.sin(ph));
      T.pel.set(lean * 0.05, 0.94 - 0.36 * c - 0.05 * tuck + bob, 0.1 * c);
      for (let i = 0; i < 2; i++) {
        const s = i ? 1 : -1, p = ph + (i ? Math.PI : 0);
        T.hip[i].set(T.pel.x + s * 0.095, T.pel.y - 0.03, T.pel.z);
        const fz = -Math.sin(p) * 0.3 * ra, fy = 0.07 + Math.max(0, -Math.cos(p)) * 0.22 * ra;
        T.foot[i].set(s * (0.12 + 0.06 * c), fy + tuck * 0.32, fz + tuck * 0.22 - 0.02 * c);
        ik(T.hip[i], T.foot[i], 0.45, 0.45, T.pole.set(s * 0.15, 0, -1), T.knee[i], T.foot[i]);
        bone(i ? P2.thighR : P2.thighL, T.hip[i], T.knee[i]);
        bone(i ? P2.shinR : P2.shinL, T.knee[i], T.foot[i]);
        (i ? P2.kneeR : P2.kneeL).position.copy(T.knee[i]);
        const sh = i ? shoeR : shoeL;
        sh.position.set(T.foot[i].x, T.foot[i].y - 0.07, T.foot[i].z);
        sh.rotation.set(-tuck * 0.6 + (ra ? Math.cos(p) * 0.3 * ra : 0), 0, 0);
      }
      P2.pelvis.position.copy(T.pel);
      P2.pelvis.scale.set(1.15, 0.8, 0.85);
      T.up.set(lean * 0.35, 1, -(0.55 * c + 0.18 * ra)).normalize();
      T.chest.copy(T.pel).addScaledVector(T.up, 0.48);
      P2.torso.position.copy(T.pel).addScaledVector(T.up, 0.27);
      P2.torso.quaternion.setFromUnitVectors(UP, T.up);
      T.a.copy(T.chest).addScaledVector(T.up, 0.1);
      P2.neck.position.copy(T.a);
      P2.neck.quaternion.copy(P2.torso.quaternion);
      P2.neck.scale.set(1, 0.12, 1);
      head.position.copy(T.chest).addScaledVector(T.up, 0.23);
      head.rotation.set(-0.3 * c - 0.1 * ra, 0, -lean * 0.2);
      tail.rotation.x = -0.5 - 0.3 * Math.sin(ph * 2) * ra;
      for (let i = 0; i < 2; i++) {
        const s = i ? 1 : -1, p = ph + (i ? 0 : Math.PI);
        T.sh[i].copy(T.chest).add(T.a.set(s * 0.2, -0.03, 0));
        (i ? P2.shR : P2.shL).position.copy(T.sh[i]);
        const tgt = T.hand[i], given = o.hands && o.hands[i];
        if (given) tgt.copy(given);
        else if (o.wing) tgt.copy(T.sh[i]).add(T.a.set(s * 0.6, 0.05 + 0.25 * (o.wing - 0.5), 0.05));
        else if (o.armsUp) tgt.copy(T.sh[i]).add(T.a.set(s * 0.14, 0.58, -0.02));
        else if (ra > 0.05) tgt.copy(T.sh[i]).add(T.a.set(s * 0.1, -0.4 + 0.12 * Math.max(0, Math.sin(p)), Math.sin(p) * 0.28 * ra - 0.05));
        else if (c > 0.4) tgt.copy(T.sh[i]).add(T.a.set(s * 0.08, -0.25, -0.35));
        else tgt.copy(T.sh[i]).add(T.a.set(s * 0.1, -0.55, -0.02));
        ik(T.sh[i], tgt, 0.3, 0.28, T.pole.set(s * 0.4, -0.3, 0.8), T.elb[i], tgt);
        bone(i ? P2.uarmR : P2.uarmL, T.sh[i], T.elb[i]);
        bone(i ? P2.farmR : P2.farmL, T.elb[i], tgt);
        (i ? P2.elbR : P2.elbL).position.copy(T.elb[i]);
        (i ? P2.handR : P2.handL).position.copy(tgt);
      }
    }
    pose2({});
    return { root, body, pose: pose2, P: P2, shoulders: T.sh, hands: T.hand };
  }
  const athlete = makePerson(scene, { shirt: 16761375, legs: 1920964, hair: 2824720, sole: 15020074 });
  function handTex() {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d");
    g.fillStyle = "#fff";
    g.translate(128, 150);
    g.beginPath();
    g.ellipse(0, 0, 58, 64, 0, 0, 6.283);
    g.fill();
    g.lineCap = "round";
    g.strokeStyle = "#fff";
    for (const [fx, len, w] of [[-38, 70, 26], [-12, 86, 27], [14, 80, 26], [38, 62, 23]]) {
      g.lineWidth = w;
      g.beginPath();
      g.moveTo(fx, -40);
      g.lineTo(fx * 1.15, -40 - len);
      g.stroke();
    }
    g.lineWidth = 28;
    g.beginPath();
    g.moveTo(-50, 10);
    g.lineTo(-92, -42);
    g.stroke();
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  }
  const HAND_TEX = handTex();
  function foamTextures() {
    const n = 512, c = document.createElement("canvas");
    c.width = c.height = n;
    const g = c.getContext("2d"), img = g.createImageData(n, n);
    for (let i = 0; i < n * n; i++) {
      const v = 200 + Math.random() * 40 + 15 * Math.sin(i % n / 9) * Math.sin((i / n | 0) / 13);
      img.data.set([v, v, v, 255], i * 4);
    }
    g.putImageData(img, 0, 0);
    const bump = new CanvasTexture(c);
    bump.wrapS = bump.wrapT = RepeatWrapping;
    bump.repeat.set(3, 2);
    const d = document.createElement("canvas");
    d.width = 1024;
    d.height = 640;
    const h = d.getContext("2d");
    h.fillStyle = "#ffffff";
    h.fillRect(0, 0, 1024, 640);
    h.save();
    h.globalAlpha = 0.13;
    h.fillStyle = "#ffffff";
    for (let x = -640; x < 1024; x += 150) {
      h.beginPath();
      h.moveTo(x, 640);
      h.lineTo(x + 70, 640);
      h.lineTo(x + 70 + 640, 0);
      h.lineTo(x + 640, 0);
      h.fill();
    }
    h.restore();
    h.save();
    h.globalAlpha = 0.18;
    h.fillStyle = "#000";
    for (let x = -640; x < 1024; x += 150) {
      h.beginPath();
      h.moveTo(x + 70, 640);
      h.lineTo(x + 82, 640);
      h.lineTo(x + 82 + 640, 0);
      h.lineTo(x + 70 + 640, 0);
      h.fill();
    }
    h.restore();
    const gr = h.createLinearGradient(0, 0, 0, 640);
    gr.addColorStop(0, "rgba(255,255,255,0.0)");
    gr.addColorStop(0.8, "rgba(0,0,0,0)");
    gr.addColorStop(1, "rgba(40,30,20,0.28)");
    h.fillStyle = gr;
    h.fillRect(0, 0, 1024, 640);
    h.fillStyle = "rgba(255,255,255,0.9)";
    h.fillRect(0, 30, 1024, 26);
    h.fillRect(0, 600, 1024, 14);
    for (let i = 0; i < 40; i++) {
      h.fillStyle = "rgba(80,70,60,".concat(Math.random() * 0.06, ")");
      h.beginPath();
      h.arc(Math.random() * 1024, 560 + Math.random() * 80, 10 + Math.random() * 40, 0, 6.283);
      h.fill();
    }
    const map = new CanvasTexture(d);
    map.colorSpace = SRGBColorSpace;
    return { bump, map };
  }
  const FOAM = foamTextures();
  const blobTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d"), r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, "rgba(0,0,0,0.75)");
    r.addColorStop(0.5, "rgba(0,0,0,0.35)");
    r.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, 128, 128);
    return new CanvasTexture(c);
  })();
  function blob(w, d, op = 0.6) {
    const m = new Mesh(new PlaneGeometry(w, d), new MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, opacity: op }));
    m.rotation.x = -Math.PI / 2;
    m.position.y = 6e-3;
    m.renderOrder = 1;
    return m;
  }
  const athleteBlob = blob(0.9, 0.6, 0.6);
  scene.add(athleteBlob);
  const youG = new Group();
  scene.add(youG);
  const youCam = new Vector3();
  const FLAT = new URLSearchParams(location.search).get("body") === "fig";
  const YOU_LOOK = { fillA: 0.04, rimA: 0.32, rimPow: 1.8 };
  const YOU_OPTS = { scene: youG, camera: { position: youCam }, BP: BodyMovin, x: 0, z: 0, tier: RR.quality ? RR.quality.tier : 1, gloves: false, levelFeet: false, stepRange: 0, guardDepth: 0.04, shadow: false };
  const youFig = FLAT ? create(Object.assign({}, YOU_OPTS, { outfit: { shorts: "rgba(29,79,196,0.88)", band: "#ffc21f", seam: "rgba(12,30,90,0.7)" } })) : create2(Object.assign({}, YOU_OPTS, { shadow: true, outfit: "sport", personOpts: { plainLook: YOU_LOOK }, onFallback: (w) => console.warn("real you off:", w) }));
  const wallGhost = FLAT ? null : create3(Object.assign({ scene: youG, BP: BodyMovin, you: youFig, outfit: "sport", tier: RR.quality ? RR.quality.tier : 1 }, STANCES.athletic));
  window.__youFig = youFig;
  const WALL_COL = { squat: 1361002, jump: 16753664, left: 2062591, right: 16726666, arms: 10111231, squatL: 47304, squatR: 16734756 };
  const HAND3 = { left: 16736176, right: 3524863 };
  const SIL = {
    // joints in metres: x from the opening's centre (mirrored for the other side), y up from the floor; head = [x, y, r]
    stand: { head: [0, 1.8, 0.18], sh: [0.25, 1.49], hip: [0.16, 0.96], knee: [0.18, 0.5], foot: [0.21, 0.08], elb: [0.37, 1.2], hand: [0.44, 0.92] },
    arms: { head: [0, 1.8, 0.18], sh: [0.25, 1.49], hip: [0.16, 0.96], knee: [0.18, 0.5], foot: [0.21, 0.08], elb: [0.33, 1.87], hand: [0.29, 2.28] },
    squat: { head: [0, 0.84, 0.165], sh: [0.27, 0.62], hip: [0.2, 0.36], knee: [0.44, 0.42], foot: [0.31, 0.08], elb: [0.6, 0.57], hand: [0.78, 0.7] },
    jump: { head: [0, 2.08, 0.165], sh: [0.25, 1.82], hip: [0.16, 1.32], knee: [0.42, 1], foot: [0.62, 0.75], elb: [0.6, 1.99], hand: [0.88, 2.14] }
  };
  const SIL_OF = { squat: ["squat", 1], jump: ["jump", 1], left: ["stand", 1], right: ["stand", 1], arms: ["arms", 1], squatL: ["squat", 0.86], squatR: ["squat", 0.86] };
  const RES = 40;
  function silhouetteLoops(kind) {
    const nx = Math.round(HALF * 2 * RES), ny = Math.round(TOP * RES), c = document.createElement("canvas");
    c.width = nx;
    c.height = ny;
    const g = c.getContext("2d");
    g.fillStyle = "#fff";
    g.fillRect(0, 0, nx, ny);
    const [x0, x1] = HOLES[kind], [name, sx] = SIL_OF[kind], j = SIL[name], cx = (x0 + x1) / 2;
    const X = (x) => (cx + x * sx + HALF) * RES, Y = (y) => (TOP - y) * RES;
    g.fillStyle = g.strokeStyle = "#000";
    g.lineCap = g.lineJoin = "round";
    const seg2 = (w, pts) => {
      g.lineWidth = w * RES;
      g.beginPath();
      pts.forEach(([x, y], i) => i ? g.lineTo(X(x), Y(y)) : g.moveTo(X(x), Y(y)));
      g.stroke();
    };
    const dot = (x, y, r) => {
      g.beginPath();
      g.arc(X(x), Y(y), r * RES, 0, 6.283);
      g.fill();
    };
    for (const s of [-1, 1]) {
      seg2(0.27, [[s * j.hip[0], j.hip[1]], [s * j.knee[0], j.knee[1]], [s * j.foot[0], j.foot[1]]]);
      seg2(0.2, [[s * j.foot[0], j.foot[1]], [s * (j.foot[0] + 0.11), j.foot[1] - 0.01]]);
      seg2(0.21, [[s * j.sh[0], j.sh[1]], [s * j.elb[0], j.elb[1]], [s * j.hand[0], j.hand[1]]]);
      dot(s * j.hand[0], j.hand[1], 0.125);
    }
    g.lineWidth = 0.16 * RES;
    g.beginPath();
    g.moveTo(X(-j.sh[0]), Y(j.sh[1]));
    g.lineTo(X(j.sh[0]), Y(j.sh[1]));
    g.lineTo(X(j.hip[0] + 0.05), Y(j.hip[1] - 0.06));
    g.lineTo(X(-j.hip[0] - 0.05), Y(j.hip[1] - 0.06));
    g.closePath();
    g.fill();
    g.stroke();
    seg2(0.16, [[0, j.sh[1]], [0, j.head[1]]]);
    g.beginPath();
    g.ellipse(X(0), Y(j.head[1]), j.head[2] * 0.95 * RES, j.head[2] * 1.12 * RES, 0, 0, 6.283);
    g.fill();
    const px = g.getImageData(0, 0, nx, ny).data, solid = (i, k) => i >= 0 && k >= 0 && i < nx && k < ny && px[((ny - 1 - k) * nx + i) * 4] > 127;
    const out = /* @__PURE__ */ new Map(), addE = (a, b, c2, d) => {
      const k = a * 4096 + b;
      let l = out.get(k);
      if (!l) out.set(k, l = []);
      l.push([c2, d]);
    };
    for (let k = 0; k < ny; k++) for (let i = 0; i < nx; i++) if (solid(i, k)) {
      if (!solid(i, k - 1)) addE(i, k, i + 1, k);
      if (!solid(i + 1, k)) addE(i + 1, k, i + 1, k + 1);
      if (!solid(i, k + 1)) addE(i + 1, k + 1, i, k + 1);
      if (!solid(i - 1, k)) addE(i, k + 1, i, k);
    }
    const loops = [];
    for (const [key0, list] of out) while (list.length) {
      const si = Math.floor(key0 / 4096), sj = key0 % 4096, loop = [[si, sj]];
      let [ci, cj] = list.pop(), pi = si, pj = sj, guard = 0;
      while ((ci !== si || cj !== sj) && guard++ < 2e5) {
        loop.push([ci, cj]);
        const l = out.get(ci * 4096 + cj);
        if (!l || !l.length) break;
        let idx = 0;
        if (l.length > 1) {
          const dx = ci - pi, dy = cj - pj;
          idx = Math.max(0, l.findIndex(([a, b]) => dx * (b - cj) - dy * (a - ci) > 0));
        }
        const nx2 = l.splice(idx, 1)[0];
        pi = ci;
        pj = cj;
        ci = nx2[0];
        cj = nx2[1];
      }
      loops.push(loop);
    }
    const dp = (pts, eps) => {
      if (pts.length < 3) return pts;
      let md = 0, mi = 0;
      const [ax, ay] = pts[0], [bx, by] = pts[pts.length - 1], L = Math.hypot(bx - ax, by - ay) || 1e-9;
      for (let i = 1; i < pts.length - 1; i++) {
        const d = Math.abs((bx - ax) * (ay - pts[i][1]) - (ax - pts[i][0]) * (by - ay)) / L;
        if (d > md) {
          md = d;
          mi = i;
        }
      }
      return md > eps ? [...dp(pts.slice(0, mi + 1), eps).slice(0, -1), ...dp(pts.slice(mi), eps)] : [pts[0], pts[pts.length - 1]];
    };
    const dpClosed = (pts, eps) => {
      let fi = 0, fd = 0;
      pts.forEach((p, i) => {
        const d = Math.hypot(p[0] - pts[0][0], p[1] - pts[0][1]);
        if (d > fd) {
          fd = d;
          fi = i;
        }
      });
      return [...dp(pts.slice(0, fi + 1), eps).slice(0, -1), ...dp([...pts.slice(fi), pts[0]], eps).slice(0, -1)];
    };
    const chaikin = (pts, cut) => {
      const o = [];
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], b = pts[(i + 1) % pts.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), t = Math.min(0.25, cut / (L || 1));
        o.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], [a[0] + (b[0] - a[0]) * (1 - t), a[1] + (b[1] - a[1]) * (1 - t)]);
      }
      return o;
    };
    const area = (pts) => {
      let s = 0;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], b = pts[(i + 1) % pts.length];
        s += a[0] * b[1] - b[0] * a[1];
      }
      return s / 2;
    };
    return loops.filter((l) => l.length > 8).map((l) => {
      let p = dpClosed(l, 0.75);
      p = chaikin(chaikin(p, 2.4), 1.2);
      return p.map(([i, k]) => [i / RES - HALF, Math.max(0, Math.min(TOP, k / RES))]);
    }).map((p) => ({ p, a: area(p) })).filter((o) => Math.abs(o.a) > 0.01);
  }
  const inPoly = (pt, poly) => {
    let c = false;
    for (let i = 0, k = poly.length - 1; i < poly.length; k = i++) {
      const [xi, yi] = poly[i], [xk, yk] = poly[k];
      if (yi > pt[1] !== yk > pt[1] && pt[0] < (xk - xi) * (pt[1] - yi) / (yk - yi) + xi) c = !c;
    }
    return c;
  };
  const wallGeo = {};
  function wallGeometry(kind) {
    if (wallGeo[kind]) return wallGeo[kind];
    const loops = silhouetteLoops(kind), outers = loops.filter((o) => o.a > 0), holes = loops.filter((o) => o.a < 0);
    const shapes = outers.map((o) => {
      const sh = new Shape(o.p.map(([x, y]) => new Vector2(x, y)));
      sh.__poly = o.p;
      return sh;
    });
    for (const h of holes) {
      const host = shapes.find((s) => inPoly(h.p[0], s.__poly)) || shapes[0];
      host.holes.push(new Path(h.p.map(([x, y]) => new Vector2(x, y))));
    }
    const g = new ExtrudeGeometry(shapes, { depth: 0.22, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.018, bevelSegments: 2, curveSegments: 4 });
    g.translate(0, 0, -0.11);
    {
      const pp = g.attributes.position, uv = g.attributes.uv;
      for (let i = 0; i < pp.count; i++) uv.setXY(i, (pp.getX(i) + HALF) / (2 * HALF), pp.getY(i) / TOP);
    }
    return wallGeo[kind] = { g };
  }
  const wheelG = new CylinderGeometry(0.09, 0.09, 0.06, 18), wheelM = new MeshStandardMaterial({ color: 2237740, metalness: 0.7, roughness: 0.35 });
  const wheels4G = TVM && mergeGeometries([-1, 1].flatMap((sx) => [-1, 1].map((sz) => wheelG.clone().rotateZ(Math.PI / 2).translate(sx * 2.33, 0.07, sz * 0.14))));
  function buildWall(w) {
    const geo = wallGeometry(w.kind), grp = new Group();
    const foam = new MeshPhysicalMaterial({ color: WALL_COL[w.kind], map: FOAM.map, bumpMap: FOAM.bump, bumpScale: 0.6, roughness: 0.6, clearcoat: 0.35, clearcoatRoughness: 0.35, sheen: 0.25, sheenColor: new Color(16777215), transparent: true });
    const trim = new MeshStandardMaterial({ color: 16777215, roughness: 0.45, emissive: 16777215, emissiveIntensity: 0.2, transparent: true });
    const body = new Mesh(geo.g, [foam, trim]);
    body.castShadow = true;
    body.receiveShadow = true;
    grp.add(body);
    const foot = new Mesh(new BoxGeometry(HALF * 2 + 0.3, 0.1, 0.42), new MeshStandardMaterial({ color: 2764085, metalness: 0.6, roughness: 0.45, transparent: true }));
    foot.position.y = 0.05;
    foot.castShadow = foot.receiveShadow = true;
    grp.add(foot);
    w.wheels = [];
    if (TVM) {
      const wh = new Mesh(wheels4G, wheelM);
      grp.add(wh);
      w.wheels.push(wh);
    } else for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const wh = new Mesh(wheelG, wheelM);
      wh.rotation.z = Math.PI / 2;
      wh.position.set(sx * 2.33, 0.07, sz * 0.14);
      grp.add(wh);
      w.wheels.push(wh);
    }
    const sh = blob(HALF * 2 + 0.8, 1.4, 0.55);
    grp.add(sh);
    w.blob = sh;
    w.prints = w.slots.map((sl) => {
      const m = new MeshStandardMaterial({ map: HAND_TEX, color: HAND3[sl.side], emissive: HAND3[sl.side], emissiveMap: HAND_TEX, emissiveIntensity: 0.15, transparent: true, depthWrite: false, roughness: 0.7 });
      const q = new Mesh(new PlaneGeometry(0.5, 0.5), m);
      const [X, Y] = slotWorld(sl);
      q.position.set(X, Y, 0.142);
      if (sl.side === "left") q.scale.x = -1;
      grp.add(q);
      return q;
    });
    w.footM = foot.material;
    w.trim = trim;
    w.mats = [foam, trim, foot.material, sh.material, ...w.prints.map((q) => q.material)];
    w.grp = grp;
    w.foam = foam;
    scene.add(grp);
  }
  function disposeWall(w) {
    if (!w.grp) return;
    scene.remove(w.grp);
    w.mats.forEach((m) => m.dispose());
    w.grp.children.forEach((o) => {
      var _a2;
      return o.geometry !== wheelG && o.geometry !== wheels4G && o.geometry !== ((_a2 = wallGeo[w.kind]) == null ? void 0 : _a2.g) && o.geometry.dispose();
    });
    w.grp = null;
  }
  const CONF = 600, confMesh = new InstancedMesh(new PlaneGeometry(0.075, 0.048), new MeshStandardMaterial({ side: DoubleSide, roughness: 0.4, metalness: 0.35 }), CONF);
  confMesh.count = CONF;
  confMesh.frustumCulled = false;
  scene.add(confMesh);
  const conf = [], _m = new Matrix4(), _q = new Quaternion(), _e = new Euler(), _s = new Vector3(), _p = new Vector3(), _col = new Color();
  const CONF_COLS = [16726891, 16765498, 3921407, 8257386, 11693055, 16747050, 16777215];
  for (let i = 0; i < CONF; i++) {
    conf.push({ life: 0, p: new Vector3(), v: new Vector3(), r: new Vector3(), w: new Vector3(), ph: 0, rest: false });
    confMesh.setColorAt(i, _col.set(CONF_COLS[i % CONF_COLS.length]));
  }
  let confNext = 0;
  function confetti(gold) {
    const n = gold ? 260 : 170;
    for (let k = 0; k < n; k++) {
      const c = conf[confNext];
      confNext = (confNext + 1) % CONF;
      c.rest = false;
      c.life = 3.2 + Math.random() * 1.5;
      c.ph = Math.random() * 6.283;
      if (k % 3 === 2) {
        c.p.set((Math.random() - 0.5) * 7, 4.2 + Math.random() * 1.6, -0.6 - Math.random() * 5);
        c.v.set((Math.random() - 0.5) * 0.6, -0.4, 0);
      } else {
        const s = k % 2 ? 1 : -1;
        c.p.set(s * 2.85, 0.35, -0.6 - Math.random() * 0.6);
        c.v.set(-s * (1.2 + Math.random() * 2.6), 5.5 + Math.random() * 3.5, -Math.random() * 2.2 + 0.4);
      }
      c.r.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
      c.w.set((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 16, (Math.random() - 0.5) * 16);
      if (gold && Math.random() < 0.45) confMesh.setColorAt(confNext ? confNext - 1 : CONF - 1, _col.set(16765530));
    }
    confMesh.instanceColor.needsUpdate = true;
  }
  const DROPS = 360, dropMesh = new InstancedMesh(new SphereGeometry(0.024, 8, 6), new MeshPhysicalMaterial({ color: 14217983, roughness: 0.04, emissive: 4892927, emissiveIntensity: 0.6, clearcoat: 1, transparent: true, opacity: 0.85 }), DROPS);
  dropMesh.frustumCulled = false;
  scene.add(dropMesh);
  const drops = Array.from({ length: DROPS }, () => ({ life: 0, p: new Vector3(), v: new Vector3(), s: 1 }));
  let dropNext = 0;
  const puffTex = canvasTex(256, 512, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.lineCap = "round";
    for (let i = 0; i < 70; i++) {
      const a = (Math.random() - 0.5) * 1.5 * Math.pow(Math.random(), 0.6), len = h * (0.35 + Math.random() * 0.6) * (1 - Math.abs(a) * 0.4), x0 = w / 2 + (Math.random() - 0.5) * w * 0.25;
      const x1 = x0 + Math.sin(a) * len, y1 = h - Math.cos(a) * len, gr = g.createLinearGradient(x0, h, x1, y1);
      gr.addColorStop(0, "rgba(255,255,255,0.85)");
      gr.addColorStop(0.7, "rgba(235,248,255,0.5)");
      gr.addColorStop(1, "rgba(235,248,255,0)");
      g.strokeStyle = gr;
      g.lineWidth = 2 + Math.random() * 9;
      g.beginPath();
      g.moveTo(x0, h);
      g.quadraticCurveTo(x0 + Math.sin(a) * len * 0.3, h - len * 0.6, x1, y1);
      g.stroke();
      g.fillStyle = "rgba(255,255,255,0.8)";
      g.beginPath();
      g.arc(x1, y1 + 6, 2 + Math.random() * 5, 0, 6.283);
      g.fill();
    }
    const r = g.createRadialGradient(w / 2, h, 0, w / 2, h, w * 0.6);
    r.addColorStop(0, "rgba(255,255,255,0.9)");
    r.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = r;
    g.fillRect(0, h * 0.6, w, h * 0.4);
  });
  const puffs = Array.from({ length: 3 }, () => {
    const sp = new Sprite(new SpriteMaterial({ map: puffTex, color: 15399167, transparent: true, opacity: 0, depthWrite: false }));
    sp.center.set(0.5, 0.02);
    sp.visible = false;
    scene.add(sp);
    return { sp, t: -1e9, x: 0, z: 0, sz: 1, dl: 0 };
  });
  const ringTex = canvasTex(128, 128, (g) => {
    const r = g.createRadialGradient(64, 64, 30, 64, 64, 64);
    r.addColorStop(0, "rgba(255,255,255,0)");
    r.addColorStop(0.75, "rgba(255,255,255,0.85)");
    r.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, 128, 128);
  });
  const ripples = Array.from({ length: 4 }, () => {
    const m = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ map: ringTex, transparent: true, opacity: 0, depthWrite: false }));
    m.rotation.x = -Math.PI / 2;
    m.visible = false;
    m.renderOrder = 3;
    scene.add(m);
    return { m, t: -1e9, dl: 0 };
  });
  function splash(x, z) {
    for (let k = 0; k < 260; k++) {
      const d = drops[dropNext];
      dropNext = (dropNext + 1) % DROPS;
      const a = Math.random() * 6.283, r = 0.4 + Math.random() * 2.4, up = 2 + Math.random() * 4.5;
      d.p.set(x + Math.cos(a) * 0.3, WATER_Y + 0.05, z + Math.sin(a) * 0.25);
      d.v.set(Math.cos(a) * r * 0.8, up, Math.sin(a) * r * 0.45 + 0.15);
      d.s = 0.5 + Math.random() * Math.random() * 2.2;
      d.life = 2.5;
    }
    const now = performance.now();
    puffs.forEach((p, i) => {
      Object.assign(p, { t: now, x: x + (i - 1) * 0.35, z: z + 0.1 * i, sz: [1.8, 1.3, 1.4][i], dl: i * 40 });
      p.sp.material.rotation = (i - 1) * 0.25;
      p.sp.visible = true;
    });
    ripples.forEach((r, i) => {
      Object.assign(r, { t: now, dl: i * 180 });
      r.m.position.set(x, WATER_Y + 0.01, z);
      r.m.visible = true;
    });
    waterAgit = 1;
    WU.uSplash.value.set(x, z, 0, 0);
  }
  let ko = null;
  function update3D(now, dt) {
    const X = clamp(pose.side, -1.2, 1.2) * 1.25, lift = pose.air * 0.55, R0 = athlete.root;
    R0.position.x += (X - R0.position.x) * Math.min(1, dt * 14);
    const hands = [null, null];
    if (!ko) ["left", "right"].forEach((side, i) => {
      const h = BodyMovin.hands[side];
      if (!h.seen || pose.src === "none" || pose.src === "keys" || BodyMovin.mouse && side === "left") return;
      const v = new Vector3((h.x * W - W / 2) / K0 - R0.position.x, CAM.h - (h.y * H - H * CAM.hor) / K0 - lift, -0.2);
      hands[i] = v;
    });
    if (ko) {
      const t = (now - ko.t) / 1e3;
      if (t < 1) {
        const u = Math.max(0, t - 0.14), z = t < 0.14 ? lerp(0, 0.35, t / 0.14) : lerp(0.35, 0.95, clamp(u / 0.42, 0, 1)), y = t < 0.14 ? 0.04 * t / 0.14 : 0.04 + 2.2 * u - 4.9 * u * u;
        R0.position.set(ko.x, Math.max(y, -2.2), z);
        R0.rotation.x = Math.min(1.05, t * 2.6);
        R0.visible = y > -1.9;
        R0.scale.setScalar(1);
        athlete.pose({ crouch: 0.15, tuck: clamp(t * 2, 0, 0.6), wing: 0.5 + 0.5 * Math.sin(t * 34) });
        if (!ko.splashed && y < WATER_Y + 0.25 && t > 0.2) {
          ko.splashed = true;
          splash(ko.x, 0.95);
          SFX.splash();
          shake(0.9);
          cheerCrowd(1);
          show.mood = "miss";
          show.t = now;
        }
      } else if (t < 1.3) R0.visible = false;
      else if (t < 1.6) {
        const k = ease(clamp((t - 1.3) / 0.3, 0, 1));
        R0.visible = true;
        R0.rotation.x = 0;
        R0.position.set(R0.position.x, lerp(-0.7, 0, k), lerp(0.6, 0, k));
        R0.scale.setScalar(lerp(0.85, 1, k));
        athlete.pose({ crouch: pose.crouch, lean: pose.lean * 0.6, armsUp: pose.armsUp });
      } else {
        ko = null;
        R0.scale.setScalar(1);
        R0.rotation.x = 0;
        R0.visible = true;
      }
    }
    if (!ko) {
      R0.position.y = lift;
      R0.position.z = 0;
      athlete.pose({ crouch: pose.crouch, lean: pose.lean * 0.6, tuck: pose.air, armsUp: pose.armsUp, hands });
    }
    {
      youG.position.set(R0.position.x, ko || youFig.real ? R0.position.y : 0, R0.position.z);
      youG.rotation.copy(R0.rotation);
      youG.scale.copy(R0.scale);
      youG.visible = R0.visible;
      youG.updateMatrixWorld(true);
      youCam.copy(camera.position);
      youG.worldToLocal(youCam);
      youFig.update(now);
      if (wallGhost) wallGhost.update(now, state2 === "play" && !ko && (BodyMovin.live || BodyMovin.simulating) && !BodyMovin.mouse && !walls.some((w) => !w.done && w.z < FAR * 0.6));
      const on = youFig.opacity > 0.3, sub = !youFig.real || window.BodyMovin.mouse;
      for (const c of R0.children) c.visible = !on && sub;
    }
    athleteBlob.visible = !ko;
    athleteBlob.position.x = R0.position.x;
    athleteBlob.scale.setScalar(1 - 0.5 * pose.air);
    athleteBlob.material.opacity = 0.6 * (1 - 0.6 * pose.air);
    for (const w of walls) {
      if (!w.grp) continue;
      let vz = w.z;
      if (!w.done && w.matched <= 0) vz = Math.max(w.z, 0.3);
      if (w.result === "miss") vz = lerp(0.3, -0.35, ease(clamp((now - w.missAt) / 200, 0, 1)));
      w.vz = w.vz === void 0 || w.result === "miss" ? vz : vz < w.vz - 0.05 ? lerp(w.vz, vz, Math.min(1, dt * 16)) : vz;
      w.grp.position.z = -w.vz;
      const appear = clamp((FAR - w.vz) / 3, 0, 1), passing = clamp((w.vz + 1.5) / 1.5, 0, 1);
      const op = appear * w.fade * (w.vz < 0 ? passing : 1);
      const tr = op < 0.995;
      for (const m of [w.foam, w.trim, w.footM]) {
        if (m.transparent !== tr) {
          m.transparent = tr;
          m.depthWrite = !tr;
          m.needsUpdate = true;
        }
      }
      w.mats.forEach((m) => m.opacity = op);
      w.blob.material.opacity = 0.55 * op;
      w.wheels.forEach((o) => o.visible = op > 0.97);
      w.trim.emissive.set(w.result === "miss" ? 16722490 : w.result === "pass" ? 10354632 : w.live ? 6160266 : 16777215);
      w.trim.emissiveIntensity = w.live || w.result ? 2.6 : 0.2;
      w.prints.forEach((q, i) => {
        const sl = w.slots[i];
        q.material.emissiveIntensity = sl.on || sl.hit ? 2.2 : 0.15;
      });
      if (w.wobble) {
        w.wobble = Math.max(0, w.wobble - dt * 1.5);
        w.grp.rotation.x = Math.sin(now / 45) * 0.04 * w.wobble;
      }
    }
    const T = now / 1e3;
    let confOn = false, confW = false;
    for (let i = 0; i < CONF; i++) {
      const c = conf[i];
      if (c.life <= 0 && c.zero) continue;
      confW = true;
      if (c.life > 0) {
        c.life -= dt;
        if (!c.rest) {
          c.v.y -= 9.8 * 0.45 * dt;
          c.v.multiplyScalar(1 - Math.min(0.9, 2.2 * dt));
          c.p.addScaledVector(c.v, dt);
          c.p.x += Math.sin(T * 5 + c.ph) * 0.35 * dt;
          c.r.addScaledVector(c.w, dt);
          const floor = Math.abs(c.p.x) < STAGE_HW ? 6e-3 : WATER_Y + 0.01;
          if (c.p.y < floor) {
            c.p.y = floor;
            c.rest = true;
            c.r.set(-Math.PI / 2, 0, c.ph);
          }
        }
      }
      const sc = c.life > 0 ? Math.min(1, c.life * 1.5) : 0;
      c.zero = sc === 0;
      if (sc) confOn = true;
      _m.compose(_p.copy(c.p), _q.setFromEuler(_e.set(c.r.x, c.r.y, c.r.z)), _s.set(sc, sc, sc));
      confMesh.setMatrixAt(i, _m);
    }
    if (confW) confMesh.instanceMatrix.needsUpdate = true;
    confMesh.visible = confOn;
    let dropOn = false, dropW = false;
    for (let i = 0; i < DROPS; i++) {
      const d = drops[i];
      if (d.life <= 0 && d.zero) continue;
      dropW = true;
      if (d.life > 0) {
        d.life -= dt;
        d.v.y -= 9.8 * dt;
        d.p.addScaledVector(d.v, dt);
        if (d.p.y < WATER_Y && d.v.y < 0) d.life = 0;
      }
      const sc = d.life > 0 ? d.s : 0;
      d.zero = sc === 0;
      if (sc) dropOn = true;
      _m.compose(_p.copy(d.p), _q.identity(), _s.set(sc, sc * (1 + Math.min(1.5, Math.abs(d.v.y) * 0.12)), sc));
      dropMesh.setMatrixAt(i, _m);
    }
    if (dropW) dropMesh.instanceMatrix.needsUpdate = true;
    dropMesh.visible = dropOn;
    for (const p of puffs) {
      const k = (now - p.t - p.dl) / 1100;
      if (k < 0) {
        p.sp.material.opacity = 0;
        continue;
      }
      if (k > 1) {
        p.sp.visible = false;
        continue;
      }
      const up = k < 0.2 ? ease(k / 0.2) : 1 - 0.55 * ease((k - 0.2) / 0.8);
      p.sp.scale.set(p.sz * (0.7 + 0.8 * Math.min(1, k * 2.5)), p.sz * 2.3 * up, 1);
      p.sp.position.set(p.x, WATER_Y, p.z);
      p.sp.material.opacity = 0.95 * Math.min(1, k * 12) * (1 - Math.max(0, (k - 0.45) / 0.55));
    }
    for (const r of ripples) {
      const k = (now - r.t - r.dl) / 1600;
      if (k < 0) {
        r.m.material.opacity = 0;
        continue;
      }
      if (k > 1) {
        r.m.visible = false;
        continue;
      }
      const s = 0.6 + 5 * k;
      r.m.scale.set(s, s, 1);
      r.m.material.opacity = 0.7 * (1 - k);
    }
    updateCrowd(now);
    updateShow(now, dt);
  }
  let buttons = [], focusIdx = 0, mouseDown = null;
  function button(id, label, x, y, w, h, action, now, col = [120, 230, 255]) {
    const r = { x, y, w, h }, hov = BodyMovin.handOver(r, W, H);
    const arm = button.arm || (button.arm = {});
    if (arm[id + "_f"] !== frameNo - 1) arm[id] = !hov;
    else if (!hov) arm[id] = true;
    arm[id + "_f"] = frameNo;
    const over = hov && arm[id] && now - stateAt > 1e3;
    const k = BodyMovin.dwell(id, over, now, id === "home2" ? BodyMovin.LEAVE_MS || 1400 : 750);
    const b = { id, r, action, k };
    buttons.push(b);
    const focused = buttons.length - 1 === focusIdx && state2 !== "play";
    ctx.save();
    const rad = h / 2;
    ctx.fillStyle = rgba([10, 8, 28], 0.72);
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, rad);
    ctx.fill();
    if (k > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, rad);
      ctx.clip();
      ctx.fillStyle = rgba(col, 0.42);
      ctx.fillRect(x, y, w * k, h);
      ctx.restore();
    }
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = rgba(col, over || focused ? 0.95 : 0.55);
    ctx.lineWidth = Math.max(2, h * (over ? 0.06 : 0.04));
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, rad);
    ctx.stroke();
    if (over || focused) {
      ctx.strokeStyle = rgba(col, 0.18);
      ctx.lineWidth = h * 0.22;
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#fff";
    ctx.font = "700 ".concat(h * 0.4, "px ").concat(FONT);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x + w / 2, y + h / 2 + h * 0.02);
    ctx.restore();
    if (k === 1) {
      SFX.click();
      action();
    }
  }
  cv.addEventListener("pointerdown", (e) => {
    audioInit();
    const x = e.clientX * DPR, y = e.clientY * DPR;
    for (const b of buttons) if (x > b.r.x && x < b.r.x + b.r.w && y > b.r.y && y < b.r.y + b.r.h) {
      SFX.click();
      b.action();
      return;
    }
  });
  function onKey(e) {
    if (!studioReady) {
      if (e.code === "Enter" || e.code === "Space" || e.code === "NumpadEnter") {
        e.preventDefault();
        startQueued = true;
      }
      return;
    }
    if (e.code === "Enter" || e.code === "Space" || e.code === "NumpadEnter") {
      e.preventDefault();
      audioInit();
      if (state2 === "play") return;
      const b = buttons[focusIdx] || buttons[0];
      if (b) {
        SFX.click();
        b.action();
      } else if (state2 === "title") {
        SFX.click();
        startRound();
      }
    }
    if (state2 !== "play" && (e.code === "ArrowLeft" || e.code === "ArrowRight" || e.code === "Tab")) {
      e.preventDefault();
      const n = buttons.length || 1;
      focusIdx = (focusIdx + (e.code === "ArrowLeft" ? n - 1 : 1)) % n;
    }
    if (e.code === "Escape" && state2 === "play") goHome();
  }
  function goHome() {
    location.href = "index.html";
  }
  let perfects = 0, handHits = 0, shards = [];
  let state2 = "title", stateAt = 0, t0 = 0, score = 0, combo = 0, bestCombo = 0, cleared = 0, missed = 0, struggle = 0;
  let walls = [], nextSpawn = 0, lastKind = "", particles = [], popups = [], shake2 = 0, flash2 = null, pulse = 0, act0 = null, endInfo = null, best = BodyMovin.best(GAME);
  const log = [];
  window.__game = {
    get state() {
      return state2;
    },
    get score() {
      return score;
    },
    get combo() {
      return combo;
    },
    get cleared() {
      return cleared;
    },
    get missed() {
      return missed;
    },
    get struggle() {
      return struggle;
    },
    get timeLeft() {
      return state2 === "play" ? Math.max(0, ROUND - (performance.now() - t0) / 1e3) : 0;
    },
    get walls() {
      return walls.map((w) => ({ slots: w.slots, kind: w.kind, arrive: w.arrive, z: w.z, done: w.done }));
    },
    get pose() {
      return { ...pose };
    },
    get endInfo() {
      return endInfo;
    },
    log,
    get buttons() {
      return buttons.map((b) => ({ id: b.id, x: b.r.x / W, y: b.r.y / H, w: b.r.w / W, h: b.r.h / H }));
    },
    start: () => startRound(),
    round: ROUND,
    endNow: () => {
      if (state2 === "play") endRound();
    }
  };
  function setState(s) {
    state2 = s;
    stateAt = performance.now();
    focusIdx = 0;
  }
  function startRound() {
    BodyMovin.uiCover = null;
    audioInit();
    const tr = BodyMovin.music && BodyMovin.music("walls");
    if (!tr) beatStart();
    else {
      tr.addEventListener("error", beatStart, { once: true });
      if (tr.error) beatStart();
    }
    SFX.go();
    setState("play");
    t0 = performance.now();
    score = 0;
    combo = 0;
    bestCombo = 0;
    cleared = 0;
    missed = 0;
    struggle = 0;
    perfects = 0;
    handHits = 0;
    shards = [];
    for (const w of walls) disposeWall(w);
    walls = [];
    particles = [];
    popups = [];
    ko = null;
    nextSpawn = t0 + 1800;
    lastKind = "";
    log.length = 0;
    endInfo = null;
    act0 = { sec: BodyMovin.activity.activeSec, kcal: BodyMovin.activity.kcal };
  }
  function endRound() {
    document.querySelectorAll(".bph-tip").forEach((e) => e.remove());
    beatStop();
    if (BodyMovin.musicVolume) BodyMovin.musicVolume(0.12);
    SFX.end();
    const a = BodyMovin.activity, prevBest = BodyMovin.best(GAME);
    endInfo = {
      perfects,
      score,
      best: Math.max(prevBest, score),
      newBest: score > prevBest && score > 0,
      cleared,
      missed,
      bestCombo,
      minutes: (a.activeSec - (act0 ? act0.sec : 0)) / 60,
      kcal: a.kcal - (act0 ? act0.kcal : 0)
    };
    BodyMovin.saveSession({ game: GAME, score });
    if (BodyMovin.highScores) BodyMovin.highScores(GAME, score);
    best = BodyMovin.best(GAME);
    setState("end");
  }
  function difficulty(el) {
    const p = clamp(el / ROUND, 0, 1), s = struggle;
    return { travel: lerp(3.7, 2.45, ease(p)) * (1 + 0.35 * s), gap: lerp(3.1, 1.75, ease(p)) * (1 + 0.6 * s), combos: p > 0.42 && s < 0.5, p };
  }
  function pickKind(d) {
    const base = ["squat", "jump", "left", "right", "arms"], pool = d.combos ? [...base, ...base, "squatL", "squatR"] : base;
    let k;
    do {
      k = pool[Math.random() * pool.length | 0];
    } while (k === lastKind && Math.random() < 0.8);
    return lastKind = k;
  }
  function spawn(now, el) {
    const d = difficulty(el);
    const kind = pickKind(d), jx = (Math.random() - 0.5) * 0.06, jy = (Math.random() - 0.5) * 0.06;
    walls.push({ kind, slots: SLOTS[kind].map(([x, y], i) => ({ x: x + jx, y: y + jy, side: i ? "right" : "left", hit: false, on: false })), born: now, arrive: now + d.travel * 1e3, travel: d.travel, z: FAR, matched: 0, matchedAt: -1, done: false, result: null, fade: 1 });
    buildWall(walls[walls.length - 1]);
    SFX.whoosh();
    nextSpawn = now + d.gap * 1e3;
  }
  function burst(x, y, col, n, spd) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283, v = spd * (0.3 + Math.random());
      particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - spd * 0.3, life: 1, col, r: U * (3e-3 + Math.random() * 6e-3) });
    }
  }
  function popup(text, col, size2 = 0.065) {
    popups.length = 0;
    popups.push({ text, col, t: performance.now(), size: size2 });
  }
  let lastT = 0;
  let frameNo = 0;
  function frame(now) {
    BodyMovin.update(now);
    readPose(now);
    frameNo++;
    if (lastT && now - lastT > 120) {
      const q = state().quality;
      q.frames = 0;
      q.t0 = now;
    }
    const dt = Math.min(0.05, (now - (lastT || now)) / 1e3);
    lastT = now;
    buttons = [];
    pulse *= Math.pow(0.04, dt);
    const el = (now - t0) / 1e3;
    if (state2 === "play") {
      if (now >= nextSpawn && el < ROUND - difficulty(el).travel + 0.3) spawn(now, el);
      for (const w of walls) {
        w.z = FAR * (w.arrive - now) / (w.travel * 1e3);
        const left = (w.arrive - now) / 1e3;
        w.live = !w.done && left < 1 && MOVES[w.kind].ok(pose);
        for (const sl of w.slots) {
          const hh = BodyMovin.mouse ? BodyMovin.hands.right : BodyMovin.hands[sl.side];
          sl.on = !w.done && hh.seen && Math.abs(hh.x - sl.x) < SLOT_TOL.x && Math.abs(hh.y - sl.y) < SLOT_TOL.y;
          if (sl.on && left < 0.6 && left > -0.22) sl.hit = true;
        }
        if (!w.done && left < 0.6 && left > -0.22 && MOVES[w.kind].ok(pose)) {
          w.matched += dt;
          if (w.matchedAt < 0) w.matchedAt = left;
        }
        if (!w.done && left < -0.22) resolveWall(w, now, el);
        if (w.done && (w.result === "pass" || now - w.missAt > 150)) w.fade = Math.max(0, w.fade - dt * (w.result === "pass" ? 6 : 5));
      }
      for (const w of walls) if (w.fade <= 0 && w.done) disposeWall(w);
      walls = walls.filter((w) => w.fade > 0 || !w.done);
      if (el >= ROUND && walls.every((w) => w.done)) endRound();
    }
    update3D(now, dt);
    {
      const ao = state().passes.ao;
      if (ao && !ao.__noFx) {
        const ov = ao.overrideVisibility.bind(ao);
        ao.__noFx = true;
        const clear = (m) => m.transparent && (m.opacity < 0.99 || m.blending === AdditiveBlending || !m.depthWrite);
        ao.overrideVisibility = () => {
          ov();
          scene.traverse((o) => {
            if (o.isSprite || o.material && (Array.isArray(o.material) ? o.material.some(clear) : clear(o.material))) o.visible = false;
          });
        };
      }
    }
    if (Q.has("noao") && state().passes.ao) state().passes.ao.enabled = false;
    if (Q.has("lock")) state().quality.graceUntil = now + 1e6;
    renderMirror();
    render(dt);
    ctx.clearRect(0, 0, W, H);
    hudR = [];
    if (state2 !== "end") for (const w of walls) drawWallHUD(w, now);
    drawParticles(dt);
    if (state2 === "title") drawTitle(now);
    else if (state2 === "play") drawHUD(now, el);
    else if (state2 === "end") drawEnd(now);
    drawPopups(now);
    BodyMovin.drawHands(ctx, W, H);
    requestAnimationFrame(frame);
  }
  let hudR = [];
  const MISS_LINES = ["SPLASH!", "INTO THE POOL!", "OOF! SPLASHDOWN!"];
  function resolveWall(w, now, el) {
    w.done = true;
    const ok = w.matched >= 0.06 || w.kind === "jump" && w.matched > 0;
    const [hx0, hx1, hy0, hy1] = HOLES[w.kind], c = P((hx0 + hx1) / 2, (hy0 + hy1) / 2, 0.5);
    if (ok) {
      w.result = "pass";
      combo++;
      bestCombo = Math.max(bestCombo, combo);
      cleared++;
      const great = w.matched > 0.25, hands = w.slots.filter((sl) => sl.hit).length, perfect = hands === 2;
      const pts = 100 + Math.min(10, combo - 1) * 20 + (great ? 50 : 0) + (MOVES[w.kind].combo ? 50 : 0) + hands * 40 + (perfect ? 100 : 0);
      if (hands) perfects += perfect ? 1 : 0, handHits += hands;
      score += pts;
      struggle = Math.max(0, struggle - 0.1);
      pulse = 1;
      confetti(perfect);
      cheerCrowd(perfect ? 1.25 : 0.9);
      show.mood = perfect ? "perfect" : "pass";
      show.t = now;
      flash(perfect ? 16771496 : 16777215, perfect ? 0.22 : 0.1);
      shake(0.25);
      SFX.pass(combo);
      if (great) SFX.great();
      SFX.cheer(perfect ? 1.4 : 1);
      burst(c[0], c[1], [255, 255, 255], 18, U * 8e-3);
      popup((perfect ? "PERFECT POSE!  " : great ? "GREAT FIT!  " : "NICE FIT  ") + "+" + pts, perfect ? [255, 225, 110] : MOVES[w.kind].col);
      if (perfect) {
        SFX.perfect();
        burst(W / 2, H * 0.4, [255, 225, 110], 40, U * 0.015);
      }
      if (combo >= 3 && combo % 3 === 0) popup(combo + " IN A ROW!", [255, 230, 120], 0.05);
    } else {
      w.result = "miss";
      combo = 0;
      missed++;
      struggle = Math.min(1, struggle + 0.3);
      w.wobble = 1;
      w.missAt = now;
      ko = { t: now, x: athlete.root.position.x, splashed: false };
      shake(1.2);
      flash(12576511, 0.16);
      SFX.oof();
      SFX.aww();
      popup(MISS_LINES[missed % MISS_LINES.length], [120, 205, 255], 0.065);
    }
    log.push({ kind: w.kind, ok, hands: w.slots.filter((sl) => sl.hit).length, matched: +w.matched.toFixed(2), t: +el.toFixed(1), gap: +difficulty(el).gap.toFixed(2) });
  }
  function drawWallHUD(w, now) {
    const z = w.z;
    if (z < 0.3) return;
    const alpha = clamp(1 - z / FAR, 0, 1) * w.fade, a = P(0, TOP, z);
    if (!w.done && z > 1.2) {
      const ic = P(0, TOP + 0.5, z);
      (TVM ? iconTV : icon)(w.kind, ic[0], ic[1], Math.max(U * 0.022, a[2] * 0.4), clamp(alpha * 1.4, 0, 1));
    }
    const left = (w.arrive - now) / 1e3;
    if (!w.done) {
      for (const sl of w.slots) if (left < 1 && left > -0.2) {
        const tx = sl.x * W, ty = sl.y * H, rr = K0 * 0.24 * (1 + 1.1 * Math.max(0, left)), lit = sl.on || sl.hit;
        ctx.save();
        ctx.strokeStyle = rgba(lit ? [255, 255, 255] : HAND_COL[sl.side], 0.85 * clamp((1 - left) * 1.6, 0, 1));
        ctx.lineWidth = U * 6e-3;
        ctx.setLineDash([U * 0.016, U * 0.01]);
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = U * 0.01;
        ctx.beginPath();
        ctx.arc(tx, ty, rr, 0, 6.283);
        ctx.stroke();
        ctx.restore();
        hudR.push({ x: (tx - rr) / DPR, y: (ty - rr) / DPR, w: 2 * rr / DPR, h: 2 * rr / DPR });
      }
    }
  }
  function drawParticles(dt) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt * 60;
      p.y += p.vy * dt * 60;
      p.vy += U * 4e-4 * dt * 60;
      p.life -= dt * 1.1;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      const rr = p.r * (0.4 + 0.6 * p.life) * 2.2;
      if (TVM) {
        const c = stamp("spark:" + p.col, 1, 64, 64, 0, () => {
          const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
          g.addColorStop(0, rgba([255, 255, 255], 0.9));
          g.addColorStop(0.25, rgba(p.col, 0.55));
          g.addColorStop(1, rgba(p.col, 0));
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(32, 32, 32, 0, 6.283);
          ctx.fill();
        });
        ctx.globalAlpha = p.life;
        ctx.drawImage(c, p.x - rr, p.y - rr, rr * 2, rr * 2);
        ctx.globalAlpha = 1;
        continue;
      }
      const gg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rr);
      gg.addColorStop(0, rgba([255, 255, 255], 0.9 * p.life));
      gg.addColorStop(0.25, rgba(p.col, 0.55 * p.life));
      gg.addColorStop(1, rgba(p.col, 0));
      ctx.fillStyle = gg;
      ctx.beginPath();
      ctx.arc(p.x, p.y, rr, 0, 6.283);
      ctx.fill();
    }
    ctx.restore();
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
  function drawPopups(now) {
    for (let i = popups.length - 1; i >= 0; i--) {
      const p = popups[i], k = (now - p.t) / 1100;
      if (k >= 1) {
        popups.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = k < 0.15 ? k / 0.15 : 1 - Math.max(0, (k - 0.6) / 0.4);
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      const L = sideLines(p.text, sidePx(W, H) * (1 + 0.25 * Math.max(0, 0.15 - k) / 0.15), sideW(W, H, 0.22), (px) => "900 ".concat(px, "px ").concat(FONT)), x0 = W * 0.025;
      let sz = L.px;
      if (TVM) sz = Math.round(sz);
      ctx.font = "900 ".concat(sz, "px ").concat(FONT);
      const y = Math.max(H * (0.2 - 0.03 * k), hudBottom + sz * 0.8);
      hudR.push({ x: x0 / DPR, y: (y - sz * 0.6) / DPR, w: L.w / DPR, h: L.h / DPR });
      const glowText = (t, x, y2) => {
        ctx.shadowColor = rgba(p.col, 0.9);
        ctx.shadowBlur = sz * 0.4;
        ctx.fillStyle = rgba(p.col, 1);
        ctx.fillText(t, x, y2);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.fillText(t, x, y2);
      };
      L.lines.forEach((l, n) => {
        const ly = y + n * sz * 1.1;
        if (TVM) {
          const tw1 = mtw(ctx.font, l), pd = Math.ceil(sz * 0.7), f = ctx.font;
          ctx.drawImage(stamp("popup", [l, sz, p.col].join("|"), tw1, sz * 1.2, pd, (x, y0) => {
            ctx.font = f;
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            glowText(l, x, y0 + sz * 0.6);
          }), Math.round(x0) - pd, Math.round(ly - sz * 0.6) - pd);
        } else glowText(l, x0, ly);
      });
      ctx.restore();
    }
  }
  const MT = /* @__PURE__ */ new Map();
  function mtw(font, s) {
    const k = font + "\n" + s;
    let w = MT.get(k);
    if (w === void 0) {
      if (MT.size > 300) MT.clear();
      ctx.font = font;
      w = ctx.measureText(s).width;
      MT.set(k, w);
    }
    return w;
  }
  function txt(s, x, y, sz, col = "#fff", weight = 800, align = "center", glow = null, maxW = W * 0.92) {
    if (TVM) sz = Math.round(sz);
    const f = "".concat(weight, " ").concat(sz, "px ").concat(FONT);
    ctx.save();
    ctx.font = f;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    const tw = mtw(f, s);
    if (tw > maxW) {
      sz *= maxW / tw;
      if (TVM) sz = Math.floor(sz);
      ctx.font = "".concat(weight, " ").concat(sz, "px ").concat(FONT);
    }
    if (glow) {
      ctx.shadowColor = glow;
      ctx.shadowBlur = sz * 0.45;
    }
    ctx.fillStyle = col;
    ctx.fillText(s, x, y);
    ctx.restore();
  }
  function panel(x, y, w, h, r = U * 0.025) {
    ctx.fillStyle = "rgba(8,6,24,0.62)";
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
    ctx.strokeStyle = "rgba(160,140,255,0.28)";
    ctx.lineWidth = Math.max(1, U * 2e-3);
    ctx.stroke();
  }
  let hudBottom = 0;
  function sysRow() {
    const r = BodyMovin.uiRow();
    return { bottom: r.bottom * DPR, right: r.right * DPR, top: (r.bottom - Math.max(38, Math.min(innerWidth, innerHeight) * 0.058)) * DPR };
  }
  function drawHUD(now, el) {
    const left = Math.max(0, ROUND - el), row = sysRow(), gap = Math.max(8 * DPR, U * 0.015);
    const ph = clamp(U * 0.085, 40 * DPR, 80 * DPR), tStr = Math.floor(Math.ceil(left) / 60) + ":" + String(Math.ceil(left) % 60).padStart(2, "0");
    const f9 = "900 ".concat(ph * 0.6, "px ").concat(FONT), f8 = "800 ".concat(ph * 0.44, "px ").concat(FONT);
    const sw = Math.max(mtw(f9, "0000"), mtw(f9, score.toLocaleString()));
    const tw = mtw(f8, "0:00");
    ctx.font = f8;
    const pw = tw + sw + ph * 1.5, px = W / 2 - pw / 2, py = Math.max(row.top, BodyMovin.uiBelow(px / DPR) * DPR);
    const pill = (px2, py2) => {
      panel(px2, py2, pw, ph, ph / 2);
      txt(tStr, px2 + ph * 0.5 + tw / 2, py2 + ph / 2, ph * 0.44, left < 10 ? "#ff8a9a" : "#cfe0ff", 800);
      txt(score.toLocaleString(), px2 + pw - ph * 0.5 - sw / 2, py2 + ph / 2, ph * 0.6, "#fff", 900, "center", "rgba(140,200,255,0.8)");
    };
    if (TVM) {
      const pd = Math.ceil(ph * 0.4);
      ctx.drawImage(stamp("pill", [tStr, score, left < 10, pw, ph].join("|"), pw, ph, pd, pill), Math.round(px) - pd, Math.round(py) - pd);
    } else pill(px, py);
    hudR.push({ x: px / DPR, y: py / DPR, w: pw / DPR, h: ph / DPR });
    hudBottom = py + ph;
    const pend = walls.filter((w) => !w.done).sort((a, b) => a.arrive - b.arrive), cur = pend[0], nxt = pend[1];
    if (cur) {
      const s = (cur.arrive - now) / 1e3;
      if (s < 1.9) {
        const k = clamp(1 - s / 1.9, 0, 1), m = MOVES[cur.kind];
        hudR.push({ x: W * 0.2 / DPR, y: (H * 0.86 - U * 0.06) / DPR, w: W * 0.6 / DPR, h: U * 0.12 / DPR });
        txt(m.label + "!", W / 2, H * 0.86, U * (0.075 + 0.015 * Math.sin(now / 90) * k), rgba(cur.live ? [150, 255, 180] : m.col, 1), 900, "center", rgba(m.col, 0.9), W * 0.6);
      }
    }
    const n = nxt || cur;
    if (n) {
      const nh = ph * 0.8, label = "Next: " + MOVES[n.kind].label.charAt(0) + MOVES[n.kind].label.slice(1).toLowerCase();
      ctx.font = "800 ".concat(nh * 0.4, "px ").concat(FONT);
      const nw = mtw("800 ".concat(nh * 0.4, "px ").concat(FONT), label) + nh * 1.5;
      let nx = Math.min(W - gap, BodyMovin.freeRight ? BodyMovin.freeRight() * DPR : W) - nw, ny = row.top;
      if (nx < px + pw + gap) ny = py + ph + gap;
      const next = (nx2, ny2) => {
        panel(nx2, ny2, nw, nh, nh / 2);
        icon(n.kind, nx2 + nh * 0.5, ny2 + nh / 2, nh * 0.36);
        txt(label, nx2 + nh * 0.95 + (nw - nh * 1.05) / 2, ny2 + nh / 2, nh * 0.4, "rgba(255,255,255,0.92)", 800, "center", null, nw - nh * 1.1);
      };
      if (TVM) {
        const pd = Math.ceil(nh * 0.2);
        ctx.drawImage(stamp("next", [label, nw, nh].join("|"), nw, nh, pd, next), Math.round(nx) - pd, Math.round(ny) - pd);
        ctx.lineCap = "round";
      } else next(nx, ny);
      hudR.push({ x: nx / DPR, y: ny / DPR, w: nw / DPR, h: nh / DPR });
      hudBottom = Math.max(hudBottom, ny + nh);
    }
  }
  function drawTitle(now) {
    const k = clamp((now - stateAt) / 600, 0, 1);
    ctx.save();
    ctx.globalAlpha = k;
    const bh = clamp(U * 0.14, 50 * DPR, 140 * DPR), bw = Math.min(W * 0.8, Math.max(bh * 4, U * 0.42)), by = H * 0.72 + Math.max(0, (H * 0.86 - H * 0.72 - bh) / 2);
    button("start", "START", W / 2 - bw / 2, by, bw, bh, startRound, now, [120, 255, 200]);
    ctx.restore();
    if (TV && now - stateAt > 2e3 && !window.__tvStarted) {
      window.__tvStarted = true;
      startRound();
    }
  }
  function drawEnd(now) {
    const e = endInfo, k = clamp((now - stateAt) / 500, 0, 1), row = sysRow();
    ctx.save();
    ctx.globalAlpha = k;
    const E = BodyMovin.layout.end(W, H, { cy: H * 0.7, side: true });
    const top = Math.max(row.bottom + 12 * DPR, H * 0.14), room = E.again.y - Math.max(12 * DPR, U * 0.03) - top;
    const wide = W > H * 1.05, pw = wide ? Math.min(W * 0.34, U * 0.8) : Math.min(W * 0.9, U * 1.05), ph = Math.min(room, U * 0.6), px = wide ? Math.max(W * 0.035, 16 * DPR) : W / 2 - pw / 2, py = top + (room - ph) / 2, cxp = px + pw / 2;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = U * 0.05;
    panel(px, py, pw, ph, U * 0.04);
    ctx.restore();
    BodyMovin.uiCover = { x: px / DPR, y: py / DPR, w: pw / DPR, h: ph / DPR };
    txt("YOUR SCORE", cxp, py + ph * 0.19, Math.min(Math.max(16 * DPR, U * 0.04), ph * 0.12), "rgba(220,215,255,0.75)", 800, "center", null, pw * 0.9);
    txt(e.score.toLocaleString(), cxp, py + ph * 0.52, Math.min(U * 0.16, ph * 0.34), "#fff", 900, "center", "rgba(140,200,255,0.9)", pw * 0.9);
    txt(e.newBest ? "New best!" : "Best " + e.best.toLocaleString(), cxp, py + ph * 0.83, Math.min(Math.max(16 * DPR, U * 0.045), ph * 0.12), e.newBest ? "#ffe68a" : "rgba(230,225,255,0.8)", 800, "center", null, pw * 0.9);
    const a = E.again, h = E.home;
    button("again", "PLAY AGAIN", a.x, a.y, a.w, a.h, startRound, now, [120, 255, 200]);
    button("home2", "HOME", h.x, h.y, h.w, h.h, goHome, now, [200, 180, 255]);
    ctx.restore();
  }
  if (TVM) {
    scene.updateMatrixWorld(true);
    const by = /* @__PURE__ */ new Map();
    for (const m of STATIC) {
      if (Array.isArray(m.material) || !m.parent) continue;
      const l = by.get(m.material) || [];
      l.push(m);
      by.set(m.material, l);
    }
    for (const [mat, list] of by) {
      if (list.length < 2) continue;
      const gs = list.map((m) => {
        const g2 = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone();
        for (const k of Object.keys(g2.attributes)) if (k !== "position" && k !== "normal" && k !== "uv") g2.deleteAttribute(k);
        g2.clearGroups();
        return g2.applyMatrix4(m.matrixWorld);
      });
      const g = mergeGeometries(gs);
      gs.forEach((x) => x.dispose());
      if (!g) continue;
      const one = new Mesh(g, mat);
      one.castShadow = list.some((m) => m.castShadow);
      one.receiveShadow = list.some((m) => m.receiveShadow);
      one.matrixAutoUpdate = false;
      scene.add(one);
      for (const m of list) m.parent.remove(m);
    }
  }
  const warm = Object.keys(HOLES).map((kind, i) => {
    const w = { kind, slots: SLOTS[kind].map(([x, y], j) => ({ x, y, side: j ? "right" : "left" })) };
    buildWall(w);
    w.grp.position.set(0, 0, -10 - i);
    return w;
  });
  await renderer.compileAsync(scene, camera).catch(() => {
  });
  state().grace(3e3);
  renderMirror();
  render(0.016);
  warm.forEach(disposeWall);
  const ld = document.getElementById("loading");
  ld.style.opacity = 0;
  setTimeout(() => ld.remove(), 700);
  studioReady = true;
  if (startQueued) setTimeout(() => {
    if (state2 === "title") startRound();
  }, 400);
  window.__game.quality = () => state().quality;
  BodyMovin.start();
  requestAnimationFrame(frame);
})().catch((e) => setTimeout(() => {
  throw e;
}));
