// ============================================================================
// IN-GAME 3D PET COMPANION SYSTEM & PET MANAGER (100 LEVELS PROGRESSION)
// ============================================================================

const SPKMOD_PET_STORAGE_KEYS = {
	enabled: "spkmod-pet-enabled",
	equipped: "spkmod-pet-equipped",
	mySfx: "spkmod-pet-my-sfx",
	otherSfx: "spkmod-pet-other-sfx",
	bubbles: "spkmod-pet-speech-bubbles",
	showRemote: "spkmod-pet-show-remote",
	shareInChat: "spkmod-pet-share-chat",
	unlockAll: "spkmod-pet-unlock-all-test"
};

window.spkmodPetSettings = {
	enabled: (typeof window !== "undefined" && window.localStorage)
		? localStorage.getItem(SPKMOD_PET_STORAGE_KEYS.enabled) !== "false"
		: (window.spkmodPetsSystemEnabled !== false),
	equippedId: (typeof window !== "undefined" && window.localStorage && localStorage.getItem(SPKMOD_PET_STORAGE_KEYS.equipped)) || null,
	mySfx: (typeof window !== "undefined" && window.localStorage) ? localStorage.getItem(SPKMOD_PET_STORAGE_KEYS.mySfx) !== "false" : true,
	otherSfx: (typeof window !== "undefined" && window.localStorage) ? localStorage.getItem(SPKMOD_PET_STORAGE_KEYS.otherSfx) !== "false" : true,
	speechBubbles: (typeof window !== "undefined" && window.localStorage) ? localStorage.getItem(SPKMOD_PET_STORAGE_KEYS.bubbles) !== "false" : true,
	showRemotePets: (typeof window !== "undefined" && window.localStorage) ? localStorage.getItem(SPKMOD_PET_STORAGE_KEYS.showRemote) !== "false" : true,
	shareInChat: (typeof window !== "undefined" && window.localStorage) ? localStorage.getItem(SPKMOD_PET_STORAGE_KEYS.shareInChat) !== "false" : true,
	unlockAllTest: (typeof window !== "undefined" && window.localStorage) ? localStorage.getItem(SPKMOD_PET_STORAGE_KEYS.unlockAll) === "true" : false
};
window.spkmodPetsSystemEnabled = window.spkmodPetSettings.enabled !== false;

function spkmodIsPetsSystemEnabled() {
	return window.spkmodPetSettings.enabled !== false && window.spkmodPetsSystemEnabled !== false;
}

function spkmodIsPetChatSharingEnabled() {
	return spkmodIsPetsSystemEnabled() && window.spkmodPetSettings.shareInChat !== false;
}

function spkmodGetPetsDisabledToastText() {
	if (typeof t === "function") {
		const msg = t("petsSystemDisabledToast");
		if (msg && msg !== "petsSystemDisabledToast") return msg;
	}
	return "🐾 Pets System is disabled. Enable it in Settings (under Cinema).";
}

function spkmodGetPetsEnabledToastText() {
	if (typeof t === "function") {
		const msg = t("petsSystemEnabledToast");
		if (msg && msg !== "petsSystemEnabledToast") return msg;
	}
	return "🐾 Pets System enabled.";
}

// ============================================================================
// 1. MULTI-LANGUAGE UI STRINGS & SPEECH BUBBLES (LOADED FROM translations.json)
//    - Localized strings live in translations.json under petUi, petSpeech, petNames
//    - Compact English-only fallbacks are used only until translations.json loads
// ============================================================================
const SPKMOD_PET_UI_FALLBACK_EN = {
	petsBtnTooltip: "Pet Manager (Alt+P)",
	petsModalTitle: "🐾 SpeakiMod+ Pet Companion Manager (100 Levels)",
	myLevelLabel: "Your Level",
	unlockedLabel: "Unlocked",
	equippedLabel: "Active Pet",
	noneEquipped: "None Equipped",
	btnEquip: "Equip",
	btnEquipped: "Equipped ✓",
	btnUnequip: "Unequip",
	btnLocked: "Locked (Lv.{0})",
	btnTalk: "💬 Talk",
	btnDance: "💃 Dance",
	btnResync: "📡 Sync Map",
	btnTestUnlock: "🔓 Test Unlock All",
	searchPlaceholder: "Search 100 pets by name, level, or minigame...",
	toggleMySfx: "🔊 My Pet Noises",
	toggleOtherSfx: "🔉 Others' Pet Noises",
	toggleBubbles: "💬 Pet Speech Bubbles",
	toggleRemotePets: "👁️ Show Others' Pets",
	toggleShareInChat: "📡 Share My Pet in Chat",
	shareInChatDisabledToast: "📡 Pet chat sharing is OFF. Enable 'Share My Pet in Chat' in Pet Manager to sync with others.",
	tabAll: "All",
	tabUnlocked: "Unlocked",
	tabTier1: "Lv 1-20 Snacks & Toys",
	tabTier2: "Lv 21-40 Minigames",
	tabTier3: "Lv 41-60 Fairies & Ghosts",
	tabTier4: "Lv 61-80 Beasts & Vehicles",
	tabTier5: "Lv 81-100 Bosses & Legends",
	modeBounce: "🟢 Bouncer",
	modeFly: "🕊️ Flyer",
	reqLevel: "Req. Lv.{0}",
	milestoneBadge: "★ MILESTONE",
	bonusRewardBadge: "★ LV.90 BONUS",
	nextUnlockBadge: "🔥 UPCOMING",
	hypeTitle: "Keep leveling up to unlock more!",
	hypeDesc: "{0} more mystery companions await you up to Lv.100! Reach Lv.{1} to reveal the next pet!",
	equippedToast: "🐾 Equipped Pet: {0} (Lv.{1})!",
	unequippedToast: "🐾 Pet unequipped.",
	lockedToast: "🔒 Requires Level {0} to equip {1}!",
	previewSoundTooltip: "Preview Pet Sound",
	broadcastToast: "📡 Broadcasted active pet to nearby mod players!",
	unknownPetToast: "❌ Unknown pet: {0}",
	equipFirstToast: "🐾 Equip a pet first!",
	testUnlockEnabledToast: "🔓 [Pet Test] All 100 pets UNLOCKED for testing!",
	testUnlockDisabledToast: "🔒 [Pet Test] Normal level requirements restored.",
	randomPetsSpawnedToast: "🐾 Spawned random test pets on {0} nearby player(s)!",
	showcaseSpawnedToast: "🐾 Spawned {0} showcase pets around you! Call spkmodPets.clearShowcase() to remove."
};

const SPKMOD_PET_SPEECH_FALLBACK_EN = {
	fixed: [
		"Boing boing! Where are we going next?",
		"Joayo~! You're the best partner ever!",
		"Spea~ Spea~! Joayo~!"
	],
	prefixes: ["Boing~!", "Joayo!", "Spea~!"],
	cores: ["let's go explore the next map", "I'm having the best time following you"],
	suffixes: ["~ ♪", "!", "!! ✨"]
};

function spkmodGetActiveLang() {
	const raw = (typeof spkmodLang !== "undefined" && spkmodLang) ? spkmodLang : "en";
	if (typeof spkmodTranslations !== "undefined" && spkmodTranslations[raw]) return raw;
	if (raw === "zh") return "zh-CN";
	if (raw === "es") return "es-419";
	return raw || "en";
}

function spkmodGetPetUiText(key, ...args) {
	const lang = spkmodGetActiveLang();
	const tr = typeof spkmodTranslations !== "undefined" ? spkmodTranslations : null;
	let str = (tr && tr[lang] && tr[lang].petUi && tr[lang].petUi[key])
		|| (tr && tr.en && tr.en.petUi && tr.en.petUi[key])
		|| SPKMOD_PET_UI_FALLBACK_EN[key]
		|| key;
	args.forEach((a, i) => {
		str = str.split(`{${i}}`).join(a);
	});
	return str;
}
window.spkmodGetPetUiText = spkmodGetPetUiText;

function spkmodPickRandom(arr) {
	if (!Array.isArray(arr) || arr.length === 0) return "";
	return arr[Math.floor(Math.random() * arr.length)];
}

function spkmodGeneratePetSpeech(pet) {
	const lang = spkmodGetActiveLang();
	const tr = typeof spkmodTranslations !== "undefined" ? spkmodTranslations : null;
	const dict = (tr && tr[lang] && tr[lang].petSpeech)
		|| (tr && tr.en && tr.en.petSpeech)
		|| SPKMOD_PET_SPEECH_FALLBACK_EN;
	// 50% chance to use one of the hand-crafted fixed phrases,
	// 50% chance to dynamically mix Prefix + Core + Suffix so it feels organic and endless!
	if (Math.random() < 0.5 && Array.isArray(dict.fixed) && dict.fixed.length > 0) {
		return spkmodPickRandom(dict.fixed);
	}
	const prefix = spkmodPickRandom(dict.prefixes);
	const core = spkmodPickRandom(dict.cores);
	const suffix = spkmodPickRandom(dict.suffixes);
	const sep = (lang === "ja" || lang === "zh-CN" || lang === "zh-TW") ? "" : " ";
	return `${prefix}${sep}${core}${suffix}`;
}
window.spkmodGeneratePetSpeech = spkmodGeneratePetSpeech;

// ============================================================================
// 3. SOUND EFFECTS CATALOG BY PET VOICE TYPE
// ============================================================================
const SPKMOD_PET_SFX_POOLS = {
	food: [
		"/audio/sfx/burger_shop/trayPlace.mp3",
		"/audio/sfx/burger_shop/counterBell.mp3",
		"/audio/voice/speaki/shortJoayo.mp3",
		"/audio/sfx/reward.mp3"
	],
	slime: [
		"/audio/voice/speaki/spea.mp3",
		"/audio/voice/speaki/shortJoayo.mp3",
		"/audio/sfx/jumpTakeoff.mp3",
		"/audio/sfx/snowball_run/hitPoof.mp3"
	],
	fairy: [
		"/audio/voice/speaki/touched.mp3",
		"/audio/voice/speaki/Joayo1.mp3",
		"/audio/sfx/questClaim.mp3",
		"/audio/sfx/reward.mp3"
	],
	ghost: [
		"/audio/voice/speaki/surprised.mp3",
		"/audio/voice/speaki/LowSpea.mp3",
		"/audio/sfx/portal.mp3"
	],
	beast: [
		"/audio/sfx/raid6/r6_piglet.mp3",
		"/audio/sfx/raid6/r6_sniff.mp3",
		"/audio/sfx/jumpTakeoff.mp3"
	],
	piglet: [
		"/audio/sfx/raid6/r6_piglet.mp3",
		"/audio/sfx/raid6/r6_snort.mp3",
		"/audio/sfx/raid6/r6_sniff.mp3"
	],
	vehicle: [
		"/audio/sfx/burger_shop/carHorn.mp3",
		"/audio/sfx/burger_shop/carHornDouble.mp3",
		"/audio/sfx/racing/boost.mp3",
		"/audio/sfx/mountEnter.mp3"
	],
	drone: [
		"/audio/sfx/droneFire1.mp3",
		"/audio/sfx/droneFire2.mp3",
		"/audio/sfx/mining/switchToggle.mp3"
	],
	boss: [
		"/audio/sfx/raid7/r7_core_pulse.mp3",
		"/audio/sfx/raid6/r6_roar.mp3",
		"/audio/sfx/raid8/r8_rune_bolt.mp3",
		"/audio/sfx/levelup.mp3"
	],
	npc: [
		"/audio/voice/speaki/Joayo2.mp3",
		"/audio/voice/speaki/Joayo3.mp3",
		"/audio/voice/speaki/Yes.mp3",
		"/audio/voice/speaki/spea.mp3"
	]
};

// ============================================================================
// 4. MASTER 100-PET PROGRESSION CATALOG (LEVELS 1 TO 100)
// ============================================================================
const SPKMOD_PET_CATALOG = [
	// --- TIER 1: LV 1-20 (KITCHEN SNACKS, BURGER SHOP & TOWN TOYS) ---
	{ level: 1, id: "onigiri", icon: "🍙", moveMode: "bounce", voiceType: "food", targetHeight: 0.48, defaultName: "Rice Ball (Onigiri)", source: "Lunch Kitchen", spec: { kind: "glb", url: "/models/lunch_kitchen/lunch-kitchen-food.glb", nodeName: "Rice_Prepped" } },
	{ level: 2, id: "fries", icon: "🍟", moveMode: "bounce", voiceType: "food", targetHeight: 0.50, defaultName: "Crispy French Fries", source: "Burger Shop", spec: { kind: "glb", url: "/models/burger_shop/burger-shop-food.glb", nodeName: "Potato_Cooked" } },
	{ level: 3, id: "soda_cup", icon: "🥤", moveMode: "bounce", voiceType: "food", targetHeight: 0.52, defaultName: "Fizzy Soda Cup", source: "Burger Shop", spec: { kind: "glb", url: "/models/burger_shop/burger-shop-food.glb", nodeName: "Drink_Prepped" } },
	{ level: 4, id: "takeout_bag", icon: "🛍️", moveMode: "bounce", voiceType: "food", targetHeight: 0.54, defaultName: "Happy Takeout Bag", source: "Burger Shop", spec: { kind: "glb", url: "/models/burger_shop/burger-shop-speaking-kit.glb", nodeName: "Item_Bag" } },
	{ level: 5, id: "burger_basic", icon: "🍔", moveMode: "bounce", voiceType: "food", targetHeight: 0.55, defaultName: "Classic Cheeseburger", source: "Burger Shop", spec: { kind: "glb", url: "/models/burger_shop/burger-shop-food.glb", nodeName: "Burger_Basic" } },
	{ level: 6, id: "grilled_meat", icon: "🍖", moveMode: "bounce", voiceType: "food", targetHeight: 0.50, defaultName: "Sizzling Grilled Meat", source: "Lunch Kitchen", spec: { kind: "glb", url: "/models/lunch_kitchen/lunch-kitchen-food.glb", nodeName: "Meat_Cooked" } },
	{ level: 7, id: "hot_soup", icon: "🍲", moveMode: "bounce", voiceType: "food", targetHeight: 0.52, defaultName: "Steaming Soup Bowl", source: "Lunch Kitchen", spec: { kind: "glb", url: "/models/lunch_kitchen/lunch-kitchen-food.glb", nodeName: "Soup_Cooked" } },
	{ level: 8, id: "sweet_dessert", icon: "🍮", moveMode: "bounce", voiceType: "food", targetHeight: 0.50, defaultName: "Kitchen Pudding Dessert", source: "Lunch Kitchen", spec: { kind: "glb", url: "/models/lunch_kitchen/lunch-kitchen-food.glb", nodeName: "Dessert_Prepped" } },
	{ level: 9, id: "burnt_dish", icon: "炭", moveMode: "bounce", voiceType: "food", targetHeight: 0.50, defaultName: "Mystery Burnt Dish", source: "Lunch Kitchen", spec: { kind: "glb", url: "/models/lunch_kitchen/lunch-kitchen-food.glb", nodeName: "Burnt" } },
	{ level: 10, id: "burger_deluxe", icon: "👑", moveMode: "bounce", voiceType: "food", targetHeight: 0.62, defaultName: "Double Deluxe Burger", source: "Burger Shop", spec: { kind: "glb", url: "/models/burger_shop/burger-shop-food.glb", nodeName: "Burger_Deluxe" } },
	{ level: 11, id: "chef_ladle", icon: "🥄", moveMode: "fly", voiceType: "food", targetHeight: 0.55, defaultName: "Enchanted Soup Ladle", source: "Lunch Kitchen", spec: { kind: "procedural", builder: "ladle" } },
	{ level: 12, id: "chef_knife", icon: "🔪", moveMode: "fly", voiceType: "food", targetHeight: 0.55, defaultName: "Flying Chef Cleaver", source: "Lunch Kitchen", spec: { kind: "procedural", builder: "knife" } },
	{ level: 13, id: "chef_pan", icon: "🍳", moveMode: "fly", voiceType: "food", targetHeight: 0.55, defaultName: "Sizzling Skillet", source: "Lunch Kitchen", spec: { kind: "procedural", builder: "pan" } },
	{ level: 14, id: "chef_tray", icon: "🍱", moveMode: "fly", voiceType: "food", targetHeight: 0.55, defaultName: "Floating Feast Tray", source: "Lunch Kitchen", spec: { kind: "procedural", builder: "tray" } },
	{ level: 15, id: "soccer_ball", icon: "⚽", moveMode: "bounce", voiceType: "slime", targetHeight: 0.55, defaultName: "Town Soccer Ball", source: "Town Soccer", spec: { kind: "procedural", builder: "soccerBall" } },
	{ level: 16, id: "snowball_pet", icon: "⚪", moveMode: "bounce", voiceType: "slime", targetHeight: 0.52, defaultName: "Rolling Snowball", source: "Snowball Run", spec: { kind: "glb", url: "/models/snowball_run/snowball.glb" } },
	{ level: 17, id: "mandarin_pet", icon: "🍊", moveMode: "bounce", voiceType: "food", targetHeight: 0.46, defaultName: "Winter Mandarin Orange", source: "Snowman", spec: { kind: "glb", url: "/models/snowman/prop-mandarin.glb" } },
	{ level: 18, id: "pinecone_pet", icon: "🌰", moveMode: "bounce", voiceType: "slime", targetHeight: 0.48, defaultName: "Forest Pinecone", source: "Snowman", spec: { kind: "glb", url: "/models/snowman/prop-pinecone.glb" } },
	{ level: 19, id: "hand_lantern", icon: "🏮", moveMode: "fly", voiceType: "fairy", targetHeight: 0.56, defaultName: "Floating Hand Lantern", source: "Snowman", spec: { kind: "glb", url: "/models/snowman/prop-hand-lantern.glb" } },
	{ level: 20, id: "spring_rider", icon: "🎠", moveMode: "bounce", voiceType: "slime", targetHeight: 0.68, defaultName: "Playground Spring Rider", source: "Town Playground", spec: { kind: "glb", url: "/models/playground/playground-spring-rider.glb" } },

	// --- TIER 2: LV 21-40 (MINIGAME CRATES, WINTER/HALLOWEEN & NURULING BUSTERS) ---
	{ level: 21, id: "gift_box", icon: "🎁", moveMode: "bounce", voiceType: "fairy", targetHeight: 0.56, defaultName: "Festive Gift Box", source: "Winter Town", spec: { kind: "glb", url: "/models/winter-town/gift-cube-a.glb" } },
	{ level: 22, id: "holiday_bell", icon: "🔔", moveMode: "fly", voiceType: "fairy", targetHeight: 0.55, defaultName: "Jingle Golden Bell", source: "Winter Town", spec: { kind: "glb", url: "/models/winter-town/bell.glb" } },
	{ level: 23, id: "winter_star", icon: "⭐", moveMode: "fly", voiceType: "fairy", targetHeight: 0.58, defaultName: "Shining Tree Star", source: "Winter Town", spec: { kind: "glb", url: "/models/winter-town/star.glb" } },
	{ level: 24, id: "snow_buff_box", icon: "🟩", moveMode: "fly", voiceType: "drone", targetHeight: 0.58, defaultName: "Emerald Buff Crate", source: "Snowball Run", spec: { kind: "glb", url: "/models/snowball_run/buff_box.glb" } },
	{ level: 25, id: "custom_snowman", icon: "⛄", moveMode: "bounce", voiceType: "slime", targetHeight: 0.75, defaultName: "Chibi Holiday Snowman", source: "Winter Snowman", spec: { kind: "procedural", builder: "snowman" } },
	{ level: 26, id: "snow_weapon_box", icon: "🟧", moveMode: "fly", voiceType: "drone", targetHeight: 0.58, defaultName: "Tactical Supply Box", source: "Snowball Run", spec: { kind: "glb", url: "/models/snowball_run/weapon_box.glb" } },
	{ level: 27, id: "core_ore_rock", icon: "💎", moveMode: "bounce", voiceType: "drone", targetHeight: 0.62, defaultName: "Pulsing Golden Core Ore", source: "Snowball Run", spec: { kind: "glb", url: "/models/snowball_run/hard_rock.glb", tintHex: 0xffd54a } },
	{ level: 28, id: "pumpkin_classic", icon: "🎃", moveMode: "bounce", voiceType: "slime", targetHeight: 0.56, defaultName: "Bouncing Patch Pumpkin", source: "Pumpkin Patch", spec: { kind: "procedural", builder: "pumpkin", variant: 0 } },
	{ level: 29, id: "pumpkin_neon", icon: "🟢", moveMode: "bounce", voiceType: "slime", targetHeight: 0.58, defaultName: "Neon Dodge Pumpkin", source: "Fake Pumpkin Dodge", spec: { kind: "procedural", builder: "pumpkin", variant: 1 } },
	{ level: 30, id: "pumpkin_copter", icon: "🚁", moveMode: "fly", voiceType: "drone", targetHeight: 0.58, defaultName: "Propeller Pumpkin Copter", source: "Revive Copter", spec: { kind: "glb", url: "/models/accessories/revive_pumpkin_copter.glb" } },
	{ level: 31, id: "nuruling_1", icon: "🌱", moveMode: "bounce", voiceType: "slime", targetHeight: 0.55, defaultName: "Sprout NuruLing (Tier 1)", source: "NuruLing Busters", spec: { kind: "procedural", builder: "nuruling", tier: 1 } },
	{ level: 32, id: "nuruling_2", icon: "🟠", moveMode: "bounce", voiceType: "slime", targetHeight: 0.58, defaultName: "Amber NuruLing (Tier 2)", source: "NuruLing Busters", spec: { kind: "procedural", builder: "nuruling", tier: 2 } },
	{ level: 33, id: "nuruling_3", icon: "🟣", moveMode: "bounce", voiceType: "slime", targetHeight: 0.64, defaultName: "Horned NuruLing (Tier 3)", source: "NuruLing Busters", spec: { kind: "procedural", builder: "nuruling", tier: 3 } },
	{ level: 34, id: "nuruling_4", icon: "🔵", moveMode: "bounce", voiceType: "slime", targetHeight: 0.70, defaultName: "Royal Boss NuruLing (Tier 4)", source: "NuruLing Sweep", spec: { kind: "procedural", builder: "nuruling", tier: 4 } },
	{ level: 35, id: "nuruling_drone", icon: "🚀", moveMode: "fly", voiceType: "drone", targetHeight: 0.50, defaultName: "Homing NuruLing Torpedo", source: "Pumpkin Racing", spec: { kind: "procedural", builder: "nurulingDrone" } },
	{ level: 36, id: "hw_bat", icon: "🦇", moveMode: "fly", voiceType: "ghost", targetHeight: 0.52, defaultName: "Halloween Vampire Bat", source: "Halloween Town", spec: { kind: "glb", url: "/models/halloween-town/bat.glb" } },
	{ level: 37, id: "hw_coffin", icon: "⚰️", moveMode: "bounce", voiceType: "ghost", targetHeight: 0.66, defaultName: "Hopping Spooky Coffin", source: "Halloween Town", spec: { kind: "glb", url: "/models/halloween-town/coffin.glb" } },
	{ level: 38, id: "hw_pumpkin_tree", icon: "🌳", moveMode: "bounce", voiceType: "ghost", targetHeight: 0.75, defaultName: "Haunted Pumpkin Tree", source: "Halloween Town", spec: { kind: "glb", url: "/models/halloween-town/tree-pumpkin.glb" } },
	{ level: 39, id: "hw_zombie", icon: "🧟", moveMode: "bounce", voiceType: "ghost", targetHeight: 0.72, defaultName: "Chibi Halloween Zombie", source: "Halloween Town", spec: { kind: "glb", url: "/models/halloween-town/zombie.glb" } },
	{ level: 40, id: "hw_dracula", icon: "🧛", moveMode: "fly", voiceType: "ghost", targetHeight: 0.76, defaultName: "Count Chibi Dracula", source: "Halloween Town", spec: { kind: "glb", url: "/models/halloween-town/dracula.glb" } },

	// --- TIER 3: LV 41-60 (ELEMENTAL FAIRIES, FROGS, WISPS & GHOST VILLAGE ODDITIES) ---
	{ level: 41, id: "mon_1001", icon: "🧚", moveMode: "fly", voiceType: "fairy", targetHeight: 0.55, monsterId: 1001, defaultName: "Forest Fairy", source: "Sunbreeze Forest", spec: { kind: "monster", monsterId: 1001 } },
	{ level: 42, id: "mon_1002", icon: "🌿", moveMode: "fly", voiceType: "fairy", targetHeight: 0.60, monsterId: 1002, defaultName: "Sprout Fairy", source: "Sunbreeze Forest", spec: { kind: "monster", monsterId: 1002 } },
	{ level: 43, id: "mon_1012", icon: "💧", moveMode: "fly", voiceType: "fairy", targetHeight: 0.55, monsterId: 1012, defaultName: "Dew Fairy", source: "Sunbreeze Forest", spec: { kind: "monster", monsterId: 1012 } },
	{ level: 44, id: "mon_1013", icon: "🌻", moveMode: "fly", voiceType: "fairy", targetHeight: 0.60, monsterId: 1013, defaultName: "Sunbloom Fairy", source: "Sunbreeze Forest", spec: { kind: "monster", monsterId: 1013 } },
	{ level: 45, id: "mon_1006", icon: "🐸", moveMode: "bounce", voiceType: "slime", targetHeight: 0.58, monsterId: 1006, defaultName: "Marsh Toad Familiar", source: "Witch Marsh", spec: { kind: "monster", monsterId: 1006 } },
	{ level: 46, id: "mon_1017", icon: "🍀", moveMode: "bounce", voiceType: "slime", targetHeight: 0.58, monsterId: 1017, defaultName: "Mossback Toad", source: "Witch Marsh", spec: { kind: "monster", monsterId: 1017 } },
	{ level: 47, id: "mon_1008", icon: "✨", moveMode: "fly", voiceType: "ghost", targetHeight: 0.55, monsterId: 1008, defaultName: "Moonlight Will-o'-the-Wisp", source: "Witch Marsh", spec: { kind: "monster", monsterId: 1008 } },
	{ level: 48, id: "mon_1024", icon: "🔥", moveMode: "fly", voiceType: "ghost", targetHeight: 0.55, monsterId: 1024, defaultName: "Ember Will-o'-the-Wisp", source: "Ember Ridge", spec: { kind: "monster", monsterId: 1024 } },
	{ level: 49, id: "mon_1031", icon: "❄️", moveMode: "fly", voiceType: "ghost", targetHeight: 0.55, monsterId: 1031, defaultName: "Frost Will-o'-the-Wisp", source: "Frostfield", spec: { kind: "monster", monsterId: 1031 } },
	{ level: 50, id: "mon_1029", icon: "❄️", moveMode: "fly", voiceType: "fairy", targetHeight: 0.62, monsterId: 1029, defaultName: "Snowflower Fairy", source: "Frostfield", spec: { kind: "monster", monsterId: 1029 } },
	{ level: 51, id: "mon_1301", icon: "🏮", moveMode: "fly", voiceType: "ghost", targetHeight: 0.64, monsterId: 1301, defaultName: "Prank Lantern", source: "Ghost Village", spec: { kind: "monster", monsterId: 1301 } },
	{ level: 52, id: "mon_1302", icon: "✉️", moveMode: "fly", voiceType: "ghost", targetHeight: 0.66, monsterId: 1302, defaultName: "Mail Ghost", source: "Ghost Village", spec: { kind: "monster", monsterId: 1302 } },
	{ level: 53, id: "mon_1303", icon: "💧", moveMode: "bounce", voiceType: "slime", targetHeight: 0.60, monsterId: 1303, defaultName: "Puddle Jelly", source: "Ghost Village", spec: { kind: "monster", monsterId: 1303 } },
	{ level: 54, id: "mon_1305", icon: "🦇", moveMode: "fly", voiceType: "ghost", targetHeight: 0.64, monsterId: 1305, defaultName: "Paper Lantern Bat", source: "Ghost Village", spec: { kind: "monster", monsterId: 1305 } },
	{ level: 55, id: "mon_1306", icon: "🐦‍⬛", moveMode: "fly", voiceType: "ghost", targetHeight: 0.65, monsterId: 1306, defaultName: "Straw Hat Crow", source: "Ghost Village", spec: { kind: "monster", monsterId: 1306 } },
	{ level: 56, id: "mon_1309", icon: "☂️", moveMode: "fly", voiceType: "ghost", targetHeight: 0.70, monsterId: 1309, defaultName: "Umbrella Ghost", source: "Ghost Village", spec: { kind: "monster", monsterId: 1309 } },
	{ level: 57, id: "mon_1310", icon: "🐸", moveMode: "bounce", voiceType: "slime", targetHeight: 0.62, monsterId: 1310, defaultName: "Crybaby Toad", source: "Ghost Village", spec: { kind: "monster", monsterId: 1310 } },
	{ level: 58, id: "mon_1316", icon: "📷", moveMode: "fly", voiceType: "drone", targetHeight: 0.64, monsterId: 1316, defaultName: "Prank Camera", source: "Ghost Village", spec: { kind: "monster", monsterId: 1316 } },
	{ level: 59, id: "mon_1322", icon: "🎭", moveMode: "fly", voiceType: "ghost", targetHeight: 0.66, monsterId: 1322, defaultName: "Mask Ghost", source: "Ghost Village", spec: { kind: "monster", monsterId: 1322 } },
	{ level: 60, id: "mon_1329", icon: "🐱", moveMode: "bounce", voiceType: "beast", targetHeight: 0.64, monsterId: 1329, defaultName: "Rooftop Cat", source: "Ghost Village", spec: { kind: "monster", monsterId: 1329 } },

	// --- TIER 4: LV 61-80 (CRITTERS, BEASTS, RAID 6 PIGLET, RC VEHICLES & DRONES) ---
	{ level: 61, id: "mon_1334", icon: "🐦", moveMode: "fly", voiceType: "fairy", targetHeight: 0.60, monsterId: 1334, defaultName: "Rooftop Pigeon", source: "Ghost Village", spec: { kind: "monster", monsterId: 1334 } },
	{ level: 62, id: "mon_1336", icon: "🌕", moveMode: "bounce", voiceType: "slime", targetHeight: 0.62, monsterId: 1336, defaultName: "Full-Moon Jelly", source: "Ghost Village", spec: { kind: "monster", monsterId: 1336 } },
	{ level: 63, id: "mon_1337", icon: "🌟", moveMode: "bounce", voiceType: "ghost", targetHeight: 0.66, monsterId: 1337, defaultName: "Starlight Goblin", source: "Ghost Village", spec: { kind: "monster", monsterId: 1337 } },
	{ level: 64, id: "mon_1338", icon: "🐑", moveMode: "bounce", voiceType: "beast", targetHeight: 0.66, monsterId: 1338, defaultName: "Fluffy Mist Sheep", source: "Ghost Village", spec: { kind: "monster", monsterId: 1338 } },
	{ level: 65, id: "mon_1340", icon: "🕊️", moveMode: "fly", voiceType: "fairy", targetHeight: 0.68, monsterId: 1340, defaultName: "Lantern Bird", source: "Ghost Village", spec: { kind: "monster", monsterId: 1340 } },
	{ level: 66, id: "mon_1207", icon: "🐈", moveMode: "bounce", voiceType: "beast", targetHeight: 0.64, monsterId: 1207, defaultName: "Grass Lynx", source: "Beastfolk Plains", spec: { kind: "monster", monsterId: 1207 } },
	{ level: 67, id: "mon_1212", icon: "🦡", moveMode: "bounce", voiceType: "beast", targetHeight: 0.62, monsterId: 1212, defaultName: "Bristlefur Badger", source: "Beastfolk Plains", spec: { kind: "monster", monsterId: 1212 } },
	{ level: 68, id: "mon_1215", icon: "🐆", moveMode: "bounce", voiceType: "beast", targetHeight: 0.66, monsterId: 1215, defaultName: "Shadow Panther", source: "Beastfolk Plains", spec: { kind: "monster", monsterId: 1215 } },
	{ level: 69, id: "mon_1105", icon: "🐺", moveMode: "bounce", voiceType: "beast", targetHeight: 0.68, monsterId: 1105, defaultName: "Twilight Wolfkin", source: "Monatium Outskirts", spec: { kind: "monster", monsterId: 1105 } },
	{ level: 70, id: "raid6_piglet", icon: "🐷", moveMode: "bounce", voiceType: "piglet", targetHeight: 0.62, defaultName: "Baby Tusk Piglet", source: "Raid 6 (Old Forest)", spec: { kind: "monster", monsterId: 1245, scale: 0.85, fallbackGlbUrl: "/models/raids/raid6/boar-calf-1245-v01.glb" } },
	{ level: 71, id: "burger_sedan", icon: "🚗", moveMode: "bounce", voiceType: "vehicle", targetHeight: 0.56, defaultName: "Mini Burger Sedan RC", source: "Burger Shop", spec: { kind: "glb", url: "/models/burger_shop/burger-shop-vehicles.glb", nodeName: "Vehicle_Sedan", tintHex: 0x38bdf8 } },
	{ level: 72, id: "burger_van", icon: "🚐", moveMode: "bounce", voiceType: "vehicle", targetHeight: 0.64, defaultName: "Mini Delivery Van RC", source: "Burger Shop", spec: { kind: "glb", url: "/models/burger_shop/burger-shop-vehicles.glb", nodeName: "Vehicle_Van", tintHex: 0xfbbf24 } },
	{ level: 73, id: "mini_pumpkin_cart", icon: "🎃", moveMode: "bounce", voiceType: "vehicle", targetHeight: 0.60, defaultName: "Mini Pumpkin Carriage", source: "Mount Pet", spec: { kind: "procedural", builder: "pumpkinCart" } },
	{ level: 74, id: "mini_police_car", icon: "🚓", moveMode: "bounce", voiceType: "vehicle", targetHeight: 0.60, defaultName: "Chibi Police Cruiser", source: "Mount Pet", spec: { kind: "procedural", builder: "policeCar" } },
	{ level: 75, id: "racer_rocket_kart", icon: "🏎️", moveMode: "bounce", voiceType: "vehicle", targetHeight: 0.64, defaultName: "Mini Rocket Kart", source: "Pumpkin Racing", spec: { kind: "glb", url: "/models/racing/racer_rocket.glb" } },
	{ level: 76, id: "mon_1107", icon: "🛸", moveMode: "fly", voiceType: "drone", targetHeight: 0.58, monsterId: 1107, defaultName: "Monatium Scout Drone", source: "Monatium Field", spec: { kind: "monster", monsterId: 1107 } },
	{ level: 77, id: "mon_1113", icon: "🤖", moveMode: "bounce", voiceType: "drone", targetHeight: 0.62, monsterId: 1113, defaultName: "Welding Spark Impbot", source: "Monatium Factory", spec: { kind: "monster", monsterId: 1113 } },
	{ level: 78, id: "mon_1128", icon: "🕷️", moveMode: "bounce", voiceType: "drone", targetHeight: 0.58, monsterId: 1128, defaultName: "Coil Spiderbot", source: "Monatium Factory", spec: { kind: "monster", monsterId: 1128 } },
	{ level: 79, id: "mon_1133", icon: "🫠", moveMode: "bounce", voiceType: "slime", targetHeight: 0.62, monsterId: 1133, defaultName: "Molten Slimecore", source: "Monatium Core", spec: { kind: "monster", monsterId: 1133 } },
	{ level: 80, id: "mon_1134", icon: "👁️", moveMode: "fly", voiceType: "drone", targetHeight: 0.62, monsterId: 1134, defaultName: "Watcher Eye Lens", source: "Monatium Core", spec: { kind: "monster", monsterId: 1134 } },

	// --- TIER 5: LV 81-100 (SPEAKOV, TRAINS, DRAGONS, RAID BOSSES, CHIBI NPCS & BATTLECRUISER) ---
	{ level: 81, id: "speakov_rifle", icon: "🔫", moveMode: "fly", voiceType: "drone", targetHeight: 0.55, defaultName: "Floating Tactical Rifle", source: "Speakov", spec: { kind: "glb", url: "/models/speakov/weapon-rifle.glb" } },
	{ level: 82, id: "speakov_raider", icon: "🪖", moveMode: "bounce", voiceType: "drone", targetHeight: 0.72, defaultName: "Mini Speakov Raider", source: "Speakov", spec: { kind: "glb", url: "/models/speakov/raider-assault.glb" } },
	{ level: 83, id: "speakov_commander", icon: "🎖️", moveMode: "bounce", voiceType: "drone", targetHeight: 0.75, defaultName: "Mini Raider Commander", source: "Speakov", spec: { kind: "glb", url: "/models/speakov/raider-commander.glb" } },
	{ level: 84, id: "mini_town_train", icon: "🚂", moveMode: "bounce", voiceType: "vehicle", targetHeight: 0.68, defaultName: "Mini Worldtree Train", source: "Town Train", spec: { kind: "glb", url: "/models/town-train/worldtree-town-train.glb" } },
	{ level: 85, id: "mini_santa_sleigh", icon: "🛷", moveMode: "fly", voiceType: "fairy", targetHeight: 0.68, defaultName: "Flying Santa Sleigh", source: "Winter Town", spec: { kind: "glb", url: "/models/winter-town/santa-sleigh-set.glb" } },
	{ level: 86, id: "mini_transport_drone", icon: "🚁", moveMode: "fly", voiceType: "drone", targetHeight: 0.72, defaultName: "Monatium Quadcopter Drone", source: "Mount Pet", spec: { kind: "procedural", builder: "transportDrone" } },
	{ level: 87, id: "raid8_crystal", icon: "🔮", moveMode: "fly", voiceType: "boss", targetHeight: 0.76, defaultName: "Floating Seal Crystal", source: "Raid 8 (Seal Dome)", spec: { kind: "glb", url: "/models/raids/raid8/seal-crystal-1341-v01.glb" } },
	{ level: 88, id: "mon_1091", icon: "🐲", moveMode: "fly", voiceType: "boss", targetHeight: 0.72, monsterId: 1091, defaultName: "Young Dragon", source: "Dragon Ridge", spec: { kind: "monster", monsterId: 1091 } },
	{ level: 89, id: "mon_1038", icon: "🔥", moveMode: "fly", voiceType: "boss", targetHeight: 0.74, monsterId: 1038, defaultName: "Ember Hatchling Dragon", source: "Ember Ridge", spec: { kind: "monster", monsterId: 1038 } },
	{ level: 90, id: "mecha_pumpkin", icon: "🎃", moveMode: "fly", voiceType: "drone", targetHeight: 0.72, defaultName: "Mecha Pumpkin Attack Drone", source: "Raid Companion", spec: { kind: "procedural", builder: "mechaPumpkin" } },
	{ level: 90, id: "chibi_kommy", isExtraReward: true, icon: "💤", moveMode: "bounce", voiceType: "npc", targetHeight: 0.78, defaultName: "Mini Sleepy Kommy", source: "Lv.90 Bonus NPC", spec: { kind: "character", charType: "kommy" } },
	{ level: 91, id: "mon_1130", icon: "⚡", moveMode: "fly", voiceType: "boss", targetHeight: 0.78, monsterId: 1130, defaultName: "Thundercloud Wyvern", source: "Thunder Pylon", spec: { kind: "monster", monsterId: 1130 } },
	{ level: 92, id: "mon_1093", icon: "🐉", moveMode: "fly", voiceType: "boss", targetHeight: 0.82, monsterId: 1093, defaultName: "Dragonscale Guardian", source: "Raid Boss", spec: { kind: "monster", monsterId: 1093 } },
	{ level: 93, id: "mon_1099", icon: "🌋", moveMode: "fly", voiceType: "boss", targetHeight: 0.85, monsterId: 1099, defaultName: "Ember Dragonscale Tyrant", source: "Raid Boss", spec: { kind: "monster", monsterId: 1099 } },
	{ level: 94, id: "mon_1100", icon: "👼", moveMode: "fly", voiceType: "boss", targetHeight: 0.86, monsterId: 1100, defaultName: "Dawnlight Seraph Guardian", source: "Dawn Sanctum", spec: { kind: "monster", monsterId: 1100 } },
	{ level: 95, id: "raid6_tusklord", icon: "🐗", moveMode: "bounce", voiceType: "boss", targetHeight: 0.82, defaultName: "Mini Tusk Lord Overlord", source: "Raid 6 Boss", spec: { kind: "glb", url: "/models/raids/raid6/tusklord-1299-v01.glb" } },
	{ level: 96, id: "raid8_sealmage", icon: "🧙", moveMode: "fly", voiceType: "boss", targetHeight: 0.85, defaultName: "Mini Arch-Seal Mage", source: "Raid 8 Boss", spec: { kind: "glb", url: "/models/raids/raid8/sealmage-1399-v01.glb" } },
	{ level: 97, id: "raid7_colossus", icon: "🗿", moveMode: "bounce", voiceType: "boss", targetHeight: 0.88, defaultName: "Mini Earthshaker Colossus", source: "Raid 7 Boss", spec: { kind: "glb", url: "/models/raids/raid7/earthshaker-strata-rigged-v02.glb" } },
	{ level: 98, id: "chibi_master", icon: "🕶️", moveMode: "bounce", voiceType: "npc", targetHeight: 0.78, defaultName: "Mini ??? (Master NPC)", source: "Special NPC", spec: { kind: "character", charType: "masternpc" } },
	{ level: 99, id: "chibi_ner", icon: "🔨", moveMode: "bounce", voiceType: "npc", targetHeight: 0.78, defaultName: "Mini Priestess Ner", source: "Special NPC", spec: { kind: "character", charType: "ner" } },
	{ level: 100, id: "battlecruiser", icon: "🚀", moveMode: "fly", voiceType: "boss", targetHeight: 0.95, defaultName: "Galactic Battlecruiser Flagship", source: "Lv.100 Mythic Flagship", spec: { kind: "glb", url: "/models/battlecruiser/battlecruiser.opt.glb", isHorizontalShip: true } }
];

const SPKMOD_PETS_BY_ID = new Map(SPKMOD_PET_CATALOG.map(p => [p.id, p]));
const SPKMOD_PETS_BY_LEVEL = new Map();
for (const p of SPKMOD_PET_CATALOG) {
	if (!SPKMOD_PETS_BY_LEVEL.has(p.level)) {
		SPKMOD_PETS_BY_LEVEL.set(p.level, p);
	}
}

function spkmodGetPetDisplayName(pet) {
	if (!pet) return "";
	const lang = spkmodGetActiveLang();
	if (pet.monsterId && typeof window.i18n === "function") {
		try {
			const nativeName = window.i18n(`content.monster.${pet.monsterId}.name`);
			if (nativeName && !nativeName.startsWith("content.monster.")) {
				return nativeName;
			}
		} catch (_) {}
	}
	const tr = typeof spkmodTranslations !== "undefined" ? spkmodTranslations : null;
	return (tr && tr[lang] && tr[lang].petNames && tr[lang].petNames[pet.id])
		|| (tr && tr.en && tr.en.petNames && tr.en.petNames[pet.id])
		|| pet.defaultName
		|| pet.id;
}

function spkmodGetPlayerLevel() {
	if (typeof gameState !== "undefined" && gameState?.myStat?.level) {
		return Number(gameState.myStat.level) || 1;
	}
	return 1;
}

function spkmodIsPetUnlocked(pet) {
	if (!pet) return false;
	if (window.spkmodPetSettings.unlockAllTest) return true;
	return spkmodGetPlayerLevel() >= pet.level;
}

// ============================================================================
// 5. 3D MODEL BUILDERS (GLB, ISOLATED NATIVE MONSTER, PROCEDURAL & FBX CHAR)
// ============================================================================
const _spkmodPetGlbCache = new Map();
const _spkmodDetachedMonsterEntries = new Map();
let _spkmodMonsterPetSeq = 0;

function spkmodInstallMonsterIsolationHook() {
	if (typeof gameState === "undefined" || !gameState?.monsters?.monsters) return false;
	const map = gameState.monsters.monsters;
	if (map.__spkmodPetIsolationHooked) return true;
	map.__spkmodPetIsolationHooked = true;

	const origGet = map.get.bind(map);
	map.get = function(key) {
		const res = origGet(key);
		if (res !== undefined) return res;
		return _spkmodDetachedMonsterEntries.get(key);
	};
	return true;
}

const SPKMOD_NOOP_RAYCAST = () => {};

function spkmodDisableRaycastAndSanitize(root, hideSpritesAndRings = false) {
	if (!root || typeof root.traverse !== "function") return;
	root.traverse(obj => {
		if (!obj) return;
		if (obj.isMesh) {
			obj.raycast = SPKMOD_NOOP_RAYCAST;
			obj.frustumCulled = false;
			obj.castShadow = false;
			obj.receiveShadow = false;
			if (!obj.userData) obj.userData = {};
			obj.userData.spkmodNoShadow = true;
		}
		if (hideSpritesAndRings) {
			if (obj.isSprite || obj.type === "Sprite") {
				obj.visible = false;
			}
			// Hide ground danger/target ring added by f1/u1 (RingGeometry/CircleGeometry rotated -PI/2 on X)
			if (obj.isMesh && obj.geometry && (obj.geometry.type === "RingGeometry" || obj.geometry.type === "CircleGeometry") && Math.abs(obj.rotation.x + Math.PI / 2) < 0.05) {
				obj.visible = false;
			}
		}
	});
}

function spkmodCloneSceneWithSkins(source) {
	if (!source) return null;
	const cloneToOrig = new Map();
	const origToClone = new Map();
	const cloned = source.clone(true);

	function mapHierarchy(origNode, cloneNode) {
		cloneToOrig.set(cloneNode, origNode);
		origToClone.set(origNode, cloneNode);
		const count = origNode.children ? origNode.children.length : 0;
		for (let i = 0; i < count; i++) {
			if (origNode.children[i] && cloneNode.children[i]) {
				mapHierarchy(origNode.children[i], cloneNode.children[i]);
			}
		}
	}
	mapHierarchy(source, cloned);

	cloned.traverse(node => {
		if (!node || !node.isSkinnedMesh) return;
		const origMesh = cloneToOrig.get(node);
		if (!origMesh || !origMesh.skeleton) return;
		const origBones = origMesh.skeleton.bones || [];
		node.skeleton = origMesh.skeleton.clone();
		if (Array.isArray(origMesh.skeleton.boneInverses)) {
			node.skeleton.boneInverses = origMesh.skeleton.boneInverses.map(m => (m && typeof m.clone === "function") ? m.clone() : m);
		}
		if (origMesh.bindMatrix) node.bindMatrix.copy(origMesh.bindMatrix);
		node.skeleton.bones = origBones.map(b => origToClone.get(b) || b);
		node.bind(node.skeleton, node.bindMatrix);
		node.skeleton.update();
	});
	return cloned;
}

function spkmodComputeAnimatedMinY(root) {
	const THREE = window.THREE;
	if (!THREE || !root) return Infinity;
	root.updateMatrixWorld(true);
	let minY = Infinity;
	const v = new THREE.Vector3();
	root.traverse(obj => {
		if (!obj || !obj.isMesh || !obj.geometry || !obj.geometry.attributes?.position) return;
		if (obj.isSkinnedMesh && obj.skeleton) {
			try { obj.skeleton.update(); } catch (_) {}
		}
		const pos = obj.geometry.attributes.position;
		for (let i = 0; i < pos.count; i++) {
			if (obj.isSkinnedMesh && typeof obj.getVertexPosition === "function") {
				obj.getVertexPosition(i, v);
			} else {
				v.fromBufferAttribute(pos, i);
			}
			v.applyMatrix4(obj.matrixWorld);
			if (isFinite(v.y) && v.y < minY) minY = v.y;
		}
	});
	return minY;
}

function spkmodNormalizeObjectSize(obj, targetSize = 0.6, useMaxDim = false) {
	const THREE = window.THREE;
	if (!THREE || !obj) return;
	obj.traverse(n => {
		if (n && n.isSkinnedMesh) {
			n.boundingBox = null;
			if (n.skeleton) {
				try { n.skeleton.update(); } catch (_) {}
			}
		}
	});
	obj.updateMatrixWorld(true);
	const box = new THREE.Box3().setFromObject(obj);
	const size = box.getSize(new THREE.Vector3());
	const refDim = useMaxDim ? Math.max(size.x, size.y, size.z) : (size.y > 0.01 ? size.y : Math.max(size.x, size.z));
	if (refDim > 0.001 && isFinite(refDim)) {
		const scale = Math.min(50, Math.max(0.001, targetSize / refDim));
		obj.scale.multiplyScalar(scale);
		obj.traverse(n => {
			if (n && n.isSkinnedMesh) {
				n.boundingBox = null;
				if (n.skeleton) {
					try { n.skeleton.update(); } catch (_) {}
				}
			}
		});
		obj.updateMatrixWorld(true);
		const box2 = new THREE.Box3().setFromObject(obj);
		const center = box2.getCenter(new THREE.Vector3());
		if (isFinite(center.x)) obj.position.x -= center.x;
		if (isFinite(center.z)) obj.position.z -= center.z;
		if (isFinite(box2.min.y)) obj.position.y -= box2.min.y;
		obj.updateMatrixWorld(true);
	}
}

async function spkmodLoadGlbScene(url) {
	if (_spkmodPetGlbCache.has(url)) return _spkmodPetGlbCache.get(url);
	const promise = (async () => {
		if (typeof spkmodEnsureGLTFLoader !== "function") return null;
		const GLTFLoader = await spkmodEnsureGLTFLoader();
		if (!GLTFLoader) return null;
		const loader = new GLTFLoader();
		const meshopt = (typeof _spkmodMeshoptDecoder !== "undefined" && _spkmodMeshoptDecoder) || window.THREE?.MeshoptDecoder;
		if (meshopt) {
			if (meshopt.ready) await meshopt.ready;
			loader.setMeshoptDecoder(meshopt);
		}
		const gltf = await loader.loadAsync(url);
		return gltf || null;
	})().catch(err => {
		console.warn("[SpeakiMod+ Pets] Failed to load GLB:", url, err);
		_spkmodPetGlbCache.delete(url);
		return null;
	});
	_spkmodPetGlbCache.set(url, promise);
	return promise;
}

function spkmodBuildProceduralPet(pet) {
	const THREE = window.THREE;
	if (!THREE) return null;
	const group = new THREE.Group();
	const bType = pet.spec?.builder || "nuruling";
	const spinningParts = [];
	const wheels = [];

	if (bType === "knife" && typeof spkmodCreateKnifeProp === "function") {
		const k = spkmodCreateKnifeProp();
		if (k) { k.position.set(0, 0.25, 0); k.scale.setScalar(2.2); group.add(k); }
	} else if (bType === "pan" && typeof spkmodCreatePanProp === "function") {
		const p = spkmodCreatePanProp();
		if (p) { p.position.set(0, 0.25, 0); p.scale.setScalar(2.0); group.add(p); }
	} else if (bType === "ladle" && typeof spkmodCreateLadleProp === "function") {
		const l = spkmodCreateLadleProp();
		if (l) { l.position.set(0, 0.25, 0); l.scale.setScalar(2.2); group.add(l); }
	} else if (bType === "tray" && typeof spkmodCreateTrayProp === "function") {
		const tr = spkmodCreateTrayProp();
		if (tr) { tr.position.set(0, 0.2, 0); tr.scale.setScalar(1.7); group.add(tr); }
	} else if (bType === "soccerBall") {
		const canvas = document.createElement("canvas");
		canvas.width = 128;
		canvas.height = 64;
		const ctx = canvas.getContext("2d");
		if (ctx) {
			ctx.fillStyle = "#ffffff";
			ctx.fillRect(0, 0, 128, 64);
			ctx.fillStyle = "#27272a";
			for (let r = 0; r < 3; r++) {
				for (let c = 0; c < 6; c++) {
					const shift = r % 2 === 0 ? 0 : 0.5;
					const cx = ((c + shift + 0.5) / 6) * 128;
					const cy = ((r + 0.5) / 3) * 64;
					ctx.beginPath();
					ctx.arc(cx, cy, 7.5, 0, Math.PI * 2);
					ctx.fill();
				}
			}
		}
		const tex = new THREE.CanvasTexture(canvas);
		const rad = 0.27;
		const ball = new THREE.Mesh(new THREE.SphereGeometry(rad, 20, 14), new THREE.MeshToonMaterial({ color: 0xffffff, map: tex }));
		ball.position.y = rad;
		group.add(ball);
		wheels.push(ball);
	} else if (bType === "pumpkin") {
		const isNeon = pet.spec?.variant === 1;
		const r = 0.28;
		const geom = new THREE.SphereGeometry(r, 20, 12);
		const pos = geom.attributes.position;
		for (let i = 0; i < pos.count; i++) {
			const vx = pos.getX(i), vz = pos.getZ(i);
			const wave = 1 + 0.14 * Math.cos(Math.atan2(vz, vx) * 8);
			pos.setX(i, vx * wave);
			pos.setZ(i, vz * wave);
		}
		pos.needsUpdate = true;
		geom.computeVertexNormals();
		const bodyCol = isNeon ? 0x38ff9c : 0xff7b22;
		const bodyMat = new THREE.MeshToonMaterial({
			color: bodyCol,
			emissive: isNeon ? 0x10b981 : 0x551a00,
			emissiveIntensity: isNeon ? 0.55 : 0.15
		});
		const body = new THREE.Mesh(geom, bodyMat);
		body.scale.set(1, 0.75, 1);
		body.position.y = r * 0.75;
		group.add(body);
		const stem = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.12, r * 0.18, r * 0.38, 6), new THREE.MeshToonMaterial({ color: 0x6a8f3a }));
		stem.position.y = r * 1.45;
		stem.rotation.z = 0.2;
		group.add(stem);
		// Cute glowing eyes
		const eyeMat = new THREE.MeshBasicMaterial({ color: isNeon ? 0xfffbeb : 0x1e1b18 });
		for (const side of [-1, 1]) {
			const eye = new THREE.Mesh(new THREE.SphereGeometry(r * 0.11, 8, 6), eyeMat);
			eye.position.set(side * r * 0.34, r * 0.82, r * 0.88);
			group.add(eye);
		}
	} else if (bType === "nuruling") {
		const tier = pet.spec?.tier || 1;
		const colors = { 1: 0xceea80, 2: 0xbfeb50, 3: 0x8fe07a, 4: 0x5ac0d8 };
		const r = 0.27 + (tier - 1) * 0.03;
		const bodyMat = new THREE.MeshToonMaterial({
			color: colors[tier] || 0xceea80,
			emissive: tier >= 2 ? (colors[tier] || 0xceea80) : 0x000000,
			emissiveIntensity: (tier - 1) * 0.18
		});
		const body = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 14), bodyMat);
		body.position.y = r;
		group.add(body);
		// Eyes
		const eyeMat = new THREE.MeshBasicMaterial({ color: 0x2b1f26 });
		for (const side of [-1, 1]) {
			const eye = new THREE.Mesh(new THREE.SphereGeometry(r * 0.12, 8, 6), eyeMat);
			eye.position.set(side * r * 0.35, r * 1.05, r * 0.9);
			group.add(eye);
		}
		// Rosy cheeks
		const cheekMat = new THREE.MeshBasicMaterial({ color: 0xffb3c6, transparent: true, opacity: 0.7, side: THREE.DoubleSide });
		for (const side of [-1, 1]) {
			const cheek = new THREE.Mesh(new THREE.CircleGeometry(r * 0.17, 10), cheekMat);
			cheek.position.set(side * r * 0.62, r * 0.86, r * 0.76);
			cheek.rotation.y = -side * (Math.PI / 6);
			group.add(cheek);
		}
		// Top sprout / horn
		if (tier === 1 || tier === 2) {
			const stem = new THREE.Mesh(new THREE.ConeGeometry(r * 0.22, r * 0.35, 6), new THREE.MeshToonMaterial({ color: 0xffd1e6 }));
			stem.position.set(r * 0.35, r * 1.92, 0);
			stem.rotation.z = -Math.PI / 2.5;
			group.add(stem);
			const bud = new THREE.Mesh(new THREE.SphereGeometry(r * 0.13, 8, 6), new THREE.MeshToonMaterial({ color: 0xffe992 }));
			bud.position.set(r * 0.55, r * 2.02, 0);
			group.add(bud);
		} else {
			const horn = new THREE.Mesh(new THREE.ConeGeometry(r * 0.18, r * 0.55, 6), new THREE.MeshToonMaterial({ color: tier === 4 ? 0xfacc15 : 0x4fade2 }));
			horn.position.set(0, r * 2.05, 0);
			group.add(horn);
		}
	} else if (bType === "nurulingDrone") {
		const hull = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 0.42, 12), new THREE.MeshToonMaterial({ color: 0xf8fafc }));
		hull.rotation.x = Math.PI / 2;
		hull.position.y = 0.25;
		group.add(hull);
		const nose = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.22, 12), new THREE.MeshToonMaterial({ color: 0xf43f5e, emissive: 0xe11d48, emissiveIntensity: 0.4 }));
		nose.rotation.x = Math.PI / 2;
		nose.position.set(0, 0.25, 0.32);
		group.add(nose);
		const finMat = new THREE.MeshToonMaterial({ color: 0x38bdf8 });
		for (const side of [-1, 1]) {
			const fin = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.03, 0.14), finMat);
			fin.position.set(0, 0.25, -0.1);
			if (side === 1) fin.rotation.z = Math.PI / 2;
			group.add(fin);
		}
	} else if (bType === "mechaPumpkin") {
		const orangeMat = new THREE.MeshToonMaterial({ color: 0xeb7f21 });
		const darkMat = new THREE.MeshToonMaterial({ color: 0x201812 });
		const glowMat = new THREE.MeshToonMaterial({ color: 0xffdf60, emissive: 0xffaf20, emissiveIntensity: 1.0 });
		const hull = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.24, 0.50), orangeMat);
		hull.position.y = 0.32;
		group.add(hull);
		const nose = new THREE.Mesh(new THREE.ConeGeometry(0.21, 0.22, 10), orangeMat);
		nose.rotation.x = Math.PI / 2;
		nose.position.set(0, 0.32, 0.36);
		group.add(nose);
		const faceTex = new THREE.TextureLoader().load("/textures/pets/mecha-pumpkin-face.png");
		const facePlane = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.22), new THREE.MeshBasicMaterial({ map: faceTex, transparent: true, side: THREE.DoubleSide }));
		facePlane.rotation.x = -Math.PI / 2;
		facePlane.position.set(0, 0.45, 0.08);
		group.add(facePlane);
		for (const side of [-1, 1]) {
			const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.18, 12), darkMat);
			pod.rotation.x = Math.PI / 2;
			pod.position.set(side * 0.38, 0.42, -0.15);
			group.add(pod);
			const rotor = new THREE.Group();
			rotor.position.set(side * 0.38, 0.53, -0.15);
			for (let b = 0; b < 2; b++) {
				const blade = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.018, 0.045), glowMat);
				blade.rotation.y = (Math.PI / 2) * b;
				rotor.add(blade);
			}
			group.add(rotor);
			spinningParts.push(rotor);
		}
	} else if (bType === "pumpkinCart" || bType === "policeCar") {
		const isPolice = bType === "policeCar";
		const bodyMat = new THREE.MeshToonMaterial({ color: isPolice ? 0xf1f5f9 : 0xff8524 });
		const trimMat = new THREE.MeshToonMaterial({ color: isPolice ? 0x1e293b : 0x5c3a21 });
		const body = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.28, 0.68), bodyMat);
		body.position.y = 0.24;
		group.add(body);
		const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.10, 0.70), trimMat);
		stripe.position.y = 0.22;
		group.add(stripe);
		if (isPolice) {
			const redBar = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.06, 0.06), new THREE.MeshToonMaterial({ color: 0xff2a4b, emissive: 0xff2a4b, emissiveIntensity: 0.9 }));
			redBar.position.set(-0.09, 0.41, 0.1);
			const blueBar = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.06, 0.06), new THREE.MeshToonMaterial({ color: 0x2563eb, emissive: 0x2563eb, emissiveIntensity: 0.9 }));
			blueBar.position.set(0.09, 0.41, 0.1);
			group.add(redBar, blueBar);
		}
		const wheelGeom = new THREE.CylinderGeometry(0.11, 0.11, 0.06, 14);
		wheelGeom.rotateZ(Math.PI / 2);
		const wheelMat = new THREE.MeshToonMaterial({ color: 0x18181b });
		for (const sx of [-1, 1]) {
			for (const sz of [-1, 1]) {
				const w = new THREE.Mesh(wheelGeom, wheelMat);
				w.position.set(sx * 0.28, 0.11, sz * 0.22);
				group.add(w);
				wheels.push(w);
			}
		}
	} else if (bType === "transportDrone") {
		const frameMat = new THREE.MeshToonMaterial({ color: 0xd8dce8 });
		const darkMat = new THREE.MeshToonMaterial({ color: 0x2b303c });
		const orangeMat = new THREE.MeshToonMaterial({ color: 0xff8c1a, emissive: 0xff6a00, emissiveIntensity: 0.4 });
		const core = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.16, 0.42), frameMat);
		core.position.y = 0.35;
		group.add(core);
		const angles = [Math.PI / 4, (3 * Math.PI) / 4, -Math.PI / 4, (-3 * Math.PI) / 4];
		for (const ang of angles) {
			const arm = new THREE.Group();
			arm.rotation.y = ang;
			arm.position.y = 0.35;
			const strut = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.36), darkMat);
			strut.position.z = 0.18;
			arm.add(strut);
			const rotor = new THREE.Group();
			rotor.position.set(0, 0.05, 0.36);
			for (let b = 0; b < 3; b++) {
				const blade = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.012, 0.03), orangeMat);
				blade.rotation.y = (Math.PI * 2 * b) / 3;
				rotor.add(blade);
			}
			arm.add(rotor);
			spinningParts.push(rotor);
			group.add(arm);
		}
	} else if (bType === "snowman") {
		const snowMat = new THREE.MeshToonMaterial({ color: 0xf8fafc });
		const bot = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 12), snowMat);
		bot.position.y = 0.24;
		const top = new THREE.Mesh(new THREE.SphereGeometry(0.19, 16, 12), snowMat);
		top.position.y = 0.58;
		const nose = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.16, 8), new THREE.MeshToonMaterial({ color: 0xf97316 }));
		nose.rotation.x = Math.PI / 2;
		nose.position.set(0, 0.58, 0.22);
		const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.04, 8, 18), new THREE.MeshToonMaterial({ color: 0xef4444 }));
		scarf.rotation.x = Math.PI / 2;
		scarf.position.y = 0.44;
		const hatCone = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.28, 12), new THREE.MeshToonMaterial({ color: 0xdc2626 }));
		hatCone.position.y = 0.84;
		const pom = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), snowMat);
		pom.position.y = 0.99;
		const eyeMat = new THREE.MeshBasicMaterial({ color: 0x18181b });
		for (const side of [-1, 1]) {
			const eye = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 6), eyeMat);
			eye.position.set(side * 0.07, 0.63, 0.17);
			group.add(eye);
		}
		group.add(bot, top, nose, scarf, hatCone, pom);
	}

	spkmodDisableRaycastAndSanitize(group, false);
	return { root: group, spinningParts, wheels };
}

async function spkmodInstantiatePetVisual(pet, instance) {
	const THREE = (window.THREE && window.THREE.Group && window.THREE.Mesh && window.THREE.BoxGeometry)
		? window.THREE
		: ((typeof spkmodEnsureThree === "function") ? await spkmodEnsureThree() : window.THREE);
	if (!THREE || !THREE.Group || instance.disposed) return;

	const spec = pet.spec || {};

	// 1. PROCEDURAL PETS
	if (spec.kind === "procedural") {
		const built = spkmodBuildProceduralPet(pet);
		if (built && !instance.disposed) {
			instance.modelHolder.clear();
			instance.modelHolder.add(built.root);
			instance.spinningParts = built.spinningParts || [];
			instance.wheels = built.wheels || [];
			instance._ownsVisualResources = true;
			instance._peakVisualTopY = 0;
			instance._cachedVisualTopY = 0;
			spkmodRepositionPetBubbleIfActive(instance);
		}
		return;
	}

	// 2. NATIVE MONSTER PETS (via isolated gameState.monsters.spawn hook)
	if (spec.kind === "monster" && spec.monsterId) {
		if (typeof gameState !== "undefined" && gameState?.monsters && typeof gameState.monsters.spawn === "function") {
			try {
				spkmodInstallMonsterIsolationHook();
				const tempId = -910000 - (++_spkmodMonsterPetSeq);
				gameState.monsters.spawn({
					monsterInfos: [{
						monsterInstanceId: tempId,
						monsterMasterId: spec.monsterId,
						name: "",
						positionX: 0,
						positionY: 0,
						positionZ: 0,
						currentHp: 0,
						maxHp: 0,
						yaw: 0,
						level: 0
					}]
				});
				const entry = gameState.monsters.monsters.get(tempId);
				if (entry) {
					gameState.monsters.monsters.delete(tempId);
					_spkmodDetachedMonsterEntries.set(tempId, entry);
					if (entry.container && entry.container.parent) {
						entry.container.parent.remove(entry.container);
					}
					entry.container.position.set(0, 0, 0);
					entry.container.rotation.set(0, 0, 0);
					entry.container.scale.setScalar(spec.scale || 0.52);
					spkmodDisableRaycastAndSanitize(entry.container, true);
					// Sanitize immediately when async upgradeToSkinned/upgradeToTusklordGlb adds upgraded visuals (prevents nameplate flashes!)
					if (!entry.container.__spkmodPetAddHooked && typeof entry.container.add === "function") {
						const origAdd = entry.container.add.bind(entry.container);
						entry.container.add = function(...args) {
							const res = origAdd(...args);
							for (const child of args) {
								if (child) spkmodDisableRaycastAndSanitize(child, true);
							}
							return res;
						};
						entry.container.__spkmodPetAddHooked = true;
					}
					instance.modelHolder.clear();
					instance.modelHolder.add(entry.container);
					instance.monsterEntry = entry;
					instance.monsterTempId = tempId;
					instance._sanitizedMonsterVisual = entry.visual || null;
					instance._lastMeasuredMonsterVisual = entry.visual || null;
					instance._lastMonsterLoco = null;
					instance._peakVisualTopY = 0;
					instance._cachedVisualTopY = 0;
					spkmodRepositionPetBubbleIfActive(instance);
					return;
				}
			} catch (err) {
				console.warn("[SpeakiMod+ Pets] Monster spawn hook fallback:", err);
			}
		}
		if (!spec.fallbackGlbUrl) {
			// Fallback to cute procedural slime if gameState.monsters is unavailable
			const fallback = spkmodBuildProceduralPet({ spec: { builder: "nuruling", tier: (spec.monsterId % 4) + 1 } });
			if (fallback && !instance.disposed) {
				instance.modelHolder.clear();
				instance.modelHolder.add(fallback.root);
			}
			return;
		}
	}

	// 3. CHIBI CHARACTER FBX PETS (Kommy / ??? MasterNpc / Ner)
	if (spec.kind === "character") {
		const FBXLoader = (typeof spkmodEnsureFBXLoader === "function") ? await spkmodEnsureFBXLoader() : window.THREE?.FBXLoader;
		if (FBXLoader && !instance.disposed) {
			try {
				const charType = spec.charType || "masternpc";
				let fbxUrl, bodyTexUrl, faceTexUrl = null, faceAsleepUrl = null, pillowTexUrl = null, animUrl;

				if (charType === "ner") {
					fbxUrl = "/models/ner/Ner__COPYRIGHT_JEREMY_POWEE__NO_UNAUTHORIZED_USE_OR_REDISTRIBUTION.fbx";
					bodyTexUrl = "/models/ner/Map_Body.png";
					faceTexUrl = "/models/ner/Map_Face.png";
					animUrl = "/models/ner/animations/idle.fbx";
				} else if (charType === "kommy") {
					fbxUrl = "/models/komi/Kommy__COPYRIGHT_JEREMY_POWEE__NO_UNAUTHORIZED_USE_OR_REDISTRIBUTION.fbx";
					bodyTexUrl = "/models/komi/Map_Body.png";
					faceTexUrl = "/models/komi/Map_Face.png";
					faceAsleepUrl = "/models/komi/Map_Face_Asleep.png";
					pillowTexUrl = "/models/komi/Kommy_Pillow.png";
					animUrl = "/models/komi/animations/sleepy_idle__COPYRIGHT_JEREMY_POWEE__NO_UNAUTHORIZED_USE_OR_REDISTRIBUTION.fbx";
				} else {
					fbxUrl = "/models/masterNpc/MasterNpc.fbx";
					bodyTexUrl = "/models/masterNpc/texture_pbr_20250901.png";
					animUrl = "/models/masterNpc/animations/idle.fbx";
				}

				const fbxLoader = new FBXLoader();
				const texLoader = new THREE.TextureLoader();
				const loadTex = (u) => u ? texLoader.loadAsync(u).then(t => {
					if (t && THREE.SRGBColorSpace) t.colorSpace = THREE.SRGBColorSpace;
					return t;
				}).catch(() => null) : Promise.resolve(null);

				const [fbx, bodyTex, faceTex, faceAsleepTex, pillowTex, animFbx] = await Promise.all([
					fbxLoader.loadAsync(fbxUrl),
					loadTex(bodyTexUrl),
					loadTex(faceTexUrl),
					loadTex(faceAsleepUrl),
					loadTex(pillowTexUrl),
					fbxLoader.loadAsync(animUrl).catch(() => null)
				]);
				if (instance.disposed) return;

				const lightsToRemove = [];
				let kommyFaceMat = null;

				fbx.traverse(child => {
					if (!child) return;
					if (child.isLight) {
						child.visible = false;
						lightsToRemove.push(child);
					}
					if (child.isMesh) {
						child.raycast = () => {};
						child.frustumCulled = false;
						const origMats = Array.isArray(child.material) ? child.material : [child.material];
						const mappedMats = origMats.map(m => {
							const mName = (m?.name || "").toLowerCase();
							let nextMat;
							if (mName.includes("face") && (faceTex || bodyTex)) {
								nextMat = new THREE.MeshToonMaterial({ color: 0xffffff, map: faceTex || bodyTex });
								kommyFaceMat = nextMat;
							} else if (mName.includes("pillow")) {
								nextMat = new THREE.MeshToonMaterial({ color: 0xffffff, map: pillowTex || m?.map || bodyTex });
							} else if (mName.includes("body") || (charType === "masternpc" && mName.includes("material"))) {
								nextMat = new THREE.MeshToonMaterial({
									color: 0xffffff,
									map: bodyTex || null,
									alphaTest: 0.5,
									side: THREE.DoubleSide
								});
							} else {
								nextMat = new THREE.MeshToonMaterial({
									color: (m && m.color && typeof m.color.getHex === "function") ? m.color.getHex() : 0xffffff,
									map: m?.map || null
								});
							}
							if (m?.name) nextMat.name = m.name;
							return nextMat;
						});
						child.material = Array.isArray(child.material) ? mappedMats : mappedMats[0];
					}
				});

				for (const l of lightsToRemove) {
					if (l.parent) l.parent.remove(l);
				}

				spkmodNormalizeObjectSize(fbx, pet.targetHeight || 0.78, false);
				fbx.updateMatrixWorld(true);
				fbx.traverse(child => {
					if (child && child.isSkinnedMesh && child.skeleton) {
						try { child.bind(child.skeleton); } catch (_) {}
					}
				});

				const charWrapper = new THREE.Group();
				charWrapper.add(fbx);

				if (animFbx && animFbx.animations && animFbx.animations[0]) {
					const clip = animFbx.animations[0];
					const mixer = new THREE.AnimationMixer(fbx);
					mixer.clipAction(clip).play();
					mixer.update(0);

					// Re-ground character after idle animation transforms hips/feet (e.g. Mini Ner dips ~0.18m in idle)
					let lowestY = Infinity;
					const dur = clip.duration || 1;
					for (let s = 0; s < 4; s++) {
						mixer.setTime((dur * s) / 4);
						const sampleMinY = spkmodComputeAnimatedMinY(fbx);
						if (sampleMinY < lowestY) lowestY = sampleMinY;
					}
					mixer.setTime(0);
					if (isFinite(lowestY)) {
						charWrapper.position.y = -lowestY + 0.02;
					}
					instance.mixer = mixer;
				}

				instance.modelHolder.clear();
				instance.modelHolder.add(charWrapper);
				instance._ownsVisualResources = true;
				instance._peakVisualTopY = 0;
				instance._cachedVisualTopY = 0;
				spkmodDisableRaycastAndSanitize(charWrapper, false);
				spkmodRepositionPetBubbleIfActive(instance);

				if (kommyFaceMat && faceTex && faceAsleepTex) {
					instance.kommyBlink = {
						mat: kommyFaceMat,
						awakeTex: faceTex,
						asleepTex: faceAsleepTex,
						nextToggleMs: performance.now() + 8000 + Math.random() * 4000
					};
				}
				return;
			} catch (err) {
				console.warn("[SpeakiMod+ Pets] Character FBX load error:", err);
			}
		}
	}

	// 4. GLB PETS (Minigame Food, Vehicles, Props, Raid Bosses, Battlecruiser)
	const glbUrl = (spec.kind === "glb" ? spec.url : spec.fallbackGlbUrl) || null;
	if (glbUrl) {
		const gltf = await spkmodLoadGlbScene(glbUrl);
		if (!gltf || !gltf.scene || instance.disposed) return;

		let targetNode = gltf.scene;
		if (spec.nodeName) {
			const found = gltf.scene.getObjectByName(spec.nodeName);
			if (found) targetNode = found;
		}

		const cloned = spkmodCloneSceneWithSkins(targetNode);
		if (!cloned) return;
		cloned.visible = true;
		cloned.position.set(0, 0, 0);
		cloned.rotation.set(0, 0, 0);
		cloned.scale.set(1, 1, 1);

		const spinningParts = [];
		const wheels = [];

		cloned.traverse(node => {
			if (!node) return;
			const nName = (node.name || "").toLowerCase();
			if (nName.includes("rotor") || nName.includes("turret_ventral") || nName.includes("radar")) {
				spinningParts.push(node);
			}
			if (nName.includes("wheel_fl") || nName.includes("wheel_fr") || nName.includes("wheel_rl") || nName.includes("wheel_rr")) {
				wheels.push(node);
			}
			if (node.isMesh) {
				node.visible = true;
				node.raycast = SPKMOD_NOOP_RAYCAST;
				node.frustumCulled = false;
				node.castShadow = false;
				node.receiveShadow = false;
				if (!node.userData) node.userData = {};
				node.userData.spkmodNoShadow = true;
				if (spec.tintHex && node.material) {
					const mats = Array.isArray(node.material) ? node.material : [node.material];
					const tinted = mats.map(m => {
						if (!m) return m;
						const cm = m.clone();
						if (cm.color) cm.color.setHex(spec.tintHex);
						return cm;
					});
					node.material = Array.isArray(node.material) ? tinted : tinted[0];
				}
			}
		});

		if (gltf.animations && gltf.animations.length > 0 && !spec.nodeName) {
			try {
				const mixer = new THREE.AnimationMixer(cloned);
				const idleClip = gltf.animations.find(a => /idle/i.test(a.name))
					|| gltf.animations.find(a => /walk/i.test(a.name))
					|| gltf.animations[0];
				const walkClip = gltf.animations.find(a => /walk|run/i.test(a.name)) || null;
				const fallClip = gltf.animations.find(a => /death|slump|fall|die/i.test(a.name)) || null;
				if (idleClip) {
					const idleAct = mixer.clipAction(idleClip);
					idleAct.play();
					instance.idleAction = idleAct;
					instance.activeGlbAction = idleAct;
				}
				if (walkClip && walkClip !== idleClip) {
					instance.walkAction = mixer.clipAction(walkClip);
				}
				if (fallClip && fallClip !== idleClip) {
					const fallAct = mixer.clipAction(fallClip);
					if (THREE.LoopOnce !== undefined) fallAct.setLoop(THREE.LoopOnce, 1);
					fallAct.clampWhenFinished = true;
					instance.fallAction = fallAct;
				}
				mixer.update(0);
				instance.mixer = mixer;
			} catch (_) {}
		}

		const wrapper = new THREE.Group();
		wrapper.add(cloned);
		spkmodNormalizeObjectSize(cloned, pet.targetHeight || 0.62, !!spec.isHorizontalShip);

		instance.modelHolder.clear();
		instance.modelHolder.add(wrapper);
		instance.spinningParts = spinningParts;
		instance.wheels = wheels;
		instance._peakVisualTopY = 0;
		instance._cachedVisualTopY = 0;
		spkmodRepositionPetBubbleIfActive(instance);
	}
}

// ============================================================================
// 6. PET INSTANCE LIFECYCLE, SOUND, SPEECH BUBBLES & DANCE DETECTION
// ============================================================================
let spkmodLocalPetInstance = null;
const spkmodRemotePetInstances = new Map(); // ownerKey -> instance
const spkmodPendingRemotePetsByName = new Map(); // lowerName -> petId
const spkmodPendingRemotePetsById = new Map(); // String(id) -> petId
const spkmodShowcaseInstances = [];

function spkmodPlayPetSfx(pet, isLocalOwner, worldPos) {
	if (!spkmodIsPetsSystemEnabled() || !pet) return;
	if (typeof isGameMuted === "function" && isGameMuted()) return;
	if (isLocalOwner && !window.spkmodPetSettings.mySfx) return;
	if (!isLocalOwner && !window.spkmodPetSettings.otherSfx) return;

	let volume = 0.42;
	if (!isLocalOwner && worldPos && gameState?.playerContainer?.position) {
		const myPos = gameState.playerContainer.position;
		const dist = Math.hypot(worldPos.x - myPos.x, worldPos.z - myPos.z);
		if (dist > 18) return;
		volume = Math.max(0.05, 0.35 * (1 - dist / 18));
	}

	const pool = SPKMOD_PET_SFX_POOLS[pet.voiceType] || SPKMOD_PET_SFX_POOLS.slime;
	const sfxUrl = spkmodPickRandom(pool);
	if (!sfxUrl) return;
	try {
		const audio = new Audio(sfxUrl);
		audio.volume = volume;
		audio.play().catch(() => {});
	} catch (_) {}
}

function spkmodSyncPetSpeechAnchor(instance) {
	if (!instance || !instance.speechAnchor || !instance.modelHolder) return;
	const curY = instance.modelHolder.position ? instance.modelHolder.position.y : 0;
	const fallbackY = (instance.pet && instance.pet.moveMode === "fly" && curY === 0) ? 1.25 : curY;
	instance.speechAnchor.position.y = fallbackY;
}

let _spkmodScratchVec3 = null;
let _spkmodScratchBox3 = null;

function spkmodComputePetVisualTopOffsetY(instance) {
	const baseTarget = (instance && instance.pet && instance.pet.targetHeight) || 0.65;
	if (!instance || !instance.modelHolder) return baseTarget;
	if (instance._cachedVisualTopY && instance._cachedVisualTopY > 0) {
		return instance._cachedVisualTopY;
	}
	const THREE = window.THREE;
	if (!THREE) return baseTarget;

	let measuredTop = 0;
	let nativeMonsterTop = 0;

	try {
		// Fast path for native monsters: inspect hidden native nameplate sprite (placed at heightM + 0.4 inside visual root)
		// Avoids expensive 25,000+ vertex CPU SkinnedMesh bounding-box loops!
		if (instance.monsterEntry && instance.monsterEntry.container) {
			const containerScaleY = Math.abs(instance.monsterEntry.container.scale?.y || 1);
			const visualScaleY = Math.abs(instance.monsterEntry.visual?.root?.scale?.y || 1);
			const combinedScaleY = containerScaleY * visualScaleY;
			instance.monsterEntry.container.traverse(obj => {
				if (obj && (obj.isSprite || obj.type === "Sprite") && obj.position && obj.position.y > 0.4) {
					const h = (obj.position.y - 0.4) * combinedScaleY;
					if (isFinite(h) && h > nativeMonsterTop && h <= 8.0) {
						nativeMonsterTop = h;
					}
				}
			});
		}

		// Only measure 3D mesh bounds if we don't already have an authoritative native monster heightM
		if (nativeMonsterTop <= 0) {
			if (!_spkmodScratchVec3) _spkmodScratchVec3 = new THREE.Vector3();
			if (!_spkmodScratchBox3) _spkmodScratchBox3 = new THREE.Box3();
			if (instance.root) instance.root.updateMatrixWorld(true);
			const holderWorldY = _spkmodScratchVec3.setFromMatrixPosition(instance.modelHolder.matrixWorld).y;
			let maxWorldY = -Infinity;

			const scanVisible = (node) => {
				if (!node || node.visible === false) return;
				if (node.isSprite || node.type === "Sprite") return;
				if (node.isMesh && node.geometry) {
					if (node.isSkinnedMesh && node.geometry.attributes?.position && typeof node.getVertexPosition === "function") {
						try {
							if (node.skeleton) node.skeleton.update();
							const pos = node.geometry.attributes.position;
							const stride = Math.max(1, Math.floor(pos.count / 240));
							for (let idx = 0; idx < pos.count; idx += stride) {
								node.getVertexPosition(idx, _spkmodScratchVec3);
								_spkmodScratchVec3.applyMatrix4(node.matrixWorld);
								if (isFinite(_spkmodScratchVec3.y) && _spkmodScratchVec3.y > maxWorldY) {
									maxWorldY = _spkmodScratchVec3.y;
								}
							}
						} catch (_) {}
					} else {
						if (!node.geometry.boundingBox) {
							try { node.geometry.computeBoundingBox(); } catch (_) {}
						}
						const localBox = node.geometry.boundingBox;
						if (localBox && !localBox.isEmpty()) {
							_spkmodScratchBox3.copy(localBox).applyMatrix4(node.matrixWorld);
							if (isFinite(_spkmodScratchBox3.max.y) && _spkmodScratchBox3.max.y > maxWorldY) {
								maxWorldY = _spkmodScratchBox3.max.y;
							}
						}
					}
				}
				const children = node.children;
				if (children && children.length > 0) {
					for (let i = 0; i < children.length; i++) {
						scanVisible(children[i]);
					}
				}
			};
			scanVisible(instance.modelHolder);

			if (isFinite(maxWorldY) && isFinite(holderWorldY)) {
				const holderScaleY = Math.max(0.5, Math.abs(instance.modelHolder.scale?.y || 1));
				const relTop = (maxWorldY - holderWorldY) / holderScaleY;
				if (relTop > 0 && relTop <= 8.0) {
					measuredTop = relTop;
				}
			}
		}
	} catch (_) {}

	const topY = Math.max(baseTarget, measuredTop, nativeMonsterTop, instance._peakVisualTopY || 0);
	if (isFinite(topY) && topY > 0) {
		instance._peakVisualTopY = Math.max(instance._peakVisualTopY || 0, topY);
		if (nativeMonsterTop > 0 || measuredTop > 0) {
			instance._cachedVisualTopY = instance._peakVisualTopY;
		}
	}
	return topY;
}

function spkmodPositionActivePetBubble(instance, entry) {
	if (!instance || !entry || !entry.sprite) return;
	const topY = spkmodComputePetVisualTopOffsetY(instance);
	const clearance = 0.35 + Math.min(0.25, topY * 0.12);
	const spriteHalfH = (entry.sprite.scale && isFinite(entry.sprite.scale.y)) ? entry.sprite.scale.y * 0.5 : 0;
	entry.sprite.position.set(0, topY + clearance + spriteHalfH, 0);
}

function spkmodRepositionPetBubbleIfActive(instance) {
	if (!instance || instance.disposed || typeof gameState === "undefined" || !gameState?.chatBubbles?.bubbles?.get) return;
	const entry = gameState.chatBubbles.bubbles.get("spkmod_pet_bubble_" + instance.ownerKey);
	if (entry && entry.sprite) {
		spkmodSyncPetSpeechAnchor(instance);
		spkmodPositionActivePetBubble(instance, entry);
	}
}

function spkmodShowPetSpeechBubble(instance, customText) {
	if (!spkmodIsPetsSystemEnabled()) return;
	if (!instance || instance.disposed || !instance.root) return;
	if (!customText && !window.spkmodPetSettings.speechBubbles) return;
	if (typeof gameState === "undefined" || !gameState?.chatBubbles) return;

	const text = customText || spkmodGeneratePetSpeech(instance.pet);
	if (!text) return;

	spkmodSyncPetSpeechAnchor(instance);

	const bubbleKey = "spkmod_pet_bubble_" + instance.ownerKey;
	const showFn = window.__spkmodOrigChatBubblesShow || gameState.chatBubbles.show.bind(gameState.chatBubbles);
	try {
		showFn(bubbleKey, instance.speechAnchor, text);
		const entry = gameState.chatBubbles.bubbles?.get?.(bubbleKey);
		if (entry && entry.sprite) {
			spkmodPositionActivePetBubble(instance, entry);
		}
	} catch (err) {
		console.warn("[SpeakiMod+ Pets] Failed to show pet speech bubble:", err);
	}
}

function spkmodGetOwnerAnimController(instance) {
	if (!instance) return null;
	if (instance.isLocal) {
		return (typeof gameState !== "undefined")
			? (gameState?.localAnimationController || gameState?.localAvatar?.animationController || null)
			: null;
	}
	const rp = instance.resolveRemotePlayer?.();
	return rp?.avatar?.animationController || null;
}

function spkmodIsOwnerDancing(instance) {
	const now = performance.now();
	if (instance.forceDanceUntil > now) return true;

	if (instance.isLocal) {
		if (
			window.PetDanceActive ||
			(window.RitualState && window.RitualState > 0) ||
			(window.PartnerDanceState && window.PartnerDanceState > 0) ||
			window.BeyBladeActive ||
			window.ReverseBeyBladeActive ||
			window.spkmodSpellDanceActive
		) {
			return true;
		}
	}
	const ctrl = spkmodGetOwnerAnimController(instance);
	if (ctrl) {
		if (ctrl.freeDancePlaying) return true;
		const clipName = ctrl.activeAction?.getClip?.()?.name || "";
		if (/^dance/i.test(clipName)) return true;
	}
	return false;
}

function spkmodIsOwnerFallenDown(instance) {
	const now = performance.now();
	if (instance.forceFallDownUntil > now) return true;
	if (instance.isLocal && typeof gameState !== "undefined" && gameState?.isDead) return true;
	const ctrl = spkmodGetOwnerAnimController(instance);
	if (!ctrl) return false;
	if (ctrl.fallDownPlaying || ctrl.isDead) return true;
	const deathAct = ctrl.actions?.get?.("death");
	if (deathAct && ctrl.activeAction === deathAct) return true;
	const clipName = ctrl.activeAction?.getClip?.()?.name || "";
	if (/^(death|falldown|faint)/i.test(clipName)) return true;
	return false;
}

function spkmodCheckOwnerJumpTrigger(instance, ctrl) {
	if (!ctrl) {
		instance._wasOwnerJumping = false;
		instance._lastOwnerJumpTime = 0;
		return false;
	}
	const jumpAct = ctrl.actions?.get?.("jump") || null;
	const isJumpingNow = !!(
		(ctrl.oneShotPlaying && ctrl.oneShotClip === "jump")
		|| (jumpAct && ctrl.activeAction === jumpAct)
	);
	const jumpTime = (jumpAct && isFinite(jumpAct.time))
		? jumpAct.time
		: (isJumpingNow && isFinite(ctrl.activeAction?.time) ? ctrl.activeAction.time : 0);

	let triggered = false;
	if (isJumpingNow && !instance._wasOwnerJumping) {
		triggered = true;
	} else if (isJumpingNow && instance._wasOwnerJumping && jumpTime < (instance._lastOwnerJumpTime || 0) - 0.12) {
		// Detect rapid back-to-back jump restarts (e.g. bunny-hop / Auto-Jump)
		triggered = true;
	}
	instance._wasOwnerJumping = isJumpingNow;
	instance._lastOwnerJumpTime = isJumpingNow ? jumpTime : 0;
	return triggered;
}

function spkmodDisposePetInstance(instance) {
	if (!instance || instance.disposed) return;
	instance.disposed = true;
	if (instance.monsterTempId) {
		_spkmodDetachedMonsterEntries.delete(instance.monsterTempId);
	}
	if (instance.monsterEntry?.visual?.dispose) {
		try { instance.monsterEntry.visual.dispose(); } catch (_) {}
	}
	if (instance.mixer) {
		try {
			instance.mixer.stopAllAction();
			if (typeof instance.mixer.uncacheRoot === "function" && typeof instance.mixer.getRoot === "function") {
				instance.mixer.uncacheRoot(instance.mixer.getRoot());
			}
		} catch (_) {}
		instance.mixer = null;
	}
	if (instance._ownsVisualResources && instance.modelHolder) {
		const disposedGeoms = new Set();
		const disposedMats = new Set();
		const disposedTex = new Set();
		try {
			instance.modelHolder.traverse(obj => {
				if (!obj || !obj.isMesh) return;
				if (obj.geometry && !disposedGeoms.has(obj.geometry)) {
					disposedGeoms.add(obj.geometry);
					obj.geometry.dispose?.();
				}
				const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
				for (const m of mats) {
					if (!m || disposedMats.has(m)) continue;
					disposedMats.add(m);
					if (m.map && !disposedTex.has(m.map)) {
						disposedTex.add(m.map);
						m.map.dispose?.();
					}
					m.dispose?.();
				}
			});
		} catch (_) {}
	}
	if (instance.kommyBlink) {
		try {
			instance.kommyBlink.awakeTex?.dispose?.();
			instance.kommyBlink.asleepTex?.dispose?.();
		} catch (_) {}
		instance.kommyBlink = null;
	}
	if (typeof gameState !== "undefined" && gameState?.chatBubbles?.remove) {
		try {
			gameState.chatBubbles.remove(["spkmod_pet_bubble_" + instance.ownerKey]);
		} catch (_) {}
	}
	if (instance.modelHolder && typeof instance.modelHolder.clear === "function") {
		try { instance.modelHolder.clear(); } catch (_) {}
	}
	if (instance.speechAnchor && typeof instance.speechAnchor.clear === "function") {
		try { instance.speechAnchor.clear(); } catch (_) {}
	}
	if (instance.root) {
		if (instance.root.parent) {
			instance.root.parent.remove(instance.root);
		}
		if (typeof gameState !== "undefined" && gameState?.scene && typeof gameState.scene.remove === "function") {
			gameState.scene.remove(instance.root);
		}
	}
}

function spkmodSweepScenePetRoots(exactNameOrPrefix, keepRoot = null, matchPrefix = false) {
	if (typeof gameState === "undefined" || !gameState?.scene?.children) return;
	const children = gameState.scene.children;
	for (let i = children.length - 1; i >= 0; i--) {
		const child = children[i];
		if (!child || child === keepRoot || typeof child.name !== "string") continue;
		const hit = matchPrefix ? child.name.startsWith(exactNameOrPrefix) : (child.name === exactNameOrPrefix);
		if (hit) {
			gameState.scene.remove(child);
		}
	}
}

async function spkmodCreatePetInstance(ownerKey, pet, isLocal, resolveContainerFn, resolveRemotePlayerFn) {
	const THREE = (window.THREE && window.THREE.Group && window.THREE.Mesh && window.THREE.BoxGeometry)
		? window.THREE
		: ((typeof spkmodEnsureThree === "function") ? await spkmodEnsureThree() : window.THREE);
	if (!THREE || !THREE.Group || typeof gameState === "undefined" || !gameState?.scene) return null;

	const root = new THREE.Group();
	root.name = "spkmod_pet_root_" + ownerKey;
	const modelHolder = new THREE.Group();
	modelHolder.name = "spkmod_pet_model_holder";
	const speechAnchor = new THREE.Group();
	speechAnchor.name = "spkmod_pet_speech_anchor";
	root.add(modelHolder, speechAnchor);

	const ownerContainer = resolveContainerFn?.();
	const initOwnerYaw = ownerContainer?.rotation ? (ownerContainer.rotation.y || 0) : 0;
	const initSide = Math.random() < 0.5 ? -1 : 1;
	const initSpawnAng = initOwnerYaw + initSide * (1.25 + Math.random() * 1.15);
	const initDist = (pet?.moveMode === "fly" ? 2.85 : 2.55) + Math.random() * 1.1;
	if (ownerContainer?.position) {
		root.position.set(
			ownerContainer.position.x + Math.sin(initSpawnAng) * initDist,
			ownerContainer.position.y,
			ownerContainer.position.z + Math.cos(initSpawnAng) * initDist
		);
	}
	gameState.scene.add(root);

	const now = performance.now();
	const instance = {
		ownerKey,
		pet,
		isLocal,
		resolveContainer: resolveContainerFn,
		resolveRemotePlayer: resolveRemotePlayerFn,
		root,
		modelHolder,
		speechAnchor,
		mixer: null,
		monsterEntry: null,
		monsterTempId: null,
		spinningParts: [],
		wheels: [],
		walkPhase: Math.random() * Math.PI * 2,
		idlePhase: Math.random() * Math.PI * 2,
		orbitAngle: Math.random() * Math.PI * 2,
		lastX: root.position.x,
		lastZ: root.position.z,
		lastOwnerX: ownerContainer?.position ? ownerContainer.position.x : root.position.x,
		lastOwnerZ: ownerContainer?.position ? ownerContainer.position.z : root.position.z,
		ownerMovingUntilMs: 0,
		ownerMoveYaw: initOwnerYaw,
		wanderTargetX: root.position.x,
		wanderTargetZ: root.position.z,
		hasWanderTarget: false,
		nextWanderAtMs: now + 2200 + Math.random() * 3200,
		wanderSpeedMps: 1.9,
		walkSide: initSide,
		followDistTarget: initDist,
		followDistCurrent: initDist,
		sideOffsetTarget: initSide * (0.5 + Math.random() * 0.8),
		sideOffsetCurrent: initSide * 0.65,
		nextWalkShiftAtMs: now + 4200 + Math.random() * 4800,
		hoverHeightTarget: 1.25 + Math.random() * 0.35,
		hoverHeightCurrent: 1.32,
		idleLookYaw: initOwnerYaw,
		nextIdleLookAtMs: now + 1800 + Math.random() * 3200,
		velX: 0,
		velZ: 0,
		nextTalkAtMs: now + 14000 + Math.random() * 22000,
		nextDanceFxAtMs: 0,
		forceDanceUntil: 0,
		forceFallDownUntil: 0,
		petJumpActive: false,
		petJumpElapsed: 0,
		petJumpDuration: 0.60,
		pendingJumpAtMs: 0,
		_wasOwnerJumping: false,
		_lastOwnerJumpTime: 0,
		_petFallDownActive: false,
		_petFallDownUsingNativeClip: false,
		fallDownBlend: 0,
		fallDownSide: Math.random() < 0.5 ? -1 : 1,
		disposed: false
	};

	spkmodInstantiatePetVisual(pet, instance);
	return instance;
}

// ============================================================================
// 7. 60 FPS PET FOLLOW, PORING BOUNCE, FLY, IDLE & DANCE ANIMATION LOOP
// ============================================================================
let _spkmodPetLoopLastMs = performance.now();

function spkmodNormalizeAngleDiff(targetYaw, currentYaw) {
	return ((targetYaw - currentYaw + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
}

function spkmodGetPetComfortRange(inst) {
	const isFlyer = inst?.pet?.moveMode === "fly";
	const visualH = Math.max(inst?.pet?.targetHeight || 0.65, inst?._peakVisualTopY || 0);
	const sizeExtra = visualH > 1.0 ? Math.min(0.70, (visualH - 1.0) * 0.55) : 0;
	const minR = (isFlyer ? 2.40 : 2.15) + sizeExtra;
	const maxR = (isFlyer ? 4.55 : 4.20) + sizeExtra;
	return { minR, maxR };
}

function spkmodPickIdleWanderPoint(inst, ownerPos, ownerYaw) {
	const { minR, maxR } = spkmodGetPetComfortRange(inst);
	const isFlyer = inst?.pet?.moveMode === "fly";
	const curX = inst.root.position.x;
	const curZ = inst.root.position.z;

	let bestX = ownerPos.x + minR;
	let bestZ = ownerPos.z;
	let bestScore = -1;

	for (let attempt = 0; attempt < 8; attempt++) {
		// Pick a relaxed spot anywhere around the owner, preferring direct straight-line strolls that don't cut through the owner
		const ang = Math.random() < 0.65
			? (ownerYaw + (Math.random() < 0.5 ? 1 : -1) * (0.75 + Math.random() * 1.95))
			: (Math.random() * Math.PI * 2);
		const r = minR + Math.random() * (maxR - minR);
		const cx = ownerPos.x + Math.sin(ang) * r;
		const cz = ownerPos.z + Math.cos(ang) * r;
		const moveDist = Math.hypot(cx - curX, cz - curZ);

		// Check closest distance from the straight path (cur -> candidate) to the owner's position
		const segX = cx - curX;
		const segZ = cz - curZ;
		const segLenSq = segX * segX + segZ * segZ || 1;
		const tProj = Math.max(0, Math.min(1, ((ownerPos.x - curX) * segX + (ownerPos.z - curZ) * segZ) / segLenSq));
		const closestX = curX + segX * tProj;
		const closestZ = curZ + segZ * tProj;
		const pathClearance = Math.hypot(closestX - ownerPos.x, closestZ - ownerPos.z);

		let score = (moveDist >= 1.1 && moveDist <= 3.6) ? 10 : Math.min(moveDist, 6);
		if (pathClearance >= 1.35) score += 8;
		else if (pathClearance < 0.9) score -= 6;
		score += Math.random() * 1.5;

		if (score > bestScore) {
			bestScore = score;
			bestX = cx;
			bestZ = cz;
		}
	}

	inst.wanderTargetX = bestX;
	inst.wanderTargetZ = bestZ;
	inst.hasWanderTarget = true;
	inst.wanderSpeedMps = isFlyer
		? (1.75 + Math.random() * 0.95)
		: (1.55 + Math.random() * 0.85);
	if (isFlyer) {
		inst.hoverHeightTarget = 1.18 + Math.random() * 0.58;
	}
}

function spkmodUpdateSinglePetInstance(inst, dt, nowMs) {
	if (!inst || inst.disposed || !inst.root) return;
	if (typeof gameState === "undefined" || !gameState?.scene) return;

	if (inst.root.parent !== gameState.scene) {
		gameState.scene.add(inst.root);
	}

	const ownerContainer = inst.resolveContainer?.();
	if (!ownerContainer || !ownerContainer.position) {
		inst.root.visible = false;
		return;
	}

	// Hide remote pets if setting is off, owner is hidden, or owner is > 28m away (distance culling)
	let remoteAnimThrottleSec = 0;
	if (!inst.isLocal) {
		if (!window.spkmodPetSettings.showRemotePets || ownerContainer.visible === false) {
			inst.root.visible = false;
			return;
		}
		const myPos = gameState?.playerContainer?.position;
		if (myPos) {
			const distToMe = Math.hypot(ownerContainer.position.x - myPos.x, ownerContainer.position.z - myPos.z);
			if (distToMe > 28) {
				inst.root.visible = false;
				return;
			}
			if (distToMe > 12) {
				remoteAnimThrottleSec = 0.05; // ~20 FPS skeletal animation LOD for distant remote pets
			}
		}
	}
	inst.root.visible = true;

	const ownerPos = ownerContainer.position;
	const ownerYaw = ownerContainer.rotation ? (ownerContainer.rotation.y || 0) : 0;
	const ownerCtrl = spkmodGetOwnerAnimController(inst);
	const isFallenDown = spkmodIsOwnerFallenDown(inst);
	const isDancing = !isFallenDown && spkmodIsOwnerDancing(inst);
	const isFlyer = inst.pet.moveMode === "fly";
	const { minR, maxR } = spkmodGetPetComfortRange(inst);

	// Detect owner jump (Spacebar, Jump emote, Auto-Jump, or remote player jump)
	if (!isFallenDown && spkmodCheckOwnerJumpTrigger(inst, ownerCtrl)) {
		inst.pendingJumpAtMs = nowMs + 55 + Math.random() * 55;
	}
	if (isFallenDown) {
		inst.pendingJumpAtMs = 0;
		inst.petJumpActive = false;
	} else if (inst.pendingJumpAtMs > 0 && nowMs >= inst.pendingJumpAtMs) {
		inst.pendingJumpAtMs = 0;
		inst.petJumpActive = true;
		inst.petJumpElapsed = 0;
		inst.petJumpDuration = isFlyer ? 0.58 : 0.62;
		inst.fallDownBlend = 0;
	}

	// Sync pet lie-down / play-dead transition with owner fallDown / death state
	if (isFallenDown !== !!inst._petFallDownActive) {
		inst._petFallDownActive = isFallenDown;
		const monsterCtrl = inst.monsterEntry?.visual?.animationController;
		if (isFallenDown) {
			inst.fallDownSide = Math.random() < 0.5 ? -1 : 1;
			let usedNativeClip = false;
			if (monsterCtrl && typeof monsterCtrl.playFallDownEmote === "function") {
				try {
					usedNativeClip = !!monsterCtrl.playFallDownEmote();
				} catch (_) {}
			} else if (inst.fallAction) {
				usedNativeClip = true;
			}
			inst._petFallDownUsingNativeClip = usedNativeClip;
		} else {
			if (inst._petFallDownUsingNativeClip && monsterCtrl && typeof monsterCtrl.exitFallDown === "function") {
				try { monsterCtrl.exitFallDown(); } catch (_) {}
			}
			inst._petFallDownUsingNativeClip = false;
		}
	}

	inst.fallDownBlend = isFallenDown
		? Math.min(1, (inst.fallDownBlend || 0) + dt * 3.4)
		: Math.max(0, (inst.fallDownBlend || 0) - dt * 4.2);

	inst.idlePhase += dt * 3.4;
	inst.orbitAngle += dt * (isDancing ? 3.8 : 0.72);

	// Track whether the owner is walking/running vs standing idle
	const ownerDx = ownerPos.x - (inst.lastOwnerX ?? ownerPos.x);
	const ownerDz = ownerPos.z - (inst.lastOwnerZ ?? ownerPos.z);
	const ownerFrameMove = Math.hypot(ownerDx, ownerDz);
	const ownerSpeedMps = dt > 0 ? ownerFrameMove / dt : 0;
	if (ownerFrameMove > 0.008 && ownerSpeedMps > 0.35 && ownerFrameMove < 12) {
		inst.ownerMovingUntilMs = nowMs + 480;
		const travelYaw = Math.atan2(ownerDx, ownerDz);
		inst.ownerMoveYaw += spkmodNormalizeAngleDiff(travelYaw, inst.ownerMoveYaw) * Math.min(1, dt * 8);
	}
	inst.lastOwnerX = ownerPos.x;
	inst.lastOwnerZ = ownerPos.z;
	const ownerIsMoving = nowMs < (inst.ownerMovingUntilMs || 0);

	// Compute organic target world X/Z & desired travel speed
	let targetX = inst.root.position.x;
	let targetZ = inst.root.position.z;
	let desiredMaxSpeed = 3.6;
	let stopThreshold = 0.12;

	const distPetToOwner = Math.hypot(inst.root.position.x - ownerPos.x, inst.root.position.z - ownerPos.z);

	if (distPetToOwner > 22) {
		// Owner warped/teleported far away -> snap to a natural side spot near owner
		const snapAng = ownerYaw + (inst.walkSide || 1) * 1.65;
		const snapDist = minR + (maxR - minR) * 0.4;
		targetX = ownerPos.x + Math.sin(snapAng) * snapDist;
		targetZ = ownerPos.z + Math.cos(snapAng) * snapDist;
		inst.root.position.set(targetX, ownerPos.y, targetZ);
		inst.lastX = targetX;
		inst.lastZ = targetZ;
		inst.velX = 0;
		inst.velZ = 0;
		inst.hasWanderTarget = false;
		inst.nextWanderAtMs = nowMs + 2200 + Math.random() * 2800;
	} else if (isFallenDown) {
		// Lie still peacefully right where the pet is while owner is fallen down
		inst.hasWanderTarget = false;
		targetX = inst.root.position.x;
		targetZ = inst.root.position.z;
		stopThreshold = 0.05;
	} else if (isDancing) {
		inst.hasWanderTarget = false;
		const danceRadius = Math.max(1.85, minR - 0.15) + Math.sin(inst.idlePhase * 0.7) * 0.18;
		targetX = ownerPos.x + Math.cos(inst.orbitAngle) * danceRadius;
		targetZ = ownerPos.z + Math.sin(inst.orbitAngle) * danceRadius;
		desiredMaxSpeed = 8.5;
		stopThreshold = 0.08;
	} else if (ownerIsMoving) {
		// Owner is walking/running -> natural world-space leash pursuit (straight chords, no circular boom-arm)
		if (inst.hasWanderTarget) {
			inst.hasWanderTarget = false;
		}
		inst.nextWanderAtMs = nowMs + 1800 + Math.random() * 2600;

		if (nowMs >= (inst.nextWalkShiftAtMs || 0)) {
			inst.nextWalkShiftAtMs = nowMs + 4200 + Math.random() * 4800;
			if (Math.random() < 0.35) {
				inst.walkSide = -(inst.walkSide || 1);
			}
			inst.followDistTarget = minR + 0.15 + Math.random() * Math.max(0.5, maxR - minR - 0.3);
			inst.sideOffsetTarget = (inst.walkSide || 1) * (0.45 + Math.random() * 0.95);
			if (isFlyer) {
				inst.hoverHeightTarget = 1.20 + Math.random() * 0.55;
			}
		}

		const blendRate = Math.min(1, dt * 1.4);
		inst.followDistCurrent = (isFinite(inst.followDistCurrent) ? inst.followDistCurrent : (minR + 0.6))
			+ ((isFinite(inst.followDistTarget) ? inst.followDistTarget : (minR + 0.6)) - (isFinite(inst.followDistCurrent) ? inst.followDistCurrent : (minR + 0.6))) * blendRate;
		inst.sideOffsetCurrent = (isFinite(inst.sideOffsetCurrent) ? inst.sideOffsetCurrent : 0.6)
			+ ((isFinite(inst.sideOffsetTarget) ? inst.sideOffsetTarget : 0.6) - (isFinite(inst.sideOffsetCurrent) ? inst.sideOffsetCurrent : 0.6)) * blendRate;

		const desiredDist = Math.max(minR, Math.min(maxR, inst.followDistCurrent));
		const heading = isFinite(inst.ownerMoveYaw) ? inst.ownerMoveYaw : ownerYaw;
		const moveDirX = Math.sin(heading);
		const moveDirZ = Math.cos(heading);
		const rightX = moveDirZ;
		const rightZ = -moveDirX;

		const stopR = Math.max(minR, desiredDist * 0.84);
		const fullPaceR = desiredDist * 1.06;

		if (distPetToOwner < minR * 0.72) {
			// Owner walked right into pet's personal space -> calmly step aside to comfort range
			const awayX = distPetToOwner > 0.05 ? (inst.root.position.x - ownerPos.x) / distPetToOwner : rightX * (inst.walkSide || 1);
			const awayZ = distPetToOwner > 0.05 ? (inst.root.position.z - ownerPos.z) / distPetToOwner : rightZ * (inst.walkSide || 1);
			targetX = ownerPos.x + awayX * (minR + 0.35) + rightX * (inst.sideOffsetCurrent * 0.35);
			targetZ = ownerPos.z + awayZ * (minR + 0.35) + rightZ * (inst.sideOffsetCurrent * 0.35);
			desiredMaxSpeed = Math.max(2.6, ownerSpeedMps * 0.95);
			stopThreshold = 0.2;
		} else if (distPetToOwner > stopR) {
			// Smooth continuous world-space leash pursuit (no binary stop/start chatter, no circular arc)
			const awayX = (inst.root.position.x - ownerPos.x) / distPetToOwner;
			const awayZ = (inst.root.position.z - ownerPos.z) / distPetToOwner;
			// Small lateral lane bias only when trailing roughly behind owner so it glides gently to a side
			const trailingDot = -(awayX * moveDirX + awayZ * moveDirZ);
			const lateralFactor = Math.max(0, trailingDot) * 0.35;
			let goalX = ownerPos.x + awayX * stopR + rightX * (inst.sideOffsetCurrent * lateralFactor);
			let goalZ = ownerPos.z + awayZ * stopR + rightZ * (inst.sideOffsetCurrent * lateralFactor);
			const gx = goalX - ownerPos.x;
			const gz = goalZ - ownerPos.z;
			const gDist = Math.hypot(gx, gz);
			if (gDist > 0.01 && gDist < minR) {
				goalX = ownerPos.x + (gx / gDist) * minR;
				goalZ = ownerPos.z + (gz / gDist) * minR;
			}
			targetX = goalX;
			targetZ = goalZ;
			const ramp = Math.min(1, (distPetToOwner - stopR) / Math.max(0.35, fullPaceR - stopR));
			const excess = Math.max(0, distPetToOwner - fullPaceR);
			desiredMaxSpeed = Math.min(12.0, ownerSpeedMps * (0.2 + 0.85 * ramp) + excess * 1.6);
			stopThreshold = 0.15;
		} else {
			// Already comfortably within range -> hold/coast naturally instead of orbiting when owner turns
			targetX = inst.root.position.x;
			targetZ = inst.root.position.z;
			stopThreshold = 0.2;
		}
	} else {
		// Owner is standing idle -> pet stays nearby, pauses, looks around, and autonomously wanders in [minR, maxR]
		if (inst.hasWanderTarget) {
			const targetDistFromOwner = Math.hypot(inst.wanderTargetX - ownerPos.x, inst.wanderTargetZ - ownerPos.z);
			if (targetDistFromOwner > maxR + 0.65 || targetDistFromOwner < minR * 0.72) {
				spkmodPickIdleWanderPoint(inst, ownerPos, ownerYaw);
			}
		} else {
			if (distPetToOwner < minR * 0.82 || distPetToOwner > maxR + 0.45) {
				// Step out of personal space or trot back if somehow out of range
				spkmodPickIdleWanderPoint(inst, ownerPos, ownerYaw);
				if (distPetToOwner > maxR + 1.2) {
					inst.wanderSpeedMps = Math.min(6.5, 2.6 + (distPetToOwner - maxR) * 1.2);
				}
			} else if (nowMs >= (inst.nextWanderAtMs || 0)) {
				spkmodPickIdleWanderPoint(inst, ownerPos, ownerYaw);
			}
		}

		if (inst.hasWanderTarget) {
			targetX = inst.wanderTargetX;
			targetZ = inst.wanderTargetZ;
			const remain = Math.hypot(targetX - inst.root.position.x, targetZ - inst.root.position.z);
			if (remain <= 0.14) {
				inst.hasWanderTarget = false;
				inst.nextWanderAtMs = nowMs + 2800 + Math.random() * 4400;
				inst.nextIdleLookAtMs = nowMs + 600 + Math.random() * 1400;
				targetX = inst.root.position.x;
				targetZ = inst.root.position.z;
			} else {
				// Gentle ease-out as pet approaches its idle wander spot
				const ease = remain < 0.85 ? Math.max(0.35, remain / 0.85) : 1.0;
				desiredMaxSpeed = (inst.wanderSpeedMps || 1.9) * ease;
				stopThreshold = 0.12;
			}
		} else {
			// Resting in place -> occasionally pick a curious gaze direction
			if (nowMs >= (inst.nextIdleLookAtMs || 0)) {
				inst.nextIdleLookAtMs = nowMs + 2200 + Math.random() * 3200;
				const roll = Math.random();
				if (roll < 0.42) {
					// Glance fondly at owner
					inst.idleLookYaw = Math.atan2(ownerPos.x - inst.root.position.x, ownerPos.z - inst.root.position.z);
				} else if (roll < 0.72) {
					// Look roughly the same way as owner
					inst.idleLookYaw = ownerYaw + (Math.random() - 0.5) * 0.9;
				} else {
					// Curious glance around the environment
					inst.idleLookYaw = inst.modelHolder.rotation.y + (Math.random() - 0.5) * 2.4;
				}
			}
		}
	}

	// Compute desired velocity with gentle personal-space skirting around the owner
	const dx = targetX - inst.root.position.x;
	const dz = targetZ - inst.root.position.z;
	const distToTarget = Math.hypot(dx, dz);

	let desVelX = 0;
	let desVelZ = 0;
	if (distToTarget > stopThreshold) {
		let dirX = dx / distToTarget;
		let dirZ = dz / distToTarget;

		// Only gently nudge outward if path gets right up against the owner's body (< 1.15m)
		if (!isDancing && distPetToOwner > 0.05 && distPetToOwner < 1.15) {
			const toOwnerX = (ownerPos.x - inst.root.position.x) / distPetToOwner;
			const toOwnerZ = (ownerPos.z - inst.root.position.z) / distPetToOwner;
			const approachDot = dirX * toOwnerX + dirZ * toOwnerZ;
			if (approachDot > 0.25) {
				const cross = toOwnerX * dirZ - toOwnerZ * dirX;
				const sideSign = cross >= 0 ? 1 : -1;
				const tangX = -toOwnerZ * sideSign;
				const tangZ = toOwnerX * sideSign;
				const pushOut = (1.15 - distPetToOwner) / 1.15;
				dirX = dirX * 0.45 + tangX * 0.35 - toOwnerX * (0.75 * pushOut);
				dirZ = dirZ * 0.45 + tangZ * 0.35 - toOwnerZ * (0.75 * pushOut);
				const dLen = Math.hypot(dirX, dirZ) || 1;
				dirX /= dLen;
				dirZ /= dLen;
			}
		}

		const spd = Math.min(desiredMaxSpeed, distToTarget / Math.max(dt, 0.016));
		desVelX = dirX * spd;
		desVelZ = dirZ * spd;
	}

	// Smooth velocity damping for natural starts, stops, and turns
	const damp = 1 - Math.exp(-dt * (isDancing ? 14.0 : 8.5));
	inst.velX = (inst.velX || 0) + (desVelX - (inst.velX || 0)) * damp;
	inst.velZ = (inst.velZ || 0) + (desVelZ - (inst.velZ || 0)) * damp;
	if (Math.hypot(inst.velX, inst.velZ) < 0.02 && distToTarget <= stopThreshold) {
		inst.velX = 0;
		inst.velZ = 0;
	}
	inst.root.position.x += inst.velX * dt;
	inst.root.position.z += inst.velZ * dt;

	const frameMoved = Math.hypot(inst.root.position.x - inst.lastX, inst.root.position.z - inst.lastZ);
	const moveSpeedMps = dt > 0 ? frameMoved / dt : 0;
	const isMoving = moveSpeedMps > 0.22;

	// Spin wheels if vehicle pet
	if (inst.wheels && inst.wheels.length > 0 && frameMoved > 0.0005) {
		const wheelAngle = frameMoved / 0.14;
		for (const w of inst.wheels) {
			w.rotation.x += wheelAngle;
		}
	}

	// Spin propellers / rotors / turrets (power down gently while lying down)
	if (inst.spinningParts && inst.spinningParts.length > 0) {
		const spinFactor = 1 - (inst.fallDownBlend || 0) * 0.92;
		for (const sp of inst.spinningParts) {
			sp.rotation.y += dt * 14.0 * spinFactor;
		}
	}

	// Smooth yaw facing
	if ((inst.fallDownBlend || 0) > 0.25) {
		// Keep fallen pet lying steadily without spinning on the floor
	} else if (isDancing) {
		inst.modelHolder.rotation.y += dt * 7.2;
	} else if (isMoving && frameMoved > 0.002) {
		const desiredYaw = Math.atan2(inst.root.position.x - inst.lastX, inst.root.position.z - inst.lastZ);
		const diff = spkmodNormalizeAngleDiff(desiredYaw, inst.modelHolder.rotation.y);
		inst.modelHolder.rotation.y += diff * Math.min(1, dt * 8.5);
	} else {
		// Curiously look toward idle gaze target (owner, ahead, or surroundings)
		const targetLookYaw = isFinite(inst.idleLookYaw) ? inst.idleLookYaw : ownerYaw;
		const diff = spkmodNormalizeAngleDiff(targetLookYaw, inst.modelHolder.rotation.y);
		inst.modelHolder.rotation.y += diff * Math.min(1, dt * 3.6);
	}

	// Ground height + Vertical Bounce / Hover / Jump / FallDown / Idle Bop / Dance Jump
	const baseY = ownerPos.y;
	if (Math.abs(inst.root.position.y - baseY) > 4) {
		inst.root.position.y = baseY;
	} else {
		inst.root.position.y += (baseY - inst.root.position.y) * Math.min(1, dt * 12);
	}

	let poseY = 0;
	let poseSX = 1, poseSY = 1, poseSZ = 1;
	let poseRotX = inst.modelHolder.rotation.x;
	let poseRotZ = inst.modelHolder.rotation.z;

	if (isDancing) {
		inst.walkPhase += dt * 11.0;
		const jumpWave = Math.abs(Math.sin(inst.walkPhase));
		const baseHover = isFlyer ? 1.15 : 0;
		poseY = baseHover + jumpWave * 0.46;
		const squash = Math.cos(inst.walkPhase * 2) * 0.15;
		poseSX = 1 + squash;
		poseSY = 1 - squash * 1.2;
		poseSZ = 1 + squash;
		poseRotZ = Math.sin(inst.walkPhase) * 0.24;
		poseRotX = Math.cos(inst.walkPhase * 0.5) * 0.14;

		if (nowMs >= inst.nextDanceFxAtMs && gameState?.skillParticles) {
			inst.nextDanceFxAtMs = nowMs + 750;
			try {
				gameState.skillParticles.emit({
					count: 6,
					texture: "star4",
					color: "#ffd700",
					axis: "up",
					coneAngleDeg: 55,
					speedMinMps: 0.8,
					speedMaxMps: 2.0,
					gravityMps2: 2.2,
					sizeM: 0.22,
					lifeSecMin: 0.35,
					lifeSecMax: 0.7,
					spawnJitterSec: 0.02
				}, inst.root.position);
			} catch (_) {}
		}
	} else if (isFlyer) {
		const targetHover = isFinite(inst.hoverHeightTarget) ? inst.hoverHeightTarget : 1.32;
		inst.hoverHeightCurrent = (isFinite(inst.hoverHeightCurrent) ? inst.hoverHeightCurrent : 1.32)
			+ (targetHover - (isFinite(inst.hoverHeightCurrent) ? inst.hoverHeightCurrent : 1.32)) * Math.min(1, dt * 1.6);
		const hoverBob = Math.sin(inst.idlePhase * 1.15) * 0.13;
		poseY = inst.hoverHeightCurrent + hoverBob;
		const breathe = 1 + Math.sin(inst.idlePhase) * 0.03;
		poseSX = breathe;
		poseSY = breathe;
		poseSZ = breathe;
		const targetPitch = isMoving ? Math.min(0.24, moveSpeedMps * 0.04) : Math.sin(inst.idlePhase * 0.7) * 0.04;
		poseRotX = inst.modelHolder.rotation.x + (targetPitch - inst.modelHolder.rotation.x) * Math.min(1, dt * 8);
		poseRotZ = Math.cos(inst.idlePhase * 0.8) * 0.06;
	} else if (isMoving) {
		// Poring-style walking bounce!
		inst.walkPhase += dt * Math.min(13.5, Math.max(7.2, moveSpeedMps * 2.15));
		const hop = Math.abs(Math.sin(inst.walkPhase));
		poseY = hop * Math.min(0.34, 0.18 + moveSpeedMps * 0.045);
		const squash = Math.cos(inst.walkPhase * 2) * 0.13;
		poseSX = 1 + squash;
		poseSY = 1 - squash * 1.25;
		poseSZ = 1 + squash;
		poseRotX = Math.sin(inst.walkPhase) * 0.12;
		poseRotZ = 0;
	} else {
		// Gentle Poring idle bounce / bop
		const bop = Math.max(0, Math.sin(inst.idlePhase)) * 0.075;
		const squash = Math.sin(inst.idlePhase) * 0.045;
		poseY = bop;
		poseSX = 1 - squash * 0.6;
		poseSY = 1 + squash;
		poseSZ = 1 - squash * 0.6;
		poseRotX = inst.modelHolder.rotation.x * 0.85;
		poseRotZ = Math.sin(inst.idlePhase * 0.5) * 0.03;
	}

	// Overlay joyful parabolic Jump arc (mimicking owner jump!)
	if (inst.petJumpActive) {
		inst.petJumpElapsed = (inst.petJumpElapsed || 0) + dt;
		const dur = inst.petJumpDuration || 0.60;
		if (inst.petJumpElapsed >= dur) {
			inst.petJumpActive = false;
		} else {
			const p = inst.petJumpElapsed / dur;
			const arc = 4 * p * (1 - p); // Smooth 0 -> 1 -> 0 parabola
			if (isFlyer) {
				const baseH = isFinite(inst.hoverHeightCurrent) ? inst.hoverHeightCurrent : 1.32;
				poseY = baseH + arc * 0.68;
				const stretch = arc * 0.08;
				poseSX = 1 - stretch * 0.5;
				poseSY = 1 + stretch;
				poseSZ = 1 - stretch * 0.5;
				poseRotX = -arc * 0.26;
				poseRotZ = Math.sin(p * Math.PI * 2) * 0.24;
			} else {
				poseY = arc * 0.92;
				let stretchY = 0;
				if (p < 0.15) {
					stretchY = -0.18 * Math.sin((p / 0.15) * Math.PI);
				} else if (p > 0.84) {
					stretchY = -0.20 * Math.sin(((p - 0.84) / 0.16) * Math.PI);
				} else {
					stretchY = 0.16 * arc;
				}
				poseSX = 1 - stretchY * 0.55;
				poseSY = 1 + stretchY;
				poseSZ = 1 - stretchY * 0.55;
				poseRotX = (0.5 - p) * 0.34 * arc;
				poseRotZ = 0;
			}
		}
	}

	// Overlay Lie Down / Play Dead pose (smoothly eases down and back up)
	if ((inst.fallDownBlend || 0) > 0.001) {
		const b = inst.fallDownBlend;
		const ease = 1 - Math.pow(1 - b, 3);
		const sleepyBreathe = Math.sin(inst.idlePhase * 0.45) * 0.025 * ease;
		if (inst._petFallDownUsingNativeClip) {
			// Native skeletal death/slump clip handles the flop; descend flyers smoothly onto the floor
			poseY = poseY * (1 - ease) + 0.02 * ease;
			poseRotX = poseRotX * (1 - ease);
			poseRotZ = poseRotZ * (1 - ease);
			poseSX = poseSX * (1 - ease) + (1 + sleepyBreathe) * ease;
			poseSY = poseSY * (1 - ease) + (1 - sleepyBreathe) * ease;
			poseSZ = poseSZ * (1 - ease) + (1 + sleepyBreathe) * ease;
		} else {
			// Procedural dramatic side-flop resting flush on the ground
			const fallFloorY = Math.max(0.14, Math.min(0.32, (inst.pet?.targetHeight || 0.65) * 0.34));
			const settleBounce = b > 0.78 ? Math.sin(((b - 0.78) / 0.22) * Math.PI) * 0.05 : 0;
			const targetRoll = (inst.fallDownSide || 1) * (Math.PI * 0.47);
			poseY = poseY * (1 - ease) + (fallFloorY + settleBounce) * ease;
			poseRotX = poseRotX * (1 - ease);
			poseRotZ = poseRotZ * (1 - ease) + targetRoll * ease;
			poseSX = poseSX * (1 - ease) + (1 + sleepyBreathe) * ease;
			poseSY = poseSY * (1 - ease) + (1 - sleepyBreathe) * ease;
			poseSZ = poseSZ * (1 - ease) + (1 + sleepyBreathe) * ease;
		}
	}

	inst.modelHolder.position.y = poseY;
	inst.modelHolder.scale.set(poseSX, poseSY, poseSZ);
	inst.modelHolder.rotation.x = poseRotX;
	inst.modelHolder.rotation.z = poseRotZ;

	// Keep speech bubble anchor synced with pet vertical hover/bounce height
	if (inst.speechAnchor) {
		inst.speechAnchor.position.y = inst.modelHolder.position.y;
	}

	// Update native monster visual or GLTF/FBX AnimationMixer (with LOD throttling for distant remote pets)
	let animStepDt = dt;
	let shouldStepAnim = true;
	if (remoteAnimThrottleSec > 0) {
		inst._animAccumDt = (inst._animAccumDt || 0) + dt;
		if (inst._animAccumDt >= remoteAnimThrottleSec) {
			animStepDt = inst._animAccumDt;
			inst._animAccumDt = 0;
		} else {
			shouldStepAnim = false;
		}
	}

	if (inst.monsterEntry && inst.monsterEntry.visual) {
		try {
			const curVisual = inst.monsterEntry.visual;
			const mCtrl = curVisual.animationController;
			// Only sanitize & measure ONCE per visual (and on async upgradeToSkinned swap) instead of traversing every frame!
			if (inst._sanitizedMonsterVisual !== curVisual) {
				inst._sanitizedMonsterVisual = curVisual;
				inst._lastMeasuredMonsterVisual = curVisual;
				inst._lastMonsterLoco = null;
				inst._peakVisualTopY = 0;
				inst._cachedVisualTopY = 0;
				spkmodDisableRaycastAndSanitize(inst.monsterEntry.container, true);
				if (isFallenDown && mCtrl && typeof mCtrl.playFallDownEmote === "function") {
					inst._petFallDownUsingNativeClip = !!mCtrl.playFallDownEmote();
				}
				spkmodRepositionPetBubbleIfActive(inst);
			}
			if (!isFallenDown && mCtrl && typeof mCtrl.setLocomotion === "function") {
				const wantLoco = !!(isMoving || isDancing);
				if (inst._lastMonsterLoco !== wantLoco) {
					inst._lastMonsterLoco = wantLoco;
					mCtrl.setLocomotion(wantLoco);
				}
			}
			if (shouldStepAnim) {
				curVisual.update?.(animStepDt);
			}
		} catch (_) {}
	}
	if (inst.mixer) {
		try {
			let desiredAction = null;
			if (isFallenDown && inst.fallAction) {
				desiredAction = inst.fallAction;
			} else if (inst.idleAction && inst.walkAction) {
				desiredAction = (isMoving || isDancing) ? inst.walkAction : inst.idleAction;
			} else if (inst.idleAction) {
				desiredAction = inst.idleAction;
			}
			if (desiredAction && inst.activeGlbAction !== desiredAction) {
				desiredAction.reset().play();
				if (inst.activeGlbAction) {
					inst.activeGlbAction.crossFadeTo(desiredAction, 0.18, false);
				}
				inst.activeGlbAction = desiredAction;
			}
			if (shouldStepAnim) {
				inst.mixer.update(animStepDt);
			}
		} catch (_) {}
	}
	if (inst.kommyBlink && nowMs >= inst.kommyBlink.nextToggleMs) {
		const kb = inst.kommyBlink;
		kb.mat.map = (kb.mat.map === kb.asleepTex) ? kb.awakeTex : kb.asleepTex;
		kb.mat.needsUpdate = true;
		kb.nextToggleMs = nowMs + 8000 + Math.random() * 4000;
	}

	inst.lastX = inst.root.position.x;
	inst.lastZ = inst.root.position.z;

	// Periodic random speech bubbles & noises
	if (nowMs >= inst.nextTalkAtMs) {
		inst.nextTalkAtMs = nowMs + 26000 + Math.random() * 34000;
		if (window.spkmodPetSettings.speechBubbles) {
			spkmodShowPetSpeechBubble(inst);
		}
		spkmodPlayPetSfx(inst.pet, inst.isLocal, inst.root.position);
	}
}

// ============================================================================
// 8. IN-GAME CHAT TRIGGER SYNC (:pet_<id>:) & CHAT-SAFE QUEUED BROADCAST
// ============================================================================
const SPKMOD_PET_CHAT_MIN_GAP_MS = 1600;           // Hard minimum gap (> 1s server chat CD + jitter) between :pet_...: packets
const SPKMOD_PET_CHAT_EQUIP_DEBOUNCE_MS = 1100;    // Coalesce rapid equip/unequip clicks into 1 broadcast
const SPKMOD_PET_CHAT_AFTER_USER_MSG_MS = 2200;    // Quiet window after player sends a message (clears 1s server CD + buffer)
const SPKMOD_PET_CHAT_AFTER_BURST_MSG_MS = 4500;   // Extended quiet window during active multi-message chat bursts
const SPKMOD_PET_CHAT_BURST_WINDOW_MS = 10000;     // Sliding window for detecting active conversation bursts
const SPKMOD_PET_CHAT_AFTER_TYPING_MS = 2000;      // Quiet window after typing in chat input
const SPKMOD_PET_CHAT_PASSIVE_INTERVAL_MS = 20000; // Minimum gap for passive remote-player-join resyncs
const SPKMOD_PET_CHAT_RECHECK_MS = 600;            // Poll interval while user is actively typing or loading zone

let _spkmodLastBroadcastAtMs = 0;
let _spkmodLastBroadcastPetId = null;
let _spkmodLastBroadcastZoneId = null;
let _spkmodLastObservedZoneId = null;
let _spkmodLastObservedRemoteCount = 0;
let _spkmodAutoRestoringPet = false;
let _spkmodNeedsZoneSync = false;

function spkmodIsInIsolatedMinigame() {
	if (typeof gameState === "undefined" || !gameState) return false;
	try {
		if (gameState.miningHost?.isActive?.()) return true;
		if (gameState.speakovHost?.isActive?.()) return true;
	} catch (_) {}
	return false;
}

function spkmodGetRemotePlayerCount() {
	return (typeof gameState !== "undefined" && gameState?.remotePlayers?.remotePlayers?.size) || 0;
}

let _spkmodQueuedPetBroadcast = null; // { petId, priority, earliestAtMs, forceResend, reason }
let _spkmodPendingBroadcastTimer = null;

let _spkmodLastUserChatSentMs = window.__spkmodLastPlayerChatSentMs || 0;
let _spkmodRecentUserChatSentTimes = [];
let _spkmodLastUserChatTypingMs = 0;
let _spkmodChatRejectBackoffUntilMs = 0;
let _spkmodChatRejectStrikeCount = 0;
let _spkmodChatMinLevelGate = 0;

function spkmodGetChatInputElement() {
	if (typeof gameState !== "undefined" && gameState?.chatBox?.inputEl) {
		return gameState.chatBox.inputEl;
	}
	return document.querySelector(".sr-chatbox__input, .sr-chatbox input, input[placeholder*='chat']");
}

function spkmodIsUserTypingInChat() {
	try {
		if (typeof gameState !== "undefined" && gameState?.chatBox?.isTouchExpanded === true) {
			return true;
		}
		const inputEl = spkmodGetChatInputElement();
		if (inputEl) {
			if (document.activeElement === inputEl) return true;
			if (typeof inputEl.value === "string" && inputEl.value.trim().length > 0) return true;
		}
		const active = document.activeElement;
		if (active && active.closest && active.closest(".sr-chatbox")) {
			return true;
		}
	} catch (_) {}
	return false;
}

function spkmodPruneRecentUserChatTimes(now) {
	if (_spkmodRecentUserChatSentTimes.length === 0) return;
	const cutoff = now - SPKMOD_PET_CHAT_BURST_WINDOW_MS;
	while (_spkmodRecentUserChatSentTimes.length > 0 && _spkmodRecentUserChatSentTimes[0] < cutoff) {
		_spkmodRecentUserChatSentTimes.shift();
	}
}

function spkmodComputePetBroadcastWaitMs(now, entry) {
	if (!spkmodIsPetChatSharingEnabled()) {
		return Infinity;
	}
	if (typeof gameState === "undefined" || !gameState || typeof gameState.trySendChat !== "function" || gameState.zoneId == null) {
		return SPKMOD_PET_CHAT_RECHECK_MS;
	}
	if (_spkmodChatMinLevelGate > 0 && spkmodGetPlayerLevel() < _spkmodChatMinLevelGate) {
		return Infinity;
	}
	// Never send hidden :pet_...: chat packets inside Mining/Speakov minigames or when alone in a zone
	if (spkmodIsInIsolatedMinigame() || spkmodGetRemotePlayerCount() === 0) {
		if (window.spkmodPetSettings.equippedId) _spkmodNeedsZoneSync = true;
		return Infinity;
	}

	let waitMs = 0;

	if (entry && entry.earliestAtMs > now) {
		waitMs = Math.max(waitMs, entry.earliestAtMs - now);
	}
	if (_spkmodChatRejectBackoffUntilMs > now) {
		waitMs = Math.max(waitMs, _spkmodChatRejectBackoffUntilMs - now);
	}
	if (spkmodIsUserTypingInChat()) {
		waitMs = Math.max(waitMs, SPKMOD_PET_CHAT_RECHECK_MS);
	}
	if (_spkmodLastUserChatTypingMs > 0) {
		const typingClearAt = _spkmodLastUserChatTypingMs + SPKMOD_PET_CHAT_AFTER_TYPING_MS;
		if (typingClearAt > now) {
			waitMs = Math.max(waitMs, typingClearAt - now);
		}
	}

	spkmodPruneRecentUserChatTimes(now);
	const lastSent = Math.max(_spkmodLastUserChatSentMs, window.__spkmodLastPlayerChatSentMs || 0);
	if (lastSent > 0) {
		const quietWindow = _spkmodRecentUserChatSentTimes.length >= 2
			? SPKMOD_PET_CHAT_AFTER_BURST_MSG_MS
			: SPKMOD_PET_CHAT_AFTER_USER_MSG_MS;
		const sendClearAt = lastSent + quietWindow;
		if (sendClearAt > now) {
			waitMs = Math.max(waitMs, sendClearAt - now);
		}
	}

	if (_spkmodLastBroadcastAtMs > 0) {
		const isRemoteJoinPassive = entry && entry.reason === "remote_join";
		const minGap = isRemoteJoinPassive ? SPKMOD_PET_CHAT_PASSIVE_INTERVAL_MS : SPKMOD_PET_CHAT_MIN_GAP_MS;
		const gapClearAt = _spkmodLastBroadcastAtMs + minGap;
		if (gapClearAt > now) {
			waitMs = Math.max(waitMs, gapClearAt - now);
		}
	}

	return waitMs;
}

function spkmodScheduleQueuedBroadcastFlush() {
	if (_spkmodPendingBroadcastTimer) {
		clearTimeout(_spkmodPendingBroadcastTimer);
		_spkmodPendingBroadcastTimer = null;
	}
	if (!_spkmodQueuedPetBroadcast) return;

	const now = Date.now();
	const waitMs = spkmodComputePetBroadcastWaitMs(now, _spkmodQueuedPetBroadcast);
	if (!isFinite(waitMs)) {
		// Blocked by server level gate -> drop pending broadcast until user levels up
		_spkmodQueuedPetBroadcast = null;
		return;
	}

	_spkmodPendingBroadcastTimer = setTimeout(() => {
		_spkmodPendingBroadcastTimer = null;
		spkmodFlushQueuedPetBroadcast();
	}, Math.max(0, Math.ceil(waitMs)));
}

function spkmodFlushQueuedPetBroadcast() {
	if (!spkmodIsPetChatSharingEnabled()) {
		_spkmodQueuedPetBroadcast = null;
		return;
	}
	const entry = _spkmodQueuedPetBroadcast;
	if (!entry) return;

	const now = Date.now();
	const waitMs = spkmodComputePetBroadcastWaitMs(now, entry);
	if (!isFinite(waitMs)) {
		_spkmodQueuedPetBroadcast = null;
		return;
	}
	if (waitMs > 25) {
		spkmodScheduleQueuedBroadcastFlush();
		return;
	}

	// Re-resolve passive broadcasts against the latest equipped pet so we never send stale state
	const effectivePetId = entry.priority === "passive"
		? (window.spkmodPetSettings.equippedId || null)
		: (entry.petId || null);

	_spkmodQueuedPetBroadcast = null;

	if (entry.priority === "passive" && !effectivePetId) return;

	const normalizedId = effectivePetId || "none";
	const curZoneId = gameState?.zoneId ?? null;
	if (!entry.forceResend && _spkmodLastBroadcastAtMs > 0 && _spkmodLastBroadcastPetId === normalizedId && _spkmodLastBroadcastZoneId === curZoneId) {
		return;
	}

	_spkmodLastBroadcastAtMs = now;
	_spkmodLastBroadcastPetId = normalizedId;
	_spkmodLastBroadcastZoneId = curZoneId;
	_spkmodChatRejectStrikeCount = 0;
	_spkmodNeedsZoneSync = false;

	const code = normalizedId !== "none" ? `:pet_${normalizedId}:` : `:pet_none:`;
	try {
		gameState.trySendChat(code);
	} catch (err) {
		console.warn("[SpeakiMod+ Pets] Failed to broadcast pet chat trigger:", err);
	}
}

window.spkmodNotifyUserChatActivity = function(kind = "send") {
	if (!spkmodIsPetsSystemEnabled()) return;
	const now = Date.now();
	if (kind === "send") {
		_spkmodLastUserChatSentMs = now;
		window.__spkmodLastPlayerChatSentMs = now;
		spkmodPruneRecentUserChatTimes(now);
		_spkmodRecentUserChatSentTimes.push(now);
	} else if (kind === "echo") {
		if (now - _spkmodLastUserChatSentMs > 1500) {
			_spkmodLastUserChatSentMs = now;
			window.__spkmodLastPlayerChatSentMs = now;
			spkmodPruneRecentUserChatTimes(now);
			_spkmodRecentUserChatSentTimes.push(now);
		}
	} else {
		_spkmodLastUserChatTypingMs = now;
	}

	// Immediately defer any queued pet broadcast so it yields to the player's chat
	if (_spkmodQueuedPetBroadcast) {
		spkmodScheduleQueuedBroadcastFlush();
	}
};

window.spkmodOnChatRejected = function(event) {
	if (!spkmodIsPetsSystemEnabled()) return false;
	const now = Date.now();
	const rawCode = event?.reasonCode;
	const isNewbieGate = rawCode === 1 || rawCode === "CHAT_REJECT_NEWBIE_GATE";
	const isDisabled = rawCode === 2 || rawCode === "CHAT_REJECT_DISABLED";
	const isUnlinked = rawCode === 3 || rawCode === "CHAT_REJECT_UNLINKED";
	const isMuted = rawCode === 4 || rawCode === "CHAT_REJECT_MUTED";

	if (isNewbieGate) {
		_spkmodChatMinLevelGate = Math.max(_spkmodChatMinLevelGate, Number(event?.minLevel) || 999);
		_spkmodQueuedPetBroadcast = null;
		if (_spkmodPendingBroadcastTimer) {
			clearTimeout(_spkmodPendingBroadcastTimer);
			_spkmodPendingBroadcastTimer = null;
		}
	} else if (isMuted || isDisabled || isUnlinked) {
		_spkmodChatRejectBackoffUntilMs = Math.max(_spkmodChatRejectBackoffUntilMs, now + 60000);
		if (_spkmodQueuedPetBroadcast && _spkmodQueuedPetBroadcast.priority === "passive") {
			_spkmodQueuedPetBroadcast = null;
		}
		spkmodScheduleQueuedBroadcastFlush();
	} else {
		_spkmodChatRejectStrikeCount = Math.min(3, _spkmodChatRejectStrikeCount + 1);
		const backoffMs = Math.min(30000, 10000 * _spkmodChatRejectStrikeCount);
		_spkmodChatRejectBackoffUntilMs = Math.max(_spkmodChatRejectBackoffUntilMs, now + backoffMs);
		spkmodScheduleQueuedBroadcastFlush();
	}

	// Suppress confusing system chat error ONLY if caused solely by a background pet sync packet
	const lastUserSent = Math.max(_spkmodLastUserChatSentMs, window.__spkmodLastPlayerChatSentMs || 0);
	const causedByPetPacket = (_spkmodLastBroadcastAtMs > 0 && now - _spkmodLastBroadcastAtMs <= 2500)
		&& (now - lastUserSent > 4000);
	return causedByPetPacket;
};

if (!window.__spkmodPetChatInputTrackersInstalled) {
	window.__spkmodPetChatInputTrackersInstalled = true;
	const isChatInputTarget = (target) => !!(target && target.closest && target.closest(".sr-chatbox"));
	document.addEventListener("focusin", (e) => {
		if (isChatInputTarget(e.target)) window.spkmodNotifyUserChatActivity("typing");
	}, true);
	document.addEventListener("input", (e) => {
		if (isChatInputTarget(e.target)) window.spkmodNotifyUserChatActivity("typing");
	}, true);
	document.addEventListener("keydown", (e) => {
		if (e.key !== "Escape" && isChatInputTarget(e.target)) {
			window.spkmodNotifyUserChatActivity("typing");
		}
	}, true);
	document.addEventListener("focusout", (e) => {
		if (isChatInputTarget(e.target) && _spkmodQueuedPetBroadcast) {
			spkmodScheduleQueuedBroadcastFlush();
		}
	}, true);
}

function spkmodSendPetChatTrigger(petId, optionsOrForce = false) {
	if (!spkmodIsPetChatSharingEnabled()) return;
	const opts = (optionsOrForce && typeof optionsOrForce === "object")
		? optionsOrForce
		: {
			priority: optionsOrForce ? "explicit" : "passive",
			delayMs: optionsOrForce ? SPKMOD_PET_CHAT_EQUIP_DEBOUNCE_MS : 0,
			forceResend: !!optionsOrForce,
			reason: optionsOrForce ? "explicit" : "passive"
		};

	const priority = opts.priority || "explicit";
	const delayMs = Math.max(0, Number(opts.delayMs) || 0);
	const forceResend = opts.forceResend !== undefined ? !!opts.forceResend : (priority === "explicit");
	const reason = opts.reason || priority;
	const normalizedId = (!petId || petId === "none" || petId === "off") ? "none" : String(petId);

	// Never let a passive background resync clobber a pending explicit equip/unequip
	if (priority === "passive" && _spkmodQueuedPetBroadcast && _spkmodQueuedPetBroadcast.priority === "explicit") {
		return;
	}

	const now = Date.now();
	const earliestAtMs = now + delayMs;
	const prevForceResend = _spkmodQueuedPetBroadcast ? !!_spkmodQueuedPetBroadcast.forceResend : false;

	_spkmodQueuedPetBroadcast = {
		petId: normalizedId,
		priority,
		earliestAtMs,
		forceResend: forceResend || prevForceResend,
		reason
	};

	spkmodScheduleQueuedBroadcastFlush();
}

function spkmodScheduleZonePetBroadcast(delayMs = 1800, reason = "zone") {
	if (!spkmodIsPetChatSharingEnabled()) return;
	const eqId = window.spkmodPetSettings.equippedId;
	if (!eqId) return;
	if (reason === "remote_join" && _spkmodQueuedPetBroadcast) return;
	spkmodSendPetChatTrigger(eqId, {
		priority: "passive",
		delayMs,
		forceResend: true,
		reason
	});
}

const _spkmodRemoteEquipSeq = new Map();
const _spkmodRemoteInFlightPetId = new Map();
let _spkmodLocalEquipSeq = 0;
let _spkmodLocalEquipInFlight = false;
let _spkmodDidInitialAutoRestore = false;

async function spkmodSpawnOrUpdateRemotePet(playerId, playerName, petId) {
	if (!spkmodIsPetsSystemEnabled()) return;
	const cleanId = (petId || "").trim().toLowerCase();
	const ownerKey = playerId != null && playerId !== "" ? String(playerId) : `name:${(playerName || "").trim().toLowerCase()}`;

	if (!cleanId || cleanId === "none" || cleanId === "off") {
		_spkmodRemoteEquipSeq.set(ownerKey, (_spkmodRemoteEquipSeq.get(ownerKey) || 0) + 1);
		_spkmodRemoteInFlightPetId.delete(ownerKey);
		const existing = spkmodRemotePetInstances.get(ownerKey);
		if (existing) {
			spkmodDisposePetInstance(existing);
			spkmodRemotePetInstances.delete(ownerKey);
		}
		spkmodSweepScenePetRoots("spkmod_pet_root_" + ownerKey, null, false);
		if (playerName) spkmodPendingRemotePetsByName.delete(playerName.trim().toLowerCase());
		if (playerId != null) spkmodPendingRemotePetsById.delete(String(playerId));
		return;
	}

	const pet = SPKMOD_PETS_BY_ID.get(cleanId);
	if (!pet) return;

	if (playerName) spkmodPendingRemotePetsByName.set(playerName.trim().toLowerCase(), cleanId);
	if (playerId != null) spkmodPendingRemotePetsById.set(String(playerId), cleanId);

	const existing = spkmodRemotePetInstances.get(ownerKey);
	if ((existing && existing.pet.id === pet.id && !existing.disposed) || _spkmodRemoteInFlightPetId.get(ownerKey) === pet.id) {
		return;
	}

	const mySeq = (_spkmodRemoteEquipSeq.get(ownerKey) || 0) + 1;
	_spkmodRemoteEquipSeq.set(ownerKey, mySeq);
	_spkmodRemoteInFlightPetId.set(ownerKey, pet.id);

	if (existing) {
		spkmodDisposePetInstance(existing);
		spkmodRemotePetInstances.delete(ownerKey);
	}
	spkmodSweepScenePetRoots("spkmod_pet_root_" + ownerKey, null, false);

	let cachedRpKey = null;
	let cachedRpRef = null;
	const lowerTargetName = playerName ? playerName.trim().toLowerCase() : "";
	const resolveRp = () => {
		if (typeof gameState === "undefined" || !gameState?.remotePlayers?.remotePlayers) return null;
		const rMap = gameState.remotePlayers.remotePlayers;
		if (cachedRpRef && cachedRpKey !== null && rMap.get(cachedRpKey) === cachedRpRef) {
			return cachedRpRef;
		}
		cachedRpRef = null;
		cachedRpKey = null;
		if (playerId != null) {
			const keys = [playerId, Number(playerId), String(playerId)];
			for (const k of keys) {
				const byId = rMap.get(k);
				if (byId) {
					cachedRpKey = k;
					cachedRpRef = byId;
					return byId;
				}
			}
		}
		if (lowerTargetName) {
			for (const [k, rp] of rMap) {
				const rName = (rp?.info?.__spkmodOrigName || rp?.info?.name || "").trim().toLowerCase();
				if (rName && rName === lowerTargetName) {
					cachedRpKey = k;
					cachedRpRef = rp;
					return rp;
				}
			}
		}
		return null;
	};

	const inst = await spkmodCreatePetInstance(
		ownerKey,
		pet,
		false,
		() => resolveRp()?.container || null,
		resolveRp
	);
	if (_spkmodRemoteInFlightPetId.get(ownerKey) === pet.id) {
		_spkmodRemoteInFlightPetId.delete(ownerKey);
	}
	if (inst) {
		if (!spkmodIsPetsSystemEnabled() || _spkmodRemoteEquipSeq.get(ownerKey) !== mySeq) {
			spkmodDisposePetInstance(inst);
			return;
		}
		const prev = spkmodRemotePetInstances.get(ownerKey);
		if (prev && prev !== inst) {
			spkmodDisposePetInstance(prev);
		}
		spkmodSweepScenePetRoots("spkmod_pet_root_" + ownerKey, inst.root, false);
		spkmodRemotePetInstances.set(ownerKey, inst);
	}
}

window.spkmodHandleIncomingPetTrigger = function(playerId, playerName, rawMsg) {
	if (!spkmodIsPetsSystemEnabled()) return;
	if (typeof rawMsg !== "string") return;
	const match = rawMsg.trim().match(/^:pet_([a-zA-Z0-9_-]+):$/i);
	if (!match) return;
	const petId = match[1].toLowerCase();

	const myId = typeof gameState !== "undefined" ? gameState?.myPlayerId : null;
	const myName = (typeof gameState !== "undefined" && (gameState?.myPlayerName || gameState?.myStat?.name)) || "";

	const isSelf = (myId != null && playerId != null && String(playerId) === String(myId)) ||
		(myName && playerName && myName.trim().toLowerCase() === playerName.trim().toLowerCase());

	if (isSelf) return;

	spkmodSpawnOrUpdateRemotePet(playerId, playerName, petId);
};

// ============================================================================
// 9. EQUIP / UNEQUIP LOCAL PET & MASTER ANIMATION FRAME LOOP
// ============================================================================
async function spkmodEquipLocalPet(idOrLevel, broadcast = true, silentToast = false) {
	if (!spkmodIsPetsSystemEnabled()) {
		if (!silentToast && typeof chatLog === "function") {
			chatLog(spkmodGetPetsDisabledToastText());
		}
		return false;
	}
	if (idOrLevel === null || idOrLevel === undefined || idOrLevel === "none" || idOrLevel === "off") {
		_spkmodLocalEquipSeq++;
		_spkmodLocalEquipInFlight = false;
		_spkmodDidInitialAutoRestore = true;
		if (spkmodLocalPetInstance) {
			spkmodDisposePetInstance(spkmodLocalPetInstance);
			spkmodLocalPetInstance = null;
		}
		spkmodSweepScenePetRoots("spkmod_pet_root_local_self", null, false);
		window.spkmodPetSettings.equippedId = null;
		if (window.localStorage) localStorage.removeItem(SPKMOD_PET_STORAGE_KEYS.equipped);
		if (broadcast) {
			spkmodSendPetChatTrigger("none", {
				priority: "explicit",
				delayMs: SPKMOD_PET_CHAT_EQUIP_DEBOUNCE_MS,
				forceResend: false,
				reason: "unequip"
			});
		}
		if (!silentToast && typeof chatLog === "function") {
			chatLog(spkmodGetPetUiText("unequippedToast"));
		}
		spkmodRefreshPetsModalUI();
		return true;
	}

	const pet = typeof idOrLevel === "number" || /^\d+$/.test(String(idOrLevel))
		? SPKMOD_PETS_BY_LEVEL.get(Number(idOrLevel))
		: SPKMOD_PETS_BY_ID.get(String(idOrLevel).trim().toLowerCase());

	if (!pet) {
		if (typeof chatLog === "function") chatLog(spkmodGetPetUiText("unknownPetToast", idOrLevel));
		return false;
	}

	const petName = spkmodGetPetDisplayName(pet);
	if (!spkmodIsPetUnlocked(pet)) {
		if (!silentToast && typeof chatLog === "function") {
			chatLog(spkmodGetPetUiText("lockedToast", pet.level, petName));
		}
		return false;
	}

	const mySeq = ++_spkmodLocalEquipSeq;
	_spkmodLocalEquipInFlight = true;

	if (spkmodLocalPetInstance) {
		spkmodDisposePetInstance(spkmodLocalPetInstance);
		spkmodLocalPetInstance = null;
	}
	spkmodSweepScenePetRoots("spkmod_pet_root_local_self", null, false);

	window.spkmodPetSettings.equippedId = pet.id;
	if (window.localStorage) localStorage.setItem(SPKMOD_PET_STORAGE_KEYS.equipped, pet.id);

	let createdInst = null;
	try {
		createdInst = await spkmodCreatePetInstance(
			"local_self",
			pet,
			true,
			() => (typeof gameState !== "undefined" ? gameState?.playerContainer : null),
			() => null
		);
	} finally {
		if (mySeq === _spkmodLocalEquipSeq) {
			_spkmodLocalEquipInFlight = false;
		}
	}

	if (!spkmodIsPetsSystemEnabled() || mySeq !== _spkmodLocalEquipSeq) {
		if (createdInst) spkmodDisposePetInstance(createdInst);
		return false;
	}
	if (!createdInst) {
		return false;
	}
	_spkmodDidInitialAutoRestore = true;
	if (spkmodLocalPetInstance && spkmodLocalPetInstance !== createdInst) {
		spkmodDisposePetInstance(spkmodLocalPetInstance);
	}
	spkmodLocalPetInstance = createdInst;
	if (createdInst) {
		spkmodSweepScenePetRoots("spkmod_pet_root_local_self", createdInst.root, false);
	}

	if (spkmodLocalPetInstance) {
		const targetInst = spkmodLocalPetInstance;
		spkmodPlayPetSfx(pet, true);
		setTimeout(() => {
			if (spkmodLocalPetInstance === targetInst && !targetInst.disposed) {
				spkmodShowPetSpeechBubble(targetInst);
			}
		}, 600);
	}

	if (broadcast) {
		spkmodSendPetChatTrigger(pet.id, {
			priority: "explicit",
			delayMs: SPKMOD_PET_CHAT_EQUIP_DEBOUNCE_MS,
			forceResend: false,
			reason: "equip"
		});
	}

	if (!silentToast && typeof chatLog === "function") {
		chatLog(spkmodGetPetUiText("equippedToast", `${pet.icon} ${petName}`, pet.level));
	}
	spkmodRefreshPetsModalUI();
	return true;
}

let _spkmodPetLoopRafId = null;

function spkmodStartPetsLoopIfEnabled() {
	if (!spkmodIsPetsSystemEnabled()) return;
	if (_spkmodPetLoopRafId !== null) return;
	_spkmodPetLoopLastMs = performance.now();
	_spkmodPetLoopRafId = requestAnimationFrame(spkmodPetsMasterLoop);
}

function spkmodStopPetsLoop() {
	if (_spkmodPetLoopRafId !== null) {
		cancelAnimationFrame(_spkmodPetLoopRafId);
		_spkmodPetLoopRafId = null;
	}
}

function spkmodSyncPetsSystemUIState() {
	const enabled = spkmodIsPetsSystemEnabled();
	if (typeof lunPanelElements !== "undefined" && lunPanelElements) {
		if (lunPanelElements.petsSystemToggleInput) {
			lunPanelElements.petsSystemToggleInput.checked = enabled;
		}
		if (lunPanelElements.petsBtn) {
			lunPanelElements.petsBtn.classList.toggle("hidden", !enabled);
		}
	}
	const btnById = document.getElementById("spkmod-pets-btn");
	if (btnById) btnById.classList.toggle("hidden", !enabled);
}

window.spkmodSetPetsSystemEnabled = function(nextEnabled, silentToast = false) {
	const enabled = !!nextEnabled;
	window.spkmodPetSettings.enabled = enabled;
	window.spkmodPetsSystemEnabled = enabled;
	if (typeof window !== "undefined" && window.localStorage) {
		try {
			localStorage.setItem(SPKMOD_PET_STORAGE_KEYS.enabled, enabled ? "true" : "false");
		} catch (_) {}
	}

	spkmodSyncPetsSystemUIState();

	if (!enabled) {
		spkmodStopPetsLoop();
		_spkmodLocalEquipSeq++;
		_spkmodLocalEquipInFlight = false;
		_spkmodDidInitialAutoRestore = false;
		_spkmodRemoteEquipSeq.clear();
		_spkmodRemoteInFlightPetId.clear();
		_spkmodQueuedPetBroadcast = null;
		_spkmodNeedsZoneSync = false;
		if (_spkmodPendingBroadcastTimer) {
			clearTimeout(_spkmodPendingBroadcastTimer);
			_spkmodPendingBroadcastTimer = null;
		}
		if (spkmodLocalPetInstance) {
			spkmodDisposePetInstance(spkmodLocalPetInstance);
			spkmodLocalPetInstance = null;
		}
		for (const [, rInst] of spkmodRemotePetInstances) {
			spkmodDisposePetInstance(rInst);
		}
		spkmodRemotePetInstances.clear();
		spkmodPendingRemotePetsByName.clear();
		spkmodPendingRemotePetsById.clear();
		while (spkmodShowcaseInstances.length > 0) {
			const sInst = spkmodShowcaseInstances.pop();
			spkmodDisposePetInstance(sInst);
		}
		spkmodSweepScenePetRoots("spkmod_pet_root_", null, true);
		const modal = document.getElementById("spkmod-pets-modal");
		if (modal) modal.classList.add("hidden");
	} else {
		_spkmodDidInitialAutoRestore = false;
		_spkmodLastObservedZoneId = null;
		_spkmodLastObservedRemoteCount = 0;
		spkmodStartPetsLoopIfEnabled();
	}

	if (!silentToast && typeof chatLog === "function") {
		chatLog(enabled ? spkmodGetPetsEnabledToastText() : spkmodGetPetsDisabledToastText());
	}
	return enabled;
};

function spkmodPetsMasterLoop(nowMs) {
	_spkmodPetLoopRafId = null;
	if (!spkmodIsPetsSystemEnabled()) return;

	const dt = Math.min(0.1, Math.max(0.001, (nowMs - _spkmodPetLoopLastMs) / 1000));
	_spkmodPetLoopLastMs = nowMs;

	if (!document.hidden && typeof gameState !== "undefined" && gameState && gameState.scene && gameState.playerContainer) {
		// Auto-restore saved local pet ONCE when gameState & Three.js are ready (never race with manual pet switching!)
		if (!_spkmodDidInitialAutoRestore && !spkmodLocalPetInstance && !_spkmodAutoRestoringPet && !_spkmodLocalEquipInFlight && window.spkmodPetSettings.equippedId) {
			const savedPet = SPKMOD_PETS_BY_ID.get(window.spkmodPetSettings.equippedId);
			if (savedPet && spkmodIsPetUnlocked(savedPet)) {
				_spkmodAutoRestoringPet = true;
				Promise.resolve(spkmodEquipLocalPet(savedPet.id, true, true)).then(ok => {
					if (ok && spkmodLocalPetInstance) {
						_spkmodDidInitialAutoRestore = true;
					}
				}).catch(() => {}).finally(() => {
					_spkmodAutoRestoringPet = false;
				});
			}
		}

		// Detect map/zone change -> broadcast active pet & clean stale remote pets
		if (gameState.zoneId != null && gameState.zoneId !== _spkmodLastObservedZoneId) {
			_spkmodLastObservedZoneId = gameState.zoneId;
			for (const [key, rInst] of spkmodRemotePetInstances) {
				spkmodDisposePetInstance(rInst);
			}
			spkmodRemotePetInstances.clear();
			if (window.spkmodPetSettings.equippedId && spkmodIsPetChatSharingEnabled()) {
				_spkmodNeedsZoneSync = true;
				spkmodScheduleZonePetBroadcast(1800, "zone");
			}
		}

		// Sync deferred pet once other players are present outside isolated minigames, or on new remote player join
		const rCount = spkmodGetRemotePlayerCount();
		if (rCount > 0 && !spkmodIsInIsolatedMinigame() && window.spkmodPetSettings.equippedId && spkmodIsPetChatSharingEnabled()) {
			if (_spkmodNeedsZoneSync && !_spkmodQueuedPetBroadcast) {
				_spkmodNeedsZoneSync = false;
				spkmodScheduleZonePetBroadcast(1800, "zone");
			} else if (rCount > _spkmodLastObservedRemoteCount) {
				if (!_spkmodQueuedPetBroadcast && Date.now() - _spkmodLastBroadcastAtMs > SPKMOD_PET_CHAT_PASSIVE_INTERVAL_MS) {
					spkmodScheduleZonePetBroadcast(2500, "remote_join");
				}
			}
		}
		_spkmodLastObservedRemoteCount = rCount;

		// Update local pet
		if (spkmodLocalPetInstance) {
			spkmodUpdateSinglePetInstance(spkmodLocalPetInstance, dt, nowMs);
		}

		// Prune despawned remote pets (even when other players remain in zone!) & update active ones
		const rMap = gameState.remotePlayers?.remotePlayers;
		for (const [key, rInst] of spkmodRemotePetInstances) {
			const container = rInst.resolveContainer?.();
			if (!container) {
				if (rMap && rMap.size === 0) {
					spkmodDisposePetInstance(rInst);
					spkmodRemotePetInstances.delete(key);
					continue;
				}
				if (!rInst._missingOwnerSinceMs) {
					rInst._missingOwnerSinceMs = nowMs;
				} else if (nowMs - rInst._missingOwnerSinceMs > 4000) {
					spkmodDisposePetInstance(rInst);
					spkmodRemotePetInstances.delete(key);
					continue;
				}
				if (rInst.root) rInst.root.visible = false;
				continue;
			}
			rInst._missingOwnerSinceMs = 0;
			spkmodUpdateSinglePetInstance(rInst, dt, nowMs);
		}

		// Update showcase ring pets if any
		for (const sInst of spkmodShowcaseInstances) {
			if (!sInst.disposed && sInst.root) {
				sInst.idlePhase += dt * 3.5;
				const isShowcaseFlyer = sInst.pet && sInst.pet.moveMode === "fly";
				sInst.modelHolder.position.y = isShowcaseFlyer
					? (1.25 + Math.sin(sInst.idlePhase * 1.15) * 0.12)
					: (Math.abs(Math.sin(sInst.idlePhase)) * 0.18);
				if (sInst.speechAnchor) sInst.speechAnchor.position.y = sInst.modelHolder.position.y;
				sInst.modelHolder.rotation.y += dt * 1.2;
				if (sInst.monsterEntry?.visual?.update) {
					if (sInst._sanitizedMonsterVisual !== sInst.monsterEntry.visual) {
						sInst._sanitizedMonsterVisual = sInst.monsterEntry.visual;
						sInst._lastMeasuredMonsterVisual = sInst.monsterEntry.visual;
						sInst._peakVisualTopY = 0;
						sInst._cachedVisualTopY = 0;
						spkmodDisableRaycastAndSanitize(sInst.monsterEntry.container, true);
						spkmodRepositionPetBubbleIfActive(sInst);
					}
					sInst.monsterEntry.visual.update(dt);
				}
				if (sInst.mixer) sInst.mixer.update(dt);
			}
		}
	}

	if (spkmodIsPetsSystemEnabled()) {
		_spkmodPetLoopRafId = requestAnimationFrame(spkmodPetsMasterLoop);
	}
}
spkmodSyncPetsSystemUIState();
spkmodStartPetsLoopIfEnabled();

// ============================================================================
// 10. HUGE PET MANAGER UI WINDOW (#spkmod-pets-modal)
// ============================================================================
let _spkmodPetsActiveTab = "all";
let _spkmodPetsSearchQuery = "";
let _spkmodPetsLastObservedLevel = -1;

const SPKMOD_TIER_COLORS = {
	1: { border: "#38bdf8", bg: "rgba(56, 189, 248, 0.12)", badge: "#0284c7", label: "Tier 1" },
	2: { border: "#4ade80", bg: "rgba(74, 222, 128, 0.12)", badge: "#16a34a", label: "Tier 2" },
	3: { border: "#a78bfa", bg: "rgba(167, 139, 250, 0.14)", badge: "#7c3aed", label: "Tier 3" },
	4: { border: "#f472b6", bg: "rgba(244, 114, 182, 0.14)", badge: "#db2777", label: "Tier 4" },
	5: { border: "#fb923c", bg: "rgba(251, 146, 60, 0.16)", badge: "#ea580c", label: "Tier 5" },
	6: { border: "#ffd700", bg: "rgba(255, 215, 0, 0.18)", badge: "#ca8a04", label: "Mythic" }
};

function spkmodGetPetTier(level) {
	if (level <= 20) return 1;
	if (level <= 40) return 2;
	if (level <= 60) return 3;
	if (level <= 80) return 4;
	if (level <= 94) return 5;
	return 6;
}

function spkmodEnsurePetsModal() {
	if (typeof lunHudElements !== "undefined" && lunHudElements.petsModal) {
		return lunHudElements.petsModal;
	}

	if (!document.getElementById("spkmod-pets-styles")) {
		const styleEl = document.createElement("style");
		styleEl.id = "spkmod-pets-styles";
		styleEl.textContent = `
			#spkmod-pets-modal {
				position: fixed;
				width: min(920px, calc(100vw - 24px));
				height: min(650px, calc(100vh - 36px));
				min-width: 340px;
				min-height: 320px;
				background: rgba(11, 15, 27, 0.98);
				border: 1.5px solid var(--spkmod-accent, #ffd54a);
				border-radius: 14px;
				box-shadow: 0 24px 60px rgba(0, 0, 0, 0.88);
				display: flex;
				flex-direction: column;
				overflow: hidden;
				color: #f8fafc;
				z-index: 2147483610;
			}
			#spkmod-pets-modal.hidden {
				display: none !important;
			}
			.spkmod-pets-grid-scroll {
				flex: 1;
				min-height: 0;
				overflow-y: auto;
				overflow-x: hidden;
				overscroll-behavior: contain;
				padding: 12px;
			}
			.spkmod-pets-grid {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(205px, 1fr));
				grid-auto-rows: max-content;
				align-content: start;
				gap: 10px;
				height: auto;
			}
			.spkmod-pet-card {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				background: rgba(30, 41, 59, 0.72);
				border: 1.5px solid rgba(148, 163, 184, 0.25);
				border-radius: 10px;
				padding: 10px;
				min-height: 124px;
				box-sizing: border-box;
				transition: transform 0.14s ease, border-color 0.14s ease, box-shadow 0.14s ease;
				position: relative;
			}
			.spkmod-pet-card:hover {
				transform: translateY(-2px);
				box-shadow: 0 8px 20px rgba(0, 0, 0, 0.55);
			}
			.spkmod-pet-card.equipped {
				border-color: #4ade80 !important;
				box-shadow: 0 0 16px rgba(74, 222, 128, 0.35) !important;
				background: linear-gradient(145deg, rgba(20, 83, 45, 0.45), rgba(15, 23, 42, 0.85)) !important;
			}
			.spkmod-pet-card.locked {
				opacity: 0.62;
				filter: grayscale(0.35);
			}
			.spkmod-pets-tab-btn {
				background: rgba(30, 41, 59, 0.85);
				border: 1px solid rgba(148, 163, 184, 0.3);
				color: #cbd5e1;
				border-radius: 6px;
				padding: 5px 10px;
				font-size: 11px;
				font-weight: 700;
				cursor: pointer;
				white-space: nowrap;
				transition: all 0.15s ease;
			}
			.spkmod-pets-tab-btn.active {
				background: var(--spkmod-accent, #ffd54a);
				color: #0f172a;
				border-color: var(--spkmod-accent, #ffd54a);
			}
		`;
		document.head.appendChild(styleEl);
	}

	const modal = document.createElement("div");
	modal.id = "spkmod-pets-modal";
	modal.className = "spkmod-modal hidden";

	// 1. Header
	const header = document.createElement("div");
	header.id = "spkmod-pets-header";
	header.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: rgba(15, 23, 42, 0.95); border-bottom: 1px solid rgba(255, 255, 255, 0.12); cursor: move; user-select: none;";

	const titleEl = document.createElement("div");
	titleEl.id = "spkmod-pets-title";
	titleEl.style.cssText = "font-size: 14px; font-weight: 800; color: var(--spkmod-accent, #ffd54a); display: flex; align-items: center; gap: 8px;";
	titleEl.innerText = spkmodGetPetUiText("petsModalTitle");

	const closeBtn = document.createElement("button");
	closeBtn.type = "button";
	closeBtn.innerText = "✕";
	closeBtn.style.cssText = "background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.5); color: #fca5a5; border-radius: 6px; width: 26px; height: 26px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center;";
	closeBtn.onclick = () => modal.classList.add("hidden");

	header.appendChild(titleEl);
	header.appendChild(closeBtn);

	// 2. Top Status & Quick Action Bar
	const statusBar = document.createElement("div");
	statusBar.id = "spkmod-pets-status-bar";
	statusBar.style.cssText = "display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 14px; background: rgba(30, 41, 59, 0.65); border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 12px;";

	// 3. Settings Toggles & Search Row
	const controlsBar = document.createElement("div");
	controlsBar.id = "spkmod-pets-controls-bar";
	controlsBar.style.cssText = "display: flex; flex-direction: column; gap: 8px; padding: 8px 14px; background: rgba(15, 23, 42, 0.75); border-bottom: 1px solid rgba(255, 255, 255, 0.08);";

	// 4. Scrollable Grid Container
	const gridScroll = document.createElement("div");
	gridScroll.className = "spkmod-pets-grid-scroll";

	const grid = document.createElement("div");
	grid.id = "spkmod-pets-grid";
	grid.className = "spkmod-pets-grid";
	gridScroll.appendChild(grid);

	// 5. Resize Handle
	const resizeHandle = document.createElement("div");
	resizeHandle.id = "spkmod-pets-resize";
	resizeHandle.style.cssText = "position: absolute; right: 2px; bottom: 2px; width: 16px; height: 16px; cursor: nwse-resize; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 11px; user-select: none;";
	resizeHandle.innerText = "◢";

	modal.appendChild(header);
	modal.appendChild(statusBar);
	modal.appendChild(controlsBar);
	modal.appendChild(gridScroll);
	modal.appendChild(resizeHandle);
	document.body.appendChild(modal);

	if (typeof lunHudElements !== "undefined") {
		lunHudElements.petsModal = modal;
	}
	if (typeof makeDraggable === "function") {
		makeDraggable(modal, [header]);
	}
	if (typeof makeResizable === "function") {
		makeResizable(modal, resizeHandle, 360, 320);
	}

	// Prevent wheel/touch inside the Pet Manager from zooming the game camera and ensure smooth grid scrolling
	const scrollDelta = (e) => (e.deltaMode === 1 ? e.deltaY * 33 : (e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY));
	gridScroll.addEventListener("wheel", (e) => {
		e.stopPropagation();
	}, { passive: true });
	gridScroll.addEventListener("touchmove", (e) => {
		e.stopPropagation();
	}, { passive: true });
	modal.addEventListener("wheel", (e) => {
		e.stopPropagation();
		if (gridScroll && e.target !== gridScroll && !gridScroll.contains(e.target)) {
			gridScroll.scrollTop += scrollDelta(e);
		}
	}, { passive: true });
	modal.addEventListener("touchmove", (e) => {
		e.stopPropagation();
	}, { passive: true });
	modal.addEventListener("mouseenter", () => {
		if (document.pointerLockElement) {
			try { document.exitPointerLock(); } catch (_) {}
		}
	});
	for (const nonDragEl of [statusBar, controlsBar, gridScroll]) {
		nonDragEl.addEventListener("pointerdown", (e) => e.stopPropagation());
		nonDragEl.addEventListener("mousedown", (e) => e.stopPropagation());
	}

	spkmodBuildPetsModalControls(controlsBar);
	spkmodRefreshPetsModalUI();
	return modal;
}

function spkmodBuildPetsModalControls(controlsBar) {
	if (!controlsBar) return;
	controlsBar.innerHTML = "";

	// Row A: Search Input + Settings Checkboxes
	const topRow = document.createElement("div");
	topRow.style.cssText = "display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px;";

	const searchInput = document.createElement("input");
	searchInput.type = "text";
	searchInput.id = "spkmod-pets-search-input";
	searchInput.placeholder = spkmodGetPetUiText("searchPlaceholder");
	searchInput.value = _spkmodPetsSearchQuery;
	searchInput.style.cssText = "flex: 1; min-width: 200px; background: rgba(2, 6, 23, 0.85); border: 1px solid #475569; border-radius: 6px; padding: 6px 10px; color: #f8fafc; font-size: 12px; outline: none;";
	searchInput.addEventListener("input", () => {
		_spkmodPetsSearchQuery = searchInput.value.trim().toLowerCase();
		spkmodRenderPetsGrid();
	});
	searchInput.addEventListener("keydown", (e) => e.stopPropagation());
	searchInput.addEventListener("keyup", (e) => e.stopPropagation());
	topRow.appendChild(searchInput);

	const togglesWrap = document.createElement("div");
	togglesWrap.style.cssText = "display: flex; flex-wrap: wrap; align-items: center; gap: 10px; font-size: 11px; color: #e2e8f0;";

	const makeToggle = (labelKey, prop, storageKey) => {
		const lbl = document.createElement("label");
		lbl.style.cssText = "display: inline-flex; align-items: center; gap: 4px; cursor: pointer; user-select: none; white-space: nowrap;";
		const cb = document.createElement("input");
		cb.type = "checkbox";
		cb.checked = !!window.spkmodPetSettings[prop];
		cb.onchange = () => {
			window.spkmodPetSettings[prop] = cb.checked;
			if (window.localStorage) localStorage.setItem(storageKey, cb.checked ? "true" : "false");
		};
		const span = document.createElement("span");
		span.innerText = spkmodGetPetUiText(labelKey);
		lbl.appendChild(cb);
		lbl.appendChild(span);
		return lbl;
	};

	togglesWrap.appendChild(makeToggle("toggleMySfx", "mySfx", SPKMOD_PET_STORAGE_KEYS.mySfx));
	togglesWrap.appendChild(makeToggle("toggleOtherSfx", "otherSfx", SPKMOD_PET_STORAGE_KEYS.otherSfx));
	togglesWrap.appendChild(makeToggle("toggleBubbles", "speechBubbles", SPKMOD_PET_STORAGE_KEYS.bubbles));
	togglesWrap.appendChild(makeToggle("toggleRemotePets", "showRemotePets", SPKMOD_PET_STORAGE_KEYS.showRemote));

	const shareLbl = makeToggle("toggleShareInChat", "shareInChat", SPKMOD_PET_STORAGE_KEYS.shareInChat);
	const shareCb = shareLbl.querySelector("input");
	if (shareCb) {
		shareCb.onchange = () => {
			window.spkmodPetSettings.shareInChat = shareCb.checked;
			if (window.localStorage) localStorage.setItem(SPKMOD_PET_STORAGE_KEYS.shareInChat, shareCb.checked ? "true" : "false");
			if (!shareCb.checked) {
				_spkmodQueuedPetBroadcast = null;
				_spkmodNeedsZoneSync = false;
				if (_spkmodPendingBroadcastTimer) {
					clearTimeout(_spkmodPendingBroadcastTimer);
					_spkmodPendingBroadcastTimer = null;
				}
			} else if (window.spkmodPetSettings.equippedId) {
				_spkmodNeedsZoneSync = true;
				spkmodScheduleZonePetBroadcast(800, "zone");
			}
		};
	}
	togglesWrap.appendChild(shareLbl);

	topRow.appendChild(togglesWrap);
	controlsBar.appendChild(topRow);

	// Row B: Tier / Category Filter Tabs
	const tabsRow = document.createElement("div");
	tabsRow.style.cssText = "display: flex; flex-wrap: wrap; gap: 6px; align-items: center;";
	const tabs = [
		{ id: "all", key: "tabAll" },
		{ id: "unlocked", key: "tabUnlocked" },
		{ id: "t1", key: "tabTier1" },
		{ id: "t2", key: "tabTier2" },
		{ id: "t3", key: "tabTier3" },
		{ id: "t4", key: "tabTier4" },
		{ id: "t5", key: "tabTier5" }
	];
	for (const tab of tabs) {
		const btn = document.createElement("button");
		btn.type = "button";
		btn.className = "spkmod-pets-tab-btn" + (_spkmodPetsActiveTab === tab.id ? " active" : "");
		btn.innerText = spkmodGetPetUiText(tab.key);
		btn.onclick = () => {
			_spkmodPetsActiveTab = tab.id;
			tabsRow.querySelectorAll(".spkmod-pets-tab-btn").forEach(b => b.classList.remove("active"));
			btn.classList.add("active");
			spkmodRenderPetsGrid();
		};
		tabsRow.appendChild(btn);
	}
	controlsBar.appendChild(tabsRow);
}

function spkmodRenderPetsStatusBar() {
	const statusBar = document.getElementById("spkmod-pets-status-bar");
	if (!statusBar) return;
	statusBar.innerHTML = "";

	const myLvl = spkmodGetPlayerLevel();
	const unlockedCount = SPKMOD_PET_CATALOG.filter(p => spkmodIsPetUnlocked(p)).length;
	const totalCount = SPKMOD_PET_CATALOG.length;
	const eqPet = window.spkmodPetSettings.equippedId ? SPKMOD_PETS_BY_ID.get(window.spkmodPetSettings.equippedId) : null;
	const eqName = eqPet ? `${eqPet.icon} ${spkmodGetPetDisplayName(eqPet)} (Lv.${eqPet.level})` : spkmodGetPetUiText("noneEquipped");

	const infoWrap = document.createElement("div");
	infoWrap.style.cssText = "display: flex; flex-wrap: wrap; align-items: center; gap: 14px;";
	infoWrap.innerHTML = `
		<span>⭐ <b>${spkmodGetPetUiText("myLevelLabel")}:</b> <span style="color:#ffd54a;font-weight:800;">Lv.${myLvl}</span></span>
		<span>🔓 <b>${spkmodGetPetUiText("unlockedLabel")}:</b> <span style="color:#4ade80;font-weight:800;">${unlockedCount} / ${totalCount}</span></span>
		<span>🐾 <b>${spkmodGetPetUiText("equippedLabel")}:</b> <span style="color:#38bdf8;font-weight:800;">${eqName}</span></span>
	`;

	const actionsWrap = document.createElement("div");
	actionsWrap.style.cssText = "display: flex; flex-wrap: wrap; align-items: center; gap: 6px;";

	const makeActionBtn = (label, bg, onClick) => {
		const b = document.createElement("button");
		b.type = "button";
		b.innerText = label;
		b.style.cssText = `background: ${bg}; border: 1px solid rgba(255,255,255,0.2); color: #fff; border-radius: 6px; padding: 4px 9px; font-size: 11px; font-weight: 700; cursor: pointer;`;
		b.onclick = onClick;
		return b;
	};

	actionsWrap.appendChild(makeActionBtn(spkmodGetPetUiText("btnTalk"), "rgba(59, 130, 246, 0.45)", () => {
		window.spkmodPets.talk();
	}));
	actionsWrap.appendChild(makeActionBtn(spkmodGetPetUiText("btnDance"), "rgba(168, 85, 247, 0.45)", () => {
		window.spkmodPets.dance(8);
	}));
	actionsWrap.appendChild(makeActionBtn(spkmodGetPetUiText("btnResync"), "rgba(16, 185, 129, 0.4)", () => {
		if (!spkmodIsPetChatSharingEnabled()) {
			if (typeof chatLog === "function") chatLog(spkmodGetPetUiText("shareInChatDisabledToast"));
			return;
		}
		if (window.spkmodPetSettings.equippedId) {
			spkmodSendPetChatTrigger(window.spkmodPetSettings.equippedId, {
				priority: "explicit",
				delayMs: 0,
				forceResend: true,
				reason: "resync"
			});
			if (typeof chatLog === "function") chatLog(spkmodGetPetUiText("broadcastToast"));
		}
	}));
	if (eqPet) {
		actionsWrap.appendChild(makeActionBtn(spkmodGetPetUiText("btnUnequip"), "rgba(239, 68, 68, 0.45)", () => {
			spkmodEquipLocalPet(null, true);
		}));
	}

	statusBar.appendChild(infoWrap);
	statusBar.appendChild(actionsWrap);
}

function spkmodRenderPetsGrid() {
	const grid = document.getElementById("spkmod-pets-grid");
	if (!grid) return;
	grid.innerHTML = "";

	const eqId = window.spkmodPetSettings.equippedId;
	const allLockedPets = SPKMOD_PET_CATALOG.filter(p => !spkmodIsPetUnlocked(p));
	const teaserLockedPets = allLockedPets.slice(0, 2);
	const teaserIds = new Set(teaserLockedPets.map(p => p.id));

	let hiddenFutureCount = 0;

	const filtered = SPKMOD_PET_CATALOG.filter(pet => {
		const unlocked = spkmodIsPetUnlocked(pet);
		if (_spkmodPetsActiveTab === "unlocked" && !unlocked) return false;
		if (_spkmodPetsActiveTab === "t1" && (pet.level < 1 || pet.level > 20)) return false;
		if (_spkmodPetsActiveTab === "t2" && (pet.level < 21 || pet.level > 40)) return false;
		if (_spkmodPetsActiveTab === "t3" && (pet.level < 41 || pet.level > 60)) return false;
		if (_spkmodPetsActiveTab === "t4" && (pet.level < 61 || pet.level > 80)) return false;
		if (_spkmodPetsActiveTab === "t5" && (pet.level < 81 || pet.level > 100)) return false;

		if (!unlocked && !teaserIds.has(pet.id)) {
			hiddenFutureCount++;
			return false;
		}

		if (_spkmodPetsSearchQuery) {
			const dispName = spkmodGetPetDisplayName(pet).toLowerCase();
			const enName = ((typeof spkmodTranslations !== "undefined" && spkmodTranslations.en?.petNames?.[pet.id]) || pet.defaultName || "").toLowerCase();
			const src = (pet.source || "").toLowerCase();
			const lvlStr = `lv${pet.level} lv.${pet.level} ${pet.level}`;
			if (!dispName.includes(_spkmodPetsSearchQuery) && !enName.includes(_spkmodPetsSearchQuery) && !src.includes(_spkmodPetsSearchQuery) && !lvlStr.includes(_spkmodPetsSearchQuery)) {
				return false;
			}
		}
		return true;
	});

	const frag = document.createDocumentFragment();
	for (const pet of filtered) {
		const unlocked = spkmodIsPetUnlocked(pet);
		const isEquipped = eqId === pet.id;
		const tierIdx = spkmodGetPetTier(pet.level);
		const tierStyle = SPKMOD_TIER_COLORS[tierIdx] || SPKMOD_TIER_COLORS[1];
		const isMilestone = pet.level % 5 === 0;
		const dispName = spkmodGetPetDisplayName(pet);

		let rightBadgeText = pet.source;
		let rightBadgeColor = "#94a3b8";
		if (!unlocked && teaserIds.has(pet.id)) {
			rightBadgeText = spkmodGetPetUiText("nextUnlockBadge");
			rightBadgeColor = "#fb923c";
		} else if (pet.isExtraReward) {
			rightBadgeText = spkmodGetPetUiText("bonusRewardBadge");
			rightBadgeColor = "#f472b6";
		} else if (isMilestone) {
			rightBadgeText = spkmodGetPetUiText("milestoneBadge");
			rightBadgeColor = "#ffd54a";
		}

		const card = document.createElement("div");
		card.className = "spkmod-pet-card" + (isEquipped ? " equipped" : "") + (!unlocked ? " locked" : "");
		card.style.borderColor = isEquipped ? "#4ade80" : tierStyle.border;
		card.style.background = isEquipped
			? "linear-gradient(145deg, rgba(20, 83, 45, 0.45), rgba(15, 23, 42, 0.88))"
			: `linear-gradient(155deg, ${tierStyle.bg}, rgba(15, 23, 42, 0.88))`;

		// Top Row: Level Badge + Milestone / Bonus / Upcoming Badge
		const topMeta = document.createElement("div");
		topMeta.style.cssText = "display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 6px;";
		topMeta.innerHTML = `
			<span style="background: ${tierStyle.badge}; color: #fff; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 999px;">
				Lv.${pet.level}
			</span>
			<span style="font-size: 10px; font-weight: 700; color: ${rightBadgeColor};">
				${rightBadgeText}
			</span>
		`;

		// Center Row: Big Icon + Name + Move Mode Badge
		const bodyEl = document.createElement("div");
		bodyEl.style.cssText = "display: flex; align-items: center; gap: 10px; margin-bottom: 10px;";
		bodyEl.innerHTML = `
			<div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(2, 6, 23, 0.65); border: 1px solid rgba(255,255,255,0.12); display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0;">
				${pet.icon}
			</div>
			<div style="display: flex; flex-direction: column; gap: 3px; min-width: 0;">
				<div style="font-size: 12.5px; font-weight: 800; color: #f8fafc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${dispName}">
					${dispName}
				</div>
				<div style="font-size: 10px; color: #cbd5e1; display: flex; align-items: center; gap: 6px;">
					<span>${pet.moveMode === "fly" ? spkmodGetPetUiText("modeFly") : spkmodGetPetUiText("modeBounce")}</span>
					<span style="opacity:0.65;">• ${pet.source}</span>
				</div>
			</div>
		`;

		// Bottom Row: Sound Preview Button + Equip / Locked Button
		const footerEl = document.createElement("div");
		footerEl.style.cssText = "display: flex; align-items: center; gap: 6px;";

		const sfxBtn = document.createElement("button");
		sfxBtn.type = "button";
		sfxBtn.innerText = "🔊";
		sfxBtn.title = spkmodGetPetUiText("previewSoundTooltip");
		sfxBtn.style.cssText = "background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(148, 163, 184, 0.35); color: #e2e8f0; border-radius: 6px; width: 30px; height: 28px; cursor: pointer; font-size: 12px; flex-shrink: 0;";
		sfxBtn.onclick = (e) => {
			e.stopPropagation();
			spkmodPlayPetSfx(pet, true);
		};

		const equipBtn = document.createElement("button");
		equipBtn.type = "button";
		equipBtn.style.cssText = `
			flex: 1; height: 28px; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: ${unlocked ? "pointer" : "not-allowed"};
			border: 1px solid ${isEquipped ? "#4ade80" : (unlocked ? tierStyle.border : "#475569")};
			background: ${isEquipped ? "rgba(22, 163, 74, 0.55)" : (unlocked ? "rgba(30, 41, 59, 0.9)" : "rgba(15, 23, 42, 0.6)")};
			color: ${isEquipped ? "#bbf7d0" : (unlocked ? "#f8fafc" : "#94a3b8")};
		`;
		equipBtn.innerText = isEquipped
			? spkmodGetPetUiText("btnEquipped")
			: (unlocked ? spkmodGetPetUiText("btnEquip") : spkmodGetPetUiText("btnLocked", pet.level));

		equipBtn.onclick = () => {
			if (isEquipped) {
				spkmodEquipLocalPet(null, true);
			} else {
				spkmodEquipLocalPet(pet.id, true);
			}
		};

		footerEl.appendChild(sfxBtn);
		footerEl.appendChild(equipBtn);

		card.appendChild(topMeta);
		card.appendChild(bodyEl);
		card.appendChild(footerEl);
		frag.appendChild(card);
	}

	// Render the "Keep leveling up to unlock more!" Hype Teaser Banner when future pets are hidden
	if (hiddenFutureCount > 0 && _spkmodPetsActiveTab !== "unlocked") {
		const nextUnlockLvl = teaserLockedPets.length > 0 ? teaserLockedPets[0].level : Math.min(100, spkmodGetPlayerLevel() + 1);
		const totalMysteryRemaining = Math.max(hiddenFutureCount, allLockedPets.length - teaserLockedPets.length);
		const hypeCard = document.createElement("div");
		hypeCard.style.cssText = `
			grid-column: 1 / -1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			text-align: center;
			gap: 6px;
			padding: 18px 16px;
			margin-top: 4px;
			border-radius: 12px;
			border: 1.5px dashed rgba(255, 213, 74, 0.55);
			background: linear-gradient(135deg, rgba(255, 213, 74, 0.10), rgba(168, 85, 247, 0.12), rgba(15, 23, 42, 0.92));
			box-shadow: inset 0 0 24px rgba(255, 213, 74, 0.08);
		`;
		hypeCard.innerHTML = `
			<div style="font-size: 22px; line-height: 1;">✨🔒🐾✨</div>
			<div style="font-size: 14px; font-weight: 800; color: #ffd54a; letter-spacing: 0.2px;">
				${spkmodGetPetUiText("hypeTitle")}
			</div>
			<div style="font-size: 11.5px; color: #cbd5e1; max-width: 580px;">
				${spkmodGetPetUiText("hypeDesc", totalMysteryRemaining, nextUnlockLvl)}
			</div>
		`;
		frag.appendChild(hypeCard);
	}
	grid.appendChild(frag);
}

function spkmodRefreshPetsModalUI() {
	const modal = document.getElementById("spkmod-pets-modal");
	if (!modal || modal.classList.contains("hidden")) return;
	const titleEl = document.getElementById("spkmod-pets-title");
	if (titleEl) titleEl.innerText = spkmodGetPetUiText("petsModalTitle");
	const controlsBar = document.getElementById("spkmod-pets-controls-bar");
	if (controlsBar) spkmodBuildPetsModalControls(controlsBar);
	spkmodRenderPetsStatusBar();
	spkmodRenderPetsGrid();
}

window.spkmodOpenPetsModal = function() {
	if (!spkmodIsPetsSystemEnabled()) {
		const existingModal = document.getElementById("spkmod-pets-modal");
		if (existingModal) existingModal.classList.add("hidden");
		if (typeof chatLog === "function") chatLog(spkmodGetPetsDisabledToastText());
		return;
	}
	const modal = spkmodEnsurePetsModal();
	modal.classList.remove("hidden");
	spkmodRefreshPetsModalUI();
	if (typeof positionModalNicely === "function") {
		positionModalNicely(modal);
	}
};

window.spkmodTogglePetsModal = function() {
	if (!spkmodIsPetsSystemEnabled()) {
		const existingModal = document.getElementById("spkmod-pets-modal");
		if (existingModal) existingModal.classList.add("hidden");
		if (typeof chatLog === "function") chatLog(spkmodGetPetsDisabledToastText());
		return;
	}
	const modal = spkmodEnsurePetsModal();
	if (modal.classList.contains("hidden")) {
		window.spkmodOpenPetsModal();
	} else {
		modal.classList.add("hidden");
	}
};

// Hotkey Alt+P to toggle Pet Manager
window.addEventListener("keydown", e => {
	if (!spkmodIsPetsSystemEnabled()) return;
	if (e.altKey && (e.key === "p" || e.key === "P" || e.code === "KeyP")) {
		const active = document.activeElement;
		if (active) {
			const tag = active.tagName ? active.tagName.toLowerCase() : "";
			if (tag === "input" || tag === "textarea" || active.isContentEditable) return;
		}
		e.preventDefault();
		window.spkmodTogglePetsModal();
	}
});

if (typeof spkmodI18nRenderers !== "undefined" && Array.isArray(spkmodI18nRenderers)) {
	spkmodI18nRenderers.push(() => {
		spkmodSyncPetsSystemUIState();
		spkmodRefreshPetsModalUI();
	});
}

// ============================================================================
// 11. DEVELOPER & USER CONSOLE COMMANDS API (window.spkmodPets)
// ============================================================================
window.spkmodPets = {
	catalog: SPKMOD_PET_CATALOG,
	isEnabled: () => spkmodIsPetsSystemEnabled(),
	setEnabled: (enable, silentToast = false) => window.spkmodSetPetsSystemEnabled(!!enable, silentToast),
	open: () => window.spkmodOpenPetsModal(),
	toggle: () => window.spkmodTogglePetsModal(),
	equip: (idOrLevel) => spkmodEquipLocalPet(idOrLevel, true),
	unequip: () => spkmodEquipLocalPet(null, true),
	unlockAll: (enable) => {
		if (!spkmodIsPetsSystemEnabled()) {
			if (typeof chatLog === "function") chatLog(spkmodGetPetsDisabledToastText());
			return false;
		}
		const next = enable !== undefined ? !!enable : !window.spkmodPetSettings.unlockAllTest;
		window.spkmodPetSettings.unlockAllTest = next;
		if (window.localStorage) localStorage.setItem(SPKMOD_PET_STORAGE_KEYS.unlockAll, next ? "true" : "false");
		spkmodRefreshPetsModalUI();
		if (typeof chatLog === "function") {
			chatLog(spkmodGetPetUiText(next ? "testUnlockEnabledToast" : "testUnlockDisabledToast"));
		}
		return next;
	},
	talk: (customText) => {
		if (!spkmodIsPetsSystemEnabled()) {
			if (typeof chatLog === "function") chatLog(spkmodGetPetsDisabledToastText());
			return;
		}
		if (!spkmodLocalPetInstance) {
			if (typeof chatLog === "function") chatLog(spkmodGetPetUiText("equipFirstToast"));
			return;
		}
		spkmodShowPetSpeechBubble(spkmodLocalPetInstance, customText);
		spkmodPlayPetSfx(spkmodLocalPetInstance.pet, true);
	},
	dance: (seconds = 8) => {
		if (!spkmodIsPetsSystemEnabled()) {
			if (typeof chatLog === "function") chatLog(spkmodGetPetsDisabledToastText());
			return;
		}
		if (!spkmodLocalPetInstance) {
			if (typeof chatLog === "function") chatLog(spkmodGetPetUiText("equipFirstToast"));
			return;
		}
		spkmodLocalPetInstance.forceDanceUntil = performance.now() + (Number(seconds) || 8) * 1000;
		spkmodShowPetSpeechBubble(spkmodLocalPetInstance);
		spkmodPlayPetSfx(spkmodLocalPetInstance.pet, true);
	},
	jump: () => {
		if (!spkmodIsPetsSystemEnabled()) {
			if (typeof chatLog === "function") chatLog(spkmodGetPetsDisabledToastText());
			return;
		}
		if (!spkmodLocalPetInstance) {
			if (typeof chatLog === "function") chatLog(spkmodGetPetUiText("equipFirstToast"));
			return;
		}
		spkmodLocalPetInstance.forceFallDownUntil = 0;
		spkmodLocalPetInstance.pendingJumpAtMs = performance.now();
	},
	fallDown: (seconds = 6) => {
		if (!spkmodIsPetsSystemEnabled()) {
			if (typeof chatLog === "function") chatLog(spkmodGetPetsDisabledToastText());
			return;
		}
		if (!spkmodLocalPetInstance) {
			if (typeof chatLog === "function") chatLog(spkmodGetPetUiText("equipFirstToast"));
			return;
		}
		spkmodLocalPetInstance.forceDanceUntil = 0;
		spkmodLocalPetInstance.forceFallDownUntil = performance.now() + (Number(seconds) || 6) * 1000;
	},
	simulateIncomingChat: (playerName, petIdOrLevel) => {
		if (!spkmodIsPetsSystemEnabled()) {
			if (typeof chatLog === "function") chatLog(spkmodGetPetsDisabledToastText());
			return;
		}
		const pet = typeof petIdOrLevel === "number" || /^\d+$/.test(String(petIdOrLevel))
			? SPKMOD_PETS_BY_LEVEL.get(Number(petIdOrLevel))
			: SPKMOD_PETS_BY_ID.get(String(petIdOrLevel || "nuruling_1").toLowerCase());
		const code = pet ? `:pet_${pet.id}:` : `:pet_none:`;
		window.spkmodHandleIncomingPetTrigger(null, playerName, code);
	},
	giveRandomPetsToEveryone: () => {
		if (!spkmodIsPetsSystemEnabled()) {
			if (typeof chatLog === "function") chatLog(spkmodGetPetsDisabledToastText());
			return 0;
		}
		if (typeof gameState === "undefined" || !gameState?.remotePlayers?.remotePlayers) return 0;
		let count = 0;
		for (const [id, rp] of gameState.remotePlayers.remotePlayers) {
			const randomPet = spkmodPickRandom(SPKMOD_PET_CATALOG);
			spkmodSpawnOrUpdateRemotePet(id, rp?.info?.name, randomPet.id);
			count++;
		}
		if (typeof chatLog === "function") chatLog(spkmodGetPetUiText("randomPetsSpawnedToast", count));
		return count;
	},
	showcaseAroundMe: async (startLevel = 1, count = 10) => {
		if (!spkmodIsPetsSystemEnabled()) {
			if (typeof chatLog === "function") chatLog(spkmodGetPetsDisabledToastText());
			return;
		}
		window.spkmodPets.clearShowcase();
		if (typeof gameState === "undefined" || !gameState?.playerContainer?.position) return;
		const center = gameState.playerContainer.position.clone();
		const radius = Math.max(2.5, count * 0.32);
		let startIdx = SPKMOD_PET_CATALOG.findIndex(p => p.level >= startLevel);
		if (startIdx < 0) startIdx = 0;
		for (let i = 0; i < count; i++) {
			const pet = SPKMOD_PET_CATALOG[(startIdx + i) % SPKMOD_PET_CATALOG.length];
			if (!pet) continue;
			const angle = (Math.PI * 2 * i) / count;
			const px = center.x + Math.cos(angle) * radius;
			const pz = center.z + Math.sin(angle) * radius;
			const inst = await spkmodCreatePetInstance(`showcase_${pet.id}`, pet, true, () => ({ position: { x: px, y: center.y, z: pz }, rotation: { y: 0 } }), () => null);
			if (inst) {
				inst.root.position.set(px, center.y, pz);
				spkmodShowcaseInstances.push(inst);
				spkmodShowPetSpeechBubble(inst, `Lv.${pet.level} ${spkmodGetPetDisplayName(pet)}`);
			}
		}
		if (typeof chatLog === "function") chatLog(spkmodGetPetUiText("showcaseSpawnedToast", spkmodShowcaseInstances.length));
	},
	clearShowcase: () => {
		while (spkmodShowcaseInstances.length > 0) {
			const inst = spkmodShowcaseInstances.pop();
			spkmodDisposePetInstance(inst);
		}
	},
	getBroadcastQueueState: () => ({
		enabled: spkmodIsPetsSystemEnabled(),
		shareInChat: spkmodIsPetChatSharingEnabled(),
		inIsolatedMinigame: spkmodIsInIsolatedMinigame(),
		remotePlayerCount: spkmodGetRemotePlayerCount(),
		needsZoneSync: _spkmodNeedsZoneSync,
		queued: _spkmodQueuedPetBroadcast ? { ..._spkmodQueuedPetBroadcast } : null,
		isUserTyping: spkmodIsUserTypingInChat(),
		waitMs: _spkmodQueuedPetBroadcast ? spkmodComputePetBroadcastWaitMs(Date.now(), _spkmodQueuedPetBroadcast) : 0,
		lastBroadcastAtMs: _spkmodLastBroadcastAtMs,
		lastBroadcastPetId: _spkmodLastBroadcastPetId,
		lastUserChatSentMs: _spkmodLastUserChatSentMs,
		recentUserChatCount: _spkmodRecentUserChatSentTimes.length,
		rejectBackoffRemainingMs: Math.max(0, _spkmodChatRejectBackoffUntilMs - Date.now()),
		chatMinLevelGate: _spkmodChatMinLevelGate
	}),
	list: () => {
		console.table(SPKMOD_PET_CATALOG.map(p => ({
			Level: p.level,
			ID: p.id,
			Icon: p.icon,
			Name: spkmodGetPetDisplayName(p),
			Source: p.source,
			Mode: p.moveMode,
			Trigger: `:pet_${p.id}:`
		})));
	}
};
window.pkmodPets = window.spkmodPets;
