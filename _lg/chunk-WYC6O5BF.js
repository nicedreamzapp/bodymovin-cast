import {
  MeshoptDecoder
} from "./chunk-2BP775VP.js";
import {
  GLTFLoader
} from "./chunk-CPYHHAA5.js";
import {
  AnimationMixer,
  Color,
  DataTexture,
  FrontSide,
  GreaterDepth,
  LessEqualDepth,
  LoopOnce,
  LoopRepeat,
  Matrix3,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Quaternion,
  ShaderMaterial,
  SkinnedMesh,
  SphereGeometry,
  Vector3
} from "./chunk-4IYDSAYK.js";

// dist/three/addons/utils/SkeletonUtils.js
function clone(source) {
  const sourceLookup = /* @__PURE__ */ new Map();
  const cloneLookup = /* @__PURE__ */ new Map();
  const clone2 = source.clone();
  parallelTraverse(source, clone2, function(sourceNode, clonedNode) {
    sourceLookup.set(clonedNode, sourceNode);
    cloneLookup.set(sourceNode, clonedNode);
  });
  clone2.traverse(function(node) {
    if (!node.isSkinnedMesh) return;
    const clonedMesh = node;
    const sourceMesh = sourceLookup.get(node);
    const sourceBones = sourceMesh.skeleton.bones;
    clonedMesh.skeleton = sourceMesh.skeleton.clone();
    clonedMesh.bindMatrix.copy(sourceMesh.bindMatrix);
    clonedMesh.skeleton.bones = sourceBones.map(function(bone) {
      return cloneLookup.get(bone);
    });
    clonedMesh.bind(clonedMesh.skeleton, clonedMesh.bindMatrix);
  });
  return clone2;
}
function parallelTraverse(a, b, callback) {
  callback(a, b);
  for (let i = 0; i < a.children.length; i++) {
    parallelTraverse(a.children[i], b.children[i], callback);
  }
}

// dist/realbody.js
var BONES = {
  pelvis: "pelvis",
  spine: ["spine_01", "spine_02", "spine_03"],
  neck: "neck_01",
  head: "head",
  l: { clav: "clavicle_l", up: "upperarm_l", fore: "lowerarm_l", hand: "hand_l", thigh: "thigh_l", calf: "calf_l", foot: "foot_l", ball: "ball_l" },
  r: { clav: "clavicle_r", up: "upperarm_r", fore: "lowerarm_r", hand: "hand_r", thigh: "thigh_r", calf: "calf_r", foot: "foot_r", ball: "ball_r" },
  fingers: ["index", "middle", "ring", "pinky"]
};
var OUTFITS = {
  golfer: {
    url: "man_golfer.glb",
    url0: "man_golfer_t0.glb",
    // fitted polo + collar, long trousers + belt, golf shoes, cap, white glove (lead hand)
    glass: {
      body: [12376558, 0.3],
      polo: [16054527, 0.55],
      collar: [16777215, 0.75],
      trousers: [3425898, 0.62],
      belt: [1119e3, 0.85],
      glove: [16777215, 0.85],
      cap: [2241114, 0.8],
      shoes: [15921906, 0.7],
      hair: [3813926, 0.55]
    },
    colors: { polo: 16777215, trousers: 2831430, cap: 1911370 },
    plain: ["trousers"],
    // plain: drop the cloth's colour map (denim -> chinos)
    hide: ["cap"]
  },
  // Matt 10/22 3:58 AM: he likes the golfer bare-headed (hair showing); the cap stays in the GLB, never drawn
  // bowler (Strike Lanes, 10/22): the golfer's set worn as a bowling shirt and slacks: a teal short-sleeve shirt with its
  // collar, dark slacks and belt, no cap, no glove (the glove faces drawn as skin), two-tone bowling shoes
  bowler: {
    url: "man_golfer.glb",
    url0: "man_golfer_t0.glb",
    glass: {
      body: [12376558, 0.3],
      polo: [6279384, 0.55],
      collar: [15924223, 0.75],
      trousers: [2830400, 0.62],
      belt: [1119e3, 0.85],
      glove: [12376558, 0.3],
      shoes: [15259312, 0.72],
      hair: [3813926, 0.55]
    },
    colors: { polo: 2068378, collar: 16053492, trousers: 2303534, glove: 14267802, shoes: 13153418 },
    plain: ["trousers"],
    hide: ["cap"]
  },
  // keeper (Goalkeeper, 10/22): the golfer's set as a keeper kit: a bright green jersey with its collar, black keeper
  // trousers, black boots; the game's own keeper gloves cover the hands
  keeper: {
    url: "man_golfer.glb",
    url0: "man_golfer_t0.glb",
    glass: {
      body: [12376558, 0.3],
      polo: [6156410, 0.6],
      collar: [6156410, 0.7],
      trousers: [1711396, 0.66],
      belt: [1711396, 0.66],
      glove: [12376558, 0.3],
      shoes: [2237740, 0.8],
      hair: [3813926, 0.55]
    },
    colors: { polo: 3130706, collar: 3130706, trousers: 1382172, belt: 1382172, glove: 14267802, shoes: 1447964 },
    plain: ["trousers"],
    hide: ["cap"]
  },
  // snowboarder (Summit Send, man_snow.glb, 10/22): orange snow jacket, navy snow pants, dark gloves and boots, white helmet
  snowboarder: {
    url: "man_snow.glb",
    url0: "man_snow_t0.glb",
    glass: { body: [12376558, 0.3], jacket: [16747066, 0.62], pants: [2771576, 0.64], glove: [1711138, 0.85], shoes: [2237740, 0.8], helmet: [16185074, 0.8], hair: [3813926, 0.55] },
    colors: { jacket: 16738842, pants: 2047066, glove: 1382172, shoes: 2303531, helmet: 16053490 },
    plain: ["jacket", "pants"]
  },
  // sports kit (man_sport.glb, 10/22): t-shirt, shorts above the knee, white socks, trainers. One GLB, coloured per sport:
  tabletennis: {
    url: "man_sport.glb",
    url0: "man_sport_t0.glb",
    // a table tennis shirt (red), black shorts
    glass: { body: [12376558, 0.3], shirt: [16743034, 0.58], shorts: [1842984, 0.66], socks: [16053492, 0.7], shoes: [15921906, 0.72], hair: [3813926, 0.55] },
    colors: { shirt: 13116972, shorts: 1382172, socks: 15790320 }
  },
  runner: {
    url: "man_sport.glb",
    url0: "man_sport_t0.glb",
    // running shirt (orange), black running shorts
    glass: { body: [12376558, 0.3], shirt: [16757611, 0.58], shorts: [1842984, 0.66], socks: [16053492, 0.7], shoes: [15921906, 0.72], hair: [3813926, 0.55] },
    colors: { shirt: 15759898, shorts: 1382172, socks: 15790320 }
  },
  footballer: {
    url: "man_sport.glb",
    url0: "man_sport_t0.glb",
    // a striker: club shirt (colour per striker via colors.shirt), shorts, socks
    glass: { body: [12376558, 0.3], shirt: [16054527, 0.58], shorts: [16054527, 0.6], socks: [16053492, 0.7], shoes: [2236962, 0.8], hair: [3813926, 0.55] },
    colors: { shirt: 14826042, shorts: 1119e3, socks: 15921906, shoes: 1118481 }
  },
  sport: {
    url: "man_sport.glb",
    url0: "man_sport_t0.glb",
    // plain kit (arcade games: casual sports clothes)
    glass: { body: [12376558, 0.3], shirt: [15660283, 0.55], shorts: [2831430, 0.62], socks: [16053492, 0.7], shoes: [15921906, 0.72], hair: [3813926, 0.55] },
    colors: { shorts: 2304314 }
  },
  casual: {
    url: "man.glb",
    url0: "man_t0.glb",
    // t-shirt and jeans, trainers (a coach, a spectator)
    glass: { body: [12376558, 0.3], clothes: [15660283, 0.55], shoes: [15921906, 0.7], hair: [3813926, 0.55] }
  },
  // planned, need their garments built the way the golfer's were (CC0 MakeHuman base + own geometry in tests/realbody/build):
  //   boxer: long boxing shorts with a waistband, boots, wraps (gloves stay game props); torso covered by a vest for him
  //   tabletennis: fitted short-sleeve shirt, shorts, court shoes, a sweatband
  //   keeper: long-sleeve keeper jersey, shorts, socks, boots (gloves are props)
  //   runner / track: vest, running shorts, spikes; bowler: polo + trousers (the golfer's set, no cap)
  nude: { url: "man_glass.glb", url0: "man_glass.glb", glass: { body: [12376558, 0.35] } }
  // fallback only
};
var outfitURL = (name, tier, base = "./assets/people/") => base + (tier === 0 ? OUTFITS[name].url0 : OUTFITS[name].url);
var partOf = (m) => {
  const node = /^LOD\d_/.test(m.name) ? m.name : m.parent && m.parent.name || m.name, mat = (m.material && m.material.name || "").toLowerCase();
  if (/glove/.test(mat)) return "glove";
  if (/belt/.test(mat)) return "belt";
  if (/socks/.test(mat)) return "socks";
  return node.replace(/^LOD\d_/, "").split(".")[0];
};
var lodName = (m) => /^LOD\d_/.test(m.name) ? m.name : m.parent && m.parent.name || "";
var V = (x = 0, y = 0, z = 0) => new Vector3(x, y, z);
var clamp = (v, a, b) => Math.max(a, Math.min(b, v));
var cache = /* @__PURE__ */ new Map();
function loadBody(url, { loader } = {}) {
  if (cache.has(url)) return cache.get(url);
  const L = loader || new GLTFLoader();
  L.setMeshoptDecoder(MeshoptDecoder);
  const p = new Promise((res, rej) => L.load(url, (g) => res(prepTemplate(g)), void 0, rej));
  cache.set(url, p);
  return p;
}
function cacheBody(url, templatePromise) {
  cache.set(url, templatePromise);
}
function parseBody(buf) {
  const L = new GLTFLoader();
  L.setMeshoptDecoder(MeshoptDecoder);
  return new Promise((res, rej) => L.parse(buf, "", (g) => res(prepTemplate(g)), rej));
}
function prepTemplate(gltf) {
  const scene = gltf.scene;
  scene.updateMatrixWorld(true);
  return { scene, gltf };
}
var GLASS_VS = (
  /* glsl */
  "\n#include <common>\n#include <skinning_pars_vertex>\nvarying vec3 vN; varying vec3 vV; varying float vY;\nvoid main() {\n  #include <skinbase_vertex>\n  #include <begin_vertex>\n  #include <beginnormal_vertex>\n  #include <skinnormal_vertex>\n  #include <defaultnormal_vertex>\n  #include <skinning_vertex>\n  #include <project_vertex>\n  vN = normalize(transformedNormal); vV = -mvPosition.xyz;\n  vY = (modelMatrix * vec4(transformed, 1.0)).y;\n}"
);
var GLASS_FS = (
  /* glsl */
  "\nuniform vec3 uFill; uniform vec3 uRim; uniform vec3 uLight; uniform float uFillA; uniform float uRimA; uniform float uOpacity; uniform float uRimPow; uniform float uGhost;\nvarying vec3 vN; varying vec3 vV; varying float vY;\nvoid main() {\n  vec3 n = normalize(vN), v = normalize(vV);\n  if (!gl_FrontFacing) n = -n;\n  float nv = clamp(dot(n, v), 0.0, 1.0);\n  float f = pow(1.0 - nv, uRimPow);                       // bright edges, clear centre\n  float lit = 0.62 + 0.38 * max(dot(n, normalize(uLight)), 0.0);   // a little form: shoulders, calves, the back of the hand\n  float spec = pow(max(dot(reflect(-normalize(uLight), n), v), 0.0), 24.0) * 0.35;\n  vec3 col = mix(uFill * lit, uRim, clamp(f * 1.2, 0.0, 1.0)) + spec;\n  float a = (uFillA * (0.75 + 0.25 * lit) + f * uRimA + spec * 0.5) * uOpacity * uGhost;\n  gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));\n  #include <colorspace_fragment>\n}"
);
function glassMaterials(o = {}) {
  var _a, _b, _c, _d, _e, _f;
  const uniforms = {
    uFill: { value: new Color((_a = o.fill) != null ? _a : 12376558) },
    uRim: { value: new Color((_b = o.rim) != null ? _b : 15464703) },
    uLight: { value: (o.light || V(0.3, 0.8, 0.5)).clone().normalize() },
    uFillA: { value: (_c = o.fillA) != null ? _c : 0.35 },
    uRimA: { value: (_d = o.rimA) != null ? _d : 0.85 },
    uOpacity: { value: 1 },
    uRimPow: { value: (_e = o.rimPow) != null ? _e : 2.4 },
    uGhost: { value: 1 }
  };
  const color = new ShaderMaterial({
    uniforms,
    vertexShader: GLASS_VS,
    fragmentShader: GLASS_FS,
    transparent: true,
    depthWrite: false,
    depthFunc: LessEqualDepth,
    side: FrontSide,
    toneMapped: false
  });
  const depth = new MeshBasicMaterial({ colorWrite: false, depthWrite: true, transparent: true, side: FrontSide });
  const ghost = new ShaderMaterial({
    uniforms: Object.assign({}, uniforms, { uGhost: { value: (_f = o.ghost) != null ? _f : 0.5 } }),
    vertexShader: GLASS_VS,
    fragmentShader: GLASS_FS,
    transparent: true,
    depthWrite: false,
    depthFunc: GreaterDepth,
    side: FrontSide,
    toneMapped: false
  });
  return { color, depth, ghost, uniforms };
}
var PLAIN = { fill: 15266815, rim: 16777215, fillA: 8e-3, rimA: 0.05, rimPow: 2.2, depth: false };
var PLAIN_VS = (
  /* glsl */
  "\n#include <common>\n#include <skinning_pars_vertex>\nuniform float uHide[64];\nvarying vec3 vN; varying vec3 vV; varying float vY; varying float vHide;\nvoid main() {\n  #include <skinbase_vertex>\n  #include <begin_vertex>\n  #include <beginnormal_vertex>\n  #include <skinnormal_vertex>\n  #include <defaultnormal_vertex>\n  #include <skinning_vertex>\n  #include <project_vertex>\n  vN = normalize(transformedNormal); vV = -mvPosition.xyz;\n  vY = (modelMatrix * vec4(transformed, 1.0)).y;\n  vHide = 0.0;\n  #ifdef USE_SKINNING\n  vHide = skinWeight.x * uHide[int(skinIndex.x)] + skinWeight.y * uHide[int(skinIndex.y)] + skinWeight.z * uHide[int(skinIndex.z)] + skinWeight.w * uHide[int(skinIndex.w)];\n  #endif\n}"
);
var PLAIN_FS = (
  /* glsl */
  "\nuniform vec3 uFill; uniform vec3 uRim; uniform float uFillA; uniform float uRimA; uniform float uOpacity; uniform float uRimPow; uniform float uGhost;\nvarying vec3 vN; varying vec3 vV; varying float vY; varying float vHide;\nvoid main() {\n  if (vHide > 0.5) discard;\n  vec3 n = normalize(vN), v = normalize(vV);\n  if (!gl_FrontFacing) n = -n;\n  float f = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), uRimPow);   // only the outline is a little brighter: no form, no face\n  vec3 col = mix(uFill, uRim, f);\n  float a = (uFillA + f * uRimA) * uOpacity * uGhost;\n  gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));\n  #include <colorspace_fragment>\n}"
);
var PLAIN_DEPTH_FS = (
  /* glsl */
  "\nvarying vec3 vN; varying vec3 vV; varying float vY; varying float vHide;\nvoid main() { if (vHide > 0.5) discard; gl_FragColor = vec4(0.0); }"
);
function plainMaterials(o = {}, shared = {}) {
  var _a, _b, _c, _d, _e;
  const uniforms = {
    uFill: { value: new Color((_a = o.fill) != null ? _a : PLAIN.fill) },
    uRim: { value: new Color((_b = o.rim) != null ? _b : PLAIN.rim) },
    uFillA: { value: (_c = o.fillA) != null ? _c : PLAIN.fillA },
    uRimA: { value: (_d = o.rimA) != null ? _d : PLAIN.rimA },
    uRimPow: { value: (_e = o.rimPow) != null ? _e : PLAIN.rimPow },
    uOpacity: shared.uOpacity || { value: 1 },
    uGhost: { value: 1 },
    uHide: shared.uHide || { value: new Array(64).fill(0) }
  };
  const color = new ShaderMaterial({
    uniforms,
    vertexShader: PLAIN_VS,
    fragmentShader: PLAIN_FS,
    transparent: true,
    depthWrite: false,
    depthFunc: LessEqualDepth,
    side: FrontSide,
    toneMapped: false
  });
  const depth = new ShaderMaterial({
    uniforms: { uHide: uniforms.uHide },
    vertexShader: PLAIN_VS,
    fragmentShader: PLAIN_DEPTH_FS,
    colorWrite: false,
    depthWrite: PLAIN.depth,
    transparent: true,
    side: FrontSide
  });
  return { color, depth, ghost: null, uniforms };
}
var _blobTex = null;
function blobTexture() {
  if (_blobTex) return _blobTex;
  const N = 64, d = new Uint8Array(N * N * 4);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const r = Math.hypot(x - N / 2 + 0.5, y - N / 2 + 0.5) / (N / 2);
    const a = Math.max(0, 1 - r);
    const i = (y * N + x) * 4;
    d[i] = d[i + 1] = d[i + 2] = 0;
    d[i + 3] = Math.round(255 * a * a * (3 - 2 * a) * 0.75);
  }
  _blobTex = new DataTexture(d, N, N);
  _blobTex.needsUpdate = true;
  return _blobTex;
}
function contactShadow() {
  const m = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ map: blobTexture(), transparent: true, depthWrite: false, opacity: 1, toneMapped: false }));
  m.rotation.x = -Math.PI / 2;
  m.renderOrder = 1;
  m.name = "contactShadow";
  return m;
}
var _q = new Quaternion();
var _q2 = new Quaternion();
var _m = new Matrix4();
var _v = V();
var _v2 = V();
var _v3 = V();
function basisQuat(x, y, out = new Quaternion()) {
  const Y = y.clone().normalize(), X = x.clone().addScaledVector(Y, -x.dot(Y)).normalize(), Z = V().crossVectors(X, Y);
  _m.makeBasis(X, Y, Z);
  return out.setFromRotationMatrix(_m);
}
function basisQuatX(x, y, out = new Quaternion()) {
  const X = x.clone().normalize(), Y = y.clone().addScaledVector(X, -y.dot(X)).normalize(), Z = V().crossVectors(X, Y);
  _m.makeBasis(X, Y, Z);
  return out.setFromRotationMatrix(_m);
}
var ROLL = 0.6;
var ROLL_UP = 0;
var ROLL_MAX = 2.1;
function makePerson(tpl, o = {}) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const look = o.look || "clothed";
  const root = clone(tpl.scene);
  root.name = "person-" + look;
  const bones = {};
  const meshes = [];
  root.traverse((n) => {
    if (n.isBone) bones[n.name] = n;
    if (n.isSkinnedMesh) meshes.push(n);
  });
  const skel = meshes[0].skeleton;
  root.updateMatrixWorld(true);
  const inv = new Matrix4().copy(root.matrixWorld).invert();
  const rest = {};
  for (const [name, b] of Object.entries(bones)) {
    const w = new Matrix4().multiplyMatrices(inv, b.matrixWorld), p = V(), q = new Quaternion(), s = V();
    w.decompose(p, q, s);
    rest[name] = { p, q, local: b.quaternion.clone(), localP: b.position.clone() };
  }
  const RP = (n) => rest[n].p;
  const height = RP("head").y + 0.17;
  const T0 = RP(BONES.l.up).clone().add(RP(BONES.r.up)).multiplyScalar(0.5).distanceTo(RP(BONES.l.thigh).clone().add(RP(BONES.r.thigh)).multiplyScalar(0.5));
  const dir = (a, b) => RP(b).clone().sub(RP(a)).normalize();
  const R = {
    hipX: dir(BONES.r.thigh, BONES.l.thigh),
    shX: dir(BONES.r.up, BONES.l.up),
    up: V(0, 1, 0),
    fwd: V(0, 0, 1),
    neckUp: dir(BONES.neck, BONES.head)
  };
  const restSpineUp = RP(BONES.neck).clone().sub(RP(BONES.pelvis)).normalize();
  const len = {};
  for (const s of ["l", "r"]) {
    const B = BONES[s];
    len[s] = {
      up: RP(B.up).distanceTo(RP(B.fore)),
      fore: RP(B.fore).distanceTo(RP(B.hand)),
      hand: RP(B.hand).distanceTo(RP("middle_01_" + s)),
      thigh: RP(B.thigh).distanceTo(RP(B.calf)),
      calf: RP(B.calf).distanceTo(RP(B.foot)),
      foot: RP(B.foot).distanceTo(RP(B.ball))
    };
  }
  const OUT = typeof o.outfit === "string" ? OUTFITS[o.outfit] : o.outfit || null;
  const glassOn = look === "glass";
  const glassMats = {};
  const plain = glassOn && o.plain !== false;
  const glass = !glassOn ? null : plain ? plainMaterials(o.plainLook) : glassMaterials(o.glass);
  const depthMeshes = [];
  const plainByMesh = /* @__PURE__ */ new Map();
  for (const m of meshes) {
    m.frustumCulled = false;
    const part = partOf(m);
    m.userData.part = part;
    if (plain) {
      if (/^(hair|eyes|brows|cap|lashes|eyelashes|teeth|tongue)/.test(part)) {
        m.visible = false;
        m.userData.hidden = true;
        continue;
      }
      const sk = m.skeleton, idx = sk.bones.findIndex((b) => b.name === BONES.head);
      const key = sk.bones.map((b) => b.name).join(",");
      let gm = plainByMesh.get(key);
      if (!gm) {
        const hide = { value: new Array(64).fill(0) };
        if (idx >= 0) {
          const head = sk.bones[idx];
          sk.bones.forEach((b, i) => {
            let n = b;
            while (n) {
              if (n === head) {
                if (i < 64) hide.value[i] = 1;
                break;
              }
              n = n.parent;
            }
          });
        }
        gm = plainByMesh.size === 0 ? glass : plainMaterials(o.plainLook, { uOpacity: glass.uniforms.uOpacity });
        gm.uniforms.uHide.value = hide.value;
        plainByMesh.set(key, gm);
      }
      m.material = gm.color;
      m.renderOrder = ((_a = o.renderOrder) != null ? _a : 20) + 1;
      const d = new SkinnedMesh(m.geometry, gm.depth);
      d.name = m.name + "_depth";
      d.userData.lod = lodName(m);
      d.bind(m.skeleton, m.bindMatrix);
      d.renderOrder = (_b = o.renderOrder) != null ? _b : 20;
      d.frustumCulled = false;
      m.parent.add(d);
      depthMeshes.push(d);
      continue;
    }
    if (OUT && OUT.hide && OUT.hide.includes(part)) {
      m.visible = false;
      m.userData.hidden = true;
      continue;
    }
    if (glassOn) {
      if (part === "eyes" || part === "brows") {
        m.visible = false;
        m.userData.hidden = true;
        continue;
      }
      const gt = OUT && OUT.glass && OUT.glass[part];
      const gm = gt ? glassMats[part] || (glassMats[part] = glassMaterials(Object.assign({}, o.glass, { fill: gt[0], fillA: gt[1], rimA: 0.9 }))) : glass;
      if (gt) gm.uniforms.uOpacity = gm.ghost.uniforms.uOpacity = glass.uniforms.uOpacity;
      m.material = gm.color;
      m.renderOrder = ((_c = o.renderOrder) != null ? _c : 20) + 1;
      const d = new SkinnedMesh(m.geometry, gm.depth);
      d.name = m.name + "_depth";
      d.userData.lod = lodName(m);
      d.bind(m.skeleton, m.bindMatrix);
      d.renderOrder = (_d = o.renderOrder) != null ? _d : 20;
      d.frustumCulled = false;
      m.parent.add(d);
      depthMeshes.push(d);
      if (o.ghost !== false) {
        const h = new SkinnedMesh(m.geometry, gm.ghost);
        h.name = m.name + "_ghost";
        h.userData.lod = lodName(m);
        h.bind(m.skeleton, m.bindMatrix);
        h.renderOrder = ((_e = o.renderOrder) != null ? _e : 20) + 2;
        h.frustumCulled = false;
        m.parent.add(h);
        depthMeshes.push(h);
      }
    } else {
      const mat = m.material.clone();
      m.material = mat;
      m.castShadow = true;
      m.receiveShadow = true;
      const C = Object.assign({}, OUT && OUT.colors, o.colors);
      if (C[part] != null) mat.color = new Color(C[part]);
      if (OUT && OUT.plain && OUT.plain.includes(part)) {
        mat.map = null;
        mat.needsUpdate = true;
      }
      if (part === "shoes") mat.roughness = 0.6;
      if (part === "body") {
        mat.roughness = 0.55;
        if (C.skin) mat.color = new Color(C.skin);
      }
    }
  }
  const lodOf = (m) => /^LOD1/.test(m.userData.lod || lodName(m)) ? 1 : 0;
  let lod = -1;
  function setLOD(n) {
    if (n === lod) return;
    lod = n;
    for (const m of [...meshes, ...depthMeshes]) m.visible = !m.userData.hidden && lodOf(m) === n;
  }
  setLOD((_f = o.lod) != null ? _f : 0);
  if (plain && bones[BONES.head]) {
    const hp = RP(BONES.head), geo = new SphereGeometry(1, 28, 20);
    for (const [mat, ro, nm] of [[glass.depth, (_g = o.renderOrder) != null ? _g : 20, "plainHead_depth"], [glass.color, ((_h = o.renderOrder) != null ? _h : 20) + 1, "plainHead"]]) {
      const e = new Mesh(geo, mat);
      e.name = nm;
      e.renderOrder = ro;
      e.frustumCulled = false;
      e.scale.set(0.083, 0.112, 0.098);
      e.position.set(hp.x, hp.y + 0.088, hp.z + 0.012);
      root.add(e);
      root.updateMatrixWorld(true);
      bones[BONES.head].attach(e);
    }
  }
  const shadow = o.shadow === false ? null : contactShadow();
  const grips = {};
  function fingerFrame(s) {
    const H = RP(BONES[s].hand), knuckle = RP("index_01_" + s).clone().sub(RP("pinky_01_" + s)).normalize();
    const fdir = RP("middle_01_" + s).clone().sub(H).normalize();
    let palm = V().crossVectors(knuckle, fdir).normalize();
    if (palm.x * Math.sign(H.x) > 0) palm.negate();
    return { knuckle, fdir, palm };
  }
  const FF = { l: fingerFrame("l"), r: fingerFrame("r") };
  function localTurn(name, ax, ang) {
    const b = bones[name], wq2 = rest[name].q, pq = b.parent && rest[b.parent.name] ? rest[b.parent.name].q : new Quaternion();
    const w2 = new Quaternion().setFromAxisAngle(ax, ang).multiply(wq2);
    return pq.clone().invert().multiply(w2);
  }
  const GRIP = {
    // per finger: [mcp, pip, dip] curl in degrees; thumb [cmc toward palm, mcp, ip]
    // relaxed (Matt 10/23: "no open flamboyant hands"): a hand hanging at the side curls ~25-35 deg at each knuckle
    relaxed: { f: [24, 32, 18], t: [14, 12, 10] },
    open: { f: [6, 8, 4], t: [4, 4, 2], spread: 0.35 },
    fist: { f: [80, 95, 60], t: [35, 30, 30] },
    club: { f: [62, 80, 45], t: [30, 20, 15] },
    // wrapped round a 2.6 cm grip
    paddle: { f: [40, 70, 40], t: [20, 10, 10] },
    ball: { f: [42, 55, 32], t: [30, 18, 12] }
    // fingers round a 22 cm ball, not splayed under it
  };
  function buildGrip(s, kind) {
    const g = GRIP[kind] || GRIP.relaxed, F = FF[s], out = {};
    const mdir = RP("middle_02_" + s).clone().sub(RP("middle_01_" + s)), pn = F.palm.clone().normalize();
    const spreadTurn = (fn) => {
      var _a2;
      if (fn === "middle" || !bones["".concat(fn, "_02_").concat(s)]) return 0;
      const d = RP("".concat(fn, "_02_").concat(s)).clone().sub(RP("".concat(fn, "_01_").concat(s)));
      d.addScaledVector(pn, -d.dot(pn));
      const m = mdir.clone().addScaledVector(pn, -mdir.dot(pn));
      if (d.lengthSq() < 1e-10 || m.lengthSq() < 1e-10) return 0;
      d.normalize();
      m.normalize();
      return Math.atan2(V().crossVectors(d, m).dot(pn), d.dot(m)) * (1 - ((_a2 = g.spread) != null ? _a2 : 0.3));
    };
    for (const fn of BONES.fingers) for (let i = 0; i < 3; i++) {
      const name = "".concat(fn, "_0").concat(i + 1, "_").concat(s);
      if (!bones[name]) continue;
      const ang = g.f[i] * Math.PI / 180;
      let ax = F.knuckle.clone();
      const d0 = F.fdir.clone(), d1 = d0.clone().applyAxisAngle(ax, 0.3);
      if (d1.dot(F.palm) < d0.dot(F.palm)) ax.negate();
      const b = bones[name], pq = rest[b.parent.name].q;
      let w2 = new Quaternion().setFromAxisAngle(ax, ang).multiply(rest[name].q);
      if (i === 0) {
        const sp = spreadTurn(fn);
        if (sp) w2 = new Quaternion().setFromAxisAngle(pn, sp).multiply(w2);
      }
      out[name] = pq.clone().invert().multiply(w2);
    }
    for (let i = 0; i < 3; i++) {
      const name = "thumb_0".concat(i + 1, "_").concat(s);
      if (!bones[name]) continue;
      const ang = g.t[i] * Math.PI / 180;
      const tdir = RP("thumb_0".concat(Math.min(3, i + 2), "_").concat(s)).clone().sub(RP("thumb_0".concat(i + 1, "_").concat(s))).normalize();
      let ax = V().crossVectors(tdir, F.palm).normalize();
      const d1 = tdir.clone().applyAxisAngle(ax, 0.3);
      if (d1.dot(F.palm) < tdir.dot(F.palm)) ax.negate();
      const b = bones[name], pq = rest[b.parent.name].q, w2 = new Quaternion().setFromAxisAngle(ax, ang).multiply(rest[name].q);
      out[name] = pq.clone().invert().multiply(w2);
    }
    return out;
  }
  function grip(s, kind) {
    var _a2;
    const g = grips[_a2 = s + kind] || (grips[_a2] = buildGrip(s, kind));
    for (const [n, q] of Object.entries(g)) bones[n].quaternion.copy(q);
    P.gripKind[s] = kind;
  }
  void localTurn;
  const W = {};
  const wq = (name) => W[name] || rest[name].q;
  function setWorld(name, q) {
    W[name] = q.clone();
    const b = bones[name], par = b.parent && b.parent.isBone ? b.parent.name : null;
    const pq = par ? wq(par) : new Quaternion();
    b.quaternion.copy(pq.clone().invert().multiply(q));
  }
  function inherited(name, childName) {
    const b = bones[name], par = b.parent && b.parent.isBone ? b.parent.name : null;
    const pq = par ? wq(par) : new Quaternion();
    const q = pq.clone().multiply(rest[name].local);
    const d = rest[childName].p.clone().sub(rest[name].p).applyQuaternion(rest[name].q.clone().invert()).applyQuaternion(q).normalize();
    return { q, d };
  }
  function aim(name, childName, target, pole, restPole2) {
    const { q, d } = inherited(name, childName);
    const t = target.clone().normalize();
    let w = _q.setFromUnitVectors(d, t).multiply(q);
    if (pole && restPole2) {
      const rp = restPole2.clone().applyQuaternion(rest[name].q.clone().invert()).applyQuaternion(w);
      const a = rp.addScaledVector(t, -rp.dot(t)), b = pole.clone().addScaledVector(t, -pole.dot(t));
      const prev = polePrev[name];
      if (prev) {
        const pp = prev.clone().addScaledVector(t, -prev.dot(t)), bl = b.length();
        if (pp.lengthSq() > 1e-6 && bl < 0.6) b.addScaledVector(pp.normalize(), (0.6 - bl) * 4);
      }
      if (b.lengthSq() > 1e-6) polePrev[name] = b.clone().normalize();
      if (a.lengthSq() > 1e-6 && b.lengthSq() > 1e-6) {
        a.normalize();
        b.normalize();
        const tw = _q2.setFromUnitVectors(a, b);
        w = tw.multiply(w);
      }
    }
    setWorld(name, w);
    return w;
  }
  const _hipL = V(), _hipR = V(), _shL = V(), _shR = V(), polePrev = {}, twPrev = {};
  const restPole = {};
  for (const s of ["l", "r"]) {
    const B = BONES[s];
    const sh = RP(B.up), el = RP(B.fore), wr = RP(B.hand), mid = sh.clone().lerp(wr, 0.5);
    restPole[s + "up"] = el.clone().sub(mid).normalize();
    restPole[s + "thigh"] = V(0, 0, 1);
  }
  const P = {
    root,
    bones,
    rest,
    skeleton: skel,
    meshes,
    shadow,
    look,
    height,
    T0,
    len,
    neckTilt: R.neckUp.z / Math.max(0.3, R.neckUp.y),
    // the rest neck leans forward this much (z per y): a head given straight up would look at the sky
    glass,
    gripKind: { l: null, r: null },
    _twist: { l: 0, r: 0 },
    get lod() {
      return lod;
    },
    setLOD,
    set opacity(a) {
      if (glass) glass.uniforms.uOpacity.value = a;
      else for (const m of meshes) {
        m.material.transparent = a < 0.999;
        m.material.opacity = a;
      }
      root.visible = a > 0.01;
      if (shadow) shadow.material.opacity = a * 0.8;
    },
    grip,
    pose(J) {
      var _a2, _b2, _c2, _d2, _e2, _f2;
      root.updateMatrixWorld();
      for (const k in W) delete W[k];
      const toP = new Matrix4().copy(root.matrix).invert();
      const j = {};
      for (const [k, v] of Object.entries(J)) if (v && v.isVector3) j[k] = v.clone().applyMatrix4(toP);
      const dirToP = new Matrix3().setFromMatrix4(toP);
      const jd = (k) => J[k] && J[k].isVector3 ? J[k].clone().applyMatrix3(dirToP).normalize() : null;
      const hasT = j.lHip && j.rHip && j.lShoulder && j.rShoulder;
      if (!hasT) return;
      const hipM = j.lHip.clone().add(j.rHip).multiplyScalar(0.5), shM = j.lShoulder.clone().add(j.rShoulder).multiplyScalar(0.5);
      const spineUp = shM.clone().sub(hipM).normalize();
      const hipX = j.lHip.clone().sub(j.rHip).normalize();
      const pelUp = V(0, 1, 0).lerp(spineUp, (_a2 = J.pelvisTip) != null ? _a2 : 0.65).normalize();
      const qPel = basisQuatX(hipX, pelUp).multiply(basisQuatX(R.hipX, R.up).invert());
      const restHipM = RP(BONES.l.thigh).clone().add(RP(BONES.r.thigh)).multiplyScalar(0.5);
      const pelPos = hipM.clone().sub(restHipM.clone().sub(RP(BONES.pelvis)).applyQuaternion(qPel));
      setWorld(BONES.pelvis, qPel.clone().multiply(rest[BONES.pelvis].q));
      P._pelPos = pelPos.clone();
      const pb = bones[BONES.pelvis];
      const parentInv = pb.parent && pb.parent.isBone ? new Matrix4().compose(rest[pb.parent.name].p, wq(pb.parent.name), V(1, 1, 1)).invert() : null;
      pb.position.copy(parentInv ? pelPos.clone().applyMatrix4(parentInv) : pelPos);
      const shX = j.lShoulder.clone().sub(j.rShoulder).normalize();
      const qChest = basisQuat(shX, spineUp).multiply(basisQuat(R.shX, restSpineUp).invert());
      const fr = [0.3, 0.62, 1];
      BONES.spine.forEach((n, i) => setWorld(n, qPel.clone().slerp(qChest, fr[i]).multiply(rest[n].q)));
      const qHeadBase = qChest.clone();
      let qHead = qHeadBase;
      if (j.head) {
        const neckTop = shM.clone().addScaledVector(spineUp, 0.06);
        const hu = j.head.clone().sub(neckTop).normalize();
        const fw = j.nose ? j.nose.clone().sub(j.head).normalize() : V(0, 0, 1).applyQuaternion(qChest);
        const hx = V().crossVectors(hu, fw).normalize();
        qHead = basisQuat(hx, hu).multiply(basisQuat(V(1, 0, 0), R.neckUp).invert());
      }
      setWorld(BONES.neck, qChest.clone().slerp(qHead, 0.45).multiply(rest[BONES.neck].q));
      setWorld(BONES.head, qHead.clone().multiply(rest[BONES.head].q));
      const fwdC = V(0, 0, 1).applyQuaternion(qChest), fwdP = V(0, 0, 1).applyQuaternion(qPel);
      P._limits = P._limits || { elbow: 0, knee: 0 };
      const legalElbow = (s, sh, hand, pole) => {
        if (!pole || hand.y > sh.y - 0.1) return null;
        const out = V(s === "l" ? 1 : -1, 0, 0).applyQuaternion(qChest);
        if (hand.clone().sub(sh).dot(fwdC) < -0.06) {
          const want = out.clone().addScaledVector(fwdC, -0.4).normalize();
          return pole.clone().normalize().dot(want) > 0.9 ? null : want;
        }
        const pl = pole.clone().normalize(), f = pl.dot(fwdC);
        const lat = Math.abs(hand.clone().sub(sh).dot(out));
        if (lat < 0.3 && f > -0.55) return pl.addScaledVector(fwdC, -f - 0.75).normalize();
        if (f <= -0.12) return null;
        return pl.addScaledVector(fwdC, -f - 0.35).normalize();
      };
      for (const s of ["l", "r"]) {
        const B = BONES[s];
        setWorld(B.clav, wq(bones[B.clav].parent.name).clone().multiply(rest[B.clav].local));
        const tgt = j[s + "Grip"] || j[s + "Wrist"];
        if (o.clavFollow && tgt) {
          const cp = P.local(B.clav), u0 = P.local(B.up), c0 = u0.clone().sub(cp).normalize(), d = tgt.clone().sub(u0).normalize();
          const t = c0.clone().addScaledVector(d.clone().addScaledVector(c0, -d.dot(c0)), 0.45).normalize();
          const lim = (d.y > -0.3 ? 25 : 8) * Math.PI / 180, ang = c0.angleTo(t);
          const qc = new Quaternion().setFromUnitVectors(c0, t);
          if (ang > lim) qc.slerp(new Quaternion(), 1 - lim / ang);
          setWorld(B.clav, qc.multiply(wq(B.clav)));
        }
        const grip2 = j[s + "Grip"];
        if (grip2) {
          const sh = P.local(B.up);
          let pole = jd(s + "PoleDir") || V(0, -1, 0);
          const lp = legalElbow(s, sh, grip2, pole);
          if (lp) {
            pole = lp;
            P._limits.elbow++;
          }
          const r = ik2(sh, grip2, len[s].up, len[s].fore + ((_b2 = J[s + "GripLen"]) != null ? _b2 : 0.075), pole);
          const wr = r.elbow.clone().addScaledVector(r.end.clone().sub(r.elbow).normalize(), len[s].fore);
          aim(B.up, B.fore, r.elbow.clone().sub(sh), pole, restPole[s + "up"]);
          aim(B.fore, B.hand, wr.clone().sub(r.elbow));
          j[s + "Elbow"] = r.elbow;
          j[s + "Wrist"] = wr;
        } else {
          const sh = j[s + "Shoulder"], wr = j[s + "Wrist"];
          let el = j[s + "Elbow"];
          if (el && sh && wr) {
            const lp = legalElbow(s, sh, wr, el.clone().sub(sh.clone().lerp(wr, 0.5)));
            if (lp) {
              el = ik2(sh, wr, el.distanceTo(sh), wr.distanceTo(el), lp).elbow;
              j[s + "Elbow"] = el;
              P._limits.elbow++;
            }
          }
          if (el && sh) {
            const ud = el.clone().sub(sh), fd = wr ? wr.clone().sub(el) : null;
            let pole = null;
            if (fd) {
              const bend = ud.clone().normalize().angleTo(fd.clone().normalize());
              if (bend > 0.25) {
                const mid = sh.clone().lerp(wr, 0.5);
                pole = el.clone().sub(mid).normalize();
              }
            }
            aim(B.up, B.fore, ud, pole, restPole[s + "up"]);
            if (fd) aim(B.fore, B.hand, fd);
            else setWorld(B.fore, wq(B.up).clone().multiply(rest[B.fore].local));
          } else {
            setWorld(B.up, wq(B.clav).clone().multiply(rest[B.up].local));
            setWorld(B.fore, wq(B.up).clone().multiply(rest[B.fore].local));
          }
        }
        const hd = jd(s + "HandDir"), pm = jd(s + "Palm");
        if (hd) {
          const inh = inherited(B.hand, "middle_01_" + s);
          let w = _q.setFromUnitVectors(inh.d, hd).multiply(inh.q);
          if (pm) {
            const rp = FF[s].palm.clone().applyQuaternion(rest[B.hand].q.clone().invert()).applyQuaternion(w);
            const a = rp.addScaledVector(hd, -rp.dot(hd)), b = pm.clone().addScaledVector(hd, -pm.dot(hd));
            if (a.lengthSq() > 1e-6 && b.lengthSq() > 1e-6) w = _q2.setFromUnitVectors(a.normalize(), b.normalize()).multiply(w);
          }
          const fax = rest[B.hand].p.clone().sub(rest[B.fore].p).applyQuaternion(rest[B.fore].q.clone().invert()).applyQuaternion(wq(B.fore)).normalize();
          const rel = w.clone().multiply(inh.q.clone().invert()), pr = fax.dot(_v.set(rel.x, rel.y, rel.z));
          let tw = 2 * Math.atan2(pr, rel.w);
          const pt = (_c2 = twPrev[s]) != null ? _c2 : 0;
          while (tw - pt > Math.PI) tw -= 2 * Math.PI;
          while (tw - pt < -Math.PI) tw += 2 * Math.PI;
          if (Math.abs(tw) > 2 * Math.PI) tw -= Math.sign(tw) * 2 * Math.PI;
          twPrev[s] = tw;
          const tw0 = 2 * Math.atan2(pr, rel.w);
          const rMax = (_d2 = o.rollMax) != null ? _d2 : ROLL_MAX;
          tw = rMax * Math.tanh(tw / rMax);
          P._twist[s] = tw;
          w = new Quaternion().setFromAxisAngle(fax, tw - tw0).multiply(w);
          const sh = j[s + "Shoulder"], el = j[s + "Elbow"], wr = j[s + "Wrist"];
          const bend = sh && el && wr ? el.clone().sub(sh).angleTo(wr.clone().sub(el)) : 1;
          const su = ROLL_UP * (1 - clamp((bend - 0.26) / 0.52, 0, 1));
          if (su > 0.01) {
            const uax = rest[B.fore].p.clone().sub(rest[B.up].p).applyQuaternion(rest[B.up].q.clone().invert()).applyQuaternion(wq(B.up)).normalize();
            setWorld(B.up, new Quaternion().setFromAxisAngle(uax, tw * su).multiply(wq(B.up)));
          }
          setWorld(B.fore, new Quaternion().setFromAxisAngle(fax, tw * (su + ROLL * (1 - su))).multiply(W[B.fore]));
          setWorld(B.hand, w.clone());
        } else setWorld(B.hand, wq(B.fore).clone().multiply(rest[B.hand].local));
      }
      for (const s of ["l", "r"]) {
        const B = BONES[s], hp = j[s + "Hip"], an = j[s + "Ankle"];
        let kn = j[s + "Knee"];
        if (kn && hp && an) {
          const mid = hp.clone().lerp(an, 0.5), pk = kn.clone().sub(mid), f = pk.dot(fwdP), l1 = kn.distanceTo(hp), l2 = an.distanceTo(kn);
          if (f < 0.25 * pk.length() && hp.distanceTo(an) < (l1 + l2) * 0.995) {
            const pole = pk.addScaledVector(fwdP, -f).multiplyScalar(0.5).addScaledVector(fwdP, Math.max(0.02, pk.length()));
            kn = ik2(hp, an, l1, l2, pole.normalize()).elbow;
            j[s + "Knee"] = kn;
            P._limits.knee++;
          }
        }
        if (kn && hp) {
          const td = kn.clone().sub(hp), cd = an ? an.clone().sub(kn) : null;
          let pole = V(0, 0, 1).applyQuaternion(qPel);
          if (cd && td.clone().normalize().angleTo(cd.clone().normalize()) > 0.2) {
            const mid = hp.clone().lerp(an, 0.5);
            pole = kn.clone().sub(mid).normalize();
          }
          aim(B.thigh, B.calf, td, pole, restPole[s + "thigh"]);
          if (cd) aim(B.calf, B.foot, cd);
          else setWorld(B.calf, wq(B.thigh).clone().multiply(rest[B.calf].local));
        } else {
          setWorld(B.thigh, wq(B.pelvis || BONES.pelvis).clone().multiply(rest[B.thigh].local));
          setWorld(B.calf, wq(B.thigh).clone().multiply(rest[B.calf].local));
        }
        let fdW;
        if (j[s + "Toe"] && j[s + "Ankle"]) fdW = j[s + "Toe"].clone().sub(j[s + "Ankle"]).normalize();
        else {
          const restF = RP(B.ball).clone().sub(RP(B.foot)), drop = restF.y;
          restF.y = 0;
          const yawF = V(0, 0, 1).applyQuaternion(qPel);
          yawF.y = 0;
          if (yawF.lengthSq() < 1e-6) yawF.set(0, 0, 1);
          yawF.normalize();
          const flare = (_e2 = J[s + "Flare"]) != null ? _e2 : 0.12;
          const restYaw = Math.atan2(restF.x, restF.z), yaw = Math.atan2(yawF.x, yawF.z) + (s === "l" ? 1 : -1) * flare;
          const hl = Math.hypot(restF.x, restF.z);
          void restYaw;
          fdW = V(Math.sin(yaw) * hl, drop, Math.cos(yaw) * hl).normalize();
        }
        const { q, d } = inherited(B.foot, B.ball);
        const fq = _q.setFromUnitVectors(d, fdW).multiply(q);
        const upNow = V(0, 1, 0).applyQuaternion(rest[B.foot].q.clone().invert()).applyQuaternion(fq);
        const a = upNow.addScaledVector(fdW, -upNow.dot(fdW)), b = V(0, 1, 0).addScaledVector(fdW, -fdW.y);
        const w = a.lengthSq() > 1e-6 && b.lengthSq() > 1e-6 ? _q2.setFromUnitVectors(a.normalize(), b.normalize()).multiply(fq) : fq;
        setWorld(B.foot, w.clone());
        setWorld(B.ball, wq(B.foot).clone().multiply(rest[B.ball].local));
      }
      root.updateMatrixWorld(true);
      if (shadow) {
        const fl = P.world(BONES.l.foot), fr2 = P.world(BONES.r.foot);
        shadow.position.set((fl.x + fr2.x) / 2, ((_f2 = o.groundY) != null ? _f2 : 0) + 4e-3, (fl.z + fr2.z) / 2);
        const sp = Math.hypot(fl.x - fr2.x, fl.z - fr2.z);
        shadow.scale.set(0.55 + sp, 0.55 + sp * 0.6, 1);
        shadow.rotation.set(-Math.PI / 2, 0, -Math.atan2(fl.z - fr2.z, fl.x - fr2.x));
      }
    },
    // a bone head's position in PERSON space from this frame's working rotations (walks the chain from the pelvis)
    local(name) {
      const chain = [];
      let b = bones[name];
      while (b && b.isBone) {
        chain.unshift(b);
        b = b.parent;
      }
      let p = null, q = null;
      for (const c of chain) {
        if (p === null) {
          const r = rest[c.name];
          p = r.p.clone();
          q = r.q.clone();
          if (c.name === BONES.pelvis) {
            p = P._pelPos.clone();
          }
          q = wq(c.name).clone();
          continue;
        }
        if (c.name === BONES.pelvis) {
          p = P._pelPos.clone();
          q = wq(c.name).clone();
          continue;
        }
        p = p.clone().add(c.position.clone().applyQuaternion(q));
        q = wq(c.name).clone();
      }
      return p;
    },
    // a bone's world position (scene space) and world quaternion
    world(name, out = V()) {
      return bones[name].getWorldPosition(out);
    },
    worldQuat(name, out = new Quaternion()) {
      return bones[name].getWorldQuaternion(out);
    },
    // the grip point and frame of a hand (for props): between the palm and the middle knuckles
    handFrame(s) {
      const h = P.world(BONES[s].hand), m = P.world("middle_01_" + s), i = P.world("index_01_" + s), p = P.world("pinky_01_" + s);
      const fwd = m.clone().sub(h).normalize(), across = i.clone().sub(p).normalize(), palm = V().crossVectors(across, fwd).normalize();
      return { p: h.clone().lerp(m, 0.75), fwd, across, palm };
    },
    restLen: len,
    mixer: null,
    play(clip, { loop = true, fade = 0.2 } = {}) {
      P.mixer || (P.mixer = new AnimationMixer(root));
      const a = P.mixer.clipAction(clip);
      a.setLoop(loop ? LoopRepeat : LoopOnce);
      a.clampWhenFinished = !loop;
      if (P._act && P._act !== a) P._act.crossFadeTo(a.reset().play(), fade, false);
      else a.play();
      P._act = a;
      return a;
    },
    tick(dt) {
      if (P.mixer) P.mixer.update(dt);
    },
    lookAt(target, k = 1) {
      root.updateMatrixWorld(true);
      const hb = bones[BONES.head], hp = P.world(BONES.head), fw = V(0, 0, 1).applyQuaternion(P.worldQuat(BONES.head));
      const want = target.clone().sub(hp).normalize(), q = new Quaternion().setFromUnitVectors(fw, want);
      const ang = 2 * Math.acos(clamp(q.w, -1, 1));
      if (ang > 1.2) q.slerp(new Quaternion(), 1 - 1.2 / ang);
      const pw = hb.parent.getWorldQuaternion(new Quaternion()), wqH = P.worldQuat(BONES.head);
      const nw = new Quaternion().slerp(q, k).multiply(wqH);
      hb.quaternion.copy(pw.invert().multiply(nw));
    },
    dispose() {
      root.removeFromParent();
      if (shadow) shadow.removeFromParent();
    }
  };
  grip("l", o.grip || "relaxed");
  grip("r", o.grip || "relaxed");
  return P;
}
function ankleHeight(p) {
  p.root.updateMatrixWorld(true);
  let sole = Infinity;
  const v = new Vector3();
  p.root.traverse((m) => {
    if (!m.isSkinnedMesh || /_depth|_ghost/.test(m.name)) return;
    const part = m.userData.part;
    if (part !== "shoes" && part !== "body") return;
    if (m.userData.hidden || !/^LOD0/.test(m.userData.lod || m.name || "") && m.userData.lod) return;
    const pos = m.geometry.attributes.position;
    for (let i = 0; i < pos.count; i += 2) {
      v.fromBufferAttribute(pos, i);
      m.applyBoneTransform(i, v);
      v.applyMatrix4(m.matrixWorld);
      if (v.y < sole) sole = v.y;
    }
  });
  return p.world(BONES.l.foot).y - (isFinite(sole) ? sole : p.root.position.y);
}
function ik2(a, c, l1, l2, pole) {
  const ac = c.clone().sub(a), D0 = ac.length(), D = Math.min(Math.max(D0, Math.abs(l1 - l2) + 1e-3), (l1 + l2) * 0.999), dir = ac.divideScalar(D0 || 1);
  const ca = clamp((l1 * l1 + D * D - l2 * l2) / (2 * l1 * D), -1, 1), sa = Math.sqrt(1 - ca * ca);
  const perp = pole.clone().addScaledVector(dir, -pole.dot(dir));
  if (perp.lengthSq() < 1e-8) perp.set(0, -1, 0).addScaledVector(dir, dir.y);
  perp.normalize();
  return { elbow: a.clone().addScaledVector(dir, l1 * ca).addScaledVector(perp, l1 * sa), end: a.clone().addScaledVector(dir, D) };
}
function oneEuro(minCut = 2.2, beta = 1.6, dCut = 1.2, spike = 0.32) {
  let x = null, dx = null, tp = 0, held = 0;
  const al = (c, dt) => 1 / (1 + 1 / (2 * Math.PI * c * dt));
  return (v, t, scale = 1) => {
    if (!v) return x;
    if (x === null) {
      x = v.slice();
      dx = v.map(() => 0);
      tp = t;
      return x;
    }
    const dt = Math.max(8e-3, Math.min(0.2, (t - tp) / 1e3));
    tp = t;
    if (Math.hypot(...v.map((c, i) => c - x[i])) > spike * scale && held < 1) {
      held++;
      return x;
    }
    held = 0;
    const ad = al(dCut, dt);
    dx = dx.map((d, i) => d + ad * ((v[i] - x[i]) / dt - d));
    const a = al(minCut + beta * Math.hypot(...dx), dt);
    x = x.map((c, i) => c + a * (v[i] - c));
    return x;
  };
}
function fpsGuard({ min = 28, sec = 3, grace = 2, onLow } = {}) {
  let t0 = null, n = 0, fired = false, start = null;
  return {
    tick(now) {
      if (fired) return;
      if (start === null) start = now;
      if (now - start < grace * 1e3) return;
      if (t0 === null) {
        t0 = now;
        n = 0;
        return;
      }
      n++;
      if (now - t0 >= sec * 1e3) {
        const fps = n * 1e3 / (now - t0);
        t0 = now;
        n = 0;
        if (fps < min) {
          fired = true;
          onLow && onLow(fps);
        }
      }
    },
    get fired() {
      return fired;
    }
  };
}
function solvePicture(BP, S, o) {
  const I = BP.img;
  if (!I || !I.lShoulder || !I.rShoulder || !I.lHip || !I.rHip) return null;
  const MIR = o.view === "mirror", now = o.now;
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const chest = mid(I.lShoulder, I.rShoulder), hip = mid(I.lHip, I.rHip), Tp = Math.max(0.02, Math.hypot(chest[0] - hip[0], chest[1] - hip[1]));
  const k = o.T0 / Tp;
  const J = BP.rawJ && performance.now() - (BP.rawJAt || 0) < 300 ? BP.rawJ : BP.joints;
  const shZ = J && J.lShoulder && J.rShoulder ? (J.lShoulder[2] + J.rShoulder[2]) / 2 : 0;
  S.f || (S.f = {});
  const F = (key, v, sc) => {
    var _a;
    return ((_a = S.f)[key] || (_a[key] = oneEuro()))(v, now, sc);
  };
  const feet = I.lFoot && I.rFoot && I.lFoot[1] < 0.985 && I.rFoot[1] < 0.985;
  const g = feet ? Math.max(I.lFoot[1], I.rFoot[1]) : hip[1] + 1.75 * Tp;
  S.g = S.g == null ? g : S.g + (g - S.g) * (g > S.g ? 0.35 : 0.1);
  const sx = MIR ? -1 : 1;
  const out = {};
  const map = (key, depth) => {
    var _a;
    if (MIR) key = key[0] === "l" && key[1] === key[1].toUpperCase() && key !== "head" ? "r" + key.slice(1) : key[0] === "r" && key[1] === key[1].toUpperCase() ? "l" + key.slice(1) : key;
    const p = I[key];
    if (!p) return null;
    const x = sx * (p[0] - chest[0]) * k, y = (S.g - p[1]) * k + ((_a = o.ankleY) != null ? _a : 0.08);
    const z = depth || 0;
    const f = F(key, [x, y, z], 1);
    return V(f[0], f[1], f[2]);
  };
  const dep = (key) => {
    if (MIR) key = key[0] === "l" ? "r" + key.slice(1) : "l" + key.slice(1);
    return J && J[key] ? clamp(J[key][2] - shZ, -0.3, 0.7) : 0;
  };
  for (const [a, b] of [["lShoulder", "lShoulder"], ["rShoulder", "rShoulder"], ["lHip", "lHip"], ["rHip", "rHip"], ["head", "head"]]) out[a] = map(b, 0);
  out.lElbow = map("lForearm", dep("lForearm"));
  out.rElbow = map("rForearm", dep("rForearm"));
  out.lWrist = map("lHand", dep("lHand"));
  out.rWrist = map("rHand", dep("rHand"));
  out.lKnee = map("lKnee", 0);
  out.rKnee = map("rKnee", 0);
  out.lAnkle = map("lFoot", 0);
  out.rAnkle = map("rFoot", 0);
  const L = o.len;
  const fix = (a, b, l) => {
    if (out[a] && out[b]) {
      const d = out[b].clone().sub(out[a]);
      if (d.length() > 1e-4) out[b] = out[a].clone().addScaledVector(d.normalize(), l);
    }
  };
  for (const s of ["l", "r"]) {
    fix(s + "Shoulder", s + "Elbow", L[s].up);
    fix(s + "Elbow", s + "Wrist", L[s].fore);
    fix(s + "Hip", s + "Knee", L[s].thigh);
    fix(s + "Knee", s + "Ankle", L[s].calf);
  }
  return out;
}
function createYou(o) {
  var _a;
  const { scene, BP } = o;
  const st = { ready: false, person: null, S: {}, failed: false };
  const outfit = o.outfit || "casual", url = o.url || outfitURL(outfit, o.tier);
  const guard = fpsGuard({ min: (_a = o.minFps) != null ? _a : 28, onLow: (fps) => {
    st.failed = true;
    if (st.person) st.person.root.visible = false;
    o.onFallback && o.onFallback("fps " + fps.toFixed(0));
  } });
  loadBody(url).then((t) => {
    var _a2, _b, _c;
    const p = makePerson(t, { look: "glass", outfit, lod: o.tier === 0 ? 1 : 0, glass: o.glass, renderOrder: o.renderOrder });
    p.root.position.set((_a2 = o.x) != null ? _a2 : 0, (_b = o.y) != null ? _b : 0, (_c = o.z) != null ? _c : -2.1);
    if (o.view !== "mirror") p.root.rotation.y = Math.PI;
    scene.add(p.root);
    if (p.shadow) scene.add(p.shadow);
    st.person = p;
    st.ready = true;
    p.grip("l", o.grip || "relaxed");
    p.grip("r", o.grip || "relaxed");
  }).catch((e) => {
    st.failed = true;
    o.onFallback && o.onFallback("load " + e);
  });
  return {
    st,
    get person() {
      return st.person;
    },
    update(now) {
      guard.tick(now);
      const p = st.person;
      if (!p || st.failed) return null;
      const J = solvePicture(BP, st.S, { view: o.view, now, T0: p.T0, len: p.restLen });
      if (!J) return null;
      const M = p.root.matrix;
      p.root.updateMatrix();
      for (const k in J) if (J[k]) J[k].applyMatrix4(M);
      p.pose(J);
      return J;
    }
  };
}

export {
  BONES,
  OUTFITS,
  outfitURL,
  loadBody,
  cacheBody,
  parseBody,
  glassMaterials,
  PLAIN,
  plainMaterials,
  contactShadow,
  basisQuatX,
  makePerson,
  ankleHeight,
  ik2,
  oneEuro,
  fpsGuard,
  solvePicture,
  createYou
};
