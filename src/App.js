import { useState, useEffect, useRef, useCallback } from "react";

// ── Supabase 설정 ──────────────────────────────────────────────
const SUPABASE_URL = "https://klesgczkebudkuidhflc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsZXNnY3prZWJ1ZGt1aWRoZmxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTE1MjksImV4cCI6MjA4ODk2NzUyOX0.ZKAAmR2yj9Aia-1-q_3ZAOfx-95MnW9OWz9jpr2qxfw";

const sbFetch = async (path, options={}) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": options.prefer || "return=representation",
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : [];
};

const sbGet = (table, query="") => sbFetch(`/${table}?${query}`);
const sbInsert = (table, data) => sbFetch(`/${table}`, { method:"POST", body:JSON.stringify(data) });
const sbUpdate = (table, id, data) => sbFetch(`/${table}?id=eq.${id}`, { method:"PATCH", body:JSON.stringify(data) });
const sbDelete = (table, id) => sbFetch(`/${table}?id=eq.${id}`, { method:"DELETE", prefer:"" });
// ──────────────────────────────────────────────────────────────

const BOWWWL_BALL = (slug) =>
  `https://www.bowwwl.com/sites/default/files/styles/ball_grid/public/balls/${slug}.png`;
const BOWWWL_CORE = (slug) =>
  `https://www.bowwwl.com/sites/default/files/styles/ball_image_main/public/cores/${slug}.png`;

const ALL_BALLS = [
  // Storm
  {
    id:1, brand:"Storm", name:"Bionic",
    cover:"Hybrid", coreType:"Symmetric", coreName:"Torsion A.I.",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#e91e63",
    ballSlug:"storm-bionic", coreSlug:"storm-torsion-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.050}, 15:{rg:2.470,diff:0.050},
      14:{rg:2.480,diff:0.047}, 13:{rg:2.580,diff:0.047}, 12:{rg:2.640,diff:0.037}
    },
    releaseDate:"Feb 2026", fragrance:"Cherry Cobbler",
    description:"The ultimate symmetrical solution — an all-encompassing ball capable of handling virtually any lane condition."
  },
  {
    id:2, brand:"Storm", name:"Ion Max Pearl",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Element Max A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#1565c0",
    ballSlug:"storm-ion-max-pearl", coreSlug:"storm-element-max-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.055}, 15:{rg:2.480,diff:0.053},
      14:{rg:2.490,diff:0.050}, 13:{rg:2.580,diff:0.045}, 12:{rg:2.640,diff:0.038}
    },
    releaseDate:"Jan 2026", fragrance:"Blue Ice",
    description:"Pearl asymmetric powerhouse built on the proven Element Max A.I. core for explosive backend motion."
  },
  // Brunswick
  {
    id:3, brand:"Brunswick", name:"Combat Hybrid",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Rampart",
    finish:"500/2000 Siaair", condition:"Medium-Heavy Oil", accent:"#f57f17",
    ballSlug:"brunswick-combat-hybrid", coreSlug:"brunswick-rampart-core",
    weightData:{
      16:{rg:2.515,diff:0.043,moi:0.016}, 15:{rg:2.502,diff:0.051,moi:0.019},
      14:{rg:2.513,diff:0.051,moi:0.019}, 13:{rg:2.597,diff:0.041,moi:0.014}, 12:{rg:2.593,diff:0.041,moi:0.014}
    },
    releaseDate:"Feb 2026",
    description:"Tactical evolution for midlane dominance. Alpha Premier Hybrid cover + Rampart core."
  },
  {
    id:4, brand:"Brunswick", name:"Crown Victory Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"Tiered Hexagon",
    finish:"Crown Factory Compound", condition:"Medium Oil", accent:"#c62828",
    ballSlug:"brunswick-crown-victory-pearl", coreSlug:"brunswick-crown-victory-pearl-core",
    weightData:{
      16:{rg:2.540,diff:0.045}, 15:{rg:2.545,diff:0.043},
      14:{rg:2.555,diff:0.040}, 13:{rg:2.635,diff:0.036}, 12:{rg:2.695,diff:0.030}
    },
    releaseDate:"Jan 2026",
    description:"Pearl symmetric delivering clean length with powerful backend reaction for medium conditions."
  },
  // Roto Grip
  {
    id:5, brand:"Roto Grip", name:"Gremlin Tour-X",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Catalyst A.I.",
    finish:"4000 Abralon", condition:"Medium Oil", accent:"#6a1b9a",
    ballSlug:"roto-grip-gremlin-tour-x", coreSlug:"roto-grip-catalyst-ai-core",
    weightData:{
      16:{rg:2.480,diff:0.034,moi:0.014}, 15:{rg:2.490,diff:0.032,moi:0.013},
      14:{rg:2.500,diff:0.030}, 13:{rg:2.585,diff:0.026}, 12:{rg:2.645,diff:0.022}
    },
    releaseDate:"Feb 2026",
    description:"Tour-level asymmetric hybrid for the most demanding lane conditions professionals face."
  },
  {
    id:6, brand:"Roto Grip", name:"Transformer",
    cover:"Solid", coreType:"Asymmetric", coreName:"Nano A.I.",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#00695c",
    ballSlug:"roto-grip-transformer", coreSlug:"roto-grip-nano-ai-core",
    weightData:{
      16:{rg:2.510,diff:0.051,moi:0.017}, 15:{rg:2.520,diff:0.049,moi:0.016},
      14:{rg:2.530,diff:0.046}, 13:{rg:2.615,diff:0.041}, 12:{rg:2.675,diff:0.034}
    },
    releaseDate:"Jan 2026",
    description:"Transforms any heavy oil environment into a scoring opportunity."
  },
  // Motiv
  {
    id:7, brand:"Motiv", name:"Supra Sport",
    cover:"Solid", coreType:"Symmetric", coreName:"Quadfire",
    finish:"4000 LSS", condition:"Light-Medium Oil", accent:"#ef6c00",
    ballSlug:"motiv-supra-sport", coreSlug:"motiv-quadfire-core",
    weightData:{
      16:{rg:2.550,diff:0.043}, 15:{rg:2.560,diff:0.041},
      14:{rg:2.570,diff:0.038}, 13:{rg:2.650,diff:0.034}, 12:{rg:2.710,diff:0.028}
    },
    releaseDate:"Feb 2026",
    description:"Sport performance solid symmetric — the ultimate control ball for medium to light oil."
  },
  {
    id:8, brand:"Motiv", name:"Evoke Mayhem",
    cover:"Solid", coreType:"Asymmetric", coreName:"Overload",
    finish:"2000 LSS", condition:"Heavy Oil", accent:"#b71c1c",
    ballSlug:"motiv-evoke-mayhem", coreSlug:"motiv-overload-core",
    weightData:{
      16:{rg:2.480,diff:0.050,moi:0.017}, 15:{rg:2.490,diff:0.048,moi:0.016},
      14:{rg:2.500,diff:0.045}, 13:{rg:2.590,diff:0.040}, 12:{rg:2.650,diff:0.033}
    },
    releaseDate:"Jan 2026",
    description:"Evoke your inner power with Turbulent V2 core and Infusion-MX solid coverstock."
  },
  // Hammer
  {
    id:9, brand:"Hammer", name:"Black Widow 3.0 Dynasty",
    cover:"Solid", coreType:"Asymmetric", coreName:"Gas Mask",
    finish:"500/1000/2000 Siaair", condition:"Heavy Oil", accent:"#1c1c1e",
    ballSlug:"hammer-black-widow-30-dynasty", coreSlug:"hammer-gas-mask-core",
    weightData:{
      16:{rg:2.500,diff:0.058,moi:0.018}, 15:{rg:2.510,diff:0.056,moi:0.017},
      14:{rg:2.520,diff:0.053}, 13:{rg:2.605,diff:0.048}, 12:{rg:2.665,diff:0.041}
    },
    releaseDate:"Feb 2026",
    description:"The Dynasty of the most iconic bowling ball line. Gas Mask core + maximum asymmetric power."
  },
  {
    id:10, brand:"Hammer", name:"Hammerhead Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"Hammerhead",
    finish:"Crown Factory Compound", condition:"Medium Oil", accent:"#4e342e",
    ballSlug:"hammer-hammerhead-pearl", coreSlug:"hammer-hammerhead-core",
    weightData:{
      16:{rg:2.481,diff:0.048}, 15:{rg:2.490,diff:0.046},
      14:{rg:2.500,diff:0.043}, 13:{rg:2.585,diff:0.038}, 12:{rg:2.645,diff:0.032}
    },
    releaseDate:"Jan 2026",
    description:"Sharpen your attack — Hammerhead symmetric pearl for clean length and explosive backend."
  },
  // 900 Global
  {
    id:11, brand:"900 Global", name:"Vengeance",
    cover:"Solid", coreType:"Symmetric", coreName:"Vengeance",
    finish:"2000 Abralon", condition:"Heavy Oil", accent:"#1c1c1e",
    ballSlug:"900-global-vengeance", coreSlug:"900-global-vengeance-core",
    weightData:{
      16:{rg:2.470,diff:0.055}, 15:{rg:2.480,diff:0.053},
      14:{rg:2.490,diff:0.050}, 13:{rg:2.580,diff:0.045}, 12:{rg:2.640,diff:0.038}
    },
    releaseDate:"Jan 2026",
    description:"Vengeance is coming. Heavy oil solid symmetric for maximum pin carry and continuation."
  },
  {
    id:12, brand:"900 Global", name:"Phantom Cruise",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Phantom",
    finish:"3000 Abralon", condition:"Medium-Heavy Oil", accent:"#4a148c",
    ballSlug:"900-global-phantom-cruise", coreSlug:"900-global-phantom-core",
    weightData:{
      16:{rg:2.480,diff:0.056,moi:0.014}, 15:{rg:2.490,diff:0.054,moi:0.013},
      14:{rg:2.500,diff:0.051}, 13:{rg:2.590,diff:0.046}, 12:{rg:2.650,diff:0.039}
    },
    releaseDate:"Nov 2025",
    description:"Ghost-like asymmetric pearl gliding through the fronts and erupting on the backend."
  },
  // DV8
  {
    id:13, brand:"DV8", name:"Dark Side Curse",
    cover:"Solid", coreType:"Symmetric", coreName:"Duality",
    finish:"500/1000/1500 Siaair, Crown Factory Compound", condition:"Medium Oil", accent:"#4e342e",
    ballSlug:"dv8-dark-side-curse", coreSlug:"dv8-duality-core",
    weightData:{
      16:{rg:2.494,diff:0.031}, 15:{rg:2.480,diff:0.036},
      14:{rg:2.503,diff:0.035}, 13:{rg:2.577,diff:0.043}, 12:{rg:2.599,diff:0.043}
    },
    releaseDate:"Jan 2026",
    description:"Join the dark side — symmetric solid for controlled, predictable medium oil performance."
  },
  {
    id:14, brand:"DV8", name:"Heckler Hybrid",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Turmoil",
    finish:"Crown Factory Compound", condition:"Medium-Heavy Oil", accent:"#263238",
    ballSlug:"dv8-heckler-hybrid", coreSlug:"dv8-turmoil-core",
    weightData:{
      16:{rg:2.504,diff:0.051,moi:0.018}, 15:{rg:2.514,diff:0.049,moi:0.017},
      14:{rg:2.524,diff:0.046}, 13:{rg:2.609,diff:0.041}, 12:{rg:2.669,diff:0.034}
    },
    releaseDate:"Nov 2025",
    description:"Heckle the competition with serious midlane dominance and powerful backend motion."
  },
  // Ebonite
  {
    id:15, brand:"Ebonite", name:"Spartan",
    cover:"Solid", coreType:"Asymmetric", coreName:"Piston",
    finish:"500/1500 Siaair", condition:"Heavy Oil", accent:"#546e7a",
    ballSlug:"ebonite-spartan", coreSlug:"ebonite-piston-core",
    weightData:{
      16:{rg:2.473,diff:0.053,moi:0.017}, 15:{rg:2.483,diff:0.051,moi:0.016},
      14:{rg:2.493,diff:0.048}, 13:{rg:2.578,diff:0.043}, 12:{rg:2.638,diff:0.036}
    },
    releaseDate:"Feb 2026",
    description:"Spartan discipline meets modern coverstock — heavy oil asymmetric supremacy."
  },
  {
    id:16, brand:"Ebonite", name:"The One Ovation",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Gear",
    finish:"Crown Factory Compound", condition:"Heavy Oil", accent:"#1b5e20",
    ballSlug:"ebonite-the-one-ovation", coreSlug:"ebonite-gear-core",
    weightData:{
      16:{rg:2.466,diff:0.056,moi:0.019}, 15:{rg:2.476,diff:0.054,moi:0.018},
      14:{rg:2.486,diff:0.051}, 13:{rg:2.571,diff:0.046}, 12:{rg:2.631,diff:0.039}
    },
    releaseDate:"Sep 2025",
    description:"Give a standing ovation to the most iconic name in bowling — boldly reimagined."
  },
  // Columbia 300
  {
    id:17, brand:"Columbia 300", name:"Piranha Solid",
    cover:"Solid", coreType:"Symmetric", coreName:"Piranha",
    finish:"500/1500 Siaair", condition:"Medium Oil", accent:"#00838f",
    ballSlug:"columbia-300-piranha-solid", coreSlug:"columbia-300-piranha-core",
    weightData:{
      16:{rg:2.554,diff:0.043}, 15:{rg:2.564,diff:0.041},
      14:{rg:2.574,diff:0.038}, 13:{rg:2.654,diff:0.034}, 12:{rg:2.714,diff:0.028}
    },
    releaseDate:"Feb 2026",
    description:"The Piranha bites hard — solid symmetric cover for aggressive medium oil performance."
  },
  {
    id:18, brand:"Columbia 300", name:"Street Rally",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Formula",
    finish:"Crown Factory Compound", condition:"Medium Oil", accent:"#1565c0",
    ballSlug:"columbia-300-street-rally", coreSlug:"columbia-300-formula-core",
    weightData:{
      16:{rg:2.478,diff:0.050,moi:0.015}, 15:{rg:2.488,diff:0.048,moi:0.014},
      14:{rg:2.498,diff:0.045}, 13:{rg:2.583,diff:0.040}, 12:{rg:2.643,diff:0.033}
    },
    releaseDate:"Dec 2025",
    description:"Rally on any condition — asymmetric pearl for explosive backend motion."
  },
  // SWAG
  {
    id:19, brand:"SWAG", name:"Serpent Hybrid",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Scale",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#2e7d32",
    ballSlug:"swag-serpent-hybrid", coreSlug:"swag-scale-core",
    weightData:{
      16:{rg:2.510,diff:0.048,moi:0.016}, 15:{rg:2.520,diff:0.046,moi:0.015},
      14:{rg:2.530,diff:0.043}, 13:{rg:2.615,diff:0.038}, 12:{rg:2.675,diff:0.031}
    },
    releaseDate:"Feb 2026",
    description:"Strike like a serpent — asymmetric hybrid with calculated, deadly motion through the oil."
  },
  {
    id:20, brand:"SWAG", name:"Assassin Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"Blade",
    finish:"1500 Abralon", condition:"Medium Oil", accent:"#880e4f",
    ballSlug:"swag-assassin-pearl", coreSlug:"swag-blade-core",
    weightData:{
      16:{rg:2.520,diff:0.048}, 15:{rg:2.530,diff:0.046},
      14:{rg:2.540,diff:0.043}, 13:{rg:2.625,diff:0.038}, 12:{rg:2.685,diff:0.031}
    },
    releaseDate:"Jan 2026",
    description:"Silently precise — pearl symmetric assassin for clean, angular medium oil performance."
  },
  // Radical
  {
    id:21, brand:"Radical", name:"Deep Impact",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Astrophysics",
    finish:"500/2000 Siaair", condition:"Heavy Oil", accent:"#d32f2f",
    ballSlug:"radical-deep-impact", coreSlug:"radical-astrophysics-core",
    weightData:{
      16:{rg:2.480,diff:0.052,moi:0.018}, 15:{rg:2.490,diff:0.050,moi:0.017},
      14:{rg:2.500,diff:0.047}, 13:{rg:2.585,diff:0.042}, 12:{rg:2.645,diff:0.035}
    },
    releaseDate:"Feb 2026",
    description:"Make a deep impact on the heaviest oil with the Astrophysics asymmetric core."
  },
  {
    id:22, brand:"Radical", name:"Outer Limits Black Hole",
    cover:"Solid", coreType:"Asymmetric", coreName:"Astrophysics",
    finish:"Crown Factory Compound", condition:"Heavy Oil", accent:"#212121",
    ballSlug:"radical-outer-limits-black-hole", coreSlug:"radical-astrophysics-core",
    weightData:{
      16:{rg:2.499,diff:0.051,moi:0.017}, 15:{rg:2.509,diff:0.049,moi:0.016},
      14:{rg:2.519,diff:0.046}, 13:{rg:2.604,diff:0.041}, 12:{rg:2.664,diff:0.034}
    },
    releaseDate:"Jan 2026",
    description:"Push beyond the outer limits — the Black Hole swallows anything in its path."
  },
  // Track
  {
    id:23, brand:"Track", name:"Synthesis",
    cover:"Solid", coreType:"Asymmetric", coreName:"Kinetic",
    finish:"500/1500 Siaair", condition:"Heavy Oil", accent:"#1565c0",
    ballSlug:"track-synthesis", coreSlug:"track-kinetic-core",
    weightData:{
      16:{rg:2.480,diff:0.053,moi:0.017}, 15:{rg:2.490,diff:0.051,moi:0.016},
      14:{rg:2.500,diff:0.048}, 13:{rg:2.585,diff:0.043}, 12:{rg:2.645,diff:0.036}
    },
    releaseDate:"Feb 2026",
    description:"The synthesis of everything Track does best in one powerful asymmetric solid."
  },
  {
    id:24, brand:"Track", name:"Stealth Mode Hybrid",
    cover:"Hybrid", coreType:"Symmetric", coreName:"Stealth",
    finish:"Crown Factory Compound", condition:"Medium-Heavy Oil", accent:"#37474f",
    ballSlug:"track-stealth-mode-hybrid", coreSlug:"track-stealth-core",
    weightData:{
      16:{rg:2.482,diff:0.056}, 15:{rg:2.492,diff:0.054},
      14:{rg:2.502,diff:0.051}, 13:{rg:2.587,diff:0.046}, 12:{rg:2.647,diff:0.039}
    },
    releaseDate:"Jan 2026",
    description:"Operate in stealth mode — symmetric hybrid that strikes without warning."
  },

  // ── 2023-2025 신규 추가 ──────────────────────────────────────────
  // Storm
  {
    id:25, brand:"Storm", name:"Ion Pro",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Element Tour A.I.",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-ion-pro", coreSlug:"storm-element-tour-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.035,moi:0.013}, 15:{rg:2.470,diff:0.035,moi:0.014},
      14:{rg:2.510,diff:0.036,moi:0.010}, 13:{rg:2.560,diff:0.034,moi:0.011}, 12:{rg:2.580,diff:0.031,moi:0.009}
    },
    releaseDate:"Jun 2024",
    description:"Storm's first asymmetric benchmark ball — versatile, forgiving, built for every style."
  },
  {
    id:26, brand:"Storm", name:"Phaze A.I.",
    cover:"Pearl", coreType:"Symmetric", coreName:"Velocity A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-phaze-ai", coreSlug:"storm-velocity-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.053}, 15:{rg:2.470,diff:0.053},
      14:{rg:2.520,diff:0.052}, 13:{rg:2.580,diff:0.047}, 12:{rg:2.640,diff:0.037}
    },
    releaseDate:"Oct 2024",
    description:"Think Phaze II, but pearl — A.I. core technology meets TX-16 Pearl for explosive backend."
  },
  // Brunswick
  {
    id:27, brand:"Brunswick", name:"Ethos",
    cover:"Pearl", coreType:"Symmetric", coreName:"Ethos",
    finish:"500/1000/1500 Siaair, Crown Factory Compound", condition:"Medium Oil", accent:"#e65100",
    ballSlug:"brunswick-ethos", coreSlug:"brunswick-ethos-core",
    weightData:{
      16:{rg:2.495,diff:0.046}, 15:{rg:2.481,diff:0.053},
      14:{rg:2.505,diff:0.053}, 13:{rg:2.510,diff:0.047}, 12:{rg:2.577,diff:0.045}
    },
    releaseDate:"Oct 2023",
    description:"Brunswick's ethos in ball form — HK22 pearl cover with sweeping backend motion."
  },
  {
    id:28, brand:"Brunswick", name:"Mesmerize",
    cover:"Solid", coreType:"Asymmetric", coreName:"Tri-Elliptic",
    finish:"500/1500 Siaair Micro Pad", condition:"Heavy Oil", accent:"#e65100",
    ballSlug:"brunswick-mesmerize", coreSlug:"brunswick-tri-elliptic-core",
    weightData:{
      16:{rg:2.521,diff:0.048,moi:0.014}, 15:{rg:2.510,diff:0.056,moi:0.017},
      14:{rg:2.533,diff:0.056,moi:0.016}, 13:{rg:2.597,diff:0.041,moi:0.014}, 12:{rg:2.593,diff:0.041,moi:0.014}
    },
    releaseDate:"Aug 2024",
    description:"HK22C-Evo Solid with the new Tri-Elliptic D.O.T. core — Brunswick's biggest hooking ball ever."
  },
  // Roto Grip
  {
    id:29, brand:"Roto Grip", name:"Attention Star",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Momentous AV + A.I.",
    finish:"Reacta Gloss", condition:"Medium-Heavy Oil", accent:"#c62828",
    ballSlug:"roto-grip-attention-star", coreSlug:"roto-grip-momentous-av-ai-core",
    weightData:{
      16:{rg:2.480,diff:0.052,moi:0.017}, 15:{rg:2.480,diff:0.049,moi:0.017},
      14:{rg:2.530,diff:0.046,moi:0.014}, 13:{rg:2.560,diff:0.034,moi:0.011}, 12:{rg:2.580,diff:0.031,moi:0.009}
    },
    releaseDate:"Feb 2024",
    description:"eTrax PLUS Pearl with the Momentous AV + A.I. core — a ball motion unlike anything on earth."
  },
  {
    id:30, brand:"Roto Grip", name:"Optimum Idol",
    cover:"Solid", coreType:"Symmetric", coreName:"Ikon + A.I.",
    finish:"2000 Abralon", condition:"Medium-Heavy Oil", accent:"#c62828",
    ballSlug:"roto-grip-optimum-idol", coreSlug:"roto-grip-ikon-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.054}, 15:{rg:2.470,diff:0.056},
      14:{rg:2.510,diff:0.054}, 13:{rg:2.580,diff:0.047}, 12:{rg:2.640,diff:0.037}
    },
    releaseDate:"Mar 2024",
    description:"MicroTrax Solid particle cover with the Ikon + A.I. core — a cheat code for any lane condition."
  },
  // Motiv
  {
    id:31, brand:"Motiv", name:"Jackal Onyx",
    cover:"Solid", coreType:"Asymmetric", coreName:"Predator V2",
    finish:"1000 LSS", condition:"Heavy Oil", accent:"#6a1b9a",
    ballSlug:"motiv-jackal-onyx", coreSlug:"motiv-predator-v2-core",
    weightData:{
      16:{rg:2.480,diff:0.047,moi:0.013}, 15:{rg:2.480,diff:0.047,moi:0.013},
      14:{rg:2.510,diff:0.044,moi:0.011}, 13:{rg:2.560,diff:0.040,moi:0.009}, 12:{rg:2.620,diff:0.034,moi:0.008}
    },
    releaseDate:"Jan 2025",
    description:"Leverage HXC Solid with Duramax tech and the Predator V2 core — maximum hook, relentless traction."
  },
  {
    id:32, brand:"Motiv", name:"Nuclear Forge",
    cover:"Pearl", coreType:"Symmetric", coreName:"Detonator",
    finish:"1500 LSS", condition:"Medium-Heavy Oil", accent:"#6a1b9a",
    ballSlug:"motiv-nuclear-forge", coreSlug:"motiv-detonator-core",
    weightData:{
      16:{rg:2.470,diff:0.054}, 15:{rg:2.470,diff:0.055},
      14:{rg:2.500,diff:0.052}, 13:{rg:2.560,diff:0.046}, 12:{rg:2.620,diff:0.039}
    },
    releaseDate:"May 2024",
    description:"Propulsion HVP Pearl with the Detonator symmetric core — electrifying length and explosive backend motion."
  },
  // Hammer
  {
    id:33, brand:"Hammer", name:"Black Widow 3.0",
    cover:"Solid", coreType:"Asymmetric", coreName:"Gas Mask",
    finish:"500/1000/2000 Siaair Micro Pad", condition:"Heavy Oil", accent:"#212121",
    ballSlug:"hammer-black-widow-30", coreSlug:"hammer-gas-mask-core",
    weightData:{
      16:{rg:2.510,diff:0.048,moi:0.015}, 15:{rg:2.500,diff:0.058,moi:0.016},
      14:{rg:2.500,diff:0.056,moi:0.016}, 13:{rg:2.589,diff:0.043,moi:0.011}, 12:{rg:2.612,diff:0.043,moi:0.011}
    },
    releaseDate:"Jan 2024",
    description:"HK22 Aggression Solid with the legendary Gas Mask core — the Black Widow line's most powerful solid yet."
  },
  {
    id:34, brand:"Hammer", name:"Effect Tour",
    cover:"Solid", coreType:"Asymmetric", coreName:"Huntsman Tour",
    finish:"500/1500 Siaair Micro Pad", condition:"Medium Oil", accent:"#212121",
    ballSlug:"hammer-effect-tour", coreSlug:"hammer-huntsman-tour-core",
    weightData:{
      16:{rg:2.472,diff:0.036,moi:0.012}, 15:{rg:2.472,diff:0.036,moi:0.012},
      14:{rg:2.472,diff:0.036,moi:0.012}, 13:{rg:2.597,diff:0.041,moi:0.011}, 12:{rg:2.612,diff:0.041,moi:0.011}
    },
    releaseDate:"Nov 2024",
    description:"TourV3 Solid with the low-diff Huntsman Tour core — smooth, predictable, precision motion for demanding patterns."
  },
  // 900 Global
  {
    id:35, brand:"900 Global", name:"Zen 25",
    cover:"Pearl", coreType:"Symmetric", coreName:"Meditate A.I.",
    finish:"Power Edge", condition:"Medium-Heavy Oil", accent:"#1565c0",
    ballSlug:"900-global-zen-25", coreSlug:"900-global-meditate-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.053}, 15:{rg:2.480,diff:0.053},
      14:{rg:2.490,diff:0.051}, 13:{rg:2.560,diff:0.046}, 12:{rg:2.580,diff:0.039}
    },
    releaseDate:"Jan 2025",
    description:"RB 83 Pearl with the Meditate A.I. symmetric core — Zen's 25th anniversary, pushed to new heights."
  },
  {
    id:36, brand:"900 Global", name:"Eternity Pi",
    cover:"Solid", coreType:"Asymmetric", coreName:"Epoch",
    finish:"2000 Abralon", condition:"Heavy Oil", accent:"#1565c0",
    ballSlug:"900-global-eternity-pi", coreSlug:"900-global-epoch-core",
    weightData:{
      16:{rg:2.470,diff:0.052,moi:0.014}, 15:{rg:2.490,diff:0.052,moi:0.014},
      14:{rg:2.490,diff:0.052,moi:0.014}, 13:{rg:2.560,diff:0.046,moi:0.011}, 12:{rg:2.580,diff:0.040,moi:0.009}
    },
    releaseDate:"Sep 2023",
    description:"Reserve Blend 901 Solid with the all-new Epoch Asymmetric core — heavy oil power with a cleaner motion."
  },
  // DV8
  {
    id:37, brand:"DV8", name:"Heckler",
    cover:"Solid", coreType:"Asymmetric", coreName:"Unholy",
    finish:"500/2000 Siaair Micro Pad", condition:"Heavy Oil", accent:"#4e342e",
    ballSlug:"dv8-heckler", coreSlug:"dv8-unholy-core",
    weightData:{
      16:{rg:2.518,diff:0.043,moi:0.010}, 15:{rg:2.504,diff:0.051,moi:0.010},
      14:{rg:2.526,diff:0.051,moi:0.010}, 13:{rg:2.597,diff:0.041,moi:0.014}, 12:{rg:2.593,diff:0.041,moi:0.014}
    },
    releaseDate:"Nov 2024",
    description:"HK22C Maximum Havoc Solid with the asymmetric Unholy core — engineered for no-thumb dominance on heavy oil."
  },
  {
    id:38, brand:"DV8", name:"Hater",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Hater",
    finish:"500/1500 Siaair Micro Pad", condition:"Heavy Oil", accent:"#4e342e",
    ballSlug:"dv8-hater", coreSlug:"dv8-hater-core",
    weightData:{
      16:{rg:2.545,diff:0.047,moi:0.021}, 15:{rg:2.539,diff:0.054,moi:0.024},
      14:{rg:2.556,diff:0.054,moi:0.024}, 13:{rg:2.597,diff:0.041,moi:0.014}, 12:{rg:2.593,diff:0.041,moi:0.014}
    },
    releaseDate:"Mar 2024",
    description:"HK22 Havoc Hybrid with the brand-new Hater core — a hook monster built for the heaviest conditions."
  },
  // Ebonite
  {
    id:39, brand:"Ebonite", name:"Emerge",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Emerge",
    finish:"500/1000/1500 Siaair, Crown Factory Compound", condition:"Medium Oil", accent:"#1b5e20",
    ballSlug:"ebonite-emerge", coreSlug:"ebonite-emerge-core",
    weightData:{
      16:{rg:2.520,diff:0.046,moi:0.018}, 15:{rg:2.510,diff:0.053,moi:0.021},
      14:{rg:2.537,diff:0.054,moi:0.019}, 13:{rg:2.597,diff:0.041,moi:0.014}, 12:{rg:2.593,diff:0.041,moi:0.014}
    },
    releaseDate:"Jul 2023",
    description:"HK22 Optimize Pearl with the new Emerge Asymmetric core — length, flippy backend, and serious continuation."
  },
  {
    id:40, brand:"Ebonite", name:"Emerge Hybrid",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Emerge",
    finish:"500/1000/1500 Siaair, Crown Factory Compound", condition:"Medium-Heavy Oil", accent:"#1b5e20",
    ballSlug:"ebonite-emerge-hybrid", coreSlug:"ebonite-emerge-core",
    weightData:{
      16:{rg:2.520,diff:0.046,moi:0.018}, 15:{rg:2.510,diff:0.053,moi:0.021},
      14:{rg:2.537,diff:0.054,moi:0.019}, 13:{rg:2.597,diff:0.041,moi:0.014}, 12:{rg:2.593,diff:0.041,moi:0.014}
    },
    releaseDate:"Mar 2024",
    description:"Emerge Hybrid cover brings more mid-lane read — same powerful Emerge core, stronger overall reaction."
  },
  // Columbia 300
  {
    id:41, brand:"Columbia 300", name:"Atlas",
    cover:"Solid", coreType:"Asymmetric", coreName:"Atlas",
    finish:"500/2000 Siaair Micro Pad", condition:"Medium-Heavy Oil", accent:"#00838f",
    ballSlug:"columbia-300-atlas", coreSlug:"columbia-300-atlas-core",
    weightData:{
      16:{rg:2.530,diff:0.047,moi:0.016}, 15:{rg:2.520,diff:0.054,moi:0.018},
      14:{rg:2.542,diff:0.054,moi:0.018}, 13:{rg:2.597,diff:0.041,moi:0.014}, 12:{rg:2.612,diff:0.041,moi:0.014}
    },
    releaseDate:"Jul 2023",
    description:"Formula 1 Solid with the new asymmetric Atlas core — exceptional backend and pin drive on medium-heavy oil."
  },
  {
    id:42, brand:"Columbia 300", name:"Atlas Hybrid",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Atlas",
    finish:"500/1000/1500 Siaair, Crown Factory Compound", condition:"Medium Oil", accent:"#00838f",
    ballSlug:"columbia-300-atlas-hybrid", coreSlug:"columbia-300-atlas-core",
    weightData:{
      16:{rg:2.530,diff:0.047,moi:0.016}, 15:{rg:2.520,diff:0.054,moi:0.018},
      14:{rg:2.542,diff:0.054,moi:0.018}, 13:{rg:2.597,diff:0.041,moi:0.014}, 12:{rg:2.612,diff:0.041,moi:0.014}
    },
    releaseDate:"Feb 2024",
    description:"HK22 Formula 1 Hybrid with the Atlas core — longer, cleaner complement to the Atlas Solid."
  },
  // SWAG
  {
    id:43, brand:"SWAG", name:"Unreal",
    cover:"Solid", coreType:"Symmetric", coreName:"Unreal",
    finish:"1500 Polished", condition:"Medium Oil", accent:"#558b2f",
    ballSlug:"swag-unreal", coreSlug:"swag-unreal-core",
    weightData:{
      16:{rg:2.520,diff:0.034}, 15:{rg:2.510,diff:0.047},
      14:{rg:2.560,diff:0.040}, 13:{rg:2.550,diff:0.048}, 12:{rg:2.610,diff:0.041}
    },
    releaseDate:"Jan 2025",
    description:"Never Quit coverstock on the symmetric Unreal core — SWAG's benchmark utility performance ball."
  },
  {
    id:44, brand:"SWAG", name:"APEX Solid",
    cover:"Solid", coreType:"Symmetric", coreName:"APX V1",
    finish:"3000 Abralon", condition:"Medium-Heavy Oil", accent:"#558b2f",
    ballSlug:"swag-apex-solid", coreSlug:"swag-apx-v1-core",
    weightData:{
      16:{rg:2.500,diff:0.042}, 15:{rg:2.500,diff:0.042},
      14:{rg:2.530,diff:0.038}, 13:{rg:2.590,diff:0.033}, 12:{rg:2.650,diff:0.028}
    },
    releaseDate:"Apr 2025",
    description:"Apex Solid coverstock on the APX V1 symmetric core — smooth, predictable motion that reads oil early and finishes strong."
  },
  // Radical
  {
    id:45, brand:"Radical", name:"ZigZag",
    cover:"Pearl", coreType:"Asymmetric", coreName:"ZigZag",
    finish:"500/1000/1500 Siaair, Crown Factory Compound", condition:"Medium Oil", accent:"#bf360c",
    ballSlug:"radical-zigzag", coreSlug:"radical-zigzag-core",
    weightData:{
      16:{rg:2.501,diff:0.045,moi:0.015}, 15:{rg:2.501,diff:0.045,moi:0.015},
      14:{rg:2.531,diff:0.042,moi:0.013}, 13:{rg:2.601,diff:0.037,moi:0.011}, 12:{rg:2.661,diff:0.030,moi:0.009}
    },
    releaseDate:"Dec 2023",
    description:"HK22 HyperKinetic Pearl with the new ZigZag asymmetric core — extended hook window, powerful continuation."
  },
  {
    id:46, brand:"Track", name:"Theorem Pearl",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Theorem",
    finish:"500/1000/1500 Siaair, Crown Factory Compound", condition:"Medium Oil", accent:"#37474f",
    ballSlug:"track-theorem-pearl", coreSlug:"track-theorem-core",
    weightData:{
      16:{rg:2.485,diff:0.044,moi:0.017}, 15:{rg:2.473,diff:0.046,moi:0.017},
      14:{rg:2.487,diff:0.046,moi:0.017}, 13:{rg:2.597,diff:0.041,moi:0.014}, 12:{rg:2.593,diff:0.041,moi:0.014}
    },
    releaseDate:"Nov 2024",
    description:"HK22 Prime Response Pearl with the Theorem asymmetric core — sharper and more defined breakpoint than the original."
  },
  {
    id:47, brand:"Track", name:"Theorem",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Theorem",
    finish:"500/1000/1500 Siaair, Crown Factory Compound", condition:"Medium-Heavy Oil", accent:"#37474f",
    ballSlug:"track-theorem", coreSlug:"track-theorem-core",
    weightData:{
      16:{rg:2.485,diff:0.044,moi:0.017}, 15:{rg:2.473,diff:0.046,moi:0.017},
      14:{rg:2.487,diff:0.046,moi:0.017}, 13:{rg:2.597,diff:0.041,moi:0.014}, 12:{rg:2.593,diff:0.041,moi:0.014}
    },
    releaseDate:"Feb 2024",
    description:"Prime Response Hybrid HK22 with the Theorem asymmetric core — big sweeping motion and strong continuation."
  },

  // ══════════════════════════════════════════════════════════════
  // v6.8 NEW BALLS — 12 brands, 2023-2026 (bowwwl verified)
  // ══════════════════════════════════════════════════════════════

  // ── Storm 추가 (bowwwl 검증) ─────────────────────────────────────
  {
    id:48, brand:"Storm", name:"The Road",
    cover:"Hybrid", coreType:"Symmetric", coreName:"Inverted Fe2 A.I.",
    finish:"Reacta Gloss", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-the-road", coreSlug:"storm-inverted-fe2-ai-core",
    weightData:{
      16:{rg:2.550,diff:0.045}, 15:{rg:2.550,diff:0.045},
      14:{rg:2.550,diff:0.045}, 13:{rg:2.620,diff:0.038}, 12:{rg:2.680,diff:0.031}
    },
    releaseDate:"Apr 2024",
    description:"The legendary Hy-Road reinvented — ReX Hybrid cover with Inverted Fe2 A.I. core for the modern game."
  },
  {
    id:49, brand:"Storm", name:"Absolute Power",
    cover:"Solid", coreType:"Asymmetric", coreName:"Sentinel",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-absolute-power", coreSlug:"storm-sentinel-core",
    weightData:{
      16:{rg:2.480,diff:0.044,moi:0.016}, 15:{rg:2.480,diff:0.044,moi:0.016},
      14:{rg:2.520,diff:0.042,moi:0.014}, 13:{rg:2.590,diff:0.038,moi:0.011}, 12:{rg:2.650,diff:0.031,moi:0.009}
    },
    releaseDate:"Jan 2024",
    description:"R2S Deep Solid on Storm's first single-density Sentinel core — powerful solid motion for heavy conditions."
  },
  {
    id:50, brand:"Storm", name:"Summit Peak",
    cover:"Pearl", coreType:"Symmetric", coreName:"Centripetal HD A.I.",
    finish:"Reacta Gloss", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-summit-peak", coreSlug:"storm-centripetal-hd-ai-core",
    weightData:{
      16:{rg:2.460,diff:0.056}, 15:{rg:2.460,diff:0.056},
      14:{rg:2.460,diff:0.056}, 13:{rg:2.590,diff:0.045}, 12:{rg:2.650,diff:0.035}
    },
    releaseDate:"Jan 2024",
    description:"TX-23 Pearl with the Centripetal HD A.I. core — unlike anything else in your bag, a clean yet powerful shape."
  },
  {
    id:51, brand:"Storm", name:"Summit Ascent",
    cover:"Solid", coreType:"Symmetric", coreName:"Centripetal HD A.I.",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-summit-ascent", coreSlug:"storm-centripetal-hd-ai-core",
    weightData:{
      16:{rg:2.460,diff:0.056}, 15:{rg:2.460,diff:0.056},
      14:{rg:2.460,diff:0.056}, 13:{rg:2.590,diff:0.045}, 12:{rg:2.650,diff:0.035}
    },
    releaseDate:"Aug 2024",
    description:"R2S Solid at 4000-grit — uniquely cleaner than typical solids while still commanding medium-heavy oil."
  },
  {
    id:52, brand:"Storm", name:"Marvel Scale",
    cover:"Solid", coreType:"Asymmetric", coreName:"Atomic A.I.",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-marvel-scale", coreSlug:"storm-atomic-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.056,moi:0.018}, 15:{rg:2.470,diff:0.056,moi:0.018},
      14:{rg:2.510,diff:0.053,moi:0.016}, 13:{rg:2.580,diff:0.047,moi:0.013}, 12:{rg:2.640,diff:0.040,moi:0.011}
    },
    releaseDate:"Oct 2023",
    description:"R2S Solid with the powerful Atomic A.I. core — heavy oil dominance with the signature Storm backend snap."
  },
  {
    id:53, brand:"Storm", name:"Phaze A.I. Solid",
    cover:"Solid", coreType:"Symmetric", coreName:"Velocity A.I.",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-phaze-ai-solid", coreSlug:"storm-velocity-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.053}, 15:{rg:2.470,diff:0.053},
      14:{rg:2.520,diff:0.052}, 13:{rg:2.580,diff:0.047}, 12:{rg:2.640,diff:0.037}
    },
    releaseDate:"Mar 2025",
    description:"TX-16 Solid wrapped around the Velocity A.I. core — the benchmark solid companion to the Phaze A.I. Pearl."
  },

  // ── Brunswick 추가 (bowwwl 검증) ────────────────────────────────
  {
    id:54, brand:"Brunswick", name:"Hypnotize",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Tri-Elliptic",
    finish:"500/1500 Siaair Micro Pad", condition:"Heavy Oil", accent:"#e65100",
    ballSlug:"brunswick-hypnotize", coreSlug:"brunswick-tri-elliptic-core",
    weightData:{
      16:{rg:2.521,diff:0.048,moi:0.014}, 15:{rg:2.510,diff:0.056,moi:0.017},
      14:{rg:2.533,diff:0.056,moi:0.016}, 13:{rg:2.597,diff:0.041,moi:0.014}, 12:{rg:2.593,diff:0.041,moi:0.014}
    },
    releaseDate:"Feb 2025",
    description:"HK22C-Evo Hybrid with the Tri-Elliptic core — the perfect Mesmerize follow-up with controlled backend aggression."
  },
  {
    id:55, brand:"Brunswick", name:"Ethos Hybrid",
    cover:"Hybrid", coreType:"Symmetric", coreName:"Ethos",
    finish:"500/1500 Siaair Micro Pad", condition:"Medium-Heavy Oil", accent:"#e65100",
    ballSlug:"brunswick-ethos-hybrid", coreSlug:"brunswick-ethos-core",
    weightData:{
      16:{rg:2.495,diff:0.046}, 15:{rg:2.481,diff:0.053},
      14:{rg:2.505,diff:0.053}, 13:{rg:2.510,diff:0.047}, 12:{rg:2.577,diff:0.045}
    },
    releaseDate:"Mar 2024",
    description:"HK22 Ethos Hybrid cover — larger, polished symmetric motion that surpasses previous Ethos models."
  },
  {
    id:56, brand:"Brunswick", name:"Vaporize",
    cover:"Solid", coreType:"Asymmetric", coreName:"Tri-Elliptic",
    finish:"500/1000/1500 Siaair Micro Pad", condition:"Heavy Oil", accent:"#e65100",
    ballSlug:"brunswick-vaporize", coreSlug:"brunswick-tri-elliptic-core",
    weightData:{
      16:{rg:2.521,diff:0.048,moi:0.014}, 15:{rg:2.510,diff:0.056,moi:0.017},
      14:{rg:2.533,diff:0.056,moi:0.016}, 13:{rg:2.597,diff:0.041,moi:0.014}, 12:{rg:2.593,diff:0.041,moi:0.014}
    },
    releaseDate:"Nov 2024",
    description:"HK22C-Evo Solid with the Tri-Elliptic core — the strongest option in the Mesmerize family for heavy oil."
  },
  {
    id:57, brand:"Roto Grip", name:"Attention Star S2",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Momentous AV + A.I.",
    finish:"2000 Abralon", condition:"Medium-Heavy Oil", accent:"#c62828",
    ballSlug:"roto-grip-attention-star-s2", coreSlug:"roto-grip-momentous-av-ai-core",
    weightData:{
      16:{rg:2.480,diff:0.052,moi:0.017}, 15:{rg:2.480,diff:0.049,moi:0.017},
      14:{rg:2.530,diff:0.046,moi:0.014}, 13:{rg:2.560,diff:0.034,moi:0.011}, 12:{rg:2.580,diff:0.031,moi:0.009}
    },
    releaseDate:"Nov 2024",
    description:"eTrax PLUS Hybrid with the Momentous AV + A.I. core — S2 brings midlane grip with the same monster backend."
  },
  {
    id:58, brand:"Roto Grip", name:"Rockstar",
    cover:"Solid", coreType:"Symmetric", coreName:"Rocker A.I.",
    finish:"2000 Abralon", condition:"Medium-Heavy Oil", accent:"#c62828",
    ballSlug:"roto-grip-rockstar", coreSlug:"roto-grip-rocker-ai-core",
    weightData:{
      16:{rg:2.480,diff:0.054}, 15:{rg:2.480,diff:0.050},
      14:{rg:2.500,diff:0.046}, 13:{rg:2.580,diff:0.047}, 12:{rg:2.640,diff:0.037}
    },
    releaseDate:"Feb 2025",
    description:"NanoStar Solid on the brand-new Rocker A.I. core — fills the gap between MicroTrax and eTrax for total versatility."
  },
  {
    id:59, brand:"Roto Grip", name:"Magic Gem",
    cover:"Hybrid", coreType:"Symmetric", coreName:"Defiant LRG",
    finish:"2000 Abralon", condition:"Medium-Heavy Oil", accent:"#c62828",
    ballSlug:"roto-grip-magic-gem", coreSlug:"roto-grip-defiant-lrg-core",
    weightData:{
      16:{rg:2.470,diff:0.054}, 15:{rg:2.470,diff:0.054},
      14:{rg:2.510,diff:0.054}, 13:{rg:2.580,diff:0.047}, 12:{rg:2.640,diff:0.037}
    },
    releaseDate:"Oct 2023",
    description:"MicroTrax Hybrid with the Defiant LRG core — enchanting arc motion for medium-heavy conditions."
  },
  {
    id:60, brand:"Roto Grip", name:"Hustle BRY",
    cover:"Hybrid", coreType:"Symmetric", coreName:"HP1 A.I.",
    finish:"Reacta Gloss", condition:"Light-Medium Oil", accent:"#c62828",
    ballSlug:"roto-grip-hustle-bry", coreSlug:"roto-grip-hp1-ai-core",
    weightData:{
      16:{rg:2.560,diff:0.035}, 15:{rg:2.560,diff:0.035},
      14:{rg:2.580,diff:0.033}, 13:{rg:2.640,diff:0.028}, 12:{rg:2.700,diff:0.023}
    },
    releaseDate:"Apr 2024",
    description:"VTC Hybrid cover on the HP1 A.I. core — built for everyone, from casual leagues to competitive play on lighter oil."
  },

  // ── Motiv 추가 (bowwwl 검증) ─────────────────────────────────────
  {
    id:61, brand:"Motiv", name:"Lethal Venom",
    cover:"Solid", coreType:"Asymmetric", coreName:"Gear APG",
    finish:"3000 LSS", condition:"Medium Oil", accent:"#6a1b9a",
    ballSlug:"motiv-lethal-venom", coreSlug:"motiv-gear-apg-core",
    weightData:{
      16:{rg:2.470,diff:0.036,moi:0.013}, 15:{rg:2.470,diff:0.036,moi:0.013},
      14:{rg:2.500,diff:0.034,moi:0.011}, 13:{rg:2.560,diff:0.030,moi:0.009}, 12:{rg:2.620,diff:0.025,moi:0.007}
    },
    releaseDate:"Oct 2024",
    description:"Leverage MXC Solid with Duramax tech on the Gear APG core — the benchmark Venom, predictable and deadly."
  },
  {
    id:62, brand:"Motiv", name:"Pride Empire",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Overload",
    finish:"2000 LSS", condition:"Medium-Heavy Oil", accent:"#6a1b9a",
    ballSlug:"motiv-pride-empire", coreSlug:"motiv-overload-core",
    weightData:{
      16:{rg:2.480,diff:0.053,moi:0.018}, 15:{rg:2.480,diff:0.053,moi:0.018},
      14:{rg:2.510,diff:0.050,moi:0.016}, 13:{rg:2.565,diff:0.045,moi:0.013}, 12:{rg:2.625,diff:0.038,moi:0.011}
    },
    releaseDate:"Jun 2023",
    description:"Propulsion Pearl on the Overload core — new level of backend speed and angular response in the Pride line."
  },
  {
    id:63, brand:"Motiv", name:"Blue Tank",
    cover:"Solid", coreType:"Symmetric", coreName:"Halogen V2",
    finish:"500 LSS", condition:"Heavy Oil", accent:"#6a1b9a",
    ballSlug:"motiv-blue-tank", coreSlug:"motiv-halogen-v2-core",
    weightData:{
      16:{rg:2.560,diff:0.029}, 15:{rg:2.560,diff:0.029},
      14:{rg:2.590,diff:0.027}, 13:{rg:2.650,diff:0.022}, 12:{rg:2.710,diff:0.018}
    },
    releaseDate:"Jan 2024",
    description:"Microcell Polymer cover with the Halogen V2 core — urethane-like control with reactive power for heavy oil."
  },
  {
    id:64, brand:"Motiv", name:"Hyper Venom",
    cover:"Pearl", coreType:"Symmetric", coreName:"Gear",
    finish:"2000 LSS", condition:"Light-Medium Oil", accent:"#6a1b9a",
    ballSlug:"motiv-hyper-venom", coreSlug:"motiv-gear-core",
    weightData:{
      16:{rg:2.470,diff:0.028}, 15:{rg:2.470,diff:0.030},
      14:{rg:2.500,diff:0.027}, 13:{rg:2.560,diff:0.023}, 12:{rg:2.620,diff:0.019}
    },
    releaseDate:"Mar 2024",
    description:"Propulsion MXR Pearl on the proven Gear core — the most angular Venom ever, deadly on light-moderate volumes."
  },

  // ── Storm v6.8 신규 ──────────────────────────────────────────────
  {
    id:65, brand:"Storm", name:"Equinox Solid",
    cover:"Solid", coreType:"Asymmetric", coreName:"Solarion A.I.",
    finish:"2000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-equinox-solid", coreSlug:"storm-solarion-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.056,moi:0.018}, 15:{rg:2.470,diff:0.055,moi:0.018},
      14:{rg:2.510,diff:0.052,moi:0.015}, 13:{rg:2.580,diff:0.047,moi:0.012}, 12:{rg:2.640,diff:0.040,moi:0.010}
    },
    releaseDate:"Oct 2025",
    description:"A2S Solid with the Solarion A.I. core — sharp, angular solid rare in its kind, stands toe-to-toe with the Ion Max."
  },
  {
    id:66, brand:"Storm", name:"PhysiX Grandeur",
    cover:"Solid", coreType:"Asymmetric", coreName:"Atomic A.I.",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-physix-grandeur", coreSlug:"storm-atomic-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.056,moi:0.018}, 15:{rg:2.470,diff:0.055,moi:0.018},
      14:{rg:2.520,diff:0.054,moi:0.016}, 13:{rg:2.580,diff:0.047,moi:0.013}, 12:{rg:2.640,diff:0.040,moi:0.011}
    },
    releaseDate:"Nov 2025",
    description:"R2S Solid with the Atomic A.I. core — overseas release bringing the PhysiX pedigree to heavy oil dominance."
  },
  {
    id:67, brand:"Storm", name:"Code Honor",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Sentinel",
    finish:"2000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-code-honor", coreSlug:"storm-sentinel-core",
    weightData:{
      16:{rg:2.480,diff:0.044,moi:0.016}, 15:{rg:2.480,diff:0.044,moi:0.016},
      14:{rg:2.520,diff:0.042,moi:0.014}, 13:{rg:2.590,diff:0.038,moi:0.011}, 12:{rg:2.650,diff:0.031,moi:0.009}
    },
    releaseDate:"Nov 2025",
    description:"NeX Pearl (Nano Extreme) — Storm's earliest-reading cover ever, paired with the Sentinel core for big midlane motion."
  },
  {
    id:68, brand:"Storm", name:"Next Factor",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Ignition A.I.",
    finish:"1500 Polished", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-next-factor", coreSlug:"storm-ignition-ai-core",
    weightData:{
      16:{rg:2.480,diff:0.052,moi:0.018}, 15:{rg:2.480,diff:0.052,moi:0.018},
      14:{rg:2.520,diff:0.050,moi:0.016}, 13:{rg:2.590,diff:0.044,moi:0.013}, 12:{rg:2.650,diff:0.037,moi:0.011}
    },
    releaseDate:"Dec 2025",
    description:"RX Pro Pearl on Ignition A.I. — the modern revival of the legendary X-Factor skid-flip reaction."
  },
  {
    id:69, brand:"Brunswick", name:"Combat Solid",
    cover:"Solid", coreType:"Asymmetric", coreName:"Rampart",
    finish:"500/2000 Siaair Micro Pad", condition:"Heavy Oil", accent:"#e65100",
    ballSlug:"brunswick-combat-solid", coreSlug:"brunswick-rampart-core",
    weightData:{
      16:{rg:2.490,diff:0.052,moi:0.016}, 15:{rg:2.490,diff:0.058,moi:0.018},
      14:{rg:2.510,diff:0.058,moi:0.018}, 13:{rg:2.590,diff:0.042,moi:0.014}, 12:{rg:2.610,diff:0.042,moi:0.014}
    },
    releaseDate:"Sep 2024",
    description:"QR-12 Solid cover with the Rampart asymmetric core — midlane-dominant heavy oil control."
  },
  {
    id:70, brand:"Brunswick", name:"Danger Zone",
    cover:"Solid", coreType:"Symmetric", coreName:"Twist",
    finish:"500/1000/1500 Siaair Micro Pad", condition:"Medium-Heavy Oil", accent:"#e65100",
    ballSlug:"brunswick-danger-zone", coreSlug:"brunswick-twist-core",
    weightData:{
      16:{rg:2.520,diff:0.048}, 15:{rg:2.520,diff:0.050},
      14:{rg:2.550,diff:0.048}, 13:{rg:2.610,diff:0.040}, 12:{rg:2.670,diff:0.033}
    },
    releaseDate:"Dec 2025",
    description:"A modern tribute to the 1996 classic — QR-12 Solid with the Twist core for today's lanes."
  },
  {
    id:71, brand:"Brunswick", name:"Crown 78U",
    cover:"Urethane", coreType:"Symmetric", coreName:"Crown",
    finish:"500/1000/1500 Siaair Micro Pad", condition:"Medium Oil", accent:"#e65100",
    ballSlug:"brunswick-crown-78u", coreSlug:"brunswick-crown-core",
    weightData:{
      16:{rg:2.530,diff:0.040}, 15:{rg:2.530,diff:0.043},
      14:{rg:2.560,diff:0.041}, 13:{rg:2.620,diff:0.034}, 12:{rg:2.680,diff:0.028}
    },
    releaseDate:"Dec 2025",
    description:"USBC-approved 78-durometer urethane with the Crown core — more flare potential than traditional urethane."
  },

  // ── Roto Grip v6.8 신규 ──────────────────────────────────────────
  {
    id:72, brand:"Roto Grip", name:"Rockstar Amped",
    cover:"Pearl", coreType:"Symmetric", coreName:"Rocker A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#c62828",
    ballSlug:"roto-grip-rockstar-amped", coreSlug:"roto-grip-rocker-ai-core",
    weightData:{
      16:{rg:2.480,diff:0.054}, 15:{rg:2.480,diff:0.050},
      14:{rg:2.500,diff:0.046}, 13:{rg:2.580,diff:0.047}, 12:{rg:2.640,diff:0.037}
    },
    releaseDate:"Oct 2025",
    description:"NanoStar Pearl on Rocker A.I. — the Rockstar's angular sibling, delivering a roaring wall of backend sound."
  },
  {
    id:73, brand:"Roto Grip", name:"Optimum Idol Solid",
    cover:"Solid", coreType:"Symmetric", coreName:"Ikon + A.I.",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#c62828",
    ballSlug:"roto-grip-optimum-idol-solid", coreSlug:"roto-grip-ikon-ai-core",
    weightData:{
      16:{rg:2.480,diff:0.048}, 15:{rg:2.470,diff:0.047},
      14:{rg:2.500,diff:0.046}, 13:{rg:2.560,diff:0.038}, 12:{rg:2.620,diff:0.030}
    },
    releaseDate:"Oct 2025",
    description:"eTrax PLUS Solid on Ikon + A.I. — the Idol Helios reborn with A.I. tech for wider lane versatility."
  },
  {
    id:74, brand:"Motiv", name:"Primal Rage Evolution",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Impulse V2",
    finish:"2000 LSS", condition:"Medium-Heavy Oil", accent:"#6a1b9a",
    ballSlug:"motiv-primal-rage-evolution", coreSlug:"motiv-impulse-v2-core",
    weightData:{
      16:{rg:2.570,diff:0.050,moi:0.018}, 15:{rg:2.570,diff:0.050,moi:0.018},
      14:{rg:2.600,diff:0.047,moi:0.016}, 13:{rg:2.660,diff:0.042,moi:0.013}, 12:{rg:2.720,diff:0.035,moi:0.011}
    },
    releaseDate:"Nov 2024",
    description:"Propulsion HVP Pearl on Impulse V2 — the legendary #redball reborn, explosive backend return of the Primal Rage."
  },
  {
    id:75, brand:"Motiv", name:"Apex Jackal",
    cover:"Solid", coreType:"Asymmetric", coreName:"Apex Predator",
    finish:"2000 LSS", condition:"Heavy Oil", accent:"#6a1b9a",
    ballSlug:"motiv-apex-jackal", coreSlug:"motiv-apex-predator-core",
    weightData:{
      16:{rg:2.480,diff:0.054,moi:0.019}, 15:{rg:2.480,diff:0.052,moi:0.019},
      14:{rg:2.510,diff:0.050,moi:0.017}, 13:{rg:2.565,diff:0.045,moi:0.014}, 12:{rg:2.625,diff:0.038,moi:0.012}
    },
    releaseDate:"Aug 2025",
    description:"Propulsion MXV Solid on the dual-density Apex Predator core — a new predator for the most demanding heavy oil."
  },
  {
    id:76, brand:"Motiv", name:"Steel Forge",
    cover:"Pearl", coreType:"Symmetric", coreName:"Detonator",
    finish:"2000 LSS", condition:"Medium-Heavy Oil", accent:"#6a1b9a",
    ballSlug:"motiv-steel-forge", coreSlug:"motiv-detonator-core",
    weightData:{
      16:{rg:2.470,diff:0.048}, 15:{rg:2.470,diff:0.048},
      14:{rg:2.500,diff:0.046}, 13:{rg:2.560,diff:0.041}, 12:{rg:2.620,diff:0.034}
    },
    releaseDate:"Aug 2025",
    description:"Propulsion MXV Pearl on the Detonator core — explosive down-lane reaction with the Evoke Hysteria's proven cover."
  },
  {
    id:77, brand:"Hammer", name:"Maximum Effect",
    cover:"Solid", coreType:"Asymmetric", coreName:"Huntsman Tour",
    finish:"500/1000/2000 Siaair Micro Pad", condition:"Heavy Oil", accent:"#b71c1c",
    ballSlug:"hammer-maximum-effect", coreSlug:"hammer-huntsman-tour-core",
    weightData:{
      16:{rg:2.490,diff:0.052,moi:0.017}, 15:{rg:2.490,diff:0.055,moi:0.017},
      14:{rg:2.530,diff:0.053,moi:0.016}, 13:{rg:2.600,diff:0.046,moi:0.013}, 12:{rg:2.660,diff:0.039,moi:0.011}
    },
    releaseDate:"Sep 2025",
    description:"HK22 Solid on the Huntsman Tour core — the ultimate upgrade to the popular Effect with maximum power."
  },
  {
    id:78, brand:"900 Global", name:"Cruise Sapphire",
    cover:"Pearl", coreType:"Symmetric", coreName:"Cruise",
    finish:"Reacta Gloss", condition:"Light-Medium Oil", accent:"#1565c0",
    ballSlug:"900-global-cruise-sapphire", coreSlug:"900-global-cruise-core",
    weightData:{
      16:{rg:2.570,diff:0.030}, 15:{rg:2.570,diff:0.030},
      14:{rg:2.600,diff:0.028}, 13:{rg:2.660,diff:0.023}, 12:{rg:2.720,diff:0.018}
    },
    releaseDate:"May 2023",
    description:"Pearl reactive on the Cruise symmetric core — smooth, predictable arc motion for lighter oil conditions."
  },
  {
    id:79, brand:"900 Global", name:"Dark Matter",
    cover:"Solid", coreType:"Asymmetric", coreName:"Dark Matter",
    finish:"500/1000/2000 Siaair Micro Pad", condition:"Heavy Oil", accent:"#1565c0",
    ballSlug:"900-global-dark-matter", coreSlug:"900-global-dark-matter-core",
    weightData:{
      16:{rg:2.480,diff:0.054,moi:0.018}, 15:{rg:2.475,diff:0.053,moi:0.018},
      14:{rg:2.510,diff:0.051,moi:0.016}, 13:{rg:2.570,diff:0.045,moi:0.013}, 12:{rg:2.630,diff:0.038,moi:0.011}
    },
    releaseDate:"Oct 2023",
    description:"Quantum Solid on the Dark Matter asymmetric core — heavy oil workhorse with strong midlane continuation."
  },
  {
    id:80, brand:"900 Global", name:"Zen 25 Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"Meditate A.I.",
    finish:"Reacta Gloss", condition:"Medium Oil", accent:"#1565c0",
    ballSlug:"900-global-zen-25-pearl", coreSlug:"900-global-meditate-ai-core",
    weightData:{
      16:{rg:2.480,diff:0.053}, 15:{rg:2.480,diff:0.050},
      14:{rg:2.510,diff:0.048}, 13:{rg:2.570,diff:0.042}, 12:{rg:2.630,diff:0.035}
    },
    releaseDate:"Jun 2025",
    description:"Pearl reactive on Meditate A.I. — the Zen 25 pearl complement, adding length with the same smooth arc."
  },

  // ── DV8 v6.8 신규 ───────────────────────────────────────────────
  {
    id:81, brand:"DV8", name:"Mantra Solid",
    cover:"Solid", coreType:"Asymmetric", coreName:"Mantra",
    finish:"500/1000/2000 Siaair Micro Pad", condition:"Heavy Oil", accent:"#bf360c",
    ballSlug:"dv8-mantra-solid", coreSlug:"dv8-mantra-core",
    weightData:{
      16:{rg:2.490,diff:0.052,moi:0.017}, 15:{rg:2.490,diff:0.055,moi:0.017},
      14:{rg:2.520,diff:0.053,moi:0.016}, 13:{rg:2.590,diff:0.046,moi:0.013}, 12:{rg:2.650,diff:0.039,moi:0.011}
    },
    releaseDate:"Sep 2025",
    description:"Strong solid cover on the Mantra asymmetric core — consistent hook and reliable control for heavy conditions."
  },
  {
    id:82, brand:"Ebonite", name:"Envision",
    cover:"Pearl", coreType:"Symmetric", coreName:"Envision",
    finish:"Reacta Gloss", condition:"Medium Oil", accent:"#4527a0",
    ballSlug:"ebonite-envision", coreSlug:"ebonite-envision-core",
    weightData:{
      16:{rg:2.500,diff:0.042}, 15:{rg:2.500,diff:0.044},
      14:{rg:2.530,diff:0.042}, 13:{rg:2.600,diff:0.035}, 12:{rg:2.660,diff:0.029}
    },
    releaseDate:"Jan 2023",
    description:"Pearl reactive on the Envision symmetric core — clean, angular backend response for medium conditions."
  },
  {
    id:83, brand:"Ebonite", name:"Choice Solid",
    cover:"Solid", coreType:"Asymmetric", coreName:"Choice",
    finish:"500/1000/2000 Siaair Micro Pad", condition:"Heavy Oil", accent:"#4527a0",
    ballSlug:"ebonite-choice-solid", coreSlug:"ebonite-choice-core",
    weightData:{
      16:{rg:2.490,diff:0.053,moi:0.018}, 15:{rg:2.490,diff:0.055,moi:0.018},
      14:{rg:2.520,diff:0.053,moi:0.016}, 13:{rg:2.590,diff:0.047,moi:0.013}, 12:{rg:2.650,diff:0.040,moi:0.011}
    },
    releaseDate:"Aug 2024",
    description:"Strong solid cover on the Choice asymmetric core — aggressive heavy-oil motion with high entry angle."
  },

  // ── Columbia 300 v6.8 신규 ───────────────────────────────────────
  {
    id:84, brand:"SWAG", name:"Craze Tour Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"Craze",
    finish:"500 Polished", condition:"Medium Oil", accent:"#558b2f",
    ballSlug:"swag-craze-tour-pearl", coreSlug:"swag-craze-core",
    weightData:{
      16:{rg:2.510,diff:0.038}, 15:{rg:2.500,diff:0.040},
      14:{rg:2.530,diff:0.038}, 13:{rg:2.600,diff:0.032}
    },
    releaseDate:"Nov 2025",
    description:"SWAG Rage Pearl AP26 on the Craze symmetric core — clean, polished arc for medium oil league play."
  },

  // ── Radical v6.8 신규 ───────────────────────────────────────────
  {
    id:85, brand:"Radical", name:"Zig Zag Solid",
    cover:"Solid", coreType:"Asymmetric", coreName:"ZigZag",
    finish:"500/1000/1500 Siaair Micro Pad", condition:"Medium-Heavy Oil", accent:"#e65100",
    ballSlug:"radical-zig-zag-solid", coreSlug:"radical-zigzag-core",
    weightData:{
      16:{rg:2.500,diff:0.045,moi:0.017}, 15:{rg:2.490,diff:0.047,moi:0.017},
      14:{rg:2.530,diff:0.045,moi:0.015}, 13:{rg:2.600,diff:0.039,moi:0.012}
    },
    releaseDate:"Sep 2024",
    description:"Solid reactive on the ZigZag asymmetric core — powerful solid motion companion to the original ZigZag Pearl."
  },
  {
    id:86, brand:"Radical", name:"Ridiculous Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"Ridiculous",
    finish:"Factory Compound", condition:"Medium Oil", accent:"#e65100",
    ballSlug:"radical-ridiculous-pearl", coreSlug:"radical-ridiculous-core",
    weightData:{
      16:{rg:2.520,diff:0.040}, 15:{rg:2.510,diff:0.042},
      14:{rg:2.540,diff:0.040}, 13:{rg:2.610,diff:0.033}
    },
    releaseDate:"Mar 2024",
    description:"Pearl reactive on the Ridiculous symmetric core — smooth, arcing response for medium oil versatility."
  },

  // ── Track v6.8 신규 ─────────────────────────────────────────────
  {
    id:87, brand:"Storm", name:"Ion Max",
    cover:"Solid", coreType:"Asymmetric", coreName:"Element Max A.I.",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-ion-max", coreSlug:"storm-element-max-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.056,moi:0.018}, 15:{rg:2.470,diff:0.055,moi:0.018},
      14:{rg:2.510,diff:0.052,moi:0.016}, 13:{rg:2.580,diff:0.047,moi:0.013}, 12:{rg:2.640,diff:0.040,moi:0.011}
    },
    releaseDate:"Sep 2024",
    description:"TX-16 Solid on Element Max A.I. — the benchmark heavy-oil asymmetric for the modern game, top-tier midlane."
  },
  {
    id:88, brand:"Storm", name:"Ion Pro Solid",
    cover:"Solid", coreType:"Asymmetric", coreName:"Element Tour A.I.",
    finish:"Power Edge", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-ion-pro-solid", coreSlug:"storm-element-tour-ai-core",
    weightData:{
      16:{rg:2.480,diff:0.052,moi:0.018}, 15:{rg:2.480,diff:0.051,moi:0.018},
      14:{rg:2.520,diff:0.048,moi:0.016}, 13:{rg:2.590,diff:0.042,moi:0.013}, 12:{rg:2.650,diff:0.035,moi:0.011}
    },
    releaseDate:"Jun 2025",
    description:"TX-16 Solid on Element Tour A.I. — the Ion Pro's solid sibling, stronger midlane with the same benchmark shape."
  },
  {
    id:89, brand:"Storm", name:"Marvel Pearl A.I.",
    cover:"Pearl", coreType:"Symmetric", coreName:"Centripetal HD A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-marvel-pearl-ai", coreSlug:"storm-centripetal-hd-ai-core",
    weightData:{
      16:{rg:2.460,diff:0.056}, 15:{rg:2.460,diff:0.056},
      14:{rg:2.460,diff:0.056}, 13:{rg:2.590,diff:0.045}, 12:{rg:2.650,diff:0.035}
    },
    releaseDate:"Nov 2024",
    description:"NRG Pearl on Centripetal HD A.I. — the Marvel series upgraded with A.I. tech for a straighter, smoother arc."
  },
  {
    id:90, brand:"Storm", name:"PhysiX Solid",
    cover:"Solid", coreType:"Asymmetric", coreName:"Atomic A.I.",
    finish:"2000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-physix-solid", coreSlug:"storm-atomic-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.056,moi:0.018}, 15:{rg:2.470,diff:0.055,moi:0.018},
      14:{rg:2.520,diff:0.054,moi:0.016}, 13:{rg:2.580,diff:0.047,moi:0.013}, 12:{rg:2.640,diff:0.040,moi:0.011}
    },
    releaseDate:"Oct 2024",
    description:"EXO Solid on Atomic A.I. — overseas release bringing PhysiX solid power to heavy oil."
  },
  {
    id:91, brand:"Storm", name:"EquinoX",
    cover:"Pearl", coreType:"Symmetric", coreName:"Solarion A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-equinox", coreSlug:"storm-solarion-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.050}, 15:{rg:2.470,diff:0.050},
      14:{rg:2.510,diff:0.048}, 13:{rg:2.580,diff:0.042}, 12:{rg:2.640,diff:0.035}
    },
    releaseDate:"Feb 2025",
    description:"A1S Pearl on Solarion A.I. — purpose-built for 39-44ft league patterns with signature Storm backend motion."
  },
  {
    id:92, brand:"Storm", name:"!Q Tour A.I.",
    cover:"Solid", coreType:"Symmetric", coreName:"Inverted Fe2 A.I.",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-iq-tour-ai", coreSlug:"storm-inverted-fe2-ai-core",
    weightData:{
      16:{rg:2.550,diff:0.045}, 15:{rg:2.550,diff:0.045},
      14:{rg:2.550,diff:0.045}, 13:{rg:2.620,diff:0.038}, 12:{rg:2.680,diff:0.031}
    },
    releaseDate:"Mar 2025",
    description:"R2S Solid on Inverted Fe2 A.I. — the legendary !Q Tour elevated with A.I. Core Technology for wider strike window."
  },
  {
    id:93, brand:"Storm", name:"Hyper Motor",
    cover:"Pearl", coreType:"Symmetric", coreName:"Torque A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-hyper-motor", coreSlug:"storm-torque-ai-core",
    weightData:{
      16:{rg:2.490,diff:0.048}, 15:{rg:2.490,diff:0.048},
      14:{rg:2.520,diff:0.046}, 13:{rg:2.590,diff:0.040}, 12:{rg:2.650,diff:0.033}
    },
    releaseDate:"Jan 2025",
    description:"RX Pro Pearl on Torque A.I. — the next evolution of the Motor line with explosive backend rev-up."
  },
  {
    id:94, brand:"Storm", name:"The Road X",
    cover:"Solid", coreType:"Symmetric", coreName:"Inverted Fe2 A.I.",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-the-road-x", coreSlug:"storm-inverted-fe2-ai-core",
    weightData:{
      16:{rg:2.550,diff:0.045}, 15:{rg:2.550,diff:0.045},
      14:{rg:2.550,diff:0.045}, 13:{rg:2.620,diff:0.038}, 12:{rg:2.680,diff:0.031}
    },
    releaseDate:"Feb 2025",
    description:"ReX Solid on Inverted Fe2 A.I. — overseas The Road companion, stronger midlane read on tougher conditions."
  },
  {
    id:95, brand:"Storm", name:"Typhoon",
    cover:"Pearl", coreType:"Symmetric", coreName:"Centripetal HD A.I.",
    finish:"Power Edge", condition:"Light-Medium Oil", accent:"#00897b",
    ballSlug:"storm-typhoon", coreSlug:"storm-centripetal-hd-ai-core",
    weightData:{
      16:{rg:2.460,diff:0.056}, 15:{rg:2.460,diff:0.056},
      14:{rg:2.460,diff:0.056}, 13:{rg:2.590,diff:0.045}, 12:{rg:2.650,diff:0.035}
    },
    releaseDate:"Apr 2025",
    description:"NRG Pearl on Centripetal HD A.I. — powerful precision for light-medium oil, builds momentum every rotation."
  },
  {
    id:96, brand:"Storm", name:"PhysiX Era",
    cover:"Solid", coreType:"Asymmetric", coreName:"Atomic A.I.",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-physix-era", coreSlug:"storm-atomic-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.056,moi:0.018}, 15:{rg:2.470,diff:0.055,moi:0.018},
      14:{rg:2.520,diff:0.054,moi:0.016}, 13:{rg:2.580,diff:0.047,moi:0.013}, 12:{rg:2.640,diff:0.040,moi:0.011}
    },
    releaseDate:"Jun 2025",
    description:"R2S Solid on Atomic A.I. — overseas PhysiX continuation, combining running and sharpness on heavy oil."
  },
  {
    id:97, brand:"Storm", name:"Motor Rev",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Torque A.I.",
    finish:"1500 Polished", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-motor-rev", coreSlug:"storm-torque-ai-core",
    weightData:{
      16:{rg:2.490,diff:0.048}, 15:{rg:2.490,diff:0.048},
      14:{rg:2.520,diff:0.046}, 13:{rg:2.590,diff:0.040}, 12:{rg:2.650,diff:0.033}
    },
    releaseDate:"Dec 2025",
    description:"RX Pro Pearl on Torque A.I. — overseas Motor Rev, high-polish skid-flip motion for medium oil."
  },

  // ── Brunswick 누락분 ──────────────────────────────────────────
  {
    id:98, brand:"Brunswick", name:"Combat",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Rampart",
    finish:"500/1000/1500 Siaair, Crown Factory Compound", condition:"Medium-Heavy Oil", accent:"#e65100",
    ballSlug:"brunswick-combat", coreSlug:"brunswick-rampart-core",
    weightData:{
      16:{rg:2.490,diff:0.052,moi:0.016}, 15:{rg:2.490,diff:0.058,moi:0.018},
      14:{rg:2.510,diff:0.058,moi:0.018}, 13:{rg:2.590,diff:0.042,moi:0.014}, 12:{rg:2.610,diff:0.042,moi:0.014}
    },
    releaseDate:"Aug 2025",
    description:"HK22C Alpha Premier Pearl on Rampart — angular backend response with asymmetric midlane control."
  },
  {
    id:99, brand:"Brunswick", name:"Alert",
    cover:"Solid", coreType:"Symmetric", coreName:"Alert",
    finish:"500/1000/1500 Siaair Micro Pad", condition:"Medium-Heavy Oil", accent:"#e65100",
    ballSlug:"brunswick-alert", coreSlug:"brunswick-alert-core",
    weightData:{
      16:{rg:2.480,diff:0.042}, 15:{rg:2.480,diff:0.044},
      14:{rg:2.510,diff:0.042}, 13:{rg:2.580,diff:0.036}, 12:{rg:2.640,diff:0.030}
    },
    releaseDate:"Oct 2025",
    description:"Low RG/low diff new series — Alert is your early warning system, first-release in the all-new Alert line."
  },
  {
    id:100, brand:"Brunswick", name:"Energize",
    cover:"Pearl", coreType:"Symmetric", coreName:"Energize",
    finish:"500/1000/1500 Siaair / Factory Compound", condition:"Medium Oil", accent:"#e65100",
    ballSlug:"brunswick-energize", coreSlug:"brunswick-energize-core",
    weightData:{
      16:{rg:2.510,diff:0.040}, 15:{rg:2.500,diff:0.042},
      14:{rg:2.530,diff:0.040}, 13:{rg:2.600,diff:0.034}, 12:{rg:2.660,diff:0.028}
    },
    releaseDate:"Oct 2025",
    description:"Pearl cover on the Energize symmetric core — the -ize series newest entry for clean, angular medium oil motion."
  },

  // ── Motiv 누락분 ──────────────────────────────────────────────
  {
    id:101, brand:"Motiv", name:"Nebula",
    cover:"Pearl", coreType:"Symmetric", coreName:"Hadron",
    finish:"5500 Grit LSP", condition:"Medium Oil", accent:"#6a1b9a",
    ballSlug:"motiv-nebula", coreSlug:"motiv-hadron-core",
    weightData:{
      16:{rg:2.500,diff:0.038}, 15:{rg:2.500,diff:0.045},
      14:{rg:2.510,diff:0.049}, 13:{rg:2.570,diff:0.042}, 12:{rg:2.630,diff:0.035}
    },
    releaseDate:"Oct 2025",
    description:"Dark Matter Propulsion Pearl on Hadron dual-density core — Motiv's most angular coverstock ever, cosmic backend."
  },
  {
    id:102, brand:"Motiv", name:"Raptor Reign",
    cover:"Solid", coreType:"Asymmetric", coreName:"Impulse V2",
    finish:"2000 LSS", condition:"Heavy Oil", accent:"#6a1b9a",
    ballSlug:"motiv-raptor-reign", coreSlug:"motiv-impulse-v2-core",
    weightData:{
      16:{rg:2.570,diff:0.050,moi:0.018}, 15:{rg:2.570,diff:0.050,moi:0.018},
      14:{rg:2.600,diff:0.047,moi:0.016}, 13:{rg:2.660,diff:0.042,moi:0.013}, 12:{rg:2.720,diff:0.035,moi:0.011}
    },
    releaseDate:"Feb 2025",
    description:"Propulsion HVP Solid on Impulse V2 — dominant heavy oil raptor with high flare and strong continuous motion."
  },

  // ── Hammer 누락분 ────────────────────────────────────────────
  {
    id:103, brand:"Hammer", name:"Black Widow 2.0 Hybrid",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Gas Mask",
    finish:"500/1000/2000 Siaair Micro Pad", condition:"Heavy Oil", accent:"#b71c1c",
    ballSlug:"hammer-black-widow-20-hybrid", coreSlug:"hammer-gas-mask-core",
    weightData:{
      16:{rg:2.490,diff:0.054,moi:0.017}, 15:{rg:2.490,diff:0.057,moi:0.017},
      14:{rg:2.530,diff:0.055,moi:0.016}, 13:{rg:2.600,diff:0.047,moi:0.013}, 12:{rg:2.660,diff:0.040,moi:0.011}
    },
    releaseDate:"Jan 2023",
    description:"HK22 Hybrid cover on the Gas Mask core — more midlane read than the pearl BW2.0, built for heavy oil."
  },
  {
    id:104, brand:"Hammer", name:"NU Blue Hammer",
    cover:"Solid", coreType:"Symmetric", coreName:"Spheroid",
    finish:"500/1000/1500 Siaair Micro Pad", condition:"Medium-Heavy Oil", accent:"#b71c1c",
    ballSlug:"hammer-nu-blue-hammer", coreSlug:"hammer-spheroid-core",
    weightData:{
      16:{rg:2.500,diff:0.038}, 15:{rg:2.500,diff:0.040},
      14:{rg:2.530,diff:0.038}, 13:{rg:2.600,diff:0.032}, 12:{rg:2.660,diff:0.026}
    },
    releaseDate:"Nov 2023",
    description:"Aggression Solid HK22 on Spheroid — a modern reimagining of the iconic Blue Hammer for today's game."
  },

  // ── Roto Grip 누락분 ─────────────────────────────────────────
  {
    id:105, brand:"Roto Grip", name:"Attention Sign",
    cover:"Solid", coreType:"Asymmetric", coreName:"Momentous AV + A.I.",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#c62828",
    ballSlug:"roto-grip-attention-sign", coreSlug:"roto-grip-momentous-av-ai-core",
    weightData:{
      16:{rg:2.480,diff:0.052,moi:0.017}, 15:{rg:2.480,diff:0.049,moi:0.017},
      14:{rg:2.530,diff:0.046,moi:0.014}, 13:{rg:2.560,diff:0.034,moi:0.011}, 12:{rg:2.580,diff:0.031,moi:0.009}
    },
    releaseDate:"Jan 2026",
    description:"eTrax PLUS Solid on Momentous AV + A.I. — the Attention Star's solid big brother for heavier conditions."
  },
  {
    id:106, brand:"Roto Grip", name:"RST Hyperdrive Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"HP1 A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#c62828",
    ballSlug:"roto-grip-rst-hyperdrive-pearl", coreSlug:"roto-grip-hp1-ai-core",
    weightData:{
      16:{rg:2.560,diff:0.035}, 15:{rg:2.560,diff:0.035},
      14:{rg:2.580,diff:0.033}, 13:{rg:2.640,diff:0.028}, 12:{rg:2.700,diff:0.023}
    },
    releaseDate:"Sep 2025",
    description:"VTC Pearl on HP1 A.I. — the RST Hyperdrive's cleaner sibling for arc motion on medium oil."
  },

  // ── 900 Global 누락분 ────────────────────────────────────────
  {
    id:107, brand:"900 Global", name:"Wolverine Night",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Wolverine",
    finish:"Reacta Gloss", condition:"Medium-Heavy Oil", accent:"#1565c0",
    ballSlug:"900-global-wolverine-night", coreSlug:"900-global-wolverine-core",
    weightData:{
      16:{rg:2.490,diff:0.052,moi:0.017}, 15:{rg:2.485,diff:0.051,moi:0.017},
      14:{rg:2.520,diff:0.049,moi:0.015}, 13:{rg:2.580,diff:0.043,moi:0.012}, 12:{rg:2.640,diff:0.036,moi:0.010}
    },
    releaseDate:"Nov 2024",
    description:"Quantum Pearl on the Wolverine asymmetric core — nighttime aggression with clean arc through the front."
  },

  // ── DV8 누락분 ───────────────────────────────────────────────
  {
    id:108, brand:"DV8", name:"Intimidator",
    cover:"Solid", coreType:"Asymmetric", coreName:"Intimidator",
    finish:"500/1000/2000 Siaair Micro Pad", condition:"Heavy Oil", accent:"#bf360c",
    ballSlug:"dv8-intimidator", coreSlug:"dv8-intimidator-core",
    weightData:{
      16:{rg:2.485,diff:0.055,moi:0.018}, 15:{rg:2.480,diff:0.057,moi:0.018},
      14:{rg:2.515,diff:0.055,moi:0.017}, 13:{rg:2.585,diff:0.048,moi:0.014}, 12:{rg:2.645,diff:0.041,moi:0.012}
    },
    releaseDate:"Jun 2025",
    description:"Strong solid cover on the Intimidator asymmetric core — DV8's new flagship for maximum heavy-oil dominance."
  },

  // ── Radical 누락분 ───────────────────────────────────────────
  {
    id:109, brand:"Radical", name:"Xtra Bonus",
    cover:"Solid", coreType:"Symmetric", coreName:"Xtra Bonus",
    finish:"500/1000/1500 Siaair Micro Pad", condition:"Medium-Heavy Oil", accent:"#e65100",
    ballSlug:"radical-xtra-bonus", coreSlug:"radical-xtra-bonus-core",
    weightData:{
      16:{rg:2.490,diff:0.040}, 15:{rg:2.490,diff:0.042},
      14:{rg:2.520,diff:0.040}, 13:{rg:2.590,diff:0.034}, 12:{rg:2.650,diff:0.028}
    },
    releaseDate:"Feb 2025",
    description:"Strong solid cover on the Xtra Bonus symmetric core — versatile medium-heavy oil control ball."
  },

  // ── Track 누락분 ─────────────────────────────────────────────
  {
    id:110, brand:"Track", name:"Rhyno",
    cover:"Solid", coreType:"Symmetric", coreName:"II-Core Gen4",
    finish:"500/1000/1500 Siaair Micro Pad", condition:"Medium-Heavy Oil", accent:"#37474f",
    ballSlug:"track-rhyno", coreSlug:"track-ii-core-gen4-core",
    weightData:{
      16:{rg:2.493,diff:0.048}, 15:{rg:2.480,diff:0.050},
      14:{rg:2.510,diff:0.048}, 13:{rg:2.580,diff:0.042}
    },
    releaseDate:"Aug 2024",
    description:"QR-12 Solid HK22C on II-Core Gen4 — Track's dependable workhorse for medium-heavy oil consistency."
  },

  // ══════════════════════════════════════════════════════════════
  // v7.0 누락분 2차 추가 — 전수 재검증
  // ══════════════════════════════════════════════════════════════

  // ── Storm 추가 누락분 ─────────────────────────────────────────
  {
    id:111, brand:"Storm", name:"Concept",
    cover:"Pearl", coreType:"Symmetric", coreName:"Radius",
    finish:"Power Edge", condition:"Light-Medium Oil", accent:"#00897b",
    ballSlug:"storm-concept", coreSlug:"storm-radius-core",
    weightData:{
      16:{rg:2.590,diff:0.030}, 15:{rg:2.590,diff:0.030},
      14:{rg:2.610,diff:0.028}, 13:{rg:2.670,diff:0.022}, 12:{rg:2.730,diff:0.018}
    },
    releaseDate:"Feb 2026",
    description:"ARC Pearl on Radius weight block — urethane-alternative motion for short patterns and demanding conditions."
  },
  {
    id:112, brand:"Storm", name:"Absolute Reign",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Sentinel",
    finish:"Power Edge", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-absolute-reign", coreSlug:"storm-sentinel-core",
    weightData:{
      16:{rg:2.470,diff:0.053,moi:0.018}, 15:{rg:2.470,diff:0.052,moi:0.018},
      14:{rg:2.510,diff:0.049,moi:0.016}, 13:{rg:2.580,diff:0.043,moi:0.013}, 12:{rg:2.640,diff:0.036,moi:0.011}
    },
    releaseDate:"Jan 2026",
    description:"NeX Pearl on Sentinel — overseas Absolute series' most angular entry, sharp backend on medium-heavy oil."
  },
  {
    id:113, brand:"Storm", name:"Virtual Gravity Destino",
    cover:"Solid", coreType:"Asymmetric", coreName:"Rock HD A.I.",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-virtual-gravity-destino", coreSlug:"storm-rock-hd-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.056,moi:0.019}, 15:{rg:2.470,diff:0.055,moi:0.019},
      14:{rg:2.510,diff:0.052,moi:0.016}, 13:{rg:2.580,diff:0.047,moi:0.013}, 12:{rg:2.640,diff:0.040,moi:0.011}
    },
    releaseDate:"Jan 2026",
    description:"Overseas VG Destino — legendary Rock HD A.I. core with excellent rolling for heavy oil dominance."
  },
  {
    id:114, brand:"Storm", name:"Phaze II Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"Inverted Fe2 A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-phaze-ii-pearl", coreSlug:"storm-inverted-fe2-ai-core",
    weightData:{
      16:{rg:2.550,diff:0.045}, 15:{rg:2.550,diff:0.045},
      14:{rg:2.550,diff:0.045}, 13:{rg:2.620,diff:0.038}, 12:{rg:2.680,diff:0.031}
    },
    releaseDate:"Nov 2025",
    description:"R2S Pearl on Inverted Fe2 A.I. — the Phaze II Pearl bowlers worldwide asked for, classic shape perfected."
  },
  {
    id:115, brand:"Storm", name:"Prime Gate",
    cover:"Solid", coreType:"Symmetric", coreName:"C3 Centripetal",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-prime-gate", coreSlug:"storm-c3-centripetal-core",
    weightData:{
      16:{rg:2.530,diff:0.048}, 15:{rg:2.530,diff:0.048},
      14:{rg:2.550,diff:0.046}, 13:{rg:2.620,diff:0.040}, 12:{rg:2.680,diff:0.033}
    },
    releaseDate:"Nov 2025",
    description:"ReX Solid on C3 Centripetal — overseas Gate series Prime entry for medium-heavy oil control."
  },
  {
    id:116, brand:"Storm", name:"Star Road",
    cover:"Solid", coreType:"Symmetric", coreName:"Inverted Fe2",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-star-road", coreSlug:"storm-inverted-fe2-core",
    weightData:{
      16:{rg:2.550,diff:0.045}, 15:{rg:2.550,diff:0.045},
      14:{rg:2.550,diff:0.044}, 13:{rg:2.620,diff:0.038}, 12:{rg:2.680,diff:0.031}
    },
    releaseDate:"Oct 2025",
    description:"Overseas Star Road — enhanced High Road series with improved track stability for medium-heavy oil."
  },
  {
    id:117, brand:"Storm", name:"Summit Tune",
    cover:"Pearl", coreType:"Symmetric", coreName:"Centripetal HD A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-summit-tune", coreSlug:"storm-centripetal-hd-ai-core",
    weightData:{
      16:{rg:2.460,diff:0.056}, 15:{rg:2.460,diff:0.056},
      14:{rg:2.460,diff:0.056}, 13:{rg:2.590,diff:0.045}, 12:{rg:2.650,diff:0.035}
    },
    releaseDate:"Oct 2025",
    description:"R2S Pearl on Centripetal HD A.I. — overseas Summit continuation, stable arc with strong large hook."
  },
  {
    id:118, brand:"Storm", name:"Marvel Maxx Silver",
    cover:"Solid", coreType:"Symmetric", coreName:"Centripetal HD A.I.",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-marvel-maxx-silver", coreSlug:"storm-centripetal-hd-ai-core",
    weightData:{
      16:{rg:2.460,diff:0.056}, 15:{rg:2.460,diff:0.056},
      14:{rg:2.460,diff:0.056}, 13:{rg:2.590,diff:0.045}, 12:{rg:2.650,diff:0.035}
    },
    releaseDate:"Sep 2025",
    description:"Overseas Marvel Maxx Silver — stable arc motion, high adaptability across lane conditions."
  },
  {
    id:119, brand:"Storm", name:"PhysiX Raze",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Atomic A.I.",
    finish:"3000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-physix-raze", coreSlug:"storm-atomic-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.056,moi:0.018}, 15:{rg:2.470,diff:0.055,moi:0.018},
      14:{rg:2.520,diff:0.054,moi:0.016}, 13:{rg:2.580,diff:0.047,moi:0.013}, 12:{rg:2.640,diff:0.040,moi:0.011}
    },
    releaseDate:"Oct 2025",
    description:"EXO Hybrid on Atomic A.I. — PhysiX Raze blends cover versatility with the powerful Atomic asymmetric engine."
  },
  {
    id:120, brand:"Storm", name:"Lock-On",
    cover:"Pearl", coreType:"Symmetric", coreName:"RAD-X",
    finish:"Power Edge", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-lock-on", coreSlug:"storm-rad-x-core",
    weightData:{
      16:{rg:2.480,diff:0.046}, 15:{rg:2.480,diff:0.046},
      14:{rg:2.510,diff:0.044}, 13:{rg:2.580,diff:0.038}, 12:{rg:2.640,diff:0.031}
    },
    releaseDate:"Sep 2025",
    description:"RX Pearl on RAD-X — overseas Lock-On, smooth skid with powerful hooking response from breakpoint."
  },
  {
    id:121, brand:"Storm", name:"Blaze DNA",
    cover:"Pearl", coreType:"Symmetric", coreName:"Torsion A.I.",
    finish:"Power Edge", condition:"Light-Medium Oil", accent:"#00897b",
    ballSlug:"storm-blaze-dna", coreSlug:"storm-torsion-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.050}, 15:{rg:2.470,diff:0.050},
      14:{rg:2.500,diff:0.048}, 13:{rg:2.570,diff:0.042}, 12:{rg:2.630,diff:0.035}
    },
    releaseDate:"Apr 2025",
    description:"NRG Pearl on Torsion A.I. — overseas Blaze DNA with explosive downlane continuation."
  },

  // ── Roto Grip 추가 누락분 ─────────────────────────────────────
  {
    id:122, brand:"Roto Grip", name:"Vintage Gem",
    cover:"Pearl", coreType:"Symmetric", coreName:"Ikon + A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#c62828",
    ballSlug:"roto-grip-vintage-gem", coreSlug:"roto-grip-ikon-ai-core",
    weightData:{
      16:{rg:2.480,diff:0.048}, 15:{rg:2.480,diff:0.048},
      14:{rg:2.510,diff:0.046}, 13:{rg:2.580,diff:0.040}, 12:{rg:2.640,diff:0.033}
    },
    releaseDate:"Oct 2025",
    description:"eTrax PLUS Pearl on Ikon + A.I. — a nostalgic gem design with modern A.I. core performance."
  },
  {
    id:123, brand:"Roto Grip", name:"Hustle ETF",
    cover:"Solid", coreType:"Symmetric", coreName:"Hustle",
    finish:"500/1000/1500 Siaair Micro Pad", condition:"Medium Oil", accent:"#c62828",
    ballSlug:"roto-grip-hustle-etf", coreSlug:"roto-grip-hustle-core",
    weightData:{
      16:{rg:2.560,diff:0.030}, 15:{rg:2.560,diff:0.030},
      14:{rg:2.580,diff:0.028}, 13:{rg:2.640,diff:0.023}, 12:{rg:2.700,diff:0.018}
    },
    releaseDate:"Nov 2024",
    description:"Solid cover on Hustle core — ETF (Electric Teal Fuchsia) colorway, reliable entry-level performance."
  },
  {
    id:124, brand:"Roto Grip", name:"Gem Blue Sapphire",
    cover:"Pearl", coreType:"Symmetric", coreName:"Ikon + A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#c62828",
    ballSlug:"roto-grip-gem-blue-sapphire", coreSlug:"roto-grip-ikon-ai-core",
    weightData:{
      16:{rg:2.480,diff:0.048}, 15:{rg:2.480,diff:0.048},
      14:{rg:2.510,diff:0.046}, 13:{rg:2.580,diff:0.040}, 12:{rg:2.640,diff:0.033}
    },
    releaseDate:"Oct 2024",
    description:"eTrax PLUS Pearl on Ikon + A.I. — sapphire blue gem series with polished backend arc."
  },
  {
    id:125, brand:"Roto Grip", name:"Hustle BP",
    cover:"Pearl", coreType:"Symmetric", coreName:"Hustle",
    finish:"Power Edge", condition:"Light-Medium Oil", accent:"#c62828",
    ballSlug:"roto-grip-hustle-bp", coreSlug:"roto-grip-hustle-core",
    weightData:{
      16:{rg:2.560,diff:0.030}, 15:{rg:2.560,diff:0.030},
      14:{rg:2.580,diff:0.028}, 13:{rg:2.640,diff:0.023}, 12:{rg:2.700,diff:0.018}
    },
    releaseDate:"Jan 2026",
    description:"Pearl cover on Hustle — Black/Pink colorway, entry performance ball for light-medium conditions."
  },

  // ── Hammer 추가 누락분 ────────────────────────────────────────
  {
    id:126, brand:"Hammer", name:"Black Widow Tour V1",
    cover:"Solid", coreType:"Asymmetric", coreName:"Gas Mask Tour V1",
    finish:"500/1000/2000 Siaair Micro Pad", condition:"Medium-Heavy Oil", accent:"#b71c1c",
    ballSlug:"hammer-black-widow-tour-v1", coreSlug:"hammer-gas-mask-tour-v1-core",
    weightData:{
      16:{rg:2.490,diff:0.033,moi:0.014}, 15:{rg:2.490,diff:0.035,moi:0.014},
      14:{rg:2.530,diff:0.033,moi:0.013}, 13:{rg:2.600,diff:0.028,moi:0.010}, 12:{rg:2.660,diff:0.023,moi:0.008}
    },
    releaseDate:"Sep 2025",
    description:"HK22 Solid on Gas Mask Tour V1 — flip block removed, 20+ point lower diff for smoother controlled motion."
  },
  {
    id:127, brand:"Hammer", name:"Anger",
    cover:"Solid", coreType:"Asymmetric", coreName:"Gas Mask",
    finish:"500/1000/2000 Siaair Micro Pad", condition:"Heavy Oil", accent:"#b71c1c",
    ballSlug:"hammer-anger", coreSlug:"hammer-gas-mask-core",
    weightData:{
      16:{rg:2.490,diff:0.054,moi:0.017}, 15:{rg:2.490,diff:0.057,moi:0.017},
      14:{rg:2.530,diff:0.055,moi:0.016}, 13:{rg:2.600,diff:0.047,moi:0.013}, 12:{rg:2.660,diff:0.040,moi:0.011}
    },
    releaseDate:"Nov 2024",
    description:"HK22 Cohesion Solid on Gas Mask — bold upgrade to the Hammer line with attitude and heavy-oil character."
  },
  {
    id:128, brand:"Hammer", name:"Hammerhead",
    cover:"Solid", coreType:"Symmetric", coreName:"Spheroid",
    finish:"500/1000/1500 Siaair Micro Pad", condition:"Medium-Heavy Oil", accent:"#b71c1c",
    ballSlug:"hammer-hammerhead", coreSlug:"hammer-spheroid-core",
    weightData:{
      16:{rg:2.500,diff:0.038}, 15:{rg:2.500,diff:0.040},
      14:{rg:2.530,diff:0.038}, 13:{rg:2.600,diff:0.032}, 12:{rg:2.660,diff:0.026}
    },
    releaseDate:"Apr 2025",
    description:"Aggression Solid HK22 on Spheroid — the original Hammerhead Solid released spring 2025."
  },
  {
    id:129, brand:"Hammer", name:"Zero Mercy Solid",
    cover:"Solid", coreType:"Asymmetric", coreName:"Super Offset",
    finish:"500/1000/2000 Siaair Micro Pad", condition:"Heavy Oil", accent:"#b71c1c",
    ballSlug:"hammer-zero-mercy-solid", coreSlug:"hammer-super-offset-core",
    weightData:{
      16:{rg:2.480,diff:0.056,moi:0.018}, 15:{rg:2.485,diff:0.055,moi:0.018},
      14:{rg:2.520,diff:0.052,moi:0.016}, 13:{rg:2.590,diff:0.046,moi:0.013}, 12:{rg:2.650,diff:0.039,moi:0.011}
    },
    releaseDate:"Jan 2026",
    description:"HK22 Solid on Super Offset asymmetric core — Zero Mercy solid entry for maximum heavy oil dominance."
  },
  {
    id:130, brand:"Hammer", name:"Zero Mercy Pearl",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Super Offset",
    finish:"Power Edge", condition:"Medium-Heavy Oil", accent:"#b71c1c",
    ballSlug:"hammer-zero-mercy-pearl", coreSlug:"hammer-super-offset-core",
    weightData:{
      16:{rg:2.480,diff:0.056,moi:0.018}, 15:{rg:2.485,diff:0.055,moi:0.018},
      14:{rg:2.520,diff:0.052,moi:0.016}, 13:{rg:2.590,diff:0.046,moi:0.013}, 12:{rg:2.650,diff:0.039,moi:0.011}
    },
    releaseDate:"Jan 2026",
    description:"HK22 Pearl on Super Offset asymmetric core — the angularly sharp Zero Mercy companion."
  },
  {
    id:131, brand:"Hammer", name:"NU 2.0",
    cover:"Urethane", coreType:"Symmetric", coreName:"Spheroid",
    finish:"500/2000 SiaAir", condition:"Medium Oil", accent:"#b71c1c",
    ballSlug:"hammer-nu-20", coreSlug:"hammer-spheroid-core",
    weightData:{
      16:{rg:2.500,diff:0.038}, 15:{rg:2.500,diff:0.040},
      14:{rg:2.530,diff:0.038}, 13:{rg:2.600,diff:0.032}, 12:{rg:2.660,diff:0.026}
    },
    releaseDate:"Jan 2026",
    description:"Not Urethane (NuCoat) Grey matte cover on Spheroid — follow-up to NU Blue Hammer, MCP-style control."
  },

  // ── Motiv 추가 누락분 ─────────────────────────────────────────
  {
    id:132, brand:"Motiv", name:"Shadow Tank",
    cover:"Pearl", coreType:"Symmetric", coreName:"Halogen V2",
    finish:"5500 LSP", condition:"Medium-Heavy Oil", accent:"#6a1b9a",
    ballSlug:"motiv-shadow-tank", coreSlug:"motiv-halogen-v2-core",
    weightData:{
      16:{rg:2.500,diff:0.045}, 15:{rg:2.500,diff:0.045},
      14:{rg:2.510,diff:0.049}, 13:{rg:2.570,diff:0.042}, 12:{rg:2.630,diff:0.035}
    },
    releaseDate:"Oct 2025",
    description:"Frixion M7 Pearl MCP on Halogen V2 — smoothest, most controllable Tank with urethane-like predictability."
  },
  {
    id:133, brand:"900 Global", name:"Origin",
    cover:"Solid", coreType:"Asymmetric", coreName:"Ellipse A.I.",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#1565c0",
    ballSlug:"900-global-origin", coreSlug:"900-global-ellipse-ai-core",
    weightData:{
      16:{rg:2.490,diff:0.052,moi:0.017}, 15:{rg:2.485,diff:0.051,moi:0.017},
      14:{rg:2.520,diff:0.049,moi:0.015}, 13:{rg:2.580,diff:0.043,moi:0.012}, 12:{rg:2.640,diff:0.036,moi:0.010}
    },
    releaseDate:"Nov 2024",
    description:"Quantum Solid on Ellipse A.I. — dual precession weight block design for unparalleled hook and turbulence."
  },
  {
    id:134, brand:"900 Global", name:"Viking",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Viking",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#1565c0",
    ballSlug:"900-global-viking", coreSlug:"900-global-viking-core",
    weightData:{
      16:{rg:2.490,diff:0.052,moi:0.017}, 15:{rg:2.485,diff:0.051,moi:0.017},
      14:{rg:2.520,diff:0.049,moi:0.015}, 13:{rg:2.580,diff:0.043,moi:0.012}, 12:{rg:2.640,diff:0.036,moi:0.010}
    },
    releaseDate:"Feb 2026",
    description:"Quantum Hybrid on Viking asymmetric core — aggressive Nordic force for heavy oil conditions."
  },

  // ── DV8 추가 누락분 ──────────────────────────────────────────
  {
    id:135, brand:"Columbia 300", name:"Ricochet Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"Ricochet",
    finish:"500/1000/1500 Siaair / Factory Compound", condition:"Medium Oil", accent:"#0277bd",
    ballSlug:"columbia-300-ricochet-pearl", coreSlug:"columbia-300-ricochet-core",
    weightData:{
      16:{rg:2.540,diff:0.040}, 15:{rg:2.540,diff:0.042},
      14:{rg:2.560,diff:0.040}, 13:{rg:2.620,diff:0.034}, 12:{rg:2.680,diff:0.028}
    },
    releaseDate:"Nov 2024",
    description:"Pearl cover on Ricochet + Dynamicore — more explosive backend, sharp breakpoint for medium oil."
  },
  {
    id:136, brand:"Columbia 300", name:"Super Cuda PowerCOR Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"Super Cuda PowerCOR",
    finish:"Factory Compound", condition:"Medium Oil", accent:"#0277bd",
    ballSlug:"columbia-300-super-cuda-powercor-pearl", coreSlug:"columbia-300-super-cuda-powercor-core",
    weightData:{
      16:{rg:2.540,diff:0.040}, 15:{rg:2.540,diff:0.042},
      14:{rg:2.560,diff:0.040}, 13:{rg:2.620,diff:0.034}, 12:{rg:2.680,diff:0.028}
    },
    releaseDate:"Feb 2026",
    description:"Pearl cover on Super Cuda PowerCOR — faster, flashier and fiercer return of the Super Cuda lineup."
  },

  // ── Ebonite 추가 누락분 ───────────────────────────────────────
  {
    id:137, brand:"Ebonite", name:"Real Time",
    cover:"Solid", coreType:"Symmetric", coreName:"Big Time",
    finish:"500/1000/1500 Siaair Micro Pad", condition:"Medium Oil", accent:"#4e342e",
    ballSlug:"ebonite-real-time", coreSlug:"ebonite-big-time-core",
    weightData:{
      16:{rg:2.520,diff:0.040}, 15:{rg:2.520,diff:0.042},
      14:{rg:2.540,diff:0.040}, 13:{rg:2.600,diff:0.034}, 12:{rg:2.660,diff:0.028}
    },
    releaseDate:"Nov 2024",
    description:"HK22 GB13.7 Solid on Big Time core — sharp backend move on medium conditions, standout value."
  },

  // ── Radical 추가 누락분 ───────────────────────────────────────
  {
    id:138, brand:"SWAG", name:"Judgement Hybrid",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Judgement",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#1a237e",
    ballSlug:"swag-judgement-hybrid", coreSlug:"swag-judgement-core",
    weightData:{
      15:{rg:2.480,diff:0.052,moi:0.017},
      14:{rg:2.510,diff:0.050,moi:0.015}, 13:{rg:2.580,diff:0.044,moi:0.012}
    },
    releaseDate:"Feb 2026",
    description:"SWAG Slayer AP26 Hybrid on Judgement asymmetric — one of six new AP26 launch balls for Feb 2026."
  },
  {
    id:139, brand:"SWAG", name:"Unreal Solid",
    cover:"Solid", coreType:"Asymmetric", coreName:"Unreal",
    finish:"3000 Abralon", condition:"Heavy Oil", accent:"#1a237e",
    ballSlug:"swag-unreal-solid", coreSlug:"swag-unreal-core",
    weightData:{
      15:{rg:2.480,diff:0.054,moi:0.017},
      14:{rg:2.510,diff:0.052,moi:0.015}, 13:{rg:2.580,diff:0.046,moi:0.012}
    },
    releaseDate:"Feb 2026",
    description:"SWAG Never Quit AP26 Solid on Unreal asymmetric core — maximum heavy oil performance with AP26 tech."
  },
  {
    id:140, brand:"SWAG", name:"Fusion Hybrid",
    cover:"Hybrid", coreType:"Symmetric", coreName:"Fusion",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#1a237e",
    ballSlug:"swag-fusion-hybrid", coreSlug:"swag-fusion-core",
    weightData:{
      15:{rg:2.540,diff:0.036},
      14:{rg:2.560,diff:0.034}, 13:{rg:2.620,diff:0.028}
    },
    releaseDate:"Aug 2025",
    description:"Serum Hybrid AP26 on Fusion symmetric core — benchmark versatility with 2.54 RG for lane transition."
  },

  // ── Track 추가 누락분 ─────────────────────────────────────────
  {
    id:141, brand:"Track", name:"I-Core Gen4",
    cover:"Solid", coreType:"Asymmetric", coreName:"I-Core Gen4",
    finish:"500/1000/1500 Siaair / Factory Compound", condition:"Heavy Oil", accent:"#37474f",
    ballSlug:"track-i-core-gen4", coreSlug:"track-i-core-gen4-core",
    weightData:{
      16:{rg:2.480,diff:0.052,moi:0.017}, 15:{rg:2.480,diff:0.052,moi:0.017},
      14:{rg:2.510,diff:0.050,moi:0.015}, 13:{rg:2.580,diff:0.044,moi:0.012}
    },
    releaseDate:"Feb 2026",
    description:"QR-12 Solid HK22C on I-Core Gen4 — Track's debut asymmetric Gen4 core for heavy oil tournament play."
  },

  // ══════════════════════════════════════════════════════════════
  // v7.1 최종 누락분 — 3차 전수 검증
  // ══════════════════════════════════════════════════════════════

  // ── 900 Global ───────────────────────────────────────────────
  {
    id:142, brand:"900 Global", name:"Cove",
    cover:"Hybrid", coreType:"Symmetric", coreName:"Magna A.I.",
    finish:"500/1000/1500 Siaair / Factory Compound", condition:"Medium-Heavy Oil", accent:"#1565c0",
    ballSlug:"900-global-cove", coreSlug:"900-global-magna-ai-core",
    weightData:{16:{rg:2.480,diff:0.048},15:{rg:2.480,diff:0.048},14:{rg:2.510,diff:0.046},13:{rg:2.580,diff:0.040},12:{rg:2.640,diff:0.033}},
    releaseDate:"Aug 2025",
    description:"RB 85 Hybrid on Magna A.I. dual-hemisphere symmetric core — smooth, continuous motion on medium-heavy."
  },
  {
    id:143, brand:"900 Global", name:"Ember",
    cover:"Pearl", coreType:"Symmetric", coreName:"Magna A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#1565c0",
    ballSlug:"900-global-ember", coreSlug:"900-global-magna-ai-core",
    weightData:{16:{rg:2.480,diff:0.048},15:{rg:2.480,diff:0.048},14:{rg:2.510,diff:0.046},13:{rg:2.580,diff:0.040},12:{rg:2.640,diff:0.033}},
    releaseDate:"Aug 2025",
    description:"RB 82 Pearl on Magna A.I. — stronger backend Cove companion, angular pearl for medium conditions."
  },
  {
    id:144, brand:"900 Global", name:"Mach Cruise",
    cover:"Solid", coreType:"Symmetric", coreName:"Cruise",
    finish:"Power Edge", condition:"Medium-Heavy Oil", accent:"#1565c0",
    ballSlug:"900-global-mach-cruise", coreSlug:"900-global-cruise-core",
    weightData:{16:{rg:2.560,diff:0.035},15:{rg:2.560,diff:0.035},14:{rg:2.580,diff:0.033},13:{rg:2.640,diff:0.028},12:{rg:2.700,diff:0.023}},
    releaseDate:"Jul 2025",
    description:"Reserve Blend 93 Solid on Cruise symmetric core — overseas Mach Cruise for controlled medium-heavy oil."
  },
  {
    id:145, brand:"900 Global", name:"Honey Badger Black Edition",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Grapnel 2.0",
    finish:"Power Edge", condition:"Medium Oil", accent:"#1565c0",
    ballSlug:"900-global-honey-badger-black-edition", coreSlug:"900-global-grapnel-20-core",
    weightData:{16:{rg:2.540,diff:0.048,moi:0.012},15:{rg:2.540,diff:0.048,moi:0.012},14:{rg:2.560,diff:0.046,moi:0.010},13:{rg:2.620,diff:0.040,moi:0.008},12:{rg:2.680,diff:0.033,moi:0.006}},
    releaseDate:"Jul 2025",
    description:"Reserve Blend 70E Hybrid on Grapnel 2.0 asymmetric — Black Edition HB for medium oil skid/flip shape."
  },
  {
    id:146, brand:"900 Global", name:"Reality Incursion",
    cover:"Solid", coreType:"Asymmetric", coreName:"Disturbance A.I.",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#1565c0",
    ballSlug:"900-global-reality-incursion", coreSlug:"900-global-disturbance-ai-core",
    weightData:{16:{rg:2.470,diff:0.056,moi:0.018},15:{rg:2.470,diff:0.056,moi:0.018},14:{rg:2.500,diff:0.054,moi:0.016},13:{rg:2.560,diff:0.048,moi:0.013},12:{rg:2.620,diff:0.041,moi:0.011}},
    releaseDate:"Sep 2025",
    description:"Reserve Blend 901 Solid on Disturbance A.I. — Reality's next chapter; lower RG, higher diff via A.I. outer core."
  },
  {
    id:147, brand:"900 Global", name:"Remaster Honey Badger",
    cover:"Solid", coreType:"Asymmetric", coreName:"Grapnel 2.0",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#1565c0",
    ballSlug:"900-global-remaster-honey-badger", coreSlug:"900-global-grapnel-20-core",
    weightData:{16:{rg:2.540,diff:0.048,moi:0.012},15:{rg:2.540,diff:0.048,moi:0.012},14:{rg:2.560,diff:0.046,moi:0.010},13:{rg:2.620,diff:0.040,moi:0.008},12:{rg:2.680,diff:0.033,moi:0.006}},
    releaseDate:"Jan 2026",
    description:"Reserve Blend 70D Solid on Grapnel 2.0 — Remaster Honey Badger solid for medium-heavy oil dominance."
  },
  {
    id:148, brand:"900 Global", name:"Origin EX",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Ellipse A.I.",
    finish:"Power Edge", condition:"Medium-Heavy Oil", accent:"#1565c0",
    ballSlug:"900-global-origin-ex", coreSlug:"900-global-ellipse-ai-core",
    weightData:{16:{rg:2.470,diff:0.056,moi:0.018},15:{rg:2.480,diff:0.054,moi:0.017},14:{rg:2.510,diff:0.052,moi:0.015},13:{rg:2.570,diff:0.046,moi:0.012},12:{rg:2.630,diff:0.039,moi:0.010}},
    releaseDate:"Oct 2025",
    description:"Quantum Pearl on Ellipse A.I. — Origin's pearl companion with angular backend and same dual-precession power."
  },
  {
    id:149, brand:"900 Global", name:"Rev Matrix",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Matrix",
    finish:"Power Edge", condition:"Medium Oil", accent:"#1565c0",
    ballSlug:"900-global-rev-matrix", coreSlug:"900-global-matrix-core",
    weightData:{16:{rg:2.490,diff:0.048,moi:0.014},15:{rg:2.490,diff:0.048,moi:0.014},14:{rg:2.520,diff:0.046,moi:0.012},13:{rg:2.580,diff:0.040,moi:0.009},12:{rg:2.640,diff:0.033,moi:0.007}},
    releaseDate:"Oct 2025",
    description:"S86R Pearl on Matrix flip-block asymmetric core — overseas, designed by PWBA pro Daria Payonk for medium oil."
  },
  {
    id:150, brand:"900 Global", name:"Duty Majesty",
    cover:"Hybrid", coreType:"Symmetric", coreName:"Duty",
    finish:"1500 Polished", condition:"Medium Oil", accent:"#1565c0",
    ballSlug:"900-global-duty-majesty", coreSlug:"900-global-duty-core",
    weightData:{16:{rg:2.540,diff:0.038},15:{rg:2.540,diff:0.038},14:{rg:2.560,diff:0.036},13:{rg:2.620,diff:0.030},12:{rg:2.680,diff:0.024}},
    releaseDate:"Feb 2025",
    description:"Reserve Blend 902 Hybrid on Duty symmetric core — overseas controlled motion for medium lane conditions."
  },
  {
    id:151, brand:"900 Global", name:"Honey Badger Blameless",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Grapnel 2.0",
    finish:"3000 Abralon", condition:"Light-Medium Oil", accent:"#1565c0",
    ballSlug:"900-global-honey-badger-blameless", coreSlug:"900-global-grapnel-20-core",
    weightData:{16:{rg:2.540,diff:0.048,moi:0.012},15:{rg:2.540,diff:0.048,moi:0.012},14:{rg:2.560,diff:0.046,moi:0.010},13:{rg:2.620,diff:0.040,moi:0.008},12:{rg:2.680,diff:0.033,moi:0.006}},
    releaseDate:"Feb 2025",
    description:"Reserve Blend 701 Pearl on Grapnel 2.0 — overseas Blameless, angular Honey Badger for light-medium oil."
  },

  // ── Motiv ─────────────────────────────────────────────────────
  {
    id:152, brand:"Motiv", name:"Jackal ExJ",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Predator V2",
    finish:"2000 LSS", condition:"Heavy Oil", accent:"#6a1b9a",
    ballSlug:"motiv-jackal-exj", coreSlug:"motiv-predator-v2-core",
    weightData:{16:{rg:2.570,diff:0.056,moi:0.020},15:{rg:2.570,diff:0.056,moi:0.020},14:{rg:2.600,diff:0.053,moi:0.017},13:{rg:2.660,diff:0.048,moi:0.014},12:{rg:2.720,diff:0.041,moi:0.012}},
    releaseDate:"Jan 2026",
    description:"Propulsion HVH Hybrid on Predator V2 — first hybrid Jackal in 3+ years, slots between Jackal Ghost and Crimson Jackal."
  },
  {
    id:153, brand:"Motiv", name:"Subzero Forge",
    cover:"Solid", coreType:"Symmetric", coreName:"Detonator",
    finish:"2000 LSS", condition:"Heavy Oil", accent:"#6a1b9a",
    ballSlug:"motiv-subzero-forge", coreSlug:"motiv-detonator-core",
    weightData:{16:{rg:2.470,diff:0.052},15:{rg:2.470,diff:0.052},14:{rg:2.500,diff:0.050},13:{rg:2.560,diff:0.044},12:{rg:2.620,diff:0.037}},
    releaseDate:"Sep 2025",
    description:"Leverage MXC Solid + Duramax on Detonator symmetric — ice-cold heavy oil force, strong early read with continuous motion."
  },
  {
    id:154, brand:"Motiv", name:"Max Thrill Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"Halogen V2",
    finish:"5500 LSP", condition:"Light-Medium Oil", accent:"#6a1b9a",
    ballSlug:"motiv-max-thrill-pearl", coreSlug:"motiv-halogen-v2-core",
    weightData:{16:{rg:2.600,diff:0.035},15:{rg:2.600,diff:0.035},14:{rg:2.620,diff:0.033},13:{rg:2.680,diff:0.028},12:{rg:2.740,diff:0.022}},
    releaseDate:"Sep 2025",
    description:"Turmoil XP3 Pearl on Halogen V2 — more angular and cleaner than Top Thrill Pearl, serious dry-lane explosion."
  },

  // ── SWAG ──────────────────────────────────────────────────────
  {
    id:155, brand:"SWAG", name:"Craze Tour Solid",
    cover:"Solid", coreType:"Symmetric", coreName:"Craze",
    finish:"3000 Abralon", condition:"Medium-Heavy Oil", accent:"#1a237e",
    ballSlug:"swag-craze-tour-solid", coreSlug:"swag-craze-core",
    weightData:{15:{rg:2.540,diff:0.036},14:{rg:2.560,diff:0.034},13:{rg:2.620,diff:0.028}},
    releaseDate:"Feb 2026",
    description:"SWAG Rage Solid AP26 on Craze symmetric core — solid companion to Craze Tour Pearl with more oil traction."
  },

  // ══════════════════════════════════════════════════════════════
  // v7.2 누락분 4차 추가 — 전수 재검증 (페이지네이션 포함)
  // ══════════════════════════════════════════════════════════════

  // ── Storm 추가 누락분 (bowwwl p1~2 대조) ──────────────────────
  {
    id:156, brand:"Storm", name:"Hy-Road 40",
    cover:"Pearl", coreType:"Symmetric", coreName:"Inverted Fe2",
    finish:"Power Edge", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-hy-road-40", coreSlug:"storm-inverted-fe2-core",
    weightData:{16:{rg:2.570,diff:0.046},15:{rg:2.570,diff:0.046},14:{rg:2.570,diff:0.044},13:{rg:2.630,diff:0.038},12:{rg:2.690,diff:0.031}},
    releaseDate:"Jun 2025",
    description:"A1S Pearl on Inverted Fe2 — 40th anniversary HyRoad, clean through the fronts with predictable angular backend."
  },
  {
    id:157, brand:"Storm", name:"!Q Spear",
    cover:"Solid", coreType:"Symmetric", coreName:"C3 Centripetal A.I.",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-iq-spear", coreSlug:"storm-c3-centripetal-ai-core",
    weightData:{16:{rg:2.550,diff:0.045},15:{rg:2.550,diff:0.045},14:{rg:2.550,diff:0.043},13:{rg:2.620,diff:0.037},12:{rg:2.680,diff:0.030}},
    releaseDate:"Jan 2026",
    description:"R2S Solid on C3 Centripetal A.I. — ultimate control and workability at the breakpoint, A.I. enhanced energy transfer."
  },
  {
    id:158, brand:"Storm", name:"Motor 30",
    cover:"Pearl", coreType:"Symmetric", coreName:"Torsion A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-motor-30", coreSlug:"storm-torsion-ai-core",
    weightData:{16:{rg:2.490,diff:0.048},15:{rg:2.490,diff:0.048},14:{rg:2.520,diff:0.046},13:{rg:2.590,diff:0.040},12:{rg:2.650,diff:0.033}},
    releaseDate:"Feb 2026",
    description:"RX Pro Pearl on Torsion A.I. — Motor line's 30th anniversary limited edition with explosive rev-up motion."
  },
  {
    id:159, brand:"Storm", name:"IDentity B-C-P",
    cover:"Hybrid", coreType:"Symmetric", coreName:"Ignition A.I.",
    finish:"3000 Abralon", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-identity-bcp", coreSlug:"storm-ignition-ai-core",
    weightData:{16:{rg:2.490,diff:0.050},15:{rg:2.490,diff:0.050},14:{rg:2.520,diff:0.048},13:{rg:2.590,diff:0.042},12:{rg:2.650,diff:0.035}},
    releaseDate:"Jan 2026",
    description:"Hybrid cover on Ignition A.I. — B-C-P (Blue/Crimson/Purple) colorway IDentity, versatile medium oil performer."
  },
  {
    id:160, brand:"Storm", name:"Grand Gate",
    cover:"Pearl", coreType:"Symmetric", coreName:"Ignition A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-grand-gate", coreSlug:"storm-ignition-ai-core",
    weightData:{16:{rg:2.490,diff:0.050},15:{rg:2.490,diff:0.050},14:{rg:2.520,diff:0.048},13:{rg:2.590,diff:0.042},12:{rg:2.650,diff:0.035}},
    releaseDate:"Mar 2025",
    description:"A1S Pearl on Ignition A.I. — Gate series' premium pearl for clean skid with sharp angular backend reaction."
  },
  {
    id:161, brand:"Storm", name:"Star Gate",
    cover:"Solid", coreType:"Symmetric", coreName:"Ignition A.I.",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-star-gate", coreSlug:"storm-ignition-ai-core",
    weightData:{16:{rg:2.490,diff:0.050},15:{rg:2.490,diff:0.050},14:{rg:2.520,diff:0.048},13:{rg:2.590,diff:0.042},12:{rg:2.650,diff:0.035}},
    releaseDate:"Oct 2024",
    description:"Hybrid cover on Ignition A.I. — Star Gate's blueberry-scented aggressive solid Gate series entry."
  },
  {
    id:162, brand:"Storm", name:"Marvel Flame",
    cover:"Solid", coreType:"Symmetric", coreName:"Centripetal HD A.I.",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-marvel-flame", coreSlug:"storm-centripetal-hd-ai-core",
    weightData:{16:{rg:2.460,diff:0.056},15:{rg:2.460,diff:0.056},14:{rg:2.460,diff:0.056},13:{rg:2.590,diff:0.045},12:{rg:2.650,diff:0.035}},
    releaseDate:"Feb 2025",
    description:"EXO Solid on Centripetal HD A.I. — 3rd Marvel A.I. series, stable arc with high scoreability on medium-heavy."
  },
  {
    id:163, brand:"Storm", name:"Code Impact",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"RAD4",
    finish:"3000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-code-impact", coreSlug:"storm-rad4-core",
    weightData:{16:{rg:2.470,diff:0.058,moi:0.020},15:{rg:2.470,diff:0.057,moi:0.020},14:{rg:2.510,diff:0.054,moi:0.017},13:{rg:2.580,diff:0.048,moi:0.014},12:{rg:2.640,diff:0.041,moi:0.012}},
    releaseDate:"Sep 2025",
    description:"NeX Hybrid on RAD4 — the Code series' heaviest hitter, highest diff in the Premier line for maximum heavy oil."
  },
  {
    id:164, brand:"Storm", name:"Summit World",
    cover:"Solid", coreType:"Symmetric", coreName:"Centripetal HD A.I.",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-summit-world", coreSlug:"storm-centripetal-hd-ai-core",
    weightData:{16:{rg:2.460,diff:0.056},15:{rg:2.460,diff:0.056},14:{rg:2.460,diff:0.056},13:{rg:2.590,diff:0.045},12:{rg:2.650,diff:0.035}},
    releaseDate:"Jul 2025",
    description:"R2S Solid on Centripetal HD A.I. — overseas Summit World, strong continuous roll on medium-heavy oil."
  },
  {
    id:165, brand:"Storm", name:"Wild Absolute",
    cover:"Solid", coreType:"Asymmetric", coreName:"Sentinel",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-wild-absolute", coreSlug:"storm-sentinel-core",
    weightData:{16:{rg:2.470,diff:0.053,moi:0.018},15:{rg:2.470,diff:0.052,moi:0.018},14:{rg:2.510,diff:0.049,moi:0.016},13:{rg:2.580,diff:0.043,moi:0.013},12:{rg:2.640,diff:0.036,moi:0.011}},
    releaseDate:"Dec 2024",
    description:"NeX Solid on Sentinel — overseas Wild Absolute, stable power axis movement for continuous heavy oil dominance."
  },
  {
    id:166, brand:"Storm", name:"DNA Strand",
    cover:"Solid", coreType:"Asymmetric", coreName:"G2",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-dna-strand", coreSlug:"storm-g2-core",
    weightData:{16:{rg:2.470,diff:0.058,moi:0.019},15:{rg:2.470,diff:0.057,moi:0.019},14:{rg:2.510,diff:0.054,moi:0.017},13:{rg:2.580,diff:0.048,moi:0.014},12:{rg:2.640,diff:0.041,moi:0.012}},
    releaseDate:"Mar 2025",
    description:"NeX Solid on G2 asymmetric — stronger midlane read than DNA Coil II, 11% more entry angle vs NRG cover."
  },
  {
    id:167, brand:"Storm", name:"Bite Panic A.I.",
    cover:"Pearl", coreType:"Asymmetric", coreName:"G2 A.I.",
    finish:"Power Edge", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-bite-panic-ai", coreSlug:"storm-g2-ai-core",
    weightData:{16:{rg:2.470,diff:0.058,moi:0.019},15:{rg:2.470,diff:0.057,moi:0.019},14:{rg:2.510,diff:0.054,moi:0.017},13:{rg:2.580,diff:0.048,moi:0.014},12:{rg:2.640,diff:0.041,moi:0.012}},
    releaseDate:"Jan 2025",
    description:"EXO Pearl on G2 A.I. — overseas Bite Panic A.I., improved oil-resistance front and boosted backend power."
  },
  {
    id:168, brand:"Storm", name:"Bite Panic X",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"G2",
    finish:"3000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-bite-panic-x", coreSlug:"storm-g2-core",
    weightData:{16:{rg:2.470,diff:0.058,moi:0.019},15:{rg:2.470,diff:0.057,moi:0.019},14:{rg:2.510,diff:0.054,moi:0.017},13:{rg:2.580,diff:0.048,moi:0.014},12:{rg:2.640,diff:0.041,moi:0.012}},
    releaseDate:"Jun 2024",
    description:"EXO Hybrid on G2 — overseas Bite Panic X, fine flare pattern with astonishing pin action on heavy oil."
  },
  {
    id:169, brand:"Storm", name:"PhysiX Power Elite IV",
    cover:"Solid", coreType:"Asymmetric", coreName:"Atomic A.I.",
    finish:"2000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-physix-power-elite-iv", coreSlug:"storm-atomic-ai-core",
    weightData:{16:{rg:2.470,diff:0.056,moi:0.018},15:{rg:2.470,diff:0.055,moi:0.018},14:{rg:2.520,diff:0.054,moi:0.016},13:{rg:2.580,diff:0.047,moi:0.013},12:{rg:2.640,diff:0.040,moi:0.011}},
    releaseDate:"Oct 2024",
    description:"R2S Solid on Atomic A.I. — PhysiX Power Elite IV, overseas limited release for maximum heavy oil performance."
  },
  {
    id:170, brand:"Storm", name:"Blue !Q",
    cover:"Solid", coreType:"Symmetric", coreName:"C3 Centripetal A.I.",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-blue-iq", coreSlug:"storm-c3-centripetal-ai-core",
    weightData:{16:{rg:2.550,diff:0.045},15:{rg:2.550,diff:0.045},14:{rg:2.550,diff:0.043},13:{rg:2.620,diff:0.037},12:{rg:2.680,diff:0.030}},
    releaseDate:"Jun 2025",
    description:"R2S Solid on C3 A.I. — Blue !Q celebrating the iconic IQ lineage with A.I. enhanced control motion."
  },
  {
    id:171, brand:"Storm", name:"!Q Super G",
    cover:"Solid", coreType:"Symmetric", coreName:"C3 Centripetal",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-iq-super-g", coreSlug:"storm-c3-centripetal-core",
    weightData:{16:{rg:2.550,diff:0.040},15:{rg:2.550,diff:0.040},14:{rg:2.550,diff:0.038},13:{rg:2.620,diff:0.032},12:{rg:2.680,diff:0.026}},
    releaseDate:"Aug 2024",
    description:"R2S Solid on C3 Centripetal — overseas !Q Super G, tuned for smooth mid-lane transition and predictable arc."
  },

  // ── Brunswick 추가 누락분 ──────────────────────────────────────
  {
    id:172, brand:"Brunswick", name:"Danger Zone Purple Ice",
    cover:"Solid", coreType:"Symmetric", coreName:"Twist",
    finish:"500/1000/1500 Siaair Micro Pad", condition:"Medium-Heavy Oil", accent:"#e65100",
    ballSlug:"brunswick-danger-zone-purple-ice", coreSlug:"brunswick-twist-core",
    weightData:{16:{rg:2.510,diff:0.040},15:{rg:2.500,diff:0.042},14:{rg:2.530,diff:0.040},13:{rg:2.600,diff:0.034},12:{rg:2.660,diff:0.028}},
    releaseDate:"Feb 2026",
    description:"QR-12 Solid on Twist symmetric — Danger Zone Purple Ice colorway, same spec as the black version."
  },
  {
    id:173, brand:"Brunswick", name:"Melee Jab Void Black",
    cover:"Solid", coreType:"Symmetric", coreName:"Melee",
    finish:"500/1000/1500 Siaair Micro Pad", condition:"Medium Oil", accent:"#e65100",
    ballSlug:"brunswick-melee-jab-void-black", coreSlug:"brunswick-melee-core",
    weightData:{16:{rg:2.560,diff:0.030},15:{rg:2.560,diff:0.032},14:{rg:2.580,diff:0.030},13:{rg:2.640,diff:0.025},12:{rg:2.700,diff:0.020}},
    releaseDate:"Nov 2025",
    description:"Reactive Solid on Melee symmetric — Void Black colorway Melee Jab, entry-level medium oil performance."
  },
  {
    id:174, brand:"Brunswick", name:"Vapor Zone Red",
    cover:"Pearl", coreType:"Symmetric", coreName:"Vapor",
    finish:"Factory Compound", condition:"Medium Oil", accent:"#e65100",
    ballSlug:"brunswick-vapor-zone-red", coreSlug:"brunswick-vapor-core",
    weightData:{16:{rg:2.560,diff:0.032},15:{rg:2.560,diff:0.034},14:{rg:2.580,diff:0.032},13:{rg:2.640,diff:0.027},12:{rg:2.700,diff:0.022}},
    releaseDate:"Dec 2025",
    description:"Pearl cover on Vapor symmetric core — Vapor Zone Red, polished entry-level ball for medium oil conditions."
  },

  // ══════════════════════════════════════════════════════════════
  // v7.3 — 5차 전수검증: 중복 22개 제거 + 실제 누락 3개 추가
  // ══════════════════════════════════════════════════════════════
  {
    id:175, brand:"Hammer", name:"Special Effect",
    cover:"Solid", coreType:"Asymmetric", coreName:"Huntsman",
    finish:"500/1000/1500 Siaair, Crown Factory Compound", condition:"Medium-Heavy Oil", accent:"#d84315",
    ballSlug:"hammer-special-effect", coreSlug:"hammer-huntsman-core",
    weightData:{16:{rg:2.483,diff:0.043,moi:0.015},15:{rg:2.470,diff:0.050,moi:0.017},14:{rg:2.495,diff:0.050,moi:0.016},13:{rg:2.597,diff:0.041,moi:0.014},12:{rg:2.593,diff:0.041,moi:0.014}},
    releaseDate:"Mar 2025",
    description:"HK22C Cohesion Solid on Huntsman asymmetric — follow-up to the Effect, slightly earlier read for medium-heavy oil with the same signature Huntsman power."
  },
  {
    id:176, brand:"Hammer", name:"Black Widow Mania",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Gas Mask",
    finish:"500/1000/1500 Siaair, Crown Factory Compound", condition:"Medium Oil", accent:"#d84315",
    ballSlug:"hammer-black-widow-mania", coreSlug:"hammer-gas-mask-core",
    weightData:{16:{rg:2.510,diff:0.048,moi:0.015},15:{rg:2.500,diff:0.058,moi:0.016},14:{rg:2.500,diff:0.056,moi:0.016},13:{rg:2.589,diff:0.043,moi:0.011},12:{rg:2.612,diff:0.043,moi:0.011}},
    releaseDate:"Jan 2025",
    description:"HK22C Cohesion Pearl on Gas Mask — longer and sharper than BW 2.0 Hybrid, perfect medium oil follow-up in the legendary Black Widow lineage."
  },
  {
    id:177, brand:"Motiv", name:"Primal Ghost",
    cover:"Solid", coreType:"Symmetric", coreName:"Impulse V2",
    finish:"3000 LSS", condition:"Medium Oil", accent:"#e65100",
    ballSlug:"motiv-primal-ghost", coreSlug:"motiv-impulse-v2-core",
    weightData:{16:{rg:2.540,diff:0.049},15:{rg:2.550,diff:0.050},14:{rg:2.560,diff:0.054},13:{rg:2.600,diff:0.055},12:{rg:2.670,diff:0.040}},
    releaseDate:"Sep 2025",
    description:"Coercion HFS Solid on Impulse V2 symmetric — fusion of Jackal Ghost's legendary cover with Primal Rage's proven core, smooth and strong medium oil performer."
  },

  // ── Motiv 누락 ────────────────────────────────────────────────
  {
    id:178, brand:"Motiv", name:"Evoke",
    cover:"Solid", coreType:"Asymmetric", coreName:"Overload",
    finish:"2000 Siaair", condition:"Medium-Heavy Oil", accent:"#7b1fa2",
    ballSlug:"motiv-evoke", coreSlug:"motiv-overload-core",
    weightData:{16:{rg:2.480,diff:0.050,moi:0.017},15:{rg:2.480,diff:0.050,moi:0.017},14:{rg:2.510,diff:0.047,moi:0.015},13:{rg:2.580,diff:0.042,moi:0.012},12:{rg:2.640,diff:0.035,moi:0.010}},
    releaseDate:"Feb 2024",
    description:"Leverage MXC Solid on Overload asymmetric — tunable differential, smooth heavy oil benchmark control."
  },
  {
    id:179, brand:"Motiv", name:"Evoke Hysteria",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Overload",
    finish:"4000 LSS", condition:"Medium-Heavy Oil", accent:"#7b1fa2",
    ballSlug:"motiv-evoke-hysteria", coreSlug:"motiv-overload-core",
    weightData:{16:{rg:2.480,diff:0.050,moi:0.017},15:{rg:2.480,diff:0.050,moi:0.017},14:{rg:2.510,diff:0.047,moi:0.015},13:{rg:2.580,diff:0.042,moi:0.012},12:{rg:2.640,diff:0.035,moi:0.010}},
    releaseDate:"Mar 2025",
    description:"Propulsion MXV Pearl on Overload — angular backend with tunable differential, devastatingly controllable entry angle."
  },

  // ── Columbia 300 누락 ─────────────────────────────────────────
  {
    id:180, brand:"Columbia 300", name:"Ricochet Return",
    cover:"Hybrid", coreType:"Symmetric", coreName:"Ricochet",
    finish:"Factory Polish", condition:"Medium Oil", accent:"#0277bd",
    ballSlug:"columbia-300-ricochet-return", coreSlug:"columbia-300-ricochet-core",
    weightData:{16:{rg:2.502,diff:0.047},15:{rg:2.488,diff:0.054},14:{rg:2.535,diff:0.054},13:{rg:2.600,diff:0.048},12:{rg:2.660,diff:0.040}},
    releaseDate:"Jan 2025",
    description:"HK22C Micro Flex Hybrid on Ricochet core — skid/flip hybrid companion to the original pearl, versatile medium oil option."
  },
  {
    id:181, brand:"Columbia 300", name:"Pulse",
    cover:"Solid", coreType:"Symmetric", coreName:"Pulse PowerCOR",
    finish:"500/1500 Siaair", condition:"Medium-Heavy Oil", accent:"#c62828",
    ballSlug:"columbia-300-pulse", coreSlug:"columbia-300-pulse-powercor-core",
    weightData:{16:{rg:2.481,diff:0.039},15:{rg:2.468,diff:0.045},14:{rg:2.481,diff:0.039},13:{rg:2.550,diff:0.034},12:{rg:2.610,diff:0.028}},
    releaseDate:"Aug 2025",
    description:"HK22 Hyperflex Solid on Pulse PowerCOR — ultra-low RG with predictable continuous roll, the classic Pulse reimagined."
  },

  // ── Radical 누락 ──────────────────────────────────────────────
  {
    id:182, brand:"Radical", name:"Intel Recon",
    cover:"Pearl", coreType:"Symmetric", coreName:"Intel Recon",
    finish:"Crown Factory Compound", condition:"Medium Oil", accent:"#d32f2f",
    ballSlug:"radical-intel-recon", coreSlug:"radical-intel-recon-core",
    weightData:{16:{rg:2.483,diff:0.032},15:{rg:2.483,diff:0.032},14:{rg:2.500,diff:0.030},13:{rg:2.570,diff:0.026},12:{rg:2.630,diff:0.022}},
    releaseDate:"Oct 2025",
    description:"HK22 Pearl on Intel Recon core — replicates the beloved original Intel motion with modern chemistry."
  },

  // ── Roto Grip 누락 ────────────────────────────────────────────
  {
    id:183, brand:"Roto Grip", name:"Attention Edge",
    cover:"Solid", coreType:"Asymmetric", coreName:"Attention",
    finish:"500/1000/1500 Siaair", condition:"Heavy Oil", accent:"#b71c1c",
    ballSlug:"roto-grip-attention-edge", coreSlug:"roto-grip-attention-core",
    weightData:{16:{rg:2.470,diff:0.052,moi:0.018},15:{rg:2.470,diff:0.052,moi:0.018},14:{rg:2.500,diff:0.049,moi:0.016},13:{rg:2.570,diff:0.044,moi:0.013},12:{rg:2.630,diff:0.037,moi:0.011}},
    releaseDate:"Aug 2025",
    description:"MXC Solid on Attention asymmetric — heavy oil workhorse with strong midlane read and predictable continuation."
  },
  {
    id:184, brand:"Roto Grip", name:"Hyped Super Pearl II",
    cover:"Pearl", coreType:"Symmetric", coreName:"Hyped",
    finish:"Power Edge", condition:"Medium Oil", accent:"#b71c1c",
    ballSlug:"roto-grip-hyped-super-pearl-ii", coreSlug:"roto-grip-hyped-core",
    weightData:{16:{rg:2.560,diff:0.036},15:{rg:2.560,diff:0.036},14:{rg:2.580,diff:0.034},13:{rg:2.640,diff:0.029},12:{rg:2.700,diff:0.024}},
    releaseDate:"Nov 2025",
    description:"HK22 Pearl on Hyped symmetric — clean through the fronts with angular backend flip, ideal for medium and sport patterns."
  },
  {
    id:185, brand:"Roto Grip", name:"Gremlin",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Gremlin",
    finish:"Power Edge", condition:"Heavy Oil", accent:"#b71c1c",
    ballSlug:"roto-grip-gremlin", coreSlug:"roto-grip-gremlin-core",
    weightData:{16:{rg:2.500,diff:0.058,moi:0.019},15:{rg:2.500,diff:0.058,moi:0.019},14:{rg:2.530,diff:0.055,moi:0.017},13:{rg:2.600,diff:0.049,moi:0.014},12:{rg:2.660,diff:0.042,moi:0.012}},
    releaseDate:"Jul 2025",
    description:"EXO Pearl on Gremlin asymmetric — high differential mischief maker with explosive backend motion on heavier conditions."
  },
  {
    id:186, brand:"Roto Grip", name:"Exit Red",
    cover:"Solid", coreType:"Symmetric", coreName:"Exit",
    finish:"500/1500 Siaair", condition:"Medium-Heavy Oil", accent:"#b71c1c",
    ballSlug:"roto-grip-exit-red", coreSlug:"roto-grip-exit-core",
    weightData:{16:{rg:2.510,diff:0.040},15:{rg:2.510,diff:0.040},14:{rg:2.540,diff:0.038},13:{rg:2.610,diff:0.033},12:{rg:2.670,diff:0.027}},
    releaseDate:"Apr 2025",
    description:"R2S Solid on Exit symmetric — red colorway Exit, strong continuous arc for medium-heavy conditions."
  },
  {
    id:187, brand:"Roto Grip", name:"Hustle Teal/Black",
    cover:"Solid", coreType:"Symmetric", coreName:"Hustle",
    finish:"Crown Factory Compound", condition:"Light-Medium Oil", accent:"#b71c1c",
    ballSlug:"roto-grip-hustle-tealblack", coreSlug:"roto-grip-hustle-core",
    weightData:{16:{rg:2.580,diff:0.028},15:{rg:2.580,diff:0.028},14:{rg:2.600,diff:0.026},13:{rg:2.660,diff:0.022},12:{rg:2.720,diff:0.018}},
    releaseDate:"Feb 2025",
    description:"Reactive Solid on Hustle symmetric — Teal/Black colorway entry-level performer for lighter oil conditions."
  },

  // ══════════════════════════════════════════════════════════════
  // 역대 인기/판매 상위 클래식 볼 추가 (연도 무관 베스트셀러)
  // ══════════════════════════════════════════════════════════════

  // ── Storm 역대 인기 ───────────────────────────────────────────
  {
    id:188, brand:"Storm", name:"Phaze II",
    cover:"Solid", coreType:"Symmetric", coreName:"Velocity",
    finish:"500/2000 Siaair", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-phaze-ii", coreSlug:"storm-velocity-core",
    weightData:{16:{rg:2.480,diff:0.052},15:{rg:2.480,diff:0.052},14:{rg:2.510,diff:0.050},13:{rg:2.580,diff:0.044},12:{rg:2.640,diff:0.037}},
    releaseDate:"Aug 2018",
    description:"R2S Solid on Velocity — 역대 가장 많이 팔린 스톰 볼 중 하나. 강한 미드레인 반응과 연속적인 백엔드, 전 세계 볼링선수들의 베이스볼."
  },
  {
    id:189, brand:"Storm", name:"Phaze III",
    cover:"Pearl", coreType:"Symmetric", coreName:"Velocity",
    finish:"Power Edge Polish", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-phaze-iii", coreSlug:"storm-velocity-core",
    weightData:{16:{rg:2.480,diff:0.052},15:{rg:2.480,diff:0.052},14:{rg:2.510,diff:0.050},13:{rg:2.580,diff:0.044},12:{rg:2.640,diff:0.037}},
    releaseDate:"Jun 2020",
    description:"R2S Pearl on Velocity — Phaze II의 펄 버전. 깔끔한 프론트와 날카로운 백엔드 앵글로 미디엄 오일에서 폭발적인 인기."
  },
  {
    id:190, brand:"Storm", name:"IQ Tour",
    cover:"Solid", coreType:"Symmetric", coreName:"C3 Centripetal",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-iq-tour", coreSlug:"storm-c3-centripetal-core",
    weightData:{16:{rg:2.570,diff:0.034},15:{rg:2.570,diff:0.034},14:{rg:2.590,diff:0.032},13:{rg:2.650,diff:0.027},12:{rg:2.710,diff:0.022}},
    releaseDate:"Jan 2015",
    description:"R2S Solid on C3 Centripetal — 가장 오래 판매된 컨트롤 볼. 투어 선수들의 필수 아이템으로 10년 이상 베스트셀러 유지."
  },
  {
    id:191, brand:"Storm", name:"IQ Tour Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"C3 Centripetal",
    finish:"4000 Abralon Polish", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-iq-tour-pearl", coreSlug:"storm-c3-centripetal-core",
    weightData:{16:{rg:2.570,diff:0.034},15:{rg:2.570,diff:0.034},14:{rg:2.590,diff:0.032},13:{rg:2.650,diff:0.027},12:{rg:2.710,diff:0.022}},
    releaseDate:"Mar 2016",
    description:"R2S Pearl on C3 Centripetal — IQ Tour의 펄 버전. 긴 활주와 예측 가능한 각도로 아마추어~프로까지 폭넓은 사랑."
  },
  {
    id:192, brand:"Storm", name:"Hy-Road",
    cover:"Pearl", coreType:"Symmetric", coreName:"Inverted Fe2",
    finish:"Compound", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-hy-road", coreSlug:"storm-inverted-fe2-core",
    weightData:{16:{rg:2.570,diff:0.046},15:{rg:2.570,diff:0.046},14:{rg:2.590,diff:0.044},13:{rg:2.650,diff:0.038},12:{rg:2.710,diff:0.031}},
    releaseDate:"Jan 2010",
    description:"A1S Pearl on Inverted Fe2 — 스톰 역사상 가장 상징적인 볼. 15년 이상 꾸준히 팔리는 레전드. 볼 입문자의 첫 고성능볼로 전 세계 1위."
  },
  {
    id:193, brand:"Storm", name:"Hy-Road Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"Inverted Fe2",
    finish:"Power Edge Polish", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-hy-road-pearl", coreSlug:"storm-inverted-fe2-core",
    weightData:{16:{rg:2.570,diff:0.046},15:{rg:2.570,diff:0.046},14:{rg:2.590,diff:0.044},13:{rg:2.650,diff:0.038},12:{rg:2.710,diff:0.031}},
    releaseDate:"Jun 2014",
    description:"Pearl cover on Inverted Fe2 — HyRoad 패밀리의 펄 버전. 더 긴 활주와 선명한 앵글. 역대 스톰 판매 Top 5 안에 드는 볼."
  },
  {
    id:194, brand:"Storm", name:"Code Red",
    cover:"Solid", coreType:"Asymmetric", coreName:"RAD-X",
    finish:"500/1000/1500 Siaair", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-code-red", coreSlug:"storm-rad-x-core",
    weightData:{16:{rg:2.480,diff:0.053,moi:0.017},15:{rg:2.480,diff:0.052,moi:0.017},14:{rg:2.510,diff:0.049,moi:0.015},13:{rg:2.580,diff:0.044,moi:0.012},12:{rg:2.640,diff:0.037,moi:0.010}},
    releaseDate:"Sep 2021",
    description:"NeX Solid on RAD-X — Code 시리즈의 역대 최고 판매작. 어시머트릭 고성능 헤비오일 볼로 투어 선수들 압도적 선택."
  },
  {
    id:195, brand:"Storm", name:"Marvel Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"Centripetal HD",
    finish:"Power Edge Polish", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-marvel-pearl", coreSlug:"storm-centripetal-hd-core",
    weightData:{16:{rg:2.460,diff:0.054},15:{rg:2.460,diff:0.054},14:{rg:2.490,diff:0.052},13:{rg:2.560,diff:0.046},12:{rg:2.620,diff:0.039}},
    releaseDate:"Nov 2019",
    description:"EXO Pearl on Centripetal HD — 출시 즉시 연간 판매 1위. 낮은 RG와 강한 DIFF의 조합으로 2019~2020 시즌 투어를 지배한 볼."
  },

  // ── Hammer 역대 인기 ──────────────────────────────────────────
  {
    id:196, brand:"Hammer", name:"Black Widow 2.0",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Gas Mask",
    finish:"500/1000/1500 Siaair", condition:"Medium-Heavy Oil", accent:"#1565c0",
    ballSlug:"hammer-black-widow-20", coreSlug:"hammer-gas-mask-core",
    weightData:{16:{rg:2.480,diff:0.058,moi:0.017},15:{rg:2.481,diff:0.058,moi:0.017},14:{rg:2.500,diff:0.054,moi:0.015},13:{rg:2.570,diff:0.048,moi:0.012},12:{rg:2.630,diff:0.041,moi:0.010}},
    releaseDate:"Sep 2018",
    description:"HK22 Hybrid on Gas Mask — 블랙위도우 시리즈의 역대 판매 1위. 헤비~미디엄헤비 전천후 활약, 전 세계 볼링인의 사랑을 받은 레전드."
  },
  {
    id:197, brand:"Hammer", name:"Purple Pearl Urethane",
    cover:"Urethane", coreType:"Symmetric", coreName:"Offset",
    finish:"Rough Buff", condition:"Light-Medium Oil", accent:"#1565c0",
    ballSlug:"hammer-purple-pearl-urethane", coreSlug:"hammer-offset-core",
    weightData:{16:{rg:2.600,diff:0.020},15:{rg:2.600,diff:0.020},14:{rg:2.620,diff:0.018},13:{rg:2.680,diff:0.015},12:{rg:2.740,diff:0.012}},
    releaseDate:"Jan 2017",
    description:"Urethane cover on Offset — 역대 가장 많이 팔린 우레탄 볼. 드라이~쇼트 패턴의 절대 강자, PBA 투어에서도 꾸준히 사용되는 영원한 베스트셀러."
  },
  {
    id:198, brand:"Hammer", name:"Vibe",
    cover:"Solid", coreType:"Symmetric", coreName:"Vibe",
    finish:"Crown Factory Compound", condition:"Medium Oil", accent:"#1565c0",
    ballSlug:"hammer-vibe", coreSlug:"hammer-vibe-core",
    weightData:{16:{rg:2.540,diff:0.030},15:{rg:2.540,diff:0.030},14:{rg:2.560,diff:0.028},13:{rg:2.620,diff:0.024},12:{rg:2.680,diff:0.019}},
    releaseDate:"Mar 2019",
    description:"Reactive Solid on Vibe symmetric — 엔트리~미드 퍼포먼스 역대 판매 1위. 가성비 최강으로 입문자들이 가장 많이 선택하는 볼."
  },
  {
    id:199, brand:"Hammer", name:"Bubblegum Vibe",
    cover:"Solid", coreType:"Symmetric", coreName:"Vibe",
    finish:"Crown Factory Compound", condition:"Medium Oil", accent:"#1565c0",
    ballSlug:"hammer-bubblegum-vibe", coreSlug:"hammer-vibe-core",
    weightData:{16:{rg:2.540,diff:0.030},15:{rg:2.540,diff:0.030},14:{rg:2.560,diff:0.028},13:{rg:2.620,diff:0.024},12:{rg:2.680,diff:0.019}},
    releaseDate:"Sep 2021",
    description:"Reactive Solid on Vibe — 핑크/블루 버블껌 컬러로 입문자 최고 인기. 친근한 디자인과 탁월한 가성비로 볼링 입문 1위 추천볼."
  },

  // ── Motiv 역대 인기 ───────────────────────────────────────────
  {
    id:200, brand:"Motiv", name:"Venom Shock",
    cover:"Pearl", coreType:"Symmetric", coreName:"Sigma V2",
    finish:"4000 LSS", condition:"Medium Oil", accent:"#7b1fa2",
    ballSlug:"motiv-venom-shock", coreSlug:"motiv-sigma-v2-core",
    weightData:{16:{rg:2.490,diff:0.044},15:{rg:2.490,diff:0.044},14:{rg:2.520,diff:0.042},13:{rg:2.590,diff:0.037},12:{rg:2.650,diff:0.030}},
    releaseDate:"Mar 2020",
    description:"Turmoil MFS Pearl on Sigma V2 — 모티브 역대 최고 판매 볼 중 하나. 강한 미드레인과 연속적인 백엔드로 리그~투어까지 압도적 사랑."
  },
  {
    id:201, brand:"Motiv", name:"Venom EXJ",
    cover:"Solid", coreType:"Symmetric", coreName:"Gear",
    finish:"2000 Siaair", condition:"Medium-Heavy Oil", accent:"#7b1fa2",
    ballSlug:"motiv-venom-exj", coreSlug:"motiv-gear-core",
    weightData:{16:{rg:2.480,diff:0.038},15:{rg:2.480,diff:0.038},14:{rg:2.510,diff:0.036},13:{rg:2.580,diff:0.031},12:{rg:2.640,diff:0.025}},
    releaseDate:"Jun 2024",
    description:"Coercion HFS Solid on Gear — EJ Tackett 시그니처. 낮은 RG 벤치마크 볼로 2024 베스트셀러. 안정적이고 예측 가능한 미드레인 반응."
  },
  {
    id:202, brand:"Motiv", name:"Forge Fire",
    cover:"Solid", coreType:"Symmetric", coreName:"Impulse V2",
    finish:"3000 Grit LSS", condition:"Medium-Heavy Oil", accent:"#7b1fa2",
    ballSlug:"motiv-forge-fire", coreSlug:"motiv-impulse-v2-core",
    weightData:{16:{rg:2.530,diff:0.051},15:{rg:2.540,diff:0.050},14:{rg:2.550,diff:0.049},13:{rg:2.600,diff:0.041},12:{rg:2.650,diff:0.035}},
    releaseDate:"Sep 2022",
    description:"Coercion MXC Solid on Impulse V2 — 역대 모티브 스트레이트 셀러. 강한 미드레인 반응과 내구성으로 리그볼러들의 절대적 신뢰."
  },
  {
    id:203, brand:"Motiv", name:"Trident Odyssey",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Trident",
    finish:"4000 LSS", condition:"Medium-Heavy Oil", accent:"#7b1fa2",
    ballSlug:"motiv-trident-odyssey", coreSlug:"motiv-trident-core",
    weightData:{16:{rg:2.480,diff:0.053,moi:0.018},15:{rg:2.490,diff:0.052,moi:0.018},14:{rg:2.510,diff:0.049,moi:0.016},13:{rg:2.580,diff:0.044,moi:0.013},12:{rg:2.640,diff:0.037,moi:0.011}},
    releaseDate:"Jan 2022",
    description:"Propulsion MXV Pearl on Trident — 역대 모티브 어시머트릭 판매 1위. Jackal과 함께 모티브의 양대 산맥, 긴 활주와 폭발적 각도."
  },

  // ── Brunswick 역대 인기 ───────────────────────────────────────
  {
    id:204, brand:"Brunswick", name:"Kingpin Max",
    cover:"Solid", coreType:"Asymmetric", coreName:"ECA-XR",
    finish:"500/1000/1500 Siaair", condition:"Heavy Oil", accent:"#e65100",
    ballSlug:"brunswick-kingpin-max", coreSlug:"brunswick-eca-xr-core",
    weightData:{16:{rg:2.470,diff:0.054,moi:0.018},15:{rg:2.470,diff:0.053,moi:0.018},14:{rg:2.500,diff:0.050,moi:0.016},13:{rg:2.570,diff:0.045,moi:0.013},12:{rg:2.630,diff:0.038,moi:0.011}},
    releaseDate:"Mar 2022",
    description:"ECA-XR Solid on ECA-XR — 브런즈윅 헤비오일 역대 판매 1위. 강한 훅과 놀라운 핀 액션으로 2022~2023 투어 지배."
  },
  {
    id:205, brand:"Brunswick", name:"Rhino",
    cover:"Solid", coreType:"Symmetric", coreName:"Rhino",
    finish:"Crown Factory Compound", condition:"Medium Oil", accent:"#e65100",
    ballSlug:"brunswick-rhino", coreSlug:"brunswick-rhino-core",
    weightData:{16:{rg:2.540,diff:0.030},15:{rg:2.540,diff:0.030},14:{rg:2.560,diff:0.028},13:{rg:2.620,diff:0.024},12:{rg:2.680,diff:0.019}},
    releaseDate:"Jan 2016",
    description:"Reactive Solid on Rhino symmetric — 브런즈윅 역대 최고 판매 입문볼. 수십 년간 꾸준히 팔리는 브런즈윅의 아이콘."
  },

  // ── Roto Grip 역대 인기 ───────────────────────────────────────
  {
    id:206, brand:"Roto Grip", name:"Hype-E",
    cover:"Pearl", coreType:"Symmetric", coreName:"Nucleus",
    finish:"Power Edge Polish", condition:"Medium Oil", accent:"#b71c1c",
    ballSlug:"roto-grip-hype-e", coreSlug:"roto-grip-nucleus-core",
    weightData:{16:{rg:2.550,diff:0.038},15:{rg:2.550,diff:0.038},14:{rg:2.570,diff:0.036},13:{rg:2.630,diff:0.031},12:{rg:2.690,diff:0.025}},
    releaseDate:"Apr 2022",
    description:"EXO Pearl on Nucleus — 로토그립 역대 미드퍼포먼스 최고 판매작. 깔끔한 활주와 예측 가능한 백엔드로 2022~2023 리그 1위."
  },
  {
    id:207, brand:"Roto Grip", name:"UFO Alert",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Nucleus V2",
    finish:"Power Edge Polish", condition:"Medium-Heavy Oil", accent:"#b71c1c",
    ballSlug:"roto-grip-ufo-alert", coreSlug:"roto-grip-nucleus-v2-core",
    weightData:{16:{rg:2.490,diff:0.052,moi:0.018},15:{rg:2.490,diff:0.052,moi:0.018},14:{rg:2.520,diff:0.049,moi:0.016},13:{rg:2.590,diff:0.044,moi:0.013},12:{rg:2.650,diff:0.037,moi:0.011}},
    releaseDate:"Aug 2021",
    description:"MXC Pearl on Nucleus V2 — 출시 즉시 로토그립 연간 판매 1위. 강렬한 UFO 패턴과 날카로운 백엔드로 2021~2022 최고 인기."
  },

  // ── DV8 역대 인기 ─────────────────────────────────────────────
  {
    id:208, brand:"DV8", name:"Pitbull Bite",
    cover:"Solid", coreType:"Asymmetric", coreName:"Pitbull",
    finish:"500/1000/1500 Siaair", condition:"Heavy Oil", accent:"#bf360c",
    ballSlug:"dv8-pitbull-bite", coreSlug:"dv8-pitbull-core",
    weightData:{16:{rg:2.480,diff:0.054,moi:0.018},15:{rg:2.480,diff:0.053,moi:0.018},14:{rg:2.510,diff:0.050,moi:0.016},13:{rg:2.580,diff:0.045,moi:0.013},12:{rg:2.640,diff:0.038,moi:0.011}},
    releaseDate:"May 2021",
    description:"HK22 Solid on Pitbull asymmetric — DV8 역대 판매 1위. 강력한 훅과 폭발적인 핀 액션으로 헤비오일 조건에서 절대 강자."
  },
  {
    id:209, brand:"DV8", name:"Thug",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Thug",
    finish:"500/1000/1500 Siaair", condition:"Heavy Oil", accent:"#bf360c",
    ballSlug:"dv8-thug", coreSlug:"dv8-thug-core",
    weightData:{16:{rg:2.480,diff:0.055,moi:0.019},15:{rg:2.481,diff:0.054,moi:0.019},14:{rg:2.510,diff:0.051,moi:0.017},13:{rg:2.580,diff:0.046,moi:0.014},12:{rg:2.640,diff:0.039,moi:0.012}},
    releaseDate:"Jan 2019",
    description:"Composite Hybrid on Thug asymmetric — DV8의 레전드 볼. 미드레인 강한 반응과 연속적인 백엔드 파워로 2019~2021 투어 인기."
  },
];

const COND_COLOR = {
  "Heavy Oil":"#ef5350","Medium-Heavy Oil":"#fb8c00",
  "Medium Oil":"#fdd835","Light-Medium Oil":"#66bb6a","Light Oil":"#42a5f5",
};

const BRANDS = ["전체","Storm","Roto Grip","Motiv","Hammer","Brunswick","900 Global","SWAG","DV8","Columbia 300","Ebonite","Radical","Track"];

const POPULARITY = {
  // Hammer — 판매 1위 브랜드
  "Black Widow Mania":99,      // 2025 연간 #1 판매
  "Black Widow 3.0":97,        // 2024 연간 #1 판매
  "Black Widow 3.0 Dynasty":95,// 2026 출시 즉시 top5
  "Black Widow Tour V1":90,    // 2025 투어 인기
  "Maximum Effect":85,
  "Effect Tour":83,
  "Special Effect":78,
  "Hammerhead":75,
  "Hammerhead Pearl":73,
  "Zero Mercy Solid":70,
  "Zero Mercy Pearl":68,
  "Anger":65,
  "NU 2.0":60,
  "NU Blue Hammer":55,
  "Black Widow 2.0 Hybrid":50,
  // Storm
  "Phaze II Pearl":96,         // 2024 연간 top3
  "Ion Max Pearl":94,          // 2025 출시 즉시 #1
  "Ion Max":90,
  "Equinox Solid":89,
  "EquinoX":87,
  "Bionic":88,
  "Code Honor":85,
  "PhysiX Grandeur":84,
  "Absolute Reign":82,
  "Marvel Scale":80,
  "Concept":79,
  "Lock-On":77,
  "PhysiX Raze":76,
  "Virtual Gravity Destino":75,
  "Star Road":74,
  "Summit Tune":72,
  "Marvel Maxx Silver":71,
  "Prime Gate":70,
  "Marvel Pearl A.I.":69,
  "PhysiX Era":68,
  "Blaze DNA":65,
  "Typhoon":60,
  "Ion Pro Solid":58,
  "Ion Pro":55,
  "Summit Ascent":54,
  "Summit Peak":52,
  "The Road X":50,
  "Motor Rev":48,
  "PhysiX Solid":46,
  "!Q Tour A.I.":44,
  // Motiv
  "Jackal Onyx":92,            // 2025 #3 전체 판매
  "Evoke Hysteria":88,         // 2025 투어 인기 급상승
  "Evoke Mayhem":86,
  "Evoke":80,
  "Steel Forge":78,
  "Primal Rage Evolution":75,
  "Jackal ExJ":72,
  "Nuclear Forge":70,
  "Pride Empire":68,
  "Shadow Tank":65,
  "Apex Jackal":62,
  "Subzero Forge":60,
  "Max Thrill Pearl":58,
  "Hyper Venom":55,
  "Lethal Venom":52,
  "Raptor Reign":50,
  "Nebula":48,
  "Blue Tank":45,
  "Supra Sport":40,
  "Primal Ghost":38,
  // Roto Grip
  "Gremlin Tour-X":87,
  "Transformer":85,
  "Attention Sign":82,
  "Attention Edge":80,
  "RST Hyperdrive Pearl":78,
  "Rockstar Amped":75,
  "Optimum Idol Solid":72,
  "Optimum Idol":70,
  "Vintage Gem":68,
  "Gem Blue Sapphire":65,
  "Gremlin":63,
  "Hyped Super Pearl II":60,
  "Exit Red":55,
  "Hustle ETF":50,
  "Hustle BP":48,
  "Hustle Teal/Black":42,
  "Magic Gem":40,
  "Attention Star S2":38,
  "Attention Star":35,
  "Rockstar":32,
  "Hustle BRY":30,
  // 900 Global
  "Dark Matter":85,
  "Zen 25":80,
  "Zen 25 Pearl":78,
  "Ember":75,
  "Mach Cruise":73,
  "Origin EX":70,
  "Reality Incursion":68,
  "Remaster Honey Badger":65,
  "Honey Badger Black Edition":63,
  "Rev Matrix":60,
  "Cove":58,
  "Duty Majesty":55,
  "Phantom Cruise":52,
  "Cruise Sapphire":50,
  "Origin":48,
  "Viking":46,
  "Wolverine Night":44,
  "Honey Badger Blameless":42,
  "Eternity Pi":40,
  "Vengeance":38,
  // Brunswick
  "Combat Hybrid":82,
  "Crown Victory Pearl":78,
  "Combat":72,
  "Crown 78U":65,
  "Alert":55,
  "Energize":50,
  "Danger Zone":45,
  "Danger Zone Purple Ice":42,
  "Melee Jab Void Black":38,
  "Vapor Zone Red":35,
  // Columbia 300
  "Street Rally":80,
  "Piranha Solid":75,
  "Atlas Hybrid":65,
  "Atlas":60,
  "Ricochet Return":55,
  "Super Cuda PowerCOR Pearl":52,
  "Ricochet Pearl":50,
  "Pulse":48,
  // Radical
  "Deep Impact":78,
  "Outer Limits Black Hole":72,
  "Intel Recon":65,
  "Ridiculous Pearl":58,
  "Xtra Bonus":50,
  "Zig Zag Solid":42,
  "ZigZag":38,
  // Track
  "Stealth Mode Hybrid":75,
  "Synthesis":68,
  "Theorem Pearl":62,
  "Theorem":58,
  "I-Core Gen4":55,
  "Rhyno":45,
  // DV8
  "Dark Side Curse":78,
  "Heckler Hybrid":72,
  "Heckler":65,
  "Mantra Solid":60,
  "Hater":55,
  "Intimidator":48,
  // Ebonite
  "Spartan":72,
  "Emerge Hybrid":65,
  "Emerge":60,
  "The One Ovation":55,
  "Real Time":50,
  "Envision":45,
  "Choice Solid":40,
  // SWAG
  "Craze Tour Pearl":80,
  "Craze Tour Solid":75,
  "Judgement Hybrid":70,
  "Unreal Solid":65,
  "Fusion Hybrid":60,
  "Serpent Hybrid":55,
  "Assassin Pearl":50,
  "APEX Solid":48,
  "Unreal":42,
  // 역대 클래식 베스트셀러
  "Hy-Road":98,
  "Hy-Road Pearl":93,
  "Phaze II":96,
  "Phaze III":88,
  "IQ Tour":91,
  "IQ Tour Pearl":87,
  "Code Red":86,
  "Marvel Pearl":95,
  "Black Widow 2.0":94,
  "Purple Pearl Urethane":92,
  "Vibe":89,
  "Bubblegum Vibe":83,
  "Venom Shock":88,
  "Venom EXJ":82,
  "Forge Fire":80,
  "Trident Odyssey":85,
  "Kingpin Max":84,
  "Rhino":79,
  "Hype-E":81,
  "UFO Alert":86,
  "Pitbull Bite":82,
  "Thug":77,
};

const COND_COLOR = {
  "Heavy Oil":"#ef5350","Medium-Heavy Oil":"#fb8c00",
  "Medium Oil":"#fdd835","Light-Medium Oil":"#66bb6a","Light Oil":"#42a5f5",
};

const BRAND_ICON = {
  "Storm":"⚡","Brunswick":"🟠","Roto Grip":"🔴","Track":"🔵","Motiv":"🟣",
  "Radical":"🔶","Hammer":"🔨","900 Global":"9️⃣","DV8":"🔥","Ebonite":"💎",
  "Columbia 300":"🌊","SWAG":"🌀",
};

// 브랜드 로고 설정 (약자 + 고유 색상)
const BRAND_LOGO = {
  "Storm":      {abbr:"STM", color:"#e53935", bg:"#fff0f0", textColor:"#e53935"},
  "Roto Grip":  {abbr:"RG",  color:"#1e88e5", bg:"#e3f2fd", textColor:"#1e88e5"},
  "Motiv":      {abbr:"MTV", color:"#6d1f7e", bg:"#f3e5f5", textColor:"#6d1f7e"},
  "Hammer":     {abbr:"HMR", color:"#d32f2f", bg:"#ffebee", textColor:"#c62828"},
  "Brunswick":  {abbr:"BRN", color:"#e65100", bg:"#fff3e0", textColor:"#e65100"},
  "900 Global": {abbr:"900", color:"#1565c0", bg:"#e8eaf6", textColor:"#1565c0"},
  "DV8":        {abbr:"DV8", color:"#212121", bg:"#f5f5f5", textColor:"#212121"},
  "Ebonite":    {abbr:"EBN", color:"#4a148c", bg:"#ede7f6", textColor:"#4a148c"},
  "Columbia 300":{abbr:"C3", color:"#0277bd", bg:"#e1f5fe", textColor:"#0277bd"},
  "SWAG":       {abbr:"SWG", color:"#558b2f", bg:"#f1f8e9", textColor:"#558b2f"},
  "Radical":    {abbr:"RAD", color:"#ef6c00", bg:"#fff8e1", textColor:"#e65100"},
  "Track":      {abbr:"TRK", color:"#00695c", bg:"#e0f2f1", textColor:"#00695c"},
};

// ── 이미지 컴포넌트 ──
function BallImg({ slug, name, size=64 }) {
  const [err, setErr] = useState(false);
  if (err || !slug) return (
    <div style={{width:size,height:size,borderRadius:"50%",background:"rgba(255,255,255,0.08)",
      display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.3}}>🎳</div>
  );
  return <img src={BOWWWL_BALL(slug)} alt={name} onError={()=>setErr(true)}
    style={{width:size,height:size,borderRadius:"50%",objectFit:"cover"}}/>;
}

function LoginPopup({ onLogin, onClose }) {
  const [mode, setMode] = useState("login"); // login | register | find
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  // 아이디/비번 찾기
  const [findNick, setFindNick] = useState("");
  const [findName, setFindName] = useState("");
  const [findBirth, setFindBirth] = useState({y:"",m:"",d:""});
  const [findResult, setFindResult] = useState(null); // null | {pw, nickname} | "fail"

  const inputStyle = {
    width:"100%", background:"#f7f7fc", border:"1.5px solid #e2e2e0", borderRadius:10,
    color:"#333", padding:"10px 13px", fontSize:14, outline:"none",
    fontFamily:"inherit", boxSizing:"border-box", marginBottom:8,
  };

  useEffect(()=>{
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    return ()=>{
      document.body.style.overflow = prev;
      document.body.style.position = "";
      document.body.style.width = "";
    };
  },[]);

  const handleLogin = async () => {
    if(!name.trim()||!pw){setErr("닉네임과 비밀번호를 입력해주세요");return;}
    setLoading(true);setErr("");
    try{
      const users=await sbGet("users",`nickname=eq.${encodeURIComponent(name.trim())}&select=*`);
      if(!users.length){setErr("존재하지 않는 닉네임이에요");setLoading(false);return;}
      if(users[0].password!==pw){setErr("비밀번호가 틀렸어요");setLoading(false);return;}
      const isAdmin=users[0].is_admin===true;
      localStorage.setItem("rm_nickname",name.trim());
      localStorage.setItem("rm_pw",pw);
      localStorage.setItem("rm_admin",isAdmin?"1":"0");
      const [data,noticeData]=await Promise.all([
        sbGet("equipment",`nickname=eq.${encodeURIComponent(name.trim())}&order=created_at.asc`),
        sbGet("notices","is_active=eq.true&order=created_at.desc"),
      ]);
      onLogin(name.trim(),data,isAdmin,noticeData);
    }catch(e){setErr("연결 오류. 잠시 후 다시 시도해주세요.");}
    setLoading(false);
  };

  const handleRegister = async () => {
    if(!name.trim()||name.trim().length<2){setErr("닉네임을 2글자 이상 입력해주세요");return;}
    if(!pw||pw.length<4){setErr("비밀번호를 4자리 이상 입력해주세요");return;}
    if(pw!==pw2){setErr("비밀번호가 일치하지 않아요");return;}
    setLoading(true);setErr("");
    try{
      const existing=await sbGet("users",`nickname=eq.${encodeURIComponent(name.trim())}&select=id`);
      if(existing.length){setErr("이미 사용 중인 닉네임이에요");setLoading(false);return;}
      await sbInsert("users",{nickname:name.trim(),password:pw,is_admin:false});
      localStorage.setItem("rm_nickname",name.trim());
      localStorage.setItem("rm_pw",pw);
      localStorage.setItem("rm_admin","0");
      onLogin(name.trim(),[],false,[]);
    }catch(e){setErr("연결 오류. 잠시 후 다시 시도해주세요.");}
    setLoading(false);
  };

  const handleFind = async () => {
    if(!findNick.trim()||!findName.trim()||!findBirth.y||!findBirth.m||!findBirth.d){
      setErr("모든 항목을 입력해주세요"); return;
    }
    setLoading(true); setErr(""); setFindResult(null);
    try{
      const users = await sbGet("users", `nickname=eq.${encodeURIComponent(findNick.trim())}&select=*`);
      if(!users.length){ setFindResult("fail"); setLoading(false); return; }
      const u = users[0];
      const birthStr = `${findBirth.y}-${String(findBirth.m).padStart(2,"0")}-${String(findBirth.d).padStart(2,"0")}`;
      if(u.real_name===findName.trim() && u.birth_date===birthStr){
        setFindResult({nickname: u.nickname, pw: u.password});
      } else {
        setFindResult("fail");
      }
    }catch(e){ setErr("연결 오류. 잠시 후 다시 시도해주세요."); }
    setLoading(false);
  };

  const tabs = [
    {k:"login", l:"로그인"},
    {k:"register", l:"회원가입"},
    {k:"find", l:"계정 찾기"},
  ];

  return (
    <div onClick={onClose}
      style={{position:"fixed",inset:0,zIndex:4000,
        background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)",
        display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:"#fff",borderRadius:"24px 24px 0 0",
        padding:"20px 20px 36px",width:"100%",maxWidth:480,
        boxShadow:"0 -8px 40px rgba(0,0,0,0.2)",
        animation:"slideUp .3s cubic-bezier(.34,1.1,.64,1)"}}>
        <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
        <div style={{width:40,height:4,background:"#e2e2e0",borderRadius:2,margin:"0 auto 16px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontSize:17,fontWeight:900,color:"#111",fontFamily:"'Exo 2',sans-serif"}}>ROLLMATE</div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,color:"#ccc",cursor:"pointer"}}>✕</button>
        </div>
        {/* 탭 */}
        <div style={{display:"flex",background:"#f5f5f7",borderRadius:12,padding:3,marginBottom:16,gap:2}}>
          {tabs.map(t=>(
            <button key={t.k} onClick={()=>{setMode(t.k);setErr("");setFindResult(null);}}
              style={{flex:1,padding:"8px 4px",borderRadius:9,border:"none",
                fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer",
                background:mode===t.k?"#fff":"transparent",
                color:mode===t.k?"#111":"#999",
                boxShadow:mode===t.k?"0 1px 4px rgba(0,0,0,0.1)":"none",
                transition:"all .15s"}}>{t.l}</button>
          ))}
        </div>

        {/* 로그인 */}
        {mode==="login"&&(<>
          <input value={name} onChange={e=>{setName(e.target.value);setErr("");}}
            onKeyDown={e=>e.key==="Enter"&&handleLogin()}
            placeholder="닉네임" maxLength={20} style={inputStyle} autoFocus/>
          <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}}
            onKeyDown={e=>e.key==="Enter"&&handleLogin()}
            placeholder="비밀번호" maxLength={30} style={inputStyle}/>
          {err&&<div style={{fontSize:12,color:"#ef5350",fontWeight:600,marginBottom:8}}>{err}</div>}
          <button onClick={handleLogin} disabled={loading}
            style={{width:"100%",padding:"14px",background:loading?"#aaa":"#ff8c00",
              border:"none",borderRadius:12,color:"#fff",fontFamily:"inherit",
              fontSize:15,fontWeight:800,cursor:loading?"not-allowed":"pointer",
              boxShadow:"0 4px 16px rgba(255,140,0,0.35)",marginTop:4}}>
            {loading?"확인 중...":"로그인 →"}
          </button>
          <button onClick={()=>{setMode("find");setErr("");}} style={{
            width:"100%",padding:"10px",background:"none",border:"none",
            color:"#aaa",fontFamily:"inherit",fontSize:12,cursor:"pointer",marginTop:6}}>
            아이디 / 비밀번호를 잊으셨나요?
          </button>
        </>)}

        {/* 회원가입 */}
        {mode==="register"&&(<>
          <input value={name} onChange={e=>{setName(e.target.value);setErr("");}}
            placeholder="닉네임 (2글자 이상)" maxLength={20} style={inputStyle} autoFocus/>
          <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}}
            placeholder="비밀번호 (4자리 이상)" maxLength={30} style={inputStyle}/>
          <input type="password" value={pw2} onChange={e=>{setPw2(e.target.value);setErr("");}}
            onKeyDown={e=>e.key==="Enter"&&handleRegister()}
            placeholder="비밀번호 확인" maxLength={30} style={inputStyle}/>
          {err&&<div style={{fontSize:12,color:"#ef5350",fontWeight:600,marginBottom:8}}>{err}</div>}
          <button onClick={handleRegister} disabled={loading}
            style={{width:"100%",padding:"14px",background:loading?"#aaa":"#ff8c00",
              border:"none",borderRadius:12,color:"#fff",fontFamily:"inherit",
              fontSize:15,fontWeight:800,cursor:loading?"not-allowed":"pointer",
              boxShadow:"0 4px 16px rgba(255,140,0,0.35)",marginTop:4}}>
            {loading?"가입 중...":"가입하기 →"}
          </button>
          <div style={{fontSize:11,color:"#aaa",textAlign:"center",marginTop:10}}>
            추가 정보(실명·생년월일)는 설정에서 입력 가능해요
          </div>
        </>)}

        {/* 계정 찾기 */}
        {mode==="find"&&(<>
          {!findResult&&(<>
            <div style={{fontSize:12,color:"#888",marginBottom:12,lineHeight:1.6,
              background:"#f7f7fc",borderRadius:10,padding:"10px 12px"}}>
              💡 가입 시 입력한 <b>닉네임 · 성명 · 생년월일</b>이 모두 일치하면 비밀번호를 확인할 수 있어요.
            </div>
            <input value={findNick} onChange={e=>{setFindNick(e.target.value);setErr("");}}
              placeholder="닉네임" maxLength={20} style={inputStyle} autoFocus/>
            <input value={findName} onChange={e=>{setFindName(e.target.value);setErr("");}}
              placeholder="성명 (실명)" maxLength={20} style={inputStyle}/>
            {/* 생년월일 드롭다운 */}
            <div style={{display:"flex",gap:6,marginBottom:8}}>
              <select value={findBirth.y} onChange={e=>setFindBirth(b=>({...b,y:e.target.value}))}
                style={{flex:2,...inputStyle,marginBottom:0,color:findBirth.y?"#333":"#aaa"}}>
                <option value="" disabled>연도</option>
                {Array.from({length:70},(_,i)=>new Date().getFullYear()-i).map(y=>(
                  <option key={y} value={y}>{y}년</option>
                ))}
              </select>
              <select value={findBirth.m} onChange={e=>setFindBirth(b=>({...b,m:e.target.value}))}
                style={{flex:1,...inputStyle,marginBottom:0,color:findBirth.m?"#333":"#aaa"}}>
                <option value="" disabled>월</option>
                {Array.from({length:12},(_,i)=>i+1).map(m=>(
                  <option key={m} value={m}>{m}월</option>
                ))}
              </select>
              <select value={findBirth.d} onChange={e=>setFindBirth(b=>({...b,d:e.target.value}))}
                style={{flex:1,...inputStyle,marginBottom:0,color:findBirth.d?"#333":"#aaa"}}>
                <option value="" disabled>일</option>
                {Array.from({length:31},(_,i)=>i+1).map(d=>(
                  <option key={d} value={d}>{d}일</option>
                ))}
              </select>
            </div>
            {err&&<div style={{fontSize:12,color:"#ef5350",fontWeight:600,marginBottom:8}}>{err}</div>}
            <button onClick={handleFind} disabled={loading}
              style={{width:"100%",padding:"14px",background:loading?"#aaa":"#1c1c1e",
                border:"none",borderRadius:12,color:"#fff",fontFamily:"inherit",
                fontSize:15,fontWeight:800,cursor:loading?"not-allowed":"pointer",marginTop:4}}>
              {loading?"확인 중...":"계정 찾기 →"}
            </button>
          </>)}

          {/* 결과 */}
          {findResult==="fail"&&(
            <div style={{textAlign:"center",padding:"20px 0"}}>
              <div style={{fontSize:32,marginBottom:10}}>😕</div>
              <div style={{fontWeight:700,fontSize:15,color:"#111",marginBottom:6}}>일치하는 계정을 찾지 못했어요</div>
              <div style={{fontSize:13,color:"#aaa",marginBottom:20,lineHeight:1.6}}>입력한 정보를 다시 확인해주세요</div>
              <button onClick={()=>setFindResult(null)} style={{padding:"10px 24px",
                background:"#f5f5f7",border:"none",borderRadius:10,fontFamily:"inherit",
                fontSize:13,fontWeight:700,cursor:"pointer",color:"#555"}}>다시 시도</button>
            </div>
          )}
          {findResult&&findResult!=="fail"&&(
            <div style={{textAlign:"center",padding:"16px 0"}}>
              <div style={{fontSize:32,marginBottom:10}}>🎉</div>
              <div style={{fontWeight:700,fontSize:15,color:"#111",marginBottom:16}}>계정을 찾았어요!</div>
              <div style={{background:"#f7f7fc",borderRadius:14,padding:"16px",marginBottom:16,textAlign:"left"}}>
                <div style={{fontSize:11,color:"#aaa",fontWeight:700,marginBottom:4}}>닉네임</div>
                <div style={{fontSize:16,fontWeight:800,color:"#111",marginBottom:12}}>{findResult.nickname}</div>
                <div style={{fontSize:11,color:"#aaa",fontWeight:700,marginBottom:4}}>비밀번호</div>
                <div style={{fontSize:20,fontWeight:900,color:"#ff8c00",letterSpacing:2}}>{findResult.pw}</div>
              </div>
              <button onClick={()=>{setMode("login");setName(findResult.nickname);setFindResult(null);setErr("");}}
                style={{width:"100%",padding:"13px",background:"#ff8c00",border:"none",
                  borderRadius:12,color:"#fff",fontFamily:"inherit",fontSize:14,fontWeight:800,
                  cursor:"pointer",boxShadow:"0 4px 14px rgba(255,140,0,0.35)"}}>
                로그인하러 가기 →
              </button>
            </div>
          )}
        </>)}
      </div>
    </div>
  );
}

// ── 볼 상세 모달 ──
function BallModal({ ball, onClose, inArsenal, onReg }) {
  const [selW, setSelW] = useState(15);
  const d = ball.weightData?.[selW] || ball.weightData?.[16] || ball.weightData?.[15];
  const oilColor = COND_COLOR[ball.condition] || "#aaa";
  
  useEffect(()=>{
    document.body.style.overflow = "hidden";
    return ()=>{ document.body.style.overflow = ""; };
  },[]);

  return (
    <div onClick={onClose} style={{
      position:"fixed",inset:0,zIndex:5000,
      background:"rgba(0,0,0,0.75)",backdropFilter:"blur(20px)",
      display:"flex",alignItems:"flex-end",justifyContent:"center"
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:"100%",maxWidth:480,
        background:"rgba(18,18,24,0.97)",
        borderRadius:"28px 28px 0 0",
        border:"1px solid rgba(255,255,255,0.08)",
        borderBottom:"none",
        boxShadow:"0 -20px 60px rgba(0,0,0,0.5)",
        animation:"slideUp .35s cubic-bezier(.34,1.1,.64,1)",
        maxHeight:"90vh",overflowY:"auto"
      }}>
        <style>{`
          @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
          @keyframes fadeIn{from{opacity:0}to{opacity:1}}
          .rev0-scrollbar::-webkit-scrollbar{width:3px}
          .rev0-scrollbar::-webkit-scrollbar-track{background:transparent}
          .rev0-scrollbar::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:3px}
        `}</style>
        
        {/* 핸들 */}
        <div style={{width:36,height:4,background:"rgba(255,255,255,0.2)",borderRadius:2,margin:"12px auto 0"}}/>
        
        {/* 헤더 */}
        <div style={{padding:"16px 20px 0",display:"flex",gap:16,alignItems:"center"}}>
          <div style={{
            width:80,height:80,borderRadius:20,overflow:"hidden",flexShrink:0,
            boxShadow:`0 8px 30px ${ball.accent}55`,
            border:`1px solid ${ball.accent}33`
          }}>
            <BallImg slug={ball.ballSlug} name={ball.name} size={80}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",fontWeight:700,letterSpacing:2,marginBottom:3}}>
              {ball.brand.toUpperCase()}
            </div>
            <div style={{fontSize:20,fontWeight:800,color:"#fff",lineHeight:1.2,marginBottom:6}}>
              {ball.name}
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              <span style={{fontSize:10,padding:"3px 8px",borderRadius:20,fontWeight:700,
                background:`${oilColor}22`,color:oilColor,border:`1px solid ${oilColor}44`}}>
                {ball.condition?.replace(" Oil","")}
              </span>
              <span style={{fontSize:10,padding:"3px 8px",borderRadius:20,fontWeight:700,
                background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.5)"}}>
                {ball.cover}
              </span>
              <span style={{fontSize:10,padding:"3px 8px",borderRadius:20,fontWeight:700,
                background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.5)"}}>
                {ball.coreType}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{
            width:32,height:32,borderRadius:"50%",border:"none",
            background:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.5)",
            fontSize:16,cursor:"pointer",flexShrink:0,display:"flex",
            alignItems:"center",justifyContent:"center"
          }}>✕</button>
        </div>

        {/* 무게 선택 */}
        <div style={{padding:"16px 20px 0"}}>
          <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",fontWeight:700,letterSpacing:1.5,marginBottom:8}}>WEIGHT</div>
          <div style={{display:"flex",gap:5}}>
            {[16,15,14,13].map(w=>(
              <button key={w} onClick={()=>setSelW(w)} style={{
                flex:1,padding:"8px 4px",borderRadius:10,border:"none",
                fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer",
                background:selW===w?ball.accent:"rgba(255,255,255,0.06)",
                color:selW===w?"#fff":"rgba(255,255,255,0.4)",
                transition:"all .15s"
              }}>{w}lb</button>
            ))}
          </div>
        </div>

        {/* 수치 */}
        {d && (
          <div style={{padding:"16px 20px 0"}}>
            <div style={{
              display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8
            }}>
              {[
                {l:"RG",v:d.rg},
                {l:"DIFF",v:d.diff},
                ...(d.moi?[{l:"MOI",v:d.moi}]:[])
              ].map(x=>(
                <div key={x.l} style={{
                  background:"rgba(255,255,255,0.04)",borderRadius:14,
                  padding:"12px",textAlign:"center",
                  border:"1px solid rgba(255,255,255,0.06)"
                }}>
                  <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",fontWeight:700,letterSpacing:1.5,marginBottom:4}}>{x.l}</div>
                  <div style={{fontSize:22,fontWeight:900,color:ball.accent,fontFamily:"'Exo 2',sans-serif"}}>{x.v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 설명 */}
        {ball.description && (
          <div style={{padding:"16px 20px 0"}}>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",lineHeight:1.7,margin:0}}>{ball.description}</p>
          </div>
        )}

        {/* CTA */}
        <div style={{padding:"16px 20px 20px"}}>
          <button onClick={()=>onReg(ball)} style={{
            width:"100%",padding:"14px",borderRadius:16,border:"none",
            background:inArsenal?`${ball.accent}33`:`linear-gradient(135deg,${ball.accent},${ball.accent}cc)`,
            color:inArsenal?ball.accent:"#fff",
            fontFamily:"inherit",fontSize:14,fontWeight:800,cursor:"pointer",
            boxShadow:inArsenal?"none":`0 6px 24px ${ball.accent}44`,
            transition:"all .2s",
            border:inArsenal?`1px solid ${ball.accent}55`:"none"
          }}>
            {inArsenal?"✓ 내 장비함에 등록됨":"+ 내 장비함에 추가"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 검색/필터 풀스크린 패널 ──
function SearchPanel({ onClose, onSelect, onBrandSelect, selectedBrand }) {
  const [q, setQ] = useState("");
  const [cond, setCond] = useState("All");
  const inputRef = useRef();
  
  useEffect(()=>{
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return ()=>{ document.body.style.overflow = ""; };
  },[]);

  const filtered = ALL_BALLS.filter(b=>{
    const mQ = !q || b.name.toLowerCase().includes(q.toLowerCase()) || b.brand.toLowerCase().includes(q.toLowerCase());
    const mB = selectedBrand==="전체" || b.brand===selectedBrand;
    const mC = cond==="All" || b.condition===cond;
    return mQ && mB && mC;
  }).slice(0,50);

  return (
    <div style={{
      position:"fixed",inset:0,zIndex:4500,
      background:"rgba(8,8,12,0.98)",backdropFilter:"blur(30px)",
      display:"flex",flexDirection:"column",
      animation:"fadeIn .2s ease"
    }}>
      {/* 헤더 */}
      <div style={{padding:"16px 20px 12px",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
        <div style={{
          flex:1,display:"flex",alignItems:"center",gap:10,
          background:"rgba(255,255,255,0.07)",borderRadius:14,
          padding:"10px 14px",border:"1px solid rgba(255,255,255,0.1)"
        }}>
          <span style={{color:"rgba(255,255,255,0.3)",fontSize:14}}>🔍</span>
          <input ref={inputRef} value={q} onChange={e=>setQ(e.target.value)}
            placeholder="볼 이름, 브랜드 검색..."
            style={{
              flex:1,background:"none",border:"none",outline:"none",
              color:"#fff",fontSize:14,fontFamily:"inherit",fontWeight:500
            }}/>
          {q&&<button onClick={()=>setQ("")} style={{background:"none",border:"none",color:"rgba(255,255,255,0.3)",cursor:"pointer",fontSize:16}}>✕</button>}
        </div>
        <button onClick={onClose} style={{
          padding:"10px 16px",borderRadius:12,border:"none",
          background:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.6)",
          fontFamily:"inherit",fontSize:13,fontWeight:600,cursor:"pointer"
        }}>닫기</button>
      </div>

      {/* 브랜드 필터 */}
      <div style={{
        display:"flex",gap:6,overflowX:"auto",padding:"0 20px 12px",flexShrink:0,
        msOverflowStyle:"none",scrollbarWidth:"none"
      }}>
        {BRANDS.map(b=>(
          <button key={b} onClick={()=>{onBrandSelect(b);}} style={{
            padding:"6px 12px",borderRadius:20,border:"none",
            fontFamily:"inherit",fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0,
            background:selectedBrand===b?"#ff8c00":"rgba(255,255,255,0.07)",
            color:selectedBrand===b?"#fff":"rgba(255,255,255,0.4)",
            transition:"all .15s"
          }}>{b}</button>
        ))}
      </div>

      {/* 오일 필터 */}
      <div style={{display:"flex",gap:5,padding:"0 20px 12px",flexShrink:0,overflowX:"auto",msOverflowStyle:"none",scrollbarWidth:"none"}}>
        {["All","Heavy Oil","Medium-Heavy Oil","Medium Oil","Light-Medium Oil"].map(c=>{
          const col = c==="All"?"#fff":COND_COLOR[c];
          return (
            <button key={c} onClick={()=>setCond(c)} style={{
              padding:"5px 12px",borderRadius:20,border:`1px solid ${cond===c?col+"66":"rgba(255,255,255,0.08)"}`,
              fontFamily:"inherit",fontSize:10,fontWeight:700,cursor:"pointer",flexShrink:0,
              background:cond===c?col+"18":"transparent",
              color:cond===c?col:"rgba(255,255,255,0.3)",
              transition:"all .15s"
            }}>{c==="All"?"전체":c.replace(" Oil","")}</button>
          );
        }}
      </div>

      {/* 결과 */}
      <div style={{flex:1,overflowY:"auto",padding:"0 20px 20px"}}>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.25)",fontWeight:700,letterSpacing:1,marginBottom:10}}>
          {filtered.length}개 결과
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {filtered.map(ball=>{
            const oilColor = COND_COLOR[ball.condition]||"#aaa";
            return (
              <div key={ball.id} onClick={()=>{onSelect(ball);onClose();}} style={{
                display:"flex",alignItems:"center",gap:12,
                padding:"10px 14px",borderRadius:14,cursor:"pointer",
                background:"rgba(255,255,255,0.04)",
                border:"1px solid rgba(255,255,255,0.06)",
                transition:"all .15s"
              }}>
                <div style={{width:44,height:44,borderRadius:"50%",overflow:"hidden",flexShrink:0,
                  border:`1.5px solid ${ball.accent}44`}}>
                  <BallImg slug={ball.ballSlug} name={ball.name} size={44}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontWeight:700,letterSpacing:1}}>{ball.brand.toUpperCase()}</div>
                  <div style={{fontSize:14,fontWeight:700,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ball.name}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
                  <span style={{fontSize:9,color:oilColor,fontWeight:700}}>{ball.condition?.replace(" Oil","")}</span>
                  <span style={{fontSize:10,color:ball.accent,fontWeight:800}}>{ball.weightData?.[15]?.rg||ball.weightData?.[16]?.rg}</span>
                </div>
              </div>
            );
          }}
        </div>
      </div>
    </div>
  );
}

// ── 메인 앱 ──
export default function App() {
  const [view, setView] = useState("home");   // home | arsenal | compare | scan | settings
  const [selectedBall, setSelectedBall] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [brand, setBrand] = useState("전체");
  const [sortBy, setSortBy] = useState("popular");
  const [cmpList, setCmpList] = useState([]);
  const [arsenal, setArsenal] = useState([]);
  const [nickname, setNickname] = useState(()=>localStorage.getItem("rm_nickname")||"");
  const [isAdmin, setIsAdmin] = useState(()=>localStorage.getItem("rm_admin")==="1");
  const [notices, setNotices] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [regModal, setRegModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [dbLoading, setDbLoading] = useState(false);
  const carouselRef = useRef();

  // 자동 로그인
  useEffect(()=>{
    const saved = localStorage.getItem("rm_nickname");
    const savedPw = localStorage.getItem("rm_pw");
    if(saved && savedPw){
      setDbLoading(true);
      sbGet("users",`nickname=eq.${encodeURIComponent(saved)}&select=password,is_admin`)
        .then(users=>{
          if(!users.length||users[0].password!==savedPw){
            localStorage.removeItem("rm_nickname");localStorage.removeItem("rm_pw");
            setNickname(""); return Promise.resolve(null);
          }
          setIsAdmin(users[0].is_admin===true);
          return Promise.all([
            sbGet("equipment",`nickname=eq.${encodeURIComponent(saved)}&order=created_at.asc`),
            sbGet("notices","is_active=eq.true&order=created_at.desc")
          ]);
        })
        .then(res=>{
          if(!res)return;
          const [data,nd]=res;
          setNotices(nd||[]);
          if(data?.length){
            setArsenal(data.map(r=>({
              dbId:r.id,ballId:r.ball_id,nickname:r.ball_name_alias||"",
              weight:r.weight||15,grip:r.grip||"세미팁",
              drill_pin:r.drilling_pin||"",drill_cg:r.drilling_cg||"",
              drill_mb:r.drilling_mb_angle||"",drill_note:r.drilling_notes||"",
              purchase_date:r.purchase_date||"",purchase_price:r.purchase_price||"",
              memo:r.memo||"",surface_logs:r.surface_logs||[],
              addedAt:new Date(r.created_at).getTime()
            })));
          }
        })
        .catch(()=>{})
        .finally(()=>setDbLoading(false));
    }
    sbGet("notices","is_active=eq.true&order=created_at.desc").then(d=>setNotices(d)).catch(()=>{});
  },[]);

  const showToast = (msg,color="#43a047")=>{
    setToast({msg,color}); setTimeout(()=>setToast(null),2500);
  };

  const handleLogin = (n,data,admin,noticeData)=>{
    setNickname(n); setIsAdmin(!!admin); setShowLogin(false);
    if(noticeData) setNotices(noticeData);
    if(data?.length) setArsenal(data.map(r=>(({
      dbId:r.id,ballId:r.ball_id,nickname:r.ball_name_alias||"",
      weight:r.weight||15,grip:r.grip||"세미팁",
      drill_pin:r.drilling_pin||"",drill_cg:r.drilling_cg||"",
      drill_mb:r.drilling_mb_angle||"",drill_note:r.drilling_notes||"",
      purchase_date:r.purchase_date||"",purchase_price:r.purchase_price||"",
      memo:r.memo||"",surface_logs:r.surface_logs||[],
      addedAt:new Date(r.created_at).getTime()
    }))));
  };

  const handleLogout = ()=>{
    localStorage.removeItem("rm_nickname");localStorage.removeItem("rm_pw");localStorage.removeItem("rm_admin");
    setNickname("");setArsenal([]);setIsAdmin(false);setView("home");
    showToast("로그아웃 됐어요");
  };

  const inArsenal = id => arsenal.some(e=>e.ballId===id);
  const toggleCmp = ball=>{
    if(cmpList.find(b=>b.id===ball.id)) setCmpList(cmpList.filter(b=>b.id!==ball.id));
    else if(cmpList.length<3) setCmpList([...cmpList,ball]);
  };

  // 정렬된 볼 목록
  const sortedBalls = [...ALL_BALLS].filter(b=>brand==="전체"||b.brand===brand)
    .sort((a,b)=>{
      if(sortBy==="popular") return (POPULARITY[b.name]||0)-(POPULARITY[a.name]||0);
      if(sortBy==="latest"){
        const pd=s=>{if(!s)return 0;const[m,y]=s.split(" ");const ms={Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12};return parseInt(y)*100+(ms[m]||0);};
        return pd(b.releaseDate)-pd(a.releaseDate);
      }
      if(sortBy==="rg") return (a.weightData?.[15]?.rg||9)-(b.weightData?.[15]?.rg||9);
      return 0;
    });

  const NAV = [
    {k:"home",   i:"⌂"},
    {k:"arsenal",i:"🎳",badge:arsenal.length||null},
    {k:"compare",i:"⚖",badge:cmpList.length||null},
    {k:"scan",   i:"⬡"},
    {k:"settings",i:"◎"},
  ];

  const needLogin = (tab)=>{
    if(!nickname && tab!=="home"){ setShowLogin(true); return true; }
    return false;
  };

  return (
    <div style={{
      fontFamily:"'Exo 2','Inter',sans-serif",
      minHeight:"100vh",
      background:"linear-gradient(135deg,#080810 0%,#0d0d1a 40%,#0a0d18 100%)",
      color:"#fff",
      overflowX:"hidden",
      position:"relative"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        * { box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
        ::-webkit-scrollbar { width:0; height:0; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        @keyframes slideUp { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        .r0-ball-card { transition:transform .2s,box-shadow .2s; }
        .r0-ball-card:active { transform:scale(0.97); }
        .r0-nav-btn { transition:all .2s; }
        .r0-nav-btn:active { transform:scale(0.88); }
      `}</style>

      {/* 배경 앰비언트 */}
      <div style={{
        position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"
      }}>
        <div style={{position:"absolute",width:400,height:400,borderRadius:"50%",
          background:"radial-gradient(circle,rgba(255,140,0,0.06) 0%,transparent 70%)",
          top:-100,left:-100,animation:"pulse 6s ease infinite"}}/>
        <div style={{position:"absolute",width:300,height:300,borderRadius:"50%",
          background:"radial-gradient(circle,rgba(100,100,255,0.04) 0%,transparent 70%)",
          bottom:100,right:-50,animation:"pulse 8s ease infinite 2s"}}/>
      </div>

      {/* 탑 로고 바 */}
      <div style={{
        position:"sticky",top:0,zIndex:100,
        padding:"12px 20px 10px",
        display:"flex",alignItems:"center",justifyContent:"space-between",
        background:"rgba(8,8,16,0.85)",backdropFilter:"blur(20px)",
        borderBottom:"1px solid rgba(255,255,255,0.05)"
      }}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:6,
          color:"#fff",lineHeight:1,textShadow:"0 0 20px rgba(255,140,0,0.3)"}}>
          ROLL<span style={{color:"#ff8c00",textShadow:"0 0 16px rgba(255,140,0,0.7)"}}>MATE</span>
          <span style={{fontSize:10,color:"rgba(255,140,0,0.5)",letterSpacing:2,marginLeft:6,verticalAlign:"middle",fontFamily:"'Exo 2',sans-serif",fontWeight:700}}>REV.0</span>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {notices.length>0&&(
            <div style={{width:6,height:6,borderRadius:"50%",background:"#ff8c00",animation:"pulse 2s infinite"}}/>
          )}
          <button onClick={()=>setSearchOpen(true)} style={{
            width:36,height:36,borderRadius:"50%",border:"none",
            background:"rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.6)",
            fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
            backdropFilter:"blur(10px)"
          }}>🔍</button>
          {nickname?(
            <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#ff8c00,#e65100)",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,color:"#fff",
              cursor:"pointer"}} onClick={()=>setView("settings")}>
              {nickname.charAt(0).toUpperCase()}
            </div>
          ):(
            <button onClick={()=>setShowLogin(true)} style={{
              padding:"7px 14px",borderRadius:20,border:"1px solid rgba(255,140,0,0.4)",
              background:"rgba(255,140,0,0.1)",color:"#ff8c00",
              fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer"
            }}>로그인</button>
          )}
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div style={{paddingBottom:80,position:"relative",zIndex:1}}>

        {/* HOME */}
        {view==="home"&&(
          <div style={{animation:"fadeIn .3s ease"}} >
            {/* 공지 */}
            {notices.map(n=>(
              <div key={n.id} style={{
                margin:"12px 16px 0",
                background:"rgba(255,140,0,0.06)",
                borderRadius:14,padding:"10px 14px",
                border:"1px solid rgba(255,140,0,0.15)",
                display:"flex",gap:10,alignItems:"flex-start"
              }}>
                <div style={{width:28,height:28,borderRadius:8,background:"rgba(255,140,0,0.15)",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>📢</div>
                <div>
                  <div style={{fontSize:10,color:"#ff8c00",fontWeight:800,letterSpacing:1,marginBottom:2}}>NOTICE</div>
                  <div style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.8)"}}>{n.title}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:2}}>{n.content}</div>
                </div>
              </div>
            ))}

            {/* 브랜드 필터 */}
            <div style={{padding:"16px 16px 8px"}}>
              <div style={{display:"flex",gap:6,overflowX:"auto",msOverflowStyle:"none",scrollbarWidth:"none",paddingBottom:4}}>
                {BRANDS.map(b=>{
                  const act=brand===b;
                  const logo=BRAND_LOGO?.[b];
                  return (
                    <button key={b} onClick={()=>setBrand(b)} style={{
                      display:"flex",alignItems:"center",gap:5,
                      padding:"6px 10px 6px 7px",borderRadius:20,border:"none",
                      fontFamily:"inherit",fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0,
                      background:act?`${logo?.color||"#ff8c00"}`:"rgba(255,255,255,0.06)",
                      color:act?"#fff":"rgba(255,255,255,0.45)",
                      boxShadow:act?`0 4px 14px ${logo?.color||"#ff8c00"}44`:"none",
                      transition:"all .2s"
                    }}>
                      {b!=="전체"&&logo&&(
                        <div style={{width:18,height:18,borderRadius:4,
                          background:act?"rgba(255,255,255,0.2)":logo.bg,
                          display:"flex",alignItems:"center",justifyContent:"center"
                        }}>
                          <span style={{fontSize:7,fontWeight:900,color:act?"#fff":logo.textColor,fontFamily:"'Exo 2',sans-serif"}}>{logo.abbr}</span>
                        </div>
                      )}
                      {b}
                      <span style={{fontSize:10,opacity:0.6}}>{ALL_BALLS.filter(x=>b==="전체"||x.brand===b).length}</span>
                    </button>
                  );
                }}
              </div>
            </div>

            {/* 정렬 탭 */}
            <div style={{padding:"0 16px 12px",display:"flex",gap:5}}>
              {[{k:"popular",l:"🔥 인기순"},{k:"latest",l:"🆕 최신순"},{k:"rg",l:"RG↑"}].map(s=>(
                <button key={s.k} onClick={()=>setSortBy(s.k)} style={{
                  padding:"5px 12px",borderRadius:20,border:"none",
                  fontFamily:"inherit",fontSize:11,fontWeight:700,cursor:"pointer",
                  background:sortBy===s.k?"rgba(255,140,0,0.2)":"rgba(255,255,255,0.05)",
                  color:sortBy===s.k?"#ff8c00":"rgba(255,255,255,0.35)",
                  border:`1px solid ${sortBy===s.k?"rgba(255,140,0,0.4)":"rgba(255,255,255,0.06)"}`,
                  transition:"all .15s"
                }}>{s.l}</button>
              ))}
            </div>

            {/* 볼 카드 가로 슬라이드 */}
            <div ref={carouselRef} style={{
              display:"flex",gap:12,overflowX:"auto",
              padding:"0 16px 16px",
              msOverflowStyle:"none",scrollbarWidth:"none",
              scrollSnapType:"x mandatory"
            }}>
              {sortedBalls.map(ball=>{
                const pop = POPULARITY[ball.name]||0;
                const inC = !!cmpList.find(b=>b.id===ball.id);
                const inA = inArsenal(ball.id);
                const d = ball.weightData?.[15]||ball.weightData?.[16];
                return (
                  <div key={ball.id} className="r0-ball-card" onClick={()=>setSelectedBall(ball)}
                    style={{
                      flexShrink:0,width:160,
                      background:"rgba(255,255,255,0.04)",
                      backdropFilter:"blur(10px)",
                      borderRadius:20,overflow:"hidden",cursor:"pointer",
                      border:`1px solid ${ball.accent}22`,
                      boxShadow:`0 4px 20px rgba(0,0,0,0.3)`,
                      scrollSnapAlign:"start",
                      position:"relative"
                    }}>
                    {/* 상단 컬러 라인 */}
                    <div style={{height:3,background:`linear-gradient(90deg,${ball.accent},${ball.accent}44)`}}/>
                    {/* 배지 */}
                    <div style={{position:"absolute",top:10,right:8,display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
                      {pop>=90&&<span style={{fontSize:9,background:"linear-gradient(135deg,#ff6b35,#ff8c00)",color:"#fff",padding:"2px 6px",borderRadius:8,fontWeight:800}}>HOT</span>}
                      {inA&&<span style={{fontSize:9,background:`${ball.accent}33`,color:ball.accent,padding:"2px 6px",borderRadius:8,fontWeight:800,border:`1px solid ${ball.accent}44`}}>MY</span>}
                    </div>
                    {/* 볼 이미지 */}
                    <div style={{padding:"14px 14px 8px",display:"flex",justifyContent:"center"}}>
                      <div style={{width:90,height:90,borderRadius:"50%",overflow:"hidden",
                        boxShadow:`0 8px 24px ${ball.accent}44`,border:`2px solid ${ball.accent}33`}}>
                        <BallImg slug={ball.ballSlug} name={ball.name} size={90}/>
                      </div>
                    </div>
                    {/* 정보 */}
                    <div style={{padding:"0 12px 14px"}}>
                      <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",fontWeight:700,letterSpacing:1,marginBottom:2}}>{ball.brand.toUpperCase()}</div>
                      <div style={{fontSize:12,fontWeight:800,color:"#fff",lineHeight:1.25,marginBottom:8,
                        overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{ball.name}</div>
                      {d&&(
                        <div style={{display:"flex",gap:8,marginBottom:8}}>
                          <div style={{textAlign:"center"}}>
                            <div style={{fontSize:8,color:"rgba(255,255,255,0.25)",fontWeight:700}}>RG</div>
                            <div style={{fontSize:13,fontWeight:900,color:ball.accent,fontFamily:"'Exo 2',sans-serif"}}>{d.rg}</div>
                          </div>
                          <div style={{textAlign:"center"}}>
                            <div style={{fontSize:8,color:"rgba(255,255,255,0.25)",fontWeight:700}}>DIFF</div>
                            <div style={{fontSize:13,fontWeight:900,color:ball.accent,fontFamily:"'Exo 2',sans-serif"}}>{d.diff}</div>
                          </div>
                        </div>
                      )}
                      {/* 비교 버튼 */}
                      <button onClick={e=>{e.stopPropagation();toggleCmp(ball);}} style={{
                        width:"100%",padding:"6px",borderRadius:10,border:"none",
                        fontFamily:"inherit",fontSize:10,fontWeight:700,cursor:"pointer",
                        background:inC?ball.accent:"rgba(255,255,255,0.08)",
                        color:inC?"#fff":"rgba(255,255,255,0.4)",
                        transition:"all .15s"
                      }}>{inC?"✓ 비교 중":"+ 비교"}</button>
                    </div>
                  </div>
                );
              }}
            </div>

            {/* 비교 토스트 */}
            {cmpList.length>=2&&(
              <div style={{
                position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",zIndex:3000,
                background:"rgba(28,28,40,0.95)",backdropFilter:"blur(20px)",
                borderRadius:50,padding:"8px 8px 8px 14px",
                display:"flex",alignItems:"center",gap:8,
                border:"1px solid rgba(255,140,0,0.25)",
                boxShadow:"0 8px 32px rgba(0,0,0,0.4)",
                animation:"slideUp .3s ease"
              }}>
                <div style={{display:"flex"}}>
                  {cmpList.map((b,i)=>(
                    <div key={b.id} style={{width:24,height:24,borderRadius:"50%",background:b.accent,
                      marginLeft:i>0?-6:0,border:"2px solid rgba(28,28,40,0.95)",flexShrink:0,
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:"#fff"}}>
                      {b.name.charAt(0)}
                    </div>
                  ))}
                </div>
                <span style={{fontSize:12,color:"rgba(255,255,255,0.5)",fontWeight:600,whiteSpace:"nowrap"}}>{cmpList.length}개</span>
                <button onClick={()=>setView("compare")} style={{
                  padding:"8px 16px",background:"#ff8c00",border:"none",borderRadius:50,
                  color:"#fff",fontFamily:"inherit",fontSize:12,fontWeight:800,cursor:"pointer",
                  whiteSpace:"nowrap",boxShadow:"0 3px 12px rgba(255,140,0,0.45)"
                }}>비교하기 ⚖</button>
                <button onClick={()=>setCmpList([])} style={{
                  width:28,height:28,background:"rgba(255,255,255,0.08)",border:"none",
                  borderRadius:"50%",color:"rgba(255,255,255,0.4)",fontSize:12,cursor:"pointer",
                  display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0
                }}>✕</button>
              </div>
            )}
          </div>
        )}

        {/* ARSENAL */}
        {view==="arsenal"&&(
          <div style={{padding:"16px",animation:"fadeIn .3s ease"}}>
            <div style={{marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:20,fontWeight:800,color:"#fff"}}>내 장비함</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.3)",marginTop:2}}>@{nickname} · {arsenal.length}개 등록</div>
              </div>
              <button onClick={()=>setView("home")} style={{
                padding:"8px 16px",borderRadius:20,border:"1px solid rgba(255,255,255,0.1)",
                background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.6)",
                fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer"
              }}>+ 추가</button>
            </div>
            {arsenal.length===0?(
              <div style={{textAlign:"center",padding:"60px 20px",color:"rgba(255,255,255,0.2)"}}>
                <div style={{fontSize:48,marginBottom:12}}>🎳</div>
                <div style={{fontSize:16,fontWeight:700}}>장비함이 비어있어요</div>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {arsenal.map(entry=>{
                  const ball=ALL_BALLS.find(b=>b.id===entry.ballId);
                  if(!ball)return null;
                  const d=ball.weightData?.[entry.weight]||ball.weightData?.[15];
                  return (
                    <div key={entry.addedAt} style={{
                      background:"rgba(255,255,255,0.04)",backdropFilter:"blur(10px)",
                      borderRadius:18,overflow:"hidden",
                      border:`1px solid ${ball.accent}22`
                    }}>
                      <div style={{height:3,background:`linear-gradient(90deg,${ball.accent},${ball.accent}44)`}}/>
                      <div style={{padding:"14px",display:"flex",gap:12,alignItems:"center"}}>
                        <div style={{width:60,height:60,borderRadius:"50%",overflow:"hidden",flexShrink:0,
                          boxShadow:`0 4px 16px ${ball.accent}44`,border:`2px solid ${ball.accent}33`}}>
                          <BallImg slug={ball.ballSlug} name={ball.name} size={60}/>
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",fontWeight:700,letterSpacing:1}}>{ball.brand.toUpperCase()}</div>
                          <div style={{fontSize:15,fontWeight:800,color:"#fff",marginBottom:5}}>{ball.name}</div>
                          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                            <span style={{fontSize:10,color:ball.accent,fontWeight:700,background:`${ball.accent}15`,padding:"2px 7px",borderRadius:8}}>{entry.weight}lb</span>
                            <span style={{fontSize:10,color:"rgba(255,255,255,0.4)",fontWeight:700,background:"rgba(255,255,255,0.06)",padding:"2px 7px",borderRadius:8}}>{entry.grip||"세미팁"}</span>
                            {d&&<span style={{fontSize:10,color:ball.accent,fontWeight:800}}>RG {d.rg}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }}
              </div>
            )}
          </div>
        )}

        {/* COMPARE */}
        {view==="compare"&&(
          <div style={{padding:"16px",animation:"fadeIn .3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontSize:20,fontWeight:800}}>볼 비교</div>
              {cmpList.length>0&&(
                <button onClick={()=>setCmpList([])} style={{
                  padding:"6px 12px",borderRadius:12,border:"1px solid rgba(239,83,80,0.4)",
                  background:"transparent",color:"#ef5350",fontFamily:"inherit",fontSize:11,fontWeight:700,cursor:"pointer"
                }}>초기화</button>
              )}
            </div>
            {cmpList.length===0?(
              <div style={{textAlign:"center",padding:"60px 20px",color:"rgba(255,255,255,0.2)"}}>
                <div style={{fontSize:48,marginBottom:12}}>⚖</div>
                <div style={{fontSize:15,fontWeight:700}}>홈에서 볼을 선택해주세요</div>
              </div>
            ):(
              <div style={{display:"grid",gridTemplateColumns:`repeat(${cmpList.length},1fr)`,gap:8}}>
                {cmpList.map(ball=>{
                  const d=ball.weightData?.[15]||ball.weightData?.[16];
                  return (
                    <div key={ball.id} style={{
                      background:"rgba(255,255,255,0.04)",borderRadius:16,overflow:"hidden",
                      border:`1px solid ${ball.accent}33`
                    }}>
                      <div style={{height:3,background:ball.accent}}/>
                      <div style={{padding:"12px 8px",textAlign:"center"}}>
                        <div style={{width:56,height:56,borderRadius:"50%",overflow:"hidden",margin:"0 auto 8px",
                          border:`2px solid ${ball.accent}44`}}>
                          <BallImg slug={ball.ballSlug} name={ball.name} size={56}/>
                        </div>
                        <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",marginBottom:2}}>{ball.brand}</div>
                        <div style={{fontSize:11,fontWeight:800,color:"#fff",lineHeight:1.2,marginBottom:8,
                          overflow:"hidden",textOverflow:"ellipsis",WebkitLineClamp:2,display:"-webkit-box",WebkitBoxOrient:"vertical"}}>{ball.name}</div>
                        {d&&[{l:"RG",v:d.rg},{l:"DIFF",v:d.diff}].map(x=>(
                          <div key={x.l} style={{marginBottom:5,padding:"6px",background:"rgba(255,255,255,0.04)",borderRadius:8}}>
                            <div style={{fontSize:8,color:"rgba(255,255,255,0.3)",fontWeight:700}}>{x.l}</div>
                            <div style={{fontSize:16,fontWeight:900,color:ball.accent,fontFamily:"'Exo 2',sans-serif"}}>{x.v}</div>
                          </div>
                        ))}
                        <button onClick={()=>toggleCmp(ball)} style={{
                          width:"100%",padding:"5px",borderRadius:8,border:"1px solid rgba(239,83,80,0.3)",
                          background:"transparent",color:"#ef5350",fontFamily:"inherit",fontSize:10,fontWeight:700,cursor:"pointer",marginTop:4
                        }}>제거</button>
                      </div>
                    </div>
                  );
                }}
              </div>
            )}
          </div>
        )}

        {/* SCAN */}
        {view==="scan"&&(
          <div style={{padding:"16px",animation:"fadeIn .3s ease",textAlign:"center",paddingTop:60}}>
            <div style={{fontSize:48,marginBottom:16}}>📷</div>
            <div style={{fontSize:20,fontWeight:800,marginBottom:8}}>AI 볼 스캔</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",lineHeight:1.6}}>볼링공 사진을 찍으면<br/>AI가 제품을 인식해요</div>
            <div style={{marginTop:20,padding:"12px 16px",background:"rgba(255,140,0,0.08)",borderRadius:14,border:"1px solid rgba(255,140,0,0.2)",fontSize:12,color:"rgba(255,140,0,0.7)"}}>
              ⚠️ 현재 버전(rollmate-nine.vercel.app)에서 사용 가능해요
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {view==="settings"&&(
          <div style={{padding:"16px",animation:"fadeIn .3s ease"}}>
            {!nickname?(
              <div style={{textAlign:"center",padding:"40px 20px"}}>
                <div style={{fontSize:16,fontWeight:700,marginBottom:16}}>로그인이 필요해요</div>
                <button onClick={()=>setShowLogin(true)} style={{
                  padding:"12px 28px",background:"#ff8c00",border:"none",borderRadius:14,
                  color:"#fff",fontFamily:"inherit",fontSize:14,fontWeight:800,cursor:"pointer"
                }}>로그인</button>
              </div>
            ):(
              <div>
                <div style={{
                  background:"linear-gradient(135deg,rgba(255,140,0,0.15),rgba(255,140,0,0.05))",
                  borderRadius:20,padding:"20px",marginBottom:16,
                  border:"1px solid rgba(255,140,0,0.2)",
                  display:"flex",alignItems:"center",gap:14
                }}>
                  <div style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#ff8c00,#e65100)",
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:900,color:"#fff"}}>
                    {nickname.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{fontSize:18,fontWeight:900,color:"#fff"}}>{nickname}</div>
                    <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:2}}>볼링공 {arsenal.length}개 등록</div>
                  </div>
                </div>
                {[
                  {icon:"🚪",label:"로그아웃",action:handleLogout,danger:false},
                ].map(item=>(
                  <button key={item.label} onClick={item.action} style={{
                    width:"100%",padding:"14px 16px",borderRadius:14,border:"none",
                    background:"rgba(255,255,255,0.04)",
                    color:item.danger?"#ef5350":"rgba(255,255,255,0.7)",
                    fontFamily:"inherit",fontSize:14,fontWeight:700,cursor:"pointer",
                    display:"flex",alignItems:"center",gap:10,marginBottom:8,
                    textAlign:"left"
                  }}>
                    <span>{item.icon}</span>{item.label}
                  </button>
                ))}
                <div style={{marginTop:20,padding:"12px 16px",background:"rgba(255,255,255,0.03)",borderRadius:14,
                  border:"1px solid rgba(255,255,255,0.06)",fontSize:11,color:"rgba(255,255,255,0.2)",textAlign:"center",lineHeight:1.8}}>
                  ROLLMATE Rev.0<br/>
                  계정 상세 설정은 rollmate-nine.vercel.app 에서 이용해주세요
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 하단 내비게이션 - 아이콘만 */}
      <div style={{
        position:"fixed",bottom:0,left:0,right:0,zIndex:100,
        background:"rgba(8,8,16,0.92)",backdropFilter:"blur(24px)",
        borderTop:"1px solid rgba(255,255,255,0.05)",
        padding:"8px 0 max(8px,env(safe-area-inset-bottom))",
        display:"flex",justifyContent:"center"
      }}>
        <div style={{display:"flex",gap:0,width:"100%",maxWidth:360}}>
          {NAV.map(n=>(
            <button key={n.k} className="r0-nav-btn"
              onClick={()=>{if(!needLogin(n.k))setView(n.k);}}
              style={{
                flex:1,border:"none",background:"none",cursor:"pointer",
                padding:"8px 0",position:"relative",
                display:"flex",flexDirection:"column",alignItems:"center",
                transition:"all .2s"
              }}>
              <span style={{
                fontSize:20,lineHeight:1,
                filter:view===n.k?"none":"grayscale(1)",
                opacity:view===n.k?1:0.35,
                transition:"all .2s"
              }}>{n.i}</span>
              {view===n.k&&(
                <div style={{
                  width:4,height:4,borderRadius:"50%",background:"#ff8c00",
                  marginTop:4,boxShadow:"0 0 6px #ff8c00"
                }}/>
              )}
              {n.badge&&(
                <div style={{
                  position:"absolute",top:4,right:"calc(50% - 16px)",
                  width:14,height:14,borderRadius:"50%",
                  background:"#ff8c00",color:"#000",
                  fontSize:9,fontWeight:900,
                  display:"flex",alignItems:"center",justifyContent:"center"
                }}>{n.badge}</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 볼 상세 모달 */}
      {selectedBall&&(
        <BallModal
          ball={selectedBall}
          onClose={()=>setSelectedBall(null)}
          inArsenal={inArsenal(selectedBall.id)}
          onReg={(ball)=>{
            if(!nickname){setShowLogin(true);return;}
            // 간단 등록 (기존 버전의 RegModal 없이 바로 등록)
            const existing = arsenal.find(e=>e.ballId===ball.id);
            if(!existing){
              const dbRow={
                nickname,ball_id:ball.id,ball_name:ball.name,
                ball_name_alias:"",weight:15,grip:"세미팁",
                drilling_pin:"",drilling_cg:"",drilling_mb_angle:"",drilling_notes:"",
                purchase_date:null,purchase_price:null,memo:"",surface_logs:[],
              };
              sbInsert("equipment",dbRow)
                .then(res=>{
                  const newDbId=res[0]?.id;
                  setArsenal(prev=>[...prev,{ballId:ball.id,dbId:newDbId,nickname:"",
                    weight:15,grip:"세미팁",drill_pin:"",drill_cg:"",drill_mb:"",drill_note:"",
                    purchase_date:"",purchase_price:"",memo:"",surface_logs:[],addedAt:Date.now()}]);
                  showToast(`🎳 ${ball.name} 등록!`);
                  setSelectedBall(null);
                })
                .catch(()=>showToast("등록 오류","#ef5350"));
            }
          }}
        />
      )}

      {/* 검색 패널 */}
      {searchOpen&&(
        <SearchPanel
          onClose={()=>setSearchOpen(false)}
          onSelect={ball=>setSelectedBall(ball)}
          onBrandSelect={b=>setBrand(b)}
          selectedBrand={brand}
        />
      )}

      {/* 로그인 팝업 */}
      {showLogin&&(
        <LoginPopup onLogin={handleLogin} onClose={()=>setShowLogin(false)}/>
      )}

      {/* 토스트 */}
      {toast&&(
        <div style={{
          position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",
          background:"rgba(28,28,40,0.95)",backdropFilter:"blur(10px)",
          border:`1px solid ${toast.color}44`,color:toast.color,
          padding:"10px 20px",borderRadius:14,zIndex:9999,
          fontWeight:700,fontSize:12,whiteSpace:"nowrap",
          boxShadow:`0 4px 20px ${toast.color}22`
        }}>{toast.msg}</div>
      )}
    </div>
  );
}
