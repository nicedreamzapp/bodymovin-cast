import {
  KICK,
  RUN,
  STAND,
  blend,
  create as create4,
  sample
} from "./chunk-EZXOD6SV.js";
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
  model,
  realism_exports,
  render,
  setup,
  state,
  sun
} from "./chunk-5EPBUA75.js";
import "./chunk-CPYHHAA5.js";
import "./chunk-GEQJXPAR.js";
import "./chunk-UBB4M7UR.js";
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AgXToneMapping,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CapsuleGeometry,
  CircleGeometry,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NeutralToneMapping,
  NoColorSpace,
  Plane,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Raycaster,
  RepeatWrapping,
  SRGBColorSpace,
  ShadowMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  Vector3,
  three_module_exports
} from "./chunk-4IYDSAYK.js";
import "./chunk-NWIHTO7D.js";

// bmpage:bmpage:keeper.html#0
(async () => {
  var _a, _b;
  const BP = window.BodyMovin;
  const Q = new URLSearchParams(location.search);
  const GAME_ID = "keeper", ROUND = Q.has("round") ? +Q.get("round") : 75;
  const lerp = (a, b, t) => a + (b - a) * t, clamp = (v, a, b) => Math.max(a, Math.min(b, v)), rand = (a, b) => a + Math.random() * (b - a);
  const GOAL_HW = 3.66, GOAL_H = 2.44, KZ = -0.55, BALL_R = 0.11;
  const RR = setup(document.getElementById("gl"), { fov: 50, far: 1200, tier: Q.has("tier") ? +Q.get("tier") : void 0 });
  const { renderer, scene, camera } = RR;
  const BG_ROT = Q.has("rot") ? parseFloat(Q.get("rot")) : 0;
  await environment(scene, renderer, "stadium_01", { background: true, intensity: 1, rotation: BG_ROT, exact: !Q.has("noexact") });
  renderer.toneMappingExposure = Q.has("exp") ? parseFloat(Q.get("exp")) : 0.9;
  const TM = { agx: AgXToneMapping, neutral: NeutralToneMapping, aces: ACESFilmicToneMapping };
  if (Q.get("tm")) renderer.toneMapping = TM[Q.get("tm")];
  function canvasTex(w, h, draw, repeat) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d"), w, h);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    if (repeat) {
      t.wrapS = t.wrapT = RepeatWrapping;
    }
    return t;
  }
  const glowTex = canvasTex(128, 128, (g, w) => {
    const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    gr.addColorStop(0, "rgba(255,255,255,1)");
    gr.addColorStop(0.25, "rgba(255,255,255,0.55)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, w);
  });
  const sunDir = (() => {
    const a = (0.35 - 0.5) * Math.PI * 2, el = 15 * Math.PI / 180;
    const x = Math.cos(a) * Math.cos(el), z = Math.sin(a) * Math.cos(el);
    const c = Math.cos(BG_ROT), s = Math.sin(BG_ROT);
    return new Vector3(x * c + z * s, Math.sin(el), -x * s + z * c).normalize();
  })();
  const sun2 = sun(scene, { color: 16769208, intensity: 2.4, position: sunDir.clone().multiplyScalar(40).add(new Vector3(0, 0, -7)).toArray(), target: [0, 0, -7], size: 16 });
  sun2.shadow.camera.far = 90;
  sun2.shadow.camera.updateProjectionMatrix();
  const catcher = new Mesh(new PlaneGeometry(160, 160), new ShadowMaterial({ opacity: 0.5, color: 662021 }));
  catcher.rotation.x = -Math.PI / 2;
  catcher.receiveShadow = true;
  scene.add(catcher);
  const LW = 50, LD = 26, LN = 2048, LX = (x) => (x + LW / 2) / LW * LN, LZ = (z) => (z + LD - 3) / LD * (LN * LD / LW), LM = (m) => m / LW * LN;
  const lineTex = canvasTex(LN, Math.round(LN * LD / LW), (g) => {
    g.strokeStyle = "rgba(250,252,245,0.92)";
    g.lineWidth = LM(0.12);
    g.lineCap = "butt";
    const rect = (x0, z0, x1, z1) => g.strokeRect(LX(x0), LZ(z1), LX(x1) - LX(x0), LZ(z0) - LZ(z1));
    g.beginPath();
    g.moveTo(0, LZ(0));
    g.lineTo(LN, LZ(0));
    g.stroke();
    rect(-9.16, -5.5, 9.16, 0);
    rect(-20.16, -16.5, 20.16, 0);
    g.fillStyle = "rgba(250,252,245,0.92)";
    g.beginPath();
    g.arc(LX(0), LZ(-11), LM(0.2), 0, 7);
    g.fill();
    g.beginPath();
    g.arc(LX(0), LZ(-11), LM(9.15), Math.PI + 0.93, 2 * Math.PI - 0.93, false);
    g.stroke();
  });
  const lines = new Mesh(new PlaneGeometry(LW, LD), new MeshStandardMaterial({ map: lineTex, transparent: true, roughness: 0.95, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
  lines.rotation.x = -Math.PI / 2;
  lines.position.set(0, 4e-3, -(LD / 2 - 3));
  lines.receiveShadow = true;
  scene.add(lines);
  function popFlash() {
  }
  const postMat = new MeshPhysicalMaterial({ color: 16054008, roughness: 0.3, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08 });
  const goal = new Group();
  scene.add(goal);
  for (const sx of [-1, 1]) {
    const p = new Mesh(new CylinderGeometry(0.06, 0.06, GOAL_H, 16), postMat);
    p.position.set(sx * GOAL_HW, GOAL_H / 2, 0);
    p.castShadow = true;
    goal.add(p);
  }
  const bar = new Mesh(new CylinderGeometry(0.06, 0.06, GOAL_HW * 2 + 0.12, 16), postMat);
  bar.rotation.z = Math.PI / 2;
  bar.position.set(0, GOAL_H, 0);
  bar.castShadow = true;
  goal.add(bar);
  const ND = 1.9, NT = GOAL_H - 0.55;
  const netTex = canvasTex(128, 128, (g, w) => {
    g.clearRect(0, 0, w, w);
    g.strokeStyle = "rgba(255,255,255,1)";
    g.lineWidth = 3.5;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(0, w / 2);
    g.lineTo(w / 2, 0);
    g.lineTo(w, w / 2);
    g.lineTo(w / 2, w);
    g.closePath();
    g.stroke();
    for (const [x, y] of [[0, w / 2], [w / 2, 0], [w, w / 2], [w / 2, w]]) {
      g.fillStyle = "#fff";
      g.beginPath();
      g.arc(x, y, 4, 0, 7);
      g.fill();
    }
  }, true);
  netTex.colorSpace = NoColorSpace;
  const netMat = new MeshStandardMaterial({ color: 15922943, alphaMap: netTex, transparent: true, opacity: 0.9, side: DoubleSide, depthWrite: false, roughness: 0.8, emissive: 8952251, emissiveIntensity: 0.1 });
  const backNetMat = netMat.clone();
  backNetMat.opacity = 0.13;
  backNetMat.emissiveIntensity = 0;
  const nets = [];
  function netQuad(p00, p10, p01, p11, su, sv, cell = 0.16) {
    const pos = [], uv = [], idx = [], lu = p00.distanceTo(p10), lv = p00.distanceTo(p01);
    for (let j = 0; j <= sv; j++) for (let i = 0; i <= su; i++) {
      const u = i / su, v = j / sv, a = p00.clone().lerp(p10, u), b = p01.clone().lerp(p11, u), q = a.lerp(b, v);
      pos.push(q.x, q.y, q.z);
      uv.push(u * lu / cell, v * lv / cell);
    }
    for (let j = 0; j < sv; j++) for (let i = 0; i < su; i++) {
      const a = j * (su + 1) + i;
      idx.push(a, a + 1, a + su + 1, a + 1, a + su + 2, a + su + 1);
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("uv", new Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    const m = new Mesh(geo, netMat);
    goal.add(m);
    nets.push({ geo, base: Float32Array.from(pos) });
    return m;
  }
  const V = (x, y, z) => new Vector3(x, y, z);
  netQuad(V(-GOAL_HW, 0, ND), V(GOAL_HW, 0, ND), V(-GOAL_HW, NT, ND), V(GOAL_HW, NT, ND), 36, 12, 0.13).material = backNetMat;
  netQuad(V(-GOAL_HW, GOAL_H, 0), V(GOAL_HW, GOAL_H, 0), V(-GOAL_HW, NT, ND), V(GOAL_HW, NT, ND), 36, 8);
  for (const sx of [-1, 1]) netQuad(V(sx * GOAL_HW, 0, 0), V(sx * GOAL_HW, 0, ND), V(sx * GOAL_HW, GOAL_H, 0), V(sx * GOAL_HW, NT, ND), 10, 12);
  const frameMat = new MeshStandardMaterial({ color: 13160672, roughness: 0.5, metalness: 0.4 });
  for (const sx of [-1, 1]) {
    const a = V(sx * GOAL_HW, GOAL_H, 0), b = V(sx * GOAL_HW, NT, ND), c = V(sx * GOAL_HW, 0, ND);
    for (const [p, q] of [[a, b], [b, c]]) {
      const d = q.clone().sub(p);
      const m = new Mesh(new CylinderGeometry(0.025, 0.025, d.length(), 8), frameMat);
      m.position.copy(p).addScaledVector(d, 0.5);
      m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize());
      goal.add(m);
    }
  }
  {
    const m = new Mesh(new CylinderGeometry(0.025, 0.025, GOAL_HW * 2, 8), frameMat);
    m.rotation.z = Math.PI / 2;
    m.position.set(0, 0.03, ND);
    goal.add(m);
  }
  let netHitAt = -9, netHitP = new Vector3(), netHitK = 0;
  function rippleNets(t) {
    const age = t - netHitAt, k = netHitK * Math.max(0, 1 - age / 1.6);
    for (const n of nets) {
      const a = n.geo.attributes.position.array;
      if (k <= 0) {
        if (n.dirty) {
          a.set(n.base);
          n.geo.attributes.position.needsUpdate = true;
          n.dirty = false;
        }
        continue;
      }
      for (let i = 0; i < a.length; i += 3) {
        const bx = n.base[i], by = n.base[i + 1], bz = n.base[i + 2];
        const d = Math.hypot(bx - netHitP.x, by - netHitP.y, (bz - netHitP.z) * 0.6);
        const w = Math.exp(-d * 0.9) * Math.sin(age * 16 - d * 5) * k;
        const pin = Math.min(1, by / 0.2) * Math.min(1, bz / 0.3);
        a[i + 2] = bz + w * 0.45 * pin;
        a[i] = bx + w * 0.06 * Math.sign(bx) * pin;
        a[i + 1] = by - Math.abs(w) * 0.05 * pin;
      }
      n.geo.attributes.position.needsUpdate = true;
      n.dirty = true;
    }
  }
  const ghostMat = new MeshPhysicalMaterial({ color: 9425151, emissive: 2788607, emissiveIntensity: 0.35, transparent: true, opacity: 0.2, roughness: 0.15, clearcoat: 1, depthWrite: false });
  const beamMat = new MeshPhysicalMaterial({ color: 9425151, emissive: 2788607, emissiveIntensity: 0.3, transparent: true, opacity: 0.35, roughness: 0.2, depthWrite: false });
  const HIP = 0.95, SHO_X = 0.27, SHO_Y = 1.48 - HIP, ARM_A = 0.3, ARM_B = 0.36;
  const ARM_MAX = ARM_A + ARM_B, REACH = ARM_MAX * 0.95;
  const KEEP_STEP = 2.6, KEEP_TORSO = SHO_Y, FIG_TORSO = 0.34;
  const keeper = new Group();
  scene.add(keeper);
  const kBody = new Group();
  kBody.position.y = -HIP;
  keeper.add(kBody);
  const kTorso = new Mesh(new CapsuleGeometry(0.17, 0.5, 6, 16), ghostMat);
  kTorso.position.y = 1.2;
  kTorso.scale.set(1.25, 1, 0.7);
  kBody.add(kTorso);
  const kHead = new Mesh(new SphereGeometry(0.14, 20, 16), ghostMat);
  kHead.position.y = 1.68;
  kBody.add(kHead);
  const kLegs = [-1, 1].map((s) => {
    const l = new Mesh(new CapsuleGeometry(0.075, 0.62, 4, 10), ghostMat);
    l.position.set(s * 0.12, 0.42, 0);
    kBody.add(l);
    return l;
  });
  const armMat = beamMat.clone();
  armMat.opacity = 0.4;
  const boneGeo = (r, len) => {
    const g = new CapsuleGeometry(r, Math.max(0.01, len - 2 * r), 4, 10);
    g.translate(0, len / 2, 0);
    return g;
  };
  const upperGeo = boneGeo(0.055, ARM_A + 0.03), foreGeo = boneGeo(0.045, ARM_B - 0.07);
  const arms = ["left", "right"].map(() => {
    const u = new Mesh(upperGeo, armMat), f = new Mesh(foreGeo, armMat);
    scene.add(u, f);
    return { u, f, visible: true };
  });
  arms.forEach((a) => Object.defineProperty(a, "visible", { set(v) {
    a.u.visible = a.f.visible = v;
  }, get() {
    return a.u.visible;
  } }));
  const gloveMats = { left: new MeshPhysicalMaterial({ color: 16757736, emissive: 16751321, emissiveIntensity: 0.4, roughness: 0.35, sheen: 1 }), right: new MeshPhysicalMaterial({ color: 11071231, emissive: 8971519, emissiveIntensity: 0.4, roughness: 0.35, sheen: 1 }) };
  const gloves = {};
  for (const s of ["left", "right"]) {
    gloves[s] = new Mesh(new SphereGeometry(0.11, 24, 18), gloveMats[s]);
    gloves[s].castShadow = true;
    scene.add(gloves[s]);
  }
  const HIPF = 0.95, kg = new Group();
  scene.add(kg);
  const camLocal = new Vector3();
  const FLAT = Q.get("body") === "fig";
  const YOU_LOOK = { fillA: 0.04, rimA: 0.32, rimPow: 1.8 };
  const KFIG_OPTS = { scene: kg, camera: { position: camLocal }, BP, x: 0, z: 0, y: -HIPF, tier: RR.quality ? RR.quality.tier : 1, gloves: false, levelFeet: false, stepRange: 0, guardDepth: 0.04 };
  const kfig = FLAT ? create(Object.assign({}, KFIG_OPTS, { outfit: { shorts: "rgba(30,150,90,0.85)", band: "#ffffff", seam: "rgba(10,70,40,0.7)" } })) : create2(Object.assign({}, KFIG_OPTS, { outfit: "keeper", grip: { l: "open", r: "open" }, gripAbsolute: true, personOpts: { plainLook: YOU_LOOK }, plantFeet: { off: () => clamp((diveK - 0.3) * 2.5, 0, 1) }, onFallback: (w) => console.warn("real keeper off:", w) }));
  const kGhost = FLAT || !Q.has("ghost") ? null : create3(Object.assign({ scene: kg, BP, you: kfig, outfit: "keeper", floorY: -HIPF, tier: RR.quality ? RR.quality.tier : 1 }, STANCES.keeper));
  const kHideAO = () => [...kfig.objects, ...kfig.person ? [kfig.person.root, kfig.person.shadow].filter(Boolean) : [], ...kGhost && kGhost.st.person ? [kGhost.st.person.root] : []];
  {
    const ao = RR.passes && RR.passes.ao;
    if (ao) {
      const r0 = ao.render.bind(ao);
      ao.render = (...a) => {
        const hid = kHideAO().filter((o) => o.visible);
        hid.forEach((o) => o.visible = false);
        try {
          r0(...a);
        } finally {
          hid.forEach((o) => o.visible = true);
        }
      };
    }
  }
  window.__kfig = kfig;
  const kShadow = new Mesh(new CircleGeometry(0.6, 32), new MeshBasicMaterial({ map: glowTex, color: 0, transparent: true, opacity: 0.3, depthWrite: false }));
  kShadow.rotation.x = -Math.PI / 2;
  kShadow.position.set(0, 0.01, KZ);
  scene.add(kShadow);
  const skin = new MeshPhysicalMaterial({ color: 12159594, roughness: 0.6, sheen: 0.4, sheenColor: 16763048 });
  function makeStriker(color) {
    const mat = new MeshPhysicalMaterial({ color, roughness: 0.75, sheen: 1, sheenRoughness: 0.5, sheenColor: 16777215 });
    const shorts = new MeshPhysicalMaterial({ color: 1382175, roughness: 0.8, sheen: 0.6 });
    const g = new Group();
    const torso = new Mesh(new CapsuleGeometry(0.2, 0.45, 4, 12), mat);
    torso.position.y = 1.2;
    g.add(torso);
    const head = new Mesh(new SphereGeometry(0.13, 16, 12), skin);
    head.position.y = 1.72;
    g.add(head);
    const hip = new Mesh(new CapsuleGeometry(0.19, 0.12, 4, 12), shorts);
    hip.position.y = 0.88;
    g.add(hip);
    const limb = (r, len, m, x, y) => {
      const p = new Group();
      p.position.set(x, y, 0);
      const geo = new CapsuleGeometry(r, len, 4, 8);
      geo.translate(0, -len / 2 - r, 0);
      p.add(new Mesh(geo, m));
      g.add(p);
      return p;
    };
    const legs = [limb(0.085, 0.62, skin, -0.11, 0.86), limb(0.085, 0.62, skin, 0.11, 0.86)];
    const sock = new MeshStandardMaterial({ color: 15921906, roughness: 0.8 }), boot = new MeshStandardMaterial({ color: 1118481, roughness: 0.3, metalness: 0.3 });
    for (const L of legs) {
      const sk = new Mesh(new CylinderGeometry(0.092, 0.08, 0.36, 10), sock);
      sk.position.y = -0.62;
      L.add(sk);
      const bt = new Mesh(new BoxGeometry(0.13, 0.09, 0.27), boot);
      bt.position.set(0, -0.84, 0.05);
      L.add(bt);
    }
    const hair = new Mesh(new SphereGeometry(0.137, 16, 10, 0, 6.283, 0, 1.4), new MeshStandardMaterial({ color: [2759184, 1118481, 8014368][Math.floor(Math.random() * 3)], roughness: 0.9 }));
    hair.position.y = 1.735;
    g.add(hair);
    const arms2 = [limb(0.06, 0.48, mat, -0.27, 1.45), limb(0.06, 0.48, mat, 0.27, 1.45)];
    g.traverse((o) => {
      if (o.isMesh) o.castShadow = true;
    });
    scene.add(g);
    const npc = FLAT ? null : create4({ scene: g, outfit: "footballer", colors: { shirt: color }, lod: 1, tier: RR.quality ? RR.quality.tier : 1 });
    const capsule = [];
    g.traverse((o) => {
      if (o.isMesh) capsule.push(o);
    });
    return { g, legs, arms: arms2, torso, npc, capsule, pos: new Vector3(), home: new Vector3(), walk: 0, kick: 0, kt: null };
  }
  const CELEBRATE = { lean: -4, air: 0, l: { thigh: 4, knee: 8, out: 8, arm: 170, armOut: 25, elbow: 10 }, r: { thigh: -4, knee: 8, out: 8, arm: 170, armOut: 25, elbow: 10 } };
  const GUTTED = { lean: 6, l: { thigh: 2, knee: 6, out: 6, arm: 150, armOut: 35, elbow: 120 }, r: { thigh: -2, knee: 6, out: 6, arm: 150, armOut: 35, elbow: 120 } };
  function npcPose(s, A) {
    if (!s.npc || !s.npc.ready) return false;
    if (s.capsule[0].visible) s.capsule.forEach((o) => o.visible = false);
    s.npc.set(A);
    return true;
  }
  const strikers = [14826042, 15774761, 10181887].map(makeStriker);
  const spots = () => {
    const r = rand(9, 14), a = rand(-0.55, 0.55);
    return new Vector3(Math.sin(a) * r, 0, -Math.cos(a) * r);
  };
  strikers.forEach((s, i) => {
    s.home.copy(new Vector3((i - 1) * 7, 0, -13 - Math.abs(i - 1) * 2));
    s.pos.copy(s.home);
    s.g.position.copy(s.pos);
  });
  const ballProto = (await model("football")).getObjectByName("football_inflated");
  ballProto.position.set(0, 0, 0);
  function makeBall() {
    const mesh = new Group();
    mesh.add(ballProto.clone(true));
    mesh.visible = false;
    scene.add(mesh);
    const glow = new Sprite(new SpriteMaterial({ map: glowTex, color: 16771496, blending: AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.6 }));
    glow.scale.set(0.6, 0.6, 1);
    mesh.add(glow);
    const trail = Array.from({ length: 14 }, () => {
      const sp = new Sprite(new SpriteMaterial({ map: glowTex, color: 16777215, depthWrite: false, transparent: true, opacity: 0 }));
      scene.add(sp);
      return sp;
    });
    const shadow = new Mesh(new CircleGeometry(0.22, 24), new MeshBasicMaterial({ map: glowTex, color: 0, transparent: true, opacity: 0.4, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2;
    shadow.visible = false;
    scene.add(shadow);
    const aim = new Mesh(new CircleGeometry(0.55, 32), new MeshBasicMaterial({ map: glowTex, color: 16763955, transparent: true, opacity: 0, depthWrite: false, blending: AdditiveBlending }));
    aim.rotation.x = -Math.PI / 2;
    aim.position.set(0, 0.02, KZ);
    scene.add(aim);
    return { mesh, glow, trail, trailPts: [], shadow, aim, busy: false };
  }
  const balls = [makeBall(), makeBall()];
  const SPARKS = 160, spPos = new Float32Array(SPARKS * 3), spVel = [], spLife = new Float32Array(SPARKS);
  const spGeo = new BufferGeometry();
  spGeo.setAttribute("position", new BufferAttribute(spPos, 3));
  const spMat = new PointsMaterial({ size: 0.09, map: glowTex, color: 16777215, transparent: true, depthWrite: false, opacity: 0.85 });
  scene.add(new Points(spGeo, spMat));
  for (let i = 0; i < SPARKS; i++) spVel.push(new Vector3());
  let spNext = 0;
  function burst(p, n, col) {
    spMat.color.set(col);
    for (let k = 0; k < n; k++) {
      const i = spNext++ % SPARKS;
      spPos.set([p.x, p.y, p.z], i * 3);
      spVel[i].set(rand(-1, 1), rand(-0.3, 1.4), rand(-1.4, 0.2)).normalize().multiplyScalar(rand(2, 7));
      spLife[i] = rand(0.5, 1);
    }
  }
  const CAM = new Vector3(0, 1.45, 4.5), LOOK = new Vector3(0, 1, -6);
  const hud = document.getElementById("hud"), ctx = hud.getContext("2d");
  let W = 1280, H = 720, S = 720, DPR = 1;
  function resize() {
    W = innerWidth;
    H = innerHeight;
    S = Math.min(W, H);
    DPR = Math.min(devicePixelRatio || 1, 2);
    hud.width = Math.round(W * DPR);
    hud.height = Math.round(H * DPR);
    const aspect = W / H;
    camera.aspect = aspect;
    const halfW = (GOAL_HW + 0.45) / CAM.z, vfov = 2 * Math.atan(halfW / aspect) * 180 / Math.PI;
    camera.fov = clamp(vfov, 46, 78);
    camera.updateProjectionMatrix();
  }
  addEventListener("resize", resize);
  resize();
  const ray = new Raycaster(), kPlane = new Plane(new Vector3(0, 0, 1), -KZ), tmpV = new Vector3();
  function screenToKeeper(sx, sy, out) {
    ray.setFromCamera({ x: sx * 2 - 1, y: -(sy * 2 - 1) }, camera);
    if (!ray.ray.intersectPlane(kPlane, out)) out.set(0, 1, KZ);
    out.x = clamp(out.x, -GOAL_HW - 0.8, GOAL_HW + 0.8);
    out.y = clamp(out.y, 0.08, GOAL_H + 0.7);
    return out;
  }
  function toScreen(v) {
    tmpV.copy(v).project(camera);
    return { x: (tmpV.x + 1) / 2, y: (1 - tmpV.y) / 2 };
  }
  let AC = null, master = null, noiseBuf = null, crowdGain = null;
  const CROWD = {}, CROWD_K = 3.2;
  function roar(k, which) {
    const b = CROWD[which || (Math.random() < 0.5 ? "crowd_roar1" : "crowd_roar2")];
    if (!AC || !b) return;
    const t = AC.currentTime, n = AC.createBufferSource(), g = AC.createGain();
    n.buffer = b;
    n.playbackRate.value = 0.96 + Math.random() * 0.08;
    g.gain.setValueAtTime(1e-4, t);
    g.gain.linearRampToValueAtTime(Math.min(0.5, 0.3 * k), t + 0.15);
    n.connect(g).connect(master);
    n.start(t);
  }
  const MUTE = Q.has("mute");
  function audioInit() {
    var _a2;
    if (AC) {
      (_a2 = AC.resume) == null ? void 0 : _a2.call(AC);
      return;
    }
    try {
      AC = new (window.AudioContext || window.webkitAudioContext)();
      master = AC.createGain();
      master.gain.value = MUTE ? 0 : 0.8;
      const lim = AC.createDynamicsCompressor();
      lim.threshold.value = -9;
      lim.knee.value = 6;
      lim.ratio.value = 12;
      lim.attack.value = 3e-3;
      lim.release.value = 0.25;
      master.connect(lim).connect(AC.destination);
      noiseBuf = AC.createBuffer(1, AC.sampleRate * 2, AC.sampleRate);
      const d = noiseBuf.getChannelData(0);
      let b = 0;
      for (let i = 0; i < d.length; i++) {
        b = 0.97 * b + 0.03 * (Math.random() * 2 - 1);
        d[i] = (Math.random() * 2 - 1) * 0.5 + b * 3;
      }
      crowdGain = AC.createGain();
      crowdGain.gain.value = 0;
      crowdGain.connect(master);
      for (const k of ["crowd_loop", "crowd_roar1", "crowd_roar2"])
        fetch(new URL("assets/sfx/" + k + ".mp3", location.href)).then((r) => r.arrayBuffer()).then((b2) => AC.decodeAudioData(b2)).then((buf) => {
          CROWD[k] = buf;
          if (k === "crowd_loop") {
            const n = AC.createBufferSource();
            n.buffer = buf;
            n.loop = true;
            n.loopStart = 0.06;
            n.loopEnd = buf.duration - 0.06;
            n.connect(crowdGain);
            n.start();
          }
        }).catch(() => {
        });
    } catch (e) {
      AC = null;
    }
  }
  function noise(dur, freq, q, peak, attack = 0.01, type = "bandpass", sweepTo) {
    if (!AC) return;
    const t = AC.currentTime;
    const s = AC.createBufferSource();
    s.buffer = noiseBuf;
    s.loop = true;
    const f = AC.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(freq, t);
    f.Q.value = q;
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
    const g = AC.createGain();
    g.gain.setValueAtTime(1e-4, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
    s.connect(f).connect(g).connect(master);
    s.start(t, Math.random());
    s.stop(t + dur + 0.05);
  }
  function tone(freq, dur, peak, type = "sine", toFreq, delay = 0) {
    if (!AC) return;
    const t = AC.currentTime + delay;
    const o = AC.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (toFreq) o.frequency.exponentialRampToValueAtTime(toFreq, t + dur);
    const g = AC.createGain();
    g.gain.setValueAtTime(1e-4, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.01);
    g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + dur + 0.05);
  }
  const sfx = {
    kick() {
      tone(140, 0.16, 0.7, "sine", 45);
      noise(0.06, 1800, 0.8, 0.25);
    },
    save(big) {
      tone(220, 0.12, 0.5, "triangle", 90);
      noise(0.12, 900, 0.7, 0.5);
      this.cheer(big ? 1 : 0.7);
    },
    cheer(k = 1) {
      roar(k);
    },
    // the real crowd roars (10/31); the old buzzing sawtooth "cheers" are gone
    goal() {
      roar(0.8, "crowd_roar2");
      tone(180, 0.5, 0.12, "sawtooth", 90);
    },
    // the other end of the stadium erupts (real roar, no noise)
    whistle(len = 0.45) {
      if (!AC) return;
      const t = AC.currentTime;
      const o = AC.createOscillator(), lfo = AC.createOscillator(), lg = AC.createGain(), g = AC.createGain();
      o.frequency.value = 2900;
      lfo.frequency.value = 28;
      lg.gain.value = 140;
      lfo.connect(lg).connect(o.frequency);
      g.gain.setValueAtTime(1e-4, t);
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      g.gain.setValueAtTime(0.18, t + len);
      g.gain.exponentialRampToValueAtTime(1e-4, t + len + 0.08);
      o.connect(g).connect(master);
      o.start(t);
      lfo.start(t);
      o.stop(t + len + 0.1);
      lfo.stop(t + len + 0.1);
    },
    tick() {
      tone(1200, 0.05, 0.12, "square");
    },
    punch() {
      tone(90, 0.35, 0.9, "sine", 35);
      noise(0.3, 400, 0.6, 0.6, 5e-3, "lowpass", 120);
      tone(1400, 0.2, 0.08, "triangle", 2600, 0.02);
    },
    press() {
      tone(660, 0.08, 0.2, "triangle");
      tone(990, 0.12, 0.18, "triangle", null, 0.07);
    }
  };
  const G = window.__game = {
    state: "title",
    score: 0,
    saves: 0,
    goals: 0,
    shots: 0,
    streak: 0,
    bestStreak: 0,
    timeLeft: ROUND,
    assist: 0,
    active: [],
    shot: null,
    targets: [],
    target: null,
    saveKinds: { hand: 0, body: 0, squat: 0, punch: 0, kick: 0 },
    twins: 0,
    splitSaves: 0,
    best: BP.best(GAME_ID),
    errors: []
  };
  G.endNow = () => {
    if (G.state === "play") endRound();
  };
  let tStart = 0, gameT = 0, lastT = 0, nextShotAt = 0, shake = 0, flash = 0, flashCol = "255,255,255", crowdJump = 0, ending = false, sinceTwin = 0, tipShown = 0;
  let keeperX = 0, keeperCrouch = 0;
  const popups = [], hist = [], hudParts = [], punchAt = { left: -9, right: -9 };
  function popup(text, sub, col, big = 1) {
    popups.length = 0;
    popups.push({ text, sub, col, t: 0, big });
  }
  BP.on("punchL", () => {
    punchAt.left = gameT;
  });
  BP.on("punchR", () => {
    punchAt.right = gameT;
  });
  function diff() {
    return clamp(gameT / ROUND, 0, 1);
  }
  let K = null;
  const GX = GOAL_HW - 0.2, SHY = HIP + SHO_Y;
  const KDEF = { L: 1.3, R: 1.3, up: 1.15, down: 1.9 };
  function autoK() {
    const I = BP.img;
    if (!(BP.live && !BP.mouse && !BP.simulating && I && I.lShoulder && I.rShoulder && I.lHip && I.rHip && performance.now() - (BP.imgAt || 0) < 700)) {
      K = null;
      G.calib = null;
      return;
    }
    const cx = (I.lShoulder[0] + I.rShoulder[0]) / 2, cy = (I.lShoulder[1] + I.rShoulder[1]) / 2, T = Math.max(0.03, Math.hypot(cx - (I.lHip[0] + I.rHip[0]) / 2, cy - (I.lHip[1] + I.rHip[1]) / 2));
    K = Object.assign({ cx, cy, T }, KDEF);
    G.calib = null;
  }
  function learnK(I) {
    if (!K || !I.lShoulder || !I.rShoulder || !I.lHip || !I.rHip) return;
    const cx = (I.lShoulder[0] + I.rShoulder[0]) / 2, cy = (I.lShoulder[1] + I.rShoulder[1]) / 2, T = Math.hypot(cx - (I.lHip[0] + I.rHip[0]) / 2, cy - (I.lHip[1] + I.rHip[1]) / 2);
    if (T < 0.03) return;
    K.T += (T - K.T) * 0.02;
    if (T < K.T * 0.8 || T > K.T * 1.25) return;
    for (const h of [I.lHand, I.rHand]) {
      if (!h) continue;
      const u = (h[0] - K.cx) / T, v = (K.cy - h[1]) / T;
      if (u > K.L) K.L = Math.min(3.2, K.L + (u - K.L) * 0.3);
      if (-u > K.R) K.R = Math.min(3.2, K.R + (-u - K.R) * 0.3);
      if (v > K.up) K.up = Math.min(2.2, K.up + (v - K.up) * 0.3);
      if (-v > K.down) K.down = Math.min(3.2, K.down + (-v - K.down) * 0.3);
    }
    G.calib = Object.fromEntries(Object.entries(K).map(([k, v]) => [k, +v.toFixed(3)]));
  }
  function calX(px) {
    const u = (px - K.cx) / K.T;
    return u > 0 ? -u / K.L * GX : -u / K.R * GX;
  }
  function calY(py) {
    const u = (K.cy - py) / K.T;
    return u >= 0 ? SHY + u / K.up * (GOAL_H + 0.06 - SHY) : SHY + u / K.down * (SHY - 0.14);
  }
  function startRound(now) {
    var _a2, _b2;
    autoK();
    BP.uiCover = null;
    audioInit();
    sfx.whistle(0.55);
    for (const b of balls) {
      b.busy = false;
      b.mesh.visible = false;
      b.shadow.visible = false;
    }
    Object.assign(G, {
      state: "play",
      score: 0,
      saves: 0,
      goals: 0,
      shots: 0,
      streak: 0,
      bestStreak: 0,
      timeLeft: ROUND,
      assist: 0.15,
      active: [],
      shot: null,
      targets: [],
      target: null,
      saveKinds: { hand: 0, body: 0, squat: 0, punch: 0, kick: 0 },
      twins: 0,
      splitSaves: 0
    });
    BP.music("keeper");
    if (MUTE) BP.musicVolume(0);
    (_b2 = (_a2 = state()).grace) == null ? void 0 : _b2.call(_a2, 1500);
    BP.activity.activeSec = 0;
    BP.activity.kcal = 0;
    G.fpsMin = 999;
    tStart = now;
    gameT = 0;
    legUpAt = -9;
    nextShotAt = 1.6;
    ending = false;
    sinceTwin = 0;
    tipShown = 0;
    popups.length = 0;
    popup("GET READY", "stop the ball with your hands or body", "#9fe8ff", 0.8);
  }
  function makeShot(striker, tx, ty, opts = {}) {
    const d = diff(), a = G.assist, b = balls.find((b2) => !b2.busy);
    if (!b) return null;
    const s = striker;
    const power = !opts.twin && d > 0.4 && Math.random() < 0.3 && a < 0.3;
    const flight = (opts.flight || lerp(1.35, 0.85, d) * (1 + a * 0.7)) * (power ? 0.82 : 1);
    const runT = opts.runT || lerp(1.1, 0.8, d) * (1 + a * 0.4);
    const S0 = s.pos.clone().add(new Vector3(0, 0, 0.6).applyAxisAngle(new Vector3(0, 1, 0), Math.atan2(-s.pos.x, -s.pos.z) + Math.PI));
    S0.y = BALL_R;
    const low = ty < 0.5;
    const shot = {
      striker: s,
      ball: b,
      start: S0,
      end: new Vector3(tx, ty, KZ),
      low,
      power,
      flight,
      runT,
      t0: gameT,
      phase: "runup",
      twin: opts.twin || null,
      curve: d > 0.25 && !opts.twin ? rand(-1, 1) * lerp(0.3, 1.6, d) : 0,
      loft: low ? rand(0.05, 0.25) : rand(0.3, 1),
      res: null,
      vel: new Vector3()
    };
    b.busy = true;
    b.mesh.position.copy(S0);
    b.mesh.visible = true;
    b.shadow.visible = true;
    b.trailPts.length = 0;
    G.active.push(shot);
    G.shots++;
    return shot;
  }
  function newShot() {
    const d = diff(), a = G.assist;
    sinceTwin++;
    const busy = new Set(G.active.map((s2) => s2.striker));
    const free = strikers.filter((k) => !busy.has(k) && k !== G.lastStriker);
    if (gameT > 18 && a < 0.35 && sinceTwin >= 3 && Math.random() < 0.55 && free.length >= 2) {
      sinceTwin = 0;
      G.twins++;
      const [s1, s2] = free.sort((p, q) => p.pos.x - q.pos.x);
      const flight = lerp(1.5, 1.05, d), runT = lerp(1.2, 0.95, d);
      const t1 = makeShot(s1, -rand(1, lerp(2, 3.1, d)), rand(0.75, 1.9), { twin: "left", flight, runT });
      const t2 = makeShot(s2, rand(1, lerp(2, 3.1, d)), rand(0.75, 1.9), { twin: "right", flight, runT });
      G.lastStriker = s2;
      popup("TWIN SHOT", "one ball for each hand", "#ff9ae6", 0.75);
      return;
    }
    const s = free[Math.floor(Math.random() * free.length)] || strikers[0];
    G.lastStriker = s;
    const low = Math.random() < lerp(0.18, 0.3, d);
    const spreadX = lerp(1.6, 3.3, d) * (1 - a * 0.4);
    const tx = clamp(rand(-1, 1) * spreadX, -GOAL_HW + 0.35, GOAL_HW - 0.35);
    const ty = low ? rand(0.2, 0.42) : rand(0.65, lerp(1.7, 2.2, d) - a * 0.4);
    makeShot(s, tx, ty);
  }
  function shotPos(sh, t, out) {
    out.set(lerp(sh.start.x, sh.end.x, t) + sh.curve * Math.sin(Math.PI * t), lerp(sh.start.y, sh.end.y, t) + sh.loft * 4 * t * (1 - t), lerp(sh.start.z, sh.end.z, t));
    return out;
  }
  const hw = { left: new Vector3(), right: new Vector3() };
  const HIT_X = 0.55, HIT_Y = 0.6;
  function judge(sh) {
    const p = sh.end;
    let best = null;
    for (const h of hist) {
      if (gameT - h.t > 0.2) continue;
      for (const side of ["left", "right"]) {
        const q = h[side];
        if (!q) continue;
        const dx = (p.x - q.x) / HIT_X, dy = (p.y - q.y) / HIT_Y;
        if (dx * dx + dy * dy < 1) best = best || { kind: "hand", side };
      }
      const top = 1.95 - h.crouch * 0.75;
      if (Math.abs(p.x - h.kx) < 0.5 && p.y < top + 0.15) best = best || { kind: "body" };
      if (h.crouch > 0.42 && p.y < 0.7 && Math.abs(p.x - h.kx) < 2.1) best = best || { kind: "squat" };
    }
    const legUp = gameT >= legUpAt && gameT - legUpAt < 0.7 || kfig.legLift && Math.max(kfig.legLift.l, kfig.legLift.r) > 0.15;
    if (p.y < 0.8 && (legUp || BP.recent("kickL", 500) || BP.recent("kickR", 500)) && Math.abs(p.x - keeperX) < 2.2) best = { kind: "kick" };
    if (best && best.kind === "hand" && gameT - punchAt[best.side] < 0.5) best.kind = "punch";
    else if (best) {
      for (const side of ["left", "right"]) if (gameT - punchAt[side] < 0.5 && hist.length) {
        const q = hist[hist.length - 1][side];
        if (q && Math.hypot((p.x - q.x) / HIT_X, (p.y - q.y) / HIT_Y) < 1) {
          best = { kind: "punch", side };
          break;
        }
      }
    }
    return best;
  }
  function confetti(at, n) {
    const sp = toScreen(at), cols = ["#ff7ad9", "#66e0ff", "#ffd166", "#7cff9a", "#c9a7ff", "#ffffff"];
    for (let i = 0; i < n; i++) {
      const a = rand(0, 6.283), v = rand(0.25, 1.1) * S;
      hudParts.push({ x: sp.x * W, y: sp.y * H, vx: Math.cos(a) * v, vy: Math.sin(a) * v - S * 0.5, r: rand(6e-3, 0.013) * S, rot: rand(0, 6), vr: rand(-12, 12), c: cols[i % cols.length], life: rand(0.9, 1.6) });
    }
  }
  function resolveShot(sh) {
    const r = judge(sh);
    sh.res = r ? "save" : "goal";
    sh.phase = "result";
    sh.tRes = gameT;
    sh.kind = r && r.kind;
    const at = sh.end.clone();
    const dir = new Vector3().subVectors(sh.end, sh.start).normalize(), spd = sh.start.distanceTo(sh.end) / sh.flight;
    const mate = sh.twin && G.active.find((o) => o !== sh && o.twin);
    if (r) {
      G.saves++;
      G.streak++;
      G.bestStreak = Math.max(G.bestStreak, G.streak);
      G.saveKinds[r.kind]++;
      const corner = Math.abs(at.x) > 2.5 || at.y > 1.85, punch = r.kind === "punch";
      let pts = 100 + Math.min(10, G.streak - 1) * 25 + (corner ? 50 : 0) + (sh.power ? 50 : 0) + (punch ? 150 : 0);
      const split = mate && mate.res === "save";
      if (split) {
        pts += 300;
        G.splitSaves++;
      }
      G.score += pts;
      if (r.kind === "kick") sh.vel.set(rand(-3, 3), rand(4, 7), -spd * 0.9);
      else if (punch) sh.vel.set(-dir.x * spd * 0.6 + rand(-1, 1), rand(5, 8), -spd * 1.5);
      else sh.vel.set(at.x * 0.6 + rand(-2, 2), rand(3, 6), -spd * 0.35);
      const words = { hand: corner ? "WHAT A SAVE!" : "SAVE!", body: "BLOCKED!", squat: "LOW SAVE!", punch: "PUNCH CLEAR!", kick: "KICK SAVE!" };
      if (split) popup("DOUBLE SAVE!", "+".concat(pts, "  both hands!"), "#ff9ae6", 1.15);
      else if (!(mate && !mate.res)) popup(words[r.kind], "+".concat(pts) + (G.streak > 1 ? "   ".concat(G.streak, " in a row") : ""), punch ? "#ffb347" : r.kind === "squat" || r.kind === "kick" ? "#ffd166" : "#7cf0ff", corner || punch ? 1.15 : 1);
      if (G.streak > 0 && G.streak % 5 === 0) popup(G.streak >= 10 ? "UNBEATABLE" : "BRICK WALL", "".concat(G.streak, " saves in a row"), "#c9a7ff", 0.8);
      burst(at, punch ? 120 : 70, punch ? 16757575 : r.kind === "squat" ? 16765286 : r.side === "left" ? 16743129 : 10479871);
      confetti(at, split || punch ? 100 : corner ? 80 : 50);
      popFlash(corner || split || punch ? 16 : 7);
      if (punch) {
        sfx.punch();
      }
      sfx.save(corner || split || punch || G.streak >= 3);
      crowdJump = 1;
      shake = punch ? 0.7 : 0.35;
      flash = 0.35;
      flashCol = punch ? "255,180,80" : "120,230,255";
      G.assist = Math.max(0, G.assist - 0.06);
    } else {
      G.goals++;
      G.streak = 0;
      sh.vel.copy(dir).multiplyScalar(spd * 0.9);
      popup("GOAL", ["so close!", "reach for the ring", "step toward the ring", "next one is yours"][Math.floor(Math.random() * 4)], "#ffb0b0", 0.9);
      sfx.goal();
      shake = 0.2;
      flash = 0.25;
      flashCol = "255,90,90";
      G.assist = Math.min(0.6, G.assist + 0.14);
    }
  }
  function endRound() {
    document.querySelectorAll(".bph-tip").forEach((e) => e.remove());
    popups.length = 0;
    G.state = "end";
    sfx.whistle(0.35);
    G.round = { active: BP.activity.activeSec, kcal: BP.activity.kcal };
    G.best = Math.max(BP.best(GAME_ID), G.score);
    G.newBest = G.score > 0 && G.score > (G._prevBest || 0);
    BP.saveSession({ game: GAME_ID, score: G.score });
    if (BP.highScores) BP.highScores(GAME_ID, G.score);
    G.sessionsSaved = (G.sessionsSaved || 0) + 1;
    for (const b of balls) {
      b.busy = false;
      b.mesh.visible = false;
      b.shadow.visible = false;
    }
    G.active = [];
    G.shot = null;
    G.targets = [];
    G.target = null;
    endAt = performance.now();
    sfx.cheer(1.2);
    crowdJump = 1;
  }
  let endAt = 0;
  let buttons = [], clickAt = null, keyPress = false;
  addEventListener("pointerdown", (e) => {
    clickAt = { x: e.clientX, y: e.clientY };
    audioInit();
  });
  addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      keyPress = true;
      e.preventDefault();
    }
    if (e.key === "Escape" || e.key === "h") {
      if (G.state !== "title") goHome();
    }
  });
  function goHome() {
    location.href = "index.html";
  }
  function button(id, label, x, y, w, h, now, primary, action, ms = 650) {
    const r = { x, y, w, h }, hov = BP.handOver(r, W, H);
    const arm = G._arm || (G._arm = {});
    if (arm[id + "_f"] !== G._frame - 1) arm[id] = !hov || ms < 1e3;
    else if (!hov) arm[id] = true;
    arm[id + "_f"] = G._frame;
    const over = hov && arm[id];
    const k = BP.dwell(id, over, now, ms);
    buttons.push({ r, action, primary });
    ctx.save();
    const rad = h / 2;
    ctx.shadowColor = primary ? "rgba(80,200,255,0.7)" : "rgba(255,255,255,0.25)";
    ctx.shadowBlur = over ? S * 0.05 : S * 0.02;
    const g = ctx.createLinearGradient(x, 0, x + w, 0);
    if (primary) {
      g.addColorStop(0, "#2b6cff");
      g.addColorStop(1, "#13c4ff");
    } else {
      g.addColorStop(0, "rgba(14,18,32,0.78)");
      g.addColorStop(1, "rgba(10,12,24,0.78)");
    }
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, rad);
    ctx.fill();
    ctx.shadowBlur = 0;
    if (k > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, rad);
      ctx.clip();
      ctx.fillStyle = "rgba(255,255,255,0.32)";
      ctx.fillRect(x, y, w * k, h);
      ctx.restore();
    }
    ctx.lineWidth = Math.max(2, S * 4e-3);
    ctx.strokeStyle = over ? "#ffffff" : "rgba(255,255,255,0.45)";
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, rad);
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.font = "800 ".concat(h * 0.42, "px system-ui, -apple-system, sans-serif");
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x + w / 2, y + h / 2 + h * 0.02);
    ctx.restore();
    if (k === 1) {
      sfx.press();
      action();
    }
  }
  function handleClicksAndKeys() {
    if (clickAt) {
      for (const b of buttons) if (clickAt.x > b.r.x && clickAt.x < b.r.x + b.r.w && clickAt.y > b.r.y && clickAt.y < b.r.y + b.r.h) {
        audioInit();
        sfx.press();
        b.action();
        break;
      }
      clickAt = null;
    }
    if (keyPress) {
      const b = buttons.find((b2) => b2.primary);
      if (b) {
        audioInit();
        sfx.press();
        b.action();
      }
      keyPress = false;
    }
  }
  function sideLines(text, px, maxW, fontOf) {
    const words = String(text).split(/\s+/).filter(Boolean);
    let lines2 = [], mw = 0;
    for (let i = 0; i < 4; i++) {
      ctx.font = fontOf(px);
      lines2 = [];
      let cur = "";
      for (const w of words) {
        const t = cur ? cur + " " + w : w;
        if (cur && ctx.measureText(t).width > maxW) {
          lines2.push(cur);
          cur = w;
        } else cur = t;
      }
      if (cur) lines2.push(cur);
      mw = Math.max(0, ...lines2.map((l) => ctx.measureText(l).width));
      if (mw <= maxW) break;
      px *= maxW / mw * 0.98;
    }
    return { lines: lines2, px, w: Math.min(mw, maxW), h: lines2.length * px * 1.1 };
  }
  function sidePx(w, h) {
    return Math.min(Math.min(w, h) * 0.052, w * 0.042);
  }
  function sideW(w, h, f = 0.22) {
    return Math.max(w * f, Math.min(w, h) * 0.34);
  }
  function txt(s, x, y, size, col = "#fff", align = "center", weight = 800, glow, maxW = W * 0.92) {
    ctx.font = "".concat(weight, " ").concat(size, 'px system-ui, -apple-system, "Segoe UI", sans-serif');
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    const tw = ctx.measureText(s).width;
    if (tw > maxW) {
      size *= maxW / tw;
      ctx.font = "".concat(weight, " ").concat(size, 'px system-ui, -apple-system, "Segoe UI", sans-serif');
    }
    if (glow) {
      ctx.shadowColor = glow;
      ctx.shadowBlur = size * 0.6;
    }
    ctx.fillStyle = col;
    ctx.fillText(s, x, y);
    ctx.shadowBlur = 0;
  }
  function pill(x, y, w, h) {
    ctx.fillStyle = "rgba(8,12,28,0.72)";
    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, h / 2);
    ctx.fill();
    ctx.stroke();
  }
  function panel(x, y, w, h) {
    ctx.save();
    ctx.shadowColor = "rgba(40,120,255,0.35)";
    ctx.shadowBlur = S * 0.06;
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, "rgba(14,22,52,0.88)");
    g.addColorStop(1, "rgba(6,10,26,0.92)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, S * 0.04);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(140,200,255,0.25)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }
  function pictogram(cx, cy, s, t) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const reach = Math.sin(t * 2.2);
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = s * 0.02;
    ctx.strokeRect(-s * 1, -s * 0.62, s * 2, s * 0.95);
    ctx.translate(reach * s * 0.18, 0);
    ctx.strokeStyle = "#9fe8ff";
    ctx.lineWidth = s * 0.07;
    ctx.shadowColor = "#4fd8ff";
    ctx.shadowBlur = s * 0.15;
    ctx.beginPath();
    ctx.arc(0, -s * 0.36, s * 0.08, 0, 7);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.26);
    ctx.lineTo(0, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(-s * 0.12, s * 0.3);
    ctx.moveTo(0, 0);
    ctx.lineTo(s * 0.12, s * 0.3);
    ctx.stroke();
    const hx = s * (0.38 + reach * 0.12), hy = -s * (0.32 + reach * 0.08);
    ctx.beginPath();
    ctx.moveTo(-s * 0.32, -s * 0.36);
    ctx.lineTo(0, -s * 0.2);
    ctx.lineTo(hx, hy);
    ctx.stroke();
    ctx.fillStyle = "#ffd166";
    ctx.shadowColor = "#ffd166";
    ctx.beginPath();
    ctx.arc(hx + s * 0.12, hy - s * 0.02, s * 0.075, 0, 7);
    ctx.fill();
    ctx.restore();
  }
  const tmp = new Vector3(), up = new Vector3(0, 1, 0);
  function placeBone(m, from, to) {
    m.position.copy(from);
    m.quaternion.setFromUnitVectors(up, tmp.subVectors(to, from).normalize());
  }
  const ikDir = new Vector3(), ikPole = new Vector3(), ikE = new Vector3(), ikW = new Vector3();
  function placeArm(arm, S2, T, pole, rec) {
    ikDir.subVectors(T, S2);
    const dist = ikDir.length();
    ikDir.divideScalar(dist || 1);
    const d = clamp(dist, ARM_B - ARM_A + 0.02, ARM_MAX * 0.999);
    const cosA = clamp((ARM_A * ARM_A + d * d - ARM_B * ARM_B) / (2 * ARM_A * d), -1, 1), along = ARM_A * cosA, h = ARM_A * Math.sqrt(1 - cosA * cosA);
    ikPole.copy(pole).addScaledVector(ikDir, -pole.dot(ikDir));
    if (ikPole.lengthSq() < 1e-6) ikPole.set(0, 0, 1);
    ikPole.normalize();
    ikE.copy(S2).addScaledVector(ikDir, along).addScaledVector(ikPole, h);
    ikW.copy(S2).addScaledVector(ikDir, d);
    placeBone(arm.u, S2, ikE);
    placeBone(arm.f, ikE, ikW);
    if (rec) {
      rec.reach = +S2.distanceTo(ikW).toFixed(4);
      rec.bones = +(S2.distanceTo(ikE) + ikE.distanceTo(ikW)).toFixed(4);
      rec.gap = +ikW.distanceTo(T).toFixed(4);
    }
  }
  const pose = { x: 0, y: HIP, th: 0 }, armW = { left: 0.6, right: 0.6 };
  let diveK = 0, idleLead = "right", kneeMax = 0.4;
  function shoulderOf(p, sx, out) {
    const c = Math.cos(p.th), s = Math.sin(p.th), lx = sx * SHO_X;
    out.x = p.x + lx * c - SHO_Y * s;
    out.y = p.y + lx * s + SHO_Y * c;
    return out;
  }
  function solvePose(dt, B, seenL, seenR) {
    const x0 = keeperX, y0 = HIP - keeperCrouch * 0.5, th0 = -B.lean * 0.18, footRest = 0.035 - 0.165 * keeperCrouch;
    const wT = { left: 4e-3, right: 4e-3 }, live = G.state === "play" ? G.active.filter((s2) => s2.phase !== "result") : [];
    if (live.length) for (const s2 of live) {
      const side = s2.twin || (hw.left.distanceTo(s2.end) < hw.right.distanceTo(s2.end) ? "left" : "right");
      wT[side] = 1;
    }
    else {
      const far = (k) => Math.hypot(hw[k].x - x0, hw[k].y - y0 - SHO_Y);
      if (far(idleLead === "left" ? "right" : "left") > far(idleLead) + 0.35 || !(idleLead === "left" ? seenL : seenR)) idleLead = idleLead === "left" ? "right" : "left";
      wT[idleLead] = 1;
    }
    if (!seenL) wT.left = 0;
    if (!seenR) wT.right = 0;
    for (const k of ["left", "right"]) armW[k] += (wT[k] - armW[k]) * Math.min(1, dt * 6);
    let num = 0, den = 0, kMax = 0;
    for (const [k, sx] of [["left", -1], ["right", 1]]) {
      const w = armW[k];
      if (w <= 0.01) continue;
      const dx = hw[k].x - x0, dy = hw[k].y - y0, need = Math.hypot(dx, dy) - (SHO_Y + REACH), kk = clamp(need / 1.3, 0, 1);
      const thS = clamp(-Math.atan2(dx, Math.max(dy, -0.4)), -1.5, 1.5), wk = w * kk * kk * (3 - 2 * kk);
      num += wk * (thS - th0);
      den += wk;
      kMax = Math.max(kMax, wk);
    }
    const realDive = clamp((Math.abs(B.lean || 0) - 0.35) / 0.4, 0, 1), rollMax = 0.32 + 1.2 * realDive;
    const thT = clamp(th0 + num / Math.max(den, 0.5), -rollMax, rollMax);
    pose.th += clamp((thT - pose.th) * (1 - Math.exp(-dt * 16)), -14 * dt, 14 * dt);
    diveK = Math.min(kMax, Math.max(realDive, Math.abs(pose.th) / 1.2));
    pose.dive = realDive;
    kneeMax += ((live.length ? 0.75 : 0.4) - kneeMax) * Math.min(1, dt * 3);
    let cx = 0, cy = 0, cw = 0;
    const sh = { x: 0, y: 0 };
    for (const [k, sx] of [["left", -1], ["right", 1]]) {
      const w = armW[k];
      if (w <= 1e-3) continue;
      shoulderOf({ x: x0, y: y0, th: pose.th }, sx, sh);
      const dx = hw[k].x - sh.x, dy = hw[k].y - sh.y, d = Math.hypot(dx, dy);
      const ex = d > REACH ? 1 - REACH / d : 0;
      cx += w * dx * ex;
      cy += w * dy * ex;
      cw += w;
    }
    const p = pose;
    p.x = x0 + (cw ? cx / cw : 0);
    p.y = Math.min(y0 + (cw ? cy / cw : 0), y0 + (B.jumping ? 0.45 : 0.05) + 1.5 * realDive);
    const c = Math.cos(p.th), s = Math.sin(p.th), wy = (lx, ly) => p.y + lx * s + ly * c;
    const lift = Math.max(0, 0.16 - wy(0, 0), 0.15 - wy(0, 0.78), 0.16 - wy(-SHO_X, SHO_Y), 0.16 - wy(SHO_X, SHO_Y), footRest - kneeMax - wy(-0.12, -HIP), footRest - kneeMax - wy(0.12, -HIP));
    p.y = clamp(p.y + lift, 0.1, 2.4);
    p.x = clamp(p.x, -GOAL_HW - 0.6, GOAL_HW + 0.6);
  }
  const kl = { raw: null, torso: null, base: null };
  let legUpAt = -9;
  function liveLegs() {
    const ri = BP.rawImg, L = kfig.legLift;
    if (!L || !ri || ri === kl.raw) return;
    kl.raw = ri;
    const inside = (k) => ri[k] && ri[k][1] > 0.01 && ri[k][1] < 0.985;
    if (performance.now() - (BP.imgAt || 0) > 300 || !ri.lShoulder || !ri.rShoulder || !ri.lHip || !ri.rHip || !ri.lKnee || !ri.rKnee || !inside("lFoot") || !inside("rFoot")) {
      L.l *= 0.6;
      L.r *= 0.6;
      if (L.l < 0.02) L.l = 0;
      if (L.r < 0.02) L.r = 0;
      return;
    }
    const ar = BP.imgAR || 0.5625, S2 = (k) => [ri[k][0] * ar, ri[k][1]];
    const ls = S2("lShoulder"), rs = S2("rShoulder"), lh = S2("lHip"), rh = S2("rHip"), hp = [(lh[0] + rh[0]) / 2, (lh[1] + rh[1]) / 2];
    const T = Math.hypot((ls[0] + rs[0]) / 2 - hp[0], (ls[1] + rs[1]) / 2 - hp[1]);
    if (T < 0.03) return;
    if (hp[1] - (ls[1] + rs[1]) / 2 < 0.7 * T) {
      L.l *= 0.6;
      L.r *= 0.6;
      if (L.l < 0.02) L.l = 0;
      if (L.r < 0.02) L.r = 0;
      return;
    }
    kl.torso = kl.torso === null ? T : kl.torso + 0.05 * (T - kl.torso);
    const torso = kl.torso, v = {};
    for (const s of ["l", "r"]) {
      v["f" + s] = (S2(s + "Foot")[1] - hp[1]) / torso;
      v["k" + s] = (S2(s + "Knee")[1] - hp[1]) / torso;
    }
    const Bs = kl.base || (kl.base = { fl: v.fl, fr: v.fr, kl: v.kl, kr: v.kr }), up2 = { l: Bs.fl - v.fl, r: Bs.fr - v.fr }, kup = { l: Bs.kl - v.kl, r: Bs.kr - v.kr };
    for (const s of ["l", "r"]) {
      const o = s === "l" ? "r" : "l", rel = up2[s] - up2[o], kr = kup[s] - kup[o];
      const w = kr > 0.15 ? clamp((rel - 0.15) / 0.3, 0, 1) : 0;
      L[s] += (w - L[s]) * (w > L[s] ? 0.6 : 0.35);
      if (L[s] < 0.02) L[s] = 0;
      if (L[s] > 0.3) legUpAt = gameT;
    }
    if (L.l < 0.05 && L.r < 0.05) for (const s of ["l", "r"]) {
      Bs["f" + s] += (Math.abs(v["f" + s] - Bs["f" + s]) < 0.25 ? 0.03 : 0.01) * (v["f" + s] - Bs["f" + s]);
      Bs["k" + s] += (Math.abs(v["k" + s] - Bs["k" + s]) < 0.2 ? 0.03 : 0.01) * (v["k" + s] - Bs["k" + s]);
    }
  }
  function animStriker(s, dt, run, kickK) {
    if (s.npc && s.npc.ready) {
      s.walk += dt * (run ? 11 : 0);
      let A;
      if (kickK > 0) {
        s.kt = 0.6 * kickK;
        A = sample(KICK, s.kt);
      } else if (s.kt !== null && s.kt < 1.7) {
        s.kt += dt * 1.1;
        A = s.kt <= 1 ? sample(KICK, s.kt) : blend(KICK[KICK.length - 1][1], STAND, Math.min(1, (s.kt - 1) / 0.7));
      } else {
        s.kt = null;
        A = run ? sample(RUN, s.walk / (2 * Math.PI)) : STAND;
      }
      s.g.position.set(s.pos.x, 0, s.pos.z);
      npcPose(s, A);
      return;
    }
    s.walk += dt * (run ? 11 : 0);
    const sw = run ? Math.sin(s.walk) * 0.7 : Math.sin(performance.now() / 600 + s.home.x) * 0.06;
    s.legs[0].rotation.x = sw;
    s.legs[1].rotation.x = -sw;
    s.arms[0].rotation.x = -sw * 0.8;
    s.arms[1].rotation.x = sw * 0.8;
    if (kickK > 0) {
      s.legs[1].rotation.x = -Math.sin(kickK * Math.PI) * 1.4;
      s.arms[0].rotation.z = -0.6 * Math.sin(kickK * Math.PI);
    } else s.arms[0].rotation.z = 0;
    s.g.position.set(s.pos.x, run ? Math.abs(Math.sin(s.walk)) * 0.05 : 0, s.pos.z);
  }
  function frame(now) {
    var _a2;
    BP.update(now);
    const dt = Math.min(0.05, (now - (lastT || now)) / 1e3) || 0.016;
    lastT = now;
    const L = BP.hands.left, R = BP.hands.right, B = BP.body;
    if (G.state === "play") {
      gameT = (now - tStart) / 1e3;
      G.timeLeft = Math.max(0, ROUND - gameT);
    }
    const showK = G.state !== "title";
    keeper.visible = showK;
    kShadow.visible = showK;
    arms.forEach((a) => a.visible = showK);
    G.fpsN = (G.fpsN || 0) + 1;
    if (!G._fpsT) G._fpsT = now;
    if (now - G._fpsT > 1e3) {
      G.fps = Math.round(G.fpsN * 1e3 / (now - G._fpsT));
      G._fpsT = now;
      G.fpsN = 0;
      G.fpsMin = Math.min(G.fpsMin || 999, G.fps);
      (G.fpsHist || (G.fpsHist = [])).push(G.fps + ":" + state().quality.tier);
      if (G.fpsHist.length > 120) G.fpsHist.shift();
    }
    const I = BP.img;
    if (!K && G.state === "play" && BP.live && !BP.simulating && !BP.mouse && I && I.lShoulder && performance.now() - (BP.imgAt || 0) < 700) autoK();
    const calib = K && BP.live && !BP.simulating && !BP.mouse && I && I.lShoulder && I.rShoulder && performance.now() - (BP.imgAt || 0) < 700;
    if (calib && performance.now() < (BP._rcUntil || 0)) K.cx += ((I.lShoulder[0] + I.rShoulder[0]) / 2 - K.cx) * (1 - Math.exp(-dt / 0.12));
    if (calib && performance.now() < (BP._rcUntil || 0)) K.cy += ((I.lShoulder[1] + I.rShoulder[1]) / 2 - K.cy) * (1 - Math.exp(-dt / 0.12));
    if (calib && G.state === "play") learnK(I);
    const kxT = clamp(calib ? calX((I.lShoulder[0] + I.rShoulder[0]) / 2) : ((_a2 = B.shoulders) != null ? _a2 : B.x) * KEEP_STEP, -GOAL_HW + 0.4, GOAL_HW - 0.4);
    keeperX += (kxT - keeperX) * Math.min(1, dt * 12);
    keeperCrouch += (B.crouch - keeperCrouch) * Math.min(1, dt * 14);
    const seen = {}, relMode = BP.live && !BP.simulating && !BP.mouse && BP.mirrorPt && BP.mirrorPt("lShoulder") && BP.mirrorPt("rShoulder");
    G.ctl = relMode ? performance.now() - (BP.imgAt || 0) < 700 ? "img" : "3d" : BP.simulating ? "sim" : "screen";
    for (const [side, h, sx] of [["left", L, -1], ["right", R, 1]]) {
      seen[side] = !!(h.seen && (BP.live || BP.mouse));
      const ph = calib && I[side === "left" ? "lHand" : "rHand"];
      if (seen[side] && ph) {
        hw[side].set(clamp(calX(ph[0]), -GOAL_HW - 0.6, GOAL_HW + 0.6), clamp(calY(ph[1]), 0.08, GOAL_H + 0.5), KZ);
        gloves[side].visible = showK;
      } else if (seen[side] && relMode) {
        const shp = BP.mirrorPt(side === "left" ? "lShoulder" : "rShoulder");
        const k = KEEP_TORSO / FIG_TORSO, ox = (h.x - shp[0]) * (W / H) * k, oy = -(h.y - shp[1]) * k;
        hw[side].set(keeperX + sx * SHO_X + ox, clamp(HIP - keeperCrouch * 0.5 + SHO_Y + oy, 0.08, GOAL_H + 0.7), KZ);
        gloves[side].visible = showK;
      } else if (seen[side]) {
        screenToKeeper(h.x, h.y, hw[side]);
        gloves[side].visible = showK;
      } else {
        hw[side].set(keeperX + sx * 0.52, 0.88 - keeperCrouch * 0.5, KZ);
        gloves[side].visible = false;
      }
      gloves[side].position.copy(hw[side]);
    }
    G.kx = +keeperX.toFixed(3);
    G.gl = { l: [+hw.left.x.toFixed(2), +hw.left.y.toFixed(2)], r: [+hw.right.x.toFixed(2), +hw.right.y.toFixed(2)] };
    solvePose(dt, B, seen.left, seen.right);
    G.pose = { x: +pose.x.toFixed(3), y: +pose.y.toFixed(3), th: +pose.th.toFixed(3), dive: +diveK.toFixed(2), w: { ...armW } };
    keeper.position.set(pose.x, pose.y, KZ);
    keeper.rotation.z = pose.th;
    {
      const y0 = HIP - keeperCrouch * 0.5, dyK = pose.y - y0;
      kg.position.set(pose.x, HIPF + (dyK < 0 && !FLAT ? dyK * (pose.dive || 0) : dyK), KZ);
      kg.rotation.z = pose.th;
      kg.updateMatrixWorld(true);
      camLocal.copy(camera.position);
      kg.worldToLocal(camLocal);
      for (const [side, k] of [["left", "l"], ["right", "r"]]) {
        if (seen[side]) {
          const p = kg.worldToLocal(hw[side].clone());
          kfig.reach[k] = [p.x, p.y];
        } else kfig.reach[k] = null;
      }
      liveLegs();
      kfig.enabled = showK;
      kfig.update(now);
      if (kGhost) kGhost.update(now, G.state === "play" && showK && (BP.live || BP.simulating) && !BP.mouse && G.active.every((a) => a.phase === "runup"));
      const figOn = kfig.opacity > 0.3 || kfig.real && !FLAT;
      kBody.visible = !figOn;
      if (kfig.real && figOn) kShadow.visible = false;
      arms.forEach((a) => a.visible = showK && !figOn);
    }
    const legK = 1 - clamp(diveK * 1.5, 0, 1);
    const legC = Math.max(keeperCrouch * legK, clamp((0.915 * Math.cos(pose.th) - pose.y) / 0.5, 0, 1.5));
    kLegs.forEach((l, i) => {
      const c2 = legC, sx = i ? -1 : 1;
      l.scale.y = 1 - c2 * 0.35;
      l.position.y = 0.42 + c2 * 0.2;
      l.rotation.z = sx * (c2 * 0.5 + diveK * 0.22);
      l.rotation.x = (i ? 1 : -1) * diveK * 0.25;
    });
    kShadow.position.x = pose.x;
    kShadow.scale.setScalar(1 + Math.abs(Math.sin(pose.th)) * 0.8);
    kShadow.material.opacity = 0.3 * clamp(1.6 - Math.max(0, pose.y - HIP + keeperCrouch * 0.5) * 1.2, 0.35, 1);
    const c = Math.cos(pose.th), s = Math.sin(pose.th);
    G.arms || (G.arms = { left: {}, right: {} });
    for (const [side, sx, i] of [["left", -1, 0], ["right", 1, 1]]) {
      const sh = shoulderOf(pose, sx, new Vector3());
      sh.z = KZ;
      const pole = new Vector3(sx * 0.7 * c + s, sx * 0.7 * s - c, 0.35);
      const tgt = seen[side] ? hw[side] : new Vector3(sh.x + sx * 0.18 * c + 0.55 * s, sh.y + sx * 0.18 * s - 0.55 * c, KZ + 0.05);
      const rec = G.arms[side];
      rec.seen = seen[side] && showK;
      rec.lead = armW[side] > 0.5;
      placeArm(arms[i], sh, tgt, pole, rec);
    }
    if (G.state === "play") {
      hist.push({ t: gameT, left: L.seen ? hw.left.clone() : null, right: R.seen ? hw.right.clone() : null, kx: keeperX, crouch: keeperCrouch });
      while (hist.length && gameT - hist[0].t > 0.4) hist.shift();
    }
    if (G.state === "play") {
      if (!G.active.length && !ending && gameT >= nextShotAt && !Q.has("noshots")) newShot();
      for (const s2 of G.active.slice()) {
        const st = s2.striker, el = gameT - s2.t0, bm = s2.ball.mesh;
        if (s2.phase === "runup") {
          const k = clamp(el / s2.runT, 0, 1);
          const aim = new Vector3().subVectors(s2.end, s2.start).setY(0).normalize();
          const from = s2.start.clone().addScaledVector(aim, -3.2).add(new Vector3(aim.z, 0, -aim.x).multiplyScalar(1.2));
          const to = s2.start.clone().addScaledVector(aim, -0.35);
          st.pos.lerpVectors(from, to, Math.min(1, k * 1.15));
          st.pos.y = 0;
          st.g.rotation.y = Math.atan2(aim.x, aim.z);
          animStriker(st, dt, k < 0.87, k > 0.8 ? (k - 0.8) / 0.2 : 0);
          if (k >= 1) {
            s2.phase = "flight";
            s2.tf = gameT;
            sfx.kick();
          }
        } else if (s2.phase === "flight") {
          const k = clamp((gameT - s2.tf) / s2.flight, 0, 1);
          shotPos(s2, k, bm.position);
          bm.rotation.x -= dt * 22;
          bm.rotation.y += dt * (6 + s2.curve * 8);
          animStriker(st, dt, false, 0);
          if (k >= 1 && (!s2.low || gameT - s2.tf - s2.flight > 0.12 || judge(s2))) resolveShot(s2);
        } else if (s2.phase === "result") {
          s2.vel.y -= 9.8 * dt;
          bm.position.addScaledVector(s2.vel, dt);
          if (bm.position.y < BALL_R) {
            bm.position.y = BALL_R;
            s2.vel.y = Math.abs(s2.vel.y) * 0.5;
            s2.vel.x *= 0.8;
            s2.vel.z *= 0.8;
          }
          if (s2.res === "goal" && bm.position.z > ND - 0.15) {
            if (!s2.netHit) {
              s2.netHit = gameT;
              netHitAt = gameT;
              netHitP.copy(bm.position);
              netHitK = 1;
            }
            bm.position.z = ND - 0.15;
            s2.vel.z = -Math.abs(s2.vel.z) * 0.15;
            s2.vel.x *= 0.3;
            s2.vel.y *= 0.3;
          }
          if (s2.res === "goal" && Math.abs(bm.position.x) > GOAL_HW - 0.12 && bm.position.z > 0.1) {
            bm.position.x = Math.sign(bm.position.x) * (GOAL_HW - 0.12);
            s2.vel.x *= -0.3;
          }
          bm.rotation.x -= dt * 8;
          if (gameT - s2.tRes > 1.05) {
            bm.visible = false;
            s2.ball.shadow.visible = false;
            s2.ball.busy = false;
            G.active.splice(G.active.indexOf(s2), 1);
            st.home.copy(spots());
            if (!G.active.length) {
              const d = diff();
              nextShotAt = gameT + lerp(0.55, 0.2, d) * (1 + G.assist);
            }
          }
        }
      }
      G.shot = G.active[0] || null;
      if (!tipShown && gameT > 9 && G.saves >= 2 && !G.active.some((s2) => s2.phase === "result")) {
        tipShown = 1;
      }
      if (G.timeLeft <= 0 && !G.active.length) ending = true;
      if (ending && !G.active.length) endRound();
    }
    for (const s2 of strikers) {
      const mine = G.active.find((o) => o.striker === s2);
      if (mine && mine.phase !== "result") continue;
      if (mine && gameT - mine.tRes < 0.95) {
        const k = Math.min(1, (gameT - mine.tRes) * 5), goalPose = mine.res === "goal";
        if (npcPose(s2, blend(STAND, goalPose ? CELEBRATE : GUTTED, k))) {
          s2.g.position.y = goalPose ? Math.abs(Math.sin(gameT * 12)) * 0.25 : 0;
          continue;
        }
        s2.arms[0].rotation.x = s2.arms[1].rotation.x = (goalPose ? -2.9 : -2.5) * k;
        s2.arms[0].rotation.z = (goalPose ? -0.4 : 0.6) * k;
        s2.arms[1].rotation.z = (goalPose ? 0.4 : -0.6) * k;
        s2.legs[0].rotation.x = s2.legs[1].rotation.x = 0;
        s2.g.position.y = goalPose ? Math.abs(Math.sin(gameT * 12)) * 0.25 : 0;
        continue;
      }
      s2.arms[1].rotation.z = 0;
      const d = tmp.subVectors(s2.home, s2.pos);
      d.y = 0;
      const dist = d.length();
      if (dist > 0.1) {
        s2.pos.addScaledVector(d.normalize(), Math.min(dist, dt * 3.2));
        s2.g.rotation.y = Math.atan2(d.x, d.z);
        animStriker(s2, dt, true, 0);
      } else {
        s2.g.rotation.y += (Math.atan2(-s2.pos.x, -s2.pos.z) - s2.g.rotation.y) * Math.min(1, dt * 3);
        animStriker(s2, dt, false, 0);
      }
    }
    for (const b of balls) {
      const sh = G.active.find((o) => o.ball === b), m = b.mesh;
      const tint = sh && sh.twin ? sh.twin === "left" ? 16743129 : 6742271 : sh && sh.power ? 16747066 : 16765562;
      if (m.visible) {
        b.shadow.position.set(m.position.x, 0.015, m.position.z);
        const hk = clamp(1 - m.position.y / 4, 0.2, 1);
        b.shadow.scale.setScalar(0.5 + (1 - hk));
        b.shadow.material.opacity = 0.55 * hk;
        const inFlight = sh && sh.phase === "flight";
        b.glow.material.color.set(tint);
        b.glow.material.opacity = inFlight ? 0.75 : 0.35;
        if (inFlight) b.trailPts.unshift(m.position.clone());
        if (b.trailPts.length > b.trail.length || !inFlight) b.trailPts.pop();
      } else b.trailPts.length = 0;
      b.trail.forEach((sp, i) => {
        const p = b.trailPts[i];
        if (!p) {
          sp.material.opacity = 0;
          return;
        }
        sp.position.copy(p);
        const k = 1 - i / b.trail.length;
        sp.scale.setScalar(0.32 * k + 0.05);
        sp.material.opacity = 0.45 * k;
        sp.material.color.set(tint);
      });
      if (sh && sh.phase !== "result" && G.state === "play") {
        const vis = sh.phase === "runup" ? clamp((gameT - sh.t0) / sh.runT * 2 - 0.5, 0, 1) : 1;
        b.aim.position.x = sh.end.x;
        b.aim.material.opacity = 0.7 * vis;
        b.aim.material.color.set(sh.twin ? tint : sh.low ? 16755251 : 16768341);
        b.aim.scale.setScalar(0.8 + 0.3 * Math.sin(now / 120));
      } else b.aim.material.opacity *= 0.85;
    }
    for (let i = 0; i < SPARKS; i++) {
      if (spLife[i] <= 0) {
        spPos[i * 3 + 1] = -50;
        continue;
      }
      spLife[i] -= dt;
      spVel[i].y -= 6 * dt;
      spPos[i * 3] += spVel[i].x * dt;
      spPos[i * 3 + 1] += spVel[i].y * dt;
      spPos[i * 3 + 2] += spVel[i].z * dt;
    }
    spGeo.attributes.position.needsUpdate = true;
    crowdJump = Math.max(0, crowdJump - dt * 0.6);
    if (crowdGain) crowdGain.gain.setTargetAtTime((0.04 + (G.state === "play" ? 0.02 : 0) + crowdJump * 0.05) * CROWD_K, AC.currentTime, 0.3);
    rippleNets(gameT);
    shake = Math.max(0, shake - dt * 1.4);
    flash = Math.max(0, flash - dt * 1.6);
    const tt = now / 1e3;
    if (G.state === "title") {
      camera.position.set(Math.sin(tt * 0.25) * 1.2, 1.6 + Math.sin(tt * 0.31) * 0.1, CAM.z + 0.4);
    } else camera.position.set(CAM.x + keeperX * 0.12 + (Math.random() - 0.5) * shake * 0.15, CAM.y + (Math.random() - 0.5) * shake * 0.1, CAM.z);
    camera.lookAt(LOOK.x + keeperX * 0.08, LOOK.y, LOOK.z);
    if (Q.has("locktier")) state().quality.t0 = performance.now();
    render(dt);
    G.quality = state().quality;
    if (!Q.has("nohud")) drawHUD(now, dt);
    requestAnimationFrame(frame);
  }
  let hudRects = [];
  function liveTips() {
    if (!BP.tip || G.state !== "play") return;
    const up2 = G.active.filter((s) => s.phase !== "result");
    if (up2.some((s) => s.twin)) BP.tip("twin", "Twin shot: one hand on each ball, save both for +300", 1200, { hot: true });
    else if (up2.some((s) => s.power)) BP.tip("power", "Power shot: it flies faster, save it for +50 more", 1200, { hot: true });
    if (G.streak >= 1 && G.streak <= 10) BP.tip("streak", "Streak: next save in a row scores +".concat(Math.min(10, G.streak) * 25, " more, a goal resets it"), 1200);
  }
  function drawHUD(now, dt) {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);
    G._frame = (G._frame || 0) + 1;
    buttons = [];
    if (flash > 0) {
      ctx.fillStyle = "rgba(".concat(flashCol, ",").concat(flash * 0.35, ")");
      ctx.fillRect(0, 0, W, H);
    }
    if (G.state === "play") {
      G.targets = [];
      for (const s of G.active) {
        if (s.phase === "result") continue;
        const vis = s.phase === "runup" ? clamp((gameT - s.t0) / s.runT * 2 - 0.4, 0, 1) : 1;
        const p = toScreen(s.end), e1 = toScreen(tmp.set(s.end.x + 0.85, s.end.y, KZ));
        const rx = Math.abs(e1.x - p.x) * W * 0.62, cx = p.x * W, cy = p.y * H;
        const prog = s.phase === "flight" ? clamp((gameT - s.tf) / s.flight, 0, 1) : 0;
        G.targets.push({ x: p.x, y: p.y, low: s.low, twin: s.twin, arriveIn: s.phase === "flight" ? (1 - prog) * s.flight : s.runT - (gameT - s.t0) + s.flight, wx: s.end.x, wy: s.end.y });
        ctx.save();
        ctx.globalAlpha = vis;
        const col = s.twin ? s.twin === "left" ? "255,122,217" : "102,224,255" : s.low ? "255,170,51" : s.power ? "255,120,60" : "255,221,85";
        ctx.shadowColor = "rgba(".concat(col, ",0.8)");
        ctx.shadowBlur = S * 0.02;
        ctx.strokeStyle = "rgba(".concat(col, ",0.95)");
        ctx.lineWidth = Math.max(3, S * 7e-3);
        ctx.setLineDash([S * 0.02, S * 0.014]);
        ctx.lineDashOffset = -now / 30;
        ctx.beginPath();
        ctx.arc(cx, cy, rx, 0, 7);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(".concat(col, ",").concat(0.12 + prog * 0.28, ")");
        ctx.beginPath();
        ctx.arc(cx, cy, rx * (0.25 + 0.75 * prog), 0, 7);
        ctx.fill();
        ctx.strokeStyle = "rgba(".concat(col, ",0.95)");
        ctx.lineWidth = Math.max(2, S * 4e-3);
        ctx.beginPath();
        ctx.moveTo(cx - rx * 0.25, cy);
        ctx.lineTo(cx + rx * 0.25, cy);
        ctx.moveTo(cx, cy - rx * 0.25);
        ctx.lineTo(cx, cy + rx * 0.25);
        ctx.stroke();
        if (s.low) {
          txt("SQUAT or KICK!", cx, cy - rx - S * 0.04, S * 0.045, "#ffbb55", "center", 900, "#ff9a22");
          ctx.fillStyle = "#ffbb55";
          const ay = cy - rx - S * 5e-3;
          ctx.beginPath();
          ctx.moveTo(cx - S * 0.02, ay - S * 0.012);
          ctx.lineTo(cx + S * 0.02, ay - S * 0.012);
          ctx.lineTo(cx, ay + S * 8e-3);
          ctx.fill();
        }
        if (s.twin) txt(s.twin === "left" ? "LEFT HAND" : "RIGHT HAND", cx, cy - rx - S * 0.035, S * 0.034, s.twin === "left" ? "#ff9ae6" : "#8feaff", "center", 900, "rgba(".concat(col, ",0.9)"));
        else if (s.power && s.phase === "runup") txt("POWER SHOT", cx, cy - rx - S * 0.035, S * 0.04, "#ff9a5a", "center", 900, "#ff6a22");
        ctx.restore();
      }
      G.target = G.targets[0] || null;
      const row = BP.uiRow(), gap = Math.max(8, S * 0.015), ph = clamp(S * 0.1, 40, 96), top0 = row.bottom - Math.max(38, S * 0.058);
      const tl = Math.ceil(G.timeLeft), low = G.timeLeft < 10, tStr = "".concat(Math.floor(tl / 60), ":").concat(String(tl % 60).padStart(2, "0"));
      ctx.font = "900 ".concat(ph * 0.6, 'px system-ui, -apple-system, "Segoe UI", sans-serif');
      const sw = Math.max(ctx.measureText("0000").width, ctx.measureText(String(G.score)).width);
      ctx.font = "800 ".concat(ph * 0.44, 'px system-ui, -apple-system, "Segoe UI", sans-serif');
      const tw = ctx.measureText("0:00").width;
      const pw = tw + sw + ph * 1.5, px = W / 2 - pw / 2, py = Math.max(top0, BP.uiBelow(px));
      pill(px, py, pw, ph);
      hudRects = [{ x: px, y: py, w: pw, h: ph }];
      txt(tStr, px + ph * 0.5 + tw / 2, py + ph / 2, ph * 0.44, low ? "#ff8a8a" : "#cfe8ff", "center", 800);
      txt(String(G.score), px + pw - ph * 0.5 - sw / 2, py + ph / 2, ph * 0.6, "#fff", "center", 900, "#3fb8ff");
      if (G.streak >= 2) {
        const sh = ph * 0.7, label = "".concat(G.streak, " IN A ROW");
        ctx.font = "800 ".concat(sh * 0.42, 'px system-ui, -apple-system, "Segoe UI", sans-serif');
        const sw2 = ctx.measureText(label).width + sh * 0.9;
        let sx = W - gap - sw2, sy = top0;
        const mb = document.getElementById("bp-music"), mr = mb && getComputedStyle(mb).display !== "none" ? mb.getBoundingClientRect() : null;
        if (mr && mr.width && sy < mr.bottom + gap && sx + sw2 > mr.left - gap) sx = mr.left - gap - sw2;
        if (sx < px + pw + gap) {
          sx = W - gap - sw2;
          sy = Math.max(py + ph + gap, mr && mr.width ? mr.bottom + gap : 0);
        }
        pill(sx, sy, sw2, sh);
        hudRects.push({ x: sx, y: sy, w: sw2, h: sh });
        txt(label, sx + sw2 / 2, sy + sh / 2, sh * 0.42, G.streak >= 5 ? "#e2ccff" : "#bff6ff", "center", 800);
      }
    }
    for (let i = hudParts.length - 1; i >= 0; i--) {
      const p = hudParts[i];
      p.life -= dt;
      if (p.life <= 0) {
        hudParts.splice(i, 1);
        continue;
      }
      p.vy += S * 1.6 * dt;
      p.vx *= 1 - dt * 1.5;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.min(1, p.life * 2);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.r, -p.r * 0.45, p.r * 2, p.r * 0.9);
      ctx.restore();
    }
    for (let i = popups.length - 1; i >= 0; i--) {
      const p = popups[i];
      p.t += dt;
      if (p.t > 1.5) {
        popups.splice(i, 1);
        continue;
      }
      const k = p.t < 0.15 ? p.t / 0.15 : 1, a = p.t > 1.1 ? 1 - (p.t - 1.1) / 0.4 : 1, sc = (0.7 + 0.3 * k) * p.big;
      ctx.save();
      ctx.globalAlpha = Math.max(0, a);
      const x0 = W * 0.025;
      const L = sideLines(p.text, sidePx(W, H) * (0.75 + 0.25 * k), sideW(W, H, 0.22), (px) => "900 ".concat(px, 'px system-ui, -apple-system, "Segoe UI", sans-serif'));
      const pr = G.state === "play" && hudRects[0], y = (pr && x0 + L.w > pr.x ? Math.max(H * 0.19, pr.y + pr.h + L.px * 0.8) : H * 0.19) - p.t * S * 0.03;
      if (G.state === "play") hudRects.push({ x: x0, y: y - L.px * 0.6, w: L.w, h: L.h });
      {
        const pad = L.px * 0.32;
        ctx.fillStyle = "rgba(8,12,28,0.62)";
        ctx.beginPath();
        ctx.roundRect(x0 - pad, y - L.px * 0.62 - pad * 0.5, L.w + pad * 2, L.h + pad, L.px * 0.35);
        ctx.fill();
      }
      L.lines.forEach((l, j) => {
        const ly = y + j * L.px * 1.1;
        ctx.font = "900 ".concat(L.px, 'px system-ui, -apple-system, "Segoe UI", sans-serif');
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.lineJoin = "round";
        ctx.lineWidth = Math.max(2, L.px * 0.14);
        ctx.strokeStyle = "rgba(4,8,20,0.9)";
        ctx.strokeText(l, x0, ly);
        txt(l, x0, ly, L.px, p.col || "#fff", "left", 900, "rgba(0,0,0,0.55)");
      });
      if (false) {
        ctx.shadowColor = "rgba(0,0,0,0.9)";
        ctx.shadowBlur = S * 0.02;
        txt(p.sub, W / 2, y + S * 0.1 * sc, S * 0.045, p.col, "center", 800);
        ctx.shadowBlur = 0;
      }
      ctx.restore();
    }
    if (G.state === "title") drawTitle(now);
    if (G.state === "end") drawEnd(now);
    handleClicksAndKeys();
    BP.drawHands(ctx, W, H);
  }
  function drawTitle(now) {
    const bh = clamp(S * 0.14, 50, 140), bw = Math.min(W * 0.8, Math.max(bh * 4, S * 0.42)), by = H * 0.72 + Math.max(0, (H * 0.86 - H * 0.72 - bh) / 2);
    button("start", "START", W / 2 - bw / 2, by, bw, bh, now, true, () => startRound(performance.now()));
    const best = BP.best(GAME_ID);
    if (Q.has("tv") && !G._tvAt) G._tvAt = now + 2e3;
    if (G._tvAt && now > G._tvAt) {
      G._tvAt = 0;
      startRound(now);
    }
    G._prevBest = best;
  }
  function drawEnd(now) {
    const E = BP.layout.end(W, H, { cy: H * 0.7 });
    const row = BP.uiRow(), top = Math.max(row.bottom + 12, H * 0.14), room = E.again.y - Math.max(12, S * 0.03) - top;
    const pw = Math.min(W * 0.9, S * 1.05), ph = Math.min(room, S * 0.6), px = W / 2 - pw / 2, py = top + (room - ph) / 2;
    panel(px, py, pw, ph);
    BP.uiCover = { x: px, y: py, w: pw, h: ph };
    const k = clamp((now - endAt) / 100, 0, 1), shown = Math.round(G.score * (1 - Math.pow(1 - k, 3)));
    txt("YOUR SCORE", W / 2, py + ph * 0.19, Math.min(Math.max(16, S * 0.04), ph * 0.12), "rgba(200,225,255,0.75)", "center", 800, null, pw * 0.9);
    txt(String(shown), W / 2, py + ph * 0.52, Math.min(S * 0.16, ph * 0.34), "#fff", "center", 900, "#2f9bff", pw * 0.9);
    txt(G.newBest ? "New best!" : "Best ".concat(G.best), W / 2, py + ph * 0.83, Math.min(Math.max(16, S * 0.045), ph * 0.12), G.newBest ? "#ffd166" : "rgba(255,255,255,0.75)", "center", 800, null, pw * 0.9);
    const showButtons = now - endAt > 100;
    if (showButtons) {
      const a = E.again, h = E.home;
      button("again", "PLAY AGAIN", a.x, a.y, a.w, a.h, now, true, () => startRound(performance.now()), 1e3);
      button("home2", "HOME", h.x, h.y, h.w, h.h, now, false, goHome, BP.LEAVE_MS || 1400);
    }
  }
  addEventListener("error", (e) => G.errors.push(String(e.message)));
  for (const b of balls) b.mesh.visible = true;
  renderer.compile(scene, camera);
  render(0.016);
  for (const b of balls) b.mesh.visible = false;
  (_b = (_a = state()).grace) == null ? void 0 : _b.call(_a, 1500);
  window.__dbg = { THREE: three_module_exports, scene, renderer, camera, goal, nets, RK: realism_exports, sun: sun2 };
  document.getElementById("loading").remove();
  BP.start();
  requestAnimationFrame(frame);
})().catch((e) => setTimeout(() => {
  throw e;
}));
