import {
  ShaderPass
} from "./chunk-UBB4M7UR.js";
import {
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  CapsuleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Euler,
  ExtrudeGeometry,
  Group,
  HemisphereLight,
  LatheGeometry,
  Line,
  LineDashedMaterial,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  Quaternion,
  Raycaster,
  RepeatWrapping,
  Shape,
  SphereGeometry,
  SpotLight,
  TorusGeometry,
  Vector2,
  Vector3
} from "./chunk-4IYDSAYK.js";
import "./chunk-NWIHTO7D.js";

// bmpage:bmpage:pingpong.html#0
(async () => {
  const FROM_PHONE = location.port === "8080", ONLINE = location.pathname.startsWith("/play/");
  if (new URLSearchParams(location.search).get("room")) localStorage.bp_room = new URLSearchParams(location.search).get("room").toUpperCase();
  const BODY_WS = FROM_PHONE ? "ws://".concat(location.hostname, ":8081") : ONLINE ? "".concat(location.protocol === "https:" ? "wss" : "ws", "://").concat(location.host, "/play/relay?room=").concat(localStorage.bp_room || "", "&role=tv") : "ws://localhost:8794";
  const TABLE_L = 2.74, TABLE_W = 1.525, TABLE_Y = 0.76, NET_H = 0.1525, BALL_R = 0.02;
  const HALF_L = TABLE_L / 2, HALF_W = TABLE_W / 2;
  const G = 9.8;
  const LEVELS = {
    easy: { time: 0.48, aiSpeed: 1.5, aiMiss: 0.22, aiPace: [3.6, 4.6] },
    normal: { time: 0.6, aiSpeed: 2.3, aiMiss: 0.12, aiPace: [4.2, 5.6] },
    pro: { time: 0.8, aiSpeed: 3.4, aiMiss: 0.05, aiPace: [5, 7] }
  };
  let level = "normal";
  const Q = new URLSearchParams(location.search);
  const Realism = await import(new URL(window.BP_DIR + "realism.js", location.href).href);
  const ASSET = window.BP_DIR + "assets/";
  const glCanvas = document.createElement("canvas");
  glCanvas.id = "gl";
  document.body.prepend(glCanvas);
  const RZ = Realism.setup(glCanvas, { fov: 55, near: 0.05, far: 70, tier: Q.has("tier") ? +Q.get("tier") : void 0 });
  const { renderer, scene, camera } = RZ;
  renderer.toneMappingExposure = 1;
  const BG_ROT = Q.has("rot") ? +Q.get("rot") : 2.25, SKY_ROT = 0, SKY_GAIN = 0.85;
  Realism.environment(scene, renderer, "school_hall", { background: true, exact: true, intensity: 0.85, rotation: BG_ROT, skyRotation: Q.has("sky") ? +Q.get("sky") : SKY_ROT }).then(() => {
    const sky = RZ.sky;
    if (sky) {
      sky.material.color.setScalar(SKY_GAIN);
    }
    RZ.grace(2500);
  }).catch(() => {
    scene.background = new Color(1380878);
  });
  const FINISH = {
    uniforms: { tDiffuse: { value: null } },
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader: "uniform sampler2D tDiffuse; varying vec2 vUv;\n    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }\n    void main(){ vec4 c = texture2D(tDiffuse, vUv); vec2 d = vUv - 0.5; d.x *= 1.2;\n      c.rgb *= mix(0.7, 1.0, smoothstep(0.85, 0.3, length(d))); c.rgb += (h(vUv * 977.0) - 0.5) * 0.014; gl_FragColor = c; }"
  };
  const CAM_BASE = new Vector3(0, 1.32, 2.45);
  camera.position.copy(CAM_BASE);
  camera.lookAt(0, 0.82, -0.6);
  scene.add(new HemisphereLight(16774374, 7031338, 0.35));
  const spot = new SpotLight(16774114, 34, 14, Math.PI / 3.6, 0.95, 1.6);
  spot.position.set(0.3, 4.6, 0.2);
  spot.target.position.set(0, TABLE_Y, 0);
  spot.castShadow = true;
  spot.shadow.mapSize.set(2048, 2048);
  spot.shadow.bias = -2e-4;
  spot.shadow.normalBias = 0.02;
  spot.shadow.radius = 5;
  scene.add(spot, spot.target);
  const fill = new DirectionalLight(16771536, 0.25);
  fill.position.set(-3, 5, 6);
  scene.add(fill);
  const COURT = { x: 3.7, zFar: -6.2, zNear: 6.5 };
  const floorMat = Realism.pbr("wood_floor", { repeat: [5, 9], roughness: 0.45, color: 13807238, envMapIntensity: 0.6 });
  const floor = new Mesh(new PlaneGeometry(COURT.x * 2 + 0.6, COURT.zNear - COURT.zFar + 0.6), floorMat);
  floor.geometry.setAttribute("uv1", floor.geometry.attributes.uv);
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = (COURT.zNear + COURT.zFar) / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  const fabric = Realism.pbr("polar_fleece", { repeat: [3, 1.2], roughness: 0.95, color: 1911893, normalScale: 0.3 });
  fabric.map = null;
  fabric.needsUpdate = true;
  const darkSteel = new MeshStandardMaterial({ color: 2303275, metalness: 0.75, roughness: 0.42 });
  const trimMat = new MeshStandardMaterial({ color: 15263978, roughness: 0.6 });
  function barrier(x, z, ry) {
    const g = new Group();
    g.position.set(x, 0, z);
    g.rotation.y = ry;
    const panel = new Mesh(new BoxGeometry(1.96, 0.7, 0.03), fabric);
    panel.position.y = 0.39;
    panel.castShadow = panel.receiveShadow = true;
    g.add(panel);
    const frameTop = new Mesh(new BoxGeometry(1.98, 0.025, 0.035), darkSteel);
    frameTop.position.y = 0.745;
    g.add(frameTop);
    const frameBot = new Mesh(new BoxGeometry(1.98, 0.025, 0.035), darkSteel);
    frameBot.position.y = 0.035;
    g.add(frameBot);
    const stripe2 = new Mesh(new BoxGeometry(1.96, 0.02, 0.032), trimMat);
    stripe2.position.y = 0.66;
    g.add(stripe2);
    for (const s of [-1, 1]) {
      const foot = new Mesh(new BoxGeometry(0.03, 0.02, 0.36), darkSteel);
      foot.position.set(s * 0.9, 0.01, 0);
      foot.castShadow = true;
      g.add(foot);
    }
    scene.add(g);
    return g;
  }
  for (let x = -COURT.x + 1; x <= COURT.x - 0.9; x += 2.02) barrier(x, COURT.zFar, 0);
  for (const s of [-1, 1]) for (let z = COURT.zFar + 1.05; z < COURT.zNear; z += 2.02) barrier(s * COURT.x, z, Math.PI / 2);
  {
    const box = new Mesh(new BoxGeometry(0.3, 0.4, 0.3), new MeshStandardMaterial({ color: 2764084, roughness: 0.7 }));
    box.position.set(-2.9, 0.2, -2.6);
    box.castShadow = box.receiveShadow = true;
    scene.add(box);
    const towel = new Mesh(new BoxGeometry(0.28, 0.04, 0.2), new MeshStandardMaterial({ color: 15921902, roughness: 0.95 }));
    towel.position.set(-2.9, 0.42, -2.6);
    towel.rotation.y = 0.2;
    towel.castShadow = true;
    scene.add(towel);
  }
  const table = new Group();
  scene.add(table);
  const topMat = new MeshPhysicalMaterial({ color: 928341, roughness: 0.62, metalness: 0, clearcoat: 0.12, clearcoatRoughness: 0.5, envMapIntensity: 0.55 });
  const top = new Mesh(new BoxGeometry(TABLE_W, 0.025, TABLE_L), topMat);
  top.position.y = TABLE_Y - 0.0125;
  top.castShadow = true;
  top.receiveShadow = true;
  table.add(top);
  const lineMat = new MeshStandardMaterial({ color: 15132386, roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -2 });
  const line = (w, l, x, z) => {
    const m = new Mesh(new PlaneGeometry(w, l), lineMat);
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, TABLE_Y + 6e-4, z);
    m.receiveShadow = true;
    table.add(m);
  };
  line(0.02, TABLE_L, -HALF_W + 0.01, 0);
  line(0.02, TABLE_L, HALF_W - 0.01, 0);
  line(TABLE_W, 0.02, 0, -HALF_L + 0.01);
  line(TABLE_W, 0.02, 0, HALF_L - 0.01);
  line(3e-3, TABLE_L, 0, 0);
  for (const sx of [-1, 1]) {
    const e = new Mesh(new BoxGeometry(4e-3, 0.025, TABLE_L), lineMat);
    e.position.set(sx * (HALF_W + 2e-3), TABLE_Y - 0.0125, 0);
    table.add(e);
  }
  for (const sz of [-1, 1]) {
    const e = new Mesh(new BoxGeometry(TABLE_W, 0.025, 4e-3), lineMat);
    e.position.set(0, TABLE_Y - 0.0125, sz * (HALF_L + 2e-3));
    table.add(e);
  }
  const legMat = new MeshStandardMaterial({ color: 1776930, metalness: 0.7, roughness: 0.38 });
  const apron = (w, d, x, z) => {
    const m = new Mesh(new BoxGeometry(w, 0.05, d), legMat);
    m.position.set(x, TABLE_Y - 0.05, z);
    m.castShadow = true;
    table.add(m);
  };
  for (const sx of [-1, 1]) apron(0.04, TABLE_L - 0.2, sx * (HALF_W - 0.12), 0);
  for (const sz of [-1, 1]) for (const zz of [0.12, HALF_L - 0.2]) apron(TABLE_W - 0.24, 0.04, 0, sz * zz);
  for (const sz of [-1, 1]) {
    for (const sx of [-1, 1]) {
      const leg = new Mesh(new BoxGeometry(0.05, TABLE_Y - 0.1, 0.05), legMat);
      leg.position.set(sx * (HALF_W - 0.22), (TABLE_Y - 0.1) / 2 + 0.06, sz * (HALF_L - 0.45));
      leg.castShadow = true;
      table.add(leg);
      const brace = new Mesh(new CylinderGeometry(0.012, 0.012, 1, 8), legMat);
      brace.position.set(sx * (HALF_W - 0.22), 0.42, sz * (HALF_L - 0.82));
      brace.rotation.x = sz * 0.95;
      brace.castShadow = true;
      table.add(brace);
      for (const dz of [-0.09, 0.09]) {
        const w = new Mesh(new CylinderGeometry(0.035, 0.035, 0.03, 16), new MeshStandardMaterial({ color: 855311, roughness: 0.6 }));
        w.rotation.z = Math.PI / 2;
        w.position.set(sx * (HALF_W - 0.22), 0.035, sz * (HALF_L - 0.45) + dz);
        w.castShadow = true;
        table.add(w);
      }
    }
    const bar = new Mesh(new BoxGeometry(TABLE_W - 0.44, 0.045, 0.045), legMat);
    bar.position.set(0, 0.085, sz * (HALF_L - 0.45));
    bar.castShadow = true;
    table.add(bar);
  }
  const netTex = (() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 64;
    const g = c.getContext("2d");
    g.clearRect(0, 0, 512, 64);
    g.strokeStyle = "rgba(255,255,255,1)";
    g.lineWidth = 1.6;
    for (let x = 0; x <= 512; x += 8) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, 64);
      g.stroke();
    }
    for (let y = 0; y <= 64; y += 8) {
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(512, y);
      g.stroke();
    }
    const t = new CanvasTexture(c);
    t.wrapS = t.wrapT = RepeatWrapping;
    t.repeat.set(4, 1);
    t.anisotropy = 8;
    return t;
  })();
  const netMat = new MeshStandardMaterial({ color: 990266, alphaMap: netTex, transparent: true, alphaTest: 0.35, side: DoubleSide, roughness: 0.9 });
  const net = new Mesh(new PlaneGeometry(TABLE_W + 0.3, NET_H), netMat);
  net.position.set(0, TABLE_Y + NET_H / 2, 0);
  net.castShadow = true;
  table.add(net);
  const netBand = new Mesh(new BoxGeometry(TABLE_W + 0.3, 8e-3, 4e-3), new MeshStandardMaterial({ color: 990266, roughness: 0.8 }));
  netBand.position.set(0, TABLE_Y + 6e-3, 0);
  table.add(netBand);
  const tape = new Mesh(new BoxGeometry(TABLE_W + 0.3, 0.015, 7e-3), new MeshStandardMaterial({ color: 16185076, roughness: 0.7 }));
  tape.position.set(0, TABLE_Y + NET_H, 0);
  tape.castShadow = true;
  table.add(tape);
  for (const sx of [-1, 1]) {
    const post = new Mesh(new CylinderGeometry(9e-3, 9e-3, NET_H + 0.02, 12), legMat);
    post.position.set(sx * (HALF_W + 0.15), TABLE_Y + NET_H / 2, 0);
    post.castShadow = true;
    table.add(post);
    const arm = new Mesh(new BoxGeometry(0.15, 0.018, 0.03), legMat);
    arm.position.set(sx * (HALF_W + 0.075), TABLE_Y + 0.012, 0);
    arm.castShadow = true;
    table.add(arm);
    const clamp = new Mesh(new BoxGeometry(0.05, 0.06, 0.05), legMat);
    clamp.position.set(sx * (HALF_W - 5e-3), TABLE_Y - 0.02, 0);
    table.add(clamp);
  }
  const pimpleTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d");
    g.fillStyle = "#8080ff";
    g.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y += 8) for (let x = y / 8 % 2 ? 4 : 0; x < 256; x += 8) {
      const gr = g.createRadialGradient(x, y, 0, x, y, 3.2);
      gr.addColorStop(0, "#8080ff");
      gr.addColorStop(0.7, "#a8a8ff");
      gr.addColorStop(1, "#8080ff");
      g.fillStyle = gr;
      g.fillRect(x - 4, y - 4, 8, 8);
    }
    const t = new CanvasTexture(c);
    t.wrapS = t.wrapT = RepeatWrapping;
    t.repeat.set(3, 3);
    return t;
  })();
  const bladeWood = Realism.pbr("oak_veneer_01", { repeat: [0.4, 0.4], roughness: 0.55, color: 14727562 });
  const handleWood = Realism.pbr("oak_veneer_01", { repeat: [0.2, 0.6], roughness: 0.45, color: 13146726 });
  const bladeShape = (() => {
    const s = new Shape();
    s.absellipse(0, 0, 0.076, 0.08, 0, Math.PI * 2, false, 0);
    return s;
  })();
  const handleGeo = (() => {
    const pts = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      pts.push(new Vector2(0.013 + 6e-3 * Math.pow(t, 2.2) + 2e-3 * Math.sin(t * Math.PI), t * 0.1));
    }
    const g = new LatheGeometry(pts, 20);
    g.scale(1, 1, 0.72);
    g.rotateX(Math.PI / 2);
    g.translate(0, 0, 0.065);
    return g;
  })();
  function makePaddle(rubber) {
    const g = new Group();
    const rub = (col, y) => {
      const m = new Mesh(
        new ExtrudeGeometry(bladeShape, { depth: 21e-4, bevelEnabled: true, bevelThickness: 4e-4, bevelSize: 6e-4, bevelSegments: 2, curveSegments: 48 }),
        new MeshPhysicalMaterial({ color: col, roughness: 0.62, normalMap: pimpleTex, normalScale: new Vector2(0.35, 0.35), sheen: 0.4, sheenRoughness: 0.6, sheenColor: new Color(col).multiplyScalar(0.6) })
      );
      m.rotation.x = -Math.PI / 2;
      m.position.y = y;
      m.scale.set(0.985, 0.985, 1);
      return m;
    };
    const face = rub(rubber, 3e-3);
    g.add(face);
    const back = rub(1184276, -52e-4);
    g.add(back);
    const wood = new Mesh(new ExtrudeGeometry(bladeShape, { depth: 58e-4, bevelEnabled: false, curveSegments: 48 }), bladeWood);
    wood.rotation.x = -Math.PI / 2;
    wood.position.y = -29e-4;
    g.add(wood);
    const handle = new Mesh(handleGeo, handleWood);
    g.add(handle);
    const flare = new Mesh(new BoxGeometry(0.03, 0.012, 0.02), handleWood);
    flare.position.z = 0.072;
    g.add(flare);
    g.traverse((m) => {
      if (m.isMesh) m.castShadow = true;
    });
    const holder = new Group();
    holder.add(g);
    holder.blade = g;
    return holder;
  }
  const myPaddle = makePaddle(13111838);
  scene.add(myPaddle);
  myPaddle.traverse((m) => {
    if (m.isMesh) {
      m.material = m.material.clone();
      m.material.transparent = true;
      m.material.opacity = 0.5;
      m.material.depthWrite = false;
      m.castShadow = true;
    }
  });
  const oppPaddle = makePaddle(13111838);
  scene.add(oppPaddle);
  const opp = new Group();
  scene.add(opp);
  const shirt = new MeshStandardMaterial({ color: 1929144, roughness: 0.82, normalMap: fabric.normalMap, normalScale: new Vector2(0.35, 0.35) });
  const skin = new MeshPhysicalMaterial({ color: 11037004, roughness: 0.66, sheen: 0.25, sheenRoughness: 0.7, sheenColor: new Color(8007200) });
  const shorts = new MeshStandardMaterial({ color: 1382173, roughness: 0.78, normalMap: fabric.normalMap, normalScale: new Vector2(0.3, 0.3) });
  const shoe = new MeshStandardMaterial({ color: 15790318, roughness: 0.55 }), sole = new MeshStandardMaterial({ color: 2829102, roughness: 0.8 });
  const hairM = new MeshStandardMaterial({ color: 2364942, roughness: 0.75, normalMap: fabric.normalMap, normalScale: new Vector2(0.8, 0.8) });
  const sock = new MeshStandardMaterial({ color: 16053490, roughness: 0.9 });
  function limbGeo(r0, r1, belly = 0, at = 0.35, seg = 18) {
    const pts = [], N = 16;
    for (let i = 0; i <= N; i++) {
      const t = i / N, cap = Math.min(t, 1 - t), r = (r0 + (r1 - r0) * t) * (1 + belly * Math.exp(-Math.pow((t - at) / 0.22, 2))) * (cap < 0.08 ? 0.55 + 0.45 * Math.sqrt(cap / 0.08) : 1);
      pts.push(new Vector2(i === 0 || i === N ? 1e-4 : r, t - 0.5));
    }
    return new LatheGeometry(pts, seg);
  }
  const limb = (geo, mat) => {
    const m = new Mesh(geo, mat);
    m.castShadow = true;
    m.userData.unit = true;
    scene.add(m);
    return m;
  };
  const cover = (parent, geo, mat) => {
    const m = new Mesh(geo, mat);
    m.castShadow = true;
    parent.add(m);
    return m;
  };
  function placeLimb(mesh, a, b, r) {
    const d = new Vector3().subVectors(b, a), len = Math.max(0.01, d.length());
    mesh.position.copy(a).addScaledVector(d, 0.5);
    mesh.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), d.normalize());
    mesh.scale.set(1, mesh.userData.unit ? len : Math.max(0.01, (len - 2 * r) / 1), 1);
  }
  function elbowOf(a, c, la, lb, hint) {
    const d = new Vector3().subVectors(c, a), dist = Math.min(d.length(), la + lb - 1e-3);
    const x = (la * la - lb * lb + dist * dist) / (2 * dist), h = Math.sqrt(Math.max(0, la * la - x * x));
    const dn = d.clone().normalize(), side = hint.clone().sub(dn.clone().multiplyScalar(hint.dot(dn))).normalize();
    return a.clone().addScaledVector(dn, x).addScaledVector(side, h);
  }
  const torsoGeo = (() => {
    const prof = [[0, 0.83], [0.168, 0.835], [0.17, 0.87], [0.158, 0.95], [0.142, 1.05], [0.155, 1.13], [0.172, 1.22], [0.182, 1.3], [0.19, 1.36], [0.17, 1.41], [0.11, 1.45], [0.06, 1.47], [0, 1.475]];
    const g = new LatheGeometry(prof.map(([r, y]) => new Vector2(Math.max(1e-4, r), y)), 40);
    g.scale(1.12, 1, 0.66);
    return g;
  })();
  const torso = new Mesh(torsoGeo, shirt);
  opp.add(torso);
  const chest = torso;
  const collar = new Mesh(new TorusGeometry(0.058, 0.012, 8, 24), shirt);
  collar.rotation.x = Math.PI / 2 - 0.15;
  collar.position.set(0, 1.455, 5e-3);
  opp.add(collar);
  const pelvisGeo = (() => {
    const prof = [[0, 0.74], [0.13, 0.745], [0.165, 0.79], [0.172, 0.86], [0.162, 0.93], [0, 0.935]];
    const g = new LatheGeometry(prof.map(([r, y]) => new Vector2(Math.max(1e-4, r), y)), 36);
    g.scale(1.1, 1, 0.75);
    return g;
  })();
  const pelvis = new Mesh(pelvisGeo, shorts);
  opp.add(pelvis);
  const waistband = new Mesh(new CylinderGeometry(0.167, 0.167, 0.035, 36, 1, true), shorts);
  waistband.scale.set(1.1, 1, 0.75);
  waistband.position.y = 0.915;
  opp.add(waistband);
  const neck = new Mesh(limbGeo(0.052, 0.047, 0, 0.5, 16), skin);
  neck.position.y = 1.5;
  neck.scale.y = 0.13;
  opp.add(neck);
  const headG = new Group();
  headG.position.y = 1.62;
  opp.add(headG);
  const skull = new Mesh(new SphereGeometry(0.1, 32, 24), skin);
  skull.scale.set(0.8, 1.04, 0.98);
  headG.add(skull);
  const jaw = new Mesh(new SphereGeometry(0.072, 24, 16), skin);
  jaw.scale.set(0.92, 0.9, 0.86);
  jaw.position.set(0, -0.05, 0.012);
  headG.add(jaw);
  const hair = new Mesh(new SphereGeometry(0.103, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.5), hairM);
  hair.scale.set(0.9, 1, 1.03);
  hair.position.set(0, 8e-3, -8e-3);
  hair.rotation.x = -0.42;
  headG.add(hair);
  const brow = new Mesh(new CapsuleGeometry(9e-3, 0.07, 4, 8), skin);
  brow.rotation.z = Math.PI / 2;
  brow.position.set(0, 0.028, 0.084);
  headG.add(brow);
  for (const sx of [-1, 1]) {
    const eye = new Mesh(new SphereGeometry(85e-4, 12, 8), new MeshStandardMaterial({ color: 2102799, roughness: 0.25 }));
    eye.scale.set(1.2, 0.8, 0.6);
    eye.position.set(sx * 0.031, 0.012, 0.083);
    headG.add(eye);
    const ear = new Mesh(new SphereGeometry(0.022, 12, 8), skin);
    ear.scale.set(0.45, 1, 0.75);
    ear.position.set(sx * 0.087, -5e-3, -5e-3);
    headG.add(ear);
  }
  const nose = new Mesh(new ConeGeometry(0.012, 0.034, 10), skin);
  nose.rotation.x = Math.PI / 2 + 0.35;
  nose.position.set(0, -8e-3, 0.093);
  headG.add(nose);
  const mouth = new Mesh(new CapsuleGeometry(4e-3, 0.026, 4, 8), new MeshStandardMaterial({ color: 6960168, roughness: 0.6 }));
  mouth.rotation.z = Math.PI / 2;
  mouth.position.set(0, -0.052, 0.078);
  headG.add(mouth);
  const stripe = new Mesh(new CylinderGeometry(0.192, 0.192, 0.03, 40, 1, true), new MeshStandardMaterial({ color: 15921906, roughness: 0.8 }));
  stripe.scale.set(1.12, 1, 0.66);
  stripe.position.y = 1.3;
  opp.add(stripe);
  opp.traverse((m) => {
    if (m.isMesh) {
      m.castShadow = true;
      m.receiveShadow = true;
    }
  });
  const UPPER = limbGeo(0.052, 0.039, 0.12, 0.35), FORE = limbGeo(0.04, 0.026, 0.14, 0.25), THIGH = limbGeo(0.085, 0.054, 0.1, 0.3), SHIN = limbGeo(0.052, 0.031, 0.18, 0.3);
  const sleeveGeo = (() => {
    const g = new CylinderGeometry(0.052, 0.06, 0.48, 18, 1, true);
    g.translate(0, -0.26, 0);
    return g;
  })();
  const shortLegGeo = (() => {
    const g = new CylinderGeometry(0.084, 0.092, 0.42, 20, 1, true);
    g.translate(0, -0.29, 0);
    return g;
  })();
  const handGeo = (() => {
    const g = new SphereGeometry(0.045, 16, 12);
    g.scale(0.78, 1.1, 0.5);
    return g;
  })();
  const upperArmR = limb(UPPER, skin), foreArmR = limb(FORE, skin), handR = new Mesh(handGeo, skin);
  scene.add(handR);
  const upperArmL = limb(UPPER, skin), foreArmL = limb(FORE, skin), handL = new Mesh(handGeo, skin);
  scene.add(handL);
  cover(upperArmR, sleeveGeo, shirt);
  cover(upperArmL, sleeveGeo, shirt);
  const thighs = [limb(THIGH, skin), limb(THIGH, skin)], shins = [limb(SHIN, skin), limb(SHIN, skin)];
  thighs.forEach((t) => cover(t, shortLegGeo, shorts));
  const socks = [limb(limbGeo(0.036, 0.034, 0, 0.5, 14), sock), limb(limbGeo(0.036, 0.034, 0, 0.5, 14), sock)];
  const shoeGeo = (() => {
    const g = new SphereGeometry(0.06, 20, 12);
    g.scale(0.85, 0.55, 2.05);
    return g;
  })();
  const shoes = [0, 1].map(() => {
    const s = new Mesh(shoeGeo, shoe);
    s.castShadow = true;
    const so = new Mesh(new BoxGeometry(0.1, 0.014, 0.255), sole);
    so.position.y = -0.022;
    so.castShadow = true;
    s.add(so);
    scene.add(s);
    return s;
  });
  [handR, handL].forEach((h) => h.castShadow = true);
  const ball_ = (r, mat) => {
    const m = new Mesh(new SphereGeometry(r, 18, 12), mat);
    m.castShadow = true;
    scene.add(m);
    return m;
  };
  const JOINT = { shR: ball_(0.064, shirt), shL: ball_(0.064, shirt), elR: ball_(0.039, skin), elL: ball_(0.039, skin), kn: [ball_(0.054, skin), ball_(0.054, skin)] };
  const feet = [new Vector3(), new Vector3()], footGoal = [new Vector3(), new Vector3()];
  let oppNpc = null, oppHidden = false;
  const OPP_PARTS = [opp, upperArmR, foreArmR, handR, upperArmL, foreArmL, handL, ...thighs, ...shins, ...socks, ...shoes, JOINT.shR, JOINT.shL, JOINT.elR, JOINT.elL, ...JOINT.kn];
  let stepPhase = 0;
  const ball = new Mesh(new SphereGeometry(BALL_R, 24, 16), new MeshPhysicalMaterial({ color: 16250350, roughness: 0.38, clearcoat: 0.4, clearcoatRoughness: 0.3, emissive: 2762272 }));
  ball.castShadow = true;
  scene.add(ball);
  const BALL_VIS = 1.6;
  ball.scale.setScalar(BALL_VIS);
  const B = { p: new Vector3(), v: new Vector3(), live: false };
  let ac = null;
  function audioInit() {
    try {
      if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state !== "running") ac.resume().catch(() => {
      });
    } catch (e) {
    }
  }
  for (const ev of ["pointerdown", "keydown", "touchstart", "click"]) addEventListener(ev, () => {
    if (ac && ac.state !== "running") ac.resume().catch(() => {
    });
  }, true);
  function tone(f, len, vol, type = "sine", drop = 1) {
    if (!ac) return;
    const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(f * drop, t + len);
    g.gain.setValueAtTime(1e-4, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 2e-3);
    g.gain.exponentialRampToValueAtTime(1e-4, t + len);
    o.connect(g);
    g.connect(ac.destination);
    o.start(t);
    o.stop(t + len + 0.02);
  }
  function click(freq, q, len, vol) {
    if (!ac) return;
    const t = ac.currentTime, n = ac.createBufferSource(), buf = ac.createBuffer(1, ac.sampleRate * len, ac.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 4);
    n.buffer = buf;
    const f = ac.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = freq;
    f.Q.value = q;
    const g = ac.createGain();
    g.gain.value = vol;
    n.connect(f);
    f.connect(g);
    g.connect(ac.destination);
    n.start(t);
  }
  const sfx = {
    paddle: (power) => {
      click(2200, 1.5, 0.05, 0.9 + power);
      tone(1150, 0.05, 0.25);
    },
    table: () => {
      click(1200, 2, 0.06, 0.8);
      tone(720, 0.06, 0.3);
    },
    net: () => {
      click(300, 1, 0.08, 0.6);
    },
    floor: () => {
      click(900, 3, 0.05, 0.25);
    },
    win: () => {
      tone(660, 0.25, 0.2, "triangle");
      setTimeout(() => tone(990, 0.4, 0.2, "triangle"), 120);
      crowd(0.25);
    },
    lose: () => {
      tone(300, 0.35, 0.15, "triangle", 0.7);
    }
  };
  function crowd(vol) {
    return;
    if (!ac || performance.now() - (crowd.last || 0) < 2500) return;
    crowd.last = performance.now();
    vol = Math.min(vol, 0.08);
    const t = ac.currentTime, len = 1.8, n = ac.createBufferSource(), buf = ac.createBuffer(1, ac.sampleRate * len, ac.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    n.buffer = buf;
    const f = ac.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 900;
    f.Q.value = 0.4;
    const g = ac.createGain();
    g.gain.setValueAtTime(1e-4, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.25);
    g.gain.exponentialRampToValueAtTime(1e-4, t + len);
    n.connect(f);
    f.connect(g);
    g.connect(ac.destination);
    n.start(t);
  }
  let hand = null, lastHandAt = 0, mouse = null;
  function connect() {
    if (FROM_PHONE) return;
    const ws = new WebSocket("ws://localhost:8791");
    ws.onopen = () => setStatus("sensor connected");
    ws.onmessage = (e) => {
      const f = JSON.parse(e.data);
      const h = f.hands.find((h2) => h2.type === "right") || f.hands[0];
      if (h) {
        hand = h;
        lastHandAt = performance.now();
      }
    };
    ws.onclose = () => {
      setStatus("sensor offline, mouse works");
      setTimeout(connect, 1e3);
    };
  }
  connect();
  let src = FROM_PHONE ? "iphone" : localStorage.pp_src || "leap", body = null, lastBodyAt = 0, phoneWS = null;
  const srcBtns = [...document.querySelectorAll("#src button")];
  function setSrc(v) {
    src = v;
    localStorage.pp_src = v;
    srcBtns.forEach((b) => b.classList.toggle("on", b.dataset.s === v));
  }
  srcBtns.forEach((b) => b.onclick = (e) => {
    e.stopPropagation();
    setSrc(b.dataset.s);
  });
  setSrc(src);
  if (new URLSearchParams(location.search).has("leap")) document.getElementById("src").style.display = "";
  if (FROM_PHONE) document.querySelector("#src button[data-s=leap]").style.display = "none";
  const recenter = () => {
    CAL.origin = null;
  };
  document.getElementById("center").onclick = (e) => {
    e.stopPropagation();
    recenter();
  };
  addEventListener("keydown", (e) => {
    if (e.key === "c" || e.key === "C") recenter();
  });
  const PREDICT_EXTRA = 0.04, JV = {};
  function smoothedBody(now) {
    const J = BodyMovin.joints;
    if (!BodyMovin.live || BodyMovin.mouse || !J || !J.rHand || !J.root) return null;
    if (smoothedBody.t !== now) {
      const dt = Math.max(1 / 240, Math.min(0.1, (now - (smoothedBody.t || now)) / 1e3)) || 1 / 60;
      smoothedBody.t = now;
      for (const [k, a] of Object.entries(J)) {
        const f = JV[k] || (JV[k] = { p: a, v: [0, 0, 0] });
        f.v = f.v.map((v, i) => v + 0.35 * ((a[i] - f.p[i]) / dt - v));
        f.p = a;
      }
      lastBodyAt = now;
    }
    const j = {};
    for (const [k, a] of Object.entries(J)) {
      const v = JV[k] ? JV[k].v : [0, 0, 0];
      let d = v.map((c) => c * PREDICT_EXTRA);
      const n = Math.hypot(...d);
      if (n > 0.15) d = d.map((c) => c * 0.15 / n);
      j[k] = a.map((c, i) => c + d[i]);
    }
    smoothedBody.last = { j, age: 0 };
    return smoothedBody.last;
  }
  const bodyRight = new Vector3(1, 0, 0);
  const PH = { hand: localStorage.pp_hand || "right", picked: false, k: 0, cand: null, ray: new Raycaster(), dx: 0, dy: 0, swapK: 0 };
  function raisedHand() {
    const I = BodyMovin.img;
    if (!I || performance.now() - (BodyMovin.imgAt || 0) > 700 || !I.lHand || !I.rHand || !I.lShoulder || !I.rShoulder) return null;
    const l = I.lHand[1] < I.lShoulder[1] - 0.03, r = I.rHand[1] < I.rShoulder[1] - 0.03;
    return l && !r ? "left" : r && !l ? "right" : null;
  }
  function pickHand(dt, rallying) {
    var _a;
    let h = BodyMovin.present === false ? null : raisedHand();
    if (h && performance.now() - (((_a = BodyMovin.hands[h]) == null ? void 0 : _a.nearAt) || -1e9) < 600) h = null;
    if (!PH.picked) {
      if (h && h === PH.cand) PH.k += dt;
      else {
        PH.cand = h;
        PH.k = 0;
      }
      if (PH.k > 0.6) {
        PH.hand = h;
        PH.picked = true;
        localStorage.pp_hand = h;
        say(h === "left" ? "LEFT HAND" : "RIGHT HAND", "the paddle is in your hand", 1300);
      }
      return PH.picked;
    }
    if (!rallying && h && h !== PH.hand) {
      PH.swapK += dt;
      if (PH.swapK > 1) {
        PH.hand = h;
        localStorage.pp_hand = h;
        PH.swapK = 0;
        say(h === "left" ? "LEFT HAND" : "RIGHT HAND", "switched", 1100);
      }
    } else PH.swapK = 0;
    return true;
  }
  const ARMR = { lat: 0.5, up: -1, vl: 0, vu: 0, t: 0, speed: 0, armed: true, swingAt: -1e9, swingPow: 0, swings: 0, srcImg: false };
  function readArm(now) {
    const hk = PH.hand === "left" ? "lHand" : "rHand", sg = PH.hand === "left" ? -1 : 1;
    const I = BodyMovin.img, fresh = I && performance.now() - (BodyMovin.imgAt || 0) < 700 && I[hk] && I.lShoulder && I.rShoulder && I.lHip && I.rHip;
    let lat, up;
    if (fresh) {
      const ch = [(I.lShoulder[0] + I.rShoulder[0]) / 2, (I.lShoulder[1] + I.rShoulder[1]) / 2], hp = [(I.lHip[0] + I.rHip[0]) / 2, (I.lHip[1] + I.rHip[1]) / 2];
      const T = Math.max(0.05, Math.hypot(ch[0] - hp[0], ch[1] - hp[1]));
      lat = -sg * (I[hk][0] - ch[0]) / T;
      up = (ch[1] - I[hk][1]) / T;
    } else {
      const j = body.j;
      if (!j.lShoulder || !j.rShoulder) return;
      const ch = j.lShoulder.map((c, i) => (c + j.rShoulder[i]) / 2), T = Math.max(0.3, Math.min(0.75, ch[1] - j.root[1]));
      if (!j[hk]) return;
      const d = [j[hk][0] - ch[0], j[hk][1] - ch[1], j[hk][2] - ch[2]];
      lat = sg * (d[0] * bodyRight.x + d[2] * bodyRight.z) / T;
      up = d[1] / T;
    }
    ARMR.srcImg = !!fresh;
    const dt = Math.max(1 / 240, Math.min(0.1, (now - (ARMR.t || now)) / 1e3)) || 1 / 60;
    ARMR.t = now;
    const b = 1 - Math.exp(-dt * 16);
    ARMR.vl += b * ((lat - ARMR.lat) / dt - ARMR.vl);
    ARMR.vu += b * ((up - ARMR.up) / dt - ARMR.vu);
    ARMR.lat = lat;
    ARMR.up = up;
    ARMR.speed = Math.hypot(ARMR.vl, ARMR.vu);
    if (ARMR.speed > 2.2) {
      if (ARMR.armed) {
        ARMR.armed = false;
        ARMR.swingPow = 0;
        ARMR.swings++;
      }
      ARMR.swingAt = now;
    }
    if (!ARMR.armed) {
      ARMR.swingPow = Math.max(ARMR.swingPow, Math.min(1, (ARMR.speed - 1.6) / 4));
      if (ARMR.speed < 1 && now - ARMR.swingAt > 200) ARMR.armed = true;
    }
  }
  const swingLive = () => performance.now() - ARMR.swingAt < 380;
  function bodyTarget() {
    const now = performance.now();
    readArm(now);
    const sh = MathUtils.clamp(BodyMovin.body.shoulders || 0, -1, 1);
    const bodyX = sh * 0.6;
    GHOST.x = bodyX;
    const x = bodyX + MathUtils.clamp(ARMR.lat, -0.8, 1.5) * 0.42;
    const y = TABLE_Y + 0.16 + MathUtils.clamp(ARMR.up + 1.3, 0, 2.2) * 0.28;
    const push = swingLive() ? 0.32 * Math.sin(Math.PI * Math.min(1, (now - ARMR.swingAt) / 260)) : 0;
    return { pos: new Vector3(x, y, 1.62 - push), dx: ARMR.lat, dy: ARMR.up, dz: ARMR.speed, lat: bodyX };
  }
  const ghostMat = new MeshBasicMaterial({ color: 6737151, transparent: true, opacity: 0.18, depthWrite: false });
  const ghostHot = new MeshBasicMaterial({ color: 10354640, transparent: true, opacity: 0.85, depthWrite: false });
  const ghost = new Group();
  scene.add(ghost);
  const gBone = () => {
    const m = new Mesh(new CylinderGeometry(1, 1, 1, 10), ghostMat);
    ghost.add(m);
    return m;
  };
  const gBall = (r, mat = ghostMat) => {
    const m = new Mesh(new SphereGeometry(r, 16, 12), mat);
    ghost.add(m);
    return m;
  };
  const GH = { head: gBall(0.09), torso: gBone(), lUpper: gBone(), lFore: gBone(), rUpper: gBone(), rFore: gBone(), shoulders: gBone(), lHand: gBall(0.035), rHand: gBall(0.04, ghostHot) };
  const beam = new Line(new BufferGeometry().setFromPoints([new Vector3(), new Vector3()]), new LineDashedMaterial({ color: 10354640, dashSize: 0.03, gapSize: 0.02, transparent: true, opacity: 0.8 }));
  scene.add(beam);
  function gSeg(m, a, b, r) {
    const d = new Vector3().subVectors(b, a), len = d.length();
    m.position.copy(a).addScaledVector(d, 0.5);
    m.scale.set(r, Math.max(1e-3, len), r);
    if (len > 1e-4) m.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), d.normalize());
  }
  function drawGhost(now) {
    ghost.visible = beam.visible = false;
    return;
    const live = src === "iphone" && (body = smoothedBody(now));
    ghost.visible = beam.visible = !!live;
    if (!live) return;
    const j = body.j, v = (a) => new Vector3(a[0], a[1], a[2]);
    const root = v(j.root), fwd = new Vector3(0, 1, 0).cross(bodyRight).normalize();
    const rel = (a) => {
      const r = v(a).sub(root);
      return new Vector3(r.dot(bodyRight), r.y, r.dot(fwd));
    };
    const lat0 = GHOST.x;
    const W = (r) => new Vector3(lat0 + r.x, HIP_Y + r.y, GHOST_Z - r.z);
    const P3 = {};
    for (const k of ["head", "lShoulder", "rShoulder", "lForearm", "rForearm", "lHand", "rHand"]) if (j[k]) P3[k] = rel(j[k]);
    const hip = new Vector3(0, 0, 0), neckR = P3.lShoulder && P3.rShoulder ? P3.lShoulder.clone().add(P3.rShoulder).multiplyScalar(0.5) : new Vector3(0, 0.5, 0);
    GH.head.position.copy(W(P3.head || new Vector3(0, 0.7, 0)));
    gSeg(GH.torso, W(hip), W(neckR), 0.06);
    if (P3.lShoulder && P3.rShoulder) gSeg(GH.shoulders, W(P3.lShoulder), W(P3.rShoulder), 0.035);
    if (P3.rShoulder) {
      const sh = W(P3.rShoulder), grip = P.pos.clone();
      const elbow = P3.rForearm ? sh.clone().lerp(grip, 0.5).lerp(W(P3.rForearm), 0.5) : sh.clone().lerp(grip, 0.5);
      elbow.y -= 0.05;
      gSeg(GH.rUpper, sh, elbow, 0.032);
      gSeg(GH.rFore, elbow, grip, 0.028);
      GH.rHand.position.copy(grip);
    }
    if (P3.lShoulder && P3.lForearm && P3.lHand) {
      gSeg(GH.lUpper, W(P3.lShoulder), W(P3.lForearm), 0.035);
      gSeg(GH.lFore, W(P3.lForearm), W(P3.lHand), 0.03);
      GH.lHand.position.copy(W(P3.lHand));
    }
    beam.visible = false;
  }
  const ARM_REACH = 1.6, BODY_STEP = 1.4, HIP_Y = 0.98, GHOST_Z = 1.95;
  const GHOST = { x: 0 };
  const CAL = {
    origin: null,
    xs: [],
    ys: [],
    x: [-0.17, 0.17],
    y: [0.12, 0.42],
    next: 0,
    add(lat, dy) {
      this.xs.push(lat);
      this.ys.push(dy);
      if (this.xs.length > 1500) {
        this.xs.shift();
        this.ys.shift();
      }
      const now = performance.now();
      if (now < this.next || this.xs.length < 90) {
        if (this.xs.length < 90) {
          const c = this.xs[0];
          this.x = [c - 0.17, c + 0.17];
        }
        return;
      }
      this.next = now + 500;
      const q = (a, p) => {
        const b = [...a].sort((m, n) => m - n);
        return b[Math.floor(p * (b.length - 1))];
      };
      const span = (lo, hi, min) => {
        const c = (lo + hi) / 2, h = Math.max(min, hi - lo) / 2;
        return [c - h, c + h];
      };
      this.x = span(q(this.xs, 0.05), q(this.xs, 0.95), 0.3);
      this.y = span(q(this.ys, 0.05), q(this.ys, 0.95), 0.22);
    }
  };
  addEventListener("mousemove", (e) => {
    mouse = { x: e.clientX / innerWidth, y: e.clientY / innerHeight, t: performance.now() };
  });
  const statusEl = document.getElementById("status");
  function setStatus(s) {
    statusEl.textContent = s;
  }
  const P = { pos: new Vector3(0, 0.95, 1.5), vel: new Vector3(), normal: new Vector3(0, 0.2, -1).normalize(), dir: new Vector3(0, 1, 0), side: "fore", prev: null };
  const FORE_FACE = new Vector3(0, 0.12, -1).normalize(), BACK_FACE = new Vector3(0, 0.12, 1).normalize();
  const FORE_HANDLE = new Vector3(1, -0.3, 0.15).normalize(), BACK_HANDLE = new Vector3(-1, -0.3, 0.15).normalize();
  function paddleQuat(face, handle) {
    const y = face.clone(), z = handle.clone().sub(y.clone().multiplyScalar(handle.dot(y))).normalize(), x = new Vector3().crossVectors(y, z);
    return new Quaternion().setFromRotationMatrix(new Matrix4().makeBasis(x, y, z));
  }
  const FLIP_TURN = 0.33;
  const FORE_Q = paddleQuat(FORE_FACE, FORE_HANDLE), BACK_Q = paddleQuat(BACK_FACE, BACK_HANDLE);
  function leapToWorld(v) {
    return new Vector3(v[0] * 62e-4, TABLE_Y + (v[1] - 130) * 28e-4, 1.5 + v[2] * 4e-3);
  }
  function updatePaddleInput(dt, now) {
    var _a, _b;
    let target = null, n = null;
    if (src === "iphone") {
      if ((body = smoothedBody(now)) && padFresh()) {
        readArm(now);
        target = new Vector3(pad.c[0], pad.c[1], pad.z);
        n = FORE_FACE;
        P.side = pad.c[0] < fig.plane.position.x ? "back" : "fore";
        setStatus("iPhone tracking you");
      } else setStatus("iPhone: not seeing you yet");
    } else if (hand && now - lastHandAt < 300) {
      target = leapToWorld(hand.palm.pos);
      const roll = hand.palm.normal[0];
      if (P.side === "fore") {
        P.rollPeak = Math.max((_a = P.rollPeak) != null ? _a : roll, roll);
        if (roll < P.rollPeak - FLIP_TURN) {
          P.side = "back";
          P.rollPeak = roll;
        }
      } else {
        P.rollPeak = Math.min((_b = P.rollPeak) != null ? _b : roll, roll);
        if (roll > P.rollPeak + FLIP_TURN) {
          P.side = "fore";
          P.rollPeak = roll;
        }
      }
      n = P.side === "back" ? BACK_FACE : FORE_FACE;
      setStatus("sensor connected · ".concat(P.side === "back" ? "BACKHAND" : "FOREHAND", " · turn your wrist to flip"));
    } else if (mouse && now - mouse.t < 4e3) {
      target = new Vector3((mouse.x - 0.5) * 1.8, TABLE_Y + (1 - mouse.y) * 0.6, 1.45);
      n = new Vector3(0, 0.15, -1).normalize();
    }
    if (window.__bot) {
      target = window.__bot(B, P);
      n = new Vector3(0, 0.15, -1).normalize();
    }
    if (!target) return;
    target.x = MathUtils.clamp(target.x, -1.25, 1.25);
    target.y = MathUtils.clamp(target.y, TABLE_Y + 0.02, 1.7);
    target.z = MathUtils.clamp(target.z, 0.95, 2.1);
    const prev = P.pos.clone();
    if (src === "iphone" && !window.__bot) {
      P.pos.copy(target);
      P.vel.copy(pad.v);
      P.normal.copy(n);
      return;
    }
    P.pos.lerp(target, 0.6);
    const instVel = P.pos.clone().sub(prev).divideScalar(Math.max(dt, 1e-3));
    P.vel.lerp(instVel, 0.35);
    if (src === "leap" && mouse && !(hand && now - lastHandAt < 300)) P.vel.z = Math.min(P.vel.z, -1.2);
    P.normal.lerp(n, 0.5).normalize();
  }
  const BodyFig = await import(new URL(window.BP_DIR + "bodyfig.js", location.href).href);
  const FIG_Z = HALF_L + 0.38;
  const CAM_YOU = new Vector3(0, 1.74, FIG_Z + 2.05), LOOK_YOU = new Vector3(0, 0.84, -0.9);
  const SERVE_SWING = 1.1;
  const PAD = { blade: 0.23, bladeH: 0.22, reach: 0.31, hand: 0.085, fore: 0.07, slack: 0.015 };
  const figProps = {};
  const FLAT = Q.get("body") === "fig";
  const RealYou = FLAT ? null : await import(new URL(window.BP_DIR + "realyou.js", location.href).href).catch(() => null);
  const RealNpc = FLAT ? null : await import(new URL(window.BP_DIR + "realnpc.js", location.href).href).catch(() => null);
  const StanceM = FLAT ? null : await import(new URL(window.BP_DIR + "stance.js", location.href).href).catch(() => null);
  const STANCES = FLAT ? null : (await import(new URL(window.BP_DIR + "stance_defs.js", location.href).href).catch(() => ({}))).STANCES;
  const FIG_OPTS = {
    scene,
    camera,
    BP: BodyMovin,
    x: 0,
    z: FIG_Z,
    tier: RZ.quality ? RZ.quality.tier : 1,
    props: figProps,
    // stepRange 0.8: a step sideways carries the paddle to the far corners (backhand to the far left)
    // scale 0.9: you a touch smaller at your end of the table (Matt 10/30: "a little bit too big")
    stepRange: 0.8,
    alpha: 0.36,
    scale: 0.9,
    outfit: { shorts: "rgba(24,30,52,0.85)", band: "#e8e8ea", seam: "rgba(10,12,24,0.6)" }
  };
  const fig = RealYou ? RealYou.create(Object.assign({}, FIG_OPTS, { outfit: "tabletennis", grip: { l: "relaxed", r: "relaxed" }, shiftPose: true, onFallback: (w) => console.warn("real you off:", w) })) : BodyFig.create(FIG_OPTS);
  if (RealNpc) oppNpc = RealNpc.create({ scene, outfit: "tabletennis", colors: { shirt: 1929144, shorts: 1382173 }, lod: 0, tier: RZ.quality ? RZ.quality.tier : 1 });
  const youPaddle = makePaddle(13111838);
  youPaddle.visible = false;
  scene.add(youPaddle);
  let youGripSide = null;
  const ttGhost = StanceM && STANCES ? StanceM.create(Object.assign({ scene, BP: BodyMovin, you: fig, outfit: "tabletennis", tier: RZ.quality ? RZ.quality.tier : 1 }, STANCES.tabletennis)) : null;
  let pad = null, padPrev = null;
  const CT = { hits: 0, blocks: 0, swept: 0, last: null };
  function drawPaddle(c, o) {
    const { P: P2, B: B2, t, side } = o, h = P2[side + "P"], w = P2[side + "W"];
    if (!h || !w || !B2[side + "P"] || !B2[side + "W"]) return;
    let dx = h[0] - w[0], dy = h[1] - w[1];
    const dl = Math.hypot(dx, dy) || 1;
    dx /= dl;
    dy /= dl;
    const m = [h[0] + dx * PAD.reach * t, h[1] + dy * PAD.reach * t], ang = Math.atan2(dy, dx);
    c.save();
    c.lineCap = "round";
    c.strokeStyle = "#8a6036";
    c.lineWidth = t * 0.075;
    c.beginPath();
    c.moveTo(h[0] - dx * 0.03 * t, h[1] - dy * 0.03 * t);
    c.lineTo(h[0] + dx * 0.14 * t, h[1] + dy * 0.14 * t);
    c.stroke();
    c.globalAlpha = 0.88;
    c.fillStyle = "#d3202e";
    c.beginPath();
    c.ellipse(m[0], m[1], PAD.blade * t, PAD.bladeH * t, ang, 0, 6.283);
    c.fill();
    c.globalAlpha = 1;
    c.strokeStyle = "#f3dfbf";
    c.lineWidth = Math.max(2, t * 0.025);
    c.stroke();
    c.restore();
    padFrom(B2, side, dx, -dy);
  }
  function padFrom(B2, side, dwx, dwy) {
    const Bt = B2.t, hw = B2[side + "P"], g = fig.glove(side);
    padPrev = pad;
    pad = {
      key: BodyMovin.imgAt,
      at: performance.now(),
      side,
      c: [hw[0] + dwx * PAD.reach * Bt, hw[1] + dwy * PAD.reach * Bt],
      r: PAD.blade * Bt,
      h: hw.slice(),
      hr: PAD.hand * Bt,
      e: B2[side + "E"] ? B2[side + "E"].slice() : null,
      er: PAD.fore * Bt,
      z: FIG_Z - (g.dz || 0),
      v: g.v.clone(),
      pose: B2
    };
  }
  function onPlane(p) {
    const c = camera.position, k = (FIG_Z - c.z) / Math.min(-1e-3, p.z - c.z);
    return { x: c.x + (p.x - c.x) * k, y: c.y + (p.y - c.y) * k, r: BALL_R * BALL_VIS * k };
  }
  const segD = (x, y, a, b) => {
    const ex = b[0] - a[0], ey = b[1] - a[1], l2 = ex * ex + ey * ey || 1e-9, k = Math.max(0, Math.min(1, ((x - a[0]) * ex + (y - a[1]) * ey) / l2));
    return Math.hypot(x - a[0] - ex * k, y - a[1] - ey * k);
  };
  function padGap(P2, q) {
    let d = Math.hypot(q.x - P2.c[0], q.y - P2.c[1]) - P2.r;
    d = Math.min(d, segD(q.x, q.y, P2.h, P2.c) - P2.hr);
    if (P2.e) d = Math.min(d, segD(q.x, q.y, P2.e, P2.h) - P2.er);
    return d - q.r;
  }
  const padFresh = () => pad && fig.fresh && performance.now() - pad.at < 400;
  const atDepth = (P2, z) => z > P2.z - 0.45 && z < P2.z + 0.15;
  function contactNow(serve) {
    if (!padFresh() || !atDepth(pad, B.p.z)) return null;
    const q = onPlane(B.p), gap = padGap(pad, q);
    return gap < PAD.slack ? { P: pad, q, gap, swept: false, serve } : null;
  }
  function contactSwept() {
    if (!padFresh() || !padPrev || pad.at - padPrev.at > 350 || !atDepth(pad, B.p.z)) return null;
    const q = onPlane(B.p);
    const d = Math.min(segD(q.x, q.y, padPrev.c, pad.c) - Math.min(pad.r, padPrev.r), segD(q.x, q.y, padPrev.h, pad.h) - pad.hr) - q.r;
    return d < PAD.slack ? { P: pad, q, gap: d, swept: true } : null;
  }
  function insideBody(q) {
    const P2 = pad && pad.pose;
    if (!P2 || !padFresh()) return false;
    const t = P2.t, r = q.r;
    if (Math.hypot(q.x - P2.head[0], q.y - P2.head[1]) < 0.22 * t + r) return true;
    if (segD(q.x, q.y, P2.n, P2.hM) < 0.26 * t + r) return true;
    if (segD(q.x, q.y, P2.lS, P2.lH) < 0.08 * t + r || segD(q.x, q.y, P2.rS, P2.rH) < 0.08 * t + r) return true;
    for (const s of ["l", "r"]) {
      if (P2[s + "K"] && segD(q.x, q.y, P2[s + "H"], P2[s + "K"]) < 0.15 * t + r) return true;
      if (P2[s + "K"] && P2[s + "A"] && segD(q.x, q.y, P2[s + "K"], P2[s + "A"]) < 0.09 * t + r) return true;
      if (P2[s + "E"] && segD(q.x, q.y, P2[s + "S"], P2[s + "E"]) < 0.1 * t + r) return true;
    }
    return false;
  }
  function blockedByYou() {
    CT.blocks++;
    logEvent("body", { ball: r3(B.p) });
    B.p.z = FIG_Z - 0.03;
    B.v.set(B.v.x * 0.25, Math.min(0, B.v.y) * 0.4 - 0.3, -Math.abs(B.v.z) * 0.2);
    sfx.floor();
    point("opp", "OFF YOU");
    if (window.__labFreeze) window.__labFrozen = true;
  }
  function hitFromContact(ct) {
    CT.hits++;
    if (ct.swept) CT.swept++;
    CT.last = { t: performance.now(), gap: +ct.gap.toFixed(3), swept: ct.swept, serve: !!ct.serve, bp: [B.p.x, B.p.y, B.p.z], bz: +B.p.z.toFixed(2), pz: +ct.P.z.toFixed(2), q: [+ct.q.x.toFixed(2), +ct.q.y.toFixed(2)], c: ct.P.c.map((v) => +v.toFixed(2)), r: +ct.P.r.toFixed(3) };
    myHit(ct);
    if (window.__labFreeze) window.__labFrozen = true;
  }
  const S = { me: 0, opp: 0, server: "me", serves: 0, lastHit: null, bounce: { me: 0, opp: 0 }, phase: "idle", timer: 0, toss: 0, oppTarget: 0, oppWillMiss: false, over: false };
  const sideOf = (z) => z > 0 ? "me" : "opp";
  const other = (s) => s === "me" ? "opp" : "me";
  const msgEl = document.getElementById("msg"), subEl = document.getElementById("sub");
  let msgTimer = 0;
  function say(big, small = "", ms = 1200) {
    msgEl.textContent = big;
    subEl.textContent = small;
    msgEl.style.opacity = 1;
    subEl.style.opacity = small ? 1 : 0;
    clearTimeout(msgTimer);
    msgTimer = setTimeout(() => {
      msgEl.style.opacity = 0;
      subEl.style.opacity = 0;
    }, ms);
  }
  function drawScore() {
    document.getElementById("me").textContent = S.me;
    document.getElementById("opp").textContent = S.opp;
  }
  function newPoint() {
    S.lastHit = null;
    S.bounce = { me: 0, opp: 0 };
    if (BodyMovin.recenter) BodyMovin.recenter(900);
    if (S.server === "me") {
      S.phase = "toss";
      S.toss = 0;
      B.live = false;
    } else {
      S.phase = "oppServe";
      S.timer = 0.9;
      B.live = false;
      B.p.set(oppPaddle.position.x, 1, -HALF_L - 0.15);
    }
    drawScore();
  }
  function point(winner, why) {
    if (S.phase === "dead") return;
    logEvent("point", { winner, why, lastHit: S.lastHit, bounce: { ...S.bounce }, ball: r3(B.p), ballVel: r3(B.v), near: S.lastHit === "opp" ? LOG.near : null });
    LOG.near = null;
    S.phase = "dead";
    S[winner]++;
    if (winner === "me") sfx.win();
    else sfx.lose();
    S.serves++;
    const deuce = S.me >= 10 && S.opp >= 10;
    if (deuce || S.serves >= 2) {
      S.server = other(S.server);
      S.serves = 0;
    }
    const won = (S.me >= 11 || S.opp >= 11) && Math.abs(S.me - S.opp) >= 2;
    drawScore();
    if (won) {
      say(S.me > S.opp ? "YOU WIN!" : "THEY WIN", "".concat(S.me, " to ").concat(S.opp), 3500);
      S.over = true;
      S.timer = 4;
      if (BodyMovin.highScores) BodyMovin.highScores("pingpong", S.me > 0 ? S.me * 100 + 99 - S.opp : 0, { display: "".concat(S.me, "-").concat(S.opp) });
    } else {
      say(winner === "me" ? "POINT!" : why || "MISSED", winner === "me" ? why || "" : "their point", 1100);
      S.timer = 1.4;
    }
  }
  function aim(p, tx, tz, speedZ) {
    for (let k = 0; k < 12; k++) {
      const vz = Math.sign(tz - p.z) * speedZ, t2 = (tz - p.z) / vz;
      const vy = (TABLE_Y + BALL_R - p.y + 0.5 * G * t2 * t2) / t2, vx = (tx - p.x) / t2;
      const tn = (0 - p.z) / vz, yNet = p.y + vy * tn - 0.5 * G * tn * tn;
      if (yNet > TABLE_Y + NET_H + 0.035) return new Vector3(vx, vy, vz);
      speedZ *= 0.92;
      tz += Math.sign(tz) * 0.06;
    }
    const t = Math.abs(tz - p.z) / speedZ;
    return new Vector3((tx - p.x) / t, (TABLE_Y + BALL_R + 0.25 - p.y + 0.5 * G * t * t) / t, Math.sign(tz - p.z) * speedZ);
  }
  function myHit(ct) {
    ARMR.hits = (ARMR.hits || 0) + 1;
    logEvent("hit", { phase: S.phase, ball: r3(B.p), paddle: r3(P.pos), pvel: r3(P.vel), face: r3(P.normal), near: LOG.near, gap: ct ? +ct.gap.toFixed(3) : null, swept: ct ? ct.swept : null });
    LOG.near = null;
    let power, lift, tx;
    if (ct) {
      const v2 = ct.P.v, fwd = Math.max(0, -v2.z), sp = v2.length();
      power = MathUtils.clamp((fwd * 0.8 + sp * 0.35 - 0.35) / 3.2, 0, 1);
      lift = Math.min(v2.y, 0.8);
      const offX = (ct.q.x - ct.P.c[0]) / Math.max(0.05, ct.P.r);
      const wild = Math.abs(v2.x) > 3 ? HALF_W + 0.2 : HALF_W - 0.08;
      tx = MathUtils.clamp(B.p.x * 0.35 + v2.x * 0.16 + offX * 0.18, -wild, wild);
    } else {
      const fwd = Math.max(0, -P.vel.z);
      lift = P.vel.y;
      power = Math.min(1, fwd / 4);
      tx = MathUtils.clamp(B.p.x * 0.35 + P.vel.x * 0.18 + (B.p.x - P.pos.x) * 2.2, -HALF_W + 0.08, HALF_W - 0.08);
    }
    ARMR.swingPow = power;
    const speed = 4 + 4.5 * power;
    const tz = -0.45 - 0.75 * power - Math.random() * 0.12;
    const f = P.normal.z > 0 ? P.normal.clone().negate() : P.normal.clone();
    const txAimed = ct ? tx : MathUtils.clamp(tx + f.x * 0.55, -HALF_W + 0.08, HALF_W - 0.08);
    const tzAimed = MathUtils.clamp(tz - f.y * 0.25, -HALF_L + 0.08, -0.3);
    const v = aim(B.p, txAimed, tzAimed, speed);
    v.y += MathUtils.clamp(lift * 0.08, -0.4, 0.6);
    B.v.copy(v);
    B.live = true;
    S.lastHit = "me";
    S.bounce = { me: 0, opp: 0 };
    S.phase = "rally";
    sfx.paddle(power);
    const L = LEVELS[level];
    S.oppWillMiss = Math.random() < L.aiMiss + power * 0.15 * (level === "pro" ? 0.3 : 1);
    S.oppTarget = predictX(-HALF_L - 0.25);
  }
  function oppHit() {
    const L = LEVELS[level];
    const speed = L.aiPace[0] + Math.random() * (L.aiPace[1] - L.aiPace[0]);
    const away = -Math.sign(P.pos.x || 1) * (level === "easy" ? 0.15 : level === "normal" ? 0.35 : 0.5);
    const tx = MathUtils.clamp(away + (Math.random() - 0.5) * 0.7, -HALF_W + 0.18, HALF_W - 0.18);
    const tz = 0.55 + Math.random() * 0.6;
    B.v.copy(aim(B.p, tx, tz, speed));
    B.live = true;
    S.lastHit = "opp";
    S.bounce = { me: 0, opp: 0 };
    S.phase = "rally";
    sfx.paddle(0.3);
  }
  function predictAt(zLine) {
    const p = B.p.clone(), v = B.v.clone(), dt = 1 / 240;
    for (let i = 0; i < 720; i++) {
      v.y -= G * dt;
      p.addScaledVector(v, dt);
      if (p.y < TABLE_Y + BALL_R && Math.abs(p.x) < HALF_W && Math.abs(p.z) < HALF_L && v.y < 0) {
        p.y = TABLE_Y + BALL_R;
        v.y *= -0.88;
      }
      if (v.z < 0 && p.z <= zLine || v.z > 0 && p.z >= zLine) return p;
    }
    return p;
  }
  function predictX(zLine) {
    const p = B.p.clone(), v = B.v.clone(), dt = 1 / 240;
    for (let i = 0; i < 720; i++) {
      v.y -= G * dt;
      p.addScaledVector(v, dt);
      if (p.y < TABLE_Y + BALL_R && Math.abs(p.x) < HALF_W && Math.abs(p.z) < HALF_L && v.y < 0) {
        p.y = TABLE_Y + BALL_R;
        v.y *= -0.88;
      }
      if (v.z < 0 && p.z <= zLine || v.z > 0 && p.z >= zLine) return p.x;
    }
    return p.x;
  }
  const LOG = { events: [], trace: [], near: null, t0: performance.now() };
  const r3 = (v) => [+v.x.toFixed(3), +v.y.toFixed(3), +v.z.toFixed(3)];
  function logEvent(type, extra = {}) {
    LOG.events.push({ t: +((performance.now() - LOG.t0) / 1e3).toFixed(2), type, score: [S.me, S.opp], level, ...extra });
    if (LOG.events.length > 400) LOG.events.splice(0, 100);
    try {
      phoneWS && phoneWS.send(JSON.stringify({ wall: Date.now() / 1e3, src, ...LOG.events[LOG.events.length - 1], paddleNow: r3(P.pos), side: P.side }));
    } catch (e) {
    }
    saveLog();
  }
  let saveTimer = 0;
  function saveLog() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.pp_log = JSON.stringify({ events: LOG.events, trace: LOG.trace.slice(-1500) });
      } catch (e) {
      }
    }, 200);
  }
  function trackNear() {
    if (!(S.phase === "rally" && S.lastHit === "opp" && B.v.z > 0)) return;
    const d = B.p.clone().sub(P.pos), dist = d.length();
    if (!LOG.near || dist < LOG.near.dist) LOG.near = {
      dist: +dist.toFixed(3),
      dx: +d.x.toFixed(3),
      dy: +d.y.toFixed(3),
      dz: +d.z.toFixed(3),
      ball: r3(B.p),
      paddle: r3(P.pos),
      pvel: r3(P.vel),
      bounced: S.bounce.me,
      raw: hand ? { pos: hand.palm.pos, vel: hand.palm.vel, normal: hand.palm.normal, age: Math.round(performance.now() - lastHandAt) } : null
    };
  }
  function step(dt) {
    const prevZ = B.p.z;
    B.v.y -= G * dt;
    B.v.multiplyScalar(1 - 0.08 * dt);
    B.p.addScaledVector(B.v, dt);
    if (B.v.y < 0 && B.p.y < TABLE_Y + BALL_R && B.p.y > TABLE_Y - 0.05 && Math.abs(B.p.x) <= HALF_W && Math.abs(B.p.z) <= HALF_L) {
      B.p.y = TABLE_Y + BALL_R;
      B.v.y *= -0.88;
      B.v.x *= 0.97;
      B.v.z *= 0.97;
      sfx.table();
      const side = sideOf(B.p.z);
      if (S.phase === "rally") {
        if (side === S.lastHit) return point(other(S.lastHit), S.lastHit === "me" ? "YOUR SIDE" : "THEY HIT THEIR SIDE");
        S.bounce[side]++;
        if (S.bounce[side] >= 2) return point(S.lastHit, side === "opp" ? "they missed" : "MISSED");
      }
    }
    if (prevZ > 0 !== B.p.z > 0 && B.p.y < TABLE_Y + NET_H + BALL_R && B.p.y > TABLE_Y && Math.abs(B.p.x) < HALF_W + 0.15) {
      B.p.z = prevZ > 0 ? BALL_R : -BALL_R;
      B.v.z *= -0.15;
      B.v.x *= 0.3;
      sfx.net();
      if (S.phase === "rally") say("NET", "", 700);
    }
    if (B.p.y < BALL_R) {
      B.p.y = BALL_R;
      B.v.y *= -0.55;
      B.v.x *= 0.8;
      B.v.z *= 0.8;
      sfx.floor();
      if (S.phase === "rally") return point(S.bounce[other(S.lastHit)] >= 1 ? S.lastHit : other(S.lastHit), S.bounce[other(S.lastHit)] >= 1 ? S.lastHit === "me" ? "they missed" : "MISSED" : "OUT");
    }
    if (S.phase === "rally" && Math.abs(B.p.z) > HALF_L + 2.2) {
      const recv = other(S.lastHit);
      return point(S.bounce[recv] >= 1 ? S.lastHit : recv, S.bounce[recv] >= 1 ? recv === "opp" ? "they missed" : "MISSED" : "OUT");
    }
    if (S.phase === "rally" && S.lastHit === "opp" && B.v.z > 0) {
      const d = B.p.clone().sub(P.pos), r = src === "iphone" ? Math.hypot(d.x / (0.5 + 0.25 * Math.min(1, Math.abs(B.p.x) / HALF_W)), d.y / 0.4) : Math.hypot(d.x / 0.4, d.y / 0.3);
      const crossed = prevZ < P.pos.z && B.p.z >= P.pos.z;
      if (src === "iphone" && !window.__bot) {
        const ct = contactNow(false) || contactSwept();
        if (ct) return hitFromContact(ct);
      } else if (r < 1 && (Math.abs(d.z) < 0.16 || crossed)) myHit();
    }
    if (src === "iphone" && !window.__bot && S.phase === "rally" && S.lastHit === "opp" && B.v.z > 0 && prevZ < FIG_Z - 0.02 && B.p.z >= FIG_Z - 0.02 && insideBody(onPlane(B.p))) return blockedByYou();
    if (S.phase === "rally" && S.lastHit === "me" && B.v.z < 0 && B.p.z < -HALF_L - 0.1 && S.bounce.opp >= 1 && !S.oppWillMiss) {
      if (Math.abs(B.p.x - oppPaddle.position.x) < 0.3) oppHit();
    }
  }
  let last = performance.now(), started = false;
  let liveSince = 0, lastLiveAt = 0;
  function frame(now) {
    if (window.__labFrozen) {
      last = now;
      Realism.render(0);
      requestAnimationFrame(frame);
      return;
    }
    BodyMovin.update(now);
    const rdt = Math.min(0.05, (now - last) / 1e3);
    last = now;
    if (src === "leap" && BodyMovin.live && !BodyMovin.mouse && BodyMovin.joints.rHand && !(hand && now - lastHandAt < 1500)) setSrc("iphone");
    if (!started) {
      const reaching = BodyMovin._modal || ["left", "right"].some((k) => now - (BodyMovin.hands[k].nearAt || -1e9) < 600);
      if (reaching) {
        liveSince = 0;
        autoEl.textContent = "";
      } else if (BodyMovin.live && !BodyMovin.mouse) {
        liveSince || (liveSince = now);
        lastLiveAt = now;
        const left = 3 - (now - liveSince) / 1e3;
        autoEl.textContent = left > 0 ? "starting in ".concat(Math.ceil(left), "…") : "";
        if (left <= 0) startGame("auto");
      } else if (now - lastLiveAt > 1e3) {
        liveSince = 0;
        autoEl.textContent = "";
      }
    }
    const hs = BodyMovin.hands, nearTop = ["left", "right"].some((k) => hs[k].seen && hs[k].y < 0.24);
    NoMouse.tick(now, !started || ended || nearTop);
    figProps.l = PH.hand === "left" ? drawPaddle : null;
    figProps.r = PH.hand === "left" ? null : drawPaddle;
    if (src === "iphone") camera.position.copy(CAM_YOU), camera.lookAt(LOOK_YOU);
    fig.update(now);
    if (fig.real) {
      const side = PH.hand === "left" ? "l" : "r", Bp = fig.pose;
      if (side !== youGripSide && fig.person) {
        youGripSide = side;
        fig.person.grip(side, "paddle");
        fig.person.grip(side === "l" ? "r" : "l", "relaxed");
      }
      if (fig.newFrame && Bp && Bp[side + "P"] && Bp[side + "W"]) {
        let ux = Bp[side + "P"][0] - Bp[side + "W"][0], uy = Bp[side + "P"][1] - Bp[side + "W"][1];
        const ul = Math.hypot(ux, uy) || 1;
        padFrom(Bp, side, ux / ul, uy / ul);
      }
      const hf = fig.handFrame(side);
      if (hf && pad && fig.opacity > 0.05) {
        const dir = new Vector3(pad.c[0] - pad.h[0], pad.c[1] - pad.h[1], 0).normalize();
        youPaddle.position.copy(hf.p).addScaledVector(dir, PAD.reach * pad.pose.t);
        youPaddle.quaternion.setFromRotationMatrix(new Matrix4().makeBasis(new Vector3().crossVectors(new Vector3(0, 0, 1), dir.clone().negate()), new Vector3(0, 0, 1), dir.clone().negate()));
        youPaddle.visible = src === "iphone" && !window.__bot;
      } else youPaddle.visible = false;
    } else youPaddle.visible = false;
    if (ttGhost) ttGhost.update(now, started && !ended && src === "iphone" && (S.phase === "toss" || S.phase === "oppServe" || S.phase === "dead") && BodyMovin.live && !BodyMovin.mouse);
    myPaddle.visible = src !== "iphone" || !!window.__bot;
    updatePaddleInput(rdt, now);
    if (fig.newFrame && src === "iphone" && !window.__bot && started && !ended && S.phase === "rally" && S.lastHit === "opp" && B.v.z > 0) {
      const ct = contactSwept();
      if (ct) hitFromContact(ct);
    }
    const L = LEVELS[level], dt = rdt * L.time;
    const handOk = !started || src !== "iphone" || window.__bot || pickHand(rdt, S.phase === "rally");
    if (started && !ended && !handOk) {
      if (now - (PH.askedAt || 0) > 2500) {
        PH.askedAt = now;
        say("Raise your paddle hand", "hold up the hand you play with", 2400);
      }
    }
    {
      const sc = document.getElementById("score");
      sc.style.display = started && !ended ? "flex" : "none";
      if (started && !ended && window.BPUI) {
        const L2 = BPUI.top(sc.offsetWidth, sc.offsetHeight);
        sc.style.left = L2.c.x + "px";
        sc.style.top = L2.c.y + "px";
      }
    }
    if (started && handOk && !ended) {
      if (S.phase === "toss") {
        S.toss += rdt;
        if (src === "iphone" && !window.__bot) {
          const fx = fig.plane.position.x + (PH.hand === "left" ? -0.3 : 0.3);
          B.p.set(MathUtils.clamp(fx, -0.55, 0.55), TABLE_Y + 0.3 + 0.08 * Math.abs(Math.sin(S.toss * 2.6)), FIG_Z - 0.45);
          if (S.toss > 1) {
            const ct = contactNow(true) || fig.newFrame && contactSwept();
            if (ct && ct.P.v.length() > SERVE_SWING) hitFromContact(ct);
          }
        } else B.p.set(MathUtils.clamp(P.pos.x * 0.6, -0.5, 0.5), TABLE_Y + 0.32 + 0.12 * Math.abs(Math.sin(S.toss * 2.6)), HALF_L - 0.05);
        const d = B.p.clone().sub(P.pos);
        if (src === "iphone") {
        } else if (S.toss > 0.6 && Math.hypot(d.x, d.y) < 0.22 && Math.abs(d.z) < 0.25 && P.vel.z < -0.4) myHit();
      } else if (S.phase === "oppServe") {
        S.timer -= rdt;
        B.p.set(oppPaddle.position.x, 1 + 0.1 * Math.sin(S.timer * 9), -HALF_L - 0.12);
        if (S.timer <= 0) oppHit();
      } else if (S.phase === "rally" || S.phase === "dead") {
        if (!S.over && !ended) {
          const n = 6;
          for (let i = 0; i < n; i++) {
            step(dt / n);
            trackNear();
          }
        }
        if (fig.newFrame && src === "iphone" && !window.__bot && S.phase === "rally" && S.lastHit === "opp" && B.v.z > 0) {
          const ct = contactSwept();
          if (ct) hitFromContact(ct);
        }
        if (S.phase === "dead") {
          S.timer -= rdt;
          if (S.timer <= 0 && !(S.over && BodyMovin.highScores && BodyMovin.highScores.active)) {
            if (S.over) showEnd();
            else newPoint();
          }
        }
      }
    }
    ball.position.copy(B.p);
    if (started && now - (LOG.lastTrace || 0) > 100) {
      LOG.lastTrace = now;
      LOG.trace.push({
        t: +((now - LOG.t0) / 1e3).toFixed(2),
        ph: S.phase,
        ball: r3(B.p),
        paddle: r3(P.pos),
        pvel: r3(P.vel),
        src: hand && now - lastHandAt < 300 ? "leap" : "mouse",
        raw: hand ? hand.palm.pos.map((v) => Math.round(v)) : null,
        grab: hand ? hand.grab : null
      });
      if (LOG.trace.length > 3e3) LOG.trace.splice(0, 1e3);
      saveLog();
    }
    myPaddle.position.copy(P.pos);
    myPaddle.quaternion.slerp(P.side === "back" ? BACK_Q : FORE_Q, 0.35);
    const oppGoal = new Vector3(0, 1, -HALF_L - 0.25);
    if (S.phase === "rally" && S.lastHit === "me") oppGoal.x = S.oppTarget + (S.oppWillMiss ? S.oppTarget > 0 ? -0.45 : 0.45 : 0);
    if (S.phase === "rally" && S.lastHit === "me" && B.p.z < -0.5) oppGoal.y = MathUtils.clamp(B.p.y, TABLE_Y + 0.08, 1.4);
    const maxMove = L.aiSpeed * rdt * L.time * 1.4;
    const dx = MathUtils.clamp(oppGoal.x - oppPaddle.position.x, -maxMove, maxMove);
    oppPaddle.position.x += dx;
    oppPaddle.position.y += (oppGoal.y - oppPaddle.position.y) * 0.12;
    oppPaddle.position.z = -HALF_L - 0.25;
    const swing = S.phase === "rally" && S.lastHit === "opp" ? Math.max(0, 1 - (B.p.z + HALF_L) / 1.2) : 0;
    oppPaddle.quaternion.setFromEuler(new Euler(Math.PI / 2 - 0.3 - swing * 0.45, 0, 0.25, "XYZ"));
    const bodyX = MathUtils.clamp(oppPaddle.position.x + 0.32, -1.5, 1.5), bodyZ = -HALF_L - 0.72;
    const moving = Math.abs(dx) / Math.max(rdt, 1e-3);
    stepPhase += moving * rdt * 9;
    const crouch = 0.04 + 0.015 * Math.sin(now / 260);
    if (oppNpc && oppNpc.ready) {
      if (!oppHidden) {
        oppHidden = true;
        for (const m of OPP_PARTS) m.visible = false;
      }
      let A = RealNpc.TT_READY;
      if (S.phase === "rally" && S.lastHit === "me" && B.p.z < 0) A = RealNpc.sample(RealNpc.TT_FORE, 0.35 * MathUtils.clamp(-B.p.z / (HALF_L + 0.2), 0, 1));
      else if (swing > 0) A = RealNpc.sample(RealNpc.TT_FORE, 0.6 + 0.4 * (1 - swing));
      if (moving > 0.3) {
        const st = Math.sin(stepPhase);
        A = RealNpc.blend(A, { ...A, l: { ...A.l, thigh: A.l.thigh + 12 * Math.max(0, st), knee: A.l.knee + 25 * Math.max(0, st) }, r: { ...A.r, thigh: A.r.thigh + 12 * Math.max(0, -st), knee: A.r.knee + 25 * Math.max(0, -st) } }, 1);
      }
      oppNpc.root.position.set(bodyX, 0, bodyZ);
      oppNpc.root.rotation.set(0, -0.15 - dx * 3, 0);
      oppNpc.root.updateMatrixWorld(true);
      const g0 = oppNpc.root.worldToLocal(oppPaddle.localToWorld(new Vector3(0, 0, 0.13)));
      oppNpc.set(A, { rGrip: g0, rGripLen: 0.02, rPoleDir: new Vector3(-0.6, -1, -0.4).normalize() }, B.p);
    }
    opp.position.set(bodyX, -crouch, bodyZ);
    opp.rotation.set(0.12, -0.15 - dx * 3, -dx * 2);
    headG.rotation.y = MathUtils.clamp((B.p.x - bodyX) * 0.4, -0.5, 0.5);
    headG.rotation.x = MathUtils.clamp(-(B.p.y - 1.4) * 0.3, -0.3, 0.3);
    opp.updateMatrixWorld(true);
    const W = (v) => opp.localToWorld(v.clone());
    const grip = oppPaddle.localToWorld(new Vector3(0, 0, 0.13));
    const shR = W(new Vector3(-0.22, 1.36, 0)), elR = elbowOf(shR, grip, 0.3, 0.29, new Vector3(-0.6, -1, -0.4));
    placeLimb(upperArmR, shR, elR, 0.048);
    placeLimb(foreArmR, elR, grip, 0.04);
    handR.position.copy(grip);
    JOINT.shR.position.copy(shR);
    JOINT.elR.position.copy(elR);
    handR.quaternion.copy(foreArmR.quaternion);
    const shL = W(new Vector3(0.22, 1.36, 0)), hL = W(new Vector3(0.3, 1.08 + 0.02 * Math.sin(now / 300), 0.3));
    const elL = elbowOf(shL, hL, 0.3, 0.29, new Vector3(0.8, -1, -0.3));
    placeLimb(upperArmL, shL, elL, 0.048);
    placeLimb(foreArmL, elL, hL, 0.04);
    handL.position.copy(hL);
    JOINT.shL.position.copy(shL);
    JOINT.elL.position.copy(elL);
    handL.quaternion.copy(foreArmL.quaternion);
    for (let i = 0; i < 2; i++) {
      const sx = i ? 0.2 : -0.2;
      footGoal[i].set(bodyX + sx * 1.3, 0, bodyZ + (i ? 0.08 : -0.04));
      const lift = moving > 0.3 ? Math.max(0, Math.sin(stepPhase + i * Math.PI)) * 0.07 : 0;
      if (feet[i].lengthSq() === 0) feet[i].copy(footGoal[i]);
      feet[i].lerp(footGoal[i], moving > 0.3 ? 0.25 : 0.1);
      const ankle = feet[i].clone().setY(0.09 + lift);
      const hipP = W(new Vector3(sx * 0.55, 0.88, 0));
      const knee = elbowOf(hipP, ankle, 0.43, 0.42, new Vector3(sx * 0.3, 0, 1));
      placeLimb(thighs[i], hipP, knee, 0.075);
      placeLimb(shins[i], knee, ankle, 0.055);
      JOINT.kn[i].position.copy(knee);
      placeLimb(socks[i], ankle.clone().add(new Vector3(0, 0.1, 0)), ankle, 0.057);
      shoes[i].position.set(ankle.x, 0.035 + lift, ankle.z + 0.05);
      shoes[i].rotation.y = sx * -0.4;
    }
    if (src === "iphone") {
      camera.position.copy(CAM_YOU);
      camera.lookAt(LOOK_YOU);
    } else {
      camera.position.set(CAM_BASE.x + P.pos.x * 0.18, CAM_BASE.y + (P.pos.y - 0.95) * 0.1, CAM_BASE.z);
      camera.lookAt(P.pos.x * 0.1, 0.82, -0.6);
    }
    drawGhost(now);
    if (RZ.composer !== RZ.__tuned) {
      RZ.__tuned = RZ.composer;
      RZ.composer.addPass(new ShaderPass(FINISH));
      if (RZ.passes.ao) {
        const ao = RZ.passes.ao, r0 = ao.render.bind(ao), skip = [net, myPaddle, ...fig.objects];
        ao.render = (...a) => {
          const v = skip.map((o) => o.visible);
          skip.forEach((o) => o.visible = false);
          try {
            r0(...a);
          } finally {
            skip.forEach((o, k) => o.visible = v[k]);
          }
        };
      }
      if (RZ.passes.bloom) {
        RZ.passes.bloom.strength = 0.18;
        RZ.passes.bloom.threshold = 1.2;
        RZ.passes.bloom.radius = 0.4;
      }
    }
    Realism.render(rdt);
    requestAnimationFrame(frame);
  }
  const LV_NAME = { easy: "EASY", normal: "NORMAL", pro: "PRO" };
  function setLevel(l) {
    if (!LV_NAME[l]) l = "normal";
    level = l;
    try {
      localStorage.pp_level = l;
    } catch (_) {
    }
    document.getElementById("lvLbl").textContent = "LEVEL: " + LV_NAME[l];
  }
  function pickLevel() {
    BodyMovin.pick({
      title: "Pick a level",
      sub: "How good is your opponent?",
      value: level,
      onCancel: () => {
      },
      options: [{ id: "easy", label: "EASY", sub: "gentle" }, { id: "normal", label: "NORMAL", sub: "a fair match" }, { id: "pro", label: "PRO", sub: "fast, tricky" }],
      onPick: setLevel
    });
  }
  document.getElementById("chg").onclick = (e) => {
    e.stopPropagation();
    audioInit();
    pickLevel();
  };
  setLevel((() => {
    try {
      return localStorage.pp_level;
    } catch (_) {
      return "normal";
    }
  })());
  const autoEl = document.getElementById("auto");
  let ended = false;
  function showEnd() {
    ended = true;
    S.phase = "over";
    B.live = false;
    msgEl.style.opacity = 0;
    clearTimeout(msgTimer);
    document.getElementById("endWho").textContent = S.me > S.opp ? "YOU WIN!" : "THEY WIN";
    document.getElementById("endScore").textContent = "".concat(S.me, " – ").concat(S.opp);
    document.getElementById("end").style.display = "flex";
  }
  function playAgain() {
    if (!ended) return;
    ended = false;
    document.getElementById("end").style.display = "none";
    S.me = 0;
    S.opp = 0;
    S.over = false;
    S.server = "me";
    S.serves = 0;
    newPoint();
    say("YOUR SERVE", "swing at the floating ball", 1600);
  }
  document.getElementById("again").onclick = (e) => {
    e.stopPropagation();
    audioInit();
    playAgain();
  };
  document.getElementById("endHome").onclick = (e) => {
    e.stopPropagation();
    location.href = BP_DIR + "index.html";
  };
  function startGame(how) {
    if (started) return;
    audioInit();
    try {
      BodyMovin.music("pingpong");
    } catch (e) {
    }
    document.getElementById("start").style.display = "none";
    window.__startedBy = how;
    started = true;
    localStorage.removeItem("pp_log");
    logEvent("start");
    newPoint();
    say("YOUR SERVE", "swing at the floating ball", 1800);
  }
  document.getElementById("start").onclick = () => startGame("click");
  document.getElementById("go").onclick = (e) => {
    e.stopPropagation();
    startGame(e.isTrusted ? "click" : "hover");
  };
  addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && (!started || ended)) {
      e.preventDefault();
      if (ended) playAgain();
      else startGame("key");
    }
  });
  document.getElementById("bpHome").href = BP_DIR + "index.html";
  BodyMovin.start();
  if (new URLSearchParams(location.search).has("tv")) setTimeout(() => startGame("tv"), 800);
  window.__rz = RZ;
  window.__pp = { S, B, P, ARMR, PH, fig, BALL_VIS, CT, blocks: () => CT.blocks, drawn: () => drawnOnScreen(), myHit, setLevel, say, ended: () => ended, endMatch: () => {
    Object.assign(S, { me: 10, opp: 3, phase: "rally", lastHit: "me", over: false });
    point("me", "they missed");
  }, started: () => started, src: () => src, level: () => level, phone: () => ({ body: !!body, lastBodyAt, src, now: performance.now() }) };
  {
    const words = () => {
      const out = [];
      for (const id of ["msg", "sub"]) {
        const e = document.getElementById(id);
        if (!e || !e.textContent || +getComputedStyle(e).opacity < 0.05 || getComputedStyle(e).display === "none") continue;
        const rg = document.createRange();
        rg.selectNodeContents(e);
        const r = rg.getBoundingClientRect();
        if (r.width) out.push(r);
      }
      return out;
    };
  }
  function drawnOnScreen() {
    if (!padFresh()) return null;
    const sc = (x, y) => {
      const v = new Vector3(x, y, FIG_Z).project(camera);
      return [(v.x + 1) / 2 * innerWidth, (1 - v.y) / 2 * innerHeight];
    };
    const c = sc(...pad.c), ce = sc(pad.c[0] + pad.r, pad.c[1]), h = sc(...pad.h), he = sc(pad.h[0] + pad.hr, pad.h[1]);
    const ray = new Raycaster();
    const fr = pad.e ? Math.hypot(...[0, 1].map((i) => sc(pad.h[0] + pad.er, pad.h[1])[i] - h[i])) : 0, e = pad.e ? sc(...pad.e) : null;
    return {
      x: c[0],
      y: c[1],
      r: Math.hypot(ce[0] - c[0], ce[1] - c[1]),
      z: pad.z,
      key: pad.key,
      hand: { x: h[0], y: h[1], r: Math.hypot(he[0] - h[0], he[1] - h[1]) },
      segs: [[h[0], h[1], c[0], c[1], Math.hypot(he[0] - h[0], he[1] - h[1])], ...e ? [[e[0], e[1], h[0], h[1], fr]] : []],
      bodyZ: FIG_Z,
      body: (x, y) => {
        ray.setFromCamera({ x: x / innerWidth * 2 - 1, y: -(y / innerHeight * 2 - 1) }, camera);
        const o = ray.ray.origin, d = ray.ray.direction, k = (FIG_Z - o.z) / d.z;
        return insideBody({ x: o.x + d.x * k, y: o.y + d.y * k, r: 0 });
      }
    };
  }
  drawScore();
  requestAnimationFrame(frame);
})().catch((e) => setTimeout(() => {
  throw e;
}));
