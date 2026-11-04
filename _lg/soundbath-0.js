import {
  AdditiveBlending,
  Box3,
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  CircleGeometry,
  ClampToEdgeWrapping,
  Clock,
  Color,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  InstancedMesh,
  LatheGeometry,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  PointLight,
  RepeatWrapping,
  SRGBColorSpace,
  ShadowMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3
} from "./chunk-4IYDSAYK.js";
import "./chunk-NWIHTO7D.js";

// bmpage:bmpage:soundbath.html#0
(async () => {
  const SBX = window.__sb, INST = SBX.INST, Q = new URLSearchParams(location.search);
  let Realism;
  try {
    Realism = await import(new URL(window.BP_DIR + "realism.js", location.href).href);
  } catch (e) {
    Realism = null;
  }
  const ASSET = window.BP_DIR + "assets/";
  if (Realism) {
    let bowlGeo = function(h, foot, flare) {
      const out = [], inn = [], N = 22, th = 0.045;
      for (let k = 0; k <= N; k++) {
        const t = k / N, y = -h + h * t, r = foot + (1 - foot) * Math.pow(Math.sin(t * Math.PI / 2), flare);
        out.push([r, y]);
      }
      for (let k = N; k >= 0; k--) {
        const t = k / N, y = -h + th + (h - th) * t, r = foot + (1 - foot) * Math.pow(Math.sin(t * Math.PI / 2), flare) - th;
        inn.push([Math.max(1e-4, r), y]);
      }
      return lathe([[0, -h], ...out, [1, 0.012], [1 - th * 0.5, 0.02], ...inn, [0, -h + th]], 72);
    }, place = function(i, k) {
      var _a;
      let z = (_a = DEPTH[i.type]) != null ? _a : 0;
      if (i.type === "tibetan") z += k % 3 * 0.12;
      if (i.type === "crystal") {
        const c = INST.filter((j) => j.type === "crystal"), n = c.indexOf(i);
        z = 0.85 - 0.38 * Math.sin(n / Math.max(1, c.length - 1) * Math.PI);
      }
      _v.set(i.x / 1600 * 2 - 1, 1 - i.y / 1e3 * 2, 0.5).unproject(camera);
      _d.subVectors(_v, camera.position).normalize();
      const t = (z - camera.position.z) / _d.z, P = camera.position.clone().addScaledVector(_d, t);
      camera.getWorldDirection(_fwd);
      const depth = P.clone().sub(camera.position).dot(_fwd);
      const wpp = 2 * depth * Math.tan(MathUtils.degToRad(camera.fov) / 2) / innerHeight;
      const R = i.r * Math.min(innerWidth / 1600, innerHeight / 1e3) * wpp;
      return { P, R, wpp };
    }, stand = function(g, x, yTop, z, r, mat = darkWood) {
      const h = Math.max(0.02, yTop);
      const s = new Group();
      s.position.set(x, 0, z);
      const col = cyl(r * 0.38, r * 0.46, h * 0.9, mat, 24);
      col.position.y = h * 0.47;
      s.add(col);
      const cap = cyl(r * 0.85, r * 0.8, Math.min(0.05, h * 0.06), mat, 32);
      cap.position.y = h - h * 0.03;
      s.add(cap);
      const foot = cyl(r * 0.7, r * 0.8, Math.min(0.05, h * 0.08), mat, 32);
      foot.position.y = Math.min(0.03, h * 0.04);
      s.add(foot);
      g.add(s);
      return s;
    }, tvFlames = function() {
      flameIM = new InstancedMesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ map: flameTex, transparent: true, depthWrite: false, blending: AdditiveBlending }), flames.length);
      flameIM.material.color.setScalar(2.2);
      flameIM.frustumCulled = false;
      scene.add(flameIM);
      for (const fl of flames) {
        const d = new Object3D();
        fl.f.getWorldPosition(d.position);
        d.scale.copy(fl.f.scale);
        fl.f.parent.remove(fl.f);
        fl.f.material.dispose();
        fl.f = d;
      }
    }, tvMerge = function(roots, dest) {
      const made = [], buckets = /* @__PURE__ */ new Map();
      dest.updateMatrixWorld(true);
      for (const r of roots) {
        r.updateMatrixWorld(true);
        r.traverse((o) => {
          if (!o.isMesh || o.isInstancedMesh || o.isSkinnedMesh || o.userData.dyn || Array.isArray(o.material) || o.material.transparent || o.matrixWorld.determinant() <= 0) return;
          let f = null;
          for (let p = o.parent; p; p = p.parent) if (p.userData.dyn) {
            f = p;
            break;
          }
          const key2 = (f ? f.id : "w") + ":" + o.material.id + ":" + Object.keys(o.geometry.attributes).sort().join();
          if (!buckets.has(key2)) buckets.set(key2, { f, mat: o.material, list: [] });
          buckets.get(key2).list.push(o);
        });
      }
      for (const { f, mat, list } of buckets.values()) {
        if (list.length < 2) continue;
        _inv.copy((f || dest).matrixWorld).invert();
        let geos = list.map((o) => {
          const s = o.geometry, g = new BufferGeometry();
          for (const a of ["position", "normal", "uv"]) if (s.attributes[a]) g.setAttribute(a, s.attributes[a].clone());
          if (s.index) g.setIndex(s.index.clone());
          g.applyMatrix4(_m4.multiplyMatrices(_inv, o.matrixWorld));
          return g;
        });
        if (geos.some((g) => !g.index) && geos.some((g) => g.index)) geos = geos.map((g) => g.index ? g.toNonIndexed() : g);
        const merged = BGU.mergeGeometries(geos);
        geos.forEach((g) => g.dispose());
        if (!merged) continue;
        const m = new Mesh(merged, mat);
        m.matrixAutoUpdate = false;
        (f || dest).add(m);
        made.push(m);
        for (const o of list) {
          o.parent.remove(o);
          if (!o.geometry.__shared) o.geometry.dispose();
        }
      }
      return made;
    }, build = function() {
      for (const g of groups) {
        scene.remove(g);
        g.traverse((o) => {
          if (o.geometry && !o.geometry.__shared) o.geometry.dispose();
        });
      }
      for (const m of tvMerged) {
        m.parent && m.parent.remove(m);
        m.geometry.dispose();
      }
      groups.length = tvMerged.length = 0;
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();
      INST.forEach((i, k) => {
        const { P, R, wpp } = place(i, k);
        i.__P = P;
        i.__wpp = wpp;
        const make = B[i.type];
        if (!make) return;
        const g = make(i, R, null, INST.filter((j) => j.type === i.type).indexOf(i));
        g.position.copy(P);
        g.traverse((o) => {
          if (o.isMesh) {
            o.castShadow = o.castShadow !== false;
            o.receiveShadow = true;
          }
        });
        g.userData.i = i;
        scene.add(g);
        groups.push(g);
      });
      if (TV) tvMerged.push(...tvMerge(groups, scene));
      TIB.__shared = CRY.__shared = true;
      sizeKey = innerWidth + "x" + innerHeight;
      RZ.grace(1500);
    }, frame = function() {
      requestAnimationFrame(frame);
      if (sizeKey !== innerWidth + "x" + innerHeight) build();
      const dt = Math.min(0.05, clock.getDelta()), t = performance.now() / 1e3;
      let loud = null, lv = 0;
      for (const g of groups) {
        g.userData.anim && g.userData.anim(t);
        const i = g.userData.i, v = Math.max(i.glow || 0, i.sing || 0);
        if (v > lv) {
          lv = v;
          loud = i;
        }
      }
      if (loud && lv > 0.03) {
        soundLight.position.copy(loud.__P).add(SL_OFF);
        soundLight.color.set(loud.color).lerp(WHITE, 0.4);
        soundLight.intensity = 2.2 * lv;
      } else soundLight.intensity = 0;
      for (const { f, ph } of flames) {
        const k = 1 + 0.12 * Math.sin(t * 9 + ph) + 0.08 * Math.sin(t * 23 + ph * 2);
        f.scale.y = f.scale.x * 2 * k;
      }
      if (flameIM) {
        flames.forEach(({ f }, k) => {
          f.quaternion.copy(camera.quaternion);
          f.updateMatrix();
          flameIM.setMatrixAt(k, f.matrix);
        });
        flameIM.instanceMatrix.needsUpdate = true;
      }
      const fl = 1 + 0.1 * Math.sin(t * 8.3) + 0.06 * Math.sin(t * 21.7);
      candleL.intensity = 1.4 * fl;
      candleR.intensity = 1.4 * (2 - fl);
      if (RZ.composer !== RZ.__tuned) {
        RZ.__tuned = RZ.composer;
        if (RZ.passes.bloom) {
          RZ.passes.bloom.strength = 0.3;
          RZ.passes.bloom.threshold = 1.05;
          RZ.passes.bloom.radius = 0.55;
        }
        if (RZ.passes.ao) {
          const ao = RZ.passes.ao, r0 = ao.render.bind(ao);
          ao.render = (...a) => {
            const hid = [];
            scene.traverse((o) => {
              if (o.visible && (o.isSprite || o.userData.noAO)) {
                hid.push(o);
                o.visible = false;
              }
            });
            try {
              r0(...a);
            } finally {
              hid.forEach((o) => o.visible = true);
            }
          };
        }
      }
      Realism.render(dt);
    };
    const glc = document.createElement("canvas");
    glc.id = "gl";
    document.body.prepend(glc);
    const RZ = Realism.setup(glc, { fov: 50, near: 0.05, far: 60, tier: Q.has("tier") ? +Q.get("tier") : void 0 });
    const { renderer, scene, camera } = RZ;
    window.__rz = RZ;
    const TV = !!Realism.tv, BGU = TV ? await import("./chunk-BVKZKTUL.js") : null;
    renderer.toneMappingExposure = 1.05;
    const CAM = new Vector3(0, 1.3, 3.6), LOOK = new Vector3(0, 1, 0);
    camera.position.copy(CAM);
    camera.lookAt(LOOK);
    const SKY_ROT = Q.has("sky") ? +Q.get("sky") : -Math.PI, SKY_GAIN = 0.92;
    Realism.environment(scene, renderer, "pine_attic", { background: true, exact: true, intensity: 0.8, rotation: Q.has("rot") ? +Q.get("rot") : 1.57, skyRotation: SKY_ROT }).then(() => {
      const sky = RZ.sky;
      if (sky) {
        sky.material.color.setScalar(SKY_GAIN);
      }
      RZ.grace(2500);
    }).catch(() => {
      scene.background = new Color(1708042);
    });
    scene.add(new HemisphereLight(16771276, 5913122, 0.35));
    const key = Realism.sun(scene, { color: 16773340, intensity: 1.5, position: [1.6, 6.5, 4.5], target: [0, 0.6, 0], size: 4.5 });
    key.shadow.radius = 7;
    const back = new DirectionalLight(16774372, 0.9);
    back.position.set(-0.5, 5, -6);
    scene.add(back);
    const front = new DirectionalLight(16763024, 0.45);
    front.position.set(-2, 1.5, 6);
    scene.add(front);
    const catcher = new Mesh(new PlaneGeometry(30, 30), new ShadowMaterial({ opacity: 0.38 }));
    catcher.rotation.x = -Math.PI / 2;
    catcher.position.y = 1e-3;
    catcher.receiveShadow = true;
    scene.add(catcher);
    if (TV) catcher.visible = false;
    const tex2 = (w, h, draw) => {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      draw(c.getContext("2d"), w, h);
      const t = new CanvasTexture(c);
      t.wrapS = t.wrapT = RepeatWrapping;
      t.anisotropy = 8;
      return t;
    };
    const hammer = tex2(512, 512, (g, w, h) => {
      g.fillStyle = "rgb(128,128,255)";
      g.fillRect(0, 0, w, h);
      for (let k = 0; k < 900; k++) {
        const x = Math.random() * w, y = Math.random() * h, r = 6 + Math.random() * 14;
        for (const [ox, oy] of [[0, 0], [w, 0], [-w, 0], [0, h], [0, -h]]) {
          const gr = g.createRadialGradient(x + ox - r * 0.3, y + oy - r * 0.3, 0, x + ox, y + oy, r);
          gr.addColorStop(0, "rgba(100,100,255,0.55)");
          gr.addColorStop(0.6, "rgba(150,150,255,0.35)");
          gr.addColorStop(1, "rgba(128,128,255,0)");
          g.fillStyle = gr;
          g.beginPath();
          g.arc(x + ox, y + oy, r, 0, 6.283);
          g.fill();
        }
      }
    });
    const ringsTex = tex2(1024, 1024, (g, w, h) => {
      g.fillStyle = "rgb(128,128,128)";
      g.fillRect(0, 0, w, h);
      for (let r = 6; r < w / 2; r += 3 + Math.random() * 4) {
        g.strokeStyle = "rgba(".concat(Math.random() < 0.5 ? 255 : 0, ",").concat(Math.random() < 0.5 ? 255 : 0, ",0,").concat(0.05 + Math.random() * 0.12, ")");
        g.lineWidth = 1 + Math.random() * 2;
        g.beginPath();
        g.arc(w / 2, h / 2, r, 0, 6.283);
        g.stroke();
      }
    });
    const brass = new MeshPhysicalMaterial({ color: 13209916, metalness: 1, roughness: 0.3, normalMap: hammer, normalScale: new Vector2(0.45, 0.45), clearcoat: 0.25, clearcoatRoughness: 0.35 });
    const bronze = new MeshPhysicalMaterial({ color: 10250798, metalness: 1, roughness: 0.36, normalMap: hammer, normalScale: new Vector2(0.8, 0.8), clearcoat: 0.15, clearcoatRoughness: 0.4 });
    const bronzeIn = bronze.clone();
    bronzeIn.color = new Color(7227934);
    bronzeIn.roughness = 0.42;
    const gongMat = new MeshPhysicalMaterial({ color: 13144128, metalness: 1, roughness: 0.28, roughnessMap: ringsTex, normalMap: hammer, normalScale: new Vector2(0.25, 0.25), clearcoat: 0.3, clearcoatRoughness: 0.3 });
    const steel = new MeshStandardMaterial({ color: 14212580, metalness: 1, roughness: 0.2 });
    const alu = new MeshStandardMaterial({ color: 12896979, metalness: 1, roughness: 0.3 });
    const darkWood = Realism.pbr("oak_veneer_01", { repeat: [1, 2], roughness: 0.62, color: 8015922, envMapIntensity: 0.45 });
    const lightWood = Realism.pbr("oak_veneer_01", { repeat: [1, 1], roughness: 0.6, color: 12884588, envMapIntensity: 0.45 });
    const cord = new MeshStandardMaterial({ color: 2759184, roughness: 0.9 });
    const velvet = (color) => {
      const m = Realism.pbr("velour_velvet", { repeat: [2, 2], physical: true, roughness: 0.85, color, envMapIntensity: 0.6 });
      m.map = null;
      m.sheen = 1;
      m.sheenRoughness = 0.5;
      m.sheenColor = new Color(color).lerp(new Color(16777215), 0.2);
      return m;
    };
    const velvetRed = velvet(8002594), velvetGold = velvet(10119716), velvetPlum = velvet(4858944);
    const rubber = new MeshStandardMaterial({ color: 1841689, roughness: 0.8 });
    const crystalMat = (col) => new MeshPhysicalMaterial({
      color: new Color(16184560).lerp(new Color(col), 0.06),
      roughness: 0.42,
      metalness: 0,
      transmission: RZ.quality.tier >= 2 ? 0.45 : 0,
      thickness: 0.04,
      ior: 1.46,
      sheen: 0.5,
      sheenRoughness: 0.4,
      sheenColor: new Color(16777215),
      clearcoat: 0.35,
      clearcoatRoughness: 0.35,
      emissive: new Color(col),
      emissiveIntensity: 0
    });
    const kilim = tex2(1024, 512, (c, w, h) => {
      c.fillStyle = "#6a2818";
      c.fillRect(0, 0, w, h);
      const band = (y0, y1, col) => {
        c.fillStyle = col;
        c.fillRect(0, y0 * h, w, (y1 - y0) * h);
      };
      band(0, 0.06, "#cdb996");
      band(0.94, 1, "#cdb996");
      band(0.08, 0.12, "#2e3550");
      band(0.88, 0.92, "#2e3550");
      band(0.14, 0.17, "#c98a3a");
      band(0.83, 0.86, "#c98a3a");
      for (let k = 0; k < 22; k++) {
        const cx = (k % 11 + 0.5) / 11 * w, cy = h * (k < 11 ? 0.36 : 0.64), rx = w / 34, ry = h * 0.11;
        c.fillStyle = k % 2 ? "#b07830" : "#cdb996";
        c.beginPath();
        c.moveTo(cx, cy - ry);
        c.lineTo(cx + rx, cy);
        c.lineTo(cx, cy + ry);
        c.lineTo(cx - rx, cy);
        c.closePath();
        c.fill();
        c.fillStyle = "#2e3550";
        c.beginPath();
        c.moveTo(cx, cy - ry * 0.55);
        c.lineTo(cx + rx * 0.55, cy);
        c.lineTo(cx, cy + ry * 0.55);
        c.lineTo(cx - rx * 0.55, cy);
        c.closePath();
        c.fill();
        c.fillStyle = "#6a2818";
        c.fillRect(cx - rx * 0.12, cy - ry * 0.12, rx * 0.24, ry * 0.24);
      }
      for (let k = 0; k < 60; k++) {
        c.fillStyle = "rgba(".concat(Math.random() < 0.5 ? "0,0,0" : "255,240,220", ",").concat(Math.random() * 0.05, ")");
        c.fillRect(Math.random() * w, 0, 1 + Math.random() * 3, h);
      }
      for (let x = 0; x < w; x += 8) {
        c.fillStyle = "#d8c4a0";
        c.fillRect(x, 0, 3, h * 0.012);
        c.fillRect(x, h * 0.988, 3, h * 0.012);
      }
    });
    kilim.colorSpace = SRGBColorSpace;
    kilim.wrapS = kilim.wrapT = ClampToEdgeWrapping;
    const linen = (() => {
      const m = Realism.pbr("rough_linen", { repeat: [10, 6], roughness: 0.95, envMapIntensity: 0.5 });
      m.map = kilim;
      m.normalScale = new Vector2(1.2, 1.2);
      return m;
    })();
    const lathe = (pts, seg = 64) => new LatheGeometry(pts.map(([r, y]) => new Vector2(Math.max(1e-4, r), y)), seg);
    const TIB = bowlGeo(0.5, 0.52, 0.75), CRY = bowlGeo(0.86, 0.86, 0.45);
    const tube = (pts, r, mat, seg = 24) => new Mesh(new TubeGeometry(new CatmullRomCurve3(pts), seg, r, 8, false), mat);
    const metricUV = (g, fx) => {
      const uv = g.attributes.uv;
      for (let k = 0; k < uv.count; k++) {
        const [sx, sy] = fx(k);
        uv.setXY(k, uv.getX(k) * sx, uv.getY(k) * sy);
      }
      uv.needsUpdate = true;
      return g;
    };
    const cyl = (r0, r1, h, mat, seg = 24) => {
      const g = metricUV(new CylinderGeometry(r0, r1, h, seg), () => [Math.PI * (r0 + r1), h]);
      const m = new Mesh(g, mat);
      m.castShadow = m.receiveShadow = true;
      return m;
    };
    const box = (w, h, d, mat) => {
      const F = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
      const g = metricUV(new BoxGeometry(w, h, d), (k) => F[Math.floor(k / 4)]);
      const m = new Mesh(g, mat);
      m.castShadow = m.receiveShadow = true;
      return m;
    };
    const DEPTH = { gong: -1, chime: -0.35, tingsha: -0.2, fork: 0.05, tibetan: 0.15, crystal: 0.65, ocean: 0.4, tongue: 0.3, rainstick: -0.45 };
    const _v = new Vector3(), _d = new Vector3(), _fwd = new Vector3();
    const B = {
      gong(i, R) {
        const g = new Group();
        const disc = new Group();
        disc.position.y = 1.25 * R;
        disc.userData.dyn = 1;
        g.add(disc);
        const prof = [[0, 0.06], [0.16, 0.06], [0.2, 0.02], [0.9, 0], [0.97, 0], [1, -0.03], [1, -0.09], [0.96, -0.09], [0.94, -0.03], [0.2, -0.015], [0.16, 0.035], [0, 0.035]];
        const face = new Mesh(lathe(prof.map(([r, y]) => [r * R, y * R]), 96), gongMat);
        face.rotation.x = Math.PI / 2;
        face.position.y = -1.25 * R;
        face.castShadow = true;
        disc.add(face);
        for (const s of [-1, 1]) disc.add(tube([new Vector3(s * 0.48 * R, -1.25 * R + 0.86 * R, 0), new Vector3(s * 0.56 * R, -0.2 * R, 0), new Vector3(s * 0.6 * R, 0, 0)], 6e-3 + R * 6e-3, cord));
        const W = 1.32 * R, top = i.__P.y + 1.25 * R, post = 0.045 + R * 0.05;
        for (const s of [-1, 1]) {
          const p = box(post, top + post, post * 0.9, darkWood);
          p.position.set(s * W, (top + post) / 2 - i.__P.y, -0.02);
          g.add(p);
          const f = box(post * 1.2, post * 0.8, 0.5 + R * 0.4, darkWood);
          f.position.set(s * W, post * 0.4 - i.__P.y, -0.02);
          g.add(f);
        }
        const bar = box(2 * W + post * 2.4, post * 1.1, post, darkWood);
        bar.position.set(0, 1.25 * R + post * 0.3, -0.02);
        g.add(bar);
        const capL = box(post * 1.6, post * 0.5, post * 1.3, darkWood);
        capL.position.set(-W, 1.25 * R + post, -0.02);
        g.add(capL);
        const capR = capL.clone();
        capR.position.x = W;
        g.add(capR);
        g.userData.anim = (t) => {
          disc.rotation.x = Math.sin(t * 3) * i.swing * 0.06;
          disc.rotation.z = Math.sin(t * 2.1) * i.swing * 0.02;
        };
        return g;
      },
      chime(i, R, l) {
        const g = new Group(), barY = 0.92 * R, x0 = -1.05 * R, x1 = 1.05 * R, bh = Math.max(0.03, R * 0.09);
        const bar = box(x1 - x0, bh, bh * 1.1, darkWood);
        bar.position.y = barY;
        g.add(bar);
        const rr0 = Math.max(6e-3, R * 0.045), rods = [], tvLoc = [], tvRods = TV && [cyl(15e-4, 15e-4, barY - 0.76 * R, cord, 4), cyl(rr0, rr0, 1, alu, 20), cyl(rr0 * 1.02, rr0 * 1.02, rr0 * 0.4, darkWood, 12)].map((m) => {
          const im = new InstancedMesh(m.geometry, m.material, 8);
          im.frustumCulled = false;
          g.add(im);
          return im;
        });
        for (let k = 0; k < 8; k++) {
          const rx = -0.85 * R + k / 7 * 1.7 * R, len = R * (1.5 - k * 0.09), rr = Math.max(6e-3, R * 0.045);
          const piv = new Group();
          piv.position.set(rx, 0.76 * R, 0);
          g.add(piv);
          if (TV) {
            tvLoc.push([new Matrix4().makeTranslation(0, (barY - 0.76 * R) / 2, 0), new Matrix4().makeTranslation(0, -len / 2, 0).scale(new Vector3(1, len, 1)), new Matrix4().makeTranslation(0, -rr * 0.2, 0)]);
            rods.push(piv);
            continue;
          }
          const str = cyl(15e-4, 15e-4, barY - 0.76 * R, cord, 4);
          str.position.y = (barY - 0.76 * R) / 2;
          str.castShadow = false;
          piv.add(str);
          const rod = cyl(rr, rr, len, alu, 20);
          rod.position.y = -len / 2;
          piv.add(rod);
          const capT = cyl(rr * 1.02, rr * 1.02, rr * 0.4, darkWood, 12);
          capT.position.y = -rr * 0.2;
          piv.add(capT);
          rods.push(piv);
        }
        const post = Math.max(0.03, R * 0.07), floorY = -i.__P.y;
        const p = box(post, barY - floorY + post, post, darkWood);
        p.position.set(x0 - post * 0.5, (barY + floorY) / 2, 0);
        g.add(p);
        const f1 = box(0.5, post * 0.7, post, darkWood);
        f1.position.set(x0 - post * 0.5, floorY + post * 0.35, 0);
        g.add(f1);
        const f2 = box(post, post * 0.7, 0.5, darkWood);
        f2.position.set(x0 - post * 0.5, floorY + post * 0.35, 0);
        g.add(f2);
        const s = cyl(5e-3, 5e-3, R * 0.6, lightWood, 8);
        s.position.set(x1 - R * 0.05, barY - R * 0.35, R * 0.08);
        g.add(s);
        g.userData.anim = (t) => rods.forEach((r, k) => {
          r.rotation.z = Math.sin(t * 4 + k) * i.swing * 0.09;
          r.rotation.x = Math.sin(t * 3.3 + k * 1.7) * i.swing * 0.05;
          if (tvRods && (i.swing > 1e-4 || !tvLoc.set)) {
            tvLoc.set = k === 7;
            r.updateMatrix();
            tvRods.forEach((im, j) => {
              im.setMatrixAt(k, _m4.multiplyMatrices(r.matrix, tvLoc[k][j]));
              im.instanceMatrix.needsUpdate = true;
            });
          }
        });
        return g;
      },
      tingsha(i, R) {
        const g = new Group(), cym = [];
        const prof = [[0, 0.32], [0.12, 0.31], [0.16, 0.24], [0.6, 0.1], [0.95, 0.02], [1, 0], [0.96, -0.01], [0.6, 0.07], [0.15, 0.2], [0, 0.22]];
        const geo = lathe(prof.map(([r, y]) => [r * 0.5 * R, y * 0.5 * R]), 48);
        for (const s of [-1, 1]) {
          const m = new Mesh(geo, brass);
          m.rotation.x = Math.PI / 2;
          m.position.set(s * 0.55 * R, 0, 0);
          m.castShadow = true;
          m.userData.dyn = 1;
          g.add(m);
          cym.push(m);
        }
        g.add(tube([new Vector3(-0.55 * R, 0, 0.16 * R), new Vector3(-0.3 * R, 0.7 * R, 0.1 * R), new Vector3(0, 1.05 * R, 0.08 * R), new Vector3(0.3 * R, 0.7 * R, 0.1 * R), new Vector3(0.55 * R, 0, 0.16 * R)], Math.max(4e-3, R * 0.03), cord, 40));
        const up = cyl(2e-3, 2e-3, 6, cord, 4);
        up.position.y = 1.05 * R + 3;
        up.castShadow = false;
        g.add(up);
        g.userData.anim = (t) => cym.forEach((m, k) => {
          m.position.y = Math.sin(t * 20 + k * 2) * i.glow * 0.012;
          m.rotation.z = Math.sin(t * 17 + k) * i.glow * 0.15;
        });
        return g;
      },
      fork(i, R) {
        const g = new Group(), w = Math.max(5e-3, R * 0.065), prongs = [];
        for (const s of [-1, 1]) {
          const p = new Group();
          p.position.set(s * 0.25 * R, 0, 0);
          p.userData.dyn = 1;
          const m = cyl(w, w, 1.1 * R, steel, 12);
          m.position.y = -0.55 * R + 1.1 * R;
          p.add(m);
          g.add(p);
          prongs.push(p);
        }
        g.add(tube([new Vector3(-0.25 * R, 0.02 * R, 0), new Vector3(-0.18 * R, -0.22 * R, 0), new Vector3(0, -0.32 * R, 0), new Vector3(0.18 * R, -0.22 * R, 0), new Vector3(0.25 * R, 0.02 * R, 0)], w, steel, 24));
        const stem = cyl(w * 0.9, w * 0.9, 0.7 * R, steel, 12);
        stem.position.y = -0.62 * R;
        g.add(stem);
        const ballM = new Mesh(new SphereGeometry(w * 2.2, 16, 12), steel);
        ballM.position.y = -0.98 * R;
        ballM.castShadow = true;
        g.add(ballM);
        const blk = box(R * 0.9, R * 0.28, R * 0.7, lightWood);
        blk.position.y = -0.98 * R - R * 0.14 - w * 2;
        g.add(blk);
        stand(g, 0, i.__P.y - 0.98 * R - R * 0.28 - w * 2, 0, R * 0.55).position.y = -i.__P.y;
        g.userData.anim = (t) => {
          const v = Math.sin(t * 60) * i.glow * 0.03;
          prongs[0].rotation.z = v;
          prongs[1].rotation.z = -v;
        };
        return g;
      },
      tibetan(i, R, l, k) {
        const g = new Group();
        const bowl = new Mesh(TIB, bronze);
        bowl.scale.setScalar(R);
        bowl.position.y = 0.18 * R;
        bowl.castShadow = bowl.receiveShadow = true;
        bowl.userData.dyn = 1;
        g.add(bowl);
        const ring = new Mesh(new TorusGeometry(0.55 * R, 0.14 * R, 16, 40), [velvetRed, velvetGold, velvetPlum][k % 3]);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.18 * R - 0.5 * R - 0.05 * R;
        ring.scale.z = 0.8;
        ring.castShadow = true;
        g.add(ring);
        const topY = i.__P.y + 0.18 * R - 0.5 * R - 0.17 * R;
        stand(g, 0, topY, 0, R * 0.95).position.y = -i.__P.y;
        g.userData.anim = (t) => {
          bowl.rotation.z = Math.sin(t * 30) * i.glow * 6e-3;
        };
        return g;
      },
      crystal(i, R) {
        const g = new Group(), mat = crystalMat(i.color);
        const bowl = new Mesh(CRY, mat);
        bowl.scale.setScalar(R);
        bowl.position.y = 0.3 * R;
        bowl.castShadow = bowl.receiveShadow = true;
        bowl.userData.dyn = 1;
        g.add(bowl);
        const ring = new Mesh(new TorusGeometry(0.7 * R, 0.06 * R, 10, 40), rubber);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.3 * R - 0.86 * R;
        g.add(ring);
        const topY = i.__P.y + 0.3 * R - 0.86 * R - 0.06 * R;
        const riser = box(R * 1.55, Math.max(0.03, topY), R * 1.4, lightWood);
        riser.position.y = -i.__P.y + Math.max(0.03, topY) / 2;
        g.add(riser);
        g.userData.anim = (t) => {
          mat.emissiveIntensity = 0.04 + 0.55 * Math.max(i.glow, i.sing);
          bowl.rotation.z = Math.sin(t * 30) * i.glow * 4e-3;
        };
        return g;
      },
      ocean(i, R) {
        const g = new Group(), drum = new Group();
        drum.rotation.x = -0.55;
        drum.userData.dyn = 1;
        g.add(drum);
        const rim = new Mesh(new CylinderGeometry(R, R, 0.16 * R, 64, 1, true), lightWood);
        rim.rotation.x = Math.PI / 2;
        rim.castShadow = true;
        drum.add(rim);
        const skinTex = tex2(512, 512, (c, w, h) => {
          const gr = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
          gr.addColorStop(0, "#e9dcc0");
          gr.addColorStop(0.85, "#d9c6a0");
          gr.addColorStop(1, "#8a6a44");
          c.fillStyle = gr;
          c.fillRect(0, 0, w, h);
          for (let k = 0; k < 120; k++) {
            c.strokeStyle = "rgba(90,70,40,".concat(Math.random() * 0.08, ")");
            c.lineWidth = 1 + Math.random() * 3;
            c.beginPath();
            c.arc(w / 2 + (Math.random() - 0.5) * 40, h / 2 + (Math.random() - 0.5) * 40, Math.random() * w / 2, 0, 6.283);
            c.stroke();
          }
        });
        skinTex.colorSpace = SRGBColorSpace;
        const skin = new Mesh(new CircleGeometry(R * 0.995, 64), new MeshPhysicalMaterial({ map: skinTex, roughness: 0.6, transparent: true, opacity: 0.62, depthWrite: false, sheen: 0.3, side: DoubleSide }));
        skin.position.z = 0.08 * R;
        skin.userData.noAO = true;
        drum.add(skin);
        const backSkin = new Mesh(new CircleGeometry(R * 0.995, 64), new MeshStandardMaterial({ color: 1981516, roughness: 0.7 }));
        backSkin.position.z = -0.08 * R;
        backSkin.rotation.y = Math.PI;
        drum.add(backSkin);
        const backIn = backSkin.clone();
        backIn.rotation.y = 0;
        drum.add(backIn);
        const beads = new InstancedMesh(new SphereGeometry(Math.max(3e-3, R * 0.028), 8, 6), new MeshStandardMaterial({ color: 14213862, metalness: 0.6, roughness: 0.3 }), 60);
        drum.add(beads);
        const bd = Array.from({ length: 60 }, () => ({ a: Math.random() * 6.283, d: Math.random() })), M = new Matrix4();
        const ty = -i.__P.y;
        for (let k = 0; k < 3; k++) {
          const a = k * 2.094 + 0.5, foot = new Vector3(Math.cos(a) * 0.35, ty, Math.sin(a) * 0.3 - 0.1);
          const leg = tube([new Vector3(0, -R * 0.75, -R * 0.2), foot], 8e-3, darkWood, 4);
          leg.castShadow = true;
          g.add(leg);
        }
        const cradle = tube([new Vector3(-R * 0.5, -R * 0.62, R * 0.05), new Vector3(0, -R * 0.82, -R * 0.15), new Vector3(R * 0.5, -R * 0.62, R * 0.05)], 0.01, darkWood, 12);
        g.add(cradle);
        g.userData.anim = (t) => {
          const tilt = i.tilt || 0, sw = i.sway || 0;
          if (TV && sw < 1e-4 && beads.__set) {
            drum.rotation.z = tilt * sw * 0.08;
            return;
          }
          beads.__set = true;
          bd.forEach((b, k) => {
            b.a += sw * 0.05 * (1 + b.d) * Math.sign(tilt || 1);
            const rr = R * (0.2 + 0.7 * b.d);
            M.makeTranslation(Math.cos(b.a) * rr, -Math.sin(b.a) * rr, 0);
            beads.setMatrixAt(k, M);
          });
          beads.instanceMatrix.needsUpdate = true;
          drum.rotation.z = tilt * sw * 0.08;
        };
        return g;
      },
      tongue(i, R) {
        const g = new Group(), drum = new Group();
        drum.rotation.x = 0.95;
        drum.userData.dyn = 1;
        g.add(drum);
        const shell = new Mesh(
          lathe([[0, -0.42], [0.55, -0.4], [0.9, -0.28], [1, -0.08], [0.97, 0.06], [0.82, 0.14], [0, 0.17]].map(([r, y]) => [r * R, y * R]), 64),
          new MeshPhysicalMaterial({ color: 3428444, metalness: 0.85, roughness: 0.35, normalMap: hammer, normalScale: new Vector2(0.2, 0.2), clearcoat: 0.6, clearcoatRoughness: 0.2 })
        );
        shell.castShadow = shell.receiveShadow = true;
        drum.add(shell);
        const slots = tex2(512, 512, (c, w, h) => {
          c.fillStyle = "rgba(0,0,0,0)";
          c.clearRect(0, 0, w, h);
          c.translate(w / 2, h / 2);
          c.strokeStyle = "rgba(10,16,20,0.95)";
          c.lineWidth = 5;
          const r = w / 2 * 0.98;
          for (let k = 0; k < 8; k++) {
            c.save();
            c.rotate(k * Math.PI / 4);
            c.beginPath();
            c.moveTo(r * 0.28, -r * 0.12);
            c.lineTo(r * 0.78, -r * 0.12);
            c.arc(r * 0.78, 0, r * 0.12, -Math.PI / 2, Math.PI / 2);
            c.lineTo(r * 0.28, r * 0.12);
            c.stroke();
            c.restore();
          }
          c.fillStyle = "rgba(200,220,228,0.9)";
          c.beginPath();
          c.arc(0, 0, r * 0.08, 0, 6.283);
          c.fill();
        });
        const top = new Mesh(new CircleGeometry(0.8 * R, 64), new MeshStandardMaterial({ map: slots, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, roughness: 0.4 }));
        top.rotation.x = -Math.PI / 2;
        top.position.y = 0.168 * R;
        top.userData.noAO = true;
        drum.add(top);
        const ty = -i.__P.y, ring = new Mesh(new TorusGeometry(0.6 * R, 0.035 * R + 4e-3, 8, 40), darkWood);
        ring.rotation.x = Math.PI / 2 - 0.95 + Math.PI / 2;
        ring.position.set(0, -0.35 * R, -0.1 * R);
        ring.rotation.x = 0.95 - Math.PI / 2 + Math.PI;
        g.add(ring);
        for (let k = 0; k < 3; k++) {
          const a = k * 2.094 + 1.57, foot = new Vector3(Math.cos(a) * 0.38, ty, Math.sin(a) * 0.3 - 0.1);
          const leg = tube([new Vector3(Math.cos(a) * 0.5 * R, -0.45 * R, Math.sin(a) * 0.3 * R - 0.1 * R), foot], 9e-3, darkWood, 4);
          leg.castShadow = true;
          g.add(leg);
        }
        g.userData.anim = (t) => {
          drum.position.y = Math.sin(t * 40) * i.glow * 15e-4;
        };
        return g;
      },
      rainstick(i, R) {
        const g = new Group(), stick = new Group();
        stick.rotation.z = 1.05;
        stick.userData.dyn = 1;
        g.add(stick);
        const rad = 14 * Math.min(innerWidth / 1600, innerHeight / 1e3) * i.__wpp, L = 3.2 * R;
        const body = new Mesh(new CylinderGeometry(rad, rad * 1.05, L, 24), Realism.pbr("oak_veneer_01", { repeat: [1, 4], roughness: 0.6, color: 11569752 }));
        body.rotation.z = Math.PI / 2;
        body.castShadow = true;
        stick.add(body);
        const bandMat = TV && new MeshStandardMaterial({ color: 3811094, roughness: 0.9 });
        for (let k = 0; k < 16; k++) {
          const b = new Mesh(new TorusGeometry(rad * 1.02, rad * 0.06, 6, 24), bandMat || new MeshStandardMaterial({ color: 3811094, roughness: 0.9 }));
          b.rotation.y = Math.PI / 2;
          b.position.x = -L * 0.47 + k * L * 0.0625;
          stick.add(b);
        }
        for (const s of [-1, 1]) {
          const c = cyl(rad * 1.1, rad * 1.1, rad * 0.5, darkWood, 20);
          c.rotation.z = Math.PI / 2;
          c.position.x = s * L / 2;
          stick.add(c);
        }
        const ty = -i.__P.y, pole = box(0.03, -ty - rad * 1.2, 0.03, darkWood);
        pole.position.y = (ty - rad * 1.2) / 2;
        g.add(pole);
        const fb = box(0.36, 0.025, 0.36, darkWood);
        fb.position.y = ty + 0.012;
        g.add(fb);
        g.userData.anim = (t) => {
          stick.rotation.z = 1.05 - Math.sin(t * 2) * i.glow * 0.05;
        };
        return g;
      }
    };
    const room = new Group();
    scene.add(room);
    const rug = new Mesh(new PlaneGeometry(4.8, 2.5), linen);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, 4e-3, 0.45);
    rug.receiveShadow = true;
    room.add(rug);
    const zafuGeo = lathe([[0, 0], [0.18, 5e-3], [0.2, 0.04], [0.205, 0.08], [0.19, 0.12], [0.12, 0.15], [0, 0.155]], 48);
    for (const [x, z, m] of [[-1.85, 1.05, velvetRed], [1.75, 1.1, velvetPlum], [-2.35, 0.55, velvetGold]]) {
      const c = new Mesh(zafuGeo, m);
      c.position.set(x, 5e-3, z);
      c.castShadow = c.receiveShadow = true;
      room.add(c);
    }
    const flameTex = tex2(64, 128, (c, w, h) => {
      const glow = c.createRadialGradient(w / 2, h * 0.68, 0, w / 2, h * 0.68, w / 2);
      glow.addColorStop(0, "rgba(255,170,70,0.45)");
      glow.addColorStop(1, "rgba(255,140,40,0)");
      c.fillStyle = glow;
      c.fillRect(0, 0, w, h);
      c.save();
      c.translate(w / 2, h * 0.66);
      c.scale(1, 2.6);
      const gr = c.createRadialGradient(0, 0, 0, 0, 0, w * 0.2);
      gr.addColorStop(0, "rgba(255,252,240,1)");
      gr.addColorStop(0.45, "rgba(255,214,130,0.95)");
      gr.addColorStop(1, "rgba(255,150,50,0)");
      c.fillStyle = gr;
      c.beginPath();
      c.arc(0, 0, w * 0.2, 0, 6.283);
      c.fill();
      c.restore();
    });
    flameTex.wrapS = flameTex.wrapT = ClampToEdgeWrapping;
    flameTex.colorSpace = SRGBColorSpace;
    const wax = new MeshPhysicalMaterial({ color: 15721679, roughness: 0.55, sheen: 0.6, sheenColor: new Color(16767392) });
    const flames = [];
    for (const [x, z, h] of [[-1.45, 1, 0.16], [-1.28, 1.1, 0.1], [-0.8, 1.05, 0.12], [0.8, 1.05, 0.14], [1.3, 1.1, 0.1], [1.47, 0.98, 0.18], [-0.5, 1.2, 0.08], [0.5, 1.2, 0.09]]) {
      const c = new Group();
      c.position.set(x, 0, z);
      room.add(c);
      const plate = cyl(0.07, 0.075, 0.01, brass, 32);
      plate.position.y = 5e-3;
      c.add(plate);
      const p = cyl(0.04, 0.04, h, wax, 24);
      p.position.y = 0.01 + h / 2;
      c.add(p);
      const wick = cyl(18e-4, 18e-4, 0.014, cord, 6);
      wick.position.y = 0.01 + h + 6e-3;
      c.add(wick);
      const f = new Sprite(new SpriteMaterial({ map: flameTex, transparent: true, depthWrite: false, blending: AdditiveBlending, color: 16777215 }));
      f.scale.set(0.045, 0.09, 1);
      f.position.y = 0.01 + h + 0.035;
      f.material.color.setScalar(2.2);
      c.add(f);
      flames.push({ f, ph: Math.random() * 10 });
    }
    const candleL = new PointLight(16753226, 1.4, 4, 1.6);
    candleL.position.set(-1.3, 0.35, 1.3);
    scene.add(candleL);
    const candleR = new PointLight(16753226, 1.4, 4, 1.6);
    candleR.position.set(1.3, 0.35, 1.3);
    scene.add(candleR);
    const soundLight = new PointLight(16767392, 0, 2.5, 1.8);
    scene.add(soundLight);
    let flameIM = null;
    const onFloor = (o, x, z, s = 1, ry = 0) => {
      o.traverse((m) => {
        if (m.geometry) m.geometry.__shared = true;
      });
      o.scale.setScalar(s);
      o.rotation.y = ry;
      const b = new Box3().setFromObject(o);
      o.position.set(x, -b.min.y, z);
      room.add(o);
      return o;
    };
    (async () => {
      const get = (n) => Realism.model(TV ? n + "_tv" : n).catch(() => null);
      const [p1, p2, p2b0, p4, pil, cs1, cs20] = await Promise.all([get("potted_plant_01"), get("potted_plant_02"), TV ? null : get("potted_plant_02"), get("potted_plant_04"), get("throw_pillows_01"), get("wooden_candlestick"), TV ? null : get("wooden_candlestick")]);
      const p2b = TV ? p2 && p2.clone(true) : p2b0, cs2 = TV ? cs1 && cs1.clone(true) : cs20;
      if (p1) onFloor(p1, 2.95, -0.9, 1.1, 0.6);
      if (p2) onFloor(p2, -3, -0.5, 1.5, 0.3);
      if (p2b) onFloor(p2b, 2.3, 0.75, 0.95, 2);
      if (p4) onFloor(p4, -1.2, 1.55, 1.3, 0.2);
      if (pil) onFloor(pil, 1.85, 1.2, 0.8, -0.9);
      for (const [cs, x, z] of [[cs1, -1.95, 1.4], [cs2, 1.05, 1.5]]) if (cs) {
        onFloor(cs, x, z, 1.3, 0);
        const f = new Sprite(new SpriteMaterial({ map: flameTex, transparent: true, depthWrite: false, blending: AdditiveBlending }));
        f.material.color.setScalar(2.2);
        f.scale.set(0.04, 0.08, 1);
        f.position.set(x, 0.22 * 1.3 + 0.035, z);
        room.add(f);
        flames.push({ f, ph: Math.random() * 10 });
      }
      if (TV) {
        tvMerge([room], room);
        tvFlames();
      }
      RZ.grace(2e3);
    })();
    const _m4 = new Matrix4(), _inv = new Matrix4();
    let built = null, sizeKey = "";
    const groups = [], tvMerged = [];
    const clock = new Clock(), SL_OFF = new Vector3(0, 0.05, 0.45), WHITE = new Color(16777215);
    build();
    window.SB3D = { ready: true, build };
    requestAnimationFrame(frame);
  }
})().catch((e) => setTimeout(() => {
  throw e;
}));
