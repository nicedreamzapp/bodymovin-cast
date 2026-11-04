(function(root) {
  "use strict";
  const PAL = {
    // hero: a carpenter in a green flat cap, mustard shirt, rust-brown overalls with a tan tool belt
    G: "#22a35a",
    g: "#126b38",
    S: "#ffc492",
    s: "#d98f5c",
    M: "#3e2410",
    Y: "#f2c230",
    y: "#b88a12",
    O: "#a8521f",
    o: "#6e3210",
    T: "#e8c07a",
    B: "#2c1a0c",
    W: "#ffffff",
    K: "#101010",
    // gorilla: charcoal fur with a silver back, tan face/chest, amber eyes
    F: "#3b3d4a",
    f: "#24252e",
    V: "#9aa1b3",
    t: "#d9b48c",
    u: "#a9835e",
    E: "#ffb52e",
    R: "#c83a3a",
    // captive: copper curls, lilac dress
    H: "#e2662a",
    h: "#a8411a",
    P: "#b48cf0",
    p: "#7a55c2",
    Q: "#ff8fb0",
    // barrels: oak with dark iron hoops; the blue barrel swaps these (see variants)
    b: "#c8782c",
    N: "#5a2e12",
    n: "#7a3f17",
    l: "#f0b070",
    // fire creature
    r: "#ff3d14",
    A: "#ffd23f",
    a: "#ff8a1a",
    // steel drum with a hazard band
    D: "#1e4a4c",
    d: "#3c7f82",
    Z: "#ffd23f",
    // girders, rivets, hearts, items
    I: "#e5413a",
    i: "#ff9a7a",
    J: "#7a1a1a",
    X: "#ffd84a",
    x: "#b08a10",
    C: "#ff4f9a",
    c: "#b0185a",
    L: "#4fd0ff",
    U: "#2f7fd8"
  };
  const HEAD = [
    "................",
    ".....GGGGGG.....",
    "....GGGGGGGGGG..",
    "....gggggggggggg",
    "....MMSSSKSS....",
    "...MSMSSSKSSS...",
    "...MSMSSSSSMMMM.",
    "....MSSSSMMMMM..",
    ".....SSSSSSS...."
  ];
  const BODY = {
    stand: [
      "....YYOYYOY.....",
      "...YYYOOOOYY....",
      "..SYYOOWOOWYS...",
      "..SSTTTTTTTSS...",
      "....OOOOOOO.....",
      "....OOO.OOO.....",
      "...BBBB.BBBB...."
    ],
    walk1: [
      "....YYOYYOY.....",
      "...YYYOOOOYYS...",
      "..SYYOOWOOWYS...",
      "..S.TTTTTTT.....",
      "...OOOOOOOOO....",
      "..OOO.....OOO...",
      ".BBB.......BBB.."
    ],
    walk2: [
      "....YYOYYOY.....",
      "..SYYYOOOOYY....",
      "..SYYOOWOOWY....",
      "....TTTTTTTS....",
      "....OOOOOOO.....",
      ".....OOOOO......",
      "....BBBBBBB....."
    ],
    jump: [
      "..S.YYOYYOY..S..",
      "..SYYYOOOOYYYS..",
      "...YYOOWOOWY....",
      "....TTTTTTT.....",
      "...OOOOOOOOO....",
      "..OOO.....OOO...",
      ".BBB.......BBB.."
    ],
    hamUp: [
      "....YYOYYOYSS...",
      "...YYYOOOOYYS...",
      "..SYYOOWOOWY....",
      "..SSTTTTTTT.....",
      "....OOOOOOO.....",
      "....OOO.OOO.....",
      "...BBBB.BBBB...."
    ],
    hamDown: [
      "....YYOYYOY.....",
      "...YYYOOOOYYYSS.",
      "..SYYOOWOOWY.SS.",
      "..SSTTTTTTT.....",
      "....OOOOOOO.....",
      "....OOO.OOO.....",
      "...BBBB.BBBB...."
    ]
  };
  const BACK_HEAD = [
    "................",
    ".....GGGGGG.....",
    "....GGGGGGGG....",
    "....gggggggg....",
    "....MMMMMMMM....",
    "...SMMMMMMMMS...",
    "....MMMMMMMM....",
    ".....MMMMMM.....",
    "......SSSS......"
  ];
  const CLIMB = {
    climb1: [
      "..S.YYYYYYY.....",
      "..SYYOYYYOYY....",
      "...YYOOOOOYYS...",
      "....TTTTTTTSS...",
      "....OOOOOOO.....",
      "....OOO..OOO....",
      "...BBBB...BBB..."
    ],
    climb2: [
      ".....YYYYYYY.S..",
      "....YYOYYYOYYS..",
      "..SYYOOOOOYY....",
      "..SSTTTTTTT.....",
      ".....OOOOOOO....",
      "....OOO..OOO....",
      "...BBB...BBBB..."
    ]
  };
  const hero = {};
  for (const k in BODY) hero["hero_" + k] = { w: 16, h: 16, ax: 8, ay: 16, px: HEAD.slice(0, 9).concat(BODY[k]) };
  for (const k in CLIMB) hero["hero_" + k] = { w: 16, h: 16, ax: 8, ay: 16, px: BACK_HEAD.concat(CLIMB[k]) };
  hero.hero_dead = { w: 16, h: 16, ax: 8, ay: 16, px: [
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    ".......SS.......",
    "..G.MSSSSSMYYOOB",
    ".GGgMSKSSSMYOOOB",
    ".GGgMSSSSMYYWOOB",
    "..GgMMMMSSYYOOBB",
    ".....MMM..SS.SS.",
    "................"
  ] };
  const hammer = {
    hammer_up: { w: 10, h: 10, ax: 5, ay: 10, px: [
      "..NNNNNN..",
      ".NbbbbbbN.",
      ".NblllbbN.",
      ".NbbbbbbN.",
      "..NNNNNN..",
      "....TT....",
      "....TT....",
      "....TT....",
      "....TT....",
      "....TT...."
    ] },
    hammer_side: { w: 10, h: 10, ax: 0, ay: 10, px: [
      "..........",
      "..........",
      "......NNN.",
      ".....NbbbN",
      ".....NblbN",
      "TTTTTNblbN",
      "TTTTTNbbbN",
      ".....NbbbN",
      "......NNN.",
      ".........."
    ] }
  };
  const APE_L = {
    idle: [
      "................",
      "..........fffff.",
      "........ffFFFFFF",
      ".......fFFFFFFFF",
      "......fFFFffffff",
      "......fFFfffffff",
      "......fFFtEEKttt",
      "......fFFtEEKttt",
      "......fFFttttttt",
      ".....fFFFtttttuu",
      ".....fFFttKKKKKK",
      ".....fFFttKWWWWW",
      ".....fFFFttKKKKK",
      "....fFFFFFttttVV",
      "...fFFFFFVVVVVVV",
      "..fFFFFVVVVVtttt",
      ".fFFFFFVVVVttttt",
      ".fFFFfFFVVtttttu",
      "fFFFffFFFFttttuu",
      "fFFFf.fFFFtttttt",
      "fFFFf.fFFFFttttt",
      "fFFFf.fFFFFFtttt",
      "fFFF..fFFFFFFFFF",
      "tttt..ffFFFFFFFF",
      "tttt...fFFFFFFFF",
      "ttt....fFFFFFFF.",
      ".......fFFFFF...",
      "......fFFFFFF...",
      ".....fFFFFFFf...",
      "....ttttttt.....",
      "...tttttttt.....",
      "................"
    ],
    up: [
      "tttt............",
      "tttt......fffff.",
      "fFFf....ffFFFFFF",
      "fFFf...fFFFFFFFF",
      ".fFFf.fFFFffffff",
      ".fFFf.fFFfffffff",
      "..fFFffFFtEEKttt",
      "..fFFFFFFtEEKttt",
      "...fFFFFFttttttt",
      "....fFFFFtttttuu",
      ".....fFFttKKKKKK",
      ".....fFFttKWWWWW",
      ".....fFFFttRRRRR",
      "....fFFFFFttttVV",
      "....fFFFFVVVVVVV",
      "....fFFVVVVVtttt",
      "....fFFVVVVttttt",
      "....fFFFVVtttttu",
      "....fFFFFFttttuu",
      ".....fFFFFtttttt",
      ".....fFFFFFttttt",
      ".....fFFFFFFtttt",
      ".....fFFFFFFFFFF",
      "......ffFFFFFFFF",
      ".......fFFFFFFFF",
      ".......fFFFFFFF.",
      ".......fFFFFF...",
      "......fFFFFFF...",
      ".....fFFFFFFf...",
      "....ttttttt.....",
      "...tttttttt.....",
      "................"
    ]
  };
  const mirror = (row) => row.split("").reverse().join("");
  const join = (L, R) => L.map((r, i) => r + mirror(R[i]));
  const ape = {
    ape_idle: { w: 32, h: 32, ax: 16, ay: 32, px: join(APE_L.idle, APE_L.idle) },
    ape_up: { w: 32, h: 32, ax: 16, ay: 32, px: join(APE_L.up, APE_L.up) },
    ape_pound: { w: 32, h: 32, ax: 16, ay: 32, px: join(APE_L.up, APE_L.idle) }
  };
  const CAP = [
    ".....HHHHHH.....",
    "...HHHHHHHHHH...",
    "..HHHhhhhhhHHH..",
    "..HHSSSSSSSSHH..",
    ".HHSSKSSSSKSSHH.",
    ".HHSSSSSSSSSSHH.",
    ".HHSSSSQQSSSSHH.",
    "..HHSSSSSSSSHH..",
    "..HHH.SSSS.HHH..",
    "....PPPPPPPP....",
    "...PPPpPPpPPP...",
    "..SPPPPPPPPPPS..",
    "..SPPPPPPPPPPS..",
    "..S.PPPPPPPP.S..",
    "....PPPPPPPP....",
    "...PPPPPPPPPP...",
    "...PPPPPPPPPP...",
    "..PPPPPPPPPPPP..",
    "..pPpPpPpPpPpP..",
    ".....SS..SS.....",
    ".....SS..SS.....",
    "....WWW..WWW...."
  ];
  const CAP_HELP = CAP.slice();
  CAP_HELP[4] = "SHHSSKSSSSKSSHH.";
  CAP_HELP[5] = "SHHSSSSSSSSSSHH.";
  CAP_HELP[6] = "SHHSSSSQQSSSSHH.";
  CAP_HELP[7] = "SSHHSSSSSSSSHH..";
  CAP_HELP[8] = ".SHHH.SSSS.HHH..";
  CAP_HELP[9] = "..S.PPPPPPPP....";
  CAP_HELP[11] = "...PPPPPPPPPPS..";
  CAP_HELP[12] = "...PPPPPPPPPPS..";
  CAP_HELP[13] = "....PPPPPPPP.S..";
  const captive = {
    captive_stand: { w: 16, h: 22, ax: 8, ay: 22, px: CAP },
    captive_help: { w: 16, h: 22, ax: 8, ay: 22, px: CAP_HELP }
  };
  const rollFrame = (k) => {
    const rows = ["...NNNNNN...", ".NNbbbbbbNN."];
    for (let r = 0; r < 6; r++) {
      let s = "N";
      for (let c = 1; c < 11; c++) s += (c + k * 2) % 5 === 0 ? "n" : r === 0 ? "l" : "b";
      rows.push(s + "N");
    }
    rows.push(".NNbbbbbbNN.", "...NNNNNN...");
    return rows;
  };
  const barrel = {};
  for (let k = 0; k < 4; k++) barrel["barrel_" + k] = { w: 12, h: 10, ax: 6, ay: 10, px: rollFrame(k) };
  barrel.barrel_front = { w: 16, h: 10, ax: 8, ay: 10, px: [
    "...NNNNNNNNNN...",
    ".NNllllllllllNN.",
    "NlllnnnnnnnnlllN",
    "NllnbbbbbbbbnllN",
    "NllnbbNNNNbbnllN",
    "NllnbbNNNNbbnllN",
    "NllnbbbbbbbbnllN",
    "NlllnnnnnnnnlllN",
    ".NNllllllllllNN.",
    "...NNNNNNNNNN..."
  ] };
  barrel.barrel_upright = { w: 10, h: 16, ax: 5, ay: 16, px: [
    "..NNNNNN..",
    ".NllllllN.",
    "NlnnnnnnlN",
    "NbbbbbbbbN",
    "NbbbbbbbbN",
    "NnnnnnnnnN",
    "NbbbbbbbbN",
    "NbbbbbbbbN",
    "NbbbbbbbbN",
    "NbbbbbbbbN",
    "NnnnnnnnnN",
    "NbbbbbbbbN",
    "NbbbbbbbbN",
    "NlnnnnnnlN",
    ".NllllllN.",
    "..NNNNNN.."
  ] };
  const fire = {
    fire_0: { w: 16, h: 16, ax: 8, ay: 16, px: [
      "................",
      "......r.........",
      ".....rr...r.....",
      "....rrr..rr.....",
      "....rArr.rr..r..",
      "...rrAArrrr.rr..",
      "...rAAAArArrrr..",
      "..rrAAaaAAAArr..",
      "..rAAaaaaaaAAr..",
      ".rAAaWKaaWKaAr..",
      ".rAaaWKaaWKaAAr.",
      ".rAaaaaaaaaaaAr.",
      ".rAAaaaaaaaaAAr.",
      "..rAAaaaaaaAAr..",
      "..rrAAAAAAAArr..",
      "...rrrrrrrrrr..."
    ] },
    fire_1: { w: 16, h: 16, ax: 8, ay: 16, px: [
      "................",
      ".........r......",
      ".....r...rr.....",
      ".....rr..rrr....",
      "..r..rr.rrAr....",
      "..rr.rrrrAArr...",
      "..rrrrArAAAAr...",
      "..rrAAAAaaAArr..",
      "..rAAaaaaaaAAr..",
      ".rAAaWKaaWKaAr..",
      ".rAaaWKaaWKaAAr.",
      ".rAaaaaaaaaaaAr.",
      ".rAAaaaaaaaaAAr.",
      "..rAAaaaaaaAAr..",
      "..rrAAAAAAAArr..",
      "...rrrrrrrrrr..."
    ] }
  };
  const drum = {
    drum: { w: 16, h: 16, ax: 8, ay: 16, px: [
      "DDDDDDDDDDDDDDDD",
      "DddddddddddddddD",
      "DDDDDDDDDDDDDDDD",
      ".DddddddddddddD.",
      ".DdZKZKZKZKZKdD.",
      ".DdKZKZKZKZKZdD.",
      ".DddddddddddddD.",
      "DDDDDDDDDDDDDDDD",
      ".DddddddddddddD.",
      ".DddddddddddddD.",
      ".DddddddddddddD.",
      ".DddddddddddddD.",
      "DDDDDDDDDDDDDDDD",
      ".DddddddddddddD.",
      ".DddddddddddddD.",
      "DDDDDDDDDDDDDDDD"
    ] },
    flame_0: { w: 16, h: 10, ax: 8, ay: 10, px: [
      ".....r....r.....",
      "....rr...rr..r..",
      "..r.rAr..rAr.r..",
      "..rrAAr.rAArrr..",
      ".rrAAaArAAaAArr.",
      ".rAAaaaAAaaaAAr.",
      "rrAaaaaaaaaaaArr",
      "rAAaaaaaaaaaaAAr",
      "rAaaaaaaaaaaaaAr",
      "rrrrrrrrrrrrrrrr"
    ] },
    flame_1: { w: 16, h: 10, ax: 8, ay: 10, px: [
      "...r.....r....r.",
      "..rr....rr...rr.",
      ".rAr.r..rAr.rAr.",
      ".rAArr.rrAArAAr.",
      "rrAaAArAAaAAaArr",
      "rAAaaaAAaaaaaAAr",
      "rAaaaaaaaaaaaaAr",
      "rAAaaaaaaaaaaAAr",
      "rAaaaaaaaaaaaaAr",
      "rrrrrrrrrrrrrrrr"
    ] }
  };
  const tiles = {
    girder: { w: 8, h: 8, ax: 0, ay: 0, px: ["iiiiiiii", "IJIIIIJI", ".I....I.", "..I..I..", "...II...", "..I..I..", ".I....I.", "IIIIIIII"] },
    rivet: { w: 8, h: 8, ax: 4, ay: 0, px: [".XXXXXX.", "XxxxxxxX", "XxXXXXxX", "XxXKKXxX", "XxXKKXxX", "XxXXXXxX", "XxxxxxxX", ".XXXXXX."] }
  };
  const ladderColor = "#4fd0ff", ladderColor2 = "#ffb0d0";
  const misc = {
    heart: { w: 15, h: 13, ax: 7, ay: 13, px: [
      "..CCC.....CCC..",
      ".CQQCC...CCCCC.",
      "CQQCCCC.CCCCCCC",
      "CQCCCCCCCCCCCCC",
      "CCCCCCCCCCCCCCC",
      "CCCCCCCCCCCCCCc",
      ".CCCCCCCCCCCCc.",
      "..CCCCCCCCCCc..",
      "...CCCCCCCCc...",
      "....CCCCCCc....",
      ".....CCCCc.....",
      "......CCc......",
      ".......c......."
    ] },
    heart_broken: { w: 15, h: 13, ax: 7, ay: 13, px: [
      "..CCC.....CCC..",
      ".CQQCC...CCCCC.",
      "CQQCCC...CCCCCC",
      "CQCCCC..CCCCCCC",
      "CCCCCCC..CCCCCC",
      "CCCCCC..CCCCCCc",
      ".CCCCCC..CCCCc.",
      "..CCCC..CCCCc..",
      "...CCCC..CCc...",
      "....CC..CCc....",
      ".....CC..c.....",
      "......C........",
      "..............."
    ] },
    item_hat: { w: 16, h: 10, ax: 8, ay: 10, px: [
      ".....PPPPPP.....",
      "....PPPPPPPP....",
      "....pppppppp....",
      "....QQQQQQQQ....",
      "....PPPPPPPP....",
      "..PPPPPPPPPPPP..",
      "PPPPPPPPPPPPPPPP",
      ".PPPPPPPPPPPPPP.",
      "...pppppppppp...",
      "................"
    ] },
    item_purse: { w: 14, h: 14, ax: 7, ay: 14, px: [
      "....pppppp....",
      "...p......p...",
      "..p........p..",
      "..p........p..",
      ".CCCCCCCCCCCC.",
      "CCQQCCCCCCCCCC",
      "CQCCCCXXCCCCCC",
      "CCCCCCXXCCCCCC",
      "CCCCCCCCCCCCCC",
      "CCCCCCCCCCCCCc",
      "CCCCCCCCCCCCCc",
      ".CCCCCCCCCCCc.",
      "..cccccccccc..",
      ".............."
    ] },
    item_umbrella: { w: 16, h: 16, ax: 8, ay: 16, px: [
      ".......P........",
      ".....PPPPPP.....",
      "...PPQPPPPQPP...",
      "..PPQPPPPPPQPP..",
      ".PPPPPPPPPPPPPP.",
      "PPPPPPPPPPPPPPPP",
      "p.p.p.pTp.p.p.p.",
      ".......T........",
      ".......T........",
      ".......T........",
      ".......T........",
      ".......T........",
      ".......T........",
      ".......T..T.....",
      "........TT......",
      "................"
    ] },
    smash_0: { w: 16, h: 16, ax: 8, ay: 8, px: [
      "................",
      ".......W........",
      "...W...W...W....",
      "....W..W..W.....",
      ".....W.W.W......",
      "......WWW.......",
      ".WWWWWWAWWWWWW..",
      "......WWW.......",
      ".....W.W.W......",
      "....W..W..W.....",
      "...W...W...W....",
      ".......W........",
      "................",
      "................",
      "................",
      "................"
    ] },
    smash_1: { w: 16, h: 16, ax: 8, ay: 8, px: [
      "A......A......A.",
      ".A.....A.....A..",
      "..A....A....A...",
      "...A.......A....",
      "................",
      "................",
      "AAAA.......AAAA.",
      "................",
      "................",
      "...A.......A....",
      "..A....A....A...",
      ".A.....A.....A..",
      "A......A......A.",
      "................",
      "................",
      "................"
    ] },
    life: { w: 8, h: 8, ax: 0, ay: 0, px: ["..GGGG..", ".GGGGGG.", ".gggggg.", ".MSSKS..", "MSSSMMM.", ".SSSS...", ".YOYOY..", "..OOO..."] }
  };
  const variants = {
    blue: { b: "#3a86e0", N: "#0f2a6b", n: "#1d4fa0", l: "#a8dcff" },
    rivetsGirder: { I: "#3f62e8", i: "#9ab4ff", J: "#16246a" },
    scared: { r: "#2f7fd8", A: "#cfe8ff", a: "#7fb6ff" },
    hamFlash: { b: "#ffffff", l: "#ffffff", N: "#ffd84a", T: "#ffffff" },
    flash: { G: "#ffffff", Y: "#ffffff", O: "#ffffff", S: "#ffffff", M: "#ffffff", T: "#ffffff", B: "#ffffff", g: "#ffffff" }
  };
  const FONT = {
    w: 5,
    h: 7,
    g: {
      "0": "01110100011001110101110011000101110",
      "1": "00100011000010000100001000010001110",
      "2": "01110100010000100110010001000011111",
      "3": "11110000010000101110000010000111110",
      "4": "00010001100101010010111110001000010",
      "5": "11111100001111000001000011000101110",
      "6": "00110010001000011110100011000101110",
      "7": "11111000010001000100010000100001000",
      "8": "01110100011000101110100011000101110",
      "9": "01110100011000101111000010001001100",
      A: "01110100011000111111100011000110001",
      B: "11110100011000111110100011000111110",
      C: "01110100011000010000100001000101110",
      D: "11100100101000110001100011001011100",
      E: "11111100001000011110100001000011111",
      F: "11111100001000011110100001000010000",
      G: "01110100011000010111100011000101111",
      H: "10001100011000111111100011000110001",
      I: "01110001000010000100001000010001110",
      J: "00111000100001000010000101001001100",
      K: "10001100101010011000101001001010001",
      L: "10000100001000010000100001000011111",
      M: "10001110111010110101100011000110001",
      N: "10001100011100110101100111000110001",
      O: "01110100011000110001100011000101110",
      P: "11110100011000111110100001000010000",
      Q: "01110100011000110001101011001001101",
      R: "11110100011000111110101001001010001",
      S: "01111100001000001110000010000111110",
      T: "11111001000010000100001000010000100",
      U: "10001100011000110001100011000101110",
      V: "10001100011000110001100010101000100",
      W: "10001100011000110101101011010101010",
      X: "10001100010101000100010101000110001",
      Y: "10001100010101000100001000010000100",
      Z: "11111000010001000100010001000011111",
      "=": "00000000001111100000111110000000000",
      "-": "00000000000000011111000000000000000",
      "!": "00100001000010000100001000000000100",
      ".": "00000000000000000000000000110001100",
      ":": "00000011000110000000011000110000000",
      "?": "01110100010000100010001000000000100",
      "'": "00100001000100000000000000000000000",
      "/": "00001000010001000100010001000010000",
      ",": "00000000000000000000001100010001000",
      " ": "00000000000000000000000000000000000"
    }
  };
  const SOUNDS = {
    walk: { seq: [{ wave: "pulse25", vol: 0.1, notes: "A4:0.4" }], bpm: 300 },
    walk2: { seq: [{ wave: "pulse25", vol: 0.1, notes: "E4:0.4" }], bpm: 300 },
    climb: { seq: [{ wave: "pulse25", vol: 0.07, notes: "C5:0.3" }], bpm: 300 },
    jump: { sweep: { wave: "pulse25", f0: 330, f1: 990, dur: 0.16, vol: 0.18 } },
    land: { seq: [{ wave: "triangle", vol: 0.14, notes: "C3:0.5" }], bpm: 300 },
    jumpScore: { seq: [{ wave: "square", vol: 0.12, notes: "E6:0.5 G6:0.5 C7:1" }], bpm: 360 },
    throw: { all: [{ seq: [{ wave: "triangle", vol: 0.32, notes: "G2:1 C2:2" }], bpm: 300 }, { noise: { dur: 0.05, vol: 0.12, hp: 600 } }] },
    bounce: { seq: [{ wave: "triangle", vol: 0.22, notes: "D2:0.6" }], bpm: 300 },
    roll: { seq: [{ wave: "triangle", vol: 0.16, notes: "A2:0.4 R:0.3 A2:0.4" }], bpm: 300 },
    smash: { all: [{ sweep: { wave: "square", f0: 880, f1: 110, dur: 0.22, vol: 0.18 } }, { noise: { dur: 0.08, vol: 0.18, hp: 1200 } }] },
    hammerOn: { seq: [{ wave: "square", vol: 0.14, notes: "C5:0.5 E5:0.5 G5:0.5 C6:1.5" }], bpm: 300 },
    rivet: { seq: [{ wave: "pulse25", vol: 0.15, notes: "G5:0.5 D6:1" }], bpm: 300 },
    item: { seq: [{ wave: "square", vol: 0.13, notes: "A5:0.5 C#6:0.5 E6:0.5 A6:1.5" }], bpm: 300 },
    oil: { all: [{ sweep: { wave: "sawtooth", f0: 90, f1: 420, dur: 0.35, vol: 0.12 } }, { noise: { dur: 0.12, vol: 0.1, hp: 2e3 } }] },
    fireSpawn: { sweep: { wave: "pulse12", f0: 200, f1: 700, dur: 0.18, vol: 0.1 } },
    pound: { seq: [{ wave: "triangle", vol: 0.3, notes: "E2:0.7 R:0.5 E2:0.7 R:0.5 E2:0.7" }], bpm: 300 },
    bonusTick: { seq: [{ wave: "pulse12", vol: 0.05, notes: "C6:0.3" }], bpm: 300 },
    hurry: { seq: [{ wave: "square", vol: 0.12, notes: "A5:0.6 R:0.4 A5:0.6 R:0.4 A5:0.6" }], bpm: 300 },
    extraLife: { seq: [{ wave: "square", vol: 0.14, notes: "C6:1 G5:1 C6:1 E6:1 G6:2 C7:3" }], bpm: 320 },
    click: { seq: [{ wave: "pulse25", vol: 0.1, notes: "C6:0.4" }], bpm: 300 },
    // jingles (one-shots)
    intro: { bpm: 160, seq: [
      { wave: "square", vol: 0.13, notes: "G4:1 C5:1 E5:1 G5:2 R:1 E5:1 G5:1 A5:2 G5:1 E5:1 C6:4" },
      { wave: "triangle", vol: 0.22, notes: "C3:2 G2:2 C3:2 G2:2 F2:2 G2:2 C3:4" }
    ] },
    clear: { bpm: 170, seq: [
      { wave: "square", vol: 0.13, notes: "C5:1 E5:1 G5:1 C6:2 B5:1 C6:1 D6:1 E6:2 D6:1 E6:1 G6:6" },
      { wave: "triangle", vol: 0.22, notes: "C3:2 E3:2 G3:2 G2:2 C3:2 G2:2 C3:6" }
    ] },
    death: { bpm: 150, seq: [
      { wave: "square", vol: 0.14, notes: "E5:2 D#5:2 D5:2 C#5:2 C5:1 R:1 G4:1 R:1 C4:4" },
      { wave: "triangle", vol: 0.2, notes: "E3:4 D3:4 C3:2 G2:2 C2:4" }
    ] },
    gameover: { bpm: 120, seq: [
      { wave: "square", vol: 0.13, notes: "G4:2 E4:2 C4:2 R:1 A4:1 G#4:1 A4:1 B4:1 A4:1 G4:2 E4:2 C4:6" },
      { wave: "triangle", vol: 0.2, notes: "C3:4 A2:4 F2:4 G2:4 C2:6" }
    ] }
  };
  const MUSIC = {
    barrels: { bpm: 152, loop: true, seq: [
      { wave: "pulse25", vol: 0.06, notes: "E5:1 R:1 G5:1 R:1 E5:1 R:1 C5:2 D5:1 R:1 E5:1 R:1 D5:2 R:2  F5:1 R:1 A5:1 R:1 F5:1 R:1 D5:2 B4:1 R:1 D5:1 R:1 G4:2 R:2" },
      { wave: "triangle", vol: 0.16, notes: "C3:1 R:1 G2:1 R:1 C3:1 R:1 G2:1 R:1 C3:1 R:1 G2:1 R:1 C3:1 R:1 E3:1 R:1  F2:1 R:1 C3:1 R:1 F2:1 R:1 C3:1 R:1 G2:1 R:1 D3:1 R:1 G2:1 R:1 B2:1 R:1" }
    ] },
    rivets: { bpm: 140, loop: true, seq: [
      { wave: "pulse25", vol: 0.06, notes: "A4:1 R:1 C5:1 E5:1 R:1 A5:1 G5:1 E5:1  R:1 C5:1 D5:1 E5:2 R:2  F4:1 R:1 A4:1 C5:1 R:1 F5:1 E5:1 C5:1  R:1 B4:1 G#4:1 B4:2 R:2" },
      { wave: "triangle", vol: 0.16, notes: "A2:2 E3:2 A2:2 E3:2 A2:2 E3:2 A2:2 G2:2  F2:2 C3:2 F2:2 C3:2 E2:2 B2:2 E2:2 G#2:2" }
    ] },
    hammer: { bpm: 200, loop: true, seq: [
      { wave: "square", vol: 0.07, notes: "C5:1 G5:1 E5:1 G5:1 C6:1 G5:1 E5:1 G5:1  D5:1 A5:1 F5:1 A5:1 D6:1 A5:1 F5:1 A5:1  E5:1 B5:1 G5:1 B5:1 E6:1 B5:1 G5:1 B5:1  F5:1 C6:1 A5:1 C6:1 G5:1 D6:1 B5:1 D6:1" },
      { wave: "triangle", vol: 0.17, notes: "C3:2 C3:2 G2:2 C3:2 D3:2 D3:2 A2:2 D3:2 E3:2 E3:2 B2:2 E3:2 F3:2 F3:2 G3:2 G2:2" }
    ] }
  };
  const API = {
    title: "GIRDER KING",
    palette: PAL,
    sprites: Object.assign({}, hero, hammer, ape, captive, barrel, fire, drum, tiles, misc),
    variants,
    font: FONT,
    sounds: SOUNDS,
    music: MUSIC,
    ladderColor,
    ladderColor2,
    girderTint: { barrels: null, rivets: "rivetsGirder" }
  };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else root.GK_ASSETS = API;
})(typeof window !== "undefined" ? window : globalThis);
