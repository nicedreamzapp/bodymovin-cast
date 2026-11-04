(function(root) {
  "use strict";
  const SW = 224, SH = 256;
  const T = {
    heroWalk: 0.84,
    heroClimb: 0.5,
    jumpV: -1.72,
    grav: 0.105,
    maxFall: 3.2,
    // jump: ~14 px high, ~33 frames in the air
    jumpCatchMax: 9,
    // inp.jumpAge: a body jump read late by the camera starts that many frames into the same arc (max 150 ms)
    fallDie: 20,
    // a drop of more than 20 px (any fall off a girder end) is fatal
    brokenRise: 9,
    // how far up a broken ladder's stub you can climb (a dodge spot)
    barrelRoll: 1.2,
    barrelLadder: 0.9,
    barrelGrav: 0.12,
    fireWalk: 0.45,
    fireClimb: 0.32,
    hammerFrames: 600,
    hammerFlash: 120,
    hammerSwing: 6,
    // 10 s, flashing for the last 2 s
    bonusStep: 120,
    // the bonus timer loses 100 every 2 s
    introFrames: 150,
    deadFrames: 160,
    clearFrames: 260,
    extraLifeAt: 7e3
  };
  const STAGE_ORDER = [
    // the arcade's stage order per level (stages we have not built are skipped)
    ["barrels", "rivets"],
    ["barrels", "elevators", "rivets"],
    ["barrels", "conveyor", "elevators", "rivets"],
    ["barrels", "conveyor", "barrels", "elevators", "rivets"]
  ];
  const HEIGHT = { barrels: 25, conveyor: 50, elevators: 75, rivets: 100 };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const hit = (a, b) => a[0] < b[1] && a[1] > b[0] && a[2] < b[3] && a[3] > b[2];
  function slope(x0, x1, y0, dy) {
    const s = [];
    for (let x = x0, k = 0; x < x1; x += 16, k++) s.push({ x0: x, x1: Math.min(x1, x + 16), y: y0 + k * dy });
    return s;
  }
  function stageBarrels() {
    const floors = [
      { segs: [{ x0: 0, x1: 112, y: 248 }, ...slope(112, 224, 247, -1)] },
      // 0: ground, flat under the drum, rising right
      { segs: slope(0, 208, 200, 1) },
      // 1: gap at the right, runs downhill to the right
      { segs: slope(16, 224, 178, -1) },
      // 2: gap at the left, downhill to the left
      { segs: slope(0, 208, 133, 1) },
      // 3
      { segs: slope(16, 224, 112, -1) },
      // 4
      { segs: [{ x0: 0, x1: 144, y: 76 }, ...slope(144, 208, 77, 1)] },
      // 5: the gorilla's girder, flat under him
      { segs: [{ x0: 88, x1: 136, y: 48 }], top: true }
      // 6: the captive's platform (reach it = cleared)
    ];
    const L = (x, lo, hi, broken) => ({ x, lo, hi, broken: !!broken });
    return {
      id: "barrels",
      floors,
      goalFloor: 6,
      ladders: [
        L(80, 0, 1, 1),
        L(184, 0, 1),
        L(32, 1, 2),
        L(96, 1, 2),
        L(64, 2, 3, 1),
        L(112, 2, 3),
        L(184, 2, 3),
        L(32, 3, 4),
        L(72, 3, 4),
        L(168, 3, 4, 1),
        L(72, 4, 5, 1),
        L(184, 4, 5),
        L(128, 5, 6)
      ],
      decor: [{ x: 64, y0: 12, y1: 76 }, { x: 80, y0: 12, y1: 76 }],
      // the ladders the gorilla came up (no use to you)
      hammers: [{ x: 168, f: 1 }, { x: 24, f: 4 }],
      heroStart: { x: 56, f: 0 },
      drum: { x0: 16, x1: 32, y: 248 },
      ape: { x: 36, y: 76, box: [20, 52, 46, 76] },
      captive: { x: 104, y: 48 },
      stack: { x: 8, y: 76 },
      rollDir: (f) => f % 2 ? 1 : -1
      // barrels run downhill: right on odd girders, left on even ones (into the drum)
    };
  }
  function stageRivets() {
    const floors = [
      { segs: [{ x0: 8, x1: 216, y: 248 }] },
      { segs: [{ x0: 16, x1: 208, y: 208 }] },
      { segs: [{ x0: 24, x1: 200, y: 168 }] },
      { segs: [{ x0: 32, x1: 192, y: 128 }] },
      { segs: [{ x0: 40, x1: 184, y: 88 }] },
      { segs: [{ x0: 88, x1: 136, y: 48 }], top: true }
    ];
    for (const f of floors) f.gaps = [];
    const L = (x, lo, hi) => ({ x, lo, hi, broken: false });
    const rivets = [];
    for (let f = 1; f <= 4; f++) for (const x of [60, 164]) rivets.push({ x, f, gone: false });
    return {
      id: "rivets",
      floors,
      goalFloor: -1,
      ladders: [L(24, 0, 1), L(112, 0, 1), L(200, 0, 1), L(36, 1, 2), L(188, 1, 2), L(40, 2, 3), L(112, 2, 3), L(184, 2, 3), L(44, 3, 4), L(180, 3, 4)],
      decor: [],
      hammers: [{ x: 28, f: 1 }, { x: 136, f: 2 }],
      heroStart: { x: 40, f: 0 },
      drum: null,
      ape: { x: 112, y: 88, box: [96, 128, 58, 88] },
      captive: { x: 112, y: 48 },
      rivets,
      items: [{ x: 140, f: 1, kind: "purse" }, { x: 88, f: 3, kind: "hat" }, { x: 150, f: 4, kind: "umbrella" }]
    };
  }
  const BUILDERS = { barrels: stageBarrels, rivets: stageRivets };
  function create(opts = {}) {
    var _a;
    const rng = opts.rng || Math.random, rand = (a, b) => a + rng() * (b - a);
    const built = opts.stages || Object.keys(BUILDERS);
    const g = { opts: Object.assign({ ladderTol: 4 }, opts), events: [], T, SW, SH };
    let S = null, nextId = 1;
    const G = g.G = {
      mode: "intro",
      modeT: 0,
      score: 0,
      lives: (_a = opts.lives) != null ? _a : 3,
      level: opts.level || 1,
      round: 0,
      stageIdx: 0,
      stageId: "",
      height: 25,
      bonus: 5e3,
      bonusT: 0,
      frames: 0,
      stageFrames: 0,
      extraGiven: false,
      hurry: false,
      hero: null,
      barrels: [],
      fires: [],
      hammers: [],
      rivets: [],
      items: [],
      fx: [],
      ape: null,
      captive: null,
      drum: null,
      death: null
    };
    const ev = (t, o) => g.events.push(Object.assign({ t }, o));
    const order = (lvl) => STAGE_ORDER[Math.min(lvl, STAGE_ORDER.length) - 1].filter((s) => built.includes(s) && BUILDERS[s]);
    function surf(f, x) {
      const F = S.floors[f];
      if (!F) return null;
      if (F.gaps) {
        for (const gp of F.gaps) if (x >= gp[0] && x < gp[1]) return null;
      }
      for (const s of F.segs) if (x >= s.x0 && x < s.x1) return s.y;
      return null;
    }
    g.surf = surf;
    function landing(x, y0, y1, below) {
      let best = -1, by = Infinity;
      for (let f = 0; f < S.floors.length; f++) {
        if (below !== void 0 && f >= below) continue;
        const s = surf(f, x);
        if (s !== null && y0 <= s + 1e-3 && y1 >= s && s < by) {
          by = s;
          best = f;
        }
      }
      return best < 0 ? null : { f: best, y: by };
    }
    const diff = () => clamp(G.level + Math.floor(G.stageFrames / (60 * 25)), 1, 5);
    function loadStage(keepRivets) {
      const id = order(G.level)[G.stageIdx % order(G.level).length];
      const fresh = !keepRivets || !S || S.id !== id;
      if (fresh) S = BUILDERS[id]();
      g.stage = S;
      G.stageId = id;
      G.height = HEIGHT[id];
      G.hero = {
        x: S.heroStart.x,
        y: surf(S.heroStart.f, S.heroStart.x),
        f: S.heroStart.f,
        st: "walk",
        face: 1,
        vx: 0,
        vy: 0,
        peak: 0,
        lad: null,
        ham: 0,
        hamF: 0,
        walk: 0,
        climb: 0,
        over: /* @__PURE__ */ new Set(),
        jumped: false,
        id: 0
      };
      G.barrels = [];
      G.fires = [];
      G.fx = [];
      G.death = null;
      G.hurry = false;
      G.hammers = S.hammers.map((h) => ({ x: h.x, f: h.f, y: surf(h.f, h.x) - 20, taken: false }));
      G.rivets = S.rivets || [];
      G.items = (S.items || []).map((i) => Object.assign({ taken: false, y: surf(i.f, i.x) }, i));
      if (fresh && S.rivets) for (const f of S.floors) f.gaps = [];
      if (!fresh && S.rivets) {
        S.floors.forEach((f) => f.gaps = []);
        for (const r of G.rivets) if (r.gone) S.floors[r.f].gaps.push([r.x - 4, r.x + 4]);
      }
      G.ape = { x: S.ape.x, y: S.ape.y, st: "idle", t: 0, wait: 90, kind: "roll", first: true, pound: 0, fallY: 0, dy: 0 };
      G.captive = { x: S.captive.x, y: S.captive.y, help: 0, gone: false };
      G.drum = S.drum ? { x0: S.drum.x0, x1: S.drum.x1, y: S.drum.y, lit: false } : null;
      G.bonus = Math.min(8e3, 4e3 + 1e3 * G.level);
      G.bonusT = 0;
      G.stageFrames = 0;
      G.fireWait = 240;
    }
    function startStage(keep) {
      loadStage(keep);
      G.mode = "intro";
      G.modeT = 0;
      ev("intro", { stage: G.stageId, height: G.height, level: G.level });
    }
    g.reset = () => {
      var _a2;
      G.score = 0;
      G.lives = (_a2 = opts.lives) != null ? _a2 : 3;
      G.level = opts.level || 1;
      G.stageIdx = 0;
      G.extraGiven = false;
      startStage(false);
    };
    function addScore(p, x, y) {
      G.score += p;
      if (x !== void 0) {
        G.fx.push({ k: "pts", x, y, p, t: 0 });
        ev("score", { p, x, y });
      }
      if (!G.extraGiven && G.score >= T.extraLifeAt) {
        G.extraGiven = true;
        G.lives++;
        ev("extraLife");
      }
    }
    function die(why) {
      const h = G.hero;
      if (h.st === "dead" || G.mode !== "play") return;
      h.st = "dead";
      h.ham = 0;
      G.mode = "dead";
      G.modeT = 0;
      G.death = why;
      ev("death", { why });
    }
    const heroBox = (h) => [h.x - 4.5, h.x + 4.5, h.y - 15, h.y];
    const hurtBox = (h) => [h.x - 3.5, h.x + 3.5, h.y - 14, h.y - 1], barrelBox = (b) => [b.x - 4, b.x + 4, b.y - 8, b.y];
    function ladderAt(h, dirUp) {
      const tol = g.opts.ladderTol;
      let best = null, bd = 1e9;
      for (const L of S.ladders) {
        const d = Math.abs(h.x - L.x);
        if (d > tol) continue;
        if (dirUp && L.lo === h.f) {
          if (L.broken && h.y <= surf(L.lo, L.x) - T.brokenRise + 0.01) continue;
        } else if (!dirUp && L.hi === h.f && !L.broken) {
        } else continue;
        if (d < bd) {
          bd = d;
          best = L;
        }
      }
      return best;
    }
    function heroStep(inp) {
      const h = G.hero, dir = (inp.right ? 1 : 0) - (inp.left ? 1 : 0);
      if (h.ham > 0) {
        h.ham--;
        h.hamF++;
        if (h.ham === 0) ev("hammerOff");
      }
      if (h.st === "walk") {
        if (dir) h.face = dir;
        if (!h.ham && (inp.up || inp.down)) {
          const L = ladderAt(h, !!inp.up);
          if (L) {
            h.st = "climb";
            h.lad = L;
            h.x = L.x;
            h.climbDir = inp.up ? -1 : 1;
          }
        }
        if (h.st === "walk" && inp.jump && !h.ham) {
          h.st = "jump";
          h.vy = T.jumpV;
          h.vx = dir * T.heroWalk;
          h.peak = h.y;
          h.over = /* @__PURE__ */ new Set();
          ev("jump");
          const k = Math.min(T.jumpCatchMax, Math.max(0, Math.round(inp.jumpAge || 0)));
          for (let i = 0; i < k && h.vy < 0; i++) {
            h.vy = Math.min(T.maxFall, h.vy + T.grav);
            h.x = clamp(h.x + h.vx, 6, SW - 6);
            if (G.drum && h.x < G.drum.x1 + 6 && h.y > G.drum.y - 18) h.x = G.drum.x1 + 6;
            h.y += h.vy;
            h.peak = Math.min(h.peak, h.y);
          }
          return;
        }
        if (h.st === "walk" && dir) {
          let nx = clamp(h.x + dir * T.heroWalk, 6, SW - 6);
          if (G.drum && h.f === 0 && nx < G.drum.x1 + 6) nx = G.drum.x1 + 6;
          let s = surf(h.f, nx);
          if (h.grace) {
            if (h.grace.f === h.f && nx >= h.grace.x0 - 5 && nx < h.grace.x1 + 5) {
              if (s === null) s = S.floors[h.f].segs[0].y;
            } else h.grace = null;
          }
          h.x = nx;
          h.walk += T.heroWalk;
          if (h.walk >= 6) {
            h.walk = 0;
            ev("walk");
          }
          if (s === null) {
            h.st = "fall";
            h.vy = 0;
            h.vx = dir * 0.5;
            h.peak = h.y;
          } else h.y = s;
        }
      } else if (h.st === "climb") {
        const L = h.lad, bot = surf(L.lo, L.x), top = surf(L.hi, L.x);
        const v = inp.up ? -1 : inp.down ? 1 : 0;
        if (v) {
          h.y += v * T.heroClimb;
          h.climb += T.heroClimb;
          if (h.climb >= 4) {
            h.climb = 0;
            ev("climb");
          }
        }
        if (L.broken && h.y < bot - T.brokenRise) h.y = bot - T.brokenRise;
        if (!L.broken && h.y <= top) {
          h.y = top;
          h.f = L.hi;
          h.st = "walk";
          h.lad = null;
        } else if (h.y >= bot) {
          h.y = bot;
          h.f = L.lo;
          h.st = "walk";
          h.lad = null;
        }
      } else if (h.st === "jump" || h.st === "fall") {
        const y0 = h.y;
        h.vy = Math.min(T.maxFall, h.vy + T.grav);
        h.x += h.vx;
        if (h.x < 6 || h.x > SW - 6) {
          h.x = clamp(h.x, 6, SW - 6);
          h.vx = -h.vx * 0.5;
        }
        if (G.drum && h.x < G.drum.x1 + 6 && h.y > G.drum.y - 18) h.x = G.drum.x1 + 6;
        h.y += h.vy;
        h.peak = Math.min(h.peak, h.y);
        if (h.vy > 0) {
          const ld = landing(h.x, y0, h.y);
          if (ld) {
            h.y = ld.y;
            h.f = ld.f;
            const drop = ld.y - h.peak, wasJump = h.st === "jump";
            h.st = "walk";
            h.vx = 0;
            h.vy = 0;
            ev("land");
            if (drop > T.fallDie) {
              G.hero.st = "walk";
              die("fall");
              return;
            }
            if (wasJump && h.over.size) {
              const n = h.over.size;
              addScore(n === 1 ? 100 : n === 2 ? 300 : 800, h.x, h.y - 18);
            }
            h.over = /* @__PURE__ */ new Set();
          } else if (h.y > SH + 20) die("fall");
        }
        if (h.st === "jump") {
          for (const o of [...G.barrels, ...G.fires]) if (Math.abs(o.x - h.x) < 7 && o.y > h.y - 2 && o.y - h.y < 30) h.over.add(o.id);
        }
      }
      if (h.st !== "climb" && h.st !== "dead") {
        for (const m of G.hammers) if (!m.taken && hit(heroBox(h), [m.x - 4, m.x + 4, m.y - 9, m.y])) {
          m.taken = true;
          h.ham = T.hammerFrames;
          h.hamF = 0;
          ev("hammerOn");
          if (h.st === "jump") {
          }
        }
      }
      for (const it of G.items) if (!it.taken && hit(heroBox(h), [it.x - 6, it.x + 6, it.y - 14, it.y])) {
        it.taken = true;
        const p = G.level === 1 ? 300 : G.level === 2 ? 500 : 800;
        addScore(p, it.x, it.y - 16);
        ev("item", { kind: it.kind });
      }
      for (const r of G.rivets) if (!r.gone && Math.abs(h.x - r.x) < 4 && h.st !== "climb") {
        const fy = S.floors[r.f].segs[0].y;
        if (h.st === "walk" && h.f === r.f || (h.st === "jump" || h.st === "fall") && h.y <= fy + 0.5 && h.y > fy - 30) {
          r.gone = true;
          S.floors[r.f].gaps.push([r.x - 4, r.x + 4]);
          addScore(100, r.x, fy - 18);
          ev("rivet");
          if (h.st === "walk") h.grace = { f: r.f, x0: r.x - 4, x1: r.x + 4 };
        }
      }
    }
    function hammerBox(h) {
      if (h.ham <= 0 || h.st === "dead") return null;
      const f = h.face;
      return Math.floor(h.hamF / T.hammerSwing) % 2 === 0 ? f > 0 ? [h.x - 6, h.x + 12, h.y - 32, h.y - 6] : [h.x - 12, h.x + 6, h.y - 32, h.y - 6] : f > 0 ? [h.x + 2, h.x + 19, h.y - 13, h.y] : [h.x - 19, h.x - 2, h.y - 13, h.y];
    }
    g.hammerBox = () => hammerBox(G.hero);
    function smash(o, list) {
      const i = list.indexOf(o);
      if (i >= 0) list.splice(i, 1);
      const r = rng(), p = r < 0.6 ? 300 : r < 0.9 ? 500 : 800;
      G.fx.push({ k: "smash", x: o.x, y: o.y - 6, t: 0 });
      ev("smash");
      addScore(p, o.x, o.y - 18);
    }
    function collide() {
      const h = G.hero, hb = hurtBox(h), hm = hammerBox(h);
      for (const b of G.barrels.slice()) {
        const bb = barrelBox(b);
        if (hm && hit(hm, bb)) {
          smash(b, G.barrels);
          continue;
        }
        if (hit(hb, bb)) return die("barrel");
      }
      for (const f of G.fires.slice()) {
        if (f.mode === "spawn" && f.t < 20) continue;
        const fb = [f.x - 4, f.x + 4, f.y - 12, f.y - 1];
        if (hm && hit(hm, fb)) {
          smash(f, G.fires);
          continue;
        }
        if (hit(hb, fb)) return die("fire");
      }
      if (G.ape && !G.ape.falling) {
        const a = S.ape.box;
        if (hit(hb, a)) return die("ape");
      }
    }
    function apeStep() {
      const a = G.ape;
      a.t++;
      if (S.id !== "barrels") {
        if (--a.pound <= 0) {
          a.pound = 150 + Math.floor(rand(0, 120));
          ev("pound");
        }
        return;
      }
      if (a.st === "idle") {
        if (--a.wait <= 0 && G.barrels.length < 7) {
          a.kind = a.first ? "blueFirst" : rng() < 0.06 + 0.03 * (diff() - 1) ? "wild" : "roll";
          a.blue = a.kind === "roll" && rng() < 0.16;
          a.st = "grab";
          a.t = 0;
        } else if (a.wait > 60 && a.t % 90 === 0) ev("pound");
      } else if (a.st === "grab" && a.t >= 22) {
        a.st = "lift";
        a.t = 0;
      } else if (a.st === "lift" && a.t >= 20) {
        a.st = a.kind === "roll" ? "side" : "down";
        a.t = 0;
      } else if ((a.st === "side" || a.st === "down") && a.t === 8) {
        if (a.kind === "roll") spawnBarrel({ x: 60, f: 5, dir: 1, blue: a.blue });
        else spawnBarrel({ x: a.kind === "blueFirst" ? 34 : 40, y: 66, wild: true, blue: a.kind === "blueFirst", vx: a.kind === "blueFirst" ? 0 : rng() < 0.5 ? -0.7 : 0.7 });
        a.first = false;
        ev("throw");
      } else if ((a.st === "side" || a.st === "down") && a.t >= 18) {
        a.st = "idle";
        a.t = 0;
        const d = diff();
        a.wait = Math.floor(rand(70, 150) - (d - 1) * 12);
      }
    }
    function spawnBarrel(o) {
      var _a2, _b, _c;
      const b = {
        id: nextId++,
        x: o.x,
        f: (_a2 = o.f) != null ? _a2 : 5,
        y: (_c = o.y) != null ? _c : surf((_b = o.f) != null ? _b : 5, o.x),
        dir: o.dir || 1,
        mode: o.wild ? "wild" : "roll",
        blue: !!o.blue,
        vx: o.vx || 0,
        vy: 0,
        bounced: false,
        dec: /* @__PURE__ */ new Set(),
        passed: /* @__PURE__ */ new Set(),
        rot: 0,
        lad: null
      };
      G.barrels.push(b);
      return b;
    }
    g.spawnBarrel = spawnBarrel;
    function intoDrum(b) {
      G.barrels.splice(G.barrels.indexOf(b), 1);
      const d = G.drum;
      if (!d) return;
      if (b.blue) {
        const was = d.lit;
        d.lit = true;
        ev("oil", { first: !was });
        if (G.fires.length < 5) spawnFire({ fromDrum: true });
      }
    }
    function barrelStep(b) {
      const sp = T.barrelRoll + 0.06 * (diff() - 1), h = G.hero;
      if (b.mode === "roll") {
        const px = b.x;
        b.x += b.dir * sp;
        b.rot += sp * b.dir;
        if (G.drum && b.f === 0 && b.x <= G.drum.x1) return intoDrum(b);
        const s = surf(b.f, b.x);
        if (s === null) {
          b.mode = "fall";
          b.vx = b.dir * 0.45;
          b.vy = 0.3;
          b.bounced = false;
          return;
        }
        b.y = s;
        for (const L of S.ladders) if (L.hi === b.f && L.lo === b.f - 1 && !b.dec.has(L) && (px - L.x) * (b.x - L.x) <= 0) {
          b.dec.add(L);
          const below = h.st !== "dead" && h.y > b.y + 8, near = Math.abs(L.x - h.x) < 48;
          const p = below ? 0.18 + 0.05 * diff() + (near ? 0.25 : 0) : 0;
          if (rng() < p) {
            b.mode = "ladder";
            b.x = L.x;
            b.lad = L;
            ev("roll", { ladder: true });
            return;
          }
        }
      } else if (b.mode === "ladder") {
        b.y += T.barrelLadder;
        const bot = surf(b.lad.lo, b.lad.x);
        if (b.y >= bot) {
          b.y = bot;
          b.f = b.lad.lo;
          b.mode = "roll";
          b.dir = S.rollDir(b.f);
          b.dec = /* @__PURE__ */ new Set();
          b.lad = null;
        }
      } else if (b.mode === "fall") {
        const y0 = b.y;
        b.vy = Math.min(3, b.vy + T.barrelGrav);
        b.x = clamp(b.x + b.vx, 4, SW - 4);
        b.y += b.vy;
        if (b.vy > 0) {
          const ld = landing(b.x, y0, b.y, b.bounced ? b.f + 1 : b.f);
          if (ld) {
            b.y = ld.y;
            ev("bounce");
            if (!b.bounced) {
              b.bounced = true;
              b.f = ld.f;
              b.dir = S.rollDir(b.f);
              b.vy = -1.1;
              b.vx = b.dir * 0.6;
              b.landF = ld.f;
            } else {
              b.f = ld.f;
              b.mode = "roll";
              b.dec = /* @__PURE__ */ new Set();
            }
          }
        }
        if (b.y > SH + 16) G.barrels.splice(G.barrels.indexOf(b), 1);
      } else if (b.mode === "wild") {
        const y0 = b.y;
        b.vy = Math.min(3, b.vy + T.barrelGrav);
        b.x += b.vx;
        b.y += b.vy;
        b.rot += 1;
        if (b.x < 8 || b.x > SW - 8) {
          b.x = clamp(b.x, 8, SW - 8);
          b.vx = -b.vx;
        }
        if (b.vy > 0) for (let f = 0; f < S.floors.length; f++) {
          if (S.floors[f].top || b.passed.has(f)) continue;
          const s = surf(f, b.x);
          if (s === null || !(y0 <= s && b.y >= s)) continue;
          if (f === 0) {
            b.y = s;
            b.f = 0;
            b.mode = "roll";
            b.dir = -1;
            b.dec = /* @__PURE__ */ new Set();
            ev("bounce");
            if (G.drum && b.x <= G.drum.x1 + 4) return intoDrum(b);
            break;
          }
          b.passed.add(f);
          b.y = s;
          b.vy = -1.3;
          ev("bounce");
          if (b.vx) b.vx = (h.x > b.x ? 1 : -1) * Math.abs(b.vx);
          break;
        }
      }
    }
    function spawnFire(o = {}) {
      let f;
      if (o.fromDrum) f = { x: (G.drum.x0 + G.drum.x1) / 2, y: G.drum.y - 16, f: 0, mode: "spawn", vx: 0.6, vy: -1.5 };
      else f = { x: o.x, y: surf(o.f, o.x), f: o.f, mode: "walk", vx: 0, vy: 0, dir: o.dir || 1 };
      Object.assign(f, { id: nextId++, dir: f.dir || 1, t: 0, wander: 60, lad: null, cd: 0 });
      G.fires.push(f);
      ev("fireSpawn");
      return f;
    }
    g.spawnFire = spawnFire;
    function fireStep(o) {
      const h = G.hero, sp = T.fireWalk + 0.05 * (diff() - 1);
      o.t++;
      if (o.mode === "spawn") {
        const y0 = o.y;
        o.vy += 0.08;
        o.x += o.vx;
        o.y += o.vy;
        if (o.vy > 0) {
          const ld = landing(o.x, y0, o.y);
          if (ld && o.x > G.drum.x1 + 2) {
            o.y = ld.y;
            o.f = ld.f;
            o.mode = "walk";
            o.dir = 1;
          }
        }
        return;
      }
      if (o.mode === "climb") {
        const L = o.lad, tgt = o.cdir < 0 ? surf(L.hi, L.x) : surf(L.lo, L.x);
        o.y += o.cdir * T.fireClimb;
        if (o.cdir < 0 && o.y <= tgt || o.cdir > 0 && o.y >= tgt) {
          o.y = tgt;
          o.f = o.cdir < 0 ? L.hi : L.lo;
          o.mode = "walk";
          o.lad = null;
          o.cd = 40;
          o.dir = rng() < 0.5 ? -1 : 1;
        }
        return;
      }
      if (--o.wander <= 0) {
        o.wander = Math.floor(rand(60, 180));
        const toward = Math.sign(h.x - o.x) || o.dir;
        o.dir = rng() < (h.f === o.f ? 0.7 : 0.55) ? toward : -toward;
      }
      const px = o.x;
      let nx = o.x + o.dir * sp, s = surf(o.f, nx);
      if (s === null || nx < 8 || nx > SW - 8 || G.drum && o.f === 0 && nx < G.drum.x1 + 4) {
        o.dir = -o.dir;
        nx = o.x;
        s = surf(o.f, nx);
      }
      o.x = nx;
      if (s !== null) o.y = s;
      if (o.cd > 0) {
        o.cd--;
        return;
      }
      for (const L of S.ladders) {
        if (L.broken || S.floors[L.hi].top || (px - L.x) * (o.x - L.x) > 0) continue;
        if (L.lo === o.f && rng() < (h.y < o.y - 10 ? 0.5 : 0.12)) {
          o.mode = "climb";
          o.lad = L;
          o.cdir = -1;
          o.x = L.x;
          return;
        }
        if (L.hi === o.f && rng() < (h.y > o.y + 10 ? 0.45 : 0.1)) {
          o.mode = "climb";
          o.lad = L;
          o.cdir = 1;
          o.x = L.x;
          return;
        }
      }
    }
    function rivetFires() {
      if (S.id !== "rivets") return;
      const cap = Math.min(5, 2 + G.level);
      if (--G.fireWait > 0 || G.fires.length >= cap) return;
      G.fireWait = Math.floor(rand(240, 420));
      for (let tries = 0; tries < 6; tries++) {
        const f = Math.floor(rand(0, 4)), F = S.floors[f].segs[0], side = rng() < 0.5, x = side ? F.x1 - 6 : F.x0 + 6;
        if (f === G.hero.f && Math.abs(x - G.hero.x) < 56) continue;
        if (surf(f, x) === null) continue;
        spawnFire({ x, f, dir: side ? -1 : 1 });
        return;
      }
    }
    g.step = function(inp = {}) {
      g.events = [];
      G.frames++;
      G.modeT++;
      for (const e of G.fx) e.t++;
      G.fx = G.fx.filter((e) => e.t < (e.k === "pts" ? 60 : 24));
      if (G.mode === "intro") {
        if (G.modeT >= T.introFrames) {
          G.mode = "play";
          G.modeT = 0;
        }
        return g.events;
      }
      if (G.mode === "gameover") return g.events;
      if (G.mode === "dead") {
        if (G.modeT >= T.deadFrames) {
          G.lives--;
          if (G.lives <= 0) {
            G.mode = "gameover";
            G.modeT = 0;
            ev("gameover");
          } else startStage(true);
        }
        return g.events;
      }
      if (G.mode === "clear") {
        const a = G.ape;
        if (S.id === "barrels") {
          if (G.modeT > 70) {
            a.y -= 0.6;
            G.captive.y -= 0.6;
            G.captive.carried = true;
          }
        } else {
          if (G.modeT > 40) {
            a.falling = true;
            a.dy = (a.dy || 0) + 0.06;
            a.y += a.dy;
          }
        }
        if (G.modeT >= T.clearFrames) {
          G.stageIdx++;
          if (G.stageIdx >= order(G.level).length) {
            G.stageIdx = 0;
            G.level++;
          }
          G.round++;
          startStage(false);
        }
        return g.events;
      }
      G.stageFrames++;
      if (++G.bonusT >= T.bonusStep) {
        G.bonusT = 0;
        G.bonus = Math.max(0, G.bonus - 100);
        ev("bonusTick", { bonus: G.bonus });
        if (G.bonus <= 1e3 && !G.hurry) {
          G.hurry = true;
          ev("hurry");
        }
        if (G.bonus <= 0) {
          die("time");
          return g.events;
        }
      }
      heroStep(inp);
      if (G.mode !== "play") return g.events;
      apeStep();
      for (const b of G.barrels.slice()) barrelStep(b);
      for (const f of G.fires.slice()) fireStep(f);
      rivetFires();
      G.captive.help = (G.captive.help + 1) % 240;
      collide();
      if (G.mode !== "play") return g.events;
      const h = G.hero;
      const cleared = S.id === "rivets" ? G.rivets.every((r) => r.gone) : h.st === "walk" && h.f === S.goalFloor;
      if (cleared) {
        G.mode = "clear";
        G.modeT = 0;
        h.ham = 0;
        G.barrels = [];
        G.fires = [];
        const b = G.bonus;
        addScore(b, h.x, h.y - 24);
        ev("clear", { bonus: b, stage: S.id });
        if (S.id === "rivets") {
          h.x = G.captive.x - 14;
          h.y = G.captive.y;
          h.st = "walk";
          h.face = 1;
        }
      }
      return g.events;
    };
    g.reset();
    return g;
  }
  const API = { create, T, STAGE_ORDER, HEIGHT, SW, SH };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else root.GKEngine = API;
})(typeof window !== "undefined" ? window : globalThis);
