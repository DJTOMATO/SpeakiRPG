/*
 * SpeakiMod (speakimod.js)
 * Copyright (c) Alluseri (https://github.com/Alluseri/SpeakiMod)
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT MODEL, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
 * OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
if (window.speakiMod)
	throw "Duplicate injection";

// Global token store
window.speakiAuthToken = window.speakiAuthToken || "";

// Intercept fetch requests to continuously update the Auth Token
if (!window.__speakiFetchHooked) {
	window.__speakiFetchHooked = true;
	const origFetch = window.fetch;
	window.fetch = async function (...args) {
		const [resource, config] = args;
		const headers = config?.headers;
		if (headers) {
			const authHeader = headers.Authorization || headers.authorization || headers.Bearer;
			if (authHeader && authHeader.includes("eyJhb")) {
				window.speakiAuthToken = authHeader.replace("Bearer ", "").trim();
			}
		}
		return origFetch.apply(this, args);
	};
}

const usingDevToolsOrOldSpeakiInjector = !window.speakiInjectorVer;

if (!window.gameState) {
	alert("SpeakiMod is not installed correctly or the game updated! Can't proceed.");
	throw "Injection error...";
}
window.speakiMod = true;

if (!window.i18n) {
	if (usingDevToolsOrOldSpeakiInjector)
		alert("Warning: SpeakiMod failed to discover 'i18n'. The mod will work, but you will see internal names instead of properly translated ones.\n\nPotential causes:\n- You are using the DevTools injection method\n- Game code changed");
	else
		alert("Warning: SpeakiMod failed to discover 'i18n'. The mod will work, but you will see internal names instead of properly translated ones.\n\nPotential causes:\n- Game code changed");
	window.i18n = e => e;
}

if (!window.questManager) {
	if (usingDevToolsOrOldSpeakiInjector)
		alert("Warning: SpeakiMod failed to discover 'questManager'. The Quest Pinning functionality will be disabled.\n\nPotential causes:\n- You are using the DevTools injection method\n- You are using an outdated version of the SpeakiMod Injector extension");
	else
		alert("Warning: SpeakiMod failed to discover 'questManager'. The Quest Pinning functionality will be disabled.\n\nPotential causes:\n- Game code changed");
}
const socketUrl = gameState.socket?.socket?.url || gameState.socket?.url || "";
// This is needed to make requests to 'gameData', 'channels' and other API endpoints
// NEW (SAFE):
function getAuthToken() {
	// 1. Check if captured via fetch interceptor
	if (window.speakiAuthToken) return window.speakiAuthToken;

	// 2. Safe check on legacy gameState structure (with optional chaining)
	const socketUrl = gameState?.socket?.socket?.url || gameState?.socket?.url || "";
	const match = socketUrl.match(/eyJhb.+?(?=&|$)/);
	if (match) return match[0];

	return "";
}
if (!getAuthToken()) {
	console.warn("[SpeakiMod+] AuthToken could not be retrieved yet. Socket connection might not be initialized.");
}
const Emotes = {
	Cry: 1,
	Jump: 2,
	PumpkinJoayo: 3,
	StrokeStart: 4,
	StrokeStage2: 5,
	StrokeBloom: 6,
	StrokeCancel: 7,
	Dance: 8
};

// This map does NOT have quest locations and Monatium!
const Portals = {
	1: {
		2: {
			portalId: 1,
			pos: {
				x: 95,
				z: 50
			}
		}
	},
	2: {
		1: {
			portalId: 2,
			pos: {
				x: 105,
				z: 50
			}
		},
		5: {
			portalId: 7,
			pos: {
				x: 196,
				z: 100
			}
		}
	},
	5: {
		2: {
			portalId: 8,
			pos: {
				x: 204,
				z: 100
			}
		},
		3: {
			portalId: 3,
			pos: {
				x: 296,
				z: 120
			}
		}
	},
	3: {
		5: {
			portalId: 4,
			pos: {
				x: 306,
				z: 120
			}
		},
		6: {
			portalId: 9,
			pos: {
				x: 426,
				z: 100
			}
		}
	},
	6: {
		3: {
			portalId: 10,
			pos: {
				x: 434,
				z: 100
			}
		},
		4: {
			portalId: 5,
			pos: {
				x: 554,
				z: 100
			}
		}
	},
	4: {
		6: {
			portalId: 6,
			pos: {
				x: 580,
				z: 100
			}
		},
		7: {
			portalId: 11,
			pos: {
				x: 656,
				z: 100
			}
		}
	},
	7: {
		4: {
			portalId: 12,
			pos: {
				x: 664,
				z: 100
			}
		},
		8: {
			portalId: 13,
			pos: {
				x: 756,
				z: 100
			}
		}
	},
	8: {
		7: {
			portalId: 14,
			pos: {
				x: 764,
				z: 100
			}
		},
		9: {
			portalId: 15,
			pos: {
				x: 956,
				z: 100
			}
		}
	},
	9: {
		8: {
			portalId: 16,
			pos: {
				x: 964,
				z: 100
			}
		},
		10: {
			portalId: 17,
			pos: {
				x: 1136,
				z: 100
			}
		}
	},
	10: {
		9: {
			portalId: 18,
			pos: {
				x: 1144,
				z: 100
			}
		}
	}
};
// Very cringe and could be generated automatically but gijfogjifsdogd fuck graph theory
// This won't work btw if I decide to add quest portal support & Monatium
const ZoneSequences = [1, 2, 5, 3, 6, 4, 7, 8, 9, 10];
const Waypoints = {
	5: [
		{
			x: 272,
			z: 106,
			crossed: false
		}
	]
};

var GameData = null;

/*
fetch("https://sr1.overture.io.kr/api/gamedata", {
	"method": "GET",
	"headers": {
		"authorization": "Bearer " + AuthToken
	},
	"mode": "cors"
}).then(async x => {
	if (!x.ok) {
		// TODO: Special case for 429? idk if it will happen or not
		alert("SpeakiMod is outdated or the game servers are down! Failed to fetch gamedata: " + x.status + "\nSome features will be hidden.");
		return;
	}

	GameData = await x.json();

	onGameDataUpdate();
});
*/

function buildElement(tag, characteristics, inner, callback) {
	var elem = document.createElement(tag);
	elem.replaceChildren(...(inner?.filter(t => t) || []));
	for (const _ in (characteristics || {})) {
		elem[_] = characteristics[_];
	}
	if (callback) callback(elem);
	return elem;
}

function findNametagSprite(container) {
	for (const group of container.children) {
		for (const child of group.children) {
			if (child.isSprite) return child;
		}
	}
	return null;
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
	ja: [].concat(window.SpeakiModBadWordsJA || [], [
		// "例"
	]),
	ko: [].concat(window.SpeakiModBadWordsKO || [], [
		// "예시"
	])
};

var lunBadWordSources = {
	en: "https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/master/en",
	ja: "https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/master/ja",
	ko: "https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/master/ko"
};
const lunBadWordCacheKey = "spkmod-badword-cache";
const lunBadWordCacheMaxAgeMs = 24 * 60 * 60 * 1000; // 24h

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
	} catch (err) {
		// corrupt cache, fall through to a fresh fetch
	}

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
}
var lunTranslateEmail = (window.localStorage && localStorage.getItem("spkmod-translate-email")) || "";
function setTranslateEmail(email) {
	lunTranslateEmail = (email || "").trim();
	if (window.localStorage) localStorage.setItem("spkmod-translate-email", lunTranslateEmail);
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

const spkmodTranslations = {
	en: {
		langName: "English",
		header: "SpeakiMod+ v1.3.0",
		langLabel: "Language",
		playersNearby: "Speaki nearby: {0}",
		zoneId: "Zone ID: {0}",
		expPerMinute: "{0} EXP/min ({1}s)",
		zeroExp: "0 EXP/min",
		nextLevel: "Next level: ~{0} min",
		nextLevelNA: "Next level: N/A",
		channelTracker: "Channel {0}: {1}/{2}",
		channelTrackerError: "Channel tracker: Error {0}",
		totalPlayersOnline: "Total players: {0}",
		currencyTracker: "Gold: {0} / Elif: {1}",
		currencyTrackerError: "Currency: Error {0}",
		settingsHeader: "Settings",
		filterToggleLabel: "Filter bad words in names",
		footerMsg: "Download on github.com\nDJTOMATO/SpeakiRPG\n\nThis mod is not affiliated with\nSpeakiMMO or Overture.io.kr",
		dance: "Dance",
		chowayo: "Chowayo",
		hearts: "Hearts",
		pet: "Pet Combo",
		discordBtn: "Join Discord",
		discordCopiedMsg: "Discord invite copied! Paste it into your browser.",
		autoJumpOn: "Autojump: ⏸️",
		autoJumpOff: "Autojump: ▶️",
		autoHeartsOn: "Hearts: ⏸️",
		autoHeartsOff: "Hearts: ▶️",
		ritualOn: "Ritual: ⏸️",
		ritualOff: "Ritual: ▶️",
		turntableOn: "Turntable: ⏸️",
		turntableOff: "Turntable: ▶️",
		shakeOn: "Shake: ⏸️",
		shakeOff: "Shake: ▶️",
		superShakeOn: "S-Shake: ⏸️",
		superShakeOff: "S-Shake: ▶️",
		moonwalkOn: "Moonwalk: ⏸️",
		moonwalkOff: "Moonwalk: ▶️",
		beybladeOn: "Spin: ⏸️",
		beybladeOff: "Spin: ▶️",
		reversebeybladeOn: "R-Spin: ⏸️",
		reversebeybladeOff: "R-Spin: ▶️",
		speedLabel: "Speed",
		turnToCamera: "Turn to Camera",
		playersRadarBtn: "Players",
		resetCamera: "Reset Camera",
		lockCamera: "Lock Camera",
		unlockCamera: "Unlock Camera",
		hideNametags: "Hide Nametags",
		showNametags: "Show Nametags",
		viewClipOff: "ViewClip OFF",
		viewClipOn: "ViewClip ON",
		goTo: "Go to",
		stopWalking: "Stop Walking",
		follow: "Follow",
		stopFollowing: "Stop Following",
		watchBtn: "[SM] Watch",
		followBtn: "[SM] Follow",
		pinQuestBtn: "Pin Quest",
		pinnedQuestHeader: "Pinned Quest",
		pinnedQuestDefault: "Pin a quest to be displayed here until completion.",
		shakeActivatedMsg: "Shake mode activated!",
		shakeDeactivatedMsg: "Shake mode deactivated.",
		superShakeActivatedMsg: "Super Shake mode activated!",
		superShakeDeactivatedMsg: "Super Shake mode deactivated.",
		moonwalkActivatedMsg: "Moonwalk mode activated!",
		moonwalkDeactivatedMsg: "Moonwalk mode deactivated.",
		beybladeActivatedMsg: "L-Spin activated at x{0}!",
		beybladeDeactivatedMsg: "L-Spin deactivated.",
		reversebeybladeActivatedMsg: "R-Spin activated at x{0}!",
		reversebeybladeDeactivatedMsg: "R-Spin deactivated.",
		autoJumpActivatedMsg: "Autojump activated!",
		autoJumpDeactivatedMsg: "Autojump deactivated.",
		autoHeartsActivatedMsg: "Hearts loop activated!",
		autoHeartsDeactivatedMsg: "Hearts loop deactivated.",
		petActivatedMsg: "Affection maxxing... (Petting combo!)",
		ritualActivatedMsg: "Dance ritual activated!",
		ritualDeactivatedMsg: "Dance ritual deactivated.",
		turntableActivatedMsg: "Camera turntable activated!",
		turntableDeactivatedMsg: "Camera turntable deactivated.",
		walkingToMsg: "Walking to {0} ({1}).",
		stoppedWalkingMsg: "Stopped autowalking.",
		watchFollowingMsg: "The camera will be following {0} now.",
		watchFollowingSelfMsg: "The camera will be following you now.",
		watchNotFoundMsg: "Couldn't find the target player. The camera will be following you now.",
		followStartMsg: "Now following {0}.",
		followStopMsg: "Stopped following.",
		mentionAlertMsg: "💬 You were mentioned by {0}: {1}",
		playersRadarHeader: "Nearby Speaki ({0}):",
		playersRadarNone: "No other Speaki found nearby.",
		playersRadarRow: "• {0} (Lv.{1}) - {2}m away (ID: {3})",
		gamepadBtn: "🎮 Gamepad Settings",
		gamepadHeader: "Gamepad / Controller Configuration",
		gamepadConnected: "Connected: {0}",
		gamepadDisconnected: "No Gamepad Detected (press any button on controller)",
		gamepadDeadzoneLabel: "Stick Deadzone",
		gamepadSensLabel: "Camera Sensitivity",
		gamepadInvertX: "Invert Camera X",
		gamepadInvertY: "Invert Camera Y",
		gamepadResetBtn: "Reset Defaults",
		gamepadPressPrompt: "Press button on controller...",
		gamepadAction_jump: "Jump / Portal",
		gamepadAction_attack: "Attack / Auto-Target / Portal",
		gamepadAction_skill1: "Skill 1",
		gamepadAction_skill2: "Skill 2",
		gamepadAction_skill3: "Skill 3",
		gamepadAction_skill4: "Skill 4",
		gamepadAction_potion: "Heal / Use Potion",
		gamepadAction_target: "Target Nearest / Cycle",
		gamepadAction_beyblade: "Left Spin",
		gamepadAction_reversebeyblade: "Right Spin",
		gamepadAction_dance: "Dance Emote",
		gamepadAction_chowayo: "Chowayo Emote",
		gamepadAction_hearts: "Hearts Emote",
		gamepadAction_moonwalk: "Toggle Moonwalk",
		gamepadAction_town: "Back to Town",
		gamepadAction_lockCamera: "Lock Camera",
		gamepadAction_resetCamera: "Reset Camera",
		gamepadAction_zoomIn: "Zoom In",
		gamepadAction_zoomOut: "Zoom Out",
		gamepadAction_autoJump: "Toggle Autojump",
		gamepadAction_toggleSettings: "Toggle Settings",
		gamepadShowDiagramBtn: "🎮 Show Controller Layout",
		gamepadHideDiagramBtn: "🎮 Hide Controller Layout",
		gamepadUnlockedMsg: "🎮 Gamepad Settings unlocked!",
		diedMsg: "Stopped autowalking because you died (Un-Chowayo!)",
		noPathMsg: "Stopped autowalking because there doesn't seem to be a way to get to the specified zone (z {0} -> {1}, lw {2} -> {3}).",
		arrivedMsg: "You've arrived!",
		noPortalsMsg: "Stopped autowalking because the current zone has no portals registered.",
		missingPortalMsg: "Stopped autowalking because it seems there is a portal missing.",
		zoomUsage1Msg: "Usage: !zoom [number]",
		zoomUsage2Msg: "Legitimate values range from 3 to 12. Higher value = farther camera.",
		zoomSetMsg: "Set camera zoom to {0}!",
		unknownCmdMsg: "Unknown command: {0}",
		availableCmdsMsg: "Available commands: watch, zoom, follow, players",
		nextLevelHours: "Next level: ~{0}h",
		credits: "• Original Game: EPID Games\n• Speaki MMO Development: GMDT\n• Client and SpeakiMod+ Coding: Glas\n• SpeakiMod Original Developer: Alluseri",
		gmChatToggleLabel: "Gamemaster talks (highlight)",
		mentionAlertToggleLabel: "Chat Mention Notification",
		translateToggleLabel: "Translate chat",
		translateQuotaHitMsg: "Translation quota hit for today — auto-disabled. Add your email in settings for a higher limit, or re-enable tomorrow.",
		translateEmailTooltip: "Optional. MyMemory (the free translation service) allows more characters per day if you register an email with them.\nIt's sent only in the translation request itself — SpeakiMod doesn't collect or store it anywhere besides your own browser.",
		clickToTranslateTooltip: "Click to translate this message",
		clickToTranslatePrompt: "Translate from which language code? (e.g. en, ja, ko, es, fr)",
		translateFailedMsg: "Translation failed or the message is already in your target language.",
		chatTimestampToggleLabel: "Chat Timestamps",
		lowHpWarningToggleLabel: "Low HP Critical Warning",
		sessionGoldToggleLabel: "Session Gold Tracker",
		uiScaleLabel: "UI Scale",
		bgOpacityLabel: "HUD Opacity",
		bgOpacitySolid: "Solid",
		bgOpacityTransparent: "Transparent",
		bgOpacityGlass: "Glass",
		accentColorLabel: "Accent Color",
		fpsPingToggleLabel: "FPS & Latency Counter",
		gamepadRumbleToggleLabel: "Gamepad Rumble",
		firstPersonPitchLabel: "1st Person Pitch",
		exportSettingsBtn: "Export Settings",
		importSettingsBtn: "Import Settings",
		freeCamOn: "Drone: ⏸️",
		freeCamOff: "Drone: ▶️",
		firstPersonOn: "1st Person: ⏸️",
		firstPersonOff: "1st Person: ▶️",
		tagPlayerPrompt: "Enter a tag for {0}:",
		tagColorPrompt: "Enter a color for the tag (e.g. gold, #ff00ff, green):",
		sessionGoldText: "Session: {0} ({1}/hr)",
		fpsPingText: "{0} FPS | Ping: {1}ms",
		hudBackgroundLabel: "HUD Background",
		hudBgNone: "None",
		hudBgLv10: "Lv 10",
		hudBgLv15: "Lv 15",
		hudBgLv20: "Lv 20",
		hudBgLv25: "Lv 25",
		hudBgLv30: "Lv 30",
		hudBgLv35: "Lv 35",
		hudBgLv40: "Lv 40",
		hudBgLv45: "Lv 45",
		hudBgLv50: "Lv 50",

	},
	ja: {
			langName: "日本語",
			header: "SpeakiMod+ v1.3.0",
			langLabel: "言語",
			playersNearby: "近くのｽﾋﾟｷ数: {0}",
			zoneId: "エリアID: {0}",
			expPerMinute: "{0} 経験値/分 ({1}秒)",
			zeroExp: "0 経験値/分",
			nextLevel: "次のレベルまで: 約{0}分",
			nextLevelNA: "次のレベル: N/A",
			channelTracker: "チャンネル {0}: {1}/{2}",
			channelTrackerError: "チャンネル情報取得エラー: {0}",
			totalPlayersOnline: "同時接続ｽﾋﾟｷ数: {0}",
			currencyTracker: "ゴールド: {0} | エリーフ: {1}",
			currencyTrackerError: "所持通貨情報取得エラー: {0}",
			settingsHeader: "設定",
			filterToggleLabel: "不適切な単語をフィルタリング(メンテ中)",
			footerMsg: "github.com/DJTOMATO/SpeakiRPG\n\nこのMODはSpeakiMMOまたは\nOverture.io.krとは一切関係ありません",
			dance: "どこでもダンス",
			chowayo: "どこでも「ﾁｮﾜﾖ!」",
			hearts: "ハート",
			pet: "なでなで",
		discordBtn: "Discordに参加",
		discordCopiedMsg: "Discordの招待リンクをコピーしました！ブラウザに貼り付けてください。",
			autoJumpOn: "ぴょんぴょん: ⏸️",
			autoJumpOff: "ぴょんぴょん: ▶️",
			autoHeartsOn: "ハート連打: ⏸️",
			autoHeartsOff: "ハート連打: ▶️",
			ritualOn: "儀式ダンス: ⏸️",
			ritualOff: "儀式ダンス: ▶️",
			turntableOn: "カメラ回転: ⏸️",
			turntableOff: "カメラ回転: ▶️",
			shakeOn: "ふりふり: ⏸️",
			shakeOff: "ふりふり: ▶️",
			superShakeOn: "超ふりふり: ⏸️",
			superShakeOff: "超ふりふり: ▶️",
			moonwalkOn: "ムーンウォーク: ⏸️",
			moonwalkOff: "ムーンウォーク: ▶️",
			beybladeOn: "左くるりん: ⏸️",
			beybladeOff: "左くるりん: ▶️",
			reversebeybladeOn: "右くるりん: ⏸️",
			reversebeybladeOff: "右くるりん: ▶️",
			speedLabel: "くるりん速度",
			turnToCamera: "ｽﾋﾟｷの向き調整",
			playersRadarBtn: "近くのｽﾋﾟｷ",
			resetCamera: "カメラをリセット",
			lockCamera: "カメラを固定",
			unlockCamera: "カメラの固定を解除",
			hideNametags: "他ｽﾋﾟｷ名前表示: ON",
			showNametags: "他ｽﾋﾟｷ名前表示: OFF",
			viewClipOff: "カメラの当たり判定: ON",
			viewClipOn: "カメラの当たり判定: OFF",
			goTo: "移動する",
			stopWalking: "移動中止",
			follow: "追従",
			stopFollowing: "追従中止",
			watchBtn: "[SM] 視点固定",
			followBtn: "[SM] 追従",
			pinQuestBtn: "クエストをピン止め",
			pinnedQuestHeader: "ピン止めしたクエスト",
			pinnedQuestDefault: "クエストをピン止めするとここに表示されます。",
			shakeActivatedMsg: "ｽﾋﾟｷが「ふりふり」を始めました！",
			shakeDeactivatedMsg: "ｽﾋﾟｷは「ふりふり」を終えました。",
			superShakeActivatedMsg: "ｽﾋﾟｷが「超ふりふり」を始めました！",
			superShakeDeactivatedMsg: "ｽﾋﾟｷは「超ふりふり」を終えました。",
			moonwalkActivatedMsg: "ｽﾋﾟｷが「ムーンウォーク」を始めました！",
			moonwalkDeactivatedMsg: "ｽﾋﾟｷは「ムーンウォーク」を終えました。",
			beybladeActivatedMsg: "ｽﾋﾟｷが「くるりん」を始めました！",
			beybladeDeactivatedMsg: "ｽﾋﾟｷは「くるりん」を終えました。",
			reversebeybladeActivatedMsg: "ｽﾋﾟｷが「くるりん」を始めました！",
			reversebeybladeDeactivatedMsg: "ｽﾋﾟｷは「くるりん」を終えました。",
			autoJumpActivatedMsg: "ｽﾋﾟｷが「ぴょんぴょん」を始めました！",
			autoJumpDeactivatedMsg: "ｽﾋﾟｷは「ぴょんぴょん」を終えました。",
			autoHeartsActivatedMsg: "ｽﾋﾟｷが「ハート連打」を始めました！",
			autoHeartsDeactivatedMsg: "ｽﾋﾟｷは「ハート連打」を終えました。",
			petActivatedMsg: "ｽﾋﾟｷをなでなで中…（ハート満開！）",
			ritualActivatedMsg: "ｽﾋﾟｷが「儀式ダンス」を始めました！",
			ritualDeactivatedMsg: "ｽﾋﾟｷは「儀式ダンス」を終えました。",
			turntableActivatedMsg: "カメラの自動回転を開始しました！",
			turntableDeactivatedMsg: "カメラの自動回転を終了しました。",
			walkingToMsg: "ｽﾋﾟｷが {0} ({1}) へ移動中です！",
			stoppedWalkingMsg: "ｽﾋﾟｷが移動を中止しました。",
			watchFollowingMsg: "カメラが {0} を追従します。",
			watchFollowingSelfMsg: "カメラが自ｽﾋﾟｷを追従します。",
			watchNotFoundMsg: "対象のｽﾋﾟｷが見つかりませんでした。カメラは自ｽﾋﾟｷを追従します。",
			followStartMsg: "{0} の追従を開始しました。",
			followStopMsg: "追従を中止しました。",
			mentionAlertMsg: "💬 {0}から名前を呼ばれました: {1}",
			playersRadarHeader: "近くのｽﾋﾟｷ一覧 ({0}人):",
			playersRadarNone: "近くに他のｽﾋﾟｷはいません。",
			playersRadarRow: "• {0} (Lv.{1}) - 距離: {2}m (ID: {3})",
			gamepadBtn: "🎮 コントローラー設定",
			gamepadHeader: "ゲームパッド / コントローラー設定",
			gamepadConnected: "接続中: {0}",
			gamepadDisconnected: "コントローラー未検出（いずれかのボタンを押してください）",
			gamepadDeadzoneLabel: "スティックの不感帯 (デッドゾーン)",
			gamepadSensLabel: "カメラ感度",
			gamepadInvertX: "カメラ左右反転 (Invert X)",
			gamepadInvertY: "カメラ上下反転 (Invert Y)",
			gamepadResetBtn: "初期設定に戻す",
			gamepadPressPrompt: "コントローラーのボタンを押してください...",
			gamepadAction_jump: "ジャンプ / 決定",
			gamepadAction_attack: "攻撃 / 自動ターゲット / ポータル",
			gamepadAction_skill1: "スキル 1",
			gamepadAction_skill2: "スキル 2",
			gamepadAction_skill3: "スキル 3",
			gamepadAction_skill4: "スキル 4",
			gamepadAction_potion: "回復 / ポーション使用",
			gamepadAction_target: "敵ターゲット / 巡回",
			gamepadAction_beyblade: "左くるりん",
			gamepadAction_reversebeyblade: "右くるりん",
			gamepadAction_dance: "ダンスエモート",
			gamepadAction_chowayo: "チョワヨエモート",
			gamepadAction_hearts: "ハートエモート",
			gamepadAction_moonwalk: "ムーンウォーク切替",
			gamepadAction_town: "街へ戻る (タウン)",
			gamepadAction_lockCamera: "カメラ固定切り替え",
			gamepadAction_resetCamera: "カメラリセット",
			gamepadAction_zoomIn: "ズームイン",
			gamepadAction_zoomOut: "ズームアウト",
			gamepadAction_autoJump: "ジャンプ連打切替",
			gamepadAction_toggleSettings: "設定画面切替",
			gamepadShowDiagramBtn: "🎮 コントローラー図を表示",
			gamepadHideDiagramBtn: "🎮 コントローラー図を非表示",
			gamepadUnlockedMsg: "🎮 コントローラー設定が解放されました！",
			diedMsg: "倒されてしまったため自動移動を中止しました (ｳﾜｱｱｱ!)",
			noPathMsg: "指定したエリアへの経路が見つからないため自動移動が中止しました (z {0} -> {1}, lw {2} -> {3})。",
			arrivedMsg: "到着しました!",
			noPortalsMsg: "現在のエリアにポータル情報が登録されていないため自動移動を中止しました。",
			missingPortalMsg: "ポータル情報が不足しているため自動移動を中止しました。",
			zoomUsage1Msg: "使い方: !zoom [数値]",
			zoomUsage2Msg: "有効な値は3~12です。値が大きいほどカメラが遠くなります。",
			zoomSetMsg: "カメラズームを {0} に設定しました!",
			unknownCmdMsg: "不明なコマンド: {0}",
			availableCmdsMsg: "使用可能なコマンド: !watch, !zoom, !follow, !players",
			nextLevelHours: "次のレベルまで: 約{0}時間",
			credits: "• 原作ゲーム: EPID Games\n• Speaki MMO 開発: GMDT\n• クライアント＆SpeakiMod+コーディング: Glas\n• SpeakiMod原作者: Alluseri\n• 日本語翻訳: JPN_健全なエルフ名15T",
			gmChatToggleLabel: "ゲームマスター(GM)発言強調",
			mentionAlertToggleLabel: "チャットメンション通知",
			translateToggleLabel: "翻訳先の言語を選択 (jaを選択で日本語に翻訳)",
			translateQuotaHitMsg: "翻訳の1日の上限に達したため、翻訳機能を自動的に無効化しました。設定でメールアドレスを追加すると上限が増えます。明日になったら再度有効化してください。",
			translateEmailPlaceholder: "メールアドレス [任意です] 　(詳細は、左のⓘをクリック)",
			translateEmailTooltip: "MyMemory(無料翻訳サービス)は、メールアドレスを登録すると1日の翻訳可能文字数が増えます。メールアドレスは翻訳リクエストにのみ送信され、SpeakiModはブラウザ以外の場所に保存しません。",
			clickToTranslateTooltip: "このメッセージをクリックして翻訳してください",
			clickToTranslatePrompt: "どの言語コードから翻訳しますか?（例:en、ja、ko、es、fr)",
			translateFailedMsg: "翻訳に失敗しました。または、メッセージは既に翻訳先の言語で表示されています。",
			chatTimestampToggleLabel: "チャットのタイムスタンプ",
			lowHpWarningToggleLabel: "低HP警告",
			sessionGoldToggleLabel: "セッションのゴールドを追跡",
			uiScaleLabel: "UIスケール",
			bgOpacityLabel: "背景の不透明度",
			bgOpacitySolid: "ソリッド",
			bgOpacityTransparent: "透明",
			bgOpacityGlass: "ガラス",
			accentColorLabel: "アクセントカラー",
			fpsPingToggleLabel: "FPS & ピングカウンター",
			gamepadRumbleToggleLabel: "ゲームパッドの振動",
			firstPersonPitchLabel: "1人称ピッチ",
			exportSettingsBtn: "設定をエクスポート",
			importSettingsBtn: "設定をインポート",
			freeCamOn: "ドローン: ⏸️",
			freeCamOff: "ドローン: ▶️",
			firstPersonOn: "1人称視点: ⏸️",
			firstPersonOff: "1人称視点: ▶️",
			tagPlayerPrompt: "{0} のタグを入力:",
			tagColorPrompt: "タグの色を入力 (例: gold, #ff00ff, green):",
			sessionGoldText: "セッション: {0} ({1}/時)",
			fpsPingText: "{0} FPS | Ping: {1}ms",
			hudBackgroundLabel: "HUD 背景",
			hudBgNone: "なし",
		hudBgLv10: "Lv 10",
		hudBgLv15: "Lv 15",
		hudBgLv20: "Lv 20",
		hudBgLv25: "Lv 25",
		hudBgLv30: "Lv 30",
		hudBgLv35: "Lv 35",
		hudBgLv40: "Lv 40",
		hudBgLv45: "Lv 45",
		hudBgLv50: "Lv 50",
		},
	ko: {
		langName: "한국어",
		header: "SpeakiMod+ v1.3.0",
		langLabel: "언어",
		playersNearby: "근처 플레이어: {0}",
		zoneId: "존 ID: {0}",
		expPerMinute: "{0} EXP/분 ({1}초)",
		zeroExp: "0 EXP/분",
		nextLevel: "다음 레벨까지: 약 {0}분",
		nextLevelNA: "다음 레벨: N/A",
		channelTracker: "채널 {0}: {1}/{2}",
		channelTrackerError: "채널 정보 오류: {0}",
		totalPlayersOnline: "총 플레이어 수: {0}",
		currencyTracker: "골드: {0} / 엘리프: {1}",
		currencyTrackerError: "재화 정보 오류: {0}",
		settingsHeader: "설정",
		filterToggleLabel: "이름 욕설 필터링",
		footerMsg: "github.com/DJTOMATO/SpeakiRPG\n\n이모드는SpeakiMMO또는\n\nOverture.io.kr과 제휴 관계가 없습니다.",
		dance: "댄스",
		chowayo: "초와요",
		hearts: "하트",
		pet: "쓰다듬기",
		discordBtn: "디스코드 참여",
		discordCopiedMsg: "디스코드 초대 링크가 복사되었습니다! 브라우저에 붙여넣어 주세요.",
		autoJumpOn: "점프 반복: ⏸️",
		autoJumpOff: "점프 반복: ▶️",
		autoHeartsOn: "하트 반복: ⏸️",
		autoHeartsOff: "하트 반복: ▶️",
		ritualOn: "의식 댄스: ⏸️",
		ritualOff: "의식 댄스: ▶️",
		turntableOn: "턴테이블: ⏸️",
		turntableOff: "턴테이블: ▶️",
		shakeOn: "쉐이크: ⏸️",
		shakeOff: "쉐이크: ▶️",
		superShakeOn: "슈퍼 쉐이크: ⏸️",
		superShakeOff: "슈퍼 쉐이크: ▶️",
		moonwalkOn: "문워크: ⏸️",
		moonwalkOff: "문워크: ▶️",
		beybladeOn: "베이: ⏸️",
		beybladeOff: "베이: ▶️",
		reversebeybladeOn: "리버스: ⏸️",
		reversebeybladeOff: "리버스: ▶️",
		speedLabel: "속도",
		turnToCamera: "카메라 방향으로 전환",
		playersRadarBtn: "주변 유저",
		resetCamera: "카메라 재설정",
		lockCamera: "카메라 잠금",
		unlockCamera: "카메라 잠금 해제",
		hideNametags: "이름표 숨기기",
		showNametags: "이름표 표시",
		viewClipOff: "뷰클립 OFF",
		viewClipOn: "뷰클립 ON",
		goTo: "이동",
		stopWalking: "이동 중지",
		follow: "따라가기",
		stopFollowing: "따라가기 중지",
		watchBtn: "[SM] 시점 고정",
		followBtn: "[SM] 따라가기",
		pinQuestBtn: "퀘스트 고정",
		pinnedQuestHeader: "고정된 퀘스트",
		pinnedQuestDefault: "퀘스트를 고정하면 완료될 때까지 여기에 표시됩니다.",
		shakeActivatedMsg: "쉐이크 모드가 활성화되었습니다!",
		shakeDeactivatedMsg: "쉐이크 모드가 비활성화되었습니다.",
		superShakeActivatedMsg: "슈퍼 쉐이크 모드가 활성화되었습니다!",
		superShakeDeactivatedMsg: "슈퍼 쉐이크 모드가 비활성화되었습니다.",
		moonwalkActivatedMsg: "문워크 모드가 활성화되었습니다!",
		moonwalkDeactivatedMsg: "문워크 모드가 비활성화되었습니다.",
		beybladeActivatedMsg: "베이블레이드가 x{0} 속도로 활성화되었습니다!",
		beybladeDeactivatedMsg: "베이블레이드가 비활성화되었습니다.",
		reversebeybladeActivatedMsg: "리버스베이블레이드가 x{0} 속도로 활성화되었습니다!",
		reversebeybladeDeactivatedMsg: "리버스베이블레이드가 비활성화되었습니다.",
		autoJumpActivatedMsg: "점프 반복 모드가 활성화되었습니다!",
		autoJumpDeactivatedMsg: "점프 반복 모드가 비활성화되었습니다.",
		autoHeartsActivatedMsg: "하트 반복 모드가 활성화되었습니다!",
		autoHeartsDeactivatedMsg: "하트 반복 모드가 비활성화되었습니다.",
		petActivatedMsg: "스피키를 쓰다듬는 중... (하트 만개!)",
		ritualActivatedMsg: "의식 댄스 모드가 활성화되었습니다!",
		ritualDeactivatedMsg: "의식 댄스 모드가 비활성화되었습니다.",
		turntableActivatedMsg: "카메라 턴테이블이 활성화되었습니다!",
		turntableDeactivatedMsg: "카메라 턴테이블이 비활성화되었습니다.",
		walkingToMsg: "{0} ({1})(으)로 이동 중입니다.",
		stoppedWalkingMsg: "자동 이동을 중지했습니다.",
		watchFollowingMsg: "카메라가 이제 {0}님을 따라갑니다.",
		watchFollowingSelfMsg: "카메라가 이제 나를 따라갑니다.",
		watchNotFoundMsg: "대상 플레이어를 찾을 수 없습니다. 카메라가 나를 따라갑니다.",
		followStartMsg: "{0}님의 추적을 시작했습니다.",
		followStopMsg: "추적을 중지했습니다.",
		mentionAlertMsg: "💬 {0}님이 나를 언급했습니다: {1}",
		playersRadarHeader: "주변 스피키 목록 ({0}명):",
		playersRadarNone: "주변에 다른 스피키가 없습니다.",
		playersRadarRow: "• {0} (Lv.{1}) - 거리: {2}m (ID: {3})",
		gamepadBtn: "🎮 컨트롤러 설정",
		gamepadHeader: "게임패드 / 컨트롤러 설정",
		gamepadConnected: "연결됨: {0}",
		gamepadDisconnected: "컨트롤러가 감지되지 않음 (컨트롤러의 아무 버튼이나 누르세요)",
		gamepadDeadzoneLabel: "스틱 데드존",
		gamepadSensLabel: "카메라 감도",
		gamepadInvertX: "카메라 좌우 반전",
		gamepadInvertY: "카메라 상하 반전",
		gamepadResetBtn: "기본값으로 복원",
		gamepadPressPrompt: "컨트롤러의 버튼을 누르세요...",
		gamepadAction_jump: "점프 / 상호작용",
		gamepadAction_attack: "공격 / 자동 타겟 / 포탈",
		gamepadAction_skill1: "스킬 1",
		gamepadAction_skill2: "스킬 2",
		gamepadAction_skill3: "스킬 3",
		gamepadAction_skill4: "스킬 4",
		gamepadAction_potion: "힐 / 물약 사용",
		gamepadAction_target: "가까운 적 타겟 / 순환",
		gamepadAction_beyblade: "좌측 회전",
		gamepadAction_reversebeyblade: "우측 회전",
		gamepadAction_dance: "댄스 이모트",
		gamepadAction_chowayo: "초와요 이모트",
		gamepadAction_hearts: "하트 이모트",
		gamepadAction_moonwalk: "문워크 전환",
		gamepadAction_town: "마을로 귀환",
		gamepadAction_lockCamera: "카메라 잠금 전환",
		gamepadAction_resetCamera: "카메라 재설정",
		gamepadAction_zoomIn: "줌 인",
		gamepadAction_zoomOut: "줌 아웃",
		gamepadAction_autoJump: "점프 반복 전환",
		gamepadAction_toggleSettings: "설정창 열기/닫기",
		gamepadShowDiagramBtn: "🎮 컨트롤러 배치도 보기",
		gamepadHideDiagramBtn: "🎮 컨트롤러 배치도 숨기기",
		gamepadUnlockedMsg: "🎮 컨트롤러 설정이 해금되었습니다!",
		noPathMsg: "지정한 존으로 가는 경로를 찾을 수 없어 자동 이동을 중지했습니다 (z {0} -> {1}, lw {2} -> {3}).",
		arrivedMsg: "도착했습니다!",
		noPortalsMsg: "현재 존에 등록된 포털이 없어 자동 이동을 중지했습니다.",
		missingPortalMsg: "포털 정보가 없어 자동 이동을 중지했습니다.",
		zoomUsage1Msg: "사용법: !zoom [숫자]",
		zoomUsage2Msg: "유효한 값은 3~12입니다. 값이 클수록 카메라가 멀어집니다.",
		zoomSetMsg: "카메라 줌을 {0}(으)로 설정했습니다!",
		unknownCmdMsg: "알 수 없는 명령어: {0}",
		availableCmdsMsg: "사용 가능한 명령어: watch, zoom, follow, players",
		nextLevelHours: "다음 레벨까지: 약 {0}시간",
		credits: "• 원작 게임: EPID Games\n• Speaki MMO 개발: GMDT\n• 클라이언트 및 SpeakiMod+ 코딩: Glas\n• SpeakiMod 원작자: Alluseri",
		gmChatToggleLabel: "게임마스터(GM) 채팅 강조",
		mentionAlertToggleLabel: "채팅 멘션 알림",
		translateToggleLabel: "채팅 번역",
		translateQuotaHitMsg: "오늘 번역 한도에 도달하여 자동으로 비활성화되었습니다. 설정에서 이메일을 추가하면 한도가 늘어나며, 내일 다시 활성화할 수 있습니다.",
		translateEmailPlaceholder: "당신의 이메일 (선택 사항, 일일 한도를 높입니다)",
		translateEmailTooltip: "선택 사항입니다. MyMemory(무료 번역 서비스)는 이메일을 등록하면 하루에 번역할 수 있는 문자의 수가 늘어납니다. 이메일은 번역 요청에만 전송되며 SpeakiMod는 브라우저 외부에 저장하지 않습니다.",
		clickToTranslateTooltip: "이 메시지를 번역하려면 클릭하세요.",
		clickToTranslatePrompt: "어떤 언어 코드에서 번역하시겠습니까? (예: en, ja, ko, es, fr)",
		translateFailedMsg: "번역에 실패했거나 메시지가 이미 대상 언어로 되어 있습니다.",
		chatTimestampToggleLabel: "채팅 타임스탬프",
		lowHpWarningToggleLabel: "낮은 HP 경고",
		sessionGoldToggleLabel: "세션 골드 추적기",
		uiScaleLabel: "UI 크기",
		bgOpacityLabel: "배경 불투명도",
		bgOpacitySolid: "단색",
		bgOpacityTransparent: "투명",
		bgOpacityGlass: "글래스",
		accentColorLabel: "강조 색상",
		fpsPingToggleLabel: "FPS & 핑 카운터",
		gamepadRumbleToggleLabel: "게임패드 진동",
		firstPersonPitchLabel: "1인칭 피치",
		exportSettingsBtn: "설정 내보내기",
		importSettingsBtn: "설정 가져오기",
		freeCamOn: "드론: ⏸️",
		freeCamOff: "드론: ▶️",
		firstPersonOn: "1인칭: ⏸️",
		firstPersonOff: "1인칭: ▶️",
		tagPlayerPrompt: "{0}의 태그 입력:",
		tagColorPrompt: "태그 색상 입력 (예: gold, #ff00ff, green):",
		sessionGoldText: "세션: {0} ({1}/시간)",
		fpsPingText: "{0} FPS | Ping: {1}ms",
		hudBackgroundLabel: "HUD 배경",
		hudBgNone: "없음",
		hudBgLv10: "Lv 10",
		hudBgLv15: "Lv 15",
		hudBgLv20: "Lv 20",
		hudBgLv25: "Lv 25",
		hudBgLv30: "Lv 30",
		hudBgLv35: "Lv 35",
		hudBgLv40: "Lv 40",
		hudBgLv45: "Lv 45",
		hudBgLv50: "Lv 50",
	}
};

var spkmodLang = (window.localStorage && localStorage.getItem("spkmod-lang")) || "en";
if (!spkmodTranslations[spkmodLang]) spkmodLang = "en";

function t(key, ...args) {
	var str = (spkmodTranslations[spkmodLang] && spkmodTranslations[spkmodLang][key])
		|| (spkmodTranslations.en && spkmodTranslations.en[key])
		|| key;
	args.forEach((a, i) => { str = str.split(`{${i}}`).join(a); });
	return str;
}

var spkmodI18nRenderers = [];
function refreshI18n() {
	spkmodI18nRenderers.forEach(fn => fn());
}

function setLanguage(lang) {
	if (!spkmodTranslations[lang] || lang === spkmodLang) return;
	spkmodLang = lang;
	if (window.localStorage) localStorage.setItem("spkmod-lang", lang);
	refreshI18n();
}

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
	settingsModal: null
};
var lunPanelElements = {
	targetZone: null,
	resetCameraBtn: null,
	walkToPortalBtn: null,
	headerBtn: null,
	settingsBtn: null,
	danceBtn: null,
	autoJumpBtn: null,
	chowayoBtn: null,
	heartsBtn: null,
	autoHeartsBtn: null,
	petBtn: null,
	ritualBtn: null,
	turntableBtn: null,
	speedLabel: null,
	turnToCameraBtn: null,
	playersRadarBtn: null,
	watchBtn: null,
	followBtn: null,
	panelFollowBtn: null,
	shakeBtn: null,
	superShakeBtn: null,
	pinnedQuestHeader: null,
	langSelect: null,
	langLabel: null,
	settingsHeader: null,
	filterToggleLabel: null,
	filterToggleInput: null,
	gmChatToggleLabel: null,
	gmChatToggleInput: null,
	mentionAlertToggleLabel: null,
	mentionAlertToggleInput: null,
	translateToggleLabel: null,
	translateToggleInput: null,
	translateTargetSelect: null,
	translateEmailInput: null,
	creditsLabel: null,
	translateEmailInfo: null,
	discordBtn: null,
	gamepadSettingsBtn: null,
};
var lunMenuFoldingLevel = 0;

var lunTickCount = 0;
var lunSleep = 0;
const lunTPS = 20;
const lunExpTrackerWindow = 60 * lunTPS;
var lunExpTrackerNextTicks = 0;
var lunExpTrackerStartExp = 0;
var lunExpTrackerSpeed = 0;
var lunExpTrackerInitialized = false; 

var lunChannelTrackerWindow = 10000 / lunTPS;
var lunChannelTrackerNextTicks = 0;


var lunCurrencyTrackerWindow = 10000 / lunTPS;
var lunCurrencyTrackerNextTicks = 0;
var lunLastGold = null;
var lunLastElif = null;
var lunWalkToPortal = -1;
var lunAutoTravelTarget = null;
var lunCameraLocked = false;
var lunNametagsHidden = false;
var lunViewClip = false;
var lunFirstPersonPitch = parseFloat((window.localStorage && localStorage.getItem("spkmod-fp-pitch")) || "0.5");
var lunFollowTargetName = null;

var lunGmChatHighlightEnabled = (window.localStorage && localStorage.getItem("spkmod-gmchat-enabled")) !== "false";
var lunMentionAlertEnabled = (window.localStorage && localStorage.getItem("spkmod-mention-enabled")) === "true";

function setGmChatHighlightEnabled(enabled) {
	lunGmChatHighlightEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-gmchat-enabled", lunGmChatHighlightEnabled ? "true" : "false");
}

function setMentionAlertEnabled(enabled) {
	lunMentionAlertEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-mention-enabled", lunMentionAlertEnabled ? "true" : "false");
}

var lunChatTimestampsEnabled = (window.localStorage && localStorage.getItem("spkmod-chat-timestamps")) === "true";
function setChatTimestampsEnabled(enabled) {
	lunChatTimestampsEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-chat-timestamps", lunChatTimestampsEnabled ? "true" : "false");
}

var lunLowHpWarningEnabled = (window.localStorage && localStorage.getItem("spkmod-low-hp-warning")) === "true";
function setLowHpWarningEnabled(enabled) {
	lunLowHpWarningEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-low-hp-warning", lunLowHpWarningEnabled ? "true" : "false");
}

var lunSessionGoldTrackerEnabled = (window.localStorage && localStorage.getItem("spkmod-session-gold")) !== "false";
function setSessionGoldTrackerEnabled(enabled) {
	lunSessionGoldTrackerEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-session-gold", lunSessionGoldTrackerEnabled ? "true" : "false");
	if (lunHudElements.sessionGoldTracker) {
		lunHudElements.sessionGoldTracker.style.display = lunSessionGoldTrackerEnabled ? "" : "none";
	}
}

var lunFpsPingEnabled = (window.localStorage && localStorage.getItem("spkmod-fps-ping")) === "true";
function setFpsPingEnabled(enabled) {
	lunFpsPingEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-fps-ping", lunFpsPingEnabled ? "true" : "false");
	if (lunHudElements.fpsPingTracker) {
		lunHudElements.fpsPingTracker.style.display = lunFpsPingEnabled ? "" : "none";
	}
}

var lunGamepadRumbleEnabled = (window.localStorage && localStorage.getItem("spkmod-gamepad-rumble")) !== "false";
function setGamepadRumbleEnabled(enabled) {
	lunGamepadRumbleEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-gamepad-rumble", lunGamepadRumbleEnabled ? "true" : "false");
}

var lunUiScale = (window.localStorage && localStorage.getItem("spkmod-ui-scale")) || "1.0";
var lunBgOpacity = (window.localStorage && localStorage.getItem("spkmod-bg-opacity")) || "glass";
var lunAccentColor = (window.localStorage && localStorage.getItem("spkmod-accent-color")) || "#ffd54a";
var lunHudBackground = (window.localStorage && localStorage.getItem("spkmod-hud-bg")) || "none";

function updateDynamicStyles() {
	let bgRule = "rgba(0, 0, 0, 0.75)";
	let blurRule = "blur(4px)";
	if (lunBgOpacity === "solid") {
		bgRule = "rgba(10, 10, 10, 0.95)";
		blurRule = "none";
	} else if (lunBgOpacity === "transparent") {
		bgRule = "rgba(0, 0, 0, 0.4)";
		blurRule = "none";
	}
	
	let bgImageRule = "none";
	const level = (typeof gameState !== 'undefined' && gameState.myStat && gameState.myStat.level) || 1;
	let isVip = false;
	const playerName = (typeof gameState !== 'undefined' && gameState.myStat && gameState.myStat.name) || document.querySelector('.sr-player-card__name')?.innerText?.trim() || "";
	if (playerName) {
		const n = playerName.toLowerCase();
		isVip = n === "glas" || n === "sp1cky" || n === "gmdt";
	}

	if (lunHudBackground === "bg10" && (isVip || level >= 10)) bgImageRule = "url('https://i.imgur.com/UkBJTWQ.jpeg')";
	else if (lunHudBackground === "bg15" && (isVip || level >= 15)) bgImageRule = "url('https://i.imgur.com/OU9RsdB.jpeg')";
	else if (lunHudBackground === "bg20" && (isVip || level >= 20)) bgImageRule = "url('https://i.imgur.com/eXx7Wnl.png')";
	else if (lunHudBackground === "bg25" && (isVip || level >= 25)) bgImageRule = "url('https://i.imgur.com/OVxB4hr.jpeg')";
	else if (lunHudBackground === "bg30" && (isVip || level >= 30)) bgImageRule = "url('https://i.imgur.com/sQv4nJ0.png')";
	else if (lunHudBackground === "bg35" && (isVip || level >= 35)) bgImageRule = "url('https://i.imgur.com/1UobpMw.png')";
	else if (lunHudBackground === "bg40" && (isVip || level >= 40)) bgImageRule = "url('https://i.imgur.com/w7belx9.png')";
	else if (lunHudBackground === "bg45" && (isVip || level >= 45)) bgImageRule = "url('https://i.imgur.com/XPO2ZHK.png')";
	else if (lunHudBackground === "bg50" && (isVip || level >= 50)) bgImageRule = "url('https://i.imgur.com/tpMEXDT.png')";

	let bgImageFinal = "none";
	if (bgImageRule !== "none") {
		bgImageFinal = `linear-gradient(var(--spkmod-bg), var(--spkmod-bg)), ${bgImageRule}`;
	}

	if (window.localStorage) {
		localStorage.setItem("spkmod-ui-scale", lunUiScale);
		localStorage.setItem("spkmod-bg-opacity", lunBgOpacity);
		localStorage.setItem("spkmod-accent-color", lunAccentColor);
		localStorage.setItem("spkmod-hud-bg", lunHudBackground);
	}

	const styleTag = document.getElementById("spkmod-dynamic-styles") || document.createElement("style");
	styleTag.id = "spkmod-dynamic-styles";
	styleTag.innerHTML = `
		:root {
			--spkmod-scale: ${lunUiScale};
			--spkmod-bg: ${bgRule};
			--spkmod-blur: ${blurRule};
			--spkmod-accent: ${lunAccentColor};
		}
		#spkmod-hud { transform: scale(var(--spkmod-scale)); transform-origin: top left; }
		#spkmod-pq { transform: scale(var(--spkmod-scale)); transform-origin: top right; }
		#spkmod-main, #spkmod-pq, #spkmod-settings-modal, #spkmod-gamepad-modal, #spkmod-players-modal, .spkmod-panel-btn, .spkmod-panel-counter, .spkmod-panel-combo, #spkmod-discord-btn {
			background: var(--spkmod-bg) !important;
			backdrop-filter: var(--spkmod-blur) !important;
			border-color: var(--spkmod-accent) !important;
		}
		#spkmod-main {
			background-image: ${bgImageFinal} !important;
			background-size: cover !important;
			background-position: center !important;
		}
		#spkmod-main > * {
			text-shadow: 1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8) !important;
		}
		.spkmod-panel-btn:hover { background: rgba(255,255,255,0.1) !important; }
	`;
	if (!document.getElementById("spkmod-dynamic-styles")) {
		document.head.appendChild(styleTag);
	}
}

function updateHudBgDropdown() {
	if (!lunPanelElements.hudBgSelect) return;
	
	const currentVal = lunPanelElements.hudBgSelect.value;
	lunPanelElements.hudBgSelect.innerHTML = "";
	
	const level = (typeof gameState !== 'undefined' && gameState.myStat && gameState.myStat.level) || 1;
	let isVip = false;
	const playerName = (typeof gameState !== 'undefined' && gameState.myStat && gameState.myStat.name) || document.querySelector('.sr-player-card__name')?.innerText?.trim() || "";
	if (playerName) {
		const n = playerName.toLowerCase();
		isVip = n === "glas" || n === "sp1cky" || n === "gmdt";
	}
	
	const options = [
		{ value: "none", label: t("hudBgNone"), reqLevel: 0 },
		{ value: "bg10", label: t("hudBgLv10"), reqLevel: 10 },
		{ value: "bg15", label: t("hudBgLv15"), reqLevel: 15 },
		{ value: "bg20", label: t("hudBgLv20"), reqLevel: 20 },
		{ value: "bg25", label: t("hudBgLv25"), reqLevel: 25 },
		{ value: "bg30", label: t("hudBgLv30"), reqLevel: 30 },
		{ value: "bg35", label: t("hudBgLv35"), reqLevel: 35 },
		{ value: "bg40", label: t("hudBgLv40"), reqLevel: 40 },
		{ value: "bg45", label: t("hudBgLv45"), reqLevel: 45 },
		{ value: "bg50", label: t("hudBgLv50"), reqLevel: 50 }
	];
	
	let hasSelection = false;
	for (const opt of options) {
		const isUnlocked = isVip || level >= opt.reqLevel;
		if (isUnlocked || opt.value === "none") {
			const el = document.createElement("option");
			el.value = opt.value;
			el.innerText = opt.label;
			if (lunHudBackground === opt.value) {
				el.selected = true;
			}
			lunPanelElements.hudBgSelect.appendChild(el);
		}
	}
}



var lunSessionStartGold = null;
var lunSessionStartElif = null;

var lunDroneModeActive = false;
var lunFirstPersonActive = false;

const spkmodBorderWidth = "1.5px";

document.head.appendChild(buildElement("style", { id: "spkmod-dynamic-styles", type: "text/css" }));
updateDynamicStyles();

document.head.appendChild(buildElement(
	"style",
	{
		type: "text/css",
		innerHTML: `
		#spkmod-hud, #spkmod-drag-btn {
			font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
			user-select: none;
		}
		#spkmod-hud {
			display: flex;
			flex-direction: row;
			align-items: flex-start;
			gap: 4px;
			position: absolute;
			z-index: 600000;
			min-width: 140px;
			color: #FFF;
			left: 10px;
			top: 10px;
		}
		.sr-chatbox__body-text.spkmod-translated-line { color: #ffd54a !important; -webkit-text-fill-color: #ffd54a !important;  }
		.sr-chatbox__body-text.spkmod-gmdt-line { font-weight: 800 !important; color: #ffa726 !important; -webkit-text-fill-color: #ffa726 !important; text-shadow: 0 0 6px rgba(255, 167, 38, 0.45) !important; }
		.sr-chatbox__body-text.spkmod-clickable-line { cursor: pointer !important; pointer-events: auto !important;}
		#spkmod-footer {
			border-top: 1px solid #DDD;
			color: #AAA;
			font-size: 8pt;
			padding-top: 4px;
			white-space: pre-line;
		}
		#spkmod-discord-btn {
			color: #EEE;
			background: #000C;
			border: ${spkmodBorderWidth} solid #DDD;
			border-radius: 6px;
			padding: 2px 6px;
			font-size: 8.5pt;
			cursor: pointer;
			outline: none;
			margin-top: 4px;
			text-align: center;
			user-select: none;
			box-sizing: border-box;
			width: 100%;
		}
		#spkmod-main {
			display: flex;
			flex-direction: column;
			gap: 1px;
			background: #000C;
			border: ${spkmodBorderWidth} solid #DDD;
			border-radius: 8px;
			padding: 6px;
		}
		#spkmod-panel {
			display: flex;
			flex-direction: column;
			gap: 2px;
			width: max-content;
			min-width: 220px;
			box-sizing: border-box;
		}
		#spkmod-header-row, #spkmod-texpb, #spkmod-pq-header {
			border-bottom: 1px solid #DDD;
			margin-bottom: 4px;
		}
		#spkmod-header-row {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 6px;
		}
		#spkmod-header {
			flex: 1;
		}
		#spkmod-settings-btn {
			cursor: pointer;
			font-size: 12pt;
			user-select: none;
			flex-shrink: 0;
		}
		#spkmod-settings-modal {
			display: flex;
			flex-direction: column;
			position: fixed;
			z-index: 600000;
			min-width: 220px;
			color: #FFF;
			background: #000C;
			border: ${spkmodBorderWidth} solid #DDD;
			border-radius: 8px;
			padding: 8px;
			gap: 6px;
		}
		#spkmod-settings-close {
			cursor: pointer;
			user-select: none;
		}
		.spkmod-panel-btn {
			color: #EEE;
			background: #000C;
			border: ${spkmodBorderWidth} solid #DDD;
			border-radius: 8px;
			padding: 4px 8px;
			font-size: 10pt;
			cursor: pointer;
			outline: none;
			flex: 1;
			min-width: max-content;
			white-space: nowrap;
			text-align: center;
			box-sizing: border-box;
			display: inline-flex;
			align-items: center;
			justify-content: center;
		}
		.spkmod-watch-player-btn {
			color: #FFF;
			border-color: #333;
			box-shadow: 0 .1875rem 0 #333;
			background: #000;
		}
		.spkmod-panel-cat {
			display: flex;
			flex-direction: row;
			gap: 2px;
			align-items: center;
			width: 100%;
		}
		#spkmod-translate-picker .spkmod-panel-btn-small { padding: 3px 8px; font-size: 11px; }
		.spkmod-panel-btn-small {
			padding: 5px 8px;
			font-size: 10pt;
			flex: 1;
		}
		.spkmod-panel-counter {
			outline: none;
			border: ${spkmodBorderWidth} solid #DDD;
			border-radius: 8px;
			background: #000C;
			color: #EEE;
			height: min-content;
		}

		.spkmod-panel-counter::-webkit-inner-spin-button, 
		.spkmod-panel-counter::-webkit-outer-spin-button {
			opacity: 1;
		}
		.spkmod-panel-combo {
			outline: none;
			background: #000C;
			color: #EEE;
			border-radius: 8px;
			border: ${spkmodBorderWidth} solid #DDD;
		}
		.spkmod-pq-button {
			background: #000;
			color: var(--sr-color-text-inverse);
			border-color: #333;
			box-shadow: 0 .1875rem 0 #333;
			height: 2.125rem;
			padding: 0 var(--sr-space-3);
			border-radius: var(--sr-radius-md);
			font-size: var(--sr-font-md);
			cursor: var(--sr-cursor-pumpkin);
			user-select: none;
			border: .125rem solid #0000;
			font-weight: 600;
		}
		#spkmod-pq {
			display: flex;
			flex-direction: column;
			position: absolute;
			right: 220px;
			z-index: 600000;
			width: 20%;
			color: #FFF;
			top: 18px;
			background: #000C;
			border: ${spkmodBorderWidth} solid #DDD;
			border-radius: 8px;
			padding: 6px;
		}
		#spkmod-gamepad-modal, #spkmod-players-modal {
			display: flex;
			flex-direction: column;
			position: fixed;
			z-index: 600000;
			color: #FFF;
			background: rgba(10, 10, 10, 0.95);
			border: ${spkmodBorderWidth} solid #DDD;
			border-radius: 8px;
			padding: 10px;
			gap: 8px;
			max-height: 85vh;
			overflow-y: auto;
			box-shadow: 0 4px 20px rgba(0,0,0,0.8);
		}
		#spkmod-gamepad-modal {
			width: 450px;
			max-width: 95vw;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
		#spkmod-players-modal {
			width: 320px;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
		.spkmod-binding-row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 6px;
			font-size: 11px;
			padding: 3px 0;
			border-bottom: 1px solid #333;
		}
		.spkmod-binding-key {
			background: #222;
			border: 1px solid #555;
			border-radius: 4px;
			padding: 2px 6px;
			color: #ffd54a;
			font-weight: bold;
			cursor: pointer;
			min-width: 70px;
			text-align: center;
			user-select: none;
		}
		.spkmod-binding-key.listening {
			background: #ffd54a;
			color: #000;
			animation: spkmod-pulse 0.8s infinite alternate;
		}
		@keyframes spkmod-pulse {
			from { opacity: 0.7; transform: scale(0.98); }
			to { opacity: 1.0; transform: scale(1.02); }
		}
		/* honest to god forgot CSS is stupid like that */
		.hidden, #spkmod-pq.hidden, #spkmod-settings-modal.hidden, #spkmod-gamepad-modal.hidden, #spkmod-players-modal.hidden {
			display: none;
		}
		#spkmod-pq-pbar {
			margin-top: 2px;
			background: #0F0;
			height: 2px;
		}
		#spkmod-low-hp-overlay {
			position: fixed;
			top: 0; left: 0; right: 0; bottom: 0;
			pointer-events: none;
			z-index: 500000;
			box-shadow: inset 0 0 150px rgba(255, 0, 0, 0.6);
			opacity: 0;
			transition: opacity 0.5s ease-in-out;
		}
		.spkmod-low-hp-pulse {
			animation: spkmod-hp-pulse 1s infinite alternate;
		}
		@keyframes spkmod-hp-pulse {
			from { opacity: 0.5; box-shadow: inset 0 0 100px rgba(255, 0, 0, 0.5); }
			to { opacity: 1.0; box-shadow: inset 0 0 200px rgba(255, 0, 0, 0.8); }
		}

		`

	}
));

lunHudElements.lowHpOverlay = buildElement("div", { id: "spkmod-low-hp-overlay" });
document.body.appendChild(lunHudElements.lowHpOverlay);

document.body.appendChild(
	buildElement("div", {
		id: "spkmod-hud"
	}, [
		buildElement("div", {
			id: "spkmod-main"
		}, [
			buildElement("div", { id: "spkmod-header-row" }, [
				lunPanelElements.headerBtn = buildElement("span", {
					id: "spkmod-header",
					innerText: t("header"),
					onclick: _ => {
						lunMenuFoldingLevel = (lunMenuFoldingLevel + 1) % 4;
						switch (lunMenuFoldingLevel) {
							case 0:
								document.querySelector("#spkmod-panel").style.display = "";
								lunHudElements.channelTracker.style.display = "";
								document.querySelector("#spkmod-hud").style.opacity = "";
								lunChannelTrackerNextTicks = 0;
								break;
							case 1:
								document.querySelector("#spkmod-panel").style.display = "none";
								break;
							case 2:
								lunHudElements.channelTracker.style.display = "none";
								break;
							case 3:
								document.querySelector("#spkmod-hud").style.opacity = "10%";
								break;
						}
					}
				})
			]),
			lunHudElements.playersNearby = buildElement("span", {
				innerText: t("playersNearby", 0)
			}),
			lunHudElements.zoneId = buildElement("span", {
				innerText: t("zoneId", "N/A")
			}),
			lunHudElements.expTrackerL1 = buildElement("span", {
				innerText: t("zeroExp")
			}),
			lunHudElements.expTrackerL2 = buildElement("span", {
				id: "spkmod-texpb",
				innerText: t("nextLevelNA")
			}),
			lunHudElements.channelTracker = buildElement("span", {
				innerText: t("channelTrackerError", "N/A")
			}),
			lunHudElements.currencyTracker = buildElement("span", {
				innerText: t("currencyTracker", "--", "--")
			}),
			lunHudElements.sessionGoldTracker = buildElement("span", {
				innerText: t("sessionGoldText", "--", "--"),
				style: lunSessionGoldTrackerEnabled ? "" : "display: none;"
			}),
			lunHudElements.fpsPingTracker = buildElement("span", {
				innerText: t("fpsPingText", "--", "--"),
				style: lunFpsPingEnabled ? "" : "display: none;"
			}),
			lunHudElements.footerMsg = buildElement("span", {
				id: "spkmod-footer",
				innerText: t("footerMsg")
			}),
			lunHudElements.discordBtn = buildElement("button", {
				id: "spkmod-discord-btn",
				innerText: t("discordBtn"),
				value: "",
				onclick: _ => {
					const discordUrl = "https://discord.gg/bruZhcwqRx";
					navigator.clipboard.writeText(discordUrl).then(() => {
						chatLog(t("discordCopiedMsg"));
					}).catch(() => {
						chatLog(discordUrl);
					});
				}
			})
		]),
		buildElement("div", {
			id: "spkmod-panel"
		}, [
			buildElement("div", { className: "spkmod-panel-cat" }, [
				lunPanelElements.danceBtn = buildElement("button", {
					className: "spkmod-panel-btn",
					innerText: t("dance"),
					value: "",
					onclick: _ => {
						window.wasDancing = true;
						gameState.sendEmoteNow(Emotes.Dance);
					}
				}),
				lunPanelElements.autoJumpBtn = buildElement("button", {
					id: "spkmod-autojump-btn",
					className: "spkmod-panel-btn",
					innerText: t(window.AutoJumpActive ? "autoJumpOn" : "autoJumpOff"),
					value: "",
					onclick: e => {
						window.AutoJumpActive = !window.AutoJumpActive;
						setText(e.target, t(window.AutoJumpActive ? "autoJumpOn" : "autoJumpOff"));
						if (window.AutoJumpActive) {
							chatLog(t("autoJumpActivatedMsg"));
							autoJumpLoop();
						} else {
							chatLog(t("autoJumpDeactivatedMsg"));
							clearTimeout(window.__autoJumpTimeoutId);
						}
					}
				})
			]),
			buildElement("div", { className: "spkmod-panel-cat" }, [
				lunPanelElements.chowayoBtn = buildElement("button", {
					className: "spkmod-panel-btn",
					innerText: t("chowayo"),
					value: "",
					onclick: _ => {
						gameState.sendEmoteNow(Emotes.PumpkinJoayo);
					}
				}),
				lunPanelElements.heartsBtn = buildElement("button", {
					className: "spkmod-panel-btn",
					innerText: t("hearts"),
					value: "",
					onclick: _ => {
						triggerHearts();
					}
				}),
				lunPanelElements.autoHeartsBtn = buildElement("button", {
					id: "spkmod-autohearts-btn",
					className: "spkmod-panel-btn",
					innerText: t(window.AutoHeartsActive ? "autoHeartsOn" : "autoHeartsOff"),
					value: "",
					onclick: e => {
						window.AutoHeartsActive = !window.AutoHeartsActive;
						setText(e.target, t(window.AutoHeartsActive ? "autoHeartsOn" : "autoHeartsOff"));
						if (window.AutoHeartsActive) {
							chatLog(t("autoHeartsActivatedMsg"));
							autoHeartsLoop();
						} else {
							chatLog(t("autoHeartsDeactivatedMsg"));
							clearTimeout(window.__autoHeartsTimeoutId);
						}
					}
				})
			]),
			buildElement("div", { className: "spkmod-panel-cat" }, [
				lunPanelElements.petBtn = buildElement("button", {
					className: "spkmod-panel-btn",
					innerText: t("pet"),
					value: "",
					onclick: _ => {
						triggerPetSequence();
					}
				}),
				lunPanelElements.ritualBtn = buildElement("button", {
					id: "spkmod-ritual-btn",
					className: "spkmod-panel-btn",
					innerText: t(window.RitualActive ? "ritualOn" : "ritualOff"),
					value: "",
					onclick: e => {
						toggleRitual(e.target);
					}
				})
			]),

			buildElement("div", { className: "spkmod-panel-cat" }, [
				lunPanelElements.shakeBtn = buildElement("button", {
					id: "spkmod-shake-main-btn",
					className: "spkmod-panel-btn",
					innerText: window.ShakeActive ? t("shakeOn") : t("shakeOff"),
					value: "",
					onclick: e => {
						window.ShakeActive = !window.ShakeActive;
						
						if (window.ShakeActive) {
							window.SuperShakeActive = false;
							window.BeyBladeActive = false;
							window.MoonwalkActive = false;
							window.ReverseBeyBladeActive = false;
							updateMovementButtonsUI();
							chatLog(t("shakeActivatedMsg"));
						} else {
							updateMovementButtonsUI();
							if (gameState.playerContainer && gameState.cameraController) {
								gameState.playerContainer.rotation.y = gameState.cameraController.cameraYaw;
								gameState.moveSendAccumulator = 1;
							}
							chatLog(t("shakeDeactivatedMsg"));
						}
					}
				}),
				lunPanelElements.superShakeBtn = buildElement("button", {
					id: "spkmod-supershake-main-btn",
					className: "spkmod-panel-btn",
					innerText: window.SuperShakeActive ? t("superShakeOn") : t("superShakeOff"),
					value: "",
					onclick: e => {
						window.SuperShakeActive = !window.SuperShakeActive;

						if (window.SuperShakeActive) {
							window.ShakeActive = false;
							window.BeyBladeActive = false;
							window.MoonwalkActive = false;
							window.ReverseBeyBladeActive = false;
							updateMovementButtonsUI();
							chatLog(t("superShakeActivatedMsg"));
						} else {
							updateMovementButtonsUI();
							if (gameState.playerContainer && gameState.cameraController) {
								gameState.playerContainer.rotation.y = gameState.cameraController.cameraYaw;
								gameState.moveSendAccumulator = 1;
							}
							chatLog(t("superShakeDeactivatedMsg"));
						}
					}
				})
			]),

			buildElement("div", { className: "spkmod-panel-cat" }, [
				buildElement("button", {
					id: "spkmod-moonwalk-main-btn",
					className: "spkmod-panel-btn",
					innerText: window.MoonwalkActive ? t("moonwalkOn") : t("moonwalkOff"),
					value: "",
					onclick: e => {
						window.MoonwalkActive = !window.MoonwalkActive;

						if (window.MoonwalkActive) {
							window.BeyBladeActive = false;
							window.ShakeActive = false;
							window.SuperShakeActive = false;
							window.ReverseBeyBladeActive = false;
							if (gameState.playerContainer) {
								window.moonwalkLockedYaw = gameState.playerContainer.rotation.y;
							}
							updateMovementButtonsUI();
							chatLog(t("moonwalkActivatedMsg"));
						} else {
							window.moonwalkLockedYaw = null;
							updateMovementButtonsUI();
							if (gameState.playerContainer && gameState.cameraController) {
								gameState.playerContainer.rotation.y = gameState.cameraController.cameraYaw;
								gameState.moveSendAccumulator = 1;
							}
							chatLog(t("moonwalkDeactivatedMsg"));
						}
					}
				}),
				lunPanelElements.panelFollowBtn = buildElement("button", {
					id: "spkmod-follow-main-btn",
					className: "spkmod-panel-btn",
					innerText: lunFollowTargetName ? t("stopFollowing") : t("follow"),
					value: "",
					onclick: e => {
						if (lunFollowTargetName) {
							followPlayer(null);
						} else {
							const targetName = document.querySelector(".sr-party-target__name")?.innerText;
							if (targetName) {
								followPlayer(targetName);
							} else if (gameState.remotePlayers && gameState.remotePlayers.remotePlayers && gameState.remotePlayers.remotePlayers.size > 0) {
								const players = Array.from(gameState.remotePlayers.remotePlayers.values())
									.filter(p => p && p.container && p.info && p.info.name);
								if (players.length) {
									players.sort((a, b) => distanceToVector(a.container.position) - distanceToVector(b.container.position));
									followPlayer(players[0].info.name);
								} else {
									chatLog(t("playersRadarNone"));
								}
							} else {
								chatLog(t("playersRadarNone"));
							}
						}
					}
				})
			]),


			buildElement("div", { className: "spkmod-panel-cat" }, [
				buildElement("button", {
					id: "spkmod-beyblade-main-btn",
					className: "spkmod-panel-btn",
					style: "width: 100%;",
					innerText: t(window.BeyBladeActive ? "beybladeOn" : "beybladeOff"),
					value: "",
					onclick: e => {
						window.BeyBladeActive = !window.BeyBladeActive;
						updateBeyBladeButtonText();
						if (window.BeyBladeActive) {
							window.ShakeActive = false;
							window.MoonwalkActive = false;
							window.ReverseBeyBladeActive = false;
							if (typeof updateReverseBeyBladeButtonText === "function") updateReverseBeyBladeButtonText(); 
							chatLog(t("beybladeActivatedMsg", window.BeyBladeSpeed || 1));
						} else {
							if (typeof updateReverseBeyBladeButtonText === "function") updateReverseBeyBladeButtonText(); 
							if (gameState.playerContainer && gameState.cameraController) {
								gameState.playerContainer.rotation.y = gameState.cameraController.cameraYaw;
								gameState.moveSendAccumulator = 1;
							}

							if (window.wasDancing) {
								setTimeout(() => {
									gameState.sendEmoteNow(Emotes.Dance);
								}, 150);
							}
							window.wasDancing = false;
							chatLog(t("beybladeDeactivatedMsg"));
						}
					}
				}),
				buildElement("button", {
					id: "spkmod-reversebeyblade-main-btn",
					className: "spkmod-panel-btn",
					style: "width: 100%;",
					innerText: t(window.ReverseBeyBladeActive ? "reversebeybladeOn" : "reversebeybladeOff"),
					value: "",
					onclick: e => {
						window.ReverseBeyBladeActive = !window.ReverseBeyBladeActive;
						updateReverseBeyBladeButtonText();

						if (window.ReverseBeyBladeActive) {
							window.BeyBladeActive = false;
							window.ShakeActive = false;
							window.MoonwalkActive = false;
							updateBeyBladeButtonText();
							chatLog(t("reversebeybladeActivatedMsg", window.BeyBladeSpeed || 1));
						} else {
							if (gameState.playerContainer && gameState.cameraController) {
								gameState.playerContainer.rotation.y = gameState.cameraController.cameraYaw;
								gameState.moveSendAccumulator = 1;
							}

							if (window.wasDancing) {
								setTimeout(() => {
									gameState.sendEmoteNow(Emotes.Dance);
								}, 150);
							}
							window.wasDancing = false;
							chatLog(t("reversebeybladeDeactivatedMsg"));
						}
					}
				})
			]),

			buildElement("div", {
				className: "spkmod-panel-cat",
				style: "display: flex; flex-direction: column; width: 100%; box-sizing: border-box; background: rgba(0,0,0,0.4); border: 1.5px solid #fff; border-radius: 6px; padding: 4px 10px;"
			}, [
				buildElement("div", {
					style: "display: flex; align-items: center; justify-content: space-between; width: 100%;"
				}, [
					lunPanelElements.speedLabel = buildElement("span", {
						style: "color: #fff; font-size: 11px; font-weight: bold; user-select: none;",
						innerText: t("speedLabel")
					}),
					lunPanelElements.speedValue = buildElement("span", {
						style: "color: #fff; font-size: 11px; font-weight: bold; user-select: none;",
						innerText: "x" + (window.BeyBladeSpeed || 1)
					})
				]),
				buildElement("input", {
					type: "range",
					min: "0.1",
					max: "2.0",
					step: "0.1",
					value: window.BeyBladeSpeed || 1,
					style: "width: 100%; height: 3px; accent-color: #fff; cursor: pointer; margin: 4px 0 0 0;",
					oninput: e => {
						window.BeyBladeSpeed = parseFloat(e.target.value);
						setText(lunPanelElements.speedValue, "x" + window.BeyBladeSpeed);
						updateBeyBladeButtonText();
						updateReverseBeyBladeButtonText();
					}
				})
			]),

			buildElement("div", { className: "spkmod-panel-cat" }, [
				lunPanelElements.turnToCameraBtn = buildElement("button", {
					className: "spkmod-panel-btn",
					innerText: t("turnToCamera"),
					value: "",
					onclick: _ => {
						if (gameState.playerContainer && gameState.cameraController) {
							gameState.playerContainer.rotation.y = gameState.cameraController.cameraYaw;
							window.moonwalkLockedYaw = gameState.cameraController.cameraYaw;
							gameState.moveSendAccumulator = 1;
						}
					}
				}),
				lunPanelElements.viewClipBtn = buildElement("button", {
					className: "spkmod-panel-btn",
					innerText: t("viewClipOff"),
					value: "",
					onclick: e => {
						lunViewClip = !lunViewClip;
						e.target.innerText = lunViewClip ? t("viewClipOn") : t("viewClipOff");
					}
				})
			]),

			buildElement("div", { className: "spkmod-panel-cat" }, [
				lunPanelElements.lockCameraBtn = buildElement("button", {
					className: "spkmod-panel-btn",
					innerText: t("lockCamera"),
					value: "",
					onclick: e => {
						lunCameraLocked = !lunCameraLocked;
						e.target.innerText = lunCameraLocked ? t("unlockCamera") : t("lockCamera");
					}
				}),
				lunPanelElements.turntableBtn = buildElement("button", {
					id: "spkmod-turntable-btn",
					className: "spkmod-panel-btn",
					innerText: t(window.TurntableActive ? "turntableOn" : "turntableOff"),
					value: "",
					onclick: e => {
						toggleTurntable(e.target);
					}
				})
			]),

			buildElement("div", { className: "spkmod-panel-cat" }, [
				lunPanelElements.nametagsBtn = buildElement("button", {
					className: "spkmod-panel-btn",
					innerText: t("hideNametags"),
					value: "",
					onclick: e => {
						lunNametagsHidden = !lunNametagsHidden;
						e.target.innerText = lunNametagsHidden ? t("showNametags") : t("hideNametags");
					}
				}),
				lunPanelElements.playersRadarBtn = buildElement("button", {
					className: "spkmod-panel-btn",
					innerText: t("playersRadarBtn"),
					value: "",
					onclick: _ => {
						showPlayersRadar();
					}
				})
			]),

			lunPanelElements.resetCameraBtn = buildElement("button", {
				className: "spkmod-panel-btn hidden",
				innerText: t("resetCamera"),
				value: "",
				onclick: _ => {
					watchPlayer();
				}
			}),
			buildElement("div", { className: "spkmod-panel-cat", id: "spkmod-camera-modes-cat" }, [
				lunPanelElements.firstPersonBtn = buildElement("button", {
					className: "spkmod-panel-btn",
					innerText: t("firstPersonOff"),
					onclick: e => {
						lunFirstPersonActive = !lunFirstPersonActive;
						setText(e.target, t(lunFirstPersonActive ? "firstPersonOn" : "firstPersonOff"));
						if (lunFirstPersonActive) {
							lunDroneModeActive = false;
							if (lunPanelElements.freeCamBtn) setText(lunPanelElements.freeCamBtn, t("freeCamOff"));
							if (gameState.cameraController) {
								gameState.cameraController.cameraZoomDistance = 3;
								gameState.cameraController.cameraPitch = lunFirstPersonPitch;
								lunViewClip = true;
								if (lunPanelElements.viewClipBtn) setText(lunPanelElements.viewClipBtn, t("viewClipOn"));
							}
							if (gameState.playerContainer) {
								gameState.playerContainer.children.forEach(c => c.visible = false);
							}
						} else {
							if (gameState.playerContainer) {
								gameState.playerContainer.children.forEach(c => c.visible = true);
							}
							if (gameState.cameraController) {
								gameState.cameraController.cameraZoomDistance = 12;
								lunViewClip = false;
								if (lunPanelElements.viewClipBtn) setText(lunPanelElements.viewClipBtn, t("viewClipOff"));
							}
						}
					}
				}),
				lunPanelElements.freeCamBtn = buildElement("button", {
					className: "spkmod-panel-btn",
					innerText: t("freeCamOff"),
					style: "display: none;", // hidden by default unless gamepad connected
					onclick: e => {
						lunDroneModeActive = !lunDroneModeActive;
						setText(e.target, t(lunDroneModeActive ? "freeCamOn" : "freeCamOff"));
						if (lunDroneModeActive) {
							lunFirstPersonActive = false;
							if (lunPanelElements.firstPersonBtn) setText(lunPanelElements.firstPersonBtn, t("firstPersonOff"));
							if (gameState.playerContainer) {
								gameState.playerContainer.children.forEach(c => c.visible = true);
							}
							// Initialize drone target at player position
							if (gameState.playerContainer && gameState.cameraController) {
								window.spkmodDroneTarget = { position: { x: gameState.playerContainer.position.x, y: gameState.playerContainer.position.y, z: gameState.playerContainer.position.z } };
								gameState.cameraController.target = window.spkmodDroneTarget;
							}
						} else {
							if (gameState.cameraController && gameState.playerContainer) {
								gameState.cameraController.target = gameState.playerContainer;
							}
						}
					}
				})
			]),
			buildElement("div", {
				className: "spkmod-panel-cat"
			}, [
				lunPanelElements.walkToPortalBtn = buildElement("button", {
					className: "spkmod-panel-btn",
					style: "flex: 0 0 auto; min-width: max-content; padding: 4px 8px;",
					innerText: t("goTo"),
					value: "",
					onclick: e => {
						if (lunWalkToPortal == -1) {
							lunWalkToPortal = lunPanelElements.targetZone.value - 0;
							setText(e.target, t("stopWalking"));
							chatLog(t("walkingToMsg", lunPanelElements.targetZone.options[lunPanelElements.targetZone.selectedIndex].innerText, lunWalkToPortal));
						} else {
							resetWalkToPortal();
							chatLog(t("stoppedWalkingMsg"));
						}

						e.target.blur();
						lunPanelElements.targetZone.blur();
					}
				}),
				lunPanelElements.targetZone = buildElement("select", {
					className: "spkmod-panel-combo",
					style: "flex: 1; min-width: 0; height: 28px; padding: 0 4px; font-size: 9.5pt; box-sizing: border-box;"
				}, Object.keys(Portals).map(zoneId => buildElement("option", {
					value: zoneId - 0,
					innerText: i18n(`content.zone.${zoneId}.name`)
				})))
			]),
			buildElement("div", {
				className: "spkmod-panel-cat"
			}, [
				lunPanelElements.langSelect = buildElement("select", {
					className: "spkmod-panel-combo",
					style: "flex: 1; min-width: 0; height: 28px; padding: 0 6px; font-size: 10pt; box-sizing: border-box;",
					value: spkmodLang,
					onchange: e => {
						setLanguage(e.target.value);
					}
				}, Object.keys(spkmodTranslations).map(code => buildElement("option", {
					value: code,
					innerText: spkmodTranslations[code].langName,
					selected: code === spkmodLang
				}))),
				lunPanelElements.settingsBtn = buildElement("button", {
					id: "spkmod-settings-btn",
					className: "spkmod-panel-btn",
					style: "flex: 0 0 32px; width: 32px; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 12pt; cursor: pointer;",
					innerText: "⚙️",
					title: "Settings",
					onclick: _ => {
						const rect = document.querySelector("#spkmod-hud").getBoundingClientRect();
						lunHudElements.settingsModal.style.left = (rect.right + 10) + "px";
						lunHudElements.settingsModal.style.top = rect.top + "px";
						if (lunHudElements.settingsModal.classList.contains("hidden")) {
							updateHudBgDropdown();
						}
						lunHudElements.settingsModal.classList.toggle("hidden");
					}
				}),
				lunPanelElements.dragBtn = buildElement("button", {
					id: "spkmod-drag-btn",
					className: "spkmod-panel-btn",
					style: "flex: 0 0 32px; width: 32px; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 12pt; cursor: grab;",
					innerText: "⚓",
					title: "Drag Menu"
				})
			])
		])
	])
);


document.body.appendChild(
	lunHudElements.pinnedQuest.panel = buildElement("div", {
		id: "spkmod-pq",
		className: "hidden"
	}, [
		lunPanelElements.pinnedQuestHeader = buildElement("span", {
			id: "spkmod-pq-header",
			innerText: t("pinnedQuestHeader")
		}),
		lunHudElements.pinnedQuest.content = buildElement("span", {
			id: "spkmod-pq-content",
			innerText: t("pinnedQuestDefault")
		}),
		lunHudElements.pinnedQuest.pbar = buildElement("div", {
			id: "spkmod-pq-pbar"
		})
	])
)

document.body.appendChild(
	lunHudElements.settingsModal = buildElement("div", {
		id: "spkmod-settings-modal",
		className: "hidden"
	}, [
		buildElement("div", { className: "spkmod-panel-cat", style: "justify-content: space-between;" }, [
			lunPanelElements.settingsHeader = buildElement("span", {
				innerText: t("settingsHeader"),
				style: "font-weight: bold;"
			}),
			buildElement("span", {
				id: "spkmod-settings-close",
				innerText: "✕",
				onclick: _ => {
					lunHudElements.settingsModal.classList.add("hidden");
				}
			})
		]),
		buildElement("div", { className: "spkmod-panel-cat" }, [
			lunPanelElements.filterToggleLabel = buildElement("span", {
				style: "color: #fff; font-size: 11px; font-weight: bold; user-select: none; flex: 1;",
				innerText: t("filterToggleLabel")
			}),
			lunPanelElements.filterToggleInput = buildElement("input", {
				type: "checkbox",
				checked: lunFilterEnabled,
				onchange: e => {
					setFilterEnabled(e.target.checked);
				}
			})
		]),

		buildElement("div", { className: "spkmod-panel-cat" }, [
			lunPanelElements.gmChatToggleLabel = buildElement("span", {
				style: "color: #fff; font-size: 11px; font-weight: bold; user-select: none; flex: 1;",
				innerText: t("gmChatToggleLabel")
			}),
			lunPanelElements.gmChatToggleInput = buildElement("input", {
				type: "checkbox",
				checked: lunGmChatHighlightEnabled,
				onchange: e => {
					setGmChatHighlightEnabled(e.target.checked);
				}
			})
		]),

		buildElement("div", { className: "spkmod-panel-cat" }, [
			lunPanelElements.mentionAlertToggleLabel = buildElement("span", {
				style: "color: #fff; font-size: 11px; font-weight: bold; user-select: none; flex: 1;",
				innerText: t("mentionAlertToggleLabel")
			}),
			lunPanelElements.mentionAlertToggleInput = buildElement("input", {
				type: "checkbox",
				checked: lunMentionAlertEnabled,
				onchange: e => {
					setMentionAlertEnabled(e.target.checked);
				}
			})
		]),

		buildElement("div", { className: "spkmod-panel-cat" }, [
			lunPanelElements.translateToggleLabel = buildElement("span", {
				style: "color: #fff; font-size: 11px; font-weight: bold; user-select: none; flex: 1;",
				innerText: t("translateToggleLabel")
			}),
			lunPanelElements.translateTargetSelect = buildElement("select", {
				className: "spkmod-panel-combo",
				value: lunTranslateTarget,
				onchange: e => setTranslateTarget(e.target.value)
			}, ["en", "ja", "ko", "zh-CN", "es", "fr", "de", "pt", "ru"].map(code => buildElement("option", {
				value: code,
				innerText: code,
				selected: code === lunTranslateTarget
			}))),
			lunPanelElements.translateToggleInput = buildElement("input", {
				type: "checkbox",
				checked: lunTranslateEnabled,
				onchange: e => setTranslateEnabled(e.target.checked)
			})
		]),
		buildElement("div", { className: "spkmod-panel-cat", style: "gap: 4px;" }, [
			buildElement("span", {
				innerText: "ⓘ",
				style: "color: #aaa; font-size: 11px; cursor: pointer; flex: 0;",
				onclick: _ => lunPanelElements.translateEmailInfo.classList.toggle("hidden")
			}),
			lunPanelElements.translateEmailInput = buildElement("input", {
				type: "email",
				placeholder: t("translateEmailPlaceholder"),
				value: lunTranslateEmail,
				style: "flex: 1; font-size: 11px; min-width: 0;",
				onchange: e => setTranslateEmail(e.target.value)
			})
		]),
		lunPanelElements.translateEmailInfo = buildElement("div", {
			className: "hidden",
			style: "color: #aaa; font-size: 10px; line-height: 1.4; padding: 2px 4px 6px;",
			innerText: t("translateEmailTooltip")
		}),

		buildElement("div", { className: "spkmod-panel-cat" }, [
			lunPanelElements.chatTimestampLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("chatTimestampToggleLabel") }),
			lunPanelElements.chatTimestampToggleInput = buildElement("input", { type: "checkbox", checked: lunChatTimestampsEnabled, onchange: e => setChatTimestampsEnabled(e.target.checked) })
		]),
		buildElement("div", { className: "spkmod-panel-cat", style: "border-top: 1px solid rgba(255,255,255,0.1); padding-top: 5px; margin-top: 5px;" }, [
			lunPanelElements.fpPitchLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("firstPersonPitchLabel") }),
			buildElement("input", { type: "range", min: "0.2", max: "0.7", step: "0.01", value: lunFirstPersonPitch, style: "width: 70px;", oninput: e => { 
				lunFirstPersonPitch = parseFloat(e.target.value); 
				if (window.localStorage) localStorage.setItem("spkmod-fp-pitch", lunFirstPersonPitch); 
			}})
		]),
		buildElement("div", { className: "spkmod-panel-cat" }, [
			lunPanelElements.lowHpLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("lowHpWarningToggleLabel") }),
			lunPanelElements.lowHpToggleInput = buildElement("input", { type: "checkbox", checked: lunLowHpWarningEnabled, onchange: e => setLowHpWarningEnabled(e.target.checked) })
		]),
		buildElement("div", { className: "spkmod-panel-cat" }, [
			lunPanelElements.sessionGoldLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("sessionGoldToggleLabel") }),
			lunPanelElements.sessionGoldToggleInput = buildElement("input", { type: "checkbox", checked: lunSessionGoldTrackerEnabled, onchange: e => setSessionGoldTrackerEnabled(e.target.checked) })
		]),
		buildElement("div", { className: "spkmod-panel-cat" }, [
			lunPanelElements.fpsPingLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("fpsPingToggleLabel") }),
			lunPanelElements.fpsPingToggleInput = buildElement("input", { type: "checkbox", checked: lunFpsPingEnabled, onchange: e => setFpsPingEnabled(e.target.checked) })
		]),
		buildElement("div", { className: "spkmod-panel-cat" }, [
			lunPanelElements.gamepadRumbleLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("gamepadRumbleToggleLabel") }),
			lunPanelElements.gamepadRumbleToggleInput = buildElement("input", { type: "checkbox", checked: lunGamepadRumbleEnabled, onchange: e => setGamepadRumbleEnabled(e.target.checked) })
		]),
		buildElement("div", { className: "spkmod-panel-cat", style: "margin-top: 5px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 5px;" }, [
			lunPanelElements.uiScaleLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("uiScaleLabel") }),
			lunPanelElements.uiScaleSlider = buildElement("input", { type: "range", min: "0.8", max: "1.3", step: "0.05", value: lunUiScale, style: "width: 70px;", oninput: e => { lunUiScale = e.target.value; updateDynamicStyles(); } })
		]),
		buildElement("div", { className: "spkmod-panel-cat" }, [
			lunPanelElements.bgOpacityLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("bgOpacityLabel") }),
			lunPanelElements.bgOpacitySelect = buildElement("select", { className: "spkmod-panel-combo", value: lunBgOpacity, onchange: e => { lunBgOpacity = e.target.value; updateDynamicStyles(); } }, [
				buildElement("option", { value: "solid", innerText: t("bgOpacitySolid"), selected: lunBgOpacity === "solid" }),
				buildElement("option", { value: "transparent", innerText: t("bgOpacityTransparent"), selected: lunBgOpacity === "transparent" }),
				buildElement("option", { value: "glass", innerText: t("bgOpacityGlass"), selected: lunBgOpacity === "glass" })
			])
		]),
		buildElement("div", { className: "spkmod-panel-cat" }, [
			lunPanelElements.hudBgLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("hudBackgroundLabel") }),
			lunPanelElements.hudBgSelect = buildElement("select", { className: "spkmod-panel-combo", value: lunHudBackground, onchange: e => { lunHudBackground = e.target.value; updateDynamicStyles(); } })
		]),
		buildElement("div", { className: "spkmod-panel-cat" }, [
			lunPanelElements.accentColorLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("accentColorLabel") }),
			lunPanelElements.accentColorInput = buildElement("input", { type: "color", value: lunAccentColor, style: "width: 40px; height: 20px; padding: 0; border: none; background: none; cursor: pointer;", onchange: e => { lunAccentColor = e.target.value; updateDynamicStyles(); } }),
			buildElement("button", { className: "spkmod-panel-btn", style: "padding: 0px 4px; font-size: 10px; margin-left: 4px;", innerText: "OK", onclick: () => { lunAccentColor = lunPanelElements.accentColorInput.value; updateDynamicStyles(); } })
		]),
		buildElement("div", { className: "spkmod-panel-cat", style: "gap: 4px; margin-top: 5px;" }, [
			lunPanelElements.exportSettingsBtn = buildElement("button", { className: "spkmod-panel-btn", style: "flex: 1;", innerText: t("exportSettingsBtn"), onclick: () => {
				const keys = Object.keys(localStorage).filter(k => k.startsWith("spkmod-"));
				const exportData = {};
				keys.forEach(k => exportData[k] = localStorage.getItem(k));
				const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = "speakimod_settings.json";
				a.click();
				URL.revokeObjectURL(url);
			}}),
			lunPanelElements.importSettingsBtn = buildElement("button", { className: "spkmod-panel-btn", style: "flex: 1;", innerText: t("importSettingsBtn"), onclick: () => {
				const input = document.createElement("input");
				input.type = "file";
				input.accept = "application/json";
				input.onchange = e => {
					const file = e.target.files[0];
					if (file) {
						const reader = new FileReader();
						reader.onload = e2 => {
							try {
								const data = JSON.parse(e2.target.result);
								Object.keys(data).forEach(k => {
									if (k.startsWith("spkmod-")) localStorage.setItem(k, data[k]);
								});
								alert("Settings imported! Please refresh the page to apply them.");
								location.reload();
							} catch (err) { alert("Invalid settings file."); }
						};
						reader.readAsText(file);
					}
				};
				input.click();
			}})
		]),

		buildElement("div", { className: "spkmod-panel-cat" }, [
			lunPanelElements.gamepadSettingsBtn = buildElement("button", {
				className: "spkmod-panel-btn" + ((window.localStorage && localStorage.getItem("spkmod-gamepad-unlocked") === "true") ? "" : " hidden"),
				innerText: t("gamepadBtn"),
				onclick: _ => {
					openGamepadModal();
				}
			})
		]),

		lunPanelElements.creditsLabel = buildElement("div", {
			style: "color: #aaa; font-size: 10px; margin-top: 6px; white-space: pre-wrap; line-height: 1.4; border-top: 1px solid #555; padding-top: 6px; user-select: none; cursor: pointer;",
			innerText: t("credits"),
			onclick: _ => {
				const now = Date.now();
				if (now - (window.__spkmodGlasLastClick || 0) > 3000) window.__spkmodGlasClicks = 0;
				window.__spkmodGlasLastClick = now;
				window.__spkmodGlasClicks = (window.__spkmodGlasClicks || 0) + 1;
				if (window.__spkmodGlasClicks >= 3) {
					if (window.localStorage) localStorage.setItem("spkmod-gamepad-unlocked", "true");
					if (lunPanelElements.gamepadSettingsBtn) {
						lunPanelElements.gamepadSettingsBtn.classList.remove("hidden");
					}
					chatLog(t("gamepadUnlockedMsg"));
					window.__spkmodGlasClicks = 0;
				}
			}
		})

	])
)

const lunJumpAnimMs = 700; // approx. duration of the Jump emote animation

function autoJumpLoop() {
	if (!window.AutoJumpActive) return;
	gameState.sendEmoteNow(Emotes.Jump);
	window.__autoJumpTimeoutId = setTimeout(autoJumpLoop, lunJumpAnimMs);
}

const lunHeartsAnimMs = 950; // Optimized to match maximum server emote throughput without packet drop

function triggerHearts() {
	if (gameState && gameState.bloomEffects && typeof gameState.bloomEffects.spawnHearts === "function" && gameState.playerContainer) {
		gameState.bloomEffects.spawnHearts(gameState.playerContainer);
	}
	if (gameState && typeof gameState.sendEmoteNow === "function") {
		gameState.sendEmoteNow(Emotes.StrokeBloom);
	}
}

function autoHeartsLoop() {
	if (!window.AutoHeartsActive) return;
	triggerHearts();
	window.__autoHeartsTimeoutId = setTimeout(autoHeartsLoop, lunHeartsAnimMs);
}

let petSequenceTimeouts = [];

function clearPetSequence() {
	petSequenceTimeouts.forEach(id => clearTimeout(id));
	petSequenceTimeouts = [];
}

function triggerPetSequence() {
	if (!gameState || typeof gameState.sendEmoteNow !== "function") return;
	clearPetSequence();
	chatLog(t("petActivatedMsg"));

	// Stage 1: Stroke Start (hand appears, petting begins)
	gameState.sendEmoteNow(Emotes.StrokeStart);

	// Stage 2: Stroke Step 1 (first stroke reaction + mini hearts)
	petSequenceTimeouts.push(setTimeout(() => {
		if (gameState && typeof gameState.sendEmoteNow === "function") {
			gameState.sendEmoteNow(Emotes.StrokeStage2);
			if (gameState.bloomEffects && typeof gameState.bloomEffects.spawnHearts === "function" && gameState.playerContainer) {
				gameState.bloomEffects.spawnHearts(gameState.playerContainer);
			}
		}
	}, 450));

	// Stage 3: Stroke Step 2 (second stroke reaction)
	petSequenceTimeouts.push(setTimeout(() => {
		if (gameState && typeof gameState.sendEmoteNow === "function") {
			gameState.sendEmoteNow(Emotes.StrokeStage2);
		}
	}, 950));

	// Stage 4: Stroke Step 3 (third stroke reaction + mini hearts)
	petSequenceTimeouts.push(setTimeout(() => {
		if (gameState && typeof gameState.sendEmoteNow === "function") {
			gameState.sendEmoteNow(Emotes.StrokeStage2);
			if (gameState.bloomEffects && typeof gameState.bloomEffects.spawnHearts === "function" && gameState.playerContainer) {
				gameState.bloomEffects.spawnHearts(gameState.playerContainer);
			}
		}
	}, 1450));

	// Stage 5: Full Climax Stroke Bloom (maximum heart explosion fireworks!)
	petSequenceTimeouts.push(setTimeout(() => {
		triggerHearts();
	}, 2050));
}

window.RitualActive = false;
let ritualCenter = null;
let ritualEmoteTick = 0;
const RITUAL_RADIUS = 1.1; // Sized closely to one player's perimeter

function toggleRitual(btn) {
	window.RitualActive = !window.RitualActive;
	if (window.RitualActive) {
		if (lunFollowTargetName && gameState.remotePlayers && gameState.remotePlayers.remotePlayers) {
			const tp = Array.from(gameState.remotePlayers.remotePlayers.values()).find(t => t.info && t.info.name === lunFollowTargetName);
			if (tp && tp.container) {
				ritualCenter = tp.container.position;
			}
		}
		if (!ritualCenter) {
			ritualCenter = Object.assign({}, getPlayerPos());
		}
		ritualEmoteTick = 0;
		chatLog(t("ritualActivatedMsg"));
	} else {
		ritualCenter = null;
		chatLog(t("ritualDeactivatedMsg"));
	}
	if (btn) setText(btn, t(window.RitualActive ? "ritualOn" : "ritualOff"));
}

window.TurntableActive = false;

function toggleTurntable(btn) {
	window.TurntableActive = !window.TurntableActive;
	if (window.TurntableActive) {
		chatLog(t("turntableActivatedMsg"));
	} else {
		chatLog(t("turntableDeactivatedMsg"));
	}
	if (btn) setText(btn, t(window.TurntableActive ? "turntableOn" : "turntableOff"));
}

function followPlayer(name) {
	if (name && name !== lunFollowTargetName) {
		lunFollowTargetName = name;
		chatLog(t("followStartMsg", name));
	} else {
		lunFollowTargetName = null;
		chatLog(t("followStopMsg"));
	}
	if (lunPanelElements.panelFollowBtn) {
		setText(lunPanelElements.panelFollowBtn, lunFollowTargetName ? t("stopFollowing") : t("follow"));
	}
}

function findBestTarget(cycle = false) {
	if (!gameState || !gameState.monsters || !gameState.monsters.monsters) return null;
	const monsters = Array.from(gameState.monsters.monsters.values())
		.filter(m => m && m.info && (m.info.currentHp === undefined || m.info.currentHp > 0) && m.container);
	if (!monsters.length) return null;

	const pp = getPlayerPos();
	const maxMeleeDist = 3.5; // Strictly adjacent melee enemies only

	const nearby = monsters.map(m => {
		const mp = m.container.position;
		const dx = mp.x - pp.x;
		const dz = mp.z - pp.z;
		const dist = Math.hypot(dx, dz);
		return { monster: m, id: m.info.monsterInstanceId, dist };
	}).filter(item => item.dist <= maxMeleeDist).sort((a, b) => a.dist - b.dist);

	if (!nearby.length) return null;

	let targetId = nearby[0].id;
	if (cycle && nearby.length > 1) {
		const currentIdx = nearby.findIndex(s => s.id === gameState.targetMonsterId);
		if (currentIdx !== -1) {
			targetId = nearby[(currentIdx + 1) % nearby.length].id;
		}
	}

	gameState.setTarget(targetId);
	gameState.combatAssist.autoAttackActive = true;
	return targetId;
}

function showPlayersRadar() {
	if (!gameState.remotePlayers || !gameState.remotePlayers.remotePlayers) return;
	const players = Array.from(gameState.remotePlayers.remotePlayers.values());
	if (!players.length) {
		chatLog(t("playersRadarNone"));
		return;
	}

	const list = players.map(p => {
		const dist = p.container ? distanceToVector(p.container.position).toFixed(1) : "?";
		return {
			name: p.info?.name || "Unknown",
			level: p.info?.level ?? "?",
			id: p.info?.playerId ?? "?",
			dist: dist
		};
	}).sort((a, b) => parseFloat(a.dist) - parseFloat(b.dist));

	chatLog(t("playersRadarHeader", list.length) + "\n" + list.map(p => t("playersRadarRow", p.name, p.level, p.dist, p.id)).join("\n"));
}

const SPKMOD_GAMEPAD_CONFIG_KEY = "spkmod-gamepad-config";

const SPKMOD_DEFAULT_GAMEPAD_CONFIG = {
	version: 3,
	enabled: true,
	deadzone: 0.15,
	cameraSensitivity: 1.2,
	invertCameraX: false,
	invertCameraY: false,
	bindings: {
		0: "potion",            // A / Cross (Heal / Potion)
		1: "skill4",            // B / Circle (Skill 4)
		2: "attack",            // X / Square (Attack / Auto-Target / Portal)
		3: "skill3",            // Y / Triangle (Skill 3)
		4: "skill1",            // LB / L1 (Skill 1)
		5: "zoomIn",            // RB / R1 (Zoom In)
		6: "skill2",            // LT / L2 (Skill 2)
		7: "zoomOut",           // RT / R2 (Zoom Out)
		8: "town",              // Back / View / Select (Back to Town)
		9: "toggleSettings",    // Start / Menu
		10: "autoJump",         // L3 (Toggle Autojump)
		11: "lockCamera",       // R3 (Lock Camera)
		12: "dance",            // D-Pad Up (Dance Emote)
		13: "chowayo",          // D-Pad Down (Chowayo Emote)
		14: "beyblade",         // D-Pad Left (Left Spin)
		15: "reversebeyblade"   // D-Pad Right (Right Spin)
	}
};

const SPKMOD_GAMEPAD_ACTIONS = [
	"attack", "skill1", "skill2", "skill3", "skill4", "potion",
	// "jump", "target", "moonwalk", "resetCamera",
	"beyblade", "reversebeyblade", "dance", "chowayo", "hearts", "town",
	"zoomIn", "zoomOut", "lockCamera", "autoJump", "toggleSettings"
];

const SPKMOD_GAMEPAD_BUTTON_NAMES = [
	"A / ✕", "B / ◯", "X / ▢", "Y / △", "LB / L1", "RB / R1", "LT / L2", "RT / R2",
	"Back / View / Select", "Start / Menu", "L3 (Left Stick Click)", "R3 (Right Stick Click)",
	"D-Pad Up", "D-Pad Down", "D-Pad Left", "D-Pad Right"
];

let spkmodGamepadConfig = (() => {
	try {
		const raw = localStorage.getItem(SPKMOD_GAMEPAD_CONFIG_KEY);
		if (raw) {
			const parsed = JSON.parse(raw);
			if (parsed.version === 3) {
				return Object.assign({}, SPKMOD_DEFAULT_GAMEPAD_CONFIG, parsed);
			}
		}
	} catch (e) {}
	return JSON.parse(JSON.stringify(SPKMOD_DEFAULT_GAMEPAD_CONFIG));
})();

function saveGamepadConfig() {
	try {
		localStorage.setItem(SPKMOD_GAMEPAD_CONFIG_KEY, JSON.stringify(spkmodGamepadConfig));
	} catch (e) {}
}

let gamepadMoveVector = null;
let gamepadPrevButtons = new Array(16).fill(false);
let gamepadListeningAction = null;

function executeGamepadAction(actionName) {
	switch (actionName) {
		case "jump":
			gameState.sendEmoteNow(Emotes.Jump);
			if (typeof gameState.tryUsePortal === "function") gameState.tryUsePortal();
			break;
		case "attack":
			if (typeof gameState.tryUsePortal === "function") gameState.tryUsePortal();
			if (!gameState.targetMonsterId || gameState.targetMonsterId <= 0) {
				findBestTarget(false);
			}
			gameState.combatAssist.autoAttackActive = true;
			break;
		case "skill1":
			if (gameState.skillHotbar && gameState.skillHotbar.slots && gameState.skillHotbar.slots[0]) {
				const sid = gameState.skillHotbar.slots[0].skillId;
				if (sid) gameState.combatAssist.requestActiveSkillCast(sid, 5);
			}
			break;
		case "skill2":
			if (gameState.skillHotbar && gameState.skillHotbar.slots && gameState.skillHotbar.slots[1]) {
				const sid = gameState.skillHotbar.slots[1].skillId;
				if (sid) gameState.combatAssist.requestActiveSkillCast(sid, 5);
			}
			break;
		case "skill3":
			if (gameState.skillHotbar && gameState.skillHotbar.slots && gameState.skillHotbar.slots[2]) {
				const sid = gameState.skillHotbar.slots[2].skillId;
				if (sid) gameState.combatAssist.requestActiveSkillCast(sid, 5);
			}
			break;
		case "skill4":
			if (gameState.skillHotbar && gameState.skillHotbar.slots && gameState.skillHotbar.slots[3]) {
				const sid = gameState.skillHotbar.slots[3].skillId;
				if (sid) gameState.combatAssist.requestActiveSkillCast(sid, 5);
			}
			break;
		case "potion":
			if (gameState.tryUsePotion) gameState.tryUsePotion();
			break;
		case "target":
			findBestTarget(true);
			break;
		case "beyblade":
			window.BeyBladeActive = !window.BeyBladeActive;
			if (window.BeyBladeActive) {
				window.ShakeActive = false;
				window.SuperShakeActive = false;
				window.MoonwalkActive = false;
				window.ReverseBeyBladeActive = false;
				chatLog(t("beybladeActivatedMsg", window.BeyBladeSpeed || 1));
			} else {
				chatLog(t("beybladeDeactivatedMsg"));
			}
			updateMovementButtonsUI();
			break;
		case "reversebeyblade":
			window.ReverseBeyBladeActive = !window.ReverseBeyBladeActive;
			if (window.ReverseBeyBladeActive) {
				window.ShakeActive = false;
				window.SuperShakeActive = false;
				window.MoonwalkActive = false;
				window.BeyBladeActive = false;
				chatLog(t("reversebeybladeActivatedMsg", window.BeyBladeSpeed || 1));
			} else {
				chatLog(t("reversebeybladeDeactivatedMsg"));
			}
			updateMovementButtonsUI();
			break;
		case "dance":
			gameState.sendEmoteNow(Emotes.Dance);
			break;
		case "chowayo":
			gameState.sendEmoteNow(Emotes.PumpkinJoayo);
			break;
		case "hearts":
			triggerHearts();
			break;
		case "moonwalk":
			window.MoonwalkActive = !window.MoonwalkActive;
			if (window.MoonwalkActive) {
				window.BeyBladeActive = false;
				window.ShakeActive = false;
				window.SuperShakeActive = false;
				window.ReverseBeyBladeActive = false;
				if (gameState.playerContainer) {
					window.moonwalkLockedYaw = gameState.playerContainer.rotation.y;
				}
				chatLog(t("moonwalkActivatedMsg"));
			} else {
				window.moonwalkLockedYaw = null;
				if (gameState.playerContainer && gameState.cameraController) {
					gameState.playerContainer.rotation.y = gameState.cameraController.cameraYaw;
					gameState.moveSendAccumulator = 1;
				}
				chatLog(t("moonwalkDeactivatedMsg"));
			}
			updateMovementButtonsUI();
			break;
		case "town":
			if (typeof gameState.tryReturnToTown === "function") {
				gameState.tryReturnToTown();
			} else if (typeof gameState.returnToTown === "function") {
				gameState.returnToTown();
			} else {
				if (lunWalkToPortal !== 1) {
					lunWalkToPortal = 1;
					if (lunPanelElements.walkToPortalBtn) setText(lunPanelElements.walkToPortalBtn, t("stopWalking"));
					chatLog(t("walkingToMsg", "Yggdrasil", 1));
				} else {
					resetWalkToPortal();
					chatLog(t("stoppedWalkingMsg"));
				}
			}
			break;
		case "lockCamera":
			lunCameraLocked = !lunCameraLocked;
			if (lunPanelElements.lockCameraBtn) {
				lunPanelElements.lockCameraBtn.innerText = lunCameraLocked ? t("unlockCamera") : t("lockCamera");
			}
			break;
		case "resetCamera":
			watchPlayer();
			break;
		case "zoomIn":
			if (gameState.cameraController) {
				gameState.cameraController.cameraZoomDistance = Math.max(3, (gameState.cameraController.cameraZoomDistance || 12) - 1);
			}
			break;
		case "zoomOut":
			if (gameState.cameraController) {
				gameState.cameraController.cameraZoomDistance = Math.min(18, (gameState.cameraController.cameraZoomDistance || 12) + 1);
			}
			break;
		case "autoJump":
			window.AutoJumpActive = !window.AutoJumpActive;
			if (lunPanelElements.autoJumpBtn) setText(lunPanelElements.autoJumpBtn, t(window.AutoJumpActive ? "autoJumpOn" : "autoJumpOff"));
			if (window.AutoJumpActive) { autoJumpLoop(); } else { clearTimeout(window.__autoJumpTimeoutId); }
			break;
		case "toggleSettings":
			if (lunHudElements.settingsModal) {
				if (lunHudElements.settingsModal.classList.contains("hidden")) {
					updateHudBgDropdown();
				}
				lunHudElements.settingsModal.classList.toggle("hidden");
			}
			break;
	}
}

let gamepadModalElements = {
	headerTitle: null,
	statusText: null,
	pressedKeysText: null,
	deadzoneLabel: null,
	deadzoneSlider: null,
	deadzoneValue: null,
	sensLabel: null,
	sensSlider: null,
	sensValue: null,
	invertXLabel: null,
	invertXCheckbox: null,
	invertYLabel: null,
	invertYCheckbox: null,
	bindingsContainer: null,
	diagramContainer: null,
	toggleDiagramBtn: null,
	resetBtn: null
};

window.__showGamepadDiagram = false;

function openGamepadModal() {
	if (lunHudElements.gamepadModal) {
		lunHudElements.gamepadModal.classList.remove("hidden");
		refreshGamepadModalI18n();
	}
}

function refreshGamepadModalI18n() {
	if (gamepadModalElements.headerTitle) setText(gamepadModalElements.headerTitle, t("gamepadHeader"));
	if (gamepadModalElements.deadzoneLabel) setText(gamepadModalElements.deadzoneLabel, t("gamepadDeadzoneLabel"));
	if (gamepadModalElements.sensLabel) setText(gamepadModalElements.sensLabel, t("gamepadSensLabel"));
	if (gamepadModalElements.invertXLabel) setText(gamepadModalElements.invertXLabel, t("gamepadInvertX"));
	if (gamepadModalElements.invertYLabel) setText(gamepadModalElements.invertYLabel, t("gamepadInvertY"));
	if (gamepadModalElements.toggleDiagramBtn) setText(gamepadModalElements.toggleDiagramBtn, window.__showGamepadDiagram ? t("gamepadHideDiagramBtn") : t("gamepadShowDiagramBtn"));
	if (gamepadModalElements.resetBtn) setText(gamepadModalElements.resetBtn, t("gamepadResetBtn"));
	refreshGamepadBindingsUI();
	renderGamepadDiagram();
}

function refreshGamepadBindingsUI() {
	if (!gamepadModalElements.bindingsContainer) return;
	gamepadModalElements.bindingsContainer.replaceChildren(
		...SPKMOD_GAMEPAD_ACTIONS.map(action => {
			const assignedBtnIdx = Object.keys(spkmodGamepadConfig.bindings).find(k => spkmodGamepadConfig.bindings[k] === action);
			const btnLabel = assignedBtnIdx !== undefined ? (SPKMOD_GAMEPAD_BUTTON_NAMES[assignedBtnIdx] || `Button ${assignedBtnIdx}`) : "Unassigned";

			const isListening = gamepadListeningAction === action;
			const keyBtn = buildElement("span", {
				className: "spkmod-binding-key" + (isListening ? " listening" : ""),
				innerText: isListening ? t("gamepadPressPrompt") : btnLabel,
				onclick: () => {
					if (gamepadListeningAction === action) {
						gamepadListeningAction = null;
					} else {
						gamepadListeningAction = action;
					}
					refreshGamepadBindingsUI();
					renderGamepadDiagram();
				}
			});

			return buildElement("div", { className: "spkmod-binding-row" }, [
				buildElement("span", { innerText: t(`gamepadAction_${action}`) || action }),
				keyBtn
			]);
		})
	);
	renderGamepadDiagram();
}

function renderGamepadDiagram() {
	if (!gamepadModalElements.diagramContainer || !window.__showGamepadDiagram) return;
	
	const b = spkmodGamepadConfig.bindings || {};
	const getActionLabel = (btnIdx) => {
		const act = b[btnIdx];
		if (!act) return "-";
		const loc = t(`gamepadAction_${act}`);
		return (loc && !loc.startsWith("gamepadAction_")) ? loc : act;
	};

	gamepadModalElements.diagramContainer.innerHTML = `
		<svg viewBox="0 0 460 250" style="width: 100%; height: auto; display: block; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5)); user-select: none;">
			<defs>
				<linearGradient id="gpBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stop-color="#2a2a2e" />
					<stop offset="100%" stop-color="#141416" />
				</linearGradient>
			</defs>
			
			<!-- Controller Silhouette Body -->
			<path d="M 120 45 C 170 35, 290 35, 340 45 C 410 60, 445 130, 430 205 C 420 250, 375 245, 345 200 C 315 155, 290 160, 230 160 C 170 160, 145 155, 115 200 C 85 245, 40 250, 30 205 C 15 130, 50 60, 120 45 Z" fill="url(#gpBodyGrad)" stroke="#555" stroke-width="2.5" />
			
			<!-- Triggers & Bumpers -->
			<!-- L2 / LT (Btn 6) -->
			<rect id="spkmod-gp-btn-6" x="65" y="10" width="85" height="24" rx="6" fill="#1e1e24" stroke="#555" stroke-width="1.5" />
			<text x="107" y="26" fill="#ffd54a" font-size="9.5" font-weight="bold" text-anchor="middle" font-family="sans-serif">LT: ${getActionLabel(6)}</text>
			
			<!-- L1 / LB (Btn 4) -->
			<rect id="spkmod-gp-btn-4" x="75" y="38" width="75" height="18" rx="4" fill="#2d2d34" stroke="#666" stroke-width="1.5" />
			<text x="112" y="51" fill="#fff" font-size="9" font-weight="bold" text-anchor="middle" font-family="sans-serif">LB: ${getActionLabel(4)}</text>

			<!-- R2 / RT (Btn 7) -->
			<rect id="spkmod-gp-btn-7" x="310" y="10" width="85" height="24" rx="6" fill="#1e1e24" stroke="#555" stroke-width="1.5" />
			<text x="352" y="26" fill="#ffd54a" font-size="9.5" font-weight="bold" text-anchor="middle" font-family="sans-serif">RT: ${getActionLabel(7)}</text>
			
			<!-- R1 / RB (Btn 5) -->
			<rect id="spkmod-gp-btn-5" x="310" y="38" width="75" height="18" rx="4" fill="#2d2d34" stroke="#666" stroke-width="1.5" />
			<text x="347" y="51" fill="#fff" font-size="9" font-weight="bold" text-anchor="middle" font-family="sans-serif">RB: ${getActionLabel(5)}</text>

			<!-- Left Stick (Move) -->
			<circle cx="130" cy="100" r="22" fill="#1a1a1c" stroke="#555" stroke-width="2" />
			<circle id="spkmod-gp-btn-10" cx="130" cy="100" r="16" fill="#333" stroke="#ffd54a" stroke-width="1.5" />
			<text x="130" y="98" fill="#fff" font-size="9" font-weight="bold" text-anchor="middle" font-family="sans-serif">L-Stick</text>
			<text x="130" y="109" fill="#aaa" font-size="8" text-anchor="middle" font-family="sans-serif">${getActionLabel(10)}</text>

			<!-- D-Pad -->
			<g transform="translate(130, 162)">
				<!-- Up (Btn 12) -->
				<rect id="spkmod-gp-btn-12" x="-8" y="-28" width="16" height="18" rx="3" fill="#2d2d34" stroke="#555" stroke-width="1" />
				<text x="0" y="-16" fill="#fff" font-size="8" font-weight="bold" text-anchor="middle">▲</text>
				<!-- Down (Btn 13) -->
				<rect id="spkmod-gp-btn-13" x="-8" y="10" width="16" height="18" rx="3" fill="#2d2d34" stroke="#555" stroke-width="1" />
				<text x="0" y="22" fill="#fff" font-size="8" font-weight="bold" text-anchor="middle">▼</text>
				<!-- Left (Btn 14) -->
				<rect id="spkmod-gp-btn-14" x="-28" y="-8" width="18" height="16" rx="3" fill="#2d2d34" stroke="#555" stroke-width="1" />
				<text x="-19" y="4" fill="#fff" font-size="8" font-weight="bold" text-anchor="middle">◀</text>
				<!-- Right (Btn 15) -->
				<rect id="spkmod-gp-btn-15" x="10" y="-8" width="18" height="16" rx="3" fill="#2d2d34" stroke="#555" stroke-width="1" />
				<text x="19" y="4" fill="#fff" font-size="8" font-weight="bold" text-anchor="middle">▶</text>
				<!-- Center -->
				<rect x="-8" y="-8" width="16" height="16" fill="#2d2d34" />
			</g>
			<!-- D-Pad Labels -->
			<text x="75" y="145" fill="#ffd54a" font-size="8.5" text-anchor="end" font-family="sans-serif">▲ ${getActionLabel(12)}</text>
			<text x="75" y="162" fill="#ffd54a" font-size="8.5" text-anchor="end" font-family="sans-serif">◀ ${getActionLabel(14)}</text>
			<text x="75" y="179" fill="#ffd54a" font-size="8.5" text-anchor="end" font-family="sans-serif">▼ ${getActionLabel(13)}</text>
			<text x="75" y="196" fill="#ffd54a" font-size="8.5" text-anchor="end" font-family="sans-serif">▶ ${getActionLabel(15)}</text>

			<!-- Center Buttons (Select & Start) -->
			<!-- Select / Back (Btn 8) -->
			<rect id="spkmod-gp-btn-8" x="188" y="90" width="22" height="12" rx="4" fill="#2d2d34" stroke="#666" stroke-width="1" />
			<text x="199" y="84" fill="#ffd54a" font-size="8" font-weight="bold" text-anchor="middle" font-family="sans-serif">Select</text>
			<text x="199" y="114" fill="#aaa" font-size="7.5" text-anchor="middle" font-family="sans-serif">${getActionLabel(8)}</text>

			<!-- Start / Menu (Btn 9) -->
			<rect id="spkmod-gp-btn-9" x="250" y="90" width="22" height="12" rx="4" fill="#2d2d34" stroke="#666" stroke-width="1" />
			<text x="261" y="84" fill="#ffd54a" font-size="8" font-weight="bold" text-anchor="middle" font-family="sans-serif">Start</text>
			<text x="261" y="114" fill="#aaa" font-size="7.5" text-anchor="middle" font-family="sans-serif">${getActionLabel(9)}</text>

			<!-- Right Stick (Look / Cam) -->
			<circle cx="280" cy="150" r="22" fill="#1a1a1c" stroke="#555" stroke-width="2" />
			<circle id="spkmod-gp-btn-11" cx="280" cy="150" r="16" fill="#333" stroke="#ffd54a" stroke-width="1.5" />
			<text x="280" y="148" fill="#fff" font-size="9" font-weight="bold" text-anchor="middle" font-family="sans-serif">R-Stick</text>
			<text x="280" y="159" fill="#aaa" font-size="8" text-anchor="middle" font-family="sans-serif">${getActionLabel(11)}</text>

			<!-- Face Buttons (X, Y, A, B) -->
			<g transform="translate(350, 100)">
				<!-- Y / Triangle (Btn 3) -->
				<circle id="spkmod-gp-btn-3" cx="0" cy="-22" r="11" fill="#222" stroke="#eab308" stroke-width="2" />
				<text x="0" y="-18" fill="#eab308" font-size="10" font-weight="bold" text-anchor="middle" font-family="sans-serif">Y</text>
				<!-- X / Square (Btn 2) -->
				<circle id="spkmod-gp-btn-2" cx="-22" cy="0" r="11" fill="#222" stroke="#3b82f6" stroke-width="2" />
				<text x="-22" y="4" fill="#3b82f6" font-size="10" font-weight="bold" text-anchor="middle" font-family="sans-serif">X</text>
				<!-- B / Circle (Btn 1) -->
				<circle id="spkmod-gp-btn-1" cx="22" cy="0" r="11" fill="#222" stroke="#ef4444" stroke-width="2" />
				<text x="22" y="4" fill="#ef4444" font-size="10" font-weight="bold" text-anchor="middle" font-family="sans-serif">B</text>
				<!-- A / Cross (Btn 0) -->
				<circle id="spkmod-gp-btn-0" cx="0" cy="22" r="11" fill="#222" stroke="#22c55e" stroke-width="2" />
				<text x="0" y="26" fill="#22c55e" font-size="10" font-weight="bold" text-anchor="middle" font-family="sans-serif">A</text>
			</g>
			<!-- Face Buttons Labels -->
			<text x="385" y="85" fill="#ffd54a" font-size="8.5" font-family="sans-serif">Y: ${getActionLabel(3)}</text>
			<text x="385" y="103" fill="#ffd54a" font-size="8.5" font-family="sans-serif">X: ${getActionLabel(2)}</text>
			<text x="385" y="121" fill="#ffd54a" font-size="8.5" font-family="sans-serif">B: ${getActionLabel(1)}</text>
			<text x="385" y="139" fill="#ffd54a" font-size="8.5" font-family="sans-serif">A: ${getActionLabel(0)}</text>
		</svg>
	`;
}

function updateGamepadModalLive(gp) {
	if (!lunHudElements.gamepadModal || lunHudElements.gamepadModal.classList.contains("hidden")) return;
	if (gamepadModalElements.statusText) {
		if (gp) {
			gamepadModalElements.statusText.innerText = t("gamepadConnected", gp.id || "Controller");
			gamepadModalElements.statusText.style.color = "#4ade80";
		} else {
			gamepadModalElements.statusText.innerText = t("gamepadDisconnected");
			gamepadModalElements.statusText.style.color = "#f87171";
		}
	}
	if (gp) {
		const pressed = [];
		for (let i = 0; i < gp.buttons.length && i < 16; i++) {
			const b = gp.buttons[i];
			const isDown = typeof b === "object" ? b.pressed : b > 0.5;
			if (isDown) {
				pressed.push(SPKMOD_GAMEPAD_BUTTON_NAMES[i] || `B${i}`);
			}
			const btnEl = document.getElementById(`spkmod-gp-btn-${i}`);
			if (btnEl) {
				btnEl.setAttribute("fill", isDown ? "#ffd54a" : (i <= 3 || i >= 10 ? "#333" : "#2d2d34"));
			}
		}
		if (gamepadModalElements.pressedKeysText) {
			gamepadModalElements.pressedKeysText.innerText = pressed.length ? `Pressed: ${pressed.join(", ")}` : "";
		}
	}
}

document.body.appendChild(
	lunHudElements.gamepadModal = buildElement("div", {
		id: "spkmod-gamepad-modal",
		className: "hidden"
	}, [
		buildElement("div", { className: "spkmod-panel-cat", style: "justify-content: space-between;" }, [
			gamepadModalElements.headerTitle = buildElement("span", { innerText: t("gamepadHeader"), style: "font-weight: bold; font-size: 12px;" }),
			buildElement("span", {
				id: "spkmod-gamepad-close",
				innerText: "✕",
				style: "cursor: pointer;",
				onclick: _ => lunHudElements.gamepadModal.classList.add("hidden")
			})
		]),
		gamepadModalElements.statusText = buildElement("div", {
			style: "font-size: 11px; padding: 4px 6px; background: #111; border-radius: 4px; border: 1px solid #333;",
			innerText: t("gamepadDisconnected")
		}),
		gamepadModalElements.pressedKeysText = buildElement("div", {
			style: "font-size: 10px; color: #ffd54a; min-height: 14px;"
		}),
		buildElement("div", { style: "display: flex; flex-direction: column; gap: 4px; border: 1px solid #333; border-radius: 6px; padding: 6px; background: rgba(0,0,0,0.3);" }, [
			buildElement("div", { style: "display: flex; justify-content: space-between; font-size: 11px;" }, [
				gamepadModalElements.deadzoneLabel = buildElement("span", { innerText: t("gamepadDeadzoneLabel") }),
				gamepadModalElements.deadzoneValue = buildElement("span", { innerText: Math.round((spkmodGamepadConfig.deadzone || 0.15) * 100) + "%" })
			]),
			gamepadModalElements.deadzoneSlider = buildElement("input", {
				type: "range", min: "0.05", max: "0.40", step: "0.01",
				value: spkmodGamepadConfig.deadzone || 0.15,
				style: "width: 100%; height: 3px; accent-color: #ffd54a; cursor: pointer;",
				oninput: e => {
					spkmodGamepadConfig.deadzone = parseFloat(e.target.value);
					gamepadModalElements.deadzoneValue.innerText = Math.round(spkmodGamepadConfig.deadzone * 100) + "%";
					saveGamepadConfig();
				}
			}),
			buildElement("div", { style: "display: flex; justify-content: space-between; font-size: 11px; margin-top: 4px;" }, [
				gamepadModalElements.sensLabel = buildElement("span", { innerText: t("gamepadSensLabel") }),
				gamepadModalElements.sensValue = buildElement("span", { innerText: (spkmodGamepadConfig.cameraSensitivity || 1.2).toFixed(1) + "x" })
			]),
			gamepadModalElements.sensSlider = buildElement("input", {
				type: "range", min: "0.2", max: "3.0", step: "0.1",
				value: spkmodGamepadConfig.cameraSensitivity || 1.2,
				style: "width: 100%; height: 3px; accent-color: #ffd54a; cursor: pointer;",
				oninput: e => {
					spkmodGamepadConfig.cameraSensitivity = parseFloat(e.target.value);
					gamepadModalElements.sensValue.innerText = spkmodGamepadConfig.cameraSensitivity.toFixed(1) + "x";
					saveGamepadConfig();
				}
			}),
			buildElement("div", { style: "display: flex; gap: 12px; margin-top: 4px; font-size: 11px;" }, [
				buildElement("label", { style: "display: flex; align-items: center; gap: 4px; cursor: pointer;" }, [
					gamepadModalElements.invertXCheckbox = buildElement("input", {
						type: "checkbox", checked: !!spkmodGamepadConfig.invertCameraX,
						onchange: e => { spkmodGamepadConfig.invertCameraX = e.target.checked; saveGamepadConfig(); }
					}),
					gamepadModalElements.invertXLabel = buildElement("span", { innerText: t("gamepadInvertX") })
				]),
				buildElement("label", { style: "display: flex; align-items: center; gap: 4px; cursor: pointer;" }, [
					gamepadModalElements.invertYCheckbox = buildElement("input", {
						type: "checkbox", checked: !!spkmodGamepadConfig.invertCameraY,
						onchange: e => { spkmodGamepadConfig.invertCameraY = e.target.checked; saveGamepadConfig(); }
					}),
					gamepadModalElements.invertYLabel = buildElement("span", { innerText: t("gamepadInvertY") })
				])
			])
		]),
		gamepadModalElements.diagramContainer = buildElement("div", {
			id: "spkmod-gamepad-diagram",
			className: "hidden",
			style: "width: 100%; margin: 4px 0; border: 1px solid #333; border-radius: 6px; padding: 4px; background: rgba(0,0,0,0.5); box-sizing: border-box;"
		}),
		gamepadModalElements.bindingsContainer = buildElement("div", {
			style: "display: flex; flex-direction: column; gap: 2px; max-height: 200px; overflow-y: auto; padding-right: 4px;"
		}),
		buildElement("div", { style: "display: flex; gap: 6px; margin-top: 4px;" }, [
			gamepadModalElements.toggleDiagramBtn = buildElement("button", {
				className: "spkmod-panel-btn",
				style: "flex: 1;",
				innerText: window.__showGamepadDiagram ? t("gamepadHideDiagramBtn") : t("gamepadShowDiagramBtn"),
				onclick: () => {
					window.__showGamepadDiagram = !window.__showGamepadDiagram;
					if (gamepadModalElements.diagramContainer) {
						gamepadModalElements.diagramContainer.classList.toggle("hidden", !window.__showGamepadDiagram);
					}
					if (gamepadModalElements.toggleDiagramBtn) {
						setText(gamepadModalElements.toggleDiagramBtn, window.__showGamepadDiagram ? t("gamepadHideDiagramBtn") : t("gamepadShowDiagramBtn"));
					}
					renderGamepadDiagram();
				}
			}),
			gamepadModalElements.resetBtn = buildElement("button", {
				className: "spkmod-panel-btn",
				style: "flex: 0 0 auto;",
				innerText: t("gamepadResetBtn"),
				onclick: () => {
					spkmodGamepadConfig = JSON.parse(JSON.stringify(SPKMOD_DEFAULT_GAMEPAD_CONFIG));
					saveGamepadConfig();
					gamepadModalElements.deadzoneSlider.value = spkmodGamepadConfig.deadzone;
					gamepadModalElements.deadzoneValue.innerText = Math.round(spkmodGamepadConfig.deadzone * 100) + "%";
					gamepadModalElements.sensSlider.value = spkmodGamepadConfig.cameraSensitivity;
					gamepadModalElements.sensValue.innerText = spkmodGamepadConfig.cameraSensitivity.toFixed(1) + "x";
					gamepadModalElements.invertXCheckbox.checked = false;
					gamepadModalElements.invertYCheckbox.checked = false;
					refreshGamepadBindingsUI();
					renderGamepadDiagram();
				}
			})
		])
	])
);

function pollGamepadLoop() {
	const gamepads = typeof navigator.getGamepads === "function" ? navigator.getGamepads() : [];
	let gp = null;
	for (let i = 0; i < gamepads.length; i++) {
		if (gamepads[i] && gamepads[i].connected) {
			gp = gamepads[i];
			break;
		}
	}

	if (lunPanelElements.freeCamBtn) {
		const isConnected = !!gp;
		const display = isConnected ? "" : "none";
		if (lunPanelElements.freeCamBtn.style.display !== display) {
			lunPanelElements.freeCamBtn.style.display = display;
		}
	}

	if (gp && spkmodGamepadConfig.enabled) {
		updateGamepadModalLive(gp);

		const deadzone = spkmodGamepadConfig.deadzone || 0.15;
		const sens = spkmodGamepadConfig.cameraSensitivity || 1.2;

		// 1. Left Stick -> Camera Relative Movement
		let lx = gp.axes[0] || 0;
		let ly = gp.axes[1] || 0;
		const lMag = Math.hypot(lx, ly);

		if (lMag > deadzone) {
			const camYaw = gameState?.cameraController ? gameState.cameraController.cameraYaw : 0;
			const worldX = lx * Math.cos(camYaw) + ly * Math.sin(camYaw);
			const worldZ = -lx * Math.sin(camYaw) + ly * Math.cos(camYaw);
			gamepadMoveVector = normalizeVector(worldX, worldZ);
		} else {
			gamepadMoveVector = null;
		}

		// 2. Right Stick -> Camera Yaw (X-axis) & Camera Pitch / Height (Y-axis)
		let rx = gp.axes[2] || 0;
		let ry = gp.axes[3] || 0;

		if (Math.abs(rx) > deadzone && gameState?.cameraController && !lunCameraLocked) {
			const invX = spkmodGamepadConfig.invertCameraX ? -1 : 1;
			gameState.cameraController.cameraYaw += rx * sens * invX * 0.05;
		}
		if (Math.abs(ry) > deadzone && gameState?.cameraController && !lunCameraLocked && !lunFirstPersonActive) {
			const invY = spkmodGamepadConfig.invertCameraY ? -1 : 1;
			const deltaPitch = ry * 0.03 * sens * invY;
			if (gameState.cameraController.cameraPitch !== undefined) {
				gameState.cameraController.cameraPitch = Math.max(-0.5, Math.min(1.2, gameState.cameraController.cameraPitch - deltaPitch));
			} else if (gameState.cameraController.pitch !== undefined) {
				gameState.cameraController.pitch = Math.max(-0.5, Math.min(1.2, gameState.cameraController.pitch - deltaPitch));
			} else if (gameState.cameraController.cameraElevation !== undefined) {
				gameState.cameraController.cameraElevation = Math.max(0.1, Math.min(2.5, gameState.cameraController.cameraElevation - deltaPitch));
			} else if (gameState.cameraController.cameraOffsetY !== undefined) {
				gameState.cameraController.cameraOffsetY = Math.max(0, Math.min(10, gameState.cameraController.cameraOffsetY - deltaPitch * 5));
			}
		}

		// 3. Buttons
		for (let b = 0; b < gp.buttons.length && b < 16; b++) {
			const btnObj = gp.buttons[b];
			const isPressed = typeof btnObj === "object" ? btnObj.pressed : btnObj > 0.5;
			const wasPressed = gamepadPrevButtons[b];

			if (isPressed && !wasPressed) {
				if (gamepadListeningAction) {
					spkmodGamepadConfig.bindings[b] = gamepadListeningAction;
					saveGamepadConfig();
					gamepadListeningAction = null;
					refreshGamepadBindingsUI();
				} else {
					const action = spkmodGamepadConfig.bindings[b];
					if (action) executeGamepadAction(action);
				}
			}

			gamepadPrevButtons[b] = isPressed;
		}
	} else {
		gamepadMoveVector = null;
		updateGamepadModalLive(null);
	}

	requestAnimationFrame(pollGamepadLoop);
}

requestAnimationFrame(pollGamepadLoop);

function updateBeyBladeButtonText() {
	const mainBtn = document.querySelector("#spkmod-beyblade-main-btn");
	if (!mainBtn) return;

	setText(mainBtn, t(window.BeyBladeActive ? "beybladeOn" : "beybladeOff"));
}

function updateReverseBeyBladeButtonText() {
	const mainBtn = document.querySelector("#spkmod-reversebeyblade-main-btn");
	if (!mainBtn) return;

	setText(mainBtn, t(window.ReverseBeyBladeActive ? "reversebeybladeOn" : "reversebeybladeOff"));
}

function sec(t) {
	return t * lunTPS;
}

function normalizeVector(x, y) {
	const n = Math.sqrt(x * x + y * y);
	return n < 1e-6 ? {
		x: 0,
		z: 0
	} : {
		x: x / n,
		z: y / n
	}
}

function distanceToVector(vec) {
	var ep = getPlayerPos();

	return Math.hypot(vec.x - ep.x, vec.z - ep.z);
}

function getPlayerPos() {
	return gameState.playerContainer.position;
}

const lunTranslateCache = new Map(); // `${source}|${target}:${text}` -> translated text
const lunTranslateMaxLen = 480; // MyMemory free tier is ~500 chars/request
let lunTranslateQueue = Promise.resolve();
let lunTranslateLastAt = 0;
const lunTranslateMinGapMs = 400;

function guessSourceLang(text) {
	if (/[\uAC00-\uD7A3]/.test(text)) return "ko"; // Hangul
	if (/[\u3040-\u30FF\u4E00-\u9FFF]/.test(text)) return "ja"; // Kana / Kanji
	return "en";
}

function cleanTranslatedText(text) {
	if (!text || typeof text !== "string") return "";
	let cleaned = text;


	cleaned = cleaned.replace(/&lt;\/?[a-zA-Z0-9_\-:]+(?:\s+[^&>]*?)?&gt;/gi, "");
	cleaned = cleaned.replace(/<\/?[a-zA-Z0-9_\-:]+(?:\s+[^>]*?)?>/gi, "");


	try {
		const doc = new DOMParser().parseFromString(cleaned, "text/html");
		if (doc && doc.body) cleaned = doc.body.textContent || cleaned;
	} catch (e) {
		cleaned = cleaned
			.replace(/&amp;/g, "&")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, "'")
			.replace(/&apos;/g, "'")
			.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
			.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
	}
	cleaned = cleaned.replace(/<\/?[a-zA-Z0-9_\-:]+(?:\s+[^>]*?)?>/gi, "");
	cleaned = cleaned.replace(/<[^>]*>/g, "");

	return cleaned.trim();
}

async function translateChatText(text, source, target) {
	if (!text || !text.trim() || source === target) return null;
	if (text.length > lunTranslateMaxLen) text = text.slice(0, lunTranslateMaxLen);

	const normalized = text.trim().toLowerCase().replace(/\s+/g, " ");
	const cacheKey = `${source}|${target}:${normalized}`;
	if (lunTranslateCache.has(cacheKey)) return lunTranslateCache.get(cacheKey);

	const run = lunTranslateQueue.then(async () => {
		const wait = lunTranslateLastAt + lunTranslateMinGapMs - Date.now();
		if (wait > 0) await new Promise(r => setTimeout(r, wait));
		lunTranslateLastAt = Date.now();

		try {
			const params = new URLSearchParams({ q: text, langpair: `${source}|${target}` });
			if (lunTranslateEmail) params.set("de", lunTranslateEmail);
			// Optional: add &de=you@example.com for a higher daily quota (50k vs 5k chars/day):
				if (window.localStorage && localStorage.getItem("spkmod-translate-email")) params.set("de", localStorage.getItem("spkmod-translate-email"));
			const res = await fetch(`https://api.mymemory.translated.net/get?${params}`);
			if (!res.ok) {
				console.warn(`[SpeakiMod+] Translation HTTP ${res.status}`);
				return null;
			}
			const data = await res.json();
			if (res.status === 429 || data?.responseStatus === 429) {
				setTranslateEnabled(false);
				chatLog(t("translateQuotaHitMsg"));
				return null;
			}
			let translated = cleanTranslatedText(data?.responseData?.translatedText);
			if (!translated || data.responseStatus !== 200) return null;
			// MyMemory just echoes the input back when it has nothing better
			if (translated.trim().toLowerCase() === text.trim().toLowerCase()) return null;

			lunTranslateCache.set(cacheKey, translated);
			return translated;
		} catch (err) {
			console.warn("[SpeakiMod+] Translation request failed:", err);
			return null;
		}
	});

	lunTranslateQueue = run.catch(() => { });
	return run;
}

function maybeTranslateChatMessage(id, name, msg) {
	if (!lunTranslateEnabled) return;
	if (id === -1337 || id === -1338) return; // skip SpeakiMod's own system/translation lines
	if (typeof msg !== "string" || !msg.trim()) return;
	if (msg.trim().length < 2) return;

	const source = guessSourceLang(msg);
	translateChatText(msg, source, lunTranslateTarget).then(translated => {
		if (!translated) return;
		appendColoredChatLine(-1338, `↳ ${name}`, translated);
	});
}	

function observeNextChatNode(matchText, callback) {
	if (!matchText || !matchText.trim()) return;
	const chatLogEl = document.querySelector(".sr-chatbox__log");
	if (!chatLogEl) return;

	let timeoutId;
	const observer = new MutationObserver(mutations => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (node.nodeType !== 1) continue;
				const bodyText = node.classList?.contains("sr-chatbox__body-text")
					? node
					: node.querySelector?.(".sr-chatbox__body-text");
				if (bodyText && bodyText.textContent && bodyText.textContent.includes(matchText)) {
					clearTimeout(timeoutId);
					callback(bodyText, node);
					observer.disconnect();
					return;
				}
			}
		}
	});
	observer.observe(chatLogEl, { childList: true, subtree: true });
	timeoutId = setTimeout(() => observer.disconnect(), 500);
}

function chatLog(msg) {
	gameState.chatBox.append(-1337, "SpeakiMod+", msg);
}

function watchPlayer(name) {
	if (name) {
		const pi = Object.values(Object.fromEntries(gameState.remotePlayers.remotePlayers)).find(t => t.info.name == name);
		if (pi) {
			gameState.cameraController.target = pi.container;
			lunPanelElements.resetCameraBtn.classList.remove("hidden");
			chatLog(t("watchFollowingMsg", name));
			return;
		} else {
			chatLog(t("watchNotFoundMsg"));
		}
	} else {
		chatLog(t("watchFollowingSelfMsg"));
	}

	lunPanelElements.resetCameraBtn.classList.add("hidden");
	gameState.cameraController.target = gameState.playerContainer;
}

var hPartyTarget = document.querySelector(".sr-party-target");
if (hPartyTarget) {
	hPartyTarget.insertBefore(
		lunPanelElements.followBtn = buildElement("button", {
			className: "sr-btn sr-party-target__btn spkmod-watch-player-btn",
			style: "margin-right: 4px;",
			innerText: t("followBtn"),
			value: "",
			onclick: e => {
				const name = e.target.parentElement.querySelector(".sr-party-target__name")?.innerText;
				followPlayer(name);
			}
		}),
		hPartyTarget.querySelector(".sr-party-target__close")
	);
	hPartyTarget.insertBefore(
		lunPanelElements.watchBtn = buildElement("button", {
			className: "sr-btn sr-party-target__btn spkmod-watch-player-btn",
			innerText: t("watchBtn"),
			value: "",
			onclick: e => {
				watchPlayer(e.target.parentElement.querySelector(".sr-party-target__name")?.innerText);
			}
		}),
		hPartyTarget.querySelector(".sr-party-target__close")
	);
} else {
	console.warn("[SpeakiMod+] Couldn't find party target element. Watch/Follow will be available through chat commands.");
}

function updateMovementButtonsUI() {
	const shakeBtn = document.querySelector("#spkmod-shake-main-btn");
	if (shakeBtn) setText(shakeBtn, window.ShakeActive ? t("shakeOn") : t("shakeOff"));

	const superShakeBtn = document.querySelector("#spkmod-supershake-main-btn");
	if (superShakeBtn) setText(superShakeBtn, window.SuperShakeActive ? t("superShakeOn") : t("superShakeOff"));

	const moonwalkBtn = document.querySelector("#spkmod-moonwalk-main-btn");
	if (moonwalkBtn) setText(moonwalkBtn, window.MoonwalkActive ? t("moonwalkOn") : t("moonwalkOff"));

	const beybladeBtn = document.querySelector("#spkmod-beyblade-main-btn");
	if (beybladeBtn) setText(beybladeBtn, t(window.BeyBladeActive ? "beybladeOn" : "beybladeOff"));

	const revBeybladeBtn = document.querySelector("#spkmod-reversebeyblade-main-btn");
	if (revBeybladeBtn) setText(revBeybladeBtn, t(window.ReverseBeyBladeActive ? "reversebeybladeOn" : "reversebeybladeOff"));
}

spkmodI18nRenderers.push(() => {
	setText(lunPanelElements.headerBtn, t("header"));
	setText(lunPanelElements.danceBtn, t("dance"));
	setText(lunPanelElements.chowayoBtn, t("chowayo"));
	setText(lunPanelElements.heartsBtn, t("hearts"));
	setText(lunPanelElements.autoHeartsBtn, t(window.AutoHeartsActive ? "autoHeartsOn" : "autoHeartsOff"));
	setText(lunPanelElements.petBtn, t("pet"));
	setText(lunPanelElements.ritualBtn, t(window.RitualActive ? "ritualOn" : "ritualOff"));
	setText(lunPanelElements.turntableBtn, t(window.TurntableActive ? "turntableOn" : "turntableOff"));
	setText(lunHudElements.discordBtn, t("discordBtn"));
	setText(lunPanelElements.autoJumpBtn, t(window.AutoJumpActive ? "autoJumpOn" : "autoJumpOff"));
	setText(lunPanelElements.speedLabel, t("speedLabel"));
	setText(lunPanelElements.turnToCameraBtn, t("turnToCamera"));
	setText(lunPanelElements.playersRadarBtn, t("playersRadarBtn"));
	setText(lunPanelElements.resetCameraBtn, t("resetCamera"));
	setText(lunPanelElements.lockCameraBtn, lunCameraLocked ? t("unlockCamera") : t("lockCamera"));
	setText(lunPanelElements.nametagsBtn, lunNametagsHidden ? t("showNametags") : t("hideNametags"));
	setText(lunPanelElements.viewClipBtn, lunViewClip ? t("viewClipOn") : t("viewClipOff"));
	setText(lunPanelElements.walkToPortalBtn, lunWalkToPortal == -1 ? t("goTo") : t("stopWalking"));
	setText(lunPanelElements.watchBtn, t("watchBtn"));
	setText(lunPanelElements.followBtn, t("followBtn"));
	if (lunPanelElements.panelFollowBtn) setText(lunPanelElements.panelFollowBtn, lunFollowTargetName ? t("stopFollowing") : t("follow"));
	setText(lunPanelElements.gamepadSettingsBtn, t("gamepadBtn"));
	setText(lunPanelElements.pinnedQuestHeader, t("pinnedQuestHeader"));
	setText(lunHudElements.footerMsg, t("footerMsg"));
	setText(lunPanelElements.settingsHeader, t("settingsHeader"));
	if (lunPanelElements.filterToggleLabel) setText(lunPanelElements.filterToggleLabel, t("filterToggleLabel"));
	if (lunPanelElements.gmChatToggleLabel) setText(lunPanelElements.gmChatToggleLabel, t("gmChatToggleLabel"));
	if (lunPanelElements.mentionAlertToggleLabel) setText(lunPanelElements.mentionAlertToggleLabel, t("mentionAlertToggleLabel"));
	if (lunPanelElements.chatTimestampLabel) setText(lunPanelElements.chatTimestampLabel, t("chatTimestampToggleLabel"));
	if (lunPanelElements.fpPitchLabel) setText(lunPanelElements.fpPitchLabel, t("firstPersonPitchLabel"));
	if (lunPanelElements.firstPersonBtn) setText(lunPanelElements.firstPersonBtn, t(lunFirstPersonActive ? "firstPersonOn" : "firstPersonOff"));
	if (lunPanelElements.freeCamBtn) setText(lunPanelElements.freeCamBtn, t(lunDroneModeActive ? "freeCamOn" : "freeCamOff"));
	if (lunPanelElements.lowHpLabel) setText(lunPanelElements.lowHpLabel, t("lowHpWarningToggleLabel"));
	if (lunPanelElements.sessionGoldLabel) setText(lunPanelElements.sessionGoldLabel, t("sessionGoldToggleLabel"));
	if (lunPanelElements.fpsPingLabel) setText(lunPanelElements.fpsPingLabel, t("fpsPingToggleLabel"));
	if (lunPanelElements.gamepadRumbleLabel) setText(lunPanelElements.gamepadRumbleLabel, t("gamepadRumbleToggleLabel"));
	if (lunPanelElements.uiScaleLabel) setText(lunPanelElements.uiScaleLabel, t("uiScaleLabel"));
	if (lunPanelElements.bgOpacityLabel) setText(lunPanelElements.bgOpacityLabel, t("bgOpacityLabel"));
	if (lunPanelElements.bgOpacitySelect) {
		lunPanelElements.bgOpacitySelect.options[0].innerText = t("bgOpacitySolid");
		lunPanelElements.bgOpacitySelect.options[1].innerText = t("bgOpacityTransparent");
		lunPanelElements.bgOpacitySelect.options[2].innerText = t("bgOpacityGlass");
	}
	if (lunPanelElements.hudBgLabel) setText(lunPanelElements.hudBgLabel, t("hudBackgroundLabel"));
	if (lunPanelElements.accentColorLabel) setText(lunPanelElements.accentColorLabel, t("accentColorLabel"));
	if (lunPanelElements.exportSettingsBtn) setText(lunPanelElements.exportSettingsBtn, t("exportSettingsBtn"));
	if (lunPanelElements.importSettingsBtn) setText(lunPanelElements.importSettingsBtn, t("importSettingsBtn"));
	if (lunPanelElements.creditsLabel) setText(lunPanelElements.creditsLabel, t("credits"));
	if (lunHudElements.totalPlayersOnline) setText(lunHudElements.totalPlayersOnline, t("totalPlayersOnline"));
	
	refreshGamepadModalI18n();
	if (typeof updateHudBgDropdown === 'function') updateHudBgDropdown();

	setText(lunHudElements.currencyTracker, lunLastGold === null
		? t("currencyTracker", "--", "--")
		: t("currencyTracker", lunLastGold.toLocaleString(), lunLastElif.toLocaleString()));
	if (!lunPinnedQuestId) setText(lunHudElements.pinnedQuest.content, t("pinnedQuestDefault"));

	updateMovementButtonsUI();

	if (lunPanelElements.translateToggleLabel) setText(lunPanelElements.translateToggleLabel, t("translateToggleLabel"));
	if (lunPanelElements.translateEmailInput) lunPanelElements.translateEmailInput.placeholder = t("translateEmailPlaceholder");
	if (lunPanelElements.translateEmailInfo) lunPanelElements.translateEmailInfo.innerText = t("translateEmailTooltip");
	document.querySelectorAll(".spkmod-clickable-line").forEach(node => {
		node.title = t("clickToTranslateTooltip");
	});
});

const lunPinnedQuestInterval = sec(2);
var lunPinnedQuestPeriod = null;
var lunPinnedQuestId = 0;
var lunPinnedQuestContent = null;
var lunPinnedQuestNextQueryTick = 0;

function updatePinnedQuestDisplay(quest) {
	lunPinnedQuestContent = `${i18n(`content.quest.${quest.code}.description`)} ${quest.currentAmount} / ${quest.targetAmount}`;
	setText(lunHudElements.pinnedQuest.content, lunPinnedQuestContent);
	lunHudElements.pinnedQuest.pbar.style.width = `${((quest.currentAmount / quest.targetAmount) * 100).toFixed(0)}%`;
}

function unpinQuest() {
	lunHudElements.pinnedQuest.panel.className = "hidden";

	lunPinnedQuestContent = null;
	lunPinnedQuestPeriod = null;
	lunPinnedQuestId = 0;
	lunPinnedQuestNextQueryTick = 0;
}

function pinQuest(quest) {
	lunPinnedQuestPeriod = quest.period;
	lunPinnedQuestId = quest.questId;
	lunPinnedQuestNextQueryTick = lunTickCount + sec(1);

	updatePinnedQuestDisplay(quest);

	lunHudElements.pinnedQuest.panel.className = "";
}

if (window.questManager) {
	const hkRenderRow = questManager.prototype.renderRow;
	questManager.prototype.renderRow = function (quest) {
		var questElm = hkRenderRow.apply(this, [quest]);

		if (!quest.isCompleted) {
			questElm.querySelector(".sr-list-item__subtitle")
				.replaceWith(
					buildElement("button", {
						value: "",
						className: "spkmod-pq-button",
						innerText: t("pinQuestBtn"),
						onclick: _ => {
							pinQuest(quest, questElm);
						}
					})
				);
		}

		return questElm;
	};
}

function onGameDataUpdate() {

}

function resetWalkToPortal() {
	lunWalkToPortal = -1;
	Object.values(Waypoints).forEach(t => t.forEach(w => w.crossed = false));
	setText(lunPanelElements.walkToPortalBtn, t("goTo"));
}

window.beyBladeAngle = window.beyBladeAngle || 0;
window.__beyBladeLastTime = window.__beyBladeLastTime || performance.now();

if (!window.__beyBladeLoopRunning) {
	window.__beyBladeLoopRunning = true;

	function beyBladeRenderLoop(currentTime) {
		if ((window.BeyBladeActive || window.ReverseBeyBladeActive) && gameState && gameState.playerContainer) {
			const delta = (currentTime - window.__beyBladeLastTime) / 1000;
			const clampedDelta = Math.min(delta, 0.1);
			const speedMultiplier = window.BeyBladeSpeed || 1;
			const baseSpeed = 3.0;
			const direction = window.ReverseBeyBladeActive ? -1 : 1;

			window.beyBladeAngle += direction * baseSpeed * speedMultiplier * clampedDelta;
			gameState.playerContainer.rotation.y = window.beyBladeAngle;

			if (Math.random() < 0.2) {
				gameState.moveSendAccumulator = 1;
			}
		} else if (window.MoonwalkActive && gameState && gameState.playerContainer) {
			if (window.moonwalkLockedYaw === undefined || window.moonwalkLockedYaw === null) {
				window.moonwalkLockedYaw = gameState.playerContainer.rotation.y;
			}
			gameState.playerContainer.rotation.y = window.moonwalkLockedYaw;
			if (Math.random() < 0.25) {
				gameState.moveSendAccumulator = 1;
			}
		}

		window.__beyBladeLastTime = currentTime;
		requestAnimationFrame(beyBladeRenderLoop);
	}

	requestAnimationFrame(beyBladeRenderLoop);
}


function tick() {

	if (gameState && gameState.myStat) {
		const hp = gameState.myStat.hp || 0;
		const maxHp = gameState.myStat.maxHp || 1;
		const hpRatio = hp / maxHp;

		if (lunFirstPersonActive && gameState.cameraController) {
			gameState.cameraController.cameraZoomDistance = 3;
			gameState.cameraController.cameraPitch = lunFirstPersonPitch;
			if (lunTickCount % 50 === 0) {
				console.log("[SpeakiMod+] First Person Camera Info:", {
					pitch: gameState.cameraController.cameraPitch,
					zoom: gameState.cameraController.cameraZoomDistance,
					yaw: gameState.cameraController.cameraYaw,
					targetY: gameState.cameraController.target?.position?.y,
					camY: gameState.cameraController.camera?.position?.y
				});
			}
		}

		if (lunLowHpWarningEnabled) {
			if (hpRatio < 0.25 && hp > 0) {
				if (!lunHudElements.lowHpOverlay.classList.contains("spkmod-low-hp-pulse")) {
					lunHudElements.lowHpOverlay.classList.add("spkmod-low-hp-pulse");
					lunHudElements.lowHpOverlay.style.opacity = "1";
				}
			} else {
				if (lunHudElements.lowHpOverlay.classList.contains("spkmod-low-hp-pulse")) {
					lunHudElements.lowHpOverlay.classList.remove("spkmod-low-hp-pulse");
					lunHudElements.lowHpOverlay.style.opacity = "0";
				}
			}
		} else if (lunHudElements.lowHpOverlay.style.opacity !== "0") {
			lunHudElements.lowHpOverlay.classList.remove("spkmod-low-hp-pulse");
			lunHudElements.lowHpOverlay.style.opacity = "0";
		}

		window._lunLastHp = window._lunLastHp || hp;
		if (lunGamepadRumbleEnabled && hp < window._lunLastHp && (window._lunLastHp - hp) > (maxHp * 0.05)) {
			try {
				const gp = navigator.getGamepads().find(g => g && g.vibrationActuator);
				if (gp) gp.vibrationActuator.playEffect('dual-rumble', { startDelay: 0, duration: 250, weakMagnitude: 0.8, strongMagnitude: 0.8 });
			} catch (e) {}
		}
		window._lunLastHp = hp;
	}

	if (gameState.chatBubbles && typeof gameState.chatBubbles.show === "function" && !gameState.chatBubbles.__speakiHooked) {
		var hkChatBubblesShow = gameState.chatBubbles.show.bind(gameState.chatBubbles);
		gameState.chatBubbles.show = (e, t, n) => {
			return hkChatBubblesShow(e, t, filterName(n));
		};
		gameState.chatBubbles.__speakiHooked = true; // 
		console.log("[SpeakiMod+] Successfully hooked chatBubbles.show!");
	}
	var playerExp = gameState.myStat.exp;
	var zoneId = gameState.zoneId % 10000;
	var expTrackerTimer = Math.max(0, Math.ceil((lunExpTrackerNextTicks - lunTickCount) / lunTPS));
	var expTrackerL1 = t("zeroExp");
	var expTrackerL2 = t("nextLevelNA");

	if (!lunExpTrackerInitialized) {
		lunExpTrackerStartExp = playerExp;
		lunExpTrackerNextTicks = lunTickCount + lunExpTrackerWindow;
		lunExpTrackerInitialized = true;
	}

	else if (playerExp < lunExpTrackerStartExp || lunTickCount >= lunExpTrackerNextTicks) {
		lunExpTrackerStartExp = playerExp;
		lunExpTrackerNextTicks = lunTickCount + lunExpTrackerWindow;
	}

	var expGained = Math.max(0, playerExp - lunExpTrackerStartExp);
	lunExpTrackerSpeed = expGained / 60; 

	if (lunExpTrackerSpeed > 0) {
		expTrackerL1 = t("expPerMinute", (lunExpTrackerSpeed * 60).toFixed(0), expTrackerTimer);

		var minutesRemaining = (gameState.myStat.maxExp - playerExp) / lunExpTrackerSpeed / 60;
		if (minutesRemaining >= 60) {
			var hoursRemaining = (minutesRemaining / 60).toFixed(1);
			expTrackerL2 = t("nextLevelHours", hoursRemaining);
		} else {
			expTrackerL2 = t("nextLevel", minutesRemaining.toFixed(0));
		}
	} else {
		expTrackerL1 += ` (${expTrackerTimer}s)`;
	}

	if (gameState.isDead && lunWalkToPortal != -1) {
		resetWalkToPortal();
		chatLog(t("diedMsg"));
	}

	if (window.MoonwalkActive && gameState && gameState.playerContainer) {
		if (window.moonwalkLockedYaw === undefined || window.moonwalkLockedYaw === null) {
			window.moonwalkLockedYaw = gameState.playerContainer.rotation.y;
		}
		gameState.playerContainer.rotation.y = window.moonwalkLockedYaw;
		gameState.moveSendAccumulator = 1;
	}

	if (window.TurntableActive && gameState && gameState.cameraController && !lunCameraLocked) {
		gameState.cameraController.cameraYaw += 0.015;
	}

	window.shakeBaseAngle = window.shakeBaseAngle || 0;
	if ((window.ShakeActive || window.SuperShakeActive) && gameState && gameState.playerContainer && gameState.cameraController) {
		const currentBaseYaw = gameState.cameraController.cameraYaw;
		const isSuper = !!window.SuperShakeActive;
		const shakeSpeed = isSuper ? 160 : 80;   // Jitter frequency
		const shakeAmount = isSuper ? 0.35 : 0.05; // Jitter amplitude (radians)
		const offset = Math.sin(performance.now() * 0.001 * shakeSpeed) * shakeAmount;

		gameState.playerContainer.rotation.y = currentBaseYaw + offset;
		gameState.moveSendAccumulator = 1;
	}

	if ((window.BeyBladeActive || window.ReverseBeyBladeActive) && gameState.playerContainer) {
		if (!window.beyBladeNextJumpTick) {
			window.beyBladeNextJumpTick = lunTickCount + 50;
		}
		if (lunTickCount >= window.beyBladeNextJumpTick) {
			// gameState.sendEmoteNow(Emotes.Jump);
			// Disabled for now, testing
			const nextInterval = Math.floor(Math.random() * (100 - 25 + 1)) + 25;
			window.beyBladeNextJumpTick = lunTickCount + nextInterval;
		}
	} else {
		window.beyBladeNextJumpTick = 0;
	}
	lunAutoTravelTarget = null;
	lunTickCount++;
	lunSleep--;

	setText(lunHudElements.playersNearby, t("playersNearby", gameState.remotePlayers.remotePlayers.size));
	setText(lunHudElements.zoneId, t("zoneId", zoneId));
	setText(lunHudElements.expTrackerL1, expTrackerL1);
	setText(lunHudElements.expTrackerL2, expTrackerL2);

	if (lunMenuFoldingLevel < 2 && lunTickCount >= lunChannelTrackerNextTicks) {
		fetch("https://sr1.overture.io.kr/api/realtime/channels", {
			"method": "GET",
			"headers": {
				"authorization": `Bearer ${getAuthToken()}`
			},
			"mode": "cors"
		}).then(async x => {
			var resp = (await x.json());
			if (!x.ok) {
				setText(lunHudElements.channelTracker, t("channelTrackerError", x.status));
				return;
			}

			var totalPop = resp.reduce((sum, ch) => sum + (ch.population || 0), 0);
			setText(lunHudElements.channelTracker,
				resp.map(ch => t("channelTracker", ch.channel, ch.population, ch.capacity)).join("\n")
				+ "\n" + t("totalPlayersOnline", totalPop.toLocaleString()));
		});

		lunChannelTrackerNextTicks = lunTickCount + lunChannelTrackerWindow;
	}
	if (lunMenuFoldingLevel < 2 && lunTickCount >= lunCurrencyTrackerNextTicks) {
		fetch("https://sr1.overture.io.kr/api/items/inventory", {
			"method": "GET",
			"headers": {
				"authorization": `Bearer ${getAuthToken()}`
			},
			"mode": "cors"
		}).then(async x => {
			if (!x.ok) {
				setText(lunHudElements.currencyTracker, t("currencyTrackerError", x.status));
				return;
			}

			var resp = (await x.json());
			lunLastGold = resp.find(i => i.itemId === 1)?.quantity ?? 0;
			lunLastElif = resp.find(i => i.itemId === 2)?.quantity ?? 0;

			setText(lunHudElements.currencyTracker, t("currencyTracker", lunLastGold.toLocaleString(), lunLastElif.toLocaleString()));

			if (lunSessionStartGold === null) {
				lunSessionStartGold = lunLastGold;
				window._lunSessionStartTime = Date.now();
			} else {
				const diff = lunLastGold - lunSessionStartGold;
				const hours = (Date.now() - window._lunSessionStartTime) / 3600000;
				const gph = hours > 0 ? (diff / hours).toFixed(0) : 0;
				const prefix = diff >= 0 ? "+" : "";
				setText(lunHudElements.sessionGoldTracker, t("sessionGoldText", `${prefix}${diff.toLocaleString()}`, `${prefix}${Number(gph).toLocaleString()}`));
			}
		});

		lunCurrencyTrackerNextTicks = lunTickCount + lunCurrencyTrackerWindow;
	}

	if (lunPinnedQuestId && lunTickCount >= lunPinnedQuestNextQueryTick) {
		fetch(`https://sr1.overture.io.kr/api/quests?period=${lunPinnedQuestPeriod}`, {
			"method": "GET",
			"headers": {
				"authorization": `Bearer ${getAuthToken()}`
			},
			"mode": "cors"
		}).then(async x => {
			var resp = (await x.json());
			if (!x.ok) {
				setText(lunHudElements.pinnedQuest.content, `Failed to update quest info: ${x.status}`);
				return;
			}

			var q = resp.find(t => t.questId == lunPinnedQuestId);
			if (!q || q.isClaimed) {
				unpinQuest();
				return;
			}

			updatePinnedQuestDisplay(q);
		});

		lunPinnedQuestNextQueryTick += lunPinnedQuestInterval;
	}

	gameState.remotePlayers.remotePlayers.forEach(t => {
		const sprite = findNametagSprite(t.container);
		if (sprite) sprite.visible = !lunNametagsHidden;
	});

	if (gameState && gameState.myStat) {
		const currentLevel = gameState.myStat.level;
		const currentName = gameState.myStat.name || document.querySelector('.sr-player-card__name')?.innerText?.trim() || "";
		if (window._lunLastLevel !== currentLevel || window._lunLastName !== currentName) {
			window._lunLastLevel = currentLevel;
			window._lunLastName = currentName;
			updateDynamicStyles();
			if (typeof updateHudBgDropdown === "function") updateHudBgDropdown();
		}
	}

	

	if (lunWalkToPortal != -1 && zoneId) {
		const currentIndex = ZoneSequences.indexOf(zoneId - 0);
		const targetIndex = ZoneSequences.indexOf(lunWalkToPortal - 0);

		if (currentIndex == -1 || targetIndex == -1) {
			chatLog(t("noPathMsg", zoneId, currentIndex, lunWalkToPortal, targetIndex));
			resetWalkToPortal();
			return;
		}

		const sg = Math.sign(targetIndex - currentIndex);

		if (sg == 0) {
			resetWalkToPortal();
			chatLog(t("arrivedMsg"));
			return;
		} else {
			const targetZone = ZoneSequences[currentIndex + sg];

			const portals = Portals[zoneId];
			if (!portals) {
				resetWalkToPortal();
				chatLog(t("noPortalsMsg"));
				return;
			}

			const targetPortal = portals[targetZone];
			if (!targetPortal) {
				resetWalkToPortal();
				chatLog(t("missingPortalMsg"));
				return;
			}

			// might look a bit jerky without `while` on a zone with multiple wps
			const wps = Waypoints[zoneId];
			if (wps) {
				const wp = wps.find(t => !t.crossed);
				if (wp) {
					if (distanceToVector(wp) > 2) {
						lunAutoTravelTarget = wp;
						return;
					} else {
						wp.crossed = true;
					}
				}
			}

			lunAutoTravelTarget = targetPortal.pos;


			const dvk = distanceToVector(lunAutoTravelTarget);
			if (dvk < 2.9) {
				if (lunSleep < 0) {
					gameState.tryUsePortal()
					lunSleep = sec(0.5);
				}

				if (dvk <= 1.5) // humanize
					lunAutoTravelTarget = null;
			}
		}
	}
}

var hkCombatAssistUpdate = gameState.combatAssist.update.bind(gameState.combatAssist);
gameState.combatAssist.update = (e) => {
	if (lunAutoTravelTarget) {
		const pp = getPlayerPos();

		return {
			moveDir: normalizeVector(
				lunAutoTravelTarget.x - pp.x,
				lunAutoTravelTarget.z - pp.z
			),
			castSkillId: null
		};
	}

	let baseMove = hkCombatAssistUpdate(e);
	
	if (lunDroneModeActive) {
		let moveVector = null;
		if (gamepadMoveVector) {
			moveVector = gamepadMoveVector;
		} else if (baseMove && baseMove.moveDir && (baseMove.moveDir.x !== 0 || baseMove.moveDir.z !== 0)) {
			moveVector = baseMove.moveDir;
		}
		
		if (moveVector && window.spkmodDroneTarget) {
			const speed = 0.5; // adjust drone speed as needed
			window.spkmodDroneTarget.position.x += moveVector.x * speed;
			window.spkmodDroneTarget.position.z += moveVector.z * speed;
		}
		
		return { moveDir: { x: 0, z: 0 }, castSkillId: null };
	}
	
	if (gamepadMoveVector) {
		return {
			moveDir: gamepadMoveVector,
			castSkillId: null
		};
	}

	if (window.RitualActive && ritualCenter) {
		const pp = getPlayerPos();
		const dx = pp.x - ritualCenter.x;
		const dz = pp.z - ritualCenter.z;
		let currentAngle = Math.atan2(dx, dz);

		// Advance angle along circumference smoothly
		currentAngle += 0.045;

		const targetX = ritualCenter.x + Math.sin(currentAngle) * RITUAL_RADIUS;
		const targetZ = ritualCenter.z + Math.cos(currentAngle) * RITUAL_RADIUS;

		// Rhythmic synchronized ritual emotes (jumps and heart blossoms)
		ritualEmoteTick++;
		if (ritualEmoteTick % 30 === 0) {
			if (ritualEmoteTick % 60 === 0) {
				gameState.sendEmoteNow(Emotes.Jump);
			} else {
				triggerHearts();
			}
		}

		return {
			moveDir: normalizeVector(targetX - pp.x, targetZ - pp.z),
			castSkillId: null
		};
	}

	if (lunFollowTargetName && gameState.remotePlayers && gameState.remotePlayers.remotePlayers) {
		const targetPlayer = Array.from(gameState.remotePlayers.remotePlayers.values()).find(t => t.info && t.info.name === lunFollowTargetName);
		if (targetPlayer && targetPlayer.container) {
			const pp = getPlayerPos();
			const tp = targetPlayer.container.position;
			const dist = Math.hypot(tp.x - pp.x, tp.z - pp.z);
			if (dist > 2.2) {
				return {
					moveDir: normalizeVector(tp.x - pp.x, tp.z - pp.z),
					castSkillId: null
				};
			}
		} else {
			followPlayer(null);
		}
	}

	return baseMove;
}

var hkComputeCameraTargetPosition = gameState.cameraController.computeCameraTargetPosition.bind(gameState.cameraController);
gameState.cameraController.computeCameraTargetPosition = (pos) => {
	if (lunCameraLocked) return undefined;
	const targetPos = hkComputeCameraTargetPosition(pos);
	if (lunFirstPersonActive && targetPos) {
		// Elevate the pivot point to eye level so zoom can be 0 without being in the floor
		targetPos.y = (pos.y || 0) + 1.25; 
	}
	return targetPos;
	if (!lunCameraLocked)
		return hkComputeCameraTargetPosition(pos);
}

var hkCameraControllerGetObstacles = gameState.cameraController.getObstacles.bind(gameState.cameraController);
gameState.cameraController.getObstacles = () => lunViewClip ? [] : hkCameraControllerGetObstacles()

var hkTrySendChat = gameState.trySendChat.bind(gameState);
gameState.trySendChat = (msg) => {
	if (msg.startsWith("!")) {
		const cmd = msg.substring(1).split(" ");
		switch (cmd[0]) {
			case "watch":
				watchPlayer(cmd[1]);
				break;
			case "follow":
				followPlayer(cmd[1]);
				break;
			case "players":
			case "who":
				showPlayersRadar();
				break;
			case "dance":
				gameState.sendEmoteNow(Emotes.Dance);
				break;
			case "hearts":
			case "pat":
				triggerPetSequence();
				break;
			case "joayo":
			case "chowayo":
				gameState.sendEmoteNow(Emotes.PumpkinJoayo);
				break;
			case "zoom":
				if (!cmd[1]) {
					chatLog(t("zoomUsage1Msg"));
					chatLog(t("zoomUsage2Msg"));
					return;
				}

				chatLog(t("zoomSetMsg", gameState.cameraController.cameraZoomDistance = Number.parseInt(cmd[1], 10) || 12));
				break;
			case "fppitch":
				const newPitch = parseFloat(cmd[1]);
				if (!isNaN(newPitch)) {
					lunFirstPersonPitch = newPitch;
					if (window.localStorage) localStorage.setItem("spkmod-fp-pitch", lunFirstPersonPitch);
					chatLog(`[SpeakiMod+] 1st Person Pitch set to ${lunFirstPersonPitch}`);
				} else {
					chatLog(`[SpeakiMod+] 1st Person Pitch is currently ${lunFirstPersonPitch}. Usage: !fppitch 0.45`);
				}
				break;
			default:
				chatLog(t("unknownCmdMsg", cmd[0]));
				chatLog(t("availableCmdsMsg"));
				break;
		}
		return;
	}

	return hkTrySendChat(msg);
}

window.filterName = filterName;
window.lunBadWords = lunBadWords;

var hkChatBoxAppend = gameState.chatBox.append.bind(gameState.chatBox);
gameState.chatBox.append = (id, name, msg) => {
	let filteredName = filterName(name);
	const filteredMsg = filterName(msg);

	const myName = gameState.myStat?.name || document.querySelector('.sr-player-card__name')?.innerText?.trim() || "";
	if (lunMentionAlertEnabled && myName && filteredMsg && filteredMsg.toLowerCase().includes(myName.toLowerCase()) && id !== -1337 && id !== -1338) {
		chatLog(t("mentionAlertMsg", filteredName, filteredMsg));
	}

	if (filteredMsg && filteredMsg.trim()) {
		observeNextChatNode(filteredMsg, (bodyText, rowNode) => {
			if (lunGmChatHighlightEnabled && name && name.trim().toUpperCase() === "GMDT") {
				bodyText.classList.add("spkmod-gmdt-line");
			}
			if (id !== -1337 && id !== -1338) {
				bodyText.classList.add("spkmod-clickable-line");
				bodyText.title = t("clickToTranslateTooltip");
				bodyText.addEventListener("click", () => forceTranslateMessage(name, filteredMsg));
				
				const senderEl = rowNode.classList?.contains("sr-chatbox__sender") ? rowNode : rowNode.querySelector?.(".sr-chatbox__sender");
				if (senderEl) {
					let currentText = senderEl.innerText;
					
					// Apply Timestamp
					if (lunChatTimestampsEnabled) {
						const d = new Date();
						const ts = `[${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}] `;
						currentText = ts + currentText;
					}

					senderEl.innerText = currentText;
				}
			}
		});
	}

	const result = hkChatBoxAppend(id, filteredName, filteredMsg);
	maybeTranslateChatMessage(id, name, filteredMsg); // pass original name for translate cache
	return result;
};

function appendColoredChatLine(id, name, text) {
	observeNextChatNode(text, (bodyText) => bodyText.classList.add("spkmod-translated-line"));
	hkChatBoxAppend(id, name, text);
}

const lunTranslateSourceOptions = ["en", "ja", "ko", "zh-CN", "es", "fr", "de", "pt", "ru"];

function showTranslateSourcePicker(guess, onPick) {
	const existing = document.getElementById("spkmod-translate-picker");
	if (existing) existing.remove();

	const picker = buildElement("div", {
		id: "spkmod-translate-picker",
		style: `
			position: fixed; z-index: 2147483647;
			left: 50%; top: 50%; transform: translate(-50%, -50%);
			background: rgba(20,20,20,0.95); border: 1.5px solid #fff;
			border-radius: 8px; padding: 10px 14px; display: flex;
			flex-direction: column; gap: 8px; min-width: 200px;
		`
	}, [
		buildElement("span", {
			innerText: t("clickToTranslatePrompt"),
			style: "color: #fff; font-size: 11px; font-weight: bold;"
		}),
		buildElement("div", { style: "display: flex; flex-wrap: wrap; gap: 6px;" },
			lunTranslateSourceOptions.map(code => buildElement("button", {
				innerText: code,
				className: "spkmod-panel-btn-small",
				style: code === guess ? "outline: 2px solid #ffd54a;" : "",
				onclick: () => {
					picker.remove();
					onPick(code);
				}
			}))
		),
		buildElement("span", {
			innerText: "✕",
			style: "position: absolute; top: 4px; right: 8px; cursor: pointer; color: #aaa; font-size: 11px;",
			onclick: () => picker.remove()
		})
	]);

	document.body.appendChild(picker);
}

function forceTranslateMessage(name, msg) {
	const guess = guessSourceLang(msg);
	showTranslateSourcePicker(guess, source => {
		translateChatText(msg, source, lunTranslateTarget).then(translated => {
			if (!translated) {
				chatLog(t("translateFailedMsg"));
				return;
			}
			appendColoredChatLine(-1338, `↳ ${name}`, translated);
		});
	});
}

if (gameState.remotePlayers && gameState.remotePlayers.remotePlayers && typeof gameState.remotePlayers.remotePlayers.set === "function") {
	var hkRemotePlayersSet = gameState.remotePlayers.remotePlayers.set.bind(gameState.remotePlayers.remotePlayers);
	gameState.remotePlayers.remotePlayers.set = function (key, value) {
		if (value && value.info && typeof value.info.name === "string") {
			value.info.name = filterName(value.info.name);
		}
		return hkRemotePlayersSet(key, value);
	};

	gameState.remotePlayers.remotePlayers.forEach(v => {
		if (v && v.info && typeof v.info.name === "string") {
			v.info.name = filterName(v.info.name);
		}
	});
} else {
	console.warn("[SpeakiMod+] Could not hook remotePlayers.set — nametag filtering will not work. Please report this.");
}

setInterval(tick, 50);

function makeDraggable(element, handle) {
	let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

	if (handle) {
		handle.onmousedown = dragMouseDown;
	}

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		pos3 = e.clientX;
		pos4 = e.clientY;

		document.onmouseup = closeDragElement;
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();

		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;

		element.style.top = (element.offsetTop - pos2) + "px";
		element.style.left = (element.offsetLeft - pos1) + "px";
	}

	function closeDragElement() {
		document.onmouseup = null;
		document.onmousemove = null;

		if (window.localStorage) {
			localStorage.setItem("spkmod-window-pos", JSON.stringify({
				top: element.style.top,
				left: element.style.left
			}));
		}
	}
}

const hudWindow = document.getElementById("spkmod-hud");
const dragHandle = document.getElementById("spkmod-drag-btn");

if (hudWindow && dragHandle) {
	if (window.localStorage) {
		const savedPos = localStorage.getItem("spkmod-window-pos");
		if (savedPos) {
			try {
				const parsedPos = JSON.parse(savedPos);
				hudWindow.style.top = parsedPos.top;
				hudWindow.style.left = parsedPos.left;
			} catch (err) {
				console.warn("[SpeakiMod+] Failed to load saved window position.");
			}
		}
	}

	makeDraggable(hudWindow, dragHandle);
}

// --- FPS and Ping Tracker ---
let lunLastFrameTime = performance.now();
let lunFrameCount = 0;
let lunCurrentFps = 0;
let lunCurrentPing = "--";

function fpsLoop() {
	if (lunFpsPingEnabled) {
		const now = performance.now();
		lunFrameCount++;
		if (now - lunLastFrameTime >= 1000) {
			lunCurrentFps = lunFrameCount;
			lunFrameCount = 0;
			lunLastFrameTime = now;
			if (lunHudElements.fpsPingTracker) {
				setText(lunHudElements.fpsPingTracker, t("fpsPingText", lunCurrentFps, lunCurrentPing));
			}
		}
	}
	requestAnimationFrame(fpsLoop);
}
requestAnimationFrame(fpsLoop);

// Hook fetch to estimate API latency for the Ping counter
const originalFetch = window.fetch;
window.fetch = async function(...args) {
	const start = performance.now();
	try {
		const response = await originalFetch.apply(this, args);
		if (args[0] && typeof args[0] === "string" && args[0].includes("api/")) {
			lunCurrentPing = Math.round(performance.now() - start);
			if (lunFpsPingEnabled && lunHudElements.fpsPingTracker) {
				setText(lunHudElements.fpsPingTracker, t("fpsPingText", lunCurrentFps, lunCurrentPing));
			}
		}
		return response;
	} catch (e) {
		throw e;
	}
};
