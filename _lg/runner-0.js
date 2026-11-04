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
import "./chunk-GEQJXPAR.js";
import "./chunk-UBB4M7UR.js";
import {
  AdditiveBlending,
  BoxGeometry,
  CanvasTexture,
  CapsuleGeometry,
  Color,
  CylinderGeometry,
  DoubleSide,
  Euler,
  Fog,
  Group,
  HemisphereLight,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PlaneGeometry,
  Quaternion,
  SRGBColorSpace,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  Vector3
} from "./chunk-4IYDSAYK.js";
import "./chunk-NWIHTO7D.js";

// bmpage:bmpage:runner.html#0
(async () => {
  var _a, _b, _c, _d, _e, _f;
  const GAME = "runner", ROUND = 80;
  const Q = new URLSearchParams(location.search), TV = Q.has("tv"), MUTE = Q.has("mute");
  const cv = document.getElementById("c"), ctx = cv.getContext("2d");
  let W, H, U, DPR, K0;
  function size() {
    DPR = Math.min(2, devicePixelRatio || 1);
    W = cv.width = Math.round(innerWidth * DPR);
    H = cv.height = Math.round(innerHeight * DPR);
    U = Math.min(W, H);
    K0 = Math.min(0.15 * H, 0.105 * W);
  }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t, ease = (t) => t * t * (3 - 2 * t);
  const rgba = (c, a) => "rgba(".concat(c[0] | 0, ",").concat(c[1] | 0, ",").concat(c[2] | 0, ",").concat(clamp(a, 0, 1), ")");
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
  const PENTA = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
  const SFX = {
    orb(n) {
      const f = 660 * Math.pow(2, PENTA[Math.min(PENTA.length - 1, n % 11)] / 12);
      tone(f, 0.25, { type: "triangle", vol: 0.1 });
      tone(f * 2, 0.15, { vol: 0.04, at: 0.03 });
    },
    jump() {
      tone(300, 0.25, { type: "triangle", vol: 0.12, slide: 2.2 });
    },
    flap() {
      hiss(0.22, { f: 900, sweep: 0.5, q: 0.7, vol: 0.12 });
      tone(520, 0.12, { vol: 0.04, slide: 1.4 });
    },
    clear(c) {
      tone(523 * Math.pow(2, Math.min(12, c) / 24), 0.2, { type: "square", vol: 0.04 });
    },
    hit() {
      tone(120, 0.4, { type: "sawtooth", vol: 0.18, slide: 0.5 });
      hiss(0.3, { f: 500, type: "lowpass", vol: 0.25 });
    },
    boing() {
      tone(180, 0.5, { type: "sine", vol: 0.25, slide: 3 });
      tone(360, 0.4, { type: "triangle", vol: 0.08, slide: 2.5, at: 0.05 });
    },
    click() {
      tone(990, 0.12, { type: "triangle", vol: 0.1 });
    },
    go() {
      tone(660, 0.12, { type: "square", vol: 0.06 });
      tone(1320, 0.3, { type: "triangle", vol: 0.1, at: 0.1 });
    },
    end() {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.6, { type: "triangle", vol: 0.12, at: i * 0.12 }));
    }
  };
  let beatRate = 1;
  function beatStart() {
    if (!ac || beatTimer) return;
    let next = ac.currentTime + 0.1, step2 = 0;
    const mel = [0, 4, 7, 12, 7, 4, 9, 7, 0, 4, 7, 14, 12, 9, 7, 4];
    beatTimer = setInterval(() => {
      const spb = 60 / (124 * beatRate) / 2;
      while (next < ac.currentTime + 0.2) {
        const at = next - ac.currentTime;
        if (step2 % 2 === 0) tone(105, 0.22, { vol: 0.2, slide: 0.35, at });
        hiss(0.05, { f: 9e3, type: "highpass", vol: step2 % 2 ? 0.03 : 0.012, at });
        if (step2 % 2 === 1) tone(262 * Math.pow(2, mel[(step2 >> 1) % 16] / 12), spb * 0.9, { type: "triangle", vol: 0.03, at });
        if (step2 % 8 === 0) tone([65.4, 55, 73.4, 49][(step2 >> 3) % 4], spb * 7, { type: "sawtooth", vol: 0.03, at, attack: 0.03 });
        next += spb;
        step2++;
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
  let xDrift = 0, lastLiveAt = 0, keys = {}, lastKeyAt = -1e9, keyLane = 0, jumpQueued = 0, flapQueued = 0, lastFlapAt = 0, flapArmed = true, runI = 0;
  const ctl = { side: 0, crouch: 0, lean: 0, src: "none" };
  BodyMovin.on("jump", () => {
    jumpQueued = flapQueued = performance.now();
  });
  let stepKick = 0, stepsRound = 0, rsKey = 0;
  const RS = RunStep({ arms: false, armsJump: false }), picRun = () => RS.fresh(performance.now() / 1e3);
  const onStep = () => {
    if (state2 !== "play") return;
    stepKick = Math.min(3, stepKick + 0.55);
    stepsRound++;
  };
  RS.on("step", onStep);
  BodyMovin.on("step", () => {
    if (!picRun()) onStep();
  });
  function readControls(now, dt) {
    var _a2;
    const B = BodyMovin.body, L = BodyMovin.hands.left, R = BodyMovin.hands.right;
    let intensity = 0;
    if (BodyMovin.live) {
      lastLiveAt = now;
      ctl.side = clamp(((_a2 = B.shoulders) != null ? _a2 : B.x) * 1.15, -1.3, 1.3);
      ctl.crouch = B.crouch;
      ctl.lean = B.lean;
      ctl.src = simOn ? "sim" : "body";
      intensity = picRun() ? RS.running : B.running || 0;
      const down = L.seen && R.seen ? Math.min(L.vy, R.vy) : 0;
      if (down > 1.1 && flapArmed && now - lastFlapAt > 180) {
        flapArmed = false;
        lastFlapAt = now;
        flapQueued = now;
      }
      if (down < 0.3) flapArmed = true;
    } else if (now - lastKeyAt < 4e3) {
      ctl.side = keyLane * 0.8;
      ctl.crouch = keys.ArrowDown ? 1 : 0;
      ctl.lean = 0;
      ctl.src = "keys";
      intensity = keys.ShiftLeft || keys.ShiftRight ? 0.8 : 0.3;
    } else if (BodyMovin.mouse) {
      ctl.side = R.x < 0.36 ? -0.8 : R.x > 0.64 ? 0.8 : 0;
      ctl.crouch = R.y > 0.72 ? 1 : 0;
      ctl.lean = 0;
      ctl.src = "mouse";
      if (R.y < 0.3) {
        if (flapArmed) {
          flapArmed = false;
          jumpQueued = now;
          flapQueued = now;
        }
      } else if (R.y > 0.4) flapArmed = true;
      intensity = clamp(R.speed / 2.5, 0, 1);
    } else {
      ctl.side *= 0.9;
      ctl.crouch *= 0.9;
      ctl.src = "none";
    }
    if (typeof window.__game.intensityOverride === "number") intensity = window.__game.intensityOverride;
    runI += (intensity - runI) * Math.min(1, dt * 3);
  }
  addEventListener("keydown", (e) => {
    keys[e.code] = true;
    if (state2 === "play") {
      if (e.code === "ArrowLeft" && !e.repeat) keyLane = Math.max(-1, keyLane - 1);
      if (e.code === "ArrowRight" && !e.repeat) keyLane = Math.min(1, keyLane + 1);
      if (e.code === "ArrowUp" && !e.repeat) {
        jumpQueued = performance.now();
        flapQueued = performance.now();
      }
      if (e.code.startsWith("Arrow") || e.code.startsWith("Shift")) {
        lastKeyAt = performance.now();
        e.preventDefault();
      }
    }
    onKey(e);
  });
  addEventListener("keyup", (e) => {
    keys[e.code] = false;
  });
  const CAM = { d: 4.6, h: 3.2, hor: 0.33 }, LANE = 1.45, FAR = 80, G = 12, JUMP_V = 6, FLAP_V = 4.2;
  function P(X, Y, Z) {
    const s = K0 * CAM.d / Math.max(0.05, Z + CAM.d);
    return [W / 2 + X * s, H * CAM.hor - (Y - CAM.h) * s, s];
  }
  const KIND = {
    low: { col: [255, 170, 80], cue: "JUMP" },
    high: { col: [255, 110, 200], cue: "SQUAT" },
    block: { col: [110, 220, 255], cue: "MOVE" },
    gap: { col: [180, 160, 255], cue: "JUMP" },
    orb: { col: [255, 225, 110] }
  };
  function figure(x, y, h, p, col, alpha, lw, glow = true) {
    const cr = clamp(p.crouch || 0, 0, 1), air = p.air || 0, lean = clamp(p.lean || 0, -1, 1) * 0.12, run = p.run, wing = p.wing || 0;
    const legL = h * 0.47 * (1 - 0.42 * cr), torso = h * 0.32 * (1 - 0.1 * cr), headR = h * 0.075;
    const fy = y;
    const hip = [x + lean * h * 0.15, fy - legL], sh = [hip[0] + lean * h * 0.6, hip[1] - torso], head = [sh[0] + lean * h * 0.2, sh[1] - headR * 1.6];
    const sw = (s) => run !== void 0 && !air ? Math.sin(run + (s > 0 ? 0 : Math.PI)) : 0;
    const knee = (s) => [hip[0] + s * h * (0.07 + 0.12 * cr), hip[1] + legL * (0.5 - 0.18 * Math.max(0, sw(s))) - (air ? h * 0.08 : 0)];
    const foot = (s) => [x + s * h * (0.08 + 0.03 * cr), fy - (air ? h * 0.1 * (s > 0 ? 1 : 0.5) : Math.max(0, sw(s)) * h * 0.12)];
    const hand = (s) => air ? [sh[0] + s * h * 0.36, sh[1] - h * (0.18 - 0.32 * wing)] : cr > 0.5 ? [sh[0] + s * h * 0.2, sh[1] + h * 0.08] : [sh[0] + s * h * 0.16, sh[1] + h * (0.26 - 0.08 * Math.max(0, -sw(s)))];
    const elbow = (s) => {
      const hd = hand(s);
      return air ? [sh[0] + s * h * 0.19, sh[1] - h * (0.06 - 0.14 * wing)] : [(sh[0] + hd[0]) / 2 + s * h * 0.06, (sh[1] + hd[1]) / 2];
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
    ctx.globalCompositeOperation = "lighter";
    if (air && glow) {
      for (const s of [-1, 1]) {
        const e = elbow(s), hd = hand(s), wg = new Path2D();
        wg.moveTo(sh[0], sh[1] + h * 0.02);
        wg.lineTo(e[0], e[1]);
        wg.lineTo(hd[0], hd[1]);
        wg.quadraticCurveTo(hd[0] - s * h * 0.05, hd[1] + h * 0.25, sh[0] + s * h * 0.05, sh[1] + h * 0.2);
        wg.closePath();
        const gg = ctx.createLinearGradient(sh[0], 0, hd[0], 0);
        gg.addColorStop(0, rgba([255, 240, 200], 0.55 * alpha));
        gg.addColorStop(1, rgba([255, 200, 120], 0.12 * alpha));
        ctx.fillStyle = gg;
        ctx.fill(wg);
      }
    }
    if (glow) {
      for (const [w, a] of [[3.6, 0.07], [2.2, 0.14]]) {
        ctx.strokeStyle = rgba(col, alpha * a);
        ctx.lineWidth = lw * w;
        ctx.stroke(path);
        ctx.fillStyle = rgba(col, alpha * a);
        ctx.beginPath();
        ctx.arc(head[0], head[1], headR * 1.25 + lw * w * 0.5, 0, 6.283);
        ctx.fill();
      }
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
      ctx.strokeStyle = rgba(col.map((c) => c * 0.35), alpha * 0.6);
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
    ctx.fillStyle = rgba([255, 255, 255], alpha * 0.5);
    ctx.beginPath();
    ctx.arc(head[0], head[1] - headR * 0.2, headR * 0.6, 0, 6.283);
    ctx.fill();
    ctx.restore();
  }
  function icon(kind, cx, cy, r, alpha = 1) {
    const col = { jump: [255, 190, 90], squat: [255, 120, 210], move: [110, 220, 255], flap: [255, 235, 150], run: [130, 255, 170] }[kind];
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.5);
    g.addColorStop(0, rgba(col, 0.3 * alpha));
    g.addColorStop(1, rgba(col, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.5, 0, 6.283);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = rgba([14, 10, 40], 0.78 * alpha);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 6.283);
    ctx.fill();
    ctx.strokeStyle = rgba(col, 0.95 * alpha);
    ctx.lineWidth = r * 0.08;
    ctx.stroke();
    const fp = kind === "squat" ? { crouch: 1 } : kind === "jump" ? { air: 1 } : kind === "flap" ? { air: 1, wing: 0.8 } : kind === "run" ? { run: 1.2 } : {};
    figure(cx + (kind === "move" ? -r * 0.25 : 0), cy + r * 0.55 - (fp.air ? r * 0.12 : 0), r * 1.1, fp, col, alpha, r * 0.09, false);
    ctx.strokeStyle = rgba([255, 255, 255], alpha);
    ctx.fillStyle = rgba([255, 255, 255], alpha);
    ctx.lineWidth = r * 0.08;
    ctx.lineCap = "round";
    const arrow = (x0, y0, x1, y1) => {
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      const a = Math.atan2(y1 - y0, x1 - x0), hl = r * 0.22;
      ctx.beginPath();
      ctx.moveTo(x1 + Math.cos(a) * hl * 0.4, y1 + Math.sin(a) * hl * 0.4);
      ctx.lineTo(x1 - Math.cos(a - 0.6) * hl, y1 - Math.sin(a - 0.6) * hl);
      ctx.lineTo(x1 - Math.cos(a + 0.6) * hl, y1 - Math.sin(a + 0.6) * hl);
      ctx.fill();
    };
    if (kind === "jump") arrow(cx + r * 0.55, cy + r * 0.2, cx + r * 0.55, cy - r * 0.5);
    if (kind === "squat") arrow(cx + r * 0.55, cy - r * 0.55, cx + r * 0.55, cy);
    if (kind === "move") {
      arrow(cx + r * 0.1, cy - r * 0.1, cx + r * 0.65, cy - r * 0.1);
    }
    if (kind === "flap") {
      arrow(cx - r * 0.62, cy - r * 0.55, cx - r * 0.62, cy);
      arrow(cx + r * 0.62, cy - r * 0.55, cx + r * 0.62, cy);
    }
  }
  let buttons = [], focusIdx = 0;
  function button(id, label, x, y, w, h, action, now, col = [120, 230, 255]) {
    const r = { x, y, w, h }, over = BodyMovin.handOver(r, W, H) && now - stateAt > 1e3;
    const k = BodyMovin.dwell(id, over, now, id === "home2" ? BodyMovin.LEAVE_MS || 1400 : 750);
    buttons.push({ id, r, action });
    const focused = buttons.length - 1 === focusIdx && state2 !== "play", rad = h / 2;
    ctx.save();
    ctx.fillStyle = rgba([14, 10, 44], 0.75);
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
    if (e.code === "Enter" || e.code === "Space" || e.code === "NumpadEnter") {
      e.preventDefault();
      audioInit();
      if (state2 === "play") {
        if (e.code === "Space") {
          jumpQueued = flapQueued = performance.now();
          lastKeyAt = performance.now();
        }
        return;
      }
      const b = buttons[focusIdx] || buttons[0];
      if (b) {
        SFX.click();
        b.action();
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
  let state2 = "title", stateAt = 0, t0 = 0, score = 0, dist = 0, speed = 0, combo = 0, bestCombo = 0, orbs = 0, orbChain = 0, hits = 0, cleared = 0, flaps = 0, airTime = 0, struggle = 0;
  let objs = [], gaps = [], nextRow = 30, player = { X: 0, lane: 0, y: 0, vy: 0, wing: 0, run: 0, invuln: 0, slow: 0, falling: false }, particles = [], popups = [], shake2 = 0, flash2 = null, pulse = 0;
  let crouchAt = -1e9, act0 = null, endInfo = null, best = BodyMovin.best(GAME), maxSpeed = 0, boostSum = 0, boostN = 0;
  const log = [];
  window.__game = {
    get state() {
      return state2;
    },
    get score() {
      return Math.floor(score);
    },
    get dist() {
      return dist;
    },
    get speed() {
      return speed;
    },
    get combo() {
      return combo;
    },
    get orbs() {
      return orbs;
    },
    get hits() {
      return hits;
    },
    get cleared() {
      return cleared;
    },
    get flaps() {
      return flaps;
    },
    get struggle() {
      return struggle;
    },
    get timeLeft() {
      return state2 === "play" ? Math.max(0, ROUND - (performance.now() - t0) / 1e3) : 0;
    },
    get boost() {
      return boost();
    },
    get steps() {
      return stepsRound;
    },
    get running() {
      return runI;
    },
    get player() {
      return { ...player };
    },
    get objects() {
      return objs.filter((o) => !o.done).map((o) => ({ type: o.type, lane: o.lane, z: o.d - dist, len: o.len || 0, y: o.y || 0 }));
    },
    get gaps() {
      return gaps.map((g) => ({ z0: g.d0 - dist, z1: g.d1 - dist }));
    },
    get endInfo() {
      return endInfo;
    },
    log,
    get buttons() {
      return buttons.map((b) => ({ id: b.id, x: b.r.x / W, y: b.r.y / H, w: b.r.w / W, h: b.r.h / H }));
    },
    intensityOverride: null,
    start: () => startRound(),
    round: ROUND,
    endNow: () => {
      if (state2 === "play") endRound();
    }
    // test hook: jump to the end screen
  };
  function setState(s) {
    state2 = s;
    stateAt = performance.now();
    focusIdx = 0;
  }
  function startRound() {
    audioInit();
    const tr = BodyMovin.music && BodyMovin.music("runner");
    if (!tr) beatStart();
    else {
      tr.addEventListener("error", beatStart, { once: true });
      if (tr.error) beatStart();
    }
    SFX.go();
    setState("play");
    t0 = performance.now();
    BodyMovin.howTo && BodyMovin.howTo.hide();
    BodyMovin.uiCover = null;
    score = 0;
    dist = 0;
    speed = 8;
    stepKick = 0;
    stepsRound = 0;
    combo = 0;
    bestCombo = 0;
    orbs = 0;
    orbChain = 0;
    hits = 0;
    cleared = 0;
    flaps = 0;
    airTime = 0;
    struggle = 0;
    maxSpeed = 0;
    boostSum = 0;
    boostN = 0;
    for (const o of objs) if (o.mesh) scene.remove(o.mesh);
    objs = [];
    gaps = [];
    rows = {};
    nextRow = 34;
    crouchAt = -1e9;
    keyLane = 0;
    particles = [];
    popups = [];
    log.length = 0;
    endInfo = null;
    player = { X: 0, lane: 0, y: 0, vy: 0, wing: 0, run: 0, invuln: 0, slow: 0, falling: false };
    act0 = { sec: BodyMovin.activity.activeSec, kcal: BodyMovin.activity.kcal };
  }
  function endRound() {
    document.querySelectorAll(".bph-tip").forEach((e) => e.remove());
    beatStop();
    SFX.end();
    beatRate = 1;
    const a = BodyMovin.activity, prevBest = BodyMovin.best(GAME), sc = Math.floor(score);
    endInfo = {
      score: sc,
      best: Math.max(prevBest, sc),
      newBest: sc > prevBest && sc > 0,
      dist: Math.round(dist),
      orbs,
      hits,
      cleared,
      flaps,
      airTime,
      topSpeed: maxSpeed,
      avgBoost: boostN ? boostSum / boostN : 0,
      minutes: (a.activeSec - (act0 ? act0.sec : 0)) / 60,
      kcal: a.kcal - (act0 ? act0.kcal : 0)
    };
    BodyMovin.saveSession({ game: GAME, score: sc });
    if (BodyMovin.highScores) BodyMovin.highScores(GAME, sc);
    if (BodyMovin.musicVolume) BodyMovin.musicVolume(0.12);
    best = BodyMovin.best(GAME);
    setState("end");
  }
  function boost() {
    return clamp((runI - 0.05) / 0.8, 0, 1);
  }
  const mult = () => 1 + Math.min(4, Math.floor(combo / 6));
  function difficulty(el) {
    const p = clamp(el / ROUND, 0, 1);
    return { p, base: lerp(9, 14.5, ease(p)) * (1 - 0.25 * struggle), rowGap: lerp(1.75, 1.05, ease(p)) * (1 + 0.6 * struggle) };
  }
  function orbLine(lane, d0, n, step2 = 2.2, yFn = () => 0.9) {
    for (let i = 0; i < n; i++) objs.push({ type: "orb", lane, d: d0 + i * step2, y: yFn(i, n) });
  }
  let rowSeq = 0, rows = {};
  function addRow(d, el) {
    const n0 = objs.length, len = addRow2(d, el), id = ++rowSeq;
    rows[id] = { hit: false, credited: false };
    for (let i = n0; i < objs.length; i++) objs[i].row = id;
    return len;
  }
  function addRow2(d, el) {
    const { p } = difficulty(el), r = Math.random(), lane = (Math.random() * 3 | 0) - 1, other = lane === 0 ? Math.random() < 0.5 ? -1 : 1 : -lane;
    const arc = (i, n) => 1.1 + Math.sin(i / (n - 1) * Math.PI) * 1.4;
    if (r < 0.2) {
      objs.push({ type: "low", lane, d });
      orbLine(lane, d - 4.4, 5, 2.2, arc);
      orbLine(other, d - 2, 3);
    } else if (r < 0.38) {
      objs.push({ type: "high", lane, d });
      orbLine(other, d - 2, 3);
    } else if (r < 0.54) {
      objs.push({ type: "block", lane, d });
      if (p > 0.35 && Math.random() < 0.5) objs.push({ type: "block", lane: [-1, 0, 1].filter((l) => l !== lane)[Math.random() * 2 | 0], d });
      orbLine(lane, d - 3, 4, 2, () => 3.6);
    } else if (r < 0.66) {
      for (const l of [-1, 0, 1]) objs.push({ type: "low", lane: l, d });
      orbLine(0, d - 4.4, 5, 2.2, arc);
    } else if (r < 0.78) {
      for (const l of [-1, 0, 1]) objs.push({ type: "high", lane: l, d });
      orbLine(lane, d - 1, 3, 2, () => 0.5);
    } else {
      const long = p > 0.3 && Math.random() < 0.5, len = long ? 14 + p * 6 : 5.5;
      gaps.push({ d0: d, d1: d + len, long });
      objs.push({ type: "gap", lane: 0, d, len });
      orbLine(lane, d + 1, Math.floor(len / 2.2), 2.2, () => long ? 3 : 2);
      return len;
    }
    return 0;
  }
  function inGap(d) {
    return gaps.some((g) => d > g.d0 + 0.3 && d < g.d1 - 0.3);
  }
  const ENV_ROT = +((_a = Q.get("rot")) != null ? _a : 2), EXP = +((_b = Q.get("exp")) != null ? _b : 0.85), ENVI = +((_c = Q.get("env")) != null ? _c : 1);
  const RR = setup(document.getElementById("gl"), { fov: 50, near: 0.1, far: 900, tier: Q.has("tier") ? +Q.get("tier") : void 0 });
  const { scene, camera, renderer } = RR;
  await environment(scene, renderer, "kloppenheim_06_puresky", { background: true, intensity: ENVI, rotation: ENV_ROT });
  renderer.toneMappingExposure = EXP;
  scene.fog = new Fog(15250572, 60, 260);
  function fitCam() {
    const w = innerWidth, h = innerHeight, k0 = Math.min(0.15 * h, 0.105 * w), f = k0 * CAM.d, Hf = 2 * h * (1 - CAM.hor);
    camera.position.set(0, CAM.h, CAM.d);
    camera.rotation.set(0, 0, 0);
    camera.fov = 2 * Math.atan(Hf / 2 / f) * 180 / Math.PI;
    camera.aspect = w / Hf;
    camera.setViewOffset(w, Hf, 0, Hf / 2 - h * CAM.hor, w, h);
    camera.updateProjectionMatrix();
  }
  addEventListener("resize", fitCam);
  fitCam();
  const SUN_DIR = new Vector3(+((_d = Q.get("sx")) != null ? _d : 0.45), +((_e = Q.get("sy")) != null ? _e : 0.32), -1).normalize();
  const sunL = sun(scene, { color: 16757870, intensity: +((_f = Q.get("sun")) != null ? _f : 3.8), position: [SUN_DIR.x * 40, SUN_DIR.y * 40, SUN_DIR.z * 40 - 14], target: [0, 0, -14], size: 22 });
  sunL.shadow.camera.far = 120;
  sunL.shadow.radius = 3;
  scene.add(new HemisphereLight(16767416, 3813456, 0.35));
  function makePerson(scene2, look = {}) {
    var _a2, _b2, _c2, _d2, _e2;
    const cloth = (color, sheen = 0.5, rough = 0.85) => new MeshPhysicalMaterial({ color, roughness: rough, sheen, sheenRoughness: 0.6, sheenColor: new Color(color).lerp(new Color(1, 1, 1), 0.4) });
    const skinM = new MeshPhysicalMaterial({ color: (_a2 = look.skin) != null ? _a2 : 12157030, roughness: 0.55, sheen: 0.35, sheenRoughness: 0.4, sheenColor: new Color(16763056) });
    const shirtM = cloth((_b2 = look.shirt) != null ? _b2 : 3108789, 0.6), legM = cloth((_c2 = look.legs) != null ? _c2 : 1908518, 0.4, 0.7), hairM = cloth((_d2 = look.hair) != null ? _d2 : 2759186, 0.9, 0.55);
    const shoeM = new MeshPhysicalMaterial({ color: 15921904, roughness: 0.5, clearcoat: 0.3 }), soleM = new MeshPhysicalMaterial({ color: (_e2 = look.sole) != null ? _e2 : 16734762, roughness: 0.6 });
    const root = new Group(), body = new Group();
    root.add(body);
    scene2.add(root);
    const mk = (geo2, mat, parent = body) => {
      const m = new Mesh(geo2, mat);
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
    function pose(o) {
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
    pose({});
    return { root, body, pose, P: P2, shoulders: T.sh, hands: T.hand };
  }
  const runner = makePerson(scene, { shirt: 14178090, legs: 2303534, hair: 3810324, sole: 2788607 });
  const youG = new Group();
  scene.add(youG);
  const youCam = new Vector3();
  const YOU_LOOK = { fillA: 0.04, rimA: 0.32, rimPow: 1.8 };
  const YOU_OPTS = { scene: youG, camera: { position: youCam }, BP: BodyMovin, x: 0, z: 0, tier: RR.quality ? RR.quality.tier : 1, gloves: false, levelFeet: false, stepRange: 0, guardDepth: 0.04, shadow: false, alpha: 0.62 };
  const youFig = new URLSearchParams(location.search).get("body") === "fig" ? create(Object.assign({}, YOU_OPTS, { outfit: { shorts: "rgba(35,38,46,0.88)", band: "#d8572a", seam: "rgba(10,12,16,0.7)" } })) : create2(Object.assign({}, YOU_OPTS, { shadow: true, outfit: "runner", personOpts: { plainLook: YOU_LOOK }, onFallback: (w) => console.warn("real runner off:", w) }));
  window.__youFig = youFig;
  const wingTex = (() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 256;
    const g = c.getContext("2d");
    const gr = g.createLinearGradient(0, 0, 512, 0);
    gr.addColorStop(0, "#fffaf2");
    gr.addColorStop(1, "#ffd9a8");
    g.fillStyle = gr;
    g.fillRect(0, 0, 512, 256);
    g.strokeStyle = "rgba(120,80,40,0.45)";
    for (let i = 0; i < 9; i++) {
      g.lineWidth = i % 3 ? 2 : 5;
      g.beginPath();
      g.moveTo(0, 128);
      g.lineTo(512, 20 + i * 27);
      g.stroke();
    }
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  })();
  const wingM = new MeshPhysicalMaterial({ map: wingTex, roughness: 0.6, sheen: 0.7, sheenColor: new Color(16777215), side: DoubleSide, transparent: true, opacity: 0.95 });
  const wings = [-1, 1].map((s) => {
    const sh = new Shape();
    sh.moveTo(0, 0);
    sh.bezierCurveTo(s * 0.3, 0.25, s * 0.9, 0.22, s * 1.25, 0.05);
    sh.bezierCurveTo(s * 0.9, -0.15, s * 0.5, -0.35, 0, -0.32);
    sh.closePath();
    const sg = new ShapeGeometry(sh, 16);
    {
      const pp = sg.attributes.position, uv = sg.attributes.uv;
      for (let i = 0; i < pp.count; i++) uv.setXY(i, Math.abs(pp.getX(i)) / 1.25, (pp.getY(i) + 0.35) / 0.6);
    }
    const m = new Mesh(sg, wingM);
    m.castShadow = true;
    scene.add(m);
    m.visible = false;
    return m;
  });
  const blobTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d"), r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, "rgba(0,0,0,0.7)");
    r.addColorStop(0.5, "rgba(0,0,0,0.3)");
    r.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, 128, 128);
    return new CanvasTexture(c);
  })();
  const runnerBlob = new Mesh(new PlaneGeometry(0.9, 0.7), new MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false }));
  runnerBlob.rotation.x = -Math.PI / 2;
  scene.add(runnerBlob);
  const TILE = 2.5, NSEG = Math.ceil((FAR + 10) / TILE) + 2, DECK_W = LANE * 3.1;
  const deckM = pbr("brown_planks_03", { repeat: [2, 1.2], roughness: 0.75, color: 14858638 });
  const beamM = pbr("brown_planks_03", { repeat: [0.4, 2], color: 9071184, roughness: 0.85 });
  const ropeM = new MeshPhysicalMaterial({ color: 13215610, roughness: 0.9, sheen: 0.5 });
  const deckG = new RoundedBoxGeometry(DECK_W, 0.16, TILE - 0.04, 2, 0.03), beamG = new BoxGeometry(0.28, 0.4, TILE), postG = new CylinderGeometry(0.07, 0.08, 1.1, 10), ropeG = new CylinderGeometry(0.025, 0.025, TILE, 6);
  const chalkM = new MeshBasicMaterial({ color: 16777215, transparent: true, opacity: 0.16, depthWrite: false }), chalkG = new PlaneGeometry(0.06, TILE * 0.9);
  const PARTS = [
    [deckG, deckM, [[0, -0.08, 0]], 1],
    [beamG, beamM, [[-DECK_W * 0.32, -0.36, 0], [DECK_W * 0.32, -0.36, 0]], 1],
    [postG, beamM, [[-(DECK_W / 2 - 0.08), 0.5, -TILE / 2 + 0.1], [DECK_W / 2 - 0.08, 0.5, -TILE / 2 + 0.1]], 1],
    [ropeG, ropeM, [[-(DECK_W / 2 - 0.08), 0.95, 0], [DECK_W / 2 - 0.08, 0.95, 0]], 2],
    [chalkG, chalkM, [[-LANE * 0.5, 2e-3, 0], [LANE * 0.5, 2e-3, 0]], 3]
  ];
  const partMeshes = PARTS.map(([geo2, mat, offs, rot]) => {
    const m = new InstancedMesh(geo2, mat, NSEG * offs.length);
    m.castShadow = rot !== 3;
    m.receiveShadow = true;
    m.frustumCulled = false;
    scene.add(m);
    return m;
  });
  const _M = new Matrix4(), _Q = [new Quaternion(), new Quaternion(), new Quaternion().setFromEuler(new Euler(Math.PI / 2, 0, 0)), new Quaternion().setFromEuler(new Euler(-Math.PI / 2, 0, 0))];
  const _P = new Vector3(), _S1 = new Vector3(1, 1, 1), _S0 = new Vector3(0, 0, 0);
  function placeBridge() {
    const first = Math.floor((dist - CAM.d - 2) / TILE);
    PARTS.forEach(([, , offs, rot], k) => {
      const m = partMeshes[k];
      let n = 0;
      for (let i = 0; i < NSEG; i++) {
        const d0 = (first + i) * TILE, z = -(d0 + TILE / 2 - dist), on = !inGap(d0 + TILE / 2) && !gapCut(d0, d0 + TILE);
        for (const o of offs) {
          _M.compose(_P.set(o[0], o[1], z + o[2]), _Q[rot], on ? _S1 : _S0);
          m.setMatrixAt(n++, _M);
        }
      }
      m.instanceMatrix.needsUpdate = true;
    });
  }
  const clouds3 = [];
  function stripeTex(a, b, n = 6) {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 32;
    const g = c.getContext("2d");
    for (let i = 0; i < n; i++) {
      g.fillStyle = i % 2 ? b : a;
      g.fillRect(i * 256 / n, 0, 256 / n + 1, 32);
    }
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  }
  const hurdleBarM = new MeshPhysicalMaterial({ map: stripeTex("#f4f2ee", "#1c1c1e", 6), roughness: 0.35, clearcoat: 0.6 });
  const highBarM = new MeshPhysicalMaterial({ map: stripeTex("#f2f0ec", "#d8322a", 8), roughness: 0.4, clearcoat: 0.5 });
  const metalM = new MeshPhysicalMaterial({ color: 12106946, metalness: 1, roughness: 0.3 });
  const stoneM = pbr("rocky_terrain_02", { repeat: [1, 1.6], roughness: 0.9, color: 13218972 });
  const goldM = new MeshPhysicalMaterial({ color: 16763210, metalness: 1, roughness: 0.15, emissive: 16752688, emissiveIntensity: 0.9 });
  const glowTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d"), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, "rgba(255,230,160,0.9)");
    r.addColorStop(0.3, "rgba(255,190,90,0.35)");
    r.addColorStop(1, "rgba(255,170,60,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, 64, 64);
    return new CanvasTexture(c);
  })();
  const orbG = new SphereGeometry(0.2, 24, 16), glowM = new SpriteMaterial({ map: glowTex, blending: AdditiveBlending, depthWrite: false, transparent: true });
  const GEO = {};
  const geo = (k, make) => GEO[k] || (GEO[k] = make());
  function buildObj(o) {
    const g = new Group(), X = o.lane * LANE, add = (geo2, mat, x, y, z) => {
      const m = new Mesh(geo2, mat);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      g.add(m);
      return m;
    };
    if (o.type === "low") {
      for (const s of [-1, 1]) {
        add(geo("leg", () => new BoxGeometry(0.05, 0.6, 0.05)), metalM, s * LANE * 0.4, 0.3, 0);
        add(geo("foot", () => new BoxGeometry(0.05, 0.04, 0.55)), metalM, s * LANE * 0.4, 0.02, 0.22);
      }
      add(geo("hb", () => new RoundedBoxGeometry(LANE * 0.86, 0.14, 0.04, 2, 0.015)), hurdleBarM, 0, 0.6, 0);
    } else if (o.type === "high") {
      for (const s of [-1, 1]) add(geo("hp", () => new CylinderGeometry(0.06, 0.07, 1.75, 10)), beamM, s * LANE * 0.44, 0.875, 0);
      const bar = add(geo("hbar", () => new CylinderGeometry(0.11, 0.11, LANE * 0.95, 16)), highBarM, 0, 1.3, 0);
      bar.rotation.z = Math.PI / 2;
    } else if (o.type === "block") {
      const b = add(geo("st", () => new RoundedBoxGeometry(LANE * 0.78, 2.2, 0.9, 3, 0.08)), stoneM, 0, 1.1, 0);
      b.rotation.y = (Math.random() - 0.5) * 0.12;
    } else if (o.type === "orb") {
      add(orbG, goldM, 0, 0, 0);
      const sp = new Sprite(glowM);
      sp.scale.set(1.1, 1.1, 1);
      g.add(sp);
    } else return null;
    g.position.x = X;
    scene.add(g);
    return g;
  }
  function update3D(now, dt) {
    placeBridge();
    for (const o of objs) {
      if (!o.mesh && !o.done && o.d - dist < FAR) o.mesh = buildObj(o);
      if (o.mesh) {
        const z = o.d - dist;
        o.mesh.position.z = -z;
        o.mesh.position.y = o.type === "orb" ? o.y + Math.sin(now / 250 + o.d) * 0.08 : 0;
        if (o.type === "orb") o.mesh.rotation.y += dt * 2;
        if (o.hit && o.type !== "orb") o.mesh.rotation.z = Math.sin(now / 40) * 0.05;
        if (o.done && o.type === "orb" || z < -CAM.d - 1) {
          scene.remove(o.mesh);
          o.mesh = null;
          o.gone = true;
        }
      }
    }
    const air = player.y > 0.05 || player.falling, ra = air ? 0 : clamp(speed / 13, 0.35, 1);
    runner.root.position.set(player.X, player.y, 0);
    runner.root.rotation.z = (player.X - player.lane * LANE) * -0.08;
    runner.pose({ crouch: air ? 0 : ctl.crouch, lean: ctl.lean * 0.4, tuck: air ? clamp(player.y / 1.2, 0, 1) * 0.7 : 0, run: player.run, runAmt: state2 === "title" ? 0.35 : ra, wing: air && player.y > 0.3 ? 0.4 + 0.6 * player.wing : 0 });
    youG.position.copy(runner.root.position);
    youG.rotation.copy(runner.root.rotation);
    youG.updateMatrixWorld(true);
    youCam.copy(camera.position);
    youG.worldToLocal(youCam);
    youFig.update(now);
    {
      const on = youFig.opacity > 0.3, sub = !youFig.real || window.BodyMovin.mouse;
      for (const c of runner.root.children) c.visible = !on && sub;
    }
    const flying = air && player.y > 0.3;
    wings.forEach((w, i) => {
      w.visible = flying;
      if (!flying) return;
      const sh = runner.shoulders[i], s = i ? 1 : -1;
      const hd = runner.hands[i];
      w.position.set(runner.root.position.x + sh.x, runner.root.position.y + sh.y - 0.02, sh.z + 0.04);
      w.rotation.set(-1.35, 0, Math.atan2(hd.y - sh.y, Math.abs(hd.x - sh.x)) * s);
    });
    runnerBlob.visible = !player.falling && !inGap(dist);
    runnerBlob.position.set(player.X, 0.01, 0);
    const k = clamp(1 - player.y / 3, 0.25, 1);
    runnerBlob.scale.set(k, k, 1);
    runnerBlob.material.opacity = 0.75 * k;
  }
  function gapCut(d0, d1) {
    return gaps.some((g) => d1 > g.d0 + 0.3 && d0 < g.d1 - 0.3);
  }
  function drawCue(o, now) {
    const z = o.d - dist, X = o.lane * LANE, t = z / Math.max(1, speed);
    if (!(t < 2.2 && t > 0.15)) return;
    if ((o.type === "low" || o.type === "high") && o.lane !== 0 && objs.some((q) => q.d === o.d && q.lane === 0 && q.type === o.type)) return;
    if (o.type === "block" && objs.some((q) => q.d === o.d && q.type === "block" && q.lane < o.lane)) return;
    const kind = o.type === "low" ? "jump" : o.type === "high" ? "squat" : o.type === "gap" ? o.len > 8 ? "flap" : "jump" : "move";
    const [x, y, s] = P(o.type === "gap" ? 0 : X, o.type === "block" ? 3 : 2.4, z), fog = clamp(1 - z / FAR, 0, 1);
    icon(kind, x, y, Math.max(U * 0.025, Math.min(U * 0.06, s * 0.45)), clamp(fog * 1.3, 0, 1));
  }
  function burst(x, y, col, n, spd) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283, v = spd * (0.3 + Math.random());
      particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - spd * 0.3, life: 1, col, r: U * (3e-3 + Math.random() * 5e-3) });
    }
  }
  function popup(text, col, size2 = 0.055) {
    popups.length = 0;
    popups.push({ text, col, t: performance.now(), size: size2 });
  }
  let hudBottom = 0;
  function drawParticles(dt) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt * 60;
      p.y += p.vy * dt * 60;
      p.vy += U * 4e-4 * dt * 60;
      p.life -= dt * 1.3;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      const rr = p.r * (0.4 + 0.6 * p.life) * 2.2, gg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rr);
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
    popRect = null;
    for (let i = popups.length - 1; i >= 0; i--) {
      const p = popups[i], k = (now - p.t) / 1100;
      if (k >= 1) {
        popups.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = k < 0.12 ? k / 0.12 : 1 - Math.max(0, (k - 0.6) / 0.4);
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      const L = sideLines(p.text, sidePx(W, H) * (1 + 0.3 * Math.max(0, 0.12 - k) / 0.12), sideW(W, H, 0.22), (px) => "900 ".concat(px, "px ").concat(FONT)), sz = L.px, x0 = W * 0.025;
      const y = Math.max(H * (0.34 - 0.04 * k), hudBottom + sz);
      popRect = { x: x0 / DPR, y: (y - sz * 0.65) / DPR, w: L.w / DPR, h: (L.h + sz * 0.2) / DPR };
      ctx.font = "900 ".concat(sz, "px ").concat(FONT);
      L.lines.forEach((l, n) => {
        const ly = y + n * sz * 1.1;
        ctx.shadowColor = rgba(p.col, 0.9);
        ctx.shadowBlur = sz * 0.4;
        ctx.fillStyle = rgba(p.col, 1);
        ctx.fillText(l, x0, ly);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.fillText(l, x0, ly);
      });
      ctx.restore();
    }
  }
  function txt(s, x, y, sz, col = "#fff", weight = 800, align = "center", glow = null, maxW = W * 0.92) {
    ctx.save();
    ctx.font = "".concat(weight, " ").concat(sz, "px ").concat(FONT);
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    const tw = ctx.measureText(s).width;
    if (tw > maxW) {
      sz *= maxW / tw;
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
  function glass(x, y, w, h) {
    ctx.fillStyle = "rgba(10,12,24,0.55)";
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = DPR;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, h / 2);
    ctx.fill();
    ctx.stroke();
  }
  function panel(x, y, w, h, r = U * 0.025) {
    ctx.fillStyle = "rgba(14,10,44,0.6)";
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
    ctx.strokeStyle = "rgba(200,180,255,0.3)";
    ctx.lineWidth = Math.max(1, U * 2e-3);
    ctx.stroke();
  }
  function step(now, dt, el) {
    const d = difficulty(el), b = boost();
    player.slow = Math.max(0, player.slow - dt * 0.7);
    stepKick *= Math.exp(-dt * 2.5);
    const target = d.base * (1 + 0.65 * b) * (1 - 0.55 * player.slow) + stepKick;
    speed += (target - speed) * Math.min(1, dt * 1.5);
    maxSpeed = Math.max(maxSpeed, speed);
    boostSum += b;
    boostN++;
    beatRate = 0.9 + 0.25 * b;
    dist += speed * dt;
    if (ctl.src !== "none") {
      const s = ctl.side, l = player.lane;
      if (s < -0.33 - (l === -1 ? -0.08 : 0.04)) player.lane = -1;
      else if (s > 0.33 + (l === 1 ? -0.08 : 0.04)) player.lane = 1;
      else if (Math.abs(s) < 0.27) player.lane = 0;
      if (l !== player.lane) SFX.click();
    }
    player.X += (player.lane * LANE - player.X) * Math.min(1, dt * 12);
    const onGround = player.y === 0 && player.vy === 0 && !player.falling;
    if (jumpQueued && now - jumpQueued < 250 && onGround) {
      player.vy = JUMP_V;
      player.y = 0.01;
      jumpQueued = 0;
      flapQueued = 0;
      SFX.jump();
      burst(...P(player.X, 0, 0).slice(0, 2), [255, 220, 160], 14, U * 6e-3);
    }
    if (flapQueued && now - flapQueued < 200 && player.y > 0.05 && !player.falling) {
      flapQueued = 0;
      player.vy = Math.min(7, Math.max(player.vy, 0) + FLAP_V);
      player.wing = 1;
      flaps++;
      SFX.flap();
      const [x, y] = P(player.X, player.y + 1.2, 0);
      burst(x, y, [255, 240, 200], 12, U * 7e-3);
    }
    const overGap = inGap(dist) && player.invuln <= 0;
    if (!onGround) {
      player.vy -= G * (player.vy < 0 && player.wing > 0.2 ? 0.45 : 1) * dt;
      player.y += player.vy * dt;
      if (player.y > 0.05) airTime += dt;
      if (!player.falling && player.y <= 0 && player.vy < 0) {
        if (overGap) player.falling = true;
        else {
          player.y = 0;
          player.vy = 0;
        }
      }
      if (player.falling && player.y < -2.2) {
        player.falling = false;
        player.vy = 9.5;
        player.y = -2.1;
        hits++;
        combo = 0;
        struggle = Math.min(1, struggle + 0.25);
        player.slow = 1;
        player.invuln = 1.8;
        SFX.boing();
        flash2 = { t: now, col: [255, 200, 240] };
        popup("BOING! A CLOUD CAUGHT YOU", [255, 200, 240], 0.045);
        const go = objs.find((o) => o.type === "gap" && o.d <= dist && dist <= o.d + o.len);
        if (go) go.fell = true;
        log.push({ ev: "fell", t: +el.toFixed(1) });
      }
    } else if (overGap) {
      player.falling = true;
      player.vy = -0.5;
      player.y = -1e-3;
    }
    player.wing = Math.max(0, player.wing - dt * 2.5);
    {
      const cad = picRun() ? RS.cadence : BodyMovin.body.cadence;
      player.run += dt * (BodyMovin.live && cad > 60 ? cad / 60 * Math.PI : 6 + speed * 0.55);
    }
    player.invuln = Math.max(0, player.invuln - dt);
    while (nextRow < dist + FAR && el < ROUND - 2) {
      const extra = addRow(nextRow, el);
      nextRow += d.rowGap * d.base + extra + 4 + Math.random() * 4;
    }
    const crouch = ctl.crouch;
    if (crouch > 0.38) crouchAt = now;
    for (const o of objs) {
      if (o.done) continue;
      const z = o.d - dist;
      if (o.type === "orb") {
        if (Math.abs(z) < 0.9 && Math.abs(player.X - o.lane * LANE) < LANE * 0.55 && Math.abs(player.y + 0.9 * (1 - 0.4 * crouch) - o.y) < 1.05) {
          o.done = true;
          orbs++;
          orbChain++;
          score += 10 * mult();
          SFX.orb(orbChain);
          const [x, y] = P(o.lane * LANE, o.y, 0.3);
          burst(x, y, [255, 225, 110], 14, U * 7e-3);
          pulse = Math.min(1, pulse + 0.3);
        } else if (z < -1) {
          o.done = true;
          orbChain = 0;
        }
        continue;
      }
      if (o.type === "gap") {
        if (z < -o.len) {
          o.done = true;
          cleared++;
          combo++;
          if (!o.fell) {
            score += 50 * mult();
            popup(o.len > 8 ? "YOU FLEW IT!  +" + 50 * mult() : "NICE JUMP!", [255, 230, 160]);
          }
        }
        continue;
      }
      const inLane = Math.abs(player.X - o.lane * LANE) < LANE * 0.62;
      if (Math.abs(z) < 0.45 && inLane && !o.hit && player.invuln <= 0) {
        const safe = o.type === "low" ? player.y > 0.4 : o.type === "high" ? now - crouchAt < 400 && player.y < 0.6 : player.y > 2.3;
        if (!safe) {
          o.hit = true;
          if (rows[o.row]) rows[o.row].hit = true;
          hits++;
          combo = 0;
          struggle = Math.min(1, struggle + 0.3);
          player.slow = 1;
          player.invuln = 1.2;
          shake2 = U * 0.025;
          flash2 = { t: now, col: [255, 60, 90] };
          SFX.hit();
          popup(o.type === "low" ? "JUMP!" : o.type === "high" ? "SQUAT!" : "STEP ASIDE!", [255, 130, 140], 0.05);
          log.push({ ev: "hit", type: o.type, t: +el.toFixed(1) });
        }
      }
      if (z < -0.6) {
        o.done = true;
        const rw = rows[o.row];
        if (rw && !rw.credited) {
          rw.credited = true;
          if (!rw.hit) {
            cleared++;
            combo++;
            bestCombo = Math.max(bestCombo, combo);
            struggle = Math.max(0, struggle - 0.06);
            score += 25 * mult();
            SFX.clear(combo);
            if (o.type === "block" && player.y > 2.3) popup("SOARED OVER!  +" + 25 * mult(), [255, 240, 170]);
            if (combo % 6 === 0) popup("×" + mult() + " MULTIPLIER!", [130, 255, 180], 0.05);
          }
        }
      }
    }
    objs = objs.filter((o) => {
      const keep = !o.done || o.d - dist > -CAM.d;
      if (!keep && o.mesh) {
        scene.remove(o.mesh);
        o.mesh = null;
      }
      return keep;
    });
    gaps = gaps.filter((g) => g.d1 - dist > -CAM.d);
    score += speed * dt * mult() * 0.5;
  }
  let hudRects = [], popRect = null;
  let lastT = 0;
  function frame(now) {
    BodyMovin.update(now);
    {
      const BP = BodyMovin;
      if (BP.rawImg && BP.imgAt && BP.imgAt !== rsKey) {
        rsKey = BP.imgAt;
        RS.feed(BP.imgAt / 1e3, BP.rawImg, BP.vis);
      }
      RS.tick(now / 1e3);
    }
    if (lastT && now - lastT > 120) {
      const q = state().quality;
      q.frames = 0;
      q.t0 = now;
    }
    const dt = Math.min(0.05, (now - (lastT || now)) / 1e3);
    lastT = now;
    readControls(now, dt);
    buttons = [];
    pulse *= Math.pow(0.05, dt);
    shake2 *= Math.pow(0.02, dt);
    const el = (now - t0) / 1e3;
    if (state2 === "play") {
      step(now, dt, el);
      if (el >= ROUND) endRound();
    } else {
      speed += (6 - speed) * dt;
      dist += speed * dt;
      player.run += dt * 8;
      player.X *= 0.9;
      player.y = Math.max(0, player.y - dt * 5);
    }
    if (shake2 > 0.5) {
      shake(shake2 / U * 40);
      shake2 = 0;
    }
    if (flash2) {
      flash(new Color(flash2.col[0] / 255, flash2.col[1] / 255, flash2.col[2] / 255), 0.2);
      flash2 = null;
    }
    update3D(now, dt);
    render(dt);
    ctx.clearRect(0, 0, W, H);
    for (const o of objs) if (!o.done && o.type !== "orb") drawCue(o, now);
    drawParticles(dt);
    if (state2 === "title") drawTitle(now);
    else if (state2 === "play") drawHUD(now, el);
    else drawEnd(now);
    drawPopups(now);
    BodyMovin.drawHands(ctx, W, H);
    requestAnimationFrame(frame);
  }
  function drawHUD(now, el) {
    const left = Math.max(0, ROUND - el), row = BodyMovin.uiRow(), gap = Math.max(8, U / DPR * 0.015) * DPR;
    const ph = clamp(U * 0.085, 40 * DPR, 80 * DPR), top0 = (row.bottom - Math.max(38, U / DPR * 0.058)) * DPR;
    const tStr = "".concat(Math.floor(Math.ceil(left) / 60), ":").concat(String(Math.ceil(left) % 60).padStart(2, "0")), sStr = Math.floor(score).toLocaleString();
    ctx.font = "900 ".concat(ph * 0.58, "px ").concat(FONT);
    const sw = Math.max(ctx.measureText("0,000").width, ctx.measureText(sStr).width);
    ctx.font = "800 ".concat(ph * 0.42, "px ").concat(FONT);
    const tw = ctx.measureText("0:00").width;
    const pw = tw + sw + ph * 1.5, px = W / 2 - pw / 2, py = Math.max(top0, BodyMovin.uiBelow(px / DPR) * DPR);
    glass(px, py, pw, ph);
    hudRects = [{ x: px / DPR, y: py / DPR, w: pw / DPR, h: ph / DPR }];
    txt(tStr, px + ph * 0.5 + tw / 2, py + ph / 2, ph * 0.42, left < 10 ? "#ff8a9a" : "#e8e2ff", 800);
    txt(sStr, px + pw - ph * 0.5 - sw / 2, py + ph / 2, ph * 0.58, "#fff", 900, "center", "rgba(255,160,220,0.8)");
    hudBottom = py + ph;
    if (mult() > 1) {
      const mh = ph * 0.7, label = "×" + mult();
      ctx.font = "900 ".concat(mh * 0.5, "px ").concat(FONT);
      const mw = ctx.measureText(label).width + mh * 1.1;
      let mx = Math.min(W - gap, BodyMovin.freeRight ? Math.min(W, BodyMovin.freeRight() * DPR) : W) - mw, my = top0;
      if (mx < px + pw + gap) my = py + ph + gap;
      glass(mx, my, mw, mh);
      hudRects.push({ x: mx / DPR, y: my / DPR, w: mw / DPR, h: mh / DPR });
      txt(label, mx + mw / 2, my + mh / 2, mh * 0.5, "#aaffcc", 900);
      hudBottom = Math.max(hudBottom, my + mh);
    }
    const b = boost(), msg = player.y > 0.3 && !player.falling ? "Flap your arms to fly!" : ctl.src !== "none" && b < 0.15 && el > 3 ? "Jog in place to run!" : null;
    if (msg) {
      const fs = Math.max(16 * DPR, U * 0.042);
      ctx.font = "800 ".concat(fs, "px ").concat(FONT);
      const mw = Math.min(W * 0.9, ctx.measureText(msg).width + fs * 1.6), mh = fs * 1.8, my = H - gap - mh - H * 0.03;
      glass(W / 2 - mw / 2, my, mw, mh);
      hudRects.push({ x: (W / 2 - mw / 2) / DPR, y: my / DPR, w: mw / DPR, h: mh / DPR });
      txt(msg, W / 2, my + mh / 2, fs, "#ffe9a8", 800, "center", null, mw - fs);
    }
  }
  function drawTitle(now) {
    const k = clamp((now - stateAt) / 600, 0, 1);
    ctx.save();
    ctx.globalAlpha = k;
    const bh = clamp(U * 0.14, 50 * DPR, 140 * DPR), bw = Math.min(W * 0.8, Math.max(bh * 4, U * 0.42)), by = H * 0.72 + Math.max(0, (H * 0.86 - H * 0.72 - bh) / 2);
    button("start", "START", W / 2 - bw / 2, by, bw, bh, startRound, now, [255, 190, 120]);
    ctx.restore();
    if (TV && now - stateAt > 2e3 && !window.__tvStarted) {
      window.__tvStarted = true;
      startRound();
    }
  }
  function drawEnd(now) {
    const e = endInfo, k = clamp((now - stateAt) / 500, 0, 1);
    ctx.save();
    ctx.globalAlpha = k;
    const E = BodyMovin.layout.end(W, H, { cy: H * 0.7, side: true });
    const row = BodyMovin.uiRow(), top = Math.max(row.bottom * DPR + 12 * DPR, H * 0.14), room = E.again.y - Math.max(12 * DPR, U * 0.03) - top;
    const wide = W > H * 1.05, pw = wide ? Math.min(W * 0.34, U * 0.8) : Math.min(W * 0.9, U * 1.05), ph = Math.min(room, U * 0.6), px = wide ? Math.max(W * 0.035, 16 * DPR) : W / 2 - pw / 2, py = top + (room - ph) / 2, cxp = px + pw / 2;
    panel(px, py, pw, ph, U * 0.04);
    BodyMovin.uiCover = { x: px / DPR, y: py / DPR, w: pw / DPR, h: ph / DPR };
    txt("YOUR SCORE", cxp, py + ph * 0.19, Math.min(Math.max(16 * DPR, U * 0.04), ph * 0.12), "rgba(230,215,255,0.8)", 800, "center", null, pw * 0.9);
    txt(e.score.toLocaleString(), cxp, py + ph * 0.52, Math.min(U * 0.16, ph * 0.34), "#fff", 900, "center", "rgba(255,150,220,0.9)", pw * 0.9);
    txt(e.newBest ? "New best!" : "Best " + e.best.toLocaleString(), cxp, py + ph * 0.83, Math.min(Math.max(16 * DPR, U * 0.045), ph * 0.12), e.newBest ? "#ffe68a" : "rgba(255,240,255,0.8)", 800, "center", null, pw * 0.9);
    const a = E.again, h = E.home;
    button("again", "PLAY AGAIN", a.x, a.y, a.w, a.h, startRound, now, [255, 190, 120]);
    button("home2", "HOME", h.x, h.y, h.w, h.h, goHome, now, [200, 180, 255]);
    ctx.restore();
  }
  addEventListener("resize", size);
  size();
  const warm = ["low", "high", "block", "orb"].map((type, i) => {
    const m = buildObj({ type, lane: 0, d: 0 });
    m.position.z = -12 - i * 3;
    return m;
  });
  wings.forEach((w) => w.visible = true);
  await renderer.compileAsync(scene, camera).catch(() => {
  });
  render(0.016);
  warm.forEach((m) => scene.remove(m));
  wings.forEach((w) => w.visible = false);
  const ld = document.getElementById("loading");
  ld.style.opacity = 0;
  setTimeout(() => ld.remove(), 700);
  window.__game.quality = () => state().quality;
  BodyMovin.start();
  requestAnimationFrame(frame);
})().catch((e) => setTimeout(() => {
  throw e;
}));
