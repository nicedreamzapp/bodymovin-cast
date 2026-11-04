import {
  BokehPass
} from "./chunk-7FP3ETJO.js";
import {
  create as create3
} from "./chunk-EZXOD6SV.js";
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
  environment,
  pbr,
  render,
  setup,
  state,
  sun
} from "./chunk-5EPBUA75.js";
import "./chunk-CPYHHAA5.js";
import "./chunk-GEQJXPAR.js";
import "./chunk-UBB4M7UR.js";
import {
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  Group,
  LatheGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  Points,
  PointsMaterial,
  RepeatWrapping,
  RingGeometry,
  SRGBColorSpace,
  SphereGeometry,
  Vector2,
  Vector3
} from "./chunk-4IYDSAYK.js";
import "./chunk-NWIHTO7D.js";

// bmpage:bmpage:track.html#0
(async () => {
  const BP = window.BodyMovin;
  BP.start();
  const Q = new URLSearchParams(location.search);
  const GAME_ID = "track", MUTE = Q.has("mute"), TV = Q.has("tv"), NOHUD = Q.has("nohud"), DOF = !Q.has("nodof");
  const clamp = (v, a = 0, b = 1) => v < a ? a : v > b ? b : v, lerp = (a, b, t) => a + (b - a) * t, rand = (a, b) => a + Math.random() * (b - a);
  const ease = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const EVENTS = [
    {
      id: "sprint",
      name: "100 M SPRINT",
      kind: "race",
      dist: 100,
      vmax: 11.8,
      wr: 9.58,
      rival: [0.9, 0.85, 0.78],
      how: "Run in place as fast as you can: quick little steps!",
      pts: (t) => Math.round(1e3 * clamp((17 - t) / (17 - 9.58)))
    },
    {
      id: "hurdles",
      name: "110 M HURDLES",
      kind: "race",
      dist: 110,
      vmax: 9.6,
      wr: 12.8,
      hurdles: true,
      rival: [0.9, 0.84, 0.77],
      how: "Run in place, and JUMP when the hurdle glows!",
      pts: (t) => Math.round(1e3 * clamp((24 - t) / (24 - 12.8)))
    },
    {
      id: "long",
      name: "LONG JUMP",
      kind: "field",
      runup: 36,
      vmax: 11,
      wr: 8.95,
      rival: [7.95, 7.55, 7.05],
      origin: 14,
      how: "Run in place to build speed, then JUMP at the white board!",
      pts: (d) => Math.round(1e3 * clamp(d / 8.95))
    },
    {
      id: "jav",
      name: "JAVELIN",
      kind: "field",
      runup: 26,
      vmax: 8.6,
      wr: 98.48,
      rival: [80, 73, 64],
      origin: 118,
      how: "Run in place, reach your RIGHT or LEFT hand back over your head, then THROW!",
      pts: (d) => Math.round(1e3 * clamp(d / 98.48))
    }
  ];
  const STANCE = {
    sprint: { pic: "crouch", lines: ["Crouch at ON YOUR MARKS, hold still", "At the gun: quick small steps in place"] },
    hurdles: { pic: "hurdles", lines: ["Run in place: quick small steps", "HOP up, or both arms up, when it glows"] },
    long: { pic: "long", lines: ["Run in place: quick small steps", "HOP up, or both arms up, at the board"] },
    jav: { pic: "jav", lines: ["Run in place, right or left hand back by your head", "THROW: whip that arm forward"] }
  };
  const ATH = [
    { name: "YOU", col: 3134719, css: "#3fdcff", skin: 13011550, hair: 2759184, lane: 6 },
    { name: "RAYNE", col: 16747039, css: "#ffa040", skin: 9263675, hair: 1118481, lane: 5 },
    { name: "OKAFOR", col: 3659386, css: "#55e895", skin: 5912613, hair: 789516, lane: 4 },
    { name: "SILVA", col: 12610559, css: "#cf96ff", skin: 15253404, hair: 8014368, lane: 3 }
  ];
  const laneZ = (i) => -4.88 + 0.61 + 1.22 * i;
  const FIELD_Z = -9.4, FINISH_X = 100;
  const RK = setup(document.getElementById("gl"), { fov: 34, near: 0.1, far: 4e3 });
  const { renderer, scene, camera } = RK;
  const VENUE_ROT = Q.has("rot") ? +Q.get("rot") : 0;
  try {
    await environment(scene, renderer, "stadium_01", { background: true, exact: true, intensity: 1, rotation: VENUE_ROT });
  } catch (e) {
    scene.background = new Color(9417944);
  }
  renderer.toneMappingExposure = 0.95;
  let bokeh = null;
  function tunePost() {
    const st = state(), b = st.passes.bloom;
    if (b) {
      b.strength = 0.18;
      b.threshold = 0.95;
      b.radius = 0.4;
    }
    const c = st.composer;
    if (DOF && st.quality.tier >= 2 && !c.passes.includes(bokeh)) {
      bokeh = new BokehPass(scene, camera, { focus: 11, aperture: 18e-5, maxblur: 5e-3 });
      c.insertPass(bokeh, st.passes.ao ? 2 : 1);
    }
    if (bokeh && c.passes.includes(bokeh)) {
      const f = figs[0].root.position;
      bokeh.uniforms.focus.value = Math.max(3, camera.position.distanceTo(f));
    }
  }
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
      t.repeat.set(repeat[0], repeat[1]);
    }
    t.userData.canvas = c;
    return t;
  }
  function noiseNormal(size, strength, blur = 0) {
    const hgt = new Float32Array(size * size);
    for (let i = 0; i < hgt.length; i++) hgt[i] = Math.random();
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const g = c.getContext("2d"), im = g.createImageData(size, size);
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const h = (xx, yy) => hgt[(yy + size) % size * size + (xx + size) % size];
      const dx = (h(x + 1, y) - h(x - 1, y)) * strength, dy = (h(x, y + 1) - h(x, y - 1)) * strength, n = Math.hypot(dx, dy, 1), k = (y * size + x) * 4;
      im.data[k] = (-dx / n * 0.5 + 0.5) * 255;
      im.data[k + 1] = (-dy / n * 0.5 + 0.5) * 255;
      im.data[k + 2] = (1 / n * 0.5 + 0.5) * 255;
      im.data[k + 3] = 255;
    }
    g.putImageData(im, 0, 0);
    const t = new CanvasTexture(c);
    t.wrapS = t.wrapT = RepeatWrapping;
    return t;
  }
  const glowTex = canvasTex(128, 128, (g, w) => {
    const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    gr.addColorStop(0, "rgba(255,255,255,1)");
    gr.addColorStop(0.25, "rgba(255,255,255,0.5)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, w);
  });
  const hudLabels = [];
  function textSprite(text2, color, { scale = 1, bg = null } = {}) {
    const o = new Object3D();
    o.userData.hud = { text: text2, color, size: scale, bg: !!bg };
    hudLabels.push(o);
    return o;
  }
  const key = sun(scene, { color: 16769200, intensity: 2.4, position: [-20, 22, 40], target: [0, 0, 0], size: 15 });
  key.shadow.camera.far = 160;
  key.shadow.camera.updateProjectionMatrix();
  const TRACK_L = 420, TRACK_CX = 100;
  {
    const trackMat = pbr("red_sand", { repeat: [TRACK_L / 2.2, 15 / 2.2], color: 16743778, normalScale: 1.4, roughness: 0.82 });
    const tg = new PlaneGeometry(TRACK_L, 15, 840, 60), tp = tg.attributes.position, tc = new Float32Array(tp.count * 3);
    for (let i = 0; i < tp.count; i++) {
      const x = tp.getX(i), z = -tp.getY(i) + 1.9, lane = (z + 4.88) / 1.22, inLane = 1 - Math.abs((lane % 1 + 1) % 1 - 0.5) * 2;
      const wear = 0.05 * inLane * (lane < 4 ? 1 : 0.5) + 0.03 * Math.sin(x * 0.21 + z) * Math.sin(x * 0.047 - z * 0.6) + 0.02 * Math.sin(x * 1.7 + z * 3.1);
      const v = 1 - wear;
      tc[i * 3] = v;
      tc[i * 3 + 1] = v * 0.985;
      tc[i * 3 + 2] = v * 0.97;
    }
    tg.setAttribute("color", new BufferAttribute(tc, 3));
    trackMat.vertexColors = true;
    const track = new Mesh(tg, trackMat);
    track.geometry.setAttribute("uv1", track.geometry.attributes.uv);
    track.rotation.x = -Math.PI / 2;
    track.position.set(TRACK_CX, 0, 1.9);
    track.receiveShadow = true;
    scene.add(track);
    const grassMap = canvasTex(512, 512, (g, w, h) => {
      for (let i = 0; i < 2; i++) {
        g.fillStyle = i ? "#467f2c" : "#4f8b33";
        g.fillRect(i * w / 2, 0, w / 2, h);
      }
      for (let i = 0; i < 6e4; i++) {
        const d = Math.random() < 0.5;
        g.fillStyle = d ? "rgba(18,48,10,".concat(rand(0.05, 0.25), ")") : "rgba(140,190,90,".concat(rand(0.04, 0.18), ")");
        g.fillRect(Math.random() * w, Math.random() * h, 1, rand(1, 4));
      }
    }, [3e3 / 12, 1600 / 12]);
    const grassN = noiseNormal(256, 4);
    grassN.repeat.set(3e3 / 2, 1600 / 2);
    const gg = new PlaneGeometry(3e3, 1600, 300, 160), gp = gg.attributes.position, gc = new Float32Array(gp.count * 3);
    const sn = (x, y) => Math.sin(x * 0.11 + Math.sin(y * 0.07) * 2) * Math.sin(y * 0.09 + Math.sin(x * 0.05) * 1.7) + 0.5 * Math.sin(x * 0.37 + y * 0.23);
    for (let i = 0; i < gp.count; i++) {
      const v = 0.9 + 0.09 * sn(gp.getX(i), gp.getY(i));
      gc[i * 3] = v * 1.02;
      gc[i * 3 + 1] = v;
      gc[i * 3 + 2] = v * 0.92;
    }
    gg.setAttribute("color", new BufferAttribute(gc, 3));
    const grass = new Mesh(gg, new MeshStandardMaterial({ map: grassMap, normalMap: grassN, normalScale: new Vector2(0.7, 0.7), roughness: 0.92, vertexColors: true }));
    grass.rotation.x = -Math.PI / 2;
    grass.position.set(TRACK_CX, -0.012, -5.3 - 800 + 16.5);
    grass.receiveShadow = true;
    scene.add(grass);
    const paint = new MeshStandardMaterial({ color: 15921386, roughness: 0.7 });
    const flat = (w, d, x, z, m = paint, y = 4e-3) => {
      const o = new Mesh(new PlaneGeometry(w, d), m);
      o.rotation.x = -Math.PI / 2;
      o.position.set(x, y, z);
      o.receiveShadow = true;
      scene.add(o);
      return o;
    };
    const linesTex = canvasTex(4, 4096, (g, w, h) => {
      g.clearRect(0, 0, w, h);
      g.fillStyle = "#f2f0ea";
      for (let i = 0; i <= 8; i++) {
        const z = -4.88 + 1.22 * i, r = (z + 5.6) / 15 * h;
        g.fillRect(0, r - 9, w, 18);
      }
    }, [TRACK_L / 4, 1]);
    const lines = new Mesh(new PlaneGeometry(TRACK_L, 15), new MeshStandardMaterial({ map: linesTex, transparent: true, roughness: 0.7, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
    lines.rotation.x = -Math.PI / 2;
    lines.position.set(TRACK_CX, 2e-3, 1.9);
    lines.receiveShadow = true;
    scene.add(lines);
    flat(0.05, 9.76, 0, 0);
    flat(0.05, 9.76, -10, 0);
    flat(0.09, 9.76, FINISH_X, 0, paint, 5e-3);
    const kerb = new Mesh(new BoxGeometry(TRACK_L, 0.05, 0.05), new MeshStandardMaterial({ color: 13225170, roughness: 0.35, metalness: 0.8 }));
    kerb.position.set(TRACK_CX, 0.025, -5.33);
    kerb.castShadow = kerb.receiveShadow = true;
    scene.add(kerb);
    const numTex = (n) => canvasTex(128, 128, (g) => {
      g.font = '900 104px "Avenir Next",Arial';
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillStyle = "#f2f0ea";
      g.fillText(String(n), 64, 70);
    });
    for (let i = 0; i < 8; i++) {
      const m = new MeshStandardMaterial({ map: numTex(i + 1), transparent: true, roughness: 0.7 });
      for (const x of [FINISH_X + 1.4, -0.9, -10.9]) {
        const o = flat(0.9, 0.9, x, laneZ(i), m, 6e-3);
        o.rotation.z = Math.PI / 2;
      }
    }
    for (let d = 10; d < 100; d += 10) {
      const m = new MeshStandardMaterial({ map: canvasTex(256, 128, (g) => {
        g.font = '900 80px "Avenir Next",Arial';
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillStyle = "#f2f0ea";
        g.fillText(d + " m", 128, 70);
      }), transparent: true, roughness: 0.7 });
      flat(1.4, 0.7, d, 5.6, m, 7e-3);
      flat(0.04, 0.5, d, 5.15);
    }
    const adTexL = canvasTex(2048, 96, (g, w, h) => {
      const ads = [["BODY MOVIN'", "#3fdcff"], ["TRACK & FIELD", "#ffd34d"], ["RUN · JUMP · THROW", "#ff6fb1"], ["FAMILY GAMES", "#7dff9a"]];
      g.fillStyle = "#05060c";
      g.fillRect(0, 0, w, h);
      ads.forEach(([t, c], i) => {
        const x0 = i * w / 4;
        g.fillStyle = "#0d1230";
        g.fillRect(x0 + 4, 6, w / 4 - 8, h - 12);
        g.font = '900 58px "Avenir Next",Arial';
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillStyle = c;
        g.fillText(t, x0 + w / 8, h / 2 + 3);
      });
    }, [TRACK_L / 26, 1]);
    window.__adTex = adTexL;
    const board = new Mesh(new BoxGeometry(TRACK_L, 0.9, 0.12), new MeshStandardMaterial({ color: 1382175, roughness: 0.5, metalness: 0.3 }));
    board.position.set(TRACK_CX, 0.45, -16.5);
    const led = new Mesh(new PlaneGeometry(TRACK_L, 0.78), new MeshBasicMaterial({ map: adTexL, color: 13684944 }));
    led.position.set(TRACK_CX, 0.45, -16.43);
  }
  const adTex = window.__adTex;
  const crowdU = { uTime: { value: 0 }, uExcite: { value: 0.2 }, uWave: { value: 0 } };
  const FLASH_N = 60, flashPos = new Float32Array(FLASH_N * 3);
  const flashGeo = new BufferGeometry();
  flashGeo.setAttribute("position", new BufferAttribute(flashPos, 3));
  const flashes = new Points(flashGeo, new PointsMaterial({ color: 16777215, size: 4, sizeAttenuation: false, map: glowTex, transparent: true, blending: AdditiveBlending, depthWrite: false, toneMapped: false }));
  flashes.frustumCulled = false;
  scene.add(flashes);
  const FW_N = 1800, fwPos = new Float32Array(FW_N * 3), fwVel = new Float32Array(FW_N * 3), fwLife = new Float32Array(FW_N), fwCol = new Float32Array(FW_N * 3);
  const fwGeo = new BufferGeometry();
  fwGeo.setAttribute("position", new BufferAttribute(fwPos, 3));
  fwGeo.setAttribute("color", new BufferAttribute(fwCol, 3));
  const fw = new Points(fwGeo, new PointsMaterial({ size: 1.8, vertexColors: true, map: glowTex, transparent: true, blending: AdditiveBlending, depthWrite: false, toneMapped: false }));
  fw.frustumCulled = false;
  scene.add(fw);
  let fwNext = 0, fwQueue = [];
  function fireworks(n = 6) {
    for (let i = 0; i < n; i++) fwQueue.push(performance.now() + i * rand(250, 450));
  }
  function fwBurst() {
    const c = new Color().setHSL(Math.random(), 1, 0.6), cx = camera.position.x + rand(-70, 90), cy = rand(40, 75), cz = camera.position.z - rand(170, 230);
    for (let k = 0; k < 160; k++) {
      const i = fwNext++ % FW_N, a = Math.random() * 6.283, b = Math.acos(rand(-1, 1)), s = rand(14, 20);
      fwPos.set([cx, cy, cz], i * 3);
      fwVel.set([Math.sin(b) * Math.cos(a) * s, Math.cos(b) * s, Math.sin(b) * Math.sin(a) * s], i * 3);
      fwLife[i] = rand(1.2, 2);
      const w = Math.random() < 0.2 ? 1 : 0;
      fwCol.set([lerp(c.r, 1, w) * 3, lerp(c.g, 1, w) * 3, lerp(c.b, 1, w) * 3], i * 3);
    }
    tone(80, 0.6, "sine", 0.25, 30, 0.35);
    noiseHit(0.8, 900, 0.5, 0.35, "bandpass", 300);
  }
  function stepFw(dt) {
    while (fwQueue.length && performance.now() > fwQueue[0]) {
      fwQueue.shift();
      fwBurst();
    }
    for (let i = 0; i < FW_N; i++) {
      if (fwLife[i] <= 0) {
        fwPos[i * 3 + 1] = -500;
        continue;
      }
      fwLife[i] -= dt;
      const dr = Math.exp(-dt * 1.6);
      fwVel[i * 3] *= dr;
      fwVel[i * 3 + 1] = fwVel[i * 3 + 1] * dr - 9.8 * dt * 0.6;
      fwVel[i * 3 + 2] *= dr;
      for (let k = 0; k < 3; k++) fwPos[i * 3 + k] += fwVel[i * 3 + k] * dt;
      const f = Math.min(1, fwLife[i] / 0.6);
      for (let k = 0; k < 3; k++) fwCol[i * 3 + k] *= f < 1 ? 0.97 : 1;
    }
    fwGeo.attributes.position.needsUpdate = true;
    fwGeo.attributes.color.needsUpdate = true;
  }
  const clockTex = canvasTex(512, 128, () => {
  });
  {
    const metal = new MeshStandardMaterial({ color: 2896450, roughness: 0.4, metalness: 0.7 });
    for (const z of [-5.9, 5.9]) {
      const p = new Mesh(new BoxGeometry(0.3, 4.6, 0.3), metal);
      p.position.set(FINISH_X, 2.3, z);
      p.castShadow = true;
      scene.add(p);
    }
    const beam = new Mesh(new BoxGeometry(0.5, 1.1, 12.2), metal);
    beam.position.set(FINISH_X, 4.6, 0);
    scene.add(beam);
    const sign = new Mesh(new PlaneGeometry(4.2, 0.95), new MeshBasicMaterial({ map: canvasTex(512, 128, (g, w, h) => {
      g.fillStyle = "#05060c";
      g.fillRect(0, 0, w, h);
      g.font = '900 92px "Avenir Next",Arial';
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.shadowColor = "#ffd34d";
      g.shadowBlur = 18;
      g.fillStyle = "#ffd34d";
      g.fillText("FINISH", w / 2, h / 2 + 4);
    }) }));
    sign.position.set(FINISH_X, 4.6, 6.16);
    scene.add(sign);
    const clock = new Mesh(new PlaneGeometry(3.4, 0.85), new MeshBasicMaterial({ map: clockTex }));
    clock.position.set(FINISH_X + 0.26, 4.6, 2.2);
    clock.rotation.y = Math.PI / 2;
    scene.add(clock);
    const clock2 = clock.clone();
    clock2.position.set(FINISH_X, 4.6, 6.16);
    clock2.rotation.y = 0;
    clock2.position.x = FINISH_X + 4.4;
    clock2.visible = false;
  }
  function drawClock(text2, col = "#ff4d3a") {
    const g = clockTex.userData.canvas.getContext("2d");
    g.fillStyle = "#05060c";
    g.fillRect(0, 0, 512, 128);
    g.font = "900 96px Menlo,Consolas,monospace";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.shadowColor = col;
    g.shadowBlur = 16;
    g.fillStyle = col;
    g.fillText(text2, 256, 68);
    clockTex.needsUpdate = true;
  }
  drawClock("0.00");
  const tape = new Mesh(new BoxGeometry(0.03, 0.05, 9.76), new MeshStandardMaterial({ color: 16724821, emissive: 16720452, emissiveIntensity: 0.6 }));
  tape.position.set(FINISH_X + 0.05, 1.25, 0);
  scene.add(tape);
  const wrGhost = new Group();
  {
    const mat = new MeshBasicMaterial({ map: canvasTex(64, 256, (g, w, h) => {
      const gr = g.createLinearGradient(0, h, 0, 0);
      gr.addColorStop(0, "rgba(255,211,77,0.75)");
      gr.addColorStop(1, "rgba(255,211,77,0)");
      g.fillStyle = gr;
      g.fillRect(0, 0, w, h);
    }), transparent: true, blending: AdditiveBlending, depthWrite: false, side: DoubleSide, fog: false });
    const wall = new Mesh(new PlaneGeometry(9.76, 0.5), mat);
    wall.rotation.y = Math.PI / 2;
    wall.position.y = 0.25;
    wall.material.opacity = 0.55;
    wrGhost.add(wall);
    const bar = new Mesh(new BoxGeometry(0.08, 0.012, 9.76), new MeshBasicMaterial({ color: 16765773, toneMapped: false }));
    bar.position.y = 8e-3;
    wrGhost.add(bar);
    const lab = textSprite("WORLD RECORD", "#ffd34d", { scale: 0.17 });
    lab.position.set(0, 0.6, -4.4);
    wrGhost.add(lab);
  }
  wrGhost.visible = false;
  scene.add(wrGhost);
  const stripeTex = canvasTex(256, 32, (g, w, h) => {
    for (let i = 0; i < 8; i++) {
      g.fillStyle = i % 2 ? "#111" : "#f5f5f5";
      g.fillRect(i * w / 8, 0, w / 8, h);
    }
  });
  const HURDLE_X = Array.from({ length: 10 }, (_, k) => 13.72 + 9.14 * k);
  const hurdleGroups = [];
  {
    const post = new MeshStandardMaterial({ color: 14672874, roughness: 0.4, metalness: 0.4 });
    const board = new MeshStandardMaterial({ map: stripeTex, roughness: 0.5, emissive: 16777215, emissiveIntensity: 0 });
    const postG = new BoxGeometry(0.04, 0.95, 0.04), footG = new BoxGeometry(0.7, 0.03, 0.05), boardG = new BoxGeometry(0.025, 0.13, 1.18);
    for (let a = 0; a < 4; a++) {
      hurdleGroups[a] = HURDLE_X.map((hx) => {
        const h = new Group();
        for (const z of [-0.56, 0.56]) {
          const p = new Mesh(postG, post);
          p.position.set(0, 0.475, z);
          h.add(p);
          const f = new Mesh(footG, post);
          f.position.set(-0.33, 0.015, z);
          h.add(f);
        }
        const b = new Mesh(boardG, board.clone());
        b.position.set(0, 0.93, 0);
        h.add(b);
        h.userData.board = b;
        h.traverse((o) => {
          if (o.isMesh) o.castShadow = true;
        });
        h.position.set(-10 + hx, 0, laneZ(ATH[a].lane));
        h.visible = false;
        scene.add(h);
        return h;
      });
    }
  }
  const LJ = EVENTS[2], JV = EVENTS[3];
  const LJ_BOARD = LJ.origin + LJ.runup, JV_LINE = JV.origin + JV.runup;
  const fieldMarks = new Group();
  scene.add(fieldMarks);
  {
    const runwayMat = new MeshStandardMaterial({ color: 10828328, roughness: 0.8, normalMap: noiseNormal(128, 3), normalScale: new Vector2(0.5, 0.5) });
    const rw = new Mesh(new PlaneGeometry(LJ.runup + 4, 1.4), runwayMat);
    rw.rotation.x = -Math.PI / 2;
    rw.position.set(LJ.origin + LJ.runup / 2 - 1, 3e-3, FIELD_Z);
    rw.receiveShadow = true;
    scene.add(rw);
    const boardM = new Mesh(new BoxGeometry(0.2, 0.025, 1.22), new MeshStandardMaterial({ color: 16777215, emissive: 16777215, emissiveIntensity: 0.35 }));
    boardM.position.set(LJ_BOARD - 0.1, 0.012, FIELD_Z);
    scene.add(boardM);
    const sandMap = canvasTex(256, 256, (g, w, h) => {
      g.fillStyle = "#d8b981";
      g.fillRect(0, 0, w, h);
      for (let i = 0; i < 12e3; i++) {
        g.fillStyle = "rgba(".concat(Math.random() < 0.5 ? "120,90,50" : "255,240,200", ",").concat(rand(0.1, 0.35), ")");
        g.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
      }
    }, [4, 1]);
    const sand = new Mesh(new BoxGeometry(10, 0.06, 2.8), new MeshStandardMaterial({ map: sandMap, roughness: 1, normalMap: noiseNormal(128, 5), normalScale: new Vector2(1, 1) }));
    sand.position.set(LJ_BOARD + 6, 0, FIELD_Z);
    sand.receiveShadow = true;
    scene.add(sand);
    const wood = new MeshStandardMaterial({ color: 7031339, roughness: 0.8 });
    for (const z of [-1.45, 1.45]) {
      const b = new Mesh(new BoxGeometry(10.2, 0.1, 0.1), wood);
      b.position.set(LJ_BOARD + 6, 0.04, FIELD_Z + z);
      scene.add(b);
    }
    const jw = new Mesh(new PlaneGeometry(JV.runup + 4, 4), runwayMat);
    jw.rotation.x = -Math.PI / 2;
    jw.position.set(JV.origin + JV.runup / 2 - 1, 3e-3, FIELD_Z);
    jw.receiveShadow = true;
    scene.add(jw);
    const arc = new Mesh(new BoxGeometry(0.07, 0.02, 4), new MeshStandardMaterial({ color: 16777215, emissive: 16777215, emissiveIntensity: 0.3 }));
    arc.position.set(JV_LINE, 0.01, FIELD_Z);
    scene.add(arc);
    const lineMat = new MeshStandardMaterial({ color: 15790320, roughness: 0.6 });
    for (let d = 10; d <= 110; d += 10) {
      const l = new Mesh(new PlaneGeometry(0.06, 5.6), lineMat);
      l.rotation.x = -Math.PI / 2;
      l.position.set(JV_LINE + d, 4e-3, FIELD_Z + 0.4);
      scene.add(l);
      const n = new Mesh(new PlaneGeometry(2.4, 1.2), new MeshStandardMaterial({ map: canvasTex(256, 128, (g) => {
        g.font = '900 86px "Avenir Next",Arial';
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillStyle = "#fff";
        g.fillText(d + "", 128, 70);
      }), transparent: true }));
      n.rotation.x = -Math.PI / 2;
      n.position.set(JV_LINE + d, 6e-3, FIELD_Z - 3.4);
      scene.add(n);
    }
    for (let d = 2; d <= 9; d++) {
      const l = new Mesh(new PlaneGeometry(0.03, 0.4), lineMat);
      l.rotation.x = -Math.PI / 2;
      l.position.set(LJ_BOARD + d, 6e-3, FIELD_Z + 1.62);
      scene.add(l);
    }
  }
  function flag(x, z, color, label, h = 1.4) {
    const g = new Group();
    const pole = new Mesh(new CylinderGeometry(0.02, 0.02, h, 6), new MeshStandardMaterial({ color: 14540253 }));
    pole.position.y = h / 2;
    g.add(pole);
    const cloth = new Mesh(new PlaneGeometry(0.55, 0.34), new MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.5, side: DoubleSide }));
    cloth.position.set(0.29, h - 0.18, 0);
    g.add(cloth);
    if (label) {
      const s = textSprite(label, "#" + new Color(color).getHexString(), { scale: 0.24 });
      s.position.set(0, h + 0.22, 0);
      g.add(s);
    }
    g.position.set(x, 0, z);
    fieldMarks.add(g);
    return g;
  }
  function wrLine(x, label, len = 2.8) {
    const g = new Group();
    const bar = new Mesh(new BoxGeometry(0.07, 0.03, len), new MeshBasicMaterial({ color: 16765773 }));
    bar.position.y = 0.04;
    g.add(bar);
    const glow = new Mesh(new PlaneGeometry(len, 0.45), new MeshBasicMaterial({ map: wrGhost.children[0].material.map, transparent: true, blending: AdditiveBlending, depthWrite: false, side: DoubleSide, fog: false }));
    glow.rotation.y = Math.PI / 2;
    glow.position.y = 0.22;
    g.add(glow);
    const s = textSprite(label, "#ffd34d", { scale: 0.2 });
    s.position.set(0, 0.7, -1.2);
    g.add(s);
    g.position.set(x, 0, FIELD_Z);
    fieldMarks.add(g);
  }
  const landMark = new Mesh(new CircleGeometry(0.32, 20), new MeshBasicMaterial({ color: 4863e3, transparent: true, opacity: 0.7, depthWrite: false }));
  landMark.rotation.x = -Math.PI / 2;
  landMark.scale.set(1.5, 1, 1);
  landMark.visible = false;
  scene.add(landMark);
  const limbG = (rTop, rBot, len, seg = 16) => {
    const g = new CylinderGeometry(rTop, rBot, len, seg, 4);
    g.translate(0, -len / 2, 0);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const y = -p.getY(i) / len, bulge = 1 + 0.14 * Math.sin(Math.PI * Math.min(1, y * 1.25));
      p.setX(i, p.getX(i) * bulge);
      p.setZ(i, p.getZ(i) * bulge);
    }
    g.computeVertexNormals();
    return g;
  };
  const torsoG = (() => {
    const pts = [[1e-3, 0], [0.12, 0], [0.125, 0.08], [0.118, 0.16], [0.135, 0.26], [0.155, 0.36], [0.15, 0.43], [0.11, 0.48], [0.055, 0.52], [1e-3, 0.53]].map(([r, y]) => new Vector2(r, y));
    const g = new LatheGeometry(pts, 24);
    g.scale(0.82, 1, 1.32);
    return g;
  })();
  const shortsG = (() => {
    const g = new SphereGeometry(0.14, 20, 12, 0, 6.283, 0, 2.1);
    g.scale(0.95, 0.85, 1.3);
    return g;
  })();
  function makeAthlete(a, idx) {
    const jersey = new MeshPhysicalMaterial({ color: a.col, roughness: 0.62, sheen: 1, sheenRoughness: 0.45, sheenColor: new Color(a.col).lerp(new Color(16777215), 0.4) });
    const skin = new MeshPhysicalMaterial({ color: a.skin, roughness: 0.48, sheen: 0.4, sheenRoughness: 0.6, sheenColor: 16767168, clearcoat: 0.08, clearcoatRoughness: 0.6 });
    const shorts = new MeshPhysicalMaterial({ color: 1448750, roughness: 0.55, sheen: 0.6, sheenColor: 5267616 });
    const shoeM = new MeshPhysicalMaterial({ color: 16053492, roughness: 0.4, clearcoat: 0.4 });
    const soleM = new MeshStandardMaterial({ color: a.col, roughness: 0.5 });
    const root = new Group(), pelvis = new Group();
    root.add(pelvis);
    pelvis.add(new Mesh(shortsG, shorts));
    const torso = new Group();
    torso.position.y = 0.02;
    pelvis.add(torso);
    torso.add(new Mesh(torsoG, jersey));
    const bib = new Mesh(new PlaneGeometry(0.17, 0.13), new MeshStandardMaterial({ roughness: 0.8, map: canvasTex(64, 48, (g) => {
      g.fillStyle = "#f4f4f0";
      g.fillRect(0, 0, 64, 48);
      g.font = "900 34px Arial";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillStyle = "#111";
      g.fillText(String(a.lane + 1), 32, 26);
    }) }));
    bib.position.set(0.02, 0.27, 0.172);
    torso.add(bib);
    const neck = new Mesh(limbG(0.048, 0.056, 0.12), skin);
    neck.position.y = 0.6;
    torso.add(neck);
    const head = new Mesh(new SphereGeometry(0.105, 24, 18), skin);
    head.scale.set(1.05, 1.15, 0.95);
    head.position.set(0.015, 0.67, 0);
    torso.add(head);
    const nose = new Mesh(new SphereGeometry(0.022, 8, 6), skin);
    nose.position.set(0.12, 0.665, 0);
    torso.add(nose);
    const hair = new Mesh(new SphereGeometry(0.112, 20, 12, 0, 6.283, 0, 1.25), new MeshStandardMaterial({ color: a.hair, roughness: 0.85 }));
    hair.scale.set(1.05, 1.12, 0.98);
    hair.position.copy(head.position);
    hair.rotation.z = 0.45;
    torso.add(hair);
    const arms = [], elbows = [], hands = [], legs = [], knees = [];
    for (const side of [1, -1]) {
      const sh = new Group();
      sh.position.set(0, 0.44, side * 0.19);
      torso.add(sh);
      const delt = new Mesh(new SphereGeometry(0.058, 14, 10), skin);
      delt.scale.set(1, 1.1, 0.9);
      sh.add(delt);
      sh.add(new Mesh(limbG(0.05, 0.038, 0.3), skin));
      const el = new Group();
      el.position.y = -0.3;
      sh.add(el);
      el.add(new Mesh(new SphereGeometry(0.038, 10, 8), skin));
      el.add(new Mesh(limbG(0.04, 0.028, 0.26), skin));
      const hd = new Mesh(new SphereGeometry(0.045, 12, 8), skin);
      hd.scale.set(0.8, 1.35, 0.6);
      hd.position.y = -0.3;
      el.add(hd);
      arms.push(sh);
      elbows.push(el);
      hands.push(hd);
      const lg = new Group();
      lg.position.set(0, -0.03, side * 0.092);
      pelvis.add(lg);
      const sl = new Mesh(limbG(0.098, 0.088, 0.2), shorts);
      lg.add(sl);
      lg.add(new Mesh(limbG(0.085, 0.052, 0.45), skin));
      const kn = new Group();
      kn.position.y = -0.45;
      lg.add(kn);
      kn.add(new Mesh(new SphereGeometry(0.053, 12, 8), skin));
      const shin = new Mesh(limbG(0.058, 0.032, 0.42), skin);
      kn.add(shin);
      const sock = new Mesh(limbG(0.036, 0.036, 0.06), shoeM);
      sock.position.y = -0.37;
      kn.add(sock);
      const shoe = new Mesh(new RoundedBoxGeometry(0.26, 0.075, 0.095, 3, 0.03), shoeM);
      shoe.position.set(0.055, -0.445, 0);
      kn.add(shoe);
      const sole = new Mesh(new RoundedBoxGeometry(0.265, 0.022, 0.1, 2, 0.01), soleM);
      sole.position.set(0.055, -0.48, 0);
      kn.add(sole);
      legs.push(lg);
      knees.push(kn);
    }
    root.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    const label = idx === 0 ? textSprite(a.name, a.css, { scale: 0.42, bg: "rgba(5,10,30,0.55)" }) : new Object3D();
    label.position.y = 2.2;
    root.add(label);
    if (idx === 0) {
      const ring = new Mesh(new RingGeometry(0.42, 0.5, 48), new MeshBasicMaterial({ color: 4185343, transparent: true, opacity: 0.7, depthWrite: false, toneMapped: false }));
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.01;
      root.add(ring);
      root.userData.ring = ring;
    }
    const blob = new Mesh(new CircleGeometry(0.42, 24), new MeshBasicMaterial({ map: glowTex, color: 0, transparent: true, opacity: 0.35, depthWrite: false }));
    blob.rotation.x = -Math.PI / 2;
    blob.position.y = 8e-3;
    root.add(blob);
    scene.add(root);
    return { root, pelvis, torso, arms, elbows, hands, legs, knees, label, blob, ph: Math.random() * 6 };
  }
  const figs = ATH.map(makeAthlete);
  const FLAT = new URLSearchParams(location.search).get("body") === "fig";
  const youG = new Group();
  scene.add(youG);
  const youCam = new Vector3();
  const YOU_OPTS = { scene: youG, camera: { position: youCam }, BP, x: 0, z: 0, tier: RK.quality ? RK.quality.tier : 1, gloves: false, levelFeet: false, stepRange: 0, guardDepth: 0.04, shadow: false, alpha: 0.55 };
  const youFig = FLAT ? create(Object.assign({}, YOU_OPTS, { outfit: { shorts: "rgba(22,27,46,0.88)", band: "#7fe0ff", seam: "rgba(10,12,24,0.7)" } })) : create2(Object.assign({}, YOU_OPTS, { shadow: true, look: "clothed", outfit: "runner", onFallback: (w) => {
    console.warn("real runner off:", w);
    youG.rotation.y = 0;
  } }));
  if (!FLAT) {
    youG.rotation.y = -Math.PI / 2;
    youCam.set(0, 1.6, 3.2);
  }
  const athNpc = ATH.map((a, k) => k && !FLAT ? create3({ scene: null, outfit: "runner", colors: { shirt: a.col, shorts: 1448750 }, lod: 1, tier: RK.quality ? RK.quality.tier : 1 }) : null);
  const D2 = 57.2958;
  function anglesOf(p) {
    const side = (j) => ({ thigh: p.legs[j][0] * D2, knee: p.legs[j][1] * D2, out: 3, arm: (p.arms[j][0] + p.lean) * D2, armOut: 8, elbow: (p.arms[j][1] - p.arms[j][0]) * D2 });
    return { lean: p.lean * D2, l: side(0), r: side(1) };
  }
  window.__youFig = youFig;
  const podium = new Group();
  {
    const m = new MeshPhysicalMaterial({ color: 15921904, roughness: 0.35, clearcoat: 0.5 });
    [[0, 0.6, 1], [-1.4, 0.4, 2], [1.4, 0.25, 3]].forEach(([x, h, n]) => {
      const b = new Mesh(new RoundedBoxGeometry(1.3, h, 1.1, 3, 0.04), m);
      b.position.set(x, h / 2, 0);
      b.castShadow = b.receiveShadow = true;
      podium.add(b);
      const num = new Mesh(new PlaneGeometry(0.4, 0.4), new MeshStandardMaterial({ transparent: true, map: canvasTex(128, 128, (g) => {
        g.font = "900 110px Arial";
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillStyle = ["#c9a227", "#9aa4b0", "#b06a35"][n - 1];
        g.fillText(String(n), 64, 70);
      }) }));
      num.position.set(x, h / 2, 0.56);
      podium.add(num);
    });
    podium.position.set(FINISH_X + 8, 0, 2.4);
    podium.visible = false;
    scene.add(podium);
  }
  function applyPose(f, p) {
    f.pelvis.position.y = p.hipY;
    f.torso.rotation.z = -p.lean;
    for (let j = 0; j < 2; j++) {
      f.legs[j].rotation.z = p.legs[j][0];
      f.knees[j].rotation.z = -p.legs[j][1];
      f.arms[j].rotation.z = p.arms[j][0] + p.lean;
      f.elbows[j].rotation.z = p.arms[j][1] - p.arms[j][0];
    }
  }
  function runPose(ph, sf) {
    const amp = 0.3 + 0.75 * sf, p = { hipY: 0.95 - 0.04 * sf + 0.05 * sf * Math.abs(Math.cos(ph)), lean: 0.06 + 0.24 * sf, legs: [], arms: [] };
    for (let j = 0; j < 2; j++) {
      const q = ph + j * Math.PI, th = amp * 0.85 * Math.sin(q), flex = 0.12 + (0.5 + 1.5 * sf) * Math.pow(Math.max(0, Math.cos(q)), 1.4);
      p.legs.push([th, flex]);
      const ua = -amp * 1.05 * Math.sin(q);
      p.arms.push([ua, ua + 1.35 + 0.2 * sf]);
    }
    return p;
  }
  function standPose(t, cheer = 0) {
    const b = 0.012 * Math.sin(t * 2.2);
    const up = cheer > 0 ? [2.7 + 0.25 * Math.sin(t * 9), 2.9 + 0.3 * Math.sin(t * 9 + 1)] : [0.12, 0.35];
    return { hipY: 0.94 + b + cheer * 0.06 * Math.max(0, Math.sin(t * 9)), lean: 0.02, legs: [[0.05, 0.08], [-0.05, 0.06]], arms: [[up[0], up[1]], [cheer ? up[0] - 0.1 : -0.1, cheer ? up[1] : 0.15]] };
  }
  const POSE = {
    marks: () => ({ hipY: 0.46, lean: 1.35, legs: [[1.35, 2.35], [0.45, 1.7]], arms: [[0.05, 0.05], [-0.05, -0.05]] }),
    // set: crouch-start coaching video (YwbPv91e6AY, docs/stance/REFERENCE.md): front knee ~90, rear knee ~125, the back nearly
    // level with the hips a little above the shoulders, arms straight down to the line
    set: () => ({ hipY: 0.66, lean: 1.38, legs: [[1.2, 1.57], [0.4, 0.96]], arms: [[0, 0], [0, 0]] }),
    hurdle: (k) => ({ hipY: 0.95, lean: 0.55, legs: [[1.45, 0.12 + 0.3 * k], [0.35 + 0.2 * k, 2.1]], arms: [[-0.6, -0.2], [1.6, 1.75]] }),
    ljAir: (k) => ({ hipY: 0.95, lean: lerp(0.15, 0.55, k), legs: [[lerp(0.6, 1.4, k), lerp(1.2, 0.2, k)], [lerp(-0.4, 1.3, k), lerp(1.6, 0.35, k)]], arms: [[lerp(2.4, 1.2, k), lerp(2.6, 1.3, k)], [lerp(2.2, 1, k), lerp(2.5, 1.2, k)]] }),
    sit: () => ({ hipY: 0.34, lean: 0.5, legs: [[1.5, 0.15], [1.45, 0.3]], arms: [[1, 1.4], [0.8, 1.3]] })
  };
  function mirrorArms(p, mix = 1) {
    const L = BP.hands.left, R = BP.hands.right;
    if (!(BP.live || BP.mouse) || mix <= 0) return p;
    const map = (h) => lerp(1.5, -1, clamp((h.y - 0.2) / 0.65));
    if (L.seen) {
      const ua = map(L);
      p.arms[0] = [lerp(p.arms[0][0], ua, mix), lerp(p.arms[0][1], ua + 1.3, mix)];
    }
    if (R.seen) {
      const ua = map(R);
      p.arms[1] = [lerp(p.arms[1][0], ua, mix), lerp(p.arms[1][1], ua + 1.3, mix)];
    }
    return p;
  }
  const jav = new Group();
  {
    const shaft = new Mesh(new CylinderGeometry(0.014, 0.012, 2.6, 8), new MeshStandardMaterial({ color: 15265012, metalness: 0.8, roughness: 0.25 }));
    shaft.rotation.z = -Math.PI / 2;
    jav.add(shaft);
    const grip = new Mesh(new CylinderGeometry(0.02, 0.02, 0.2, 8), new MeshStandardMaterial({ color: 3134719, emissive: 3134719, emissiveIntensity: 0.5 }));
    grip.rotation.z = -Math.PI / 2;
    jav.add(grip);
    const tip = new Mesh(new ConeGeometry(0.016, 0.22, 8), new MeshStandardMaterial({ color: 16732240, metalness: 0.6, roughness: 0.3, emissive: 16719904, emissiveIntensity: 0.4 }));
    tip.rotation.z = -Math.PI / 2;
    tip.position.x = 1.4;
    jav.add(tip);
    jav.traverse((o) => {
      if (o.isMesh) o.castShadow = true;
    });
  }
  jav.visible = false;
  scene.add(jav);
  const javTrail = { length: 26 };
  const PN = 260, pPos = new Float32Array(PN * 3), pVel = new Float32Array(PN * 3), pLife = new Float32Array(PN), pCol = new Float32Array(PN * 3);
  const pGeo = new BufferGeometry();
  pGeo.setAttribute("position", new BufferAttribute(pPos, 3));
  pGeo.setAttribute("color", new BufferAttribute(pCol, 3));
  const parts = new Points(pGeo, new PointsMaterial({ size: 0.09, vertexColors: true, transparent: true, depthWrite: false, map: glowTex }));
  parts.frustumCulled = false;
  scene.add(parts);
  let pNext = 0;
  function burst3(x, y, z, n, col, spd = 3, up = 3) {
    const c = new Color(col);
    for (let k = 0; k < n; k++) {
      const i = pNext++ % PN;
      pPos.set([x, y, z], i * 3);
      pVel.set([rand(-1, 1) * spd, rand(0.3, 1) * up, rand(-1, 1) * spd * 0.6], i * 3);
      pLife[i] = rand(0.6, 1.2);
      pCol.set([c.r, c.g, c.b], i * 3);
    }
  }
  function stepParts(dt) {
    for (let i = 0; i < PN; i++) {
      if (pLife[i] <= 0) {
        pPos[i * 3 + 1] = -50;
        continue;
      }
      pLife[i] -= dt;
      pVel[i * 3 + 1] -= 9 * dt;
      for (let k = 0; k < 3; k++) pPos[i * 3 + k] += pVel[i * 3 + k] * dt;
      if (pPos[i * 3 + 1] < 0.02) {
        pPos[i * 3 + 1] = 0.02;
        pVel[i * 3] *= 0.5;
        pVel[i * 3 + 2] *= 0.5;
        pVel[i * 3 + 1] *= -0.2;
      }
    }
    pGeo.attributes.position.needsUpdate = true;
    pGeo.attributes.color.needsUpdate = true;
  }
  const hud = document.getElementById("hud");
  let ctx = hud.getContext("2d");
  let W = 0, H = 0, U = 0, DPR = 1;
  function resize() {
    W = innerWidth;
    H = innerHeight;
    U = Math.min(W, H);
    DPR = Math.min(2, devicePixelRatio || 1);
    hud.width = W * DPR;
    hud.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  addEventListener("resize", resize);
  resize();
  const FONT = '"Avenir Next","Segoe UI","Helvetica Neue",Arial,sans-serif';
  const font = (px, w = 800) => "".concat(w, " ").concat(Math.round(px), "px ").concat(FONT);
  function text(s, x, y, px, col = "#fff", align = "center", w = 800, glow = 0) {
    ctx.font = font(px, w);
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    if (glow) {
      ctx.shadowColor = col;
      ctx.shadowBlur = glow;
    }
    ctx.fillStyle = col;
    ctx.fillText(s, x, y);
    ctx.shadowBlur = 0;
  }
  function panel(x, y, w, h, r = U * 0.02, fillC = "rgba(8,12,30,0.72)", stroke = "rgba(120,170,255,0.25)") {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fillStyle = fillC;
    ctx.fill();
    if (stroke) {
      ctx.lineWidth = Math.max(1, U * 2e-3);
      ctx.strokeStyle = stroke;
      ctx.stroke();
    }
  }
  const MEDAL = ["#ffd34d", "#dfe7f0", "#e0915a"];
  function coin(x, y, r, place, label) {
    const c = MEDAL[place];
    const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
    g.addColorStop(0, "#fff");
    g.addColorStop(0.35, c);
    g.addColorStop(1, place === 0 ? "#a77c10" : place === 1 ? "#8c96a3" : "#8a4d22");
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 7);
    ctx.fillStyle = g;
    ctx.shadowColor = c;
    ctx.shadowBlur = r * 0.8;
    ctx.fill();
    ctx.shadowBlur = 0;
    if (label !== void 0) text(String(label), x, y + r * 0.05, r * 1.05, "rgba(40,25,5,0.85)", "center", 900);
  }
  function picto(cx, cy, s, kind, t, col = "#fff") {
    let p, h = 0, javA = null, extra = null;
    if (kind === "sprint") p = runPose(t * 9, 1);
    else if (kind === "hurdles") {
      const k = t * 0.9 % 1;
      if (k < 0.55) p = runPose(t * 9, 1);
      else {
        const a = (k - 0.55) / 0.45;
        p = POSE.hurdle(a);
        h = 0.45 * Math.sin(a * Math.PI);
      }
      extra = "hurdle";
    } else if (kind === "long") {
      const k = t * 0.6 % 1;
      p = POSE.ljAir(k);
      h = 0.6 * Math.sin(k * Math.PI);
      extra = "pit";
    } else {
      const k = t * 0.7 % 1;
      p = runPose(t * 8, 0.8);
      const a = k < 0.6 ? -2.5 : lerp(-2.5, -5.3, ease((k - 0.6) / 0.4));
      p.arms[1] = [a, a - 0.15];
      javA = k < 0.8 ? 0.5 : null;
    }
    ctx.save();
    ctx.translate(cx, cy);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = col;
    ctx.fillStyle = col;
    const P = (x, y) => [x * s, -(y + h) * s], dir = (a) => [Math.sin(a), -Math.cos(a)];
    const hip = [0, p.hipY], sh = [hip[0] + 0.52 * Math.sin(p.lean), hip[1] + 0.52 * Math.cos(p.lean)], hd = [sh[0] + 0.24 * Math.sin(p.lean), sh[1] + 0.24 * Math.cos(p.lean)];
    const limb = (o, a1, a2, L1, L2) => {
      const [dx1, dy1] = dir(a1), m = [o[0] + dx1 * L1, o[1] + dy1 * L1], [dx2, dy2] = dir(a2), e = [m[0] + dx2 * L2, m[1] + dy2 * L2];
      ctx.beginPath();
      ctx.moveTo(...P(...o));
      ctx.lineTo(...P(...m));
      ctx.lineTo(...P(...e));
      ctx.stroke();
      return e;
    };
    ctx.lineWidth = s * 0.13;
    if (extra === "hurdle") {
      ctx.globalAlpha = 0.6;
      ctx.lineWidth = s * 0.07;
      ctx.beginPath();
      ctx.moveTo(0.55 * s, 0);
      ctx.lineTo(0.55 * s, -0.9 * s);
      ctx.moveTo(0.4 * s, -0.9 * s);
      ctx.lineTo(0.75 * s, -0.9 * s);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.lineWidth = s * 0.13;
    }
    if (extra === "pit") {
      ctx.globalAlpha = 0.5;
      ctx.fillRect(0.2 * s, s * 0.04, 1.6 * s, s * 0.08);
      ctx.globalAlpha = 1;
    }
    limb(hip, p.legs[1][0], p.legs[1][0] - p.legs[1][1], 0.46, 0.46);
    let hand = limb(sh, p.arms[1][0], p.arms[1][1], 0.3, 0.3);
    ctx.beginPath();
    ctx.moveTo(...P(...hip));
    ctx.lineTo(...P(...sh));
    ctx.lineWidth = s * 0.17;
    ctx.stroke();
    ctx.lineWidth = s * 0.13;
    limb(hip, p.legs[0][0], p.legs[0][0] - p.legs[0][1], 0.46, 0.46);
    limb(sh, p.arms[0][0], p.arms[0][1], 0.3, 0.3);
    ctx.beginPath();
    ctx.arc(...P(...hd), s * 0.12, 0, 7);
    ctx.fill();
    if (javA !== null) {
      const [hx, hy] = P(...hand);
      ctx.lineWidth = s * 0.05;
      ctx.beginPath();
      ctx.moveTo(hx - Math.cos(javA) * s * 0.7, hy + Math.sin(javA) * s * 0.7);
      ctx.lineTo(hx + Math.cos(javA) * s * 0.9, hy - Math.sin(javA) * s * 0.9);
      ctx.stroke();
    }
    ctx.restore();
  }
  function stanceJ(kind, t) {
    const run = (k, amp = 1) => {
      const a = Math.sin(k * Math.PI * 2), up = Math.max(0, a), dn = Math.max(0, -a);
      return { lift: [up * 0.85 * amp, dn * 0.85 * amp], arm: a * amp, bob: Math.abs(a) * 0.025 * amp, jumpH: 0, crouch: 0, tuck: 0, armsUp: 0, jav: null };
    };
    if (kind === "crouch") {
      const k = t * 0.45 % 1, c = k < 0.12 ? k / 0.12 : k < 0.62 ? 1 : k < 0.7 ? 1 - (k - 0.62) / 0.08 : 0;
      const o = k < 0.7 ? { lift: [0, 0], arm: 0, bob: 0, jumpH: 0, crouch: ease(c), tuck: 0, armsUp: 0, jav: null } : run(t * 2.4);
      o.cue = k < 0.62 ? "down" : "go";
      return o;
    }
    if (kind === "hurdles" || kind === "long") {
      const k = t * 0.5 % 1;
      if (k < 0.62) return Object.assign(run(t * 2.4), { cue: "knees" });
      const a = (k - 0.62) / 0.38, h = Math.sin(clamp(a / 0.7) * Math.PI);
      return { lift: [0.7 * h, 0.7 * h], arm: 0, bob: 0, jumpH: h * 0.22, crouch: a < 0.08 ? 0.5 : 0, tuck: h, armsUp: kind === "long" ? h : h * 0.5, jav: null, cue: "jump" };
    }
    if (kind === "jav") {
      const k = t * 0.42 % 1;
      if (k < 0.45) return Object.assign(run(t * 2.4, 0.7), { cue: "knees" });
      const o = run(t * 2.4, 0.35);
      o.jav = k < 0.78 ? 0 : clamp((k - 0.78) / 0.12);
      o.cue = k < 0.78 ? "back" : "throw";
      return o;
    }
    return Object.assign(run(t * 2.4), { cue: "knees" });
  }
  function drawStance(cx, by, s, kind, t, col = "#ffd34d") {
    const J = stanceJ(kind, t), c = J.crouch;
    const hipY = 0.5 - c * 0.17 + J.bob + J.jumpH - J.tuck * 0.08, shY = hipY + 0.31 - c * 0.07, P = (x, y) => [cx + x * s, by - y * s];
    const hip = [0.075, hipY], sh = 0.115;
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const shw = s * (0.26 - J.jumpH * 0.4);
    const g = ctx.createRadialGradient(cx, by, 0, cx, by, shw);
    g.addColorStop(0, "rgba(0,0,0,0.5)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(cx, by, shw, shw * 0.2, 0, 0, 7);
    ctx.fill();
    const body = "rgba(214,236,255,0.92)", lw = s * 0.085;
    const seg = (pts, w) => {
      ctx.lineWidth = w;
      ctx.beginPath();
      pts.forEach((p, i) => {
        const q = P(...p);
        i ? ctx.lineTo(...q) : ctx.moveTo(...q);
      });
      ctx.stroke();
    };
    ctx.strokeStyle = body;
    ctx.fillStyle = body;
    ctx.shadowColor = col;
    ctx.shadowBlur = s * 0.05;
    const knees = [], feet = [];
    for (const [i, sd] of [[0, -1], [1, 1]]) {
      const L = J.lift[i], kx = sd * (0.085 + c * 0.07 + J.tuck * 0.02), ky = hipY - 0.25 * (1 - L * 0.95) + c * 0.06;
      const fx = sd * (0.09 + c * 0.04), fy = c ? 0 : Math.max(J.jumpH * 0.6, ky - 0.24 + L * 0.03);
      knees.push([kx, ky]);
      feet.push([fx, Math.max(0, fy)]);
      seg([[sd * hip[0], hipY], [kx, ky], [fx, Math.max(0, fy)]], lw * 1.12);
      seg([[fx, Math.max(0, fy)], [fx + sd * 0.03, Math.max(0, fy)]], lw * 0.8);
    }
    ctx.beginPath();
    const tl = P(-sh, shY), tr = P(sh, shY), bl = P(-0.08, hipY - 0.02), br = P(0.08, hipY - 0.02);
    ctx.moveTo(...tl);
    ctx.lineTo(...tr);
    ctx.lineTo(...br);
    ctx.lineTo(...bl);
    ctx.closePath();
    ctx.lineWidth = lw * 0.9;
    ctx.stroke();
    ctx.fill();
    seg([[0, shY], [0, shY + 0.05]], lw * 0.7);
    const hd = P(0, shY + 0.115);
    ctx.beginPath();
    ctx.arc(hd[0], hd[1], s * 0.068, 0, 7);
    ctx.fill();
    for (const [i, sd] of [[0, -1], [1, 1]]) {
      const S = [sd * sh, shY - 0.01];
      let E, Hh;
      if (c > 0.3) {
        E = [sd * (sh + 0.05), shY - 0.13];
        Hh = [knees[i][0] * 0.9, knees[i][1] + 0.03];
      } else if (J.armsUp > 0.05) {
        const a = J.armsUp;
        E = [sd * (sh + 0.06 + 0.02 * a), shY - 0.15 + 0.3 * a];
        Hh = [sd * (sh + 0.07 + 0.03 * a), shY - 0.27 + 0.55 * a];
      } else {
        const p = (i ? -1 : 1) * J.arm;
        E = [sd * (sh + 0.05), shY - 0.15];
        Hh = [sd * (sh - 0.01), shY - 0.13 + 0.1 * p];
      }
      if (J.jav !== null && sd === 1) {
        const k = J.jav;
        E = [lerp(sh + 0.1, sh + 0.06, k), lerp(shY + 0.1, shY - 0.08, k)];
        Hh = [lerp(sh + 0.03, sh - 0.02, k), lerp(shY + 0.2, shY - 0.02, k)];
        const ja = lerp(-0.35, -1.1, k), q = P(...Hh);
        ctx.save();
        ctx.lineWidth = s * 0.022;
        ctx.strokeStyle = "#ffffff";
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(q[0] - Math.cos(ja) * s * 0.34, q[1] + Math.sin(ja) * s * 0.34);
        ctx.lineTo(q[0] + Math.cos(ja) * s * 0.3, q[1] - Math.sin(ja) * s * 0.3);
        ctx.stroke();
        ctx.restore();
      }
      seg([S, E, Hh], lw * 0.82);
      const hq = P(...Hh), hg = ctx.createRadialGradient(hq[0], hq[1], 0, hq[0], hq[1], s * 0.06);
      hg.addColorStop(0, col);
      hg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.save();
      ctx.shadowBlur = 0;
      ctx.fillStyle = hg;
      ctx.beginPath();
      ctx.arc(hq[0], hq[1], s * 0.06, 0, 7);
      ctx.fill();
      ctx.restore();
    }
    ctx.shadowBlur = 0;
    ctx.strokeStyle = col;
    ctx.fillStyle = col;
    ctx.lineWidth = s * 0.02;
    const arrow = (x, y0, y1) => {
      const a = P(x, y0), b = P(x, y1), d = Math.sign(b[1] - a[1]), hl = s * 0.045;
      ctx.beginPath();
      ctx.moveTo(...a);
      ctx.lineTo(b[0], b[1] - d * hl * 0.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(...b);
      ctx.lineTo(b[0] - hl * 0.6, b[1] - d * hl);
      ctx.lineTo(b[0] + hl * 0.6, b[1] - d * hl);
      ctx.closePath();
      ctx.fill();
    };
    if (J.cue === "knees") {
      const up = J.lift[0] > J.lift[1] ? 0 : 1, kx = knees[up][0] + (up ? 0.13 : -0.13);
      arrow(kx, 0.12, 0.38);
    } else if (J.cue === "jump") {
      arrow(-0.3, 0.1 + J.jumpH, 0.42 + J.jumpH);
      arrow(0.3, 0.1 + J.jumpH, 0.42 + J.jumpH);
    } else if (J.cue === "down") {
      arrow(-0.3, 0.62, 0.36);
      arrow(0.3, 0.62, 0.36);
    } else if (J.cue === "throw") {
      const a = P(sh + 0.2, shY + 0.22), b = P(sh + 0.12, shY - 0.1);
      ctx.beginPath();
      ctx.moveTo(...a);
      ctx.quadraticCurveTo(a[0] + s * 0.1, (a[1] + b[1]) / 2, ...b);
      ctx.stroke();
    }
    ctx.restore();
  }
  let howCv = null;
  function howToTile(t) {
    if (!howCv) {
      const w = document.querySelector(".bph-move canvas");
      if (!w) return;
      howCv = document.createElement("canvas");
      w.replaceWith(howCv);
    }
    const r = howCv.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
    if (!r.width) return;
    if (howCv.width !== Math.round(r.width * d)) {
      howCv.width = Math.round(r.width * d);
      howCv.height = Math.round(r.height * d);
    }
    const c2 = howCv.getContext("2d"), keep = ctx;
    c2.setTransform(d, 0, 0, d, 0, 0);
    c2.clearRect(0, 0, r.width, r.height);
    ctx = c2;
    try {
      drawStance(r.width / 2, r.height * 0.95, r.height * 0.86, "run", t, "#6be6ff");
    } finally {
      ctx = keep;
    }
  }
  let AC = null, MG = null, crowdG = null, noiseBuf = null;
  function initAudio() {
    if (AC) {
      if (AC.state === "suspended") AC.resume();
      return;
    }
    try {
      AC = new (window.AudioContext || window.webkitAudioContext)();
      MG = AC.createGain();
      MG.gain.value = MUTE ? 0 : 0.85;
      MG.connect(AC.destination);
      const len = AC.sampleRate * 4;
      noiseBuf = AC.createBuffer(2, len, AC.sampleRate);
      for (let c = 0; c < 2; c++) {
        const d = noiseBuf.getChannelData(c);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < len; i++) {
          const w = Math.random() * 2 - 1;
          b0 = 0.99765 * b0 + w * 0.099;
          b1 = 0.963 * b1 + w * 0.2965;
          b2 = 0.57 * b2 + w * 1.0526;
          d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.16;
        }
      }
      const src = AC.createBufferSource();
      src.buffer = noiseBuf;
      src.loop = true;
      const bp = AC.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 950;
      bp.Q.value = 0.55;
      const lp = AC.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 2800;
      crowdG = AC.createGain();
      crowdG.gain.value = 0;
      const lfo = AC.createOscillator(), lg = AC.createGain();
      lfo.frequency.value = 0.31;
      lg.gain.value = 0.025;
      lfo.connect(lg);
      lg.connect(crowdG.gain);
      lfo.start();
      src.connect(bp);
      bp.connect(lp);
      lp.connect(crowdG);
      crowdG.connect(MG);
      src.start();
    } catch (e) {
      AC = null;
    }
  }
  function noiseHit(dur, freq, q, vol, type = "bandpass", sweep = 0) {
    if (!AC) return;
    try {
      const t = AC.currentTime, s = AC.createBufferSource();
      s.buffer = noiseBuf;
      const f = AC.createBiquadFilter();
      f.type = type;
      f.frequency.setValueAtTime(freq, t);
      if (sweep) f.frequency.exponentialRampToValueAtTime(sweep, t + dur);
      f.Q.value = q;
      const g = AC.createGain();
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(1e-3, t + dur);
      s.connect(f);
      f.connect(g);
      g.connect(MG);
      s.start(t, Math.random() * 3, dur + 0.05);
    } catch (e) {
    }
  }
  function tone(freq, dur, type = "sine", vol = 0.2, slide = 0, delay = 0) {
    if (!AC) return;
    try {
      const t = AC.currentTime + delay, o = AC.createOscillator(), g = AC.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, t);
      if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
      g.gain.setValueAtTime(1e-4, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
      g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
      o.connect(g);
      g.connect(MG);
      o.start(t);
      o.stop(t + dur + 0.05);
    } catch (e) {
    }
  }
  const SFX = {
    gun() {
      noiseHit(0.5, 1800, 0.4, 1.4, "highpass");
      noiseHit(0.25, 400, 0.6, 1.2, "lowpass");
      tone(110, 0.3, "sine", 0.7, 35);
    },
    step(v) {
      noiseHit(0.05, 220 + v * 12, 1.3, 0.35, "lowpass");
    },
    beep(f = 660) {
      tone(f, 0.16, "square", 0.09);
    },
    clunk() {
      tone(170, 0.22, "triangle", 0.4, 60);
      noiseHit(0.16, 700, 1.2, 0.6);
    },
    whoosh() {
      noiseHit(0.35, 600, 1.4, 0.45, "bandpass", 2600);
    },
    thud() {
      noiseHit(0.45, 500, 0.7, 1, "lowpass", 120);
      tone(75, 0.25, "sine", 0.5, 40);
    },
    tick() {
      tone(1250, 0.04, "sine", 0.06);
    },
    ding() {
      tone(988, 0.25, "sine", 0.18);
      tone(1319, 0.35, "sine", 0.14, 0, 0.08);
    },
    fanfare() {
      [523, 659, 784, 1047, 784, 1047].forEach((f, i) => {
        tone(f, i > 3 ? 0.6 : 0.22, "sawtooth", 0.07, 0, i * 0.14);
        tone(f / 2, i > 3 ? 0.6 : 0.22, "triangle", 0.08, 0, i * 0.14);
      });
    },
    roar() {
      noiseHit(2.2, 900, 0.5, 0.9, "bandpass", 1400);
    },
    boo() {
      tone(220, 0.5, "sawtooth", 0.05, 150);
    },
    hop() {
      tone(392, 0.16, "triangle", 0.28, 1046);
      tone(784, 0.12, "sine", 0.12, 1568, 0.06);
    }
    // HOP! registered: a rising boing
  };
  let excite = 0.2, exciteT = 0.2;
  function setCrowd() {
    if (!AC || !crowdG) return;
    crowdG.gain.setTargetAtTime(0, AC.currentTime, 0.2);
  }
  const G = {
    state: "title",
    st: 0,
    ev: 0,
    assist: 0,
    total: 0,
    results: [],
    medals: ATH.map(() => ({ g: 0, s: 0, b: 0 })),
    saved: false,
    best: BP.best(GAME_ID),
    streak: 0,
    knockRow: 0,
    forgive: 1,
    celebrated: false,
    bonus: 0
  };
  let race = null, field = null, NOW = 0, TS = 1;
  const inp = { legs: 0, pumpS: 0, run: 0, raw: 0, key: 0, lastKey: "", armPk: 0, hist: [], pump: 0, it: 0 };
  let msg = null, pops = [], confetti = [], flash = 0, buttons = [], cam = { x: 0, y: 3, z: 14, lx: 0, ly: 1, lz: 0, init: false };
  function setState(s) {
    G.state = s;
    G.st = NOW;
    (G.log || (G.log = [])).push("".concat((NOW / 1e3).toFixed(1), " ").concat(EVENTS[G.ev].id, ":").concat(s));
    if (G.log.length > 80) G.log.shift();
  }
  const sinceS = () => (NOW - G.st) / 1e3;
  function say(t, sub = "", col = "#ffffff", dur = 1.4) {
    msg = { t, sub, col, t0: NOW, dur };
  }
  function pop(t, col = "#fff", y = 0.42) {
    pops = [{ t, col, t0: NOW, y }];
  }
  const diffMul = () => (1 + 0.012 * G.ev) * (1 - G.assist);
  const speedCurve = (r) => 1 - Math.pow(1 - clamp(r), 1.6);
  const RS = RunStep();
  let rsKey = 0;
  const STEP = { at: -9e9, src: "", n: 0, hopAt: -9e9, hopSrc: "" };
  const picRun = () => RS.fresh(performance.now() / 1e3);
  function feedRun(now) {
    if (BP.rawImg && BP.imgAt && BP.imgAt !== rsKey) {
      rsKey = BP.imgAt;
      RS.feed(BP.imgAt / 1e3, BP.rawImg, BP.vis);
    }
    RS.tick(now / 1e3);
  }
  function readInput(dt) {
    const L = BP.hands.left, R = BP.hands.right, on = BP.live || BP.mouse;
    const B = BP.body, pic = picRun(), running = pic ? RS.running : B.running || 0, amp = pic ? RS.amp : 0;
    inp.spm = pic ? RS.cadence : B.cadence || 0;
    inp.legs = BP.live && running > 0 ? clamp(0.1 + 1.15 * running + 0.1 * amp) : 0;
    let p = BP.mouse && R.seen ? Math.abs(R.vy) : 0;
    inp.pumpS += (p - inp.pumpS) * Math.min(1, dt * 5);
    inp.pump = BP.mouse ? clamp((inp.pumpS - 0.25) / 1.6) : 0;
    inp.key = Math.max(0, inp.key - dt * 0.9);
    inp.raw = Math.max(inp.legs, inp.pump, inp.key);
    (inp.lh || (inp.lh = [])).push([NOW, inp.legs]);
    while (inp.lh.length && NOW - inp.lh[0][0] > 700) inp.lh.shift();
    const held = Math.max(inp.raw, ...inp.lh.map((h) => h[1]));
    inp.run += (held - inp.run) * Math.min(1, dt * (held > inp.run ? 4 : 2.2));
    const AH = field && field.jh ? BP.hands[field.jh] : R;
    inp.hist.push([NOW, AH.seen && on ? AH.speed + Math.max(0, AH.push || 0) * 0.4 : 0]);
    while (inp.hist.length && NOW - inp.hist[0][0] > 350) inp.hist.shift();
    inp.armPk = inp.hist.reduce((m, h) => Math.max(m, h[1]), 0);
  }
  function startMeet() {
    BP.howTo && BP.howTo.hide();
    initAudio();
    if (!MUTE && BP.music) BP.music("track", 0.22);
    Object.assign(G, { ev: 0, assist: 0, total: 0, results: [], medals: ATH.map(() => ({ g: 0, s: 0, b: 0 })), saved: false, streak: 0, bonus: 0 });
    BP.activity.activeSec = 0;
    BP.activity.kcal = 0;
    startEvent(0);
  }
  function startEvent(i) {
    G.ev = i;
    const ev = EVENTS[i];
    G.knockRow = 0;
    G.forgive = 1;
    G.celebrated = false;
    G.celebrating = false;
    race = null;
    field = null;
    fieldMarks.clear();
    landMark.visible = false;
    jav.visible = false;
    wrGhost.visible = false;
    hurdleGroups.forEach((l) => l.forEach((h) => {
      h.visible = !!ev.hurdles;
      h.rotation.z = 0;
      h.userData.fall = 0;
    }));
    tape.visible = ev.kind === "race";
    tape.scale.z = 1;
    if (ev.kind === "race") {
      const start = FINISH_X - ev.dist;
      race = {
        ev,
        start,
        clock: 0,
        goAt: 0,
        reaction: null,
        falseStarts: 0,
        fsT: 0,
        crouched: false,
        dip: 0,
        dipped: false,
        photo: false,
        tapeBroken: false,
        done: false,
        runners: ATH.map((a, k) => ({
          k,
          x: 0,
          v: 0,
          ph: Math.random() * 6,
          air: -1,
          airDur: 0.5,
          fin: null,
          react: k ? rand(0.14, 0.24) : 0,
          vT: k ? ev.vmax * ev.rival[k - 1] * diffMul() * rand(0.97, 1.02) : 0,
          hNext: 0,
          knocks: 0,
          lastStep: 0,
          h: 0
        }))
      };
      const wrK = 0.95;
      race.wrV = ev.dist / (ev.wr - (1 - Math.exp(-wrK * ev.wr)) / wrK);
    } else {
      field = { ev, attempt: 0, marks: [], rival: ev.rival.map((m) => +(m * diffMul() * rand(0.97, 1.03)).toFixed(2)) };
      field.rival.forEach((m, k) => {
        const base = ev.id === "long" ? LJ_BOARD : JV_LINE;
        flag(base + m, FIELD_Z - (ev.id === "long" ? 1.7 + k * 0.35 : 2.6 + k * 0.6), ATH[k + 1].col, "", 0.8 + k * 0.5);
      });
      wrLine((ev.id === "long" ? LJ_BOARD : JV_LINE) + ev.wr, "WORLD RECORD ".concat(ev.wr.toFixed(2)), ev.id === "long" ? 2.8 : 5.6);
    }
    setState("intro");
    SFX.ding();
    exciteT = 0.45;
    if (state().grace) state().grace(1500);
  }
  function resetAttempt() {
    const ev = field.ev;
    Object.assign(field, { x: 0, v: 0, ph: 0, h: 0, air: null, idle: 0, t: 0, thrown: false, throwT: -1, foul: false, mark: null, cocked: false, cockT: 0, cockY: null, jh: null, ck: { right: 0, left: 0 }, whip: null, javP: null });
    jav.visible = ev.id === "jav";
    landMark.visible = false;
  }
  function nextAfterResults() {
    if (G.ev < EVENTS.length - 1) startEvent(G.ev + 1);
    else {
      setState("medals");
      if (!G.saved) {
        G.saved = true;
        G.activeMin = BP.activity.activeSec / 60;
        G.kcal = BP.activity.kcal;
        BP.saveSession({ game: GAME_ID, score: G.total });
        if (BP.highScores) BP.highScores(GAME_ID, G.total);
        G.best = BP.best(GAME_ID);
      }
      const tbl = medalTable();
      if (tbl[0].k === 0) {
        SFX.fanfare();
        confettiBurst(260);
        fireworks(10);
      }
      exciteT = 0.8;
    }
  }
  function medalTable() {
    return G.medals.map((m, k) => ({ k, ...m })).sort((a, b) => b.g - a.g || b.s - a.s || b.b - a.b || (a.k === 0 ? -1 : b.k === 0 ? 1 : 0));
  }
  function finishEvent(rows) {
    const ev = EVENTS[G.ev];
    rows.forEach((r, i) => {
      r.place = i;
      if (i < 3 && r.val !== null && isFinite(r.val)) {
        const m = G.medals[r.k];
        if (i === 0) m.g++;
        else if (i === 1) m.s++;
        else m.b++;
        r.medal = i;
      }
    });
    const me = rows.find((r) => r.k === 0), pts = me.val !== null && isFinite(me.val) ? ev.pts(me.val) : 0;
    G.total += pts;
    G.results.push({ ev, rows, pts });
    if (me.place === 3 || me.medal === void 0) G.assist = Math.min(0.15, G.assist + 0.04);
    else if (me.place === 0) G.assist = Math.max(-0.05, G.assist - 0.02);
    setState("results");
    G.lastPts = pts;
    G.lastPlace = me.place;
    if (me.medal === 0) {
      SFX.fanfare();
      confettiBurst(160);
      exciteT = 1;
      fireworks(4);
    } else if (me.medal !== void 0) {
      SFX.ding();
      exciteT = 0.75;
      confettiBurst(60);
    } else exciteT = 0.35;
  }
  function confettiBurst(n) {
    const cols = ["#ffd34d", "#3fdcff", "#ff6fb1", "#7dff9a", "#ffffff", "#ff9a3a"];
    for (let i = 0; i < n; i++) confetti.push({ x: rand(0, W), y: rand(-H * 0.3, -10), vx: rand(-60, 60), vy: rand(80, 260), r: rand(0, 6), vr: rand(-8, 8), s: rand(U * 7e-3, U * 0.016), c: cols[Math.random() * cols.length | 0], life: rand(3, 5) });
  }
  function actionPress(kind) {
    if (G.state === "run" && race) {
      const r = race.runners[0];
      if (race.ev.hurdles && r.air < 0) {
        const next = HURDLE_X[r.hNext];
        if (next === void 0) return;
        const dn = next - r.x;
        if (dn > 7.5 || dn < -0.3) return;
        r.air = 0;
        r.airDur = 0.5 * G.forgive;
        SFX.whoosh();
      }
      if ((kind === "punch" || kind === "click" || kind === "key") && !race.ev.hurdles || kind === "punch") {
        if (race.ev.dist - r.x < 4 && r.fin === null && !race.dipped) {
          race.dipped = true;
          race.dip = 1e-3;
          SFX.whoosh();
          pop("LEAN!", "#ffd34d", 0.5);
        }
      }
    }
    if (G.state === "approach" && field) {
      const ev = field.ev;
      if (ev.id === "long" && (kind === "jump" || kind === "click" || kind === "key")) takeoff();
      if (ev.id === "jav" && (kind === "throw" || kind === "punch" || kind === "click" || kind === "key")) throwJav(kind);
    }
  }
  function takeoff() {
    const f = field;
    if (f.air) return;
    const dist = LJ_BOARD - (f.ev.origin + f.x);
    if (dist > 5) return;
    if (dist < -0.05) {
      foulAttempt("FOUL!", "stepped over the board");
      return;
    }
    const v = Math.max(3, f.v), th = 0.37, D = v * v / 9.81 * Math.sin(2 * th) + 0.6, T = Math.max(0.55, 2 * v * Math.sin(th) / 9.81);
    const peak = Math.min(0.9, (v * Math.sin(th)) ** 2 / (2 * 9.81) + 0.1);
    f.air = { x0: f.x, D, T, t: 0, peak, lost: Math.max(0, dist) };
    setState("flight");
    SFX.whoosh();
    exciteT = 0.75;
    if (dist < 0.3) pop("PERFECT TAKEOFF!", "#7dff9a", 0.32);
    else if (dist > 1.5) pop("A BIT EARLY", "#ffb347", 0.32);
  }
  function throwJav(kind) {
    const f = field;
    if (f.thrown) return;
    const lx = JV_LINE - (f.ev.origin + f.x);
    if (lx > 12) return;
    const R = BP.hands[f.jh || "right"];
    let arm = clamp(Math.max(inp.armPk, f.whip ? f.whip.pk : 0), 0, 3), ang;
    const loft = (y) => 44 - 40 * clamp(y - 0.2, 0, 0.5);
    if (kind === "click" || kind === "key") {
      arm = Math.max(arm * 0.7, 2.1);
      ang = 36;
    } else if (kind === "punch") {
      arm = Math.max(arm, f.cocked ? 2.4 : 1.6);
      ang = loft(R.y);
    } else ang = loft(f.whip ? f.whip.y0 + 0.1 : R.y);
    ang = clamp(ang, 10, 60) * Math.PI / 180;
    const vr = 0.8 * f.v + 9 * Math.min(2.6, arm);
    f.thrown = true;
    f.throwT = 0;
    f.relAng = ang;
    f.relV = vr;
    const hp = new Vector3();
    figs[0].hands[1].getWorldPosition(hp);
    f.javP = { x: hp.x, y: Math.max(1.8, hp.y), vx: vr * Math.cos(ang), vy: vr * Math.sin(ang), trail: [] };
    setState("flight");
    SFX.whoosh();
    exciteT = 0.8;
  }
  function foulAttempt(t, sub) {
    field.foul = true;
    field.mark = null;
    field.marks.push(null);
    say(t, sub, "#ff5a5a", 2);
    SFX.boo();
    setState("landed");
    exciteT = 0.3;
  }
  RS.on("jump", (e) => {
    if (["run", "approach"].includes(G.state)) {
      STEP.hopAt = NOW;
      STEP.hopSrc = e.src;
      SFX.hop();
    }
    actionPress("jump");
  });
  BP.on("jump", () => {
    if (!picRun()) actionPress("jump");
  });
  function onStep(src) {
    STEP.at = NOW;
    STEP.src = src;
    STEP.n++;
    const r = race ? race.runners[0] : field;
    if (!r || !(r.v > 0.3)) return;
    const target = Math.ceil(r.ph / Math.PI) * Math.PI;
    r.ph += (target - r.ph) * 0.6;
  }
  RS.on("step", (e) => onStep(e.src));
  BP.on("step", () => {
    if (!picRun()) onStep("legs");
  });
  BP.on("punchL", () => actionPress("punch"));
  BP.on("punchR", () => actionPress("punch"));
  hud.addEventListener("pointerdown", (e) => {
    initAudio();
    for (const b of buttons) if (e.clientX > b.x && e.clientX < b.x + b.w && e.clientY > b.y && e.clientY < b.y + b.h) {
      b.act();
      SFX.tick();
      return;
    }
    if (G.state === "intro") {
      advanceIntro();
      return;
    }
    actionPress("click");
  });
  addEventListener("keydown", (e) => {
    initAudio();
    if (e.key === "Enter" || e.key === " " && !["run", "approach"].includes(G.state)) {
      const b = buttons.find((b2) => b2.primary) || null;
      if (b) {
        b.act();
        SFX.tick();
      } else if (G.state === "title" || G.state === "medals") startMeet();
      else if (G.state === "results") nextAfterResults();
      else if (G.state === "intro") advanceIntro();
      else if (e.key === " ") actionPress("key");
      e.preventDefault();
      return;
    }
    if (e.key === " ") {
      actionPress("key");
      e.preventDefault();
    }
    if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && e.key !== inp.lastKey) {
      inp.lastKey = e.key;
      inp.key = Math.min(1, inp.key + 0.16);
    }
    if (e.key === "Escape") location.href = "index.html";
  });
  function advanceIntro() {
    const ev = EVENTS[G.ev];
    if (ev.kind === "race") beginMarks();
    else {
      resetAttempt();
      setState("fieldReady");
    }
  }
  function beginMarks() {
    setState("marks");
    race.crouched = false;
    say("ON YOUR MARKS", "crouch down into the blocks", "#ffffff", 1.6);
    SFX.beep(520);
  }
  function updateRace(dt) {
    const ev = race.ev, s = G.state, me = race.runners[0];
    if (s === "marks") {
      if (BP.body.crouch > 0.25) race.crouched = true;
      if (sinceS() > 1.7) {
        setState("set");
        race.setDur = rand(1.1, 2.1);
        say("SET", race.crouched ? "nice block position!" : "stay still...", "#ffd34d", 1.2);
        SFX.beep(660);
      }
    } else if (s === "set") {
      if (BP.body.crouch > 0.25) race.crouched = true;
      if (race.falseStarts < 2 && sinceS() > 0.35 && inp.raw > 0.75) race.fsT += dt;
      else race.fsT = Math.max(0, race.fsT - dt);
      if (race.fsT > 0.3) {
        race.falseStarts++;
        race.fsT = 0;
        setState("false");
        say("FALSE START!", "stay still until the gun", "#ff5a5a", 1.8);
        SFX.boo();
      } else if (sinceS() > race.setDur) {
        setState("run");
        race.goAt = NOW;
        SFX.gun();
        say("GO!", "", "#7dff9a", 0.8);
        flash = 1;
        exciteT = 0.7;
        burst3(race.start, 0.3, laneZ(ATH[0].lane), 30, 16765773, 2, 2);
      }
    } else if (s === "false") {
      if (sinceS() > 1.8) beginMarks();
    }
    if (s !== "run" && s !== "raceDone") {
      race.runners.forEach((r) => {
        r.v = 0;
      });
      return;
    }
    race.clock = (NOW - race.goAt) / 1e3;
    const t = race.clock;
    const close = me.fin === null && ev.dist - me.x < 4 && ev.dist - me.x > -0.5 && race.runners.some((r) => r.k && Math.abs(r.x - me.x) < 1.2);
    if (close && !race.photo) {
      race.photo = true;
      say("PHOTO FINISH!", "punch toward the TV to LEAN at the line!", "#ffd34d", 1.4);
    }
    for (const r of race.runners) {
      if (r.k === 0) {
        if (race.reaction === null && inp.raw > 0.3) {
          race.reaction = t;
          if (t < 0.9) {
            if (t < 0.35 || race.crouched) pop(race.crouched ? "BLOCK START!" : "GREAT START!", "#7dff9a", 0.3);
            if (race.crouched) r.v += 1.2;
          }
        }
        const target = ev.vmax * speedCurve(inp.run);
        if (r.air < 0 && r.fin === null) r.v += (target - r.v) * (target > r.v ? 0.95 : 1.8) * dt;
      } else if (r.fin === null && t > r.react && r.air < 0) r.v += (r.vT - r.v) * 0.95 * dt;
      if (r.fin !== null) r.v *= Math.exp(-dt * 1.3);
      const ox = r.x;
      r.x += r.v * dt;
      if (ev.hurdles) {
        if (r.air >= 0) {
          r.air += dt;
          if (r.air >= r.airDur) r.air = -1;
        }
        if (r.k && r.air < 0 && r.hNext < 10) {
          const dn = HURDLE_X[r.hNext] - r.x;
          if (dn < r.v * 0.25 && dn > 0) {
            r.air = 0;
            r.airDur = 0.5;
          }
        }
        const hx = HURDLE_X[r.hNext];
        if (hx !== void 0 && ox < hx && r.x >= hx) {
          const k = r.air >= 0 ? r.air / r.airDur : -1;
          let clear = k > 0.06 && k < 0.94;
          if (r.k && Math.random() < 0.05 + (0.95 - ATH[r.k] && ev.rival[r.k - 1] ? (0.95 - ev.rival[r.k - 1]) * 0.35 : 0)) clear = false;
          const hg = hurdleGroups[r.k][r.hNext];
          if (clear) {
            if (r.k === 0) {
              G.streak++;
              G.knockRow = 0;
              const perfect = k > 0.3 && k < 0.7;
              pop(perfect ? "PERFECT! x".concat(G.streak) : "CLEAR! x".concat(G.streak), perfect ? "#7dff9a" : "#ffffff");
              exciteT = Math.min(1, exciteT + 0.08);
              if (perfect) {
                burst3(race.start + hx, 1, laneZ(ATH[0].lane), 14, 8257434, 1.5, 2);
              }
              hg.userData.board.material.emissiveIntensity = 0;
            }
          } else {
            r.v *= r.k ? 0.72 : 0.55;
            r.knocks++;
            hg.userData.fall = 1e-3;
            if (r.k === 0) {
              G.streak = 0;
              G.knockRow++;
              if (G.knockRow >= 2) G.forgive = Math.min(1.35, G.forgive + 0.1);
              pop("KNOCKED IT!", "#ff7a5a");
              SFX.clunk();
              flash = 0.4;
            }
          }
          r.hNext++;
        }
      }
      let reach = 0;
      if (r.k === 0 && race.dip > 0) {
        race.dip += dt;
        reach = 0.35 * Math.sin(Math.min(1, race.dip / 0.4) * Math.PI * 0.5);
      }
      if (r.fin === null && r.x + reach >= ev.dist) {
        r.fin = t - (r.x + reach - ev.dist) / Math.max(0.5, r.v);
        if (!race.tapeBroken) {
          race.tapeBroken = true;
          burst3(FINISH_X, 1.25, laneZ(ATH[r.k].lane), 40, r.k ? ATH[r.k].col : 4185343, 3, 3);
        }
        if (r.k === 0) {
          const place = race.runners.filter((o) => o.fin !== null).length;
          say("".concat(r.fin.toFixed(2), " s"), ["1ST PLACE!", "2ND PLACE", "3RD PLACE", "4TH PLACE"][place - 1] + (r.fin < ev.wr ? " · WORLD RECORD!" : ""), place === 1 ? "#ffd34d" : "#ffffff", 2.2);
          exciteT = place === 1 ? 1 : 0.7;
          SFX.roar();
          if (place === 1) confettiBurst(70);
          setState("raceDone");
        }
      }
      r.ph += dt * (r.v > 0.3 ? 4.5 + r.v * 1.05 : 0);
      if (r.k === 0) {
        const st = Math.floor(r.ph / Math.PI);
        if (st !== r.lastStep && r.air < 0) {
          r.lastStep = st;
          if (r.v > 0.5) SFX.step(r.v);
        }
      }
    }
    const rivalsDone = race.runners.every((r) => r.k === 0 || r.fin !== null), lastRival = Math.max(...race.runners.filter((r) => r.k).map((r) => r.fin || 0));
    if (s === "run" && rivalsDone && me.fin === null && t > lastRival + 2.5 && me.v > 2.5) {
      me.fin = t + (ev.dist - me.x) / me.v;
      const place = race.runners.filter((o) => o.fin !== null && o.fin < me.fin).length + 1;
      say("".concat(me.fin.toFixed(2), " s"), ["1ST PLACE!", "2ND PLACE", "3RD PLACE", "4TH PLACE"][place - 1], "#ffffff", 2.2);
      SFX.roar();
      setState("raceDone");
    }
    if (s === "run" && rivalsDone && me.fin === null && t > lastRival + 6) {
      say("DNF", "keep running next time!", "#ff7a5a", 1.6);
      setState("raceDone");
    }
    if (s === "run" && t > 45) setState("raceDone");
    if (G.state === "raceDone" && sinceS() > 2.8) {
      race.runners.forEach((r) => {
        if (r.fin === null && r.k) r.fin = t + (ev.dist - r.x) / Math.max(1, r.v);
      });
      const rows = race.runners.map((r) => ({ k: r.k, val: r.fin === null ? Infinity : r.fin })).sort((a, b) => a.val - b.val);
      rows.forEach((r) => r.disp = isFinite(r.val) ? r.val.toFixed(2) + " s" : "DNF");
      finishEvent(rows);
    }
  }
  function updateField(dt) {
    var _a, _b;
    const f = field, ev = f.ev, s = G.state;
    if (s === "fieldReady") {
      if (sinceS() > 1.5) {
        setState("approach");
        say("GO!", ev.id === "long" ? "run, then JUMP at the board" : "run, then swing your right or left arm UP", "#7dff9a", 1.2);
        SFX.beep(880);
        exciteT = 0.55;
      }
      return;
    }
    if (s === "approach") {
      f.t += dt;
      const target = ev.vmax * speedCurve(inp.run);
      f.v += (target - f.v) * (target > f.v ? 1 : 1.8) * dt;
      f.x += f.v * dt;
      f.ph += dt * (f.v > 0.3 ? 4.5 + f.v * 1.05 : 0);
      const st = Math.floor(f.ph / Math.PI);
      if (st !== f.lastStep) {
        f.lastStep = st;
        if (f.v > 0.5) SFX.step(f.v);
      }
      if (f.v < 0.6) f.idle += dt;
      else f.idle = 0;
      if (ev.id === "long") {
        if (ev.origin + f.x > LJ_BOARD + 0.6) foulAttempt("FOUL!", "jump BEFORE the board");
      } else {
        const lx = JV_LINE - (ev.origin + f.x);
        if (!f.whip && !BP.mouse && lx < 14) {
          let pick = null;
          for (const sd of ["right", "left"]) {
            const h = BP.hands[sd];
            f.ck[sd] = h.seen && h.y < 0.36 ? f.ck[sd] + dt : 0;
            if (f.ck[sd] > 0.12 && (!pick || f.ck[sd] > f.ck[pick])) pick = sd;
          }
          f.cockT = Math.max(f.ck.right, f.ck.left);
          if (pick && pick !== f.jh && (!f.jh || f.ck[f.jh] === 0)) {
            f.jh = pick;
            f.cockY = null;
          }
        }
        const R = BP.hands[f.jh || "right"];
        if (!BP.mouse && R.seen && lx < 14) {
          if (f.jh) f.cocked = true;
          if (f.cocked && !f.whip && lx < 12 && (R.push > 1.2 || R.vy > 1.3)) f.whip = { t: 0, pk: 0, y0: Math.min((_a = f.cockY) != null ? _a : R.y, R.y) };
          if (f.cocked && !f.whip) f.cockY = Math.min((_b = f.cockY) != null ? _b : 1, R.y);
          if (f.whip) {
            const w = f.whip;
            w.t += dt;
            w.pk = Math.max(w.pk, R.speed + Math.max(0, R.push || 0) * 0.6);
            if (w.t > 0.16 || w.t > 0.05 && R.speed < w.pk * 0.55) throwJav("throw");
          }
        }
        if (G.state === "approach" && ev.origin + f.x > JV_LINE - 0.05 && f.whip) throwJav("throw");
        if (G.state === "approach" && ev.origin + f.x > JV_LINE + 0.1) foulAttempt("FOUL!", "throw BEFORE the line");
      }
      if (G.state === "approach" && (f.idle > 7 || f.t > 22)) foulAttempt("NO ATTEMPT", "run in place to build speed");
      return;
    }
    if (s === "flight") {
      if (ev.id === "long") {
        const a = f.air;
        a.t += dt / 1.35;
        const k = Math.min(1, a.t / a.T);
        f.x = a.x0 + a.D * k;
        f.h = a.peak * Math.sin(k * Math.PI);
        if (k >= 1) {
          f.h = 0;
          f.mark = +(a.D - a.lost).toFixed(2);
          f.marks.push(f.mark);
          const lx = LJ_BOARD + f.mark;
          landMark.position.set(lx - 0.25, 0.04, FIELD_Z);
          landMark.visible = true;
          burst3(lx, 0.1, FIELD_Z, 70, 14730378, 2.2, 2.6);
          SFX.thud();
          const beat = f.rival.filter((m) => f.mark > m).length;
          say("".concat(f.mark.toFixed(2), " m"), f.mark > ev.wr ? "WORLD RECORD!" : beat === 3 ? "LEADING THE FIELD!" : beat ? "beats ".concat(beat, " rival").concat(beat > 1 ? "s" : "") : "keep going!", beat === 3 ? "#ffd34d" : "#ffffff", 2.2);
          exciteT = 0.5 + beat * 0.17;
          if (beat === 3) SFX.roar();
          flag(lx, FIELD_Z + 1.7, 4185343, "YOU ".concat(f.mark.toFixed(2)), 0.7);
          setState("landed");
        }
      } else {
        const j = f.javP, dts = dt * 1.5;
        f.throwT += dt;
        f.v *= Math.exp(-dt * 3);
        f.x = Math.min(f.x + f.v * dt, JV_LINE - ev.origin - 0.3);
        if (j.vy !== null) {
          j.vy -= 9.81 * dts;
          j.x += j.vx * dts;
          j.y += j.vy * dts;
          j.trail.push([j.x, j.y]);
          if (j.trail.length > 40) j.trail.shift();
          if (j.y <= 0.05) {
            j.y = 0.05;
            j.vy = null;
            f.mark = +(j.x - JV_LINE).toFixed(2);
            f.marks.push(f.mark);
            burst3(j.x + 1.2, 0.05, FIELD_Z, 40, 10123850, 1.5, 2);
            SFX.thud();
            const beat = f.rival.filter((m) => f.mark > m).length;
            say("".concat(f.mark.toFixed(2), " m"), f.mark > ev.wr ? "WORLD RECORD!" : beat === 3 ? "LEADING THE FIELD!" : beat ? "beats ".concat(beat, " rival").concat(beat > 1 ? "s" : "") : "swing faster for more!", beat === 3 ? "#ffd34d" : "#ffffff", 2.2);
            exciteT = 0.5 + beat * 0.17;
            if (beat === 3) SFX.roar();
            flag(j.x, FIELD_Z - 1.4, 4185343, "YOU ".concat(f.mark.toFixed(2)), 1.4);
            setState("landed");
          }
        }
      }
      return;
    }
    if (s === "landed") {
      if (ev.id === "jav") {
        f.v *= Math.exp(-dt * 3);
      }
      if (sinceS() > 2.6) {
        f.attempt++;
        if (f.attempt < 2) {
          resetAttempt();
          setState("fieldReady");
        } else {
          const best = f.marks.reduce((m, v) => v !== null && v > m ? v : m, -1);
          const rows = [{ k: 0, val: best >= 0 ? best : null }, ...f.rival.map((m, i) => ({ k: i + 1, val: m }))].sort((a, b) => {
            var _a2, _b2;
            return ((_a2 = b.val) != null ? _a2 : -1) - ((_b2 = a.val) != null ? _b2 : -1);
          });
          rows.forEach((r) => r.disp = r.val !== null ? r.val.toFixed(2) + " m" : "FOUL");
          finishEvent(rows);
        }
      }
    }
  }
  const tmpV = new Vector3();
  function placeFigures(t, dt) {
    const ev = EVENTS[G.ev], s = G.state, inMeet = !["title", "medals"].includes(s);
    const fieldEv = inMeet && ev.kind === "field";
    const celebrate = (s === "results" || s === "medals") && G.celebrating;
    for (let k = 0; k < 4; k++) {
      const f = figs[k], a = ATH[k];
      f.root.visible = true;
      f.root.rotation.y = 0;
      let p, x, z = laneZ(a.lane), h = 0;
      if (!inMeet || s === "intro" && ev.kind === "race" || !race && !fieldEv) {
        x = (s === "medals" ? FINISH_X + 3 : race ? race.start : FINISH_X - EVENTS[G.ev].dist) - 1.2 - (k ? 0 : 0);
        if (s === "medals") {
          x = FINISH_X + 6 + [0, -1.2, 1.2, 2.4][k] * 0;
          z = [0.6, -0.6, 1.8, 3][k];
        }
        p = standPose(t + k, celebrate && k === 0 ? 1 : 0);
        if (k === 0 && !celebrate) mirrorArms(p);
        if (k && s === "medals") {
          f.root.rotation.y = 0;
        }
      } else if (race) {
        const r = race.runners[k];
        x = race.start + r.x;
        if (s === "marks" || s === "false" || s === "intro") p = POSE.marks();
        else if (s === "set") p = POSE.set();
        else if (ev.hurdles && r.air >= 0) {
          const q = r.air / r.airDur;
          p = POSE.hurdle(q);
          h = 0.55 * Math.sin(q * Math.PI);
        } else if (r.v < 0.3) p = standPose(t + k);
        else p = runPose(r.ph, clamp(r.v / 11));
        if (k === 0 && (s === "run" || s === "raceDone") && r.air < 0) mirrorArms(p, 0.75);
        if (k === 0 && s === "marks" && BP.body.crouch < 0.2 && BP.live) p = standPose(t);
        if (k === 0 && race.dip > 0 && race.dip < 1.2) p.lean += 0.75 * Math.sin(Math.min(1, race.dip / 0.4) * Math.PI * 0.5);
      } else {
        const fl = field;
        if (k === 0) {
          x = ev.origin + fl.x;
          z = FIELD_Z;
          if (s === "flight" && ev.id === "long") {
            p = POSE.ljAir(clamp(fl.air.t / fl.air.T));
            h = fl.h;
          } else if (s === "landed" && ev.id === "long" && !fl.foul) p = POSE.sit();
          else if (fl.v > 0.3) p = runPose(fl.ph, clamp(fl.v / 11));
          else p = standPose(t);
          if (ev.id === "jav") {
            if (!fl.thrown) {
              p.arms[1] = [-2.5, -2.75];
            } else {
              const q = clamp(fl.throwT / 0.35);
              const ang = lerp(-2.5, -5, ease(q));
              p.arms[1] = [ang, ang - 0.2];
            }
            if (!fl.thrown) mirrorArms(p, 0.6), p.arms[1] = [-2.5, -2.75];
          } else if (s === "approach") mirrorArms(p, 0.75);
        } else {
          const base = ev.id === "long" ? LJ_BOARD : JV_LINE;
          x = base - 2 + k * 1.3;
          z = FIELD_Z - 2.6;
          f.root.rotation.y = -Math.PI / 2 + 0.4;
          const cheer = s === "landed" && fl.mark !== null && fl.mark > fl.rival[k - 1] - 0.3 ? 1 : 0;
          p = standPose(t * (1 + k * 0.1) + k, cheer);
        }
      }
      applyPose(f, p);
      const npc = athNpc[k];
      if (npc) {
        if (!npc.root.parent) {
          f.root.add(npc.root);
          npc.root.rotation.y = Math.PI / 2;
        }
        if (npc.ready) {
          f.pelvis.visible = false;
          npc.set(anglesOf(p));
        }
      }
      f.label.visible = k === 0 ? s !== "medals" : race && ["run", "raceDone"].includes(s);
      f.root.position.set(x, h, z);
      if (k === 0) {
        youG.position.set(x, h, z);
        youG.updateMatrixWorld(true);
        if (FLAT || !youFig.real) {
          youCam.copy(camera.position);
          youG.worldToLocal(youCam);
        }
        youFig.enabled = s !== "medals";
        youFig.update(performance.now());
        f.pelvis.visible = youFig.opacity < 0.3 && (!youFig.real || BP.mouse);
      }
      f.blob.position.y = 8e-3 - h;
      f.blob.material.opacity = 0.45 * (1 - clamp(h));
      if (f.root.userData.ring) {
        f.root.userData.ring.position.y = 0.012 - h;
        f.root.userData.ring.material.opacity = 0.55 + 0.3 * Math.sin(t * 5);
      }
    }
    podium.visible = s === "medals";
    if (s === "medals") {
      const tbl = medalTable();
      tbl.forEach((row, i) => {
        const f = figs[row.k];
        f.root.position.set(FINISH_X + 8 + [0, -1.4, 1.4, 2.6][i], [0.6, 0.4, 0.25, 0][i], 2.4 + (i === 3 ? 0.5 : 0));
        f.root.rotation.y = -1.25;
      });
    }
    if (race && race.ev.hurdles) hurdleGroups.forEach((l, k) => l.forEach((hg, i) => {
      if (hg.userData.fall > 0) {
        hg.userData.fall = Math.min(1, hg.userData.fall + dt * 3.5);
        hg.rotation.z = -1.45 * ease(hg.userData.fall);
      }
      if (k === 0) {
        const r = race.runners[0], dn = HURDLE_X[i] - r.x, tt = dn / Math.max(1, r.v), glow = i === r.hNext && G.state === "run" && tt > 0 && tt < 0.55 ? 1 : 0;
        hg.userData.board.material.emissiveIntensity = glow ? 0.8 + 0.5 * Math.sin(t * 25) : 0;
        hg.userData.board.material.emissive.setHex(8257434);
      }
    }));
    if (race && race.tapeBroken && tape.visible) {
      tape.scale.z = Math.max(0.01, tape.scale.z - dt * 4);
      if (tape.scale.z <= 0.02) tape.visible = false;
    }
    if (race && (G.state === "run" || G.state === "raceDone")) {
      const k = 0.95, tt = race.clock, x = race.wrV * (tt - (1 - Math.exp(-k * tt)) / k);
      wrGhost.visible = x < race.ev.dist + 0.1;
      wrGhost.position.set(race.start + Math.min(x, race.ev.dist), 0, 0);
    } else wrGhost.visible = false;
    if (field && field.ev.id === "jav" && jav.visible) {
      const fl = field;
      if (!fl.thrown || fl.javP && fl.throwT < 0.02) {
        figs[0].hands[1].getWorldPosition(tmpV);
        jav.position.copy(tmpV);
        jav.rotation.set(0, 0, 0.55);
      } else if (fl.javP) {
        const j = fl.javP;
        jav.position.set(j.x, j.y, FIELD_Z - 0.25);
        if (j.vy !== null) jav.rotation.set(0, 0, Math.atan2(j.vy, j.vx));
        else jav.rotation.z = Math.min(jav.rotation.z, -0.55) + 0.02 * Math.sin(t * 40) * Math.max(0, 1 - sinceS());
      }
    }
  }
  function updateCamera(t, dt) {
    const s = G.state, ev = EVENTS[G.ev];
    let px, pz, py = 2.15, dist = 10.6, ahead = 3, ly = 1.05, lz;
    if (s === "title") {
      px = -2 + Math.sin(t * 0.15) * 3;
      pz = 9.5;
      py = 2;
      ahead = 2;
      lz = 1.2;
      px += 0;
    } else if (s === "medals") {
      px = FINISH_X + 8 - 2.4;
      pz = 2.4 + 7.8;
      py = 1.7;
      ahead = 0;
      lz = 2.4;
      ly = 1.25;
    } else if (race) {
      const r = race.runners[0];
      px = race.start + r.x + 1;
      lz = 1;
      pz = lz + dist;
      if (s === "intro" || s === "marks" || s === "set" || s === "false") {
        px = race.start + 1.5 - (s === "set" ? 0.4 : 0);
        pz = lz + 10.5;
        py = 2.2;
        ahead = 1.8;
      }
      if (s === "results") {
        px = FINISH_X + 2;
        ahead = 2;
      }
      if (race.photo && s === "raceDone" && sinceS() < 1.5) {
        pz = lz + 9;
      }
    } else if (field) {
      const fl = field;
      lz = FIELD_Z;
      pz = FIELD_Z + 11.5;
      px = ev.origin + (fl.x || 0) + 1;
      if (s === "intro") {
        px = (ev.id === "long" ? LJ_BOARD : JV_LINE) - 4;
        ahead = 4;
        py = 3.5;
      }
      if (ev.id === "long" && (s === "flight" || s === "landed")) {
        px = ev.origin + fl.x - 2.5;
        pz = FIELD_Z + 10.5;
        ahead = 2.5;
        py = 2.3;
        ly = 0.8;
      }
      if (ev.id === "jav" && (s === "flight" || s === "landed") && fl.javP) {
        const j = fl.javP;
        px = j.x - 5;
        py = j.y + 2.2;
        pz = FIELD_Z + 19;
        ahead = 6;
        ly = j.y + 0.3;
      }
      if (s === "results") {
        px = ev.id === "long" ? LJ_BOARD + 4 : JV_LINE + 40;
        pz = FIELD_Z + (ev.id === "long" ? 11 : 30);
        ahead = 0;
        py = ev.id === "long" ? 3.5 : 8;
      }
    } else {
      px = 0;
      pz = 14;
      lz = 1;
    }
    const k = cam.init ? 1 - Math.exp(-dt * (s === "flight" ? 7 : 4)) : 1;
    cam.init = true;
    cam.x = lerp(cam.x, px, k);
    cam.y = lerp(cam.y, py, k);
    cam.z = lerp(cam.z, pz, k);
    cam.lx = lerp(cam.lx, px + ahead, k);
    cam.ly = lerp(cam.ly, ly, k);
    cam.lz = lerp(cam.lz, lz, k);
    const shake = flash * 0.06;
    camera.position.set(cam.x + rand(-shake, shake), cam.y + rand(-shake, shake), cam.z);
    camera.lookAt(cam.lx, cam.ly, cam.lz);
    key.position.set(cam.x - 14, 30, cam.lz + 22);
    key.target.position.set(cam.lx, 0, cam.lz);
    key.target.updateMatrixWorld();
  }
  function button(id, x, y, w, h, label, act, { primary = false, col = "#3fdcff", ms = 700, size = 0.045 } = {}) {
    const over = BP.handOver({ x, y, w, h }, W, H);
    const f = BP.dwell(id, over, NOW, ms);
    buttons.push({ id, x, y, w, h, act, primary });
    const r = h * 0.3;
    ctx.save();
    ctx.shadowColor = col;
    ctx.shadowBlur = over ? U * 0.04 : U * 0.015;
    panel(x, y, w, h, r, "rgba(10,16,40,0.85)", col);
    ctx.shadowBlur = 0;
    if (f > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.clip();
      const g = ctx.createLinearGradient(x, 0, x + w, 0);
      g.addColorStop(0, col);
      g.addColorStop(1, "#ffffff");
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = g;
      ctx.fillRect(x, y, w * f, h);
      ctx.restore();
    }
    ctx.lineWidth = U * 5e-3;
    ctx.strokeStyle = col;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.stroke();
    text(label, x + w / 2, y + h / 2 + U * 3e-3, U * size, "#ffffff", "center", 900, U * 0.01);
    ctx.restore();
    if (f === 1) {
      act();
      SFX.tick();
    }
  }
  function drawTitle(t) {
    if (0) {
      const g = ctx.createLinearGradient(0, H * 0.1, 0, H * 0.27);
      g.addColorStop(0, "#fff6c8");
      g.addColorStop(0.5, "#ffd34d");
      g.addColorStop(1, "#ff8a1f");
      ctx.font = font(U * 0.14, 900);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "#ff9a2a";
      ctx.shadowBlur = U * 0.05;
      ctx.fillStyle = g;
      ctx.fillText("TRACK & FIELD", W / 2, H * 0.17);
      ctx.shadowBlur = 0;
      text("THE BODY MOVIN' GAMES  ·  4 EVENTS  ·  WIN THE MEDALS", W / 2, H * 0.27, U * 0.033, "#bcd0ff", "center", 700);
      const names = [["sprint", "100 M"], ["hurdles", "HURDLES"], ["long", "LONG JUMP"], ["jav", "JAVELIN"]];
      const cw = Math.min(W * 0.19, U * 0.36), ch = U * 0.27, gap = U * 0.025, x0 = W / 2 - (cw * 4 + gap * 3) / 2, y0 = H * 0.33;
      names.forEach(([k, n], i) => {
        const x = x0 + i * (cw + gap);
        panel(x, y0, cw, ch, U * 0.025, "rgba(10,16,44,0.78)", ["#3fdcff", "#7dff9a", "#ffd34d", "#ff6fb1"][i]);
        picto(x + cw / 2 - U * 0.03, y0 + ch * 0.66, U * 0.1, k, t + i * 0.37, ["#3fdcff", "#7dff9a", "#ffd34d", "#ff6fb1"][i]);
        text("".concat(i + 1, "  ").concat(n), x + cw / 2, y0 + ch * 0.86, U * 0.032, "#ffffff", "center", 900);
      });
      text("Run in place  ·  JUMP the hurdles  ·  JUMP at the board  ·  THROW overhand", W / 2, H * 0.67, U * 0.031, "#ffffff", "center", 700);
      text("your athlete moves with YOU: its feet land with your steps, its arms copy yours", W / 2, H * 0.715, U * 0.026, "#7fe8ff", "center", 600);
    }
    const bw = U * 0.46, bh = U * 0.105;
    button("start", W / 2 - bw / 2, H * 0.745, bw, bh, "START", startMeet, { primary: true, col: "#ffd34d", size: 0.05 });
    if (TV && sinceS() > 2 && !G.tvStarted) {
      G.tvStarted = true;
      startMeet();
    }
  }
  const SHORT = { sprint: "100 M", hurdles: "HURDLES", long: "LONG JUMP", jav: "JAVELIN" };
  let topB = 0;
  function drawScoreboard() {
    var _a;
    const ev = EVENTS[G.ev], ph = Math.max(40, U * 0.064), fs = ph * 0.48, pad = ph * 0.45;
    const name = SHORT[ev.id], val = race ? (G.state === "run" || G.state === "raceDone" ? (_a = race.runners[0].fin) != null ? _a : race.clock : 0).toFixed(2) : field ? "TRY ".concat(Math.min(2, field.attempt + 1), " OF 2") : "";
    ctx.font = font(fs * 0.8, 800);
    const nw = ctx.measureText(name).width;
    ctx.font = font(fs, 900);
    const vw = ctx.measureText(val).width, cw = nw + vw + pad * 3;
    const rStr = "".concat(G.total, " PTS");
    ctx.font = font(fs * 0.8, 900);
    const rw = ctx.measureText(rStr).width + pad * 2;
    const L = window.BPUI ? BPUI.top(cw, ph, rw, ph) : { c: { x: (W - cw) / 2, y: 10 }, r: { x: W - rw - 10, y: 10 }, bottom: 10 + ph };
    topB = L.bottom;
    hudR.push({ x: L.c.x, y: L.c.y, w: cw, h: ph }, { x: L.r.x, y: L.r.y, w: rw, h: ph });
    panel(L.c.x, L.c.y, cw, ph, ph / 2, "rgba(10,12,24,0.55)", "rgba(255,255,255,0.18)");
    text(name, L.c.x + pad + nw / 2, L.c.y + ph / 2, fs * 0.8, "#ffd34d", "center", 800);
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.fillRect(L.c.x + pad * 1.5 + nw - 0.5, L.c.y + ph * 0.25, 1, ph * 0.5);
    text(val, L.c.x + pad * 2 + nw + vw / 2, L.c.y + ph / 2, fs, "#ffffff", "center", 900);
    panel(L.r.x, L.r.y, rw, ph, ph / 2, "rgba(10,12,24,0.55)", "rgba(255,255,255,0.18)");
    text(rStr, L.r.x + rw / 2, L.r.y + ph / 2, fs * 0.8, "#ffffff", "center", 900);
  }
  let meterR = null;
  const SRC_COL = { legs: "#3fdcff", feet: "#3fdcff", bounce: "#7dff9a", arms: "#ffd34d" };
  function drawStepMeter() {
    meterR = null;
    if (G.state !== "run" && G.state !== "approach") return;
    const ph = Math.max(34, U * 0.06), fs = ph * 0.44, pad = ph * 0.32;
    ctx.font = font(fs, 900);
    const tw = ctx.measureText("HOP!").width;
    const pw = Math.min(W - U * 0.04, ph * 1 + U * 0.3 + tw + pad * 3);
    const p = window.BPUI ? BPUI.bottom(pw, ph) : { x: (W - pw) / 2, y: H - ph - 12 };
    if (figRect && p.x < figRect.x + figRect.w + 8 && p.y + ph > figRect.y) {
      if (figRect.x + figRect.w + 8 + pw < W - 8) p.x = figRect.x + figRect.w + 8;
      else p.y = figRect.y - 8 - ph;
    }
    meterR = { x: p.x, y: p.y, w: pw, h: ph };
    hudR.push(meterR);
    const hop = NOW - STEP.hopAt < 650, age = (NOW - STEP.at) / 1e3, pulse = clamp(1 - age / 0.3), col = SRC_COL[STEP.src] || "#9fb0d8";
    panel(p.x, p.y, pw, ph, ph / 2, "rgba(10,12,24,0.62)", hop ? "#7dff9a" : "rgba(255,255,255,0.18)");
    const dx = p.x + pad + ph * 0.3, dy = p.y + ph / 2, live = age < 1.2;
    ctx.save();
    ctx.globalAlpha = live ? 1 : 0.35;
    if (pulse > 0) {
      ctx.globalAlpha = 0.45 * pulse;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(dx, dy, ph * (0.2 + 0.2 * (1 - pulse)), 0, 7);
      ctx.fill();
      ctx.globalAlpha = live ? 1 : 0.35;
    }
    ctx.fillStyle = live ? col : "#9fb0d8";
    ctx.beginPath();
    ctx.arc(dx, dy, ph * (0.13 + 0.07 * pulse), 0, 7);
    ctx.fill();
    ctx.restore();
    const bx = dx + ph * 0.5, bw = Math.max(20, p.x + pw - pad * 2 - tw - bx), bh = ph * 0.24, by = dy - bh / 2;
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, bh / 2);
    ctx.fill();
    const g = ctx.createLinearGradient(bx, 0, bx + bw, 0);
    g.addColorStop(0, "#3fdcff");
    g.addColorStop(1, "#7dff9a");
    if (inp.run > 0.01) {
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.roundRect(bx, by, Math.max(bh, bw * clamp(inp.run)), bh, bh / 2);
      ctx.fill();
    }
    if (race) {
      const f = race.ev.rival[1] * diffMul(), r = 1 - Math.pow(Math.max(0, 1 - f), 1 / 1.6);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(bx + bw * clamp(r) - 1.5, by - bh * 0.7, 3, bh * 2.4);
    }
    if (hop) text("HOP!", p.x + pw - pad, dy, fs, "#7dff9a", "right", 900);
  }
  function bottomPrompt(s, col = "#ffffff") {
    let fs = Math.max(15, U * 0.032);
    ctx.font = font(fs, 900);
    const maxW = W - U * 0.04, need = ctx.measureText(s).width + fs * 2.4;
    if (need > maxW) {
      fs *= maxW / need;
      ctx.font = font(fs, 900);
    }
    const pw = Math.min(maxW, ctx.measureText(s).width + fs * 2.4), ph = Math.max(15, U * 0.032) * 2.4;
    const p = window.BPUI ? BPUI.bottom(pw, ph) : { x: (W - pw) / 2, y: H - ph - 12 };
    if (meterR && p.y + ph > meterR.y - 6 && p.x < meterR.x + meterR.w && p.x + pw > meterR.x) p.y = meterR.y - 8 - ph;
    if (figRect && p.x < figRect.x + figRect.w + 8 && p.y + ph > figRect.y) p.y = figRect.y - 8 - ph;
    hudR.push({ x: p.x, y: p.y, w: pw, h: ph });
    panel(p.x, p.y, pw, ph, ph / 2, "rgba(10,12,24,0.55)", "rgba(255,255,255,0.18)");
    text(s, W / 2, p.y + ph / 2, fs, col, "center", 900);
  }
  function drawLabels() {
    const taken = [];
    if (msgR) taken.push([msgR.x - 8, msgR.y - 8, msgR.w + 16, msgR.h + 16]);
    taken.push([0, 0, W, topB + 8]);
    if (BP.tips && BP.tips.active) for (const q of BP.tips.active()) taken.push([q.rect.left - 6, q.rect.top - 6, q.rect.width + 12, q.rect.height + 12]);
    if (window.BPUI) {
      const c = BPUI.camZone();
      taken.push([c.left - 8, c.top - 8, c.width + 16, c.height + 16]);
    }
    if (figRect) taken.push([figRect.x, figRect.y, figRect.w, figRect.h]);
    if (meterR) taken.push([meterR.x - 6, meterR.y - 6, meterR.w + 12, meterR.h + 12]);
    const order = hudLabels.slice().sort((a, b) => (b.userData.hud.bg ? 1 : 0) - (a.userData.hud.bg ? 1 : 0));
    for (const o of order) {
      let p = o, vis = true;
      while (p) {
        if (!p.visible) {
          vis = false;
          break;
        }
        if (p === scene) break;
        p = p.parent;
      }
      if (!vis || p !== scene) continue;
      o.getWorldPosition(tmpV);
      const d = tmpV.distanceTo(camera.position);
      tmpV.project(camera);
      if (tmpV.z > 1 || Math.abs(tmpV.x) > 1.05 || Math.abs(tmpV.y) > 1.05) continue;
      const L = o.userData.hud, sx = (tmpV.x * 0.5 + 0.5) * W, sy = (-tmpV.y * 0.5 + 0.5) * H;
      if (sy < U * 0.2 && Math.abs(sx - W / 2) < U * 0.42) continue;
      const px = clamp(L.size * H / (2 * Math.tan(camera.fov * Math.PI / 360) * d), U * 0.02, U * 0.05);
      ctx.font = font(px, 900);
      const tw = ctx.measureText(L.text).width;
      const box = [sx - tw / 2 - px * 0.5, sy - px * 0.72, tw + px, px * 1.44];
      if (taken.some((r) => box[0] < r[0] + r[2] && box[0] + box[2] > r[0] && box[1] < r[1] + r[3] && box[1] + box[3] > r[1])) continue;
      taken.push(box);
      if (L.bg) panel(sx - tw / 2 - px * 0.5, sy - px * 0.72, tw + px, px * 1.44, px * 0.72, "rgba(6,12,30,0.62)", L.color);
      ctx.lineWidth = px * 0.18;
      ctx.strokeStyle = "rgba(0,0,0,0.6)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.strokeText(L.text, sx, sy);
      text(L.text, sx, sy, px, L.color, "center", 900);
    }
  }
  function drawPrompts(t) {
    const s = G.state;
    const at = (x, y, z) => {
      tmpV.set(x, y, z).project(camera);
      return [(tmpV.x * 0.5 + 0.5) * W, (-tmpV.y * 0.5 + 0.5) * H];
    };
    if (field && field.javP && field.javP.trail.length > 1 && (s === "flight" || s === "landed")) {
      const tr = field.javP.trail;
      ctx.save();
      ctx.lineCap = "round";
      for (let i = 1; i < tr.length; i++) {
        const [ax, ay] = at(tr[i - 1][0], tr[i - 1][1], FIELD_Z - 0.25), [bx, by] = at(tr[i][0], tr[i][1], FIELD_Z - 0.25);
        ctx.strokeStyle = "rgba(120,230,255,".concat(0.6 * i / tr.length, ")");
        ctx.lineWidth = U * 8e-3 * i / tr.length;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }
      if (s === "flight") {
        const j = field.javP, [jx, jy] = at(j.x + Math.cos(jav.rotation.z) * 1.3, j.y + Math.sin(jav.rotation.z) * 1.3, FIELD_Z - 0.25);
        ctx.strokeStyle = "rgba(255,255,255,0.8)";
        ctx.lineWidth = U * 4e-3;
        ctx.beginPath();
        ctx.arc(jx, jy, U * 0.025, 0, 7);
        ctx.stroke();
        text("".concat(Math.max(0, j.x - JV_LINE).toFixed(0), " m"), jx, jy - U * 0.06, U * 0.055, "#ffffff", "center", 900, U * 0.02);
      }
      ctx.restore();
    }
    if (race && race.ev.hurdles && s === "run") {
      const r = race.runners[0], i = r.hNext, dn = HURDLE_X[i] - r.x, tt = dn / Math.max(1, r.v);
      if (i < 10 && tt > 0 && tt < 0.55 && r.air < 0) {
        const [sx, sy] = at(race.start + HURDLE_X[i], 1.6, laneZ(ATH[0].lane));
        text("JUMP!", sx, sy, U * (0.06 + 0.01 * Math.sin(t * 30)), "#7dff9a", "center", 900, U * 0.03);
        hudR.push({ x: sx - U * 0.12, y: sy - U * 0.05, w: U * 0.24, h: U * 0.1 });
      }
    }
    let line = "", lc = "#ffffff";
    if (race && !race.ev.hurdles && s === "run") {
      const r = race.runners[0];
      if (race.ev.dist - r.x < 4 && race.ev.dist - r.x > 0 && !race.dipped) {
        line = "Punch toward the screen to lean!";
        lc = "#ffd34d";
      }
    }
    if (field && s === "approach") {
      const ev = field.ev;
      if (ev.id === "long") {
        const d = LJ_BOARD - (ev.origin + field.x);
        if (d < 5 && d > -0.6) {
          const [sx, sy] = at(LJ_BOARD, 0.6, FIELD_Z);
          hudR.push({ x: sx - U * 0.16, y: sy - U * 0.11, w: U * 0.32, h: U * 0.12 });
          text(d < 2.2 ? "JUMP!" : "GET READY", sx, sy - U * 0.05, U * (d < 2.2 ? 0.075 : 0.045), d < 2.2 ? "#7dff9a" : "#ffffff", "center", 900, U * 0.03);
        }
      } else {
        const d = JV_LINE - (ev.origin + field.x);
        if (d < 14) {
          line = !field.cocked ? "Right or left hand back, by your head" : d < 12 ? "THROW!" : "Hold it…";
          lc = field.cocked && d < 12 ? "#7dff9a" : "#ffffff";
        }
      }
    }
    if (!line && msg && msg.sub && (NOW - msg.t0) / 1e3 < msg.dur) line = msg.sub, lc = "#ffffff";
    const running = s === "run" || s === "approach";
    if (!line && running && NOW - STEP.at > 1e3 && inp.run < 0.35 && !msg) line = "Run in place: quick small steps", lc = "#ffd34d";
    if (line) bottomPrompt(line, lc);
  }
  function drawIntro(t) {
    const ev = EVENTS[G.ev], a = clamp(sinceS() / 0.35);
    const w = Math.min(W * 0.8, U * 1.3), h = U * 0.62, x = W / 2 - w / 2, y = H / 2 - h / 2 + (1 - ease(a)) * U * 0.1;
    ctx.globalAlpha = a;
    panel(x, y, w, h, U * 0.03, "rgba(8,12,34,0.9)", "#ffd34d");
    text("EVENT ".concat(G.ev + 1, " OF 4"), W / 2, y + h * 0.12, U * 0.032, "#9fb0d8", "center", 800);
    const g = ctx.createLinearGradient(0, y + h * 0.18, 0, y + h * 0.34);
    g.addColorStop(0, "#fff");
    g.addColorStop(1, "#ffd34d");
    ctx.font = font(U * 0.095, 900);
    ctx.textAlign = "center";
    ctx.fillStyle = g;
    ctx.shadowColor = "#ffb020";
    ctx.shadowBlur = U * 0.03;
    ctx.fillText(ev.name, W / 2, y + h * 0.27);
    ctx.shadowBlur = 0;
    const ps = h * 0.42, px = x + w * 0.2, pby = y + h * 0.86;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(px - ps * 0.42, pby - ps * 1.04, ps * 0.84, ps * 1.1, U * 0.02);
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fill();
    ctx.restore();
    drawStance(px, pby - ps * 0.03, ps * 0.92, STANCE[ev.id].pic, t);
    const tx = px + ps * 0.55, tw = x + w - w * 0.05 - tx, fit = (str, px0, wt) => {
      ctx.font = font(px0, wt);
      const m = ctx.measureText(str).width;
      return m > tw ? px0 * tw / m : px0;
    };
    const lines = STANCE[ev.id].lines;
    lines.forEach((ln, i) => {
      const fs = fit(ln, U * (i ? 0.036 : 0.04), i ? 800 : 900);
      text(ln, tx, y + h * (0.5 + i * 0.13), fs, i ? "#ffffff" : "#ffd34d", "left", i ? 800 : 900);
    });
    ctx.globalAlpha = 1;
    const dur = 5.2;
    ctx.fillStyle = "#ffd34d";
    ctx.fillRect(x + w * 0.1, y + h - U * 0.02, w * 0.8 * clamp(sinceS() / dur), U * 6e-3);
    if (sinceS() > dur) advanceIntro();
  }
  function drawResults(t) {
    const R = G.results[G.results.length - 1];
    if (!R) return;
    const a = clamp(sinceS() / 0.4);
    const w = Math.min(W * 0.78, U * 1.25), h = U * 0.8, x = W / 2 - w / 2, y = H / 2 - h / 2 - U * 0.02;
    ctx.globalAlpha = a;
    panel(x, y, w, h, U * 0.03, "rgba(8,12,34,0.9)", "#ffd34d");
    text("".concat(R.ev.name, "  ·  RESULTS"), W / 2, y + h * 0.09, U * 0.045, "#ffd34d", "center", 900);
    const rh = h * 0.115;
    R.rows.forEach((r, i) => {
      const ry = y + h * 0.19 + i * rh * 1.08, me2 = r.k === 0, ap = clamp((sinceS() - 0.3 - i * 0.18) / 0.3);
      ctx.globalAlpha = a * ap;
      panel(x + w * 0.05 + (1 - ap) * U * 0.05, ry, w * 0.9, rh, U * 0.015, me2 ? "rgba(63,220,255,0.18)" : "rgba(255,255,255,0.05)", me2 ? "#3fdcff" : null);
      const cy = ry + rh / 2;
      if (r.medal !== void 0) coin(x + w * 0.11, cy, rh * 0.36, r.medal, i + 1);
      else text(String(i + 1), x + w * 0.11, cy, U * 0.04, "#9fb0d8", "center", 900);
      ctx.fillStyle = ATH[r.k].css;
      ctx.fillRect(x + w * 0.17, ry + rh * 0.2, U * 8e-3, rh * 0.6);
      text(ATH[r.k].name, x + w * 0.2, cy, U * 0.042, me2 ? "#ffffff" : "#dfe6ff", "left", 900);
      text(r.disp, x + w * 0.9, cy, U * 0.044, me2 ? "#7fe8ff" : "#ffffff", "right", 900);
    });
    ctx.globalAlpha = a;
    const me = R.rows.find((r) => r.k === 0);
    text(me.medal !== void 0 ? "".concat(["GOLD", "SILVER", "BRONZE"][me.medal], " MEDAL!  +").concat(R.pts, " pts") : "+".concat(R.pts, " pts"), W / 2, y + h * 0.725, U * 0.045, me.medal !== void 0 ? MEDAL[me.medal] : "#ffffff", "center", 900, U * 0.02);
    const L = BP.hands.left, Rh = BP.hands.right;
    const armsUp = BP.body.armsUp || (BP.live || BP.mouse) && L.seen && Rh.seen && L.y < 0.3 && Rh.y < 0.3;
    if (me.medal !== void 0 && !G.celebrated && armsUp && sinceS() > 0.8) {
      G.celebrated = true;
      G.celebrating = true;
      G.celebrations = (G.celebrations || 0) + 1;
      G.bonus += 25;
      G.total += 25;
      fireworks(9);
      exciteT = 1;
      SFX.roar();
      confettiBurst(120);
      pop("FIREWORKS FOR YOU!  +25", "#ffd34d", 0.3);
    }
    if (me.medal !== void 0 && !G.celebrated) text("RAISE BOTH ARMS TO CELEBRATE!", W / 2, y + h * 0.79, U * 0.034, Math.sin(NOW / 180) > 0 ? "#ffffff" : "#ffd34d", "center", 900);
    const last2 = G.ev === EVENTS.length - 1, bw = U * 0.42, bh = U * 0.09;
    button("next" + G.ev, W / 2 - bw / 2, y + h * 0.845, bw, bh, last2 ? "SEE THE MEDALS" : "NEXT EVENT", nextAfterResults, { primary: true, col: "#ffd34d" });
    ctx.globalAlpha = 1;
    const auto = 9;
    ctx.fillStyle = "rgba(255,211,77,0.6)";
    ctx.fillRect(x + w * 0.1, y + h - U * 0.012, w * 0.8 * clamp(sinceS() / auto), U * 5e-3);
    if (sinceS() > auto) nextAfterResults();
  }
  function drawMedals(t) {
    const tbl = medalTable(), won = tbl[0].k === 0, m = G.medals[0];
    const wide = W > H * 1.05, cx = wide ? Math.max(W * 0.035, 16) + Math.min(W * 0.36, U * 0.8) / 2 : W / 2;
    {
      const cw = wide ? Math.min(W * 0.36, U * 0.8) : Math.min(W * 0.9, Math.max(U * 0.9, Math.min(U * 0.18, W * 0.16) * 3)), top = H * 0.2 - Math.min(U * 0.05, W * 0.06) - U * 0.03, bot = H * 0.5 + Math.min(U * 0.03, W * 0.035) * 1.6 + U * 0.03;
      panel(cx - cw / 2, top, cw, bot - top, U * 0.03, "rgba(10,12,24,0.62)", "rgba(255,255,255,0.18)");
    }
    text(won ? "YOU WIN THE MEET!" : "YOU FINISHED #".concat(tbl.findIndex((r2) => r2.k === 0) + 1), cx, H * 0.2, Math.min(U * 0.05, wide ? U * 0.034 : W * 0.06), won ? "#ffd34d" : "#ffffff", "center", 900, U * 0.02);
    text(String(G.total), cx, H * 0.37, Math.min(U * 0.18, W * 0.16), "#ffffff", "center", 900, U * 0.03);
    const r = Math.min(U * 0.03, W * 0.035), gap = r * 3.2;
    [m.g, m.s, m.b].forEach((n, i) => coin(cx + (i - 1) * gap, H * 0.5, r, i, n));
    const L = BP.layout.end(W, H, { cy: H * 0.68 }), a = L.again, h = L.home;
    button("again", a.x, a.y, a.w, a.h, "PLAY AGAIN", startMeet, { primary: true, col: "#ffd34d", size: Math.min(0.06, a.w / U / 9) });
    button("home2", h.x, h.y, h.w, h.h, "HOME", () => location.href = "index.html", { col: "#8fa8ff", ms: BP.LEAVE_MS || 1400, size: Math.min(0.045, h.w / U / 6) });
  }
  let hudR = [];
  function liveTips() {
    if (!BP.tip) return;
    const s = G.state, T = (id, txt, hot, ms = 450) => BP.tip(id, txt, ms, { hot });
    if (BP.live && !BP.mouse && BP.legsSeen === false) T("feet", "Step back: keep your feet in the picture", true);
    if (race && (s === "marks" || s === "set" || s === "run" && race.clock < 4) || field && s === "fieldReady") T("face", "Stand: face the TV, not sideways");
    if (race) {
      const ev = race.ev, me = race.runners[0], left = ev.dist - me.x;
      if (s === "marks" || s === "set") T("block", race.crouched ? "Block start: now hold still until the gun" : "Block start: crouch down now", !race.crouched);
      if (s === "run") {
        if (race.clock < 6) T("legs", "Speed: quicker feet, faster runner");
        if (ev.hurdles && me.hNext < 10) T("hurdle", "Hurdles: jump straight up when it says JUMP", false);
        if (left < 15 && left > 0 && !race.dipped && me.fin === null) T("dip", left < 4 ? "Lean now: punch toward the screen!" : "Finish: punch at the screen to lean", left < 4);
      }
    } else if (field) {
      const ev = field.ev;
      if (s === "fieldReady" || s === "approach") {
        if (ev.id === "long") {
          const d = LJ_BOARD - (ev.origin + field.x);
          if (d > 5) T("ljspeed", "Long jump: more run speed, a longer jump");
          T("board", d < 2.2 && d > -0.05 ? "Jump now: as close to the board as you can" : "Board: jump right before it, past it is a foul", d < 2.2 && d > -0.05);
        } else {
          const d = JV_LINE - (ev.origin + field.x);
          T("jvspeed", "Javelin: a faster run adds to the throw");
          if (d < 14) T("arm", !field.cocked ? "Throw: right or left hand up by your head first" : "Throw: whip it forward hard!", !!field.cocked && d < 12);
          if (d < 6) T("line", "Line: let go before it or it is a foul", d < 3);
        }
      }
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
  var msgR = null;
  function drawMsg() {
    msgR = null;
    if (msg) {
      const age = (NOW - msg.t0) / 1e3;
      if (age > msg.dur) {
        msg = null;
        return;
      }
      const s = 1 + 0.35 * Math.exp(-age * 9), al = clamp((msg.dur - age) / 0.3);
      const L = sideLines(msg.t, sidePx(W, H), sideW(W, H, 0.22), (px) => font(px, 900)), x0 = W * 0.975, y0 = H * 0.3;
      msgR = { x: x0 - L.w * s, y: y0 - L.px * 0.6 * s, w: L.w * s, h: L.h * s };
      hudR.push(msgR);
      ctx.save();
      ctx.globalAlpha = al;
      ctx.translate(x0, y0);
      ctx.scale(s, s);
      ctx.font = font(L.px, 900);
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.lineWidth = L.px * 0.1;
      ctx.strokeStyle = "rgba(0,0,0,0.55)";
      ctx.shadowColor = msg.col;
      ctx.fillStyle = msg.col;
      L.lines.forEach((l, j) => {
        const ly = j * L.px * 1.1;
        ctx.shadowBlur = 0;
        ctx.strokeText(l, 0, ly);
        ctx.shadowBlur = L.px * 0.33;
        ctx.fillText(l, 0, ly);
      });
      ctx.shadowBlur = 0;
      ctx.restore();
    }
    pops = pops.filter((p) => NOW - p.t0 < 1300);
    if (!msg) pops.forEach((p) => {
      const age = (NOW - p.t0) / 1e3;
      {
        ctx.font = font(Math.min(U * 0.05, W * 0.06), 900);
        const pw = ctx.measureText(p.t).width, py = Math.max(H * 0.3, topB + U * 0.08) - age * U * 0.04;
        hudR.push({ x: W / 2 - pw / 2, y: py - U * 0.035, w: pw, h: U * 0.07 });
      }
      ctx.globalAlpha = clamp((1.3 - age) / 0.4);
      text(p.t, W / 2, Math.max(H * 0.3, topB + U * 0.08) - age * U * 0.04, Math.min(U * 0.05, W * 0.06), p.col, "center", 900, U * 0.02);
      ctx.globalAlpha = 1;
    });
  }
  function drawConfetti(dt) {
    confetti = confetti.filter((c) => (c.life -= dt) > 0 && c.y < H + 20);
    for (const c of confetti) {
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.vy += 40 * dt;
      c.r += c.vr * dt;
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.r);
      ctx.scale(1, Math.cos(c.r * 1.3));
      ctx.fillStyle = c.c;
      ctx.fillRect(-c.s, -c.s * 0.5, c.s * 2, c.s);
      ctx.restore();
    }
  }
  let figRect = null;
  const CS = { k: 1, tx: 0, ty: 0, on: false };
  function cornerSelf() {
    const el = document.getElementById("bp-self"), s = G.state;
    const on = s !== "title" && BP.present !== false;
    const F = BP.figure || (BP.figure = {});
    F.alpha = on ? 0.5 : 0.24;
    F.shadow = on ? 0.5 : 0;
    const Bd = BP._figPose, dpr = Math.min(2, devicePixelRatio || 1), cx = Math.max(W * 0.07, H * 0.075), feet = H * 0.965;
    let want = { k: 1, tx: 0, ty: 0 };
    if (on) {
      const T = Bd && Bd.T ? Bd.T / dpr : H * 0.17, n = Bd && Bd.n ? [Bd.n[0] / dpr, Bd.n[1] / dpr] : [W / 2, H * 0.4];
      const k = clamp(H * (W < H ? 0.22 : 0.27) / (3.5 * T), 0.15, 0.7);
      want = { k, tx: cx - n[0] * k, ty: feet - 2.75 * T * k - n[1] * k };
    }
    const f = Math.abs(CS.k - want.k) > 0.03 || on !== CS.on ? 0.12 : 0.025;
    CS.on = on;
    CS.k = lerp(CS.k, want.k, f);
    CS.tx = lerp(CS.tx, want.tx, f);
    CS.ty = lerp(CS.ty, want.ty, f);
    if (!on && Math.abs(CS.k - 1) < 2e-3) {
      CS.k = 1;
      CS.tx = 0;
      CS.ty = 0;
    }
    const tf = CS.k === 1 ? "" : "translate(".concat(CS.tx.toFixed(1), "px, ").concat(CS.ty.toFixed(1), "px) scale(").concat(CS.k.toFixed(4), ")");
    if (el && el.style.transform !== tf) el.style.transform = tf;
    if (!on) {
      figRect = null;
      return;
    }
    const fw2 = H * 0.27 * 0.62, top = feet - H * (W < H ? 0.22 : 0.27) - H * 0.07;
    figRect = { x: cx - fw2 / 2, y: top, w: fw2, h: feet - top + H * 0.02 };
  }
  let last = 0, fpsAcc = 0, fpsN = 0, fps = 60, jumboT = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    BP.update(now);
    const rdt = Math.min(0.05, (now - (last || now)) / 1e3) || 1 / 60;
    last = now;
    fpsAcc += rdt;
    fpsN++;
    if (fpsAcc > 1) {
      fps = fpsN / fpsAcc;
      fpsAcc = 0;
      fpsN = 0;
    }
    const wantTS = race && race.photo && (G.state === "run" || G.state === "raceDone" && sinceS() < 0.6) ? 0.35 : 1;
    TS = lerp(TS, wantTS, Math.min(1, rdt * 8));
    const dt = rdt * TS;
    NOW = now;
    const t = now / 1e3;
    feedRun(now);
    readInput(rdt);
    if (race) updateRace(dt);
    else if (field) updateField(dt);
    excite = lerp(excite, exciteT, Math.min(1, rdt * 2));
    exciteT = lerp(exciteT, ["run", "flight", "approach"].includes(G.state) ? 0.55 : 0.3, rdt * 0.25);
    crowdU.uTime.value = t;
    crowdU.uExcite.value = excite;
    crowdU.uWave.value += rdt * 34;
    if ((jumboT += rdt) > 0.1) {
      jumboT = 0;
      setCrowd();
      if (race) drawClock(G.state === "run" || G.state === "raceDone" ? race.clock.toFixed(2) : "0.00");
    }
    for (let i = 0; i < FLASH_N; i++) {
      if (Math.random() < 0.03 + excite * 0.12) {
        const d = 420;
        flashPos.set([camera.position.x + rand(-1.2, 1.2) * d, camera.position.y + d * rand(0.012, 0.07), camera.position.z - d], i * 3);
      } else flashPos[i * 3 + 1] = -50;
    }
    flashGeo.attributes.position.needsUpdate = true;
    adTex.offset.x = t * 0.02 % 1;
    stepFw(rdt);
    placeFigures(t, dt);
    stepParts(dt);
    updateCamera(t, rdt);
    flash = Math.max(0, flash - rdt * 2.5);
    tunePost();
    render(rdt);
    ctx.clearRect(0, 0, W, H);
    buttons = [];
    hudR = [];
    cornerSelf();
    if (figRect) hudR.push(figRect);
    if (G.state === "title") howToTile(t);
    if (TS < 0.9) {
      const bar = H * 0.09 * (1 - TS) / 0.65;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, bar);
      ctx.fillRect(0, H - bar, W, bar);
    }
    if (G.state === "title") drawTitle(t);
    else if (G.state === "medals") drawMedals(t);
    else {
      drawScoreboard();
      drawStepMeter();
      if (G.state === "fieldReady" && !msg) text("TRY ".concat(field.attempt + 1, " OF 2"), W / 2, H * 0.4, Math.min(U * 0.08, W * 0.09), "#ffffff", "center", 900, U * 0.03);
      drawLabels();
      drawPrompts(t);
      if (G.state === "intro") drawIntro(t);
      if (G.state === "results") drawResults(t);
    }
    drawMsg();
    drawConfetti(rdt);
    if (flash > 0) {
      ctx.fillStyle = "rgba(255,255,255,".concat(flash * 0.35, ")");
      ctx.fillRect(0, 0, W, H);
    }
    if (!figRect || G.state === "results" || G.state === "medals" || [BP.hands.left, BP.hands.right].some((h) => h.seen && h.y < 0.22)) BP.drawHands(ctx, W, H);
    if (NOHUD) ctx.clearRect(0, 0, W, H);
  }
  setState("title");
  requestAnimationFrame(frame);
  window.__game = {
    get state() {
      return G.state;
    },
    get ev() {
      return G.ev;
    },
    get eventId() {
      return EVENTS[G.ev].id;
    },
    get score() {
      return G.total;
    },
    get total() {
      return G.total;
    },
    get results() {
      return G.results.map((r) => ({ ev: r.ev.id, pts: r.pts, rows: r.rows.map((x) => ({ who: ATH[x.k].name, disp: x.disp, place: x.place, medal: x.medal })) }));
    },
    get medals() {
      return G.medals;
    },
    get run() {
      return inp.run;
    },
    get raw() {
      return inp.raw;
    },
    get pump() {
      return inp.pump;
    },
    get legs() {
      return inp.legs;
    },
    get spm() {
      return inp.spm || 0;
    },
    get steps() {
      return STEP.n;
    },
    get stepSrc() {
      return STEP.src;
    },
    get hops() {
      return RS.jumps;
    },
    get meter() {
      return meterR;
    },
    get picRun() {
      return picRun();
    },
    get cocked() {
      return field ? !!field.cocked : false;
    },
    get speed() {
      return (race ? race.runners[0].v : field ? field.v : 0) || 0;
    },
    get x() {
      return (race ? race.runners[0].x : field ? field.x : 0) || 0;
    },
    get log() {
      return G.log;
    },
    get clock() {
      return race ? race.clock : 0;
    },
    get reaction() {
      return race && race.reaction;
    },
    get falseStarts() {
      return race ? race.falseStarts : 0;
    },
    get nextHurdle() {
      if (!race || !race.ev.hurdles) return null;
      const r = race.runners[0];
      return r.hNext < 10 ? HURDLE_X[r.hNext] - r.x : null;
    },
    get knocks() {
      return race ? race.runners[0].knocks : 0;
    },
    get airborne() {
      return race ? race.runners[0].air >= 0 : false;
    },
    get boardDist() {
      return field && field.ev.id === "long" ? LJ_BOARD - (field.ev.origin + field.x) : null;
    },
    get lineDist() {
      return field && field.ev.id === "jav" ? JV_LINE - (field.ev.origin + field.x) : null;
    },
    get marks() {
      return field ? field.marks : null;
    },
    get attempt() {
      return field ? field.attempt : null;
    },
    get buttons() {
      return buttons.map((b) => ({ id: b.id, x: b.x, y: b.y, w: b.w, h: b.h }));
    },
    get fps() {
      return fps;
    },
    get quality() {
      return state().quality.tier;
    },
    grace(ms = 1500) {
      state().grace(ms);
    },
    get realFps() {
      return Math.round(state().quality.fps);
    },
    get celebrated() {
      return G.celebrations || 0;
    },
    get photo() {
      return race ? race.photo : false;
    },
    get dipped() {
      return race ? race.dipped : false;
    },
    testEvent(i) {
      startMeet();
      startEvent(i);
    },
    // tests: go straight to one event's intro
    toMedals() {
      G.ev = EVENTS.length - 1;
      nextAfterResults();
    },
    testSay(t, sub) {
      say(t, sub, "#ffd34d", 4);
    }
    // tests: jump to the end of the meet
  };
})().catch((e) => setTimeout(() => {
  throw e;
}));
