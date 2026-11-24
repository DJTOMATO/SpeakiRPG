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
	btnHonk: "🎺 Horn / ! Alert (F/G)",
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
	equippedToast: "🚗 Riding {0} (Lv.{1})! Press F / G for Horn or Special Action!",
	equippedBoxToast: "📦 Hidden inside {0}! Move to sneak-waddle, press F / G for ! / ? Alert!",
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
// 3. SYNTHESIZED SOUND EFFECTS & MGS ALERT AUDIO (F / G KEYS)
// ============================================================================
let _spkmodVehicleAudioCtx = null;

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

function spkmodPlayVehicleSfx(vehicle, secondary = false) {
	if (!vehicle) return;
	const vol = spkmodGetVehicleSfxVol();
	if (vol <= 0.001) return;

	if (vehicle.sfxType === "car_horn") {
		if (typeof spkmodPlayBurgerCarAudio === "function") {
			spkmodPlayBurgerCarAudio(
				secondary ? "/audio/sfx/burger_shop/carHornDouble.mp3" : "/audio/sfx/burger_shop/carHorn.mp3"
			);
			return;
		}
	}

	const ctx = spkmodGetVehicleAudioCtx();
	if (!ctx) return;
	const now = ctx.currentTime + 0.01;
	const v = Math.max(0.04, Math.min(0.28, vol * 0.32));

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

function spkmodVehMat(THREE, color, extra = {}) {
	if (THREE.MeshToonMaterial) {
		return new THREE.MeshToonMaterial(Object.assign({ color }, extra));
	}
	return new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.55, metalness: 0.1 }, extra));
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
	tex.needsUpdate = true;
	_spkmodAlertTextures.set(key, tex);
	return tex;
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

		// Alert sprite ("!" / "?") above the box triggered by F/G
		const alertTex = spkmodGetAlertSpriteTexture(THREE, "!");
		const alertMat = new THREE.SpriteMaterial({ map: alertTex, transparent: true, depthTest: false });
		const alertSprite = new THREE.Sprite(alertMat);
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
	const alertMat = new THREE.SpriteMaterial({ map: alertTex, transparent: true, depthTest: false });
	const alertSprite = new THREE.Sprite(alertMat);
	alertSprite.position.set(0, alertY, 0);
	alertSprite.scale.set(0.75, 0.75, 1);
	alertSprite.visible = false;
	root.add(alertSprite);
	return { isMgsBox: true, leftFoot, rightFoot, alertSprite };
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
		put(bodyGroup, new THREE.CylinderGeometry(0.08, 0.08, 0.54, 10), chromeMat, [0, 0.34, 0]);
		for (let i = 0; i < 5; i++) {
			const a = (i / 5) * Math.PI * 2;
			put(bodyGroup, new THREE.BoxGeometry(0.10, 0.07, 0.62), darkMat, [Math.sin(a) * 0.30, 0.14, Math.cos(a) * 0.30], [0, a, 0]);
			put(bodyGroup, new THREE.SphereGeometry(0.08, 8, 8), tireMat, [Math.sin(a) * 0.56, 0.08, Math.cos(a) * 0.56]);
		}
		put(spinTop, new THREE.BoxGeometry(0.92, 0.16, 0.88), paintMat, [0, 0.66, 0]);
		put(spinTop, new THREE.BoxGeometry(0.88, 1.04, 0.16), paintMat, [0, 1.22, -0.40]);
		for (const s of [-1, 1]) put(spinTop, new THREE.BoxGeometry(0.10, 0.08, 0.58), darkMat, [s * 0.48, 0.96, 0.04]);
		animParts.push({ type: "spinMoveY", node: spinTop, speed: 6.5 });
		return { seatOffsetY: 0.88 };
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
		const grn = spkmodVehMat(THREE, 0x16a34a), red = spkmodVehMat(THREE, 0xf43f5e);
		put(bodyGroup, new THREE.CylinderGeometry(1.16, 1.16, 0.78, 20, 1, false, 0, Math.PI), grn, [0, 0.96, 0], [0, Math.PI / 2, Math.PI]);
		put(bodyGroup, new THREE.CylinderGeometry(1.02, 1.02, 0.80, 20, 1, false, 0, Math.PI), red, [0, 0.96, 0], [0, Math.PI / 2, Math.PI]);
		for (const [y, z] of [[0.62, 0.36], [0.62, -0.36], [0.46, 0], [0.76, 0.62], [0.76, -0.62]]) {
			put(bodyGroup, new THREE.SphereGeometry(0.06, 6, 6), darkMat, [0.40, y, z]);
			put(bodyGroup, new THREE.SphereGeometry(0.06, 6, 6), darkMat, [-0.40, y, z]);
		}
		return { seatOffsetY: 0.94, extra: { waddleAmp: 0.08 } };
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
		const hull = spkmodVehMat(THREE, 0x78350f), sail = spkmodVehMat(THREE, 0xf8fafc), wave = spkmodVehMat(THREE, 0x38bdf8, { transparent: true, opacity: 0.55, side: THREE.DoubleSide });
		put(bodyGroup, new THREE.BoxGeometry(1.36, 0.68, 2.55), hull, [0, 0.44, 0]);
		put(bodyGroup, new THREE.ConeGeometry(0.84, 0.96, 4), hull, [0, 0.44, 1.72], [Math.PI / 2, Math.PI / 4, 0]);
		put(bodyGroup, new THREE.CylinderGeometry(0.06, 0.08, 2.45, 10), hull, [0, 1.84, -0.10]);
		put(bodyGroup, new THREE.BoxGeometry(1.52, 1.18, 0.08), sail, [0, 1.98, 0.08]);
		put(bodyGroup, new THREE.BoxGeometry(0.46, 0.30, 0.04), darkMat, [0, 2.94, -0.10]);
		const wRing = put(bodyGroup, new THREE.RingGeometry(1.15, 1.68, 22), wave, [0, 0.06, 0], [Math.PI / 2, 0, 0]);
		animParts.push({ type: "pulseScale", node: wRing, speed: 3.8, amp: 0.10 });
		return { seatOffsetY: 0.92, hoverY: 0.16, hoverAmp: 0.09 };
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
	return null;
}

async function spkmodCreateVehicleModelInstance(vehicle, colorIdx) {
	if (!vehicle) return null;
	const THREE = window.THREE;
	if (!THREE) return null;
	const safeColorIdx = spkmodClampVehicleColorIdx(colorIdx);
	const colorHex = SPKMOD_VEHICLE_COLORS[safeColorIdx].hex;
	const spec = vehicle.spec || {};

	// 1. Authentic Burger Shop Sedan / Van GLB
	if (spec.kind === "burger_glb") {
		if (typeof spkmodLoadBurgerVehiclesScene !== "function" || typeof spkmodCreateBurgerCarInstance !== "function") return null;
		const scene = await spkmodLoadBurgerVehiclesScene();
		if (!scene) return null;
		const inst = spkmodCreateBurgerCarInstance(scene, spec.modelName, colorHex);
		if (!inst) return null;
		const root = new THREE.Group();
		root.add(inst.carObj);
		return {
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
	if (spec.kind === "glb") {
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
				node.frustumCulled = false;
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

		return {
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
	if (spec.kind === "procedural") {
		return spkmodBuildProceduralVehicle(THREE, spec.builder, colorHex);
	}
	return null;
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

window.spkmodHasRemoteVehicle = function(ownerKey) {
	return _spkmodRemoteVehicleInstances.has(String(ownerKey));
};

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

function spkmodRestoreVehicleEntry(entry, isLocal) {
	if (!entry) return;
	if (entry.root && entry.root.parent) {
		entry.root.parent.remove(entry.root);
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
				const ctrl = typeof spkmodGetLocalAnimController === "function"
					? spkmodGetLocalAnimController()
					: (gameState.localAnimationController || gameState.localAvatar?.animationController || null);
				if (ctrl && typeof ctrl.exitMountPose === "function") {
					try { ctrl.exitMountPose(); } catch (_) {}
				}
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
					const ctrl = rp?.avatar?.animationController || rp?.container?.controller || entry.lastCtrl;
					if (ctrl && typeof ctrl.exitMountPose === "function") {
						try { ctrl.exitMountPose(); } catch (_) {}
					}
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
				gameState.playerContainer.remove(ch[i]);
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
		if (!spkmodIsVehiclesSystemEnabled() || !_spkmodLocalVehicleEntry || isTypingTarget(e.target)) return;
		if (e.code === "KeyF" || e.code === "KeyG") {
			e.preventDefault();
			e.stopImmediatePropagation();
			if (!e.repeat) {
				const isSecondary = e.code === "KeyG";
				spkmodPlayVehicleSfx(_spkmodLocalVehicleEntry.vehicle, isSecondary);
				if (_spkmodLocalVehicleEntry.alertSprite) {
					spkmodTriggerBoxAlert(_spkmodLocalVehicleEntry, isSecondary ? "?" : "!");
				}
			}
		}
	}, true);

	window.addEventListener("keyup", e => {
		if (!spkmodIsVehiclesSystemEnabled() || !_spkmodLocalVehicleEntry || isTypingTarget(e.target)) return;
		if (e.code === "KeyF" || e.code === "KeyG") {
			e.preventDefault();
			e.stopImmediatePropagation();
		}
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
	if (typeof window.spkmodResetCarsEveryone === "function") {
		window.spkmodResetCarsEveryone(true, false);
	}

	const mySeq = ++_spkmodLocalVehicleSeq;
	const safeColor = spkmodClampVehicleColorIdx(colorIdx);
	const built = await spkmodCreateVehicleModelInstance(vehicle, safeColor);
	if (!built || mySeq !== _spkmodLocalVehicleSeq || !spkmodIsVehiclesSystemEnabled()) return false;
	if (window.spkmodVehicleSettings.equippedId !== vehicle.id) return false;

	if (_spkmodLocalVehicleEntry) {
		spkmodRestoreVehicleEntry(_spkmodLocalVehicleEntry, true);
		_spkmodLocalVehicleEntry = null;
	}
	if (gameState.playerContainer.children) {
		for (let i = gameState.playerContainer.children.length - 1; i >= 0; i--) {
			if (gameState.playerContainer.children[i]?.name === "spkmod_local_vehicle") {
				gameState.playerContainer.remove(gameState.playerContainer.children[i]);
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
		walkPhase: 0,
		stealthLift: 0,
		alertStartMs: 0,
		alertUntilMs: 0
	}, built);

	spkmodTickVehicleEntry(_spkmodLocalVehicleEntry, true, gameState.playerContainer, gameState.myPlayerId, gameState.localAvatar?.root || null, gameState.localAvatarPose?.position || null, (typeof spkmodGetLocalAnimController === "function" ? spkmodGetLocalAnimController() : gameState.localAnimationController), 0.016, performance.now());
	spkmodStartVehiclesLoopIfEnabled();
	return true;
}

function spkmodTickVehicleEntry(entry, isLocal, container, playerId, avatarRoot, posePos, ctrl, dt, nowMs) {
	if (!entry || !container) return;
	if (entry.root.parent !== container) {
		container.add(entry.root);
	}
	if (typeof spkmodSetNativeCartVisible === "function") {
		spkmodSetNativeCartVisible(container, playerId, false);
	}

	// Calculate horizontal travel speed since last frame
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
	const isMoving = dist > 0.004;
	const tSec = nowMs * 0.001;

	// Spin wheels proportionally to ground distance covered
	if (dist > 0.0001 && entry.wheels && entry.wheels.length > 0) {
		const angle = dist / (entry.wheelRadius || 0.34);
		for (let i = 0; i < entry.wheels.length; i++) {
			entry.wheels[i].rotation.x += angle;
		}
	}

	// Hover / Bob / Rock / Chug motion
	let hoverDelta = 0;
	if (entry.hoverY > 0 || entry.hoverAmp > 0) {
		hoverDelta = Math.sin(tSec * 2.6) * (entry.hoverAmp || 0.08);
		entry.bodyGroup.position.y = (entry.hoverY || 0) + hoverDelta;
		entry.bodyGroup.rotation.x = isMoving ? 0.08 : Math.sin(tSec * 1.4) * 0.025;
	} else if (entry.waddleAmp) {
		if (isMoving) entry.walkPhase += dt * 11;
		entry.bodyGroup.rotation.z = isMoving ? Math.sin(entry.walkPhase) * entry.waddleAmp : Math.sin(tSec * 2.0) * 0.02;
		entry.bodyGroup.position.y = isMoving ? Math.abs(Math.sin(entry.walkPhase)) * 0.06 : 0;
	} else if (entry.rockAmp) {
		if (isMoving) entry.walkPhase += dt * 12;
		entry.bodyGroup.rotation.x = isMoving ? Math.sin(entry.walkPhase) * entry.rockAmp : Math.sin(tSec * 2.5) * 0.04;
	} else if (entry.chugAmp) {
		if (isMoving) entry.walkPhase += dt * 14;
		entry.bodyGroup.position.y = isMoving ? Math.abs(Math.sin(entry.walkPhase)) * entry.chugAmp : 0;
		entry.bodyGroup.rotation.z = isMoving ? Math.sin(entry.walkPhase * 0.5) * 0.035 : 0;
	} else if (entry.hopAmp && !entry.vehicle.hidePlayer) {
		if (isMoving) entry.walkPhase += dt * 9;
		hoverDelta = isMoving ? Math.abs(Math.sin(entry.walkPhase)) * entry.hopAmp : 0;
		entry.bodyGroup.position.y = hoverDelta;
		entry.bodyGroup.rotation.x = isMoving ? Math.cos(entry.walkPhase) * 0.10 : 0;
	}

	// Animated subparts (police siren lights, UFO disc, heli rotors, mech legs, spinning chairs/Roomba, trash lid)
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
				p.node.rotation.y += dt * (isMoving ? (p.speed || 5.0) : 0.45);
			} else if (p.type === "legWalk" && p.node) {
				if (isMoving) p.node.rotation.x = Math.sin(tSec * 10 + (p.side === 1 ? Math.PI : 0)) * 0.48;
				else p.node.rotation.x *= 0.82;
			} else if (p.type === "lidBounce" && p.node) {
				p.node.position.y = (p.baseY || 1.2) + (isMoving ? Math.abs(Math.sin(tSec * 12)) * 0.14 : 0);
				p.node.rotation.z = isMoving ? Math.sin(tSec * 12) * 0.16 : 0;
			} else if (p.type === "pulseScale" && p.node) {
				const s = 1 + Math.sin(tSec * (p.speed || 6)) * (p.amp || 0.12);
				p.node.scale.set(s, 1, s);
			} else if (p.type === "flamePulse" && p.node) {
				const s = (isMoving ? 1.15 : 0.72) + Math.sin(tSec * 22) * 0.25;
				p.node.scale.set(1, s, 1);
			}
		}
	}

	// Stealth MGS Cardboard Box mode vs normal mount vehicle
	if (entry.vehicle.hidePlayer) {
		if (avatarRoot) {
			if (entry.hiddenAvatarRoot && entry.hiddenAvatarRoot !== avatarRoot) {
				entry.hiddenAvatarRoot.visible = true;
			}
			entry.hiddenAvatarRoot = avatarRoot;
			if (avatarRoot.visible !== false) avatarRoot.visible = false;
		}
		if (posePos && posePos.y !== 0) posePos.set(0, 0, 0);
		if (ctrl && ctrl.mountSitPlaying && typeof ctrl.exitMountPose === "function") {
			try { ctrl.exitMountPose(); } catch (_) {}
		}

		const targetLift = isMoving ? 0.14 : 0;
		entry.stealthLift += (targetLift - entry.stealthLift) * Math.min(1, dt * 16);
		if (isMoving) entry.walkPhase += dt * 13;
		const hop = isMoving ? Math.abs(Math.sin(entry.walkPhase)) * (entry.hopAmp || 0.04) : 0;
		entry.bodyGroup.position.y = entry.stealthLift + hop;
		entry.bodyGroup.rotation.z = isMoving ? Math.sin(entry.walkPhase) * 0.075 : 0;
		entry.bodyGroup.rotation.x = isMoving ? Math.sin(entry.walkPhase * 2) * 0.03 : 0;

		const showFeet = entry.stealthLift > 0.02;
		if (entry.leftFoot && entry.rightFoot) {
			entry.leftFoot.visible = showFeet;
			entry.rightFoot.visible = showFeet;
			if (showFeet) {
				const stride = Math.sin(entry.walkPhase) * 0.16;
				entry.leftFoot.position.z = stride;
				entry.rightFoot.position.z = -stride;
				entry.leftFoot.position.y = 0.08 + Math.max(0, Math.cos(entry.walkPhase)) * 0.05;
				entry.rightFoot.position.y = 0.08 + Math.max(0, -Math.cos(entry.walkPhase)) * 0.05;
			}
		}

		if (entry.alertSprite) {
			if (entry.alertUntilMs > nowMs) {
				entry.alertSprite.visible = true;
				const elapsed = (nowMs - entry.alertStartMs) / 1000;
				const pop = elapsed < 0.14 ? (0.4 + (elapsed / 0.14) * 0.95) : (elapsed < 0.25 ? 1.35 - ((elapsed - 0.14) / 0.11) * 0.35 : 1.0);
				entry.alertSprite.scale.set(0.72 * pop, 0.72 * pop, 1);
				entry.alertSprite.position.y = 1.92 + Math.sin(elapsed * 12) * 0.05;
			} else if (entry.alertSprite.visible) {
				entry.alertSprite.visible = false;
			}
		}
	} else {
		if (entry.hiddenAvatarRoot) {
			entry.hiddenAvatarRoot.visible = true;
			entry.hiddenAvatarRoot = null;
		}
		if (posePos) {
			posePos.set(0, (entry.seatOffsetY || 0) + hoverDelta, 0);
		}
		if (entry.vehicle.pose === "sit") {
			if (ctrl && !ctrl.mountSitPlaying && typeof ctrl.enterMountPose === "function") {
				try { ctrl.enterMountPose("sit"); } catch (_) {}
			}
		} else if (entry.vehicle.pose === "stand") {
			if (ctrl && ctrl.mountSitPlaying && typeof ctrl.exitMountPose === "function") {
				try { ctrl.exitMountPose(); } catch (_) {}
			}
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
	if (!built || !spkmodIsVehiclesSystemEnabled() || _spkmodRemoteVehicleSeq.get(ownerKey) !== mySeq) return;

	const live = spkmodResolveRemotePlayerForVehicle(state.playerId, state.playerName);
	if (!live || !live.rp || !live.rp.container) return;

	const prev = _spkmodRemoteVehicleInstances.get(ownerKey);
	if (prev) {
		spkmodRestoreVehicleEntry(prev, false);
		_spkmodRemoteVehicleInstances.delete(ownerKey);
	}
	if (Array.isArray(live.rp.container.children)) {
		for (let i = live.rp.container.children.length - 1; i >= 0; i--) {
			const ch = live.rp.container.children[i];
			if (ch && typeof ch.name === "string" && (ch.name.startsWith("spkmod_remote_vehicle_") || ch.name.startsWith("spkmod_remote_car_"))) {
				live.rp.container.remove(ch);
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
		lastRpKey: live.rpKey,
		lastContainer: live.rp.container,
		lastPosePos: live.rp.avatarPose?.position || live.rp.avatar?.root?.position || null,
		lastCtrl: live.rp.avatar?.animationController || live.rp.container?.controller || null,
		hiddenAvatarRoot: null,
		lastX: live.rp.container.position ? live.rp.container.position.x : 0,
		lastZ: live.rp.container.position ? live.rp.container.position.z : 0,
		walkPhase: 0,
		stealthLift: 0,
		alertStartMs: 0,
		alertUntilMs: 0
	}, built);

	_spkmodRemoteVehicleInstances.set(ownerKey, entry);
	spkmodTickVehicleEntry(entry, false, live.rp.container, live.rpKey, live.rp.avatar?.root || null, entry.lastPosePos, entry.lastCtrl, 0.016, performance.now());
}

window.spkmodGetActiveCarBroadcastState = function() {
	const enabled = spkmodIsVehiclesSystemEnabled();
	const shareInChat = spkmodIsVehicleChatSharingEnabled();
	const eqId = enabled ? window.spkmodVehicleSettings.equippedId : null;
	const vehicle = eqId ? SPKMOD_VEHICLES_BY_ID.get(eqId) : null;
	const modeIdx = (vehicle && spkmodIsVehicleUnlocked(vehicle)) ? vehicle.code : 0;
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
	if (!spkmodIsVehicleChatSharingEnabled()) return;
	const rCount = (typeof spkmodGetRemotePlayerCount === "function")
		? spkmodGetRemotePlayerCount()
		: ((typeof gameState !== "undefined" && gameState?.remotePlayers?.remotePlayers?.size) || 0);
	if (window.spkmodVehicleSettings.equippedId && rCount === 0) {
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

		// 2. Tick active remote vehicles every frame
		if (_spkmodRemoteVehicleInstances.size > 0) {
			for (const [ownerKey, entry] of [..._spkmodRemoteVehicleInstances.entries()]) {
				const rp = entry.resolveRp ? entry.resolveRp() : null;
				if (!rp || !rp.container) {
					spkmodClearRemoteVehicleOwner(ownerKey);
					continue;
				}
				entry.lastContainer = rp.container;
				const posePos = rp.avatarPose?.position || rp.avatar?.root?.position || null;
				const ctrl = rp.avatar?.animationController || rp.container?.controller || null;
				entry.lastPosePos = posePos;
				entry.lastCtrl = ctrl;
				spkmodTickVehicleEntry(entry, false, rp.container, entry.lastRpKey ?? entry.playerId, rp.avatar?.root || null, posePos, ctrl, dt, nowMs);
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

			// Reconcile remote vehicles (level-checked + showRemote toggle)
			const showRemote = window.spkmodVehicleSettings.showRemoteVehicles !== false;
			const seenRemote = new Set();
			if (showRemote && rMap && _spkmodRemoteVehicleStates.size > 0) {
				for (const [ownerKey, st] of _spkmodRemoteVehicleStates) {
					const resolved = spkmodResolveRemotePlayerForVehicle(st.playerId, st.playerName);
					if (!resolved || !resolved.rp || !resolved.rp.container) continue;
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
			grid-column: 1 / -1; margin-top: 4px; padding: 12px 14px; border-radius: 10px;
			background: linear-gradient(90deg, rgba(245,158,11,0.16), rgba(14,165,233,0.16));
			border: 1px dashed rgba(250,204,21,0.45); text-align: center;
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
			spkmodPlayVehicleSfx(_spkmodLocalVehicleEntry.vehicle, false);
			if (_spkmodLocalVehicleEntry.alertSprite) spkmodTriggerBoxAlert(_spkmodLocalVehicleEntry, "!");
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
	const favCount = window.spkmodVehicleSettings.favorites ? window.spkmodVehicleSettings.favorites.size : 0;
	const tabs = [
		{ id: "all", label: `${spkmodGetVehicleUiText("tabAll")} (${SPKMOD_VEHICLE_CATALOG.length})` },
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
	const list = SPKMOD_VEHICLE_CATALOG.filter(v => {
		if (_spkmodVehicleFilterTab === "unlocked" && !spkmodIsVehicleUnlocked(v)) return false;
		if (_spkmodVehicleFilterTab === "favorites" && !spkmodIsVehicleFavorite(v.id)) return false;
		if (_spkmodVehicleFilterTab === "street" && v.category !== "street") return false;
		if (_spkmodVehicleFilterTab === "stealth" && v.category !== "stealth") return false;
		if (_spkmodVehicleFilterTab === "air" && v.category !== "air") return false;
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
		const unlocked = spkmodIsVehicleUnlocked(v);
		const isEq = eqId === v.id;
		const isFav = spkmodIsVehicleFavorite(v.id);
		const dispName = spkmodGetVehicleDisplayName(v);

		const card = document.createElement("div");
		card.className = "spkmod-veh-card" + (isEq ? " equipped" : "") + (!unlocked ? " locked" : "") + (v.milestone ? " milestone" : "");

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
		actionBtn.className = "spkmod-veh-btn" + (isEq ? " equipped" : (!unlocked ? " locked" : ""));
		if (!unlocked) {
			actionBtn.innerText = "🔒 " + spkmodGetVehicleUiText("btnLocked", v.level);
		} else if (isEq) {
			actionBtn.innerText = spkmodGetVehicleUiText("btnEquipped");
		} else {
			actionBtn.innerText = spkmodGetVehicleUiText(v.hidePlayer ? "btnEquipStealth" : "btnEquip");
		}
		actionBtn.onclick = () => {
			if (!unlocked) {
				if (typeof chatLog === "function") chatLog(spkmodGetVehicleUiText("lockedToast", v.level, dispName));
				return;
			}
			if (isEq) spkmodEquipLocalVehicle(null, true, false);
			else spkmodEquipLocalVehicle(v.id, true, false);
		};
		card.appendChild(actionBtn);
		grid.appendChild(card);
	}

	// Hype card if locked vehicles remain
	const lockedRemaining = SPKMOD_VEHICLE_CATALOG.filter(v => !spkmodIsVehicleUnlocked(v)).sort((a, b) => a.level - b.level);
	if (lockedRemaining.length > 0 && !q) {
		const hype = document.createElement("div");
		hype.className = "spkmod-veh-hype";
		hype.innerHTML = `<div style="font-weight:900; color:#fde047; font-size:12.5px;">✨ ${spkmodGetVehicleUiText("hypeTitle")}</div>`
			+ `<div style="font-size:11.5px; color:#e2e8f0; margin-top:3px;">${spkmodGetVehicleUiText("hypeDesc", lockedRemaining.length, lockedRemaining[0].level)}</div>`;
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
	honk: (secondary = false) => {
		if (_spkmodLocalVehicleEntry) {
			spkmodPlayVehicleSfx(_spkmodLocalVehicleEntry.vehicle, !!secondary);
			if (_spkmodLocalVehicleEntry.alertSprite) spkmodTriggerBoxAlert(_spkmodLocalVehicleEntry, secondary ? "?" : "!");
		}
	},
	toggleFavorite: (id) => {
		const next = spkmodToggleVehicleFavorite(id);
		spkmodRefreshVehiclesModalUI();
		return next;
	},
	getFavorites: () => [...(window.spkmodVehicleSettings.favorites || [])],
	unlockAll: (enable) => {
		const next = enable !== undefined ? !!enable : !window.spkmodVehicleSettings.unlockAllTest;
		window.spkmodVehicleSettings.unlockAllTest = next;
		if (window.localStorage) localStorage.setItem(SPKMOD_VEHICLE_STORAGE_KEYS.unlockAll, next ? "true" : "false");
		spkmodRefreshVehiclesModalUI();
		if (typeof chatLog === "function") {
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
