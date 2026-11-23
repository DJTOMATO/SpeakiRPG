// ============================================================================
// IN-GAME 3D SKIN, COSTUME & BODY WIDTH SYSTEM (LEVELS 10-100 PROGRESSION)
// ============================================================================

const SPKMOD_SKIN_STORAGE_KEYS = {
	enabled: "spkmod-skin-enabled",
	equipped: "spkmod-skin-equipped",
	width: "spkmod-skin-width",
	showRemote: "spkmod-skin-show-remote",
	shareInChat: "spkmod-skin-share-chat",
	unlockAll: "spkmod-skin-unlock-all-test"
};

window.spkmodSkinSettings = {
	enabled: (typeof window !== "undefined" && window.localStorage)
		? localStorage.getItem(SPKMOD_SKIN_STORAGE_KEYS.enabled) !== "false"
		: (window.spkmodSkinsSystemEnabled !== false),
	equippedId: (typeof window !== "undefined" && window.localStorage && localStorage.getItem(SPKMOD_SKIN_STORAGE_KEYS.equipped)) || null,
	widthId: (typeof window !== "undefined" && window.localStorage && localStorage.getItem(SPKMOD_SKIN_STORAGE_KEYS.width)) || "normal",
	showRemoteSkins: (typeof window !== "undefined" && window.localStorage) ? localStorage.getItem(SPKMOD_SKIN_STORAGE_KEYS.showRemote) !== "false" : true,
	shareInChat: (typeof window !== "undefined" && window.localStorage) ? localStorage.getItem(SPKMOD_SKIN_STORAGE_KEYS.shareInChat) !== "false" : true,
	unlockAllTest: (typeof window !== "undefined" && window.localStorage) ? localStorage.getItem(SPKMOD_SKIN_STORAGE_KEYS.unlockAll) === "true" : false
};
window.spkmodSkinsSystemEnabled = window.spkmodSkinSettings.enabled !== false;

function spkmodIsSkinsSystemEnabled() {
	return window.spkmodSkinSettings.enabled !== false && window.spkmodSkinsSystemEnabled !== false;
}

function spkmodIsSkinChatSharingEnabled() {
	return spkmodIsSkinsSystemEnabled() && window.spkmodSkinSettings.shareInChat !== false;
}

function spkmodGetSkinsDisabledToastText() {
	if (typeof t === "function") {
		const msg = t("skinsSystemDisabledToast");
		if (msg && msg !== "skinsSystemDisabledToast") return msg;
	}
	return "👕 Skins System is disabled. Enable it in Settings (under Pets).";
}

function spkmodGetSkinsEnabledToastText() {
	if (typeof t === "function") {
		const msg = t("skinsSystemEnabledToast");
		if (msg && msg !== "skinsSystemEnabledToast") return msg;
	}
	return "👕 Skins System enabled.";
}

// ============================================================================
// 1. MULTI-LANGUAGE UI STRINGS (translations.json)
//    - Skin UI labels, skin names & width names live in translations.json
//    - Compact English-only fallbacks are used only until remote JSON loads
// ============================================================================
const SPKMOD_SKIN_UI_FALLBACK_EN = {
	skinsBtnTooltip: "Skin & Costume Wardrobe (Alt+S)",
	skinsModalTitle: "👕 SpeakiMod+ Skin & Body Wardrobe",
	myLevelLabel: "Your Level",
	unlockedLabel: "Unlocked",
	equippedLabel: "Active Skin",
	bodyWidthLabel: "Body Width",
	bodyWidthHint: "Combines with ANY skin (Burger Shop wide-body engine)",
	noneEquipped: "Default Speaki",
	btnEquip: "Equip",
	btnEquipped: "Equipped ✓",
	btnUnequip: "Unequip",
	btnLocked: "Locked (Lv.{0})",
	btnResync: "📡 Sync Map",
	searchPlaceholder: "Search skins by name, category, or level...",
	toggleRemoteSkins: "👁️ Show Others' Skins",
	toggleShareInChat: "📡 Share My Skin with Other Players",
	shareInChatDisabledToast: "📡 Skin sharing is OFF. Enable 'Share My Skin with Other Players' in Wardrobe to sync with others.",
	tabAll: "All",
	tabUnlocked: "Unlocked",
	tabColors: "🎨 Colors (Lv.10-100)",
	tabOutfits: "👒 3D Outfits (Lv.10-100)",
	tabFx: "✨ Special FX (Lv.60-100)",
	catColor: "Outfit Color",
	catOutfit: "3D Costume",
	catFx: "Special FX",
	reqLevel: "Req. Lv.{0}",
	milestoneBadge: "★ LV.100",
	equippedToast: "👕 Equipped Skin: {0} (Lv.{1})!",
	unequippedToast: "👕 Skin unequipped (Default Speaki restored).",
	widthSetToast: "🍔 Body Width set to: {0} ({1}x)!",
	widthLockedToast: "🔒 Requires Level {0} to use {1} body width!",
	lockedToast: "🔒 Requires Level {0} to equip {1}!",
	broadcastToast: "📡 Broadcasted active skin & body to nearby mod players!",
	unknownSkinToast: "❌ Unknown skin: {0}",
	unknownWidthToast: "❌ Unknown body width: {0}",
	testUnlockEnabledToast: "🔓 [Skin Test] All skins & body widths UNLOCKED for testing!",
	testUnlockDisabledToast: "🔒 [Skin Test] Normal level requirements restored.",
	nativeSkinAutoUnequippedToast: "👕 Auto-unequipped your in-game costume and restored Default Speaki!",
	nativeSkinBlockedToast: "🔒 Cannot wear SpeakiMod skins while an in-game costume (Pure Pumpkin / Witch / Ner) is equipped. Unequip it in your Inventory first.",
	nativeSkinClearedModToast: "👕 Unequipped SpeakiMod skin & body width because an in-game costume is active.",
	nativeSkinBannerText: "⚠️ In-game costume equipped (Pure Pumpkin / Witch / Ner) — selecting a SpeakiMod skin or width will automatically switch back to Default Speaki.",
	btnUnequipNativeSkin: "🔄 Switch to Default Speaki",
	hypeTitle: "Keep leveling up to unlock more!",
	hypeDesc: "{0} more mystery skins & 3D costumes await you up to Lv.100! Reach Lv.{1} to unlock your next style!",
	nextWidthHint: "✨ Next Body Width at Lv.{0} ({1} locked)"
};

function spkmodGetSkinActiveLang() {
	if (typeof spkmodGetActiveLang === "function") return spkmodGetActiveLang();
	const raw = (typeof spkmodLang !== "undefined" && spkmodLang) ? spkmodLang : "en";
	if (typeof spkmodTranslations !== "undefined" && spkmodTranslations[raw]) return raw;
	if (raw === "zh") return "zh-CN";
	if (raw === "es") return "es-419";
	return raw || "en";
}

function spkmodGetSkinUiText(key, ...args) {
	const lang = spkmodGetSkinActiveLang();
	const tr = typeof spkmodTranslations !== "undefined" ? spkmodTranslations : null;
	let str = (tr && tr[lang] && tr[lang].skinUi && tr[lang].skinUi[key])
		|| (tr && tr.en && tr.en.skinUi && tr.en.skinUi[key])
		|| SPKMOD_SKIN_UI_FALLBACK_EN[key]
		|| key;
	args.forEach((a, i) => {
		str = str.split(`{${i}}`).join(a);
	});
	return str;
}
window.spkmodGetSkinUiText = spkmodGetSkinUiText;

// ============================================================================
// 2. BODY WIDTH MODIFIER TIERS (TOGGLEABLE + COMBINES WITH ANY SKIN)
// ============================================================================
const SPKMOD_BODY_WIDTH_TIERS = [
	{ id: "normal", level: 1,   scale: 1.0,  icon: "📏", defaultName: "Normal" },
	{ id: "w1",     level: 10,  scale: 1.10, icon: "🍡", defaultName: "Snug" },
	{ id: "w2",     level: 20,  scale: 1.20, icon: "🍙", defaultName: "Plump" },
	{ id: "w3",     level: 30,  scale: 1.30, icon: "🥐", defaultName: "Fluffy" },
	{ id: "w4",     level: 40,  scale: 1.45, icon: "🥟", defaultName: "Chubby" },
	{ id: "w5",     level: 50,  scale: 1.65, icon: "🍕", defaultName: "Thick" },
	{ id: "w6",     level: 60,  scale: 1.90, icon: "🍔", defaultName: "Burger Wide" },
	{ id: "w7",     level: 70,  scale: 2.15, icon: "🎂", defaultName: "Jumbo" },
	{ id: "w8",     level: 80,  scale: 2.40, icon: "🐳", defaultName: "Mega Wide" },
	{ id: "w9",     level: 90,  scale: 2.60, icon: "🛸", defaultName: "Ultra Wide" },
	{ id: "w10",    level: 100, scale: 2.80, icon: "👑", defaultName: "Absolute Unit" }
];
const SPKMOD_BODY_WIDTHS_BY_ID = new Map(SPKMOD_BODY_WIDTH_TIERS.map(w => [w.id, w]));

// ============================================================================
// 3. MASTER SKIN & COSTUME CATALOG
//    - 10 Clean Outfit Colors: Lv. 10, 20, 30, ..., 100
//    - 10 3D Costume Outfits:  Lv. 10, 20, 30, ..., 100
//    - 5 Special Visual FX:    Lv. 60, 70, 80, 90, 100
// ============================================================================
const SPKMOD_SKIN_CATALOG = [
	// --- CLEAN OUTFIT COLORS (EVERY 10 LEVELS: LV 10 -> 100) ---
	{
		id: "color_crimson", level: 10, category: "color", icon: "🔴", accent: "#ef4444",
		defaultName: "Crimson Outfit",
		recolor: { hue: 0, satMul: 3.0, satAdd: 0.20, satMax: 0.85, lightMul: 1.15, lightAdd: 0.07, lightMax: 0.80 }
	},
	{
		id: "color_cobalt", level: 20, category: "color", icon: "🔵", accent: "#3b82f6",
		defaultName: "Cobalt Outfit",
		recolor: { hue: 215, satMul: 3.0, satAdd: 0.20, satMax: 0.85, lightMul: 1.15, lightAdd: 0.07, lightMax: 0.80 }
	},
	{
		id: "color_emerald", level: 30, category: "color", icon: "🟢", accent: "#10b981",
		defaultName: "Emerald Forest Outfit",
		recolor: { hue: 142, satMul: 2.6, satAdd: 0.18, satMax: 0.82, lightMul: 1.10, lightAdd: 0.06, lightMax: 0.78 }
	},
	{
		id: "color_sakura", level: 40, category: "color", icon: "🌸", accent: "#f472b6",
		defaultName: "Sakura Pink Outfit",
		recolor: { hue: 332, satMul: 2.4, satAdd: 0.22, satMax: 0.86, lightMul: 1.32, lightAdd: 0.18, lightMax: 0.86 }
	},
	{
		id: "color_orange", level: 50, category: "color", icon: "🍊", accent: "#f97316",
		defaultName: "Pumpkin Orange Outfit",
		recolor: { hue: 26, satMul: 3.0, satAdd: 0.24, satMax: 0.90, lightMul: 1.18, lightAdd: 0.08, lightMax: 0.80 }
	},
	{
		id: "color_cyan", level: 60, category: "color", icon: "❄️", accent: "#06b6d4",
		defaultName: "Frost Cyan Outfit",
		recolor: { hue: 192, satMul: 2.5, satAdd: 0.20, satMax: 0.86, lightMul: 1.24, lightAdd: 0.12, lightMax: 0.84 }
	},
	{
		id: "color_gold", level: 70, category: "color", icon: "🟡", accent: "#eab308",
		defaultName: "Golden Sunbeam Outfit",
		recolor: { hue: 46, satMul: 3.0, satAdd: 0.25, satMax: 0.92, lightMul: 1.26, lightAdd: 0.12, lightMax: 0.82 }
	},
	{
		id: "color_amethyst", level: 80, category: "color", icon: "💜", accent: "#a855f7",
		defaultName: "Royal Amethyst Outfit",
		recolor: { hue: 274, satMul: 2.8, satAdd: 0.22, satMax: 0.88, lightMul: 1.12, lightAdd: 0.05, lightMax: 0.78 }
	},
	{
		id: "color_obsidian", level: 90, category: "color", icon: "🖤", accent: "#64748b",
		defaultName: "Midnight Obsidian Outfit",
		recolor: { hue: 235, satMul: 0.22, satAdd: 0.02, satMax: 0.16, lightMul: 0.36, lightAdd: -0.02, lightMax: 0.28 }
	},
	{
		id: "color_pearl", level: 100, category: "color", icon: "🤍", accent: "#f8fafc",
		defaultName: "Snow Pearl Outfit",
		recolor: { hue: 210, satMul: 0.14, satAdd: 0.0, satMax: 0.10, lightMul: 0.95, lightAdd: 0.54, lightMax: 0.96 }
	},

	// --- 3D COSTUME OUTFITS (LV 10 -> 100, 66 COSTUMES & ITEM SETS) ---
	{
		id: "costume_copter", level: 10, category: "outfit", icon: "🚁", accent: "#fb923c",
		defaultName: "Pumpkin Copter Speaki",
		useNativeReviveHat: true
	},
	{
		id: "costume_panda", level: 10, category: "outfit", icon: "🐼", accent: "#e2e8f0",
		defaultName: "Bamboo Panda Speaki",
		recolor: { hue: 210, satMul: 0.14, satAdd: 0.0, satMax: 0.10, lightMul: 0.92, lightAdd: 0.50, lightMax: 0.94 },
		costumeBuilder: "panda",
		hideMagicStaff: true
	},
	{
		id: "costume_graduate", level: 10, category: "outfit", icon: "🎓", accent: "#6366f1",
		defaultName: "Scholar Graduate Speaki",
		recolor: { hue: 232, satMul: 0.85, satAdd: 0.08, satMax: 0.36, lightMul: 0.42, lightAdd: -0.02, lightMax: 0.32 },
		costumeBuilder: "graduate",
		hideMagicStaff: true
	},
	{
		id: "costume_burger", level: 15, category: "outfit", icon: "🍔", accent: "#f59e0b",
		defaultName: "Burger Mascot Speaki",
		recolor: { hue: 10, satMul: 3.0, satAdd: 0.22, satMax: 0.88, lightMul: 1.15, lightAdd: 0.06, lightMax: 0.78 },
		costumeBuilder: "burger"
	},
	{
		id: "costume_angler", level: 15, category: "outfit", icon: "🎣", accent: "#06b6d4",
		defaultName: "Angler Fisher Speaki",
		recolor: { hue: 196, satMul: 2.6, satAdd: 0.20, satMax: 0.84, lightMul: 1.16, lightAdd: 0.08, lightMax: 0.78 },
		costumeBuilder: "angler",
		hideMagicStaff: true
	},
	{
		id: "costume_bee", level: 15, category: "outfit", icon: "🐝", accent: "#facc15",
		defaultName: "Honey Bee Speaki",
		recolor: { hue: 46, satMul: 3.1, satAdd: 0.25, satMax: 0.92, lightMul: 1.24, lightAdd: 0.12, lightMax: 0.82 },
		costumeBuilder: "bee",
		hideMagicStaff: true
	},
	{
		id: "costume_painter", level: 15, category: "outfit", icon: "🎨", accent: "#f43f5e",
		defaultName: "Painter Artist Speaki",
		recolor: { hue: 344, satMul: 2.5, satAdd: 0.20, satMax: 0.82, lightMul: 1.18, lightAdd: 0.10, lightMax: 0.80 },
		costumeBuilder: "painter",
		hideMagicStaff: true
	},
	{
		id: "costume_miner", level: 20, category: "outfit", icon: "⛑️", accent: "#facc15",
		defaultName: "Miner Speaki",
		recolor: { hue: 42, satMul: 2.4, satAdd: 0.18, satMax: 0.82, lightMul: 1.12, lightAdd: 0.06, lightMax: 0.78 },
		costumeBuilder: "miner"
	},
	{
		id: "costume_teddy", level: 20, category: "outfit", icon: "🐻", accent: "#b45309",
		defaultName: "Cozy Teddy Bear Speaki",
		recolor: { hue: 28, satMul: 2.4, satAdd: 0.18, satMax: 0.78, lightMul: 1.02, lightAdd: 0.04, lightMax: 0.68 },
		costumeBuilder: "teddy",
		hideMagicStaff: true
	},
	{
		id: "costume_nurse", level: 20, category: "outfit", icon: "🩺", accent: "#fb7185",
		defaultName: "Nurse Medic Speaki",
		recolor: { hue: 342, satMul: 0.90, satAdd: 0.08, satMax: 0.36, lightMul: 1.15, lightAdd: 0.42, lightMax: 0.94 },
		costumeBuilder: "nurse",
		hideMagicStaff: true
	},
	{
		id: "costume_beach", level: 20, category: "outfit", icon: "🏖️", accent: "#38bdf8",
		defaultName: "Summer Beach Speaki",
		recolor: { hue: 192, satMul: 2.8, satAdd: 0.24, satMax: 0.88, lightMul: 1.32, lightAdd: 0.16, lightMax: 0.86 },
		costumeBuilder: "beach",
		hideMagicStaff: true
	},
	{
		id: "costume_bunny", level: 25, category: "outfit", icon: "🐰", accent: "#e879f9",
		defaultName: "Fluffy Bunny Speaki",
		recolor: { hue: 300, satMul: 1.6, satAdd: 0.16, satMax: 0.68, lightMul: 1.32, lightAdd: 0.22, lightMax: 0.88 },
		costumeBuilder: "bunny"
	},
	{
		id: "costume_idol", level: 25, category: "outfit", icon: "🎤", accent: "#ec4899",
		defaultName: "Pop Idol Speaki",
		recolor: { hue: 325, satMul: 2.9, satAdd: 0.24, satMax: 0.90, lightMul: 1.24, lightAdd: 0.14, lightMax: 0.84 },
		costumeBuilder: "idol",
		hideMagicStaff: true
	},
	{
		id: "costume_shiba", level: 25, category: "outfit", icon: "🐶", accent: "#f59e0b",
		defaultName: "Shiba Inu Speaki",
		recolor: { hue: 34, satMul: 2.9, satAdd: 0.22, satMax: 0.86, lightMul: 1.24, lightAdd: 0.12, lightMax: 0.82 },
		costumeBuilder: "shiba",
		hideMagicStaff: true
	},
	{
		id: "costume_miko", level: 25, category: "outfit", icon: "🌸", accent: "#f472b6",
		defaultName: "Sakura Miko Speaki",
		recolor: { hue: 346, satMul: 2.8, satAdd: 0.22, satMax: 0.88, lightMul: 1.24, lightAdd: 0.14, lightMax: 0.84 },
		costumeBuilder: "miko",
		hideMagicStaff: true
	},
	{
		id: "costume_chef", level: 30, category: "outfit", icon: "👨‍🍳", accent: "#f8fafc",
		defaultName: "Head Chef Speaki",
		recolor: { hue: 210, satMul: 0.14, satAdd: 0.0, satMax: 0.10, lightMul: 0.95, lightAdd: 0.54, lightMax: 0.96 },
		costumeBuilder: "chef"
	},
	{
		id: "costume_soldier", level: 30, category: "outfit", icon: "🪖", accent: "#65a30d",
		defaultName: "Combat Soldier Speaki",
		recolor: { hue: 96, satMul: 1.8, satAdd: 0.14, satMax: 0.58, lightMul: 0.78, lightAdd: 0.02, lightMax: 0.52 },
		costumeBuilder: "soldier",
		hideMagicStaff: true
	},
	{
		id: "costume_police", level: 30, category: "outfit", icon: "👮", accent: "#2563eb",
		defaultName: "Patrol Officer Speaki",
		recolor: { hue: 220, satMul: 2.6, satAdd: 0.20, satMax: 0.82, lightMul: 0.72, lightAdd: 0.0, lightMax: 0.50 },
		costumeBuilder: "police",
		hideMagicStaff: true
	},
	{
		id: "costume_dj", level: 30, category: "outfit", icon: "🎧", accent: "#06b6d4",
		defaultName: "Neon DJ Speaki",
		recolor: { hue: 268, satMul: 2.6, satAdd: 0.20, satMax: 0.84, lightMul: 0.62, lightAdd: 0.0, lightMax: 0.44 },
		costumeBuilder: "dj",
		hideMagicStaff: true
	},
	{
		id: "costume_pirate", level: 35, category: "outfit", icon: "🏴‍☠️", accent: "#ef4444",
		defaultName: "Pirate Captain Speaki",
		recolor: { hue: 355, satMul: 2.6, satAdd: 0.20, satMax: 0.84, lightMul: 0.84, lightAdd: 0.02, lightMax: 0.56 },
		costumeBuilder: "pirate"
	},
	{
		id: "costume_vampire", level: 35, category: "outfit", icon: "🧛", accent: "#be123c",
		defaultName: "Vampire Count Speaki",
		recolor: { hue: 350, satMul: 2.4, satAdd: 0.18, satMax: 0.78, lightMul: 0.44, lightAdd: -0.02, lightMax: 0.34 },
		costumeBuilder: "vampire",
		hideMagicStaff: true
	},
	{
		id: "costume_barista", level: 35, category: "outfit", icon: "☕", accent: "#a16207",
		defaultName: "Barista Cafe Speaki",
		recolor: { hue: 24, satMul: 2.0, satAdd: 0.14, satMax: 0.64, lightMul: 0.74, lightAdd: 0.0, lightMax: 0.50 },
		costumeBuilder: "barista",
		hideMagicStaff: true
	},
	{
		id: "costume_archer", level: 35, category: "outfit", icon: "🏹", accent: "#16a34a",
		defaultName: "Forest Archer Speaki",
		recolor: { hue: 138, satMul: 2.6, satAdd: 0.20, satMax: 0.82, lightMul: 0.84, lightAdd: 0.02, lightMax: 0.58 },
		costumeBuilder: "archer",
		hideMagicStaff: true
	},
	{
		id: "costume_neko", level: 40, category: "outfit", icon: "🐱", accent: "#f472b6",
		defaultName: "Neko (Cat) Speaki",
		recolor: { hue: 332, satMul: 2.2, satAdd: 0.20, satMax: 0.82, lightMul: 1.28, lightAdd: 0.16, lightMax: 0.85 },
		costumeBuilder: "neko"
	},
	{
		id: "costume_shark", level: 40, category: "outfit", icon: "🦈", accent: "#0ea5e9",
		defaultName: "Ocean Shark Speaki",
		recolor: { hue: 204, satMul: 2.2, satAdd: 0.18, satMax: 0.76, lightMul: 1.06, lightAdd: 0.06, lightMax: 0.74 },
		costumeBuilder: "shark",
		hideMagicStaff: true
	},
	{
		id: "costume_firefighter", level: 40, category: "outfit", icon: "🚒", accent: "#dc2626",
		defaultName: "Firefighter Speaki",
		recolor: { hue: 4, satMul: 3.1, satAdd: 0.24, satMax: 0.90, lightMul: 1.02, lightAdd: 0.04, lightMax: 0.68 },
		costumeBuilder: "firefighter",
		hideMagicStaff: true
	},
	{
		id: "costume_kitsune", level: 45, category: "outfit", icon: "🦊", accent: "#f97316",
		defaultName: "Kitsune (Foxgirl) Speaki",
		recolor: { hue: 18, satMul: 3.1, satAdd: 0.24, satMax: 0.90, lightMul: 1.18, lightAdd: 0.08, lightMax: 0.80 },
		costumeBuilder: "kitsune"
	},
	{
		id: "costume_gentleman", level: 45, category: "outfit", icon: "🎩", accent: "#94a3b8",
		defaultName: "Gentleman Top Hat Speaki",
		recolor: { hue: 230, satMul: 0.20, satAdd: 0.02, satMax: 0.14, lightMul: 0.34, lightAdd: -0.02, lightMax: 0.26 },
		costumeBuilder: "gentleman"
	},
	{
		id: "costume_rockstar", level: 45, category: "outfit", icon: "🎸", accent: "#c026d3",
		defaultName: "Rockstar Guitar Speaki",
		recolor: { hue: 280, satMul: 2.2, satAdd: 0.16, satMax: 0.72, lightMul: 0.46, lightAdd: -0.02, lightMax: 0.36 },
		costumeBuilder: "rockstar",
		hideMagicStaff: true
	},
	{
		id: "costume_alchemist", level: 45, category: "outfit", icon: "🧪", accent: "#22c55e",
		defaultName: "Mad Alchemist Speaki",
		recolor: { hue: 158, satMul: 2.4, satAdd: 0.18, satMax: 0.78, lightMul: 0.84, lightAdd: 0.02, lightMax: 0.58 },
		costumeBuilder: "alchemist",
		hideMagicStaff: true
	},
	{
		id: "costume_jester", level: 45, category: "outfit", icon: "🤡", accent: "#a855f7",
		defaultName: "Circus Jester Speaki",
		recolor: { hue: 292, satMul: 3.0, satAdd: 0.24, satMax: 0.90, lightMul: 1.14, lightAdd: 0.08, lightMax: 0.78 },
		costumeBuilder: "jester",
		hideMagicStaff: true
	},
	{
		id: "costume_santa", level: 50, category: "outfit", icon: "🎅", accent: "#ef4444",
		defaultName: "Santa Winter Speaki",
		recolor: { hue: 356, satMul: 3.1, satAdd: 0.24, satMax: 0.88, lightMul: 1.12, lightAdd: 0.06, lightMax: 0.76 },
		costumeBuilder: "santa"
	},
	{
		id: "costume_swat", level: 50, category: "outfit", icon: "🚓", accent: "#3b82f6",
		defaultName: "SWAT Breacher Speaki",
		recolor: { hue: 222, satMul: 1.4, satAdd: 0.10, satMax: 0.44, lightMul: 0.42, lightAdd: -0.02, lightMax: 0.34 },
		costumeBuilder: "swat",
		hideMagicStaff: true
	},
	{
		id: "costume_reindeer", level: 50, category: "outfit", icon: "🦌", accent: "#d97706",
		defaultName: "Forest Reindeer Speaki",
		recolor: { hue: 25, satMul: 2.5, satAdd: 0.18, satMax: 0.78, lightMul: 0.94, lightAdd: 0.04, lightMax: 0.64 },
		costumeBuilder: "reindeer",
		hideMagicStaff: true
	},
	{
		id: "costume_racer", level: 50, category: "outfit", icon: "🏎️", accent: "#ef4444",
		defaultName: "Turbo Racer Speaki",
		recolor: { hue: 358, satMul: 3.2, satAdd: 0.25, satMax: 0.92, lightMul: 1.10, lightAdd: 0.06, lightMax: 0.74 },
		costumeBuilder: "racer",
		hideMagicStaff: true
	},
	{
		id: "costume_pumpkin", level: 55, category: "outfit", icon: "🎃", accent: "#fb923c",
		defaultName: "Jack-o'-Lantern Speaki",
		recolor: { hue: 26, satMul: 3.0, satAdd: 0.24, satMax: 0.90, lightMul: 1.16, lightAdd: 0.07, lightMax: 0.78 },
		costumeBuilder: "pumpkin"
	},
	{
		id: "costume_mage", level: 55, category: "outfit", icon: "📖", accent: "#6366f1",
		defaultName: "Archmage Grimoire Speaki",
		recolor: { hue: 255, satMul: 2.8, satAdd: 0.22, satMax: 0.88, lightMul: 0.94, lightAdd: 0.04, lightMax: 0.68 },
		costumeBuilder: "mage"
	},
	{
		id: "costume_ninja", level: 55, category: "outfit", icon: "🥷", accent: "#64748b",
		defaultName: "Shadow Ninja Speaki",
		recolor: { hue: 235, satMul: 0.35, satAdd: 0.04, satMax: 0.22, lightMul: 0.34, lightAdd: -0.02, lightMax: 0.26 },
		costumeBuilder: "ninja",
		hideMagicStaff: true
	},
	{
		id: "costume_wizard", level: 60, category: "outfit", icon: "🧙", accent: "#818cf8",
		defaultName: "Starry Wizard Speaki",
		recolor: { hue: 248, satMul: 2.6, satAdd: 0.22, satMax: 0.86, lightMul: 0.86, lightAdd: 0.02, lightMax: 0.62 },
		costumeBuilder: "wizard"
	},
	{
		id: "costume_agent", level: 60, category: "outfit", icon: "🕶️", accent: "#94a3b8",
		defaultName: "Secret Agent Speaki",
		recolor: { hue: 225, satMul: 0.22, satAdd: 0.02, satMax: 0.16, lightMul: 0.34, lightAdd: -0.02, lightMax: 0.26 },
		costumeBuilder: "agent",
		hideMagicStaff: true
	},
	{
		id: "costume_viking", level: 60, category: "outfit", icon: "🪓", accent: "#b45309",
		defaultName: "Viking Berserker Speaki",
		recolor: { hue: 20, satMul: 2.2, satAdd: 0.16, satMax: 0.72, lightMul: 0.70, lightAdd: 0.0, lightMax: 0.48 },
		costumeBuilder: "viking",
		hideMagicStaff: true
	},
	{
		id: "costume_mystic", level: 60, category: "outfit", icon: "🔮", accent: "#a855f7",
		defaultName: "Fortune Mystic Speaki",
		recolor: { hue: 278, satMul: 2.8, satAdd: 0.22, satMax: 0.88, lightMul: 0.88, lightAdd: 0.02, lightMax: 0.64 },
		costumeBuilder: "mystic"
	},
	{
		id: "costume_vip", level: 65, category: "outfit", icon: "😎", accent: "#fbbf24",
		defaultName: "VIP Shades Speaki",
		recolor: { hue: 235, satMul: 0.25, satAdd: 0.02, satMax: 0.18, lightMul: 0.38, lightAdd: -0.02, lightMax: 0.30 },
		costumeBuilder: "vip"
	},
	{
		id: "costume_cowboy", level: 65, category: "outfit", icon: "🤠", accent: "#d97706",
		defaultName: "Cowboy Outlaw Speaki",
		recolor: { hue: 28, satMul: 2.2, satAdd: 0.16, satMax: 0.72, lightMul: 0.86, lightAdd: 0.02, lightMax: 0.58 },
		costumeBuilder: "cowboy",
		hideMagicStaff: true
	},
	{
		id: "costume_mecha", level: 65, category: "outfit", icon: "🤖", accent: "#38bdf8",
		defaultName: "Mecha Cyber Speaki",
		recolor: { hue: 205, satMul: 1.1, satAdd: 0.08, satMax: 0.44, lightMul: 1.12, lightAdd: 0.16, lightMax: 0.82 },
		costumeBuilder: "mecha",
		hideMagicStaff: true
	},
	{
		id: "costume_tactical", level: 70, category: "outfit", icon: "🔫", accent: "#84cc16",
		defaultName: "Tactical Speakov Speaki",
		recolor: { hue: 88, satMul: 1.4, satAdd: 0.10, satMax: 0.45, lightMul: 0.72, lightAdd: 0.0, lightMax: 0.48 },
		costumeBuilder: "tactical",
		hideMagicStaff: true
	},
	{
		id: "costume_pharaoh", level: 70, category: "outfit", icon: "🏺", accent: "#eab308",
		defaultName: "Pharaoh Empress Speaki",
		recolor: { hue: 46, satMul: 3.1, satAdd: 0.25, satMax: 0.92, lightMul: 1.24, lightAdd: 0.12, lightMax: 0.82 },
		costumeBuilder: "pharaoh",
		hideMagicStaff: true
	},
	{
		id: "costume_alien", level: 70, category: "outfit", icon: "👽", accent: "#4ade80",
		defaultName: "Alien Invader Speaki",
		recolor: { hue: 136, satMul: 3.0, satAdd: 0.24, satMax: 0.90, lightMul: 1.12, lightAdd: 0.06, lightMax: 0.76 },
		costumeBuilder: "alien",
		hideMagicStaff: true
	},
	{
		id: "costume_knight", level: 75, category: "outfit", icon: "🛡️", accent: "#60a5fa",
		defaultName: "Paladin Knight Speaki",
		recolor: { hue: 215, satMul: 2.2, satAdd: 0.16, satMax: 0.76, lightMul: 1.08, lightAdd: 0.08, lightMax: 0.78 },
		costumeBuilder: "knight"
	},
	{
		id: "costume_blacksmith", level: 75, category: "outfit", icon: "🔨", accent: "#fb7185",
		defaultName: "Forge Hammer Speaki",
		recolor: { hue: 12, satMul: 1.8, satAdd: 0.12, satMax: 0.56, lightMul: 0.56, lightAdd: 0.0, lightMax: 0.40 },
		costumeBuilder: "blacksmith",
		hideMagicStaff: true
	},
	{
		id: "costume_frost", level: 75, category: "outfit", icon: "❄️", accent: "#67e8f9",
		defaultName: "Frost Queen Speaki",
		recolor: { hue: 196, satMul: 2.2, satAdd: 0.20, satMax: 0.82, lightMul: 1.38, lightAdd: 0.24, lightMax: 0.90 },
		costumeBuilder: "frost",
		hideMagicStaff: true
	},
	{
		id: "costume_devil", level: 80, category: "outfit", icon: "😈", accent: "#dc2626",
		defaultName: "Devil Speaki",
		recolor: { hue: 352, satMul: 2.0, satAdd: 0.15, satMax: 0.70, lightMul: 0.48, lightAdd: -0.02, lightMax: 0.36 },
		costumeBuilder: "devil"
	},
	{
		id: "costume_rainy", level: 80, category: "outfit", icon: "☂️", accent: "#facc15",
		defaultName: "Rainy Frog Speaki",
		recolor: { hue: 48, satMul: 3.0, satAdd: 0.25, satMax: 0.92, lightMul: 1.28, lightAdd: 0.14, lightMax: 0.84 },
		costumeBuilder: "rainy",
		hideMagicStaff: true
	},
	{
		id: "costume_poseidon", level: 80, category: "outfit", icon: "🔱", accent: "#06b6d4",
		defaultName: "Sea Poseidon Speaki",
		recolor: { hue: 188, satMul: 3.0, satAdd: 0.24, satMax: 0.90, lightMul: 1.12, lightAdd: 0.06, lightMax: 0.76 },
		costumeBuilder: "poseidon",
		hideMagicStaff: true
	},
	{
		id: "costume_fairy", level: 85, category: "outfit", icon: "🦋", accent: "#22d3ee",
		defaultName: "Fairy Butterfly Speaki",
		recolor: { hue: 185, satMul: 2.4, satAdd: 0.22, satMax: 0.86, lightMul: 1.32, lightAdd: 0.18, lightMax: 0.88 },
		costumeBuilder: "fairy"
	},
	{
		id: "costume_sniper", level: 85, category: "outfit", icon: "🎯", accent: "#22c55e",
		defaultName: "Ghost Sniper Speaki",
		recolor: { hue: 128, satMul: 1.7, satAdd: 0.12, satMax: 0.52, lightMul: 0.62, lightAdd: 0.0, lightMax: 0.44 },
		costumeBuilder: "sniper",
		hideMagicStaff: true
	},
	{
		id: "costume_netrunner", level: 85, category: "outfit", icon: "⚡", accent: "#e879f9",
		defaultName: "Cyber Netrunner Speaki",
		recolor: { hue: 296, satMul: 2.8, satAdd: 0.22, satMax: 0.88, lightMul: 0.54, lightAdd: 0.0, lightMax: 0.40 },
		costumeBuilder: "netrunner",
		hideMagicStaff: true
	},
	{
		id: "costume_angel", level: 90, category: "outfit", icon: "👼", accent: "#fde047",
		defaultName: "Angel Speaki",
		recolor: { hue: 50, satMul: 0.25, satAdd: 0.04, satMax: 0.20, lightMul: 0.98, lightAdd: 0.52, lightMax: 0.95 },
		costumeBuilder: "angel"
	},
	{
		id: "costume_reaper", level: 90, category: "outfit", icon: "💀", accent: "#22d3ee",
		defaultName: "Grim Reaper Speaki",
		recolor: { hue: 265, satMul: 0.60, satAdd: 0.06, satMax: 0.32, lightMul: 0.32, lightAdd: -0.02, lightMax: 0.24 },
		costumeBuilder: "reaper",
		hideMagicStaff: true
	},
	{
		id: "costume_samurai", level: 95, category: "outfit", icon: "⚔️", accent: "#f43f5e",
		defaultName: "Samurai Shogun Speaki",
		recolor: { hue: 350, satMul: 2.8, satAdd: 0.22, satMax: 0.86, lightMul: 0.70, lightAdd: 0.0, lightMax: 0.48 },
		costumeBuilder: "samurai",
		hideMagicStaff: true
	},
	{
		id: "costume_commando", level: 95, category: "outfit", icon: "🔥", accent: "#ef4444",
		defaultName: "Heavy Commando Speaki",
		recolor: { hue: 358, satMul: 1.6, satAdd: 0.12, satMax: 0.50, lightMul: 0.48, lightAdd: -0.01, lightMax: 0.36 },
		costumeBuilder: "commando",
		hideMagicStaff: true
	},
	{
		id: "costume_valkyrie", level: 95, category: "outfit", icon: "🌌", accent: "#818cf8",
		defaultName: "Starlight Valkyrie Speaki",
		recolor: { hue: 238, satMul: 2.6, satAdd: 0.20, satMax: 0.84, lightMul: 1.18, lightAdd: 0.16, lightMax: 0.84 },
		costumeBuilder: "valkyrie",
		hideMagicStaff: true
	},
	{
		id: "costume_royal", level: 100, category: "outfit", icon: "👑", accent: "#ffd700",
		defaultName: "Royal Monarch Speaki",
		recolor: { hue: 274, satMul: 2.9, satAdd: 0.24, satMax: 0.90, lightMul: 1.04, lightAdd: 0.04, lightMax: 0.72 },
		costumeBuilder: "royal"
	},
	{
		id: "costume_astronaut", level: 100, category: "outfit", icon: "🚀", accent: "#38bdf8",
		defaultName: "Galactic Commander Speaki",
		recolor: { hue: 210, satMul: 0.14, satAdd: 0.0, satMax: 0.10, lightMul: 0.95, lightAdd: 0.54, lightMax: 0.96 },
		costumeBuilder: "astronaut"
	},
	{
		id: "costume_dragon", level: 100, category: "outfit", icon: "🐉", accent: "#ef4444",
		defaultName: "Dragon Slayer Speaki",
		recolor: { hue: 356, satMul: 3.1, satAdd: 0.24, satMax: 0.90, lightMul: 0.88, lightAdd: 0.02, lightMax: 0.60 },
		costumeBuilder: "dragon",
		hideMagicStaff: true
	},
	{
		id: "costume_phoenix", level: 100, category: "outfit", icon: "☀️", accent: "#fb923c",
		defaultName: "Solar Phoenix Speaki",
		recolor: { hue: 22, satMul: 3.2, satAdd: 0.26, satMax: 0.94, lightMul: 1.24, lightAdd: 0.10, lightMax: 0.82 },
		costumeBuilder: "phoenix",
		hideMagicStaff: true
	},

	// --- SPECIAL VISUAL FX SKINS (LV 60 -> 100) ---
	{
		id: "fx_ghost", level: 60, category: "fx", icon: "👻", accent: "#67e8f9",
		defaultName: "Spectral Ghost Speaki",
		fxMode: "ghost"
	},
	{
		id: "fx_ice", level: 70, category: "fx", icon: "🧊", accent: "#38bdf8",
		defaultName: "Crystal Ice Speaki",
		fxMode: "ice"
	},
	{
		id: "fx_shadow", level: 80, category: "fx", icon: "👤", accent: "#7c3aed",
		defaultName: "Void Shadow Speaki",
		fxMode: "shadow"
	},
	{
		id: "fx_gold", level: 90, category: "fx", icon: "🏆", accent: "#f59e0b",
		defaultName: "Golden Statue Speaki",
		fxMode: "gold"
	},
	{
		id: "fx_rainbow", level: 100, category: "fx", icon: "🌈", accent: "#ec4899",
		defaultName: "Rainbow Prism Speaki",
		fxMode: "rainbow"
	}
];

const SPKMOD_SKINS_BY_ID = new Map(SPKMOD_SKIN_CATALOG.map(s => [s.id, s]));

function spkmodGetSkinDisplayName(skin) {
	if (!skin) return "";
	const lang = spkmodGetSkinActiveLang();
	const tr = typeof spkmodTranslations !== "undefined" ? spkmodTranslations : null;
	return (tr && tr[lang] && tr[lang].skinNames && tr[lang].skinNames[skin.id])
		|| (tr && tr.en && tr.en.skinNames && tr.en.skinNames[skin.id])
		|| skin.defaultName
		|| skin.id;
}

function spkmodGetWidthDisplayName(widthTier) {
	if (!widthTier) return "";
	const lang = spkmodGetSkinActiveLang();
	const tr = typeof spkmodTranslations !== "undefined" ? spkmodTranslations : null;
	return (tr && tr[lang] && tr[lang].skinWidths && tr[lang].skinWidths[widthTier.id])
		|| (tr && tr.en && tr.en.skinWidths && tr.en.skinWidths[widthTier.id])
		|| widthTier.defaultName
		|| widthTier.id;
}

function spkmodGetSkinPlayerLevel() {
	if (typeof gameState !== "undefined" && gameState?.myStat?.level) {
		return Number(gameState.myStat.level) || 1;
	}
	return 1;
}

function spkmodIsSkinUnlocked(skin) {
	if (!skin) return false;
	if (window.spkmodSkinSettings.unlockAllTest) return true;
	return spkmodGetSkinPlayerLevel() >= skin.level;
}

function spkmodIsWidthUnlocked(widthTier) {
	if (!widthTier) return false;
	if (widthTier.level <= 1) return true;
	if (window.spkmodSkinSettings.unlockAllTest) return true;
	return spkmodGetSkinPlayerLevel() >= widthTier.level;
}

function spkmodCheckRemoteLevelAllowed(requiredLevel, remoteLevel, senderName) {
	if (!requiredLevel || requiredLevel <= 1) return true;
	if (senderName && typeof spkmodIsVipUser === "function" && spkmodIsVipUser(senderName)) {
		return true;
	}
	const lvl = Number(remoteLevel);
	if (!isFinite(lvl) || lvl <= 0) {
		// Remote player level not loaded yet; deny until verified or allow only once known
		return false;
	}
	return lvl >= requiredLevel;
}

// ============================================================================
// 4. OUTFIT TEXTURE RECOLOR ENGINE (EXACT NATIVE Map_Body.png HSL MASK)
// ============================================================================
const SPKMOD_SKIN_BODY_TEX_URL = "/models/speaki/Map_Body.png";
let _spkmodSkinBaseBodyImgPromise = null;
const _spkmodSkinRecolorTexCache = new Map();

function spkmodSkinRgbToHsl(r, g, b) {
	const max = Math.max(r, g, b), min = Math.min(r, g, b);
	const l = (max + min) / 2;
	if (max === min) return [0, 0, l];
	const d = max - min;
	const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	let h;
	if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
	else if (max === g) h = (b - r) / d + 2;
	else h = (r - g) / d + 4;
	return [h * 60, s, l];
}

function spkmodSkinHslToRgb(h, s, l) {
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const hp = (((h % 360) + 360) % 360) / 60;
	const x = c * (1 - Math.abs((hp % 2) - 1));
	let r = 0, g = 0, b = 0;
	if (hp < 1) { r = c; g = x; }
	else if (hp < 2) { r = x; g = c; }
	else if (hp < 3) { g = c; b = x; }
	else if (hp < 4) { g = x; b = c; }
	else if (hp < 5) { r = x; b = c; }
	else { r = c; b = x; }
	const m = l - c / 2;
	return [r + m, g + m, b + m];
}

function spkmodLoadBaseBodyImage() {
	if (_spkmodSkinBaseBodyImgPromise) return _spkmodSkinBaseBodyImgPromise;
	_spkmodSkinBaseBodyImgPromise = new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = (err) => {
			_spkmodSkinBaseBodyImgPromise = null;
			reject(err);
		};
		img.src = SPKMOD_SKIN_BODY_TEX_URL;
	});
	return _spkmodSkinBaseBodyImgPromise;
}

async function spkmodGetRecoloredBodyTexture(skinId, spec) {
	if (!spec) return null;
	if (_spkmodSkinRecolorTexCache.has(skinId)) {
		return _spkmodSkinRecolorTexCache.get(skinId);
	}
	const promise = (async () => {
		const THREE = (window.THREE && window.THREE.CanvasTexture)
			? window.THREE
			: ((typeof spkmodEnsureThree === "function") ? await spkmodEnsureThree() : window.THREE);
		if (!THREE || !THREE.CanvasTexture) return null;
		const img = await spkmodLoadBaseBodyImage();
		const canvas = document.createElement("canvas");
		canvas.width = img.naturalWidth || img.width;
		canvas.height = img.naturalHeight || img.height;
		const ctx = canvas.getContext("2d");
		if (!ctx) return null;
		ctx.drawImage(img, 0, 0);
		const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const data = imgData.data;

		// Map_Body.png dress pixel mask:
		// - Right half (x >= 0.5w): outer veil, sleeves, bodice, skirt, shoes
		// - Lower-left UV island (x >= 0.22w, y >= 0.76h): veil/gown interior lining
		const rightHalfX = Math.floor(canvas.width * 0.5);
		const innerMinX = Math.floor(canvas.width * 0.22);
		const innerMinY = Math.floor(canvas.height * 0.76);
		const hueMin = 250, hueMax = 350, maxLight = 0.55, minSat = 0.04;
		const targetHue = spec.hue ?? 0;
		const satMul = spec.satMul ?? 3.0;
		const satAdd = spec.satAdd ?? 0.20;
		const satMax = spec.satMax ?? 0.85;
		const lightMul = spec.lightMul ?? 1.15;
		const lightAdd = spec.lightAdd ?? 0.07;
		const lightMax = spec.lightMax ?? 0.80;

		for (let y = 0; y < canvas.height; y++) {
			const rowStartX = (y >= innerMinY) ? innerMinX : rightHalfX;
			for (let x = rowStartX; x < canvas.width; x++) {
				const idx = (y * canvas.width + x) * 4;
				if (data[idx + 3] === 0) continue;
				const [h, s, l] = spkmodSkinRgbToHsl(data[idx] / 255, data[idx + 1] / 255, data[idx + 2] / 255);
				if (s < minSat || l > maxLight || h < hueMin || h > hueMax) continue;
				const ns = Math.max(0, Math.min(satMax, s * satMul + satAdd));
				const nl = Math.max(0.03, Math.min(lightMax, l * lightMul + lightAdd));
				const [nr, ng, nb] = spkmodSkinHslToRgb(targetHue, ns, nl);
				data[idx] = Math.round(nr * 255);
				data[idx + 1] = Math.round(ng * 255);
				data[idx + 2] = Math.round(nb * 255);
			}
		}
		ctx.putImageData(imgData, 0, 0);
		const tex = new THREE.CanvasTexture(canvas);
		if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
		tex.needsUpdate = true;
		return tex;
	})().catch(err => {
		console.warn("[SpeakiMod+ Skins] Failed to generate recolored body texture:", skinId, err);
		_spkmodSkinRecolorTexCache.delete(skinId);
		return null;
	});
	_spkmodSkinRecolorTexCache.set(skinId, promise);
	return promise;
}

// ============================================================================
// 5. 3D COSTUME & ACCESSORY BUILDERS (REAL GLBs + TOON-SHADED COSTUME PARTS)
// ============================================================================
const _spkmodSkinGlbCache = new Map();

async function spkmodSkinLoadGlb(url) {
	if (_spkmodSkinGlbCache.has(url)) return _spkmodSkinGlbCache.get(url);
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
		return await loader.loadAsync(url);
	})().catch(err => {
		console.warn("[SpeakiMod+ Skins] Failed to load GLB:", url, err);
		_spkmodSkinGlbCache.delete(url);
		return null;
	});
	_spkmodSkinGlbCache.set(url, promise);
	return promise;
}

function spkmodSkinMarkSharedGlb(obj) {
	if (!obj || typeof obj.traverse !== "function") return;
	obj.traverse(child => {
		if (!child) return;
		child.userData = child.userData || {};
		child.userData.spkmodSkinSharedGlb = true;
	});
}

function spkmodSkinSanitizeObject(obj) {
	if (!obj || typeof obj.traverse !== "function") return;
	obj.userData = obj.userData || {};
	obj.userData.spkmodSkinAttachment = true;
	obj.traverse(child => {
		if (!child) return;
		child.userData = child.userData || {};
		child.userData.spkmodSkinAttachment = true;
		if (child.isMesh) {
			child.raycast = () => {};
			child.frustumCulled = false;
			child.castShadow = false;
			child.receiveShadow = false;
			child.userData.spkmodNoShadow = true;
			if (child.material) {
				const mats = Array.isArray(child.material) ? child.material : [child.material];
				for (const m of mats) {
					if (m && !m.userData) m.userData = {};
				}
			}
		}
	});
}

function spkmodSkinFindSkeletonBones(root) {
	const bones = [];
	if (!root || typeof root.traverse !== "function") return { head: null, spine: null, pelvis: null, rightHand: null, leftHand: null, reviveHat: null };
	let reviveHat = null;
	root.traverse(o => {
		if (!o) return;
		if (o.isBone) bones.push(o);
		if (o.name === "ReviveHatRoot") reviveHat = o;
	});
	const clean = s => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
	const head = (reviveHat && reviveHat.parent && reviveHat.parent.isBone ? reviveHat.parent : null)
		|| bones.find(b => /head/i.test(b.name) && !/nub|end|top/i.test(b.name))
		|| bones.find(b => clean(b.name).includes("head"))
		|| null;
	const spine = bones.find(b => /spine2|chest|upperchest/i.test(clean(b.name)))
		|| bones.find(b => /spine1/i.test(clean(b.name)))
		|| bones.find(b => /spine/i.test(clean(b.name)))
		|| null;
	const pelvis = bones.find(b => /pelvis|hips|hip/i.test(clean(b.name)))
		|| spine
		|| null;
	const rightHand = bones.find(b => {
		const c = clean(b.name);
		return (c.includes("rhand") || c.includes("righthand")) && !c.includes("finger");
	}) || null;
	const leftHand = bones.find(b => {
		const c = clean(b.name);
		return (c.includes("lhand") || c.includes("lefthand")) && !c.includes("finger");
	}) || null;
	return { head, spine, pelvis, rightHand, leftHand, reviveHat };
}

function spkmodSkinCreateHeadAnchor(avatarRoot, headBone, reviveHat) {
	const THREE = window.THREE;
	if (!THREE || !headBone) return null;
	const anchor = new THREE.Group();
	anchor.name = "spkmod_skin_head_anchor";
	anchor.userData.spkmodSkinAttachment = true;

	if (reviveHat && reviveHat.parent === headBone) {
		// Exact game-calibrated top-of-head coordinate frame (1 unit = 1m, +Y up, +Z forward)
		anchor.position.copy(reviveHat.position);
		anchor.quaternion.copy(reviveHat.quaternion);
		anchor.scale.copy(reviveHat.scale);
		return anchor;
	}

	// Fallback calibration when ReviveHatRoot isn't present
	avatarRoot.updateMatrixWorld(true);
	headBone.updateMatrixWorld(true);
	const rootScale = avatarRoot.getWorldScale(new THREE.Vector3()).x || 1;
	const boneScale = headBone.getWorldScale(new THREE.Vector3()).x || 1;
	const boneQuat = headBone.getWorldQuaternion(new THREE.Quaternion());
	const rootQuat = avatarRoot.getWorldQuaternion(new THREE.Quaternion());
	const box = new THREE.Box3().setFromObject(avatarRoot);
	const headPos = headBone.getWorldPosition(new THREE.Vector3());
	const topDeltaY = isFinite(box.max.y) ? Math.max(0.25, Math.min(1.0, (box.max.y - headPos.y) / rootScale)) : 0.72;

	const localUp = new THREE.Vector3(0, topDeltaY * rootScale, 0).applyQuaternion(boneQuat.clone().invert());
	anchor.position.copy(localUp).divideScalar(boneScale);
	anchor.quaternion.copy(boneQuat).invert().multiply(rootQuat);
	anchor.scale.setScalar(rootScale / boneScale);
	return anchor;
}

function spkmodSkinCreateBodyAnchor(avatarRoot, targetBone, name, localOffsetWorldM) {
	const THREE = window.THREE;
	if (!THREE || !targetBone || !avatarRoot) return null;
	avatarRoot.updateMatrixWorld(true);
	targetBone.updateMatrixWorld(true);
	const rootScale = avatarRoot.getWorldScale(new THREE.Vector3()).x || 1;
	const boneScale = targetBone.getWorldScale(new THREE.Vector3()).x || 1;
	const boneQuat = targetBone.getWorldQuaternion(new THREE.Quaternion());
	const rootQuat = avatarRoot.getWorldQuaternion(new THREE.Quaternion());

	const anchor = new THREE.Group();
	anchor.name = name || "spkmod_skin_body_anchor";
	anchor.userData.spkmodSkinAttachment = true;

	const worldOffset = localOffsetWorldM.clone().multiplyScalar(rootScale).applyQuaternion(rootQuat);
	const boneLocalOffset = worldOffset.applyQuaternion(boneQuat.clone().invert()).divideScalar(boneScale);
	anchor.position.copy(boneLocalOffset);
	anchor.quaternion.copy(boneQuat).invert().multiply(rootQuat);
	anchor.scale.setScalar(rootScale / boneScale);
	return anchor;
}

async function spkmodBuildCostumeAttachments(skin, avatarRoot) {
	const THREE = (window.THREE && window.THREE.Group && window.THREE.Mesh)
		? window.THREE
		: ((typeof spkmodEnsureThree === "function") ? await spkmodEnsureThree() : window.THREE);
	if (!THREE || !THREE.Group || !avatarRoot) return null;

	const builder = skin.costumeBuilder;
	if (!builder) return null;

	const { head, spine, pelvis, rightHand, leftHand, reviveHat } = spkmodSkinFindSkeletonBones(avatarRoot);
	const attachments = []; // { parent, node }
	const animParts = [];   // { type, node, baseY, baseRotZ, side }

	const toon = (color, extra = {}) => new THREE.MeshToonMaterial(Object.assign({ color }, extra));

	// Shared hand-prop helper using calibrated FBX R_Hand & L_Hand frames (Wide-Body safe!)
	const Q_UP_R = [0, 0, 0.7071, 0.7071];
	const Q_UMBRELLA_R = [0, 0, 0.8223, 0.5691];
	const Q_UP_TILT_R = [0.2913, 0.0505, 0.9054, 0.3046];
	const Q_SCYTHE_R = [0.193, -0.0809, 0.8316, 0.5145];
	const Q_HERO_R = [0.6592, -0.4822, -0.5172, 0.256];
	const Q_HERO_L = [-0.5172, -0.256, 0.6592, 0.4822];
	const Q_ROD_R = [0.6943, -0.5496, -0.4448, 0.1338];
	const Q_GUITAR_R = [0.2481, 0.2833, 0.8293, 0.4128];
	const Q_UP_TILT_L = [0.8448, -0.1616, 0.4092, 0.3044];
	const Q_BOW_L = [-0.7861, 0.6043, -0.079, -0.1028];
	const Q_SHIELD_L = [0.5792, -0.5792, 0.4056, 0.4056];
	const Q_SHURIKEN_L = [-0.4338, -0.4338, 0.5584, 0.5584];
	const attachHandProp = (handBone, name, propNode, quat, offset, opts = {}) => {
		if (!handBone || !propNode) return null;
		avatarRoot.updateMatrixWorld(true);
		const rootScale = avatarRoot.getWorldScale(new THREE.Vector3()).x || 1;
		const handScale = handBone.getWorldScale(new THREE.Vector3()).x || 1;
		const holder = new THREE.Group();
		holder.name = name || "spkmod_skin_hand_prop";
		holder.scale.setScalar(rootScale / Math.max(1e-4, handScale));
		if (quat) propNode.quaternion.set(quat[0], quat[1], quat[2], quat[3]);
		if (offset) propNode.position.set(offset[0], offset[1], offset[2]);
		holder.add(propNode);
		spkmodSkinSanitizeObject(holder);
		holder.userData.spkmodSkinHandProp = true;
		if (opts.hideInSpeakov) holder.userData.spkmodHideInSpeakov = true;
		handBone.add(holder);
		attachments.push({ parent: handBone, node: holder });
		return holder;
	};
	const attachSpeakovGun = async (handBone, name, glbPath, socketName, isLeft = false, lowReady = false) => {
		if (!handBone) return false;
		const gltf = await spkmodSkinLoadGlb(glbPath);
		if (!gltf || !gltf.scene) return false;
		const gun = gltf.scene.clone(true);
		spkmodSkinMarkSharedGlb(gun);
		const alignGroup = new THREE.Group();
		gun.updateMatrixWorld(true);
		let gripSocket = socketName ? gun.getObjectByName(socketName) : null;
		if (!gripSocket) {
			gun.traverse(o => { if (!gripSocket && o && /grip[-_]?socket/i.test(o.name || "")) gripSocket = o; });
		}
		if (gripSocket) {
			const gripLocal = gripSocket.getWorldPosition(new THREE.Vector3());
			gun.worldToLocal(gripLocal);
			gun.position.sub(gripLocal);
		} else {
			const box = new THREE.Box3().setFromObject(gun);
			const sz = box.getSize(new THREE.Vector3());
			const maxDim = Math.max(sz.x, sz.y, sz.z) || 1;
			if (maxDim > 1.8 || maxDim < 0.2) gun.scale.setScalar(0.75 / maxDim);
			gun.updateMatrixWorld(true);
			gun.position.sub(new THREE.Box3().setFromObject(gun).getCenter(new THREE.Vector3()));
		}
		alignGroup.add(gun);
		// Speakov GLB convention: +Y = top sights/rail, -Z = barrel forward, +X = shooter's right.
		// Default aims cleanly forward; lowReady keeps the classic down-pointing pose (used by Secret Agent dual pistols).
		const quat = lowReady
			? (isLeft ? [-0.5, -0.5, 0.5, 0.5] : [0.5, -0.5, -0.5, 0.5])
			: (isLeft ? [-0.3137, 0.4937, 0.6405, 0.4976] : [-0.7961, 0.5862, 0.0485, 0.1421]);
		const offset = lowReady
			? (isLeft ? [0.03, -0.05, -0.04] : [0.03, -0.05, 0.04])
			: (isLeft ? [0.03, -0.10, 0.03] : [0.03, -0.10, 0.08]);
		const holder = attachHandProp(handBone, name, alignGroup, quat, offset, { hideInSpeakov: !isLeft });
		if (lowReady && holder) holder.rotation.x = isLeft ? -0.18 : 0.18;
		return !!holder;
	};

	if (builder === "miner" && head) {
		const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
		const gltf = await spkmodSkinLoadGlb("/models/masterNpc/miningHelmet.glb");
		if (anchor && gltf && gltf.scene) {
			const helm = gltf.scene.clone(true);
			spkmodSkinMarkSharedGlb(helm);
			helm.updateMatrixWorld(true);
			const box = new THREE.Box3().setFromObject(helm);
			const sz = box.getSize(new THREE.Vector3());
			const maxXZ = Math.max(sz.x, sz.z) || 1;
			const s = 0.68 / maxXZ;
			helm.scale.setScalar(s);
			helm.updateMatrixWorld(true);
			const box2 = new THREE.Box3().setFromObject(helm);
			const center = box2.getCenter(new THREE.Vector3());
			// miningHelmet.glb has chinstraps extending below the brim, so offset deeper past box2.min.y
			helm.position.set(-center.x, -box2.min.y - 0.28, -center.z + 0.02);
			anchor.add(helm);
			spkmodSkinSanitizeObject(anchor);
			head.add(anchor);
			attachments.push({ parent: head, node: anchor });
		}
	} else if (builder === "chef" && head) {
		const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
		if (anchor) {
			const whiteMat = toon(0xf8fafc);
			const bandMat = toon(0xe2e8f0);
			const stripeMat = toon(0xef4444);
			const hat = new THREE.Group();
			hat.position.set(0, -0.06, 0);
			// Cylinder band
			const band = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.25, 0.17, 18), bandMat);
			band.position.y = 0.085;
			hat.add(band);
			// Red trim ribbon
			const trim = new THREE.Mesh(new THREE.CylinderGeometry(0.252, 0.254, 0.032, 18), stripeMat);
			trim.position.y = 0.035;
			hat.add(trim);
			// Puffy pleated toque crown (clustered spheres)
			const centerPuff = new THREE.Mesh(new THREE.SphereGeometry(0.23, 14, 12), whiteMat);
			centerPuff.position.y = 0.30;
			centerPuff.scale.set(1.05, 0.92, 1.05);
			hat.add(centerPuff);
			for (let i = 0; i < 6; i++) {
				const ang = (Math.PI * 2 * i) / 6;
				const puff = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10), whiteMat);
				puff.position.set(Math.cos(ang) * 0.14, 0.27, Math.sin(ang) * 0.14);
				hat.add(puff);
			}
			anchor.add(hat);
			spkmodSkinSanitizeObject(anchor);
			head.add(anchor);
			attachments.push({ parent: head, node: anchor });
		}
		if (spine) {
			const neckAnchor = spkmodSkinCreateBodyAnchor(avatarRoot, spine, "spkmod_skin_chef_scarf", new THREE.Vector3(0, 0.16, 0.02));
			if (neckAnchor) {
				const redMat = toon(0xdc2626);
				const ring = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.045, 8, 18), redMat);
				ring.rotation.x = Math.PI / 2;
				neckAnchor.add(ring);
				const knot = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.16, 6), redMat);
				knot.position.set(0, -0.07, 0.17);
				knot.rotation.x = Math.PI;
				neckAnchor.add(knot);
				spkmodSkinSanitizeObject(neckAnchor);
				spine.add(neckAnchor);
				attachments.push({ parent: spine, node: neckAnchor });
			}
		}
	} else if (builder === "neko" && head) {
		const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
		if (anchor) {
			const outerMat = toon(0x27272a);
			const innerMat = toon(0xf9a8d4);
			for (const side of [-1, 1]) {
				const ear = new THREE.Group();
				ear.position.set(side * 0.21, -0.04, 0.02);
				ear.rotation.z = -side * 0.34;
				ear.rotation.x = 0.08;
				const cone = new THREE.Mesh(new THREE.ConeGeometry(0.125, 0.26, 4), outerMat);
				cone.rotation.y = Math.PI / 4;
				cone.scale.set(1.0, 1.0, 0.55);
				cone.position.y = 0.11;
				ear.add(cone);
				const inner = new THREE.Mesh(new THREE.ConeGeometry(0.078, 0.18, 4), innerMat);
				inner.rotation.y = Math.PI / 4;
				inner.scale.set(1.0, 1.0, 0.45);
				inner.position.set(0, 0.095, 0.028);
				ear.add(inner);
				anchor.add(ear);
			}
			spkmodSkinSanitizeObject(anchor);
			head.add(anchor);
			attachments.push({ parent: head, node: anchor });
		}
		if (pelvis) {
			// Anchor directly at lower back so tail stays physically attached even in Wide Body mode
			const tailAnchor = spkmodSkinCreateBodyAnchor(avatarRoot, pelvis, "spkmod_skin_neko_tail", new THREE.Vector3(0, -0.14, -0.20));
			if (tailAnchor) {
				const tailMat = toon(0x27272a);
				const tipMat = toon(0xf8fafc);
				const tailRoot = new THREE.Group();
				// Continuous S-curved cat tail emerging from lower back, clearing hair/veil, and curling up behind
				const segs = [
					{ y: -0.02, z: -0.14, rx: -1.48, r: 0.044, len: 0.30 },
					{ y:  0.02, z: -0.39, rx: -1.25, r: 0.043, len: 0.26 },
					{ y:  0.13, z: -0.58, rx: -0.88, r: 0.041, len: 0.22 },
					{ y:  0.30, z: -0.69, rx: -0.35, r: 0.039, len: 0.22 },
					{ y:  0.47, z: -0.70, rx:  0.22, r: 0.037, len: 0.18 }
				];
				segs.forEach((sg, idx) => {
					const mat = idx === segs.length - 1 ? tipMat : tailMat;
					const m = new THREE.Mesh(new THREE.CylinderGeometry(sg.r * 0.92, sg.r, sg.len, 10), mat);
					m.position.set(0, sg.y, sg.z);
					m.rotation.x = sg.rx;
					tailRoot.add(m);
					const joint = new THREE.Mesh(new THREE.SphereGeometry(sg.r * 0.95, 10, 8), mat);
					joint.position.set(0, sg.y - Math.cos(sg.rx) * sg.len * 0.48, sg.z - Math.sin(sg.rx) * sg.len * 0.48);
					tailRoot.add(joint);
				});
				const tip = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 8), tipMat);
				tip.position.set(0, 0.56, -0.68);
				tailRoot.add(tip);
				tailAnchor.add(tailRoot);
				animParts.push({ type: "tail", node: tailRoot });
				spkmodSkinSanitizeObject(tailAnchor);
				pelvis.add(tailAnchor);
				attachments.push({ parent: pelvis, node: tailAnchor });
			}
		}
	} else if (builder === "santa" && head) {
		const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
		if (anchor) {
			const redMat = toon(0xdc2626);
			const furMat = toon(0xffffff);
			const hat = new THREE.Group();
			hat.position.set(0, -0.07, 0);
			const brim = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.068, 10, 20), furMat);
			brim.rotation.x = Math.PI / 2;
			brim.position.y = 0.03;
			hat.add(brim);
			const lowerCone = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.38, 16), redMat);
			lowerCone.position.set(0, 0.22, -0.02);
			lowerCone.rotation.x = -0.18;
			hat.add(lowerCone);
			const droopTip = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.26, 12), redMat);
			droopTip.position.set(0.14, 0.34, -0.10);
			droopTip.rotation.z = -1.15;
			droopTip.rotation.x = -0.35;
			hat.add(droopTip);
			const pom = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 10), furMat);
			pom.position.set(0.27, 0.28, -0.14);
			hat.add(pom);
			anchor.add(hat);
			spkmodSkinSanitizeObject(anchor);
			head.add(anchor);
			attachments.push({ parent: head, node: anchor });
		}
		if (spine) {
			const scarfAnchor = spkmodSkinCreateBodyAnchor(avatarRoot, spine, "spkmod_skin_santa_scarf", new THREE.Vector3(0, 0.16, 0.02));
			if (scarfAnchor) {
				const scarfMat = toon(0xb91c1c);
				const trimMat = toon(0xffffff);
				const wrap = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.055, 8, 18), scarfMat);
				wrap.rotation.x = Math.PI / 2;
				scarfAnchor.add(wrap);
				const tail = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.24, 0.035), scarfMat);
				tail.position.set(0.08, -0.11, 0.17);
				tail.rotation.z = -0.15;
				scarfAnchor.add(tail);
				const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.04, 0.04), trimMat);
				stripe.position.set(0.095, -0.20, 0.17);
				stripe.rotation.z = -0.15;
				scarfAnchor.add(stripe);
				spkmodSkinSanitizeObject(scarfAnchor);
				spine.add(scarfAnchor);
				attachments.push({ parent: spine, node: scarfAnchor });
			}
		}
	} else if (builder === "wizard" && head) {
		const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
		if (anchor) {
			const robeMat = toon(0x312e81);
			const bandMat = toon(0xfacc15, { emissive: 0xca8a04, emissiveIntensity: 0.35 });
			const starMat = toon(0xfef08a, { emissive: 0xfacc15, emissiveIntensity: 0.8 });
			const hat = new THREE.Group();
			hat.position.set(0, -0.05, 0);
			const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.48, 0.03, 24), robeMat);
			brim.position.y = 0.02;
			hat.add(brim);
			const band = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.075, 20), bandMat);
			band.position.y = 0.07;
			hat.add(band);
			const cone1 = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.44, 18), robeMat);
			cone1.position.set(0, 0.29, -0.02);
			cone1.rotation.x = -0.15;
			hat.add(cone1);
			const tip = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.26, 12), robeMat);
			tip.position.set(0.07, 0.50, -0.11);
			tip.rotation.x = -0.7;
			tip.rotation.z = -0.35;
			hat.add(tip);
			const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.065, 0), starMat);
			star.position.set(0, 0.18, 0.22);
			hat.add(star);
			animParts.push({ type: "spinY", node: star });
			anchor.add(hat);
			spkmodSkinSanitizeObject(anchor);
			head.add(anchor);
			attachments.push({ parent: head, node: anchor });
		}
	} else if (builder === "tactical") {
		if (head) {
			const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
			if (anchor) {
				const beretMat = toon(0x3f6212);
				const trimMat = toon(0x1e293b);
				const badgeMat = toon(0xfacc15, { emissive: 0xca8a04, emissiveIntensity: 0.3 });
				const beret = new THREE.Group();
				beret.position.set(0, -0.06, 0);
				const band = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.26, 0.055, 20), trimMat);
				band.position.y = 0.03;
				beret.add(band);
				const cap = new THREE.Mesh(new THREE.SphereGeometry(0.29, 18, 12), beretMat);
				cap.scale.set(1.12, 0.44, 1.06);
				cap.position.set(0.05, 0.11, -0.01);
				cap.rotation.z = -0.18;
				beret.add(cap);
				const badge = new THREE.Mesh(new THREE.OctahedronGeometry(0.045, 0), badgeMat);
				badge.position.set(-0.08, 0.10, 0.24);
				beret.add(badge);
				anchor.add(beret);
				spkmodSkinSanitizeObject(anchor);
				head.add(anchor);
				attachments.push({ parent: head, node: anchor });
			}
		}
		const handBone = rightHand || leftHand;
		if (handBone) {
			await attachSpeakovGun(handBone, "spkmod_skin_tactical_rifle", "/models/speakov/weapon-rifle.glb", "weapon-rifle-grip-socket", handBone === leftHand);
		}
	} else if (builder === "devil") {
		if (head) {
			const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
			if (anchor) {
				const hornMat = toon(0x991b1b, { emissive: 0x450a0a, emissiveIntensity: 0.35 });
				for (const side of [-1, 1]) {
					const hGroup = new THREE.Group();
					hGroup.position.set(side * 0.19, -0.02, 0.05);
					hGroup.rotation.z = -side * 0.42;
					hGroup.rotation.x = 0.22;
					const base = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.20, 10), hornMat);
					base.position.y = 0.08;
					hGroup.add(base);
					const tip = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.16, 10), hornMat);
					tip.position.set(-side * 0.04, 0.21, -0.03);
					tip.rotation.z = side * 0.55;
					tip.rotation.x = -0.35;
					hGroup.add(tip);
					anchor.add(hGroup);
				}
				spkmodSkinSanitizeObject(anchor);
				head.add(anchor);
				attachments.push({ parent: head, node: anchor });
			}
		}
		if (spine) {
			const wingAnchor = spkmodSkinCreateBodyAnchor(avatarRoot, spine, "spkmod_skin_devil_wings", new THREE.Vector3(0, 0.08, -0.70));
			if (wingAnchor) {
				const memMat = toon(0x18181b, { side: THREE.DoubleSide });
				const boneMat = toon(0x991b1b);
				for (const side of [-1, 1]) {
					const wing = new THREE.Group();
					wing.position.set(side * 0.16, 0.06, 0);
					const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.024, 0.62, 8), boneMat);
					strut.position.set(side * 0.28, 0.18, -0.05);
					strut.rotation.z = -side * 1.05;
					wing.add(strut);
					const upper = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.30, 0.02), memMat);
					upper.position.set(side * 0.34, 0.10, -0.06);
					upper.rotation.z = side * 0.28;
					upper.rotation.y = side * 0.22;
					wing.add(upper);
					const lower = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.20, 0.02), memMat);
					lower.position.set(side * 0.28, -0.08, -0.05);
					lower.rotation.z = -side * 0.18;
					lower.rotation.y = side * 0.22;
					wing.add(lower);
					wingAnchor.add(wing);
					animParts.push({ type: "wing", node: wing, side });
				}
				spkmodSkinSanitizeObject(wingAnchor);
				spine.add(wingAnchor);
				attachments.push({ parent: spine, node: wingAnchor });
			}
		}
	} else if (builder === "angel") {
		if (head) {
			const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
			if (anchor) {
				const haloMat = toon(0xfef08a, { emissive: 0xfacc15, emissiveIntensity: 0.9 });
				const halo = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.032, 12, 28), haloMat);
				halo.rotation.x = Math.PI / 2;
				halo.position.y = 0.24;
				anchor.add(halo);
				animParts.push({ type: "floatY", node: halo, baseY: 0.24 });
				spkmodSkinSanitizeObject(anchor);
				head.add(anchor);
				attachments.push({ parent: head, node: anchor });
			}
		}
		if (spine) {
			const wingAnchor = spkmodSkinCreateBodyAnchor(avatarRoot, spine, "spkmod_skin_angel_wings", new THREE.Vector3(0, 0.10, -0.70));
			if (wingAnchor) {
				const featherMat = toon(0xffffff, { emissive: 0xe0f2fe, emissiveIntensity: 0.24 });
				const goldMat = toon(0xfde047, { emissive: 0xfacc15, emissiveIntensity: 0.35 });
				for (const side of [-1, 1]) {
					const wing = new THREE.Group();
					wing.position.set(side * 0.16, 0.06, 0);
					const feathers = [
						{ x: 0.32, y: 0.22, w: 0.62, h: 0.15, rz: 0.44 },
						{ x: 0.38, y: 0.06, w: 0.68, h: 0.14, rz: 0.14 },
						{ x: 0.32, y: -0.09, w: 0.54, h: 0.13, rz: -0.16 },
						{ x: 0.24, y: -0.22, w: 0.38, h: 0.11, rz: -0.38 }
					];
					for (const f of feathers) {
						const mesh = new THREE.Mesh(new THREE.BoxGeometry(f.w, f.h, 0.032), featherMat);
						mesh.position.set(side * f.x, f.y, -0.05);
						mesh.rotation.z = side * f.rz;
						mesh.rotation.y = side * 0.22;
						wing.add(mesh);
					}
					const clasp = new THREE.Mesh(new THREE.SphereGeometry(0.062, 10, 8), goldMat);
					clasp.position.set(side * 0.05, 0.06, -0.02);
					wing.add(clasp);
					wingAnchor.add(wing);
					animParts.push({ type: "wing", node: wing, side });
				}
				spkmodSkinSanitizeObject(wingAnchor);
				spine.add(wingAnchor);
				attachments.push({ parent: spine, node: wingAnchor });
			}
		}
	} else if (builder === "royal") {
		if (head) {
			const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
			if (anchor) {
				const goldMat = toon(0xffd700, { emissive: 0xb45309, emissiveIntensity: 0.42 });
				const velvetMat = toon(0x7e22ce);
				const gemColors = [0xef4444, 0x38bdf8, 0x22c55e, 0xf472b6];
				const crown = new THREE.Group();
				crown.position.set(0, -0.04, 0);
				const base = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.20, 0.11, 20), goldMat);
				base.position.y = 0.06;
				crown.add(base);
				const cushion = new THREE.Mesh(new THREE.SphereGeometry(0.19, 14, 10), velvetMat);
				cushion.scale.set(1.0, 0.65, 1.0);
				cushion.position.y = 0.12;
				crown.add(cushion);
				for (let i = 0; i < 6; i++) {
					const ang = (Math.PI * 2 * i) / 6;
					const spike = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.14, 4), goldMat);
					spike.position.set(Math.cos(ang) * 0.21, 0.17, Math.sin(ang) * 0.21);
					crown.add(spike);
					const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.032, 0), toon(gemColors[i % gemColors.length], { emissive: gemColors[i % gemColors.length], emissiveIntensity: 0.55 }));
					gem.position.set(Math.cos(ang) * 0.23, 0.065, Math.sin(ang) * 0.23);
					crown.add(gem);
				}
				const orb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), goldMat);
				orb.position.y = 0.26;
				crown.add(orb);
				anchor.add(crown);
				spkmodSkinSanitizeObject(anchor);
				head.add(anchor);
				attachments.push({ parent: head, node: anchor });
			}
		}
		if (spine) {
			const capeAnchor = spkmodSkinCreateBodyAnchor(avatarRoot, spine, "spkmod_skin_royal_cape", new THREE.Vector3(0, 0.10, -0.74));
			if (capeAnchor) {
				const capeMat = toon(0x991b1b, { side: THREE.DoubleSide });
				const furMat = toon(0xf8fafc, { side: THREE.DoubleSide });
				const goldMat = toon(0xffd700, { emissive: 0xb45309, emissiveIntensity: 0.35, side: THREE.DoubleSide });
				// Keep neck collar & gold clasp anchored smoothly on Speaki's collar
				const collar = new THREE.Mesh(new THREE.TorusGeometry(0.20, 0.048, 8, 18), furMat);
				collar.rotation.x = Math.PI / 2;
				collar.position.set(0, 0.02, 0.69);
				capeAnchor.add(collar);
				const clasp = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), goldMat);
				clasp.position.set(0, 0.02, 0.87);
				capeAnchor.add(clasp);
				// Curved royal velvet cape wrapping smoothly outside the rounded back of Speaki's veil
				const capeGroup = new THREE.Group();
				const arcStart = Math.PI - 0.56;
				const arcLen = 1.12;
				const cylZ = 0.68;
				const topTrim = new THREE.Mesh(new THREE.CylinderGeometry(0.71, 0.74, 0.10, 18, 1, true, arcStart, arcLen), furMat);
				topTrim.position.set(0, -0.05, cylZ);
				capeGroup.add(topTrim);
				const mantle = new THREE.Mesh(new THREE.CylinderGeometry(0.715, 0.885, 0.58, 18, 1, true, arcStart, arcLen), capeMat);
				mantle.position.set(0, -0.30, cylZ);
				capeGroup.add(mantle);
				const goldTrim = new THREE.Mesh(new THREE.CylinderGeometry(0.865, 0.88, 0.042, 18, 1, true, arcStart, arcLen), goldMat);
				goldTrim.position.set(0, -0.52, cylZ);
				capeGroup.add(goldTrim);
				const hem = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 0.905, 0.09, 18, 1, true, arcStart, arcLen), furMat);
				hem.position.set(0, -0.58, cylZ);
				capeGroup.add(hem);
				capeAnchor.add(capeGroup);
				animParts.push({ type: "cape", node: capeGroup });
				spkmodSkinSanitizeObject(capeAnchor);
				spine.add(capeAnchor);
				attachments.push({ parent: spine, node: capeAnchor });
			}
		}
	} else if (builder === "burger" && head) {
		const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
		if (anchor) {
			const redMat = toon(0xdc2626);
			const goldMat = toon(0xfacc15);
			const visor = new THREE.Group();
			visor.position.set(0, -0.07, 0);
			const capBand = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.28, 0.08, 20), redMat);
			capBand.position.y = 0.03;
			visor.add(capBand);
			const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.29, 0.022, 18, 1, false, -Math.PI * 0.38, Math.PI * 0.76), goldMat);
			brim.position.set(0, 0.005, 0.14);
			visor.add(brim);

			const gltf = await spkmodSkinLoadGlb("/models/burger_shop/burger-shop-food.glb");
			let addedGlb = false;
			if (gltf && gltf.scene) {
				const srcNode = gltf.scene.getObjectByName("Burger_Deluxe") || gltf.scene.getObjectByName("Burger_Basic");
				if (srcNode) {
					const burger = srcNode.clone(true);
					spkmodSkinMarkSharedGlb(burger);
					burger.position.set(0, 0, 0);
					burger.updateMatrixWorld(true);
					const b1 = new THREE.Box3().setFromObject(burger);
					const sz = b1.getSize(new THREE.Vector3());
					const maxXZ = Math.max(sz.x, sz.z) || 1;
					burger.scale.setScalar(0.52 / maxXZ);
					burger.updateMatrixWorld(true);
					const b2 = new THREE.Box3().setFromObject(burger);
					const c = b2.getCenter(new THREE.Vector3());
					burger.position.set(-c.x, -b2.min.y + 0.06, -c.z);
					visor.add(burger);
					addedGlb = true;
				}
			}
			if (!addedGlb) {
				const bunMat = toon(0xd97706);
				const pattyMat = toon(0x5c2d16);
				const cheeseMat = toon(0xfacc15);
				const lettuceMat = toon(0x22c55e);
				const botBun = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.20, 0.07, 16), bunMat);
				botBun.position.y = 0.10;
				const patty = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.06, 16), pattyMat);
				patty.position.y = 0.16;
				const cheese = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.025, 0.38), cheeseMat);
				cheese.position.y = 0.20;
				cheese.rotation.y = Math.PI / 4;
				const lettuce = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.035, 14), lettuceMat);
				lettuce.position.y = 0.23;
				const topBun = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), bunMat);
				topBun.position.y = 0.24;
				visor.add(botBun, patty, cheese, lettuce, topBun);
			}
			anchor.add(visor);
			spkmodSkinSanitizeObject(anchor);
			head.add(anchor);
			attachments.push({ parent: head, node: anchor });
		}
	} else if (builder === "bunny") {
		if (head) {
			const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
			if (anchor) {
				const furMat = toon(0xf8fafc);
				const innerMat = toon(0xf9a8d4);
				const bandMat = toon(0xf472b6);
				const headband = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.028, 8, 22, Math.PI), bandMat);
				headband.position.set(0, -0.32, 0.02);
				anchor.add(headband);
				for (const side of [-1, 1]) {
					const earPivot = new THREE.Group();
					earPivot.position.set(side * 0.14, -0.02, 0.02);
					const baseRotZ = -side * 0.16;
					earPivot.rotation.z = baseRotZ;
					const outer = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 12), furMat);
					outer.scale.set(0.85, 3.1, 0.48);
					outer.position.y = 0.25;
					earPivot.add(outer);
					const inner = new THREE.Mesh(new THREE.SphereGeometry(0.056, 10, 10), innerMat);
					inner.scale.set(0.72, 2.5, 0.32);
					inner.position.set(0, 0.23, 0.032);
					earPivot.add(inner);
					anchor.add(earPivot);
					animParts.push({ type: "earWiggle", node: earPivot, side, baseRotZ });
				}
				spkmodSkinSanitizeObject(anchor);
				head.add(anchor);
				attachments.push({ parent: head, node: anchor });
			}
		}
		if (pelvis) {
			// Anchored directly to lower back so cottontail stays attached at every Wide Body tier
			const tailAnchor = spkmodSkinCreateBodyAnchor(avatarRoot, pelvis, "spkmod_skin_bunny_tail", new THREE.Vector3(0, -0.15, -0.22));
			if (tailAnchor) {
				const furMat = toon(0xffffff);
				const base = new THREE.Mesh(new THREE.SphereGeometry(0.125, 12, 10), furMat);
				base.position.set(0, 0, -0.10);
				tailAnchor.add(base);
				const pom = new THREE.Mesh(new THREE.SphereGeometry(0.155, 14, 12), furMat);
				pom.position.set(0, 0.02, -0.26);
				tailAnchor.add(pom);
				spkmodSkinSanitizeObject(tailAnchor);
				pelvis.add(tailAnchor);
				attachments.push({ parent: pelvis, node: tailAnchor });
			}
		}
	} else if (builder === "pirate" && head) {
		const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
		if (anchor) {
			const blackMat = toon(0x18181b);
			const goldMat = toon(0xfacc15, { emissive: 0x854d0e, emissiveIntensity: 0.3 });
			const redMat = toon(0xdc2626);
			const skullMat = toon(0xf8fafc);
			const hat = new THREE.Group();
			hat.position.set(0, -0.06, 0);
			// Crown dome
			const dome = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.27, 0.22, 16), blackMat);
			dome.position.y = 0.11;
			hat.add(dome);
			// Tricorne upturned brim flaps (front, left, right)
			const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.42, 0.045, 3), blackMat);
			brim.position.y = 0.06;
			brim.rotation.y = Math.PI / 3;
			hat.add(brim);
			const goldEdge = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.022, 8, 3), goldMat);
			goldEdge.rotation.x = Math.PI / 2;
			goldEdge.rotation.z = Math.PI / 6;
			goldEdge.position.y = 0.085;
			hat.add(goldEdge);
			// Front upright pirate fold + skull emblem
			const frontShield = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.24, 0.045), blackMat);
			frontShield.position.set(0, 0.16, 0.23);
			frontShield.rotation.x = -0.18;
			hat.add(frontShield);
			const skull = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 8), skullMat);
			skull.position.set(0, 0.18, 0.27);
			hat.add(skull);
			for (const s of [-1, 1]) {
				const bone = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.022, 0.022), skullMat);
				bone.position.set(0, 0.11, 0.27);
				bone.rotation.z = s * 0.55;
				hat.add(bone);
			}
			// Dramatic red captain plume feather
			const feather = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.36, 8), redMat);
			feather.position.set(0.24, 0.28, -0.05);
			feather.rotation.z = -0.52;
			feather.rotation.x = -0.25;
			hat.add(feather);
			anchor.add(hat);
			spkmodSkinSanitizeObject(anchor);
			head.add(anchor);
			attachments.push({ parent: head, node: anchor });
		}
	} else if (builder === "gentleman") {
		if (head) {
			const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
			if (anchor) {
				const hatMat = toon(0x18181b);
				const ribbonMat = toon(0xb91c1c);
				const goldMat = toon(0xfacc15, { emissive: 0xa16207, emissiveIntensity: 0.35 });
				const hat = new THREE.Group();
				hat.position.set(0, -0.06, 0);
				const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.40, 0.42, 0.032, 24), hatMat);
				brim.position.y = 0.02;
				hat.add(brim);
				const ribbon = new THREE.Mesh(new THREE.CylinderGeometry(0.255, 0.255, 0.075, 22), ribbonMat);
				ribbon.position.y = 0.072;
				hat.add(ribbon);
				const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.065, 0.03), goldMat);
				buckle.position.set(0, 0.072, 0.25);
				hat.add(buckle);
				const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.245, 0.40, 22), hatMat);
				tower.position.y = 0.29;
				hat.add(tower);
				// Monocle aligned over chibi eye (anchor y = -0.71, hat y = -0.06 -> -0.65)
				const monocle = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.014, 8, 20), goldMat);
				monocle.position.set(0.145, -0.65, 0.48);
				hat.add(monocle);
				const glass = new THREE.Mesh(new THREE.CircleGeometry(0.088, 16), toon(0xbae6fd, { transparent: true, opacity: 0.35, side: THREE.DoubleSide }));
				glass.position.set(0.145, -0.65, 0.478);
				hat.add(glass);
				anchor.add(hat);
				spkmodSkinSanitizeObject(anchor);
				head.add(anchor);
				attachments.push({ parent: head, node: anchor });
			}
		}
		if (spine) {
			const bowAnchor = spkmodSkinCreateBodyAnchor(avatarRoot, spine, "spkmod_skin_gentleman_bowtie", new THREE.Vector3(0, 0.15, 0.18));
			if (bowAnchor) {
				const redMat = toon(0xdc2626);
				for (const side of [-1, 1]) {
					const wing = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.11, 4), redMat);
					wing.position.x = side * 0.055;
					wing.rotation.z = side * (Math.PI / 2);
					bowAnchor.add(wing);
				}
				const knot = new THREE.Mesh(new THREE.SphereGeometry(0.036, 8, 8), redMat);
				bowAnchor.add(knot);
				spkmodSkinSanitizeObject(bowAnchor);
				spine.add(bowAnchor);
				attachments.push({ parent: spine, node: bowAnchor });
			}
		}
	} else if (builder === "pumpkin" && head) {
		const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
		if (anchor) {
			const orangeMat = toon(0xf97316, { emissive: 0x7c2d12, emissiveIntensity: 0.18 });
			const stemMat = toon(0x4d7c0f);
			const glowMat = toon(0xfef08a, { emissive: 0xfacc15, emissiveIntensity: 1.0 });
			const mask = new THREE.Group();
			mask.position.set(0, -0.57, 0.04);
			const r = 0.62;
			const geom = new THREE.SphereGeometry(r, 24, 16);
			const pos = geom.attributes.position;
			for (let i = 0; i < pos.count; i++) {
				const vx = pos.getX(i), vz = pos.getZ(i);
				const rib = 1 + 0.08 * Math.cos(Math.atan2(vz, vx) * 10);
				pos.setX(i, vx * rib);
				pos.setZ(i, vz * rib);
			}
			pos.needsUpdate = true;
			geom.computeVertexNormals();
			const body = new THREE.Mesh(geom, orangeMat);
			body.scale.set(1.06, 1.04, 1.06);
			mask.add(body);
			const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.10, 0.24, 7), stemMat);
			stem.position.set(0.02, 0.70, 0);
			stem.rotation.z = -0.22;
			mask.add(stem);
			// Glowing carved triangle eyes (proud of pumpkin rib crests)
			for (const side of [-1, 1]) {
				const eye = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.14, 3), glowMat);
				eye.position.set(side * 0.21, 0.06, 0.675);
				eye.rotation.x = Math.PI / 2;
				eye.rotation.z = side * 0.15;
				mask.add(eye);
			}
			// Glowing carved jagged grin curving across the front surface
			for (let i = -2; i <= 2; i++) {
				const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.09, i % 2 === 0 ? 0.085 : 0.055, 0.07), glowMat);
				tooth.position.set(i * 0.086, -0.16 + Math.abs(i) * 0.025, 0.68 - Math.abs(i) * 0.025);
				mask.add(tooth);
			}
			anchor.add(mask);
			spkmodSkinSanitizeObject(anchor);
			head.add(anchor);
			attachments.push({ parent: head, node: anchor });
		}
	} else if (builder === "vip" && head) {
		const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
		if (anchor) {
			const lensMat = toon(0x09090b, { emissive: 0x1e293b, emissiveIntensity: 0.4 });
			const frameMat = toon(0xfacc15, { emissive: 0xb45309, emissiveIntensity: 0.4 });
			const shades = new THREE.Group();
			// Calibrated to Speaki's chibi eye line (y = -0.71 below crown, z = +0.48 cleanly ahead of bangs/face)
			shades.position.set(0, -0.71, 0.48);
			for (const side of [-1, 1]) {
				const lens = new THREE.Mesh(new THREE.BoxGeometry(0.215, 0.145, 0.025), lensMat);
				lens.position.set(side * 0.145, 0, 0);
				shades.add(lens);
				const rim = new THREE.Mesh(new THREE.BoxGeometry(0.235, 0.024, 0.032), frameMat);
				rim.position.set(side * 0.145, 0.078, 0);
				shades.add(rim);
				const temple = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.026, 0.44), frameMat);
				temple.position.set(side * 0.268, 0.045, -0.22);
				shades.add(temple);
			}
			const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.026, 0.032), frameMat);
			bridge.position.set(0, 0.045, 0);
			shades.add(bridge);
			anchor.add(shades);
			// Hovering mini golden VIP star crown on top
			const vipStar = new THREE.Mesh(new THREE.OctahedronGeometry(0.11, 0), toon(0xfef08a, { emissive: 0xfacc15, emissiveIntensity: 0.9 }));
			vipStar.position.set(0, 0.16, 0);
			anchor.add(vipStar);
			animParts.push({ type: "floatY", node: vipStar, baseY: 0.16 });
			animParts.push({ type: "spinY", node: vipStar });
			spkmodSkinSanitizeObject(anchor);
			head.add(anchor);
			attachments.push({ parent: head, node: anchor });
		}
	} else if (builder === "knight") {
		if (head) {
			const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
			if (anchor) {
				const steelMat = toon(0xcbd5e1, { emissive: 0x334155, emissiveIntensity: 0.2 });
				const goldMat = toon(0xfacc15, { emissive: 0xa16207, emissiveIntensity: 0.35 });
				const plumeMat = toon(0x2563eb);
				const helm = new THREE.Group();
				helm.position.set(0, -0.08, 0);
				const dome = new THREE.Mesh(new THREE.SphereGeometry(0.32, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.62), steelMat);
				dome.position.y = 0.02;
				helm.add(dome);
				const brow = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.032, 8, 22), goldMat);
				brow.rotation.x = Math.PI / 2;
				brow.position.y = 0.04;
				helm.add(brow);
				const crestBase = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.34), goldMat);
				crestBase.position.set(0, 0.32, -0.02);
				helm.add(crestBase);
				// Flowing knight plume
				for (let i = 0; i < 4; i++) {
					const tuft = new THREE.Mesh(new THREE.SphereGeometry(0.085 - i * 0.01, 10, 8), plumeMat);
					tuft.position.set(0, 0.42 - i * 0.05, -0.04 - i * 0.11);
					helm.add(tuft);
				}
				anchor.add(helm);
				spkmodSkinSanitizeObject(anchor);
				head.add(anchor);
				attachments.push({ parent: head, node: anchor });
			}
		}
		if (leftHand || spine) {
			const steelMat = toon(0xe2e8f0);
			const blueMat = toon(0x1d4ed8);
			const goldMat = toon(0xfacc15, { emissive: 0xa16207, emissiveIntensity: 0.3 });
			const strapMat = toon(0x451a03);
			const shield = new THREE.Group();
			const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.21, 0.05, 6), blueMat);
			plate.rotation.x = Math.PI / 2;
			shield.add(plate);
			const rim = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.03, 8, 6), steelMat);
			rim.rotation.z = Math.PI / 6;
			shield.add(rim);
			const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.35, 0.068), goldMat);
			const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.055, 0.068), goldMat);
			crossH.position.y = 0.04;
			shield.add(crossV, crossH);
			const grip = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.14, 0.04), strapMat);
			grip.position.set(0, 0, -0.04);
			shield.add(grip);

			if (leftHand) {
				// Attach Paladin Shield to left hand (outward-left & angled 30deg forward so emblem is clearly visible!)
				avatarRoot.updateMatrixWorld(true);
				const rootScale = avatarRoot.getWorldScale(new THREE.Vector3()).x || 1;
				const handScale = leftHand.getWorldScale(new THREE.Vector3()).x || 1;
				const holder = new THREE.Group();
				holder.name = "spkmod_skin_knight_shield";
				holder.scale.setScalar(rootScale / Math.max(1e-4, handScale));
				// In L_Hand space (+X=down, -Y=outward left, -Z=forward): top->-X(up), front->outward+20deg fwd
				shield.quaternion.set(0.5792, -0.5792, 0.4056, 0.4056);
				shield.position.set(0.03, -0.17, -0.11);
				holder.add(shield);
				spkmodSkinSanitizeObject(holder);
				holder.userData.spkmodSkinHandProp = true;
				leftHand.add(holder);
				attachments.push({ parent: leftHand, node: holder });
			} else if (spine) {
				const backAnchor = spkmodSkinCreateBodyAnchor(avatarRoot, spine, "spkmod_skin_knight_shield", new THREE.Vector3(0, 0.02, -0.48));
				if (backAnchor) {
					backAnchor.add(shield);
					spkmodSkinSanitizeObject(backAnchor);
					spine.add(backAnchor);
					attachments.push({ parent: spine, node: backAnchor });
				}
			}
		}
	} else if (builder === "fairy") {
		if (head) {
			const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
			if (anchor) {
				const stemMat = toon(0x06b6d4);
				const orbMat = toon(0xf0abfc, { emissive: 0xe879f9, emissiveIntensity: 0.9 });
				const crown = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.022, 8, 22), toon(0x34d399));
				crown.rotation.x = Math.PI / 2;
				crown.position.y = -0.02;
				anchor.add(crown);
				for (const side of [-1, 1]) {
					const ant = new THREE.Group();
					ant.position.set(side * 0.13, 0, 0.06);
					const baseRotZ = -side * 0.32;
					ant.rotation.z = baseRotZ;
					ant.rotation.x = 0.25;
					const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, 0.26, 8), stemMat);
					stalk.position.y = 0.13;
					ant.add(stalk);
					const tip = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), orbMat);
					tip.position.y = 0.27;
					ant.add(tip);
					anchor.add(ant);
					animParts.push({ type: "earWiggle", node: ant, side, baseRotZ });
				}
				spkmodSkinSanitizeObject(anchor);
				head.add(anchor);
				attachments.push({ parent: head, node: anchor });
			}
		}
		if (spine) {
			const wingAnchor = spkmodSkinCreateBodyAnchor(avatarRoot, spine, "spkmod_skin_fairy_wings", new THREE.Vector3(0, 0.08, -0.70));
			if (wingAnchor) {
				const upperMat = toon(0x38bdf8, { emissive: 0x06b6d4, emissiveIntensity: 0.45, transparent: true, opacity: 0.78, side: THREE.DoubleSide });
				const lowerMat = toon(0xe879f9, { emissive: 0xc026d3, emissiveIntensity: 0.45, transparent: true, opacity: 0.78, side: THREE.DoubleSide });
				const spotMat = toon(0xfef08a, { emissive: 0xfacc15, emissiveIntensity: 0.9 });
				for (const side of [-1, 1]) {
					const wing = new THREE.Group();
					wing.position.set(side * 0.16, 0.06, 0);
					const upper = new THREE.Mesh(new THREE.CircleGeometry(0.38, 16), upperMat);
					upper.scale.set(1.30, 0.88, 1);
					upper.position.set(side * 0.38, 0.18, -0.04);
					upper.rotation.z = side * 0.35;
					upper.rotation.y = side * 0.24;
					wing.add(upper);
					const lower = new THREE.Mesh(new THREE.CircleGeometry(0.26, 14), lowerMat);
					lower.scale.set(1.12, 0.92, 1);
					lower.position.set(side * 0.28, -0.16, -0.04);
					lower.rotation.z = -side * 0.25;
					lower.rotation.y = side * 0.24;
					wing.add(lower);
					const spot = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), spotMat);
					spot.position.set(side * 0.46, 0.22, -0.06);
					wing.add(spot);
					wingAnchor.add(wing);
					animParts.push({ type: "flutter", node: wing, side });
				}
				spkmodSkinSanitizeObject(wingAnchor);
				spine.add(wingAnchor);
				attachments.push({ parent: spine, node: wingAnchor });
			}
		}
	} else if (builder === "samurai") {
		if (head) {
			const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
			if (anchor) {
				const armorMat = toon(0x1e1b4b);
				const crimsonMat = toon(0xb91c1c, { side: THREE.DoubleSide });
				const goldMat = toon(0xffd700, { emissive: 0xb45309, emissiveIntensity: 0.45 });
				const kabuto = new THREE.Group();
				kabuto.position.set(0, -0.08, 0);
				// Kabuto dome
				const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.33, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.58), armorMat);
				bowl.position.y = 0.02;
				kabuto.add(bowl);
				// Neck guard flaps (shikoro)
				const guard = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.44, 0.16, 16, 1, true, Math.PI * 0.35, Math.PI * 1.3), crimsonMat);
				guard.position.set(0, -0.02, -0.03);
				kabuto.add(guard);
				// Iconic golden V-crescent kuwagata crest
				for (const side of [-1, 1]) {
					const horn = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.36, 0.022), goldMat);
					horn.position.set(side * 0.16, 0.28, 0.26);
					horn.rotation.z = -side * 0.62;
					kabuto.add(horn);
				}
				const sunDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.025, 14), goldMat);
				sunDisc.rotation.x = Math.PI / 2;
				sunDisc.position.set(0, 0.17, 0.29);
				kabuto.add(sunDisc);
				anchor.add(kabuto);
				spkmodSkinSanitizeObject(anchor);
				head.add(anchor);
				attachments.push({ parent: head, node: anchor });
			}
		}
		if (rightHand) {
			// Drawn gleaming Samurai Katana in right hand (swaps out magic staff)
			avatarRoot.updateMatrixWorld(true);
			const rootScale = avatarRoot.getWorldScale(new THREE.Vector3()).x || 1;
			const handScale = rightHand.getWorldScale(new THREE.Vector3()).x || 1;
			const holder = new THREE.Group();
			holder.name = "spkmod_skin_samurai_hand_katana";
			holder.scale.setScalar(rootScale / Math.max(1e-4, handScale));

			const hiltMat = toon(0xdc2626);
			const guardMat = toon(0xffd700, { emissive: 0xb45309, emissiveIntensity: 0.4 });
			const bladeMat = toon(0xf1f5f9, { emissive: 0x94a3b8, emissiveIntensity: 0.35 });
			const katana = new THREE.Group();
			const pommel = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.03, 10), guardMat);
			pommel.position.y = -0.10;
			katana.add(pommel);
			const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.024, 0.20, 8), hiltMat);
			hilt.position.y = 0.0;
			katana.add(hilt);
			const tsuba = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.018, 14), guardMat);
			tsuba.position.y = 0.11;
			katana.add(tsuba);
			const blade = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.72, 0.044), bladeMat);
			blade.position.set(0, 0.48, 0.008);
			katana.add(blade);
			const tip = new THREE.Mesh(new THREE.ConeGeometry(0.024, 0.12, 4), bladeMat);
			tip.position.set(0, 0.89, 0.008);
			tip.scale.set(0.35, 1.0, 0.95);
			katana.add(tip);

			// In R_Hand space: blade tip points forward (+Z), pitched up (~25deg) and slightly outward
			katana.quaternion.set(0.6335, -0.5541, -0.4393, 0.3142);
			katana.position.set(0.03, -0.05, 0.03);
			holder.add(katana);
			spkmodSkinSanitizeObject(holder);
			holder.userData.spkmodSkinHandProp = true;
			holder.userData.spkmodHideInSpeakov = true;
			rightHand.add(holder);
			attachments.push({ parent: rightHand, node: holder });
		}
		if (spine) {
			// Crossed back katanas mounted flush behind Speaki's veil so hilts & scabbards stay fully visible
			const katanaAnchor = spkmodSkinCreateBodyAnchor(avatarRoot, spine, "spkmod_skin_samurai_katanas", new THREE.Vector3(0, 0.06, -0.48));
			if (katanaAnchor) {
				const sheathMat = toon(0x18181b);
				const hiltMat = toon(0xdc2626);
				const guardMat = toon(0xffd700, { emissive: 0xb45309, emissiveIntensity: 0.35 });
				const backRack = new THREE.Group();
				backRack.rotation.x = 0.26;
				for (const side of [-1, 1]) {
					const sword = new THREE.Group();
					sword.rotation.z = side * 0.56;
					const scabbard = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.84, 0.032), sheathMat);
					scabbard.position.y = -0.04;
					sword.add(scabbard);
					const tsuba = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.02, 12), guardMat);
					tsuba.position.y = 0.39;
					sword.add(tsuba);
					const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.25, 8), hiltMat);
					hilt.position.y = 0.53;
					sword.add(hilt);
					backRack.add(sword);
				}
				katanaAnchor.add(backRack);
				spkmodSkinSanitizeObject(katanaAnchor);
				spine.add(katanaAnchor);
				attachments.push({ parent: spine, node: katanaAnchor });
			}
		}
	} else if (builder === "astronaut") {
		if (head) {
			const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
			if (anchor) {
				const glassMat = toon(0xe0f2fe, { emissive: 0x38bdf8, emissiveIntensity: 0.22, transparent: true, opacity: 0.32, depthWrite: false });
				const ringMat = toon(0xf8fafc);
				const accentMat = toon(0xf59e0b, { emissive: 0xd97706, emissiveIntensity: 0.35 });
				const starMat = toon(0xfef08a, { emissive: 0xfacc15, emissiveIntensity: 0.95 });
				const helmet = new THREE.Group();
				helmet.position.set(0, -0.56, 0.03);
				const bubble = new THREE.Mesh(new THREE.SphereGeometry(0.60, 22, 16), glassMat);
				helmet.add(bubble);
				const neckRing = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.045, 10, 24), ringMat);
				neckRing.rotation.x = Math.PI / 2;
				neckRing.position.y = -0.46;
				helmet.add(neckRing);
				// Side comms ear pods + antenna
				for (const side of [-1, 1]) {
					const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.065, 12), accentMat);
					pod.rotation.z = Math.PI / 2;
					pod.position.set(side * 0.59, 0, 0);
					helmet.add(pod);
				}
				const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.016, 0.26, 8), ringMat);
				antenna.position.set(0.59, 0.15, -0.04);
				helmet.add(antenna);
				const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.038, 10, 8), toon(0x38bdf8, { emissive: 0x38bdf8, emissiveIntensity: 1.0 }));
				beacon.position.set(0.59, 0.29, -0.04);
				helmet.add(beacon);
				// Orbiting golden star satellite around helmet
				const sat = new THREE.Mesh(new THREE.OctahedronGeometry(0.08, 0), starMat);
				sat.position.set(0.70, 0.18, 0);
				helmet.add(sat);
				animParts.push({ type: "orbit", node: sat, radius: 0.70, baseY: 0.18 });
				anchor.add(helmet);
				spkmodSkinSanitizeObject(anchor);
				head.add(anchor);
				attachments.push({ parent: head, node: anchor });
			}
		}
		if (spine) {
			// Positioned cleanly outside Speaki's veil and tilted slightly along the veil slope
			const packAnchor = spkmodSkinCreateBodyAnchor(avatarRoot, spine, "spkmod_skin_astronaut_jetpack", new THREE.Vector3(0, -0.04, -0.72));
			if (packAnchor) {
				const packMat = toon(0xf1f5f9);
				const trimMat = toon(0x334155);
				const accentMat = toon(0x38bdf8, { emissive: 0x0284c7, emissiveIntensity: 0.5 });
				const flameMat = toon(0x38bdf8, { emissive: 0x0ea5e9, emissiveIntensity: 1.0, transparent: true, opacity: 0.88 });
				const jetpackGroup = new THREE.Group();
				jetpackGroup.rotation.x = 0.24;
				const coreBox = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.36, 0.15), packMat);
				jetpackGroup.add(coreBox);
				const coreLight = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.02), accentMat);
				coreLight.position.set(0, 0.04, -0.08);
				jetpackGroup.add(coreLight);
				for (const side of [-1, 1]) {
					const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.42, 12), packMat);
					tank.position.set(side * 0.20, 0.02, -0.02);
					jetpackGroup.add(tank);
					const cap = new THREE.Mesh(new THREE.SphereGeometry(0.095, 10, 8), trimMat);
					cap.position.set(side * 0.20, 0.23, -0.02);
					jetpackGroup.add(cap);
					const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.085, 0.10, 12), trimMat);
					nozzle.position.set(side * 0.20, -0.23, -0.02);
					jetpackGroup.add(nozzle);
					const flame = new THREE.Mesh(new THREE.ConeGeometry(0.072, 0.30, 10), flameMat);
					flame.rotation.x = Math.PI;
					flame.position.set(side * 0.20, -0.40, -0.02);
					jetpackGroup.add(flame);
					animParts.push({ type: "flamePulse", node: flame, phase: side > 0 ? 0 : Math.PI });
				}
				packAnchor.add(jetpackGroup);
				spkmodSkinSanitizeObject(packAnchor);
				spine.add(packAnchor);
				attachments.push({ parent: spine, node: packAnchor });
			}
		}
	} else if (builder === "kitsune") {
		if (head) {
			const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
			if (anchor) {
				const foxMat = toon(0xf97316);
				const tipMat = toon(0x1c1917);
				const fluffMat = toon(0xfef3c7);
				const ribbonMat = toon(0xdc2626);
				const bellMat = toon(0xfacc15, { emissive: 0xb45309, emissiveIntensity: 0.4 });
				for (const side of [-1, 1]) {
					const earPivot = new THREE.Group();
					earPivot.position.set(side * 0.21, -0.05, 0.02);
					const baseRotZ = -side * 0.34;
					earPivot.rotation.z = baseRotZ;
					earPivot.rotation.x = 0.08;
					// Tall fluffy pointed fox ear
					const outer = new THREE.Mesh(new THREE.ConeGeometry(0.145, 0.36, 4), foxMat);
					outer.rotation.y = Math.PI / 4;
					outer.scale.set(1.0, 1.0, 0.56);
					outer.position.y = 0.15;
					earPivot.add(outer);
					// Dark charcoal fox ear tip
					const tip = new THREE.Mesh(new THREE.ConeGeometry(0.068, 0.15, 4), tipMat);
					tip.rotation.y = Math.PI / 4;
					tip.scale.set(1.0, 1.0, 0.56);
					tip.position.y = 0.265;
					earPivot.add(tip);
					// Soft cream fluffy inner ear tuft
					const inner = new THREE.Mesh(new THREE.ConeGeometry(0.092, 0.24, 4), fluffMat);
					inner.rotation.y = Math.PI / 4;
					inner.scale.set(1.0, 1.0, 0.45);
					inner.position.set(0, 0.12, 0.036);
					earPivot.add(inner);
					// Shrine-maiden crimson bow & gold bell tucked at base of left ear
					if (side === 1) {
						for (const bs of [-1, 1]) {
							const wing = new THREE.Mesh(new THREE.ConeGeometry(0.048, 0.085, 4), ribbonMat);
							wing.position.set(bs * 0.042, 0.02, 0.085);
							wing.rotation.z = bs * (Math.PI / 2);
							earPivot.add(wing);
						}
						const bell = new THREE.Mesh(new THREE.SphereGeometry(0.034, 10, 8), bellMat);
						bell.position.set(0, -0.01, 0.098);
						earPivot.add(bell);
					}
					anchor.add(earPivot);
					animParts.push({ type: "earWiggle", node: earPivot, side, baseRotZ });
				}
				spkmodSkinSanitizeObject(anchor);
				head.add(anchor);
				attachments.push({ parent: head, node: anchor });
			}
		}
		if (pelvis) {
			// Anchored directly to lower back so all 3 fox tails stay attached (even in Wide Body) while sweeping out behind veil
			const tailAnchor = spkmodSkinCreateBodyAnchor(avatarRoot, pelvis, "spkmod_skin_kitsune_tails", new THREE.Vector3(0, -0.14, -0.22));
			if (tailAnchor) {
				const foxMat = toon(0xf97316);
				const whiteMat = toon(0xfffbeb, { emissive: 0xfef3c7, emissiveIntensity: 0.18 });
				const tailConfigs = [
					{ baseRotY: -0.58, phase: -0.9, scale: 0.96 },
					{ baseRotY:  0.00, phase:  0.0, scale: 1.08 },
					{ baseRotY:  0.58, phase:  0.9, scale: 0.96 }
				];
				const segs = [
					{ y: -0.02, z: -0.08, r: 0.072, white: false },
					{ y:  0.00, z: -0.24, r: 0.088, white: false },
					{ y:  0.04, z: -0.40, r: 0.105, white: false },
					{ y:  0.14, z: -0.56, r: 0.125, white: false },
					{ y:  0.29, z: -0.70, r: 0.128, white: false },
					{ y:  0.46, z: -0.80, r: 0.118, white: true  },
					{ y:  0.62, z: -0.88, r: 0.098, white: true  }
				];
				for (const cfg of tailConfigs) {
					const tailRoot = new THREE.Group();
					tailRoot.rotation.y = cfg.baseRotY;
					tailRoot.scale.setScalar(cfg.scale);
					for (const sg of segs) {
						const puff = new THREE.Mesh(new THREE.SphereGeometry(sg.r, 12, 10), sg.white ? whiteMat : foxMat);
						puff.scale.set(0.95, 1.05, 1.32);
						puff.position.set(0, sg.y, sg.z);
						tailRoot.add(puff);
					}
					const tipCone = new THREE.Mesh(new THREE.ConeGeometry(0.098, 0.28, 10), whiteMat);
					tipCone.position.set(0, 0.76, -0.94);
					tipCone.rotation.x = -0.48;
					tailRoot.add(tipCone);
					tailAnchor.add(tailRoot);
					animParts.push({ type: "tail", node: tailRoot, baseRotY: cfg.baseRotY, phase: cfg.phase, speed: 3.6, amp: 0.20 });
				}
				spkmodSkinSanitizeObject(tailAnchor);
				pelvis.add(tailAnchor);
				attachments.push({ parent: pelvis, node: tailAnchor });
			}
		}
	} else if (builder === "angler") {
		if (head) {
			const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
			if (anchor) {
				const strawMat = toon(0xeab308);
				const bandMat = toon(0xdc2626);
				const lureMat = toon(0x38bdf8, { emissive: 0x0284c7, emissiveIntensity: 0.4 });
				const hat = new THREE.Group();
				hat.position.set(0, -0.06, 0);
				const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.032, 24), strawMat);
				brim.position.y = 0.02;
				hat.add(brim);
				const band = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.27, 0.065, 20), bandMat);
				band.position.y = 0.07;
				hat.add(band);
				const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.22, 20), strawMat);
				crown.position.y = 0.17;
				hat.add(crown);
				const lure = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 8), lureMat);
				lure.position.set(0.22, 0.075, 0.16);
				hat.add(lure);
				anchor.add(hat);
				spkmodSkinSanitizeObject(anchor);
				head.add(anchor);
				attachments.push({ parent: head, node: anchor });
			}
		}
		if (rightHand) {
			const rod = new THREE.Group();
			const gripMat = toon(0x78350f);
			const poleMat = toon(0xd97706);
			const reelMat = toon(0xfacc15);
			const lineMat = toon(0xe2e8f0, { transparent: true, opacity: 0.8 });
			const fishMat = toon(0xf59e0b, { emissive: 0xd97706, emissiveIntensity: 0.4 });
			const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.026, 0.24, 8), gripMat);
			grip.position.y = 0.02;
			rod.add(grip);
			const reel = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.055, 12), reelMat);
			reel.rotation.z = Math.PI / 2;
			reel.position.set(0.035, 0.12, 0.04);
			rod.add(reel);
			const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.02, 1.12, 8), poleMat);
			pole.position.y = 0.68;
			rod.add(pole);
			// Dangling vertical fishing line + red/white bobber + golden fish
			const dangler = new THREE.Group();
			dangler.position.set(0, 1.22, 0);
			dangler.rotation.x = 0.871; // hangs straight down with gravity under Q_ROD_R
			const line = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.56, 6), lineMat);
			line.position.y = -0.28;
			dangler.add(line);
			const bobTop = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 8), toon(0xef4444));
			bobTop.position.y = -0.34;
			dangler.add(bobTop);
			const bobBot = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), toon(0xffffff));
			bobBot.position.y = -0.37;
			dangler.add(bobBot);
			const fishBody = new THREE.Mesh(new THREE.SphereGeometry(0.068, 12, 10), fishMat);
			fishBody.scale.set(0.6, 1.35, 0.85);
			fishBody.position.y = -0.58;
			dangler.add(fishBody);
			const fishTail = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.10, 4), fishMat);
			fishTail.position.y = -0.70;
			dangler.add(fishTail);
			rod.add(dangler);
			animParts.push({ type: "cape", node: dangler, baseRotX: 0.871 });
			attachHandProp(rightHand, "spkmod_skin_angler_rod", rod, Q_ROD_R, [0.03, -0.08, 0.04], { hideInSpeakov: true });
		}
	} else if (builder === "idol") {
		if (head) {
			const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
			if (anchor) {
				const pinkMat = toon(0xec4899, { emissive: 0xbe185d, emissiveIntensity: 0.25 });
				const goldMat = toon(0xfef08a, { emissive: 0xfacc15, emissiveIntensity: 0.75 });
				const mini = new THREE.Group();
				mini.position.set(0.18, -0.03, 0.05);
				mini.rotation.z = -0.34;
				const beret = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.19, 0.06, 16), pinkMat);
				mini.add(beret);
				const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.075, 0), goldMat);
				star.position.set(0, 0.09, 0.08);
				mini.add(star);
				animParts.push({ type: "spinY", node: star });
				anchor.add(mini);
				spkmodSkinSanitizeObject(anchor);
				head.add(anchor);
				attachments.push({ parent: head, node: anchor });
			}
		}
		if (rightHand) {
			const mic = new THREE.Group();
			const bodyMat = toon(0xec4899, { emissive: 0x9d174d, emissiveIntensity: 0.3 });
			const meshMat = toon(0xe2e8f0, { emissive: 0x94a3b8, emissiveIntensity: 0.25 });
			const starMat = toon(0xfef08a, { emissive: 0xfacc15, emissiveIntensity: 0.9 });
			const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.022, 0.28, 12), bodyMat);
			handle.position.y = 0.08;
			mic.add(handle);
			const micHead = new THREE.Mesh(new THREE.SphereGeometry(0.072, 14, 12), meshMat);
			micHead.position.y = 0.27;
			mic.add(micHead);
			const ring = new THREE.Mesh(new THREE.TorusGeometry(0.076, 0.014, 8, 18), starMat);
			ring.rotation.x = Math.PI / 2;
			ring.position.y = 0.27;
			mic.add(ring);
			attachHandProp(rightHand, "spkmod_skin_idol_mic", mic, Q_UP_TILT_R, [0.04, -0.14, 0.09], { hideInSpeakov: true });
		}
		if (leftHand) {
			const stick = new THREE.Group();
			const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.024, 0.16, 10), toon(0xf8fafc));
			grip.position.y = 0.02;
			stick.add(grip);
			const glowMat = toon(0xf472b6, { emissive: 0xec4899, emissiveIntensity: 1.0 });
			const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.030, 0.30, 12), glowMat);
			tube.position.y = 0.24;
			stick.add(tube);
			const starTop = new THREE.Mesh(new THREE.OctahedronGeometry(0.085, 0), toon(0xfef08a, { emissive: 0xf472b6, emissiveIntensity: 0.9 }));
			starTop.position.y = 0.44;
			stick.add(starTop);
			animParts.push({ type: "spinY", node: starTop });
			attachHandProp(leftHand, "spkmod_skin_idol_lightstick", stick, Q_UP_TILT_L, [0.04, -0.15, 0.04]);
		}
	} else if (builder === "vampire") {
		if (head) {
			const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
			if (anchor) {
				const darkMat = toon(0x18181b);
				const rubyMat = toon(0xe11d48, { emissive: 0x9f1239, emissiveIntensity: 0.7 });
				const goldMat = toon(0xfacc15);
				// Gothic bat-wing diadem
				const band = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.02, 8, 22), darkMat);
				band.rotation.x = Math.PI / 2;
				band.position.y = -0.03;
				anchor.add(band);
				const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.06, 0), rubyMat);
				gem.position.set(0, 0.03, 0.26);
				anchor.add(gem);
				for (const side of [-1, 1]) {
					const wing = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.22, 3), darkMat);
					wing.position.set(side * 0.26, 0.06, 0.04);
					wing.rotation.z = -side * 1.1;
					anchor.add(wing);
				}
				// Orbiting Halloween Bat (real game GLB with procedural fallback!)
				const batHolder = new THREE.Group();
				batHolder.position.set(0.62, 0.20, 0);
				const gltf = await spkmodSkinLoadGlb("/models/halloween-town/bat.glb");
				if (gltf && gltf.scene) {
					const bat = gltf.scene.clone(true);
					spkmodSkinMarkSharedGlb(bat);
					bat.updateMatrixWorld(true);
					const b1 = new THREE.Box3().setFromObject(bat);
					const sz = b1.getSize(new THREE.Vector3());
					const maxDim = Math.max(sz.x, sz.y, sz.z) || 1;
					bat.scale.setScalar(0.38 / maxDim);
					bat.updateMatrixWorld(true);
					const b2 = new THREE.Box3().setFromObject(bat);
					bat.position.sub(b2.getCenter(new THREE.Vector3()));
					batHolder.add(bat);
				} else {
					const bBody = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), darkMat);
					batHolder.add(bBody);
					for (const s of [-1, 1]) {
						const bw = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.015), darkMat);
						bw.position.set(s * 0.12, 0.02, 0);
						batHolder.add(bw);
					}
				}
				anchor.add(batHolder);
				animParts.push({ type: "orbit", node: batHolder, radius: 0.62, baseY: 0.20 });
				spkmodSkinSanitizeObject(anchor);
				head.add(anchor);
				attachments.push({ parent: head, node: anchor });
			}
		}
		if (rightHand) {
			const rapier = new THREE.Group();
			const goldMat = toon(0xfacc15, { emissive: 0xa16207, emissiveIntensity: 0.35 });
			const rubyMat = toon(0xe11d48, { emissive: 0x9f1239, emissiveIntensity: 0.65 });
			const bladeMat = toon(0xf8fafc, { emissive: 0x94a3b8, emissiveIntensity: 0.35 });
			const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.022, 0.20, 8), toon(0x18181b));
			rapier.add(hilt);
			const pommel = new THREE.Mesh(new THREE.OctahedronGeometry(0.042, 0), rubyMat);
			pommel.position.y = -0.12;
			rapier.add(pommel);
			const basket = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 8, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.55), goldMat);
			basket.position.y = 0.14;
			rapier.add(basket);
			const blade = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.88, 6), bladeMat);
			blade.position.y = 0.56;
			rapier.add(blade);
			attachHandProp(rightHand, "spkmod_skin_vampire_rapier", rapier, Q_HERO_R, [0.03, -0.05, 0.03], { hideInSpeakov: true });
		}
		if (leftHand) {
			const goblet = new THREE.Group();
			const goldMat = toon(0xfacc15, { emissive: 0xa16207, emissiveIntensity: 0.35 });
			const wineMat = toon(0xbe123c, { emissive: 0x881337, emissiveIntensity: 0.6 });
			const base = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.075, 0.025, 14), goldMat);
			base.position.y = -0.06;
			goblet.add(base);
			const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.14, 10), goldMat);
			stem.position.y = 0.02;
			goblet.add(stem);
			const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.092, 0.048, 0.14, 16), goldMat);
			cup.position.y = 0.15;
			goblet.add(cup);
			const wine = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.082, 0.018, 14), wineMat);
			wine.position.y = 0.215;
			goblet.add(wine);
			attachHandProp(leftHand, "spkmod_skin_vampire_goblet", goblet, Q_UP_TILT_L, [0.03, -0.06, -0.04]);
		}
	} else if (builder === "rockstar") {
		if (head) {
			const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
			if (anchor) {
				const frameMat = toon(0xc026d3, { emissive: 0xa21caf, emissiveIntensity: 0.5 });
				const lensMat = toon(0x18181b, { emissive: 0x4c1d95, emissiveIntensity: 0.45 });
				const spikeMat = toon(0xe2e8f0);
				// Spiky rock headband
				const band = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.026, 8, 20, Math.PI), toon(0x18181b));
				band.position.set(0, -0.31, 0.02);
				anchor.add(band);
				for (let i = -2; i <= 2; i++) {
					const ang = Math.PI / 2 + i * 0.34;
					const spike = new THREE.Mesh(new THREE.ConeGeometry(0.034, 0.12, 6), spikeMat);
					spike.position.set(Math.cos(ang) * 0.36, -0.31 + Math.sin(ang) * 0.36, 0.02);
					spike.rotation.z = ang - Math.PI / 2;
					anchor.add(spike);
				}
				// Neon rockstar shades calibrated to Speaki's eye line (y = -0.71, z = +0.48)
				const shades = new THREE.Group();
				shades.position.set(0, -0.71, 0.48);
				for (const side of [-1, 1]) {
					const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, 0.025, 5), lensMat);
					lens.rotation.x = Math.PI / 2;
					lens.position.set(side * 0.145, 0, 0);
					shades.add(lens);
					const rim = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.018, 6, 5), frameMat);
					rim.position.set(side * 0.145, 0, 0.01);
					shades.add(rim);
					const temple = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.024, 0.44), frameMat);
					temple.position.set(side * 0.265, 0.03, -0.22);
					shades.add(temple);
				}
				const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.024, 0.028), frameMat);
				bridge.position.set(0, 0.03, 0);
				shades.add(bridge);
				anchor.add(shades);
				spkmodSkinSanitizeObject(anchor);
				head.add(anchor);
				attachments.push({ parent: head, node: anchor });
			}
		}
		if (rightHand) {
			const guitar = new THREE.Group();
			const bodyMat = toon(0xdc2626, { emissive: 0x7f1d1d, emissiveIntensity: 0.25 });
			const guardMat = toon(0xf8fafc);
			const neckMat = toon(0x18181b);
			const metalMat = toon(0xe2e8f0);
			// Flying-V rock guitar body
			for (const side of [-1, 1]) {
				const wing = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.46, 0.055), bodyMat);
				wing.position.set(side * 0.12, -0.06, 0);
				wing.rotation.z = side * 0.36;
				guitar.add(wing);
			}
			const core = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.26, 0.06), bodyMat);
			core.position.y = 0.08;
			guitar.add(core);
			const pick = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.22, 0.065), guardMat);
			pick.position.set(0, 0.08, 0.008);
			guitar.add(pick);
			for (const py of [0.02, 0.12]) {
				const pickup = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.032, 0.075), metalMat);
				pickup.position.set(0, py, 0.01);
				guitar.add(pickup);
			}
			const neck = new THREE.Mesh(new THREE.BoxGeometry(0.068, 0.62, 0.038), neckMat);
			neck.position.set(0, 0.48, 0.005);
			guitar.add(neck);
			const headStock = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.22, 4), bodyMat);
			headStock.position.set(0, 0.86, 0.005);
			headStock.scale.set(1.0, 1.0, 0.45);
			guitar.add(headStock);
			attachHandProp(rightHand, "spkmod_skin_rockstar_guitar", guitar, Q_GUITAR_R, [0.04, -0.14, 0.09], { hideInSpeakov: true });
		}
	} else if (builder === "mage") {
		if (head) {
			const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
			if (anchor) {
				const goldMat = toon(0xfacc15, { emissive: 0xb45309, emissiveIntensity: 0.45 });
				const crystalMat = toon(0x38bdf8, { emissive: 0x0ea5e9, emissiveIntensity: 0.95 });
				const halo = new THREE.Mesh(new THREE.TorusGeometry(0.30, 0.018, 8, 28), goldMat);
				halo.rotation.x = Math.PI / 2;
				halo.position.y = 0.16;
				anchor.add(halo);
				animParts.push({ type: "floatY", node: halo, baseY: 0.16 });
				for (let i = 0; i < 3; i++) {
					const orb = new THREE.Mesh(new THREE.OctahedronGeometry(0.065, 0), crystalMat);
					anchor.add(orb);
					animParts.push({ type: "orbit", node: orb, radius: 0.44, baseY: 0.14, phase: (Math.PI * 2 * i) / 3 });
				}
				spkmodSkinSanitizeObject(anchor);
				head.add(anchor);
				attachments.push({ parent: head, node: anchor });
			}
		}
		if (leftHand) {
			const tome = new THREE.Group();
			const coverMat = toon(0x7c2d12);
			const goldMat = toon(0xfacc15, { emissive: 0xb45309, emissiveIntensity: 0.4 });
			const pageMat = toon(0xfef3c7);
			const runeMat = toon(0x38bdf8, { emissive: 0x0ea5e9, emissiveIntensity: 1.0 });
			// Open V-shaped spellbook covers & cream pages
			const spineBar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.30), goldMat);
			spineBar.position.y = 0.06;
			tome.add(spineBar);
			for (const side of [-1, 1]) {
				const cover = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.022, 0.30), coverMat);
				cover.position.set(side * 0.10, 0.095, 0);
				cover.rotation.z = side * 0.34;
				tome.add(cover);
				const pages = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.032, 0.27), pageMat);
				pages.position.set(side * 0.095, 0.118, 0);
				pages.rotation.z = side * 0.34;
				tome.add(pages);
			}
			const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.075, 0), runeMat);
			crystal.position.y = 0.29;
			tome.add(crystal);
			animParts.push({ type: "floatY", node: crystal, baseY: 0.29 });
			animParts.push({ type: "spinY", node: crystal });
			attachHandProp(leftHand, "spkmod_skin_mage_grimoire", tome, Q_UP_TILT_L, [0.03, -0.09, -0.06]);
		}
	} else if (builder === "cowboy") {
		if (head) {
			const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
			if (anchor) {
				const suedeMat = toon(0x92400e);
				const bandMat = toon(0x451a03);
				const starMat = toon(0xfacc15, { emissive: 0xb45309, emissiveIntensity: 0.45 });
				const hat = new THREE.Group();
				hat.position.set(0, -0.06, 0);
				const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.48, 0.028, 24), suedeMat);
				brim.scale.set(0.95, 1.0, 1.12);
				brim.position.y = 0.025;
				hat.add(brim);
				for (const side of [-1, 1]) {
					const curl = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.09, 0.42), suedeMat);
					curl.position.set(side * 0.43, 0.06, 0);
					curl.rotation.z = -side * 0.42;
					hat.add(curl);
				}
				const band = new THREE.Mesh(new THREE.CylinderGeometry(0.255, 0.265, 0.065, 20), bandMat);
				band.position.y = 0.068;
				hat.add(band);
				const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.255, 0.24, 20), suedeMat);
				crown.position.y = 0.18;
				hat.add(crown);
				const badge = new THREE.Mesh(new THREE.OctahedronGeometry(0.055, 0), starMat);
				badge.position.set(0, 0.11, 0.26);
				hat.add(badge);
				anchor.add(hat);
				spkmodSkinSanitizeObject(anchor);
				head.add(anchor);
				attachments.push({ parent: head, node: anchor });
			}
		}
		if (spine) {
			const scarfAnchor = spkmodSkinCreateBodyAnchor(avatarRoot, spine, "spkmod_skin_cowboy_bandana", new THREE.Vector3(0, 0.15, 0.03));
			if (scarfAnchor) {
				const redMat = toon(0xb91c1c);
				const ring = new THREE.Mesh(new THREE.TorusGeometry(0.185, 0.042, 8, 18), redMat);
				ring.rotation.x = Math.PI / 2;
				scarfAnchor.add(ring);
				const tri = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.22, 3), redMat);
				tri.position.set(0, -0.09, 0.17);
				tri.rotation.x = Math.PI;
				scarfAnchor.add(tri);
				spkmodSkinSanitizeObject(scarfAnchor);
				spine.add(scarfAnchor);
				attachments.push({ parent: spine, node: scarfAnchor });
			}
		}
		if (rightHand) {
			const ok = await attachSpeakovGun(rightHand, "spkmod_skin_cowboy_pistol", "/models/speakov/weapon-pistol.glb", "weapon-pistol-grip-socket", false);
			if (!ok) {
				// Procedural Wild-West revolver fallback
				const rev = new THREE.Group();
				const woodMat = toon(0x78350f);
				const steelMat = toon(0x64748b);
				const grip = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.16, 0.07), woodMat);
				grip.position.set(0, -0.04, -0.02);
				rev.add(grip);
				const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.08, 10), steelMat);
				cyl.rotation.x = Math.PI / 2;
				cyl.position.set(0, 0.08, 0.06);
				rev.add(cyl);
				const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.022, 0.30, 10), steelMat);
				barrel.rotation.x = Math.PI / 2;
				barrel.position.set(0, 0.09, 0.22);
				rev.add(barrel);
				attachHandProp(rightHand, "spkmod_skin_cowboy_pistol", rev, [0.5, -0.5, -0.5, 0.5], [0.03, -0.05, 0.04], { hideInSpeakov: true });
			}
		}
	} else if (builder === "blacksmith") {
		if (head) {
			const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
			if (anchor) {
				const brassMat = toon(0xd97706, { emissive: 0x78350f, emissiveIntensity: 0.3 });
				const lensMat = toon(0x38bdf8, { emissive: 0x0284c7, emissiveIntensity: 0.6 });
				const strapMat = toon(0x451a03);
				// Brass forge goggles perched cleanly on headband (y = -0.34, z = +0.46)
				const gog = new THREE.Group();
				gog.position.set(0, -0.34, 0.46);
				for (const side of [-1, 1]) {
					const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.07, 16), brassMat);
					cup.rotation.x = Math.PI / 2;
					cup.position.set(side * 0.135, 0, 0);
					gog.add(cup);
					const lens = new THREE.Mesh(new THREE.CircleGeometry(0.078, 14), lensMat);
					lens.position.set(side * 0.135, 0, 0.038);
					gog.add(lens);
				}
				const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.03, 0.04), strapMat);
				gog.add(bridge);
				const strap = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.026, 8, 24), strapMat);
				strap.rotation.x = Math.PI / 2;
				strap.position.set(0, 0, -0.44);
				gog.add(strap);
				anchor.add(gog);
				spkmodSkinSanitizeObject(anchor);
				head.add(anchor);
				attachments.push({ parent: head, node: anchor });
			}
		}
		if (rightHand) {
			const hammer = new THREE.Group();
			const haftMat = toon(0x5c2d16);
			const ironMat = toon(0x334155);
			const lavaMat = toon(0xf97316, { emissive: 0xea580c, emissiveIntensity: 1.0 });
			const haft = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.032, 0.92, 10), haftMat);
			haft.position.y = 0.34;
			hammer.add(haft);
			const headBox = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 0.44), ironMat);
			headBox.position.y = 0.78;
			hammer.add(headBox);
			const core = new THREE.Mesh(new THREE.BoxGeometry(0.255, 0.11, 0.20), lavaMat);
			core.position.y = 0.78;
			hammer.add(core);
			for (const s of [-1, 1]) {
				const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.06, 8), lavaMat);
				cap.rotation.x = Math.PI / 2;
				cap.position.set(0, 0.78, s * 0.24);
				hammer.add(cap);
			}
			attachHandProp(rightHand, "spkmod_skin_blacksmith_hammer", hammer, Q_HERO_R, [0.03, -0.09, 0.04], { hideInSpeakov: true });
		}
	} else if (builder === "rainy") {
		if (head) {
			const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
			if (anchor) {
				const frogMat = toon(0x22c55e);
				const whiteMat = toon(0xffffff);
				const pupilMat = toon(0x09090b);
				const blushMat = toon(0xf472b6);
				const hood = new THREE.Group();
				hood.position.set(0, -0.04, 0.02);
				for (const side of [-1, 1]) {
					const dome = new THREE.Mesh(new THREE.SphereGeometry(0.125, 14, 12), frogMat);
					dome.position.set(side * 0.18, 0.08, 0.04);
					hood.add(dome);
					const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.088, 12, 10), whiteMat);
					sclera.position.set(side * 0.18, 0.09, 0.115);
					hood.add(sclera);
					const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.048, 10, 8), pupilMat);
					pupil.position.set(side * 0.18, 0.09, 0.18);
					hood.add(pupil);
					const blush = new THREE.Mesh(new THREE.SphereGeometry(0.042, 8, 8), blushMat);
					blush.scale.set(1.3, 0.75, 0.5);
					blush.position.set(side * 0.25, 0.01, 0.14);
					hood.add(blush);
				}
				anchor.add(hood);
				spkmodSkinSanitizeObject(anchor);
				head.add(anchor);
				attachments.push({ parent: head, node: anchor });
			}
		}
		if (rightHand) {
			const umb = new THREE.Group();
			const poleMat = toon(0xe2e8f0);
			const handleMat = toon(0x92400e);
			const canopyMat = toon(0xfde047, { side: THREE.DoubleSide });
			const trimMat = toon(0x34d399, { side: THREE.DoubleSide });
			const jHandle = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.018, 8, 14, Math.PI), handleMat);
			jHandle.rotation.z = Math.PI;
			jHandle.position.set(0.055, -0.05, 0);
			umb.add(jHandle);
			const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.018, 1.94, 10), poleMat);
			shaft.position.y = 0.93;
			umb.add(shaft);
			// Tall open pastel umbrella canopy high above Speaki's head & frog eyes
			const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.70, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.42), canopyMat);
			canopy.position.y = 1.38;
			umb.add(canopy);
			const rim = new THREE.Mesh(new THREE.TorusGeometry(0.67, 0.025, 8, 24), trimMat);
			rim.rotation.x = Math.PI / 2;
			rim.position.y = 1.56;
			umb.add(rim);
			const tip = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.14, 8), handleMat);
			tip.position.y = 2.10;
			umb.add(tip);
			attachHandProp(rightHand, "spkmod_skin_rainy_umbrella", umb, Q_UMBRELLA_R, [0.03, -0.14, 0.06], { hideInSpeakov: true });
		}
	} else if (builder === "reaper") {
		if (head) {
			const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
			if (anchor) {
				const darkMat = toon(0x18181b);
				const soulMat = toon(0x67e8f9, { emissive: 0x06b6d4, emissiveIntensity: 1.0 });
				const crown = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.022, 8, 22), darkMat);
				crown.rotation.x = Math.PI / 2;
				crown.position.y = -0.02;
				anchor.add(crown);
				for (const side of [-1, 1]) {
					const horn = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.22, 6), darkMat);
					horn.position.set(side * 0.20, 0.09, 0.08);
					horn.rotation.z = -side * 0.35;
					anchor.add(horn);
				}
				for (let i = 0; i < 2; i++) {
					const wisp = new THREE.Mesh(new THREE.SphereGeometry(0.068, 12, 10), soulMat);
					anchor.add(wisp);
					animParts.push({ type: "orbit", node: wisp, radius: 0.54, baseY: 0.12, phase: i * Math.PI });
				}
				spkmodSkinSanitizeObject(anchor);
				head.add(anchor);
				attachments.push({ parent: head, node: anchor });
			}
		}
		if (rightHand) {
			const scythe = new THREE.Group();
			const poleMat = toon(0x18181b);
			const wrapMat = toon(0x991b1b);
			const bladeMat = toon(0x334155);
			const edgeMat = toon(0x67e8f9, { emissive: 0x06b6d4, emissiveIntensity: 0.95 });
			const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.024, 1.76, 10), poleMat);
			shaft.position.y = 0.72;
			scythe.add(shaft);
			const wrap = new THREE.Mesh(new THREE.CylinderGeometry(0.027, 0.027, 0.22, 10), wrapMat);
			wrap.position.y = 0.02;
			scythe.add(wrap);
			const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.12, 10), bladeMat);
			collar.position.y = 1.56;
			scythe.add(collar);
			// Smooth sweeping crescent reaper blade facing forward-outward (clear of Speaki's head!)
			const blade1 = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.14, 0.40), bladeMat);
			blade1.position.set(0, 1.56, 0.21);
			blade1.rotation.x = 0.10;
			scythe.add(blade1);
			const edgeGlow1 = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.036, 0.40), edgeMat);
			edgeGlow1.position.set(0, 1.485, 0.21);
			edgeGlow1.rotation.x = 0.10;
			scythe.add(edgeGlow1);
			const blade2 = new THREE.Mesh(new THREE.BoxGeometry(0.020, 0.11, 0.30), bladeMat);
			blade2.position.set(0, 1.47, 0.51);
			blade2.rotation.x = 0.55;
			scythe.add(blade2);
			const edgeGlow2 = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.032, 0.30), edgeMat);
			edgeGlow2.position.set(0, 1.41, 0.48);
			edgeGlow2.rotation.x = 0.55;
			scythe.add(edgeGlow2);
			const bladeTip = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.26, 4), edgeMat);
			bladeTip.position.set(0, 1.30, 0.67);
			bladeTip.rotation.x = 2.42;
			bladeTip.scale.set(0.32, 1.0, 1.0);
			scythe.add(bladeTip);
			// Angled cleanly outward to Speaki's right so the pole & crescent blade clear her head and veil
			attachHandProp(rightHand, "spkmod_skin_reaper_scythe", scythe, Q_SCYTHE_R, [0.03, -0.10, 0.05], { hideInSpeakov: true });
		}
		if (leftHand) {
			const lantern = new THREE.Group();
			const ironMat = toon(0x18181b);
			const soulMat = toon(0x67e8f9, { emissive: 0x06b6d4, emissiveIntensity: 1.0 });
			const ring = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.012, 8, 14), ironMat);
			ring.position.y = 0.04;
			lantern.add(ring);
			const topCap = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.09, 6), ironMat);
			topCap.position.y = -0.04;
			lantern.add(topCap);
			const botCap = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.075, 0.04, 6), ironMat);
			botCap.position.y = -0.26;
			lantern.add(botCap);
			for (let i = 0; i < 4; i++) {
				const a = (Math.PI * 2 * i) / 4;
				const post = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.20, 6), ironMat);
				post.position.set(Math.cos(a) * 0.08, -0.15, Math.sin(a) * 0.08);
				lantern.add(post);
			}
			const flame = new THREE.Mesh(new THREE.OctahedronGeometry(0.065, 0), soulMat);
			flame.position.y = -0.15;
			lantern.add(flame);
			animParts.push({ type: "flamePulse", node: flame, phase: 0 });
			attachHandProp(leftHand, "spkmod_skin_reaper_lantern", lantern, Q_UP_TILT_L, [0.04, -0.07, -0.05]);
		}
	} else if (builder === "dragon") {
		if (head) {
			const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
			if (anchor) {
				const hornMat = toon(0xfacc15, { emissive: 0xb45309, emissiveIntensity: 0.4 });
				const gemMat = toon(0xef4444, { emissive: 0xdc2626, emissiveIntensity: 0.95 });
				for (const side of [-1, 1]) {
					const hGroup = new THREE.Group();
					hGroup.position.set(side * 0.21, -0.04, 0.02);
					hGroup.rotation.z = -side * 0.48;
					hGroup.rotation.x = -0.42;
					const base = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.28, 8), hornMat);
					base.position.y = 0.12;
					hGroup.add(base);
					const tip = new THREE.Mesh(new THREE.ConeGeometry(0.046, 0.26, 8), hornMat);
					tip.position.set(side * 0.04, 0.30, -0.08);
					tip.rotation.x = -0.45;
					tip.rotation.z = -side * 0.22;
					hGroup.add(tip);
					anchor.add(hGroup);
				}
				const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.065, 0), gemMat);
				gem.position.set(0, -0.02, 0.28);
				anchor.add(gem);
				spkmodSkinSanitizeObject(anchor);
				head.add(anchor);
				attachments.push({ parent: head, node: anchor });
			}
		}
		if (spine) {
			const wingAnchor = spkmodSkinCreateBodyAnchor(avatarRoot, spine, "spkmod_skin_dragon_wings", new THREE.Vector3(0, 0.10, -0.70));
			if (wingAnchor) {
				const memMat = toon(0x991b1b, { emissive: 0x450a0a, emissiveIntensity: 0.3, side: THREE.DoubleSide });
				const goldMat = toon(0xfacc15, { emissive: 0xb45309, emissiveIntensity: 0.35 });
				for (const side of [-1, 1]) {
					const wing = new THREE.Group();
					wing.position.set(side * 0.16, 0.06, 0);
					const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.032, 0.76, 8), goldMat);
					strut.position.set(side * 0.34, 0.24, -0.05);
					strut.rotation.z = -side * 0.98;
					wing.add(strut);
					const upper = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.34, 0.026), memMat);
					upper.position.set(side * 0.40, 0.14, -0.06);
					upper.rotation.z = side * 0.32;
					upper.rotation.y = side * 0.22;
					wing.add(upper);
					const lower = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.22, 0.024), memMat);
					lower.position.set(side * 0.34, -0.10, -0.05);
					lower.rotation.z = -side * 0.20;
					lower.rotation.y = side * 0.22;
					wing.add(lower);
					wingAnchor.add(wing);
					animParts.push({ type: "wing", node: wing, side });
				}
				spkmodSkinSanitizeObject(wingAnchor);
				spine.add(wingAnchor);
				attachments.push({ parent: spine, node: wingAnchor });
			}
		}
		if (rightHand) {
			const sword = new THREE.Group();
			const goldMat = toon(0xfacc15, { emissive: 0xb45309, emissiveIntensity: 0.4 });
			const steelMat = toon(0x334155);
			const flameMat = toon(0xef4444, { emissive: 0xf97316, emissiveIntensity: 0.95 });
			const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.026, 0.24, 8), toon(0x450a0a));
			sword.add(grip);
			const pommel = new THREE.Mesh(new THREE.OctahedronGeometry(0.048, 0), flameMat);
			pommel.position.y = -0.14;
			sword.add(pommel);
			// Dragon-wing crossguard
			for (const side of [-1, 1]) {
				const guardWing = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.055, 0.045), goldMat);
				guardWing.position.set(side * 0.09, 0.15, 0);
				guardWing.rotation.z = side * 0.32;
				sword.add(guardWing);
			}
			const blade = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.86, 0.032), steelMat);
			blade.position.y = 0.58;
			sword.add(blade);
			const core = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.78, 0.042), flameMat);
			core.position.y = 0.56;
			sword.add(core);
			const tip = new THREE.Mesh(new THREE.ConeGeometry(0.092, 0.20, 4), flameMat);
			tip.position.y = 1.11;
			tip.rotation.y = Math.PI / 4;
			tip.scale.set(1.0, 1.0, 0.32);
			sword.add(tip);
			attachHandProp(rightHand, "spkmod_skin_dragon_greatsword", sword, Q_HERO_R, [0.03, -0.06, 0.03], { hideInSpeakov: true });
		}
	} else if (builder === "soldier") {
		if (head) {
			const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
			if (anchor) {
				const oliveMat = toon(0x4d7c0f);
				const bandMat = toon(0x365314);
				const visorMat = toon(0x1e293b);
				const leafMat = toon(0x65a30d);
				const helm = new THREE.Group();
				helm.position.set(0, -0.10, 0);
				const dome = new THREE.Mesh(new THREE.SphereGeometry(0.35, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.60), oliveMat);
				dome.position.y = 0.02;
				helm.add(dome);
				const rim = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.028, 8, 22), oliveMat);
				rim.rotation.x = Math.PI / 2;
				rim.position.y = 0.03;
				helm.add(rim);
				const strap = new THREE.Mesh(new THREE.TorusGeometry(0.345, 0.022, 8, 22), bandMat);
				strap.rotation.x = Math.PI / 2;
				strap.position.y = 0.11;
				helm.add(strap);
				// Camo leaves tucked into helmet band + front tactical plate
				for (const s of [-1, 1]) {
					const sprig = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.14, 4), leafMat);
					sprig.position.set(s * 0.28, 0.17, 0.14);
					sprig.rotation.z = -s * 0.55;
					helm.add(sprig);
				}
				const nvgMount = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.08, 0.06), visorMat);
				nvgMount.position.set(0, 0.15, 0.32);
				helm.add(nvgMount);
				anchor.add(helm);
				spkmodSkinSanitizeObject(anchor);
				head.add(anchor);
				attachments.push({ parent: head, node: anchor });
			}
		}
		if (rightHand) {
			const ok = await attachSpeakovGun(rightHand, "spkmod_skin_soldier_smg", "/models/speakov/weapon-smg.glb", "weapon-smg-grip-socket", false);
			if (!ok) {
				const smg = new THREE.Group();
				const darkMat = toon(0x1e293b);
				const body = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.36, 0.09), darkMat);
				body.position.set(0, 0.14, 0.06);
				smg.add(body);
				const mag = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.06, 0.20), darkMat);
				mag.position.set(0, 0.16, -0.06);
				smg.add(mag);
				const holder = attachHandProp(rightHand, "spkmod_skin_soldier_smg", smg, [0.5, -0.5, -0.5, 0.5], [0.03, -0.05, 0.04], { hideInSpeakov: true });
				if (holder) holder.rotation.x = 0.18;
			}
		}
	} else if (builder === "swat") {
		if (head) {
			const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
			if (anchor) {
				const armorMat = toon(0x0f172a);
				const trimMat = toon(0x334155);
				const visorMat = toon(0x38bdf8, { emissive: 0x0284c7, emissiveIntensity: 0.35, transparent: true, opacity: 0.45, side: THREE.DoubleSide });
				const helm = new THREE.Group();
				helm.position.set(0, -0.10, 0);
				const dome = new THREE.Mesh(new THREE.SphereGeometry(0.36, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.62), armorMat);
				dome.position.y = 0.02;
				helm.add(dome);
				const rail = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.05, 0.30), trimMat);
				rail.position.set(0, 0.37, 0);
				helm.add(rail);
				// Translucent ballistic riot visor curving down across forehead/eyes
				const shield = new THREE.Mesh(new THREE.CylinderGeometry(0.49, 0.49, 0.24, 18, 1, true, -Math.PI * 0.34, Math.PI * 0.68), visorMat);
				shield.position.set(0, -0.58, 0.02);
				helm.add(shield);
				const visorBar = new THREE.Mesh(new THREE.TorusGeometry(0.49, 0.018, 8, 18, Math.PI * 0.68), armorMat);
				visorBar.rotation.x = Math.PI / 2;
				visorBar.rotation.z = -Math.PI * 0.34 + Math.PI / 2;
				visorBar.position.set(0, -0.46, 0.02);
				helm.add(visorBar);
				// Side comms earcup + mic boom
				const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.05, 12), trimMat);
				cup.rotation.z = Math.PI / 2;
				cup.position.set(0.36, -0.02, 0);
				helm.add(cup);
				anchor.add(helm);
				spkmodSkinSanitizeObject(anchor);
				head.add(anchor);
				attachments.push({ parent: head, node: anchor });
			}
		}
		if (rightHand) {
			const ok = await attachSpeakovGun(rightHand, "spkmod_skin_swat_shotgun", "/models/speakov/weapon-shotgun.glb", "weapon-shotgun-grip-socket", false);
			if (!ok) {
				const sg = new THREE.Group();
				const darkMat = toon(0x1e293b);
				const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.66, 10), darkMat);
				barrel.position.set(0, 0.28, 0.04);
				sg.add(barrel);
				const holder = attachHandProp(rightHand, "spkmod_skin_swat_shotgun", sg, [0.5, -0.5, -0.5, 0.5], [0.03, -0.05, 0.04], { hideInSpeakov: true });
				if (holder) holder.rotation.x = 0.18;
			}
		}
	} else if (builder === "agent") {
		if (head) {
			const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
			if (anchor) {
				const lensMat = toon(0x09090b, { emissive: 0x0f172a, emissiveIntensity: 0.45 });
				const frameMat = toon(0xcbd5e1);
				const shades = new THREE.Group();
				shades.position.set(0, -0.71, 0.48);
				for (const side of [-1, 1]) {
					const lens = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.135, 0.024), lensMat);
					lens.position.set(side * 0.145, 0, 0);
					shades.add(lens);
					const rim = new THREE.Mesh(new THREE.BoxGeometry(0.225, 0.018, 0.03), frameMat);
					rim.position.set(side * 0.145, 0.072, 0);
					shades.add(rim);
					const temple = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.022, 0.44), frameMat);
					temple.position.set(side * 0.265, 0.04, -0.22);
					shades.add(temple);
				}
				const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.02, 0.03), frameMat);
				bridge.position.set(0, 0.045, 0);
				shades.add(bridge);
				anchor.add(shades);
				// Spy earpiece glow dot on side
				const earLed = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 8), toon(0x22c55e, { emissive: 0x22c55e, emissiveIntensity: 1.0 }));
				earLed.position.set(0.45, -0.68, 0.06);
				anchor.add(earLed);
				spkmodSkinSanitizeObject(anchor);
				head.add(anchor);
				attachments.push({ parent: head, node: anchor });
			}
		}
		// Dual-wield Speakov Pistols (Right + Left Hand in low-ready down-pointing pose!)
		if (rightHand) {
			await attachSpeakovGun(rightHand, "spkmod_skin_agent_pistol_r", "/models/speakov/weapon-pistol.glb", "weapon-pistol-grip-socket", false, true);
		}
		if (leftHand) {
			await attachSpeakovGun(leftHand, "spkmod_skin_agent_pistol_l", "/models/speakov/weapon-pistol.glb", "weapon-pistol-grip-socket", true, true);
		}
	} else if (builder === "sniper") {
		if (head) {
			const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
			if (anchor) {
				const camoMat = toon(0x3f6212);
				const leafMat = toon(0x166534);
				const metalMat = toon(0x1e293b);
				const nvgMat = toon(0x4ade80, { emissive: 0x22c55e, emissiveIntensity: 1.0 });
				// Woodland Recon Boonie Hat w/ ghillie foliage tufts
				const hat = new THREE.Group();
				hat.position.set(0, -0.06, 0);
				const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.47, 0.026, 22), camoMat);
				brim.position.y = 0.02;
				hat.add(brim);
				const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.27, 0.18, 18), camoMat);
				crown.position.y = 0.11;
				hat.add(crown);
				for (let i = 0; i < 6; i++) {
					const a = (Math.PI * 2 * i) / 6;
					const tuft = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.15, 5), leafMat);
					tuft.position.set(Math.cos(a) * 0.28, 0.12, Math.sin(a) * 0.28);
					tuft.rotation.z = -Math.cos(a) * 0.65;
					tuft.rotation.x = Math.sin(a) * 0.65;
					hat.add(tuft);
				}
				anchor.add(hat);
				// Glowing Emerald Night-Vision Targeting Monocle on eye line (y = -0.71, z = +0.48)
				const scopeRing = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.088, 0.09, 16), metalMat);
				scopeRing.rotation.x = Math.PI / 2;
				scopeRing.position.set(-0.145, -0.71, 0.49);
				anchor.add(scopeRing);
				const scopeGlass = new THREE.Mesh(new THREE.CircleGeometry(0.072, 16), nvgMat);
				scopeGlass.position.set(-0.145, -0.71, 0.538);
				anchor.add(scopeGlass);
				const strap = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.025, 0.44), metalMat);
				strap.position.set(-0.24, -0.71, 0.28);
				anchor.add(strap);
				spkmodSkinSanitizeObject(anchor);
				head.add(anchor);
				attachments.push({ parent: head, node: anchor });
			}
		}
		if (rightHand) {
			// Custom Long-Barrel Anti-Materiel Sniper Rifle (built in gun-space: +Y=barrel, +Z=scope UP)
			const sniper = new THREE.Group();
			const bodyMat = toon(0x1e293b);
			const camoMat = toon(0x3f6212);
			const steelMat = toon(0x475569);
			const scopeLensMat = toon(0x4ade80, { emissive: 0x22c55e, emissiveIntensity: 0.95 });
			const laserMat = toon(0xef4444, { emissive: 0xef4444, emissiveIntensity: 1.0, transparent: true, opacity: 0.72 });
			const stock = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.34, 0.11), camoMat);
			stock.position.set(0, -0.22, 0.04);
			sniper.add(stock);
			const grip = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.07, 0.14), bodyMat);
			grip.position.set(0, 0.0, -0.02);
			sniper.add(grip);
			const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.068, 0.44, 0.11), camoMat);
			receiver.position.set(0, 0.18, 0.06);
			sniper.add(receiver);
			const mag = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.11, 0.14), bodyMat);
			mag.position.set(0, 0.22, -0.04);
			sniper.add(mag);
			const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.026, 0.88, 10), steelMat);
			barrel.position.set(0, 0.76, 0.07);
			sniper.add(barrel);
			const brake = new THREE.Mesh(new THREE.BoxGeometry(0.058, 0.14, 0.052), bodyMat);
			brake.position.set(0, 1.22, 0.07);
			sniper.add(brake);
			// Tall magnified thermal sniper scope on top (+Z)
			const mount = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.16, 0.07), bodyMat);
			mount.position.set(0, 0.20, 0.14);
			sniper.add(mount);
			const scopeTube = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.036, 0.42, 12), bodyMat);
			scopeTube.position.set(0, 0.24, 0.20);
			sniper.add(scopeTube);
			const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.015, 12), scopeLensMat);
			lens.position.set(0, 0.455, 0.20);
			sniper.add(lens);
			// Glowing red laser sight beam
			const laser = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.90, 6), laserMat);
			laser.position.set(0.042, 0.95, 0.07);
			sniper.add(laser);
			// Bipod legs folded forward
			for (const s of [-1, 1]) {
				const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.22, 6), bodyMat);
				leg.position.set(s * 0.055, 0.68, 0.02);
				leg.rotation.z = s * 0.25;
				sniper.add(leg);
			}
			const holder = attachHandProp(rightHand, "spkmod_skin_sniper_rifle", sniper, [0.5, -0.5, -0.5, 0.5], [0.03, -0.07, 0.04], { hideInSpeakov: true });
			if (holder) holder.rotation.x = 0.20;
		}
	} else if (builder === "commando") {
		if (head) {
			const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
			if (anchor) {
				const redMat = toon(0xdc2626);
				const metalMat = toon(0x334155);
				const hudMat = toon(0xf59e0b, { emissive: 0xf97316, emissiveIntensity: 0.9, transparent: true, opacity: 0.65, side: THREE.DoubleSide });
				// Iconic Red Combat Headband + twin rear tails
				const band = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.032, 8, 24), redMat);
				band.rotation.x = Math.PI / 2;
				band.position.set(0, -0.34, 0.02);
				anchor.add(band);
				for (const s of [-1, 1]) {
					const tail = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.36, 0.022), redMat);
					tail.position.set(s * 0.07, -0.46, -0.46);
					tail.rotation.z = s * 0.24;
					tail.rotation.x = 0.42;
					anchor.add(tail);
					animParts.push({ type: "cape", node: tail, baseRotX: 0.42 });
				}
				// Glowing Amber Tactical Scouter Visor over right eye (y = -0.71, z = +0.48)
				const scouterFrame = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.14), metalMat);
				scouterFrame.position.set(-0.26, -0.71, 0.40);
				anchor.add(scouterFrame);
				const hud = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.018), hudMat);
				hud.position.set(-0.14, -0.71, 0.49);
				anchor.add(hud);
				spkmodSkinSanitizeObject(anchor);
				head.add(anchor);
				attachments.push({ parent: head, node: anchor });
			}
		}
		if (rightHand) {
			// Heavy 6-Barrel Spinning Rotary Minigun (built in gun-space: +Y=barrels forward, +Z=top handle UP)
			const mini = new THREE.Group();
			const bodyMat = toon(0x1e293b);
			const steelMat = toon(0x64748b);
			const ammoMat = toon(0x4d7c0f);
			const glowMat = toon(0xf97316, { emissive: 0xea580c, emissiveIntensity: 0.95 });
			const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.34, 14), bodyMat);
			housing.position.set(0, 0.12, 0.02);
			mini.add(housing);
			// Top chainsaw carry handle (+Z)
			const handleBar = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.018, 8, 16, Math.PI), bodyMat);
			handleBar.rotation.y = Math.PI / 2;
			handleBar.position.set(0, 0.12, 0.12);
			mini.add(handleBar);
			// Underslung ammo drum (-Z)
			const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 0.16, 14), ammoMat);
			drum.rotation.z = Math.PI / 2;
			drum.position.set(0, 0.10, -0.11);
			mini.add(drum);
			// Live-spinning 6-barrel rotary cluster (spins around local Y = barrel axis!)
			const barrelCluster = new THREE.Group();
			barrelCluster.position.set(0, 0.56, 0.02);
			for (let i = 0; i < 6; i++) {
				const a = (Math.PI * 2 * i) / 6;
				const b = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.62, 8), steelMat);
				b.position.set(Math.cos(a) * 0.058, 0, Math.sin(a) * 0.058);
				barrelCluster.add(b);
			}
			for (const ry of [-0.14, 0.12, 0.27]) {
				const clamp = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.082, 0.032, 14), ry > 0.2 ? glowMat : bodyMat);
				clamp.position.y = ry;
				barrelCluster.add(clamp);
			}
			mini.add(barrelCluster);
			animParts.push({ type: "spinY", node: barrelCluster });
			const holder = attachHandProp(rightHand, "spkmod_skin_commando_minigun", mini, [0.5, -0.5, -0.5, 0.5], [0.06, -0.10, 0.04], { hideInSpeakov: true });
			if (holder) holder.rotation.x = 0.22;
		}
	} else {
		const ctx = {
			THREE, toon, avatarRoot, head, spine, pelvis, rightHand, leftHand, reviveHat,
			attachments, animParts, attachHandProp,
			Q: {
				UP_R: Q_UP_R, UMBRELLA_R: Q_UMBRELLA_R, UP_TILT_R: Q_UP_TILT_R,
				SCYTHE_R: Q_SCYTHE_R, HERO_R: Q_HERO_R, HERO_L: Q_HERO_L,
				ROD_R: Q_ROD_R, GUITAR_R: Q_GUITAR_R, UP_TILT_L: Q_UP_TILT_L,
				BOW_L: Q_BOW_L, SHIELD_L: Q_SHIELD_L, SHURIKEN_L: Q_SHURIKEN_L
			}
		};
		if (!(await spkmodBuildExtraCostumeSetA(builder, ctx))) {
			await spkmodBuildExtraCostumeSetB(builder, ctx);
		}
	}

	return { attachments, animParts };
}

// Extra 3D Costume Builders — Set A (15 costumes: Animals, Cozy & Everyday Jobs, Beach/Miko/Archer)
async function spkmodBuildExtraCostumeSetA(builder, ctx) {
	const { THREE, toon, avatarRoot, head, spine, pelvis, rightHand, leftHand, reviveHat, attachments, animParts, attachHandProp, Q } = ctx;
	const addHead = (buildFn) => {
		if (!head) return;
		const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
		if (!anchor) return;
		buildFn(anchor);
		spkmodSkinSanitizeObject(anchor);
		head.add(anchor);
		attachments.push({ parent: head, node: anchor });
	};
	const addBody = (bone, name, offset, buildFn) => {
		if (!bone) return;
		const anchor = spkmodSkinCreateBodyAnchor(avatarRoot, bone, name, new THREE.Vector3(offset[0], offset[1], offset[2]));
		if (!anchor) return;
		buildFn(anchor);
		spkmodSkinSanitizeObject(anchor);
		bone.add(anchor);
		attachments.push({ parent: bone, node: anchor });
	};

	if (builder === "panda") {
		addHead(anchor => {
			const blackMat = toon(0x18181b);
			const whiteMat = toon(0xf8fafc);
			const band = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.024, 8, 20, Math.PI), whiteMat);
			band.position.set(0, -0.32, 0.02);
			anchor.add(band);
			for (const s of [-1, 1]) {
				const ear = new THREE.Mesh(new THREE.SphereGeometry(0.135, 14, 12), blackMat);
				ear.scale.set(1.0, 0.92, 0.55);
				ear.position.set(s * 0.25, 0.03, 0.02);
				anchor.add(ear);
			}
		});
		if (rightHand) {
			const bamboo = new THREE.Group();
			const stalkMat = toon(0x16a34a);
			const nodeMat = toon(0x86efac);
			const leafMat = toon(0x22c55e, { side: THREE.DoubleSide });
			for (let i = 0; i < 4; i++) {
				const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.038, 0.24, 10), stalkMat);
				seg.position.y = -0.02 + i * 0.25;
				bamboo.add(seg);
				const ring = new THREE.Mesh(new THREE.TorusGeometry(0.038, 0.008, 6, 12), nodeMat);
				ring.rotation.x = Math.PI / 2;
				ring.position.y = 0.10 + i * 0.25;
				bamboo.add(ring);
			}
			for (const [sy, sa] of [[0.62, 0.6], [0.80, -0.7], [0.88, 0.4]]) {
				const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.22, 4), leafMat);
				leaf.scale.set(0.35, 1.0, 1.0);
				leaf.position.set(Math.sin(sa) * 0.11, sy, Math.cos(sa) * 0.05);
				leaf.rotation.z = -sa * 1.1;
				bamboo.add(leaf);
			}
			attachHandProp(rightHand, "spkmod_skin_panda_bamboo", bamboo, Q.HERO_R, [0.03, -0.07, 0.04], { hideInSpeakov: true });
		}
		return true;
	} else if (builder === "bee") {
		addHead(anchor => {
			const darkMat = toon(0x18181b);
			const goldMat = toon(0xfacc15, { emissive: 0xca8a04, emissiveIntensity: 0.45 });
			for (const s of [-1, 1]) {
				const ant = new THREE.Group();
				ant.position.set(s * 0.14, -0.02, 0.05);
				const baseRotZ = -s * 0.30;
				ant.rotation.z = baseRotZ;
				ant.rotation.x = 0.20;
				const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.018, 0.26, 8), darkMat);
				stalk.position.y = 0.13;
				ant.add(stalk);
				const tip = new THREE.Mesh(new THREE.SphereGeometry(0.052, 10, 8), goldMat);
				tip.position.y = 0.27;
				ant.add(tip);
				anchor.add(ant);
				animParts.push({ type: "earWiggle", node: ant, side: s, baseRotZ });
			}
		});
		addBody(spine, "spkmod_skin_bee_wings", [0, 0.08, -0.70], wingAnchor => {
			const wMat = toon(0xe0f2fe, { emissive: 0xbae6fd, emissiveIntensity: 0.4, transparent: true, opacity: 0.78, side: THREE.DoubleSide });
			for (const side of [-1, 1]) {
				const wing = new THREE.Group();
				wing.position.set(side * 0.16, 0.06, 0);
				const upper = new THREE.Mesh(new THREE.CircleGeometry(0.36, 16), wMat);
				upper.scale.set(1.35, 0.74, 1);
				upper.position.set(side * 0.36, 0.15, -0.04);
				upper.rotation.z = side * 0.30;
				upper.rotation.y = side * 0.22;
				wing.add(upper);
				const lower = new THREE.Mesh(new THREE.CircleGeometry(0.24, 14), wMat);
				lower.scale.set(1.20, 0.76, 1);
				lower.position.set(side * 0.28, -0.10, -0.04);
				lower.rotation.z = -side * 0.22;
				lower.rotation.y = side * 0.22;
				wing.add(lower);
				wingAnchor.add(wing);
				animParts.push({ type: "flutter", node: wing, side });
			}
		});
		if (rightHand) {
			const dipper = new THREE.Group();
			const woodMat = toon(0xd97706);
			const honeyMat = toon(0xfacc15, { emissive: 0xeab308, emissiveIntensity: 0.55 });
			const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.022, 0.74, 8), woodMat);
			stick.position.y = 0.26;
			dipper.add(stick);
			for (let i = 0; i < 4; i++) {
				const groove = new THREE.Mesh(new THREE.TorusGeometry(0.068 - Math.abs(i - 1.5) * 0.012, 0.018, 8, 16), woodMat);
				groove.rotation.x = Math.PI / 2;
				groove.position.y = 0.62 + i * 0.042;
				dipper.add(groove);
			}
			const drip = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 8), honeyMat);
			drip.scale.set(0.85, 1.3, 0.85);
			drip.position.set(0.04, 0.58, 0.04);
			dipper.add(drip);
			attachHandProp(rightHand, "spkmod_skin_bee_dipper", dipper, Q.HERO_R, [0.03, -0.07, 0.04], { hideInSpeakov: true });
		}
		return true;
	} else if (builder === "teddy") {
		addHead(anchor => {
			const furMat = toon(0xb45309);
			const innerMat = toon(0xfde68a);
			const bowMat = toon(0xef4444);
			for (const s of [-1, 1]) {
				const ear = new THREE.Mesh(new THREE.SphereGeometry(0.135, 14, 12), furMat);
				ear.scale.set(1.0, 0.94, 0.55);
				ear.position.set(s * 0.24, 0.03, 0.02);
				anchor.add(ear);
				const inn = new THREE.Mesh(new THREE.SphereGeometry(0.078, 12, 10), innerMat);
				inn.scale.set(1.0, 0.92, 0.35);
				inn.position.set(s * 0.24, 0.025, 0.065);
				anchor.add(inn);
			}
			for (const s of [-1, 1]) {
				const wing = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.11, 4), bowMat);
				wing.position.set(0.20 + s * 0.045, 0.14, 0.08);
				wing.rotation.z = s * (Math.PI / 2);
				anchor.add(wing);
			}
		});
		if (rightHand) {
			const pop = new THREE.Group();
			const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.66, 8), toon(0xf8fafc));
			stick.position.y = 0.22;
			pop.add(stick);
			const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.055, 20), toon(0xf472b6, { emissive: 0xdb2777, emissiveIntensity: 0.25 }));
			disc.rotation.x = Math.PI / 2;
			disc.position.y = 0.68;
			pop.add(disc);
			const swirl1 = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.022, 8, 18), toon(0xfef08a));
			swirl1.position.set(0, 0.68, 0.02);
			pop.add(swirl1);
			const swirl2 = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.018, 8, 14), toon(0x38bdf8));
			swirl2.position.set(0, 0.68, 0.026);
			pop.add(swirl2);
			attachHandProp(rightHand, "spkmod_skin_teddy_lollipop", pop, Q.HERO_R, [0.03, -0.08, 0.04], { hideInSpeakov: true });
		}
		return true;
	} else if (builder === "shiba") {
		addHead(anchor => {
			const furMat = toon(0xf59e0b);
			const creamMat = toon(0xfef3c7);
			for (const s of [-1, 1]) {
				const ear = new THREE.Group();
				ear.position.set(s * 0.22, -0.04, 0.03);
				const baseRotZ = -s * 0.30;
				ear.rotation.z = baseRotZ;
				ear.rotation.x = 0.12;
				const outer = new THREE.Mesh(new THREE.ConeGeometry(0.135, 0.28, 4), furMat);
				outer.rotation.y = Math.PI / 4;
				outer.scale.set(1.0, 1.0, 0.56);
				outer.position.y = 0.12;
				ear.add(outer);
				const inner = new THREE.Mesh(new THREE.ConeGeometry(0.082, 0.19, 4), creamMat);
				inner.rotation.y = Math.PI / 4;
				inner.scale.set(1.0, 1.0, 0.42);
				inner.position.set(0, 0.10, 0.032);
				ear.add(inner);
				anchor.add(ear);
				animParts.push({ type: "earWiggle", node: ear, side: s, baseRotZ });
			}
		});
		addBody(pelvis, "spkmod_skin_shiba_tail", [0, -0.14, -0.22], tailAnchor => {
			const furMat = toon(0xf59e0b);
			const tipMat = toon(0xfffbeb);
			const tail = new THREE.Group();
			// Plush curled Shiba Inu tail rooted right at lower back, sweeping out behind veil & curling up into a cream tip
			const puffs = [
				{ y: -0.02, z: -0.08, r: 0.072, cream: false },
				{ y: -0.01, z: -0.22, r: 0.082, cream: false },
				{ y:  0.02, z: -0.36, r: 0.095, cream: false },
				{ y:  0.08, z: -0.50, r: 0.106, cream: false },
				{ y:  0.19, z: -0.61, r: 0.115, cream: false },
				{ y:  0.32, z: -0.66, r: 0.116, cream: false },
				{ y:  0.44, z: -0.62, r: 0.106, cream: false },
				{ y:  0.48, z: -0.53, r: 0.094, cream: true  },
				{ y:  0.41, z: -0.47, r: 0.074, cream: true  }
			];
			for (const pf of puffs) {
				const ball = new THREE.Mesh(new THREE.SphereGeometry(pf.r, 12, 10), pf.cream ? tipMat : furMat);
				ball.scale.set(0.95, 1.05, 1.18);
				ball.position.set(0, pf.y, pf.z);
				tail.add(ball);
			}
			tailAnchor.add(tail);
			animParts.push({ type: "tail", node: tail, speed: 5.2, amp: 0.28 });
		});
		if (rightHand) {
			const bone = new THREE.Group();
			const bMat = toon(0xfffbeb);
			const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.44, 10), bMat);
			shaft.position.y = 0.16;
			bone.add(shaft);
			for (const by of [-0.06, 0.38]) {
				for (const bx of [-0.042, 0.042]) {
					const knob = new THREE.Mesh(new THREE.SphereGeometry(0.052, 10, 8), bMat);
					knob.position.set(bx, by, 0);
					bone.add(knob);
				}
			}
			attachHandProp(rightHand, "spkmod_skin_shiba_bone", bone, Q.HERO_R, [0.03, -0.07, 0.04], { hideInSpeakov: true });
		}
		return true;
	} else if (builder === "shark") {
		addHead(anchor => {
			const finMat = toon(0x0284c7);
			const whiteMat = toon(0xf8fafc);
			const fin = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.36, 4), finMat);
			fin.scale.set(0.32, 1.0, 1.15);
			fin.position.set(0, 0.16, -0.04);
			fin.rotation.x = -0.36;
			anchor.add(fin);
			// Cute jagged shark teeth trim along upper forehead
			for (let i = -3; i <= 3; i++) {
				const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.036, 0.07, 3), whiteMat);
				tooth.position.set(i * 0.068, -0.34, 0.45 - Math.abs(i) * 0.018);
				tooth.rotation.x = Math.PI;
				anchor.add(tooth);
			}
		});
		addBody(pelvis, "spkmod_skin_shark_tail", [0, -0.13, -0.20], tailAnchor => {
			const sharkMat = toon(0x0284c7);
			const tail = new THREE.Group();
			// Continuous tapered shark tail rooted directly inside lower back so it never floats even in Wide Body mode
			const body = new THREE.Mesh(new THREE.ConeGeometry(0.145, 0.78, 10), sharkMat);
			body.rotation.x = -Math.PI / 2;
			body.position.set(0, 0.03, -0.36);
			tail.add(body);
			const topFluke = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.34, 4), sharkMat);
			topFluke.scale.set(0.28, 1.0, 1.0);
			topFluke.position.set(0, 0.14, -0.78);
			topFluke.rotation.x = -0.75;
			tail.add(topFluke);
			const botFluke = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.24, 4), sharkMat);
			botFluke.scale.set(0.28, 1.0, 1.0);
			botFluke.position.set(0, -0.06, -0.76);
			botFluke.rotation.x = -2.35;
			tail.add(botFluke);
			tailAnchor.add(tail);
			animParts.push({ type: "tail", node: tail, speed: 3.8, amp: 0.26 });
		});
		if (rightHand) {
			// Anchor held as a forward halberd/weapon (ring pommel at hand, heavy curved flukes out front!)
			const anchorProp = new THREE.Group();
			const ironMat = toon(0x334155);
			const goldMat = toon(0xfacc15);
			const ring = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.016, 8, 14), goldMat);
			ring.position.y = -0.18;
			anchorProp.add(ring);
			const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.032, 0.82, 10), ironMat);
			shaft.position.y = 0.26;
			anchorProp.add(shaft);
			const cross = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.05, 0.05), goldMat);
			cross.position.y = 0.12;
			anchorProp.add(cross);
			const fluke = new THREE.Mesh(new THREE.TorusGeometry(0.20, 0.034, 8, 14, Math.PI), ironMat);
			fluke.position.y = 0.56;
			anchorProp.add(fluke);
			for (const s of [-1, 1]) {
				const tip = new THREE.Mesh(new THREE.ConeGeometry(0.052, 0.11, 4), ironMat);
				tip.position.set(s * 0.21, 0.56, 0);
				tip.rotation.z = s * Math.PI;
				anchorProp.add(tip);
			}
			attachHandProp(rightHand, "spkmod_skin_shark_anchor", anchorProp, Q.HERO_R, [0.03, -0.12, 0.06], { hideInSpeakov: true });
		}
		return true;
	} else if (builder === "reindeer") {
		addHead(anchor => {
			const antlerMat = toon(0x78350f);
			const noseMat = toon(0xef4444, { emissive: 0xdc2626, emissiveIntensity: 0.95 });
			for (const s of [-1, 1]) {
				const ant = new THREE.Group();
				ant.position.set(s * 0.18, -0.03, 0.02);
				ant.rotation.z = -s * 0.38;
				const main = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.032, 0.44, 8), antlerMat);
				main.position.y = 0.22;
				ant.add(main);
				for (const [py, rot] of [[0.18, 0.65], [0.32, -0.60], [0.38, 0.55]]) {
					const prong = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.02, 0.18, 6), antlerMat);
					prong.position.set(s * (rot > 0 ? 0.06 : -0.05), py, 0.02);
					prong.rotation.z = -s * rot;
					ant.add(prong);
				}
				anchor.add(ant);
			}
			// Glowing Rudolph red nose calibrated just below eye line
			const nose = new THREE.Mesh(new THREE.SphereGeometry(0.058, 12, 10), noseMat);
			nose.position.set(0, -0.76, 0.49);
			anchor.add(nose);
		});
		if (rightHand) {
			const staff = new THREE.Group();
			const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.024, 0.96, 8), toon(0xdc2626));
			pole.position.y = 0.36;
			staff.add(pole);
			const bell = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 12), toon(0xfacc15, { emissive: 0xca8a04, emissiveIntensity: 0.45 }));
			bell.position.y = 0.88;
			staff.add(bell);
			const bow = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.022, 8, 14), toon(0x16a34a));
			bow.rotation.x = Math.PI / 2;
			bow.position.y = 0.78;
			staff.add(bow);
			attachHandProp(rightHand, "spkmod_skin_reindeer_bellstaff", staff, Q.HERO_R, [0.03, -0.07, 0.04], { hideInSpeakov: true });
		}
		return true;
	} else if (builder === "graduate") {
		addHead(anchor => {
			const capMat = toon(0x1e1b4b);
			const goldMat = toon(0xfacc15, { emissive: 0xb45309, emissiveIntensity: 0.35 });
			const cap = new THREE.Group();
			cap.position.set(0, -0.05, 0);
			const base = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.27, 0.14, 18), capMat);
			base.position.y = 0.07;
			cap.add(base);
			const board = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.032, 0.56), capMat);
			board.position.y = 0.15;
			board.rotation.y = Math.PI / 4;
			cap.add(board);
			const button = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), goldMat);
			button.position.y = 0.175;
			cap.add(button);
			const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.28, 6), goldMat);
			cord.position.set(0.24, 0.12, 0.14);
			cord.rotation.z = 0.45;
			cap.add(cord);
			const tassel = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.12, 8), goldMat);
			tassel.position.set(0.32, -0.02, 0.18);
			cap.add(tassel);
			anchor.add(cap);
		});
		if (rightHand) {
			const scroll = new THREE.Group();
			const paper = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.44, 14), toon(0xfefce8));
			paper.position.y = 0.16;
			scroll.add(paper);
			const ribbon = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.06, 14), toon(0xdc2626));
			ribbon.position.y = 0.16;
			scroll.add(ribbon);
			attachHandProp(rightHand, "spkmod_skin_graduate_diploma", scroll, Q.HERO_R, [0.03, -0.07, 0.04], { hideInSpeakov: true });
		}
		return true;
	} else if (builder === "painter") {
		addHead(anchor => {
			const beretMat = toon(0xe11d48);
			const beret = new THREE.Group();
			beret.position.set(0.04, -0.05, 0);
			const cap = new THREE.Mesh(new THREE.SphereGeometry(0.31, 18, 12), beretMat);
			cap.scale.set(1.15, 0.42, 1.08);
			cap.position.y = 0.10;
			cap.rotation.z = -0.22;
			beret.add(cap);
			const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.09, 8), beretMat);
			stem.position.set(0.03, 0.24, 0);
			beret.add(stem);
			anchor.add(beret);
		});
		if (rightHand) {
			const brush = new THREE.Group();
			const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.032, 0.72, 10), toon(0xd97706));
			handle.position.y = 0.24;
			brush.add(handle);
			const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.032, 0.10, 10), toon(0xe2e8f0));
			ferrule.position.y = 0.64;
			brush.add(ferrule);
			const bristle = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.18, 10), toon(0x38bdf8, { emissive: 0x0284c7, emissiveIntensity: 0.45 }));
			bristle.position.y = 0.78;
			brush.add(bristle);
			attachHandProp(rightHand, "spkmod_skin_painter_brush", brush, Q.HERO_R, [0.03, -0.07, 0.04], { hideInSpeakov: true });
		}
		if (leftHand) {
			const pal = new THREE.Group();
			const board = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.20, 0.024, 18), toon(0xd97706));
			board.scale.set(1.15, 1.0, 0.88);
			board.position.y = 0.08;
			pal.add(board);
			const cols = [0xef4444, 0xfacc15, 0x22c55e, 0x3b82f6, 0xe879f9];
			for (let i = 0; i < cols.length; i++) {
				const a = -0.8 + i * 0.55;
				const dab = new THREE.Mesh(new THREE.SphereGeometry(0.036, 10, 8), toon(cols[i]));
				dab.scale.set(1.0, 0.45, 1.0);
				dab.position.set(Math.cos(a) * 0.13, 0.10, Math.sin(a) * 0.11);
				pal.add(dab);
			}
			attachHandProp(leftHand, "spkmod_skin_painter_palette", pal, Q.UP_TILT_L, [0.03, -0.10, -0.06]);
		}
		return true;
	} else if (builder === "nurse") {
		addHead(anchor => {
			const whiteMat = toon(0xffffff);
			const redMat = toon(0xef4444);
			const cap = new THREE.Group();
			cap.position.set(0, -0.04, 0.04);
			const plate = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.19, 0.06), whiteMat);
			plate.position.y = 0.10;
			cap.add(plate);
			const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.12, 0.075), redMat);
			crossV.position.y = 0.10;
			const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.045, 0.075), redMat);
			crossH.position.y = 0.10;
			cap.add(crossV, crossH);
			anchor.add(cap);
		});
		if (rightHand) {
			const syr = new THREE.Group();
			const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.44, 14), toon(0xe0f2fe, { transparent: true, opacity: 0.72 }));
			barrel.position.y = 0.24;
			syr.add(barrel);
			const fluid = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.26, 12), toon(0xf472b6, { emissive: 0xec4899, emissiveIntensity: 0.65 }));
			fluid.position.y = 0.30;
			syr.add(fluid);
			const plunger = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.22, 8), toon(0xf8fafc));
			plunger.position.y = -0.04;
			syr.add(plunger);
			const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.025, 12), toon(0xef4444));
			thumb.position.y = -0.15;
			syr.add(thumb);
			const needle = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.28, 8), toon(0xe2e8f0));
			needle.position.y = 0.60;
			syr.add(needle);
			attachHandProp(rightHand, "spkmod_skin_nurse_syringe", syr, Q.HERO_R, [0.03, -0.08, 0.04], { hideInSpeakov: true });
		}
		if (leftHand) {
			const kit = new THREE.Group();
			const box = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.20, 0.12), toon(0xffffff));
			box.position.y = -0.12;
			kit.add(box);
			const handle = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.014, 6, 12, Math.PI), toon(0xef4444));
			handle.position.y = -0.02;
			kit.add(handle);
			const cv = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.11, 0.132), toon(0xef4444));
			cv.position.y = -0.12;
			const ch = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.04, 0.132), toon(0xef4444));
			ch.position.y = -0.12;
			kit.add(cv, ch);
			attachHandProp(leftHand, "spkmod_skin_nurse_medkit", kit, Q.UP_TILT_L, [0.04, -0.09, -0.06]);
		}
		return true;
	} else if (builder === "police") {
		addHead(anchor => {
			const navyMat = toon(0x1e3a8a);
			const darkMat = toon(0x0f172a);
			const goldMat = toon(0xfacc15, { emissive: 0xb45309, emissiveIntensity: 0.4 });
			const cap = new THREE.Group();
			cap.position.set(0, -0.06, 0);
			const band = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.28, 0.10, 20), darkMat);
			band.position.y = 0.05;
			cap.add(band);
			const top = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.26, 0.14, 20), navyMat);
			top.position.y = 0.16;
			cap.add(top);
			const visor = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.30, 0.024, 18, 1, false, -Math.PI * 0.38, Math.PI * 0.76), darkMat);
			visor.position.set(0, 0.01, 0.14);
			cap.add(visor);
			const badge = new THREE.Mesh(new THREE.OctahedronGeometry(0.055, 0), goldMat);
			badge.position.set(0, 0.16, 0.30);
			cap.add(badge);
			anchor.add(cap);
		});
		if (rightHand) {
			const baton = new THREE.Group();
			const darkMat = toon(0x18181b);
			const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.028, 0.66, 10), darkMat);
			stick.position.y = 0.24;
			baton.add(stick);
			const sideGrip = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.14, 8), darkMat);
			sideGrip.rotation.x = Math.PI / 2;
			sideGrip.position.set(0, 0.12, 0.07);
			baton.add(sideGrip);
			attachHandProp(rightHand, "spkmod_skin_police_baton", baton, Q.HERO_R, [0.03, -0.07, 0.04], { hideInSpeakov: true });
		}
		if (leftHand) {
			const sign = new THREE.Group();
			const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.44, 8), toon(0xe2e8f0));
			pole.position.y = 0.15;
			sign.add(pole);
			const octFace = new THREE.Group();
			octFace.position.y = 0.46;
			octFace.rotation.z = Math.PI / 8;
			const oct = new THREE.Mesh(new THREE.CylinderGeometry(0.162, 0.162, 0.024, 8), toon(0xdc2626));
			oct.rotation.x = Math.PI / 2;
			octFace.add(oct);
			const rim = new THREE.Mesh(new THREE.TorusGeometry(0.168, 0.022, 8, 8), toon(0xffffff));
			octFace.add(rim);
			sign.add(octFace);
			const bar = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.044, 0.032), toon(0xffffff));
			bar.position.y = 0.46;
			sign.add(bar);
			attachHandProp(leftHand, "spkmod_skin_police_sign", sign, Q.UP_TILT_L, [0.04, -0.16, 0.05]);
		}
		return true;
	} else if (builder === "barista") {
		addHead(anchor => {
			const cupMat = toon(0xf8fafc);
			const sleeveMat = toon(0xb45309);
			const coffeeMat = toon(0x451a03);
			const miniCup = new THREE.Group();
			miniCup.position.set(0, -0.05, 0);
			const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.025, 18), cupMat);
			saucer.position.y = 0.02;
			miniCup.add(saucer);
			const body = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.24, 18), cupMat);
			body.position.y = 0.14;
			miniCup.add(body);
			const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.172, 0.155, 0.09, 18), sleeveMat);
			sleeve.position.y = 0.14;
			miniCup.add(sleeve);
			const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.04, 18), coffeeMat);
			lid.position.y = 0.27;
			miniCup.add(lid);
			anchor.add(miniCup);
		});
		if (rightHand) {
			const latte = new THREE.Group();
			const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.075, 0.26, 16), toon(0xf8fafc));
			cup.position.y = 0.08;
			latte.add(cup);
			const wrap = new THREE.Mesh(new THREE.CylinderGeometry(0.098, 0.086, 0.09, 16), toon(0xb45309));
			wrap.position.y = 0.08;
			latte.add(wrap);
			const foam = new THREE.Mesh(new THREE.SphereGeometry(0.098, 12, 10), toon(0xfef3c7));
			foam.scale.set(1.0, 0.55, 1.0);
			foam.position.y = 0.22;
			latte.add(foam);
			const straw = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.18, 8), toon(0x16a34a));
			straw.position.set(0.03, 0.30, 0);
			straw.rotation.z = -0.22;
			latte.add(straw);
			attachHandProp(rightHand, "spkmod_skin_barista_latte", latte, Q.UP_TILT_R, [0.03, -0.12, 0.08], { hideInSpeakov: true });
		}
		if (leftHand) {
			const crois = new THREE.Group();
			const pastryMat = toon(0xd97706);
			const arc = new THREE.Mesh(new THREE.TorusGeometry(0.10, 0.048, 8, 14, Math.PI * 1.15), pastryMat);
			arc.position.y = 0.08;
			crois.add(arc);
			attachHandProp(leftHand, "spkmod_skin_barista_croissant", crois, Q.UP_TILT_L, [0.04, -0.15, 0.04]);
		}
		return true;
	} else if (builder === "firefighter") {
		addHead(anchor => {
			const redMat = toon(0xdc2626);
			const goldMat = toon(0xfacc15, { emissive: 0xb45309, emissiveIntensity: 0.4 });
			const helm = new THREE.Group();
			helm.position.set(0, -0.08, 0);
			const dome = new THREE.Mesh(new THREE.SphereGeometry(0.32, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.6), redMat);
			dome.position.y = 0.02;
			helm.add(dome);
			const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.40, 0.44, 0.035, 22), redMat);
			brim.scale.set(0.95, 1.0, 1.22);
			brim.position.set(0, 0.03, -0.05);
			helm.add(brim);
			const crest = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.10, 0.38), goldMat);
			crest.position.set(0, 0.32, -0.02);
			helm.add(crest);
			const shield = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.17, 0.04), goldMat);
			shield.position.set(0, 0.17, 0.30);
			helm.add(shield);
			anchor.add(helm);
		});
		if (rightHand) {
			const axe = new THREE.Group();
			const haft = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.028, 0.92, 10), toon(0xd97706));
			haft.position.y = 0.34;
			axe.add(haft);
			// Cutting blade faces outward/forward (-Z under Q_HERO_R); pick faces back (+Z)
			const blade = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.22, 0.24), toon(0xdc2626));
			blade.position.set(0, 0.72, -0.09);
			axe.add(blade);
			const edge = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.24, 0.05), toon(0xf1f5f9));
			edge.position.set(0, 0.72, -0.21);
			axe.add(edge);
			const pick = new THREE.Mesh(new THREE.ConeGeometry(0.038, 0.18, 4), toon(0x334155));
			pick.rotation.x = Math.PI / 2;
			pick.position.set(0, 0.74, 0.10);
			axe.add(pick);
			attachHandProp(rightHand, "spkmod_skin_firefighter_axe", axe, Q.HERO_R, [0.03, -0.10, 0.05], { hideInSpeakov: true });
		}
		if (leftHand) {
			const ext = new THREE.Group();
			const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.34, 14), toon(0xdc2626));
			tank.position.y = -0.14;
			ext.add(tank);
			const valve = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.07, 10), toon(0xfacc15));
			valve.position.y = 0.06;
			ext.add(valve);
			const horn = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.14, 10), toon(0x18181b));
			horn.rotation.x = Math.PI / 2;
			horn.position.set(0, 0.06, 0.10);
			ext.add(horn);
			attachHandProp(leftHand, "spkmod_skin_firefighter_ext", ext, Q.UP_TILT_L, [0.04, -0.15, 0.04]);
		}
		return true;
	} else if (builder === "archer") {
		addHead(anchor => {
			const greenMat = toon(0x15803d);
			const redMat = toon(0xef4444);
			const hat = new THREE.Group();
			hat.position.set(0, -0.06, 0);
			const cap = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.38, 12), greenMat);
			cap.scale.set(0.85, 1.0, 1.35);
			cap.position.set(0, 0.16, -0.02);
			cap.rotation.x = -0.35;
			hat.add(cap);
			const fold = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.042, 8, 18), toon(0x166534));
			fold.rotation.x = Math.PI / 2;
			fold.position.y = 0.04;
			hat.add(fold);
			const feather = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.34, 6), redMat);
			feather.position.set(0.20, 0.24, -0.06);
			feather.rotation.z = -0.45;
			feather.rotation.x = -0.25;
			hat.add(feather);
			anchor.add(hat);
		});
		if (leftHand) {
			// Recurve bow held cleanly in front of left hand (belly grip at z=0, limbs & string curving slightly back to z=-0.246)
			const bow = new THREE.Group();
			const woodMat = toon(0x92400e);
			const stringMat = toon(0xf8fafc);
			const arc = new THREE.Mesh(new THREE.TorusGeometry(0.50, 0.026, 8, 22, Math.PI * 0.66), woodMat);
			arc.rotation.y = -Math.PI / 2;
			arc.rotation.z = -Math.PI * 0.33;
			arc.position.z = -0.50;
			bow.add(arc);
			const str = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.86, 6), stringMat);
			str.position.z = -0.246;
			bow.add(str);
			attachHandProp(leftHand, "spkmod_skin_archer_bow", bow, Q.BOW_L, [0.03, -0.15, -0.14]);
		}
		if (rightHand) {
			const arrow = new THREE.Group();
			const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.82, 8), toon(0xd97706));
			shaft.position.y = 0.32;
			arrow.add(shaft);
			const tip = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.14, 4), toon(0x4ade80, { emissive: 0x22c55e, emissiveIntensity: 0.9 }));
			tip.position.y = 0.78;
			arrow.add(tip);
			const fletch = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.12, 0.012), toon(0xef4444));
			fletch.position.y = -0.04;
			arrow.add(fletch);
			attachHandProp(rightHand, "spkmod_skin_archer_arrow", arrow, Q.HERO_R, [0.03, -0.07, 0.04], { hideInSpeakov: true });
		}
		return true;
	} else if (builder === "beach") {
		addHead(anchor => {
			const strawMat = toon(0xfde047);
			const ribbonMat = toon(0x38bdf8);
			const flowerMat = toon(0xf43f5e);
			const hat = new THREE.Group();
			hat.position.set(0, -0.06, 0);
			const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.56, 0.025, 26), strawMat);
			brim.position.y = 0.02;
			hat.add(brim);
			const band = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.28, 0.06, 20), ribbonMat);
			band.position.y = 0.06;
			hat.add(band);
			const dome = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), strawMat);
			dome.position.y = 0.07;
			hat.add(dome);
			// Hibiscus flower on side of hat
			for (let i = 0; i < 5; i++) {
				const a = (Math.PI * 2 * i) / 5;
				const pet = new THREE.Mesh(new THREE.SphereGeometry(0.052, 8, 8), flowerMat);
				pet.position.set(0.28 + Math.cos(a) * 0.045, 0.09 + Math.sin(a) * 0.045, 0.14);
				hat.add(pet);
			}
			anchor.add(hat);
		});
		if (rightHand) {
			const pop = new THREE.Group();
			const stick = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.24, 0.014), toon(0xd97706));
			stick.position.y = 0.04;
			pop.add(stick);
			const topIce = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.24, 0.06), toon(0x38bdf8, { emissive: 0x0ea5e9, emissiveIntensity: 0.4 }));
			topIce.position.y = 0.26;
			pop.add(topIce);
			const tipIce = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.062), toon(0xf472b6, { emissive: 0xec4899, emissiveIntensity: 0.45 }));
			tipIce.position.y = 0.36;
			pop.add(tipIce);
			attachHandProp(rightHand, "spkmod_skin_beach_popsicle", pop, Q.UP_TILT_R, [0.04, -0.15, 0.09], { hideInSpeakov: true });
		}
		if (leftHand) {
			const ball = new THREE.Group();
			const ballSpin = new THREE.Group();
			ballSpin.position.y = 0.08;
			const b = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 14), toon(0xffffff));
			ballSpin.add(b);
			const cols = [0xef4444, 0xfacc15, 0x38bdf8];
			for (let i = 0; i < 3; i++) {
				const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.168, 0.022, 6, 18), toon(cols[i]));
				stripe.rotation.y = (Math.PI * i) / 3;
				ballSpin.add(stripe);
			}
			ball.add(ballSpin);
			animParts.push({ type: "spinY", node: ballSpin });
			attachHandProp(leftHand, "spkmod_skin_beach_ball", ball, Q.UP_TILT_L, [0.04, -0.14, 0.04]);
		}
		return true;
	} else if (builder === "miko") {
		addHead(anchor => {
			const pinkMat = toon(0xf472b6, { emissive: 0xdb2777, emissiveIntensity: 0.25 });
			const palePinkMat = toon(0xfbcfe8, { emissive: 0xf472b6, emissiveIntensity: 0.25 });
			const whiteMat = toon(0xffffff);
			const goldMat = toon(0xfacc15);
			const leafMat = toon(0x4ade80);
			const flower = new THREE.Group();
			// Sit flush and tangent on the front-left slope of the veil just above the headband
			flower.position.set(0.27, -0.20, 0.36);
			flower.rotation.order = "YXZ";
			flower.rotation.y = 0.58;
			flower.rotation.x = -0.46;
			for (let i = 0; i < 5; i++) {
				const a = (Math.PI * 2 * i) / 5;
				const pet = new THREE.Mesh(new THREE.SphereGeometry(0.062, 10, 8), pinkMat);
				pet.scale.set(1.0, 1.0, 0.42);
				pet.position.set(Math.cos(a) * 0.064, Math.sin(a) * 0.064, 0.01);
				flower.add(pet);
			}
			const center = new THREE.Mesh(new THREE.SphereGeometry(0.034, 8, 8), goldMat);
			center.position.z = 0.03;
			flower.add(center);
			// Companion mini blossom + tiny sakura leaves tucked beside it
			const mini = new THREE.Group();
			mini.position.set(0.11, -0.07, -0.01);
			mini.scale.setScalar(0.62);
			for (let i = 0; i < 5; i++) {
				const a = (Math.PI * 2 * i) / 5 + 0.3;
				const pet = new THREE.Mesh(new THREE.SphereGeometry(0.058, 8, 6), palePinkMat);
				pet.scale.set(1.0, 1.0, 0.42);
				pet.position.set(Math.cos(a) * 0.06, Math.sin(a) * 0.06, 0.01);
				mini.add(pet);
			}
			const miniCore = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), goldMat);
			miniCore.position.z = 0.03;
			mini.add(miniCore);
			flower.add(mini);
			for (const [lx, ly, rz] of [[-0.09, -0.06, 0.65], [0.05, 0.09, -0.45]]) {
				const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.095, 4), leafMat);
				leaf.scale.set(1.0, 1.0, 0.35);
				leaf.position.set(lx, ly, -0.01);
				leaf.rotation.z = rz;
				flower.add(leaf);
			}
			anchor.add(flower);
			// Orbiting cherry blossom petals
			for (let i = 0; i < 4; i++) {
				const petal = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.045, 0.014), i % 2 === 0 ? pinkMat : whiteMat);
				anchor.add(petal);
				animParts.push({ type: "orbit", node: petal, radius: 0.56, baseY: 0.06 + (i % 2) * 0.12, phase: (Math.PI * 2 * i) / 4 });
			}
		});
		if (rightHand) {
			const gohei = new THREE.Group();
			const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.022, 0.78, 8), toon(0xd97706));
			stick.position.y = 0.30;
			gohei.add(stick);
			const paperMat = toon(0xffffff, { side: THREE.DoubleSide });
			for (const s of [-1, 1]) {
				for (let j = 0; j < 3; j++) {
					const zig = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 0.016), paperMat);
					zig.position.set(s * (0.08 + j * 0.03), 0.66 - j * 0.11, 0);
					zig.rotation.z = s * (j % 2 === 0 ? -0.35 : 0.35);
					gohei.add(zig);
				}
			}
			attachHandProp(rightHand, "spkmod_skin_miko_gohei", gohei, Q.HERO_R, [0.03, -0.07, 0.04], { hideInSpeakov: true });
		}
		return true;
	}
	return false;
}

// Extra 3D Costume Builders — Set B (15 costumes: Fantasy, Sci-Fi, Mythic & Legendary)
async function spkmodBuildExtraCostumeSetB(builder, ctx) {
	const { THREE, toon, avatarRoot, head, spine, rightHand, leftHand, reviveHat, attachments, animParts, attachHandProp, Q } = ctx;
	const addHead = (buildFn) => {
		if (!head) return;
		const anchor = spkmodSkinCreateHeadAnchor(avatarRoot, head, reviveHat);
		if (!anchor) return;
		buildFn(anchor);
		spkmodSkinSanitizeObject(anchor);
		head.add(anchor);
		attachments.push({ parent: head, node: anchor });
	};
	const addBody = (bone, name, offset, buildFn) => {
		if (!bone) return;
		const anchor = spkmodSkinCreateBodyAnchor(avatarRoot, bone, name, new THREE.Vector3(offset[0], offset[1], offset[2]));
		if (!anchor) return;
		buildFn(anchor);
		spkmodSkinSanitizeObject(anchor);
		bone.add(anchor);
		attachments.push({ parent: bone, node: anchor });
	};

	if (builder === "alchemist") {
		addHead(anchor => {
			const brassMat = toon(0xd97706);
			const greenMat = toon(0x4ade80, { emissive: 0x22c55e, emissiveIntensity: 0.9 });
			const strapMat = toon(0x451a03);
			const gog = new THREE.Group();
			gog.position.set(0, -0.34, 0.46);
			// Asymmetric alchemist magnifying lenses
			const bigCup = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.11, 16), brassMat);
			bigCup.rotation.x = Math.PI / 2;
			bigCup.position.set(0.14, 0, 0.02);
			gog.add(bigCup);
			const bigLens = new THREE.Mesh(new THREE.CircleGeometry(0.09, 14), greenMat);
			bigLens.position.set(0.14, 0, 0.078);
			gog.add(bigLens);
			const smCup = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.06, 14), brassMat);
			smCup.rotation.x = Math.PI / 2;
			smCup.position.set(-0.13, 0, 0);
			gog.add(smCup);
			const smLens = new THREE.Mesh(new THREE.CircleGeometry(0.06, 12), toon(0x38bdf8, { emissive: 0x0284c7, emissiveIntensity: 0.6 }));
			smLens.position.set(-0.13, 0, 0.032);
			gog.add(smLens);
			const strap = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.024, 8, 24), strapMat);
			strap.rotation.x = Math.PI / 2;
			strap.position.set(0, 0, -0.44);
			gog.add(strap);
			anchor.add(gog);
		});
		if (rightHand) {
			const flask = new THREE.Group();
			const glassMat = toon(0xe0f2fe, { transparent: true, opacity: 0.48 });
			const liqMat = toon(0x4ade80, { emissive: 0x22c55e, emissiveIntensity: 0.95 });
			const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.125, 14, 12), glassMat);
			bulb.position.y = 0.08;
			flask.add(bulb);
			const liq = new THREE.Mesh(new THREE.SphereGeometry(0.105, 12, 10), liqMat);
			liq.position.y = 0.06;
			flask.add(liq);
			const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.052, 0.14, 12), glassMat);
			neck.position.y = 0.24;
			flask.add(neck);
			const bubble = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), liqMat);
			bubble.position.y = 0.36;
			flask.add(bubble);
			animParts.push({ type: "floatY", node: bubble, baseY: 0.36 });
			attachHandProp(rightHand, "spkmod_skin_alchemist_flask", flask, Q.UP_TILT_R, [0.03, -0.13, 0.08], { hideInSpeakov: true });
		}
		if (leftHand) {
			const elixir = new THREE.Group();
			const body = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.085, 0.22, 12), toon(0xe879f9, { emissive: 0xc026d3, emissiveIntensity: 0.85 }));
			body.position.y = 0.08;
			elixir.add(body);
			const cork = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.03, 0.06, 10), toon(0xb45309));
			cork.position.y = 0.22;
			elixir.add(cork);
			attachHandProp(leftHand, "spkmod_skin_alchemist_elixir", elixir, Q.UP_TILT_L, [0.04, -0.15, 0.04]);
		}
		return true;
	} else if (builder === "ninja") {
		addHead(anchor => {
			const clothMat = toon(0x18181b);
			const plateMat = toon(0xcbd5e1, { emissive: 0x334155, emissiveIntensity: 0.25 });
			const band = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.032, 8, 24), clothMat);
			band.rotation.x = Math.PI / 2;
			band.position.set(0, -0.34, 0.02);
			anchor.add(band);
			const plate = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.085, 0.035), plateMat);
			plate.position.set(0, -0.34, 0.47);
			anchor.add(plate);
			for (const s of [-1, 1]) {
				const tail = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.34, 0.02), clothMat);
				tail.position.set(s * 0.06, -0.45, -0.46);
				tail.rotation.z = s * 0.22;
				tail.rotation.x = 0.40;
				anchor.add(tail);
				animParts.push({ type: "cape", node: tail, baseRotX: 0.40 });
			}
		});
		if (rightHand) {
			const kunai = new THREE.Group();
			const steelMat = toon(0xcbd5e1, { emissive: 0x475569, emissiveIntensity: 0.25 });
			const ring = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.012, 8, 14), steelMat);
			ring.position.y = -0.10;
			kunai.add(ring);
			const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.18, 8), toon(0xdc2626));
			grip.position.y = 0.02;
			kunai.add(grip);
			const blade = new THREE.Mesh(new THREE.ConeGeometry(0.068, 0.38, 4), steelMat);
			blade.scale.set(0.35, 1.0, 1.0);
			blade.position.y = 0.30;
			kunai.add(blade);
			attachHandProp(rightHand, "spkmod_skin_ninja_kunai", kunai, Q.HERO_R, [0.03, -0.07, 0.04], { hideInSpeakov: true });
		}
		if (leftHand) {
			const shuriken = new THREE.Group();
			const steelMat = toon(0xe2e8f0, { emissive: 0x38bdf8, emissiveIntensity: 0.35 });
			const spinner = new THREE.Group();
			const hub = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.018, 8, 14), toon(0x18181b));
			spinner.add(hub);
			for (let i = 0; i < 4; i++) {
				const a = (Math.PI * 2 * i) / 4;
				const blade = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.22, 4), steelMat);
				blade.scale.set(1.0, 1.0, 0.22);
				blade.position.set(Math.cos(a) * 0.14, Math.sin(a) * 0.14, 0);
				blade.rotation.z = a - Math.PI / 2;
				spinner.add(blade);
			}
			shuriken.add(spinner);
			spinner.scale.setScalar(0.86);
			animParts.push({ type: "floatY", node: spinner, baseY: 0 });
			attachHandProp(leftHand, "spkmod_skin_ninja_shuriken", shuriken, Q.SHURIKEN_L, [0.03, -0.15, -0.14]);
		}
		return true;
	} else if (builder === "viking") {
		addHead(anchor => {
			const ironMat = toon(0x64748b);
			const goldMat = toon(0xd97706);
			const hornMat = toon(0xfef3c7);
			const helm = new THREE.Group();
			helm.position.set(0, -0.08, 0);
			const dome = new THREE.Mesh(new THREE.SphereGeometry(0.33, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.60), ironMat);
			dome.position.y = 0.02;
			helm.add(dome);
			const rim = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.032, 8, 22), goldMat);
			rim.rotation.x = Math.PI / 2;
			rim.position.y = 0.03;
			helm.add(rim);
			for (const s of [-1, 1]) {
				const h1 = new THREE.Mesh(new THREE.ConeGeometry(0.072, 0.26, 10), hornMat);
				h1.position.set(s * 0.34, 0.14, 0);
				h1.rotation.z = -s * 1.15;
				helm.add(h1);
				const h2 = new THREE.Mesh(new THREE.ConeGeometry(0.048, 0.24, 10), hornMat);
				h2.position.set(s * 0.44, 0.30, 0);
				h2.rotation.z = -s * 0.35;
				helm.add(h2);
			}
			anchor.add(helm);
		});
		const makeBattleAxe = () => {
			const axe = new THREE.Group();
			const haft = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.028, 0.84, 10), toon(0x78350f));
			haft.position.y = 0.30;
			axe.add(haft);
			for (const s of [-1, 1]) {
				const headBlade = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.032, 12, 1, false, -Math.PI * 0.4, Math.PI * 0.8), toon(0xcbd5e1));
				headBlade.rotation.z = Math.PI / 2;
				headBlade.rotation.y = s > 0 ? 0 : Math.PI;
				headBlade.position.set(0, 0.66, s * 0.06);
				axe.add(headBlade);
			}
			return axe;
		};
		// Dual battle axes angled cleanly outward-right & outward-left (with vertical double blades) so walking swings never clip body/veil
		if (rightHand) attachHandProp(rightHand, "spkmod_skin_viking_axe_r", makeBattleAxe(), [-0.7567, 0.1356, 0.6266, -0.1284], [0.04, -0.13, 0.06], { hideInSpeakov: true });
		if (leftHand) attachHandProp(leftHand, "spkmod_skin_viking_axe_l", makeBattleAxe(), [-0.6212, 0.2227, 0.7345, -0.1582], [0.04, -0.12, 0.07]);
		return true;
	} else if (builder === "pharaoh") {
		addHead(anchor => {
			const goldMat = toon(0xfacc15, { emissive: 0xb45309, emissiveIntensity: 0.4 });
			const lapisMat = toon(0x1d4ed8);
			const nemes = new THREE.Group();
			nemes.position.set(0, -0.06, 0);
			const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.24, 16), goldMat);
			crown.scale.set(1.22, 1.0, 0.92);
			crown.position.y = 0.10;
			nemes.add(crown);
			for (let i = 0; i < 3; i++) {
				const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.018, 6, 20), lapisMat);
				stripe.rotation.x = Math.PI / 2;
				stripe.scale.set(1.22, 0.92, 1.0);
				stripe.position.y = 0.04 + i * 0.07;
				nemes.add(stripe);
			}
			// Royal Golden Cobra Uraeus crest in front
			const cobra = new THREE.Mesh(new THREE.ConeGeometry(0.058, 0.22, 6), goldMat);
			cobra.position.set(0, 0.20, 0.34);
			cobra.rotation.x = 0.22;
			nemes.add(cobra);
			const ruby = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), toon(0xef4444, { emissive: 0xdc2626, emissiveIntensity: 0.9 }));
			ruby.position.set(0, 0.20, 0.38);
			nemes.add(ruby);
			anchor.add(nemes);
		});
		if (rightHand) {
			const ankh = new THREE.Group();
			const goldMat = toon(0xffd700, { emissive: 0xb45309, emissiveIntensity: 0.45 });
			const gemMat = toon(0x38bdf8, { emissive: 0x0ea5e9, emissiveIntensity: 0.8 });
			const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.026, 0.72, 10), goldMat);
			shaft.position.y = 0.26;
			ankh.add(shaft);
			const bar = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.048, 0.045), goldMat);
			bar.position.y = 0.62;
			ankh.add(bar);
			const loop = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.028, 8, 18), goldMat);
			loop.scale.set(0.85, 1.25, 1.0);
			loop.position.y = 0.78;
			ankh.add(loop);
			const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.052, 0), gemMat);
			gem.position.y = 0.62;
			ankh.add(gem);
			attachHandProp(rightHand, "spkmod_skin_pharaoh_ankh", ankh, Q.HERO_R, [0.03, -0.07, 0.04], { hideInSpeakov: true });
		}
		return true;
	} else if (builder === "poseidon") {
		addHead(anchor => {
			const goldMat = toon(0xfacc15, { emissive: 0xb45309, emissiveIntensity: 0.4 });
			const aquaMat = toon(0x22d3ee, { emissive: 0x06b6d4, emissiveIntensity: 0.85 });
			const band = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.026, 8, 22), goldMat);
			band.rotation.x = Math.PI / 2;
			band.position.y = -0.02;
			anchor.add(band);
			for (let i = -2; i <= 2; i++) {
				const spike = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.22 - Math.abs(i) * 0.035, 6), i === 0 ? aquaMat : goldMat);
				spike.position.set(i * 0.09, 0.09, 0.25 - Math.abs(i) * 0.04);
				anchor.add(spike);
			}
			for (let i = 0; i < 3; i++) {
				const bub = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 10), toon(0xbae6fd, { emissive: 0x38bdf8, emissiveIntensity: 0.6, transparent: true, opacity: 0.68 }));
				anchor.add(bub);
				animParts.push({ type: "orbit", node: bub, radius: 0.56, baseY: 0.14, phase: (Math.PI * 2 * i) / 3 });
			}
		});
		if (rightHand) {
			const tri = new THREE.Group();
			const goldMat = toon(0xffd700, { emissive: 0xb45309, emissiveIntensity: 0.45 });
			const aquaMat = toon(0x22d3ee, { emissive: 0x06b6d4, emissiveIntensity: 0.95 });
			const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.026, 1.12, 10), goldMat);
			shaft.position.y = 0.42;
			tri.add(shaft);
			const cross = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.048, 0.048), goldMat);
			cross.position.y = 0.98;
			tri.add(cross);
			for (const s of [-1, 0, 1]) {
				const prong = new THREE.Mesh(new THREE.ConeGeometry(0.036, s === 0 ? 0.34 : 0.26, 6), s === 0 ? aquaMat : goldMat);
				prong.position.set(s * 0.14, s === 0 ? 1.15 : 1.10, 0);
				tri.add(prong);
			}
			attachHandProp(rightHand, "spkmod_skin_poseidon_trident", tri, Q.HERO_R, [0.03, -0.08, 0.04], { hideInSpeakov: true });
		}
		return true;
	} else if (builder === "dj") {
		addHead(anchor => {
			const darkMat = toon(0x18181b);
			const padMat = toon(0x27272a);
			const cyanMat = toon(0x22d3ee, { emissive: 0x06b6d4, emissiveIntensity: 1.0 });
			const pinkMat = toon(0xf472b6, { emissive: 0xec4899, emissiveIntensity: 1.0 });
			// Wide over-the-veil headband arch so cups sit cleanly outside Speaki's flared veil
			const arch = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.045, 10, 28, Math.PI), darkMat);
			arch.scale.set(1.02, 0.94, 1.0);
			arch.position.set(0, -0.54, 0.08);
			anchor.add(arch);
			const archGlow = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.020, 8, 24, Math.PI * 0.6), cyanMat);
			archGlow.scale.set(1.03, 0.96, 1.0);
			archGlow.rotation.z = Math.PI * 0.2;
			archGlow.position.set(0, -0.53, 0.11);
			anchor.add(archGlow);
			for (const s of [-1, 1]) {
				const ear = new THREE.Group();
				ear.position.set(s * 0.63, -0.56, 0.08);
				ear.rotation.z = s * 0.10;
				const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.05, 18), padMat);
				pad.rotation.z = Math.PI / 2;
				pad.position.x = -s * 0.035;
				ear.add(pad);
				const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.135, 0.10, 18), darkMat);
				cup.rotation.z = s * (Math.PI / 2);
				cup.position.x = s * 0.025;
				ear.add(cup);
				const ring = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.024, 8, 20), s > 0 ? cyanMat : pinkMat);
				ring.rotation.y = Math.PI / 2;
				ring.position.x = s * 0.075;
				ear.add(ring);
				const core = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.02, 14), s > 0 ? cyanMat : pinkMat);
				core.rotation.z = Math.PI / 2;
				core.position.x = s * 0.075;
				ear.add(core);
				anchor.add(ear);
			}
		});
		if (rightHand) {
			const keytar = new THREE.Group();
			const bodyMat = toon(0x1e1b4b);
			const cyanMat = toon(0x22d3ee, { emissive: 0x06b6d4, emissiveIntensity: 0.9 });
			const whiteMat = toon(0xf8fafc);
			const deck = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.62, 0.06), bodyMat);
			deck.position.y = 0.22;
			keytar.add(deck);
			const keys = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.44, 0.072), whiteMat);
			keys.position.set(-0.05, 0.18, 0.01);
			keytar.add(keys);
			const strip = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.58, 0.072), cyanMat);
			strip.position.set(0.08, 0.22, 0.01);
			keytar.add(strip);
			const neck = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.34, 0.045), bodyMat);
			neck.position.set(0.03, 0.68, 0);
			keytar.add(neck);
			attachHandProp(rightHand, "spkmod_skin_dj_keytar", keytar, Q.GUITAR_R, [0.04, -0.14, 0.13], { hideInSpeakov: true });
		}
		if (leftHand) {
			const vinyl = new THREE.Group();
			const vinylSpin = new THREE.Group();
			vinylSpin.position.y = 0.08;
			const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.018, 22), toon(0x09090b));
			disc.rotation.x = Math.PI / 2;
			vinylSpin.add(disc);
			const label = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.024, 14), toon(0xec4899, { emissive: 0xdb2777, emissiveIntensity: 0.85 }));
			label.rotation.x = Math.PI / 2;
			vinylSpin.add(label);
			vinyl.add(vinylSpin);
			animParts.push({ type: "floatY", node: vinylSpin, baseY: 0.08 });
			attachHandProp(leftHand, "spkmod_skin_dj_vinyl", vinyl, Q.UP_TILT_L, [0.04, -0.16, 0.04]);
		}
		return true;
	} else if (builder === "racer") {
		addHead(anchor => {
			const redMat = toon(0xdc2626);
			const whiteMat = toon(0xffffff);
			const visorMat = toon(0x09090b, { emissive: 0x1e293b, emissiveIntensity: 0.45 });
			const helm = new THREE.Group();
			helm.position.set(0, -0.08, 0);
			const dome = new THREE.Mesh(new THREE.SphereGeometry(0.35, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.62), redMat);
			dome.position.y = 0.02;
			helm.add(dome);
			const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.34, 0.52), whiteMat);
			stripe.position.set(0, 0.22, 0);
			helm.add(stripe);
			const visor = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.11, 16, 1, true, -Math.PI * 0.34, Math.PI * 0.68), visorMat);
			visor.position.set(0, 0.12, 0.02);
			helm.add(visor);
			anchor.add(helm);
		});
		if (spine) {
			addBody(spine, "spkmod_skin_racer_booster", [0, -0.02, -0.78], packAnchor => {
				const carbonMat = toon(0x18181b);
				const redMat = toon(0xdc2626);
				const whiteMat = toon(0xf8fafc);
				const steelMat = toon(0x94a3b8);
				const brakeMat = toon(0xef4444, { emissive: 0xdc2626, emissiveIntensity: 0.95 });
				const flameMat = toon(0xf97316, { emissive: 0xea580c, emissiveIntensity: 1.0 });
				const coreFlameMat = toon(0x38bdf8, { emissive: 0x0ea5e9, emissiveIntensity: 1.0 });
				const group = new THREE.Group();
				group.rotation.x = 0.24;
				// Sleek carbon-fiber nitro core + racing stripe + glowing tail light bar
				const core = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.15), carbonMat);
				group.add(core);
				const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.16), whiteMat);
				group.add(stripe);
				const tailLight = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.055, 0.025), brakeMat);
				tailLight.position.set(0, -0.06, -0.082);
				group.add(tailLight);
				// Aerodynamic rear spoiler wing with side endplates
				const wing = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.032, 0.14), redMat);
				wing.position.set(0, 0.28, -0.06);
				wing.rotation.x = -0.16;
				group.add(wing);
				for (const side of [-1, 1]) {
					const strut = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.16, 0.08), carbonMat);
					strut.position.set(side * 0.14, 0.21, -0.03);
					group.add(strut);
					const plate = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.11, 0.16), whiteMat);
					plate.position.set(side * 0.34, 0.28, -0.06);
					group.add(plate);
					// Twin red nitro booster pods + exhaust nozzles + pulsing twin flames
					const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.092, 0.38, 14), redMat);
					pod.position.set(side * 0.20, -0.02, -0.02);
					group.add(pod);
					const cap = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 8), whiteMat);
					cap.position.set(side * 0.20, 0.17, -0.02);
					group.add(cap);
					const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.082, 0.09, 12), steelMat);
					nozzle.position.set(side * 0.20, -0.24, -0.02);
					group.add(nozzle);
					const flame = new THREE.Group();
					flame.position.set(side * 0.20, -0.40, -0.02);
					const outer = new THREE.Mesh(new THREE.ConeGeometry(0.072, 0.28, 10), flameMat);
					outer.rotation.x = Math.PI;
					flame.add(outer);
					const inner = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.16, 8), coreFlameMat);
					inner.rotation.x = Math.PI;
					inner.position.y = 0.04;
					flame.add(inner);
					group.add(flame);
					animParts.push({ type: "flamePulse", node: flame, phase: side > 0 ? 0 : Math.PI });
				}
				packAnchor.add(group);
			});
		}
		if (rightHand) {
			const flag = new THREE.Group();
			const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.02, 0.92, 8), toon(0xe2e8f0));
			pole.position.y = 0.36;
			flag.add(pole);
			const wMat = toon(0xffffff);
			const bMat = toon(0x09090b);
			for (let r = 0; r < 3; r++) {
				for (let c = 0; c < 4; c++) {
					const sq = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.085, 0.085), (r + c) % 2 === 0 ? wMat : bMat);
					// Hang downward (-Z under Q_HERO_R) from the raised racing flag pole!
					sq.position.set(0, 0.60 + r * 0.085, -0.06 - c * 0.085);
					flag.add(sq);
				}
			}
			attachHandProp(rightHand, "spkmod_skin_racer_flag", flag, Q.HERO_R, [0.03, -0.08, 0.04], { hideInSpeakov: true });
		}
		return true;
	} else if (builder === "mecha") {
		addHead(anchor => {
			const whiteMat = toon(0xf1f5f9);
			const cyanMat = toon(0x38bdf8, { emissive: 0x0ea5e9, emissiveIntensity: 1.0 });
			const frameMat = toon(0x334155);
			// Mechanical Gundam-style V-fin + ear antennae
			for (const s of [-1, 1]) {
				const vfin = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.28, 0.025), toon(0xfacc15, { emissive: 0xb45309, emissiveIntensity: 0.4 }));
				vfin.position.set(s * 0.12, 0.08, 0.28);
				vfin.rotation.z = -s * 0.85;
				anchor.add(vfin);
				const earAnt = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.022, 0.32, 8), whiteMat);
				earAnt.position.set(s * 0.47, -0.32, 0.02);
				earAnt.rotation.z = -s * 0.18;
				anchor.add(earAnt);
			}
			// Cyber glowing visor on eye line (y = -0.71, z = +0.48)
			const visor = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.13, 0.035), cyanMat);
			visor.position.set(0, -0.71, 0.48);
			anchor.add(visor);
			const trim = new THREE.Mesh(new THREE.BoxGeometry(0.53, 0.025, 0.045), frameMat);
			trim.position.set(0, -0.64, 0.48);
			anchor.add(trim);
			// Orbiting mini cyber drone
			const drone = new THREE.Group();
			const dCore = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 10), whiteMat);
			const dEye = new THREE.Mesh(new THREE.SphereGeometry(0.038, 10, 8), cyanMat);
			dEye.position.z = 0.06;
			const dRing = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.014, 6, 16), frameMat);
			dRing.rotation.x = Math.PI / 2;
			drone.add(dCore, dEye, dRing);
			anchor.add(drone);
			animParts.push({ type: "orbit", node: drone, radius: 0.62, baseY: 0.16 });
		});
		if (rightHand) {
			const saber = new THREE.Group();
			const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.03, 0.26, 10), toon(0x334155));
			saber.add(hilt);
			const emit = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.034, 0.06, 10), toon(0xe2e8f0));
			emit.position.y = 0.15;
			saber.add(emit);
			const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.042, 0.92, 12), toon(0x38bdf8, { emissive: 0x0ea5e9, emissiveIntensity: 1.0, transparent: true, opacity: 0.88 }));
			beam.position.y = 0.64;
			saber.add(beam);
			const core = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.018, 0.90, 8), toon(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1.0 }));
			core.position.y = 0.64;
			saber.add(core);
			attachHandProp(rightHand, "spkmod_skin_mecha_saber", saber, Q.HERO_R, [0.03, -0.08, 0.04], { hideInSpeakov: true });
		}
		return true;
	} else if (builder === "alien") {
		addHead(anchor => {
			const greenMat = toon(0x22c55e, { emissive: 0x16a34a, emissiveIntensity: 0.45 });
			const glowMat = toon(0x86efac, { emissive: 0x4ade80, emissiveIntensity: 1.0 });
			for (const s of [-1, 1]) {
				const ant = new THREE.Group();
				ant.position.set(s * 0.15, -0.02, 0.04);
				const baseRotZ = -s * 0.34;
				ant.rotation.z = baseRotZ;
				const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.022, 0.30, 8), greenMat);
				stalk.position.y = 0.15;
				ant.add(stalk);
				const orb = new THREE.Mesh(new THREE.SphereGeometry(0.062, 12, 10), glowMat);
				orb.position.y = 0.31;
				ant.add(orb);
				anchor.add(ant);
				animParts.push({ type: "earWiggle", node: ant, side: s, baseRotZ });
			}
			// Orbiting mini UFO saucer!
			const ufo = new THREE.Group();
			const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.045, 16), toon(0x94a3b8));
			const dome = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), glowMat);
			dome.position.y = 0.02;
			const beam = new THREE.Mesh(new THREE.ConeGeometry(0.10, 0.22, 12), toon(0x4ade80, { emissive: 0x22c55e, emissiveIntensity: 0.8, transparent: true, opacity: 0.38 }));
			beam.position.y = -0.12;
			ufo.add(disc, dome, beam);
			anchor.add(ufo);
			animParts.push({ type: "orbit", node: ufo, radius: 0.64, baseY: 0.22 });
		});
		if (rightHand) {
			const ray = new THREE.Group();
			const silverMat = toon(0xcbd5e1);
			const neonMat = toon(0x4ade80, { emissive: 0x22c55e, emissiveIntensity: 0.95 });
			const grip = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.07, 0.14), toon(0x334155));
			grip.position.set(0, 0, -0.02);
			ray.add(grip);
			const body = new THREE.Mesh(new THREE.SphereGeometry(0.095, 14, 12), silverMat);
			body.scale.set(0.75, 1.5, 0.9);
			body.position.set(0, 0.14, 0.06);
			ray.add(body);
			const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.048, 0.32, 12), silverMat);
			barrel.position.set(0, 0.34, 0.06);
			ray.add(barrel);
			for (let i = 0; i < 3; i++) {
				const coil = new THREE.Mesh(new THREE.TorusGeometry(0.056 - i * 0.01, 0.012, 8, 14), neonMat);
				coil.rotation.x = Math.PI / 2;
				coil.position.set(0, 0.26 + i * 0.08, 0.06);
				ray.add(coil);
			}
			const tipOrb = new THREE.Mesh(new THREE.SphereGeometry(0.036, 10, 8), neonMat);
			tipOrb.position.set(0, 0.52, 0.06);
			ray.add(tipOrb);
			const holder = attachHandProp(rightHand, "spkmod_skin_alien_raygun", ray, [0.5, -0.5, -0.5, 0.5], [0.03, -0.06, 0.04], { hideInSpeakov: true });
			if (holder) holder.rotation.x = 0.20;
		}
		return true;
	} else if (builder === "netrunner") {
		addHead(anchor => {
			const magMat = toon(0xe879f9, { emissive: 0xd946ef, emissiveIntensity: 1.0, transparent: true, opacity: 0.72, side: THREE.DoubleSide });
			const cyanMat = toon(0x22d3ee, { emissive: 0x06b6d4, emissiveIntensity: 1.0 });
			// Floating neon holo halo
			const halo = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.016, 8, 28), cyanMat);
			halo.rotation.x = Math.PI / 2;
			halo.position.y = 0.16;
			anchor.add(halo);
			animParts.push({ type: "floatY", node: halo, baseY: 0.16 });
			// Sleek curved holographic cyber visor on eye line (y = -0.71, z = +0.48)
			const visor = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.125, 0.025), magMat);
			visor.position.set(0, -0.71, 0.49);
			anchor.add(visor);
			const topLine = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.022, 0.032), cyanMat);
			topLine.position.set(0, -0.64, 0.49);
			anchor.add(topLine);
		});
		if (rightHand) {
			const blade = new THREE.Group();
			const darkMat = toon(0x18181b);
			const magMat = toon(0xe879f9, { emissive: 0xd946ef, emissiveIntensity: 1.0 });
			const cyanMat = toon(0x22d3ee, { emissive: 0x06b6d4, emissiveIntensity: 1.0 });
			const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.024, 0.22, 8), darkMat);
			blade.add(hilt);
			const guard = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.035, 0.06), cyanMat);
			guard.position.y = 0.12;
			blade.add(guard);
			const spineBlade = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.80, 0.065), darkMat);
			spineBlade.position.y = 0.54;
			blade.add(spineBlade);
			const neonEdge = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.82, 0.028), magMat);
			neonEdge.position.set(0, 0.55, 0.035);
			blade.add(neonEdge);
			attachHandProp(rightHand, "spkmod_skin_netrunner_blade", blade, Q.HERO_R, [0.03, -0.08, 0.04], { hideInSpeakov: true });
		}
		return true;
	} else if (builder === "valkyrie") {
		addHead(anchor => {
			const goldMat = toon(0xfacc15, { emissive: 0xb45309, emissiveIntensity: 0.42 });
			const whiteMat = toon(0xffffff, { emissive: 0xe0f2fe, emissiveIntensity: 0.35 });
			const band = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.026, 8, 22), goldMat);
			band.rotation.x = Math.PI / 2;
			band.position.y = -0.03;
			anchor.add(band);
			for (const s of [-1, 1]) {
				const wing = new THREE.Group();
				wing.position.set(s * 0.29, 0.02, 0);
				for (let i = 0; i < 3; i++) {
					const f = new THREE.Mesh(new THREE.BoxGeometry(0.26 - i * 0.04, 0.07, 0.024), whiteMat);
					f.position.set(s * (0.10 + i * 0.01), 0.14 - i * 0.065, -0.05 - i * 0.03);
					f.rotation.z = s * (0.58 - i * 0.20);
					wing.add(f);
				}
				anchor.add(wing);
			}
			const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.065, 0), toon(0x818cf8, { emissive: 0x6366f1, emissiveIntensity: 0.9 }));
			star.position.set(0, 0.05, 0.29);
			anchor.add(star);
		});
		if (rightHand) {
			const lance = new THREE.Group();
			const goldMat = toon(0xfacc15, { emissive: 0xb45309, emissiveIntensity: 0.4 });
			const starMat = toon(0xc7d2fe, { emissive: 0x818cf8, emissiveIntensity: 0.95 });
			const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.028, 0.92, 10), goldMat);
			shaft.position.y = 0.28;
			lance.add(shaft);
			const guard = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.02, 8, 16), goldMat);
			guard.rotation.x = Math.PI / 2;
			guard.position.y = 0.70;
			lance.add(guard);
			const spiral = new THREE.Mesh(new THREE.ConeGeometry(0.072, 0.62, 6), starMat);
			spiral.position.y = 1.04;
			lance.add(spiral);
			attachHandProp(rightHand, "spkmod_skin_valkyrie_lance", lance, Q.HERO_R, [0.03, -0.08, 0.04], { hideInSpeakov: true });
		}
		if (leftHand) {
			const shield = new THREE.Group();
			const goldMat = toon(0xfacc15, { emissive: 0xb45309, emissiveIntensity: 0.4 });
			const starMat = toon(0x818cf8, { emissive: 0x6366f1, emissiveIntensity: 0.7 });
			const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.04, 18), toon(0x1e1b4b));
			disc.rotation.x = Math.PI / 2;
			shield.add(disc);
			const rim = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.028, 8, 20), goldMat);
			shield.add(rim);
			const emblem = new THREE.Mesh(new THREE.OctahedronGeometry(0.11, 0), starMat);
			emblem.scale.set(1.0, 1.0, 0.45);
			emblem.position.z = 0.025;
			shield.add(emblem);
			attachHandProp(leftHand, "spkmod_skin_valkyrie_shield", shield, Q.SHIELD_L, [0.03, -0.17, -0.11]);
		}
		return true;
	} else if (builder === "jester") {
		addHead(anchor => {
			const purpMat = toon(0x9333ea);
			const redMat = toon(0xe11d48);
			const goldMat = toon(0xfacc15, { emissive: 0xb45309, emissiveIntensity: 0.45 });
			const prongs = [
				{ x: -0.22, z: 0.02, rz: 0.72, rx: 0, mat: purpMat },
				{ x:  0.22, z: 0.02, rz: -0.72, rx: 0, mat: redMat },
				{ x:  0.00, z: -0.14, rz: 0, rx: -0.68, mat: purpMat }
			];
			for (const p of prongs) {
				const horn = new THREE.Group();
				horn.position.set(p.x * 0.65, -0.02, p.z);
				horn.rotation.z = p.rz;
				horn.rotation.x = p.rx;
				const cone = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.42, 10), p.mat);
				cone.position.y = 0.20;
				horn.add(cone);
				const bell = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), goldMat);
				bell.position.y = 0.42;
				horn.add(bell);
				anchor.add(horn);
			}
			// Orbiting colorful juggling balls!
			const cols = [0xef4444, 0xfacc15, 0x38bdf8];
			for (let i = 0; i < 3; i++) {
				const b = new THREE.Mesh(new THREE.SphereGeometry(0.068, 12, 10), toon(cols[i]));
				anchor.add(b);
				animParts.push({ type: "orbit", node: b, radius: 0.54, baseY: 0.26, phase: (Math.PI * 2 * i) / 3 });
			}
		});
		if (rightHand) {
			const mallet = new THREE.Group();
			const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.028, 0.82, 10), toon(0xfacc15));
			handle.position.y = 0.30;
			mallet.add(handle);
			const headCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.42, 16), toon(0xe11d48));
			headCyl.rotation.x = Math.PI / 2;
			headCyl.position.y = 0.72;
			mallet.add(headCyl);
			for (const s of [-1, 1]) {
				const endCap = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.05, 16), toon(0xfacc15));
				endCap.rotation.x = Math.PI / 2;
				endCap.position.set(0, 0.72, s * 0.22);
				mallet.add(endCap);
			}
			attachHandProp(rightHand, "spkmod_skin_jester_mallet", mallet, Q.HERO_R, [0.03, -0.09, 0.04], { hideInSpeakov: true });
		}
		return true;
	} else if (builder === "mystic") {
		addHead(anchor => {
			const goldMat = toon(0xfacc15, { emissive: 0xb45309, emissiveIntensity: 0.4 });
			const cardMat = toon(0x7e22ce, { emissive: 0x581c87, emissiveIntensity: 0.35 });
			const band = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.018, 8, 22), goldMat);
			band.rotation.x = Math.PI / 2;
			band.position.y = -0.02;
			anchor.add(band);
			const moon = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.022, 8, 16, Math.PI * 1.35), goldMat);
			moon.position.set(0, 0.12, 0.26);
			moon.rotation.z = Math.PI * 0.75;
			anchor.add(moon);
			// 3 orbiting glowing Tarot Cards!
			for (let i = 0; i < 3; i++) {
				const card = new THREE.Group();
				const body = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.20, 0.014), cardMat);
				const border = new THREE.Mesh(new THREE.BoxGeometry(0.132, 0.212, 0.008), goldMat);
				card.add(border, body);
				anchor.add(card);
				animParts.push({ type: "orbit", node: card, radius: 0.56, baseY: 0.12, phase: (Math.PI * 2 * i) / 3 });
			}
		});
		if (leftHand) {
			const orbGroup = new THREE.Group();
			const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.095, 0.07, 14), toon(0xfacc15));
			stand.position.y = 0.04;
			orbGroup.add(stand);
			const orb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 18, 14), toon(0xc084fc, { emissive: 0xa855f7, emissiveIntensity: 0.9, transparent: true, opacity: 0.82 }));
			orb.position.y = 0.22;
			orbGroup.add(orb);
			animParts.push({ type: "floatY", node: orb, baseY: 0.22 });
			attachHandProp(leftHand, "spkmod_skin_mystic_orb", orbGroup, Q.UP_TILT_L, [0.04, -0.16, 0.04]);
		}
		return true;
	} else if (builder === "frost") {
		addHead(anchor => {
			const iceMat = toon(0xbae6fd, { emissive: 0x38bdf8, emissiveIntensity: 0.7, transparent: true, opacity: 0.88 });
			const band = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.02, 8, 22), iceMat);
			band.rotation.x = Math.PI / 2;
			band.position.y = -0.02;
			anchor.add(band);
			for (let i = -2; i <= 2; i++) {
				const spire = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.24 - Math.abs(i) * 0.04, 4), iceMat);
				spire.position.set(i * 0.09, 0.10, 0.24 - Math.abs(i) * 0.04);
				anchor.add(spire);
			}
			for (let i = 0; i < 3; i++) {
				const shard = new THREE.Mesh(new THREE.OctahedronGeometry(0.068, 0), iceMat);
				shard.scale.set(0.7, 1.5, 0.7);
				anchor.add(shard);
				animParts.push({ type: "orbit", node: shard, radius: 0.56, baseY: 0.12, phase: (Math.PI * 2 * i) / 3 });
			}
		});
		if (rightHand) {
			const scepter = new THREE.Group();
			const iceMat = toon(0xbae6fd, { emissive: 0x38bdf8, emissiveIntensity: 0.85 });
			const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.024, 0.96, 8), toon(0xe0f2fe));
			shaft.position.y = 0.36;
			scepter.add(shaft);
			const flake = new THREE.Group();
			flake.position.y = 0.94;
			for (let i = 0; i < 3; i++) {
				const bar = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.036, 0.036), iceMat);
				bar.rotation.z = (Math.PI * i) / 3;
				flake.add(bar);
			}
			const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.075, 0), toon(0xffffff, { emissive: 0x38bdf8, emissiveIntensity: 1.0 }));
			flake.add(core);
			scepter.add(flake);
			animParts.push({ type: "spinY", node: flake });
			attachHandProp(rightHand, "spkmod_skin_frost_scepter", scepter, Q.HERO_R, [0.03, -0.08, 0.04], { hideInSpeakov: true });
		}
		return true;
	} else if (builder === "phoenix") {
		addHead(anchor => {
			const goldMat = toon(0xfacc15, { emissive: 0xea580c, emissiveIntensity: 0.55 });
			const fireMat = toon(0xf97316, { emissive: 0xef4444, emissiveIntensity: 0.95 });
			const band = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.025, 8, 22), goldMat);
			band.rotation.x = Math.PI / 2;
			band.position.y = -0.02;
			anchor.add(band);
			for (let i = -2; i <= 2; i++) {
				const plume = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.34 - Math.abs(i) * 0.05, 5), Math.abs(i) % 2 === 0 ? fireMat : goldMat);
				plume.position.set(i * 0.11, 0.14, 0.22 - Math.abs(i) * 0.06);
				plume.rotation.z = -i * 0.22;
				anchor.add(plume);
			}
		});
		addBody(spine, "spkmod_skin_phoenix_wings", [0, 0.10, -0.70], wingAnchor => {
			const fireMat = toon(0xf97316, { emissive: 0xea580c, emissiveIntensity: 0.85 });
			const goldMat = toon(0xfde047, { emissive: 0xfacc15, emissiveIntensity: 0.95 });
			const redMat = toon(0xdc2626, { emissive: 0x991b1b, emissiveIntensity: 0.6 });
			for (const side of [-1, 1]) {
				const wing = new THREE.Group();
				wing.position.set(side * 0.16, 0.06, 0);
				const feathers = [
					{ x: 0.34, y: 0.24, w: 0.68, h: 0.15, rz: 0.46, mat: goldMat },
					{ x: 0.40, y: 0.07, w: 0.74, h: 0.14, rz: 0.16, mat: fireMat },
					{ x: 0.34, y: -0.09, w: 0.60, h: 0.13, rz: -0.16, mat: fireMat },
					{ x: 0.26, y: -0.22, w: 0.44, h: 0.11, rz: -0.38, mat: redMat }
				];
				for (const f of feathers) {
					const m = new THREE.Mesh(new THREE.BoxGeometry(f.w, f.h, 0.034), f.mat);
					m.position.set(side * f.x, f.y, -0.05);
					m.rotation.z = side * f.rz;
					m.rotation.y = side * 0.22;
					wing.add(m);
				}
				wingAnchor.add(wing);
				animParts.push({ type: "wing", node: wing, side });
			}
		});
		if (rightHand) {
			const spear = new THREE.Group();
			const goldMat = toon(0xffd700, { emissive: 0xb45309, emissiveIntensity: 0.45 });
			const sunMat = toon(0xf97316, { emissive: 0xef4444, emissiveIntensity: 1.0 });
			const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.026, 1.05, 10), goldMat);
			shaft.position.y = 0.36;
			spear.add(shaft);
			const sunRing = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.022, 8, 16), sunMat);
			sunRing.position.y = 0.92;
			spear.add(sunRing);
			const blade = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.38, 4), sunMat);
			blade.position.y = 1.14;
			blade.scale.set(1.0, 1.0, 0.38);
			spear.add(blade);
			attachHandProp(rightHand, "spkmod_skin_phoenix_spear", spear, Q.HERO_R, [0.03, -0.08, 0.04], { hideInSpeakov: true });
		}
		return true;
	}
	return false;
}

// ============================================================================
// 6. PER-PLAYER SKIN APPLICATION & CLEAN RESTORE (LOCAL + REMOTE)
// ============================================================================
const _spkmodAppliedSkins = new Map(); // ownerKey -> { skinId, root, ctrl, attachments, animParts, usedReviveHat, fxMode, seq }
const _spkmodRemoteSkinStates = new Map(); // ownerKey -> { playerId, playerName, skinId, widthId }
const _spkmodRemoteSkinPendingByName = new Map(); // lowerName -> { skinId, widthId }
const _spkmodRemoteSkinPendingById = new Map();   // String(id) -> { skinId, widthId }

function spkmodSkinSafeCloneMat(mat) {
	if (!mat) return mat;
	if (typeof spkmodCloneMaterialSafely === "function") {
		return spkmodCloneMaterialSafely(mat) || mat;
	}
	if (Array.isArray(mat)) return mat.map(m => spkmodSkinSafeCloneMat(m));
	if (typeof mat.clone !== "function") return mat;
	if (mat.type === "OutlineEffect" || mat.name === "OutlineEffect") return null;
	try {
		const cloned = mat.clone();
		if (cloned) {
			if (!cloned.userData) cloned.userData = {};
			if (mat.userData?.outlineParameters) {
				cloned.userData.outlineParameters = Object.assign({}, mat.userData.outlineParameters);
			}
			return cloned;
		}
	} catch (_) {}
	return mat;
}

function spkmodSkinRestoreMaterials(root) {
	if (!root || typeof root.traverse !== "function") return;
	root.traverse(child => {
		if (!child || !child.isMesh || child.userData?.spkmodSkinAttachment) return;
		if (child.userData && child.userData.__spkmodSkinOrigMat !== undefined) {
			const orig = child.userData.__spkmodSkinOrigMat;
			const cur = child.material;
			child.material = orig;
			delete child.userData.__spkmodSkinOrigMat;
			delete child.userData.__spkmodSkinFxCloned;
			if (cur && cur !== orig) {
				const arr = Array.isArray(cur) ? cur : [cur];
				const origArr = Array.isArray(orig) ? orig : [orig];
				for (const m of arr) {
					if (m && !origArr.includes(m) && typeof m.dispose === "function") {
						try { m.dispose(); } catch (_) {}
					}
				}
			}
		}
	});
}

function spkmodSkinRemoveAttachments(entry, root) {
	if (entry && Array.isArray(entry.attachments)) {
		for (const item of entry.attachments) {
			if (item && item.node && item.node.parent) {
				item.node.parent.remove(item.node);
			}
			if (item && item.node && typeof item.node.traverse === "function") {
				item.node.traverse(c => {
					if (c && c.isMesh && !c.userData?.spkmodSkinSharedGlb) {
						try { c.geometry?.dispose?.(); } catch (_) {}
						if (c.material) {
							const mats = Array.isArray(c.material) ? c.material : [c.material];
							for (const m of mats) {
								try { m?.dispose?.(); } catch (_) {}
							}
						}
					}
				});
			}
		}
		entry.attachments = [];
	}
	if (root && typeof root.traverse === "function") {
		const stale = [];
		root.traverse(o => {
			if (o && o.userData && o.userData.spkmodSkinAttachment && (!o.parent || !o.parent.userData?.spkmodSkinAttachment)) {
				stale.push(o);
			}
		});
		for (const s of stale) {
			if (s.parent) s.parent.remove(s);
		}
	}
}

function spkmodSkinHideMagicStaff(entry) {
	if (!entry || !entry.root || typeof entry.root.traverse !== "function") return;
	if (!entry.hiddenStaffNodes) entry.hiddenStaffNodes = new Map();
	entry.root.traverse(o => {
		if (o && o.userData && o.userData.speakiMagicStaff === true) {
			if (!entry.hiddenStaffNodes.has(o)) {
				entry.hiddenStaffNodes.set(o, o.visible);
			}
			o.visible = false;
		}
	});
}

function spkmodSkinRestoreMagicStaff(entry) {
	if (!entry || !entry.hiddenStaffNodes) return;
	const hasActiveSpeakovGun = !!(entry.root && typeof entry.root.getObjectByName === "function" && entry.root.getObjectByName("speakov-weapon"));
	if (!hasActiveSpeakovGun) {
		for (const [node, wasVisible] of entry.hiddenStaffNodes) {
			if (node) node.visible = wasVisible;
		}
	}
	entry.hiddenStaffNodes.clear();
}

function spkmodSkinClearOnOwner(ownerKey) {
	const prev = _spkmodAppliedSkins.get(ownerKey);
	if (!prev) return;
	prev.seq = (prev.seq || 0) + 1;
	if (prev.root) {
		spkmodSkinRestoreMaterials(prev.root);
		spkmodSkinRemoveAttachments(prev, prev.root);
		spkmodSkinRestoreMagicStaff(prev);
	}
	if (prev.usedReviveHat && prev.ctrl && typeof prev.ctrl.hideReviveHat === "function") {
		// Do not hide if user manually toggled /copter hat
		if (!(ownerKey === "local_self" && (window.spkmodCopterHatActive || window.spkmodCopterHatAllActive))) {
			try { prev.ctrl.hideReviveHat(); } catch (_) {}
		}
	}
	_spkmodAppliedSkins.delete(ownerKey);
}

function spkmodSkinApplyMaterialFx(root, fxMode) {
	if (!root || typeof root.traverse !== "function") return;
	root.traverse(child => {
		if (!child || !child.isMesh || !child.material || child.userData?.spkmodSkinAttachment) return;
		if (typeof spkmodIsOutlineMaterial === "function" && spkmodIsOutlineMaterial(child.material)) return;
		if (child.userData.__spkmodSkinOrigMat === undefined) {
			child.userData.__spkmodSkinOrigMat = child.material;
		}
		child.material = Array.isArray(child.material)
			? child.material.map(m => spkmodSkinSafeCloneMat(m) || m)
			: (spkmodSkinSafeCloneMat(child.material) || child.material);
		child.userData.__spkmodSkinFxCloned = true;

		const mats = Array.isArray(child.material) ? child.material : [child.material];
		for (const m of mats) {
			if (!m) continue;
			if (!m.userData) m.userData = {};
			if (fxMode === "ghost") {
				m.transparent = true;
				m.opacity = 0.56;
				if (m.color?.setHex) m.color.setHex(0x99f6e4);
				if (m.emissive?.setHex) m.emissive.setHex(0x22d3ee);
				if (m.emissiveIntensity !== undefined) m.emissiveIntensity = 0.45;
			} else if (fxMode === "ice") {
				m.transparent = true;
				m.opacity = 0.84;
				if (m.color?.setHex) m.color.setHex(0xbae6fd);
				if (m.emissive?.setHex) m.emissive.setHex(0x38bdf8);
				if (m.emissiveIntensity !== undefined) m.emissiveIntensity = 0.32;
			} else if (fxMode === "shadow") {
				if (m.color?.setHex) m.color.setHex(0x0b0b0f);
				if (m.emissive?.setHex) m.emissive.setHex(0x2e1065);
				if (m.emissiveIntensity !== undefined) m.emissiveIntensity = 0.55;
			} else if (fxMode === "gold") {
				if (m.color?.setHex) m.color.setHex(0xffd700);
				if (m.emissive?.setHex) m.emissive.setHex(0xb45309);
				if (m.emissiveIntensity !== undefined) m.emissiveIntensity = 0.38;
			}
			m.needsUpdate = true;
		}
	});
}

function spkmodSkinApplyRecolorTexture(root, tex) {
	if (!root || !tex || typeof root.traverse !== "function") return;
	root.traverse(child => {
		if (!child || !child.isMesh || !child.material || child.userData?.spkmodSkinAttachment) return;
		if (typeof spkmodIsOutlineMaterial === "function" && spkmodIsOutlineMaterial(child.material)) return;
		const mats = Array.isArray(child.material) ? child.material : [child.material];
		const isBodyMat = (m) => m && typeof m.name === "string" && m.name.toLowerCase().includes("body") && m.map !== null;
		if (!mats.some(isBodyMat)) return;
		if (child.userData.__spkmodSkinOrigMat === undefined) {
			child.userData.__spkmodSkinOrigMat = child.material;
		}
		const replaced = mats.map(m => {
			if (!isBodyMat(m)) return m;
			const cm = spkmodSkinSafeCloneMat(m);
			if (cm && cm !== m) {
				cm.map = tex;
				cm.needsUpdate = true;
				return cm;
			}
			return m;
		});
		child.material = Array.isArray(child.material) ? replaced : replaced[0];
	});
}

async function spkmodApplySkinToAvatar(ownerKey, skinId, avatarRoot, animCtrl) {
	if (!skinId || skinId === "none" || skinId === "off" || !avatarRoot || avatarRoot.userData?.skinAvatarRoot === true) {
		spkmodSkinClearOnOwner(ownerKey);
		return;
	}
	const skin = SPKMOD_SKINS_BY_ID.get(skinId);
	if (!skin) {
		spkmodSkinClearOnOwner(ownerKey);
		return;
	}

	const existing = _spkmodAppliedSkins.get(ownerKey);
	if (existing && existing.skinId === skin.id && existing.root === avatarRoot) {
		// Ensure revive hat stays visible if needed
		if (existing.usedReviveHat && animCtrl && typeof animCtrl.showReviveHat === "function") {
			if (!animCtrl.reviveHatVisible) {
				try { animCtrl.showReviveHat(); } catch (_) {}
			}
		}
		return;
	}

	spkmodSkinClearOnOwner(ownerKey);

	const seq = ((existing && existing.seq) || 0) + 1;
	const entry = {
		skinId: skin.id,
		root: avatarRoot,
		ctrl: animCtrl || null,
		attachments: [],
		animParts: [],
		usedReviveHat: false,
		hideMagicStaff: !!skin.hideMagicStaff,
		hiddenStaffNodes: new Map(),
		fxMode: skin.fxMode || null,
		seq
	};
	_spkmodAppliedSkins.set(ownerKey, entry);

	if (entry.hideMagicStaff) {
		spkmodSkinHideMagicStaff(entry);
	}

	// 1. Outfit Texture Recolor
	if (skin.recolor) {
		const tex = await spkmodGetRecoloredBodyTexture(skin.id, skin.recolor);
		const cur = _spkmodAppliedSkins.get(ownerKey);
		if (!cur || cur !== entry || cur.seq !== seq || cur.root !== avatarRoot) return;
		if (tex) spkmodSkinApplyRecolorTexture(avatarRoot, tex);
	}

	// 2. Native Revive Pumpkin Copter Hat
	if (skin.useNativeReviveHat && animCtrl && typeof animCtrl.showReviveHat === "function") {
		try {
			animCtrl.showReviveHat();
			entry.usedReviveHat = true;
		} catch (_) {}
	}

	// 3. 3D Costume Attachments
	if (skin.costumeBuilder) {
		const built = await spkmodBuildCostumeAttachments(skin, avatarRoot);
		const cur = _spkmodAppliedSkins.get(ownerKey);
		if (!cur || cur !== entry || cur.seq !== seq || cur.root !== avatarRoot) {
			if (built) spkmodSkinRemoveAttachments(built, null);
			return;
		}
		if (built) {
			entry.attachments = built.attachments || [];
			entry.animParts = built.animParts || [];
		}
	}

	// 4. Special Material FX
	if (skin.fxMode) {
		spkmodSkinApplyMaterialFx(avatarRoot, skin.fxMode);
	}
}

// ============================================================================
// 7. PLAYER WIDE ("FAT") BODY MODIFIER ENGINE (FROM BURGER SHOP spkmodCA)
//    - Scales pelvis bone horizontally on X & Z axes in scene.onBeforeRender
//    - Preserves head (and hats!) + hand props unstretched via matrix inversion
//    - Restores cleanly in scene.onAfterRender so animations/physics stay pure
// ============================================================================
var spkmodPlayerFat = {
	entries: new Map(), // ownerKey -> { root, pel, head, hands, ap, p0, M, scale, rel }
	pelvisRe: /pelvis|hip/i,
	headRe: /head/i,
	spineRe: /spine/i
};
if (typeof window !== "undefined") window.spkmodPlayerFat = spkmodPlayerFat;

let _spkmodPFMatH1 = null;
let _spkmodPFMatInv = null;
const _spkmodPFPropMats = [];

function spkmodPFAxes(bone, cont) {
	const B = bone.matrixWorld.elements, C = cont.matrixWorld.elements;
	const norm = (e, o) => {
		const l = Math.hypot(e[o], e[o + 1], e[o + 2]) || 1;
		return [e[o] / l, e[o + 1] / l, e[o + 2] / l];
	};
	const axes = ["x", "y", "z"];
	const cx = norm(C, 0), cy = norm(C, 4), cz = norm(C, 8);
	const pick = (c, exclude) => {
		let best = "x", bd = -1;
		for (let k = 0; k < 3; k++) {
			const a = axes[k];
			if (a === exclude) continue;
			const b = norm(B, k * 4);
			const d = Math.abs(b[0] * c[0] + b[1] * c[1] + b[2] * c[2]);
			if (d > bd) { bd = d; best = a; }
		}
		return best;
	};
	let ax = pick(cx);
	let az = pick(cz);
	if (ax === az) {
		const ay = pick(cy);
		ax = pick(cx, ay);
		az = pick(cz, ax === ay ? ay : ax);
		if (az === ay) az = axes.find(a => a !== ax && a !== ay) || az;
	}
	return { x: ax, z: az };
}

function spkmodPFCollectHandProps(entry) {
	const out = [];
	const hands = entry && entry.hands;
	if (!hands) return out;
	for (let i = 0; i < hands.length; i++) {
		const hb = hands[i];
		const ch = hb && hb.children;
		if (!ch) continue;
		for (let j = 0; j < ch.length; j++) {
			const c = ch[j];
			if (c && !c.isBone && (c.userData?.lunchPropHolder === true || c.userData?.speakiMagicStaff === true || c.userData?.spkmodCookingProp === true || c.userData?.spkmodSkinHandProp === true || c.name === "speakov-weapon")) {
				out.push(c);
			}
		}
	}
	return out;
}

function spkmodPFRelease(entry) {
	if (!entry || entry.rel) return;
	entry.rel = true;
	if (entry.pel) {
		entry.pel.scale[entry.ap.x] = entry.p0.x;
		entry.pel.scale[entry.ap.z] = entry.p0.z;
		entry.pel.updateMatrix();
	}
	if (entry.head) {
		entry.head.matrixAutoUpdate = true;
		entry.head.updateMatrix();
	}
	const props = spkmodPFCollectHandProps(entry);
	for (let i = 0; i < props.length; i++) {
		props[i].matrixAutoUpdate = true;
		props[i].updateMatrix();
	}
	if (entry.root) {
		entry.root.updateMatrixWorld(true);
	}
}

function spkmodPFReleaseAll() {
	for (const e of spkmodPlayerFat.entries.values()) {
		spkmodPFRelease(e);
	}
	spkmodPlayerFat.entries.clear();
}

function spkmodPFSetTarget(ownerKey, avatarRoot, widthScale) {
	const scaleNum = Number(widthScale) || 1.0;
	const existing = spkmodPlayerFat.entries.get(ownerKey);
	if (!avatarRoot || avatarRoot.userData?.skinAvatarRoot === true || scaleNum <= 1.001) {
		if (existing) {
			spkmodPFRelease(existing);
			spkmodPlayerFat.entries.delete(ownerKey);
		}
		return;
	}
	if (existing && existing.root === avatarRoot) {
		existing.scale = scaleNum;
		return;
	}
	if (existing) {
		spkmodPFRelease(existing);
		spkmodPlayerFat.entries.delete(ownerKey);
	}
	const bones = [];
	avatarRoot.traverse(o => { if (o && o.isBone) bones.push(o); });
	const pel = bones.find(b => spkmodPlayerFat.pelvisRe.test(b.name)) || bones.find(b => spkmodPlayerFat.spineRe.test(b.name));
	const head = bones.find(b => spkmodPlayerFat.headRe.test(b.name) && !/nub|end/i.test(b.name));
	if (!pel || !head || pel === head || !head.parent) return;
	const hands = bones.filter(b => /hand/i.test(b.name) && !/nub|finger/i.test(b.name));
	avatarRoot.updateMatrixWorld(true);
	const ap = spkmodPFAxes(pel, avatarRoot);
	const px = pel.scale[ap.x], pz = pel.scale[ap.z];
	if (!px || !pz || !isFinite(px) || !isFinite(pz) || ap.x === ap.z) return;

	spkmodPlayerFat.entries.set(ownerKey, {
		root: avatarRoot,
		pel,
		head,
		hands,
		ap,
		p0: { x: px, z: pz },
		M: head.matrix.constructor,
		scale: scaleNum,
		rel: true
	});
	spkmodEnsurePlayerFatSceneHook();
}

function spkmodPFApplyAll() {
	if (!spkmodIsSkinsSystemEnabled() || spkmodPlayerFat.entries.size === 0) return;
	for (const [key, e] of spkmodPlayerFat.entries) {
		if (!e.root || !e.root.parent || e.scale <= 1.001) {
			spkmodPFRelease(e);
			if (!e.root || !e.root.parent) spkmodPlayerFat.entries.delete(key);
			continue;
		}
		const pel = e.pel, head = e.head, neck = head.parent;
		if (!pel || !head || !neck) continue;
		if (!_spkmodPFMatH1 || _spkmodPFMatH1.constructor !== e.M) {
			_spkmodPFMatH1 = new e.M();
			_spkmodPFMatInv = new e.M();
			_spkmodPFPropMats.length = 0;
		}
		const props = spkmodPFCollectHandProps(e);
		e.rel = false;
		head.matrixAutoUpdate = true;
		for (let i = 0; i < props.length; i++) props[i].matrixAutoUpdate = true;

		pel.scale[e.ap.x] = e.p0.x;
		pel.scale[e.ap.z] = e.p0.z;
		pel.updateMatrix();
		e.root.updateMatrixWorld(true);
		_spkmodPFMatH1.copy(head.matrixWorld);

		// Snapshot unstretched hand prop world matrices
		let propCount = 0;
		for (let i = 0; i < props.length; i++) {
			const h = props[i];
			const hand = h.parent;
			if (!hand) continue;
			let pm = _spkmodPFPropMats[propCount];
			if (!pm || pm.constructor !== e.M) {
				pm = new e.M();
				_spkmodPFPropMats[propCount] = pm;
			}
			pm.copy(h.matrixWorld);
			props[propCount] = h;
			propCount++;
		}

		// Apply wide horizontal pelvis scale
		pel.scale[e.ap.x] = e.p0.x * e.scale;
		pel.scale[e.ap.z] = e.p0.z * e.scale;
		pel.updateMatrix();
		e.root.updateMatrixWorld(true);

		// Keep head (and attached hats!) unstretched at its exact world neck attachment point
		const ne = neck.matrixWorld;
		if (typeof ne.determinant !== "function" || Math.abs(ne.determinant()) >= 1e-10) {
			const he = head.matrixWorld.elements;
			_spkmodPFMatH1.elements[12] = he[12];
			_spkmodPFMatH1.elements[13] = he[13];
			_spkmodPFMatH1.elements[14] = he[14];
			head.matrix.copy(_spkmodPFMatInv.copy(ne).invert().multiply(_spkmodPFMatH1));
			head.matrixAutoUpdate = false;
			head.updateMatrixWorld(true);
		}

		// Keep held weapons / props rigid & unstretched
		for (let i = 0; i < propCount; i++) {
			const h = props[i];
			const hand = h.parent;
			if (!hand) continue;
			const hm = hand.matrixWorld;
			if (typeof hm.determinant === "function" && Math.abs(hm.determinant()) < 1e-10) continue;
			const pm = _spkmodPFPropMats[i];
			const he = h.matrixWorld.elements;
			pm.elements[12] = he[12];
			pm.elements[13] = he[13];
			pm.elements[14] = he[14];
			h.matrix.copy(_spkmodPFMatInv.copy(hm).invert().multiply(pm));
			h.matrixAutoUpdate = false;
			h.updateMatrixWorld(true);
		}
	}
}

function spkmodPFRestoreAfterRender() {
	for (const e of spkmodPlayerFat.entries.values()) {
		if (!e.rel) spkmodPFRelease(e);
	}
}

function spkmodEnsurePlayerFatSceneHook() {
	const gs = typeof gameState !== "undefined" ? gameState : (typeof window !== "undefined" ? window.gameState : null);
	const scene = gs && gs.scene;
	if (!scene) return false;
	if (!scene.__spkmodPFBeforeHooked) {
		scene.__spkmodPFBeforeHooked = true;
		const prevBefore = scene.onBeforeRender;
		scene.onBeforeRender = function(renderer, sc, camera, ...rest) {
			if (typeof prevBefore === "function") {
				try { prevBefore.call(this, renderer, sc, camera, ...rest); } catch (_) {}
			}
			const curGs = typeof gameState !== "undefined" ? gameState : (typeof window !== "undefined" ? window.gameState : null);
			if (!curGs || sc !== curGs.scene) return;
			try {
				if (!spkmodIsSkinsSystemEnabled()) {
					if (spkmodPlayerFat.entries.size > 0) spkmodPFReleaseAll();
					return;
				}
				spkmodPFApplyAll();
			} catch (_) {}
		};
	}
	if (!scene.__spkmodPFAfterFn || scene.onAfterRender !== scene.__spkmodPFAfterFn) {
		const curAfter = scene.onAfterRender;
		if (!curAfter || !curAfter.__spkmodPFInChain) {
			const prevAfter = curAfter;
			const wrappedAfter = function(renderer, sc, camera, ...rest) {
				if (typeof prevAfter === "function") {
					try { prevAfter.call(this, renderer, sc, camera, ...rest); } catch (_) {}
				}
				const curGs = typeof gameState !== "undefined" ? gameState : (typeof window !== "undefined" ? window.gameState : null);
				if (!curGs || sc !== curGs.scene || spkmodPlayerFat.entries.size === 0) return;
				try {
					spkmodPFRestoreAfterRender();
				} catch (_) {}
			};
			wrappedAfter.__spkmodPFInChain = true;
			scene.__spkmodPFAfterFn = wrappedAfter;
			scene.onAfterRender = wrappedAfter;
		}
	}
	return true;
}

// ============================================================================
// 8. UNIFIED SYNC BRIDGE WITH PET BROADCAST (:pet_<pet>__s_<skin>__f_<width>:)
// ============================================================================
let _spkmodSkinHadBroadcast = false;
let _spkmodSkinLastObservedZoneId = null;
let _spkmodSkinLastObservedRemoteCount = 0;
let _spkmodSkinNeedsZoneSync = false;

window.spkmodGetActiveSkinBroadcastState = function() {
	const enabled = spkmodIsSkinsSystemEnabled();
	const shareInChat = spkmodIsSkinChatSharingEnabled();
	const nativeBlocked = spkmodHasNativeLocalSkin();
	const skinId = (enabled && !nativeBlocked && window.spkmodSkinSettings.equippedId) || null;
	const widthId = (enabled && !nativeBlocked && window.spkmodSkinSettings.widthId && window.spkmodSkinSettings.widthId !== "normal")
		? window.spkmodSkinSettings.widthId
		: null;
	return {
		enabled,
		shareInChat,
		skinId,
		widthId,
		hadBroadcastSkinOrWidth: _spkmodSkinHadBroadcast
	};
};

window.spkmodMarkSkinBroadcastSent = function(hasSkinOrWidth) {
	_spkmodSkinHadBroadcast = !!hasSkinOrWidth;
	_spkmodSkinNeedsZoneSync = false;
};

function spkmodTriggerSkinSyncBroadcast(opts = {}) {
	if (!spkmodIsSkinChatSharingEnabled()) return;
	const hasActive = !!(window.spkmodSkinSettings.equippedId || (window.spkmodSkinSettings.widthId && window.spkmodSkinSettings.widthId !== "normal"));
	const rCount = (typeof spkmodGetRemotePlayerCount === "function") ? spkmodGetRemotePlayerCount() : ((typeof gameState !== "undefined" && gameState?.remotePlayers?.remotePlayers?.size) || 0);
	if (hasActive && rCount === 0) {
		_spkmodSkinNeedsZoneSync = true;
	}
	if (typeof window.spkmodQueueUnifiedPetSkinBroadcast === "function") {
		window.spkmodQueueUnifiedPetSkinBroadcast(opts);
	}
}

function spkmodResolveRemotePlayerForSkin(playerId, playerName) {
	if (typeof gameState === "undefined" || !gameState?.remotePlayers?.remotePlayers) return null;
	const rMap = gameState.remotePlayers.remotePlayers;
	if (playerId != null) {
		for (const k of [playerId, Number(playerId), String(playerId)]) {
			const byId = rMap.get(k);
			if (byId) return { key: String(k), rp: byId };
		}
	}
	const lower = playerName ? playerName.trim().toLowerCase() : "";
	if (lower) {
		for (const [k, rp] of rMap) {
			const rName = (rp?.info?.__spkmodOrigName || rp?.info?.name || "").trim().toLowerCase();
			if (rName && rName === lower) return { key: String(k), rp };
		}
	}
	return null;
}

window.spkmodHandleIncomingSkinState = function(playerId, playerName, skinIdRaw, widthIdRaw, hasSkin, hasWidth) {
	const ownerKey = (playerId != null && playerId !== "")
		? String(playerId)
		: `name:${(playerName || "").trim().toLowerCase()}`;

	const prev = _spkmodRemoteSkinStates.get(ownerKey) || {
		playerId,
		playerName: playerName || "",
		skinId: null,
		widthId: "normal"
	};

	const nextSkinId = hasSkin
		? ((!skinIdRaw || skinIdRaw === "none" || skinIdRaw === "off") ? null : skinIdRaw.toLowerCase())
		: prev.skinId;
	const nextWidthId = hasWidth
		? ((!widthIdRaw || widthIdRaw === "none" || widthIdRaw === "off" || widthIdRaw === "normal") ? "normal" : widthIdRaw.toLowerCase())
		: prev.widthId;

	const state = {
		playerId: playerId != null ? playerId : prev.playerId,
		playerName: playerName || prev.playerName,
		skinId: (nextSkinId && SPKMOD_SKINS_BY_ID.has(nextSkinId)) ? nextSkinId : null,
		widthId: (nextWidthId && SPKMOD_BODY_WIDTHS_BY_ID.has(nextWidthId)) ? nextWidthId : "normal"
	};

	if (!state.skinId && state.widthId === "normal") {
		_spkmodRemoteSkinStates.delete(ownerKey);
		if (state.playerId != null) _spkmodRemoteSkinPendingById.delete(String(state.playerId));
		if (state.playerName) _spkmodRemoteSkinPendingByName.delete(state.playerName.trim().toLowerCase());
		spkmodSkinClearOnOwner(ownerKey);
		spkmodPFSetTarget(ownerKey, null, 1.0);
		return;
	}

	_spkmodRemoteSkinStates.set(ownerKey, state);
	if (state.playerId != null) _spkmodRemoteSkinPendingById.set(String(state.playerId), state);
	if (state.playerName) _spkmodRemoteSkinPendingByName.set(state.playerName.trim().toLowerCase(), state);
};

// ============================================================================
// 9. NATIVE IN-GAME COSTUME GUARD (PURE PUMPKIN / WITCH / NER)
//    & EQUIP / UNEQUIP LOCAL SKIN + BODY WIDTH + MASTER ANIMATION LOOP
// ============================================================================
let _spkmodUnequippingNativeSkin = false;
let _spkmodSkinsLastObservedNativeSkin = false;

function spkmodHasNativeLocalSkin() {
	if (typeof gameState === "undefined" || !gameState) return false;
	const mySkinId = Number(gameState.mySkinItemId || 0);
	const installedId = Number(gameState.localSkinInstalledItemId || 0);
	const effectiveId = (typeof gameState.effectiveLocalSkinItemId === "function")
		? Number(gameState.effectiveLocalSkinItemId() || 0)
		: mySkinId;
	const rootFlag = gameState.localAvatar?.root?.userData?.skinAvatarRoot === true;
	return mySkinId !== 0 || installedId !== 0 || effectiveId !== 0 || rootFlag;
}

function spkmodHasNativeRemoteSkin(rp) {
	if (!rp) return false;
	const skinId = Number(rp.skinItemId || 0);
	const rootFlag = rp.avatar?.root?.userData?.skinAvatarRoot === true;
	return skinId !== 0 || rootFlag;
}

async function spkmodUnequipNativeGameSkin() {
	if (!spkmodHasNativeLocalSkin()) return true;
	if (_spkmodUnequippingNativeSkin) return false;
	_spkmodUnequippingNativeSkin = true;
	try {
		if (typeof fetch !== "function") return false;
		const token = (typeof window.getNativeAuthToken === "function" ? window.getNativeAuthToken() : "") ||
			(typeof getAuthToken === "function" ? getAuthToken() : "") ||
			(window.speakiAuthToken || "");
		const headers = { "Content-Type": "application/json" };
		if (token) headers["authorization"] = `Bearer ${token.replace(/^Bearer /i, "")}`;
		const endpoint = window.lunActiveApiEndpoint ||
			(window.speakiServerEndpoint ? window.speakiServerEndpoint : "") ||
			"https://sr1.overture.io.kr";

		const res = await fetch(`${endpoint}/api/skin`, {
			method: "DELETE",
			headers,
			credentials: "include"
		});
		if (!res || !res.ok) {
			return false;
		}
		if (typeof gameState !== "undefined" && gameState && typeof gameState.setLocalSkin === "function") {
			gameState.setLocalSkin(0);
		}
		return !spkmodHasNativeLocalSkin();
	} catch (err) {
		console.warn("[SpeakiMod+ Skins] Failed to auto-unequip native in-game skin:", err);
		return false;
	} finally {
		_spkmodUnequippingNativeSkin = false;
	}
}

async function spkmodEnsureDefaultAvatarForModSkin(silentToast = false) {
	if (!spkmodHasNativeLocalSkin()) return true;
	const switched = await spkmodUnequipNativeGameSkin();
	if (!switched || spkmodHasNativeLocalSkin()) {
		if (!silentToast && typeof chatLog === "function") {
			chatLog(spkmodGetSkinUiText("nativeSkinBlockedToast"));
		}
		spkmodRefreshSkinsModalUI();
		return false;
	}
	if (!silentToast && typeof chatLog === "function") {
		chatLog(spkmodGetSkinUiText("nativeSkinAutoUnequippedToast"));
	}
	return true;
}

async function spkmodEquipLocalSkin(skinId, broadcast = true, silentToast = false) {
	if (!spkmodIsSkinsSystemEnabled()) {
		if (!silentToast && typeof chatLog === "function") chatLog(spkmodGetSkinsDisabledToastText());
		return false;
	}
	if (skinId === null || skinId === undefined || skinId === "" || skinId === "none" || skinId === "off" || skinId === "default") {
		window.spkmodSkinSettings.equippedId = null;
		if (window.localStorage) localStorage.removeItem(SPKMOD_SKIN_STORAGE_KEYS.equipped);
		spkmodSkinClearOnOwner("local_self");
		if (broadcast) {
			spkmodTriggerSkinSyncBroadcast({
				priority: "explicit",
				delayMs: 1100,
				forceResend: true,
				includeSkinState: true,
				reason: "skin_unequip"
			});
		}
		if (!silentToast && typeof chatLog === "function") {
			chatLog(spkmodGetSkinUiText("unequippedToast"));
		}
		spkmodRefreshSkinsModalUI();
		return true;
	}

	const cleanId = String(skinId).trim().toLowerCase();
	const skin = SPKMOD_SKINS_BY_ID.get(cleanId);
	if (!skin) {
		if (!silentToast && typeof chatLog === "function") {
			chatLog(spkmodGetSkinUiText("unknownSkinToast", skinId));
		}
		return false;
	}

	const dispName = spkmodGetSkinDisplayName(skin);
	if (!spkmodIsSkinUnlocked(skin)) {
		if (!silentToast && typeof chatLog === "function") {
			chatLog(spkmodGetSkinUiText("lockedToast", skin.level, dispName));
		}
		return false;
	}

	// Automatically unequip native in-game costume (Pure Pumpkin / Witch / Ner) or block if unequip fails
	if (!(await spkmodEnsureDefaultAvatarForModSkin(silentToast))) {
		return false;
	}

	window.spkmodSkinSettings.equippedId = skin.id;
	if (window.localStorage) localStorage.setItem(SPKMOD_SKIN_STORAGE_KEYS.equipped, skin.id);

	if (typeof gameState !== "undefined" && gameState?.localAvatar?.root) {
		const ctrl = gameState.localAnimationController || gameState.localAvatar?.animationController || null;
		await spkmodApplySkinToAvatar("local_self", skin.id, gameState.localAvatar.root, ctrl);
	}

	if (broadcast) {
		spkmodTriggerSkinSyncBroadcast({
			priority: "explicit",
			delayMs: 1100,
			forceResend: true,
			includeSkinState: true,
			reason: "skin_equip"
		});
	}

	if (!silentToast && typeof chatLog === "function") {
		chatLog(spkmodGetSkinUiText("equippedToast", `${skin.icon} ${dispName}`, skin.level));
	}
	spkmodRefreshSkinsModalUI();
	return true;
}

async function spkmodSetLocalBodyWidth(widthId, broadcast = true, silentToast = false) {
	if (!spkmodIsSkinsSystemEnabled()) {
		if (!silentToast && typeof chatLog === "function") chatLog(spkmodGetSkinsDisabledToastText());
		return false;
	}
	const raw = (widthId == null || widthId === "" || widthId === "none" || widthId === "off" || widthId === "0")
		? "normal"
		: String(widthId).trim().toLowerCase();
	const tier = SPKMOD_BODY_WIDTHS_BY_ID.get(raw);
	if (!tier) {
		if (!silentToast && typeof chatLog === "function") {
			chatLog(spkmodGetSkinUiText("unknownWidthToast", widthId));
		}
		return false;
	}

	const dispName = spkmodGetWidthDisplayName(tier);
	if (!spkmodIsWidthUnlocked(tier)) {
		if (!silentToast && typeof chatLog === "function") {
			chatLog(spkmodGetSkinUiText("widthLockedToast", tier.level, dispName));
		}
		return false;
	}

	if (tier.scale > 1.001) {
		if (!(await spkmodEnsureDefaultAvatarForModSkin(silentToast))) {
			return false;
		}
	}

	window.spkmodSkinSettings.widthId = tier.id;
	if (window.localStorage) localStorage.setItem(SPKMOD_SKIN_STORAGE_KEYS.width, tier.id);

	const root = typeof gameState !== "undefined" ? gameState?.localAvatar?.root : null;
	spkmodPFSetTarget("local_self", root, tier.scale);

	if (broadcast) {
		spkmodTriggerSkinSyncBroadcast({
			priority: "explicit",
			delayMs: 1100,
			forceResend: true,
			includeSkinState: true,
			reason: "skin_width"
		});
	}

	if (!silentToast && typeof chatLog === "function") {
		chatLog(spkmodGetSkinUiText("widthSetToast", `${tier.icon} ${dispName}`, tier.scale.toFixed(2).replace(/\.00$/, ".0")));
	}
	spkmodRefreshSkinsModalUI();
	return true;
}

let _spkmodSkinLoopRafId = null;
let _spkmodSkinLoopLastMs = performance.now();

function spkmodStartSkinsLoopIfEnabled() {
	if (!spkmodIsSkinsSystemEnabled()) return;
	if (_spkmodSkinLoopRafId !== null) return;
	_spkmodSkinLoopLastMs = performance.now();
	_spkmodSkinLoopRafId = requestAnimationFrame(spkmodSkinsMasterLoop);
}

function spkmodStopSkinsLoop() {
	if (_spkmodSkinLoopRafId !== null) {
		cancelAnimationFrame(_spkmodSkinLoopRafId);
		_spkmodSkinLoopRafId = null;
	}
}

function spkmodSyncSkinsSystemUIState() {
	const enabled = spkmodIsSkinsSystemEnabled();
	if (typeof lunPanelElements !== "undefined" && lunPanelElements) {
		if (lunPanelElements.skinsSystemToggleInput) {
			lunPanelElements.skinsSystemToggleInput.checked = enabled;
		}
		if (lunPanelElements.skinsBtn) {
			lunPanelElements.skinsBtn.classList.toggle("hidden", !enabled);
		}
	}
	const btnById = document.getElementById("spkmod-skins-btn");
	if (btnById) btnById.classList.toggle("hidden", !enabled);
}

window.spkmodSetSkinsSystemEnabled = function(nextEnabled, silentToast = false) {
	const enabled = !!nextEnabled;
	window.spkmodSkinSettings.enabled = enabled;
	window.spkmodSkinsSystemEnabled = enabled;
	if (typeof window !== "undefined" && window.localStorage) {
		try {
			localStorage.setItem(SPKMOD_SKIN_STORAGE_KEYS.enabled, enabled ? "true" : "false");
		} catch (_) {}
	}

	spkmodSyncSkinsSystemUIState();

	if (!enabled) {
		spkmodStopSkinsLoop();
		for (const key of [..._spkmodAppliedSkins.keys()]) {
			spkmodSkinClearOnOwner(key);
		}
		spkmodPFReleaseAll();
		const modal = document.getElementById("spkmod-skins-modal");
		if (modal) modal.classList.add("hidden");
	} else {
		_spkmodSkinLastObservedZoneId = null;
		_spkmodSkinLastObservedRemoteCount = 0;
		spkmodStartSkinsLoopIfEnabled();
	}

	if (!silentToast && typeof chatLog === "function") {
		chatLog(enabled ? spkmodGetSkinsEnabledToastText() : spkmodGetSkinsDisabledToastText());
	}
	return enabled;
};

function spkmodSkinsMasterLoop(nowMs) {
	_spkmodSkinLoopRafId = null;
	if (!spkmodIsSkinsSystemEnabled()) return;

	const dt = Math.min(0.1, Math.max(0.001, (nowMs - _spkmodSkinLoopLastMs) / 1000));
	_spkmodSkinLoopLastMs = nowMs;

	if (!document.hidden && typeof gameState !== "undefined" && gameState && gameState.scene) {
		spkmodEnsurePlayerFatSceneHook();

		// 1. Local player skin & body width sync (handles login auto-restore, avatar rebuilds & native costume guard!)
		const localRoot = gameState.localAvatar?.root || null;
		const localCtrl = gameState.localAnimationController || gameState.localAvatar?.animationController || null;
		const hasNativeLocal = spkmodHasNativeLocalSkin();

		if (hasNativeLocal && !_spkmodUnequippingNativeSkin) {
			const hadEquippedMod = !!(
				window.spkmodSkinSettings.equippedId ||
				(window.spkmodSkinSettings.widthId && window.spkmodSkinSettings.widthId !== "normal")
			);
			if (_spkmodAppliedSkins.has("local_self")) spkmodSkinClearOnOwner("local_self");
			if (spkmodPlayerFat.entries.has("local_self")) spkmodPFSetTarget("local_self", null, 1.0);
			if (hadEquippedMod) {
				window.spkmodSkinSettings.equippedId = null;
				window.spkmodSkinSettings.widthId = "normal";
				if (window.localStorage) {
					localStorage.removeItem(SPKMOD_SKIN_STORAGE_KEYS.equipped);
					localStorage.setItem(SPKMOD_SKIN_STORAGE_KEYS.width, "normal");
				}
				spkmodTriggerSkinSyncBroadcast({
					priority: "explicit",
					delayMs: 600,
					forceResend: true,
					includeSkinState: true,
					reason: "native_skin_override"
				});
				if (typeof chatLog === "function") chatLog(spkmodGetSkinUiText("nativeSkinClearedModToast"));
				spkmodRefreshSkinsModalUI();
			}
		} else if (localRoot && !hasNativeLocal) {
			const eqSkinId = window.spkmodSkinSettings.equippedId;
			if (eqSkinId) {
				const skin = SPKMOD_SKINS_BY_ID.get(eqSkinId);
				if (skin && spkmodIsSkinUnlocked(skin)) {
					const cur = _spkmodAppliedSkins.get("local_self");
					if (!cur || cur.skinId !== skin.id || cur.root !== localRoot) {
						spkmodApplySkinToAvatar("local_self", skin.id, localRoot, localCtrl);
					}
				} else if (skin && !spkmodIsSkinUnlocked(skin)) {
					spkmodSkinClearOnOwner("local_self");
				}
			} else if (_spkmodAppliedSkins.has("local_self")) {
				spkmodSkinClearOnOwner("local_self");
			}

			const wTier = SPKMOD_BODY_WIDTHS_BY_ID.get(window.spkmodSkinSettings.widthId || "normal");
			if (wTier && wTier.scale > 1.001 && spkmodIsWidthUnlocked(wTier)) {
				spkmodPFSetTarget("local_self", localRoot, wTier.scale);
			} else {
				spkmodPFSetTarget("local_self", null, 1.0);
			}
		}

		// 2. Zone change & remote player join sync (piggybacked onto single pet queue!)
		const hasActiveLocalCosmetic = !!(
			window.spkmodSkinSettings.equippedId ||
			(window.spkmodSkinSettings.widthId && window.spkmodSkinSettings.widthId !== "normal")
		);
		const rMap = gameState.remotePlayers?.remotePlayers;
		const rCount = rMap ? rMap.size : 0;

		if (gameState.zoneId != null && gameState.zoneId !== _spkmodSkinLastObservedZoneId) {
			_spkmodSkinLastObservedZoneId = gameState.zoneId;
			// Clean up stale remote entries on zone change
			for (const key of [..._spkmodAppliedSkins.keys()]) {
				if (key !== "local_self") spkmodSkinClearOnOwner(key);
			}
			for (const key of [...spkmodPlayerFat.entries.keys()]) {
				if (key !== "local_self") spkmodPFSetTarget(key, null, 1.0);
			}
			_spkmodRemoteSkinStates.clear();
			if (hasActiveLocalCosmetic && spkmodIsSkinChatSharingEnabled()) {
				_spkmodSkinNeedsZoneSync = true;
				spkmodTriggerSkinSyncBroadcast({
					priority: "passive",
					delayMs: 1800,
					forceResend: true,
					includeSkinState: true,
					reason: "zone"
				});
			}
		}

		if (rCount > 0 && hasActiveLocalCosmetic && spkmodIsSkinChatSharingEnabled()) {
			const inMinigame = (typeof spkmodIsInIsolatedMinigame === "function") ? spkmodIsInIsolatedMinigame() : false;
			if (!inMinigame) {
				if (_spkmodSkinNeedsZoneSync) {
					_spkmodSkinNeedsZoneSync = false;
					spkmodTriggerSkinSyncBroadcast({
						priority: "passive",
						delayMs: 1800,
						forceResend: true,
						includeSkinState: true,
						reason: "zone"
					});
				} else if (rCount > _spkmodSkinLastObservedRemoteCount) {
					spkmodTriggerSkinSyncBroadcast({
						priority: "passive",
						delayMs: 2500,
						forceResend: true,
						includeSkinState: true,
						reason: "remote_join"
					});
				}
			}
		}
		_spkmodSkinLastObservedRemoteCount = rCount;

		// 3. Apply & verify remote players' skins & body widths
		const showRemote = window.spkmodSkinSettings.showRemoteSkins !== false;
		const seenRemoteKeys = new Set();
		if (showRemote && rMap) {
			for (const [ownerKey, state] of _spkmodRemoteSkinStates) {
				const resolved = spkmodResolveRemotePlayerForSkin(state.playerId, state.playerName);
				if (!resolved || !resolved.rp || !resolved.rp.avatar?.root) continue;
				seenRemoteKeys.add(ownerKey);
				const rp = resolved.rp;
				const rpRoot = rp.avatar.root;
				const rpCtrl = rp.avatar.animationController || null;
				const rpLevel = rp.info?.level ?? 0;
				const rpName = rp.info?.__spkmodOrigName || rp.info?.name || state.playerName || "";

				// Never overlay SpeakiMod skins or fat body onto native in-game costumes (Pure Pumpkin / Witch / Ner)
				if (spkmodHasNativeRemoteSkin(rp)) {
					spkmodSkinClearOnOwner(ownerKey);
					spkmodPFSetTarget(ownerKey, null, 1.0);
					continue;
				}

				// Validate skin level against sender's visible level (VIP bypass allowed)
				if (state.skinId) {
					const skin = SPKMOD_SKINS_BY_ID.get(state.skinId);
					if (skin && spkmodCheckRemoteLevelAllowed(skin.level, rpLevel, rpName)) {
						const cur = _spkmodAppliedSkins.get(ownerKey);
						if (!cur || cur.skinId !== skin.id || cur.root !== rpRoot) {
							spkmodApplySkinToAvatar(ownerKey, skin.id, rpRoot, rpCtrl);
						}
					} else {
						spkmodSkinClearOnOwner(ownerKey);
					}
				} else if (_spkmodAppliedSkins.has(ownerKey)) {
					spkmodSkinClearOnOwner(ownerKey);
				}

				// Validate body width level against sender's visible level
				const wTier = SPKMOD_BODY_WIDTHS_BY_ID.get(state.widthId || "normal");
				if (wTier && wTier.scale > 1.001 && spkmodCheckRemoteLevelAllowed(wTier.level, rpLevel, rpName)) {
					spkmodPFSetTarget(ownerKey, rpRoot, wTier.scale);
				} else {
					spkmodPFSetTarget(ownerKey, null, 1.0);
				}
			}
		}
		for (const key of [..._spkmodAppliedSkins.keys()]) {
			if (key !== "local_self" && (!showRemote || !seenRemoteKeys.has(key))) {
				spkmodSkinClearOnOwner(key);
			}
		}
		for (const key of [...spkmodPlayerFat.entries.keys()]) {
			if (key !== "local_self" && (!showRemote || !seenRemoteKeys.has(key))) {
				spkmodPFSetTarget(key, null, 1.0);
			}
		}

		// 4. Animate active 3D costume parts & Rainbow Prism FX
		const tSec = nowMs * 0.001;
		for (const [, entry] of _spkmodAppliedSkins) {
			if (!entry || !entry.root) continue;
			if (entry.hideMagicStaff && (!entry._lastStaffCheckMs || nowMs - entry._lastStaffCheckMs >= 400)) {
				entry._lastStaffCheckMs = nowMs;
				spkmodSkinHideMagicStaff(entry);
				const hasSpeakovGun = !!(typeof entry.root.getObjectByName === "function" && entry.root.getObjectByName("speakov-weapon"));
				if (entry.attachments && entry.attachments.length > 0) {
					for (const att of entry.attachments) {
						if (att && att.node && att.node.userData?.spkmodHideInSpeakov) {
							att.node.visible = !hasSpeakovGun;
						}
					}
				}
			}
			if (entry.animParts && entry.animParts.length > 0) {
				for (const part of entry.animParts) {
					if (!part || !part.node) continue;
					if (part.type === "wing") {
						part.node.rotation.y = (0.22 + Math.sin(tSec * 3.8) * 0.18) * (part.side || 1);
					} else if (part.type === "tail") {
						part.node.rotation.y = (part.baseRotY || 0) + Math.sin(tSec * (part.speed || 4.5) + (part.phase || 0)) * (part.amp || 0.34);
					} else if (part.type === "floatY") {
						part.node.position.y = (part.baseY || 0.24) + Math.sin(tSec * 3.2) * 0.035;
						part.node.rotation.z = tSec * 0.8;
					} else if (part.type === "spinY") {
						part.node.rotation.y = tSec * 2.2;
					} else if (part.type === "cape") {
						part.node.rotation.x = (part.baseRotX || 0) + Math.sin(tSec * 2.8) * 0.06;
					} else if (part.type === "earWiggle") {
						part.node.rotation.z = (part.baseRotZ || 0) + Math.sin(tSec * 4.2) * 0.14 * (part.side || 1);
					} else if (part.type === "flutter") {
						part.node.rotation.y = (0.28 + Math.sin(tSec * 7.5) * 0.24) * (part.side || 1);
					} else if (part.type === "orbit") {
						const r = part.radius || 0.60;
						const ang = tSec * 2.1 + (part.phase || 0);
						part.node.position.x = Math.cos(ang) * r;
						part.node.position.z = Math.sin(ang) * r;
						part.node.position.y = (part.baseY || 0.18) + Math.sin(ang * 2) * 0.06;
						part.node.rotation.y = ang * 2;
					} else if (part.type === "flamePulse") {
						const s = 0.78 + 0.34 * Math.sin(tSec * 18 + (part.phase || 0));
						part.node.scale.set(1, s, 1);
					}
				}
			}
			if (entry.fxMode === "rainbow") {
				const hue = (tSec * 0.22) % 1.0;
				entry.root.traverse(child => {
					if (!child || !child.isMesh || !child.material || !child.userData?.__spkmodSkinFxCloned) return;
					const mats = Array.isArray(child.material) ? child.material : [child.material];
					for (const m of mats) {
						if (m && m.color?.setHSL) m.color.setHSL(hue, 0.92, 0.65);
						if (m && m.emissive?.setHSL) m.emissive.setHSL(hue, 0.92, 0.22);
					}
				});
			}
		}

		// Refresh modal if player leveled up or toggled a native costume while wardrobe is open
		const modal = document.getElementById("spkmod-skins-modal");
		if (modal && !modal.classList.contains("hidden")) {
			const curLvl = spkmodGetSkinPlayerLevel();
			if (curLvl !== _spkmodSkinsLastObservedLevel || hasNativeLocal !== _spkmodSkinsLastObservedNativeSkin) {
				_spkmodSkinsLastObservedLevel = curLvl;
				_spkmodSkinsLastObservedNativeSkin = hasNativeLocal;
				spkmodRefreshSkinsModalUI();
			}
		}
	}

	if (spkmodIsSkinsSystemEnabled()) {
		_spkmodSkinLoopRafId = requestAnimationFrame(spkmodSkinsMasterLoop);
	}
}

// ============================================================================
// 10. SKIN & COSTUME WARDROBE MODAL UI (#spkmod-skins-modal)
// ============================================================================
let _spkmodSkinsActiveTab = "all";
let _spkmodSkinsSearchQuery = "";
let _spkmodSkinsLastObservedLevel = -1;

const SPKMOD_SKIN_CAT_STYLES = {
	color:  { border: "#38bdf8", bg: "rgba(56, 189, 248, 0.12)", badge: "#0284c7" },
	outfit: { border: "#c084fc", bg: "rgba(192, 132, 252, 0.14)", badge: "#7c3aed" },
	fx:     { border: "#ffd700", bg: "rgba(255, 215, 0, 0.16)", badge: "#ca8a04" }
};

function spkmodEnsureSkinsModal() {
	if (typeof lunHudElements !== "undefined" && lunHudElements.skinsModal) {
		return lunHudElements.skinsModal;
	}

	if (!document.getElementById("spkmod-skins-styles")) {
		const styleEl = document.createElement("style");
		styleEl.id = "spkmod-skins-styles";
		styleEl.textContent = `
			#spkmod-skins-modal {
				position: fixed;
				width: min(900px, calc(100vw - 24px));
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
				z-index: 2147483611;
			}
			#spkmod-skins-modal.hidden {
				display: none !important;
			}
			.spkmod-skins-grid-scroll {
				flex: 1;
				min-height: 0;
				overflow-y: auto;
				overflow-x: hidden;
				overscroll-behavior: contain;
				padding: 12px;
			}
			.spkmod-skins-grid {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(205px, 1fr));
				grid-auto-rows: max-content;
				align-content: start;
				gap: 10px;
				height: auto;
			}
			.spkmod-skin-card {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				background: rgba(30, 41, 59, 0.72);
				border: 1.5px solid rgba(148, 163, 184, 0.25);
				border-radius: 10px;
				padding: 10px;
				min-height: 120px;
				box-sizing: border-box;
				transition: transform 0.14s ease, border-color 0.14s ease, box-shadow 0.14s ease;
				position: relative;
			}
			.spkmod-skin-card:hover {
				transform: translateY(-2px);
				box-shadow: 0 8px 20px rgba(0, 0, 0, 0.55);
			}
			.spkmod-skin-card.equipped {
				border-color: #4ade80 !important;
				box-shadow: 0 0 16px rgba(74, 222, 128, 0.35) !important;
				background: linear-gradient(145deg, rgba(20, 83, 45, 0.45), rgba(15, 23, 42, 0.85)) !important;
			}
			.spkmod-skin-card.locked {
				opacity: 0.62;
				filter: grayscale(0.35);
			}
			.spkmod-skins-tab-btn {
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
			.spkmod-skins-tab-btn.active {
				background: var(--spkmod-accent, #ffd54a);
				color: #0f172a;
				border-color: var(--spkmod-accent, #ffd54a);
			}
			.spkmod-width-pill {
				display: inline-flex;
				align-items: center;
				gap: 4px;
				background: rgba(30, 41, 59, 0.88);
				border: 1.5px solid rgba(148, 163, 184, 0.35);
				color: #e2e8f0;
				border-radius: 8px;
				padding: 4px 9px;
				font-size: 11px;
				font-weight: 700;
				cursor: pointer;
				white-space: nowrap;
				transition: all 0.14s ease;
			}
			.spkmod-width-pill.active {
				background: rgba(22, 163, 74, 0.45);
				border-color: #4ade80;
				color: #bbf7d0;
				box-shadow: 0 0 10px rgba(74, 222, 128, 0.3);
			}
			.spkmod-width-pill.locked {
				opacity: 0.55;
				cursor: not-allowed;
			}
		`;
		document.head.appendChild(styleEl);
	}

	const modal = document.createElement("div");
	modal.id = "spkmod-skins-modal";
	modal.className = "spkmod-modal hidden";

	// 1. Header
	const header = document.createElement("div");
	header.id = "spkmod-skins-header";
	header.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: rgba(15, 23, 42, 0.95); border-bottom: 1px solid rgba(255, 255, 255, 0.12); cursor: move; user-select: none;";

	const titleEl = document.createElement("div");
	titleEl.id = "spkmod-skins-title";
	titleEl.style.cssText = "font-size: 14px; font-weight: 800; color: var(--spkmod-accent, #ffd54a); display: flex; align-items: center; gap: 8px;";
	titleEl.innerText = spkmodGetSkinUiText("skinsModalTitle");

	const closeBtn = document.createElement("button");
	closeBtn.type = "button";
	closeBtn.innerText = "✕";
	closeBtn.style.cssText = "background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.5); color: #fca5a5; border-radius: 6px; width: 26px; height: 26px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center;";
	closeBtn.onclick = () => modal.classList.add("hidden");

	header.appendChild(titleEl);
	header.appendChild(closeBtn);

	// 2. Status & Quick Actions Bar
	const statusBar = document.createElement("div");
	statusBar.id = "spkmod-skins-status-bar";
	statusBar.style.cssText = "display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 14px; background: rgba(30, 41, 59, 0.65); border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 12px;";

	// 2b. Native In-Game Costume Warning Banner (shown when Pure Pumpkin / Witch / Ner is active)
	const nativeBanner = document.createElement("div");
	nativeBanner.id = "spkmod-skins-native-banner";
	nativeBanner.style.cssText = "display: none; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 14px; background: rgba(245, 158, 11, 0.18); border-bottom: 1px solid rgba(245, 158, 11, 0.45); color: #fde68a; font-size: 11.5px; font-weight: 700;";

	// 3. Body Width Modifier Bar (combines with ANY skin!)
	const widthBar = document.createElement("div");
	widthBar.id = "spkmod-skins-width-bar";
	widthBar.style.cssText = "display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 8px 14px; background: rgba(245, 158, 11, 0.08); border-bottom: 1px solid rgba(245, 158, 11, 0.22); font-size: 11.5px;";

	// 4. Controls Bar (Search, Toggles, Category Tabs)
	const controlsBar = document.createElement("div");
	controlsBar.id = "spkmod-skins-controls-bar";
	controlsBar.style.cssText = "display: flex; flex-direction: column; gap: 8px; padding: 8px 14px; background: rgba(15, 23, 42, 0.75); border-bottom: 1px solid rgba(255, 255, 255, 0.08);";

	// 5. Scrollable Skins Grid
	const gridScroll = document.createElement("div");
	gridScroll.className = "spkmod-skins-grid-scroll";

	const grid = document.createElement("div");
	grid.id = "spkmod-skins-grid";
	grid.className = "spkmod-skins-grid";
	gridScroll.appendChild(grid);

	// 6. Resize Handle
	const resizeHandle = document.createElement("div");
	resizeHandle.id = "spkmod-skins-resize";
	resizeHandle.style.cssText = "position: absolute; right: 2px; bottom: 2px; width: 16px; height: 16px; cursor: nwse-resize; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 11px; user-select: none;";
	resizeHandle.innerText = "◢";

	modal.appendChild(header);
	modal.appendChild(statusBar);
	modal.appendChild(nativeBanner);
	modal.appendChild(widthBar);
	modal.appendChild(controlsBar);
	modal.appendChild(gridScroll);
	modal.appendChild(resizeHandle);
	document.body.appendChild(modal);

	if (typeof lunHudElements !== "undefined") {
		lunHudElements.skinsModal = modal;
	}
	if (typeof makeDraggable === "function") {
		makeDraggable(modal, [header]);
	}
	if (typeof makeResizable === "function") {
		makeResizable(modal, resizeHandle, 360, 320);
	}

	const scrollDelta = (e) => (e.deltaMode === 1 ? e.deltaY * 33 : (e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY));
	gridScroll.addEventListener("wheel", (e) => { e.stopPropagation(); }, { passive: true });
	gridScroll.addEventListener("touchmove", (e) => { e.stopPropagation(); }, { passive: true });
	modal.addEventListener("wheel", (e) => {
		e.stopPropagation();
		if (gridScroll && e.target !== gridScroll && !gridScroll.contains(e.target)) {
			gridScroll.scrollTop += scrollDelta(e);
		}
	}, { passive: true });
	modal.addEventListener("touchmove", (e) => { e.stopPropagation(); }, { passive: true });
	modal.addEventListener("mouseenter", () => {
		if (document.pointerLockElement) {
			try { document.exitPointerLock(); } catch (_) {}
		}
	});
	for (const nonDragEl of [statusBar, nativeBanner, widthBar, controlsBar, gridScroll]) {
		nonDragEl.addEventListener("pointerdown", (e) => e.stopPropagation());
		nonDragEl.addEventListener("mousedown", (e) => e.stopPropagation());
	}

	spkmodBuildSkinsModalControls(controlsBar);
	spkmodRefreshSkinsModalUI();
	return modal;
}

function spkmodRenderSkinsWidthBar() {
	const widthBar = document.getElementById("spkmod-skins-width-bar");
	if (!widthBar) return;
	widthBar.innerHTML = "";

	const labelWrap = document.createElement("div");
	labelWrap.style.cssText = "display: inline-flex; align-items: center; gap: 6px; margin-right: 4px;";
	labelWrap.innerHTML = `<span style="font-weight: 800; color: #fbbf24;">🍔 ${spkmodGetSkinUiText("bodyWidthLabel")}:</span>`;
	labelWrap.title = spkmodGetSkinUiText("bodyWidthHint");
	widthBar.appendChild(labelWrap);

	const activeWidthId = window.spkmodSkinSettings.widthId || "normal";
	const lockedWidths = [];
	for (const tier of SPKMOD_BODY_WIDTH_TIERS) {
		const unlocked = spkmodIsWidthUnlocked(tier);
		if (!unlocked) {
			lockedWidths.push(tier);
			continue;
		}
		const isActive = activeWidthId === tier.id;
		const dispName = spkmodGetWidthDisplayName(tier);
		const scaleStr = tier.scale.toFixed(2).replace(/\.00$/, ".0");

		const pill = document.createElement("button");
		pill.type = "button";
		pill.className = "spkmod-width-pill" + (isActive ? " active" : "");
		pill.innerText = tier.level > 1
			? `${tier.icon} ${dispName} (${scaleStr}x · Lv.${tier.level})`
			: `${tier.icon} ${dispName} (${scaleStr}x)`;
		pill.title = `${dispName} (${scaleStr}x${tier.level > 1 ? `, Lv.${tier.level}` : ""}) — ${spkmodGetSkinUiText("bodyWidthHint")}`;
		pill.onclick = () => {
			if (isActive && tier.id !== "normal") {
				spkmodSetLocalBodyWidth("normal", true);
			} else {
				spkmodSetLocalBodyWidth(tier.id, true);
			}
		};
		widthBar.appendChild(pill);
	}
	if (lockedWidths.length > 0) {
		const nextWidthLvl = Math.min(...lockedWidths.map(w => w.level));
		const hintBadge = document.createElement("span");
		hintBadge.style.cssText = "display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 999px; border: 1px dashed rgba(255, 213, 74, 0.55); background: rgba(255, 213, 74, 0.08); color: #fde68a; font-size: 10.5px; font-weight: 700;";
		hintBadge.innerText = `🔒 ${spkmodGetSkinUiText("nextWidthHint", nextWidthLvl, lockedWidths.length)}`;
		hintBadge.title = spkmodGetSkinUiText("reqLevel", nextWidthLvl);
		widthBar.appendChild(hintBadge);
	}
}

function spkmodBuildSkinsModalControls(controlsBar) {
	if (!controlsBar) return;
	controlsBar.innerHTML = "";

	const topRow = document.createElement("div");
	topRow.style.cssText = "display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px;";

	const searchInput = document.createElement("input");
	searchInput.type = "text";
	searchInput.id = "spkmod-skins-search-input";
	searchInput.placeholder = spkmodGetSkinUiText("searchPlaceholder");
	searchInput.value = _spkmodSkinsSearchQuery;
	searchInput.style.cssText = "flex: 1; min-width: 200px; background: rgba(2, 6, 23, 0.85); border: 1px solid #475569; border-radius: 6px; padding: 6px 10px; color: #f8fafc; font-size: 12px; outline: none;";
	searchInput.addEventListener("input", () => {
		_spkmodSkinsSearchQuery = searchInput.value.trim().toLowerCase();
		spkmodRenderSkinsGrid();
	});
	searchInput.addEventListener("keydown", (e) => e.stopPropagation());
	searchInput.addEventListener("keyup", (e) => e.stopPropagation());
	topRow.appendChild(searchInput);

	const togglesWrap = document.createElement("div");
	togglesWrap.style.cssText = "display: flex; flex-wrap: wrap; align-items: center; gap: 10px; font-size: 11px; color: #e2e8f0;";

	const makeToggle = (labelKey, prop, storageKey, onChangeExtra) => {
		const lbl = document.createElement("label");
		lbl.style.cssText = "display: inline-flex; align-items: center; gap: 4px; cursor: pointer; user-select: none; white-space: nowrap;";
		const cb = document.createElement("input");
		cb.type = "checkbox";
		cb.checked = !!window.spkmodSkinSettings[prop];
		cb.onchange = () => {
			window.spkmodSkinSettings[prop] = cb.checked;
			if (window.localStorage) localStorage.setItem(storageKey, cb.checked ? "true" : "false");
			if (typeof onChangeExtra === "function") onChangeExtra(cb.checked);
		};
		const span = document.createElement("span");
		span.innerText = spkmodGetSkinUiText(labelKey);
		lbl.appendChild(cb);
		lbl.appendChild(span);
		return lbl;
	};

	togglesWrap.appendChild(makeToggle("toggleRemoteSkins", "showRemoteSkins", SPKMOD_SKIN_STORAGE_KEYS.showRemote));
	togglesWrap.appendChild(makeToggle("toggleShareInChat", "shareInChat", SPKMOD_SKIN_STORAGE_KEYS.shareInChat, (checked) => {
		if (checked && (window.spkmodSkinSettings.equippedId || (window.spkmodSkinSettings.widthId && window.spkmodSkinSettings.widthId !== "normal"))) {
			spkmodTriggerSkinSyncBroadcast({ priority: "passive", delayMs: 800, forceResend: true, includeSkinState: true, reason: "zone" });
		}
	}));

	topRow.appendChild(togglesWrap);
	controlsBar.appendChild(topRow);

	const tabsRow = document.createElement("div");
	tabsRow.style.cssText = "display: flex; flex-wrap: wrap; gap: 6px; align-items: center;";
	const tabs = [
		{ id: "all", key: "tabAll" },
		{ id: "unlocked", key: "tabUnlocked" },
		{ id: "color", key: "tabColors" },
		{ id: "outfit", key: "tabOutfits" },
		{ id: "fx", key: "tabFx" }
	];
	for (const tab of tabs) {
		const btn = document.createElement("button");
		btn.type = "button";
		btn.className = "spkmod-skins-tab-btn" + (_spkmodSkinsActiveTab === tab.id ? " active" : "");
		btn.innerText = spkmodGetSkinUiText(tab.key);
		btn.onclick = () => {
			_spkmodSkinsActiveTab = tab.id;
			tabsRow.querySelectorAll(".spkmod-skins-tab-btn").forEach(b => b.classList.remove("active"));
			btn.classList.add("active");
			spkmodRenderSkinsGrid();
		};
		tabsRow.appendChild(btn);
	}
	controlsBar.appendChild(tabsRow);
}

function spkmodRenderSkinsStatusBar() {
	const statusBar = document.getElementById("spkmod-skins-status-bar");
	if (!statusBar) return;
	statusBar.innerHTML = "";

	const myLvl = spkmodGetSkinPlayerLevel();
	const unlockedCount = SPKMOD_SKIN_CATALOG.filter(s => spkmodIsSkinUnlocked(s)).length;
	const totalCount = SPKMOD_SKIN_CATALOG.length;
	const eqSkin = window.spkmodSkinSettings.equippedId ? SPKMOD_SKINS_BY_ID.get(window.spkmodSkinSettings.equippedId) : null;
	const eqName = eqSkin ? `${eqSkin.icon} ${spkmodGetSkinDisplayName(eqSkin)} (Lv.${eqSkin.level})` : spkmodGetSkinUiText("noneEquipped");

	const infoWrap = document.createElement("div");
	infoWrap.style.cssText = "display: flex; flex-wrap: wrap; align-items: center; gap: 14px;";
	infoWrap.innerHTML = `
		<span>⭐ <b>${spkmodGetSkinUiText("myLevelLabel")}:</b> <span style="color:#ffd54a;font-weight:800;">Lv.${myLvl}</span></span>
		<span>🔓 <b>${spkmodGetSkinUiText("unlockedLabel")}:</b> <span style="color:#4ade80;font-weight:800;">${unlockedCount} / ${totalCount}</span></span>
		<span>👕 <b>${spkmodGetSkinUiText("equippedLabel")}:</b> <span style="color:#38bdf8;font-weight:800;">${eqName}</span></span>
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

	actionsWrap.appendChild(makeActionBtn(spkmodGetSkinUiText("btnResync"), "rgba(16, 185, 129, 0.4)", () => {
		if (!spkmodIsSkinChatSharingEnabled()) {
			if (typeof chatLog === "function") chatLog(spkmodGetSkinUiText("shareInChatDisabledToast"));
			return;
		}
		spkmodTriggerSkinSyncBroadcast({
			priority: "explicit",
			delayMs: 0,
			forceResend: true,
			includeSkinState: true,
			reason: "resync"
		});
		if (typeof chatLog === "function") chatLog(spkmodGetSkinUiText("broadcastToast"));
	}));

	if (eqSkin) {
		actionsWrap.appendChild(makeActionBtn(spkmodGetSkinUiText("btnUnequip"), "rgba(239, 68, 68, 0.45)", () => {
			spkmodEquipLocalSkin(null, true);
		}));
	}

	statusBar.appendChild(infoWrap);
	statusBar.appendChild(actionsWrap);
}

function spkmodRenderSkinsGrid() {
	const grid = document.getElementById("spkmod-skins-grid");
	if (!grid) return;
	grid.innerHTML = "";

	const eqId = window.spkmodSkinSettings.equippedId;
	const catLabelMap = {
		color: spkmodGetSkinUiText("catColor"),
		outfit: spkmodGetSkinUiText("catOutfit"),
		fx: spkmodGetSkinUiText("catFx")
	};

	let hiddenLockedCount = 0;
	let nextLockedLevel = Infinity;

	const filtered = SPKMOD_SKIN_CATALOG.filter(skin => {
		const unlocked = spkmodIsSkinUnlocked(skin);
		if (_spkmodSkinsActiveTab === "color" && skin.category !== "color") return false;
		if (_spkmodSkinsActiveTab === "outfit" && skin.category !== "outfit") return false;
		if (_spkmodSkinsActiveTab === "fx" && skin.category !== "fx") return false;

		if (!unlocked) {
			hiddenLockedCount++;
			if (skin.level < nextLockedLevel) nextLockedLevel = skin.level;
			return false;
		}

		if (_spkmodSkinsSearchQuery) {
			const dispName = spkmodGetSkinDisplayName(skin).toLowerCase();
			const enName = ((typeof spkmodTranslations !== "undefined" && spkmodTranslations.en?.skinNames?.[skin.id]) || skin.defaultName || "").toLowerCase();
			const cat = (catLabelMap[skin.category] || skin.category || "").toLowerCase();
			const lvlStr = `lv${skin.level} lv.${skin.level} ${skin.level}`;
			if (!dispName.includes(_spkmodSkinsSearchQuery) && !enName.includes(_spkmodSkinsSearchQuery) && !cat.includes(_spkmodSkinsSearchQuery) && !lvlStr.includes(_spkmodSkinsSearchQuery)) {
				return false;
			}
		}
		return true;
	});

	const frag = document.createDocumentFragment();
	for (const skin of filtered) {
		const isEquipped = eqId === skin.id;
		const catStyle = SPKMOD_SKIN_CAT_STYLES[skin.category] || SPKMOD_SKIN_CAT_STYLES.color;
		const dispName = spkmodGetSkinDisplayName(skin);
		const catLabel = catLabelMap[skin.category] || skin.category;

		const card = document.createElement("div");
		card.className = "spkmod-skin-card" + (isEquipped ? " equipped" : "");
		card.style.borderColor = isEquipped ? "#4ade80" : (skin.accent || catStyle.border);
		card.style.background = isEquipped
			? "linear-gradient(145deg, rgba(20, 83, 45, 0.45), rgba(15, 23, 42, 0.88))"
			: `linear-gradient(155deg, ${catStyle.bg}, rgba(15, 23, 42, 0.88))`;

		const topMeta = document.createElement("div");
		topMeta.style.cssText = "display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 6px;";
		topMeta.innerHTML = `
			<span style="background: ${catStyle.badge}; color: #fff; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 999px;">
				Lv.${skin.level}
			</span>
			<span style="font-size: 10px; font-weight: 700; color: ${skin.level >= 100 ? "#ffd54a" : "#94a3b8"};">
				${skin.level >= 100 ? spkmodGetSkinUiText("milestoneBadge") : catLabel}
			</span>
		`;

		const bodyEl = document.createElement("div");
		bodyEl.style.cssText = "display: flex; align-items: center; gap: 10px; margin-bottom: 10px;";
		bodyEl.innerHTML = `
			<div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(2, 6, 23, 0.65); border: 1.5px solid ${skin.accent || "rgba(255,255,255,0.14)"}; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0;">
				${skin.icon}
			</div>
			<div style="display: flex; flex-direction: column; gap: 3px; min-width: 0;">
				<div style="font-size: 12.5px; font-weight: 800; color: #f8fafc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${dispName}">
					${dispName}
				</div>
				<div style="font-size: 10px; color: #cbd5e1;">
					${catLabel}
				</div>
			</div>
		`;

		const equipBtn = document.createElement("button");
		equipBtn.type = "button";
		equipBtn.style.cssText = `
			width: 100%; height: 28px; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer;
			border: 1px solid ${isEquipped ? "#4ade80" : (skin.accent || catStyle.border)};
			background: ${isEquipped ? "rgba(22, 163, 74, 0.55)" : "rgba(30, 41, 59, 0.9)"};
			color: ${isEquipped ? "#bbf7d0" : "#f8fafc"};
		`;
		equipBtn.innerText = isEquipped
			? spkmodGetSkinUiText("btnEquipped")
			: spkmodGetSkinUiText("btnEquip");

		equipBtn.onclick = () => {
			if (isEquipped) {
				spkmodEquipLocalSkin(null, true);
			} else {
				spkmodEquipLocalSkin(skin.id, true);
			}
		};

		card.appendChild(topMeta);
		card.appendChild(bodyEl);
		card.appendChild(equipBtn);
		frag.appendChild(card);
	}

	// Render encouraging "Keep leveling up to unlock more!" Hype Banner whenever locked skins are hidden
	if (hiddenLockedCount > 0 && (_spkmodSkinsActiveTab !== "unlocked" || filtered.length === 0)) {
		const nextUnlockLvl = isFinite(nextLockedLevel) ? nextLockedLevel : Math.min(100, spkmodGetSkinPlayerLevel() + 1);
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
			background: linear-gradient(135deg, rgba(255, 213, 74, 0.10), rgba(192, 132, 252, 0.14), rgba(15, 23, 42, 0.92));
			box-shadow: inset 0 0 24px rgba(255, 213, 74, 0.08);
		`;
		hypeCard.innerHTML = `
			<div style="font-size: 22px; line-height: 1;">✨🔒👕✨</div>
			<div style="font-size: 14px; font-weight: 800; color: #ffd54a; letter-spacing: 0.2px;">
				${spkmodGetSkinUiText("hypeTitle")}
			</div>
			<div style="font-size: 11.5px; color: #cbd5e1; max-width: 580px;">
				${spkmodGetSkinUiText("hypeDesc", hiddenLockedCount, nextUnlockLvl)}
			</div>
		`;
		frag.appendChild(hypeCard);
	}
	grid.appendChild(frag);
}

function spkmodRenderSkinsNativeBanner() {
	const banner = document.getElementById("spkmod-skins-native-banner");
	if (!banner) return;
	if (!spkmodHasNativeLocalSkin()) {
		banner.style.display = "none";
		banner.innerHTML = "";
		return;
	}
	banner.style.display = "flex";
	banner.innerHTML = "";
	const txt = document.createElement("span");
	txt.style.cssText = "flex: 1; min-width: 200px;";
	txt.innerText = spkmodGetSkinUiText("nativeSkinBannerText");
	const btn = document.createElement("button");
	btn.type = "button";
	btn.innerText = spkmodGetSkinUiText("btnUnequipNativeSkin");
	btn.style.cssText = "background: rgba(245, 158, 11, 0.35); border: 1px solid #fbbf24; color: #fffbeb; border-radius: 6px; padding: 4px 10px; font-size: 11px; font-weight: 800; cursor: pointer; white-space: nowrap;";
	btn.onclick = async () => {
		btn.disabled = true;
		await spkmodEnsureDefaultAvatarForModSkin(false);
		btn.disabled = false;
		spkmodRefreshSkinsModalUI();
	};
	banner.appendChild(txt);
	banner.appendChild(btn);
}

function spkmodRefreshSkinsModalUI() {
	const modal = document.getElementById("spkmod-skins-modal");
	if (!modal || modal.classList.contains("hidden")) return;
	const titleEl = document.getElementById("spkmod-skins-title");
	if (titleEl) titleEl.innerText = spkmodGetSkinUiText("skinsModalTitle");
	const controlsBar = document.getElementById("spkmod-skins-controls-bar");
	if (controlsBar) spkmodBuildSkinsModalControls(controlsBar);
	spkmodRenderSkinsStatusBar();
	spkmodRenderSkinsNativeBanner();
	spkmodRenderSkinsWidthBar();
	spkmodRenderSkinsGrid();
}

window.spkmodOpenSkinsModal = function() {
	if (!spkmodIsSkinsSystemEnabled()) {
		const existingModal = document.getElementById("spkmod-skins-modal");
		if (existingModal) existingModal.classList.add("hidden");
		if (typeof chatLog === "function") chatLog(spkmodGetSkinsDisabledToastText());
		return;
	}
	const modal = spkmodEnsureSkinsModal();
	modal.classList.remove("hidden");
	_spkmodSkinsLastObservedLevel = spkmodGetSkinPlayerLevel();
	spkmodRefreshSkinsModalUI();
	if (typeof positionModalNicely === "function") {
		positionModalNicely(modal);
	}
};

window.spkmodToggleSkinsModal = function() {
	if (!spkmodIsSkinsSystemEnabled()) {
		const existingModal = document.getElementById("spkmod-skins-modal");
		if (existingModal) existingModal.classList.add("hidden");
		if (typeof chatLog === "function") chatLog(spkmodGetSkinsDisabledToastText());
		return;
	}
	const modal = spkmodEnsureSkinsModal();
	if (modal.classList.contains("hidden")) {
		window.spkmodOpenSkinsModal();
	} else {
		modal.classList.add("hidden");
	}
};

// Hotkey Alt+S to toggle Skin & Costume Wardrobe
window.addEventListener("keydown", e => {
	if (!spkmodIsSkinsSystemEnabled()) return;
	if (e.altKey && (e.key === "s" || e.key === "S" || e.code === "KeyS")) {
		const active = document.activeElement;
		if (active) {
			const tag = active.tagName ? active.tagName.toLowerCase() : "";
			if (tag === "input" || tag === "textarea" || active.isContentEditable) return;
		}
		e.preventDefault();
		window.spkmodToggleSkinsModal();
	}
});

if (typeof spkmodI18nRenderers !== "undefined" && Array.isArray(spkmodI18nRenderers)) {
	spkmodI18nRenderers.push(() => {
		spkmodSyncSkinsSystemUIState();
		spkmodRefreshSkinsModalUI();
	});
}

spkmodSyncSkinsSystemUIState();
spkmodStartSkinsLoopIfEnabled();

// ============================================================================
// 11. DEVELOPER & USER CONSOLE COMMANDS API (window.spkmodSkins)
// ============================================================================
window.spkmodSkins = {
	catalog: SPKMOD_SKIN_CATALOG,
	widths: SPKMOD_BODY_WIDTH_TIERS,
	isEnabled: () => spkmodIsSkinsSystemEnabled(),
	setEnabled: (enable, silentToast = false) => window.spkmodSetSkinsSystemEnabled(!!enable, silentToast),
	open: () => window.spkmodOpenSkinsModal(),
	toggle: () => window.spkmodToggleSkinsModal(),
	equip: (skinId) => spkmodEquipLocalSkin(skinId, true),
	unequip: () => spkmodEquipLocalSkin(null, true),
	setWidth: (widthId) => spkmodSetLocalBodyWidth(widthId, true),
	unlockAll: (enable) => {
		const next = enable !== undefined ? !!enable : !window.spkmodSkinSettings.unlockAllTest;
		window.spkmodSkinSettings.unlockAllTest = next;
		if (window.localStorage) localStorage.setItem(SPKMOD_SKIN_STORAGE_KEYS.unlockAll, next ? "true" : "false");
		spkmodRefreshSkinsModalUI();
		if (typeof chatLog === "function") {
			chatLog(next ? spkmodGetSkinUiText("testUnlockEnabledToast") : spkmodGetSkinUiText("testUnlockDisabledToast"));
		}
		return next;
	},
	list: () => {
		console.table(SPKMOD_SKIN_CATALOG.map(s => ({
			Level: s.level,
			ID: s.id,
			Category: s.category,
			Icon: s.icon,
			Name: spkmodGetSkinDisplayName(s)
		})));
	}
};
