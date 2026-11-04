// dist/stance_defs.js
var STANCES = {
  // Chris Barnes, 4-step approach (stance): feet 0.66 T, knee 144-150, hinge ~28, ball hands -0.53 T, 0.62 T in front, together
  bowling: {
    def: { feet: 0.62, stagger: 0.14, knee: 160, hinge: 20, hands: { r: { y: -0.55, fwd: 0.62, x: 0.16 }, l: { y: -0.5, fwd: 0.62, x: -0.04 } } },
    checks: [
      { name: "knees soft", parts: ["legs"], ok: (m) => m.kneeMin < 150 },
      { name: "ball at the waist, both hands", parts: ["arms"], ok: (m) => m.hands > -0.95 && m.hands < -0.15 && m.handsApart < 0.7 },
      { name: "leaning in", parts: ["spine"], ok: (m) => m.hinge > 14 }
    ]
  },
  // keeper set position (pro keepers in GK coaching video): feet 1.75 T, knee ~116, hinge ~39, hands -0.65 T, wide, a little in front
  keeper: {
    def: { feet: 1.6, knee: 135, hinge: 25, hands: { l: { y: -0.65, fwd: 0.35, x: 0.85 }, r: { y: -0.65, fwd: 0.35, x: 0.85 } } },
    checks: [
      { name: "knees bent", parts: ["legs"], ok: (m) => m.kneeMin < 140 },
      { name: "feet wide", parts: ["feet"], ok: (m) => m.feet > 1 },
      { name: "hands ready at the waist", parts: ["arms"], ok: (m) => m.handL > -1.05 && m.handR > -1.05 && m.hands < 0.1 },
      { name: "weight forward", parts: ["spine"], ok: (m) => m.hinge > 15 }
    ]
  },
  // table tennis ready position (coaching video, side and front): feet 1.6 T, knee ~137, hinge ~38, hands -0.67 T, 0.54 T in front
  tabletennis: {
    def: { feet: 1.5, stagger: 0.08, knee: 145, hinge: 25, hands: { r: { y: -0.6, fwd: 0.6, x: 0.45 }, l: { y: -0.55, fwd: 0.5, x: 0.4 } } },
    checks: [
      { name: "knees bent", parts: ["legs"], ok: (m) => m.kneeMin < 145 },
      { name: "feet wide", parts: ["feet"], ok: (m) => m.feet > 1 },
      { name: "paddle in front", parts: ["arms"], ok: (m) => m.hands > -1 && m.hands < 0.1 && m.reach > 0.2 },
      { name: "leaning in", parts: ["spine"], ok: (m) => m.hinge > 14 }
    ]
  },
  // snowboard basic stance (instructor on the board, TmRIfvECav8 134-200 s, 287-400 s): feet ~0.9 T apart along the board,
  // knees bent (150 live scale = clearly flexed), slight lean 16, hands low and out in front for balance; side-on (yaw:
  // regular -90 = left foot toward the nose / into the scene, goofy +90; extreme.html sets it from the stance it reads)
  snowboard: {
    def: { feet: 0.9, knee: 152, hinge: 12, yaw: -90, hands: { l: { y: -0.7, fwd: 0.35, x: 0.55 }, r: { y: -0.7, fwd: 0.35, x: 0.55 } } },
    checks: [
      { name: "knees bent", parts: ["legs"], ok: (m) => m.kneeMin < 150 },
      { name: "side-on, feet apart", parts: ["feet", "spine"], ok: (m) => m.sideOn > 30 && m.feet > 0.5 }
    ]
  },
  // athletic ready stance (coach demo, Qe8o-ZNF0G4 6.4-8.1 s and 23.4-25.6 s): feet 0.92 T, knee 129 / kneeMin 121 (live
  // scale), lean 18, hands -0.82 T just in front (0.27 T). Wall Dodge's ready (squat, jump or step from here).
  athletic: {
    def: { feet: 0.95, knee: 140, hinge: 16, hands: { l: { y: -0.85, fwd: 0.3, x: 0.5 }, r: { y: -0.85, fwd: 0.3, x: 0.5 } } },
    checks: [
      { name: "knees soft", parts: ["legs"], ok: (m) => m.kneeMin < 145 },
      { name: "feet apart", parts: ["feet"], ok: (m) => m.feet > 0.7 },
      { name: "leaning in", parts: ["spine"], ok: (m) => m.hinge > 12 }
    ]
  },
  // the same athletic base with the hands up in front at chest height (the arcade games: fruit, moles, breaker, balloon,
  // bubbles; plan "Common ready stance")
  ready: {
    def: { feet: 0.95, knee: 145, hinge: 12, hands: { l: { y: -0.25, fwd: 0.6, x: 0.45 }, r: { y: -0.25, fwd: 0.6, x: 0.45 } } },
    checks: [
      { name: "knees soft", parts: ["legs"], ok: (m) => m.kneeMin < 148 },
      { name: "hands up in front", parts: ["arms"], ok: (m) => m.handL > -0.5 && m.handR > -0.5 && m.reach > 0.25 }
    ]
  },
  // isosceles pistol stance (5v9pnBR9uyg 25.9-31.6 s, 88-100.2 s, front on): feet 0.55 T, knees nearly straight (165 live
  // = soft), lean 6, both hands at shoulder height (+0.05 T), together (0.28 T apart), out at the target (reach reads 0.71 T:
  // MediaPipe shortens depth toward the camera). Peekaboo Gallery's ready.
  gallery: {
    def: { feet: 0.6, knee: 170, hinge: 8, hands: { l: { y: 0, fwd: 1.3, x: 0.05 }, r: { y: 0, fwd: 1.3, x: 0.05 } } },
    checks: [
      { name: "arms out at the target", parts: ["arms"], ok: (m) => m.handL > -0.35 && m.handR > -0.35 && m.reach > 0.45 },
      { name: "feet set, knees soft", parts: ["legs", "feet"], ok: (m) => m.feet > 0.4 && m.kneeMin < 168 }
    ]
  },
  // Sound Bath: mountain pose (Tadasana tutorial 2HTvZp5rPrg, 41 frames): feet together-ish 0.27 T, legs straight (162 live
  // scale), upright (6), arms by the sides (-1.05 T), palms forward
  mountain: {
    def: { feet: 0.3, knee: 178, hinge: 2, hands: { l: { y: -1.05, fwd: 0.05, x: 0.55 }, r: { y: -1.05, fwd: 0.05, x: 0.55 } } },
    checks: [
      { name: "standing tall", parts: ["spine", "legs"], ok: (m) => m.hinge < 12 && m.kneeMin > 150 },
      { name: "feet under the hips", parts: ["feet"], ok: (m) => m.feet < 0.6 },
      { name: "arms by the sides", parts: ["arms"], ok: (m) => m.handL < -0.7 && m.handR < -0.7 }
    ]
  }
};

export {
  STANCES
};
