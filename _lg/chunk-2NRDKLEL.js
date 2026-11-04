import {
  MeshoptDecoder
} from "./chunk-2BP775VP.js";
import {
  GLTFLoader
} from "./chunk-CPYHHAA5.js";
import {
  AddEquation,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CapsuleGeometry,
  CircleGeometry,
  Color,
  ConeGeometry,
  CustomBlending,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Float32BufferAttribute,
  FogExp2,
  Group,
  HemisphereLight,
  InstancedMesh,
  Line,
  LineBasicMaterial,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  OneFactor,
  OneMinusSrcAlphaFactor,
  PlaneGeometry,
  Quaternion,
  RepeatWrapping,
  SRGBColorSpace,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  SrcAlphaFactor,
  Vector2,
  Vector3,
  ZeroFactor
} from "./chunk-4IYDSAYK.js";

// dist/wolfstrike/world.js
var ASSETS = new URL("../assets/", new URL("wolfstrike/world.js", location.href).href).href;
var MODELS = ASSETS + "wolfstrike/models/";
var gl = new GLTFLoader();
gl.setMeshoptDecoder(MeshoptDecoder);
var modelCache = {};
function loadModel(name) {
  return modelCache[name] || (modelCache[name] = gl.loadAsync(MODELS + name + ".glb").then((g) => {
    keepAll(g.scene);
    return g.scene;
  }));
}
var TEX_SLOTS = ["map", "normalMap", "roughnessMap", "aoMap", "metalnessMap", "emissiveMap", "alphaMap", "clearcoatNormalMap"];
function keepAll(obj) {
  obj.traverse((o) => {
    if (o.geometry) o.geometry.userData.keep = true;
    for (const m of [].concat(o.material || [])) keepMat(m);
  });
  return obj;
}
function keepMat(m) {
  if (!m) return m;
  m.userData.keep = true;
  for (const k of TEX_SLOTS) if (m[k]) m[k].userData.keep = true;
  return m;
}
function freeObject(obj) {
  obj.traverse((o) => {
    if (o.isSkinnedMesh) return;
    if (o.geometry && !o.geometry.userData.keep) o.geometry.dispose();
    for (const m of [].concat(o.material || [])) {
      if (!m || m.userData.keep) continue;
      for (const k of TEX_SLOTS) if (m[k] && !m[k].userData.keep) m[k].dispose();
      if (m.uniforms) {
        for (const u of Object.values(m.uniforms)) if (u && u.value && u.value.isTexture && !u.value.userData.keep) u.value.dispose();
      }
    }
  });
  obj.removeFromParent();
}
function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}
function noise2(seed) {
  const r = rng(seed), P = new Float32Array(512);
  for (let i = 0; i < 512; i++) P[i] = r();
  const h = (x, z) => P[(x * 73856093 ^ z * 19349663) & 511];
  return (x, z) => {
    const xi = Math.floor(x), zi = Math.floor(z), fx = x - xi, fz = z - zi, sx = fx * fx * (3 - 2 * fx), sz = fz * fz * (3 - 2 * fz);
    const a = h(xi, zi), b = h(xi + 1, zi), c = h(xi, zi + 1), d = h(xi + 1, zi + 1);
    return a + (b - a) * sx + (c + (d - c) * sx - (a + (b - a) * sx)) * sz;
  };
}
var wind = { t: { value: 0 }, strength: { value: 1 } };
function windMat(mat, { amp = 0.08, freq = 1.3, heightScale = 1, instanced = true } = {}) {
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uWindT = wind.t;
    sh.uniforms.uWindS = wind.strength;
    sh.vertexShader = "uniform float uWindT; uniform float uWindS;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n      {\n        vec3 wp = ".concat(instanced ? "(instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz" : "vec3(0.0)", ";\n        float hgt = max(0.0, position.y * ").concat(heightScale.toFixed(3), ");\n        float ph = wp.x * 0.35 + wp.z * 0.21;\n        float sway = (sin(uWindT * ").concat(freq.toFixed(3), " + ph) * 0.7 + sin(uWindT * ").concat((freq * 2.3).toFixed(3), " + ph * 1.7) * 0.3) * uWindS;\n        transformed.x += sway * ").concat(amp.toFixed(3), " * hgt * hgt;\n        transformed.z += cos(uWindT * ").concat((freq * 0.8).toFixed(3), " + ph) * ").concat((amp * 0.4).toFixed(3), " * hgt * hgt * uWindS;\n      }"));
  };
  mat.customProgramCacheKey = () => "wind" + amp + freq + heightScale + instanced;
  return mat;
}
function softSprite(size = 128, hard = 0) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  const r = size / 2, im = g.createImageData(size, size), rn = rng(7);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const d = Math.hypot(x - r, y - r) / r, n = 0.75 + 0.25 * rn();
    const a = Math.max(0, 1 - d);
    const v = Math.pow(a, 1.6 - hard) * n;
    const i = (y * size + x) * 4;
    im.data[i] = im.data[i + 1] = im.data[i + 2] = 255;
    im.data[i + 3] = Math.round(255 * Math.min(1, v));
  }
  g.putImageData(im, 0, 0);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}
var _smokeTex = null;
function smokeTexture() {
  if (_smokeTex) return _smokeTex;
  const S = 256, c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d"), r = rng(3);
  for (let i = 0; i < 22; i++) {
    const x = S * (0.3 + 0.4 * r()), y = S * (0.3 + 0.4 * r()), rad = S * (0.12 + 0.18 * r());
    const gr2 = g.createRadialGradient(x, y, 0, x, y, rad);
    gr2.addColorStop(0, "rgba(255,255,255,".concat(0.16 + 0.1 * r(), ")"));
    gr2.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr2;
    g.fillRect(0, 0, S, S);
  }
  const gr = g.createRadialGradient(S / 2, S / 2, S * 0.2, S / 2, S / 2, S / 2);
  gr.addColorStop(0, "rgba(0,0,0,0)");
  gr.addColorStop(1, "rgba(0,0,0,1)");
  g.globalCompositeOperation = "destination-out";
  g.fillStyle = gr;
  g.fillRect(0, 0, S, S);
  _smokeTex = new CanvasTexture(c);
  _smokeTex.colorSpace = SRGBColorSpace;
  _smokeTex.userData.keep = true;
  return _smokeTex;
}
var glowTexture = /* @__PURE__ */ (() => {
  let t = null;
  return () => {
    if (!t) {
      t = softSprite(128, 0.6);
      t.userData.keep = true;
    }
    return t;
  };
})();
function keepAlpha(m, additive = false) {
  Object.assign(m, {
    blending: CustomBlending,
    blendEquation: AddEquation,
    blendSrc: SrcAlphaFactor,
    blendDst: additive ? OneFactor : OneMinusSrcAlphaFactor,
    blendEquationAlpha: AddEquation,
    blendSrcAlpha: ZeroFactor,
    blendDstAlpha: OneFactor
  });
  return m;
}
async function horizonColour(name) {
  try {
    const img = await new Promise((res, rej) => {
      const i = new Image();
      i.crossOrigin = "anonymous";
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = "".concat(ASSETS, "backdrops/").concat(name, "_1k.jpg");
    });
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 128;
    const g = c.getContext("2d");
    g.drawImage(img, 0, 0, 256, 128);
    const d = g.getImageData(0, 60, 256, 6).data;
    let r = 0, gg = 0, b = 0, n = 0;
    for (let i = 0; i < d.length; i += 4) {
      r += d[i];
      gg += d[i + 1];
      b += d[i + 2];
      n++;
    }
    return new Color("rgb(".concat(Math.round(r / n), ",").concat(Math.round(gg / n), ",").concat(Math.round(b / n), ")"));
  } catch (_) {
    return new Color(10134696);
  }
}
function instanceModel(scene, root, mats, { shadow = true, windOpts = null, parent } = {}) {
  root.updateMatrixWorld(true);
  const out = [];
  root.traverse((o) => {
    if (!o.isMesh) return;
    const geo = floatGeo(o.geometry).applyMatrix4(o.matrixWorld);
    let mat = o.material;
    if (windOpts) {
      mat = mat.clone();
      windMat(mat, windOpts);
    }
    if (mat.map) mat.map.anisotropy = 4;
    if (mat.transparent && mat.alphaTest === 0) {
      mat.alphaTest = 0.4;
      mat.transparent = false;
    }
    const im = new InstancedMesh(geo, mat, mats.length);
    mats.forEach((m, i) => im.setMatrixAt(i, m));
    im.castShadow = shadow;
    im.receiveShadow = true;
    im.instanceMatrix.needsUpdate = true;
    im.computeBoundingSphere();
    (parent || scene).add(im);
    out.push(im);
  });
  return out;
}
function floatGeo(g0) {
  const g = new BufferGeometry();
  for (const [name, a] of Object.entries(g0.attributes)) {
    const n = a.count, k = a.itemSize, out = new Float32Array(n * k);
    for (let i = 0; i < n; i++) {
      out[i * k] = a.getX(i);
      if (k > 1) out[i * k + 1] = a.getY(i);
      if (k > 2) out[i * k + 2] = a.getZ(i);
      if (k > 3) out[i * k + 3] = a.getW(i);
    }
    g.setAttribute(name, new BufferAttribute(out, k));
  }
  if (g0.index) g.setIndex(g0.index.clone());
  return g;
}
var M4 = (x, y, z, ry = 0, s = 1, sy) => new Matrix4().compose(new Vector3(x, y, z), new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), ry), new Vector3(s, sy != null ? sy : s, s));
var GROUND = {
  radio: { grass: "withered_grass", tint: 13155484, dirt: 0.62, dirtTint: 11838604, blades: [13482104, 9337412], dens: 1, tall: 0.55 },
  jungle: { grass: "leafy_grass", tint: 12108960, dirt: 0.7, dirtTint: 11049602, blades: [7315002, 3955234], dens: 1.5, tall: 0.85 },
  village: { grass: "leafy_grass", tint: 12896424, dirt: 0.58, dirtTint: 11575432, blades: [9087050, 5795884], dens: 1.1, tall: 0.6 },
  ammo: { grass: "withered_grass", dirtTex: "dry_ground_01", tint: 12367e3, dirt: 0.55, dirtTint: 11840152, blades: [12101736, 8023100], dens: 0.7, tall: 0.45 },
  camp: { grass: "sparse_grass", tint: 12633256, dirt: 0.6, dirtTint: 11049088, blades: [9214552, 5923380], dens: 0.9, tall: 0.5 },
  airstrip: { grass: "withered_grass", dirtTex: "dry_ground_01", tint: 12892832, dirt: 0.5, dirtTint: 12102808, blades: [12891256, 9075784], dens: 0.35, tall: 0.4 }
};
async function build({ R, scene, renderer, camera, stage, tier, x0, len, dir }) {
  var _a;
  const S = stage, r = rng(S.id.length * 977 + S.id.charCodeAt(0) * 31), n2 = noise2(S.id.charCodeAt(1) * 13);
  const grp = new Group();
  grp.name = "world-" + S.id;
  scene.add(grp);
  const occluders = [], spots = { windows: [], roofs: [], river: null, road: null, plane: null, coconuts: [], drums: [] };
  const xa = Math.min(x0, x0 + dir * len) - 40, xb = Math.max(x0, x0 + dir * len) + 40, W = xb - xa;
  const lite = tier === 0, matCache = {};
  await R.environment(scene, renderer, S.env, { background: true, blur: 0, intensity: S.id === "camp" ? 0.85 : 1, rotation: (_a = S.skyRot) != null ? _a : 0 });
  const hz = await horizonColour(S.env);
  scene.fog = new FogExp2(hz, S.id === "jungle" ? 0.022 : S.id === "camp" ? 0.026 : 0.014);
  const sunDir = new Vector3(S.sun ? S.sun[0] : -0.5, S.sun ? S.sun[1] : 0.75, S.sun ? S.sun[2] : 0.4).normalize();
  const sun = new DirectionalLight(16773596, S.id === "camp" ? 1.4 : S.id === "jungle" ? 1.6 : 2.6);
  sun.castShadow = true;
  const sq = tier >= 2 ? 2048 : 1024;
  sun.shadow.mapSize.set(sq, sq);
  sun.shadow.bias = -4e-4;
  sun.shadow.normalBias = 0.03;
  Object.assign(sun.shadow.camera, { left: -28, right: 28, top: 22, bottom: -22, near: 1, far: 120 });
  sun.shadow.radius = 4;
  grp.add(sun, sun.target);
  const hemi = new HemisphereLight(13623551, 4866096, S.id === "jungle" ? 0.5 : 0.25);
  grp.add(hemi);
  const gz0 = 6, gz1 = -150, segX = Math.ceil(W / 2), segZ = 80;
  const gGeo = new PlaneGeometry(W, gz0 - gz1, segX, segZ);
  gGeo.rotateX(-Math.PI / 2);
  gGeo.translate((xa + xb) / 2, 0, (gz0 + gz1) / 2);
  const groundY = (x, z) => {
    const far = Math.max(0, Math.min(1, (-z - 12) / 60));
    let y = (n2(x * 0.06, z * 0.06) - 0.5) * 0.9 + (n2(x * 0.18 + 40, z * 0.18) - 0.5) * 0.25 + far * far * (n2(x * 0.02 + 9, z * 0.02) - 0.3) * 9;
    if (spots.river && z < spots.river.z + spots.river.w / 2 + 2 && z > spots.river.z - spots.river.w / 2 - 2) y -= 0.9 * Math.min(1, (spots.river.w / 2 + 2 - Math.abs(z - spots.river.z)) / 3);
    if (spots.road && Math.abs(z - spots.road.z) < spots.road.w / 2 + 1.5) y *= 0.25;
    return y;
  };
  if (S.river) spots.river = { z: -20, w: 9 };
  spots.road = { z: S.river ? -11 : -15, w: S.id === "airstrip" ? 16 : 6 };
  if (S.id === "airstrip") spots.road.z = -22;
  const pos = gGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setY(i, groundY(pos.getX(i), pos.getZ(i)));
  gGeo.computeVertexNormals();
  const GL = GROUND[S.id] || GROUND.radio, mask = new Float32Array(pos.count), gc = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i), n = n2(x * 0.07 + 300, z * 0.07) * 0.65 + n2(x * 0.23, z * 0.23 + 99) * 0.35, v = 0.82 + n * 0.3;
    mask[i] = Math.min(1, Math.max(0, (n - GL.dirt) / 0.12));
    gc[i * 3] = v * 1.02;
    gc[i * 3 + 1] = v;
    gc[i * 3 + 2] = v * 0.96;
  }
  gGeo.setAttribute("gmask", new BufferAttribute(mask, 1));
  gGeo.setAttribute("color", new BufferAttribute(gc, 3));
  const rep = [W / 3.2, (gz0 - gz1) / 3.2];
  const gm = R.pbr(GL.grass, { repeat: rep, roughness: 1, color: GL.tint });
  const dirtM = R.pbr(GL.dirtTex || S.ground, { repeat: rep, roughness: 1 });
  matCache.__dirt = dirtM;
  gm.aoMap = null;
  gm.vertexColors = true;
  gm.onBeforeCompile = (sh) => {
    sh.uniforms.uDirt = { value: dirtM.map };
    sh.uniforms.uDirtN = { value: dirtM.normalMap };
    sh.uniforms.uDirtTint = { value: new Color(GL.dirtTint) };
    sh.vertexShader = "attribute float gmask; varying float vMask;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vMask = gmask;");
    sh.fragmentShader = "uniform sampler2D uDirt; uniform sampler2D uDirtN; uniform vec3 uDirtTint; varying float vMask;\n" + sh.fragmentShader.replace("#include <map_fragment>", "#include <map_fragment>\n { vec4 dc = texture2D(uDirt, vMapUv); diffuseColor.rgb = mix(diffuseColor.rgb, dc.rgb * uDirtTint, vMask); }");
  };
  gm.customProgramCacheKey = () => "wsground";
  const ground = new Mesh(gGeo, gm);
  ground.receiveShadow = true;
  ground.name = "ground";
  grp.add(ground);
  {
    const rd = spots.road, rGeo = new PlaneGeometry(W, rd.w + 3, segX, 6);
    rGeo.rotateX(-Math.PI / 2);
    rGeo.translate((xa + xb) / 2, 0, rd.z);
    const rp = rGeo.attributes.position, col = new Float32Array(rp.count * 3);
    for (let i = 0; i < rp.count; i++) {
      rp.setY(i, groundY(rp.getX(i), rp.getZ(i)) + 0.03);
      const e = 1 - Math.max(0, (Math.abs(rp.getZ(i) - rd.z) - rd.w / 2) / 1.5);
      col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = e;
    }
    rGeo.setAttribute("color", new BufferAttribute(col, 3));
    rGeo.computeVertexNormals();
    const rtex = S.id === "airstrip" ? "asphalt_02" : S.id === "jungle" || S.id === "village" ? "brown_mud_leaves_01" : "gravel_road";
    const rm = matCache.__road = R.pbr(rtex, { repeat: [W / 4, (rd.w + 3) / 4], roughness: 1 });
    rm.aoMap = null;
    rm.transparent = true;
    rm.depthWrite = false;
    rm.polygonOffset = true;
    rm.polygonOffsetFactor = -2;
    rm.onBeforeCompile = (sh) => {
      sh.fragmentShader = sh.fragmentShader.replace("#include <color_fragment>", "#include <color_fragment>\n diffuseColor.a *= vColor.r; diffuseColor.rgb /= max(vColor.r, 0.001);");
    };
    rm.vertexColors = true;
    const road = new Mesh(rGeo, rm);
    road.receiveShadow = true;
    road.renderOrder = 1;
    grp.add(road);
    if (S.id === "airstrip") {
      const lm = new MeshStandardMaterial({ color: 15262936, roughness: 0.8, polygonOffset: true, polygonOffsetFactor: -4 });
      for (let x = xa; x < xb; x += 9) {
        const l = new Mesh(new PlaneGeometry(4.5, 0.35), lm);
        l.rotation.x = -Math.PI / 2;
        l.position.set(x, groundY(x, rd.z) + 0.06, rd.z);
        l.receiveShadow = true;
        grp.add(l);
      }
    }
  }
  if (spots.river) {
    const rv = spots.river, wg = new PlaneGeometry(W, rv.w + 4, 1, 1);
    wg.rotateX(-Math.PI / 2);
    wg.translate((xa + xb) / 2, -0.35, rv.z);
    const ripple = (() => {
      const S2 = 256, c = document.createElement("canvas");
      c.width = c.height = S2;
      const g = c.getContext("2d"), im = g.createImageData(S2, S2), rn = noise2(5);
      for (let y = 0; y < S2; y++) for (let x = 0; x < S2; x++) {
        const h = (u, v) => rn(u / 16, v / 16) * 0.6 + rn(u / 6 + 30, v / 6) * 0.4;
        const dx = h(x + 1, y) - h(x - 1, y), dy = h(x, y + 1) - h(x, y - 1), i = (y * S2 + x) * 4;
        im.data[i] = 128 + dx * 300;
        im.data[i + 1] = 128 + dy * 300;
        im.data[i + 2] = 255;
        im.data[i + 3] = 255;
      }
      g.putImageData(im, 0, 0);
      const t = new CanvasTexture(c);
      t.wrapS = t.wrapT = RepeatWrapping;
      t.repeat.set(W / 6, (rv.w + 4) / 6);
      return t;
    })();
    const wm = new MeshPhysicalMaterial({ color: 2371628, roughness: 0.04, metalness: 0.2, normalMap: ripple, normalScale: new Vector2(0.35, 0.35), clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.8 });
    const water = new Mesh(wg, wm);
    water.receiveShadow = true;
    water.name = "water";
    grp.add(water);
    spots.waterTex = ripple;
  }
  {
    const clump = new BufferGeometry(), P = [], I = [], C = [], segs = 3;
    for (let b = 0; b < 3; b++) {
      const ang = b * 2.1 + 0.3, ca = Math.cos(ang), sa = Math.sin(ang), off = [Math.cos(ang + 1) * 0.03, Math.sin(ang + 1) * 0.03], lean = 0.12 + b * 0.06, w0 = 0.018 - b * 3e-3, base = P.length / 3;
      for (let i = 0; i <= segs; i++) {
        const k = i / segs, w = w0 * (1 - k * 0.9), fx = off[0] + ca * k * k * lean, fz = off[1] + sa * k * k * lean, h = k * (1 - b * 0.12);
        P.push(fx - sa * w, h, fz + ca * w, fx + sa * w, h, fz - ca * w);
        C.push(0.55 + 0.45 * k, 0.55 + 0.45 * k, 0.55 + 0.45 * k, 0.55 + 0.45 * k, 0.55 + 0.45 * k, 0.55 + 0.45 * k);
      }
      for (let i = 0; i < segs; i++) {
        const q2 = base + i * 2;
        I.push(q2, q2 + 1, q2 + 2, q2 + 1, q2 + 3, q2 + 2);
      }
    }
    clump.setAttribute("position", new Float32BufferAttribute(P, 3));
    clump.setIndex(I);
    clump.setAttribute("color", new Float32BufferAttribute(C, 3));
    {
      const nrm = [];
      for (let i = 0; i < P.length / 3; i++) nrm.push(0, 0.9, 0.42);
      clump.setAttribute("normal", new Float32BufferAttribute(nrm, 3));
    }
    const bm = windMat(new MeshStandardMaterial({ color: 16777215, vertexColors: true, roughness: 0.92, side: DoubleSide }), { amp: 0.14, freq: 1.6, heightScale: 1 });
    const cA = new Color(GL.blades[0]), cB = new Color(GL.blades[1]), cT = new Color(), m = new Matrix4(), q = new Quaternion(), v = new Vector3(), sc = new Vector3(), up = new Vector3(0, 1, 0), tilt = new Vector3(1, 0, 0);
    const tierK = tier >= 2 ? 1 : tier === 1 ? 0.55 : 0.28;
    const bands = [{ z0: 3, z1: -9, per: 34 }, { z0: -9, z1: -20, per: 14 }, { z0: -20, z1: -40, per: 5, big: 1.6 }];
    for (let cx = xa; cx < xb; cx += 10) for (const B of bands) {
      const area = 10 * (B.z0 - B.z1), N = Math.round(area * B.per * GL.dens * tierK);
      if (N < 1) continue;
      const im = new InstancedMesh(clump, bm, N);
      let k = 0;
      for (let t = 0; k < N && t < N * 3; t++) {
        const x = cx + r() * 10, z = B.z1 + r() * (B.z0 - B.z1);
        if (Math.abs(z - spots.road.z) < spots.road.w / 2 + 0.2) continue;
        if (spots.river && Math.abs(z - spots.river.z) < spots.river.w / 2 + 0.5) continue;
        const patch = n2(x * 0.11 + 70, z * 0.11), worn = n2(x * 0.07 + 300, z * 0.07) * 0.65 + n2(x * 0.23, z * 0.23 + 99) * 0.35;
        if (worn > GL.dirt + 0.08 && r() < 0.85) continue;
        const short = patch < 0.35 ? 0.45 : 1, h = (0.12 + patch * patch * GL.tall) * (0.45 + r() * r() * 1.3) * short * (B.big || 1) + 0.05, wsc = (0.8 + r() * 0.7) * (B.big || 1);
        q.setFromAxisAngle(up, r() * 6.283).multiply(new Quaternion().setFromAxisAngle(tilt, (r() - 0.5) * 0.3));
        m.compose(v.set(x, groundY(x, z) - 0.02, z), q, sc.set(wsc, h, wsc));
        im.setMatrixAt(k, m);
        im.setColorAt(k++, cT.copy(cA).lerp(cB, Math.min(1, r() * 0.7 + (1 - patch) * 0.5)).offsetHSL((r() - 0.5) * 0.05, (r() - 0.5) * 0.15, (r() - 0.5) * 0.12));
      }
      im.count = k;
      im.receiveShadow = true;
      im.castShadow = false;
      im.computeBoundingSphere();
      grp.add(im);
    }
  }
  const place = (n, zr, test) => {
    const out = [];
    for (let t = 0; out.length < n && t < n * 8; t++) {
      const x = xa + r() * W, z = zr[0] + r() * (zr[1] - zr[0]);
      if (Math.abs(z - spots.road.z) < spots.road.w / 2 + 1.2) continue;
      if (spots.river && Math.abs(z - spots.river.z) < spots.river.w / 2 + 1) continue;
      if (test && !test(x, z)) continue;
      out.push([x, z]);
    }
    return out;
  };
  const density = (S.id === "jungle" ? 1.8 : S.id === "village" ? 1.1 : S.id === "airstrip" ? 0.35 : 0.7) * (lite ? 0.5 : 1) * W / 300;
  const jobs = [];
  const plant = (name, n, zr, sc, opts) => jobs.push(loadModel(name).then((root) => {
    const pts = place(Math.round(n * density), zr);
    const mats = pts.map(([x, z]) => M4(x, groundY(x, z) - 0.03, z, r() * 6.28, sc[0] + r() * (sc[1] - sc[0])));
    if (mats.length) instanceModel(scene, root, mats, Object.assign({ parent: grp }, opts));
  }).catch((e) => console.warn("model", name, e)));
  plant("grass_medium_02", 300, [-3, -30], [0.6, 1], { windOpts: { amp: 0.12, freq: 1.5, heightScale: 1.4 }, shadow: false });
  plant("grass_medium_01", 150, [-4, -34], [0.5, 0.9], { windOpts: { amp: 0.12, freq: 1.4, heightScale: 1.4 }, shadow: false });
  plant("fern_02", S.id === "jungle" ? 160 : 50, [-4, -30], [0.7, 1.2], { windOpts: { amp: 0.05, freq: 1.1, heightScale: 1.2 } });
  plant("shrub_02", 70, [-9, -40], [0.8, 1.5], { windOpts: { amp: 0.03, freq: 0.9, heightScale: 0.8 } });
  plant("shrub_04", 60, [-9, -40], [0.8, 1.4], { windOpts: { amp: 0.03, freq: 0.9, heightScale: 0.8 } });
  if (S.id === "jungle" || S.id === "village") plant("pachira_aquatica_01", S.id === "jungle" ? 80 : 18, [-25, -40], [1.2, 2.2], { windOpts: { amp: 0.02, freq: 0.8, heightScale: 0.6 } });
  plant("rock_moss_set_01", 20, [-12, -40], [0.5, 1]);
  plant("boulder_01", 8, [-12, -50], [0.5, 1.2]);
  if (S.id !== "airstrip") plant("dead_tree_trunk", 6, [-9, -40], [0.8, 1.2]);
  plant("tree_stump_01", 8, [-6, -30], [0.8, 1.3]);
  const trees = S.id === "jungle" ? 70 : S.id === "village" ? 34 : S.id === "airstrip" ? 8 : S.id === "camp" ? 18 : 22;
  for (const [ti, nm] of ["island_tree_01", "island_tree_02", "island_tree_03"].entries()) jobs.push(loadModel(nm).then((root) => {
    const pts = place(Math.round(trees / 3 * W / 300), [-26, -70]);
    const mats = pts.map(([x, z]) => M4(x, groundY(x, z) - 0.1, z, r() * 6.28, 0.8 + r() * 0.6));
    if (mats.length) instanceModel(scene, root, mats, { parent: grp, windOpts: { amp: 6e-3, freq: 0.6, heightScale: 0.25 } });
    if (S.id === "jungle" || S.id === "village") for (const [x, z] of pts.slice(0, 6 + ti * 2)) spots.coconuts.push(new Vector3(x, groundY(x, z) + 6 + r() * 2, z));
  }).catch((e) => console.warn("tree", nm, e)));
  const mat = (name, rep2, o = {}) => {
    var _a2;
    return matCache[_a2 = name + rep2 + JSON.stringify(o)] || (matCache[_a2] = R.pbr(name, Object.assign({ repeat: rep2 }, o)));
  };
  const box = (w, h, d, m, x, y, z, ry = 0, occ = true, par = grp) => {
    const b = new Mesh(new BoxGeometry(w, h, d), m);
    b.position.set(x, y, z);
    b.rotation.y = ry;
    b.castShadow = b.receiveShadow = true;
    par.add(b);
    if (occ) occluders.push(b);
    return b;
  };
  const wallM = { radio: () => mat("concrete_wall_006", [2, 1]), jungle: () => mat("bark_brown_02", [2, 2]), village: () => mat("bamboo_wall", [2, 1]), ammo: () => mat("box_profile_metal_sheet", [3, 1], { metalness: 0.6 }), camp: () => mat("weathered_planks", [2, 1]), airstrip: () => mat("box_profile_metal_sheet", [4, 1], { metalness: 0.6 }) }[S.id]();
  const roofM = mat("corrugated_iron_02", [3, 2], { metalness: 0.5 });
  const darkM = new MeshStandardMaterial({ color: 657930, roughness: 0.9 });
  function hut(x, z, w = 6, d = 4, h = 2.8, ry = 0) {
    const y = groundY(x, z), g = new Group();
    g.position.set(x, y, z);
    g.rotation.y = ry;
    grp.add(g);
    box(w, h, d, wallM, 0, h / 2, 0, 0, true, g);
    const roof = new Mesh(new BoxGeometry(w + 0.8, 0.08, d + 1), roofM);
    roof.position.set(0, h + 0.25, 0);
    roof.rotation.x = -0.12;
    roof.castShadow = roof.receiveShadow = true;
    g.add(roof);
    for (const wx of [-w * 0.25, w * 0.25]) {
      const win = new Mesh(new PlaneGeometry(0.9, 0.8), darkM);
      win.position.set(wx, h * 0.58, d / 2 + 0.01);
      g.add(win);
      g.updateMatrixWorld(true);
      spots.windows.push({ p: win.getWorldPosition(new Vector3()), mesh: win, busy: false });
    }
    const door = new Mesh(new PlaneGeometry(0.9, 1.9), darkM);
    door.position.set(0, 0.95, d / 2 + 0.012);
    g.add(door);
    g.updateMatrixWorld(true);
    spots.roofs.push({ p: new Vector3(0, h + 0.3, 0).applyMatrix4(g.matrixWorld), busy: false });
    spots.doors = spots.doors || [];
    spots.doors.push(door.getWorldPosition(new Vector3()));
    return g;
  }
  function sandbags(x, z, n = 6, ry = 0) {
    const hm = mat("hessian_230", [0.6, 0.4], { roughness: 1, color: 12100986 }), g = new Group();
    g.position.set(x, groundY(x, z), z);
    g.rotation.y = ry;
    grp.add(g);
    const geo = new CapsuleGeometry(0.17, 0.42, 4, 8);
    geo.rotateZ(Math.PI / 2);
    geo.scale(1, 0.62, 1);
    for (let row = 0; row < 3; row++) for (let i = 0; i < n - row; i++) {
      const b = new Mesh(geo, hm);
      b.position.set((i - (n - row - 1) / 2) * 0.72, 0.13 + row * 0.22, (r() - 0.5) * 0.05);
      b.rotation.y = (r() - 0.5) * 0.15;
      b.castShadow = b.receiveShadow = true;
      g.add(b);
    }
    const proxy = new Mesh(new BoxGeometry(n * 0.72, 0.7, 0.4), new MeshBasicMaterial({ visible: false }));
    proxy.position.y = 0.35;
    g.add(proxy);
    occluders.push(proxy);
    g.updateMatrixWorld(true);
    spots.cover = spots.cover || [];
    spots.cover.push(new Vector3(0, 0, -0.5).applyMatrix4(g.matrixWorld));
  }
  function mast(x, z, h = 16) {
    const sm = new MeshStandardMaterial({ color: 9185826, roughness: 0.6, metalness: 0.7 }), wm = new MeshStandardMaterial({ color: 14474452, roughness: 0.6, metalness: 0.7 });
    const g = new Group();
    g.position.set(x, groundY(x, z), z);
    grp.add(g);
    const a = 0.55;
    for (let i = 0; i < 4; i++) {
      const leg = new Mesh(new CylinderGeometry(0.04, 0.05, h, 5), i % 2 ? sm : wm);
      leg.position.set(i < 2 ? -a : a, h / 2, i % 2 ? -a : a);
      leg.castShadow = true;
      g.add(leg);
    }
    for (let y = 1; y < h; y += 1.2) for (let s = 0; s < 4; s++) {
      const br = new Mesh(new CylinderGeometry(0.02, 0.02, Math.hypot(2 * a, 1.2), 4), Math.floor(y / 3) % 2 ? sm : wm);
      const ang = s * Math.PI / 2;
      br.position.set(Math.cos(ang) * a, y + 0.6, Math.sin(ang) * a);
      br.rotation.set(0, -ang + Math.PI / 2, Math.atan2(2 * a, 1.2) * (s % 2 ? 1 : -1));
      br.castShadow = true;
      g.add(br);
    }
    const dish = new Mesh(new SphereGeometry(0.8, 16, 8, 0, Math.PI * 2, 0, 0.9), wm);
    dish.position.set(0, h * 0.75, 0.6);
    dish.rotation.x = Math.PI / 2;
    g.add(dish);
  }
  function watchtower(x, z) {
    const pm = mat("weathered_planks", [1, 2]), g = new Group();
    g.position.set(x, groundY(x, z), z);
    grp.add(g);
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const p = new Mesh(new BoxGeometry(0.18, 5, 0.18), pm);
      p.position.set(dx * 1.1, 2.5, dz * 1.1);
      p.castShadow = true;
      g.add(p);
    }
    const deck = box(2.8, 0.15, 2.8, pm, 0, 5, 0, 0, false, g), rail = box(2.8, 1, 0.1, pm, 0, 5.55, 1.35, 0, true, g);
    void deck;
    void rail;
    const roof = new Mesh(new ConeGeometry(2.3, 1.1, 4), roofM);
    roof.position.y = 7.2;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    g.add(roof);
    g.updateMatrixWorld(true);
    spots.roofs.push({ p: new Vector3(0, 5.1, 0.6).applyMatrix4(g.matrixWorld), busy: false, tower: true });
  }
  function fence(z) {
    const pm = mat("weathered_planks", [0.3, 1]), wm = new LineBasicMaterial({ color: 5921368 });
    for (let x = xa; x < xb; x += 3) {
      const p = new Mesh(new BoxGeometry(0.12, 2.2, 0.12), pm);
      p.position.set(x, groundY(x, z) + 1.1, z);
      p.rotation.z = (r() - 0.5) * 0.06;
      p.castShadow = true;
      grp.add(p);
    }
    for (const h of [0.5, 1, 1.5, 2]) {
      const pts = [];
      for (let x = xa; x <= xb; x += 1.5) pts.push(new Vector3(x, groundY(x, z) + h + Math.sin(x * 3) * 0.03, z + 0.07));
      grp.add(new Line(new BufferGeometry().setFromPoints(pts), wm));
    }
  }
  function plane(x, z) {
    const am = mat("metal_plate", [4, 1], { metalness: 0.85, roughness: 0.35, color: 12172996 }), g = new Group();
    g.position.set(x, groundY(x, z), z);
    grp.add(g);
    const fus = new Mesh(new CapsuleGeometry(1.6, 22, 8, 20), am);
    fus.rotation.z = Math.PI / 2;
    fus.position.y = 2.6;
    fus.castShadow = true;
    g.add(fus);
    occluders.push(fus);
    const wing = new Mesh(new BoxGeometry(4.2, 0.3, 34), am);
    wing.position.set(1, 4.1, 0);
    wing.castShadow = true;
    g.add(wing);
    for (const wz of [-12, -6, 6, 12]) {
      const e = new Mesh(new CylinderGeometry(0.55, 0.6, 3, 14), am);
      e.rotation.z = Math.PI / 2;
      e.position.set(-0.2, 3.6, wz);
      e.castShadow = true;
      g.add(e);
      const prop = new Mesh(new CircleGeometry(1.8, 24), new MeshBasicMaterial({ color: 2236962, transparent: true, opacity: 0.25, side: DoubleSide }));
      prop.rotation.y = Math.PI / 2;
      prop.position.set(-1.8, 3.6, wz);
      g.add(prop);
      spots.props = spots.props || [];
      spots.props.push(prop);
    }
    const tail = new Mesh(new BoxGeometry(3, 5, 0.3), am);
    tail.position.set(12, 6, 0);
    tail.castShadow = true;
    g.add(tail);
    const st = new Mesh(new BoxGeometry(3, 0.25, 11), am);
    st.position.set(12, 4.2, 0);
    g.add(st);
    for (const gz of [-1.4, 1.4]) {
      const w = new Mesh(new CylinderGeometry(0.55, 0.55, 0.4, 16), darkM);
      w.rotation.x = Math.PI / 2;
      w.position.set(1, 0.55, gz);
      g.add(w);
    }
    const ramp = new Mesh(new PlaneGeometry(2.4, 2.2), darkM);
    ramp.position.set(-4, 2.2, 1.61);
    g.add(ramp);
    g.updateMatrixWorld(true);
    spots.plane = ramp.getWorldPosition(new Vector3());
    spots.planeGroup = g;
  }
  const every = S.id === "jungle" ? 34 : S.id === "airstrip" ? 40 : 22;
  for (let x = xa + 20, i = 0; x < xb - 10; x += every * (0.8 + r() * 0.5), i++) {
    const z = spots.road.z - 6 - r() * 8;
    if (S.id === "radio") {
      if (i % 3 === 1) mast(x + 4, z - 6);
      hut(x, z, 6 + r() * 2, 4, 2.8);
      sandbags(x - 6, spots.road.z + 4, 6);
    } else if (S.id === "jungle") {
      if (i % 2 === 0) hut(x, -32 - r() * 6, 5, 4, 2.6);
    } else if (S.id === "village") {
      hut(x, z, 5 + r() * 2, 4, 2.6, (r() - 0.5) * 0.3);
      if (i % 2) sandbags(x + 5, spots.road.z + 3.5, 5);
    } else if (S.id === "ammo") {
      hut(x, z - 2, 9, 5, 3.6);
      sandbags(x - 4, spots.road.z + 4, 7);
      if (i % 2) watchtower(x + 9, z + 2);
    } else if (S.id === "camp") {
      hut(x, z - 2, 8, 4, 2.7);
      if (i % 2 === 0) watchtower(x + 8, z + 4);
    } else if (S.id === "airstrip") {
      if (i % 2 === 0) hut(x, -42, 14, 8, 6);
    }
  }
  if (S.id === "camp") fence(spots.road.z - 3.5);
  if (S.id === "airstrip") plane(x0 + dir * len * 0.92, spots.road.z - 4);
  jobs.push(loadModel("barrel_03").then((root) => {
    for (let x = xa + 12; x < xb; x += 10 + r() * 14) {
      const z = spots.road.z + (r() < 0.5 ? -spots.road.w / 2 - 1.5 : spots.road.w / 2 + 1.2);
      const d = root.clone(true);
      d.position.set(x, groundY(x, z), z);
      d.rotation.y = r() * 6;
      d.traverse((o) => {
        if (o.isMesh) {
          o.castShadow = o.receiveShadow = true;
          o.material = o.material.clone();
        }
      });
      grp.add(d);
      spots.drums.push(d);
    }
  }).catch(() => {
  }));
  for (const [nm, n, zr] of [["wooden_military_crate", 10, [-4, -18]], ["old_military_crate", 8, [-4, -18]], ["metal_jerrycan_green", 8, [-3, -14]], ["old_tyre", 6, [-3, -16]], ["ammo_box", 6, [-3, -12]], ["concrete_road_barrier", S.id === "ammo" || S.id === "airstrip" || S.id === "radio" ? 8 : 0, [-6, -20]], ["propane_tank", S.id === "ammo" ? 6 : 2, [-6, -20]]])
    if (n) jobs.push(loadModel(nm).then((root) => {
      const pts = place(Math.round(n * W / 300), zr);
      const mats = pts.map(([x, z]) => M4(x, groundY(x, z), z, r() * 6.28, 1));
      if (mats.length) {
        const ims = instanceModel(scene, root, mats, { parent: grp });
        if (/crate|barrier/.test(nm)) occluders.push(...ims);
      }
    }).catch(() => {
    }));
  await Promise.all(jobs);
  const smokes = [];
  const smokeM = () => keepAlpha(new SpriteMaterial({ map: smokeTexture(), color: 8223348, transparent: true, depthWrite: false, opacity: 0, fog: true }));
  for (let x = xa + 30; x < xb; x += 45 + r() * 40) {
    const base = new Vector3(x, 0, -30 - r() * 30);
    base.y = groundY(base.x, base.z);
    const col = { base, parts: [] };
    for (let i = 0; i < 14; i++) {
      const sp = new Sprite(smokeM());
      sp.userData.t = i / 14;
      grp.add(sp);
      col.parts.push(sp);
    }
    smokes.push(col);
  }
  const dust = new Group();
  grp.add(dust);
  const dustM = keepAlpha(new SpriteMaterial({ map: smokeTexture(), color: S.id === "jungle" ? 10135690 : 13154456, transparent: true, depthWrite: false, opacity: 0.12, fog: true }));
  for (let i = 0; i < (lite ? 8 : 22); i++) {
    const sp = new Sprite(keepAlpha(dustM.clone()));
    sp.position.set(xa + r() * W, 0.6 + r() * 1.4, -4 - r() * 26);
    sp.scale.setScalar(4 + r() * 5);
    sp.userData.v = 0.3 + r() * 0.5;
    sp.userData.ph = r() * 6;
    dust.add(sp);
  }
  const api = {
    group: grp,
    occluders,
    spots,
    groundY,
    sun,
    fogColor: hz,
    xa,
    xb,
    update(dt, camX, t) {
      wind.t.value = t;
      wind.strength.value = 0.8 + 0.4 * Math.sin(t * 0.21) * Math.sin(t * 0.13);
      sun.position.set(camX + sunDir.x * 60, sunDir.y * 60, -12 + sunDir.z * 60);
      sun.target.position.set(camX, 0, -12);
      sun.target.updateMatrixWorld();
      for (const c of smokes) {
        if (Math.abs(c.base.x - camX) > 90) {
          for (const p of c.parts) p.visible = false;
          continue;
        }
        for (const p of c.parts) {
          p.visible = true;
          p.userData.t = (p.userData.t + dt * 0.06) % 1;
          const k = p.userData.t;
          p.position.set(c.base.x + k * 6 + Math.sin(k * 5 + c.base.z) * 0.8, c.base.y + 0.5 + k * 14, c.base.z - k * 2);
          p.scale.setScalar(1.5 + k * 9);
          p.material.opacity = 0.42 * Math.sin(Math.PI * Math.min(1, k * 1.4)) * (1 - k * 0.5);
          p.material.rotation = k * 1.5;
        }
      }
      for (const d of dust.children) {
        d.position.x += d.userData.v * dt;
        if (d.position.x > camX + 30) d.position.x -= 60;
        if (d.position.x < camX - 30) d.position.x += 60;
        d.material.opacity = 0.08 + 0.05 * Math.sin(t * 0.4 + d.userData.ph);
      }
      if (spots.waterTex) spots.waterTex.offset.set(t * 0.012, t * 4e-3);
      if (spots.props) for (const p of spots.props) p.rotation.z += dt * 30;
    },
    dispose() {
      scene.fog = null;
      for (const m of [gm, ...Object.values(matCache)]) if (m) {
        for (const k of TEX_SLOTS) if (m[k] && !m[k].userData.keep) m[k].dispose();
      }
      freeObject(grp);
      const sky = R.state().sky;
      if (sky && sky.material && sky.material.map) {
        sky.material.map.dispose();
        sky.material.map = null;
      }
      if (sun.shadow && sun.shadow.map) {
        sun.shadow.map.dispose();
        sun.shadow.map = null;
      }
      if (sky && sky.geometry) sky.geometry.dispose();
    }
  };
  return api;
}

export {
  loadModel,
  keepAll,
  keepMat,
  freeObject,
  wind,
  smokeTexture,
  glowTexture,
  keepAlpha,
  floatGeo,
  build
};
