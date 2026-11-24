// ============================================================================
// IN-GAME 3D SPARK FX WALKING TRAILS SYSTEM (100 LEVELS PROGRESSION + SYNC)
// ============================================================================

const SPKMOD_SPARK_STORAGE_KEYS = {
	enabled: "spkmod-spark-enabled",
	trailActive: "spkmod-step-trail-enabled",
	equipped: "spkmod-step-trail-type",
	showRemote: "spkmod-spark-show-remote",
	shareInChat: "spkmod-spark-share-chat",
	favorites: "spkmod-spark-favorites",
	unlockAll: "spkmod-spark-unlock-all-test"
};

function spkmodLoadSparkFavorites() {
	const set = new Set();
	try {
		if (typeof window !== "undefined" && window.localStorage) {
			const raw = localStorage.getItem(SPKMOD_SPARK_STORAGE_KEYS.favorites);
			if (raw) {
				const arr = JSON.parse(raw);
				if (Array.isArray(arr)) {
					for (const id of arr) {
						if (typeof id === "string" && id.trim()) set.add(id.trim());
					}
				}
			}
		}
	} catch (_) {}
	return set;
}

function spkmodSaveSparkFavorites(favSet) {
	try {
		if (typeof window !== "undefined" && window.localStorage) {
			localStorage.setItem(SPKMOD_SPARK_STORAGE_KEYS.favorites, JSON.stringify([...favSet]));
		}
	} catch (_) {}
}

// ============================================================================
// 1. MULTI-LANGUAGE UI STRINGS (translations.json)
// ============================================================================
const SPKMOD_SPARK_UI_FALLBACK_EN = {
	sparksBtnTooltip: "Spark FX Walking Trails (Alt+F)",
	sparksModalTitle: "✨ SpeakiMod+ Spark FX Trails (100 Levels)",
	myLevelLabel: "Your Level",
	unlockedLabel: "Unlocked",
	equippedLabel: "Active Trail",
	noneEquipped: "Trail OFF",
	btnEquip: "Equip",
	btnEquipped: "Equipped ✓",
	btnUnequip: "Turn Off",
	btnLocked: "Locked (Lv.{0})",
	btnPreview: "✨ Preview",
	btnBurst: "💥 Burst",
	btnBurstSpamOn: "⚡ Spam: ON",
	btnBurstSpamOff: "⚡ Spam: OFF",
	btnResync: "📡 Sync Map",
	searchPlaceholder: "Search 100 trails by name, theme, or level...",
	toggleRemoteSparks: "👁️ Show Others' Trails",
	toggleShareInChat: "📡 Share My Trail with Other Players",
	shareInChatDisabledToast: "📡 Trail sharing is OFF. Enable 'Share My Trail' in Spark FX to sync with others.",
	tabAll: "All",
	tabUnlocked: "Unlocked",
	tabFavorites: "⭐ Favorites",
	tabTier1: "Lv 1-20 Classics & Cute",
	tabTier2: "Lv 21-40 Nature & Seasons",
	tabTier3: "Lv 41-60 Magic & Elements",
	tabTier4: "Lv 61-80 Cyber & Spooky",
	tabTier5: "Lv 81-100 Cosmic & Legends",
	reqLevel: "Req. Lv.{0}",
	milestoneBadge: "★ MILESTONE",
	nextUnlockBadge: "🔥 UPCOMING",
	hypeTitle: "Keep leveling up to unlock more trails!",
	hypeDesc: "{0} more Spark FX walking trails await up to Lv.100! Reach Lv.{1} to unlock your next trail!",
	equippedToast: "✨ Equipped Spark FX Trail: {0} (Lv.{1})!",
	unequippedToast: "🛑 Spark FX Walking Trail turned OFF.",
	lockedToast: "🔒 Requires Level {0} to use {1}!",
	broadcastToast: "📡 Broadcasted active Spark FX trail to nearby mod players!",
	unknownSparkToast: "❌ Unknown Spark FX trail: {0}",
	burstToast: "💥 Triggered {0} Spark Burst!",
	burstSpamOnToast: "⚡ Spark Burst fast spam loop ACTIVATED!",
	burstSpamOffToast: "⏸️ Spark Burst fast spam loop PAUSED.",
	testUnlockEnabledToast: "🔓 [Spark FX Test] All 100 trails UNLOCKED for testing!",
	testUnlockDisabledToast: "🔒 [Spark FX Test] Normal level requirements restored.",
	favAddTooltip: "Add to Favorites",
	favRemoveTooltip: "Remove from Favorites",
	favEmptyHint: "No favorite trails yet! Click ☆ on any trail card to pin it here.",
	systemDisabledToast: "✨ Spark FX System is disabled. Enable it in Settings.",
	systemEnabledToast: "✨ Spark FX System enabled."
};

function spkmodGetSparkActiveLang() {
	if (typeof spkmodGetActiveLang === "function") return spkmodGetActiveLang();
	const raw = (typeof spkmodLang !== "undefined" && spkmodLang) ? spkmodLang : "en";
	if (typeof spkmodTranslations !== "undefined" && spkmodTranslations[raw]) return raw;
	if (raw === "zh") return "zh-CN";
	if (raw === "es") return "es-419";
	return raw || "en";
}

function spkmodGetSparkUiText(key, ...args) {
	const lang = spkmodGetSparkActiveLang();
	const tr = typeof spkmodTranslations !== "undefined" ? spkmodTranslations : null;
	let str = (tr && tr[lang] && tr[lang].sparkUi && tr[lang].sparkUi[key])
		|| (tr && tr.en && tr.en.sparkUi && tr.en.sparkUi[key])
		|| SPKMOD_SPARK_UI_FALLBACK_EN[key]
		|| key;
	args.forEach((a, i) => {
		str = str.split(`{${i}}`).join(a);
	});
	return str;
}
window.spkmodGetSparkUiText = spkmodGetSparkUiText;

// ============================================================================
// 2. MASTER 100-TRAIL PROGRESSION CATALOG (LEVELS 1 TO 100)
// ============================================================================
const SPKMOD_SPARK_CATALOG = [
	// --- TIER 1: LV 1-20 (CLASSICS, SWEETS & CUTE BASICS) ---
	{ level: 1,  id: "stars",            tier: 1, icon: "⭐", accent: "#ffd700", defaultName: "Golden Stars",          shape: "star4",     colors: ["#ffd700", "#fff3a1", "#ffb703"], motion: "burst",    additive: true,  count: 8,  size: 0.34, life: 0.72, speed: 1.4, gravity: 1.6 },
	{ level: 2,  id: "rainbow",          tier: 1, icon: "🌈", accent: "#ec4899", defaultName: "Rainbow Prism",         shape: "star4",     colors: ["#ff0055", "#ff8800", "#ffd700", "#00ff88", "#00d4ff", "#b347ff"], motion: "fountain", additive: true,  count: 9,  size: 0.36, life: 0.85, speed: 1.8, gravity: 2.0, cycleColors: true },
	{ level: 3,  id: "hearts",           tier: 1, icon: "💖", accent: "#f43f5e", defaultName: "Sweet Hearts",          shape: "heart",     colors: ["#ff5c8a", "#ff85a8", "#ffb3c6"], motion: "rise",     additive: false, count: 6,  size: 0.36, life: 1.15, speed: 1.1, gravity: -0.3 },
	{ level: 4,  id: "bubbles",          tier: 1, icon: "⚪", accent: "#7dd3fc", defaultName: "Soap Bubbles",          shape: "bubble",    colors: ["#bae6fd", "#e0f2fe", "#c4b5fd", "#fbcfe8"], motion: "rise",     additive: false, count: 6,  size: 0.38, life: 1.25, speed: 0.9, gravity: -0.4 },
	{ level: 5,  id: "confetti",         tier: 1, icon: "🎉", accent: "#f59e0b", defaultName: "Party Confetti",        shape: "pixel",     colors: ["#ff4d6d", "#ffbe0b", "#3a86ff", "#06d6a0", "#c77dff"], motion: "fountain", additive: false, count: 10, size: 0.26, life: 0.95, speed: 2.1, gravity: 2.8, spin: 5 },
	{ level: 6,  id: "pastel_stars",     tier: 1, icon: "🌟", accent: "#f9a8d4", defaultName: "Pastel Twinkles",       shape: "star5",     colors: ["#fbcfe8", "#fde68a", "#a7f3d0", "#bfdbfe", "#ddd6fe"], motion: "burst",    additive: true,  count: 8,  size: 0.34, life: 0.85, speed: 1.2, gravity: 0.8 },
	{ level: 7,  id: "paw_prints",       tier: 1, icon: "🐾", accent: "#fb923c", defaultName: "Puppy Paws",            shape: "paw",       colors: ["#fdba74", "#fb923c", "#fde68a"], motion: "ring",     additive: false, count: 5,  size: 0.34, life: 1.10, speed: 0.4, gravity: 0.0 },
	{ level: 8,  id: "candy_pop",        tier: 1, icon: "🍬", accent: "#fb7185", defaultName: "Sugar Candy",           shape: "candy",     colors: ["#fb7185", "#38bdf8", "#facc15", "#c084fc"], motion: "fountain", additive: false, count: 6,  size: 0.36, life: 0.95, speed: 1.7, gravity: 2.4, spin: 4 },
	{ level: 9,  id: "music_notes",      tier: 1, icon: "🎵", accent: "#a78bfa", defaultName: "Melody Notes",          shape: "note",      colors: ["#c084fc", "#f472b6", "#60a5fa", "#fde047"], motion: "rise",     additive: false, count: 5,  size: 0.38, life: 1.20, speed: 1.0, gravity: -0.2 },
	{ level: 10, id: "clover_luck",      tier: 1, icon: "🍀", accent: "#4ade80", defaultName: "Lucky Clovers",         shape: "clover",    colors: ["#4ade80", "#22c55e", "#bbf7d0"], motion: "flutter",  additive: false, count: 6,  size: 0.36, life: 1.15, speed: 0.9, gravity: 0.4, milestone: true },
	{ level: 11, id: "strawberry_cream", tier: 1, icon: "🍓", accent: "#fb7185", defaultName: "Berry Cream Hearts",    shape: "heart",     colors: ["#f43f5e", "#fda4af", "#fff1f2"], motion: "flutter",  additive: false, count: 6,  size: 0.34, life: 1.05, speed: 1.0, gravity: -0.1 },
	{ level: 12, id: "mint_breeze",      tier: 1, icon: "🍃", accent: "#34d399", defaultName: "Mint Sparkles",         shape: "star4",     colors: ["#6ee7b7", "#a7f3d0", "#2dd4bf"], motion: "orbit",    additive: true,  count: 8,  size: 0.32, life: 0.85, speed: 1.2, gravity: 0.2 },
	{ level: 13, id: "lemon_fizz",       tier: 1, icon: "🍋", accent: "#fde047", defaultName: "Lemon Fizz",            shape: "bubble",    colors: ["#fef08a", "#fde047", "#bef264"], motion: "rise",     additive: true,  count: 8,  size: 0.30, life: 0.80, speed: 1.4, gravity: -0.5 },
	{ level: 14, id: "peach_glow",       tier: 1, icon: "🍑", accent: "#fda4af", defaultName: "Peach Glow",            shape: "glow",      colors: ["#fecdd3", "#fdba74", "#fbcfe8"], motion: "rise",     additive: true,  count: 7,  size: 0.42, life: 0.95, speed: 0.8, gravity: -0.2 },
	{ level: 15, id: "cotton_candy",     tier: 1, icon: "☁️", accent: "#f0abfc", defaultName: "Cotton Candy Mist",     shape: "glow",      colors: ["#f9a8d4", "#93c5fd", "#e9d5ff"], motion: "flutter",  additive: true,  count: 8,  size: 0.46, life: 1.05, speed: 0.7, gravity: -0.15 },
	{ level: 16, id: "honey_drops",      tier: 1, icon: "🍯", accent: "#f59e0b", defaultName: "Golden Honey Drops",    shape: "drop",      colors: ["#fbbf24", "#f59e0b", "#fef08a"], motion: "fountain", additive: false, count: 7,  size: 0.32, life: 0.90, speed: 1.5, gravity: 2.2 },
	{ level: 17, id: "pixel_bits",       tier: 1, icon: "👾", accent: "#22d3ee", defaultName: "8-Bit Retro Pixels",    shape: "pixel",     colors: ["#22d3ee", "#f472b6", "#facc15", "#4ade80"], motion: "burst",    additive: true,  count: 9,  size: 0.26, life: 0.78, speed: 1.7, gravity: 1.4 },
	{ level: 18, id: "soda_pop",         tier: 1, icon: "🥤", accent: "#38bdf8", defaultName: "Fizzy Soda Pop",        shape: "bubble",    colors: ["#38bdf8", "#7dd3fc", "#ffffff"], motion: "fountain", additive: true,  count: 9,  size: 0.28, life: 0.85, speed: 1.9, gravity: 1.2 },
	{ level: 19, id: "ribbon_rings",     tier: 1, icon: "🎀", accent: "#f472b6", defaultName: "Cheerful Step Rings",   shape: "ring",      colors: ["#f472b6", "#fde047", "#60a5fa"], motion: "ring",     additive: true,  count: 4,  size: 0.56, life: 0.80, speed: 0.3, gravity: 0.0, cycleColors: true },
	{ level: 20, id: "double_love",      tier: 1, icon: "💞", accent: "#ff4d88", defaultName: "Double Love Hearts",    shape: "heart2",    colors: ["#ff4d88", "#ff85b3", "#ffd1dc"], motion: "helix",    additive: false, count: 7,  size: 0.42, life: 1.25, speed: 1.2, gravity: -0.35, milestone: true },

	// --- TIER 2: LV 21-40 (NATURE, SEASONS & COZY VIBES) ---
	{ level: 21, id: "sakura_petals",    tier: 2, icon: "🌸", accent: "#f9a8d4", defaultName: "Sakura Petals",         shape: "petal",     colors: ["#fbcfe8", "#f9a8d4", "#fda4af", "#fff1f2"], motion: "flutter",  additive: false, count: 8,  size: 0.36, life: 1.35, speed: 0.9, gravity: 0.35, spin: 3 },
	{ level: 22, id: "spring_leaves",    tier: 2, icon: "🌿", accent: "#84cc16", defaultName: "Spring Sprout Leaves",  shape: "leaf",      colors: ["#84cc16", "#4ade80", "#bef264"], motion: "flutter",  additive: false, count: 7,  size: 0.36, life: 1.20, speed: 0.9, gravity: 0.45, spin: 2.5 },
	{ level: 23, id: "sunbeam_motes",    tier: 2, icon: "☀️", accent: "#fbbf24", defaultName: "Warm Sunbeams",         shape: "sun",       colors: ["#fde047", "#fbbf24", "#fef9c3"], motion: "rise",     additive: true,  count: 7,  size: 0.38, life: 1.00, speed: 0.9, gravity: -0.2 },
	{ level: 24, id: "morning_dew",      tier: 2, icon: "💧", accent: "#38bdf8", defaultName: "Morning Dewdrops",      shape: "drop",      colors: ["#7dd3fc", "#bae6fd", "#38bdf8"], motion: "fountain", additive: true,  count: 8,  size: 0.30, life: 0.85, speed: 1.6, gravity: 2.3 },
	{ level: 25, id: "meadow_butterfly", tier: 2, icon: "🦋", accent: "#60a5fa", defaultName: "Meadow Butterflies",    shape: "butterfly", colors: ["#60a5fa", "#f472b6", "#facc15", "#a78bfa"], motion: "flutter",  additive: false, count: 5,  size: 0.44, life: 1.40, speed: 1.1, gravity: -0.25 },
	{ level: 26, id: "dandelion_fluff",  tier: 2, icon: "🌾", accent: "#fef3c7", defaultName: "Dandelion Wishes",      shape: "glow",      colors: ["#ffffff", "#fef9c3", "#fde68a"], motion: "flutter",  additive: true,  count: 9,  size: 0.28, life: 1.45, speed: 0.6, gravity: -0.18 },
	{ level: 27, id: "summer_fireflies", tier: 2, icon: "🐞", accent: "#bef264", defaultName: "Twilight Fireflies",    shape: "glow",      colors: ["#d9f99d", "#bef264", "#facc15"], motion: "orbit",    additive: true,  count: 8,  size: 0.34, life: 1.30, speed: 0.8, gravity: -0.1 },
	{ level: 28, id: "rain_ripples",     tier: 2, icon: "🌧️", accent: "#60a5fa", defaultName: "Raindrop Ripples",      shape: "ring",      colors: ["#60a5fa", "#93c5fd", "#bae6fd"], motion: "ring",     additive: true,  count: 4,  size: 0.62, life: 0.85, speed: 0.2, gravity: 0.0 },
	{ level: 29, id: "ocean_spray",      tier: 2, icon: "🌊", accent: "#06b6d4", defaultName: "Ocean Foam",            shape: "bubble",    colors: ["#22d3ee", "#67e8f9", "#ecfeff"], motion: "fountain", additive: true,  count: 9,  size: 0.34, life: 0.90, speed: 1.7, gravity: 1.5 },
	{ level: 30, id: "sunset_glow",      tier: 2, icon: "🌇", accent: "#fb923c", defaultName: "Golden Sunset",         shape: "star5",     colors: ["#fb7185", "#fb923c", "#facc15", "#c084fc"], motion: "rise",     additive: true,  count: 8,  size: 0.38, life: 1.05, speed: 1.0, gravity: -0.15, milestone: true },
	{ level: 31, id: "autumn_maple",     tier: 2, icon: "🍁", accent: "#ea580c", defaultName: "Autumn Maple Leaves",   shape: "maple",     colors: ["#ef4444", "#f97316", "#f59e0b", "#dc2626"], motion: "flutter",  additive: false, count: 7,  size: 0.40, life: 1.35, speed: 0.9, gravity: 0.45, spin: 3.2 },
	{ level: 32, id: "amber_wind",       tier: 2, icon: "🍂", accent: "#d97706", defaultName: "Amber Harvest Wind",    shape: "leaf",      colors: ["#f59e0b", "#d97706", "#fde047"], motion: "helix",    additive: false, count: 7,  size: 0.36, life: 1.15, speed: 1.2, gravity: 0.2, spin: 3 },
	{ level: 33, id: "forest_mist",      tier: 2, icon: "🌲", accent: "#10b981", defaultName: "Emerald Forest Mist",   shape: "glow",      colors: ["#10b981", "#34d399", "#a7f3d0"], motion: "rise",     additive: true,  count: 8,  size: 0.46, life: 1.15, speed: 0.7, gravity: -0.15 },
	{ level: 34, id: "angel_feathers",   tier: 2, icon: "🕊️", accent: "#f8fafc", defaultName: "Soft White Feathers",   shape: "feather",   colors: ["#ffffff", "#e2e8f0", "#fef9c3"], motion: "flutter",  additive: false, count: 6,  size: 0.42, life: 1.45, speed: 0.75, gravity: 0.22, spin: 2 },
	{ level: 35, id: "rose_petals",      tier: 2, icon: "🌹", accent: "#e11d48", defaultName: "Crimson Rose Petals",   shape: "petal",     colors: ["#e11d48", "#f43f5e", "#fda4af"], motion: "flutter",  additive: false, count: 8,  size: 0.38, life: 1.35, speed: 0.9, gravity: 0.38, spin: 3.5 },
	{ level: 36, id: "lavender_drift",   tier: 2, icon: "💐", accent: "#a855f7", defaultName: "Lavender Breeze",       shape: "petal",     colors: ["#c084fc", "#a855f7", "#e9d5ff"], motion: "flutter",  additive: true,  count: 8,  size: 0.36, life: 1.25, speed: 0.85, gravity: 0.2, spin: 2.5 },
	{ level: 37, id: "first_snow",       tier: 2, icon: "❄️", accent: "#bae6fd", defaultName: "First Snowflakes",      shape: "snow",      colors: ["#ffffff", "#e0f2fe", "#bae6fd"], motion: "flutter",  additive: true,  count: 8,  size: 0.36, life: 1.40, speed: 0.7, gravity: 0.30, spin: 2 },
	{ level: 38, id: "winter_icicles",   tier: 2, icon: "🧊", accent: "#38bdf8", defaultName: "Crystal Icicles",       shape: "crystal",   colors: ["#7dd3fc", "#38bdf8", "#f0f9ff"], motion: "burst",    additive: true,  count: 8,  size: 0.36, life: 0.90, speed: 1.5, gravity: 1.6 },
	{ level: 39, id: "moon_butterflies", tier: 2, icon: "🌙", accent: "#818cf8", defaultName: "Moonlit Butterflies",   shape: "butterfly", colors: ["#818cf8", "#c4b5fd", "#38bdf8"], motion: "orbit",    additive: true,  count: 6,  size: 0.44, life: 1.35, speed: 1.1, gravity: -0.25 },
	{ level: 40, id: "four_seasons",     tier: 2, icon: "🌺", accent: "#34d399", defaultName: "Four Seasons Swirl",    shape: "petal",     colors: ["#f9a8d4", "#4ade80", "#f97316", "#bae6fd"], motion: "helix",    additive: false, count: 9,  size: 0.40, life: 1.35, speed: 1.3, gravity: 0.15, spin: 3.5, milestone: true },

	// --- TIER 3: LV 41-60 (ELEMENTAL & ARCANE MAGIC) ---
	{ level: 41, id: "ember_sparks",     tier: 3, icon: "🔥", accent: "#f97316", defaultName: "Campfire Embers",       shape: "flame",     colors: ["#fb923c", "#f97316", "#fde047"], motion: "rise",     additive: true,  count: 8,  size: 0.36, life: 0.95, speed: 1.3, gravity: -0.5 },
	{ level: 42, id: "frost_ring",       tier: 3, icon: "💠", accent: "#67e8f9", defaultName: "Frostbite Rings",       shape: "ring",      colors: ["#67e8f9", "#38bdf8", "#e0f2fe"], motion: "ring",     additive: true,  count: 5,  size: 0.64, life: 0.85, speed: 0.3, gravity: 0.0 },
	{ level: 43, id: "volt_sparks",      tier: 3, icon: "⚡", accent: "#facc15", defaultName: "Static Lightning",      shape: "bolt",      colors: ["#fde047", "#38bdf8", "#ffffff"], motion: "burst",    additive: true,  count: 8,  size: 0.38, life: 0.60, speed: 2.2, gravity: 0.5 },
	{ level: 44, id: "aqua_vortex",      tier: 3, icon: "🌀", accent: "#0ea5e9", defaultName: "Tidal Swirl",           shape: "drop",      colors: ["#0ea5e9", "#38bdf8", "#67e8f9"], motion: "helix",    additive: true,  count: 9,  size: 0.34, life: 1.00, speed: 1.4, gravity: 0.2 },
	{ level: 45, id: "wind_blades",      tier: 3, icon: "💨", accent: "#a7f3d0", defaultName: "Gale Feathers",         shape: "feather",   colors: ["#a7f3d0", "#6ee7b7", "#ecfdf5"], motion: "helix",    additive: true,  count: 7,  size: 0.40, life: 0.95, speed: 1.8, gravity: -0.1, spin: 4 },
	{ level: 46, id: "earth_gems",       tier: 3, icon: "💚", accent: "#22c55e", defaultName: "Emerald Shards",        shape: "crystal",   colors: ["#22c55e", "#4ade80", "#86efac"], motion: "fountain", additive: true,  count: 8,  size: 0.36, life: 0.90, speed: 1.7, gravity: 2.4 },
	{ level: 47, id: "poison_spores",    tier: 3, icon: "🧪", accent: "#a3e635", defaultName: "Toxic Spores",          shape: "bubble",    colors: ["#a3e635", "#84cc16", "#c084fc"], motion: "rise",     additive: true,  count: 8,  size: 0.36, life: 1.15, speed: 0.9, gravity: -0.35 },
	{ level: 48, id: "fairy_dust",       tier: 3, icon: "🧚", accent: "#f0abfc", defaultName: "Enchanted Fairy Dust",  shape: "star4",     colors: ["#f0abfc", "#fde047", "#67e8f9", "#ffffff"], motion: "orbit",    additive: true,  count: 10, size: 0.32, life: 1.15, speed: 1.1, gravity: -0.1 },
	{ level: 49, id: "healing_rings",    tier: 3, icon: "✨", accent: "#4ade80", defaultName: "Holy Healing Rings",    shape: "ring",      colors: ["#4ade80", "#bef264", "#fef9c3"], motion: "ring",     additive: true,  count: 5,  size: 0.66, life: 0.95, speed: 0.35, gravity: -0.25 },
	{ level: 50, id: "inferno_flames",   tier: 3, icon: "🌋", accent: "#ef4444", defaultName: "Blazing Inferno",       shape: "flame",     colors: ["#ef4444", "#f97316", "#facc15", "#ffffff"], motion: "helix",    additive: true,  count: 10, size: 0.42, life: 1.00, speed: 1.6, gravity: -0.7, milestone: true },
	{ level: 51, id: "blizzard_storm",   tier: 3, icon: "🌨️", accent: "#7dd3fc", defaultName: "Blizzard Flurry",       shape: "snow",      colors: ["#ffffff", "#bae6fd", "#38bdf8"], motion: "helix",    additive: true,  count: 10, size: 0.38, life: 1.25, speed: 1.5, gravity: 0.15, spin: 4 },
	{ level: 52, id: "thunder_chain",    tier: 3, icon: "🌩️", accent: "#38bdf8", defaultName: "Thunderstorm Arcs",     shape: "bolt",      colors: ["#38bdf8", "#818cf8", "#fde047", "#ffffff"], motion: "orbit",    additive: true,  count: 9,  size: 0.42, life: 0.70, speed: 2.3, gravity: 0.2 },
	{ level: 53, id: "arcane_runes",     tier: 3, icon: "🔮", accent: "#a855f7", defaultName: "Arcane Rune Sigils",    shape: "rune",      colors: ["#c084fc", "#818cf8", "#e879f9"], motion: "rise",     additive: true,  count: 6,  size: 0.46, life: 1.20, speed: 0.85, gravity: -0.25, spin: 2 },
	{ level: 54, id: "amethyst_shards",  tier: 3, icon: "💜", accent: "#c084fc", defaultName: "Amethyst Crystals",     shape: "crystal",   colors: ["#a855f7", "#d8b4fe", "#f0abfc"], motion: "burst",    additive: true,  count: 8,  size: 0.38, life: 0.95, speed: 1.5, gravity: 1.4 },
	{ level: 55, id: "ruby_flare",       tier: 3, icon: "♦️", accent: "#f43f5e", defaultName: "Ruby Flame Gems",       shape: "crystal",   colors: ["#f43f5e", "#fb7185", "#fde047"], motion: "fountain", additive: true,  count: 9,  size: 0.38, life: 0.95, speed: 1.8, gravity: 2.0 },
	{ level: 56, id: "sapphire_mist",    tier: 3, icon: "💎", accent: "#3b82f6", defaultName: "Sapphire Ice Mist",     shape: "crystal",   colors: ["#3b82f6", "#60a5fa", "#bae6fd"], motion: "orbit",    additive: true,  count: 9,  size: 0.38, life: 1.05, speed: 1.2, gravity: 0.3 },
	{ level: 57, id: "golden_alchemy",   tier: 3, icon: "⚗️", accent: "#eab308", defaultName: "Alchemist Gold Runes",  shape: "rune",      colors: ["#facc15", "#f59e0b", "#fef08a"], motion: "helix",    additive: true,  count: 7,  size: 0.46, life: 1.15, speed: 1.1, gravity: -0.2, spin: 2.5 },
	{ level: 58, id: "shadow_flames",    tier: 3, icon: "🖤", accent: "#7c3aed", defaultName: "Shadowflame Wisps",     shape: "flame",     colors: ["#7c3aed", "#4c1d95", "#c084fc", "#1e1b4b"], motion: "rise",     additive: false, count: 9,  size: 0.42, life: 1.10, speed: 1.2, gravity: -0.55 },
	{ level: 59, id: "prismatic_gems",   tier: 3, icon: "💠", accent: "#e879f9", defaultName: "Prismatic Gem Burst",   shape: "crystal",   colors: ["#ff4d6d", "#facc15", "#4ade80", "#38bdf8", "#c084fc"], motion: "burst",    additive: true,  count: 10, size: 0.38, life: 0.95, speed: 1.7, gravity: 1.5, cycleColors: true },
	{ level: 60, id: "elemental_master", tier: 3, icon: "🌟", accent: "#38bdf8", defaultName: "Elemental Mastery",     shape: "rune",      colors: ["#ef4444", "#38bdf8", "#facc15", "#4ade80"], motion: "helix",    additive: true,  count: 9,  size: 0.46, life: 1.20, speed: 1.4, gravity: -0.2, spin: 3, milestone: true },

	// --- TIER 4: LV 61-80 (CYBER, NEON, SPOOKY & STREET) ---
	{ level: 61, id: "neon_cyan",        tier: 4, icon: "🟦", accent: "#06b6d4", defaultName: "Neon Cyan Pulse",       shape: "ring",      colors: ["#06b6d4", "#22d3ee", "#a5f3fc"], motion: "ring",     additive: true,  count: 5,  size: 0.66, life: 0.85, speed: 0.4, gravity: 0.0 },
	{ level: 62, id: "neon_magenta",     tier: 4, icon: "🟪", accent: "#ec4899", defaultName: "Neon Pink Overdrive",   shape: "star4",     colors: ["#ec4899", "#f43f5e", "#e879f9"], motion: "burst",    additive: true,  count: 10, size: 0.38, life: 0.80, speed: 1.9, gravity: 0.8 },
	{ level: 63, id: "matrix_rain",      tier: 4, icon: "🟩", accent: "#22c55e", defaultName: "Digital Matrix Bits",   shape: "pixel",     colors: ["#22c55e", "#4ade80", "#86efac", "#16a34a"], motion: "rise",     additive: true,  count: 10, size: 0.28, life: 1.05, speed: 1.3, gravity: -0.4 },
	{ level: 64, id: "glitch_step",      tier: 4, icon: "📺", accent: "#22d3ee", defaultName: "Cyber Glitch Bars",     shape: "glitch",    colors: ["#22d3ee", "#ff0055", "#ffffff", "#a855f7"], motion: "burst",    additive: true,  count: 9,  size: 0.46, life: 0.55, speed: 2.0, gravity: 0.0 },
	{ level: 65, id: "synthwave_grid",   tier: 4, icon: "🌆", accent: "#f472b6", defaultName: "Synthwave Rings",       shape: "ring",      colors: ["#ff2a85", "#00f0ff", "#ffb800"], motion: "ring",     additive: true,  count: 5,  size: 0.70, life: 0.90, speed: 0.35, gravity: 0.0, cycleColors: true },
	{ level: 66, id: "laser_shards",     tier: 4, icon: "🔺", accent: "#fb7185", defaultName: "Laser Prism Shards",    shape: "glitch",    colors: ["#ff0055", "#00f0ff", "#fde047"], motion: "fountain", additive: true,  count: 10, size: 0.40, life: 0.70, speed: 2.5, gravity: 1.2 },
	{ level: 67, id: "plasma_orbs",      tier: 4, icon: "⚡", accent: "#818cf8", defaultName: "Plasma Core Orbs",      shape: "glow",      colors: ["#818cf8", "#22d3ee", "#e879f9"], motion: "helix",    additive: true,  count: 9,  size: 0.44, life: 1.00, speed: 1.4, gravity: -0.15 },
	{ level: 68, id: "disco_beats",      tier: 4, icon: "🎧", accent: "#e879f9", defaultName: "Neon Disco Notes",      shape: "note",      colors: ["#00f0ff", "#ff2a85", "#fde047", "#4ade80"], motion: "fountain", additive: true,  count: 7,  size: 0.42, life: 1.05, speed: 1.6, gravity: 1.2, cycleColors: true },
	{ level: 69, id: "hologram_hearts",  tier: 4, icon: "💗", accent: "#f472b6", defaultName: "Holo Cyber Hearts",     shape: "heart2",    colors: ["#00f0ff", "#ff2a85", "#e879f9"], motion: "rise",     additive: true,  count: 7,  size: 0.42, life: 1.15, speed: 1.1, gravity: -0.35 },
	{ level: 70, id: "cyber_circuit",    tier: 4, icon: "🤖", accent: "#38bdf8", defaultName: "Monatium Circuitry",    shape: "rune",      colors: ["#38bdf8", "#22d3ee", "#facc15"], motion: "ring",     additive: true,  count: 6,  size: 0.56, life: 0.95, speed: 0.6, gravity: 0.0, milestone: true },
	{ level: 71, id: "spooky_ghosts",    tier: 4, icon: "👻", accent: "#e2e8f0", defaultName: "Playful Mini Ghosts",   shape: "ghost",     colors: ["#ffffff", "#e0e7ff", "#c4b5fd"], motion: "rise",     additive: false, count: 5,  size: 0.46, life: 1.35, speed: 0.95, gravity: -0.3 },
	{ level: 72, id: "vampire_bats",     tier: 4, icon: "🦇", accent: "#a855f7", defaultName: "Midnight Bats",         shape: "bat",       colors: ["#a855f7", "#6d28d9", "#f43f5e"], motion: "flutter",  additive: false, count: 6,  size: 0.46, life: 1.25, speed: 1.4, gravity: -0.35 },
	{ level: 73, id: "pumpkin_glow",     tier: 4, icon: "🎃", accent: "#f97316", defaultName: "Halloween Pumpkins",    shape: "pumpkin",   colors: ["#fb923c", "#f97316", "#facc15"], motion: "fountain", additive: false, count: 5,  size: 0.44, life: 1.10, speed: 1.5, gravity: 1.8, spin: 2 },
	{ level: 74, id: "cursed_skulls",    tier: 4, icon: "💀", accent: "#94a3b8", defaultName: "Phantom Skulls",        shape: "skull",     colors: ["#e2e8f0", "#a78bfa", "#4ade80"], motion: "rise",     additive: false, count: 5,  size: 0.42, life: 1.20, speed: 1.0, gravity: -0.25 },
	{ level: 75, id: "witch_brew",       tier: 4, icon: "🧙", accent: "#a3e635", defaultName: "Witch Cauldron Bubbles",shape: "bubble",    colors: ["#a3e635", "#c084fc", "#4ade80"], motion: "rise",     additive: true,  count: 9,  size: 0.38, life: 1.20, speed: 1.1, gravity: -0.45 },
	{ level: 76, id: "blood_moon",       tier: 4, icon: "🩸", accent: "#dc2626", defaultName: "Crimson Moon Petals",   shape: "petal",     colors: ["#dc2626", "#991b1b", "#f43f5e"], motion: "helix",    additive: true,  count: 9,  size: 0.40, life: 1.25, speed: 1.3, gravity: -0.1, spin: 3 },
	{ level: 77, id: "phantom_wisps",    tier: 4, icon: "🏮", accent: "#38bdf8", defaultName: "Spectral Lantern Wisps",shape: "flame",     colors: ["#38bdf8", "#818cf8", "#2dd4bf"], motion: "orbit",    additive: true,  count: 8,  size: 0.42, life: 1.30, speed: 1.0, gravity: -0.3 },
	{ level: 78, id: "dark_feathers",    tier: 4, icon: "🦅", accent: "#6366f1", defaultName: "Raven Shadow Feathers", shape: "feather",   colors: ["#4f46e5", "#312e81", "#a78bfa"], motion: "flutter",  additive: false, count: 7,  size: 0.44, life: 1.40, speed: 0.9, gravity: 0.25, spin: 2.5 },
	{ level: 79, id: "electro_beats",    tier: 4, icon: "⚡", accent: "#22d3ee", defaultName: "Hyper Electro Bolts",   shape: "bolt",      colors: ["#00f0ff", "#ff2a85", "#fde047"], motion: "burst",    additive: true,  count: 10, size: 0.42, life: 0.65, speed: 2.4, gravity: 0.3 },
	{ level: 80, id: "neon_cyberpunk",   tier: 4, icon: "🌃", accent: "#00f0ff", defaultName: "Cyberpunk Overdrive",   shape: "glitch",    colors: ["#00f0ff", "#ff007f", "#facc15", "#a855f7"], motion: "legend",   additive: true,  count: 9,  size: 0.46, life: 0.85, speed: 2.0, gravity: 0.1, secondaryShape: "ring", secondaryColors: ["#00f0ff", "#ff007f"], milestone: true },

	// --- TIER 5: LV 81-100 (CELESTIAL, MYTHIC & MULTI-LAYER LEGENDS) ---
	{ level: 81, id: "crescent_moon",    tier: 5, icon: "🌙", accent: "#e2e8f0", defaultName: "Silver Crescent Moons", shape: "moon",      colors: ["#f8fafc", "#cbd5e1", "#93c5fd", "#fde68a"], motion: "orbit",    additive: true,  count: 6,  size: 0.44, life: 1.30, speed: 1.1, gravity: -0.2 },
	{ level: 82, id: "solar_radiance",   tier: 5, icon: "🌞", accent: "#f59e0b", defaultName: "Radiant Sunbursts",     shape: "sun",       colors: ["#fde047", "#fb923c", "#ffffff"], motion: "legend",   additive: true,  count: 7,  size: 0.46, life: 1.05, speed: 1.4, gravity: -0.1, secondaryShape: "ring", secondaryColors: ["#facc15", "#fb923c"] },
	{ level: 83, id: "shooting_stars",   tier: 5, icon: "🌠", accent: "#fde047", defaultName: "Meteor Shower",         shape: "star5",     colors: ["#fde047", "#7dd3fc", "#ffffff", "#f9a8d4"], motion: "legend",   additive: true,  count: 9,  size: 0.42, life: 0.95, speed: 2.2, gravity: 1.2, secondaryShape: "glow", secondaryColors: ["#ffffff", "#bae6fd"] },
	{ level: 84, id: "starlight_helix",  tier: 5, icon: "✨", accent: "#93c5fd", defaultName: "Constellation Helix",   shape: "star4",     colors: ["#93c5fd", "#e0e7ff", "#fde047", "#c4b5fd"], motion: "helix",    additive: true,  count: 11, size: 0.38, life: 1.25, speed: 1.4, gravity: -0.15 },
	{ level: 85, id: "cosmic_nebula",    tier: 5, icon: "🌌", accent: "#a855f7", defaultName: "Cosmic Nebula Swirl",   shape: "galaxy",    colors: ["#c084fc", "#38bdf8", "#f472b6", "#818cf8"], motion: "legend",   additive: true,  count: 7,  size: 0.52, life: 1.30, speed: 1.0, gravity: -0.15, spin: 3.5, secondaryShape: "star4", secondaryColors: ["#ffffff", "#fde047"] },
	{ level: 86, id: "aurora_borealis",  tier: 5, icon: "🌈", accent: "#2dd4bf", defaultName: "Aurora Borealis",       shape: "glow",      colors: ["#2dd4bf", "#4ade80", "#38bdf8", "#a855f7"], motion: "legend",   additive: true,  count: 10, size: 0.50, life: 1.35, speed: 1.0, gravity: -0.3, cycleColors: true, secondaryShape: "star4", secondaryColors: ["#a7f3d0", "#bae6fd"] },
	{ level: 87, id: "celestial_wings",  tier: 5, icon: "👼", accent: "#fef08a", defaultName: "Seraph Gold Feathers",  shape: "feather",   colors: ["#fef08a", "#ffffff", "#fde047", "#bae6fd"], motion: "legend",   additive: true,  count: 8,  size: 0.46, life: 1.45, speed: 0.9, gravity: 0.15, spin: 2, secondaryShape: "ring", secondaryColors: ["#fde047", "#ffffff"] },
	{ level: 88, id: "dragon_fire",      tier: 5, icon: "🐉", accent: "#f97316", defaultName: "Dragonbreath Embers",   shape: "flame",     colors: ["#ff4500", "#f97316", "#facc15", "#ff0055"], motion: "legend",   additive: true,  count: 11, size: 0.46, life: 1.05, speed: 1.8, gravity: -0.7, secondaryShape: "star4", secondaryColors: ["#fde047", "#ff8800"] },
	{ level: 89, id: "void_rift",        tier: 5, icon: "🕳️", accent: "#7c3aed", defaultName: "Abyssal Void Rift",     shape: "galaxy",    colors: ["#7c3aed", "#4c1d95", "#e879f9", "#1e1b4b"], motion: "legend",   additive: true,  count: 8,  size: 0.54, life: 1.25, speed: 1.1, gravity: 0.0, spin: 5, secondaryShape: "rune", secondaryColors: ["#c084fc", "#f472b6"] },
	{ level: 90, id: "lunar_eclipse",    tier: 5, icon: "🌑", accent: "#c084fc", defaultName: "Lunar Eclipse Halo",    shape: "moon",      colors: ["#c084fc", "#fde047", "#818cf8", "#ffffff"], motion: "legend",   additive: true,  count: 8,  size: 0.48, life: 1.35, speed: 1.2, gravity: -0.2, secondaryShape: "ring", secondaryColors: ["#fde047", "#a855f7"], milestone: true },
	{ level: 91, id: "sakura_tempest",   tier: 5, icon: "🌸", accent: "#f472b6", defaultName: "Mythic Sakura Tempest", shape: "petal",     colors: ["#fbcfe8", "#f472b6", "#fda4af", "#ffffff"], motion: "legend",   additive: false, count: 10, size: 0.44, life: 1.45, speed: 1.4, gravity: 0.2, spin: 4, secondaryShape: "star4", secondaryColors: ["#fbcfe8", "#fde047"] },
	{ level: 92, id: "frost_monarch",    tier: 5, icon: "❄️", accent: "#38bdf8", defaultName: "Frost Monarch Diamonds",shape: "snow",      colors: ["#e0f2fe", "#38bdf8", "#818cf8", "#ffffff"], motion: "legend",   additive: true,  count: 10, size: 0.44, life: 1.35, speed: 1.3, gravity: 0.1, spin: 3, secondaryShape: "crystal", secondaryColors: ["#7dd3fc", "#ffffff"] },
	{ level: 93, id: "thunder_emperor",  tier: 5, icon: "⚡", accent: "#fde047", defaultName: "Thunder Emperor Storm", shape: "bolt",      colors: ["#fde047", "#38bdf8", "#ffffff", "#c084fc"], motion: "legend",   additive: true,  count: 10, size: 0.46, life: 0.80, speed: 2.5, gravity: 0.2, secondaryShape: "ring", secondaryColors: ["#38bdf8", "#fde047"] },
	{ level: 94, id: "valkyrie_bloom",   tier: 5, icon: "🌹", accent: "#fb7185", defaultName: "Valkyrie Rose & Gold",  shape: "petal",     colors: ["#f43f5e", "#fb7185", "#fde047"], motion: "legend",   additive: false, count: 9,  size: 0.44, life: 1.35, speed: 1.3, gravity: 0.2, spin: 3.5, secondaryShape: "feather", secondaryColors: ["#fde047", "#ffffff"] },
	{ level: 95, id: "phoenix_rebirth",  tier: 5, icon: "🔥", accent: "#fb923c", defaultName: "Phoenix Flame & Plumes",shape: "feather",   colors: ["#ff4500", "#fb923c", "#fde047", "#ff0055"], motion: "legend",   additive: true,  count: 10, size: 0.48, life: 1.35, speed: 1.5, gravity: -0.45, spin: 3, secondaryShape: "flame", secondaryColors: ["#f97316", "#fde047"], milestone: true },
	{ level: 96, id: "star_empress",     tier: 5, icon: "👑", accent: "#facc15", defaultName: "Starlight Crown & Moon",shape: "crown",     colors: ["#fde047", "#f59e0b", "#f472b6", "#ffffff"], motion: "legend",   additive: true,  count: 7,  size: 0.46, life: 1.30, speed: 1.2, gravity: -0.25, secondaryShape: "moon", secondaryColors: ["#bae6fd", "#fde047"] },
	{ level: 97, id: "chrono_runes",     tier: 5, icon: "⏳", accent: "#38bdf8", defaultName: "Chrono Time Sigils",    shape: "rune",      colors: ["#38bdf8", "#fde047", "#c084fc", "#ffffff"], motion: "legend",   additive: true,  count: 8,  size: 0.50, life: 1.35, speed: 1.1, gravity: -0.15, spin: 3.5, secondaryShape: "ring", secondaryColors: ["#38bdf8", "#fde047"] },
	{ level: 98, id: "prism_supernova",  tier: 5, icon: "💥", accent: "#ec4899", defaultName: "Supernova Rainbow Ring",shape: "galaxy",    colors: ["#ff0055", "#ff8800", "#ffd700", "#00ff88", "#00d4ff", "#b347ff"], motion: "legend",   additive: true,  count: 10, size: 0.52, life: 1.25, speed: 1.7, gravity: 0.0, spin: 4.5, cycleColors: true, secondaryShape: "ring", secondaryColors: ["#ff0055", "#00d4ff", "#ffd700"] },
	{ level: 99, id: "galactic_warp",    tier: 5, icon: "🚀", accent: "#60a5fa", defaultName: "Galactic Warp Trail",   shape: "star5",     colors: ["#38bdf8", "#818cf8", "#f472b6", "#ffffff"], motion: "legend",   additive: true,  count: 11, size: 0.46, life: 1.20, speed: 2.1, gravity: -0.2, secondaryShape: "galaxy", secondaryColors: ["#60a5fa", "#c084fc"] },
	{ level: 100, id: "speaki_royalty",  tier: 5, icon: "👑", accent: "#ffd700", defaultName: "Royal Speaki Finale",   shape: "crown",     colors: ["#ffd700", "#ff5c8a", "#00f0ff", "#a855f7", "#ffffff"], motion: "legend",   additive: true,  count: 11, size: 0.52, life: 1.45, speed: 1.5, gravity: -0.3, cycleColors: true, secondaryShape: "star5", secondaryColors: ["#ffd700", "#ff5c8a", "#00f0ff"], milestone: true }
];

const SPKMOD_SPARKS_BY_ID = new Map();
const SPKMOD_SPARKS_BY_LEVEL = new Map();
const SPKMOD_SPARK_ID_TO_CODE = new Map();
const SPKMOD_SPARK_CODE_TO_ID = new Map();

SPKMOD_SPARK_CATALOG.forEach((sp, idx) => {
	const code = idx + 1;
	sp.code = code;
	SPKMOD_SPARKS_BY_ID.set(sp.id, sp);
	SPKMOD_SPARKS_BY_LEVEL.set(sp.level, sp);
	SPKMOD_SPARK_ID_TO_CODE.set(sp.id, code);
	SPKMOD_SPARK_CODE_TO_ID.set(code, sp.id);
});

function spkmodSparkIdToCode(sparkId) {
	if (!sparkId || sparkId === "none" || sparkId === "off") return 0;
	const key = String(sparkId).trim().toLowerCase();
	if (SPKMOD_SPARK_ID_TO_CODE.has(key)) return SPKMOD_SPARK_ID_TO_CODE.get(key);
	if (/^\d+$/.test(key)) {
		const n = Number(key);
		if (SPKMOD_SPARK_CODE_TO_ID.has(n)) return n;
	}
	return 0;
}

function spkmodSparkCodeToId(code) {
	const n = Number(code);
	if (!Number.isInteger(n) || n <= 0) return "none";
	return SPKMOD_SPARK_CODE_TO_ID.get(n) || null;
}

if (typeof window !== "undefined") {
	window.spkmodSparkIdToCode = spkmodSparkIdToCode;
	window.spkmodSparkCodeToId = spkmodSparkCodeToId;
}

// ============================================================================
// 3. SETTINGS, LEVEL UNLOCKS & LEGACY STEP-TRAIL MIGRATION
// ============================================================================
const _spkSavedSparkEquippedRaw = (typeof window !== "undefined" && window.localStorage)
	? localStorage.getItem(SPKMOD_SPARK_STORAGE_KEYS.equipped)
	: null;
const _spkSavedSparkTrailOn = (typeof window !== "undefined" && window.localStorage)
	? localStorage.getItem(SPKMOD_SPARK_STORAGE_KEYS.trailActive) === "true"
	: false;
const _spkInitSparkId = (_spkSavedSparkTrailOn && _spkSavedSparkEquippedRaw && SPKMOD_SPARKS_BY_ID.has(_spkSavedSparkEquippedRaw))
	? _spkSavedSparkEquippedRaw
	: (_spkSavedSparkTrailOn ? "stars" : null);

window.spkmodSparkSettings = {
	enabled: (typeof window !== "undefined" && window.localStorage)
		? localStorage.getItem(SPKMOD_SPARK_STORAGE_KEYS.enabled) !== "false"
		: (window.spkmodSparksSystemEnabled !== false),
	equippedId: _spkInitSparkId,
	lastSelectedId: (_spkSavedSparkEquippedRaw && SPKMOD_SPARKS_BY_ID.has(_spkSavedSparkEquippedRaw)) ? _spkSavedSparkEquippedRaw : "stars",
	showRemoteSparks: (typeof window !== "undefined" && window.localStorage)
		? localStorage.getItem(SPKMOD_SPARK_STORAGE_KEYS.showRemote) !== "false"
		: true,
	shareInChat: (typeof window !== "undefined" && window.localStorage)
		? localStorage.getItem(SPKMOD_SPARK_STORAGE_KEYS.shareInChat) !== "false"
		: true,
	favorites: spkmodLoadSparkFavorites(),
	unlockAllTest: (typeof window !== "undefined" && window.localStorage)
		? localStorage.getItem(SPKMOD_SPARK_STORAGE_KEYS.unlockAll) === "true"
		: false
};
window.spkmodSparksSystemEnabled = window.spkmodSparkSettings.enabled !== false;

// Backward-compatible state bridge for legacy scripts / slash commands
window.spkmodStepTrail = {
	get enabled() { return !!(spkmodIsSparksSystemEnabled() && window.spkmodSparkSettings.equippedId); },
	set enabled(v) {
		if (v) {
			spkmodEquipLocalSpark(window.spkmodSparkSettings.equippedId || window.spkmodSparkSettings.lastSelectedId || "stars", true, true);
		} else {
			spkmodEquipLocalSpark(null, true, true);
		}
	},
	get type() { return window.spkmodSparkSettings.equippedId || window.spkmodSparkSettings.lastSelectedId || "stars"; },
	set type(v) {
		if (v && SPKMOD_SPARKS_BY_ID.has(v)) window.spkmodSparkSettings.lastSelectedId = v;
	}
};

function spkmodIsSparksSystemEnabled() {
	return window.spkmodSparkSettings.enabled !== false && window.spkmodSparksSystemEnabled !== false;
}

function spkmodIsSparkChatSharingEnabled() {
	return spkmodIsSparksSystemEnabled() && window.spkmodSparkSettings.shareInChat !== false;
}

function spkmodGetSparkPlayerLevel() {
	if (typeof gameState !== "undefined" && gameState?.myStat?.level) {
		return Number(gameState.myStat.level) || 1;
	}
	return 1;
}

function spkmodIsSparkLegitimatelyUnlocked(spark) {
	if (!spark) return false;
	return spkmodGetSparkPlayerLevel() >= spark.level;
}

function spkmodIsSparkUnlocked(spark) {
	if (!spark) return false;
	if (window.spkmodSparkSettings.unlockAllTest) return true;
	return spkmodGetSparkPlayerLevel() >= spark.level;
}

function spkmodCheckSparkRemoteLevelAllowed(requiredLevel, remoteLevel, senderName) {
	if (!requiredLevel || requiredLevel <= 1) return true;
	if (senderName && typeof spkmodIsVipUser === "function" && spkmodIsVipUser(senderName)) {
		return true;
	}
	const lvl = Number(remoteLevel);
	if (!isFinite(lvl) || lvl <= 0) return false;
	return lvl >= requiredLevel;
}

function spkmodIsSparkFavorite(sparkId) {
	const favs = window.spkmodSparkSettings?.favorites;
	return !!(favs && typeof favs.has === "function" && favs.has(sparkId));
}

function spkmodToggleSparkFavorite(sparkId) {
	if (!sparkId || !SPKMOD_SPARKS_BY_ID.has(sparkId)) return false;
	if (!(window.spkmodSparkSettings.favorites instanceof Set)) {
		window.spkmodSparkSettings.favorites = spkmodLoadSparkFavorites();
	}
	const favs = window.spkmodSparkSettings.favorites;
	const nowFav = !favs.has(sparkId);
	if (nowFav) favs.add(sparkId);
	else favs.delete(sparkId);
	spkmodSaveSparkFavorites(favs);
	return nowFav;
}

function spkmodGetSparkDisplayName(spark) {
	if (!spark) return spkmodGetSparkUiText("noneEquipped");
	const lang = spkmodGetSparkActiveLang();
	const tr = typeof spkmodTranslations !== "undefined" ? spkmodTranslations : null;
	return (tr && tr[lang] && tr[lang].sparkNames && tr[lang].sparkNames[spark.id])
		|| (tr && tr.en && tr.en.sparkNames && tr.en.sparkNames[spark.id])
		|| spark.defaultName
		|| spark.id;
}

// ============================================================================
// 4. PROCEDURAL CANVAS2D SPRITE ATLAS (32 CRISP VECTOR SHAPES, ZERO NETWORK)
// ============================================================================
const _spkmodSparkShapeTextures = new Map();

function spkmodDrawSparkShape(ctx, shape, s) {
	const cx = s / 2;
	const cy = s / 2;
	const r = s * 0.42;
	ctx.clearRect(0, 0, s, s);
	ctx.save();
	ctx.translate(cx, cy);
	ctx.fillStyle = "#ffffff";
	ctx.strokeStyle = "#ffffff";
	ctx.lineCap = "round";
	ctx.lineJoin = "round";

	const drawStar = (pts, outerR, innerR) => {
		ctx.beginPath();
		for (let i = 0; i < pts * 2; i++) {
			const rad = i % 2 === 0 ? outerR : innerR;
			const ang = (i * Math.PI) / pts - Math.PI / 2;
			const x = Math.cos(ang) * rad;
			const y = Math.sin(ang) * rad;
			if (i === 0) ctx.moveTo(x, y);
			else ctx.lineTo(x, y);
		}
		ctx.closePath();
		ctx.fill();
	};

	const drawHeartPath = (scale, ox = 0, oy = 0) => {
		ctx.beginPath();
		ctx.moveTo(ox, oy + 0.72 * scale);
		ctx.bezierCurveTo(ox - 1.1 * scale, oy + 0.05 * scale, ox - 0.95 * scale, oy - 0.85 * scale, ox, oy - 0.30 * scale);
		ctx.bezierCurveTo(ox + 0.95 * scale, oy - 0.85 * scale, ox + 1.1 * scale, oy + 0.05 * scale, ox, oy + 0.72 * scale);
		ctx.closePath();
	};

	switch (shape) {
		case "star4": {
			const g = ctx.createRadialGradient(0, 0, 1, 0, 0, r * 0.9);
			g.addColorStop(0, "rgba(255,255,255,1)");
			g.addColorStop(0.55, "rgba(255,255,255,0.65)");
			g.addColorStop(1, "rgba(255,255,255,0)");
			ctx.fillStyle = g;
			ctx.beginPath();
			ctx.arc(0, 0, r * 0.9, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = "#ffffff";
			drawStar(4, r, r * 0.22);
			break;
		}
		case "star5":
			drawStar(5, r, r * 0.44);
			break;
		case "heart":
			drawHeartPath(r * 0.92);
			ctx.fill();
			ctx.lineWidth = s * 0.04;
			ctx.strokeStyle = "rgba(255,255,255,0.85)";
			ctx.stroke();
			break;
		case "heart2":
			drawHeartPath(r * 0.65, -r * 0.28, -r * 0.14);
			ctx.fill();
			ctx.globalAlpha = 0.85;
			drawHeartPath(r * 0.65, r * 0.28, r * 0.22);
			ctx.fill();
			break;
		case "glow": {
			const g = ctx.createRadialGradient(0, 0, 1, 0, 0, r);
			g.addColorStop(0, "rgba(255,255,255,1)");
			g.addColorStop(0.35, "rgba(255,255,255,0.72)");
			g.addColorStop(1, "rgba(255,255,255,0)");
			ctx.fillStyle = g;
			ctx.beginPath();
			ctx.arc(0, 0, r, 0, Math.PI * 2);
			ctx.fill();
			break;
		}
		case "ring": {
			ctx.lineWidth = s * 0.085;
			ctx.beginPath();
			ctx.arc(0, 0, r * 0.84, 0, Math.PI * 2);
			ctx.stroke();
			ctx.globalAlpha = 0.35;
			ctx.lineWidth = s * 0.15;
			ctx.stroke();
			break;
		}
		case "petal":
			ctx.beginPath();
			ctx.moveTo(0, r * 0.9);
			ctx.bezierCurveTo(-r * 0.85, r * 0.3, -r * 0.75, -r * 0.85, 0, -r * 0.55);
			ctx.bezierCurveTo(r * 0.75, -r * 0.85, r * 0.85, r * 0.3, 0, r * 0.9);
			ctx.closePath();
			ctx.fill();
			break;
		case "leaf":
			ctx.beginPath();
			ctx.moveTo(0, r * 0.95);
			ctx.quadraticCurveTo(-r * 0.85, 0, 0, -r * 0.95);
			ctx.quadraticCurveTo(r * 0.85, 0, 0, r * 0.95);
			ctx.fill();
			ctx.strokeStyle = "rgba(0,0,0,0.22)";
			ctx.lineWidth = s * 0.04;
			ctx.beginPath();
			ctx.moveTo(0, r * 0.85);
			ctx.lineTo(0, -r * 0.7);
			ctx.stroke();
			break;
		case "maple":
			ctx.beginPath();
			ctx.moveTo(0, -r);
			ctx.lineTo(r * 0.22, -r * 0.35);
			ctx.lineTo(r * 0.88, -r * 0.45);
			ctx.lineTo(r * 0.42, 0.05 * r);
			ctx.lineTo(r * 0.72, r * 0.52);
			ctx.lineTo(r * 0.14, r * 0.38);
			ctx.lineTo(0, r * 0.95);
			ctx.lineTo(-r * 0.14, r * 0.38);
			ctx.lineTo(-r * 0.72, r * 0.52);
			ctx.lineTo(-r * 0.42, 0.05 * r);
			ctx.lineTo(-r * 0.88, -r * 0.45);
			ctx.lineTo(-r * 0.22, -r * 0.35);
			ctx.closePath();
			ctx.fill();
			break;
		case "clover":
			for (let i = 0; i < 4; i++) {
				ctx.save();
				ctx.rotate((i * Math.PI) / 2);
				ctx.beginPath();
				ctx.arc(0, -r * 0.44, r * 0.38, 0, Math.PI * 2);
				ctx.fill();
				ctx.restore();
			}
			break;
		case "snow":
			ctx.lineWidth = s * 0.06;
			for (let i = 0; i < 6; i++) {
				ctx.save();
				ctx.rotate((i * Math.PI) / 3);
				ctx.beginPath();
				ctx.moveTo(0, 0);
				ctx.lineTo(0, -r * 0.92);
				ctx.moveTo(0, -r * 0.5);
				ctx.lineTo(-r * 0.24, -r * 0.72);
				ctx.moveTo(0, -r * 0.5);
				ctx.lineTo(r * 0.24, -r * 0.72);
				ctx.stroke();
				ctx.restore();
			}
			break;
		case "crystal":
			ctx.beginPath();
			ctx.moveTo(0, -r);
			ctx.lineTo(r * 0.55, 0);
			ctx.lineTo(0, r);
			ctx.lineTo(-r * 0.55, 0);
			ctx.closePath();
			ctx.fill();
			ctx.fillStyle = "rgba(255,255,255,0.5)";
			ctx.beginPath();
			ctx.moveTo(0, -r * 0.65);
			ctx.lineTo(r * 0.28, 0);
			ctx.lineTo(0, r * 0.65);
			ctx.lineTo(-r * 0.28, 0);
			ctx.closePath();
			ctx.fill();
			break;
		case "flame":
			ctx.beginPath();
			ctx.moveTo(0, -r);
			ctx.bezierCurveTo(r * 0.72, -r * 0.15, r * 0.78, r * 0.85, 0, r * 0.92);
			ctx.bezierCurveTo(-r * 0.78, r * 0.85, -r * 0.72, -r * 0.15, 0, -r);
			ctx.closePath();
			ctx.fill();
			break;
		case "bolt":
			ctx.beginPath();
			ctx.moveTo(r * 0.18, -r);
			ctx.lineTo(-r * 0.45, r * 0.06);
			ctx.lineTo(r * 0.05, r * 0.06);
			ctx.lineTo(-r * 0.22, r);
			ctx.lineTo(r * 0.52, -r * 0.12);
			ctx.lineTo(0, -r * 0.12);
			ctx.closePath();
			ctx.fill();
			break;
		case "bubble": {
			const g = ctx.createRadialGradient(-r * 0.25, -r * 0.25, r * 0.05, 0, 0, r);
			g.addColorStop(0, "rgba(255,255,255,0.92)");
			g.addColorStop(0.28, "rgba(255,255,255,0.22)");
			g.addColorStop(0.78, "rgba(255,255,255,0.38)");
			g.addColorStop(1, "rgba(255,255,255,0.88)");
			ctx.fillStyle = g;
			ctx.beginPath();
			ctx.arc(0, 0, r * 0.92, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = "#ffffff";
			ctx.beginPath();
			ctx.ellipse(-r * 0.34, -r * 0.34, r * 0.20, r * 0.11, -Math.PI / 4, 0, Math.PI * 2);
			ctx.fill();
			break;
		}
		case "drop":
			ctx.beginPath();
			ctx.moveTo(0, -r * 0.95);
			ctx.bezierCurveTo(r * 0.65, r * 0.05, r * 0.65, r * 0.92, 0, r * 0.92);
			ctx.bezierCurveTo(-r * 0.65, r * 0.92, -r * 0.65, r * 0.05, 0, -r * 0.95);
			ctx.closePath();
			ctx.fill();
			break;
		case "note":
			ctx.beginPath();
			ctx.ellipse(-r * 0.22, r * 0.45, r * 0.34, r * 0.24, -0.35, 0, Math.PI * 2);
			ctx.fill();
			ctx.lineWidth = s * 0.085;
			ctx.beginPath();
			ctx.moveTo(r * 0.06, r * 0.38);
			ctx.lineTo(r * 0.06, -r * 0.80);
			ctx.quadraticCurveTo(r * 0.62, -r * 0.60, r * 0.46, -r * 0.08);
			ctx.stroke();
			break;
		case "paw":
			ctx.beginPath();
			ctx.ellipse(0, r * 0.30, r * 0.46, r * 0.34, 0, 0, Math.PI * 2);
			ctx.fill();
			for (const [px, py] of [[-0.55, -0.18], [-0.20, -0.50], [0.20, -0.50], [0.55, -0.18]]) {
				ctx.beginPath();
				ctx.arc(px * r, py * r, r * 0.20, 0, Math.PI * 2);
				ctx.fill();
			}
			break;
		case "moon":
			ctx.beginPath();
			ctx.arc(0, 0, r * 0.88, 0.3, Math.PI * 2 - 0.3);
			ctx.arc(r * 0.34, -r * 0.14, r * 0.66, Math.PI * 2 - 0.55, 0.55, true);
			ctx.closePath();
			ctx.fill();
			break;
		case "sun":
			ctx.beginPath();
			ctx.arc(0, 0, r * 0.46, 0, Math.PI * 2);
			ctx.fill();
			drawStar(8, r, r * 0.52);
			break;
		case "crown":
			ctx.beginPath();
			ctx.moveTo(-r * 0.82, r * 0.62);
			ctx.lineTo(-r * 0.90, -r * 0.45);
			ctx.lineTo(-r * 0.34, r * 0.08);
			ctx.lineTo(0, -r * 0.72);
			ctx.lineTo(r * 0.34, r * 0.08);
			ctx.lineTo(r * 0.90, -r * 0.45);
			ctx.lineTo(r * 0.82, r * 0.62);
			ctx.closePath();
			ctx.fill();
			break;
		case "butterfly":
			for (const dir of [-1, 1]) {
				ctx.beginPath();
				ctx.ellipse(dir * r * 0.45, -r * 0.22, r * 0.46, r * 0.32, dir * -0.45, 0, Math.PI * 2);
				ctx.fill();
				ctx.beginPath();
				ctx.ellipse(dir * r * 0.36, r * 0.32, r * 0.34, r * 0.24, dir * 0.45, 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.fillRect(-r * 0.07, -r * 0.45, r * 0.14, r * 0.9);
			break;
		case "bat":
			ctx.beginPath();
			ctx.moveTo(0, -r * 0.25);
			ctx.quadraticCurveTo(r * 0.55, -r * 0.85, r * 0.98, -r * 0.15);
			ctx.quadraticCurveTo(r * 0.68, r * 0.12, r * 0.46, r * 0.48);
			ctx.quadraticCurveTo(r * 0.22, r * 0.18, 0, r * 0.45);
			ctx.quadraticCurveTo(-r * 0.22, r * 0.18, -r * 0.46, r * 0.48);
			ctx.quadraticCurveTo(-r * 0.68, r * 0.12, -r * 0.98, -r * 0.15);
			ctx.quadraticCurveTo(-r * 0.55, -r * 0.85, 0, -r * 0.25);
			ctx.closePath();
			ctx.fill();
			break;
		case "ghost":
			ctx.beginPath();
			ctx.arc(0, -r * 0.18, r * 0.66, Math.PI, 0);
			ctx.lineTo(r * 0.66, r * 0.72);
			ctx.lineTo(r * 0.33, r * 0.48);
			ctx.lineTo(0, r * 0.72);
			ctx.lineTo(-r * 0.33, r * 0.48);
			ctx.lineTo(-r * 0.66, r * 0.72);
			ctx.closePath();
			ctx.fill();
			ctx.fillStyle = "rgba(15,23,42,0.85)";
			ctx.beginPath();
			ctx.arc(-r * 0.22, -r * 0.18, r * 0.12, 0, Math.PI * 2);
			ctx.arc(r * 0.22, -r * 0.18, r * 0.12, 0, Math.PI * 2);
			ctx.fill();
			break;
		case "skull":
			ctx.beginPath();
			ctx.arc(0, -r * 0.15, r * 0.66, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillRect(-r * 0.36, r * 0.32, r * 0.72, r * 0.42);
			ctx.fillStyle = "rgba(15,23,42,0.9)";
			ctx.beginPath();
			ctx.arc(-r * 0.24, -r * 0.12, r * 0.18, 0, Math.PI * 2);
			ctx.arc(r * 0.24, -r * 0.12, r * 0.18, 0, Math.PI * 2);
			ctx.fill();
			break;
		case "pumpkin":
			ctx.beginPath();
			ctx.ellipse(0, r * 0.10, r * 0.84, r * 0.66, 0, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillRect(-r * 0.12, -r * 0.85, r * 0.24, r * 0.36);
			ctx.fillStyle = "rgba(255,245,150,0.95)";
			ctx.beginPath();
			ctx.moveTo(-r * 0.36, -r * 0.08);
			ctx.lineTo(-r * 0.16, r * 0.08);
			ctx.lineTo(-r * 0.42, r * 0.12);
			ctx.closePath();
			ctx.fill();
			ctx.beginPath();
			ctx.moveTo(r * 0.36, -r * 0.08);
			ctx.lineTo(r * 0.16, r * 0.08);
			ctx.lineTo(r * 0.42, r * 0.12);
			ctx.closePath();
			ctx.fill();
			break;
		case "candy":
			ctx.beginPath();
			ctx.arc(0, 0, r * 0.50, 0, Math.PI * 2);
			ctx.fill();
			for (const dir of [-1, 1]) {
				ctx.beginPath();
				ctx.moveTo(dir * r * 0.44, 0);
				ctx.lineTo(dir * r * 0.94, -r * 0.42);
				ctx.lineTo(dir * r * 0.94, r * 0.42);
				ctx.closePath();
				ctx.fill();
			}
			break;
		case "feather":
			ctx.beginPath();
			ctx.moveTo(-r * 0.72, r * 0.82);
			ctx.quadraticCurveTo(-r * 0.45, -r * 0.65, r * 0.82, -r * 0.82);
			ctx.quadraticCurveTo(r * 0.55, r * 0.45, -r * 0.72, r * 0.82);
			ctx.closePath();
			ctx.fill();
			break;
		case "rune":
			ctx.lineWidth = s * 0.06;
			ctx.beginPath();
			ctx.arc(0, 0, r * 0.86, 0, Math.PI * 2);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(0, -r * 0.84);
			ctx.lineTo(r * 0.62, 0);
			ctx.lineTo(0, r * 0.84);
			ctx.lineTo(-r * 0.62, 0);
			ctx.closePath();
			ctx.stroke();
			drawStar(4, r * 0.44, r * 0.14);
			break;
		case "pixel":
			ctx.fillRect(-r * 0.66, -r * 0.66, r * 1.32, r * 1.32);
			break;
		case "glitch":
			ctx.fillRect(-r * 0.95, -r * 0.24, r * 1.90, r * 0.24);
			ctx.globalAlpha = 0.75;
			ctx.fillRect(-r * 0.60, r * 0.14, r * 1.45, r * 0.18);
			break;
		case "galaxy":
			ctx.lineWidth = s * 0.075;
			for (let arm = 0; arm < 3; arm++) {
				ctx.save();
				ctx.rotate((arm * Math.PI * 2) / 3);
				ctx.beginPath();
				for (let t = 0; t <= 16; t++) {
					const frac = t / 16;
					const ang = frac * 2.4;
					const rad = frac * r * 0.92;
					const x = Math.cos(ang) * rad;
					const y = Math.sin(ang) * rad;
					if (t === 0) ctx.moveTo(x, y);
					else ctx.lineTo(x, y);
				}
				ctx.stroke();
				ctx.restore();
			}
			ctx.beginPath();
			ctx.arc(0, 0, r * 0.24, 0, Math.PI * 2);
			ctx.fill();
			break;
		default:
			drawStar(4, r, r * 0.25);
			break;
	}
	ctx.restore();
}

function spkmodGetSparkShapeTexture(shape) {
	if (_spkmodSparkShapeTextures.has(shape)) return _spkmodSparkShapeTextures.get(shape);
	const T = typeof window !== "undefined" ? window.THREE : null;
	if (!T || !T.CanvasTexture || typeof document === "undefined") return null;

	const canvas = document.createElement("canvas");
	canvas.width = 64;
	canvas.height = 64;
	const ctx = canvas.getContext("2d");
	if (!ctx) return null;
	spkmodDrawSparkShape(ctx, shape, 64);

	const tex = new T.CanvasTexture(canvas);
	if (T.SRGBColorSpace !== undefined) tex.colorSpace = T.SRGBColorSpace;
	tex.needsUpdate = true;
	_spkmodSparkShapeTextures.set(shape, tex);
	return tex;
}

// ============================================================================
// 5. POOLED 3D PARTICLE ENGINE (360-PARTICLE CAP, ZERO GC SPIKES)
// ============================================================================
const SPKMOD_SPARK_MAX_PARTICLES = 360;
const SPKMOD_SPARK_REMOTE_MAX_DIST = 48;
const _spkmodActiveSparkParticles = [];
let _spkmodSparkColorCycleIdx = 0;

function spkmodRemoveSparkParticleAt(idx) {
	const p = _spkmodActiveSparkParticles[idx];
	if (!p) return;
	if (p.sprite && p.sprite.parent) p.sprite.parent.remove(p.sprite);
	if (p.sprite && p.sprite.material && typeof p.sprite.material.dispose === "function") {
		try { p.sprite.material.dispose(); } catch (_) {}
	}
	const last = _spkmodActiveSparkParticles.length - 1;
	if (idx !== last) _spkmodActiveSparkParticles[idx] = _spkmodActiveSparkParticles[last];
	_spkmodActiveSparkParticles.pop();
}

function spkmodClearAllSparkParticles() {
	while (_spkmodActiveSparkParticles.length > 0) {
		spkmodRemoveSparkParticleAt(_spkmodActiveSparkParticles.length - 1);
	}
}

function spkmodSpawnSparkParticle(scene, opts) {
	const T = typeof window !== "undefined" ? window.THREE : null;
	if (!T || !T.Sprite || !T.SpriteMaterial || !scene) return;
	const tex = spkmodGetSparkShapeTexture(opts.shape || "star4");
	if (!tex) return;

	// Recycle oldest particle if at capacity
	if (_spkmodActiveSparkParticles.length >= SPKMOD_SPARK_MAX_PARTICLES) {
		let oldestIdx = 0;
		let oldestFrac = -1;
		for (let i = 0; i < _spkmodActiveSparkParticles.length; i++) {
			const frac = _spkmodActiveSparkParticles[i].age / Math.max(0.05, _spkmodActiveSparkParticles[i].life);
			if (frac > oldestFrac) {
				oldestFrac = frac;
				oldestIdx = i;
			}
		}
		spkmodRemoveSparkParticleAt(oldestIdx);
	}

	const mat = new T.SpriteMaterial({
		map: tex,
		color: opts.color || "#ffd700",
		transparent: true,
		opacity: 1,
		depthWrite: false,
		blending: opts.additive ? (T.AdditiveBlending || 2) : (T.NormalBlending || 1)
	});
	const sprite = new T.Sprite(mat);
	sprite.position.set(opts.x, opts.y, opts.z);
	sprite.scale.setScalar(opts.size || 0.35);
	sprite.renderOrder = 95;
	sprite.raycast = () => {};
	scene.add(sprite);

	_spkmodActiveSparkParticles.push({
		sprite,
		age: 0,
		life: opts.life || 0.9,
		baseSize: opts.size || 0.35,
		vx: opts.vx || 0,
		vy: opts.vy || 0,
		vz: opts.vz || 0,
		gravity: opts.gravity || 0,
		spin: opts.spin || 0,
		motion: opts.motion || "burst",
		cx: opts.cx ?? opts.x,
		cz: opts.cz ?? opts.z,
		phase: Math.random() * Math.PI * 2,
		orbitRadius: opts.orbitRadius || 0.45,
		orbitSpeed: opts.orbitSpeed || 4.0,
		growRing: !!opts.growRing
	});
}

function spkmodEmitSparkTrailAt(spark, pos, burstScale = 1.0, isRemote = false) {
	if (!spark || !pos || typeof gameState === "undefined" || !gameState?.scene) return;
	const scene = gameState.scene;
	const colors = spark.colors && spark.colors.length ? spark.colors : ["#ffd700"];

	const pickColor = () => {
		if (spark.cycleColors) {
			return colors[_spkmodSparkColorCycleIdx++ % colors.length];
		}
		return colors[Math.floor(Math.random() * colors.length)];
	};

	const baseCount = Math.max(2, Math.round((spark.count || 7) * (isRemote ? 0.6 : 1.0) * burstScale));
	const speedMul = burstScale > 1 ? 1.85 : 1.0;
	const motion = spark.motion || "burst";
	const yBase = (pos.y || 0) + 0.18;

	const emitLayer = (shape, layerColors, count, sizeMul, forceRing) => {
		for (let i = 0; i < count; i++) {
			const ang = (Math.PI * 2 * i) / Math.max(1, count) + (Math.random() - 0.5) * 0.65;
			const spd = (spark.speed || 1.2) * (0.55 + Math.random() * 0.75) * speedMul;
			const col = layerColors === colors ? pickColor() : layerColors[Math.floor(Math.random() * layerColors.length)];
			let x = pos.x + (Math.random() - 0.5) * 0.42;
			let y = yBase + Math.random() * 0.35;
			let z = pos.z + (Math.random() - 0.5) * 0.42;
			let vx = Math.cos(ang) * spd * 0.65;
			let vy = 0.5 + Math.random() * spd * 0.85;
			let vz = Math.sin(ang) * spd * 0.65;
			let growRing = false;

			if (forceRing || motion === "ring") {
				x = pos.x + (Math.random() - 0.5) * 0.16;
				y = yBase + 0.08 + i * 0.06;
				z = pos.z + (Math.random() - 0.5) * 0.16;
				vx = (Math.random() - 0.5) * 0.25;
				vy = 0.25 + Math.random() * 0.35;
				vz = (Math.random() - 0.5) * 0.25;
				growRing = true;
			} else if (motion === "rise") {
				y = yBase + Math.random() * 0.55;
				vx = (Math.random() - 0.5) * spd * 0.55;
				vy = 0.75 + Math.random() * spd * 0.9;
				vz = (Math.random() - 0.5) * spd * 0.55;
			} else if (motion === "flutter") {
				y = yBase + 0.2 + Math.random() * 0.75;
				vx = Math.cos(ang) * spd * 0.55;
				vy = 0.4 + Math.random() * 0.65;
				vz = Math.sin(ang) * spd * 0.55;
			} else if (motion === "fountain") {
				vx = Math.cos(ang) * spd * 0.7;
				vy = 1.1 + Math.random() * spd * 1.15;
				vz = Math.sin(ang) * spd * 0.7;
			} else if (motion === "helix" || motion === "orbit") {
				const r0 = 0.25 + Math.random() * 0.35;
				x = pos.x + Math.cos(ang) * r0;
				z = pos.z + Math.sin(ang) * r0;
				vy = (motion === "helix" ? 1.15 : 0.45) + Math.random() * 0.65;
				vx = 0;
				vz = 0;
			}

			spkmodSpawnSparkParticle(scene, {
				shape,
				color: col,
				additive: spark.additive !== false,
				x, y, z,
				cx: pos.x,
				cz: pos.z,
				vx, vy, vz,
				gravity: spark.gravity ?? 0.6,
				size: (spark.size || 0.36) * sizeMul * (0.82 + Math.random() * 0.36) * (burstScale > 1 ? 1.18 : 1.0),
				life: (spark.life || 0.95) * (0.8 + Math.random() * 0.4) * (burstScale > 1 ? 1.2 : 1.0),
				spin: (spark.spin || 0) * (Math.random() < 0.5 ? 1 : -1),
				motion: forceRing ? "ring" : motion,
				orbitRadius: 0.35 + Math.random() * 0.45 * (burstScale > 1 ? 1.6 : 1.0),
				orbitSpeed: (motion === "helix" ? 5.2 : 3.4) * (i % 2 === 0 ? 1 : -1),
				growRing
			});
		}
	};

	emitLayer(spark.shape, colors, baseCount, 1.0, false);

	// Multi-layer Lv.80-100 legendary combo trails!
	if (motion === "legend" && spark.secondaryShape) {
		const secCount = Math.max(2, Math.round(baseCount * 0.45));
		const secColors = spark.secondaryColors || colors;
		emitLayer(spark.secondaryShape, secColors, secCount, spark.secondaryShape === "ring" ? 1.45 : 0.85, spark.secondaryShape === "ring");
	}
}

function spkmodUpdateSparkParticles(dt) {
	for (let i = _spkmodActiveSparkParticles.length - 1; i >= 0; i--) {
		const p = _spkmodActiveSparkParticles[i];
		p.age += dt;
		const t = p.age / Math.max(0.05, p.life);
		if (t >= 1) {
			spkmodRemoveSparkParticleAt(i);
			continue;
		}
		const sp = p.sprite;
		p.vy -= p.gravity * dt;

		if (p.motion === "helix" || p.motion === "orbit") {
			const ang = p.phase + p.age * p.orbitSpeed;
			const rad = p.orbitRadius * (p.motion === "helix" ? (0.65 + t * 0.9) : (0.85 + Math.sin(t * Math.PI) * 0.4));
			sp.position.x = p.cx + Math.cos(ang) * rad;
			sp.position.z = p.cz + Math.sin(ang) * rad;
			sp.position.y += p.vy * dt;
		} else if (p.motion === "flutter") {
			sp.position.x += (p.vx + Math.sin(p.age * 5.2 + p.phase) * 0.55) * dt;
			sp.position.z += (p.vz + Math.cos(p.age * 4.7 + p.phase) * 0.55) * dt;
			sp.position.y += p.vy * dt;
		} else {
			sp.position.x += p.vx * dt;
			sp.position.y += p.vy * dt;
			sp.position.z += p.vz * dt;
		}

		if (p.spin && sp.material) {
			sp.material.rotation = (sp.material.rotation || 0) + p.spin * dt;
		}

		const alpha = t < 0.14 ? (t / 0.14) : (t > 0.62 ? Math.max(0, 1 - (t - 0.62) / 0.38) : 1);
		sp.material.opacity = alpha;
		const scaleFactor = p.growRing
			? (0.45 + t * 1.75)
			: (t < 0.18 ? (0.55 + (t / 0.18) * 0.45) : (1.0 - (t - 0.18) * 0.42));
		sp.scale.setScalar(Math.max(0.02, p.baseSize * scaleFactor));
	}
}

// ============================================================================
// 6. REMOTE SPARK FX SYNC BRIDGE (:m_...t<N>...:)
// ============================================================================
const _spkmodRemoteSparkStates = new Map(); // ownerKey -> { playerId, playerName, sparkId, lastX, lastZ, distAccum, updatedAtMs }
let _spkmodSparkHadBroadcast = false;
let _spkmodSparkNeedsZoneSync = false;
let _spkmodSparkLastObservedZoneId = null;
let _spkmodSparkLastObservedRemoteCount = 0;

window.spkmodGetActiveSparkBroadcastState = function() {
	const enabled = spkmodIsSparksSystemEnabled();
	const isTestUnlock = !!window.spkmodSparkSettings.unlockAllTest;
	const shareInChat = spkmodIsSparkChatSharingEnabled() && !isTestUnlock;
	const rawSparkId = (enabled && !isTestUnlock && window.spkmodSparkSettings.equippedId) || null;
	const sparkObj = rawSparkId ? SPKMOD_SPARKS_BY_ID.get(rawSparkId) : null;
	const sparkId = (sparkObj && spkmodIsSparkLegitimatelyUnlocked(sparkObj)) ? sparkObj.id : null;
	return {
		enabled,
		shareInChat,
		sparkId,
		hadBroadcastSpark: _spkmodSparkHadBroadcast
	};
};

window.spkmodMarkSparkBroadcastSent = function(hasSpark) {
	_spkmodSparkHadBroadcast = !!hasSpark;
	_spkmodSparkNeedsZoneSync = false;
};

function spkmodTriggerSparkSyncBroadcast(opts = {}) {
	if (!spkmodIsSparkChatSharingEnabled() || window.spkmodSparkSettings.unlockAllTest) return;
	const eqSpark = window.spkmodSparkSettings.equippedId ? SPKMOD_SPARKS_BY_ID.get(window.spkmodSparkSettings.equippedId) : null;
	const hasActive = !!(eqSpark && spkmodIsSparkLegitimatelyUnlocked(eqSpark));
	const rCount = (typeof gameState !== "undefined" && gameState?.remotePlayers?.remotePlayers?.size) || 0;
	if (hasActive && rCount === 0) {
		_spkmodSparkNeedsZoneSync = true;
	}
	if (typeof window.spkmodQueueUnifiedModSyncBroadcast === "function") {
		window.spkmodQueueUnifiedModSyncBroadcast(Object.assign({
			includeSparkState: true,
			reason: "spark_fx"
		}, opts));
	}
}

function spkmodResolveRemotePlayerForSpark(playerId, playerName) {
	if (typeof gameState === "undefined" || !gameState?.remotePlayers?.remotePlayers) return null;
	const rMap = gameState.remotePlayers.remotePlayers;
	if (playerId != null && typeof playerId !== "object") {
		const rawStr = String(playerId).trim();
		const stripped = rawStr.replace(/^(?:remote|player|user|bubble)[_:-]+/i, "");
		for (const k of [playerId, Number(playerId), rawStr, stripped, Number(stripped)]) {
			if (k === "" || (typeof k === "number" && Number.isNaN(k))) continue;
			const byId = rMap.get(k);
			if (byId) return { key: String(k), rp: byId };
		}
	}
	const lower = typeof playerName === "string" ? playerName.trim().toLowerCase() : "";
	if (lower) {
		for (const [k, rp] of rMap) {
			const rName = (rp?.info?.__spkmodOrigName || rp?.info?.name || "").trim().toLowerCase();
			if (rName && rName === lower) return { key: String(k), rp };
		}
	}
	return null;
}

window.spkmodHandleIncomingSparkState = function(playerId, playerName, sparkIdRaw) {
	if (playerId != null && typeof playerId === "object") {
		if (!playerName) playerName = playerId.info?.__spkmodOrigName || playerId.info?.name || playerId.name || "";
		playerId = playerId.info?.playerId ?? playerId.info?.id ?? playerId.playerId ?? playerId.id ?? null;
	}
	let cleanName = typeof playerName === "string" ? playerName.trim() : "";
	let cleanId = (playerId != null && String(playerId).trim() !== "") ? playerId : null;

	const resolved = spkmodResolveRemotePlayerForSpark(cleanId, cleanName);
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

	for (const [k, st] of [..._spkmodRemoteSparkStates.entries()]) {
		if (k === ownerKey || !st) continue;
		const stLower = (st.playerName || "").trim().toLowerCase();
		if ((lowerName && stLower && stLower === lowerName) || (cleanId != null && st.playerId != null && String(st.playerId) === String(cleanId))) {
			_spkmodRemoteSparkStates.delete(k);
		}
	}

	const norm = (!sparkIdRaw || sparkIdRaw === "none" || sparkIdRaw === "off") ? null : String(sparkIdRaw).trim().toLowerCase();
	const validId = (norm && SPKMOD_SPARKS_BY_ID.has(norm)) ? norm : null;

	if (!validId) {
		_spkmodRemoteSparkStates.delete(ownerKey);
	} else {
		_spkmodRemoteSparkStates.set(ownerKey, {
			playerId: cleanId,
			playerName: cleanName,
			sparkId: validId,
			lastX: null,
			lastZ: null,
			distAccum: 0,
			updatedAtMs: Date.now()
		});
	}
};

// ============================================================================
// 7. MASTER ANIMATION LOOP (LOCAL + REMOTE WALKING TRAILS & PARTICLES)
// ============================================================================
let _spkmodSparkLoopRafId = null;
let _spkmodSparkLoopLastMs = 0;
let _spkmodLocalSparkLastX = null;
let _spkmodLocalSparkLastZ = null;
let _spkmodLocalSparkDistAccum = 0;
let _spkmodSparkLastSyncCheckMs = 0;

function spkmodSparksMasterLoop(nowMs) {
	_spkmodSparkLoopRafId = null;
	if (!spkmodIsSparksSystemEnabled()) return;

	const dt = Math.min(0.08, Math.max(0.001, (nowMs - _spkmodSparkLoopLastMs) / 1000));
	_spkmodSparkLoopLastMs = nowMs;

	if (!document.hidden && typeof gameState !== "undefined" && gameState && gameState.scene) {
		// 1. Zone-change & remote-join sync (every 250ms)
		if (nowMs - _spkmodSparkLastSyncCheckMs >= 250) {
			_spkmodSparkLastSyncCheckMs = nowMs;

			if (gameState.zoneId != null && gameState.zoneId !== _spkmodSparkLastObservedZoneId) {
				_spkmodSparkLastObservedZoneId = gameState.zoneId;
				_spkmodRemoteSparkStates.clear();
				spkmodClearAllSparkParticles();
				_spkmodLocalSparkLastX = null;
				_spkmodLocalSparkLastZ = null;
				_spkmodLocalSparkDistAccum = 0;
				if (window.spkmodSparkSettings.equippedId && spkmodIsSparkChatSharingEnabled()) {
					_spkmodSparkNeedsZoneSync = true;
					spkmodTriggerSparkSyncBroadcast({
						priority: "passive",
						delayMs: 2000,
						forceResend: true,
						reason: "spark_zone"
					});
				}
			}

			const rCount = (gameState.remotePlayers?.remotePlayers?.size) || 0;
			if (rCount > 0 && window.spkmodSparkSettings.equippedId && spkmodIsSparkChatSharingEnabled()) {
				const inMinigame = (typeof spkmodIsInIsolatedMinigame === "function") ? spkmodIsInIsolatedMinigame() : false;
				if (!inMinigame) {
					if (_spkmodSparkNeedsZoneSync) {
						_spkmodSparkNeedsZoneSync = false;
						spkmodTriggerSparkSyncBroadcast({
							priority: "passive",
							delayMs: 2000,
							forceResend: true,
							reason: "spark_zone"
						});
					} else if (rCount > _spkmodSparkLastObservedRemoteCount) {
						spkmodTriggerSparkSyncBroadcast({
							priority: "passive",
							delayMs: 2600,
							forceResend: true,
							reason: "remote_join"
						});
					}
				}
			}
			_spkmodSparkLastObservedRemoteCount = rCount;
		}

		// 2. Local walking trail emission
		const localPos = gameState.playerContainer?.position;
		const eqId = window.spkmodSparkSettings.equippedId;
		if (localPos && eqId) {
			const spark = SPKMOD_SPARKS_BY_ID.get(eqId);
			if (spark && spkmodIsSparkUnlocked(spark)) {
				if (_spkmodLocalSparkLastX !== null && _spkmodLocalSparkLastZ !== null) {
					const d = Math.hypot(localPos.x - _spkmodLocalSparkLastX, localPos.z - _spkmodLocalSparkLastZ);
					if (d > 4.0) {
						_spkmodLocalSparkDistAccum = 0;
					} else {
						_spkmodLocalSparkDistAccum += d;
						if (_spkmodLocalSparkDistAccum >= 0.58) {
							_spkmodLocalSparkDistAccum = 0;
							spkmodEmitSparkTrailAt(spark, localPos, 1.0, false);
						}
					}
				}
				_spkmodLocalSparkLastX = localPos.x;
				_spkmodLocalSparkLastZ = localPos.z;
			}
		} else {
			_spkmodLocalSparkLastX = null;
			_spkmodLocalSparkLastZ = null;
			_spkmodLocalSparkDistAccum = 0;
		}

		// 3. Remote players' synced walking trails (distance-culled for high FPS)
		if (window.spkmodSparkSettings.showRemoteSparks !== false && _spkmodRemoteSparkStates.size > 0 && gameState.remotePlayers?.remotePlayers) {
			const rMap = gameState.remotePlayers.remotePlayers;
			for (const [, st] of _spkmodRemoteSparkStates) {
				if (!st || !st.sparkId) continue;
				const spark = SPKMOD_SPARKS_BY_ID.get(st.sparkId);
				if (!spark) continue;
				const res = spkmodResolveRemotePlayerForSpark(st.playerId, st.playerName);
				const rp = res?.rp;
				const rpPos = rp?.container?.position;
				if (!rp || !rpPos || rp.container.visible === false) continue;

				const rLvl = rp.info?.level ?? rp.level ?? 0;
				const rName = rp.info?.__spkmodOrigName || rp.info?.name || st.playerName || "";
				if (!spkmodCheckSparkRemoteLevelAllowed(spark.level, rLvl, rName)) continue;

				if (localPos) {
					const distToMe = Math.hypot(rpPos.x - localPos.x, rpPos.z - localPos.z);
					if (distToMe > SPKMOD_SPARK_REMOTE_MAX_DIST) {
						st.lastX = rpPos.x;
						st.lastZ = rpPos.z;
						continue;
					}
				}

				if (st.lastX !== null && st.lastZ !== null) {
					const d = Math.hypot(rpPos.x - st.lastX, rpPos.z - st.lastZ);
					if (d > 4.0) {
						st.distAccum = 0;
					} else {
						st.distAccum += d;
						if (st.distAccum >= 0.72) {
							st.distAccum = 0;
							spkmodEmitSparkTrailAt(spark, rpPos, 1.0, true);
						}
					}
				}
				st.lastX = rpPos.x;
				st.lastZ = rpPos.z;
			}
		}

		// 4. Advance active 3D particle sprites
		if (_spkmodActiveSparkParticles.length > 0) {
			spkmodUpdateSparkParticles(dt);
		}
	}

	_spkmodSparkLoopRafId = requestAnimationFrame(spkmodSparksMasterLoop);
}

function spkmodStartSparksLoopIfEnabled() {
	if (!spkmodIsSparksSystemEnabled()) return;
	if (_spkmodSparkLoopRafId !== null) return;
	_spkmodSparkLoopLastMs = typeof performance !== "undefined" ? performance.now() : Date.now();
	_spkmodSparkLoopRafId = requestAnimationFrame(spkmodSparksMasterLoop);
}

function spkmodStopSparksLoop() {
	if (_spkmodSparkLoopRafId !== null) {
		cancelAnimationFrame(_spkmodSparkLoopRafId);
		_spkmodSparkLoopRafId = null;
	}
}

// ============================================================================
// 8. EQUIP / UNEQUIP / BURST / SPAM / MASTER TOGGLE
// ============================================================================
window.spkmodBurstSpamActive = false;
window.spkmodBurstSpamInterval = null;

function spkmodEquipLocalSpark(idOrLevel, broadcast = true, silentToast = false) {
	if (!spkmodIsSparksSystemEnabled()) {
		if (!silentToast && typeof chatLog === "function") {
			chatLog(spkmodGetSparkUiText("systemDisabledToast"));
		}
		return false;
	}

	if (idOrLevel === null || idOrLevel === undefined || idOrLevel === "" || idOrLevel === "none" || idOrLevel === "off") {
		const hadPrev = !!window.spkmodSparkSettings.equippedId;
		window.spkmodSparkSettings.equippedId = null;
		_spkmodLocalSparkLastX = null;
		_spkmodLocalSparkLastZ = null;
		_spkmodLocalSparkDistAccum = 0;
		if (typeof window !== "undefined" && window.localStorage) {
			try { localStorage.setItem(SPKMOD_SPARK_STORAGE_KEYS.trailActive, "false"); } catch (_) {}
		}
		if (broadcast && hadPrev && spkmodIsSparkChatSharingEnabled()) {
			spkmodTriggerSparkSyncBroadcast({
				priority: "explicit",
				delayMs: 900,
				forceResend: true,
				includeSparkState: true,
				reason: "spark_unequip"
			});
		}
		if (!silentToast && hadPrev && typeof chatLog === "function") {
			chatLog(spkmodGetSparkUiText("unequippedToast"));
		}
		spkmodRefreshSparksModalUI();
		return true;
	}

	const spark = (typeof idOrLevel === "number" || /^\d+$/.test(String(idOrLevel)))
		? SPKMOD_SPARKS_BY_LEVEL.get(Number(idOrLevel))
		: SPKMOD_SPARKS_BY_ID.get(String(idOrLevel).trim().toLowerCase());

	if (!spark) {
		if (!silentToast && typeof chatLog === "function") {
			chatLog(spkmodGetSparkUiText("unknownSparkToast", idOrLevel));
		}
		return false;
	}

	if (!spkmodIsSparkUnlocked(spark)) {
		if (!silentToast && typeof chatLog === "function") {
			chatLog(spkmodGetSparkUiText("lockedToast", spark.level, spkmodGetSparkDisplayName(spark)));
		}
		return false;
	}

	window.spkmodSparkSettings.equippedId = spark.id;
	window.spkmodSparkSettings.lastSelectedId = spark.id;
	if (typeof window !== "undefined" && window.localStorage) {
		try {
			localStorage.setItem(SPKMOD_SPARK_STORAGE_KEYS.trailActive, "true");
			localStorage.setItem(SPKMOD_SPARK_STORAGE_KEYS.equipped, spark.id);
		} catch (_) {}
	}

	// Instant feedback sparkle around player
	if (typeof gameState !== "undefined" && gameState?.playerContainer?.position) {
		spkmodEmitSparkTrailAt(spark, gameState.playerContainer.position, 1.4, false);
	}

	if (broadcast && spkmodIsSparkChatSharingEnabled()) {
		spkmodTriggerSparkSyncBroadcast({
			priority: "explicit",
			delayMs: 900,
			forceResend: true,
			includeSparkState: true,
			reason: "spark_equip"
		});
	}
	if (!silentToast && typeof chatLog === "function") {
		chatLog(spkmodGetSparkUiText("equippedToast", spkmodGetSparkDisplayName(spark), spark.level));
	}
	spkmodRefreshSparksModalUI();
	return true;
}

window.spkmodToggleStepTrail = function(enabled, type) {
	if (type && SPKMOD_SPARKS_BY_ID.has(type)) {
		window.spkmodSparkSettings.lastSelectedId = type;
	}
	const nextOn = enabled !== undefined ? !!enabled : !window.spkmodSparkSettings.equippedId;
	if (nextOn) {
		return spkmodEquipLocalSpark(type || window.spkmodSparkSettings.equippedId || window.spkmodSparkSettings.lastSelectedId || "stars", true, false);
	}
	return spkmodEquipLocalSpark(null, true, false);
};

window.spkmodSetTrailType = function(type) {
	return spkmodEquipLocalSpark(type, true, false);
};

window.spkmodBurstTrail = function(silent = false, forcedSparkId = null) {
	if (!spkmodIsSparksSystemEnabled()) return;
	if (typeof gameState === "undefined" || !gameState?.playerContainer?.position) return;
	const id = forcedSparkId || window.spkmodSparkSettings.equippedId || window.spkmodSparkSettings.lastSelectedId || "stars";
	const spark = SPKMOD_SPARKS_BY_ID.get(id) || SPKMOD_SPARK_CATALOG[0];
	spkmodEmitSparkTrailAt(spark, gameState.playerContainer.position, silent ? 1.8 : 2.6, false);
	if (gameState.bloomEffects && gameState.localAvatar?.root) {
		try { gameState.bloomEffects.burst(gameState.localAvatar.root); } catch (_) {}
	}
	if (!silent && typeof chatLog === "function") {
		chatLog(spkmodGetSparkUiText("burstToast", spkmodGetSparkDisplayName(spark)));
	}
};

window.spkmodToggleBurstSpam = function(forceState) {
	const newState = forceState !== undefined ? !!forceState : !window.spkmodBurstSpamActive;
	window.spkmodBurstSpamActive = newState;

	if (window.spkmodBurstSpamInterval) {
		clearInterval(window.spkmodBurstSpamInterval);
		window.spkmodBurstSpamInterval = null;
	}

	if (window.spkmodBurstSpamActive) {
		window.spkmodBurstTrail(true);
		window.spkmodBurstSpamInterval = setInterval(() => {
			if (!window.spkmodBurstSpamActive || !spkmodIsSparksSystemEnabled()) {
				clearInterval(window.spkmodBurstSpamInterval);
				window.spkmodBurstSpamInterval = null;
				window.spkmodBurstSpamActive = false;
				return;
			}
			window.spkmodBurstTrail(true);
		}, 140);
		if (typeof chatLog === "function") chatLog(spkmodGetSparkUiText("burstSpamOnToast"));
	} else {
		if (typeof chatLog === "function") chatLog(spkmodGetSparkUiText("burstSpamOffToast"));
	}
	spkmodRefreshSparksModalUI();
};

function spkmodSyncSparksSystemUIState() {
	const enabled = spkmodIsSparksSystemEnabled();
	if (typeof lunPanelElements !== "undefined" && lunPanelElements) {
		if (lunPanelElements.sparksSystemToggleInput) {
			lunPanelElements.sparksSystemToggleInput.checked = enabled;
		}
		if (lunPanelElements.sparksBtn) {
			lunPanelElements.sparksBtn.classList.toggle("hidden", !enabled);
		}
	}
	const btn = document.getElementById("spkmod-sparks-btn");
	if (btn) btn.classList.toggle("hidden", !enabled);
}

window.spkmodSetSparksSystemEnabled = function(nextEnabled, silentToast = false) {
	const enabled = !!nextEnabled;
	window.spkmodSparkSettings.enabled = enabled;
	window.spkmodSparksSystemEnabled = enabled;
	if (typeof window !== "undefined" && window.localStorage) {
		try { localStorage.setItem(SPKMOD_SPARK_STORAGE_KEYS.enabled, enabled ? "true" : "false"); } catch (_) {}
	}
	spkmodSyncSparksSystemUIState();

	if (!enabled) {
		spkmodStopSparksLoop();
		if (window.spkmodBurstSpamActive) window.spkmodToggleBurstSpam(false);
		spkmodClearAllSparkParticles();
		if (_spkmodSparkHadBroadcast && typeof window.spkmodQueueUnifiedModSyncBroadcast === "function") {
			window.spkmodQueueUnifiedModSyncBroadcast({
				priority: "explicit",
				delayMs: 500,
				forceResend: true,
				includeSparkState: true,
				reason: "spark_disable"
			});
		}
		const modal = document.getElementById("spkmod-sparks-modal");
		if (modal) modal.classList.add("hidden");
	} else {
		_spkmodSparkLastObservedZoneId = null;
		_spkmodSparkLastObservedRemoteCount = 0;
		spkmodStartSparksLoopIfEnabled();
	}

	if (!silentToast && typeof chatLog === "function") {
		chatLog(spkmodGetSparkUiText(enabled ? "systemEnabledToast" : "systemDisabledToast"));
	}
	return enabled;
};

// ============================================================================
// 9. DEDICATED SPARK FX WARDROBE MODAL UI (#spkmod-sparks-modal)
// ============================================================================
let _spkmodSparksActiveTab = "all";
let _spkmodSparksSearchQuery = "";

function spkmodBuildSparksModal() {
	let existing = document.getElementById("spkmod-sparks-modal");
	if (existing) return existing;

	if (!document.getElementById("spkmod-sparks-styles")) {
		const styleEl = document.createElement("style");
		styleEl.id = "spkmod-sparks-styles";
		styleEl.textContent = `
			#spkmod-sparks-modal {
				position: fixed;
				width: min(880px, calc(100vw - 24px));
				height: min(620px, calc(100vh - 32px));
				background: var(--spkmod-bg, rgba(15, 23, 42, 0.94));
				backdrop-filter: var(--spkmod-blur, blur(10px));
				border: 2px solid var(--spkmod-accent, #ffd54a);
				border-radius: 12px;
				color: #f8fafc;
				display: flex;
				flex-direction: column;
				overflow: hidden;
				box-shadow: 0 16px 42px rgba(0, 0, 0, 0.65);
				z-index: 2147483645;
				font-family: Pretendard, system-ui, -apple-system, sans-serif;
			}
			#spkmod-sparks-modal.hidden { display: none !important; }
			body.spkmod-ui-hidden #spkmod-sparks-modal { display: none !important; }
			.spkmod-sparks-grid-scroll {
				flex: 1 1 auto;
				min-height: 0;
				overflow-y: auto;
				padding: 10px 14px 16px;
				overscroll-behavior: contain;
				-webkit-overflow-scrolling: touch;
			}
			.spkmod-sparks-grid-scroll::-webkit-scrollbar { width: 7px; }
			.spkmod-sparks-grid-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.22); border-radius: 4px; }
			.spkmod-sparks-grid-scroll::-webkit-scrollbar-thumb { background: rgba(255,213,74,0.45); border-radius: 4px; }
			.spkmod-sparks-grid {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
				gap: 10px;
			}
			.spkmod-spark-card {
				position: relative;
				background: rgba(30, 41, 59, 0.78);
				border: 1.5px solid rgba(148, 163, 184, 0.24);
				border-radius: 10px;
				padding: 10px;
				display: flex;
				flex-direction: column;
				gap: 6px;
				transition: transform 0.14s ease, border-color 0.14s ease, box-shadow 0.14s ease;
			}
			.spkmod-spark-card:hover:not(.locked) {
				transform: translateY(-2px);
				border-color: var(--spkmod-accent, #ffd54a);
				box-shadow: 0 6px 18px rgba(0,0,0,0.35);
			}
			.spkmod-spark-card.equipped {
				border-color: #4ade80;
				background: rgba(20, 83, 45, 0.35);
				box-shadow: 0 0 14px rgba(74, 222, 128, 0.28);
			}
			.spkmod-spark-card.locked {
				opacity: 0.62;
			}
			.spkmod-sparks-tab-btn {
				background: rgba(30, 41, 59, 0.85);
				border: 1px solid rgba(148, 163, 184, 0.28);
				color: #cbd5e1;
				border-radius: 8px;
				padding: 4px 9px;
				font-size: 11px;
				font-weight: 700;
				cursor: pointer;
				white-space: nowrap;
				transition: all 0.14s ease;
			}
			.spkmod-sparks-tab-btn.active {
				background: var(--spkmod-accent, #ffd54a);
				color: #0f172a;
				border-color: var(--spkmod-accent, #ffd54a);
			}
			.spkmod-spark-swatch-row {
				display: flex;
				align-items: center;
				gap: 4px;
			}
			.spkmod-spark-swatch {
				width: 11px;
				height: 11px;
				border-radius: 50%;
				border: 1px solid rgba(255,255,255,0.35);
			}
		`;
		document.head.appendChild(styleEl);
	}

	const modal = document.createElement("div");
	modal.id = "spkmod-sparks-modal";
	modal.className = "spkmod-modal hidden";

	const header = document.createElement("div");
	header.id = "spkmod-sparks-header";
	header.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: rgba(15, 23, 42, 0.95); border-bottom: 1px solid rgba(255, 255, 255, 0.12); cursor: move; user-select: none;";

	const titleEl = document.createElement("div");
	titleEl.id = "spkmod-sparks-title";
	titleEl.style.cssText = "font-size: 14px; font-weight: 800; color: var(--spkmod-accent, #ffd54a); display: flex; align-items: center; gap: 8px;";
	titleEl.innerText = spkmodGetSparkUiText("sparksModalTitle");

	const closeBtn = document.createElement("button");
	closeBtn.type = "button";
	closeBtn.innerText = "✕";
	closeBtn.style.cssText = "background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.5); color: #fca5a5; border-radius: 6px; width: 26px; height: 26px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center;";
	closeBtn.onclick = () => modal.classList.add("hidden");

	header.appendChild(titleEl);
	header.appendChild(closeBtn);

	const statusBar = document.createElement("div");
	statusBar.id = "spkmod-sparks-status-bar";
	statusBar.style.cssText = "display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 14px; background: rgba(30, 41, 59, 0.65); border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 12px;";

	const controlsBar = document.createElement("div");
	controlsBar.id = "spkmod-sparks-controls-bar";
	controlsBar.style.cssText = "display: flex; flex-direction: column; gap: 8px; padding: 8px 14px; background: rgba(15, 23, 42, 0.75); border-bottom: 1px solid rgba(255, 255, 255, 0.08);";

	const gridScroll = document.createElement("div");
	gridScroll.className = "spkmod-sparks-grid-scroll";
	const grid = document.createElement("div");
	grid.id = "spkmod-sparks-grid";
	grid.className = "spkmod-sparks-grid";
	gridScroll.appendChild(grid);

	const resizeHandle = document.createElement("div");
	resizeHandle.id = "spkmod-sparks-resize";
	resizeHandle.style.cssText = "position: absolute; right: 2px; bottom: 2px; width: 16px; height: 16px; cursor: nwse-resize; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 11px; user-select: none;";
	resizeHandle.innerText = "◢";

	modal.appendChild(header);
	modal.appendChild(statusBar);
	modal.appendChild(controlsBar);
	modal.appendChild(gridScroll);
	modal.appendChild(resizeHandle);
	document.body.appendChild(modal);

	if (typeof lunHudElements !== "undefined") {
		lunHudElements.sparksModal = modal;
	}
	if (typeof makeDraggable === "function") {
		makeDraggable(modal, [header]);
	}
	if (typeof makeResizable === "function") {
		makeResizable(modal, resizeHandle, 360, 320);
	}

	gridScroll.addEventListener("wheel", (e) => { e.stopPropagation(); }, { passive: true });
	gridScroll.addEventListener("touchmove", (e) => { e.stopPropagation(); }, { passive: true });
	modal.addEventListener("wheel", (e) => { e.stopPropagation(); }, { passive: true });
	modal.addEventListener("mouseenter", () => {
		if (document.pointerLockElement) {
			try { document.exitPointerLock(); } catch (_) {}
		}
	});
	for (const el of [statusBar, controlsBar, gridScroll]) {
		el.addEventListener("pointerdown", (e) => e.stopPropagation());
		el.addEventListener("mousedown", (e) => e.stopPropagation());
	}

	spkmodBuildSparksControls(controlsBar);
	spkmodRefreshSparksModalUI();
	return modal;
}

function spkmodBuildSparksControls(controlsBar) {
	controlsBar.innerHTML = "";

	const topRow = document.createElement("div");
	topRow.style.cssText = "display: flex; flex-wrap: wrap; align-items: center; gap: 10px;";

	const searchInput = document.createElement("input");
	searchInput.id = "spkmod-sparks-search";
	searchInput.type = "text";
	searchInput.placeholder = spkmodGetSparkUiText("searchPlaceholder");
	searchInput.value = _spkmodSparksSearchQuery;
	searchInput.style.cssText = "flex: 1 1 200px; min-width: 150px; padding: 5px 10px; border-radius: 8px; border: 1px solid rgba(148, 163, 184, 0.35); background: rgba(30, 41, 59, 0.85); color: #f8fafc; font-size: 11.5px; outline: none;";
	searchInput.addEventListener("input", (e) => {
		_spkmodSparksSearchQuery = e.target.value || "";
		spkmodRenderSparksGrid();
	});
	searchInput.addEventListener("keydown", (e) => e.stopPropagation());

	const makeToggle = (id, key, checked, onChange) => {
		const lbl = document.createElement("label");
		lbl.style.cssText = "display: inline-flex; align-items: center; gap: 5px; font-size: 11px; color: #e2e8f0; cursor: pointer; user-select: none;";
		const cb = document.createElement("input");
		cb.id = id;
		cb.type = "checkbox";
		cb.checked = !!checked;
		cb.onchange = (e) => onChange(e.target.checked);
		const sp = document.createElement("span");
		sp.id = id + "-label";
		sp.innerText = spkmodGetSparkUiText(key);
		lbl.appendChild(cb);
		lbl.appendChild(sp);
		return lbl;
	};

	topRow.appendChild(searchInput);
	topRow.appendChild(makeToggle(
		"spkmod-sparks-toggle-remote",
		"toggleRemoteSparks",
		window.spkmodSparkSettings.showRemoteSparks !== false,
		(val) => {
			window.spkmodSparkSettings.showRemoteSparks = !!val;
			if (window.localStorage) localStorage.setItem(SPKMOD_SPARK_STORAGE_KEYS.showRemote, val ? "true" : "false");
		}
	));
	topRow.appendChild(makeToggle(
		"spkmod-sparks-toggle-share",
		"toggleShareInChat",
		window.spkmodSparkSettings.shareInChat !== false,
		(val) => {
			window.spkmodSparkSettings.shareInChat = !!val;
			if (window.localStorage) localStorage.setItem(SPKMOD_SPARK_STORAGE_KEYS.shareInChat, val ? "true" : "false");
			if (val && window.spkmodSparkSettings.equippedId) {
				spkmodTriggerSparkSyncBroadcast({ priority: "explicit", delayMs: 500, forceResend: true, includeSparkState: true, reason: "spark_share_on" });
			} else if (!val && _spkmodSparkHadBroadcast && typeof window.spkmodQueueUnifiedModSyncBroadcast === "function") {
				window.spkmodQueueUnifiedModSyncBroadcast({ priority: "explicit", delayMs: 500, forceResend: true, includeSparkState: true, reason: "spark_share_off" });
			}
		}
	));

	const tabsRow = document.createElement("div");
	tabsRow.id = "spkmod-sparks-tabs";
	tabsRow.style.cssText = "display: flex; flex-wrap: wrap; gap: 5px;";

	controlsBar.appendChild(topRow);
	controlsBar.appendChild(tabsRow);
}

function spkmodRenderSparksTabs() {
	const tabsRow = document.getElementById("spkmod-sparks-tabs");
	if (!tabsRow) return;
	tabsRow.innerHTML = "";

	const tabs = [
		{ id: "all", key: "tabAll" },
		{ id: "unlocked", key: "tabUnlocked" },
		{ id: "favorites", key: "tabFavorites" },
		{ id: "t1", key: "tabTier1" },
		{ id: "t2", key: "tabTier2" },
		{ id: "t3", key: "tabTier3" },
		{ id: "t4", key: "tabTier4" },
		{ id: "t5", key: "tabTier5" }
	];
	for (const tab of tabs) {
		const btn = document.createElement("button");
		btn.type = "button";
		btn.className = "spkmod-sparks-tab-btn" + (_spkmodSparksActiveTab === tab.id ? " active" : "");
		btn.innerText = spkmodGetSparkUiText(tab.key);
		btn.onclick = () => {
			_spkmodSparksActiveTab = tab.id;
			spkmodRenderSparksTabs();
			spkmodRenderSparksGrid();
		};
		tabsRow.appendChild(btn);
	}
}

function spkmodRenderSparksGrid() {
	const grid = document.getElementById("spkmod-sparks-grid");
	if (!grid) return;
	grid.innerHTML = "";

	const q = _spkmodSparksSearchQuery.trim().toLowerCase();
	const filtered = SPKMOD_SPARK_CATALOG.filter(sp => {
		if (_spkmodSparksActiveTab === "unlocked" && !spkmodIsSparkUnlocked(sp)) return false;
		if (_spkmodSparksActiveTab === "favorites" && !spkmodIsSparkFavorite(sp.id)) return false;
		if (_spkmodSparksActiveTab === "t1" && sp.tier !== 1) return false;
		if (_spkmodSparksActiveTab === "t2" && sp.tier !== 2) return false;
		if (_spkmodSparksActiveTab === "t3" && sp.tier !== 3) return false;
		if (_spkmodSparksActiveTab === "t4" && sp.tier !== 4) return false;
		if (_spkmodSparksActiveTab === "t5" && sp.tier !== 5) return false;
		if (q) {
			const name = spkmodGetSparkDisplayName(sp).toLowerCase();
			const defName = (sp.defaultName || "").toLowerCase();
			const lvlStr = `lv.${sp.level} lv${sp.level} ${sp.level}`;
			if (!name.includes(q) && !defName.includes(q) && !sp.id.includes(q) && !lvlStr.includes(q)) return false;
		}
		return true;
	});

	if (_spkmodSparksActiveTab === "favorites" && filtered.length === 0) {
		const empty = document.createElement("div");
		empty.style.cssText = "grid-column: 1 / -1; text-align: center; padding: 26px 14px; color: #94a3b8; font-size: 12px;";
		empty.innerText = spkmodGetSparkUiText("favEmptyHint");
		grid.appendChild(empty);
		return;
	}

	// Pin favorites to top in All / Unlocked tabs
	const sorted = filtered.slice().sort((a, b) => {
		const fa = spkmodIsSparkFavorite(a.id) ? 1 : 0;
		const fb = spkmodIsSparkFavorite(b.id) ? 1 : 0;
		if (fa !== fb) return fb - fa;
		return a.level - b.level;
	});

	// Reveal unlocked trails + next upcoming milestone teaser (hype card for remaining locked trails in All tab)
	const playerLevel = spkmodGetSparkPlayerLevel();
	let nextLocked = null;
	let hiddenLockedCount = 0;
	const showCompactLocked = !q && _spkmodSparksActiveTab === "all" && !window.spkmodSparkSettings.unlockAllTest;

	for (const sp of sorted) {
		const unlocked = spkmodIsSparkUnlocked(sp);
		if (showCompactLocked && !unlocked) {
			if (!nextLocked) {
				nextLocked = sp;
			} else {
				hiddenLockedCount++;
				continue;
			}
		}

		const isEquipped = window.spkmodSparkSettings.equippedId === sp.id;
		const isFav = spkmodIsSparkFavorite(sp.id);

		const card = document.createElement("div");
		card.className = "spkmod-spark-card" + (isEquipped ? " equipped" : "") + (!unlocked ? " locked" : "");

		const topBar = document.createElement("div");
		topBar.style.cssText = "display: flex; align-items: center; justify-content: space-between; gap: 4px;";

		const lvlBadge = document.createElement("span");
		lvlBadge.style.cssText = `font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px; background: ${unlocked ? "rgba(56,189,248,0.18)" : "rgba(148,163,184,0.15)"}; color: ${unlocked ? "#7dd3fc" : "#94a3b8"};`;
		lvlBadge.innerText = `Lv.${sp.level}` + (sp.milestone ? " ★" : "");

		const rightBadges = document.createElement("div");
		rightBadges.style.cssText = "display: flex; align-items: center; gap: 4px;";

		if (!unlocked && nextLocked && sp.id === nextLocked.id) {
			const up = document.createElement("span");
			up.style.cssText = "font-size: 9px; font-weight: 800; padding: 2px 5px; border-radius: 5px; background: rgba(245,158,11,0.22); color: #fcd34d;";
			up.innerText = spkmodGetSparkUiText("nextUnlockBadge");
			rightBadges.appendChild(up);
		}

		const favBtn = document.createElement("button");
		favBtn.type = "button";
		favBtn.innerText = isFav ? "★" : "☆";
		favBtn.title = spkmodGetSparkUiText(isFav ? "favRemoveTooltip" : "favAddTooltip");
		favBtn.style.cssText = `background: transparent; border: none; color: ${isFav ? "#facc15" : "#94a3b8"}; font-size: 14px; cursor: pointer; padding: 0 2px; line-height: 1;`;
		favBtn.onclick = (e) => {
			e.stopPropagation();
			spkmodToggleSparkFavorite(sp.id);
			spkmodRenderSparksGrid();
		};
		rightBadges.appendChild(favBtn);

		topBar.appendChild(lvlBadge);
		topBar.appendChild(rightBadges);

		const midRow = document.createElement("div");
		midRow.style.cssText = "display: flex; align-items: center; gap: 8px;";
		const iconBox = document.createElement("div");
		iconBox.style.cssText = `width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; background: ${sp.accent}22; border: 1px solid ${sp.accent}66;`;
		iconBox.innerText = sp.icon;

		const textCol = document.createElement("div");
		textCol.style.cssText = "min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 3px;";
		const nameEl = document.createElement("div");
		nameEl.style.cssText = "font-size: 11.5px; font-weight: 800; color: #f8fafc; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;";
		nameEl.title = spkmodGetSparkDisplayName(sp);
		nameEl.innerText = spkmodGetSparkDisplayName(sp);

		const swatchRow = document.createElement("div");
		swatchRow.className = "spkmod-spark-swatch-row";
		for (const c of (sp.colors || []).slice(0, 5)) {
			const dot = document.createElement("span");
			dot.className = "spkmod-spark-swatch";
			dot.style.background = c;
			swatchRow.appendChild(dot);
		}

		textCol.appendChild(nameEl);
		textCol.appendChild(swatchRow);
		midRow.appendChild(iconBox);
		midRow.appendChild(textCol);

		const btnRow = document.createElement("div");
		btnRow.style.cssText = "display: flex; gap: 4px; margin-top: 2px;";

		const equipBtn = document.createElement("button");
		equipBtn.type = "button";
		equipBtn.className = "spkmod-panel-btn";
		equipBtn.style.cssText = isEquipped
			? "flex: 1; padding: 4px 6px; font-size: 10.5px; font-weight: 800; color: #bbf7d0; border-color: #4ade80; background: rgba(22, 163, 74, 0.35); cursor: pointer;"
			: (unlocked
				? "flex: 1; padding: 4px 6px; font-size: 10.5px; font-weight: 700; color: #f8fafc; cursor: pointer;"
				: "flex: 1; padding: 4px 6px; font-size: 10px; color: #94a3b8; cursor: not-allowed;");
		equipBtn.innerText = !unlocked
			? spkmodGetSparkUiText("btnLocked", sp.level)
			: spkmodGetSparkUiText(isEquipped ? "btnEquipped" : "btnEquip");
		equipBtn.onclick = (e) => {
			e.stopPropagation();
			if (!unlocked) {
				if (typeof chatLog === "function") chatLog(spkmodGetSparkUiText("lockedToast", sp.level, spkmodGetSparkDisplayName(sp)));
				return;
			}
			if (isEquipped) spkmodEquipLocalSpark(null, true, false);
			else spkmodEquipLocalSpark(sp.id, true, false);
		};

		const previewBtn = document.createElement("button");
		previewBtn.type = "button";
		previewBtn.className = "spkmod-panel-btn";
		previewBtn.style.cssText = "padding: 4px 7px; font-size: 10.5px; color: #fde047; cursor: pointer;";
		previewBtn.innerText = "✨";
		previewBtn.title = spkmodGetSparkUiText("btnPreview");
		previewBtn.onclick = (e) => {
			e.stopPropagation();
			if (typeof gameState !== "undefined" && gameState?.playerContainer?.position) {
				spkmodEmitSparkTrailAt(sp, gameState.playerContainer.position, 1.5, false);
			}
		};

		btnRow.appendChild(equipBtn);
		btnRow.appendChild(previewBtn);

		card.appendChild(topBar);
		card.appendChild(midRow);
		card.appendChild(btnRow);
		grid.appendChild(card);
	}

	if (showCompactLocked && hiddenLockedCount > 0 && nextLocked) {
		const hype = document.createElement("div");
		hype.style.cssText = "grid-column: 1 / -1; padding: 12px 14px; border-radius: 10px; background: linear-gradient(135deg, rgba(245,158,11,0.16), rgba(168,85,247,0.16)); border: 1px dashed rgba(250,204,21,0.45); display: flex; flex-direction: column; gap: 4px;";
		const hTitle = document.createElement("div");
		hTitle.style.cssText = "font-size: 12.5px; font-weight: 800; color: #fde047;";
		hTitle.innerText = "🔥 " + spkmodGetSparkUiText("hypeTitle");
		const hDesc = document.createElement("div");
		hDesc.style.cssText = "font-size: 11px; color: #e2e8f0;";
		hDesc.innerText = spkmodGetSparkUiText("hypeDesc", hiddenLockedCount + 1, Math.max(playerLevel + 1, nextLocked.level));
		hype.appendChild(hTitle);
		hype.appendChild(hDesc);
		grid.appendChild(hype);
	}
}

function spkmodRefreshSparksModalUI() {
	const modal = document.getElementById("spkmod-sparks-modal");
	if (!modal) return;

	const titleEl = document.getElementById("spkmod-sparks-title");
	if (titleEl) titleEl.innerText = spkmodGetSparkUiText("sparksModalTitle");

	const searchInput = document.getElementById("spkmod-sparks-search");
	if (searchInput) searchInput.placeholder = spkmodGetSparkUiText("searchPlaceholder");
	const remLbl = document.getElementById("spkmod-sparks-toggle-remote-label");
	if (remLbl) remLbl.innerText = spkmodGetSparkUiText("toggleRemoteSparks");
	const shareLbl = document.getElementById("spkmod-sparks-toggle-share-label");
	if (shareLbl) shareLbl.innerText = spkmodGetSparkUiText("toggleShareInChat");

	const statusBar = document.getElementById("spkmod-sparks-status-bar");
	if (statusBar) {
		statusBar.innerHTML = "";
		const lvl = spkmodGetSparkPlayerLevel();
		const unlockedCount = SPKMOD_SPARK_CATALOG.filter(spkmodIsSparkUnlocked).length;
		const activeSpark = window.spkmodSparkSettings.equippedId ? SPKMOD_SPARKS_BY_ID.get(window.spkmodSparkSettings.equippedId) : null;

		const statsDiv = document.createElement("div");
		statsDiv.style.cssText = "display: flex; flex-wrap: wrap; align-items: center; gap: 12px; font-weight: 700;";
		statsDiv.innerHTML = `
			<span>⭐ ${spkmodGetSparkUiText("myLevelLabel")}: <strong style="color:#ffd54a;">Lv.${lvl}</strong></span>
			<span>🔓 ${spkmodGetSparkUiText("unlockedLabel")}: <strong style="color:#7dd3fc;">${unlockedCount}/${SPKMOD_SPARK_CATALOG.length}</strong></span>
			<span>✨ ${spkmodGetSparkUiText("equippedLabel")}: <strong style="color:${activeSpark ? "#4ade80" : "#cbd5e1"};">${activeSpark ? (activeSpark.icon + " " + spkmodGetSparkDisplayName(activeSpark)) : spkmodGetSparkUiText("noneEquipped")}</strong></span>
		`;

		const actions = document.createElement("div");
		actions.style.cssText = "display: flex; flex-wrap: wrap; align-items: center; gap: 6px;";

		if (activeSpark) {
			const offBtn = document.createElement("button");
			offBtn.type = "button";
			offBtn.className = "spkmod-panel-btn";
			offBtn.style.cssText = "padding: 4px 9px; font-size: 11px; color: #fca5a5; cursor: pointer;";
			offBtn.innerText = "🛑 " + spkmodGetSparkUiText("btnUnequip");
			offBtn.onclick = () => spkmodEquipLocalSpark(null, true, false);
			actions.appendChild(offBtn);
		}

		const burstBtn = document.createElement("button");
		burstBtn.type = "button";
		burstBtn.className = "spkmod-panel-btn";
		burstBtn.style.cssText = "padding: 4px 9px; font-size: 11px; color: #ffd54a; font-weight: 700; cursor: pointer;";
		burstBtn.innerText = spkmodGetSparkUiText("btnBurst");
		burstBtn.onclick = () => window.spkmodBurstTrail(false);
		actions.appendChild(burstBtn);

		const spamBtn = document.createElement("button");
		spamBtn.type = "button";
		spamBtn.className = "spkmod-panel-btn";
		spamBtn.style.cssText = `padding: 4px 9px; font-size: 11px; font-weight: 700; cursor: pointer; color: ${window.spkmodBurstSpamActive ? "#4ade80" : "#ffd54a"}; border-color: ${window.spkmodBurstSpamActive ? "#4ade80" : ""};`;
		spamBtn.innerText = spkmodGetSparkUiText(window.spkmodBurstSpamActive ? "btnBurstSpamOn" : "btnBurstSpamOff");
		spamBtn.onclick = () => window.spkmodToggleBurstSpam();
		actions.appendChild(spamBtn);

		const syncBtn = document.createElement("button");
		syncBtn.type = "button";
		syncBtn.className = "spkmod-panel-btn";
		syncBtn.style.cssText = "padding: 4px 9px; font-size: 11px; color: #38bdf8; cursor: pointer;";
		syncBtn.innerText = spkmodGetSparkUiText("btnResync");
		syncBtn.onclick = () => {
			if (!spkmodIsSparkChatSharingEnabled()) {
				if (typeof chatLog === "function") chatLog(spkmodGetSparkUiText("shareInChatDisabledToast"));
				return;
			}
			spkmodTriggerSparkSyncBroadcast({ priority: "explicit", delayMs: 250, forceResend: true, includeSparkState: true, reason: "spark_manual_sync" });
			if (typeof chatLog === "function") chatLog(spkmodGetSparkUiText("broadcastToast"));
		};
		actions.appendChild(syncBtn);

		statusBar.appendChild(statsDiv);
		statusBar.appendChild(actions);
	}

	spkmodRenderSparksTabs();
	spkmodRenderSparksGrid();
}
window.spkmodRefreshSparksModalUI = spkmodRefreshSparksModalUI;

window.spkmodToggleSparksModal = function(forceState) {
	if (!spkmodIsSparksSystemEnabled()) {
		if (typeof chatLog === "function") chatLog(spkmodGetSparkUiText("systemDisabledToast"));
		return;
	}
	const modal = spkmodBuildSparksModal();
	const isHidden = modal.classList.contains("hidden");
	const shouldOpen = forceState !== undefined ? !!forceState : isHidden;
	if (shouldOpen) {
		modal.classList.remove("hidden");
		spkmodRefreshSparksModalUI();
		if (typeof positionModalNicely === "function") positionModalNicely(modal);
		if (typeof bringToFront === "function") bringToFront(modal);
	} else {
		modal.classList.add("hidden");
	}
};

// Hotkey Alt+F to toggle Spark FX Walking Trails Modal
if (typeof document !== "undefined" && !window.__spkmodSparksHotkeyInstalled) {
	window.__spkmodSparksHotkeyInstalled = true;
	document.addEventListener("keydown", (e) => {
		if (e.altKey && !e.ctrlKey && !e.metaKey && (e.key === "f" || e.key === "F" || e.code === "KeyF")) {
			const tag = (e.target && e.target.tagName) ? e.target.tagName.toUpperCase() : "";
			if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
			if (!spkmodIsSparksSystemEnabled()) return;
			e.preventDefault();
			window.spkmodToggleSparksModal();
		}
	});
}

// Public API for console, chat commands & unit tests
window.spkmodSparks = {
	catalog: SPKMOD_SPARK_CATALOG,
	byId: SPKMOD_SPARKS_BY_ID,
	byLevel: SPKMOD_SPARKS_BY_LEVEL,
	equip: (idOrLvl) => spkmodEquipLocalSpark(idOrLvl, true, false),
	unequip: () => spkmodEquipLocalSpark(null, true, false),
	burst: (id) => window.spkmodBurstTrail(false, id),
	toggleModal: (force) => window.spkmodToggleSparksModal(force),
	setEnabled: (val) => window.spkmodSetSparksSystemEnabled(val),
	unlockAll: (force, silentToast = false) => {
		const next = force !== undefined ? !!force : !window.spkmodSparkSettings.unlockAllTest;
		window.spkmodSparkSettings.unlockAllTest = next;
		if (typeof window !== "undefined" && window.localStorage) {
			try { localStorage.setItem(SPKMOD_SPARK_STORAGE_KEYS.unlockAll, next ? "true" : "false"); } catch (_) {}
		}
		if (!next) {
			const eqSpark = window.spkmodSparkSettings.equippedId ? SPKMOD_SPARKS_BY_ID.get(window.spkmodSparkSettings.equippedId) : null;
			if (eqSpark && !spkmodIsSparkLegitimatelyUnlocked(eqSpark)) {
				spkmodEquipLocalSpark(null, false, true);
			}
		}
		if (!silentToast && typeof chatLog === "function") {
			chatLog(spkmodGetSparkUiText(next ? "testUnlockEnabledToast" : "testUnlockDisabledToast"));
		}
		spkmodRefreshSparksModalUI();
		return next;
	}
};

if (typeof window !== "undefined") {
	spkmodSyncSparksSystemUIState();
	if (typeof requestAnimationFrame === "function" && spkmodIsSparksSystemEnabled()) {
		spkmodStartSparksLoopIfEnabled();
	}
}
