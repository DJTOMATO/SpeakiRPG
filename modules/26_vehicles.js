// ============================================================================
// IN-GAME 3D VEHICLES WARDROBE & STEALTH BOX SYSTEM (LEVELS 10-100 + SYNC)
// ============================================================================

const SPKMOD_VEHICLE_STORAGE_KEYS = {
	enabled: "spkmod-car-enabled",
	equipped: "spkmod-vehicle-equipped",
	lastEquipped: "spkmod-vehicle-last-equipped",
	color: "spkmod-vehicle-color",
	showRemote: "spkmod-vehicle-show-remote",
	shareInChat: "spkmod-vehicle-share-chat",
	favorites: "spkmod-vehicle-favorites",
	unlockAll: "spkmod-vehicle-unlock-all-test"
};

const SPKMOD_VEHICLE_COLORS = [
	{ idx: 0, id: "red",    hex: 0xd0564a, css: "#d0564a", defaultName: "Crimson Red" },
	{ idx: 1, id: "blue",   hex: 0x3c7fd0, css: "#3c7fd0", defaultName: "Cobalt Blue" },
	{ idx: 2, id: "green",  hex: 0x4caf7a, css: "#4caf7a", defaultName: "Mint Green" },
	{ idx: 3, id: "yellow", hex: 0xe8c547, css: "#e8c547", defaultName: "Sunshine Yellow" },
	{ idx: 4, id: "orange", hex: 0xe88a3c, css: "#e88a3c", defaultName: "Pumpkin Orange" },
	{ idx: 5, id: "white",  hex: 0xf1f1ec, css: "#f1f1ec", defaultName: "Pearl White" },
	{ idx: 6, id: "cyan",   hex: 0x6ec6e8, css: "#6ec6e8", defaultName: "Sky Cyan" },
	{ idx: 7, id: "purple", hex: 0x8a63c9, css: "#8a63c9", defaultName: "Royal Purple" }
];

// Keep code 1 = sedan (Lv.20) & code 2 = van (Lv.30) for full compatibility with legacy :car_1_X: / :car_2_X:
const SPKMOD_VEHICLE_CATALOG = [
	{
		code: 1, id: "sedan", level: 20, category: "street", icon: "🚗", accent: "#ef4444",
		defaultName: "City Sedan", paintable: true, pose: "sit", sfxType: "car_horn",
		spec: { kind: "burger_glb", modelName: "Vehicle_Sedan" }
	},
	{
		code: 2, id: "van", level: 30, category: "street", icon: "🚐", accent: "#f59e0b",
		defaultName: "Delivery Van", paintable: true, pose: "sit", sfxType: "car_horn",
		spec: { kind: "burger_glb", modelName: "Vehicle_Van" }
	},
	{
		code: 3, id: "mgs_box", level: 10, category: "stealth", icon: "📦", accent: "#d97706",
		defaultName: "Tactical Cardboard Box", paintable: false, pose: "none", hidePlayer: true, sfxType: "mgs_alert",
		spec: { kind: "procedural", builder: "mgsBox" }
	},
	{
		code: 4, id: "shopping_cart", level: 15, category: "stealth", icon: "🛒", accent: "#94a3b8",
		defaultName: "Supermarket Cart", paintable: true, pose: "sit", sfxType: "bell",
		spec: { kind: "procedural", builder: "shoppingCart" }
	},
	{
		code: 5, id: "spring_rider", level: 25, category: "stealth", icon: "🎠", accent: "#fb7185",
		defaultName: "Playground Spring Rider", paintable: false, pose: "sit", sfxType: "boing",
		spec: { kind: "glb", url: "/models/playground/playground-spring-rider.glb", targetHeight: 1.05, seatOffsetY: 0.72, rockAmp: 0.16 }
	},
	{
		code: 6, id: "scooter", level: 35, category: "street", icon: "🛵", accent: "#38bdf8",
		defaultName: "Retro Street Scooter", paintable: true, pose: "sit", sfxType: "scooter",
		spec: { kind: "procedural", builder: "scooter" }
	},
	{
		code: 7, id: "duck_floatie", level: 40, category: "stealth", icon: "🦆", accent: "#facc15",
		defaultName: "Giant Duck Floatie", paintable: false, pose: "sit", sfxType: "quack",
		spec: { kind: "procedural", builder: "duckFloatie" }
	},
	{
		code: 8, id: "sports_coupe", level: 45, category: "street", icon: "🏎️", accent: "#f43f5e",
		defaultName: "GT Turbo Coupe", paintable: true, pose: "sit", sfxType: "car_horn",
		spec: { kind: "procedural", builder: "sportsCoupe" }
	},
	{
		code: 9, id: "police_cruiser", level: 50, category: "street", icon: "🚓", accent: "#3b82f6",
		defaultName: "Monatium Police Cruiser", paintable: false, pose: "sit", milestone: true, sfxType: "siren",
		spec: { kind: "procedural", builder: "policeCruiser" }
	},
	{
		code: 10, id: "magic_broom", level: 55, category: "air", icon: "🧹", accent: "#a855f7",
		defaultName: "Enchanted Witch Broom", paintable: false, pose: "sit", sfxType: "magic",
		spec: { kind: "procedural", builder: "magicBroom" }
	},
	{
		code: 11, id: "hoverboard", level: 60, category: "air", icon: "🛹", accent: "#06b6d4",
		defaultName: "Cyber Neon Hoverboard", paintable: true, pose: "stand", sfxType: "scifi",
		spec: { kind: "procedural", builder: "hoverboard" }
	},
	{
		code: 12, id: "monster_truck", level: 65, category: "street", icon: "🚚", accent: "#ea580c",
		defaultName: "Crusher Monster Truck", paintable: true, pose: "sit", sfxType: "car_horn",
		spec: { kind: "procedural", builder: "monsterTruck" }
	},
	{
		code: 13, id: "rocket_kart", level: 70, category: "street", icon: "🏁", accent: "#ef4444",
		defaultName: "Pumpkin Rocket Racer", paintable: false, pose: "sit", sfxType: "turbo",
		spec: { kind: "glb", url: "/models/racing/racer_rocket.glb", targetLength: 2.35, seatOffsetY: 0.78, flameZ: -1.18, flameY: 0.42 }
	},
	{
		code: 14, id: "mini_tank", level: 75, category: "street", icon: "💣", accent: "#65a30d",
		defaultName: "Pocket Battle Tank", paintable: true, pose: "sit", sfxType: "cannon",
		spec: { kind: "procedural", builder: "miniTank" }
	},
	{
		code: 15, id: "santa_sleigh", level: 80, category: "air", icon: "🛷", accent: "#dc2626",
		defaultName: "Flying Santa Sleigh", paintable: false, pose: "sit", sfxType: "magic",
		spec: { kind: "glb", url: "/models/winter-town/santa-sleigh-set.glb", fallbackUrl: "/models/winter-town/santa-sleigh-flying.glb", targetLength: 4.0, keepLocalZ: true, hoverY: 0.36, hoverAmp: 0.10, seatOffsetY: 0.88 }
	},
	{
		code: 16, id: "town_train", level: 85, category: "street", icon: "🚂", accent: "#16a34a",
		defaultName: "Worldtree Express Train", paintable: false, pose: "sit", sfxType: "train",
		spec: { kind: "glb", url: "/models/town-train/worldtree-town-train.glb", targetLength: 2.95, seatOffsetY: 1.38, chugAmp: 0.045 }
	},
	{
		code: 17, id: "ufo_saucer", level: 90, category: "air", icon: "🛸", accent: "#22d3ee",
		defaultName: "Alien Flying Saucer", paintable: true, pose: "sit", sfxType: "scifi",
		spec: { kind: "procedural", builder: "ufoSaucer" }
	},
	{
		code: 18, id: "nimbus_cloud", level: 95, category: "air", icon: "☁️", accent: "#fde047",
		defaultName: "Golden Nimbus Cloud", paintable: false, pose: "stand", sfxType: "magic",
		spec: { kind: "procedural", builder: "nimbusCloud" }
	},
	{
		code: 19, id: "battlecruiser", level: 100, category: "air", icon: "🚀", accent: "#f59e0b",
		defaultName: "Galactic Battlecruiser", paintable: false, pose: "stand", milestone: true, sfxType: "scifi",
		spec: { kind: "glb", url: "/models/battlecruiser/battlecruiser.opt.glb", targetLength: 3.45, hoverY: 0.58, hoverAmp: 0.12, seatOffsetY: 1.28 }
	},
	// --- 35 FUNNY, STEALTH, UTILITY & FANTASY VEHICLES (BALANCED SPREAD LV 12 -> 100) ---
	{
		code: 20, id: "chicken_mech", level: 100, category: "street", icon: "🦾", accent: "#64748b",
		defaultName: "Bipedal Chicken-Walker Mech", paintable: true, pose: "sit", milestone: true, sfxType: "mech",
		spec: { kind: "procedural", builder: "chickenMech" }
	},
	{
		code: 21, id: "chibi_heli", level: 97, category: "air", icon: "🚁", accent: "#ef4444",
		defaultName: "Chibi Attack Helicopter", paintable: true, pose: "sit", sfxType: "heli",
		spec: { kind: "procedural", builder: "chibiHeli" }
	},
	{
		code: 22, id: "pirate_galleon", level: 94, category: "air", icon: "⛵", accent: "#92400e",
		defaultName: "Mini Pirate Galleon", paintable: false, pose: "stand", sfxType: "cannon",
		spec: { kind: "procedural", builder: "pirateGalleon" }
	},
	{
		code: 23, id: "hot_air_balloon", level: 87, category: "air", icon: "🎈", accent: "#ec4899",
		defaultName: "Mini Hot Air Balloon", paintable: true, pose: "stand", sfxType: "magic",
		spec: { kind: "procedural", builder: "hotAirBalloon" }
	},
	{
		code: 24, id: "magic_carpet", level: 92, category: "air", icon: "🧞", accent: "#a855f7",
		defaultName: "Flying Magic Carpet", paintable: false, pose: "stand", sfxType: "magic",
		spec: { kind: "procedural", builder: "magicCarpet" }
	},
	{
		code: 25, id: "cyber_lightcycle", level: 83, category: "street", icon: "🏍️", accent: "#06b6d4",
		defaultName: "Neon Cyberpunk Lightcycle", paintable: true, pose: "sit", sfxType: "scifi",
		spec: { kind: "procedural", builder: "cyberLightcycle" }
	},
	{
		code: 26, id: "jet_turtle", level: 79, category: "air", icon: "🐢", accent: "#16a34a",
		defaultName: "Jet-Boosted Turtle", paintable: false, pose: "sit", sfxType: "turbo",
		spec: { kind: "procedural", builder: "jetTurtle" }
	},
	{
		code: 27, id: "paper_airplane", level: 76, category: "air", icon: "✈️", accent: "#f8fafc",
		defaultName: "Giant Paper Airplane", paintable: false, pose: "stand", sfxType: "magic",
		spec: { kind: "procedural", builder: "paperAirplane" }
	},
	{
		code: 28, id: "land_shark", level: 72, category: "stealth", icon: "🦈", accent: "#64748b",
		defaultName: "Land Shark Fin", paintable: false, pose: "sit", sfxType: "jaws",
		spec: { kind: "procedural", builder: "landShark" }
	},
	{
		code: 29, id: "bouncy_frog", level: 64, category: "stealth", icon: "🐸", accent: "#22c55e",
		defaultName: "Giant Bouncy Frog", paintable: false, pose: "sit", sfxType: "ribbit",
		spec: { kind: "procedural", builder: "bouncyFrog" }
	},
	{
		code: 30, id: "stealth_moai", level: 69, category: "stealth", icon: "🗿", accent: "#94a3b8",
		defaultName: "Moai Stone Head", paintable: false, pose: "none", hidePlayer: true, sfxType: "vine_boom",
		spec: { kind: "procedural", builder: "stealthMoai" }
	},
	{
		code: 31, id: "golden_toilet", level: 67, category: "stealth", icon: "🚽", accent: "#facc15",
		defaultName: "Golden Turbo Toilet", paintable: false, pose: "sit", sfxType: "flush",
		spec: { kind: "procedural", builder: "goldenToilet" }
	},
	{
		code: 32, id: "grand_piano", level: 62, category: "stealth", icon: "🎹", accent: "#1e293b",
		defaultName: "Rolling Grand Piano", paintable: false, pose: "sit", sfxType: "piano",
		spec: { kind: "procedural", builder: "grandPiano" }
	},
	{
		code: 33, id: "burger_mobile", level: 57, category: "street", icon: "🍔", accent: "#f59e0b",
		defaultName: "Cheeseburger Patty-Mobile", paintable: false, pose: "sit", sfxType: "car_horn",
		spec: { kind: "procedural", builder: "burgerMobile" }
	},
	{
		code: 34, id: "hotdog_mobile", level: 49, category: "street", icon: "🌭", accent: "#ea580c",
		defaultName: "Giant Hot Dog Mobile", paintable: false, pose: "sit", sfxType: "car_horn",
		spec: { kind: "procedural", builder: "hotdogMobile" }
	},
	{
		code: 35, id: "flying_bed", level: 59, category: "air", icon: "🛏️", accent: "#818cf8",
		defaultName: "Hovering Comfy Bed", paintable: true, pose: "sit", sfxType: "magic",
		spec: { kind: "procedural", builder: "flyingBed" }
	},
	{
		code: 36, id: "fire_engine", level: 54, category: "street", icon: "🚒", accent: "#dc2626",
		defaultName: "Fire Engine", paintable: false, pose: "sit", sfxType: "siren",
		spec: { kind: "procedural", builder: "fireEngine" }
	},
	{
		code: 37, id: "ambulance", level: 52, category: "street", icon: "🚑", accent: "#f8fafc",
		defaultName: "Chibi Ambulance", paintable: false, pose: "sit", sfxType: "siren",
		spec: { kind: "procedural", builder: "ambulance" }
	},
	{
		code: 38, id: "ice_cream_truck", level: 48, category: "street", icon: "🍦", accent: "#f472b6",
		defaultName: "Ice Cream Truck", paintable: true, pose: "sit", sfxType: "ice_cream",
		spec: { kind: "procedural", builder: "iceCreamTruck" }
	},
	{
		code: 39, id: "school_bus", level: 46, category: "street", icon: "🚌", accent: "#eab308",
		defaultName: "Mini Yellow School Bus", paintable: false, pose: "sit", sfxType: "car_horn",
		spec: { kind: "procedural", builder: "schoolBus" }
	},
	{
		code: 40, id: "bubble_bathtub", level: 43, category: "stealth", icon: "🛁", accent: "#7dd3fc",
		defaultName: "Rolling Bubble Bathtub", paintable: false, pose: "sit", sfxType: "quack",
		spec: { kind: "procedural", builder: "bubbleBathtub" }
	},
	{
		code: 41, id: "giant_roomba", level: 38, category: "stealth", icon: "🤖", accent: "#22c55e",
		defaultName: "Giant Robot Vacuum", paintable: true, pose: "sit", sfxType: "scifi",
		spec: { kind: "procedural", builder: "giantRoomba" }
	},
	{
		code: 42, id: "swivel_chair", level: 19, category: "stealth", icon: "🪑", accent: "#ef4444",
		defaultName: "Spinning Office Swivel Chair", paintable: true, pose: "sit", sfxType: "squeak",
		spec: { kind: "procedural", builder: "swivelChair" }
	},
	{
		code: 43, id: "banana_car", level: 36, category: "street", icon: "🍌", accent: "#facc15",
		defaultName: "Giant Banana Car", paintable: false, pose: "sit", sfxType: "car_horn",
		spec: { kind: "procedural", builder: "bananaCar" }
	},
	{
		code: 44, id: "sneaker_car", level: 28, category: "street", icon: "👟", accent: "#ef4444",
		defaultName: "Giant Sneaker Car", paintable: true, pose: "sit", sfxType: "squeak",
		spec: { kind: "procedural", builder: "sneakerCar" }
	},
	{
		code: 45, id: "watermelon_boat", level: 32, category: "stealth", icon: "🍉", accent: "#f43f5e",
		defaultName: "Watermelon Slice Glider", paintable: false, pose: "sit", sfxType: "boing",
		spec: { kind: "procedural", builder: "watermelonBoat" }
	},
	{
		code: 46, id: "mini_forklift", level: 41, category: "street", icon: "🏗️", accent: "#facc15",
		defaultName: "Forklift Certified", paintable: true, pose: "sit", sfxType: "scooter",
		spec: { kind: "procedural", builder: "miniForklift" }
	},
	{
		code: 47, id: "farm_tractor", level: 34, category: "street", icon: "🚜", accent: "#16a34a",
		defaultName: "Farm Tractor", paintable: true, pose: "sit", sfxType: "car_horn",
		spec: { kind: "procedural", builder: "farmTractor" }
	},
	{
		code: 48, id: "penny_farthing", level: 24, category: "street", icon: "🚲", accent: "#b45309",
		defaultName: "Vintage Penny-Farthing", paintable: true, pose: "sit", sfxType: "bell",
		spec: { kind: "procedural", builder: "pennyFarthing" }
	},
	{
		code: 49, id: "stealth_gift", level: 29, category: "stealth", icon: "🎁", accent: "#ec4899",
		defaultName: "Mystery Gift Box", paintable: true, pose: "none", hidePlayer: true, sfxType: "mgs_alert",
		spec: { kind: "procedural", builder: "stealthGift" }
	},
	{
		code: 50, id: "stealth_snowman", level: 26, category: "stealth", icon: "⛄", accent: "#bae6fd",
		defaultName: "Suspicious Snowman", paintable: false, pose: "none", hidePlayer: true, sfxType: "boing",
		spec: { kind: "procedural", builder: "stealthSnowman" }
	},
	{
		code: 51, id: "stealth_trashcan", level: 22, category: "stealth", icon: "🗑️", accent: "#94a3b8",
		defaultName: "Alley Trash Can", paintable: false, pose: "none", hidePlayer: true, sfxType: "clang",
		spec: { kind: "procedural", builder: "stealthTrashcan" }
	},
	{
		code: 52, id: "stealth_barrel", level: 17, category: "stealth", icon: "🛢️", accent: "#92400e",
		defaultName: "Pirate Wooden Barrel", paintable: false, pose: "none", hidePlayer: true, sfxType: "mgs_alert",
		spec: { kind: "procedural", builder: "stealthBarrel" }
	},
	{
		code: 53, id: "stealth_cone", level: 14, category: "stealth", icon: "🚧", accent: "#f97316",
		defaultName: "Oversized Traffic Cone", paintable: false, pose: "none", hidePlayer: true, sfxType: "mgs_alert",
		spec: { kind: "procedural", builder: "stealthCone" }
	},
	{
		code: 54, id: "stealth_bush", level: 12, category: "stealth", icon: "🌿", accent: "#22c55e",
		defaultName: "Stealth Bush", paintable: false, pose: "none", hidePlayer: true, sfxType: "mgs_alert",
		spec: { kind: "procedural", builder: "stealthBush" }
	},
	// --- 46 EXPANSION VEHICLES (STREET, STEALTH, FUN & AIR — REACHING 100 TOTAL!) ---
	{
		code: 55, id: "skateboard", level: 1, category: "stealth", icon: "🛹", accent: "#f97316",
		defaultName: "Classic Street Skateboard", paintable: true, pose: "stand", sfxType: "squeak",
		spec: { kind: "procedural", builder: "skateboard" }
	},
	{
		code: 56, id: "red_wagon", level: 2, category: "stealth", icon: "🧸", accent: "#ef4444",
		defaultName: "Little Red Toy Wagon", paintable: true, pose: "sit", sfxType: "squeak",
		spec: { kind: "procedural", builder: "redWagon" }
	},
	{
		code: 57, id: "tricycle", level: 3, category: "street", icon: "🚲", accent: "#f43f5e",
		defaultName: "Giant Kid's Tricycle", paintable: true, pose: "sit", sfxType: "bell",
		spec: { kind: "procedural", builder: "tricycle" }
	},
	{
		code: 58, id: "stealth_plant", level: 4, category: "stealth", icon: "🌵", accent: "#22c55e",
		defaultName: "Stealth Potted Cactus", paintable: true, pose: "none", hidePlayer: true, sfxType: "mgs_alert",
		spec: { kind: "procedural", builder: "stealthPlant" }
	},
	{
		code: 59, id: "bumper_car", level: 5, category: "street", icon: "🎡", accent: "#ec4899",
		defaultName: "Carnival Bumper Car", paintable: true, pose: "sit", sfxType: "arcade",
		spec: { kind: "procedural", builder: "bumperCar" }
	},
	{
		code: 60, id: "stealth_mailbox", level: 6, category: "stealth", icon: "📮", accent: "#dc2626",
		defaultName: "Suspicious Postbox", paintable: true, pose: "none", hidePlayer: true, sfxType: "clang",
		spec: { kind: "procedural", builder: "stealthMailbox" }
	},
	{
		code: 61, id: "go_kart", level: 8, category: "street", icon: "🏎️", accent: "#ef4444",
		defaultName: "Turbo Drift Go-Kart", paintable: true, pose: "sit", sfxType: "turbo",
		spec: { kind: "procedural", builder: "goKart" }
	},
	{
		code: 62, id: "stealth_hydrant", level: 9, category: "stealth", icon: "🚨", accent: "#ef4444",
		defaultName: "Sneaky Fire Hydrant", paintable: false, pose: "none", hidePlayer: true, sfxType: "flush",
		spec: { kind: "procedural", builder: "stealthHydrant" }
	},
	{
		code: 63, id: "stealth_onigiri", level: 11, category: "stealth", icon: "🍙", accent: "#f8fafc",
		defaultName: "Tactical Onigiri Riceball", paintable: false, pose: "none", hidePlayer: true, sfxType: "chomp",
		spec: { kind: "procedural", builder: "stealthOnigiri" }
	},
	{
		code: 64, id: "tuk_tuk", level: 13, category: "street", icon: "🛺", accent: "#10b981",
		defaultName: "Street Auto-Rickshaw", paintable: true, pose: "sit", sfxType: "scooter",
		spec: { kind: "procedural", builder: "tukTuk" }
	},
	{
		code: 65, id: "pizza_slice", level: 16, category: "stealth", icon: "🍕", accent: "#f59e0b",
		defaultName: "Giant Pepperoni Pizza Slice", paintable: false, pose: "sit", sfxType: "chomp",
		spec: { kind: "procedural", builder: "pizzaSlice" }
	},
	{
		code: 66, id: "stealth_tp_roll", level: 18, category: "stealth", icon: "🧻", accent: "#f8fafc",
		defaultName: "Giant Toilet Paper Roll", paintable: false, pose: "none", hidePlayer: true, sfxType: "squeak",
		spec: { kind: "procedural", builder: "stealthTpRoll" }
	},
	{
		code: 67, id: "yellow_taxi", level: 21, category: "street", icon: "🚕", accent: "#eab308",
		defaultName: "Metro Checker Taxi", paintable: false, pose: "sit", sfxType: "car_horn",
		spec: { kind: "procedural", builder: "yellowTaxi" }
	},
	{
		code: 68, id: "stealth_pumpkin", level: 23, category: "stealth", icon: "🎃", accent: "#f97316",
		defaultName: "Spooky Jack-o'-Lantern", paintable: false, pose: "none", hidePlayer: true, sfxType: "mgs_alert",
		spec: { kind: "procedural", builder: "stealthPumpkin" }
	},
	{
		code: 69, id: "beach_buggy", level: 27, category: "street", icon: "🏖️", accent: "#06b6d4",
		defaultName: "Dune Beach Buggy", paintable: true, pose: "sit", sfxType: "turbo",
		spec: { kind: "procedural", builder: "beachBuggy" }
	},
	{
		code: 70, id: "stealth_tent", level: 31, category: "stealth", icon: "⛺", accent: "#16a34a",
		defaultName: "Sneaky Camping Tent", paintable: true, pose: "none", hidePlayer: true, sfxType: "mgs_alert",
		spec: { kind: "procedural", builder: "stealthTent" }
	},
	{
		code: 71, id: "vintage_beetle", level: 33, category: "street", icon: "🐞", accent: "#fb7185",
		defaultName: "Retro Bug Convertible", paintable: true, pose: "sit", sfxType: "car_horn",
		spec: { kind: "procedural", builder: "vintageBeetle" }
	},
	{
		code: 72, id: "teacup_ride", level: 37, category: "stealth", icon: "☕", accent: "#f472b6",
		defaultName: "Spinning Carnival Teacup", paintable: true, pose: "sit", sfxType: "bell",
		spec: { kind: "procedural", builder: "teacupRide" }
	},
	{
		code: 73, id: "stealth_chest", level: 39, category: "stealth", icon: "💰", accent: "#d97706",
		defaultName: "Mimic Treasure Chest", paintable: false, pose: "none", hidePlayer: true, sfxType: "gong",
		spec: { kind: "procedural", builder: "stealthChest" }
	},
	{
		code: 74, id: "taco_truck", level: 42, category: "street", icon: "🌮", accent: "#f59e0b",
		defaultName: "Street Taco Food Truck", paintable: true, pose: "sit", sfxType: "chomp",
		spec: { kind: "procedural", builder: "tacoTruck" }
	},
	{
		code: 75, id: "ramen_bowl", level: 44, category: "stealth", icon: "🍜", accent: "#dc2626",
		defaultName: "Steaming Ramen Bowl", paintable: false, pose: "sit", sfxType: "chomp",
		spec: { kind: "procedural", builder: "ramenBowl" }
	},
	{
		code: 76, id: "tow_truck", level: 47, category: "street", icon: "🔧", accent: "#eab308",
		defaultName: "Heavy Tow Truck", paintable: true, pose: "sit", sfxType: "airhorn",
		spec: { kind: "procedural", builder: "towTruck" }
	},
	{
		code: 77, id: "stealth_washer", level: 51, category: "stealth", icon: "🌀", accent: "#38bdf8",
		defaultName: "Spin-Cycle Washing Machine", paintable: false, pose: "none", hidePlayer: true, sfxType: "flush",
		spec: { kind: "procedural", builder: "stealthWasher" }
	},
	{
		code: 78, id: "camper_van", level: 53, category: "street", icon: "🚐", accent: "#14b8a6",
		defaultName: "Retro Surf Camper Van", paintable: true, pose: "sit", sfxType: "car_horn",
		spec: { kind: "procedural", builder: "camperVan" }
	},
	{
		code: 79, id: "corgi_ride", level: 56, category: "stealth", icon: "🐕", accent: "#f59e0b",
		defaultName: "Chonky Corgi Ride", paintable: false, pose: "sit", sfxType: "bark",
		spec: { kind: "procedural", builder: "corgiRide" }
	},
	{
		code: 80, id: "muscle_car", level: 58, category: "street", icon: "🔥", accent: "#dc2626",
		defaultName: "Classic V8 Muscle Car", paintable: true, pose: "sit", sfxType: "drift",
		spec: { kind: "procedural", builder: "muscleCar" }
	},
	{
		code: 81, id: "stealth_vending", level: 61, category: "stealth", icon: "🥤", accent: "#ef4444",
		defaultName: "Japanese Vending Machine", paintable: true, pose: "none", hidePlayer: true, sfxType: "vending",
		spec: { kind: "procedural", builder: "stealthVending" }
	},
	{
		code: 82, id: "double_bus", level: 63, category: "street", icon: "🚌", accent: "#dc2626",
		defaultName: "London Double-Decker Bus", paintable: true, pose: "sit", sfxType: "airhorn",
		spec: { kind: "procedural", builder: "doubleBus" }
	},
	{
		code: 83, id: "hamster_ball", level: 66, category: "stealth", icon: "🐹", accent: "#38bdf8",
		defaultName: "Giant Rolling Hamster Ball", paintable: true, pose: "stand", sfxType: "squeak",
		spec: { kind: "procedural", builder: "hamsterBall" }
	},
	{
		code: 84, id: "drift_jdm", level: 68, category: "street", icon: "⚡", accent: "#a855f7",
		defaultName: "Midnight Street Drift Tuner", paintable: true, pose: "sit", sfxType: "drift",
		spec: { kind: "procedural", builder: "driftJdm" }
	},
	{
		code: 85, id: "steamroller", level: 71, category: "street", icon: "⚠️", accent: "#eab308",
		defaultName: "Heavy Road Steamroller", paintable: false, pose: "sit", sfxType: "airhorn",
		spec: { kind: "procedural", builder: "steamroller" }
	},
	{
		code: 86, id: "stealth_arcade", level: 73, category: "stealth", icon: "🕹️", accent: "#8b5cf6",
		defaultName: "Retro Arcade Cabinet", paintable: true, pose: "none", hidePlayer: true, sfxType: "arcade",
		spec: { kind: "procedural", builder: "stealthArcade" }
	},
	{
		code: 87, id: "cement_mixer", level: 74, category: "street", icon: "🚧", accent: "#f97316",
		defaultName: "Spinning Cement Mixer", paintable: true, pose: "sit", sfxType: "airhorn",
		spec: { kind: "procedural", builder: "cementMixer" }
	},
	{
		code: 88, id: "gaming_chair", level: 77, category: "stealth", icon: "🎮", accent: "#ec4899",
		defaultName: "RGB Pro Gaming Throne", paintable: true, pose: "sit", sfxType: "arcade",
		spec: { kind: "procedural", builder: "gamingChair" }
	},
	{
		code: 89, id: "biplane", level: 78, category: "air", icon: "✈️", accent: "#dc2626",
		defaultName: "Stunt Red Baron Biplane", paintable: true, pose: "sit", sfxType: "propeller",
		spec: { kind: "procedural", builder: "biplane" }
	},
	{
		code: 90, id: "stretch_limo", level: 81, category: "street", icon: "🎩", accent: "#1e293b",
		defaultName: "VIP Stretch Limousine", paintable: true, pose: "sit", sfxType: "airhorn",
		spec: { kind: "procedural", builder: "stretchLimo" }
	},
	{
		code: 91, id: "giant_capybara", level: 82, category: "stealth", icon: "🍊", accent: "#b45309",
		defaultName: "Chill Yuzu Capybara", paintable: false, pose: "sit", sfxType: "capy",
		spec: { kind: "procedural", builder: "giantCapybara" }
	},
	{
		code: 92, id: "swat_van", level: 84, category: "street", icon: "🛡️", accent: "#1e3a8a",
		defaultName: "Armored Tactical Van", paintable: false, pose: "sit", sfxType: "siren",
		spec: { kind: "procedural", builder: "swatVan" }
	},
	{
		code: 93, id: "stealth_pillar", level: 86, category: "stealth", icon: "🏛️", accent: "#e2e8f0",
		defaultName: "Ancient Marble Pillar", paintable: false, pose: "none", hidePlayer: true, sfxType: "vine_boom",
		spec: { kind: "procedural", builder: "stealthPillar" }
	},
	{
		code: 94, id: "cyber_pickup", level: 88, category: "street", icon: "📐", accent: "#94a3b8",
		defaultName: "Low-Poly Cyber Pickup", paintable: true, pose: "sit", sfxType: "scifi",
		spec: { kind: "procedural", builder: "cyberPickup" }
	},
	{
		code: 95, id: "rocket_sled", level: 89, category: "air", icon: "🚀", accent: "#ef4444",
		defaultName: "Twin-Turbo Rocket Sled", paintable: true, pose: "sit", sfxType: "turbo",
		spec: { kind: "procedural", builder: "rocketSled" }
	},
	{
		code: 96, id: "formula_one", level: 91, category: "street", icon: "🏁", accent: "#dc2626",
		defaultName: "Grand Prix F1 Racer", paintable: true, pose: "sit", milestone: true, sfxType: "drift",
		spec: { kind: "procedural", builder: "formulaOne" }
	},
	{
		code: 97, id: "zeppelin", level: 93, category: "air", icon: "🎈", accent: "#d97706",
		defaultName: "Steampunk Sky Zeppelin", paintable: true, pose: "sit", sfxType: "propeller",
		spec: { kind: "procedural", builder: "zeppelin" }
	},
	{
		code: 98, id: "crescent_moon", level: 96, category: "air", icon: "🌙", accent: "#fde047",
		defaultName: "Dreamy Crescent Moon", paintable: false, pose: "sit", sfxType: "magic",
		spec: { kind: "procedural", builder: "crescentMoon" }
	},
	{
		code: 99, id: "royal_throne", level: 98, category: "stealth", icon: "👑", accent: "#facc15",
		defaultName: "Royal Golden Throne", paintable: true, pose: "sit", milestone: true, sfxType: "gong",
		spec: { kind: "procedural", builder: "royalThrone" }
	},
	{
		code: 100, id: "starfighter", level: 99, category: "air", icon: "⭐", accent: "#38bdf8",
		defaultName: "Orbital Starfighter", paintable: true, pose: "sit", milestone: true, sfxType: "scifi",
		spec: { kind: "procedural", builder: "starfighter" }
	},
	{
		code: 101, id: "uifi_frog", level: 50, category: "stealth", icon: "🐸", accent: "#f9a8d4",
		defaultName: "Ui-Fi Frog (Wi-Fi)", paintable: false, pose: "none", hidePlayer: true, milestone: true, sfxType: "uifi",
		spec: { kind: "procedural", builder: "uifiFrog" }
	}
];

const SPKMOD_VEHICLES_BY_ID = new Map(SPKMOD_VEHICLE_CATALOG.map(v => [v.id, v]));
const SPKMOD_VEHICLES_BY_CODE = new Map(SPKMOD_VEHICLE_CATALOG.map(v => [v.code, v]));

function spkmodVehicleIdToCode(idOrCode) {
	if (idOrCode === null || idOrCode === undefined || idOrCode === "" || idOrCode === "none" || idOrCode === "off") return 0;
	const key = String(idOrCode).trim().toLowerCase();
	const byId = SPKMOD_VEHICLES_BY_ID.get(key);
	if (byId) return byId.code;
	if (/^\d+$/.test(key)) {
		const n = Number(key);
		if (SPKMOD_VEHICLES_BY_CODE.has(n)) return n;
	}
	return 0;
}

function spkmodVehicleCodeToId(code) {
	const n = Number(code);
	if (!Number.isInteger(n) || n <= 0) return "none";
	const found = SPKMOD_VEHICLES_BY_CODE.get(n);
	return found ? found.id : null;
}

if (typeof window !== "undefined") {
	window.spkmodVehicleIdToCode = spkmodVehicleIdToCode;
	window.spkmodVehicleCodeToId = spkmodVehicleCodeToId;
}

// ============================================================================
// 1. PERSISTENT SETTINGS & FAVORITES
// ============================================================================
function spkmodLoadVehicleFavorites() {
	const set = new Set();
	try {
		if (typeof window !== "undefined" && window.localStorage) {
			const raw = localStorage.getItem(SPKMOD_VEHICLE_STORAGE_KEYS.favorites);
			if (raw) {
				const arr = JSON.parse(raw);
				if (Array.isArray(arr)) {
					for (const id of arr) {
						if (typeof id === "string" && SPKMOD_VEHICLES_BY_ID.has(id.trim())) {
							set.add(id.trim());
						}
					}
				}
			}
		}
	} catch (_) {}
	return set;
}

function spkmodSaveVehicleFavorites(favSet) {
	try {
		if (typeof window !== "undefined" && window.localStorage) {
			localStorage.setItem(SPKMOD_VEHICLE_STORAGE_KEYS.favorites, JSON.stringify([...favSet]));
		}
	} catch (_) {}
}

function spkmodClampVehicleColorIdx(idx) {
	const n = Number(idx);
	if (!Number.isFinite(n)) return 0;
	return ((Math.floor(n) % SPKMOD_VEHICLE_COLORS.length) + SPKMOD_VEHICLE_COLORS.length) % SPKMOD_VEHICLE_COLORS.length;
}

window.spkmodVehicleSettings = {
	enabled: (typeof window !== "undefined" && window.localStorage)
		? localStorage.getItem(SPKMOD_VEHICLE_STORAGE_KEYS.enabled) !== "false"
		: (window.spkmodCarSystemEnabled !== false),
	equippedId: (typeof window !== "undefined" && window.localStorage && localStorage.getItem(SPKMOD_VEHICLE_STORAGE_KEYS.equipped)) || null,
	lastEquippedId: (typeof window !== "undefined" && window.localStorage && (localStorage.getItem(SPKMOD_VEHICLE_STORAGE_KEYS.lastEquipped) || localStorage.getItem(SPKMOD_VEHICLE_STORAGE_KEYS.equipped))) || null,
	colorIdx: (typeof window !== "undefined" && window.localStorage && localStorage.getItem(SPKMOD_VEHICLE_STORAGE_KEYS.color) != null)
		? spkmodClampVehicleColorIdx(localStorage.getItem(SPKMOD_VEHICLE_STORAGE_KEYS.color))
		: 0,
	showRemoteVehicles: (typeof window !== "undefined" && window.localStorage)
		? localStorage.getItem(SPKMOD_VEHICLE_STORAGE_KEYS.showRemote) !== "false"
		: true,
	shareInChat: (typeof window !== "undefined" && window.localStorage)
		? localStorage.getItem(SPKMOD_VEHICLE_STORAGE_KEYS.shareInChat) !== "false"
		: true,
	favorites: spkmodLoadVehicleFavorites(),
	unlockAllTest: (typeof window !== "undefined" && window.localStorage)
		? localStorage.getItem(SPKMOD_VEHICLE_STORAGE_KEYS.unlockAll) === "true"
		: false
};
window.spkmodCarSystemEnabled = window.spkmodVehicleSettings.enabled !== false;
window.BurgerCarColorIdx = window.spkmodVehicleSettings.colorIdx;

function spkmodIsVehiclesSystemEnabled() {
	return window.spkmodVehicleSettings.enabled !== false && window.spkmodCarSystemEnabled !== false;
}

function spkmodIsVehicleChatSharingEnabled() {
	return spkmodIsVehiclesSystemEnabled() && window.spkmodVehicleSettings.shareInChat !== false;
}

function spkmodIsVehicleFavorite(vehicleId) {
	const favs = window.spkmodVehicleSettings?.favorites;
	return !!(favs && typeof favs.has === "function" && favs.has(vehicleId));
}

function spkmodToggleVehicleFavorite(vehicleId) {
	if (!vehicleId || !SPKMOD_VEHICLES_BY_ID.has(vehicleId)) return false;
	if (!(window.spkmodVehicleSettings.favorites instanceof Set)) {
		window.spkmodVehicleSettings.favorites = spkmodLoadVehicleFavorites();
	}
	const favs = window.spkmodVehicleSettings.favorites;
	const nowFav = !favs.has(vehicleId);
	if (nowFav) favs.add(vehicleId);
	else favs.delete(vehicleId);
	spkmodSaveVehicleFavorites(favs);
	return nowFav;
}

function spkmodGetVehiclePlayerLevel() {
	if (typeof gameState !== "undefined" && gameState?.myStat?.level) {
		return Number(gameState.myStat.level) || 1;
	}
	return 1;
}

function spkmodIsVehicleLegitimatelyUnlocked(vehicle) {
	if (!vehicle) return false;
	return spkmodGetVehiclePlayerLevel() >= (Number(vehicle.level) || 1);
}

function spkmodIsVehicleUnlocked(vehicle) {
	if (!vehicle) return false;
	if (window.spkmodVehicleSettings.unlockAllTest) return true;
	return spkmodGetVehiclePlayerLevel() >= (Number(vehicle.level) || 1);
}

function spkmodCheckVehicleRemoteLevelAllowed(requiredLevel, remoteLevel, senderName) {
	if (!requiredLevel || requiredLevel <= 1) return true;
	if (senderName && typeof spkmodIsVipUser === "function" && spkmodIsVipUser(senderName)) {
		return true;
	}
	const lvl = Number(remoteLevel);
	if (!isFinite(lvl) || lvl <= 0) return false;
	return lvl >= requiredLevel;
}

// ============================================================================
// 2. MULTI-LANGUAGE UI STRINGS (translations.json)
// ============================================================================
const SPKMOD_VEHICLE_UI_FALLBACK_EN = {
	vehiclesBtnTooltip: "Vehicles & Stealth Box Garage (Alt+V)",
	quickToggleOn: "{0} Vehicle: ON",
	quickToggleOff: "{0} Vehicle: OFF",
	quickToggleTooltip: "Quick Toggle {0} (Alt+X)",
	quickTogglePickTooltip: "Pick a vehicle in Garage (Alt+V / Alt+X)",
	modalTitle: "🚗 SpeakiMod+ Vehicles & Stealth Garage",
	myLevelLabel: "Your Level",
	unlockedLabel: "Unlocked",
	equippedLabel: "Active Vehicle",
	noneEquipped: "On Foot",
	paintColorLabel: "Paint Color",
	btnRandomColor: "🎲 Random",
	btnEquip: "Drive",
	btnEquipStealth: "Hide Inside",
	btnEquipped: "Active ✓",
	btnUnequip: "Exit Vehicle",
	btnLocked: "Locked (Lv.{0})",
	btnResync: "📡 Sync Map",
	btnHonk: "🎺 Horn / !? Emote (G)",
	searchPlaceholder: "Search vehicles by name, type, or level...",
	toggleRemote: "👁️ Show Others' Vehicles",
	toggleShareInChat: "📡 Share My Vehicle with Other Players",
	tabAll: "All",
	tabUnlocked: "Unlocked",
	tabFavorites: "⭐ Favorites",
	tabStreet: "🚗 Street",
	tabStealth: "📦 Stealth & Fun",
	tabAir: "🛸 Air & Sci-Fi",
	catStreet: "Street",
	catStealth: "Stealth & Fun",
	catAir: "Air & Sci-Fi",
	tagStealthHide: "Hides Player",
	tagPaintable: "Paintable",
	tagStanding: "Surf Pose",
	milestoneBadge: "★ MILESTONE",
	favAddTooltip: "Add to Favorites",
	favRemoveTooltip: "Remove from Favorites",
	favEmptyHint: "No favorite vehicles yet! Click ☆ on any vehicle card to pin it here.",
	hypeTitle: "Keep leveling up to expand your garage!",
	hypeDesc: "{0} more vehicles await up to Lv.100! Reach Lv.{1} to unlock your next ride!",
	equippedToast: "🚗 Riding {0} (Lv.{1})! Press G for synced Horn & ! / ? Emote!",
	equippedBoxToast: "📦 Hidden inside {0}! Move to sneak-waddle, press G for synced ! / ? Alert!",
	unequippedToast: "🚶 Exited vehicle.",
	lockedToast: "🔒 Requires Level {0} to drive {1}!",
	unknownVehicleToast: "❌ Unknown vehicle: {0}",
	colorSetToast: "🎨 Vehicle paint set to: {0}",
	broadcastToast: "📡 Broadcasted active vehicle to nearby mod players!",
	shareDisabledToast: "📡 Vehicle sharing is OFF. Enable 'Share My Vehicle' in the Garage to sync.",
	systemDisabledToast: "🚗 Vehicles System is disabled. Enable it in Settings (under Pets).",
	systemEnabledToast: "🚗 Vehicles display & sync enabled.",
	testUnlockEnabledToast: "🔓 [Vehicles Test] All vehicles UNLOCKED for testing!",
	testUnlockDisabledToast: "🔒 [Vehicles Test] Normal vehicle level requirements restored."
};

function spkmodGetVehicleActiveLang() {
	if (typeof spkmodGetActiveLang === "function") return spkmodGetActiveLang();
	const raw = (typeof spkmodLang !== "undefined" && spkmodLang) ? spkmodLang : "en";
	if (typeof spkmodTranslations !== "undefined" && spkmodTranslations[raw]) return raw;
	if (raw === "zh") return "zh-CN";
	if (raw === "es") return "es-419";
	return raw || "en";
}

function spkmodGetVehicleUiText(key, ...args) {
	const lang = spkmodGetVehicleActiveLang();
	const tr = typeof spkmodTranslations !== "undefined" ? spkmodTranslations : null;
	let str = (tr && tr[lang] && tr[lang].vehicleUi && tr[lang].vehicleUi[key])
		|| (tr && tr.en && tr.en.vehicleUi && tr.en.vehicleUi[key])
		|| SPKMOD_VEHICLE_UI_FALLBACK_EN[key]
		|| key;
	args.forEach((a, i) => {
		str = str.split(`{${i}}`).join(a);
	});
	return str;
}
window.spkmodGetVehicleUiText = spkmodGetVehicleUiText;

function spkmodGetVehicleDisplayName(vehicle) {
	if (!vehicle) return "";
	const lang = spkmodGetVehicleActiveLang();
	const tr = typeof spkmodTranslations !== "undefined" ? spkmodTranslations : null;
	return (tr && tr[lang] && tr[lang].vehicleNames && tr[lang].vehicleNames[vehicle.id])
		|| (tr && tr.en && tr.en.vehicleNames && tr.en.vehicleNames[vehicle.id])
		|| vehicle.defaultName
		|| vehicle.id;
}

function spkmodGetVehicleColorName(colorObj) {
	if (!colorObj) return "";
	const lang = spkmodGetVehicleActiveLang();
	const tr = typeof spkmodTranslations !== "undefined" ? spkmodTranslations : null;
	return (tr && tr[lang] && tr[lang].vehicleColors && tr[lang].vehicleColors[colorObj.id])
		|| (tr && tr.en && tr.en.vehicleColors && tr.en.vehicleColors[colorObj.id])
		|| colorObj.defaultName
		|| colorObj.id;
}

// ============================================================================
// 3. SYNTHESIZED SOUND EFFECTS & MGS ALERT AUDIO (G KEY / JUMP PACKET SYNC)
// ============================================================================
let _spkmodVehicleAudioCtx = null;
const SPKMOD_VEHICLE_REMOTE_SFX_MIN_DIST = 8;
const SPKMOD_VEHICLE_REMOTE_SFX_MAX_DIST = 25;
const SPKMOD_VEHICLE_REMOTE_SFX_GAIN_CAP = 0.75;
const SPKMOD_VEHICLE_EMOTE_COOLDOWN_MS = 1100;
const SPKMOD_VEHICLE_SELF_ECHO_DEDUPE_MS = 1500;

function spkmodComputeRemoteVehicleAudioGain(container) {
	if (!container || !container.position) return 0;
	let dist = Infinity;
	try {
		if (typeof gameState !== "undefined" && typeof gameState?.remoteSoundDistance === "function") {
			dist = gameState.remoteSoundDistance(container.position);
		} else if (typeof gameState !== "undefined" && gameState?.playerContainer?.position) {
			const myPos = gameState.playerContainer.position;
			dist = Math.hypot((container.position.x || 0) - (myPos.x || 0), (container.position.z || 0) - (myPos.z || 0));
		}
	} catch (_) {
		return 0;
	}
	if (!Number.isFinite(dist) || dist >= SPKMOD_VEHICLE_REMOTE_SFX_MAX_DIST) return 0;
	const norm = Math.max(0, Math.min(1, (SPKMOD_VEHICLE_REMOTE_SFX_MAX_DIST - dist) / (SPKMOD_VEHICLE_REMOTE_SFX_MAX_DIST - SPKMOD_VEHICLE_REMOTE_SFX_MIN_DIST)));
	return norm * SPKMOD_VEHICLE_REMOTE_SFX_GAIN_CAP;
}

function spkmodGetVehicleAudioCtx() {
	try {
		const Ctx = window.AudioContext || window.webkitAudioContext;
		if (!Ctx) return null;
		if (!_spkmodVehicleAudioCtx) _spkmodVehicleAudioCtx = new Ctx();
		if (_spkmodVehicleAudioCtx.state === "suspended") {
			_spkmodVehicleAudioCtx.resume().catch(() => {});
		}
		return _spkmodVehicleAudioCtx;
	} catch (_) {
		return null;
	}
}

function spkmodGetVehicleSfxVol() {
	if (typeof window.spkmodGetEffectiveSfxVolume === "function") {
		return window.spkmodGetEffectiveSfxVolume();
	}
	if (typeof isGameMuted === "function" && isGameMuted()) return 0;
	return 0.5;
}

function spkmodPlaySynthTone(ctx, type, startFreq, endFreq, startAt, duration, vol) {
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();
	osc.type = type;
	osc.frequency.setValueAtTime(Math.max(30, startFreq), startAt);
	if (endFreq !== startFreq) {
		osc.frequency.exponentialRampToValueAtTime(Math.max(30, endFreq), startAt + duration);
	}
	gain.gain.setValueAtTime(0.0001, startAt);
	gain.gain.linearRampToValueAtTime(vol, startAt + Math.min(0.018, duration * 0.2));
	gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
	osc.connect(gain);
	gain.connect(ctx.destination);
	osc.start(startAt);
	osc.stop(startAt + duration + 0.02);
}

function spkmodPlayVehicleSfx(vehicle, secondary = false, gainMultiplier = 1) {
	if (!vehicle) return;
	const gainScale = Number.isFinite(gainMultiplier) ? Math.max(0, Math.min(1, gainMultiplier)) : 1;
	if (gainScale <= 0.001) return;
	const vol = spkmodGetVehicleSfxVol();
	if (vol <= 0.001) return;

	if (vehicle.sfxType === "car_horn") {
		if (typeof spkmodPlayBurgerCarAudio === "function") {
			spkmodPlayBurgerCarAudio(
				secondary ? "/audio/sfx/burger_shop/carHornDouble.mp3" : "/audio/sfx/burger_shop/carHorn.mp3",
				gainScale
			);
			return;
		}
	}

	const ctx = spkmodGetVehicleAudioCtx();
	if (!ctx) return;
	const now = ctx.currentTime + 0.01;
	const v = Math.max(0.04, Math.min(0.28, vol * 0.32)) * gainScale;
	if (v <= 0.0015) return;

	try {
		switch (vehicle.sfxType) {
			case "mgs_alert":
				if (!secondary) {
					// Iconic dramatic stealth "!" alert brassy sting
					spkmodPlaySynthTone(ctx, "sawtooth", 880, 932, now, 0.14, v * 0.95);
					spkmodPlaySynthTone(ctx, "square", 1175, 1244, now, 0.14, v * 0.65);
					spkmodPlaySynthTone(ctx, "sawtooth", 1480, 1568, now + 0.05, 0.24, v * 0.90);
					spkmodPlaySynthTone(ctx, "triangle", 440, 392, now + 0.05, 0.26, v * 0.65);
				} else {
					// Curious "?" stealth guard notice chime
					spkmodPlaySynthTone(ctx, "sine", 520, 780, now, 0.15, v * 0.75);
					spkmodPlaySynthTone(ctx, "triangle", 780, 980, now + 0.12, 0.16, v * 0.55);
				}
				break;
			case "siren":
				spkmodPlaySynthTone(ctx, "sawtooth", 680, 1180, now, 0.22, v * 0.65);
				spkmodPlaySynthTone(ctx, "sawtooth", 1180, 680, now + 0.22, 0.22, v * 0.65);
				if (secondary) {
					spkmodPlaySynthTone(ctx, "sawtooth", 680, 1180, now + 0.44, 0.20, v * 0.6);
				}
				break;
			case "quack":
				spkmodPlaySynthTone(ctx, "sawtooth", 760, 480, now, 0.12, v * 0.7);
				if (secondary) spkmodPlaySynthTone(ctx, "sawtooth", 820, 500, now + 0.15, 0.12, v * 0.7);
				break;
			case "train":
				spkmodPlaySynthTone(ctx, "triangle", 392, 392, now, 0.36, v * 0.8);
				spkmodPlaySynthTone(ctx, "triangle", 494, 494, now, 0.36, v * 0.65);
				spkmodPlaySynthTone(ctx, "triangle", 587, 587, now, 0.36, v * 0.55);
				break;
			case "scifi":
				spkmodPlaySynthTone(ctx, "sine", secondary ? 920 : 420, secondary ? 320 : 1240, now, 0.28, v * 0.7);
				spkmodPlaySynthTone(ctx, "triangle", 280, 640, now + 0.06, 0.24, v * 0.45);
				break;
			case "magic":
				spkmodPlaySynthTone(ctx, "sine", 784, 1046, now, 0.16, v * 0.65);
				spkmodPlaySynthTone(ctx, "sine", 1046, 1568, now + 0.08, 0.24, v * 0.65);
				spkmodPlaySynthTone(ctx, "triangle", 1568, 2093, now + 0.15, 0.22, v * 0.45);
				break;
			case "cannon":
				spkmodPlaySynthTone(ctx, "sawtooth", 160, 42, now, 0.28, v * 1.1);
				spkmodPlaySynthTone(ctx, "square", 110, 35, now, 0.22, v * 0.8);
				break;
			case "boing":
				spkmodPlaySynthTone(ctx, "sine", 240, 620, now, 0.18, v * 0.75);
				spkmodPlaySynthTone(ctx, "sine", 620, 340, now + 0.15, 0.18, v * 0.6);
				break;
			case "bell":
				spkmodPlaySynthTone(ctx, "sine", 1320, 1320, now, 0.22, v * 0.7);
				spkmodPlaySynthTone(ctx, "sine", 1980, 1980, now + 0.06, 0.20, v * 0.55);
				break;
			case "turbo":
				spkmodPlaySynthTone(ctx, "sawtooth", 180, 560, now, 0.30, v * 0.7);
				break;
			case "vine_boom":
				// Deep dramatic sub-bass Moai vine boom!
				spkmodPlaySynthTone(ctx, "sine", 130, 34, now, 0.52, v * 1.4);
				spkmodPlaySynthTone(ctx, "triangle", 95, 28, now, 0.45, v * 1.1);
				break;
			case "flush":
				spkmodPlaySynthTone(ctx, "sawtooth", 440, 140, now, 0.45, v * 0.55);
				spkmodPlaySynthTone(ctx, "sine", 780, 220, now + 0.08, 0.40, v * 0.5);
				break;
			case "piano": {
				const notes = secondary ? [261.6, 311.1, 392.0, 523.3] : [261.6, 329.6, 392.0, 523.3];
				notes.forEach((f, idx) => spkmodPlaySynthTone(ctx, "triangle", f, f, now + idx * 0.045, 0.42, v * 0.65));
				break;
			}
			case "ice_cream": {
				const mel = [523, 659, 784, 659, 880];
				mel.forEach((f, idx) => spkmodPlaySynthTone(ctx, "sine", f, f, now + idx * 0.09, 0.12, v * 0.65));
				break;
			}
			case "ribbit":
				spkmodPlaySynthTone(ctx, "sawtooth", 210, 480, now, 0.11, v * 0.75);
				spkmodPlaySynthTone(ctx, "sawtooth", 230, 520, now + 0.14, 0.13, v * 0.75);
				break;
			case "uifi":
				// Cute mochi frog ribbit + sequential 1-2-3 Wi-Fi signal chime!
				spkmodPlaySynthTone(ctx, "triangle", 260, 540, now, 0.09, v * 0.75);
				spkmodPlaySynthTone(ctx, "sine", 660, 660, now + 0.09, 0.08, v * 0.55);
				spkmodPlaySynthTone(ctx, "sine", 880, 880, now + 0.17, 0.09, v * 0.60);
				if (!secondary) {
					spkmodPlaySynthTone(ctx, "sine", 1175, 1320, now + 0.25, 0.14, v * 0.68);
				} else {
					spkmodPlaySynthTone(ctx, "sine", 988, 784, now + 0.25, 0.14, v * 0.58);
				}
				break;
			case "jaws":
				spkmodPlaySynthTone(ctx, "sawtooth", 82, 82, now, 0.18, v * 0.95);
				spkmodPlaySynthTone(ctx, "sawtooth", 87, 87, now + 0.22, 0.22, v * 1.0);
				break;
			case "clang":
				spkmodPlaySynthTone(ctx, "square", 640, 290, now, 0.18, v * 0.75);
				spkmodPlaySynthTone(ctx, "triangle", 1180, 740, now, 0.24, v * 0.55);
				break;
			case "squeak":
				spkmodPlaySynthTone(ctx, "sine", 950, 1650, now, 0.10, v * 0.6);
				if (secondary) spkmodPlaySynthTone(ctx, "sine", 1450, 880, now + 0.11, 0.10, v * 0.6);
				break;
			case "heli":
				spkmodPlaySynthTone(ctx, "triangle", 140, 90, now, 0.10, v * 0.8);
				spkmodPlaySynthTone(ctx, "triangle", 140, 90, now + 0.12, 0.10, v * 0.8);
				spkmodPlaySynthTone(ctx, "triangle", 140, 90, now + 0.24, 0.10, v * 0.8);
				break;
			case "mech":
				spkmodPlaySynthTone(ctx, "sawtooth", 120, 48, now, 0.22, v * 1.0);
				spkmodPlaySynthTone(ctx, "sine", 880, 1320, now + 0.08, 0.16, v * 0.5);
				break;
			case "arcade": {
				const arp = secondary ? [988, 1319, 1568] : [523, 659, 784, 1046];
				arp.forEach((f, idx) => spkmodPlaySynthTone(ctx, "square", f, f, now + idx * 0.055, 0.075, v * 0.48));
				break;
			}
			case "chomp":
				spkmodPlaySynthTone(ctx, "sawtooth", 340, 110, now, 0.09, v * 0.72);
				spkmodPlaySynthTone(ctx, "sawtooth", 380, 120, now + 0.11, 0.09, v * 0.72);
				break;
			case "bark":
				spkmodPlaySynthTone(ctx, "sawtooth", 440, 260, now, 0.09, v * 0.75);
				if (secondary) spkmodPlaySynthTone(ctx, "sawtooth", 500, 280, now + 0.12, 0.10, v * 0.75);
				break;
			case "capy":
				spkmodPlaySynthTone(ctx, "sine", 392, 440, now, 0.14, v * 0.65);
				spkmodPlaySynthTone(ctx, "triangle", 587, 659, now + 0.10, 0.18, v * 0.55);
				break;
			case "gong":
				spkmodPlaySynthTone(ctx, "triangle", 196, 184, now, 0.58, v * 0.95);
				spkmodPlaySynthTone(ctx, "sine", 392, 370, now, 0.52, v * 0.65);
				spkmodPlaySynthTone(ctx, "sine", 587, 560, now + 0.03, 0.42, v * 0.42);
				break;
			case "propeller":
				for (let k = 0; k < 4; k++) {
					spkmodPlaySynthTone(ctx, "sawtooth", 110 + k * 14, 145 + k * 16, now + k * 0.07, 0.065, v * 0.65);
				}
				break;
			case "drift":
				spkmodPlaySynthTone(ctx, "sawtooth", 210, 620, now, 0.18, v * 0.75);
				spkmodPlaySynthTone(ctx, "triangle", 1320, 940, now + 0.14, 0.20, v * 0.45);
				break;
			case "vending":
				spkmodPlaySynthTone(ctx, "square", 1046, 1046, now, 0.06, v * 0.5);
				spkmodPlaySynthTone(ctx, "triangle", 180, 95, now + 0.10, 0.12, v * 0.85);
				spkmodPlaySynthTone(ctx, "triangle", 140, 75, now + 0.24, 0.10, v * 0.7);
				break;
			case "airhorn":
				spkmodPlaySynthTone(ctx, "sawtooth", 233, 233, now, 0.24, v * 0.8);
				spkmodPlaySynthTone(ctx, "sawtooth", 293.7, 293.7, now, 0.24, v * 0.65);
				if (secondary) {
					spkmodPlaySynthTone(ctx, "sawtooth", 233, 233, now + 0.28, 0.22, v * 0.8);
					spkmodPlaySynthTone(ctx, "sawtooth", 293.7, 293.7, now + 0.28, 0.22, v * 0.65);
				}
				break;
			case "scooter":
			default:
				spkmodPlaySynthTone(ctx, "square", 520, 540, now, 0.12, v * 0.55);
				if (secondary) spkmodPlaySynthTone(ctx, "square", 520, 540, now + 0.16, 0.12, v * 0.55);
				break;
		}
	} catch (_) {}
}

// ============================================================================
// 4. 3D ASSET LOADER & PROCEDURAL VEHICLE BUILDERS (INCLUDING MGS BOX)
// ============================================================================
const _spkmodVehicleGlbCache = new Map();
let _spkmodMgsBoxTextures = null;
let _spkmodUifiTextures = null;
const _spkmodAlertTextures = new Map(); // "!" | "?" -> CanvasTexture

async function spkmodLoadVehicleGlbScene(url, fallbackUrl) {
	if (!url) return null;
	const tryLoad = async (targetUrl) => {
		if (_spkmodVehicleGlbCache.has(targetUrl)) {
			return _spkmodVehicleGlbCache.get(targetUrl);
		}
		const p = (async () => {
			if (typeof spkmodLoadGlbScene === "function") {
				const gltf = await spkmodLoadGlbScene(targetUrl);
				if (gltf && gltf.scene) return gltf.scene;
			}
			if (typeof spkmodEnsureGLTFLoader !== "function") return null;
			const GLTFLoader = await spkmodEnsureGLTFLoader();
			if (!GLTFLoader) return null;
			const loader = new GLTFLoader();
			const meshopt = (typeof _spkmodMeshoptDecoder !== "undefined" && _spkmodMeshoptDecoder) || window.THREE?.MeshoptDecoder;
			if (meshopt) {
				if (meshopt.ready) await meshopt.ready;
				loader.setMeshoptDecoder(meshopt);
			}
			const gltf = await loader.loadAsync(targetUrl);
			return gltf?.scene || null;
		})().catch(() => {
			_spkmodVehicleGlbCache.delete(targetUrl);
			return null;
		});
		_spkmodVehicleGlbCache.set(targetUrl, p);
		return p;
	};
	const scene = await tryLoad(url);
	if (scene) return scene;
	if (fallbackUrl) return tryLoad(fallbackUrl);
	return null;
}

const _spkmodVehMatPool = new Map();
const SPKMOD_VEH_NOOP_RAYCAST = () => {};

function spkmodVehMat(THREE, color, extra = {}) {
	const hasCustomComplex = extra && (extra.map || extra.alphaMap || extra.gradientMap || extra.onBeforeCompile || extra.userData);
	if (!hasCustomComplex) {
		const isToon = !!THREE.MeshToonMaterial;
		const em = extra?.emissive ?? 0;
		const emI = extra?.emissiveIntensity ?? 1;
		const tr = extra?.transparent ? 1 : 0;
		const op = extra?.opacity ?? 1;
		const sd = extra?.side ?? 0;
		const dw = extra?.depthWrite === false ? 0 : 1;
		const wf = extra?.wireframe ? 1 : 0;
		const rg = extra?.roughness ?? (isToon ? 0 : 0.55);
		const mt = extra?.metalness ?? (isToon ? 0 : 0.1);
		const key = `${isToon ? 1 : 0}|${color}|${em}|${emI}|${tr}|${op}|${sd}|${dw}|${wf}|${rg}|${mt}`;
		const cached = _spkmodVehMatPool.get(key);
		if (cached) return cached;
		const mat = isToon
			? new THREE.MeshToonMaterial(Object.assign({ color }, extra))
			: new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.55, metalness: 0.1 }, extra));
		mat.userData = mat.userData || {};
		mat.userData.spkmodVehSharedMat = true;
		_spkmodVehMatPool.set(key, mat);
		return mat;
	}
	if (THREE.MeshToonMaterial) {
		return new THREE.MeshToonMaterial(Object.assign({ color }, extra));
	}
	return new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.55, metalness: 0.1 }, extra));
}

function spkmodDisposeVehicleObject(root) {
	if (!root) return;
	if (root.parent) {
		root.parent.remove(root);
	}
	if (typeof root.traverse !== "function") return;
	const disposedGeoms = new Set();
	const disposedMats = new Set();
	const disposedTex = new Set();
	root.traverse(c => {
		if (!c) return;
		const isSharedGlb = !!c.userData?.spkmodVehSharedGlb;
		if (!isSharedGlb && c.geometry && !c.isSprite && !disposedGeoms.has(c.geometry)) {
			disposedGeoms.add(c.geometry);
			try { c.geometry.dispose?.(); } catch (_) {}
		}
		if (c.material) {
			const mats = Array.isArray(c.material) ? c.material : [c.material];
			for (let i = 0; i < mats.length; i++) {
				const m = mats[i];
				if (!m || disposedMats.has(m)) continue;
				if (isSharedGlb && !m.userData?.spkmodVehOwnedMat) continue;
				if (m.userData?.spkmodVehSharedMat) continue;
				disposedMats.add(m);
				if (m.map && !m.map.userData?.spkmodVehSharedTex && !disposedTex.has(m.map)) {
					disposedTex.add(m.map);
					try { m.map.dispose?.(); } catch (_) {}
				}
				try { m.dispose?.(); } catch (_) {}
			}
		}
	});
}

function spkmodVehMergeStaticScope(THREE, scopeRoot, excludeSet) {
	if (!THREE || !scopeRoot || !THREE.BufferGeometry || !THREE.BufferAttribute || !THREE.Matrix3 || !THREE.Matrix4) return;
	if (typeof scopeRoot.updateMatrixWorld !== "function") return;
	const buckets = new Map(); // material -> Mesh[]
	const collect = (node) => {
		if (!node || !node.children) return;
		for (let i = 0; i < node.children.length; i++) {
			const c = node.children[i];
			if (!c || excludeSet.has(c)) continue;
			if (c.isMesh) {
				if (
					!c.isSkinnedMesh &&
					!c.isInstancedMesh &&
					!c.userData?.spkmodVehSharedGlb &&
					!c.userData?.spkmodVehNoMerge &&
					c.geometry &&
					c.geometry.attributes &&
					c.geometry.attributes.position &&
					c.geometry.attributes.normal &&
					(!c.geometry.morphAttributes || Object.keys(c.geometry.morphAttributes).length === 0) &&
					c.material &&
					!Array.isArray(c.material) &&
					!c.material.map
				) {
					let arr = buckets.get(c.material);
					if (!arr) { arr = []; buckets.set(c.material, arr); }
					arr.push(c);
				}
			}
			if (c.children && c.children.length > 0) collect(c);
		}
	};
	collect(scopeRoot);
	if (buckets.size === 0) return;

	scopeRoot.updateMatrixWorld(true);
	if (!scopeRoot.matrixWorld || typeof scopeRoot.matrixWorld.clone !== "function") return;
	const invRoot = scopeRoot.matrixWorld.clone().invert();
	const relMat = new THREE.Matrix4();
	const normMat = new THREE.Matrix3();
	const vPos = new THREE.Vector3();
	const vNorm = new THREE.Vector3();

	for (const [mat, meshes] of buckets) {
		if (meshes.length < 2) continue;
		let totalVerts = 0;
		const valid = [];
		for (let i = 0; i < meshes.length; i++) {
			const m = meshes[i];
			const g = m.geometry;
			const idx = g.index;
			const count = idx ? idx.count : g.attributes.position.count;
			if (count >= 3 && count % 3 === 0) {
				totalVerts += count;
				valid.push(m);
			}
		}
		if (valid.length < 2 || totalVerts < 3) continue;

		const positions = new Float32Array(totalVerts * 3);
		const normals = new Float32Array(totalVerts * 3);
		let writeOff = 0;
		const mergedFrom = [];

		for (let i = 0; i < valid.length; i++) {
			const m = valid[i];
			relMat.multiplyMatrices(invRoot, m.matrixWorld);
			const det = relMat.determinant();
			if (!Number.isFinite(det) || Math.abs(det) < 1e-10) continue;
			const flipWinding = det < 0;
			normMat.getNormalMatrix(relMat);

			const g = m.geometry;
			const posAttr = g.attributes.position;
			const normAttr = g.attributes.normal;
			const idx = g.index;
			const count = idx ? idx.count : posAttr.count;

			for (let t = 0; t < count; t += 3) {
				const i0 = idx ? idx.getX(t) : t;
				const i1 = idx ? idx.getX(flipWinding ? t + 2 : t + 1) : (flipWinding ? t + 2 : t + 1);
				const i2 = idx ? idx.getX(flipWinding ? t + 1 : t + 2) : (flipWinding ? t + 1 : t + 2);
				for (let k = 0; k < 3; k++) {
					const vi = k === 0 ? i0 : (k === 1 ? i1 : i2);
					vPos.set(posAttr.getX(vi), posAttr.getY(vi), posAttr.getZ(vi)).applyMatrix4(relMat);
					vNorm.set(normAttr.getX(vi), normAttr.getY(vi), normAttr.getZ(vi)).applyMatrix3(normMat).normalize();
					positions[writeOff] = vPos.x;
					positions[writeOff + 1] = vPos.y;
					positions[writeOff + 2] = vPos.z;
					normals[writeOff] = vNorm.x;
					normals[writeOff + 1] = vNorm.y;
					normals[writeOff + 2] = vNorm.z;
					writeOff += 3;
				}
			}
			mergedFrom.push(m);
		}
		if (mergedFrom.length < 2 || writeOff < 9) continue;

		const finalPos = writeOff === positions.length ? positions : positions.subarray(0, writeOff);
		const finalNorm = writeOff === normals.length ? normals : normals.subarray(0, writeOff);
		const mergedGeom = new THREE.BufferGeometry();
		mergedGeom.setAttribute("position", new THREE.BufferAttribute(finalPos, 3));
		mergedGeom.setAttribute("normal", new THREE.BufferAttribute(finalNorm, 3));
		mergedGeom.computeBoundingSphere();

		const mergedMesh = new THREE.Mesh(mergedGeom, mat);
		mergedMesh.name = "spkmod_veh_merged";
		mergedMesh.raycast = SPKMOD_VEH_NOOP_RAYCAST;
		mergedMesh.frustumCulled = true;
		scopeRoot.add(mergedMesh);

		for (let i = 0; i < mergedFrom.length; i++) {
			const m = mergedFrom[i];
			if (m.parent) m.parent.remove(m);
			try { m.geometry?.dispose?.(); } catch (_) {}
		}
	}

	const prune = (node) => {
		if (!node || !node.children) return;
		for (let i = node.children.length - 1; i >= 0; i--) {
			const c = node.children[i];
			if (!c || c.isMesh || excludeSet.has(c)) continue;
			prune(c);
			if (c.children && c.children.length === 0) {
				node.remove(c);
			}
		}
	};
	prune(scopeRoot);
}

function spkmodVehOptimizeBuilt(THREE, built) {
	if (!THREE || !built || !built.root) return built;
	try {
		const excludeSet = new Set();
		if (built.leftFoot) excludeSet.add(built.leftFoot);
		if (built.rightFoot) excludeSet.add(built.rightFoot);
		if (built.alertSprite) excludeSet.add(built.alertSprite);
		if (Array.isArray(built.wheels)) {
			for (let i = 0; i < built.wheels.length; i++) {
				if (built.wheels[i]) excludeSet.add(built.wheels[i]);
			}
		}
		if (Array.isArray(built.animParts)) {
			for (let i = 0; i < built.animParts.length; i++) {
				const p = built.animParts[i];
				if (!p) continue;
				if (p.node && p.node !== built.bodyGroup) excludeSet.add(p.node);
				if (p.red) excludeSet.add(p.red);
				if (p.blue) excludeSet.add(p.blue);
				if (Array.isArray(p.tiers)) {
					for (let ti = 0; ti < p.tiers.length; ti++) {
						const tierNodes = p.tiers[ti];
						if (Array.isArray(tierNodes)) {
							for (let ni = 0; ni < tierNodes.length; ni++) {
								if (tierNodes[ni]) excludeSet.add(tierNodes[ni]);
							}
						}
					}
				}
			}
		}
		if (built.bodyGroup) {
			spkmodVehMergeStaticScope(THREE, built.bodyGroup, excludeSet);
		}
		if (Array.isArray(built.wheels)) {
			for (let i = 0; i < built.wheels.length; i++) {
				const w = built.wheels[i];
				if (w && !w.isMesh) {
					spkmodVehMergeStaticScope(THREE, w, excludeSet);
				}
			}
		}
	} catch (_) {}
	return built;
}

function spkmodGetMgsBoxTextures(THREE) {
	if (_spkmodMgsBoxTextures) return _spkmodMgsBoxTextures;
	if (typeof document === "undefined") return null;

	const makeKraftBase = (ctx, w, h) => {
		const grad = ctx.createLinearGradient(0, 0, 0, h);
		grad.addColorStop(0, "#cfa26b");
		grad.addColorStop(0.5, "#bd8d56");
		grad.addColorStop(1, "#a47440");
		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, w, h);

		// Corrugated vertical cardboard grain lines
		ctx.fillStyle = "rgba(92, 58, 24, 0.075)";
		for (let x = 0; x < w; x += 6) {
			ctx.fillRect(x, 0, 2, h);
		}
		// Subtle paper speckles
		for (let i = 0; i < 420; i++) {
			const sx = (i * 73) % w;
			const sy = (i * 137) % h;
			ctx.fillStyle = (i % 2 === 0) ? "rgba(74,46,18,0.12)" : "rgba(255,235,200,0.08)";
			ctx.fillRect(sx, sy, 3, 2);
		}
		// Edge border shadow
		ctx.strokeStyle = "rgba(72, 42, 16, 0.42)";
		ctx.lineWidth = 10;
		ctx.strokeRect(5, 5, w - 10, h - 10);
	};

	// Side / Front stencil face
	const sideCanvas = document.createElement("canvas");
	sideCanvas.width = 512;
	sideCanvas.height = 512;
	const sCtx = sideCanvas.getContext("2d");
	makeKraftBase(sCtx, 512, 512);

	// Top packing tape overhang
	sCtx.fillStyle = "rgba(222, 192, 144, 0.72)";
	sCtx.fillRect(0, 0, 512, 34);
	sCtx.fillStyle = "rgba(110, 72, 32, 0.25)";
	sCtx.fillRect(0, 34, 512, 3);

	// Classic MGS stencil print ("THE HOBAGI" + "SPEAKI GEAR")
	sCtx.fillStyle = "#2b1c10";
	sCtx.strokeStyle = "#2b1c10";
	sCtx.textAlign = "center";

	sCtx.font = "900 32px Impact, Arial Black, sans-serif";
	sCtx.fillText("SPEAKI GEAR SOLID", 256, 98);

	// Thick rectangular orange-box frame
	sCtx.lineWidth = 7;
	sCtx.strokeRect(46, 126, 420, 142);
	sCtx.fillStyle = "#c2410c";
	sCtx.fillRect(58, 138, 396, 118);
	sCtx.fillStyle = "#fff7ed";
	sCtx.font = "900 58px Impact, Arial Black, sans-serif";
	sCtx.fillText("THE HOBAGI", 256, 214);
	sCtx.font = "bold 19px monospace";
	sCtx.fillText("MONATIUM FRESH — GRADE A+", 256, 245);

	// Caution & handling stencil strip
	sCtx.fillStyle = "#2b1c10";
	sCtx.font = "900 22px Arial Black, sans-serif";
	sCtx.fillText("⚠ HANDLE WITH CARE  ↑ THIS SIDE UP ↑", 256, 326);

	// Little stencil handling boxes (fragile / umbrella / no-peek)
	sCtx.lineWidth = 4;
	sCtx.strokeRect(64, 354, 72, 72);
	sCtx.strokeRect(152, 354, 72, 72);
	sCtx.strokeRect(240, 354, 72, 72);
	sCtx.font = "900 42px Arial, sans-serif";
	sCtx.fillText("↑↑", 100, 405);
	sCtx.fillText("!", 188, 405);
	sCtx.fillText("☂", 276, 405);

	// Barcode on bottom right
	let bx = 338;
	const bars = [4, 2, 6, 2, 3, 5, 2, 4, 2, 7, 3, 2, 5, 2, 4, 3];
	for (let i = 0; i < bars.length; i++) {
		if (i % 2 === 0) sCtx.fillRect(bx, 358, bars[i], 54);
		bx += bars[i] + 3;
	}
	sCtx.font = "bold 15px monospace";
	sCtx.fillText("BOX-00140.85", 398, 430);

	// Top face with center folded flap seam & packing tape
	const topCanvas = document.createElement("canvas");
	topCanvas.width = 512;
	topCanvas.height = 512;
	const tCtx = topCanvas.getContext("2d");
	makeKraftBase(tCtx, 512, 512);
	// Center seam line
	tCtx.fillStyle = "rgba(45, 26, 10, 0.65)";
	tCtx.fillRect(0, 252, 512, 8);
	// Translucent tan packing tape across the center seam
	tCtx.fillStyle = "rgba(232, 204, 155, 0.72)";
	tCtx.fillRect(0, 212, 512, 88);
	tCtx.strokeStyle = "rgba(145, 106, 56, 0.45)";
	tCtx.lineWidth = 3;
	tCtx.strokeRect(0, 212, 512, 88);
	// Tape specular streak
	tCtx.fillStyle = "rgba(255, 248, 232, 0.24)";
	tCtx.fillRect(0, 224, 512, 16);

	const sideTex = new THREE.CanvasTexture(sideCanvas);
	const topTex = new THREE.CanvasTexture(topCanvas);
	if (THREE.SRGBColorSpace) {
		sideTex.colorSpace = THREE.SRGBColorSpace;
		topTex.colorSpace = THREE.SRGBColorSpace;
	}
	sideTex.userData = Object.assign(sideTex.userData || {}, { spkmodVehSharedTex: true });
	topTex.userData = Object.assign(topTex.userData || {}, { spkmodVehSharedTex: true });
	sideTex.needsUpdate = true;
	topTex.needsUpdate = true;
	_spkmodMgsBoxTextures = { sideTex, topTex };
	return _spkmodMgsBoxTextures;
}

function spkmodGetAlertSpriteTexture(THREE, symbol) {
	const key = symbol === "?" ? "?" : "!";
	if (_spkmodAlertTextures.has(key)) return _spkmodAlertTextures.get(key);
	if (typeof document === "undefined") return null;

	const c = document.createElement("canvas");
	c.width = 192;
	c.height = 192;
	const ctx = c.getContext("2d");
	ctx.clearRect(0, 0, 192, 192);

	// Dramatic radial glow
	const glow = ctx.createRadialGradient(96, 96, 12, 96, 96, 86);
	if (key === "!") {
		glow.addColorStop(0, "rgba(254, 202, 202, 0.95)");
		glow.addColorStop(0.45, "rgba(239, 68, 68, 0.65)");
		glow.addColorStop(1, "rgba(239, 68, 68, 0)");
	} else {
		glow.addColorStop(0, "rgba(254, 249, 195, 0.95)");
		glow.addColorStop(0.45, "rgba(234, 179, 8, 0.6)");
		glow.addColorStop(1, "rgba(234, 179, 8, 0)");
	}
	ctx.fillStyle = glow;
	ctx.fillRect(0, 0, 192, 192);

	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = "900 132px Impact, Arial Black, sans-serif";
	ctx.lineWidth = 14;
	ctx.strokeStyle = "#111827";
	ctx.strokeText(key, 96, 102);
	ctx.fillStyle = key === "!" ? "#ef4444" : "#facc15";
	ctx.fillText(key, 96, 102);

	const tex = new THREE.CanvasTexture(c);
	if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
	tex.userData = Object.assign(tex.userData || {}, { spkmodVehSharedTex: true });
	tex.needsUpdate = true;
	_spkmodAlertTextures.set(key, tex);
	return tex;
}

function spkmodGetUifiTextures(THREE) {
	if (_spkmodUifiTextures) return _spkmodUifiTextures;
	if (typeof document === "undefined" || !THREE || typeof THREE.CanvasTexture !== "function") return null;

	const makeTex = (w, h, drawFn) => {
		const c = document.createElement("canvas");
		c.width = w;
		c.height = h;
		const ctx = c.getContext("2d");
		if (ctx) {
			ctx.clearRect(0, 0, w, h);
			drawFn(ctx, w, h);
		}
		const tex = new THREE.CanvasTexture(c);
		if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
		tex.userData = Object.assign(tex.userData || {}, { spkmodVehSharedTex: true });
		tex.needsUpdate = true;
		return tex;
	};

	// 1. Glossy soft emerald-green Trickcal Ui frog eye with delicate dark-brown rim & cute anime highlights
	const eyeTex = makeTex(256, 256, (ctx) => {
		ctx.save();
		ctx.beginPath();
		ctx.arc(128, 128, 116, 0, Math.PI * 2);
		const irisGrad = ctx.createRadialGradient(128, 166, 16, 128, 122, 118);
		irisGrad.addColorStop(0, "#e2f9a8");
		irisGrad.addColorStop(0.45, "#92ce55");
		irisGrad.addColorStop(0.82, "#578f3e");
		irisGrad.addColorStop(1, "#38632b");
		ctx.fillStyle = irisGrad;
		ctx.fill();

		// Soft pastel yellow-green lower sparkle crescent (matches 3D sculpt & original drawing!)
		ctx.beginPath();
		ctx.ellipse(128, 174, 72, 40, 0, 0, Math.PI * 2);
		ctx.fillStyle = "rgba(238, 252, 200, 0.78)";
		ctx.fill();

		// Soft glossy anime highlights (upper-left, upper-right, lower-center reflection)
		ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
		ctx.beginPath();
		ctx.ellipse(92, 92, 26, 23, -0.3, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.ellipse(166, 94, 15, 14, 0.25, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.ellipse(126, 158, 15, 21, 0, 0, Math.PI * 2);
		ctx.fill();

		// Delicate crisp dark-brown chibi rim (thin & clean — never thick creepy goggles!)
		ctx.beginPath();
		ctx.arc(128, 128, 116, 0, Math.PI * 2);
		ctx.lineWidth = 11;
		ctx.strokeStyle = "#362520";
		ctx.stroke();
		ctx.restore();
	});

	// 2. Full seamless 1024x512 equirectangular skin texture mapped precisely onto the SDF-sculpted Ui-Fi Frog mesh
	// (u=0.50 is exact front +Z, u=0/1 seam is hidden at exact back -Z, zero floating decals & zero clipping!)
	const skinTex = makeTex(1024, 512, (ctx) => {
		ctx.save();
		// Base warm creamy peach-white mochi skin (matches original Trickcal Ui-Fi drawing)
		ctx.fillStyle = "#fdeee6";
		ctx.fillRect(0, 0, 1024, 512);

		const canTransform = typeof ctx.translate === "function" && typeof ctx.scale === "function";

		// Subtle soft warm-taupe brow crown shading above each rounded eye dome (original drawing detail!)
		for (const s of [-1, 1]) {
			const bx = 512 + s * 108;
			const by = 118;
			ctx.save();
			if (canTransform) {
				ctx.translate(bx, by);
				ctx.scale(1.15, 0.60);
				const browShade = ctx.createRadialGradient(0, 0, 6, 0, 0, 56);
				browShade.addColorStop(0, "rgba(116, 86, 78, 0.16)");
				browShade.addColorStop(0.6, "rgba(126, 96, 86, 0.06)");
				browShade.addColorStop(1, "rgba(126, 96, 86, 0)");
				ctx.fillStyle = browShade;
				ctx.beginPath();
				ctx.arc(0, 0, 56, 0, Math.PI * 2);
				ctx.fill();
			} else {
				const browShade = ctx.createRadialGradient(bx, by, 6, bx, by, 56);
				browShade.addColorStop(0, "rgba(116, 86, 78, 0.16)");
				browShade.addColorStop(1, "rgba(126, 96, 86, 0)");
				ctx.fillStyle = browShade;
				ctx.beginPath();
				ctx.ellipse(bx, by, 64, 34, 0, 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.restore();
		}

		// Subtle soft peach mochi spots on the round back (-Z near u=0.06 and u=0.94)
		for (const sp of [{ x: 64, y: 196, r: 42 }, { x: 960, y: 214, r: 36 }]) {
			const spotGrad = ctx.createRadialGradient(sp.x, sp.y, 4, sp.x, sp.y, sp.r);
			spotGrad.addColorStop(0, "rgba(235, 198, 182, 0.48)");
			spotGrad.addColorStop(1, "rgba(235, 198, 182, 0)");
			ctx.fillStyle = spotGrad;
			ctx.beginPath();
			ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
			ctx.fill();
		}

		// Big, fat, ROUND front-facing rosy cheek blushes + mirrored soft "@" swirls calibrated to exact SDF cheek UVs!
		for (const s of [-1, 1]) {
			const cx = 512 + s * 124;
			const cy = 268;
			const rx = 58;
			const ry = 54;

			ctx.save();
			if (canTransform) {
				ctx.translate(cx, cy);
				ctx.scale(rx / 100, ry / 100);
				const blush = ctx.createRadialGradient(0, 0, 14, 0, 0, 102);
				blush.addColorStop(0, "rgba(244, 148, 154, 0.88)");
				blush.addColorStop(0.66, "rgba(246, 162, 168, 0.72)");
				blush.addColorStop(1, "rgba(246, 162, 168, 0)");
				ctx.fillStyle = blush;
				ctx.beginPath();
				ctx.arc(0, 0, 104, 0, Math.PI * 2);
				ctx.fill();
			} else {
				const blush = ctx.createRadialGradient(cx, cy, 10, cx, cy, rx);
				blush.addColorStop(0, "rgba(244, 148, 154, 0.88)");
				blush.addColorStop(1, "rgba(246, 162, 168, 0)");
				ctx.fillStyle = blush;
				ctx.beginPath();
				ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.restore();

			// Loose, soft round mirrored "@" swirl centered cleanly on each plump front cheek!
			ctx.beginPath();
			const turns = 1.85;
			const steps = 88;
			for (let i = 0; i <= steps; i++) {
				const t = (i / steps) * Math.PI * 2 * turns;
				const r = 4.5 + (i / steps) * 35;
				const px = cx + (s === 1 ? -1 : 1) * Math.cos(t) * r * 1.05;
				const py = cy + Math.sin(t) * r * 0.96;
				if (i === 0) ctx.moveTo(px, py);
				else ctx.lineTo(px, py);
			}
			ctx.lineWidth = 5.4;
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			ctx.strokeStyle = "rgba(202, 96, 110, 0.78)";
			ctx.stroke();
		}

		// Sweet, gentle wavy ":3" frog smile sitting cleanly between the lower inner eyes & round cheeks!
		ctx.beginPath();
		ctx.moveTo(458, 224);
		ctx.quadraticCurveTo(485, 241, 512, 226);
		ctx.quadraticCurveTo(539, 241, 566, 224);
		ctx.lineWidth = 7.2;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.strokeStyle = "#4d312e";
		ctx.stroke();

		ctx.restore();
	});

	_spkmodUifiTextures = { eyeTex, skinTex };
	return _spkmodUifiTextures;
}

function spkmodAddWheelPair(THREE, parent, xHalf, y, z, radius, width, tireMat, rimMat, wheelsOut) {
	const makeWheel = (side) => {
		const grp = new THREE.Group();
		grp.position.set(side * xHalf, y, z);
		const tire = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, width, 16), tireMat);
		tire.rotation.z = Math.PI / 2;
		grp.add(tire);
		const rim = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.56, radius * 0.56, width + 0.02, 12), rimMat);
		rim.rotation.z = Math.PI / 2;
		grp.add(rim);
		// Spoke bar so wheel rotation is super visible while driving
		const spoke = new THREE.Mesh(new THREE.BoxGeometry(width + 0.03, radius * 0.95, radius * 0.16), tireMat);
		grp.add(spoke);
		parent.add(grp);
		wheelsOut.push(grp);
	};
	makeWheel(-1);
	makeWheel(1);
}

function spkmodBuildProceduralVehicle(THREE, builderName, colorHex) {
	const root = new THREE.Group();
	const bodyGroup = new THREE.Group();
	root.add(bodyGroup);

	const wheels = [];
	const animParts = [];
	const tireMat = spkmodVehMat(THREE, 0x1e293b);
	const rimMat = spkmodVehMat(THREE, 0xe2e8f0);
	const paintMat = spkmodVehMat(THREE, colorHex);
	const chromeMat = spkmodVehMat(THREE, 0xcbd5e1);
	const glassMat = spkmodVehMat(THREE, 0x38bdf8, { transparent: true, opacity: 0.62 });
	const darkMat = spkmodVehMat(THREE, 0x111827);
	const headLightMat = spkmodVehMat(THREE, 0xfef08a, { emissive: 0xfacc15, emissiveIntensity: 0.7 });
	const tailLightMat = spkmodVehMat(THREE, 0xf87171, { emissive: 0xef4444, emissiveIntensity: 0.65 });

	let seatOffsetY = 0.85;
	let wheelRadius = 0.30;
	let hoverY = 0;
	let hoverAmp = 0;
	let extra = {};

	if (builderName === "mgsBox") {
		const tex = spkmodGetMgsBoxTextures(THREE);
		const sideMat = tex
			? new THREE.MeshStandardMaterial({ map: tex.sideTex, roughness: 0.88, metalness: 0.02 })
			: spkmodVehMat(THREE, 0xc49a6c);
		const topMat = tex
			? new THREE.MeshStandardMaterial({ map: tex.topTex, roughness: 0.85, metalness: 0.02 })
			: spkmodVehMat(THREE, 0xcba171);
		const innerDarkMat = new THREE.MeshBasicMaterial({ color: 0x26180d, side: THREE.DoubleSide });

		// 6-face textured corrugated cardboard box (slightly taller & wider than Speaki to hide completely!)
		const boxW = 1.18;
		const boxH = 1.24;
		const boxD = 1.18;
		const boxMesh = new THREE.Mesh(
			new THREE.BoxGeometry(boxW, boxH, boxD),
			[sideMat, sideMat, topMat, innerDarkMat, sideMat, sideMat]
		);
		boxMesh.position.y = boxH * 0.5;
		bodyGroup.add(boxMesh);

		// Subtle slightly-lifted top cardboard flap edges for authentic silhouette
		const flapMat = spkmodVehMat(THREE, 0xb88650);
		const flapL = new THREE.Mesh(new THREE.BoxGeometry(boxW * 0.49, 0.024, boxD + 0.015), flapMat);
		flapL.position.set(-boxW * 0.25, boxH + 0.012, 0);
		flapL.rotation.z = 0.03;
		bodyGroup.add(flapL);
		const flapR = new THREE.Mesh(new THREE.BoxGeometry(boxW * 0.49, 0.024, boxD + 0.015), flapMat);
		flapR.position.set(boxW * 0.25, boxH + 0.012, 0);
		flapR.rotation.z = -0.03;
		bodyGroup.add(flapR);

		// Tiny stealth feet underneath the box — only visible while sneak-waddling!
		const shoeMat = spkmodVehMat(THREE, 0x3b2a22);
		const leftFoot = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), shoeMat);
		leftFoot.scale.set(0.95, 0.65, 1.35);
		leftFoot.position.set(-0.22, 0.08, 0.08);
		leftFoot.visible = false;
		root.add(leftFoot);

		const rightFoot = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), shoeMat);
		rightFoot.scale.set(0.95, 0.65, 1.35);
		rightFoot.position.set(0.22, 0.08, -0.08);
		rightFoot.visible = false;
		root.add(rightFoot);

		// Alert sprite ("!" / "?") above the box triggered by G
		const alertTex = spkmodGetAlertSpriteTexture(THREE, "!");
		const alertMat = new THREE.SpriteMaterial({ map: alertTex, transparent: true, depthTest: false, depthWrite: false });
		const alertSprite = new THREE.Sprite(alertMat);
		alertSprite.name = "spkmod_vehicle_alert_sprite";
		alertSprite.userData = Object.assign(alertSprite.userData || {}, { spkmodVehicleAlert: true, spkmodSkipNametagClear: true });
		alertSprite.renderOrder = 999;
		alertSprite.position.set(0, 1.92, 0);
		alertSprite.scale.set(0.75, 0.75, 1);
		alertSprite.visible = false;
		root.add(alertSprite);

		seatOffsetY = 0;
		extra = { isMgsBox: true, leftFoot, rightFoot, alertSprite };
	} else if (builderName === "shoppingCart") {
		// Chrome supermarket basket + colored handle & corner bumpers + 4 caster wheels
		const baseFrame = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.08, 1.24), chromeMat);
		baseFrame.position.set(0, 0.22, 0);
		bodyGroup.add(baseFrame);

		// Wire basket cage (semi-transparent metallic sides + solid chrome rails)
		const cageMat = spkmodVehMat(THREE, 0xe2e8f0, { wireframe: true });
		const cage = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.68, 1.18, 5, 4, 6), cageMat);
		cage.position.set(0, 0.68, 0.06);
		bodyGroup.add(cage);

		// Bottom basket floor
		const basketFloor = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.05, 1.14), chromeMat);
		basketFloor.position.set(0, 0.35, 0.06);
		bodyGroup.add(basketFloor);

		// Top colored rim + push handle bar
		const rimFront = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.07, 0.07), paintMat);
		rimFront.position.set(0, 1.02, 0.65);
		bodyGroup.add(rimFront);
		const handleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.96, 12), paintMat);
		handleBar.rotation.z = Math.PI / 2;
		handleBar.position.set(0, 1.18, -0.64);
		bodyGroup.add(handleBar);
		for (const sx of [-0.44, 0.44]) {
			const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.96, 8), chromeMat);
			arm.position.set(sx, 0.72, -0.58);
			arm.rotation.x = -0.18;
			bodyGroup.add(arm);
		}
		wheelRadius = 0.14;
		spkmodAddWheelPair(THREE, bodyGroup, 0.38, 0.14, 0.48, wheelRadius, 0.09, tireMat, paintMat, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.38, 0.14, -0.48, wheelRadius, 0.09, tireMat, paintMat, wheels);
		seatOffsetY = 0.56;
	} else if (builderName === "scooter") {
		// Retro Vespa-style scooter
		const floorboard = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.10, 1.16), darkMat);
		floorboard.position.set(0, 0.32, 0);
		bodyGroup.add(floorboard);

		const rearBody = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.46, 0.86), paintMat);
		rearBody.position.set(0, 0.58, -0.34);
		bodyGroup.add(rearBody);

		const seat = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.16, 0.68), spkmodVehMat(THREE, 0x7c2d12));
		seat.position.set(0, 0.86, -0.24);
		bodyGroup.add(seat);

		const frontShield = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.82, 0.20), paintMat);
		frontShield.position.set(0, 0.72, 0.52);
		frontShield.rotation.x = -0.22;
		bodyGroup.add(frontShield);

		const handleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.88, 10), chromeMat);
		handleBar.rotation.z = Math.PI / 2;
		handleBar.position.set(0, 1.14, 0.42);
		bodyGroup.add(handleBar);

		const headLight = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 10), headLightMat);
		headLight.position.set(0, 1.06, 0.58);
		bodyGroup.add(headLight);

		const tailLight = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.10, 0.06), tailLightMat);
		tailLight.position.set(0, 0.66, -0.78);
		bodyGroup.add(tailLight);

		// 2 inline wheels (front + rear)
		wheelRadius = 0.26;
		const makeCenterWheel = (zPos) => {
			const g = new THREE.Group();
			g.position.set(0, wheelRadius, zPos);
			const t = new THREE.Mesh(new THREE.CylinderGeometry(wheelRadius, wheelRadius, 0.16, 16), tireMat);
			t.rotation.z = Math.PI / 2;
			g.add(t);
			const r = new THREE.Mesh(new THREE.CylinderGeometry(wheelRadius * 0.55, wheelRadius * 0.55, 0.18, 12), rimMat);
			r.rotation.z = Math.PI / 2;
			g.add(r);
			bodyGroup.add(g);
			wheels.push(g);
		};
		makeCenterWheel(0.68);
		makeCenterWheel(-0.56);
		seatOffsetY = 0.94;
	} else if (builderName === "duckFloatie") {
		const yellowMat = spkmodVehMat(THREE, 0xfacc15);
		const beakMat = spkmodVehMat(THREE, 0xf97316);
		const ring = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.28, 14, 24), yellowMat);
		ring.rotation.x = Math.PI / 2;
		ring.position.set(0, 0.34, 0);
		bodyGroup.add(ring);

		const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.25, 0.42, 12), yellowMat);
		neck.position.set(0, 0.64, 0.66);
		neck.rotation.x = 0.15;
		bodyGroup.add(neck);

		const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 14), yellowMat);
		head.position.set(0, 0.96, 0.72);
		bodyGroup.add(head);

		const beak = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.32, 12), beakMat);
		beak.rotation.x = Math.PI / 2;
		beak.position.set(0, 0.92, 1.06);
		bodyGroup.add(beak);

		for (const sx of [-0.13, 0.13]) {
			const eye = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), darkMat);
			eye.position.set(sx, 1.04, 0.97);
			bodyGroup.add(eye);
		}
		// Side wings & cute tail tuft
		for (const sx of [-0.88, 0.88]) {
			const wing = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 10), yellowMat);
			wing.scale.set(0.45, 0.85, 1.4);
			wing.position.set(sx, 0.46, -0.05);
			bodyGroup.add(wing);
		}
		const tail = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.42, 10), yellowMat);
		tail.rotation.x = -0.85;
		tail.position.set(0, 0.56, -0.86);
		bodyGroup.add(tail);

		seatOffsetY = 0.54;
		extra = { waddleAmp: 0.085 };
	} else if (builderName === "sportsCoupe") {
		const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.42, 2.55), paintMat);
		chassis.position.set(0, 0.46, 0);
		bodyGroup.add(chassis);

		// Racing stripes
		const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.435, 2.57), spkmodVehMat(THREE, 0xffffff));
		stripe.position.set(0, 0.46, 0);
		bodyGroup.add(stripe);

		// Sloped cabin
		const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.38, 1.14), glassMat);
		cabin.position.set(0, 0.80, -0.10);
		bodyGroup.add(cabin);

		// Rear GT spoiler wing
		const wing = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.07, 0.30), darkMat);
		wing.position.set(0, 0.94, -1.16);
		bodyGroup.add(wing);
		for (const sx of [-0.46, 0.46]) {
			const strut = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.30, 0.14), darkMat);
			strut.position.set(sx, 0.78, -1.14);
			bodyGroup.add(strut);
		}
		// Headlights & taillights
		for (const sx of [-0.50, 0.50]) {
			const hl = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.12, 0.08), headLightMat);
			hl.position.set(sx, 0.50, 1.28);
			bodyGroup.add(hl);
			const tl = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.08), tailLightMat);
			tl.position.set(sx, 0.52, -1.28);
			bodyGroup.add(tl);
		}
		wheelRadius = 0.30;
		spkmodAddWheelPair(THREE, bodyGroup, 0.76, wheelRadius, 0.78, wheelRadius, 0.22, tireMat, rimMat, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.76, wheelRadius, -0.78, wheelRadius, 0.24, tireMat, rimMat, wheels);
		seatOffsetY = 1.02;
	} else if (builderName === "policeCruiser") {
		const blackMat = spkmodVehMat(THREE, 0x0f172a);
		const whiteMat = spkmodVehMat(THREE, 0xf8fafc);

		const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.48, 2.62), blackMat);
		lowerBody.position.set(0, 0.52, 0);
		bodyGroup.add(lowerBody);

		const doorBand = new THREE.Mesh(new THREE.BoxGeometry(1.54, 0.44, 1.08), whiteMat);
		doorBand.position.set(0, 0.53, -0.05);
		bodyGroup.add(doorBand);

		const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.30, 0.46, 1.20), whiteMat);
		cabin.position.set(0, 0.96, -0.08);
		bodyGroup.add(cabin);

		const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.36, 1.24), glassMat);
		windshield.position.set(0, 0.96, -0.08);
		bodyGroup.add(windshield);

		// Front push bullbar
		const bullbar = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.34, 0.14), chromeMat);
		bullbar.position.set(0, 0.46, 1.36);
		bodyGroup.add(bullbar);

		// Flashing Red / Blue Police Roof Lightbar!
		const sirenBar = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.08, 0.22), darkMat);
		sirenBar.position.set(0, 1.22, 0.02);
		bodyGroup.add(sirenBar);

		const redMat = new THREE.MeshBasicMaterial({ color: 0xff2233 });
		const blueMat = new THREE.MeshBasicMaterial({ color: 0x2277ff });
		const sirenRed = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.16, 0.20), redMat);
		sirenRed.position.set(-0.24, 1.32, 0.02);
		bodyGroup.add(sirenRed);
		const sirenBlue = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.16, 0.20), blueMat);
		sirenBlue.position.set(0.24, 1.32, 0.02);
		bodyGroup.add(sirenBlue);
		animParts.push({ type: "siren", red: sirenRed, blue: sirenBlue });

		for (const sx of [-0.52, 0.52]) {
			const hl = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.08), headLightMat);
			hl.position.set(sx, 0.56, 1.32);
			bodyGroup.add(hl);
			const tl = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.08), tailLightMat);
			tl.position.set(sx, 0.56, -1.32);
			bodyGroup.add(tl);
		}
		wheelRadius = 0.33;
		spkmodAddWheelPair(THREE, bodyGroup, 0.78, wheelRadius, 0.80, wheelRadius, 0.22, tireMat, rimMat, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.78, wheelRadius, -0.80, wheelRadius, 0.22, tireMat, rimMat, wheels);
		seatOffsetY = 1.28;
	} else if (builderName === "magicBroom") {
		const woodMat = spkmodVehMat(THREE, 0x78350f);
		const strawMat = spkmodVehMat(THREE, 0xeab308);
		const ribbonMat = spkmodVehMat(THREE, 0xec4899);
		const starMat = spkmodVehMat(THREE, 0xfef08a, { emissive: 0xf59e0b, emissiveIntensity: 0.75 });

		const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 2.35, 12), woodMat);
		pole.rotation.x = Math.PI / 2;
		pole.position.set(0, 0.06, 0.12);
		bodyGroup.add(pole);

		const bristles = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.96, 14), strawMat);
		bristles.rotation.x = Math.PI / 2;
		bristles.position.set(0, 0.06, -1.16);
		bodyGroup.add(bristles);

		const band = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.15, 0.14, 12), ribbonMat);
		band.rotation.x = Math.PI / 2;
		band.position.set(0, 0.06, -0.72);
		bodyGroup.add(band);

		const tipGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0), starMat);
		tipGem.position.set(0, 0.06, 1.34);
		bodyGroup.add(tipGem);
		animParts.push({ type: "spinY", node: tipGem, speed: 3.2 });

		hoverY = 0.56;
		hoverAmp = 0.12;
		seatOffsetY = 0.62;
	} else if (builderName === "hoverboard") {
		const neonMat = spkmodVehMat(THREE, 0x22d3ee, { emissive: 0x06b6d4, emissiveIntensity: 0.9 });
		const deck = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.10, 1.72), paintMat);
		deck.position.set(0, 0, 0);
		bodyGroup.add(deck);

		// Tapered nose & tail
		const nose = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.10, 16), paintMat);
		nose.position.set(0, 0, 0.84);
		bodyGroup.add(nose);
		const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.10, 16), paintMat);
		tail.position.set(0, 0, -0.84);
		bodyGroup.add(tail);

		// Neon edge strips
		for (const sx of [-0.36, 0.36]) {
			const strip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 1.66), neonMat);
			strip.position.set(sx, 0, 0);
			bodyGroup.add(strip);
		}
		// Under-thruster glow discs
		for (const sz of [-0.52, 0.52]) {
			const thruster = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.24, 0.08, 14), neonMat);
			thruster.position.set(0, -0.08, sz);
			bodyGroup.add(thruster);
			animParts.push({ type: "pulseScale", node: thruster, speed: 9.0, amp: 0.14 });
		}
		hoverY = 0.36;
		hoverAmp = 0.09;
		seatOffsetY = 0.42;
	} else if (builderName === "monsterTruck") {
		// Lifted body
		const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.56, 2.75), paintMat);
		chassis.position.set(0, 1.06, 0);
		bodyGroup.add(chassis);

		const cab = new THREE.Mesh(new THREE.BoxGeometry(1.44, 0.56, 1.15), paintMat);
		cab.position.set(0, 1.56, 0.24);
		bodyGroup.add(cab);

		const cabGlass = new THREE.Mesh(new THREE.BoxGeometry(1.38, 0.38, 1.18), glassMat);
		cabGlass.position.set(0, 1.58, 0.24);
		bodyGroup.add(cabGlass);

		// Suspension under-frame
		const axleBox = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.30, 2.0), darkMat);
		axleBox.position.set(0, 0.64, 0);
		bodyGroup.add(axleBox);

		// Roof lightbar & dual exhaust pipes
		const lightbar = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.12, 0.14), headLightMat);
		lightbar.position.set(0, 1.90, 0.68);
		bodyGroup.add(lightbar);
		for (const sx of [-0.62, 0.62]) {
			const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.96, 10), chromeMat);
			exhaust.position.set(sx, 1.56, -0.44);
			bodyGroup.add(exhaust);
		}
		wheelRadius = 0.56;
		spkmodAddWheelPair(THREE, bodyGroup, 0.96, wheelRadius, 0.88, wheelRadius, 0.42, tireMat, rimMat, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.96, wheelRadius, -0.88, wheelRadius, 0.42, tireMat, rimMat, wheels);
		seatOffsetY = 1.88;
	} else if (builderName === "miniTank") {
		const treadMat = spkmodVehMat(THREE, 0x1f2937);
		// Armored hull
		const hull = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.54, 2.15), paintMat);
		hull.position.set(0, 0.54, 0);
		bodyGroup.add(hull);

		// Twin armored side treads
		for (const sx of [-0.82, 0.82]) {
			const tread = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.46, 2.28), treadMat);
			tread.position.set(sx, 0.26, 0);
			bodyGroup.add(tread);
		}
		// Road wheels along treads
		wheelRadius = 0.20;
		for (const sz of [-0.74, 0, 0.74]) {
			spkmodAddWheelPair(THREE, bodyGroup, 0.84, wheelRadius, sz, wheelRadius, 0.36, treadMat, rimMat, wheels);
		}

		// Turret & cannon barrel
		const turret = new THREE.Group();
		turret.position.set(0, 0.94, -0.05);
		const turretDome = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.66, 0.42, 12), paintMat);
		turret.add(turretDome);
		const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 1.48, 12), darkMat);
		barrel.rotation.x = Math.PI / 2;
		barrel.position.set(0, 0.04, 0.96);
		turret.add(barrel);
		const muzzle = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.16, 12), chromeMat);
		muzzle.rotation.x = Math.PI / 2;
		muzzle.position.set(0, 0.04, 1.66);
		turret.add(muzzle);
		bodyGroup.add(turret);

		seatOffsetY = 1.18;
	} else if (builderName === "ufoSaucer") {
		const saucerSpin = new THREE.Group();
		bodyGroup.add(saucerSpin);

		const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.56, 0.30, 24), paintMat);
		disc.position.set(0, 0.15, 0);
		saucerSpin.add(disc);

		const underDisc = new THREE.Mesh(new THREE.CylinderGeometry(1.56, 0.72, 0.24, 24), chromeMat);
		underDisc.position.set(0, -0.10, 0);
		saucerSpin.add(underDisc);

		// Rotating perimeter glowing alien lights
		const lightColors = [0x22d3ee, 0xf472b6, 0xa3e635, 0xfacc15];
		for (let i = 0; i < 8; i++) {
			const ang = (i / 8) * Math.PI * 2;
			const lMat = new THREE.MeshBasicMaterial({ color: lightColors[i % lightColors.length] });
			const orb = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), lMat);
			orb.position.set(Math.cos(ang) * 1.42, 0.04, Math.sin(ang) * 1.42);
			saucerSpin.add(orb);
		}
		animParts.push({ type: "spinY", node: saucerSpin, speed: 1.6 });

		// Translucent glass cockpit dome
		const dome = new THREE.Mesh(new THREE.SphereGeometry(0.84, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), glassMat);
		dome.position.set(0, 0.28, 0);
		bodyGroup.add(dome);

		// Glowing tractor beam ring underneath
		const beamMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.42, side: THREE.DoubleSide });
		const beamRing = new THREE.Mesh(new THREE.RingGeometry(0.45, 0.78, 20), beamMat);
		beamRing.rotation.x = Math.PI / 2;
		beamRing.position.set(0, -0.34, 0);
		bodyGroup.add(beamRing);
		animParts.push({ type: "pulseScale", node: beamRing, speed: 4.5, amp: 0.18 });

		hoverY = 0.62;
		hoverAmp = 0.14;
		seatOffsetY = 0.82;
	} else if (builderName === "nimbusCloud") {
		const cloudMat = spkmodVehMat(THREE, 0xfde047, { emissive: 0xf59e0b, emissiveIntensity: 0.28 });
		const puffs = [
			[0, 0.10, 0.08, 0.56],
			[-0.48, 0.04, 0.02, 0.44],
			[0.48, 0.04, 0.02, 0.44],
			[0, 0.08, 0.58, 0.42],
			[-0.36, 0.02, -0.44, 0.40],
			[0.36, 0.02, -0.44, 0.40],
			[0, 0.00, -0.82, 0.34],
			[0, -0.02, -1.16, 0.24]
		];
		for (const [px, py, pz, pr] of puffs) {
			const puff = new THREE.Mesh(new THREE.SphereGeometry(pr, 14, 12), cloudMat);
			puff.scale.set(1.15, 0.72, 1.15);
			puff.position.set(px, py, pz);
			bodyGroup.add(puff);
		}
		hoverY = 0.48;
		hoverAmp = 0.14;
		seatOffsetY = 0.82;
	} else {
		const ext = spkmodBuildExtendedProceduralVehicle(THREE, builderName, colorHex, root, bodyGroup, {
			tireMat, rimMat, paintMat, chromeMat, glassMat, darkMat, headLightMat, tailLightMat
		}, wheels, animParts);
		if (ext) {
			if (ext.seatOffsetY !== undefined) seatOffsetY = ext.seatOffsetY;
			if (ext.wheelRadius !== undefined) wheelRadius = ext.wheelRadius;
			if (ext.hoverY !== undefined) hoverY = ext.hoverY;
			if (ext.hoverAmp !== undefined) hoverAmp = ext.hoverAmp;
			extra = Object.assign(extra, ext.extra || {});
		}
	}

	return Object.assign({
		root,
		bodyGroup,
		wheels,
		wheelRadius,
		seatOffsetY,
		hoverY,
		hoverAmp,
		animParts
	}, extra);
}

function spkmodAttachStealthRig(THREE, root, alertY = 1.92) {
	const shoeMat = spkmodVehMat(THREE, 0x3b2a22);
	const leftFoot = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), shoeMat);
	leftFoot.scale.set(0.95, 0.65, 1.35);
	leftFoot.position.set(-0.22, 0.08, 0.08);
	leftFoot.visible = false;
	root.add(leftFoot);

	const rightFoot = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), shoeMat);
	rightFoot.scale.set(0.95, 0.65, 1.35);
	rightFoot.position.set(0.22, 0.08, -0.08);
	rightFoot.visible = false;
	root.add(rightFoot);

	const alertTex = spkmodGetAlertSpriteTexture(THREE, "!");
	const alertMat = new THREE.SpriteMaterial({ map: alertTex, transparent: true, depthTest: false, depthWrite: false });
	const alertSprite = new THREE.Sprite(alertMat);
	alertSprite.name = "spkmod_vehicle_alert_sprite";
	alertSprite.userData = Object.assign(alertSprite.userData || {}, { spkmodVehicleAlert: true, spkmodSkipNametagClear: true });
	alertSprite.renderOrder = 999;
	alertSprite.position.set(0, alertY, 0);
	alertSprite.scale.set(0.75, 0.75, 1);
	alertSprite.visible = false;
	root.add(alertSprite);
	return { isMgsBox: true, leftFoot, rightFoot, alertSprite, alertBaseY: alertY };
}

function spkmodBuildExtendedProceduralVehicle(THREE, builderName, colorHex, root, bodyGroup, mats, wheels, animParts) {
	const { tireMat, rimMat, paintMat, chromeMat, glassMat, darkMat, headLightMat, tailLightMat } = mats;
	const put = (parent, geo, mat, pos = null, rot = null, scale = null) => {
		const m = new THREE.Mesh(geo, mat);
		if (pos) m.position.set(pos[0], pos[1], pos[2]);
		if (rot) m.rotation.set(rot[0], rot[1], rot[2]);
		if (scale) m.scale.set(scale[0], scale[1], scale[2]);
		parent.add(m);
		return m;
	};

	// --- 7 NEW STEALTH / PLAYER-HIDING PROPS ---
	if (builderName === "stealthBush") {
		const grn1 = spkmodVehMat(THREE, 0x16a34a), grn2 = spkmodVehMat(THREE, 0x22c55e), berry = spkmodVehMat(THREE, 0xef4444);
		const puffs = [[0, 0.62, 0, 0.68], [-0.46, 0.48, 0.18, 0.48], [0.46, 0.48, 0.18, 0.48], [-0.36, 0.50, -0.34, 0.48], [0.36, 0.50, -0.34, 0.48], [0, 0.96, 0, 0.46], [0, 0.46, 0.46, 0.44]];
		puffs.forEach(([x, y, z, r], i) => put(bodyGroup, new THREE.SphereGeometry(r, 12, 10), i % 2 ? grn2 : grn1, [x, y, z]));
		for (const [x, y, z] of [[-0.25, 0.78, 0.56], [0.34, 0.62, 0.48], [0.08, 1.02, 0.34], [-0.48, 0.62, 0.25]]) {
			put(bodyGroup, new THREE.SphereGeometry(0.06, 8, 8), berry, [x, y, z]);
		}
		return { seatOffsetY: 0, extra: spkmodAttachStealthRig(THREE, root, 1.98) };
	} else if (builderName === "stealthBarrel") {
		const wood = spkmodVehMat(THREE, 0x92400e), band = spkmodVehMat(THREE, 0x334155);
		put(bodyGroup, new THREE.CylinderGeometry(0.56, 0.56, 1.24, 18), wood, [0, 0.62, 0]);
		put(bodyGroup, new THREE.SphereGeometry(0.62, 18, 12), wood, [0, 0.62, 0], null, [1, 1.04, 1]);
		for (const y of [0.22, 0.62, 1.02]) {
			put(bodyGroup, new THREE.TorusGeometry(y === 0.62 ? 0.62 : 0.57, 0.04, 8, 22), band, [0, y, 0], [Math.PI / 2, 0, 0]);
		}
		return { seatOffsetY: 0, extra: spkmodAttachStealthRig(THREE, root, 1.92) };
	} else if (builderName === "stealthTrashcan") {
		const bin = spkmodVehMat(THREE, 0x94a3b8), rib = spkmodVehMat(THREE, 0x64748b);
		put(bodyGroup, new THREE.CylinderGeometry(0.58, 0.50, 1.18, 18), bin, [0, 0.59, 0]);
		for (const y of [0.26, 0.58, 0.90]) put(bodyGroup, new THREE.TorusGeometry(0.53 + y * 0.05, 0.03, 6, 20), rib, [0, y, 0], [Math.PI / 2, 0, 0]);
		const lid = new THREE.Group();
		lid.position.set(0, 1.20, 0);
		put(lid, new THREE.CylinderGeometry(0.62, 0.62, 0.09, 18), bin);
		put(lid, new THREE.TorusGeometry(0.12, 0.03, 8, 12, Math.PI), rib, [0, 0.05, 0]);
		bodyGroup.add(lid);
		animParts.push({ type: "lidBounce", node: lid, baseY: 1.20 });
		return { seatOffsetY: 0, extra: spkmodAttachStealthRig(THREE, root, 2.02) };
	} else if (builderName === "stealthSnowman") {
		const snow = spkmodVehMat(THREE, 0xf8fafc), scarf = spkmodVehMat(THREE, 0xef4444), carrot = spkmodVehMat(THREE, 0xf97316);
		put(bodyGroup, new THREE.SphereGeometry(0.58, 16, 14), snow, [0, 0.50, 0]);
		put(bodyGroup, new THREE.SphereGeometry(0.44, 14, 12), snow, [0, 1.12, 0]);
		put(bodyGroup, new THREE.SphereGeometry(0.32, 14, 12), snow, [0, 1.62, 0]);
		put(bodyGroup, new THREE.TorusGeometry(0.32, 0.065, 8, 18), scarf, [0, 1.38, 0], [Math.PI / 2, 0, 0]);
		put(bodyGroup, new THREE.ConeGeometry(0.06, 0.30, 10), carrot, [0, 1.62, 0.38], [Math.PI / 2, 0, 0]);
		for (const s of [-0.11, 0.11]) put(bodyGroup, new THREE.SphereGeometry(0.045, 8, 8), darkMat, [s, 1.70, 0.27]);
		put(bodyGroup, new THREE.CylinderGeometry(0.24, 0.24, 0.34, 14), darkMat, [0, 2.04, 0]);
		put(bodyGroup, new THREE.CylinderGeometry(0.38, 0.38, 0.05, 16), darkMat, [0, 1.88, 0]);
		return { seatOffsetY: 0, extra: Object.assign(spkmodAttachStealthRig(THREE, root, 2.55), { hopAmp: 0.16 }) };
	} else if (builderName === "stealthGift") {
		const rib = spkmodVehMat(THREE, 0xfacc15);
		put(bodyGroup, new THREE.BoxGeometry(1.18, 1.22, 1.18), paintMat, [0, 0.61, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.24, 0.20, 1.24), paintMat, [0, 1.16, 0]);
		put(bodyGroup, new THREE.BoxGeometry(0.20, 1.28, 1.26), rib, [0, 0.64, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.26, 1.28, 0.20), rib, [0, 0.64, 0]);
		for (const s of [-1, 1]) put(bodyGroup, new THREE.TorusGeometry(0.22, 0.07, 8, 14), rib, [s * 0.20, 1.38, 0], [0, 0, s * 0.4]);
		return { seatOffsetY: 0, extra: spkmodAttachStealthRig(THREE, root, 2.05) };
	} else if (builderName === "stealthMoai") {
		const stone = spkmodVehMat(THREE, 0x78716c), shade = spkmodVehMat(THREE, 0x57534e);
		// Iconic Easter Island Moai stone head!
		put(bodyGroup, new THREE.BoxGeometry(1.06, 1.62, 1.04), stone, [0, 0.81, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.16, 0.26, 0.36), stone, [0, 1.38, 0.42]); // heavy brow ridge
		put(bodyGroup, new THREE.BoxGeometry(0.28, 0.64, 0.36), stone, [0, 0.96, 0.56], [-0.15, 0, 0]); // long Moai nose
		for (const s of [-1, 1]) {
			put(bodyGroup, new THREE.BoxGeometry(0.26, 0.18, 0.12), shade, [s * 0.28, 1.22, 0.48]); // deep eye sockets
			put(bodyGroup, new THREE.BoxGeometry(0.14, 0.52, 0.24), stone, [s * 0.58, 0.88, -0.02]); // tall stone ears
		}
		put(bodyGroup, new THREE.BoxGeometry(0.56, 0.12, 0.18), shade, [0, 0.46, 0.52]); // stoic mouth
		return { seatOffsetY: 0, extra: spkmodAttachStealthRig(THREE, root, 2.15) };
	} else if (builderName === "stealthCone") {
		const org = spkmodVehMat(THREE, 0xf97316), wht = spkmodVehMat(THREE, 0xf8fafc);
		put(bodyGroup, new THREE.BoxGeometry(1.36, 0.14, 1.36), org, [0, 0.07, 0]);
		put(bodyGroup, new THREE.ConeGeometry(0.64, 1.72, 20), org, [0, 0.98, 0]);
		put(bodyGroup, new THREE.CylinderGeometry(0.28, 0.40, 0.28, 20), wht, [0, 1.02, 0]);
		put(bodyGroup, new THREE.CylinderGeometry(0.12, 0.20, 0.20, 20), wht, [0, 1.44, 0]);
		return { seatOffsetY: 0, extra: spkmodAttachStealthRig(THREE, root, 2.25) };
	}

	// --- 11 RIDICULOUS & MEME RIDES ---
	if (builderName === "giantRoomba") {
		const discGrp = new THREE.Group();
		bodyGroup.add(discGrp);
		put(discGrp, new THREE.CylinderGeometry(1.06, 1.12, 0.28, 28), darkMat, [0, 0.16, 0]);
		put(discGrp, new THREE.CylinderGeometry(0.92, 0.92, 0.05, 24), paintMat, [0, 0.31, 0]);
		put(discGrp, new THREE.CylinderGeometry(0.18, 0.18, 0.08, 16), spkmodVehMat(THREE, 0x22c55e, { emissive: 0x4ade80, emissiveIntensity: 0.9 }), [0, 0.33, 0.45]);
		put(discGrp, new THREE.TorusGeometry(1.10, 0.06, 8, 28, Math.PI), chromeMat, [0, 0.14, 0], [Math.PI / 2, 0, 0]);
		for (const s of [-1, 1]) {
			const brush = new THREE.Group();
			brush.position.set(s * 0.85, 0.06, 0.68);
			for (let k = 0; k < 3; k++) put(brush, new THREE.BoxGeometry(0.42, 0.03, 0.04), headLightMat, null, [0, (k / 3) * Math.PI, 0]);
			discGrp.add(brush);
			animParts.push({ type: "spinY", node: brush, speed: s * 9.0 });
		}
		animParts.push({ type: "spinMoveY", node: discGrp, speed: 2.2 });
		return { seatOffsetY: 0.46 };
	} else if (builderName === "swivelChair") {
		const spinTop = new THREE.Group();
		bodyGroup.add(spinTop);
		put(bodyGroup, new THREE.CylinderGeometry(0.09, 0.09, 0.52, 10), chromeMat, [0, 0.32, 0]);
		for (let i = 0; i < 5; i++) {
			const a = (i / 5) * Math.PI * 2;
			put(bodyGroup, new THREE.BoxGeometry(0.11, 0.08, 0.82), darkMat, [Math.sin(a) * 0.40, 0.14, Math.cos(a) * 0.40], [0, a, 0]);
			put(bodyGroup, new THREE.SphereGeometry(0.09, 8, 8), tireMat, [Math.sin(a) * 0.74, 0.09, Math.cos(a) * 0.74]);
		}
		put(spinTop, new THREE.BoxGeometry(1.32, 0.18, 1.24), paintMat, [0, 0.62, -0.06]);
		put(spinTop, new THREE.BoxGeometry(1.28, 1.38, 0.18), paintMat, [0, 1.34, -0.70]);
		for (const s of [-1, 1]) {
			put(spinTop, new THREE.BoxGeometry(0.08, 0.34, 0.10), darkMat, [s * 0.68, 0.82, -0.10]);
			put(spinTop, new THREE.BoxGeometry(0.14, 0.09, 0.86), darkMat, [s * 0.68, 0.98, -0.04]);
		}
		animParts.push({ type: "spinMoveY", node: spinTop, speed: 6.5 });
		return { seatOffsetY: 0.72 };
	} else if (builderName === "goldenToilet") {
		const gld = spkmodVehMat(THREE, 0xfacc15, { emissive: 0xd97706, emissiveIntensity: 0.25 }), wht = spkmodVehMat(THREE, 0xfef9c3);
		put(bodyGroup, new THREE.CylinderGeometry(0.46, 0.34, 0.50, 16), gld, [0, 0.38, 0.10]);
		put(bodyGroup, new THREE.TorusGeometry(0.42, 0.10, 10, 20), wht, [0, 0.64, 0.10], [Math.PI / 2, 0, 0]);
		put(bodyGroup, new THREE.BoxGeometry(0.84, 0.92, 0.36), gld, [0, 0.98, -0.44]);
		put(bodyGroup, new THREE.BoxGeometry(0.92, 0.10, 0.42), gld, [0, 1.46, -0.44]);
		put(bodyGroup, new THREE.BoxGeometry(0.22, 0.05, 0.06), chromeMat, [0.50, 1.28, -0.32]);
		spkmodAddWheelPair(THREE, bodyGroup, 0.42, 0.14, 0.34, 0.14, 0.10, tireMat, gld, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.42, 0.14, -0.46, 0.14, 0.10, tireMat, gld, wheels);
		return { seatOffsetY: 0.86, wheelRadius: 0.14 };
	} else if (builderName === "bubbleBathtub") {
		const tub = spkmodVehMat(THREE, 0xf8fafc), bub = spkmodVehMat(THREE, 0xbae6fd, { transparent: true, opacity: 0.78 });
		put(bodyGroup, new THREE.BoxGeometry(1.18, 0.64, 1.98), tub, [0, 0.56, 0]);
		put(bodyGroup, new THREE.TorusGeometry(0.68, 0.10, 10, 22), tub, [0, 0.88, 0], [Math.PI / 2, 0, 0], [0.9, 1.45, 1]);
		for (let i = 0; i < 10; i++) {
			const a = (i / 10) * Math.PI * 2;
			put(bodyGroup, new THREE.SphereGeometry(0.18 + (i % 3) * 0.06, 10, 8), bub, [Math.cos(a) * 0.44, 0.92 + (i % 2) * 0.12, Math.sin(a) * 0.78]);
		}
		put(bodyGroup, new THREE.SphereGeometry(0.16, 10, 8), spkmodVehMat(THREE, 0xfacc15), [0.38, 1.04, 0.86]);
		spkmodAddWheelPair(THREE, bodyGroup, 0.56, 0.18, 0.72, 0.18, 0.12, tireMat, spkmodVehMat(THREE, 0xfacc15), wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.56, 0.18, -0.72, 0.18, 0.12, tireMat, spkmodVehMat(THREE, 0xfacc15), wheels);
		return { seatOffsetY: 0.88, wheelRadius: 0.18 };
	} else if (builderName === "hotdogMobile") {
		const bun = spkmodVehMat(THREE, 0xeab308), dog = spkmodVehMat(THREE, 0xb91c1c), mus = spkmodVehMat(THREE, 0xfef08a);
		put(bodyGroup, new THREE.CylinderGeometry(0.56, 0.56, 2.35, 16), bun, [0, 0.64, 0], [Math.PI / 2, 0, 0], [1.18, 1, 0.88]);
		put(bodyGroup, new THREE.CylinderGeometry(0.36, 0.36, 2.75, 16), dog, [0, 0.90, 0], [Math.PI / 2, 0, 0]);
		for (const sz of [-1.38, 1.38]) put(bodyGroup, new THREE.SphereGeometry(0.36, 12, 10), dog, [0, 0.90, sz]);
		for (let i = -4; i <= 4; i++) put(bodyGroup, new THREE.SphereGeometry(0.085, 8, 8), mus, [Math.sin(i * 1.1) * 0.14, 1.24, i * 0.28]);
		spkmodAddWheelPair(THREE, bodyGroup, 0.72, 0.30, 0.82, 0.30, 0.22, tireMat, rimMat, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.72, 0.30, -0.82, 0.30, 0.22, tireMat, rimMat, wheels);
		return { seatOffsetY: 1.26, wheelRadius: 0.30 };
	} else if (builderName === "bananaCar") {
		const yel = spkmodVehMat(THREE, 0xfacc15), brn = spkmodVehMat(THREE, 0x78350f);
		put(bodyGroup, new THREE.CylinderGeometry(0.46, 0.46, 2.15, 16), yel, [0, 0.58, 0], [Math.PI / 2, 0, 0]);
		put(bodyGroup, new THREE.ConeGeometry(0.46, 0.88, 14), yel, [0, 0.78, 1.44], [1.12, 0, 0]);
		put(bodyGroup, new THREE.ConeGeometry(0.46, 0.92, 14), yel, [0, 0.84, -1.44], [-1.12, 0, 0]);
		put(bodyGroup, new THREE.CylinderGeometry(0.08, 0.12, 0.26, 8), brn, [0, 1.12, -1.86], [-0.8, 0, 0]);
		spkmodAddWheelPair(THREE, bodyGroup, 0.64, 0.28, 0.76, 0.28, 0.20, tireMat, rimMat, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.64, 0.28, -0.76, 0.28, 0.20, tireMat, rimMat, wheels);
		return { seatOffsetY: 1.02, wheelRadius: 0.28 };
	} else if (builderName === "flyingBed") {
		const frame = spkmodVehMat(THREE, 0x92400e), sheet = spkmodVehMat(THREE, 0xf8fafc);
		put(bodyGroup, new THREE.BoxGeometry(1.56, 0.22, 2.30), frame, [0, 0.12, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.48, 0.32, 2.18), sheet, [0, 0.36, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.52, 0.34, 1.44), paintMat, [0, 0.38, -0.34]);
		put(bodyGroup, new THREE.BoxGeometry(1.56, 0.96, 0.14), frame, [0, 0.64, -1.14]);
		for (const sx of [-0.36, 0.36]) put(bodyGroup, new THREE.BoxGeometry(0.56, 0.18, 0.40), sheet, [sx, 0.58, -0.82]);
		return { seatOffsetY: 0.76, hoverY: 0.48, hoverAmp: 0.14 };
	} else if (builderName === "watermelonBoat") {
		const grn = spkmodVehMat(THREE, 0x16a34a), pith = spkmodVehMat(THREE, 0xecfccb), red = spkmodVehMat(THREE, 0xf43f5e);
		// Upright curved watermelon slice pointing front-to-back (+Z to -Z), curved green rind resting on ground!
		put(bodyGroup, new THREE.CylinderGeometry(1.04, 1.04, 0.74, 22, 1, false, 0, Math.PI), grn, [0, 1.04, 0], [0, 0, -Math.PI / 2]);
		put(bodyGroup, new THREE.CylinderGeometry(0.96, 0.96, 0.77, 22, 1, false, 0, Math.PI), pith, [0, 1.04, 0], [0, 0, -Math.PI / 2]);
		put(bodyGroup, new THREE.CylinderGeometry(0.91, 0.91, 0.80, 22, 1, false, 0, Math.PI), red, [0, 1.04, 0], [0, 0, -Math.PI / 2]);
		// Solid flat red top deck & green rind lips
		put(bodyGroup, new THREE.BoxGeometry(0.76, 0.05, 1.82), red, [0, 1.03, 0]);
		put(bodyGroup, new THREE.BoxGeometry(0.74, 0.05, 2.08), grn, [0, 1.02, 0]);
		// Watermelon seeds cleanly embedded on both flat vertical red sides!
		for (const [y, z] of [[0.84, 0.46], [0.84, -0.46], [0.54, 0], [0.68, 0.34], [0.68, -0.34], [0.90, 0]]) {
			put(bodyGroup, new THREE.SphereGeometry(0.055, 8, 6), darkMat, [0.41, y, z], null, [0.45, 1.25, 0.85]);
			put(bodyGroup, new THREE.SphereGeometry(0.055, 8, 6), darkMat, [-0.41, y, z], null, [0.45, 1.25, 0.85]);
		}
		return { seatOffsetY: 0.92, extra: { waddleAmp: 0.08 } };
	} else if (builderName === "burgerMobile") {
		const bun = spkmodVehMat(THREE, 0xeab308), meat = spkmodVehMat(THREE, 0x7c2d12), chz = spkmodVehMat(THREE, 0xfde047), letM = spkmodVehMat(THREE, 0x22c55e), pkl = spkmodVehMat(THREE, 0x15803d);
		put(bodyGroup, new THREE.CylinderGeometry(0.98, 0.94, 0.32, 20), bun, [0, 0.44, 0]);
		put(bodyGroup, new THREE.CylinderGeometry(1.04, 1.04, 0.24, 20), meat, [0, 0.70, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.62, 0.08, 1.62), chz, [0, 0.84, 0], [0, Math.PI / 4, 0]);
		put(bodyGroup, new THREE.CylinderGeometry(1.08, 1.08, 0.12, 16), letM, [0, 0.92, 0]);
		put(bodyGroup, new THREE.SphereGeometry(0.98, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.48), bun, [0, 0.96, 0], null, [1, 0.65, 1]);
		spkmodAddWheelPair(THREE, bodyGroup, 0.96, 0.34, 0.64, 0.34, 0.22, pkl, spkmodVehMat(THREE, 0x86efac), wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.96, 0.34, -0.64, 0.34, 0.22, pkl, spkmodVehMat(THREE, 0x86efac), wheels);
		return { seatOffsetY: 1.56, wheelRadius: 0.34 };
	} else if (builderName === "sneakerCar") {
		const sole = spkmodVehMat(THREE, 0xf8fafc);
		put(bodyGroup, new THREE.BoxGeometry(1.24, 0.26, 2.52), sole, [0, 0.36, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.16, 0.56, 2.28), paintMat, [0, 0.76, -0.06]);
		put(bodyGroup, new THREE.BoxGeometry(1.14, 0.58, 1.04), paintMat, [0, 1.24, -0.64]);
		put(bodyGroup, new THREE.SphereGeometry(0.58, 14, 10), sole, [0, 0.64, 1.06], null, [1.0, 0.62, 0.9]);
		for (let i = 0; i < 4; i++) put(bodyGroup, new THREE.BoxGeometry(0.76, 0.06, 0.10), sole, [0, 1.08 + i * 0.08, 0.66 - i * 0.22]);
		spkmodAddWheelPair(THREE, bodyGroup, 0.66, 0.24, 0.80, 0.24, 0.18, tireMat, rimMat, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.66, 0.24, -0.80, 0.24, 0.18, tireMat, rimMat, wheels);
		return { seatOffsetY: 1.28, wheelRadius: 0.24 };
	} else if (builderName === "grandPiano") {
		const blk = spkmodVehMat(THREE, 0x0f172a), keyW = spkmodVehMat(THREE, 0xf8fafc);
		put(bodyGroup, new THREE.BoxGeometry(1.64, 0.54, 1.98), blk, [0, 0.82, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.42, 0.12, 0.42), keyW, [0, 0.72, 1.04]);
		// Open angled grand piano lid + support prop stick
		put(bodyGroup, new THREE.BoxGeometry(1.58, 0.07, 1.88), blk, [-0.14, 1.44, -0.04], [0, 0, 0.42]);
		put(bodyGroup, new THREE.CylinderGeometry(0.03, 0.03, 0.88, 8), spkmodVehMat(THREE, 0xfacc15), [0.56, 1.28, 0.34], [0, 0, -0.22]);
		for (const [x, z] of [[-0.66, 0.78], [0.66, 0.78], [0, -0.80]]) put(bodyGroup, new THREE.CylinderGeometry(0.08, 0.06, 0.56, 10), blk, [x, 0.32, z]);
		spkmodAddWheelPair(THREE, bodyGroup, 0.66, 0.14, 0.78, 0.14, 0.10, tireMat, spkmodVehMat(THREE, 0xfacc15), wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.42, 0.14, -0.80, 0.14, 0.10, tireMat, spkmodVehMat(THREE, 0xfacc15), wheels);
		return { seatOffsetY: 1.26, wheelRadius: 0.14 };
	}

	// --- 8 STREET, WORK & UTILITY VEHICLES ---
	if (builderName === "farmTractor") {
		put(bodyGroup, new THREE.BoxGeometry(0.96, 0.62, 1.44), paintMat, [0, 0.78, 0.52]);
		put(bodyGroup, new THREE.BoxGeometry(1.16, 0.92, 1.02), paintMat, [0, 1.18, -0.56]);
		put(bodyGroup, new THREE.BoxGeometry(1.26, 0.10, 1.14), paintMat, [0, 1.66, -0.56]);
		put(bodyGroup, new THREE.CylinderGeometry(0.08, 0.10, 0.92, 10), darkMat, [0.36, 1.42, 0.86]);
		spkmodAddWheelPair(THREE, bodyGroup, 0.62, 0.32, 0.98, 0.32, 0.22, tireMat, spkmodVehMat(THREE, 0xfacc15), wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.76, 0.58, -0.58, 0.58, 0.34, tireMat, spkmodVehMat(THREE, 0xfacc15), wheels);
		return { seatOffsetY: 1.66, wheelRadius: 0.45, extra: { chugAmp: 0.045 } };
	} else if (builderName === "miniForklift") {
		const crate = spkmodVehMat(THREE, 0xc49a6c), amber = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
		put(bodyGroup, new THREE.BoxGeometry(1.24, 0.62, 1.68), paintMat, [0, 0.56, -0.14]);
		for (const [x, z] of [[-0.56, 0.56], [0.56, 0.56], [-0.56, -0.82], [0.56, -0.82]]) {
			put(bodyGroup, new THREE.CylinderGeometry(0.05, 0.05, 1.18, 8), darkMat, [x, 1.34, z]);
		}
		put(bodyGroup, new THREE.BoxGeometry(1.24, 0.08, 1.46), darkMat, [0, 1.92, -0.14]);
		const beacon = put(bodyGroup, new THREE.CylinderGeometry(0.10, 0.12, 0.16, 10), amber, [0, 2.04, -0.14]);
		animParts.push({ type: "pulseScale", node: beacon, speed: 9.0, amp: 0.22 });
		// Front mast, twin forks & cute cargo crate
		for (const sx of [-0.36, 0.36]) {
			put(bodyGroup, new THREE.BoxGeometry(0.10, 1.56, 0.12), darkMat, [sx, 0.96, 0.82]);
			put(bodyGroup, new THREE.BoxGeometry(0.12, 0.07, 1.06), chromeMat, [sx, 0.28, 1.38]);
		}
		put(bodyGroup, new THREE.BoxGeometry(0.86, 0.68, 0.76), crate, [0, 0.66, 1.42]);
		spkmodAddWheelPair(THREE, bodyGroup, 0.66, 0.28, 0.46, 0.28, 0.20, tireMat, rimMat, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.62, 0.24, -0.68, 0.24, 0.18, tireMat, rimMat, wheels);
		return { seatOffsetY: 1.96, wheelRadius: 0.26 };
	} else if (builderName === "fireEngine") {
		const red = spkmodVehMat(THREE, 0xdc2626), redL = new THREE.MeshBasicMaterial({ color: 0xff2233 }), whtL = new THREE.MeshBasicMaterial({ color: 0xffffff });
		put(bodyGroup, new THREE.BoxGeometry(1.56, 1.12, 3.05), red, [0, 0.92, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.48, 0.48, 0.88), glassMat, [0, 1.24, 1.02]);
		// Roof extendable silver ladder
		for (const sx of [-0.26, 0.26]) put(bodyGroup, new THREE.BoxGeometry(0.08, 0.10, 2.30), chromeMat, [sx, 1.58, -0.26]);
		for (let i = -4; i <= 4; i++) put(bodyGroup, new THREE.BoxGeometry(0.56, 0.06, 0.06), chromeMat, [0, 1.58, -0.26 + i * 0.24]);
		const l1 = put(bodyGroup, new THREE.BoxGeometry(0.36, 0.18, 0.20), redL, [-0.30, 1.58, 1.22]);
		const l2 = put(bodyGroup, new THREE.BoxGeometry(0.36, 0.18, 0.20), whtL, [0.30, 1.58, 1.22]);
		animParts.push({ type: "siren", red: l1, blue: l2 });
		spkmodAddWheelPair(THREE, bodyGroup, 0.80, 0.36, 0.96, 0.36, 0.24, tireMat, rimMat, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.80, 0.36, -0.96, 0.36, 0.24, tireMat, rimMat, wheels);
		return { seatOffsetY: 1.72, wheelRadius: 0.36 };
	} else if (builderName === "ambulance") {
		const wht = spkmodVehMat(THREE, 0xf8fafc), red = spkmodVehMat(THREE, 0xef4444);
		put(bodyGroup, new THREE.BoxGeometry(1.54, 1.18, 2.68), wht, [0, 0.92, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.58, 0.22, 2.70), red, [0, 0.68, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.44, 0.46, 0.78), glassMat, [0, 1.22, 0.96]);
		for (const s of [-1, 1]) {
			put(bodyGroup, new THREE.BoxGeometry(0.04, 0.42, 0.14), red, [s * 0.78, 1.14, -0.34]);
			put(bodyGroup, new THREE.BoxGeometry(0.04, 0.14, 0.42), red, [s * 0.78, 1.14, -0.34]);
		}
		const r1 = put(bodyGroup, new THREE.BoxGeometry(0.34, 0.18, 0.20), new THREE.MeshBasicMaterial({ color: 0xff2233 }), [-0.28, 1.60, 0.92]);
		const b1 = put(bodyGroup, new THREE.BoxGeometry(0.34, 0.18, 0.20), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }), [0.28, 1.60, 0.92]);
		animParts.push({ type: "siren", red: r1, blue: b1 });
		spkmodAddWheelPair(THREE, bodyGroup, 0.78, 0.34, 0.82, 0.34, 0.22, tireMat, rimMat, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.78, 0.34, -0.82, 0.34, 0.22, tireMat, rimMat, wheels);
		return { seatOffsetY: 1.66, wheelRadius: 0.34 };
	} else if (builderName === "iceCreamTruck") {
		const wht = spkmodVehMat(THREE, 0xfefce8), coneM = spkmodVehMat(THREE, 0xd97706), pnk = spkmodVehMat(THREE, 0xf9a8d4);
		put(bodyGroup, new THREE.BoxGeometry(1.54, 1.18, 2.66), wht, [0, 0.92, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.58, 0.34, 2.68), paintMat, [0, 0.62, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.44, 0.44, 0.78), glassMat, [0, 1.22, 0.94]);
		// Giant spinning roof ice cream cone!
		const roofCone = new THREE.Group();
		roofCone.position.set(0, 1.62, -0.20);
		put(roofCone, new THREE.ConeGeometry(0.28, 0.64, 14), coneM, [0, 0.32, 0], [Math.PI, 0, 0]);
		put(roofCone, new THREE.SphereGeometry(0.34, 14, 12), pnk, [0, 0.68, 0]);
		put(roofCone, new THREE.SphereGeometry(0.10, 8, 8), tailLightMat, [0, 1.02, 0]);
		bodyGroup.add(roofCone);
		animParts.push({ type: "spinY", node: roofCone, speed: 2.2 });
		spkmodAddWheelPair(THREE, bodyGroup, 0.78, 0.34, 0.82, 0.34, 0.22, tireMat, rimMat, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.78, 0.34, -0.82, 0.34, 0.22, tireMat, rimMat, wheels);
		return { seatOffsetY: 1.64, wheelRadius: 0.34 };
	} else if (builderName === "schoolBus") {
		const busY = spkmodVehMat(THREE, 0xeab308), stopR = spkmodVehMat(THREE, 0xdc2626);
		put(bodyGroup, new THREE.BoxGeometry(1.58, 1.22, 3.02), busY, [0, 0.94, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.62, 0.14, 3.04), darkMat, [0, 0.76, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.62, 0.44, 2.54), glassMat, [0, 1.24, 0.04]);
		put(bodyGroup, new THREE.CylinderGeometry(0.22, 0.22, 0.04, 8), stopR, [-0.94, 1.10, 0.88], [0, 0, Math.PI / 2]);
		const a1 = put(bodyGroup, new THREE.SphereGeometry(0.11, 8, 8), headLightMat, [-0.46, 1.56, 1.50]);
		const a2 = put(bodyGroup, new THREE.SphereGeometry(0.11, 8, 8), headLightMat, [0.46, 1.56, 1.50]);
		animParts.push({ type: "siren", red: a1, blue: a2 });
		spkmodAddWheelPair(THREE, bodyGroup, 0.80, 0.34, 0.96, 0.34, 0.22, tireMat, rimMat, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.80, 0.34, -0.96, 0.34, 0.22, tireMat, rimMat, wheels);
		return { seatOffsetY: 1.72, wheelRadius: 0.34 };
	} else if (builderName === "pennyFarthing") {
		const bigR = 0.82, smR = 0.26;
		const mkCycleWheel = (r, z) => {
			const g = new THREE.Group();
			g.position.set(0, r, z);
			put(g, new THREE.TorusGeometry(r, 0.055, 8, 24), tireMat, null, [0, Math.PI / 2, 0]);
			for (let i = 0; i < 4; i++) put(g, new THREE.CylinderGeometry(0.016, 0.016, r * 1.95, 6), chromeMat, null, [i * Math.PI / 4, 0, 0]);
			bodyGroup.add(g);
			wheels.push(g);
		};
		mkCycleWheel(bigR, 0.46);
		mkCycleWheel(smR, -0.74);
		put(bodyGroup, new THREE.CylinderGeometry(0.04, 0.04, 1.55, 10), paintMat, [0, 0.92, -0.14], [0.85, 0, 0]);
		put(bodyGroup, new THREE.CylinderGeometry(0.036, 0.036, 0.92, 10), chromeMat, [0, 1.66, 0.42], [0, 0, Math.PI / 2]);
		put(bodyGroup, new THREE.BoxGeometry(0.36, 0.10, 0.44), spkmodVehMat(THREE, 0x78350f), [0, 1.58, 0.16]);
		return { seatOffsetY: 1.66, wheelRadius: bigR };
	} else if (builderName === "cyberLightcycle") {
		const neon = spkmodVehMat(THREE, colorHex, { emissive: colorHex, emissiveIntensity: 0.95 });
		put(bodyGroup, new THREE.BoxGeometry(0.68, 0.48, 2.28), darkMat, [0, 0.56, 0]);
		put(bodyGroup, new THREE.BoxGeometry(0.74, 0.10, 2.34), neon, [0, 0.64, 0]);
		put(bodyGroup, new THREE.BoxGeometry(0.56, 0.28, 0.96), glassMat, [0, 0.88, 0.22], [-0.25, 0, 0]);
		for (const sz of [0.88, -0.88]) {
			const w = new THREE.Group();
			w.position.set(0, 0.36, sz);
			put(w, new THREE.TorusGeometry(0.34, 0.09, 10, 22), darkMat, null, [0, Math.PI / 2, 0]);
			put(w, new THREE.TorusGeometry(0.28, 0.045, 8, 22), neon, null, [0, Math.PI / 2, 0]);
			bodyGroup.add(w);
			wheels.push(w);
		}
		return { seatOffsetY: 0.96, wheelRadius: 0.36 };
	}

	// --- 9 FANTASY, ANIMAL & SCI-FI MOUNTS ---
	if (builderName === "magicCarpet") {
		const rug = spkmodVehMat(THREE, 0x7e22ce), border = spkmodVehMat(THREE, 0xfacc15), inner = spkmodVehMat(THREE, 0xe11d48);
		put(bodyGroup, new THREE.BoxGeometry(1.56, 0.07, 2.28), rug, [0, 0, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.36, 0.08, 2.04), border, [0, 0.005, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.12, 0.09, 1.74), inner, [0, 0.01, 0]);
		for (const [x, z] of [[-0.78, 1.14], [0.78, 1.14], [-0.78, -1.14], [0.78, -1.14]]) {
			put(bodyGroup, new THREE.ConeGeometry(0.10, 0.28, 6), border, [x, -0.10, z], [Math.PI, 0, 0]);
		}
		return { seatOffsetY: 0.56, hoverY: 0.50, hoverAmp: 0.14 };
	} else if (builderName === "landShark") {
		const shark = spkmodVehMat(THREE, 0x64748b), foam = spkmodVehMat(THREE, 0xbae6fd, { transparent: true, opacity: 0.65, side: THREE.DoubleSide });
		put(bodyGroup, new THREE.ConeGeometry(0.46, 1.24, 4), shark, [0, 0.54, -0.05], [-0.36, 0, 0], [0.32, 1, 1.35]);
		const ring1 = put(bodyGroup, new THREE.RingGeometry(0.46, 0.88, 22), foam, [0, 0.04, 0], [Math.PI / 2, 0, 0]);
		animParts.push({ type: "pulseScale", node: ring1, speed: 6.5, amp: 0.18 });
		return { seatOffsetY: 0.72, extra: { waddleAmp: 0.10 } };
	} else if (builderName === "bouncyFrog") {
		const grn = spkmodVehMat(THREE, 0x22c55e), belly = spkmodVehMat(THREE, 0xbef264), wht = spkmodVehMat(THREE, 0xffffff);
		put(bodyGroup, new THREE.SphereGeometry(0.84, 16, 14), grn, [0, 0.62, 0], null, [1.15, 0.82, 1.25]);
		put(bodyGroup, new THREE.SphereGeometry(0.68, 14, 12), belly, [0, 0.42, 0.20], null, [1.05, 0.65, 1.05]);
		for (const s of [-1, 1]) {
			put(bodyGroup, new THREE.SphereGeometry(0.24, 12, 10), grn, [s * 0.44, 1.18, 0.54]);
			put(bodyGroup, new THREE.SphereGeometry(0.16, 10, 8), wht, [s * 0.44, 1.22, 0.68]);
			put(bodyGroup, new THREE.SphereGeometry(0.08, 8, 8), darkMat, [s * 0.44, 1.22, 0.78]);
			put(bodyGroup, new THREE.SphereGeometry(0.32, 10, 8), grn, [s * 0.82, 0.28, -0.44], null, [0.7, 0.6, 1.3]);
		}
		return { seatOffsetY: 1.18, extra: { hopAmp: 0.28 } };
	} else if (builderName === "jetTurtle") {
		const shell = spkmodVehMat(THREE, 0x15803d), skin = spkmodVehMat(THREE, 0x4ade80), red = spkmodVehMat(THREE, 0xdc2626), flameM = new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.88 });
		put(bodyGroup, new THREE.SphereGeometry(0.92, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.56), shell, [0, 0.34, 0], null, [1.05, 0.85, 1.25]);
		put(bodyGroup, new THREE.SphereGeometry(0.34, 12, 10), skin, [0, 0.56, 1.24]);
		for (const s of [-1, 1]) {
			put(bodyGroup, new THREE.CylinderGeometry(0.16, 0.18, 0.84, 12), red, [s * 0.86, 0.66, -0.20], [Math.PI / 2, 0, 0]);
			const fl = put(bodyGroup, new THREE.ConeGeometry(0.15, 0.62, 10), flameM, [s * 0.86, 0.66, -0.92], [-Math.PI / 2, 0, 0]);
			animParts.push({ type: "flamePulse", node: fl });
		}
		return { seatOffsetY: 1.06, hoverY: 0.34, hoverAmp: 0.10 };
	} else if (builderName === "paperAirplane") {
		const paper = spkmodVehMat(THREE, 0xf8fafc, { side: THREE.DoubleSide }), fold = spkmodVehMat(THREE, 0xe2e8f0, { side: THREE.DoubleSide });
		put(bodyGroup, new THREE.ConeGeometry(1.25, 2.75, 3), paper, [0, 0.08, 0.10], [Math.PI / 2, 0, 0], [1.05, 1, 0.12]);
		put(bodyGroup, new THREE.BoxGeometry(0.06, 0.36, 2.30), fold, [0, -0.10, -0.04]);
		return { seatOffsetY: 0.58, hoverY: 0.52, hoverAmp: 0.14 };
	} else if (builderName === "hotAirBalloon") {
		const wicker = spkmodVehMat(THREE, 0xb45309), strp = spkmodVehMat(THREE, 0xfacc15);
		put(bodyGroup, new THREE.BoxGeometry(1.16, 0.78, 1.16), wicker, [0, 0.40, 0]);
		for (const [x, z] of [[-0.50, 0.50], [0.50, 0.50], [-0.50, -0.50], [0.50, -0.50]]) {
			put(bodyGroup, new THREE.CylinderGeometry(0.025, 0.025, 1.95, 6), chromeMat, [x, 1.62, z]);
		}
		put(bodyGroup, new THREE.SphereGeometry(1.32, 20, 16), paintMat, [0, 3.35, 0], null, [1.0, 1.18, 1.0]);
		put(bodyGroup, new THREE.TorusGeometry(1.30, 0.10, 8, 24), strp, [0, 3.35, 0], [Math.PI / 2, 0, 0]);
		return { seatOffsetY: 0.62, hoverY: 0.44, hoverAmp: 0.18 };
	} else if (builderName === "pirateGalleon") {
		const hull = spkmodVehMat(THREE, 0x78350f), trim = spkmodVehMat(THREE, 0xb45309), sail = spkmodVehMat(THREE, 0xf8fafc), wave = spkmodVehMat(THREE, 0x38bdf8, { transparent: true, opacity: 0.55, side: THREE.DoubleSide });
		// Shifted forward so the mast, billowing sail & flag stand cleanly ahead of the player on the rear deck!
		put(bodyGroup, new THREE.BoxGeometry(1.42, 0.68, 2.75), hull, [0, 0.44, 0.42]);
		put(bodyGroup, new THREE.BoxGeometry(1.46, 0.14, 2.78), trim, [0, 0.78, 0.42]);
		put(bodyGroup, new THREE.ConeGeometry(0.88, 1.02, 4), hull, [0, 0.44, 2.24], [Math.PI / 2, Math.PI / 4, 0]);
		// Forward mast, crossbar, billowing sail & top Jolly Roger flag
		put(bodyGroup, new THREE.CylinderGeometry(0.06, 0.08, 2.55, 10), hull, [0, 1.88, 1.08]);
		put(bodyGroup, new THREE.CylinderGeometry(0.04, 0.04, 1.62, 8), trim, [0, 2.52, 1.16], [0, 0, Math.PI / 2]);
		put(bodyGroup, new THREE.BoxGeometry(1.54, 1.18, 0.08), sail, [0, 1.98, 1.20]);
		put(bodyGroup, new THREE.BoxGeometry(0.48, 0.30, 0.05), darkMat, [0, 3.00, 1.08]);
		// Cute captain's steering wheel in front of the player
		put(bodyGroup, new THREE.TorusGeometry(0.24, 0.035, 8, 14), trim, [0, 1.06, 0.56]);
		const wRing = put(bodyGroup, new THREE.RingGeometry(1.20, 1.75, 22), wave, [0, 0.06, 0.42], [Math.PI / 2, 0, 0]);
		animParts.push({ type: "pulseScale", node: wRing, speed: 3.8, amp: 0.10 });
		return { seatOffsetY: 0.84, hoverY: 0.16, hoverAmp: 0.09 };
	} else if (builderName === "chibiHeli") {
		put(bodyGroup, new THREE.SphereGeometry(0.86, 18, 14), paintMat, [0, 0.84, 0.12], null, [0.95, 0.85, 1.25]);
		put(bodyGroup, new THREE.SphereGeometry(0.68, 14, 10), glassMat, [0, 0.92, 0.56], null, [0.9, 0.75, 0.8]);
		put(bodyGroup, new THREE.CylinderGeometry(0.14, 0.24, 1.62, 10), paintMat, [0, 0.92, -1.26], [Math.PI / 2, 0, 0]);
		for (const sx of [-0.62, 0.62]) put(bodyGroup, new THREE.CylinderGeometry(0.05, 0.05, 1.76, 8), chromeMat, [sx, 0.12, 0.12], [Math.PI / 2, 0, 0]);
		// Fast-spinning overhead rotor & tail rotor!
		const mainRotor = new THREE.Group();
		mainRotor.position.set(0, 1.74, 0.10);
		put(mainRotor, new THREE.BoxGeometry(2.75, 0.05, 0.20), darkMat);
		put(mainRotor, new THREE.BoxGeometry(0.20, 0.05, 2.75), darkMat);
		bodyGroup.add(mainRotor);
		animParts.push({ type: "spinY", node: mainRotor, speed: 18.0 });

		const tailRotor = new THREE.Group();
		tailRotor.position.set(0.18, 0.96, -2.04);
		put(tailRotor, new THREE.BoxGeometry(0.05, 0.72, 0.10), darkMat);
		bodyGroup.add(tailRotor);
		animParts.push({ type: "spinX", node: tailRotor, speed: 22.0 });
		return { seatOffsetY: 1.56, hoverY: 0.42, hoverAmp: 0.11 };
	} else if (builderName === "chickenMech") {
		const visor = spkmodVehMat(THREE, 0x22d3ee, { emissive: 0x06b6d4, emissiveIntensity: 0.9 });
		put(bodyGroup, new THREE.BoxGeometry(1.48, 1.12, 1.44), paintMat, [0, 1.72, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.16, 0.34, 0.18), visor, [0, 1.84, 0.70]);
		for (const s of [-1, 1]) {
			// Side twin cannons
			put(bodyGroup, new THREE.CylinderGeometry(0.10, 0.12, 0.96, 10), darkMat, [s * 0.88, 1.66, 0.36], [Math.PI / 2, 0, 0]);
			// Articulated stomping mechanical legs!
			const leg = new THREE.Group();
			leg.position.set(s * 0.56, 1.16, 0);
			put(leg, new THREE.BoxGeometry(0.26, 0.68, 0.30), chromeMat, [0, -0.30, -0.14], [0.35, 0, 0]);
			put(leg, new THREE.BoxGeometry(0.24, 0.68, 0.28), darkMat, [0, -0.82, 0.06], [-0.25, 0, 0]);
			put(leg, new THREE.BoxGeometry(0.42, 0.16, 0.66), paintMat, [0, -1.08, 0.18]);
			bodyGroup.add(leg);
			animParts.push({ type: "legWalk", node: leg, side: s });
		}
		return { seatOffsetY: 2.30 };
	}
	return spkmodBuildCenturyProceduralVehicle(THREE, builderName, colorHex, root, bodyGroup, mats, wheels, animParts, put);
}

function spkmodBuildCenturyProceduralVehicle(THREE, builderName, colorHex, root, bodyGroup, mats, wheels, animParts, put) {
	const { tireMat, rimMat, paintMat, chromeMat, glassMat, darkMat, headLightMat, tailLightMat } = mats;
	const addCenterWheel = (r, w, z, tMat = tireMat, rMat = rimMat) => {
		const g = new THREE.Group();
		g.position.set(0, r, z);
		put(g, new THREE.CylinderGeometry(r, r, w, 16), tMat, null, [0, 0, Math.PI / 2]);
		put(g, new THREE.CylinderGeometry(r * 0.55, r * 0.55, w + 0.02, 12), rMat, null, [0, 0, Math.PI / 2]);
		bodyGroup.add(g);
		wheels.push(g);
		return g;
	};

	// ========================================================================
	// A. 12 NEW STEALTH PROPS (hidePlayer: true, sneak feet + !/? alert)
	// ========================================================================
	if (builderName === "stealthPlant") {
		const soil = spkmodVehMat(THREE, 0x451a03), cac = spkmodVehMat(THREE, 0x16a34a), cacHi = spkmodVehMat(THREE, 0x22c55e), flw = spkmodVehMat(THREE, 0xf472b6);
		put(bodyGroup, new THREE.CylinderGeometry(0.58, 0.44, 0.68, 16), paintMat, [0, 0.34, 0]);
		put(bodyGroup, new THREE.CylinderGeometry(0.64, 0.60, 0.14, 16), paintMat, [0, 0.68, 0]);
		put(bodyGroup, new THREE.CylinderGeometry(0.54, 0.54, 0.05, 16), soil, [0, 0.72, 0]);
		// Main ribbed saguaro trunk + rounded cap
		put(bodyGroup, new THREE.CylinderGeometry(0.28, 0.30, 1.08, 12), cac, [0, 1.24, 0]);
		put(bodyGroup, new THREE.SphereGeometry(0.28, 12, 10), cacHi, [0, 1.78, 0]);
		// Classic left & right cactus arms
		for (const [s, ay, ah] of [[-1, 1.18, 0.46], [1, 1.32, 0.38]]) {
			put(bodyGroup, new THREE.CylinderGeometry(0.14, 0.15, 0.44, 10), cac, [s * 0.36, ay, 0], [0, 0, Math.PI / 2]);
			put(bodyGroup, new THREE.CylinderGeometry(0.14, 0.15, ah, 10), cac, [s * 0.56, ay + ah * 0.5, 0]);
			put(bodyGroup, new THREE.SphereGeometry(0.14, 10, 8), cacHi, [s * 0.56, ay + ah, 0]);
		}
		// Cute pink cactus flower blooming on top!
		put(bodyGroup, new THREE.SphereGeometry(0.14, 10, 8), flw, [0, 2.06, 0.04], null, [1.2, 0.7, 1.2]);
		put(bodyGroup, new THREE.SphereGeometry(0.07, 8, 8), headLightMat, [0, 2.12, 0.06]);
		return { seatOffsetY: 0, extra: spkmodAttachStealthRig(THREE, root, 2.55) };
	} else if (builderName === "stealthMailbox") {
		const wht = spkmodVehMat(THREE, 0xf8fafc);
		for (const [x, z] of [[-0.40, 0.32], [0.40, 0.32], [-0.40, -0.32], [0.40, -0.32]]) {
			put(bodyGroup, new THREE.BoxGeometry(0.14, 0.36, 0.14), darkMat, [x, 0.18, z]);
		}
		put(bodyGroup, new THREE.BoxGeometry(1.06, 0.96, 0.86), paintMat, [0, 0.82, 0]);
		put(bodyGroup, new THREE.CylinderGeometry(0.43, 0.43, 1.06, 16), paintMat, [0, 1.30, 0], [0, 0, Math.PI / 2]);
		put(bodyGroup, new THREE.BoxGeometry(0.54, 0.36, 0.04), wht, [0, 0.78, 0.44]);
		const slotFlap = new THREE.Group();
		slotFlap.position.set(0, 1.18, 0.45);
		put(slotFlap, new THREE.BoxGeometry(0.66, 0.14, 0.08), chromeMat);
		bodyGroup.add(slotFlap);
		animParts.push({ type: "lidBounce", node: slotFlap, baseY: 1.18 });
		return { seatOffsetY: 0, extra: spkmodAttachStealthRig(THREE, root, 2.15) };
	} else if (builderName === "stealthHydrant") {
		const red = spkmodVehMat(THREE, 0xdc2626), redDark = spkmodVehMat(THREE, 0x991b1b);
		put(bodyGroup, new THREE.CylinderGeometry(0.56, 0.62, 0.20, 16), redDark, [0, 0.10, 0]);
		put(bodyGroup, new THREE.CylinderGeometry(0.44, 0.48, 1.08, 16), red, [0, 0.72, 0]);
		put(bodyGroup, new THREE.CylinderGeometry(0.52, 0.52, 0.12, 16), redDark, [0, 1.24, 0]);
		put(bodyGroup, new THREE.SphereGeometry(0.44, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), red, [0, 1.28, 0]);
		put(bodyGroup, new THREE.CylinderGeometry(0.14, 0.16, 0.18, 6), chromeMat, [0, 1.76, 0]);
		for (const s of [-1, 1]) {
			put(bodyGroup, new THREE.CylinderGeometry(0.16, 0.16, 0.34, 12), red, [s * 0.52, 0.92, 0], [0, 0, Math.PI / 2]);
			put(bodyGroup, new THREE.CylinderGeometry(0.18, 0.18, 0.08, 8), chromeMat, [s * 0.68, 0.92, 0], [0, 0, Math.PI / 2]);
		}
		put(bodyGroup, new THREE.CylinderGeometry(0.20, 0.20, 0.24, 12), chromeMat, [0, 0.86, 0.46], [Math.PI / 2, 0, 0]);
		return { seatOffsetY: 0, extra: spkmodAttachStealthRig(THREE, root, 2.25) };
	} else if (builderName === "stealthOnigiri") {
		const rice = spkmodVehMat(THREE, 0xfefce8), nori = spkmodVehMat(THREE, 0x14532d), plum = spkmodVehMat(THREE, 0xe11d48);
		// Upright chunky triangular riceball prism (apex pointing +Y up, flat base on y=0!)
		put(bodyGroup, new THREE.CylinderGeometry(0.86, 0.86, 0.88, 3), rice, [0, 0.44, 0], [-Math.PI / 2, 0, 0], [1.08, 1, 1.05]);
		put(bodyGroup, new THREE.SphereGeometry(0.56, 14, 12), rice, [0, 0.62, 0], null, [1.22, 1.02, 0.92]);
		// Crisp roasted nori wrapper across bottom center
		put(bodyGroup, new THREE.BoxGeometry(0.76, 0.56, 0.96), nori, [0, 0.28, 0]);
		// Cute pickled umeboshi peek dot & toasted sesame seeds
		put(bodyGroup, new THREE.SphereGeometry(0.10, 8, 8), plum, [0, 0.86, 0.44]);
		for (const [x, y] of [[-0.24, 0.72], [0.26, 0.68], [0.06, 1.04], [-0.14, 0.98]]) {
			put(bodyGroup, new THREE.SphereGeometry(0.032, 6, 6), darkMat, [x, y, 0.45]);
		}
		return { seatOffsetY: 0, extra: spkmodAttachStealthRig(THREE, root, 2.02) };
	} else if (builderName === "stealthTpRoll") {
		const paper = spkmodVehMat(THREE, 0xf8fafc), tube = spkmodVehMat(THREE, 0xb45309), core = spkmodVehMat(THREE, 0x451a03);
		put(bodyGroup, new THREE.CylinderGeometry(0.62, 0.62, 1.24, 24), paper, [0, 0.64, 0]);
		put(bodyGroup, new THREE.CylinderGeometry(0.22, 0.22, 1.26, 16), tube, [0, 0.64, 0]);
		put(bodyGroup, new THREE.CylinderGeometry(0.18, 0.18, 1.27, 16), core, [0, 0.64, 0]);
		// Loose hanging paper flap on the side
		const flap = put(bodyGroup, new THREE.BoxGeometry(0.05, 0.82, 0.58), paper, [0.64, 0.62, 0.24], [0, 0.32, -0.08]);
		animParts.push({ type: "lidBounce", node: flap, baseY: 0.62 });
		return { seatOffsetY: 0, extra: spkmodAttachStealthRig(THREE, root, 2.02) };
	} else if (builderName === "stealthPumpkin") {
		const pmp = spkmodVehMat(THREE, 0xf97316), pmp2 = spkmodVehMat(THREE, 0xea580c), stem = spkmodVehMat(THREE, 0x15803d);
		const glow = spkmodVehMat(THREE, 0xfef08a, { emissive: 0xfacc15, emissiveIntensity: 0.95 });
		for (let i = 0; i < 6; i++) {
			const a = (i / 6) * Math.PI * 2;
			put(bodyGroup, new THREE.SphereGeometry(0.56, 14, 12), i % 2 ? pmp2 : pmp, [Math.cos(a) * 0.24, 0.64, Math.sin(a) * 0.24], null, [1.0, 0.92, 1.0]);
		}
		put(bodyGroup, new THREE.CylinderGeometry(0.08, 0.16, 0.36, 10), stem, [0, 1.28, -0.04], [-0.22, 0, 0.18]);
		// Glowing spooky triangle eyes + grin
		for (const s of [-1, 1]) put(bodyGroup, new THREE.ConeGeometry(0.16, 0.24, 3), glow, [s * 0.26, 0.80, 0.72]);
		put(bodyGroup, new THREE.BoxGeometry(0.58, 0.14, 0.10), glow, [0, 0.44, 0.74]);
		for (const sx of [-0.14, 0.14]) put(bodyGroup, new THREE.BoxGeometry(0.09, 0.08, 0.12), pmp2, [sx, 0.47, 0.76]);
		return { seatOffsetY: 0, extra: spkmodAttachStealthRig(THREE, root, 2.15) };
	} else if (builderName === "stealthTent") {
		const trim = spkmodVehMat(THREE, 0xfef08a), inside = spkmodVehMat(THREE, 0x0f172a);
		// Upright A-frame pitched tent (Rx = -PI/2 maps +Z apex to +Y roof peak and flat base onto y = 0!)
		put(bodyGroup, new THREE.CylinderGeometry(1.04, 1.04, 1.66, 3), paintMat, [0, 0.52, 0], [-Math.PI / 2, 0, 0], [1.04, 1, 1.02]);
		put(bodyGroup, new THREE.CylinderGeometry(0.58, 0.58, 0.12, 3), inside, [0, 0.29, 0.82], [-Math.PI / 2, 0, 0]);
		put(bodyGroup, new THREE.CylinderGeometry(0.04, 0.04, 1.82, 8), trim, [0, 1.56, 0], [Math.PI / 2, 0, 0]);
		for (const [x, z] of [[-0.92, 0.82], [0.92, 0.82], [-0.92, -0.82], [0.92, -0.82]]) {
			put(bodyGroup, new THREE.CylinderGeometry(0.03, 0.02, 0.22, 6), chromeMat, [x, 0.10, z]);
		}
		return { seatOffsetY: 0, extra: spkmodAttachStealthRig(THREE, root, 2.25) };
	} else if (builderName === "stealthChest") {
		const wood = spkmodVehMat(THREE, 0x78350f), gold = spkmodVehMat(THREE, 0xfacc15, { emissive: 0xd97706, emissiveIntensity: 0.25 });
		put(bodyGroup, new THREE.BoxGeometry(1.36, 0.72, 1.02), wood, [0, 0.36, 0]);
		for (const sx of [-0.62, 0.62]) put(bodyGroup, new THREE.BoxGeometry(0.14, 0.76, 1.06), gold, [sx, 0.38, 0]);
		put(bodyGroup, new THREE.BoxGeometry(0.24, 0.28, 0.08), gold, [0, 0.64, 0.52]);
		// Glittering gold coins peeking inside!
		for (let i = -2; i <= 2; i++) put(bodyGroup, new THREE.CylinderGeometry(0.14, 0.14, 0.08, 10), gold, [i * 0.22, 0.74, (i % 2) * 0.14]);
		// Chattering treasure chest lid!
		const lid = new THREE.Group();
		lid.position.set(0, 0.74, 0);
		put(lid, new THREE.CylinderGeometry(0.51, 0.51, 1.36, 14, 1, false, 0, Math.PI), wood, [0, 0, 0], [0, 0, Math.PI / 2]);
		for (const sx of [-0.62, 0.62]) put(lid, new THREE.CylinderGeometry(0.54, 0.54, 0.14, 14, 1, false, 0, Math.PI), gold, [sx, 0, 0], [0, 0, Math.PI / 2]);
		bodyGroup.add(lid);
		animParts.push({ type: "lidBounce", node: lid, baseY: 0.74 });
		return { seatOffsetY: 0, extra: spkmodAttachStealthRig(THREE, root, 2.05) };
	} else if (builderName === "stealthWasher") {
		const wht = spkmodVehMat(THREE, 0xf8fafc), water = spkmodVehMat(THREE, 0x38bdf8, { transparent: true, opacity: 0.72 });
		put(bodyGroup, new THREE.BoxGeometry(1.22, 1.42, 1.16), wht, [0, 0.71, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.24, 0.24, 0.08), chromeMat, [0, 1.24, 0.56]);
		put(bodyGroup, new THREE.CylinderGeometry(0.08, 0.08, 0.08, 12), darkMat, [0.34, 1.24, 0.61], [Math.PI / 2, 0, 0]);
		put(bodyGroup, new THREE.BoxGeometry(0.32, 0.14, 0.06), spkmodVehMat(THREE, 0x22c55e, { emissive: 0x22c55e, emissiveIntensity: 0.7 }), [-0.34, 1.24, 0.60]);
		// Spinning laundry porthole drum!
		put(bodyGroup, new THREE.TorusGeometry(0.42, 0.07, 10, 24), chromeMat, [0, 0.58, 0.59]);
		const drum = new THREE.Group();
		drum.position.set(0, 0.58, 0.57);
		put(drum, new THREE.CylinderGeometry(0.39, 0.39, 0.04, 20), water, [0, 0, 0], [Math.PI / 2, 0, 0]);
		put(drum, new THREE.SphereGeometry(0.14, 8, 8), spkmodVehMat(THREE, 0xf43f5e), [0.16, 0.12, 0.03]);
		put(drum, new THREE.SphereGeometry(0.12, 8, 8), spkmodVehMat(THREE, 0xfacc15), [-0.15, -0.14, 0.03]);
		put(drum, new THREE.SphereGeometry(0.11, 8, 8), spkmodVehMat(THREE, 0x4ade80), [-0.14, 0.14, 0.03]);
		bodyGroup.add(drum);
		animParts.push({ type: "spinZ", node: drum, speed: 6.5 });
		return { seatOffsetY: 0, extra: spkmodAttachStealthRig(THREE, root, 2.15) };
	} else if (builderName === "stealthVending") {
		const disp = spkmodVehMat(THREE, 0xe0f2fe, { emissive: 0xbae6fd, emissiveIntensity: 0.35 });
		const canCols = [0xef4444, 0x3b82f6, 0x22c55e, 0xfacc15, 0xf472b6, 0xf97316];
		put(bodyGroup, new THREE.BoxGeometry(1.22, 1.98, 1.04), paintMat, [0, 0.99, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.02, 0.92, 0.08), disp, [0, 1.38, 0.51]);
		// 3 neat rows of glowing mini drink cans!
		for (let r = 0; r < 3; r++) {
			for (let c = 0; c < 4; c++) {
				const cm = spkmodVehMat(THREE, canCols[(r * 4 + c) % canCols.length]);
				put(bodyGroup, new THREE.CylinderGeometry(0.06, 0.06, 0.18, 8), cm, [-0.33 + c * 0.22, 1.66 - r * 0.28, 0.56]);
			}
		}
		// Dark dispensing chute & glowing price display
		put(bodyGroup, new THREE.BoxGeometry(0.92, 0.34, 0.08), darkMat, [0, 0.34, 0.51]);
		put(bodyGroup, new THREE.BoxGeometry(0.24, 0.12, 0.06), spkmodVehMat(THREE, 0x4ade80, { emissive: 0x22c55e, emissiveIntensity: 0.85 }), [0.34, 0.74, 0.53]);
		return { seatOffsetY: 0, extra: spkmodAttachStealthRig(THREE, root, 2.55) };
	} else if (builderName === "stealthArcade") {
		const crt = spkmodVehMat(THREE, 0x22d3ee, { emissive: 0x06b6d4, emissiveIntensity: 0.85 });
		const marq = spkmodVehMat(THREE, 0xfde047, { emissive: 0xf59e0b, emissiveIntensity: 0.9 });
		put(bodyGroup, new THREE.BoxGeometry(1.16, 1.92, 1.06), darkMat, [0, 0.96, 0]);
		for (const s of [-1, 1]) put(bodyGroup, new THREE.BoxGeometry(0.08, 1.94, 1.08), paintMat, [s * 0.58, 0.97, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.06, 0.28, 0.12), marq, [0, 1.76, 0.54]);
		const screen = put(bodyGroup, new THREE.BoxGeometry(0.94, 0.66, 0.08), crt, [0, 1.24, 0.48], [-0.20, 0, 0]);
		animParts.push({ type: "pulseScale", node: screen, speed: 5.0, amp: 0.04 });
		// Control deck with joystick + arcade buttons
		put(bodyGroup, new THREE.BoxGeometry(1.14, 0.14, 0.42), paintMat, [0, 0.82, 0.62]);
		put(bodyGroup, new THREE.CylinderGeometry(0.025, 0.025, 0.14, 8), chromeMat, [-0.26, 0.94, 0.66]);
		put(bodyGroup, new THREE.SphereGeometry(0.07, 10, 8), tailLightMat, [-0.26, 1.02, 0.66]);
		for (let i = 0; i < 3; i++) {
			put(bodyGroup, new THREE.CylinderGeometry(0.05, 0.05, 0.04, 10), i === 0 ? headLightMat : (i === 1 ? crt : tailLightMat), [0.06 + i * 0.14, 0.90, 0.66]);
		}
		put(bodyGroup, new THREE.BoxGeometry(0.36, 0.34, 0.06), chromeMat, [0, 0.42, 0.54]);
		return { seatOffsetY: 0, extra: spkmodAttachStealthRig(THREE, root, 2.50) };
	} else if (builderName === "stealthPillar") {
		const mrb = spkmodVehMat(THREE, 0xf1f5f9), mrb2 = spkmodVehMat(THREE, 0xcbd5e1);
		put(bodyGroup, new THREE.BoxGeometry(1.24, 0.20, 1.24), mrb2, [0, 0.10, 0]);
		put(bodyGroup, new THREE.CylinderGeometry(0.54, 0.58, 0.16, 16), mrb, [0, 0.28, 0]);
		put(bodyGroup, new THREE.CylinderGeometry(0.46, 0.48, 1.46, 12), mrb, [0, 1.08, 0]);
		// Fluted ribs around shaft
		for (let i = 0; i < 8; i++) {
			const a = (i / 8) * Math.PI * 2;
			put(bodyGroup, new THREE.CylinderGeometry(0.06, 0.06, 1.44, 6), mrb2, [Math.cos(a) * 0.46, 1.08, Math.sin(a) * 0.46]);
		}
		put(bodyGroup, new THREE.BoxGeometry(1.28, 0.22, 1.28), mrb, [0, 1.92, 0]);
		for (const s of [-1, 1]) put(bodyGroup, new THREE.CylinderGeometry(0.18, 0.18, 1.20, 12), mrb2, [s * 0.52, 1.82, 0], [Math.PI / 2, 0, 0]);
		return { seatOffsetY: 0, extra: spkmodAttachStealthRig(THREE, root, 2.55) };
	}

	// ========================================================================
	// B. 10 NEW FUN / MEME RIDES
	// ========================================================================
	if (builderName === "skateboard") {
		const grip = spkmodVehMat(THREE, 0x1e293b), whl = spkmodVehMat(THREE, 0xfef08a);
		put(bodyGroup, new THREE.BoxGeometry(0.56, 0.07, 1.48), paintMat, [0, 0.22, 0]);
		put(bodyGroup, new THREE.BoxGeometry(0.52, 0.08, 1.42), grip, [0, 0.23, 0]);
		// Kicktails front & back
		for (const s of [-1, 1]) {
			put(bodyGroup, new THREE.BoxGeometry(0.54, 0.07, 0.34), paintMat, [0, 0.27, s * 0.86], [s * -0.28, 0, 0]);
			put(bodyGroup, new THREE.BoxGeometry(0.56, 0.06, 0.08), chromeMat, [0, 0.13, s * 0.56]);
		}
		spkmodAddWheelPair(THREE, bodyGroup, 0.30, 0.10, 0.56, 0.10, 0.09, whl, paintMat, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.30, 0.10, -0.56, 0.10, 0.09, whl, paintMat, wheels);
		return { seatOffsetY: 0.32, wheelRadius: 0.10 };
	} else if (builderName === "redWagon") {
		put(bodyGroup, new THREE.BoxGeometry(1.16, 0.38, 1.82), paintMat, [0, 0.52, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.06, 0.32, 1.72), darkMat, [0, 0.58, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.24, 0.07, 1.90), chromeMat, [0, 0.72, 0]);
		// Classic front pull handle
		put(bodyGroup, new THREE.CylinderGeometry(0.035, 0.035, 1.18, 8), darkMat, [0, 0.88, 1.24], [0.65, 0, 0]);
		put(bodyGroup, new THREE.TorusGeometry(0.14, 0.03, 8, 14), darkMat, [0, 1.36, 1.60], [0.65, 0, 0]);
		spkmodAddWheelPair(THREE, bodyGroup, 0.62, 0.24, 0.66, 0.24, 0.14, tireMat, rimMat, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.62, 0.24, -0.66, 0.24, 0.14, tireMat, rimMat, wheels);
		return { seatOffsetY: 0.72, wheelRadius: 0.24 };
	} else if (builderName === "pizzaSlice") {
		const cheese = spkmodVehMat(THREE, 0xfacc15), crust = spkmodVehMat(THREE, 0xd97706), pep = spkmodVehMat(THREE, 0xdc2626), basil = spkmodVehMat(THREE, 0x16a34a);
		// Pointy pizza tip faces +Z forward; flat back edge aligns cleanly with the golden crust cylinder!
		put(bodyGroup, new THREE.CylinderGeometry(1.36, 1.36, 0.16, 3), cheese, [0, 0.08, 0.14], [0, 0, 0], [0.95, 1, 1.12]);
		put(bodyGroup, new THREE.CylinderGeometry(0.18, 0.18, 2.24, 12), crust, [0, 0.14, -0.62], [0, 0, Math.PI / 2]);
		for (const [x, z] of [[0, 0.66], [-0.34, 0.04], [0.34, 0.04], [0, -0.26], [-0.56, -0.34], [0.56, -0.34]]) {
			put(bodyGroup, new THREE.CylinderGeometry(0.19, 0.19, 0.05, 12), pep, [x, 0.18, z]);
		}
		for (const [x, z] of [[-0.14, 0.34], [0.24, -0.18], [-0.36, -0.20]]) {
			put(bodyGroup, new THREE.BoxGeometry(0.18, 0.04, 0.10), basil, [x, 0.19, z], [0, 0.6, 0]);
		}
		return { seatOffsetY: 0.56, hoverY: 0.38, hoverAmp: 0.12 };
	} else if (builderName === "teacupRide") {
		const wht = spkmodVehMat(THREE, 0xf8fafc), gld = spkmodVehMat(THREE, 0xfacc15);
		put(bodyGroup, new THREE.CylinderGeometry(1.24, 1.02, 0.14, 24), wht, [0, 0.12, 0]);
		put(bodyGroup, new THREE.TorusGeometry(1.16, 0.04, 8, 24), gld, [0, 0.19, 0], [Math.PI / 2, 0, 0]);
		const cupSpin = new THREE.Group();
		bodyGroup.add(cupSpin);
		put(cupSpin, new THREE.CylinderGeometry(0.96, 0.64, 0.88, 22), paintMat, [0, 0.62, 0]);
		put(cupSpin, new THREE.TorusGeometry(0.96, 0.055, 8, 24), gld, [0, 1.04, 0], [Math.PI / 2, 0, 0]);
		put(cupSpin, new THREE.TorusGeometry(0.30, 0.08, 10, 16), paintMat, [0.98, 0.64, 0], [0, 0, -0.15]);
		put(cupSpin, new THREE.CylinderGeometry(0.18, 0.18, 0.56, 12), gld, [0, 0.66, 0]);
		animParts.push({ type: "spinMoveY", node: cupSpin, speed: 5.5 });
		return { seatOffsetY: 0.78 };
	} else if (builderName === "ramenBowl") {
		const blk = spkmodVehMat(THREE, 0x0f172a), red = spkmodVehMat(THREE, 0xdc2626), broth = spkmodVehMat(THREE, 0xd97706);
		const eggW = spkmodVehMat(THREE, 0xfefce8), yolk = spkmodVehMat(THREE, 0xf97316), nori = spkmodVehMat(THREE, 0x14532d), pink = spkmodVehMat(THREE, 0xf472b6);
		const steamM = spkmodVehMat(THREE, 0xffffff, { transparent: true, opacity: 0.62 });
		put(bodyGroup, new THREE.CylinderGeometry(1.14, 0.62, 0.86, 22), blk, [0, 0.46, 0]);
		put(bodyGroup, new THREE.TorusGeometry(1.12, 0.07, 10, 24), red, [0, 0.88, 0], [Math.PI / 2, 0, 0]);
		put(bodyGroup, new THREE.CylinderGeometry(1.04, 1.04, 0.06, 20), broth, [0, 0.84, 0]);
		// Toppings: narutomaki fishcake, soft-boiled egg, nori sheets & chopsticks!
		put(bodyGroup, new THREE.CylinderGeometry(0.22, 0.22, 0.06, 14), eggW, [0.46, 0.89, 0.42]);
		put(bodyGroup, new THREE.TorusGeometry(0.10, 0.03, 6, 12), pink, [0.46, 0.93, 0.42], [Math.PI / 2, 0, 0]);
		put(bodyGroup, new THREE.SphereGeometry(0.24, 12, 10), eggW, [-0.46, 0.88, 0.36], null, [1, 0.45, 1.3]);
		put(bodyGroup, new THREE.SphereGeometry(0.13, 10, 8), yolk, [-0.46, 0.93, 0.36], null, [1, 0.6, 1]);
		put(bodyGroup, new THREE.BoxGeometry(0.46, 0.56, 0.05), nori, [-0.62, 1.06, -0.58], [-0.22, 0.45, 0]);
		for (const dz of [-0.08, 0.08]) put(bodyGroup, new THREE.CylinderGeometry(0.025, 0.04, 1.85, 8), spkmodVehMat(THREE, 0xb45309), [0.56, 1.04, dz], [0, 0, -1.24]);
		for (let i = 0; i < 3; i++) {
			const puff = put(bodyGroup, new THREE.SphereGeometry(0.16, 10, 8), steamM, [(i - 1) * 0.44, 1.48 + i * 0.14, -0.25]);
			animParts.push({ type: "bobY", node: puff, baseY: 1.48 + i * 0.14, speed: 3.0 + i * 0.6, amp: 0.16 });
		}
		return { seatOffsetY: 0.96, hoverY: 0.24, hoverAmp: 0.08 };
	} else if (builderName === "corgiRide") {
		const tan = spkmodVehMat(THREE, 0xea8c28), wht = spkmodVehMat(THREE, 0xfefce8), pink = spkmodVehMat(THREE, 0xfb7185), col = spkmodVehMat(THREE, 0xef4444);
		// Chonky loaf body + white chest + fluffy butt
		put(bodyGroup, new THREE.BoxGeometry(1.18, 0.84, 1.92), tan, [0, 0.68, 0]);
		put(bodyGroup, new THREE.SphereGeometry(0.60, 14, 12), wht, [0, 0.64, 0.84], null, [0.95, 0.80, 0.72]);
		put(bodyGroup, new THREE.SphereGeometry(0.56, 14, 12), wht, [0, 0.68, -0.88], null, [0.98, 0.82, 0.65]);
		// Big cute head + pointy ears + boopable nose
		put(bodyGroup, new THREE.SphereGeometry(0.54, 16, 14), tan, [0, 1.16, 1.08], null, [1.05, 0.94, 1.0]);
		put(bodyGroup, new THREE.SphereGeometry(0.32, 12, 10), wht, [0, 1.04, 1.48], null, [1.0, 0.75, 0.95]);
		put(bodyGroup, new THREE.SphereGeometry(0.10, 8, 8), darkMat, [0, 1.10, 1.78]);
		for (const s of [-1, 1]) {
			put(bodyGroup, new THREE.ConeGeometry(0.22, 0.56, 4), tan, [s * 0.36, 1.66, 1.04], [0, 0, s * -0.26]);
			put(bodyGroup, new THREE.ConeGeometry(0.12, 0.34, 4), pink, [s * 0.36, 1.62, 1.12], [0, 0, s * -0.26]);
			put(bodyGroup, new THREE.SphereGeometry(0.065, 8, 8), darkMat, [s * 0.22, 1.24, 1.56]);
			// Cute stubby corgi paws
			for (const sz of [0.64, -0.64]) {
				const paw = put(bodyGroup, new THREE.CylinderGeometry(0.14, 0.14, 0.36, 10), wht, [s * 0.42, 0.18, sz]);
				animParts.push({ type: "legWalk", node: paw, side: sz > 0 ? s : -s });
			}
		}
		put(bodyGroup, new THREE.TorusGeometry(0.46, 0.065, 8, 18), col, [0, 0.96, 0.88], [1.2, 0, 0]);
		return { seatOffsetY: 1.14, extra: { hopAmp: 0.18 } };
	} else if (builderName === "hamsterBall") {
		const shellMat = spkmodVehMat(THREE, colorHex, { transparent: true, opacity: 0.36 });
		const bandMat = spkmodVehMat(THREE, colorHex, { transparent: true, opacity: 0.78 });
		const ballGrp = new THREE.Group();
		ballGrp.position.set(0, 1.12, 0);
		put(ballGrp, new THREE.SphereGeometry(1.12, 22, 18), shellMat);
		put(ballGrp, new THREE.TorusGeometry(1.12, 0.065, 8, 28), bandMat, [0, 0, 0], [0, Math.PI / 2, 0]);
		put(ballGrp, new THREE.TorusGeometry(1.12, 0.055, 8, 28), chromeMat, [0, 0, 0], [Math.PI / 2, 0, 0]);
		for (let i = 0; i < 6; i++) {
			const a = (i / 6) * Math.PI * 2;
			put(ballGrp, new THREE.BoxGeometry(0.08, 0.28, 0.10), bandMat, [Math.cos(a) * 1.10, 0, Math.sin(a) * 1.10], [0, -a, 0]);
		}
		bodyGroup.add(ballGrp);
		animParts.push({ type: "rollForward", node: ballGrp, radius: 1.12 });
		return { seatOffsetY: 0.28 };
	} else if (builderName === "gamingChair") {
		const rgb1 = spkmodVehMat(THREE, 0x22d3ee, { emissive: 0x06b6d4, emissiveIntensity: 0.95 });
		const rgb2 = spkmodVehMat(THREE, 0xf472b6, { emissive: 0xec4899, emissiveIntensity: 0.95 });
		put(bodyGroup, new THREE.CylinderGeometry(0.09, 0.09, 0.50, 10), chromeMat, [0, 0.32, 0]);
		for (let i = 0; i < 5; i++) {
			const a = (i / 5) * Math.PI * 2;
			put(bodyGroup, new THREE.BoxGeometry(0.12, 0.08, 0.88), darkMat, [Math.sin(a) * 0.42, 0.14, Math.cos(a) * 0.42], [0, a, 0]);
			put(bodyGroup, new THREE.SphereGeometry(0.09, 8, 8), paintMat, [Math.sin(a) * 0.78, 0.09, Math.cos(a) * 0.78]);
		}
		const chairTop = new THREE.Group();
		bodyGroup.add(chairTop);
		put(chairTop, new THREE.BoxGeometry(1.38, 0.20, 1.28), darkMat, [0, 0.62, -0.06]);
		put(chairTop, new THREE.BoxGeometry(1.32, 1.62, 0.22), darkMat, [0, 1.46, -0.74]);
		// Side racing bolsters + glowing RGB edge strips + spacious armrests!
		for (const s of [-1, 1]) {
			put(chairTop, new THREE.BoxGeometry(0.18, 1.56, 0.28), paintMat, [s * 0.70, 1.44, -0.68]);
			put(chairTop, new THREE.BoxGeometry(0.07, 1.54, 0.07), s < 0 ? rgb1 : rgb2, [s * 0.80, 1.44, -0.56]);
			put(chairTop, new THREE.BoxGeometry(0.08, 0.34, 0.10), darkMat, [s * 0.74, 0.82, -0.08]);
			put(chairTop, new THREE.BoxGeometry(0.14, 0.09, 0.86), darkMat, [s * 0.74, 0.98, -0.02]);
		}
		// High neck pillow cleanly above Speaki's head/veil
		put(chairTop, new THREE.BoxGeometry(0.68, 0.24, 0.18), paintMat, [0, 2.04, -0.58]);
		animParts.push({ type: "spinMoveY", node: chairTop, speed: 5.5 });
		return { seatOffsetY: 0.72 };
	} else if (builderName === "giantCapybara") {
		const fur = spkmodVehMat(THREE, 0x92400e), furDark = spkmodVehMat(THREE, 0x78350f), yuzu = spkmodVehMat(THREE, 0xf97316), leaf = spkmodVehMat(THREE, 0x22c55e);
		// Chill chunky capybara body
		put(bodyGroup, new THREE.SphereGeometry(0.88, 18, 14), fur, [0, 0.72, -0.04], null, [0.95, 0.84, 1.38]);
		// Wide blunt rectangular capybara snoot & serene squinted eyes
		put(bodyGroup, new THREE.BoxGeometry(0.76, 0.66, 0.96), fur, [0, 1.06, 1.18]);
		put(bodyGroup, new THREE.BoxGeometry(0.68, 0.36, 0.24), furDark, [0, 0.96, 1.62]);
		for (const s of [-1, 1]) {
			put(bodyGroup, new THREE.BoxGeometry(0.18, 0.045, 0.06), darkMat, [s * 0.36, 1.18, 1.28]);
			put(bodyGroup, new THREE.SphereGeometry(0.12, 8, 8), furDark, [s * 0.36, 1.42, 0.86]);
			for (const sz of [0.68, -0.72]) put(bodyGroup, new THREE.CylinderGeometry(0.16, 0.14, 0.42, 10), furDark, [s * 0.46, 0.20, sz]);
		}
		// Iconic yuzu tangerine balanced right on top of its chill head!
		put(bodyGroup, new THREE.SphereGeometry(0.22, 14, 12), yuzu, [0, 1.56, 1.24], null, [1.05, 0.92, 1.05]);
		put(bodyGroup, new THREE.BoxGeometry(0.18, 0.04, 0.10), leaf, [0.10, 1.78, 1.24], [0, 0, 0.32]);
		return { seatOffsetY: 1.42, extra: { waddleAmp: 0.075 } };
	} else if (builderName === "royalThrone") {
		const gold = spkmodVehMat(THREE, 0xfacc15, { emissive: 0xd97706, emissiveIntensity: 0.28 });
		const gem = spkmodVehMat(THREE, 0x38bdf8, { emissive: 0x0ea5e9, emissiveIntensity: 0.9 });
		put(bodyGroup, new THREE.BoxGeometry(1.66, 0.26, 1.66), gold, [0, 0.28, -0.06]);
		put(bodyGroup, new THREE.BoxGeometry(1.38, 0.24, 1.34), paintMat, [0, 0.50, -0.02]);
		put(bodyGroup, new THREE.BoxGeometry(1.56, 1.78, 0.24), gold, [0, 1.40, -0.76]);
		put(bodyGroup, new THREE.BoxGeometry(1.26, 1.48, 0.26), paintMat, [0, 1.38, -0.72]);
		// Ornate armrests + twin palanquin carrying rails + glowing levitation gems
		for (const s of [-1, 1]) {
			put(bodyGroup, new THREE.BoxGeometry(0.22, 0.58, 1.34), gold, [s * 0.78, 0.72, -0.06]);
			put(bodyGroup, new THREE.CylinderGeometry(0.06, 0.06, 3.25, 10), gold, [s * 0.96, 0.30, 0], [Math.PI / 2, 0, 0]);
			const orb = put(bodyGroup, new THREE.OctahedronGeometry(0.16, 0), gem, [s * 0.96, 0.30, 1.68]);
			animParts.push({ type: "spinY", node: orb, speed: 3.5 });
		}
		// Crown crest atop the backrest!
		for (const [cx, cy] of [[-0.40, 2.42], [0, 2.54], [0.40, 2.42]]) {
			put(bodyGroup, new THREE.ConeGeometry(0.16, 0.38, 6), gold, [cx, cy, -0.74]);
		}
		put(bodyGroup, new THREE.OctahedronGeometry(0.14, 0), gem, [0, 2.38, -0.62]);
		return { seatOffsetY: 0.74, hoverY: 0.34, hoverAmp: 0.12 };
	}

	// ========================================================================
	// C. 19 NEW STREET VEHICLES
	// ========================================================================
	if (builderName === "tricycle") {
		addCenterWheel(0.46, 0.16, 0.78, tireMat, rimMat);
		spkmodAddWheelPair(THREE, bodyGroup, 0.58, 0.26, -0.64, 0.26, 0.14, tireMat, rimMat, wheels);
		put(bodyGroup, new THREE.CylinderGeometry(0.05, 0.05, 1.32, 10), paintMat, [0, 0.58, 0.04], [1.18, 0, 0]);
		put(bodyGroup, new THREE.CylinderGeometry(0.05, 0.05, 1.14, 10), paintMat, [0, 0.26, -0.64], [0, 0, Math.PI / 2]);
		put(bodyGroup, new THREE.CylinderGeometry(0.045, 0.045, 0.86, 10), chromeMat, [0, 0.88, 0.72], [-0.18, 0, 0]);
		put(bodyGroup, new THREE.CylinderGeometry(0.04, 0.04, 1.02, 10), chromeMat, [0, 1.28, 0.64], [0, 0, Math.PI / 2]);
		put(bodyGroup, new THREE.SphereGeometry(0.10, 10, 8), headLightMat, [0.22, 1.34, 0.66]);
		put(bodyGroup, new THREE.BoxGeometry(0.56, 0.12, 0.52), spkmodVehMat(THREE, 0xfef08a), [0, 0.78, -0.34]);
		return { seatOffsetY: 0.88, wheelRadius: 0.36 };
	} else if (builderName === "bumperCar") {
		const sparkM = spkmodVehMat(THREE, 0x38bdf8, { emissive: 0x06b6d4, emissiveIntensity: 0.95 });
		put(bodyGroup, new THREE.TorusGeometry(0.88, 0.26, 12, 24), tireMat, [0, 0.28, 0], [Math.PI / 2, 0, 0], [0.92, 1.24, 1]);
		put(bodyGroup, new THREE.SphereGeometry(0.86, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), paintMat, [0, 0.34, 0], null, [0.92, 0.82, 1.22]);
		put(bodyGroup, new THREE.BoxGeometry(0.92, 0.12, 0.20), chromeMat, [0, 0.52, 1.04]);
		put(bodyGroup, new THREE.TorusGeometry(0.22, 0.04, 8, 14), darkMat, [0, 0.98, 0.44], [0.55, 0, 0]);
		// Iconic tall rear bumper-car power pole with glowing electric orb!
		put(bodyGroup, new THREE.CylinderGeometry(0.03, 0.035, 2.25, 8), chromeMat, [0, 1.48, -0.96], [-0.10, 0, 0]);
		const sparkOrb = put(bodyGroup, new THREE.SphereGeometry(0.15, 10, 8), sparkM, [0, 2.62, -1.08]);
		animParts.push({ type: "pulseScale", node: sparkOrb, speed: 12.0, amp: 0.25 });
		return { seatOffsetY: 0.74, extra: { waddleAmp: 0.05 } };
	} else if (builderName === "goKart") {
		put(bodyGroup, new THREE.BoxGeometry(1.06, 0.22, 2.12), darkMat, [0, 0.26, 0]);
		put(bodyGroup, new THREE.BoxGeometry(0.76, 0.34, 0.76), paintMat, [0, 0.44, 0.78]);
		for (const s of [-1, 1]) put(bodyGroup, new THREE.BoxGeometry(0.28, 0.30, 1.18), paintMat, [s * 0.64, 0.36, 0.04]);
		put(bodyGroup, new THREE.BoxGeometry(0.68, 0.48, 0.56), chromeMat, [0, 0.56, -0.78]);
		put(bodyGroup, new THREE.CylinderGeometry(0.07, 0.08, 0.52, 10), darkMat, [0.42, 0.58, -1.04], [Math.PI / 2, 0, 0]);
		put(bodyGroup, new THREE.TorusGeometry(0.22, 0.04, 8, 14), darkMat, [0, 0.84, 0.38], [0.5, 0, 0]);
		spkmodAddWheelPair(THREE, bodyGroup, 0.72, 0.22, 0.78, 0.22, 0.20, tireMat, rimMat, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.78, 0.26, -0.76, 0.26, 0.26, tireMat, rimMat, wheels);
		return { seatOffsetY: 0.64, wheelRadius: 0.24 };
	} else if (builderName === "tukTuk") {
		const canopy = spkmodVehMat(THREE, 0xfefce8);
		put(bodyGroup, new THREE.BoxGeometry(1.26, 0.56, 2.02), paintMat, [0, 0.58, -0.06]);
		put(bodyGroup, new THREE.BoxGeometry(0.92, 0.86, 0.26), paintMat, [0, 0.84, 0.88], [-0.14, 0, 0]);
		put(bodyGroup, new THREE.BoxGeometry(0.84, 0.44, 0.08), glassMat, [0, 1.38, 0.82]);
		put(bodyGroup, new THREE.SphereGeometry(0.14, 10, 8), headLightMat, [0, 0.84, 1.04]);
		for (const [x, z] of [[-0.56, 0.72], [0.56, 0.72], [-0.56, -0.96], [0.56, -0.96]]) {
			put(bodyGroup, new THREE.CylinderGeometry(0.035, 0.035, 1.04, 8), chromeMat, [x, 1.34, z]);
		}
		put(bodyGroup, new THREE.BoxGeometry(1.34, 0.14, 1.92), canopy, [0, 1.88, -0.10]);
		put(bodyGroup, new THREE.BoxGeometry(1.38, 0.10, 1.96), paintMat, [0, 1.82, -0.10]);
		addCenterWheel(0.28, 0.18, 0.94);
		spkmodAddWheelPair(THREE, bodyGroup, 0.68, 0.28, -0.76, 0.28, 0.20, tireMat, rimMat, wheels);
		return { seatOffsetY: 0.96, wheelRadius: 0.28 };
	} else if (builderName === "yellowTaxi") {
		const cabY = spkmodVehMat(THREE, 0xeab308), wht = spkmodVehMat(THREE, 0xffffff);
		put(bodyGroup, new THREE.BoxGeometry(1.52, 0.50, 2.66), cabY, [0, 0.52, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.30, 0.48, 1.24), cabY, [0, 0.96, -0.08]);
		put(bodyGroup, new THREE.BoxGeometry(1.24, 0.38, 1.28), glassMat, [0, 0.96, -0.08]);
		// Classic checkered strip down both sides!
		for (let i = -5; i <= 5; i++) {
			const cm = (i % 2 === 0) ? darkMat : wht;
			for (const s of [-1, 1]) put(bodyGroup, new THREE.BoxGeometry(0.04, 0.12, 0.20), cm, [s * 0.77, 0.54, i * 0.22]);
		}
		put(bodyGroup, new THREE.BoxGeometry(0.56, 0.18, 0.24), headLightMat, [0, 1.28, 0.06]);
		for (const sx of [-0.52, 0.52]) {
			put(bodyGroup, new THREE.BoxGeometry(0.28, 0.14, 0.08), headLightMat, [sx, 0.56, 1.34]);
			put(bodyGroup, new THREE.BoxGeometry(0.28, 0.14, 0.08), tailLightMat, [sx, 0.56, -1.34]);
		}
		spkmodAddWheelPair(THREE, bodyGroup, 0.78, 0.32, 0.80, 0.32, 0.22, tireMat, rimMat, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.78, 0.32, -0.80, 0.32, 0.22, tireMat, rimMat, wheels);
		return { seatOffsetY: 1.26, wheelRadius: 0.32 };
	} else if (builderName === "beachBuggy") {
		// Low open cockpit tub + front sloped hood + rear deck so Speaki sits nestled right INSIDE the buggy!
		put(bodyGroup, new THREE.BoxGeometry(1.42, 0.22, 2.34), paintMat, [0, 0.42, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.36, 0.30, 0.78), paintMat, [0, 0.64, 0.80], [0.14, 0, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.36, 0.32, 0.62), paintMat, [0, 0.66, -0.86]);
		for (const s of [-1, 1]) put(bodyGroup, new THREE.BoxGeometry(0.16, 0.28, 1.18), paintMat, [s * 0.64, 0.64, -0.02]);
		// Spacious tall tubular roll cage framing Speaki cleanly without blocking her face!
		for (const s of [-1, 1]) {
			put(bodyGroup, new THREE.CylinderGeometry(0.045, 0.045, 1.24, 8), darkMat, [s * 0.64, 1.26, 0.56], [-0.28, 0, 0]);
			put(bodyGroup, new THREE.CylinderGeometry(0.045, 0.045, 1.18, 8), darkMat, [s * 0.64, 1.26, -0.72], [0.20, 0, 0]);
			put(bodyGroup, new THREE.CylinderGeometry(0.045, 0.045, 1.28, 8), darkMat, [s * 0.64, 1.80, -0.06], [Math.PI / 2, 0, 0]);
		}
		put(bodyGroup, new THREE.BoxGeometry(1.32, 0.08, 0.10), darkMat, [0, 1.80, 0.56]);
		for (const sx of [-0.36, 0, 0.36]) put(bodyGroup, new THREE.SphereGeometry(0.11, 8, 8), headLightMat, [sx, 1.90, 0.60]);
		// Rear spare off-road tire
		put(bodyGroup, new THREE.CylinderGeometry(0.36, 0.36, 0.22, 14), tireMat, [0, 0.94, -1.26], [Math.PI / 2, 0, 0]);
		spkmodAddWheelPair(THREE, bodyGroup, 0.86, 0.42, 0.88, 0.42, 0.30, tireMat, rimMat, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.88, 0.46, -0.84, 0.46, 0.34, tireMat, rimMat, wheels);
		return { seatOffsetY: 0.44, wheelRadius: 0.44 };
	} else if (builderName === "vintageBeetle") {
		const wht = spkmodVehMat(THREE, 0xf8fafc);
		put(bodyGroup, new THREE.SphereGeometry(0.88, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.56), paintMat, [0, 0.36, 0], null, [0.92, 0.84, 1.48]);
		put(bodyGroup, new THREE.BoxGeometry(1.48, 0.38, 2.34), paintMat, [0, 0.48, 0]);
		// Rounded bug windshield & folded convertible soft-top
		put(bodyGroup, new THREE.BoxGeometry(1.16, 0.42, 0.10), glassMat, [0, 0.98, 0.48], [-0.35, 0, 0]);
		put(bodyGroup, new THREE.CylinderGeometry(0.24, 0.24, 1.18, 12), wht, [0, 0.88, -0.82], [0, 0, Math.PI / 2]);
		for (const sx of [-0.54, 0.54]) {
			put(bodyGroup, new THREE.SphereGeometry(0.17, 10, 8), headLightMat, [sx, 0.62, 1.18]);
			put(bodyGroup, new THREE.SphereGeometry(0.14, 10, 8), tailLightMat, [sx, 0.56, -1.16]);
		}
		put(bodyGroup, new THREE.BoxGeometry(1.46, 0.10, 0.14), chromeMat, [0, 0.36, 1.28]);
		spkmodAddWheelPair(THREE, bodyGroup, 0.78, 0.32, 0.76, 0.32, 0.22, tireMat, wht, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.78, 0.32, -0.76, 0.32, 0.22, tireMat, wht, wheels);
		return { seatOffsetY: 1.02, wheelRadius: 0.32 };
	} else if (builderName === "tacoTruck") {
		const wht = spkmodVehMat(THREE, 0xfefce8), shell = spkmodVehMat(THREE, 0xfacc15), meat = spkmodVehMat(THREE, 0x7c2d12), letM = spkmodVehMat(THREE, 0x22c55e), tom = spkmodVehMat(THREE, 0xef4444);
		put(bodyGroup, new THREE.BoxGeometry(1.56, 1.24, 2.74), wht, [0, 0.94, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.60, 0.40, 2.76), paintMat, [0, 0.58, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.44, 0.44, 0.78), glassMat, [0, 1.24, 0.98]);
		// Festive serving awning on right side
		put(bodyGroup, new THREE.BoxGeometry(0.56, 0.08, 1.48), tom, [0.98, 1.42, -0.22], [0, 0, -0.35]);
		// Giant spinning rooftop hard-shell taco (upright U-shape)!
		const roofTaco = new THREE.Group();
		roofTaco.position.set(0, 1.62, -0.18);
		put(roofTaco, new THREE.CylinderGeometry(0.46, 0.46, 0.32, 16, 1, false, 0, Math.PI), shell, [0, 0.48, 0], [0, 0, -Math.PI / 2]);
		put(roofTaco, new THREE.BoxGeometry(0.24, 0.20, 0.82), meat, [0, 0.42, 0]);
		put(roofTaco, new THREE.BoxGeometry(0.28, 0.14, 0.78), letM, [0, 0.54, 0]);
		for (const tz of [-0.24, 0, 0.24]) put(roofTaco, new THREE.SphereGeometry(0.085, 8, 8), tom, [0, 0.62, tz]);
		bodyGroup.add(roofTaco);
		animParts.push({ type: "spinY", node: roofTaco, speed: 2.0 });
		spkmodAddWheelPair(THREE, bodyGroup, 0.80, 0.34, 0.86, 0.34, 0.22, tireMat, rimMat, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.80, 0.34, -0.86, 0.34, 0.22, tireMat, rimMat, wheels);
		return { seatOffsetY: 1.64, wheelRadius: 0.34 };
	} else if (builderName === "towTruck") {
		const amber = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
		put(bodyGroup, new THREE.BoxGeometry(1.54, 0.54, 2.74), darkMat, [0, 0.56, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.48, 0.86, 1.18), paintMat, [0, 1.18, 0.72]);
		put(bodyGroup, new THREE.BoxGeometry(1.40, 0.40, 1.22), glassMat, [0, 1.28, 0.74]);
		// Angled crane boom + hanging steel tow hook!
		put(bodyGroup, new THREE.BoxGeometry(0.24, 0.24, 1.66), paintMat, [0, 1.32, -0.68], [0.58, 0, 0]);
		put(bodyGroup, new THREE.CylinderGeometry(0.03, 0.03, 0.76, 8), chromeMat, [0, 1.36, -1.42]);
		put(bodyGroup, new THREE.TorusGeometry(0.14, 0.04, 8, 12, Math.PI * 1.4), chromeMat, [0, 0.92, -1.42]);
		const beacon = put(bodyGroup, new THREE.CylinderGeometry(0.12, 0.14, 0.18, 10), amber, [0, 1.70, 0.72]);
		animParts.push({ type: "pulseScale", node: beacon, speed: 9.0, amp: 0.24 });
		spkmodAddWheelPair(THREE, bodyGroup, 0.80, 0.36, 0.88, 0.36, 0.24, tireMat, rimMat, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.80, 0.36, -0.84, 0.36, 0.26, tireMat, rimMat, wheels);
		return { seatOffsetY: 1.64, wheelRadius: 0.36 };
	} else if (builderName === "camperVan") {
		const cream = spkmodVehMat(THREE, 0xfefce8), board = spkmodVehMat(THREE, 0xfacc15), stripe = spkmodVehMat(THREE, 0x0ea5e9);
		put(bodyGroup, new THREE.BoxGeometry(1.56, 0.62, 2.74), paintMat, [0, 0.64, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.52, 0.66, 2.68), cream, [0, 1.26, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.56, 0.42, 2.28), glassMat, [0, 1.28, 0.08]);
		for (const sx of [-0.46, 0.46]) put(bodyGroup, new THREE.SphereGeometry(0.16, 10, 8), headLightMat, [sx, 0.70, 1.38]);
		// Roof rack + bright surfboard strapped on top!
		put(bodyGroup, new THREE.BoxGeometry(1.24, 0.06, 1.66), chromeMat, [0, 1.64, -0.14]);
		put(bodyGroup, new THREE.SphereGeometry(0.32, 14, 10), board, [0, 1.74, -0.06], null, [1.25, 0.24, 3.35]);
		put(bodyGroup, new THREE.BoxGeometry(0.14, 0.16, 1.98), stripe, [0, 1.75, -0.06]);
		spkmodAddWheelPair(THREE, bodyGroup, 0.80, 0.34, 0.86, 0.34, 0.22, tireMat, cream, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.80, 0.34, -0.86, 0.34, 0.22, tireMat, cream, wheels);
		return { seatOffsetY: 1.64, wheelRadius: 0.34 };
	} else if (builderName === "muscleCar") {
		put(bodyGroup, new THREE.BoxGeometry(1.62, 0.48, 2.86), paintMat, [0, 0.52, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.30, 0.42, 1.12), glassMat, [0, 0.90, -0.22]);
		put(bodyGroup, new THREE.BoxGeometry(1.34, 0.10, 1.04), paintMat, [0, 1.12, -0.24]);
		// Twin racing stripes
		for (const sx of [-0.22, 0.22]) put(bodyGroup, new THREE.BoxGeometry(0.14, 0.50, 2.88), darkMat, [sx, 0.52, 0]);
		// Huge chrome supercharger blower sticking out of the hood!
		put(bodyGroup, new THREE.BoxGeometry(0.54, 0.36, 0.62), chromeMat, [0, 0.88, 0.72]);
		put(bodyGroup, new THREE.BoxGeometry(0.56, 0.18, 0.12), tailLightMat, [0, 0.96, 1.04]);
		const pulley = put(bodyGroup, new THREE.CylinderGeometry(0.14, 0.14, 0.08, 12), darkMat, [0, 0.82, 1.06], [Math.PI / 2, 0, 0]);
		animParts.push({ type: "spinZ", node: pulley, speed: 12.0 });
		for (const sx of [-0.56, 0.56]) {
			put(bodyGroup, new THREE.BoxGeometry(0.32, 0.14, 0.08), headLightMat, [sx, 0.54, 1.44]);
			put(bodyGroup, new THREE.BoxGeometry(0.34, 0.14, 0.08), tailLightMat, [sx, 0.54, -1.44]);
		}
		spkmodAddWheelPair(THREE, bodyGroup, 0.84, 0.32, 0.88, 0.32, 0.24, tireMat, rimMat, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.88, 0.38, -0.88, 0.38, 0.32, tireMat, rimMat, wheels);
		return { seatOffsetY: 1.18, wheelRadius: 0.35 };
	} else if (builderName === "doubleBus") {
		put(bodyGroup, new THREE.BoxGeometry(1.62, 1.98, 3.16), paintMat, [0, 1.32, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.66, 0.12, 3.18), spkmodVehMat(THREE, 0xfef08a), [0, 1.30, 0]);
		// Two stacked decks of panoramic windows!
		put(bodyGroup, new THREE.BoxGeometry(1.66, 0.42, 2.74), glassMat, [0, 0.98, 0.04]);
		put(bodyGroup, new THREE.BoxGeometry(1.66, 0.46, 2.86), glassMat, [0, 1.88, 0.04]);
		put(bodyGroup, new THREE.BoxGeometry(1.12, 0.18, 0.08), headLightMat, [0, 2.22, 1.58]);
		spkmodAddWheelPair(THREE, bodyGroup, 0.82, 0.36, 1.02, 0.36, 0.24, tireMat, rimMat, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.82, 0.36, -1.02, 0.36, 0.24, tireMat, rimMat, wheels);
		return { seatOffsetY: 2.38, wheelRadius: 0.36 };
	} else if (builderName === "driftJdm") {
		const neon = spkmodVehMat(THREE, colorHex, { emissive: colorHex, emissiveIntensity: 0.95 });
		put(bodyGroup, new THREE.BoxGeometry(1.64, 0.38, 2.72), paintMat, [0, 0.42, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.24, 0.38, 1.18), glassMat, [0, 0.76, -0.14]);
		put(bodyGroup, new THREE.BoxGeometry(1.56, 0.08, 0.28), darkMat, [0, 0.24, 1.34]); // front splitter
		// Massive carbon GT drift wing!
		put(bodyGroup, new THREE.BoxGeometry(1.74, 0.07, 0.34), darkMat, [0, 1.06, -1.24]);
		for (const sx of [-0.52, 0.52]) put(bodyGroup, new THREE.BoxGeometry(0.08, 0.46, 0.16), darkMat, [sx, 0.82, -1.22]);
		// Pulsing neon street underglow!
		const underglow = put(bodyGroup, new THREE.BoxGeometry(1.66, 0.05, 2.54), neon, [0, 0.16, 0]);
		animParts.push({ type: "pulseScale", node: underglow, speed: 5.5, amp: 0.05 });
		for (const sx of [-0.54, 0.54]) {
			put(bodyGroup, new THREE.BoxGeometry(0.36, 0.10, 0.08), headLightMat, [sx, 0.48, 1.38]);
			put(bodyGroup, new THREE.BoxGeometry(0.38, 0.10, 0.08), tailLightMat, [sx, 0.48, -1.38]);
		}
		spkmodAddWheelPair(THREE, bodyGroup, 0.86, 0.28, 0.86, 0.28, 0.24, tireMat, neon, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.86, 0.28, -0.86, 0.28, 0.26, tireMat, neon, wheels);
		return { seatOffsetY: 1.00, wheelRadius: 0.28 };
	} else if (builderName === "steamroller") {
		const catY = spkmodVehMat(THREE, 0xeab308), steel = spkmodVehMat(THREE, 0x94a3b8);
		put(bodyGroup, new THREE.BoxGeometry(1.24, 0.68, 1.62), catY, [0, 0.86, -0.44]);
		put(bodyGroup, new THREE.BoxGeometry(1.18, 0.10, 1.18), darkMat, [0, 1.92, -0.44]);
		for (const [x, z] of [[-0.52, 0.08], [0.52, 0.08], [-0.52, -0.96], [0.52, -0.96]]) {
			put(bodyGroup, new THREE.CylinderGeometry(0.05, 0.05, 0.82, 8), darkMat, [x, 1.50, z]);
		}
		put(bodyGroup, new THREE.CylinderGeometry(0.08, 0.10, 0.86, 10), darkMat, [0.46, 1.48, 0.16]);
		// Giant rolling front steel road drum!
		const drum = new THREE.Group();
		drum.position.set(0, 0.56, 0.92);
		put(drum, new THREE.CylinderGeometry(0.56, 0.56, 1.68, 22), steel, null, [0, 0, Math.PI / 2]);
		put(drum, new THREE.BoxGeometry(1.70, 0.14, 0.14), darkMat);
		bodyGroup.add(drum);
		animParts.push({ type: "rollForward", node: drum, radius: 0.56 });
		for (const sx of [-0.88, 0.88]) put(bodyGroup, new THREE.BoxGeometry(0.14, 0.34, 1.18), catY, [sx, 0.66, 0.44]);
		spkmodAddWheelPair(THREE, bodyGroup, 0.76, 0.46, -0.78, 0.46, 0.32, tireMat, catY, wheels);
		return { seatOffsetY: 1.98, wheelRadius: 0.46, extra: { chugAmp: 0.05 } };
	} else if (builderName === "cementMixer") {
		const wht = spkmodVehMat(THREE, 0xf8fafc), amber = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
		put(bodyGroup, new THREE.BoxGeometry(1.52, 0.42, 2.86), darkMat, [0, 0.50, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.48, 0.92, 1.06), paintMat, [0, 1.12, 0.92]);
		put(bodyGroup, new THREE.BoxGeometry(1.40, 0.40, 1.10), glassMat, [0, 1.24, 0.94]);
		const beacon = put(bodyGroup, new THREE.CylinderGeometry(0.11, 0.13, 0.16, 10), amber, [0, 1.66, 0.92]);
		animParts.push({ type: "pulseScale", node: beacon, speed: 8.5, amp: 0.22 });
		// Tilted spinning striped concrete mixer barrel!
		const mixerTilt = new THREE.Group();
		mixerTilt.position.set(0, 1.28, -0.44);
		mixerTilt.rotation.x = 0.32;
		const mixerSpin = new THREE.Group();
		mixerTilt.add(mixerSpin);
		put(mixerSpin, new THREE.CylinderGeometry(0.54, 0.68, 1.56, 18), wht, [0, 0, 0], [Math.PI / 2, 0, 0]);
		put(mixerSpin, new THREE.TorusGeometry(0.64, 0.08, 8, 18), paintMat, [0, 0, -0.24]);
		put(mixerSpin, new THREE.TorusGeometry(0.60, 0.08, 8, 18), paintMat, [0, 0, 0.26]);
		put(mixerSpin, new THREE.BoxGeometry(1.30, 0.14, 0.14), paintMat, [0, 0, 0]);
		bodyGroup.add(mixerTilt);
		animParts.push({ type: "spinZ", node: mixerSpin, speed: 3.5 });
		spkmodAddWheelPair(THREE, bodyGroup, 0.80, 0.34, 0.98, 0.34, 0.24, tireMat, rimMat, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.80, 0.34, -0.82, 0.34, 0.26, tireMat, rimMat, wheels);
		return { seatOffsetY: 1.64, wheelRadius: 0.34 };
	} else if (builderName === "stretchLimo") {
		put(bodyGroup, new THREE.BoxGeometry(1.52, 0.48, 4.18), paintMat, [0, 0.50, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.36, 0.48, 2.54), paintMat, [0, 0.94, -0.14]);
		put(bodyGroup, new THREE.BoxGeometry(1.40, 0.36, 2.42), darkMat, [0, 0.95, -0.14]);
		// Hood ornament & retro VIP rear boomerang TV antenna
		put(bodyGroup, new THREE.OctahedronGeometry(0.10, 0), spkmodVehMat(THREE, 0xfacc15), [0, 0.82, 1.96]);
		for (const s of [-1, 1]) put(bodyGroup, new THREE.BoxGeometry(0.06, 0.06, 0.54), chromeMat, [s * 0.24, 1.24, -1.68], [0, s * 0.55, 0]);
		for (const sx of [-0.52, 0.52]) {
			put(bodyGroup, new THREE.BoxGeometry(0.28, 0.14, 0.08), headLightMat, [sx, 0.54, 2.10]);
			put(bodyGroup, new THREE.BoxGeometry(0.28, 0.14, 0.08), tailLightMat, [sx, 0.54, -2.10]);
		}
		spkmodAddWheelPair(THREE, bodyGroup, 0.78, 0.32, 1.42, 0.32, 0.22, tireMat, rimMat, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.78, 0.32, -1.42, 0.32, 0.22, tireMat, rimMat, wheels);
		return { seatOffsetY: 1.24, wheelRadius: 0.32 };
	} else if (builderName === "swatVan") {
		const navy = spkmodVehMat(THREE, 0x1e293b), armor = spkmodVehMat(THREE, 0x334155);
		put(bodyGroup, new THREE.BoxGeometry(1.66, 1.24, 3.04), navy, [0, 0.98, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.72, 0.42, 2.98), armor, [0, 0.62, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.48, 0.28, 0.12), glassMat, [0, 1.28, 1.52]);
		// Front heavy steel ramming bullbar
		put(bodyGroup, new THREE.BoxGeometry(1.52, 0.44, 0.22), darkMat, [0, 0.60, 1.62]);
		// Flashing tactical strobes
		const sr = put(bodyGroup, new THREE.BoxGeometry(0.36, 0.16, 0.20), new THREE.MeshBasicMaterial({ color: 0xff2233 }), [-0.32, 1.68, 1.18]);
		const sb = put(bodyGroup, new THREE.BoxGeometry(0.36, 0.16, 0.20), new THREE.MeshBasicMaterial({ color: 0x2277ff }), [0.32, 1.68, 1.18]);
		animParts.push({ type: "siren", red: sr, blue: sb });
		spkmodAddWheelPair(THREE, bodyGroup, 0.86, 0.40, 1.02, 0.40, 0.28, tireMat, armor, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.86, 0.40, -1.02, 0.40, 0.28, tireMat, armor, wheels);
		return { seatOffsetY: 1.72, wheelRadius: 0.40 };
	} else if (builderName === "cyberPickup") {
		const ledW = spkmodVehMat(THREE, 0xffffff, { emissive: 0xe0f2fe, emissiveIntensity: 0.95 });
		// Unmistakable sharp low-poly wedge truck silhouette!
		put(bodyGroup, new THREE.BoxGeometry(1.66, 0.56, 3.06), paintMat, [0, 0.64, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.58, 0.18, 1.64), paintMat, [0, 1.18, 0.58], [-0.36, 0, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.58, 0.18, 1.88), paintMat, [0, 1.16, -0.68], [0.28, 0, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.52, 0.42, 1.48), darkMat, [0, 1.06, 0.04]);
		// Full-width LED lightbars front & back!
		put(bodyGroup, new THREE.BoxGeometry(1.62, 0.10, 0.08), ledW, [0, 0.82, 1.54]);
		put(bodyGroup, new THREE.BoxGeometry(1.62, 0.10, 0.08), tailLightMat, [0, 0.86, -1.54]);
		spkmodAddWheelPair(THREE, bodyGroup, 0.88, 0.38, 1.02, 0.38, 0.28, tireMat, darkMat, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.88, 0.38, -1.02, 0.38, 0.28, tireMat, darkMat, wheels);
		return { seatOffsetY: 1.42, wheelRadius: 0.38 };
	} else if (builderName === "formulaOne") {
		put(bodyGroup, new THREE.BoxGeometry(0.68, 0.34, 2.86), paintMat, [0, 0.38, 0]);
		put(bodyGroup, new THREE.ConeGeometry(0.36, 1.08, 4), paintMat, [0, 0.36, 1.84], [Math.PI / 2, Math.PI / 4, 0]);
		for (const s of [-1, 1]) put(bodyGroup, new THREE.BoxGeometry(0.42, 0.32, 1.38), paintMat, [s * 0.52, 0.36, -0.18]);
		// Wide multi-tier front wing + tall rear DRS wing + cockpit halo!
		put(bodyGroup, new THREE.BoxGeometry(1.88, 0.07, 0.38), darkMat, [0, 0.20, 1.76]);
		put(bodyGroup, new THREE.BoxGeometry(1.42, 0.08, 0.34), paintMat, [0, 0.96, -1.36]);
		for (const s of [-1, 1]) put(bodyGroup, new THREE.BoxGeometry(0.08, 0.54, 0.30), darkMat, [s * 0.68, 0.72, -1.36]);
		put(bodyGroup, new THREE.TorusGeometry(0.36, 0.045, 8, 16, Math.PI), darkMat, [0, 0.66, 0.14], [Math.PI / 2, 0, 0]);
		put(bodyGroup, new THREE.BoxGeometry(0.28, 0.38, 0.64), paintMat, [0, 0.76, -0.58]);
		spkmodAddWheelPair(THREE, bodyGroup, 0.90, 0.30, 1.12, 0.30, 0.28, tireMat, rimMat, wheels);
		spkmodAddWheelPair(THREE, bodyGroup, 0.94, 0.34, -0.96, 0.34, 0.34, tireMat, rimMat, wheels);
		return { seatOffsetY: 0.76, wheelRadius: 0.32 };
	}

	// ========================================================================
	// D. 5 NEW AIR & SCI-FI SHOWSTOPPERS
	// ========================================================================
	if (builderName === "biplane") {
		const wood = spkmodVehMat(THREE, 0x92400e);
		put(bodyGroup, new THREE.CylinderGeometry(0.42, 0.20, 2.55, 14), paintMat, [0, 0.64, -0.08], [Math.PI / 2, 0, 0]);
		// Twin stacked wings + wooden struts
		put(bodyGroup, new THREE.BoxGeometry(3.15, 0.10, 0.76), paintMat, [0, 0.56, 0.34]);
		put(bodyGroup, new THREE.BoxGeometry(3.15, 0.10, 0.76), paintMat, [0, 1.38, 0.42]);
		for (const sx of [-1.18, 1.18]) put(bodyGroup, new THREE.CylinderGeometry(0.035, 0.035, 0.84, 8), wood, [sx, 0.97, 0.38]);
		// Tail fin & horizontal stabilizer
		put(bodyGroup, new THREE.BoxGeometry(1.12, 0.08, 0.42), paintMat, [0, 0.70, -1.24]);
		put(bodyGroup, new THREE.BoxGeometry(0.08, 0.64, 0.48), paintMat, [0, 0.96, -1.24]);
		// Fast-spinning front propeller!
		const prop = new THREE.Group();
		prop.position.set(0, 0.64, 1.24);
		put(prop, new THREE.BoxGeometry(1.24, 0.12, 0.04), wood);
		put(prop, new THREE.SphereGeometry(0.14, 10, 8), chromeMat);
		bodyGroup.add(prop);
		animParts.push({ type: "spinZ", node: prop, speed: 24.0 });
		spkmodAddWheelPair(THREE, bodyGroup, 0.46, 0.18, 0.64, 0.18, 0.10, tireMat, rimMat, wheels);
		return { seatOffsetY: 1.04, hoverY: 0.46, hoverAmp: 0.12 };
	} else if (builderName === "rocketSled") {
		const flameM = new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.9 });
		const coreM = new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.92 });
		put(bodyGroup, new THREE.CylinderGeometry(0.36, 0.48, 2.25, 16), paintMat, [0, 0.44, 0], [Math.PI / 2, 0, 0]);
		put(bodyGroup, new THREE.ConeGeometry(0.36, 0.78, 16), chromeMat, [0, 0.44, 1.50], [Math.PI / 2, 0, 0]);
		put(bodyGroup, new THREE.BoxGeometry(0.62, 0.30, 0.76), glassMat, [0, 0.76, 0.24], [-0.22, 0, 0]);
		for (const s of [-1, 1]) {
			put(bodyGroup, new THREE.CylinderGeometry(0.24, 0.28, 1.66, 14), chromeMat, [s * 0.68, 0.42, -0.34], [Math.PI / 2, 0, 0]);
			put(bodyGroup, new THREE.ConeGeometry(0.24, 0.46, 14), paintMat, [s * 0.68, 0.42, 0.70], [Math.PI / 2, 0, 0]);
			const fl = put(bodyGroup, new THREE.ConeGeometry(0.22, 0.96, 10), flameM, [s * 0.68, 0.42, -1.62], [-Math.PI / 2, 0, 0]);
			const fl2 = put(bodyGroup, new THREE.ConeGeometry(0.12, 0.56, 8), coreM, [s * 0.68, 0.42, -1.46], [-Math.PI / 2, 0, 0]);
			animParts.push({ type: "flamePulse", node: fl });
			animParts.push({ type: "flamePulse", node: fl2 });
		}
		return { seatOffsetY: 0.86, hoverY: 0.34, hoverAmp: 0.09 };
	} else if (builderName === "zeppelin") {
		const wood = spkmodVehMat(THREE, 0x78350f), brass = spkmodVehMat(THREE, 0xd97706);
		// Hanging passenger gondola + suspension rigging
		put(bodyGroup, new THREE.BoxGeometry(1.06, 0.58, 1.68), wood, [0, 0.42, 0]);
		put(bodyGroup, new THREE.BoxGeometry(1.12, 0.12, 1.72), brass, [0, 0.70, 0]);
		for (const [x, z] of [[-0.46, 0.62], [0.46, 0.62], [-0.46, -0.62], [0.46, -0.62]]) {
			put(bodyGroup, new THREE.CylinderGeometry(0.025, 0.025, 1.65, 6), brass, [x, 1.50, z]);
		}
		// Grand overhead steampunk blimp envelope + brass rings + tail fins
		put(bodyGroup, new THREE.SphereGeometry(1.12, 20, 16), paintMat, [0, 3.06, 0], null, [0.95, 0.95, 2.05]);
		for (const sz of [-0.92, 0, 0.92]) put(bodyGroup, new THREE.TorusGeometry(sz === 0 ? 1.08 : 0.96, 0.06, 8, 22), brass, [0, 3.06, sz]);
		put(bodyGroup, new THREE.BoxGeometry(2.15, 0.08, 0.68), brass, [0, 3.06, -1.86]);
		put(bodyGroup, new THREE.BoxGeometry(0.08, 1.64, 0.68), brass, [0, 3.06, -1.86]);
		// Twin spinning brass side propellers!
		for (const s of [-1, 1]) {
			const prop = new THREE.Group();
			prop.position.set(s * 0.72, 0.50, -0.34);
			put(prop, new THREE.BoxGeometry(0.64, 0.10, 0.04), brass);
			put(prop, new THREE.BoxGeometry(0.10, 0.64, 0.04), brass);
			bodyGroup.add(prop);
			animParts.push({ type: "spinZ", node: prop, speed: s * 16.0 });
		}
		return { seatOffsetY: 0.66, hoverY: 0.42, hoverAmp: 0.16 };
	} else if (builderName === "crescentMoon") {
		const moonM = spkmodVehMat(THREE, 0xfde047, { emissive: 0xf59e0b, emissiveIntensity: 0.48 });
		const starM = spkmodVehMat(THREE, 0xfef9c3, { emissive: 0xfde047, emissiveIntensity: 0.95 });
		// Sculpted glowing crescent moon cradle!
		put(bodyGroup, new THREE.TorusGeometry(1.06, 0.28, 14, 26, Math.PI * 1.22), moonM, [0, 1.06, 0], [0, Math.PI / 2, Math.PI * 0.88]);
		put(bodyGroup, new THREE.ConeGeometry(0.24, 0.46, 10), moonM, [0, 1.98, 0.72], [1.15, 0, 0]);
		put(bodyGroup, new THREE.ConeGeometry(0.24, 0.46, 10), moonM, [0, 1.72, -0.96], [-0.95, 0, 0]);
		// Dangling twinkling star from upper moon horn!
		put(bodyGroup, new THREE.CylinderGeometry(0.018, 0.018, 0.46, 6), starM, [0, 1.74, 0.88]);
		const star = put(bodyGroup, new THREE.OctahedronGeometry(0.20, 0), starM, [0, 1.46, 0.88]);
		animParts.push({ type: "spinY", node: star, speed: 3.2 });
		animParts.push({ type: "bobY", node: star, baseY: 1.46, speed: 3.8, amp: 0.08 });
		return { seatOffsetY: 0.46, hoverY: 0.56, hoverAmp: 0.16 };
	} else if (builderName === "starfighter") {
		const plasma = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.92 });
		const laser = spkmodVehMat(THREE, 0xf43f5e, { emissive: 0xef4444, emissiveIntensity: 0.9 });
		put(bodyGroup, new THREE.BoxGeometry(0.76, 0.46, 2.54), paintMat, [0, 0.54, -0.10]);
		put(bodyGroup, new THREE.ConeGeometry(0.46, 1.32, 4), paintMat, [0, 0.54, 1.82], [Math.PI / 2, Math.PI / 4, 0]);
		put(bodyGroup, new THREE.SphereGeometry(0.44, 14, 10), glassMat, [0, 0.84, 0.22], null, [0.85, 0.75, 1.45]);
		// Quad swept X-style laser wings + wingtip cannons + plasma engines!
		for (const s of [-1, 1]) {
			for (const dy of [-1, 1]) {
				put(bodyGroup, new THREE.BoxGeometry(1.52, 0.08, 0.74), paintMat, [s * 1.06, 0.54 + dy * 0.34, -0.54], [0, 0, s * dy * 0.28]);
				put(bodyGroup, new THREE.CylinderGeometry(0.04, 0.04, 0.96, 8), laser, [s * 1.78, 0.54 + dy * 0.54, -0.22], [Math.PI / 2, 0, 0]);
			}
			put(bodyGroup, new THREE.CylinderGeometry(0.18, 0.22, 0.88, 12), chromeMat, [s * 0.44, 0.54, -1.16], [Math.PI / 2, 0, 0]);
			const thr = put(bodyGroup, new THREE.ConeGeometry(0.17, 0.74, 10), plasma, [s * 0.44, 0.54, -1.94], [-Math.PI / 2, 0, 0]);
			animParts.push({ type: "flamePulse", node: thr });
		}
		return { seatOffsetY: 0.96, hoverY: 0.52, hoverAmp: 0.13 };
	} else if (builderName === "uifiFrog") {
		// Iconic Trickcal "Ui-Fi" smooth metaball-SDF sculpted mochi frog (plump round head, broad brow pillows, fat round cheeks, flush glossy eyes, sequential 1-2-3 Wi-Fi waves!)
		const uifiTex = spkmodGetUifiTextures(THREE);
		const bodyMat = uifiTex?.skinTex
			? spkmodVehMat(THREE, 0xffffff, {
				map: uifiTex.skinTex,
				emissive: 0xffffff,
				emissiveMap: uifiTex.skinTex,
				emissiveIntensity: 0.30
			})
			: spkmodVehMat(THREE, 0xfdeee6, { emissive: 0xffe4d6, emissiveIntensity: 0.26 });
		const limbMat = spkmodVehMat(THREE, 0xfdeee6, { emissive: 0xffe8dc, emissiveIntensity: 0.28 });
		const eyeRimMat = spkmodVehMat(THREE, 0x3b4d2b, { emissive: 0x26341a, emissiveIntensity: 0.18 });
		const wifiMat = spkmodVehMat(THREE, 0x4b74d6, { emissive: 0x3b82f6, emissiveIntensity: 0.42 });

		// Helper: creates a smooth front-projected curved iris dome for the flush eyeballs
		const makeEyeCap = (radius, phiMax, mat) => {
			const geo = new THREE.SphereGeometry(radius, 22, 16, 0, Math.PI * 2, 0, phiMax);
			if (typeof geo.rotateX === "function") geo.rotateX(Math.PI / 2);
			const pos = geo.attributes && geo.attributes.position;
			const uv = geo.attributes && geo.attributes.uv;
			if (pos && uv && typeof pos.getX === "function" && typeof uv.setXY === "function") {
				const maxXY = (radius * Math.sin(phiMax)) || 1;
				for (let i = 0; i < pos.count; i++) {
					const x = pos.getX(i);
					const y = pos.getY(i);
					uv.setXY(i, 0.5 + (x / (2 * maxXY)), 0.5 + (y / (2 * maxXY)));
				}
				uv.needsUpdate = true;
			}
			return new THREE.Mesh(geo, mat);
		};

		// 1. Single seamlessly sculpted clay/metaball-SDF mochi frog body (zero pointy corners, zero seams, plump round back & cheeks!)
		// phiStart = -PI/2 puts u=0.50 on exact front (+Z) and hides the u=0/1 UV seam at exact back (-Z).
		const smin = (a, b, k) => {
			const h = Math.max(k - Math.abs(a - b), 0) / k;
			return Math.min(a, b) - h * h * k * 0.25;
		};
		const sdEllipsoid = (px, py, pz, cx, cy, cz, rx, ry, rz) => {
			const x = (px - cx) / rx, y = (py - cy) / ry, z = (pz - cz) / rz;
			const k0 = Math.hypot(x, y, z);
			if (k0 < 1e-6) return -Math.min(rx, ry, rz);
			const k1 = Math.hypot(x / rx, y / ry, z / rz);
			return k0 * (k0 - 1) / k1;
		};
		const sdFrog = (px, py, pz) => {
			// Main plump mochi body loaf (round back, soft full belly)
			let d = sdEllipsoid(px, py, pz, 0, 0.58, -0.05, 0.94, 0.54, 0.86);
			// Plump upper head / forehead dome (connects both brow arches smoothly & rounds out the back)
			d = smin(d, sdEllipsoid(px, py, pz, 0, 0.92, 0.14, 0.72, 0.39, 0.68), 0.26);
			// Twin broad, soft, rounded frog eye-brow pillows (no pointy cat ears!)
			for (const s of [-1, 1]) {
				d = smin(d, sdEllipsoid(px, py, pz, s * 0.45, 1.07, 0.44, 0.35, 0.33, 0.36), 0.22);
			}
			// Twin big, fat, ROUND pillowy cheeks (smooth marshmallows, no pointy triangle edges!)
			for (const s of [-1, 1]) {
				d = smin(d, sdEllipsoid(px, py, pz, s * 0.78, 0.56, 0.30, 0.48, 0.38, 0.46), 0.26);
			}
			// Soft flat mochi belly underside at y = 0.12
			const dBottom = 0.12 - py;
			const kb = 0.18;
			const hb = Math.max(kb - Math.abs(d - dBottom), 0) / kb;
			return Math.max(d, dBottom) + hb * hb * kb * 0.25;
		};

		const bodyGeo = new THREE.SphereGeometry(1, 60, 44, -Math.PI / 2);
		const posAttr = bodyGeo.attributes && bodyGeo.attributes.position;
		if (posAttr && typeof posAttr.getX === "function" && typeof posAttr.setXYZ === "function") {
			const ox = 0, oy = 0.66, oz = 0.06;
			for (let i = 0; i < posAttr.count; i++) {
				const nx = posAttr.getX(i);
				const ny = posAttr.getY(i);
				const nz = posAttr.getZ(i);
				let lo = 0.10, hi = 2.00;
				for (let it = 0; it < 16; it++) {
					const mid = (lo + hi) * 0.5;
					if (sdFrog(ox + nx * mid, oy + ny * mid, oz + nz * mid) < 0) lo = mid;
					else hi = mid;
				}
				const r = (lo + hi) * 0.5;
				posAttr.setXYZ(i, ox + nx * r, oy + ny * r, oz + nz * r);
			}
			posAttr.needsUpdate = true;
			if (typeof bodyGeo.computeVertexNormals === "function") {
				bodyGeo.computeVertexNormals();
			}
		}
		bodyGroup.add(new THREE.Mesh(bodyGeo, bodyMat));

		// 2. Compact, FLUSH, glossy round emerald eyes nestled softly inside the rounded cream brow domes (zero creepy bug-eye protrusion!)
		for (const s of [-1, 1]) {
			const eyeGroup = new THREE.Group();
			eyeGroup.position.set(s * 0.45, 1.08, 0.78);
			eyeGroup.rotation.set(-0.07, s * 0.14, 0);
			eyeGroup.scale.set(1.0, 1.0, 0.48);
			// Soft olive-brown shallow backing (tucked completely inside brow — no black goggle cylinder from side!)
			put(eyeGroup, new THREE.SphereGeometry(0.198, 18, 14), eyeRimMat, [0, 0, -0.02]);
			if (uifiTex?.eyeTex) {
				const eyeMat = new THREE.MeshBasicMaterial({
					map: uifiTex.eyeTex,
					transparent: true,
					depthWrite: false
				});
				const eyeCap = makeEyeCap(0.205, Math.PI * 0.48, eyeMat);
				eyeCap.renderOrder = 4;
				eyeGroup.add(eyeCap);
			}
			bodyGroup.add(eyeGroup);
		}

		// 3. Soft sculpted mochi front arms (rounded capsules, no flat cylinder tops!) & tucked hind frog legs
		for (const s of [-1, 1]) {
			// Folded rear haunch nestled smoothly behind the fat cheek + neat flat webbed hind foot
			put(bodyGroup, new THREE.SphereGeometry(0.24, 14, 12), limbMat, [s * 0.90, 0.27, -0.24], [0, s * -0.22, s * 0.14], [0.72, 0.88, 1.12]);
			put(bodyGroup, new THREE.SphereGeometry(0.19, 12, 10), limbMat, [s * 0.92, 0.06, -0.04], [0, s * -0.32, 0], [1.18, 0.34, 0.95]);
			for (const tz of [-0.07, 0, 0.07]) {
				put(bodyGroup, new THREE.SphereGeometry(0.045, 8, 6), limbMat, [s * 1.05, 0.05, 0.04 + tz], null, [1.2, 0.55, 0.9]);
			}
			// Soft rounded inward-angled front arm ("/   \") — smooth sculpted ellipsoid + rounded paw (zero sharp cylinder edge!)
			put(bodyGroup, new THREE.SphereGeometry(0.125, 14, 12), limbMat, [s * 0.52, 0.25, 0.62], [0.36, 0, s * -0.46], [0.78, 1.55, 0.82]);
			put(bodyGroup, new THREE.SphereGeometry(0.105, 12, 10), limbMat, [s * 0.40, 0.08, 0.72], null, [1.10, 0.56, 1.15]);
			for (const tx of [-0.048, 0.048]) {
				put(bodyGroup, new THREE.SphereGeometry(0.042, 8, 6), limbMat, [s * 0.40 + tx, 0.05, 0.80], null, [0.95, 0.6, 1.25]);
			}
		}

		// 4. TWIN SEQUENTIAL 1 -> 2 -> 3 WI-FI WAVES cleanly above the soft rounded frog eye-brows!
		const wifiTiers = [[], [], []];
		const waveSpecs = [
			{ radius: 0.185, tube: 0.045, arc: Math.PI * 0.58 }, // 1: Small
			{ radius: 0.340, tube: 0.049, arc: Math.PI * 0.56 }, // 2: Medium
			{ radius: 0.500, tube: 0.053, arc: Math.PI * 0.54 }  // 3: Big
		];
		for (const s of [-1, 1]) {
			const emitter = new THREE.Group();
			emitter.position.set(s * 0.45, 1.42, 0.48);
			emitter.rotation.z = s * -0.16; // Slightly fanned outward like cute Wi-Fi eyebrows!
			bodyGroup.add(emitter);

			waveSpecs.forEach((ws, idx) => {
				const waveGroup = new THREE.Group();
				const arcMesh = new THREE.Mesh(new THREE.TorusGeometry(ws.radius, ws.tube, 10, 22, ws.arc), wifiMat);
				arcMesh.rotation.z = (Math.PI - ws.arc) * 0.5;
				waveGroup.add(arcMesh);
				const half = ws.arc * 0.5;
				const capX = Math.sin(half) * ws.radius;
				const capY = Math.cos(half) * ws.radius;
				for (const cs of [-1, 1]) {
					const cap = new THREE.Mesh(new THREE.SphereGeometry(ws.tube * 1.04, 8, 8), wifiMat);
					cap.position.set(cs * capX, capY, 0);
					waveGroup.add(cap);
				}
				emitter.add(waveGroup);
				wifiTiers[idx].push(waveGroup);
			});
		}

		animParts.push({ type: "wifiWave", tiers: wifiTiers, cycleSec: 1.5 });
		animParts.push({ type: "mochiSquish", node: bodyGroup });

		// Alert sprite floating cleanly above the big Wi-Fi waves
		const alertTex = spkmodGetAlertSpriteTexture(THREE, "!");
		const alertMat = new THREE.SpriteMaterial({ map: alertTex, transparent: true, depthTest: false, depthWrite: false });
		const alertSprite = new THREE.Sprite(alertMat);
		alertSprite.name = "spkmod_vehicle_alert_sprite";
		alertSprite.userData = Object.assign(alertSprite.userData || {}, { spkmodVehicleAlert: true, spkmodSkipNametagClear: true });
		alertSprite.renderOrder = 999;
		alertSprite.position.set(0, 2.58, 0);
		alertSprite.scale.set(0.78, 0.78, 1);
		alertSprite.visible = false;
		root.add(alertSprite);

		return {
			seatOffsetY: 0,
			extra: {
				isMgsBox: true,
				isUifiFrog: true,
				leftFoot: null,
				rightFoot: null,
				hopAmp: 0.14,
				alertSprite,
				alertBaseY: 2.58
			}
		};
	}
	return null;
}

function spkmodAttachVehicleAlertSprite(THREE, built, vehicle) {
	if (!built || !built.root || !THREE || typeof THREE.Sprite !== "function" || typeof THREE.SpriteMaterial !== "function") {
		return built;
	}
	if (built.alertSprite) {
		built.alertSprite.name = "spkmod_vehicle_alert_sprite";
		built.alertSprite.userData = Object.assign(built.alertSprite.userData || {}, { spkmodVehicleAlert: true, spkmodSkipNametagClear: true });
		built.alertSprite.renderOrder = 999;
		if (built.alertBaseY == null) built.alertBaseY = built.alertSprite.position?.y || 1.92;
		return built;
	}
	const alertTex = spkmodGetAlertSpriteTexture(THREE, "!");
	const alertMat = new THREE.SpriteMaterial({ map: alertTex, transparent: true, depthTest: false, depthWrite: false });
	const alertSprite = new THREE.Sprite(alertMat);
	alertSprite.name = "spkmod_vehicle_alert_sprite";
	alertSprite.userData = Object.assign(alertSprite.userData || {}, { spkmodVehicleAlert: true, spkmodSkipNametagClear: true });
	alertSprite.renderOrder = 999;
	const alertBaseY = vehicle?.hidePlayer
		? 1.92
		: Math.max(1.85, (built.seatOffsetY || 0.85) + (built.hoverY || 0) + 1.55);
	alertSprite.position.set(0, alertBaseY, 0);
	alertSprite.scale.set(0.75, 0.75, 1);
	alertSprite.visible = false;
	built.root.add(alertSprite);
	built.alertSprite = alertSprite;
	built.alertBaseY = alertBaseY;
	return built;
}

async function spkmodCreateVehicleModelInstance(vehicle, colorIdx) {
	if (!vehicle) return null;
	const THREE = window.THREE;
	if (!THREE) return null;
	const safeColorIdx = spkmodClampVehicleColorIdx(colorIdx);
	const colorHex = SPKMOD_VEHICLE_COLORS[safeColorIdx].hex;
	const spec = vehicle.spec || {};
	let built = null;

	// 1. Authentic Burger Shop Sedan / Van GLB
	if (spec.kind === "burger_glb") {
		if (typeof spkmodLoadBurgerVehiclesScene !== "function" || typeof spkmodCreateBurgerCarInstance !== "function") return null;
		const scene = await spkmodLoadBurgerVehiclesScene();
		if (!scene) return null;
		const inst = spkmodCreateBurgerCarInstance(scene, spec.modelName, colorHex);
		if (!inst) return null;
		const root = new THREE.Group();
		root.add(inst.carObj);
		built = {
			root,
			bodyGroup: inst.carObj,
			wheels: inst.wheels || [],
			wheelRadius: inst.wheelRadius || 0.42,
			seatOffsetY: inst.seatOffsetY || 1.30,
			hoverY: 0,
			hoverAmp: 0,
			animParts: []
		};
	}

	// 2. Authentic Game World GLB Vehicles (normalized by Box3 footprint, SkinnedMesh-safe)
	if (!built && spec.kind === "glb") {
		const scene = await spkmodLoadVehicleGlbScene(spec.url, spec.fallbackUrl);
		if (!scene) return null;
		const root = new THREE.Group();
		const bodyGroup = new THREE.Group();
		root.add(bodyGroup);

		const cloned = (typeof spkmodCloneSceneWithSkins === "function")
			? spkmodCloneSceneWithSkins(scene)
			: scene.clone(true);
		if (!cloned) return null;
		cloned.visible = true;
		cloned.position.set(0, 0, 0);
		cloned.rotation.set(0, 0, 0);
		cloned.scale.set(1, 1, 1);
		cloned.traverse(node => {
			if (!node) return;
			node.visible = true;
			if (node.isMesh || node.isSkinnedMesh) {
				node.userData = Object.assign(node.userData || {}, { spkmodVehSharedGlb: true });
				if (node.isSkinnedMesh) {
					node.frustumCulled = false;
				}
			}
		});
		if (typeof cloned.updateMatrixWorld === "function") cloned.updateMatrixWorld(true);

		const box = new THREE.Box3().setFromObject(cloned);
		if (!box.isEmpty()) {
			const size = new THREE.Vector3();
			box.getSize(size);
			const maxHoriz = Math.max(size.x, size.z, 0.001);
			const maxH = Math.max(size.y, 0.001);
			let scale = 1;
			if (spec.targetLength) {
				scale = spec.targetLength / maxHoriz;
			} else if (spec.targetHeight) {
				scale = spec.targetHeight / maxH;
			}
			if (isFinite(scale) && scale > 0.01 && scale < 100) {
				cloned.scale.multiplyScalar(scale);
			}
			if (typeof cloned.updateMatrixWorld === "function") cloned.updateMatrixWorld(true);
			// Recompute bounds after scaling and align bottom to y = 0 (keepLocalZ keeps rider in sleigh seat!)
			const box2 = new THREE.Box3().setFromObject(cloned);
			if (!box2.isEmpty()) {
				const center2 = new THREE.Vector3();
				box2.getCenter(center2);
				cloned.position.x -= center2.x;
				if (!spec.keepLocalZ) cloned.position.z -= center2.z;
				cloned.position.y -= box2.min.y;
			}
		}
		bodyGroup.add(cloned);

		const animParts = [];
		if (spec.flameZ != null) {
			const flameMat = new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.85 });
			const flame = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.62, 10), flameMat);
			flame.rotation.x = -Math.PI / 2;
			flame.position.set(0, spec.flameY || 0.4, spec.flameZ);
			bodyGroup.add(flame);
			animParts.push({ type: "flamePulse", node: flame });
		}

		built = {
			root,
			bodyGroup,
			wheels: [],
			wheelRadius: 0.36,
			seatOffsetY: spec.seatOffsetY || 0.90,
			hoverY: spec.hoverY || 0,
			hoverAmp: spec.hoverAmp || 0,
			rockAmp: spec.rockAmp || 0,
			chugAmp: spec.chugAmp || 0,
			animParts
		};
	}

	// 3. Procedural 3D Vehicles & MGS Stealth Cardboard Box
	if (!built && spec.kind === "procedural") {
		built = spkmodBuildProceduralVehicle(THREE, spec.builder, colorHex);
		if (built) spkmodVehOptimizeBuilt(THREE, built);
	}
	return built ? spkmodAttachVehicleAlertSprite(THREE, built, vehicle) : null;
}

// ============================================================================
// 5. LIVE VEHICLE RUNTIME (LOCAL + REMOTE SPAWN, STEALTH HIDE, ANIMATIONS)
// ============================================================================
let _spkmodLocalVehicleEntry = null;
let _spkmodLocalVehicleSeq = 0;
let _spkmodVehicleDidInitialRestore = false;

const _spkmodRemoteVehicleStates = new Map(); // ownerKey -> { vehicleId, colorIdx, playerId, playerName, updatedAtMs }
const _spkmodRemoteVehicleInstances = new Map(); // ownerKey -> entry
const _spkmodRemoteVehicleSeq = new Map();
const _spkmodRemoteVehicleInFlight = new Map();

let _spkmodVehicleLoopRafId = null;
let _spkmodVehicleLoopLastMs = performance.now();
let _spkmodVehicleLastReconcileMs = 0;
let _spkmodVehicleForceSyncNow = false;
let _spkmodVehicleHadBroadcast = false;
let _spkmodVehicleNeedsZoneSync = false;
let _spkmodVehicleLastZoneId = null;
let _spkmodVehicleLastRemoteCount = 0;
let _spkmodVehicleLastObservedLevel = 1;
let _spkmodVehicleKeyHooked = false;
const _spkmodVehicleEmoteLastMs = new Map(); // "local" | ownerKey -> performance.now()
let _spkmodVehicleLocalLastDirectTriggerMs = -Infinity;

window.spkmodHasRemoteVehicle = function(ownerKey) {
	return _spkmodRemoteVehicleInstances.has(String(ownerKey));
};

window.spkmodHasActiveLocalVehicle = function() {
	if (!spkmodIsVehiclesSystemEnabled() || !_spkmodLocalVehicleEntry) return false;
	if (typeof spkmodIsInIsolatedMinigame === "function" && spkmodIsInIsolatedMinigame()) return false;
	return true;
};

function spkmodIsLocalVehicleEmoteBlocked() {
	if (!spkmodIsVehiclesSystemEnabled() || !_spkmodLocalVehicleEntry) return true;
	if (typeof spkmodIsInIsolatedMinigame === "function" && spkmodIsInIsolatedMinigame()) return true;
	if (typeof gameState !== "undefined" && gameState) {
		if (gameState.isDead) return true;
		if (typeof gameState.isObstacleRaceActive === "function" && gameState.isObstacleRaceActive()) return true;
		if (typeof gameState.isLocalOnTrampoline === "function" && gameState.isLocalOnTrampoline()) return true;
	}
	return false;
}

function spkmodPickRandomVehicleEmoteVariant() {
	return Math.random() < 0.5;
}

function spkmodFindRemoteVehicleEntryByPlayerId(playerId) {
	if (playerId == null || _spkmodRemoteVehicleInstances.size === 0) return null;
	const targetStr = String(playerId).trim();
	if (!targetStr) return null;
	const direct = _spkmodRemoteVehicleInstances.get(targetStr);
	if (direct) return direct;
	for (const [ownerKey, entry] of _spkmodRemoteVehicleInstances.entries()) {
		if (!entry) continue;
		if (ownerKey === targetStr) return entry;
		if (entry.playerId != null && String(entry.playerId) === targetStr) return entry;
		if (entry.lastRpKey != null && String(entry.lastRpKey) === targetStr) return entry;
		const rp = entry.resolveRp ? entry.resolveRp() : null;
		if (rp && (rp.info?.playerId == playerId || rp.info?.id == playerId)) return entry;
	}
	return null;
}

function spkmodTriggerVehicleEmoteEffect(entry, isLocal, opts = {}) {
	if (!entry || !entry.vehicle) return false;
	const now = performance.now();
	const throttleKey = isLocal ? "local" : String(entry.ownerKey || entry.playerId || "remote");
	if (!opts.ignoreCooldown) {
		const lastMs = _spkmodVehicleEmoteLastMs.get(throttleKey);
		if (lastMs !== undefined && (now - lastMs) < SPKMOD_VEHICLE_EMOTE_COOLDOWN_MS) return false;
	}
	_spkmodVehicleEmoteLastMs.set(throttleKey, now);

	const isSecondary = (opts.secondary === true || opts.secondary === false)
		? opts.secondary
		: spkmodPickRandomVehicleEmoteVariant();
	const gain = isLocal
		? 1
		: spkmodComputeRemoteVehicleAudioGain(opts.container || entry.lastContainer);
	if (gain > 0.001) {
		spkmodPlayVehicleSfx(entry.vehicle, isSecondary, gain);
	}
	if (entry.alertSprite) {
		spkmodTriggerBoxAlert(entry, isSecondary ? "?" : "!");
	}
	return true;
}

function spkmodTriggerLocalVehicleAction(opts = {}) {
	if (spkmodIsLocalVehicleEmoteBlocked()) return false;
	const now = performance.now();
	const triggered = spkmodTriggerVehicleEmoteEffect(_spkmodLocalVehicleEntry, true, {
		secondary: opts.secondary,
		ignoreCooldown: !!opts.ignoreCooldown
	});
	if (!triggered) return false;
	const shouldBroadcast = opts.broadcast !== false;
	if (
		shouldBroadcast &&
		typeof gameState !== "undefined" &&
		gameState &&
		gameState.zoneId !== null &&
		typeof gameState.sendEmoteNow === "function" &&
		(now - _spkmodVehicleLocalLastDirectTriggerMs >= SPKMOD_VEHICLE_EMOTE_COOLDOWN_MS)
	) {
		_spkmodVehicleLocalLastDirectTriggerMs = now;
		const jumpEmoteId = (typeof Emotes !== "undefined" && Emotes && Number.isInteger(Emotes.Jump)) ? Emotes.Jump : 2;
		try {
			gameState.sendEmoteNow(jumpEmoteId, 0);
		} catch (_) {}
	}
	return true;
}

function spkmodEnsureVehicleHandleEmoteHook() {
	try {
		if (typeof gameState === "undefined" || !gameState || typeof gameState.handleEmote !== "function") return;
		if (gameState.__spkmodVehicleHandleEmoteHooked) return;
		gameState.__spkmodVehicleHandleEmoteHooked = true;
		const origHandleEmote = gameState.handleEmote;
		gameState.handleEmote = function(e) {
			try {
				const jumpEmoteId = (typeof Emotes !== "undefined" && Emotes && Number.isInteger(Emotes.Jump)) ? Emotes.Jump : 2;
				if (e && e.emoteId === jumpEmoteId && spkmodIsVehiclesSystemEnabled()) {
					const isLocal = e.playerId === this.myPlayerId;
					if (isLocal) {
						if (!spkmodIsLocalVehicleEmoteBlocked()) {
							const now = performance.now();
							if (now - _spkmodVehicleLocalLastDirectTriggerMs < SPKMOD_VEHICLE_SELF_ECHO_DEDUPE_MS) {
								return;
							}
							spkmodTriggerVehicleEmoteEffect(_spkmodLocalVehicleEntry, true);
							return;
						}
					} else {
						const inMini = (typeof spkmodIsInIsolatedMinigame === "function") ? spkmodIsInIsolatedMinigame() : false;
						if (!inMini && window.spkmodVehicleSettings.showRemoteVehicles !== false) {
							const entry = spkmodFindRemoteVehicleEntryByPlayerId(e.playerId);
							if (entry) {
								const rp = (entry.resolveRp ? entry.resolveRp() : null)
									|| (typeof resolveRemotePlayerById === "function" ? resolveRemotePlayerById(e.playerId) : null);
								if (rp && typeof isSilencedPlayer === "function" && isSilencedPlayer(rp)) {
									return;
								}
								const onRemoteTrampoline = !!(
									(e.jumpStage || 0) > 0 &&
									rp?.container?.position &&
									typeof this.trampolineBounce?.isOnMat === "function" &&
									this.trampolineBounce.isOnMat(rp.container.position.x, rp.container.position.z)
								);
								if (!onRemoteTrampoline) {
									spkmodTriggerVehicleEmoteEffect(entry, false, {
										container: rp?.container || entry.lastContainer
									});
									return;
								}
							}
						}
					}
				}
			} catch (_) {}
			return origHandleEmote.call(this, e);
		};
	} catch (_) {}
}

function spkmodTriggerBoxAlert(entry, symbol = "!") {
	if (!entry || !entry.alertSprite || !window.THREE) return;
	const tex = spkmodGetAlertSpriteTexture(window.THREE, symbol);
	if (tex && entry.alertSprite.material) {
		entry.alertSprite.material.map = tex;
		entry.alertSprite.material.needsUpdate = true;
	}
	entry.alertSprite.visible = true;
	entry.alertStartMs = performance.now();
	entry.alertUntilMs = entry.alertStartMs + 1350;
}

function spkmodExitVehicleMountSit(ctrl) {
	if (!ctrl) return;
	try {
		if (typeof ctrl.exitMountSit === "function") ctrl.exitMountSit();
		else if (typeof ctrl.exitMountPose === "function") ctrl.exitMountPose();
	} catch (_) {}
}

function spkmodApplyVehiclePoseOverride(entry, poseObj, ownerScale) {
	if (!entry || !poseObj || !poseObj.position) return;
	if (entry.vehicle?.hidePlayer) {
		poseObj.position.set(0, 0, 0);
		if (poseObj.rotation && typeof poseObj.rotation.set === "function") poseObj.rotation.set(0, 0, 0);
		return;
	}
	const scale = (ownerScale != null && Number.isFinite(ownerScale)) ? ownerScale : (entry.visualScaleCurrent || 1);
	const y = ((entry.seatOffsetY || 0) + (entry._lastHoverDelta || 0)) * scale;
	poseObj.position.set(0, y, 0);
	if (poseObj.rotation && typeof poseObj.rotation.set === "function") poseObj.rotation.set(0, 0, 0);
}

function spkmodEnsureMountVisualsHook() {
	try {
		if (typeof gameState === "undefined" || !gameState?.mountVisuals || typeof gameState.mountVisuals.update !== "function") return;
		const mv = gameState.mountVisuals;
		if (mv.__spkmodVehUpdateHooked) return;
		mv.__spkmodVehUpdateHooked = true;
		const origUpdate = mv.update.bind(mv);
		mv.update = function(dt) {
			const res = origUpdate(dt);
			try {
				if (spkmodIsVehiclesSystemEnabled()) {
					const inMini = (typeof spkmodIsInIsolatedMinigame === "function") ? spkmodIsInIsolatedMinigame() : false;
					if (_spkmodLocalVehicleEntry && !inMini) {
						if (typeof spkmodSetNativeCartVisible === "function") {
							spkmodSetNativeCartVisible(gameState.playerContainer, gameState.myPlayerId, false);
						}
						spkmodApplyVehiclePoseOverride(_spkmodLocalVehicleEntry, gameState.localAvatarPose, _spkmodLocalVehicleEntry.visualScaleCurrent);
					}
					if (_spkmodRemoteVehicleInstances.size > 0) {
						const rMap = gameState.remotePlayers?.remotePlayers;
						for (const entry of _spkmodRemoteVehicleInstances.values()) {
							let rp = (rMap && entry.cachedRp && entry.lastRpKey !== undefined && rMap.get(entry.lastRpKey) === entry.cachedRp)
								? entry.cachedRp
								: null;
							if (!rp && entry.resolveRp) {
								rp = entry.resolveRp();
								entry.cachedRp = rp || null;
							}
							if (rp) {
								if (typeof spkmodSetNativeCartVisible === "function") {
									spkmodSetNativeCartVisible(rp.container, entry.lastRpKey ?? entry.playerId, false);
								}
								if (rp.avatarPose) {
									spkmodApplyVehiclePoseOverride(entry, rp.avatarPose, entry.visualScaleCurrent);
								}
							}
						}
					}
				}
			} catch (_) {}
			return res;
		};
	} catch (_) {}
}

function spkmodRestoreVehicleEntry(entry, isLocal) {
	if (!entry) return;
	if (entry.root) {
		spkmodDisposeVehicleObject(entry.root);
	}
	// Unconditionally restore any avatar hidden by MGS Cardboard Box!
	if (entry.hiddenAvatarRoot) {
		entry.hiddenAvatarRoot.visible = true;
		entry.hiddenAvatarRoot = null;
	}
	if (typeof gameState !== "undefined" && gameState) {
		if (isLocal) {
			if (entry.vehicle?.hidePlayer && gameState.localAvatar?.root && !window.lunFirstPersonActive) {
				gameState.localAvatar.root.visible = true;
			}
			const pc = gameState.playerContainer;
			const myId = gameState.myPlayerId;
			if (typeof spkmodSetNativeCartVisible === "function") {
				spkmodSetNativeCartVisible(pc, myId, true);
			}
			const stillMounted = typeof spkmodHasActiveNativeMount === "function" && spkmodHasActiveNativeMount(pc, myId);
			if (!stillMounted) {
				if (gameState.localAvatarPose?.position) {
					gameState.localAvatarPose.position.set(0, 0, 0);
				}
				if (gameState.localAvatarPose?.rotation && typeof gameState.localAvatarPose.rotation.set === "function") {
					gameState.localAvatarPose.rotation.set(0, 0, 0);
				}
				const ctrl = typeof spkmodGetLocalAnimController === "function"
					? spkmodGetLocalAnimController()
					: (gameState.localAnimationController || gameState.localAvatar?.animationController || null);
				spkmodExitVehicleMountSit(ctrl);
			}
		} else {
			const rp = entry.resolveRp ? entry.resolveRp() : null;
			if (entry.vehicle?.hidePlayer && rp?.avatar?.root) {
				rp.avatar.root.visible = true;
			}
			const container = rp?.container || entry.lastContainer;
			const rpId = entry.lastRpKey ?? entry.playerId;
			if (container) {
				if (typeof spkmodSetNativeCartVisible === "function") {
					spkmodSetNativeCartVisible(container, rpId, true);
				}
				const stillMounted = typeof spkmodHasActiveNativeMount === "function" && spkmodHasActiveNativeMount(container, rpId);
				if (!stillMounted) {
					const posePos = rp?.avatarPose?.position || rp?.avatar?.root?.position || entry.lastPosePos;
					if (posePos) posePos.set(0, 0, 0);
					if (rp?.avatarPose?.rotation && typeof rp.avatarPose.rotation.set === "function") {
						rp.avatarPose.rotation.set(0, 0, 0);
					}
					const ctrl = rp?.avatar?.animationController || rp?.container?.controller || entry.lastCtrl;
					spkmodExitVehicleMountSit(ctrl);
				}
			}
		}
	}
}

function spkmodRemoveLocalVehicle() {
	_spkmodLocalVehicleSeq++;
	if (_spkmodLocalVehicleEntry) {
		spkmodRestoreVehicleEntry(_spkmodLocalVehicleEntry, true);
		_spkmodLocalVehicleEntry = null;
	}
	if (typeof gameState !== "undefined" && gameState?.playerContainer?.children) {
		const ch = gameState.playerContainer.children;
		for (let i = ch.length - 1; i >= 0; i--) {
			if (ch[i] && ch[i].name === "spkmod_local_vehicle") {
				spkmodDisposeVehicleObject(ch[i]);
			}
		}
	}
	window.BurgerCarMode = 0;
}

function spkmodEnsureVehicleKeyHooks() {
	if (_spkmodVehicleKeyHooked) return;
	_spkmodVehicleKeyHooked = true;
	const isTypingTarget = el =>
		el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);

	window.addEventListener("keydown", e => {
		if (e.code !== "KeyG" || isTypingTarget(e.target) || spkmodIsLocalVehicleEmoteBlocked()) return;
		e.preventDefault();
		e.stopImmediatePropagation();
		if (!e.repeat) {
			spkmodTriggerLocalVehicleAction({ broadcast: true, secondary: null });
		}
	}, true);

	window.addEventListener("keyup", e => {
		if (e.code !== "KeyG" || isTypingTarget(e.target) || spkmodIsLocalVehicleEmoteBlocked()) return;
		e.preventDefault();
		e.stopImmediatePropagation();
	}, true);
}

async function spkmodSpawnLocalVehicle(vehicleId, colorIdx) {
	if (!spkmodIsVehiclesSystemEnabled()) {
		spkmodRemoveLocalVehicle();
		return false;
	}
	const vehicle = SPKMOD_VEHICLES_BY_ID.get(vehicleId);
	if (!vehicle || !spkmodIsVehicleUnlocked(vehicle)) {
		spkmodRemoveLocalVehicle();
		return false;
	}
	if (typeof gameState === "undefined" || !gameState?.playerContainer) return false;

	spkmodEnsureVehicleKeyHooks();
	spkmodEnsureVehicleHandleEmoteHook();
	if (typeof window.spkmodResetCarsEveryone === "function") {
		window.spkmodResetCarsEveryone(true, false);
	}

	const mySeq = ++_spkmodLocalVehicleSeq;
	const safeColor = spkmodClampVehicleColorIdx(colorIdx);
	const built = await spkmodCreateVehicleModelInstance(vehicle, safeColor);
	if (!built || mySeq !== _spkmodLocalVehicleSeq || !spkmodIsVehiclesSystemEnabled() || window.spkmodVehicleSettings.equippedId !== vehicle.id) {
		if (built && built.root) spkmodDisposeVehicleObject(built.root);
		return false;
	}

	if (_spkmodLocalVehicleEntry) {
		spkmodRestoreVehicleEntry(_spkmodLocalVehicleEntry, true);
		_spkmodLocalVehicleEntry = null;
	}
	if (gameState.playerContainer.children) {
		for (let i = gameState.playerContainer.children.length - 1; i >= 0; i--) {
			if (gameState.playerContainer.children[i]?.name === "spkmod_local_vehicle") {
				spkmodDisposeVehicleObject(gameState.playerContainer.children[i]);
			}
		}
	}

	built.root.name = "spkmod_local_vehicle";
	gameState.playerContainer.add(built.root);
	window.BurgerCarMode = vehicle.code;
	window.BurgerCarColorIdx = safeColor;

	_spkmodLocalVehicleEntry = Object.assign({
		vehicle,
		colorIdx: safeColor,
		hiddenAvatarRoot: null,
		lastX: gameState.playerContainer.position ? gameState.playerContainer.position.x : 0,
		lastZ: gameState.playerContainer.position ? gameState.playerContainer.position.z : 0,
		lastMoveMs: -Infinity,
		moveBlend: 0,
		walkPhase: 0,
		stealthLift: 0,
		alertStartMs: 0,
		alertUntilMs: 0
	}, built);

	spkmodTickVehicleEntry(_spkmodLocalVehicleEntry, true, gameState.playerContainer, gameState.myPlayerId, gameState.localAvatar?.root || null, gameState.localAvatarPose?.position || null, (typeof spkmodGetLocalAnimController === "function" ? spkmodGetLocalAnimController() : gameState.localAnimationController), 0.016, performance.now());
	spkmodStartVehiclesLoopIfEnabled();
	return true;
}

function spkmodGetVehicleOwnerScale(isLocal, avatarRoot, rp) {
	// Prefer live avatar visual-scale wrapper (children[0] created by game's Giant/Mini Resizer Potion),
	// which automatically respects both size potions and minigame scale suppression.
	const visualChild = avatarRoot?.children?.[0];
	if (visualChild && visualChild.isObject3D && !visualChild.isSprite && !visualChild.isMesh && !visualChild.isBone && visualChild.scale) {
		const sx = visualChild.scale.x;
		const sy = visualChild.scale.y;
		const sz = visualChild.scale.z;
		if (
			Number.isFinite(sx) && sx >= 0.1 && sx <= 10.0 &&
			Math.abs(sx - sy) < 0.005 && Math.abs(sx - sz) < 0.005
		) {
			return sx;
		}
	}
	const gs = typeof gameState !== "undefined" ? gameState : (typeof window !== "undefined" ? window.gameState : null);
	let permille = 1000;
	if (isLocal) {
		if (typeof gs?.myVisualScalePermille === "number" && Number.isFinite(gs.myVisualScalePermille)) {
			permille = gs.myVisualScalePermille;
		}
	} else if (typeof rp?.visualScalePermille === "number" && Number.isFinite(rp.visualScalePermille)) {
		permille = rp.visualScalePermille;
	}
	const clamped = (permille >= 100 && permille <= 10000) ? Math.trunc(permille) : 1000;
	return clamped / 1000;
}

function spkmodTickVehicleEntry(entry, isLocal, container, playerId, avatarRoot, posePos, ctrl, dt, nowMs, rp = null) {
	if (!entry || !container) return;
	if (entry.root.parent !== container) {
		container.add(entry.root);
	}
	if (typeof spkmodSetNativeCartVisible === "function") {
		spkmodSetNativeCartVisible(container, playerId, false);
	}

	// Scale vehicle smoothly to match Giant / Mini Resizer Potion visual scale
	const targetScale = spkmodGetVehicleOwnerScale(isLocal, avatarRoot, rp);
	if (entry.visualScaleCurrent == null || !Number.isFinite(entry.visualScaleCurrent)) {
		entry.visualScaleCurrent = targetScale;
	} else {
		entry.visualScaleCurrent += (targetScale - entry.visualScaleCurrent) * Math.min(1, dt * 12);
	}
	const ownerScale = entry.visualScaleCurrent;
	if (entry.root.scale && typeof entry.root.scale.setScalar === "function") {
		entry.root.scale.setScalar(ownerScale);
	}

	// Calculate horizontal travel speed since last frame with 120ms hysteresis + smooth moveBlend
	// (prevents high-Hz RAF loops from flickering idle/moving on frames skipped by the game's frameLimit)
	let dist = 0;
	if (container.position) {
		const dx = container.position.x - entry.lastX;
		const dz = container.position.z - entry.lastZ;
		dist = Math.hypot(dx, dz);
		if (dist > 0.0001) {
			entry.lastX = container.position.x;
			entry.lastZ = container.position.z;
		}
	}
	const movedThisFrame = dist > 0.0025;
	if (movedThisFrame) {
		entry.lastMoveMs = nowMs;
	}
	const lastMoveMs = typeof entry.lastMoveMs === "number" ? entry.lastMoveMs : -Infinity;
	const isMoving = movedThisFrame || (nowMs >= lastMoveMs && (nowMs - lastMoveMs) < 120);
	const prevBlend = typeof entry.moveBlend === "number" ? entry.moveBlend : 0;
	const rawBlend = prevBlend + ((isMoving ? 1 : 0) - prevBlend) * Math.min(1, dt * (isMoving ? 14 : 9));
	const moveBlend = (!isMoving && rawBlend < 0.001) ? 0 : ((isMoving && rawBlend > 0.999) ? 1 : rawBlend);
	entry.moveBlend = moveBlend;
	const tSec = nowMs * 0.001;

	// Spin wheels proportionally to ground distance covered (scaled by owner size potion)
	if (dist > 0.0001 && entry.wheels && entry.wheels.length > 0) {
		const angle = dist / Math.max(0.05, (entry.wheelRadius || 0.34) * ownerScale);
		for (let i = 0; i < entry.wheels.length; i++) {
			entry.wheels[i].rotation.x += angle;
		}
	}

	// Hover / Bob / Rock / Chug motion (smoothly blended via moveBlend)
	let hoverDelta = 0;
	if (entry.hoverY > 0 || entry.hoverAmp > 0) {
		hoverDelta = Math.sin(tSec * 2.6) * (entry.hoverAmp || 0.08);
		entry.bodyGroup.position.y = (entry.hoverY || 0) + hoverDelta;
		const idlePitch = Math.sin(tSec * 1.4) * 0.025;
		entry.bodyGroup.rotation.x = idlePitch * (1 - moveBlend) + 0.08 * moveBlend;
	} else if (entry.waddleAmp) {
		if (moveBlend > 0.005) entry.walkPhase += dt * 11 * moveBlend;
		const idleRoll = Math.sin(tSec * 2.0) * 0.02;
		entry.bodyGroup.rotation.z = idleRoll * (1 - moveBlend) + Math.sin(entry.walkPhase) * entry.waddleAmp * moveBlend;
		entry.bodyGroup.position.y = Math.abs(Math.sin(entry.walkPhase)) * 0.06 * moveBlend;
	} else if (entry.rockAmp) {
		if (moveBlend > 0.005) entry.walkPhase += dt * 12 * moveBlend;
		const idleRock = Math.sin(tSec * 2.5) * 0.04;
		entry.bodyGroup.rotation.x = idleRock * (1 - moveBlend) + Math.sin(entry.walkPhase) * entry.rockAmp * moveBlend;
	} else if (entry.chugAmp) {
		if (moveBlend > 0.005) entry.walkPhase += dt * 14 * moveBlend;
		entry.bodyGroup.position.y = Math.abs(Math.sin(entry.walkPhase)) * entry.chugAmp * moveBlend;
		entry.bodyGroup.rotation.z = Math.sin(entry.walkPhase * 0.5) * 0.035 * moveBlend;
	} else if (entry.hopAmp && !entry.vehicle.hidePlayer) {
		if (moveBlend > 0.005) entry.walkPhase += dt * 9 * moveBlend;
		hoverDelta = Math.abs(Math.sin(entry.walkPhase)) * entry.hopAmp * moveBlend;
		entry.bodyGroup.position.y = hoverDelta;
		entry.bodyGroup.rotation.x = Math.cos(entry.walkPhase) * 0.10 * moveBlend;
	}

	entry._lastHoverDelta = hoverDelta;

	// Stealth MGS Cardboard Box mode vs Ui-Fi Frog hop vs normal mount vehicle
	if (entry.vehicle.hidePlayer) {
		if (avatarRoot) {
			if (entry.hiddenAvatarRoot && entry.hiddenAvatarRoot !== avatarRoot) {
				entry.hiddenAvatarRoot.visible = true;
			}
			entry.hiddenAvatarRoot = avatarRoot;
			if (avatarRoot.visible !== false) avatarRoot.visible = false;
		}
		if (posePos && posePos.y !== 0) posePos.set(0, 0, 0);
		if (ctrl && ctrl.mountSitPlaying) {
			spkmodExitVehicleMountSit(ctrl);
		}

		if (entry.isUifiFrog) {
			// Dedicated smooth frog hop: grounded pause + soft C1-continuous arch, ZERO diagonal box-waddle!
			entry.stealthLift = 0;
			if (moveBlend > 0.005) {
				entry.walkPhase += dt * 7.2 * Math.max(0.35, moveBlend);
			}
			const s = Math.sin(entry.walkPhase);
			const air = s > 0 ? Math.pow(s, 1.35) : 0;
			const ground = s < 0 ? -s : 0;
			entry._uifiAir = air;
			entry._uifiGround = ground;
			entry.bodyGroup.position.y = air * (entry.hopAmp || 0.14) * moveBlend;
			entry.bodyGroup.rotation.z = 0;
			entry.bodyGroup.rotation.x = (s > 0 ? -Math.sin(entry.walkPhase * 2) * 0.04 : 0) * moveBlend;
		} else {
			const targetLift = isMoving ? 0.14 : 0;
			entry.stealthLift += (targetLift - entry.stealthLift) * Math.min(1, dt * 16);
			if (moveBlend > 0.005) entry.walkPhase += dt * 13 * moveBlend;
			const hop = Math.abs(Math.sin(entry.walkPhase)) * (entry.hopAmp || 0.04) * moveBlend;
			entry.bodyGroup.position.y = entry.stealthLift + hop;
			entry.bodyGroup.rotation.z = Math.sin(entry.walkPhase) * 0.075 * moveBlend;
			entry.bodyGroup.rotation.x = Math.sin(entry.walkPhase * 2) * 0.03 * moveBlend;

			const showFeet = entry.stealthLift > 0.02;
			if (entry.leftFoot && entry.rightFoot) {
				entry.leftFoot.visible = showFeet;
				entry.rightFoot.visible = showFeet;
				if (showFeet) {
					const stride = Math.sin(entry.walkPhase) * 0.16 * moveBlend;
					entry.leftFoot.position.z = stride;
					entry.rightFoot.position.z = -stride;
					entry.leftFoot.position.y = 0.08 + Math.max(0, Math.cos(entry.walkPhase)) * 0.05 * moveBlend;
					entry.rightFoot.position.y = 0.08 + Math.max(0, -Math.cos(entry.walkPhase)) * 0.05 * moveBlend;
				}
			}
		}
	} else {
		if (entry.hiddenAvatarRoot) {
			entry.hiddenAvatarRoot.visible = true;
			entry.hiddenAvatarRoot = null;
		}
		if (posePos) {
			posePos.set(0, ((entry.seatOffsetY || 0) + hoverDelta) * ownerScale, 0);
		}
		const poseObj = isLocal
			? (typeof gameState !== "undefined" ? gameState?.localAvatarPose : null)
			: (rp?.avatarPose || null);
		if (poseObj?.rotation && typeof poseObj.rotation.set === "function") {
			poseObj.rotation.set(0, 0, 0);
		}
		if (entry.vehicle.pose === "sit") {
			if (ctrl && !ctrl.mountSitPlaying && typeof ctrl.enterMountPose === "function") {
				try { ctrl.enterMountPose("sit"); } catch (_) {}
			}
		} else if (entry.vehicle.pose === "stand") {
			if (ctrl && ctrl.mountSitPlaying) {
				spkmodExitVehicleMountSit(ctrl);
			}
		}
	}

	// Animated subparts (police siren lights, UFO disc, heli rotors, mech legs, spinning chairs/Roomba, trash lid, Wi-Fi waves, mochi squish)
	if (entry.animParts && entry.animParts.length > 0) {
		for (let i = 0; i < entry.animParts.length; i++) {
			const p = entry.animParts[i];
			if (!p) continue;
			if (p.type === "siren") {
				const phase = Math.floor(tSec * 7) % 2 === 0;
				if (p.red) p.red.scale.setScalar(phase ? 1.18 : 0.72);
				if (p.blue) p.blue.scale.setScalar(phase ? 0.72 : 1.18);
			} else if (p.type === "spinY" && p.node) {
				p.node.rotation.y = tSec * (p.speed || 2.0);
			} else if (p.type === "spinX" && p.node) {
				p.node.rotation.x = tSec * (p.speed || 16.0);
			} else if (p.type === "spinMoveY" && p.node) {
				p.node.rotation.y += dt * (0.45 + ((p.speed || 5.0) - 0.45) * moveBlend);
			} else if (p.type === "legWalk" && p.node) {
				if (moveBlend > 0.005) p.node.rotation.x = Math.sin(tSec * 10 + (p.side === 1 ? Math.PI : 0)) * 0.48 * moveBlend;
				else p.node.rotation.x *= 0.82;
			} else if (p.type === "lidBounce" && p.node) {
				p.node.position.y = (p.baseY || 1.2) + Math.abs(Math.sin(tSec * 12)) * 0.14 * moveBlend;
				p.node.rotation.z = Math.sin(tSec * 12) * 0.16 * moveBlend;
			} else if (p.type === "pulseScale" && p.node) {
				const s = 1 + Math.sin(tSec * (p.speed || 6)) * (p.amp || 0.12);
				p.node.scale.set(s, 1, s);
			} else if (p.type === "flamePulse" && p.node) {
				const s = (0.72 + 0.43 * moveBlend) + Math.sin(tSec * 22) * 0.25;
				p.node.scale.set(1, s, 1);
			} else if (p.type === "spinZ" && p.node) {
				p.node.rotation.z = tSec * (p.speed || 12.0);
			} else if (p.type === "bobY" && p.node) {
				p.node.position.y = (p.baseY || 0) + Math.sin(tSec * (p.speed || 3.5)) * (p.amp || 0.10);
			} else if (p.type === "rollForward" && p.node) {
				if (dist > 0.0001) {
					p.node.rotation.x += dist / Math.max(0.1, (p.radius || 0.5) * ownerScale);
				}
			} else if (p.type === "wingFlap" && p.node) {
				p.node.rotation.z = (p.baseZ || 0) + Math.sin(tSec * (p.speed || 7.0)) * (p.amp || 0.25) * (p.side || 1);
			} else if (p.type === "wifiWave" && Array.isArray(p.tiers)) {
				// Sequential Wi-Fi signal waves appearing in strict 1 -> 2 -> 3 order (small -> medium -> big)
				const cycle = p.cycleSec || 1.5;
				const phase = ((tSec % cycle) + cycle) % cycle / cycle;
				const thresholds = [0.14, 0.36, 0.58];
				const activeTier = phase >= 0.92 ? 0 : (phase >= thresholds[2] ? 3 : (phase >= thresholds[1] ? 2 : (phase >= thresholds[0] ? 1 : 0)));
				for (let ti = 0; ti < p.tiers.length; ti++) {
					const show = activeTier >= (ti + 1);
					const localElapsed = phase - (thresholds[ti] || 0);
					const pop = (show && localElapsed >= 0 && localElapsed < 0.09)
						? (0.76 + Math.sin((localElapsed / 0.09) * Math.PI) * 0.32 + (localElapsed / 0.09) * 0.24)
						: 1.0;
					const clampedScale = show ? Math.min(1.14, pop) : 1.0;
					const nodes = p.tiers[ti];
					for (let ni = 0; ni < nodes.length; ni++) {
						const nd = nodes[ni];
						if (!nd) continue;
						nd.visible = show;
						if (show && nd.scale && typeof nd.scale.setScalar === "function") {
							nd.scale.setScalar(clampedScale);
						}
					}
				}
			} else if (p.type === "mochiSquish" && p.node && p.node.scale) {
				// Phase-locked soft mochi frog breathing idle + gentle hop stretch/cushion (zero rapid vibration)
				const idleSquish = Math.sin(tSec * 2.4) * 0.025;
				const moveSquish = ((entry._uifiAir || 0) * 0.055) - ((entry._uifiGround || 0) * 0.05);
				const squish = idleSquish * (1 - moveBlend) + moveSquish * moveBlend;
				p.node.scale.set(1 - squish * 0.5, 1 + squish, 1 - squish * 0.5);
			}
		}
	}

	// Universal floating "!" / "?" alert sprite animation for ALL 100 vehicles (local + remote)
	if (entry.alertSprite) {
		if (entry.alertUntilMs > nowMs) {
			entry.alertSprite.visible = true;
			const elapsed = (nowMs - entry.alertStartMs) / 1000;
			const pop = elapsed < 0.14 ? (0.4 + (elapsed / 0.14) * 0.95) : (elapsed < 0.25 ? 1.35 - ((elapsed - 0.14) / 0.11) * 0.35 : 1.0);
			entry.alertSprite.scale.set(0.72 * pop, 0.72 * pop, 1);
			entry.alertSprite.position.y = (entry.alertBaseY || 1.92) + (entry.vehicle.hidePlayer ? 0 : hoverDelta) + Math.sin(elapsed * 12) * 0.05;
		} else if (entry.alertSprite.visible) {
			entry.alertSprite.visible = false;
		}
	}
}

// ============================================================================
// 6. REMOTE VEHICLES RESOLUTION & UNIFIED :m_v<codeNum>c<colorIdx>: SYNC
// ============================================================================
function spkmodResolveRemotePlayerForVehicle(playerId, playerName) {
	if (typeof gameState === "undefined" || !gameState?.remotePlayers?.remotePlayers) return null;
	const rMap = gameState.remotePlayers.remotePlayers;
	if (playerId != null && typeof playerId !== "object") {
		const rawStr = String(playerId).trim();
		const stripped = rawStr.replace(/^(?:remote|player|user|bubble)[_:-]+/i, "");
		for (const k of [playerId, Number(playerId), rawStr, stripped, Number(stripped)]) {
			if (k === "" || (typeof k === "number" && Number.isNaN(k))) continue;
			const byId = rMap.get(k);
			if (byId) return { key: String(k), rpKey: k, rp: byId };
		}
	}
	const lower = typeof playerName === "string" ? playerName.trim().toLowerCase() : "";
	if (lower) {
		for (const [k, rp] of rMap) {
			const rName = (rp?.info?.__spkmodOrigName || rp?.info?.name || "").trim().toLowerCase();
			if (rName && rName === lower) return { key: String(k), rpKey: k, rp };
		}
	}
	return null;
}

function spkmodClearRemoteVehicleOwner(ownerKey) {
	_spkmodRemoteVehicleSeq.set(ownerKey, (_spkmodRemoteVehicleSeq.get(ownerKey) || 0) + 1);
	_spkmodRemoteVehicleInFlight.delete(ownerKey);
	_spkmodVehicleEmoteLastMs.delete(String(ownerKey));
	const existing = _spkmodRemoteVehicleInstances.get(ownerKey);
	if (existing) {
		spkmodRestoreVehicleEntry(existing, false);
		_spkmodRemoteVehicleInstances.delete(ownerKey);
	}
}

async function spkmodSpawnOrUpdateRemoteVehicle(ownerKey, state, resolved) {
	if (!spkmodIsVehiclesSystemEnabled() || window.spkmodVehicleSettings.showRemoteVehicles === false) return;
	const vehicle = SPKMOD_VEHICLES_BY_ID.get(state.vehicleId);
	if (!vehicle || !resolved || !resolved.rp || !resolved.rp.container) return;

	const safeColor = spkmodClampVehicleColorIdx(state.colorIdx);
	const token = `${vehicle.id}:${safeColor}`;
	const existing = _spkmodRemoteVehicleInstances.get(ownerKey);
	if ((existing && existing.vehicle.id === vehicle.id && existing.colorIdx === safeColor) || _spkmodRemoteVehicleInFlight.get(ownerKey) === token) {
		return;
	}

	const mySeq = (_spkmodRemoteVehicleSeq.get(ownerKey) || 0) + 1;
	_spkmodRemoteVehicleSeq.set(ownerKey, mySeq);
	_spkmodRemoteVehicleInFlight.set(ownerKey, token);

	const built = await spkmodCreateVehicleModelInstance(vehicle, safeColor);
	if (_spkmodRemoteVehicleInFlight.get(ownerKey) === token) {
		_spkmodRemoteVehicleInFlight.delete(ownerKey);
	}
	if (!built || !spkmodIsVehiclesSystemEnabled() || _spkmodRemoteVehicleSeq.get(ownerKey) !== mySeq) {
		if (built && built.root) spkmodDisposeVehicleObject(built.root);
		return;
	}

	const live = spkmodResolveRemotePlayerForVehicle(state.playerId, state.playerName);
	if (!live || !live.rp || !live.rp.container) {
		if (built && built.root) spkmodDisposeVehicleObject(built.root);
		return;
	}

	const prev = _spkmodRemoteVehicleInstances.get(ownerKey);
	if (prev) {
		spkmodRestoreVehicleEntry(prev, false);
		_spkmodRemoteVehicleInstances.delete(ownerKey);
	}
	if (Array.isArray(live.rp.container.children)) {
		for (let i = live.rp.container.children.length - 1; i >= 0; i--) {
			const ch = live.rp.container.children[i];
			if (ch && typeof ch.name === "string" && (ch.name.startsWith("spkmod_remote_vehicle_") || ch.name.startsWith("spkmod_remote_car_"))) {
				spkmodDisposeVehicleObject(ch);
			}
		}
	}

	built.root.name = "spkmod_remote_vehicle_" + ownerKey;
	live.rp.container.add(built.root);

	const resolveRp = () => spkmodResolveRemotePlayerForVehicle(state.playerId, state.playerName)?.rp || null;
	const entry = Object.assign({
		ownerKey,
		playerId: state.playerId,
		playerName: state.playerName,
		vehicle,
		colorIdx: safeColor,
		resolveRp,
		cachedRp: live.rp,
		lastRpKey: live.rpKey,
		lastContainer: live.rp.container,
		lastPosePos: live.rp.avatarPose?.position || live.rp.avatar?.root?.position || null,
		lastCtrl: live.rp.avatar?.animationController || live.rp.container?.controller || null,
		hiddenAvatarRoot: null,
		lastX: live.rp.container.position ? live.rp.container.position.x : 0,
		lastZ: live.rp.container.position ? live.rp.container.position.z : 0,
		lastMoveMs: -Infinity,
		moveBlend: 0,
		walkPhase: 0,
		stealthLift: 0,
		alertStartMs: 0,
		alertUntilMs: 0
	}, built);

	_spkmodRemoteVehicleInstances.set(ownerKey, entry);
	spkmodEnsureVehicleHandleEmoteHook();
	spkmodTickVehicleEntry(entry, false, live.rp.container, live.rpKey, live.rp.avatar?.root || null, entry.lastPosePos, entry.lastCtrl, 0.016, performance.now(), live.rp);
}

window.spkmodGetActiveCarBroadcastState = function() {
	const enabled = spkmodIsVehiclesSystemEnabled();
	const isTestUnlock = !!window.spkmodVehicleSettings.unlockAllTest;
	const shareInChat = spkmodIsVehicleChatSharingEnabled() && !isTestUnlock;
	const eqId = (enabled && !isTestUnlock) ? window.spkmodVehicleSettings.equippedId : null;
	const vehicle = eqId ? SPKMOD_VEHICLES_BY_ID.get(eqId) : null;
	const modeIdx = (vehicle && spkmodIsVehicleLegitimatelyUnlocked(vehicle)) ? vehicle.code : 0;
	const colorIdx = modeIdx > 0 ? spkmodClampVehicleColorIdx(window.spkmodVehicleSettings.colorIdx) : 0;
	return {
		enabled,
		shareInChat,
		modeIdx,
		colorIdx,
		hadBroadcastCar: _spkmodVehicleHadBroadcast
	};
};

window.spkmodMarkCarBroadcastSent = function(hasVehicle) {
	_spkmodVehicleHadBroadcast = !!hasVehicle;
	_spkmodVehicleNeedsZoneSync = false;
};

function spkmodTriggerVehicleSyncBroadcast(opts = {}) {
	if (!spkmodIsVehicleChatSharingEnabled() || window.spkmodVehicleSettings.unlockAllTest) return;
	const eqVeh = window.spkmodVehicleSettings.equippedId ? SPKMOD_VEHICLES_BY_ID.get(window.spkmodVehicleSettings.equippedId) : null;
	const rCount = (typeof spkmodGetRemotePlayerCount === "function")
		? spkmodGetRemotePlayerCount()
		: ((typeof gameState !== "undefined" && gameState?.remotePlayers?.remotePlayers?.size) || 0);
	if (eqVeh && spkmodIsVehicleLegitimatelyUnlocked(eqVeh) && rCount === 0) {
		_spkmodVehicleNeedsZoneSync = true;
	}
	if (typeof window.spkmodQueueUnifiedModSyncBroadcast === "function") {
		window.spkmodQueueUnifiedModSyncBroadcast(Object.assign({
			includeCarState: true
		}, opts));
	}
}

window.spkmodHandleIncomingCarState = function(playerId, playerName, modeIdx, colorIdx) {
	if (!spkmodIsVehiclesSystemEnabled()) return;
	if (playerId != null && typeof playerId === "object") {
		if (!playerName) playerName = playerId.info?.__spkmodOrigName || playerId.info?.name || playerId.name || "";
		playerId = playerId.info?.playerId ?? playerId.info?.id ?? playerId.playerId ?? playerId.id ?? null;
	}
	const myId = typeof gameState !== "undefined" ? gameState?.myPlayerId : null;
	const myName = (typeof gameState !== "undefined" && (gameState?.myPlayerName || gameState?.myStat?.name)) || "";
	const isSelf = (myId != null && playerId != null && String(playerId) === String(myId))
		|| (myName && playerName && myName.trim().toLowerCase() === playerName.trim().toLowerCase());
	if (isSelf) return;

	let cleanName = typeof playerName === "string" ? playerName.trim() : "";
	let cleanId = (playerId != null && String(playerId).trim() !== "") ? playerId : null;
	const resolved = spkmodResolveRemotePlayerForVehicle(cleanId, cleanName);
	if (resolved) {
		cleanId = resolved.key;
		const rName = (resolved.rp?.info?.__spkmodOrigName || resolved.rp?.info?.name || "").trim();
		if (rName) cleanName = rName;
	}
	const lowerName = cleanName.toLowerCase();
	const ownerKey = (cleanId != null && String(cleanId).trim() !== "")
		? String(cleanId).trim()
		: (lowerName ? `name:${lowerName}` : "");
	if (!ownerKey) return;

	// Evict any stale alias entries belonging to the same remote player
	for (const [k, st] of [..._spkmodRemoteVehicleStates.entries()]) {
		if (k === ownerKey || !st) continue;
		const stLower = (st.playerName || "").trim().toLowerCase();
		if ((lowerName && stLower === lowerName) || (cleanId != null && st.playerId != null && String(st.playerId) === String(cleanId))) {
			_spkmodRemoteVehicleStates.delete(k);
			spkmodClearRemoteVehicleOwner(k);
		}
	}

	const codeNum = Number(modeIdx) || 0;
	const vehicle = codeNum > 0 ? SPKMOD_VEHICLES_BY_CODE.get(codeNum) : null;
	if (!vehicle) {
		_spkmodRemoteVehicleStates.delete(ownerKey);
		spkmodClearRemoteVehicleOwner(ownerKey);
		_spkmodVehicleForceSyncNow = true;
		return;
	}

	_spkmodRemoteVehicleStates.set(ownerKey, {
		playerId: cleanId,
		playerName: cleanName,
		vehicleId: vehicle.id,
		colorIdx: spkmodClampVehicleColorIdx(colorIdx),
		updatedAtMs: Date.now()
	});
	_spkmodVehicleForceSyncNow = true;
	spkmodStartVehiclesLoopIfEnabled();
};

window.spkmodHandleIncomingCarTrigger = function(playerId, playerName, rawMsg) {
	if (!spkmodIsVehiclesSystemEnabled() || typeof rawMsg !== "string") return;
	const trimmed = rawMsg.trim();
	if (/^:car_(?:none|off):$/i.test(trimmed)) {
		window.spkmodHandleIncomingCarState(playerId, playerName, 0, 0);
		return;
	}
	const m = trimmed.match(/^:car_(\d+)_(\d+):$/i);
	if (!m) return;
	window.spkmodHandleIncomingCarState(playerId, playerName, parseInt(m[1], 10), parseInt(m[2], 10));
};

// ============================================================================
// 7. EQUIP / UNEQUIP / COLOR / MASTER LOOP
// ============================================================================
async function spkmodEquipLocalVehicle(idOrCode, broadcast = true, silentToast = false) {
	if (!spkmodIsVehiclesSystemEnabled()) {
		if (!silentToast && typeof chatLog === "function") chatLog(spkmodGetVehicleUiText("systemDisabledToast"));
		return false;
	}
	if (idOrCode === null || idOrCode === undefined || idOrCode === "" || idOrCode === "none" || idOrCode === "off" || idOrCode === 0 || idOrCode === "0") {
		const hadPrev = !!window.spkmodVehicleSettings.equippedId;
		window.spkmodVehicleSettings.equippedId = null;
		if (typeof window !== "undefined" && window.localStorage) {
			localStorage.removeItem(SPKMOD_VEHICLE_STORAGE_KEYS.equipped);
		}
		spkmodRemoveLocalVehicle();
		if (broadcast && hadPrev) {
			spkmodTriggerVehicleSyncBroadcast({
				priority: "explicit",
				delayMs: 1000,
				forceResend: true,
				reason: "vehicle_unequip"
			});
		}
		if (!silentToast && hadPrev && typeof chatLog === "function") {
			chatLog(spkmodGetVehicleUiText("unequippedToast"));
		}
		spkmodUpdateVehicleQuickToggleBtn();
		spkmodRefreshVehiclesModalUI();
		return true;
	}

	const key = String(idOrCode).trim().toLowerCase();
	const vehicle = SPKMOD_VEHICLES_BY_ID.get(key)
		|| (/^\d+$/.test(key) ? SPKMOD_VEHICLES_BY_CODE.get(Number(key)) : null)
		|| (key === "box" || key === "cardboard" || key === "mgs" ? SPKMOD_VEHICLES_BY_ID.get("mgs_box") : null);

	if (!vehicle) {
		if (!silentToast && typeof chatLog === "function") chatLog(spkmodGetVehicleUiText("unknownVehicleToast", idOrCode));
		return false;
	}

	const dispName = spkmodGetVehicleDisplayName(vehicle);
	if (!spkmodIsVehicleUnlocked(vehicle)) {
		if (!silentToast && typeof chatLog === "function") {
			chatLog(spkmodGetVehicleUiText("lockedToast", vehicle.level, dispName));
		}
		return false;
	}

	window.spkmodVehicleSettings.equippedId = vehicle.id;
	window.spkmodVehicleSettings.lastEquippedId = vehicle.id;
	if (typeof window !== "undefined" && window.localStorage) {
		localStorage.setItem(SPKMOD_VEHICLE_STORAGE_KEYS.equipped, vehicle.id);
		localStorage.setItem(SPKMOD_VEHICLE_STORAGE_KEYS.lastEquipped, vehicle.id);
	}
	await spkmodSpawnLocalVehicle(vehicle.id, window.spkmodVehicleSettings.colorIdx);

	if (broadcast) {
		spkmodTriggerVehicleSyncBroadcast({
			priority: "explicit",
			delayMs: 1000,
			forceResend: true,
			reason: "vehicle_equip"
		});
	}
	if (!silentToast && typeof chatLog === "function") {
		const toastKey = vehicle.hidePlayer ? "equippedBoxToast" : "equippedToast";
		chatLog(spkmodGetVehicleUiText(toastKey, `${vehicle.icon} ${dispName}`, vehicle.level));
	}
	spkmodUpdateVehicleQuickToggleBtn();
	spkmodRefreshVehiclesModalUI();
	return true;
}

function spkmodGetVehicleQuickToggleLabel() {
	const eqId = window.spkmodVehicleSettings.equippedId;
	const activeVeh = eqId ? SPKMOD_VEHICLES_BY_ID.get(eqId) : null;
	const lastVeh = (!activeVeh && window.spkmodVehicleSettings.lastEquippedId)
		? SPKMOD_VEHICLES_BY_ID.get(window.spkmodVehicleSettings.lastEquippedId)
		: null;
	const icon = activeVeh?.icon || lastVeh?.icon || "🚗";
	return spkmodGetVehicleUiText(activeVeh ? "quickToggleOn" : "quickToggleOff", icon);
}
window.spkmodGetVehicleQuickToggleLabel = spkmodGetVehicleQuickToggleLabel;

function spkmodUpdateVehicleQuickToggleBtn() {
	const enabled = spkmodIsVehiclesSystemEnabled();
	const eqId = window.spkmodVehicleSettings.equippedId;
	const activeVeh = eqId ? SPKMOD_VEHICLES_BY_ID.get(eqId) : null;
	const targetVeh = activeVeh || (window.spkmodVehicleSettings.lastEquippedId ? SPKMOD_VEHICLES_BY_ID.get(window.spkmodVehicleSettings.lastEquippedId) : null);
	const label = spkmodGetVehicleQuickToggleLabel();
	const tip = targetVeh
		? spkmodGetVehicleUiText("quickToggleTooltip", `${targetVeh.icon} ${spkmodGetVehicleDisplayName(targetVeh)}`)
		: spkmodGetVehicleUiText("quickTogglePickTooltip");

	const targets = [];
	if (typeof lunPanelElements !== "undefined" && lunPanelElements?.vehicleToggleBtn) {
		targets.push(lunPanelElements.vehicleToggleBtn);
	}
	const byId = typeof document !== "undefined" ? document.getElementById("spkmod-vehicle-toggle-btn") : null;
	if (byId && !targets.includes(byId)) targets.push(byId);

	for (const btn of targets) {
		if (typeof setText === "function") setText(btn, label);
		else btn.innerText = label;
		btn.title = tip;
		btn.classList.toggle("hidden", !enabled);
	}
}
window.spkmodUpdateVehicleQuickToggleBtn = spkmodUpdateVehicleQuickToggleBtn;

async function spkmodToggleActiveVehicle() {
	if (!spkmodIsVehiclesSystemEnabled()) {
		if (typeof chatLog === "function") chatLog(spkmodGetVehicleUiText("systemDisabledToast"));
		return false;
	}
	if (window.spkmodVehicleSettings.equippedId) {
		return spkmodEquipLocalVehicle(null, true, false);
	}
	const lastId = window.spkmodVehicleSettings.lastEquippedId;
	const lastVeh = lastId ? SPKMOD_VEHICLES_BY_ID.get(lastId) : null;
	if (lastVeh && spkmodIsVehicleUnlocked(lastVeh)) {
		return spkmodEquipLocalVehicle(lastVeh.id, true, false);
	}
	if (typeof window.spkmodOpenVehiclesModal === "function") {
		window.spkmodOpenVehiclesModal();
	}
	return false;
}
window.spkmodToggleActiveVehicle = spkmodToggleActiveVehicle;

async function spkmodSetLocalVehicleColor(colorIdx, broadcast = true, silentToast = false) {
	const safeIdx = spkmodClampVehicleColorIdx(colorIdx);
	window.spkmodVehicleSettings.colorIdx = safeIdx;
	window.BurgerCarColorIdx = safeIdx;
	if (typeof window !== "undefined" && window.localStorage) {
		localStorage.setItem(SPKMOD_VEHICLE_STORAGE_KEYS.color, String(safeIdx));
	}
	const eqId = window.spkmodVehicleSettings.equippedId;
	if (eqId && spkmodIsVehiclesSystemEnabled()) {
		const veh = SPKMOD_VEHICLES_BY_ID.get(eqId);
		if (veh && spkmodIsVehicleUnlocked(veh)) {
			if (veh.paintable) {
				await spkmodSpawnLocalVehicle(veh.id, safeIdx);
			}
			if (broadcast) {
				spkmodTriggerVehicleSyncBroadcast({
					priority: "explicit",
					delayMs: 900,
					forceResend: true,
					reason: "vehicle_color"
				});
			}
		}
	}
	if (!silentToast && typeof chatLog === "function") {
		chatLog(spkmodGetVehicleUiText("colorSetToast", spkmodGetVehicleColorName(SPKMOD_VEHICLE_COLORS[safeIdx])));
	}
	spkmodRefreshVehiclesModalUI();
	return safeIdx;
}

function spkmodStartVehiclesLoopIfEnabled() {
	if (!spkmodIsVehiclesSystemEnabled()) return;
	if (_spkmodVehicleLoopRafId !== null) return;
	_spkmodVehicleLoopLastMs = performance.now();
	_spkmodVehicleLoopRafId = requestAnimationFrame(spkmodVehiclesMasterLoop);
}

function spkmodStopVehiclesLoop() {
	if (_spkmodVehicleLoopRafId !== null) {
		cancelAnimationFrame(_spkmodVehicleLoopRafId);
		_spkmodVehicleLoopRafId = null;
	}
}

function spkmodSyncVehiclesSystemUIState() {
	const enabled = spkmodIsVehiclesSystemEnabled();
	if (typeof lunPanelElements !== "undefined" && lunPanelElements) {
		if (lunPanelElements.carSystemToggleInput) {
			lunPanelElements.carSystemToggleInput.checked = enabled;
		}
		if (lunPanelElements.vehiclesBtn) {
			lunPanelElements.vehiclesBtn.classList.toggle("hidden", !enabled);
		}
	}
	const btnById = document.getElementById("spkmod-vehicles-btn");
	if (btnById) btnById.classList.toggle("hidden", !enabled);
	spkmodUpdateVehicleQuickToggleBtn();
}

window.spkmodSetCarSystemEnabled = function(nextEnabled, silentToast = false) {
	const enabled = !!nextEnabled;
	window.spkmodVehicleSettings.enabled = enabled;
	window.spkmodCarSystemEnabled = enabled;
	if (typeof window !== "undefined" && window.localStorage) {
		try {
			localStorage.setItem(SPKMOD_VEHICLE_STORAGE_KEYS.enabled, enabled ? "true" : "false");
		} catch (_) {}
	}
	spkmodSyncVehiclesSystemUIState();

	if (!enabled) {
		spkmodStopVehiclesLoop();
		spkmodRemoveLocalVehicle();
		for (const k of [..._spkmodRemoteVehicleInstances.keys()]) {
			spkmodClearRemoteVehicleOwner(k);
		}
		_spkmodRemoteVehicleStates.clear();
		if (typeof window.spkmodResetCarsEveryone === "function") {
			window.spkmodResetCarsEveryone(true, false);
		}
		const modal = document.getElementById("spkmod-vehicles-modal");
		if (modal) modal.classList.add("hidden");
	} else {
		_spkmodVehicleLastZoneId = null;
		_spkmodVehicleLastRemoteCount = 0;
		_spkmodVehicleForceSyncNow = true;
		_spkmodVehicleDidInitialRestore = false;
		spkmodStartVehiclesLoopIfEnabled();
	}

	if (!silentToast && typeof chatLog === "function") {
		chatLog(spkmodGetVehicleUiText(enabled ? "systemEnabledToast" : "systemDisabledToast"));
	}
	return enabled;
};
window.spkmodSetVehiclesSystemEnabled = window.spkmodSetCarSystemEnabled;

function spkmodVehiclesMasterLoop(nowMs) {
	_spkmodVehicleLoopRafId = null;
	if (!spkmodIsVehiclesSystemEnabled()) return;

	const dt = Math.min(0.1, Math.max(0.001, (nowMs - _spkmodVehicleLoopLastMs) / 1000));
	_spkmodVehicleLoopLastMs = nowMs;

	if (!document.hidden && typeof gameState !== "undefined" && gameState) {
		spkmodEnsureMountVisualsHook();
		spkmodEnsureVehicleHandleEmoteHook();
		const pc = gameState.playerContainer || null;
		const inMinigame = (typeof spkmodIsInIsolatedMinigame === "function") ? spkmodIsInIsolatedMinigame() : false;

		// 1. Tick active local vehicle every frame
		if (_spkmodLocalVehicleEntry && pc) {
			if (inMinigame) {
				if (_spkmodLocalVehicleEntry.root.visible) _spkmodLocalVehicleEntry.root.visible = false;
				if (_spkmodLocalVehicleEntry.hiddenAvatarRoot) {
					_spkmodLocalVehicleEntry.hiddenAvatarRoot.visible = true;
					_spkmodLocalVehicleEntry.hiddenAvatarRoot = null;
				}
			} else {
				if (!_spkmodLocalVehicleEntry.root.visible) _spkmodLocalVehicleEntry.root.visible = true;
				const ctrl = typeof spkmodGetLocalAnimController === "function"
					? spkmodGetLocalAnimController()
					: (gameState.localAnimationController || gameState.localAvatar?.animationController || null);
				spkmodTickVehicleEntry(
					_spkmodLocalVehicleEntry,
					true,
					pc,
					gameState.myPlayerId,
					gameState.localAvatar?.root || null,
					gameState.localAvatarPose?.position || null,
					ctrl,
					dt,
					nowMs
				);
			}
		}

		// 2. Tick active remote vehicles every frame (O(1) cached rp lookup + 45m animation distance culling)
		if (_spkmodRemoteVehicleInstances.size > 0) {
			const rMapTick = gameState.remotePlayers?.remotePlayers;
			const camPos = gameState.camera?.position || pc?.position || null;
			const MAX_REMOTE_VEH_ANIM_DIST_SQ = 45 * 45;
			let staleKeys = null;
			for (const [ownerKey, entry] of _spkmodRemoteVehicleInstances) {
				let rp = (rMapTick && entry.cachedRp && entry.lastRpKey !== undefined && rMapTick.get(entry.lastRpKey) === entry.cachedRp)
					? entry.cachedRp
					: null;
				if (!rp) {
					const resolved = spkmodResolveRemotePlayerForVehicle(entry.playerId, entry.playerName);
					if (resolved && resolved.rp) {
						rp = resolved.rp;
						entry.cachedRp = rp;
						entry.lastRpKey = resolved.rpKey;
					}
				}
				if (!rp || !rp.container) {
					if (!staleKeys) staleKeys = [];
					staleKeys.push(ownerKey);
					continue;
				}
				entry.lastContainer = rp.container;
				if (rp.container.visible === false) continue;
				const posePos = rp.avatarPose?.position || rp.avatar?.root?.position || null;
				const ctrl = rp.avatar?.animationController || rp.container?.controller || null;
				entry.lastPosePos = posePos;
				entry.lastCtrl = ctrl;
				if (camPos && rp.container.position) {
					const dx = rp.container.position.x - camPos.x;
					const dz = rp.container.position.z - camPos.z;
					if (dx * dx + dz * dz > MAX_REMOTE_VEH_ANIM_DIST_SQ) {
						if (entry.root.parent !== rp.container) rp.container.add(entry.root);
						if (typeof spkmodSetNativeCartVisible === "function") {
							spkmodSetNativeCartVisible(rp.container, entry.lastRpKey ?? entry.playerId, false);
						}
						if (entry.vehicle.hidePlayer && rp.avatar?.root && rp.avatar.root.visible !== false) {
							entry.hiddenAvatarRoot = rp.avatar.root;
							rp.avatar.root.visible = false;
						}
						continue;
					}
				}
				spkmodTickVehicleEntry(entry, false, rp.container, entry.lastRpKey ?? entry.playerId, rp.avatar?.root || null, posePos, ctrl, dt, nowMs, rp);
			}
			if (staleKeys) {
				for (let i = 0; i < staleKeys.length; i++) {
					spkmodClearRemoteVehicleOwner(staleKeys[i]);
				}
			}
		}

		// 3. Reconcile auto-restore, zone changes, remote-join sync, remote spawn & level updates every ~200ms
		if (_spkmodVehicleForceSyncNow || (nowMs - _spkmodVehicleLastReconcileMs >= 200)) {
			_spkmodVehicleForceSyncNow = false;
			_spkmodVehicleLastReconcileMs = nowMs;

			// Auto-restore saved vehicle once player container & level are loaded
			const eqId = window.spkmodVehicleSettings.equippedId;
			if (pc && eqId && !_spkmodLocalVehicleEntry && !_spkmodVehicleDidInitialRestore) {
				const veh = SPKMOD_VEHICLES_BY_ID.get(eqId);
				const statLoaded = !!(gameState.myStat && gameState.myStat.level != null);
				if (veh && (statLoaded || window.spkmodVehicleSettings.unlockAllTest)) {
					_spkmodVehicleDidInitialRestore = true;
					if (spkmodIsVehicleUnlocked(veh)) {
						spkmodSpawnLocalVehicle(veh.id, window.spkmodVehicleSettings.colorIdx);
					}
				}
			}

			// Zone change cleanup & passive broadcast
			const rMap = gameState.remotePlayers?.remotePlayers;
			const rCount = rMap ? rMap.size : 0;
			if (gameState.zoneId != null && gameState.zoneId !== _spkmodVehicleLastZoneId) {
				_spkmodVehicleLastZoneId = gameState.zoneId;
				for (const k of [..._spkmodRemoteVehicleInstances.keys()]) {
					spkmodClearRemoteVehicleOwner(k);
				}
				_spkmodRemoteVehicleStates.clear();
				if (eqId && spkmodIsVehicleChatSharingEnabled()) {
					_spkmodVehicleNeedsZoneSync = true;
					spkmodTriggerVehicleSyncBroadcast({
						priority: "passive",
						delayMs: 2000,
						forceResend: true,
						reason: "vehicle_zone"
					});
				}
			}

			if (rCount > 0 && eqId && spkmodIsVehicleChatSharingEnabled() && !inMinigame) {
				if (_spkmodVehicleNeedsZoneSync) {
					_spkmodVehicleNeedsZoneSync = false;
					spkmodTriggerVehicleSyncBroadcast({
						priority: "passive",
						delayMs: 2000,
						forceResend: true,
						reason: "vehicle_zone"
					});
				} else if (rCount > _spkmodVehicleLastRemoteCount) {
					spkmodTriggerVehicleSyncBroadcast({
						priority: "passive",
						delayMs: 2800,
						forceResend: true,
						reason: "vehicle_remote_join"
					});
				}
			}
			_spkmodVehicleLastRemoteCount = rCount;

			// Reconcile remote vehicles (level-checked + showRemote toggle + prune departed players after 15s grace)
			const showRemote = window.spkmodVehicleSettings.showRemoteVehicles !== false;
			const seenRemote = new Set();
			if (rMap && _spkmodRemoteVehicleStates.size > 0) {
				for (const [ownerKey, st] of _spkmodRemoteVehicleStates) {
					let resolved = null;
					if (st.cachedRp && st.cachedRpKey !== undefined && rMap.get(st.cachedRpKey) === st.cachedRp) {
						resolved = { key: String(st.cachedRpKey), rpKey: st.cachedRpKey, rp: st.cachedRp };
					} else {
						resolved = spkmodResolveRemotePlayerForVehicle(st.playerId, st.playerName);
						if (resolved && resolved.rp) {
							st.cachedRp = resolved.rp;
							st.cachedRpKey = resolved.rpKey;
						} else {
							st.cachedRp = null;
							st.cachedRpKey = undefined;
						}
					}
					if (!resolved || !resolved.rp || !resolved.rp.container) {
						if (!st._missingSinceMs) st._missingSinceMs = nowMs;
						else if (nowMs - st._missingSinceMs > 15000) {
							_spkmodRemoteVehicleStates.delete(ownerKey);
							spkmodClearRemoteVehicleOwner(ownerKey);
						}
						continue;
					}
					st._missingSinceMs = 0;
					if (!showRemote) continue;
					const vehicle = SPKMOD_VEHICLES_BY_ID.get(st.vehicleId);
					if (!vehicle) continue;
					const rpLevel = resolved.rp.info?.level ?? 0;
					const rpName = resolved.rp.info?.__spkmodOrigName || resolved.rp.info?.name || st.playerName || "";
					if (!spkmodCheckVehicleRemoteLevelAllowed(vehicle.level, rpLevel, rpName)) {
						spkmodClearRemoteVehicleOwner(ownerKey);
						continue;
					}
					seenRemote.add(ownerKey);
					spkmodSpawnOrUpdateRemoteVehicle(ownerKey, st, resolved);
				}
			}
			for (const k of [..._spkmodRemoteVehicleInstances.keys()]) {
				if (!showRemote || !seenRemote.has(k)) {
					spkmodClearRemoteVehicleOwner(k);
				}
			}

			// Refresh modal if player leveled up while garage is open
			const modal = document.getElementById("spkmod-vehicles-modal");
			if (modal && !modal.classList.contains("hidden")) {
				const curLvl = spkmodGetVehiclePlayerLevel();
				if (curLvl !== _spkmodVehicleLastObservedLevel) {
					_spkmodVehicleLastObservedLevel = curLvl;
					spkmodRefreshVehiclesModalUI();
				}
			}
		}
	}

	if (spkmodIsVehiclesSystemEnabled()) {
		_spkmodVehicleLoopRafId = requestAnimationFrame(spkmodVehiclesMasterLoop);
	}
}

// ============================================================================
// 8. VEHICLES & STEALTH GARAGE MODAL UI (#spkmod-vehicles-modal, Alt+V)
// ============================================================================
let _spkmodVehicleFilterTab = "all";
let _spkmodVehicleSearchQuery = "";

function spkmodInjectVehiclesStyles() {
	if (document.getElementById("spkmod-vehicles-styles")) return;
	const st = document.createElement("style");
	st.id = "spkmod-vehicles-styles";
	st.textContent = `
		#spkmod-vehicles-modal {
			width: 780px;
			height: 640px;
			max-width: 95vw;
			max-height: 86vh;
			display: flex;
			flex-direction: column;
			background: rgba(15, 20, 32, 0.96);
			border: 1.5px solid rgba(56, 189, 248, 0.45);
			border-radius: 14px;
			box-shadow: 0 20px 55px rgba(0,0,0,0.72);
			color: #f8fafc;
			font-family: inherit;
			overflow: hidden;
			z-index: 2147483610;
		}
		#spkmod-vehicles-modal.hidden { display: none !important; }
		.spkmod-veh-header {
			display: flex; align-items: center; justify-content: space-between;
			padding: 12px 16px;
			background: linear-gradient(90deg, rgba(14,165,233,0.22), rgba(245,158,11,0.18));
			border-bottom: 1px solid rgba(255,255,255,0.1);
			cursor: grab; user-select: none; flex-shrink: 0;
		}
		.spkmod-veh-status {
			display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: space-between;
			padding: 9px 14px; background: rgba(255,255,255,0.035);
			border-bottom: 1px solid rgba(255,255,255,0.07); font-size: 12px; flex-shrink: 0;
		}
		.spkmod-veh-colors {
			display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
			padding: 8px 14px; background: rgba(0,0,0,0.22);
			border-bottom: 1px solid rgba(255,255,255,0.07); font-size: 11px; flex-shrink: 0;
		}
		.spkmod-veh-swatch {
			width: 22px; height: 22px; border-radius: 50%; cursor: pointer;
			border: 2px solid rgba(255,255,255,0.28); transition: transform 0.12s, box-shadow 0.12s;
			padding: 0;
		}
		.spkmod-veh-swatch:hover { transform: scale(1.16); }
		.spkmod-veh-swatch.active {
			border-color: #ffffff;
			box-shadow: 0 0 0 2px #38bdf8, 0 0 10px rgba(56,189,248,0.65);
			transform: scale(1.18);
		}
		.spkmod-veh-controls {
			display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
			padding: 9px 14px; border-bottom: 1px solid rgba(255,255,255,0.07); flex-shrink: 0;
		}
		.spkmod-veh-tabs {
			display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 14px;
			border-bottom: 1px solid rgba(255,255,255,0.07); background: rgba(0,0,0,0.16); flex-shrink: 0;
		}
		.spkmod-veh-tab {
			background: rgba(255,255,255,0.06); color: #cbd5e1;
			border: 1px solid rgba(255,255,255,0.12); border-radius: 999px;
			padding: 4px 11px; font-size: 11px; font-weight: 700; cursor: pointer;
		}
		.spkmod-veh-tab.active {
			background: linear-gradient(90deg, #0284c7, #2563eb); color: #fff; border-color: #38bdf8;
		}
		.spkmod-veh-grid {
			display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
			align-content: start;
			gap: 10px; padding: 12px 14px; overflow-y: auto; flex: 1 1 0; min-height: 0;
			overscroll-behavior: contain;
		}
		.spkmod-veh-card {
			position: relative; display: flex; flex-direction: column; align-items: center;
			padding: 12px 10px 10px; border-radius: 12px;
			background: rgba(30, 41, 59, 0.72); border: 1.5px solid rgba(255,255,255,0.11);
			transition: transform 0.14s, border-color 0.14s, box-shadow 0.14s;
			text-align: center; gap: 5px;
		}
		.spkmod-veh-card:hover { transform: translateY(-2px); border-color: rgba(56,189,248,0.55); }
		.spkmod-veh-card.equipped {
			border-color: #38bdf8; box-shadow: 0 0 16px rgba(56,189,248,0.35);
			background: linear-gradient(180deg, rgba(14,165,233,0.22), rgba(30,41,59,0.85));
		}
		.spkmod-veh-card.locked { opacity: 0.62; filter: grayscale(0.35); }
		.spkmod-veh-card.milestone { border-color: rgba(250, 204, 21, 0.55); }
		.spkmod-veh-lvl {
			position: absolute; top: 7px; left: 8px; font-size: 10px; font-weight: 800;
			padding: 2px 6px; border-radius: 6px; background: rgba(15,23,42,0.85); color: #7dd3fc;
			border: 1px solid rgba(56,189,248,0.3);
		}
		.spkmod-veh-card.milestone .spkmod-veh-lvl {
			background: linear-gradient(90deg, #b45309, #eab308); color: #111827; border-color: #fde047;
		}
		.spkmod-veh-fav {
			position: absolute; top: 5px; right: 7px; background: none; border: none;
			font-size: 15px; cursor: pointer; color: #94a3b8; padding: 0 2px; line-height: 1;
		}
		.spkmod-veh-fav.active { color: #facc15; text-shadow: 0 0 8px rgba(250,204,21,0.6); }
		.spkmod-veh-icon { font-size: 34px; margin-top: 12px; line-height: 1.1; }
		.spkmod-veh-name { font-size: 12px; font-weight: 800; color: #f8fafc; line-height: 1.25; min-height: 30px; display: flex; align-items: center; }
		.spkmod-veh-tags { display: flex; gap: 4px; flex-wrap: wrap; justify-content: center; }
		.spkmod-veh-tag {
			font-size: 9.5px; font-weight: 700; padding: 1px 6px; border-radius: 999px;
			background: rgba(255,255,255,0.09); color: #cbd5e1;
		}
		.spkmod-veh-tag.stealth { background: rgba(217, 119, 6, 0.28); color: #fcd34d; border: 1px solid rgba(245,158,11,0.45); }
		.spkmod-veh-btn {
			margin-top: auto; width: 100%; padding: 6px 8px; border-radius: 8px;
			border: none; font-size: 11px; font-weight: 800; cursor: pointer;
			background: linear-gradient(90deg, #0284c7, #2563eb); color: #fff;
		}
		.spkmod-veh-btn.equipped { background: linear-gradient(90deg, #059669, #10b981); }
		.spkmod-veh-btn.locked { background: rgba(71, 85, 105, 0.65); color: #94a3b8; cursor: not-allowed; }
		.spkmod-veh-hype {
			grid-column: 1 / -1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			text-align: center;
			gap: 6px;
			margin-top: 4px;
			padding: 18px 16px;
			border-radius: 12px;
			border: 1.5px dashed rgba(255, 213, 74, 0.55);
			background: linear-gradient(135deg, rgba(255, 213, 74, 0.10), rgba(56, 189, 248, 0.14), rgba(15, 23, 42, 0.92));
			box-shadow: inset 0 0 24px rgba(255, 213, 74, 0.08);
		}
	`;
	document.head.appendChild(st);
}

function spkmodEnsureVehiclesModal() {
	let modal = document.getElementById("spkmod-vehicles-modal");
	if (modal) return modal;
	spkmodInjectVehiclesStyles();

	modal = document.createElement("div");
	modal.id = "spkmod-vehicles-modal";
	modal.className = "spkmod-modal hidden";
	modal.style.position = "fixed";

	const header = document.createElement("div");
	header.className = "spkmod-veh-header";
	const title = document.createElement("span");
	title.id = "spkmod-vehicles-title";
	title.style.cssText = "font-size: 14px; font-weight: 900; letter-spacing: 0.2px;";
	title.innerText = spkmodGetVehicleUiText("modalTitle");

	const closeBtn = document.createElement("button");
	closeBtn.type = "button";
	closeBtn.innerText = "✕";
	closeBtn.style.cssText = "background: rgba(255,255,255,0.12); color: #fff; border: none; border-radius: 6px; width: 26px; height: 26px; font-weight: 900; cursor: pointer;";
	closeBtn.onclick = () => modal.classList.add("hidden");
	header.appendChild(title);
	header.appendChild(closeBtn);

	const statusBar = document.createElement("div");
	statusBar.id = "spkmod-vehicles-status";
	statusBar.className = "spkmod-veh-status";

	const colorBar = document.createElement("div");
	colorBar.id = "spkmod-vehicles-colors";
	colorBar.className = "spkmod-veh-colors";

	const controlsBar = document.createElement("div");
	controlsBar.id = "spkmod-vehicles-controls";
	controlsBar.className = "spkmod-veh-controls";

	const tabsBar = document.createElement("div");
	tabsBar.id = "spkmod-vehicles-tabs";
	tabsBar.className = "spkmod-veh-tabs";

	const grid = document.createElement("div");
	grid.id = "spkmod-vehicles-grid";
	grid.className = "spkmod-veh-grid";

	const resizeHandle = document.createElement("div");
	resizeHandle.id = "spkmod-vehicles-resize-handle";
	resizeHandle.style.cssText = "position: absolute; right: 0; bottom: 0; width: 16px; height: 16px; cursor: nwse-resize; z-index: 2; background: linear-gradient(135deg, transparent 50%, rgba(56,189,248,0.6) 50%); border-bottom-right-radius: 12px;";

	modal.appendChild(header);
	modal.appendChild(statusBar);
	modal.appendChild(colorBar);
	modal.appendChild(controlsBar);
	modal.appendChild(tabsBar);
	modal.appendChild(grid);
	modal.appendChild(resizeHandle);
	document.body.appendChild(modal);

	if (typeof lunHudElements !== "undefined" && lunHudElements) {
		lunHudElements.vehiclesModal = modal;
	}
	if (typeof makeDraggable === "function") {
		makeDraggable(modal, [header]);
	}
	if (typeof makeResizable === "function") {
		makeResizable(modal, resizeHandle, 460, 420);
	}

	const scrollDelta = (e) => (e.deltaMode === 1 ? e.deltaY * 33 : (e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY));
	grid.addEventListener("wheel", (e) => { e.stopPropagation(); }, { passive: true });
	grid.addEventListener("touchmove", (e) => { e.stopPropagation(); }, { passive: true });
	modal.addEventListener("wheel", (e) => {
		e.stopPropagation();
		if (grid && e.target !== grid && !grid.contains(e.target)) {
			grid.scrollTop += scrollDelta(e);
		}
	}, { passive: true });
	modal.addEventListener("touchmove", (e) => { e.stopPropagation(); }, { passive: true });
	modal.addEventListener("mouseenter", () => {
		if (document.pointerLockElement) {
			try { document.exitPointerLock(); } catch (_) {}
		}
	});
	for (const el of [statusBar, colorBar, controlsBar, tabsBar, grid]) {
		el.addEventListener("pointerdown", (e) => e.stopPropagation());
		el.addEventListener("mousedown", (e) => e.stopPropagation());
	}
	modal.addEventListener("mousedown", () => {
		if (typeof bringToFront === "function") bringToFront(modal);
	});
	return modal;
}

function spkmodRenderVehiclesStatusBar() {
	const bar = document.getElementById("spkmod-vehicles-status");
	if (!bar) return;
	const lvl = spkmodGetVehiclePlayerLevel();
	const unlockedCount = SPKMOD_VEHICLE_CATALOG.filter(v => spkmodIsVehicleUnlocked(v)).length;
	const eqVeh = window.spkmodVehicleSettings.equippedId ? SPKMOD_VEHICLES_BY_ID.get(window.spkmodVehicleSettings.equippedId) : null;
	const eqLabel = eqVeh ? `${eqVeh.icon} ${spkmodGetVehicleDisplayName(eqVeh)}` : spkmodGetVehicleUiText("noneEquipped");

	bar.innerHTML = "";
	const makePill = (label, val, color) => {
		const sp = document.createElement("span");
		sp.innerHTML = `<strong style="color:#94a3b8;">${label}:</strong> <strong style="color:${color};">${val}</strong>`;
		return sp;
	};
	bar.appendChild(makePill(spkmodGetVehicleUiText("myLevelLabel"), `Lv.${lvl}`, "#7dd3fc"));
	bar.appendChild(makePill(spkmodGetVehicleUiText("unlockedLabel"), `${unlockedCount} / ${SPKMOD_VEHICLE_CATALOG.length}`, "#4ade80"));
	bar.appendChild(makePill(spkmodGetVehicleUiText("equippedLabel"), eqLabel, "#fde047"));
}

function spkmodRenderVehiclesColorBar() {
	const bar = document.getElementById("spkmod-vehicles-colors");
	if (!bar) return;
	bar.innerHTML = "";

	const lbl = document.createElement("strong");
	lbl.style.cssText = "color: #cbd5e1; margin-right: 4px;";
	lbl.innerText = "🎨 " + spkmodGetVehicleUiText("paintColorLabel") + ":";
	bar.appendChild(lbl);

	const curIdx = spkmodClampVehicleColorIdx(window.spkmodVehicleSettings.colorIdx);
	for (const c of SPKMOD_VEHICLE_COLORS) {
		const sw = document.createElement("button");
		sw.type = "button";
		sw.className = "spkmod-veh-swatch" + (c.idx === curIdx ? " active" : "");
		sw.style.background = c.css;
		sw.title = spkmodGetVehicleColorName(c);
		sw.onclick = () => spkmodSetLocalVehicleColor(c.idx, true, false);
		bar.appendChild(sw);
	}

	const randBtn = document.createElement("button");
	randBtn.type = "button";
	randBtn.innerText = spkmodGetVehicleUiText("btnRandomColor");
	randBtn.style.cssText = "margin-left: 4px; background: rgba(255,255,255,0.1); color: #f8fafc; border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; padding: 3px 8px; font-size: 11px; font-weight: 700; cursor: pointer;";
	randBtn.onclick = () => {
		let next = Math.floor(Math.random() * SPKMOD_VEHICLE_COLORS.length);
		if (next === curIdx) next = (next + 1) % SPKMOD_VEHICLE_COLORS.length;
		spkmodSetLocalVehicleColor(next, true, false);
	};
	bar.appendChild(randBtn);

	const honkBtn = document.createElement("button");
	honkBtn.type = "button";
	honkBtn.innerText = spkmodGetVehicleUiText("btnHonk");
	honkBtn.style.cssText = "margin-left: auto; background: rgba(245,158,11,0.22); color: #fef3c7; border: 1px solid rgba(245,158,11,0.5); border-radius: 6px; padding: 3px 9px; font-size: 11px; font-weight: 800; cursor: pointer;";
	honkBtn.onclick = () => {
		if (_spkmodLocalVehicleEntry) {
			spkmodTriggerLocalVehicleAction({ broadcast: true, secondary: null, ignoreCooldown: true });
		}
	};
	bar.appendChild(honkBtn);
}

function spkmodRenderVehiclesControlsBar() {
	const bar = document.getElementById("spkmod-vehicles-controls");
	if (!bar) return;
	bar.innerHTML = "";

	const search = document.createElement("input");
	search.type = "text";
	search.value = _spkmodVehicleSearchQuery;
	search.placeholder = spkmodGetVehicleUiText("searchPlaceholder");
	search.style.cssText = "flex: 1; min-width: 170px; background: rgba(15,23,42,0.85); color: #fff; border: 1px solid rgba(255,255,255,0.18); border-radius: 7px; padding: 5px 9px; font-size: 11.5px;";
	search.oninput = (e) => {
		_spkmodVehicleSearchQuery = e.target.value || "";
		spkmodRenderVehiclesGrid();
	};
	search.addEventListener("keydown", (e) => e.stopPropagation());
	search.addEventListener("keyup", (e) => e.stopPropagation());
	bar.appendChild(search);

	const makeCheck = (checked, labelKey, onChange) => {
		const lbl = document.createElement("label");
		lbl.style.cssText = "display: inline-flex; align-items: center; gap: 5px; font-size: 11px; color: #e2e8f0; cursor: pointer; user-select: none;";
		const cb = document.createElement("input");
		cb.type = "checkbox";
		cb.checked = checked;
		cb.onchange = (e) => onChange(e.target.checked);
		lbl.appendChild(cb);
		lbl.appendChild(document.createTextNode(spkmodGetVehicleUiText(labelKey)));
		return lbl;
	};

	bar.appendChild(makeCheck(window.spkmodVehicleSettings.showRemoteVehicles !== false, "toggleRemote", (v) => {
		window.spkmodVehicleSettings.showRemoteVehicles = !!v;
		if (window.localStorage) localStorage.setItem(SPKMOD_VEHICLE_STORAGE_KEYS.showRemote, v ? "true" : "false");
		_spkmodVehicleForceSyncNow = true;
	}));

	bar.appendChild(makeCheck(window.spkmodVehicleSettings.shareInChat !== false, "toggleShareInChat", (v) => {
		window.spkmodVehicleSettings.shareInChat = !!v;
		if (window.localStorage) localStorage.setItem(SPKMOD_VEHICLE_STORAGE_KEYS.shareInChat, v ? "true" : "false");
		if (v && window.spkmodVehicleSettings.equippedId) {
			spkmodTriggerVehicleSyncBroadcast({ priority: "explicit", delayMs: 600, forceResend: true, reason: "vehicle_share_on" });
		}
	}));

	const syncBtn = document.createElement("button");
	syncBtn.type = "button";
	syncBtn.innerText = spkmodGetVehicleUiText("btnResync");
	syncBtn.style.cssText = "background: rgba(56,189,248,0.2); color: #e0f2fe; border: 1px solid rgba(56,189,248,0.45); border-radius: 7px; padding: 4px 9px; font-size: 11px; font-weight: 800; cursor: pointer;";
	syncBtn.onclick = () => {
		if (!spkmodIsVehicleChatSharingEnabled()) {
			if (typeof chatLog === "function") chatLog(spkmodGetVehicleUiText("shareDisabledToast"));
			return;
		}
		spkmodTriggerVehicleSyncBroadcast({ priority: "explicit", delayMs: 250, forceResend: true, reason: "vehicle_manual_sync" });
		if (typeof chatLog === "function") chatLog(spkmodGetVehicleUiText("broadcastToast"));
	};
	bar.appendChild(syncBtn);

	const exitBtn = document.createElement("button");
	exitBtn.type = "button";
	exitBtn.innerText = spkmodGetVehicleUiText("btnUnequip");
	exitBtn.style.cssText = "background: rgba(239,68,68,0.22); color: #fecaca; border: 1px solid rgba(239,68,68,0.45); border-radius: 7px; padding: 4px 9px; font-size: 11px; font-weight: 800; cursor: pointer;";
	exitBtn.onclick = () => spkmodEquipLocalVehicle(null, true, false);
	bar.appendChild(exitBtn);
}

function spkmodRenderVehiclesTabs() {
	const bar = document.getElementById("spkmod-vehicles-tabs");
	if (!bar) return;
	bar.innerHTML = "";
	const unlockedCount = SPKMOD_VEHICLE_CATALOG.filter(v => spkmodIsVehicleUnlocked(v)).length;
	const favCount = SPKMOD_VEHICLE_CATALOG.filter(v => spkmodIsVehicleUnlocked(v) && spkmodIsVehicleFavorite(v.id)).length;
	const tabs = [
		{ id: "all", label: `${spkmodGetVehicleUiText("tabAll")} (${unlockedCount})` },
		{ id: "unlocked", label: spkmodGetVehicleUiText("tabUnlocked") },
		{ id: "favorites", label: `${spkmodGetVehicleUiText("tabFavorites")} (${favCount})` },
		{ id: "street", label: spkmodGetVehicleUiText("tabStreet") },
		{ id: "stealth", label: spkmodGetVehicleUiText("tabStealth") },
		{ id: "air", label: spkmodGetVehicleUiText("tabAir") }
	];
	for (const tb of tabs) {
		const btn = document.createElement("button");
		btn.type = "button";
		btn.className = "spkmod-veh-tab" + (_spkmodVehicleFilterTab === tb.id ? " active" : "");
		btn.innerText = tb.label;
		btn.onclick = () => {
			_spkmodVehicleFilterTab = tb.id;
			spkmodRenderVehiclesTabs();
			spkmodRenderVehiclesGrid();
		};
		bar.appendChild(btn);
	}
}

function spkmodRenderVehiclesGrid() {
	const grid = document.getElementById("spkmod-vehicles-grid");
	if (!grid) return;
	grid.innerHTML = "";

	const q = _spkmodVehicleSearchQuery.trim().toLowerCase();
	const eqId = window.spkmodVehicleSettings.equippedId;
	let tabLockedRemaining = [];
	const list = SPKMOD_VEHICLE_CATALOG.filter(v => {
		const unlocked = spkmodIsVehicleUnlocked(v);
		if (_spkmodVehicleFilterTab === "favorites" && !spkmodIsVehicleFavorite(v.id)) return false;
		if (_spkmodVehicleFilterTab === "street" && v.category !== "street") return false;
		if (_spkmodVehicleFilterTab === "stealth" && v.category !== "stealth") return false;
		if (_spkmodVehicleFilterTab === "air" && v.category !== "air") return false;
		// Never show locked vehicles — keep future unlocks as mystery rewards!
		if (!unlocked) {
			tabLockedRemaining.push(v);
			return false;
		}
		if (q) {
			const disp = spkmodGetVehicleDisplayName(v).toLowerCase();
			const hay = `${disp} ${v.id} ${v.category} lv${v.level} ${v.level}`;
			if (!hay.includes(q)) return false;
		}
		return true;
	}).sort((a, b) => {
		const fa = spkmodIsVehicleFavorite(a.id) ? 0 : 1;
		const fb = spkmodIsVehicleFavorite(b.id) ? 0 : 1;
		if (fa !== fb) return fa - fb;
		return (a.level - b.level) || (a.code - b.code);
	});

	if (list.length === 0 && _spkmodVehicleFilterTab === "favorites") {
		const empty = document.createElement("div");
		empty.style.cssText = "grid-column: 1 / -1; text-align: center; padding: 28px 16px; color: #94a3b8; font-size: 12.5px;";
		empty.innerText = spkmodGetVehicleUiText("favEmptyHint");
		grid.appendChild(empty);
		return;
	}

	for (const v of list) {
		const isEq = eqId === v.id;
		const isFav = spkmodIsVehicleFavorite(v.id);
		const dispName = spkmodGetVehicleDisplayName(v);

		const card = document.createElement("div");
		card.className = "spkmod-veh-card" + (isEq ? " equipped" : "") + (v.milestone ? " milestone" : "");

		const lvlBadge = document.createElement("span");
		lvlBadge.className = "spkmod-veh-lvl";
		lvlBadge.innerText = v.milestone ? `★ Lv.${v.level}` : `Lv.${v.level}`;
		card.appendChild(lvlBadge);

		const favBtn = document.createElement("button");
		favBtn.type = "button";
		favBtn.className = "spkmod-veh-fav" + (isFav ? " active" : "");
		favBtn.innerText = isFav ? "★" : "☆";
		favBtn.title = spkmodGetVehicleUiText(isFav ? "favRemoveTooltip" : "favAddTooltip");
		favBtn.onclick = (e) => {
			e.stopPropagation();
			spkmodToggleVehicleFavorite(v.id);
			spkmodRenderVehiclesTabs();
			spkmodRenderVehiclesGrid();
		};
		card.appendChild(favBtn);

		const iconEl = document.createElement("div");
		iconEl.className = "spkmod-veh-icon";
		iconEl.innerText = v.icon;
		card.appendChild(iconEl);

		const nameEl = document.createElement("div");
		nameEl.className = "spkmod-veh-name";
		nameEl.innerText = dispName;
		card.appendChild(nameEl);

		const tags = document.createElement("div");
		tags.className = "spkmod-veh-tags";
		const catTag = document.createElement("span");
		catTag.className = "spkmod-veh-tag";
		catTag.innerText = spkmodGetVehicleUiText(v.category === "street" ? "catStreet" : (v.category === "stealth" ? "catStealth" : "catAir"));
		tags.appendChild(catTag);

		if (v.hidePlayer) {
			const hideTag = document.createElement("span");
			hideTag.className = "spkmod-veh-tag stealth";
			hideTag.innerText = "🙈 " + spkmodGetVehicleUiText("tagStealthHide");
			tags.appendChild(hideTag);
		} else if (v.paintable) {
			const paintTag = document.createElement("span");
			paintTag.className = "spkmod-veh-tag";
			paintTag.innerText = "🎨 " + spkmodGetVehicleUiText("tagPaintable");
			tags.appendChild(paintTag);
		} else if (v.pose === "stand") {
			const surfTag = document.createElement("span");
			surfTag.className = "spkmod-veh-tag";
			surfTag.innerText = "🏄 " + spkmodGetVehicleUiText("tagStanding");
			tags.appendChild(surfTag);
		}
		card.appendChild(tags);

		const actionBtn = document.createElement("button");
		actionBtn.type = "button";
		actionBtn.className = "spkmod-veh-btn" + (isEq ? " equipped" : "");
		if (isEq) {
			actionBtn.innerText = spkmodGetVehicleUiText("btnEquipped");
		} else {
			actionBtn.innerText = spkmodGetVehicleUiText(v.hidePlayer ? "btnEquipStealth" : "btnEquip");
		}
		actionBtn.onclick = () => {
			if (isEq) spkmodEquipLocalVehicle(null, true, false);
			else spkmodEquipLocalVehicle(v.id, true, false);
		};
		card.appendChild(actionBtn);
		grid.appendChild(card);
	}

	// Encouraging "Keep leveling up to unlock more!" Hype Banner whenever locked vehicles remain
	const allLockedRemaining = SPKMOD_VEHICLE_CATALOG.filter(v => !spkmodIsVehicleUnlocked(v)).sort((a, b) => a.level - b.level);
	const bannerLocked = (tabLockedRemaining.length > 0 ? tabLockedRemaining.slice().sort((a, b) => a.level - b.level) : allLockedRemaining);
	if (bannerLocked.length > 0 && !q && _spkmodVehicleFilterTab !== "favorites") {
		const hype = document.createElement("div");
		hype.id = "spkmod-vehicles-hype-banner";
		hype.className = "spkmod-veh-hype";
		hype.innerHTML = `<div style="font-size: 22px; line-height: 1;">✨🔒🚗✨</div>`
			+ `<div style="font-size: 14px; font-weight: 800; color: #ffd54a; letter-spacing: 0.2px;">${spkmodGetVehicleUiText("hypeTitle")}</div>`
			+ `<div style="font-size: 11.5px; color: #cbd5e1; max-width: 580px;">${spkmodGetVehicleUiText("hypeDesc", bannerLocked.length, bannerLocked[0].level)}</div>`;
		grid.appendChild(hype);
	}
}

function spkmodRefreshVehiclesModalUI() {
	const modal = document.getElementById("spkmod-vehicles-modal");
	if (!modal || modal.classList.contains("hidden")) return;
	const titleEl = document.getElementById("spkmod-vehicles-title");
	if (titleEl) titleEl.innerText = spkmodGetVehicleUiText("modalTitle");
	spkmodRenderVehiclesStatusBar();
	spkmodRenderVehiclesColorBar();
	spkmodRenderVehiclesControlsBar();
	spkmodRenderVehiclesTabs();
	spkmodRenderVehiclesGrid();
}
window.spkmodRefreshVehiclesModalUI = spkmodRefreshVehiclesModalUI;

window.spkmodOpenVehiclesModal = function() {
	if (!spkmodIsVehiclesSystemEnabled()) {
		const existing = document.getElementById("spkmod-vehicles-modal");
		if (existing) existing.classList.add("hidden");
		if (typeof chatLog === "function") chatLog(spkmodGetVehicleUiText("systemDisabledToast"));
		return;
	}
	const modal = spkmodEnsureVehiclesModal();
	modal.classList.remove("hidden");
	_spkmodVehicleLastObservedLevel = spkmodGetVehiclePlayerLevel();
	spkmodRefreshVehiclesModalUI();
	if (typeof positionModalNicely === "function") positionModalNicely(modal);
	if (typeof bringToFront === "function") bringToFront(modal);
};

window.spkmodToggleVehiclesModal = function() {
	if (!spkmodIsVehiclesSystemEnabled()) {
		const existing = document.getElementById("spkmod-vehicles-modal");
		if (existing) existing.classList.add("hidden");
		if (typeof chatLog === "function") chatLog(spkmodGetVehicleUiText("systemDisabledToast"));
		return;
	}
	const modal = spkmodEnsureVehiclesModal();
	if (modal.classList.contains("hidden")) window.spkmodOpenVehiclesModal();
	else modal.classList.add("hidden");
};

// Hotkey Alt+V to open Vehicles Garage, Alt+X to quick-toggle active/last vehicle ON/OFF
window.addEventListener("keydown", e => {
	if (!spkmodIsVehiclesSystemEnabled()) return;
	if (e.altKey && !e.ctrlKey && !e.metaKey) {
		const active = document.activeElement;
		if (active) {
			const tag = active.tagName ? active.tagName.toLowerCase() : "";
			if (tag === "input" || tag === "textarea" || active.isContentEditable) return;
		}
		if (e.key === "v" || e.key === "V" || e.code === "KeyV") {
			e.preventDefault();
			window.spkmodToggleVehiclesModal();
		} else if (e.key === "x" || e.key === "X" || e.code === "KeyX") {
			e.preventDefault();
			spkmodToggleActiveVehicle();
		}
	}
});

if (typeof spkmodI18nRenderers !== "undefined" && Array.isArray(spkmodI18nRenderers)) {
	spkmodI18nRenderers.push(() => {
		spkmodSyncVehiclesSystemUIState();
		spkmodRefreshVehiclesModalUI();
	});
}

spkmodSyncVehiclesSystemUIState();
spkmodStartVehiclesLoopIfEnabled();

// ============================================================================
// 9. DEVELOPER & USER CONSOLE COMMANDS API (window.spkmodVehicles)
// ============================================================================
window.spkmodVehicles = {
	catalog: SPKMOD_VEHICLE_CATALOG,
	colors: SPKMOD_VEHICLE_COLORS,
	isEnabled: () => spkmodIsVehiclesSystemEnabled(),
	setEnabled: (enable, silentToast = false) => window.spkmodSetCarSystemEnabled(!!enable, silentToast),
	open: () => window.spkmodOpenVehiclesModal(),
	toggle: () => window.spkmodToggleVehiclesModal(),
	quickToggle: () => spkmodToggleActiveVehicle(),
	equip: (idOrCode, broadcast = true, silentToast = false) => spkmodEquipLocalVehicle(idOrCode, broadcast, silentToast),
	unequip: (broadcast = true, silentToast = false) => spkmodEquipLocalVehicle(null, broadcast, silentToast),
	setColor: (colorIdx, broadcast = true, silentToast = false) => spkmodSetLocalVehicleColor(colorIdx, broadcast, silentToast),
	honk: (secondary = null) => {
		if (_spkmodLocalVehicleEntry) {
			spkmodTriggerLocalVehicleAction({
				broadcast: true,
				secondary: (secondary === true || secondary === false) ? secondary : null,
				ignoreCooldown: true
			});
		}
	},
	toggleFavorite: (id) => {
		const next = spkmodToggleVehicleFavorite(id);
		spkmodRefreshVehiclesModalUI();
		return next;
	},
	getFavorites: () => [...(window.spkmodVehicleSettings.favorites || [])],
	unlockAll: (enable, silentToast = false) => {
		const next = enable !== undefined ? !!enable : !window.spkmodVehicleSettings.unlockAllTest;
		window.spkmodVehicleSettings.unlockAllTest = next;
		if (window.localStorage) localStorage.setItem(SPKMOD_VEHICLE_STORAGE_KEYS.unlockAll, next ? "true" : "false");
		if (!next) {
			const eqVeh = window.spkmodVehicleSettings.equippedId ? SPKMOD_VEHICLES_BY_ID.get(window.spkmodVehicleSettings.equippedId) : null;
			if (eqVeh && !spkmodIsVehicleLegitimatelyUnlocked(eqVeh)) {
				spkmodEquipLocalVehicle(null, false, true);
			}
		}
		spkmodRefreshVehiclesModalUI();
		if (!silentToast && typeof chatLog === "function") {
			chatLog(spkmodGetVehicleUiText(next ? "testUnlockEnabledToast" : "testUnlockDisabledToast"));
		}
		return next;
	},
	list: () => {
		console.table(SPKMOD_VEHICLE_CATALOG.map(v => ({
			Code: v.code,
			Level: v.level,
			ID: v.id,
			Category: v.category,
			Icon: v.icon,
			StealthHide: !!v.hidePlayer,
			Name: spkmodGetVehicleDisplayName(v)
		})));
	}
};
