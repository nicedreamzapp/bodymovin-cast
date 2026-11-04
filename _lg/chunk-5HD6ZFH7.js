import {
  RoundedBoxGeometry
} from "./chunk-UI5V7SMY.js";
import {
  Box3,
  BoxGeometry,
  BufferGeometry,
  CatmullRomCurve3,
  CircleGeometry,
  Color,
  CylinderGeometry,
  DoubleSide,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Group,
  LatheGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  Shape,
  SphereGeometry,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3
} from "./chunk-4IYDSAYK.js";

// dist/wolfstrike/vehicles.js
var V = (x = 0, y = 0, z = 0) => new Vector3(x, y, z);
var MATS = {};
function kit(R, colour) {
  const key = "paint" + colour;
  if (!MATS[key]) {
    const m = R.pbr("green_metal_rust", { repeat: [1.6, 1.6], metalness: 0.3, roughness: 0.72 });
    m.color = new Color(colour).lerp(new Color(12104854), 0.55);
    MATS[key] = m;
  }
  MATS.dark || (MATS.dark = new MeshStandardMaterial({ color: 1579291, roughness: 0.6, metalness: 0.55 }));
  MATS.steel || (MATS.steel = new MeshStandardMaterial({ color: 3816511, roughness: 0.45, metalness: 0.85 }));
  MATS.rubber || (MATS.rubber = new MeshStandardMaterial({ color: 1315860, roughness: 0.95 }));
  MATS.glass || (MATS.glass = new MeshPhysicalMaterial({ color: 1779244, roughness: 0.06, metalness: 0.2, clearcoat: 1, envMapIntensity: 1.5 }));
  MATS.lens || (MATS.lens = new MeshStandardMaterial({ color: 14210240, emissive: 3814954, roughness: 0.15, metalness: 0.3 }));
  MATS.canvas || (MATS.canvas = (() => {
    const m = R.pbr("hessian_230", { repeat: [4, 3], roughness: 1 });
    m.color = new Color(9079394);
    return m;
  })());
  MATS.wood || (MATS.wood = R.pbr("weathered_planks", { repeat: [2, 0.5] }));
  MATS.hull || (MATS.hull = (() => {
    const m = R.pbr("green_metal_rust", { repeat: [3, 1], metalness: 0.3, roughness: 0.6 });
    m.color = new Color(9345686);
    m.vertexColors = true;
    return m;
  })());
  MATS.hullTop || (MATS.hullTop = (() => {
    const m = MATS.hull.clone();
    m.vertexColors = false;
    return m;
  })());
  for (const m of Object.values(MATS)) {
    m.userData.keep = true;
    for (const k of ["map", "normalMap", "roughnessMap", "aoMap"]) if (m[k]) m[k].userData.keep = true;
  }
  return { paint: MATS[key].clone(), ...MATS };
}
async function makeVehicle(kind, colour, o) {
  const M = kit(o.R, colour), g = new Group(), hit = [], wheels = [];
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0, par = g) => {
    const k = new Mesh(geo, m);
    k.position.set(x, y, z);
    k.rotation.set(rx, ry, rz);
    k.castShadow = k.receiveShadow = true;
    par.add(k);
    return k;
  };
  const rb = (w, h, d, r = 0.04, seg = 2) => new RoundedBoxGeometry(w, h, d, seg, Math.min(r, w / 2.2, h / 2.2, d / 2.2));
  const cyl = (r0, r1, h, n = 16, open = false) => new CylinderGeometry(r0, r1, h, n, 1, open);
  const proxy = (w, h, d, x, y, z) => hit.push(new Box3(V(x - w / 2, y - h / 2, z - d / 2), V(x + w / 2, y + h / 2, z + d / 2)));
  const extrudeSide = (pts, depth, bevel = 0.05) => {
    const sh = new Shape(pts.map((p) => new Vector2(p[0], p[1])));
    const ge = new ExtrudeGeometry(sh, { depth, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 2, curveSegments: 6 });
    ge.translate(0, 0, -depth / 2);
    return ge;
  };
  const wheel = (x, z, r) => {
    const hub = new Group();
    hub.position.set(x, r, z);
    g.add(hub);
    if (o.tyre) {
      const t = o.tyre.clone(true), box = new Box3().setFromObject(t), sz = box.getSize(V()), c = box.getCenter(V()), inner = new Group();
      t.position.sub(c);
      inner.add(t);
      const thin = sz.x < sz.y && sz.x < sz.z ? "x" : sz.y < sz.z ? "y" : "z";
      if (thin === "x") inner.rotation.y = Math.PI / 2;
      else if (thin === "y") inner.rotation.x = Math.PI / 2;
      const s = r * 2 / Math.max(sz.x, sz.y, sz.z), outer = new Group();
      outer.scale.set(s, s, s * 1.15);
      outer.add(inner);
      outer.traverse((k) => {
        if (k.isMesh) k.castShadow = true;
      });
      hub.add(outer);
    } else add(cyl(r, r, 0.38, 24), M.rubber, 0, 0, 0, Math.PI / 2, 0, 0, hub);
    const side = Math.sign(z) || 1;
    add(cyl(r * 0.55, r * 0.55, 0.3, 20), M.paint, 0, 0, side * 0.03, Math.PI / 2, 0, 0, hub);
    add(cyl(r * 0.2, r * 0.24, 0.12, 12), M.steel, 0, 0, side * 0.2, Math.PI / 2, 0, 0, hub);
    for (let i = 0; i < 6; i++) {
      const a = i / 6 * Math.PI * 2;
      add(cyl(0.025, 0.025, 0.06, 6), M.steel, Math.cos(a) * r * 0.36, Math.sin(a) * r * 0.36, side * 0.19, Math.PI / 2, 0, 0, hub);
    }
    wheels.push(hub);
    return hub;
  };
  if (kind === "truck") {
    const R0 = 0.52;
    for (const z of [-0.5, 0.5]) add(new BoxGeometry(6, 0.2, 0.14), M.dark, 0.1, 0.78, z);
    add(rb(0.2, 0.26, 2.36, 0.03), M.paint, 3.22, 0.82, 0);
    for (const z of [-0.7, 0.7]) add(new TorusGeometry(0.07, 0.022, 6, 12, Math.PI), M.steel, 3.36, 0.82, z, 0, Math.PI / 2, 0);
    add(extrudeSide([[0, 0], [1.42, 0], [1.42, 0.58], [1.3, 0.72], [0, 0.78]], 1.5, 0.06), M.paint, 1.72, 0.95, 0);
    for (let i = 0; i < 9; i++) add(new BoxGeometry(0.05, 0.56, 0.05), M.dark, 3.16, 1.25, -0.6 + i * 0.15);
    add(new BoxGeometry(0.04, 0.62, 1.34), M.dark, 3.13, 1.25, 0);
    for (const z of [-0.88, 0.88]) {
      add(cyl(0.12, 0.12, 0.12, 16), M.dark, 3.15, 1.38, z, 0, 0, Math.PI / 2);
      add(cyl(0.1, 0.1, 0.02, 16), M.lens, 3.22, 1.38, z, 0, 0, Math.PI / 2);
      add(new CylinderGeometry(0.64, 0.64, 0.5, 20, 1, true, Math.PI / 2, Math.PI), M.paint, 2.45, R0, z * 1.13, Math.PI / 2, 0, 0);
      add(new BoxGeometry(0.9, 0.05, 0.48), M.paint, 2.45, R0 + 0.64, z * 1.13);
    }
    const cab = add(rb(1.55, 1.35, 2.26, 0.09, 3), M.paint, 0.95, 2.02, 0);
    void cab;
    for (const z of [-0.5, 0.5]) add(new BoxGeometry(0.04, 0.62, 0.92), M.glass, 1.74, 2.3, z, 0, 0, -0.12);
    add(new BoxGeometry(0.06, 0.66, 0.06), M.paint, 1.74, 2.3, 0, 0, 0, -0.12);
    for (const z of [-1.135, 1.135]) {
      add(new BoxGeometry(0.85, 0.55, 0.03), M.glass, 0.9, 2.32, z);
      add(new BoxGeometry(0.03, 1.2, 0.02), M.dark, 0.42, 2, z * 1.005);
      add(new BoxGeometry(0.16, 0.04, 0.04), M.steel, 0.62, 1.95, z * 1.01);
      add(new BoxGeometry(0.03, 0.03, 0.4), M.steel, 1.62, 2.55, z * 1.08);
      add(new BoxGeometry(0.05, 0.3, 0.2), M.dark, 1.62, 2.55, z * 1.3);
    }
    add(cyl(0.07, 0.07, 1.4, 12), M.dark, 0.08, 2.2, 0.98);
    add(cyl(0.09, 0.07, 0.08, 12), M.dark, 0.08, 2.92, 0.98);
    add(cyl(0.25, 0.25, 1, 18), M.paint, 0.9, 0.92, -1, 0, 0, Math.PI / 2);
    add(new BoxGeometry(3.5, 0.12, 2.4), M.dark, -1.62, 1.28, 0);
    for (const z of [-1.17, 1.17]) add(new BoxGeometry(3.5, 0.55, 0.06), M.wood, -1.62, 1.6, z);
    add(new BoxGeometry(0.06, 0.55, 2.4), M.wood, -3.36, 1.6, 0);
    const tilt = add(new CylinderGeometry(1.2, 1.2, 3.5, 22, 1, true, -Math.PI / 2, Math.PI), M.canvas, -1.62, 1.85, 0, 0, 0, Math.PI / 2);
    tilt.scale.set(1, 1, 0.98);
    tilt.material = M.canvas;
    tilt.geometry.scale(1, 1, 1);
    add(new CircleGeometry(1.2, 22, 0, Math.PI), M.canvas, 0.13, 1.85, 0, 0, Math.PI / 2, 0);
    for (let i = 0; i < 4; i++) add(new TorusGeometry(1.215, 0.022, 6, 24, Math.PI), M.canvas, -3.2 + i * 1.05, 1.85, 0, 0, Math.PI / 2, 0);
    for (const z of [-1, 1]) {
      add(new BoxGeometry(0.03, 0.45, 0.4), M.rubber, -3.4, 0.62, z);
    }
    for (const z of [-1, 1]) {
      wheel(2.45, z * 1.13, R0);
      wheel(-1.05, z * 1.13, R0);
      wheel(-2.35, z * 1.13, R0);
    }
    proxy(6.6, 2.6, 2.5, 0, 1.5, 0);
  } else if (kind === "armor") {
    const R0 = 0.6;
    add(extrudeSide([[-3.3, 0.55], [2.9, 0.55], [3.45, 1.1], [2.75, 1.85], [-2.9, 1.85], [-3.4, 1.15]], 2.2, 0.08), M.paint, 0, 0, 0);
    for (const z of [-1, 1]) add(new BoxGeometry(5.5, 0.06, 0.55), M.paint, -0.1, 1.72, z * 1.18, z * 0.55, 0, 0);
    add(new BoxGeometry(5.6, 0.07, 1.8), M.paint, -0.1, 1.95, 0);
    for (const z of [-0.5, 0, 0.5]) add(new BoxGeometry(0.05, 0.1, 0.22), M.glass, 2.8, 1.82, z, 0, 0, -0.9);
    for (const z of [-0.85, 0.85]) {
      add(cyl(0.1, 0.1, 0.1, 14), M.dark, 3.3, 1.3, z, 0, 0, Math.PI / 2);
      add(cyl(0.085, 0.085, 0.02, 14), M.lens, 3.36, 1.3, z, 0, 0, Math.PI / 2);
      add(new TorusGeometry(0.13, 0.012, 4, 12), M.steel, 3.37, 1.3, z, 0, Math.PI / 2, 0);
    }
    for (const z of [-1, 1]) {
      add(new BoxGeometry(5.9, 0.08, 0.32), M.paint, 0, 1.25, z * 1.25);
      add(new BoxGeometry(0.9, 0.85, 0.04), M.dark, -0.4, 1.25, z * 1.111);
      add(new BoxGeometry(0.12, 0.05, 0.05), M.steel, -0.75, 1.3, z * 1.14);
    }
    const tur = new Group();
    tur.position.set(0.3, 1.98, 0);
    g.add(tur);
    add(cyl(0.8, 0.95, 0.45, 24), M.paint, 0, 0.22, 0, 0, 0, 0, tur);
    add(cyl(0.55, 0.8, 0.16, 24), M.paint, 0, 0.52, 0, 0, 0, 0, tur);
    add(rb(0.35, 0.36, 0.6, 0.05), M.paint, 0.88, 0.25, 0, 0, 0, 0, tur);
    add(cyl(0.07, 0.085, 2.1, 14), M.dark, 2.05, 0.27, 0, 0, 0, Math.PI / 2, tur);
    add(cyl(0.11, 0.11, 0.24, 14), M.dark, 3.1, 0.27, 0, 0, 0, Math.PI / 2, tur);
    add(cyl(0.025, 0.025, 0.8, 8), M.dark, 1.4, 0.18, 0.2, 0, 0, Math.PI / 2, tur);
    add(cyl(0.26, 0.26, 0.06, 18), M.paint, -0.2, 0.63, 0.25, 0, 0, 0, tur);
    add(new BoxGeometry(0.1, 0.09, 0.12), M.glass, 0.05, 0.64, -0.3, 0, 0, 0, tur);
    add(cyl(0.012, 6e-3, 2.6, 5), M.dark, -0.5, 1.6, -0.45, 0.12, 0, -0.08, tur);
    for (const z of [-0.6, 0.6]) add(cyl(0.3, 0.3, 0.05, 18), M.paint, -1.8, 1.99, z);
    add(rb(0.9, 0.35, 0.5, 0.04), M.paint, -2.5, 2.15, 0.6);
    add(rb(0.6, 0.3, 0.45, 0.03), M.wood, -2.4, 2.12, -0.55);
    if (o.jerrycan) for (const z of [-0.95, -0.6]) {
      const j = o.jerrycan.clone(true);
      j.position.set(-3.1, 1.3, z);
      j.rotation.y = Math.PI / 2;
      j.traverse((k) => {
        if (k.isMesh) k.castShadow = true;
      });
      g.add(j);
    }
    for (const z of [-1, 1]) for (const x of [2, 0.25, -1.9]) wheel(x, z * 1.2, R0);
    g.userData.turret = tur;
    g.userData.muzzle = new Object3D();
    g.userData.muzzle.position.set(3.25, 0.27, 0);
    tur.add(g.userData.muzzle);
    proxy(6.9, 1.7, 2.7, 0, 1.25, 0);
    proxy(2, 0.7, 1.9, 0.3, 2.3, 0);
  } else if (kind === "boat") {
    const L = 8.2, NS = 18, sections = [];
    for (let i = 0; i <= NS; i++) {
      const u = i / NS, x = -L / 2 + u * L, bowK = u > 0.62 ? (u - 0.62) / 0.38 : 0, halfB = 1.3 * (1 - Math.pow(bowK, 1.6)) + 0.02;
      const keel = -0.62 + bowK * bowK * 0.8, chine = -0.16 + bowK * 0.4, sheer = 0.55 + bowK * bowK * 0.4;
      sections.push([[x, sheer, halfB], [x, chine, halfB * 0.94], [x, keel + (1 - bowK) * 0, 0]]);
    }
    const P = [], C = [], idx = [];
    const vtx = (p, side) => {
      P.push(p[0], p[1], p[2] * side);
      const wl = p[1] < 0.02 ? p[1] < -0.05 ? 0.38 : 0.2 : 1;
      C.push(wl, wl * (p[1] < -0.05 ? 0.42 : 1), wl * (p[1] < -0.05 ? 0.4 : 1));
      return P.length / 3 - 1;
    };
    for (const side of [1, -1]) for (let i = 0; i < NS; i++) for (let j = 0; j < 2; j++) {
      const a = vtx(sections[i][j], side), b = vtx(sections[i + 1][j], side), c = vtx(sections[i + 1][j + 1], side), d = vtx(sections[i][j + 1], side);
      if (side > 0) idx.push(a, d, b, b, d, c);
      else idx.push(a, b, d, b, c, d);
    }
    for (let i = 0; i < NS; i++) {
      const a = vtx(sections[i][0], 1), b = vtx(sections[i + 1][0], 1), c = vtx(sections[i + 1][0], -1), d = vtx(sections[i][0], -1);
      idx.push(a, b, d, b, c, d);
    }
    {
      const s0 = sections[0], q = [vtx(s0[0], 1), vtx(s0[1], 1), vtx(s0[2], 1), vtx(s0[1], -1), vtx(s0[0], -1)];
      idx.push(q[0], q[2], q[1], q[0], q[4], q[2], q[4], q[3], q[2]);
    }
    const hg = new BufferGeometry();
    hg.setAttribute("position", new Float32BufferAttribute(P, 3));
    hg.setAttribute("color", new Float32BufferAttribute(C, 3));
    hg.setIndex(idx);
    hg.computeVertexNormals();
    {
      const uv = [];
      for (let i = 0; i < P.length / 3; i++) uv.push(P[i * 3] * 0.4, P[i * 3 + 1] * 0.4 + P[i * 3 + 2] * 0.2);
      hg.setAttribute("uv", new Float32BufferAttribute(uv, 2));
    }
    const hull = add(hg, M.hull, 0, 0, 0);
    hull.material.side = DoubleSide;
    add(new BoxGeometry(0.08, 0.12, 2.5), M.dark, 0, 0.6, 0, 0, 0, 0);
    add(rb(2.6, 1.15, 1.8, 0.08), M.hullTop, -0.7, 1.15, 0);
    add(new BoxGeometry(0.05, 0.45, 1.5), M.glass, 0.62, 1.38, 0, 0, 0, -0.35);
    for (const z of [-0.91, 0.91]) for (const x of [-1.5, -0.8, -0.1]) add(new BoxGeometry(0.45, 0.32, 0.02), M.glass, x, 1.38, z);
    add(new BoxGeometry(2.8, 0.06, 2), M.dark, -0.7, 1.75, 0);
    add(cyl(0.04, 0.05, 1.6, 8), M.steel, -1.2, 2.5, 0);
    const radar = new Group();
    radar.position.set(-1.2, 3.25, 0);
    g.add(radar);
    add(new BoxGeometry(0.12, 0.06, 1.1), M.dark, 0, 0, 0, 0, 0, 0, radar);
    add(cyl(0.13, 0.11, 0.2, 14), M.steel, -0.2, 1.9, 0.6, 0, 0, Math.PI / 2);
    add(cyl(0.11, 0.11, 0.02, 14), M.lens, -0.09, 1.9, 0.6, 0, 0, Math.PI / 2);
    add(cyl(0.015, 0.015, 1.4, 6), M.steel, -3.8, 1.25, 0);
    const flag = add(new PlaneGeometry(0.5, 0.32), new MeshStandardMaterial({ color: 9051160, roughness: 0.9, side: DoubleSide }), -3.55, 1.8, 0);
    add(cyl(0.09, 0.14, 0.6, 12), M.steel, 2.6, 0.95, 0);
    add(new BoxGeometry(0.06, 0.45, 0.7), M.hullTop, 2.75, 1.4, 0, 0, 0, -0.15);
    add(cyl(0.035, 0.035, 1.2, 10), M.dark, 3.15, 1.3, 0, 0, 0, Math.PI / 2);
    add(rb(0.4, 0.18, 0.18, 0.03), M.dark, 2.62, 1.3, 0);
    for (const side of [1, -1]) {
      const pts = sections.filter((_, i) => i % 2 === 0 && i > 0 && i < NS).map((s) => V(s[0][0], s[0][1] + 0.45, s[0][2] * side * 0.97));
      add(new TubeGeometry(new CatmullRomCurve3(pts), 24, 0.015, 5), M.steel, 0, 0, 0);
      for (const p of pts) add(cyl(0.012, 0.012, 0.45, 5), M.steel, p.x, p.y - 0.22, p.z);
    }
    g.userData.radar = radar;
    g.userData.flag = flag;
    g.userData.wake = true;
    g.userData.muzzle = new Object3D();
    g.userData.muzzle.position.set(3.8, 1.3, 0);
    g.add(g.userData.muzzle);
    proxy(8.2, 1.6, 2.6, 0, 0.3, 0);
    proxy(2.7, 1.3, 1.9, -0.7, 1.2, 0);
  } else if (kind === "heli") {
    const pts = [];
    for (let i = 0; i <= 16; i++) {
      const k = i / 16;
      pts.push(new Vector2(Math.max(0.02, Math.sin(Math.pow(k, 0.8) * Math.PI) * 1.05 * (1 - 0.25 * k)), k * 4.6 - 2.2));
    }
    const fus = add(new LatheGeometry(pts, 26), M.paint, 0, 0, 0, 0, 0, -Math.PI / 2);
    fus.scale.set(1, 1, 0.82);
    add(new SphereGeometry(0.86, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.glass, 1.6, 0.15, 0, 0, 0, -Math.PI / 2.4);
    for (const a of [-0.5, 0, 0.5]) add(new TorusGeometry(0.86, 0.02, 4, 16, Math.PI), M.paint, 1.6, 0.15, 0, a, Math.PI / 2, -Math.PI / 2.4);
    add(rb(1.4, 0.45, 0.9, 0.12), M.paint, -0.4, 1, 0);
    for (const z of [-0.3, 0.3]) add(cyl(0.12, 0.14, 0.35, 12), M.dark, -1.15, 1.02, z, 0, 0, Math.PI / 2 + 0.2);
    add(cyl(0.12, 0.3, 4.6, 12), M.paint, -4.3, 0.25, 0, 0, 0, Math.PI / 2 - 0.06);
    add(extrudeSide([[0, 0], [0.6, 0], [0.2, 1.3], [-0.3, 1.3]], 0.08, 0.02), M.paint, -6.4, 0.3, 0);
    add(new BoxGeometry(0.8, 0.06, 1.4), M.paint, -5.6, 0.32, 0);
    for (const z of [-0.85, 0.85]) {
      add(cyl(0.04, 0.04, 3.2, 8), M.dark, 0.2, -1.25, z, 0, 0, Math.PI / 2);
      for (const x of [-0.8, 1]) add(cyl(0.035, 0.035, 0.55, 8), M.dark, x, -1, z, 0, 0, z * 0.15);
    }
    for (const z of [-1.3, 1.3]) {
      add(rb(1.2, 0.1, 0.5, 0.03), M.paint, 0.2, -0.3, z * 0.8);
      add(cyl(0.18, 0.18, 1.2, 14), M.dark, 0.3, -0.5, z, 0, 0, Math.PI / 2);
      for (let i = 0; i < 6; i++) {
        const a = i / 6 * Math.PI * 2;
        add(cyl(0.04, 0.04, 0.02, 8), M.steel, 0.91, -0.5 + Math.sin(a) * 0.1, z + Math.cos(a) * 0.1, 0, 0, Math.PI / 2);
      }
    }
    add(cyl(0.12, 0.16, 0.5, 12), M.dark, 0, 1.3, 0);
    const rotor = new Group();
    rotor.position.set(0, 1.55, 0);
    g.add(rotor);
    add(cyl(0.22, 0.22, 0.12, 12), M.steel, 0, 0, 0, 0, 0, 0, rotor);
    for (let i = 0; i < 4; i++) {
      const arm = new Group();
      arm.rotation.y = i * Math.PI / 2;
      rotor.add(arm);
      add(new BoxGeometry(5.6, 0.035, 0.32), M.dark, 2.8, 0, 0, 0.06, 0, 0, arm);
    }
    const disc = new Mesh(new CircleGeometry(5.7, 48), new MeshBasicMaterial({ color: 1579290, transparent: true, opacity: 0.12, depthWrite: false, side: DoubleSide }));
    disc.rotation.x = -Math.PI / 2;
    disc.position.y = 1.56;
    g.add(disc);
    const tr = new Group();
    tr.position.set(-6.5, 1.25, 0.18);
    g.add(tr);
    for (let i = 0; i < 2; i++) add(new BoxGeometry(0.06, 1.3, 0.12), M.dark, 0, 0, 0, 0, 0, i * Math.PI / 2, tr);
    g.userData.rotor = rotor;
    g.userData.tail = tr;
    g.userData.muzzle = new Object3D();
    g.userData.muzzle.position.set(0.9, -0.5, 1.3);
    g.add(g.userData.muzzle);
    proxy(4.8, 2.2, 1.9, 0, -0.1, 0);
    proxy(4.4, 0.7, 0.7, -4.4, 0.4, 0);
  }
  g.userData.hit = hit;
  g.userData.wheels = wheels;
  g.userData.paint = M.paint;
  return g;
}

export {
  makeVehicle
};
