/* DOMA STORE demo inventory. Replace sample records with verified listings before launch. */
window.ACCOUNTS = [
  {
    id: "DS-001",
    status: "available",
    sample: true,
    addedAt: "2026-10-25",
    title: { ar: "حساب اقتصادي | M416 جليشر", en: "Economy Account | M416 Glacier" },
    tier: "economy",
    tags: ["labweapons"],
    priceEGP: 850,
    oldPriceEGP: null,
    level: 42,
    rank: "Platinum",
    version: "global",
    link: "facebook",
    mythicCount: 4,
    gunLabs: 2,
    xSuits: [],
    weapons: [
      { name: "M416 Glacier", level: 1 },
      { name: "AKM Hellfire", level: 1 }
    ],
    vehicles: [],
    outfits: ["Frost Warrior Set"],
    extras: ["Rare Helmet", "Kill Message"],
    description: {
      ar: "حساب اقتصادي مناسب كبداية، يحتوي على سلاح M416 جليشر وبعض الأغراض النادرة. جميع البيانات هنا تجريبية ويجب مراجعتها قبل النشر.",
      en: "A starter-friendly economy account with an M416 Glacier and a few rare items. All details are demo data and must be verified before publishing."
    },
    video: { type: "none", src: "" }
  },
  {
    id: "DS-002",
    status: "available",
    sample: true,
    addedAt: "2026-10-26",
    title: { ar: "حساب اقتصادي | AKM مطور مستوى 3", en: "Economy Account | AKM Lab Lv.3" },
    tier: "economy",
    tags: ["labweapons"],
    priceEGP: 1500,
    oldPriceEGP: null,
    level: 55,
    rank: "Diamond",
    version: "global",
    link: "twitter",
    mythicCount: 12,
    gunLabs: 5,
    xSuits: [],
    weapons: [
      { name: "AKM Hellfire", level: 3 },
      { name: "M416 Glacier", level: 1 },
      { name: "UMP45", level: 1 }
    ],
    vehicles: [],
    outfits: ["Urban Scout Set", "Desert Ranger Set"],
    extras: ["Rare Emote", "Classic Parachute"],
    description: {
      ar: "حساب اقتصادي برتبة دايموند، مع AKM مطور وبعض الأسلحة والأزياء الإضافية. هذا سجل تجريبي وليس إعلانًا عن حساب متاح فعليًا.",
      en: "An economy-tier Diamond account featuring an upgraded AKM plus additional weapon skins and outfits. This is a sample record, not a verified live listing."
    },
    video: { type: "none", src: "" }
  },
  {
    id: "DS-003",
    status: "sold",
    sample: true,
    addedAt: "2026-10-27",
    title: { ar: "حساب X-Suit | Phoenixtra نجمة واحدة", en: "X-Suit Account | Phoenixtra 1-Star" },
    tier: "economy",
    tags: ["xsuit", "labweapons", "vehicles"],
    priceEGP: 3200,
    oldPriceEGP: null,
    level: 63,
    rank: "Crown",
    version: "global",
    link: "facebook",
    mythicCount: 21,
    gunLabs: 8,
    xSuits: [
      { name: "Phoenixtra X-Suit", stars: 1 }
    ],
    weapons: [
      { name: "M416 Glacier", level: 2 },
      { name: "AKM Hellfire", level: 1 }
    ],
    vehicles: ["Mythic Motorcycle"],
    outfits: ["Phoenix Set", "Golden Pharaoh Set"],
    extras: ["Rare Lobby Pose", "Kill Message"],
    description: {
      ar: "حساب تجريبي يتضمن بدلة Phoenixtra بنجمة واحدة. حالته في بيانات العرض: تم البيع.",
      en: "A sample account record featuring the Phoenixtra X-Suit at one star. Its demo listing status is sold."
    },
    video: { type: "none", src: "" }
  },
  {
    id: "DS-004",
    status: "available",
    sample: true,
    addedAt: "2026-10-28",
    title: { ar: "حساب متوسط | M416 جليشر مستوى 4", en: "Mid-range Account | M416 Glacier Lv.4" },
    tier: "mid",
    tags: ["xsuit", "labweapons", "vehicles", "highrank"],
    priceEGP: 6500,
    oldPriceEGP: 7500,
    level: 68,
    rank: "Ace",
    version: "global",
    link: "google",
    mythicCount: 38,
    gunLabs: 12,
    xSuits: [
      { name: "Blood Raven X-Suit", stars: 1 }
    ],
    weapons: [
      { name: "M416 Glacier", level: 4 },
      { name: "AKM Hellfire", level: 2 },
      { name: "UMP45", level: 1 }
    ],
    vehicles: ["Mythic Coupe"],
    outfits: ["Blood Raven Set", "Pharaoh Set", "Wanderer Set"],
    extras: ["Rare Lobby Entrance", "Mythic Parachute"],
    description: {
      ar: "حساب متوسط برتبة Ace، يتضمن M416 جليشر مستوى 4 وبدلة Blood Raven. السعر القديم المعروض جزء من بيانات النموذج.",
      en: "A mid-range Ace account with an M416 Glacier at level 4 and the Blood Raven X-Suit. The previous price is included as sample data."
    },
    video: { type: "none", src: "" }
  },
  {
    id: "DS-005",
    status: "reserved",
    sample: true,
    addedAt: "2026-10-29",
    title: { ar: "حساب متوسط | بدلتان X-Suit", en: "Mid-range Account | Two X-Suits" },
    tier: "mid",
    tags: ["xsuit", "mythic", "labweapons", "vehicles", "highrank"],
    priceEGP: 9800,
    oldPriceEGP: null,
    level: 72,
    rank: "Ace",
    version: "global",
    link: "facebook",
    mythicCount: 55,
    gunLabs: 19,
    xSuits: [
      { name: "Phoenixtra X-Suit", stars: 2 },
      { name: "Dravion X-Suit", stars: 1 }
    ],
    weapons: [
      { name: "M416 Glacier", level: 4 },
      { name: "AKM Hellfire", level: 3 },
      { name: "M762 Starcore", level: 2 }
    ],
    vehicles: ["Mythic Coupe", "Mythic UAZ"],
    outfits: ["Phoenix Set", "Dravion Set", "Golden Pharaoh Set"],
    extras: ["Rare Emotes", "Mythic Lobby Pose"],
    description: {
      ar: "حساب تجريبي متوسط يحتوي على بدلتين X-Suit وأغراض ميثيك متعددة. الحالة الحالية في بيانات العرض: محجوز.",
      en: "A sample mid-range account with two X-Suits and a collection of Mythic items. Its demo listing status is reserved."
    },
    video: { type: "none", src: "" }
  },
  {
    id: "DS-006",
    status: "available",
    sample: true,
    addedAt: "2026-10-30",
    title: { ar: "حساب متوسط كوري | سيارات أسطورية", en: "Korean Mid-range Account | Mythic Cars" },
    tier: "mid",
    tags: ["xsuit", "mythic", "labweapons", "vehicles", "highrank"],
    priceEGP: 14000,
    oldPriceEGP: null,
    level: 70,
    rank: "Ace Master",
    version: "korea",
    link: "twitter",
    mythicCount: 63,
    gunLabs: 21,
    xSuits: [
      { name: "Ignis X-Suit", stars: 1 },
      { name: "Stygian Liege X-Suit", stars: 1 },
      { name: "Golden Pharaoh X-Suit", stars: 1 }
    ],
    weapons: [
      { name: "M416 Glacier", level: 5 },
      { name: "AKM Hellfire", level: 4 },
      { name: "M24 Dragon", level: 2 }
    ],
    vehicles: ["Mythic McLaren", "Mythic UAZ", "Mythic Motorcycle"],
    outfits: ["Ignis Set", "Stygian Liege Set", "Golden Pharaoh Set"],
    extras: ["Vehicle Finish Collection", "Rare Lobby Effects"],
    description: {
      ar: "حساب نسخة كوريا برتبة Ace Master، مع ثلاث بدلات X-Suit ومجموعة سيارات وأسلحة مطورة. البيانات المعروضة تجريبية.",
      en: "A Korea-version Ace Master account with three X-Suits, Mythic vehicles and upgraded weapons. The displayed specifications are sample data."
    },
    video: { type: "none", src: "" }
  },
  {
    id: "DS-007",
    status: "available",
    sample: true,
    addedAt: "2026-10-31",
    title: { ar: "حساب كونكر | موسم تنافسي", en: "Conqueror Account | Competitive Season" },
    tier: "mid",
    tags: ["xsuit", "mythic", "labweapons", "vehicles", "highrank"],
    priceEGP: 18500,
    oldPriceEGP: null,
    level: 76,
    rank: "Conqueror",
    version: "global",
    link: "facebook",
    mythicCount: 85,
    gunLabs: 25,
    xSuits: [
      { name: "Blood Raven X-Suit", stars: 2 },
      { name: "Phoenixtra X-Suit", stars: 1 },
      { name: "Dravion X-Suit", stars: 1 }
    ],
    weapons: [
      { name: "M416 Glacier", level: 5 },
      { name: "AKM Hellfire", level: 4 },
      { name: "Groza Aurora", level: 2 }
    ],
    vehicles: ["Mythic Coupe", "Mythic McLaren", "Mythic UAZ"],
    outfits: ["Blood Raven Set", "Phoenix Set", "Dravion Set", "Pharaoh Set"],
    extras: ["Conqueror Frame", "Rare Emotes", "Mythic Lobby Pose"],
    description: {
      ar: "حساب تجريبي برتبة Conqueror، يجمع بين ثلاث بدلات X-Suit وعدد كبير من الأغراض الميثيك والأسلحة المطورة.",
      en: "A sample Conqueror account combining three X-Suits, a sizeable Mythic collection and multiple upgraded weapons."
    },
    video: { type: "none", src: "" }
  },
  {
    id: "DS-008",
    status: "available",
    sample: true,
    addedAt: "2026-11-01",
    title: { ar: "حساب VIP | M416 جليشر مستوى 7", en: "VIP Account | M416 Glacier Lv.7" },
    tier: "vip",
    tags: ["xsuit", "mythic", "labweapons", "vehicles", "highrank"],
    priceEGP: 27000,
    oldPriceEGP: null,
    level: 77,
    rank: "Conqueror",
    version: "global",
    link: "facebook",
    mythicCount: 95,
    gunLabs: 36,
    xSuits: [
      { name: "Golden Pharaoh X-Suit", stars: 3 },
      { name: "Phoenixtra X-Suit", stars: 2 },
      { name: "Blood Raven X-Suit", stars: 1 },
      { name: "Dravion X-Suit", stars: 1 }
    ],
    weapons: [
      { name: "M416 Glacier", level: 7 },
      { name: "AKM Hellfire", level: 5 },
      { name: "M762 Starcore", level: 4 },
      { name: "UMP45", level: 3 }
    ],
    vehicles: ["Mythic McLaren", "Mythic Coupe", "Mythic UAZ", "Mythic Motorcycle"],
    outfits: ["Golden Pharaoh Set", "Phoenix Set", "Blood Raven Set", "Dravion Set"],
    extras: ["Conqueror Frame", "Premium Lobby Effects", "Rare Emotes"],
    description: {
      ar: "حساب VIP تجريبي برتبة Conqueror، مع M416 جليشر مستوى 7 وأربع بدلات X-Suit ومجموعة كبيرة من المقتنيات.",
      en: "A sample VIP Conqueror account with an M416 Glacier at level 7, four X-Suits and a broad collection of premium items."
    },
    video: { type: "none", src: "" }
  },
  {
    id: "DS-009",
    status: "available",
    sample: true,
    addedAt: "2026-11-01",
    title: { ar: "حساب VIP | مجموعة ميثيك كاملة", en: "VIP Account | Full Mythic Wardrobe" },
    tier: "vip",
    tags: ["xsuit", "mythic", "labweapons", "vehicles", "highrank", "og"],
    priceEGP: 42000,
    oldPriceEGP: null,
    level: 80,
    rank: "Conqueror",
    version: "global",
    link: "google",
    mythicCount: 101,
    gunLabs: 40,
    xSuits: [
      { name: "Golden Pharaoh X-Suit", stars: 4 },
      { name: "Phoenixtra X-Suit", stars: 3 },
      { name: "Blood Raven X-Suit", stars: 2 },
      { name: "Dravion X-Suit", stars: 2 },
      { name: "Ignis X-Suit", stars: 1 }
    ],
    weapons: [
      { name: "M416 Glacier", level: 7 },
      { name: "AKM Hellfire", level: 5 },
      { name: "M762 Starcore", level: 5 },
      { name: "M24 Dragon", level: 3 }
    ],
    vehicles: ["Mythic McLaren", "Mythic Coupe", "Mythic UAZ", "Mythic Motorcycle"],
    outfits: ["Golden Pharaoh Set", "Phoenix Set", "Blood Raven Set", "Dravion Set", "Ignis Set"],
    extras: ["OG Season Items", "Conqueror Frame", "Premium Emotes"],
    description: {
      ar: "حساب VIP تجريبي يضم أكثر من 100 غرض ميثيك وخمس بدلات X-Suit ومجموعة متنوعة من الأسلحة والمركبات.",
      en: "A sample VIP account with more than 100 Mythic items, five X-Suits and a varied selection of weapon skins and vehicles."
    },
    video: { type: "none", src: "" }
  },
  {
    id: "DS-010",
    status: "available",
    sample: true,
    addedAt: "2026-11-02",
    title: { ar: "حساب VIP | M416 The Fool مستوى 6", en: "VIP Account | M416 The Fool Lv.6" },
    tier: "vip",
    tags: ["xsuit", "mythic", "labweapons", "vehicles", "highrank", "og"],
    priceEGP: 58000,
    oldPriceEGP: null,
    level: 82,
    rank: "Conqueror",
    version: "global",
    link: "facebook",
    mythicCount: 140,
    gunLabs: 55,
    xSuits: [
      { name: "Golden Pharaoh X-Suit", stars: 5 },
      { name: "Phoenixtra X-Suit", stars: 4 },
      { name: "Blood Raven X-Suit", stars: 3 },
      { name: "Dravion X-Suit", stars: 2 },
      { name: "Ignis X-Suit", stars: 2 },
      { name: "Stygian Liege X-Suit", stars: 1 }
    ],
    weapons: [
      { name: "M416 The Fool", level: 6 },
      { name: "M416 Glacier", level: 7 },
      { name: "AKM Hellfire", level: 6 },
      { name: "M762 Starcore", level: 5 }
    ],
    vehicles: ["Mythic McLaren", "Mythic Coupe", "Mythic UAZ", "Mythic Motorcycle", "Mythic Dacia"],
    outfits: ["Golden Pharaoh Set", "Phoenix Set", "Blood Raven Set", "Dravion Set", "Ignis Set", "Stygian Set"],
    extras: ["OG Season Items", "Conqueror Frame", "Premium Lobby Effects", "Rare Emotes"],
    description: {
      ar: "حساب VIP تجريبي برتبة Conqueror، يضم M416 The Fool مستوى 6 وست بدلات X-Suit ومجموعة موسعة من المقتنيات.",
      en: "A sample VIP Conqueror account featuring M416 The Fool at level 6, six X-Suits and an expanded collection of premium items."
    },
    video: { type: "none", src: "" }
  },
  {
    id: "DS-011",
    status: "available",
    sample: true,
    addedAt: "2026-11-03",
    title: { ar: "حساب VIP قديم | OG Conqueror", en: "OG VIP Account | Conqueror" },
    tier: "vip",
    tags: ["xsuit", "mythic", "labweapons", "vehicles", "highrank", "og"],
    priceEGP: 76000,
    oldPriceEGP: null,
    level: 83,
    rank: "Conqueror",
    version: "global",
    link: "twitter",
    mythicCount: 180,
    gunLabs: 60,
    xSuits: [
      { name: "Golden Pharaoh X-Suit", stars: 6 },
      { name: "Phoenixtra X-Suit", stars: 5 },
      { name: "Blood Raven X-Suit", stars: 4 },
      { name: "Dravion X-Suit", stars: 3 },
      { name: "Ignis X-Suit", stars: 2 },
      { name: "Stygian Liege X-Suit", stars: 2 },
      { name: "Poseidon X-Suit", stars: 1 },
      { name: "Silvanus X-Suit", stars: 1 }
    ],
    weapons: [
      { name: "M416 Glacier", level: 7 },
      { name: "M416 The Fool", level: 7 },
      { name: "AKM Hellfire", level: 7 },
      { name: "M762 Starcore", level: 6 },
      { name: "UMP45", level: 5 }
    ],
    vehicles: ["Mythic McLaren", "Mythic Coupe", "Mythic UAZ", "Mythic Motorcycle", "Mythic Dacia", "Mythic Buggy"],
    outfits: ["OG Season Outfits", "Golden Pharaoh Set", "Phoenix Set", "Blood Raven Set", "Poseidon Set"],
    extras: ["OG Season Frames", "Conqueror Frame", "Rare Lobby Effects", "Legacy Emotes"],
    description: {
      ar: "حساب OG تجريبي برتبة Conqueror، يحتوي على ثماني بدلات X-Suit ومجموعة كبيرة من الأسلحة المطورة والأغراض القديمة.",
      en: "A sample OG Conqueror account with eight X-Suits, a large upgraded-weapon collection and older-season items."
    },
    video: { type: "none", src: "" }
  },
  {
    id: "DS-012",
    status: "available",
    sample: true,
    addedAt: "2026-11-04",
    title: { ar: "الحساب الأسطوري | مجموعة VIP متكاملة", en: "Ultimate Collection | Full VIP Account" },
    tier: "vip",
    tags: ["xsuit", "mythic", "labweapons", "vehicles", "highrank", "og"],
    priceEGP: 95000,
    oldPriceEGP: null,
    level: 85,
    rank: "Conqueror",
    version: "global",
    link: "facebook",
    mythicCount: 210,
    gunLabs: 70,
    xSuits: [
      { name: "Golden Pharaoh X-Suit", stars: 7 },
      { name: "Phoenixtra X-Suit", stars: 6 },
      { name: "Blood Raven X-Suit", stars: 5 },
      { name: "Dravion X-Suit", stars: 4 },
      { name: "Ignis X-Suit", stars: 3 },
      { name: "Stygian Liege X-Suit", stars: 3 },
      { name: "Poseidon X-Suit", stars: 2 },
      { name: "Silvanus X-Suit", stars: 2 },
      { name: "Avalanche X-Suit", stars: 1 },
      { name: "Blood Fang X-Suit", stars: 1 }
    ],
    weapons: [
      { name: "M416 Glacier", level: 7 },
      { name: "M416 The Fool", level: 7 },
      { name: "AKM Hellfire", level: 7 },
      { name: "M762 Starcore", level: 7 },
      { name: "M24 Dragon", level: 6 },
      { name: "UMP45", level: 6 }
    ],
    vehicles: ["Mythic McLaren", "Mythic Coupe", "Mythic UAZ", "Mythic Motorcycle", "Mythic Dacia", "Mythic Buggy", "Mythic Monster Truck"],
    outfits: ["OG Season Outfits", "Golden Pharaoh Set", "Phoenix Set", "Blood Raven Set", "Dravion Set", "Poseidon Set", "Silvanus Set"],
    extras: ["OG Season Frames", "Conqueror Frame", "Premium Lobby Effects", "Rare Emotes", "Legacy Parachutes"],
    description: {
      ar: "نموذج لأعلى فئة VIP: رتبة Conqueror، عشر بدلات X-Suit، أكثر من 200 غرض ميثيك، وعدد كبير من الأسلحة والمركبات. كل المواصفات تجريبية.",
      en: "An ultimate VIP sample: Conqueror rank, ten X-Suits, more than 200 Mythic items and an extensive weapon and vehicle collection. All specifications are demo data."
    },
    video: { type: "none", src: "" }
  }
];
