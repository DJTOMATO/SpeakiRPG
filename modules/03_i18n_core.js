function buildElement(tag, characteristics, inner, callback) {
	var elem = document.createElement(tag);
	elem.replaceChildren(...(inner?.filter(t => t) || []));
	for (const _ in (characteristics || {})) {
		if (_ === "dataset" && typeof characteristics[_] === "object") {
			try {
				Object.assign(elem.dataset, characteristics[_]);
			} catch (_) {}
		} else {
			try {
				elem[_] = characteristics[_];
			} catch (_) {}
		}
	}
	if (callback) callback(elem);
	return elem;
}

var __spkmodSpriteProtoHooked = false;
function hookSpritePrototypeOnce(sprite) {
	if (__spkmodSpriteProtoHooked || !sprite) return;
	const proto = Object.getPrototypeOf(sprite);
	if (!proto) return;
	__spkmodSpriteProtoHooked = true;

	Object.defineProperty(proto, "visible", {
		get() {
			if (typeof lunNametagMode !== "undefined" && lunNametagMode === 3 && this.position && this.position.y > 0.5) {
				return false;
			}
			return this._spkmodVisible !== undefined ? this._spkmodVisible : true;
		},
		set(v) {
			this._spkmodVisible = v;
		},
		configurable: true
	});
}

function findNametagSprite(container) {
	if (!container) return null;
	const cached = container.__spkmodNametagSprite;
	if (cached && cached.isSprite && cached.parent) {
		let p = cached.parent;
		while (p && p !== container) {
			p = p.parent;
		}
		if (p === container) {
			hookSpritePrototypeOnce(cached);
			return cached;
		}
	}

	let sprite = null;
	if (typeof container.traverse === "function") {
		container.traverse(obj => {
			if (obj && obj.isSprite) {
				hookSpritePrototypeOnce(obj);
				if (!sprite && obj.position && obj.position.y > 0.5) {
					sprite = obj;
				}
			}
		});
	}
	if (sprite) {
		container.__spkmodNametagSprite = sprite;
	} else {
		delete container.__spkmodNametagSprite;
	}
	return sprite;
}


function setText(elem, text) {
	if (elem && elem.innerText !== text) {
		elem.innerText = text;
	}
}

var lunBadWords = {
	en: [].concat(window.SpeakiModBadWordsEN || [], [
		"spkmodtestword"
	]),
	ja: [].concat(window.SpeakiModBadWordsJA || []),
	ko: [].concat(window.SpeakiModBadWordsKO || [])
};

var lunBadWordSources = {
	en: "https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/master/en",
	ja: "https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/master/ja",
	ko: "https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/master/ko"
};
const lunBadWordCacheKey = "spkmod-badword-cache";
const lunBadWordCacheMaxAgeMs = 14 * 24 * 60 * 60 * 1000; // 14 days (2 weeks)

async function loadBadWordList(lang, url) {
	try {
		const res = await fetch(url);
		if (!res.ok) {
			console.warn(`[SpeakiMod+] Failed to fetch ${lang} word list: HTTP ${res.status}`);
			return [];
		}
		const text = await res.text();
		return text.split("\n").map(w => w.trim()).filter(Boolean);
	} catch (err) {
		console.warn(`[SpeakiMod+] Failed to fetch ${lang} word list (network/CSP blocked?):`, err);
		return [];
	}
}

async function loadAllBadWordLists() {
	try {
		const cached = window.localStorage && JSON.parse(localStorage.getItem(lunBadWordCacheKey) || "null");
		if (cached && (Date.now() - cached.fetchedAt) < lunBadWordCacheMaxAgeMs) {
			lunBadWords.en = lunBadWords.en.concat(cached.en || []);
			lunBadWords.ja = lunBadWords.ja.concat(cached.ja || []);
			lunBadWords.ko = lunBadWords.ko.concat(cached.ko || []);
			rebuildBadWordRegex();
			console.log("[SpeakiMod+] Loaded profanity filter word lists from cache.");
			return;
		}
	} catch (err) {}

	const [en, ja, ko] = await Promise.all([
		loadBadWordList("en", lunBadWordSources.en),
		loadBadWordList("ja", lunBadWordSources.ja),
		loadBadWordList("ko", lunBadWordSources.ko)
	]);

	lunBadWords.en = lunBadWords.en.concat(en);
	lunBadWords.ja = lunBadWords.ja.concat(ja);
	lunBadWords.ko = lunBadWords.ko.concat(ko);
	rebuildBadWordRegex();

	if (window.localStorage && (en.length || ja.length || ko.length)) {
		localStorage.setItem(lunBadWordCacheKey, JSON.stringify({ en, ja, ko, fetchedAt: Date.now() }));
	}

	console.log(`[SpeakiMod+] Loaded profanity filter: ${en.length} en, ${ja.length} ja, ${ko.length} ko words fetched.`);
}

var lunFilterEnabled = (window.localStorage && localStorage.getItem("spkmod-filter-enabled")) !== "false";

function setFilterEnabled(enabled) {
	lunFilterEnabled = enabled;
	if (window.localStorage) localStorage.setItem("spkmod-filter-enabled", String(enabled));
}

var lunHideVerboseChat = (window.localStorage && localStorage.getItem("spkmod-hide-verbose-chat")) === "true";

function setHideVerboseChat(enabled) {
	lunHideVerboseChat = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-hide-verbose-chat", String(lunHideVerboseChat));
}

var lunTranslateEnabled = (window.localStorage && localStorage.getItem("spkmod-translate-enabled")) === "true";
var lunTranslateTarget = (window.localStorage && localStorage.getItem("spkmod-translate-target")) || "en";

function setTranslateEnabled(enabled) {
	lunTranslateEnabled = enabled;
	if (window.localStorage) localStorage.setItem("spkmod-translate-enabled", String(enabled));
	if (lunPanelElements.translateToggleInput) lunPanelElements.translateToggleInput.checked = enabled;
}

function setTranslateTarget(target) {
	lunTranslateTarget = target;
	if (window.localStorage) localStorage.setItem("spkmod-translate-target", target);
	if (typeof renderBbsPosts === "function") renderBbsPosts();
}
var lunTranslateEmail = (window.localStorage && localStorage.getItem("spkmod-translate-email")) || "";
var lunTranslateEngine = (window.localStorage && localStorage.getItem("spkmod-translate-engine")) || "google";
var lunMyMemoryQuotaHit = window.localStorage && localStorage.getItem("spkmod-mymemory-quota") === new Date().toDateString();
var lunGoogleQuotaHit = window.localStorage && localStorage.getItem("spkmod-google-quota") === new Date().toDateString();
function setTranslateEmail(email) {
	lunTranslateEmail = (email || "").trim();
	if (window.localStorage) localStorage.setItem("spkmod-translate-email", lunTranslateEmail);
}
function setTranslateEngine(engine) {
	lunTranslateEngine = (engine === "mymemory") ? "mymemory" : "google";
	if (window.localStorage) localStorage.setItem("spkmod-translate-engine", lunTranslateEngine);
	if (typeof lunPanelElements !== "undefined" && lunPanelElements.translateEngineSelect) {
		lunPanelElements.translateEngineSelect.value = lunTranslateEngine;
	}
}

var lunOutgoingSourceLang = (window.localStorage && localStorage.getItem("spkmod-outgoing-source-lang")) || "auto";
function setOutgoingSourceLang(lang) {
	lunOutgoingSourceLang = lang;
	if (window.localStorage) localStorage.setItem("spkmod-outgoing-source-lang", lang);
	if (lunPanelElements && lunPanelElements.outgoingTranslateSelect) lunPanelElements.outgoingTranslateSelect.value = lang;
}

const lunOutgoingLangPrefixes = {
	k: "ko", ko: "ko", kr: "ko", kor: "ko", korean: "ko",
	j: "ja", ja: "ja", jp: "ja", jpn: "ja", japanese: "ja",
	zh: "zh-CN", cn: "zh-CN", tw: "zh-TW", z: "zh-CN", "zh-cn": "zh-CN", "zh-tw": "zh-TW", chi: "zh-CN", chinese: "zh-CN",
	en: "en", e: "en", eng: "en", english: "en",
	es: "es", s: "es", spa: "es", spanish: "es",
	fr: "fr", f: "fr", fre: "fr", french: "fr",
	de: "de", g: "de", ger: "de", german: "de",
	pt: "pt", p: "pt", por: "pt", portuguese: "pt",
	ru: "ru", r: "ru", rus: "ru", russian: "ru"
};

function getEffectiveSourceLang(text) {
	if (lunOutgoingSourceLang && lunOutgoingSourceLang !== "auto") {
		return lunOutgoingSourceLang;
	}
	if (/[\uAC00-\uD7A3]/.test(text)) return "ko"; // Hangul
	if (/[\u3040-\u30FF]/.test(text)) return "ja"; // Hiragana/Katakana
	if (/[\u4E00-\u9FFF]/.test(text)) {
		return (spkmodLang === "zh-TW") ? "zh-TW" : "zh-CN"; // Hanzi
	}
	if (spkmodLang === "ja") return "ja";
	if (spkmodLang === "ko") return "ko";
	if (spkmodLang === "zh-TW") return "zh-TW";
	if (spkmodLang === "zh-CN") return "zh-CN";
	if (spkmodLang === "es-419") return "es";
	return "en-US";
}

var lunBadWordRegex = null;
function rebuildBadWordRegex() {
	var allWords = Object.values(lunBadWords).flat().filter(Boolean);
	if (!allWords.length) {
		lunBadWordRegex = null;
		return;
	}

	var escaped = allWords.map(w => {
		let clean = w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		if (/^[a-zA-Z0-9_]+$/.test(w)) {
			return "\\b" + clean + "\\b";
		}
		return clean;
	});

	lunBadWordRegex = new RegExp(escaped.join("|"), "giu");
}

function filterName(name) {
	if (!lunFilterEnabled || !lunBadWordRegex || typeof name !== "string") return name;
	return name.replace(lunBadWordRegex, m => "*".repeat(m.length));
}

loadAllBadWordLists();

var spkmodTranslations = (function() {
	try {
		if (typeof window !== "undefined" && window.localStorage) {
			const cached = localStorage.getItem("spkmod-translations-cache");
			if (cached) return JSON.parse(cached);
		}
	} catch (_) {}
	return {};
})();

var spkmodLang = (window.localStorage && localStorage.getItem("spkmod-lang")) || "en";

(async function() {
	try {
		const res = await fetch("https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/main/translations.json?t=" + Date.now(), { cache: "no-store" });
		if (res && res.ok) {
			const data = await res.json();
			if (data && data.en) {
				spkmodTranslations = data;
				if (typeof window !== "undefined" && window.localStorage) {
					try {
						localStorage.setItem("spkmod-translations-cache", JSON.stringify(data));
					} catch (_) {}
				}
				if (!spkmodTranslations[spkmodLang]) spkmodLang = "en";
				if (typeof refreshI18n === "function") refreshI18n();
			}
		}
	} catch (e) {
		console.warn("[SpeakiMod+] Failed to load translations.json from GitHub:", e);
	}
})();

function t(key, ...args) {
	var str = (spkmodTranslations[spkmodLang] && spkmodTranslations[spkmodLang][key])
		|| (spkmodTranslations.en && spkmodTranslations.en[key])
		|| key;
	args.forEach((a, i) => { str = str.split(`{${i}}`).join(a); });
	return str;
}

function tCustom(key, fallback, ...args) {
	var str = (typeof spkmodTranslations !== "undefined" && spkmodTranslations[spkmodLang] && spkmodTranslations[spkmodLang][key])
		|| (typeof spkmodTranslations !== "undefined" && spkmodTranslations.en && spkmodTranslations.en[key]);
	if (!str) return fallback || key;
	args.forEach((a, i) => { str = str.split(`{${i}}`).join(a); });
	return str;
}
window.tCustom = tCustom;

function getZoneName(zoneId) {
	const zid = String(zoneId);
	const localName = spkmodTranslations[spkmodLang]?.mapLocations?.[zid]
		|| spkmodTranslations.en?.mapLocations?.[zid];
	if (localName) return localName;
	try {
		const gameName = typeof window.i18n === "function" ? window.i18n(`content.zone.${zoneId}.name`) : null;
		if (gameName && !gameName.startsWith("content.zone")) return gameName;
	} catch (e) {}
	return `Zone ${zoneId}`;
}

let _zoneNameToIdMap = null;
function getZoneIdFromName(zoneName) {
	const fromFallback = zoneName.match(/^(?:Zone|존|ゾーン|區域|区域) (\d+)$/)?.[1];
	if (fromFallback != null) return fromFallback;

	if (_zoneNameToIdMap == null) {
		_zoneNameToIdMap = new Map();

		if (typeof window.i18nMap === "object" && window.i18nMap != null) {
			for (const langTranslation of Object.values(window.i18nMap)) {
				if (typeof langTranslation === "object") {
					for (const key of Object.keys(langTranslation)) {
						const zoneId = key.match(/^content.zone.(\d+).name$/)?.[1];
						if (zoneId != null && !_zoneNameToIdMap.has(langTranslation[key])) {
							_zoneNameToIdMap.set(langTranslation[key], Number(zoneId));
						}
					}
				}
			}
		}

		if (typeof window.i18n === "function") {
			const zonesToCheck = (typeof WorldZones !== "undefined" && Array.isArray(WorldZones))
				? WorldZones.map(z => z.zoneId)
				: [1,2,3,4,5,6,7,8,9,10,11,12,13,101,102,103,104,105,106,107,108,181,182,201,202,203,204,205,206,207,208,209,281,282,283,301,302,303,304,305,306,307,308,309,900,901,902,903,905,909,910,911,950];
			for (const zid of zonesToCheck) {
				try {
					const zname = window.i18n(`content.zone.${zid}.name`);
					if (zname && typeof zname === "string" && !zname.startsWith("content.zone") && !_zoneNameToIdMap.has(zname)) {
						_zoneNameToIdMap.set(zname, Number(zid));
					}
				} catch (_) {}
			}
		}

		for (const langTranslation of Object.values(spkmodTranslations)) {
			if (langTranslation != null && langTranslation.mapLocations != null && typeof langTranslation.mapLocations === "object") {
				for (const zoneId of Object.keys(langTranslation.mapLocations)) {
					if (!_zoneNameToIdMap.has(langTranslation.mapLocations[zoneId])) {
						_zoneNameToIdMap.set(langTranslation.mapLocations[zoneId], Number(zoneId));
					}
				}
			}
		}
	}
	return _zoneNameToIdMap.get(zoneName);
}

var spkmodI18nRenderers = [];
function refreshI18n() {
	spkmodI18nRenderers.forEach(fn => fn());
	if (typeof lunPanelElements !== 'undefined' && lunPanelElements.langSelect) {
		lunPanelElements.langSelect.innerHTML = "";
		Object.keys(spkmodTranslations).forEach(code => {
			let opt = document.createElement("option");
			opt.value = code;
			opt.innerText = spkmodTranslations[code].langName;
			opt.selected = code === spkmodLang;
			lunPanelElements.langSelect.appendChild(opt);
		});
	}
}

function setLanguage(lang) {
	if (!spkmodTranslations[lang] || lang === spkmodLang) return;
	const prevLang = spkmodLang;
	spkmodLang = lang;
	if (window.localStorage) localStorage.setItem("spkmod-lang", lang);

	const savedTarget = window.localStorage ? localStorage.getItem("spkmod-translate-target") : null;
	const prevMapped = (prevLang === "es-419" ? "es" : prevLang);
	if (!savedTarget || savedTarget === prevMapped) {
		const newMapped = (lang === "es-419" ? "es" : lang);
		lunTranslateTarget = newMapped;
		if (window.localStorage) localStorage.setItem("spkmod-translate-target", newMapped);
		if (typeof lunPanelElements !== 'undefined' && lunPanelElements.translateTargetSelect) {
			lunPanelElements.translateTargetSelect.value = newMapped;
		}
	}
	refreshI18n();
	if (typeof applySpkmodFont === "function" && typeof lunFontPreset !== "undefined" && lunFontPreset !== "default") {
		applySpkmodFont(lunFontPreset, undefined, false);
	}
}

window.getZoneName = getZoneName;
window.refreshI18n = refreshI18n;
window.setLanguage = setLanguage;

var lunHudElements = {
	playersNearby: null,
	expTrackerL1: null,
	expTrackerL2: null,
	channelTracker: null,
	footerMsg: null,
	zoneId: null,
	pinnedQuest: {
		panel: null,
		content: null,
		pbar: null
	},
	currencyTracker: null,
	minigameTracker: null,
	settingsModal: null,
	eventModal: null,
	patchNotesModal: null,
	statsModal: null,
	hotkeysModal: null,
	effectsModal: null,
	editsModal: null,
	jukeboxModal: null,
	customCssModal: null,
	resourcePackModal: null
};
var customCssModalElements = {
	headerRow: null,
	headerTitle: null,
	statusBadge: null,
	profileLabel: null,
	profileSelect: null,
	newBtn: null,
	renameBtn: null,
	deleteBtn: null,
	enableLabel: null,
	enableToggle: null,
	saveBtn: null,
	livePreviewLabel: null,
	livePreviewToggle: null,
	snippetsSelect: null,
	exportSelect: null,
	exportBtn: null,
	importBtn: null,
	resetBtn: null,
	textarea: null,
	resizeHandle: null,
	tipLabel: null
};
var resourcePackModalElements = {
	headerRow: null,
	headerTitle: null,
	statusBadge: null,
	enableLabel: null,
	enableToggle: null,
	presetLabel: null,
	presetSelect: null,
	saveBtn: null,
	restoreBtn: null,
	exportPackBtn: null,
	importPackBtn: null,
	searchInput: null,
	catSelect: null,
	blocksContainer: null,
	resizeHandle: null,
	tipLabel: null
};
var eventModalElements = {
	headerTitle: null,
	titleText: null,
	statusBadge: null,
	periodText: null,
	bestScoreText: null,
	playsRemainingText: null,
	refreshBtn: null
};
var patchNotesModalElements = {
	headerTitle: null,
	contentContainer: null
};
var hotkeysModalElements = {
	headerTitle: null,
	contentContainer: null
};
var statsModalElements = {
	headerTitle: null,
	sessionTimeLabel: null,
	sessionTimeVal: null,
	pingLabel: null,
	pingVal: null,
	fpsVal: null,
	dailyResetLabel: null,
	dailyResetVal: null,
	minigameLabel: null,
	minigameVal: null,
	levelProgressVal: null,
	levelExpNumbers: null,
	levelProgressBar: null,
	expGainedLabel: null,
	expGainedVal: null,
	expRateLabel: null,
	expRateVal: null,
	timeToLevelLabel: null,
	timeToLevelVal: null,
	currencyLabel: null,
	currencyBalancesVal: null,
	goldGainedLabel: null,
	goldGainedVal: null,
	elifGainedLabel: null,
	elifGainedVal: null,
	spkCoinGainedLabel: null,
	spkCoinGainedVal: null,
	resetBtn: null
};
var lunPanelElements = {
	targetZone: null,
	resetCameraBtn: null,
	walkToPortalBtn: null,
	headerBtn: null,
	settingsBtn: null,
	jukeboxBtn: null,
	danceBtn: null,
	autoJumpBtn: null,
	chowayoBtn: null,
	heartsBtn: null,
	autoHeartsBtn: null,
	petBtn: null,
	ritualBtn: null,
	partnerDanceBtn: null,
	turntableBtn: null,
	speedLabel: null,
	turnToCameraBtn: null,
	watchBtn: null,
	followBtn: null,
	stareBtn: null,
	panelFollowBtn: null,
	shakeBtn: null,
	superShakeBtn: null,
	hyperShakeBtn: null,
	pumpkinCartTexBtn: null,
	pumpkinCartTexBtn1: null,
	pumpkinCartTexBtn2: null,
	pumpkinCartTexBtn3: null,
	pinnedQuestHeader: null,
	langSelect: null,
	settingsHeader: null,
	settingsResizeHandle: null,
	customCssSettingsBtn: null,
	customCssSectionBtn: null,
	resourcePackSettingsBtn: null,
	resourcePackSectionBtn: null,
	filterToggleLabel: null,
	filterToggleInput: null,
	gmChatToggleLabel: null,
	gmChatToggleInput: null,
	friendChatToggleLabel: null,
	friendChatToggleInput: null,
	partyChatToggleLabel: null,
	partyChatToggleInput: null,
	chatRandomColorsLabel: null,
	chatRandomColorsToggleInput: null,
	mentionAlertToggleLabel: null,
	mentionAlertToggleInput: null,
	translateToggleLabel: null,
	translateToggleInput: null,
	translateTargetSelect: null,
	translateEngineLabel: null,
	translateEngineSelect: null,
	outgoingTranslateLabel: null,
	outgoingTranslateSelect: null,
	translateEmailInput: null,
	creditsLabel: null,
	translateEmailInfo: null,
	currencyTrackerLabel: null,
	currencyTrackerToggleInput: null,
	expRateUnitLabel: null,
	expRateIntervalLabel: null,
	expRateIntervalSelect: null,
	discordBtn: null,
	gamepadSettingsBtn: null,
	patchNotesBtn: null,
	eventBtn: null,
	minigameBtn: null,
	statsBtn: null,
	minigameTrackerLabel: null,
	minigameTrackerToggleInput: null,
	hideKnownBotsLabel: null,
	hideKnownBotsToggleInput: null,
	disableRightClickPinningLabel: null,
	disableRightClickPinningToggleInput: null,
	resolutionOverrideRow: null,
	resolutionOverrideLabel: null,
	resolutionOverrideInput: null,
	discordRpcLabel: null,
	discordRpcToggleInput: null,
	muteMinimizedLabel: null,
	muteMinimizedToggleInput: null,
	separatePanelLabel: null,
	separatePanelToggleInput: null,
	hidePlayerLevelsLabel: null,
	hidePlayerLevelsToggleInput: null,
	channelTrackerToggleLabel: null,
	channelTrackerToggleInput: null,
	telemetryToggleLabel: null,
	telemetryToggleInput: null,
	settingsCatGeneral: null,
	settingsCatHUD: null,
	localEffectsBtn: null,
	localEditsBtn: null,
	editsModalTitle: null,
	exportSettingsBtn: null,
	importSettingsBtn: null,
	resetPositionsBtn: null,
	fontPresetLabel: null,
	fontPresetSelect: null,
	customFontContainer: null,
	customFontInputLabel: null,
	customFontInput: null
};
var lunMenuFoldingLevel = 0;

var lunTickCount = 0;
var lunSleep = 0;
const lunTPS = 20;

var lunExpTrackerStartExp = 0;
var lunExpTrackerSpeed = 0;
var lunExpTrackerInitialized = false; 
var lunExpTrackerSamples = [];
var lunExpTrackerLastSampleTick = 0;

var lunChannelTrackerWindow = 60 * lunTPS; // [SpeakiMod+] Reduced from 25s to 60s
var lunChannelTrackerNextTicks = 0;


var lunCurrencyTrackerWindow = 60 * lunTPS; // [SpeakiMod+] Reduced from 25s to 60s
var lunCurrencyTrackerNextTicks = 0;
var lunLastGold = null;
var lunLastElif = null;
var lunLastSpkCoin = null;
var lunSessionStartGold = null;
var lunSessionStartElif = null;
var lunSessionStartSpkCoin = null;
var lunWalkToPortal = -1;
var lunAutoTravelTarget = null;
var lunCameraLocked = false;
var lunNametagMode = 0; 
if (window.localStorage) {
	try {
		const savedNametagMode = localStorage.getItem("spkmod-nametag-mode");
		if (savedNametagMode !== null) {
			const parsedMode = parseInt(savedNametagMode, 10);
			if (!isNaN(parsedMode) && parsedMode >= 0 && parsedMode <= 3) lunNametagMode = parsedMode;
		}
	} catch (_) {}
}
window.lunNametagMode = lunNametagMode;
const NAMETAG_MODES = ["showAllNametags", "keepPartyNametags", "keepFriendsNametags", "hideAllNametags"];

var lunFriendNicknames = new Set();
if (window.localStorage) {
	try {
		const cached = localStorage.getItem("spkmod-friend-cache");
		if (cached) {
			const arr = JSON.parse(cached);
			if (Array.isArray(arr)) arr.forEach(n => lunFriendNicknames.add(n.toLowerCase()));
		}
	} catch (e) { }
}

var lunFriendshipNicknamesById = new Map();

function replaceFriendNicknames(data) {
    const friends = data?.friends;

    if (!Array.isArray(friends)) return;

    const nextNames = new Set();
    const nextIds = new Map();

    for (const f of friends) {
        if (typeof f?.nickname !== "string") continue;
        const nick = f.nickname.trim().toLowerCase();
        if (!nick) continue;
        nextNames.add(nick);
        if (f.friendshipId != null) nextIds.set(String(f.friendshipId), nick);
    }

    lunFriendNicknames.clear();

    for (const nick of nextNames) lunFriendNicknames.add(nick);

    lunFriendshipNicknamesById = nextIds;

    try {
        localStorage.setItem("spkmod-friend-cache", JSON.stringify([...lunFriendNicknames]));
    } catch (_) {}
}

var lunFriendChatHighlightEnabled = (window.localStorage && localStorage.getItem("spkmod-friend-highlight-enabled")) === "true";

function setFriendChatHighlightEnabled(enabled) {
	lunFriendChatHighlightEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-friend-highlight-enabled", lunFriendChatHighlightEnabled ? "true" : "false");
}

var lunPartyChatHighlightEnabled = (window.localStorage && localStorage.getItem("spkmod-party-highlight-enabled")) === "true";

function setPartyChatHighlightEnabled(enabled) {
	lunPartyChatHighlightEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-party-highlight-enabled", lunPartyChatHighlightEnabled ? "true" : "false");
}

var lunLastFriendFetchTime = 0;
var lunFriendFetchInProgress = false;
var lunFriendFetchQueued = false;

function fetchFriendsList(force = false) {
	const now = Date.now();
	if (!force && now - lunLastFriendFetchTime < 60000) return;
	if (lunFriendFetchInProgress) {
		if (force) lunFriendFetchQueued = true;
		return;
	}
	let token = (typeof window.getNativeAuthToken === "function" ? window.getNativeAuthToken() : "") ||
	            (typeof getAuthToken === "function" ? getAuthToken() : "") || 
	            (typeof lunSpkAuthToken === "string" ? lunSpkAuthToken : "");
	if (token.toLowerCase().startsWith("bearer ")) {
		token = token.substring(7).trim();
	}
	lunFriendFetchInProgress = true;
	const endpoint = (typeof lunActivePingEndpoint !== 'undefined' && lunActivePingEndpoint) || 
	                 (typeof window.lunActiveApiEndpoint !== 'undefined' && window.lunActiveApiEndpoint) || 
	                 "https://sr1.overture.io.kr";
	const targetUrl = endpoint + "/api/friend/list";
	const headers = {};
	if (token) headers["authorization"] = `Bearer ${token}`;
	
	const applyFriendData = replaceFriendNicknames;

	(async () => {
		try {
			let res = await fetch(targetUrl, {
				method: "GET",
				headers: headers,
				mode: "cors"
			});

			if (res && res.status === 401) {
				// Token expired. Invalidate cached token
				window.speakiAuthToken = "";
				lunSpkAuthToken = "";
				if (typeof window.refreshAuthToken === "function") {
					try {
						const refreshed = await window.refreshAuthToken();
						if (refreshed) {
							let newToken = (typeof window.getNativeAuthToken === "function" ? window.getNativeAuthToken() : "") ||
							               (typeof getAuthToken === "function" ? getAuthToken() : "") || 
							               (typeof lunSpkAuthToken === "string" ? lunSpkAuthToken : "");
							if (newToken.toLowerCase().startsWith("bearer ")) {
								newToken = newToken.substring(7).trim();
							}
							if (newToken) {
								headers["authorization"] = `Bearer ${newToken}`;
								res = await fetch(targetUrl, {
									method: "GET",
									headers: headers,
									mode: "cors"
								});
							}
						}
					} catch (_) {}
				}
			}

			if (res && res.ok) {
				const data = await res.json();
				applyFriendData(data);
			}
		} catch (err) {
			console.warn("[SpeakiMod+] Failed to fetch friend list:", err);
		} finally {
			// Ensure cooldown is ALWAYS recorded to prevent per-frame request flood
			lunLastFriendFetchTime = Date.now();
			lunFriendFetchInProgress = false;
			if (lunFriendFetchQueued) {
				lunFriendFetchQueued = false;
				fetchFriendsList(true);
			}
		}
	})();
}

const lunKnownBotNames = ["GniloeAlo3", "Gniloe41o3", "Gniloe41oe", "GniloeA1oe", "GniloeA1o3", "GniloeA103", "toufufuton", "uhu", "clay79", "key7catace", "6air9dog5", "53lake", "1sealace", "2wave0bay1", "19owlfern", "red17wave", "nekomaru2", "king9SPK5", "ash6mist7", "takutaku8", "스핔이3984", "SPKtree21", "SPKleaf37", "3clayowl5", "3bayhero9", "99duckdog", "cow6SPK2", "fire8SPK7", "Takutaku3", "Takutaku4", "kutakuta", "0birdice2", "wind2SPK8", "SPKbay23", "3sky8king", "star2bat04", "map3kite4", "FrznTeardrop", "sun9SPK0", "5SPKsnow2", "SPKclay15", "frogfox40", "5air7moon", "SPKair00", "SPKblue88", "moss4ant36", "9gem4wind", "SPKjade05", "SPKfin06", "SPKdeer69", "OO0OOOOO72", "llIlIIll62", "lIllIIIl39", "IIlIIIlI45", "00OO0OO099", "sorakara", "karakaze", "rainant78", "SPKlake78", "takutaku7", "rnmrrnvrm2", "SPKfern89", "llIIllll38", "SPKtree03", "OO0O00OO30", "SPKecho92", "OOOOO0O081", "takutaku6", "kutakuta2", "GOODSPIKI", "BADSPIKI", "NEXThobagi", "QAZWSXEDC", "kqland", "SPKsun83", "CHOWAYOHOBAG", "AdmiralSPK", "xHunterSPKx", "HOBAGIRENGOU", "TOKAlhobagi", "chowayooo5", "NELSPK", "TOKAIhobagi", "hobagihouse", "NORDSPEAKI", "LOGIN", "FunnySPK", "JpTHEspeaki", "MEXICOSPK", "JAXNOTD", "DDDDDDAA", "NOMUT", "alexasojk", "gotobasupk", "Nyandal", "amejiso", "SPKcalm33", "SPKtree51", "snowfin05", "fernhat76", "SPKhero04", "jadenet92", "000OO00O82", "00O000O081", "frogbee79", "00O000O081", "OOOOOO0030", "OOOOOO0081", "IIIIIII06", "lllllll06", "IIIIIII47", "lllllll47", "SPKecho92", "SPKtree03", "SPKstar65", "blueash78", "SPKfrog11", "OOOOOOO030", "OOOOOOO081", "IIIIIIII06", "IIIIIIII47", "IIlIIIll47", "OO0O00OO30", "IIlIIIll47", "OO0O00OO30", "llIIlIll06", "IIlIIIll47", "OOOOO0O081", "llIIlIll06", "OO0O00OO30", "SPKfern89", "SPKtree03", "rnmrrnvrm2", "SPKblue93", "SPKrain63", "SPKecho98", "OOOOO0O081", "duckjay85", "SPKstar65", "echosun86", "llIIllll38", "takutaku6", "kutakuta2", "takutaku7", "GniloeAlo3", "Gniloe4103", "Gniloe41o3", "GniloeAl03", "Gniloe41oe", "GniloeA1o3", "Gniloe41o3", "GniloeAlo3", "GniloeAl03", "Gniloe41oe"];

var lunHideKnownBotsEnabled = !(window.localStorage && localStorage.getItem("spkmod-hide-known-bots") === "false");
var lunViewClip = false;
var lunFirstPersonPitch = parseFloat((window.localStorage && localStorage.getItem("spkmod-fp-pitch")) || "0.5");
var lunFollowTargetName = null;

var lunGmChatHighlightEnabled = (window.localStorage && localStorage.getItem("spkmod-gmchat-enabled")) === "true";
var lunMentionAlertEnabled = (window.localStorage && localStorage.getItem("spkmod-mention-enabled")) !== "false";

function setGmChatHighlightEnabled(enabled) {
	lunGmChatHighlightEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-gmchat-enabled", lunGmChatHighlightEnabled ? "true" : "false");
}

function setMentionAlertEnabled(enabled) {
	lunMentionAlertEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-mention-enabled", lunMentionAlertEnabled ? "true" : "false");
}

var lunMentionPingEnabled = (window.localStorage && localStorage.getItem("spkmod-mention-ping")) !== "false";
function setMentionPingEnabled(enabled) {
	lunMentionPingEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-mention-ping", lunMentionPingEnabled ? "true" : "false");
}

let _activePingAudio = null;
function playPingSound() {
    // If Mention Ping Sound is enabled, always sound regardless of Mute when Minimized / alt-tab
    if (typeof lunMentionPingEnabled !== "undefined" && !lunMentionPingEnabled) return;
    try {
        _activePingAudio = new window.Audio("https://speakirpg.overture.io.kr/audio/voice/speaki/No.mp3");
        _activePingAudio.volume = 0.6;
        _activePingAudio.play().catch(e => {
            console.warn("[SpeakiMod+] Failed to play ping sound", e);
        });
    } catch (e) {}
}

function setHideKnownBotsEnabled(enabled) {
	lunHideKnownBotsEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-hide-known-bots", lunHideKnownBotsEnabled ? "true" : "false");
	if (lunPanelElements.hideKnownBotsToggleInput) lunPanelElements.hideKnownBotsToggleInput.checked = lunHideKnownBotsEnabled;
	updateKnownBotVisibility();
}

var lunAutoBannedLevel1s = new Set();
var lunActiveBotWaveMinId = Infinity;

function isKnownBotName(name, level, accountId) {
	if (typeof name !== "string") return false;
	const normalizedName = name.trim();
	const lowerName = normalizedName.toLocaleLowerCase();
	
	let isBot = false;
	const parsedLevel = typeof level === "number" ? level : parseInt(level);
	
	if (lunKnownBotNames.some(botName => botName.trim().toLocaleLowerCase() === lowerName)) {
		isBot = true;
	} else if (!isNaN(parsedLevel)) {
		if (parsedLevel === 1 && lunAutoBannedLevel1s.has(lowerName)) {
			isBot = true;
		}
		if (!isBot && parsedLevel <= 2) {
			if (/^[Il]{6,10}[0-9]{2}$/.test(normalizedName)) isBot = true;
			if (/^[O0]{6,10}[0-9]{2}$/.test(normalizedName)) isBot = true;
		}
		if (!isBot && parsedLevel === 1) {
			if (lowerName.includes("spk") || lowerName.includes("스핔이")) isBot = true;
			else if (/^[a-z]+\d+[a-z]+\d+$/i.test(normalizedName)) isBot = true;
			else if (/^\d+[a-z]+\d+$/i.test(normalizedName)) isBot = true;
			else if (/^\d+[a-z]+\d+[a-z]+$/i.test(normalizedName)) isBot = true;
			else if (/^\d{1,2}[a-z]+$/i.test(normalizedName)) isBot = true;
			else if (/^[a-z]+\d{1,2}[a-z]+$/i.test(normalizedName)) isBot = true;
			else if (/^\d+[a-z]+\d+[a-z]+\d+$/i.test(normalizedName)) isBot = true;
		}
	}
	
	const accountIdNum = parseInt(accountId) || 0;
	
	if (isBot) {
		if (accountIdNum > 0) {
			lunActiveBotWaveMinId = Math.min(lunActiveBotWaveMinId, accountIdNum);
		}
		return true;
	}
	
	// Dynamic Strict Net with Loose Name Matching
	if (accountIdNum > 0 && accountIdNum >= lunActiveBotWaveMinId && parsedLevel === 1) {
		const letters = lowerName.replace(/[^a-z]/g, '');
		const isLooseMatch = lunKnownBotNames.some(b => {
			const p = b.toLowerCase().replace(/[^a-z]/g, '').substring(0, 5);
			return p.length >= 4 && letters.includes(p);
		});
		if (isLooseMatch) {
			return true;
		}
	}
	
	return false;
}

var lunSpkAuthToken = "";
var cachedBlockedNames = new Set();
var cachedBlockIds = new Map();
async function spkmodFetchBlocklist() {
    if (!lunSpkAuthToken) {
        setTimeout(spkmodFetchBlocklist, 1000); // Retry until we steal the token
        return;
    }
    try {
        const apiUrl = (typeof window.lunActiveApiEndpoint !== 'undefined' ? window.lunActiveApiEndpoint : "https://sr1.overture.io.kr") + "/api/block";
        const res = await window.fetch(apiUrl, {
            method: "GET",
            cache: "no-store",
            headers: {
                "Authorization": lunSpkAuthToken
            }
        });
        if (res.ok) {
            const data = await res.json();
            if (data && data.blocks) {
                cachedBlockedNames.clear();
                cachedBlockIds.clear();
                data.blocks.forEach(b => {
                    if (b.nickname) {
                        let n = b.nickname.trim().toLocaleLowerCase();
                        cachedBlockedNames.add(n);
                        if (b.blockId) cachedBlockIds.set(String(b.blockId), n);
                    }
                });
                if (typeof updateKnownBotVisibility === 'function') updateKnownBotVisibility();
            }
        }
    } catch (e) {
        console.warn("[SpeakiMod+] Failed to fetch native blocklist:", e);
    }
}
// Run it once on load
// Intercept window.fetch
const lunBlocklistFetchOrig = window.fetch;
window.fetch = async function(...args) {
    try {
        let auth = "";
        if (args[1] && args[1].headers && args[1].headers.Authorization) auth = args[1].headers.Authorization;
        else if (args[1] && args[1].headers && typeof args[1].headers.get === 'function') auth = args[1].headers.get('Authorization') || "";
        else if (args[0] && args[0].headers && typeof args[0].headers.get === 'function') auth = args[0].headers.get('Authorization') || "";
        
        if (auth && auth.startsWith("Bearer ") && lunSpkAuthToken !== auth) {
            lunSpkAuthToken = auth;
            setTimeout(spkmodFetchBlocklist, 100);
        }
    } catch(e) {}
    const response = await lunBlocklistFetchOrig.apply(this, args);
    try {
        const url = typeof args[0] === 'string' ? args[0] : (args[0]?.url || '');
        let method = 'GET';
        if (args[1] && args[1].method) method = args[1].method;
        else if (args[0] && args[0].method) method = args[0].method;
        method = method.toUpperCase();

        if (url.includes('/api/block')) {
            response.clone().json().then(data => {
                if (data && data.blocks) {
                    cachedBlockedNames.clear();
                    cachedBlockIds.clear();
                    data.blocks.forEach(b => {
                        if (b.nickname) {
                            let n = b.nickname.trim().toLocaleLowerCase();
                            cachedBlockedNames.add(n);
                            if (b.blockId) cachedBlockIds.set(String(b.blockId), n);
                        }
                    });
                    if (typeof updateKnownBotVisibility === 'function') updateKnownBotVisibility();
                } else if (data && data.nickname) {
                    let n = data.nickname.trim().toLocaleLowerCase();
                    cachedBlockedNames.add(n);
                    if (data.blockId) cachedBlockIds.set(String(data.blockId), n);
                    if (typeof updateKnownBotVisibility === 'function') updateKnownBotVisibility();
                }
            }).catch(() => {});
        }
		if (url.includes('/api/friend/list')) {
			response.clone().json().then(replaceFriendNicknames).catch(() => {});
		}
		const friendDeleteMatch = url.match(/\/api\/friend\/([^/?#]+)\/?$/);
		if (method === "DELETE" && response.ok && friendDeleteMatch) {
			const friendshipId = decodeURIComponent(friendDeleteMatch[1]);
			const deletedNickname = lunFriendshipNicknamesById.get(friendshipId);
			if (deletedNickname) {
				lunFriendNicknames.delete(deletedNickname);
				lunFriendshipNicknamesById.delete(friendshipId);
				try {
					localStorage.setItem("spkmod-friend-cache", JSON.stringify([...lunFriendNicknames]));
				} catch (_) {}
			}
			fetchFriendsList(true);
		}
        if (url.includes('/api/block') && method === 'DELETE') {
            try {
                let parts = url.split('/');
                let bId = parts[parts.length - 1];
                if (bId && cachedBlockIds.has(bId)) {
                    cachedBlockedNames.delete(cachedBlockIds.get(bId));
                    cachedBlockIds.delete(bId);
                    if (typeof updateKnownBotVisibility === 'function') updateKnownBotVisibility();
                }
            } catch(e) {}
            setTimeout(spkmodFetchBlocklist, 1500);
        }
    } catch (e) {}
    return response;
};

// Intercept XMLHttpRequest
const origOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url) {
    this._spkUrl = url;
    this._spkMethod = method;
    return origOpen.apply(this, arguments);
};
const origSetReqHeader = XMLHttpRequest.prototype.setRequestHeader;
XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
    if (header.toLowerCase() === 'authorization' && value && value.startsWith('Bearer ') && lunSpkAuthToken !== value) {
        lunSpkAuthToken = value;
        setTimeout(spkmodFetchBlocklist, 100);
    }
    return origSetReqHeader.apply(this, arguments);
};
const origSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function() {
    this.addEventListener('load', function() {
        if (this._spkUrl && typeof this._spkUrl === 'string' && this._spkUrl.includes('/api/block')) {
            try {
                const data = JSON.parse(this.responseText);
                if (data && data.blocks) {
                    cachedBlockedNames.clear();
                    cachedBlockIds.clear();
                    data.blocks.forEach(b => {
                        if (b.nickname) {
                            let n = b.nickname.trim().toLocaleLowerCase();
                            cachedBlockedNames.add(n);
                            if (b.blockId) cachedBlockIds.set(String(b.blockId), n);
                        }
                    });
                    if (typeof updateKnownBotVisibility === 'function') updateKnownBotVisibility();
                } else if (data && data.nickname) {
                    let n = data.nickname.trim().toLocaleLowerCase();
                    cachedBlockedNames.add(n);
                    if (data.blockId) cachedBlockIds.set(String(data.blockId), n);
                    if (typeof updateKnownBotVisibility === 'function') updateKnownBotVisibility();
                }
            } catch(e) {}
            if (this._spkMethod && typeof this._spkMethod === 'string' && this._spkMethod.toUpperCase() === 'DELETE') {
                try {
                    let parts = this._spkUrl.split('/');
                    let bId = parts[parts.length - 1];
                    if (bId && cachedBlockIds.has(bId)) {
                        cachedBlockedNames.delete(cachedBlockIds.get(bId));
                        cachedBlockIds.delete(bId);
                        if (typeof updateKnownBotVisibility === 'function') updateKnownBotVisibility();
                    }
                } catch(e) {}
                setTimeout(spkmodFetchBlocklist, 1500);
            }
        }
    });
    return origSend.apply(this, arguments);
};



function isBlockedUser(name) {
    if (typeof name !== "string") return false;
    const clean = name.trim().toLocaleLowerCase();
    if (!clean) return false;
    if (cachedBlockedNames.has(clean)) return true;
    try {
        const stored = JSON.parse(localStorage.getItem("sr1_blocked_players") || "[]");
        if (Array.isArray(stored) && stored.some(n => typeof n === "string" && n.trim().toLocaleLowerCase() === clean)) {
            cachedBlockedNames.add(clean);
            return true;
        }
    } catch (_) {}
    return false;
}

function updateKnownBotVisibility() {
	if (!gameState?.remotePlayers?.remotePlayers) return;
	gameState.remotePlayers.remotePlayers.forEach(player => {
		if (player?.container) {
			const accId = player.info?.userId || player.info?.id || player.info?.playerId;
			const isBot = lunHideKnownBotsEnabled && isKnownBotName(player.info?.name, player.info?.level, accId);
			const isBlocked = isBlockedUser(player.info?.name);
			const isWhitelisted = typeof isSolitudeWhitelisted === "function" && isSolitudeWhitelisted(player.info?.name);
			const hideBySolitude = lunHideAllOtherPlayers && !isWhitelisted;
			player.container.visible = !(hideBySolitude || isBot || isBlocked);
		}
	});
	if (lunHideAllOtherPlayers) {
		if (gameState?.remotePetRegistry?.pets) {
			for (const pet of gameState.remotePetRegistry.pets.values()) {
				const ownerName = pet?.info?.ownerName || pet?.ownerName || pet?.info?.name;
				const isWhitelisted = typeof isSolitudeWhitelisted === "function" && isSolitudeWhitelisted(ownerName);
				if (pet?.root) pet.root.visible = isWhitelisted;
				else if (pet?.container) pet.container.visible = isWhitelisted;
			}
		}
		if (gameState?.remoteDroneCoreRegistry?.droneCores) {
			for (const drone of gameState.remoteDroneCoreRegistry.droneCores.values()) {
				const ownerName = drone?.info?.ownerName || drone?.ownerName || drone?.info?.name;
				const isWhitelisted = typeof isSolitudeWhitelisted === "function" && isSolitudeWhitelisted(ownerName);
				if (drone?.root) drone.root.visible = isWhitelisted;
				else if (drone?.container) drone.container.visible = isWhitelisted;
			}
		}
	} else {
		if (gameState?.remotePetRegistry?.pets) {
			for (const pet of gameState.remotePetRegistry.pets.values()) {
				if (pet?.root && !pet.root.visible) pet.root.visible = true;
				else if (pet?.container && !pet.container.visible) pet.container.visible = true;
			}
		}
		if (gameState?.remoteDroneCoreRegistry?.droneCores) {
			for (const drone of gameState.remoteDroneCoreRegistry.droneCores.values()) {
				if (drone?.root && !drone.root.visible) drone.root.visible = true;
				else if (drone?.container && !drone.container.visible) drone.container.visible = true;
			}
		}
	}
}

function isKnownBotContainer(container) {
	if (!container || !gameState?.remotePlayers?.remotePlayers) return false;
	
	let current = container;
	while (current) {
		for (const player of gameState.remotePlayers.remotePlayers.values()) {
			if (player?.container === current) return isKnownBotName(player.info?.name, player.info?.level);
		}
		current = current.parent;
	}
	return false;
}

function isBlockedUserContainer(container) {
	if (!container || !gameState?.remotePlayers?.remotePlayers) return false;
	
	let current = container;
	while (current) {
		for (const player of gameState.remotePlayers.remotePlayers.values()) {
			if (player?.container === current) return isBlockedUser(player.info?.name);
		}
		current = current.parent;
	}
	return false;
}

function isKnownBotBubbleSource(source) {
	if (!source || !gameState?.remotePlayers?.remotePlayers) return false;
	if (isKnownBotContainer(source) || isKnownBotContainer(source.container)) return true;
	if (isKnownBotName(source.info?.name, source.info?.level, source.info?.userId || source.info?.id || source.info?.playerId)) return true;
	if (isKnownBotName(source.name, source.level, source.userId || source.id || source.playerId)) return true;

	for (const player of gameState.remotePlayers.remotePlayers.values()) {
		const playerInfo = player?.info;
		if (playerInfo && (source === playerInfo.playerId || source === playerInfo.id || source === playerInfo.userId)) {
			return isKnownBotName(playerInfo.name, playerInfo.level, playerInfo.userId || playerInfo.id || playerInfo.playerId);
		}
	}
	return false;
}

function isBlockedUserBubbleSource(source) {
	if (!source || !gameState?.remotePlayers?.remotePlayers) return false;
	if (isBlockedUserContainer(source) || isBlockedUserContainer(source.container)) return true;
	if (isBlockedUser(source.info?.name)) return true;
	if (isBlockedUser(source.name)) return true;

	for (const player of gameState.remotePlayers.remotePlayers.values()) {
		const playerInfo = player?.info;
		if (playerInfo && (source === playerInfo.playerId || source === playerInfo.id || source === playerInfo.userId)) {
			return isBlockedUser(playerInfo.name);
		}
	}
	return false;
}

function isSolitudeWhitelistedContainer(container) {
	if (!container || !gameState?.remotePlayers?.remotePlayers || typeof isSolitudeWhitelisted !== "function") return false;
	let current = container;
	while (current) {
		for (const player of gameState.remotePlayers.remotePlayers.values()) {
			if (player?.container === current) return isSolitudeWhitelisted(player.info?.name);
		}
		current = current.parent;
	}
	return false;
}

function isSolitudeWhitelistedBubbleSource(source) {
	if (!source || !gameState?.remotePlayers?.remotePlayers || typeof isSolitudeWhitelisted !== "function") return false;
	if (isSolitudeWhitelistedContainer(source) || isSolitudeWhitelistedContainer(source.container)) return true;
	if (isSolitudeWhitelisted(source.info?.name)) return true;
	if (isSolitudeWhitelisted(source.name)) return true;

	for (const player of gameState.remotePlayers.remotePlayers.values()) {
		const playerInfo = player?.info;
		if (playerInfo && (source === playerInfo.playerId || source === playerInfo.id || source === playerInfo.userId)) {
			return isSolitudeWhitelisted(playerInfo.name);
		}
	}
	return false;
}

function hookKnownBotHeartEmotes() {
	const bloomEffects = gameState?.bloomEffects;
	if (!bloomEffects || typeof bloomEffects.spawnHearts !== "function" || bloomEffects.__speakiKnownBotHooked) return;

	const originalSpawnHearts = bloomEffects.spawnHearts.bind(bloomEffects);
	bloomEffects.spawnHearts = function(container, ...args) {
		if (lunHideAllOtherPlayers && !isSolitudeWhitelistedContainer(container)) return;
		if (lunHideKnownBotsEnabled && isKnownBotContainer(container)) return;
		if (isBlockedUserContainer(container)) return;
		return originalSpawnHearts(container, ...args);
	};
	bloomEffects.__speakiKnownBotHooked = true;
}

function containsRemoteEmote(value, seen = new Set()) {
	if (typeof value === "number") return Number.isInteger(value) && value >= 1 && value <= 8;
	if (!value || typeof value !== "object" || seen.has(value)) return false;
	seen.add(value);

	for (const key of ["emote", "emoteId", "emoteID", "emoteType", "action", "actionId", "id", "val", "value", "data"]) {
		if (value[key] !== undefined && containsRemoteEmote(value[key], seen)) return true;
	}
	return false;
}

function hookKnownBotPlayerEmotes(player) {
	if (!player || player.__speakiKnownBotEmotesHooked) return;
	const methodNames = new Set();
	let current = player;
	while (current && current !== Object.prototype) {
		Object.getOwnPropertyNames(current).forEach(name => methodNames.add(name));
		current = Object.getPrototypeOf(current);
	}

	for (const name of methodNames) {
		if (name === "constructor" || !/emote|emotion|action|animation|effect|update|handle|receive|message/i.test(name)) continue;
		const original = player[name];
		if (typeof original !== "function") continue;
		try {
			player[name] = function(...args) {
				if (lunHideKnownBotsEnabled && isKnownBotName(this.info?.name, this.info?.level) && args.some(arg => containsRemoteEmote(arg))) {
					return;
				}
				return original.apply(this, args);
			};
		} catch (err) {}
	}
	player.__speakiKnownBotEmotesHooked = true;
}

function hookKnownBotPlayerEmotesForAll() {
	if (!gameState?.remotePlayers?.remotePlayers) return;
	gameState.remotePlayers.remotePlayers.forEach(hookKnownBotPlayerEmotes);
}

function resolveRemotePlayerById(playerId) {
    if (!gameState?.remotePlayers) return null;
    const rp = gameState.remotePlayers;
    let p = rp.get?.(playerId) || rp.get?.(Number(playerId)) || rp.get?.(String(playerId));
    if (p) return p;
    if (rp.remotePlayers instanceof Map) {
        p = rp.remotePlayers.get(playerId) || rp.remotePlayers.get(Number(playerId)) || rp.remotePlayers.get(String(playerId));
        if (p) return p;
        for (const item of rp.remotePlayers.values()) {
            if (item?.info?.playerId == playerId) return item;
        }
    } else if (typeof rp.values === "function") {
        for (const item of rp.values()) {
            if (item?.info?.playerId == playerId) return item;
        }
    }
    return null;
}

function isSilencedPlayer(player) {
    if (!player) return false;
    const name = player.info?.name || player.name;
    const isWhitelisted = typeof isSolitudeWhitelisted === "function" && isSolitudeWhitelisted(name);
    if (lunHideAllOtherPlayers && !isWhitelisted) return true;
    if (!name || typeof name !== "string") return false;
    const lower = name.trim().toLocaleLowerCase();
    if (!lower) return false;
    if (isBlockedUser(name)) return true;
    if (Array.isArray(lunKnownBotNames) && lunKnownBotNames.some(b => typeof b === "string" && b.trim().toLocaleLowerCase() === lower)) return true;
    const accId = player.info?.userId || player.info?.id || player.info?.playerId;
    const level = player.info?.level || player.level;
    if (typeof isKnownBotName === "function" && isKnownBotName(name, level, accId)) return true;
    return false;
}

function hookBlockedUserVoice() {
    if (typeof gameState === "undefined" || !gameState) return;
    if (gameState.__speakiBlockedUserVoiceHooked) return;

    if (typeof gameState.handleEmote === "function") {
        const originalHandleEmote = gameState.handleEmote;

        gameState.handleEmote = function(e) {
            if (!e || e.playerId === this.myPlayerId) {
                return originalHandleEmote.call(this, e);
            }

            let remotePlayer = resolveRemotePlayerById(e.playerId);
            if (!remotePlayer && gameState?.remotePlayers) {
                const list = gameState.remotePlayers.remotePlayers instanceof Map
                    ? gameState.remotePlayers.remotePlayers.values()
                    : (typeof gameState.remotePlayers.values === "function" ? gameState.remotePlayers.values() : []);
                for (const p of list) {
                    if (p?.info?.playerId == e.playerId) {
                        remotePlayer = p;
                        break;
                    }
                }
            }

            if (isSilencedPlayer(remotePlayer)) {
                return; // Suppress emote completely: no animations, no voice lines, no sound!
            }

            return originalHandleEmote.call(this, e);
        };
    }

    if (typeof gameState.remoteSoundDistance === "function") {
        const originalSoundDist = gameState.remoteSoundDistance;

        gameState.remoteSoundDistance = function(pos) {
            if (pos && gameState.remotePlayers) {
                const list = gameState.remotePlayers.remotePlayers instanceof Map
                    ? gameState.remotePlayers.remotePlayers.values()
                    : (typeof gameState.remotePlayers.values === "function" ? gameState.remotePlayers.values() : []);

                for (const p of list) {
                    if (isSilencedPlayer(p)) {
                        const cPos = p?.container?.position;
                        if (cPos === pos || (cPos && Math.hypot(cPos.x - pos.x, cPos.z - pos.z) < 0.1)) {
                            return 999999; // Distance >= 25 mutes audio to 0 volume
                        }
                    }
                }
            }
            return originalSoundDist.apply(this, arguments);
        };
    }

    gameState.__speakiBlockedUserVoiceHooked = true;
}

var lunChatTimestampsEnabled = (window.localStorage && localStorage.getItem("spkmod-chat-timestamps")) === "true";
function setChatTimestampsEnabled(enabled) {
	lunChatTimestampsEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-chat-timestamps", lunChatTimestampsEnabled ? "true" : "false");
}

var lunChatRandomColorsEnabled = (window.localStorage && localStorage.getItem("spkmod-chat-random-colors")) === "true";
function setChatRandomColorsEnabled(enabled) {
	lunChatRandomColorsEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-chat-random-colors", lunChatRandomColorsEnabled ? "true" : "false");
	if (typeof document !== "undefined" && document.body) {
		document.body.classList.toggle("spkmod-chat-player-colors-on", lunChatRandomColorsEnabled);
	}
}

var lunLowHpWarningEnabled = (window.localStorage && localStorage.getItem("spkmod-low-hp-warning")) === "true";
function setLowHpWarningEnabled(enabled) {
	lunLowHpWarningEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-low-hp-warning", lunLowHpWarningEnabled ? "true" : "false");
}

var lunPanelLeft = (window.localStorage && localStorage.getItem("spkmod-panel-left")) === "true";
function setPanelLeft(enabled) {
	lunPanelLeft = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-panel-left", lunPanelLeft ? "true" : "false");
	if (lunPanelLeft) {
		document.body.classList.add("spkmod-panel-left-mode");
	} else {
		document.body.classList.remove("spkmod-panel-left-mode");
	}
}


let isMobileEnv = (typeof window.speakiMobile !== "undefined" || (typeof navigator !== "undefined" && /mobi|android/i.test(navigator.userAgent)));
var lunSeparatePanel = isMobileEnv; 
if (window.localStorage && localStorage.getItem("spkmod-separate-panel") !== null) {
	lunSeparatePanel = localStorage.getItem("spkmod-separate-panel") === "true";
}
function setSeparatePanel(enabled) {
	lunSeparatePanel = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-separate-panel", lunSeparatePanel ? "true" : "false");
	if (typeof applySeparatePanel === "function") {
		applySeparatePanel();
	}
}


var lunHidePlayerLevels = (window.localStorage && localStorage.getItem("spkmod-hide-player-levels")) === "true";
function setHidePlayerLevels(enabled) {
	lunHidePlayerLevels = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-hide-player-levels", lunHidePlayerLevels ? "true" : "false");
	if (typeof window.spkmodForceNametagRedraw === "function") {
		window.spkmodForceNametagRedraw();
	}
}

var lunDisableRightClickPinning = (window.localStorage && localStorage.getItem("spkmod-disable-right-click-pinning")) === "true";
function setDisableRightClickPinning(disabled) {
	lunDisableRightClickPinning = !!disabled;
	if (window.localStorage) localStorage.setItem("spkmod-disable-right-click-pinning", lunDisableRightClickPinning ? "true" : "false");
	if (lunPanelElements.disableRightClickPinningToggleInput) {
		lunPanelElements.disableRightClickPinningToggleInput.checked = lunDisableRightClickPinning;
	}
}

var isMobClient = typeof spkmodIsMobile === "function" ? spkmodIsMobile() : false;
var lunResolutionOverride = 1; // 1.0 = Off (use the game's own resolution option)
if (isMobClient && window.localStorage) {
	const v = parseFloat(localStorage.getItem("spkmod-resolution-override"));
	if (v >= 1 && v <= 3.5) lunResolutionOverride = v;
} else if (window.localStorage) {
	try { localStorage.removeItem("spkmod-resolution-override"); } catch (_) {}
}
window.spkmodResolutionOverride = lunResolutionOverride;

function lunResolutionOverrideLabel() {
	const v = t("resolutionOverrideLabel");
	const base = (!v || v === "resolutionOverrideLabel") ? "Resolution Override" : v;
	const offText = t("resolutionOverrideOff") || "Off";
	return base + ": " + (lunResolutionOverride <= 1 ? offText : "x" + lunResolutionOverride.toFixed(2));
}

function setResolutionOverride(value) {
	const isMob = typeof spkmodIsMobile === "function" ? spkmodIsMobile() : false;
	if (!isMob) {
		lunResolutionOverride = 1;
		window.spkmodResolutionOverride = 1;
		if (window.localStorage) {
			try { localStorage.removeItem("spkmod-resolution-override"); } catch (_) {}
		}
		return;
	}
	const v = parseFloat(value);
	lunResolutionOverride = (v >= 1 && v <= 3.5) ? v : 1;
	window.spkmodResolutionOverride = lunResolutionOverride;
	if (window.localStorage) localStorage.setItem("spkmod-resolution-override", String(lunResolutionOverride));
	if (lunPanelElements.resolutionOverrideInput) {
		lunPanelElements.resolutionOverrideInput.value = lunResolutionOverride;
	}
	if (lunPanelElements.resolutionOverrideLabel) {
		lunPanelElements.resolutionOverrideLabel.innerText = lunResolutionOverrideLabel();
	}
	try { window.dispatchEvent(new Event("resize")); } catch (_) {}
}

var lunDiscordRpcEnabled = (window.localStorage && localStorage.getItem("spkmod-discord-rpc")) !== "false";
function setDiscordRpcEnabled(enabled) {
	lunDiscordRpcEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-discord-rpc", lunDiscordRpcEnabled ? "true" : "false");
	if (lunPanelElements.discordRpcToggleInput) {
		lunPanelElements.discordRpcToggleInput.checked = lunDiscordRpcEnabled;
	}
	if (window.electronAPI && typeof window.electronAPI.setDiscordRpc === "function") {
		window.electronAPI.setDiscordRpc(lunDiscordRpcEnabled);
	}
}

if (typeof window !== "undefined" && window.electronAPI && typeof window.electronAPI.setDiscordRpc === "function") {
	window.electronAPI.setDiscordRpc(lunDiscordRpcEnabled);
}

// Sound starts Unmuted by default on game launch (Option A)
var lunIsMuted = false;
var lunMuteMinimizedEnabled = (window.localStorage && localStorage.getItem("spkmod-mute-minimized")) === "true";
var isMutedByMinimize = false;
var spkmodStartupTime = Date.now();
try {
	if (window.localStorage) {
		localStorage.removeItem("spkmod-muted");
		const s = localStorage.getItem("sr1_settings");
		if (s) {
			const parsed = JSON.parse(s);
			if (parsed && parsed.muteAll) {
				parsed.muteAll = false;
				localStorage.setItem("sr1_settings", JSON.stringify(parsed));
			}
		}
	}
} catch (_) {}

function isGameMuted() {
	return lunIsMuted || isMutedByMinimize;
}

function updateMuteButtonUI() {
	const muted = isGameMuted();
	const icon = muted ? "🔇" : "🔊";
	const tip = muted ? (t("unmuteBtnTooltip") || "Unmute Game") : (t("muteBtnTooltip") || "Mute Game");
	if (typeof lunPanelElements !== "undefined" && lunPanelElements.muteBtn) {
		lunPanelElements.muteBtn.innerText = icon;
		if (typeof setSpkmodRichTooltip === "function") {
			setSpkmodRichTooltip(lunPanelElements.muteBtn, icon + " " + tip);
		} else {
			lunPanelElements.muteBtn.title = tip;
		}
	}
	const mobileBtn = document.getElementById("spkmod-mobile-mute-toggle");
	if (mobileBtn) {
		mobileBtn.innerText = icon;
	}
}

function findGameMuteCheckbox() {
	const rows = document.querySelectorAll(".sr-panel__row");
	for (const row of rows) {
		const checkbox = row.querySelector("input[type='checkbox']");
		const span = row.querySelector("span");
		if (checkbox && span) {
			const txt = (span.textContent || "").trim().toLowerCase();
			if (
				txt === "mute all" ||
				txt.includes("mute") ||
				txt.includes("음소거") ||
				txt.includes("ミュート") ||
				txt.includes("靜音") ||
				txt.includes("静音") ||
				txt.includes("silenciar")
			) {
				return checkbox;
			}
		}
	}
	return null;
}

function hookNativeMuteCheckbox() {
	const cb = findGameMuteCheckbox();
	if (cb && !cb.__spkmodMuteHooked) {
		cb.__spkmodMuteHooked = true;
		// Sync visual state if native modal opened with mismatched checked state
		if (!isMutedByMinimize && cb.checked !== lunIsMuted) {
			cb.checked = lunIsMuted;
			if (typeof window.updateGameSettings === "function") {
				try { window.updateGameSettings({ muteAll: lunIsMuted }); } catch (_) {}
			}
		}
		cb.addEventListener("change", () => {
			if (!isMutedByMinimize) {
				lunIsMuted = cb.checked;
				updateMuteButtonUI();
			}
		});
	}
}
