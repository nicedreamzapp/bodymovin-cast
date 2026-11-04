(function(root) {
  "use strict";
  class Euro {
    constructor(mc, b) {
      this.mc = mc;
      this.b = b;
      this.x = null;
      this.dx = 0;
    }
    static a(c, dt) {
      return 1 / (1 + 1 / (2 * Math.PI * c * dt));
    }
    f(v, dt) {
      if (this.x === null) {
        this.x = v;
        return v;
      }
      const d = (v - this.x) / dt;
      this.dx += Euro.a(1, dt) * (d - this.dx);
      this.x += Euro.a(this.mc + this.b * Math.abs(this.dx), dt) * (v - this.x);
      return this.x;
    }
    reset() {
      this.x = null;
      this.dx = 0;
    }
  }
  const K = {
    leanOn: 0.2,
    leanOff: 0.1,
    // shoulder widths off where you stand to turn (lean or a small step)
    lead: 0.015,
    // nudge the chest 15 ms ahead (breaker recipe)
    stepTh: 0.08,
    // knees must trade places by 8% of your torso to count as a step
    walkMin: 380,
    walkMax: 650,
    // keep walking this long after the last step (1.5 x your step time, clamped)
    reachOn: 0.3,
    reachRearm: 0.1,
    // a hand counts as reaching once it is 30% of a torso above its shoulder
    rising: 0.6,
    // a hand rising faster than 0.6 torsos a second keeps an ongoing climb going
    climbHold: 500,
    // each reach keeps you climbing this long
    downOn: 0.22,
    downOff: 0.14,
    // squat: hips this many torsos below where they stand
    // easy mode
    easyOn: 0.35,
    easyOff: 0.15,
    // smoothed lean (shoulder widths) to start walking / to stop
    easyTau: 0.22,
    // smoothing of that lean (s): jog sway and tracker shake average out
    easyDrift: 15,
    // a sideways STEP held this long (s) slowly becomes your new middle (you moved, not leaning)
    handOn: 0.15,
    handOff: 0.05,
    // a hand this many torsos above its shoulder is up
    handHold: 300,
    // held up this long (ms) = a climb (an arm pump or a jump's fling is shorter / tainted)
    downHold: 200
    // a squat held this long (ms) = climb down
  };
  function create(opts = {}) {
    const k = Object.assign({}, K, opts);
    const F = { cx: new Euro(2, 6), sw: new Euro(1, 0), off: new Euro(1, 0), hy: new Euro(2, 4), T: new Euro(1, 0), kd: new Euro(3, 4), uL: new Euro(3, 5), uR: new Euro(3, 5) };
    const st = {
      t: 0,
      seenAt: -1e9,
      home: null,
      hist: [],
      u: 0,
      face: 1,
      leanDir: 0,
      cxPrev: null,
      v: 0,
      calm: 0,
      k0: null,
      side: null,
      lastStep: -1e9,
      stepGap: 450,
      jumpAt: -1e9,
      jumpUsed: true,
      climbUntil: -1e9,
      uLp: null,
      uRp: null,
      standHip: null,
      down: false,
      cx: 0.5,
      swv: 0.1,
      sx: 0,
      steps: 0,
      reaches: 0,
      still: 0,
      hh: [],
      hl: [],
      jb: null,
      jfb: null,
      Tj: null,
      jOn: false,
      jumpOnset: -1e9,
      rawJumps: 0
    };
    function stepped(now) {
      const gap = now - st.lastStep;
      if (gap > 120 && gap < 1200) st.stepGap += (gap - st.stepGap) * 0.4;
      st.lastStep = now;
      st.steps++;
    }
    function reach(now) {
      st.climbUntil = now + k.climbHold;
      st.reaches++;
    }
    Object.assign(st, { ue: 0, heldFor: 0, hupAt: 0, hupBad: false, hupL: false, hupR: false, handUp: false, downSince: 0 });
    const C = { K: k, st, easy: !!opts.easy };
    C.reset = (now) => {
      for (const e of Object.values(F)) e.reset();
      Object.assign(st, { home: null, hist: [], t: 0, side: null, standHip: null, down: false, uLp: null, uRp: null, climbUntil: -1e9, lastStep: -1e9, hL: null, hR: null, hh: [], hl: [], jb: null, jfb: null, Tj: null, jOn: false });
      if (C.easy) Object.assign(st, { ue: 0, heldFor: 0, hupAt: 0, hupBad: false, hupL: false, hupR: false, handUp: false, downSince: 0, leanDir: 0 });
    };
    C.step = (now) => stepped(now);
    C.jump = (now) => {
      if (now - st.jumpAt < 500) return;
      st.jumpAt = now;
      st.jumpUsed = false;
      st.jumpOnset = onset(now);
    };
    function onset(now) {
      const Hh = st.hl;
      let t0 = now;
      for (let j = Hh.length - 1; j > 0; j--) {
        const a = Hh[j - 1], b = Hh[j];
        if ((b[1] - a[1]) / Math.max(5e-3, (b[0] - a[0]) / 1e3) / (st.Tj || 0.25) < -0.5) t0 = a[0];
        else if (t0 !== now) break;
      }
      return Math.max(t0, now - 400);
    }
    C.frame = function(I, now, ar = 0.5625) {
      if (!I || !I.lShoulder || !I.rShoulder || !I.lHip || !I.rHip) return;
      const dt = st.t ? Math.min(0.1, Math.max(1 / 120, (now - st.t) / 1e3)) : 1 / 30;
      st.t = now;
      st.seenAt = now;
      const X = (p) => p[0] * ar;
      const sy = (I.lShoulder[1] + I.rShoulder[1]) / 2, hyRaw = (I.lHip[1] + I.rHip[1]) / 2;
      const T = F.T.f(Math.max(0.03, hyRaw - sy), dt);
      const cxRaw = (X(I.lShoulder) + X(I.rShoulder)) / 2, cx = F.cx.f(cxRaw, dt), sw = F.sw.f(Math.max(0.02, Math.abs(X(I.lShoulder) - X(I.rShoulder))), dt);
      const hx = (X(I.lHip) + X(I.rHip)) / 2;
      if (st.cxPrev !== null) st.v += 0.4 * ((cx - st.cxPrev) / dt - st.v);
      st.cxPrev = cx;
      const lead = cx + Math.max(-0.05, Math.min(0.05, st.v * k.lead));
      st.hist.push([now, cx, sw, cx - hx]);
      while (st.hist.length && now - st.hist[0][0] > 500) st.hist.shift();
      if (st.home === null) {
        const H = st.hist, med = (a) => a.slice().sort((p, q) => p - q)[a.length >> 1];
        const sws = H.map((h) => h[2]), cxs = H.map((h) => h[1]), m = med(sws);
        const steady = H.length > 3 && H[H.length - 1][0] - H[0][0] >= 400 && Math.max(...cxs) - Math.min(...cxs) < 0.25 * m;
        if (steady || H.length > 120) {
          st.home = med(cxs);
          st.swv = m;
          st.k0 = med(H.map((h) => h[3]));
        }
      }
      const off = F.off.f(cx - hx, dt);
      if (st.home !== null) {
        st.swv += (Math.max(sw, 0.25 * T) - st.swv) * Math.min(1, dt / 2);
        const u = -(lead - st.home) / st.swv;
        st.u = u;
        const upright = Math.abs(off - st.k0) < 0.15 * st.swv, speed = Math.abs(st.v) / st.swv;
        st.calm = speed < 0.4 && upright ? st.calm + dt : 0;
        st.still = speed < 0.4 && now - st.lastStep > 1500 ? st.still + dt : 0;
        if (C.easy) {
          st.ue += (u - st.ue) * Math.min(1, dt / k.easyTau);
          const held = st.leanDir !== 0;
          st.heldFor = held ? st.heldFor + dt : 0;
          if (!held) {
            if (st.calm > 0.6) st.home += (cx - st.home) * (1 - Math.exp(-dt / 1.2));
            else if (st.still > 3) {
              const a = 1 - Math.exp(-dt / 1.2);
              st.home += (cx - st.home) * a;
              st.k0 += (off - st.k0) * a;
            }
          } else if (st.heldFor > k.easyDrift && upright && speed < 0.4) st.home += (cx - st.home) * (1 - Math.exp(-dt / 4));
          if (Math.abs(u) > 3) st.home = cx + Math.sign(u) * 3 * st.swv;
          const ue = st.ue;
          if (st.leanDir === 0) {
            if (ue > k.easyOn) st.leanDir = 1;
            else if (ue < -k.easyOn) st.leanDir = -1;
          } else if (st.leanDir * ue < k.easyOff) st.leanDir = 0;
          if (st.leanDir) st.face = st.leanDir;
        } else {
          if (st.calm > 0.6) st.home += (cx - st.home) * (1 - Math.exp(-dt / 1.2));
          else if (st.still > 3) {
            const a = 1 - Math.exp(-dt / 1.2);
            st.home += (cx - st.home) * a;
            st.k0 += (off - st.k0) * a;
          }
          if (Math.abs(u) > 1.2) st.home = cx + Math.sign(u) * 1.2 * st.swv;
          if (u > k.leanOn) st.leanDir = 1;
          else if (u < -k.leanOn) st.leanDir = -1;
          else if (Math.abs(u) < k.leanOff) st.leanDir = 0;
          if (st.leanDir) st.face = st.leanDir;
        }
      }
      const A = I.lKnee && I.rKnee ? [I.lKnee, I.rKnee] : I.lFoot && I.rFoot ? [I.lFoot, I.rFoot] : null;
      if (A) {
        const d = F.kd.f((A[0][1] - A[1][1]) / T, dt);
        const side = d > k.stepTh ? "L" : d < -k.stepTh ? "R" : st.side;
        if (side && side !== st.side) {
          if (st.side) stepped(now);
          st.side = side;
        }
      }
      const handU = (h, s) => h ? (s[1] - h[1]) / T : null;
      const uLr = handU(I.lHand, I.lShoulder), uRr = handU(I.rHand, I.rShoulder);
      const uL = uLr === null ? null : F.uL.f(uLr, dt), uR = uRr === null ? null : F.uR.f(uRr, dt);
      const vL = uL !== null && st.uLp !== null ? (uL - st.uLp) / dt : 0, vR = uR !== null && st.uRp !== null ? (uR - st.uRp) / dt : 0;
      st.uLp = uL;
      st.uRp = uR;
      const jumping = now - st.jumpAt < 350, both = vL > 1.2 && vR > 1.2;
      for (const [u, v, a] of [[uL, vL, "L"], [uR, vR, "R"]]) {
        if (u === null) continue;
        const H = st["h" + a] || (st["h" + a] = { armed: true, lo: u, hi: u });
        if (H.armed) {
          H.lo = jumping || both ? u : Math.min(H.lo, u);
          if (u > k.reachOn && u > H.lo + 0.25 && !jumping && !both) {
            H.armed = false;
            H.hi = u;
            reach(now);
          }
        } else {
          H.hi = Math.max(H.hi, u);
          if (u < H.hi - 0.25 || u < k.reachRearm) {
            H.armed = true;
            H.lo = u;
          }
        }
        if (v > k.rising && u > -0.3 && !jumping && !both && now < st.climbUntil + 150) st.climbUntil = Math.max(st.climbUntil, now + 200);
      }
      {
        st.hupL = uL !== null && uL > (st.hupL ? k.handOff : k.handOn);
        st.hupR = uR !== null && uR > (st.hupR ? k.handOff : k.handOn);
        const any = st.hupL || st.hupR;
        if (!any) {
          st.hupAt = 0;
          st.hupBad = false;
        } else {
          if (!st.hupAt) st.hupAt = now;
          if (both || now - st.jumpAt < 450 || st.jOn) st.hupBad = true;
        }
        st.handUp = any && !st.hupBad && now - st.hupAt >= k.handHold;
      }
      {
        const v = I.vis || {}, feet = I.lFoot && I.rFoot && I.lFoot[1] < 0.985 && I.rFoot[1] < 0.985;
        const fy = feet ? Math.max(I.lFoot[1], I.rFoot[1]) : null, Tn = Math.max(0.03, hyRaw - sy);
        if (st.jb === null) {
          st.jb = hyRaw;
          st.Tj = Tn;
          st.jfb = fy;
        }
        st.hh.push([now, hyRaw, sy, fy]);
        while (st.hh.length > 2 && now - st.hh[1][0] >= 80) st.hh.shift();
        st.hl.push([now, hyRaw]);
        while (st.hl.length && now - st.hl[0][0] > 600) st.hl.shift();
        const h0 = st.hh[0], d = Math.max(0.02, (now - h0[0]) / 1e3);
        const vh = (hyRaw - h0[1]) / d / st.Tj, vs = (sy - h0[2]) / d / st.Tj, up = (st.jb - hyRaw) / st.Tj, fup = fy !== null && st.jfb !== null ? (st.jfb - fy) / st.Tj : null;
        if (!st.jOn) {
          if (up > 0.07 && vh < -1 && vs < -0.7 && (fup === null ? up > 0.15 : fup > 0.03)) {
            st.jOn = true;
            st.rawJumps++;
            if (now - st.jumpAt > 500) {
              st.jumpAt = now;
              st.jumpUsed = false;
              st.jumpOnset = onset(now);
            }
          } else {
            st.jb += (hyRaw - st.jb) * (Math.abs(vh) < 0.6 ? 0.06 : 5e-3);
            st.Tj += (Tn - st.Tj) * 0.03;
            if (fy !== null) st.jfb = st.jfb === null ? fy : st.jfb + (fy - st.jfb) * (fy > st.jfb ? 0.3 : 0.03);
          }
        } else if (up < 0.05 || now - st.jumpAt > 1200) st.jOn = false;
      }
      const hy = F.hy.f(hyRaw, dt);
      if (st.standHip === null) st.standHip = hy;
      const drop = (hy - st.standHip) / T;
      if (Math.abs(drop) < 0.08 && now - st.jumpAt > 600) st.standHip += (hy - st.standHip) * Math.min(1, dt * 1.5);
      else if (drop < 0 && now - st.jumpAt > 600) st.standHip += (hy - st.standHip) * Math.min(1, dt * 0.5);
      if (!st.down && drop > k.downOn) st.down = true;
      else if (st.down && drop < k.downOff) st.down = false;
      st.drop = drop;
    };
    C.read = function(now, extra = {}) {
      const seen = now - st.seenAt < 700;
      const walkHold = Math.max(k.walkMin, Math.min(k.walkMax, st.stepGap * 1.5));
      const walk = seen && now - st.lastStep < walkHold;
      const jump = !st.jumpUsed && now - st.jumpAt < 200;
      if (jump) st.jumpUsed = true;
      const down = seen && (st.down || (extra.crouch || 0) > 0.45);
      if (C.easy) {
        if (!down) st.downSince = 0;
        else if (!st.downSince) st.downSince = now;
        const walk2 = seen && st.leanDir !== 0, dn = down && now - st.downSince >= k.downHold;
        if (now - st.jumpAt < 450) st.hupBad = st.hupBad || st.hupAt > 0;
        const hu = seen && st.handUp && !st.hupBad && !dn;
        return { walk: walk2, dir: walk2 ? st.leanDir : 0, face: st.face, lean: st.u, leanDir: st.leanDir, up: hu, handUp: hu, down: dn, jump, jumpAge: jump ? now - st.jumpOnset : 0, seen, easy: true };
      }
      const up = seen && now < st.climbUntil && !down;
      return { walk, dir: walk ? st.face : 0, face: st.face, lean: st.u, leanDir: st.leanDir, up, down, jump, jumpAge: jump ? now - st.jumpOnset : 0, seen };
    };
    return C;
  }
  const API = { create, K };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else root.GKControls = API;
})(typeof window !== "undefined" ? window : globalThis);
