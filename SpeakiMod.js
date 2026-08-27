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
	console.warn("[SpeakiMod] AuthToken could not be retrieved yet. Socket connection might not be initialized.");
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

function setText(elem, text) {
	if (elem && elem.innerText !== text) {
		elem.innerText = text;
	}
}

const spkmodTranslations = {
	en: {
		langName: "English",
		header: "SpeakiMod+ v1.0.2",
		langLabel: "Language",
		playersNearby: "Players nearby: {0}",
		zoneId: "Zone ID: {0}",
		expPerMinute: "{0} EXP/min ({1}s)",
		zeroExp: "0 EXP/min",
		nextLevel: "Next level: ~{0} min",
		nextLevelNA: "Next level: N/A",
		channelTracker: "Channel {0}: {1}/{2}",
		channelTrackerError: "Channel tracker: Error {0}",
		footerMsg: "Download URL on github.com\nDJTOMATO/SpeakiRPG\n\nThis mod is not affiliated with\nSpeakiRPG or Overture.io.kr",
		dance: "Dance",
		chowayo: "Chowayo",
		shakeOn: "Shake: ON",
		shakeOff: "Shake: OFF",
		moonwalkOn: "Moonwalk: ON",
		moonwalkOff: "Moonwalk: OFF",
		beybladeOn: "BeyBlade: ON (x{0})",
		beybladeOff: "BeyBlade: OFF (x{0})",
		speedLabel: "Speed",
		turnToCamera: "Turn to Camera",
		resetCamera: "Reset Camera",
		lockCamera: "Lock Camera",
		unlockCamera: "Unlock Camera",
		hideNametags: "Hide Nametags",
		showNametags: "Show Nametags",
		viewClipOff: "ViewClip OFF",
		viewClipOn: "ViewClip ON",
		goTo: "Go to",
		stopWalking: "Stop Walking",
		watchBtn: "[SM] Watch",
		pinQuestBtn: "Pin Quest",
		pinnedQuestHeader: "Pinned Quest",
		pinnedQuestDefault: "Pin a quest to be displayed here until completion.",
		shakeActivatedMsg: "Shake mode activated!",
		shakeDeactivatedMsg: "Shake mode deactivated.",
		moonwalkActivatedMsg: "Moonwalk mode activated!",
		moonwalkDeactivatedMsg: "Moonwalk mode deactivated.",
		beybladeActivatedMsg: "BeyBlade activated at x{0}!",
		beybladeDeactivatedMsg: "BeyBlade deactivated.",
		walkingToMsg: "Walking to {0} ({1}).",
		stoppedWalkingMsg: "Stopped autowalking.",
		watchFollowingMsg: "The camera will be following {0} now.",
		watchFollowingSelfMsg: "The camera will be following you now.",
		watchNotFoundMsg: "Couldn't find the target player. The camera will be following you now.",
		diedMsg: "Stopped autowalking because you died (lol)",
		noPathMsg: "Stopped autowalking because there doesn't seem to be a way to get to the specified zone (z {0} -> {1}, lw {2} -> {3}).",
		arrivedMsg: "You've arrived!",
		noPortalsMsg: "Stopped autowalking because the current zone has no portals registered.",
		missingPortalMsg: "Stopped autowalking because it seems there is a portal missing.",
		zoomUsage1Msg: "Usage: !zoom [number]",
		zoomUsage2Msg: "Legitimate values range from 3 to 12. Higher value = farther camera.",
		zoomSetMsg: "Set camera zoom to {0}!",
		unknownCmdMsg: "Unknown command: {0}",
		availableCmdsMsg: "Available commands: watch, zoom"
	},
	ja: {
		langName: "日本語",
		header: "SpeakiMod+ v1.0.2",
		langLabel: "言語",
		playersNearby: "近くのｽﾋﾟｷ数: {0}",
		zoneId: "エリアID: {0}",
		expPerMinute: "{0} EXP/分 ({1}秒)",
		zeroExp: "0 EXP/分",
		nextLevel: "次のレベルまで: 約{0}分",
		nextLevelNA: "次のレベル: N/A",
		channelTracker: "チャンネル {0}: {1}/{2}",
		channelTrackerError: "チャンネル情報取得エラー: {0}",
		footerMsg: "github.com/DJTOMATO/SpeakiRPG\n\n和訳担当:あのリスティ【리스티】が\n\nこのMODはSpeakiRPGまたは\nOverture.io.krとは一切関係ありません。",
		dance: "どこでもダンス",
		chowayo: "お砂あそび (SpeakUpﾁｮﾜﾖ!",
		shakeOn: "ふりふり: ON",
		shakeOff: "ふりふり: OFF",
		moonwalkOn: "ムーンウォーク: ON",
		moonwalkOff: "ムーンウォーク: OFF",
		beybladeOn: "四方を見回す: ON (x{0})",
		beybladeOff: "四方を見回す: OFF (x{0})",
		speedLabel: "速度",
		turnToCamera: "ｽﾋﾟｷを振り向かせる",
		resetCamera: "カメラをリセット",
		lockCamera: "カメラを固定",
		unlockCamera: "カメラの固定を解除",
		hideNametags: "他ｽﾋﾟｷの名前を非表示",
		showNametags: "他ｽﾋﾟｷの名前を表示",
		viewClipOff: "カメラの当たり判定 ON",
		viewClipOn: "カメラの当たり判定 OFF",
		goTo: "移動する",
		stopWalking: "移動中止",
		watchBtn: "[SM] 視点固定",
		pinQuestBtn: "クエストをピン止め",
		pinnedQuestHeader: "ピン止めしたクエスト",
		pinnedQuestDefault: "クエストをピン止めするとここに表示されます。",
		shakeActivatedMsg: "ｽﾋﾟｷが「ふりふり」を始めました！",
		shakeDeactivatedMsg: "ｽﾋﾟｷは「ふりふり」を終えました。",
		moonwalkActivatedMsg: "ｽﾋﾟｷが「ムーンウォーク」を始めました！",
		moonwalkDeactivatedMsg: "ｽﾋﾟｷが「ムーンウォーク」を終えました。",
		beybladeActivatedMsg: "ｽﾋﾟｷが見回し始めました！",
		beybladeDeactivatedMsg: "ｽﾋﾟｷは見回し終えました。",
		walkingToMsg: "ｽﾋﾟｷが {0} ({1}) へ移動中です！",
		stoppedWalkingMsg: "ｽﾋﾟｷが移動を中止しました。",
		watchFollowingMsg: "カメラが {0} を追従します。",
		watchFollowingSelfMsg: "カメラが自ｽﾋﾟｷを追従します。",
		watchNotFoundMsg: "対象のｽﾋﾟｷが見つかりませんでした。カメラは自ｽﾋﾟｷを追従します。",
		diedMsg: "倒されてしまったため自動移動を中止しました (ｳﾜｱｱｱｱ!)",
		noPathMsg: "指定したエリアへの経路が見つからないため自動移動が中止しました (z {0} -> {1}, lw {2} -> {3})。",
		arrivedMsg: "到着しました!",
		noPortalsMsg: "現在のエリアにポータル情報が登録されていないため自動移動を中止しました。",
		missingPortalMsg: "ポータル情報が不足しているため自動移動を中止しました。",
		zoomUsage1Msg: "使い方: !zoom [数値]",
		zoomUsage2Msg: "有効な値は3~12です。値が大きいほどカメラが遠くなります。",
		zoomSetMsg: "カメラズームを {0} に設定しました!",
		unknownCmdMsg: "不明なコマンド: {0}",
		availableCmdsMsg: "使用可能なコマンド: !watch, !zoom"
	},
	ko: {
		langName: "한국어",
		header: "SpeakiMod+ v1.0.2",
		langLabel: "언어",
		playersNearby: "근처 플레이어: {0}",
		zoneId: "존 ID: {0}",
		expPerMinute: "{0} EXP/분 ({1}초)",
		zeroExp: "0 EXP/분",
		nextLevel: "다음 레벨까지: 약 {0}분",
		nextLevelNA: "다음 레벨: N/A",
		channelTracker: "채널 {0}: {1}/{2}",
		channelTrackerError: "채널 정보 오류: {0}",
		footerMsg: "github.com/DJTOMATO/SpeakiRPG\n\n이 모드는 SpeakiRPG 또는\n\n Overture.io.kr과 제휴 관계가 없습니다.",
		dance: "댄스",
		chowayo: "초와요",
		shakeOn: "쉐이크: ON",
		shakeOff: "쉐이크: OFF",
		moonwalkOn: "문워크: ON",
		moonwalkOff: "문워크: OFF",
		beybladeOn: "베이블레이드: ON (x{0})",
		beybladeOff: "베이블레이드: OFF (x{0})",
		speedLabel: "속도",
		turnToCamera: "카메라 방향으로 전환",
		resetCamera: "카메라 재설정",
		lockCamera: "카메라 잠금",
		unlockCamera: "카메라 잠금 해제",
		hideNametags: "이름표 숨기기",
		showNametags: "이름표 표시",
		viewClipOff: "뷰클립 OFF",
		viewClipOn: "뷰클립 ON",
		goTo: "이동",
		stopWalking: "이동 중지",
		watchBtn: "[SM] 시점 고정",
		pinQuestBtn: "퀘스트 고정",
		pinnedQuestHeader: "고정된 퀘스트",
		pinnedQuestDefault: "퀘스트를 고정하면 완료될 때까지 여기에 표시됩니다.",
		shakeActivatedMsg: "쉐이크 모드가 활성화되었습니다!",
		shakeDeactivatedMsg: "쉐이크 모드가 비활성화되었습니다.",
		moonwalkActivatedMsg: "문워크 모드가 활성화되었습니다!",
		moonwalkDeactivatedMsg: "문워크 모드가 비활성화되었습니다.",
		beybladeActivatedMsg: "베이블레이드가 x{0} 속도로 활성화되었습니다!",
		beybladeDeactivatedMsg: "베이블레이드가 비활성화되었습니다.",
		walkingToMsg: "{0} ({1})(으)로 이동 중입니다.",
		stoppedWalkingMsg: "자동 이동을 중지했습니다.",
		watchFollowingMsg: "카메라가 이제 {0}님을 따라갑니다.",
		watchFollowingSelfMsg: "카메라가 이제 나를 따라갑니다.",
		watchNotFoundMsg: "대상 플레이어를 찾을 수 없습니다. 카메라가 나를 따라갑니다.",
		diedMsg: "사망하여 자동 이동을 중지했습니다 (ㅋㅋ)",
		noPathMsg: "지정한 존으로 가는 경로를 찾을 수 없어 자동 이동을 중지했습니다 (z {0} -> {1}, lw {2} -> {3}).",
		arrivedMsg: "도착했습니다!",
		noPortalsMsg: "현재 존에 등록된 포털이 없어 자동 이동을 중지했습니다.",
		missingPortalMsg: "포털 정보가 없어 자동 이동을 중지했습니다.",
		zoomUsage1Msg: "사용법: !zoom [숫자]",
		zoomUsage2Msg: "유효한 값은 3~12입니다. 값이 클수록 카메라가 멀어집니다.",
		zoomSetMsg: "카메라 줌을 {0}(으)로 설정했습니다!",
		unknownCmdMsg: "알 수 없는 명령어: {0}",
		availableCmdsMsg: "사용 가능한 명령어: watch, zoom"
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
	}
};
var lunPanelElements = {
	targetZone: null,
	resetCameraBtn: null,
	walkToPortalBtn: null,
	headerBtn: null,
	danceBtn: null,
	chowayoBtn: null,
	speedLabel: null,
	turnToCameraBtn: null,
	watchBtn: null,
	pinnedQuestHeader: null,
	langSelect: null
};
var lunMenuFoldingLevel = 0;

var lunTickCount = 0;
var lunSleep = 0;
const lunTPS = 20;
const lunExpTrackerWindow = 60000 / lunTPS;
var lunExpTrackerNextTicks = 0;
var lunExpTrackerStartExp = 0;
var lunExpTrackerSpeed = 0;

var lunChannelTrackerWindow = 10000 / lunTPS;
var lunChannelTrackerNextTicks = 0;

var lunWalkToPortal = -1;
var lunAutoTravelTarget = null;
var lunCameraLocked = false;
var lunNametagsHidden = false;
var lunViewClip = false;

const spkmodBorderWidth = "3px";

document.head.appendChild(buildElement(
	"style",
	{
		id: "spkmod-stylesheet",
		innerHTML: `
		#spkmod-hud {
			display: flex;
			flex-direction: row;
			gap: 4px;
			position: absolute;
			top: 225px;
			left: 5px;
			z-index: 500000;
			color: #EEE;
			user-select: none;
		}
		#spkmod-footer {
			font-size: 9pt;
			border-top: 1px solid #DDD;
			margin-top: 4px;
			padding-top: 4px;
			white-space: pre-line;
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
		}
		#spkmod-header, #spkmod-texpb, #spkmod-pq-header {
			border-bottom: 1px solid #DDD;
			margin-bottom: 4px;
		}
		.spkmod-panel-btn {
			color: #EEE;
			background: #000C;
			border: ${spkmodBorderWidth} solid #DDD;
			border-radius: 8px;
			padding: 5px;
			font-size: 11pt;
			cursor: pointer;
			outline: none;
			flex: 1;
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
		}
		
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
		/* honest to god forgot CSS is stupid like that */
		.hidden, #spkmod-pq.hidden {
			display: none;
		}
		#spkmod-pq-pbar {
			margin-top: 2px;
			background: #0F0;
			height: 2px;
		}
		`

	}
));

document.body.appendChild(
	buildElement("div", {
		id: "spkmod-hud"
	}, [
		buildElement("div", {
			id: "spkmod-main"
		}, [
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
			}),
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
			lunHudElements.footerMsg = buildElement("span", {
				id: "spkmod-footer",
				innerText: t("footerMsg")
			})
		]),
		buildElement("div", {
			id: "spkmod-panel"
		}, [
			lunPanelElements.danceBtn = buildElement("button", {
				className: "spkmod-panel-btn",
				innerText: t("dance"),
				value: "",
				onclick: _ => {
					window.wasDancing = true;
					gameState.sendEmoteNow(Emotes.Dance);
				}
			}),
			lunPanelElements.chowayoBtn = buildElement("button", {
				className: "spkmod-panel-btn",
				innerText: t("chowayo"),
				value: "",
				onclick: _ => {
					gameState.sendEmoteNow(Emotes.PumpkinJoayo);
				}
			}),
			buildElement("div", { className: "spkmod-panel-cat" }, [
				buildElement("button", {
					id: "spkmod-shake-main-btn",
					className: "spkmod-panel-btn",
					style: "width: 100%;",
					innerText: window.ShakeActive ? t("shakeOn") : t("shakeOff"),
					value: "",
					onclick: e => {
						window.ShakeActive = !window.ShakeActive;

						if (window.ShakeActive) {
							window.BeyBladeActive = false;
							window.MoonwalkActive = false;
							if (typeof updateBeyBladeButtonText === "function") updateBeyBladeButtonText();

							setText(e.target, t("shakeOn"));
							chatLog(t("shakeActivatedMsg"));
						} else {
							setText(e.target, t("shakeOff"));

							if (gameState.playerContainer && gameState.cameraController) {
								gameState.playerContainer.rotation.y = gameState.cameraController.cameraYaw;
								gameState.moveSendAccumulator = 1;
							}
							chatLog(t("shakeDeactivatedMsg"));
						}
					}
				})
			]),

			buildElement("div", { className: "spkmod-panel-cat" }, [
				buildElement("button", {
					id: "spkmod-moonwalk-main-btn",
					className: "spkmod-panel-btn",
					style: "width: 100%;",
					innerText: window.MoonwalkActive ? t("moonwalkOn") : t("moonwalkOff"),
					value: "",
					onclick: e => {
						window.MoonwalkActive = !window.MoonwalkActive;

						if (window.MoonwalkActive) {
							window.BeyBladeActive = false;
							window.ShakeActive = false;
							if (typeof updateBeyBladeButtonText === "function") updateBeyBladeButtonText();

							setText(e.target, t("moonwalkOn"));
							chatLog(t("moonwalkActivatedMsg"));
						} else {
							setText(e.target, t("moonwalkOff"));

							if (gameState.playerContainer && gameState.cameraController) {
								gameState.playerContainer.rotation.y = gameState.cameraController.cameraYaw;
								gameState.moveSendAccumulator = 1;
							}
							chatLog(t("moonwalkDeactivatedMsg"));
						}
					}
				})
			]),


			buildElement("div", { className: "spkmod-panel-cat" }, [
				buildElement("button", {
					id: "spkmod-beyblade-main-btn",
					className: "spkmod-panel-btn",
					style: "width: 100%;",
					innerText: t(window.BeyBladeActive ? "beybladeOn" : "beybladeOff", window.BeyBladeSpeed || 1),
					value: "",
					onclick: e => {
						window.BeyBladeActive = !window.BeyBladeActive;
						updateBeyBladeButtonText();

						if (window.BeyBladeActive) {
							window.ShakeActive = false;
							window.MoonwalkActive = false;
							chatLog(t("beybladeActivatedMsg", window.BeyBladeSpeed || 1));
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

							chatLog(t("beybladeDeactivatedMsg"));
						}
					}
				})
			]),

			buildElement("div", {
				className: "spkmod-panel-cat",
				style: "display: flex; align-items: center; justify-content: space-between; width: 100%; box-sizing: border-box; background: rgba(0,0,0,0.4); border: 1.5px solid #fff; border-radius: 6px; padding: 4px 10px; height: 32px;"
			}, [
				lunPanelElements.speedLabel = buildElement("span", {
					style: "color: #fff; font-size: 11px; font-weight: bold; user-select: none;",
					innerText: t("speedLabel")
				}),
				buildElement("input", {
					type: "range",
					min: "0.1",
					max: "2",
					step: "0.1",
					value: window.BeyBladeSpeed || 1,
					style: "width: 110px; height: 3px; accent-color: #fff; cursor: pointer; margin: 0;",
					oninput: e => {
						window.BeyBladeSpeed = parseFloat(e.target.value);
						updateBeyBladeButtonText();
					}
				})
			]),
			lunPanelElements.turnToCameraBtn = buildElement("button", {
				className: "spkmod-panel-btn",
				innerText: t("turnToCamera"),
				value: "",
				onclick: _ => {
					gameState.playerContainer.rotation.y = gameState.cameraController.cameraYaw;
					gameState.moveSendAccumulator = 1;
				}
			}),

			lunPanelElements.resetCameraBtn = buildElement("button", {
				className: "spkmod-panel-btn hidden",
				innerText: t("resetCamera"),
				value: "",
				onclick: _ => {
					watchPlayer();
				}
			}),
			lunPanelElements.lockCameraBtn = buildElement("button", {
				className: "spkmod-panel-btn",
				innerText: t("lockCamera"),
				value: "",
				onclick: e => {
					lunCameraLocked = !lunCameraLocked;
					e.target.innerText = lunCameraLocked ? t("unlockCamera") : t("lockCamera");
				}
			}),
			lunPanelElements.nametagsBtn = buildElement("button", {
				className: "spkmod-panel-btn",
				innerText: t("hideNametags"),
				value: "",
				onclick: e => {
					lunNametagsHidden = !lunNametagsHidden;
					e.target.innerText = lunNametagsHidden ? t("showNametags") : t("hideNametags");
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
			}),
			buildElement("div", {
				className: "spkmod-panel-cat"
			}, [
				lunPanelElements.walkToPortalBtn = buildElement("button", {
					className: "spkmod-panel-btn",
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
					className: "spkmod-panel-combo"
				}, Object.keys(Portals).map(zoneId => buildElement("option", {
					value: zoneId - 0,
					innerText: i18n(`content.zone.${zoneId}.name`)
				})))
			]),
			buildElement("div", {
				className: "spkmod-panel-cat"
			}, [
				buildElement("span", {
					style: "color: #fff; font-size: 11px; font-weight: bold; user-select: none;",
					innerText: t("langLabel")
				}),
				lunPanelElements.langSelect = buildElement("select", {
					className: "spkmod-panel-combo",
					value: spkmodLang,
					onchange: e => {
						setLanguage(e.target.value);
					}
				}, Object.keys(spkmodTranslations).map(code => buildElement("option", {
					value: code,
					innerText: spkmodTranslations[code].langName,
					selected: code === spkmodLang
				})))
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

function updateBeyBladeButtonText() {
	const mainBtn = document.querySelector("#spkmod-beyblade-main-btn");
	if (!mainBtn) return;

	const speed = window.BeyBladeSpeed || 1;
	setText(mainBtn, t(window.BeyBladeActive ? "beybladeOn" : "beybladeOff", speed));
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

function chatLog(msg) {
	gameState.chatBox.append(-1337, "SpeakiMod", msg);
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
		lunPanelElements.watchBtn = buildElement("button", {
			className: "sr-btn sr-party-target__btn spkmod-watch-player-btn",
			innerText: t("watchBtn"),
			value: "",
			onclick: e => {
				watchPlayer(e.target.parentElement.querySelector(".sr-party-target__name").innerText);
			}
		}),
		hPartyTarget.querySelector(".sr-party-target__close")
	)
} else {
	alert("Warning: Couldn't find party target element. The Watch functionality will only be available through chat commands. Mod loaded too early?");
}

spkmodI18nRenderers.push(() => {
	setText(lunPanelElements.headerBtn, t("header"));
	setText(lunPanelElements.danceBtn, t("dance"));
	setText(lunPanelElements.chowayoBtn, t("chowayo"));
	setText(lunPanelElements.speedLabel, t("speedLabel"));
	setText(lunPanelElements.turnToCameraBtn, t("turnToCamera"));
	setText(lunPanelElements.resetCameraBtn, t("resetCamera"));
	setText(lunPanelElements.lockCameraBtn, lunCameraLocked ? t("unlockCamera") : t("lockCamera"));
	setText(lunPanelElements.nametagsBtn, lunNametagsHidden ? t("showNametags") : t("hideNametags"));
	setText(lunPanelElements.viewClipBtn, lunViewClip ? t("viewClipOn") : t("viewClipOff"));
	setText(lunPanelElements.walkToPortalBtn, lunWalkToPortal == -1 ? t("goTo") : t("stopWalking"));
	setText(lunPanelElements.watchBtn, t("watchBtn"));
	setText(lunPanelElements.pinnedQuestHeader, t("pinnedQuestHeader"));
	setText(lunHudElements.footerMsg, t("footerMsg"));
	if (!lunPinnedQuestId) setText(lunHudElements.pinnedQuest.content, t("pinnedQuestDefault"));

	const shakeBtn = document.querySelector("#spkmod-shake-main-btn");
	if (shakeBtn) setText(shakeBtn, window.ShakeActive ? t("shakeOn") : t("shakeOff"));

	const moonwalkBtn = document.querySelector("#spkmod-moonwalk-main-btn");
	if (moonwalkBtn) setText(moonwalkBtn, window.MoonwalkActive ? t("moonwalkOn") : t("moonwalkOff"));

	if (typeof updateBeyBladeButtonText === "function") updateBeyBladeButtonText();
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
		if (window.BeyBladeActive && gameState && gameState.playerContainer) {
			const delta = (currentTime - window.__beyBladeLastTime) / 1000;
			const clampedDelta = Math.min(delta, 0.1);
			const speedMultiplier = window.BeyBladeSpeed || 3;
			const baseSpeed = 15.0;

			window.beyBladeAngle += baseSpeed * speedMultiplier * clampedDelta;
			gameState.playerContainer.rotation.y = window.beyBladeAngle;

			if (Math.random() < 0.2) {
				gameState.moveSendAccumulator = 1;
			}
		}

		window.__beyBladeLastTime = currentTime;
		requestAnimationFrame(beyBladeRenderLoop);
	}

	requestAnimationFrame(beyBladeRenderLoop);
}

function tick() {
	if (gameState.isDead && lunWalkToPortal != -1) {
		resetWalkToPortal();
		chatLog(t("diedMsg"));
	}

	if (window.MoonwalkActive && gameState && gameState.playerContainer && gameState.cameraController) {
		gameState.playerContainer.rotation.y = gameState.cameraController.cameraYaw + Math.PI;
		gameState.moveSendAccumulator = 1;
	}

	window.shakeBaseAngle = window.shakeBaseAngle || 0;
	if (window.ShakeActive && gameState && gameState.playerContainer && gameState.cameraController) {

		const currentBaseYaw = gameState.cameraController.cameraYaw;
		const shakeSpeed = 80;   // Jitter frequency
		const shakeAmount = 0.05; // Jitter amplitude (radians)
		const offset = Math.sin(performance.now() * 0.001 * shakeSpeed) * shakeAmount;

		gameState.playerContainer.rotation.y = currentBaseYaw + offset;
		gameState.moveSendAccumulator = 1;
	}

	if (window.BeyBladeActive && gameState.playerContainer) {
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

	var playerExp = gameState.myStat.exp;
	var zoneId = gameState.zoneId % 10000;

	setText(lunHudElements.playersNearby, t("playersNearby", gameState.remotePlayers.remotePlayers.size));
	setText(lunHudElements.zoneId, t("zoneId", zoneId));

	if (lunExpTrackerStartExp > playerExp || lunTickCount >= lunExpTrackerNextTicks) {
		lunExpTrackerSpeed = (playerExp - lunExpTrackerStartExp) / lunExpTrackerWindow * (1000 / lunTPS);

		lunExpTrackerNextTicks = lunTickCount + lunExpTrackerWindow;
		lunExpTrackerStartExp = playerExp;
	}

	var expTrackerTimer = ((lunExpTrackerNextTicks - lunTickCount) * lunTPS / 1000).toFixed(0);
	var expTrackerL1 = t("zeroExp");
	var expTrackerL2 = t("nextLevelNA");
	if (lunExpTrackerSpeed > 0) {
		expTrackerL1 = t("expPerMinute", (lunExpTrackerSpeed * 60).toFixed(2), expTrackerTimer);
		expTrackerL2 = t("nextLevel", ((gameState.myStat.maxExp - playerExp) / lunExpTrackerSpeed / 60).toFixed(2));
	} else {
		expTrackerL1 += ` (${expTrackerTimer}s)`;
	}

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

			setText(lunHudElements.channelTracker, resp.map(ch => t("channelTracker", ch.channel, ch.population, ch.capacity)).join("\n"));
		});

		lunChannelTrackerNextTicks = lunTickCount + lunChannelTrackerWindow;
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

	gameState.remotePlayers.remotePlayers.forEach(t => t.container.children[0].children[1].visible = !lunNametagsHidden);

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

	return hkCombatAssistUpdate(e);
}

var hkComputeCameraTargetPosition = gameState.cameraController.computeCameraTargetPosition.bind(gameState.cameraController);
gameState.cameraController.computeCameraTargetPosition = (pos) => {
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
			case "zoom":
				if (!cmd[1]) {
					chatLog(t("zoomUsage1Msg"));
					chatLog(t("zoomUsage2Msg"));
					return;
				}

				chatLog(t("zoomSetMsg", gameState.cameraController.cameraZoomDistance = Number.parseInt(cmd[1], 10) || 12));
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

setInterval(tick, 50);
