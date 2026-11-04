import {
  create
} from "./_lg/chunk-6IMGWI3W.js";
import {
  STANCES
} from "./_lg/chunk-QDPXG5OX.js";
import {
  OUTFITS,
  ankleHeight,
  loadBody,
  makePerson
} from "./_lg/chunk-WYC6O5BF.js";
import "./_lg/chunk-2BP775VP.js";
import "./_lg/chunk-CPYHHAA5.js";
import "./_lg/chunk-GEQJXPAR.js";
import {
  OrthographicCamera,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer
} from "./_lg/chunk-4IYDSAYK.js";
import "./_lg/chunk-NWIHTO7D.js";

// dist/realself.js
var V = (x = 0, y = 0, z = 0) => new Vector3(x, y, z);
var ang2 = (a, b, c) => {
  const u = [a[0] - b[0], a[1] - b[1]], w = [c[0] - b[0], c[1] - b[1]];
  return Math.acos(Math.max(-1, Math.min(1, (u[0] * w[0] + u[1] * w[1]) / (Math.hypot(...u) * Math.hypot(...w) || 1))));
};
var SIZE_BY_HEIGHT = true;
function figureJoints(p, Bd, J3, MIR) {
  var _a, _b;
  const P = (q, z = 0) => q && V(q[0], -q[1], z);
  const ankH = (_a = p._ankH) != null ? _a : p._ankH = 0.09;
  let kpx = Bd.t / p.T0;
  if (Bd.legs && Bd.lA && Bd.rA && Bd.head && SIZE_BY_HEIGHT) {
    const h2 = Math.max(Bd.lA[1], Bd.rA[1]) - (Bd.head[1] - 0.13 * Bd.t), hr = p.height - ankH;
    if (h2 > 0.5 * hr * kpx * 0.5) kpx = h2 / hr;
  }
  let tm = 0.5;
  if (J3 && J3.lShoulder && J3.rShoulder && J3.lHip && J3.rHip) {
    const c = J3.lShoulder.map((x, i) => (x + J3.rShoulder[i]) / 2), h = J3.lHip.map((x, i) => (x + J3.rHip[i]) / 2);
    tm = Math.max(0.35, Math.min(0.65, Math.hypot(c[0] - h[0], c[1] - h[1], c[2] - h[2])));
  }
  const ppm = Bd.t / tm;
  const shZ = J3 && J3.lShoulder && J3.rShoulder ? (J3.lShoulder[2] + J3.rShoulder[2]) / 2 : 0;
  const DS = MIR ? 1 : -1;
  const dz = (k) => (J3 && J3[k] ? Math.max(-0.25, Math.min(0.6, J3[k][2] - shZ)) : 0) * ppm * DS;
  const L = (s) => MIR ? s === "l" ? "r" : "l" : s;
  const J = {};
  J[L("l") + "Shoulder"] = P(Bd.lS);
  J[L("r") + "Shoulder"] = P(Bd.rS);
  J[L("l") + "Hip"] = P(Bd.lH);
  J[L("r") + "Hip"] = P(Bd.rH);
  J.head = P(Bd.head);
  for (const s of ["l", "r"]) {
    const d = L(s), side = s === "l" ? "lHand" : "rHand", sideE = s === "l" ? "lForearm" : "rForearm";
    J[d + "Elbow"] = P(Bd[s + "E"], dz(sideE) * 0.6);
    J[d + "Wrist"] = P(Bd[s + "W"], dz(side) * 0.9);
    J[d + "Grip"] = P(Bd[s + "P"], dz(side));
    J[d + "GripLen"] = 0.075;
    {
      const reach = (p.restLen[d].up + p.restLen[d].fore + 0.075) * kpx * 0.985, S = J[d + "Shoulder"], G = J[d + "Grip"];
      const d2 = Math.hypot(G.x - S.x, G.y - S.y), zmax = Math.sqrt(Math.max(0, reach * reach - d2 * d2));
      G.z = Math.max(-zmax, Math.min(zmax, G.z));
    }
    const mid = J[d + "Shoulder"].clone().lerp(J[d + "Grip"], 0.5), pole = J[d + "Elbow"].clone().sub(mid);
    if (pole.lengthSq() > 1) J[d + "PoleDir"] = pole.normalize();
    J[d + "Knee"] = P(Bd[s + "K"]);
    J[d + "Ankle"] = P(Bd[s + "A"]);
  }
  {
    const shM = J.lShoulder.clone().add(J.rShoulder).multiplyScalar(0.5), hpM = J.lHip.clone().add(J.rHip).multiplyScalar(0.5), up = shM.clone().sub(hpM).normalize();
    const f = V().crossVectors(J.lShoulder.clone().sub(J.rShoulder).normalize(), up).normalize(), Lh = J.head.distanceTo(shM);
    J.head.addScaledVector(f, Lh * (((_b = p.neckTilt) != null ? _b : 0) + 0.08));
    J.nose = J.head.clone().addScaledVector(f, 0.1 * ppm).addScaledVector(up, -0.025 * ppm);
  }
  for (const s of ["l", "r"]) {
    const d = L(s), H2 = J[d + "Hip"], K = J[d + "Knee"], A = J[d + "Ankle"];
    if (!H2 || !K || !A) continue;
    if (ang2(Bd[s + "H"], Bd[s + "K"], Bd[s + "A"]) > 2.8) {
      const l1 = H2.distanceTo(K), l2 = K.distanceTo(A);
      K.copy(H2).lerp(A, l1 / (l1 + l2 || 1));
    }
  }
  if (Bd.legs) {
    const rigAnk = (d) => {
      const H = J[d + "Hip"], K = J[d + "Knee"], A = J[d + "Ankle"];
      if (!H || !K || !A) return null;
      return H.clone().addScaledVector(K.clone().sub(H).normalize(), p.restLen[d].thigh * kpx).addScaledVector(A.clone().sub(K).normalize(), p.restLen[d].calf * kpx);
    };
    const la = rigAnk("l"), ra = rigAnk("r");
    if (la && ra) {
      const want = Math.min(J.lAnkle.y, J.rAnkle.y), dy = want - Math.min(la.y, ra.y);
      for (const k in J) if (J[k] && J[k].isVector3 && !/Dir$|Grip$/.test(k)) J[k].y += dy;
    }
  }
  J._kpx = kpx;
  return J;
}
var PLAIN_OVERLAY = { fillA: 0.035, rimA: 0.1 };
function create2(BP, opt) {
  const cfg = BP.realSelf || {}, MIR = cfg.view === "mirror";
  const cv = document.createElement("canvas");
  cv.id = "bp-self3d";
  cv.style.cssText = "position:fixed;top:0;right:0;bottom:0;left:0;width:100%;height:100%;pointer-events:none;z-index:8";
  document.body.appendChild(cv);
  let renderer;
  const TV = !!window.BP_TV;
  try {
    renderer = new WebGLRenderer({ canvas: cv, alpha: true, antialias: !TV, premultipliedAlpha: true });
  } catch (e) {
    cv.remove();
    return null;
  }
  renderer.setClearColor(0, 0);
  const scene = new Scene(), cam = new OrthographicCamera(0, 1, 0, -1, 0.1, 2e4);
  cam.position.set(0, 0, 5e3);
  cam.lookAt(0, 0, 0);
  const st = { person: null, failed: false, ghost: null, playSince: 0, mode: null, fade: null };
  const outfit = cfg.outfit || "casual", base = opt.base || "./assets/people/";
  loadBody(base + (TV ? OUTFITS[outfit].url0 : OUTFITS[outfit].url)).then((t) => {
    const p = makePerson(t, { look: "glass", outfit, lod: TV ? 1 : 0, shadow: false, plainLook: PLAIN_OVERLAY });
    p.root.rotation.y = MIR ? 0 : Math.PI;
    scene.add(p.root);
    p.opacity = 0;
    st.person = p;
    p.grip("l", "relaxed");
    p.grip("r", "relaxed");
    p.root.updateMatrixWorld(true);
    st.ankH = p._ankH = ankleHeight(p);
    p.root.traverse((m) => {
      if (m.isMesh && m.material && m.material.uniforms && m.material.uniforms.uOpacity) {
        const mat = m.material;
        if (mat.userData.fadeOK) return;
        mat.userData.fadeOK = true;
        mat.uniforms.uFadeY = st.fade || (st.fade = { value: new Vector2(-1e9, -1e9 + 1) });
        delete mat.onBeforeCompile;
        mat.fragmentShader = mat.fragmentShader.replace("uniform float uGhost;", "uniform float uGhost; uniform vec2 uFadeY;").replace("gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));", "a *= smoothstep(uFadeY.x, uFadeY.y, vY); gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));");
        mat.needsUpdate = true;
      }
    });
    if (cfg.ghost && STANCES[cfg.ghost]) {
      st.ghost = create(Object.assign({ scene, BP, you: { person: p }, outfit, url: base + (TV ? OUTFITS[outfit].url0 : OUTFITS[outfit].url), floorY: () => {
        var _a;
        return (_a = st.floorY) != null ? _a : 0;
      } }, STANCES[cfg.ghost]));
    }
  }).catch(() => {
    st.failed = true;
  });
  function draw(Bd, o) {
    var _a;
    const p = st.person;
    if (!p || st.failed) return false;
    const W = o.W, H = o.H;
    if (renderer.domElement.width !== W || renderer.domElement.height !== H) {
      renderer.setPixelRatio(1);
      renderer.setSize(W / (o.dpr || 1), H / (o.dpr || 1), false);
      renderer.setPixelRatio(o.dpr || 1);
    }
    cam.left = 0;
    cam.right = W;
    cam.top = 0;
    cam.bottom = -H;
    cam.updateProjectionMatrix();
    const J = figureJoints(p, Bd, BP.rawJ && performance.now() - (BP.rawJAt || 0) < 300 ? BP.rawJ : BP.joints, MIR);
    p.root.scale.setScalar(J._kpx);
    delete J._kpx;
    p.opacity = Math.min(1, o.alpha * 3.3);
    p.root.position.set(0, 0, 0);
    p.root.updateMatrixWorld(true);
    p.pose(J);
    const hipY = Math.min(J.lHip.y, J.rHip.y);
    if (st.fade) st.fade.value.set(Bd.legs ? -1e9 : hipY - 0.75 * Bd.t, Bd.legs ? -1e9 + 1 : hipY);
    st.floorY = Math.min(J.lAnkle ? J.lAnkle.y : hipY, J.rAnkle ? J.rAnkle.y : hipY) - ((_a = st.ankH) != null ? _a : 0.09) * p.root.scale.x;
    const now = performance.now(), mode = BP._mode || "play";
    if (mode !== st.mode) {
      st.mode = mode;
      if (mode === "play") st.playSince = now;
    }
    if (st.ghost) st.ghost.update(now, cfg.ghostWhen ? !!cfg.ghostWhen() : mode === "play" && now - st.playSince < 6e3 && BP.live && !BP.mouse);
    renderer.render(scene, cam);
    st.drawn = true;
    return true;
  }
  return {
    st,
    renderer,
    scene,
    cam,
    draw,
    hide() {
      if (st.drawn) {
        renderer.clear();
        st.drawn = false;
      }
    }
  };
}
export {
  SIZE_BY_HEIGHT,
  create2 as create,
  figureJoints
};
