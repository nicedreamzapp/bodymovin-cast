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
  BackSide,
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  Euler,
  Float32BufferAttribute,
  FrontSide,
  Group,
  HemisphereLight,
  IcosahedronGeometry,
  InstancedMesh,
  LatheGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  Path,
  Plane,
  PlaneGeometry,
  Raycaster,
  RepeatWrapping,
  RingGeometry,
  ShadowMaterial,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  TextureLoader,
  TorusGeometry,
  Vector2,
  Vector3
} from "./chunk-4IYDSAYK.js";
import "./chunk-NWIHTO7D.js";

// bmpage:bmpage:moles.html#0
(async () => {
  var _a;
  const BodyMovin = window.BodyMovin;
  const GAME = "moles";
  const Q = new URLSearchParams(location.search);
  const ROUND = Math.max(10, +Q.get("secs") || +Q.get("round") || 75), MUTE = Q.has("mute"), TV = Q.has("tv");
  const rnd = (a, b) => a + Math.random() * (b - a), clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, k) => a + (b - a) * k;
  const TAU = Math.PI * 2;
  window.__game = { round: ROUND, ready: false };
  const ENV = "greenwich_park", ENV_ROT = +((_a = Q.get("rot")) != null ? _a : 4.312), EYE = 1.7;
  const { scene, camera, renderer } = setup(document.getElementById("c"), { fov: 50 });
  camera.far = 1200;
  camera.updateProjectionMatrix();
  camera.position.set(0, EYE, 0.4);
  camera.lookAt(0, 0, -2.9);
  camera.updateMatrixWorld();
  const hud = document.getElementById("hud"), ctx = hud.getContext("2d");
  let W = 0, H = 0, S = 1, DPR = 1;
  const FONT = '"SF Pro Rounded", ui-rounded, "Avenir Next", system-ui, -apple-system, sans-serif';
  const font = (w, px) => "".concat(w, " ").concat(px, "px ").concat(FONT);
  const ray = new Raycaster(), groundPlane = new Plane(new Vector3(0, 1, 0), 0), tmpV = new Vector3();
  function groundAt(fx, fy, out = new Vector3()) {
    ray.setFromCamera({ x: fx * 2 - 1, y: -(fy * 2 - 1) }, camera);
    if (!ray.ray.intersectPlane(groundPlane, out)) out.set(0, 0, -3);
    return out;
  }
  function toScreen(v) {
    tmpV.copy(v).project(camera);
    return { x: (tmpV.x + 1) / 2 * W, y: (1 - tmpV.y) / 2 * H };
  }
  const sunLight = sun(scene, { position: [7.2, 3.4, 1.6], target: [0, 0, -2.6], size: 4.5, intensity: 2.8, color: 16773336 });
  const shadowGround = new Mesh(new PlaneGeometry(30, 30), new ShadowMaterial({ opacity: 0.45, color: 791560 }));
  shadowGround.rotation.x = -Math.PI / 2;
  shadowGround.position.y = 2e-3;
  shadowGround.receiveShadow = true;
  scene.add(shadowGround);
  scene.add(new HemisphereLight(14215423, 4872746, 0.2));
  let soilMat, wallMat, metalMat, goldMat, leatherMat, mapleMat, furNoise, crownMat;
  const glossBlack = new MeshPhysicalMaterial({ color: 656902, roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.04 });
  const noseMat = new MeshPhysicalMaterial({ color: 14710924, roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.15, sheen: 0.4, sheenColor: new Color(16761040) });
  const toothMat = new MeshPhysicalMaterial({ color: 16774888, roughness: 0.25, clearcoat: 0.6 });
  const pawMat = new MeshPhysicalMaterial({ color: 14260880, roughness: 0.6, sheen: 0.6, sheenColor: new Color(16766668) });
  const clawMat = new MeshStandardMaterial({ color: 15260872, roughness: 0.4 });
  const whiskMat = new MeshStandardMaterial({ color: 1709072, roughness: 0.6 });
  const pitMat = new MeshBasicMaterial({ color: 328450 });
  const bandMat = new MeshStandardMaterial({ color: 14168106, roughness: 0.85 });
  const bunnyPinkMat = new MeshStandardMaterial({ color: 16727450, roughness: 0.45, emissive: 16719754, emissiveIntensity: 0.55 });
  const innerEarMat = new MeshPhysicalMaterial({ color: 15771832, roughness: 0.6, sheen: 0.5, sheenColor: new Color(16765148) });
  const gemMats = [13635626, 1073376, 1089616].map((c) => new MeshPhysicalMaterial({ color: c, roughness: 0.05, metalness: 0, transmission: 0.6, thickness: 0.5, ior: 1.8, clearcoat: 1 }));
  const occluderMat = new MeshBasicMaterial({ colorWrite: false });
  function makeFurNoise() {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d");
    g.fillStyle = "#000";
    g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 16e3; i++) {
      const v = 90 + Math.random() * 165;
      g.fillStyle = "rgb(".concat(v, ",").concat(v, ",").concat(v, ")");
      g.fillRect(Math.random() * 256, Math.random() * 256, 1.4, 1.4);
    }
    const t = new CanvasTexture(c);
    t.wrapS = t.wrapT = RepeatWrapping;
    t.repeat.set(14, 30);
    return t;
  }
  const FUR = {
    mole: { root: 3811872, tip: 9071186, belly: 12096890 },
    helmet: { root: 3811872, tip: 8808012, belly: 11570802 },
    squat: { root: 2763312, tip: 6973040, belly: 10130590 },
    king: { root: 4204570, tip: 10121296, belly: 13213820 },
    bunny: { root: 16053494, tip: 16777215, belly: 16777215 },
    gold: null
  };
  const furCache = {};
  function furSet(type) {
    if (furCache[type]) return furCache[type];
    const f = FUR[type], N = 8, len = type === "bunny" ? 0.11 : 0.09, set = { base: null, shells: [], belly: null };
    set.base = new MeshStandardMaterial({ color: f.root, roughness: 0.95 });
    if (type === "bunny") set.base.emissive = new Color(5921376);
    set.belly = new MeshPhysicalMaterial({ color: f.belly, roughness: 0.9, sheen: 1, sheenRoughness: 0.5, sheenColor: new Color(f.belly) });
    for (let i = 1; i <= N; i++) {
      const k = i / N, col = new Color(f.root).lerp(new Color(f.tip), Math.pow(k, 0.7));
      const m = new MeshStandardMaterial({ color: col, roughness: 0.92, alphaMap: furNoise, alphaTest: 0.2 + 0.62 * k, side: FrontSide });
      if (type === "bunny") {
        m.emissive = new Color(5921376);
      }
      const off = (len * k).toFixed(4);
      m.onBeforeCompile = (sh) => {
        sh.vertexShader = sh.vertexShader.replace("#include <begin_vertex>", "vec3 transformed = position + normal * ".concat(off, ";"));
      };
      m.customProgramCacheKey = () => "fur" + off;
      set.shells.push(m);
    }
    return furCache[type] = set;
  }
  const BODY_H = 2.3;
  const radAt = (y) => y < 1.3 ? 1 - 0.04 * (1.3 - y) : Math.sqrt(Math.max(0, 1 - Math.pow((y - 1.3) / 1, 2)));
  const bodyGeo = (() => {
    const pts = [];
    for (let i = 0; i <= 40; i++) {
      const y = -0.6 + (BODY_H + 0.6) * i / 40;
      pts.push(new Vector2(Math.max(1e-3, radAt(Math.min(y, BODY_H))), y));
    }
    return new LatheGeometry(pts.reverse(), 40);
  })();
  const sphereGeo = new SphereGeometry(1, 32, 20), cylGeo = new CylinderGeometry(1, 1, 1, 24), coneGeo = new ConeGeometry(1, 1, 10);
  const boxGeo = new BoxGeometry(1, 1, 1);
  const bandGeo = new CylinderGeometry(0.86, 0.9, 0.17, 40, 1, true);
  const surfZ = (x, y) => Math.sqrt(Math.max(0, radAt(y) ** 2 - x * x));
  function addMesh(parent, geo, mat, pos, scale, rot) {
    const m = new Mesh(geo, mat);
    m.position.set(...pos);
    if (scale) m.scale.set(...scale);
    if (rot) m.rotation.set(...rot);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  function buildCritter(type) {
    const g = new Group(), body = new Group();
    g.add(body);
    const parts = { eyes: [] };
    const gold = type === "gold";
    if (gold) addMesh(body, bodyGeo, goldMat, [0, 0, 0]);
    else {
      const fs = furSet(type);
      addMesh(body, bodyGeo, fs.base, [0, 0, 0]);
      for (const sm of fs.shells) {
        const s = new Mesh(bodyGeo, sm);
        s.castShadow = false;
        s.receiveShadow = true;
        body.add(s);
      }
      addMesh(body, sphereGeo, fs.belly, [0, 0.95, 0.62], [0.68, 0.85, 0.42]);
      addMesh(body, sphereGeo, fs.belly, [0, 1.52, 0.72], [0.42, 0.3, 0.32]);
    }
    const bunny = type === "bunny";
    for (const s of [-1, 1]) {
      const ex = s * 0.36, ey = 1.86, ez = surfZ(ex, ey) + 0.03;
      const e = addMesh(body, sphereGeo, glossBlack, [ex, ey, ez], [0.15, 0.17, 0.12]);
      parts.eyes.push(e);
    }
    addMesh(body, sphereGeo, gold ? goldMat : noseMat, [0, 1.6, surfZ(0, 1.6) + 0.12], bunny ? [0.09, 0.07, 0.07] : [0.16, 0.12, 0.13]);
    if (!bunny) for (const s of [-1, 1]) addMesh(body, boxGeo, gold ? goldMat : toothMat, [s * 0.055, 1.33, surfZ(0, 1.33) + 0.1], [0.1, 0.15, 0.05], [-0.15, 0, 0]);
    if (!gold) for (const s of [-1, 1]) for (const k of [-1, 0, 1]) {
      const w = addMesh(body, cylGeo, bunny ? clawMat : whiskMat, [s * 0.42, 1.52 + k * 0.05, surfZ(0, 1.52) + 0.02], [7e-3, 0.6, 7e-3], [0, 0, s * (Math.PI / 2 - 0.12 * k)]);
      w.castShadow = false;
    }
    const paws = new Group();
    body.add(paws);
    parts.paws = paws;
    if (!bunny) for (const s of [-1, 1]) {
      addMesh(paws, sphereGeo, gold ? goldMat : pawMat, [s * 0.62, 0.62, 0.86], [0.24, 0.13, 0.2]);
      for (const c of [-1, 0, 1]) addMesh(paws, coneGeo, gold ? goldMat : clawMat, [s * 0.62 + c * 0.08, 0.6, 1.04], [0.03, 0.1, 0.03], [Math.PI / 2, 0, 0]);
    }
    if (bunny) {
      const fs = furSet("bunny");
      for (const s of [-1, 1]) {
        const ear = new Group();
        ear.position.set(s * 0.32, 2.05, -0.05);
        ear.rotation.z = -s * 0.18;
        body.add(ear);
        addMesh(ear, sphereGeo, fs.base, [0, 0.75, 0], [0.24, 0.85, 0.12]);
        for (const sm of fs.shells.slice(0, 3)) {
          const e = new Mesh(sphereGeo, sm);
          e.position.set(0, 0.75, 0);
          e.scale.set(0.24, 0.85, 0.12);
          ear.add(e);
        }
        addMesh(ear, sphereGeo, bunnyPinkMat, [0, 0.72, 0.07], [0.13, 0.68, 0.06]);
        (parts.ears || (parts.ears = [])).push(ear);
      }
      const bow = new Group();
      bow.position.set(0, 2.2, 0.25);
      body.add(bow);
      for (const s of [-1, 1]) addMesh(bow, coneGeo, bunnyPinkMat, [s * 0.26, 0, 0], [0.24, 0.3, 0.16], [0, 0, s * Math.PI / 2]);
      addMesh(bow, sphereGeo, bunnyPinkMat, [0, 0, 0.02], [0.12, 0.12, 0.1]);
    }
    if (type === "helmet") parts.helmet = buildHelmet(body);
    if (type === "squat") {
      const b = addMesh(body, bandGeo, bandMat, [0, 1.93, 0], [1, 1, 1]);
      b.castShadow = false;
    }
    if (type === "king") buildCrown(body);
    return { g, body, parts };
  }
  function buildHelmet(parent) {
    const h = new Group();
    h.position.set(0, 1.3, 0);
    parent.add(h);
    addMesh(h, new SphereGeometry(1.1, 32, 16, 0, TAU, 0, Math.PI / 2), metalMat, [0, 0.02, 0]);
    addMesh(h, new TorusGeometry(1.12, 0.07, 10, 40), metalMat, [0, 0.05, 0], null, [Math.PI / 2, 0, 0]);
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * TAU;
      addMesh(h, sphereGeo, metalMat, [Math.cos(a) * 1, 0.45, Math.sin(a) * 1], [0.06, 0.06, 0.06]);
    }
    addMesh(h, cylGeo, new MeshStandardMaterial({ color: 15777824, roughness: 0.5 }), [0, 1.08, 0], [0.18, 0.12, 0.18]);
    return h;
  }
  function buildCrown(parent) {
    const geo = new CylinderGeometry(0.62, 0.66, 0.6, 30, 1, true);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) if (p.getY(i) > 0) {
      const a = Math.atan2(p.getZ(i), p.getX(i));
      p.setY(i, 0.3 + 0.28 * Math.max(0, Math.cos(a * 5)));
    }
    geo.computeVertexNormals();
    const c = addMesh(parent, geo, crownMat, [0, 2.32, 0]);
    c.material.side = DoubleSide;
    for (let i = 0; i < 5; i++) {
      const a = i / 5 * TAU;
      addMesh(parent, sphereGeo, gemMats[i % 3], [Math.cos(a) * 0.65, 2.3, Math.sin(a) * 0.65], [0.08, 0.08, 0.08]);
      addMesh(parent, sphereGeo, crownMat, [Math.cos(a) * 0.62, 2.88, Math.sin(a) * 0.62], [0.06, 0.06, 0.06]);
    }
  }
  const moundGeoCache = {};
  function moundGeo() {
    if (moundGeoCache.g) return moundGeoCache.g;
    const pts = [];
    const prof = [[0.97, -0.9], [0.97, -0.02], [1, 0.12], [1.08, 0.3], [1.22, 0.35], [1.4, 0.26], [1.56, 0.12], [1.68, 0.03], [1.78, -0.01]];
    for (const [r, y] of prof) pts.push(new Vector2(r, y));
    const g = new LatheGeometry(pts.reverse(), 48), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i), y = p.getY(i), a = Math.atan2(z, x), rr = Math.hypot(x, z);
      if (y > -0.01 && rr > 1.02) p.setY(i, y * (1 + 0.4 * Math.sin(a * 3 + 1) * Math.cos(a * 5) + 0.25 * Math.sin(a * 7 + rr * 9)) + 0.03 * Math.sin(a * 13) * (rr < 1.9 ? 1 : 0));
      p.setX(i, x * (1 + 0.05 * Math.sin(a * 5 + 2)));
      p.setZ(i, z * (1 + 0.05 * Math.sin(a * 5 + 2)));
    }
    g.computeVertexNormals();
    const uv = g.attributes.uv;
    for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) * 0.5, p.getZ(i) * 0.5 + p.getY(i) * 0.5);
    return moundGeoCache.g = g;
  }
  const pitGeo = new CylinderGeometry(1, 0.9, 1, 32, 1, true), clodGeo = new IcosahedronGeometry(1, 1);
  const bladeGeo = (() => {
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute([-0.04, 0, 0, 0.04, 0, 0, 0.012, 0.6, 0.02, -0.012, 0.6, 0.02, 0, 1, 0.06], 3));
    g.setIndex([0, 1, 2, 0, 2, 3, 3, 2, 4]);
    g.computeVertexNormals();
    return g;
  })();
  const bladeMat = new MeshStandardMaterial({ color: 16777215, roughness: 0.92, side: DoubleSide, envMapIntensity: 0.6 });
  let holes = [], occluder = null;
  function makeHoleMeshes(h) {
    const grp = new Group();
    grp.position.copy(h.pos);
    scene.add(grp);
    const m = new Mesh(moundGeo(), soilMat);
    m.scale.set(h.rm, h.rm, h.rm);
    m.castShadow = true;
    m.receiveShadow = true;
    m.rotation.y = Math.random() * TAU;
    grp.add(m);
    const pit = new Mesh(pitGeo, wallMat);
    pit.scale.set(h.rm * 0.98, h.rm * 2.6, h.rm * 0.98);
    pit.position.y = -h.rm * 1.3;
    pit.material.side = BackSide;
    pit.receiveShadow = true;
    grp.add(pit);
    const bot = new Mesh(new CircleGeometry(1, 24), pitMat);
    bot.rotation.x = -Math.PI / 2;
    bot.scale.setScalar(h.rm * 0.9);
    bot.position.y = -h.rm * 2.55;
    grp.add(bot);
    const tufts = new InstancedMesh(bladeGeo, bladeMat, 260);
    tufts.castShadow = true;
    tufts.receiveShadow = true;
    for (let i = 0; i < 260; i++) {
      const a = rnd(0, TAU), rr = h.rm * rnd(1.55, 2), hgt = h.rm * rnd(0.15, 0.42);
      dummy.position.set(Math.cos(a) * rr, 0, Math.sin(a) * rr);
      dummy.rotation.set(rnd(-0.3, 0.3), rnd(0, TAU), rnd(-0.35, 0.35));
      dummy.scale.set(h.rm * rnd(0.35, 0.6), hgt, 1);
      dummy.updateMatrix();
      tufts.setMatrixAt(i, dummy.matrix);
      tufts.setColorAt(i, new Color().setHSL(rnd(0.21, 0.27), rnd(0.45, 0.65), rnd(0.09, 0.2)));
    }
    grp.add(tufts);
    for (let i = 0; i < 7; i++) {
      const a = rnd(0, TAU), rr = h.rm * rnd(1.1, 1.5), c = new Mesh(clodGeo, soilMat);
      c.position.set(Math.cos(a) * rr, h.rm * rnd(0.15, 0.3), Math.sin(a) * rr);
      c.scale.set(h.rm * rnd(0.06, 0.13), h.rm * rnd(0.04, 0.08), h.rm * rnd(0.06, 0.13));
      c.rotation.set(rnd(0, 6), rnd(0, 6), 0);
      c.castShadow = c.receiveShadow = true;
      grp.add(c);
    }
    h.grp = grp;
    h.mound = m;
  }
  const ROWS_Y = [0.47, 0.67, 0.885], SQUAT_ROW = 2;
  const ROW_XS = {
    3: [[0.2, 0.5, 0.8], [0.25, 0.5, 0.75], [0.3, 0.5, 0.7]],
    4: [[0.16, 0.387, 0.613, 0.84], [0.21, 0.403, 0.597, 0.79], [0.27, 0.423, 0.577, 0.73]]
  };
  function layoutHoles(cols, animate) {
    for (const h of holes) {
      scene.remove(h.grp);
      if (h.bunnyRing) scene.remove(h.bunnyRing);
    }
    const old = holes;
    holes = [];
    for (let row = 0; row < 3; row++) for (let c = 0; c < cols; c++) {
      const xs = ROW_XS[cols][row];
      const pos = groundAt(xs[c], ROWS_Y[row]), d = pos.distanceTo(camera.position);
      const rm = 0.19 * Math.pow(d / 2.4, 0.6) * (cols === 3 ? 1 : 0.82);
      const prev = old.find((o) => o.row === row && o.col === c && o.cols === cols);
      const h = { pos, rm, row, col: c, cols, mole: null, grow: animate ? 0 : prev ? prev.grow : 1, glow: 0, hint: 0, pan: (xs[c] - 0.5) * 1.4, x: 0, y: 0, r: 0, top: 0 };
      makeHoleMeshes(h);
      holes.push(h);
    }
    moles.forEach((m) => {
      if (m.hole.row >= 0) m.hole = holes.find((h) => h.row === m.hole.row && h.col === m.hole.col) || m.hole;
    });
    buildOccluder();
  }
  function buildOccluder() {
    if (occluder) scene.remove(occluder);
    const shape = new Shape();
    shape.moveTo(-30, -30);
    shape.lineTo(30, -30);
    shape.lineTo(30, 30);
    shape.lineTo(-30, 30);
    shape.lineTo(-30, -30);
    const all = holes.slice();
    if (king) all.push(king.hole);
    for (const h of all) {
      const p = new Path();
      p.absarc(h.pos.x, -h.pos.z, h.rm * 0.98, 0, TAU, true);
      shape.holes.push(p);
    }
    occluder = new Mesh(new ShapeGeometry(shape, 24), occluderMat);
    occluder.rotation.x = -Math.PI / 2;
    occluder.position.y = 1e-3;
    occluder.renderOrder = -0.5;
    occluder.castShadow = true;
    scene.add(occluder);
  }
  function projectHoles() {
    const all = holes.slice();
    if (king) all.push(king.hole);
    for (const h of all) {
      const c = toScreen(h.pos), e = toScreen(tmpV.set(h.pos.x + h.rm, 0, h.pos.z).clone()), t = toScreen(new Vector3(h.pos.x, h.moleH || h.rm * 0.72 * BODY_H * 0.85, h.pos.z));
      h.x = c.x;
      h.y = c.y;
      h.r = Math.abs(e.x - c.x);
      h.top = t.y;
    }
  }
  let malletProto = null;
  function buildMallet() {
    const g = new Group(), L = 0.55;
    const handle = new Mesh(new CylinderGeometry(0.018, 0.024, L, 16), mapleMat);
    handle.position.x = -L / 2;
    handle.rotation.z = Math.PI / 2;
    g.add(handle);
    const head = new Mesh(new CylinderGeometry(0.075, 0.075, 0.2, 28), leatherMat);
    head.position.x = -L;
    g.add(head);
    for (const s of [-1, 1]) {
      const ring = new Mesh(new CylinderGeometry(0.078, 0.078, 0.025, 28), mapleMat);
      ring.position.set(-L, s * 0.085, 0);
      g.add(ring);
    }
    g.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    return g;
  }
  let mallets = [];
  function malletAt(pos, big, scale = 1) {
    const g = malletProto.clone();
    g.scale.setScalar(scale * (big ? 1.25 : 1.05));
    const side = pos.x < camera.position.x ? -1 : 1;
    g.position.copy(pos).add(new Vector3(side * 0.55 * scale, 0.05, 0.12));
    g.rotation.y = side > 0 ? 0 : Math.PI;
    scene.add(g);
    mallets.push({ g, t: 0, side, big });
  }
  function stepMallets(dt) {
    for (let i = mallets.length - 1; i >= 0; i--) {
      const m = mallets[i];
      m.t += dt;
      const k = m.t, sw = Math.min(1, k / 0.085);
      m.g.rotation.z = lerp(1.25, -0.02, 1 - Math.pow(1 - sw, 3)) * (m.g.rotation.y ? 1 : 1);
      if (k > 0.3) {
        const f = (k - 0.3) / 0.15;
        m.g.position.y += dt * 1.5;
        m.g.rotation.z += f * 0.4;
      }
      if (k > 0.45) {
        scene.remove(m.g);
        mallets.splice(i, 1);
      }
    }
  }
  const MAXD = 260;
  let dirtIM = null, grassIM = null;
  const dirt = [], grassBits = [];
  const dust = [], dustTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d");
    const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, "rgba(255,255,255,0.9)");
    r.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, 64, 64);
    return new CanvasTexture(c);
  })();
  const sparkTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d");
    const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, "rgba(255,255,240,1)");
    r.addColorStop(0.2, "rgba(255,220,120,0.8)");
    r.addColorStop(1, "rgba(255,200,80,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, 64, 64);
    return new CanvasTexture(c);
  })();
  const dummy = new Object3D();
  function burstDirt(pos, n, power = 1, rm = 0.15) {
    for (let i = 0; i < n; i++) {
      const a = rnd(0, TAU), sp = rnd(0.6, 1.6) * power;
      (i % 4 === 3 ? grassBits : dirt).push({ p: pos.clone().add(new Vector3(Math.cos(a) * rm, 0.04, Math.sin(a) * rm)), v: new Vector3(Math.cos(a) * sp * 0.7, rnd(1.2, 2.6) * power, Math.sin(a) * sp * 0.7), s: rnd(0.012, 0.03) * (power > 1 ? 1.3 : 1), r: new Euler(rnd(0, 6), rnd(0, 6), 0), life: rnd(0.9, 1.4) });
    }
    while (dirt.length > MAXD) dirt.shift();
    while (grassBits.length > 80) grassBits.shift();
  }
  function puff(pos, n, col = 13153434, size = 0.12, rise = 0.25) {
    for (let i = 0; i < n; i++) {
      const s = new Sprite(new SpriteMaterial({ map: dustTex, color: col, transparent: true, opacity: 0.55, depthWrite: false }));
      s.position.copy(pos).add(new Vector3(rnd(-1, 1) * size, rnd(0, 0.5) * size, rnd(-1, 1) * size));
      s.scale.setScalar(size);
      scene.add(s);
      dust.push({ s, v: new Vector3(rnd(-0.3, 0.3), rnd(0.1, 0.3) + rise, rnd(-0.3, 0.3)), life: 0, max: rnd(0.7, 1.1), grow: size * 2.5 });
    }
  }
  function sparkle(pos, n) {
    for (let i = 0; i < n; i++) {
      const s = new Sprite(new SpriteMaterial({ map: sparkTex, color: 16777215, transparent: true, blending: AdditiveBlending, depthWrite: false }));
      s.position.copy(pos);
      s.scale.setScalar(0.06);
      scene.add(s);
      const a = rnd(0, TAU), e = rnd(0.2, 1.2);
      dust.push({ s, v: new Vector3(Math.cos(a) * e, rnd(0.6, 1.8), Math.sin(a) * e), life: 0, max: rnd(0.5, 0.9), grow: 0, spark: true });
    }
  }
  function stepParticles(dt) {
    const gy = -9.8;
    for (const arr of [dirt, grassBits]) for (let i = arr.length - 1; i >= 0; i--) {
      const d = arr[i];
      d.life -= dt;
      d.v.y += gy * dt;
      d.p.addScaledVector(d.v, dt);
      d.r.x += dt * 8;
      d.r.y += dt * 6;
      if (d.p.y < 5e-3) {
        d.p.y = 5e-3;
        d.v.multiplyScalar(0.3);
        d.v.y = Math.abs(d.v.y) * 0.2;
      }
      if (d.life <= 0) arr.splice(i, 1);
    }
    for (const [im, arr, sx] of [[dirtIM, dirt, 1], [grassIM, grassBits, 0]]) {
      for (let i = 0; i < arr.length; i++) {
        const d = arr[i];
        dummy.position.copy(d.p);
        dummy.rotation.copy(d.r);
        const s = d.s * Math.min(1, d.life * 3);
        dummy.scale.set(s * (sx ? 1 : 0.35), s * (sx ? 0.8 : 2.2), s);
        dummy.updateMatrix();
        im.setMatrixAt(i, dummy.matrix);
      }
      im.count = arr.length;
      im.instanceMatrix.needsUpdate = true;
    }
    for (let i = dust.length - 1; i >= 0; i--) {
      const d = dust[i];
      d.life += dt;
      const k = d.life / d.max;
      d.s.position.addScaledVector(d.v, dt);
      if (d.spark) d.v.y -= 3 * dt;
      if (d.grow) d.s.scale.setScalar(d.s.scale.x + d.grow * dt);
      d.s.material.opacity = (d.spark ? 1 : 0.5) * (1 - k);
      if (k >= 1) {
        scene.remove(d.s);
        d.s.material.dispose();
        dust.splice(i, 1);
      }
    }
  }
  let ac = null, master = null, sfxBus = null, noiseBuf = null, audioErrors = 0;
  function audioInit() {
    if (ac) {
      if (ac.state === "suspended") ac.resume().catch(() => {
      });
      return;
    }
    try {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      master = ac.createGain();
      master.gain.value = MUTE ? 0 : 0.85;
      const comp = ac.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 4;
      master.connect(comp);
      comp.connect(ac.destination);
      sfxBus = ac.createGain();
      sfxBus.gain.value = 0.9;
      sfxBus.connect(master);
      noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      if (ac.state === "suspended") ac.resume().catch(() => {
      });
    } catch (e) {
      ac = null;
      audioErrors++;
    }
  }
  function tone(type, f0, f1, t, dur, amp, pan = 0, atk = 6e-3) {
    const o = ac.createOscillator(), g = ac.createGain(), p = ac.createStereoPanner();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(1e-4, t);
    g.gain.exponentialRampToValueAtTime(amp, t + atk);
    g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
    p.pan.value = clamp(pan, -1, 1);
    o.connect(g);
    g.connect(p);
    p.connect(sfxBus);
    o.start(t);
    o.stop(t + dur + 0.05);
  }
  function noiz(t, dur, type, freq, q, amp, pan = 0, atk = 3e-3) {
    const n = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), p = ac.createStereoPanner();
    n.buffer = noiseBuf;
    n.loop = true;
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    g.gain.setValueAtTime(1e-4, t);
    g.gain.exponentialRampToValueAtTime(amp, t + atk);
    g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
    p.pan.value = clamp(pan, -1, 1);
    n.connect(f);
    f.connect(g);
    g.connect(p);
    p.connect(sfxBus);
    n.start(t, Math.random() * 0.5);
    n.stop(t + dur + 0.05);
  }
  const sfx = (fn) => (...a) => {
    if (!ac) return;
    try {
      fn(ac.currentTime, ...a);
    } catch (e) {
      audioErrors++;
    }
  };
  const SFX = {
    pop: sfx((t, pan) => {
      noiz(t, 0.08, "lowpass", 900, 0.8, 0.25, pan);
      tone("sine", 240, 520, t, 0.08, 0.08, pan);
    }),
    bonk: sfx((t, pan, big) => {
      tone("sine", big ? 300 : 230, 60, t, big ? 0.35 : 0.24, big ? 0.5 : 0.36, pan, 0.012);
      noiz(t, 0.09, "bandpass", 700, 1, big ? 0.45 : 0.32, pan, 0.012);
      noiz(t, 0.25, "lowpass", 300, 0.7, 0.26, pan, 0.015);
      tone("square", 1200, 2e3, t + 0.07, 0.08, 0.05, pan);
      tone("sine", 2e3, 1300, t + 0.14, 0.09, 0.07, pan);
    }),
    gold: sfx((t, pan) => [1047, 1319, 1568, 2093, 2637].forEach((f, i) => tone("triangle", f, f, t + i * 0.05, 0.4, 0.12, pan))),
    clank: sfx((t, pan) => {
      [523, 1307, 2210, 3170, 4100].forEach((f, i) => tone("triangle", f, f * 0.995, t, 0.5 - i * 0.07, 0.07, pan));
      noiz(t, 0.1, "highpass", 3e3, 0.7, 0.3, pan);
    }),
    bunny: sfx((t, pan) => {
      tone("triangle", 620, 380, t, 0.22, 0.12, pan);
      tone("triangle", 480, 260, t + 0.2, 0.35, 0.12, pan);
    }),
    escape: sfx((t, pan) => {
      noiz(t, 0.12, "lowpass", 500, 0.8, 0.2, pan);
      tone("sine", 420, 200, t, 0.14, 0.05, pan);
    }),
    combo: sfx((t, n) => {
      const f = 660 * Math.pow(2, Math.min(12, n) / 12);
      tone("triangle", f, f, t, 0.12, 0.12);
      tone("triangle", f * 1.5, f * 1.5, t + 0.07, 0.18, 0.1);
    }),
    click: sfx((t) => tone("triangle", 880, 1320, t, 0.12, 0.15)),
    whistle: sfx((t) => {
      tone("sine", 1500, 2200, t, 0.18, 0.12);
      tone("sine", 2200, 1500, t + 0.2, 0.3, 0.12);
    }),
    quake: sfx((t) => {
      tone("sine", 80, 28, t, 1.3, 0.9);
      tone("triangle", 55, 25, t, 1.1, 0.5);
      noiz(t, 1.2, "lowpass", 200, 0.8, 1);
      noiz(t + 0.05, 0.6, "bandpass", 700, 1, 0.35);
    }),
    ready: sfx((t) => [784, 988, 1175, 1568].forEach((f, i) => tone("triangle", f, f, t + i * 0.07, 0.14, 0.09))),
    king: sfx((t) => {
      [[196, 0], [196, 0.18], [262, 0.36], [330, 0.6]].forEach(([f, d]) => {
        tone("sawtooth", f, f, t + d, 0.3, 0.06);
        tone("triangle", f / 2, f / 2, t + d, 0.35, 0.12);
      });
      noiz(t, 0.8, "lowpass", 250, 1, 0.6);
    }),
    smash: sfx((t) => {
      tone("sine", 200, 38, t, 0.6, 0.9);
      noiz(t, 0.35, "lowpass", 1e3, 0.8, 0.8);
      tone("square", 1300, 2300, t + 0.1, 0.12, 0.06);
    }),
    laugh: sfx((t) => {
      for (let i = 0; i < 4; i++) tone("triangle", 300 - i * 20, 220 - i * 20, t + i * 0.13, 0.1, 0.1);
    }),
    fanfare: sfx((t) => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => {
      tone("triangle", f, f, t + i * 0.12, i === 5 ? 0.6 : 0.14, 0.12);
    }))
  };
  const G = { state: "loading", score: 0, t: 0, combo: 0, bestCombo: 0, hits: 0, bonks: 0, misses: 0, bunnyHits: 0, golds: 0, squats: 0, cols: 3, assist: 0, spawnIn: 1, quake: 0, quakes: 0, kingsBeaten: 0, smashes: 0, kingsDone: 0, saved: false, focus: 0, best: 0, pulse: 0 };
  let moles = [], pops = [], banner = null, king = null;
  const punchAt = { left: -1e9, right: -1e9 };
  let clickHit = null, lastCrouchAt = -1e9;
  BodyMovin.on("punchL", () => punchAt.left = performance.now());
  BodyMovin.on("punchR", () => punchAt.right = performance.now());
  function resetRound() {
    for (const m of moles) scene.remove(m.obj.g);
    if (king) {
      scene.remove(king.obj.g);
      scene.remove(king.hole.grp);
    }
    Object.assign(G, { score: 0, t: 0, combo: 0, bestCombo: 0, hits: 0, bonks: 0, misses: 0, bunnyHits: 0, golds: 0, squats: 0, cols: 3, assist: 0, spawnIn: 0.8, quake: 0, quakes: 0, kingsBeaten: 0, smashes: 0, kingsDone: 0, saved: false, pendingExpand: false, squatIntro: false });
    king = null;
    moles = [];
    pops = [];
    layoutHoles(3, true);
  }
  function startRound(now) {
    audioInit();
    SFX.whistle();
    try {
      BodyMovin.music && BodyMovin.music(GAME);
      if (MUTE) BodyMovin.musicVolume(0);
    } catch (e) {
    }
    resetRound();
    G.state = "play";
    G.startAt = now;
    try {
      BodyMovin.howTo && BodyMovin.howTo.hide && BodyMovin.howTo.hide();
    } catch (e) {
    }
    BodyMovin.activity.activeSec = 0;
    BodyMovin.activity.kcal = 0;
    state().grace(2500);
    showBanner("GO!");
  }
  function endRound(now) {
    G.state = "end";
    G.endAt = now;
    G.focus = 0;
    SFX.fanfare();
    G.active = BodyMovin.activity.activeSec;
    G.kcal = BodyMovin.activity.kcal;
    G.prevBest = BodyMovin.best(GAME);
    if (!G.saved) {
      BodyMovin.saveSession({ game: GAME, score: G.score });
      if (BodyMovin.highScores) BodyMovin.highScores(GAME, G.score);
      G.saved = true;
    }
    G.best = BodyMovin.best(GAME);
    G.newBest = G.score > G.prevBest && G.score > 0;
    moles.forEach((m) => {
      if (m.phase !== "hit") m.phase = "fall";
    });
    if (king && king.phase !== "hit") king.phase = "fall";
  }
  function showBanner(text, sub, col = "#ffe08a") {
    banner = { text, sub, t: performance.now(), col };
  }
  function popText(x, y, text, col, size = 1) {
    pops.push({ x: clamp(x, S * 0.3, W - S * 0.3), y, text, col, size, t: 0 });
  }
  function pickType(hole) {
    const r = Math.random(), p = clamp(G.t / ROUND, 0, 1);
    if (hole.row === SQUAT_ROW && G.t > 9) {
      if (r < 0.16 && G.t > 14) return "bunny";
      if (r < 0.24) return "gold";
      return "squat";
    }
    if (G.t > 7 && r < 0.13) return "bunny";
    if (r < 0.22) return "gold";
    if (G.t > 15 && r < 0.38 + p * 0.06) return "helmet";
    return "mole";
  }
  function newMole(hole, type, now, up) {
    const obj = buildCritter(type);
    scene.add(obj.g);
    const m = { hole, type, born: now, up, phase: "rise", rise: 0, rv: 0, sq: 0, hp: type === "helmet" ? 2 : type === "king" ? 3 : 1, hitAt: 0, lastHit: 0, look: 0, rest: {}, noSquatWarn: 0, obj, hop: 0 };
    m.bodyR = hole.rm * 0.72 * (type === "king" ? 1 : 1);
    hole.moleH = m.bodyR * BODY_H * 0.82;
    syncMole(m, now);
    return m;
  }
  function spawn(now, attract) {
    const p = clamp(G.t / ROUND, 0, 1), a = G.assist;
    const maxUp = attract ? 2 : Math.max(1, Math.round(lerp(1.6, 4.2, p) - a * 1.5));
    const live = moles.filter((m2) => m2.phase !== "gone" && m2.type !== "bunny").length;
    if (live >= maxUp) return 0.15;
    const free = holes.filter((h) => !h.mole && h.grow > 0.9);
    if (!free.length) return 0.15;
    const hole = free[Math.floor(Math.random() * free.length)];
    const type = window.__forceType || (attract ? ["mole", "mole", "gold", "bunny", "helmet"][Math.floor(Math.random() * 5)] : pickType(hole));
    if (type === "squat" && !G.squatIntro) {
      G.squatIntro = true;
      showBanner("BONUS MOLES!", "squat for the front row", "#ffb15a");
    }
    let up = lerp(2, 1.05, p) * (1 + a * 0.8);
    if (type === "squat") up *= 1.55;
    if (type === "helmet") up *= 1.5;
    if (type === "gold") up *= 0.8;
    if (type === "bunny") up *= 1.1;
    if (attract) up = 2.2;
    const m = newMole(hole, type, now, up);
    m.attract = !!attract;
    hole.mole = m;
    moles.push(m);
    SFX.pop(hole.pan);
    burstDirt(hole.pos, 5, 0.5, hole.rm);
    return attract ? rnd(0.7, 1.3) : lerp(1, 0.42, p) * (1 + a * 0.7) * rnd(0.75, 1.25);
  }
  function headPos(m) {
    return new Vector3(m.hole.pos.x, m.obj.g.position.y + m.bodyR * 1.7, m.hole.pos.z + m.bodyR * 0.4);
  }
  function moleBox(m) {
    const h = m.hole, top = lerp(h.y, h.top, Math.max(0.5, Math.min(1, m.rise))) - H * 0.06, bot = h.row === SQUAT_ROW ? H : h.y + h.r * 0.6 + H * 0.03;
    const hw = Math.max(h.r * 1.45, W * 0.05);
    return { x: h.x - hw, y: top, w: hw * 2, h: bot - top };
  }
  const inBox = (b, x, y) => x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h;
  function crouching(now) {
    return BodyMovin.body.crouch > 0.4 || now - lastCrouchAt < 260;
  }
  function whack(m, now, big) {
    const h = m.hole, hp3 = headPos(m), sx = h.x, sy = lerp(h.y, h.top, 0.7);
    m.lastHit = now;
    if (m.type === "bunny") {
      m.phase = "hit";
      m.hitAt = now;
      m.sq = 0.4;
      G.combo = 0;
      G.bunnyHits++;
      G.score = Math.max(0, G.score - 100);
      SFX.bunny(h.pan);
      shake(0.3);
      popText(sx, sy, "OOPS, BUNNY!  -100", "#ffb8cc", 1);
      puff(hp3, 4, 16777215, 0.08);
      h.glow = -1;
      return;
    }
    if (m.type === "helmet" && m.hp > 1) {
      m.hp--;
      m.sq = 0.35;
      m.up += 0.5;
      SFX.clank(h.pan);
      shake(0.35);
      malletAt(hp3, false, h.rm / 0.16);
      const hm = m.obj.parts.helmet;
      if (hm) {
        const wp = new Vector3();
        hm.getWorldPosition(wp);
        m.obj.body.remove(hm);
        hm.position.copy(wp);
        hm.scale.setScalar(m.bodyR);
        scene.add(hm);
        m.flyHelmet = { o: hm, v: new Vector3((Math.random() < 0.5 ? -1 : 1) * 1.2, 3.2, 0.6), t: 0 };
      }
      popText(sx, sy, "CLANK! once more", "#e8f0ff", 0.85);
      sparkle(hp3, 6);
      return;
    }
    malletAt(hp3, big, h.rm / 0.16);
    m.phase = "hit";
    m.hitAt = now;
    m.sq = big ? 0.5 : 0.4;
    G.combo++;
    G.bestCombo = Math.max(G.bestCombo, G.combo);
    G.hits++;
    if (big) G.bonks++;
    if (m.type === "gold") G.golds++;
    if (m.type === "squat") G.squats++;
    const base = { mole: 100, gold: 300, helmet: 150, squat: 200 }[m.type] || 100;
    const mult = Math.min(3, 1 + Math.floor(G.combo / 5) * 0.5), pts = Math.round(base * (big ? 2 : 1) * mult * (m.type === "squat" && typeof crouching === "function" && crouching(now) ? 2 : 1));
    G.score += pts;
    G.assist = Math.max(0, G.assist - 0.07);
    if (G.quake < 1) {
      G.quake = Math.min(1, G.quake + 0.1);
      if (G.quake >= 1) {
        SFX.ready();
        showBanner("QUAKE READY!", "jump!", "#ffb15a");
        if (BodyMovin.recent("jump", 250)) setTimeout(() => quake(performance.now()), 0);
      }
    }
    SFX.bonk(h.pan, big);
    if (m.type === "gold") {
      SFX.gold(h.pan);
      sparkle(hp3, 18);
    }
    if (G.combo > 0 && G.combo % 5 === 0) {
      SFX.combo(G.combo / 5);
      showBanner("".concat(G.combo, " IN A ROW!"), "x".concat(mult, " points"), "#b8ffcc");
      G.pulse = 1;
    }
    burstDirt(h.pos, big ? 22 : 12, big ? 1.3 : 1, h.rm);
    puff(h.pos.clone().setY(0.05), big ? 5 : 3, 13153434, h.rm * 0.8);
    popText(sx, sy - H * 0.04, (big ? "BONK! " : "") + "+" + pts, m.type === "gold" ? "#ffe08a" : big ? "#ffc070" : "#ffffff", big ? 1.3 : 1);
    shake(big ? 0.55 : 0.25);
    if (big) flash(16774364, 0.12);
    h.glow = 1;
  }
  const raisedHand = (hd) => hd.raised !== false || BodyMovin.mouse || BodyMovin.simulating;
  function swingOf(hd, punched) {
    return punched || hd.vy > 0.45 || hd.speed > 1.25;
  }
  function checkHits(now) {
    var _a2;
    const bodyOn = BodyMovin.live;
    if (BodyMovin.body.crouch > 0.4) lastCrouchAt = now;
    const live = moles.filter((m) => (m.phase === "up" || m.phase === "rise" && m.rise > 0.35) && now - m.lastHit >= 380);
    const used = /* @__PURE__ */ new Set();
    for (const side of ["left", "right"]) {
      const hd = BodyMovin.hands[side];
      if (!hd.seen) {
        for (const m of live) m.rest[side] = 0;
        continue;
      }
      const punched = now - punchAt[side] < 300, swing = swingOf(hd, punched), up = raisedHand(hd);
      const x = hd.x * W, y = hd.y * H, ax = x + hd.vx * W * 0.12, ay = y + Math.max(0, hd.vy) * H * 0.12;
      let best = null, bd = 1e9;
      for (const m of live) {
        const box = moleBox(m), on = inBox(box, x, y), toward = swing && inBox(box, ax, ay);
        if (!on) m.rest[side] = 0;
        else if (up) (_a2 = m.rest)[side] || (_a2[side] = now);
        else m.rest[side] = 0;
        if (!on && !toward) continue;
        let ok;
        if (m.type === "bunny") ok = on && up && now - m.rest[side] >= 450;
        else ok = swing || on && up && m.rest[side] && now - m.rest[side] >= 300;
        if (!ok) continue;
        const d = Math.hypot(x - m.hole.x, (y - (box.y + box.h * 0.3)) * 0.7);
        if (d < bd) {
          bd = d;
          best = m;
        }
      }
      if (!best || used.has(best)) continue;
      used.add(best);
      const big = hd.vy > 1.25 || hd.speed > 2.3 || punched;
      whack(best, now, big);
    }
    if (clickHit) {
      for (const m of live) if (!used.has(m) && inBox(moleBox(m), clickHit.x, clickHit.y)) {
        whack(m, now, true);
        break;
      }
    }
    if (!king) clickHit = null;
  }
  let tipHud = [];
  function quake(now) {
    if (G.state !== "play" || G.quake < 1) return;
    G.quake = 0;
    G.quakes++;
    G.quakeFx = 1;
    SFX.quake();
    shake(1.6);
    flash(16773328, 0.18);
    showBanner("QUAKE!", null, "#ffb15a");
    let n = 0;
    for (const m of moles) {
      if (!(m.phase === "up" || m.phase === "rise")) continue;
      if (m.type === "bunny") {
        m.hop = 1;
        continue;
      }
      if (m.type === "helmet") m.hp = 1;
      whack(m, now, true);
      n++;
    }
    if (king) kingSmash(now, true);
    for (const h of holes) {
      h.glow = 1;
      h.bounce = 1;
      burstDirt(h.pos, 6, 0.9, h.rm);
      puff(h.pos.clone().setY(0.04), 2, 13153434, h.rm);
    }
    if (n) popText(W / 2, H * 0.45, "".concat(n, " MOLE").concat(n > 1 ? "S" : "", " QUAKED!"), "#ffe08a", 1.3);
  }
  BodyMovin.on("jump", () => quake(performance.now()));
  BodyMovin.on("starjump", () => quake(performance.now()));
  function spawnKing(now) {
    const pos = groundAt(0.5, 0.79), rm = 0.42;
    const hole = { pos, rm, row: -1, col: 1, cols: 0, grow: 0.01, pan: 0, x: 0, y: 0, r: 0, top: 0 };
    makeHoleMeshes(hole);
    hole.grp.scale.setScalar(0.01);
    for (const m of moles) if (m.phase === "rise" || m.phase === "up") {
      m.phase = "fall";
      m.noMiss = true;
    }
    king = newMole(hole, "king", now, 7.5);
    king.rearm = { left: true, right: true };
    king.bodyR = rm * 0.72;
    hole.moleH = king.bodyR * BODY_H * 0.95;
    buildOccluder();
    burstDirt(pos, 40, 1.6, rm);
    puff(pos.clone().setY(0.1), 8, 13153434, 0.3);
    SFX.king();
    showBanner("KING MOLE!", "use both hands", "#ffe08a");
    shake(0.9);
  }
  function kingBox() {
    const h = king.hole, hw = Math.max(h.r * 1.3, W * 0.14);
    return { x: h.x - hw, y: lerp(h.y, h.top, Math.max(0.5, king.rise)) - H * 0.07, w: hw * 2, h: H };
  }
  function kingSmash(now, byQuake) {
    const h = king.hole, hp3 = headPos(king), sx = h.x, sy = lerp(h.y, h.top, 0.6);
    king.hp--;
    king.lastHit = now;
    king.sq = 0.4;
    G.smashes++;
    king.up += 1.2;
    malletAt(hp3.clone().add(new Vector3(-0.18, 0, 0)), true, 2.2);
    malletAt(hp3.clone().add(new Vector3(0.18, 0, 0)), true, 2.2);
    SFX.smash();
    shake(1.2);
    flash(16773328, 0.2);
    burstDirt(h.pos, 30, 1.5, h.rm);
    if (king.hp <= 0) {
      king.phase = "hit";
      king.hitAt = now;
      G.kingsBeaten++;
      const pts = 1500;
      G.score += pts;
      G.combo += 3;
      G.bestCombo = Math.max(G.bestCombo, G.combo);
      SFX.gold(0);
      SFX.fanfare();
      showBanner("KING BONKED!", "+".concat(pts), "#b8ffcc");
      popText(sx, sy, "+".concat(pts), "#ffe08a", 1.6);
      sparkle(hp3, 30);
    } else {
      G.score += 300;
      popText(sx, sy, (byQuake ? "QUAKE! " : "SMASH! ") + "+300", "#ffffff", 1.4);
    }
  }
  function updateKing(now, dt) {
    if (!king) return;
    const k = king, age = (now - k.born) / 1e3, h = k.hole;
    h.grow = Math.min(1, h.grow + dt * 3);
    h.grp.scale.setScalar(h.grow);
    if (k.phase === "rise" && k.rise > 0.95) k.phase = "up";
    if ((k.phase === "up" || k.phase === "rise") && age > k.up) {
      k.phase = "fall";
      SFX.laugh();
      popText(W / 2, H * 0.45, "the King got away!", "#ffd8e0", 1);
    }
    if (G.state === "play" && (k.phase === "up" || k.phase === "rise" && k.rise > 0.5)) {
      const box = kingBox(), inside = (s) => {
        const hd = BodyMovin.hands[s];
        return hd.seen && inBox(box, hd.x * W, hd.y * H);
      };
      const L = inside("left"), Rr = inside("right"), hL = BodyMovin.hands.left, hR = BodyMovin.hands.right;
      if (!L || hL.vy < -0.3) k.rearm.left = true;
      if (!Rr || hR.vy < -0.3) k.rearm.right = true;
      const down = (hL.vy + hR.vy) / 2 > 0.35 || Math.max(hL.vy, hR.vy) > 0.7 || hL.speed + hR.speed > 2.2;
      const both = L && Rr && raisedHand(hL) && raisedHand(hR);
      k.both = both ? k.both || now : 0;
      if (L && Rr && (k.rearm.left || k.rearm.right) && (down || both && now - k.both > 350) && now - k.lastHit > 350) {
        k.rearm.left = k.rearm.right = false;
        k.both = 0;
        kingSmash(now);
      } else if ((L || Rr) && !(L && Rr) && now - (k.warnAt || 0) > 1500) {
        k.warnAt = now;
        popText(W / 2, box.y - H * 0.02, "BOTH HANDS!", "#ffe08a", 1.2);
      }
      if (clickHit && inBox(box, clickHit.x, clickHit.y)) {
        clickHit = null;
        if (now - k.lastHit > 150) kingSmash(now);
      }
    }
    stepRise(k, now, dt, 120, 13);
    if ((k.phase === "fall" || k.phase === "hit") && k.rise < 0.01 && now - (k.hitAt || 0) > 900 && Math.abs(k.rv) < 0.3 && age > 1) {
      scene.remove(k.obj.g);
      scene.remove(h.grp);
      king = null;
      buildOccluder();
      G.spawnIn = 0.6;
    }
  }
  function stepRise(m, now, dt, kSpring = 300, damp = 17) {
    let target = m.phase === "rise" || m.phase === "up" ? 1 : 0;
    if (m.phase === "hit") target = now - m.hitAt < (m.type === "king" ? 600 : 260) ? 0.8 : 0;
    m.rv += ((target - m.rise) * kSpring - m.rv * damp) * dt;
    m.rise += m.rv * dt;
    m.sq *= Math.exp(-dt * 6);
    syncMole(m, now);
  }
  function syncMole(m, now) {
    const h = m.hole, o = m.obj, R0 = m.bodyR || h.rm * 0.72, t = now / 1e3;
    const rise = clamp(m.rise, -0.2, 1.25), stretch = clamp(m.rv * 0.04, -0.18, 0.25);
    const sy = (1 + stretch) * (1 - m.sq), sx = (1 + m.sq * 0.7) * (1 - stretch * 0.4);
    const hidden = -R0 * BODY_H * 1.35, shown = -R0 * 0.55, hop = m.hop ? Math.abs(Math.sin(t * 14)) * m.hop * R0 * 1.2 : 0;
    o.g.position.set(h.pos.x, lerp(hidden, shown, rise) + hop, h.pos.z);
    o.g.scale.set(R0 * sx, R0 * sy, R0 * sx);
    o.g.visible = m.rise > 0.01 || m.rv > 0;
    const age = (now - m.born) / 1e3, tease = m.phase === "up" && m.type !== "bunny" && m.type !== "king" && age > m.up * 0.6 ? Math.sin(t * 22) * 0.12 : 0;
    o.g.rotation.set(0, m.look * 0.5, tease);
    const closed = m.phase === "hit" && m.type !== "bunny";
    for (const e of o.parts.eyes) e.scale.y = closed ? 0.025 : 0.17 * (Math.sin(t * 1.7 + h.col * 2 + h.row) > 0.985 ? 0.15 : 1);
    o.parts.paws.visible = rise > 0.7;
    if (o.parts.ears) o.parts.ears.forEach((e, i) => {
      e.rotation.x = Math.sin(t * 4 + i) * 0.08 - (m.phase === "hit" ? 0.5 : 0);
    });
    if (m.flyHelmet) {
      const f = m.flyHelmet;
      f.t += 1 / 60;
      f.v.y -= 9.8 / 60;
      f.o.position.addScaledVector(f.v, 1 / 60);
      f.o.rotation.x += 0.2;
      f.o.rotation.z += 0.15;
      if (f.o.position.y < 0) {
        f.o.position.y = 0;
        f.v.set(f.v.x * 0.5, Math.abs(f.v.y) * 0.3, f.v.z * 0.5);
      }
      if (f.t > 1.6) {
        scene.remove(f.o);
        m.flyHelmet = null;
      }
    }
  }
  function updateMoles(now, dt) {
    for (const m of moles) {
      const age = (now - m.born) / 1e3;
      if (m.phase === "rise" && m.rise > 0.95) m.phase = "up";
      if ((m.phase === "rise" || m.phase === "up") && age > m.up) {
        m.phase = "fall";
        if (m.type !== "bunny" && G.state === "play" && !m.noMiss && !m.attract) {
          G.combo = 0;
          G.misses++;
          G.assist = Math.min(1, G.assist + 0.12);
          SFX.escape(m.hole.pan);
        }
        if (m.type === "bunny" && G.state === "play" && !m.noMiss && !m.attract) {
          G.score += 25;
          popText(m.hole.x, m.hole.top - H * 0.03, "+25 bunny safe", "#ffd8e6", 0.75);
        }
      }
      const hands = ["left", "right"].filter((s) => BodyMovin.hands[s].seen).map((s) => BodyMovin.hands[s].x * W);
      const hx = hands.length ? hands.sort((a, b) => Math.abs(a - m.hole.x) - Math.abs(b - m.hole.x))[0] : m.hole.x;
      m.look += (clamp((hx - m.hole.x) / (W * 0.3), -1, 1) - m.look) * Math.min(1, dt * 6);
      if (m.hop) m.hop *= Math.exp(-dt * 3);
      stepRise(m, now, dt);
      if ((m.phase === "fall" || m.phase === "hit") && m.rise < 0.02 && Math.abs(m.rv) < 0.5 && (m.phase === "fall" || now - m.hitAt > 500)) {
        m.phase = "gone";
        if (m.hole.mole === m) m.hole.mole = null;
        scene.remove(m.obj.g);
        if (m.flyHelmet) scene.remove(m.flyHelmet.o);
      }
    }
    moles = moles.filter((m) => m.phase !== "gone");
  }
  function update(now, dt) {
    for (const h of holes) {
      h.grow = Math.min(1, h.grow + dt * 2.2);
      h.glow *= Math.exp(-dt * 3);
      h.hint *= Math.exp(-dt * 3);
      {
        const bm = h.mole && h.mole.type === "bunny" ? clamp(h.mole.rise, 0, 1) : 0;
        if (bm > 0 && !h.bunnyRing) {
          h.bunnyRing = new Mesh(new RingGeometry(1.05, 1.32, 48), new MeshBasicMaterial({ color: 16727450, transparent: true, opacity: 0, depthWrite: false, blending: AdditiveBlending, side: DoubleSide }));
          h.bunnyRing.rotation.x = -Math.PI / 2;
          h.bunnyRing.renderOrder = 5;
          scene.add(h.bunnyRing);
        }
        if (h.bunnyRing) {
          h.bunnyRing.position.set(h.pos.x, h.pos.y + h.rm * 0.32, h.pos.z);
          h.bunnyRing.scale.setScalar(h.rm * (1.05 + 0.05 * Math.sin(now / 160)));
          h.bunnyRing.material.opacity += ((bm > 0 ? 0.85 * bm : 0) - h.bunnyRing.material.opacity) * Math.min(1, dt * 10);
          h.bunnyRing.visible = h.bunnyRing.material.opacity > 0.01;
        }
      }
      h.bounce = (h.bounce || 0) * Math.exp(-dt * 4);
      const g = 1 - Math.pow(1 - h.grow, 3);
      h.grp.scale.set(g, g * (1 + 0.6 * h.bounce * Math.abs(Math.sin(now / 50))), g);
    }
    if (G.state === "title") {
      G.spawnIn -= dt;
      if (G.spawnIn <= 0) G.spawnIn = spawn(now, true);
    }
    if (G.state === "play") {
      G.t = (now - G.startAt) / 1e3;
      if (G.showcase) {
        G.t = 20;
      } else if (G.t >= ROUND) endRound(now);
      else {
        if (G.cols === 3 && G.t > ROUND * 0.4 && !G.showcase) G.pendingExpand = true;
        if (G.pendingExpand && !moles.length && !king) {
          G.pendingExpand = false;
          G.cols = 4;
          layoutHoles(4, true);
          showBanner("MORE HOLES!", "reach wide", "#cfe8ff");
          SFX.combo(6);
          state().grace(1500);
        }
        const kingDue = [0.3, 0.68].filter((f) => G.t > ROUND * f).length;
        if (!king && G.kingsDone < kingDue && !G.pendingExpand && !G.showcase) {
          G.kingsDone++;
          spawnKing(now);
        }
        if (!G.pendingExpand && !king && !G.showcase) {
          G.spawnIn -= dt;
          if (G.spawnIn <= 0) G.spawnIn = spawn(now);
        }
        if (ROUND - G.t < 15 && !G.final15) {
          G.final15 = true;
          showBanner("FINAL 15!", "faster!", "#ffb8cc");
        }
        checkHits(now);
      }
    }
    updateMoles(now, dt);
    updateKing(now, dt);
    stepMallets(dt);
    stepParticles(dt);
    for (let i = pops.length - 1; i >= 0; i--) {
      pops[i].t += dt;
      if (pops[i].t > 1.1) pops.splice(i, 1);
    }
    G.pulse *= Math.exp(-dt * 3);
  }
  function label(text, x, y, size, col = "#fff", weight = 800, align = "center") {
    ctx.save();
    ctx.font = font(weight, size);
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.55)";
    ctx.shadowBlur = size * 0.25;
    ctx.shadowOffsetY = size * 0.05;
    ctx.fillStyle = col;
    ctx.fillText(text, x, y);
    ctx.restore();
  }
  function outline(text, x, y, size, col, weight = 900, align = "center") {
    ctx.save();
    ctx.font = font(weight, size);
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    ctx.lineWidth = size * 0.14;
    ctx.strokeStyle = "rgba(30,18,6,0.75)";
    ctx.strokeText(text, x, y);
    ctx.shadowColor = "rgba(0,0,0,0.4)";
    ctx.shadowBlur = size * 0.2;
    ctx.fillStyle = col;
    ctx.fillText(text, x, y);
    ctx.restore();
  }
  function panel(x, y, w, h, r, a = 0.42) {
    ctx.save();
    ctx.fillStyle = "rgba(14,18,10,".concat(a, ")");
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,".concat(a * 0.35, ")");
    ctx.lineWidth = Math.max(1, S * 15e-4);
    ctx.stroke();
    ctx.restore();
  }
  function UI() {
    const vm = Math.min(innerWidth, innerHeight) / 100, d = DPR;
    const T = Math.max(10, 1.8 * vm), Hh = Math.max(36, 5.6 * vm), Wb = Math.max(108, 15 * vm), G2 = Math.max(8, 1.2 * vm);
    return { vm: vm * d, T: T * d, L: T * d, Hh: Hh * d, Wb: Wb * d, G: G2 * d, right: (T + 2 * Wb + 2 * G2 + Hh) * d, fs: Math.max(14, 1.9 * vm) * d };
  }
  function glass(x, y, w, h, r = h / 2) {
    ctx.save();
    ctx.fillStyle = "rgba(10,12,24,0.55)";
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = DPR;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  let hudBottom = 0;
  let buttons = [], mouseXY = null;
  function button(id, text, cx, cy, w, h, now, action, focused, ms = 700, small = false) {
    const rect = { x: cx - w / 2, y: cy - h / 2, w, h }, hand = BodyMovin.handOver(rect, W, H), over = hand || mouseXY && inBox(rect, mouseXY.x, mouseXY.y);
    const k = BodyMovin.dwell(id, hand, now, ms);
    buttons.push({ id, rect, action, fill: k });
    ctx.save();
    const path = new Path2D();
    path.roundRect(rect.x, rect.y, w, h, h / 2);
    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.shadowBlur = S * 0.03;
    ctx.shadowOffsetY = S * 6e-3;
    if (small) {
      ctx.fillStyle = "rgba(10,12,24,0.55)";
    } else {
      const g = ctx.createLinearGradient(0, rect.y, 0, rect.y + h);
      g.addColorStop(0, "rgba(46,58,30,0.92)");
      g.addColorStop(1, "rgba(22,30,14,0.92)");
      ctx.fillStyle = g;
    }
    ctx.fill(path);
    ctx.shadowColor = "transparent";
    if (k > 0) {
      ctx.save();
      ctx.clip(path);
      const fg = ctx.createLinearGradient(rect.x, 0, rect.x + w, 0);
      fg.addColorStop(0, "#ffcf6a");
      fg.addColorStop(1, "#ff9a3a");
      ctx.fillStyle = fg;
      ctx.globalAlpha = 0.75;
      ctx.fillRect(rect.x, rect.y, w * k, h);
      ctx.restore();
    }
    const pulse = 0.5 + 0.5 * Math.sin(now / 300);
    ctx.lineWidth = small ? DPR : Math.max(2, S * 5e-3);
    ctx.strokeStyle = over || focused ? "rgba(255,225,160,".concat(0.8 + 0.2 * pulse, ")") : small ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.55)";
    ctx.beginPath();
    ctx.roundRect(rect.x, rect.y, w, h, h / 2);
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.font = font(800, small ? UI().fs : h * 0.42);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, cx, cy + h * 0.03);
    ctx.restore();
    if (k >= 1) {
      SFX.click();
      action();
    }
  }
  const goHome = () => {
    location.href = "index.html";
  };
  function drawWorldLabels(now) {
    for (const m of moles) {
      if (m.type !== "squat" || m.phase === "hit" || m.rise < 0.5 || G.state !== "play") continue;
      const ok = crouching(now) || BodyMovin.mouse || !BodyMovin.live, box = moleBox(m), y = box.y + H * 0.035 + Math.sin(now / 160) * S * 4e-3, w = S * 0.2, hh = S * 0.06;
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      ctx.shadowBlur = S * 0.02;
      ctx.fillStyle = ok ? "rgba(40,120,60,0.92)" : "rgba(150,70,20,0.92)";
      ctx.beginPath();
      ctx.roundRect(m.hole.x - w / 2, y - hh, w, hh, hh * 0.3);
      ctx.fill();
      ctx.restore();
      label(ok ? "WHACK!" : "▼ SQUAT ▼", m.hole.x, y - hh / 2, S * 0.034, "#ffffff", 900);
    }
    if (king && (king.phase === "up" || king.phase === "rise") && G.state === "play" && !(banner && banner.text === "KING MOLE!")) {
      const box = kingBox(), y = Math.max(S * 0.24, hudBottom + UI().G + S * 0.045, box.y - S * 0.03), left = Math.max(0, king.up - (now - king.born) / 1e3);
      panel(W / 2 - S * 0.22, y - S * 0.045, S * 0.44, S * 0.09, S * 0.045, 0.55);
      label("BOTH HANDS!", W / 2, y, S * 0.045, "#ffe08a", 900);
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = i < king.hp ? "#ff5a6a" : "rgba(255,255,255,0.25)";
        ctx.beginPath();
        ctx.arc(W / 2 + (i - 1) * S * 0.045, y + S * 0.075, S * 0.014, 0, TAU);
        ctx.fill();
      }
      ctx.strokeStyle = "rgba(255,224,138,0.8)";
      ctx.lineWidth = S * 5e-3;
      ctx.beginPath();
      ctx.arc(W / 2, y, S * 0.25, Math.PI * 1.2, Math.PI * 1.2 + Math.PI * 0.6 * Math.min(1, left / 7.5));
      ctx.stroke();
    }
  }
  function homeBtn(now) {
    if (BodyMovin.sysMode && BodyMovin.sysMode() === "play") return;
    const U = UI();
    button("home", "← HOME", U.L + U.Wb / 2, U.T + U.Hh / 2, U.Wb, U.Hh, now, goHome, false, 1200, true);
  }
  function drawHUD(now) {
    const U = UI(), left = Math.max(0, ROUND - G.t), low = left < 10;
    homeBtn(now);
    const ready = G.quake >= 1, pulse = ready ? 0.5 + 0.5 * Math.sin(now / 90) : 0;
    const qw = Math.max(130 * DPR, U.vm * 20), qx = Math.min(W - U.L, BodyMovin.freeRight ? Math.min(W, BodyMovin.freeRight() * DPR) : W) - qw, qy = U.T, qh = U.Hh;
    glass(qx, qy, qw, qh);
    tipHud = [{ x: qx / DPR, y: qy / DPR, w: qw / DPR, h: qh / DPR }];
    ctx.save();
    const tr = new Path2D();
    tr.roundRect(qx, qy, qw, qh, qh / 2);
    ctx.clip(tr);
    const qg = ctx.createLinearGradient(qx, 0, qx + qw, 0);
    qg.addColorStop(0, "#c88a3a");
    qg.addColorStop(1, "#ffd36a");
    ctx.fillStyle = qg;
    ctx.globalAlpha = ready ? 0.6 + 0.3 * pulse : 0.6;
    ctx.fillRect(qx, qy, qw * clamp(G.quake, 0, 1), qh);
    ctx.restore();
    ctx.save();
    ctx.font = font(800, U.fs);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    ctx.fillText(ready ? "JUMP!" : "QUAKE", qx + qw / 2, qy + qh / 2 + DPR);
    ctx.restore();
    const ph = U.Hh * 1.2, tf = U.fs * 1.1, sf = ph * 0.62 * (1 + 0.12 * G.pulse);
    ctx.save();
    ctx.font = font(900, ph * 0.62);
    const scw = Math.max(ctx.measureText(G.score.toLocaleString()).width, ph * 0.9);
    ctx.font = font(800, tf);
    const tws = ctx.measureText("0:00").width;
    ctx.restore();
    const pw = U.Hh * 0.5 + tws + U.Hh * 0.6 + scw + U.Hh * 0.5;
    let px = W / 2 - pw / 2, py = U.T;
    if (px < U.right + U.G || px + pw > qx - U.G) {
      py = U.T + U.Hh + U.G;
      px = Math.min(Math.max(px, U.L), W - U.L - pw);
    }
    glass(px, py, pw, ph);
    hudBottom = py + ph;
    tipHud.push({ x: px / DPR, y: py / DPR, w: pw / DPR, h: ph / DPR });
    const s = Math.ceil(left), tt = "".concat(Math.floor(s / 60), ":").concat(String(s % 60).padStart(2, "0"));
    ctx.save();
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.font = font(800, tf);
    ctx.fillStyle = low ? "rgb(255,".concat(Math.round(110 + 80 * Math.max(0, Math.sin(now / 80))), ",90)") : "#ffcf5a";
    ctx.fillText(tt, px + U.Hh * 0.5, py + ph / 2 + DPR);
    ctx.textAlign = "right";
    ctx.font = font(900, sf);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(G.score.toLocaleString(), px + pw - U.Hh * 0.5, py + ph / 2 + DPR);
    ctx.restore();
    if (ready && !banner) {
      ctx.save();
      ctx.globalAlpha = 0.85 + 0.15 * pulse;
      outline("Jump to make a quake!", W / 2, H - Math.max(S * 0.08, U.T + U.Hh / 2), Math.max(U.fs * 1.4, S * 0.05), "#ffc060");
      ctx.restore();
    }
  }
  function drawPops() {
    for (const p of pops) {
      const k = p.t / 1.1, sc = p.size * (k < 0.15 ? 0.6 + k / 0.15 * 0.6 : 1.2 - (k - 0.15) * 0.2);
      ctx.save();
      ctx.globalAlpha = clamp(1.3 - k * 1.3, 0, 1);
      ctx.translate(p.x, p.y - k * S * 0.08);
      ctx.scale(sc, sc);
      outline(p.text, 0, 0, S * 0.045, p.col);
      ctx.restore();
    }
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
  function drawBanner(now) {
    if (!banner) return;
    const k = (now - banner.t) / 1e3;
    if (k > 1.8) {
      banner = null;
      return;
    }
    const sc = k < 0.18 ? 0.5 + k / 0.18 * 0.6 : k < 0.3 ? 1.1 - (k - 0.18) / 0.12 * 0.1 : 1;
    const L = sideLines(banner.text, sidePx(W, H), sideW(W, H, 0.22), (px) => font(900, px));
    ctx.save();
    ctx.globalAlpha = clamp((1.8 - k) / 0.4, 0, 1);
    ctx.translate(W * 0.025, H * 0.2);
    ctx.scale(sc, sc);
    L.lines.forEach((l, j) => outline(l, 0, j * L.px * 1.1, L.px, banner.col, 900, "left"));
    ctx.restore();
  }
  function icon(fn, x, y, s, col = "#fff") {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = col;
    ctx.fillStyle = col;
    ctx.lineWidth = s * 0.09;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = s * 0.15;
    fn(s);
    ctx.restore();
  }
  const IC = {
    mallet: (s) => {
      ctx.save();
      ctx.rotate(-0.6);
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.05);
      ctx.lineTo(0, s * 0.55);
      ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(-s * 0.32, -s * 0.38, s * 0.64, s * 0.3, s * 0.08);
      ctx.stroke();
      ctx.restore();
      ctx.beginPath();
      ctx.moveTo(s * 0.35, -s * 0.5);
      ctx.lineTo(s * 0.35, -s * 0.1);
      ctx.moveTo(s * 0.22, -s * 0.24);
      ctx.lineTo(s * 0.35, -s * 0.08);
      ctx.lineTo(s * 0.48, -s * 0.24);
      ctx.stroke();
    },
    squat: (s) => {
      ctx.beginPath();
      ctx.arc(0, -s * 0.45, s * 0.13, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.3);
      ctx.lineTo(-s * 0.05, s * 0.05);
      ctx.lineTo(s * 0.25, s * 0.1);
      ctx.lineTo(s * 0.2, s * 0.45);
      ctx.moveTo(-s * 0.05, s * 0.05);
      ctx.lineTo(-s * 0.3, s * 0.15);
      ctx.lineTo(-s * 0.25, s * 0.45);
      ctx.moveTo(0, -s * 0.2);
      ctx.lineTo(s * 0.35, -s * 0.12);
      ctx.stroke();
    },
    jump: (s) => {
      ctx.beginPath();
      ctx.arc(0, -s * 0.5, s * 0.13, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.35);
      ctx.lineTo(0, s * 0.05);
      ctx.lineTo(-s * 0.15, s * 0.35);
      ctx.moveTo(0, s * 0.05);
      ctx.lineTo(s * 0.15, s * 0.35);
      ctx.moveTo(0, -s * 0.27);
      ctx.lineTo(-s * 0.3, -s * 0.62);
      ctx.moveTo(0, -s * 0.27);
      ctx.lineTo(s * 0.3, -s * 0.62);
      ctx.stroke();
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.ellipse(0, s * 0.52, s * 0.35, s * 0.07, 0, 0, TAU);
      ctx.stroke();
    },
    hands: (s) => {
      for (const d of [-1, 1]) {
        ctx.save();
        ctx.translate(d * s * 0.3, 0);
        ctx.beginPath();
        ctx.roundRect(-s * 0.18, -s * 0.05, s * 0.36, s * 0.34, s * 0.08);
        ctx.stroke();
        for (const f of [-0.12, -0.04, 0.04, 0.12]) {
          ctx.beginPath();
          ctx.moveTo(f * s, -s * 0.05);
          ctx.lineTo(f * s, -s * 0.32);
          ctx.stroke();
        }
        ctx.restore();
      }
    },
    bunny: (s) => {
      ctx.beginPath();
      ctx.arc(0, s * 0.1, s * 0.25, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(-s * 0.1, -s * 0.35, s * 0.07, s * 0.22, -0.15, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(s * 0.1, -s * 0.35, s * 0.07, s * 0.22, 0.15, 0, TAU);
      ctx.stroke();
      ctx.strokeStyle = "#ff6a5a";
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.55, 0, TAU);
      ctx.moveTo(-s * 0.39, -s * 0.39);
      ctx.lineTo(s * 0.39, s * 0.39);
      ctx.stroke();
    }
  };
  function drawTitle(now) {
    homeBtn(now);
    const bh = Math.min(S * 0.12, H * 0.095), bw = Math.min(S * 0.45, W * 0.6), cy = H * UIBAND.start + bh / 2;
    const n = TV && G.tvAt ? Math.max(1, Math.ceil((G.tvAt - now) / 1e3)) : 0;
    button("start", n ? "START  ".concat(n) : "START", W / 2, cy, bw, bh, now, () => startRound(performance.now()), true);
  }
  function drawEnd(now) {
    const k = Math.min(1, (now - G.endAt) / 500), U = UI(), hs = BodyMovin.highScores && BodyMovin.highScores.state;
    if (hs && hs.phase) {
      homeBtn(now);
      if (hs.phase === "wait") {
        ctx.save();
        ctx.globalAlpha = k;
        outline("TIME'S UP!", W / 2, H * 0.42, S * 0.11, "#ffcc4a");
        ctx.restore();
      }
      G.endBtnAt = now + 500;
      return;
    }
    const cw = Math.min(S * 0.62, W - 2 * U.L), ch = Math.min(S * 0.36, H * 0.4), cy = Math.max(U.T + U.Hh + U.G, H * 0.16);
    ctx.save();
    ctx.globalAlpha = k;
    glass(W / 2 - cw / 2, cy, cw, ch, Math.min(ch / 2, S * 0.04));
    label("SCORE", W / 2, cy + ch * 0.24, Math.max(U.fs, ch * 0.13), "rgba(255,255,255,0.8)", 800);
    label(G.score.toLocaleString(), W / 2, cy + ch * 0.62, ch * 0.42, "#ffffff", 900);
    ctx.restore();
    const showButtons = now - G.endAt > 100;
    if (showButtons) {
      const L = BodyMovin.layout.end(W, H, { cy: Math.max(cy + ch + U.G * 2 + S * 0.08, H * 0.66) }), A = L.again, Hm = L.home;
      button("again", "PLAY AGAIN", A.x + A.w / 2, A.y + A.h / 2, A.w, A.h, now, () => startRound(performance.now()), G.focus === 0);
      button("endhome", "HOME", Hm.x + Hm.w / 2, Hm.y + Hm.h / 2, Hm.w, Hm.h, now, goHome, G.focus === 1, BodyMovin.LEAVE_MS);
    }
  }
  function resize() {
    DPR = Math.min(2, devicePixelRatio || 1);
    W = hud.width = Math.round(innerWidth * DPR);
    H = hud.height = Math.round(innerHeight * DPR);
    S = Math.min(W, H);
    camera.updateMatrixWorld();
    if (G.state !== "loading") layoutHoles(G.cols, false);
  }
  addEventListener("resize", () => setTimeout(resize, 0));
  let last = 0, frames = 0;
  function frame(now) {
    BodyMovin.update(now);
    const dt = Math.min(0.05, (now - (last || now)) / 1e3) || 1 / 60;
    last = now;
    frames++;
    if (G.state === "title" && TV && G.tvAt && now > G.tvAt) {
      G.tvAt = 0;
      startRound(now);
    }
    projectHoles();
    update(now, dt);
    render(dt);
    ctx.clearRect(0, 0, W, H);
    buttons = [];
    if (G.state === "title") drawTitle(now);
    if (G.state === "play") {
      drawWorldLabels(now);
      drawPops();
      drawHUD(now);
      drawBanner(now);
    }
    if (G.state === "end") {
      drawPops();
      drawEnd(now);
    }
    BodyMovin.drawHands(ctx, W, H);
    Object.assign(window.__game, {
      state: G.state,
      score: G.score,
      timeLeft: G.state === "play" ? Math.max(0, ROUND - G.t) : 0,
      combo: G.combo,
      bestCombo: G.bestCombo,
      hits: G.hits,
      bonks: G.bonks,
      misses: G.misses,
      bunnyHits: G.bunnyHits,
      golds: G.golds,
      squats: G.squats,
      cols: G.cols,
      assist: G.assist,
      quake: G.quake,
      quakes: G.quakes,
      kingsBeaten: G.kingsBeaten,
      smashes: G.smashes,
      best: BodyMovin.best(GAME),
      active: G.active,
      kcal: G.kcal,
      frames,
      audioErrors,
      quality: { ...state().quality },
      king: king && (king.phase === "up" || king.phase === "rise") ? { x: 0.5, y: (kingBox().y + H * 0.12) / H, hp: king.hp } : null,
      buttons: buttons.map((b) => ({ id: b.id, x: (b.rect.x + b.rect.w / 2) / W, y: (b.rect.y + b.rect.h / 2) / H, fill: b.fill }))
    });
    requestAnimationFrame(frame);
  }
  window.__game.endNow = () => {
    if (G.state === "play") endRound(performance.now());
  };
  window.__game.showcase = (types = ["mole", "gold", "helmet", "bunny", "squat", "mole", "gold", "mole", "helmet"]) => {
    G.state = "play";
    G.startAt = performance.now() - 2e4;
    G.spawnIn = 1e9;
    G.showcase = true;
    holes.forEach((h, i) => {
      if (h.mole || !types[i]) return;
      const m = newMole(h, h.row === SQUAT_ROW && types[i] !== "bunny" ? "squat" : types[i], performance.now(), 1e6);
      m.attract = true;
      h.mole = m;
      moles.push(m);
    });
  };
  Object.defineProperty(window.__game, "moles", { get: () => G.state === "play" ? moles.filter((m) => m.phase === "rise" || m.phase === "up").map((m) => ({ type: m.type, hp: m.hp, x: m.hole.x / W, y: lerp(m.hole.y, m.hole.top, 0.6) / H, row: m.hole.row, col: m.hole.col, needCrouch: m.type === "squat", rise: m.rise })) : [] });
  addEventListener("pointermove", (e) => {
    mouseXY = { x: e.clientX * DPR, y: e.clientY * DPR };
  });
  addEventListener("pointerdown", (e) => {
    audioInit();
    const x = e.clientX * DPR, y = e.clientY * DPR;
    for (const b of buttons) if (inBox(b.rect, x, y)) {
      SFX.click();
      b.action();
      return;
    }
    if (G.state === "play") clickHit = { x, y };
  });
  addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      audioInit();
      if (G.state === "title") startRound(performance.now());
      else if (G.state === "end" && performance.now() - G.endAt > 100) {
        SFX.click();
        if (G.focus === 0) startRound(performance.now());
        else goHome();
      }
    } else if (G.state === "end" && (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Tab")) {
      e.preventDefault();
      G.focus = 1 - G.focus;
    } else if (e.key === "Escape" && G.state === "play") goHome();
    else if ((e.key === "q" || e.key === "Q" || e.key === "ArrowUp") && G.state === "play") quake(performance.now());
  });
  resize();
  ctx.fillStyle = "#fff";
  ctx.font = font(700, S * 0.05);
  ctx.textAlign = "center";
  ctx.fillText("heading out to the lawn…", W / 2, H / 2);
  BodyMovin.start();
  await environment(scene, renderer, ENV, { background: true, rotation: ENV_ROT, exact: true, intensity: 1 });
  furNoise = makeFurNoise();
  soilMat = pbr("farm_soil", { repeat: [1, 1], color: "#c9b39a" });
  wallMat = pbr("excavated_soil_wall", { repeat: [2, 1], color: "#4a3a2e" });
  metalMat = pbr("metal_plate", { metalness: 0.9, roughness: 0.32, color: "#c8ccd2" });
  {
    const tl = new TextureLoader(), base = "assets/textures/leather_red_02/leather_red_02_";
    const ld = (k) => {
      const t = tl.load(base + k + (window.BP_TV ? "_512.jpg" : "_2k.jpg"));
      t.wrapS = t.wrapT = RepeatWrapping;
      return t;
    };
    leatherMat = new MeshPhysicalMaterial({ color: 9313816, normalMap: ld("nor_gl"), roughnessMap: ld("Rough"), aoMap: ld("AO"), roughness: 1, sheen: 0.3, sheenColor: new Color(16747120) });
  }
  mapleMat = pbr("white_maple_veneer", { repeat: [1, 2] });
  goldMat = new MeshPhysicalMaterial({ color: 16763210, metalness: 1, roughness: 0.22, clearcoat: 0.6, clearcoatRoughness: 0.1 });
  crownMat = new MeshPhysicalMaterial({ color: 16764762, metalness: 1, roughness: 0.18 });
  malletProto = buildMallet();
  dirtIM = new InstancedMesh(new IcosahedronGeometry(1, 0), soilMat, MAXD);
  dirtIM.castShadow = true;
  dirtIM.count = 0;
  dirtIM.frustumCulled = false;
  scene.add(dirtIM);
  grassIM = new InstancedMesh(new BoxGeometry(1, 1, 0.15), new MeshStandardMaterial({ color: 5933610, roughness: 0.8 }), 80);
  grassIM.count = 0;
  grassIM.frustumCulled = false;
  scene.add(grassIM);
  layoutHoles(3, false);
  {
    const warm = ["mole", "gold", "helmet", "squat", "bunny", "king"].map((t, i) => {
      const o = buildCritter(t);
      o.g.position.set(-1 + i * 0.4, 0.2, -2.5);
      o.g.scale.setScalar(0.05);
      scene.add(o.g);
      return o.g;
    });
    const ml = malletProto.clone();
    ml.position.set(0, 0.3, -2.5);
    scene.add(ml);
    warm.push(ml);
    renderer.compile(scene, camera);
    render(1 / 60);
    render(1 / 60);
    warm.forEach((o) => scene.remove(o));
  }
  const Qy = state().quality;
  Qy.frames = 0;
  Qy.t0 = performance.now();
  state().grace(3e3);
  G.state = "title";
  G.spawnIn = 0.5;
  if (TV) G.tvAt = performance.now() + 2e3;
  window.__game.ready = true;
  requestAnimationFrame(frame);
})().catch((e) => setTimeout(() => {
  throw e;
}));
