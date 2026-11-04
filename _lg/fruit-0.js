import {
  environment,
  flash,
  model,
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
  CanvasTexture,
  CatmullRomCurve3,
  CircleGeometry,
  Color,
  CylinderGeometry,
  DoubleSide,
  DynamicDrawUsage,
  Group,
  HemisphereLight,
  InstancedMesh,
  MathUtils,
  Matrix4,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Plane,
  PlaneGeometry,
  PointLight,
  Quaternion,
  Raycaster,
  SRGBColorSpace,
  ShadowMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  TubeGeometry,
  Vector3
} from "./chunk-4IYDSAYK.js";
import "./chunk-NWIHTO7D.js";

// bmpage:bmpage:fruit.html#0
(async () => {
  var _a;
  const BodyMovin = window.BodyMovin;
  const Q = new URLSearchParams(location.search), TV = Q.has("tv"), MUTE = Q.has("mute");
  const GAME_ID = "fruit", ROUND = Math.max(10, +Q.get("round") || 75);
  const rnd = (a, b) => a + Math.random() * (b - a), clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;
  const TAU = Math.PI * 2;
  window.__game = { round: ROUND, ready: false };
  const { scene, camera, renderer } = setup(document.getElementById("c"), { fov: 45 });
  renderer.localClippingEnabled = true;
  const ENV = "dry_orchard_meadow", D = 0.75;
  const SUN = new Vector3(0.751, 0.371, 0.546).normalize();
  camera.position.set(0, 1.25, 0);
  camera.lookAt(0, 1.13, -1);
  const hud = document.getElementById("hud"), ctx = hud.getContext("2d");
  let W = 0, H = 0, U = 0, DPR = 1, R0 = 60, planeH = 0.62, planeW = 1.1;
  function resize() {
    DPR = Math.min(2, devicePixelRatio || 1);
    W = hud.width = Math.round(innerWidth * DPR);
    H = hud.height = Math.round(innerHeight * DPR);
    U = Math.min(W, H);
    R0 = Math.max(0.075 * U, 0.048 * W);
    planeH = 2 * D * Math.tan(MathUtils.degToRad(camera.fov / 2));
    planeW = planeH * camera.aspect;
  }
  addEventListener("resize", () => setTimeout(resize, 0));
  resize();
  const ray = new Raycaster(), fruitPlane = new Plane(new Vector3(0, 0, 1), D), tmpV = new Vector3();
  function worldAt(x, y, out = new Vector3()) {
    ray.setFromCamera({ x: x * 2 - 1, y: -(y * 2 - 1) }, camera);
    if (!ray.ray.intersectPlane(fruitPlane, out)) out.set(0, 1.2, -D);
    return out;
  }
  function toScreen(v) {
    tmpV.copy(v).project(camera);
    return { x: (tmpV.x + 1) / 2, y: (1 - tmpV.y) / 2 };
  }
  const pxToWorld = (px) => px / H * planeH;
  const sunLight = sun(scene, { position: SUN.clone().multiplyScalar(9).add(new Vector3(0, 0.6, -2.4)).toArray(), target: [0, 0.6, -2.4], size: 3.2, intensity: 2.4, color: 16773596 });
  sunLight.shadow.camera.far = 30;
  sunLight.shadow.camera.updateProjectionMatrix();
  const ground = new Mesh(new PlaneGeometry(40, 40), new ShadowMaterial({ opacity: 0.42, color: 1054730 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  scene.add(new HemisphereLight(13624319, 5921322, 0.15));
  function canvasTex(draw, n = 512) {
    const c = document.createElement("canvas");
    c.width = c.height = n;
    const g = c.getContext("2d");
    draw(g, n / 2);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }
  function speckle(g, R, n, col, rr, inner = 0, outer = 0.95) {
    g.fillStyle = col;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * TAU, d = R * Math.sqrt(lerp(inner * inner, outer * outer, Math.random()));
      g.beginPath();
      g.arc(R + Math.cos(a) * d, R + Math.sin(a) * d, rr * (0.5 + Math.random()), 0, TAU);
      g.fill();
    }
  }
  function disc(g, R, r, fill) {
    g.fillStyle = fill;
    g.beginPath();
    g.arc(R, R, r, 0, TAU);
    g.fill();
  }
  function radial(g, R, stops, r1 = R) {
    const gr = g.createRadialGradient(R, R, 0, R, R, r1);
    stops.forEach(([o, c]) => gr.addColorStop(o, c));
    return gr;
  }
  const CAPS = {
    apple: (g) => {
      const R = 256;
      disc(g, R, R, "#a3122a");
      disc(g, R, R * 0.965, radial(g, R, [[0, "#fff2cf"], [0.6, "#fbeec5"], [1, "#efdca4"]]));
      speckle(g, R, 900, "rgba(255,255,240,0.35)", 2.2);
      g.strokeStyle = "rgba(205,180,110,0.45)";
      g.lineWidth = 3;
      g.beginPath();
      g.arc(R, R, R * 0.5, 0, TAU);
      g.stroke();
      g.fillStyle = "rgba(214,190,120,0.55)";
      g.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = i * TAU / 10, d = i % 2 ? R * 0.1 : R * 0.24;
        g.lineTo(R + Math.cos(a) * d, R + Math.sin(a) * d);
      }
      g.fill();
      for (let i = 0; i < 5; i++) {
        const a = i * TAU / 5 + 0.3;
        g.save();
        g.translate(R + Math.cos(a) * R * 0.14, R + Math.sin(a) * R * 0.14);
        g.rotate(a);
        g.fillStyle = "#4a2810";
        g.beginPath();
        g.ellipse(0, 0, R * 0.055, R * 0.028, 0, 0, TAU);
        g.fill();
        g.restore();
      }
    },
    pear: (g) => {
      const R = 256;
      disc(g, R, R, "#b58a3a");
      disc(g, R, R * 0.97, radial(g, R, [[0, "#fbf6dc"], [1, "#efe6b8"]]));
      speckle(g, R, 1400, "rgba(200,180,120,0.25)", 1.6);
      disc(g, R, R * 0.2, "rgba(225,210,150,0.6)");
      for (let i = 0; i < 4; i++) {
        const a = i * TAU / 4;
        g.fillStyle = "#3e2410";
        g.beginPath();
        g.ellipse(R + Math.cos(a) * R * 0.1, R + Math.sin(a) * R * 0.1, R * 0.04, R * 0.022, a, 0, TAU);
        g.fill();
      }
    },
    kiwi: (g) => {
      const R = 256;
      disc(g, R, R, "#6a4a22");
      disc(g, R, R * 0.96, radial(g, R, [[0, "#f2f8d0"], [0.22, "#d7ec8a"], [0.32, "#8ccc3a"], [1, "#5ea628"]]));
      g.strokeStyle = "rgba(230,250,190,0.35)";
      g.lineWidth = 2;
      for (let i = 0; i < 90; i++) {
        const a = i * TAU / 90;
        g.beginPath();
        g.moveTo(R + Math.cos(a) * R * 0.26, R + Math.sin(a) * R * 0.26);
        g.lineTo(R + Math.cos(a) * R * 0.92, R + Math.sin(a) * R * 0.92);
        g.stroke();
      }
      for (let i = 0; i < 110; i++) {
        const a = Math.random() * TAU, d = R * rnd(0.27, 0.36);
        g.save();
        g.translate(R + Math.cos(a) * d, R + Math.sin(a) * d);
        g.rotate(a);
        g.fillStyle = "#16120a";
        g.beginPath();
        g.ellipse(0, 0, R * 0.022, R * 0.011, 0, 0, TAU);
        g.fill();
        g.restore();
      }
    },
    citrus: (rind, pith, flesh, hi) => (g) => {
      const R = 256;
      disc(g, R, R, rind);
      disc(g, R, R * 0.93, pith);
      const n = 10;
      for (let i = 0; i < n; i++) {
        const a0 = i * TAU / n + 0.03, a1 = (i + 1) * TAU / n - 0.03;
        g.fillStyle = radial(g, R, [[0, hi], [0.5, flesh], [1, flesh]], R * 0.86);
        g.beginPath();
        g.moveTo(R + Math.cos((a0 + a1) / 2) * R * 0.07, R + Math.sin((a0 + a1) / 2) * R * 0.07);
        g.arc(R, R, R * 0.85, a0, a1);
        g.closePath();
        g.fill();
      }
      g.strokeStyle = "rgba(255,255,230,0.35)";
      g.lineWidth = 2;
      for (let i = 0; i < 260; i++) {
        const a = Math.random() * TAU, d = R * rnd(0.15, 0.8);
        g.beginPath();
        g.moveTo(R + Math.cos(a) * d, R + Math.sin(a) * d);
        g.lineTo(R + Math.cos(a) * (d + R * 0.06), R + Math.sin(a) * (d + R * 0.06));
        g.stroke();
      }
      disc(g, R, R * 0.06, pith);
    },
    pomegranate: (g) => {
      const R = 256;
      disc(g, R, R, "#6e1414");
      disc(g, R, R * 0.9, "#f1ddb8");
      for (let i = 0; i < 260; i++) {
        const a = Math.random() * TAU, d = R * Math.sqrt(Math.random()) * 0.8;
        const x = R + Math.cos(a) * d, y = R + Math.sin(a) * d, r = R * rnd(0.035, 0.05);
        g.fillStyle = radial(g, 0, [[0, "#ff5a6e"], [0.6, "#c2102c"], [1, "#7a0618"]], r);
        g.save();
        g.translate(x, y);
        g.beginPath();
        g.arc(0, 0, r, 0, TAU);
        g.fill();
        g.fillStyle = "rgba(255,230,235,0.7)";
        g.beginPath();
        g.arc(-r * 0.35, -r * 0.35, r * 0.25, 0, TAU);
        g.fill();
        g.restore();
      }
    },
    avocado: (g) => {
      const R = 256;
      disc(g, R, R, "#22380e");
      disc(g, R, R * 0.96, radial(g, R, [[0, "#f0ec9a"], [0.55, "#d8e27a"], [0.85, "#a6c94a"], [1, "#6f9a2a"]]));
      disc(g, R, R * 0.36, radial(g, R, [[0, "#a5683a"], [0.8, "#7a4622"], [1, "#5a3218"]], R * 0.36));
      g.fillStyle = "rgba(255,230,200,0.35)";
      g.beginPath();
      g.ellipse(R - R * 0.12, R - R * 0.12, R * 0.1, R * 0.05, -0.7, 0, TAU);
      g.fill();
    }
  };
  CAPS.lime = CAPS.citrus("#3f7a18", "#eef3cf", "#a9d64a", "#d8f08e");
  CAPS.lemon = CAPS.citrus("#e2b818", "#fbf6d6", "#fbe25e", "#fff6b0");
  const KINDS = [
    { name: "apple", model: "food_apple_01", size: 1, juice: "#efe2a8", cap: "apple", capTint: 11446424 },
    { name: "kiwi", model: "food_kiwi_01", size: 0.95, juice: "#8fd23a", cap: "kiwi" },
    { name: "lime", model: "food_lime_01", size: 0.92, juice: "#b9e05a", cap: "lime" },
    { name: "lemon", model: "lemon", size: 0.97, juice: "#ffe14a", cap: "lemon" },
    { name: "pomegranate", model: "food_pomegranate_01", size: 1.1, juice: "#b8102a", cap: "pomegranate" },
    { name: "avocado", model: "food_avocado_01", size: 1, juice: "#c8dc78", cap: "avocado" },
    { name: "pear", model: "food_pears_asian_01", size: 0.97, juice: "#f2eec8", cap: "pear", capTint: 10393738 }
  ];
  const POM = KINDS[4];
  async function prepareKind(k) {
    const g = await model(k.model);
    let mesh = null;
    g.traverse((o) => {
      if (o.isMesh && !mesh) mesh = o;
    });
    const geo = mesh.geometry.clone();
    geo.computeBoundingBox();
    const c = new Vector3();
    geo.boundingBox.getCenter(c);
    geo.translate(-c.x, -c.y, -c.z);
    const e = new Vector3();
    geo.boundingBox.getSize(e).multiplyScalar(0.5);
    const s = 1 / Math.cbrt(e.x * e.y * e.z);
    geo.scale(s, s, s);
    geo.computeBoundingSphere();
    k.geo = geo;
    k.ext = e.multiplyScalar(s);
    k.mat = mesh.material;
    k.mat.side = DoubleSide;
    k.capTex = canvasTex(CAPS[k.cap]);
  }
  const sparkTex = canvasTex((g, R) => {
    g.fillStyle = radial(g, R, [[0, "rgba(255,255,240,1)"], [0.15, "rgba(255,220,120,0.9)"], [0.45, "rgba(255,120,30,0.35)"], [1, "rgba(255,80,0,0)"]]);
    g.fillRect(0, 0, 2 * R, 2 * R);
  }, 128);
  const smokeTex = canvasTex((g, R) => {
    for (let i = 0; i < 14; i++) {
      const x = R + rnd(-0.35, 0.35) * R, y = R + rnd(-0.35, 0.35) * R, r = R * rnd(0.35, 0.6);
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, "rgba(255,255,255,0.22)");
      gr.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gr;
      g.fillRect(0, 0, 2 * R, 2 * R);
    }
  }, 128);
  let bombMat, capMat, fuseMat;
  function makeBomb() {
    const grp = new Group();
    const body = new Mesh(new SphereGeometry(1, 48, 32), bombMat);
    body.castShadow = true;
    grp.add(body);
    const cap = new Mesh(new CylinderGeometry(0.3, 0.34, 0.24, 24), capMat);
    cap.position.y = 0.97;
    cap.castShadow = true;
    grp.add(cap);
    const curve = new CatmullRomCurve3([new Vector3(0, 1.05, 0), new Vector3(0.08, 1.35, 0), new Vector3(0.3, 1.5, 0.05), new Vector3(0.48, 1.42, 0.08)]);
    const fuse = new Mesh(new TubeGeometry(curve, 16, 0.045, 8), fuseMat);
    fuse.castShadow = true;
    grp.add(fuse);
    const spark = new Sprite(new SpriteMaterial({ map: sparkTex, blending: AdditiveBlending, depthWrite: false, transparent: true }));
    spark.position.set(0.48, 1.42, 0.08);
    spark.scale.setScalar(0.7);
    grp.add(spark);
    grp.userData.spark = spark;
    return grp;
  }
  const MAXJ = 900, juiceMesh = new InstancedMesh(new SphereGeometry(1, 10, 8), new MeshPhysicalMaterial({ roughness: 0.04, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.02, transparent: true, opacity: 0.72, depthWrite: false, specularIntensity: 1, ior: 1.34 }), MAXJ);
  juiceMesh.instanceMatrix.setUsage(DynamicDrawUsage);
  juiceMesh.frustumCulled = false;
  juiceMesh.castShadow = false;
  juiceMesh.renderOrder = 2;
  scene.add(juiceMesh);
  const juice = [];
  const jM = new Matrix4(), jQ = new Quaternion(), jS = new Vector3(), jP = new Vector3(), UPV = new Vector3(0, 1, 0), jCol = new Color();
  for (let i = 0; i < MAXJ; i++) {
    juiceMesh.setMatrixAt(i, new Matrix4().makeScale(0, 0, 0));
    juiceMesh.setColorAt(i, jCol.set("#fff"));
  }
  function spray(pos, col, n, speed, opts = {}) {
    for (let i = 0; i < n && juice.length < MAXJ; i++) {
      const dir = new Vector3(rnd(-1, 1), rnd(-0.4, 1), rnd(-0.6, 1)).normalize();
      if (opts.along) dir.addScaledVector(opts.along, rnd(-1, 1) * 0.9).normalize();
      const sp = speed * rnd(0.3, 1.1);
      juice.push({ p: pos.clone().addScaledVector(dir, rnd(0, 0.6) * (opts.r || 0.03)), v: dir.multiplyScalar(sp), r: (opts.size || 35e-4) * rnd(0.5, 1.6), col: new Color(col).multiplyScalar(rnd(0.75, 1.05)), life: rnd(0.6, 1.2), t: 0 });
    }
  }
  function stepJuice(dt) {
    const g = 1.6 * planeH * 9.8 / 6;
    for (let i = juice.length - 1; i >= 0; i--) {
      const d = juice[i];
      d.t += dt;
      d.v.y -= g * dt;
      d.v.multiplyScalar(0.99);
      d.p.addScaledVector(d.v, dt);
      if (d.t > d.life || d.p.y < 0) juice.splice(i, 1);
    }
    for (let i = 0; i < MAXJ; i++) {
      const d = juice[i];
      if (!d) {
        jM.makeScale(0, 0, 0);
        juiceMesh.setMatrixAt(i, jM);
        continue;
      }
      const sp = d.v.length(), k = 1 - Math.max(0, (d.t - d.life * 0.7) / (d.life * 0.3));
      jQ.setFromUnitVectors(UPV, sp > 1e-3 ? jP.copy(d.v).divideScalar(sp) : UPV);
      jS.set(d.r * k, d.r * k * (1 + Math.min(2.2, sp * 0.8)), d.r * k);
      jM.compose(d.p, jQ, jS);
      juiceMesh.setMatrixAt(i, jM);
      juiceMesh.setColorAt(i, d.col);
    }
    juiceMesh.instanceMatrix.needsUpdate = true;
    juiceMesh.instanceColor.needsUpdate = true;
  }
  const puffs = [];
  function puff(pos, n, fire) {
    tmpV.copy(pos).project(camera);
    const x = (tmpV.x + 1) / 2 * W, y = (1 - tmpV.y) / 2 * H;
    for (let i = 0; i < n; i++) puffs.push({
      x: x + rnd(-1, 1) * U * 0.03,
      y: y + rnd(-1, 1) * U * 0.03,
      vx: rnd(-1, 1) * U * (fire ? 0.5 : 0.12),
      vy: rnd(-1.2, 0.3) * U * (fire ? 0.4 : 0.12),
      r0: U * (fire ? rnd(0.03, 0.06) : rnd(0.04, 0.07)),
      t: 0,
      life: fire ? rnd(0.25, 0.45) : rnd(1, 1.8),
      fire
    });
  }
  function stepPuffs(dt) {
    for (let i = puffs.length - 1; i >= 0; i--) {
      const p = puffs[i];
      p.t += dt;
      if (p.t > p.life) {
        puffs.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.95;
      p.vy = p.vy * 0.95 - U * 0.02 * dt;
    }
  }
  function drawPuffs() {
    for (const p of [...puffs.filter((q) => !q.fire), ...puffs.filter((q) => q.fire)]) {
      const k = p.t / p.life, r = p.r0 * (1 + (p.fire ? 2.5 : 2) * Math.sqrt(k)), a = 1 - k;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      if (p.fire) {
        g.addColorStop(0, "rgba(255,250,220,".concat(a, ")"));
        g.addColorStop(0.3, "rgba(255,170,60,".concat(0.8 * a, ")"));
        g.addColorStop(1, "rgba(255,90,10,0)");
        ctx.globalCompositeOperation = "lighter";
      } else {
        g.addColorStop(0, "rgba(70,66,60,".concat(0.55 * a, ")"));
        g.addColorStop(0.6, "rgba(90,86,80,".concat(0.3 * a, ")"));
        g.addColorStop(1, "rgba(90,86,80,0)");
        ctx.globalCompositeOperation = "source-over";
      }
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, TAU);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  }
  const sparkLights = [new PointLight(16752704, 0, 0.6, 2), new PointLight(16752704, 0, 0.6, 2)];
  sparkLights.forEach((l) => scene.add(l));
  let ac = null, master = null, dry = null, verbIn = null, noiseBuf = null, audioErrors = 0;
  function audioInit() {
    if (ac) {
      if (ac.state === "suspended") ac.resume().catch(() => {
      });
      return;
    }
    try {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      master = ac.createGain();
      master.gain.value = MUTE ? 0 : 0.8;
      const comp = ac.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 4;
      comp.attack.value = 4e-3;
      comp.release.value = 0.25;
      master.connect(comp);
      comp.connect(ac.destination);
      const len = ac.sampleRate * 1.1 | 0, ir = ac.createBuffer(2, len, ac.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const d = ir.getChannelData(ch);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
      }
      const verb = ac.createConvolver();
      verb.buffer = ir;
      verbIn = ac.createGain();
      const wet = ac.createGain();
      wet.gain.value = 0.18;
      verbIn.connect(verb);
      verb.connect(wet);
      wet.connect(master);
      dry = ac.createGain();
      dry.gain.value = 0.9;
      dry.connect(master);
      noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
      const nd = noiseBuf.getChannelData(0);
      for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
      if (ac.state === "suspended") ac.resume().catch(() => {
      });
    } catch (e) {
      ac = null;
      audioErrors++;
    }
  }
  addEventListener("pointerdown", () => {
    if (ac && ac.state === "suspended") ac.resume().catch(() => {
    });
  });
  function bus(pan = 0, send = 0.3) {
    const g = ac.createGain(), p = ac.createStereoPanner(), s = ac.createGain();
    p.pan.value = clamp(pan, -1, 1);
    s.gain.value = send;
    g.connect(p);
    p.connect(dry);
    p.connect(s);
    s.connect(verbIn);
    return g;
  }
  function tone(dest, type, f0, f1, t, dur, amp, attack = 3e-3) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur * 0.8);
    g.gain.setValueAtTime(1e-4, t);
    g.gain.exponentialRampToValueAtTime(Math.max(2e-4, amp), t + attack);
    g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
    o.connect(g);
    g.connect(dest);
    o.start(t);
    o.stop(t + dur + 0.05);
  }
  function nz(dest, t, dur, type, f0, f1, q, amp, attack = 2e-3) {
    const n = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    n.buffer = noiseBuf;
    f.type = type;
    f.Q.value = q;
    f.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(1e-4, t);
    g.gain.exponentialRampToValueAtTime(amp, t + attack);
    g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
    n.connect(f);
    f.connect(g);
    g.connect(dest);
    n.start(t, Math.random());
    n.stop(t + dur + 0.05);
  }
  const PENTA = [261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.26, 783.99, 880, 1046.5, 1174.66];
  const SND = {
    swish(v, pan) {
      const t = ac.currentTime, o = bus(pan, 0.1);
      nz(o, t, 0.18, "bandpass", 600, 3400, 1.2, 0.2 * v, 0.03);
    },
    slice(k, pan) {
      const t = ac.currentTime, o = bus(pan, 0.2);
      nz(o, t, 0.05, "highpass", 5200, 5200, 0.8, 0.2);
      nz(o, t + 4e-3, 0.09, "bandpass", 2600, 900, 1.2, 0.35, 2e-3);
      nz(o, t + 0.01, 0.22, "lowpass", 1800, 300, 3, 0.4, 4e-3);
      for (let i = 0; i < 5; i++) nz(o, t + 0.03 + Math.random() * 0.12, 0.03, "bandpass", 1200 + Math.random() * 2500, 1500, 4, 0.08);
      tone(o, "triangle", 440 * Math.pow(2, k / 12), 150, t, 0.13, 0.22);
    },
    bomb(pan) {
      const t = ac.currentTime, o = bus(pan, 0.5);
      tone(o, "sine", 110, 28, t, 0.9, 0.9, 5e-3);
      nz(o, t, 1.3, "lowpass", 2e3, 100, 0.8, 0.8, 3e-3);
      for (let i = 0; i < 16; i++) nz(o, t + 0.05 + Math.random() * 0.6, 0.03, "bandpass", 1500 + Math.random() * 3e3, 1500, 3, 0.14);
    },
    miss(pan) {
      const t = ac.currentTime, o = bus(pan, 0.2);
      nz(o, t, 0.12, "lowpass", 500, 200, 1, 0.25, 5e-3);
      tone(o, "sine", 120, 70, t, 0.18, 0.2, 5e-3);
    },
    combo(n) {
      const t = ac.currentTime, o = bus(0, 0.5);
      for (let i = 0; i < Math.min(6, n + 1); i++) {
        const f = PENTA[Math.min(PENTA.length - 1, 4 + i)];
        tone(o, "triangle", f, f, t + i * 0.06, 0.45, 0.12);
      }
    },
    beep(hi) {
      const t = ac.currentTime, o = bus(0, 0.3), f = hi ? 1046.5 : 523.25;
      tone(o, "triangle", f, f, t, hi ? 0.6 : 0.25, 0.2);
    },
    fanfare() {
      const t = ac.currentTime, o = bus(0, 0.6);
      [523.25, 659.26, 783.99, 1046.5].forEach((f, i) => {
        tone(o, "triangle", f, f, t + i * 0.11, 0.9, 0.15);
        tone(o, "sine", f / 2, f / 2, t + i * 0.11, 0.9, 0.08);
      });
    },
    chop(n) {
      const t = ac.currentTime, o = bus(0, 0.3);
      tone(o, "sine", 160 + n * 30, 70, t, 0.25, 0.5, 2e-3);
      nz(o, t, 0.14, "lowpass", 1800, 400, 1.5, 0.45);
    },
    mega(two) {
      const t = ac.currentTime, o = bus(0, 0.5);
      nz(o, t, 0.08, "highpass", 5e3, 5e3, 0.8, 0.3);
      nz(o, t, 0.5, "lowpass", 3e3, 250, 2, 0.7, 3e-3);
      tone(o, "sine", 140, 45, t, 0.5, 0.6);
      for (let i = 0; i < 18; i++) nz(o, t + 0.05 + Math.random() * 0.4, 0.03, "bandpass", 900 + Math.random() * 2500, 1200, 4, 0.1);
      [523.25, 659.26, 783.99, 1046.5, two ? 1318.5 : 0].forEach((f, i) => f && tone(o, "triangle", f, f, t + 0.05 + i * 0.05, 0.7, 0.11));
    },
    ready() {
      const t = ac.currentTime, o = bus(0, 0.5);
      [392, 523.25, 659.26, 783.99].forEach((f, i) => tone(o, "triangle", f, f, t + i * 0.07, 0.3, 0.08));
    },
    storm() {
      const t = ac.currentTime, o = bus(0, 0.7);
      nz(o, t, 1.2, "bandpass", 300, 4e3, 0.8, 0.35, 0.3);
      PENTA.forEach((f, i) => tone(o, "triangle", f, f, t + i * 0.045, 0.6, 0.08));
    },
    click() {
      const t = ac.currentTime, o = bus(0, 0.2);
      tone(o, "sine", 880, 1320, t, 0.12, 0.12);
    },
    toss(pan) {
      const t = ac.currentTime, o = bus(pan, 0.05);
      nz(o, t, 0.22, "bandpass", 300, 900, 1, 0.04, 0.08);
    }
  };
  function play(name, ...a) {
    if (!ac) return;
    try {
      SND[name](...a);
    } catch (e) {
      audioErrors++;
    }
  }
  let state2 = "loading", tState = 0, roundStart = 0, lastNow = 0, frames = 0;
  let megas = 0, megaX = 0, storms = 0, stormMeter = 0, stormReadyAt = 0, stormUntil = 0, nextMega = 0, nextFountain = 0;
  const STORM_FULL = 14;
  let score = 0, sliced = 0, missed = 0, bombsHit = 0, streak = 0, bestStreak = 0, maxCombo = 0, spawned = 0, ease = 0;
  let combo = 0, comboT = 0, comboX = 0, comboY = 0, nextSpawn = 0, nextAttract = 0, scoreBump = 0;
  let endStats = null, tvAutoAt = 0, armedAt = 0, focus = 0, lastBeep = -1;
  const fruits = [], pieces = [], texts = [], cuts = [], queue = [], lens = [];
  const blades = { left: [], right: [] }, prevPx = { left: null, right: null }, lastSwish = { left: 0, right: 0 };
  const clicks = [];
  let keyPress = null;
  addEventListener("pointerdown", (e) => clicks.push({ x: e.clientX * DPR, y: e.clientY * DPR }));
  addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      keyPress = "enter";
      e.preventDefault();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Tab") {
      keyPress = e.key === "ArrowLeft" ? "left" : "right";
      e.preventDefault();
    } else if (e.key === "Escape") keyPress = "escape";
  });
  function spawnFruit(opts = {}) {
    const bomb = !!opts.bomb, fast = !!opts.fast, mega = !!opts.mega, s = fast ? 1.55 : 1;
    const kind = bomb ? null : mega ? POM : opts.kind || KINDS[Math.random() * KINDS.length | 0];
    let x0 = opts.x0 !== void 0 ? opts.x0 : rnd(0.26, 0.74), apex = fast ? rnd(0.24, 0.38) : mega ? rnd(0.34, 0.44) : rnd(0.25, 0.46);
    if (mega) x0 = rnd(0.35, 0.65);
    if (opts.apex !== void 0) apex = opts.apex;
    const g = 1.25 * s * s * (1 - 0.28 * ease) * (opts.gentle ? 0.8 : 1) * (mega ? 0.5 : 1);
    const rise = 1.14 - apex, vy = -Math.sqrt(2 * g * rise), T = 2 * Math.sqrt(2 * rise / g);
    const xEnd = opts.xEnd !== void 0 ? opts.xEnd : mega ? clamp(x0 + rnd(-0.1, 0.1), 0.3, 0.7) : clamp(lerp(x0 + rnd(-0.4, 0.4), 0.5, 0.35), 0.24, 0.76);
    const f = {
      kind,
      bomb,
      fast,
      mega,
      x: x0,
      y: mega ? 1.3 : 1.14,
      vx: (xEnd - x0) / T,
      vy: mega ? vy * 1.08 : vy,
      g,
      rot: rnd(0, TAU),
      spin: mega ? rnd(-0.6, 0.6) : rnd(-2.5, 2.5),
      ax: rnd(0, TAU),
      ay: rnd(0, TAU),
      sx: rnd(-2, 2),
      sy: rnd(-2, 2),
      r: bomb ? 0.95 : mega ? 2 : kind.size,
      touch: 0,
      attract: state2 !== "play",
      born: lastNow,
      hit: { left: 0, right: 0 },
      chops: 0,
      storm: !!opts.storm,
      bh: 0
    };
    f.obj = bomb ? makeBomb() : new Mesh(kind.geo, kind.mat);
    f.obj.castShadow = true;
    scene.add(f.obj);
    fruits.push(f);
    if (state2 === "play") spawned++;
    play("toss", (x0 - 0.5) * 1.4);
    return f;
  }
  function removeFruit(f) {
    scene.remove(f.obj);
    if (f.light) f.light.intensity = 0;
  }
  function wave(now) {
    const t = (now - roundStart) / 1e3, p = clamp(t / ROUND, 0, 1);
    let n = 1 + (Math.random() < lerp(0.15, 0.75, p) ? 1 : 0) + (Math.random() < lerp(0, 0.5, p) ? 1 : 0) + (p > 0.55 && Math.random() < 0.35 ? 1 : 0);
    if (ease > 0.45) n = Math.min(n, 1);
    else if (ease > 0.2) n = Math.min(n, 2);
    const bombsUp = fruits.filter((f) => f.bomb).length;
    for (let i = 0; i < n; i++) {
      const bomb = t > 7 && bombsUp + queue.filter((q) => q.bomb).length < 2 && Math.random() < lerp(0.07, 0.17, p) * (1 - ease);
      const fast = !bomb && t > 18 && Math.random() < lerp(0.05, 0.38, p) * (1 - 0.8 * ease);
      queue.push({ at: now + i * rnd(140, 300), bomb, fast });
    }
  }
  function segDist(ax, ay, bx, by, cx, cy, ys) {
    ay *= ys;
    by *= ys;
    cy *= ys;
    const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
    const t = l2 ? clamp(((cx - ax) * dx + (cy - ay) * dy) / l2, 0, 1) : 0;
    return Math.hypot(ax + t * dx - cx, ay + t * dy - cy);
  }
  const FAST = 0.9, MEDIUM = 0.42, SWIPE = 0.6;
  function checkHands(now, dt) {
    for (const side of ["left", "right"]) {
      const h = BodyMovin.hands[side];
      if (!h.seen) {
        prevPx[side] = null;
        continue;
      }
      const px = h.x * W, py = h.y * H, p0 = prevPx[side] || { x: px, y: py };
      prevPx[side] = { x: px, y: py };
      const spd = Math.max(h.speed, Math.hypot((px - p0.x) / W, (py - p0.y) / H) / Math.max(dt, 1 / 120)), handR = U * 0.03;
      const bl = blades[side];
      bl.push({ x: px, y: py, t: now, s: h.speed });
      while (bl.length && now - bl[0].t > 160) bl.shift();
      if (h.speed > 1.15 && now - lastSwish[side] > 260) {
        lastSwish[side] = now;
        play("swish", clamp(h.speed / 2.2, 0.3, 1), h.x * 2 - 1);
      }
      if (state2 === "end" || state2 === "count" || state2 === "loading") continue;
      const up = h.raised !== false || BodyMovin.mouse || BodyMovin.simulating, moving = h.speed > MEDIUM;
      if (!up && !moving) {
        for (const f of fruits) if (f.bomb) f["t" + side] = 0;
        continue;
      }
      for (const f of fruits) {
        if (f.dead) continue;
        const r = f.r * R0, cx = f.x * W, cy = f.y * H;
        if (f.mega) {
          const dx = (px - cx) / (r * 1.3), dy = (py - cy) / (r * 1.45), inside2 = dx * dx + dy * dy < 1;
          if (inside2 && !f["in" + side]) {
            f["in" + side] = true;
            f.hit[side] = now;
            const other = f.hit[side === "left" ? "right" : "left"];
            if (other && now - other < 750) {
              megaSlice(f, now, true);
              continue;
            }
            if (now - (f.lastChop || 0) > 300 && !f.pending) {
              f.lastChop = now;
              f.pending = { at: now + 400, side };
            }
          } else if (!inside2) f["in" + side] = false;
          continue;
        }
        if (f.bomb) {
          const d2 = segDist(p0.x, p0.y, px, py, cx, cy, 1), inside2 = Math.hypot(px - cx, py - cy) < r * 0.8;
          const tk = "t" + side, bk = "b" + side;
          if (inside2) f[tk] = (f[tk] || 0) + dt;
          else f[tk] = Math.max(0, (f[tk] || 0) - dt);
          if (h.speed > FAST && d2 < r * 0.8) f[bk] = (f[bk] || 0) + 1;
          else f[bk] = 0;
          f.touch = Math.max(f.tleft || 0, f.tright || 0);
          f.bh = Math.max(f.bleft || 0, f.bright || 0);
          if (f[bk] >= 2 || f[tk] > 0.45) hitBomb(f, now);
          continue;
        }
        const d = segDist(p0.x, p0.y, px, py, cx, cy, 1 / 1.35), inside = d < r * 1.4 + handR;
        let aimed = false;
        if (spd > FAST * 1.2 && d < r * 2.1) {
          const vx = h.vx * W, vy = h.vy * H, tx = cx - px, ty = cy - py, l = Math.hypot(vx, vy) * Math.hypot(tx, ty);
          aimed = l > 0 && (vx * tx + vy * ty) / l > 0.6;
        }
        if (inside) f.touch += dt;
        if (inside && spd > SWIPE || aimed) {
          const seg = Math.hypot(px - p0.x, py - p0.y) > 2, ang = seg ? Math.atan2(py - p0.y, px - p0.x) : spd > 0.15 ? Math.atan2(h.vy * H, h.vx * W) : -0.7;
          sliceFruit(f, ang, now, side);
        }
      }
    }
  }
  function makePieces(f, planes, now) {
    const k = f.kind, rW = f.obj.scale.x, pos = f.obj.position.clone(), q = f.obj.quaternion.clone(), qi = q.clone().invert();
    const vel = new Vector3(f.vx * planeW, -f.vy * planeH, 0), combos = planes.length === 1 ? [[1], [-1]] : [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    for (const signs of combos) {
      const grp = new Group();
      grp.position.copy(pos);
      scene.add(grp);
      const normals = planes.map((n, i) => n.clone().multiplyScalar(signs[i]));
      const local = normals.map((n) => new Plane(n.clone(), 0)), world = local.map((p) => p.clone());
      const skin = k.mat.clone();
      skin.clippingPlanes = world;
      skin.clipShadows = true;
      skin.side = DoubleSide;
      const m = new Mesh(k.geo, skin);
      m.quaternion.copy(q);
      m.scale.setScalar(rW);
      m.castShadow = true;
      grp.add(m);
      const caps = [];
      normals.forEach((n, i) => {
        const u = new Vector3().crossVectors(n, Math.abs(n.z) < 0.9 ? new Vector3(0, 0, 1) : new Vector3(1, 0, 0)).normalize(), v = new Vector3().crossVectors(n, u);
        const rad = (a) => {
          const l = a.clone().applyQuaternion(qi);
          return 1 / Math.sqrt((l.x / k.ext.x) ** 2 + (l.y / k.ext.y) ** 2 + (l.z / k.ext.z) ** 2);
        };
        const cm = new MeshPhysicalMaterial({
          color: k.capTint || 13157564,
          map: k.capTex,
          bumpMap: k.capTex,
          bumpScale: 2,
          roughness: 0.42,
          clearcoat: 1,
          clearcoatRoughness: 0.18,
          side: DoubleSide,
          clippingPlanes: world.filter((_, j) => j !== i),
          polygonOffset: true,
          polygonOffsetFactor: -1
        });
        const cap = new Mesh(new CircleGeometry(1, 48), cm);
        cap.quaternion.setFromRotationMatrix(new Matrix4().makeBasis(v, u, n.clone().negate()));
        cap.scale.set(rad(v) * rW * 0.97, rad(u) * rW * 0.97, 1);
        cap.castShadow = true;
        grp.add(cap);
        caps.push(cap);
      });
      const out = normals.reduce((a, n) => a.add(n), new Vector3()).normalize();
      const push = (planes.length > 1 ? 0.42 : 0.26) * planeH;
      pieces.push({
        grp,
        local,
        world,
        mats: [skin, ...caps.map((c) => c.material)],
        v: vel.clone().addScaledVector(out, push).add(new Vector3(0, 0.28 * planeH, rnd(-0.12, 0.2))),
        w: new Vector3(rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)).normalize().multiplyScalar(rnd(2, 5)),
        g: 0.95 * planeH,
        born: now
      });
    }
  }
  function stepPieces(dt, now) {
    for (let i = pieces.length - 1; i >= 0; i--) {
      const p = pieces[i];
      p.v.y -= p.g * dt;
      p.grp.position.addScaledVector(p.v, dt);
      p.grp.quaternion.premultiply(new Quaternion().setFromAxisAngle(p.w.clone().normalize(), p.w.length() * dt));
      p.grp.updateMatrixWorld(true);
      p.local.forEach((pl, j) => p.world[j].copy(pl).applyMatrix4(p.grp.matrixWorld));
      if (p.grp.position.y < camera.position.y - planeH * 0.9 || now - p.born > 4e3) {
        scene.remove(p.grp);
        p.mats.forEach((m) => m.dispose());
        p.grp.children.forEach((c) => c.isMesh && c.geometry.type === "CircleGeometry" && c.geometry.dispose());
        pieces.splice(i, 1);
      }
    }
  }
  function cutNormal(ang) {
    return new Vector3(Math.sin(ang), Math.cos(ang), 0);
  }
  function sliceFruit(f, ang, now, side) {
    f.dead = true;
    const k = f.kind, r = f.r * R0, x = f.x * W, y = f.y * H, scoring = state2 === "play" && !f.attract;
    makePieces(f, [cutNormal(ang)], now);
    const pos = f.obj.position.clone();
    spray(pos, k.juice, 70, 0.9 * planeH, { along: new Vector3(Math.cos(ang), -Math.sin(ang), 0), r: f.obj.scale.x, size: 24e-4 });
    removeFruit(f);
    cuts.push({ x, y, ang, len: r * 3, t: now });
    if (Math.random() < 0.2 || scoring && combo >= 2) lensSplash(k.juice, 3 + (Math.random() * 3 | 0), x, y);
    if (!scoring) {
      play("slice", 0, f.x * 2 - 1);
      return;
    }
    sliced++;
    streak++;
    bestStreak = Math.max(bestStreak, streak);
    ease = Math.max(0, ease - 0.05);
    if (now < stormUntil) {
    } else if (now - comboT < 320) combo++;
    else {
      finishCombo();
      combo = 1;
    }
    comboT = now;
    comboX = x;
    comboY = y;
    const mult = 1 + Math.min(3, Math.floor(streak / 6)), pts = (f.fast ? 20 : 10) * mult * (now < stormUntil ? 2 : 1);
    if (now >= stormUntil && !stormReadyAt) addStorm(1);
    score += pts;
    scoreBump = 1;
    texts.push({ x, y: y - r * 0.6, text: "+" + pts, col: f.fast ? "#ffe680" : "#ffffff", size: 0.055, t: now, life: 800 });
    if (streak > 0 && streak % 6 === 0 && mult <= 4 && streak <= 18) banner("x".concat(mult, " STREAK!"), "#9dffcf", 0.07, 1100);
    play("slice", Math.min(12, combo * 2 + (f.fast ? 3 : 0)), f.x * 2 - 1);
    shake(0.08);
  }
  function chopFx(f, now, side) {
    const r = f.r * R0;
    spray(f.obj.position, f.kind.juice, 26, 0.6 * planeH, { r: f.obj.scale.x });
    shake(0.25);
    play("chop", f.chops);
    f.vy -= 0.12;
    f.spin += (side === "left" ? 1 : -1) * 0.8;
    if (state2 === "play") texts.push({ x: f.x * W, y: f.y * H - r * 1.15, text: f.chops < 3 ? "CHOP ".concat(f.chops, "/3") : "", col: "#ffe680", size: 0.05, t: now, life: 600 });
  }
  function megaSlice(f, now, twoHands) {
    f.dead = true;
    const scoring = state2 === "play" && !f.attract;
    makePieces(f, twoHands ? [cutNormal(Math.PI / 4), cutNormal(-Math.PI / 4)] : [cutNormal(-0.3)], now);
    spray(f.obj.position, f.kind.juice, 220, 1.2 * planeH, { r: f.obj.scale.x * 0.8, size: 5e-3 });
    removeFruit(f);
    const x = f.x * W, y = f.y * H, r = f.r * R0;
    if (twoHands) for (const a of [Math.PI / 4, -Math.PI / 4]) cuts.push({ x, y, ang: a, len: r * 3.2, t: now });
    else cuts.push({ x, y, ang: -0.3, len: r * 3, t: now });
    lensSplash(f.kind.juice, 9, x, y);
    shake(0.9);
    flash(16773848, 0.35);
    play("mega", twoHands);
    if (!scoring) return;
    megas++;
    if (twoHands) megaX++;
    const pts = twoHands ? 100 : 50;
    score += pts;
    scoreBump = 2;
    streak++;
    sliced++;
    addStorm(twoHands ? 5 : 3);
    combo = 0;
    banner(twoHands ? "DOUBLE SLASH!  +".concat(pts) : "GIANT CHOP!  +".concat(pts), "#ffd84a", 0.09, 1500);
  }
  function addStorm(n) {
    if (state2 !== "play" || lastNow < stormUntil || stormReadyAt) return;
    stormMeter = Math.min(STORM_FULL, stormMeter + n);
    if (stormMeter >= STORM_FULL) {
      stormReadyAt = lastNow;
      play("ready");
      if (BodyMovin.recent && BodyMovin.recent("jump", 300)) unleashStorm(lastNow, "buffered");
    }
  }
  function unleashStorm(now, how) {
    if (state2 !== "play" || !stormReadyAt) return;
    stormReadyAt = 0;
    stormMeter = 0;
    storms++;
    stormUntil = now + 5500;
    nextFountain = now;
    for (const f of fruits) if (f.bomb && !f.dead) {
      f.dead = true;
      puff(f.obj.position, 6, false);
      removeFruit(f);
    }
    queue.length = 0;
    flash(16771248, 0.4);
    shake(0.4);
    play("storm");
    banner("JUICE STORM!", "#ffb347", 0.12, 1600);
    void how;
  }
  for (const ev of ["jump", "starjump", "squat"]) BodyMovin.on(ev, () => unleashStorm(lastNow, ev));
  function banner(text, col, size, life, y = 0.4) {
    for (let i = texts.length - 1; i >= 0; i--) if (texts[i].banner) texts.splice(i, 1);
    texts.push({ x: W * 0.025, y: H * 0.34, text, col, size, t: lastNow, life, banner: true, side: true });
  }
  function finishCombo() {
    if (combo >= 2) {
      const bonus = 10 * combo;
      score += bonus;
      maxCombo = Math.max(maxCombo, combo);
      scoreBump = 1.5;
      banner("".concat(combo, "x COMBO!  +").concat(bonus), "#ffd84a", 0.08, 1300);
      play("combo", combo);
    }
    combo = 0;
  }
  function hitBomb(f, now) {
    f.dead = true;
    puff(f.obj.position, 10, true);
    puff(f.obj.position, 12, false);
    spray(f.obj.position, "#2a2622", 40, 1.1 * planeH, { r: f.obj.scale.x });
    removeFruit(f);
    shake(1.2);
    flash(16767136, 0.55);
    play("bomb", f.x * 2 - 1);
    if (state2 === "play" && !f.attract) {
      bombsHit++;
      const lost = Math.min(score, 25);
      score -= lost;
      streak = 0;
      combo = 0;
      texts.push({ x: f.x * W, y: f.y * H - U * 0.08, text: lost ? "BOMB! -".concat(lost) : "BOMB!", col: "#ff7a5a", size: 0.075, t: now, life: 1200 });
    }
  }
  function lensSplash(col, n, x, y) {
    for (let i = 0; i < n; i++) lens.push({ x: clamp(x + rnd(-1, 1) * U * 0.35, 0, W), y: clamp(y + rnd(-1, 1) * U * 0.3, 0, H), r: U * rnd(0.012, 0.045), col, t: lastNow, life: rnd(1800, 3200), vy: rnd(2e-3, 0.012) * U });
  }
  const FONT = '-apple-system, "SF Pro Display", "Segoe UI", system-ui, sans-serif';
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
  const font = (wt, px) => "".concat(wt, " ").concat(Math.round(px), "px ").concat(FONT);
  function rgba(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return "rgba(".concat(n >> 16, ",").concat(n >> 8 & 255, ",").concat(n & 255, ",").concat(clamp(a, 0, 1), ")");
  }
  function label(text, x, y, px, col = "#fff", wt = 800, align = "center") {
    ctx.font = font(wt, px);
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(2, px * 0.09);
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.strokeText(text, x, y);
    ctx.shadowColor = "rgba(0,0,0,0.55)";
    ctx.shadowBlur = px * 0.3;
    ctx.shadowOffsetY = px * 0.05;
    ctx.fillStyle = col;
    ctx.fillText(text, x, y);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  }
  function panel(x, y, w, h, r = U * 0.03, a = 0.42) {
    ctx.save();
    ctx.fillStyle = "rgba(12,16,10,".concat(a, ")");
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = Math.max(1.5, U * 2e-3);
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  function UI() {
    const vm = Math.min(innerWidth, innerHeight) / 100, d = DPR;
    const T = Math.max(10, 1.8 * vm), Hh = Math.max(36, 5.6 * vm), Wb = Math.max(108, 15 * vm), G = Math.max(8, 1.2 * vm);
    return { vm: vm * d, T: T * d, L: T * d, Hh: Hh * d, Wb: Wb * d, G: G * d, right: (T + 2 * Wb + 2 * G + Hh) * d, fs: Math.max(14, 1.9 * vm) * d };
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
  function drawBlades(now) {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const side of ["left", "right"]) {
      const bl = blades[side];
      if (bl.length < 2 || !BodyMovin.hands[side].seen) continue;
      for (let i = 1; i < bl.length; i++) {
        const a = bl[i - 1], b = bl[i], age = (now - b.t) / 160, k = (1 - age) * clamp(b.s / 1, 0, 1.3);
        if (k <= 0.03) continue;
        ctx.strokeStyle = "rgba(255,255,255,".concat(0.16 * k, ")");
        ctx.lineWidth = U * 0.04 * k;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.strokeStyle = "rgba(255,255,255,".concat(0.85 * k, ")");
        ctx.lineWidth = U * 6e-3 * k;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
    for (let i = cuts.length - 1; i >= 0; i--) {
      const c = cuts[i], k = 1 - (now - c.t) / 180;
      if (k <= 0) {
        cuts.splice(i, 1);
        continue;
      }
      const dx = Math.cos(c.ang) * c.len / 2, dy = Math.sin(c.ang) * c.len / 2;
      ctx.strokeStyle = "rgba(255,255,255,".concat(0.9 * k, ")");
      ctx.lineWidth = U * 6e-3 * k;
      ctx.beginPath();
      ctx.moveTo(c.x - dx, c.y - dy);
      ctx.lineTo(c.x + dx, c.y + dy);
      ctx.stroke();
    }
    ctx.restore();
  }
  const grain = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d"), im = g.createImageData(256, 256);
    for (let i = 0; i < im.data.length; i += 4) {
      const v = 128 + (Math.random() - 0.5) * 90;
      im.data[i] = im.data[i + 1] = im.data[i + 2] = v;
      im.data[i + 3] = 7;
    }
    g.putImageData(im, 0, 0);
    return c;
  })();
  let grainPat = null;
  function drawFilm(now) {
    grainPat || (grainPat = ctx.createPattern(grain, "repeat"));
    ctx.save();
    ctx.translate(Math.random() * 256 | 0, Math.random() * 256 | 0);
    ctx.fillStyle = grainPat;
    ctx.fillRect(-256, -256, W + 512, H + 512);
    ctx.restore();
  }
  function drawLens(now) {
    for (let i = lens.length - 1; i >= 0; i--) {
      const d = lens[i], k = (now - d.t) / d.life;
      if (k >= 1) {
        lens.splice(i, 1);
        continue;
      }
      d.y += d.vy * 0.016 * (k > 0.3 ? 1 : 0.2);
      const a = k < 0.05 ? k / 0.05 : 1 - Math.max(0, (k - 0.6) / 0.4);
      ctx.save();
      ctx.globalAlpha = a;
      const g = ctx.createRadialGradient(d.x - d.r * 0.2, d.y - d.r * 0.25, d.r * 0.1, d.x, d.y, d.r);
      g.addColorStop(0, rgba(d.col, 0.06));
      g.addColorStop(0.75, rgba(d.col, 0.14));
      g.addColorStop(0.92, "rgba(0,0,0,0.14)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(d.x, d.y, d.r, d.r * 1.08, 0, 0, TAU);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.beginPath();
      ctx.ellipse(d.x - d.r * 0.35, d.y - d.r * 0.4, d.r * 0.22, d.r * 0.12, -0.6, 0, TAU);
      ctx.fill();
      ctx.restore();
    }
  }
  function drawTexts(now) {
    for (let i = texts.length - 1; i >= 0; i--) {
      const t = texts[i], k = (now - t.t) / t.life;
      if (k >= 1) {
        texts.splice(i, 1);
        continue;
      }
      if (!t.text) continue;
      const pop = k < 0.15 ? 0.6 + k / 0.15 * 0.5 : 1.1 - Math.min(0.1, k - 0.15);
      if (t.side) {
        const L = sideLines(t.text, sidePx(W, H) * pop, sideW(W, H, 0.2), (px) => font(900, px)), y0 = t.y - k * U * 0.06;
        ctx.save();
        ctx.globalAlpha = k > 0.7 ? (1 - k) / 0.3 : 1;
        L.lines.forEach((l, j) => label(l, t.x, y0 + j * L.px * 1.1, L.px, t.col, 900, "left"));
        ctx.restore();
        tipAvoid.push({ x: t.x / DPR, y: (y0 - L.px * 0.6) / DPR, w: L.w / DPR, h: L.h / DPR });
        continue;
      }
      ctx.save();
      ctx.globalAlpha = k > 0.7 ? (1 - k) / 0.3 : 1;
      label(t.text, t.x, t.y - k * U * 0.06, t.size * U * pop, t.col, 900);
      {
        const sz = t.size * U * pop;
        ctx.font = font(900, sz);
        const tw = ctx.measureText(t.text).width;
        tipAvoid.push({ x: (t.x - tw / 2) / DPR, y: (t.y - k * U * 0.06 - sz * 0.6) / DPR, w: tw / DPR, h: sz * 1.2 / DPR });
      }
      ctx.restore();
    }
  }
  function drawMegaSign(f, now) {
    const r = f.r * R0, x = f.x * W, y = f.y * H, pulse = 0.5 + 0.5 * Math.sin(now / 160);
    ctx.save();
    ctx.strokeStyle = "rgba(255,236,170,".concat(0.55 + 0.4 * pulse, ")");
    ctx.lineWidth = U * 6e-3;
    ctx.setLineDash([U * 0.03, U * 0.018]);
    ctx.lineDashOffset = -now / 30;
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = U * 0.01;
    ctx.beginPath();
    ctx.arc(x, y, r * 1.2, 0, TAU);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;
    const ly = y - r * 1.42 < H * 0.2 ? y + r * 1.42 : y - r * 1.42;
    label("✋ BOTH HANDS! ✋", x, ly, U * 0.045, "#fff3c0", 900);
    ctx.restore();
  }
  function drawBombWarn(f, now) {
    const r = f.r * R0, x = f.x * W, y = f.y * H, pulse = 0.5 + 0.5 * Math.sin(now / 110);
    ctx.save();
    ctx.strokeStyle = "rgba(255,60,40,".concat(0.35 + 0.35 * pulse, ")");
    ctx.lineWidth = U * 5e-3;
    ctx.beginPath();
    ctx.arc(x, y, r * 1.25, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }
  let buttons = [];
  function button(id, label_, x, y, w, h, opts = {}) {
    const b = { id, label: label_, x, y, w, h, ms: opts.ms || 700, small: !!opts.small, fill: 0, action: opts.action };
    buttons.push(b);
    return b;
  }
  function processButtons(now) {
    let fired = null;
    const big = buttons.filter((b) => !b.small);
    buttons.forEach((b) => {
      const over = now > armedAt && BodyMovin.handOver(b, W, H);
      const f = BodyMovin.dwell(b.id, over, now, b.ms);
      if (f === 1) fired = b;
      else b.fill = f;
      b.over = over;
      for (const c of clicks) if (c.x > b.x && c.x < b.x + b.w && c.y > b.y && c.y < b.y + b.h) fired = b;
      if (keyPress === "enter" && !b.small && big.indexOf(b) === focus) fired = b;
    });
    if ((keyPress === "left" || keyPress === "right") && big.length) focus = (focus + (keyPress === "left" ? -1 : 1) + big.length) % big.length;
    if (keyPress === "escape" && state2 === "play") fired = buttons.find((b) => b.id === "home") || { action: goHome };
    if (fired) {
      play("click");
      fired.action(now);
    }
  }
  function drawButton(b, focused, now) {
    ctx.save();
    const path = new Path2D();
    path.roundRect(b.x, b.y, b.w, b.h, b.h / 2);
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = U * 0.02;
    ctx.shadowOffsetY = U * 6e-3;
    ctx.fillStyle = "rgba(10,12,24,0.55)";
    ctx.fill(path);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    if (b.fill > 0) {
      ctx.save();
      ctx.clip(path);
      const g = ctx.createLinearGradient(b.x, 0, b.x + b.w, 0);
      g.addColorStop(0, "rgba(255,190,70,0.95)");
      g.addColorStop(1, "rgba(255,110,60,0.95)");
      ctx.fillStyle = g;
      ctx.fillRect(b.x, b.y, b.w * b.fill, b.h);
      ctx.restore();
    }
    const hot = focused || b.over, pulse = 0.5 + 0.5 * Math.sin(now / 300);
    ctx.lineWidth = b.small ? DPR : Math.max(2, U * 5e-3);
    ctx.strokeStyle = hot ? "rgba(255,225,160,".concat(0.8 + 0.2 * pulse, ")") : b.small ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.55)";
    ctx.beginPath();
    ctx.roundRect(b.x, b.y, b.w, b.h, b.h / 2);
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.font = font(800, b.small ? UI().fs : b.h * 0.42);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(b.label, b.x + b.w / 2, b.y + b.h / 2 + b.h * 0.02);
    ctx.restore();
  }
  function startRound(now) {
    audioInit();
    try {
      BodyMovin.music && BodyMovin.music(GAME_ID);
    } catch (e) {
    }
    score = sliced = missed = bombsHit = streak = bestStreak = maxCombo = spawned = combo = 0;
    megas = megaX = storms = stormMeter = stormReadyAt = stormUntil = 0;
    ease = 0;
    endStats = null;
    scoreBump = 0;
    for (const f of fruits) removeFruit(f);
    fruits.length = queue.length = texts.length = 0;
    BodyMovin.activity.activeSec = 0;
    BodyMovin.activity.kcal = 0;
    state2 = "count";
    tState = now;
    lastBeep = -1;
  }
  function endRound(now) {
    finishCombo();
    const prevBest = BodyMovin.best(GAME_ID), act = { min: BodyMovin.activity.activeSec / 60, kcal: BodyMovin.activity.kcal };
    BodyMovin.saveSession({ game: GAME_ID, score });
    if (BodyMovin.highScores) BodyMovin.highScores(GAME_ID, score);
    endStats = { megas, megaX, storms, score, prevBest, best: Math.max(prevBest, score), newBest: score > prevBest && score > 0, activeMin: act.min, kcal: act.kcal, sliced, missed, bombsHit, maxCombo, bestStreak };
    for (const f of fruits) if (f.bomb) {
      f.dead = true;
      puff(f.obj.position, 6, false);
      removeFruit(f);
    }
    state2 = "end";
    tState = now;
    armedAt = now + 1500;
    focus = 0;
    queue.length = 0;
    play("fanfare");
  }
  const goHome = () => {
    location.href = "index.html";
  };
  let last3D = 0;
  function frame(now) {
    BodyMovin.update(now);
    const dt = Math.min(0.05, Math.max(1e-3, (now - (lastNow || now)) / 1e3));
    lastNow = now;
    frames++;
    buttons = [];
    if (state2 === "title") {
      if (now > nextAttract) {
        spawnFruit({ gentle: true });
        nextAttract = now + rnd(1100, 1700);
      }
      for (const f of fruits) if (!f.dead && f.attract && !f.bomb && f.vy > -0.05 && f.vy < 0.25 && !f.demoChecked) {
        f.demoChecked = true;
        if (Math.random() < 0.6) sliceFruit(f, rnd(-0.9, 0.9) + (Math.random() < 0.5 ? Math.PI : 0), now, "right");
      }
      if (tvAutoAt && now > tvAutoAt) {
        tvAutoAt = 0;
        startRound(now);
      }
    } else if (state2 === "count") {
      const k = Math.floor((now - tState) / 800);
      if (k !== lastBeep && k <= 3) {
        lastBeep = k;
        play("beep", k === 3);
      }
      if (now - tState > 3200) {
        state2 = "play";
        roundStart = now;
        nextSpawn = now + 300;
        nextMega = now + 11e3;
      }
    } else if (state2 === "play") {
      const t = (now - roundStart) / 1e3, p = clamp(t / ROUND, 0, 1);
      const storming = now < stormUntil;
      if (storming) {
        if (now >= nextFountain) {
          nextFountain = now + 170;
          const u = Math.random();
          spawnFruit({ storm: true, x0: 0.5 + (u - 0.5) * 0.3, xEnd: 0.5 + (u - 0.5) * 1.4, apex: rnd(0.12, 0.35) });
        }
        nextSpawn = Math.max(nextSpawn, now + 600);
      } else if (now >= nextSpawn) {
        wave(now);
        nextSpawn = now + lerp(1750, 800, p) * (1 + 0.8 * ease);
      }
      if (!storming && now >= nextMega && t < ROUND - 6 && !fruits.some((f) => f.mega)) {
        spawnFruit({ mega: true });
        nextMega = now + rnd(13e3, 17e3);
      }
      if (stormReadyAt && now - stormReadyAt > 6e3) unleashStorm(now, "auto");
      if (stormReadyAt && t > ROUND - 2) stormReadyAt = 0;
      for (let i = queue.length - 1; i >= 0; i--) if (now >= queue[i].at) {
        spawnFruit(queue[i]);
        queue.splice(i, 1);
      }
      if (combo && now - comboT > 320) finishCombo();
      if (t >= ROUND) endRound(now);
    }
    let li = 0;
    for (let i = fruits.length - 1; i >= 0; i--) {
      const f = fruits[i];
      if (f.pending && !f.dead && now >= f.pending.at) {
        const sd = f.pending.side;
        f.pending = null;
        f.chops++;
        chopFx(f, now, sd);
        if (f.chops >= 3) megaSlice(f, now, false);
      }
      if (f.dead) {
        fruits.splice(i, 1);
        continue;
      }
      f.vy += f.g * dt;
      f.x += f.vx * dt;
      f.y += f.vy * dt;
      f.rot += f.spin * dt;
      f.ax += f.sx * dt;
      f.ay += f.sy * dt;
      worldAt(f.x, f.y, f.obj.position);
      f.obj.scale.setScalar(pxToWorld(f.r * R0) * (f.bomb ? 0.82 : 1));
      f.obj.rotation.set(f.bomb ? 0.15 * Math.sin(f.ax) : f.ax, f.bomb ? f.rot * 0.3 : f.ay, f.bomb ? 0.2 * Math.sin(f.ay) : f.rot);
      if (f.bomb) {
        const sp = f.obj.userData.spark;
        sp.scale.setScalar(0.55 + Math.random() * 0.35);
        if (li < 2) {
          f.light = sparkLights[li++];
          f.light.intensity = 0.25 + Math.random() * 0.2;
          sp.getWorldPosition(f.light.position);
        }
      }
      if (f.y > 1.3 && f.vy > 0) {
        fruits.splice(i, 1);
        removeFruit(f);
        if (!f.bomb && !f.attract && !f.storm && state2 === "play") {
          missed++;
          streak = 0;
          ease = Math.min(1, ease + 0.22);
          play("miss", f.x * 2 - 1);
        }
      }
    }
    for (let i = li; i < 2; i++) sparkLights[i].intensity = 0;
    checkHands(now, dt);
    stepPieces(dt, now);
    stepJuice(dt);
    stepPuffs(dt);
    render(dt);
    ctx.clearRect(0, 0, W, H);
    tipAvoid = [];
    for (const f of fruits) {
      if (f.mega) drawMegaSign(f, now);
      else if (f.bomb && state2 === "play") drawBombWarn(f, now);
    }
    drawPuffs();
    drawFilm(now);
    drawLens(now);
    scoreBump *= Math.pow(2e-3, dt);
    if (state2 === "title") drawTitle(now);
    else if (state2 === "count") drawCount(now);
    else if (state2 === "play") drawHud(now);
    else if (state2 === "end") drawEnd(now);
    drawTexts(now);
    processButtons(now);
    const big = buttons.filter((x) => !x.small);
    for (const b of buttons) drawButton(b, !b.small && big.indexOf(b) === focus && state2 !== "play", now);
    drawBlades(now);
    BodyMovin.drawHands(ctx, W, H);
    clicks.length = 0;
    keyPress = null;
    Object.assign(window.__game, {
      megas,
      megaX,
      storms,
      stormMeter,
      stormReady: !!stormReadyAt,
      storming: lastNow < stormUntil,
      state: state2,
      score,
      sliced,
      missed,
      bombsHit,
      maxCombo,
      bestStreak,
      spawned,
      ease,
      frames,
      timeLeft: state2 === "play" ? Math.max(0, ROUND - (now - roundStart) / 1e3) : state2 === "end" ? 0 : ROUND,
      flying: fruits.length,
      pieces: pieces.length,
      juice: juice.length,
      audioErrors,
      audio: ac ? ac.state : "none",
      endStats,
      quality: { ...state().quality },
      buttons: buttons.map((b) => ({ id: b.id, x: (b.x + b.w / 2) / W, y: (b.y + b.h / 2) / H, fill: b.fill }))
    });
    requestAnimationFrame(frame);
  }
  Object.assign(window.__game, {
    endNow: () => {
      if (state2 === "play" || state2 === "count") endRound(performance.now());
    },
    spawn: (o) => {
      spawnFruit(o || {});
    },
    dbgPieces: () => pieces.map((p) => [p.grp.position.toArray().map((v) => +v.toFixed(3)), p.v.toArray().map((v) => +v.toFixed(2)), Math.round(lastNow - p.born)]),
    fillStorm: () => {
      stormMeter = STORM_FULL - 1;
      addStorm(1);
    },
    targets: () => fruits.filter((f) => !f.dead).map((f) => ({ x: f.x, y: f.y, vx: f.vx, vy: f.vy, bomb: f.bomb, mega: f.mega, r: f.r * R0 / W, touch: f.touch, bh: f.bh }))
  });
  function drawPictogram(cx, cy, s, now) {
    ctx.save();
    ctx.lineCap = "round";
    ctx.strokeStyle = "#fff";
    ctx.fillStyle = "#fff";
    ctx.lineWidth = s * 0.07;
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = s * 0.12;
    const fx = cx - s * 0.75;
    ctx.beginPath();
    ctx.arc(fx - s * 0.06, cy + s * 0.06, s * 0.36, Math.PI * 0.25 + 0.15, Math.PI * 1.25 - 0.15);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(fx + s * 0.06, cy - s * 0.06, s * 0.36, Math.PI * 1.25 + 0.15, Math.PI * 2.25 - 0.15);
    ctx.stroke();
    const k = now / 1100 % 1;
    ctx.globalAlpha = 0.9;
    ctx.lineWidth = s * 0.05;
    ctx.beginPath();
    ctx.moveTo(fx - s * 0.7, cy + s * 0.7);
    ctx.lineTo(fx + s * 0.7, cy - s * 0.7);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(fx + s * 0.7, cy - s * 0.7);
    ctx.lineTo(fx + s * 0.45, cy - s * 0.66);
    ctx.moveTo(fx + s * 0.7, cy - s * 0.7);
    ctx.lineTo(fx + s * 0.66, cy - s * 0.45);
    ctx.stroke();
    void k;
    ctx.globalAlpha = 1;
    const bx = cx + s * 0.75;
    ctx.lineWidth = s * 0.06;
    ctx.beginPath();
    ctx.arc(bx, cy + s * 0.05, s * 0.3, 0, TAU);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bx + s * 0.12, cy - s * 0.25);
    ctx.quadraticCurveTo(bx + s * 0.25, cy - s * 0.48, bx + s * 0.4, cy - s * 0.42);
    ctx.stroke();
    ctx.strokeStyle = "#ff6a50";
    ctx.lineWidth = s * 0.07;
    ctx.beginPath();
    ctx.arc(bx, cy, s * 0.5, 0, TAU);
    ctx.moveTo(bx - s * 0.35, cy + s * 0.35);
    ctx.lineTo(bx + s * 0.35, cy - s * 0.35);
    ctx.stroke();
    ctx.restore();
  }
  function homeBtn() {
    if (BodyMovin.sysMode && BodyMovin.sysMode() === "play") return;
    const S = UI();
    button("home", "← HOME", S.L, S.T, S.Wb, S.Hh, { small: true, ms: 1e3, action: goHome });
  }
  function drawTitle(now) {
    homeBtn();
    const by = H * UIBAND.start, bh = Math.min(U * 0.13, H * 0.095), bw = Math.min(U * 0.5, W * 0.6);
    const n = tvAutoAt ? Math.max(1, Math.ceil((tvAutoAt - now) / 1e3)) : 0;
    button("start", n ? "START  ".concat(n) : "START", W / 2 - bw / 2, by, bw, bh, { action: startRound });
  }
  function drawCount(now) {
    homeBtn();
    const k = (now - tState) / 800, i = Math.floor(k), f = k - i, lbl = i < 3 ? String(3 - i) : "SLASH!";
    ctx.save();
    ctx.globalAlpha = i < 3 ? 1 - f * 0.6 : clamp(5 - k, 0, 1);
    label(lbl, W / 2, H * 0.45, U * (i < 3 ? 0.3 : 0.2) * (1.25 - 0.25 * Math.min(1, f * 3)), i < 3 ? "#ffffff" : "#ffb43c", 900);
    ctx.restore();
  }
  function drawHud(now) {
    const S = UI(), left = Math.max(0, ROUND - (now - roundStart) / 1e3), low = left < 10;
    homeBtn();
    const storming = now < stormUntil, ready = !!stormReadyAt, pulse2 = 0.5 + 0.5 * Math.sin(now / 110);
    const sw = Math.max(130 * DPR, S.vm * 20), sx = Math.min(W - S.L, BodyMovin.freeRight ? Math.min(W, BodyMovin.freeRight() * DPR) : W) - sw, sy = S.T, shh = S.Hh;
    glass(sx, sy, sw, shh);
    tipAvoid.push({ x: sx / DPR, y: sy / DPR, w: sw / DPR, h: shh / DPR });
    const fillK = storming ? (stormUntil - now) / 5500 : stormMeter / STORM_FULL;
    ctx.save();
    const sp = new Path2D();
    sp.roundRect(sx, sy, sw, shh, shh / 2);
    ctx.clip(sp);
    const mg = ctx.createLinearGradient(sx, 0, sx + sw, 0);
    mg.addColorStop(0, "#ffcf5a");
    mg.addColorStop(1, "#ff7a3c");
    ctx.fillStyle = mg;
    ctx.globalAlpha = ready ? 0.65 + 0.3 * pulse2 : 0.6;
    ctx.fillRect(sx, sy, sw * clamp(fillK, 0, 1), shh);
    ctx.restore();
    ctx.save();
    ctx.font = font(800, S.fs);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    ctx.fillText(storming ? "STORM x2" : ready ? "JUMP!" : "JUICE STORM", sx + sw / 2, sy + shh / 2 + DPR);
    ctx.restore();
    const ph = S.Hh * 1.2, sf = ph * 0.62 * (1 + 0.12 * scoreBump), tf = S.fs * 1.1;
    ctx.save();
    ctx.font = font(900, ph * 0.62);
    const scw = Math.max(ctx.measureText(String(score)).width, ph * 0.9);
    ctx.font = font(800, tf);
    const tws = ctx.measureText("0:00").width;
    ctx.restore();
    const pw = S.Hh * 0.5 + tws + S.Hh * 0.6 + scw + S.Hh * 0.5;
    let px = W / 2 - pw / 2, py = S.T;
    if (px < S.right + S.G || px + pw > sx - S.G) {
      py = S.T + S.Hh + S.G;
      px = Math.min(Math.max(px, S.L), W - S.L - pw);
    }
    glass(px, py, pw, ph);
    tipAvoid.push({ x: px / DPR, y: py / DPR, w: pw / DPR, h: ph / DPR });
    const tt = "".concat(Math.floor(Math.ceil(left) / 60), ":").concat(String(Math.ceil(left) % 60).padStart(2, "0"));
    ctx.save();
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.font = font(800, tf);
    ctx.fillStyle = low ? "rgb(255,".concat(Math.round(110 + 80 * pulse2), ",90)") : "#ffcf5a";
    ctx.fillText(tt, px + S.Hh * 0.5, py + ph / 2 + DPR);
    ctx.textAlign = "right";
    ctx.font = font(900, sf);
    ctx.fillStyle = scoreBump > 0.3 ? "#ffe680" : "#ffffff";
    ctx.fillText(String(score), px + pw - S.Hh * 0.5, py + ph / 2 + DPR);
    ctx.restore();
    if (ready && !texts.some((t) => t.banner)) {
      tipAvoid.push({ x: 0, y: (H - Math.max(U * 0.08, S.T + S.Hh / 2)) / DPR - 30, w: W / DPR, h: 60 });
      ctx.save();
      ctx.globalAlpha = 0.85 + 0.15 * pulse2;
      label("Jump for the Juice Storm!", W / 2, H - Math.max(U * 0.08, S.T + S.Hh / 2), Math.max(S.fs * 1.4, U * 0.05), "#ffcf5a", 900);
      ctx.restore();
    }
    if (storming) {
      ctx.save();
      const sg = ctx.createRadialGradient(W / 2, H / 2, U * 0.3, W / 2, H / 2, Math.max(W, H) * 0.75);
      sg.addColorStop(0, "rgba(255,200,90,0)");
      sg.addColorStop(1, "rgba(255,170,60,".concat(0.22 + 0.08 * Math.sin(now / 90), ")"));
      ctx.fillStyle = sg;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
  }
  function drawEnd(now) {
    const e = endStats, k = clamp((now - tState) / 600, 0, 1), S = UI(), hs = BodyMovin.highScores && BodyMovin.highScores.state;
    if (hs && hs.phase) {
      homeBtn();
      if (hs.phase === "wait") {
        ctx.save();
        ctx.globalAlpha = k;
        label("TIME'S UP!", W / 2, H * 0.42, U * 0.11, "#ffcf5a", 900);
        ctx.restore();
      }
      armedAt = now + 600;
      return;
    }
    const cw = Math.min(U * 0.62, W - 2 * S.L), ch = Math.min(U * 0.36, H * 0.4), cy = Math.max(S.T + S.Hh + S.G, H * 0.16);
    ctx.save();
    ctx.globalAlpha = k;
    glass(W / 2 - cw / 2, cy, cw, ch, Math.min(ch / 2, U * 0.04));
    label("SCORE", W / 2, cy + ch * 0.24, Math.max(S.fs, ch * 0.13), "rgba(255,255,255,0.8)", 800);
    label(String(e.score), W / 2, cy + ch * 0.62, ch * 0.42, "#ffffff", 900);
    ctx.restore();
    const L = BodyMovin.layout.end(W, H, { cy: Math.max(cy + ch + S.G * 2 + U * 0.08, H * 0.66) }), A = L.again, Hm = L.home;
    button("again", "PLAY AGAIN", A.x, A.y, A.w, A.h, { action: startRound });
    button("endhome", "HOME", Hm.x, Hm.y, Hm.w, Hm.h, { action: goHome, ms: BodyMovin.LEAVE_MS });
  }
  let tipAvoid = [];
  function drawLoading() {
    ctx.clearRect(0, 0, W, H);
    label("loading the orchard…", W / 2, H / 2, U * 0.05, "#ffffff", 700);
  }
  drawLoading();
  BodyMovin.start();
  await environment(scene, renderer, ENV, { background: true, rotation: 0 });
  scene.backgroundBlurriness = +((_a = Q.get("bgblur")) != null ? _a : 0);
  bombMat = pbr("metal_plate", { color: "#3a3a3e", metalness: 0.85, roughness: 0.42 });
  capMat = new MeshStandardMaterial({ color: 11569738, metalness: 1, roughness: 0.35 });
  fuseMat = new MeshStandardMaterial({ color: 9071170, roughness: 0.95 });
  await Promise.all(KINDS.map(prepareKind));
  {
    const warm = [];
    for (const planes of [[cutNormal(0.3)], [cutNormal(0.7), cutNormal(-0.7)]]) for (const k of KINDS) {
      const f = { kind: k, obj: new Mesh(k.geo, k.mat), vx: 0, vy: 0, g: 1 };
      f.obj.position.set(0, 1.2, -D);
      f.obj.scale.setScalar(0.04);
      makePieces(f, planes, 0);
    }
    const bomb = makeBomb();
    bomb.position.set(0, 1.2, -D);
    bomb.scale.setScalar(0.04);
    scene.add(bomb);
    warm.push(bomb);
    spray(new Vector3(0, 1.2, -D), "#ffffff", 2, 0.1);
    stepPieces(0, 0);
    renderer.compile(scene, camera);
    render(1 / 60);
    render(1 / 60);
    stepPieces(0, 1e9);
    warm.forEach((o) => scene.remove(o));
    juice.length = 0;
  }
  const Qy = state().quality;
  Qy.frames = 0;
  Qy.t0 = performance.now();
  state2 = "title";
  tState = performance.now();
  if (TV) tvAutoAt = tState + 2e3;
  window.__game.ready = true;
  requestAnimationFrame(frame);
})().catch((e) => setTimeout(() => {
  throw e;
}));
