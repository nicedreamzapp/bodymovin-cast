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
  OutputPass,
  environment,
  flash,
  pbr,
  realism_exports,
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
import {
  ShaderPass
} from "./chunk-UBB4M7UR.js";
import {
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CapsuleGeometry,
  CatmullRomCurve3,
  Color,
  CylinderGeometry,
  DoubleSide,
  Euler,
  ExtrudeGeometry,
  Float32BufferAttribute,
  FogExp2,
  Group,
  HemisphereLight,
  InstancedMesh,
  MathUtils,
  Matrix4,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NoColorSpace,
  NormalBlending,
  PlaneGeometry,
  Points,
  Quaternion,
  RepeatWrapping,
  SRGBColorSpace,
  ShaderMaterial,
  Shape,
  SphereGeometry,
  TubeGeometry,
  Vector2,
  Vector3
} from "./chunk-4IYDSAYK.js";
import "./chunk-NWIHTO7D.js";

// bmpage:bmpage:extreme.html#0
(async () => {
  const BP = window.BodyMovin;
  const Q = new URLSearchParams(location.search);
  const GAME_ID = "extreme", ROUND = Math.max(10, +Q.get("secs") || 90), MUTE = Q.has("mute"), TV = Q.has("tv");
  const lerp = (a, b, t) => a + (b - a) * t, clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const smooth = (a, b, x) => {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };
  const damp = (a, b, k, dt) => a + (b - a) * (1 - Math.exp(-k * dt));
  function rng(seed) {
    return () => {
      seed |= 0;
      seed = seed + 1831565813 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const hash2 = (x, y) => {
    let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263);
    h = Math.imul(h ^ h >>> 13, 1274126177);
    return ((h ^ h >>> 16) >>> 0) / 4294967296;
  };
  function vnoise(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    return lerp(lerp(hash2(xi, yi), hash2(xi + 1, yi), u), lerp(hash2(xi, yi + 1), hash2(xi + 1, yi + 1), u), v) * 2 - 1;
  }
  const fbm = (x, y, o = 4) => {
    let a = 0, f = 1, w = 0.5;
    for (let i = 0; i < o; i++) {
      a += w * vnoise(x * f + i * 17.3, y * f - i * 9.1);
      f *= 2.03;
      w *= 0.5;
    }
    return a;
  };
  const ridged = (x, y, o = 6) => {
    let a = 0, f = 1, w = 0.55;
    for (let i = 0; i < o; i++) {
      const n = 1 - Math.abs(vnoise(x * f + i * 31.7, y * f + i * 11.3));
      a += w * n * n;
      f *= 2.1;
      w *= 0.5;
    }
    return a;
  };
  const L = 1480, PISTE = 15, S0 = -90, S1 = L + 560;
  const cx = (s) => (22 * Math.sin(s / 170) + 9 * Math.sin(s / 63 + 1.3) - 9 * Math.sin(1.3)) * smooth(-20, 120, s);
  const cxd = (s) => cx(s + 0.5) - cx(s - 0.5);
  const slopeAt = (s) => s < 0 ? 0.06 : s > L + 40 ? lerp(0.27, 0.07, smooth(L + 40, L + 140, s)) : (0.27 + 0.06 * Math.sin(s / 110) + 0.035 * Math.sin(s / 37 + 2)) * smooth(-10, 25, s) + 0.06 * (1 - smooth(-10, 25, s));
  const CY = new Float32Array(Math.ceil(S1 - S0) + 2);
  for (let i = 1; i < CY.length; i++) CY[i] = CY[i - 1] - slopeAt(S0 + i - 0.5);
  const cyOff = CY[-S0];
  const cy = (s) => {
    const f = clamp(s - S0, 0, CY.length - 1.001), i = Math.floor(f);
    return lerp(CY[i], CY[i + 1], f - i) - cyOff;
  };
  const bank = (d) => d <= 0 ? 0 : d < 30 ? 0.022 * d * d : 19.8 + 1 * (d - 30);
  function baseH(s, u) {
    const d = Math.abs(u) - PISTE;
    let h = cy(s) + bank(d);
    h += 0.32 * vnoise(s / 21, u / 17) + 0.12 * vnoise(s / 7.3, u / 6.1) * smooth(-2, 2, d);
    if (d > 0) h += 2.4 * fbm(s * 0.035, u * 0.04, 4) * smooth(0, 12, d);
    return h;
  }
  const world = (s, u, y, out = new Vector3()) => out.set(cx(s) + u, y, -s);
  const R0 = rng(7);
  const FEATURES = [];
  {
    const pat = ["gate", "gate", "kicker", "gate", "rail", "gate", "kicker", "gate", "gate", "kicker", "rail", "gate", "kicker", "gate", "gate", "kicker", "gate", "rail", "kicker", "gate", "gate", "kicker", "gate", "rail", "gate", "kicker", "gate", "kicker", "gate"];
    let s = 75, side = 1, i = 0;
    while (s < L - 70 && i < pat.length) {
      const type = pat[i++], prog = s / L;
      if (type === "gate") {
        side = -side;
        FEATURES.push({ type, s, u: side * lerp(3, 8.5, prog) * (0.75 + 0.5 * R0()), w: lerp(8, 6, prog) });
        s += lerp(46, 40, prog);
      } else if (type === "kicker") {
        const big = prog > 0.45;
        FEATURES.push({ type, s, u: [-4.5, 0, 4.5][Math.floor(R0() * 3)], w: 9, H: big ? 2.9 : 2.3, KL: big ? 11 : 10 });
        s += 78;
      } else {
        FEATURES.push({ type, s, u: (R0() < 0.5 ? -1 : 1) * 3.5, w: 3.2, len: 26, h: 0.62 });
        s += 62;
      }
    }
  }
  FEATURES.forEach((f, i) => {
    f.id = i;
    f.done = false;
  });
  function kickerH(f, s, u) {
    const x = s - f.s;
    if (x < 0 || x > f.KL + 2.6) return 0;
    const lat = 1 - smooth(f.w / 2 - 0.3, f.w / 2 + 1.4, Math.abs(u - f.u));
    if (lat <= 0) return 0;
    const p = x <= f.KL ? f.H * Math.pow(x / f.KL, 2.1) : f.H * (0.5 + 0.5 * Math.cos(Math.PI * (x - f.KL) / 2.6));
    return p * lat;
  }
  const KICKERS = FEATURES.filter((f) => f.type === "kicker"), RAILS = FEATURES.filter((f) => f.type === "rail"), GATES = FEATURES.filter((f) => f.type === "gate");
  function groundAt(s, u) {
    let h = baseH(s, u);
    for (const k of KICKERS) if (s > k.s - 1 && s < k.s + k.KL + 3) h += kickerH(k, s, u);
    return h;
  }
  const RR = setup(document.getElementById("gl"), { fov: 50, near: 0.1, far: 9e3, tier: Q.has("tier") ? +Q.get("tier") : void 0 });
  const { renderer, scene, camera } = RR;
  const ENV_ROT = Q.has("rot") ? +Q.get("rot") : 1.4;
  await environment(scene, renderer, "passendorf_snow", { background: true, intensity: +(Q.get("env") || 0.55), rotation: ENV_ROT });
  renderer.toneMappingExposure = +(Q.get("exp") || 0.8);
  const SUN_DIR = new Vector3(0.782, 0.294, 0.55).normalize().applyAxisAngle(new Vector3(0, 1, 0), ENV_ROT);
  const sun2 = sun(scene, { color: 16773340, intensity: +(Q.get("sun") || 3.3), position: [40, 20, 30], size: 26 });
  sun2.shadow.camera.far = 160;
  sun2.shadow.bias = -4e-4;
  sun2.shadow.normalBias = 0.03;
  sun2.shadow.camera.updateProjectionMatrix();
  const FOG = new Color(12570594);
  scene.fog = new FogExp2(FOG, 3e-4);
  const hemi = new HemisphereLight(13623551, 16777215, 0.12);
  scene.add(hemi);
  const snowMat = pbr("snow_02", { repeat: [1, 1], normalScale: 1.3 });
  snowMat.color = new Color(1.12, 1.13, 1.17);
  snowMat.roughnessMap = null;
  snowMat.roughness = 0.92;
  snowMat.envMapIntensity = 1;
  snowMat.aoMapIntensity = 0.45;
  const snowU = { uSun: { value: SUN_DIR }, uSparkle: { value: 1 } };
  snowMat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, snowU);
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vWP;").replace("#include <fog_vertex>", "#include <fog_vertex>\nvWP = (modelMatrix * vec4(transformed, 1.0)).xyz;");
    sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\n    varying vec3 vWP; uniform vec3 uSun; uniform float uSparkle;\n    float h13(vec3 p){ p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }\n    float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);\n      return mix(mix(h13(vec3(i,0.)), h13(vec3(i+vec2(1,0),0.)), f.x), mix(h13(vec3(i+vec2(0,1),0.)), h13(vec3(i+vec2(1,1),0.)), f.x), f.y); }\n    float pisteU(vec3 w){ float s = -w.z; float c = 22.0*sin(s/170.0) + 9.0*sin(s/63.0+1.3) - 9.0*sin(1.3); return w.x - c * smoothstep(-20.0, 120.0, s); }").replace("#include <map_fragment>", "#include <map_fragment>\n    { vec4 t2 = texture2D(map, vMapUv * 0.231 + vec2(0.37, 0.11));            // second scale breaks up tiling\n      vec3 tx = mix(sampledDiffuseColor.rgb, t2.rgb, 0.45); float l = max(0.66, dot(tx, vec3(0.3, 0.59, 0.11)));\n      vec3 dc = diffuse * mix(vec3(0.84), vec3(l) * vec3(0.975, 0.99, 1.0), 0.4);   // clean fresh snow: keep the texture's shape, lose its dirt\n      float m = vn(vWP.xz * 0.035) * 0.6 + vn(vWP.xz * 0.11) * 0.4;           // big soft patches, like real wind-packed snow\n      diffuseColor.rgb = dc * (0.93 + 0.1 * m); }").replace("#include <normal_fragment_maps>", "#include <normal_fragment_maps>\n    { float pu = pisteU(vWP); float on = 1.0 - smoothstep(13.5, 15.5, abs(pu));\n      normal = normalize(mix(normal, nonPerturbedNormal, 0.25 + 0.5 * on));          // groomed piste is smoother than wild snow\n      float fq = 40.0; float fw = fwidth(vWP.x * fq);\n      float amp = 0.15 * on * clamp(1.0 - fw * 1.6, 0.0, 1.0);                   // groomer corduroy, fades before it can alias\n      vec3 wx = normalize((viewMatrix * vec4(1.0, 0.0, 0.0, 0.0)).xyz);\n      normal = normalize(normal + wx * cos(vWP.x * fq * 6.2831) * amp);\n      float band = smoothstep(0.35, 0.65, vn(vec2(floor(pu / 4.2), 3.0)));      // 4 m groomer passes, slightly different sheen\n      diffuseColor.rgb *= 1.0 - 0.025 * band * on; }").replace("#include <opaque_fragment>", "{\n      vec3 cell = floor(vWP * 30.0); float h = h13(cell);\n      vec3 fp = fract(vWP * 30.0) - vec3(h13(cell + 4.1), h13(cell + 7.7), h13(cell + 2.3)) * 0.6 - 0.2;\n      vec3 fn = normalize(vec3(h13(cell + 1.7), h13(cell + 3.1) * 0.8 + 0.2, h13(cell + 5.9)) * 2.0 - vec3(1.0, 0.0, 1.0));\n      vec3 V = normalize(cameraPosition - vWP); vec3 Hh = normalize(uSun + V);\n      float g = pow(max(dot(fn, Hh), 0.0), 600.0) * smoothstep(0.24, 0.05, length(fp.xz));\n      float dist = length(cameraPosition - vWP);\n      float lit = smoothstep(0.03, 0.25, dot(reflectedLight.directDiffuse, vec3(0.3, 0.6, 0.1)));\n      outgoingLight += vec3(1.0, 0.96, 0.88) * g * 70.0 * uSparkle * lit * step(0.35, h) * smoothstep(34.0, 6.0, dist); }\n    #include <opaque_fragment>");
  };
  {
    const us = [];
    for (let u = -100; u <= 100; ) {
      us.push(u);
      const a = Math.abs(u);
      u += a < 24 ? 1 : a < 52 ? 3 : 6;
    }
    const rows = Math.ceil((S1 - S0) / 2) + 1, cols = us.length;
    const pos = new Float32Array(rows * cols * 3), uv = new Float32Array(rows * cols * 2);
    for (let r = 0; r < rows; r++) {
      const s = S0 + r * 2;
      for (let c = 0; c < cols; c++) {
        const u = us[c], i = r * cols + c;
        pos[i * 3] = cx(s) + u;
        pos[i * 3 + 1] = baseH(s, u);
        pos[i * 3 + 2] = -s;
        uv[i * 2] = (cx(s) + u) / 4.2;
        uv[i * 2 + 1] = s / 4.2;
      }
    }
    const idx = [];
    for (let r = 0; r < rows - 1; r++) for (let c = 0; c < cols - 1; c++) {
      const a = r * cols + c, b = a + 1, d = a + cols, e = d + 1;
      idx.push(a, d, b, b, d, e);
    }
    const CH = 60;
    for (let r0 = 0; r0 < rows - 1; r0 += CH) {
      const r1 = Math.min(rows - 1, r0 + CH), g = new BufferGeometry();
      const n = (r1 - r0 + 1) * cols;
      g.setAttribute("position", new BufferAttribute(pos.slice(r0 * cols * 3, (r0 * cols + n) * 3), 3));
      g.setAttribute("uv", new BufferAttribute(uv.slice(r0 * cols * 2, (r0 * cols + n) * 2), 2));
      const ix = [];
      for (let r = 0; r < r1 - r0; r++) for (let c = 0; c < cols - 1; c++) {
        const a = r * cols + c, b = a + 1, d = a + cols, e = d + 1;
        ix.push(a, b, d, b, e, d);
      }
      g.setIndex(ix);
      g.computeVertexNormals();
      g.computeBoundingSphere();
      const m = new Mesh(g, snowMat);
      m.receiveShadow = true;
      m.castShadow = true;
      scene.add(m);
    }
  }
  const mountains = new Group();
  scene.add(mountains);
  {
    const NA = 260, NR = 34, pos = [], col = [], idx = [];
    const rOf = (j) => 2600 + Math.pow(j / (NR - 1), 1.3) * 5200;
    for (let j = 0; j < NR; j++) for (let i = 0; i <= NA; i++) {
      const a = i / NA * Math.PI * 2, r = rOf(j), x = Math.cos(a) * r, z = Math.sin(a) * r;
      const env = smooth(2600, 3600, r) * (1 - 0.3 * smooth(5e3, 7800, r));
      const hgt = (ridged(x / 1500, z / 1500, 6) * 820 + 110 * fbm(x / 600, z / 600, 3)) * env - 120;
      pos.push(x, hgt, z);
    }
    for (let j = 0; j < NR - 1; j++) for (let i = 0; i < NA; i++) {
      const a = j * (NA + 1) + i, b = a + 1, c = a + NA + 1, d = c + 1;
      idx.push(a, b, c, b, d, c);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    const nrm = g.attributes.normal.array;
    for (let k = 0; k < pos.length / 3; k++) {
      const ny = nrm[k * 3 + 1], y = pos[k * 3 + 1], n = vnoise(pos[k * 3] / 90, pos[k * 3 + 2] / 90);
      const snow = smooth(0.62, 0.8, ny + n * 0.12) * smooth(-60, 120, y + n * 80);
      const rock = [0.075 + 0.02 * n, 0.08 + 0.02 * n, 0.09 + 0.02 * n], wh = [0.86, 0.89, 0.95];
      col.push(lerp(rock[0], wh[0], snow), lerp(rock[1], wh[1], snow), lerp(rock[2], wh[2], snow));
    }
    g.setAttribute("color", new Float32BufferAttribute(col, 3));
    const m = new Mesh(g, new MeshStandardMaterial({ vertexColors: true, roughness: 0.92, envMapIntensity: 0.7 }));
    m.frustumCulled = false;
    mountains.add(m);
  }
  function makeFir(seed, tiers) {
    const r = rng(seed), parts = [];
    const trunk = new CylinderGeometry(0.06, 0.16, 1.4, 6);
    trunk.translate(0, 0.7, 0);
    {
      const c = [];
      for (let i = 0; i < trunk.attributes.position.count; i++) c.push(0.05, 0.035, 0.025);
      trunk.setAttribute("color", new Float32BufferAttribute(c, 3));
    }
    parts.push(trunk.toNonIndexed ? trunk.toNonIndexed() : trunk);
    for (let t = 0; t < tiers; t++) {
      const k = t / (tiers - 1), base = 0.9 + k * 7.6, top = base + 2.6 - k * 0.6, rad = lerp(2.25, 0.55, Math.pow(k, 0.9)) * (0.9 + r() * 0.2);
      const N = 15, P2 = [], C = [];
      const rim = [];
      for (let i = 0; i < N; i++) {
        const a = i / N * Math.PI * 2 + r() * 0.3, rr = rad * (i % 2 ? 0.78 + r() * 0.12 : 1 + r() * 0.12);
        rim.push([Math.cos(a) * rr, base - (i % 2 ? 0.05 : 0.32 + r() * 0.15), Math.sin(a) * rr]);
      }
      const apex = [0, top, 0], under = [0, base + 0.45, 0];
      const mid = rim.map((p) => [p[0] * 0.55, lerp(base, top, 0.42) + (r() - 0.5) * 0.15, p[2] * 0.55]);
      const SN = [0.82, 0.86, 0.93], GR = [0.022, 0.05, 0.03], GD = [0.012, 0.028, 0.018];
      for (let i = 0; i < N; i++) {
        const a = rim[i], b = rim[(i + 1) % N], ma = mid[i], mb = mid[(i + 1) % N];
        const sa = r() < 0.75 ? SN : GR, sb = sa;
        P2.push(...apex, ...mb, ...ma);
        C.push(...SN, ...sb, ...sa);
        P2.push(...ma, ...mb, ...a, ...a, ...mb, ...b);
        const ta = i % 2 ? GR : r() < 0.45 ? SN : GR, tb = (i + 1) % N % 2 ? GR : r() < 0.45 ? SN : GR;
        C.push(...sa, ...sb, ...ta, ...ta, ...sb, ...tb);
        P2.push(...a, ...b, ...under);
        C.push(...GD, ...GD, ...GD);
      }
      const g2 = new BufferGeometry();
      g2.setAttribute("position", new Float32BufferAttribute(P2, 3));
      g2.setAttribute("color", new Float32BufferAttribute(C, 3));
      parts.push(g2);
    }
    const tr = parts[0].index ? parts[0].toNonIndexed() : parts[0];
    parts[0] = tr;
    delete tr.attributes.uv;
    delete tr.attributes.normal;
    const g = mergeGeometries(parts);
    g.computeVertexNormals();
    return g;
  }
  const firMat = new MeshStandardMaterial({ vertexColors: true, roughness: 0.88, envMapIntensity: 0.9 });
  const FIRS = [makeFir(11, 7), makeFir(23, 8), makeFir(37, 6)];
  function makeFirLow(seed, tiers) {
    const r = rng(seed), P2 = [], C = [], SN = [0.82, 0.86, 0.93], GR = [0.022, 0.05, 0.03];
    for (let t = 0; t < tiers; t++) {
      const k = t / (tiers - 1), base = 0.9 + k * 7.6, top = base + 2.6 - k * 0.6, rad = lerp(2.25, 0.55, Math.pow(k, 0.9)), N = 7;
      for (let i = 0; i < N; i++) {
        const a0 = i / N * 6.283, a1 = (i + 1) / N * 6.283;
        P2.push(0, top, 0, Math.cos(a1) * rad, base - 0.2, Math.sin(a1) * rad, Math.cos(a0) * rad, base - 0.2, Math.sin(a0) * rad);
        C.push(...SN, ...r() < 0.5 ? SN : GR, ...r() < 0.5 ? SN : GR);
      }
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(P2, 3));
    g.setAttribute("color", new Float32BufferAttribute(C, 3));
    g.computeVertexNormals();
    return g;
  }
  const FIRS_LO = [makeFirLow(11, 5), makeFirLow(23, 6), makeFirLow(37, 4)];
  const TREE_CHUNKS = [];
  const TREE_POS = [];
  {
    const r = rng(99), CH = 60, M = new Matrix4(), q = new Quaternion(), sc = new Vector3(), p = new Vector3();
    for (let c0 = S0; c0 < S1; c0 += CH) {
      const buckets = FIRS.map(() => []);
      for (let s = c0; s < c0 + CH; s += 1.3) for (const sd of [-1, 1]) {
        const u0 = PISTE + 3.5 + Math.pow(r(), 1.6) * 80;
        if (r() < 0.45) continue;
        const near = u0 < PISTE + 9;
        if (near && r() < 0.5) continue;
        if (s > -40 && s < 15 && u0 < 32) continue;
        const u = sd * u0, ss = s + r() * 1.3, hS = near ? 0.55 + r() * 0.35 : 0.7 + r() * 0.7;
        world(ss, u, baseH(ss, u) - 0.25, p);
        q.setFromEuler(new Euler((r() - 0.5) * 0.05, r() * 6.28, (r() - 0.5) * 0.05));
        sc.set(hS * (0.85 + r() * 0.3), hS, hS * (0.85 + r() * 0.3));
        buckets[Math.floor(r() * FIRS.length)].push(M.compose(p, q, sc).clone());
        if (u0 < PISTE + 12) TREE_POS.push({ s: ss, u, r: hS * 2 });
      }
      const ch = { s: c0 + CH / 2, hi: [], lo: [] };
      TREE_CHUNKS.push(ch);
      buckets.forEach((list, k) => {
        if (!list.length) return;
        for (const [geo, arr] of [[FIRS[k], ch.hi], [FIRS_LO[k], ch.lo]]) {
          const im = new InstancedMesh(geo, firMat, list.length);
          list.forEach((m, i) => im.setMatrixAt(i, m));
          im.castShadow = true;
          im.receiveShadow = arr === ch.hi;
          im.computeBoundingSphere();
          scene.add(im);
          arr.push(im);
        }
      });
    }
  }
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  function canvasTex(w, h, draw) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d"), w, h);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = maxAniso;
    return t;
  }
  const fabric = (color, sheen = 0.6) => new MeshPhysicalMaterial({ color, roughness: 0.82, sheen, sheenRoughness: 0.5, sheenColor: new Color(color).lerp(new Color(1, 1, 1), 0.5) });
  function conform(g, fn) {
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const s = p.getZ(i), u = p.getX(i), y = p.getY(i);
      const v = fn(s, u, y);
      p.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    return g;
  }
  const dyeMat = new MeshStandardMaterial({ color: 2056150, roughness: 0.95, polygonOffset: true, polygonOffsetFactor: -2 });
  const orange = new MeshStandardMaterial({ color: 16734740, roughness: 0.55 });
  const poleMat = new MeshPhysicalMaterial({ color: 15921906, roughness: 0.35, clearcoat: 0.6 });
  for (const k of KICKERS) {
    const segS = 40, segU = 22, sMin = k.s - 0.5, sMax = k.s + k.KL + 2.8, uHalf = k.w / 2 + 1.6;
    const g = new PlaneGeometry(1, 1, segU, segS);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const fu = p.getX(i) + 0.5, fs = p.getY(i) + 0.5;
      p.setXYZ(i, k.u - uHalf + fu * uHalf * 2, 0, lerp(sMax, sMin, fs));
    }
    const uvA = g.attributes.uv;
    for (let i = 0; i < p.count; i++) uvA.setXY(i, (cx(p.getZ(i)) + p.getX(i)) / 4.2, p.getZ(i) / 4.2);
    conform(g, (s, u) => world(s, u, baseH(s, u) + kickerH(k, s, u) + 0.015, new Vector3()));
    const m = new Mesh(g, snowMat);
    m.castShadow = m.receiveShadow = true;
    scene.add(m);
    const lip = new PlaneGeometry(1, 1, 18, 1);
    const lp = lip.attributes.position;
    for (let i = 0; i < lp.count; i++) {
      const fu = lp.getX(i) + 0.5, fs = lp.getY(i) + 0.5;
      lp.setXYZ(i, k.u - k.w / 2 + 0.4 + fu * (k.w - 0.8), 0, k.s + k.KL - 0.55 + fs * 0.4);
    }
    conform(lip, (s, u) => world(s, u, baseH(s, u) + kickerH(k, s, u) + 0.03, new Vector3()));
    scene.add(new Mesh(lip, dyeMat));
    for (const sd of [-1, 1]) {
      const pu = k.u + sd * (k.w / 2 + 0.7), ps = k.s + k.KL - 1;
      const pole = new Mesh(new CylinderGeometry(0.035, 0.035, 2.2, 8), orange);
      pole.castShadow = true;
      world(ps, pu, baseH(ps, pu) + 1.1, pole.position);
      scene.add(pole);
    }
    k.approach = [];
    for (let a = 0; a < 3; a++) {
      const sA = k.s - 7 - a * 5;
      const ch = new PlaneGeometry(1, 1, 6, 1);
      const cp = ch.attributes.position;
      for (let i = 0; i < cp.count; i++) {
        const fu = cp.getX(i), fs = cp.getY(i) + 0.5;
        cp.setXYZ(i, k.u + fu * 2.4, 0, sA - Math.abs(fu) * 1.6 + fs * 0.35);
      }
      conform(ch, (s, u) => world(s, u, baseH(s, u) + 0.02, new Vector3()));
      scene.add(new Mesh(ch, dyeMat));
    }
  }
  const flagTex = canvasTex(256, 1024, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#ff3a2e");
    g.addColorStop(1, "#c41616");
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
    c.fillStyle = "#fff";
    c.font = "900 120px system-ui, sans-serif";
    c.textAlign = "center";
    c.save();
    c.translate(w / 2, h / 2);
    c.rotate(-Math.PI / 2);
    c.fillText("GATE", 0, 42);
    c.restore();
    c.fillStyle = "#ffffffcc";
    for (let i = 0; i < 3; i++) {
      c.beginPath();
      const y = 120 + i * 60;
      c.moveTo(60, y + 40);
      c.lineTo(128, y);
      c.lineTo(196, y + 40);
      c.lineTo(196, y + 64);
      c.lineTo(128, y + 24);
      c.lineTo(60, y + 64);
      c.fill();
    }
  });
  const flagMat = new MeshPhysicalMaterial({ map: flagTex, side: DoubleSide, roughness: 0.7, sheen: 0.5, sheenColor: new Color(1, 0.6, 0.6) });
  const redDye = new MeshStandardMaterial({ color: 14165546, roughness: 0.95, polygonOffset: true, polygonOffsetFactor: -2, transparent: true, opacity: 0.85 });
  function featherGeom() {
    const g = new PlaneGeometry(0.8, 2.6, 6, 12), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i) + 0.4, y = p.getY(i) + 1.3;
      const w = 0.8 * (1 - Math.pow(Math.max(0, (y - 1.9) / 0.7), 2) * 0.6) * (y < 0.25 ? 0.6 + y * 1.6 : 1);
      p.setXYZ(i, x / 0.8 * w, y + 0.5, Math.sin(x * 2.8) * 0.08);
    }
    g.computeVertexNormals();
    return g;
  }
  const FEATHER = featherGeom();
  for (const gte of GATES) {
    gte.group = new Group();
    scene.add(gte.group);
    gte.flags = [];
    for (const sd of [-1, 1]) {
      const f = new Group();
      const pole = new Mesh(new CylinderGeometry(0.025, 0.03, 3.4, 8), poleMat);
      pole.position.y = 1.6;
      pole.castShadow = true;
      f.add(pole);
      const fl = new Mesh(FEATHER, flagMat);
      fl.castShadow = true;
      fl.rotation.y = sd < 0 ? Math.PI : 0;
      f.add(fl);
      gte.group.add(f);
      gte.flags.push(f);
      f.userData.sd = sd;
      f.userData.fl = fl;
    }
    gte.dye = new Mesh(new BufferGeometry(), redDye);
    scene.add(gte.dye);
    layoutGate(gte);
  }
  function layoutGate(gte) {
    for (const f of gte.flags) {
      const u = gte.u + f.userData.sd * gte.w / 2;
      world(gte.s, u, baseH(gte.s, u) - 0.1, f.position);
      f.rotation.y = -Math.atan(cxd(gte.s));
    }
    const dl = new PlaneGeometry(1, 1, 16, 1), p = dl.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const fu = p.getX(i) + 0.5, fs = p.getY(i) + 0.5;
      p.setXYZ(i, gte.u - gte.w / 2 + 0.3 + fu * (gte.w - 0.6), 0, gte.s - 0.18 + fs * 0.36);
    }
    conform(dl, (s, u) => world(s, u, baseH(s, u) + 0.025, new Vector3()));
    gte.dye.geometry.dispose();
    gte.dye.geometry = dl;
  }
  const railMat = new MeshPhysicalMaterial({ color: 16761370, metalness: 0.6, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.08 });
  const steel = new MeshStandardMaterial({ color: 5593439, metalness: 0.9, roughness: 0.35 });
  for (const rl of RAILS) {
    const pts = [];
    for (let i = 0; i <= 24; i++) {
      const s = rl.s + i / 24 * rl.len;
      pts.push(world(s, rl.u, baseH(s, rl.u) + rl.h, new Vector3()));
    }
    const tube = new Mesh(new TubeGeometry(new CatmullRomCurve3(pts), 64, 0.045, 10), railMat);
    tube.castShadow = true;
    scene.add(tube);
    for (const fs of [0.12, 0.5, 0.88]) {
      const s = rl.s + fs * rl.len, b = baseH(s, rl.u);
      const post = new Mesh(new CylinderGeometry(0.04, 0.05, rl.h + 0.4, 8), steel);
      world(s, rl.u, b + (rl.h - 0.4) / 2, post.position);
      post.castShadow = true;
      scene.add(post);
      const foot = new Mesh(new BoxGeometry(0.6, 0.06, 0.25), steel);
      world(s, rl.u, b + 0, foot.position);
      foot.rotation.y = -Math.atan(cxd(s));
      scene.add(foot);
    }
    for (const fs of [0, 1]) {
      const s = rl.s + fs * rl.len;
      const cap = new Mesh(new SphereGeometry(0.06, 12, 8), orange);
      world(s, rl.u, baseH(s, rl.u) + rl.h, cap.position);
      scene.add(cap);
    }
    for (const sd of [-1, 1]) {
      const g = new PlaneGeometry(1, 1, 1, 10), p = g.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const fu = p.getX(i) + 0.5, fs = p.getY(i) + 0.5;
        p.setXYZ(i, rl.u + sd * 1.3 + fu * 0.18, 0, rl.s - 14 + fs * 13);
      }
      conform(g, (s, u) => world(s, u, baseH(s, u) + 0.02, new Vector3()));
      scene.add(new Mesh(g, dyeMat));
    }
  }
  {
    const markG = new CylinderGeometry(0.03, 0.03, 1.8, 6);
    markG.translate(0, 0.9, 0);
    const capG = new CylinderGeometry(0.032, 0.032, 0.5, 6);
    capG.translate(0, 1.55, 0);
    const n = Math.floor(L / 24) * 2, a = new InstancedMesh(markG, orange, n), b = new InstancedMesh(capG, new MeshStandardMaterial({ color: 1118481, roughness: 0.5 }), n);
    const M = new Matrix4(), p = new Vector3();
    let k = 0;
    for (let s = 12; s < L && k < n; s += 24) for (const sd of [-1, 1]) {
      const u = sd * (PISTE + 0.6);
      world(s, u, baseH(s, u) - 0.05, p);
      M.makeTranslation(p.x, p.y, p.z);
      a.setMatrixAt(k, M);
      b.setMatrixAt(k, M);
      k++;
    }
    a.count = b.count = k;
    a.castShadow = true;
    scene.add(a, b);
  }
  const netTex = canvasTex(256, 128, (c, w, h) => {
    c.clearRect(0, 0, w, h);
    c.strokeStyle = "#ff5a14";
    c.lineWidth = 5;
    for (let x = -h; x < w + h; x += 22) {
      c.beginPath();
      c.moveTo(x, 0);
      c.lineTo(x + h, h);
      c.stroke();
      c.beginPath();
      c.moveTo(x + h, 0);
      c.lineTo(x, h);
      c.stroke();
    }
    c.fillStyle = "#ff5a14";
    c.fillRect(0, 0, w, 10);
  });
  netTex.wrapS = RepeatWrapping;
  const netMat = new MeshStandardMaterial({ map: netTex, alphaTest: 0.4, side: DoubleSide, roughness: 0.8 });
  function net(s0, s1, u) {
    const g = new PlaneGeometry(1, 1, Math.ceil((s1 - s0) / 2), 1), p = g.attributes.position, uv = g.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      const fs = p.getX(i) + 0.5, fy = p.getY(i) + 0.5, s = lerp(s0, s1, fs);
      world(s, u, baseH(s, u) + fy * 1.4, _v);
      p.setXYZ(i, _v.x, _v.y, _v.z);
      uv.setXY(i, (s - s0) / 3, fy);
    }
    netTex.repeat.set(1, 1);
    g.computeVertexNormals();
    const m = new Mesh(g, netMat);
    m.castShadow = true;
    scene.add(m);
  }
  const _v = new Vector3();
  net(-30, 60, -PISTE - 1.2);
  net(-30, 60, PISTE + 1.2);
  net(L - 140, L + 120, -PISTE - 1.2);
  net(L - 140, L + 120, PISTE + 1.2);
  function arch(s, text2, colA, colB) {
    const t = canvasTex(2048, 256, (c, w, h) => {
      const g = c.createLinearGradient(0, 0, w, 0);
      g.addColorStop(0, colA);
      g.addColorStop(1, colB);
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);
      c.fillStyle = "#fff";
      c.font = "900 170px system-ui, sans-serif";
      c.textAlign = "center";
      c.fillText(text2, w / 2, 190);
      for (let i = 0; i < 16; i++) for (let j = 0; j < 2; j++) {
        c.fillStyle = (i + j) % 2 ? "#111" : "#fff";
        c.fillRect(i * 20, j * 128, 20, 128);
        c.fillRect(w - 320 + i * 20, j * 128, 20, 128);
      }
    });
    const grp = new Group(), y0 = baseH(s, 0);
    const banner = new Mesh(new BoxGeometry(34, 2.6, 0.5), [fabric(2236962), fabric(2236962), fabric(2236962), fabric(2236962), new MeshPhysicalMaterial({ map: t, roughness: 0.6, sheen: 0.4 }), new MeshPhysicalMaterial({ map: t, roughness: 0.6, sheen: 0.4 })]);
    banner.position.y = 7.2;
    banner.castShadow = true;
    grp.add(banner);
    for (const sd of [-1, 1]) {
      const leg = new Mesh(new CylinderGeometry(0.75, 0.9, 8.6, 20), new MeshPhysicalMaterial({ color: colA, roughness: 0.45, clearcoat: 0.5, sheen: 0.3 }));
      leg.position.set(sd * 16.6, 4.1, 0);
      leg.castShadow = true;
      grp.add(leg);
    }
    world(s, 0, y0 - 0.2, grp.position);
    grp.rotation.y = -Math.atan(cxd(s));
    scene.add(grp);
    return grp;
  }
  arch(-4, "SUMMIT SEND  ·  START", "#1d6fe0", "#0fb7ff");
  arch(L, "FINISH", "#e0261d", "#ff8a14");
  function makeRider() {
    const root = new Group(), tilt = new Group(), body = new Group();
    root.rotation.order = "YXZ";
    tilt.rotation.order = "YXZ";
    root.add(tilt);
    tilt.add(body);
    scene.add(root);
    const jacket = fabric(16738842, 0.7), jacket2 = fabric(1778224, 0.5), pants = fabric(2047066, 0.6), glove = fabric(1382172, 0.3);
    const helmetM = new MeshPhysicalMaterial({ color: 16053490, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.05 });
    const goggleM = new MeshPhysicalMaterial({ color: 3153936, metalness: 1, roughness: 0.06, iridescence: 1, iridescenceIOR: 1.6, iridescenceThicknessRange: [200, 700] });
    const strapM = fabric(1118481, 0.2), bootM = new MeshPhysicalMaterial({ color: 2303531, roughness: 0.55, sheen: 0.2 });
    const mk = (geo, mat) => {
      const m = new Mesh(geo, mat);
      m.castShadow = true;
      m.receiveShadow = true;
      body.add(m);
      return m;
    };
    const limb = (r0, r1, mat) => {
      const g = new CylinderGeometry(r1, r0, 1, 14, 1);
      return mk(g, mat);
    };
    const top = canvasTex(1024, 256, (c, w, h) => {
      const g = c.createLinearGradient(0, 0, w, 0);
      g.addColorStop(0, "#0b1d3a");
      g.addColorStop(0.5, "#123f7a");
      g.addColorStop(1, "#0b1d3a");
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);
      c.fillStyle = "#ff6a1a";
      c.beginPath();
      c.moveTo(0, h * 0.62);
      c.bezierCurveTo(w * 0.3, h * 0.2, w * 0.6, h * 0.95, w, h * 0.35);
      c.lineTo(w, h * 0.5);
      c.bezierCurveTo(w * 0.6, h * 1.1, w * 0.3, h * 0.35, 0, h * 0.78);
      c.fill();
      c.fillStyle = "#ffffffdd";
      c.font = "900 64px system-ui";
      c.textAlign = "center";
      c.fillText("SUMMIT", w * 0.5, h * 0.42);
    });
    const shape = new Shape(), BL = 0.78, BW = 0.145;
    shape.moveTo(-BW, -BL + 0.12);
    shape.lineTo(-BW, BL - 0.12);
    shape.quadraticCurveTo(-BW, BL, 0, BL);
    shape.quadraticCurveTo(BW, BL, BW, BL - 0.12);
    shape.lineTo(BW, -BL + 0.12);
    shape.quadraticCurveTo(BW, -BL, 0, -BL);
    shape.quadraticCurveTo(-BW, -BL, -BW, -BL + 0.12);
    const bg = new ExtrudeGeometry(shape, { depth: 0.018, bevelEnabled: true, bevelThickness: 4e-3, bevelSize: 6e-3, bevelSegments: 2, curveSegments: 10 });
    bg.rotateX(Math.PI / 2);
    bg.translate(0, 0.03, 0);
    {
      const p = bg.attributes.position, uv = bg.attributes.uv;
      for (let i = 0; i < p.count; i++) {
        const z = p.getZ(i);
        p.setY(i, p.getY(i) + 1.9 * Math.pow(Math.max(0, Math.abs(z) - 0.6), 2));
        uv.setXY(i, (z + BL) / (2 * BL), (p.getX(i) + BW) / (2 * BW));
      }
      bg.computeVertexNormals();
    }
    const boardM = [new MeshPhysicalMaterial({ map: top, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.04 }), new MeshPhysicalMaterial({ color: 789518, roughness: 0.3, clearcoat: 0.6 })];
    const board = mk(bg, boardM);
    const bindings = [];
    for (const z of [-0.25, 0.25]) {
      const b = mk(new RoundedBoxGeometry(0.26, 0.09, 0.15, 3, 0.03), bootM);
      b.position.set(0, 0.09, z);
      bindings.push(b);
      const st = mk(new BoxGeometry(0.27, 0.035, 0.06), strapM);
      st.position.set(0, 0.15, z);
    }
    const P2 = {
      pelvis: mk(new SphereGeometry(0.15, 18, 12), pants),
      torso: mk(new CapsuleGeometry(0.165, 0.3, 8, 18), jacket),
      hood: mk(new SphereGeometry(0.12, 14, 10), jacket),
      thighL: limb(0.098, 0.085, pants),
      thighR: limb(0.098, 0.085, pants),
      shinL: limb(0.085, 0.075, pants),
      shinR: limb(0.085, 0.075, pants),
      kneeL: mk(new SphereGeometry(0.086, 12, 8), pants),
      kneeR: mk(new SphereGeometry(0.086, 12, 8), pants),
      uarmL: limb(0.072, 0.064, jacket),
      uarmR: limb(0.072, 0.064, jacket),
      farmL: limb(0.062, 0.052, jacket),
      farmR: limb(0.062, 0.052, jacket),
      elbL: mk(new SphereGeometry(0.064, 12, 8), jacket),
      elbR: mk(new SphereGeometry(0.064, 12, 8), jacket),
      shL: mk(new SphereGeometry(0.08, 12, 8), jacket),
      shR: mk(new SphereGeometry(0.08, 12, 8), jacket),
      handL: mk(new SphereGeometry(0.058, 12, 8), glove),
      handR: mk(new SphereGeometry(0.058, 12, 8), glove),
      cuffL: limb(0.064, 0.064, jacket2),
      cuffR: limb(0.064, 0.064, jacket2)
    };
    P2.torso.geometry.scale(1.05, 1, 0.82);
    const bibT = canvasTex(256, 256, (c, w, h) => {
      c.fillStyle = "#f4f4f0";
      c.fillRect(0, 0, w, h);
      c.fillStyle = "#1d6fe0";
      c.fillRect(0, 0, w, 46);
      c.fillStyle = "#111";
      c.font = "900 150px system-ui";
      c.textAlign = "center";
      c.fillText("7", w / 2, 200);
      c.fillStyle = "#fff";
      c.font = "800 30px system-ui";
      c.fillText("SUMMIT SEND", w / 2, 34);
    });
    const bib = new Mesh(new CylinderGeometry(0.182, 0.182, 0.34, 18, 1, true, -0.85, 1.7), new MeshPhysicalMaterial({ map: bibT, roughness: 0.75, sheen: 0.4, side: DoubleSide }));
    bib.castShadow = true;
    const torsoFrame = new Group();
    body.add(torsoFrame);
    torsoFrame.add(bib);
    bib.scale.set(1.07, 1, 0.86);
    const headG = new Group();
    body.add(headG);
    const helmet = new Mesh(new SphereGeometry(0.145, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.62), helmetM);
    helmet.castShadow = true;
    headG.add(helmet);
    helmet.position.y = 0.01;
    const face = new Mesh(new SphereGeometry(0.118, 18, 12), fabric(1382172, 0.3));
    face.position.y = -0.03;
    headG.add(face);
    const gog = new Mesh(new CylinderGeometry(0.146, 0.146, 0.07, 24, 1, true, -1.15, 2.3), goggleM);
    gog.position.set(0, -5e-3, 0);
    gog.rotation.y = Math.PI;
    headG.add(gog);
    const strap = new Mesh(new CylinderGeometry(0.147, 0.147, 0.045, 24, 1, true, 1.15, Math.PI * 2 - 2.3), strapM);
    strap.rotation.y = Math.PI;
    headG.add(strap);
    const V = () => new Vector3();
    const T = { pel: V(), chest: V(), hipF: V(), hipB: V(), footF: V(), footB: V(), kneeF: V(), kneeB: V(), shL: V(), shR: V(), elbL: V(), elbR: V(), hL: V(), hR: V(), a: V(), b: V(), c: V(), up: V(), f: V(), rt: V(), neck: V() };
    const UP2 = new Vector3(0, 1, 0), M = new Matrix4();
    function bone(m, a, b) {
      T.a.subVectors(b, a);
      const len = T.a.length() || 1e-4;
      m.position.addVectors(a, b).multiplyScalar(0.5);
      m.quaternion.setFromUnitVectors(UP2, T.a.multiplyScalar(1 / len));
      m.scale.set(1, len, 1);
    }
    function ik(root2, target, l1, l2, pole, mid, end) {
      T.a.subVectors(target, root2);
      let d = T.a.length();
      const dir = T.a.normalize();
      d = clamp(d, 0.05, l1 + l2 - 2e-3);
      const x = (l1 * l1 - l2 * l2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, l1 * l1 - x * x));
      T.b.copy(pole).addScaledVector(dir, -pole.dot(dir)).normalize();
      mid.copy(root2).addScaledVector(dir, x).addScaledVector(T.b, h);
      end.copy(root2).addScaledVector(dir, d);
    }
    function pose(o) {
      const c = o.crouch, lift = o.boardLift || 0;
      board.position.y = lift * 0.32;
      bindings.forEach((b) => b.position.y = 0.09 + lift * 0.32);
      T.footF.set(0, 0.13 + lift * 0.32, -0.25);
      T.footB.set(0, 0.13 + lift * 0.32, 0.25);
      const py = lerp(0.98, 0.64, c) - lift * 0.05;
      T.pel.set(0.05 + 0.1 * c + o.lean * 0.08, py, -0.02);
      T.hipF.set(T.pel.x, py, T.pel.z - 0.11);
      T.hipB.set(T.pel.x, py, T.pel.z + 0.11);
      T.c.set(1, 0, 0);
      ik(T.hipF, T.footF, 0.45, 0.45, T.c, T.kneeF, T.footF);
      ik(T.hipB, T.footB, 0.45, 0.45, T.c.set(1, 0, 0.15), T.kneeB, T.footB);
      bone(P2.thighL, T.hipF, T.kneeF);
      bone(P2.shinL, T.kneeF, T.footF);
      P2.kneeL.position.copy(T.kneeF);
      bone(P2.thighR, T.hipB, T.kneeB);
      bone(P2.shinR, T.kneeB, T.footB);
      P2.kneeR.position.copy(T.kneeB);
      P2.pelvis.position.copy(T.pel);
      P2.pelvis.scale.set(1, 0.85, 1.35);
      T.up.set(0.28 * c + 0.06 + o.lean * 0.35, 1, 0).normalize();
      T.chest.copy(T.pel).addScaledVector(T.up, 0.5);
      T.f.set(Math.cos(0.75), 0, -Math.sin(0.75));
      T.f.addScaledVector(T.up, -T.f.dot(T.up)).normalize();
      T.rt.crossVectors(T.f, T.up).normalize();
      M.makeBasis(T.rt, T.up, T.a.copy(T.f).negate());
      P2.torso.quaternion.setFromRotationMatrix(M);
      P2.torso.position.copy(T.pel).addScaledVector(T.up, 0.25);
      P2.torso.scale.set(1, 1, 1);
      torsoFrame.position.copy(P2.torso.position);
      torsoFrame.quaternion.copy(P2.torso.quaternion);
      torsoFrame.translateY(0.02);
      T.neck.copy(T.chest).addScaledVector(T.up, 0.06);
      P2.hood.position.copy(T.neck).addScaledVector(T.f, -0.09);
      P2.hood.scale.set(1.1, 0.7, 1.1);
      headG.position.copy(T.neck).addScaledVector(T.up, 0.17);
      headG.rotation.set(0.15 + 0.2 * c, Math.PI + 0.15, 0.25 * o.lean);
      T.shL.copy(T.chest).addScaledVector(T.rt, -0.21).addScaledVector(T.up, -0.03);
      T.shR.copy(T.chest).addScaledVector(T.rt, 0.21).addScaledVector(T.up, -0.03);
      P2.shL.position.copy(T.shL);
      P2.shR.position.copy(T.shR);
      const handTarget = (h, sh, side, out) => {
        if (o.grab === "indy") return out.set(0.16, board.position.y + 0.12, side < 0 ? -0.05 : 0.05);
        if (o.grab === "method") return out.set(-0.18, board.position.y + 0.13 + (side < 0 ? 0.05 : 0.6), side < 0 ? 0.2 : -0.4);
        out.set(sh.x + (h.x - 0.5) * 1.5 + side * 0.15, T.chest.y + (0.55 - h.y) * 1.5, sh.z + side * 0.1 - 0.05);
        return out;
      };
      handTarget(o.armL, T.shL, -1, T.hL);
      handTarget(o.armR, T.shR, 1, T.hR);
      ik(T.shL, T.hL, 0.3, 0.29, T.c.set(-0.3, -1, 0.5), T.elbL, T.hL);
      ik(T.shR, T.hR, 0.3, 0.29, T.c.set(0.3, -1, 0.5), T.elbR, T.hR);
      bone(P2.uarmL, T.shL, T.elbL);
      bone(P2.farmL, T.elbL, T.hL);
      bone(P2.uarmR, T.shR, T.elbR);
      bone(P2.farmR, T.elbR, T.hR);
      P2.elbL.position.copy(T.elbL);
      P2.elbR.position.copy(T.elbR);
      P2.handL.position.copy(T.hL);
      P2.handR.position.copy(T.hR);
      T.a.lerpVectors(T.elbL, T.hL, 0.82);
      bone(P2.cuffL, T.a, T.hL);
      P2.cuffL.scale.y = Math.min(P2.cuffL.scale.y, 0.06);
      T.a.lerpVectors(T.elbR, T.hR, 0.82);
      bone(P2.cuffR, T.a, T.hR);
      P2.cuffR.scale.y = Math.min(P2.cuffR.scale.y, 0.06);
    }
    return { root, tilt, body, pose, board, bindings };
  }
  const rider = makeRider();
  function readStance(I, J) {
    if (!I || !I.lShoulder || !I.rShoulder || !I.lHip || !I.rHip) return { side: 0, sideways: 0, raw: 0 };
    const mx = (I.lShoulder[0] + I.rShoulder[0]) / 2, my = (I.lShoulder[1] + I.rShoulder[1]) / 2;
    const T = Math.max(0.03, Math.hypot(mx - (I.lHip[0] + I.rHip[0]) / 2, my - (I.lHip[1] + I.rHip[1]) / 2));
    const sw = Math.hypot(I.lShoulder[0] - I.rShoulder[0], I.lShoulder[1] - I.rShoulder[1]) / T;
    const c1 = (v) => Math.max(-1, Math.min(1, v));
    const turnOf = (a, b) => {
      const dx = a[0] - b[0], dz = a[2] - b[2], L2 = Math.hypot(dx, dz);
      return L2 > 0.05 ? dz / L2 : 0;
    };
    let score = 0, w = 0, turn = 0;
    if (J && J.lHip && J.rHip) {
      const h = turnOf(J.lHip, J.rHip);
      turn = Math.max(turn, Math.abs(h));
      score += c1(h / 0.5) * 1.2;
      w += 1.2;
    }
    if (J && J.lShoulder && J.rShoulder) {
      const s2 = turnOf(J.lShoulder, J.rShoulder);
      turn = Math.max(turn, Math.abs(s2) * 0.8);
      score += c1(s2 / 0.5) * 0.6;
      w += 0.6;
    }
    if (J && J.lFoot && J.rFoot) {
      score += c1((J.lFoot[2] - J.rFoot[2]) / 0.3) * 0.6;
      w += 0.6;
    }
    if (I.head) {
      const ax = I.lShoulder[0] - I.rShoulder[0], ay = I.lShoulder[1] - I.rShoulder[1], al = Math.hypot(ax, ay);
      if (al > 0.15 * T) {
        const n = ((I.head[0] - mx) * ax + (I.head[1] - my) * ay) / al / T;
        score += c1(-n / 0.25) * 0.5;
        w += 0.5;
      }
    }
    const s = w ? score / w : 0;
    const sideways = Math.max(Math.max(0, Math.min(1, (0.7 - sw) / 0.4)), Math.max(0, Math.min(1, (turn - 0.35) / 0.3)));
    return { side: sideways > 0.35 && Math.abs(s) > 0.35 ? Math.sign(s) : 0, sideways, raw: s };
  }
  const STANCE = { base: 1, manual: false, ride: 1, ev: 0, at: 0, lock: 0, lockOff: 0, lockSq: 0 };
  try {
    const v = localStorage.ss_stance;
    if (v === "goofy" || v === "regular") {
      STANCE.base = v === "goofy" ? -1 : 1;
      STANCE.manual = localStorage.ss_stance_manual === "1";
      if (STANCE.manual) STANCE.lock = -STANCE.base;
    }
  } catch (_) {
  }
  STANCE.ride = STANCE.base;
  window.__stance = STANCE;
  const stanceName = (s) => s < 0 ? "GOOFY" : "REGULAR";
  function saveStance() {
    try {
      localStorage.ss_stance = STANCE.base < 0 ? "goofy" : "regular";
      localStorage.ss_stance_manual = STANCE.manual ? "1" : "";
    } catch (_) {
    }
  }
  function switchStance() {
    STANCE.base = -STANCE.base;
    STANCE.ride = STANCE.base;
    STANCE.manual = true;
    STANCE.lock = -STANCE.base;
    STANCE.lockOff = STANCE.lockSq = 0;
    STANCE.ev = 0;
    saveStance();
  }
  window.__switchStance = switchStance;
  function stanceTick(now) {
    if (!BP.live || BP.mouse || BP.simulating || !BP.img || BP.imgAt === STANCE.at || performance.now() - (BP.imgAt || 0) > 700) return;
    const dt = STANCE.at ? Math.min(0.3, (BP.imgAt - STANCE.at) / 1e3) : 0.03;
    STANCE.at = BP.imgAt;
    const r = readStance(BP.img, BP.joints);
    let side = r.side;
    if (STANCE.lock) {
      if (side === STANCE.lock) {
        STANCE.lockOff = STANCE.lockSq = 0;
        side = 0;
      } else if (side ? (STANCE.lockOff += dt) > 1 : (STANCE.lockSq += dt) > 2) STANCE.lock = 0;
    }
    const setup2 = G.state === "title" || G.state === "end", riding = G.state === "play" || G.state === "countdown";
    if (setup2 && !STANCE.manual && STANCE.base !== STANCE.ride) {
      STANCE.base = STANCE.ride;
      saveStance();
    }
    if (setup2 || riding) {
      if (side === -STANCE.ride) STANCE.ev += dt;
      else STANCE.ev = Math.max(0, STANCE.ev - dt * (side ? 3 : 0.5));
      const busy = riding && (P.air || P.rail || P.crashT > 0);
      if (STANCE.ev >= 1 && !busy) {
        STANCE.ev = 0;
        STANCE.ride = side;
        if (riding && Math.round(P.spin / 180) % 2) P.spin -= Math.sign(P.spin) * 180;
        if (setup2) {
          STANCE.base = side;
          STANCE.manual = false;
          saveStance();
        } else if (G.state === "play") callout(side === STANCE.base ? "BACK TO " + stanceName(side) : "RIDING SWITCH", stanceName(side) + " stance", "#9fe8ff", 0.8);
      }
    }
    G.stance = { side: r.side, raw: +(r.raw || 0).toFixed(2), sideways: +r.sideways.toFixed(2), ev: +STANCE.ev.toFixed(2), lock: STANCE.lock, base: stanceName(STANCE.base), ride: stanceName(STANCE.ride) };
  }
  const riderCam = new Vector3();
  const FLAT_FIG = new URLSearchParams(location.search).get("body") === "fig";
  const RIDER_OPTS = { scene: rider.tilt, camera: { position: riderCam }, BP, x: 0, z: 0, y: 0.12, tier: RR.quality ? RR.quality.tier : 1, gloves: false, levelFeet: false, stepRange: 0, guardDepth: 0.04, shadow: false, alpha: 0.55 };
  const riderFig = FLAT_FIG ? create(Object.assign({}, RIDER_OPTS, { outfit: { shorts: "rgba(31,60,90,0.9)", band: "#ff6a1a", seam: "rgba(10,20,40,0.7)" } })) : create2(Object.assign({}, RIDER_OPTS, { shadow: true, look: "clothed", outfit: "snowboarder", grip: { l: "relaxed", r: "relaxed" }, board: { stance: () => STANCE.ride, feet: [-0.25, 0.25], lift: () => rider.board.position.y }, onFallback: (w) => console.warn("real rider off:", w) }));
  riderFig.plane.material.side = DoubleSide;
  const sbGhost = FLAT_FIG ? null : create3(Object.assign({ scene: rider.tilt, BP, you: riderFig, outfit: "snowboarder", floorY: 0.12, tier: RR.quality ? RR.quality.tier : 1 }, STANCES.snowboard));
  let sbGhostYaw = -90;
  window.__riderFig = riderFig;
  const puffTex = canvasTex(64, 64, (c, w, h) => {
    const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.4, "rgba(255,255,255,0.55)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
  });
  puffTex.colorSpace = NoColorSpace;
  function pointsSystem(N, color, additive) {
    const g = new BufferGeometry();
    const pos = new Float32Array(N * 3), size = new Float32Array(N), alpha = new Float32Array(N);
    g.setAttribute("position", new BufferAttribute(pos, 3));
    g.setAttribute("size", new BufferAttribute(size, 1));
    g.setAttribute("alpha", new BufferAttribute(alpha, 1));
    const mat = new ShaderMaterial({
      uniforms: { map: { value: puffTex }, uScale: { value: 500 }, uColor: { value: new Color(...color) } },
      vertexShader: "attribute float size; attribute float alpha; uniform float uScale; varying float vA;\n      void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = max(1.5, size * uScale / -mv.z); vA = alpha * clamp(gl_PointSize / 1.5, 0.0, 1.0); }",
      fragmentShader: "uniform sampler2D map; uniform vec3 uColor; varying float vA; void main(){ float a = texture2D(map, gl_PointCoord).a * vA; if (a < 0.01) discard; gl_FragColor = vec4(uColor * (".concat(additive ? "a" : "1.0", "), ").concat(additive ? "1.0" : "a", "); }"),
      transparent: true,
      depthWrite: false,
      blending: additive ? AdditiveBlending : NormalBlending
    });
    const pts = new Points(g, mat);
    pts.frustumCulled = false;
    scene.add(pts);
    const P2 = [];
    for (let i = 0; i < N; i++) P2.push({ life: 0, max: 1, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, s0: 0.1, s1: 0.5 });
    let head = 0;
    return {
      mat,
      emit(x, y, z, vx, vy, vz, life, s0, s1) {
        const p = P2[head];
        head = (head + 1) % N;
        Object.assign(p, { life, max: life, x, y, z, vx, vy, vz, s0, s1 });
      },
      update(dt, grav, drag) {
        for (let i = 0; i < N; i++) {
          const p = P2[i];
          if (p.life <= 0) {
            alpha[i] = 0;
            continue;
          }
          p.life -= dt;
          const k = Math.exp(-drag * dt);
          p.vx *= k;
          p.vz *= k;
          p.vy = p.vy * k - grav * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.z += p.vz * dt;
          const t = 1 - p.life / p.max;
          pos[i * 3] = p.x;
          pos[i * 3 + 1] = p.y;
          pos[i * 3 + 2] = p.z;
          size[i] = lerp(p.s0, p.s1, Math.sqrt(t));
          alpha[i] = Math.min(1, (1 - t) * 1.6) * Math.min(1, t * 8 + 0.2);
        }
        g.attributes.position.needsUpdate = g.attributes.size.needsUpdate = g.attributes.alpha.needsUpdate = true;
      }
    };
  }
  const spray = pointsSystem(4e3, [1.9, 1.95, 2.05], false);
  const dust = (() => {
    const N = 520, g = new BufferGeometry(), pos = new Float32Array(N * 3), size = new Float32Array(N), alpha = new Float32Array(N), seed = [];
    for (let i = 0; i < N; i++) {
      seed.push([Math.random() * 40 - 20, Math.random() * 14 - 4, Math.random() * 40 - 30, Math.random() * 6.28, 0.3 + Math.random()]);
      size[i] = 0.035;
    }
    g.setAttribute("position", new BufferAttribute(pos, 3));
    g.setAttribute("size", new BufferAttribute(size, 1));
    g.setAttribute("alpha", new BufferAttribute(alpha, 1));
    const sys = pointsSystem(1, [1, 1, 1], true);
    sys.mat.uniforms.uColor.value.setRGB(6, 5.8, 5.2);
    const pts = new Points(g, sys.mat);
    pts.frustumCulled = false;
    scene.add(pts);
    return { update(t, cam2) {
      for (let i = 0; i < N; i++) {
        const s = seed[i];
        const wrap = (v, r) => (v % r + r) % r - r / 2;
        pos[i * 3] = cam2.x + wrap(s[0] + Math.sin(t * 0.3 + s[3]) * 2 - cam2.x, 40);
        pos[i * 3 + 1] = cam2.y + wrap(s[1] - t * 0.25 * s[4] - cam2.y, 16);
        pos[i * 3 + 2] = cam2.z + wrap(s[2] - cam2.z, 40);
        alpha[i] = Math.pow(Math.max(0, Math.sin(t * 3.1 * s[4] + s[3] * 7)), 18);
      }
      g.attributes.position.needsUpdate = g.attributes.alpha.needsUpdate = true;
    } };
  })();
  let G_track = null;
  const track = (() => {
    const N = 420, pos = new Float32Array(N * 6 * 3), col = new Float32Array(N * 6 * 3).fill(1), g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(pos, 3));
    g.setAttribute("normal", new BufferAttribute(new Float32Array(N * 18).map((v, i) => i % 3 === 1 ? 1 : 0), 3));
    const mat = new MeshStandardMaterial({ color: 9413314, roughness: 1, transparent: true, opacity: 0.22, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3 });
    const m = new Mesh(g, mat);
    m.frustumCulled = false;
    scene.add(m);
    G_track = m;
    let head = 0, last2 = null;
    const shade = [0.93, 0.95, 0.98];
    return {
      add(L1, R1, on) {
        if (!on) {
          last2 = null;
          return;
        }
        if (!last2) {
          last2 = [L1.clone(), R1.clone()];
          return;
        }
        {
          const o = head * 18, put = (k, v) => {
            pos[o + k * 3] = v.x;
            pos[o + k * 3 + 1] = v.y;
            pos[o + k * 3 + 2] = v.z;
          };
          put(0, last2[0]);
          put(1, last2[1]);
          put(2, L1);
          put(3, L1);
          put(4, last2[1]);
          put(5, R1);
          head = (head + 1) % N;
        }
        last2[0].copy(L1);
        last2[1].copy(R1);
        g.attributes.position.needsUpdate = true;
      },
      reset() {
        pos.fill(0);
        last2 = null;
        g.attributes.position.needsUpdate = true;
      }
    };
  })();
  const blurPass = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, amount: { value: 0 }, center: { value: new Vector2(0.5, 0.45) } },
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader: "uniform sampler2D tDiffuse; uniform float amount; uniform vec2 center; varying vec2 vUv;\n    void main(){ vec2 d = vUv - center; float k = amount * smoothstep(0.25, 0.85, length(d)); vec4 c = vec4(0.0);\n      for (int i = 0; i < 9; i++) c += texture2D(tDiffuse, vUv - d * k * float(i) / 8.0); gl_FragColor = c / 9.0; }"
  });
  let blurOwner = null;
  function ensureBlur() {
    const c = state().composer;
    if (blurOwner === c) return;
    blurOwner = c;
    const i = c.passes.findIndex((p) => p instanceof OutputPass);
    c.insertPass(blurPass, i < 0 ? c.passes.length : i);
  }
  const A = { ctx: null };
  function audioInit() {
    if (A.ctx || MUTE) return;
    try {
      const ctx2 = A.ctx = new (window.AudioContext || window.webkitAudioContext)();
      const comp = ctx2.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 4;
      comp.connect(ctx2.destination);
      A.out = ctx2.createGain();
      A.out.gain.value = 0.9;
      A.out.connect(comp);
      const nb = ctx2.createBuffer(1, ctx2.sampleRate * 2, ctx2.sampleRate), d = nb.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      A.noise = nb;
      const loopNoise = (type, f, q, gain) => {
        const src = ctx2.createBufferSource();
        src.buffer = nb;
        src.loop = true;
        const fl = ctx2.createBiquadFilter();
        fl.type = type;
        fl.frequency.value = f;
        fl.Q.value = q;
        const g = ctx2.createGain();
        g.gain.value = 0;
        src.connect(fl);
        fl.connect(g);
        g.connect(A.out);
        src.start();
        return { fl, g, gain };
      };
      A.wind = loopNoise("lowpass", 500, 0.7);
      A.carve = loopNoise("bandpass", 1900, 0.9);
      A.grind = loopNoise("bandpass", 3600, 7);
      A.ring = ctx2.createOscillator();
      A.ring.type = "triangle";
      A.ring.frequency.value = 1320;
      A.ringG = ctx2.createGain();
      A.ringG.gain.value = 0;
      A.ring.connect(A.ringG);
      A.ringG.connect(A.out);
      A.ring.start();
      A.music = ctx2.createGain();
      A.music.gain.value = 0;
      A.music.connect(A.out);
      A.next = 0;
      A.step = 0;
    } catch (e) {
      A.ctx = null;
    }
  }
  function tone(f, dur = 0.15, type = "sine", vol = 0.2, f2, when = 0) {
    if (!A.ctx) return;
    const t = A.ctx.currentTime + when, o = A.ctx.createOscillator(), g = A.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(1e-4, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
    o.connect(g);
    g.connect(A.out);
    o.start(t);
    o.stop(t + dur + 0.05);
  }
  function noiseHit(dur, f, q, vol, type = "bandpass", f2, when = 0, dest) {
    if (!A.ctx) return;
    const t = A.ctx.currentTime + when, s = A.ctx.createBufferSource();
    s.buffer = A.noise;
    const fl = A.ctx.createBiquadFilter();
    fl.type = type;
    fl.frequency.setValueAtTime(f, t);
    if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur);
    fl.Q.value = q;
    const g = A.ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
    s.connect(fl);
    fl.connect(g);
    g.connect(dest || A.out);
    s.start(t, Math.random());
    s.stop(t + dur + 0.05);
  }
  const SFX = {
    gate: () => {
      tone(988, 0.12, "triangle", 0.18);
      tone(1319, 0.2, "triangle", 0.16, null, 0.07);
    },
    launch: () => noiseHit(0.55, 500, 1.2, 0.35, "bandpass", 2400),
    pop: () => {
      tone(220, 0.12, "square", 0.12, 440);
      noiseHit(0.2, 1800, 1, 0.2);
    },
    land: (big) => {
      tone(110, 0.25, "sine", big ? 0.5 : 0.3, 40);
      noiseHit(0.35, 900, 0.6, big ? 0.5 : 0.25, "lowpass", 200);
    },
    trick: (n) => {
      const base = [523, 659, 784, 1047, 1319];
      for (let i = 0; i < Math.min(5, 2 + n); i++) tone(base[i], 0.22, "triangle", 0.14, null, i * 0.06);
    },
    wipe: () => {
      noiseHit(0.9, 600, 0.5, 0.6, "lowpass", 120);
      tone(160, 0.5, "sawtooth", 0.12, 50);
    },
    beep: (hi) => tone(hi ? 1175 : 587, hi ? 0.5 : 0.18, "square", 0.12),
    click: () => tone(700, 0.06, "triangle", 0.12),
    crowd: () => {
      tone(784, 0.3, "triangle", 0.15);
      tone(1047, 0.5, "triangle", 0.15, null, 0.15);
    },
    miss: () => tone(196, 0.18, "sine", 0.08)
  };
  function musicTick() {
    if (!A.ctx) return;
    const ctx2 = A.ctx, spb = 60 / 126 / 2;
    if (A.next < ctx2.currentTime) A.next = ctx2.currentTime + 0.05;
    while (A.next < ctx2.currentTime + 0.2) {
      const t = A.next, st = A.step % 32;
      if (st % 4 === 0) {
        const o = ctx2.createOscillator(), g = ctx2.createGain();
        o.frequency.setValueAtTime(130, t);
        o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
        g.gain.setValueAtTime(0.5, t);
        g.gain.exponentialRampToValueAtTime(1e-3, t + 0.2);
        o.connect(g);
        g.connect(A.music);
        o.start(t);
        o.stop(t + 0.25);
      }
      if (st % 2 === 1) noiseHit(0.05, 8e3, 1, 0.12, "highpass", null, t - ctx2.currentTime, A.music);
      if (st % 8 === 4) noiseHit(0.16, 1800, 0.8, 0.22, "bandpass", null, t - ctx2.currentTime, A.music);
      const bass = [55, 0, 55, 65.4, 0, 73.4, 55, 0, 82.4, 0, 73.4, 65.4, 55, 0, 49, 55][st % 16];
      if (bass) {
        const o = ctx2.createOscillator(), f = ctx2.createBiquadFilter(), g = ctx2.createGain();
        o.type = "sawtooth";
        o.frequency.value = bass * (st >= 16 ? 1.335 : 1);
        f.type = "lowpass";
        f.frequency.setValueAtTime(900, t);
        f.frequency.exponentialRampToValueAtTime(160, t + 0.18);
        g.gain.setValueAtTime(0.22, t);
        g.gain.exponentialRampToValueAtTime(1e-3, t + 0.22);
        o.connect(f);
        f.connect(g);
        g.connect(A.music);
        o.start(t);
        o.stop(t + 0.25);
      }
      A.next += spb;
      A.step++;
    }
  }
  const G = window.__game = {
    state: "loading",
    score: 0,
    time: ROUND,
    chain: 0,
    mult: 1,
    comboT: 0,
    tricks: [],
    gatesHit: 0,
    gatesMissed: 0,
    grinds: 0,
    wipeouts: 0,
    maxAir: 0,
    topSpeed: 0,
    finished: false,
    timeBonus: 0,
    features: FEATURES,
    fps: 0,
    quality: 2,
    events: []
  };
  const P = { s: 0, u: 0, y: 0, vy: 0, speed: 0, heading: 0, air: false, airT: 0, spin: 0, spinVel: 0, grab: null, grabT: 0, grabName: null, popT: -9, crashT: 0, rail: null, bal: 0, railT: 0, tuck: 0, steer: 0, carveRoll: 0, yawVis: 0, prevS: 0, peakY: 0, launchedFrom: null, popped: false };
  window.__rider = P;
  G.P = P;
  G.scene = scene;
  G.camera = camera;
  G.renderer = renderer;
  let callouts = [], hint = { text: "", t: 0 }, shakeT = 0, slowmo = 1, keys = {}, countdown = 0, finishT = 0, endAt = 0, saved = false, startAt = 0;
  const callout = (text2, sub = "", color = "#ffffff", big = 1) => {
    callouts = [{ text: text2, sub, color, t: 0, big }];
    G.events.push(text2);
  };
  function award(pts, label, keepChain = true) {
    if (keepChain) {
      G.chain++;
      G.comboT = 5.5;
    }
    G.mult = Math.min(4, 1 + Math.floor(G.chain / 3));
    const got = Math.round(pts * G.mult);
    G.score += got;
    return got;
  }
  function resetRun() {
    Object.assign(P, { s: 0, u: 0, y: groundAt(0, 0), vy: 0, speed: 0, heading: 0, air: false, airT: 0, spin: 0, spinVel: 0, grab: null, grabT: 0, crashT: 0, rail: null, bal: 0, tuck: 0, steer: 0, prevS: 0, popped: false });
    Object.assign(G, { score: 0, time: ROUND, chain: 0, mult: 1, comboT: 0, tricks: [], gatesHit: 0, gatesMissed: 0, grinds: 0, wipeouts: 0, maxAir: 0, topSpeed: 0, finished: false, timeBonus: 0, events: [] });
    FEATURES.forEach((f) => {
      f.done = false;
      f.hit = null;
    });
    GATES.forEach((g, i) => {
      var _a, _b;
      g.u = (_a = g.u0) != null ? _a : g.u0 = g.u;
      g.w = (_b = g.w0) != null ? _b : g.w0 = g.w;
      layoutGate(g);
    });
    track.reset();
    callouts = [];
    saved = false;
    missStreak = 0;
    hitStreak = 0;
  }
  let missStreak = 0, hitStreak = 0;
  let songOK = null;
  if (!MUTE) fetch("assets/music/extreme.mp3", { method: "HEAD" }).then((r) => {
    songOK = r.ok;
  }).catch(() => {
    songOK = false;
  });
  function startRun() {
    audioInit();
    if (songOK && BP.music) BP.music("extreme", 0.3);
    if (A.ctx && A.ctx.state === "suspended") A.ctx.resume();
    resetRun();
    G.state = "countdown";
    countdown = 3.2;
    startAt = performance.now();
  }
  addEventListener("keydown", (e) => {
    keys[e.code] = true;
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
    if (e.code === "Enter" || e.code === "Space" && G.state !== "play") pressPrimary();
    if ((e.code === "Space" || e.code === "ArrowUp") && G.state === "play") doJump();
  });
  addEventListener("keyup", (e) => {
    keys[e.code] = false;
  });
  BP.on("jump", () => {
    if (G.state === "play") doJump();
  });
  const FEEL = { st: null, footRef: null, twist: 0, twistAt: -9 };
  function pictureFeel(now) {
    const I = BP.img, ok = I && I.lShoulder && I.rShoulder && I.lFoot && I.rFoot && I.lHip && I.rHip && performance.now() - (BP.imgAt || 0) < 700;
    if (!ok) {
      FEEL.st = null;
      return null;
    }
    const cy2 = (I.lShoulder[1] + I.rShoulder[1]) / 2, hy = (I.lHip[1] + I.rHip[1]) / 2, fy = (I.lFoot[1] + I.rFoot[1]) / 2, T = hy - cy2;
    if (T <= 0.02 || fy - cy2 <= 0.05) return null;
    const F = FEEL, dt = F.at ? Math.min(0.1, Math.max(1e-3, (now - F.at) / 1e3)) : 0.016;
    F.at = now;
    const s = fy - cy2;
    if (F.st === null) {
      F.st = s;
      F.base = s;
      F.footRef = fy;
    }
    F.st += (s - F.st) * (1 - Math.exp(-dt / 0.12));
    F.footRef += (fy - F.footRef) * (1 - Math.exp(-dt / 1.2));
    const moved = Math.abs(fy - F.footRef) > 0.025;
    if (moved) F.base += (F.st - F.base) * (1 - Math.exp(-dt / 0.25));
    else if (F.st > F.base) F.base += (F.st - F.base) * (1 - Math.exp(-dt / 0.5));
    else F.base += (F.st - F.base) * (1 - Math.exp(-dt / 30));
    const drop = clamp(1 - F.st / F.base, 0, 0.5);
    const tuck = clamp((drop - 0.025) / 0.055, 0, 1) * 0.75 + clamp((drop - 0.1) / 0.08, 0, 1) * 0.25;
    let twist = 0;
    if (I.lHand && I.rHand) {
      const lUp = I.lHand[1] < cy2 - 0.1 * T, rUp = I.rHand[1] < cy2 - 0.1 * T, lDn = I.lHand[1] > cy2 + 0.45 * T, rDn = I.rHand[1] > cy2 + 0.45 * T;
      if (Math.abs(I.lHand[1] - I.rHand[1]) > 0.9 * T) twist = rUp && lDn ? 1 : lUp && rDn ? -1 : 0;
    }
    return { drop, tuck, twist };
  }
  function input() {
    var _a, _b, _c;
    const B = BP.body, now = performance.now();
    let steer = 0, crouch = 0, armsUp = false, tuck = null, body = false, deep = false, rawSteer = 0, twist = 0;
    if (BP.live) {
      body = true;
      rawSteer = clamp(BP.simulating ? ((_a = B.shoulders) != null ? _a : B.x) * 1.2 + B.lean * 1.15 : (_c = (_b = B.steer) != null ? _b : B.shoulders) != null ? _c : B.x, -1, 1);
      const a = Math.abs(rawSteer), DZ = 0.2;
      steer = Math.sign(rawSteer) * Math.pow(clamp((a - DZ) / (1 - DZ), 0, 1), 1.5);
      const pf = pictureFeel(now);
      if (pf) {
        tuck = pf.tuck;
        crouch = clamp(pf.drop / 0.25, 0, 1);
        deep = pf.drop > 0.14;
        if (pf.twist) {
          FEEL.twist = pf.twist;
          FEEL.twistAt = now;
        }
      } else {
        crouch = B.crouch;
        tuck = clamp((crouch - 0.18) / 0.45, 0, 1);
        deep = crouch > 0.45;
      }
      twist = now - FEEL.twistAt < 150 ? FEEL.twist : 0;
    } else if (BP.mouse) {
      const h = BP.hands.right;
      steer = clamp((h.x - 0.5) * 2.6, -1, 1);
      crouch = h.y > 0.78 ? 1 : 0;
      armsUp = h.y < 0.14;
    }
    if (keys.ArrowLeft || keys.KeyA) {
      steer = -1;
      body = false;
    }
    if (keys.ArrowRight || keys.KeyD) {
      steer = 1;
      body = false;
    }
    if (keys.ArrowDown || keys.KeyS) {
      crouch = 1;
      tuck = null;
      deep = true;
    }
    if (keys.KeyG) {
      armsUp = true;
      body = false;
    }
    if (!body && Math.abs(steer) < 0.07) steer = 0;
    if (tuck === null || !body) tuck = clamp((crouch - 0.18) / 0.45, 0, 1);
    const L2 = BP.hands.left, R = BP.hands.right;
    const sweep = !body && (L2.seen && R.seen) ? clamp(-(L2.vx + R.vx) * 0.5 / 1.6, -1, 1) : 0;
    return { steer, crouch, armsUp, sweep, tuck, body, deep, twist, rawSteer: body ? rawSteer : steer };
  }
  function doJump() {
    if (P.crashT > 0) return;
    if (P.rail) {
      endGrind(true);
      return;
    }
    if (P.air) return;
    P.popT = performance.now();
    const k = KICKERS.find((k2) => Math.abs(P.u - k2.u) < k2.w / 2 + 0.6 && P.s > k2.s + k2.KL - 6.5 && P.s < k2.s + k2.KL);
    if (k) {
      P.popped = true;
      SFX.pop();
      return;
    }
    launch(4.6, "ollie");
    SFX.pop();
  }
  function launch(vy, from) {
    P.air = true;
    P.vy = vy;
    P.airT = 0;
    P.spin = 0;
    P.spinVel = 0;
    P.spinning = false;
    P.spinDir = 1;
    P.grab = null;
    P.grabT = 0;
    P.grabName = null;
    P.launchedFrom = from;
    P.peakY = P.y;
    if (from !== "ollie") SFX.launch();
  }
  const SPIN_PTS = [0, 200, 500, 900, 1400, 2e3, 2800, 3600];
  function land() {
    const ab = Math.abs(P.spin), rounded = Math.round(ab / 180) * 180, off = Math.abs(ab - rounded);
    const airT = P.airT;
    P.air = false;
    P.vy = 0;
    G.maxAir = Math.max(G.maxAir, airT);
    const big = airT > 0.9;
    const dir = P.spin > 0 ? "FRONTSIDE" : "BACKSIDE";
    let name = "", pts = 0;
    if (rounded >= 180) {
      name = "".concat(dir, " ").concat(rounded);
      pts += SPIN_PTS[Math.min(7, rounded / 180)] + Math.max(0, rounded / 180 - 7) * 800;
    }
    if (P.grabName && P.grabT > 0.18) {
      name += (name ? " · " : "") + P.grabName.toUpperCase();
      pts += 300 + 450 * Math.min(2, P.grabT);
    }
    if (P.popped && P.launchedFrom === "kicker") pts += 100;
    pts += Math.round(110 * airT);
    P.spin = Math.sign(P.spin || 1) * rounded;
    P.spinVel = 0;
    if (off > 62 && airT > 0.4) {
      G.wipeouts++;
      G.chain = 0;
      G.mult = 1;
      G.comboT = 0;
      P.crashT = 1.25;
      P.speed *= 0.45;
      callout("WIPEOUT!", "stop spinning before you land", "#ff7a6b");
      SFX.wipe();
      shake(1);
      burst(140, 1.5);
      G.tricks.push({ name: name || "air", pts: 0, clean: false });
      P.grab = null;
      return;
    }
    const sketchy = off > 30;
    if (name || airT > 0.75 && P.launchedFrom === "kicker") {
      if (!name) name = airT > 1.2 ? "BIG AIR" : "STRAIGHT AIR";
      const got = award(sketchy ? pts * 0.5 : pts, name, !sketchy);
      callout(name, "".concat(sketchy ? "SKETCHY " : "CLEAN! ", "+").concat(got.toLocaleString()), sketchy ? "#ffd36b" : "#7dffb0", 1 + Math.min(0.4, pts / 5e3));
      G.tricks.push({ name, pts: got, clean: !sketchy, air: +airT.toFixed(2) });
      SFX.trick(Math.floor(pts / 700));
      if (!sketchy && pts > 900) flash(16777215, 0.18);
    } else if (airT > 0.5 && P.launchedFrom === "ollie") {
      award(50, "ollie", false);
    }
    SFX.land(big);
    shake(big ? 0.55 : 0.2);
    burst(big ? 90 : 35, big ? 1.2 : 0.7);
    P.grab = null;
    P.popped = false;
    P.heading *= 0.4;
  }
  function startGrind(rl) {
    P.rail = rl;
    P.bal = (Math.random() - 0.5) * 0.25;
    P.railT = 0;
    P.air = false;
    P.vy = 0;
    P.spin = 0;
    P.grab = null;
    callout("BOARDSLIDE", "lean to keep your balance", "#9fd3ff", 0.8);
    SFX.pop();
  }
  function endGrind(jumped) {
    const rl = P.rail;
    if (!rl) return;
    P.rail = null;
    const t = P.railT, ok = Math.abs(P.bal) < 1;
    if (t > 0.25) {
      const got = award(250 + 420 * t, "grind", ok);
      callout(ok ? "BOARDSLIDE ".concat(t.toFixed(1), "s") : "BAILED THE RAIL", "".concat(ok ? "STOMPED! " : "", "+").concat(got.toLocaleString()), ok ? "#7dffb0" : "#ffd36b");
      G.tricks.push({ name: "BOARDSLIDE", pts: got, clean: ok, t: +t.toFixed(2) });
      G.grinds++;
      if (ok) SFX.trick(1);
    }
    if (!ok) P.u += Math.sign(P.bal) * 1.4;
    launch(jumped ? 4.4 : 2.6, "rail");
  }
  function burst(n, power) {
    world(P.s, P.u, P.y + 0.1, _v);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.28, sp = (1 + Math.random() * 3) * power;
      spray.emit(_v.x + (Math.random() - 0.5) * 0.6, _v.y, _v.z + (Math.random() - 0.5) * 0.8, Math.cos(a) * sp - Math.sin(rider.root.rotation.y) * P.speed * 0.75, 1 + Math.random() * 2.5 * power, Math.sin(a) * sp - Math.cos(rider.root.rotation.y) * P.speed * 0.75, 0.5 + Math.random() * 0.7, 0.08, 0.35 + Math.random() * 0.45 * power);
    }
  }
  function nextFeature(range = 40) {
    return FEATURES.find((f) => !f.done && f.s > P.s - 0.5 && f.s < P.s + range);
  }
  function stepPlay(dt, inp) {
    var _a;
    const prevS = P.s;
    P.tuck = damp(P.tuck, (_a = inp.tuck) != null ? _a : clamp((inp.crouch - 0.18) / 0.45, 0, 1), 6, dt);
    if (inp.body) {
      const want = damp(P.steer, inp.steer, 6, dt);
      P.steer += clamp(want - P.steer, -2.2 * dt, 2.2 * dt);
    } else P.steer = damp(P.steer, inp.steer, 9, dt);
    if (P.crashT > 0) {
      P.crashT -= dt;
      P.speed = damp(P.speed, 6, 1, dt);
      P.s += P.speed * dt;
      P.y = groundAt(P.s, P.u);
      P.heading = damp(P.heading, 0, 3, dt);
      return;
    }
    if (P.rail) {
      const rl = P.rail;
      P.railT += dt;
      const drift = 0.9 * Math.sin(P.railT * 2.3 + rl.s) + 0.6 * Math.sin(P.railT * 5.1);
      P.bal += (drift * 0.55 + P.bal * 1.1 + (inp.body ? inp.rawSteer : inp.steer) * 2.6) * dt;
      P.u = damp(P.u, rl.u, 14, dt);
      P.speed = damp(P.speed, 12.5, 2.5, dt);
      P.s += P.speed * dt;
      P.y = baseH(P.s, rl.u) + rl.h + 0.02;
      if (A.ctx) {
        A.grind.g.gain.value = 0.16;
        A.ringG.gain.value = 0.03;
      }
      if (Math.abs(P.bal) >= 1 || P.s > rl.s + rl.len) endGrind(false);
      gatesAndProgress(prevS);
      return;
    }
    if (A.ctx) {
      A.grind.g.gain.value = 0;
      A.ringG.gain.value = 0;
    }
    const slope = slopeAt(P.s), offPiste = Math.max(0, Math.abs(P.u) - PISTE);
    if (!P.air) {
      const target = P.steer * (inp.body ? 0.46 : 0.62);
      P.heading = damp(P.heading, target, inp.body ? 3.5 : 5.5, dt);
      const nf = nextFeature(28);
      if (nf && nf.type !== "gate") {
        const d = nf.u - P.u;
        if (Math.abs(d) < nf.w / 2 + 2.4) P.u += Math.sign(d) * Math.min(Math.abs(d), 1.4 * dt);
      }
      if (nf && nf.type === "gate") {
        const d = nf.u - P.u;
        if (Math.abs(d) < nf.w / 2 + 1.5) P.u += Math.sign(d) * Math.min(Math.abs(d), 0.8 * dt);
      }
      let vT = (inp.body ? 14 : 15.5) + (slope - 0.27) * 24 + (inp.body ? 9.5 : 8.5) * P.tuck - 3.5 * Math.abs(P.steer) - Math.min(7, offPiste * 0.8);
      if (G.state !== "play") vT = 0;
      P.speed = damp(P.speed, vT, vT > P.speed ? 0.42 : 0.9, dt);
    }
    if (Math.abs(P.u) > PISTE + 5) {
      P.heading = damp(P.heading, -Math.sign(P.u) * 0.5, 4, dt);
      if (!P.air && Math.random() < 0.3) burst(2, 0.6);
    }
    P.u = clamp(P.u, -PISTE - 9, PISTE + 9);
    let side = P.speed * Math.sin(P.heading);
    if (inp.body && !P.air && Math.abs(P.u) <= PISTE + 5) side = clamp(side, -7, 7);
    P.s += P.speed * Math.cos(P.heading) * dt;
    P.u += side * dt;
    if (P.air) {
      P.airT += dt;
      P.vy -= 9.81 * 1.3 * dt;
      P.y += P.vy * dt;
      P.peakY = Math.max(P.peakY, P.y);
      const gh = groundAt(P.s, P.u);
      const rel = P.y - gh, tLand = rel / Math.max(0.5, -P.vy + P.speed * slope);
      const late = tLand < 0.32 && P.vy < 0;
      if (inp.body) {
        const up = !!inp.twist && P.airT > 0.08;
        if (up) {
          P.spinning = true;
          P.spinDir = inp.twist > 0 ? -1 : 1;
        } else P.spinning = false;
        P.spinVel = damp(P.spinVel, up ? P.spinDir * 720 * (late ? 0.35 : 1) : 0, up ? 3.2 : 12, dt);
        P.spin += P.spinVel * dt;
        if (!up || late) {
          const near = Math.round(P.spin / 180) * 180;
          P.spin = damp(P.spin, near, up ? 3.2 : 7, dt);
        }
      } else {
        const spinIn = clamp(-(Math.abs(inp.steer) > 0.25 ? inp.steer : 0) * 1.25 + inp.sweep * 0.9, -1, 1);
        P.spinVel = damp(P.spinVel, spinIn * 620 * (late ? 0.35 : 1), late ? 9 : 5, dt);
        P.spin += P.spinVel * dt;
        if (late) {
          const near = Math.round(P.spin / 180) * 180;
          P.spin = damp(P.spin, near, Math.abs(spinIn) > 0.3 ? 3.2 : 11, dt);
        }
      }
      const grab = inp.body ? inp.deep ? "Indy" : null : inp.armsUp ? "Method" : inp.crouch > 0.45 ? "Indy" : null;
      if (grab && P.airT > 0.12 && !late) {
        if (P.grabName && P.grabName !== grab) P.grabT *= 0.7;
        P.grabName = grab;
        P.grab = grab.toLowerCase();
        P.grabT += dt;
      } else P.grab = null;
      for (const rl of RAILS) if (P.s > rl.s && P.s < rl.s + rl.len - 2 && Math.abs(P.u - rl.u) < 1.5 && P.vy < 0 && P.y - (baseH(P.s, rl.u) + rl.h) < 0.35 && P.y - (baseH(P.s, rl.u) + rl.h) > -0.4) {
        startGrind(rl);
        break;
      }
      if (P.air && P.y <= gh && P.vy < 0) {
        P.y = gh;
        land();
      }
    } else {
      const gh = groundAt(P.s, P.u);
      for (const k of KICKERS) {
        const x0 = prevS - k.s, x1 = P.s - k.s;
        if (x0 <= k.KL && x1 > k.KL && Math.abs(P.u - k.u) < k.w / 2 + 0.3) {
          if (!P.popped && BP.recent && BP.recent("jump", 420)) P.popped = true;
          const lipSlope = k.H * 2.1 / k.KL, vy = P.speed * (lipSlope - slope) * 0.6 + (P.popped ? 3.4 : 0.5);
          if (P.popped) callout("POP!", "", "#9fd3ff", 0.6);
          P.y = baseH(k.s + k.KL, P.u) + k.H;
          launch(vy, "kicker");
          k.hit = true;
          break;
        }
      }
      if (!P.air) {
        for (const rl of RAILS) if (P.s > rl.s && P.s < rl.s + 1.8 && Math.abs(P.u - rl.u) < 1.35) {
          startGrind(rl);
          break;
        }
        if (!P.rail) P.y = gh;
      }
      if (P.popped && !KICKERS.some((k) => P.s > k.s + k.KL - 7 && P.s < k.s + k.KL)) P.popped = false;
    }
    gatesAndProgress(prevS);
  }
  function gatesAndProgress(prevS) {
    for (const f of FEATURES) {
      if (f.done || !(prevS <= f.s + (f.type === "gate" ? 0 : f.KL || f.len || 0) && P.s > f.s + (f.type === "gate" ? 0 : f.KL || f.len || 0))) continue;
      f.done = true;
      if (f.type === "gate") {
        if (Math.abs(P.u - f.u) < f.w / 2 + 0.2) {
          G.gatesHit++;
          hitStreak++;
          missStreak = 0;
          f.hit = true;
          const got = award(150, "gate");
          callout("GATE", "+".concat(got), "#ff8a7a", 0.6);
          SFX.gate();
          if (hitStreak >= 3) adaptGates(-1);
        } else {
          G.gatesMissed++;
          missStreak++;
          hitStreak = 0;
          f.hit = false;
          SFX.miss();
          if (missStreak >= 1) adaptGates(1);
        }
      }
    }
    if (!G.finished && P.s >= L) {
      G.finished = true;
      G.timeBonus = Math.round(Math.max(0, G.time) * 60);
      G.score += G.timeBonus;
      callout("FINISH!", "time bonus +".concat(G.timeBonus.toLocaleString()), "#ffd36b", 1.3);
      SFX.crowd();
      flash(16777215, 0.3);
      G.state = "finish";
      finishT = 0;
    }
  }
  function adaptGates(dir) {
    for (const g of GATES) {
      if (g.done || g.s < P.s + 70) continue;
      if (dir > 0) {
        g.w = Math.min(10, g.w + 1);
        g.u *= 0.75;
      } else {
        g.w = Math.max(4.8, g.w - 0.35);
      }
      layoutGate(g);
    }
  }
  const cam = { pos: new Vector3(), look: new Vector3(), yaw: 0, fov: 50, init: false };
  const tmpA = new Vector3(), tmpB = new Vector3(), tmpC = new Vector3(), tmpD = new Vector3();
  let lastInp = { steer: 0, crouch: 0, armsUp: false, sweep: 0 }, armL = { x: 0.3, y: 0.6 }, armR = { x: 0.7, y: 0.6 };
  function riderFrame(dt, t) {
    const rp = world(P.s, P.u, P.y, tmpA);
    const pathYaw = Math.atan2(-cxd(P.s), 1);
    const travelYaw = Math.atan2(-(cxd(P.s) * Math.cos(P.heading) + Math.sin(P.heading)), Math.cos(P.heading));
    rider.root.position.copy(rp);
    rider.root.rotation.y = travelYaw;
    const gSlope = (groundAt(P.s + 0.8, P.u) - groundAt(P.s - 0.8, P.u)) / 1.6;
    rider.root.rotation.x = P.air ? damp(rider.root.rotation.x, Math.atan(gSlope) * 0.5, 2, dt) : damp(rider.root.rotation.x, Math.atan(gSlope), 14, dt);
    P.carveRoll = damp(P.carveRoll, P.air ? 0 : -P.steer * 0.42 * clamp(P.speed / 12, 0, 1), 7, dt);
    rider.root.rotation.z = P.carveRoll;
    const slideYaw = P.rail ? Math.PI / 2 : 0;
    P.yawVis = damp(P.yawVis, slideYaw, 12, dt);
    rider.tilt.rotation.y = MathUtils.degToRad(P.spin) + P.yawVis;
    rider.tilt.rotation.z = P.rail ? P.bal * 0.45 : 0;
    rider.tilt.rotation.x = P.crashT > 0 ? Math.sin(P.crashT * 6) * 0.8 : 0;
    rider.tilt.position.y = P.crashT > 0 ? -0.35 * Math.sin(Math.min(1, P.crashT) * Math.PI) : 0;
    const L2 = BP.hands.left, R = BP.hands.right;
    const tl = L2.seen ? { x: L2.x, y: L2.y } : { x: 0.22, y: 0.62 + 0.04 * Math.sin(t * 1.3) }, tr = R.seen && !BP.mouse ? { x: R.x, y: R.y } : { x: 0.78, y: 0.62 + 0.04 * Math.sin(t * 1.1) };
    armL.x = damp(armL.x, tl.x, 10, dt);
    armL.y = damp(armL.y, tl.y, 10, dt);
    armR.x = damp(armR.x, tr.x, 10, dt);
    armR.y = damp(armR.y, tr.y, 10, dt);
    const crouchVis = P.crashT > 0 ? 0.9 : P.air ? P.grab ? 0.95 : 0.35 + 0.3 * Math.max(0, -P.vy / 10) : Math.max(P.tuck, lastInp.crouch * 0.9, P.rail ? 0.35 : 0);
    rider._c = damp(rider._c || 0, crouchVis, 12, dt);
    rider._lift = damp(rider._lift || 0, P.grab ? 1 : 0, 10, dt);
    const sg = STANCE.ride;
    rider.body.scale.x = sg;
    rider.board.scale.x = sg;
    if (sg > 0) rider.pose({ crouch: rider._c, lean: P.rail ? -P.bal * 0.4 : P.steer * 0.5, armL, armR, grab: P.grab, boardLift: rider._lift });
    else rider.pose({ crouch: rider._c, lean: -(P.rail ? -P.bal * 0.4 : P.steer * 0.5), armL: { x: 1 - armR.x, y: armR.y }, armR: { x: 1 - armL.x, y: armL.y }, grab: P.grab, boardLift: rider._lift });
    rider.tilt.updateMatrixWorld(true);
    riderCam.copy(camera.position);
    rider.tilt.worldToLocal(riderCam);
    riderFig.enabled = G.state !== "title";
    riderFig.update(performance.now());
    if (sbGhost) {
      const yaw = STANCE.ride < 0 ? 90 : -90;
      if (yaw !== sbGhostYaw) {
        sbGhostYaw = yaw;
        sbGhost.setDef(Object.assign({}, STANCES.snowboard.def, { yaw }));
      }
      sbGhost.update(performance.now(), G.state === "play" && (BP.live || BP.simulating) && !BP.mouse && !P.air && P.crashT <= 0 && ROUND - G.time < 8);
    }
    {
      const on = riderFig.opacity > 0.3;
      for (const c of rider.body.children) if (c !== rider.board && !rider.bindings.includes(c)) c.visible = !on;
    }
    return rp;
  }
  const titleSpot = () => innerWidth > innerHeight * 1.05 ? [0.74, 0.5] : [0.5, 0.69];
  const endSpot = () => innerWidth > innerHeight * 1.05 ? [0.72, 0.44] : [0.5, 0.52];
  let viewKey = "";
  function titleFrame(on) {
    const sp = on === true ? titleSpot() : on === "end" ? endSpot() : null, key = sp ? sp.join() + innerWidth + "x" + innerHeight : "";
    if (key === viewKey) return;
    viewKey = key;
    if (sp) camera.setViewOffset(innerWidth, innerHeight, (0.5 - sp[0]) * innerWidth, (0.5 - sp[1]) * innerHeight, innerWidth, innerHeight);
    else camera.clearViewOffset();
  }
  function cameraFrame(dt, rp, mode, t) {
    const pathYaw = Math.atan2(-cxd(P.s + 6), 1);
    if (mode === "title") {
      const a = t * 0.12 + 0.6, r = innerWidth > innerHeight * 1.05 ? 5.6 : 9.5;
      cam.pos.set(rp.x + Math.sin(a) * r, rp.y + 1.5 + 0.3 * Math.sin(t * 0.3), rp.z + Math.cos(a) * r);
      cam.look.set(rp.x, rp.y + 0.95, rp.z);
      cam.fov = 46;
      cam.init = false;
    } else if (mode === "finish") {
      cam.yaw = damp(cam.yaw, pathYaw + 2.4, 0.6, dt);
      tmpB.set(Math.sin(cam.yaw) * 7, 2.4, Math.cos(cam.yaw) * 7);
      cam.pos.lerp(tmpC.copy(rp).add(tmpB), 1 - Math.exp(-2 * dt));
      cam.look.lerp(tmpD.set(rp.x, rp.y + 1, rp.z), 1 - Math.exp(-6 * dt));
    } else {
      const travel = Math.atan2(-(cxd(P.s) * Math.cos(P.heading) + Math.sin(P.heading)), Math.cos(P.heading));
      const want = lerp(pathYaw, travel, 0.55);
      cam.yaw = cam.init ? damp(cam.yaw, want, 3, dt) : want;
      const back = 4.1 + (P.air ? 1.3 : 0) + P.speed * 0.025, up = 1.75 + (P.air ? 0.7 : 0);
      tmpB.set(Math.sin(cam.yaw) * back, 0, Math.cos(cam.yaw) * back);
      const camS = P.s - back * 0.95, gBehind = groundAt(camS, P.u + Math.sin(cam.yaw) * 0);
      const yGround = P.rail ? P.y : P.air ? lerp(groundAt(P.s, P.u), P.y, 0.55) : P.y;
      tmpC.set(rp.x + tmpB.x, Math.max(yGround + up, gBehind + 1.25), rp.z + tmpB.z);
      if (!cam.init) {
        cam.pos.copy(tmpC);
        cam.init = true;
      } else cam.pos.lerp(tmpC, 1 - Math.exp(-(P.air ? 4 : 9) * dt));
      const fwd = 7;
      tmpD.set(rp.x - Math.sin(cam.yaw) * fwd, lerp(yGround, P.y, 0.6) + 0.45 - fwd * slopeAt(P.s) * 0.8, rp.z - Math.cos(cam.yaw) * fwd);
      cam.look.lerp(tmpD, 1 - Math.exp(-10 * dt));
      cam.fov = damp(cam.fov, 50 + clamp((P.speed - 14) * 0.9, 0, 12) + P.tuck * 3, 3, dt);
    }
    camera.position.copy(cam.pos);
    camera.lookAt(cam.look);
    if (G._camHook) G._camHook(camera);
    titleFrame(mode === "title" ? true : G.state === "end" ? "end" : false);
    if (Math.abs(camera.fov - cam.fov) > 0.01) {
      camera.fov = cam.fov;
      camera.updateProjectionMatrix();
    }
    sun2.position.copy(rp).addScaledVector(SUN_DIR, 70);
    sun2.target.position.copy(rp);
    sun2.target.position.z -= 6;
    mountains.position.set(camera.position.x, camera.position.y * 0.15 - 330, camera.position.z);
  }
  function effectsFrame(dt, t, rp) {
    if (!P.air && !P.rail && (G.state === "play" || G.state === "finish") && P.speed > 3) {
      const carve = Math.abs(P.steer), rate = P.speed * 4 * (0.25 + carve * 2.2 + (Math.abs(P.u) > PISTE ? 1.5 : 0) + (G.state === "finish" ? 3 : 0));
      let n = rate * dt;
      while (n > 0) {
        if (Math.random() < n) {
          const side = -Math.sign(P.steer || 1e-3), yaw2 = rider.root.rotation.y;
          tmpB.set(side * 0.18, 0.05, 0.55 + Math.random() * 0.4).applyAxisAngle(new Vector3(0, 1, 0), yaw2).add(rp);
          tmpC.set(side * (1.5 + carve * 4) * Math.random(), 0, 2 + Math.random() * 2).applyAxisAngle(new Vector3(0, 1, 0), yaw2);
          const yv = rider.root.rotation.y, fw = P.speed * 0.72;
          spray.emit(tmpB.x, tmpB.y, tmpB.z, tmpC.x + (Math.random() - 0.5) - Math.sin(yv) * fw, 1.2 + Math.random() * (1 + carve * 3), tmpC.z - Math.cos(yv) * fw, 0.35 + Math.random() * 0.5, 0.05, 0.16 + carve * 0.3 + Math.random() * 0.12);
        }
        n -= 1;
      }
      const yaw = rider.root.rotation.y;
      tmpB.set(-0.14, 0.03, 0.3).applyAxisAngle(new Vector3(0, 1, 0), yaw).add(rp);
      tmpC.set(0.14, 0.03, 0.3).applyAxisAngle(new Vector3(0, 1, 0), yaw).add(rp);
      if (!track._last || track._last.distanceToSquared(rp) > 0.36) {
        track.add(tmpB, tmpC, true);
        (track._last || (track._last = new Vector3())).copy(rp);
      }
    } else if (P.air || P.rail) {
      track._last = null;
      track.add(tmpB.set(0, -999, 0), tmpC.set(0, -999, 0), false);
    }
    const camS = -camera.position.z;
    for (const ch of TREE_CHUNKS) {
      const d = Math.abs(ch.s - camS), near = d < 150;
      ch.hi.forEach((m) => {
        m.visible = near;
        m.castShadow = d < 70;
      });
      ch.lo.forEach((m) => {
        m.visible = !near;
        m.castShadow = false;
      });
    }
    spray.update(dt, 5.5, 0.9);
    const sc = renderer.getDrawingBufferSize(tmpD).y * 0.5 * camera.projectionMatrix.elements[5];
    spray.mat.uniforms.uScale.value = sc;
    dust.update(t, camera.position);
    ensureBlur();
    blurPass.uniforms.amount.value = damp(blurPass.uniforms.amount.value, G.state === "play" ? clamp((P.speed - 17) / 220, 0, 0.035) : 0, 4, dt);
    for (const g of GATES) {
      if (Math.abs(g.s - P.s) > 120) continue;
      for (const f of g.flags) f.userData.fl.rotation.y = (f.userData.sd < 0 ? Math.PI : 0) + Math.sin(t * 2.3 + g.s + f.userData.sd) * 0.18 + (g.done && g.hit ? Math.sin(t * 20) * 0.1 * Math.max(0, 1 - (P.s - g.s) / 20) : 0);
    }
    if (A.ctx) {
      const playing = G.state === "play" || G.state === "finish";
      A.wind.g.gain.value = damp(A.wind.g.gain.value, playing ? clamp(P.speed / 26, 0, 1) * (P.air ? 0.4 : 0.22) : 0.04, 4, dt);
      A.wind.fl.frequency.value = 300 + P.speed * 45 + (P.air ? 500 : 0);
      A.carve.g.gain.value = damp(A.carve.g.gain.value, playing && !P.air && !P.rail ? clamp(P.speed / 20, 0, 1) * (0.05 + Math.abs(P.steer) * 0.22) : 0, 8, dt);
      A.music.gain.value = damp(A.music.gain.value, songOK ? 0 : G.state === "play" ? 0.22 : G.state === "title" ? 0 : 0.08, 2, dt);
      if (!songOK) musicTick();
    }
  }
  const hud = document.getElementById("hud"), ctx = hud.getContext("2d");
  let W = 0, H = 0, DPR = 1;
  function resizeHud() {
    DPR = Math.min(2, devicePixelRatio || 1);
    W = hud.width = Math.round(innerWidth * DPR);
    H = hud.height = Math.round(innerHeight * DPR);
  }
  addEventListener("resize", resizeHud);
  resizeHud();
  const FONT = (w, s) => "".concat(w, " ").concat(Math.round(s), "px system-ui, -apple-system, 'Segoe UI', sans-serif");
  let buttons = [], focusIdx = 0;
  function pill(x, y, w, h, r, fill, stroke) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = Math.max(1, h * 0.04);
      ctx.stroke();
    }
  }
  function sideLines(text2, px, maxW, fontOf) {
    const words = String(text2).split(/\s+/).filter(Boolean);
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
  function text(str, x, y, size, color = "#fff", align = "center", weight = 800, shadow = true) {
    ctx.font = FONT(weight, size);
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    if (shadow) {
      ctx.fillStyle = "rgba(0,10,30,0.55)";
      ctx.fillText(str, x + size * 0.04, y + size * 0.06);
    }
    ctx.fillStyle = color;
    ctx.fillText(str, x, y);
  }
  function button(id, label, x, y, w, h, action, primary, now, ms = 650, sub = null) {
    const over = BP.handOver({ x, y, w, h }, W, H) || mouseXY && mouseXY.x > x && mouseXY.x < x + w && mouseXY.y > y && mouseXY.y < y + h && !BP.live;
    const fill = Math.max(BP.dwell(id, over, now, ms), primary && UP.where === "menu" ? UP.k * 0.999 : 0);
    const idx = buttons.length;
    buttons.push({ id, x, y, w, h, action, primary });
    const focused = idx === focusIdx;
    pill(x, y, w, h, h / 2, primary ? "rgba(255,106,26,0.92)" : "rgba(10,22,44,0.72)", focused || over ? "#ffffff" : "rgba(255,255,255,0.35)");
    if (fill > 0 && fill < 1) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, h / 2);
      ctx.clip();
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillRect(x, y, w * fill, h);
      ctx.restore();
    }
    if (sub) {
      text(label, x + w / 2, y + h * 0.4, h * 0.38, "#fff");
      text(sub, x + w / 2, y + h * 0.76, Math.min(h * 0.19, w / (sub.length * 0.62)), "rgba(255,255,255,0.92)", "center", 800);
    } else text(label, x + w / 2, y + h / 2 + h * 0.03, Math.min(h * 0.42, w / (label.length * 0.66)), "#fff");
    if (fill === 1) {
      SFX.click();
      action();
    }
  }
  let mouseXY = null;
  hud.addEventListener("pointermove", (e) => {
    mouseXY = { x: e.clientX * DPR, y: e.clientY * DPR };
  });
  hud.addEventListener("pointerdown", (e) => {
    audioInit();
    const x = e.clientX * DPR, y = e.clientY * DPR;
    const b = buttons.find((b2) => x > b2.x && x < b2.x + b2.w && y > b2.y && y < b2.y + b2.h);
    if (b) {
      SFX.click();
      b.action();
    } else if (G.state === "play") doJump();
  });
  addEventListener("keydown", (e) => {
    if (e.code === "ArrowLeft" && G.state !== "play") focusIdx = Math.max(0, focusIdx - 1);
    if (e.code === "ArrowRight" && G.state !== "play") focusIdx = Math.min(buttons.length - 1, focusIdx + 1);
  });
  function pressPrimary() {
    const b = buttons[focusIdx] || buttons.find((b2) => b2.primary);
    if (b) {
      SFX.click();
      b.action();
    }
  }
  const UP = { k: 0, lock: false, where: null, since: 0 };
  function bothUpPic() {
    const ri = BP.rawImg;
    if (!ri || performance.now() - (BP.imgAt || 0) > 700 || !ri.lShoulder || !ri.rShoulder || !ri.lHip || !ri.rHip || !ri.lHand || !ri.rHand) return false;
    const ar = BP.imgAR || 0.5625, sy = (ri.lShoulder[1] + ri.rShoulder[1]) / 2;
    const T = Math.hypot((ri.lShoulder[0] + ri.rShoulder[0] - ri.lHip[0] - ri.rHip[0]) / 2 * ar, (ri.lShoulder[1] + ri.rShoulder[1] - ri.lHip[1] - ri.rHip[1]) / 2);
    return T > 0.03 && ri.lHand[1] < sy - 0.5 * T && ri.rHand[1] < sy - 0.5 * T;
  }
  function upStart(dt, now) {
    const where = G.state === "title" || G.state === "end" && now - endAt > 1200 ? "menu" : null;
    const up = !!where && BP.live && !BP.mouse && BP.present !== false && bothUpPic();
    if (!up) {
      UP.lock = false;
      UP.since = 0;
    } else if (!UP.since) UP.since = now;
    UP.k = up && !UP.lock ? Math.min(1, (now - UP.since) / 1e3 / 0.9) : Math.max(0, UP.k - dt * 2);
    UP.where = where;
    if (UP.k >= 1) {
      UP.k = 0;
      UP.lock = true;
      pressPrimary();
    }
  }
  const goHome = () => {
    location.href = "index.html";
  };
  function stick(x, y, s, kind, t) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = s * 0.07;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const bob = Math.sin(t * 3);
    let lean = 0, crouch = 0, jump = 0, arms = 0;
    if (kind === "lean") lean = bob * 0.35;
    if (kind === "squat") crouch = (bob + 1) / 2;
    if (kind === "jump") jump = Math.max(0, bob);
    if (kind === "arms") arms = 1;
    ctx.translate(0, -jump * s * 0.25);
    ctx.rotate(lean);
    const hipY = s * (0.15 + crouch * 0.15), headY = -s * 0.5 + crouch * s * 0.15;
    ctx.beginPath();
    ctx.arc(0, headY, s * 0.11, 0, 6.28);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, headY + s * 0.11);
    ctx.lineTo(0, hipY);
    ctx.moveTo(-s * 0.16, s * 0.5 - crouch * 0.02);
    ctx.lineTo(-s * 0.06 - crouch * s * 0.14, s * 0.33);
    ctx.lineTo(0, hipY);
    ctx.lineTo(s * 0.06 + crouch * s * 0.14, s * 0.33);
    ctx.lineTo(s * 0.16, s * 0.5);
    const sh = headY + s * 0.22;
    if (arms) {
      ctx.moveTo(0, sh);
      ctx.lineTo(-s * 0.16, headY - s * 0.12);
      ctx.moveTo(0, sh);
      ctx.lineTo(s * 0.16, headY - s * 0.12);
    } else {
      ctx.moveTo(0, sh);
      ctx.lineTo(-s * 0.26, sh + s * 0.12);
      ctx.moveTo(0, sh);
      ctx.lineTo(s * 0.26, sh + s * 0.12);
    }
    ctx.stroke();
    ctx.strokeStyle = "#ff8a3a";
    ctx.beginPath();
    ctx.moveTo(-s * 0.32, s * 0.53);
    ctx.lineTo(s * 0.32, s * 0.53);
    ctx.stroke();
    ctx.restore();
  }
  function drawTitle(now, t) {
    const u = Math.min(W, H) / 100;
    if (0) {
      ctx.save();
      ctx.font = FONT(900, u * 12);
      const tw = ctx.measureText("SUMMIT SEND").width;
      ctx.restore();
      const tg = ctx.createLinearGradient(W / 2 - tw / 2, 0, W / 2 + tw / 2, 0);
      tg.addColorStop(0, "#ffffff");
      tg.addColorStop(0.5, "#ffd9b8");
      tg.addColorStop(1, "#ff7a2a");
      text("SUMMIT SEND", W / 2, H * 0.215, u * 12, tg, "center", 900);
      text("Your body is the board. 90 seconds, top to bottom.", W / 2, H * 0.32, u * 2.8, "#ffffff", "center", 600);
      const cards = [["lean", "LEAN", "to carve"], ["squat", "SQUAT", "to tuck · go fast"], ["jump", "JUMP", "at the lip to launch"], ["arms", "ONE UP, ONE DOWN", "in the air: spin"]];
      const cw = u * 25, ch = u * 22, gap = u * 2.2, x0 = W / 2 - (cw * 4 + gap * 3) / 2, y0 = H * 0.39;
      cards.forEach(([k, a, b], i) => {
        const x = x0 + i * (cw + gap);
        pill(x, y0, cw, ch, u * 2, "rgba(8,20,42,0.62)", "rgba(255,255,255,0.2)");
        stick(x + cw / 2, y0 + ch * 0.4, ch * 0.5, k, t + i);
        text(a, x + cw / 2, y0 + ch * 0.79, u * 2.6, "#ffd9b8");
        text(b, x + cw / 2, y0 + ch * 0.92, u * 1.75, "#dfe9ff", "center", 600);
      });
    }
    const best = BP.best(GAME_ID);
    const sp = titleSpot(), wide = sp[0] !== 0.5, bw = u * 38, bh = u * 13, by = wide ? Math.min(H * 0.79, H - bh - u * 3) : Math.min(H * 0.85, H - bh - u * 4);
    void best;
    button("start", "START", sp[0] * W - bw / 2, by, bw, bh, startRun, true, now, 650, stanceName(STANCE.base) + " · hold to start");
    {
      const m = Math.max(12 * DPR, u * 3), sw = Math.min(u * 30, W * 0.26), sh = u * 10;
      button("stance", "SWITCH STANCE", W - sw - m, wide ? m : Math.max(m, H * 0.074), sw, sh, switchStance, false, now, 900);
    }
  }
  const PANEL_ROWS = [
    { id: "knees", anim: "squat", head: "BEND KNEES", sub: "a little = faster" },
    { id: "tall", anim: "stand", head: "STAND TALL", sub: "slow down" },
    { id: "lean", anim: "lean", head: "LEAN", sub: "steer" },
    { id: "jump", anim: "jump", head: "JUMP", sub: "at the ramp" },
    { id: "up", anim: "spin", head: "ONE HAND UP, ONE DOWN", sub: "in the air = SPIN" },
    { id: "hold", anim: "spin", head: "HOLD IT", sub: "for a 360, longer for 720" },
    { id: "down", anim: "armsout", head: "ARMS LEVEL", sub: "to land" }
  ];
  const picCv = {};
  function movePic(anim, w, h, t, col, key = anim) {
    const c = picCv[key] || (picCv[key] = document.createElement("canvas"));
    if (c.width !== w || c.height !== h) {
      c.width = w;
      c.height = h;
    }
    if (BP.howTo && BP.howTo.draw) BP.howTo.draw(c, anim === "stand" ? "raise" : anim, anim === "stand" ? 0 : anim === "armsout" ? 1.2 : t, col);
    return c;
  }
  function drawPanel(u, t) {
    if (!BP.howTo || !BP.howTo.draw) return;
    const nearK = !P.air && KICKERS.some((k) => !k.done && k.s + k.KL - P.s > 0 && k.s + k.KL - P.s < Math.max(14, P.speed * 1.4) && Math.abs(P.u - k.u) < k.w / 2 + 2);
    const hot = P.air ? P.spinning || Math.abs(P.spinVel) > 60 ? ["hold", "down"] : ["up", "hold"] : nearK ? ["jump"] : ["knees", "lean"];
    const fsH = Math.max(15 * DPR, u * 3.3), fsS = Math.max(12 * DPR, u * 2.15), rh = Math.max(fsH * 2.6, u * 8.4), pic = rh * 0.92;
    ctx.font = FONT(900, fsH);
    let tw = 0;
    for (const r of PANEL_ROWS) tw = Math.max(tw, ctx.measureText(r.head).width);
    ctx.font = FONT(700, fsS);
    for (const r of PANEL_ROWS) tw = Math.max(tw, Math.min(ctx.measureText(r.sub).width, fsH * 7.2));
    const pad = u * 1.2, pw = pic + tw + pad * 3, ph = rh * PANEL_ROWS.length + pad * 2;
    const x = W - pw - u * 1.6, top = Math.max(H * 0.17, (H - ph) / 2), y = Math.min(top, H - ph - u * 2);
    hudRects.push({ x: x / DPR, y: y / DPR, w: pw / DPR, h: ph / DPR });
    pill(x, y, pw, ph, u * 2, "rgba(8,16,34,0.5)", "rgba(255,255,255,0.16)");
    PANEL_ROWS.forEach((r, i) => {
      const ry = y + pad + i * rh, on = hot.includes(r.id);
      if (on) pill(x + pad * 0.4, ry + rh * 0.04, pw - pad * 0.8, rh * 0.92, u * 1.5, "rgba(255,211,107,0.2)", "rgba(255,211,107,0.7)");
      ctx.globalAlpha = on ? 1 : 0.78;
      const c = movePic(r.anim, Math.round(pic), Math.round(pic), t + i * 0.4, on ? "#ffd36b" : "#9fd3ff");
      ctx.drawImage(c, x + pad, ry + (rh - pic) / 2);
      const tx = x + pad * 2 + pic;
      text(r.head, tx, ry + rh * 0.36, fsH, on ? "#ffd36b" : "#ffffff", "left", 900);
      ctx.font = FONT(700, fsS);
      const sub = r.sub;
      let s1 = sub, s2 = "";
      if (ctx.measureText(sub).width > tw) {
        const k = sub.lastIndexOf(",", sub.length) > 0 ? sub.indexOf(",") + 1 : Math.ceil(sub.length / 2);
        s1 = sub.slice(0, k).trim();
        s2 = sub.slice(k).trim();
      }
      text(s1, tx, ry + rh * (s2 ? 0.66 : 0.7), fsS, "#dfe9ff", "left", 700);
      if (s2) text(s2, tx, ry + rh * 0.66 + fsS * 1.1, fsS, "#dfe9ff", "left", 700);
      ctx.globalAlpha = 1;
    });
  }
  function airPrompt(u, t) {
    const gh = groundAt(P.s, P.u), tLand = (P.y - gh) / Math.max(0.5, -P.vy + P.speed * slopeAt(P.s));
    const deg = Math.abs(Math.round(P.spin / 180) * 180);
    let head, sub = "", anim = "spin";
    if (P.spinning && P.vy < 0 && tLand < 0.6) {
      head = "ARMS LEVEL!";
      sub = deg >= 180 ? "".concat(deg, " · land it") : "land it";
      anim = "armsout";
    } else if (P.spinning) {
      head = deg >= 180 ? "".concat(deg, "!") : "SPINNING!";
      sub = "hold it for more, arms level to land";
      anim = "spin";
    } else if (deg >= 180) {
      head = "".concat(deg);
      sub = "nice! land it";
      anim = "armsout";
    } else {
      head = "ONE HAND UP, ONE DOWN = SPIN!";
      sub = "right hand up spins right · hold it for a 360, longer for 720";
      anim = "spin";
    }
    if (P.grab) sub = "".concat(P.grabName.toUpperCase(), " GRAB · ") + sub;
    if (head.length > 14) head = anim === "spin" ? "SPIN!" : head;
    sub = "";
    const size = Math.min(u * 5.2, W * 0.065), pic = size * 2.2;
    ctx.font = FONT(900, size);
    const w = ctx.measureText(head).width + pic + u * 5, h = pic + u * 1.2;
    const p = window.BPUI ? BPUI.bottom(w / DPR, h / DPR) : { x: (W - w) / 2 / DPR, y: (H - h) / DPR - 12 }, x = p.x * DPR, y = p.y * DPR;
    hudRects.push({ x: p.x, y: p.y, w: w / DPR, h: h / DPR });
    pill(x, y, w, h, u * 2.5, "rgba(8,16,34,0.62)", "rgba(255,211,107,0.75)");
    ctx.drawImage(movePic(anim, Math.round(pic), Math.round(pic), t, "#ffd36b", "air_" + anim), x + u * 1.5, y + u * 0.6);
    const tx = x + u * 3 + pic + (w - pic - u * 4.5) / 2;
    text(head, tx, y + h / 2, size, "#ffd36b", "center", 900);
  }
  function drawPlay(now, t) {
    const u = Math.min(W, H) / 100;
    const sec = Math.max(0, Math.ceil(G.time)), low = G.time < 10, ph = Math.max(40, u / DPR * 6.4) * DPR, fs = ph * 0.5, pad = ph * 0.45;
    const tStr = "".concat(Math.floor(sec / 60), ":").concat(String(sec % 60).padStart(2, "0")), sStr = G.score.toLocaleString();
    ctx.font = FONT(900, fs);
    const tw = ctx.measureText(tStr).width, sw = ctx.measureText(sStr).width, cw = tw + sw + pad * 3;
    const rStr = G.chain > 0 && G.comboT > 0 ? "COMBO ×".concat(G.mult) : "";
    ctx.font = FONT(900, fs * 0.72);
    const rw = rStr ? ctx.measureText(rStr).width + pad * 2 : 0;
    const L2 = window.BPUI ? BPUI.top(cw / DPR, ph / DPR, rw / DPR, ph / DPR) : { c: { x: (W - cw) / 2 / DPR, y: 10 }, r: { x: (W - rw) / DPR - 10, y: 10 }, bottom: 10 + ph / DPR };
    const cx2 = L2.c.x * DPR, cy2 = L2.c.y * DPR, topB = L2.bottom * DPR;
    hudRects = [{ x: L2.c.x, y: L2.c.y, w: cw / DPR, h: ph / DPR }];
    if (rStr) hudRects.push({ x: L2.r.x, y: L2.r.y, w: rw / DPR, h: ph / DPR });
    pill(cx2, cy2, cw, ph, ph / 2, low ? "rgba(160,20,20,0.7)" : "rgba(10,12,24,0.55)", "rgba(255,255,255,0.18)");
    text(tStr, cx2 + pad + tw / 2, cy2 + ph / 2, fs, "#fff", "center", 900, false);
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.fillRect(cx2 + pad * 1.5 + tw - DPR / 2, cy2 + ph * 0.25, Math.max(1, DPR), ph * 0.5);
    text(sStr, cx2 + pad * 2 + tw + sw / 2, cy2 + ph / 2, fs, "#ffd36b", "center", 900, false);
    if (rStr) {
      const x = L2.r.x * DPR, y = L2.r.y * DPR;
      pill(x, y, rw, ph, ph / 2, "rgba(10,12,24,0.55)", "rgba(255,211,107,0.6)");
      text(rStr, x + rw / 2, y + ph / 2, fs * 0.72, "#ffd36b", "center", 900, false);
      pill(x + ph * 0.4, y + ph - ph * 0.16, (rw - ph * 0.8) * clamp(G.comboT / 5.5, 0, 1), ph * 0.07, ph * 0.035, "#ffd36b");
    }
    callouts.forEach((c) => {
      const k = c.t, a = k < 0.15 ? k / 0.15 : k > 1.6 ? Math.max(0, 1 - (k - 1.6) / 0.4) : 1, sc = (k < 0.15 ? 0.6 + 2.6 * k : 1) * Math.max(0.6, c.big);
      const L3 = sideLines(c.text, sidePx(W, H) * Math.min(1, sc), sideW(W, H, 0.22), (px) => FONT(900, px)), x0 = W * 0.025, y = Math.max(H * 0.3, topB + L3.px);
      hudRects.push({ x: x0 / DPR, y: (y - L3.px * 0.6) / DPR, w: L3.w / DPR, h: L3.h / DPR });
      ctx.globalAlpha = a;
      L3.lines.forEach((l, j) => text(l, x0, y + j * L3.px * 1.1, L3.px, c.color, "left", 900));
      ctx.globalAlpha = 1;
    });
    const calloutOn = callouts.some((c) => c.t < 1.6), bot = (w, h) => {
      const p = window.BPUI ? BPUI.bottom(w / DPR, h / DPR) : { x: (W - w) / 2 / DPR, y: (H - h) / DPR - 12 };
      return [p.x * DPR, p.y * DPR];
    };
    if (P.rail) {
      const bw = Math.min(u * 44, W * 0.8), bh = u * 3.4, [bx, by0] = bot(bw, bh + u * 6), by = by0 + u * 6;
      hudRects.push({ x: bx / DPR, y: by0 / DPR, w: bw / DPR, h: (bh + u * 6) / DPR });
      pill(bx, by, bw, bh, bh / 2, "rgba(10,12,24,0.6)", "rgba(255,255,255,0.4)");
      pill(bx + bw / 2 - bw * 0.15, by, bw * 0.3, bh, bh / 2, "rgba(125,255,176,0.35)");
      const bxp = bx + bw / 2 + clamp(P.bal, -1, 1) * bw / 2 * 0.95;
      ctx.fillStyle = Math.abs(P.bal) > 0.6 ? "#ff6b6b" : "#7dffb0";
      ctx.beginPath();
      ctx.arc(bxp, by + bh / 2, u * 2.1, 0, 6.28);
      ctx.fill();
      text(P.bal > 0.35 ? "◀ LEAN LEFT" : P.bal < -0.35 ? "LEAN RIGHT ▶" : "BALANCE!", W / 2, by - u * 3, u * 3.6, "#ffffff");
    } else {
      let h = "", big = false;
      const deg = P.air && P.airT > 0.25 ? Math.abs(Math.round(P.spin / 180) * 180) : 0;
      const trick = P.air && P.airT > 0.25 ? (deg >= 180 ? "".concat(deg) : "") + (P.grab ? (deg >= 180 ? " + " : "") + P.grabName.toUpperCase() : "") : "";
      const nk = KICKERS.find((k) => !k.done && k.s + k.KL - P.s > 0 && k.s + k.KL - P.s < Math.max(10, P.speed * 0.9) && Math.abs(P.u - k.u) < k.w / 2 + 1);
      if (trick && !(P.air && P.launchedFrom === "kicker" && BP.live)) {
        h = trick;
        big = true;
      } else if (nk && !P.air) {
        h = P.popped ? "POP!" : "JUMP!";
        big = true;
      } else if (!calloutOn && G.time > ROUND - 7 && !P.air) h = BP.live ? "Bend your knees a little to go faster" : "Steer and tuck to go faster";
      else if (P.air && P.launchedFrom === "kicker" && BP.live) {
        airPrompt(u, t);
        h = "";
      } else if (!calloutOn && P.air && P.airT < 0.6 && P.launchedFrom === "kicker") h = "Steer to spin, up to grab";
      if (h) {
        const size = big ? Math.min(u * 6, W * 0.08) : Math.max(15 * DPR, u * 3.1);
        ctx.font = FONT(900, size);
        const pw = Math.min(W - u * 4, ctx.measureText(h).width + size * 2), phh = size * 2.2, [px, py] = bot(pw, phh);
        if (!big) pill(px, py, pw, phh, phh / 2, "rgba(10,12,24,0.55)", "rgba(255,255,255,0.18)");
        hudRects.push({ x: px / DPR, y: py / DPR, w: pw / DPR, h: phh / DPR });
        text(h, W / 2, py + phh / 2, size, big ? "#ffd36b" : "#ffffff", "center", 900, big);
      }
    }
  }
  let hudRects = [];
  function liveTips() {
    return;
    if (!BP.tip || G.state !== "play" || P.crashT > 0) return;
    const T = (id, txt, hot) => BP.tip(id, txt, 900, { hot });
    const side = (d) => d > 0 ? "right" : "left";
    const mode = P.air ? "air" : P.rail ? "rail" : "ground";
    if (mode !== liveTips.mode) {
      liveTips.mode = mode;
      for (const id of ["land", "spin", "grab", "rail", "ramp", "railA", "combo"]) BP.tip(id, null);
    }
    if (P.air) {
      if (P.launchedFrom !== "kicker") return;
      const gh = groundAt(P.s, P.u), tLand = (P.y - gh) / Math.max(0.5, -P.vy + P.speed * slopeAt(P.s));
      const deg = Math.abs(P.spin), off = Math.abs(deg - Math.round(deg / 180) * 180);
      const body = BP.live;
      if (P.vy < 0 && tLand < 0.7 && (Math.abs(P.spinVel) > 120 || off > 30)) T("land", body ? "Landing: arms level to stop spinning and land straight" : "Landing: stop spinning so you land straight", true);
      else if (deg < 300) T("spin", body ? "In the air: one hand up, one hand down to spin. Hold it for a 360" : "In the air: steer hard to spin a 360", true);
      else T("spin", body ? "Hold it longer: ".concat(Math.round(deg / 180) * 180 + 180, " is worth more") : "Keep spinning: ".concat(Math.round(deg / 180) * 180 + 180, " is worth more"), false);
      if (!(P.vy < 0 && tLand < 0.32)) T("grab", P.grab ? "".concat(P.grabName, " grab: hold it, longer is more points") : body ? "Grab: squat down in the air for an Indy" : "Grab: up for a Method, down for an Indy", !P.grab);
      return;
    }
    if (P.rail) {
      T("rail", "On the rail: the longer you slide, the more points", false);
      return;
    }
    const k = KICKERS.find((k2) => !k2.done && k2.s + k2.KL - P.s > 0 && k2.s + k2.KL - P.s < P.speed * 2.6);
    if (k) {
      const toLip = k.s + k.KL - P.s, lined = Math.abs(P.u - k.u) < k.w / 2 + 1;
      if (!lined) T("ramp", "Ramp ahead: lean ".concat(side(k.u - P.u), " to line up"), false);
      else if (P.popped) T("ramp", BP.live ? "Pop! Now one hand up, one down to spin" : "Pop! Now spin or grab in the air", false);
      else if (toLip < Math.max(10, P.speed * 0.9)) T("ramp", "Jump now to pop off the lip!", true);
      else T("ramp", "Ramp ahead: jump right at the lip to fly higher", false);
    } else {
      const rl = RAILS.find((r) => !r.done && r.s - P.s > 0 && r.s - P.s < P.speed * 2.6);
      if (rl) T("railA", Math.abs(P.u - rl.u) < 1.35 ? "Rail ahead: ride straight onto it" : "Rail ahead: lean ".concat(side(rl.u - P.u), " to ride onto it"), false);
    }
    if (G.chain > 0 && G.comboT > 0 && G.mult < 4) {
      const need = 3 - G.chain % 3;
      T("combo", "Combo: ".concat(need, " more trick").concat(need > 1 ? "s" : "", " or gate").concat(need > 1 ? "s" : "", " in ").concat(Math.ceil(G.comboT), "s for ×").concat(G.mult + 1), G.comboT < 2);
    }
  }
  function drawCountdown(now) {
    const u = Math.min(W, H) / 100, n = Math.ceil(countdown - 0.2);
    const L2 = sideLines(n > 0 ? String(n) : "DROP IN!", sidePx(W, H) * (n > 0 ? 1.6 : 1), sideW(W, H, 0.22), (px) => FONT(900, px));
    L2.lines.forEach((l, j) => text(l, W * 0.025, H * 0.3 + j * L2.px * 1.1, L2.px, n > 0 ? "#ffffff" : "#ffd36b", "left", 900));
  }
  function drawEnd(now) {
    const u = Math.min(W, H) / 100;
    const wide = W > H * 1.05, cw = wide ? Math.min(W * 0.36, u * 64) : Math.min(W * 0.8, u * 64), cx2 = wide ? Math.max(W * 0.035, 16 * DPR) + cw / 2 : W / 2;
    const y0 = wide ? H * 0.17 : H * 0.1, ch = wide ? H * 0.36 : H * 0.2, big = Math.min(u * 18, cw * 0.32, ch * 0.5);
    pill(cx2 - cw / 2, y0, cw, ch, u * 3, "rgba(10,12,24,0.72)", "rgba(255,255,255,0.18)");
    text(G.finished ? "RUN COMPLETE" : "TIME!", cx2, y0 + ch * 0.2, Math.max(15 * DPR, u * 3.4), "#bcd3f5", "center", 800);
    text(G.score.toLocaleString(), cx2, y0 + ch * 0.62, big, "#ffffff", "center", 900);
    const showButtons = now - endAt > 100;
    if (showButtons) {
      const L2 = BP.layout.end(W, H, { cy: wide ? H * 0.78 : H * 0.76, side: true }), a = L2.again, h = L2.home;
      button("again", "PLAY AGAIN", a.x, a.y, a.w, a.h, startRun, true, now);
      button("homeE", "HOME", h.x, h.y, h.w, h.h, goHome, false, now, BP.LEAVE_MS || 1400);
    }
  }
  BP.start();
  let last = performance.now(), fpsN = 0, fpsT = last, tAll = 0;
  resetRun();
  const tvAt = TV ? performance.now() + 2e3 : 0;
  {
    riderFrame(0.016, 0);
    cameraFrame(0.016, world(0, 0, groundAt(0, 0)), "title", 0);
    await renderer.compileAsync(scene, camera).catch(() => {
    });
    ensureBlur();
    state().composer.render(0.016);
    const q = state().quality;
    q.frames = 0;
    q.t0 = performance.now();
  }
  G.state = "title";
  G.UP = UP;
  G.startRun = startRun;
  G.trackMesh = G_track;
  G.snowMat = snowMat;
  G.sun = sun2;
  G.RK = realism_exports;
  document.getElementById("loading").style.opacity = 0;
  setTimeout(() => document.getElementById("loading").remove(), 700);
  function frame(now) {
    var _a;
    requestAnimationFrame(frame);
    BP.update(now);
    if (now - last > 120) {
      const q = state().quality;
      q.frames = 0;
      q.t0 = now;
    }
    let dt = Math.min(0.05, (now - last) / 1e3);
    last = now;
    tAll += dt;
    fpsN++;
    if (now - fpsT > 1e3) {
      G.fps = Math.round(fpsN * 1e3 / (now - fpsT));
      fpsN = 0;
      fpsT = now;
      G.quality = state().quality.tier;
    }
    const inp = input();
    lastInp = inp;
    G.inp = inp;
    upStart(dt, now);
    stanceTick(now);
    if (G.state === "title" && tvAt && now > tvAt && !G._tvStarted) {
      G._tvStarted = true;
      startRun();
    }
    if (G.state === "countdown") {
      const before = Math.ceil(countdown - 0.2);
      countdown -= dt;
      const after = Math.ceil(countdown - 0.2);
      if (after !== before) SFX.beep(after <= 0);
      if (countdown <= 0.2) {
        G.state = "play";
        BP.activity.activeSec = 0;
        BP.activity.kcal = 0;
      }
      P.tuck = damp(P.tuck, (_a = inp.tuck) != null ? _a : inp.crouch, 6, dt);
      P.steer = damp(P.steer, inp.steer, 9, dt);
    }
    if (G._freeze) dt = 0;
    if (G.state === "play") {
      const sdt = dt * slowmo;
      G.time -= dt;
      stepPlay(sdt, inp);
      liveTips();
      G.topSpeed = Math.max(G.topSpeed, P.speed);
      if (G.comboT > 0) {
        G.comboT -= dt;
        if (G.comboT <= 0 && G.chain > 0) {
          callout("COMBO ×".concat(G.mult, " BANKED"), "", "#ffd36b", 0.55);
          G.chain = 0;
          G.mult = 1;
        }
      }
      slowmo = damp(slowmo, P.air && P.airT > 0.35 && (Math.abs(P.spinVel) > 200 || P.grab) ? 0.78 : 1, 5, dt);
      if (G.time <= 0 && G.state === "play") {
        G.time = 0;
        callout("TIME!", "", "#ffd36b", 1.2);
        SFX.crowd();
        G.state = "finish";
        finishT = 0;
      }
    } else slowmo = 1;
    if (G.state === "finish") {
      finishT += dt;
      if (P.air) stepPlay(dt, { steer: 0, crouch: 0, armsUp: false, sweep: 0 });
      else {
        P.speed = damp(P.speed, 0, 1.3, dt);
        P.heading = damp(P.heading, 0.9, 2, dt);
        P.s += P.speed * Math.cos(P.heading) * dt;
        P.u += P.speed * Math.sin(P.heading) * dt * 0.5;
        P.y = groundAt(P.s, P.u);
        P.steer = damp(P.steer, P.speed > 2 ? 1 : 0, 4, dt);
      }
      if (finishT > 3.2) toEnd(now);
    }
    callouts.forEach((c) => c.t += dt);
    callouts = callouts.filter((c) => c.t < 2);
    const rp = riderFrame(dt, tAll);
    cameraFrame(dt, rp, G.state === "title" ? "title" : G.state === "finish" || G.state === "end" ? "finish" : "chase", tAll);
    effectsFrame(dt, tAll, rp);
    render(dt);
    ctx.clearRect(0, 0, W, H);
    buttons = [];
    if (G.state === "title") drawTitle(now, tAll);
    else if (G.state === "countdown") {
      drawPlay(now, tAll);
      drawCountdown(now);
    } else if (G.state === "play" || G.state === "finish") drawPlay(now, tAll);
    else if (G.state === "end") drawEnd(now);
    if (focusIdx >= buttons.length) focusIdx = 0;
    G.buttons = buttons.map((b) => ({ id: b.id, x: b.x / W, y: b.y / H, w: b.w / W, h: b.h / H }));
    BP.drawHands(ctx, W, H, G.state === "play" || G.state === "countdown" ? 0.45 : 1);
    G.s = P.s;
    G.u = P.u;
    G.speed = P.speed;
    G.air = P.air;
    G.rail = !!P.rail;
    G.balance = P.bal;
  }
  function toEnd(now) {
    if (G.state === "end") return;
    G.state = "end";
    endAt = now;
    focusIdx = 0;
    G._activeSec = BP.activity.activeSec;
    G._kcal = BP.activity.kcal;
    if (!saved) {
      saved = true;
      G.bestBefore = BP.best(GAME_ID);
      BP.saveSession({ game: GAME_ID, score: G.score });
      if (BP.highScores) BP.highScores(GAME_ID, G.score);
    }
  }
  G.startRun = startRun;
  G.toEnd = () => toEnd(performance.now());
  G.callout = callout;
  requestAnimationFrame(frame);
})().catch((e) => setTimeout(() => {
  throw e;
}));
