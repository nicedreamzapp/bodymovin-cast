import {
  environment,
  flash,
  pbr,
  render,
  setup,
  shake,
  state,
  tv
} from "./chunk-5EPBUA75.js";
import "./chunk-CPYHHAA5.js";
import {
  mergeGeometries
} from "./chunk-GEQJXPAR.js";
import "./chunk-UBB4M7UR.js";
import {
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CapsuleGeometry,
  CatmullRomCurve3,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  DynamicDrawUsage,
  Euler,
  ExtrudeGeometry,
  FogExp2,
  FrontSide,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  LatheGeometry,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NormalBlending,
  PlaneGeometry,
  PointLight,
  Points,
  PointsMaterial,
  Quaternion,
  RepeatWrapping,
  SRGBColorSpace,
  ShaderMaterial,
  Shape,
  Skeleton,
  SkinnedMesh,
  SphereGeometry,
  SpotLight,
  Sprite,
  SpriteMaterial,
  TorusGeometry,
  TubeGeometry,
  Uint16BufferAttribute,
  Vector2,
  Vector3
} from "./chunk-4IYDSAYK.js";
import "./chunk-NWIHTO7D.js";

// bmpage:bmpage:airband.html#0
(async () => {
  const BP = window.BodyMovin, QS = new URLSearchParams(location.search), $ = (id) => document.getElementById(id);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, x) => {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };
  let seed = 11;
  const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
  const V3 = (x = 0, y = 0, z = 0) => new Vector3(x, y, z);
  const PR = Math.min(2, devicePixelRatio || 1);
  const AB = "assets/airband/";
  let LIB = { genres: [] };
  try {
    LIB = await (await fetch(AB + "index.json")).json();
  } catch (e) {
    console.warn("airband: song list did not load", e);
  }
  const SONGDATA = {}, SONGBUF = {};
  const songKey = (g, s) => g + "/" + s;
  function loadSongData(g, s) {
    const k = songKey(g, s);
    return SONGDATA[k] || (SONGDATA[k] = fetch(AB + g + "/" + s + ".json").then((r) => {
      if (!r.ok) throw new Error("chart " + r.status);
      return r.json();
    }));
  }
  const SONGBYTES = {};
  function loadSongAudio(g, s) {
    const k = songKey(g, s);
    if (SONGBUF[k]) return SONGBUF[k];
    const bytes = SONGBYTES[k] || (SONGBYTES[k] = loadSongData(g, s).then((d) => fetch(AB + g + "/" + d.mp3)).then((r) => {
      if (!r.ok) throw new Error("mp3 " + r.status);
      return r.arrayBuffer();
    }));
    if (!ac) return bytes.then(() => null);
    return SONGBUF[k] = bytes.then((b) => new Promise((ok, no) => ac.decodeAudioData(b.slice(0), ok, no)));
  }
  function buildChart(data, inst) {
    const src = data.charts && data.charts[inst] || [];
    const cands2 = src.map((e) => ({ t: e.t, tier: e.tier, gold: !!e.gold, lane: e.lane, pad: e.pad, pitch: e.pitch || 0, evs: [], shown: false, decided: false, res: null }));
    if (inst === "vocals" && cands2.length) {
      const ps = cands2.map((c) => c.pitch).sort((a, b) => a - b), q = (f) => ps[Math.min(ps.length - 1, Math.floor(f * ps.length))];
      const lo = q(0.1), hi = q(0.9);
      let prev = "", cyc = 0;
      for (const c of cands2) {
        const rel = (c.pitch - lo) / Math.max(1, hi - lo);
        const opts = rel > 0.66 ? ["V", "UPL", "UPR"] : rel > 0.33 ? ["OUT", "PTR", "PTL"] : ["MIC", "LOW"];
        let p = opts[cyc++ % opts.length];
        if (p === prev) p = opts[cyc++ % opts.length];
        c.pose = p;
        prev = p;
      }
    }
    return cands2;
  }
  function songTiming(d) {
    const beats = d.beats, off = beats.reduce((bi, t, i) => Math.abs(t - d.firstDownbeat) < Math.abs(beats[bi] - d.firstDownbeat) ? i : bi, 0);
    return { beats, off, beat: d.beat, bar: d.beat * 4, dur: d.dur, end: d.end, sections: d.sections || [], lyrics: d.lyrics || [] };
  }
  function beatAt(t) {
    const b = song.beats;
    if (!b.length || t < b[0]) return [-1, ((t - (b[0] || 0)) / song.beat % 1 + 1) % 1];
    let lo = 0, hi = b.length - 1;
    if (t >= b[hi]) {
      const k = Math.floor((t - b[hi]) / song.beat);
      return [hi + k, (t - b[hi]) / song.beat % 1];
    }
    while (hi - lo > 1) {
      const m = lo + hi >> 1;
      if (b[m] <= t) lo = m;
      else hi = m;
    }
    return [lo, (t - b[lo]) / Math.max(1e-3, b[lo + 1] - b[lo])];
  }
  const POSES = {
    V: { name: "BOTH HANDS UP", L: [0.32, 0.21], R: [0.68, 0.21] },
    UPL: { name: "ONE HAND UP", L: [0.38, 0.2], R: null },
    UPR: { name: "ONE HAND UP", L: null, R: [0.62, 0.2] },
    OUT: { name: "ARMS OUT WIDE", L: [0.16, 0.4], R: [0.84, 0.4] },
    PTL: { name: "POINT THIS WAY", L: [0.17, 0.28], R: null },
    PTR: { name: "POINT THIS WAY", L: null, R: [0.83, 0.28] },
    MIC: { name: "HANDS TOGETHER", L: [0.44, 0.36], R: [0.56, 0.36] },
    LOW: { name: "HANDS DOWN LOW", L: [0.26, 0.72], R: [0.74, 0.72] }
  };
  const LANES = [{ y: 0.78, c: "#ff3c6e", n: "LOW" }, { y: 0.52, c: "#ffc23c", n: "MID" }, { y: 0.26, c: "#3cd2ff", n: "HIGH" }];
  const LANE_X = 0.19;
  const PADS = { HH: { x: 0.24, y: 0.33, c: "#7dff8a", n: "HAT" }, SN: { x: 0.37, y: 0.6, c: "#ff3c6e", n: "SNARE" }, TM: { x: 0.63, y: 0.6, c: "#3cd2ff", n: "TOM" }, CY: { x: 0.76, y: 0.33, c: "#ffc23c", n: "CYMBAL" }, JUMP: { x: 0.5, y: 0.9, c: "#c77dff", n: "JUMP!" } };
  const DRUM_R = 0.11, DRUM_SQ = 0.62;
  const RING_R = 0.13;
  const STRUM_R = 0.09;
  const STRUM_X = 0.66, STRUM_Y = 0.68;
  const HAND_SZ = 0.075;
  function handPts(h) {
    const s = Math.min(innerWidth, innerHeight), x = h.x * innerWidth, y = h.y * innerHeight, z = HAND_SZ * s;
    return [[x, y], [x, y - z * 0.45], [x, y - z * 0.9], [x - z * 0.4, y], [x + z * 0.4, y]];
  }
  function touches(h, cx, cy, rx, ry) {
    if (!h || !h.seen) return false;
    const X = cx * innerWidth, Y2 = cy * innerHeight;
    return handPts(h).some(([x, y]) => ((x - X) / rx) ** 2 + ((y - Y2) / ry) ** 2 <= 1);
  }
  function sweptThrough(h, prev, cx, cy, rx, ry) {
    if (!h.seen || !prev) return false;
    const X = cx * innerWidth, Y2 = cy * innerHeight, x1 = h.x * innerWidth, y1 = h.y * innerHeight;
    for (let k = 1; k <= 6; k++) {
      const u = k / 6, x = prev[0] + (x1 - prev[0]) * u, y = prev[1] + (y1 - prev[1]) * u;
      if (((x - X) / rx) ** 2 + ((y - Y2) / ry) ** 2 <= 1) return true;
    }
    return false;
  }
  let ac = null, master, music, musicLP, analyser, reverb, rev, noiseBuf, B = {}, crowdG, crowdG2, crowdF, fftData, songSrc = null;
  function makeIR(sec) {
    const n = ac.sampleRate * sec, b = ac.createBuffer(2, n, ac.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3.2);
    }
    return b;
  }
  function audioInit() {
    if (ac) {
      if (ac.state !== "running") ac.resume().catch(() => {
      });
      return;
    }
    try {
      ac = new (window.AudioContext || window.webkitAudioContext)({ latencyHint: "interactive" });
      master = ac.createGain();
      master.gain.value = QS.has("mute") ? 0 : 0.9;
      const comp = ac.createDynamicsCompressor();
      comp.threshold.value = -4;
      comp.ratio.value = 6;
      comp.knee.value = 4;
      comp.attack.value = 3e-3;
      comp.release.value = 0.2;
      master.connect(comp);
      comp.connect(ac.destination);
      music = ac.createGain();
      music.gain.value = 1;
      BodyMovin.onMusic((off) => {
        music.gain.setTargetAtTime(off ? 0 : 1, ac.currentTime, 0.03);
      });
      musicLP = ac.createBiquadFilter();
      musicLP.type = "lowpass";
      musicLP.frequency.value = 2e4;
      musicLP.Q.value = 0.8;
      music.connect(musicLP);
      musicLP.connect(master);
      analyser = ac.createAnalyser();
      analyser.fftSize = 128;
      musicLP.connect(analyser);
      fftData = new Uint8Array(analyser.frequencyBinCount);
      reverb = ac.createConvolver();
      reverb.buffer = makeIR(2.6);
      rev = ac.createGain();
      rev.gain.value = 0.32;
      rev.connect(reverb);
      reverb.connect(master);
      noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
      const nd = noiseBuf.getChannelData(0);
      for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
      for (const [k, g, s] of [["drums", 0.55, 0.12], ["gtr", 0.5, 0.25], ["vox", 0.6, 0.45], ["sfx", 0.8, 0.2]]) {
        B[k] = ac.createGain();
        B[k].gain.value = g;
        B[k].connect(master);
        if (s) {
          const sg = ac.createGain();
          sg.gain.value = s;
          B[k].connect(sg);
          sg.connect(rev);
        }
      }
      const cs = ac.createBufferSource();
      cs.buffer = noiseBuf;
      cs.loop = true;
      crowdF = ac.createBiquadFilter();
      crowdF.type = "bandpass";
      crowdF.frequency.value = 900;
      crowdF.Q.value = 0.55;
      crowdG = ac.createGain();
      crowdG.gain.value = 0;
      cs.connect(crowdF);
      crowdF.connect(crowdG);
      crowdG.connect(master);
      cs.start();
      const cs2 = ac.createBufferSource();
      cs2.buffer = noiseBuf;
      cs2.loop = true;
      cs2.playbackRate.value = 0.7;
      const f2 = ac.createBiquadFilter();
      f2.type = "bandpass";
      f2.frequency.value = 2400;
      f2.Q.value = 1.4;
      crowdG2 = ac.createGain();
      crowdG2.gain.value = 0;
      cs2.connect(f2);
      f2.connect(crowdG2);
      crowdG2.connect(master);
      cs2.start(0, 0.7);
    } catch (e) {
      console.warn(e);
      ac = null;
    }
  }
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
  function envG(t, a, peak, d, dest) {
    const g = ac.createGain();
    g.gain.setValueAtTime(1e-4, t);
    g.gain.exponentialRampToValueAtTime(Math.max(2e-4, peak), t + a);
    g.gain.exponentialRampToValueAtTime(1e-4, t + a + d);
    g.connect(dest);
    return g;
  }
  function osc(type, f, t, len, g, f2) {
    const o = ac.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + len * 0.6);
    o.connect(g);
    o.start(t);
    o.stop(t + len + 0.05);
    return o;
  }
  function nz(t, len, v, type, f, q, dest, a = 1e-3, rate = 1) {
    const n = ac.createBufferSource();
    n.buffer = noiseBuf;
    n.playbackRate.value = rate;
    const fl = ac.createBiquadFilter();
    fl.type = type;
    fl.frequency.value = f;
    fl.Q.value = q;
    n.connect(fl);
    fl.connect(envG(t, a, v, len, dest));
    n.start(t, Math.random() * 1.5);
    n.stop(t + len + a + 0.05);
  }
  const DR = {
    stick: (t, v) => {
      osc("square", 2400, t, 0.03, envG(t, 1e-3, 0.25 * v, 0.03, B.drums));
      nz(t, 0.02, 0.4 * v, "highpass", 4e3, 1, B.drums);
    },
    kick: (t, v) => {
      osc("sine", 155, t, 0.4, envG(t, 2e-3, 1.1 * v, 0.4, B.drums), 42);
      nz(t, 0.012, 0.35 * v, "highpass", 2500, 0.7, B.drums);
    },
    snare: (t, v) => {
      nz(t, 0.19, 0.75 * v, "bandpass", 1900, 0.7, B.drums);
      nz(t, 0.06, 0.35 * v, "highpass", 6e3, 0.7, B.drums);
      osc("triangle", 195, t, 0.1, envG(t, 1e-3, 0.45 * v, 0.1, B.drums), 150);
    },
    clap: (t, v) => {
      for (let k = 0; k < 3; k++) nz(t + k * 0.011, 0.02, 0.5 * v, "bandpass", 1300, 1.2, B.drums);
      nz(t + 0.03, 0.16, 0.45 * v, "bandpass", 1200, 0.9, B.drums);
    },
    hat: (t, v) => nz(t, 0.035, 0.32 * v, "highpass", 8200, 0.8, B.drums),
    ohat: (t, v) => nz(t, 0.3, 0.32 * v, "highpass", 7600, 0.8, B.drums, 2e-3),
    ride: (t, v) => {
      nz(t, 0.5, 0.18 * v, "bandpass", 9e3, 1.5, B.drums);
      osc("triangle", 3200, t, 0.4, envG(t, 1e-3, 0.05 * v, 0.4, B.drums));
    },
    tom: (t, v, p = 1) => {
      osc("sine", 190 * p, t, 0.32, envG(t, 2e-3, 0.85 * v, 0.32, B.drums), 105 * p);
      nz(t, 0.05, 0.2 * v, "bandpass", 900, 1, B.drums);
    },
    crash: (t, v) => {
      nz(t, 1.7, 0.42 * v, "highpass", 4300, 0.6, B.drums, 2e-3);
      const g = envG(t, 2e-3, 0.06 * v, 1.1, B.drums);
      const bp = ac.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 7800;
      bp.Q.value = 0.6;
      bp.connect(g);
      [205, 284, 304, 370, 523, 540].forEach((f) => osc("square", f * 1.9, t, 1.1, bp));
    }
  };
  const VOWELS = { a: [800, 1150, 2900], o: [480, 820, 2830], e: [530, 1840, 2480], u: [350, 640, 2700], i: [300, 2100, 2950] };
  function voice(t, m, d, v, vw = "a", dest = B.vox, det = 0) {
    const f = mtof(m) * Math.pow(2, det / 1200), F = VOWELS[vw] || VOWELS.a;
    const g = ac.createGain();
    g.gain.setValueAtTime(1e-4, t);
    g.gain.linearRampToValueAtTime(0.9 * v, t + 0.04);
    g.gain.setValueAtTime(0.9 * v, t + Math.max(0.05, d - 0.08));
    g.gain.linearRampToValueAtTime(1e-4, t + d + 0.06);
    g.connect(dest);
    const src = ac.createGain();
    src.gain.value = 1;
    [[F[0], 1, 9], [F[1], 0.5, 11], [F[2], 0.22, 13]].forEach(([ff, a, q]) => {
      const bp = ac.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = ff;
      bp.Q.value = q;
      const gg = ac.createGain();
      gg.gain.value = a * 6;
      src.connect(bp);
      bp.connect(gg);
      gg.connect(g);
    });
    const lfo = ac.createOscillator(), lg = ac.createGain();
    lfo.frequency.value = 5.4;
    lg.gain.setValueAtTime(0, t);
    lg.gain.linearRampToValueAtTime(f * 0.012, t + Math.min(0.5, d));
    lfo.connect(lg);
    for (const dt of [-6, 6]) {
      const o = ac.createOscillator();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(f * 0.97, t);
      o.frequency.exponentialRampToValueAtTime(f, t + 0.07);
      o.detune.value = dt;
      lg.connect(o.frequency);
      o.connect(src);
      o.start(t);
      o.stop(t + d + 0.1);
    }
    lfo.start(t);
    lfo.stop(t + d + 0.1);
  }
  const sfx = {
    press: () => {
      if (!ac) return;
      const t = ac.currentTime;
      osc("triangle", 660, t, 0.12, envG(t, 3e-3, 0.15, 0.12, B.sfx), 990);
    },
    select: () => {
      if (!ac) return;
      const t = ac.currentTime;
      osc("triangle", 880, t, 0.08, envG(t, 3e-3, 0.1, 0.08, B.sfx));
    },
    dud: () => {
      if (!ac) return;
      const t = ac.currentTime;
      nz(t, 0.06, 0.12, "bandpass", 700, 2, B.sfx);
      osc("sawtooth", 82, t, 0.08, envG(t, 2e-3, 0.06, 0.08, B.sfx));
    },
    cheer: (k = 1) => {
      if (!ac) return;
      const t = ac.currentTime;
      for (let i = 0; i < 8 * k; i++) {
        const tt = t + Math.random() * 1.2;
        voice(tt, 62 + Math.random() * 14, 0.5, 0.05 * k, "o", master, Math.random() * 40);
      }
    },
    pyro: () => {
      if (!ac) return;
      const t = ac.currentTime;
      nz(t, 0.9, 0.7, "lowpass", 450, 0.8, B.sfx, 0.01);
      osc("sine", 75, t, 0.7, envG(t, 5e-3, 0.6, 0.7, B.sfx), 38);
    },
    star: () => {
      if (!ac) return;
      const t = ac.currentTime;
      nz(t, 1.2, 0.35, "bandpass", 1800, 0.5, B.sfx, 0.9);
      osc("sawtooth", 110, t, 1.4, envG(t, 0.6, 0.12, 0.8, B.sfx), 440);
      osc("sine", 55, t + 1, 1, envG(t + 1, 5e-3, 0.8, 1, B.sfx), 30);
      musicLP.frequency.cancelScheduledValues(t);
      musicLP.frequency.setValueAtTime(2e4, t);
      musicLP.frequency.exponentialRampToValueAtTime(650, t + 0.25);
      musicLP.frequency.exponentialRampToValueAtTime(2e4, t + 1.6);
    },
    chant: () => {
      if (!ac) return;
      const t = ac.currentTime;
      for (let k = 0; k < 14; k++) {
        voice(t, 57 + k % 3 * 0.2, 0.32, 0.05, "e", master, (Math.random() - 0.5) * 60);
        voice(t + 0.42, 55, 0.55, 0.05, "o", master, (Math.random() - 0.5) * 60);
      }
      nz(t, 1, 0.12, "bandpass", 1200, 0.6, master, 0.05);
    }
  };
  const RS = setup($("gl"), { fov: 42, far: 400 });
  const { scene, camera, renderer } = RS;
  renderer.toneMappingExposure = 1;
  await environment(scene, renderer, "circus_arena", { background: true, intensity: 0.12, rotation: 0 });
  scene.backgroundIntensity = 0.16;
  state().sky && state().sky.material.color.setRGB(0.82, 0.86, 1);
  const PRE = new Set(scene.children), TV = tv;
  scene.fog = new FogExp2(329226, 85e-4);
  const DECK = 1.3, tier = () => state().quality.tier;
  const NODIFF = /* @__PURE__ */ new Set(["fabric_pattern_07", "leather_red_02"]);
  const pbr2 = (n, o) => {
    const m = pbr(n, o);
    if (NODIFF.has(n) || o && o.nodiff) {
      m.map = null;
      m.needsUpdate = true;
    }
    return m;
  };
  const cvTex = (w, h, draw, srgb = true, rep = [1, 1]) => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d"), w, h);
    const t = new CanvasTexture(c);
    if (srgb) t.colorSpace = SRGBColorSpace;
    t.wrapS = t.wrapT = RepeatWrapping;
    t.repeat.set(...rep);
    t.anisotropy = 8;
    return t;
  };
  const STATIC = new Group();
  scene.add(STATIC);
  const box = (w, h, d, mat, x = 0, y = 0, z = 0, parent) => {
    const m = new Mesh(new BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    m.castShadow = m.receiveShadow = true;
    (parent || STATIC).add(m);
    return m;
  };
  const MEMO = {}, memo = (k, f) => MEMO[k] || (MEMO[k] = f());
  const _bm = new Matrix4();
  function bake(root, keep = (o) => !!o.userData.keep) {
    root.updateMatrixWorld(true);
    const inv = root.matrixWorld.clone().invert(), groups = /* @__PURE__ */ new Map(), kill = [];
    root.traverse((o) => {
      if (!o.isMesh || o.isInstancedMesh || Array.isArray(o.material) || o.material.transparent && o.material.blending === AdditiveBlending) return;
      for (let p = o; p && p !== root; p = p.parent) if (keep(p)) return;
      const g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
      g.applyMatrix4(_bm.multiplyMatrices(inv, o.matrixWorld));
      for (const k of Object.keys(g.attributes)) if (!["position", "normal", "uv"].includes(k)) g.deleteAttribute(k);
      if (!g.attributes.uv || !g.attributes.normal) return;
      const key2 = o.material.uuid + (o.castShadow ? "c" : "") + (o.receiveShadow ? "r" : "");
      if (!groups.has(key2)) groups.set(key2, { mat: o.material, geos: [], cast: o.castShadow, recv: o.receiveShadow });
      groups.get(key2).geos.push(g);
      kill.push(o);
    });
    for (const o of kill) o.parent.remove(o);
    for (const { mat, geos, cast, recv } of groups.values()) {
      const m = new Mesh(mergeGeometries(geos), mat);
      m.castShadow = cast;
      m.receiveShadow = recv;
      root.add(m);
    }
  }
  const cyl = (r0, r1, h, mat, seg = 16) => {
    const m = new Mesh(new CylinderGeometry(r0, r1, h, seg), mat);
    m.castShadow = true;
    return m;
  };
  const metal = pbr2("metal_plate", { repeat: [1, 1], color: 5921890, metalness: 0.9, roughness: 0.42 });
  const blackMetal = new MeshStandardMaterial({ color: 1315863, metalness: 0.55, roughness: 0.48 });
  const chrome = new MeshStandardMaterial({ color: 15263980, metalness: 1, roughness: 0.12, envMapIntensity: 1.4 });
  const alu = new MeshStandardMaterial({ color: 11843776, metalness: 1, roughness: 0.32 });
  const rubber = new MeshStandardMaterial({ color: 723724, roughness: 0.62 });
  const cabPaint = pbr2("black_painted_planks", { repeat: [0.6, 0.6], color: 6974066, roughness: 0.88, normalScale: 0.6 });
  const grilleMap = cvTex(256, 256, (g, w, h) => {
    g.fillStyle = "#3a3b3f";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#050506";
    for (let y = 0, r = 0; y < h + 8; y += 11, r++) for (let x = r % 2 * 6.35; x < w + 8; x += 12.7) {
      g.beginPath();
      g.arc(x, y, 4.2, 0, 6.283);
      g.fill();
    }
  });
  const grilleMat = (rx, ry) => {
    const t = grilleMap.clone();
    t.repeat.set(rx, ry);
    t.needsUpdate = true;
    return new MeshStandardMaterial({ map: t, bumpMap: t, bumpScale: 0.6, metalness: 0.5, roughness: 0.55, color: 10132130 });
  };
  const clothMat = pbr2("hessian_230", { repeat: [3, 3], color: 2762532, roughness: 1, normalScale: 1.4 });
  const tolex = pbr2("fabric_leather_02", { repeat: [2, 2], color: 1841948, roughness: 0.5, normalScale: 1.3, nodiff: true });
  {
    const fm = pbr2("concrete_floor_02", { repeat: [24, 24], color: 4209732, roughness: 0.85 });
    const f = new Mesh(new PlaneGeometry(120, 120), fm);
    f.rotation.x = -Math.PI / 2;
    f.receiveShadow = true;
    scene.add(f);
  }
  const deckMat = pbr2("black_painted_planks", { repeat: [5, 3], color: 7368822, roughness: 0.78, normalScale: 0.9, envMapIntensity: 0.55 });
  const deckSide = pbr2("black_painted_planks", { repeat: [6, 0.6], color: 5263448, roughness: 0.8 });
  const deck = new Mesh(new BoxGeometry(17, DECK, 8), [deckSide, deckSide, deckMat, deckSide, deckSide, deckSide]);
  deck.position.set(0, DECK / 2, -2.2);
  deck.receiveShadow = true;
  deck.castShadow = true;
  scene.add(deck);
  const skirtMat = pbr2("fabric_pattern_07", { repeat: [40, 2], color: 723469, roughness: 1, normalScale: 1.5 });
  {
    const sk = new Mesh(new PlaneGeometry(17, DECK - 0.06), skirtMat);
    sk.position.set(0, (DECK - 0.06) / 2, 1.815);
    sk.receiveShadow = true;
    STATIC.add(sk);
  }
  box(17.02, 0.05, 0.07, alu, 0, DECK - 0.02, 1.8);
  {
    const tape = new MeshStandardMaterial({ color: 7236190, roughness: 0.8 });
    for (let x = -8; x <= 8; x += 1.6) {
      const t = new Mesh(new PlaneGeometry(0.42, 0.05), tape);
      t.rotation.x = -Math.PI / 2;
      t.position.set(x + (rnd() - 0.5) * 0.3, DECK + 2e-3, 1.7);
      t.receiveShadow = true;
      STATIC.add(t);
    }
    for (const [x, z] of [[-4.2, -1.6], [4.2, -1.6], [0, -0.2], [-1.4, 0.3], [1.6, 0.2]]) for (const r of [0, Math.PI / 2]) {
      const t = new Mesh(new PlaneGeometry(0.16, 0.035), tape);
      t.rotation.set(-Math.PI / 2, 0, r);
      t.position.set(x, DECK + 2e-3, z);
      STATIC.add(t);
    }
  }
  {
    const g = new Group();
    const rail = new Mesh(new CylinderGeometry(0.035, 0.035, 20, 10), alu);
    rail.rotation.z = Math.PI / 2;
    rail.position.y = 1.15;
    g.add(rail);
    const panel = new Mesh(new BoxGeometry(20, 1.05, 0.03), new MeshStandardMaterial({ color: 1710878, metalness: 0.25, roughness: 0.72 }));
    for (let x = -9.5; x <= 9.5; x += 1) {
      const p = new Mesh(new BoxGeometry(0.05, 1.15, 0.05), alu);
      p.position.set(x, 0.58, 0);
      g.add(p);
      const toe = new Mesh(new BoxGeometry(0.9, 0.02, 0.7), metal);
      toe.position.set(x + 0.5, 0.01, 0.35);
      g.add(toe);
    }
    g.traverse((o) => {
      if (o.isMesh) o.receiveShadow = true;
    });
    g.position.set(0, 0, 3.1);
    STATIC.add(g);
  }
  function speakerCab(w, h, d, { gx = 3, gy = 2, logo = true } = {}) {
    const g = new Group();
    box(w, h, d, cabPaint, 0, 0, 0, g);
    const gr = new Mesh(new PlaneGeometry(w * 0.94, h * 0.9), memo("gr" + gx + "x" + gy, () => grilleMat(gx, gy)));
    gr.position.z = d / 2 + 3e-3;
    g.add(gr);
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      const c = box(0.05, 0.05, 0.05, blackMetal, sx * (w / 2 - 0.015), sy * (h / 2 - 0.015), d / 2 - 0.015, g);
    }
    if (logo) {
      const l = box(w * 0.18, h * 0.05, 5e-3, alu, w * 0.32, -h * 0.4, d / 2 + 6e-3, g);
      l.castShadow = false;
    }
    return g;
  }
  for (const sx of [-1, 1]) {
    for (let k = 0; k < 2; k++) for (let j = 0; j < 2; j++) {
      const s = speakerCab(1.15, 0.62, 0.85, { gx: 4, gy: 2 });
      s.position.set(sx * (9.6 + j * 1.18), 0.31 + k * 0.63, 2);
      s.rotation.y = -sx * 0.18;
      STATIC.add(s);
    }
    const ar = new Group();
    ar.position.set(sx * 10.4, 10.2, 1.4);
    STATIC.add(ar);
    const bump = box(1.4, 0.08, 0.9, blackMetal, 0, 0.1, 0, ar);
    for (let k = 0; k < 10; k++) {
      const c = speakerCab(1.3, 0.34, 0.72, { gx: 5, gy: 1.3, logo: k === 9 });
      c.position.set(0, -0.2 - k * 0.355 - k * k * 4e-3, 0.02 * k * k * 0.12);
      c.rotation.x = k * k * 6e-3;
      ar.add(c);
      for (const ex of [-1, 1]) box(0.03, 0.36, 0.1, alu, ex * 0.66, c.position.y, c.position.z - 0.25, ar);
    }
    for (const ex of [-0.6, 0.6]) {
      const ch = cyl(8e-3, 8e-3, 6, alu, 5);
      ch.position.set(ex, 3.2, 0);
      ar.add(ch);
    }
    const fill = speakerCab(0.7, 1.1, 0.6, { gx: 2, gy: 3 });
    fill.position.set(sx * 7.9, DECK + 0.55, 0.9);
    fill.rotation.y = -sx * 0.5;
    STATIC.add(fill);
  }
  function wedge() {
    const g = new Group(), sh = new Shape();
    sh.moveTo(-0.24, 0);
    sh.lineTo(0.26, 0);
    sh.lineTo(0.26, 0.14);
    sh.lineTo(-0.12, 0.4);
    sh.lineTo(-0.24, 0.4);
    sh.closePath();
    const geo = new ExtrudeGeometry(sh, { depth: 0.72, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2 });
    geo.translate(0, 0, -0.36);
    geo.rotateY(Math.PI / 2);
    const m = new Mesh(geo, cabPaint);
    m.castShadow = m.receiveShadow = true;
    g.add(m);
    const n = V3(0, 0.38, -0.26).normalize(), gr = new Mesh(new PlaneGeometry(0.7, 0.42), memo("wgr", () => grilleMat(3, 1.8)));
    gr.quaternion.setFromUnitVectors(V3(0, 0, 1), n);
    gr.position.set(0, 0.27, -0.07).addScaledVector(n, 0.016);
    g.add(gr);
    return g;
  }
  for (const x of [-4.5, -1.2, 1.2, 4.5]) {
    const w = wedge();
    w.position.set(x, DECK, 1.3);
    w.rotation.y = x * 0.03;
    STATIC.add(w);
  }
  const ampPanel = cvTex(512, 64, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, "#c9b37a");
    gr.addColorStop(1, "#8c7748");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
    for (let k = 0; k < 11; k++) {
      const x = 70 + k * 38;
      g.fillStyle = "#111";
      g.beginPath();
      g.arc(x, 32, 12, 0, 6.283);
      g.fill();
      g.strokeStyle = "#d8d8d8";
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(x, 32);
      g.lineTo(x + 7 * Math.cos(k), 32 - 9);
      g.stroke();
    }
    g.fillStyle = "#c01818";
    g.beginPath();
    g.arc(30, 32, 7, 0, 6.283);
    g.fill();
  });
  const ampPanelMat = new MeshStandardMaterial({ map: ampPanel, metalness: 0.6, roughness: 0.35, emissive: 2759168, emissiveIntensity: 0.4 });
  const piping = new MeshStandardMaterial({ color: 14210248, roughness: 0.4 });
  function ampStack(tall) {
    const g = new Group(), W = 0.78, H = tall ? 0.78 : 0.7, D = 0.38;
    for (let k = 0; k < (tall ? 2 : 1); k++) {
      const y = H / 2 + k * (H + 5e-3);
      box(W, H, D, tolex, 0, y, 0, g);
      const cl = new Mesh(new PlaneGeometry(W - 0.08, H - 0.08), clothMat);
      cl.position.set(0, y, D / 2 + 2e-3);
      g.add(cl);
      for (const [px, py, pw, ph] of [[0, y + H / 2 - 0.04, W - 0.06, 0.012], [0, y - H / 2 + 0.04, W - 0.06, 0.012], [-W / 2 + 0.04, y, 0.012, H - 0.06], [W / 2 - 0.04, y, 0.012, H - 0.06]]) box(pw, ph, 6e-3, piping, px, py, D / 2 + 4e-3, g);
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) box(0.06, 0.06, 0.06, chrome, sx * (W / 2 - 0.02), y + sy * (H / 2 - 0.02), D / 2 - 0.02, g);
    }
    const hy = (tall ? 2 : 1) * (H + 5e-3) + 0.13;
    box(W, 0.26, D * 0.85, tolex, 0, hy, -0.02, g);
    const p = new Mesh(new PlaneGeometry(W - 0.08, 0.1), ampPanelMat);
    p.position.set(0, hy, D * 0.425 - 0.015);
    g.add(p);
    const handle = box(0.24, 0.025, 0.05, rubber, 0, hy + 0.14, -0.02, g);
    return g;
  }
  for (const [x, tall] of [[-5.8, true], [-5, true], [5, true], [5.8, false]]) {
    const a = ampStack(tall);
    a.position.set(x, DECK, -3.1);
    a.rotation.y = -x * 0.02;
    STATIC.add(a);
  }
  const carpet = pbr2("rubber_tiles", { repeat: [3, 2], color: 2761254, roughness: 0.95, nodiff: true });
  const riser = new Mesh(new BoxGeometry(4.2, 0.45, 2.6), [deckSide, deckSide, carpet, deckSide, skirtMat, deckSide]);
  riser.position.set(0, DECK + 0.225, -3.6);
  riser.castShadow = riser.receiveShadow = true;
  scene.add(riser);
  {
    const parts = [], P = (x, z) => V3(x, DECK + 0.012, z);
    const runs = [
      [P(-5.6, -2.9), P(-5.2, -2.2), P(-4.6, -1.7), P(-4, -1.5)],
      [P(5.2, -2.9), P(4.8, -2.3), P(4.3, -1.8)],
      [P(-4.5, 1.2), P(-4.1, 0.4), P(-3.3, -0.6), P(-2.2, -2), P(-1.9, -2.6)],
      [P(4.5, 1.2), P(4.2, 0.3), P(3, -0.9), P(2.3, -2.3)],
      [P(-1.2, 1.2), P(-0.9, 0.5), P(-0.2, -0.4), P(0.5, -1.4), P(1.6, -2.4)],
      [P(1.2, 1.2), P(0.9, 0.6), P(0.2, 0.1), P(0.05, -0.3)],
      [P(-7.9, 0.8), P(-7.2, -0.6), P(-6.4, -2.4), P(-6.5, -3.4)],
      [P(7.9, 0.8), P(7.3, -0.8), P(6.6, -2.6)],
      [P(-1.9, -2.3), P(-0.3, -2.25), P(1.6, -2.3), P(3, -2.5), P(4.8, -2.8)]
    ];
    for (const r of runs) {
      for (const p of r) {
        p.x += (rnd() - 0.5) * 0.12;
        p.z += (rnd() - 0.5) * 0.12;
      }
      parts.push(new TubeGeometry(new CatmullRomCurve3(r), r.length * 14, 0.012, 6));
    }
    const cab = new Mesh(mergeGeometries(parts), rubber);
    cab.receiveShadow = true;
    STATIC.add(cab);
  }
  function trussGeo(len) {
    const parts = [], r = 0.025, h = 0.3;
    for (const [y, z] of [[0, 0], [h, 0], [0, h], [h, h]]) {
      const c = new CylinderGeometry(r, r, len, 8);
      c.rotateZ(Math.PI / 2);
      c.translate(0, y - h / 2, z - h / 2);
      parts.push(c);
    }
    for (let x = -len / 2; x < len / 2; x += 0.3) for (const [y0, z0, y1, z1] of [[0, 0, h, 0], [0, h, h, h], [0, 0, 0, h], [h, 0, h, h]]) {
      const d = new CylinderGeometry(0.012, 0.012, Math.hypot(0.3, h), 4);
      d.rotateZ(Math.atan2(0.3, h) * (y1 - y0 || 1));
      if (z1 !== z0) {
        d.rotateX(Math.PI / 2);
      }
      d.translate(x + 0.15, (y0 + y1) / 2 - h / 2, (z0 + z1) / 2 - h / 2);
      parts.push(d);
    }
    return mergeGeometries(parts);
  }
  const trussMat = new MeshStandardMaterial({ color: 11054260, metalness: 1, roughness: 0.3 });
  const tFront = new Mesh(trussGeo(18), trussMat);
  tFront.position.set(0, 9, 0.6);
  scene.add(tFront);
  const tBack = new Mesh(trussGeo(18), trussMat);
  tBack.position.set(0, 9.4, -4.4);
  scene.add(tBack);
  for (const x of [-8.6, 8.6]) {
    const tw = new Mesh(trussGeo(8.2), trussMat);
    tw.rotation.z = Math.PI / 2;
    tw.position.set(x, DECK + 4.1, -5.4);
    scene.add(tw);
    box(0.7, 0.03, 0.7, metal, x, DECK + 0.015, -5.4);
  }
  for (const t of [tFront, tBack]) for (const x of [-6, 0, 6]) {
    const ch = cyl(0.01, 0.01, 8, alu, 5);
    ch.position.set(x, t.position.y + 4.15, t.position.z);
    STATIC.add(ch);
  }
  const ledCv = document.createElement("canvas"), LED_K = TV ? 0.5 : 1;
  ledCv.width = 1024 * LED_K;
  ledCv.height = 480 * LED_K;
  const led = ledCv.getContext("2d");
  const ledTex = new CanvasTexture(ledCv);
  ledTex.colorSpace = SRGBColorSpace;
  ledTex.anisotropy = 8;
  ledTex.generateMipmaps = true;
  const LEDW = 13, LEDH = 6.1, LEDPX = [312, 146];
  const ledMat = new ShaderMaterial({
    uniforms: { map: { value: ledTex }, uRes: { value: new Vector2(...LEDPX) }, uCab: { value: new Vector2(26, 12) }, uBright: { value: 1.7 } },
    vertexShader: "varying vec2 vUv; varying vec3 vN, vV; void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(position, 1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }",
    fragmentShader: "uniform sampler2D map; uniform vec2 uRes, uCab; uniform float uBright; varying vec2 vUv; varying vec3 vN, vV;\n    void main(){\n      vec2 g = vUv * uRes, cell = (floor(g) + .5) / uRes, f = fract(g) - .5;\n      vec3 c = texture2D(map, cell).rgb;\n      float px = max(fwidth(g.x), fwidth(g.y));                  // how many LEDs fall in one screen pixel\n      float d = length(f), dotm = smoothstep(.40, .40 - max(.08, px * .9), d) * 1.15;\n      float mask = mix(dotm, .5, smoothstep(.35, .9, px));      // far away the dots blend (no moire), close up they show\n      vec3 soft = texture2D(map, vUv).rgb;                       // far away the picture is smooth, like a real screen on camera\n      c = mix(c, soft, smoothstep(.45, 1.1, px));\n      vec2 cb = fract(vUv * uCab); float seam = step(.006, cb.x) * step(cb.x, .994) * step(.008, cb.y) * step(cb.y, .992);\n      float view = pow(clamp(dot(normalize(vN), normalize(vV)), 0., 1.), .7);\n      vec3 col = c * mask * uBright * view * mix(.55, 1., seam) + vec3(.006, .006, .008) * (.6 + .4 * seam);\n      gl_FragColor = vec4(col, 1.);\n    }",
    fog: false
  });
  const ledMesh = new Mesh(new PlaneGeometry(LEDW, LEDH), ledMat);
  ledMesh.position.set(0, DECK + 0.45 + LEDH / 2, -5.6);
  scene.add(ledMesh);
  {
    box(LEDW + 0.16, LEDH + 0.16, 0.22, blackMetal, 0, ledMesh.position.y, -5.73);
    box(LEDW + 0.6, 0.12, 0.5, alu, 0, ledMesh.position.y + LEDH / 2 + 0.14, -5.7);
    for (const x of [-LEDW / 2 + 0.6, 0, LEDW / 2 - 0.6]) {
      const ch = cyl(0.01, 0.01, 2.6, alu, 5);
      ch.position.set(x, ledMesh.position.y + LEDH / 2 + 1.5, -5.7);
      STATIC.add(ch);
    }
  }
  const ledLight = new PointLight(16728192, 30, 16, 1.6);
  ledLight.position.set(0, DECK + 3, -4.6);
  scene.add(ledLight);
  const key = new SpotLight(16769732, 200, 40, 0.13, 0.55, 1.6);
  key.position.set(1.5, 11, 12);
  key.target.position.set(0, DECK + 1.2, -0.6);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.bias = -2e-4;
  key.shadow.normalBias = 0.02;
  key.shadow.camera.near = 4;
  key.shadow.camera.far = 30;
  scene.add(key, key.target);
  const backL = [-1, 1].map((s) => {
    const l = new SpotLight(16724064, 420, 30, 0.5, 0.7, 1.4);
    l.position.set(s * 3.5, 9.3, -4.3);
    l.target.position.set(-s * 0.6, DECK, 0.4);
    scene.add(l, l.target);
    return l;
  });
  const spill = new DirectionalLight(16736400, 0.5);
  spill.position.set(0, 8, -3);
  spill.target.position.set(0, 0, 18);
  scene.add(spill, spill.target);
  const pyroLight = new PointLight(16747056, 0, 30, 1.4);
  pyroLight.position.set(0, DECK + 2.5, 1.2);
  scene.add(pyroLight);
  const crowdRim = new DirectionalLight(12570879, 0.6);
  crowdRim.position.set(0, 6, -6);
  crowdRim.target.position.set(0, 0, 14);
  scene.add(crowdRim, crowdRim.target);
  const NOISE_GLSL = "float h3(vec3 p){p=fract(p*0.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}\nfloat n3(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z);}";
  const BEAM_L = 16;
  const beamMatBase = new ShaderMaterial({
    uniforms: { uC: { value: new Color() }, uI: { value: 1 }, uT: { value: 0 } },
    vertexShader: "varying float vY; varying vec3 vN, vV, vW; void main(){ vY = -position.y / ".concat(BEAM_L.toFixed(1), "; vec4 w = modelMatrix * vec4(position,1.); vW = w.xyz; vec4 mv = viewMatrix * w; vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }"),
    fragmentShader: "uniform vec3 uC; uniform float uI, uT; varying float vY; varying vec3 vN, vV, vW; ".concat(NOISE_GLSL, "\n    void main(){ float ndv = abs(dot(normalize(vN), normalize(vV))); float e = pow(ndv, 2.6) + .35 * pow(ndv, 9.);\n      float f = pow(1. - clamp(vY,0.,1.), 2.2) * smoothstep(0., .02, vY);\n      float n = n3(vW * .9 + vec3(0., -uT * .35, uT * .2)) * .65 + n3(vW * 2.7 - vec3(uT * .3, 0., 0.)) * .35; n = .35 + .9 * n * n;\n      gl_FragColor = vec4(uC * uI * e * f * n * .44, 1.); }"),
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
    fog: false
  });
  const beamGeo = new CylinderGeometry(0.07, 0.5, BEAM_L, 32, 1, true);
  beamGeo.translate(0, -BEAM_L / 2, 0);
  const fixtures = [];
  const yokeGeo = (() => {
    const p = [], a = new BoxGeometry(0.05, 0.36, 0.14);
    a.translate(-0.17, -0.2, 0);
    p.push(a);
    const b = a.clone();
    b.translate(0.34, 0, 0);
    p.push(b);
    const t = new BoxGeometry(0.39, 0.05, 0.16);
    t.translate(0, -0.015, 0);
    p.push(t);
    return mergeGeometries(p);
  })();
  const headGeo = (() => {
    const pts = [];
    for (let k = 0; k <= 12; k++) {
      const y = -0.22 + k * 0.035;
      pts.push(new Vector2(0.115 + 0.035 * Math.sin(k / 12 * Math.PI) + (k < 2 ? 0.01 : 0), y));
    }
    pts.unshift(new Vector2(0, -0.22));
    pts.push(new Vector2(0, 0.2));
    return new LatheGeometry(pts, 20);
  })();
  const lensMatBase = new MeshBasicMaterial({ color: 16777215, fog: false });
  function fixture(x, y, z, up, group) {
    const base = new Group();
    base.position.set(x, y, z);
    scene.add(base);
    const bs = new Mesh(new BoxGeometry(0.42, 0.14, 0.32), blackMetal);
    bs.position.y = 0.04;
    base.add(bs);
    const disp = new Mesh(new PlaneGeometry(0.08, 0.04), new MeshBasicMaterial({ color: 3170559 }));
    disp.position.set(0.1, 0.04, 0.161);
    base.add(disp);
    const pan = new Group();
    base.add(pan);
    const yk = new Mesh(yokeGeo, blackMetal);
    yk.castShadow = true;
    pan.add(yk);
    const tilt = new Group();
    tilt.position.y = -0.3;
    pan.add(tilt);
    const head = new Mesh(headGeo, blackMetal);
    head.castShadow = true;
    tilt.add(head);
    const bez = new Mesh(new TorusGeometry(0.1, 0.018, 8, 24), new MeshStandardMaterial({ color: 328965, roughness: 0.4, metalness: 0.4 }));
    bez.rotation.x = Math.PI / 2;
    bez.position.y = -0.225;
    tilt.add(bez);
    const lens = new Mesh(new CircleGeometry(0.095, 24), lensMatBase.clone());
    lens.rotation.x = Math.PI / 2;
    lens.position.y = -0.228;
    tilt.add(lens);
    const beam = new Mesh(beamGeo, beamMatBase.clone());
    beam.position.y = -0.23;
    beam.userData.noAO = true;
    beam.frustumCulled = false;
    tilt.add(beam);
    if (up) base.rotation.z = Math.PI;
    const f = { base, pan, tilt, beam, lens, up, group, x, i: fixtures.length, int: 1, col: new Color() };
    fixtures.push(f);
    return f;
  }
  for (let k = 0; k < 8; k++) fixture(-7 + k * 2, 9 - 0.2, 0.6, false, "front");
  for (let k = 0; k < 7; k++) fixture(-6.6 + k * 2.2, 9.4 - 0.2, -4.4, false, "back");
  for (let k = 0; k < 6; k++) fixture(-6.3 + k * 2.52, DECK + 0.08, -4.9, true, "floor");
  const flareTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(255,255,255,1)");
    gr.addColorStop(0.08, "rgba(255,255,255,.85)");
    gr.addColorStop(0.25, "rgba(255,255,255,.18)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
    const t = new CanvasTexture(c);
    return t;
  })();
  for (const f of fixtures) {
    const s = new Sprite(new SpriteMaterial({ map: flareTex, color: 16777215, blending: AdditiveBlending, depthWrite: false, fog: false, transparent: true }));
    s.scale.setScalar(0.75);
    s.position.y = -0.26;
    f.tilt.add(s);
    f.flare = s;
  }
  const hazeMat = new ShaderMaterial({
    uniforms: { uT: { value: 0 }, uC: { value: new Color(16728192) }, uI: { value: 0.12 } },
    vertexShader: "varying vec2 vUv; varying vec3 vW; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position,1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",
    fragmentShader: "uniform float uT, uI; uniform vec3 uC; varying vec2 vUv; varying vec3 vW; ".concat(NOISE_GLSL, "\n    void main(){ vec3 p = vW * .28 + vec3(uT * .05, -uT * .02, uT * .03); float n = n3(p) * .6 + n3(p * 2.3) * .3 + n3(p * 5.) * .1; n = smoothstep(.35, .95, n);\n      vec2 e = smoothstep(vec2(0.), vec2(.3), vUv) * smoothstep(vec2(0.), vec2(.3), 1. - vUv); float hgt = smoothstep(0., .5, vUv.y);\n      gl_FragColor = vec4(uC * n * e.x * e.y * hgt * uI, 1.); }"),
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
    fog: false
  });
  const hazes = [];
  for (let k = 0; k < 4; k++) {
    const h = new Mesh(new PlaneGeometry(24, 9), hazeMat);
    h.position.set(0, 4.6 + k * 0.3, -4.8 + k * 1.3);
    h.userData.noAO = true;
    scene.add(h);
    hazes.push(h);
  }
  const Y = V3(0, 1, 0), _q = new Quaternion(), _v = V3(), _w = V3();
  function taperGeo(r0, r1, len, swell = 0.08, seg = 14) {
    const pts = [], N = 5;
    for (let i = 0; i <= N; i++) {
      const a = -Math.PI / 2 + i / N * Math.PI / 2;
      pts.push(new Vector2(Math.max(1e-4, Math.cos(a) * r0), -len / 2 + Math.sin(a) * r0));
    }
    for (let i = 1; i < 8; i++) {
      const k = i / 8, r = lerp(r0, r1, k) * (1 + swell * Math.sin(k * Math.PI) * (1 - k * 0.6));
      pts.push(new Vector2(r, -len / 2 + k * len));
    }
    for (let i = 0; i <= N; i++) {
      const a = i / N * Math.PI / 2;
      pts.push(new Vector2(Math.max(1e-4, Math.cos(a) * r1), len / 2 + Math.sin(a) * r1));
    }
    return new LatheGeometry(pts, seg);
  }
  function limb(mat, r0, len, r1 = r0, swell) {
    const m = new Mesh(taperGeo(r0, r1, len, swell), mat);
    m.castShadow = true;
    m.userData.len = len;
    return m;
  }
  function placeLimb(m, a, b) {
    m.position.copy(a).add(b).multiplyScalar(0.5);
    _v.copy(b).sub(a);
    const l = _v.length();
    _q.setFromUnitVectors(Y, _v.multiplyScalar(1 / (l || 1)));
    m.quaternion.copy(_q);
    m.scale.set(1, Math.max(0.3, l / (m.userData.len + 1e-3)), 1);
  }
  function ik(s, t, a, b, pole, out) {
    _v.copy(t).sub(s);
    let d = _v.length();
    const maxd = (a + b) * 0.999;
    if (d > maxd) {
      _v.multiplyScalar(maxd / d);
      t.copy(s).add(_v);
      d = maxd;
    }
    d = Math.max(d, Math.abs(a - b) + 0.01);
    const dir = _v.clone().normalize(), x = (a * a - b * b + d * d) / (2 * d), h = Math.sqrt(Math.max(0, a * a - x * x));
    const pp = pole.clone().sub(dir.clone().multiplyScalar(pole.dot(dir))).normalize();
    return out.copy(s).addScaledVector(dir, x).addScaledVector(pp, h);
  }
  const skinMat = (tone) => new MeshPhysicalMaterial({ color: tone, roughness: 0.62, specularIntensity: 0.45, sheen: 0.22, sheenColor: new Color(13660256), sheenRoughness: 0.7 });
  const hairStreaks = cvTex(64, 256, (g, w, h) => {
    g.fillStyle = "#808080";
    g.fillRect(0, 0, w, h);
    for (let k = 0; k < 220; k++) {
      const x = rnd() * w, v = 90 + rnd() * 120;
      g.strokeStyle = "rgb(".concat(v, ",").concat(v, ",").concat(v, ")");
      g.lineWidth = 0.6 + rnd() * 1.4;
      g.beginPath();
      g.moveTo(x, 0);
      g.bezierCurveTo(x + (rnd() - 0.5) * 10, h * 0.3, x + (rnd() - 0.5) * 14, h * 0.7, x + (rnd() - 0.5) * 8, h);
      g.stroke();
    }
  }, false, [6, 1]);
  const hairMat = (col) => memo("hair" + col, () => new MeshPhysicalMaterial({ color: col, roughness: 0.5, roughnessMap: hairStreaks, bumpMap: hairStreaks, bumpScale: 1.2, sheen: 0.45, sheenColor: new Color(col).lerp(new Color(12628128), 0.3), sheenRoughness: 0.45, side: DoubleSide }));
  const eyeMat = new MeshStandardMaterial({ color: 788486, roughness: 0.2 });
  const knitMat = (col, rep = 3) => memo("knit" + col + rep, () => pbr2("jersey_melange", { repeat: [rep, rep], color: col, roughness: 0.95, nodiff: col !== 16777215 }));
  const denim = (col = 16777215) => memo("denim" + col, () => pbr2("denim_fabric", { repeat: [3, 3], color: col, roughness: 0.92 }));
  const leatherJ = (col, tan) => memo("lea" + col + tan, () => pbr2("fabric_leather_02", { repeat: [3, 3], color: col, roughness: 0.42, normalScale: 1.4, nodiff: !tan, physical: true, clearcoat: 0.25 }));
  const shoeLeather = new MeshPhysicalMaterial({ color: 920587, roughness: 0.35, clearcoat: 0.5 }), soleW = new MeshStandardMaterial({ color: 15262940, roughness: 0.7 }), soleB = new MeshStandardMaterial({ color: 1710618, roughness: 0.8 });
  const beltMat = new MeshPhysicalMaterial({ color: 1708556, roughness: 0.45, clearcoat: 0.4 });
  const torsoGeo = (() => {
    const prof = [[-0.27, 0], [-0.27, 0.128], [-0.18, 0.125], [-0.08, 0.13], [0.03, 0.145], [0.12, 0.16], [0.2, 0.165], [0.255, 0.15], [0.29, 0.11], [0.305, 0.06], [0.31, 0]];
    return new LatheGeometry(prof.map(([y, r]) => new Vector2(Math.max(1e-4, r), y)), 22);
  })();
  const pelvisGeo = (() => {
    const prof = [[-0.11, 0], [-0.11, 0.1], [-0.07, 0.135], [0, 0.14], [0.07, 0.13], [0.1, 0.125], [0.1, 0]];
    return new LatheGeometry(prof.map(([y, r]) => new Vector2(Math.max(1e-4, r), y)), 20);
  })();
  function makePerson({ top, under = null, sleeves = "long", pants, shoes = "boot", hair = "short", hairCol = 1708556, tone = 12618348, beard = false } = {}) {
    const root = new Group(), skin = skinMat(tone), sleeve = sleeves === "none" ? skin : top, P = { root, jacket: top };
    P.torso = new Group();
    root.add(P.torso);
    const tb = new Mesh(torsoGeo, top);
    tb.scale.set(1.26, 1, 0.72);
    tb.castShadow = true;
    P.torso.add(tb);
    if (under) {
      const sh = new Mesh(torsoGeo, under);
      sh.scale.set(0.42, 0.97, 0.745);
      sh.position.z = 4e-3;
      P.torso.add(sh);
    }
    P.hips = new Group();
    root.add(P.hips);
    {
      const pv = new Mesh(pelvisGeo, pants);
      pv.scale.set(1.2, 1, 0.8);
      pv.castShadow = true;
      P.hips.add(pv);
      const belt = new Mesh(new TorusGeometry(0.135, 0.016, 6, 28), beltMat);
      belt.rotation.x = Math.PI / 2;
      belt.scale.set(1.2, 0.8, 1);
      belt.position.y = 0.085;
      P.hips.add(belt);
      const buckle = new Mesh(new BoxGeometry(0.045, 0.032, 0.012), chrome);
      buckle.position.set(0, 0.085, 0.112);
      P.hips.add(buckle);
    }
    P.neck = limb(skin, 0.05, 0.08, 0.046);
    root.add(P.neck);
    P.head = new Group();
    root.add(P.head);
    {
      const hd = new Mesh(new SphereGeometry(0.1, 28, 20), skin);
      hd.scale.set(0.9, 1.08, 1);
      hd.castShadow = true;
      P.head.add(hd);
      const jaw = new Mesh(new SphereGeometry(0.075, 20, 14), skin);
      jaw.scale.set(0.95, 0.8, 0.95);
      jaw.position.set(0, -0.055, 0.022);
      P.head.add(jaw);
      const nose = new Mesh(new ConeGeometry(0.017, 0.045, 10), skin);
      nose.rotation.x = Math.PI / 2 + 0.35;
      nose.position.set(0, -0.01, 0.1);
      P.head.add(nose);
      for (const s of [-1, 1]) {
        const ear = new Mesh(new SphereGeometry(0.024, 10, 8), skin);
        ear.scale.set(0.45, 1, 0.75);
        ear.position.set(s * 0.09, -5e-3, -5e-3);
        P.head.add(ear);
        const eye = new Mesh(new SphereGeometry(0.011, 10, 8), eyeMat);
        eye.position.set(s * 0.033, 0.012, 0.087);
        P.head.add(eye);
        const brow = new Mesh(new BoxGeometry(0.034, 8e-3, 0.012), hairMat(hairCol));
        brow.position.set(s * 0.034, 0.033, 0.091);
        brow.rotation.z = -s * 0.12;
        P.head.add(brow);
      }
      const hm = hairMat(hairCol);
      if (hair !== "none") {
        const cap = new Mesh(new SphereGeometry(hair === "buzz" ? 0.103 : 0.112, 26, 14, 0, Math.PI * 2, 0, Math.PI * (hair === "buzz" ? 0.5 : 0.56)), hm);
        cap.scale.set(0.95, 1.05, 1.05);
        cap.position.set(0, 0.012, -0.01);
        cap.rotation.x = -0.28;
        cap.castShadow = true;
        P.head.add(cap);
      }
      if (hair === "long") {
        const back = new Mesh(new CylinderGeometry(0.105, 0.15, 0.34, 20, 4, true, Math.PI / 2 - 0.25, Math.PI + 0.5), hm);
        back.position.set(0, -0.13, -0.025);
        back.rotation.x = 0.12;
        back.castShadow = true;
        P.head.add(back);
      }
      if (hair === "curly") {
        const g = new IcosahedronGeometry(0.135, 3), pa = g.attributes.position;
        for (let i = 0; i < pa.count; i++) {
          _v.fromBufferAttribute(pa, i);
          _v.multiplyScalar(1 + 0.08 * Math.sin(_v.x * 90) * Math.sin(_v.y * 80) * Math.sin(_v.z * 85));
          pa.setXYZ(i, _v.x, _v.y, _v.z);
        }
        g.computeVertexNormals();
        const af = new Mesh(g, hm);
        af.scale.set(0.95, 0.82, 0.95);
        af.position.set(0, 0.045, -0.025);
        af.castShadow = true;
        P.head.add(af);
      }
      if (beard) {
        const bd = new Mesh(new SphereGeometry(0.08, 18, 12, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.55), hm);
        bd.scale.set(0.98, 0.9, 1);
        bd.position.set(0, -0.045, 0.024);
        P.head.add(bd);
      }
    }
    const handGeo = (s) => {
      const palm = new SphereGeometry(0.045, 14, 10);
      palm.scale(0.95, 1.15, 0.5);
      palm.translate(0, 0.045, 0);
      const fing = new CapsuleGeometry(0.028, 0.04, 3, 8);
      fing.scale(1.45, 1, 0.75);
      fing.rotateX(0.6);
      fing.translate(0, 0.105, 0.012);
      const th = new CapsuleGeometry(0.013, 0.035, 3, 6);
      th.rotateZ(0.7 * s);
      th.translate(-s * 0.038, 0.055, 0.01);
      return mergeGeometries([palm, fing, th]);
    };
    P.arms = [-1, 1].map((s) => {
      const hand = new Mesh(handGeo(s), skin);
      hand.castShadow = true;
      return { s, up: limb(sleeve, 0.058, 0.22, 0.044, 0.12), lo: limb(sleeves === "long" ? sleeve : skin, 0.045, 0.2, 0.033, 0.14), hand, delt: new Mesh(new SphereGeometry(0.066, 16, 12), sleeve), e: V3(), t: V3() };
    });
    const shoeGeo = shoes === "boot" ? (() => {
      const up = new CapsuleGeometry(0.052, 0.12, 4, 12);
      up.rotateX(Math.PI / 2);
      up.scale(1, 0.85, 1);
      up.translate(0, 0.045, 0.02);
      const sh = new CylinderGeometry(0.05, 0.055, 0.12, 12);
      sh.translate(0, 0.1, -0.04);
      return mergeGeometries([up, sh]);
    })() : (() => {
      const up = new CapsuleGeometry(0.05, 0.14, 4, 12);
      up.rotateX(Math.PI / 2);
      up.scale(1, 0.8, 1);
      up.translate(0, 0.045, 0.02);
      return up;
    })();
    const soleGeo = new BoxGeometry(0.1, 0.022, 0.27);
    soleGeo.translate(0, 0.011, 0.02);
    P.legs = [-1, 1].map((s) => {
      const foot = new Group(), u = new Mesh(shoeGeo, shoes === "boot" ? shoeLeather : knitMat(1842210, 6)), so = new Mesh(soleGeo, shoes === "boot" ? soleB : soleW);
      u.castShadow = so.castShadow = true;
      foot.add(u, so);
      return { s, up: limb(pants, 0.085, 0.36, 0.062, 0.05), lo: limb(pants, 0.06, 0.36, 0.052, 0.02), foot, k: V3() };
    });
    for (const a of P.arms) {
      a.delt.castShadow = true;
      a.delt.scale.set(1, 1.05, 0.95);
      root.add(a.up, a.lo, a.hand, a.delt);
    }
    for (const l of P.legs) root.add(l.up, l.lo, l.foot);
    P.bounce = 0;
    P.lean = 0;
    P.jump = 0;
    return P;
  }
  const POLE_ARM = (s) => V3(s * 0.7, -1, -0.5), POLE_LEG = V3(0, 0, 1);
  function posePerson(P, hl, hr, { bounce = 0, lean = 0, jump = 0, look = 0, nod = 0, sit = false } = {}) {
    const lift = jump, hipY = (sit ? 0.64 - bounce * 0.015 : 0.98 - bounce * 0.06) + lift, hip = V3(lean * 0.05, hipY, 0), chest = V3(lean * 0.16, hipY + 0.42, 0.01);
    P.hips.position.copy(hip);
    P.torso.position.copy(hip).lerp(chest, 0.62);
    P.torso.rotation.z = -lean * 0.3;
    P.torso.rotation.x = 0.04 + nod * 0.08;
    const neckB = V3(chest.x * 1.1, chest.y + 0.18, 0.02), headC = V3(neckB.x + lean * 0.03, neckB.y + 0.12, 0.03 + nod * 0.04);
    placeLimb(P.neck, V3(chest.x, chest.y + 0.12, 0.01), neckB);
    P.head.position.copy(headC);
    P.head.rotation.set(0.1 + nod * 0.35, look, -lean * 0.2);
    for (const a of P.arms) {
      const sh = V3(chest.x + a.s * 0.19, chest.y + 0.12, 0), tgt = (a.s < 0 ? hl : hr).clone();
      const el = ik(sh, tgt, 0.27, 0.27, POLE_ARM(a.s), a.e);
      placeLimb(a.up, sh, el);
      placeLimb(a.lo, el, tgt);
      a.t.copy(tgt);
      a.delt.position.copy(sh).add(V3(a.s * 0.012, 0.01, 0));
      a.hand.position.copy(tgt);
      a.hand.quaternion.copy(a.lo.quaternion);
    }
    for (const l of P.legs) {
      const hj = V3(hip.x + l.s * 0.095, hip.y - 0.06, 0), ft = sit ? V3(l.s * 0.24, 0.09, 0.36) : V3(l.s * 0.15, 0.09 + Math.max(0, lift - 0.02) * 0.6, 0.03);
      const kn = ik(hj, ft, 0.45, 0.45, POLE_LEG, l.k);
      placeLimb(l.up, hj, kn);
      placeLimb(l.lo, kn, ft);
      l.foot.position.set(ft.x, ft.y - 0.09, ft.z + 0.03);
      l.foot.rotation.y = l.s * 0.12;
    }
  }
  function guitarBody(color, { sunburst = false } = {}) {
    const g = new Group(), sh = new Shape();
    sh.moveTo(0, -0.24);
    sh.bezierCurveTo(0.2, -0.25, 0.23, -0.06, 0.15, 0);
    sh.bezierCurveTo(0.12, 0.04, 0.2, 0.14, 0.14, 0.2);
    sh.bezierCurveTo(0.1, 0.24, 0.05, 0.16, 0.03, 0.13);
    sh.lineTo(-0.03, 0.13);
    sh.bezierCurveTo(-0.07, 0.2, -0.13, 0.27, -0.16, 0.18);
    sh.bezierCurveTo(-0.18, 0.1, -0.12, 0.04, -0.15, 0);
    sh.bezierCurveTo(-0.24, -0.08, -0.2, -0.25, 0, -0.24);
    const geo = new ExtrudeGeometry(sh, { depth: 0.045, bevelEnabled: true, bevelThickness: 8e-3, bevelSize: 8e-3, bevelSegments: 4, curveSegments: 28 });
    const burst = sunburst ? cvTex(256, 256, (c, w, h) => {
      const gr = c.createRadialGradient(w * 0.5, h * 0.36, 8, w * 0.5, h * 0.4, w * 0.55);
      gr.addColorStop(0, "#f0b040");
      gr.addColorStop(0.55, "#a0400c");
      gr.addColorStop(1, "#1a0602");
      c.fillStyle = gr;
      c.fillRect(0, 0, w, h);
    }) : null;
    if (burst) {
      burst.repeat.set(2.1, 2.1);
      burst.offset.set(0.5, 0.5);
    }
    const body = new Mesh(geo, new MeshPhysicalMaterial({ color: burst ? 16777215 : color, map: burst, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.03, metalness: burst ? 0 : 0.15 }));
    body.position.z = -0.022;
    body.castShadow = true;
    g.add(body);
    const pg = new Mesh(new CircleGeometry(0.09, 24), new MeshPhysicalMaterial({ color: 15921126, roughness: 0.3, clearcoat: 0.6 }));
    pg.position.set(0.05, -0.08, 0.033);
    g.add(pg);
    const fbMat = new MeshStandardMaterial({ color: 2364688, roughness: 0.55 });
    const neck = new Mesh(new BoxGeometry(0.052, 0.62, 0.024), new MeshPhysicalMaterial({ color: 13144666, roughness: 0.4, clearcoat: 0.5 }));
    neck.position.set(0, 0.42, 0.016);
    neck.castShadow = true;
    g.add(neck);
    const fb = new Mesh(new BoxGeometry(0.05, 0.6, 6e-3), fbMat);
    fb.position.set(0, 0.42, 0.031);
    g.add(fb);
    for (let k = 0; k < 14; k++) {
      const fr = new Mesh(new BoxGeometry(0.05, 3e-3, 4e-3), chrome);
      fr.position.set(0, 0.14 + 0.56 * (1 - Math.pow(0.93, k + 1)) / (1 - Math.pow(0.93, 15)), 0.035);
      g.add(fr);
    }
    const headst = new Mesh(new BoxGeometry(0.075, 0.16, 0.02), new MeshPhysicalMaterial({ color: 1118481, clearcoat: 1, roughness: 0.3 }));
    headst.position.set(0, 0.8, 0.012);
    g.add(headst);
    for (let k = 0; k < 6; k++) {
      const pg2 = new Mesh(new CylinderGeometry(6e-3, 6e-3, 0.03, 6), chrome);
      pg2.rotation.z = Math.PI / 2;
      pg2.position.set((k % 2 ? 1 : -1) * 0.05, 0.75 + Math.floor(k / 2) * 0.04, 0.012);
      g.add(pg2);
    }
    for (let k = 0; k < 2; k++) {
      const pu = new Mesh(new BoxGeometry(0.075, 0.03, 0.012), new MeshStandardMaterial({ color: 657930, metalness: 0.5, roughness: 0.3 }));
      pu.position.set(0, -0.02 - k * 0.09, 0.034);
      g.add(pu);
      for (let j = 0; j < 6; j++) {
        const pp = new Mesh(new CylinderGeometry(3e-3, 3e-3, 4e-3, 6), chrome);
        pp.rotation.x = Math.PI / 2;
        pp.position.set(-0.025 + j * 0.01, -0.02 - k * 0.09, 0.041);
        g.add(pp);
      }
    }
    const bridge = new Mesh(new BoxGeometry(0.07, 0.018, 0.012), chrome);
    bridge.position.set(0, -0.15, 0.036);
    g.add(bridge);
    for (const [x, y] of [[0.11, -0.12], [0.13, -0.17], [0.09, -0.19]]) {
      const kn = new Mesh(new CylinderGeometry(0.013, 0.014, 0.016, 14), new MeshStandardMaterial({ color: 14202976, metalness: 0.9, roughness: 0.3 }));
      kn.rotation.x = Math.PI / 2;
      kn.position.set(x, y, 0.036);
      g.add(kn);
    }
    const strings = new Mesh(new BoxGeometry(0.04, 0.95, 2e-3), new MeshStandardMaterial({ color: 14540253, metalness: 1, roughness: 0.2, transparent: true, opacity: 0.45 }));
    strings.position.set(0, 0.3, 0.04);
    g.add(strings);
    const strap0 = new Mesh(new TorusGeometry(0.33, 0.012, 4, 30, Math.PI * 1.05), beltMat);
    strap0.scale.set(1, 1, 0.25);
    strap0.rotation.z = -0.25;
    strap0.position.set(-0.04, 0.2, -0.02);
    g.add(strap0);
    bake(g);
    return g;
  }
  const lathe = cvTex(8, 512, (g, w, h) => {
    for (let y = 0; y < h; y++) {
      const v = 150 + 70 * Math.sin(y * 1.7) * Math.sin(y * 0.31) + (rnd() - 0.5) * 40;
      g.fillStyle = "rgb(".concat(v | 0, ",").concat(v | 0, ",").concat(v | 0, ")");
      g.fillRect(0, y, w, 1);
    }
  }, false);
  const bronze = new MeshStandardMaterial({ color: 14199128, metalness: 1, roughness: 0.3, roughnessMap: lathe, bumpMap: lathe, bumpScale: 0.25, side: DoubleSide, envMapIntensity: 1.3 });
  const cymGeo = /* @__PURE__ */ (() => {
    const P2 = (r, y) => new Vector2(r, y);
    return (r) => new LatheGeometry([P2(1e-3, 0.035), P2(0.012, 0.034), P2(0.05, 0.026), P2(0.068, 0.012), P2(r * 0.5, 0), P2(r * 0.85, -0.012), P2(r, -0.02)], 48);
  })();
  const shellMat = new MeshPhysicalMaterial({ color: 2884617, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.03, metalness: 0.6, envMapIntensity: 1.1 });
  const headTex = cvTex(256, 256, (g, w, h) => {
    g.fillStyle = "#ece8de";
    g.fillRect(0, 0, w, h);
    for (let k = 0; k < 1600; k++) {
      const v = 200 + rnd() * 40;
      g.fillStyle = "rgba(".concat(v, ",").concat(v - 6, ",").concat(v - 18, ",.25)");
      g.fillRect(rnd() * w, rnd() * h, 2 + rnd() * 3, 2 + rnd() * 3);
    }
    const gr = g.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w * 0.3);
    gr.addColorStop(0, "rgba(120,110,95,.35)");
    gr.addColorStop(1, "rgba(120,110,95,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
  });
  const headMat = new MeshStandardMaterial({ map: headTex, color: 10131086, roughness: 0.8 });
  const logoCv = document.createElement("canvas");
  logoCv.width = logoCv.height = 256;
  {
    const g = logoCv.getContext("2d");
    g.fillStyle = "#121014";
    g.fillRect(0, 0, 256, 256);
    g.fillStyle = "#e8e0cc";
    g.font = "italic 900 58px system-ui";
    g.textAlign = "center";
    g.fillText("AIR", 128, 118);
    g.fillText("BAND", 128, 172);
    g.strokeStyle = "#b01828";
    g.lineWidth = 6;
    g.beginPath();
    g.arc(128, 128, 112, 0, 6.283);
    g.stroke();
  }
  const logoTex = new CanvasTexture(logoCv);
  logoTex.colorSpace = SRGBColorSpace;
  const lugGeo = (() => {
    const l = new CapsuleGeometry(8e-3, 0.03, 3, 6);
    return l;
  })();
  function drum(r, h, x, y, z, rx = 0) {
    const g = new Group();
    const sh = new Mesh(new CylinderGeometry(r, r, h, 36, 1, true), shellMat);
    sh.castShadow = true;
    g.add(sh);
    const top = new Mesh(new CircleGeometry(r, 36), headMat);
    top.rotation.x = -Math.PI / 2;
    top.position.y = h / 2 + 2e-3;
    g.add(top);
    const bot = new Mesh(new CircleGeometry(r, 24), headMat);
    bot.rotation.x = Math.PI / 2;
    bot.position.y = -h / 2 - 2e-3;
    g.add(bot);
    for (const yy of [h / 2, -h / 2]) {
      const rim = new Mesh(new TorusGeometry(r + 4e-3, 7e-3, 8, 40), chrome);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = yy;
      g.add(rim);
    }
    const n = r > 0.16 ? 8 : 6;
    for (let k = 0; k < n; k++) {
      const a = k / n * Math.PI * 2, lug = new Mesh(lugGeo, chrome);
      lug.position.set(Math.cos(a) * (r + 9e-3), 0, Math.sin(a) * (r + 9e-3));
      lug.scale.y = h / 0.06 * 0.5;
      g.add(lug);
      const rod = new Mesh(new CylinderGeometry(3e-3, 3e-3, h * 0.9, 4), chrome);
      rod.position.set(Math.cos(a) * (r + 0.012), 0, Math.sin(a) * (r + 0.012));
      g.add(rod);
    }
    g.position.set(x, y, z);
    g.rotation.x = rx;
    return g;
  }
  function tripod(h, x, z, parent) {
    const g = new Group();
    const pole = cyl(0.011, 0.011, h, chrome, 8);
    pole.position.y = h / 2;
    g.add(pole);
    for (let k = 0; k < 3; k++) {
      const a = k / 3 * Math.PI * 2 + 0.4, leg = cyl(8e-3, 8e-3, 0.34, chrome, 6);
      leg.position.set(Math.cos(a) * 0.12, 0.1, Math.sin(a) * 0.12);
      leg.rotation.set(Math.sin(a) * 0.9, 0, -Math.cos(a) * 0.9);
      g.add(leg);
      const ft = new Mesh(new SphereGeometry(0.014, 8, 6), rubber);
      ft.position.set(Math.cos(a) * 0.24, 0.012, Math.sin(a) * 0.24);
      g.add(ft);
    }
    const col = cyl(0.016, 0.016, 0.05, blackMetal, 8);
    col.position.y = 0.22;
    g.add(col);
    g.position.set(x, 0, z);
    parent.add(g);
    return g;
  }
  function cymbal(r, x, y, z, tilt = 0.2, parent) {
    const c = new Group();
    const m = new Mesh(cymGeo(r), bronze);
    m.castShadow = true;
    c.add(m);
    const nut = new Mesh(new CylinderGeometry(0.012, 0.016, 0.025, 10), new MeshStandardMaterial({ color: 1381653, roughness: 0.6 }));
    nut.position.y = 0.045;
    c.add(nut);
    c.position.set(x, y, z);
    c.rotation.x = tilt;
    c.userData.keep = true;
    c.userData.tilt = tilt;
    parent.add(c);
    tripod(y - 0.02, x, z - 0.02, parent);
    return c;
  }
  function drumKit() {
    const g = new Group(), K = {};
    const kick = new Group();
    const ks = new Mesh(new CylinderGeometry(0.29, 0.29, 0.42, 40, 1, true), shellMat);
    ks.rotation.x = Math.PI / 2;
    ks.castShadow = true;
    kick.add(ks);
    const kf = new Mesh(new CircleGeometry(0.29, 40), new MeshStandardMaterial({ map: logoTex, roughness: 0.5 }));
    kf.position.z = 0.212;
    kick.add(kf);
    const kb = new Mesh(new CircleGeometry(0.29, 32), headMat);
    kb.position.z = -0.212;
    kb.rotation.y = Math.PI;
    kick.add(kb);
    for (const zz of [0.21, -0.21]) {
      const hp = new Mesh(new TorusGeometry(0.296, 0.012, 8, 44), new MeshPhysicalMaterial({ color: 5900820, clearcoat: 1, roughness: 0.3, metalness: 0.5 }));
      hp.position.z = zz;
      kick.add(hp);
    }
    for (let k = 0; k < 10; k++) {
      const a = k / 10 * Math.PI * 2, lug = new Mesh(lugGeo, chrome);
      lug.rotation.x = Math.PI / 2;
      lug.scale.y = 5;
      lug.position.set(Math.cos(a) * 0.3, Math.sin(a) * 0.3, 0);
      kick.add(lug);
    }
    for (const s of [-1, 1]) {
      const sp = cyl(8e-3, 8e-3, 0.3, chrome, 6);
      sp.position.set(s * 0.3, -0.2, 0.12);
      sp.rotation.z = s * 0.6;
      kick.add(sp);
    }
    kick.position.set(0, 0.3, 0.55);
    g.add(kick);
    const pedal = box(0.08, 0.02, 0.26, blackMetal, 0, 0.015, 0.92, g);
    const beater = cyl(5e-3, 5e-3, 0.22, chrome, 6);
    beater.position.set(0, 0.2, 0.79);
    beater.rotation.x = 0.3;
    g.add(beater);
    K.SN = drum(0.17, 0.13, -0.3, 0.72, 0.42, 0.18);
    K.TM = drum(0.2, 0.36, 0.38, 0.5, 0.4);
    K.T1 = drum(0.13, 0.18, 0.12, 0.78, 0.68, 0.45);
    g.add(K.SN, K.TM, K.T1);
    for (const [p, h] of [[K.SN, 0.6], [K.TM, 0.3]]) {
      const s = cyl(0.01, 0.01, h, chrome, 6);
      s.position.set(p.position.x, h / 2, p.position.z);
      g.add(s);
    }
    const tmLegs = [0, 1, 2].map((k) => {
      const l = cyl(9e-3, 9e-3, 0.36, chrome, 6);
      const a = k * 2.1;
      l.position.set(0.38 + Math.cos(a) * 0.2, 0.16, 0.4 + Math.sin(a) * 0.2);
      g.add(l);
      return l;
    });
    const tmArm = cyl(0.01, 0.01, 0.25, chrome, 6);
    tmArm.position.set(0.1, 0.72, 0.62);
    tmArm.rotation.x = 0.5;
    g.add(tmArm);
    K.HH = cymbal(0.18, -0.55, 0.98, 0.4, 0.05, g);
    const hb = new Mesh(cymGeo(0.18), bronze);
    hb.rotation.x = Math.PI;
    hb.position.set(-0.55, 0.955, 0.4);
    g.add(hb);
    K.CY = cymbal(0.25, 0.55, 1.45, 0.45, 0.35, g);
    K.RI = cymbal(0.27, -0.35, 1.38, 0.62, 0.3, g);
    const throne = new Group();
    const seat = cyl(0.17, 0.16, 0.09, new MeshPhysicalMaterial({ color: 1052688, roughness: 0.45, clearcoat: 0.3 }), 20);
    seat.position.y = 0.55;
    throne.add(seat);
    const tp = cyl(0.02, 0.02, 0.5, chrome, 8);
    tp.position.y = 0.27;
    throne.add(tp);
    throne.position.set(0, 0, 0);
    g.add(throne);
    K.throne = throne;
    bake(g);
    g.userData.K = K;
    return g;
  }
  function micStand() {
    const g = new Group();
    const base = new Mesh(new CylinderGeometry(0.16, 0.18, 0.03, 24), new MeshPhysicalMaterial({ color: 789518, roughness: 0.35, metalness: 0.6, clearcoat: 0.4 }));
    base.castShadow = true;
    g.add(base);
    const pole = new Mesh(new CylinderGeometry(0.012, 0.012, 1.45, 10), chrome);
    pole.position.y = 0.73;
    g.add(pole);
    const clutch = cyl(0.02, 0.02, 0.05, blackMetal, 10);
    clutch.position.y = 0.95;
    g.add(clutch);
    return g;
  }
  function micMesh() {
    const g = new Group();
    const b = new Mesh(new CylinderGeometry(0.019, 0.013, 0.16, 14), blackMetal);
    g.add(b);
    const gr = new Mesh(new SphereGeometry(0.03, 16, 12), new MeshStandardMaterial({ map: grilleMap, color: 14211292, metalness: 1, roughness: 0.35 }));
    gr.position.y = 0.1;
    g.add(gr);
    return g;
  }
  const PLAYER_POS = V3(0, DECK, -0.5);
  const hero = makePerson({ top: leatherJ(2763310), under: knitMat(16777215, 3), pants: denim(6318200), hair: "long", hairCol: 2759184, tone: 14069396 });
  hero.root.position.copy(PLAYER_POS);
  scene.add(hero.root);
  const heroGtr = guitarBody(10686494);
  hero.root.add(heroGtr);
  const heroKit = drumKit();
  heroKit.position.set(0, 0, 0.12);
  hero.root.add(heroKit);
  const heroStand = micStand();
  heroStand.position.set(0.05, 0, 0.55);
  hero.root.add(heroStand);
  const heroMic = micMesh();
  hero.root.add(heroMic);
  const bandDrummer = makePerson({ top: knitMat(14999768, 3), sleeves: "none", pants: denim(2763312), shoes: "sneaker", hair: "buzz", hairCol: 3810840, tone: 12620920, beard: true });
  bandDrummer.root.position.set(0, DECK + 0.45, -3.75);
  scene.add(bandDrummer.root);
  {
    const wood = new MeshStandardMaterial({ color: 14203016, roughness: 0.5 });
    for (const a of bandDrummer.arms) {
      const st = cyl(75e-4, 55e-4, 0.41, wood, 8);
      st.position.set(0, 0.06, 0.15);
      st.rotation.x = 1.15;
      st.castShadow = true;
      a.hand.add(st);
    }
  }
  const rearKit = drumKit();
  rearKit.position.set(0, DECK + 0.45, -3.75 + 0.12);
  scene.add(rearKit);
  const bandBass = makePerson({ top: leatherJ(1842208), under: knitMat(9052208, 3), pants: denim(2763312), hair: "long", hairCol: 920072, tone: 9332304 });
  bandBass.root.position.set(4.2, DECK, -1.9);
  bandBass.root.rotation.y = -0.35;
  scene.add(bandBass.root);
  const bassGtr = guitarBody(1911406);
  bassGtr.scale.set(1.08, 1.25, 1);
  bandBass.root.add(bassGtr);
  const bandGtr = makePerson({ top: knitMat(16777215, 3), sleeves: "short", pants: denim(), shoes: "sneaker", hair: "curly", hairCol: 1707528, tone: 6176818 });
  bandGtr.root.position.set(-4.2, DECK, -1.9);
  bandGtr.root.rotation.y = 0.35;
  scene.add(bandGtr.root);
  const sideGtr = guitarBody(14272928, { sunburst: true });
  bandGtr.root.add(sideGtr);
  for (const [x, z, ry] of [[4.35, -1.35, -0.35], [-4.35, -1.35, 0.35]]) {
    const ms = micStand();
    ms.position.set(x, DECK, z);
    ms.rotation.y = ry;
    STATIC.add(ms);
    const mm = micMesh();
    mm.position.set(x - Math.sign(x) * 0.03, DECK + 1.5, z + 0.08);
    mm.rotation.x = 1.2;
    STATIC.add(mm);
  }
  bake(STATIC);
  function holdGuitar(P, gtr, fretK, strumY) {
    gtr.position.set(-0.02, 0.98 + P.bounce * -0.06 + P.jump + 0.06, 0.16);
    gtr.rotation.set(0.1, 0.05, 1.05);
    gtr.updateMatrix();
    const fret = V3(0, 0.25 + fretK * 0.4, 0.07).applyMatrix4(gtr.matrix), strum2 = V3(0.05, -0.04 + strumY, 0.1).applyMatrix4(gtr.matrix);
    return [fret, strum2];
  }
  const CROWD_N = TV ? 480 : tier() >= 2 ? 1300 : 700;
  const crowdGeo = (() => {
    const legs = new CapsuleGeometry(0.115, 0.62, 3, 8);
    legs.scale(1.3, 1, 0.78);
    legs.translate(0, 0.45, 0);
    const torso = new LatheGeometry([[0, -0.25], [0.15, -0.25], [0.16, -0.05], [0.18, 0.12], [0.17, 0.2], [0.09, 0.26], [0, 0.27]].map(([r, y]) => new Vector2(r, y)), 10);
    torso.scale(1.35, 1, 0.68);
    torso.translate(0, 1.19, 0);
    const neck = new CylinderGeometry(0.045, 0.05, 0.08, 8);
    neck.translate(0, 1.49, 0);
    const head = new SphereGeometry(0.1, 12, 9);
    head.scale(0.9, 1.1, 1);
    head.translate(0, 1.6, 0);
    return mergeGeometries([legs.toNonIndexed(), torso.toNonIndexed(), neck.toNonIndexed(), head.toNonIndexed()]);
  })();
  const hairGeo = (() => {
    const h = new SphereGeometry(0.11, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.6);
    h.scale(0.95, 1.05, 1.05);
    h.translate(0, 1.615, -0.01);
    return h;
  })();
  const armUp = (side, ang) => {
    const u = new CapsuleGeometry(0.046, 0.26, 3, 6);
    u.translate(0, 0.15, 0);
    u.rotateZ(-side * (ang + 0.55));
    const ex = side * Math.sin(ang + 0.55) * 0.3, ey = Math.cos(ang + 0.55) * 0.3;
    const f = new CapsuleGeometry(0.04, 0.26, 3, 6);
    f.translate(0, 0.14, 0);
    f.rotateZ(-side * (ang - 0.15));
    f.translate(ex, ey, 0);
    const hnd = new SphereGeometry(0.05, 8, 6);
    hnd.scale(0.9, 1.25, 0.6);
    hnd.translate(ex + side * Math.sin(ang - 0.15) * 0.33, ey + Math.cos(ang - 0.15) * 0.33, 0);
    const g = mergeGeometries([u.toNonIndexed(), f.toNonIndexed(), hnd.toNonIndexed()]);
    g.translate(side * 0.22, 1.4, 0);
    g.userData.tip = [side * 0.22 + ex + side * Math.sin(ang - 0.15) * 0.36, 1.4 + ey + Math.cos(ang - 0.15) * 0.36];
    return g;
  };
  const armDown = (side) => {
    const a = new CapsuleGeometry(0.042, 0.5, 3, 6);
    a.translate(0, -0.27, 0);
    a.rotateZ(side * 0.1);
    a.translate(side * 0.23, 1.4, 0);
    return a.toNonIndexed();
  };
  const oneUp = armUp(1, 0.1), armsBothGeo = mergeGeometries([armUp(1, 0.3), armUp(-1, 0.3)]), armsOneGeo = mergeGeometries([oneUp, armDown(-1)]), PHONE_AT = oneUp.userData.tip, armsDownGeo = mergeGeometries([armDown(1), armDown(-1)]);
  const crowdMat = new MeshStandardMaterial({ color: 16777215, roughness: 0.8 });
  const crowd = new InstancedMesh(crowdGeo, crowdMat, CROWD_N), crowdHair = new InstancedMesh(hairGeo, new MeshStandardMaterial({ color: 788743, roughness: 0.6 }), CROWD_N);
  const arms = new InstancedMesh(armsBothGeo, crowdMat, CROWD_N), armsOne = new InstancedMesh(armsOneGeo, crowdMat, CROWD_N), armsDown = new InstancedMesh(armsDownGeo, crowdMat, CROWD_N);
  for (const m of [crowd, crowdHair, arms, armsOne, armsDown]) {
    m.instanceMatrix.setUsage(DynamicDrawUsage);
    m.castShadow = false;
    m.receiveShadow = true;
    m.frustumCulled = false;
  }
  const CP = [];
  {
    const cols = [1710624, 2301994, 3023904, 1053720, 3813424, 2107960, 4864554, 5906464, 2767402, 6974064, 9077880];
    const c = new Color();
    for (let i = 0; i < CROWD_N; i++) {
      let x, z;
      do {
        x = (rnd() - 0.5) * 30;
        z = 3.6 + Math.pow(rnd(), 0.9) * 24;
      } while (Math.abs(x) > 6 + z * 0.9);
      CP.push({ x, z, s: 0.88 + rnd() * 0.22, ph: rnd() * 6.28, r: rnd(), r2: rnd(), jumper: rnd() < 0.6, phone: rnd() < 0.22, yaw: (rnd() - 0.5) * 0.5 });
      c.setHex(cols[Math.floor(rnd() * cols.length)]).multiplyScalar(0.22 + rnd() * 0.22);
      crowd.setColorAt(i, c);
      arms.setColorAt(i, c);
      armsOne.setColorAt(i, c);
      armsDown.setColorAt(i, c);
    }
  }
  scene.add(crowd, crowdHair, arms, armsOne, armsDown);
  const PHONES = 160, phoneGeo = new BufferGeometry(), phonePos = new Float32Array(PHONES * 3);
  phoneGeo.setAttribute("position", new BufferAttribute(phonePos, 3));
  const phonePts = new Points(phoneGeo, new PointsMaterial({ map: flareTex, size: 0.32, color: 14674175, transparent: true, depthWrite: false, blending: AdditiveBlending, fog: false }));
  phonePts.frustumCulled = false;
  scene.add(phonePts);
  const _m = new Matrix4(), _p = V3(), _s = V3(), _e = new Euler(), _z = new Matrix4().makeScale(0, 0, 0), _hp = V3();
  let crowdHit = 0;
  function updateCrowd(t, beatPh, hype, dt) {
    crowdHit *= Math.exp(-dt * 2.2);
    let ph = 0;
    for (let i = 0; i < CROWD_N; i++) {
      const c = CP[i], near = c.z < 9 ? 1 : 0.5;
      if (Math.hypot(c.x - camera.position.x, c.z - camera.position.z) < 2.3 && camera.position.y < 3.2) {
        for (const m of [crowd, crowdHair, arms, armsOne, armsDown]) m.setMatrixAt(i, _z);
        c.zD = c.zU = c.zO = true;
        continue;
      }
      const jumpAmt = (c.jumper ? Math.max(0, Math.sin(beatPh * Math.PI * 2 + c.ph * 0.25)) * 0.2 * smooth(0.25, 0.9, hype) : 0) + crowdHit * 0.12 * near * (0.5 + c.r2);
      const sway = Math.sin(t * 1.3 + c.ph) * 0.04;
      _p.set(c.x + sway, jumpAmt, c.z);
      _e.set(0, Math.PI + c.yaw, sway * 0.6);
      _q.setFromEuler(_e);
      _s.set(c.s, c.s, c.s);
      _m.compose(_p, _q, _s);
      crowd.setMatrixAt(i, _m);
      crowdHair.setMatrixAt(i, _m);
      const up = c.r < 0.1 + hype * 0.55 + crowdHit * 0.35 * near, phone = c.phone && !up;
      if (!(up || phone)) {
        armsDown.setMatrixAt(i, _m);
        c.zD = false;
      } else if (!c.zD) {
        armsDown.setMatrixAt(i, _z);
        c.zD = true;
      }
      if (up) {
        _s.set(c.s, c.s * (0.88 + 0.12 * Math.sin(beatPh * Math.PI * 2 + c.ph)), c.s);
        _m.compose(_p, _q, _s);
        arms.setMatrixAt(i, _m);
        c.zU = false;
      } else if (!c.zU) {
        arms.setMatrixAt(i, _z);
        c.zU = true;
      }
      if (phone) {
        _m.compose(_p, _q, _s);
        armsOne.setMatrixAt(i, _m);
        c.zO = false;
        if (ph < PHONES) {
          _hp.set(PHONE_AT[0], PHONE_AT[1] + 0.02, 0.06).applyMatrix4(_m);
          phonePos[ph * 3] = _hp.x;
          phonePos[ph * 3 + 1] = _hp.y;
          phonePos[ph * 3 + 2] = _hp.z;
          ph++;
        }
      } else if (!c.zO) {
        armsOne.setMatrixAt(i, _z);
        c.zO = true;
      }
    }
    for (let k = ph; k < PHONES; k++) phonePos[k * 3 + 1] = -10;
    phonePts.material.size = 0.3 + crowdHit * 0.12;
    for (const m of [crowd, crowdHair, arms, armsOne, armsDown]) m.instanceMatrix.needsUpdate = true;
    phoneGeo.attributes.position.needsUpdate = true;
  }
  function makePoints(N, additive) {
    const geo = new BufferGeometry(), pos = new Float32Array(N * 3), col = new Float32Array(N * 4), size = new Float32Array(N);
    geo.setAttribute("position", new BufferAttribute(pos, 3));
    geo.setAttribute("col", new BufferAttribute(col, 4));
    geo.setAttribute("size", new BufferAttribute(size, 1));
    const mat = new ShaderMaterial({
      uniforms: { uScale: { value: 600 } },
      vertexShader: "attribute vec4 col; attribute float size; uniform float uScale; varying vec4 vC; void main(){ vC = col; vec4 mv = modelViewMatrix * vec4(position,1.); gl_PointSize = size * uScale / max(.1, -mv.z); gl_Position = projectionMatrix * mv; }",
      fragmentShader: additive ? "varying vec4 vC; void main(){ float d = length(gl_PointCoord - .5); float a = smoothstep(.5, 0., d); gl_FragColor = vec4(vC.rgb * vC.a * a * a, 1.); }" : "varying vec4 vC; void main(){ float d = length(gl_PointCoord - .5); float a = smoothstep(.5, .1, d); gl_FragColor = vec4(vC.rgb, vC.a * a); }",
      transparent: true,
      depthWrite: false,
      blending: additive ? AdditiveBlending : NormalBlending,
      fog: false
    });
    const pts = new Points(geo, mat);
    pts.frustumCulled = false;
    scene.add(pts);
    const P = Array.from({ length: N }, () => ({ life: 0 }));
    return { pts, geo, pos, col, size, P, N, next: 0, mat };
  }
  const sparks = makePoints(3500, true), smoke = makePoints(500, false);
  function emit(sys, x, y, z, vx, vy, vz, life, size, r, g, b, opts = {}) {
    var _a, _b, _c, _d;
    const p = sys.P[sys.next];
    sys.next = (sys.next + 1) % sys.N;
    sys.idle = false;
    sys.pts.visible = true;
    Object.assign(p, { x, y, z, vx, vy, vz, life, max: life, size, r, g, b, grav: (_a = opts.grav) != null ? _a : -9, drag: (_b = opts.drag) != null ? _b : 0.6, grow: (_c = opts.grow) != null ? _c : 0, fade: (_d = opts.fade) != null ? _d : 1, fire: opts.fire || 0 });
  }
  function stepPoints(sys, dt) {
    if (sys.idle) return;
    let alive = 0;
    for (let i = 0; i < sys.N; i++) {
      const p = sys.P[i];
      if (p.life <= 0) {
        sys.col[i * 4 + 3] = 0;
        sys.size[i] = 0;
        continue;
      }
      alive++;
      p.life -= dt;
      const k = clamp(p.life / p.max, 0, 1), dr = Math.exp(-p.drag * dt);
      p.vx *= dr;
      p.vy = p.vy * dr + p.grav * dt;
      p.vz *= dr;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
      if (p.y < 0.02 && p.vy < 0) {
        p.y = 0.02;
        p.vy *= -0.3;
      }
      sys.pos[i * 3] = p.x;
      sys.pos[i * 3 + 1] = p.y;
      sys.pos[i * 3 + 2] = p.z;
      let r = p.r, g = p.g, b = p.b;
      if (p.fire) {
        r = 1;
        g = 0.25 + 0.6 * k * k;
        b = 0.08 * k;
      }
      sys.col[i * 4] = r;
      sys.col[i * 4 + 1] = g;
      sys.col[i * 4 + 2] = b;
      sys.col[i * 4 + 3] = Math.pow(k, p.fade) * (p.fire ? 3 : 1);
      sys.size[i] = p.size * (1 + p.grow * (1 - k));
    }
    sys.geo.attributes.position.needsUpdate = sys.geo.attributes.col.needsUpdate = sys.geo.attributes.size.needsUpdate = true;
    if (!alive) {
      sys.idle = true;
      sys.pts.visible = false;
    }
  }
  const CONF_N = 1400;
  const confGeo = new PlaneGeometry(0.05, 0.075);
  const confMat = new MeshStandardMaterial({ color: 16777215, metalness: 0.75, roughness: 0.3, side: DoubleSide, emissive: 1118481 });
  const confMesh = new InstancedMesh(confGeo, confMat, CONF_N);
  confMesh.instanceMatrix.setUsage(DynamicDrawUsage);
  confMesh.frustumCulled = false;
  scene.add(confMesh);
  const CF = Array.from({ length: CONF_N }, () => ({ life: 0 }));
  let confNext = 0;
  {
    const c = new Color(), pal = [16765770, 16727150, 3986175, 16777215, 13073919, 16752672];
    for (let i = 0; i < CONF_N; i++) confMesh.setColorAt(i, c.setHex(pal[i % pal.length]));
    _m.makeScale(0, 0, 0);
    for (let i = 0; i < CONF_N; i++) confMesh.setMatrixAt(i, _m);
  }
  let confIdle = false;
  function confettiBurst(n = 500) {
    confIdle = false;
    confMesh.visible = true;
    for (let k = 0; k < n; k++) {
      const p = CF[confNext];
      confNext = (confNext + 1) % CONF_N;
      const side = k % 2 ? 1 : -1;
      Object.assign(p, { x: side * (3 + rnd() * 4), y: 8.6, z: 1 + rnd() * 2, vx: (rnd() - 0.5) * 6 - side * 1.5, vy: 2 + rnd() * 4, vz: 3 + rnd() * 6, life: 7 + rnd() * 3, rx: rnd() * 6, ry: rnd() * 6, w: 4 + rnd() * 6, ph: rnd() * 6 });
    }
  }
  function stepConfetti(dt) {
    if (confIdle) return;
    let alive = 0;
    for (let i = 0; i < CONF_N; i++) {
      const p = CF[i];
      if (p.life <= 0) continue;
      alive++;
      p.life -= dt;
      p.vy = Math.max(-0.8, p.vy - 6 * dt);
      p.vx *= Math.exp(-dt * 0.9);
      p.vz *= Math.exp(-dt * 0.9);
      p.x += (p.vx + Math.sin(p.ph + p.life * 3) * 0.4) * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
      p.rx += p.w * dt;
      p.ry += p.w * 0.7 * dt;
      if (p.y < 0.03) {
        p.y = 0.03;
        p.vx = p.vz = 0;
        p.w = 0;
      }
      _p.set(p.x, p.y, p.z);
      _e.set(p.rx, p.ry, 0);
      _q.setFromEuler(_e);
      const s = p.life > 0 ? 1 : 0;
      _s.set(s, s, s);
      _m.compose(_p, _q, _s);
      confMesh.setMatrixAt(i, _m);
      if (p.life <= 0) {
        _m.makeScale(0, 0, 0);
        confMesh.setMatrixAt(i, _m);
      }
    }
    confMesh.instanceMatrix.needsUpdate = true;
    if (!alive) {
      confIdle = true;
      confMesh.visible = false;
    }
  }
  const PYRO_X = [-6.5, -3.2, 3.2, 6.5];
  const flames = [];
  function pyro(strength = 1) {
    for (const x of PYRO_X) flames.push({ x, z: 1.4, t: 0, len: 0.9 * strength });
    pyroLight.intensity = 140 * strength;
    sfx.pyro();
    shake(0.35 * strength);
  }
  const gerbs = [];
  function sparkFountains(dur = 3) {
    for (const x of [-7.4, -5, 5, 7.4]) gerbs.push({ x, z: -4.6, t: 0, dur });
  }
  function stepFx(dt) {
    for (let i = flames.length - 1; i >= 0; i--) {
      const f = flames[i];
      f.t += dt;
      if (f.t > f.len) {
        flames.splice(i, 1);
        continue;
      }
      for (let k = 0; k < 9; k++) emit(sparks, f.x + (rnd() - 0.5) * 0.15, DECK + 0.1, f.z + (rnd() - 0.5) * 0.15, (rnd() - 0.5) * 0.8, 9 + rnd() * 4, (rnd() - 0.5) * 0.8, 0.55 + rnd() * 0.3, 0.55 + rnd() * 0.5, 1, 0.5, 0.1, { grav: 2, drag: 1.6, grow: 1.6, fire: 1, fade: 1.2 });
      if (rnd() < 0.5) emit(smoke, f.x, DECK + 4 + rnd() * 2, f.z, rnd() - 0.5, 1.5, rnd() - 0.5, 2.5, 1.2, 0.08, 0.07, 0.07, { grav: 0.3, drag: 0.8, grow: 2.5, fade: 1 });
    }
    for (let i = gerbs.length - 1; i >= 0; i--) {
      const g = gerbs[i];
      g.t += dt;
      if (g.t > g.dur) {
        gerbs.splice(i, 1);
        continue;
      }
      for (let k = 0; k < 14; k++) {
        const a = rnd() * 6.28, sp = rnd() * 1.2;
        emit(sparks, g.x, DECK + 0.1, g.z, Math.cos(a) * sp, 7 + rnd() * 3, Math.sin(a) * sp, 1 + rnd() * 0.6, 0.06 + rnd() * 0.05, 1, 0.85, 0.5, { grav: -9, drag: 0.3, fade: 0.6 });
      }
    }
    pyroLight.intensity *= Math.exp(-dt * 5);
    stepPoints(sparks, dt);
    stepPoints(smoke, dt);
    stepConfetti(dt);
  }
  function patchAO() {
    const ao = state().passes.ao;
    if (ao && !ao._patched) {
      const o = ao.overrideVisibility.bind(ao);
      ao.overrideVisibility = function() {
        o();
        scene.traverse((x) => {
          if (x.userData.noAO || x.isSprite || x.isInstancedMesh && x === confMesh) x.visible = false;
        });
      };
      ao._patched = true;
    }
  }
  const INSTS = {
    guitar: { n: "GUITAR", how: "<b>Left arm</b> picks the color (raise it high, middle, or let it hang low) · <b>right hand strums</b> up and down at your hip as the orb lands" },
    drums: { n: "DRUMS", how: "<b>Strike the drums</b> like real sticks: chop down on snare and tom, whack the cymbals out wide · <b>JUMP</b> for the big crash" },
    vocals: { n: "LEAD SINGER", how: "<b>Put your hands in the rings</b> as the orbs land · strike the pose!" }
  };
  const GENRE_LOOK = {
    rock: { led: "rock", col: [16726554, 16756768, 16719952], hud: ["#ff5a2a", "#ffc23c"] },
    pop: { led: "synth", col: [16723880, 3135743, 10116095], hud: ["#ff4fc0", "#4fe0ff"] },
    funk: { led: "funk", col: [16756782, 16732120, 4390832], hud: ["#ffb02e", "#ff6fe0"] },
    dance: { led: "dance", col: [3135743, 8018943, 3997616], hud: ["#3cd2ff", "#b07dff"] }
  };
  const GENRES = LIB.genres.filter((g) => g.songs && g.songs.length);
  const genreOf = (id) => GENRES.find((g) => g.id === id) || GENRES[0];
  const songsOf = (id) => (genreOf(id) || { songs: [] }).songs;
  const G0 = (() => {
    var _a;
    const g = genreOf(QS.get("genre") || localStorage.ab_genre);
    const ss = g ? g.songs : [];
    const q = (_a = QS.get("song")) != null ? _a : localStorage["ab_song_" + (g && g.id)];
    const sg = ss.find((x) => x.id === q) || ss[+q || 0] || ss[0];
    return { genre: g ? g.id : "rock", songId: sg ? sg.id : "" };
  })();
  const G = {
    state: "loading",
    inst: ["guitar", "drums", "vocals"].includes(QS.get("inst") || localStorage.ab_inst) ? QS.get("inst") || localStorage.ab_inst : "guitar",
    genre: G0.genre,
    songId: G0.songId,
    pick: QS.has("inst") || QS.has("song") ? "inst" : "genre",
    focus: 0,
    score: 0,
    combo: 0,
    maxCombo: 0,
    hits: 0,
    misses: 0,
    perfects: 0,
    shown: 0,
    crowd: 0.5,
    star: 0,
    starOn: false,
    starEnd: 0,
    mult: 1,
    t: -1,
    level: 0,
    assist: 0,
    stars: 0,
    fps: 60,
    shot: "title",
    slowmo: 0,
    cues: [],
    song: null,
    recent: [],
    strums: 0,
    padHits: 0,
    judged: [],
    encore: false,
    lastJudge: "",
    bar: -1,
    beatPh: 0
  };
  window.__game = G;
  window.__dbg = {};
  const lookOf = (gid) => ({ id: gid, name: "AIR BAND LIVE", ...GENRE_LOOK[gid] || GENRE_LOOK.rock });
  let curSong = lookOf(G.genre), song = { beats: [], off: 0, beat: 0.5, bar: 2, dur: 1, end: 1, sections: [], lyrics: [] }, cands = [], spawnPtr = 0, lastShown = null, audioStart = null, songG = null, pendingBuf = null;
  const LEAD_BASE = 1.6;
  const VOX = () => G.inst === "vocals";
  const leadT = () => VOX() ? 2.6 : LEAD_BASE;
  function playSong(buf, when, offset) {
    stopSong(0);
    const src = ac.createBufferSource();
    src.buffer = buf;
    songG = ac.createGain();
    songG.gain.value = 1;
    src.connect(songG);
    songG.connect(music);
    src.start(Math.max(ac.currentTime, when), Math.max(0, offset));
    songSrc = src;
  }
  function stopSong(fade = 0.4) {
    if (!songSrc || !ac) return;
    const src = songSrc, g = songG, t = ac.currentTime;
    songSrc = null;
    try {
      if (fade > 0) {
        g.gain.setTargetAtTime(0, t, fade / 3);
        src.stop(t + fade + 0.1);
      } else src.stop();
    } catch (e) {
    }
  }
  const withTimeout = (p, ms) => Promise.race([p, new Promise((_, no) => setTimeout(() => no(new Error("timeout")), ms))]);
  async function startShow(encore = false) {
    if (G.starting || !G.songId) return;
    G.starting = true;
    audioInit();
    RS.grace && RS.grace(3e3);
    state().grace && state().grace(3e3);
    const gid = G.genre, sid = G.songId, sb = $("startBtn");
    sb.textContent = "LOADING…";
    let data, buf = null;
    try {
      data = await loadSongData(gid, sid);
    } catch (e) {
      console.warn("airband: song did not load", e);
      sb.textContent = "START";
      G.starting = false;
      return;
    }
    try {
      buf = await withTimeout(loadSongAudio(gid, sid), 2e4);
    } catch (e) {
      console.warn("airband: music did not load, playing on the clock", e);
    }
    sb.textContent = "START";
    G.starting = false;
    localStorage.ab_inst = G.inst;
    localStorage.ab_genre = gid;
    localStorage["ab_song_" + gid] = sid;
    curSong = { id: gid, name: data.name, led: data.led, col: data.col, hud: data.hud };
    song = songTiming(data);
    cands = buildChart(data, G.inst);
    G.cues = cands;
    G.song = { id: sid, genre: gid, name: data.name, dur: song.dur, bar: song.bar, end: song.end, cues: cands.length };
    Object.assign(G, { score: 0, combo: 0, maxCombo: 0, hits: 0, misses: 0, perfects: 0, shown: 0, crowd: 0.5, star: 0, starOn: false, mult: 1, level: 0, assist: 0, recent: [], strums: 0, padHits: 0, encore, bar: -1, finaleAt: 0 });
    spawnPtr = 0;
    lastShown = null;
    G.t = -0.4;
    pendingBuf = null;
    audioStart = ac && ac.state === "running" ? ac.currentTime + 0.4 : null;
    if (buf && audioStart !== null) playSong(buf, audioStart, 0);
    else {
      stopSong(0);
      pendingBuf = buf;
    }
    G.state = "play";
    G.actStart = BP.activity.activeSec;
    G.kcalStart = BP.activity.kcal;
    $("title").classList.add("hide");
    $("end").classList.add("hide");
    setShow(curSong);
    hero.root.visible = false;
    heroGtr.visible = heroKit.visible = heroStand.visible = heroMic.visible = false;
    hero.root.removeFromParent();
    bandDrummer.root.visible = rearKit.visible = true;
    bandGtr.root.visible = true;
    cutTo("wide");
  }
  function setShow(S) {
    G.pal = S.col.map((c) => new Color(c));
  }
  setShow(curSong);
  function clockNow() {
    if (ac && ac.state === "running") {
      if (audioStart === null) {
        audioStart = ac.currentTime - G.t;
        if (pendingBuf && G.state === "play") {
          playSong(pendingBuf, ac.currentTime + Math.max(0, -G.t), Math.max(0, G.t));
          pendingBuf = null;
        }
      }
      return ac.currentTime - audioStart - (ac.outputLatency || 0) - (ac.baseLatency || 0) * 0.5;
    }
    return null;
  }
  function decideCues() {
    const p = G.t / song.end;
    const acc = G.recent.length >= 6 ? G.recent.reduce((a, b) => a + b, 0) / G.recent.length : 0.8;
    let lvl = p < 0.1 ? 0 : p < 0.4 ? 1 : 2;
    if (acc < 0.5) lvl = Math.min(lvl, 1);
    if (acc < 0.3) lvl = 0;
    if (QS.has("easy")) lvl = 0;
    G.level = lvl;
    G.assist = acc < 0.45 ? 1 : acc < 0.65 ? 0.5 : 0;
    const gap = G.inst === "vocals" ? 1.3 : G.inst === "drums" ? 0.22 : 0.24;
    while (spawnPtr < cands.length && cands[spawnPtr].t - leadT() <= G.t) {
      const c = cands[spawnPtr++];
      c.decided = true;
      let ok = c.tier <= lvl;
      if (ok && lastShown && c.t - lastShown.t < (lastShown.pad && c.pad && lastShown.pad !== c.pad ? 0.2 : gap)) ok = false;
      if (ok && c.pad === "JUMP" && lastShown && c.t - lastShown.t < 0.5) ok = false;
      c.shown = ok;
      if (ok) {
        lastShown = c;
        G.shown++;
        c.open = G.inst === "guitar" && G.assist >= 1;
        c.win = (VOX() ? 1.8 : 1) + 0.35 * G.assist;
      }
    }
  }
  function hitSound(c) {
    var _a, _b;
    if (!ac || audioStart === null) return;
    const t = ac.currentTime + 3e-3, v = G.starOn ? 1.2 : 1;
    if (G.inst === "drums") (_b = (_a = { HH: () => DR.hat(t, 0.8 * v), SN: () => DR.snare(t, 0.5 * v), TM: () => DR.tom(t, 0.55 * v, 1), CY: () => DR.crash(t, 0.35 * v), JUMP: () => {
      DR.kick(t, 0.7 * v);
      DR.crash(t, 0.45 * v);
    } })[c.pad]) == null ? void 0 : _b.call(_a);
    else if (G.inst === "guitar") {
      nz(t, 0.05, 0.2 * v, "bandpass", 2600, 2.2, B.gtr);
      nz(t + 0.012, 0.04, 0.12 * v, "bandpass", 3400, 2.2, B.gtr);
    } else {
      osc("sine", 1318, t, 0.18, envG(t, 4e-3, 0.05 * v, 0.18, B.vox));
      osc("sine", 1976, t + 0.03, 0.2, envG(t + 0.03, 4e-3, 0.035 * v, 0.2, B.vox));
    }
  }
  const PTS = { perfect: 100, great: 75, good: 50, ok: 25 };
  function judge(c, d, forceQ) {
    if (c.res) return;
    const ad = Math.abs(d - 0.03), q = forceQ || (ad < 0.075 * c.win ? "perfect" : ad < 0.14 * c.win ? "great" : "good");
    c.res = q;
    c.hitT = G.t;
    G.hits++;
    if (q === "perfect") G.perfects++;
    G.combo++;
    G.maxCombo = Math.max(G.maxCombo, G.combo);
    G.mult = Math.min(4, 1 + Math.floor(G.combo / 10));
    G.score += PTS[q] * G.mult * (G.starOn ? 2 : 1);
    G.crowd = clamp(G.crowd + 0.025, 0, 1);
    G.recent.push(q === "ok" ? 0.6 : 1);
    if (G.recent.length > 12) G.recent.shift();
    if (c.gold) G.star = clamp(G.star + 0.09, 0, 1);
    G.lastJudge = q;
    hitSound(c);
    hitFx(c, q);
    if ([25, 50, 100, 150, 200].includes(G.combo)) {
      banner("".concat(G.combo, " COMBO!"), "");
      heroMoment(1.3);
      sfx.cheer(1);
    }
  }
  function miss(c) {
    if (c.res) return;
    c.res = "miss";
    G.misses++;
    G.combo = 0;
    G.mult = 1;
    G.crowd = clamp(G.crowd - 0.04, 0, 1);
    G.recent.push(0);
    if (G.recent.length > 12) G.recent.shift();
    G.lastJudge = "miss";
    popAt({ x: cuePos(c)[0][0], y: cuePos(c)[0][1], t: 0, txt: "MISS", c: "#9a9aa8" });
    if (G.inst === "guitar") sfx.dud();
  }
  const WIN = { drums: [0.3, 0.34], guitar: [0.24, 0.3], vocals: [0.25, 0.34] };
  const winE = (c) => (WIN[G.inst] || WIN.drums)[0] * c.win, winL = (c) => (WIN[G.inst] || WIN.drums)[1] * c.win;
  function inWindow(c) {
    const d = G.t - c.t;
    return d > -winE(c) && d < winL(c);
  }
  function nextCue() {
    for (let k = Math.max(0, spawnPtr - 40); k < spawnPtr; k++) {
      const c = cands[k];
      if (c.shown && !c.res && G.t - c.t < winL(c) && c.t - G.t < leadT()) return c;
    }
    return null;
  }
  function nearestCue(filter) {
    let best = null, bd = 9;
    for (let k = Math.max(0, spawnPtr - 40); k < spawnPtr; k++) {
      const c = cands[k];
      if (!c.shown || c.res || !inWindow(c) || filter && !filter(c)) continue;
      const d = Math.abs(G.t - c.t);
      if (d < bd) {
        bd = d;
        best = c;
      }
    }
    return best;
  }
  const IN = { zone: 1, zoneHist: [], armed: true, lastDir: 0, inside: {}, padCool: {}, starHold: 0, matchT: {}, strumFlash: 0, padFlash: {}, enterT: {}, prev: {}, inStrum: {} };
  function fretHand() {
    const L = BP.hands.left, Rh = BP.hands.right;
    return L.seen && !BP.mouse ? L : Rh;
  }
  function updateZone(now) {
    const h = fretHand(), y = h.y;
    let z = IN.zone;
    if (y < 0.37) z = 2;
    else if (y > 0.63) z = 0;
    else if (y > 0.41 && y < 0.59) z = 1;
    IN.zone = z;
    IN.zoneHist.push([G.t, z]);
    while (IN.zoneHist.length && G.t - IN.zoneHist[0][0] > 0.35) IN.zoneHist.shift();
  }
  function strum() {
    IN.strumFlash = 1;
    G.strums++;
    const c = nearestCue();
    if (!c) {
      if (ac) {
        const t = ac.currentTime;
        nz(t, 0.05, 0.08, "bandpass", 1800, 2, B.gtr);
      }
      return;
    }
    const zoneOk = c.open || IN.zone === c.lane || IN.zoneHist.some((z) => z[1] === c.lane);
    judge(c, G.t - c.t, zoneOk ? null : "ok");
  }
  function padHit(pad, hand) {
    G.padHits++;
    IN.padFlash[pad] = 1;
    const c = nearestCue((x) => x.pad === pad);
    if (c) judge(c, G.t - c.t);
    else if (ac && G.state === "play") {
      const t = ac.currentTime + 3e-3;
      ({ HH: () => DR.ohat(t, 0.35), SN: () => DR.snare(t, 0.35), TM: () => DR.tom(t, 0.4, 1), CY: () => DR.crash(t, 0.3), JUMP: () => {
        DR.kick(t, 0.5);
        DR.crash(t, 0.3);
      } })[pad]();
    }
  }
  function onJump() {
    if (G.state !== "play") return;
    if (G.inst === "drums") padHit("JUMP");
    else {
      hero.jumpV = 2.2;
    }
  }
  BP.on("jump", onJump);
  BP.on("squat", () => {
    if (G.state === "play" && G.inst === "drums") {
      const c = nearestCue((x) => x.pad === "JUMP");
      if (c) judge(c, G.t - c.t);
    }
  });
  const S_ = () => Math.min(innerWidth, innerHeight);
  function handNear(h, tx, ty, rx, ry) {
    if (!h.seen) return false;
    const s = S_();
    const dx = (h.x - tx) * innerWidth / s, dy = (h.y - ty) * innerHeight / s;
    return (dx / rx) ** 2 + (dy / ry) ** 2 < 1;
  }
  function updateInput(now, dt) {
    var _a;
    const L = BP.hands.left, Rh = BP.hands.right;
    if (G.inst === "guitar") {
      updateZone(now);
      if (Rh.seen && !BP.mouse && !(fretHand() === Rh)) {
        const v = Rh.vy, inArea = Rh.x > 0.44 && Rh.y > 0.38 && Rh.y < 0.98;
        if (IN.armed && inArea && Math.abs(v) > 0.45 && Math.abs(v) > 0.7 * Math.abs(Rh.vx)) {
          IN.armed = false;
          IN.lastDir = Math.sign(v);
          strum();
        } else if (!IN.armed && (Rh.speed < 0.3 || Math.sign(v) !== IN.lastDir && Math.abs(v) > 0.3)) IN.armed = true;
      }
      if (!BP.mouse) {
        const s = S_(), r = STRUM_R * s * 1.25;
        for (const side of ["left", "right"]) {
          const h = BP.hands[side];
          if (h === fretHand() || !h.seen) {
            IN.inStrum[side] = false;
            continue;
          }
          const inS = touches(h, STRUM_X, STRUM_Y, r, r);
          if (inS && !IN.inStrum[side] && h.speed > 0.3 && IN.armed) {
            IN.armed = false;
            IN.lastDir = Math.sign(h.vy) || 1;
            strum();
          }
          IN.inStrum[side] = inS;
        }
      }
    } else if (G.inst === "drums") {
      const s = S_(), m = s * 0.045, W = innerWidth, H = innerHeight;
      for (const side of ["left", "right"]) {
        const h = BP.hands[side];
        if (!h.seen) {
          IN.prev[side] = null;
          for (const k in PADS) IN.inside[side + k] = false;
          continue;
        }
        const prev = IN.prev[side];
        for (const [k, p] of Object.entries(PADS)) {
          if (k === "JUMP") continue;
          const rx = DRUM_R * s + m, ry = DRUM_R * DRUM_SQ * s + m, key2 = side + k, was = IN.inside[key2];
          const inside = touches(h, p.x, p.y, rx, ry), through = !inside && !was && sweptThrough(h, prev, p.x, p.y, rx, ry);
          if (inside && !was) IN.enterT[key2] = G.t;
          const cool = (IN.padCool[key2] || 0) > now;
          if ((inside || through) && !cool && h.speed > 0.45 && (p.y < 0.5 || h.vy > 0.3) && (!was || h.vy > 0.6 || h.speed > 1.2)) {
            padHit(k, side);
            IN.padCool[key2] = now + 200;
          }
          IN.inside[key2] = inside;
        }
        IN.prev[side] = [h.x * W, h.y * H];
      }
      for (let k = Math.max(0, spawnPtr - 30); k < spawnPtr; k++) {
        const c = cands[k];
        if (!c.shown || c.res || c.pad === "JUMP" || !inWindow(c)) continue;
        for (const side of ["left", "right"]) if (IN.inside[side + c.pad] && c.touchT === void 0) {
          c.touchT = G.t;
          c.touchE = (_a = IN.enterT[side + c.pad]) != null ? _a : -9;
        }
        if (c.touchT === void 0 || G.t < c.t - 0.03) continue;
        const e = c.touchE;
        if (Math.abs(e - c.t) < 0.3) judge(c, e - c.t);
        else judge(c, 0.2, "good");
        IN.padFlash[c.pad] = 1;
      }
    } else {
      const s = S_(), hs = ["left", "right"].map((k) => BP.hands[k]).filter((h) => h.seen);
      for (let k = Math.max(0, spawnPtr - 20); k < spawnPtr; k++) {
        const c = cands[k];
        if (!c.shown || c.res || !inWindow(c)) continue;
        const P = POSES[c.pose], pts = [P.L, P.R].filter(Boolean), r = RING_R * s * (1.4 + 0.3 * G.assist);
        const on = hs.map((h) => pts.map((t) => touches(h, t[0], t[1], r, r)));
        let filled = 0;
        if (pts.length === 1) filled = on.some((x) => x[0]) ? 1 : 0;
        else filled = on.length === 2 && (on[0][0] && on[1][1] || on[0][1] && on[1][0]) ? 2 : on.some((x) => x[0] || x[1]) ? 1 : 0;
        c.filled = filled;
        const full = filled === pts.length || BP.mouse && filled > 0;
        if (full && c.matchT === void 0) c.matchT = G.t;
        if (filled && c.partT === void 0) c.partT = G.t;
        if (c.matchT !== void 0 && G.t >= c.t - 0.02) judge(c, Math.max(0, c.matchT - c.t));
        else if (c.partT !== void 0 && G.t >= c.t + 0.12 * c.win) judge(c, 0.3, "good");
      }
    }
    const handsSeen = L.seen || Rh.seen || BP.mouse;
    for (let k = Math.max(0, spawnPtr - 40); k < spawnPtr; k++) {
      const c = cands[k];
      if (!c.shown || c.res) continue;
      if (inWindow(c) && handsSeen) c.sawHands = true;
      if (G.t - c.t > winL(c)) {
        if (c.sawHands || BP.simulating) miss(c);
        else {
          c.res = "skip";
          G.shown--;
        }
      }
    }
    if (G.star >= 0.5 && !G.starOn) {
      IN.starHold = BP.body.armsUp ? IN.starHold + dt : 0;
      if (IN.starHold > 0.15) starPower();
    }
    if (G.starOn) {
      G.star = Math.max(0, G.star - dt / 16);
      if (G.star <= 0) {
        G.starOn = false;
      }
    }
  }
  let hudRects = [];
  function instRects() {
    const W = innerWidth, H = innerHeight, s = Math.min(W, H), out = [];
    if (G.inst === "guitar") {
      const r = s * 0.075;
      out.push({ left: LANE_X * W - r, top: LANES[2].y * H - s * 0.1, right: LANE_X * W + r, bottom: LANES[0].y * H + s * 0.1 });
    } else if (G.inst === "drums") {
      for (const k of ["HH", "SN"]) {
        const p = PADS[k], r = s * DRUM_R;
        out.push({ left: p.x * W - r, top: p.y * H - r * DRUM_SQ, right: p.x * W + r, bottom: p.y * H + r * DRUM_SQ + s * 0.05 });
      }
    } else for (const P of Object.values(POSES)) for (const t of [P.L, P.R]) if (t && t[0] < 0.5) {
      const r = s * 0.16;
      out.push({ left: t[0] * W - r, top: t[1] * H - r, right: t[0] * W + r, bottom: t[1] * H + r });
    }
    return out;
  }
  function bannerRect() {
    const b = $("banner");
    if (!b.classList.contains("on")) return null;
    const rg = document.createRange();
    rg.selectNodeContents(b);
    const r = rg.getBoundingClientRect();
    return r.width ? r : null;
  }
  function liveTips() {
  }
  function starPower() {
    if (G.starOn || G.star < 0.5) return;
    G.starOn = true;
    IN.starHold = 0;
    banner("STAR POWER!", "", "gold");
    sfx.star();
    sfx.cheer(1.4);
    heroMoment(1.8);
    setTimeout(() => {
      pyro(1.2);
      sparkFountains(4);
      confettiBurst(700);
    }, 450);
  }
  const pops = [], sparks2d = [], rings2d = [];
  function cuePos(c) {
    if (G.inst === "guitar") return [[LANE_X, LANES[c.lane].y]];
    if (G.inst === "drums") return [[PADS[c.pad].x, PADS[c.pad].y]];
    const P = POSES[c.pose];
    return [P.L, P.R].filter(Boolean);
  }
  function cueCol(c) {
    return c.gold ? "#ffd34a" : G.inst === "guitar" ? c.open ? "#ffffff" : LANES[c.lane].c : G.inst === "drums" ? PADS[c.pad].c : "#ff7ad9";
  }
  function popAt(o) {
    for (let i = pops.length - 1; i >= 0; i--) if (Math.abs(pops[i].x - o.x) < 0.06 && Math.abs(pops[i].y - o.y) < 0.08) pops.splice(i, 1);
    pops.push(o);
  }
  function hitFx(c, q) {
    const col = cueCol(c);
    const cp = cuePos(c), cx = cp.reduce((a, p) => a + p[0], 0) / cp.length, cy = cp.reduce((a, p) => a + p[1], 0) / cp.length;
    popAt({ x: cx, y: cy, t: 0, txt: { perfect: "PERFECT!", great: "GREAT!", good: "GOOD", ok: "OFF FRET" }[q], c: q === "ok" ? "#c0c0d0" : col });
    for (const [x, y] of cp) {
      rings2d.push({ x, y, t: 0, c: col });
      for (let k = 0; k < 26; k++) {
        const a = rnd() * 6.28, sp = 0.3 + rnd() * 0.9;
        sparks2d.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0.5 + rnd() * 0.4, c: col });
      }
    }
    showPulse = 1;
    crowdHit = Math.min(1.3, crowdHit + (c.gold ? 0.9 : 0.6));
    if (c.gold) beamStrobe = 0.3;
    if (G.inst === "drums" && kitSwing[c.pad] !== void 0) kitSwing[c.pad] = 1;
    if (G.inst === "drums" && c.pad === "JUMP") {
      pyro(0.7);
    }
  }
  let showPulse = 0, beamStrobe = 0;
  const kitSwing = { HH: 0, CY: 0, SN: 0, TM: 0 };
  function banner(big, small, cls = "") {
    const b = $("banner");
    b.querySelector(".big").textContent = big;
    b.querySelector(".big").className = "big " + cls;
    b.querySelector(".small").textContent = small;
    b.classList.remove("on");
    void b.offsetWidth;
    b.classList.add("on");
    G.lastBanner = big;
  }
  let shot = "title", shotT = 0, heroT = -1, heroDur = 0, shotSeq = 0;
  const camPos = V3(0, 3, 12), camLook = V3(0, 3, -2);
  const SEQ = ["wide", "close", "crowd", "wide", "side", "jib", "wide", "reverse", "close", "sideR"];
  function cutTo(s) {
    shot = s;
    shotT = 0;
    G.shot = s;
  }
  function heroMoment(d = 1.5) {
    heroT = 0;
    heroDur = d + 1.2;
    cutTo("hero");
    flash(16777215, 0.35);
    G.slowmo++;
  }
  function shotPose(s, k, t) {
    const hp = hero.root.visible ? hero.root.position : V3(0, DECK, -1.6);
    switch (s) {
      case "title": {
        const a = t * 0.07;
        return [V3(Math.sin(a) * 9, 3.6 + Math.sin(t * 0.13) * 1.2, 9 + Math.cos(a) * 3), V3(0, 3.2, -2.5), 40];
      }
      case "wide":
        return [V3(lerp(-0.8, 0.8, k), 3.7, 11.5 - k * 0.8), V3(0, 2.7, -2), 33];
      case "close":
        return [V3(lerp(2, 1.2, k), DECK + 0.55, 5.6 - k * 0.5), V3(hp.x, DECK + 1.5, hp.z), 30];
      case "crowd":
        return [V3(-3.2 + k, 2, 15), V3(0, 3.2, -2), 30];
      case "side":
        return [V3(7.2, 3.2, 2.8 - k), V3(-0.4, DECK + 1.4, -1), 38];
      case "sideR":
        return [V3(-7, 2.4, 3.2 - k), V3(0.4, DECK + 1.6, -1), 36];
      case "jib":
        return [V3(lerp(-9, 9, k), 7.6 - k * 1.5, 10), V3(0, 2.8, -2), 42];
      case "reverse":
        return [V3(2.6 - k * 0.8, DECK + 3.3, -4), V3(-0.5, 1, 14), 50];
      case "hero": {
        const a = -0.8 + k * 1.1;
        return [V3(hp.x + Math.sin(a) * 4.6, DECK + 0.45 + k * 0.4, hp.z + Math.cos(a) * 4.6), V3(hp.x, DECK + 1.7, hp.z), 34];
      }
      case "finale":
        return [V3(Math.sin(t * 0.2) * 2, 2.4, 9 - k * 2), V3(0, 3.4, -2), 44];
    }
    return [V3(0, 3, 12), V3(0, 3, -2), 40];
  }
  function updateCamera(now, dtv, dtr) {
    shotT += dtr;
    if (shot === "hero") {
      heroT += dtr;
      if (heroT > heroDur) {
        heroT = -1;
        cutTo("wide");
      }
    }
    const len = shot === "hero" ? heroDur : 8;
    const dc = window.__dbg.cam, [p, l, fov] = dc ? [V3(...dc[0]), V3(...dc[1]), dc[2]] : shotPose(shot, clamp(shotT / len, 0, 1), now / 1e3);
    camPos.copy(p);
    camLook.copy(l);
    const hand = shot === "title" ? 0 : 0.012;
    camera.position.copy(camPos).add(V3(Math.sin(now * 11e-4) * hand * 3, Math.sin(now * 17e-4) * hand * 2, 0));
    camera.lookAt(camLook);
    if (camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }
  let ledFrame = 0;
  const ledTxt = { t: "", until: 0 };
  function drawLED(now, beatPh, hype) {
    const W = 1024, H = 480, S = curSong, t = now / 1e3, g = led;
    g.setTransform(LED_K, 0, 0, LED_K, 0, 0);
    const [c0, c1] = S.hud;
    g.globalCompositeOperation = "source-over";
    g.fillStyle = "#05030a";
    g.fillRect(0, 0, W, H);
    const pulse = Math.pow(1 - beatPh, 3) * (G.state === "play" ? 1 : 0.4);
    if (G.starOn) {
      const gr = g.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, W * 0.7);
      gr.addColorStop(0, "#d89a30");
      gr.addColorStop(0.4, "#7a3a00");
      gr.addColorStop(1, "#120500");
      g.fillStyle = gr;
      g.fillRect(0, 0, W, H);
      g.save();
      g.translate(W / 2, H / 2);
      g.rotate(t * 0.5);
      for (let k = 0; k < 16; k++) {
        g.rotate(Math.PI / 8);
        g.fillStyle = k % 2 ? "rgba(255,230,160,.12)" : "rgba(255,140,0,.1)";
        g.beginPath();
        g.moveTo(0, 0);
        g.lineTo(W, -60);
        g.lineTo(W, 60);
        g.fill();
      }
      g.restore();
    } else if (S.led === "rock") {
      const gr = g.createLinearGradient(0, H, 0, 0);
      gr.addColorStop(0, c0);
      gr.addColorStop(0.5, "#3a0805");
      gr.addColorStop(1, "#05030a");
      g.fillStyle = gr;
      g.globalAlpha = 0.6 + pulse * 0.4;
      g.fillRect(0, 0, W, H);
      g.globalAlpha = 1;
      for (let k = 0; k < 5; k++) {
        g.beginPath();
        g.moveTo(0, H);
        for (let x = 0; x <= W; x += 16) g.lineTo(x, H - (90 + k * 50) * (0.6 + 0.4 * hype) - Math.sin(x * 0.012 + t * (2 + k) + k) * 30 - Math.sin(x * 0.031 - t * 3) * 14);
        g.lineTo(W, H);
        g.fillStyle = "rgba(255,".concat(80 + k * 35, ",").concat(20 + k * 10, ",").concat(0.25 - k * 0.03, ")");
        g.fill();
      }
    } else if (S.led === "synth") {
      const gr = g.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, "#12002a");
      gr.addColorStop(0.55, "#5a0a6a");
      gr.addColorStop(0.56, "#08001a");
      gr.addColorStop(1, "#200040");
      g.fillStyle = gr;
      g.fillRect(0, 0, W, H);
      const sg = g.createLinearGradient(0, H * 0.15, 0, H * 0.55);
      sg.addColorStop(0, "#ffe36b");
      sg.addColorStop(1, "#ff2fa8");
      g.fillStyle = sg;
      g.beginPath();
      g.arc(W / 2, H * 0.55, H * (0.3 + pulse * 0.03), Math.PI, 0);
      g.fill();
      g.fillStyle = "#12002a";
      for (let k = 0; k < 6; k++) g.fillRect(0, H * (0.4 + k * 0.026), W, 3 + k * 1.5);
      g.strokeStyle = c1;
      g.lineWidth = 2;
      g.globalAlpha = 0.8;
      for (let k = 0; k < 14; k++) {
        const y = H * 0.56 + Math.pow((k + t * 1.2) % 14 / 14, 2) * H * 0.44;
        g.beginPath();
        g.moveTo(0, y);
        g.lineTo(W, y);
        g.stroke();
      }
      for (let k = -12; k <= 12; k++) {
        g.beginPath();
        g.moveTo(W / 2 + k * 14, H * 0.56);
        g.lineTo(W / 2 + k * 110, H);
        g.stroke();
      }
      g.globalAlpha = 1;
    } else {
      g.fillStyle = "#140818";
      g.fillRect(0, 0, W, H);
      g.save();
      g.translate(W / 2, H / 2);
      for (let k = 0; k < 24; k++) {
        g.rotate(Math.PI / 12);
        g.fillStyle = k % 2 ? c0 : c1;
        g.globalAlpha = 0.18 + pulse * 0.2;
        g.beginPath();
        g.moveTo(0, 0);
        g.lineTo(W, -70);
        g.lineTo(W, 70);
        g.fill();
      }
      g.restore();
      g.globalAlpha = 1;
      for (let k = 0; k < 40; k++) {
        const x = (k * 97 + t * 40 * (k % 3 + 1)) % W, y = k * 53 % H;
        g.fillStyle = k % 2 ? "#fff" : c0;
        g.globalAlpha = 0.5 + 0.5 * Math.sin(t * 4 + k);
        g.beginPath();
        g.arc(x, y, 6 + k % 4 * 3, 0, 6.28);
        g.fill();
      }
      g.globalAlpha = 1;
    }
    if (analyser && G.state !== "title") {
      analyser.getByteFrequencyData(fftData);
      const n = 32, bw = W / n;
      for (let k = 0; k < n; k++) {
        const v = fftData[k + 1] / 255, h = v * H * 0.42;
        const gr = g.createLinearGradient(0, H, 0, H - h);
        gr.addColorStop(0, c0);
        gr.addColorStop(1, "#fff");
        g.fillStyle = gr;
        g.globalAlpha = 0.35;
        g.fillRect(k * bw + 3, H - h, bw - 6, h);
      }
      g.globalAlpha = 1;
    }
    g.textAlign = "center";
    g.textBaseline = "middle";
    const lyr = (G.state === "play" || G.state === "finale") && !G.starOn && !(now < ledTxt.until) ? (song.lyrics || []).find((l) => G.t >= l.t0 - 0.15 && G.t <= l.t1 + 0.35) : null;
    const txt = lyr ? lyr.text : now < ledTxt.until ? ledTxt.t : G.starOn ? "STAR POWER" : G.state === "title" ? "AIR BAND LIVE" : S.name;
    if (true) {
      g.globalCompositeOperation = "source-over";
      ledTex.needsUpdate = true;
      return;
    }
    let fsz = lyr ? 84 : txt.length > 12 ? 92 : 118;
    g.font = "italic 900 ".concat(fsz, "px system-ui");
    const lines = [txt];
    if (g.measureText(txt).width > W * 0.92 && lyr) {
      const w = txt.split(" "), h = Math.ceil(w.length / 2);
      lines.splice(0, 1, w.slice(0, h).join(" "), w.slice(h).join(" "));
    }
    const widest = Math.max(...lines.map((l) => g.measureText(l).width));
    if (widest > W * 0.92) {
      fsz *= W * 0.92 / widest;
      g.font = "italic 900 ".concat(fsz, "px system-ui");
    }
    lines.forEach((l, k) => {
      const y = H * 0.42 + (k - (lines.length - 1) / 2) * fsz * 1.08;
      g.fillStyle = "rgba(0,0,0,.4)";
      g.fillText(l, W / 2 + 6, y + 6);
      g.fillStyle = "#fff";
      g.globalAlpha = lyr ? 0.85 : 0.6 + pulse * 0.2;
      g.fillText(l, W / 2, y);
      g.globalAlpha = 1;
    });
    ledTex.needsUpdate = true;
  }
  const PATTERNS = ["fan", "sweep", "cross", "ballyhoo"];
  const C_STAR = new Color(1, 0.8, 0.3), C_WHITE = new Color(1, 1, 1), C_STAR2 = new Color(1, 0.75, 0.3), C_STAR3 = new Color(1, 0.7, 0.2);
  function updateLights(t, beatPh, bar, hype, dt) {
    const pal = G.pal, pat = G.state === "play" ? PATTERNS[Math.floor(Math.max(0, bar) / 4) % 4] : "fan";
    const bp = Math.pow(1 - beatPh, 2);
    for (const f of fixtures) {
      const i = f.i, side = f.x / 7;
      let pan = 0, tl = 0;
      if (f.group === "floor") {
        tl = 0.25 + 0.25 * Math.sin(t * 0.9 + i);
        pan = side * 0.5 + Math.sin(t * 0.7 + i * 0.9) * 0.4;
      } else if (pat === "fan") {
        tl = 0.45 + Math.sin(t * 0.6) * 0.2;
        pan = side * 0.9 + Math.sin(t * 0.8) * 0.2;
      } else if (pat === "sweep") {
        tl = 0.6;
        pan = Math.sin(t * 1.2) * 0.9;
      } else if (pat === "cross") {
        tl = 0.5 + Math.sin(t + i) * 0.1;
        pan = -side * 0.8 + Math.sin(t * 1.5) * 0.3;
      } else {
        tl = 0.4 + 0.3 * Math.sin(t * 1.7 + i * 1.3);
        pan = Math.sin(t * 1.3 + i * 2.1) * 1.1;
      }
      if (f.group === "front") tl = -0.35 - tl * 0.5;
      f.pan.rotation.y = pan;
      f.tilt.rotation.x = f.group === "floor" ? tl : tl;
      f.tilt.rotation.z = f.group === "back" ? pan * 0.3 : 0;
      const ci = (i + Math.floor(Math.max(0, bar) / 2)) % 3;
      f.col.copy(G.starOn ? i % 2 ? C_STAR : C_WHITE : pal[ci]);
      let inten = (f.group === "floor" ? 0.9 : 0.7) * (0.55 + 0.45 * hype) * (G.state === "play" ? 0.75 + 0.5 * bp : 0.7);
      if (beamStrobe > 0 || G.starOn) inten *= Math.floor(t * 18 + i) % 2 ? 1.4 : 0.35;
      f.beam.material.uniforms.uC.value.copy(f.col);
      f.beam.material.uniforms.uI.value = inten;
      f.beam.material.uniforms.uT.value = t;
      f.lens.material.color.copy(f.col).multiplyScalar(2 + inten * 3);
      f.flare.material.color.copy(f.col);
      f.flare.material.opacity = 0.5 + inten * 0.5;
    }
    if (tvFix) tvFix(t);
    beamStrobe = Math.max(0, beamStrobe - dt);
    backL.forEach((l, k) => {
      l.color.copy(G.starOn ? C_STAR2 : pal[(k + Math.floor(Math.max(0, bar) / 2)) % 3]);
      l.intensity = 170 + 210 * bp * hype;
    });
    key.intensity = 190 + showPulse * 120;
    showPulse *= Math.exp(-dt * 6);
    ledLight.color.copy(G.starOn ? C_STAR3 : pal[0]);
    ledLight.intensity = 25 + 25 * bp;
    spill.color.copy(pal[1]);
    spill.intensity = 0.12 + 0.3 * hype * bp;
    hazeMat.uniforms.uT.value = t;
    hazeMat.uniforms.uC.value.copy(pal[0]).lerp(C_WHITE, 0.55);
    hazeMat.uniforms.uI.value = 0.014 + 0.014 * bp;
    if (state().passes.bloom) state().passes.bloom.strength = 0.2 + 0.15 * bp * (G.state === "play" ? 1 : 0.4) + (G.starOn ? 0.12 : 0);
  }
  function animateBand(t, beatPh, beat, bar, dtv) {
    var _a;
    const L = BP.hands.left, Rh = BP.hands.right, live = BP.live || BP.mouse, playing = G.state === "play" || G.state === "finale";
    const bounce = Math.abs(Math.sin(beatPh * Math.PI)) * (playing ? 1 : 0.4);
    hero.jumpV = hero.jumpV || 0;
    hero.jump = Math.max(0, (hero.jump || 0) + hero.jumpV * dtv);
    hero.jumpV -= 9 * dtv;
    if (hero.jump <= 0) {
      hero.jump = 0;
      hero.jumpV = 0;
    }
    if (BP.body.jumping && hero.jump === 0) hero.jumpV = 2.4;
    hero.bounce = bounce;
    const lean = BP.body.lean || 0;
    hero.root.position.x = PLAYER_POS.x + clamp(BP.body.x || 0, -1, 1) * 0.6;
    const mx = (h) => h.x - 0.5, my = (h) => 1 - h.y;
    let hl, hr;
    if (G.inst === "guitar" && G.state !== "title") {
      const fk = live ? clamp(my(fretHand()) * 1.3 - 0.2, 0, 1) : 0.5 + 0.3 * Math.sin(t);
      const sy = live && Rh.seen && fretHand() !== Rh ? clamp((0.55 - Rh.y) * 0.5, -0.12, 0.14) : Math.sin(t * 12) * 0.05;
      [hl, hr] = holdGuitar(hero, heroGtr, fk, sy);
    } else if (G.inst === "drums" && G.state !== "title") {
      const tgt = (h) => V3(mx(h) * 1.5, 0.62 + my(h) * 0.95, 0.42);
      hl = live && L.seen ? tgt(L) : V3(-0.3, 0.85 + Math.max(0, Math.sin(t * 8)) * 0.2, 0.42);
      hr = live && Rh.seen ? tgt(Rh) : V3(0.38, 0.75 + Math.max(0, Math.sin(t * 8 + 3)) * 0.2, 0.4);
    } else {
      const tgt = (h) => V3(mx(h) * 1.7, 0.75 + my(h) * 1.5, 0.26);
      hl = live && L.seen ? tgt(L) : V3(-0.32, 1.05 + Math.sin(t * 2) * 0.1, 0.2);
      hr = live && Rh.seen ? tgt(Rh) : V3(0.08, 1.5, 0.3);
    }
    if (hero.root.visible) posePerson(hero, hl, hr, { bounce, lean, jump: hero.jump, nod: playing ? bounce : 0 });
    if (heroMic.visible) {
      heroMic.position.copy(hero.arms[1].t).add(V3(-0.02, 0.06, 0.02));
      heroMic.rotation.set(0.5, 0, 0.3);
    }
    if (G.state === "title") {
      heroGtr.visible = true;
      heroKit.visible = heroStand.visible = heroMic.visible = false;
      holdGuitar(hero, heroGtr, 0.5 + 0.3 * Math.sin(t), 0);
    }
    const hit = Math.pow(1 - beatPh, 6);
    if (bandDrummer.root.visible) {
      bandDrummer.bounce = bounce * 0.5;
      const lh = V3(-0.26, 0.84 + (beat % 2 === 1 ? 0.2 * (1 - hit) : 0.12), 0.36), rh = V3(-0.44, 1 + 0.09 * Math.abs(Math.sin(t * 13)), 0.34);
      posePerson(bandDrummer, lh, rh, { bounce: bounce * 0.4, nod: bounce, sit: true });
    }
    {
      const K = rearKit.userData.K;
      for (const [k, c] of [["HH", K.HH], ["CY", K.CY], ["RI", K.RI]]) {
        const a = (_a = kitSwing[k]) != null ? _a : beat % 4 === 0 ? hit * 0.3 : 0;
        c.rotation.x = c.userData.tilt + Math.sin(t * 19) * 0.09 * a;
        c.rotation.z = Math.cos(t * 15) * 0.06 * a;
      }
      for (const k in kitSwing) kitSwing[k] *= Math.exp(-dtv * 3.5);
    }
    for (const [P, g, off] of [[bandBass, bassGtr, 1], [bandGtr, sideGtr, 2]]) {
      if (!P.root.visible) continue;
      P.bounce = bounce;
      const [a, b] = holdGuitar(P, g, 0.4 + 0.15 * Math.sin(t * 0.7 + off), playing ? Math.sin(t * (off === 1 ? 8 : 14)) * 0.06 : 0);
      posePerson(P, a, b, { bounce, nod: bounce * 0.8, look: Math.sin(t * 0.3 + off) * 0.3 });
    }
  }
  const hud = $("hud"), ctx = hud.getContext("2d");
  function sizeHud() {
    hud.width = innerWidth * PR;
    hud.height = innerHeight * PR;
    hud.style.width = innerWidth + "px";
    hud.style.height = innerHeight + "px";
  }
  addEventListener("resize", sizeHud);
  sizeHud();
  function glowCircle(x, y, r, col, a = 1) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, col);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalAlpha = a;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 6.283);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  function orb(x, y, r, col, a = 1, gold = false) {
    ctx.save();
    ctx.globalAlpha = a;
    {
      const h = ctx.createRadialGradient(x, y, r * 0.8, x, y, r * 1.7);
      h.addColorStop(0, "rgba(6,0,14,0.6)");
      h.addColorStop(1, "rgba(6,0,14,0)");
      ctx.fillStyle = h;
      ctx.beginPath();
      ctx.arc(x, y, r * 1.7, 0, 6.283);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "lighter";
    glowCircle(x, y, r * 1.9, col, 0.4 * a);
    ctx.globalCompositeOperation = "source-over";
    const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.05, x, y, r);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.3, col);
    g.addColorStop(1, "rgba(10,0,20,0.9)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 6.283);
    ctx.fill();
    ctx.lineWidth = Math.max(3, r * 0.24);
    ctx.strokeStyle = "rgba(6,0,14,0.8)";
    ctx.stroke();
    ctx.lineWidth = Math.max(2, r * 0.12);
    ctx.strokeStyle = gold ? "#fff3b0" : col;
    ctx.stroke();
    if (gold) {
      ctx.fillStyle = "#fff";
      ctx.font = "900 ".concat(r * 0.9, "px system-ui");
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("★", x, y + r * 0.05);
    }
    ctx.restore();
  }
  function pill(x, y, w, h, fill, stroke) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, h / 2);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
  function drawStickPose(P, x, y, s, col) {
    ctx.save();
    ctx.strokeStyle = col;
    ctx.lineWidth = s * 0.09;
    ctx.lineCap = "round";
    const sh = [x, y - s * 0.25];
    ctx.beginPath();
    ctx.arc(x, y - s * 0.55, s * 0.16, 0, 6.283);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y - s * 0.35);
    ctx.lineTo(x, y + s * 0.25);
    ctx.lineTo(x - s * 0.22, y + s * 0.75);
    ctx.moveTo(x, y + s * 0.25);
    ctx.lineTo(x + s * 0.22, y + s * 0.75);
    ctx.stroke();
    for (const [t, sd] of [[P.L, -1], [P.R, 1]]) {
      const hx = t ? x + (t[0] - 0.5) * s * 1.6 : x + sd * s * 0.18, hy = t ? y - s * 0.25 + (t[1] - 0.45) * s * 1.6 : y + s * 0.15;
      ctx.beginPath();
      ctx.moveTo(sh[0] + sd * s * 0.08, sh[1]);
      ctx.lineTo(hx, hy);
      ctx.stroke();
    }
    ctx.restore();
  }
  function drawHUD(now, dt) {
    const W = innerWidth, H = innerHeight, s = Math.min(W, H);
    ctx.setTransform(PR, 0, 0, PR, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const playing = G.state === "play";
    const vm = s / 100, uT = Math.max(10, 1.8 * vm), uL = uT, uH = Math.max(36, 5.6 * vm), uWb = Math.max(108, 15 * vm), uG = Math.max(8, 1.2 * vm);
    const sysR = uL + 2 * uWb + 2 * uG + uH;
    if (playing || G.state === "finale") {
      const VP = [W / 2, H * 0.3];
      if (G.inst === "guitar") {
        const nx = LANE_X * W, top = LANES[2].y * H - s * 0.1, bot = LANES[0].y * H + s * 0.1;
        ctx.save();
        pill(nx - s * 0.06, top, s * 0.12, bot - top, "rgba(14,8,26,.55)", "rgba(255,255,255,.18)");
        ctx.strokeStyle = "rgba(255,255,255,.12)";
        ctx.lineWidth = 2;
        for (let k = 1; k < 9; k++) {
          const y = lerp(top, bot, k / 9);
          ctx.beginPath();
          ctx.moveTo(nx - s * 0.05, y);
          ctx.lineTo(nx + s * 0.05, y);
          ctx.stroke();
        }
        ctx.restore();
        LANES.forEach((ln, k) => {
          const x = nx, y = ln.y * H, r = s * 0.062, on = IN.zone === k;
          if (on) glowCircle(x, y, r * 2.3, ln.c, 0.55);
          ctx.beginPath();
          ctx.arc(x, y, r, 0, 6.283);
          ctx.lineWidth = s * (on ? 0.012 : 7e-3);
          ctx.strokeStyle = ln.c;
          ctx.globalAlpha = on ? 1 : 0.55;
          ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.fillStyle = on ? "#fff" : "rgba(255,255,255,.75)";
          ctx.font = "900 ".concat(Math.max(14, s * 0.026), "px system-ui");
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(ln.n, x, y);
        });
        const sx = W * STRUM_X, sy = H * STRUM_Y, sr = s * STRUM_R, f = IN.strumFlash;
        IN.strumFlash *= Math.exp(-dt * 8);
        glowCircle(sx, sy, sr * 2, curSong.hud[1], 0.25 + f * 0.6);
        const inS = IN.inStrum.left || IN.inStrum.right;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, 6.283);
        ctx.strokeStyle = inS ? "#fff" : "rgba(255,255,255,.55)";
        ctx.lineWidth = s * (inS ? 0.012 : 7e-3);
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.font = "900 ".concat(s * 0.03, "px system-ui");
        ctx.textAlign = "center";
        ctx.fillText("STRUM", sx, sy);
        ctx.font = "900 ".concat(s * 0.05, "px system-ui");
        ctx.fillText("⇅", sx, sy - sr * 0.62 + f * -s * 0.01);
      } else if (G.inst === "drums") {
        const nc = nextCue();
        for (const [k, p2] of Object.entries(PADS)) {
          const x = p2.x * W, y = p2.y * H, f = IN.padFlash[k] || 0;
          IN.padFlash[k] = f * Math.exp(-dt * 9);
          if (k === "JUMP") continue;
          const r = s * DRUM_R, touched = IN.inside["left" + k] || IN.inside["right" + k], due = nc && nc.pad === k;
          if (f > 0.05) glowCircle(x, y, r * 2.2, p2.c, f * 0.8);
          if (due) glowCircle(x, y, r * 1.9, p2.c, 0.3 + 0.2 * Math.sin(now / 90));
          ctx.save();
          ctx.translate(x, y);
          ctx.scale(1, DRUM_SQ);
          const g = ctx.createRadialGradient(0, -r * 0.2, r * 0.1, 0, 0, r);
          g.addColorStop(0, touched ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.55)");
          g.addColorStop(1, touched ? "rgba(255,255,255,.45)" : "rgba(160,160,180,.25)");
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, 6.283);
          ctx.fillStyle = g;
          ctx.fill();
          ctx.lineWidth = s * (touched || due ? 0.018 : 0.012);
          ctx.strokeStyle = touched ? "#fff" : p2.c;
          ctx.stroke();
          ctx.restore();
          ctx.fillStyle = "#fff";
          ctx.font = "900 ".concat(Math.max(14, s * 0.026), "px system-ui");
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(p2.n, x, y + r * DRUM_SQ + s * 0.03);
        }
      }
      let nextPose = null;
      for (let k = Math.max(0, spawnPtr - 40); k < spawnPtr; k++) {
        const c = cands[k];
        if (!c.shown) continue;
        const u = 1 - (c.t - G.t) / leadT();
        if (u < 0) continue;
        const late = G.t - c.t;
        if (c.res && c.res !== "miss") continue;
        if (late > 0.6) continue;
        const z = lerp(9, 1, clamp(u, 0, 1)), f = (1 / z - 1 / 9) / (1 - 1 / 9), col = c.res === "miss" ? "#666" : cueCol(c);
        for (const [tx, ty] of cuePos(c)) {
          let x = lerp(VP[0], tx * W, f), y = lerp(VP[1], ty * H, f);
          if (late > 0) {
            x += (tx * W - VP[0]) * late * 0.6;
            y += (ty * H - VP[1]) * late * 0.6;
          }
          const r = s * (VOX() ? 0.088 : 0.058) * (0.25 + 0.75 * f), a = clamp(u * 3, 0, 1) * (late > 0 ? clamp(1 - late / 0.6, 0, 1) : 1);
          if (G.inst === "guitar" && c.open) {
            ctx.save();
            ctx.globalAlpha = a;
            ctx.shadowColor = "rgba(6,0,14,0.85)";
            ctx.shadowBlur = r * 0.9;
            pill(x - r * 1.8, y - r * 0.55, r * 3.6, r * 1.1, "#ffffff", "rgba(6,0,14,0.85)");
            ctx.shadowBlur = 0;
            ctx.restore();
          } else orb(x, y, r, col, a, c.gold);
          if (G.inst === "vocals" && u > 0.3) {
            ctx.save();
            ctx.globalAlpha = a * 0.9;
            ctx.beginPath();
            ctx.arc(tx * W, ty * H, s * RING_R, 0, 6.283);
            if (c.filled) {
              ctx.fillStyle = "rgba(255,255,255,.14)";
              ctx.fill();
            } else ctx.setLineDash([s * 0.02, s * 0.012]);
            ctx.lineWidth = s * (c.filled ? 0.013 : 8e-3);
            ctx.strokeStyle = col;
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();
          }
          if (u > 0.55 && !c.res) {
            const rr = VOX() ? s * 0.11 * (1 + (1 - u) * 1) : s * 0.07 * (1 + (1 - u) * 2.2);
            ctx.beginPath();
            ctx.arc(tx * W, ty * H, rr, 0, 6.283);
            ctx.strokeStyle = col;
            ctx.globalAlpha = 0.7 * a;
            ctx.lineWidth = s * 6e-3;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
        if (G.inst === "vocals" && u > 0.25 && !c.res) {
          nextPose = { P: POSES[c.pose], a: clamp((u - 0.25) * 3, 0, 1) };
        }
      }
      for (let i = rings2d.length - 1; i >= 0; i--) {
        const r = rings2d[i];
        r.t += dt;
        if (r.t > 0.45) {
          rings2d.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(r.x * W, r.y * H, s * (0.06 + r.t * 0.35), 0, 6.283);
        ctx.strokeStyle = r.c;
        ctx.globalAlpha = 1 - r.t / 0.45;
        ctx.lineWidth = s * 0.012 * (1 - r.t / 0.45);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      ctx.globalCompositeOperation = "lighter";
      for (let i = sparks2d.length - 1; i >= 0; i--) {
        const p2 = sparks2d[i];
        p2.life -= dt;
        if (p2.life <= 0) {
          sparks2d.splice(i, 1);
          continue;
        }
        p2.x += p2.vx * dt * s / W;
        p2.y += p2.vy * dt * s / H;
        p2.vy += 1.2 * dt;
        ctx.fillStyle = p2.c;
        ctx.globalAlpha = clamp(p2.life * 2, 0, 1);
        ctx.beginPath();
        ctx.arc(p2.x * W, p2.y * H, s * 6e-3, 0, 6.283);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      for (let i = pops.length - 1; i >= 0; i--) {
        const p2 = pops[i];
        p2.t += dt;
        if (p2.t > 0.8) {
          pops.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = 1 - p2.t / 0.8;
        ctx.fillStyle = p2.c;
        ctx.font = "italic 900 ".concat(s * 0.042, "px system-ui");
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0,0,0,.8)";
        ctx.shadowBlur = 8;
        ctx.fillText(p2.txt, clamp(p2.x * W, s * 0.12, W - s * 0.12), p2.y * H - s * 0.1 - p2.t * s * 0.08);
        ctx.restore();
      }
      const fsS = uH * 0.6, mult = G.mult * (G.starOn ? 2 : 1), sTxt = G.score.toLocaleString(), mTxt = mult > 1 ? "  ×".concat(mult) : "";
      ctx.font = "900 ".concat(fsS, "px system-ui");
      const tw1 = ctx.measureText(sTxt).width;
      ctx.font = "900 ".concat(fsS * 0.7, "px system-ui");
      const tw2 = mTxt ? ctx.measureText(mTxt).width : 0;
      const spw = Math.max(uWb, tw1 + tw2 + uH * 0.9), spx = W / 2 - spw / 2;
      const row2 = spx < sysR + uG;
      const spy = row2 ? uT + uH + uG : uT;
      pill(spx, spy, spw, uH, "rgba(10,12,24,.55)", "rgba(255,255,255,.18)");
      hudRects = [{ x: spx, y: spy, w: spw, h: uH }];
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.fillStyle = "#fff";
      ctx.font = "900 ".concat(fsS, "px system-ui");
      ctx.fillText(sTxt, W / 2 - (tw1 + tw2) / 2, spy + uH / 2 + 1);
      if (mTxt) {
        ctx.font = "900 ".concat(fsS * 0.7, "px system-ui");
        ctx.fillStyle = "#ffc23c";
        ctx.fillText(mTxt, W / 2 - (tw1 + tw2) / 2 + tw1, spy + uH / 2 + 1);
      }
      const ready = G.star >= 0.5 && !G.starOn && playing;
      let rEdge = Math.min(W - uL, BP.freeRight ? BP.freeRight() : W - uL), sw = Math.min(Math.max(148, s * 0.26), rEdge - Math.max(sysR, spx + spw) - uG), sy2 = uT;
      if (sw < 130) {
        rEdge = W - uL;
        sw = Math.min(Math.max(148, s * 0.26), W * 0.42);
        sy2 = uT + Math.max(76, 11 * vm) + uG;
      }
      const sx2 = rEdge - sw;
      pill(sx2, sy2, sw, uH, "rgba(10,12,24,.55)", ready ? "#ffd34a" : "rgba(255,255,255,.18)");
      hudRects.push({ x: sx2, y: sy2, w: sw, h: uH });
      if (G.star > 0) {
        const g2 = ctx.createLinearGradient(sx2, 0, sx2 + sw, 0);
        g2.addColorStop(0, "rgba(255,154,32,.75)");
        g2.addColorStop(1, "rgba(255,242,160,.75)");
        ctx.beginPath();
        ctx.roundRect(sx2 + 3, sy2 + 3, Math.max(uH - 6, (sw - 6) * G.star), uH - 6, (uH - 6) / 2);
        ctx.fillStyle = g2;
        ctx.fill();
      }
      const stTxt = ready ? BP.mouse ? "PRESS S!" : "ARMS UP!" : G.starOn ? "★ DOUBLE POINTS" : "★ STAR POWER";
      let fsT = Math.max(14, uH * 0.4);
      ctx.font = "900 ".concat(fsT, "px system-ui");
      const stw = ctx.measureText(stTxt).width;
      if (stw > sw - uH * 0.6) {
        fsT = Math.max(12, fsT * (sw - uH * 0.6) / stw);
        ctx.font = "900 ".concat(fsT, "px system-ui");
      }
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff";
      ctx.globalAlpha = ready ? 0.7 + 0.3 * Math.sin(now / 120) : 1;
      ctx.fillText(stTxt, sx2 + sw / 2, sy2 + uH / 2 + 1);
      ctx.globalAlpha = 1;
      const p = clamp(G.t / song.end, 0, 1), pw = s * 0.5, px = W / 2 - pw / 2, py = H - s * 0.03;
      if (nextPose) {
        const P = nextPose.P, ph = uH * 1.25, py2 = py - s * 0.02 - ph;
        ctx.save();
        ctx.globalAlpha = nextPose.a;
        ctx.font = "900 ".concat(Math.max(14, ph * 0.38), "px system-ui");
        const nw = ctx.measureText(P.name).width, pw2 = nw + ph * 1.9;
        pill(W / 2 - pw2 / 2, py2, pw2, ph, "rgba(10,12,24,.55)", "rgba(255,255,255,.18)");
        hudRects.push({ x: W / 2 - pw2 / 2, y: py2, w: pw2, h: ph });
        drawStickPose(P, W / 2 - pw2 / 2 + ph * 0.75, py2 + ph * 0.5, ph * 0.5, "#fff");
        ctx.fillStyle = "#fff";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(P.name, W / 2 - pw2 / 2 + ph * 1.4, py2 + ph / 2 + 1);
        ctx.restore();
      }
      if (G.inst !== "drums") {
        pill(px, py, pw, s * 0.012, "rgba(255,255,255,.15)");
        pill(px, py, Math.max(s * 0.012, pw * p), s * 0.012, curSong.hud[0]);
      }
      {
        const nc = nextCue(), seenH = BP.mouse || BP.hands.left.seen || BP.hands.right.seen;
        const GN = { LOW: "down low", MID: "at your chest", HIGH: "up high" };
        let txt = null, col = null, big = false;
        if (G.inst === "drums") {
          if (nc && nc.pad === "JUMP") {
            txt = BP.mouse ? "JUMP!  (Space)" : "JUMP!";
            col = PADS.JUMP.c;
            big = true;
          } else if (nc) {
            txt = BP.mouse ? "Point at the ".concat(PADS[nc.pad].n) : "Hit the ".concat(PADS[nc.pad].n, ", either hand");
            col = PADS[nc.pad].c;
          } else txt = BP.mouse ? "Point at the drum the orb flies to" : "Hit the drum the orb flies to, either hand";
        } else if (G.inst === "guitar") {
          if (nc && !nc.open) {
            txt = BP.mouse ? "Mouse ".concat(GN[LANES[nc.lane].n], ", click to strum") : "Left hand ".concat(GN[LANES[nc.lane].n], ", strum with your right");
            col = LANES[nc.lane].c;
          } else txt = BP.mouse ? "Click to strum as the orb lands" : "Strum with your right hand as the orb lands";
        } else if (!nextPose) txt = BP.mouse ? "Move into the ring as the orb lands" : "Put your hands in the rings as the orbs land";
        if (txt && seenH) {
          const fsP = Math.max(14, s * (big ? 0.045 : 0.03)), ph = fsP * (big ? 2 : 2.1);
          ctx.font = "".concat(big ? 900 : 800, " ").concat(fsP, "px system-ui");
          const tw = ctx.measureText(txt).width;
          const cy = G.inst === "drums" ? PADS.JUMP.y * H : py - s * 0.02 - ph / 2, pw3 = Math.max(tw + fsP * 2, big ? s * 0.5 : 0);
          if (big) glowCircle(W / 2, cy, pw3 * 0.6, col, 0.35 + 0.25 * Math.sin(now / 90));
          pill(W / 2 - pw3 / 2, cy - ph / 2, pw3, ph, big ? "rgba(40,10,60,.75)" : "rgba(10,12,24,.7)", col || "rgba(255,255,255,.18)");
          hudRects.push({ x: W / 2 - pw3 / 2, y: cy - ph / 2, w: pw3, h: ph });
          ctx.fillStyle = "#fff";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(txt, W / 2, cy + 1);
        }
      }
    }
    BP.drawHands(ctx, W, H);
  }
  const ICON = {
    guitar: '<svg viewBox="0 0 100 100"><g fill="none" stroke="#ffc23c" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M30 78c-12 0-18-8-15-17 2-6 8-7 9-12 1-6 7-9 13-6l6 3 26-26 6 6-26 26 3 6c3 6 0 12-6 13-5 1-6 7-12 9-1 .4-3 .6-4 .6z"/><path d="M72 16l12 12M34 58l8 8"/></g></svg>',
    drums: '<svg viewBox="0 0 100 100"><g fill="none" stroke="#3cd2ff" stroke-width="5" stroke-linecap="round"><ellipse cx="50" cy="56" rx="30" ry="10"/><path d="M20 56v18c0 6 13 10 30 10s30-4 30-10V56"/><path d="M28 20l20 30M76 18L54 50"/></g></svg>',
    vocals: '<svg viewBox="0 0 100 100"><g fill="none" stroke="#ff3c6e" stroke-width="5" stroke-linecap="round"><rect x="38" y="12" width="24" height="40" rx="12"/><path d="M28 44c0 13 10 21 22 21s22-8 22-21M50 65v17M36 84h28"/></g></svg>',
    rock: '<svg viewBox="0 0 100 100"><path d="M56 8L22 56h22l-6 36 36-50H52z" fill="none" stroke="#ff5a2a" stroke-width="6" stroke-linejoin="round"/></svg>',
    pop: '<svg viewBox="0 0 100 100"><path d="M50 10l11 25 27 3-20 18 6 27-24-14-24 14 6-27-20-18 27-3z" fill="none" stroke="#ff4fc0" stroke-width="6" stroke-linejoin="round"/></svg>',
    funk: '<svg viewBox="0 0 100 100"><g fill="none" stroke="#ffb02e" stroke-width="5"><circle cx="50" cy="56" r="30"/><path d="M20 56h60M50 26v60M26 40h48M26 72h48M38 28c-6 18-6 38 0 56M62 28c6 18 6 38 0 56"/><path d="M50 8v18" stroke-linecap="round"/></g></svg>',
    dance: '<svg viewBox="0 0 100 100"><g fill="none" stroke="#3cd2ff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><path d="M38 72V22l40-8v50"/><circle cx="28" cy="74" r="10"/><circle cx="68" cy="66" r="10"/></g></svg>'
  };
  const INST_NAME = { guitar: "GUITAR", drums: "DRUMS", vocals: "SINGER" };
  function renderTitle() {
    const g = genreOf(G.genre) || {}, sg = songsOf(G.genre).find((x) => x.id === G.songId) || {};
    $("chgLbl").textContent = "".concat(INST_NAME[G.inst], " · ").concat(g.name || "");
    $("chgSub").textContent = (sg.name ? sg.name + " · " : "") + "change";
    if (BP.howTo && (!BP.howTo.visible || BP.howTo._inst !== G.inst) && G.state !== "play") {
      window.airbandHowTo(G.inst);
      BP.howTo._inst = G.inst;
    }
    bindButtons();
  }
  const remember = () => {
    try {
      localStorage.ab_inst = G.inst;
      localStorage.ab_genre = G.genre;
      localStorage["ab_song_" + G.genre] = G.songId;
    } catch (_) {
    }
  };
  function pickChain() {
    const gOpt = (g) => ({ id: g.id, label: g.name }), many = GENRES.length > 3, head = many ? GENRES.slice(0, 2) : GENRES, rest = many ? GENRES.slice(2, 5) : [];
    const toInst = () => BP.pick({
      title: "Pick your part",
      value: G.inst,
      onCancel: () => {
      },
      options: ["guitar", "drums", "vocals"].map((k) => ({ id: k, label: INST_NAME[k] })),
      onPick: (k) => {
        G.inst = k;
        remember();
        renderTitle();
        sfx.select();
      }
    });
    const toSong = (gid) => {
      const g = genreOf(gid), last2 = localStorage["ab_song_" + g.id];
      if (g.id !== G.genre) pickSong(g.id, (g.songs.find((x) => x.id === last2) || g.songs[0]).id);
      g.songs.forEach((x) => loadSongData(g.id, x.id).catch(() => {
      }));
      remember();
      renderTitle();
      BP.pick({
        title: g.name + ": pick a song",
        value: G.songId,
        onCancel: () => {
        },
        options: g.songs.slice(0, 3).map((x) => ({ id: x.id, label: x.name })),
        onPick: (sid) => {
          pickSong(G.genre, sid);
          loadSongAudio(G.genre, G.songId).catch(() => {
          });
          remember();
          renderTitle();
          toInst();
        }
      });
    };
    const opts = head.map(gOpt);
    if (rest.length) opts.push({ id: "_more", label: rest.map((g) => g.name).join(" · "), sub: "pick next" });
    BP.pick({
      title: "Pick a style",
      value: rest.some((g) => g.id === G.genre) ? "_more" : G.genre,
      options: opts,
      onCancel: () => {
      },
      onPick: (id) => id !== "_more" ? toSong(id) : BP.pick({ title: "Pick a style", value: G.genre, options: rest.map(gOpt), onCancel: () => {
      }, onPick: toSong })
    });
  }
  function bindButtons() {
    document.querySelectorAll(".btn, .card").forEach((b) => {
      if (b._bound) return;
      b._bound = true;
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        press(b.dataset.act);
      });
    });
  }
  function pickSong(gid, sid) {
    G.genre = gid;
    G.songId = sid;
    curSong = lookOf(gid);
    setShow(curSong);
    loadSongData(gid, sid).then((d) => {
      if (G.state === "title" && G.songId === sid) {
        curSong = { id: gid, name: d.name, led: d.led, col: d.col, hud: d.hud };
        setShow(curSong);
      }
    }).catch(() => {
    });
  }
  function press(act) {
    audioInit();
    sfx.press();
    if (act === "change") pickChain();
    else if (act === "start" || act === "again") startShow();
    else if (act === "encore") {
      const ss = songsOf(G.genre), k = ss.findIndex((x) => x.id === G.songId);
      pickSong(G.genre, ss[(k + 1) % ss.length].id);
      startShow(true);
    } else if (act === "home") location.href = "index.html";
  }
  function hoverButtons(now) {
    const inPlay = BP.sysMode && BP.sysMode() === "play";
    const vis = [...document.querySelectorAll(".btn")].filter((b) => b.getClientRects().length && !b.closest(".hide") && !(inPlay && b.id === "home"));
    for (const b of vis) {
      const r = b.getBoundingClientRect(), over = BP.handOver({ x: r.left, y: r.top, w: r.width, h: r.height }, innerWidth, innerHeight);
      const k = BP.dwell(b.id === "home" ? "home" : b.dataset.dwell || "b-" + b.dataset.act, over, now, +(b.dataset.ms || 750));
      const fill = over ? k : 0;
      if (b._fill !== fill) {
        b._fill = fill;
        b.style.setProperty("--fill", fill);
      }
      b.classList.toggle("over", over);
      if (k === 1) {
        b._fill = 0;
        b.style.setProperty("--fill", 0);
        press(b.dataset.act);
      }
    }
  }
  addEventListener("keydown", (e) => {
    audioInit();
    if (G.state === "title") {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        press("start");
        return;
      }
      if (/^Arrow/.test(e.key)) {
        e.preventDefault();
        press("change");
        return;
      }
      return;
    }
    if (e.key === "Enter" || e.key === " " && G.state !== "play") {
      e.preventDefault();
      if (G.state === "end" && !$("end").classList.contains("hide")) press("again");
      return;
    }
    if (G.state === "play") {
      if (e.key === " ") {
        e.preventDefault();
        if (G.inst === "drums") padHit("JUMP");
        else if (G.inst === "guitar") strum();
      }
      if (e.key === "s" || e.key === "S") starPower();
      if (e.key === "Escape") press("home");
    }
  });
  addEventListener("pointerdown", (e) => {
    if (e.target.closest(".btn, .card")) return;
    audioInit();
    if (G.state !== "play") return;
    if (G.inst === "guitar") strum();
    else if (G.inst === "drums") {
      const x = e.clientX / innerWidth, y = e.clientY / innerHeight;
      const s = S_();
      for (const [k, p] of Object.entries(PADS)) if (k !== "JUMP" && ((x - p.x) * innerWidth / (DRUM_R * s + s * 0.045)) ** 2 + ((y - p.y) * innerHeight / (DRUM_R * DRUM_SQ * s + s * 0.045)) ** 2 <= 1) padHit(k);
    }
  });
  function finishSong() {
    G.state = "finale";
    G.finaleAt = performance.now();
    cutTo("finale");
    pyro(1.3);
    sparkFountains(3.5);
    confettiBurst(900);
    sfx.cheer(1.6);
    const acc = G.shown ? (G.hits - 0.4 * 0) / G.shown : 0;
    G.acc = acc;
    G.stars = acc >= 0.9 ? 5 : acc >= 0.75 ? 4 : acc >= 0.55 ? 3 : acc >= 0.35 ? 2 : 1;
    ledTxt.t = ["THANK YOU!", "THANK YOU!", "GOOD NIGHT!", "YOU ROCK!", "LEGEND!", "LEGEND!"][G.stars];
    ledTxt.until = performance.now() + 6e4;
  }
  function endScreen() {
    G.state = "end";
    stopSong(1.2);
    BP.saveSession({ game: "airband", score: G.score });
    if (BP.highScores) BP.highScores("airband", G.score);
    $("eScore").textContent = G.score.toLocaleString();
    G.chantAt = 0;
    G.endAt = performance.now();
  }
  let last = performance.now(), fpsAcc = 0, fpsN = 0, autoT = 0, titleShown = false, crowdDt = 0, crowdTick = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    const dtr = Math.min(0.05, (now - last) / 1e3);
    last = now;
    BP.update(now);
    patchAO();
    fpsAcc += dtr;
    fpsN++;
    if (fpsAcc > 1) {
      G.fps = Math.round(fpsN / fpsAcc);
      fpsAcc = 0;
      fpsN = 0;
      G.quality = state().quality.tier;
    }
    let vts = 1;
    if (shot === "hero" && heroT >= 0) vts = heroT < 0.25 ? lerp(1, 0.22, heroT / 0.25) : heroT < heroDur - 0.8 ? 0.22 : lerp(0.22, 1, (heroT - heroDur + 0.8) / 0.8);
    G.vts = vts;
    const dtv = dtr * vts;
    let beatPh = now / 1e3 * 2 % 1, bar = -1, beat = 0;
    if (G.state === "play" || G.state === "finale") {
      const ct = clockNow();
      G.t = ct !== null ? ct : G.t + dtr;
      const [bi, ph] = beatAt(G.t);
      beatPh = ph;
      beat = bi;
      bar = Math.floor((bi - song.off) / 4);
      G.beatPh = ph;
      if (G.state === "play") {
        decideCues();
        updateInput(now, dtr);
        liveTips();
        if (bar !== G.bar) {
          G.bar = bar;
          const sec = song.sections.find((x) => bar >= x.bar && bar < x.bar + x.bars);
          if (sec && bar === sec.bar && sec.sec === "chorus" && bar > 0) {
            if (G.inst !== "drums") pyro(0.8);
            sparkFountains(2);
          }
          if (shot !== "hero" && !window.__dbg.lock && bar >= 0 && bar % (sec && sec.sec === "chorus" ? 2 : 4) === 0) cutTo(SEQ[shotSeq++ % SEQ.length]);
        }
        if (G.t > song.end) finishSong();
      } else if (now - G.finaleAt > 4200) endScreen();
    }
    if (G.state === "end" && $("end").classList.contains("hide")) {
      const hs = BP.highScores && BP.highScores.state;
      if (now - G.endAt > 300 && !(hs && hs.phase)) $("end").classList.remove("hide");
    }
    if (G.state === "end") {
      if (!G.chantAt || now - G.chantAt > 1500) {
        G.chantAt = now;
        if (G.stars >= 3) sfx.chant();
      }
    }
    if (G.state === "title" && QS.has("tv")) {
      autoT += dtr;
      if (autoT > 2) {
        autoT = -1e9;
        press("start");
      }
    }
    const hype = G.state === "play" ? 0.25 + 0.75 * G.crowd : G.state === "finale" || G.state === "end" ? G.stars >= 3 ? 1 : 0.6 : 0.35;
    if (ac && crowdG) {
      const lvl = 0;
      crowdG.gain.setTargetAtTime(lvl, ac.currentTime, 0.3);
      crowdG2.gain.setTargetAtTime(lvl * 0.4 * hype, ac.currentTime, 0.3);
    }
    const t = now / 1e3;
    crowdDt += dtv;
    if (!TV || (++crowdTick & 1) === 0) {
      updateCrowd(t, beatPh, hype, crowdDt);
      crowdDt = 0;
    }
    updateLights(t, beatPh, bar, hype, dtr);
    animateBand(t, beatPh, beat, bar, dtv);
    stepFx(dtv);
    if (ledFrame++ % (TV ? 3 : 2) === 0) drawLED(now, beatPh, hype);
    updateCamera(now, dtv, dtr);
    sparks.mat.uniforms.uScale.value = smoke.mat.uniforms.uScale.value = renderer.domElement.height / (2 * Math.tan(camera.fov * Math.PI / 360));
    render(dtr);
    if (G.state !== "loading") hoverButtons(now);
    drawHUD(now, dtr);
  }
  G.endNow = () => {
    if (G.state !== "play" && G.state !== "finale") return;
    if (G.state === "play") finishSong();
    endScreen();
  };
  Object.assign(window.__dbg, {
    PADS,
    POSES,
    padDraw: (s) => ({ rx: DRUM_R * s, ry: DRUM_R * DRUM_SQ * s }),
    ringR: (s) => RING_R * s,
    skipTo: (t) => {
      if (ac && audioStart !== null) {
        audioStart = ac.currentTime - t;
        const b = SONGBUF[songKey(G.genre, G.songId)];
        b && b.then((buf) => buf && playSong(buf, ac.currentTime, t));
      }
      G.t = t;
      while (spawnPtr < cands.length && cands[spawnPtr].t < t) cands[spawnPtr++].decided = true;
    },
    cutTo,
    heroMoment,
    starPower,
    R: state(),
    pyro,
    confettiBurst,
    sparkFountains,
    lib: LIB,
    genres: GENRES,
    buildChart,
    loadSongData,
    song: () => song,
    songPlaying: () => !!songSrc,
    G
  });
  let tvFix = null;
  if (TV) {
    const N = fixtures.length, _fm = new Matrix4(), _fc = new Color(), _fv = V3();
    const parts = fixtures.map((f) => {
      const L = [];
      f.base.traverse((o) => {
        if (o.isMesh && o !== f.beam && o !== f.lens) L.push(o);
      });
      return L;
    });
    const inst = parts[0].map((m0) => {
      const im = new InstancedMesh(m0.geometry, m0.material.clone(), N);
      im.frustumCulled = false;
      scene.add(im);
      return im;
    });
    const lensI = new InstancedMesh(fixtures[0].lens.geometry, new MeshBasicMaterial({ color: 16777215, fog: false }), N);
    const bv = beamMatBase.vertexShader.replace("void main(){", "varying vec3 vC; void main(){ vC = instanceColor;").replace("modelMatrix * vec4(position,1.)", "modelMatrix * instanceMatrix * vec4(position,1.)").replace("normalMatrix * normal", "mat3(viewMatrix) * mat3(instanceMatrix) * normal");
    const beamI = new InstancedMesh(beamGeo, new ShaderMaterial({
      uniforms: { uT: { value: 0 } },
      vertexShader: bv,
      fragmentShader: beamMatBase.fragmentShader.replace("uniform vec3 uC; uniform float uI, uT;", "uniform float uT; varying vec3 vC;").replace("uC * uI", "vC"),
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      side: DoubleSide,
      fog: false
    }), N);
    for (let i = 0; i < N; i++) {
      lensI.setColorAt(i, _fc.set(0));
      beamI.setColorAt(i, _fc);
    }
    const fpos = new Float32Array(N * 3), fcol = new Float32Array(N * 3), fgeo = new BufferGeometry();
    fgeo.setAttribute("position", new BufferAttribute(fpos, 3));
    fgeo.setAttribute("col", new BufferAttribute(fcol, 3));
    const flares = new Points(fgeo, new ShaderMaterial({
      uniforms: { map: { value: flareTex }, uScale: sparks.mat.uniforms.uScale },
      vertexShader: "attribute vec3 col; uniform float uScale; varying vec3 vC; void main(){ vC = col; vec4 mv = modelViewMatrix * vec4(position,1.); gl_PointSize = .75 * uScale / max(.1, -mv.z); gl_Position = projectionMatrix * mv; }",
      fragmentShader: "uniform sampler2D map; varying vec3 vC; void main(){ gl_FragColor = vec4(vC * texture2D(map, gl_PointCoord).a, 1.); }",
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      fog: false
    }));
    for (const o of [lensI, beamI, flares]) {
      o.frustumCulled = false;
      scene.add(o);
    }
    for (const f of fixtures) {
      scene.remove(f.base);
      f.base.traverse((o) => o.updateMatrix());
      for (const o of [...parts[f.i], f.lens, f.beam, f.flare]) {
        o.userData.par = o.parent;
        o.removeFromParent();
      }
    }
    let once = false;
    tvFix = (t) => {
      for (let i = 0; i < N; i++) {
        const f = fixtures[i], L = parts[i];
        f.base.updateMatrixWorld(true);
        for (let k = 0; k < L.length; k++) {
          const o = L[k];
          if (once && o.userData.par === f.base) continue;
          inst[k].setMatrixAt(i, _fm.multiplyMatrices(o.userData.par.matrixWorld, o.matrix));
        }
        lensI.setMatrixAt(i, _fm.multiplyMatrices(f.tilt.matrixWorld, f.lens.matrix));
        lensI.setColorAt(i, f.lens.material.color);
        beamI.setMatrixAt(i, _fm.multiplyMatrices(f.tilt.matrixWorld, f.beam.matrix));
        beamI.setColorAt(i, _fc.copy(f.col).multiplyScalar(f.beam.material.uniforms.uI.value));
        _fv.setFromMatrixPosition(_fm.multiplyMatrices(f.tilt.matrixWorld, f.flare.matrix)).toArray(fpos, i * 3);
        _fc.copy(f.col).multiplyScalar(f.flare.material.opacity).toArray(fcol, i * 3);
      }
      for (let k = 0; k < inst.length; k++) if (!once || parts[0][k].userData.par !== fixtures[0].base) inst[k].instanceMatrix.needsUpdate = true;
      once = true;
      lensI.instanceMatrix.needsUpdate = lensI.instanceColor.needsUpdate = beamI.instanceMatrix.needsUpdate = beamI.instanceColor.needsUpdate = true;
      fgeo.attributes.position.needsUpdate = fgeo.attributes.col.needsUpdate = true;
      beamI.material.uniforms.uT.value = t;
    };
    const MAPS = ["map", "normalMap", "roughnessMap", "metalnessMap", "bumpMap", "aoMap", "emissiveMap", "alphaMap"];
    const isPlain = (m) => m.isMeshStandardMaterial && !m.transparent && m.side === FrontSide && !MAPS.some((k) => m[k]) && m.emissive.getHex() === 0;
    const clean = (g, mtx) => {
      g = g.clone();
      if (mtx) g.applyMatrix4(mtx);
      const n = g.attributes.position.count;
      if (!g.index) g.setIndex([...Array(n).keys()]);
      for (const k of Object.keys(g.attributes)) if (!["position", "normal", "uv"].includes(k)) g.deleteAttribute(k);
      if (!g.attributes.uv) g.setAttribute("uv", new BufferAttribute(new Float32Array(n * 2), 2));
      g.morphAttributes = {};
      g.clearGroups();
      return g;
    };
    const paint = (g, m) => {
      const n = g.attributes.position.count, c = new Float32Array(n * 3), rm = new Float32Array(n * 2);
      for (let v = 0; v < n; v++) {
        c[v * 3] = m.color.r;
        c[v * 3 + 1] = m.color.g;
        c[v * 3 + 2] = m.color.b;
        rm[v * 2] = m.roughness;
        rm[v * 2 + 1] = m.metalness;
      }
      g.setAttribute("color", new BufferAttribute(c, 3));
      g.setAttribute("rm", new BufferAttribute(rm, 2));
      return g;
    };
    const plainMat = () => {
      const m = new MeshStandardMaterial({ vertexColors: true });
      m.onBeforeCompile = (sh) => {
        sh.vertexShader = "attribute vec2 rm; varying vec2 vRM;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\nvRM = rm;");
        sh.fragmentShader = "varying vec2 vRM;\n" + sh.fragmentShader.replace("#include <roughnessmap_fragment>", "float roughnessFactor = vRM.x;").replace("#include <metalnessmap_fragment>", "float metalnessFactor = vRM.y;");
      };
      m.customProgramCacheKey = () => "abPlain";
      return m;
    }, PLAIN = "plain";
    const skinify = (roots) => {
      const parts2 = [];
      for (const root of roots) root.traverseVisible((o) => {
        if (o.isMesh && !Array.isArray(o.material)) parts2.push(o);
      });
      const sk = new Skeleton(parts2, parts2.map(() => new Matrix4())), byMat = /* @__PURE__ */ new Map();
      parts2.forEach((o, bi) => {
        const g = clean(o.geometry), n = g.attributes.position.count, key2 = isPlain(o.material) ? PLAIN : o.material;
        if (key2 === PLAIN) paint(g, o.material);
        const si = new Uint16Array(n * 4), sw = new Float32Array(n * 4);
        for (let v = 0; v < n; v++) {
          si[v * 4] = bi;
          sw[v * 4] = 1;
        }
        g.setAttribute("skinIndex", new Uint16BufferAttribute(si, 4));
        g.setAttribute("skinWeight", new BufferAttribute(sw, 4));
        if (!byMat.has(key2)) byMat.set(key2, []);
        byMat.get(key2).push(g);
      });
      for (const [key2, geos] of byMat) {
        const m = new SkinnedMesh(mergeGeometries(geos), key2 === PLAIN ? plainMat() : key2.clone());
        m.bind(sk, new Matrix4());
        m.frustumCulled = false;
        scene.add(m);
      }
      for (const o of parts2) o.visible = false;
    };
    skinify([bandDrummer.root, bandBass.root, bandGtr.root, rearKit]);
    const plainGeos = [];
    for (const o of [...STATIC.children]) if (o.isMesh && isPlain(o.material)) {
      plainGeos.push(paint(clean(o.geometry), o.material));
      o.removeFromParent();
    }
    for (const o of scene.children.filter((o2) => o2.isMesh && o2.material === trussMat)) {
      o.updateMatrix();
      plainGeos.push(paint(clean(o.geometry, o.matrix), trussMat));
      o.removeFromParent();
    }
    scene.add(new Mesh(mergeGeometries(plainGeos), plainMat()));
    const regroup = (m) => {
      const g = m.geometry, idx = g.index.array, out = [], grs = [];
      const mats = [...new Set(m.material)];
      for (const mt of mats) {
        const st = out.length;
        g.groups.forEach((gr) => {
          if (m.material[gr.materialIndex] === mt) for (let i = gr.start; i < gr.start + gr.count; i++) out.push(idx[i]);
        });
        grs.push([st, out.length - st, m.material.indexOf(mt)]);
      }
      g.setIndex(out);
      g.clearGroups();
      for (const [st, c, mi] of grs) g.addGroup(st, c, mi);
    };
    regroup(deck);
    regroup(riser);
    const merge = (list, mat) => {
      const geos = list.map((o) => {
        o.updateMatrix();
        const g = o.geometry.clone().applyMatrix4(o.matrix);
        o.removeFromParent();
        return g;
      });
      const m = new Mesh(mergeGeometries(geos), mat);
      scene.add(m);
      return m;
    };
    merge(hazes, hazeMat).userData.noAO = true;
  }
  {
    const MOVE = /* @__PURE__ */ new Set([hero.root, heroGtr, bassGtr, sideGtr, heroMic]);
    for (const P of [hero, bandDrummer, bandBass, bandGtr]) {
      MOVE.add(P.torso).add(P.hips).add(P.neck).add(P.head);
      for (const a of P.arms) MOVE.add(a.up).add(a.lo).add(a.hand).add(a.delt);
      for (const l of P.legs) MOVE.add(l.up).add(l.lo).add(l.foot);
    }
    for (const f of fixtures) MOVE.add(f.pan).add(f.tilt);
    for (const k of ["HH", "CY", "RI"]) MOVE.add(rearKit.userData.K[k]);
    scene.updateMatrixWorld(true);
    for (const c of scene.children) if (!PRE.has(c)) c.traverse((o) => {
      if (!MOVE.has(o)) o.matrixAutoUpdate = false;
    });
    scene.matrixAutoUpdate = false;
  }
  try {
    renderer.compile(scene, camera);
  } catch (e) {
  }
  renderTitle();
  $("loading").classList.add("hide");
  $("title").classList.remove("hide");
  G.state = "title";
  cutTo("title");
  BP.start();
  requestAnimationFrame(frame);
})().catch((e) => setTimeout(() => {
  throw e;
}));
