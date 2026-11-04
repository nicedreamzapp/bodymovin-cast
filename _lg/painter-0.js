import {
  environment,
  render,
  setup,
  state
} from "./chunk-5EPBUA75.js";
import "./chunk-CPYHHAA5.js";
import "./chunk-GEQJXPAR.js";
import "./chunk-UBB4M7UR.js";
import {
  AdditiveBlending,
  CanvasTexture,
  LinearFilter,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  SRGBColorSpace
} from "./chunk-4IYDSAYK.js";
import "./chunk-NWIHTO7D.js";

// bmpage:bmpage:painter.html#0
(async () => {
  var _a, _b, _c;
  const Q = new URLSearchParams(location.search);
  const ENV = "rogland_clear_night", ROT = +((_a = Q.get("rot")) != null ? _a : 1.572), PITCH = +((_b = Q.get("pitch")) != null ? _b : 0.45), GAIN = +((_c = Q.get("gain")) != null ? _c : 1.35), FOV = 55;
  const { scene, camera, renderer } = setup(document.getElementById("gl"), { fov: FOV, far: 1200 });
  window.__sky = { ready: false };
  camera.rotation.order = "YXZ";
  camera.position.set(0, 1.6, 0);
  scene.add(camera);
  const tex = new CanvasTexture(window.__glow);
  tex.colorSpace = SRGBColorSpace;
  tex.minFilter = LinearFilter;
  tex.generateMipmaps = false;
  const plane = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ map: tex, transparent: true, blending: AdditiveBlending, depthWrite: false, depthTest: false, toneMapped: false }));
  plane.material.color.setScalar(GAIN);
  plane.renderOrder = 10;
  camera.add(plane);
  function fit() {
    const d = 5, h = 2 * d * Math.tan(MathUtils.degToRad(camera.fov) / 2);
    plane.position.set(0, 0, -d);
    plane.scale.set(h * camera.aspect, h, 1);
  }
  addEventListener("resize", () => setTimeout(fit, 0));
  fit();
  let last = 0;
  function loop(now) {
    const dt = Math.min(0.05, (now - (last || now)) / 1e3) || 1 / 60;
    last = now;
    const t = now / 1e3;
    camera.rotation.set(PITCH + Math.sin(t * 0.07) * 4e-3, Math.sin(t * 0.05) * 6e-3, 0);
    if (window.__glow.width !== tex.image.width || window.__glow.height !== tex.image.height) {
      tex.dispose();
    }
    tex.needsUpdate = true;
    fit();
    render(dt);
    const q = state().quality;
    window.__sky = { ready: true, tier: q.tier, fps: Math.round(q.fps) };
    requestAnimationFrame(loop);
  }
  window.__snapshot = () => {
    tex.needsUpdate = true;
    render(0);
    return renderer.domElement;
  };
  state().grace(6e3);
  await environment(scene, renderer, ENV, { background: true, exact: true, intensity: 1, rotation: ROT });
  requestAnimationFrame(loop);
})().catch((e) => setTimeout(() => {
  throw e;
}));
