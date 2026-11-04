import {
  BokehPass
} from "./chunk-7FP3ETJO.js";
import {
  create
} from "./chunk-A2W6QNSO.js";
import {
  environment,
  flash,
  model,
  pbr,
  realism_exports,
  render,
  setup,
  shake,
  state,
  sun
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
  CapsuleGeometry,
  CatmullRomCurve3,
  CircleGeometry,
  Color,
  CylinderGeometry,
  Data3DTexture,
  DataUtils,
  DoubleSide,
  Euler,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Fog,
  Group,
  HalfFloatType,
  HemisphereLight,
  InstancedMesh,
  LatheGeometry,
  LinearFilter,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  Points,
  Quaternion,
  RGBAFormat,
  RepeatWrapping,
  RingGeometry,
  SRGBColorSpace,
  ShaderMaterial,
  Shape,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3
} from "./chunk-4IYDSAYK.js";
import "./chunk-NWIHTO7D.js";

// bmpage:bmpage:golf.html#0
(async () => {
  var _a, _b, _c;
  const BP = window.BodyMovin, QS = new URLSearchParams(location.search), TV = QS.has("tv"), MUTE = QS.has("mute");
  const $ = (id) => document.getElementById(id);
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t, smooth = (t) => t * t * (3 - 2 * t);
  const YD = 1.0936;
  const PCOL = ["#ffb347", "#5fd0ff", "#ff6fb5", "#9dff6a"];
  const { scene, camera, renderer } = setup($("gl"), { fov: 36, near: 0.02, far: 4e3 });
  const ROT = +((_a = QS.get("rot")) != null ? _a : 2.06);
  renderer.toneMappingExposure = 1;
  await environment(scene, renderer, "sunset_fairway", { background: true, exact: true, rotation: ROT, intensity: 1 });
  const sky = state().sky;
  let invAgx = null;
  function agxInverseLUT(N = 33, exposure = 1) {
    const mul = (m, v) => [m[0][0] * v[0] + m[1][0] * v[1] + m[2][0] * v[2], m[0][1] * v[0] + m[1][1] * v[1] + m[2][1] * v[2], m[0][2] * v[0] + m[1][2] * v[1] + m[2][2] * v[2]];
    const S2R = [[0.6274, 0.0691, 0.0164], [0.3293, 0.9195, 0.088], [0.0433, 0.0113, 0.8956]], R2S = [[1.6605, -0.1246, -0.0182], [-0.5876, 1.1329, -0.1006], [-0.0728, -83e-4, 1.1187]];
    const IN = [[0.856627153315983, 0.137318972929847, 0.11189821299995], [0.0951212405381588, 0.761241990602591, 0.0767994186031903], [0.0482516061458583, 0.101439036467562, 0.811302368396859]];
    const OUT = [[1.1271005818144368, -0.1413297634984383, -0.14132976349843826], [-0.11060664309660323, 1.157823702216272, -0.11060664309660294], [-0.016493938717834573, -0.016493938717834257, 1.2519364065950405]];
    const con = (x) => {
      const x2 = x * x, x4 = x2 * x2;
      return 15.5 * x4 * x2 - 40.14 * x4 * x + 31.96 * x4 - 6.868 * x2 * x + 0.4298 * x2 + 0.1191 * x - 232e-5;
    };
    const agx = (c) => {
      let v = c.map((x) => x * exposure);
      v = mul(IN, mul(S2R, v));
      v = v.map((x) => con(Math.min(1, Math.max(0, (Math.log2(Math.max(x, 1e-10)) + 12.47393) / 16.499999))));
      v = mul(OUT, v).map((x) => Math.pow(Math.max(0, x), 2.2));
      return mul(R2S, v).map((x) => Math.min(1, Math.max(0, x)));
    };
    const s2l = (c) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    invAgx = (srgbHex) => {
      const c = new Color(srgbHex);
      const t = [c.r, c.g, c.b].map((v) => Math.max(1e-4, v));
      let x = t.slice();
      for (let i = 0; i < 60; i++) {
        const y = agx(x);
        x = x.map((xi, k) => Math.min(60, Math.max(1e-5, xi * Math.pow(t[k] / Math.max(1e-4, y[k]), 0.9))));
      }
      return new Color(x[0], x[1], x[2]);
    };
    const data = new Uint16Array(N * N * N * 4), h = DataUtils.toHalfFloat;
    for (let b = 0; b < N; b++) for (let g = 0; g < N; g++) for (let r = 0; r < N; r++) {
      const t = [r, g, b].map((v) => Math.max(1e-4, s2l(v / (N - 1))));
      let x = t.slice();
      for (let i = 0; i < 36; i++) {
        const y = agx(x);
        x = x.map((xi, k) => Math.min(60, Math.max(1e-5, xi * Math.pow(t[k] / Math.max(1e-4, y[k]), 0.9))));
      }
      const o = ((b * N + g) * N + r) * 4;
      data[o] = h(x[0]);
      data[o + 1] = h(x[1]);
      data[o + 2] = h(x[2]);
      data[o + 3] = h(1);
    }
    const tex = new Data3DTexture(data, N, N, N);
    tex.type = HalfFloatType;
    tex.format = RGBAFormat;
    tex.minFilter = tex.magFilter = LinearFilter;
    tex.unpackAlignment = 1;
    tex.needsUpdate = true;
    return tex;
  }
  agxInverseLUT(2);
  scene.fog = new Fog(invAgx(QS.get("fog") || "#3f432c"), +(QS.get("fn") || 110), +(QS.get("ff") || 950));
  const SUN_AZ = +((_b = QS.get("sunaz")) != null ? _b : 0.22);
  const SUN_EL = +(QS.get("sel") || 0.12);
  const sunDir = new Vector3(Math.sin(SUN_AZ) * Math.cos(SUN_EL), Math.sin(SUN_EL), -Math.cos(SUN_AZ) * Math.cos(SUN_EL));
  const sun2 = sun(scene, { color: new Color(QS.get("sc") || "#ffb488"), intensity: +(QS.get("si") || 1.6), position: [sunDir.x * 60, sunDir.y * 60, sunDir.z * 60], size: 22 });
  sun2.shadow.camera.far = 140;
  sun2.shadow.camera.updateProjectionMatrix();
  sun2.shadow.radius = 4;
  sun2.shadow.bias = -2e-4;
  const hemi = new HemisphereLight(9081032, 2371610, +(QS.get("hi") || 0.2));
  scene.add(hemi);
  const SEAT = { base: +((_c = QS.get("seat")) != null ? _c : 5.2) * Math.PI / 180, dist: 480 };
  const seatU = { uS: { value: 0 }, uE1: { value: -6.5 * Math.PI / 180 }, uE2: { value: 14 * Math.PI / 180 } };
  const seat = (() => {
    if (!sky || !sky.geometry.parameters) return null;
    const rad = sky.geometry.parameters.radius * 0.97, th0 = (90 - 15) * Math.PI / 180, th1 = (90 + 45) * Math.PI / 180;
    const geo = new SphereGeometry(rad, 192, 80, 0, Math.PI * 2, th0, th1 - th0);
    const p = geo.attributes.position, uv = geo.attributes.uv;
    for (let i = 0; i < p.count; i++) uv.setY(i, 1 - Math.acos(clamp(p.getY(i) / rad, -1, 1)) / Math.PI);
    const m = sky.material.clone();
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, seatU);
      sh.vertexShader = "uniform float uS, uE1, uE2;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n      { vec3 d = normalize(position); float e = asin(clamp(d.y, -1.0, 1.0)); float e2 = e + uS * (1.0 - smoothstep(uE1, uE2, e));\n        vec2 hz = normalize(d.xz); transformed = length(position) * vec3(hz.x * cos(e2), sin(e2), hz.y * cos(e2)); }");
    };
    m.customProgramCacheKey = () => "photoSeat";
    const band = new Mesh(geo, m);
    band.name = "photoSeat";
    band.renderOrder = -999;
    band.frustumCulled = false;
    band.onBeforeRender = (r, s, cam2) => {
      band.position.setFromMatrixPosition(cam2.matrixWorld);
      band.scale.copy(sky.scale);
      band.rotation.copy(sky.rotation);
      band.updateMatrixWorld();
    };
    scene.add(band);
    return band;
  })();
  const TURF = { fair: new Color(QS.get("tc") || "#2e5618"), green: new Color(QS.get("tg") || "#74b434") };
  scene.environmentIntensity = +(QS.get("ei") || 0.85);
  function turfMaterial(base, { repeat = 1, stripes = 1, fade = true, wear = 1 } = {}) {
    const m = pbr("grass_ground", { repeat: [repeat, repeat], normalScale: 0.9 });
    m.transparent = fade;
    m.envMapIntensity = 0.85;
    m.userData.u = { uGrass: { value: base }, uStripe: { value: stripes }, uWear: { value: wear } };
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, m.userData.u);
      sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vWP;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvWP = (modelMatrix * vec4(transformed, 1.0)).xyz;");
      sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec3 vWP; uniform vec3 uGrass; uniform float uStripe, uWear;").replace("#include <map_fragment>", "\n        vec3 tx = texture2D(map, vWP.xz * 0.38).rgb;\n        float l = dot(tx, vec3(0.2126, 0.7152, 0.0722));\n        float m1 = dot(texture2D(map, vWP.xz * 0.021 + 0.3).rgb, vec3(0.333));\n        float m2 = dot(texture2D(map, vWP.zx * 0.0047 + 0.71).rgb, vec3(0.333));\n        vec3 g = uGrass * (l / 0.16);\n        float dry = clamp((dot(tx, vec3(1.0, -0.6, -0.4)) - 0.02) * 6.0, 0.0, 1.0);   // the scan's own dry blades, as a tint of OUR grass colour\n        g = mix(g, g * vec3(1.45, 1.12, 0.6), dry * 0.35);\n        g *= 0.72 + 2.2 * (m1 - 0.16) + 1.4 * (m2 - 0.16) + 0.28;         // big soft patches break the tiling\n        float worn = smoothstep(0.13, 0.09, m2) * uWear;                    // worn, drier patches like a real range\n        g = mix(g, g * vec3(1.5, 1.05, 0.55) * 0.85, worn * 0.5);\n        // mowing stripes run down the range; like real ones they flip light/dark with the side you look from\n        float sx = fract(vWP.x / 9.0 + 0.5), st = smoothstep(0.46, 0.54, sx) - smoothstep(0.96, 1.0, sx);\n        vec2 vdir = normalize(vWP.xz - cameraPosition.xz + 1e-4);\n        float sgn = mix(-1.0, 1.0, st) * (0.55 + 0.45 * abs(vdir.y));\n        g *= 1.0 + uStripe * 0.11 * sgn * (1.0 - smoothstep(260.0, 420.0, -vWP.z));\n        diffuseColor.rgb *= max(g, 0.0);\n        float dCam = length(vWP.xz - cameraPosition.xz);\n        diffuseColor.a *= 1.0 - smoothstep(330.0, 620.0, dCam);\n      ").replace("#include <lights_fragment_end>", "#include <lights_fragment_end>\nreflectedLight.indirectSpecular *= 0.2;").replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nroughnessFactor = 0.92;").replace("#include <normal_fragment_maps>", "\n        vec3 mapN = texture2D(normalMap, vWP.xz * 0.38).xyz * 2.0 - 1.0; mapN.xy *= normalScale;\n        vec3 mapN2 = texture2D(normalMap, vWP.zx * 1.9 + 0.37).xyz * 2.0 - 1.0;        // blade-scale micro detail, fades out with distance\n        mapN.xy += mapN2.xy * normalScale * 0.6 * (1.0 - smoothstep(6.0, 30.0, length(vWP - cameraPosition)));\n        normal = normalize(tbn * mapN);\n        vec2 q = vWP.xz * 0.045; float e = 0.02;\n        float h0 = sin(q.x * 1.3 + sin(q.y * 0.7)) * cos(q.y * 1.1 + 0.6 * sin(q.x * 0.5)), hx = sin((q.x + e) * 1.3 + sin(q.y * 0.7)) * cos(q.y * 1.1 + 0.6 * sin((q.x + e) * 0.5)), hz = sin(q.x * 1.3 + sin((q.y + e) * 0.7)) * cos((q.y + e) * 1.1 + 0.6 * sin(q.x * 0.5));\n        vec3 tilt = vec3(-(hx - h0) / e, 0.0, -(hz - h0) / e) * 0.12 * uWear;\n        normal = normalize(normal + (viewMatrix * vec4(tilt, 0.0)).xyz);\n      ").replace("#include <aomap_fragment>", "\n        float ambientOcclusion = mix(1.0, texture2D(aoMap, vWP.xz * 0.38).r, 0.8);\n        reflectedLight.indirectDiffuse *= ambientOcclusion;\n      ");
    };
    m.customProgramCacheKey = () => "turf" + fade;
    return m;
  }
  const groundGeo = new PlaneGeometry(4e3, 4e3, 1, 1);
  groundGeo.rotateX(-Math.PI / 2);
  groundGeo.setAttribute("uv1", groundGeo.attributes.uv);
  const ground = new Mesh(groundGeo, turfMaterial(TURF.fair));
  ground.receiveShadow = true;
  ground.renderOrder = -2;
  scene.add(ground);
  const BALL_R = 0.02135, TEE_Y = 0.025 + 0.036 + BALL_R;
  const tee = new Object3D(), teeCup = new Object3D();
  function fibreTurf(seed0, { size = 512, base = [40, 82, 34], vary = 30, len = 9, density = 9, w = 1.4 } = {}) {
    const S = size, c = document.createElement("canvas");
    c.width = c.height = S;
    const g = c.getContext("2d");
    const hc = document.createElement("canvas");
    hc.width = hc.height = S;
    const h = hc.getContext("2d");
    let s = seed0;
    const rnd = () => (s = s * 16807 % 2147483647) / 2147483647;
    g.fillStyle = "rgb(".concat(base.map((v) => v * 0.42 | 0), ")");
    g.fillRect(0, 0, S, S);
    h.fillStyle = "#000";
    h.fillRect(0, 0, S, S);
    g.lineCap = h.lineCap = "round";
    g.lineWidth = h.lineWidth = w;
    const N = S * S / 100 * density;
    for (let i = 0; i < N; i++) {
      const x = rnd() * S, y = rnd() * S, a = rnd() * 6.283, L = len * (0.45 + rnd()), dx = Math.cos(a) * L, dy = Math.sin(a) * L, k = 0.55 + rnd() * 0.7, hv = 70 + rnd() * 185 | 0;
      const col = base.map((v, j) => Math.max(0, Math.min(255, v * k + (rnd() - 0.5) * vary * (j === 1 ? 1 : 0.6))) | 0);
      g.strokeStyle = "rgb(".concat(col, ")");
      h.strokeStyle = "rgb(".concat(hv, ",").concat(hv, ",").concat(hv, ")");
      for (const ox of [0, -S, S]) for (const oy of [0, -S, S]) {
        const px = x + ox, py = y + oy;
        if (Math.max(px, px + dx) < -2 || Math.min(px, px + dx) > S + 2 || Math.max(py, py + dy) < -2 || Math.min(py, py + dy) > S + 2) continue;
        g.beginPath();
        g.moveTo(px, py);
        g.lineTo(px + dx, py + dy);
        g.stroke();
        h.beginPath();
        h.moveTo(px, py);
        h.lineTo(px + dx, py + dy);
        h.stroke();
      }
    }
    const src = h.getImageData(0, 0, S, S).data, out = h.createImageData(S, S), hg = (x, y) => src[((y + S) % S * S + (x + S) % S) * 4] / 255;
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const dx = (hg(x - 1, y) - hg(x + 1, y)) * 1.6, dy = (hg(x, y - 1) - hg(x, y + 1)) * 1.6, n = Math.hypot(dx, dy, 1), k = (y * S + x) * 4;
      out.data[k] = (dx / n * 0.5 + 0.5) * 255;
      out.data[k + 1] = (dy / n * 0.5 + 0.5) * 255;
      out.data[k + 2] = (1 / n * 0.5 + 0.5) * 255;
      out.data[k + 3] = 255;
    }
    h.putImageData(out, 0, 0);
    const map = new CanvasTexture(c), nor = new CanvasTexture(hc);
    map.colorSpace = SRGBColorSpace;
    for (const t of [map, nor]) {
      t.wrapS = t.wrapT = RepeatWrapping;
      t.anisotropy = 8;
    }
    return { map, nor };
  }
  const TB = (() => {
    const stanceT = fibreTurf(11, { base: [38, 76, 32], len: 11, density: 10 }), stripT = fibreTurf(23, { base: [70, 118, 46], len: 6, density: 12, w: 1.2 });
    const turfM = (t, rep, rough) => {
      const m = new MeshStandardMaterial({ map: t.map, normalMap: t.nor, roughness: rough, envMapIntensity: 0.8 });
      m.normalScale.set(1.1, 1.1);
      m.map = t.map.clone();
      m.normalMap = t.nor.clone();
      for (const x of [m.map, m.normalMap]) {
        x.repeat.set(...rep);
        x.needsUpdate = true;
      }
      return m;
    };
    const rubber = pbr("rubber_tiles", { repeat: [2.5, 2.5], roughness: 0.82, color: 10132122 });
    const rubberBlack = new MeshStandardMaterial({ color: 1381653, roughness: 0.72, envMapIntensity: 0.7 });
    const wood = pbr("weathered_planks", { repeat: [0.09, 1.1] }), panelWood = pbr("weathered_planks", { repeat: [1.25, 0.42] });
    const rangeBall = new MeshStandardMaterial({ color: 15262936, roughness: 0.48, envMapIntensity: 0.9 });
    const rr = (w, h, r) => {
      const s = new Shape(), x = -w / 2, y = -h / 2;
      s.moveTo(x + r, y);
      s.lineTo(x + w - r, y);
      s.quadraticCurveTo(x + w, y, x + w, y + r);
      s.lineTo(x + w, y + h - r);
      s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      s.lineTo(x + r, y + h);
      s.quadraticCurveTo(x, y + h, x, y + h - r);
      s.lineTo(x, y + r);
      s.quadraticCurveTo(x, y, x + r, y);
      return s;
    };
    const frameGeo = new ExtrudeGeometry(rr(2.32, 1.82, 0.05), { depth: 0.016, bevelEnabled: true, bevelThickness: 7e-3, bevelSize: 0.012, bevelSegments: 3, curveSegments: 6 }).rotateX(-Math.PI / 2);
    const stanceGeo = new PlaneGeometry(2.24, 1.74).rotateX(-Math.PI / 2), stripGeo = new PlaneGeometry(0.66, 1.52).rotateX(-Math.PI / 2);
    const stanceM = turfM(stanceT, [2.24 / 0.55, 1.74 / 0.55], 0.92), stripM = turfM(stripT, [0.66 / 0.4, 1.52 / 0.4], 0.86);
    const seamM = new MeshStandardMaterial({ color: 1714708, roughness: 0.95 });
    const shadowTex = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 128;
      const g = c.getContext("2d");
      g.filter = "blur(9px)";
      g.fillStyle = "rgba(0,0,0,.55)";
      g.fillRect(16, 16, 96, 96);
      return new CanvasTexture(c);
    })();
    const shadowM = new MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
    const mk = (geo, m, parent, shadow = true) => {
      const o = new Mesh(geo, m);
      o.castShadow = shadow;
      o.receiveShadow = true;
      parent.add(o);
      return o;
    };
    const ballGeo = new SphereGeometry(BALL_R, 16, 12);
    function mat(cx, { live = false } = {}) {
      const g = new Group();
      g.position.set(cx, 0, 0);
      scene.add(g);
      const sh = mk(new PlaneGeometry(2.9, 2.4).rotateX(-Math.PI / 2), shadowM, g, false);
      sh.position.y = 4e-3;
      sh.receiveShadow = false;
      const f = mk(frameGeo, rubber, g);
      f.position.y = 15e-4;
      const s = mk(stanceGeo, stanceM, g, false);
      s.position.y = 0.025;
      const seam = mk(new PlaneGeometry(0.69, 1.55).rotateX(-Math.PI / 2), seamM, g, false);
      seam.position.set(0.55 + 0.05, 0.0252, 0);
      const st = mk(stripGeo, stripM, g, false);
      st.position.set(0.55 + 0.05, 0.0255, 0);
      const t = mk(new CylinderGeometry(0.0112, 0.0128, 0.036, 20, 1, true), rubberBlack, g);
      t.position.set(0.55, 0.025 + 0.018, 0);
      const tt = mk(new RingGeometry(7e-3, 0.0112, 20).rotateX(-Math.PI / 2), rubberBlack, g, false);
      tt.position.set(0.55, 0.061, 0);
      const hole = mk(new CircleGeometry(0.014, 16).rotateX(-Math.PI / 2), rubberBlack, g, false);
      hole.position.set(0.55, 0.0258, -0.3);
      const pts = [];
      for (let L = 0; L < 3; L++) {
        const n = 3 - L;
        for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) pts.push([(j - i / 2) * 2 * BALL_R, L * 2 * BALL_R * 0.8165, (i - (n - 1) * 2 / 3) * 2 * BALL_R * 0.866]);
      }
      const pyr = new InstancedMesh(ballGeo, rangeBall, pts.length);
      pyr.castShadow = pyr.receiveShadow = true;
      pts.forEach((p, i) => pyr.setMatrixAt(i, new Matrix4().makeTranslation(0.55 + 0.42 + p[0], 0.0255 + BALL_R + p[1], 0.6 + p[2])));
      g.add(pyr);
      void live;
      return g;
    }
    function bucket(x, z, fill = 1) {
      const g = new Group();
      g.position.set(x, 0, z);
      scene.add(g);
      const prof = [[0, 4e-3], [0.118, 0], [0.123, 6e-3], [0.158, 0.262], [0.171, 0.268], [0.172, 0.281], [0.163, 0.283], [0.153, 0.27], [0.117, 0.012], [0, 0.012]].map(([a, b]) => new Vector2(a, b));
      mk(new LatheGeometry(prof, 40), new MeshPhysicalMaterial({ color: 2379898, roughness: 0.42, clearcoat: 0.4, clearcoatRoughness: 0.3, envMapIntensity: 0.9 }), g);
      const hd = mk(new TorusGeometry(0.165, 45e-4, 6, 28, Math.PI), new MeshStandardMaterial({ color: 10133670, metalness: 0.9, roughness: 0.35 }), g);
      hd.rotation.set(0, 0.4, 0);
      hd.rotateX(1.25);
      hd.position.y = 0.272;
      let s = 5 + Math.round(x * 7);
      const rnd = () => (s = s * 16807 % 2147483647) / 2147483647;
      const P2 = [], top = 0.262 * fill;
      for (let tries = 0; tries < 900 && P2.length < 60; tries++) {
        const y = top - 0.05 + rnd() * 0.07, rmax = 0.118 + (0.158 - 0.118) * Math.min(1, y / 0.262) - BALL_R, a = rnd() * 6.283, r = Math.sqrt(rnd()) * rmax;
        const yy = y + (y > top - 5e-3 ? 0.025 * (1 - (r / rmax) ** 2) : 0), p = [Math.cos(a) * r, yy, Math.sin(a) * r];
        if (P2.every((q) => Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]) > 2 * BALL_R * 0.97)) P2.push(p);
      }
      const im = new InstancedMesh(ballGeo, rangeBall, P2.length);
      im.castShadow = im.receiveShadow = true;
      P2.forEach((p, i) => im.setMatrixAt(i, new Matrix4().makeTranslation(...p)));
      g.add(im);
      return g;
    }
    function bag(x, z, yaw) {
      const g = new Group();
      g.position.set(x, 0, z);
      g.rotation.y = yaw;
      scene.add(g);
      const body = new Group();
      body.rotation.x = 0.3;
      g.add(body);
      const nylon = new MeshStandardMaterial({ color: 1779522, roughness: 0.62, envMapIntensity: 0.8 }), trim = new MeshStandardMaterial({ color: 15131870, roughness: 0.55 });
      const dark = new MeshStandardMaterial({ color: 1710620, roughness: 0.7 }), chrome = new MeshStandardMaterial({ color: 14080735, metalness: 1, roughness: 0.22 });
      mk(new CylinderGeometry(0.104, 0.1, 0.08, 28), dark, body).position.y = 0.04;
      mk(new CylinderGeometry(0.115, 0.104, 0.76, 28), nylon, body).position.y = 0.46;
      mk(new CylinderGeometry(0.117, 0.116, 0.05, 28, 1, true), trim, body).position.y = 0.66;
      mk(new CylinderGeometry(0.127, 0.12, 0.09, 28), dark, body).position.y = 0.88;
      const pk = mk(new BoxGeometry(0.15, 0.34, 0.06), nylon, body);
      pk.position.set(0, 0.38, -0.1);
      mk(new BoxGeometry(0.13, 0.04, 0.062), trim, body).position.set(0, 0.5, -0.101);
      for (let i = 0; i < 7; i++) {
        const a = i / 7 * 5.4 + 0.3, r = 0.06, sx = Math.cos(a) * r, sz = Math.sin(a) * r * 0.8 + 0.02, top = 1.08 + i % 3 * 0.03;
        const sh = mk(new CylinderGeometry(6e-3, 6e-3, top - 0.86, 8), chrome, body);
        sh.position.set(sx, (top + 0.86) / 2, sz);
        const hd = mk(new BoxGeometry(0.078, 0.046, 0.014), chrome, body);
        hd.position.set(sx + 0.03, top + 0.012, sz);
        hd.rotation.set(0.15, a * 1.3, -0.35);
      }
      const knit = [15921902, 1911631, 11019819];
      for (let i = 0; i < 3; i++) {
        const sx = (i - 1) * 0.07, sz = 0.06, top = 1.12 + (i === 1 ? 0.04 : 0);
        mk(new CylinderGeometry(0.02, 0.016, top - 0.86, 10), new MeshStandardMaterial({ color: knit[i], roughness: 0.95 }), body).position.set(sx, (top + 0.86) / 2, sz);
        const hc = mk(new SphereGeometry(1, 16, 12), new MeshStandardMaterial({ color: knit[i], roughness: 0.95 }), body);
        hc.scale.set(0.055, 0.075, 0.07);
        hc.position.set(sx, top + 0.05, sz + 0.01);
        const pom = mk(new SphereGeometry(0.022, 10, 8), trim, body);
        pom.position.set(sx, top + 0.125, sz + 0.01);
      }
      const legA = new Vector3(0, 0.62, 0.1).applyEuler(body.rotation);
      for (const s of [-1, 1]) {
        const a = legA.clone().add(new Vector3(s * 0.05, 0, 0)), b = new Vector3(s * 0.2, 0, legA.z + 0.36), d = b.clone().sub(a), L = d.length();
        const leg = mk(new CylinderGeometry(8e-3, 8e-3, L, 8), dark, g);
        leg.position.copy(a).add(b).multiplyScalar(0.5);
        leg.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), d.normalize());
      }
      return g;
    }
    function divider(x, num) {
      const g = new Group();
      g.position.set(x, 0, 0);
      scene.add(g);
      for (const z of [-0.45, 2.35]) {
        const p = mk(new BoxGeometry(0.11, 2.3, 0.11), wood, g);
        p.position.set(0, 1.15, z);
      }
      const pn = mk(new BoxGeometry(0.045, 0.86, 2.7), panelWood, g);
      pn.position.set(0, 0.47, 0.95);
      const rl = mk(new BoxGeometry(0.08, 0.07, 2.92), wood, g);
      rl.position.set(0, 0.93, 0.95);
      const tp = mk(new BoxGeometry(0.13, 0.08, 2.92), wood, g);
      tp.position.set(0, 2.32, 0.95);
      if (num) {
        const c = document.createElement("canvas");
        c.width = c.height = 128;
        const q = c.getContext("2d");
        q.fillStyle = "#1f4a2a";
        q.fillRect(0, 0, 128, 128);
        q.strokeStyle = "#e9e4d2";
        q.lineWidth = 6;
        q.strokeRect(8, 8, 112, 112);
        q.fillStyle = "#f1ecdc";
        q.font = "800 70px system-ui, sans-serif";
        q.textAlign = "center";
        q.textBaseline = "middle";
        q.fillText(num, 64, 70);
        const t = new CanvasTexture(c);
        t.colorSpace = SRGBColorSpace;
        const pl = mk(new PlaneGeometry(0.2, 0.2), new MeshStandardMaterial({ map: t, roughness: 0.5 }), g, false);
        pl.position.set(0, 1.55, -0.45 + 0.056);
      }
      return g;
    }
    const P = 5.9, BAYS = [];
    let ours = null;
    for (let k = -3; k <= 3; k++) {
      const cx = -0.55 + k * P;
      BAYS.push(cx);
      const g = mat(cx, { live: k === 0 });
      if (k === 0) ours = g;
      if (k !== 0 && Math.abs(k) < 3) bucket(cx - 1.35, 0.95 + k % 2 * 0.2, 0.6 + 0.3 * ((k + 5) % 3));
    }
    for (let k = -3; k <= 2; k++) divider(-0.55 + 0.8 + (k + 0.5) * P, String(8 + k));
    const myBucket = bucket(-1.95, 1, 1);
    const myBag = bag(-2.2, 1.55, 0.6);
    bag(-0.55 + P - 1.5, 1.5, -0.9);
    const mirror = (left) => {
      ours.scale.x = left ? -1 : 1;
      ours.position.x = left ? 0.55 : -0.55;
      myBucket.position.x = left ? 1.95 : -1.95;
      myBag.position.x = left ? 2.2 : -2.2;
      myBag.rotation.y = left ? -0.6 : 0.6;
    };
    return { BAYS, rubberBlack, rangeBall, ballGeo, mk, mirror };
  })();
  model("painted_wooden_bench").then((b) => {
    for (const cx of TB.BAYS) {
      if (Math.abs(cx + 0.55) < 0.1) continue;
      const o = b.clone(true);
      o.position.set(cx + 0.9, 0, 2.05);
      o.rotation.y = Math.PI;
      scene.add(o);
    }
  }).catch(() => {
  });
  function dimpleMaps() {
    const W = 512, H = 256, c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const g = c.getContext("2d");
    g.fillStyle = "#fff";
    g.fillRect(0, 0, W, H);
    const rows = 20, cols = 40;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const x = (i + j % 2 * 0.5) / cols * W, y = (j + 0.5) / rows * H, rr = W / cols * 0.42;
      const gr = g.createRadialGradient(x, y, 0, x, y, rr);
      gr.addColorStop(0, "#606060");
      gr.addColorStop(0.8, "#d8d8d8");
      gr.addColorStop(1, "#fff");
      g.fillStyle = gr;
      g.beginPath();
      g.arc(x, y, rr, 0, 6.283);
      g.fill();
    }
    const src = g.getImageData(0, 0, W, H).data, out = g.createImageData(W, H), hgt = (x, y) => src[((y + H) % H * W + (x + W) % W) * 4] / 255;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const dx = (hgt(x - 1, y) - hgt(x + 1, y)) * 2.2, dy = (hgt(x, y - 1) - hgt(x, y + 1)) * 2.2, n = Math.hypot(dx, dy, 1), k = (y * W + x) * 4;
      out.data[k] = (dx / n * 0.5 + 0.5) * 255;
      out.data[k + 1] = (dy / n * 0.5 + 0.5) * 255;
      out.data[k + 2] = (1 / n * 0.5 + 0.5) * 255;
      out.data[k + 3] = 255;
    }
    g.putImageData(out, 0, 0);
    return new CanvasTexture(c);
  }
  const ballMat = new MeshPhysicalMaterial({ color: 16052974, roughness: 0.42, clearcoat: 1, clearcoatRoughness: 0.18, normalMap: dimpleMaps(), normalScale: new Vector2(0.7, 0.7), envMapIntensity: 1.1 });
  const ball = new Mesh(new SphereGeometry(BALL_R, 48, 32), ballMat);
  ball.castShadow = true;
  ball.position.set(0, TEE_Y, 0);
  scene.add(ball);
  const radial = (inner, outer) => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, inner);
    gr.addColorStop(1, outer);
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
    return new CanvasTexture(c);
  };
  const blobTex = radial("rgba(0,0,0,0.7)", "rgba(0,0,0,0)");
  const blob = new Mesh(new PlaneGeometry(1, 1).rotateX(-Math.PI / 2), new MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 }));
  blob.scale.setScalar(0.07);
  scene.add(blob);
  const haloTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(255,255,255,1)");
    gr.addColorStop(0.22, "rgba(255,255,255,1)");
    gr.addColorStop(0.3, "rgba(255,250,235,.55)");
    gr.addColorStop(0.6, "rgba(255,240,210,.12)");
    gr.addColorStop(1, "rgba(255,240,210,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  })();
  const halo = new Sprite(new SpriteMaterial({ map: haloTex, color: 16777215, transparent: true, opacity: 0, depthWrite: false, depthTest: true }));
  halo.renderOrder = 5;
  scene.add(halo);
  const TR_N = 600;
  const trGeo = new BufferGeometry();
  trGeo.setAttribute("position", new BufferAttribute(new Float32Array(TR_N * 2 * 3), 3));
  trGeo.setAttribute("a", new BufferAttribute(new Float32Array(TR_N * 2), 1));
  {
    const idx = [];
    for (let i = 0; i < TR_N - 1; i++) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    trGeo.setIndex(idx);
    const e = new Float32Array(TR_N * 2);
    for (let i = 0; i < TR_N; i++) {
      e[i * 2] = -1;
      e[i * 2 + 1] = 1;
    }
    trGeo.setAttribute("e", new BufferAttribute(e, 1));
  }
  const trMat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uCol: { value: new Color(9, 1.4, 1) } },
    vertexShader: "attribute float a; attribute float e; varying float va; varying float ve; void main(){ va = a; ve = e; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader: "uniform vec3 uCol; varying float va; varying float ve; void main(){\n    float c = 1.0 - abs(ve);\n    float core = smoothstep(0.45, 0.85, c), body = smoothstep(0.0, 0.3, c);\n    vec3 col = mix(vec3(0.06, 0.01, 0.0), uCol, smoothstep(0.15, 0.5, c)) + vec3(6.0) * core;\n    gl_FragColor = vec4(col, va * body * mix(0.55, 1.0, core)); }"
  });
  const tracer = new Mesh(trGeo, trMat);
  tracer.frustumCulled = false;
  scene.add(tracer);
  let trCount = 0;
  function updateTracer(path, upto, gold) {
    trMat.uniforms.uCol.value.setRGB(gold ? 9 : 9, gold ? 6 : 1.4, gold ? 1.2 : 1);
    const pos = trGeo.attributes.position.array, al = trGeo.attributes.a.array, n = Math.min(TR_N, upto + 1);
    const step2 = Math.max(1, Math.ceil((upto + 1) / TR_N));
    let k = 0;
    const cp = camera.position, t = new Vector3(), v = new Vector3(), side = new Vector3();
    const pts = [];
    for (let i = 0; i <= upto; i += step2) pts.push(path[i]);
    if (pts[pts.length - 1] !== path[upto]) pts.push(path[upto]);
    for (let i = 0; i < pts.length && k < TR_N; i++, k++) {
      const p0 = pts[i], q = pts[Math.min(pts.length - 1, i + 1)], o = pts[Math.max(0, i - 1)], p = { x: p0.x, y: p0.y + surfaceY(p0.x, p0.z) * clamp(1 - (p0.y - BALL_R) / 0.8), z: p0.z };
      t.set(q.x - o.x, q.y - o.y, q.z - o.z).normalize();
      v.set(p.x - cp.x, p.y - cp.y, p.z - cp.z);
      const dist = v.length();
      side.crossVectors(t, v).normalize().multiplyScalar(Math.max(0.03, dist * 48e-4));
      const fadeIn = clamp(i / 3), aa = 0.95 * fadeIn * (p.y > 0.05 ? 1 : 0.35);
      pos.set([p.x + side.x, p.y + side.y, p.z + side.z, p.x - side.x, p.y - side.y, p.z - side.z], k * 6);
      al[k * 2] = al[k * 2 + 1] = aa;
    }
    trCount = k;
    trGeo.setDrawRange(0, Math.max(0, (k - 1) * 6));
    trGeo.attributes.position.needsUpdate = true;
    trGeo.attributes.a.needsUpdate = true;
  }
  function clearTracer() {
    trGeo.setDrawRange(0, 0);
    trCount = 0;
  }
  const AV = (() => {
    const grp = new Group();
    scene.add(grp);
    const std = (c, r = 0.8, m = 0) => new MeshStandardMaterial({ color: c, roughness: r, metalness: m, envMapIntensity: 0.9 });
    const M = {
      shirt: std(16757575, 0.82),
      pants: std(3882826, 0.85),
      skin: std(12157798, 0.6),
      shoe: std(15921386, 0.45),
      glove: std(16250866, 0.6),
      cap: std(2237483, 0.7),
      shaft: std(14278114, 0.28, 1),
      grip: std(1710618, 0.9),
      head: std(2369067, 0.32, 0.8),
      belt: std(1579034, 0.5)
    };
    const mk = (geo, m) => {
      const o = new Mesh(geo, m);
      o.castShadow = true;
      o.receiveShadow = true;
      grp.add(o);
      return o;
    };
    const cyl = (r0, r1, m) => mk(new CylinderGeometry(r1, r0, 1, 16, 1), m);
    const ball_ = (r, m) => mk(new SphereGeometry(r, 20, 14), m);
    const P = {
      torso: mk(new CylinderGeometry(1, 0.82, 1, 24, 1), M.shirt),
      chestCap: mk(new SphereGeometry(1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.shirt),
      pelvis: mk(new SphereGeometry(1, 20, 14), M.pants),
      belt: mk(new CylinderGeometry(1, 1, 1, 24, 1, true), M.belt),
      neck: cyl(0.055, 0.05, M.skin),
      head: ball_(0.1, M.skin),
      cap: mk(new SphereGeometry(0.104, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), M.cap),
      brim: mk(new CylinderGeometry(0.075, 0.075, 0.012, 20, 1, false, -Math.PI / 2, Math.PI), M.cap),
      uaL: cyl(0.056, 0.047, M.shirt),
      uaR: cyl(0.056, 0.047, M.shirt),
      faL: cyl(0.042, 0.033, M.skin),
      faR: cyl(0.042, 0.033, M.skin),
      shL: ball_(0.062, M.shirt),
      shR: ball_(0.062, M.shirt),
      elL: ball_(0.045, M.skin),
      elR: ball_(0.045, M.skin),
      hL: ball_(0.045, M.glove),
      hR: ball_(0.043, M.skin),
      thL: cyl(0.085, 0.06, M.pants),
      thR: cyl(0.085, 0.06, M.pants),
      snL: cyl(0.058, 0.042, M.pants),
      snR: cyl(0.058, 0.042, M.pants),
      knL: ball_(0.06, M.pants),
      knR: ball_(0.06, M.pants),
      ftL: mk(new CapsuleGeometry(0.048, 0.17, 4, 10), M.shoe),
      ftR: mk(new CapsuleGeometry(0.048, 0.17, 4, 10), M.shoe),
      shaft: cyl(75e-4, 45e-4, M.shaft),
      grip: cyl(0.0135, 0.011, M.grip),
      club: mk(new SphereGeometry(1, 24, 14), M.head)
    };
    P.ftL.rotation.z = P.ftR.rotation.z = Math.PI / 2;
    const V = (x = 0, y = 0, z = 0) => new Vector3(x, y, z), UP = V(0, 1, 0), F = V(1, 0, 0), RT = V(0, 0, 1);
    const _a2 = V(), _b2 = V(), _m = new Matrix4(), _q2 = new Quaternion();
    function bone(o, a, b) {
      _a2.subVectors(b, a);
      const L = _a2.length() || 1e-4;
      o.position.addVectors(a, b).multiplyScalar(0.5);
      o.scale.set(1, L, 1);
      o.quaternion.setFromUnitVectors(UP, _a2.divideScalar(L));
    }
    function basis(o, x, y, z, pos, sx, sy, sz) {
      _m.makeBasis(x, y, z);
      o.quaternion.setFromRotationMatrix(_m);
      o.position.copy(pos);
      o.scale.set(sx, sy, sz);
    }
    function ik(a, c, l1, l2, pole) {
      const ac = _b2.subVectors(c, a), D0 = ac.length(), D2 = Math.min(D0, (l1 + l2) * 0.999), dir = ac.clone().divideScalar(D0 || 1);
      const ca = clamp((l1 * l1 + D2 * D2 - l2 * l2) / (2 * l1 * D2), -1, 1), sa = Math.sqrt(1 - ca * ca);
      const perp = pole.clone().addScaledVector(dir, -pole.dot(dir)).normalize();
      return a.clone().addScaledVector(dir, l1 * ca).addScaledVector(perp, l1 * sa);
    }
    const GX = -1.08, HIP_Y = 0.9;
    const PELVIS0 = V(GX - 0.06, HIP_Y, 0), SPINE_TILT = 0.55, SPINE = 0.5, RR = 0.56;
    const spineAt = (tilt) => V(Math.sin(tilt), Math.cos(tilt), 0);
    const S0 = PELVIS0.clone().addScaledVector(spineAt(SPINE_TILT), SPINE);
    const BALL_AIM = V(0, 0.062, 0.078);
    const D = BALL_AIM.clone().sub(S0).normalize(), CLUB = BALL_AIM.distanceTo(S0) - RR;
    const st = { th: 0, yaw: 0, w0: 0.68, wAddr: null, r0: 1.15, dir: 1, high: 0, lowT: 0, src: "none", hist: [], replay: null, script: null, side: 0.5, lastT: 0, finish: 0 };
    const wrapDeg = (a) => (a + 540) % 360 - 180;
    function read(now) {
      const I = BP.img, fresh = BP.live && !BP.simulating && performance.now() - (BP.imgAt || 0) < 700 && I.lShoulder && I.rShoulder && I.lHand && I.rHand && I.lHip && I.rHip;
      if (fresh) {
        const c = [(I.lShoulder[0] + I.rShoulder[0]) / 2, (I.lShoulder[1] + I.rShoulder[1]) / 2], hp = [(I.lHip[0] + I.rHip[0]) / 2, (I.lHip[1] + I.rHip[1]) / 2];
        const len = Math.max(0.08, Math.hypot(c[0] - hp[0], c[1] - hp[1]));
        st.len = st.len ? st.len + 0.05 * (len - st.len) : len;
        const h = [(I.lHand[0] + I.rHand[0]) / 2, (I.lHand[1] + I.rHand[1]) / 2];
        return { src: "camera", uR: -(h[0] - c[0]) / st.len, v: -(h[1] - c[1]) / st.len, w: Math.abs(I.lShoulder[0] - I.rShoulder[0]) / st.len };
      }
      const L = BP.hands.left, Rh = BP.hands.right;
      if (BP.live && (L.seen || Rh.seen)) {
        const hx = L.seen && Rh.seen ? (L.x + Rh.x) / 2 : (L.seen ? L : Rh).x, hy = L.seen && Rh.seen ? (L.y + Rh.y) / 2 : (L.seen ? L : Rh).y;
        return { src: "hands", uR: (hx - 0.5) * (innerWidth / innerHeight) / 0.34, v: -(hy - 0.3) / 0.34, w: null };
      }
      if (BP.mouse && G.swing) return { src: "mouse", th: G.swing.backAmt * 150 };
      return null;
    }
    function update(now, rdt) {
      const t = now / 1e3, r = read(now);
      let th = st.th, yaw = st.yaw;
      if (r && r.src === "mouse") {
        th = r.th;
        yaw = 0.55 * th;
        st.src = "mouse";
      } else if (r) {
        st.src = r.src;
        st.raw = r;
        const low = r.v < -0.55;
        if (low && Math.abs(r.uR) < 0.9) {
          st.r0 += 0.05 * (clamp(-r.v, 0.6, 2.2) - st.r0);
          if (r.w !== null) st.wAddr = st.wAddr === null ? r.w : st.wAddr + (1 - Math.exp(-rdt * 4)) * (r.w - st.wAddr);
        }
        if (r.w !== null && r.w < 0.9 && r.v > -1.6) {
          st.w0 = clamp(Math.max(st.w0 * (1 - 2e-3 * rdt * 60), r.w), 0.45, 0.85);
        }
        const lift = r.v + st.r0;
        if (lift < 0.3) {
          st.lowT += rdt;
          if (st.high && st.dir === 1) {
            st.dir = -1;
            st.high = 0;
          }
          if (st.lowT > 0.35) st.dir = 1;
        } else st.lowT = 0;
        if (lift > 0.6) st.high = 1;
        const gsw = G.state === "address" && G.swing ? G.swing.phase : "";
        if (gsw === "back") {
          st.dir = 1;
          st.high = 1;
        } else if (gsw === "follow") {
          st.dir = -1;
          st.high = 0;
        }
        const ac = (x) => Math.acos(clamp(x, -1, 1)) * 180 / Math.PI;
        const sideOn = st.wAddr === null ? 0 : clamp((ac(st.wAddr / st.w0) - 30) / 30);
        st.side += (1 - Math.exp(-rdt * 6)) * (sideOn - st.side);
        const thFace = Math.atan2(r.uR, -r.v) * 180 / Math.PI;
        const thSide = st.dir * ac(-r.v / Math.max(0.6, st.r0));
        let want = r.src === "hands" ? st.dir * Math.abs(thFace) : st.side > 0.5 ? thSide : thFace;
        if (Math.abs(want) > 175) want = Math.sign(want) * 175;
        th = st.th + wrapDeg(want - st.th) * (1 - Math.exp(-rdt * 24));
        const fromSwing = Math.min(100, 0.62 * Math.abs(th));
        let mag = fromSwing;
        if (r.w !== null && st.wAddr !== null) {
          const wm = Math.abs(ac(r.w / st.w0) - ac(st.wAddr / st.w0));
          mag = Math.max(Math.min(100, wm), fromSwing);
        }
        const sgn = Math.abs(th) > 12 ? Math.sign(th) : Math.abs(r.uR) > 0.3 ? Math.sign(r.uR) : Math.sign(st.yaw || 1);
        yaw = st.yaw + (sgn * mag - st.yaw) * (1 - Math.exp(-rdt * 20));
      } else {
        th = st.th * Math.exp(-rdt * 2);
        yaw = st.yaw * Math.exp(-rdt * 2);
        st.src = "none";
      }
      st.th = clamp(th, -185, 185);
      st.yaw = clamp(yaw, -110, 110);
      st.hist.push({ t, th: st.th, yaw: st.yaw });
      while (st.hist.length && t - st.hist[0].t > 3) st.hist.shift();
      let sth = st.th, syaw = st.yaw;
      if (st.replay) {
        const R0 = st.replay;
        R0.pt += rdt * (G.timeScale < 0.95 ? G.timeScale : 2.2);
        if (R0.pt >= t - 0.02 || !st.hist.length) st.replay = null;
        else {
          const h = st.hist.find((e) => e.t >= R0.pt) || st.hist[st.hist.length - 1];
          sth = h.th;
          syaw = h.yaw;
        }
      } else if (st.script) {
        const S = st.script;
        S.k += rdt * (G.timeScale < 0.95 ? G.timeScale : 1) / 0.55;
        const k = smooth(clamp(S.k));
        sth = lerp(S.th0, -160, k);
        syaw = lerp(S.yaw0, -85, k);
        if (S.k > 1 && st.src !== "mouse" && st.src !== "none" && Math.abs(st.th - sth) < 40) st.script = null;
        if (S.k > 4) st.script = null;
      }
      pose(sth, syaw);
      st.shownTh = sth;
      st.shownYaw = syaw;
    }
    const toRad = Math.PI / 180;
    function pose(thDeg, yawDeg) {
      const th = thDeg * toRad, yaw = yawDeg * toRad;
      const thru = clamp(-thDeg / 150), back = clamp(thDeg / 150);
      const fin = smooth(clamp((-thDeg - 80) / 80));
      const pelvisYaw = yaw * 0.45 + fin * -0.5;
      const pel = PELVIS0.clone().add(V(0, 0.02 * fin, -0.07 * thru + 0.03 * back));
      const spine = spineAt(SPINE_TILT * (1 - 0.55 * fin));
      const S = pel.clone().addScaledVector(spine, SPINE);
      const shRight = RT.clone().applyAxisAngle(spine, -yaw), chestFwd = new Vector3().crossVectors(shRight, spine).negate().normalize();
      const lSh = S.clone().addScaledVector(shRight, -0.19).addScaledVector(spine, -0.03), rSh = S.clone().addScaledVector(shRight, 0.19).addScaledVector(spine, -0.03);
      const hands = S0.clone().add(pel).sub(PELVIS0).addScaledVector(D, RR * Math.cos(th)).addScaledVector(RT, RR * Math.sin(th));
      const hinge = Math.sign(th) * (Math.PI / 2) * smooth(clamp(Math.abs(thDeg) / 100));
      const phi = th + hinge, cd = D.clone().multiplyScalar(Math.cos(phi)).addScaledVector(RT, Math.sin(phi)).normalize();
      const hL = hands, hR = hands.clone().addScaledVector(cd, 0.085);
      const pelR = RT.clone().applyAxisAngle(UP, -pelvisYaw), pelF = new Vector3().crossVectors(UP, pelR).negate();
      const tb = S.clone().addScaledVector(spine, -0.02), tbot = pel.clone().addScaledVector(spine, 0.06);
      const ty = _a2.subVectors(tb, tbot);
      const tl = ty.length();
      ty.normalize();
      const tx = shRight.clone().addScaledVector(ty, -shRight.dot(ty)).normalize(), tz = new Vector3().crossVectors(tx, ty);
      basis(P.torso, tx, ty, tz, tbot.clone().addScaledVector(ty, tl / 2), 0.2, tl, 0.12);
      basis(P.chestCap, tx, ty, tz, tb, 0.2, 0.07, 0.12);
      basis(P.pelvis, pelR, UP, pelF.clone().negate(), pel.clone().addScaledVector(spine, 0.02), 0.17, 0.13, 0.12);
      basis(P.belt, pelR, spine, new Vector3().crossVectors(pelR, spine), pel.clone().addScaledVector(spine, 0.1), 0.165, 0.035, 0.115);
      const neckB = S.clone().addScaledVector(spine, 0.03), head = S0.clone().add(pel).sub(PELVIS0).addScaledVector(spineAt(SPINE_TILT * 1.3 * (1 - 0.6 * fin)), 0.2).add(V(0.04, 0, -0.02 * thru));
      bone(P.neck, neckB, head);
      P.head.position.copy(head);
      const gs = (window.__game || {}).state, watch = (gs === "flight" || gs === "result" || gs === "replay") && ball.visible ? ball.position : V(0, 0, 0);
      const look = watch.clone().sub(head).normalize();
      const hz = look, hx = new Vector3().crossVectors(UP, hz).normalize(), hy = new Vector3().crossVectors(hz, hx);
      _m.makeBasis(hx, hy, hz);
      _q2.setFromRotationMatrix(_m);
      P.cap.position.copy(head).addScaledVector(hy, 0.01);
      P.cap.quaternion.copy(_q2);
      P.brim.position.copy(head).addScaledVector(hz, 0.075).addScaledVector(hy, 0.03);
      P.brim.quaternion.copy(_q2);
      const poleL = V(0, -1, 0).addScaledVector(chestFwd, -0.3).addScaledVector(shRight, -0.3), poleR = V(0, -1, 0).addScaledVector(chestFwd, -0.2).addScaledVector(shRight, 0.4);
      const eL = ik(lSh, hL, 0.3, 0.3, poleL), eR = ik(rSh, hR, 0.3, 0.29, poleR);
      bone(P.uaL, lSh, eL);
      bone(P.faL, eL, hL);
      bone(P.uaR, rSh, eR);
      bone(P.faR, eR, hR);
      P.shL.position.copy(lSh);
      P.shR.position.copy(rSh);
      P.elL.position.copy(eL);
      P.elR.position.copy(eR);
      P.hL.position.copy(hL);
      P.hR.position.copy(hR);
      const hipL = pel.clone().addScaledVector(pelR, -0.1).addScaledVector(UP, -0.05), hipR = pel.clone().addScaledVector(pelR, 0.1).addScaledVector(UP, -0.05);
      const fL = V(GX + 0.02, 0.09, -0.27), fR = V(GX + 0.02, 0.09 + 0.05 * fin, 0.27 - 0.03 * fin);
      const kL = ik(hipL, fL, 0.43, 0.43, V(1, 0.1, -0.15)), kR = ik(hipR, fR, 0.43, 0.43, V(1, 0.1, 0.1).add(V(0, 0, -1.3 * fin)));
      bone(P.thL, hipL, kL);
      bone(P.snL, kL, fL);
      bone(P.thR, hipR, kR);
      bone(P.snR, kR, fR);
      P.knL.position.copy(kL);
      P.knR.position.copy(kR);
      P.ftL.position.set(fL.x + 0.07, 0.07, fL.z - 0.02);
      P.ftL.rotation.set(0, 0.25, Math.PI / 2);
      P.ftR.position.set(fR.x + 0.07, 0.07 + 0.03 * fin, fR.z);
      P.ftR.rotation.set(0, -0.1 + 0.6 * fin, Math.PI / 2 + 0.5 * fin);
      const butt = hL.clone().addScaledVector(cd, -0.07), tip = hL.clone().addScaledVector(cd, CLUB);
      bone(P.grip, butt, hL.clone().addScaledVector(cd, 0.2));
      bone(P.shaft, hL.clone().addScaledVector(cd, 0.15), tip);
      const toe = F.clone().addScaledVector(cd, -F.dot(cd)).normalize();
      const face = new Vector3().crossVectors(toe, cd).normalize(), up2 = new Vector3().crossVectors(face, toe);
      basis(P.club, toe, up2, face, tip.clone().addScaledVector(toe, 0.03), 0.06, 0.03, 0.042);
      st.handsW = hL;
      st.clubTip = tip;
    }
    pose(0, 0);
    return {
      grp,
      update,
      st,
      M,
      CLUB,
      color(col) {
        const h = {};
        new Color(col).getHSL(h);
        M.shirt.color.setHSL(h.h, 0.8, 0.42);
        M.cap.color.setHSL(h.h, 0.5, 0.16);
      },
      strike(tImpact) {
        const hasHist = st.src === "camera" || st.src === "hands";
        if (hasHist && tImpact && st.hist.length && st.hist[0].t <= tImpact) {
          st.replay = { pt: tImpact };
          st.script = null;
        } else {
          st.script = { k: 0, th0: Math.min(st.th, 10), yaw0: Math.min(st.yaw, 10) };
          st.replay = null;
        }
      },
      info() {
        var _a3, _b3;
        return {
          src: st.src,
          thetaDeg: Math.round((_a3 = st.shownTh) != null ? _a3 : st.th),
          turnDeg: Math.round((_b3 = st.shownYaw) != null ? _b3 : st.yaw),
          liveTheta: Math.round(st.th),
          side: +st.side.toFixed(2),
          replay: !!st.replay,
          script: !!st.script,
          hands: st.handsW && [+st.handsW.x.toFixed(2), +st.handsW.y.toFixed(2), +st.handsW.z.toFixed(2)],
          club: st.clubTip && [+st.clubTip.x.toFixed(2), +st.clubTip.y.toFixed(2), +st.clubTip.z.toFixed(2)]
        };
      }
    };
  })();
  const RIM = { uSunV: { value: new Vector3() }, uRimC: { value: new Color(1, 0.6, 0.34).multiplyScalar(+(QS.get("rim") || 1.4)) } };
  for (const m of new Set(Object.values(AV.M))) {
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, RIM);
      sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nuniform vec3 uSunV, uRimC;").replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n        { vec3 vv = normalize(vViewPosition); float fres = pow(1.0 - clamp(dot(normal, vv), 0.0, 1.0), 2.6);\n          float back = clamp(-uSunV.z * 0.9 + 0.15, 0.0, 1.0), facing = clamp(dot(normal, uSunV) * 0.6 + 0.45, 0.0, 1.0);\n          totalEmissiveRadiance += uRimC * fres * back * facing * mix(0.6, 1.0, diffuseColor.g); }");
    };
    m.customProgramCacheKey = () => "rim";
    m.needsUpdate = true;
  }
  const FACE = { X: 0.85, Z: 0.1, D: +(QS.get("fd") || 2.5), A: +(QS.get("fa") || 40), H: 1.2, PITCH: -7 };
  const FIGCAM = { position: new Vector3(0, FACE.H, FACE.D + FACE.X) };
  function faceSpot(s) {
    const a = FACE.A * Math.PI / 180;
    return new Vector3(-s * Math.cos(a) * FACE.X - s * Math.sin(a) * FACE.Z, 0, -Math.sin(a) * FACE.X + Math.cos(a) * FACE.Z);
  }
  function faceCamFor(s, aspect, out = { pos: new Vector3(), look: new Vector3(), fov: 44 }) {
    const G2 = faceSpot(s), a = FACE.A * Math.PI / 180, D2R = Math.PI / 180;
    out.pos.set(s * FACE.D * Math.cos(a), FACE.H, FACE.D * Math.sin(a));
    const yaw = (x, z) => Math.atan2(x - out.pos.x, -(z - out.pos.z));
    const dG = Math.hypot(G2.x - out.pos.x, G2.z - out.pos.z), yG = yaw(G2.x, G2.z), mG = Math.atan(1.25 / dG);
    const far = [[-17, -104], [8, -80], [7, -210], [-5, -45]].map(([x, z]) => yaw(x, z));
    const gb = yG - s * mG, tb = s > 0 ? Math.max(...far) + 4 * D2R : Math.min(...far) - 4 * D2R;
    let half = Math.abs(tb - gb) / 2, c = (tb + gb) / 2;
    const vMax = 64 * D2R, hMax = Math.atan(Math.tan(vMax / 2) * aspect);
    if (half > hMax) {
      half = hMax;
      c = gb + Math.sign(tb - gb) * hMax;
    }
    out.fov = Math.max(40, 2 * Math.atan(Math.tan(half) / aspect) / D2R);
    const p = FACE.PITCH * D2R;
    out.look.set(out.pos.x + Math.sin(c) * Math.cos(p) * 10, out.pos.y + Math.sin(p) * 10, out.pos.z - Math.cos(c) * Math.cos(p) * 10);
    return out;
  }
  function facePlace(plane, hipLocalX, s, camPos) {
    const G2 = faceSpot(s), th = Math.atan2(camPos.x - G2.x, camPos.z - G2.z);
    plane.scale.x = -1;
    plane.rotation.set(0, th, 0);
    plane.position.x = G2.x + Math.cos(th) * hipLocalX;
    plane.position.z = G2.z - Math.sin(th) * hipLocalX;
    plane.updateMatrixWorld(true);
  }
  const BALL_HEAD = new Vector3(0, 0.057, 0.066);
  function faceClubPose(st, B, base, plane, hand, rdt, atBall, phase, rise) {
    const s = hand === "R" ? 1 : -1, tr = -s;
    const lead = hand === "R" ? "l" : "r", two = B.lP && B.rP && Math.hypot(B.lP[0] - B.rP[0], B.lP[1] - B.rP[1]) < 0.28;
    const gp = two ? [(B.lP[0] + B.rP[0]) / 2, (B.lP[1] + B.rP[1]) / 2] : B[lead + "P"];
    const py = plane.position.y, Gw = plane.localToWorld(new Vector3(gp[0] - base, gp[1] - py, 0.02));
    const heel = new Vector3(-s * 0.04, 0.025, 0), Tt = BALL_HEAD.clone().add(heel);
    if (!st.e2) {
      st.e2 = Gw.clone().sub(Tt).normalize();
      st.L = 1.05;
      st.gy0 = gp[1];
      st.hMax = 0;
    }
    if (atBall) {
      const v = Gw.clone().sub(Tt);
      st.L = clamp(v.length(), 0.8, 1.25);
      st.e2.copy(v.normalize());
      st.gy0 = gp[1];
      st.hMax = 0;
    }
    const e2 = st.e2, e1 = new Vector3(0, 0, -s);
    e1.addScaledVector(e2, -e1.dot(e2)).normalize();
    const lift = gp[1] - st.gy0, r = rise != null ? rise : clamp(lift / 0.36), up = smooth(clamp(r));
    let turn = 0;
    if (phase === "back") {
      st.hMax = Math.max(st.hMax, up);
      turn = st.hMax;
    } else if (phase === "down") turn = Math.min(st.hMax, smooth(clamp(r / 0.55)));
    else if (phase === "follow") turn = -up;
    const psi = -Math.PI / 2 + tr * turn * (200 * Math.PI / 180);
    const dir = e1.clone().multiplyScalar(Math.cos(psi)).addScaledVector(e2, Math.sin(psi));
    const q = new Quaternion().setFromAxisAngle(new Vector3().crossVectors(e1, e2).normalize(), psi + Math.PI / 2);
    const tip = Gw.clone().addScaledVector(dir, st.L), head = tip.clone().sub(heel.clone().applyQuaternion(q));
    st.dbg = [+lift.toFixed(2), phase, +turn.toFixed(2), +(psi * 57.3).toFixed(0), atBall ? 1 : 0];
    return { grip: Gw, butt: Gw.clone().addScaledVector(dir, -0.06), gEnd: Gw.clone().addScaledVector(dir, 0.2), tip, head, q, dir };
  }
  const FIGS = {}, CLUBS = {};
  function makeClub() {
    const g = new Group();
    scene.add(g);
    g.visible = false;
    const std = (c, r, m) => new MeshStandardMaterial({ color: c, roughness: r, metalness: m, envMapIntensity: 1 });
    const cyl = (r0, r1, m) => {
      const o = new Mesh(new CylinderGeometry(r1, r0, 1, 12, 1), m);
      o.castShadow = true;
      g.add(o);
      return o;
    };
    const shaft = cyl(75e-4, 45e-4, std(14278114, 0.25, 1)), grip = cyl(0.014, 0.011, std(1447450, 0.9, 0));
    const head = new Mesh(new SphereGeometry(1, 20, 12), std(1974310, 0.3, 0.8));
    head.castShadow = true;
    g.add(head);
    return { g, shaft, grip, head, st: {} };
  }
  const _ca = new Vector3(), _UP = new Vector3(0, 1, 0);
  function boneTo(o, a, b) {
    _ca.subVectors(b, a);
    const L = _ca.length() || 1e-4;
    o.position.addVectors(a, b).multiplyScalar(0.5);
    o.scale.set(1, L, 1);
    o.quaternion.setFromUnitVectors(_UP, _ca.divideScalar(L));
  }
  const wrapA = (a) => Math.atan2(Math.sin(a), Math.cos(a));
  function updateClub(hand, rdt, on, atBall) {
    const fig = FIGS[hand], C = CLUBS[hand], B = fig.pose;
    C.g.visible = !!(on && B && fig.opacity > 0.25);
    if (!C.g.visible) return;
    const S = G.swing, rise = S && S.addr && HP.seen && !BP.mouse ? clamp((S.addr.y - HP.y) / 0.3) : void 0;
    const P = faceClubPose(C.st, B, C.base, fig.plane, hand, rdt, atBall, S ? S.phase : "idle", rise);
    boneTo(C.grip, P.butt, P.gEnd);
    boneTo(C.shaft, P.gEnd, P.tip);
    C.head.position.copy(P.head);
    C.head.quaternion.copy(P.q);
    C.head.scale.set(0.06, 0.032, 0.055);
    C.tipW = [P.head.x, P.head.y, P.head.z];
    C.dbg = C.st.dbg;
  }
  const HAND = { cur: "R", manual: false };
  try {
    const v = JSON.parse(localStorage.golf_hand || "null");
    if (v && (v.h === "R" || v.h === "L")) HAND.cur = v.h;
  } catch (_) {
  }
  for (const h of ["R", "L"]) {
    FIGS[h] = create({
      scene,
      camera: FIGCAM,
      BP,
      view: "mirror",
      depthMin: -0.5,
      x: 0,
      z: 0,
      tier: state().quality.tier,
      gloves: false,
      props: {},
      stepRange: 0.15,
      alpha: 0.5,
      outfit: { style: "golf", glove: h === "R" ? "l" : "r" }
    });
    CLUBS[h] = makeClub();
    FIGS[h].objects[3].rotation.z = Math.PI / 2;
  }
  function stanceReader({ start = "R" } = {}) {
    const S = {
      hand: start,
      score: start === "R" ? 0.4 : -0.4,
      at: 0,
      frame: 0,
      prevH: null,
      cand: null,
      addr: null,
      bs: null,
      pending: 0,
      swings: 0,
      side: false,
      why: "",
      lat: 0,
      last: null,
      phi: void 0,
      phiU: 0,
      look: { v: 0, t: 0 },
      lookZ: 0,
      lookTurn: 0,
      evidence: 0,
      unsure: false,
      squareAt: -1e9
    };
    const mid = (a, b) => a.map((v, k) => (v + b[k]) / 2);
    const clamp1 = (v) => Math.max(-1, Math.min(1, v)), unit = (v) => {
      const n = Math.hypot(v[0], v[1]);
      return n > 1e-6 ? [v[0] / n, v[1] / n] : null;
    };
    return {
      S,
      get hand() {
        return S.hand;
      },
      set(h) {
        S.hand = h;
        S.score = h === "R" ? 0.4 : -0.4;
        S.pending = 0;
      },
      // call once per frame; returns 'R' or 'L'. frozen: true while a swing or a shot is running (it watches, never changes)
      update(BP2, now, frozen) {
        const I = BP2.img, J = BP2.rawJ || BP2.joints;
        if (!I || !I.lShoulder || !I.rShoulder || !I.lHip || !I.rHip || !I.lHand || !I.rHand || now - (BP2.imgAt || 0) > 400) {
          S.at = now;
          S.prevH = null;
          return S.hand;
        }
        if (BP2.imgAt !== S.frame) {
          S.frame = BP2.imgAt;
          const dt = Math.min(0.2, Math.max(0, (now - (S.at || now)) / 1e3));
          S.at = now;
          const c = mid(I.lShoulder, I.rShoulder), hp = mid(I.lHip, I.rHip), T = Math.max(0.03, Math.hypot(c[0] - hp[0], c[1] - hp[1]));
          const h0 = mid(I.lHand, I.rHand), sep = Math.hypot(I.lHand[0] - I.rHand[0], I.lHand[1] - I.rHand[1]) / T;
          const h = S.prevH ? [S.prevH[0] + (h0[0] - S.prevH[0]) * Math.min(1, dt / 0.08), S.prevH[1] + (h0[1] - S.prevH[1]) * Math.min(1, dt / 0.08)] : h0;
          const speed = S.prevH ? Math.hypot(h[0] - S.prevH[0], h[1] - S.prevH[1]) / T / Math.max(0.016, dt) : 9;
          S.prevH = h;
          const down = (h[1] - c[1]) / T, hr = [h[0] - hp[0], h[1] - hp[1]];
          let F = null, hz = 0, flip = 1;
          if (J && J.lShoulder && J.rShoulder && J.lHip && J.rHip && J.lHand && J.rHand) {
            const c3 = mid(J.lShoulder, J.rShoulder), hp3 = mid(J.lHip, J.rHip), T3 = Math.max(0.15, Math.hypot(c3[0] - hp3[0], c3[1] - hp3[1], c3[2] - hp3[2]));
            hz = (J.lHand[2] + J.rHand[2]) / 2 / T3;
            const sa = [J.lShoulder[0] - J.rShoulder[0], J.lShoulder[2] - J.rShoulder[2]], ha = [J.lHip[0] - J.rHip[0], J.lHip[2] - J.rHip[2]];
            const ax = sa[0] * ha[0] + sa[1] * ha[1] >= 0 ? [sa[0] + ha[0], sa[1] + ha[1]] : [sa[0] - ha[0], sa[1] - ha[1]];
            let f = unit([-ax[1], ax[0]]);
            const nose = J.head ? [J.head[0] - c3[0], J.head[2] - c3[2]] : null;
            if (f && nose && Math.hypot(nose[0], nose[1]) / T3 > 0.12) {
              if (f[0] * nose[0] + f[1] * nose[1] < 0) {
                f = [-f[0], -f[1]];
                flip = -1;
              }
            } else if (f && f[1] < 0) {
              f = [-f[0], -f[1]];
              flip = -1;
            }
            F = f;
            const nn = nose ? Math.hypot(nose[0], nose[1]) : 0;
            S.lookZ = nose ? nose[1] / T3 : 0;
            S.lookTurn = f && nn / T3 > 0.12 ? (-f[1] * nose[0] + f[0] * nose[1]) / nn : 0;
            const phi = Math.atan2(sa[1], sa[0]);
            if (S.phi === void 0) S.phiU = 0;
            else {
              let d = phi - S.phi;
              d -= Math.PI * Math.round(d / Math.PI);
              S.phiU += d;
            }
            S.phi = phi;
          }
          S.side = !!F && Math.abs(F[0]) > 0.85;
          const lowStill = down > 0.45 && sep < 0.6 && speed < 0.8;
          if (lowStill) {
            const C = S.cand && now - S.cand.last < 300 && Math.hypot(h[0] - S.cand.x, h[1] - S.cand.y) / S.cand.T < 0.15 ? S.cand : S.cand = { x: h[0], y: h[1], rx: hr[0], ry: hr[1], z: hz, T, F, flip, phi: S.phiU || 0, dur: 0, last: now };
            const k = Math.min(1, dt * 5);
            C.x += (h[0] - C.x) * k;
            C.y += (h[1] - C.y) * k;
            C.rx += (hr[0] - C.rx) * k;
            C.ry += (hr[1] - C.ry) * k;
            C.z += (hz - C.z) * k;
            C.T += (T - C.T) * k;
            if (F) C.F = C.F ? unit([C.F[0] + (F[0] - C.F[0]) * k, C.F[1] + (F[1] - C.F[1]) * k]) || F : F;
            C.dur += dt;
            C.last = now;
            C.phi = S.phiU || 0;
            C.flip = flip;
            if (I.lFoot && I.rFoot) C.feet = [I.lFoot[0], I.lFoot[1], I.rFoot[0], I.rFoot[1]];
            if (C.dur >= 0.3 && S.addr !== C && !(S.bs && S.bs.top >= 0.3)) {
              S.addr = C;
              S.bs = null;
            }
            const v = C.F ? -Math.sign(C.F[0]) : 0;
            if (!frozen && !S.swings && S.addr === C && Math.abs(C.F[0]) > 0.85 && sep < 0.45 && C.dur > 0.5 && S.score * v < 0.25)
              S.score = clamp1(S.score + (0.25 * v - S.score) * Math.min(1, dt));
            const cue = S.addr === C && C.F && Math.abs(C.F[0]) > 0.6 && S.lookZ > 0.3 && Math.abs(S.lookTurn) > 0.4 && sep < 0.45 && Math.sign(S.lookTurn) === Math.sign(C.F[0]) ? S.lookTurn < 0 ? 1 : -1 : 0;
            if (cue && cue === S.look.v) S.look.t += dt;
            else S.look = { v: cue, t: 0 };
            if (!frozen && cue && S.look.t >= 1 && (cue > 0 ? S.score < 0.6 : S.score > -0.6)) {
              const was = S.score;
              S.score = 0.7 * cue;
              S.evidence++;
              if (Math.sign(was) !== cue) S.why = "standing " + (cue > 0 ? "righty" : "lefty") + " (head turned to the TV on his " + (cue > 0 ? "left" : "right") + ")";
            }
            if (C.F && Math.abs(C.F[0]) < 0.6 && C.dur > 0.5) S.squareAt = now;
          }
          const A = S.addr;
          if (A && (S.bs || now - A.last < 1e3)) {
            const rise = (A.ry - hr[1]) / A.T, away = Math.hypot(hr[0] - A.rx, hr[1] - A.ry) / A.T;
            const Fa = A.F || [0, 1], R = [-Fa[1], Fa[0]];
            const lat = R[0] * (hr[0] - A.rx) / A.T + R[1] * (hz - A.z);
            const turn = A.flip * ((S.phiU || 0) - A.phi);
            if (!S.bs && away > 0.15 && !lowStill) S.bs = { t0: now, top: -9, latTop: 0, lat: 0, turnTop: 0, sepSum: 0, n: 0, foot: 0 };
            const B = S.bs;
            if (B) {
              if (rise > B.top) {
                B.top = rise;
                B.latTop = lat;
                B.turnTop = turn;
              }
              if (rise <= 1.3) {
                B.sepSum += sep;
                B.n++;
              }
              if (A.feet && I.lFoot && I.rFoot) {
                const d = (p, q) => Math.hypot(p[0] - A.feet[q], p[1] - A.feet[q + 1]);
                if (Math.min(Math.max(d(I.lFoot, 0), d(I.rFoot, 2)), Math.max(d(I.lFoot, 2), d(I.rFoot, 0))) / A.T > 1 && ++B.foot >= 4) B.stepped = true;
              }
              if (rise >= 0.2 && rise <= 1.3 && rise >= B.top - 0.05 && Math.abs(lat) > Math.abs(B.lat)) B.lat = lat;
              if (B.top < 0.3 && away < 0.12) S.bs = null;
              else if ((B.downT = rise < B.top - 0.3 && sep < 0.6 ? (B.downT || 0) + dt : sep < 0.6 ? 0 : B.downT || 0) > 0.08 || now - B.t0 > 2e3) {
                if ((B.top < 0.4 || now - B.t0 < 250) && now - B.t0 <= 2e3) {
                  S.bs = null;
                } else if (B.top >= 0.4 && now - B.t0 <= 2e3 && B.sepSum / Math.max(1, B.n) < 0.6 && !B.stepped) {
                  const L = B.lat, Tn = B.turnTop;
                  S.lat = +L.toFixed(2);
                  S.swings++;
                  S.last = { top: +B.top.toFixed(2), atTop: +B.latTop.toFixed(2), turn: Math.round(Tn * 57.3), F: Fa.map((v) => +v.toFixed(2)) };
                  const where = Math.abs(Fa[0]) > 0.7 ? " (side-on)" : Fa[1] < -0.7 ? " (from behind)" : "";
                  if (Math.abs(L) >= 0.2) {
                    S.pending = clamp1(S.pending + Math.sign(L) * Math.min(1, Math.abs(L) / 0.4));
                    S.why = "backswing to his " + (L > 0 ? "right" : "left") + where;
                  } else if (Math.abs(L) >= 0.08 && Math.sign(Tn) === Math.sign(L) && Math.abs(Tn) > 0.25) {
                    S.pending = clamp1(S.pending + 0.5 * Math.sign(L));
                    S.why = "backswing to his " + (L > 0 ? "right" : "left") + ", with the turn" + where;
                  }
                }
                if (S.bs) {
                  S.addr = null;
                  S.bs = null;
                  S.cand = null;
                }
              }
            }
          } else if (A) {
            S.addr = null;
            S.bs = null;
          }
        }
        if (!frozen && S.pending) {
          S.score = clamp1(S.score + 0.8 * S.pending);
          S.pending = 0;
          S.evidence++;
        }
        S.unsure = !S.evidence && now - S.squareAt < 3e3;
        if (!frozen) {
          if (S.hand === "R" && S.score < -0.3) S.hand = "L";
          else if (S.hand === "L" && S.score > 0.3) S.hand = "R";
        }
        return S.hand;
      }
    };
  }
  const STANCE = stanceReader({ start: HAND.cur });
  let RGOLF = null, REAL = QS.get("body") !== "fig";
  const realOff = (why) => {
    console.warn("realbody golfer off:", why);
    RGOLF = null;
    REAL = false;
    aimCams();
    lastPlant = "";
    cam.prev = "";
  };
  if (REAL) import("../realgolf.js").then((m) => {
    RGOLF = m.create({ scene, BP, tier: state().quality.tier, ball: new Vector3(0, TEE_Y, 0), ground: 0.025, lefty: () => HAND.cur === "L", onFallback: realOff, plainLook: { fillA: 0.025, rimA: 0.2, rimPow: 2 } });
    aimCams();
  }).catch(realOff);
  function setHand(h, manual) {
    if (manual !== void 0) {
      HAND.manual = manual;
    }
    const changed = h !== HAND.cur;
    HAND.cur = h;
    STANCE.set(h);
    try {
      localStorage.golf_hand = JSON.stringify({ h, manual: HAND.manual });
    } catch (_) {
    }
    TB.mirror(h === "L");
    AV.grp.scale.x = h === "L" ? -1 : 1;
    for (const k of ["R", "L"]) {
      FIGS[k].plane.visible = k === h;
      for (const o of FIGS[k].objects) o.visible = k === h && o !== FIGS[k].sprites.l && o !== FIGS[k].sprites.r;
    }
    const lbl = h === "R" ? "RIGHT-HANDED" : "LEFT-HANDED";
    document.body.classList.toggle("golf-lefty", h === "L");
    const e1 = document.getElementById("handLbl"), e2 = document.getElementById("handSub");
    if (e1) e1.textContent = lbl + " · hold to start";
    if (e2) e2.textContent = h === "R" ? "to left-handed" : "to right-handed";
    if (changed && typeof onHandChanged === "function") onHandChanged();
  }
  const clock = { t: 0 };
  const greenH = (r) => clamp(r * 0.012, 0.1, 0.28), greenOut = (r) => r * 1.12 + Math.max(2.5, r * 0.3);
  function greenLift(T, x, z) {
    const d = Math.hypot(x - T.x, z - T.z);
    if (T.mover) return d < T.r ? 0.12 : 0;
    return greenH(T.r) * (1 - smooth(clamp((d - T.r * 0.96) / (greenOut(T.r) - T.r * 0.96))));
  }
  function surfaceY(x, z) {
    let h = 0;
    for (const T of TARGETS) if (T.active) {
      const dx = Math.abs(x - T.x), dz = Math.abs(z - T.z), o = T.mover ? T.r : greenOut(T.r);
      if (dx < o && dz < o) h = Math.max(h, greenLift(T, x, z));
    }
    return h;
  }
  function greenMaterial(T, paint, outR) {
    const m = pbr("grass_ground", { repeat: [1, 1], normalScale: 0.55 });
    m.transparent = true;
    m.envMapIntensity = 0.85;
    m.userData.u = {
      uGrass: { value: TURF.green },
      uFair: { value: TURF.fair },
      uC: { value: new Vector2(T.x, T.z) },
      uR: { value: T.r },
      uPaint: { value: paint },
      uFlash: { value: 0 },
      uLine: { value: Math.max(0.32, T.r * 0.034) },
      uOut: { value: outR },
      uGlow: { value: 1 }
    };
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, m.userData.u);
      sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vWP;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvWP = (modelMatrix * vec4(transformed, 1.0)).xyz;");
      sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec3 vWP; uniform vec3 uGrass, uFair, uPaint; uniform vec2 uC; uniform float uR, uFlash, uLine, uOut, uGlow;").replace("#include <map_fragment>", "\n        vec2 rel = vWP.xz - uC; float dC = length(rel), rho = dC / uR;\n        vec3 tx = texture2D(map, vWP.xz * 0.9).rgb, txF = texture2D(map, vWP.xz * 0.38).rgb;\n        float l = dot(tx, vec3(0.2126, 0.7152, 0.0722)), lF = dot(txF, vec3(0.2126, 0.7152, 0.0722));\n        float m1 = dot(texture2D(map, vWP.xz * 0.05 + 0.4).rgb, vec3(0.333));\n        vec3 gr = uGrass * mix(1.0, l / 0.16, 0.45) * (0.92 + 1.1 * (m1 - 0.16));              // short, even putting-green grass\n        vec2 cb = step(0.5, fract(vWP.xz / 2.8)); gr *= 1.0 + mix(-0.055, 0.055, abs(cb.x - cb.y)); // mowed in a checker\n        vec3 collar = uGrass * 0.74 * (lF / 0.16), fair = uFair * (lF / 0.16);\n        float fr = smoothstep(0.995, 1.015, rho), fw = smoothstep(1.12, 1.12 + 1.5 / uR, rho);\n        vec3 g = mix(gr, mix(collar, fair, fw), fr);\n        float w = uLine / uR, aa = fwidth(rho) * 1.3, bpRing = 0.0;\n        bpRing = max(bpRing, 1.0 - smoothstep(w * 0.5 - aa, w * 0.5 + aa, abs(rho - 0.25)));\n        bpRing = max(bpRing, 1.0 - smoothstep(w * 0.5 - aa, w * 0.5 + aa, abs(rho - 0.6)));\n        bpRing = max(bpRing, 1.0 - smoothstep(w * 0.5 - aa, w * 0.5 + aa, abs(rho - 0.985)));\n        g = mix(g, uPaint * (0.85 + 0.3 * l / 0.16), bpRing * 0.92);                          // turf paint (a little of the grass shows through)\n        diffuseColor.rgb *= max(g, 0.0);\n        diffuseColor.a *= 1.0 - smoothstep(uOut * 0.84, uOut, dC);\n      ").replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n        totalEmissiveRadiance += uPaint * (bpRing * (0.22 + 1.4 * uFlash) + 0.05 * uGlow * exp(-abs(rho - 1.06) * uR * 0.9));").replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nroughnessFactor = 0.8;").replace("#include <lights_fragment_end>", "#include <lights_fragment_end>\nreflectedLight.indirectSpecular *= 0.3;").replace("#include <normal_fragment_maps>", "\n        vec3 mapN = texture2D(normalMap, vWP.xz * 0.9).xyz * 2.0 - 1.0; mapN.xy *= normalScale; normal = normalize(normal + (tbn * mapN - tbn[2]) * 0.6);");
    };
    m.customProgramCacheKey = () => "green";
    return m;
  }
  const flagGeo = new PlaneGeometry(1.2, 0.8, 30, 8);
  flagGeo.translate(0.6, 0, 0);
  const FLAG_U = { uT: { get value() {
    return clock.t;
  } }, uW: { value: 0.5 }, uSun: { value: sunDir } };
  function flagMaterial(col) {
    const m = new MeshStandardMaterial({ color: col, roughness: 0.72, side: DoubleSide, envMapIntensity: 0.8 });
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, FLAG_U);
      const wave = "float k = position.x / 1.2, ph = position.x * 4.6 - uT * (4.5 + 5.0 * uW), A = (0.05 + 0.1 * uW) * k;\n      float ph2 = position.x * 11.0 + position.y * 4.0 - uT * (9.0 + 7.0 * uW);";
      sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nuniform float uT, uW; varying vec3 vFW;").replace("#include <beginnormal_vertex>", "".concat(wave, "\n        float dz = cos(ph) * 4.6 * A + sin(ph) * (0.05 + 0.1 * uW) / 1.2 + cos(ph2) * 11.0 * 0.016 * k;\n        vec3 objectNormal = normalize(vec3(-dz, 0.0, 1.0));")).replace("#include <begin_vertex>", "vec3 transformed = vec3(position);\n        transformed.z += sin(ph) * A + sin(ph2) * 0.016 * k;\n        transformed.x -= abs(sin(ph)) * A * 0.35;\n        transformed.y -= (1.0 - uW) * 0.14 * k * k;\n        vFW = (modelMatrix * vec4(transformed, 1.0)).xyz;");
      sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nuniform vec3 uSun; varying vec3 vFW;").replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n        float bpBack = pow(max(dot(normalize(vFW - cameraPosition), uSun), 0.0), 3.0);\n        totalEmissiveRadiance += diffuseColor.rgb * (0.12 + 0.9 * bpBack);");
    };
    m.customProgramCacheKey = () => "flag2";
    return m;
  }
  function boardTexture(text, col) {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 256;
    const g = c.getContext("2d");
    g.fillStyle = "#ecebe4";
    g.fillRect(0, 0, 512, 256);
    g.fillStyle = col;
    g.fillRect(0, 0, 512, 46);
    g.strokeStyle = "#1e3b26";
    g.lineWidth = 14;
    g.strokeRect(7, 7, 498, 242);
    g.fillStyle = "#16181a";
    g.font = "900 150px system-ui, sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(text, 226, 152);
    g.font = "800 44px system-ui, sans-serif";
    g.fillText("YDS", 432, 190);
    const gr = g.createLinearGradient(0, 0, 0, 256);
    gr.addColorStop(0, "rgba(255,255,255,0)");
    gr.addColorStop(1, "rgba(60,50,30,.18)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 512, 256);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }
  const poleMat = new MeshPhysicalMaterial({ color: 15855850, roughness: 0.3, clearcoat: 0.7, clearcoatRoughness: 0.2 });
  const ferruleMat = new MeshStandardMaterial({ color: 2105894, roughness: 0.4, metalness: 0.6 });
  const postMat = pbr("weathered_planks", { repeat: [0.08, 0.6] });
  const cupMat = new MeshBasicMaterial({ color: 328965 });
  const lampGeo = new SphereGeometry(1, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2);
  const TARGETS = [], NO_AO = [];
  function makeTarget({ name, col, dist, x, r, mult, gold = false, mover = false }) {
    const g = new Group();
    g.position.set(x, 0, -dist);
    scene.add(g);
    const color = new Color(col);
    const T = { name, col, color, dist, x0: x, x, z: -dist, r, mult, gold, mover, group: g, rings: [], top: 0, phase: Math.random() * 6, amp: mover ? 14 : 0, speed: 0.55, active: !mover };
    const paint = color.clone().lerp(new Color(1, 1, 1), gold ? 0.1 : 0.18).multiplyScalar(0.9);
    const H0 = mover ? 0.12 : greenH(r), outR = mover ? r * 2 : greenOut(r);
    T.mat = greenMaterial(T, paint, outR);
    if (!mover) {
      const geo = new RingGeometry(1e-3, outR, 160, 26).rotateX(-Math.PI / 2), p = geo.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const d = Math.hypot(p.getX(i), p.getZ(i));
        p.setY(i, H0 * (1 - smooth(clamp((d - r * 0.96) / (outR - r * 0.96)))));
      }
      geo.computeVertexNormals();
      const disc = new Mesh(geo, T.mat);
      disc.position.y = 3e-3;
      disc.receiveShadow = true;
      disc.renderOrder = -1;
      g.add(disc);
    } else {
      const side = new MeshStandardMaterial({ color: 1776928, roughness: 0.7 });
      const plat = new Mesh(new CylinderGeometry(r, r * 1.02, 0.12, 120, 1), [side, T.mat, side]);
      plat.position.y = 0.06;
      plat.receiveShadow = plat.castShadow = true;
      g.add(plat);
      T.mat.transparent = false;
    }
    const nL = Math.round(clamp(2 * Math.PI * r * 1.07 / 2.1, 16, 80)), lampS = 0.07 * (1 + dist / 80);
    const lampM = new MeshBasicMaterial({ color: color.clone().lerp(new Color(1, 0.9, 0.75), 0.45).multiplyScalar(5) });
    const lamps = new InstancedMesh(lampGeo, lampM, nL);
    for (let i = 0; i < nL; i++) {
      const a = i / nL * Math.PI * 2, rr = mover ? r * 0.97 : r * 1.07, lx = Math.cos(a) * rr, lz = Math.sin(a) * rr;
      const ly = mover ? 0.12 : H0 * (1 - smooth(clamp((rr - r * 0.96) / (outR - r * 0.96))));
      lamps.setMatrixAt(i, new Matrix4().compose(new Vector3(lx, ly + 3e-3, lz), new Quaternion(), new Vector3(lampS, lampS * 0.7, lampS)));
    }
    g.add(lamps);
    T.lamps = lamps;
    T.lampBase = lampM.color.clone();
    const cup = new Mesh(new CircleGeometry(gold ? 0.11 : 0.054, 32).rotateX(-Math.PI / 2), cupMat);
    cup.position.y = H0 + 8e-3;
    g.add(cup);
    const liner = new Mesh(new RingGeometry(gold ? 0.11 : 0.054, gold ? 0.125 : 0.062, 32).rotateX(-Math.PI / 2), new MeshStandardMaterial({ color: 15263970, roughness: 0.4 }));
    liner.position.y = H0 + 9e-3;
    g.add(liner);
    const big = 1 + dist / 70, H = (gold ? 4.6 : 4) * (0.8 + dist / 110);
    const pole = new Mesh(new CylinderGeometry(0.026 * big, 0.03 * big, H, 12), gold ? new MeshStandardMaterial({ color: 16765530, metalness: 0.9, roughness: 0.25 }) : poleMat);
    pole.position.y = H0 + H / 2;
    pole.castShadow = true;
    g.add(pole);
    const fer = new Mesh(new SphereGeometry(0.042 * big, 12, 8), ferruleMat);
    fer.position.y = H0 + H + 0.02 * big;
    g.add(fer);
    for (const by of [0.3, 0.42]) {
      const band = new Mesh(new CylinderGeometry(0.031 * big, 0.031 * big, 0.05 * big, 12), new MeshStandardMaterial({ color, roughness: 0.5 }));
      band.position.y = H0 + H * by;
      g.add(band);
    }
    const flag = new Mesh(flagGeo, flagMaterial(color));
    flag.scale.setScalar(big * 1.25);
    flag.position.set(0, H0 + H - 0.45 * big * 1.25, 0);
    flag.castShadow = true;
    g.add(flag);
    const beam = new Mesh(new CylinderGeometry(0.2 * big, 0.35 * big, 34, 24, 1, true), new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      side: DoubleSide,
      uniforms: { uCol: { value: color.clone().multiplyScalar(1.2) } },
      vertexShader: "varying float vy; varying float vd; void main(){ vy = uv.y; vec4 w = modelMatrix * vec4(position,1.0); vd = distance(w.xz, cameraPosition.xz); gl_Position = projectionMatrix * viewMatrix * w; }",
      fragmentShader: "uniform vec3 uCol; varying float vy; varying float vd; void main(){ float a = pow(1.0 - vy, 2.2) * 0.22 * smoothstep(35.0, 110.0, vd); gl_FragColor = vec4(uCol * a, a); }"
    }));
    beam.position.y = 17;
    g.add(beam);
    NO_AO.push(beam);
    if (!mover) {
      const yd = Math.round(dist * YD), tex = boardTexture(String(yd), col);
      const board = new Mesh(new BoxGeometry(1.6, 0.8, 0.05), [postMat, postMat, postMat, postMat, new MeshStandardMaterial({ map: tex, roughness: 0.45, emissive: 16777215, emissiveMap: tex, emissiveIntensity: 0.16 }), postMat]);
      board.position.set(-r * 1.25, 1, r * 0.4);
      board.castShadow = true;
      g.add(board);
      for (const sx of [-0.62, 0.62]) {
        const post = new Mesh(new BoxGeometry(0.08, 1, 0.08), postMat);
        post.position.set(-r * 1.25 + sx, 0.5, r * 0.4 - 0.05);
        post.castShadow = true;
        g.add(post);
      }
    }
    T.flag = flag;
    T.top = H0 + H + 0.3;
    g.visible = T.active;
    TARGETS.push(T);
    return T;
  }
  makeTarget({ name: "RED", col: "#ff3b3b", dist: 45, x: -5, r: 10, mult: 1 });
  makeTarget({ name: "YELLOW", col: "#ffd21f", dist: 80, x: 8, r: 13, mult: 1.5 });
  makeTarget({ name: "JACKPOT", col: "#ffb000", dist: 104, x: -17, r: 7, mult: 3, gold: true });
  makeTarget({ name: "BLUE", col: "#2f8cff", dist: 124, x: 4, r: 16, mult: 2 });
  makeTarget({ name: "PURPLE", col: "#b35cff", dist: 165, x: -7, r: 19, mult: 2.5 });
  makeTarget({ name: "WHITE", col: "#f4f4ff", dist: 210, x: 7, r: 23, mult: 3 });
  const MOVER = makeTarget({ name: "DISCO", col: "#2dffd2", dist: 140, x: 0, r: 12, mult: 3, mover: true });
  function targetPosAt(T, c) {
    return T.mover ? T.x0 + T.amp * Math.sin(T.phase + c * T.speed) : T.x0;
  }
  {
    const towerMat = new MeshStandardMaterial({ color: 3816770, roughness: 0.6, metalness: 0.6 });
    const lampMat = new MeshBasicMaterial({ color: new Color(1, 0.86, 0.62).multiplyScalar(14) });
    for (const z of [-30, -110, -190]) for (const sx of [-1, 1]) {
      const x = sx * (z === -30 ? 34 : 46), h = 15;
      const pole = new Mesh(new CylinderGeometry(0.12, 0.18, h, 10), towerMat);
      pole.position.set(x, h / 2, z);
      pole.castShadow = true;
      scene.add(pole);
      const head = new Mesh(new BoxGeometry(2.2, 0.7, 0.35), towerMat);
      head.position.set(x, h + 0.2, z);
      head.lookAt(0, 0, z - 30);
      scene.add(head);
      for (let i = 0; i < 4; i++) {
        const l = new Mesh(new CircleGeometry(0.2, 16), lampMat);
        l.position.set(-0.75 + i * 0.5, 0, 0.18);
        head.add(l);
      }
      const pool = new Mesh(new CircleGeometry(22, 48).rotateX(-Math.PI / 2), new MeshBasicMaterial({ map: radial("rgba(255,210,150,0.5)", "rgba(255,210,150,0)"), transparent: true, opacity: 0.05, depthWrite: false, blending: AdditiveBlending, polygonOffset: true, polygonOffsetFactor: -2 }));
      pool.position.set(x * 0.55, 0.01, z - 18);
      scene.add(pool);
    }
  }
  const FX = { birds: [], pollen: null };
  {
    let seed = 41;
    const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
    const steel = new MeshStandardMaterial({ color: 9212310, metalness: 0.85, roughness: 0.42 });
    const netTex = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const g = c.getContext("2d");
      g.strokeStyle = "#fff";
      g.lineWidth = 3;
      g.beginPath();
      g.moveTo(0, 1.5);
      g.lineTo(64, 1.5);
      g.moveTo(1.5, 0);
      g.lineTo(1.5, 64);
      g.stroke();
      const t = new CanvasTexture(c);
      t.wrapS = t.wrapT = RepeatWrapping;
      t.anisotropy = 8;
      return t;
    })();
    const NH = 13, zs = [7, -9, -25, -41, -57, -73];
    for (const sx of [-1, 1]) {
      const x = sx * 31;
      for (const z of zs) {
        const p = new Mesh(new CylinderGeometry(0.07, 0.11, NH + 0.6, 10), steel);
        p.position.set(x, (NH + 0.6) / 2, z);
        p.castShadow = true;
        scene.add(p);
      }
      const len = zs[0] - zs[zs.length - 1], t = netTex.clone();
      t.repeat.set(len / 0.45, NH / 0.45);
      t.needsUpdate = true;
      const net = new Mesh(new PlaneGeometry(len, NH, 1, 1), new MeshStandardMaterial({ color: 1315860, alphaMap: t, transparent: true, opacity: 0.55, side: DoubleSide, depthWrite: false, roughness: 0.9 }));
      net.rotation.y = Math.PI / 2;
      net.position.set(x, NH / 2 + 0.1, (zs[0] + zs[zs.length - 1]) / 2);
      scene.add(net);
      NO_AO.push(net);
      const pts = [];
      for (let i = 0; i <= 60; i++) {
        const z = zs[0] - i / 60 * len, u = (zs[0] - z) % 16 / 16;
        pts.push(new Vector3(x, NH + 0.1 - 0.35 * Math.sin(u * Math.PI), z));
      }
      const cable = new Mesh(new TubeGeometry(new CatmullRomCurve3(pts), 120, 0.015, 4), steel);
      scene.add(cable);
    }
    const markTex = (n) => {
      const c = document.createElement("canvas");
      c.width = c.height = 256;
      const g = c.getContext("2d");
      g.fillStyle = "#efeee8";
      g.beginPath();
      g.arc(128, 128, 124, 0, 6.283);
      g.fill();
      g.strokeStyle = "#1f3f27";
      g.lineWidth = 14;
      g.beginPath();
      g.arc(128, 128, 112, 0, 6.283);
      g.stroke();
      g.fillStyle = "#16181a";
      g.font = "900 104px system-ui, sans-serif";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(n, 128, 136);
      const t = new CanvasTexture(c);
      t.colorSpace = SRGBColorSpace;
      t.anisotropy = 8;
      return t;
    };
    for (const yd of [50, 100, 150, 200, 250]) for (const sx of [-1, 1]) {
      const z = -yd / YD, x = sx * 26, s = 1 + yd / 160, tex = markTex(String(yd));
      const disc = new Mesh(new CircleGeometry(0.5 * s, 40), new MeshStandardMaterial({ map: tex, transparent: true, alphaTest: 0.5, roughness: 0.5, emissive: 16777215, emissiveMap: tex, emissiveIntensity: 0.14 }));
      disc.position.set(x, 1.3 * s, z + 0.03);
      disc.castShadow = true;
      scene.add(disc);
      const post = new Mesh(new BoxGeometry(0.09 * s, 1.3 * s, 0.09 * s), postMat);
      post.position.set(x, 0.65 * s, z - 0.03);
      post.castShadow = true;
      scene.add(post);
    }
    {
      const N = 520, im = new InstancedMesh(new SphereGeometry(BALL_R, 10, 8), TB.rangeBall, N), m4 = new Matrix4();
      for (let i = 0; i < N; i++) {
        const d = 7 + Math.pow(rnd(), 0.8) * 150, x = (rnd() - 0.5) * (14 + d * 0.32) + (rnd() - 0.5) * 6, z = -d;
        im.setMatrixAt(i, m4.makeTranslation(x, BALL_R + surfaceY(x, z), z));
      }
      im.receiveShadow = true;
      scene.add(im);
    }
    {
      const c = document.createElement("canvas");
      c.width = 256;
      c.height = 128;
      const g = c.getContext("2d");
      const divot = (ox, sand) => {
        g.save();
        g.translate(ox + 64, 64);
        for (let i = 0; i < 160; i++) {
          const a = rnd() * 6.283, rr = Math.sqrt(rnd()), x = Math.cos(a) * rr * 52, y = Math.sin(a) * rr * 22;
          const v = sand ? 150 + rnd() * 50 : 40 + rnd() * 30;
          g.fillStyle = sand ? "rgba(".concat(v, ",").concat(v * 0.88 | 0, ",").concat(v * 0.66 | 0, ",").concat(0.5 + 0.5 * (1 - rr), ")") : "rgba(".concat(v + 14, ",").concat(v * 0.75 | 0, ",").concat(v * 0.45 | 0, ",").concat(0.45 + 0.55 * (1 - rr), ")");
          g.beginPath();
          g.ellipse(x, y, 3 + rnd() * 6, 2 + rnd() * 4, rnd() * 3, 0, 6.283);
          g.fill();
        }
        if (sand) for (let i = 0; i < 40; i++) {
          g.fillStyle = "rgba(60,110,40,".concat(0.5 * rnd(), ")");
          g.fillRect((rnd() - 0.5) * 80, (rnd() - 0.5) * 30, 2, 2);
        }
        else {
          g.strokeStyle = "rgba(70,90,40,.8)";
          g.lineWidth = 2;
          for (let i = 0; i < 30; i++) {
            const a = rnd() * 6.283;
            g.beginPath();
            g.moveTo(Math.cos(a) * 50, Math.sin(a) * 20);
            g.lineTo(Math.cos(a) * 58, Math.sin(a) * 25);
            g.stroke();
          }
        }
        g.restore();
      };
      divot(0, false);
      divot(128, true);
      const tex = new CanvasTexture(c);
      tex.colorSpace = SRGBColorSpace;
      const mk = (u0, n) => {
        const geo = new PlaneGeometry(1, 1).rotateX(-Math.PI / 2), uv = geo.attributes.uv;
        for (let i = 0; i < uv.count; i++) uv.setX(i, u0 + uv.getX(i) * 0.5);
        const im = new InstancedMesh(geo, new MeshStandardMaterial({ map: tex, transparent: true, depthWrite: false, roughness: 0.95, polygonOffset: true, polygonOffsetFactor: -3 }), n);
        const m4 = new Matrix4(), q = new Quaternion(), e = new Euler();
        for (let i = 0; i < n; i++) {
          const bay = TB.BAYS[Math.floor(rnd() * TB.BAYS.length)], x = bay + 0.2 + (rnd() - 0.5) * 3.2, z = -1.25 - Math.pow(rnd(), 1.5) * 4.5, s = 0.1 + rnd() * 0.08;
          m4.compose(new Vector3(x, 6e-3, z), q.setFromEuler(e.set(0, (rnd() - 0.5) * 0.7, 0)), new Vector3(s * 1.4, 1, s * 1.4 * 0.5));
          im.setMatrixAt(i, m4);
        }
        im.receiveShadow = true;
        scene.add(im);
      };
      mk(0, 150);
      mk(0.5, 40);
    }
    const birdM = new MeshBasicMaterial({ color: 1381148, side: DoubleSide });
    const wingGeo = new BufferGeometry();
    wingGeo.setAttribute("position", new Float32BufferAttribute([0, 0, -0.07, 0, 0, 0.08, 0.42, 0, -0.04, 0.42, 0, -0.04, 0, 0, 0.08, 0.3, 0, 0.1], 3));
    for (let i = 0; i < 7; i++) {
      const b = new Group(), body = new Mesh(new CapsuleGeometry(0.045, 0.22, 2, 6), birdM);
      body.rotation.x = Math.PI / 2;
      b.add(body);
      const wl = new Mesh(wingGeo, birdM), wr = new Mesh(wingGeo, birdM);
      wr.scale.x = -1;
      b.add(wl, wr);
      b.scale.setScalar(1.3);
      scene.add(b);
      FX.birds.push({ g: b, wl, wr, o: new Vector3((i % 2 ? 1 : -1) * Math.ceil(i / 2) * 1.6, Math.ceil(i / 2) * 0.4 + rnd() * 0.5, Math.ceil(i / 2) * 1.8), ph: rnd() * 6 });
    }
    {
      const N = 320, pos = new Float32Array(N * 3), sd = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        pos[i * 3] = (rnd() - 0.5) * 18;
        pos[i * 3 + 1] = rnd() * 6;
        pos[i * 3 + 2] = (rnd() - 0.5) * 18;
        sd[i] = rnd();
      }
      const geo = new BufferGeometry();
      geo.setAttribute("position", new BufferAttribute(pos, 3));
      geo.setAttribute("aS", new BufferAttribute(sd, 1));
      const pm = new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: { uT: { get value() {
          return clock.t;
        } }, uSun: { value: sunDir }, uPR: { value: 1 } },
        vertexShader: "attribute float aS; uniform float uT, uPR; uniform vec3 uSun; varying float vA;\n        void main(){ vec3 p = position + vec3(uT * 0.22 + sin(uT * 0.31 + aS * 6.3) * 0.7, sin(uT * 0.47 + aS * 9.1) * 0.35, cos(uT * 0.27 + aS * 4.0) * 0.7 - uT * 0.08);\n          vec3 box = vec3(18.0, 6.0, 18.0), c = cameraPosition; p.xz = c.xz + mod(p.xz - c.xz + box.xz * 0.5, box.xz) - box.xz * 0.5; p.y = mod(p.y - c.y + 3.0, 6.0) + max(0.15, c.y - 3.0);\n          vec4 mv = viewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv; float d = -mv.z;\n          gl_PointSize = clamp(uPR * (0.9 + aS) * 9.0 / max(d, 0.1), 1.0, 7.0);\n          vA = (0.08 + 1.4 * pow(max(dot(normalize(p - cameraPosition), uSun), 0.0), 4.0)) * smoothstep(0.8, 2.5, d) * (1.0 - smoothstep(7.0, 9.0, d)); }",
        fragmentShader: "varying float vA; void main(){ float a = smoothstep(0.5, 0.1, length(gl_PointCoord - 0.5)) * vA * 0.55; gl_FragColor = vec4(vec3(1.0, 0.8, 0.55) * a, a); }"
      });
      const pts = new Points(geo, pm);
      pts.frustumCulled = false;
      scene.add(pts);
      FX.pollen = pts;
      NO_AO.push(pts);
    }
  }
  function updateFx(rdt) {
    const t = clock.t, per = 70, k = t % per / per, c = new Vector3(lerp(-170, 170, k), 34 + Math.sin(t * 0.2) * 3, -150 + Math.sin(k * 3) * 20);
    for (const b of FX.birds) {
      b.g.position.copy(c).add(b.o).add(new Vector3(0, Math.sin(t * 0.9 + b.ph) * 0.4, 0));
      b.g.rotation.y = -Math.PI / 2 + Math.sin(t * 0.3 + b.ph) * 0.1;
      const glide = Math.sin(t * 0.35 + b.ph) > 0.55, f = glide ? 0.12 : Math.sin(t * 9 + b.ph * 3) * 0.75;
      b.wl.rotation.z = f;
      b.wr.rotation.z = -f;
    }
    if (FX.pollen) FX.pollen.material.uniforms.uPR.value = renderer.getPixelRatio();
    if (seat) seatU.uS.value = Math.max(0, SEAT.base - Math.atan2(Math.max(0.3, camera.position.y), SEAT.dist));
    const w = G.wind || { mph: 0, x: 0, z: 0 }, wa = w.mph > 0.5 ? Math.atan2(-w.z, w.x) : -0.6;
    FLAG_U.uW.value = lerp(FLAG_U.uW.value, clamp(0.3 + w.mph / 9, 0.3, 1), 1 - Math.exp(-rdt));
    for (const T of TARGETS) {
      const f = T.flag;
      let d = wa - f.rotation.y;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      f.rotation.y += d * (1 - Math.exp(-rdt * 1.5));
    }
    for (const T of TARGETS) {
      const fl = T._flash > 0 ? 0.5 + 0.5 * Math.sin(clock.t * 30) : 0;
      T.mat.userData.u.uFlash.value = fl * 0.6;
      T.mat.userData.u.uC.value.set(T.x, T.z);
      T.lamps.material.color.copy(T.lampBase).multiplyScalar(0.85 + 0.12 * Math.sin(clock.t * 2 + T.dist) + fl * 1.2);
    }
  }
  const GRASS = [], GRASS_SCALE = +(QS.get("gs") || 1);
  {
    const N = state().quality.tier >= 2 ? 9e3 : 4e3, pos = [], uvs = [], idx = [];
    let seed = 3;
    const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
    for (let b = 0; b < 6; b++) {
      const ox = (rnd() - 0.5) * 0.05, oz = (rnd() - 0.5) * 0.05, h = 0.035 + rnd() * 0.05, w = 28e-4 + rnd() * 16e-4, rot = rnd() * 6.283, lean = 0.2 + rnd() * 0.5;
      const base = pos.length / 3, cx = Math.cos(rot), sz = Math.sin(rot);
      for (let i = 0; i <= 4; i++) {
        const t = i / 4, ww = w * (1 - t * 0.85), bend = lean * t * t * h;
        for (const sd of [-1, 1]) {
          pos.push(ox + cx * ww * sd + sz * bend, h * t, oz - sz * ww * sd + cx * bend);
          uvs.push(sd * 0.5 + 0.5, t);
        }
      }
      for (let i = 0; i < 4; i++) {
        const k = base + i * 2;
        idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
      }
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    const mt = new MeshStandardMaterial({ color: 16777215, roughness: 0.9, side: DoubleSide, envMapIntensity: 0.85 });
    mt.onBeforeCompile = (sh) => {
      sh.uniforms.uT = { get value() {
        return clock.t;
      } };
      sh.uniforms.uGrass = { value: TURF.fair };
      sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nuniform float uT; varying float vH; varying float vR;").replace("#include <beginnormal_vertex>", "vec3 objectNormal = vec3(0.0, 1.0, 0.0);").replace("#include <begin_vertex>", "#include <begin_vertex>\n        vH = uv.y; vec4 wp0 = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0); vR = fract(sin(dot(wp0.xz, vec2(12.9898, 78.233))) * 43758.5453);\n        float sway = sin(uT * 1.7 + wp0.x * 0.8 + wp0.z * 0.6) * 0.012 + sin(uT * 3.1 + wp0.z * 2.0) * 0.004;\n        transformed.x += sway * uv.y * uv.y; transformed.z += sway * 0.6 * uv.y * uv.y;");
      sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nuniform vec3 uGrass; varying float vH; varying float vR;").replace("#include <color_fragment>", "#include <color_fragment>\n        vec3 gc = uGrass * mix(0.55, 1.45, vH) * mix(0.8, 1.2, vR);\n        gc = mix(gc, gc * vec3(1.35, 1.15, 0.6), step(0.88, vR) * vH);      // a few dry tips\n        diffuseColor.rgb = gc * 1.6;").replace("#include <aomap_fragment>", "#include <aomap_fragment>\nreflectedLight.indirectDiffuse *= mix(0.45, 1.0, vH);");
    };
    const im = new InstancedMesh(geo, mt, N);
    im.receiveShadow = true;
    im.frustumCulled = false;
    scene.add(im);
    GRASS.push(im);
  }
  const _m4 = new Matrix4(), _q = new Quaternion(), _s = new Vector3(), _p = new Vector3(), _e = new Euler();
  function plantGrass(cx, cz, yaw, avoid, dMin = 0.4) {
    if (!GRASS.length) return;
    let seed = 7;
    const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
    for (const im of GRASS) {
      for (let i = 0; i < im.count; i++) {
        let x, z, ok = false;
        for (let tries = 0; tries < 6 && !ok; tries++) {
          const d = dMin + Math.pow(rnd(), 0.9) * (9.4 - Math.min(dMin, 6)), a = yaw + (rnd() - 0.5) * 1.5;
          x = cx + Math.sin(a) * d;
          z = cz - Math.cos(a) * d;
          ok = !avoid || !avoid(x, z);
        }
        if (!ok) {
          x = 0;
          z = 9999;
        }
        const s = GRASS_SCALE * (0.7 + rnd() * 0.6) * (1 - 0.85 * smooth(clamp((Math.hypot(x - cx, z - cz) - 4.5) / 4.5)));
        _p.set(x, 0, z);
        _q.setFromEuler(_e.set(0, rnd() * 6.283, 0));
        _s.set(s, s * (0.8 + rnd() * 0.5), s);
        _m4.compose(_p, _q, _s);
        im.setMatrixAt(i, _m4);
      }
      im.instanceMatrix.needsUpdate = true;
    }
  }
  const onGreenOrMat = (x, z) => Math.abs(z) < 0.95 && TB.BAYS.some((b) => Math.abs(x - b) < 1.2) || TARGETS.some((T) => T.active && !T.mover && Math.hypot(x - T.x, z - T.z) < T.r * 1.15);
  plantGrass(0.3, 3.3, 0, onGreenOrMat);
  const bokeh = new BokehPass(scene, camera, { focus: 10, aperture: 2e-4, maxblur: 5e-3 });
  bokeh.enabled = false;
  const film = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, uT: { value: 0 }, uV: { value: 0.32 }, uG: { value: 0.035 } },
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader: "uniform sampler2D tDiffuse; uniform float uT, uV, uG; varying vec2 vUv;\n    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + uT) * 43758.5453); }\n    void main(){ vec4 c = texture2D(tDiffuse, vUv); vec2 d = vUv - 0.5; float v = 1.0 - uV * dot(d, d) * 2.2;\n      float n = (h(vUv * 1000.0) - 0.5) * uG; gl_FragColor = vec4(c.rgb * v + n, 1.0); }"
  });
  let composerRef = null;
  function ensurePasses() {
    const S = state();
    if (S.composer === composerRef) return;
    composerRef = S.composer;
    const passes = S.composer.passes, out = passes.findIndex((p) => p.constructor.name === "OutputPass");
    if (S.quality.tier >= 1) S.composer.insertPass(bokeh, out >= 0 ? out : passes.length);
    else bokeh.enabled = false;
    S.composer.addPass(film);
    if (S.passes.bloom) {
      S.passes.bloom.strength = +(QS.get("bs") || 0.28);
      S.passes.bloom.threshold = +(QS.get("bt") || 0.9);
      S.passes.bloom.radius = 0.45;
      const b = S.passes.bloom;
      b.highPassUniforms.luminosityThreshold.value = b.threshold;
      b.compositeMaterial.uniforms.bloomStrength.value = b.strength;
      b.compositeMaterial.uniforms.bloomRadius.value = b.radius;
    }
    if (S.passes.ao) {
      S.passes.ao.blendIntensity = 0.7;
      const ao = S.passes.ao;
      if (!ao.__golfFx) {
        ao.__golfFx = true;
        const r0 = ao.render.bind(ao), fx = [...NO_AO, halo, tracer, ...seat ? [seat] : []];
        ao.render = (...a) => {
          const was = fx.map((o) => o.visible);
          fx.forEach((o) => o.visible = false);
          try {
            r0(...a);
          } finally {
            fx.forEach((o, i) => o.visible = was[i]);
          }
        };
      }
    }
    void out;
  }
  ensurePasses();
  const PH = { g: 9.81, rho: 1.2, A: Math.PI * BALL_R * BALL_R, m: 0.04593 };
  function onTargetTurf(x, z, c) {
    for (const T of TARGETS) if (T.active && !T.mover && Math.hypot(x - targetPosAt(T, c), z - T.z) < T.r * 1.12) return true;
    return false;
  }
  function simulateShot(p, c0) {
    const dt = 1 / 240, path = [];
    const f = new Vector3(Math.sin(p.yaw), 0, -Math.cos(p.yaw));
    const pos = new Vector3(0, TEE_Y, 0), vel = f.clone().multiplyScalar(p.v0 * Math.cos(p.launch)).setY(p.v0 * Math.sin(p.launch));
    let w = p.spin * 2 * Math.PI / 60, t = 0, landed = -1, apexT = 0, apexY = 0, bounces = 0, cup = null, rolling = false;
    const back = new Vector3().crossVectors(f, new Vector3(0, 1, 0)).normalize();
    const axis = back.clone().multiplyScalar(Math.cos(p.tilt)).add(new Vector3(0, Math.sin(p.tilt), 0)).normalize();
    const vr = new Vector3(), F = new Vector3(), L = new Vector3();
    let k = 0;
    while (t < 22) {
      if (k++ % 2 === 0) path.push({ t, x: pos.x, y: pos.y, z: pos.z });
      if (!rolling) {
        const wf = clamp(0.35 + pos.y / 18, 0.35, 1);
        vr.set(vel.x - p.wind.x * wf, vel.y, vel.z - p.wind.z * wf);
        const v = vr.length(), S = BALL_R * w / Math.max(1, v), Cd = 0.22 + 0.15 * S, Cl = Math.min(0.32, 0.84 * S), q = 0.5 * PH.rho * PH.A * v / PH.m;
        L.crossVectors(axis, vr).normalize().multiplyScalar(Cl * q * v);
        F.copy(vr).multiplyScalar(-Cd * q).add(L);
        F.y -= PH.g;
        vel.addScaledVector(F, dt);
        pos.addScaledVector(vel, dt);
        w *= Math.exp(-dt / 22);
        if (pos.y > apexY) {
          apexY = pos.y;
          apexT = t;
        }
        if (pos.y <= BALL_R && vel.y < 0) {
          const soft = onTargetTurf(pos.x, pos.z, c0 + t);
          if (landed < 0) landed = t;
          for (const T of TARGETS) if (T.active && Math.hypot(pos.x - targetPosAt(T, c0 + t), pos.z - T.z) < (T.gold ? 0.42 : 0.16)) cup = T;
          if (cup) {
            pos.y = -0.03;
            path.push({ t, x: pos.x, y: pos.y, z: pos.z });
            break;
          }
          pos.y = BALL_R;
          const vy = -vel.y;
          if (vy > 1.3 && bounces < 6) {
            vel.y = vy * (soft ? 0.24 : 0.33);
            const keep = soft ? 0.42 : 0.56;
            vel.x *= keep;
            vel.z *= keep;
            w *= 0.45;
            bounces++;
          } else {
            vel.y = 0;
            rolling = true;
          }
        }
      } else {
        const sp = Math.hypot(vel.x, vel.z), soft = onTargetTurf(pos.x, pos.z, c0 + t), a = soft ? 4.2 : 3;
        if (sp < 0.08) {
          path.push({ t, x: pos.x, y: BALL_R, z: pos.z });
          break;
        }
        const ns = Math.max(0, sp - a * dt);
        vel.x *= ns / sp;
        vel.z *= ns / sp;
        pos.x += vel.x * dt;
        pos.z += vel.z * dt;
        for (const T of TARGETS) if (T.active && sp < 6 && Math.hypot(pos.x - targetPosAt(T, c0 + t), pos.z - T.z) < (T.gold ? 0.45 : 0.13)) cup = T;
        if (cup) {
          pos.x = targetPosAt(cup, c0 + t);
          pos.z = cup.z;
          pos.y = -0.03;
          path.push({ t, x: pos.x, y: pos.y, z: pos.z });
          break;
        }
      }
      t += dt;
    }
    const end = path[path.length - 1];
    return { path, landT: landed < 0 ? end.t : landed, apexT, apexY, endT: end.t, end, cup, c0 };
  }
  function pathAt(sh, t) {
    const P = sh.path, dt = 1 / 120, i = clamp(Math.floor(t / dt), 0, P.length - 1), j = Math.min(P.length - 1, i + 1), f = clamp((t - P[i].t) / dt);
    return _v.set(lerp(P[i].x, P[j].x, f), lerp(P[i].y, P[j].y, f), lerp(P[i].z, P[j].z, f));
  }
  const _v = new Vector3();
  function scoreShot(sh, mods) {
    var _a2, _b2;
    const c = sh.c0 + sh.endT, e = sh.end;
    let best = null;
    if (sh.cup) best = { T: sh.cup, ring: sh.cup.gold ? "JACKPOT" : "CUP", pts: sh.cup.gold ? 500 : Math.round(100 * sh.cup.mult) };
    else for (const T of TARGETS) {
      if (!T.active) continue;
      const d = Math.hypot(e.x - targetPosAt(T, c), e.z - T.z);
      if (d > T.r) continue;
      const ring = d <= T.r * 0.25 ? "BULLSEYE" : d <= T.r * 0.6 ? "INNER RING" : "OUTER RING";
      const pts = Math.round({ BULLSEYE: 40, "INNER RING": 20, "OUTER RING": 10 }[ring] * T.mult);
      if (!best || pts > best.pts) best = { T, ring, pts, d };
    }
    const carry = Math.hypot(((_a2 = sh.path[Math.round(sh.landT * 120)]) == null ? void 0 : _a2.x) || e.x, ((_b2 = sh.path[Math.round(sh.landT * 120)]) == null ? void 0 : _b2.z) || e.z);
    const total = Math.hypot(e.x, e.z);
    if (!best) best = { T: null, ring: "MISS", pts: Math.min(5, Math.floor(total * YD / 40)) };
    best.pts = Math.round(best.pts * mods);
    return { ...best, carry, total };
  }
  let AC = null, master = null, amb = null;
  function audio() {
    if (AC || MUTE) return;
    try {
      AC = new (window.AudioContext || window.webkitAudioContext)();
      master = AC.createGain();
      master.gain.value = 0.8;
      master.connect(AC.destination);
      const nb = noiseBuf(4);
      const src = AC.createBufferSource();
      src.buffer = nb;
      src.loop = true;
      const lp = AC.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 420;
      const g = AC.createGain();
      g.gain.value = 0.05;
      src.connect(lp).connect(g).connect(master);
      src.start();
      amb = g;
      setInterval(() => {
        if (!AC || AC.state !== "running") return;
        const t = AC.currentTime;
        for (let i = 0; i < 3; i++) chirp(t + i * 0.07 + Math.random() * 0.02);
      }, 900 + Math.random() * 300);
    } catch (e) {
      AC = null;
    }
  }
  let NB = null;
  function noiseBuf(sec = 1) {
    if (NB && sec === 1) return NB;
    const b = AC.createBuffer(1, AC.sampleRate * sec, AC.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    if (sec === 1) NB = b;
    return b;
  }
  function env(g, t, a, peak, dur) {
    g.gain.setValueAtTime(1e-4, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
  }
  function tone(f, dur, vol, type = "sine", f2, t0) {
    if (!AC) return;
    const t = t0 != null ? t0 : AC.currentTime, o = AC.createOscillator(), g = AC.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    env(g, t, 5e-3, vol, dur);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + dur + 0.05);
  }
  function noise(dur, vol, type = "bandpass", freq = 1e3, q = 1, t0, f2) {
    if (!AC) return;
    const t = t0 != null ? t0 : AC.currentTime, s = AC.createBufferSource();
    s.buffer = noiseBuf(1);
    s.loop = true;
    const fl = AC.createBiquadFilter();
    fl.type = type;
    fl.frequency.setValueAtTime(freq, t);
    if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur);
    fl.Q.value = q;
    const g = AC.createGain();
    env(g, t, Math.min(0.08, dur * 0.3), vol, dur);
    s.connect(fl).connect(g).connect(master);
    s.start(t, Math.random());
    s.stop(t + dur + 0.05);
  }
  function chirp(t) {
    if (!AC) return;
    const o = AC.createOscillator(), g = AC.createGain();
    o.frequency.value = 4300 + Math.random() * 300;
    env(g, t, 4e-3, 6e-3, 0.045);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + 0.06);
  }
  const sfx = {
    blip: () => tone(880, 0.12, 0.12, "triangle", 1320),
    ready: () => {
      tone(660, 0.1, 0.08, "sine");
      tone(990, 0.14, 0.07, "sine", null, AC && AC.currentTime + 0.08);
    },
    whoosh: (v) => noise(0.28, 0.25 * v, "bandpass", 500, 0.8, void 0, 2600),
    hit: (v) => {
      if (!AC) return;
      const t = AC.currentTime;
      noise(0.06, 0.9 * (0.4 + v), "highpass", 2500, 0.7, t);
      tone(2400 + v * 900, 0.07, 0.35 * (0.4 + v), "triangle", 1500, t);
      tone(180, 0.12, 0.3 * v, "sine", 70, t);
    },
    land: (v) => {
      noise(0.12, 0.22 * v, "lowpass", 500, 1);
      tone(110, 0.12, 0.2 * v, "sine", 60);
    },
    cup: () => {
      if (!AC) return;
      const t = AC.currentTime;
      tone(1400, 0.08, 0.25, "triangle", null, t);
      tone(900, 0.1, 0.25, "triangle", null, t + 0.09);
      noise(0.15, 0.2, "lowpass", 600, 1, t + 0.12);
    },
    cheer: (big = 1) => {
      if (!AC) return;
      const t = AC.currentTime, d = 1.6 + big * 1.4;
      for (let i = 0; i < 6; i++) noise(d, 0.11 * big, "bandpass", 500 + i * 380 + Math.random() * 150, 3.5, t + Math.random() * 0.15);
      for (let i = 0; i < 26 * big; i++) noise(0.03, 0.22, "bandpass", 1400 + Math.random() * 1500, 1.5, t + 0.2 + Math.random() * d);
      tone(1600, 0.5, 0.05 * big, "sine", 2600, t + 0.3);
      if (big > 1.2) tone(1800, 0.6, 0.05, "sine", 3e3, t + 1);
      for (const f of [220, 277, 330]) tone(f, 0.9, 0.025 * big, "sawtooth", f * 1.35, t);
    },
    aww: () => {
      for (const f of [330, 262]) tone(f, 0.9, 0.035, "sawtooth", f * 0.7);
      noise(0.9, 0.05, "bandpass", 600, 2);
    },
    jackpot: () => {
      if (!AC) return;
      const t = AC.currentTime;
      [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone(f, 0.3, 0.12, "square", null, t + i * 0.08));
      sfx.cheer(2);
    },
    banner: () => {
      tone(392, 0.18, 0.08, "triangle");
      tone(587, 0.3, 0.08, "triangle", null, AC && AC.currentTime + 0.12);
    }
  };
  const G = window.__game = {
    state: "title",
    players: [],
    cur: 0,
    ball: 0,
    balls: 6,
    nPlayers: 1,
    score: 0,
    timeScale: 1,
    clock: 0,
    shot: null,
    last: null,
    shots: [],
    swing: null,
    wind: { x: 0, z: 0, mph: 0 },
    mods: 1,
    event: "",
    top: null,
    saved: false,
    fps: 60,
    quality: 2,
    stateT: 0,
    shotClock: 0
  };
  const SHOT_CLOCK = 20;
  function setState(s) {
    G.state = s;
    G.stateT = 0;
  }
  function ballsPer(n) {
    return +(QS.get("balls") || { 1: 6, 2: 4, 3: 3, 4: 3 }[n]);
  }
  function eventFor(ballIdx, balls) {
    if (ballIdx === balls - 1) return "MOONSHOT";
    if (balls >= 4 && ballIdx === 1) return "MOVING";
    if (balls >= 4 && ballIdx === balls - 2) return "DOUBLE";
    if (balls === 3 && ballIdx === 1) return "DOUBLE+MOVING";
    return "";
  }
  function startGame(n) {
    audio();
    if (AC && AC.state === "suspended") AC.resume();
    try {
      BP.music("golf");
    } catch (e) {
    }
    G.nPlayers = n;
    G.balls = ballsPer(n);
    G.cur = 0;
    G.ball = 0;
    G.shots = [];
    G.top = null;
    G.saved = false;
    G.players = Array.from({ length: n }, (_, i) => ({ name: "PLAYER " + (i + 1), col: PCOL[i], score: 0, results: [], missStreak: 0 }));
    $("title").classList.add("hide");
    $("end").classList.add("hide");
    $("board").classList.remove("hide");
    $("ballTag").classList.remove("hide");
    BP.activity.activeSec = 0;
    BP.activity.kcal = 0;
    newTurn(true);
  }
  function newTurn(first) {
    const P = G.players[G.cur];
    AV.color(P.col);
    G.event = eventFor(G.ball, G.balls);
    G.mods = (G.event.includes("DOUBLE") ? 2 : 1) * (G.event === "MOONSHOT" ? 3 : 1);
    MOVER.active = G.event.includes("MOVING");
    MOVER.group.visible = MOVER.active;
    MOVER.speed = 0.45 + 0.1 * G.ball;
    const wmax = clamp(1 + G.ball * 1.6 - P.missStreak * 1.2, 0.5, 9);
    const wa = Math.random() * Math.PI * 2, wmph = Math.round(Math.random() * wmax);
    G.wind = { mph: wmph, ang: wa, x: Math.sin(wa) * wmph * 0.447, z: -Math.cos(wa) * wmph * 0.447 };
    resetBall();
    G.shot = null;
    G.swing = newSwing();
    G.timeScale = 1;
    G.shotClock = SHOT_CLOCK;
    renderBoard();
    if (G.nPlayers > 1 || first) {
      setState("stepup");
      stepupShow(P);
    } else {
      setState("address");
      announce();
    }
  }
  function announce() {
    const e = G.event, P = G.players[G.cur];
    if (e === "MOONSHOT") banner("MOONSHOT!", "LAST BALL · ALL POINTS ×3", "cool");
    else if (e === "MOVING") banner("MOVING TARGET", "HIT THE MOVING GREEN FOR ×3", "cool");
    else if (e === "DOUBLE") banner("2× ROUND", "EVERY POINT COUNTS DOUBLE");
    else if (e === "DOUBLE+MOVING") banner("2× PARTY BALL", "DOUBLE POINTS + MOVING TARGET", "cool");
    else if (G.nPlayers === 1 && G.ball > 0) banner("BALL " + (G.ball + 1), "OF " + G.balls, "soft");
    if (e) sfx.banner();
    void P;
  }
  function stepupShow(P) {
    const el = $("stepup");
    el.classList.remove("hide");
    el.style.setProperty("--c", P.col);
    el.querySelector(".who").textContent = G.nPlayers > 1 ? P.name + " STEP UP" : "STEP UP!";
    el.querySelector(".who").style.color = "#fff";
  }
  function resetBall() {
    ball.position.set(0, TEE_Y, 0);
    ball.visible = true;
    ballMat.emissive.set(0);
    ballMat.color.set(16052974);
    if (G.event === "MOONSHOT") {
      ballMat.color.set(16765562);
      ballMat.emissive.set(16751136);
      ballMat.emissiveIntensity = 0.9;
    }
    clearTracer();
    tee.visible = teeCup.visible = true;
  }
  function renderBoard() {
    const P = G.players[G.cur];
    if (!P) return;
    $("board").innerHTML = '<span class="lbl" style="'.concat(G.nPlayers > 1 ? "color:" + P.col : "", '">').concat(G.nPlayers > 1 ? "PLAYER " + (G.cur + 1) : "SCORE", "</span><b>").concat(P.score, "</b>");
    $("ballTag").innerHTML = '<span class="lbl">BALL</span><b>'.concat(Math.min(G.ball + 1, G.balls), '</b><span class="lbl">OF ').concat(G.balls, "</span>");
    const e = G.event, w = G.wind;
    G.score = G.players.reduce((m, P2) => Math.max(m, P2.score), 0);
    void w;
  }
  let bannerT = 0;
  function banner(big, small = "", cls = "") {
    const b = $("banner");
    b.classList.remove("on");
    void b.offsetWidth;
    b.querySelector(".big").textContent = big;
    b.querySelector(".big").className = "big " + cls;
    b.querySelector(".small").textContent = small;
    b.classList.add("on");
    bannerT = performance.now();
  }
  function newSwing() {
    return { phase: "idle", still: 0, addr: null, top: null, backAmt: 0, lift: 0, tBack: 0, tTop: 0, tImpact: 0, peak: 0, impact: null, finishMin: 1, trail: [], ghosts: [], ready: false, together: false, oneHand: false };
  }
  const HP = { x: 0.5, y: 0.7, vx: 0, vy: 0, speed: 0, seen: false };
  function readHands() {
    const L = BP.hands.left, Rh = BP.hands.right;
    const ls = L.seen && BP.live, rs = Rh.seen && (BP.live || BP.mouse);
    if (ls && rs) {
      HP.x = (L.x + Rh.x) / 2;
      HP.y = (L.y + Rh.y) / 2;
      HP.vx = (L.vx + Rh.vx) / 2;
      HP.vy = (L.vy + Rh.vy) / 2;
    } else if (rs || ls) {
      const h = rs ? Rh : L;
      HP.x = h.x;
      HP.y = h.y;
      HP.vx = h.vx;
      HP.vy = h.vy;
    }
    HP.speed = Math.hypot(HP.vx, HP.vy);
    HP.seen = ls || rs;
    G.swing.together = ls && rs && Math.hypot(L.x - Rh.x, L.y - Rh.y) < 0.2;
    G.swing.oneHand = !(ls && rs) && HP.seen;
  }
  function swingUpdate(now, dt) {
    const S = G.swing;
    readHands();
    if (S._lp !== S.phase) {
      (G.swingLog || (G.swingLog = [])).push([G.ball, S.phase, +(now / 1e3).toFixed(2), +HP.y.toFixed(2)]);
      S._lp = S.phase;
    }
    if (!HP.seen || BP.mouse) return;
    const t = now / 1e3;
    S.trail.push({ x: HP.x, y: HP.y, t });
    while (S.trail.length && t - S.trail[0].t > 0.7) S.trail.shift();
    switch (S.phase) {
      case "idle":
      case "address": {
        const low = HP.y > 0.5, calm = HP.speed < 0.45;
        const rising = S.addr && S.addr.y - HP.y > 0.025;
        if (low && calm) {
          S.still += dt;
          if (!S.addr || HP.speed < 0.3 && !rising) S.addr = S.addr ? { x: lerp(S.addr.x, HP.x, 0.15), y: lerp(S.addr.y, HP.y, 0.15) } : { x: HP.x, y: HP.y };
        } else if (S.phase === "idle" || !rising) {
          S.still = 0;
          if (S.phase === "address") {
            S.phase = "idle";
            S.addr = null;
            S.tBack = 0;
          }
        }
        if (S.phase === "idle" && S.still > 1.2) {
          S.phase = "address";
          sfx.ready();
        }
        if (S.phase === "address" && S.addr) {
          const lift = S.addr.y - HP.y;
          if (lift > 0.035 && !S.tBack) S.tBack = t;
          if (lift < 0.02) S.tBack = 0;
          if (lift > 0.15) {
            S.phase = "back";
            S.top = { x: HP.x, y: HP.y };
            S.lift = lift;
            if (!S.tBack) S.tBack = t - 0.15;
          }
        }
        break;
      }
      case "back": {
        const lift = S.addr.y - HP.y, side = HP.x - S.addr.x;
        if (lift > S.lift) {
          S.lift = lift;
          S.top = { x: HP.x, y: HP.y };
          S.tTop = t;
        }
        S.backAmt = Math.max(S.backAmt, clamp((S.lift + 0.55 * Math.abs(S.top.x - S.addr.x)) / 0.5));
        void side;
        if (S.lift > 0.18 && HP.vy > 0.7 && S.lift - lift > 0.06) {
          S.phase = "down";
          S.peak = HP.speed;
          S.tDown = t;
          sfx.whoosh(clamp(HP.speed / 2));
        } else if (lift < 0.05 && HP.speed < 0.45) {
          S.phase = "address";
          S.backAmt = 0;
          S.lift = 0;
          S.tBack = 0;
        }
        break;
      }
      case "down": {
        S.peak = Math.max(S.peak, HP.speed);
        const lift = S.addr.y - HP.y;
        const bottom = lift < Math.max(0.06, S.lift * 0.25) || HP.vy < -0.1 && lift < S.lift * 0.55;
        if ((bottom || t - S.tDown > 0.9) && S.peak < 0.8) {
          S.phase = "idle";
          S.still = 0;
          S.addr = null;
          S.backAmt = 0;
          S.lift = 0;
          S.tBack = 0;
          break;
        }
        if (bottom || t - S.tDown > 0.9) {
          S.phase = "follow";
          S.tImpact = t;
          S.impact = { x: HP.x, vx: HP.vx, speed: S.peak };
          S.finishMin = HP.y;
        }
        break;
      }
      case "follow": {
        S.finishMin = Math.min(S.finishMin, HP.y);
        if (t - S.tImpact > 0.38) {
          const backDur = Math.max(0.12, (S.tTop || S.tDown) - S.tBack), downDur = Math.max(0.06, S.tImpact - (S.tTop || S.tDown));
          const finish = S.addr.y - S.finishMin;
          launchFromSwing({ backAmt: S.backAmt, speed: S.impact.speed, sideways: S.impact.x - S.addr.x, finish, tempo: backDur / downDur, backDur, downDur, tImpact: S.tImpact });
        }
        break;
      }
    }
    if (S.phase !== "idle") {
      if (!S._gt || t - S._gt > 0.045) {
        S._gt = t;
        S.ghosts.push({ x: HP.x, y: HP.y, a: 1 });
        if (S.ghosts.length > 22) S.ghosts.shift();
      }
    }
  }
  const MD = { on: false };
  addEventListener("pointerdown", (e) => {
    if (G.state !== "address" || BP.live) return;
    audio();
    MD.on = true;
    MD.y0 = e.clientY / innerHeight;
    MD.x0 = e.clientX / innerWidth;
    MD.t0 = performance.now();
    MD.pow = 0;
    MD.hist = [];
  });
  addEventListener("pointermove", (e) => {
    if (!MD.on) return;
    const y = e.clientY / innerHeight, x = e.clientX / innerWidth, t = performance.now();
    MD.pow = Math.max(MD.pow * 0.999, clamp((y - MD.y0) / 0.32));
    G.swing.backAmt = MD.pow;
    G.swing.phase = MD.pow > 0.05 ? "back" : "address";
    MD.hist.push({ x, y, t });
    while (MD.hist.length && t - MD.hist[0].t > 120) MD.hist.shift();
  });
  addEventListener("pointerup", (e) => {
    if (!MD.on) return;
    MD.on = false;
    const h = MD.hist;
    if (!h.length || MD.pow < 0.05 || G.state !== "address") {
      G.swing.phase = "address";
      G.swing.backAmt = 0;
      return;
    }
    const a = h[0], b = h[h.length - 1], dt = Math.max(0.016, (b.t - a.t) / 1e3), vy = (b.y - a.y) / dt, vx = (b.x - a.x) / dt;
    if (vy > -0.6) {
      G.swing.phase = "address";
      G.swing.backAmt = 0;
      return;
    }
    const sp = Math.hypot(vx, vy);
    launchFromSwing({ backAmt: MD.pow, speed: clamp(sp / 4.5) * 2.4, sideways: vx * 0.05, finish: 0.18 + 0.3 * clamp(-vy / (sp + 0.01)), tempo: 3, backDur: (performance.now() - MD.t0) / 1e3, downDur: dt, mouse: true });
  });
  function launchFromSwing(s) {
    if (G.state !== "address") return;
    const P = G.players[G.cur];
    const speedN = clamp((s.speed - 0.35) / 1.65);
    const tempoQ = Math.exp(-Math.pow(Math.log(clamp(s.tempo, 0.3, 12) / 3), 2) / 0.6);
    let power = clamp(speedN * (0.55 + 0.45 * s.backAmt) * (0.95 + 0.08 * tempoQ), 0.07, 1);
    const loft = clamp(s.finish / 0.42);
    let aimDeg = clamp(s.sideways / 0.12 * 4, -12, 12) * (1 - 0.5 * tempoQ);
    const moon = G.event === "MOONSHOT";
    const params = {
      v0: (14 + 47 * power) * (moon ? 1.1 : 1),
      launch: (12 + 18 * loft + (moon ? 6 : 0)) * Math.PI / 180,
      yaw: aimDeg * Math.PI / 180,
      spin: 2400 + 3200 * loft,
      tilt: clamp(aimDeg * 0.018, -0.3, 0.3),
      wind: G.wind
    };
    const c0 = G.clock;
    let sh = simulateShot(params, c0);
    const assist = clamp(0.62 + 0.1 * P.missStreak + 0.1 * tempoQ, 0.6, 0.92);
    let tgt = null, bestD = 1e9;
    for (const T of TARGETS) {
      if (!T.active) continue;
      const tx = targetPosAt(T, c0 + sh.endT);
      const d = Math.hypot(sh.end.x - tx, sh.end.z - T.z) / T.r;
      if (d < 3.2 && d < bestD) {
        bestD = d;
        tgt = T;
      }
    }
    const quality = clamp(0.35 * tempoQ + 0.35 * s.backAmt + 0.3 * speedN);
    const offR = tgt ? tgt.r * (0.35 + 0.6 * (1 - quality)) * Math.sqrt(Math.random()) : 0, offA = Math.random() * 6.283;
    const aimOff = { x: Math.cos(offA) * offR, z: Math.sin(offA) * offR };
    if (tgt && power > 0.12) {
      for (let it = 0; it < 3; it++) {
        const tx = targetPosAt(tgt, c0 + sh.endT) + aimOff.x, tz = tgt.z + aimOff.z;
        const curA = Math.atan2(sh.end.x, -sh.end.z), wantA = Math.atan2(tx, -tz);
        params.yaw += (wantA - curA) * assist;
        const curD = Math.hypot(sh.end.x, sh.end.z), wantD = Math.hypot(tx, tz);
        params.v0 *= clamp(1 + (wantD / curD - 1) * assist * 0.8, 0.86, 1.14);
        sh = simulateShot(params, c0);
      }
    }
    const res = scoreShot(sh, G.mods);
    sh.res = res;
    sh.player = G.cur;
    sh.moon = moon;
    sh.great = res.ring === "BULLSEYE" || res.ring === "CUP" || res.ring === "JACKPOT";
    sh.t = 0;
    sh.landedFx = false;
    sh.info = { power, speedN, backAmt: s.backAmt, loft, aimDeg, tempo: s.tempo, tempoQ, clubMph: Math.round(45 + 75 * power), ballMph: Math.round(params.v0 * 2.237), mouse: !!s.mouse };
    P.lastPow = power;
    G.shot = sh;
    G.last = { ...sh.info, carryYd: Math.round(res.carry * YD), totalYd: Math.round(res.total * YD), ring: res.ring, pts: res.pts, target: res.T ? res.T.name : null };
    sfx.hit(power);
    shake(0.15 + power * 0.25);
    tee.visible = teeCup.visible = false;
    AV.strike(s.tImpact);
    cam.pos.copy(IMPACT_CAM.pos);
    cam.look.copy(IMPACT_CAM.look);
    cam.fov = IMPACT_CAM.fov;
    cam.sub = "impact";
    cam.mode = "flight";
    cam.t = 0;
    bokeh.enabled = state().quality.tier >= 1;
    G.timeScale = IMPACT_TS;
    setState("flight");
  }
  const cam = { mode: "title", t: 0, pos: new Vector3(0.35, 1.45, 2.7), look: new Vector3(0, 0.2, -60), fov: 36, land: null };
  const BAY_CAM = { pos: new Vector3(), look: new Vector3(), fov: +(QS.get("cf") || 38) };
  const IMPACT_CAM = { pos: new Vector3(), look: new Vector3(), fov: 40 };
  const FACE_CAM = { pos: new Vector3(), look: new Vector3(), fov: 44 };
  function aimCams() {
    var _a2, _b2, _c2, _d;
    const s = HAND.cur === "L" ? -1 : 1, tall = innerWidth / innerHeight < 0.9;
    faceCamFor(s, innerWidth / innerHeight, FACE_CAM);
    if (tall) BAY_CAM.pos.set(s * -0.5, 1.45, 5.6);
    else BAY_CAM.pos.set(s * +((_a2 = QS.get("cx")) != null ? _a2 : 0.3), +((_b2 = QS.get("cy")) != null ? _b2 : 1.35), +((_c2 = QS.get("cz")) != null ? _c2 : 4.2));
    BAY_CAM.look.set(s * 0.1, +((_d = QS.get("ly")) != null ? _d : -6.5), -60);
    IMPACT_CAM.pos.set(s * 0.2, 1, 3.3);
    IMPACT_CAM.look.set(-s * 0.3, 0.55, -20);
    if (REAL) {
      if (RGOLF) RGOLF.aimCam(BAY_CAM, s, tall);
      for (const C of [IMPACT_CAM, typeof FACE_CAM !== "undefined" ? FACE_CAM : null]) if (C) {
        C.pos.copy(BAY_CAM.pos);
        C.look.copy(BAY_CAM.look);
        C.fov = BAY_CAM.fov;
      }
    }
  }
  const teeFov = () => Math.max(BAY_CAM.fov, 2 * Math.atan(Math.tan(15.5 * Math.PI / 180) / Math.max(0.2, innerWidth / innerHeight)) * 180 / Math.PI);
  function onHandChanged() {
    aimCams();
    lastPlant = "";
    cam.prev = "";
  }
  aimCams();
  addEventListener("resize", () => {
    aimCams();
    lastPlant = "";
  });
  const IMPACT_TS = 0.1, IMPACT_T = 0.1;
  function handheld(t, amt) {
    return [Math.sin(t * 0.9) * 0.6 + Math.sin(t * 2.3 + 1) * 0.3, Math.sin(t * 1.1 + 2) * 0.5 + Math.sin(t * 2.9) * 0.25].map((v) => v * amt);
  }
  let lastPlant = "";
  function plantAt(key, x, z, yaw, dMin) {
    if (lastPlant !== key) {
      lastPlant = key;
      plantGrass(x, z, yaw, onGreenOrMat, dMin);
    }
  }
  function updateCamera(rdt, now) {
    const sh = G.shot, T = now / 1e3;
    if (cam.mode === "debug") return;
    let fovT = 36, focus = 10;
    if (cam.mode === "title") {
      const want = BAY_CAM.pos.clone().add(new Vector3(Math.sin(T * 0.11) * 0.12, Math.sin(T * 0.13) * 0.05, 0.5 + Math.sin(T * 0.07) * 0.2));
      cam.pos.lerp(want, 1 - Math.exp(-rdt * 2));
      cam.look.lerp(BAY_CAM.look, 1 - Math.exp(-rdt * 2));
      fovT = teeFov();
      plantAt("tee" + HAND.cur, BAY_CAM.pos.x, BAY_CAM.pos.z, 0, 4.2);
    } else if (cam.mode === "tee") {
      if (cam.prev !== "tee") {
        cam.pos.copy(FACE_CAM.pos);
        cam.look.copy(FACE_CAM.look);
        cam.fov = REAL ? teeFov() : FACE_CAM.fov;
      }
      cam.pos.lerp(FACE_CAM.pos, 1 - Math.exp(-rdt * 3));
      cam.look.lerp(FACE_CAM.look, 1 - Math.exp(-rdt * 3));
      fovT = REAL ? teeFov() : FACE_CAM.fov;
      cam.sub = "";
      plantAt("tee" + HAND.cur, BAY_CAM.pos.x, BAY_CAM.pos.z, 0, 4.2);
      if (!REAL) focus = cam.pos.distanceTo(faceSpot(HAND.cur === "L" ? -1 : 1));
    } else if ((cam.mode === "flight" || cam.mode === "replay") && sh) {
      const B = pathAt(sh, sh.t).clone(), land = sh.path[Math.min(sh.path.length - 1, Math.round(sh.landT * 120))], end = sh.end;
      const dir = new Vector3(end.x, 0, end.z).normalize(), side = new Vector3(-dir.z, 0, dir.x);
      const toLand = sh.landT - sh.t, landP = new Vector3(land.x, 0, land.z), span = Math.hypot(land.x, land.z);
      const L = cam.landPos || (cam.landPos = landP.clone().addScaledVector(dir, -Math.min(19, span * 0.3)).addScaledVector(side, (land.x > 0 ? -1 : 1) * 6).setY(5));
      const sideSign = sunDir.x >= 0 ? -1 : 1;
      if (sh.t < IMPACT_T && cam.mode === "flight") {
        cam.sub = "impact";
        cam.pos.copy(IMPACT_CAM.pos);
        cam.look.lerp(B.clone().lerp(IMPACT_CAM.look, 0.85), 1 - Math.exp(-rdt * 3));
      } else if (toLand > 1.3 || cam.mode === "replay" && toLand > 1) {
        const p = clamp(sh.t / Math.max(0.5, sh.landT)), k = smooth(clamp((p - (cam.mode === "replay" ? 0 : 0.12)) / 0.45));
        cam.sub = k < 0.5 ? "chase" : "side";
        const behind = pathAt(sh, Math.max(0, sh.t - 0.09)).clone();
        const chase = behind.addScaledVector(dir, -2.2).addScaledVector(side, 0.9).add(new Vector3(0, 1, 0));
        const mid = landP.clone().multiplyScalar(0.5);
        const sideV = mid.clone().addScaledVector(side, sideSign * Math.max(28, span * 0.62)).addScaledVector(dir, -span * 0.08).setY(Math.max(6, sh.apexY * 0.55 + 5));
        const want = chase.lerp(sideV, k);
        if (cam.mode === "replay" && sh.t < 0.05) cam.pos.copy(want);
        cam.pos.lerp(want, 1 - Math.exp(-rdt * (k > 0.02 && k < 0.98 ? 6 : 30)));
        const lk = pathAt(sh, Math.min(sh.endT, sh.t + 0.25)).clone().lerp(B, 0.35).lerp(landP, 0.22).lerp(B.clone().lerp(new Vector3(land.x * 0.55, sh.apexY * 0.35, land.z * 0.55), 0.6), k);
        cam.look.lerp(lk, 1 - Math.exp(-rdt * 14));
        fovT = lerp(46, 50, k);
      } else {
        cam.sub = "land";
        cam.pos.lerp(L, 1 - Math.exp(-rdt * 2.2));
        cam.look.lerp(B.clone().lerp(new Vector3(land.x, 0, land.z), 0.35 + 0.45 * clamp(B.y / 25)), 1 - Math.exp(-rdt * 9));
        fovT = 46;
        plantAt("land" + G.shots.length + cam.mode, L.x, L.z, Math.atan2(land.x - L.x, -(land.z - L.z)));
      }
      if (cam.sub === "impact") cam.fov = fovT;
      bokeh.enabled = cam.sub === "impact" && state().quality.tier >= 1;
      focus = cam.pos.distanceTo(B);
    } else if (cam.mode === "result" && sh) {
      const e = sh.end, dir = new Vector3(e.x, 0, e.z).normalize(), T2 = sh.res && sh.res.T;
      const focusP = T2 ? new Vector3(lerp(e.x, T2.x, 0.4), 0, lerp(e.z, T2.z, 0.4)) : new Vector3(e.x, 0, e.z);
      const want = focusP.clone().addScaledVector(dir, -(T2 ? T2.r * 1.6 + 6 : 10)).setY(T2 ? T2.r * 0.45 + 2.5 : 3.2);
      cam.pos.lerp(want, 1 - Math.exp(-rdt * 1.4));
      cam.look.lerp(focusP, 1 - Math.exp(-rdt * 3));
      fovT = 40;
      focus = cam.pos.distanceTo(cam.look);
    }
    cam.fov = lerp(cam.fov, fovT, 1 - Math.exp(-rdt * 4));
    cam.prev = cam.mode;
    const [hx, hy] = handheld(T, cam.mode === "tee" ? 4e-3 : 0.01);
    camera.position.copy(cam.pos);
    camera.position.y += hy * 0.5;
    camera.lookAt(cam.look.x + hx * cam.pos.distanceTo(cam.look), cam.look.y + hy * cam.pos.distanceTo(cam.look) * 0.5, cam.look.z);
    if (camera.fov !== cam.fov) {
      camera.fov = cam.fov;
      camera.updateProjectionMatrix();
    }
    bokeh.uniforms.focus.value = focus;
    bokeh.uniforms.aperture.value = G.timeScale < 0.6 ? 4e-4 : 12e-5;
    const fc = cam.look.clone();
    if (cam.mode === "tee" || cam.mode === "title") fc.set(0, 0, -8);
    fc.y = 0;
    const d = Math.min(40, fc.distanceTo(new Vector3(camera.position.x, 0, camera.position.z)));
    void d;
    sun2.target.position.copy(fc);
    sun2.position.copy(fc).addScaledVector(sunDir, 70);
  }
  const hud = $("hud"), ctx = hud.getContext("2d");
  let PR = 1;
  if (!ctx.roundRect) ctx.roundRect = function(x, y, w, h) {
    this.rect(x, y, w, h);
  };
  function sizeHud() {
    PR = Math.min(2, devicePixelRatio || 1);
    hud.width = innerWidth * PR;
    hud.height = innerHeight * PR;
    hud.style.width = innerWidth + "px";
    hud.style.height = innerHeight + "px";
  }
  addEventListener("resize", sizeHud);
  sizeHud();
  let last = performance.now(), fpsN = 0, fpsT = last, last0 = last;
  G.frameMs = [];
  function frame(now) {
    const rdt = Math.min(0.05, (now - last) / 1e3);
    last = now;
    G.frameMs.push(rdt * 1e3);
    if (G.frameMs.length > 600) G.frameMs.shift();
    {
      const k = G.state + (G.state === "flight" && G.shot && G.shot.t > 0.75 ? "-chase" : ""), sf = G.stateMs || (G.stateMs = {});
      sf[k] || (sf[k] = [0, 0]);
      sf[k][0] += now - last0;
      sf[k][1]++;
    }
    if (now - last0 > 100) {
      const q = state().quality;
      q.t0 = now;
      q.frames = 0;
    }
    if (now - last0 > 60 && G.ready) (G.hitches || (G.hitches = [])).push([G.state, Math.round(now - last0), state().quality.tier]);
    last0 = now;
    fpsN++;
    if (now - fpsT > 1e3) {
      G.fps = Math.round(fpsN * 1e3 / (now - fpsT));
      fpsN = 0;
      fpsT = now;
      G.quality = state().quality.tier;
    }
    BP.update(now);
    G.stateT += rdt;
    ensurePasses();
    const gdt = rdt * G.timeScale;
    G.clock += gdt;
    clock.t += rdt;
    for (const T of TARGETS) if (T.mover) {
      T.x = targetPosAt(T, G.clock);
      T.group.position.x = T.x;
    }
    updateFx(rdt);
    for (const T of TARGETS) if (T._flash > 0) T._flash -= rdt;
    step(now, rdt, gdt);
    AV.update(now, rdt);
    updateCamera(rdt, now);
    golferUpdate(now, rdt);
    updateBallVisuals();
    RIM.uSunV.value.copy(sunDir).transformDirection(camera.matrixWorldInverse);
    film.uniforms.uT.value = now % 1e3 / 10;
    render(rdt);
    liveTips();
    drawHud(now, rdt);
    buttons(now);
    requestAnimationFrame(frame);
  }
  function golferUpdate(now, rdt) {
    const sw = G.swing ? G.swing.phase : "idle";
    const reading = (G.state === "title" || G.state === "stepup" || G.state === "address") && (sw === "idle" || sw === "address");
    if (!HAND.manual) {
      const h = STANCE.update(BP, now, !reading);
      if (h !== HAND.cur) setHand(h);
    }
    {
      const hint = !HAND.manual && STANCE.S.unsure && BP.live && !BP.mouse || !!G.forceHint, el = document.getElementById("handHint");
      if (el && el.classList.contains("hide") === hint) {
        el.classList.toggle("hide", !hint);
        el.textContent = HAND.cur === "R" ? "LEFTY? TAKE A PRACTICE SWING" : "RIGHTY? TAKE A PRACTICE SWING";
      }
    }
    if (REAL) {
      for (const k of ["R", "L"]) {
        FIGS[k].enabled = false;
        FIGS[k].update(now);
        FIGS[k].plane.visible = false;
        if (FIGS[k].objects[3]) FIGS[k].objects[3].visible = false;
        CLUBS[k].g.visible = false;
      }
      AV.grp.visible = false;
      if (!RGOLF || !RGOLF.ready) {
        G.hand = HAND.cur;
        G.handManual = HAND.manual;
        return;
      }
      const r = RGOLF.update(now, rdt, { phase: G.swing ? G.swing.phase : "" });
      G.hand = HAND.cur;
      G.handManual = HAND.manual;
      G.real = r && { th: Math.round(r.R.th), tilt: Math.round(r.R.tilt), turn: Math.round(r.R.turn), side: +r.R.sideOn.toFixed(2) };
      return;
    }
    const F = FIGS[HAND.cur], C = CLUBS[HAND.cur], s = HAND.cur === "L" ? -1 : 1;
    F.update(now);
    if (F.newFrame || C.base === void 0) C.base = F.plane.position.x;
    const on = cam.mode === "tee", B = F.pose;
    const atBall = on && (sw === "idle" || sw === "address") && !!B && B.n[1] - (B.lP[1] + B.rP[1]) / 2 > 0.38;
    if (B && (atBall || C.hx === void 0)) C.hx = C.hx === void 0 ? B.hM[0] - C.base : C.hx + (B.hM[0] - C.base - C.hx) * (1 - Math.exp(-rdt * 3));
    facePlace(F.plane, C.hx || 0, s, camera.position);
    const spot = faceSpot(s), blob2 = F.objects[3];
    if (blob2) blob2.position.set(spot.x, blob2.position.y, spot.z);
    for (const k of ["R", "L"]) {
      FIGS[k].plane.visible = on && k === HAND.cur;
      if (FIGS[k].objects[3]) FIGS[k].objects[3].visible = on && k === HAND.cur;
      if (k !== HAND.cur) CLUBS[k].g.visible = false;
    }
    updateClub(HAND.cur, rdt, on, atBall);
    AV.grp.visible = F.opacity < 0.3 && (BP.mouse || !BP.img || !BP.img.lShoulder || performance.now() - (BP.imgAt || 0) > 1500);
    G.hand = HAND.cur;
    G.handManual = HAND.manual;
    G.stance = { score: +STANCE.S.score.toFixed(2), side: STANCE.S.side, why: STANCE.S.why };
    G.fig = { opacity: +F.opacity.toFixed(2), club: CLUBS[HAND.cur].tipW && CLUBS[HAND.cur].tipW.map((v) => +v.toFixed(2)), x: +F.plane.position.x.toFixed(2), z: +F.plane.position.z.toFixed(2), on, dbg: CLUBS[HAND.cur].dbg };
  }
  function updateBallVisuals() {
    const p = ball.position;
    const sY = surfaceY(p.x, p.z);
    blob.position.set(p.x, 0.012 + sY, p.z);
    const h = Math.max(0, p.y - BALL_R - sY);
    blob.scale.setScalar(0.06 + h * 0.3);
    blob.material.opacity = clamp(1 - h / 1.5) * (p.y < 0 ? 0 : 1);
    const d = camera.position.distanceTo(p);
    halo.position.copy(p);
    const sz = Math.max(0.06, d * 0.028);
    halo.scale.set(sz, sz, 1);
    const flying = (G.state === "flight" || G.state === "replay") && ball.visible && p.y > -0.01;
    halo.material.opacity = flying ? clamp((d - 1.5) / 6) * 0.95 : 0;
    halo.visible = halo.material.opacity > 0.01;
    halo.material.color.set(G.shot && G.shot.moon ? 16757568 : 16777215);
  }
  function step(now, rdt, gdt) {
    switch (G.state) {
      case "title":
        break;
      case "stepup":
        cam.mode = "tee";
        readHands();
        if (G.stateT > 2.2) {
          $("stepup").classList.add("hide");
          setState("address");
          announce();
        }
        break;
      case "address":
        cam.mode = "tee";
        G.shotClock -= rdt;
        swingUpdate(now, rdt);
        if (G.shotClock <= 0 && G.state === "address") {
          const P = G.players[G.cur];
          P.results.push({ pts: 0, ring: "SKIPPED" });
          P.missStreak++;
          G.last = { ring: "SKIPPED", pts: 0 };
          banner("TOO SLOW", "BALL SKIPPED", "soft");
          nextTurn(1.6);
        }
        break;
      case "flight":
        flight(gdt, false);
        break;
      case "result":
        cam.mode = "result";
        if (G.stateT > G._resultHold) {
          advance();
        }
        break;
      case "replay":
        flight(gdt, true);
        break;
      case "end":
        break;
    }
  }
  function flight(gdt, isReplay) {
    const sh = G.shot;
    if (!sh) return;
    cam.mode = isReplay ? "replay" : "flight";
    let ts = 1;
    {
      const d = sh.t - sh.landT;
      if (d > -0.5 && d < 0.5) ts = 0.55;
    }
    if (sh.great || isReplay) {
      const d = sh.t - sh.landT;
      if (d > -0.7 && d < 1) ts = d < -0.5 ? lerp(1, 0.28, (d + 0.7) / 0.2) : 0.28;
    }
    if (sh.moon && Math.abs(sh.t - sh.apexT) < 0.5) ts = Math.min(ts, 0.45);
    if (sh.t > sh.landT + 1 && !isReplay) ts = sh.great ? lerp(G.timeScale, 1, 0.05) : 1.6;
    G.timeScale = lerp(G.timeScale, ts, 0.18);
    if (!isReplay && sh.t < IMPACT_T) G.timeScale = IMPACT_TS;
    else if (!isReplay && sh.t < IMPACT_T + 0.25) G.timeScale = Math.min(G.timeScale, lerp(IMPACT_TS, 1, (sh.t - IMPACT_T) / 0.25));
    sh.t = Math.min(sh.endT, sh.t + gdt);
    const B = pathAt(sh, sh.t);
    ball.position.copy(B);
    ball.position.y += surfaceY(B.x, B.z) * clamp(1 - (B.y - BALL_R) / 0.8);
    ball.rotation.x -= gdt * 40;
    updateTracer(sh.path, Math.min(sh.path.length - 1, Math.floor(sh.t * 120)), sh.moon);
    if (!sh.landedFx && sh.t >= sh.landT) {
      sh.landedFx = true;
      sfx.land(0.8);
      if (sh.great) shake(0.2);
    }
    if (sh.t >= sh.endT) {
      if (isReplay) {
        if (!sh._doneT) sh._doneT = performance.now();
        if (performance.now() - sh._doneT > 1600) finishReplay();
        return;
      }
      resolveShot(sh);
    }
  }
  function resolveShot(sh) {
    const P = G.players[G.cur], res = sh.res;
    G.timeScale = 1;
    bokeh.enabled = state().quality.tier >= 1;
    P.score += res.pts;
    P.results.push({ pts: res.pts, ring: res.ring, carry: res.carry });
    P.missStreak = res.T ? 0 : P.missStreak + 1;
    const yd = Math.round(res.total * YD);
    if (res.ring === "JACKPOT") {
      banner("JACKPOT!", "HOLE IN ONE! +".concat(res.pts));
      sfx.cup();
      setTimeout(sfx.jackpot, 250);
      flash(16765562, 0.45);
      shake(0.6);
    } else if (res.ring === "CUP") {
      banner("IN THE CUP!", "+".concat(res.pts, " POINTS"));
      sfx.cup();
      setTimeout(() => sfx.cheer(2), 200);
      flash(16777215, 0.3);
    } else if (res.ring === "BULLSEYE") {
      banner("BULLSEYE!", "+".concat(res.pts, " POINTS"));
      sfx.cheer(1.6);
      flash(res.T.color.getHex(), 0.2);
    } else if (res.T) {
      banner(res.ring === "INNER RING" ? "NICE SHOT!" : "ON THE GREEN", "+".concat(res.pts, " POINTS"), "cool");
      sfx.cheer(res.ring === "INNER RING" ? 1.1 : 0.7);
    } else {
      banner(yd < 25 ? "WHIFF-ISH!" : "SO CLOSE", "SWING FASTER THROUGH THE BOTTOM", "soft");
      sfx.aww();
    }
    if (res.T) res.T._flash = 1.4;
    G.shots.push(sh);
    if (!G.top || res.pts > G.top.res.pts || res.pts === G.top.res.pts && res.total > G.top.res.total) G.top = sh;
    renderBoard();
    cam.landPos = null;
    nextTurn(res.T ? 2.6 : 2);
  }
  function nextTurn(hold) {
    G._resultHold = hold;
    setState("result");
  }
  function advance() {
    const P = G.players[G.cur];
    void P;
    cam.landPos = null;
    if (G.cur < G.nPlayers - 1) G.cur++;
    else {
      G.cur = 0;
      G.ball++;
    }
    if (G.ball >= G.balls) {
      startReplay();
      return;
    }
    cam.mode = "tee";
    cam.pos.copy(FACE_CAM.pos);
    cam.look.copy(FACE_CAM.look);
    newTurn(false);
  }
  function startReplay() {
    MOVER.active = false;
    MOVER.group.visible = false;
    const sh = G.top;
    if (!sh || sh.res.pts <= 0 || QS.has("noreplay")) {
      endGame();
      return;
    }
    if (sh.c0 !== void 0 && sh.res.T === MOVER) {
      MOVER.active = true;
      MOVER.group.visible = true;
    }
    G.clock = sh.c0;
    sh.t = 0;
    sh._doneT = 0;
    cam.landPos = null;
    cam.pos.set(0, 2, 5);
    cam.mode = "replay";
    G.event = sh.moon ? "MOONSHOT" : "";
    resetBall();
    tee.visible = teeCup.visible = false;
    $("replayTag").classList.remove("hide");
    bokeh.enabled = state().quality.tier >= 1;
    sfx.banner();
    setState("replay");
    setTimeout(() => {
      if (G.state === "replay") sfx.cheer(1.4);
    }, 2600);
  }
  function finishReplay() {
    $("replayTag").classList.add("hide");
    endGame();
  }
  function endGame() {
    setState("end");
    G.timeScale = 1;
    cam.mode = "title";
    bokeh.enabled = false;
    clearTracer();
    $("replayTag").classList.add("hide");
    $("board").classList.add("hide");
    $("ballTag").classList.add("hide");
    $("stepup").classList.add("hide");
    const ranked = G.players.map((P, i) => ({ ...P, i })).sort((a, b) => b.score - a.score);
    const top = ranked[0];
    G.score = top.score;
    if (!G.saved) {
      G.best0 = BP.best("golf");
      BP.saveSession({ game: "golf", score: top.score });
      if (BP.highScores) BP.highScores("golf", top.score);
      G.saved = true;
      G.endActive = G.lastActive;
    }
    $("endWin").textContent = G.nPlayers > 1 ? "".concat(top.name, " WINS!") : top.score > (G.best0 || 0) ? "NEW BEST!" : "FINAL SCORE";
    $("endWin").style.color = G.nPlayers > 1 ? top.col : "#ffd9a8";
    $("endScore").textContent = top.score;
    $("endRow").innerHTML = G.nPlayers > 1 ? ranked.map((P) => '<span style="color:'.concat(P.col, '">P').concat(P.i + 1, " &nbsp;").concat(P.score, "</span>")).join("") : "";
    $("end").classList.remove("hide");
    sfx.cheer(1.2);
  }
  G.lastActive = { sec: 0, kcal: 0 };
  setInterval(() => {
    if (G.state !== "end" && G.state !== "title") G.lastActive = { sec: BP.activity.activeSec, kcal: BP.activity.kcal };
  }, 250);
  function placeTop() {
    const bd = $("board"), bt = $("ballTag"), on = !bd.classList.contains("hide");
    const mus = document.getElementById("bp-music"), mr = mus && mus.getClientRects().length && getComputedStyle(mus).display !== "none" ? mus.getBoundingClientRect() : null;
    const mw = mr && mr.width && mr.left > innerWidth / 2 && mr.top < innerHeight * 0.2 ? innerWidth - mr.left + Math.max(8, Math.min(innerWidth, innerHeight) * 0.012) : 0;
    if (on) {
      const L = window.BPUI ? BPUI.top(bd.offsetWidth, bd.offsetHeight, bt.offsetWidth + mw, Math.max(bt.offsetHeight, mr ? mr.height : 0)) : null;
      if (L) {
        bd.style.left = L.c.x + "px";
        bd.style.top = L.c.y + "px";
        bt.style.left = L.r.x + "px";
        bt.style.top = L.r.y + (mr ? Math.max(0, (mr.height - bt.offsetHeight) / 2) : 0) + "px";
        G.topBottom = L.bottom;
      }
    }
    const rt = $("replayTag");
    if (!rt.classList.contains("hide") && window.BPUI) {
      const p = BPUI.bottom(rt.offsetWidth, rt.offsetHeight);
      rt.style.left = p.x + "px";
      rt.style.top = p.y + "px";
    }
  }
  let hudR = [];
  BP.tips && BP.tips({
    accent: "#ffd36b",
    avoid: () => hudR,
    avoidSel: "#board, #ballTag, #replayTag",
    when: () => G.state === "address" && !BP.mouse
  });
  function liveTips() {
    if (!BP.tip || G.state !== "address" || BP.mouse) return;
    const ph = G.swing.phase;
    if (ph === "back") BP.tip("tempo", "Now down fast: about 3 times quicker than your backswing", 500, { hot: true });
    else if (ph === "idle" || ph === "address") {
      BP.tip("tempo", "Tempo: take it back slowly, then swing down 3 times faster. Straighter and farther", 500);
    }
    if (G.shotClock > 6) BP.tip("far", "Points: farther greens are worth up to ×3, the gold cup is 500", 500);
  }
  let CARRY = null;
  function carryAt(p) {
    if (!CARRY) {
      CARRY = [];
      for (let i2 = 0; i2 <= 10; i2++) {
        const pw = i2 / 10, sh = simulateShot({ v0: 14 + 47 * pw, launch: 21 * Math.PI / 180, yaw: 0, spin: 4e3, tilt: 0, wind: { x: 0, z: 0 } }, 0);
        CARRY.push(Math.hypot(sh.end.x, sh.end.z));
      }
    }
    const f = clamp(p) * 10, i = Math.min(9, Math.floor(f));
    return lerp(CARRY[i], CARRY[i + 1], f - i);
  }
  const PWR = { shown: 0 };
  function powerNow() {
    const S = G.swing;
    if (G.state === "address" && S) {
      if (S.phase === "back") return 0.85 * Math.pow(clamp(S.backAmt), 0.8);
      if (S.phase === "down" || S.phase === "follow") return clamp(clamp((Math.max(S.peak || 0, HP.speed) - 0.35) / 1.65) * (0.55 + 0.45 * S.backAmt));
      return 0;
    }
    if ((G.state === "flight" || G.state === "result") && G.last && G.last.power !== void 0) return G.last.power;
    return 0;
  }
  function aimTarget(p, preview) {
    const want = carryAt(p);
    let best = null, bd = 1e9;
    for (const T of TARGETS) {
      if (!T.active || preview && T.gold) continue;
      const d = Math.abs(Math.hypot(T.x, T.z) - want) / (T.r + 6);
      if (d < bd) {
        bd = d;
        best = T;
      }
    }
    return best;
  }
  function drawAim(W, H, U, power) {
    const P = G.players[G.cur], p = power > 0.06 ? power : P && P.lastPow || 0.45, T = aimTarget(p, power <= 0.06);
    G.aim = null;
    if (!T) return null;
    const pr = (x, z, y = 0.03) => {
      const v = new Vector3(x, surfaceY(x, z) + y, z).project(camera);
      return v.z < 1 ? [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H] : null;
    };
    const end = [T.x, T.z], len = Math.hypot(end[0], end[1]), N = 48, pts = [], k0 = 0.45 / len;
    for (let i = 0; i <= N; i++) {
      const k = k0 + (1 - k0) * Math.pow(i / N, 1.6), q = pr(end[0] * k, end[1] * k);
      if (q) pts.push(q);
    }
    const bq = (() => {
      const v = ball.position.clone().project(camera);
      return v.z < 1 ? [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H] : null;
    })();
    if (bq && ball.visible) {
      const rr = 1.5 * U;
      ctx.save();
      ctx.lineWidth = 0.7 * U;
      ctx.strokeStyle = "rgba(0,0,0,.45)";
      ctx.beginPath();
      ctx.arc(bq[0], bq[1], rr, 0, 6.283);
      ctx.stroke();
      ctx.lineWidth = 0.32 * U;
      ctx.strokeStyle = "#fff";
      ctx.stroke();
      ctx.restore();
    }
    if (pts.length < 2) return null;
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let i = 0; i < pts.length - 1; i++) {
      const w = lerp(1.1, 0.25, i / (pts.length - 1)) * U;
      ctx.strokeStyle = "rgba(0,0,0,.35)";
      ctx.lineWidth = w * 2.2;
      ctx.beginPath();
      ctx.moveTo(...pts[i]);
      ctx.lineTo(...pts[i + 1]);
      ctx.stroke();
      ctx.strokeStyle = T.col;
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = w * 1.4;
      ctx.beginPath();
      ctx.moveTo(...pts[i]);
      ctx.lineTo(...pts[i + 1]);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.setLineDash([1.6 * U, 2.2 * U]);
    ctx.lineDashOffset = -(performance.now() / 1e3) * 6 * U;
    ctx.strokeStyle = "rgba(255,255,255,.95)";
    ctx.lineWidth = 0.35 * U;
    ctx.beginPath();
    pts.forEach((q, i) => i ? ctx.lineTo(...q) : ctx.moveTo(...q));
    ctx.stroke();
    ctx.setLineDash([]);
    if (power > 0.06) {
      const d = Math.min(carryAt(power), len * 1.35), k = d / len, cx = end[0] * k, cz = end[1] * k, r = Math.max(2.2, d * 0.035), ring = [];
      for (let i = 0; i <= 28; i++) {
        const a = i / 28 * 6.283, q = pr(cx + Math.cos(a) * r, cz + Math.sin(a) * r, 0.05);
        if (q) ring.push(q);
      }
      if (ring.length > 4) {
        ctx.lineWidth = 0.6 * U;
        ctx.strokeStyle = "rgba(0,0,0,.45)";
        ctx.beginPath();
        ring.forEach((q, i) => i ? ctx.lineTo(...q) : ctx.moveTo(...q));
        ctx.stroke();
        ctx.lineWidth = 0.3 * U;
        ctx.strokeStyle = "#fff";
        ctx.stroke();
      }
    }
    ctx.restore();
    G.aim = { target: T.name, ball: bq && bq.map((v) => Math.round(v / PR)), start: pts[0].map((v) => Math.round(v / PR)), end: pts[pts.length - 1].map((v) => Math.round(v / PR)) };
    return T;
  }
  function powerRect() {
    const Wc = innerWidth, Hc = innerHeight, vm = Math.min(Wc, Hc) / 100, w = Math.max(58, 8 * vm), h = Math.max(170, 36 * vm), m = Math.max(12, 2.4 * vm);
    let x = Wc - m - w, y = Math.max((G.topBottom || 0) + m, Hc * 0.5 - h / 2);
    const cam2 = document.getElementById("bp-cam");
    if (cam2 && cam2.offsetParent !== null) {
      const c = cam2.getBoundingClientRect();
      if (c.width && x < c.right && x + w > c.left && y + h > c.top - m && y < c.bottom) y = c.top - m - h;
    }
    return { x, y, w, h };
  }
  window.__golfPower = () => powerRect();
  function drawPower(U, v) {
    const r = powerRect(), x = r.x * PR, y = r.y * PR, w = r.w * PR, h = r.h * PR, fs = Math.max(11 * PR, 1.7 * U);
    ctx.save();
    ctx.fillStyle = "rgba(10,12,24,.55)";
    ctx.strokeStyle = "rgba(255,255,255,.18)";
    ctx.lineWidth = PR;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, w * 0.3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.font = "800 ".concat(fs, "px -apple-system, system-ui, sans-serif");
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("POWER", x + w / 2, y + fs * 1.3, w - fs * 0.6);
    const bx = x + w * 0.3, bw = w * 0.4, by = y + fs * 2.4, bh = h - fs * 2.4 - fs * 2.4;
    ctx.fillStyle = "rgba(255,255,255,.12)";
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, bw / 2);
    ctx.fill();
    if (v > 5e-3) {
      const fh = Math.max(bw, bh * clamp(v)), gr = ctx.createLinearGradient(0, by + bh, 0, by);
      gr.addColorStop(0, "#5fe08a");
      gr.addColorStop(0.55, "#ffd36b");
      gr.addColorStop(1, "#ff5f6f");
      ctx.fillStyle = gr;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, bw / 2);
      ctx.clip();
      ctx.fillRect(bx, by + bh - fh, bw, fh);
      ctx.restore();
    }
    ctx.font = "900 ".concat(fs * 1.15, "px -apple-system, system-ui, sans-serif");
    ctx.fillStyle = v > 5e-3 ? "#ffd36b" : "rgba(255,255,255,.55)";
    ctx.fillText(v > 5e-3 ? Math.round(clamp(v) * 100) + "%" : "0%", x + w / 2, y + h - fs * 1.2, w - fs * 0.4);
    ctx.restore();
    return r;
  }
  const _gzV = new Vector3(), TAGHOLD = /* @__PURE__ */ new Map();
  let _gz = null;
  function golferZone() {
    const P = REAL && RGOLF && RGOLF.ready && RGOLF.st.person;
    if (!P || !P.root.visible || P.opacity < 0.1) return _gz = null;
    const sw = G.swing ? G.swing.phase : "idle";
    if (_gz && (sw !== "idle" && sw !== "address" || G.swing && G.swing.tBack)) return _gz;
    let l = 1e9, r = -1e9, t = 1e9, btm = -1e9, n = 0, dist = 0;
    for (const b of Object.values(P.bones)) {
      b.getWorldPosition(_gzV);
      dist += _gzV.distanceTo(camera.position);
      n++;
      _gzV.project(camera);
      if (_gzV.z > 1) continue;
      const x = (_gzV.x + 1) / 2 * innerWidth, y = (1 - _gzV.y) / 2 * innerHeight;
      l = Math.min(l, x);
      r = Math.max(r, x);
      t = Math.min(t, y);
      btm = Math.max(btm, y);
    }
    if (!(l < r)) return _gz = null;
    const pad = 0.16 / (2 * (dist / n) * Math.tan(camera.fov * Math.PI / 360)) * innerHeight;
    return _gz = window.__golfZone = { left: l - pad, right: r + pad, top: t - pad * 1.3, bottom: btm + pad };
  }
  function drawHud(now, rdt) {
    const W = hud.width, H = hud.height, U = Math.min(W, H) / 100;
    ctx.clearRect(0, 0, W, H);
    const font = (w, s) => "".concat(w, " ").concat(s * U, "px -apple-system, system-ui, sans-serif");
    const S = G.swing;
    placeTop();
    hudR = [];
    if (performance.now() - bannerT < 2300) for (const e of $("banner").querySelectorAll(".big, .small")) {
      const rg = document.createRange();
      rg.selectNodeContents(e);
      const r = rg.getBoundingClientRect();
      if (r.width) hudR.push(r);
    }
    let bz = null;
    if (performance.now() - bannerT < 2300) {
      const a = $("banner").querySelector(".big").getBoundingClientRect(), b = $("banner").querySelector(".small").getBoundingClientRect();
      bz = { left: 0, right: innerWidth, top: a.top, bottom: Math.max(a.bottom, b.bottom) };
    }
    const gz = golferZone(), cz = window.BPUI ? BPUI.camZone() : null, coach = window.BPUI ? BPUI.coachZone() : null, topB = ((G.topBottom || 0) + 10) * PR;
    const pv = powerNow();
    PWR.shown += (pv - PWR.shown) * (1 - Math.exp(-rdt * (pv > PWR.shown ? 18 : 5)));
    G.power = +PWR.shown.toFixed(2);
    const showAim = G.state === "address" || G.state === "stepup", aimT = showAim ? drawAim(W, H, U, PWR.shown) : null;
    let pz = null;
    if (showAim || G.state === "flight" && G.shot && G.shot.t < 0.6) {
      const r = drawPower(U, PWR.shown);
      pz = { left: r.x, right: r.x + r.w, top: r.y, bottom: r.y + r.h };
      hudR.push({ x: r.x, y: r.y, w: r.w, h: r.h });
    }
    if (G.state === "address" || G.state === "stepup" || G.state === "flight" && G.shot && G.shot.t < 0.6) {
      const placed = [];
      window.__golfTags = placed;
      const swp = G.swing ? G.swing.phase : "idle", holdTags = swp === "back" || swp === "down" || swp === "follow" || swp === "address" && !!G.swing.tBack;
      if (G.state !== "flight") for (const T of [...TARGETS].sort((a, b) => a.dist - b.dist)) {
        if (!T.active) continue;
        const v = new Vector3(T.x, T.top, T.z).project(camera);
        if (v.z > 1) continue;
        const x = (v.x + 1) / 2 * W, fy = (1 - v.y) / 2 * H, label = T.gold ? "JACKPOT" : "×".concat(T.mult);
        ctx.font = font(900, 2.6);
        const pw = Math.max(ctx.measureText(label).width + 2.6 * U, 7 * U), ph = 4.4 * U;
        const inZ = (z, cx, cy) => z && cx + pw / 2 > z.left * PR - U && cx - pw / 2 < z.right * PR + U && cy > z.top * PR - U && cy - ph < z.bottom * PR + U;
        const inCam = (cx, cy) => inZ(cz, cx, cy) || inZ(coach, cx, cy) || inZ(bz, cx, cy) || inZ(pz, cx, cy) || inZ(gz, cx, cy);
        const tipR = BP.tips && BP.tips.active ? BP.tips.active().map((q) => q.rect) : [], onTip = (cx, cy) => tipR.some((r) => cx + pw / 2 > (r.left - 8) * PR && cx - pw / 2 < (r.right + 8) * PR && cy > (r.top - 8) * PR && cy - ph < (r.bottom + 8) * PR);
        const hitsLine = (r, a, b) => {
          for (let i = 0; i <= 12; i++) {
            const qx = a[0] + (b[0] - a[0]) * i / 12, qy = a[1] + (b[1] - a[1]) * i / 12;
            if (qx > r.l && qx < r.r && qy > r.t && qy < r.b) return true;
          }
          return false;
        };
        const G2 = 2.2 * U, gzD = gz && { l: gz.left * PR - U, r: gz.right * PR + U, t: gz.top * PR - U, b: gz.bottom * PR + U };
        let anchorIn = gzD && x > gzD.l && x < gzD.r && fy > gzD.t && fy < gzD.b;
        const cross = (a, b, c, d) => {
          const o = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
          return o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0;
        };
        const free = (cx, cy) => {
          if (onTip(cx, cy) || cy - ph < topB || cy > H * 0.8 || cx - pw / 2 < 2 * U || cx + pw / 2 > W - 2 * U || inCam(cx, cy)) return false;
          if (gzD && !anchorIn && hitsLine(gzD, [cx, cy], [x, fy + 0.4 * U])) return false;
          const me = { l: cx - pw / 2 - G2 / 2, r: cx + pw / 2 + G2 / 2, t: cy - ph - G2 / 2, b: cy + G2 / 2 };
          return !placed.some((p) => Math.abs(p.x - cx) < (p.w + pw) / 2 + G2 && Math.abs(p.y - cy) < ph + G2 || hitsLine(me, [p.x, p.y], p.f) || hitsLine({ l: p.x - p.w / 2, r: p.x + p.w / 2, t: p.y - ph, b: p.y }, [cx, cy], [x, fy + 0.4 * U]) || cross([p.x, p.y], p.f, [cx, cy], [x, fy + 0.4 * U]));
        };
        let lx = x, y = fy - 1.2 * U, bestC = 1e9;
        const hk = TAGHOLD.get(T);
        if (holdTags && hk) {
          if (hk.skip) continue;
          lx = hk.lx;
          y = hk.y;
          bestC = 0;
          anchorIn = hk.anchorIn;
        } else if (anchorIn) {
          const near = x - gzD.l < gzD.r - x ? [gzD.l - pw / 2 - G2, gzD.r + pw / 2 + G2] : [gzD.r + pw / 2 + G2, gzD.l - pw / 2 - G2];
          for (let k = 0; k < 2; k++) for (let dy = 0; dy <= 6; dy++) {
            const cy = fy + ph / 2 - (dy >> 1) * (dy & 1 ? -1 : 1) * (ph + 1.6 * U), cost = k * 10 + dy;
            if (cost < bestC && free(near[k], cy)) {
              bestC = cost;
              lx = near[k];
              y = cy;
            }
          }
        } else
          for (let dy = -3; dy <= 3; dy++) for (let dx = -4; dx <= 4; dx++) {
            const cx = x + dx * (pw * 0.55 + U), cy = fy - 1.2 * U - dy * (ph + 1.6 * U), cost = Math.abs(dx) + Math.abs(dy) * 2.5 + (dy < 0 ? 0.6 : 0);
            if (cost < bestC && free(cx, cy)) {
              bestC = cost;
              lx = cx;
              y = cy;
            }
          }
        if (!holdTags) TAGHOLD.set(T, { lx, y, anchorIn, skip: bestC === 1e9 });
        if (bestC === 1e9) continue;
        placed.push({ x: lx, y, w: pw, h: ph, f: [x, fy + 0.4 * U] });
        hudR.push({ x: (lx - pw / 2) / PR, y: (y - ph) / PR, w: pw / PR, h: ph / PR });
        if (!anchorIn) {
          ctx.strokeStyle = T.col;
          ctx.lineWidth = 0.3 * U;
          ctx.beginPath();
          ctx.moveTo(lx, y);
          ctx.lineTo(x, fy + 0.4 * U);
          ctx.stroke();
        }
        ctx.shadowColor = "rgba(0,0,0,.6)";
        ctx.shadowBlur = 1.2 * U;
        ctx.fillStyle = T.col;
        ctx.beginPath();
        ctx.roundRect(lx - pw / 2, y - ph, pw, ph, ph / 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        if (T === aimT) {
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 0.45 * U;
          ctx.stroke();
        }
        const dark = T.color.r * 0.3 + T.color.g * 0.59 + T.color.b * 0.11 > 0.45;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = dark ? "#121018" : "#fff";
        ctx.font = font(900, 2.6);
        ctx.fillText(label, lx, y - ph / 2);
        ctx.textBaseline = "alphabetic";
      }
    }
    let msg = "";
    if (G.state === "address") {
      if (G.shotClock < 6) msg = "Swing now!  ".concat(Math.max(1, Math.ceil(G.shotClock)));
      else msg = BP.mouse || !BP.live ? "Drag down, then fling up to swing" : S.phase === "idle" ? !HP.seen ? "Step into view" : "Get set: hands together, low, and hold still a moment" : S.phase === "address" ? "Swing back: a bigger backswing hits it farther" : S.phase === "back" ? "…now down and through, fast!" : "";
    }
    if (msg) {
      const fs = Math.max(15 * PR, 3.1 * U);
      ctx.font = "700 ".concat(fs, "px -apple-system, system-ui, sans-serif");
      const pw = Math.min(W - 4 * U, ctx.measureText(msg).width + fs * 2.4), ph = fs * 2.5;
      const p = window.BPUI ? BPUI.bottom(pw / PR, ph / PR) : { x: (W - pw) / 2 / PR, y: (H - ph) / PR - 12 }, px = p.x * PR, py = p.y * PR;
      hudR.push({ x: p.x, y: p.y, w: pw / PR, h: ph / PR });
      window.__golfPrompt = { x: p.x, y: p.y, w: pw / PR, h: ph / PR };
      ctx.beginPath();
      ctx.roundRect(px, py, pw, ph, ph / 2);
      ctx.fillStyle = "rgba(10,12,24,.55)";
      ctx.fill();
      ctx.strokeStyle = G.shotClock < 6 ? "#ff6b6b" : "rgba(255,255,255,.18)";
      ctx.lineWidth = PR;
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(msg, px + pw / 2, py + ph / 2, pw - fs * 1.6);
      ctx.textBaseline = "alphabetic";
    }
    G.ballScreen = null;
    if ((G.state === "flight" || G.state === "replay") && G.shot && ball.visible) {
      const v = ball.position.clone().project(camera), d = camera.position.distanceTo(ball.position);
      if (v.z < 1) {
        const x = (v.x + 1) / 2 * W, y = (1 - v.y) / 2 * H, px = BALL_R / (d * Math.tan(camera.fov * Math.PI / 360)) * H / 2;
        const on = x > 0 && x < W && y > 0 && y < H;
        G.ballScreen = { x: Math.round(x / PR), y: Math.round(y / PR), on, px: +(px / PR).toFixed(1) };
        if (on && px < 6 * PR && ball.position.y > 0.03) {
          const rr = 2.1 * U;
          ctx.lineWidth = 0.7 * U;
          ctx.strokeStyle = "rgba(0,0,0,.45)";
          ctx.beginPath();
          ctx.arc(x, y, rr, 0, 6.283);
          ctx.stroke();
          ctx.lineWidth = 0.32 * U;
          ctx.strokeStyle = G.shot.moon ? "#ffd36b" : "#fff";
          ctx.beginPath();
          ctx.arc(x, y, rr, 0, 6.283);
          ctx.stroke();
        }
      }
    }
    BP.drawHands(ctx, W, H, 0.8);
  }
  const dwellMs = { home: 1500, hand: 900, p1: 600, p2: 600, p3: 600, p4: 600 };
  function act(a) {
    sfx.blip();
    if (a === "home") {
      location.href = "index.html";
      return;
    }
    if (a === "chg") {
      pickPlayers();
      return;
    }
    if (a === "hand") {
      setHand(HAND.cur === "R" ? "L" : "R", true);
      return;
    }
    if (a[0] === "p") {
      selPlayers(+a[1]);
      return;
    }
    if (a === "start" || a === "again") {
      if (a === "again") {
        $("end").classList.add("hide");
      }
      startGame(G.nPlayers);
    }
  }
  function selPlayers(n) {
    G.nPlayers = n;
    try {
      localStorage.golf_players = n;
    } catch (_) {
    }
    $("pcLbl").textContent = n + (n > 1 ? " PLAYERS" : " PLAYER");
  }
  function pickPlayers() {
    BP.pick({
      title: "How many players?",
      sub: "Take turns with one phone",
      value: G.nPlayers > 2 ? "34" : String(G.nPlayers),
      options: [{ id: "1", label: "1 PLAYER" }, { id: "2", label: "2 PLAYERS" }, { id: "34", label: "3 OR 4", sub: "pick next" }],
      onPick: (id) => {
        if (id !== "34") return selPlayers(+id);
        BP.pick({ title: "How many players?", value: String(Math.max(3, G.nPlayers)), options: [{ id: "3", label: "3 PLAYERS" }, { id: "4", label: "4 PLAYERS" }], onPick: (v) => selPlayers(+v) });
      }
    });
  }
  selPlayers((() => {
    try {
      return Math.min(4, Math.max(1, +localStorage.golf_players || 1));
    } catch (_) {
      return 1;
    }
  })());
  document.querySelectorAll("[data-act]").forEach((b) => b.addEventListener("click", (e) => {
    e.stopPropagation();
    audio();
    act(b.dataset.act);
  }));
  function buttons(now) {
    for (const b of document.querySelectorAll("[data-act]")) {
      if (b.offsetParent === null && !b.closest(".screen:not(.hide)") && b.id !== "home") {
        b.style.setProperty("--fill", 0);
        continue;
      }
      if (b.classList.contains("hide") || b.closest(".hide")) {
        b.style.setProperty("--fill", 0);
        continue;
      }
      const r = b.getBoundingClientRect(), over = BP.handOver({ x: r.x, y: r.y, w: r.width, h: r.height }, innerWidth, innerHeight);
      const swinging = G.state === "flight" || G.state === "address" && G.swing && ["back", "down", "follow"].includes(G.swing.phase);
      const id = b.dataset.act, k = BP.dwell(id, over && !BP.mouse && !swinging, now, dwellMs[id] || 750);
      b.classList.toggle("over", over);
      b.style.setProperty("--fill", k >= 1 ? 1 : k);
      if (k >= 1) {
        audio();
        act(id);
      }
    }
  }
  addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      audio();
      if (G.state === "title") act("start");
      else if (G.state === "end") act("again");
      else if (G.state === "replay") finishReplay();
    } else if (G.state === "title" && /^[1-4]$/.test(e.key)) selPlayers(+e.key);
    else if (e.key === "Escape") location.href = "index.html";
  });
  setHand(HAND.cur);
  BP.start();
  G.ready = true;
  $("loading").style.opacity = 0;
  setTimeout(() => $("loading").remove(), 900);
  if (TV) setTimeout(() => {
    if (G.state === "title") act("start");
  }, 2e3);
  {
    MOVER.group.visible = true;
    bokeh.enabled = state().quality.tier >= 1;
    halo.material.opacity = 0.3;
    updateTracer([{ x: 0, y: 1, z: -5 }, { x: 0, y: 2, z: -10 }, { x: 0, y: 3, z: -15 }], 2, false);
    renderer.compile(scene, camera);
    render(1 / 60);
    render(1 / 60);
    MOVER.group.visible = MOVER.active;
    bokeh.enabled = false;
    halo.material.opacity = 0;
    clearTracer();
  }
  {
    const q = state().quality;
    q.t0 = performance.now() + 500;
    q.frames = 0;
  }
  requestAnimationFrame(frame);
  G.photoOnly = (on) => scene.children.forEach((o) => {
    if (o !== sky && !o.isLight) o.visible = !on;
  });
  G.TARGETS = TARGETS;
  G.debugCam = (p, l, fov) => {
    cam.mode = "debug";
    camera.position.set(...p);
    camera.lookAt(...l);
    sun2.target.position.set(l[0], 0, l[2]);
    sun2.position.set(l[0], 0, l[2]).addScaledVector(sunDir, 70);
    if (fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  };
  G.endGame = endGame;
  G.say = banner;
  G.R = realism_exports;
  G.cam = cam;
  G.simulateShot = simulateShot;
  G.HP = HP;
  G.avatar = AV;
  G.ballMesh = ball;
  G.blob = blob;
})().catch((e) => setTimeout(() => {
  throw e;
}));
