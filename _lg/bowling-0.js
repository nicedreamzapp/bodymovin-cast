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
  environment,
  pbr,
  render,
  setup
} from "./chunk-5EPBUA75.js";
import "./chunk-CPYHHAA5.js";
import "./chunk-GEQJXPAR.js";
import {
  ShaderPass
} from "./chunk-UBB4M7UR.js";
import {
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CircleGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Float32BufferAttribute,
  FogExp2,
  Group,
  HemisphereLight,
  InstancedMesh,
  LatheGeometry,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  PointLight,
  Points,
  PointsMaterial,
  Quaternion,
  Raycaster,
  SRGBColorSpace,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  SplineCurve,
  SpotLight,
  Sprite,
  SpriteMaterial,
  TorusGeometry,
  Vector2,
  Vector3
} from "./chunk-4IYDSAYK.js";
import "./chunk-NWIHTO7D.js";

// bmpage:bmpage:bowling.html#0
(async () => {
  const BP = window.BodyMovin, QS = new URLSearchParams(location.search), TV = QS.has("tv"), LOCK = QS.has("lock"), FAST = QS.has("fast") ? 2 : 1;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, x) => {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };
  let seed = 12345;
  const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
  const LANE_W = 1.054, LH = LANE_W / 2, GUT_W = 0.235, LANE_L = 18.288, HEAD_Z = -LANE_L;
  const DECK_END = HEAD_Z - 0.95, LANE_TOTAL = LANE_L + 0.95, PIT_Y = -0.42, BACK_Z = DECK_END - 0.75;
  const PITCH = LANE_W + 2 * GUT_W + 0.12, WALL_X = LH + GUT_W;
  const BALL_R = 0.108, BALL_M = 6.8, PIN_H = 0.381, PIN_M = 1.53, PIN_COM = 0.145;
  const POCKET_X = 0.064, BASE_SPIN = -0.14, START_Z = 0.35;
  const PS = 0.3048, RS = 0.264;
  const PIN_SPOTS = [[0, 0], [-PS / 2, -RS], [PS / 2, -RS], [-PS, -2 * RS], [0, -2 * RS], [PS, -2 * RS], [-1.5 * PS, -3 * RS], [-0.5 * PS, -3 * RS], [0.5 * PS, -3 * RS], [1.5 * PS, -3 * RS]].map(([x, d]) => [x, HEAD_Z + d]);
  const glCanvas = document.createElement("canvas");
  document.getElementById("gl").appendChild(glCanvas);
  const RZ = setup(glCanvas, { fov: 42, near: 0.03, far: 90, tier: QS.has("tier") ? +QS.get("tier") : void 0 });
  const { renderer, scene, camera } = RZ;
  const PR = renderer.getPixelRatio();
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.autoUpdate = false;
  const ANISO = renderer.capabilities.getMaxAnisotropy();
  scene.background = new Color(460042);
  scene.fog = new FogExp2(854546, 0.012);
  await environment(scene, renderer, "billiard_hall", { background: false, intensity: 0.55, rotation: 1.2 });
  const mapleImg = await new Promise((res) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = () => res(null);
    im.src = "assets/textures/white_maple_veneer/white_maple_veneer_Diffuse_" + (window.BP_TV ? "1k" : "2k") + ".jpg";
  });
  const finishShader = {
    uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uVig: { value: 1 } },
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader: "uniform sampler2D tDiffuse; uniform float uTime, uVig; varying vec2 vUv;\n    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + uTime) * 43758.5453); }\n    void main(){ vec4 c = texture2D(tDiffuse, vUv); vec2 d = vUv - 0.5; d.x *= 1.2;\n      float v = smoothstep(0.86, 0.25, length(d)); /* no vignette: nothing dims (10/23) */\n      c.rgb += (h(vUv * 917.0) - 0.5) * 0.014; gl_FragColor = c; }"
  };
  let finish = null, composerSeen = null, bloom = null;
  function decorateComposer() {
    const c = RZ.composer;
    if (c === composerSeen) return;
    composerSeen = c;
    finish = new ShaderPass(finishShader);
    c.addPass(finish);
    bloom = RZ.passes.bloom || null;
    if (bloom) {
      bloom.strength = 0.32;
      bloom.radius = 0.4;
      bloom.threshold = 2.2;
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
  decorateComposer();
  const mkCanvas = (w, h) => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return [c, c.getContext("2d")];
  };
  const tex = (c, srgb = true) => {
    const t = new CanvasTexture(c);
    if (srgb) t.colorSpace = SRGBColorSpace;
    t.anisotropy = ANISO;
    return t;
  };
  const veneer = (() => {
    if (!mapleImg) return null;
    const [c, g] = mkCanvas(mapleImg.height, mapleImg.width);
    g.translate(c.width, 0);
    g.rotate(Math.PI / 2);
    g.drawImage(mapleImg, 0, 0);
    return c;
  })();
  function woodBoards(g, x0, w, y0, y1, kind) {
    if (veneer) {
      const sw = 40 + rnd() * 30, sx = rnd() * (veneer.width - sw), segH = 220 + rnd() * 120;
      for (let y = y0; y < y1; y += segH) {
        const h = Math.min(segH, y1 - y), sy = rnd() * (veneer.height - 2048 * h / segH);
        g.drawImage(veneer, sx, sy, sw, 2047 * h / segH, x0, y, w + 0.6, h);
      }
      g.save();
      g.globalCompositeOperation = "multiply";
      const hue2 = kind === "p" ? 26 + rnd() * 5 : 30 + rnd() * 5, lig2 = kind === "p" ? 52 + rnd() * 9 : 64 + rnd() * 8, sat2 = kind === "p" ? 62 + rnd() * 14 : 52 + rnd() * 12;
      g.fillStyle = "hsl(".concat(hue2, ",").concat(sat2, "%,").concat(lig2, "%)");
      g.fillRect(x0, y0, w + 0.6, y1 - y0);
      g.restore();
      if (kind === "p") for (let k = 0; k < 5; k++) {
        g.strokeStyle = "rgba(100,48,16,".concat(0.05 + rnd() * 0.1, ")");
        g.lineWidth = 0.8;
        const cx = x0 + w * (0.3 + rnd() * 0.4), cy = y0 + rnd() * (y1 - y0), L = 30 + rnd() * 140;
        for (let r = 0; r < 3; r++) {
          g.beginPath();
          g.ellipse(cx, cy, w * (0.12 + r * 0.1), L * (1 + r * 0.35), 0, 0, 6.283);
          g.stroke();
        }
      }
      return;
    }
    const hue = kind === "p" ? 27 + rnd() * 6 : 33 + rnd() * 5, sat = kind === "p" ? 50 + rnd() * 14 : 44 + rnd() * 12, lig = kind === "p" ? 52 + rnd() * 10 : 63 + rnd() * 8;
    g.fillStyle = "hsl(".concat(hue, ",").concat(sat, "%,").concat(lig, "%)");
    g.fillRect(x0, y0, w + 0.6, y1 - y0);
    const n = kind === "p" ? 18 : 12;
    for (let k = 0; k < n; k++) {
      const gx = x0 + rnd() * w, amp = 0.4 + rnd() * (kind === "p" ? 3 : 1.6), fr = 2e-3 + rnd() * 8e-3, ph = rnd() * 6.3;
      g.strokeStyle = "rgba(".concat(kind === "p" ? "110,58,22" : "135,88,45", ",").concat(0.05 + rnd() * (kind === "p" ? 0.2 : 0.13), ")");
      g.lineWidth = 0.5 + rnd() * 1.3;
      g.beginPath();
      for (let y = y0; y <= y1 + 40; y += 40) {
        const xx = gx + Math.sin(y * fr + ph) * amp;
        y === y0 ? g.moveTo(xx, y) : g.lineTo(xx, y);
      }
      g.stroke();
    }
    if (kind === "p") for (let k = 0; k < 7; k++) {
      g.strokeStyle = "rgba(105,52,18,".concat(0.06 + rnd() * 0.12, ")");
      g.lineWidth = 0.8;
      const cx = x0 + w * (0.3 + rnd() * 0.4), cy = y0 + rnd() * (y1 - y0), L = 30 + rnd() * 160;
      for (let r = 0; r < 3; r++) {
        g.beginPath();
        g.ellipse(cx, cy, w * (0.12 + r * 0.1), L * (1 + r * 0.35), 0, 0, 6.283);
        g.stroke();
      }
    }
    for (let k = 0; k < 10; k++) {
      g.fillStyle = "rgba(90,50,20,".concat(rnd() * 0.18, ")");
      g.fillRect(x0 + rnd() * w, y0 + rnd() * (y1 - y0), 0.8, 3 + rnd() * 12);
    }
  }
  function laneTexture() {
    const W = 1024, H = 4096, [c, g] = mkCanvas(W, H), yOf = (d) => (1 - d / LANE_TOTAL) * H, boards = 39, bw = W / boards;
    for (let i = 0; i < boards; i++) {
      const x0 = i * bw;
      for (const [a, b, k] of [[0, 4.6, "m"], [4.6, LANE_L - 0.85, "p"], [LANE_L - 0.85, LANE_TOTAL, "m"]]) {
        if (k === "p") {
          let d = a;
          while (d < b) {
            const e = Math.min(b, d + 1.6 + rnd() * 2.6);
            woodBoards(g, x0, bw, yOf(e), yOf(d), k);
            g.fillStyle = "rgba(60,32,12,.45)";
            g.fillRect(x0, yOf(e), bw, 1.2);
            d = e;
          }
        } else woodBoards(g, x0, bw, yOf(b), yOf(a), k);
      }
      g.fillStyle = "rgba(55,30,12,.55)";
      g.fillRect(x0, 0, 1, H);
    }
    const edge = g.createLinearGradient(0, 0, W, 0);
    edge.addColorStop(0, "rgba(40,18,6,.28)");
    edge.addColorStop(0.06, "rgba(40,18,6,0)");
    edge.addColorStop(0.94, "rgba(40,18,6,0)");
    edge.addColorStop(1, "rgba(40,18,6,.28)");
    g.fillStyle = edge;
    g.fillRect(0, 0, W, H);
    const bx = (b) => W - (b - 0.5) * bw;
    g.fillStyle = "rgba(28,14,10,.9)";
    for (const b of [3, 5, 8, 11, 14, 26, 29, 32, 35, 37]) {
      g.beginPath();
      g.ellipse(bx(b), yOf(2.13), bw * 0.28, 2.2, 0, 0, 6.283);
      g.fill();
    }
    for (const [b, d] of [[5, 3.81], [10, 4.11], [15, 4.42], [20, 4.72], [25, 4.42], [30, 4.11], [35, 3.81]]) {
      const x = bx(b), y = yOf(d), L = 0.34 / LANE_TOTAL * H;
      g.fillStyle = "rgba(30,12,10,.92)";
      g.beginPath();
      g.moveTo(x, y - L);
      g.lineTo(x + bw * 0.62, y);
      g.lineTo(x - bw * 0.62, y);
      g.closePath();
      g.fill();
      g.fillStyle = "rgba(190,30,40,.75)";
      g.beginPath();
      g.moveTo(x, y - L * 0.75);
      g.lineTo(x + bw * 0.3, y - L * 0.12);
      g.lineTo(x - bw * 0.3, y - L * 0.12);
      g.closePath();
      g.fill();
    }
    g.fillStyle = "rgba(30,14,10,.8)";
    for (const b of [10, 30]) g.fillRect(bx(b) - 1.5, yOf(12.2), 3, (12.2 - 10.4) / LANE_TOTAL * H);
    for (const [x, z] of PIN_SPOTS) {
      g.strokeStyle = "rgba(40,20,10,.7)";
      g.lineWidth = 2;
      g.beginPath();
      g.ellipse(W / 2 + x / LANE_W * W, yOf(-z), 0.026 / LANE_W * W, 0.026 / LANE_TOTAL * H, 0, 0, 6.283);
      g.stroke();
    }
    return tex(c);
  }
  function approachTexture() {
    const W = 2048, H = 1024, [c, g] = mkCanvas(W, H), wid = 5 * PITCH, len = 5.5, pxm = W / wid, bw = 0.0266 * pxm;
    for (let x = 0; x < W; x += bw) woodBoards(g, x, bw, 0, H, "m"), g.fillStyle = "rgba(55,30,12,.5)", g.fillRect(x, 0, 1, H);
    g.fillStyle = "#120808";
    g.fillRect(0, 0, W, 0.02 * H / len * 1.4);
    for (let k = -2; k <= 2; k++) {
      const cx = W / 2 + k * PITCH * pxm;
      for (const d of [0.3, 3.66, 4.57]) for (const b of [-15, -10, -5, 0, 5, 10, 15]) {
        if (d === 0.3 && Math.abs(b) > 10) continue;
        g.fillStyle = "rgba(25,12,8,.9)";
        g.beginPath();
        g.arc(cx + b * bw, d / len * H, 3.2, 0, 6.283);
        g.fill();
      }
    }
    return tex(c);
  }
  function ballTexture(c1, c2, c3) {
    const W = 1024, H = 512, [c, g] = mkCanvas(W, H), img = g.createImageData(W, H), d = img.data;
    for (let y = 0; y < H; y++) {
      const v = y / H * Math.PI, sv = Math.sin(v), cv = Math.cos(v);
      for (let x = 0; x < W; x++) {
        const u = x / W * Math.PI * 2, px = sv * Math.cos(u), py = cv, pz = sv * Math.sin(u);
        const n = Math.sin(px * 3.1 + Math.sin(py * 4.3 + pz * 2.2) * 2.4 + Math.sin(pz * 5.1 + px * 1.7) * 1.4);
        const s = 0.5 + 0.5 * Math.sin(n * 3.2 + py * 5 + Math.sin(px * 7) * 0.8);
        const t12 = smooth(0.25, 0.75, s), t22 = smooth(0.82, 0.97, s);
        const i = (y * W + x) * 4;
        for (let k = 0; k < 3; k++) d[i + k] = lerp(lerp(c1[k], c2[k], t12), c3[k], t22);
        if (rnd() < 16e-4) {
          d[i] = d[i + 1] = d[i + 2] = 255;
        }
        d[i + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    const hole = (x, y, r) => {
      const gr = g.createRadialGradient(x, y, r * 0.2, x, y, r * 1.25);
      gr.addColorStop(0, "#000");
      gr.addColorStop(0.78, "#050308");
      gr.addColorStop(0.86, "#cfc8d8");
      gr.addColorStop(1, "rgba(200,190,220,0)");
      g.fillStyle = gr;
      g.beginPath();
      g.ellipse(x, y, r * 1.25, r * 1.25, 0, 0, 6.283);
      g.fill();
    };
    hole(W * 0.75 - 24, 228, 14);
    hole(W * 0.75 + 24, 228, 14);
    hole(W * 0.75, 296, 18);
    g.font = "bold italic 40px system-ui";
    g.fillStyle = "rgba(255,230,140,.85)";
    g.textAlign = "center";
    g.fillText("★ STRIKE ★", W * 0.25, 270);
    return tex(c);
  }
  function pinTexture() {
    const W = 256, H = 1024, [c, g] = mkCanvas(W, H), yv = (y) => (1 - y / PIN_H) * H;
    const base = g.createLinearGradient(0, 0, 0, H);
    base.addColorStop(0, "#fbf9f4");
    base.addColorStop(0.9, "#f2eee6");
    base.addColorStop(1, "#b9b3a8");
    g.fillStyle = base;
    g.fillRect(0, 0, W, H);
    g.fillStyle = "#c4121e";
    g.fillRect(0, yv(0.272), W, yv(0.262) - yv(0.272));
    g.fillRect(0, yv(0.252), W, yv(0.24) - yv(0.252));
    g.save();
    g.translate(W * 0.25, yv(0.205));
    g.scale(1, 2.2);
    g.fillStyle = "#c4121e";
    g.beginPath();
    g.moveTo(-14, 6);
    g.lineTo(-14, -6);
    g.lineTo(-7, 0);
    g.lineTo(0, -9);
    g.lineTo(7, 0);
    g.lineTo(14, -6);
    g.lineTo(14, 6);
    g.closePath();
    g.fill();
    g.restore();
    return tex(c);
  }
  function maskingTexture() {
    const W = 2048, H = 320, [c, g] = mkCanvas(W, H), pw = W / 5;
    const bg = g.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0a0620");
    bg.addColorStop(1, "#170a33");
    g.fillStyle = bg;
    g.fillRect(0, 0, W, H);
    for (let i = 0; i < 260; i++) {
      g.fillStyle = "rgba(255,255,255,".concat(rnd() * 0.5, ")");
      g.fillRect(rnd() * W, rnd() * H, 1.5, 1.5);
    }
    const glow = (col, blur, fn) => {
      g.save();
      g.shadowColor = col;
      g.shadowBlur = blur;
      g.strokeStyle = col;
      g.fillStyle = col;
      fn();
      g.restore();
    };
    for (let k = 0; k < 5; k++) {
      const x0 = k * pw, cx = x0 + pw / 2;
      if (k === 2) {
        glow("#ff4fd8", 24, () => {
          g.font = "italic 900 92px system-ui";
          g.textAlign = "center";
          g.lineWidth = 5;
          g.strokeText("STRIKE", cx, 140);
        });
        glow("#3ff0ff", 24, () => {
          g.font = "italic 900 70px system-ui";
          g.textAlign = "center";
          g.lineWidth = 4;
          g.strokeText("LANES", cx, 225);
        });
        glow("#ffd36b", 16, () => {
          g.lineWidth = 4;
          for (const s of [-1, 1]) {
            g.beginPath();
            g.moveTo(cx + s * 200, 60);
            g.lineTo(cx + s * 200, 260);
            g.stroke();
          }
        });
      } else {
        const cols = ["#3ff0ff", "#ff4fd8", "", "#ffd36b", "#8a4dff"];
        glow(cols[k], 20, () => {
          g.lineWidth = 5;
          g.font = "900 120px system-ui";
          g.textAlign = "center";
          g.strokeText(String(k + 6), cx, 200);
          g.lineWidth = 3;
          g.beginPath();
          for (let i = 0; i <= 40; i++) {
            const xx = x0 + 30 + i * (pw - 60) / 40;
            g.lineTo(xx, 262 + Math.sin(i * 0.7 + k) * 14);
          }
          g.stroke();
        });
        glow("#fff", 10, () => {
          for (let i = 0; i < 4; i++) {
            const sx = x0 + 40 + rnd() * (pw - 80), sy = 40 + rnd() * 60;
            g.beginPath();
            for (let j = 0; j < 10; j++) {
              const a = j * Math.PI / 5, r = j % 2 ? 6 : 15;
              g.lineTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r);
            }
            g.closePath();
            g.fill();
          }
        });
      }
      g.fillStyle = "rgba(255,255,255,.1)";
      g.fillRect(x0, 0, 2, H);
    }
    return tex(c);
  }
  function wallTexture(flip) {
    const W = 2048, H = 256, [c, g] = mkCanvas(W, H);
    const bg = g.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#080418");
    bg.addColorStop(1, "#14082c");
    g.fillStyle = bg;
    g.fillRect(0, 0, W, H);
    const cols = flip ? ["#3ff0ff", "#8a4dff", "#ff4fd8"] : ["#ff4fd8", "#ffd36b", "#3ff0ff"];
    cols.forEach((col, k) => {
      g.save();
      g.shadowColor = col;
      g.shadowBlur = 18;
      g.strokeStyle = col;
      g.lineWidth = 4;
      g.beginPath();
      for (let x = 0; x <= W; x += 8) g.lineTo(x, 70 + k * 55 + Math.sin(x * 6e-3 + k * 1.7) * 26 + Math.sin(x * 0.017 + k) * 9);
      g.stroke();
      g.restore();
    });
    for (let i = 0; i < 26; i++) {
      const x = rnd() * W, y = 20 + rnd() * 210, r = 6 + rnd() * 12, col = cols[i % 3];
      g.save();
      g.shadowColor = col;
      g.shadowBlur = 12;
      g.strokeStyle = col;
      g.lineWidth = 3;
      g.beginPath();
      g.arc(x, y, r, 0, 6.283);
      g.stroke();
      g.restore();
    }
    return tex(c);
  }
  const dotTex = (() => {
    const [c, g] = mkCanvas(64, 64), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "rgba(255,255,255,1)");
    gr.addColorStop(0.25, "rgba(255,255,255,.7)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
    return tex(c);
  })();
  const neonMats = {
    cyan: new MeshBasicMaterial({ color: new Color(4184319).multiplyScalar(1.5) }),
    pink: new MeshBasicMaterial({ color: new Color(16732072).multiplyScalar(1.5) }),
    violet: new MeshBasicMaterial({ color: new Color(9063935).multiplyScalar(1.5) }),
    gold: new MeshBasicMaterial({ color: new Color(16762977).multiplyScalar(3) })
  };
  const NEON_BASE = Object.fromEntries(Object.entries(neonMats).map(([k, m]) => [k, m.color.clone()]));
  const add = (geo, mat, x, y, z, o = {}) => {
    const m = new Mesh(geo, mat);
    m.position.set(x, y, z);
    if (o.rx) m.rotation.x = o.rx;
    if (o.ry) m.rotation.y = o.ry;
    if (o.rz) m.rotation.z = o.rz;
    m.castShadow = !!o.cast;
    m.receiveShadow = !!o.recv;
    scene.add(m);
    return m;
  };
  const laneMat = new MeshPhysicalMaterial({ map: laneTexture(), roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.035, specularIntensity: 0.7, envMapIntensity: 0.9 });
  const approachMat = new MeshPhysicalMaterial({ map: approachTexture(), roughness: 0.4, clearcoat: 0.8, clearcoatRoughness: 0.08, envMapIntensity: 0.8 });
  const laneGeo = new PlaneGeometry(LANE_W, LANE_TOTAL);
  const gutterGeo = new CylinderGeometry(GUT_W / 2, GUT_W / 2, LANE_TOTAL, 28, 1, true, Math.PI / 2, Math.PI);
  const gutterMat = new MeshPhysicalMaterial({ color: 2303546, metalness: 0.85, roughness: 0.28, clearcoat: 0.6, side: DoubleSide, envMapIntensity: 1.2 });
  const capGeo = new BoxGeometry(0.12, 0.07, LANE_TOTAL + 0.4), capMat = new MeshPhysicalMaterial({ color: 1380394, roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.1 });
  const stripGeo = new BoxGeometry(0.022, 0.012, LANE_TOTAL + 0.4);
  for (let k = -2; k <= 2; k++) {
    const cx = k * PITCH;
    add(laneGeo, laneMat, cx, 0, -LANE_TOTAL / 2, { rx: -Math.PI / 2, recv: true }).userData.noRefl = 1;
    for (const s of [-1, 1]) add(gutterGeo, gutterMat, cx + s * (LH + GUT_W / 2), 0, -LANE_TOTAL / 2, { rx: -Math.PI / 2, recv: true }).userData.noRefl = 1;
  }
  const capColors = ["violet", "pink", "cyan", "cyan", "pink", "violet"];
  for (let k = -3; k <= 2; k++) {
    const x = (k + 0.5) * PITCH;
    add(capGeo, capMat, x, 0.035, -LANE_TOTAL / 2 - 0.2, { recv: true });
    add(stripGeo, neonMats[capColors[k + 3]], x, 0.074, -LANE_TOTAL / 2 - 0.2);
  }
  add(new PlaneGeometry(5 * PITCH + 0.4, 5.5), approachMat, 0, 0, 2.75, { rx: -Math.PI / 2, recv: true }).userData.noRefl = 1;
  add(new PlaneGeometry(40, 40), new MeshStandardMaterial({ color: 460047, roughness: 0.9 }), 0, -0.13, -8, { rx: -Math.PI / 2 }).userData.noRefl = 1;
  {
    const rects = [];
    for (let k = -2; k <= 2; k++) rects.push([k * PITCH, LANE_W, 0, LANE_TOTAL]);
    rects.push([0, 5 * PITCH + 0.4, -5.5, 0]);
    const pos = [], idx = [];
    rects.forEach(([cx, w, y0, y1], i) => {
      const b = i * 4;
      pos.push(cx - w / 2, y0, 0, cx + w / 2, y0, 0, cx + w / 2, y1, 0, cx - w / 2, y1, 0);
      idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
    });
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setIndex(idx);
    const shader = {
      name: "LaneGloss",
      uniforms: { color: { value: null }, tDiffuse: { value: null }, textureMatrix: { value: null }, strength: { value: 1.5 }, texel: { value: new Vector2(1 / 1024, 1 / 512) } },
      vertexShader: "uniform mat4 textureMatrix; varying vec4 vUv; varying vec3 vW;\n      void main(){ vUv = textureMatrix * vec4(position, 1.0); vW = (modelMatrix * vec4(position, 1.0)).xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: "uniform sampler2D tDiffuse; uniform vec3 color; uniform float strength; uniform vec2 texel; varying vec4 vUv; varying vec3 vW;\n      void main(){ vec2 uv = vUv.xy / vUv.w; vec3 c = vec3(0.0); float tot = 0.0;\n        for (int i = -1; i <= 1; i++) for (int j = -2; j <= 2; j++) { float w = 1.0 / (1.0 + float(i*i) + 0.5*float(j*j));\n          c += texture2D(tDiffuse, uv + vec2(float(i) * 1.0, float(j) * 1.3) * texel).rgb * w; tot += w; }\n        c /= tot; vec3 V = normalize(cameraPosition - vW); float ct = clamp(V.y, 0.0, 1.0);\n        float fr = 0.06 + 0.94 * pow(1.0 - ct, 5.0);\n        gl_FragColor = vec4(c * strength * fr, 1.0); }"
    };
    var reflector = new Reflector(geo, { textureWidth: Math.round(innerWidth * PR * 0.5), textureHeight: Math.round(innerHeight * PR * 0.5), shader, multisample: 0, clipBias: 2e-3 });
    reflector.material.transparent = true;
    reflector.material.blending = AdditiveBlending;
    reflector.material.depthWrite = false;
    reflector.material.uniforms.texel.value.set(1 / (innerWidth * PR * 0.5), 1 / (innerHeight * PR * 0.5));
    reflector.rotation.x = -Math.PI / 2;
    reflector.position.y = 15e-4;
    reflector.renderOrder = 1;
    const reflRender = reflector.onBeforeRender;
    reflector.onBeforeRender = function(r, sc, cam, ...a) {
      if (sc.overrideMaterial) return;
      reflRender.call(this, r, sc, cam, ...a);
    };
    scene.add(reflector);
  }
  const black = new MeshStandardMaterial({ color: 328456, roughness: 0.95, envMapIntensity: 0.05 });
  add(new BoxGeometry(5 * PITCH + 0.4, 0.05, BACK_Z - DECK_END), black, 0, PIT_Y - 0.025, (DECK_END + BACK_Z) / 2).receiveShadow = true;
  add(new PlaneGeometry(5 * PITCH + 0.4, 1.3), new MeshStandardMaterial({ color: 656914, roughness: 1 }), 0, 0.2, BACK_Z, {});
  for (let k = -3; k <= 2; k++) {
    const x = (k + 0.5) * PITCH;
    add(new BoxGeometry(0.1, 1.1, BACK_Z - HEAD_Z - 0.6), new MeshStandardMaterial({ color: 723213, roughness: 0.55, envMapIntensity: 0.15 }), x, 0.15, (HEAD_Z + 0.6 + BACK_Z) / 2, { recv: true });
    add(new BoxGeometry(0.03, 0.03, 1.4), neonMats[capColors[k + 3]], x + (x < 0 ? 0.052 : -0.052) * 0, 0.6, HEAD_Z - 0.2);
  }
  const maskTex = maskingTexture();
  const maskMat = new MeshStandardMaterial({ map: maskTex, emissiveMap: maskTex, emissive: 16777215, emissiveIntensity: 1.8, roughness: 0.6 });
  const masking = window.__masking = add(new PlaneGeometry(5 * PITCH + 0.4, 1), maskMat, 0, 1.12, HEAD_Z + 0.85);
  add(new BoxGeometry(5 * PITCH + 0.4, 1, 1.36), new MeshBasicMaterial({ color: 197125 }), 0, 1.13, HEAD_Z + 0.14);
  const deckLightMat = new MeshBasicMaterial({ color: new Color(16773853).multiplyScalar(2.2) });
  window.__deckStrip = add(new BoxGeometry(5 * PITCH + 0.4, 0.012, 0.03), deckLightMat, 0, 0.622, HEAD_Z + 0.84);
  add(new PlaneGeometry(5 * PITCH + 1, 30), new MeshStandardMaterial({ color: 459790, roughness: 0.8 }), 0, 3.3, -8, { rx: Math.PI / 2 });
  const panelMat = new MeshBasicMaterial({ color: new Color(16771532).multiplyScalar(4) });
  const panelGeo = new BoxGeometry(0.9, 0.02, 0.45);
  for (let k = -2; k <= 2; k++) for (let z = 1.5; z > HEAD_Z + 3; z -= 3.2) add(panelGeo, panelMat, k * PITCH, 3.28, z).userData.noRefl = 0;
  const wallMat = pbr("brown_planks_03", { repeat: [9, 1.2], color: 3812390, roughness: 0.75 });
  setTimeout(() => {
    for (const sz of ["1k", "512"]) for (const k of ["Diffuse", "nor_gl", "Rough", "AO"]) {
      const im = new Image();
      im.decoding = "async";
      im.src = "assets/textures/brown_planks_03/brown_planks_03_".concat(k, "_").concat(sz, ".jpg");
    }
  }, 6e3);
  const sconceMat = new MeshBasicMaterial({ color: new Color(16763274).multiplyScalar(2.2) });
  for (const s of [-1, 1]) {
    add(new PlaneGeometry(26, 3.3), wallMat, s * (2.5 * PITCH + 0.5), 1.65, -8, { ry: -s * Math.PI / 2, recv: true });
    for (let z = 1; z > HEAD_Z; z -= 4) add(new BoxGeometry(0.06, 0.32, 0.12), sconceMat, s * (2.5 * PITCH + 0.47), 2.1, z);
  }
  const PROFILE = [[0, 2.03], [0.75, 2.83], [2.25, 3.91], [3.375, 4.51], [4.5, 4.766], [5.875, 4.563], [7.25, 3.703], [8.625, 2.472], [10, 1.797], [10.875, 1.87], [11.75, 2.264], [12.5, 2.51], [13.5, 2.4], [14.3, 1.85], [14.8, 1.05], [15, 0]].map(([y, d]) => new Vector2(d * 0.0254 / 2, y * 0.0254));
  const pinGeo = (() => {
    const pts = new SplineCurve(PROFILE).getPoints(90);
    pts.unshift(new Vector2(0, 0));
    pts[pts.length - 1].x = 0;
    const g = new LatheGeometry(pts, 40), p = g.attributes.position, uv = g.attributes.uv;
    for (let i = 0; i < p.count; i++) uv.setY(i, p.getY(i) / PIN_H);
    g.translate(0, -PIN_COM, 0);
    g.computeVertexNormals();
    return g;
  })();
  const pinMat = new MeshPhysicalMaterial({ map: pinTexture(), roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.04, sheen: 0.2, envMapIntensity: 1 });
  const pinMeshes = PIN_SPOTS.map(() => {
    const m = new Mesh(pinGeo, pinMat);
    m.castShadow = true;
    m.receiveShadow = true;
    scene.add(m);
    return m;
  });
  {
    const inst = new InstancedMesh(pinGeo, pinMat, 40), M = new Matrix4();
    let i = 0;
    for (const k of [-2, -1, 1, 2]) for (const [x, z] of PIN_SPOTS) {
      M.makeTranslation(k * PITCH + x, PIN_COM, z);
      inst.setMatrixAt(i++, M);
    }
    inst.castShadow = true;
    scene.add(inst);
  }
  const ballTex = ballTexture([14, 10, 40], [58, 26, 104], [150, 110, 210]);
  const ballMat = new MeshPhysicalMaterial({ map: ballTex, roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.015, metalness: 0.05, iridescence: 0.25, iridescenceIOR: 1.6, envMapIntensity: 1.3 });
  const ballGeo = new SphereGeometry(BALL_R, 64, 40);
  const ballMesh = new Mesh(ballGeo, ballMat);
  ballMesh.castShadow = true;
  scene.add(ballMesh);
  const ballGlow = new Sprite(new SpriteMaterial({ map: dotTex, color: 16732120, blending: AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 }));
  const RET_X = PITCH / 2;
  {
    const shell = new MeshPhysicalMaterial({ color: 2824814, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.05, metalness: 0.1 });
    const hood = add(new SphereGeometry(0.34, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), shell, RET_X, 0.3, 2.9, { cast: true });
    hood.scale.set(0.7, 0.8, 0.9);
    add(new CylinderGeometry(0.24, 0.26, 0.3, 40), shell, RET_X, 0.15, 2.9, { cast: true, recv: true });
    const ring = add(new TorusGeometry(0.135, 0.012, 12, 48), neonMats.cyan, RET_X, 0.39, 2.62);
    ring.rotation.y = Math.PI;
    add(new CircleGeometry(0.125, 32), new MeshBasicMaterial({ color: 131332 }), RET_X, 0.39, 2.625);
    const rail = new MeshPhysicalMaterial({ color: 13159640, metalness: 1, roughness: 0.18 });
    for (const s of [-1, 1]) {
      const r = add(new CylinderGeometry(0.014, 0.014, 1.3, 12), rail, RET_X + s * 0.075, 0.36, 1.95, { rx: Math.PI / 2 - 0.04, cast: true });
    }
    for (const s of [-1, 1]) add(new BoxGeometry(0.03, 0.42, 0.03), rail, RET_X + s * 0.075, 0.17, 1.35, { cast: true });
    const decor = [[16742938, [255, 120, 30], [255, 200, 60], [255, 255, 200]], [49832, [0, 120, 110], [0, 210, 180], [200, 255, 240]]];
    decor.forEach(([_, a, b, c], i) => {
      const m = new MeshPhysicalMaterial({ map: ballTexture(a, b, c), roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 1.2 });
      const bm = add(ballGeo, m, RET_X, 0.36 + BALL_R * 0.75, 1.5 + i * 0.23, { cast: true });
      bm.rotation.set(rnd() * 6, rnd() * 6, 0);
    });
  }
  const sweep = add(new BoxGeometry(LANE_W + 0.2, 0.09, 0.025), new MeshPhysicalMaterial({ color: 3158589, metalness: 0.9, roughness: 0.3 }), 0, 0.85, HEAD_Z + 0.45, { cast: true });
  const sweepGlow = new Mesh(new BoxGeometry(LANE_W + 0.2, 0.012, 0.028), neonMats.gold);
  sweepGlow.position.y = -0.04;
  sweep.add(sweepGlow);
  const aimGroup = new Group();
  scene.add(aimGroup);
  const chevMat = new MeshBasicMaterial({ color: new Color(4190463).multiplyScalar(2.2), transparent: true, opacity: 0.9, blending: AdditiveBlending, depthWrite: false });
  {
    const sh = new Shape();
    sh.moveTo(0, 0.09);
    sh.lineTo(0.09, -0.02);
    sh.lineTo(0.055, -0.045);
    sh.lineTo(0, 0.02);
    sh.lineTo(-0.055, -0.045);
    sh.lineTo(-0.09, -0.02);
    sh.closePath();
    const cg = new ShapeGeometry(sh);
    for (let i = 0; i < 4; i++) {
      const m = new Mesh(cg, chevMat.clone());
      m.rotation.x = -Math.PI / 2;
      m.position.set(0, 4e-3, -0.45 - i * 0.24);
      m.scale.setScalar(1.5 - i * 0.12);
      aimGroup.add(m);
    }
  }
  const PATH_N = 64;
  const pathGeo = new BufferGeometry();
  pathGeo.setAttribute("position", new BufferAttribute(new Float32Array(PATH_N * 3), 3));
  pathGeo.setAttribute("color", new BufferAttribute(new Float32Array(PATH_N * 3), 3));
  const pathPts = new Points(pathGeo, new PointsMaterial({ map: dotTex, size: 0.07, vertexColors: true, transparent: true, blending: AdditiveBlending, depthWrite: false }));
  scene.add(pathPts);
  const TRAIL_N = 90;
  const trailGeo = new BufferGeometry();
  trailGeo.setAttribute("position", new BufferAttribute(new Float32Array(TRAIL_N * 3), 3));
  trailGeo.setAttribute("color", new BufferAttribute(new Float32Array(TRAIL_N * 3), 3));
  const trail = new Points(trailGeo, new PointsMaterial({ map: dotTex, size: 0.16, vertexColors: true, transparent: true, blending: AdditiveBlending, depthWrite: false }));
  scene.add(trail);
  const trailHist = [];
  const SPARK_N = 220, sparkGeo = new BufferGeometry(), sparkP = new Float32Array(SPARK_N * 3), sparkC = new Float32Array(SPARK_N * 3), sparks = [];
  sparkGeo.setAttribute("position", new BufferAttribute(sparkP, 3));
  sparkGeo.setAttribute("color", new BufferAttribute(sparkC, 3));
  scene.add(new Points(sparkGeo, new PointsMaterial({ map: dotTex, size: 0.05, vertexColors: true, transparent: true, blending: AdditiveBlending, depthWrite: false })));
  function burst(x, y, z, n, speed, cols) {
    for (let i = 0; i < n; i++) {
      if (sparks.length >= SPARK_N) sparks.shift();
      const a = rnd() * 6.283, e = rnd() * 1.2;
      sparks.push({ p: new Vector3(x, y, z), v: new Vector3(Math.cos(a) * Math.cos(e), Math.sin(e) + 0.3, Math.sin(a) * Math.cos(e)).multiplyScalar(speed * (0.3 + rnd())), life: 1, c: new Color(cols[i % cols.length]) });
    }
  }
  scene.add(new HemisphereLight(8023295, 1707032, 0.45));
  const sun = new DirectionalLight(16770760, 1.7);
  sun.position.set(0.6, 7, -5.5);
  sun.target.position.set(0, 0, -9.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 4096);
  sun.shadow.camera.up.set(0, 0, -1);
  Object.assign(sun.shadow.camera, { left: -2.3, right: 2.3, top: 12, bottom: -12, near: 0.5, far: 20 });
  sun.shadow.bias = -3e-4;
  sun.shadow.normalBias = 0.02;
  sun.shadow.radius = 4;
  scene.add(sun, sun.target);
  const deckSpot = new SpotLight(16773598, 7, 7, 0.75, 0.6, 1.2);
  deckSpot.position.set(0, 0.6, HEAD_Z + 0.8);
  deckSpot.target.position.set(0, 0.1, HEAD_Z - 0.6);
  deckSpot.castShadow = true;
  deckSpot.shadow.mapSize.set(1024, 1024);
  deckSpot.shadow.bias = -5e-4;
  deckSpot.shadow.radius = 3;
  scene.add(deckSpot, deckSpot.target);
  const wideSpot = new SpotLight(16772829, 5, 9, 1.25, 0.6, 1.2);
  wideSpot.position.set(0, 0.62, HEAD_Z + 0.9);
  wideSpot.target.position.set(0, 0, HEAD_Z - 0.6);
  scene.add(wideSpot, wideSpot.target);
  for (const [x, c] of [[-4, 16758903], [4, 16758903]]) for (const z of [-3, -13]) {
    const l = new PointLight(c, 3, 9, 1.5);
    l.position.set(x, 2.2, z);
    scene.add(l);
  }
  const approachLight = new PointLight(16767408, 3, 6, 1.6);
  approachLight.position.set(0, 2.6, 2);
  scene.add(approachLight);
  const flash = new PointLight(16777215, 0, 3, 2);
  scene.add(flash);
  const SPH = [[0.055, 0.046], [0.112, 0.0605], [0.168, 0.053], [0.222, 0.034], [0.262, 0.024], [0.312, 0.031], [0.35, 0.026]].map(([y, r]) => ({ o: new Vector3(0, y - PIN_COM, 0), r }));
  const RING = [];
  for (let i = 0; i < 10; i++) {
    const a = i / 10 * 6.283;
    RING.push(new Vector3(Math.cos(a) * 0.0245, -PIN_COM, Math.sin(a) * 0.0245));
  }
  class Body {
    constructor(ball2) {
      this.ball = ball2;
      this.p = new Vector3();
      this.q = new Quaternion();
      this.qi = new Quaternion();
      this.v = new Vector3();
      this.w = new Vector3();
      this.im = 1 / (ball2 ? BALL_M : PIN_M);
      this.iI = ball2 ? new Vector3() : new Vector3(1 / 0.0165, 1 / 19e-4, 1 / 0.0165);
      this.awake = false;
      this.still = 0;
      this.active = true;
      this.ground = false;
      this.wc = SPH.map(() => new Vector3());
      this.hit = 0;
    }
  }
  const pins = PIN_SPOTS.map(() => new Body(false));
  const ball = new Body(true);
  ball.awake = true;
  ball.wc = [ball.p];
  const BALL_SPH = [{ r: BALL_R }];
  const V = () => new Vector3();
  const t1 = V(), t2 = V(), t3 = V(), vr = V(), Jv = V(), tang = V(), upV = V();
  const POOL = Array.from({ length: 900 }, () => ({ a: null, b: null, p: V(), n: V(), ra: V(), rb: V(), jt: V(), jn: 0, kN: 0, target: 0, bias: 0, mu: 0 }));
  let nC = 0;
  const dyn = (b) => b.ball || b.awake;
  function invI(b, v, out) {
    if (b.ball || !b.awake) return out.set(0, 0, 0);
    out.copy(v).applyQuaternion(b.qi);
    out.x *= b.iI.x;
    out.y *= b.iI.y;
    out.z *= b.iI.z;
    return out.applyQuaternion(b.q);
  }
  function kTerm(c, n) {
    let k = 0;
    const a = c.a, b = c.b;
    if (dyn(a)) {
      k += a.im;
      t1.crossVectors(c.ra, n);
      invI(a, t1, t2);
      k += t1.dot(t2);
    }
    if (b && dyn(b)) {
      k += b.im;
      t1.crossVectors(c.rb, n);
      invI(b, t1, t2);
      k += t1.dot(t2);
    }
    return k;
  }
  function relVel(c, out) {
    const a = c.a, b = c.b;
    out.crossVectors(a.w, c.ra).add(a.v);
    if (b) {
      t3.crossVectors(b.w, c.rb).add(b.v);
      out.sub(t3);
    }
    return out;
  }
  function impulse(c, J) {
    const a = c.a, b = c.b;
    if (dyn(a)) {
      a.v.addScaledVector(J, a.im);
      if (!a.ball) {
        t1.crossVectors(c.ra, J);
        invI(a, t1, t2);
        a.w.add(t2);
      }
    }
    if (b && dyn(b)) {
      b.v.addScaledVector(J, -b.im);
      if (!b.ball) {
        t1.crossVectors(c.rb, J);
        invI(b, t1, t2);
        b.w.sub(t2);
      }
    }
  }
  const events = [];
  function contact(a, b, px, py, pz, nx, ny, nz, depth, e, mu, dt, kind) {
    if (nC >= POOL.length) return;
    const c = POOL[nC++];
    c.a = a;
    c.b = b;
    c.p.set(px, py, pz);
    c.n.set(nx, ny, nz);
    c.ra.subVectors(c.p, a.p);
    if (b) c.rb.subVectors(c.p, b.p);
    c.jn = 0;
    c.jt.set(0, 0, 0);
    c.mu = mu;
    c.kN = kTerm(c, c.n) || 1e9;
    const vn = relVel(c, vr).dot(c.n);
    c.target = vn < -0.35 ? -e * vn : 0;
    c.bias = Math.min(1.2, 0.22 * Math.max(0, depth - 6e-4) / dt);
    if (kind && vn < -0.7) events.push([kind, -vn, px, py, pz]);
  }
  const groundY = (x, z) => z < DECK_END ? PIT_Y : Math.abs(x) > LH ? -0.075 : 0;
  function pinEnv(b, dt) {
    b.ground = false;
    const pts = b.wc;
    for (let i = 0; i < SPH.length; i++) {
      const c = pts[i], r = SPH[i].r, gy = groundY(c.x, c.z);
      if (c.y - r < gy) {
        contact(b, null, c.x, gy, c.z, 0, 1, 0, gy - (c.y - r), 0.25, 0.22, dt, null);
        b.ground = true;
      }
      if (Math.abs(c.x) + r > WALL_X) {
        const s = Math.sign(c.x);
        contact(b, null, s * WALL_X, c.y, c.z, -s, 0, 0, Math.abs(c.x) + r - WALL_X, 0.45, 0.2, dt, "wall");
      }
      if (c.z - r < BACK_Z) contact(b, null, c.x, c.y, BACK_Z, 0, 0, 1, BACK_Z - (c.z - r), 0.1, 0.4, dt, null);
      if (c.y + r > 1) contact(b, null, c.x, 1, c.z, 0, -1, 0, c.y + r - 1, 0.2, 0.2, dt, null);
    }
    for (const o of RING) {
      t1.copy(o).applyQuaternion(b.q).add(b.p);
      const gy = groundY(t1.x, t1.z);
      if (t1.y < gy) {
        contact(b, null, t1.x, gy, t1.z, 0, 1, 0, gy - t1.y, 0.2, 0.3, dt, b.awake && b.v.y < -0.8 ? "floor" : null);
        b.ground = true;
      }
    }
  }
  function pairContacts(a, b, sa, sb, e, mu, dt, kind) {
    let hit = false;
    for (let i = 0; i < sa.length; i++) for (let j = 0; j < sb.length; j++) {
      const ca = a.wc[i], cb = b.wc[j], r = sa[i].r + sb[j].r, dx = ca.x - cb.x, dy = ca.y - cb.y, dz = ca.z - cb.z, d2 = dx * dx + dy * dy + dz * dz;
      if (d2 >= r * r || d2 < 1e-12) continue;
      const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, nz = dz / d, pr = sb[j].r + (r - d) / 2;
      if (!hit) {
        hit = true;
        for (const [s, o] of [[a, b], [b, a]]) if (!s.ball && !s.awake && dyn(o) && (o.v.lengthSq() > 0.01 || o.w.lengthSq() > 1 || r - d > 3e-3)) {
          s.awake = true;
          s.still = 0;
        }
      }
      contact(a, b, cb.x + nx * pr, cb.y + ny * pr, cb.z + nz * pr, nx, ny, nz, r - d, e, mu, dt, kind);
    }
    return hit;
  }
  let firstImpact = 0, simT = 0;
  const ballS = { spin: 0, gutter: 0, inPlay: false, english: 0, bumpers: false };
  function updateWC(b) {
    b.qi.copy(b.q).invert();
    for (let i = 0; i < SPH.length; i++) b.wc[i].copy(SPH[i].o).applyQuaternion(b.q).add(b.p);
  }
  function ballLane(dt) {
    const b = ball, s = ballS;
    if (!s.inPlay) return;
    if (b.p.z > DECK_END && !s.gutter) {
      const f = hookFactor(b.p.z);
      b.v.x += (s.spin * f + assistAccel(b.p.x, b.p.z) * (s.noAssist ? 0 : 1) + s.english) * dt;
      s.spin *= Math.exp(-dt * 0.3 * f);
      b.v.multiplyScalar(Math.exp(-dt * 0.012));
      if (s.bumpers && Math.abs(b.p.x) > LH - 0.035) {
        const sg = Math.sign(b.p.x);
        b.p.x = sg * (LH - 0.035);
        if (b.v.x * sg > 0) {
          b.v.x = -b.v.x * 0.55 - sg * 0.05;
          s.spin *= 0.4;
          sfx.bump();
        }
      } else if (Math.abs(b.p.x) > LH + 4e-3) {
        s.gutter = Math.sign(b.p.x);
        s.early = !firstImpact;
        if (s.early) {
          sfx.gutter();
          onGutter();
        }
      }
      b.p.y = BALL_R;
      b.v.y = 0;
    } else if (s.gutter && b.p.z > DECK_END) {
      const gx = s.gutter * (LH + GUT_W / 2);
      b.p.x += (gx - b.p.x) * Math.min(1, dt * 14);
      b.v.x = 0;
      b.p.y = BALL_R - 0.12;
      b.v.y = 0;
    } else {
      b.v.y -= 9.81 * dt;
      if (b.p.y < PIT_Y + BALL_R) {
        b.p.y = PIT_Y + BALL_R;
        if (b.v.y < -1) sfx.thud(Math.min(1, -b.v.y / 4));
        b.v.y = -b.v.y * 0.15;
        b.v.x *= 0.97;
        b.v.z *= 0.97;
      }
      if (b.p.z < BACK_Z + BALL_R) {
        b.p.z = BACK_Z + BALL_R;
        b.v.z = -b.v.z * 0.2;
      }
      if (Math.abs(b.p.x) > WALL_X - BALL_R) {
        b.p.x = Math.sign(b.p.x) * (WALL_X - BALL_R);
        b.v.x *= -0.3;
      }
    }
  }
  function step(dt) {
    simT += dt;
    for (const p of pins) if (p.active && p.awake) p.v.y -= 9.81 * dt;
    ballLane(dt);
    nC = 0;
    for (const p of pins) if (p.active) updateWC(p);
    for (const p of pins) if (p.active && p.awake) pinEnv(p, dt);
    for (let i = 0; i < pins.length; i++) {
      const a = pins[i];
      if (!a.active) continue;
      for (let j = i + 1; j < pins.length; j++) {
        const b = pins[j];
        if (!b.active || !a.awake && !b.awake) continue;
        if (a.p.distanceToSquared(b.p) > 0.18) continue;
        pairContacts(a, b, SPH, SPH, 0.42, 0.25, dt, "pin");
      }
    }
    if (ballS.inPlay) for (const p of pins) {
      if (!p.active || p.p.distanceToSquared(ball.p) > 0.16) continue;
      if (pairContacts(ball, p, BALL_SPH, SPH, 0.62, 0.12, dt, "ball")) {
        p.awake = true;
        if (!firstImpact) {
          firstImpact = simT;
          onImpact();
        }
      }
    }
    for (let it = 0; it < 10; it++) for (let k = 0; k < nC; k++) {
      const c = POOL[k];
      const vn = relVel(c, vr).dot(c.n);
      let dj = (c.target + c.bias - vn) / c.kN;
      const nj = Math.max(0, c.jn + dj);
      dj = nj - c.jn;
      c.jn = nj;
      if (dj !== 0) impulse(c, Jv.copy(c.n).multiplyScalar(dj));
      relVel(c, vr);
      tang.copy(vr).addScaledVector(c.n, -vr.dot(c.n));
      const vt = tang.length();
      if (vt > 1e-5) {
        tang.multiplyScalar(1 / vt);
        const kT = kTerm(c, tang) || 1e9;
        Jv.copy(c.jt).addScaledVector(tang, -vt / kT);
        const mx = c.mu * c.jn;
        if (Jv.length() > mx) Jv.setLength(mx);
        t3.copy(Jv).sub(c.jt);
        c.jt.copy(Jv);
        impulse(c, t3);
      }
    }
    if (ballS.inPlay && ball.p.z > DECK_END) {
      ball.v.y = 0;
      if (!ballS.gutter) ball.p.y = BALL_R;
    }
    if (ballS.inPlay) ball.p.addScaledVector(ball.v, dt);
    if (ballS.inPlay && G.lastThrow && G.lastThrow.arriveX === void 0 && ball.p.z < HEAD_Z + 0.25) G.lastThrow.arriveX = +ball.p.x.toFixed(3);
    for (const b of pins) {
      if (!b.active || !b.awake) continue;
      b.p.addScaledVector(b.v, dt);
      const q = b.q, wx = b.w.x, wy = b.w.y, wz = b.w.z, h = 0.5 * dt, qx = q.x, qy = q.y, qz = q.z, qw = q.w;
      q.set(qx + h * (wx * qw + wy * qz - wz * qy), qy + h * (wy * qw + wz * qx - wx * qz), qz + h * (wz * qw + wx * qy - wy * qx), qw + h * (-wx * qx - wy * qy - wz * qz)).normalize();
      if (b.ground) {
        b.w.multiplyScalar(Math.exp(-dt * 0.9));
        b.v.multiplyScalar(Math.exp(-dt * 0.35));
      }
      if (b.v.lengthSq() < 16e-4 && b.w.lengthSq() < 0.16 && b.ground) {
        if ((b.still += dt) > 0.3) {
          b.awake = false;
          b.v.set(0, 0, 0);
          b.w.set(0, 0, 0);
        }
      } else b.still = 0;
    }
  }
  const hookFactor = (z) => 0.07 + 0.93 * smooth(8.5, 13.5, -z);
  let assist = 0.35;
  function assistAccel(x, z) {
    if (z > -8 || z < HEAD_Z + 0.4) return 0;
    return clamp(assist * 2.2 * (POCKET_X - x), -0.9, 0.9) * smooth(8, 11, -z);
  }
  function predictPath(x0, spd, spin, out) {
    let x = x0, z = START_Z, vx = 0, s = spin;
    const dt = 1 / 60;
    let n = 0;
    while (z > HEAD_Z && n < 2e3) {
      const f = hookFactor(z);
      vx += (s * f + assistAccel(x, z)) * dt;
      s *= Math.exp(-dt * 0.3 * f);
      x += vx * dt;
      z -= spd * dt;
      n++;
      if (out && n % 3 === 0) out.push(x, z);
      if (Math.abs(x) > LH) break;
    }
    return x;
  }
  const isStanding = (p) => {
    if (!p.active) return false;
    upV.set(0, 1, 0).applyQuaternion(p.q);
    return upV.y > 0.93 && Math.abs(p.p.x) < LH + 0.02 && p.p.z > DECK_END && Math.abs(p.p.y - PIN_COM) < 0.035;
  };
  function setPin(i, x, z, jitter = 0) {
    const p = pins[i];
    p.p.set(x + (rnd() - 0.5) * jitter, PIN_COM, z + (rnd() - 0.5) * jitter);
    p.q.identity();
    p.v.set(0, 0, 0);
    p.w.set(0, 0, 0);
    p.awake = false;
    p.active = true;
    p.still = 0;
    pinMeshes[i].visible = true;
  }
  let ac = null, master, noiseBuf, rumbleG, rumbleF, humG;
  function audioInit() {
    if (ac) {
      ac.resume();
      return;
    }
    try {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      master = ac.createGain();
      master.gain.value = QS.has("mute") ? 0 : 0.85;
      const comp = ac.createDynamicsCompressor();
      comp.threshold.value = -14;
      master.connect(comp);
      comp.connect(ac.destination);
      noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const src = ac.createBufferSource();
      src.buffer = noiseBuf;
      src.loop = true;
      rumbleF = ac.createBiquadFilter();
      rumbleF.type = "lowpass";
      rumbleF.frequency.value = 160;
      rumbleF.Q.value = 2.5;
      rumbleG = ac.createGain();
      rumbleG.gain.value = 0;
      src.connect(rumbleF);
      rumbleF.connect(rumbleG);
      rumbleG.connect(master);
      src.start();
      const o = ac.createOscillator();
      o.frequency.value = 46;
      humG = ac.createGain();
      humG.gain.value = 0;
      o.connect(humG);
      humG.connect(master);
      o.start();
      loadPinSounds();
    } catch (e) {
      ac = null;
    }
  }
  function env(g, t, a, peak, dec) {
    g.gain.setValueAtTime(1e-4, t);
    g.gain.exponentialRampToValueAtTime(Math.max(2e-4, peak), t + a);
    g.gain.exponentialRampToValueAtTime(1e-4, t + a + dec);
  }
  function tone(f, len, vol, type = "sine", drop = 1, at = 0) {
    if (!ac) return;
    const t = ac.currentTime + at, o = ac.createOscillator(), g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(f * drop, t + len);
    env(g, t, 4e-3, vol, len);
    o.connect(g);
    g.connect(master);
    o.start(t);
    o.stop(t + len + 0.05);
  }
  function noise(len, vol, type, freq, q, at = 0, attack = 2e-3) {
    if (!ac) return;
    const t = ac.currentTime + at, n = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    n.buffer = noiseBuf;
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    env(g, t, attack, vol, len);
    n.connect(f);
    f.connect(g);
    g.connect(master);
    n.start(t, Math.random() * 1.5);
    n.stop(t + len + attack + 0.05);
  }
  let clackBudget = 0;
  const PINSND = {};
  function loadPinSounds() {
    for (const k of ["pins_crash", "pin_knock1", "pin_knock2"])
      fetch(new URL("assets/sfx/" + k + ".mp3", location.href)).then((r) => r.arrayBuffer()).then((b) => ac.decodeAudioData(b)).then((buf) => {
        PINSND[k] = buf;
      }).catch(() => {
      });
  }
  let lastKnock = 0;
  function playBuf(buf, vol, rate = 1, at = 0, fadeIn = 6e-3) {
    if (!ac || !buf) return false;
    const t = ac.currentTime + at, n = ac.createBufferSource(), g = ac.createGain();
    n.buffer = buf;
    n.playbackRate.value = rate;
    g.gain.setValueAtTime(1e-4, t);
    g.gain.linearRampToValueAtTime(vol, t + fadeIn);
    n.connect(g);
    g.connect(master);
    n.start(t);
    return true;
  }
  function clack(vol, at = 0) {
    if (!ac || vol < 0.02) return;
    const when = ac.currentTime + at;
    if (when - lastKnock < 0.025) return;
    lastKnock = when;
    vol = Math.min(0.45, vol * 0.7);
    const b = PINSND[Math.random() < 0.5 ? "pin_knock1" : "pin_knock2"] || PINSND.pin_knock1;
    if (!playBuf(b, Math.min(1, vol * 1.3), 0.88 + Math.random() * 0.24, at)) tone(900 + Math.random() * 300, 0.04, vol * 0.25, "triangle", 0.7, at);
  }
  const sfx = {
    release: () => {
      tone(85, 0.25, 0.5, "sine", 0.6);
      noise(0.18, 0.25, "lowpass", 300, 1);
    },
    // the ball meeting the rack: the real recording, louder and a hair lower for a harder hit
    crash: (p) => {
      if (!playBuf(PINSND.pins_crash, 0.32 + 0.33 * p, 0.97 + Math.random() * 0.06 - 0.03 * p, 0, 0.012)) for (let i = 0; i < 9; i++) clack(0.5 * p * (1 - i / 12), i * 0.035);
    },
    gutter: () => {
      tone(140, 0.35, 0.35, "triangle", 0.6);
      noise(0.4, 0.2, "lowpass", 500, 1);
    },
    bump: () => {
      tone(220, 0.15, 0.3, "triangle", 0.8);
      clack(0.15);
    },
    thud: (v) => {
      tone(60, 0.25, 0.4 * v, "sine", 0.6);
      noise(0.2, 0.2 * v, "lowpass", 300, 1);
    },
    strike: () => {
      [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.5, 0.18, "triangle", 1, i * 0.08));
      noise(1.8, 0.22, "bandpass", 1300, 0.5, 0.15, 0.3);
    },
    spare: () => {
      [659, 880, 1175].forEach((f, i) => tone(f, 0.45, 0.17, "triangle", 1, i * 0.1));
      noise(1.2, 0.14, "bandpass", 1300, 0.5, 0.1, 0.25);
    },
    oops: () => {
      tone(392, 0.28, 0.16, "triangle", 0.95);
      tone(311, 0.5, 0.16, "triangle", 0.9, 0.3);
    },
    ok: () => {
      tone(784, 0.18, 0.14, "triangle");
      tone(988, 0.25, 0.12, "triangle", 1, 0.08);
    },
    tick: () => tone(1320, 0.04, 0.06),
    press: () => {
      tone(660, 0.12, 0.15, "triangle", 1.5);
    },
    sweep: () => {
      noise(0.9, 0.12, "bandpass", 380, 1.2, 0, 0.2);
      tone(110, 0.6, 0.12, "sawtooth", 0.8);
    },
    ret: () => {
      noise(1, 0.08, "bandpass", 250, 2, 0, 0.3);
      tone(90, 0.2, 0.25, "sine", 0.7, 0.9);
    },
    cheer: () => {
      noise(2.2, 0.3, "bandpass", 1500, 0.4, 0, 0.25);
      for (let i = 0; i < 6; i++) tone(1400 + Math.random() * 900, 0.25, 0.04, "sine", 1.3, Math.random() * 1.2);
    }
  };
  const G = {
    fast: FAST,
    state: "title",
    frame: 0,
    ballN: 0,
    rolls: [],
    score: 0,
    strikes: 0,
    spares: 0,
    gutters: 0,
    gutterRun: 0,
    streak: 0,
    throws: 0,
    impacts: 0,
    fps: 60,
    aimX: 0,
    predX: 0,
    standing: 10,
    lastKnock: 0,
    t0: 0,
    bumpers: false,
    ended: false,
    turbo: FAST,
    english: 0,
    lastMsg: "",
    granny: 0,
    celebrate: 0
  };
  window.__game = G;
  G.arm = () => ({
    src: ARM.src,
    L: ARM.arms.L.ph,
    R: ARM.arms.R.ph,
    rL: +ARM.arms.L.r.toFixed(2),
    rR: +ARM.arms.R.r.toFixed(2),
    log: ARM.log,
    dbg: (k) => {
      const A = ARM.arms[k];
      return { r: +A.r.toFixed(2), z: +A.z.toFixed(2), zLow: +A.zLow.toFixed(2), vis: A.vis, len: +A.len.toFixed(2), armT: Math.round(A.armT), dropT: Math.round(A.dropT), ph: A.ph };
    }
  });
  let phaseT = 0, standingBefore = [], resetAll = true, prevStrike = false, idleT = 0, canThrowAt = 0;
  const $ = (id) => document.getElementById(id);
  function scoreTable(r) {
    const out = [];
    let i = 0, cum = 0;
    const m = (v) => v === 0 ? "-" : String(v);
    for (let f = 0; f < 10; f++) {
      if (f < 9) {
        if (r[i] === void 0) {
          out.push({ marks: ["", ""], cum: null });
          continue;
        }
        if (r[i] === 10) {
          const ok = r[i + 1] !== void 0 && r[i + 2] !== void 0;
          if (ok) cum += 10 + r[i + 1] + r[i + 2];
          out.push({ marks: ["", "X"], cum: ok ? cum : null });
          i += 1;
        } else {
          const b = r[i + 1];
          if (b === void 0) {
            out.push({ marks: [m(r[i]), ""], cum: null });
            i += 2;
            continue;
          }
          const spare = r[i] + b === 10, ok = !spare || r[i + 2] !== void 0;
          if (ok) cum += r[i] + b + (spare ? r[i + 2] : 0);
          out.push({ marks: [m(r[i]), spare ? "/" : m(b)], cum: ok ? cum : null });
          i += 2;
        }
      } else {
        const a = r[i], b = r[i + 1], c = r[i + 2], mk = ["", "", ""];
        if (a !== void 0) mk[0] = a === 10 ? "X" : m(a);
        if (b !== void 0) mk[1] = a === 10 ? b === 10 ? "X" : m(b) : a + b === 10 ? "/" : m(b);
        if (c !== void 0) mk[2] = a === 10 && b === 10 || a !== 10 && a + b === 10 ? c === 10 ? "X" : m(c) : b + c === 10 ? "/" : m(c);
        const done = b !== void 0 && (a + b < 10 ? true : c !== void 0);
        if (done) cum += a + b + (c || 0);
        out.push({ marks: mk, cum: done ? cum : null });
      }
    }
    return out;
  }
  function renderBoard() {
    const t = scoreTable(G.rolls);
    let last = 0;
    t.forEach((f) => {
      if (f.cum !== null) last = f.cum;
    });
    G.score = last;
    $("board").innerHTML = '<span class="lbl">FRAME</span><b>'.concat(Math.min(10, G.frame + 1), '</b><span class="sep"></span><span class="lbl">SCORE</span><b class="sc">').concat(last, "</b>");
  }
  function banner(big, small, cls = "") {
    const b = $("banner");
    b.querySelector(".big").textContent = big;
    b.querySelector(".big").className = "big " + cls;
    b.querySelector(".small").textContent = small;
    b.classList.remove("on");
    void b.offsetWidth;
    b.classList.add("on");
    G.lastMsg = big;
  }
  const ADJ = { 1: [2, 3], 2: [1, 3, 4, 5], 3: [1, 2, 5, 6], 4: [2, 5, 7, 8], 5: [2, 3, 4, 6, 8, 9], 6: [3, 5, 9, 10], 7: [4, 8], 8: [4, 5, 7, 9], 9: [5, 6, 8, 10], 10: [6, 9] };
  function isSplit(up) {
    if (up.includes(1) || up.length < 2) return false;
    const seen = /* @__PURE__ */ new Set([up[0]]), st = [up[0]];
    while (st.length) {
      const p = st.pop();
      for (const q of ADJ[p]) if (up.includes(q) && !seen.has(q)) {
        seen.add(q);
        st.push(q);
      }
    }
    return seen.size < up.length;
  }
  function newGame() {
    G.frame = 0;
    G.ballN = 0;
    G.rolls = [];
    G.strikes = 0;
    G.spares = 0;
    G.gutters = 0;
    G.gutterRun = 0;
    G.streak = 0;
    G.ended = false;
    G.bumpers = false;
    G.t0 = performance.now();
    assist = 0.35;
    resetAll = true;
    prevStrike = false;
    PIN_SPOTS.forEach(([x, z], i) => setPin(i, x, z, 8e-3));
    try {
      BP.music("bowling");
    } catch (e) {
    }
    $("title").classList.add("hide");
    $("end").classList.add("hide");
    renderBoard();
    beginAim();
  }
  function beginAim() {
    G.state = "aim";
    phaseT = 0;
    idleT = 0;
    canThrowAt = performance.now() + 1100 / FAST;
    pins.forEach((p) => p._placed = 0);
    if (BP.recenter) BP.recenter(1100 / FAST);
    ballS.inPlay = false;
    ballS.gutter = 0;
    ballS.english = 0;
    firstImpact = 0;
    ballMesh.visible = true;
    trailHist.length = 0;
    standingBefore = pins.map((p, i) => p.active ? i : -1).filter((i) => i >= 0);
    SW.fwd = false;
    SW.meter = 0;
    SW.released = 0;
    G.english = 0;
    sfx.ret();
    retAnim = 0;
  }
  let retAnim = 1;
  const stance = { sh: 0 };
  function throwBall(power, dir, wrist, how) {
    var _a;
    if (G.state !== "aim" || performance.now() < canThrowAt) return;
    const granny = how === "granny";
    power = clamp(power, 0, 1);
    const spd = granny ? 3.6 + power * 2.4 : 4.2 + power * 4.6;
    ballS.spin = clamp((granny ? 0 : BASE_SPIN) + wrist, -1.4, 0.6);
    if (HOLD.k > 0.5 && bowler.real && bowler.fresh) {
      HOLD.wait = performance.now();
      BA.released(HOLD.wait);
      HOLD.drop = 0;
    } else {
      HOLD.from.copy(ballMesh.position);
      HOLD.from.y = Math.min(HOLD.from.y, BALL_R + 0.3);
      HOLD.drop = HOLD.k > 0.5 ? 1 : 0;
      HOLD.dz = 0;
    }
    HOLD.k = 0;
    HOLD.lows.length = 0;
    ball.p.set(G.aimX, BALL_R, START_Z);
    ball.v.set(Math.sin(dir) * spd, 0, -Math.cos(dir) * spd);
    ballS.inPlay = true;
    ballS.gutter = 0;
    ballS.noAssist = how === "auto";
    ballS.bumpers = G.bumpers || granny;
    ballS.english = 0;
    firstImpact = 0;
    G.state = "roll";
    phaseT = 0;
    G.throws++;
    G.lastThrow = { power, dir, spin: ballS.spin, how, speed: spd, aimX: +G.aimX.toFixed(3), pred: +predictPath(G.aimX, spd, ballS.spin, null).toFixed(3), assist: +assist.toFixed(2) };
    G.granny = granny ? 1 : 0;
    SW.released = power;
    sfx.release();
    shake = 0.2;
    stance.sh = (_a = BP.body.shoulders) != null ? _a : BP.body.x;
  }
  function onImpact() {
    G.impacts++;
    const sp = ball.v.length();
    sfx.crash(clamp(sp / 8, 0.35, 1));
    slowmo = sp > 4 ? 1 : 0.5;
    shake = 0.6 * clamp(sp / 8, 0.3, 1);
    burst(ball.p.x, 0.15, ball.p.z - 0.1, 70, 3.2, [16777215, 16769658, 4190463]);
    flash.position.set(ball.p.x, 0.4, ball.p.z + 0.3);
    flash.intensity = 6;
  }
  function onGutter() {
    G.gutters++;
  }
  function finishRoll() {
    const up = pins.map((p, i) => i).filter((i) => isStanding(pins[i]));
    const knocked = standingBefore.filter((i) => !up.includes(i)).length;
    G.lastKnock = knocked;
    G.rolls.push(knocked);
    G.standing = up.length;
    const f = G.frame, b = G.ballN, R = G.rolls;
    let msg = null, small = "", cls = "", next = "keep", over = false;
    const allDown = up.length === 0;
    if (allDown && (b === 0 || f === 9 && (b === 1 && R[R.length - 2] === 10 || b === 2 && (R[R.length - 2] === 10 || R[R.length - 3] + R[R.length - 2] === 10)))) {
      G.strikes++;
      G.streak++;
      msg = ["STRIKE!", "DOUBLE!", "TURKEY!", "HAMBONE!"][Math.min(3, G.streak - 1)] || "STRIKE!";
      small = G.streak >= 2 ? "".concat(G.streak, " IN A ROW!") : "ALL TEN!";
      if (G.streak > 4) msg = "".concat(G.streak, "-BAGGER!");
      celebrate(1);
      sfx.strike();
      assist = Math.max(0, assist - 0.08);
    } else if (allDown) {
      G.spares++;
      G.streak = 0;
      msg = "SPARE!";
      small = "CLEANED IT UP!";
      cls = "cool";
      celebrate(0.55);
      sfx.spare();
      assist = Math.max(0, assist - 0.03);
    } else {
      G.streak = 0;
      if (knocked === 0) {
        msg = ballS.gutter && ballS.early ? "GUTTER BALL" : "MISSED!";
        small = "SHAKE IT OFF, YOU GOT THIS";
        cls = "soft";
        sfx.oops();
        assist = Math.min(0.9, assist + 0.12);
      } else if (b === 0 && isSplit(up.map((i) => i + 1))) {
        msg = "SPLIT!";
        small = "".concat(up.map((i) => i + 1).join(" - "), " LEFT · GO GET 'EM");
        cls = "cool";
        sfx.ok();
      } else {
        msg = knocked === 9 ? "SO CLOSE!" : knocked >= 7 ? "NICE ROLL!" : knocked >= 4 ? "GOOD ONE!" : "KEEP GOING!";
        small = "".concat(knocked, " PIN").concat(knocked > 1 ? "S" : "");
        cls = "soft";
        sfx.ok();
        if (knocked < 4) assist = Math.min(0.9, assist + 0.06);
      }
    }
    G.gutterRun = ballS.gutter && ballS.early ? G.gutterRun + 1 : 0;
    if (G.gutterRun >= 2 && !G.bumpers) {
      G.bumpers = true;
      small = "BUMPERS UP! NO MORE GUTTERS";
    }
    if (f < 9) {
      if (b === 0 && allDown) next = "frame";
      else if (b === 0) {
        next = "keep";
        G.ballN = 1;
      } else next = "frame";
    } else {
      if (b === 0) {
        G.ballN = 1;
        next = allDown ? "reset" : "keep";
      } else if (b === 1) {
        const a = R[R.length - 2];
        if (a === 10 || a + knocked === 10) {
          G.ballN = 2;
          next = allDown ? "reset" : "keep";
        } else over = true;
      } else over = true;
    }
    if (next === "frame") {
      G.frame++;
      G.ballN = 0;
    }
    resetAll = next !== "keep";
    if (over) {
      G.ended = true;
      if (G.rolls.length === 12 && G.rolls.every((r) => r === 10)) {
        msg = "PERFECT GAME!";
        small = "300 · TWELVE IN A ROW!";
      }
    }
    renderBoard();
    if (msg) banner(msg, small, cls);
    G.state = "result";
    phaseT = 0;
  }
  function celebrate(k) {
    G.celebrate = k;
    confetti(k);
    flashMask = k;
    shake = Math.max(shake, 0.35 * k);
    burst(0, 0.5, HEAD_Z - 0.3, Math.round(150 * k), 3.5, [16732120, 4190463, 16769658, 9063935]);
  }
  function endGame() {
    G.state = "end";
    BP.saveSession({ game: "bowling", score: G.score });
    if (BP.highScores) BP.highScores("bowling", G.score);
    $("endScore").textContent = G.score;
    $("end").classList.remove("hide");
    audioInit();
    sfx.cheer(1.2);
  }
  let activeSec = 0, kcal = 0;
  let phoneSeen = false;
  const HOLD = { k: 0, side: 1, arm: "R", pos: new Vector3(), drop: 0, from: new Vector3(), lows: [], wait: 0, dz: 0 };
  function holdLow(now) {
    const A = typeof ARM !== "undefined" ? ARM.arms[HOLD.arm] : null;
    if (!A || A.ph === "rest") {
      HOLD.lows.length = 0;
      return;
    }
    HOLD.lows.push([now, HOLD.pos.y]);
    while (HOLD.lows.length && now - HOLD.lows[0][0] > 400) HOLD.lows.shift();
    let m = HOLD.pos.y;
    for (const l of HOLD.lows) m = Math.min(m, l[1]);
    HOLD.pos.y = Math.min(HOLD.pos.y, m + 0.03);
  }
  function holdBall(dt, ready) {
    const live = BP.live && !BP.mouse && !BP.simulating;
    HOLD.k += ((live && ready >= 1 ? 1 : 0) - HOLD.k) * Math.min(1, dt * 6);
    if (HOLD.k < 0.01) return;
    if (typeof ARM !== "undefined" && !BA.active()) {
      const AL = ARM.arms.L, AR = ARM.arms.R;
      if (AL.ph !== "rest" && AR.ph === "rest") HOLD.arm = "L";
      else if (AR.ph !== "rest") HOLD.arm = "R";
    }
    const gl = bowler.fresh && bowler.opacity > 0.5 ? bowler.glove(HOLD.arm === "L" ? "l" : "r") : null;
    if (gl && gl.seen) {
      const pd = bowler.real && bowler.palmDir && bowler.palmDir(HOLD.arm === "L" ? "l" : "r");
      if (pd) HOLD.pos.copy(gl.p).addScaledVector(pd, BALL_R * 0.92);
      else HOLD.pos.set(gl.p.x, gl.p.y - BALL_R * 0.55, gl.p.z);
      HOLD.pos.y = Math.max(BALL_R, HOLD.pos.y);
      if (!bowler.real) holdLow(performance.now());
      ball.p.lerp(HOLD.pos, HOLD.k);
      return;
    }
    const h = BP.hands[HOLD.arm === "L" ? "left" : "right"];
    if (!h.seen) return;
    const nx = clamp(h.x, 0.06, 0.94) * 2 - 1, ny = -(clamp(h.y, 0.12, 0.96) * 2 - 1);
    HOLD.ray = HOLD.ray || new Raycaster();
    HOLD.ray.setFromCamera({ x: nx, y: ny }, camera);
    const d = HOLD.ray.ray.direction, o = HOLD.ray.ray.origin, dist = 1.5;
    HOLD.pos.set(o.x + d.x * dist, Math.max(BALL_R, o.y + d.y * dist), o.z + d.z * dist);
    holdLow(performance.now());
    ball.p.lerp(HOLD.pos, HOLD.k);
  }
  function heldBallPos() {
    const sd = HOLD.arm === "L" ? "l" : "r", gl = bowler.real && bowler.fresh ? bowler.glove(sd) : null;
    if (!gl || !gl.seen) return null;
    const pd = bowler.palmDir && bowler.palmDir(sd), p = gl.p.clone();
    if (pd) p.addScaledVector(pd, BALL_R * 0.92);
    else p.y -= BALL_R * 0.55;
    p.y = Math.max(BALL_R, p.y);
    return p;
  }
  const SW = { hist: [], fwd: false, t0: 0, peak: 0, vx0: 0, vxSum: 0, n: 0, low: 0, meter: 0, released: 0, both: 0 };
  const powerFrom = (pk) => clamp((pk - 0.75) / 1.55, 0, 1);
  function canThrow() {
    return G.state === "aim" && performance.now() >= canThrowAt;
  }
  function updateSwing(now, dt) {
    const R = BP.hands.right, L = BP.hands.left;
    SW.hist.push({ t: now, y: R.y, ly: L.y });
    while (SW.hist.length && now - SW.hist[0].t > 900) SW.hist.shift();
    if (!canThrow() || BP.mouse || !R.seen) {
      SW.fwd = false;
      SW.meter += (0 - SW.meter) * Math.min(1, dt * 3);
      return;
    }
    const up = -R.vy;
    if (!SW.fwd) {
      SW.meter += (clamp((R.y - 0.55) / 0.35, 0, 1) * 0.3 - SW.meter) * Math.min(1, dt * 6);
      if (up > 0.7 && R.push > -0.8) {
        SW.fwd = true;
        SW.t0 = now;
        SW.peak = up;
        SW.vx0 = R.vx;
        SW.vxSum = 0;
        SW.n = 0;
        SW.low = Math.max(...SW.hist.map((h) => h.y));
        SW.lowL = Math.max(...SW.hist.map((h) => h.ly));
        SW.lUp = 0;
      }
    } else {
      SW.peak = Math.max(SW.peak, up);
      SW.vxSum += R.vx;
      SW.n++;
      SW.lUp = Math.max(SW.lUp, L.seen ? -L.vy : 0);
      SW.meter = Math.max(SW.meter, powerFrom(SW.peak));
      if (up < SW.peak * 0.5 || R.y < 0.3 || now - SW.t0 > 650) {
        SW.fwd = false;
        idleT = 0;
        const rise = SW.low - R.y;
        if (rise > 0.15 && SW.peak > 0.8) {
          const both = L.seen && SW.lUp > 0.6 && Math.abs(L.x - R.x) < 0.3 && SW.lowL - L.y > 0.12;
          throwBall(powerFrom(SW.peak), clamp(SW.vxSum / Math.max(1, SW.n) * 8e-3, -0.022, 0.022), clamp((R.vx - SW.vx0) * 0.35, -0.8, 0.8), both ? "granny" : "swing");
        }
      }
    }
  }
  const ARM = { t: 0, src: "", arms: { L: newArm(), R: newArm() }, log: [], Tf: 0, Tbad: 0, cool: 0, top: null };
  const BOWL = { low: 0.42, rise: 0.12, rv: 3, rvFast: 5, dzFwd: 0.3, armMs: 2600, hi: 0.55, dropMs: 2600, dropArmMs: 1500, zBack: 0.07, visBack: 0.6, win: 450, coolMs: 1400, topMs: 260 };
  function newArm() {
    return { ph: "rest", h: [], len: 1.1, dl: [], r: 0, q: 0, x: 0, z: 0, vis: 1, hx: 0, low: false, zLow: 0, hiT: -1e9, armT: -1e9, dropT: -1e9, peak: 0, xB: 0, vPk: 0, vAvg: 0 };
  }
  function armSample(now) {
    var _a;
    const I = BP.img, fresh = !BP.simulating && performance.now() - (BP.imgAt || 0) < 700 && I.lShoulder && I.rShoulder && I.lHand && I.rHand && I.lHip && I.rHip;
    let sh, hd, T, src;
    if (fresh) {
      if (BP.imgAt === ARM.t) return "same";
      ARM.t = BP.imgAt;
      src = "img";
      sh = { L: I.lShoulder, R: I.rShoulder };
      hd = { L: I.lHand, R: I.rHand };
      T = Math.hypot((I.lShoulder[0] + I.rShoulder[0] - I.lHip[0] - I.rHip[0]) / 2, (I.lShoulder[1] + I.rShoulder[1] - I.lHip[1] - I.rHip[1]) / 2);
    } else {
      const J2 = BP.joints;
      if (!BP.live || BP.simulating || BP.mouse || !J2.lShoulder || !J2.rShoulder || !J2.lHand || !J2.rHand || !J2.root) return null;
      if (J2 === ARM.t) return "same";
      ARM.t = J2;
      src = "3d";
      const P = (k) => [J2[k][0], -J2[k][1]];
      sh = { L: P("lShoulder"), R: P("rShoulder") };
      hd = { L: P("lHand"), R: P("rHand") };
      T = Math.hypot((J2.lShoulder[0] + J2.rShoulder[0]) / 2 - J2.root[0], (J2.lShoulder[1] + J2.rShoulder[1]) / 2 - J2.root[1]);
    }
    if (!(T > 0.02)) return null;
    if (src !== ARM.src) ARM.Tf = 0;
    ARM.src = src;
    if (!ARM.Tf || ARM.Tbad > 6) {
      ARM.Tf = T;
      ARM.Tbad = 0;
    } else if (Math.abs(T - ARM.Tf) > 0.35 * ARM.Tf) {
      ARM.Tbad++;
      return "same";
    } else {
      ARM.Tbad = 0;
      ARM.Tf += (T - ARM.Tf) * 0.2;
    }
    T = ARM.Tf;
    const V2 = BP.vis || {}, J = BP.joints;
    for (const k of ["L", "R"]) {
      const A = ARM.arms[k], ax = (hd[k][0] - sh[k][0]) / T, ay = (hd[k][1] - sh[k][1]) / T, d = Math.hypot(ax, ay), hk = k === "L" ? "lHand" : "rHand", sk = k === "L" ? "lShoulder" : "rShoulder";
      A.vis = (_a = V2[hk]) != null ? _a : 1;
      if (A.vis > 0.6) {
        A.dl.push(d);
        if (A.dl.length > 400) A.dl.shift();
        if (A.dl.length % 15 === 0 || A.dl.length < 15) {
          const s = [...A.dl].sort((a, b) => a - b);
          A.len = clamp(s[Math.floor(s.length * 0.9)] || 1.1, 0.85, 1.6);
        }
      }
      A.r = 1 - ay / A.len;
      A.q = Math.abs(ax) / A.len;
      A.x = -ax / A.len;
      A.hx = -hd[k][0] / T;
      A.z = J[hk] && J[sk] && BP.live ? J[hk][2] - J[sk][2] : 0;
      A.h.push({ t: now, r: A.r, x: A.x, z: A.z });
      while (A.h.length > 2 && now - A.h[0].t > 600) A.h.shift();
    }
    return src;
  }
  function armRate(A, key, ms = 90) {
    const h = A.h, b = h[h.length - 1];
    let a = h[0];
    for (let i = h.length - 1; i >= 0; i--) if (b.t - h[i].t >= ms) {
      a = h[i];
      break;
    }
    return b.t > a.t ? (b[key] - a[key]) / ((b.t - a.t) / 1e3) : 0;
  }
  function armLowest(A, now, ms) {
    let m = null;
    for (const p of A.h) if (now - p.t <= ms && (!m || p.r < m.r)) m = p;
    return m;
  }
  function updateArmSwing(now, dt) {
    const got = armSample(now);
    if (!got) return false;
    const ok = canThrow();
    if (got === "same") return true;
    const AL = ARM.arms.L, AR = ARM.arms.R;
    let fire = null;
    for (const k of ["L", "R"]) {
      const A = ARM.arms[k], O = k === "L" ? AR : AL;
      if (A.r >= BOWL.hi) A.hiT = now;
      if (!ok) {
        A.ph = "rest";
        A.armT = A.dropT = -1e9;
        A.low = false;
        continue;
      }
      const low = A.r < BOWL.low;
      if (low && !A.low) {
        A.zLow = A.z;
        A.xB = A.x;
        A.dropT = now - A.hiT < BOWL.dropMs ? now : -1e9;
      }
      if (low) {
        const m2 = armLowest(A, now, 300);
        if (m2 && A.r <= m2.r + 0.02) {
          A.zLow = A.z;
          A.xB = A.x;
        }
      }
      A.low = low;
      const sinking = A.r < 0.8 && A.z < A.zLow - BOWL.zBack && armRate(A, "z") <= 0.02, hidden = A.r < 0.8 && A.vis < BOWL.visBack;
      const goingBack = sinking || hidden && A.vis < 0.4;
      if (sinking || hidden) A.armT = now;
      const armed = (now - A.armT < BOWL.armMs || now - A.dropT < BOWL.dropArmMs) && now > ARM.cool;
      const m = armLowest(A, now, BOWL.win), rv = armRate(A, "r");
      A.ph = !armed ? "rest" : low ? "bottom" : "back";
      const dz = armRate(A, "z"), fwd = dz > BOWL.dzFwd || rv >= BOWL.rvFast && dz > -0.2 && A.vis >= 0.65;
      const straight = m && Math.abs(A.x - m.x) <= Math.max(0.35, 0.6 * (A.r - m.r)) && A.vis >= 0.55;
      if (armed && !goingBack && fwd && straight && m && m.r < BOWL.low && A.r - m.r >= BOWL.rise && rv >= BOWL.rv) {
        const jack = A.q > 0.78 || O.r > 0.6 && O.q > 0.6 && A.q > 0.5;
        A.vPk = rv;
        A.rMin = m.r;
        A.tLow = m.t;
        A.xB = m.x;
        A.vAvg = (A.r - m.r) / Math.max(0.05, (now - m.t) / 1e3);
        ARM.log.push({ t: Math.round(now), k, v: +rv.toFixed(2), r: +A.r.toFixed(2), rMin: +m.r.toFixed(2), late: Math.round(now - m.t), z: +A.z.toFixed(2), q: +A.q.toFixed(2), jack, src: ARM.src });
        if (ARM.log.length > 40) ARM.log.shift();
        if (!jack && (!fire || rv > fire.A.vPk)) fire = { k, A, O };
      }
    }
    const busy = AL.ph !== "rest" || AR.ph !== "rest";
    SW.fwd = busy;
    SW.meter += ((busy ? 0.25 : 0) - SW.meter) * Math.min(1, dt * 8);
    if (BP.live && !BP.simulating) {
      phoneSeen = true;
      ARM.wholeT = BP.wholeBody === false ? now : ARM.wholeT || 0;
    }
    if (fire && ok && !BP.simulating && BP.live && BP.present === false) fire = null;
    if (fire && ok) {
      const { A, O } = fire, lat = armRate(A, "x", 120), om = armLowest(O, now, BOWL.win);
      const both = om && O.r - om.r > 0.1 && armRate(O, "r") > 1.2 && Math.abs(A.hx - O.hx) < 0.7 && O.q < 0.6;
      const power = armPower(A.vAvg, A.vPk);
      SW.fwd = false;
      idleT = 0;
      AL.ph = AR.ph = "rest";
      AL.armT = AR.armT = AL.dropT = AR.dropT = -1e9;
      ARM.cool = now + BOWL.coolMs;
      throwBall(power, clamp((A.x - A.xB) * 0.03, -0.022, 0.022), clamp(lat * 0.12, -0.8, 0.8), both ? "granny" : "arm");
      if (G.lastThrow) {
        G.lastThrow.armV = +A.vPk.toFixed(2);
        G.lastThrow.armAvg = +(A.vAvg || 0).toFixed(2);
        G.lastThrow.late = Math.round(now - A.tLow);
      }
      if (G.state === "roll") ARM.top = { A, until: now + BOWL.topMs, vAvg: A.vAvg, vPk: A.vPk, lat, granny: both };
    }
    return true;
  }
  function armTopUp(now) {
    const T = ARM.top;
    if (!T) return;
    if (G.state !== "roll" || now > T.until || !ballS.inPlay) {
      ARM.top = null;
      return;
    }
    const g = armSample(now);
    if (!g || g === "same") return;
    const A = T.A;
    T.vPk = Math.max(T.vPk, armRate(A, "r"));
    T.vAvg = Math.max(T.vAvg, (A.r - A.rMin) / Math.max(0.05, (now - A.tLow) / 1e3));
    const lat = armRate(A, "x", 120);
    if (Math.abs(lat) > Math.abs(T.lat)) T.lat = lat;
    const power = armPower(T.vAvg, T.vPk), spd = T.granny ? 3.6 + power * 2.4 : 4.2 + power * 4.6, cur = ball.v.length();
    if (cur > 0.1) ball.v.multiplyScalar(spd / cur);
    if (!T.granny) ballS.spin = clamp(BASE_SPIN + clamp(T.lat * 0.12, -0.8, 0.8), -1.4, 0.6);
    if (G.lastThrow) {
      G.lastThrow.power = +power.toFixed(3);
      G.lastThrow.speed = +spd.toFixed(2);
      G.lastThrow.spin = ballS.spin;
      G.lastThrow.armV = +T.vPk.toFixed(2);
      G.lastThrow.armAvg = +T.vAvg.toFixed(2);
    }
    SW.released = power;
  }
  const powerArm = (v) => clamp((v - 1) / 4.5, 0, 1);
  const powerAvg = (v) => clamp(0.25 + (v - 3) * 0.1, 0.25, 1);
  const armPower = (vAvg, vPk) => Math.max(powerAvg(vAvg || 0), powerAvg(0.6 * (vPk || 0)));
  let drag = null;
  addEventListener("pointerdown", (e) => {
    if (e.target.closest(".btn")) return;
    audioInit();
    if (G.state === "aim") drag = { x0: e.clientX, y0: e.clientY, t0: performance.now(), pts: [[e.clientX, e.clientY]], aim: G.aimX };
  });
  addEventListener("pointermove", (e) => {
    if (drag) drag.pts.push([e.clientX, e.clientY]);
  });
  addEventListener("pointerup", (e) => {
    if (!drag) return;
    const d = drag;
    drag = null;
    const dy = (d.y0 - e.clientY) / innerHeight, dt = Math.max(0.06, (performance.now() - d.t0) / 1e3);
    if (dy < 0.08) return;
    const mid = d.pts[Math.floor(d.pts.length / 2)], x1 = e.clientX;
    const curve = (x1 - mid[0] - (mid[0] - d.x0)) / innerWidth;
    G.aimX = d.aim;
    throwBall(clamp((dy / dt - 0.4) / 2.2, 0, 1), clamp((x1 - d.x0) / innerWidth * 0.03, -0.022, 0.022), clamp(curve * 5, -0.8, 0.8), "mouse");
  });
  addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      audioInit();
      if (G.state === "title") press("start");
      else if (G.state === "end") press("again");
      else if (G.state === "aim") throwBall(0.7, 0, 0, "key");
    }
    if (e.key === "ArrowLeft") G.aimX -= 0.04;
    if (e.key === "ArrowRight") G.aimX += 0.04;
  });
  function press(act) {
    audioInit();
    sfx.press();
    if (act === "start" || act === "again") newGame();
    else if (act === "home") location.href = "index.html";
    else if (act === "roll") throwBall(0.72, 0, 0, "hover");
  }
  document.querySelectorAll(".btn").forEach((b) => b.addEventListener("click", (e) => {
    e.stopPropagation();
    press(b.dataset.act);
  }));
  function hoverButtons(now) {
    const vis = [...document.querySelectorAll(".btn")].filter((b) => b.getClientRects().length > 0);
    for (const b of vis) {
      const r = b.getBoundingClientRect(), over = BP.handOver({ x: r.left, y: r.top, w: r.width, h: r.height }, innerWidth, innerHeight);
      const ms = b.dataset.act === "roll" ? 900 : b.dataset.act === "home" ? BP.LEAVE_MS || 1400 : 700;
      const k = BP.dwell("btn-" + b.dataset.act + b.id, over, now, ms);
      b.style.setProperty("--fill", over ? Math.min(1, k || 1) : 0);
      b.classList.toggle("over", over);
      if (k === 1) {
        b.style.setProperty("--fill", 0);
        press(b.dataset.act);
      }
    }
  }
  const hud = $("hud"), ctx = hud.getContext("2d");
  function sizeHud() {
    hud.width = innerWidth * PR;
    hud.height = innerHeight * PR;
    hud.style.width = innerWidth + "px";
    hud.style.height = innerHeight + "px";
  }
  sizeHud();
  const conf = [];
  function confetti(k) {
    const n = Math.round(260 * k);
    for (let i = 0; i < n; i++) conf.push({
      x: innerWidth * (0.5 + (rnd() - 0.5) * 0.3),
      y: innerHeight * 0.38,
      vx: (rnd() - 0.5) * innerWidth * 1.4,
      vy: -innerHeight * (0.4 + rnd() * 1.1),
      r: rnd() * 6.28,
      vr: (rnd() - 0.5) * 14,
      s: 6 + rnd() * 9,
      c: ["#ff4fd8", "#3ff0ff", "#ffe27a", "#8a4dff", "#ffffff", "#7dff8a"][i % 6],
      life: 1
    });
  }
  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  }
  let hudR = [];
  function liveTips(now) {
    if (!BP.tip || G.state !== "aim" || BP.mouse || retAnim < 0.95) return;
    const off = G.predX - POCKET_X;
    BP.tip("aim", Math.abs(off) < 0.035 ? "Aim: lined up for a strike" : off < 0 ? "Aim: lean or step a little right to hit the pocket" : "Aim: lean or step a little left to hit the pocket", 600, { hot: Math.abs(off) < 0.035 });
    if (typeof ARM === "undefined" || !ARM.src || !canThrow()) return;
    const sw = ARM.arms.L.ph !== "rest" || ARM.arms.R.ph !== "rest";
    BP.tip("cue", sw ? "Now: swing forward and let go low" : "Bowl: swing back, then forward and let go low", 600, { hot: sw });
  }
  function drawHUD(now, dt) {
    hudR = [];
    {
      const bn = $("banner");
      if (+getComputedStyle(bn).opacity > 0.05) for (const e of bn.querySelectorAll(".big, .small")) {
        const rg = document.createRange();
        rg.selectNodeContents(e);
        const r = rg.getBoundingClientRect();
        if (r.width) hudR.push(r);
      }
    }
    const W = innerWidth, H = innerHeight, s = Math.min(W, H);
    ctx.setTransform(PR, 0, 0, PR, 0, 0);
    ctx.clearRect(0, 0, W, H);
    let txt = "", steer = false;
    if (G.state === "aim") txt = idleT > 8 / FAST && !BP.mouse && !BP.live && !phoneSeen ? "Rolling for you in ".concat(Math.ceil(13 / FAST - idleT), "…") : BP.mouse ? "Drag up to bowl" : "Lean to aim, then swing to bowl";
    else if (G.state === "roll" && !BP.mouse && ballS.inPlay && !ballS.gutter && ball.p.z > HEAD_Z + 1 && phaseT > 0.2) {
      txt = "Lean to steer the ball";
      steer = true;
    }
    if (txt) {
      const fs = Math.max(15, s * 0.032);
      ctx.font = "700 ".concat(fs, "px -apple-system, system-ui, sans-serif");
      const tw = ctx.measureText(txt).width, icon = steer ? fs * 4.2 : fs * 1.6, ph = fs * 2.5, pw = Math.min(W - s * 0.04, tw + icon + fs * 2.4), B0 = window.BPUI ? BPUI.bottom(pw, ph) : { x: W / 2 - pw / 2, y: H - ph - Math.max(10, s * 0.03) }, px = B0.x, py = B0.y;
      roundRect(px, py, pw, ph, ph / 2);
      ctx.fillStyle = "rgba(10,12,24,.55)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.18)";
      ctx.lineWidth = 1;
      ctx.stroke();
      hudR.push({ x: px, y: py, w: pw, h: ph });
      const cy = py + ph / 2;
      if (steer) {
        const e = G.english, bx = px + fs * 1.1, bw = fs * 3;
        ctx.fillStyle = "rgba(255,255,255,.18)";
        roundRect(bx, cy - fs * 0.12, bw, fs * 0.24, fs * 0.12);
        ctx.fill();
        ctx.fillStyle = Math.abs(e) > 0.15 ? "#ff4fd8" : "#3ff0ff";
        ctx.beginPath();
        ctx.arc(bx + bw / 2 + e * bw * 0.45, cy, fs * 0.36, 0, 6.283);
        ctx.fill();
      } else {
        const cx = px + fs * 1.4, a = Math.sin(now / 380) * 1.1, k = fs / 30;
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2.4 * k;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(cx, cy - 11 * k, 4 * k, 0, 6.283);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx, cy - 6 * k);
        ctx.lineTo(cx, cy + 5 * k);
        ctx.lineTo(cx - 4 * k, cy + 13 * k);
        ctx.moveTo(cx, cy + 5 * k);
        ctx.lineTo(cx + 4 * k, cy + 13 * k);
        ctx.stroke();
        const hx = cx + Math.sin(a) * 11 * k, hy = cy - 3 * k + Math.cos(a) * 11 * k;
        ctx.strokeStyle = "#3ff0ff";
        ctx.beginPath();
        ctx.moveTo(cx, cy - 3 * k);
        ctx.lineTo(hx, hy);
        ctx.stroke();
        ctx.fillStyle = "#ff4fd8";
        ctx.beginPath();
        ctx.arc(hx, hy, 3.6 * k, 0, 6.283);
        ctx.fill();
      }
      ctx.fillStyle = "#fff";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(txt, px + icon + fs * 0.8, cy, pw - icon - fs * 1.6);
      ctx.textBaseline = "alphabetic";
    }
    for (let i = conf.length - 1; i >= 0; i--) {
      const c = conf[i];
      c.vy += H * 1.6 * dt;
      c.vx *= 0.985;
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.r += c.vr * dt;
      c.life -= dt * 0.33;
      if (c.life <= 0 || c.y > H + 40) {
        conf.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.r);
      ctx.globalAlpha = Math.min(1, c.life * 2);
      ctx.fillStyle = c.c;
      ctx.fillRect(-c.s / 2, -c.s / 4, c.s, c.s / 2 * Math.abs(Math.cos(c.r * 1.3)) + 1);
      ctx.restore();
    }
    BP.drawHands(ctx, W, H);
  }
  const BowlArm = (() => {
    const D = Math.PI / 180, cl = (v, a, b) => Math.max(a, Math.min(b, v)), ez = (x) => {
      x = cl(x, 0, 1);
      return x * x * (3 - 2 * x);
    };
    const K = {
      peak: 85,
      // top of the backswing (deg behind straight down): about shoulder height
      tBack: 0.55,
      // s from where the drop left off, down through the bottom, up to the top
      tFwd: 0.24,
      // s from the top back down to the bottom
      wait: 4,
      creep: 10,
      waitMax: 1.5,
      // at the bottom waiting for the let-go: creeping forward, then give up
      topMax: 0.9,
      // s at the top with no sign of the forward swing: come down anyway (the let-go follows)
      rel: 6,
      omega: 620,
      relMax: 0.32,
      // the ball leaves at theta >= rel (deg); a late let-go swings down at omega deg/s
      follow: 150,
      tFollow: 0.45,
      holdFollow: 0.9,
      qPeak: 80,
      qBack: 0.16,
      qFwd: 0.13,
      // 'quick': a let-go with no swing drawn gets a 0.29 s backswing to 80 deg (inside HOLD's 450 ms)
      hipK: 0.42,
      // the slide: hips this many leg lengths above the ankles (deeper if he squats deeper)
      lean: 44,
      // chest lean at the release (deg; more if he leans more)
      slideF: 0.24,
      trailB: 0.7,
      trailUp: 0.05,
      // slide foot forward, bowling-side foot back + toe up (m)
      holdMin: 0.3,
      holdBeta: 5
      // steady hold: One Euro cutoff (Hz) and speed gain (per m/s)
    };
    const V3 = (x = 0, y = 0, z = 0) => new Vector3(x, y, z), UP = V3(0, 1, 0);
    function ik2(a, b, l1, l2, pole) {
      const d = b.clone().sub(a), n = d.clone().normalize(), L = cl(d.length(), Math.abs(l1 - l2) + 1e-4, l1 + l2 - 1e-4);
      const x = (l1 * l1 - l2 * l2 + L * L) / (2 * L), h = Math.sqrt(Math.max(0, l1 * l1 - x * x));
      const p = pole.clone().addScaledVector(n, -pole.dot(n));
      if (p.lengthSq() < 1e-8) p.set(0, 0, -1);
      p.normalize();
      return a.clone().addScaledVector(n, x).addScaledVector(p, h);
    }
    const UPPER = ["lShoulder", "rShoulder", "head", "nose", "lElbow", "rElbow", "lWrist", "rWrist", "lGrip", "rGrip"];
    function create4(o = {}) {
      var _a;
      const low = (_a = o.low) != null ? _a : 0.42;
      const S = { again: true, ph: "hold", t0: 0, th: 0, th0: 0, thReal: 0, wArm: 0, wPose: 0, out: true, at: 0, side: "r", cue: null, flt: null, log: o.log || null };
      const go = (ph, now) => {
        S.ph = ph;
        S.t0 = now;
        S.th0 = S.th;
        if (S.log) S.log.push([Math.round(now), ph, +S.th.toFixed(1)]);
      };
      function cueFwd(A) {
        const c = S.cue;
        if (!c) return false;
        return c.visMin < 0.78 && A.vis - c.visMin > 0.13 || c.zMin < c.z0 - 0.05 && A.z - c.zMin > 0.07 || c.rMax - c.r0 > 0.12 && c.rMax - A.r > 0.12;
      }
      function tick(now, A, ok, holding, side) {
        const dt = cl((now - (S.at || now)) / 1e3, 0, 0.1);
        S.at = now;
        if (S.ph === "hold" || S.ph === "ret") S.side = side;
        const t = (now - S.t0) / 1e3, ph = S.ph;
        if (A && A.ph === "rest") S.again = true;
        if (ph === "hold" && A && A.ph !== "rest" && A.r < low) {
          S.dwell || (S.dwell = now);
          if (now - S.dwell > 600) S.redo = true;
        } else S.dwell = 0;
        if (ph === "hold" && ok && holding && A && A.ph === "back" && A.r >= low && S.redo && !S.again) {
          S.redo = false;
          S.cue = null;
          go("back", now);
          S.cue = { visMin: A.vis, zMin: A.z, z0: A.z, rMax: A.r, r0: A.r };
        } else if ((ph === "hold" || ph === "ret") && ok && holding && A && A.ph !== "rest" && S.again) {
          S.again = false;
          S.redo = false;
          S.cue = null;
          go(A.r > low ? "down" : "back", now);
          if (S.ph === "back") S.cue = { visMin: A.vis, zMin: A.z, z0: A.z, rMax: A.r, r0: A.r };
        } else if (ph === "down") {
          S.th = cl(S.thReal, -10, 110);
          if (!ok || !A || A.ph === "rest") go("ret", now);
          else if (A.r < low) {
            go("back", now);
            S.cue = { visMin: A.vis, zMin: A.z, z0: A.z, rMax: A.r, r0: A.r };
          }
        } else if (ph === "back" || ph === "top") {
          const c = S.cue;
          c.visMin = Math.min(c.visMin, A.vis);
          c.zMin = Math.min(c.zMin, A.z);
          if (A.r < c.r0) c.r0 = c.rMax = A.r;
          else c.rMax = Math.max(c.rMax, A.r);
          if (ph === "back") {
            const u = t / K.tBack, mid = (S.th0 - K.peak) / 2, amp = (S.th0 + K.peak) / 2;
            S.th = u >= 1 ? -K.peak : mid + amp * Math.cos(Math.PI * u);
            if (u >= 1) go("top", now);
          } else S.th = -K.peak + 6 * ez(t / 0.5);
          if (!ok || A.ph === "rest") go("ret", now);
          else if ((ph === "top" || t > K.tBack * 0.55) && cueFwd(A)) go("fwd", now);
          else if (ph === "top" && t > K.topMax) go("fwd", now);
        } else if (ph === "fwd") {
          const u = t / K.tFwd;
          S.th = u < 1 ? S.th0 + (K.wait - S.th0) * (1 - Math.cos(Math.PI / 2 * u)) : K.wait + (K.creep - K.wait) * ez((t - K.tFwd) / 0.6);
          if (!ok || t > K.tFwd + K.waitMax) go("ret", now);
        } else if (ph === "quick") {
          const u1 = t / K.qBack, u2 = (t - K.qBack) / K.qFwd;
          S.th = u1 < 1 ? S.th0 + (-K.qPeak - S.th0) * ez(u1) : -K.qPeak + (K.rel + K.qPeak) * ez(u2);
          if (u2 >= 1) {
            S.th = K.rel;
            S.out = true;
            go("follow", now);
          }
        } else if (ph === "through") {
          S.th = S.th < K.rel ? Math.min(K.rel, S.th + K.omega * dt) : Math.max(K.rel, S.th - K.omega * dt);
          if (Math.abs(S.th - K.rel) < 0.5 && S.wPose > 0.85 && S.wArm > 0.9 || t > K.relMax) {
            S.out = true;
            go("follow", now);
          }
        } else if (ph === "follow") {
          S.th = Math.max(S.th0 + (K.follow - S.th0) * ez(t / K.tFollow), Math.min(S.thReal, 170));
          if (t > K.tFollow + K.holdFollow) go("ret", now);
        } else if (ph === "ret") {
          S.th = S.thReal;
          if (S.wArm < 0.02 && S.wPose < 0.02) go("hold", now);
        } else S.th = S.thReal;
        const armOn = !["hold", "ret"].includes(S.ph), poseT = S.ph === "quick" ? (now - S.t0) / 1e3 < K.qBack ? 0.35 : 1 : { hold: 0, ret: 0, down: 0, back: 0.3, top: 0.4, fwd: 1, through: 1, follow: 1 }[S.ph];
        S.wArm += ((armOn ? 1 : 0) - S.wArm) * (1 - Math.exp(-dt / (armOn ? 0.08 : 0.25)));
        S.wPose += (poseT - S.wPose) * (1 - Math.exp(-dt / (S.ph === "through" ? 0.05 : poseT > S.wPose ? 0.14 : 0.4)));
      }
      function released(now) {
        const none = S.ph === "hold" || S.ph === "ret";
        S.out = false;
        go(none ? "quick" : "through", now);
        if (S.wArm < 0.6) S.wArm = 0.6;
      }
      function adjust(J, c) {
        var _a2, _b;
        const s = S.side, o2 = s === "l" ? "r" : "l", f = c.fwd.clone(), right = V3().crossVectors(f, UP).normalize(), sg = s === "r" ? 1 : -1;
        const g = J[s + "Grip"], sh = J[s + "Shoulder"];
        if (!sh) return;
        if (g) {
          const d = g.clone().sub(sh);
          S.thReal = Math.atan2(d.dot(f), -d.y) / D;
        }
        if (g) {
          const now = c.now, F = S.flt;
          if (!F || now - F.at > 400) S.flt = { p: g.clone(), dx: V3(), at: now };
          else {
            const dt = Math.max(4e-3, (now - F.at) / 1e3);
            F.at = now;
            const a = (cut) => 1 / (1 + 1 / (2 * Math.PI * cut * dt));
            const v = g.clone().sub(F.p).divideScalar(dt);
            F.dx.lerp(v, a(1));
            F.p.lerp(g, a(K.holdMin + K.holdBeta * F.dx.length()));
          }
          g.copy(S.flt.p);
        }
        const w = S.wPose;
        if (w > 2e-3 && J.lHip && J.rHip && J.lAnkle && J.rAnkle) {
          const L = c.len, legLen = (L[s].thigh + L[s].calf) * c.SC, a0 = Math.min(J.lAnkle.y, J.rAnkle.y);
          const H = J.lHip.clone().add(J.rHip).multiplyScalar(0.5), drop = Math.max(0, H.y - a0 - K.hipK * legLen) * w;
          for (const k of ["lHip", "rHip", ...UPPER]) if (J[k]) J[k].y -= drop;
          H.y -= drop;
          const tgt = {
            [o2]: H.clone().addScaledVector(f, K.slideF * c.SC).addScaledVector(right, -sg * 0.03 * c.SC).setY(a0),
            [s]: H.clone().addScaledVector(f, -K.trailB * c.SC).addScaledVector(right, sg * 0.12 * c.SC).setY(a0 + K.trailUp * c.SC)
          };
          for (const q of [s, o2]) {
            const A2 = J[q + "Ankle"].clone().lerp(tgt[q], w), hp = J[q + "Hip"];
            const pole = q === o2 ? f.clone().addScaledVector(right, (q === "l" ? -1 : 1) * 0.2).normalize() : f.clone().multiplyScalar(0.4).addScaledVector(UP, -1).normalize();
            J[q + "Ankle"] = A2;
            J[q + "Knee"] = ik2(hp, A2, L[q].thigh * c.SC, L[q].calf * c.SC, pole);
          }
          const shM = J.lShoulder.clone().add(J.rShoulder).multiplyScalar(0.5).sub(H), cur = Math.atan2(shM.dot(f), shM.y) / D;
          const add2 = Math.max(0, K.lean - cur) * w * D;
          if (add2 > 1e-4) {
            const q = new Quaternion().setFromAxisAngle(V3().crossVectors(UP, f).normalize(), add2);
            for (const k of UPPER) if (J[k]) J[k].sub(H).applyQuaternion(q).add(H);
          }
        }
        const wa = S.wArm, sh2 = J[s + "Shoulder"];
        if (wa > 2e-3 && sh2) {
          const L = c.len[s], reach = ((L.up + L.fore) * c.SC + ((_a2 = J[s + "GripLen"]) != null ? _a2 : 0.075 * c.SC)) * 0.985, th = S.th * D;
          const d = f.clone().multiplyScalar(Math.sin(th)).addScaledVector(UP, -Math.cos(th));
          const G2 = sh2.clone().addScaledVector(d, reach).addScaledVector(right, -sg * 0.03 * c.SC);
          const pole = f.clone().multiplyScalar(-Math.cos(th)).addScaledVector(UP, -Math.sin(th)).addScaledVector(right, sg * 0.3).normalize();
          J[s + "Grip"] = g ? g.clone().lerp(G2, wa) : G2;
          J[s + "GripLen"] = (_b = J[s + "GripLen"]) != null ? _b : 0.075 * c.SC;
          J[s + "PoleDir"] = J[s + "PoleDir"] ? J[s + "PoleDir"].clone().lerp(pole, wa).normalize() : pole;
          const hd = J[s + "HandDir"] ? J[s + "HandDir"].clone().lerp(d, wa).normalize() : d.clone();
          J[s + "HandDir"] = hd;
          const pm = f.clone().add(UP);
          pm.addScaledVector(hd, -pm.dot(hd));
          if (pm.lengthSq() > 1e-6) J[s + "Palm"] = pm.normalize();
        }
        S.lastHand = J[s + "Grip"] ? J[s + "Grip"].clone() : null;
      }
      return { S, K, tick, released, adjust, active: () => !["hold", "ret"].includes(S.ph), out: () => S.out, phase: () => S.ph };
    }
    return { create: create4, K };
  })();
  const BA = BowlArm.create({ low: BOWL.low });
  const BOWLER_Z = 0.55, FLAT = QS.get("body") === "fig";
  const BOWLER_LOOK = { fillA: 0.06, rimA: 0.6, rimPow: 1.8 };
  const FIG_OPTS = { scene, camera, BP, x: 0, z: BOWLER_Z, tier: RZ.quality.tier, gloves: false, levelFeet: false, stepRange: 0, depthMin: -0.45, guardDepth: 0.04 };
  const bowlPalm = (s, J) => {
    const d = J[s + "HandDir"];
    if (!d) return null;
    const f = new Vector3(0, 0, -1);
    const p = f.addScaledVector(d, -f.dot(d));
    return p.lengthSq() > 1e-4 ? p.normalize() : null;
  };
  const bowler = FLAT ? create(Object.assign({}, FIG_OPTS, { outfit: { shorts: "rgba(40,60,120,0.85)", band: "#ffd36b", seam: "rgba(20,30,70,0.7)" } })) : create2(Object.assign({}, FIG_OPTS, { outfit: "bowler", grip: { l: "relaxed", r: "ball" }, palm: bowlPalm, adjust: (J, c) => BA.adjust(J, c), personOpts: { clavFollow: true, rollMax: 1.3, plainLook: BOWLER_LOOK }, onFallback: (w) => console.warn("real bowler off:", w) }));
  noAO.push(...bowler.objects);
  const stanceGhost = FLAT ? null : create3(Object.assign({ scene, BP, you: bowler, outfit: "bowler", tier: RZ.quality.tier }, STANCES.bowling));
  let realAO = false;
  window.__bowler = bowler;
  const camPos = new Vector3(0, 1.2, 3.4), camLook = new Vector3(0, 0, -9), want = V(), wantLook = V();
  let shake = 0, slowmo = 0, flashMask = 0, camMode = "aim", pinCamSide = 1;
  function updateCamera(now, dt) {
    const t = now / 1e3;
    if (G.state === "title") {
      const k = t * 0.045 % 1, z = lerp(HEAD_Z + 2.2, 1.5, smooth(0, 1, k));
      want.set(Math.sin(t * 0.21) * 0.55, 0.32 + 0.55 * smooth(0, 1, k) + Math.sin(t * 0.3) * 0.05, z);
      wantLook.set(0, 0.12, HEAD_Z - 0.2);
      camPos.lerp(want, k < 0.01 ? 1 : 1 - Math.exp(-dt * 2));
      camLook.lerp(wantLook, 1 - Math.exp(-dt * 2));
    } else {
      let follow = 3;
      if (camMode === "aim") {
        want.set(G.aimX * 0.6, 2.4, 4.6);
        wantLook.set(G.aimX * 0.3, -1.76, -9);
        follow = 2.6;
      } else if (camMode === "follow") {
        const z = Math.max(ball.p.z, -11.5), over = smooth(BOWLER_Z - 1.2, BOWLER_Z + 2.2, z + 2.7);
        want.set(ball.p.x * 0.6, lerp(0.85 - 0.25 * smooth(0, -11, z), 2.3, over), z + 2.7);
        wantLook.set(ball.p.x * 0.5, 0.1, Math.max(HEAD_Z, z - 9));
        follow = 5;
      } else if (camMode === "pin") {
        const k = clamp(phaseT * 0.12, 0, 1);
        want.set(pinCamSide * lerp(0.55, 0.4, k), lerp(0.42, 0.36, k), HEAD_Z + lerp(2.15, 1.75, k));
        wantLook.set(0, 0.17, HEAD_Z - 0.38);
        follow = 6;
      }
      camPos.lerp(want, 1 - Math.exp(-dt * follow));
      camLook.lerp(wantLook, 1 - Math.exp(-dt * follow));
    }
    window.__deckStrip.visible = camMode !== "pin";
    camera.position.copy(camPos);
    if (shake > 1e-3) {
      camera.position.x += (rnd() - 0.5) * shake * 0.05;
      camera.position.y += (rnd() - 0.5) * shake * 0.05;
      shake *= Math.exp(-dt * 5);
    }
    camera.lookAt(camLook);
  }
  function cutTo(mode) {
    camMode = mode;
    if (mode === "pin") {
      pinCamSide = ball.p.x > 0.05 ? -1 : 1;
      camPos.set(pinCamSide * 0.55, 0.42, HEAD_Z + 2.15);
      camLook.set(0, 0.17, HEAD_Z - 0.38);
    }
  }
  function updateAim(now, dt) {
    var _a;
    const R = BP.hands.right, B = BP.body;
    if (!SW.fwd && !drag) {
      let ax = BP.mouse ? (R.x - 0.5) * 1.1 : ((_a = B.shoulders) != null ? _a : B.x) * 0.42;
      if (BP.mouse || BP.live) G.aimX += (clamp(ax, -0.4, 0.4) - G.aimX) * Math.min(1, dt * 4);
    }
    G.aimX = clamp(G.aimX, -0.4, 0.4);
    idleT += dt;
    if (idleT > 13 / FAST && canThrow() && !BP.live && !phoneSeen) {
      idleT = 0;
      throwBall(0.15, (rnd() - 0.5) * 0.05, 0, "auto");
    }
  }
  let lastNow = 0, fpsAcc = 0, fpsN = 0, fpsT = 0;
  let tvTimer = TV ? performance.now() + 2e3 : 0;
  BP.start();
  renderBoard();
  function frame(now) {
    var _a;
    requestAnimationFrame(frame);
    BP.update(now);
    const rdt = Math.min(0.05, Math.max(1e-3, (now - (lastNow || now)) / 1e3));
    lastNow = now;
    fpsAcc += rdt;
    fpsN++;
    if (now - fpsT > 1e3) {
      G.fps = Math.round(fpsN / fpsAcc);
      fpsAcc = 0;
      fpsN = 0;
      fpsT = now;
    }
    if (tvTimer && now > tvTimer && G.state === "title") {
      tvTimer = 0;
      press("start");
    }
    hoverButtons(now);
    const playing = !["title", "end"].includes(G.state);
    $("board").classList.toggle("hide", !playing);
    $("info").classList.toggle("hide", true);
    const rollOn = G.state === "aim" && performance.now() >= canThrowAt;
    $("rollBtn").classList.toggle("hide", !rollOn);
    if (playing) {
      const bd = $("board"), rb = $("rollBtn"), bw = bd.offsetWidth, bh = bd.offsetHeight, rw = rollOn ? rb.offsetWidth : 0, rh = rollOn ? rb.offsetHeight : 0;
      const L = window.BPUI ? BPUI.top(bw, bh, rw, rh) : { c: { x: (innerWidth - bw) / 2, y: 10 }, r: { x: innerWidth - rw - 10, y: 10 } };
      bd.style.left = L.c.x + "px";
      bd.style.top = L.c.y + "px";
      rb.style.left = L.r.x + "px";
      rb.style.top = L.r.y + "px";
      rb.style.right = "auto";
    }
    if (playing) {
      activeSec += BP.activity.intensity > 0.12 || BP.mouse ? rdt : 0;
      kcal += (1.5 + 7 * BP.activity.intensity) * 3.5 * 75 / 200 / 60 * rdt;
    }
    bowler.setSpot(G.aimX, BOWLER_Z);
    bowler.enabled = camera.position.z > BOWLER_Z + 0.9 && (camera.position.y > 1.95 || camera.position.z > BOWLER_Z + 2.4) && !["title", "end"].includes(G.state);
    BA.tick(now, ARM.arms[HOLD.arm], canThrow(), HOLD.k > 0.5, HOLD.arm === "L" ? "l" : "r");
    bowler.update(now);
    if (!realAO && bowler.person) {
      realAO = true;
      noAO.push(bowler.person.root);
      if (bowler.person.shadow) noAO.push(bowler.person.shadow);
    }
    if (stanceGhost) {
      stanceGhost.update(now, G.state === "aim" && bowler.enabled && !SW.fwd && (BP.live || BP.simulating) && !BP.mouse);
      if (stanceGhost.st.person && !stanceGhost.st.inAO) {
        stanceGhost.st.inAO = true;
        noAO.push(stanceGhost.st.person.root);
      }
    }
    const tscale = (slowmo > 0 ? lerp(1, 0.28, smooth(0, 0.25, slowmo)) : 1) * G.turbo;
    phaseT += rdt;
    if (G.state === "aim") {
      if (!updateArmSwing(now, rdt)) updateSwing(now, rdt);
      updateAim(now, rdt);
      camMode = "aim";
      retAnim = Math.min(1, retAnim + rdt * FAST);
      const k = smooth(0, 1, retAnim), a = smooth(0, 0.55, retAnim), b = smooth(0.55, 1, retAnim);
      const rx = RET_X, rz = lerp(2.5, 1.75, a), ry = 0.36 + BALL_R * 0.75;
      ball.p.set(lerp(rx, G.aimX, b), lerp(ry, BALL_R, b) + Math.sin(b * Math.PI) * 0.15, lerp(rz, START_Z, b));
      ballMesh.rotation.x -= rdt * (1 - b) * 6;
      void k;
      holdBall(rdt, b);
    } else if (G.state === "roll") {
      armTopUp(now);
      if (!BP.mouse && ballS.inPlay) {
        const e = clamp((((_a = BP.body.shoulders) != null ? _a : BP.body.x) - stance.sh) * 1.2, -1, 1);
        G.english += (e - G.english) * Math.min(1, rdt * 6);
        ballS.english = G.english * 0.55 * smooth(HEAD_Z + 0.5, HEAD_Z + 4, ball.p.z);
      }
      if (camMode === "aim" && phaseT > 0.7) camMode = "follow";
      if (camMode === "follow" && ball.p.z < -13.2) cutTo("pin");
      if (ball.p.z < DECK_END - 0.3 || ballS.gutter && ball.p.z < HEAD_Z + 1 || phaseT > 9 || ball.v.lengthSq() < 0.01 && phaseT > 2) {
        G.state = "settle";
        phaseT = 0;
        if (camMode !== "pin") cutTo("pin");
      }
    } else if (G.state === "settle") {
      const asleep = pins.every((p) => !p.active || !p.awake);
      if (asleep && phaseT > (firstImpact ? 1.2 : 0.6) || phaseT > 4.5) finishRoll();
    } else if (G.state === "result") {
      if (phaseT > 1.9 / FAST) {
        if (G.ended) endGame();
        else {
          G.state = "sweep";
          phaseT = 0;
          sfx.sweep();
          sweepKeep = pins.map((p, i) => !resetAll && isStanding(p) ? [p.p.x, p.p.z] : null);
        }
      }
    } else if (G.state === "sweep") {
      runSweep(phaseT * FAST);
      if (phaseT * FAST > 2) {
        sweep.position.set(0, 0.85, HEAD_Z + 0.45);
        beginAim();
      }
    }
    if (slowmo > 0) slowmo -= rdt * 0.9;
    if (["roll", "settle", "result"].includes(G.state) && !HOLD.wait) {
      let left = rdt * tscale;
      const H = 1 / 360;
      let n = 0;
      while (left > 1e-6 && n < 40) {
        step(Math.min(H, left));
        left -= H;
        n++;
      }
    }
    if (G.state === "result" && G.celebrate && BP.body.armsUp && rnd() < rdt * 8) {
      burst((rnd() - 0.5) * 1.2, 0.9 + rnd() * 0.5, HEAD_Z - 0.2, 40, 2.5, [16732120, 4190463, 16769658]);
      flashMask = Math.max(flashMask, 0.6);
      if (rnd() < 0.4) sfx.cheer();
    }
    syncVisuals(now, rdt);
    updateCamera(now, rdt);
    updateAudio(rdt);
    decorateComposer();
    finish.uniforms.uTime.value = now % 1e4 / 1e3;
    renderer.shadowMap.needsUpdate = true;
    if (LOCK) {
      RZ.quality.t0 = performance.now();
      RZ.quality.frames = 0;
    }
    render(rdt);
    G.quality = RZ.quality.tier;
    G.kitFps = Math.round(RZ.quality.fps);
    drawHUD(now, rdt);
  }
  let sweepKeep = [];
  function runSweep(t) {
    const down = smooth(0, 0.45, t), back = smooth(0.45, 1.05, t), upb = smooth(1.15, 1.6, t);
    sweep.position.set(0, lerp(0.85, 0.05, down * (1 - upb)), lerp(HEAD_Z + 0.45, DECK_END - 0.25, back * (1 - upb)));
    const lift = smooth(0.05, 0.45, t) * (1 - smooth(1.2, 1.9, t));
    pins.forEach((p, i) => {
      const keep = sweepKeep[i];
      if (keep) {
        p.awake = false;
        p.q.identity();
        p.p.set(keep[0], PIN_COM + lift * 0.62, keep[1]);
      } else if (p.active && t > 0.45 && sweep.position.z < p.p.z + 0.15) {
        p.active = false;
        pinMeshes[i].visible = false;
      }
      if (resetAll && t > 1.1) {
        const [x, z] = PIN_SPOTS[i];
        if (!p._placed) {
          setPin(i, x, z, 8e-3);
          p._placed = 1;
        }
        p.active = true;
        pinMeshes[i].visible = true;
        p.p.y = PIN_COM + 0.62 * (1 - smooth(1.1, 1.85, t));
      }
    });
    if (t > 1.85 && !resetAll) pins.forEach((p, i) => {
      const k = sweepKeep[i];
      if (k) setPin(i, k[0], k[1]);
    });
    ballMesh.visible = false;
  }
  const tmpC = new Color();
  function syncVisuals(now, dt) {
    pins.forEach((p, i) => {
      pinMeshes[i].position.copy(p.p);
      pinMeshes[i].quaternion.copy(p.q);
      if (!p.active) pinMeshes[i].visible = false;
    });
    if (ballS.inPlay) {
      const sp = ball.v.length();
      if (sp > 0.05) {
        t1.set(-ball.v.z, 0, ball.v.x).normalize();
        ballMesh.rotateOnWorldAxis(t1.multiplyScalar(-1), sp / BALL_R * dt * (G.turbo || 1));
      }
      ballMesh.rotateOnWorldAxis(t2.set(0, 1, 0), ballS.spin * 2 * dt);
      ballMesh.visible = ball.p.z > BACK_Z + 0.05;
    }
    ballMesh.position.copy(ball.p);
    if (HOLD.wait) {
      const p = heldBallPos();
      if (p) ballMesh.position.copy(p);
      if (!p || BA.out() || performance.now() - HOLD.wait > 450) {
        HOLD.from.copy(ballMesh.position);
        HOLD.from.y = Math.min(HOLD.from.y, BALL_R + 0.3);
        HOLD.drop = 1;
        HOLD.dz = 1;
        HOLD.wait = 0;
      }
    }
    if (HOLD.drop > 0) {
      HOLD.drop = Math.max(0, HOLD.drop - dt / 0.18);
      const u = 1 - HOLD.drop, e = u * u * (3 - 2 * u);
      ballMesh.position.y = lerp(HOLD.from.y, ball.p.y, e);
      ballMesh.position.x = lerp(HOLD.from.x, ball.p.x, e);
      if (HOLD.dz) ballMesh.position.z = lerp(HOLD.from.z, ball.p.z, e);
    }
    if (G.state === "roll" && ballS.inPlay && !ballS.gutter && !HOLD.wait) trailHist.unshift([ball.p.x, 0.012, ball.p.z, Math.abs(G.english)]);
    else if (trailHist.length) trailHist.pop();
    if (trailHist.length > TRAIL_N) trailHist.length = TRAIL_N;
    const tp = trailGeo.attributes.position.array, tc = trailGeo.attributes.color.array;
    for (let i = 0; i < TRAIL_N; i++) {
      const h = trailHist[i];
      if (h) {
        tp[i * 3] = h[0];
        tp[i * 3 + 1] = h[1];
        tp[i * 3 + 2] = h[2];
        const f = (1 - i / TRAIL_N) * 0.5;
        tmpC.setHSL(lerp(0.53, 0.88, clamp(h[3] * 3, 0, 1)), 1, 0.55);
        tc[i * 3] = tmpC.r * f;
        tc[i * 3 + 1] = tmpC.g * f;
        tc[i * 3 + 2] = tmpC.b * f;
      } else {
        tp[i * 3 + 1] = -5;
      }
    }
    trailGeo.attributes.position.needsUpdate = true;
    trailGeo.attributes.color.needsUpdate = true;
    const showAim = G.state === "aim" && retAnim > 0.95;
    aimGroup.visible = showAim;
    pathPts.visible = showAim;
    if (showAim) {
      aimGroup.position.set(G.aimX, 0, START_Z);
      aimGroup.children.forEach((m, i) => {
        m.material.opacity = 0.35 + 0.55 * (0.5 + 0.5 * Math.sin(now / 160 - i * 0.9));
      });
      const out = [];
      G.predX = predictPath(G.aimX, 4.2 + 0.85 * 4.6, BASE_SPIN, out);
      const pp = pathGeo.attributes.position.array, pc = pathGeo.attributes.color.array, stepN = Math.max(1, Math.floor(out.length / 2 / PATH_N));
      for (let i = 0; i < PATH_N; i++) {
        const j = i * stepN * 2;
        if (j + 1 < out.length && i > 3) {
          pp[i * 3] = out[j];
          pp[i * 3 + 1] = 0.01;
          pp[i * 3 + 2] = out[j + 1];
          const f = 0.55 * (0.6 + 0.4 * Math.sin(now / 200 - i * 0.5));
          pc[i * 3] = 0.25 * f;
          pc[i * 3 + 1] = 0.94 * f;
          pc[i * 3 + 2] = f;
        } else {
          pp[i * 3 + 1] = -5;
        }
      }
      pathGeo.attributes.position.needsUpdate = true;
      pathGeo.attributes.color.needsUpdate = true;
    } else G.predX = predictPath(G.aimX, 4.2 + 0.85 * 4.6, BASE_SPIN, null);
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.v.y -= 4 * dt;
      s.p.addScaledVector(s.v, dt);
      s.life -= dt * 0.9;
      if (s.life <= 0) sparks.splice(i, 1);
    }
    for (let i = 0; i < SPARK_N; i++) {
      const s = sparks[i];
      if (s) {
        sparkP[i * 3] = s.p.x;
        sparkP[i * 3 + 1] = s.p.y;
        sparkP[i * 3 + 2] = s.p.z;
        const f = s.life * 1.5;
        sparkC[i * 3] = s.c.r * f;
        sparkC[i * 3 + 1] = s.c.g * f;
        sparkC[i * 3 + 2] = s.c.b * f;
      } else sparkP[i * 3 + 1] = -9;
    }
    sparkGeo.attributes.position.needsUpdate = true;
    sparkGeo.attributes.color.needsUpdate = true;
    flash.intensity *= Math.exp(-dt * 6);
    flashMask *= Math.exp(-dt * 1.2);
    const hue = now / 1e3 * 0.6 % 1;
    for (const [k, m] of Object.entries(neonMats)) {
      m.color.copy(NEON_BASE[k]);
      if (flashMask > 0.02) {
        tmpC.setHSL((hue + k.length * 0.13) % 1, 1, 0.6).multiplyScalar(3);
        m.color.lerp(tmpC, clamp(flashMask, 0, 1)).multiplyScalar(1 + flashMask * 0.8);
      }
    }
    maskMat.emissiveIntensity = 1.8 + flashMask * 2.5 * (0.6 + 0.4 * Math.sin(now / 60));
  }
  function updateAudio(dt) {
    if (!ac) return;
    const rolling = ballS.inPlay && G.state !== "title" && ball.p.z > DECK_END && ballMesh.visible;
    const sp = rolling ? ball.v.length() : 0, tgt = rolling ? clamp(sp / 9, 0, 1) * (ballS.gutter ? 0.5 : 0.9) : 0;
    rumbleG.gain.setTargetAtTime(tgt * 0.7, ac.currentTime, 0.05);
    humG.gain.setTargetAtTime(tgt * 0.25, ac.currentTime, 0.05);
    rumbleF.frequency.setTargetAtTime(110 + sp * 22 + (ball.p.z < -12 ? 60 : 0), ac.currentTime, 0.1);
    clackBudget = Math.min(6, clackBudget + dt * 40);
    for (const [kind, v] of events) {
      if (clackBudget < 1) break;
      clackBudget--;
      if (kind === "pin" || kind === "wall") clack(clamp(v / 4, 0.05, 0.6));
      else if (kind === "floor") clack(clamp(v / 6, 0.03, 0.25));
    }
    events.length = 0;
  }
  addEventListener("resize", () => {
    reflector.getRenderTarget().setSize(Math.round(innerWidth * PR * 0.5), Math.round(innerHeight * PR * 0.5));
    reflector.material.uniforms.texel.value.set(1 / (innerWidth * PR * 0.5), 1 / (innerHeight * PR * 0.5));
    sizeHud();
  });
  PIN_SPOTS.forEach(([x, z], i) => setPin(i, x, z));
  ball.p.set(RET_X, 0.43 + BALL_R * 0.7, 1.7);
  G._dbg = { reflector, RZ, sun, deckSpot, renderer, scene, ballZ: () => ball.p.z, SW };
  G.laneEdges = () => {
    const out = [];
    for (const z of [START_Z + 0.6, START_Z, -1, -3, -6, -10, HEAD_Z]) for (const x of [-WALL_X, WALL_X]) {
      const v = new Vector3(x, 0, z).project(camera);
      out.push({ z, x, sx: (v.x + 1) / 2 * innerWidth, sy: (1 - v.y) / 2 * innerHeight, front: v.z < 1 });
    }
    return out;
  };
  G.simRoll = (x, power, dir = 0, wrist = 0, english = 0) => {
    const keepState = G.state;
    PIN_SPOTS.forEach(([px, pz], i) => setPin(i, px, pz, 8e-3));
    const spd = 4.2 + power * 4.6;
    ballS.spin = clamp(BASE_SPIN + wrist, -1.4, 0.6);
    ballS.english = english;
    ballS.noAssist = G.simNoAssist;
    ballS.bumpers = false;
    ballS.gutter = 0;
    ballS.inPlay = true;
    ball.p.set(x, BALL_R, START_Z);
    ball.v.set(Math.sin(dir) * spd, 0, -Math.cos(dir) * spd);
    firstImpact = 0;
    simT = 0;
    let t = 0;
    const H = 1 / 360;
    while (t < 12) {
      step(H);
      t += H;
      if (ball.p.z < DECK_END - 0.3 && pins.every((p) => !p.awake) && t - firstImpact > 1.2) break;
    }
    events.length = 0;
    sparks.length = 0;
    ballS.inPlay = false;
    slowmo = 0;
    shake = 0;
    const up = pins.map((p, i) => isStanding(p) ? i + 1 : 0).filter(Boolean);
    PIN_SPOTS.forEach(([px, pz], i) => setPin(i, px, pz));
    G.state = keepState;
    return { knocked: 10 - up.length, up, t: +t.toFixed(2), entryX: null };
  };
  G.setAssist = (v) => {
    assist = v;
  };
  G.predict = (x, power) => predictPath(x, 4.2 + power * 4.6, BASE_SPIN, null);
  G.newGame = newGame;
  G.endGame = endGame;
  G.say = banner;
  G.throwBall = (p, d, w, how) => throwBall(p, d, w, how || "test");
  G.pins = () => pins.map((p) => isStanding(p) ? 1 : 0);
  scene.traverse((o) => {
    if (!o.userData.noRefl) o.layers.enable(2);
  });
  reflector.camera.layers.set(2);
  RZ.quality.t0 = performance.now();
  RZ.quality.frames = 0;
  requestAnimationFrame(frame);
})().catch((e) => setTimeout(() => {
  throw e;
}));
