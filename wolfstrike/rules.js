(function(root) {
  "use strict";
  const R = {
    magRounds: 30,
    // DOC: a magazine is worth thirty bullets
    startMags: 6,
    // DOC range: the operator sets 4-7 magazines at start; OURS: 6
    startGrenades: 5,
    // DOC: every mission begins with 5 grenades (8 in the last two)
    fireRate: 10,
    // OURS: rounds per second, full auto (an Uzi runs ~600 rounds a minute)
    dryRate: 3,
    // DOC: out of magazines you can still fire, at a reduced rate; OURS: 3 a second
    superRate: 16,
    // DOC: the super machine gun raises the firing rate for 10 s and uses no bullets; OURS: 16 a second
    superSecs: 10,
    // DOC
    damageMax: 30,
    // OURS: units on the damage meter
    drink: 5,
    // DOC: a power drink removes five units
    stageHeal: 3,
    // DOC: three units come off the meter for finishing a mission
    dmg: { bullet: 1, knife: 2, grenade: 2, mortar: 3, rocket: 3, shell: 3, friendly: 2 },
    // OURS (DOC: hits and shooting nurses, boys, hostages all raise it)
    vehicleHits: { truck: 5, armor: 5, boat: 5, heli: 10 },
    // DOC: armoured cars and patrol boats take five shots, helicopters ten (trucks five)
    pts: {
      // DOC unless marked
      soldier: 50,
      soldierFar: 100,
      para: 200,
      roller: 200,
      vest: 200,
      tough: 500,
      toughHit: 50,
      thrower: 300,
      vehicleHit: 50,
      truck: 300,
      boat: 1e3,
      heli: 2e3,
      armor: 1e3,
      shotDown: 300,
      knife: 0,
      rocket: 300,
      drum: 100,
      pickup: 100,
      coconut: 3e3,
      vase: 5e3,
      hostage: 5e3
    },
    hostageDamage: 2,
    // OURS (same as any friendly)
    concurrency: [4, 5, 5, 6, 6, 7]
    // OURS: soldiers on screen at once per mission
  };
  const STAGES = [
    {
      id: "radio",
      name: "RADIO OUTPOST",
      brief: "Cut the enemy radio post off before it calls for help",
      env: "dikhololo_sunset",
      quota: { soldier: 50, heli: 4, armor: 5 },
      extra: { truck: 4 },
      uniform: 7035454,
      ground: "dry_ground_01",
      walk: 1
    },
    {
      id: "jungle",
      name: "THE JUNGLE",
      brief: "Push through the jungle and find out where the prisoners are held",
      env: "lush_dirt_path",
      quota: { soldier: 60, armor: 8, boat: 8 },
      extra: {},
      uniform: 8022586,
      ground: "forest_leaves_02",
      river: true,
      walk: -1
    },
    {
      id: "village",
      name: "RIVER VILLAGE",
      brief: "Clear the village and rest up",
      env: "resting_place_2",
      quota: { soldier: 40, heli: 4, armor: 3 },
      extra: {},
      uniform: 6054496,
      ground: "brown_mud_leaves_01",
      walk: 1
    },
    {
      id: "ammo",
      name: "AMMO DUMP",
      brief: "Take the ammunition dump by force",
      env: "pump_station",
      quota: { soldier: 45, heli: 7, armor: 5 },
      extra: {},
      uniform: 9075290,
      ground: "gravel_road",
      vests: true,
      refill: true,
      walk: 1
    },
    {
      id: "camp",
      name: "PRISON CAMP",
      brief: "Five hostages are held here. Get them out alive",
      env: "kloofendal_28d_misty",
      quota: { soldier: 75, heli: 12 },
      extra: {},
      uniform: 4151861,
      ground: "dry_ground_01",
      vests: true,
      hostages: 5,
      mags: 9,
      grenades: 8,
      walk: -1
    },
    {
      id: "airstrip",
      name: "AIRSTRIP",
      brief: "Cover the hostages to the plane and get out",
      env: "derelict_airfield_01",
      quota: { soldier: 85, heli: 11, armor: 4 },
      extra: { truck: 1 },
      uniform: 6975088,
      ground: "asphalt_02",
      vests: true,
      escort: true,
      grenades: 8,
      walk: -1
    }
  ];
  const ITEMS = ["mag", "grenade", "drink", "super"];
  function newGame(rng = Math.random) {
    return {
      rng,
      score: 0,
      stage: 0,
      mags: R.startMags,
      rounds: R.magRounds,
      grenades: R.startGrenades,
      damage: 0,
      superT: 0,
      quota: null,
      extraLeft: null,
      hostagesHeld: 0,
      hostagesFreed: 0,
      hostagesLost: 0,
      rescued: 0,
      kills: 0,
      shots: 0,
      hits: 0,
      friendlyHits: 0,
      over: false,
      clear: false,
      events: [],
      fireAcc: 0,
      t: 0
    };
  }
  function startStage(G, i) {
    const S = STAGES[i];
    G.stage = i;
    G.clear = false;
    G.quota = Object.assign({}, S.quota);
    G.extraLeft = Object.assign({}, S.extra || {});
    if (S.mags) {
      G.mags = Math.max(G.mags, S.mags);
      G.rounds = R.magRounds;
    }
    G.grenades = S.grenades || R.startGrenades;
    if (G.mags <= 0 && G.rounds <= 0) G.rounds = 0;
    G.superT = 0;
    G.stageT = 0;
    if (S.hostages) {
      G.hostagesHeld = S.hostages;
      G.hostagesFreed = 0;
      G.hostagesLost = 0;
    }
    if (S.escort) {
      G.hostagesHeld = G.rescued;
      G.hostagesFreed = 0;
      G.hostagesLost = 0;
    }
    G.events.push({ t: "stage", i });
    return S;
  }
  const remaining = (G) => Object.values(G.quota || {}).reduce((a, b) => a + Math.max(0, b), 0);
  function fire(G, dt, held) {
    if (!held || G.over) {
      G.fireAcc = 0;
      return 0;
    }
    const sup = G.superT > 0, dry = !sup && G.rounds <= 0 && G.mags <= 0;
    const rate = sup ? R.superRate : dry ? R.dryRate : R.fireRate;
    G.fireAcc += dt * rate;
    let n = 0;
    while (G.fireAcc >= 1) {
      G.fireAcc -= 1;
      if (!sup && !dry) {
        if (G.rounds <= 0) {
          if (G.mags <= 0) break;
          G.mags--;
          G.rounds = R.magRounds;
          G.events.push({ t: "reload" });
        }
        G.rounds--;
      }
      n++;
      G.shots++;
    }
    return n;
  }
  function trigger(G) {
    G.fireAcc = Math.max(G.fireAcc, 1);
  }
  function grenade(G) {
    if (G.grenades <= 0 || G.over) return false;
    G.grenades--;
    G.events.push({ t: "grenade" });
    return true;
  }
  function award(G, p) {
    if (p) {
      G.score += p;
      G.events.push({ t: "pts", p });
    }
  }
  function kill(G, kind, ptsKey) {
    var _a;
    G.kills++;
    award(G, (_a = R.pts[ptsKey || kind]) != null ? _a : 0);
    if (G.quota && G.quota[kind] > 0) G.quota[kind]--;
    else if (G.extraLeft && G.extraLeft[kind] > 0) G.extraLeft[kind]--;
    if (G.quota && remaining(G) === 0 && !G.clear) {
      G.clear = true;
      G.events.push({ t: "clear" });
    }
  }
  function hurt(G, kind) {
    var _a;
    if (G.over || G.clear) return;
    G.damage = Math.min(R.damageMax, G.damage + ((_a = R.dmg[kind]) != null ? _a : 1));
    G.events.push({ t: "hurt", kind });
    if (G.damage >= R.damageMax) {
      G.over = true;
      G.events.push({ t: "dead" });
    }
  }
  function friendlyHit(G, who) {
    G.friendlyHits++;
    hurt(G, "friendly");
    if (who === "hostage") {
      G.hostagesLost++;
      G.events.push({ t: "hostageLost" });
    }
  }
  function pickup(G, item) {
    award(G, R.pts.pickup);
    if (item === "mag") G.mags++;
    else if (item === "grenade") G.grenades++;
    else if (item === "drink") G.damage = Math.max(0, G.damage - R.drink);
    else if (item === "super") G.superT = R.superSecs;
    G.events.push({ t: "item", item });
  }
  function randomItem(G) {
    return ITEMS[Math.floor(G.rng() * ITEMS.length)];
  }
  function hostageOut(G) {
    G.hostagesFreed++;
    G.events.push({ t: "hostageOut" });
  }
  function endStage(G) {
    const S = STAGES[G.stage], tally = { hostages: 0, bonus: 0 };
    if (S.hostages) {
      G.rescued = G.hostagesFreed;
      tally.hostages = G.hostagesFreed;
    }
    if (S.escort) {
      tally.hostages = G.hostagesFreed;
      G.rescued = G.hostagesFreed;
    }
    if (S.hostages || S.escort) {
      tally.bonus = tally.hostages * R.pts.hostage;
      award(G, tally.bonus);
    }
    G.damage = Math.max(0, G.damage - R.stageHeal);
    if (S.refill) {
      G.mags = Math.max(G.mags, 9);
      G.rounds = R.magRounds;
    }
    return tally;
  }
  function tick(G, dt) {
    G.t += dt;
    G.stageT = (G.stageT || 0) + dt;
    if (G.superT > 0) G.superT = Math.max(0, G.superT - dt);
  }
  function director(G, D, live, dt) {
    const S = STAGES[G.stage], rnd = G.rng, out = [];
    if (G.clear || G.over) return out;
    D.t = (D.t || 0) + dt;
    const want = R.concurrency[G.stage] || 5, Q = G.quota;
    const needSoldiers = Q.soldier || 0;
    if (needSoldiers > 0 && live.soldiers < Math.min(want, needSoldiers) && D.t >= (D.nextSoldier || 1.5)) {
      const r = rnd(), kind = S.vests && r < 0.18 ? "vest" : r < 0.3 && G.stage > 0 ? "para" : r < 0.42 ? "popper" : r < 0.5 ? "thrower" : r < 0.56 ? "tough" : "runner";
      out.push({ t: "soldier", kind, side: rnd() < 0.5 ? -1 : 1, depth: 9 + rnd() * 16 });
      D.nextSoldier = D.t + 0.7 + rnd() * 1.4;
    }
    const vkinds = ["heli", "armor", "boat"].filter((k) => (Q[k] || 0) > 0).concat(Object.entries(G.extraLeft || {}).filter(([, n]) => n > 0).map(([k]) => k));
    if (vkinds.length && live.vehicles === 0 && D.t >= (D.nextVehicle || 10)) {
      out.push({ t: "vehicle", kind: vkinds[Math.floor(rnd() * vkinds.length)], side: rnd() < 0.5 ? -1 : 1 });
      D.nextVehicle = D.t + 9 + rnd() * 8;
    }
    if (D.t >= (D.nextCivil || 14)) {
      out.push({ t: "civilian", kind: rnd() < 0.5 ? "nurses" : "boy", side: rnd() < 0.5 ? -1 : 1 });
      D.nextCivil = D.t + 16 + rnd() * 14;
    }
    if (D.t >= (D.nextMag || 8)) {
      out.push({ t: "item", item: "mag", ground: true });
      D.nextMag = D.t + 18 + rnd() * 10;
    }
    if (D.t >= (D.nextCarrier || 20)) {
      out.push({ t: "carrier" });
      D.nextCarrier = D.t + 22 + rnd() * 14;
    }
    if (D.t >= (D.nextDrum || 5)) {
      out.push({ t: "drum" });
      D.nextDrum = D.t + 12 + rnd() * 10;
    }
    if ((S.hostages || S.escort) && G.hostagesHeld > 0 && live.hostages === 0 && D.t >= (D.nextHostage || 12)) {
      G.hostagesHeld--;
      out.push({ t: "hostage" });
      D.nextHostage = D.t + 22 + rnd() * 10;
    }
    return out;
  }
  const API = { R, STAGES, ITEMS, newGame, startStage, remaining, fire, trigger, grenade, award, kill, hurt, friendlyHit, pickup, randomItem, hostageOut, endStage, tick, director };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else root.WSRules = API;
})(typeof window !== "undefined" ? window : globalThis);
