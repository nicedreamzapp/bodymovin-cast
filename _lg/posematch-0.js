import {
  environment,
  flash,
  pbr,
  realism_exports,
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
  AddEquation,
  BoxGeometry,
  CanvasTexture,
  CircleGeometry,
  Color,
  CustomBlending,
  CylinderGeometry,
  DoubleSide,
  DynamicDrawUsage,
  Euler,
  ExtrudeGeometry,
  FogExp2,
  Group,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  OneFactor,
  PlaneGeometry,
  Quaternion,
  ShaderMaterial,
  Shape,
  SphereGeometry,
  SpotLight,
  TorusGeometry,
  Vector3,
  ZeroFactor
} from "./chunk-4IYDSAYK.js";
import "./chunk-NWIHTO7D.js";

// bmpage:bmpage:posematch.html#0
(async () => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  const Q = new URLSearchParams(location.search);
  const still = (...os) => {
    for (const o of os) {
      o.updateMatrix();
      o.matrixAutoUpdate = false;
    }
  };
  const TVMERGE = [];
  function mergeStill(list, parent = scene) {
    const by = /* @__PURE__ */ new Map();
    for (const m of list) {
      m.updateWorldMatrix(true, false);
      const k = m.userData.mergeKey || m.material.uuid;
      if (!by.has(k)) by.set(k, []);
      by.get(k).push(m);
    }
    for (const ms of by.values()) {
      if (ms.length < 2) continue;
      const geo = mergeGeometries(ms.map((m) => {
        const g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone();
        g.clearGroups();
        for (const k of Object.keys(g.attributes)) if (!["position", "normal", "uv"].includes(k)) g.deleteAttribute(k);
        return g.applyMatrix4(m.matrixWorld);
      }));
      if (!geo) continue;
      const one = new Mesh(geo, ms[0].material);
      one.renderOrder = ms[0].renderOrder;
      parent.add(one);
      still(one);
      for (const m of ms) m.removeFromParent();
    }
  }
  const ENV = "circus_arena", ENV_ROT = +((_a = Q.get("rot")) != null ? _a : 1.572), BEAMK = +((_b = Q.get("beam")) != null ? _b : 1), HOUSE = +((_c = Q.get("house")) != null ? _c : 0.45), SAT = +((_d = Q.get("sat")) != null ? _d : 0.55), VEIL = +((_e = Q.get("veil")) != null ? _e : 0.42), WB = (Q.get("wb") || "1,0.96,0.8").split(",").map(Number), CONTRAST = +((_f = Q.get("contrast")) != null ? _f : 1.3), TOP = +((_g = Q.get("top")) != null ? _g : 0.5), BLOOM_T = +((_h = Q.get("bloomt")) != null ? _h : 1);
  const lerp = (a, b, t) => a + (b - a) * t;
  const { scene, camera, renderer } = setup(document.getElementById("gl"), { fov: 40, far: 1200 });
  window.__stage = { ready: false };
  window.__R = realism_exports;
  window.__scene = scene;
  camera.position.set(0, 1.42, 4.3);
  const LOOK = new Vector3(0, 1.12, 0);
  camera.lookAt(LOOK);
  scene.fog = new FogExp2(1183254, +((_i = Q.get("fog")) != null ? _i : 0.014));
  const V = (x, y, z) => new Vector3(x, y, z);
  const STAGE_TOP = 0.12, SR = 3.2;
  const deck = pbr("wood_floor", { repeat: [4, 4], physical: true, clearcoat: 0.85, roughness: 0.7, envMapIntensity: 1, color: 14200456, normalScale: 0.8 });
  deck.clearcoatRoughness = 0.1;
  const velour = pbr("velour_velvet", { repeat: [60, 1.2], color: 1315350, roughness: 1, envMapIntensity: 0.25 });
  const stage = new Mesh(new CylinderGeometry(SR, SR, 0.62, 160), [velour, deck, velour]);
  stage.position.y = STAGE_TOP - 0.31;
  stage.receiveShadow = true;
  scene.add(stage);
  still(stage);
  if (tv) stage.geometry.groups.length = 2;
  const alu = new MeshPhysicalMaterial({ color: 12896462, metalness: 0.75, roughness: 0.34, envMapIntensity: 2.4 });
  const blackMetal = new MeshStandardMaterial({ color: 855312, roughness: 0.45, metalness: 0.6, envMapIntensity: 0.8 });
  const nosing = new Mesh(new TorusGeometry(SR + 4e-3, 0.018, 10, 220), alu);
  nosing.rotation.x = Math.PI / 2;
  nosing.position.y = STAGE_TOP - 0.012;
  scene.add(nosing);
  still(nosing);
  const ledU = { t: { value: 0 }, pulse: { value: 0 }, col: { value: new Color(16754784) }, col2: { value: new Color(5930495) } };
  const led = new Mesh(new TorusGeometry(SR + 6e-3, 7e-3, 6, 400), new ShaderMaterial({
    uniforms: ledU,
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader: "uniform float t, pulse; uniform vec3 col, col2; varying vec2 vUv;\n    void main(){ float px = fract(vUv.x * 900.0); float dot1 = smoothstep(0.5, 0.15, abs(px - 0.5));\n      float chase = 0.5 + 0.5 * sin(vUv.x * 6.2832 * 6.0 - t * 2.0); vec3 c = mix(col, col2, smoothstep(0.35, 0.95, chase));\n      gl_FragColor = vec4(c * (0.8 + 1.6 * pulse) * (0.3 + 0.7 * dot1) * 4.0, 1.0); }"
  }));
  led.rotation.x = Math.PI / 2;
  led.position.y = STAGE_TOP - 0.05;
  scene.add(led);
  still(led);
  {
    const tape = new MeshStandardMaterial({ color: 1579034, roughness: 0.85, metalness: 0, polygonOffset: true, polygonOffsetFactor: -2 });
    const glow = new MeshStandardMaterial({ color: 15269856, emissive: 3828272, emissiveIntensity: 0.6, roughness: 0.7, polygonOffset: true, polygonOffsetFactor: -2 });
    const mark = (x, z, w, d, rot, m = tape) => {
      const p = new Mesh(new PlaneGeometry(w, d), m);
      p.rotation.set(-Math.PI / 2, 0, rot);
      p.position.set(x, STAGE_TOP + 1e-3, z);
      p.receiveShadow = true;
      scene.add(p);
      still(p);
      TVMERGE.push(p);
    };
    mark(0, 0.55, 0.24, 0.045, 0);
    mark(0, 0.55, 0.045, 0.24, 0);
    mark(-1.25, 0.9, 0.16, 0.04, 0.3);
    mark(1.25, 0.9, 0.16, 0.04, -0.3);
    mark(-1.9, -0.6, 0.05, 0.05, 0, glow);
    mark(1.9, -0.6, 0.05, 0.05, 0, glow);
    mark(0, -1.4, 0.3, 0.045, 0.05);
  }
  const floor = new Mesh(new CircleGeometry(40, 64), pbr("concrete_floor_02", { repeat: [16, 16], color: 3811882, roughness: 0.55 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = STAGE_TOP - 0.62;
  floor.receiveShadow = true;
  still(floor);
  if (Q.has("floor")) scene.add(floor);
  {
    const cab = pbr("rubber_tiles", { repeat: [0.6, 0.4], color: 1710620, roughness: 0.9, envMapIntensity: 0.4 });
    const grille = pbr("metal_plate", { repeat: [3, 3], color: 2763310, metalness: 0.8, roughness: 0.5 });
    const wedge = new Shape();
    wedge.moveTo(0, 0);
    wedge.lineTo(0.5, 0);
    wedge.lineTo(0.5, 0.1);
    wedge.lineTo(0, 0.34);
    wedge.closePath();
    const geo = new ExtrudeGeometry(wedge, { depth: 0.6, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 2 });
    geo.translate(-0.25, 0, -0.3);
    const n = V(0.24, 0.5, 0).normalize();
    for (const [x, z] of [[-2.05, 0.75], [2.05, 0.75]]) {
      const g = new Group();
      g.position.set(x, STAGE_TOP + 0.01, z);
      g.rotation.y = Math.atan2(z, -x);
      scene.add(g);
      still(g);
      const box = new Mesh(geo, cab);
      box.castShadow = box.receiveShadow = true;
      g.add(box);
      still(box);
      TVMERGE.push(box);
      const gr = new Mesh(new PlaneGeometry(0.5, 0.5), grille);
      gr.position.set(0, 0.22, 0).addScaledVector(n, 0.012);
      gr.quaternion.setFromUnitVectors(V(0, 0, 1), n);
      g.add(gr);
      still(gr);
      TVMERGE.push(gr);
      const l = new Mesh(new CircleGeometry(7e-3, 10), new MeshBasicMaterial({ color: new Color(4259696).multiplyScalar(3) }));
      l.position.set(0.2, 0.12, 0.2).addScaledVector(n, 0.014);
      l.quaternion.copy(gr.quaternion);
      g.add(l);
      still(l);
      l.userData.mergeKey = "wedgeLed";
      TVMERGE.push(l);
    }
  }
  const TZ = -2.05, TX = 2.45, TY = 3.62, TS = 0.29;
  {
    const bars = [];
    const bar = (a, b, r) => bars.push([a, b, r]);
    const chords = (a, b, axisPerp) => {
      const d2 = new Vector3().subVectors(b, a), L = d2.length(), u = d2.clone().normalize(), p1 = axisPerp.clone().normalize(), p2 = new Vector3().crossVectors(u, p1).normalize();
      const C = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([i, j]) => p1.clone().multiplyScalar(i * TS / 2).addScaledVector(p2, j * TS / 2));
      for (const c of C) bar(a.clone().add(c), b.clone().add(c), 0.024);
      const n = Math.max(1, Math.round(L / TS));
      for (let f = 0; f < 4; f++) {
        const c0 = C[f], c1 = C[(f + 1) % 4];
        for (let i = 0; i < n; i++) {
          const s0 = a.clone().addScaledVector(u, L * i / n), s1 = a.clone().addScaledVector(u, L * (i + 1) / n);
          bar(s0.clone().add(i % 2 ? c0 : c1), s1.clone().add(i % 2 ? c1 : c0), 8e-3);
        }
      }
    };
    for (const s of [-1, 1]) chords(V(s * TX, STAGE_TOP + 0.02, TZ), V(s * TX, TY - TS / 2, TZ), V(1, 0, 0));
    chords(V(-TX - TS / 2, TY, TZ), V(TX + TS / 2, TY, TZ), V(0, 0, 1));
    const unit = new CylinderGeometry(1, 1, 1, 10, 1);
    unit.translate(0, 0.5, 0);
    const im = new InstancedMesh(unit, alu, bars.length), M = new Matrix4(), q = new Quaternion(), up = V(0, 1, 0), d = V(0, 0, 0);
    bars.forEach(([a, b, r], i) => {
      d.subVectors(b, a);
      const L = d.length();
      q.setFromUnitVectors(up, d.normalize());
      M.compose(a, q, V(r, L, r));
      im.setMatrixAt(i, M);
    });
    im.castShadow = true;
    im.receiveShadow = true;
    scene.add(im);
    still(im);
    for (const s of [-1, 1]) {
      const base = new Mesh(new BoxGeometry(0.6, 0.014, 0.6), blackMetal);
      base.position.set(s * TX, STAGE_TOP + 7e-3, TZ);
      base.receiveShadow = true;
      scene.add(base);
      still(base);
      TVMERGE.push(base);
      const blk = new Mesh(new BoxGeometry(TS + 0.06, TS + 0.06, TS + 0.06), alu);
      blk.position.set(s * TX, TY, TZ);
      scene.add(blk);
      still(blk);
      TVMERGE.push(blk);
    }
  }
  const beamU = { t: { value: 0 } };
  const beamMat = (col, len) => new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    fog: false,
    blending: CustomBlending,
    blendEquation: AddEquation,
    blendSrc: OneFactor,
    blendDst: OneFactor,
    blendEquationAlpha: AddEquation,
    blendSrcAlpha: ZeroFactor,
    blendDstAlpha: OneFactor,
    uniforms: { col: { value: new Color(col) }, k: { value: 0.05 }, len: { value: len }, t: beamU.t },
    vertexShader: "uniform float len; varying float vA; varying vec3 vN, vW;\n    void main(){ vA = position.z / len; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }",
    fragmentShader: "uniform vec3 col; uniform float k, len, t; varying float vA; varying vec3 vN, vW;\n    float h(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }\n    float n3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);\n      return mix(mix(mix(h(i), h(i + vec3(1,0,0)), f.x), mix(h(i + vec3(0,1,0)), h(i + vec3(1,1,0)), f.x), f.y),\n                 mix(mix(h(i + vec3(0,0,1)), h(i + vec3(1,0,1)), f.x), mix(h(i + vec3(0,1,1)), h(i + vec3(1,1,1)), f.x), f.y), f.z); }\n    void main(){ vec3 v = normalize(cameraPosition - vW); float e = abs(dot(normalize(vN), v)); e = e * e * e * e;\n      float along = smoothstep(0.0, 0.05, vA) * pow(max(0.0, 1.0 - vA), 1.8);\n      float hz = 0.45 + 0.9 * n3(vW * 1.7 + vec3(t * 0.05, t * 0.11, -t * 0.04)) * (0.6 + 0.4 * n3(vW * 0.45 - vec3(0.0, t * 0.03, 0.0)));\n      float I = k * e * along * hz / (0.25 + vA * len * 0.6);\n      gl_FragColor = vec4(col * I, 1.0); }"
  });
  function mover(x, y, z, hang, col, ang, light) {
    const base = new Mesh(new BoxGeometry(0.34, 0.11, 0.28), blackMetal);
    base.position.set(x, y + (hang ? 0 : 0.055), z);
    base.castShadow = true;
    scene.add(base);
    still(base);
    TVMERGE.push(base);
    const yoke = new Group();
    yoke.position.set(x, y + (hang ? -0.06 : 0.11), z);
    scene.add(yoke);
    if (tv) {
      yoke.lookAt(x, yoke.position.y, 0);
      still(yoke);
      const g = mergeGeometries([-1, 1].map((s) => new BoxGeometry(0.035, 0.24, 0.12).translate(s * 0.15, hang ? -0.12 : 0.12, 0)));
      const arms = new Mesh(g, blackMetal);
      yoke.add(arms);
      still(arms);
      TVMERGE.push(arms);
    } else for (const s of [-1, 1]) {
      const arm = new Mesh(new BoxGeometry(0.035, 0.24, 0.12), blackMetal);
      arm.position.set(s * 0.15, hang ? -0.12 : 0.12, 0);
      arm.castShadow = true;
      yoke.add(arm);
    }
    const pivot = V(x, y + (hang ? -0.24 : 0.29), z);
    const head = new Group();
    head.position.copy(pivot);
    scene.add(head);
    const shell = new Mesh(new CylinderGeometry(0.115, 0.13, 0.3, 28), blackMetal);
    shell.rotation.x = Math.PI / 2;
    shell.castShadow = true;
    head.add(shell);
    const bezel = new Mesh(new TorusGeometry(0.098, 0.012, 8, 32), alu);
    bezel.position.z = 0.152;
    if (!tv) head.add(bezel);
    const lens = new Mesh(new CircleGeometry(0.095, 32), new MeshBasicMaterial({ color: new Color(col).multiplyScalar(5) }));
    lens.position.z = 0.153;
    head.add(lens);
    const len = 9, beam = new Mesh(new CylinderGeometry(0.085, 0.085 + Math.tan(ang) * len, len, 48, 1, true), beamMat(col, len));
    beam.geometry.translate(0, -len / 2, 0);
    beam.geometry.rotateX(-Math.PI / 2);
    beam.position.z = 0.15;
    beam.renderOrder = 5;
    head.add(beam);
    let spot = null;
    if (light) {
      spot = new SpotLight(col, light, 14, ang * 1.15, 0.6, 1.4);
      spot.position.copy(pivot);
      scene.add(spot, spot.target);
    }
    return { yoke, head, lens, beam, spot, col, pivot, aim: V(0, 0, 0) };
  }
  const MOVERS = [
    { x: -1.75, col: 11453695, ph: 0, light: 26 },
    { x: -0.6, col: 16761474, ph: 1.3, light: 30 },
    { x: 0.6, col: 16761474, ph: 2.1, light: 30 },
    { x: 1.75, col: 11453695, ph: 3.4, light: 26 }
    // warm and cool white, like a real rig
  ].map((m) => Object.assign(mover(m.x, TY - TS / 2 - 0.02, TZ, true, m.col, 0.075, m.light), m));
  const UPS = [{ x: -2.15, col: 4875007, ph: 0.6 }, { x: 2.15, col: 4875007, ph: 2.8 }].map((m) => Object.assign(mover(m.x, STAGE_TOP, -2.25, false, m.col, 0.05, 0), m, { up: true }));
  const follow = new SpotLight(16773340, +((_j = Q.get("follow")) != null ? _j : 650), 45, 0.08, 0.32, 1.2);
  follow.position.set(0.8, 7.2, 15.5);
  follow.target.position.set(0, 0.9, 0);
  follow.castShadow = true;
  follow.shadow.mapSize.set(2048, 2048);
  follow.shadow.bias = -15e-5;
  follow.shadow.normalBias = 0.015;
  follow.shadow.radius = 3;
  follow.shadow.camera.near = 10;
  follow.shadow.camera.far = 24;
  scene.add(follow, follow.target);
  const foh = new SpotLight(16767408, +((_k = Q.get("foh")) != null ? _k : 5), 20, 0.5, 0.9, 1.5);
  foh.position.set(-2.2, 3.4, 7);
  foh.target.position.set(0, 1, 0);
  scene.add(foh, foh.target);
  const rim = new SpotLight(11059455, +((_l = Q.get("rim")) != null ? _l : 40), 14, 0.42, 0.7, 1.4);
  rim.position.set(0.9, 3.6, -3.4);
  rim.target.position.set(0, 1.2, 0);
  scene.add(rim, rim.target);
  const haze = [];
  const maple = pbr("oak_veneer_01", { repeat: [0.5, 0.9], physical: true, clearcoat: 0.3, roughness: 0.62, envMapIntensity: 0.45, color: 16767408, normalScale: 1.2 });
  maple.clearcoatRoughness = 0.28;
  const jointWood = pbr("oak_veneer_01", { repeat: [0.35, 0.35], physical: true, clearcoat: 0.5, roughness: 0.5, envMapIntensity: 0.45, color: 10116146 });
  jointWood.clearcoatRoughness = 0.2;
  const dancer = new Group();
  scene.add(dancer);
  const mk = (geo, mat) => {
    const m = new Mesh(geo, mat);
    m.castShadow = true;
    m.receiveShadow = true;
    dancer.add(m);
    return m;
  };
  const UP = V(0, 1, 0), tmp = new Vector3();
  const LIMB = { armL: maple.clone(), armR: maple.clone(), legL: maple.clone(), legR: maple.clone(), core: maple.clone() };
  function seg(rTop, rBot, mat = maple) {
    const g = new CylinderGeometry(rBot, rTop, 1, 32, 1);
    g.translate(0, 0.5, 0);
    return mk(g, mat);
  }
  function place(m, a, b) {
    tmp.subVectors(b, a);
    const l = tmp.length();
    m.position.copy(a);
    m.scale.set(1, Math.max(1e-3, l), 1);
    m.quaternion.setFromUnitVectors(UP, tmp.normalize());
  }
  const BALLS = [], ballIM = tv ? new InstancedMesh(new SphereGeometry(1, 32, 20), jointWood, 14) : null;
  if (ballIM) {
    ballIM.frustumCulled = false;
    ballIM.instanceMatrix.setUsage(DynamicDrawUsage);
    dancer.add(ballIM);
  }
  const ball = (r) => {
    if (!ballIM) return mk(new SphereGeometry(r, 32, 20), jointWood);
    const o = new Object3D();
    o.userData.r = r;
    BALLS.push(o);
    return o;
  };
  const egg = (sx, sy, sz, mat = maple) => {
    const m = mk(new SphereGeometry(1, 48, 32), mat);
    m.scale.set(sx, sy, sz);
    return m;
  };
  const P = {
    pelvis: egg(0.15, 0.1, 0.1, LIMB.core),
    chest: egg(0.18, 0.2, 0.11, LIMB.core),
    head: egg(0.095, 0.12, 0.105),
    abdomen: seg(0.12, 0.1, LIMB.core),
    neck: seg(0.04, 0.045),
    uaL: seg(0.042, 0.05, LIMB.armL),
    uaR: seg(0.042, 0.05, LIMB.armR),
    faL: seg(0.03, 0.038, LIMB.armL),
    faR: seg(0.03, 0.038, LIMB.armR),
    handL: egg(0.04, 0.085, 0.022, LIMB.armL),
    handR: egg(0.04, 0.085, 0.022, LIMB.armR),
    thL: seg(0.06, 0.078, LIMB.legL),
    thR: seg(0.06, 0.078, LIMB.legR),
    shL: seg(0.042, 0.058, LIMB.legL),
    shR: seg(0.042, 0.058, LIMB.legR),
    ftL: egg(0.045, 0.035, 0.11, LIMB.legL),
    ftR: egg(0.045, 0.035, 0.11, LIMB.legR),
    jSL: ball(0.055),
    jSR: ball(0.055),
    jEL: ball(0.04),
    jER: ball(0.04),
    jWL: ball(0.03),
    jWR: ball(0.03),
    jHL: ball(0.084),
    jHR: ball(0.084),
    jKL: ball(0.058),
    jKR: ball(0.058),
    jAL: ball(0.042),
    jAR: ball(0.042),
    jN: ball(0.045),
    jWaist: ball(0.095)
  };
  function ik(root, target, l1, l2, pole) {
    const d = tmp.subVectors(target, root), dist = Math.min(Math.max(d.length(), 0.05), l1 + l2 - 1e-3), dir = d.clone().normalize();
    const a = (l1 * l1 + dist * dist - l2 * l2) / (2 * dist), h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
    const perp = pole.clone().sub(dir.clone().multiplyScalar(pole.dot(dir))).normalize();
    return { mid: root.clone().add(dir.clone().multiplyScalar(a)).add(perp.multiplyScalar(h)), end: root.clone().add(dir.multiplyScalar(dist)) };
  }
  const contact = new Mesh(new PlaneGeometry(1.3, 1), new MeshBasicMaterial({
    transparent: true,
    depthWrite: false,
    opacity: 0.75,
    color: 0,
    alphaMap: (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 128;
      const g = c.getContext("2d"), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, "#fff");
      gr.addColorStop(0.35, "#999");
      gr.addColorStop(1, "#000");
      g.fillStyle = gr;
      g.fillRect(0, 0, 128, 128);
      return new CanvasTexture(c);
    })()
  }));
  contact.rotation.x = -Math.PI / 2;
  contact.position.set(0, STAGE_TOP + 3e-3, 0.05);
  contact.renderOrder = 1;
  scene.add(contact);
  const cur = { hl: V(-0.3, 0.95, 0.15), hr: V(0.3, 0.95, 0.15), fl: V(-0.15, 0.2, 0.02), fr: V(0.15, 0.2, 0.02), crouch: 0, hop: 0, bend: 0, lean: 0, tip: 0, pelX: 0, wide: 0 };
  const projCam = camera.clone();
  projCam.position.set(0, 1.42, 4.3);
  projCam.lookAt(LOOK);
  const handFromZone = (z) => {
    projCam.aspect = innerWidth / innerHeight;
    projCam.updateProjectionMatrix();
    projCam.updateMatrixWorld();
    const pz = 0.14 + (z[1] > 0.55 ? 0.08 : 0), p = V(z[0] * 2 - 1, 1 - z[1] * 2, 0.5).unproject(projCam), d = p.sub(projCam.position).normalize();
    return projCam.position.clone().addScaledVector(d, (pz - projCam.position.z) / d.z);
  };
  function picTarget(p, tt) {
    const arms = {};
    for (const s of ["l", "r"]) {
      const a = p.arms && p.arms[s];
      arms[s] = a ? { a: a.a, bent: a.ext === false } : { a: -80 };
    }
    if (p.toes) for (const [h, f] of p.toes) arms[h] = { toe: f };
    const hop = p.jump ? Math.max(0, Math.sin(Math.min(1, Math.max(0, 1 - Math.abs(tt) / 0.35)) * Math.PI / 2)) * 0.3 : 0;
    return {
      arms,
      crouch: p.squat ? 0.9 : p.lunge ? 0.45 : 0,
      hop,
      bend: p.toes ? 1 : 0,
      lean: p.lean === "l" ? 1 : p.lean === "r" ? -1 : 0,
      tip: p.tip ? 1 : 0,
      pelX: p.lunge === "l" ? -0.2 : p.lunge === "r" ? 0.2 : 0,
      wide: p.wide ? 1 : 0,
      knee: p.knee,
      legOut: p.legOut,
      lunge: p.lunge
    };
  }
  function solveDancer(t, beatF, tgt) {
    const k = 1 - Math.exp(-dtG * 9);
    for (const f of ["crouch", "bend", "lean", "tip", "pelX", "wide"]) cur[f] += ((tgt[f] || 0) - cur[f]) * k;
    cur.hop += (tgt.hop - cur.hop) * Math.min(1, dtG * 14);
    const bob = 0.025 * Math.cos(beatF * Math.PI * 2) + 0.012, still2 = 1 - Math.min(1, cur.bend + Math.abs(cur.lean)), sway = 0.035 * Math.sin(t * Math.PI * 2 / (60 / 110) / 2) * still2;
    const pel = V(sway + cur.pelX, STAGE_TOP + 0.98 - cur.crouch * 0.36 - bob * (1 - cur.crouch) * still2 + cur.hop + cur.tip * 0.07 + cur.bend * 0.02, 0.02 + cur.crouch * 0.05 - cur.bend * 0.14);
    const th = cur.bend * 1.25 + cur.crouch * 0.25, td = V(-0.55 * cur.lean, Math.cos(th), Math.sin(th)).normalize();
    const chest = pel.clone().addScaledVector(td, 0.42).add(V(-sway * 0.4, 0, 0.04 * (1 - cur.bend)));
    const ax = V(td.y, -td.x, 0).normalize();
    const sL = chest.clone().addScaledVector(td, 0.1).addScaledVector(ax, -0.19), sR = chest.clone().addScaledVector(td, 0.1).addScaledVector(ax, 0.19);
    const neck = chest.clone().addScaledVector(td, 0.18), head = neck.clone().addScaledVector(td, 0.14).add(V(0, 0, 0.01));
    const hipL = pel.clone().add(V(-0.1, -0.04, 0)), hipR = pel.clone().add(V(0.1, -0.04, 0));
    const tuck = cur.hop * 1.4, fy = STAGE_TOP + 0.08 + cur.hop * 0.6 + cur.tip * 0.07;
    const want = {};
    for (const [s, g, hip] of [["l", -1, hipL], ["r", 1, hipR]]) {
      let f = V(g * (0.15 + cur.crouch * 0.1 + cur.wide * 0.25), fy, 0.02 + tuck * 0.2);
      if (tgt.lunge) f = V(tgt.lunge === s ? g * 0.62 : g * 0.3, fy, 0.02);
      if (tgt.knee === s) f = V(g * 0.13, STAGE_TOP + 0.5, 0.45);
      if (tgt.legOut === s) f = hip.clone().add(V(g * 0.49, -0.7, 0.05));
      want[s] = f;
    }
    cur.fl.lerp(want.l, k);
    cur.fr.lerp(want.r, k);
    const handAt = (s, sh) => {
      if (tgt.hl && tgt.hr) return s === "l" ? tgt.hl : tgt.hr;
      const a = tgt.arms && tgt.arms[s];
      if (!a) return sh.clone().add(V(0, -0.55, 0.05));
      if (a.toe) return (a.toe === "l" ? cur.fl : cur.fr).clone().add(V(0, 0.12, 0.12));
      const r = a.a * Math.PI / 180, g = s === "l" ? -1 : 1;
      return sh.clone().add(V(g * Math.cos(r), Math.sin(r), 0.1).normalize().multiplyScalar(a.bent ? 0.4 : 0.57));
    };
    cur.hl.lerp(handAt("l", sL), k);
    cur.hr.lerp(handAt("r", sR), k);
    const aL = ik(sL, cur.hl, 0.3, 0.27, V(-0.6, -1, -0.5)), aR = ik(sR, cur.hr, 0.3, 0.27, V(0.6, -1, -0.5));
    const fL = cur.fl, fR = cur.fr;
    const lL = ik(hipL, fL, 0.45, 0.44, V(-0.15, 0, 1)), lR = ik(hipR, fR, 0.45, 0.44, V(0.15, 0, 1));
    contact.position.x = pel.x;
    contact.scale.setScalar(1 - Math.min(0.45, cur.hop * 1.5) + cur.crouch * 0.15 + cur.wide * 0.3);
    contact.material.opacity = 0.7 * (1 - Math.min(0.6, cur.hop * 2));
    P.pelvis.position.copy(pel);
    P.chest.position.copy(chest).addScaledVector(td, 0.04);
    P.head.position.copy(head);
    P.chest.quaternion.setFromUnitVectors(UP, td);
    P.head.quaternion.setFromUnitVectors(UP, td);
    P.pelvis.rotation.set(0, 0, sway * 0.6);
    P.jWaist.position.copy(pel).lerp(chest, 0.42);
    place(P.abdomen, pel, chest.clone().addScaledVector(td, -0.1));
    place(P.neck, chest.clone().addScaledVector(td, 0.12), neck.clone().addScaledVector(td, 0.06));
    P.jN.position.copy(neck);
    for (const [s, a, sh, ua, fa, hand, jS, jE, jW] of [["L", aL, sL, P.uaL, P.faL, P.handL, P.jSL, P.jEL, P.jWL], ["R", aR, sR, P.uaR, P.faR, P.handR, P.jSR, P.jER, P.jWR]]) {
      place(ua, sh, a.mid);
      place(fa, a.mid, a.end);
      jS.position.copy(sh);
      jE.position.copy(a.mid);
      jW.position.copy(a.end);
      const dir = a.end.clone().sub(a.mid).normalize();
      hand.position.copy(a.end).add(dir.clone().multiplyScalar(0.085));
      hand.quaternion.setFromUnitVectors(UP, dir);
    }
    for (const [l, hip, foot, th2, shn, ft, jH, jK, jA] of [[lL, hipL, fL, P.thL, P.shL, P.ftL, P.jHL, P.jKL, P.jAL], [lR, hipR, fR, P.thR, P.shR, P.ftR, P.jHR, P.jKR, P.jAR]]) {
      place(th2, l.mid, hip);
      place(shn, l.end, l.mid);
      jH.position.copy(hip);
      jK.position.copy(l.mid);
      jA.position.copy(l.end);
      ft.position.copy(l.end).add(V(0, -0.04, 0.07));
      ft.rotation.set(cur.hop * 0.6 + cur.tip * 0.7, 0, 0);
    }
  }
  const CN = 900, confGeo = new PlaneGeometry(0.05, 0.07), foilA = new Float32Array(CN);
  for (let i = 0; i < CN; i++) foilA[i] = i % 5 === 0 ? 1 : 0;
  confGeo.setAttribute("aFoil", new InstancedBufferAttribute(foilA, 1));
  const confMat = new MeshStandardMaterial({ side: DoubleSide, roughness: 0.7, metalness: 0, envMapIntensity: 3 });
  confMat.onBeforeCompile = (sh) => {
    sh.vertexShader = "attribute float aFoil;\nvarying float vFoil;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\nvFoil = aFoil;");
    sh.fragmentShader = "varying float vFoil;\n" + sh.fragmentShader.replace("#include <color_fragment>", "#include <color_fragment>\nif (!gl_FrontFacing && vFoil < 0.5) diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.92, 0.9, 0.86), 0.55);").replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 0.24, vFoil);").replace("#include <metalnessmap_fragment>", "#include <metalnessmap_fragment>\nmetalnessFactor = mix(metalnessFactor, 1.0, vFoil);").replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\ntotalEmissiveRadiance += diffuseColor.rgb * 0.22 * (1.0 - vFoil);");
  };
  const conf = new InstancedMesh(confGeo, confMat, CN);
  conf.instanceMatrix.setUsage(DynamicDrawUsage);
  conf.frustumCulled = false;
  conf.castShadow = false;
  scene.add(conf);
  const CP = Array.from({ length: CN }, (_, i) => ({ live: false, p: V(0, -10, 0), v: V(0, 0, 0), q: new Quaternion(), ax: V(1, 0, 0), w: 0, ph: Math.random() * 6.28, fl: 0.6 + Math.random() * 0.8, s: 0.8 + Math.random() * 0.45 }));
  const CCOL = [15217247, 15909424, 3123424, 5032298, 16052714, 10117856, 15759914], FOIL = [14211292, 14727258, 14191272];
  for (let i = 0; i < CN; i++) conf.setColorAt(i, new Color(foilA[i] ? FOIL[i % 3] : CCOL[i % CCOL.length]));
  let ci = 0, confAny = true;
  const M4 = new Matrix4(), Qn = new Quaternion(), S1 = V(1, 1, 1), HID = new Matrix4().makeScale(0, 0, 0);
  function confetti(n = 80, rain = false) {
    confAny = true;
    for (let k = 0; k < n; k++) {
      const c = CP[ci++ % CN];
      c.live = true;
      c.landed = 0;
      if (rain) {
        c.p.set((Math.random() - 0.5) * 6.5, 3 + Math.random() * 1.5, -1.6 + Math.random() * 3.2);
        c.v.set((Math.random() - 0.5) * 0.3, -0.2 - Math.random() * 0.4, (Math.random() - 0.5) * 0.3);
      } else {
        const s = k % 2 ? 1 : -1;
        c.p.set(s * 1.7 + (Math.random() - 0.5) * 0.1, STAGE_TOP + 0.3, 0.9 + (Math.random() - 0.5) * 0.1);
        c.v.set(-s * (0.3 + Math.random() * 0.9), 5.6 + Math.random() * 2.4, -0.9 - Math.random() * 1);
      }
      c.ax.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      c.w = (6 + Math.random() * 10) * (Math.random() < 0.5 ? -1 : 1);
      c.q.setFromEuler(new Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6));
    }
  }
  let strobe = 0, beamBoost = 0;
  window.__stageFX = {
    perfect() {
      flash(16774376, 0.1);
      shake(0.35);
      strobe = 1;
      confetti(90);
    },
    great() {
      shake(0.15);
      beamBoost = 0.6;
      confetti(24);
    },
    miss() {
      shake(0.1);
    },
    snap() {
      flash(16777215, 0.22);
      strobe = 0.4;
    },
    cheer() {
      confetti(300, true);
      strobe = 1;
      beamBoost = 1;
    },
    confetti(n, rain) {
      confetti(Math.min(320, n), rain);
    }
  };
  let dtG = 1 / 60, last = 0;
  const TITLE_MOVES = ["star", "kneeL", "reach", "legR", "toes", "wide", "kneeR", "squat"];
  const GREEN = new Color(2883442), AMBER = new Color(16752682), glowK = {};
  function loop(now) {
    var _a2, _b2;
    dtG = Math.min(0.05, (now - (last || now)) / 1e3) || 1 / 60;
    last = now;
    const t = now / 1e3;
    const D = window.__dance || { state: "title", beatF: t / (60 / 110) % 1 }, beatF = (_a2 = D.beatF) != null ? _a2 : 0, MV = window.__moves || {};
    let tgt;
    const groove = () => {
      const ph = Math.sin(t * Math.PI * 2 / (60 / 110) / 2);
      return { hl: V(-0.32 - 0.05 * ph, STAGE_TOP + 1.05 + 0.18 * Math.max(0, ph), 0.25), hr: V(0.32 - 0.05 * ph, STAGE_TOP + 1.05 + 0.18 * Math.max(0, -ph), 0.25), crouch: 0.08 + 0.06 * Math.abs(ph), hop: 0 };
    };
    if (D.state === "play" && D.next && D.next.tt < 60 / 110 * 3.2) {
      const n = D.next;
      if (n.free) {
        const c = Math.abs(Math.sin(t * Math.PI * 2 / (60 / 110)));
        tgt = { hl: V(-0.08 - 0.12 * c, STAGE_TOP + 1.95, 0.15), hr: V(0.08 + 0.12 * c, STAGE_TOP + 1.95, 0.15), crouch: 0, hop: 0 };
      } else if (n.pic && (n.pic.arms || n.pic.toes)) tgt = picTarget(n.pic, n.tt);
      else tgt = { hl: handFromZone(n.z[0]), hr: handFromZone(n.z[1]), crouch: n.crouch ? 0.9 : 0, hop: n.jump ? Math.max(0, Math.sin(Math.min(1, Math.max(0, 1 - Math.abs(n.tt) / 0.35)) * Math.PI / 2)) * 0.3 : 0 };
    } else if (D.state === "title") {
      const m = MV[TITLE_MOVES[Math.floor(t / (60 / 110 * 4)) % TITLE_MOVES.length]];
      tgt = m ? picTarget(m, 9) : groove();
    } else if (D.state === "end") tgt = { hl: V(-0.35, STAGE_TOP + 2, 0.1), hr: V(0.35, STAGE_TOP + 2, 0.1), crouch: 0, hop: 0.05 * Math.abs(Math.sin(t * 5.76)) };
    else tgt = groove();
    {
      const M = D.state === "play" && D.next && D.next.match;
      for (const [key, mat] of Object.entries(LIMB)) {
        const on = M && M.active[key], q2 = on ? M[key] : 0, want = on ? q2 >= 0.85 ? 0.6 : 0.15 + 0.3 * (1 - q2) : 0;
        glowK[key] = (glowK[key] || 0) + (want - (glowK[key] || 0)) * Math.min(1, dtG * 10);
        mat.emissive.copy(on && q2 >= 0.85 ? GREEN : AMBER).multiplyScalar(glowK[key]);
      }
    }
    solveDancer(t, beatF, tgt);
    if (ballIM) {
      BALLS.forEach((o, i) => {
        const r = o.userData.r;
        S1.set(r, r, r);
        M4.compose(o.position, Qn.identity(), S1);
        ballIM.setMatrixAt(i, M4);
      });
      ballIM.instanceMatrix.needsUpdate = true;
    }
    const pulse = D.state === "play" ? Math.exp(-beatF * 5) : 0.3;
    strobe = Math.max(0, strobe - dtG * 3);
    beamBoost = Math.max(0, beamBoost - dtG * 2);
    beamU.t.value = t;
    ledU.t.value = t;
    ledU.pulse.value = pulse * 0.6 + strobe * 0.6;
    const wash = strobe > 0.5 ? 1 : 0, BK = BEAMK * (0.85 + 0.3 * pulse + beamBoost * 0.35 + strobe * 0.4);
    const aimAt = (m, x, y, z) => {
      m.aim.set(x, y, z);
      if (!tv) m.yoke.lookAt(x, m.yoke.position.y, z);
      m.head.lookAt(m.aim);
    };
    for (const m of MOVERS) {
      const k = Math.min(1, beamBoost + strobe * 0.6);
      aimAt(m, lerp(Math.sin(t * 0.37 + m.ph) * 2, 0, k * 0.7), STAGE_TOP, lerp(0.4 + Math.sin(t * 0.61 + m.ph * 1.7) * 1.4, 0.2, k * 0.7));
      m.spot.position.copy(m.pivot);
      m.spot.target.position.copy(m.aim);
      m.spot.intensity = m.light * (0.7 + 0.45 * pulse + beamBoost * 0.5) * (1 + strobe * 1.2);
      m.spot.color.setHex(wash ? 16777215 : m.col);
      m.beam.material.uniforms.k.value = 0.36 * BK;
      m.beam.material.uniforms.col.value.setHex(wash ? 16774378 : m.col);
      m.lens.material.color.setHex(wash ? 16777215 : m.col).multiplyScalar(4 + 3 * pulse);
    }
    for (const m of UPS) {
      aimAt(m, m.pivot.x + Math.sin(t * 0.29 + m.ph) * 4.5 + Math.sign(m.pivot.x) * 2, 9, -6 + Math.cos(t * 0.23 + m.ph) * 3);
      m.beam.material.uniforms.k.value = 0.26 * BK;
      m.beam.material.uniforms.col.value.setHex(wash ? 16774378 : m.col);
      m.lens.material.color.setHex(wash ? 16777215 : m.col).multiplyScalar(4 + 3 * pulse);
    }
    follow.target.position.set(cur.hl.x * 0.15 + cur.hr.x * 0.15, 0.9, 0.05);
    follow.intensity = +((_b2 = Q.get("follow")) != null ? _b2 : 650) * (1 + strobe * 0.25);
    let live = 0;
    if (confAny) for (let i = 0; i < CN; i++) {
      const c = CP[i];
      if (!c.live) {
        conf.setMatrixAt(i, HID);
        continue;
      }
      live++;
      const inside = Math.hypot(c.p.x, c.p.z) < SR, gy = inside ? STAGE_TOP + 2e-3 : STAGE_TOP - 0.618;
      if (!c.landed) {
        c.v.y -= 9.8 * dtG;
        c.v.multiplyScalar(Math.exp(-dtG * (c.v.length() > 1.5 ? 0.9 : 1.6)));
        c.v.y = Math.max(c.v.y, -0.55 * c.fl - 0.25);
        c.p.addScaledVector(c.v, dtG);
        const fl = Math.sin(t * 4.2 * c.fl + c.ph);
        c.p.x += fl * 0.18 * dtG;
        c.p.z += Math.cos(t * 3.1 * c.fl + c.ph) * 0.1 * dtG;
        Qn.setFromAxisAngle(c.ax, c.w * dtG);
        c.q.multiply(Qn);
        if (c.p.y < gy) {
          c.p.y = gy;
          c.landed = dtG;
          c.q.setFromEuler(new Euler(-Math.PI / 2, 0, c.ph));
        }
      } else if ((c.landed += dtG) > 7) {
        c.live = false;
        c.landed = 0;
      }
      S1.set(c.s, c.s, c.s);
      M4.compose(c.p, c.q, S1);
      conf.setMatrixAt(i, M4);
    }
    if (confAny) conf.instanceMatrix.needsUpdate = true;
    confAny = live > 0;
    conf.visible = confAny;
    camera.position.set(Math.sin(t * 0.13) * 0.18, 1.42 + Math.sin(t * 0.21) * 0.03, 4.3);
    camera.lookAt(LOOK);
    {
      const P2 = state().passes, bl = P2.bloom;
      if (bl) {
        bl.threshold = BLOOM_T;
        bl.strength = 0.3;
        bl.radius = 0.45;
      }
    }
    render(dtG);
    const q = state().quality;
    window.__stage = { ready: true, tier: q.tier, fps: Math.round(q.fps) };
    requestAnimationFrame(loop);
  }
  if (tv) mergeStill(TVMERGE);
  state().grace(6e3);
  await environment(scene, renderer, ENV, { background: true, exact: true, intensity: +((_m = Q.get("env")) != null ? _m : 0.22), rotation: ENV_ROT });
  const sky = scene.getObjectByName("photoSky");
  if (sky) {
    const SU = { uHouse: { value: HOUSE }, uContrast: { value: CONTRAST }, uSat: { value: SAT }, uTop: { value: TOP }, uVeilK: { value: VEIL }, uWB: { value: new Vector3(...WB) } };
    window.__sky = SU;
    const kitCompile = sky.material.onBeforeCompile;
    sky.material.onBeforeCompile = (sh, r) => {
      kitCompile && kitCompile(sh, r);
      Object.assign(sh.uniforms, SU);
      sh.fragmentShader = "uniform float uHouse, uContrast, uSat, uTop, uVeilK; uniform vec3 uWB;\n" + sh.fragmentShader.replace(
        "#include <opaque_fragment>",
        "{ vec3 c = max(outgoingLight, 0.0); float l = dot(c, vec3(0.2126, 0.7152, 0.0722));\n         float cy = max(0.0, min(c.g, c.b) - c.r); c -= vec3(0.0, 0.55, 0.45) * cy;            // the cyan haze: toward neutral\n         l = dot(c, vec3(0.2126, 0.7152, 0.0722)); c = mix(vec3(l), c, uSat);                  // less candy\n         c = max(c - vec3(0.55, 0.6, 0.9) * uVeilK, 0.0) / (1.0 - 0.6 * uVeilK);              // the photo's blue haze veil lifted off the blacks\n         c *= uWB;                                                                              // white balance: the blue cast out\n         c = pow(c, vec3(uContrast)) * uHouse;                                                  // house lights down, show contrast\n         c *= mix(1.0, uTop, smoothstep(0.56, 0.78, vMapUv.y));                                 // the ceiling falls off into the dark\n         outgoingLight = c; }\n#include <opaque_fragment>"
      );
    };
    sky.material.needsUpdate = true;
  }
  requestAnimationFrame(loop);
})().catch((e) => setTimeout(() => {
  throw e;
}));
