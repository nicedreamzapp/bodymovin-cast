(function(root) {
  "use strict";
  const AIM = {
    RX: 0.4,
    RY: 0.3,
    CX: 0.5,
    CY: 0.42,
    SX: 0.5,
    SY: 0.34,
    DZ: 0.012,
    JOIN: 0.55,
    OUT: 0.7,
    UP: 0.62,
    DOWN: 0.82,
    J_ENTER: 0.1,
    J_LEAVE: 0.16,
    VIS_LOW: 0.35,
    VIS_OK: 0.5
  };
  const DEFC = { x: 0, y: 0.13 };
  const EASY = { IN: 0.1, RX: 0.25, RY: 0.19, UP: 0.62, DOWN: 0.82, MINCUT: 0.5, BETA: 1.2, DZ: 0.014, JOIN0: 0.45, JOIN1: 0.75 };
  const DEFE = { x: 0, y: 0.18 };
  const ss = (a, b, v) => {
    const k = clamp((v - a) / (b - a), 0, 1);
    return k * k * (3 - 2 * k);
  };
  const GREN = { overWin: 0.6, overHead: -0.4, drop: 0.5, vertK: 1.2, both: 0.8, vmax: 4, arm2d: -1, win: 0.15, cool: 1, gripMem: 0.4, warm: 0.5, held: 0.35 };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  class Euro1 {
    constructor(minCut, beta) {
      this.mc = minCut;
      this.b = beta;
      this.x = null;
      this.dx = 0;
    }
    static a(c, dt) {
      const tau = 1 / (2 * Math.PI * c);
      return 1 / (1 + tau / dt);
    }
    f(v, dt) {
      if (this.x === null) {
        this.x = v;
        return v;
      }
      const d = (v - this.x) / dt;
      this.dx += Euro1.a(1, dt) * (d - this.dx);
      this.x += Euro1.a(this.mc + this.b * Math.abs(this.dx), dt) * (v - this.x);
      return this.x;
    }
  }
  const median = (a) => {
    const s = a.slice().sort((p, q) => p - q);
    return s[s.length >> 1];
  };
  function create(opts) {
    const st = {
      easy: !!(opts && opts.easy),
      ex: 0.5,
      ey: 0.42,
      eUp: false,
      eHand: null,
      eRaw: null,
      ce: null,
      ehx: 0,
      ehy: 0,
      eat: -1e9,
      ekl: null,
      eoff: [0, 0],
      efx: new Euro1(EASY.MINCUT, EASY.BETA),
      efy: new Euro1(EASY.MINCUT, EASY.BETA),
      espeed: 0,
      upA: false,
      seen: false,
      joined: false,
      up: false,
      firing: false,
      x: 0.5,
      y: 0.42,
      grenadeAt: 0,
      rawMid: null,
      speed: 0,
      T: 0,
      jt: 0,
      lostT: 0,
      off: null,
      fx: new Euro1(1.6, 3),
      fy: new Euro1(1.6, 3),
      hx: 0,
      hy: 0,
      at: 0,
      c: null,
      hold: 0,
      buf: [],
      lastJoinT: -9,
      frames: [],
      grenades: 0
    };
    function aimFrom(I, vis, dt, now, fresh = true) {
      var _a, _b;
      dt = clamp(dt, 1 / 240, 0.1);
      if (!fresh || !I || !I.lShoulder || !I.rShoulder || !I.lHip || !I.rHip || !I.lHand || !I.rHand) {
        st.seen = false;
        st.joined = false;
        st.up = false;
        st.upA = false;
        st.eUp = false;
        st.firing = false;
        st.rawMid = null;
        st.eRaw = null;
        return st;
      }
      st.seen = true;
      const cx = (I.lShoulder[0] + I.rShoulder[0]) / 2, cy = (I.lShoulder[1] + I.rShoulder[1]) / 2, hx = (I.lHip[0] + I.rHip[0]) / 2, hy = (I.lHip[1] + I.rHip[1]) / 2;
      const T0 = Math.max(0.05, Math.hypot(cx - hx, cy - hy));
      st.T = st.T ? st.T + (T0 - st.T) * (1 - Math.exp(-dt / 0.8)) : T0;
      const T = st.T, L = [-(I.lHand[0] - cx) / T, (I.lHand[1] - cy) / T], R = [-(I.rHand[0] - cx) / T, (I.rHand[1] - cy) / T];
      const v = vis || {}, vl = (_a = v.lHand) != null ? _a : 1, vr = (_b = v.rHand) != null ? _b : 1, gap = Math.hypot(L[0] - R[0], L[1] - R[1]);
      const oneLost = vl < AIM.VIS_LOW !== vr < AIM.VIS_LOW;
      st.lostT = oneLost ? st.lostT + dt : 0;
      const want = st.joined ? gap < AIM.OUT || oneLost && st.lostT < 0.8 : gap < AIM.JOIN;
      st.jt = want !== st.joined ? st.jt + dt : 0;
      if (st.jt >= (st.joined ? AIM.J_LEAVE : AIM.J_ENTER)) {
        st.joined = want;
        st.jt = 0;
      }
      let mid = [(L[0] + R[0]) / 2, (L[1] + R[1]) / 2];
      if (vl >= AIM.VIS_OK && vr >= AIM.VIS_OK) st.off = { l: [mid[0] - L[0], mid[1] - L[1]], r: [mid[0] - R[0], mid[1] - R[1]] };
      else if (st.joined && oneLost && st.off) {
        const [h, o] = vl < AIM.VIS_LOW ? [R, st.off.r] : [L, st.off.l];
        mid = [h[0] + o[0], h[1] + o[1]];
      }
      if (now - st.at > 400) {
        st.fx.x = null;
        st.fy.x = null;
        st.hx = mid[0];
        st.hy = mid[1];
      }
      st.at = now;
      const fx = st.fx.f(mid[0], dt), fy = st.fy.f(mid[1], dt);
      const ddx = fx - st.hx, ddy = fy - st.hy, dd = Math.hypot(ddx, ddy);
      if (dd > AIM.DZ) {
        const k = (dd - AIM.DZ) / dd;
        st.hx += ddx * k;
        st.hy += ddy * k;
      }
      st.rawMid = mid;
      st.speed = Math.hypot(st.fx.dx, st.fy.dx);
      st.upA = st.upA ? fy < AIM.DOWN : fy < AIM.UP;
      st.up = st.upA;
      const c = st.c || DEFC;
      st.x = clamp(AIM.CX + (st.hx - c.x) / AIM.RX * AIM.SX, 0.01, 0.99);
      st.y = clamp(AIM.CY + (st.hy - c.y) / AIM.RY * AIM.SY, 0.02, 0.98);
      st.firing = st.joined && st.up;
      if (st.joined) st.lastJoinT = now / 1e3;
      if (st.firing) {
        if (st.gripSince == null) st.gripSince = now / 1e3;
      } else if (now / 1e3 - st.lastJoinT > GREN.gripMem) st.gripSince = null;
      if (st.easy) easyAim(I, L, R, cx, cy, T, vl, vr, gap, dt, now);
      return st;
    }
    function easyAim(I, L, R, cx, cy, T, vl, vr, gap, dt, now) {
      const s0 = [-(I.lShoulder[0] - cx) / T, (I.lShoulder[1] - cy) / T], ks = st.esl ? 1 - Math.exp(-dt / 0.5) : 1;
      st.esl = st.esl ? [st.esl[0] + (s0[0] - st.esl[0]) * ks, st.esl[1] + (s0[1] - st.esl[1]) * ks] : s0;
      const sl = st.esl;
      const inX = Math.sign(sl[0]) * EASY.IN;
      const aL = [L[0] - sl[0] + inX, L[1] - sl[1]], aR = [R[0] + sl[0] - inX, R[1] + sl[1]];
      const ymin = Math.min(aL[1], aR[1]);
      const wOf = (a, v) => ss(EASY.DOWN + 0.13, EASY.UP - 0.07, a[1]) * (0.3 + 0.7 * ss(0.1, 0.5, v)) * Math.exp(-8 * (a[1] - ymin));
      let wl = wOf(aL, vl), wr = wOf(aR, vr);
      const top = Math.min(aL[1], aR[1]);
      st.eUp = st.eUp ? top < EASY.DOWN && wl + wr > 0.02 : top < EASY.UP && wl + wr > 0.05;
      if (wl + wr < 1e-4) {
        wl = wr = 1;
      }
      const wj = ss(EASY.JOIN1, EASY.JOIN0, gap);
      const kl = wj * 0.5 + (1 - wj) * wl / (wl + wr);
      const p = [aL[0] * kl + aR[0] * (1 - kl), aL[1] * kl + aR[1] * (1 - kl)];
      if (st.ekl != null && now - st.eat <= 400) {
        const k0 = st.ekl;
        st.eoff[0] += p[0] - (aL[0] * k0 + aR[0] * (1 - k0));
        st.eoff[1] += p[1] - (aL[1] * k0 + aR[1] * (1 - k0));
      } else st.eoff = [0, 0];
      const dk = Math.exp(-dt / 0.45);
      st.eoff[0] *= dk;
      st.eoff[1] *= dk;
      st.ekl = kl;
      p[0] -= st.eoff[0];
      p[1] -= st.eoff[1];
      st.eHand = wj > 0.5 ? "both" : kl > 0.5 ? "l" : "r";
      st.eRaw = p;
      if (now - st.eat > 400) {
        st.efx.x = null;
        st.efy.x = null;
        st.ehx = p[0];
        st.ehy = p[1];
      }
      st.eat = now;
      const fx = st.efx.f(p[0], dt), fy = st.efy.f(p[1], dt);
      const ddx = fx - st.ehx, ddy = fy - st.ehy, dd = Math.hypot(ddx, ddy);
      if (dd > EASY.DZ) {
        const k = (dd - EASY.DZ) / dd;
        st.ehx += ddx * k;
        st.ehy += ddy * k;
      }
      st.espeed = Math.hypot(st.efx.dx, st.efy.dx);
      const c = st.ce || DEFE;
      st.x = st.ex = clamp(AIM.CX + (st.ehx - c.x) / EASY.RX * AIM.SX, 0.01, 0.99);
      st.y = st.ey = clamp(AIM.CY + (st.ehy - c.y) / EASY.RY * AIM.SY, 0.02, 0.98);
      st.up = st.eUp;
      st.firing = false;
    }
    function ready(dt) {
      if (st.easy) return readyEasy(dt);
      const ok = st.seen && st.joined && st.up && st.speed < 0.6 && st.rawMid && Math.abs(st.rawMid[0]) < 0.7 && st.rawMid[1] > -0.4 && st.rawMid[1] < 0.45;
      if (ok) {
        st.hold += dt;
        st.buf.push(st.rawMid.slice());
        if (st.buf.length > 40) st.buf.shift();
      } else {
        st.hold = Math.max(0, st.hold - dt * 1.5);
        if (!st.hold) st.buf.length = 0;
      }
      if (st.hold >= 1 && st.buf.length >= 4) {
        st.c = { x: median(st.buf.map((b) => b[0])), y: median(st.buf.map((b) => b[1])) };
        st.hold = 0;
        st.buf.length = 0;
        st.fx.x = null;
        st.fy.x = null;
        return true;
      }
      return false;
    }
    function readyEasy(dt) {
      const ok = st.seen && st.eUp && st.espeed < 0.6 && st.eRaw && Math.abs(st.eRaw[0]) < 0.5 && st.eRaw[1] > -0.4 && st.eRaw[1] < 0.5;
      if (ok) {
        st.hold += dt;
        st.buf.push(st.eRaw.slice());
        if (st.buf.length > 40) st.buf.shift();
      } else {
        st.hold = Math.max(0, st.hold - dt * 1.5);
        if (!st.hold) st.buf.length = 0;
      }
      if (st.hold >= 1 && st.buf.length >= 4) {
        st.ce = { x: clamp(median(st.buf.map((b) => b[0])), -0.2, 0.2), y: median(st.buf.map((b) => b[1])) };
        st.hold = 0;
        st.buf.length = 0;
        st.efx.x = null;
        st.efy.x = null;
        return true;
      }
      return false;
    }
    function frame(I, J, vis, ar, t) {
      if (!I || !J || !J.root || !J.lHand || !J.rHand || !I.lShoulder || !I.rShoulder || !I.lHip || !I.rHip || !I.lHand || !I.rHand) {
        st.frames.length = 0;
        return false;
      }
      ar = ar || 0.5625;
      const P = (k) => [I[k][0] * ar, I[k][1]];
      const ls = P("lShoulder"), rs = P("rShoulder"), lh = P("lHand"), rh = P("rHand"), lhip = P("lHip"), rhip = P("rHip");
      const T = Math.max(0.05, Math.hypot((ls[0] + rs[0]) / 2 - (lhip[0] + rhip[0]) / 2, (ls[1] + rs[1]) / 2 - (lhip[1] + rhip[1]) / 2));
      const arm = (Math.hypot(lh[0] - ls[0], lh[1] - ls[1]) + Math.hypot(rh[0] - rs[0], rh[1] - rs[1])) / 2 / T;
      const r = J.root, n = Math.hypot(r[0], r[1], r[2]) || 1, f = [-r[0] / n, -r[1] / n, -r[2] / n];
      const dep = (h) => (h[0] - r[0]) * f[0] + (h[1] - r[1]) * f[1] + (h[2] - r[2]) * f[2];
      const hy = ((lh[1] + rh[1]) / 2 - (ls[1] + rs[1]) / 2) / T;
      const h3 = (J.lHand[1] + J.rHand[1]) / 2 - (J.lShoulder && J.rShoulder ? (J.lShoulder[1] + J.rShoulder[1]) / 2 : r[1]);
      const F = st.frames;
      F.push({ t, dl: dep(J.lHand), dr: dep(J.rHand), arm, hy, h3 });
      while (F.length > 40 || F.length && t - F[0].t > 1.5) F.shift();
      if (F.length < 7) return false;
      const smooth = (i, k) => median(F.slice(Math.max(0, i - 2), Math.min(F.length, i + 3)).map((e) => e[k]));
      const i1 = F.length - 3;
      let i0 = i1;
      while (i0 > 0 && F[i1].t - F[i0].t < GREN.win) i0--;
      const dtw = F[i1].t - F[i0].t;
      if (dtw < 0.06) return false;
      const vl = (smooth(i1, "dl") - smooth(i0, "dl")) / dtw, vr = (smooth(i1, "dr") - smooth(i0, "dr")) / dtw, va = (smooth(i1, "arm") - smooth(i0, "arm")) / dtw;
      const vy = (smooth(i1, "h3") - smooth(i0, "h3")) / dtw;
      let top = 9;
      for (const e of F) if (t - e.t <= GREN.overWin) top = Math.min(top, e.hy);
      const hyNow = smooth(F.length - 1, "hy");
      st.thrust = { vl, vr, va, vy, top, hy: hyNow };
      if (!st.t0) st.t0 = t;
      const gripped = (st.joined || t - st.lastJoinT < GREN.gripMem) && st.gripSince != null && t - GREN.win - st.gripSince >= GREN.held;
      const push = top > GREN.overHead && vy > -GREN.drop && Math.abs(vy) < GREN.vertK * Math.min(vl, vr);
      if (t - st.t0 > GREN.warm && gripped && push && Math.min(vl, vr) > GREN.both && Math.max(vl, vr) < GREN.vmax && va < GREN.arm2d && t - (st.grenadeT || -9) > GREN.cool) {
        st.grenadeT = t;
        st.grenades++;
        st.grenadeAt = t;
        return true;
      }
      return false;
    }
    return {
      state: st,
      aimFrom,
      ready,
      frame,
      calibrate() {
        st.hold = 0;
        st.buf.length = 0;
      },
      setCentre(c) {
        if (st.easy) st.ce = c;
        else st.c = c;
      },
      setEasy(on) {
        st.easy = !!on;
        st.hold = 0;
        st.buf.length = 0;
        st.eUp = false;
        st.eat = -1e9;
        st.ekl = null;
      },
      AIM,
      GREN,
      EASY
    };
  }
  const API = { create, AIM, DEFC, DEFE, GREN, EASY };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else root.WSGrip = API;
})(typeof window !== "undefined" ? window : globalThis);
