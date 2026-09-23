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

const isElectronEnv = typeof window.electronAPI !== "undefined" || (typeof navigator !== "undefined" && /electron/i.test(navigator.userAgent || ""));
if (!isElectronEnv) {
	if (document.body) {
		const acTranslations = {
			en: { title: "⚠️ Unauthorized Client Detected", body: "SpeakiMod+ is designed exclusively for the SpeakiRPG Client.<br><br>To prevent cheating and server abuse, running this mod via third-party browser extensions (like Tampermonkey) is strictly prohibited.", btn: "Download SpeakiRPG Client" },
			ko: { title: "⚠️ 비정상적인 클라이언트 감지됨", body: "SpeakiMod+는 SpeakiRPG 클라이언트 전용입니다.<br><br>부정행위 및 서버 남용을 방지하기 위해 타사 브라우저 확장 프로그램(예: Tampermonkey)을 통해 이 모드를 실행하는 것은 엄격히 금지됩니다.", btn: "SpeakiRPG 클라이언트 다운로드" },
			ja: { title: "⚠️ 不正なクライアントを検出しました", body: "SpeakiMod+はSpeakiRPGクライアント専用です。<br><br>チート行為やサーバーの乱用を防ぐため、サードパーティのブラウザ拡張機能(Tampermonkeyなど)を使用してこのModを実行することは固く禁じられています。", btn: "SpeakiRPGクライアントをダウンロード" },
			zh: { title: "⚠️ 偵測到未授權的客戶端", body: "SpeakiMod+ 僅限於 SpeakiRPG 客戶端使用。<br><br>為防止作弊與伺服器濫用，嚴禁透過第三方瀏覽器擴充功能（如 Tampermonkey）執行此模組。", btn: "下載 SpeakiRPG 客戶端" }
		};

		window._antiCheatSetLang = function(lang) {
			const t = acTranslations[lang];
			document.getElementById('ac-title').innerHTML = t.title;
			document.getElementById('ac-body').innerHTML = t.body;
			document.getElementById('ac-btn').innerText = t.btn;
		};

		document.body.innerHTML = `
			<div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.98); z-index: 2147483647; display: flex; flex-direction: column; justify-content: center; align-items: center; color: white; font-family: sans-serif; text-align: center; padding: 20px;">
				<div style="display: flex; gap: 10px; margin-bottom: 30px;">
					<button onclick="window._antiCheatSetLang('en')" style="padding: 8px 12px; background: #334155; color: white; border: 1px solid #475569; border-radius: 6px; cursor: pointer; font-weight: bold;">English</button>
					<button onclick="window._antiCheatSetLang('ko')" style="padding: 8px 12px; background: #334155; color: white; border: 1px solid #475569; border-radius: 6px; cursor: pointer; font-weight: bold;">한국어</button>
					<button onclick="window._antiCheatSetLang('ja')" style="padding: 8px 12px; background: #334155; color: white; border: 1px solid #475569; border-radius: 6px; cursor: pointer; font-weight: bold;">日本語</button>
					<button onclick="window._antiCheatSetLang('zh')" style="padding: 8px 12px; background: #334155; color: white; border: 1px solid #475569; border-radius: 6px; cursor: pointer; font-weight: bold;">中文</button>
				</div>
				<h1 id="ac-title" style="color: #ef4444; margin-bottom: 20px; font-size: 28px;">${acTranslations.en.title}</h1>
				<img src="https://i.imgur.com/4Qe6qiR.png" alt="Caught!" style="width: 50%; max-width: 350px; margin-bottom: 25px; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.5);">
				<p id="ac-body" style="font-size: 18px; max-width: 600px; line-height: 1.6; margin-bottom: 30px; color: #cbd5e1;">${acTranslations.en.body}</p>
				
				<a id="ac-btn" href="https://github.com/DJTOMATO/SpeakiRPG/releases" style="background: #3b82f6; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 16px; margin-bottom: 25px; transition: background 0.2s;">${acTranslations.en.btn}</a>
				
				<div style="background: #0f172a; padding: 12px 16px; border-radius: 8px; border: 1px solid #334155; display: flex; align-items: center; gap: 12px;">
					<input type="text" readonly value="https://github.com/DJTOMATO/SpeakiRPG/releases" onfocus="this.select()" style="background: transparent; color: #94a3b8; border: none; width: 320px; font-size: 15px; outline: none; user-select: all;">
					<button onclick="navigator.clipboard.writeText('https://github.com/DJTOMATO/SpeakiRPG/releases'); this.innerText='Copied!'; this.style.background='#22c55e'; setTimeout(()=> { this.innerText='Copy'; this.style.background='#475569'; }, 2000);" style="background: #475569; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 13px; transition: background 0.2s; width: 80px;">Copy</button>
				</div>
			</div>
		`;
	}
	throw new Error("SpeakiMod: Blocked unauthorized third-party extension usage.");
}

window.speakiAuthToken = window.speakiAuthToken || "";

window.gameState = window.gameState || undefined;

var lunCurrentPing = "--";
var lunCurrentFps = "--";

if (!window.__speakiFetchHooked) {
	window.__speakiFetchHooked = true;
	const origFetch = window.fetch;
	window.fetch = async function (...args) {
		const [resource, config] = args;
		const headers = config?.headers;
		if (headers) {
			let authHeader = "";
			if (typeof headers.get === "function") {
				authHeader = headers.get("Authorization") || headers.get("authorization") || "";
			} else if (typeof headers === "object") {
				authHeader = headers.Authorization || headers.authorization || headers.Bearer || "";
			}
			if (authHeader && authHeader.includes("Bearer ")) {
				window.speakiAuthToken = authHeader.replace(/^Bearer\s+/i, "").trim();
			} else if (authHeader && authHeader.includes("eyJhb")) {
				window.speakiAuthToken = authHeader.trim();
			}
		}
		return origFetch.apply(this, args);
	};
}

const usingDevToolsOrOldSpeakiInjector = !window.speakiInjectorVer;

window.speakiMod = true;

if (!window.gameState) {
	console.log("[SpeakiMod+] Loaded before gameState. Pre-login gate assistant active.");
}

if (!window.i18n) {
	window.i18n = e => e;
}

function getAuthToken() {
	if (window.speakiAuthToken) return window.speakiAuthToken;

	const socketUrl = (typeof gameState !== 'undefined' && (gameState?.socket?.socket?.url || gameState?.socket?.url)) || "";
	if (socketUrl) {
		const paramMatch = socketUrl.match(/[?&]access_token=([^&]+)/);
		if (paramMatch && paramMatch[1]) {
			try {
				const decoded = decodeURIComponent(paramMatch[1]);
				window.speakiAuthToken = decoded;
				return decoded;
			} catch (_) {
				window.speakiAuthToken = paramMatch[1];
				return paramMatch[1];
			}
		}
		const jwtMatch = socketUrl.match(/eyJhb.+?(?=&|$)/);
		if (jwtMatch) {
			try {
				const decoded = decodeURIComponent(jwtMatch[0]);
				window.speakiAuthToken = decoded;
				return decoded;
			} catch (_) {
				window.speakiAuthToken = jwtMatch[0];
				return jwtMatch[0];
			}
		}
	}
	return "";
}
const Emotes = {
	Cry: 1,
	Jump: 2,
	MinigameJoayo: 3,
	StrokeStart: 4,
	StrokeStage2: 5,
	StrokeBloom: 6,
	StrokeCancel: 7,
	Dance: 8
};

const Portals = {
	1: { 2: { portalId: 1, requiredQuestCode: null, pos: { x: 95, z: 50 } } },
	2: {
		1: { portalId: 2, requiredQuestCode: null, pos: { x: 105, z: 50 } },
		3: { portalId: 7, requiredQuestCode: null, pos: { x: 196, z: 100 } },
		101: { portalId: 19, requiredQuestCode: "MQ_BOSS_WORLDTREE", pos: { x: 150, z: 195 } },
		201: { portalId: 37, requiredQuestCode: "MQ2_CORE3", pos: { x: 150, z: 5 } }
	},
	3: {
		2: {
			portalId: 8, requiredQuestCode: null,
			pos: {
				x: 204,
				z: 100
			}
		},
		4: {
			portalId: 3, requiredQuestCode: null,
			pos: {
				x: 296,
				z: 120
			}
		}
	},
	4: {
		3: {
			portalId: 4, requiredQuestCode: null,
			pos: {
				x: 306,
				z: 120
			}
		},
		5: {
			portalId: 9, requiredQuestCode: null,
			pos: {
				x: 426,
				z: 100
			}
		}
	},
	5: {
		4: {
			portalId: 10, requiredQuestCode: null,
			pos: {
				x: 434,
				z: 100
			}
		},
		6: {
			portalId: 5, requiredQuestCode: null,
			pos: {
				x: 554,
				z: 99
			}
		}
	},
	6: {
		5: {
			portalId: 6, requiredQuestCode: null,
			pos: {
				x: 580,
				z: 100
			}
		},
		7: {
			portalId: 11, requiredQuestCode: null,
			pos: {
				x: 656,
				z: 100
			}
		}
	},
	7: {
		6: {
			portalId: 12, requiredQuestCode: null,
			pos: {
				x: 664,
				z: 100
			}
		},
		8: {
			portalId: 13, requiredQuestCode: null,
			pos: {
				x: 756,
				z: 100
			}
		}
	},
	8: {
		7: {
			portalId: 14, requiredQuestCode: null,
			pos: {
				x: 764,
				z: 100
			}
		},
		9: {
			portalId: 15, requiredQuestCode: null,
			pos: {
				x: 956,
				z: 100
			}
		}
	},
	9: {
		8: {
			portalId: 16, requiredQuestCode: null,
			pos: {
				x: 964,
				z: 100
			}
		},
		10: {
			portalId: 17, requiredQuestCode: null,
			pos: {
				x: 1136,
				z: 100
			}
		}
	},
	10: {
		9: {
			portalId: 18, requiredQuestCode: null,
			pos: {
				x: 1144,
				z: 100
			}
		}
	},
	101: {
		2: {
			portalId: 20, requiredQuestCode: null,
			pos: {
				x: 150,
				z: 205
			}
		},
		102: {
			portalId: 21, requiredQuestCode: null,
			pos: {
				x: 295,
				z: 300
			}
		}
	},
	102: {
		101: {
			portalId: 22, requiredQuestCode: null,
			pos: {
				x: 352.5,
				z: 300
			}
		},
		103: {
			portalId: 23, requiredQuestCode: null,
			pos: {
				x: 447.5,
				z: 300
			}
		}
	},
	103: {
		102: {
			portalId: 24, requiredQuestCode: null,
			pos: {
				x: 552.5,
				z: 300
			}
		},
		104: {
			portalId: 25, requiredQuestCode: null,
			pos: {
				x: 647,
				z: 250
			}
		}
	},
	104: {
		103: {
			portalId: 26, requiredQuestCode: "MQ_BOSS_WORLDTREE",
			pos: {
				x: 716.25,
				z: 250
			}
		},
		105: {
			portalId: 27, requiredQuestCode: "MQ_BOSS_WORLDTREE",
			pos: {
				x: 784,
				z: 250
			}
		}
	},
	105: {
		104: {
			portalId: 28, requiredQuestCode: null,
			pos: {
				x: 852.5,
				z: 250
			}
		},
		106: {
			portalId: 29, requiredQuestCode: null,
			pos: {
				x: 947.5,
				z: 300
			}
		}
	},
	106: {
		105: {
			portalId: 30, requiredQuestCode: null,
			pos: {
				x: 1052.5,
				z: 300
			}
		},
		107: {
			portalId: 31, requiredQuestCode: null,
			pos: {
				x: 1147.5,
				z: 300
			}
		}
	},
	107: {
		106: {
			portalId: 32, requiredQuestCode: null,
			pos: {
				x: 1252.5,
				z: 300
			}
		},
		108: {
			portalId: 33, requiredQuestCode: null,
			pos: {
				x: 1347.5,
				z: 300
			}
		}
	},
	108: {
		107: {
			portalId: 34, requiredQuestCode: null,
			pos: {
				x: 1405,
				z: 300
			}
		}
	},
	201: {
		2: {
			portalId: 38, requiredQuestCode: null,
			pos: {
				x: 180,
				z: -5
			}
		},
		202: {
			portalId: 39, requiredQuestCode: null,
			pos: {
				x: 180,
				z: -155
			}
		}
	},
	202: {
		201: {
			portalId: 40, requiredQuestCode: null,
			pos: {
				x: 345,
				z: -100
			}
		},
		203: {
			portalId: 41, requiredQuestCode: null,
			pos: {
				x: 455,
				z: -100
			}
		}
	},
	203: {
		202: {
			portalId: 42, requiredQuestCode: null,
			pos: {
				x: 525,
				z: -60
			}
		},
		204: {
			portalId: 43, requiredQuestCode: null,
			pos: {
				x: 675,
				z: -60
			}
		}
	},
	204: {
		203: {
			portalId: 44, requiredQuestCode: "MQ2_CORE3",
			pos: {
				x: 730,
				z: -50
			}
		},
		205: {
			portalId: 45, requiredQuestCode: "MQ2_CORE3",
			pos: {
				x: 770,
				z: -50
			}
		}
	},
	205: {
		204: {
			portalId: 46, requiredQuestCode: null,
			pos: {
				x: 845,
				z: -100
			}
		},
		206: {
			portalId: 47, requiredQuestCode: null,
			pos: {
				x: 955,
				z: -100
			}
		}
	},
	206: {
		205: {
			portalId: 48, requiredQuestCode: null,
			pos: {
				x: 1045,
				z: -100
			}
		},
		207: {
			portalId: 49, requiredQuestCode: null,
			pos: {
				x: 1155,
				z: -100
			}
		}
	},
	207: {
		206: {
			portalId: 50, requiredQuestCode: null,
			pos: {
				x: 1245,
				z: -100
			}
		},
		208: {
			portalId: 51, requiredQuestCode: null,
			pos: {
				x: 1355,
				z: -100
			}
		}
	},
	208: {
		207: {
			portalId: 52, requiredQuestCode: null,
			pos: {
				x: 1445,
				z: -100
			}
		},
		209: {
			portalId: 53, requiredQuestCode: null,
			pos: {
				x: 1555,
				z: -100
			}
		}
	},
	209: {
		208: {
			portalId: 54, requiredQuestCode: null,
			pos: {
				x: 1625,
				z: -60
			}
		}
	}
};

window.lunCompletedQuests = new Set();
try {
	const saved = localStorage.getItem('lunCompletedQuests');
	if (saved) {
		JSON.parse(saved).forEach(code => window.lunCompletedQuests.add(code));
	}
} catch(e) {}

const origFetch = window.fetch;
window.fetch = async function(...args) {
	const response = await origFetch.apply(this, args);
	const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
	if (url && url.includes('/api/quests')) {
		const clone = response.clone();
		clone.json().then(data => {
			if (Array.isArray(data)) {
				data.forEach(q => { if (q.isCompleted) window.lunCompletedQuests.add(q.code); });
				localStorage.setItem('lunCompletedQuests', JSON.stringify([...window.lunCompletedQuests]));
			}
		}).catch(e => {});
	}
	return response;
};

const origXhrOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url) {
	this.addEventListener('load', function() {
		if (url && typeof url === 'string' && url.includes('/api/quests')) {
			try {
				let data = JSON.parse(this.responseText);
				if (Array.isArray(data)) {
					data.forEach(q => { if (q.isCompleted) window.lunCompletedQuests.add(q.code); });
					localStorage.setItem('lunCompletedQuests', JSON.stringify([...window.lunCompletedQuests]));
				}
			} catch(e) {}
		}
	});
	origXhrOpen.apply(this, arguments);
};
const WorldZones = [{"zoneId": 1, "minX": 0, "maxX": 100, "minZ": 0, "maxZ": 100, "requiredQuestCode": null}, {"zoneId": 2, "minX": 100, "maxX": 200, "minZ": 0, "maxZ": 200, "requiredQuestCode": null}, {"zoneId": 3, "minX": 200, "maxX": 300, "minZ": 0, "maxZ": 200, "requiredQuestCode": null}, {"zoneId": 4, "minX": 300, "maxX": 430, "minZ": 60, "maxZ": 140, "requiredQuestCode": null}, {"zoneId": 5, "minX": 430, "maxX": 560, "minZ": 60, "maxZ": 140, "requiredQuestCode": null}, {"zoneId": 6, "minX": 560, "maxX": 660, "minZ": 0, "maxZ": 200, "requiredQuestCode": null}, {"zoneId": 7, "minX": 660, "maxX": 760, "minZ": 0, "maxZ": 200, "requiredQuestCode": null}, {"zoneId": 8, "minX": 760, "maxX": 960, "minZ": 0, "maxZ": 200, "requiredQuestCode": null}, {"zoneId": 9, "minX": 960, "maxX": 1140, "minZ": 40, "maxZ": 160, "requiredQuestCode": null}, {"zoneId": 10, "minX": 1140, "maxX": 1360, "minZ": 0, "maxZ": 200, "requiredQuestCode": null}, {"zoneId": 11, "minX": 2000, "maxX": 2040, "minZ": 0, "maxZ": 40, "requiredQuestCode": null}, {"zoneId": 12, "minX": 2100, "maxX": 2140, "minZ": 0, "maxZ": 40, "requiredQuestCode": null}, {"zoneId": 13, "minX": 2200, "maxX": 2240, "minZ": 0, "maxZ": 40, "requiredQuestCode": null}, {"zoneId": 101, "minX": 100, "maxX": 300, "minZ": 200, "maxZ": 400, "requiredQuestCode": null}, {"zoneId": 102, "minX": 350, "maxX": 450, "minZ": 200, "maxZ": 400, "requiredQuestCode": null}, {"zoneId": 103, "minX": 550, "maxX": 650, "minZ": 200, "maxZ": 400, "requiredQuestCode": null}, {"zoneId": 104, "minX": 712.5, "maxX": 787.5, "minZ": 212.5, "maxZ": 287.5, "requiredQuestCode": "MQ_BOSS_WORLDTREE"}, {"zoneId": 105, "minX": 850, "maxX": 950, "minZ": 200, "maxZ": 400, "requiredQuestCode": null}, {"zoneId": 106, "minX": 1050, "maxX": 1150, "minZ": 200, "maxZ": 400, "requiredQuestCode": null}, {"zoneId": 107, "minX": 1250, "maxX": 1350, "minZ": 200, "maxZ": 400, "requiredQuestCode": null}, {"zoneId": 108, "minX": 1400, "maxX": 1600, "minZ": 200, "maxZ": 400, "requiredQuestCode": null}, {"zoneId": 181, "minX": 2300, "maxX": 2340, "minZ": 0, "maxZ": 40, "requiredQuestCode": null}, {"zoneId": 182, "minX": 2400, "maxX": 2440, "minZ": 0, "maxZ": 40, "requiredQuestCode": null}, {"zoneId": 900, "minX": 0, "maxX": 1200, "minZ": 0, "maxZ": 25, "requiredQuestCode": null}, {"zoneId": 901, "minX": 0, "maxX": 100, "minZ": 0, "maxZ": 100, "requiredQuestCode": null}, {"zoneId": 201, "minX": 120, "maxX": 280, "minZ": -160, "maxZ": 0, "requiredQuestCode": null}, {"zoneId": 202, "minX": 340, "maxX": 460, "minZ": -200, "maxZ": 0, "requiredQuestCode": null}, {"zoneId": 203, "minX": 520, "maxX": 680, "minZ": -160, "maxZ": 0, "requiredQuestCode": null}, {"zoneId": 204, "minX": 725, "maxX": 775, "minZ": -75, "maxZ": -25, "requiredQuestCode": "MQ2_CORE3"}, {"zoneId": 205, "minX": 840, "maxX": 960, "minZ": -200, "maxZ": 0, "requiredQuestCode": null}, {"zoneId": 206, "minX": 1040, "maxX": 1160, "minZ": -200, "maxZ": 0, "requiredQuestCode": null}, {"zoneId": 207, "minX": 1240, "maxX": 1360, "minZ": -200, "maxZ": 0, "requiredQuestCode": null}, {"zoneId": 208, "minX": 1440, "maxX": 1560, "minZ": -200, "maxZ": 0, "requiredQuestCode": null}, {"zoneId": 209, "minX": 1620, "maxX": 1780, "minZ": -160, "maxZ": 0, "requiredQuestCode": null}, {"zoneId": 281, "minX": 2500, "maxX": 2540, "minZ": 0, "maxZ": 40, "requiredQuestCode": null}, {"zoneId": 282, "minX": 2600, "maxX": 2640, "minZ": 0, "maxZ": 40, "requiredQuestCode": null}];

const ZoneSequences = [1, 2, 5, 3, 6, 4, 7, 8, 9, 10];
const Waypoints = {
	3: [
		{
			x: 272,
			z: 106,
			crossed: false
		}
	]
};

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
	if (!container) return null;
	const direct = container.children?.[0]?.children?.[0]?.children?.[1];
	if (direct && direct.isSprite) return direct;

	let sprite = null;
	if (typeof container.traverse === "function") {
		container.traverse(obj => {
			if (!sprite && obj && obj.isSprite) {
				sprite = obj;
			}
		});
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
}
var lunTranslateEmail = (window.localStorage && localStorage.getItem("spkmod-translate-email")) || "";
function setTranslateEmail(email) {
	lunTranslateEmail = (email || "").trim();
	if (window.localStorage) localStorage.setItem("spkmod-translate-email", lunTranslateEmail);
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
	return "en";
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
		const res = await fetch("https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/main/translations.json");
		if (res.ok) {
			const data = await res.json();
			if (data && data.en) {
				for (const lang of Object.keys(data)) {
					spkmodTranslations[lang] = Object.assign({}, spkmodTranslations[lang] || {}, data[lang]);
				}
				if (typeof window !== "undefined" && window.localStorage) {
					try {
						localStorage.setItem("spkmod-translations-cache", JSON.stringify(spkmodTranslations));
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
	spkmodLang = lang;
	if (window.localStorage) localStorage.setItem("spkmod-lang", lang);
	refreshI18n();
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
	hotkeysModal: null
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
	pinnedQuestHeader: null,
	langSelect: null,
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
	statsBtn: null,
	minigameTrackerLabel: null,
	minigameTrackerToggleInput: null,
	hideKnownBotsLabel: null,
	hideKnownBotsToggleInput: null,
	settingsCatGeneral: null,
	settingsCatHUD: null
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
const NAMETAG_MODES = ["showAllNametags", "keepPartyNametags", "keepFriendsNametags", "hideAllNametags"];

var lunFriendNicknames = new Set();
var lunFriendChatHighlightEnabled = (window.localStorage && localStorage.getItem("spkmod-friend-highlight-enabled")) === "true";

function setFriendChatHighlightEnabled(enabled) {
	lunFriendChatHighlightEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-friend-highlight-enabled", lunFriendChatHighlightEnabled ? "true" : "false");
}

var lunLastFriendFetchTime = 0;
var lunFriendFetchInProgress = false;

function fetchFriendsList(force = false) {
	const now = Date.now();
	if (!force && now - lunLastFriendFetchTime < 60000) return;
	if (lunFriendFetchInProgress) return;
	const token = typeof getAuthToken === "function" ? getAuthToken() : null;
	if (!token) return;
	lunFriendFetchInProgress = true;
	fetch("https://sr1.overture.io.kr/api/friend/list", {
		method: "GET",
		headers: {
			"authorization": `Bearer ${token}`
		},
		mode: "cors"
	}).then(async res => {
		if (!res.ok) return;
		const data = await res.json();
		const friends = data?.friends;
		if (Array.isArray(friends)) {
			const newSet = new Set();
			for (const f of friends) {
				if (f && typeof f.nickname === "string") {
					const nick = f.nickname.trim().toLowerCase();
					if (nick) newSet.add(nick);
				}
			}
			lunFriendNicknames = newSet;
			lunLastFriendFetchTime = Date.now();
		}
	}).catch(e => {
		console.warn("[SpeakiMod+] Failed to fetch friend list:", e);
	}).finally(() => {
		lunFriendFetchInProgress = false;
	});
}

const lunKnownBotNames = ["toufufuton", "uhu", "clay79", "key7catace", "6air9dog5", "53lake", "1sealace", "2wave0bay1", "19owlfern", "red17wave", "nekomaru2", "king9SPK5", "ash6mist7", "takutaku8", "스핔이3984","SPKtree21", "SPKleaf37", "3clayowl5", "3bayhero9", "99duckdog", "cow6SPK2", "fire8SPK7","Takutaku3", "Takutaku4", "kutakuta", "0birdice2", "wind2SPK8", "SPKbay23", "3sky8king", "star2bat04", "map3kite4","FrznTeardrop", "sun9SPK0", "5SPKsnow2", "SPKclay15", "frogfox40", "5air7moon", "SPKair00", "SPKblue88", "moss4ant36", "9gem4wind", "SPKjade05", "SPKfin06", "SPKdeer69","OO0OOOOO72", "llIlIIll62", "lIllIIIl39", "IIlIIIlI45", "00OO0OO099","sorakara", "karakaze", "rainant78", "SPKlake78", "takutaku7", "rnmrrnvrm2", "SPKfern89", "llIIllll38", "SPKtree03", "OO0O00OO30", "SPKecho92", "OOOOO0O081", "takutaku6", "kutakuta2", "GOODSPIKI", "BADSPIKI", "NEXThobagi", "QAZWSXEDC", "kqland", "SPKsun83", "CHOWAYOHOBAG", "AdmiralSPK", "xHunterSPKx", "HOBAGIRENGOU", "TOKAlhobagi", "chowayooo5", "NELSPK", "TOKAIhobagi", "hobagihouse", "NORDSPEAKI", "LOGIN", "FunnySPK", "JpTHEspeaki", "MEXICOSPK", "JAXNOTD", "DDDDDDAA", "NOMUT", "alexasojk", "gotobasupk", "Nyandal", "amejiso", "SPKcalm33", "SPKtree51", "snowfin05", "fernhat76", "SPKhero04", "jadenet92", "000OO00O82", "00O000O081", "frogbee79", "00O000O081", "OOOOOO0030", "OOOOOO0081", "IIIIIII06", "lllllll06", "IIIIIII47", "lllllll47", "SPKecho92", "SPKtree03", "SPKstar65", "blueash78", "SPKfrog11", "OOOOOOO030", "OOOOOOO081", "IIIIIIII06", "IIIIIIII47", "IIlIIIll47", "OO0O00OO30", "IIlIIIll47", "OO0O00OO30", "llIIlIll06", "IIlIIIll47", "OOOOO0O081", "llIIlIll06", "OO0O00OO30", "SPKfern89", "SPKtree03", "rnmrrnvrm2", "SPKblue93", "SPKrain63","SPKecho98","OOOOO0O081", "duckjay85", "SPKstar65", "echosun86", "llIIllll38", "takutaku6", "kutakuta2", "takutaku7"];

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

function setHideKnownBotsEnabled(enabled) {
	lunHideKnownBotsEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-hide-known-bots", lunHideKnownBotsEnabled ? "true" : "false");
	if (lunPanelElements.hideKnownBotsToggleInput) lunPanelElements.hideKnownBotsToggleInput.checked = lunHideKnownBotsEnabled;
	updateKnownBotVisibility();
}

var lunAutoBannedLevel1s = new Set();

function isKnownBotName(name, level) {
	if (typeof name !== "string") return false;
	const normalizedName = name.trim();
	const lowerName = normalizedName.toLocaleLowerCase();
	
	if (lunKnownBotNames.some(botName => botName.trim().toLocaleLowerCase() === lowerName)) {
		return true;
	}
	
	const parsedLevel = typeof level === "number" ? level : parseInt(level);
	if (!isNaN(parsedLevel)) {
		if (parsedLevel === 1 && lunAutoBannedLevel1s.has(lowerName)) {
			return true;
		}

		if (parsedLevel <= 2) {
			if (/^[Il]{6,10}[0-9]{2}$/.test(normalizedName)) return true;
			if (/^[O0]{6,10}[0-9]{2}$/.test(normalizedName)) return true;
		}
		
		if (parsedLevel === 1) {
			if (lowerName.includes("spk") || lowerName.includes("스핔이")) return true;
			
			if (/^[a-z]+\d+[a-z]+\d+$/i.test(normalizedName)) return true;
			if (/^\d+[a-z]+\d+$/i.test(normalizedName)) return true;
			if (/^\d+[a-z]+\d+[a-z]+$/i.test(normalizedName)) return true;
			if (/^\d{1,2}[a-z]+$/i.test(normalizedName)) return true;
			if (/^[a-z]+\d{1,2}[a-z]+$/i.test(normalizedName)) return true;
			if (/^\d+[a-z]+\d+[a-z]+\d+$/i.test(normalizedName)) return true;
		}
	}
	
	return false;
}

function updateKnownBotVisibility() {
	if (!gameState?.remotePlayers?.remotePlayers) return;
	gameState.remotePlayers.remotePlayers.forEach(player => {
		if (player?.container) {
			player.container.visible = !lunHideKnownBotsEnabled || !isKnownBotName(player.info?.name, player.info?.level);
		}
	});
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

function isKnownBotBubbleSource(source) {
	if (!source || !gameState?.remotePlayers?.remotePlayers) return false;
	if (isKnownBotContainer(source) || isKnownBotContainer(source.container)) return true;
	if (isKnownBotName(source.info?.name, source.info?.level) || isKnownBotName(source.name, source.level)) return true;

	for (const player of gameState.remotePlayers.remotePlayers.values()) {
		const playerInfo = player?.info;
		if (playerInfo && (source === playerInfo.playerId || source === playerInfo.id || source === playerInfo.userId)) {
			return isKnownBotName(playerInfo.name, playerInfo.level);
		}
	}
	return false;
}

function hookKnownBotHeartEmotes() {
	const bloomEffects = gameState?.bloomEffects;
	if (!bloomEffects || typeof bloomEffects.spawnHearts !== "function" || bloomEffects.__speakiKnownBotHooked) return;

	const originalSpawnHearts = bloomEffects.spawnHearts.bind(bloomEffects);
	bloomEffects.spawnHearts = function(container, ...args) {
		if (lunHideKnownBotsEnabled && isKnownBotContainer(container)) return;
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

var lunCurrencyTrackerEnabled = (window.localStorage && localStorage.getItem("spkmod-currency-tracker")) !== "false";
function setCurrencyTrackerEnabled(enabled) {
	lunCurrencyTrackerEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-currency-tracker", lunCurrencyTrackerEnabled ? "true" : "false");
	if (lunHudElements.currencyTracker) {
		lunHudElements.currencyTracker.style.display = lunCurrencyTrackerEnabled ? "" : "none";
	}
}

var lunSessionGoldTrackerEnabled = (window.localStorage && localStorage.getItem("spkmod-session-gold")) === "true";
function setSessionGoldTrackerEnabled(enabled) {
	lunSessionGoldTrackerEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-session-gold", lunSessionGoldTrackerEnabled ? "true" : "false");
	if (lunHudElements.sessionGoldTracker) {
		lunHudElements.sessionGoldTracker.style.display = lunSessionGoldTrackerEnabled ? "" : "none";
	}
}

var lunExpRatePerHour = (window.localStorage && localStorage.getItem("spkmod-exp-per-hour")) === "true";
const LUN_EXP_INTERVAL_OPTIONS = [1, 5, 10, 15, 30, 60];
var lunExpIntervalMinutes = parseInt((window.localStorage && localStorage.getItem("spkmod-exp-interval-minutes")) || "1", 10);
if (!LUN_EXP_INTERVAL_OPTIONS.includes(lunExpIntervalMinutes)) lunExpIntervalMinutes = 1;
function resetExpTracker() {
	lunExpTrackerInitialized = false;
	lunExpTrackerSamples = [];
	lunExpTrackerLastSampleTick = 0;
	window.lunExpTrackerIgnoredExp = 0;
	window.lunExpTrackerLastRawExp = undefined;
}
function setExpRatePerHour(enabled) {
	lunExpRatePerHour = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-exp-per-hour", lunExpRatePerHour ? "true" : "false");
	resetExpTracker();
}

function setExpIntervalMinutes(minutes) {
	const parsedMinutes = parseInt(minutes, 10);
	if (!LUN_EXP_INTERVAL_OPTIONS.includes(parsedMinutes)) return;
	lunExpIntervalMinutes = parsedMinutes;
	if (window.localStorage) localStorage.setItem("spkmod-exp-interval-minutes", String(lunExpIntervalMinutes));
	resetExpTracker();
}

var lunFpsPingEnabled = (window.localStorage && localStorage.getItem("spkmod-fps-ping")) === "true";
function setFpsPingEnabled(enabled) {
	lunFpsPingEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-fps-ping", lunFpsPingEnabled ? "true" : "false");
	if (lunHudElements.fpsPingTracker) {
		lunHudElements.fpsPingTracker.style.display = lunFpsPingEnabled ? "" : "none";
	}
	if (lunFpsPingEnabled && typeof performActivePing === 'function') {
		performActivePing();
	}
}

var lunResetTimerEnabled = (window.localStorage && localStorage.getItem("spkmod-reset-timer")) !== "false";
function setResetTimerEnabled(enabled) {
	lunResetTimerEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-reset-timer", lunResetTimerEnabled ? "true" : "false");
	if (lunHudElements.resetTimerTracker) {
		lunHudElements.resetTimerTracker.style.display = lunResetTimerEnabled ? "" : "none";
	}
}

var lunMinigameTrackerEnabled = (window.localStorage && localStorage.getItem("spkmod-pumpkin-tracker")) === "true";
var lunMinigameStatus = null;
var lunMinigameTrackerWindow = 60 * lunTPS;
var lunMinigameTrackerNextTicks = 0;

function setMinigameTrackerEnabled(enabled) {
	lunMinigameTrackerEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-pumpkin-tracker", lunMinigameTrackerEnabled ? "true" : "false");
	if (lunHudElements.minigameTracker) {
		lunHudElements.minigameTracker.style.display = lunMinigameTrackerEnabled ? "" : "none";
	}
	if (lunMinigameTrackerEnabled && !lunMinigameStatus) {
		fetchMinigameStatus();
	}
}

let ACTIVE_MINIGAME_ID = null;

function fetchMinigameStatus() {
	const token = getAuthToken();
	if (!token) return;

	let keysToTry = ["pumpkin", "sweep", "nuruling"];
	if (typeof gameState !== "undefined" && gameState && gameState.minigameEntryDialogs) {
		const dynamicKeys = gameState.minigameEntryDialogs.map(d => d.def && d.def.gameKey).filter(Boolean);
		if (dynamicKeys.length > 0) keysToTry = dynamicKeys;
	}

	if (!ACTIVE_MINIGAME_ID) {
		let lastResp = null;
		
		const checkNext = (index) => {
			if (index >= keysToTry.length) {
				if (lastResp) {
					lunMinigameStatus = lastResp;
					updateMinigameUI();
				}
				return;
			}
			const key = keysToTry[index];
			fetch(`https://sr1.overture.io.kr/api/minigame/${key}/status`, {
				"method": "GET",
				"headers": { "authorization": `Bearer ${token}` },
				"mode": "cors"
			})
			.then(res => res.json())
			.then(resp => {
				if (resp && resp.isActive) {
					ACTIVE_MINIGAME_ID = key;
					lunMinigameStatus = resp;
					updateMinigameUI();
				} else {
					if (resp) lastResp = resp;
					checkNext(index + 1);
				}
			})
			.catch(err => {
				checkNext(index + 1);
			});
		};
		checkNext(0);
		return;
	}

	fetch(`https://sr1.overture.io.kr/api/minigame/${ACTIVE_MINIGAME_ID}/status`, {
		"method": "GET",
		"headers": {
			"authorization": `Bearer ${token}`
		},
		"mode": "cors"
	})
		.then(res => res.json())
		.then(resp => {
			if (resp && !resp.isActive) {
				ACTIVE_MINIGAME_ID = null; // reset so it searches again on next tick
			}
			lunMinigameStatus = resp;
			updateMinigameUI();
		})
		.catch(err => {
			console.error("[SpeakiMod] Failed to fetch minigame status:", err);
		});
}

function updateMinigameUI() {
	if (lunHudElements.minigameTracker) {
		if (lunMinigameStatus) {
			if (lunMinigameStatus.isActive) {
				setText(lunHudElements.minigameTracker, t("minigameTrackerText", lunMinigameStatus.remainingPlaysToday ?? 0, lunMinigameStatus.dailyCapPlays ?? 10));
			} else {
				setText(lunHudElements.minigameTracker, t("minigameTrackerInactive"));
			}
		} else {
			setText(lunHudElements.minigameTracker, t("minigameTrackerText", "--", "--"));
		}
	}
	updateEventModalContent();
	updateStatsModalLive();
}

var spkmodTopZIndex = 600000;

function bringToFront(element) {
	if (!element) return;
	spkmodTopZIndex++;
	element.style.zIndex = spkmodTopZIndex;
}

function makeDraggable(element, handles) {
	if (!element || !handles) return;
	if (element.__spkmodDraggable) return;
	element.__spkmodDraggable = true;

	const posKey = element.id ? "spkmod-pos-" + element.id : null;

	if (window.localStorage && posKey) {
		const savedPos = localStorage.getItem(posKey) || (element.id === "spkmod-hud" ? localStorage.getItem("spkmod-window-pos") : null);
		if (savedPos) {
			try {
				const parsedPos = JSON.parse(savedPos);
				if (parsedPos.top && parsedPos.left) {
					const topNum = parseFloat(parsedPos.top);
					const leftNum = parseFloat(parsedPos.left);
					if (!isNaN(topNum) && !isNaN(leftNum)) {
						const clampedTop = Math.max(0, Math.min(topNum, window.innerHeight - 45));
						const clampedLeft = Math.max(0, Math.min(leftNum, window.innerWidth - 60));
						element.style.top = clampedTop + "px";
						element.style.left = clampedLeft + "px";
						element.dataset.userDragged = "true";
					} else {
						element.style.top = parsedPos.top;
						element.style.left = parsedPos.left;
						element.dataset.userDragged = "true";
					}
				}
			} catch (err) {
				console.warn("[SpeakiMod+] Failed to load saved position for " + (element.id || "element"));
			}
		}
	}

	element.addEventListener("mousedown", () => {
		bringToFront(element);
	}, true);

	handles.forEach(handle => {
		if (handle && handle.addEventListener) {
			handle.addEventListener("dragstart", e => e.preventDefault());
		}
	});

	let isDragging = false;
	let startPointerX = 0, startPointerY = 0;
	let startElemLeft = 0, startElemTop = 0;
	let currentScale = 1;
	let hasMovedSignificant = false;

	function onPointerDown(e) {
		if (isDragging) return;
		if (e.button !== undefined && e.button !== 0) return;

		const target = e.target;
		const isExplicitDragBtn = target && (target.id === 'spkmod-drag-btn' || target.closest('#spkmod-drag-btn'));
		const isExplicitFooter = target && (target.id === 'spkmod-footer' || target.closest('#spkmod-footer'));
		const isHeaderRow = target && (target.id === 'spkmod-header-row' || target.closest('#spkmod-header-row'));

		if (!isExplicitDragBtn && !isExplicitFooter && !isHeaderRow && target) {
			if (
				target.tagName === 'BUTTON' ||
				target.tagName === 'INPUT' ||
				target.tagName === 'SELECT' ||
				target.tagName === 'A' ||
				target.id?.includes('close') ||
				target.closest('button') ||
				target.closest('input') ||
				target.closest('select') ||
				target.closest('a') ||
				target.closest('[id*="close"]')
			) {
				return;
			}
		}

		const scaleVar = getComputedStyle(element).getPropertyValue('--spkmod-scale');
		currentScale = parseFloat(scaleVar) || 1;

		const rect = element.getBoundingClientRect();
		startElemLeft = parseFloat(element.style.left);
		if (isNaN(startElemLeft)) startElemLeft = rect.left;
		startElemTop = parseFloat(element.style.top);
		if (isNaN(startElemTop)) startElemTop = rect.top;

		startPointerX = e.clientX;
		startPointerY = e.clientY;
		hasMovedSignificant = false;
		isDragging = true;

		if (e.pointerId && target && target.setPointerCapture) {
			try {
				target.setPointerCapture(e.pointerId);
			} catch (_) {}
		}

		window.addEventListener("pointermove", onMove, { passive: false });
		window.addEventListener("pointerup", onUp);
		window.addEventListener("pointercancel", onUp);
		window.addEventListener("mousemove", onMove, { passive: false });
		window.addEventListener("mouseup", onUp);
	}

	function onMove(ev) {
		if (!isDragging) return;

		const deltaX = (ev.clientX - startPointerX) / currentScale;
		const deltaY = (ev.clientY - startPointerY) / currentScale;

		if (!hasMovedSignificant && (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2)) {
			hasMovedSignificant = true;
			element.dataset.userDragged = "true";
			element.dataset.justDragged = "true";
		}

		if (hasMovedSignificant) {
			ev.preventDefault();
			const maxTop = Math.max(0, window.innerHeight - 45);
			const maxLeft = Math.max(0, window.innerWidth - 60);
			const newLeft = Math.min(Math.max(0, startElemLeft + deltaX), maxLeft);
			const newTop = Math.min(Math.max(0, startElemTop + deltaY), maxTop);

			element.style.left = Math.round(newLeft) + "px";
			element.style.top = Math.round(newTop) + "px";
		}
	}

	function onUp(ev) {
		if (!isDragging) return;
		isDragging = false;

		window.removeEventListener("pointermove", onMove);
		window.removeEventListener("pointerup", onUp);
		window.removeEventListener("pointercancel", onUp);
		window.removeEventListener("mousemove", onMove);
		window.removeEventListener("mouseup", onUp);

		if (ev && ev.pointerId && ev.target && ev.target.releasePointerCapture) {
			try {
				ev.target.releasePointerCapture(ev.pointerId);
			} catch (_) {}
		}

		if (hasMovedSignificant) {
			element.dataset.userDragged = "true";
			if (posKey && window.localStorage) {
				const posData = JSON.stringify({
					top: element.style.top,
					left: element.style.left
				});
				localStorage.setItem(posKey, posData);
				if (element.id === "spkmod-hud") {
					localStorage.setItem("spkmod-window-pos", posData);
				}
			}
			setTimeout(() => {
				element.dataset.justDragged = "false";
			}, 120);
		}
	}

	handles.forEach(handle => {
		if (handle) {
			handle.addEventListener("pointerdown", onPointerDown);
			handle.addEventListener("mousedown", onPointerDown);
		}
	});
}

function positionModalNicely(modal) {
	if (!modal) return;
	bringToFront(modal);

	const posKey = modal.id ? ("spkmod-pos-" + modal.id) : null;
	const hasSavedPos = !!(posKey && window.localStorage && localStorage.getItem(posKey));
	const hasBeenDragged = modal.dataset.userDragged === "true";

	if (hasSavedPos || (hasBeenDragged && modal.style.left && modal.style.top)) {
		return;
	}

	const hudRect = document.querySelector("#spkmod-hud")?.getBoundingClientRect();
	const startLeft = hudRect && hudRect.right > 0 ? Math.round(hudRect.right + 10) : 260;
	const startTop = hudRect && hudRect.top >= 0 ? Math.round(hudRect.top) : 10;

	const allModals = [
		lunHudElements.settingsModal,
		lunHudElements.statsModal,
		lunHudElements.eventModal,
		lunHudElements.patchNotesModal
	];

	const visibleModals = allModals.filter(m => m && m !== modal && !m.classList.contains("hidden") && m.offsetParent !== null);

	if (visibleModals.length > 0) {
		let rightmostModal = visibleModals[0];
		let rightmostRect = rightmostModal.getBoundingClientRect();
		for (let i = 1; i < visibleModals.length; i++) {
			const r = visibleModals[i].getBoundingClientRect();
			if (r.right > rightmostRect.right) {
				rightmostModal = visibleModals[i];
				rightmostRect = r;
			}
		}

		const approxWidth = modal.offsetWidth || (modal.id === "spkmod-settings-modal" ? 480 : (modal.id === "spkmod-stats-modal" ? 240 : 400));
		let nextLeft = Math.round(rightmostRect.right + 10);
		let nextTop = Math.round(rightmostRect.top);

		if (nextLeft + approxWidth > window.innerWidth - 10) {
			nextLeft = Math.max(10, Math.min(Math.round(rightmostRect.left + 30), window.innerWidth - approxWidth - 10));
			nextTop = Math.max(10, Math.min(Math.round(rightmostRect.top + 35), window.innerHeight - 100));
		}

		modal.style.left = nextLeft + "px";
		modal.style.top = nextTop + "px";
	} else {
		modal.style.left = startLeft + "px";
		modal.style.top = startTop + "px";
	}
}

let lastToggleSettingsTime = 0;
function toggleSettingsModal() {
	const now = Date.now();
	if (now - lastToggleSettingsTime < 250) return;
	lastToggleSettingsTime = now;

	if (!lunHudElements.settingsModal) return;
	const isClosed = lunHudElements.settingsModal.classList.contains("hidden");
	if (isClosed) {
		positionModalNicely(lunHudElements.settingsModal);
		if (typeof updateHudBgDropdown === 'function') {
			updateHudBgDropdown();
		}
		lunHudElements.settingsModal.classList.remove("hidden");
	} else {
		lunHudElements.settingsModal.classList.add("hidden");
		if (typeof toggleQuickLoginSettings === "function") {
			toggleQuickLoginSettings(false);
		}
	}
}

function toggleEventModal() {
	if (!lunHudElements.eventModal) return;
	const isClosed = lunHudElements.eventModal.classList.contains("hidden");
	if (isClosed) {
		positionModalNicely(lunHudElements.eventModal);
		lunHudElements.eventModal.classList.remove("hidden");
		fetchMinigameStatus();
	} else {
		lunHudElements.eventModal.classList.add("hidden");
	}
}

function updateEventModalContent() {
	if (!lunHudElements.eventModal) return;
	if (eventModalElements.headerTitle) setText(eventModalElements.headerTitle, t("eventInfoHeader"));
	if (eventModalElements.titleText) setText(eventModalElements.titleText, "🎃 " + t("eventMinigameTitle"));
	
	if (!lunMinigameStatus) {
		if (eventModalElements.periodText) setText(eventModalElements.periodText, t("eventLoading"));
		return;
	}

	const active = !!lunMinigameStatus.isActive;
	if (eventModalElements.statusBadge) {
		setText(eventModalElements.statusBadge, active ? t("eventStatusActive") : t("eventStatusInactive"));
		eventModalElements.statusBadge.style.color = active ? "#4ade80" : "#f87171";
		eventModalElements.statusBadge.style.borderColor = active ? "#4ade80" : "#f87171";
	}

	if (eventModalElements.periodText) {
		const start = lunMinigameStatus.activeStartDate || "--";
		const end = lunMinigameStatus.activeEndDate || "--";
		setText(eventModalElements.periodText, t("eventPeriod", start, end));
	}

	if (eventModalElements.bestScoreText) {
		setText(eventModalElements.bestScoreText, t("eventBestScore", lunMinigameStatus.myBestScore ?? "--"));
	}

	if (eventModalElements.playsRemainingText) {
		const rem = lunMinigameStatus.remainingPlaysToday ?? 0;
		const cap = lunMinigameStatus.dailyCapPlays ?? 10;
		setText(eventModalElements.playsRemainingText, t("eventPlaysToday", rem, cap));
	}

	if (eventModalElements.refreshBtn) setText(eventModalElements.refreshBtn, "🔄 " + t("refreshBtn"));
}

var lunPatchNotesData = (() => {
	try {
		const raw = localStorage.getItem("spkmod-patchnotes-data");
		return raw ? JSON.parse(raw) : null;
	} catch (_) {
		return null;
	}
})();
var lunPatchNotesFetched = false;
var lunPatchNotesLoading = false;
var lunPatchNotesTranslatedLang = null;
var lunPatchNotesTranslations = (() => {
	try {
		const raw = localStorage.getItem("spkmod-patchnotes-translations");
		return raw ? JSON.parse(raw) : {};
	} catch (_) {
		return {};
	}
})();

async function translateTextToLang(text, targetLang) {
	if (!text || !text.trim() || targetLang === "ko") return text;
	try {
		const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
		const res = await fetch(url);
		if (res.ok) {
			const data = await res.json();
			if (data && data[0]) {
				return data[0].map(chunk => chunk[0] || "").join("");
			}
		}
	} catch (e) {
		try {
			if (typeof translateChatText === "function") {
				const translated = await translateChatText(text, "ko", targetLang);
				if (translated) return translated;
			}
		} catch (_) {}
	}
	return text;
}

async function fetchPatchNotesOnce() {
	if (lunPatchNotesFetched) return;
	const token = getAuthToken();
	if (!token) return;
	lunPatchNotesFetched = true;
	if (!lunPatchNotesData) {
		lunPatchNotesLoading = true;
		renderPatchNotesUI();
	}

	try {
		const res = await fetch("https://sr1.overture.io.kr/api/patchnotes", {
			method: "GET",
			headers: {
				"authorization": `Bearer ${token}`
			},
			mode: "cors"
		});
		if (!res.ok) {
			lunPatchNotesLoading = false;
			renderPatchNotesUI();
			return;
		}
		const data = await res.json();
		const freshNotes = Array.isArray(data) ? data : [];
		const hasChanged = JSON.stringify(freshNotes) !== JSON.stringify(lunPatchNotesData);
		lunPatchNotesData = freshNotes;
		lunPatchNotesLoading = false;

		if (hasChanged) {
			try {
				localStorage.setItem("spkmod-patchnotes-data", JSON.stringify(lunPatchNotesData));
			} catch (_) {}
		}

		await translatePatchNotesToUserLang();
		renderPatchNotesUI();
	} catch (e) {
		console.warn("[SpeakiMod+] Failed to fetch patch notes:", e);
		lunPatchNotesLoading = false;
		renderPatchNotesUI();
	}
}

async function translatePatchNotesToUserLang() {
	if (!lunPatchNotesData || lunPatchNotesData.length === 0) return;
	const targetLang = spkmodLang === "es-419" ? "es" : spkmodLang;
	lunPatchNotesTranslatedLang = targetLang;
	if (targetLang === "ko") return;

	let updatedAny = false;
	for (const note of lunPatchNotesData) {
		if (!lunPatchNotesTranslations[note.id]) lunPatchNotesTranslations[note.id] = {};
		const noteHash = note.updatedAt || `${note.title || ""}:::${note.content || ""}`;
		const cached = lunPatchNotesTranslations[note.id][targetLang];

		if (cached && cached.hash === noteHash && cached.title && cached.content) {
			continue;
		}

		const translatedTitle = await translateTextToLang(note.title, targetLang);
		const translatedContent = await translateTextToLang(note.content, targetLang);
		lunPatchNotesTranslations[note.id][targetLang] = {
			hash: noteHash,
			title: translatedTitle,
			content: translatedContent
		};
		updatedAny = true;
	}

	if (updatedAny) {
		try {
			localStorage.setItem("spkmod-patchnotes-translations", JSON.stringify(lunPatchNotesTranslations));
		} catch (_) {}
	}
}

function togglePatchNotesModal() {
	if (!lunHudElements.patchNotesModal) return;
	const isClosed = lunHudElements.patchNotesModal.classList.contains("hidden");
	if (isClosed) {
		positionModalNicely(lunHudElements.patchNotesModal);
		lunHudElements.patchNotesModal.classList.remove("hidden");
		if (!lunPatchNotesFetched) {
			fetchPatchNotesOnce();
		} else {
			renderPatchNotesUI();
		}
	} else {
		lunHudElements.patchNotesModal.classList.add("hidden");
	}
}

function renderPatchNotesUI() {
	if (!patchNotesModalElements.contentContainer) return;
	if (patchNotesModalElements.headerTitle) setText(patchNotesModalElements.headerTitle, "📰 " + t("patchNotesHeader"));
	const container = patchNotesModalElements.contentContainer;
	container.innerHTML = "";

	if (lunPatchNotesLoading) {
		container.appendChild(buildElement("div", {
			style: "text-align: center; padding: 20px 10px; color: #aaa; font-size: 10pt;",
			innerText: t("patchNotesLoading")
		}));
		return;
	}

	if (!lunPatchNotesData) {
		container.appendChild(buildElement("div", {
			style: "text-align: center; padding: 20px 10px; color: #f87171; font-size: 10pt;",
			innerText: t("patchNotesError")
		}));
		return;
	}

	if (lunPatchNotesData.length === 0) {
		container.appendChild(buildElement("div", {
			style: "text-align: center; padding: 20px 10px; color: #aaa; font-size: 10pt;",
			innerText: t("patchNotesEmpty")
		}));
		return;
	}

	const targetLang = spkmodLang === "es-419" ? "es" : spkmodLang;

	lunPatchNotesData.forEach(item => {
		const trans = lunPatchNotesTranslations[item.id]?.[targetLang];
		const displayTitle = trans?.title || item.title || "Patch Note";
		const displayContent = trans?.content || item.content || "";
		let displayDate = "";
		if (item.createdAt) {
			try {
				displayDate = new Date(item.createdAt).toLocaleDateString(undefined, {
					year: 'numeric', month: 'short', day: 'numeric'
				});
			} catch (_) {
				displayDate = String(item.createdAt).slice(0, 10);
			}
		}

		const card = buildElement("div", {
			style: "background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 6px; padding: 10px; display: flex; flex-direction: column; gap: 4px;"
		}, [
			buildElement("div", { style: "display: flex; justify-content: space-between; align-items: baseline; gap: 8px;" }, [
				buildElement("span", {
					style: "font-weight: bold; font-size: 10.5pt; color: #ffd54a; flex: 1;",
					innerText: displayTitle
				}),
				buildElement("span", {
					style: "font-size: 8.5pt; color: #888; white-space: nowrap;",
					innerText: displayDate
				})
			]),
			buildElement("div", {
				style: "white-space: pre-wrap; font-size: 9.5pt; line-height: 1.5; color: #ddd; margin-top: 4px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 6px;",
				innerText: displayContent
			})
		]);
		container.appendChild(card);
	});
}

var lunGamepadRumbleEnabled = (window.localStorage && localStorage.getItem("spkmod-gamepad-rumble")) !== "false";
function setGamepadRumbleEnabled(enabled) {
	lunGamepadRumbleEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-gamepad-rumble", lunGamepadRumbleEnabled ? "true" : "false");
}

var lunUiScale = (window.localStorage && localStorage.getItem("spkmod-ui-scale")) || "1.0";
var lunGameUiScale = (window.localStorage && localStorage.getItem("spkmod-uiscale")) || "1.0";
var lunCameraEffect = (window.localStorage && localStorage.getItem("spkmod-camera-effect")) || "none";
var lunDroneSpeed = window.lunDroneSpeed = (window.localStorage && parseFloat(localStorage.getItem("spkmod-drone-speed"))) || 0.10;
var lunViewClip = false;
var lunBgOpacity = (window.localStorage && localStorage.getItem("spkmod-bg-opacity")) || "glass";
var lunAccentColor = (window.localStorage && localStorage.getItem("spkmod-accent-color")) || "#ffd54a";
var lunHudBackground = (window.localStorage && localStorage.getItem("spkmod-hud-bg")) || "none";

function toggleStatsModal() {
	if (!lunHudElements.statsModal) return;
	const isClosed = lunHudElements.statsModal.classList.contains("hidden");
	if (isClosed) {
		positionModalNicely(lunHudElements.statsModal);
		lunHudElements.statsModal.classList.remove("hidden");
		if (!lunMinigameStatus) {
			fetchMinigameStatus();
		}
		updateStatsModalLive();
	} else {
		lunHudElements.statsModal.classList.add("hidden");
	}
}

function resetSessionStats() {
	window._lunSessionStartTime = Date.now();
	if (typeof gameState !== 'undefined' && gameState?.myStat?.exp !== undefined) {
		window._lunSessionStartExp = gameState.myStat.exp;
	}
	lunSessionStartGold = lunLastGold;
	lunSessionStartElif = lunLastElif;
	lunSessionStartSpkCoin = lunLastSpkCoin;
	resetExpTracker();
	if (typeof chatLog === 'function') {
		chatLog(t("statsResetConfirm"));
	}
	updateStatsModalLive();
}

function updateStatsModalLive() {
	if (!lunHudElements.statsModal || lunHudElements.statsModal.classList.contains("hidden")) return;

	if (statsModalElements.headerTitle) setText(statsModalElements.headerTitle, "⏱️ " + t("statsHeader"));
	if (statsModalElements.sessionTimeLabel) setText(statsModalElements.sessionTimeLabel, "⏱️ " + t("statsSessionTime"));
	if (statsModalElements.pingLabel) setText(statsModalElements.pingLabel, "📶 " + t("statsPing"));
	if (statsModalElements.dailyResetLabel) setText(statsModalElements.dailyResetLabel, "🌅 " + t("statsDailyReset"));
	if (statsModalElements.minigameLabel) setText(statsModalElements.minigameLabel, "🎃 " + t("statsMinigamePlays"));
	if (statsModalElements.expGainedLabel) setText(statsModalElements.expGainedLabel, "⭐ " + t("statsExpGained"));
	if (statsModalElements.expRateLabel) setText(statsModalElements.expRateLabel, "📈 " + t("statsExpPerHour"));
	if (statsModalElements.timeToLevelLabel) setText(statsModalElements.timeToLevelLabel, "⏳ " + t("statsTimeToNextLevel"));
	if (statsModalElements.currencyLabel) setText(statsModalElements.currencyLabel, "💰 " + t("statsCurrency"));
	if (statsModalElements.goldGainedLabel) setText(statsModalElements.goldGainedLabel, "💰 " + t("statsGoldGained"));
	if (statsModalElements.elifGainedLabel) setText(statsModalElements.elifGainedLabel, "💎 " + t("statsElifGained"));
	if (statsModalElements.spkCoinGainedLabel) setText(statsModalElements.spkCoinGainedLabel, "🟣 " + (t("statsSpkCoinGained") || "Speaki Coin Gained"));
	if (statsModalElements.resetBtn) setText(statsModalElements.resetBtn, "🔄 " + t("statsResetBtn"));

	if (!window._lunSessionStartTime) {
		window._lunSessionStartTime = Date.now();
	}
	const elapsedMs = Math.max(0, Date.now() - window._lunSessionStartTime);
	const totalSec = Math.floor(elapsedMs / 1000);
	const sHours = Math.floor(totalSec / 3600);
	const sMins = Math.floor((totalSec % 3600) / 60);
	const sSecs = totalSec % 60;
	const timeStr = `${sHours.toString().padStart(2, '0')}:${sMins.toString().padStart(2, '0')}:${sSecs.toString().padStart(2, '0')}`;
	if (statsModalElements.sessionTimeVal) {
		setText(statsModalElements.sessionTimeVal, timeStr);
	}

	if (statsModalElements.pingVal) {
		const ping = typeof lunCurrentPing !== 'undefined' ? lunCurrentPing : "--";
		const pingNum = Number(ping);
		let pingColor = "#4ade80";
		if (isNaN(pingNum)) {
			pingColor = "#aaa";
		} else if (pingNum > 250) {
			pingColor = "#f87171";
		} else if (pingNum > 130) {
			pingColor = "#fbbf24";
		}
		statsModalElements.pingVal.innerText = `${ping} ms`;
		statsModalElements.pingVal.style.color = pingColor;
	}
	if (statsModalElements.fpsVal) {
		statsModalElements.fpsVal.innerText = `${typeof lunCurrentFps !== 'undefined' ? lunCurrentFps : "--"} FPS`;
	}

	if (statsModalElements.dailyResetVal) {
		const nowUtc = new Date();
		const kstOffset = 9 * 60 * 60 * 1000;
		const kstNow = new Date(nowUtc.getTime() + kstOffset);
		const kstNextMidnight = new Date(kstNow);
		kstNextMidnight.setUTCHours(24, 0, 0, 0);
		const diffMs = Math.max(0, kstNextMidnight.getTime() - kstNow.getTime());
		const diffTotalSeconds = Math.floor(diffMs / 1000);
		const hours = Math.floor(diffTotalSeconds / 3600);
		const minutes = Math.floor((diffTotalSeconds % 3600) / 60);
		const seconds = diffTotalSeconds % 60;
		statsModalElements.dailyResetVal.innerText = `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
	}

	if (statsModalElements.minigameVal) {
		if (lunMinigameStatus) {
			if (lunMinigameStatus.isActive) {
				const remaining = lunMinigameStatus.remainingPlaysToday ?? 0;
				const cap = lunMinigameStatus.dailyCapPlays ?? 10;
				statsModalElements.minigameVal.innerText = `${remaining} / ${cap}`;
				statsModalElements.minigameVal.style.color = remaining > 0 ? "#4ade80" : "#f87171";
			} else {
				statsModalElements.minigameVal.innerText = t("minigameTrackerInactive");
				statsModalElements.minigameVal.style.color = "#aaa";
			}
		} else {
			statsModalElements.minigameVal.innerText = "-- / --";
			statsModalElements.minigameVal.style.color = "#aaa";
		}
	}

	const myStat = (typeof gameState !== 'undefined' && gameState?.myStat) ? gameState.myStat : null;
	const currentExp = myStat?.exp ?? 0;
	const maxExp = myStat?.maxExp ?? 1;
	const currentLevel = myStat?.level ?? 1;

	if (window._lunSessionStartExp === undefined || window._lunSessionStartExp === null) {
		window._lunSessionStartExp = currentExp;
	}

	const expPct = Math.min(100, Math.max(0, (currentExp / maxExp) * 100));
	if (statsModalElements.levelProgressVal) {
		statsModalElements.levelProgressVal.innerText = `Lv. ${currentLevel} (${expPct.toFixed(1)}%)`;
	}
	if (statsModalElements.levelExpNumbers) {
		statsModalElements.levelExpNumbers.innerText = `${currentExp.toLocaleString()} / ${maxExp.toLocaleString()}`;
	}
	if (statsModalElements.levelProgressBar) {
		statsModalElements.levelProgressBar.style.width = `${expPct.toFixed(1)}%`;
	}

	const startExp = window._lunSessionStartExp ?? currentExp;
	const effectiveCurrentExp = currentExp - (window.lunExpTrackerIgnoredExp || 0);
	const expGained = Math.max(0, effectiveCurrentExp - startExp);
	if (statsModalElements.expGainedVal) {
		statsModalElements.expGainedVal.innerText = `+${expGained.toLocaleString()} EXP`;
	}

	const hoursElapsed = elapsedMs / 3600000;
	const expSpeedPerHour = (typeof lunExpTrackerSpeed !== 'undefined' && lunExpTrackerSpeed > 0)
		? (lunExpTrackerSpeed * 3600)
		: (hoursElapsed > 0 ? (expGained / hoursElapsed) : 0);
	if (statsModalElements.expRateVal) {
		let displaySpeed = Math.round(expSpeedPerHour);
		if (displaySpeed >= 1000000) displaySpeed = (displaySpeed / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
		else if (displaySpeed >= 1000) displaySpeed = (displaySpeed / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
		else displaySpeed = displaySpeed.toLocaleString();
		statsModalElements.expRateVal.innerText = `${displaySpeed} / hr`;
	}

	if (statsModalElements.timeToLevelVal) {
		if (expSpeedPerHour > 0) {
			const expNeeded = Math.max(0, maxExp - currentExp);
			const hoursNeeded = expNeeded / expSpeedPerHour;
			if (hoursNeeded < 1) {
				const mins = Math.max(1, Math.round(hoursNeeded * 60));
				statsModalElements.timeToLevelVal.innerText = `~${mins} min`;
			} else {
				statsModalElements.timeToLevelVal.innerText = `~${hoursNeeded.toFixed(1)} hrs`;
			}
		} else {
			statsModalElements.timeToLevelVal.innerText = t("nextLevelNA");
		}
	}

	const curGold = lunLastGold ?? 0;
	const curElif = lunLastElif ?? 0;
	const curSpkCoin = lunLastSpkCoin ?? 0;
	if (statsModalElements.currencyBalancesVal) {
		statsModalElements.currencyBalancesVal.innerText = `💰 ${curGold.toLocaleString()} | 💎 ${curElif.toLocaleString()} | 🟣 ${curSpkCoin.toLocaleString()}`;
	}

	if (lunSessionStartGold === null && lunLastGold !== null) {
		lunSessionStartGold = lunLastGold;
	}
	const goldDiff = lunSessionStartGold !== null ? (curGold - lunSessionStartGold) : 0;
	const goldPerHour = hoursElapsed > 0 ? (goldDiff / hoursElapsed).toFixed(0) : 0;
	const goldPrefix = goldDiff >= 0 ? "+" : "";
	let gphFormatted = Number(goldPerHour).toLocaleString();
	if (Math.abs(goldPerHour) >= 1000) {
		gphFormatted = (goldPerHour / 1000).toFixed(1).replace(/\.0$/, '') + "k";
	}
	if (statsModalElements.goldGainedVal) {
		statsModalElements.goldGainedVal.innerText = `${goldPrefix}${goldDiff.toLocaleString()} (${goldPrefix}${gphFormatted} / hr)`;
		statsModalElements.goldGainedVal.style.color = goldDiff >= 0 ? "#ffd54a" : "#f87171";
	}

	if (lunSessionStartElif === null && lunLastElif !== null) {
		lunSessionStartElif = lunLastElif;
	}
	if (lunSessionStartSpkCoin === null && lunLastSpkCoin !== null) {
		lunSessionStartSpkCoin = lunLastSpkCoin;
	}
	const elifDiff = lunSessionStartElif !== null ? (curElif - lunSessionStartElif) : 0;
	const elifPerHour = hoursElapsed > 0 ? (elifDiff / hoursElapsed).toFixed(1) : "0";
	const elifPrefix = elifDiff >= 0 ? "+" : "";
	if (statsModalElements.elifGainedVal) {
		statsModalElements.elifGainedVal.innerText = `${elifPrefix}${elifDiff.toLocaleString()} (${elifPrefix}${elifPerHour} / hr)`;
		statsModalElements.elifGainedVal.style.color = elifDiff >= 0 ? "#67e8f9" : "#f87171";
	}
	
	const spkCoinDiff = lunSessionStartSpkCoin !== null ? (curSpkCoin - lunSessionStartSpkCoin) : 0;
	const spkCoinPerHour = hoursElapsed > 0 ? (spkCoinDiff / hoursElapsed).toFixed(1) : "0";
	const spkCoinPrefix = spkCoinDiff >= 0 ? "+" : "";
	if (statsModalElements.spkCoinGainedVal) {
		statsModalElements.spkCoinGainedVal.innerText = `${spkCoinPrefix}${spkCoinDiff.toLocaleString()} (${spkCoinPrefix}${spkCoinPerHour} / hr)`;
		statsModalElements.spkCoinGainedVal.style.color = spkCoinDiff >= 0 ? "#a78bfa" : "#f87171";
	}
}

function updateDynamicStyles() {
	let bgRule = "rgba(0, 0, 0, 0.75)";
	let blurRule = "blur(4px)";
	let filterRule = "none";
	switch(lunCameraEffect) {
		case "bw": filterRule = "grayscale(100%) contrast(110%)"; break;
		case "sepia": filterRule = "sepia(80%) saturate(140%) hue-rotate(-10deg) contrast(110%)"; break;
		case "morning": filterRule = "brightness(110%) contrast(110%) sepia(20%) hue-rotate(5deg) saturate(120%)"; break;
		case "dusk": filterRule = "brightness(90%) sepia(30%) hue-rotate(330deg) saturate(130%) contrast(120%)"; break;
		case "night": filterRule = "brightness(75%) contrast(120%) sepia(40%) hue-rotate(180deg) saturate(150%)"; break;
	}
	if (lunBgOpacity === "solid") {
		bgRule = "rgba(10, 10, 10, 0.95)";
		blurRule = "none";
	} else if (lunBgOpacity === "transparent") {
		bgRule = "rgba(0, 0, 0, 0.4)";
		blurRule = "none";
	} else if (lunBgOpacity === "superTransparent") {
		bgRule = "rgba(0, 0, 0, 0.15)";
		blurRule = "none";
	} else if (lunBgOpacity === "lightGlass") {
		bgRule = "rgba(0, 0, 0, 0.45)";
		blurRule = "blur(2px)";
	} else if (lunBgOpacity === "heavyGlass") {
		bgRule = "rgba(0, 0, 0, 0.85)";
		blurRule = "blur(8px)";
	}
	
	let bgImageRule = "none";
	const level = (typeof gameState !== 'undefined' && gameState.myStat && gameState.myStat.level) || 1;
	let isVip = false;
	const playerName = (typeof gameState !== 'undefined' && (gameState.myPlayerName || gameState.myStat?.name)) || document.querySelector('.sr-player-card__name')?.innerText?.trim() || "";
	if (playerName) {
		const n = playerName.toLowerCase();
		isVip = n === "glas" || n === "sp1cky" || n === "gmdt";
	}

	const urlBg10 = "https://i.imgur.com/SUqVcO5.png";
	const urlBg15 = "https://i.imgur.com/1jyUihh.png";
	const urlBg20 = "https://i.imgur.com/VOhPiYV.png";
	const urlBg25 = "https://i.imgur.com/Ue6kUK7.png";
	const urlBg30 = "https://i.imgur.com/HMXSjbC.png";
	const urlBg35 = "https://i.imgur.com/WSzIC0U.png";
	const urlBg40 = "https://i.imgur.com/NlRyXS3.jpeg";
	const urlBg45 = "https://i.imgur.com/UXdgxWx.png";
	const urlBg50 = "https://i.imgur.com/5Sw1BXu.png";

	if (lunHudBackground === "bg10" && (isVip || level >= 10)) bgImageRule = `url('${urlBg10}')`;
	else if (lunHudBackground === "bg15" && (isVip || level >= 15)) bgImageRule = `url('${urlBg15}')`;
	else if (lunHudBackground === "bg20" && (isVip || level >= 20)) bgImageRule = `url('${urlBg20}')`;
	else if (lunHudBackground === "bg25" && (isVip || level >= 25)) bgImageRule = `url('${urlBg25}')`;
	else if (lunHudBackground === "bg30" && (isVip || level >= 30)) bgImageRule = `url('${urlBg30}')`;
	else if (lunHudBackground === "bg35" && (isVip || level >= 35)) bgImageRule = `url('${urlBg35}')`;
	else if (lunHudBackground === "bg40" && (isVip || level >= 40)) bgImageRule = `url('${urlBg40}')`;
	else if (lunHudBackground === "bg45" && (isVip || level >= 45)) bgImageRule = `url('${urlBg45}')`;
	else if (lunHudBackground === "bg50" && (isVip || level >= 50)) bgImageRule = `url('${urlBg50}')`;
	else if (lunHudBackground === "custom") {
		const cUrl = (window.localStorage && localStorage.getItem("spkmod-custom-hud-bg")) || "";
		if (cUrl) bgImageRule = `url('${cUrl}')`;
	}

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
				#app { filter: ${filterRule}; }
		#app > *:not(:has(canvas)):not(canvas) { zoom: ${lunGameUiScale} !important; }
		#spkmod-hud, #spkmod-settings-modal, #spkmod-event-modal, #spkmod-patchnotes-modal, #spkmod-stats-modal { transform: scale(var(--spkmod-scale)); transform-origin: top left; }
		#spkmod-pq { transform: scale(var(--spkmod-scale)); transform-origin: top right; }
		#spkmod-main, #spkmod-pq, #spkmod-settings-modal, #spkmod-gamepad-modal, #spkmod-players-modal, #spkmod-event-modal, #spkmod-patchnotes-modal, #spkmod-stats-modal, .spkmod-panel-btn, .spkmod-panel-counter, .spkmod-panel-combo, #spkmod-discord-btn {
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
	const playerName = (typeof gameState !== 'undefined' && (gameState.myPlayerName || gameState.myStat?.name)) || document.querySelector('.sr-player-card__name')?.innerText?.trim() || "";
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

	if (lunHudBackground === "custom" || (window.localStorage && localStorage.getItem("spkmod-custom-hud-unlocked") === "true")) {
		options.push({ value: "custom", label: t("hudBgCustom") || "Custom URL", reqLevel: 0 });
	}
	
	let hasSelection = false;
	for (const opt of options) {
		const isUnlocked = isVip || level >= opt.reqLevel;
		if (isUnlocked || opt.value === "none" || opt.value === "custom") {
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
window.spkmodDroneKeys = { up: false, down: false, w: false, a: false, s: false, d: false };
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
		.sr-chatbox__sender.spkmod-friend-sender { color: #4dd0e1 !important; -webkit-text-fill-color: #4dd0e1 !important; font-weight: bold !important; text-shadow: 0 0 6px rgba(77, 208, 225, 0.45) !important; }
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
			width: 480px;
			max-width: 95vw;
			max-height: 85vh;
			overflow-y: auto;
			color: #FFF;
			background: #000C;
			border: ${spkmodBorderWidth} solid #DDD;
			border-radius: 8px;
			padding: 10px;
			gap: 8px;
			cursor: move;
			user-select: none;
		}
		.spkmod-settings-grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 10px;
		}
		@media (max-width: 500px) {
			.spkmod-settings-grid {
				grid-template-columns: 1fr;
			}
		}
		.spkmod-settings-col {
			display: flex;
			flex-direction: column;
			gap: 5px;
			background: rgba(255, 255, 255, 0.03);
			border: 1px solid rgba(255, 255, 255, 0.08);
			border-radius: 6px;
			padding: 8px;
		}
		.spkmod-settings-section-title {
			color: #ffd54a;
			font-size: 11px;
			font-weight: bold;
			border-bottom: 1px solid rgba(255, 255, 255, 0.15);
			padding-bottom: 4px;
			margin-bottom: 2px;
			user-select: none;
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
			cursor: var(--sr-cursor-minigame);
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
		#spkmod-gamepad-modal, #spkmod-players-modal, #spkmod-event-modal, #spkmod-patchnotes-modal, #spkmod-stats-modal {
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
		#spkmod-event-modal {
			width: 290px;
			max-width: 95vw;
		}
		#spkmod-patchnotes-modal {
			width: 380px;
			max-width: 95vw;
		}
		#spkmod-stats-modal {
			width: 240px;
			max-width: 95vw;
			padding: 8px;
			gap: 6px;
			cursor: move;
			user-select: none;
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
		#spkmod-hud.hidden, .hidden, #spkmod-pq.hidden, #spkmod-settings-modal.hidden, #spkmod-gamepad-modal.hidden, #spkmod-players-modal.hidden, #spkmod-event-modal.hidden, #spkmod-stats-modal.hidden {
			display: none !important;
		}
		body.spkmod-ui-hidden #spkmod-hud,
		body.spkmod-ui-hidden #spkmod-pq,
		body.spkmod-ui-hidden #spkmod-settings-modal,
		body.spkmod-ui-hidden #spkmod-event-modal,
		body.spkmod-ui-hidden #spkmod-patchnotes-modal,
		body.spkmod-ui-hidden #spkmod-gamepad-modal,
		body.spkmod-ui-hidden #spkmod-players-modal,
		body.spkmod-ui-hidden #spkmod-map-modal,
		body.spkmod-ui-hidden #spkmod-stats-modal,
		body.spkmod-ui-hidden #spkmod-news-modal,
		body.spkmod-ui-hidden #spkmod-translate-picker {
			display: none !important;
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

document.body.classList.remove("spkmod-ui-hidden");
lunHudElements.lowHpOverlay = buildElement("div", { id: "spkmod-low-hp-overlay" });
document.body.appendChild(lunHudElements.lowHpOverlay);

document.body.appendChild(
	lunHudElements.hud = buildElement("div", {
		id: "spkmod-hud",
		className: (typeof gameState === "undefined" || !gameState ? "hidden" : "")
	}, [
		buildElement("div", {
			id: "spkmod-main"
		}, [
			buildElement("div", { id: "spkmod-header-row", style: "cursor: move; user-select: none; touch-action: none;" }, [
				lunPanelElements.headerBtn = buildElement("span", {
					id: "spkmod-header",
					innerText: t("header"),
					style: "cursor: move; user-select: none; touch-action: none; display: inline-block;",
					onclick: _ => {
						if (lunHudElements.hud && lunHudElements.hud.dataset.justDragged === "true") {
							return;
						}
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
			lunHudElements.currencyTracker = buildElement("span", {
				innerText: t("currencyTracker", "--", "--"),
				style: lunCurrencyTrackerEnabled ? "" : "display: none;"
			}),
			lunHudElements.sessionGoldTracker = buildElement("span", {
				innerText: t("sessionGoldText", "--", "--"),
				style: lunSessionGoldTrackerEnabled ? "" : "display: none;"
			}),
			lunHudElements.channelTracker = buildElement("span", {
				innerText: "..."
			}),
			lunHudElements.fpsPingTracker = buildElement("span", {
				innerText: t("fpsPingText", "--", "--"),
				style: lunFpsPingEnabled ? "" : "display: none;"
			}),
			lunHudElements.resetTimerTracker = buildElement("span", {
				innerText: t("resetTimerText", "--", "--", "--"),
				style: lunResetTimerEnabled ? "" : "display: none;"
			}),
			lunHudElements.minigameTracker = buildElement("span", {
				innerText: t("minigameTrackerText", "--", "--"),
				style: lunMinigameTrackerEnabled ? "" : "display: none;"
			}),
			lunHudElements.footerMsg = buildElement("span", {
				id: "spkmod-footer",
				innerText: t("footerMsg"),
				style: "cursor: move; user-select: none;"
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
						if (typeof gameState !== "undefined" && gameState?.sendEmoteNow) {
							gameState.sendEmoteNow(Emotes.Dance || 8);
						}
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
				lunPanelElements.petDanceBtn = buildElement("button", {
					id: "spkmod-petdance-btn",
					className: "spkmod-panel-btn",
					innerText: t(window.PetDanceActive ? "petDanceOn" : "petDanceOff") || (window.PetDanceActive ? "Pet Dance: ⏸️" : "Pet Dance: ▶️"),
					value: "",
					onclick: e => {
						togglePetDance(e.target);
					}
				}),
				lunPanelElements.ritualBtn = buildElement("button", {
					id: "spkmod-ritual-btn",
					className: "spkmod-panel-btn",
					innerText: t(window.RitualState === 0 ? "ritualOff" : (window.RitualState === 1 ? "ritualOn" : "ritualInverted")),
					value: "",
					onclick: e => {
						toggleRitual(e.target);
					}
				}),
				lunPanelElements.partnerDanceBtn = buildElement("button", {
					id: "spkmod-partner-dance-btn",
					className: "spkmod-panel-btn",
					innerText: t(window.PartnerDanceState === 1 ? "partnerDanceOn" : (window.PartnerDanceState === 2 ? "partnerDanceInverted" : "partnerDanceOff")) || (window.PartnerDanceState === 0 ? "8 Dance: ▶️" : (window.PartnerDanceState === 1 ? "8 Dance: ⏸️" : "Rev 8: ⏸️")),
					value: "",
					onclick: e => {
						togglePartnerDance(e.target);
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
							window.HyperShakeActive = false;
							if (window.vibrateTimer) { clearInterval(window.vibrateTimer); window.vibrateTimer = null; }
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
							window.HyperShakeActive = false;
							if (window.vibrateTimer) { clearInterval(window.vibrateTimer); window.vibrateTimer = null; }
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
							window.HyperShakeActive = false;
							if (window.vibrateTimer) { clearInterval(window.vibrateTimer); window.vibrateTimer = null; }
							window.ReverseBeyBladeActive = false;
							if (gameState && gameState.playerContainer) {
								window.moonwalkLockedYaw = gameState.playerContainer.rotation.y;
							}
							updateMovementButtonsUI();
							chatLog(t("moonwalkActivatedMsg"));
						} else {
							window.moonwalkLockedYaw = null;
							updateMovementButtonsUI();
							if (gameState && gameState.playerContainer && gameState.cameraController) {
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
							} else if (gameState && gameState.remotePlayers && gameState.remotePlayers.remotePlayers && gameState.remotePlayers.remotePlayers.size > 0) {
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
							window.SuperShakeActive = false;
							window.HyperShakeActive = false;
							if (window.vibrateTimer) { clearInterval(window.vibrateTimer); window.vibrateTimer = null; }
							window.MoonwalkActive = false;
							window.ReverseBeyBladeActive = false;
							if (typeof updateReverseBeyBladeButtonText === "function") updateReverseBeyBladeButtonText(); 
							chatLog(t("beybladeActivatedMsg", window.BeyBladeSpeed || 1));
						} else {
							if (typeof updateReverseBeyBladeButtonText === "function") updateReverseBeyBladeButtonText(); 
							if (gameState && gameState.playerContainer && gameState.cameraController) {
								gameState.playerContainer.rotation.y = gameState.cameraController.cameraYaw;
								gameState.moveSendAccumulator = 1;
							}

							if (window.wasDancing) {
								setTimeout(() => {
									if (typeof gameState !== "undefined" && gameState?.sendEmoteNow) {
										gameState.sendEmoteNow(Emotes.Dance);
									}
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
							window.SuperShakeActive = false;
							window.HyperShakeActive = false;
							if (window.vibrateTimer) { clearInterval(window.vibrateTimer); window.vibrateTimer = null; }
							window.MoonwalkActive = false;
							updateBeyBladeButtonText();
							chatLog(t("reversebeybladeActivatedMsg", window.BeyBladeSpeed || 1));
						} else {
							if (gameState && gameState.playerContainer && gameState.cameraController) {
								gameState.playerContainer.rotation.y = gameState.cameraController.cameraYaw;
								gameState.moveSendAccumulator = 1;
							}

							if (window.wasDancing) {
								setTimeout(() => {
									if (typeof gameState !== "undefined" && gameState?.sendEmoteNow) {
										gameState.sendEmoteNow(Emotes.Dance);
									}
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
						if (gameState && gameState.playerContainer && gameState.cameraController) {
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
					innerText: t(window.TurntableActive === 1 ? "turntableOn" : (window.TurntableActive === 2 ? "turntableHalf" : "turntableOff")),
					value: "",
					onclick: e => {
						toggleTurntable(e.target);
					}
				})
			]),

			buildElement("div", { className: "spkmod-panel-cat" }, [
				lunPanelElements.nametagsBtn = buildElement("button", {
					className: "spkmod-panel-btn",
					innerText: t("showAllNametagsBtn"),
					value: "",
					onclick: () => {
						lunNametagMode = (lunNametagMode + 1) % 4;
						if (lunNametagMode === 2) {
							fetchFriendsList(true);
						}
						if (lunPanelElements.nametagsBtn) {
							setText(lunPanelElements.nametagsBtn, t(NAMETAG_MODES[lunNametagMode] + "Btn"));
						}
					}
				}),
				lunPanelElements.chowayoBtn = buildElement("button", {
					id: "spkmod-autochowayo-btn",
					className: "spkmod-panel-btn",
					innerText: t(window.AutoChowayoActive ? "autoChowayoOn" : "chowayo"),
					value: "",
					onclick: e => {
						window.AutoChowayoActive = !window.AutoChowayoActive;
						if (window.AutoChowayoActive) {
							chatLog(t("autoChowayoActivatedMsg") || "Auto Chowayo activated!");
							autoChowayoLoop();
						} else {
							chatLog(t("autoChowayoDeactivatedMsg") || "Auto Chowayo deactivated.");
							clearTimeout(window.__autoChowayoTimeoutId);
						}
						setText(e.target, t(window.AutoChowayoActive ? "autoChowayoOn" : "chowayo"));
					}
				})
			]),

			lunPanelElements.resetCameraBtn = buildElement("button", {
				className: "spkmod-panel-btn hidden",
				innerText: t("resetCamera"),
				value: "",
				onclick: _ => {
					watchPlayer();
					stopStare();
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
							if (typeof gameState !== "undefined" && gameState?.cameraController) {
								gameState.cameraController.cameraZoomDistance = 3;
								gameState.cameraController.cameraPitch = lunFirstPersonPitch;
								lunViewClip = true;
								if (lunPanelElements.viewClipBtn) setText(lunPanelElements.viewClipBtn, t("viewClipOn"));
							}
							if (typeof gameState !== "undefined" && gameState?.playerContainer) {
								const remoteContainers = gameState.remotePlayers?.remotePlayers ? 
									Array.from(gameState.remotePlayers.remotePlayers.values()).map(rp => rp.container) : [];
								gameState.playerContainer.children.forEach(c => {
									if (!remoteContainers.includes(c)) c.visible = false;
								});
							}
						} else {
							if (typeof gameState !== "undefined" && gameState?.playerContainer) {
								const remoteContainers = gameState.remotePlayers?.remotePlayers ? 
									Array.from(gameState.remotePlayers.remotePlayers.values()).map(rp => rp.container) : [];
								gameState.playerContainer.children.forEach(c => {
									if (!remoteContainers.includes(c)) c.visible = true;
								});
							}
							if (typeof gameState !== "undefined" && gameState?.cameraController) {
								gameState.cameraController.cameraZoomDistance = 12;
								lunViewClip = false;
								if (lunPanelElements.viewClipBtn) setText(lunPanelElements.viewClipBtn, t("viewClipOff"));
							}
						}
					}
				}),
				lunPanelElements.hyperShakeBtn = buildElement("button", {
					id: "spkmod-hypershake-main-btn",
					className: "spkmod-panel-btn",
					innerText: window.HyperShakeActive ? t("hyperShakeOn") : t("hyperShakeOff"),
					value: "",
					onclick: e => {
						window.HyperShakeActive = !window.HyperShakeActive;

						if (window.HyperShakeActive) {
							window.ShakeActive = false;
							window.SuperShakeActive = false;
							window.BeyBladeActive = false;
							window.MoonwalkActive = false;
							window.ReverseBeyBladeActive = false;
							if (window.vibrateTimer) clearInterval(window.vibrateTimer);
							window.vibrateTimer = setInterval(() => {
								if (!gameState || !gameState.playerContainer) return;
								const base = gameState.cameraController?.cameraYaw || 0;
								gameState.playerContainer.rotation.y = base + (Math.random() - 0.5) * 1.5;
								gameState.moveSendAccumulator = 1;
							}, 25);
							updateMovementButtonsUI();
							chatLog(t("hyperShakeActivatedMsg"));
						} else {
							if (window.vibrateTimer) {
								clearInterval(window.vibrateTimer);
								window.vibrateTimer = null;
							}
							updateMovementButtonsUI();
							if (gameState.playerContainer && gameState.cameraController) {
								gameState.playerContainer.rotation.y = gameState.cameraController.cameraYaw;
								gameState.moveSendAccumulator = 1;
							}
							chatLog(t("hyperShakeDeactivatedMsg"));
						}
					}
				}),
				lunPanelElements.freeCamBtn = buildElement("button", {
					className: "spkmod-panel-btn",
					innerText: t("freeCamOff"),
					style: "flex: 1;",
					onclick: e => {
						lunDroneModeActive = !lunDroneModeActive;
						setText(e.target, t(lunDroneModeActive ? "freeCamOn" : "freeCamOff"));
						if (lunDroneModeActive) {
							lunFirstPersonActive = false;
							if (lunPanelElements.firstPersonBtn) setText(lunPanelElements.firstPersonBtn, t("firstPersonOff"));
							if (gameState.playerContainer) {
								const remoteContainers = gameState.remotePlayers?.remotePlayers ? 
									Array.from(gameState.remotePlayers.remotePlayers.values()).map(rp => rp.container) : [];
								gameState.playerContainer.children.forEach(c => {
									if (!remoteContainers.includes(c)) c.visible = true;
								});
							}
							if (gameState.playerContainer && gameState.cameraController) {
								window.spkmodDroneTarget = { position: { x: gameState.playerContainer.position.x, y: gameState.playerContainer.position.y, z: gameState.playerContainer.position.z } };
								gameState.cameraController.target = window.spkmodDroneTarget;
								
								if (!gameState.cameraController._spkmodPatchedUpdate) {
									const origUpdate = gameState.cameraController.update;
									gameState.cameraController.update = function(dt) {
										if (lunDroneModeActive && window.spkmodDroneTarget) {
											const now = performance.now();
											window.lunDroneLastFrame = window.lunDroneLastFrame || now;
											const dtNormalized = Math.min(now - window.lunDroneLastFrame, 100) / 16.666;
											window.lunDroneLastFrame = now;

											let targetVX = 0;
											let targetVZ = 0;
											let targetVY = 0;

											if (typeof gamepadMoveVector !== 'undefined' && gamepadMoveVector) {
												targetVX = gamepadMoveVector.x;
												targetVZ = gamepadMoveVector.z;
											} else {
												let lx = 0, ly = 0;
												if (window.spkmodDroneKeys) {
													if (window.spkmodDroneKeys.w) ly -= 1;
													if (window.spkmodDroneKeys.s) ly += 1;
													if (window.spkmodDroneKeys.a) lx -= 1;
													if (window.spkmodDroneKeys.d) lx += 1;
												}
												if (lx !== 0 || ly !== 0) {
													const camYaw = this.cameraYaw || 0;
													targetVX = lx * Math.cos(camYaw) + ly * Math.sin(camYaw);
													targetVZ = -lx * Math.sin(camYaw) + ly * Math.cos(camYaw);
													const mag = Math.sqrt(targetVX * targetVX + targetVZ * targetVZ);
													targetVX /= mag;
													targetVZ /= mag;
												}
											}

											if (window.spkmodDroneKeys) {
												if (window.spkmodDroneKeys.up) targetVY += 1;
												if (window.spkmodDroneKeys.down) targetVY -= 1;
											}
											
											window.lunDroneVX = window.lunDroneVX || 0;
											window.lunDroneVZ = window.lunDroneVZ || 0;
											window.lunDroneVY = window.lunDroneVY || 0;
											
											const lerp = 1 - Math.pow(0.7, Math.max(0.001, dtNormalized));
											window.lunDroneVX += (targetVX - window.lunDroneVX) * lerp;
											window.lunDroneVZ += (targetVZ - window.lunDroneVZ) * lerp;
											window.lunDroneVY += (targetVY - window.lunDroneVY) * lerp;
											
											const speed = ((typeof window.lunDroneSpeed !== 'undefined' ? window.lunDroneSpeed : (typeof lunDroneSpeed !== 'undefined' ? lunDroneSpeed : 0.10)));
											
											// Stop completely if the velocity is extremely small to prevent endless micro-drifting
											if (Math.abs(window.lunDroneVX) < 0.001) window.lunDroneVX = 0;
											if (Math.abs(window.lunDroneVZ) < 0.001) window.lunDroneVZ = 0;
											if (Math.abs(window.lunDroneVY) < 0.001) window.lunDroneVY = 0;
											
											window.spkmodDroneTarget.position.x += window.lunDroneVX * speed * dtNormalized;
											window.spkmodDroneTarget.position.z += window.lunDroneVZ * speed * dtNormalized;
											window.spkmodDroneTarget.position.y += window.lunDroneVY * speed * dtNormalized;
										}
										
										origUpdate.call(this, dt);
										
										if (lunDroneModeActive && typeof this.snapToTarget === "function") {
											this.snapToTarget();
										}
									};
									gameState.cameraController._spkmodPatchedUpdate = true;
								}
								
								// Debugging hooks
								console.log("[DroneMode] Activated. Target:", window.spkmodDroneTarget);
								window.spkmodDebugCamera = () => {
									console.log("Camera Yaw:", gameState.cameraController.cameraYaw);
									console.log("Camera Pitch:", gameState.cameraController.cameraPitch);
									console.log("Camera Zoom:", gameState.cameraController.cameraZoomDistance);
									console.log("Camera Target:", gameState.cameraController.target);
									console.log("Camera Position:", gameState.cameraController.camera.position);
									console.log("Drone Keys:", window.spkmodDroneKeys);
								};
								chatLog("Drone Mode ON (Run spkmodDebugCamera() in console to debug)");
							}
						} else {
							if (gameState.cameraController && gameState.playerContainer) {
								gameState.cameraController.target = gameState.playerContainer;
								console.log("[DroneMode] Deactivated. Target restored to player.");
								chatLog("Drone Mode OFF");
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
				})
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
					title: t("settingsBtnTooltip"),
					onclick: _ => {
						toggleSettingsModal();
					}
				}),
				lunPanelElements.hotkeysBtn = buildElement("button", {
					id: "spkmod-hotkeys-btn",
					className: "spkmod-panel-btn",
					style: "flex: 0 0 32px; width: 32px; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 12pt; cursor: pointer;",
					innerText: "⌨️",
					title: t("hotkeysModalTitle") || "Hotkeys",
					onclick: _ => {
						toggleHotkeysModal();
					}
				}),
				lunPanelElements.patchNotesBtn = buildElement("button", {
					id: "spkmod-patchnotes-btn",
					className: "spkmod-panel-btn",
					style: "flex: 0 0 32px; width: 32px; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 12pt; cursor: pointer;",
					innerText: "📰",
					title: t("patchNotesBtnTooltip"),
					onclick: _ => {
						togglePatchNotesModal();
					}
				}),
				lunPanelElements.eventBtn = buildElement("button", {
					id: "spkmod-event-btn",
					className: "spkmod-panel-btn",
					style: "flex: 0 0 32px; width: 32px; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 12pt; cursor: pointer;",
					innerText: "🎉",
					title: t("eventInfoBtnTooltip"),
					onclick: _ => {
						toggleEventModal();
					}
				}),
				lunPanelElements.mapBtn = buildElement("button", {
					id: "spkmod-map-btn",
					className: "spkmod-panel-btn",
					style: "flex: 0 0 32px; width: 32px; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 12pt; cursor: pointer;",
					innerText: "🗺️",
					title: t("mapModalTitle"),
					onclick: _ => {
						toggleMapModal();
					}
				}),
				lunPanelElements.statsBtn = buildElement("button", {
					id: "spkmod-stats-btn",
					className: "spkmod-panel-btn",
					style: "flex: 0 0 32px; width: 32px; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 12pt; cursor: pointer;",
					innerText: "⏱️",
					title: t("statsBtnTooltip"),
					onclick: _ => {
						toggleStatsModal();
					}
				}),
				lunPanelElements.dragBtn = buildElement("button", {
					id: "spkmod-drag-btn",
					className: "spkmod-panel-btn",
					style: "flex: 0 0 32px; width: 32px; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 12pt; cursor: grab;",
					innerText: "⚓",
					title: t("dragMenuTooltip")
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
		buildElement("div", { className: "spkmod-panel-cat", style: "justify-content: space-between; align-items: center;" }, [
			buildElement("div", { style: "display: flex; align-items: center; gap: 8px;" }, [
				lunPanelElements.settingsHeader = buildElement("span", {
					innerText: t("settingsHeader"),
					style: "font-weight: bold;"
				}),
				buildElement("button", {
					id: "spkmod-settings-accounts-btn",
					className: "spkmod-panel-btn",
					style: "padding: 2px 6px; font-size: 11px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;",
					innerText: "🔑 " + t("quickLoginTitle"),
					title: t("accountMgrBtnTooltip"),
					onclick: (e) => {
						e.preventDefault();
						e.stopPropagation();
						if (typeof toggleQuickLoginSettings === "function") {
							toggleQuickLoginSettings();
						}
					}
				})
			]),
			buildElement("span", {
				id: "spkmod-settings-close",
				innerText: "✕",
				onclick: _ => {
					lunHudElements.settingsModal.classList.add("hidden");
					if (typeof toggleQuickLoginSettings === "function") {
						toggleQuickLoginSettings(false);
					}
				}
			})
		]),
		buildElement("div", { className: "spkmod-settings-grid" }, [
			buildElement("div", { className: "spkmod-settings-col" }, [
				lunPanelElements.settingsCatGeneral = buildElement("span", {
					className: "spkmod-settings-section-title",
					innerText: "💬 " + t("settingsCatGeneral")
				}),
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
					lunPanelElements.verboseChatToggleLabel = buildElement("span", {
						style: "color: #fff; font-size: 11px; font-weight: bold; user-select: none; flex: 1;",
						innerText: t("hideVerboseChatToggleLabel") || "Hide Mod Chat Messages"
					}),
					lunPanelElements.verboseChatToggleInput = buildElement("input", {
						type: "checkbox",
						checked: lunHideVerboseChat,
						onchange: e => {
							setHideVerboseChat(e.target.checked);
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
					lunPanelElements.friendChatToggleLabel = buildElement("span", {
						style: "color: #fff; font-size: 11px; font-weight: bold; user-select: none; flex: 1;",
						innerText: t("friendChatToggleLabel")
					}),
					lunPanelElements.friendChatToggleInput = buildElement("input", {
						type: "checkbox",
						checked: lunFriendChatHighlightEnabled,
						onchange: e => {
							setFriendChatHighlightEnabled(e.target.checked);
							if (e.target.checked) fetchFriendsList(true);
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
					lunPanelElements.hideKnownBotsLabel = buildElement("span", {
						style: "color: #fff; font-size: 11px; font-weight: bold; user-select: none; flex: 1;",
						innerText: t("hideKnownBotsToggleLabel")
					}),
					lunPanelElements.hideKnownBotsToggleInput = buildElement("input", {
						type: "checkbox",
						checked: lunHideKnownBotsEnabled,
						onchange: e => setHideKnownBotsEnabled(e.target.checked)
					})
				]),
				buildElement("div", { className: "spkmod-panel-cat" }, [
					lunPanelElements.chatTimestampLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("chatTimestampToggleLabel") }),
					lunPanelElements.chatTimestampToggleInput = buildElement("input", { type: "checkbox", checked: lunChatTimestampsEnabled, onchange: e => setChatTimestampsEnabled(e.target.checked) })
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
					lunPanelElements.outgoingTranslateLabel = buildElement("span", {
						style: "color: #fff; font-size: 11px; font-weight: bold; user-select: none; flex: 1;",
						innerText: t("outgoingTranslateLabel")
					}),
					lunPanelElements.outgoingTranslateSelect = buildElement("select", {
						className: "spkmod-panel-combo",
						value: lunOutgoingSourceLang,
						onchange: e => setOutgoingSourceLang(e.target.value)
					}, [
						{ value: "auto", label: t("outgoingTranslateAuto") },
						{ value: "en", label: "English" },
						{ value: "ja", label: "日本語" },
						{ value: "ko", label: "한국어" },
						{ value: "zh-TW", label: "繁體中文" },
						{ value: "zh-CN", label: "简体中文" },
						{ value: "es", label: "Español" },
						{ value: "fr", label: "Français" },
						{ value: "de", label: "Deutsch" },
						{ value: "pt", label: "Português" },
						{ value: "ru", label: "Русский" }
					].map(item => buildElement("option", {
						value: item.value,
						innerText: item.label,
						selected: item.value === lunOutgoingSourceLang
					})))
				]),
				buildElement("div", { className: "spkmod-panel-cat" }, [
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
					lunPanelElements.gamepadRumbleLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("gamepadRumbleToggleLabel") }),
					lunPanelElements.gamepadRumbleToggleInput = buildElement("input", { type: "checkbox", checked: lunGamepadRumbleEnabled, onchange: e => setGamepadRumbleEnabled(e.target.checked) })
				])
			]),

			buildElement("div", { className: "spkmod-settings-col" }, [
				lunPanelElements.settingsCatHUD = buildElement("span", {
					className: "spkmod-settings-section-title",
					innerText: "📊 " + t("settingsCatHUD")
				}),
				buildElement("div", { className: "spkmod-panel-cat" }, [
					lunPanelElements.currencyTrackerLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("currencyTrackerToggleLabel") }),
					lunPanelElements.currencyTrackerToggleInput = buildElement("input", { type: "checkbox", checked: lunCurrencyTrackerEnabled, onchange: e => setCurrencyTrackerEnabled(e.target.checked) })
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
					lunPanelElements.resetTimerLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("resetTimerToggleLabel") }),
					lunPanelElements.resetTimerToggleInput = buildElement("input", { type: "checkbox", checked: lunResetTimerEnabled, onchange: e => setResetTimerEnabled(e.target.checked) })
				]),
				buildElement("div", { className: "spkmod-panel-cat" }, [
					lunPanelElements.minigameTrackerLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("minigameTrackerToggleLabel") }),
					lunPanelElements.minigameTrackerToggleInput = buildElement("input", { type: "checkbox", checked: lunMinigameTrackerEnabled, onchange: e => setMinigameTrackerEnabled(e.target.checked) })
				]),
				buildElement("div", { className: "spkmod-panel-cat" }, [
					lunPanelElements.expRateUnitLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("expRateUnitToggleLabel") }),
					buildElement("input", { type: "checkbox", checked: lunExpRatePerHour, onchange: e => setExpRatePerHour(e.target.checked) })
				]),
				buildElement("div", { className: "spkmod-panel-cat" }, [
					lunPanelElements.expRateIntervalLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("expRateIntervalLabel") }),
					lunPanelElements.expRateIntervalSelect = buildElement("select", { className: "spkmod-panel-combo", value: String(lunExpIntervalMinutes), onchange: e => setExpIntervalMinutes(e.target.value) },
						LUN_EXP_INTERVAL_OPTIONS.map(minutes => buildElement("option", { value: String(minutes), innerText: t("expRateIntervalOption", minutes), selected: minutes === lunExpIntervalMinutes }))
					)
				]),
				buildElement("div", { className: "spkmod-panel-cat" }, [
					lunPanelElements.uiScaleLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("uiScaleLabel") }),
					lunPanelElements.uiScaleSlider = buildElement("input", { type: "range", min: "0.8", max: "1.3", step: "0.05", value: lunUiScale, style: "width: 70px;", onchange: e => { lunUiScale = e.target.value; updateDynamicStyles(); } })
				]),
				buildElement("div", { className: "spkmod-panel-cat" }, [
					lunPanelElements.cameraEffectLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("cameraEffectLabel") || "Camera Effect" }),
					lunPanelElements.cameraEffectSelect = buildElement("select", { className: "spkmod-panel-combo", value: lunCameraEffect, onchange: e => { lunCameraEffect = e.target.value; if (window.localStorage) localStorage.setItem("spkmod-camera-effect", lunCameraEffect); updateDynamicStyles(); } }, [
						buildElement("option", { value: "none", innerText: t("effectNone") || "Normal" }),
						buildElement("option", { value: "bw", innerText: t("effectBw") || "Black & White" }),
						buildElement("option", { value: "sepia", innerText: t("effectSepia") || "Sepia" }),
						buildElement("option", { value: "morning", innerText: t("effectMorning") || "Morning" }),
						buildElement("option", { value: "dusk", innerText: t("effectDusk") || "Dusk / Dawn" }),
						buildElement("option", { value: "night", innerText: t("effectNight") || "Night" })
					])
				]),
				buildElement("div", { className: "spkmod-panel-cat" }, [
					lunPanelElements.gameUiScaleLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("gameUiScaleLabel") || "Game UI Scale" }),
					lunPanelElements.gameUiScaleSlider = buildElement("input", { type: "range", min: "0.5", max: "2", step: "0.05", value: lunGameUiScale, style: "width: 70px;", onchange: e => { 
						lunGameUiScale = e.target.value; 
						if (window.localStorage) localStorage.setItem("spkmod-uiscale", lunGameUiScale);
						const appEl = document.getElementById("app");
						if (appEl) appEl.style.zoom = ""; // Clear old buggy zoom
						if (typeof updateDynamicStyles === "function") updateDynamicStyles();
					} })
				]),
				buildElement("div", { className: "spkmod-panel-cat" }, [
					lunPanelElements.droneSpeedLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: (t("droneSpeedLabel") || "Drone Speed") + ": x" + (((typeof window.lunDroneSpeed !== 'undefined' ? window.lunDroneSpeed : (typeof lunDroneSpeed !== 'undefined' ? lunDroneSpeed : 0.10))).toFixed(2)) }),
					lunPanelElements.droneSpeedInput = buildElement("input", { type: "range", min: "0.01", max: "2.0", step: "0.05", value: ((typeof window.lunDroneSpeed !== 'undefined' ? window.lunDroneSpeed : (typeof lunDroneSpeed !== 'undefined' ? lunDroneSpeed : 0.10))), style: "width: 70px;", oninput: e => { 
						lunDroneSpeed = parseFloat(e.target.value);
						window.lunDroneSpeed = lunDroneSpeed;
						if (lunPanelElements.droneSpeedLabel) lunPanelElements.droneSpeedLabel.innerText = (t("droneSpeedLabel") || "Drone Speed") + ": x" + lunDroneSpeed.toFixed(2);
						if (window.localStorage) localStorage.setItem("spkmod-drone-speed", lunDroneSpeed);
					} })
				]),
				buildElement("div", { className: "spkmod-panel-cat" }, [
					lunPanelElements.bgOpacityLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("bgOpacityLabel") }),
					lunPanelElements.bgOpacitySelect = buildElement("select", { className: "spkmod-panel-combo", value: lunBgOpacity, onchange: e => { lunBgOpacity = e.target.value; updateDynamicStyles(); } }, [
						buildElement("option", { value: "solid", innerText: t("bgOpacitySolid"), selected: lunBgOpacity === "solid" }),
						buildElement("option", { value: "transparent", innerText: t("bgOpacityTransparent"), selected: lunBgOpacity === "transparent" }),
						buildElement("option", { value: "superTransparent", innerText: t("bgOpacitySuperTransparent") || "Super Transparent", selected: lunBgOpacity === "superTransparent" }),
						buildElement("option", { value: "glass", innerText: t("bgOpacityGlass"), selected: lunBgOpacity === "glass" }),
						buildElement("option", { value: "lightGlass", innerText: t("bgOpacityLightGlass") || "Light Glass", selected: lunBgOpacity === "lightGlass" }),
						buildElement("option", { value: "heavyGlass", innerText: t("bgOpacityHeavyGlass") || "Heavy Glass", selected: lunBgOpacity === "heavyGlass" })
					])
				]),
				buildElement("div", { className: "spkmod-panel-cat" }, [
					lunPanelElements.hudBgLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("hudBackgroundLabel") }),
					lunPanelElements.hudBgSelect = buildElement("select", { className: "spkmod-panel-combo", value: lunHudBackground, onchange: e => { 
						lunHudBackground = e.target.value; 
						if (lunPanelElements.customBgContainer) {
							if (lunHudBackground === "custom") lunPanelElements.customBgContainer.classList.remove("hidden");
							else lunPanelElements.customBgContainer.classList.add("hidden");
						}
						updateDynamicStyles(); 
					} })
				]),
				lunPanelElements.customBgContainer = buildElement("div", { 
					className: "spkmod-panel-cat" + (lunHudBackground === "custom" ? "" : " hidden"),
					style: "margin-top: 2px;"
				}, [
					buildElement("span", { style: "color: #aaa; font-size: 10px; flex: 1;", innerText: "URL:" }),
					lunPanelElements.customBgInput = buildElement("input", { 
						type: "text", 
						value: (window.localStorage && localStorage.getItem("spkmod-custom-hud-bg")) || "",
						style: "width: 100px; background: #222; color: #fff; border: 1px solid #444; border-radius: 3px; font-size: 10px; padding: 2px;",
						oninput: e => {
							if (window.localStorage) localStorage.setItem("spkmod-custom-hud-bg", e.target.value);
							updateDynamicStyles();
						}
					})
				]),
				buildElement("div", { className: "spkmod-panel-cat" }, [
					lunPanelElements.accentColorLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("accentColorLabel") }),
					lunPanelElements.accentColorInput = buildElement("input", { type: "color", value: lunAccentColor, style: "width: 40px; height: 20px; padding: 0; border: none; background: none; cursor: pointer;", onchange: e => { lunAccentColor = e.target.value; updateDynamicStyles(); } }),
					lunPanelElements.accentColorConfirmBtn = buildElement("button", { className: "spkmod-panel-btn", style: "padding: 0px 4px; font-size: 10px; margin-left: 4px;", innerText: t("confirmBtn") || "OK", onclick: () => { lunAccentColor = lunPanelElements.accentColorInput.value; updateDynamicStyles(); } })
				])
			])
		]),

		buildElement("div", { className: "spkmod-panel-cat", style: "gap: 4px; margin-top: 4px;" }, [
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
								alert(t("settingsImportSuccess"));
								location.reload();
							} catch (err) { alert(t("settingsImportInvalid")); }
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
			style: "color: #aaa; font-size: 10px; margin-top: 4px; white-space: pre-wrap; line-height: 1.4; border-top: 1px solid #555; padding-top: 4px; user-select: none; cursor: pointer;",
			innerText: t("credits"),
			onclick: _ => {
				const now = Date.now();
				if (now - (window.__spkmodGlasLastClick || 0) > 3000) window.__spkmodGlasClicks = 0;
				window.__spkmodGlasLastClick = now;
				window.__spkmodGlasClicks = (window.__spkmodGlasClicks || 0) + 1;
				if (window.__spkmodGlasClicks >= 3) {
					if (window.localStorage) {
						localStorage.setItem("spkmod-gamepad-unlocked", "true");
						localStorage.setItem("spkmod-custom-hud-unlocked", "true");
					}
					if (lunPanelElements.gamepadSettingsBtn) {
						lunPanelElements.gamepadSettingsBtn.classList.remove("hidden");
					}
					lunHudBackground = "custom";
					updateHudBgDropdown();
					if (lunPanelElements.customBgContainer) {
						lunPanelElements.customBgContainer.classList.remove("hidden");
					}
					updateDynamicStyles();
					chatLog(t("gamepadUnlockedMsg"));
					window.__spkmodGlasClicks = 0;
				}
			}
		})

	])
);
setTimeout(() => {
	if (typeof makeDraggable === 'function' && lunHudElements.settingsModal) {
		makeDraggable(lunHudElements.settingsModal, [lunHudElements.settingsModal]);
	}
}, 500);

const lunJumpAnimMs = 500;

function autoJumpLoop() {
	if (!window.AutoJumpActive) return;
	if (typeof gameState !== "undefined" && gameState && typeof gameState.sendEmoteNow === "function") {
		gameState.sendEmoteNow(Emotes.Jump);
	}
	window.__autoJumpTimeoutId = setTimeout(autoJumpLoop, lunJumpAnimMs);
}

const lunHeartsAnimMs = 1100; // Debounce window is 1100ms; 1100ms pushes the limit of no dropped packets on server/clients

function triggerHearts() {
	if (gameState && gameState.bloomEffects && typeof gameState.bloomEffects.spawnHearts === "function") {
		if (gameState.playerContainer) {
			gameState.bloomEffects.spawnHearts(gameState.playerContainer);
		}
		if (lunFollowTargetName && gameState.remotePlayers && gameState.remotePlayers.remotePlayers) {
			const tp = Array.from(gameState.remotePlayers.remotePlayers.values()).find(t => t.info && t.info.name === lunFollowTargetName);
			if (tp && tp.container && tp.container !== gameState.playerContainer) {
				gameState.bloomEffects.spawnHearts(tp.container);
			}
		}
	}
	if (gameState && typeof gameState.sendEmoteNow === "function") {
		// If Pet Dance is active, don't interrupt the dance emote with StrokeBloom!
		if (!window.PetDanceActive) {
			gameState.sendEmoteNow(Emotes.StrokeBloom);
		}
	}
}

function autoHeartsLoop() {
	if (!window.AutoHeartsActive) return;
	triggerHearts();
	window.__autoHeartsTimeoutId = setTimeout(autoHeartsLoop, lunHeartsAnimMs);
}

window.AutoChowayoActive = false;
window.__autoChowayoTimeoutId = null;
const lunChowayoAnimMs = 2800; // tuned for sync

function autoChowayoLoop() {
	if (!window.AutoChowayoActive) return;
	if (gameState && typeof gameState.sendEmoteNow === "function") {
		gameState.sendEmoteNow(Emotes.MinigameJoayo);
	}
	window.__autoChowayoTimeoutId = setTimeout(autoChowayoLoop, lunChowayoAnimMs);
}

window.PetDanceActive = false;
let petDanceInterval = null;
let petDanceTick = 0;

function petDanceLoop() {
	if (!window.PetDanceActive) return;
	
	petDanceTick++;
	
	if (petDanceTick % 7 === 0) {
		if (typeof gameState !== "undefined" && gameState?.sendEmoteNow) {
			gameState.sendEmoteNow(Emotes.StrokeBloom);
		}
	}
	
	if (petDanceTick % 90 === 0) {
		if (typeof gameState !== "undefined" && gameState?.sendEmoteNow) {
			gameState.sendEmoteNow(Emotes.Dance);
		}
	}
}

function togglePetDance(btn) {
	window.PetDanceActive = !window.PetDanceActive;
	if (window.PetDanceActive) {
		petDanceTick = 0;
		if (petDanceInterval) clearInterval(petDanceInterval);
		petDanceInterval = setInterval(petDanceLoop, 100);
		
		if (!window.AutoHeartsActive) {
			window.AutoHeartsActive = true;
			chatLog(t("autoHeartsActivatedMsg") || "Auto Hearts activated!");
			if (typeof autoHeartsLoop === "function") autoHeartsLoop();
			const heartsBtn = typeof lunPanelElements !== "undefined" ? lunPanelElements.autoHeartsBtn : null;
			if (heartsBtn) setText(heartsBtn, t("autoHeartsOn") || "Auto Hearts: ON");
		}
		
		if (typeof gameState !== "undefined" && gameState?.sendEmoteNow) {
			gameState.sendEmoteNow(Emotes.Dance);
		}
		
		chatLog(t("petDanceActivatedMsg") || "Pet Dance combo activated!");
		chatLog(t("petDanceReminderMsg") || "Note: The petting combo is only fully visible to other players!");
	} else {
		if (petDanceInterval) {
			clearInterval(petDanceInterval);
			petDanceInterval = null;
		}
		// Disable auto hearts when pet dance is turned off
		if (window.AutoHeartsActive) {
			window.AutoHeartsActive = false;
			clearTimeout(window.__autoHeartsTimeoutId);
			const heartsBtn = typeof lunPanelElements !== "undefined" ? lunPanelElements.autoHeartsBtn : null;
			if (heartsBtn) setText(heartsBtn, t("autoHeartsOff") || "Auto Hearts: OFF");
		}
		
		chatLog(t("petDanceDeactivatedMsg") || "Pet Dance deactivated.");
	}
	
	const targetBtn = btn || (typeof lunPanelElements !== "undefined" && lunPanelElements.petDanceBtn);
	if (targetBtn) {
		setText(targetBtn, t(window.PetDanceActive ? "petDanceOn" : "petDanceOff") || (window.PetDanceActive ? "Pet Dance: ⏸️" : "Pet Dance: ▶️"));
	}
}



window.RitualState = 0;
let ritualCenter = null;
let ritualEmoteTick = 0;
const RITUAL_RADIUS = 1.4;

function toggleRitual(btn) {
	window.RitualState = (window.RitualState + 1) % 3;
	if (window.RitualState > 0) {
		if (lunFollowTargetName && typeof gameState !== "undefined" && gameState?.remotePlayers?.remotePlayers) {
			const tp = Array.from(gameState.remotePlayers.remotePlayers.values()).find(t => t.info && t.info.name === lunFollowTargetName);
			if (tp && tp.container) {
				ritualCenter = tp.container.position;
			}
		}
		if (!ritualCenter) {
			ritualCenter = Object.assign({}, getPlayerPos());
		}
		ritualEmoteTick = 0;
		chatLog(t(window.RitualState === 2 ? "ritualInvertedMsg" : "ritualActivatedMsg") || "Dance ritual activated!");
	} else {
		ritualCenter = null;
		chatLog(t("ritualDeactivatedMsg"));
	}
	const targetBtn = btn || (typeof lunPanelElements !== "undefined" && lunPanelElements.ritualBtn);
	if (targetBtn) {
		let textKey = "ritualOff";
		if (window.RitualState === 1) textKey = "ritualOn";
		if (window.RitualState === 2) textKey = "ritualInverted";
		setText(targetBtn, t(textKey));
	}
}

window.PartnerDanceState = 0;
let partnerDanceCenter = null;
let partnerDanceTick = 0;
let partnerDanceIsClockwise = true;
const DANCE_RADIUS = 2.0;

function togglePartnerDance(btn) {
	window.PartnerDanceState = (window.PartnerDanceState + 1) % 3;
	if (window.PartnerDanceState > 0) {
		if (window.PartnerDanceState === 1) {
			if (lunFollowTargetName && typeof gameState !== "undefined" && gameState?.remotePlayers?.remotePlayers) {
				const tp = Array.from(gameState.remotePlayers.remotePlayers.values()).find(t => t.info && t.info.name === lunFollowTargetName);
				if (tp && tp.container) {
					const myPos = getPlayerPos();
					partnerDanceCenter = {
						x: (myPos.x + tp.container.position.x) / 2,
						y: myPos.y,
						z: (myPos.z + tp.container.position.z) / 2
					};
					
					const myName = String(window._lunActiveCharacter || window.myPlayerName || "").toLowerCase();
					const targetName = String(tp.info.name).toLowerCase();
					partnerDanceIsClockwise = (myName >= targetName);
				}
			}
			if (!partnerDanceCenter) {
				const myPos = getPlayerPos();
				partnerDanceCenter = { x: myPos.x, y: myPos.y, z: myPos.z };
				partnerDanceIsClockwise = true;
			}
			partnerDanceTick = 0;
			window.pd_reset = true;
			chatLog(t("partnerDanceActivatedMsg") || "8 Dance activated!");
		} else {
			window.pd_reset = true;
			chatLog(t("partnerDanceInvertedMsg") || "Reverse 8 Dance activated!");
		}
	} else {
		partnerDanceCenter = null;
		chatLog(t("partnerDanceDeactivatedMsg") || "8 Dance deactivated.");
	}
	const targetBtn = btn || (typeof lunPanelElements !== "undefined" && lunPanelElements.partnerDanceBtn);
	if (targetBtn) {
		let textKey = "partnerDanceOff";
		if (window.PartnerDanceState === 1) textKey = "partnerDanceOn";
		if (window.PartnerDanceState === 2) textKey = "partnerDanceInverted";
		setText(targetBtn, t(textKey) || (window.PartnerDanceState === 0 ? "8 Dance: ▶️" : (window.PartnerDanceState === 1 ? "8 Dance: ⏸️" : "Rev 8: ⏸️")));
	}
}

window.TurntableActive = false;

function toggleTurntable(btn) {
	if (!window.TurntableActive) {
		window.TurntableActive = 1;
		chatLog(t("turntableActivatedMsg") || "Camera rotation activated!");
	} else if (window.TurntableActive === 1) {
		window.TurntableActive = 2;
		window._turntableTraveled = 0;
		window._turntableDir = 1;
		chatLog(t("turntableHalfMsg") || "Camera half-rotation activated!");
	} else {
		window.TurntableActive = false;
		chatLog(t("turntableDeactivatedMsg") || "Camera rotation deactivated.");
	}
	if (btn) setText(btn, t(window.TurntableActive === 1 ? "turntableOn" : (window.TurntableActive === 2 ? "turntableHalf" : "turntableOff")));
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

function showPlayersRadar(levelFilter) {
	if (!gameState.remotePlayers || !gameState.remotePlayers.remotePlayers) return;
	let players = Array.from(gameState.remotePlayers.remotePlayers.values());
	
	if (levelFilter && !isNaN(parseInt(levelFilter))) {
		const targetLevel = parseInt(levelFilter);
		players = players.filter(p => p.info?.level === targetLevel);
	}
	
	if (!players.length) {
		chatLog(t("playersRadarNone"));
		return;
	}

	const list = players.map(p => {
		const dist = p.container ? distanceToVector(p.container.position).toFixed(1) : "?";
		return {
			name: p.info?.name || "Unknown",
			level: p.info?.level ?? "?",
			// id: p.info?.playerId ?? "?", // ID removed per request
			dist: dist
		};
	}).sort((a, b) => parseFloat(a.dist) - parseFloat(b.dist));

	chatLog(t("playersRadarHeader", list.length) + "\n" + list.map(p => t("playersRadarRow", p.name, p.level, p.dist)).join("\n"));
}

function findBotsRadar(auto = false) {
	if (!gameState.remotePlayers || !gameState.remotePlayers.remotePlayers) return;
	const players = Array.from(gameState.remotePlayers.remotePlayers.values());
	
	const level1s = players.filter(p => p.info?.level === 1 && p.container && (typeof lunKnownBotNames === "undefined" || !lunKnownBotNames.includes(p.info?.name)));
	
	const suspiciousBots = [];
	
	for (const p of level1s) {
		let nearbyLv1s = 0;
		for (const other of level1s) {
			if (p === other) continue;
			const dist = Math.hypot(
				p.container.position.x - other.container.position.x,
				p.container.position.z - other.container.position.z
			);
			if (dist < 5.0) nearbyLv1s++;
		}
		
		// Only flag them if they are in a massive swarm (AT LEAST 4 other level 1 players within 5 meters)
		// This prevents false positives when 2 or 3 real new players happen to spawn at the same time.
		if (nearbyLv1s >= 4) {
			const id = parseInt(p.info?.playerId) || 0;
			suspiciousBots.push({
				name: p.info?.name,
				id: id,
				clusterSize: nearbyLv1s
			});
		}
	}
	
	if (!suspiciousBots.length) {
		if (!auto && typeof gameState !== "undefined" && gameState && (gameState.myPlayerName === "Glas" || gameState.myStat?.name === "Glas")) {
			chatLog("No clustered Level 1 bots found nearby.");
		}
		return;
	}
	
	let addedCount = 0;
	suspiciousBots.forEach(b => {
		const lowerName = (b.name || "").trim().toLowerCase();
		if (lowerName && typeof lunAutoBannedLevel1s !== "undefined" && !lunAutoBannedLevel1s.has(lowerName)) {
			lunAutoBannedLevel1s.add(lowerName);
			addedCount++;
		}
	});

	if (addedCount > 0 && typeof updateKnownBotVisibility === "function") {
		updateKnownBotVisibility();
	}
	
	const isGlas = typeof gameState !== "undefined" && gameState && (gameState.myPlayerName === "Glas" || gameState.myStat?.name === "Glas");
	
	if (isGlas && addedCount > 0) {
		const botNames = suspiciousBots.map(b => `"${b.name}"`);
		chatLog(`[Debug] Auto-banned ${addedCount} clustered bots: ${botNames.join(", ")}`);
		console.log("[SpeakiMod] Auto-banned bots:", botNames);
	} else if (!auto && !suspiciousBots.length && isGlas) {
		chatLog("No clustered Level 1 bots found nearby.");
	}
}

const SPKMOD_GAMEPAD_CONFIG_KEY = "spkmod-gamepad-config";

const SPKMOD_DEFAULT_GAMEPAD_CONFIG = {
	version: 3,
	enabled: false,
	deadzone: 0.15,
	cameraSensitivity: 1.2,
	droneSpeed: 0.35,
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
			if (typeof gameState !== "undefined" && gameState && typeof gameState.sendEmoteNow === "function") {
				gameState.sendEmoteNow(Emotes.Jump);
			}
			if (typeof gameState !== "undefined" && gameState && typeof gameState.tryUsePortal === "function") gameState.tryUsePortal();
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
				window.HyperShakeActive = false;
				if (window.vibrateTimer) { clearInterval(window.vibrateTimer); window.vibrateTimer = null; }
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
				window.HyperShakeActive = false;
				if (window.vibrateTimer) { clearInterval(window.vibrateTimer); window.vibrateTimer = null; }
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
			gameState.sendEmoteNow(Emotes.MinigameJoayo);
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
				window.HyperShakeActive = false;
				if (window.vibrateTimer) { clearInterval(window.vibrateTimer); window.vibrateTimer = null; }
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
			stopStare();
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
			toggleSettingsModal();
			break;
	}
}


const mapModalElements = {};
let mapUpdateFrame = null;

function openMapModal() {
	mapModalElements.modalWindow.style.display = "flex";
	updateMapLoop();
}

function closeMapModal() {
	mapModalElements.modalWindow.style.display = "none";
	if (mapUpdateFrame) cancelAnimationFrame(mapUpdateFrame);
	mapUpdateFrame = null;
}

function toggleMapModal() {
	if (!mapModalElements.modalWindow) return;
	if (mapModalElements.modalWindow.style.display === "none") {
		openMapModal();
	} else {
		closeMapModal();
	}
}

function updateMapLoop() {
	if (!mapModalElements.canvas || mapModalElements.modalWindow.style.display === "none") {
		mapUpdateFrame = null;
		return;
	}
	const ctx = mapModalElements.canvas.getContext("2d");
	const w = mapModalElements.canvas.width;
	const h = mapModalElements.canvas.height;
	
	ctx.clearRect(0, 0, w, h);
	
	const padding = 20;
	const drawW = w - padding * 2;
	const drawH = h - padding * 2;
	
	const connectedZones = new Set();
	for (const src in Portals) {
		connectedZones.add(parseInt(src));
		for (const tgt in Portals[src]) {
			connectedZones.add(parseInt(tgt));
		}
	}

	let rows = [[], [], []];
	for (const zone of WorldZones) {
		if (!connectedZones.has(zone.zoneId)) continue;
		const cz = (zone.minZ + zone.maxZ) / 2;
		if (cz <= 0) rows[0].push(zone);
		else if (cz <= 200) rows[1].push(zone);
		else rows[2].push(zone);
	}
	
	rows.forEach(r => r.sort((a,b) => ((a.minX+a.maxX)/2) - ((b.minX+b.maxX)/2)));
	
	const zonePos = {};
	const boxW = 66;
	const boxH = 36;
	
	for (let r=0; r<3; r++) {
		if (rows[r].length === 0) continue;
		let spacingX = drawW / rows[r].length;
		for (let i=0; i<rows[r].length; i++) {
			let z = rows[r][i];
			zonePos[z.zoneId] = {
				x: padding + i * spacingX + spacingX/2,
				y: padding + boxH/2 + r * ((drawH - boxH) / 2),
				zone: z
			};
		}
	}
	
	const getLogicalPos = (zid, px, pz) => {
		const zp = zonePos[zid];
		if (!zp) return null;
		const z = zp.zone;
		let pctX = (px - z.minX) / (z.maxX - z.minX);
		let pctZ = (pz - z.minZ) / (z.maxZ - z.minZ);
		pctX = Math.max(0, Math.min(1, pctX));
		pctZ = Math.max(0, Math.min(1, pctZ));
		return {
			x: zp.x - boxW/2 + pctX * boxW,
			y: zp.y - boxH/2 + pctZ * boxH
		};
	};

	ctx.strokeStyle = "rgba(255, 200, 50, 0.4)";
	ctx.lineWidth = 1.5;
	for (const src in Portals) {
		for (const tgt in Portals[src]) {
			if (Portals[tgt] && Portals[tgt][src] && zonePos[src] && zonePos[tgt]) {
				const p1 = zonePos[src];
				const p2 = zonePos[tgt];
				const pInfo1 = Portals[src][tgt];
				const pInfo2 = Portals[tgt][src];
				
				if (pInfo1 && pInfo2) {
					const lPos1 = getLogicalPos(parseInt(src), pInfo1.pos.x, pInfo1.pos.z);
					const lPos2 = getLogicalPos(parseInt(tgt), pInfo2.pos.x, pInfo2.pos.z);
					
					if (lPos1 && lPos2) {
						ctx.beginPath();
						ctx.moveTo(lPos1.x, lPos1.y);
						if (Math.abs(lPos1.y - lPos2.y) > 10) { 
							ctx.lineTo(lPos1.x, (lPos1.y + lPos2.y)/2);
							ctx.lineTo(lPos2.x, (lPos1.y + lPos2.y)/2);
						}
						ctx.lineTo(lPos2.x, lPos2.y);
						ctx.stroke();
					}
				}
			}
		}
	}
	

	for (const zid in zonePos) {
		const zp = zonePos[zid];
		const isCurrent = parseInt(zid) === (gameState?.zoneId % 10000);
		
		const bx = zp.x - boxW/2;
		const by = zp.y - boxH/2;
		
		ctx.fillStyle = isCurrent ? "rgb(40, 100, 40)" : "rgb(30, 40, 50)";
		ctx.strokeStyle = isCurrent ? "rgba(100, 255, 100, 0.8)" : "rgba(150, 180, 200, 0.6)";
		ctx.lineWidth = isCurrent ? 2 : 1;
		
		ctx.fillRect(bx, by, boxW, boxH);
		ctx.strokeRect(bx, by, boxW, boxH);
		
		ctx.fillStyle = "white";
		ctx.font = "11px sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		
		let rawName = getZoneName(zid);
		
		let words = rawName.split(" ");
		if (words.length > 1) {
			let mid = Math.ceil(words.length / 2);
			let line1 = words.slice(0, mid).join(" ");
			let line2 = words.slice(mid).join(" ");
			ctx.fillText(line1, zp.x, zp.y - 6);
			ctx.fillText(line2, zp.x, zp.y + 6);
		} else {
			ctx.fillText(rawName, zp.x, zp.y);
		}
	}
	
	for (const src in Portals) {
		for (const tgt in Portals[src]) {
			const pInfo = Portals[src][tgt];
			const lPos = getLogicalPos(parseInt(src), pInfo.pos.x, pInfo.pos.z);
			if (!lPos) continue;
			
			if (pInfo.requiredQuestCode) {
				let isCompleted = false;
				if (gameState && gameState.zoneId && (gameState.zoneId % 10000) === parseInt(tgt)) {
					isCompleted = true;
				}
				if (window.lunCompletedQuests && window.lunCompletedQuests.has(pInfo.requiredQuestCode)) {
					isCompleted = true;
				}
				
				if (!isCompleted) {
					ctx.font = "10px sans-serif";
					ctx.fillStyle = "white";
					ctx.textAlign = "center";
					ctx.textBaseline = "middle";
					ctx.fillText("🔒", lPos.x, lPos.y);
					continue;
				}
			}
			
			ctx.fillStyle = "rgba(255, 200, 50, 0.9)";
			ctx.beginPath();
			ctx.arc(lPos.x, lPos.y, 2, 0, Math.PI * 2);
			ctx.fill();
		}
	}
	
	if (gameState && gameState.playerContainer && gameState.zoneId) {
		const pz = gameState.zoneId % 10000;
		if (zonePos[pz]) {
			const lPos = getLogicalPos(pz, gameState.playerContainer.position.x, gameState.playerContainer.position.z);
			if (lPos) {
				ctx.fillStyle = "red";
				ctx.strokeStyle = "white";
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.arc(lPos.x, lPos.y, 4, 0, Math.PI * 2);
				ctx.fill();
				ctx.stroke();
			}
		}
	}
	
	mapUpdateFrame = requestAnimationFrame(updateMapLoop);
}

document.body.appendChild(
	mapModalElements.modalWindow = buildElement("div", {
		id: "spkmod-map-modal",
		style: "display: none; position: absolute; top: 20px; left: calc(100vw - 1060px); background: rgba(20, 20, 25, 0.95); border: 1px solid #444; border-radius: 8px; padding: 20px; color: white; flex-direction: column; align-items: center; box-shadow: 0 4px 15px rgba(0,0,0,0.5); z-index: 10001;"
	}, [
		mapModalElements.titleLabel = buildElement("div", { style: "font-size: 18px; font-weight: bold; margin-bottom: 15px; cursor: move; width: 100%; text-align: center; user-select: none;", innerText: t("mapModalTitle") }),
		mapModalElements.canvas = buildElement("canvas", {
			width: 1000,
			height: 400,
			style: "border: 1px solid #666; border-radius: 4px; background: #080808; width: 1000px;"
		}),
		buildElement("button", {
			innerText: t("closeBtn"),
			style: "margin-top: 15px; padding: 6px 20px; cursor: pointer; background: #333; color: #fff; border: 1px solid #555; border-radius: 4px; font-weight: bold;",
			onclick: () => closeMapModal()
		})
	])
);

document.body.appendChild(
	lunHudElements.eventModal = buildElement("div", {
		id: "spkmod-event-modal",
		className: "hidden"
	}, [
		buildElement("div", { className: "spkmod-panel-cat", style: "justify-content: space-between;" }, [
			eventModalElements.headerTitle = buildElement("span", {
				innerText: t("eventInfoHeader"),
				style: "font-weight: bold; font-size: 12px; cursor: move; user-select: none;"
			}),
			buildElement("span", {
				id: "spkmod-event-close",
				innerText: "✕",
				style: "cursor: pointer; padding: 0 4px;",
				onclick: _ => lunHudElements.eventModal.classList.add("hidden")
			})
		]),
		buildElement("div", {
			style: "background: rgba(255, 140, 0, 0.12); border: 1px solid rgba(255, 140, 0, 0.35); border-radius: 6px; padding: 8px; display: flex; flex-direction: column; gap: 6px;"
		}, [
			buildElement("div", { style: "display: flex; justify-content: space-between; align-items: center;" }, [
				eventModalElements.titleText = buildElement("span", { style: "font-weight: bold; font-size: 11pt; color: #ffa500;", innerText: "🎃 " + t("eventMinigameTitle") }),
				eventModalElements.statusBadge = buildElement("span", {
					style: "font-size: 9pt; font-weight: bold; padding: 1px 6px; border: 1px solid #4ade80; border-radius: 4px; color: #4ade80;",
					innerText: t("eventStatusActive")
				})
			]),
			eventModalElements.periodText = buildElement("div", {
				style: "font-size: 9pt; color: #bbb;",
				innerText: t("eventLoading")
			}),
			buildElement("div", { style: "display: flex; justify-content: space-between; font-size: 9.5pt; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 6px;" }, [
				eventModalElements.bestScoreText = buildElement("span", {
					style: "font-weight: bold; color: #ffd54a;",
					innerText: t("eventBestScore", "--")
				}),
				eventModalElements.playsRemainingText = buildElement("span", {
					style: "font-weight: bold; color: #fff;",
					innerText: t("eventPlaysToday", "--", "--")
				})
			])
		]),
		buildElement("div", { style: "display: flex; justify-content: flex-end; gap: 6px; margin-top: 2px;" }, [
			eventModalElements.refreshBtn = buildElement("button", {
			className: "spkmod-panel-btn",
			style: "padding: 3px 10px; font-size: 9pt; cursor: pointer;",
			innerText: "🔄 " + t("refreshBtn"),
			onclick: () => fetchMinigameStatus()
		})
		])
	])
);
setTimeout(() => {
	if (typeof makeDraggable === 'function' && lunHudElements.eventModal && eventModalElements.headerTitle) {
		makeDraggable(lunHudElements.eventModal, [eventModalElements.headerTitle]);
	}
}, 500);

document.body.appendChild(
	lunHudElements.patchNotesModal = buildElement("div", {
		id: "spkmod-patchnotes-modal",
		className: "hidden"
	}, [
		buildElement("div", { className: "spkmod-panel-cat", style: "justify-content: space-between;" }, [
			patchNotesModalElements.headerTitle = buildElement("span", {
				innerText: "📰 " + t("patchNotesHeader"),
				style: "font-weight: bold; font-size: 12px; cursor: move; user-select: none;"
			}),
			buildElement("span", {
				id: "spkmod-patchnotes-close",
				innerText: "✕",
				style: "cursor: pointer; padding: 0 4px;",
				onclick: _ => lunHudElements.patchNotesModal.classList.add("hidden")
			})
		]),
		patchNotesModalElements.contentContainer = buildElement("div", {
			style: "display: flex; flex-direction: column; gap: 8px; max-height: 60vh; overflow-y: auto; padding-right: 2px;"
		})
	])
);
setTimeout(() => {
	if (typeof makeDraggable === 'function' && lunHudElements.patchNotesModal && patchNotesModalElements.headerTitle) {
		makeDraggable(lunHudElements.patchNotesModal, [patchNotesModalElements.headerTitle]);
	}
}, 500);

document.body.appendChild(
	lunHudElements.statsModal = buildElement("div", {
		id: "spkmod-stats-modal",
		className: "hidden"
	}, [
		buildElement("div", { className: "spkmod-panel-cat", style: "justify-content: space-between; align-items: center;" }, [
			statsModalElements.headerTitle = buildElement("span", {
				innerText: "⏱️ " + t("statsHeader"),
				style: "font-weight: bold; font-size: 11px; cursor: move; user-select: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
			}),
			buildElement("span", {
				id: "spkmod-stats-close",
				innerText: "✕",
				style: "cursor: pointer; padding: 0 4px; font-size: 12px; line-height: 1;",
				onclick: _ => lunHudElements.statsModal.classList.add("hidden")
			})
		]),
		buildElement("div", {
			style: "display: flex; flex-direction: column; gap: 6px; font-size: 11px; padding: 1px;"
		}, [
			buildElement("div", { style: "background: rgba(255,255,255,0.04); border-radius: 6px; padding: 5px 8px; display: flex; flex-direction: column; gap: 4px;" }, [
				buildElement("div", { style: "display: flex; justify-content: space-between; align-items: center;" }, [
					statsModalElements.sessionTimeLabel = buildElement("span", { style: "color: #aaa;", innerText: "⏱️ " + t("statsSessionTime") }),
					statsModalElements.sessionTimeVal = buildElement("span", { style: "font-weight: bold; font-family: monospace; font-size: 11.5px; color: #ffd54a;", innerText: "00:00:00" })
				]),
				buildElement("div", { style: "display: flex; justify-content: space-between; align-items: center;" }, [
					statsModalElements.pingLabel = buildElement("span", { style: "color: #aaa;", innerText: "📶 " + t("statsPing") }),
					buildElement("div", { style: "display: flex; gap: 6px; align-items: baseline;" }, [
						statsModalElements.pingVal = buildElement("span", { style: "font-weight: bold; font-size: 11px;", innerText: "-- ms" }),
						statsModalElements.fpsVal = buildElement("span", { style: "color: #888; font-size: 10px;", innerText: "-- FPS" })
					])
				]),
				buildElement("div", { style: "display: flex; justify-content: space-between; align-items: center;" }, [
					statsModalElements.dailyResetLabel = buildElement("span", { style: "color: #aaa;", innerText: "🌅 " + t("statsDailyReset") }),
					statsModalElements.dailyResetVal = buildElement("span", { style: "font-weight: bold; font-family: monospace; font-size: 11px; color: #67e8f9;", innerText: "--:--:--" })
				]),
				buildElement("div", { style: "display: flex; justify-content: space-between; align-items: center;" }, [
					statsModalElements.minigameLabel = buildElement("span", { style: "color: #aaa;", innerText: "🎃 " + t("statsMinigamePlays") }),
					statsModalElements.minigameVal = buildElement("span", { style: "font-weight: bold; color: #f97316;", innerText: "-- / --" })
				])
			]),

			buildElement("div", { style: "background: rgba(255,255,255,0.04); border-radius: 6px; padding: 5px 8px; display: flex; flex-direction: column; gap: 4px;" }, [
				buildElement("div", { style: "display: flex; justify-content: space-between; align-items: baseline; gap: 4px;" }, [
					statsModalElements.levelProgressVal = buildElement("span", { style: "font-weight: bold; color: #67e8f9; font-size: 11px; white-space: nowrap;", innerText: "Lv. -- (0%)" }),
					statsModalElements.levelExpNumbers = buildElement("span", { style: "font-size: 9.5px; color: #888; white-space: nowrap; font-family: monospace;", innerText: "0 / 0" })
				]),
				buildElement("div", { style: "width: 100%; height: 5px; background: rgba(0,0,0,0.5); border-radius: 3px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); margin: 1px 0;" }, [
					statsModalElements.levelProgressBar = buildElement("div", { style: "height: 100%; width: 0%; background: linear-gradient(90deg, #06b6d4, #3b82f6); border-radius: 3px; transition: width 0.3s;" })
				]),
				buildElement("div", { style: "display: flex; justify-content: space-between; align-items: center;" }, [
					statsModalElements.expGainedLabel = buildElement("span", { style: "color: #aaa;", innerText: "⭐ " + t("statsExpGained") }),
					statsModalElements.expGainedVal = buildElement("span", { style: "font-weight: bold; color: #4ade80;", innerText: "+0 EXP" })
				]),
				buildElement("div", { style: "display: flex; justify-content: space-between; align-items: center;" }, [
					statsModalElements.expRateLabel = buildElement("span", { style: "color: #aaa;", innerText: "📈 " + t("statsExpPerHour") }),
					statsModalElements.expRateVal = buildElement("span", { style: "font-weight: bold; color: #ffd54a;", innerText: "0 / hr" })
				]),
				buildElement("div", { style: "display: flex; justify-content: space-between; align-items: center;" }, [
					statsModalElements.timeToLevelLabel = buildElement("span", { style: "color: #aaa;", innerText: "⏳ " + t("statsTimeToNextLevel") }),
					statsModalElements.timeToLevelVal = buildElement("span", { style: "font-weight: bold;", innerText: "N/A" })
				]),
				
				buildElement("div", { style: "width: 100%; height: 1px; background: rgba(255,255,255,0.1); margin: 2px 0;" }),

				buildElement("div", { style: "display: flex; justify-content: space-between; align-items: center;" }, [
					statsModalElements.currencyLabel = buildElement("span", { style: "color: #aaa;", innerText: "💰 " + t("statsCurrency") }),
					statsModalElements.currencyBalancesVal = buildElement("span", { style: "font-weight: bold;", innerText: "💰 0  |  💎 0" })
				]),
				buildElement("div", { style: "display: flex; justify-content: space-between; align-items: center;" }, [
					statsModalElements.goldGainedLabel = buildElement("span", { style: "color: #aaa;", innerText: "💰 " + t("statsGoldGained") }),
					statsModalElements.goldGainedVal = buildElement("span", { style: "font-weight: bold; color: #ffd54a;", innerText: "+0 (+0 / hr)" })
				]),
				buildElement("div", { style: "display: flex; justify-content: space-between; align-items: center;" }, [
					statsModalElements.elifGainedLabel = buildElement("span", { style: "color: #aaa;", innerText: "💎 " + t("statsElifGained") }),
					statsModalElements.elifGainedVal = buildElement("span", { style: "font-weight: bold; color: #67e8f9;", innerText: "+0 (+0 / hr)" })
				]),
				buildElement("div", { style: "display: flex; justify-content: space-between; align-items: center;" }, [
					statsModalElements.spkCoinGainedLabel = buildElement("span", { style: "color: #aaa;", innerText: "🟣 " + (t("statsSpkCoinGained") || "Speaki Coin Gained") }),
					statsModalElements.spkCoinGainedVal = buildElement("span", { style: "font-weight: bold; color: #a78bfa;", innerText: "+0 (+0 / hr)" })
				])
			]),

			statsModalElements.resetBtn = buildElement("button", {
				innerText: "🔄 " + t("statsResetBtn"),
				className: "spkmod-panel-btn",
				style: "margin-top: 2px; padding: 5px; cursor: pointer; font-size: 11px; font-weight: bold; width: 100%; text-align: center; border-radius: 4px; border: 1px solid #555;",
				onclick: () => resetSessionStats()
			})
		])
	])
);
setTimeout(() => {
	if (typeof makeDraggable === 'function' && lunHudElements.statsModal) {
		makeDraggable(lunHudElements.statsModal, [lunHudElements.statsModal]);
	}
}, 500);
setTimeout(() => { if (typeof makeDraggable === 'function') makeDraggable(mapModalElements.modalWindow, [mapModalElements.titleLabel]); }, 1000);


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
		buildElement("div", { style: "display: flex; justify-content: space-between; gap: 8px; align-items: stretch;" }, [
			gamepadModalElements.statusText = buildElement("div", {
				style: "flex: 1; font-size: 11px; padding: 4px 6px; background: #111; border-radius: 4px; border: 1px solid #333;",
				innerText: t("gamepadDisconnected")
			}),
			gamepadModalElements.enableBtn = buildElement("button", {
				className: "spkmod-panel-btn",
				style: "margin: 0; flex: 0 0 auto; padding: 4px 12px; font-weight: bold; color: " + (spkmodGamepadConfig.enabled ? "#4ade80" : "#f87171") + ";",
				innerText: spkmodGamepadConfig.enabled ? "Gamepad: ON" : "Gamepad: OFF",
				onclick: () => {
					spkmodGamepadConfig.enabled = !spkmodGamepadConfig.enabled;
					saveGamepadConfig();
					gamepadModalElements.enableBtn.innerText = spkmodGamepadConfig.enabled ? "Gamepad: ON" : "Gamepad: OFF";
					gamepadModalElements.enableBtn.style.color = spkmodGamepadConfig.enabled ? "#4ade80" : "#f87171";
					if (!spkmodGamepadConfig.enabled) {
						updateGamepadModalLive(null);
					}
				}
			})
		]),
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
				buildElement("div", { style: "display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;" }, [
					gamepadModalElements.droneSensLabel = buildElement("span", { innerText: t("gamepadDroneSpeed") || "Free Camera Speed" }),
					buildElement("div", { style: "display: flex; align-items: center; gap: 4px;" }, [
						gamepadModalElements.droneSensValue = buildElement("span", { style: "font-family: monospace; font-weight: bold; width: 30px; text-align: right;", innerText: (spkmodGamepadConfig.droneSpeed || 0.35).toFixed(2) + "x" }),
						gamepadModalElements.droneSensSlider = buildElement("input", {
							type: "range", min: "0.05", max: "1.0", step: "0.05", value: spkmodGamepadConfig.droneSpeed || 0.35, style: "width: 60px;",
							oninput: e => {
								gamepadModalElements.droneSensValue.innerText = Number(e.target.value).toFixed(2) + "x";
							},
							onchange: e => {
								spkmodGamepadConfig.droneSpeed = Number(e.target.value);
								saveGamepadConfig();
							}
						})
					])
				]),
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
					gamepadModalElements.droneSensSlider.value = spkmodGamepadConfig.droneSpeed;
					gamepadModalElements.droneSensValue.innerText = spkmodGamepadConfig.droneSpeed.toFixed(2) + "x";
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

	if (gp) {
		updateGamepadModalLive(gp);

		if (spkmodGamepadConfig.enabled) {
			const deadzone = spkmodGamepadConfig.deadzone || 0.15;
			const sens = spkmodGamepadConfig.cameraSensitivity || 1.2;

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
		}
	} else {
		gamepadMoveVector = null;
		updateGamepadModalLive(null);
	}

	requestAnimationFrame(pollGamepadLoop);
}

requestAnimationFrame(pollGamepadLoop);

document.body.appendChild(
	lunHudElements.hotkeysModal = buildElement("div", {
		id: "spkmod-hotkeys-modal",
		className: "hidden",
		style: "position: absolute; top: 15%; left: 50%; transform: translateX(-50%); width: 350px; background: rgba(15, 23, 42, 0.95); border: 1px solid #1e293b; border-radius: 8px; z-index: 9999; display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0,0,0,0.5); font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #f8fafc;"
	}, [
		buildElement("div", { className: "spkmod-panel-cat", style: "justify-content: space-between; align-items: center;" }, [
			hotkeysModalElements.headerTitle = buildElement("span", {
				innerText: "⌨️ " + (typeof t === 'function' && t("hotkeysModalTitle") ? t("hotkeysModalTitle") : "Hotkeys"),
				style: "font-weight: bold; font-size: 12px; cursor: move; user-select: none;"
			}),
			buildElement("span", {
				id: "spkmod-hotkeys-close",
				innerText: "✕",
				style: "cursor: pointer; padding: 0 4px;",
				onclick: _ => lunHudElements.hotkeysModal.classList.add("hidden")
			})
		]),
		hotkeysModalElements.contentContainer = buildElement("div", {
			style: "display: flex; flex-direction: column; gap: 8px; max-height: 60vh; overflow-y: auto; padding: 6px; font-size: 11px;"
		})
	])
);
setTimeout(() => {
	if (typeof makeDraggable === 'function' && lunHudElements.hotkeysModal && hotkeysModalElements.headerTitle) {
		makeDraggable(lunHudElements.hotkeysModal, [hotkeysModalElements.headerTitle]);
	}
}, 500);

function toggleHotkeysModal() {
	if (!lunHudElements.hotkeysModal) return;
	const isClosed = lunHudElements.hotkeysModal.classList.contains("hidden");
	if (isClosed) {
		positionModalNicely(lunHudElements.hotkeysModal);
		lunHudElements.hotkeysModal.classList.remove("hidden");
		renderHotkeysUI();
	} else {
		lunHudElements.hotkeysModal.classList.add("hidden");
	}
}

function renderHotkeysUI() {
	if (!hotkeysModalElements.contentContainer) return;
	const c = hotkeysModalElements.contentContainer;
	c.innerHTML = "";
	
	const hotkeys = [
		{ k: "P", d: (typeof t === 'function' ? t("hkDescToggleUI") : "") || "Toggle UI Visibility" },
		{ k: "F2", d: (typeof t === 'function' ? t("hkDescModSettings") : "") || "Open Mod Settings" },
		{ k: "F4", d: (typeof t === 'function' ? t("hkDescDroneMode") : "") || "Toggle Drone Camera Mode" },
		{ k: "N", d: (typeof t === 'function' ? t("hkDescNightMode") : "") || "Toggle Native Night Mode" },
		{ k: "Ctrl + U", d: (typeof t === 'function' ? t("hkDescResetUIScale") : "") || "Reset Game UI Scale" },
		{ k: "Ctrl + 6", d: (typeof t === 'function' ? t("hkDescCamNormal") : "") || "Camera Effect: None" },
		{ k: "Ctrl + 7", d: (typeof t === 'function' ? t("hkDescCamBW") : "") || "Camera Effect: B&W" },
		{ k: "Ctrl + 8", d: (typeof t === 'function' ? t("hkDescCamSepia") : "") || "Camera Effect: Sepia" },
		{ k: "Ctrl + 9", d: (typeof t === 'function' ? t("hkDescCamMorning") : "") || "Camera Effect: Morning" },
		{ k: "Ctrl + 0", d: (typeof t === 'function' ? t("hkDescCamDusk") : "") || "Camera Effect: Dusk" },
		{ k: "W, A, S, D", d: (typeof t === 'function' ? t("hkDescDroneMove") : "") || "Drone Mode: Move" },
		{ k: "Space", d: (typeof t === 'function' ? t("hkDescDroneAscend") : "") || "Drone Mode: Ascend" },
		{ k: "Left Ctrl", d: (typeof t === 'function' ? t("hkDescDroneDescend") : "") || "Drone Mode: Descend" },
		{ k: "Numpad +", d: (typeof t === 'function' ? t("hkDescDroneSpeedUp") : "") || "Drone Mode: Speed Up" },
		{ k: "Numpad -", d: (typeof t === 'function' ? t("hkDescDroneSpeedDown") : "") || "Drone Mode: Speed Down" }
	];
	
	hotkeys.forEach(hk => {
		c.appendChild(buildElement("div", {
			style: "display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 2px;"
		}, [
			buildElement("span", { innerText: hk.k, style: "font-weight: bold; color: #ffeb3b;" }),
			buildElement("span", { innerText: hk.d })
		]));
	});
}

if (typeof spkmodI18nRenderers !== "undefined") {
	spkmodI18nRenderers.push(() => {
		if (lunHudElements && lunHudElements.hotkeysModal && !lunHudElements.hotkeysModal.classList.contains("hidden")) {
			renderHotkeysUI();
		}
	});
}
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
	return (typeof gameState !== "undefined" && gameState && gameState.playerContainer && gameState.playerContainer.position) || { x: 0, y: 0, z: 0 };
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

	if (/^(\[.*?\]\s*)?\//.test(cleaned)) {
		cleaned = cleaned.replace(/\([a-z0-9\-,\s]+\)\s*/gi, "");
		cleaned = cleaned.replace(/^\//, "");
		cleaned = cleaned.replace(/^(\[.*?\]\s*)\//, "$1");
		cleaned = cleaned.replace(/\/$/, "");
		cleaned = cleaned.replace(/\//g, ", ");
	}

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

let lunChatObserver = null;
let lunChatObserverTarget = null;
const lunPendingChatCallbacks = [];

function ensureChatObserver() {
	const chatLogEl = document.querySelector(".sr-chatbox__log");
	if (!chatLogEl) return null;

	if (lunChatObserver && lunChatObserverTarget === chatLogEl) {
		return chatLogEl;
	}

	if (lunChatObserver) {
		lunChatObserver.disconnect();
	}

	lunChatObserverTarget = chatLogEl;
	lunChatObserver = new MutationObserver(mutations => {
		if (lunPendingChatCallbacks.length === 0) return;
		const now = Date.now();

		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (node.nodeType !== 1) continue;
				const bodyText = node.classList?.contains("sr-chatbox__body-text")
					? node
					: node.querySelector?.(".sr-chatbox__body-text");
				if (!bodyText || !bodyText.textContent) continue;

				const text = bodyText.textContent;
				for (let i = 0; i < lunPendingChatCallbacks.length; i++) {
					const item = lunPendingChatCallbacks[i];
					if (text.includes(item.matchText)) {
						item.callback(bodyText, node);
						lunPendingChatCallbacks.splice(i, 1);
						i--;
						break;
					}
				}
			}
		}

		for (let i = lunPendingChatCallbacks.length - 1; i >= 0; i--) {
			if (lunPendingChatCallbacks[i].expire < now) {
				lunPendingChatCallbacks.splice(i, 1);
			}
		}
	});

	lunChatObserver.observe(chatLogEl, { childList: true, subtree: true });
	return chatLogEl;
}

function observeNextChatNode(matchText, callback) {
	if (!matchText || !matchText.trim()) return;
	const chatLogEl = ensureChatObserver();
	if (!chatLogEl) return;

	const now = Date.now();
	for (let i = lunPendingChatCallbacks.length - 1; i >= 0; i--) {
		if (lunPendingChatCallbacks[i].expire < now) {
			lunPendingChatCallbacks.splice(i, 1);
		}
	}

	lunPendingChatCallbacks.push({
		matchText,
		callback,
		expire: now + 2000
	});
}

function chatLog(msg) {
	if (typeof lunHideVerboseChat !== "undefined" && lunHideVerboseChat) return;
	try {
		if (typeof gameState !== "undefined" && gameState?.chatBox?.append) {
			gameState.chatBox.append(-1337, "SpeakiMod+", msg);
		} else if (typeof hkChatBoxAppend === "function") {
			hkChatBoxAppend(-1337, "SpeakiMod+", msg);
		} else {
			console.log("[SpeakiMod+]", msg);
		}
	} catch (e) {
		console.warn("[SpeakiMod+] Failed to append chat message:", e);
	}
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

	if (!window._stareActive) {
		lunPanelElements.resetCameraBtn.classList.add("hidden");
	}
	gameState.cameraController.target = gameState.playerContainer;
}

function stareAtPlayer(targetName) {
	if (!targetName) {
		stopStare();
		return;
	}
	if (window._stareAnim) {
		cancelAnimationFrame(window._stareAnim);
		window._stareAnim = null;
	}
	if (window._stareNetSync) {
		clearInterval(window._stareNetSync);
		window._stareNetSync = null;
	}
	
	window._stareActive = true;
	window._stareTargetName = targetName;
	let currentAngle = gameState?.playerContainer?.rotation?.y || 0;
	
	function updateStare() {
		if (!window._stareActive) {
			if (window._stareAnim) {
				cancelAnimationFrame(window._stareAnim);
				window._stareAnim = null;
			}
			return;
		}

		if (gameState?.remotePlayers?.remotePlayers && gameState?.playerContainer) {
			const players = Array.from(gameState.remotePlayers.remotePlayers.values());
			const target = players.find(p => p.info?.name?.toLowerCase() === targetName.toLowerCase());

			if (target && target.container) {
				const pp = gameState.playerContainer.position;
				const tp = target.container.position;
				
				const targetAngle = Math.atan2(tp.x - pp.x, tp.z - pp.z);
				
				let diff = (targetAngle - currentAngle) % (2 * Math.PI);
				if (diff < -Math.PI) diff += 2 * Math.PI;
				if (diff > Math.PI) diff -= 2 * Math.PI;

				currentAngle += diff * 0.35;

				gameState.playerContainer.rotation.y = currentAngle;
			}
		}
		window._stareAnim = requestAnimationFrame(updateStare);
	}

	window._stareAnim = requestAnimationFrame(updateStare);

	window._stareNetSync = setInterval(() => {
		if (window._stareActive && gameState) {
			gameState.moveSendAccumulator = 1;
		}
	}, 50);

	if (lunPanelElements.resetCameraBtn) {
		lunPanelElements.resetCameraBtn.classList.remove("hidden");
	}

	console.log(`%c[SpeakiMod] Smooth Stare Lock active on: "${targetName}"`, "color: #4CAF50; font-weight: bold;");
	chatLog(t("stareActivatedMsg", targetName));
}

function stopStare() {
	if (window._stareAnim) {
		cancelAnimationFrame(window._stareAnim);
		window._stareAnim = null;
	}
	if (window._stareNetSync) {
		clearInterval(window._stareNetSync);
		window._stareNetSync = null;
	}
	if (!window._stareActive) return;
	window._stareActive = false;
	window._stareTargetName = null;
	if (gameState && gameState.playerContainer && gameState.cameraController) {
		gameState.playerContainer.rotation.y = gameState.cameraController.cameraYaw;
		gameState.moveSendAccumulator = 1;
	}
	if (!gameState?.cameraController?.target || gameState.cameraController.target === gameState.playerContainer) {
		if (lunPanelElements.resetCameraBtn) {
			lunPanelElements.resetCameraBtn.classList.add("hidden");
		}
	}
	console.log("%c[SpeakiMod] Stare Lock stopped.", "color: #f44336; font-weight: bold;");
	chatLog(t("stareDeactivatedMsg"));
}

function hookPartyTargetElement() {
	const hPartyTarget = document.querySelector(".sr-party-target");
	if (!hPartyTarget) return false;
	if (hPartyTarget.querySelector(".spkmod-watch-player-btn")) return true;

	const closeBtn = hPartyTarget.querySelector(".sr-party-target__close");
	if (!closeBtn) return false;

	lunPanelElements.followBtn = buildElement("button", {
		className: "sr-btn sr-party-target__btn spkmod-watch-player-btn",
		style: "margin-right: 4px;",
		innerText: t("followBtn"),
		value: "",
		onclick: e => {
			const name = e.target.parentElement.querySelector(".sr-party-target__name")?.innerText;
			followPlayer(name);
		}
	});
	hPartyTarget.insertBefore(lunPanelElements.followBtn, closeBtn);

	lunPanelElements.watchBtn = buildElement("button", {
		className: "sr-btn sr-party-target__btn spkmod-watch-player-btn",
		style: "margin-right: 4px;",
		innerText: t("watchBtn"),
		value: "",
		onclick: e => {
			const name = e.target.parentElement.querySelector(".sr-party-target__name")?.innerText;
			watchPlayer(name);
		}
	});
	hPartyTarget.insertBefore(lunPanelElements.watchBtn, closeBtn);

	lunPanelElements.stareBtn = buildElement("button", {
		className: "sr-btn sr-party-target__btn spkmod-watch-player-btn",
		innerText: t("stareBtn"),
		value: "",
		onclick: e => {
			const name = e.target.parentElement.querySelector(".sr-party-target__name")?.innerText;
			stareAtPlayer(name);
		}
	});
	hPartyTarget.insertBefore(lunPanelElements.stareBtn, closeBtn);
	return true;
}
hookPartyTargetElement();


function updateMovementButtonsUI() {
	const shakeBtn = document.querySelector("#spkmod-shake-main-btn");
	if (shakeBtn) setText(shakeBtn, window.ShakeActive ? t("shakeOn") : t("shakeOff"));

	const superShakeBtn = document.querySelector("#spkmod-supershake-main-btn");
	if (superShakeBtn) setText(superShakeBtn, window.SuperShakeActive ? t("superShakeOn") : t("superShakeOff"));

	const hyperShakeBtn = document.querySelector("#spkmod-hypershake-main-btn");
	if (hyperShakeBtn) setText(hyperShakeBtn, window.HyperShakeActive ? t("hyperShakeOn") : t("hyperShakeOff"));

	const moonwalkBtn = document.querySelector("#spkmod-moonwalk-main-btn");
	if (moonwalkBtn) setText(moonwalkBtn, window.MoonwalkActive ? t("moonwalkOn") : t("moonwalkOff"));

	const beybladeBtn = document.querySelector("#spkmod-beyblade-main-btn");
	if (beybladeBtn) setText(beybladeBtn, t(window.BeyBladeActive ? "beybladeOn" : "beybladeOff"));

	const revBeybladeBtn = document.querySelector("#spkmod-reversebeyblade-main-btn");
	if (revBeybladeBtn) setText(revBeybladeBtn, t(window.ReverseBeyBladeActive ? "reversebeybladeOn" : "reversebeybladeOff"));
}

spkmodI18nRenderers.push(() => {
	if (lunPanelElements.targetZone) {
		const currentVal = lunPanelElements.targetZone.value;
		lunPanelElements.targetZone.innerHTML = "";
		Object.keys(Portals).forEach(zoneId => {
			let n = getZoneName(zoneId);
			lunPanelElements.targetZone.appendChild(buildElement("option", {
				value: zoneId - 0,
				innerText: n
			}));
		});
		if (currentVal) lunPanelElements.targetZone.value = currentVal;
	}
});

spkmodI18nRenderers.push(() => {
	setText(lunPanelElements.headerBtn, t("header"));
	setText(lunPanelElements.danceBtn, t("dance"));
	setText(lunPanelElements.chowayoBtn, t(window.AutoChowayoActive ? "autoChowayoOn" : "chowayo"));
	setText(lunPanelElements.heartsBtn, t("hearts"));
	setText(lunPanelElements.autoHeartsBtn, t(window.AutoHeartsActive ? "autoHeartsOn" : "autoHeartsOff"));
	if (lunPanelElements.petDanceBtn) setText(lunPanelElements.petDanceBtn, t(window.PetDanceActive ? "petDanceOn" : "petDanceOff") || (window.PetDanceActive ? "Pet Dance: ⏸️" : "Pet Dance: ▶️"));
	setText(lunPanelElements.ritualBtn, t(window.RitualState === 0 ? "ritualOff" : (window.RitualState === 1 ? "ritualOn" : "ritualInverted")));
	if (lunPanelElements.partnerDanceBtn) setText(lunPanelElements.partnerDanceBtn, t(window.PartnerDanceState === 1 ? "partnerDanceOn" : (window.PartnerDanceState === 2 ? "partnerDanceInverted" : "partnerDanceOff")) || (window.PartnerDanceState === 0 ? "8 Dance: ▶️" : (window.PartnerDanceState === 1 ? "8 Dance: ⏸️" : "Rev 8: ⏸️")));
	setText(lunPanelElements.turntableBtn, t(window.TurntableActive === 1 ? "turntableOn" : (window.TurntableActive === 2 ? "turntableHalf" : "turntableOff")));
	setText(lunHudElements.discordBtn, t("discordBtn"));
	setText(lunPanelElements.autoJumpBtn, t(window.AutoJumpActive ? "autoJumpOn" : "autoJumpOff"));
	setText(lunPanelElements.speedLabel, t("speedLabel"));
	setText(lunPanelElements.turnToCameraBtn, t("turnToCamera"));

	setText(lunPanelElements.resetCameraBtn, t("resetCamera"));
	setText(lunPanelElements.lockCameraBtn, lunCameraLocked ? t("unlockCamera") : t("lockCamera"));
	setText(lunPanelElements.nametagsBtn, t(NAMETAG_MODES[lunNametagMode] + "Btn"));
	setText(lunPanelElements.viewClipBtn, lunViewClip ? t("viewClipOn") : t("viewClipOff"));
	setText(lunPanelElements.walkToPortalBtn, lunWalkToPortal == -1 ? t("goTo") : t("stopWalking"));
	setText(lunPanelElements.watchBtn, t("watchBtn"));
	setText(lunPanelElements.followBtn, t("followBtn"));
	setText(lunPanelElements.stareBtn, t("stareBtn"));
	if (lunPanelElements.panelFollowBtn) setText(lunPanelElements.panelFollowBtn, lunFollowTargetName ? t("stopFollowing") : t("follow"));
	setText(lunPanelElements.gamepadSettingsBtn, t("gamepadBtn"));
	setText(lunPanelElements.pinnedQuestHeader, t("pinnedQuestHeader"));
	setText(lunHudElements.footerMsg, t("footerMsg"));
	setText(lunPanelElements.settingsHeader, t("settingsHeader"));
	if (lunPanelElements.filterToggleLabel) setText(lunPanelElements.filterToggleLabel, t("filterToggleLabel"));
	if (lunPanelElements.verboseChatToggleLabel) setText(lunPanelElements.verboseChatToggleLabel, t("hideVerboseChatToggleLabel") || "Hide Mod Chat Messages");
	if (lunPanelElements.gmChatToggleLabel) setText(lunPanelElements.gmChatToggleLabel, t("gmChatToggleLabel"));
	if (lunPanelElements.friendChatToggleLabel) setText(lunPanelElements.friendChatToggleLabel, t("friendChatToggleLabel"));
	if (lunPanelElements.mentionAlertToggleLabel) setText(lunPanelElements.mentionAlertToggleLabel, t("mentionAlertToggleLabel"));
	if (lunPanelElements.hideKnownBotsLabel) setText(lunPanelElements.hideKnownBotsLabel, t("hideKnownBotsToggleLabel"));
	if (lunPanelElements.chatTimestampLabel) setText(lunPanelElements.chatTimestampLabel, t("chatTimestampToggleLabel"));
	if (lunPanelElements.fpPitchLabel) setText(lunPanelElements.fpPitchLabel, t("firstPersonPitchLabel"));
	if (lunPanelElements.firstPersonBtn) setText(lunPanelElements.firstPersonBtn, t(lunFirstPersonActive ? "firstPersonOn" : "firstPersonOff"));
	if (lunPanelElements.freeCamBtn) setText(lunPanelElements.freeCamBtn, t(lunDroneModeActive ? "freeCamOn" : "freeCamOff"));
	if (lunPanelElements.lowHpLabel) setText(lunPanelElements.lowHpLabel, t("lowHpWarningToggleLabel"));
	if (lunPanelElements.sessionGoldLabel) setText(lunPanelElements.sessionGoldLabel, t("sessionGoldToggleLabel"));
	if (lunPanelElements.expRateUnitLabel) setText(lunPanelElements.expRateUnitLabel, t("expRateUnitToggleLabel"));
	if (lunPanelElements.expRateIntervalLabel) setText(lunPanelElements.expRateIntervalLabel, t("expRateIntervalLabel"));
	if (lunPanelElements.expRateIntervalSelect && lunPanelElements.expRateIntervalSelect.options) {
		LUN_EXP_INTERVAL_OPTIONS.forEach((minutes, index) => {
			if (lunPanelElements.expRateIntervalSelect.options[index]) {
				lunPanelElements.expRateIntervalSelect.options[index].innerText = t("expRateIntervalOption", minutes);
			}
		});
		lunPanelElements.expRateIntervalSelect.value = String(lunExpIntervalMinutes);
	}
	if (lunPanelElements.fpsPingLabel) setText(lunPanelElements.fpsPingLabel, t("fpsPingToggleLabel"));
	if (lunPanelElements.currencyTrackerLabel) setText(lunPanelElements.currencyTrackerLabel, t("currencyTrackerToggleLabel"));
	if (lunPanelElements.resetTimerLabel) setText(lunPanelElements.resetTimerLabel, t("resetTimerToggleLabel"));
	if (lunPanelElements.minigameTrackerLabel) setText(lunPanelElements.minigameTrackerLabel, t("minigameTrackerToggleLabel"));
	if (lunPanelElements.settingsCatGeneral) setText(lunPanelElements.settingsCatGeneral, "💬 " + t("settingsCatGeneral"));
	if (lunPanelElements.settingsCatHUD) setText(lunPanelElements.settingsCatHUD, "📊 " + t("settingsCatHUD"));
	if (lunPanelElements.eventBtn) lunPanelElements.eventBtn.title = t("eventInfoBtnTooltip");
	if (lunPanelElements.patchNotesBtn) lunPanelElements.patchNotesBtn.title = t("patchNotesBtnTooltip");
	if (lunPanelElements.mapBtn) lunPanelElements.mapBtn.title = t("mapModalTitle");
	if (typeof mapModalElements !== "undefined" && mapModalElements.titleLabel) mapModalElements.titleLabel.innerText = t("mapModalTitle");
	const qlBtn = document.getElementById("spkmod-settings-accounts-btn");
	if (qlBtn) {
		qlBtn.innerText = "🔑 " + t("quickLoginTitle");
		qlBtn.title = t("accountMgrBtnTooltip");
	}
	if (lunPanelElements.accentColorConfirmBtn) setText(lunPanelElements.accentColorConfirmBtn, t("confirmBtn") || "OK");
	updateMinigameUI();
	if (lunPatchNotesData && lunPatchNotesTranslatedLang !== (spkmodLang === "es-419" ? "es" : spkmodLang)) {
		translatePatchNotesToUserLang().then(() => renderPatchNotesUI());
	} else {
		renderPatchNotesUI();
	}
	if (lunPanelElements.gamepadRumbleLabel) setText(lunPanelElements.gamepadRumbleLabel, t("gamepadRumbleToggleLabel"));
	if (lunPanelElements.uiScaleLabel) setText(lunPanelElements.uiScaleLabel, t("uiScaleLabel"));
	if (lunPanelElements.gameUiScaleLabel) setText(lunPanelElements.gameUiScaleLabel, t("gameUiScaleLabel") || "Game UI Scale");
	if (lunPanelElements.droneSpeedLabel) setText(lunPanelElements.droneSpeedLabel, t("droneSpeedLabel") || "Drone Speed");
	if (lunPanelElements.hotkeysBtn) lunPanelElements.hotkeysBtn.title = t("hotkeysModalTitle") || "Hotkeys";
	if (typeof hotkeysModalElements !== "undefined" && hotkeysModalElements.headerTitle) {
		hotkeysModalElements.headerTitle.innerText = "⌨️ " + (t("hotkeysModalTitle") || "Hotkeys");
	}
	if (lunPanelElements.cameraEffectLabel) setText(lunPanelElements.cameraEffectLabel, t("cameraEffectLabel") || "Camera Effect");
	if (lunPanelElements.cameraEffectSelect && lunPanelElements.cameraEffectSelect.options) {
		if (lunPanelElements.cameraEffectSelect.options[0]) lunPanelElements.cameraEffectSelect.options[0].innerText = t("effectNone") || "Normal";
		if (lunPanelElements.cameraEffectSelect.options[1]) lunPanelElements.cameraEffectSelect.options[1].innerText = t("effectBw") || "Black & White";
		if (lunPanelElements.cameraEffectSelect.options[2]) lunPanelElements.cameraEffectSelect.options[2].innerText = t("effectSepia") || "Sepia";
		if (lunPanelElements.cameraEffectSelect.options[3]) lunPanelElements.cameraEffectSelect.options[3].innerText = t("effectMorning") || "Morning";
		if (lunPanelElements.cameraEffectSelect.options[4]) lunPanelElements.cameraEffectSelect.options[4].innerText = t("effectDusk") || "Dusk / Dawn";
		if (lunPanelElements.cameraEffectSelect.options[5]) lunPanelElements.cameraEffectSelect.options[5].innerText = t("effectNight") || "Night";
	}

	if (lunPanelElements.bgOpacityLabel) setText(lunPanelElements.bgOpacityLabel, t("bgOpacityLabel"));
	if (lunPanelElements.bgOpacitySelect && lunPanelElements.bgOpacitySelect.options) {
		if (lunPanelElements.bgOpacitySelect.options[0]) lunPanelElements.bgOpacitySelect.options[0].innerText = t("bgOpacitySolid");
		if (lunPanelElements.bgOpacitySelect.options[1]) lunPanelElements.bgOpacitySelect.options[1].innerText = t("bgOpacityTransparent");
		if (lunPanelElements.bgOpacitySelect.options[2]) lunPanelElements.bgOpacitySelect.options[2].innerText = t("bgOpacitySuperTransparent") || "Super Transparent";
		if (lunPanelElements.bgOpacitySelect.options[3]) lunPanelElements.bgOpacitySelect.options[3].innerText = t("bgOpacityGlass");
		if (lunPanelElements.bgOpacitySelect.options[4]) lunPanelElements.bgOpacitySelect.options[4].innerText = t("bgOpacityLightGlass") || "Light Glass";
		if (lunPanelElements.bgOpacitySelect.options[5]) lunPanelElements.bgOpacitySelect.options[5].innerText = t("bgOpacityHeavyGlass") || "Heavy Glass";
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
	setText(lunHudElements.sessionGoldTracker, t("sessionGoldText", "--", "--"));
	if (!lunPinnedQuestId) setText(lunHudElements.pinnedQuest.content, t("pinnedQuestDefault"));

	updateMovementButtonsUI();

	if (lunPanelElements.translateToggleLabel) setText(lunPanelElements.translateToggleLabel, t("translateToggleLabel"));
	if (lunPanelElements.translateEmailInput) lunPanelElements.translateEmailInput.placeholder = t("translateEmailPlaceholder");
	if (lunPanelElements.translateEmailInfo) lunPanelElements.translateEmailInfo.innerText = t("translateEmailTooltip");
	if (lunPanelElements.outgoingTranslateLabel) setText(lunPanelElements.outgoingTranslateLabel, t("outgoingTranslateLabel"));
	if (lunPanelElements.outgoingTranslateSelect && lunPanelElements.outgoingTranslateSelect.options && lunPanelElements.outgoingTranslateSelect.options[0]) {
		lunPanelElements.outgoingTranslateSelect.options[0].innerText = t("outgoingTranslateAuto");
	}
	document.querySelectorAll(".spkmod-clickable-line").forEach(node => {
		node.title = t("clickToTranslateTooltip");
	});
});

if (typeof refreshI18n === "function") {
	refreshI18n();
}

const lunPinnedQuestInterval = sec(60); // [SpeakiMod+] Reduced to 60s to prevent 429 Too Many Requests
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

let questManagerHooked = false;
function hookQuestManagerOnce() {
	if (questManagerHooked) return;
	if (window.questManager) {
		questManagerHooked = true;
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
	if (!window.__gameStateHooked && typeof gameState !== "undefined" && gameState) {
		if (typeof hookGameStateOnce === "function") {
			hookGameStateOnce();
		}
	}

	const currentNick = (typeof gameState !== "undefined" && gameState && (gameState.myPlayerName || gameState.myStat?.name)) || "";
	if (!currentNick || !gameState || !gameState.myStat) return;

	if (lunTickCount % 20 === 0 && typeof hookPartyTargetElement === "function") {
		hookPartyTargetElement();
	}

	if (lunTickCount % (lunTPS * 5) === 0 && typeof findBotsRadar === "function") {
		findBotsRadar(true);
	}

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


	if (gameState.chatBubbles && typeof gameState.chatBubbles.show === "function" && !gameState.chatBubbles.__speakiHooked) {
		var hkChatBubblesShow = gameState.chatBubbles.show.bind(gameState.chatBubbles);
		gameState.chatBubbles.show = (e, t, n) => {
			if (lunHideKnownBotsEnabled && isKnownBotBubbleSource(e)) return;
			return hkChatBubblesShow(e, t, filterName(n));
		};
		gameState.chatBubbles.__speakiHooked = true; // 
		console.log("[SpeakiMod+] Successfully hooked chatBubbles.show!");
	}
	var playerExp = gameState.myStat.exp;
	if (typeof playerExp !== "number" || isNaN(playerExp)) return;

	if (window._lunActiveCharacter && window._lunActiveCharacter !== currentNick) {
		window._lunActiveCharacter = currentNick;
		window._lunSessionStartExp = playerExp;
		window._lunSessionStartTime = Date.now();
		lunSessionStartGold = lunLastGold;
		lunSessionStartElif = lunLastElif;
		resetExpTracker();
	} else if (!window._lunActiveCharacter) {
		window._lunActiveCharacter = currentNick;
		if (window._lunSessionStartExp === undefined || window._lunSessionStartExp === null) {
			window._lunSessionStartExp = playerExp;
			window._lunSessionStartTime = Date.now();
		}
	}

	if (window._lunSessionStartExp === undefined || window._lunSessionStartExp === null) {
		window._lunSessionStartExp = playerExp;
		window._lunSessionStartTime = Date.now();
	}
	var zoneId = gameState.zoneId % 10000;
	var windowSec = lunExpIntervalMinutes * 60;
	var windowTicks = windowSec * lunTPS;

	var sampleIntervalTicks = lunTPS;
	
	var expTrackerL1 = t(lunExpRatePerHour ? "zeroExpPerHour" : "zeroExp");
	var expTrackerL2 = t("nextLevelNA");

	const now = Date.now();
	if (window.lunExpTrackerLastRawExp === undefined) {
		window.lunExpTrackerLastRawExp = playerExp;
		window.lunExpTrackerLastMaxExp = gameState.myStat.maxExp;
	}

	let trueGainedThisFrame = playerExp - window.lunExpTrackerLastRawExp;
	if (trueGainedThisFrame < 0) {
		// Leveled up!
		trueGainedThisFrame = (window.lunExpTrackerLastMaxExp - window.lunExpTrackerLastRawExp) + playerExp;
	}
	
	if (trueGainedThisFrame > 3000) {
		window.lunExpTrackerIgnoredExp = (window.lunExpTrackerIgnoredExp || 0) + trueGainedThisFrame;
	}

	window.lunExpTrackerLastRawExp = playerExp;
	window.lunExpTrackerLastMaxExp = gameState.myStat.maxExp;

	const currentEffectiveExp = playerExp - (window.lunExpTrackerIgnoredExp || 0);
	
	if (!lunExpTrackerInitialized) {
		lunExpTrackerSamples = [{ time: now, exp: currentEffectiveExp }];
		lunExpTrackerStartExp = playerExp;
		lunExpTrackerLastSampleTick = now;
		lunExpTrackerInitialized = true;
	} else {
		const lastSampleExp = lunExpTrackerSamples[lunExpTrackerSamples.length - 1].exp;
		if (lastSampleExp > currentEffectiveExp) {
			resetExpTracker();
			lunExpTrackerSamples = [{ time: now, exp: playerExp }];
			lunExpTrackerStartExp = playerExp;
			lunExpTrackerLastSampleTick = now;
			lunExpTrackerInitialized = true;
		} else {
			if (now - lunExpTrackerLastSampleTick >= 1000) {
				lunExpTrackerSamples.push({ time: now, exp: currentEffectiveExp });
				lunExpTrackerLastSampleTick = now;
			}
		}
	}

	const windowMs = windowSec * 1000;
	const cutoffTime = now - windowMs;
	while (lunExpTrackerSamples.length > 1 && lunExpTrackerSamples[1].time <= cutoffTime) {
		lunExpTrackerSamples.shift();
	}
	const oldestSample = lunExpTrackerSamples[0];
	const elapsedSec = oldestSample ? Math.max(1, (now - oldestSample.time) / 1000) : 1;
	const expGained = oldestSample ? Math.max(0, currentEffectiveExp - oldestSample.exp) : 0;
	
	const divisor = windowSec;
	lunExpTrackerSpeed = divisor > 0 ? expGained / divisor : 0;
	
	const timerDisplay = (windowSec / 60) + "m avg";

	if (lunExpTrackerSpeed > 0) {
		let displayRate = Math.round(lunExpRatePerHour ? lunExpTrackerSpeed * 3600 : lunExpTrackerSpeed * 60);
		if (displayRate >= 1000000) displayRate = (displayRate / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
		else if (displayRate >= 1000) displayRate = (displayRate / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
		else displayRate = displayRate.toLocaleString();
		
		expTrackerL1 = t(lunExpRatePerHour ? "expPerHour" : "expPerMinute", displayRate, "");

		var minutesRemaining = (gameState.myStat.maxExp - playerExp) / lunExpTrackerSpeed / 60;
		if (minutesRemaining > 60) {
			var hoursRemaining = (minutesRemaining / 60).toFixed(1);
			expTrackerL2 = t("nextLevelHours", hoursRemaining);
		} else {
			expTrackerL2 = t("nextLevel", minutesRemaining.toFixed(0));
		}
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
		if (window.TurntableActive === 2) {
			if (window._turntableDir === undefined) window._turntableDir = 1;
			if (window._turntableTraveled === undefined) window._turntableTraveled = 0;
			
			const speed = 0.010;
			gameState.cameraController.cameraYaw += speed * window._turntableDir;
			window._turntableTraveled += speed * window._turntableDir;
			
			if (window._turntableTraveled >= Math.PI / 2) {
				window._turntableDir = -1;
			} else if (window._turntableTraveled <= -Math.PI / 2) {
				window._turntableDir = 1;
			}
		} else {
			gameState.cameraController.cameraYaw += 0.015;
		}
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
			const nextInterval = Math.floor(Math.random() * (100 - 25 + 1)) + 25;
			window.beyBladeNextJumpTick = lunTickCount + nextInterval;
		}
	} else {
		window.beyBladeNextJumpTick = 0;
	}
	lunAutoTravelTarget = null;
	lunTickCount++;
	lunSleep--;

	setText(lunHudElements.playersNearby, t("playersNearby", gameState.remotePlayers?.remotePlayers?.size ?? 0));
	setText(lunHudElements.zoneId, t("zoneId", zoneId));
	setText(lunHudElements.expTrackerL1, expTrackerL1);
	setText(lunHudElements.expTrackerL2, expTrackerL2);

	if (lunMenuFoldingLevel < 2 && lunTickCount >= lunChannelTrackerNextTicks) {
		const token = getAuthToken();
		if (!token) {
			lunChannelTrackerNextTicks = lunTickCount + (5000 / lunTPS);
		} else {
			fetch("https://sr1.overture.io.kr/api/realtime/channels", {
				"method": "GET",
				"headers": {
					"authorization": `Bearer ${token}`
				},
				"mode": "cors"
			}).then(async x => {
				if (!x.ok) {
					setText(lunHudElements.channelTracker, t("channelTrackerError", x.status));
					return;
				}
				var resp = (await x.json());
				if (!Array.isArray(resp)) {
					setText(lunHudElements.channelTracker, t("channelTrackerError", "Format"));
					return;
				}

				var totalPop = resp.reduce((sum, ch) => sum + (ch.population || 0), 0);
				setText(lunHudElements.channelTracker,
					resp.map(ch => t("channelTracker", ch.channel, ch.population, ch.capacity)).join("\n")
					+ "\n" + t("totalPlayersOnline", totalPop.toLocaleString()));
			}).catch(err => {
				console.warn("[SpeakiMod+] Channel tracker fetch failed:", err);
				setText(lunHudElements.channelTracker, t("channelTrackerError", "Net"));
			});

			lunChannelTrackerNextTicks = lunTickCount + lunChannelTrackerWindow;
		}
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
			lunLastSpkCoin = resp.find(i => i.itemId === 5)?.quantity ?? 0;

			const formatCurrency = (num) => {
				if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
				if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
				return num.toLocaleString();
			};

			setText(lunHudElements.currencyTracker, t("currencyTracker", formatCurrency(lunLastGold), formatCurrency(lunLastElif), formatCurrency(lunLastSpkCoin)));

			if (lunSessionStartGold === null) {
				lunSessionStartGold = lunLastGold;
				window._lunSessionStartTime = window._lunSessionStartTime || Date.now();
			}
			if (lunSessionStartElif === null) {
				lunSessionStartElif = lunLastElif;
			}
			if (lunSessionStartSpkCoin === null) {
				lunSessionStartSpkCoin = lunLastSpkCoin;
			}
			const diff = lunLastGold - lunSessionStartGold;
			const hours = (Date.now() - window._lunSessionStartTime) / 3600000;
			const gph = hours > 0 ? (diff / hours).toFixed(0) : 0;
			const prefix = diff >= 0 ? "+" : "";
			let gphStr = Number(gph).toLocaleString();
			if (Math.abs(gph) >= 1000) {
				gphStr = (gph / 1000).toFixed(1).replace(/\.0$/, '') + "k";
			}
			setText(lunHudElements.sessionGoldTracker, t("sessionGoldText", `${prefix}${diff.toLocaleString()}`, `${prefix}${gphStr}`));
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

	if ((lunMinigameTrackerEnabled || (lunHudElements.eventModal && !lunHudElements.eventModal.classList.contains("hidden")) || (lunHudElements.statsModal && !lunHudElements.statsModal.classList.contains("hidden"))) && lunTickCount >= lunMinigameTrackerNextTicks) {
		fetchMinigameStatus();
		lunMinigameTrackerNextTicks = lunTickCount + lunMinigameTrackerWindow;
	}

	if (lunNametagMode === 2 || lunFriendChatHighlightEnabled) {
		fetchFriendsList();
	}

	let partyNames = null;
	gameState.remotePlayers.remotePlayers.forEach(t => {
		const sprite = findNametagSprite(t.container);
		if (sprite) {
			if (lunNametagMode === 0) {
				sprite.visible = true;
			} else if (lunNametagMode === 3) {
				sprite.visible = false;
			} else if (lunNametagMode === 1) {
				if (partyNames === null) {
					partyNames = new Set(Array.from(document.querySelectorAll('.sr-party__name')).map(el => el.innerText.trim().toLowerCase()));
				}
				const pName = (t.info?.name || "").trim().toLowerCase();
				sprite.visible = partyNames.has(pName);
			} else if (lunNametagMode === 2) {
				const pName = (t.info?.name || "").trim().toLowerCase();
				sprite.visible = lunFriendNicknames.has(pName);
			}
		}
	});
	updateKnownBotVisibility();
	hookKnownBotHeartEmotes();
	hookKnownBotPlayerEmotesForAll();

	if (gameState && gameState.myStat) {
		const currentLevel = gameState.myStat.level;
		const currentName = (typeof gameState !== 'undefined' && (gameState.myPlayerName || gameState.myStat?.name)) || document.querySelector('.sr-player-card__name')?.innerText?.trim() || "";
		if (window._lunLastLevel !== currentLevel || window._lunLastName !== currentName) {
			window._lunLastLevel = currentLevel;
			window._lunLastName = currentName;
			updateDynamicStyles();
			if (typeof updateHudBgDropdown === "function") updateHudBgDropdown();
		}
	}

	

	if (lunWalkToPortal != -1 && zoneId) {
		const startZone = (zoneId - 0) % 10000;
		const endZone = (lunWalkToPortal - 0) % 10000;
		
		let path = null;
		if (startZone === endZone) {
			path = [];
		} else {
			let queue = [startZone];
			let visited = new Set();
			visited.add(startZone);
			let parentMap = {};
			
			while (queue.length > 0) {
				let curr = queue.shift();
				if (curr === endZone) {
					path = [];
					let trace = endZone;
					while (trace !== startZone) {
						path.unshift(trace);
						trace = parentMap[trace];
					}
					break;
				}
				let neighbors = Portals[curr];
				if (neighbors) {
					for (let n in neighbors) {
						let nz = parseInt(n);
						if (!visited.has(nz)) {
							visited.add(nz);
							parentMap[nz] = curr;
							queue.push(nz);
						}
					}
				}
			}
		}

		if (path === null) {
			chatLog(t("noPathMsg", startZone, -1, endZone, -1));
			resetWalkToPortal();
			return;
		}

		if (path.length === 0) {
			resetWalkToPortal();
			chatLog(t("arrivedMsg"));
			return;
		} else {
			const targetZone = path[0];

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

let lunChatScrollEl = null;
let lunChatUserScrolledUp = false;

function getChatScrollContainer() {
	const log = document.querySelector(".sr-chatbox__log");
	if (!log) return null;
	if (log.scrollHeight > log.clientHeight || log.scrollTop > 0) return log;
	if (log.parentElement && (log.parentElement.scrollHeight > log.parentElement.clientHeight || log.parentElement.scrollTop > 0)) {
		return log.parentElement;
	}
	return log;
}

function updateChatScrollTracking() {
	const el = getChatScrollContainer();
	if (el && el !== lunChatScrollEl) {
		lunChatScrollEl = el;
		lunChatScrollEl.addEventListener("scroll", () => {
			const distFromBottom = lunChatScrollEl.scrollHeight - lunChatScrollEl.scrollTop - lunChatScrollEl.clientHeight;
			lunChatUserScrolledUp = distFromBottom > 45;
		}, { passive: true });
	}
	return el;
}

var hkChatBoxAppend = (id, name, msg) => {
	if (window.__speakiOrigChatBoxAppend) return window.__speakiOrigChatBoxAppend(id, name, msg);
	if (typeof gameState !== "undefined" && gameState?.chatBox?.append) return gameState.chatBox.append(id, name, msg);
};

function hookGameStateOnce() {
	if (typeof gameState === "undefined" || !gameState) return false;
	if (window.__gameStateHooked) return true;
	window.__gameStateHooked = true;
	if (window.spkmodDebug) spkmodDebug.log("Initializing in-game GameState hooks...");

	if (gameState.combatAssist && typeof gameState.combatAssist.update === "function" && !gameState.combatAssist.__speakiHooked) {
		const origCombatAssistUpdate = gameState.combatAssist.update.bind(gameState.combatAssist);
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

			let baseMove = origCombatAssistUpdate(e);
			
			if (lunDroneModeActive) {
				return { moveDir: { x: 0, z: 0 }, castSkillId: null };
			}
			
			if (gamepadMoveVector) {
				return {
					moveDir: gamepadMoveVector,
					castSkillId: null
				};
			}

			if (window.RitualState > 0 && ritualCenter) {
				const pp = getPlayerPos();
				const dx = pp.x - ritualCenter.x;
				const dz = pp.z - ritualCenter.z;
				let currentAngle = Math.atan2(dx, dz);

				currentAngle += (window.RitualState === 2 ? -0.045 : 0.045);

				const targetX = ritualCenter.x + Math.sin(currentAngle) * RITUAL_RADIUS;
				const targetZ = ritualCenter.z + Math.cos(currentAngle) * RITUAL_RADIUS;

				ritualEmoteTick++;
				if (ritualEmoteTick % 30 === 0) {
					if (ritualEmoteTick % 60 === 0) {
						if (typeof gameState !== "undefined" && gameState && typeof gameState.sendEmoteNow === "function") {
							gameState.sendEmoteNow(Emotes.Jump);
						}
					} else {
						triggerHearts();
					}
				}

				return {
					moveDir: normalizeVector(targetX - pp.x, targetZ - pp.z),
					castSkillId: null
				};
			}

			if (window.PartnerDanceState > 0 && partnerDanceCenter) {
				const pp = getPlayerPos();
				partnerDanceTick++;
				
				const stateDir = window.PartnerDanceState === 1 ? 1 : -1;
				const phase = partnerDanceIsClockwise ? 0 : Math.PI;
				const scale = DANCE_RADIUS * 1.5;
				
				if (typeof window.pd_t === "undefined" || window.pd_reset) {
					window.pd_t = phase;
					window.pd_lastPos = { x: pp.x, z: pp.z };
					window.pd_reset = false;
				}
				
				const distMoved = Math.hypot(pp.x - window.pd_lastPos.x, pp.z - window.pd_lastPos.z);
				window.pd_lastPos = { x: pp.x, z: pp.z };
				
				let t_advance = distMoved * 0.4;
				if (t_advance < 0.01) t_advance = 0.01;
				
				window.pd_t += t_advance * stateDir;
				
				const t_target = window.pd_t + (0.8 * stateDir);
				
				const rawX_target = (scale * Math.cos(t_target)) / (1 + Math.pow(Math.sin(t_target), 2));
				const rawZ_target = (scale * Math.sin(t_target) * Math.cos(t_target)) / (1 + Math.pow(Math.sin(t_target), 2));
				
				const targetX = partnerDanceCenter.x + rawX_target;
				const targetZ = partnerDanceCenter.z + rawZ_target;
				
				if (partnerDanceTick % 40 === 0) {
					if (partnerDanceTick % 80 === 0) {
						if (typeof gameState !== "undefined" && gameState && typeof gameState.sendEmoteNow === "function") {
							gameState.sendEmoteNow(Emotes.Jump);
						}
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
		};
		gameState.combatAssist.__speakiHooked = true;
	}

	if (gameState.cameraController && typeof gameState.cameraController.computeCameraTargetPosition === "function" && !gameState.cameraController.__speakiComputeHooked) {
		const origComputeCameraTargetPosition = gameState.cameraController.computeCameraTargetPosition.bind(gameState.cameraController);
		gameState.cameraController.computeCameraTargetPosition = (pos) => {
			if (lunCameraLocked) return undefined;
			const targetPos = origComputeCameraTargetPosition(pos);
			if (lunFirstPersonActive && targetPos) {
				targetPos.y = (pos.y || 0) + 1.25; 
			}
			return targetPos;
		};
		gameState.cameraController.__speakiComputeHooked = true;
	}

	if (gameState.cameraController && typeof gameState.cameraController.getObstacles === "function" && !gameState.cameraController.__speakiObstaclesHooked) {
		const origGetObstacles = gameState.cameraController.getObstacles.bind(gameState.cameraController);
		gameState.cameraController.getObstacles = () => lunViewClip ? [] : origGetObstacles();
		gameState.cameraController.__speakiObstaclesHooked = true;
	}

	if (typeof gameState.trySendChat === "function" && !gameState.__speakiTrySendChatHooked) {
		const origTrySendChat = gameState.trySendChat.bind(gameState);
		gameState.trySendChat = (msg) => {
			if (msg && msg.startsWith("!")) {
				const cmd = msg.substring(1).split(" ");
				if (window.spkmodDebug) spkmodDebug.log("Chat command executed:", cmd[0], cmd.slice(1));
				switch (cmd[0]) {
					case "watch":
						watchPlayer(cmd[1]);
						break;
					case "follow":
						followPlayer(cmd[1]);
						break;
					case "stare":
						stareAtPlayer(cmd[1]);
						break;
					case "players":
					case "who":
						showPlayersRadar(cmd[1]);
						break;
					case "findbots":
						if (typeof findBotsRadar === "function") findBotsRadar();
						break;

					case "pos":
					case "loc":
					case "zone":
						if (gameState && gameState.playerContainer) {
							const pos = gameState.playerContainer.position;
							const zid = gameState.zoneId || "Unknown";
							chatLog(`ZoneID: ${zid} | Pos: X:${Math.round(pos.x)}, Y:${Math.round(pos.y)}, Z:${Math.round(pos.z)}`);
						}
						break;
					case "dance":
						if (typeof gameState !== "undefined" && gameState && typeof gameState.sendEmoteNow === "function") {
							gameState.sendEmoteNow(Emotes.Dance);
						}
						break;
					case "hearts":
						triggerHearts();
						break;
					case "pet":
					case "pat":
						triggerPetSequence();
						break;
					case "joayo":
					case "chowayo":
						if (typeof gameState !== "undefined" && gameState && typeof gameState.sendEmoteNow === "function") {
							gameState.sendEmoteNow(Emotes.MinigameJoayo);
						}
						break;
					case "uiscale":
						const newScale = parseFloat(cmd[1]);
						if (!isNaN(newScale) && newScale >= 0.5 && newScale <= 2) {
							lunGameUiScale = newScale;
							if (window.localStorage) localStorage.setItem("spkmod-uiscale", newScale);
							const appEl = document.getElementById("app");
							if (appEl) appEl.style.zoom = ""; // Clear old buggy zoom
							if (typeof updateDynamicStyles === "function") updateDynamicStyles();
							if (lunPanelElements.gameUiScaleSlider) lunPanelElements.gameUiScaleSlider.value = newScale;
							chatLog("Game UI scale set to " + newScale);
						} else {
							chatLog("Usage: /uiscale [0.5 - 2.0] (Current: " + (lunGameUiScale || 1) + ")");
						}
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
							chatLog(t("fpPitchSetMsg", lunFirstPersonPitch));
						} else {
							chatLog(t("fpPitchUsageMsg", lunFirstPersonPitch));
						}
						break;
					case "ritual":
						toggleRitual();
						break;
					case "autojump":
						if (lunPanelElements.autoJumpBtn) lunPanelElements.autoJumpBtn.click();
						break;
					case "autohearts":
						if (lunPanelElements.autoHeartsBtn) lunPanelElements.autoHeartsBtn.click();
						break;
					case "firstperson":
					case "fp":
						if (lunPanelElements.firstPersonBtn) lunPanelElements.firstPersonBtn.click();
						break;
					case "camlock":
						if (lunPanelElements.lockCameraBtn) lunPanelElements.lockCameraBtn.click();
						break;
					case "viewclip":
						if (lunPanelElements.viewClipBtn) lunPanelElements.viewClipBtn.click();
						break;
					case "turntocam":
					case "turn":
						if (lunPanelElements.turnToCameraBtn) lunPanelElements.turnToCameraBtn.click();
						break;
					case "moonwalk":
						if (document.getElementById("spkmod-moonwalk-main-btn")) document.getElementById("spkmod-moonwalk-main-btn").click();
						break;
					case "hypershake":
						if (lunPanelElements.hyperShakeBtn) lunPanelElements.hyperShakeBtn.click();
						break;
					case "beyblade":
						if (document.getElementById("spkmod-beyblade-main-btn")) document.getElementById("spkmod-beyblade-main-btn").click();
						break;
					case "reversebeyblade":
						if (document.getElementById("spkmod-reversebeyblade-main-btn")) document.getElementById("spkmod-reversebeyblade-main-btn").click();
						break;
					case "speed":
						if (cmd[1]) {
							const speed = parseInt(cmd[1], 10);
							if (!isNaN(speed) && speed >= 1 && speed <= 10) {
								window.BeyBladeSpeed = speed;
								if (window.localStorage) localStorage.setItem("spkmod-beyblade-speed", speed);
								if (lunPanelElements.speedValue) setText(lunPanelElements.speedValue, "x" + speed);
								updateBeyBladeButtonText();
								updateReverseBeyBladeButtonText();
								chatLog(t("speedSetMsg", speed));
							} else {
								chatLog(t("speedInvalidMsg"));
							}
						} else {
							chatLog(t("speedUsageMsg"));
						}
						break;
					default:
						chatLog(t("unknownCmdMsg", cmd[0]));
						chatLog(t("availableCmdsMsg"));
						break;
				}
				return;
			}

			if (typeof msg === "string" && msg.startsWith(".")) {
				const match = msg.match(/^\.([a-zA-Z\-]+)(?::|\s+)(.+)$/s);
				if (match) {
					const prefix = match[1].toLowerCase();
					const targetLang = lunOutgoingLangPrefixes[prefix];
					if (targetLang) {
						const sourceText = match[2].trim();
						if (!sourceText) return;
						const sourceLang = getEffectiveSourceLang(sourceText);
						if (sourceLang === targetLang) {
							return origTrySendChat(sourceText);
						}
						translateChatText(sourceText, sourceLang, targetLang).then(translated => {
							if (translated && translated.trim()) {
								origTrySendChat(translated.trim());
							} else {
								chatLog(t("outgoingTranslateFailed", sourceText));
								origTrySendChat(sourceText);
							}
						}).catch(err => {
							console.warn("[SpeakiMod+] Outgoing translation error:", err);
							chatLog(t("outgoingTranslateFailed", sourceText));
							origTrySendChat(sourceText);
						});
						return;
					}
				}
			}

			return origTrySendChat(msg);
		};
		gameState.__speakiTrySendChatHooked = true;
	}

	if (gameState.chatBox && typeof gameState.chatBox.append === "function" && !gameState.chatBox.__speakiAppendHooked) {
		const origChatBoxAppend = gameState.chatBox.append.bind(gameState.chatBox);
		window.__speakiOrigChatBoxAppend = origChatBoxAppend;
		hkChatBoxAppend = origChatBoxAppend;
		gameState.chatBox.append = (id, name, msg) => {
			const scrollEl = updateChatScrollTracking();
			const wasAtBottom = !lunChatUserScrolledUp && (!scrollEl || (scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight <= 45));

			let filteredName = filterName(name);
			const filteredMsg = filterName(msg);

			const myName = (typeof gameState !== 'undefined' && (gameState.myPlayerName || gameState.myStat?.name)) || document.querySelector('.sr-player-card__name')?.innerText?.trim() || "";
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
							if (lunFriendChatHighlightEnabled && name && lunFriendNicknames.has(name.trim().toLowerCase())) {
								senderEl.classList.add("spkmod-friend-sender");
							}
							let currentText = senderEl.innerText;
							
							if (lunChatTimestampsEnabled) {
								const d = new Date();
								const ts = `[${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}] `;
								currentText = ts + currentText;
							}

							senderEl.innerText = currentText;
						}
					}
					if (wasAtBottom && !lunChatUserScrolledUp && scrollEl) {
						scrollEl.scrollTop = scrollEl.scrollHeight;
					}
				});
			}

			const result = origChatBoxAppend(id, filteredName, filteredMsg);

			if (wasAtBottom && scrollEl) {
				requestAnimationFrame(() => {
					if (!lunChatUserScrolledUp && scrollEl) {
						scrollEl.scrollTop = scrollEl.scrollHeight;
					}
				});
			}

			maybeTranslateChatMessage(id, name, filteredMsg);
			return result;
		};
		gameState.chatBox.__speakiAppendHooked = true;
	}

	hookRemotePlayersOnce();
	if (typeof refreshI18n === "function") refreshI18n();
	if (window.spkmodDebug) spkmodDebug.log("In-game GameState hooks successfully installed.");
	return true;
}

window.hookGameStateOnce = hookGameStateOnce;
hookGameStateOnce();

function appendColoredChatLine(id, name, text) {
	const scrollEl = updateChatScrollTracking();
	const wasAtBottom = !lunChatUserScrolledUp && (!scrollEl || (scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight <= 45));

	observeNextChatNode(text, (bodyText) => {
		bodyText.classList.add("spkmod-translated-line");
		if (wasAtBottom && !lunChatUserScrolledUp && scrollEl) {
			scrollEl.scrollTop = scrollEl.scrollHeight;
		}
	});

	hkChatBoxAppend(id, name, text);

	if (wasAtBottom && scrollEl) {
		requestAnimationFrame(() => {
			if (!lunChatUserScrolledUp && scrollEl) {
				scrollEl.scrollTop = scrollEl.scrollHeight;
			}
		});
	}
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

function hookRemotePlayersOnce() {
	if (typeof gameState === 'undefined' || !gameState?.remotePlayers?.remotePlayers) return;
	if (gameState.remotePlayers.remotePlayers.__speakiHooked) return;
	gameState.remotePlayers.remotePlayers.__speakiHooked = true;

	const hkRemotePlayersSet = gameState.remotePlayers.remotePlayers.set.bind(gameState.remotePlayers.remotePlayers);
	gameState.remotePlayers.remotePlayers.set = function (key, value) {
		if (value && value.info && typeof value.info.name === "string") {
			value.info.name = filterName(value.info.name);
		}
		hookKnownBotPlayerEmotes(value);
		return hkRemotePlayersSet(key, value);
	};

	gameState.remotePlayers.remotePlayers.forEach(v => {
		if (v && v.info && typeof v.info.name === "string") {
			v.info.name = filterName(v.info.name);
		}
	});
	hookKnownBotHeartEmotes();
	hookKnownBotPlayerEmotesForAll();
}
hookRemotePlayersOnce();

setInterval(tick, 50);

const hudWindow = document.getElementById("spkmod-hud");
if (hudWindow) {
	const dragHandle = document.getElementById("spkmod-drag-btn");
	const footerHandle = document.getElementById("spkmod-footer");
	const headerRow = document.getElementById("spkmod-header-row");
	const headerBtn = document.getElementById("spkmod-header");
	const mainCard = document.getElementById("spkmod-main");
	makeDraggable(hudWindow, [hudWindow, mainCard, headerRow, headerBtn, dragHandle, footerHandle].filter(Boolean));
}

let lunLastFrameTime = performance.now();
let lunFrameCount = 0;
lunCurrentFps = 0;
lunCurrentPing = "--";
let lunLastPingTime = performance.now() + 3000; // 3s initial delay on boot
let lunPingInFlight = false;
let lunPingBackoffUntil = 0;
const LUN_PING_INTERVAL_MS = 5000; // Sample every 5 seconds

function updatePingMeasurement(sampleMs) {
	if (typeof sampleMs !== 'number' || isNaN(sampleMs) || sampleMs <= 0) return;
	const rounded = Math.round(sampleMs);
	if (lunCurrentPing === "--") {
		lunCurrentPing = rounded;
	} else {
		lunCurrentPing = Math.round(rounded * 0.6 + Number(lunCurrentPing) * 0.4);
	}
	lunLastPingTime = performance.now();
	if (lunFpsPingEnabled && lunHudElements.fpsPingTracker) {
		setText(lunHudElements.fpsPingTracker, t("fpsPingText", lunCurrentFps, lunCurrentPing));
	}
}

const originalFetch = window.fetch;
window.fetch = async function(...args) {
	const start = performance.now();
	try {
		const response = await originalFetch.apply(this, args);
		if (args[0] && typeof args[0] === "string" && args[0].includes("api/")) {
			updatePingMeasurement(performance.now() - start);
		}
		return response;
	} catch (e) {
		throw e;
	}
};

async function performActivePing() {
	const now = performance.now();
	if (lunPingInFlight || now < lunPingBackoffUntil) return;
	if (typeof document !== 'undefined' && document.hidden) return;

	const isHudActive = !!(lunFpsPingEnabled && lunHudElements.fpsPingTracker && lunHudElements.fpsPingTracker.style.display !== "none");
	const isStatsModalActive = !!(typeof lunHudElements !== 'undefined' && lunHudElements.statsModal && !lunHudElements.statsModal.classList.contains("hidden"));
	if (!isHudActive && !isStatsModalActive) return;

	if (now - lunLastPingTime < LUN_PING_INTERVAL_MS) return;

	lunPingInFlight = true;
	const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
	const timeoutId = controller ? setTimeout(() => controller.abort(), 3000) : null;
	const start = performance.now();

	try {
		const res = await originalFetch("https://sr1.overture.io.kr/api/notices/latest", {
			method: "GET",
			cache: "no-store",
			signal: controller ? controller.signal : undefined
		});
		if (timeoutId) clearTimeout(timeoutId);
		if (res.ok || res.status === 204 || res.status === 401) {
			updatePingMeasurement(performance.now() - start);
		} else if (res.status >= 500) {
			lunPingBackoffUntil = performance.now() + 10000;
		}
	} catch (e) {
		if (timeoutId) clearTimeout(timeoutId);
		lunPingBackoffUntil = performance.now() + 5000;
	} finally {
		lunPingInFlight = false;
	}
}

function fpsLoop() {
	const now = performance.now();
	lunFrameCount++;

	if (now - lunLastFrameTime >= 1000) {
		lunCurrentFps = lunFrameCount;
		lunFrameCount = 0;
		if (lunFpsPingEnabled && lunHudElements.fpsPingTracker) {
			setText(lunHudElements.fpsPingTracker, t("fpsPingText", lunCurrentFps, lunCurrentPing));
		}

		if (lunResetTimerEnabled && lunHudElements.resetTimerTracker) {
			const nowUtc = new Date();
			const kstOffset = 9 * 60 * 60 * 1000;
			const kstNow = new Date(nowUtc.getTime() + kstOffset);
			const kstNextMidnight = new Date(kstNow);
			kstNextMidnight.setUTCHours(24, 0, 0, 0); // Next midnight in KST
			const diffMs = kstNextMidnight.getTime() - kstNow.getTime();
			const diffTotalSeconds = Math.floor(diffMs / 1000);
			const hours = Math.floor(diffTotalSeconds / 3600);
			const minutes = Math.floor((diffTotalSeconds % 3600) / 60);
			const seconds = diffTotalSeconds % 60;
			setText(lunHudElements.resetTimerTracker, t("resetTimerText", 
				String(hours).padStart(2, '0'), 
				String(minutes).padStart(2, '0'),
				String(seconds).padStart(2, '0')
			));
		}

		if (typeof updateStatsModalLive === 'function' && lunHudElements.statsModal && !lunHudElements.statsModal.classList.contains("hidden")) {
			updateStatsModalLive();
		}

		performActivePing();

		lunLastFrameTime = now;
	}
	
	requestAnimationFrame(fpsLoop);
}
requestAnimationFrame(fpsLoop);

setTimeout(() => {
	fetchPatchNotesOnce();
}, 2500);

setTimeout(() => {
	if (typeof window !== "undefined" && window.__speakiErpin) {
		const cleanSignature = window.__speakiErpin.replace(/^<!--\s*/, '').replace(/\s*-->$/, '');
		console.log(cleanSignature);
		return;
	}
	fetch("https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/refs/heads/main/erpin.html")
		.then(res => res.text())
		.then(signature => {
			const cleanSignature = signature.replace(/^<!--\s*/, '').replace(/\s*-->$/, '');
			console.log(cleanSignature);
		})
		.catch(err => console.error("[SpeakiMod+] Failed to load signature:", err));
}, 15000);

function parseSemver(verStr) {
	if (!verStr || typeof verStr !== "string") return [0, 0, 0];
	const match = verStr.trim().replace(/^[vV]/, "").match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?/);
	if (!match) return [0, 0, 0];
	return [
		parseInt(match[1] || "0", 10),
		parseInt(match[2] || "0", 10),
		parseInt(match[3] || "0", 10)
	];
}

function isNewerVersion(remote, local) {
	const [rMaj, rMin, rPat] = parseSemver(remote);
	const [lMaj, lMin, lPat] = parseSemver(local);
	if (rMaj !== lMaj) return rMaj > lMaj;
	if (rMin !== lMin) return rMin > lMin;
	return rPat > lPat;
}

function getClientBuildVersion() {
	if (typeof window !== "undefined" && window.__speakiBuildVersion) {
		return String(window.__speakiBuildVersion).trim();
	}
	const isElectron = typeof window !== "undefined" && (
		typeof window.electronAPI !== "undefined" ||
		(typeof navigator !== "undefined" && /electron/i.test(navigator.userAgent || ""))
	);
	if (isElectron) {
		return "1.0.8";
	}
	return null;
}

let speakiNewsChecked = false;

function showNewsModal(remoteVer, htmlBody, stylesHtml = "") {
	let backdrop = document.getElementById("spkmod-news-modal");
	if (backdrop) {
		backdrop.style.display = "flex";
		return;
	}

	backdrop = document.createElement("div");
	backdrop.id = "spkmod-news-modal";
	backdrop.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.72); z-index: 700000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(3px);";

	const dialog = document.createElement("div");
	dialog.className = "spkmod-news-dialog";
	dialog.style.cssText = "background: #0f172a; border: 1px solid #334155; border-radius: 12px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9); width: 540px; max-width: 92vw; max-height: 85vh; display: flex; flex-direction: column; overflow: hidden; color: #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";

	const header = document.createElement("div");
	header.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #1e293b; border-bottom: 1px solid #334155;";

	const headerTitle = document.createElement("div");
	headerTitle.style.cssText = "display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; color: #f8fafc;";
	headerTitle.innerHTML = `<span>📢</span> <span>${t("newsModalTitle")}</span>`;

	const closeBtn = document.createElement("button");
	closeBtn.type = "button";
	closeBtn.innerText = "✕";
	closeBtn.style.cssText = "background: transparent; border: none; color: #94a3b8; font-size: 16px; cursor: pointer; padding: 4px 8px; border-radius: 4px; line-height: 1;";
	closeBtn.onmouseenter = () => { closeBtn.style.color = "#ffffff"; closeBtn.style.background = "#334155"; };
	closeBtn.onmouseleave = () => { closeBtn.style.color = "#94a3b8"; closeBtn.style.background = "transparent"; };
	closeBtn.onclick = () => { backdrop.style.display = "none"; };

	header.appendChild(headerTitle);
	header.appendChild(closeBtn);

	const content = document.createElement("div");
	content.style.cssText = "padding: 16px; overflow-y: auto; flex: 1; max-height: 48vh; font-size: 13px; line-height: 1.5;";
	content.innerHTML = (stylesHtml || "") + htmlBody;

	const langTabs = content.querySelectorAll(".spk-lang-tab");
	const langSections = content.querySelectorAll(".spk-news-section");

	function setModalNewsLang(targetLang) {
		let matched = false;
		langTabs.forEach(tab => {
			const isMatch = tab.getAttribute("data-target-lang") === targetLang;
			if (isMatch) matched = true;
			tab.classList.toggle("active", isMatch);
		});
		langSections.forEach(sec => {
			sec.classList.toggle("active", sec.getAttribute("data-lang") === targetLang);
		});
		if (!matched && targetLang !== "en") {
			setModalNewsLang("en");
		}
	}

	langTabs.forEach(tab => {
		tab.addEventListener("click", () => {
			const lang = tab.getAttribute("data-target-lang");
			if (lang) setModalNewsLang(lang);
		});
	});

	const initialLang = (typeof spkmodLang !== "undefined" && spkmodLang) ? spkmodLang : "en";
	setModalNewsLang(initialLang);

	content.querySelectorAll("a").forEach(a => {
		a.addEventListener("click", e => {
			e.preventDefault();
		});
	});

	const copySection = document.createElement("div");
	copySection.style.cssText = "padding: 12px 16px; background: rgba(15, 23, 42, 0.95); border-top: 1px solid #1e293b; border-bottom: 1px solid #1e293b;";

	const copyLabel = document.createElement("div");
	copyLabel.style.cssText = "font-size: 11px; font-weight: 600; color: #94a3b8; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;";
	copyLabel.innerText = t("patchNotesReleasesLink");

	const copyRow = document.createElement("div");
	copyRow.style.cssText = "display: flex; gap: 8px; align-items: center;";

	const copyInput = document.createElement("input");
	copyInput.type = "text";
	copyInput.readOnly = true;
	copyInput.value = "https://github.com/DJTOMATO/SpeakiRPG/releases";
	copyInput.style.cssText = "flex: 1; background: #020617; border: 1px solid #334155; border-radius: 6px; padding: 7px 10px; color: #38bdf8; font-family: monospace; font-size: 12px; outline: none; cursor: text;";
	copyInput.onclick = () => copyInput.select();

	const copyBtn = document.createElement("button");
	copyBtn.type = "button";
	copyBtn.style.cssText = "background: linear-gradient(135deg, #3b82f6, #2563eb); border: none; border-radius: 6px; color: #ffffff; padding: 7px 14px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 5px; white-space: nowrap; transition: all 0.15s ease;";
	copyBtn.innerHTML = `<span class="spkmod-news-icon">📋</span><span class="spkmod-news-btn-text">${t("newsCopyLinkBtn")}</span>`;

	copyBtn.onclick = () => {
		const url = copyInput.value;
		const handleSuccess = () => {
			const iconEl = copyBtn.querySelector(".spkmod-news-icon");
			const textEl = copyBtn.querySelector(".spkmod-news-btn-text");
			if (iconEl) iconEl.innerText = "✓";
			if (textEl) textEl.innerText = t("newsCopied");
			copyBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";
			setTimeout(() => {
				if (iconEl) iconEl.innerText = "📋";
				if (textEl) textEl.innerText = t("newsCopyLinkBtn");
				copyBtn.style.background = "linear-gradient(135deg, #3b82f6, #2563eb)";
			}, 2500);
		};

		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(url).then(handleSuccess).catch(() => {
				copyInput.select();
				document.execCommand("copy");
				handleSuccess();
			});
		} else {
			copyInput.select();
			document.execCommand("copy");
			handleSuccess();
		}
	};

	copyRow.appendChild(copyInput);
	copyRow.appendChild(copyBtn);
	copySection.appendChild(copyLabel);
	copySection.appendChild(copyRow);

	const footer = document.createElement("div");
	footer.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #1e293b;";

	const dismissBtn = document.createElement("button");
	dismissBtn.type = "button";
	dismissBtn.innerText = t("newsDismissBtn");
	dismissBtn.style.cssText = "background: transparent; border: 1px solid #475569; border-radius: 6px; color: #94a3b8; padding: 6px 12px; font-size: 11px; cursor: pointer; transition: all 0.15s ease;";
	dismissBtn.onmouseenter = () => { dismissBtn.style.color = "#ffffff"; dismissBtn.style.borderColor = "#64748b"; };
	dismissBtn.onmouseleave = () => { dismissBtn.style.color = "#94a3b8"; dismissBtn.style.borderColor = "#475569"; };
	dismissBtn.onclick = () => {
		try {
			localStorage.setItem("spkmod-dismissed-news-version", remoteVer);
		} catch (_) {}
		backdrop.style.display = "none";
	};

	const closeFooterBtn = document.createElement("button");
	closeFooterBtn.type = "button";
	closeFooterBtn.innerText = "✕";
	closeFooterBtn.style.cssText = "background: #334155; border: none; border-radius: 6px; color: #f8fafc; padding: 6px 14px; font-size: 12px; font-weight: 600; cursor: pointer;";
	closeFooterBtn.onclick = () => { backdrop.style.display = "none"; };

	footer.appendChild(dismissBtn);
	footer.appendChild(closeFooterBtn);

	dialog.appendChild(header);
	dialog.appendChild(content);
	dialog.appendChild(copySection);
	dialog.appendChild(footer);
	backdrop.appendChild(dialog);

	backdrop.addEventListener("click", e => {
		if (e.target === backdrop) {
			backdrop.style.display = "none";
		}
	});

	document.body.appendChild(backdrop);
}

async function checkAndShowNewsPopup() {
	if (speakiNewsChecked) return;
	const clientVer = getClientBuildVersion();
	if (!clientVer) return;
	speakiNewsChecked = true;

	try {
		const res = await fetch(`https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/refs/heads/main/news.html?_t=${Date.now()}`, {
			cache: "no-store"
		});
		if (!res.ok) return;
		const htmlText = await res.text();
		const parser = new DOMParser();
		const doc = parser.parseFromString(htmlText, "text/html");
		const metaEl = doc.querySelector('meta[name="min-build-version"]');
		const remoteVer = metaEl ? metaEl.getAttribute("content") : null;
		if (!remoteVer) return;

		try {
			const dismissedVer = localStorage.getItem("spkmod-dismissed-news-version");
			if (dismissedVer && dismissedVer === remoteVer) return;
		} catch (_) {}

		if (!isNewerVersion(remoteVer, clientVer)) return;

		const styleEl = doc.head ? doc.head.querySelector("style") : null;
		const stylesHtml = styleEl ? styleEl.outerHTML : "";
		const bodyHtml = doc.body ? doc.body.innerHTML : htmlText;
		showNewsModal(remoteVer, bodyHtml, stylesHtml);
	} catch (e) {
		console.warn("[SpeakiMod+] Failed to check news/update:", e);
	}
}

setTimeout(() => {
	if (typeof gameState !== "undefined" && gameState) {
		checkAndShowNewsPopup();
	}
}, 4500);

window.addEventListener("keydown", e => {
	if (e.key !== "p" && e.key !== "P" && e.code !== "KeyP") return;
	if (e.ctrlKey || e.altKey || e.metaKey) return;

	const active = document.activeElement;
	if (active) {
		const tag = active.tagName ? active.tagName.toLowerCase() : "";
		if (tag === "input" || tag === "textarea" || active.isContentEditable) {
			return;
		}
	}

	e.preventDefault();
	const isHidden = document.body.classList.toggle("spkmod-ui-hidden");
	chatLog(t(isHidden ? "uiHiddenMsg" : "uiShownMsg"));
});

window.addEventListener("keydown", e => {
	if (e.key !== "F2" && e.code !== "F2") return;
	if (e.ctrlKey || e.altKey || e.metaKey) return;

	const active = document.activeElement;
	if (active) {
		const tag = active.tagName ? active.tagName.toLowerCase() : "";
		if (tag === "input" || tag === "textarea" || active.isContentEditable) {
			return;
		}
	}

	e.preventDefault();
	if (typeof toggleSettingsModal === "function") {
		toggleSettingsModal();
	}
});

window.addEventListener("keydown", e => {
	if (e.key !== "Escape" && e.code !== "Escape") return;

	const newsModal = document.getElementById("spkmod-news-modal");
	if (newsModal && newsModal.style.display !== "none") {
		e.preventDefault();
		newsModal.style.display = "none";
		return;
	}

	const picker = document.getElementById("spkmod-translate-picker");
	if (picker) {
		e.preventDefault();
		picker.remove();
		return;
	}

	if (typeof mapModalElements !== "undefined" && mapModalElements.modalWindow && mapModalElements.modalWindow.style.display !== "none") {
		e.preventDefault();
		if (typeof closeMapModal === "function") {
			closeMapModal();
		} else {
			mapModalElements.modalWindow.style.display = "none";
		}
		return;
	}

	if (typeof lunHudElements !== "undefined") {
		const candidateModals = [
			lunHudElements.settingsModal,
			lunHudElements.gamepadModal,
			lunHudElements.patchNotesModal,
			lunHudElements.eventModal,
			lunHudElements.statsModal
		].filter(m => m && !m.classList.contains("hidden"));

		if (candidateModals.length > 0) {
			e.preventDefault();
			candidateModals.sort((a, b) => {
				const za = parseInt(a.style.zIndex || window.getComputedStyle(a).zIndex, 10) || 0;
				const zb = parseInt(b.style.zIndex || window.getComputedStyle(b).zIndex, 10) || 0;
				return zb - za;
			});
			const closedModal = candidateModals[0];
			closedModal.classList.add("hidden");
			if (closedModal === lunHudElements.settingsModal && typeof toggleQuickLoginSettings === "function") {
				toggleQuickLoginSettings(false);
			}
			return;
		}
	}
});

const SPKMOD_ACCOUNTS_KEY = "spkmod-saved-accounts";
const SPKMOD_DISMISS_KEY = "spkmod-dismiss-ql-prompt";

function getSavedAccounts() {
	if (typeof window === "undefined" || !window.localStorage) return [];
	try {
		const raw = localStorage.getItem(SPKMOD_ACCOUNTS_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch (e) {
		console.warn("[SpeakiMod+] Failed to parse saved accounts:", e);
		return [];
	}
}

function maskRecoveryCode(code) {
	if (!code || typeof code !== "string") return "••••-••••";
	const clean = code.trim().toUpperCase();
	const parts = clean.split("-");
	if (parts.length >= 4) {
		return `••••-••••-••••-${parts[parts.length - 1]}`;
	}
	if (clean.length > 4) {
		return "••••-••••-" + clean.slice(-4);
	}
	return "••••-••••";
}

function saveAccountLocally(nickname, code) {
	if (!nickname || !code) return false;
	const nickClean = String(nickname).trim();
	const codeClean = String(code).trim().toUpperCase();
	if (!nickClean || codeClean.length < 8) return false;

	const accounts = getSavedAccounts();
	const existingIdx = accounts.findIndex(a => a.nickname.toLowerCase() === nickClean.toLowerCase());

	const record = {
		nickname: nickClean,
		code: codeClean,
		masked: maskRecoveryCode(codeClean),
		lastUsed: Date.now()
	};

	if (existingIdx !== -1) {
		accounts[existingIdx] = record;
	} else {
		accounts.unshift(record);
	}

	try {
		localStorage.setItem(SPKMOD_ACCOUNTS_KEY, JSON.stringify(accounts));
		return true;
	} catch (e) {
		console.error("[SpeakiMod+] Failed to store account in localStorage:", e);
		return false;
	}
}

function removeAccountLocally(nickname) {
	if (!nickname) return false;
	const nickLower = String(nickname).trim().toLowerCase();
	const accounts = getSavedAccounts().filter(a => a.nickname.toLowerCase() !== nickLower);
	try {
		localStorage.setItem(SPKMOD_ACCOUNTS_KEY, JSON.stringify(accounts));
		return true;
	} catch (e) {
		console.error("[SpeakiMod+] Failed to update accounts in localStorage:", e);
		return false;
	}
}

async function fetchCurrentRecoveryCode() {
	const token = typeof getAuthToken === "function" ? getAuthToken() : "";
	if (!token) throw new Error("No authentication token found");

	const res = await fetch("https://sr1.overture.io.kr/api/auth/recovery-code", {
		headers: {
			"Authorization": `Bearer ${token}`
		}
	});

	if (!res.ok) {
		throw new Error(`Server returned status ${res.status}`);
	}

	const data = await res.json();
	if (!data || !data.recoveryCode) {
		throw new Error("No recoveryCode property in response");
	}

	return data.recoveryCode;
}

function performQuickRecovery(account) {
	if (!account || !account.code) return;

	const executeFillAndSubmit = () => {
		const codeInput = document.querySelector(".sr-nickname-gate input[placeholder*='XXXX']");
		const continueBtn = document.querySelector(".sr-nickname-gate button.sr-btn--primary");

		if (codeInput && continueBtn) {
			codeInput.value = account.code;
			codeInput.dispatchEvent(new Event("input", { bubbles: true }));
			codeInput.dispatchEvent(new Event("change", { bubbles: true }));

			saveAccountLocally(account.nickname, account.code);

			setTimeout(() => {
				continueBtn.click();
			}, 50);
			return true;
		}
		return false;
	};

	if (executeFillAndSubmit()) return;

	const subtitleLinks = Array.from(document.querySelectorAll(".sr-nickname-gate .sr-list-item__subtitle"));
	const recoveryLink = subtitleLinks.find(el => {
		const text = (el.textContent || "").toLowerCase();
		return text.includes("recovery") || text.includes("기존") || text.includes("復元") || text.includes("復原") || text.includes("recuperación") || text.includes("existing");
	}) || subtitleLinks[subtitleLinks.length - 1];

	if (recoveryLink) {
		recoveryLink.click();
		setTimeout(executeFillAndSubmit, 60);
	}
}

function ensureQuickLoginStyles() {
	if (document.getElementById("spkmod-quick-login-styles")) return;
	const style = document.createElement("style");
	style.id = "spkmod-quick-login-styles";
	style.textContent = `
		#spkmod-quick-login-box {
			position: fixed;
			top: 50%;
			left: calc(50% + 245px);
			transform: translateY(-50%);
			width: 320px;
			max-height: 85vh;
			overflow-y: auto;
			z-index: 9999999;
			background: var(--sr-color-panel-bg, #1a1b26);
			color: var(--sr-color-text, #ffffff);
			border: .1875rem solid var(--sr-color-border-strong, #3a3b4e);
			border-radius: var(--sr-radius-lg, 12px);
			box-shadow: 0 8px 32px rgba(0,0,0,0.75);
			padding: 16px;
			box-sizing: border-box;
			font-family: inherit;
			display: flex;
			flex-direction: column;
			gap: 12px;
			pointer-events: auto;
			animation: spkmodFadeIn 0.2s ease-out;
		}
		@keyframes spkmodFadeIn {
			from { opacity: 0; transform: translateY(-50%) scale(0.95); }
			to { opacity: 1; transform: translateY(-50%) scale(1); }
		}
		@media (max-width: 960px) {
			#spkmod-quick-login-box {
				left: 50% !important;
				top: auto !important;
				bottom: 16px !important;
				transform: translateX(-50%) !important;
				width: calc(100vw - 32px) !important;
				max-width: 440px !important;
				max-height: 45vh !important;
			}
		}
		.spkmod-ql-card {
			background: rgba(255, 255, 255, 0.05);
			border: 1px solid rgba(255, 255, 255, 0.1);
			border-radius: 8px;
			padding: 10px 12px;
			display: flex;
			flex-direction: column;
			gap: 8px;
			transition: background 0.15s ease;
		}
		.spkmod-ql-card:hover {
			background: rgba(255, 255, 255, 0.09);
			border-color: rgba(255, 255, 255, 0.2);
		}
		.spkmod-ql-row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 8px;
		}
		.spkmod-ql-nick {
			font-weight: bold;
			font-size: 13px;
			color: #fff;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.spkmod-ql-masked {
			font-size: 11px;
			color: #94a3b8;
			letter-spacing: 0.5px;
			font-family: monospace;
		}
		.spkmod-ql-btn-login {
			background: var(--sr-color-primary, #3b82f6);
			color: #fff;
			border: none;
			border-radius: 6px;
			padding: 6px 12px;
			font-size: 12px;
			font-weight: bold;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 6px;
			transition: filter 0.15s;
		}
		.spkmod-ql-btn-login:hover {
			filter: brightness(1.15);
		}
		.spkmod-ql-btn-del {
			background: transparent;
			color: #ef4444;
			border: 1px solid rgba(239, 68, 68, 0.3);
			border-radius: 6px;
			padding: 4px 8px;
			font-size: 11px;
			cursor: pointer;
			transition: background 0.15s;
		}
		.spkmod-ql-btn-del:hover {
			background: rgba(239, 68, 68, 0.15);
		}
		.spkmod-ql-input {
			box-sizing: border-box;
			width: 100%;
			background: rgba(0, 0, 0, 0.25);
			border: 1px solid rgba(255, 255, 255, 0.15);
			border-radius: 6px;
			padding: 7px 10px;
			color: #fff;
			font-size: 12px;
			outline: none;
		}
		.spkmod-ql-input:focus {
			border-color: var(--sr-color-primary, #3b82f6);
		}
	`;
	document.head.appendChild(style);
}

function renderQuickLoginBox(gateEl) {
	if (!gateEl || !gateEl.isConnected) return;
	ensureQuickLoginStyles();

	let box = document.getElementById("spkmod-quick-login-box");
	if (!box) {
		box = document.createElement("div");
		box.id = "spkmod-quick-login-box";
		document.body.appendChild(box);
	}

	const accounts = getSavedAccounts();
	box.replaceChildren();

	const header = document.createElement("div");
	header.style.cssText = "display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;";
	
	const title = document.createElement("div");
	title.style.cssText = "font-weight: bold; font-size: 14px; display: flex; align-items: center; gap: 6px;";
	title.innerText = "🔑 " + t("quickLoginTitle");
	
	const countBadge = document.createElement("span");
	countBadge.style.cssText = "font-size: 11px; color: #94a3b8; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 10px;";
	countBadge.innerText = String(accounts.length);

	header.appendChild(title);
	header.appendChild(countBadge);
	box.appendChild(header);

	if (accounts.length > 0) {
		const subTitle = document.createElement("div");
		subTitle.style.cssText = "font-size: 11px; color: #94a3b8; margin-bottom: 2px;";
		subTitle.innerText = t("quickLoginSubtitle");
		box.appendChild(subTitle);

		const listContainer = document.createElement("div");
		listContainer.style.cssText = "display: flex; flex-direction: column; gap: 8px; max-height: 40vh; overflow-y: auto;";

		accounts.forEach(acc => {
			const card = document.createElement("div");
			card.className = "spkmod-ql-card";

			const topRow = document.createElement("div");
			topRow.className = "spkmod-ql-row";

			const nickSpan = document.createElement("span");
			nickSpan.className = "spkmod-ql-nick";
			nickSpan.innerText = "👤 " + acc.nickname;

			const delBtn = document.createElement("button");
			delBtn.className = "spkmod-ql-btn-del";
			delBtn.innerText = "✕";
			delBtn.title = t("quickLoginRemoveConfirm", acc.nickname);
			delBtn.onclick = (e) => {
				e.stopPropagation();
				if (window.confirm(t("quickLoginRemoveConfirm", acc.nickname))) {
					removeAccountLocally(acc.nickname);
					renderQuickLoginBox(gateEl);
				}
			};

			topRow.appendChild(nickSpan);
			topRow.appendChild(delBtn);

			const maskedSpan = document.createElement("div");
			maskedSpan.className = "spkmod-ql-masked";
			maskedSpan.innerText = acc.masked || maskRecoveryCode(acc.code);

			const loginBtn = document.createElement("button");
			loginBtn.className = "spkmod-ql-btn-login";
			loginBtn.innerText = "🚀 " + t("quickLoginBtnLogin", acc.nickname);
			loginBtn.onclick = () => performQuickRecovery(acc);

			card.appendChild(topRow);
			card.appendChild(maskedSpan);
			card.appendChild(loginBtn);
			listContainer.appendChild(card);
		});

		box.appendChild(listContainer);

		let addFormOpen = false;
		const toggleAddBtn = document.createElement("button");
		toggleAddBtn.style.cssText = "background: transparent; border: 1px dashed rgba(255,255,255,0.2); color: #cbd5e1; border-radius: 6px; padding: 6px; font-size: 11px; cursor: pointer; text-align: center; margin-top: 4px;";
		toggleAddBtn.innerText = t("quickLoginAddNewAccount");

		const addForm = document.createElement("div");
		addForm.style.cssText = "display: none; flex-direction: column; gap: 6px; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 6px; margin-top: 4px;";

		const nickInput = document.createElement("input");
		nickInput.className = "spkmod-ql-input";
		nickInput.placeholder = t("quickLoginNickPlaceholder");

		const codeInput = document.createElement("input");
		codeInput.className = "spkmod-ql-input";
		codeInput.placeholder = t("quickLoginCodePlaceholder");
		codeInput.oninput = () => { codeInput.value = codeInput.value.toUpperCase(); };

		const saveBtn = document.createElement("button");
		saveBtn.className = "spkmod-ql-btn-login";
		saveBtn.style.cssText = "padding: 5px 10px; font-size: 11px;";
		saveBtn.innerText = t("quickLoginSaveAndLogin");
		saveBtn.onclick = () => {
			const n = nickInput.value.trim();
			const c = codeInput.value.trim();
			if (n && c.length >= 8) {
				saveAccountLocally(n, c);
				performQuickRecovery({ nickname: n, code: c });
				renderQuickLoginBox(gateEl);
			}
		};

		addForm.appendChild(nickInput);
		addForm.appendChild(codeInput);
		addForm.appendChild(saveBtn);

		toggleAddBtn.onclick = () => {
			addFormOpen = !addFormOpen;
			addForm.style.display = addFormOpen ? "flex" : "none";
			toggleAddBtn.style.display = addFormOpen ? "none" : "";
		};

		box.appendChild(toggleAddBtn);
		box.appendChild(addForm);

	} else {
		const emptyMsg = document.createElement("div");
		emptyMsg.style.cssText = "font-size: 12px; color: #cbd5e1; line-height: 1.4; margin-bottom: 4px;";
		emptyMsg.innerText = t("quickLoginNoAccountsPrompt");
		box.appendChild(emptyMsg);

		const form = document.createElement("div");
		form.style.cssText = "display: flex; flex-direction: column; gap: 8px;";

		const nickInput = document.createElement("input");
		nickInput.className = "spkmod-ql-input";
		nickInput.placeholder = t("quickLoginNickPlaceholder");

		const codeInput = document.createElement("input");
		codeInput.className = "spkmod-ql-input";
		codeInput.placeholder = t("quickLoginCodePlaceholder");
		codeInput.oninput = () => { codeInput.value = codeInput.value.toUpperCase(); };

		const submitBtn = document.createElement("button");
		submitBtn.className = "spkmod-ql-btn-login";
		submitBtn.innerText = t("quickLoginSaveAndLogin");
		submitBtn.onclick = () => {
			const n = nickInput.value.trim();
			const c = codeInput.value.trim();
			if (n && c.length >= 8) {
				saveAccountLocally(n, c);
				performQuickRecovery({ nickname: n, code: c });
			}
		};

		form.appendChild(nickInput);
		form.appendChild(codeInput);
		form.appendChild(submitBtn);
		box.appendChild(form);
	}

	const privacyNote = document.createElement("div");
	privacyNote.style.cssText = "font-size: 11px; color: #94a3b8; line-height: 1.3; margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 6px; display: flex; align-items: center; gap: 4px;";
	privacyNote.innerText = "🔒 " + t("quickLoginPrivacyNotice");
	box.appendChild(privacyNote);
}

function initPreLoginGateObserver() {
	let isUpdating = false;
	let observer = null;

	const checkExisting = () => {
		if (isUpdating) return;
		isUpdating = true;
		try {
			const existingBox = document.getElementById("spkmod-quick-login-box");
			const isAlreadyInGame = typeof gameState !== "undefined" && gameState && (gameState.myPlayerName || gameState.myStat?.name);
			if (isAlreadyInGame) {
				if (existingBox) existingBox.remove();
				if (observer) {
					observer.disconnect();
					observer = null;
				}
				return;
			}

			const gateEl = document.querySelector(".sr-nickname-gate, .sr-boot-gate");
			if (gateEl) {
				if (!existingBox || !existingBox.isConnected) {
					renderQuickLoginBox(gateEl);
				}
			} else if (existingBox) {
				existingBox.remove();
			}
		} finally {
			isUpdating = false;
		}
	};

	checkExisting();

	observer = new MutationObserver(() => {
		checkExisting();
	});

	if (document.body) {
		observer.observe(document.body, { childList: true, subtree: true });
	} else {
		document.addEventListener("DOMContentLoaded", () => {
			if (observer && document.body) {
				observer.observe(document.body, { childList: true, subtree: true });
			}
			checkExisting();
		});
	}

	spkmodI18nRenderers.push(() => {
		const gate = document.querySelector(".sr-nickname-gate, .sr-boot-gate");
		if (gate && document.getElementById("spkmod-quick-login-box")) {
			renderQuickLoginBox(gate);
		}
	});
}

function injectQuickLoginIntoSettingsModal() {
	if (!lunHudElements || !lunHudElements.settingsModal) return;
	if (document.getElementById("spkmod-settings-ql-section")) return;

	const settingsGrid = lunHudElements.settingsModal.querySelector(".spkmod-settings-grid");
	if (!settingsGrid) return;

	const col = settingsGrid.firstElementChild || settingsGrid;
	if (!col) return;

	const section = document.createElement("div");
	section.id = "spkmod-settings-ql-section";
	section.style.cssText = "display: none; margin-top: 14px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;";

	const title = document.createElement("span");
	title.className = "spkmod-settings-section-title";
	title.style.cssText = "font-weight: bold; font-size: 12px; color: #fff; display: block; margin-bottom: 4px;";
	title.innerText = "🔑 " + t("quickLoginSectionSettings") + " (F2)";

	const desc = document.createElement("div");
	desc.style.cssText = "font-size: 11px; color: #94a3b8; margin-bottom: 8px; line-height: 1.3;";
	desc.innerText = t("quickLoginSectionDesc");

	const saveBtn = document.createElement("button");
	saveBtn.style.cssText = "background: #2563eb; color: #fff; border: none; border-radius: 6px; padding: 6px 12px; font-size: 11px; font-weight: bold; cursor: pointer; width: 100%; margin-bottom: 8px;";
	saveBtn.innerText = "💾 " + t("quickLoginSaveCurrentBtn");

	const accountsList = document.createElement("div");
	accountsList.style.cssText = "display: flex; flex-direction: column; gap: 4px; max-height: 120px; overflow-y: auto;";

	const refreshSettingsAccounts = () => {
		accountsList.replaceChildren();
		const accounts = getSavedAccounts();
		if (accounts.length === 0) {
			const none = document.createElement("div");
			none.style.cssText = "font-size: 11px; color: #64748b; font-style: italic;";
			none.innerText = "--";
			accountsList.appendChild(none);
			return;
		}
		accounts.forEach(acc => {
			const row = document.createElement("div");
			row.style.cssText = "display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.05); padding: 4px 8px; border-radius: 4px; font-size: 11px;";

			const info = document.createElement("span");
			info.style.cssText = "overflow: hidden; text-overflow: ellipsis; white-space: nowrap;";
			info.innerText = `👤 ${acc.nickname} (${acc.masked})`;

			const actions = document.createElement("div");
			actions.style.cssText = "display: flex; align-items: center; gap: 4px;";

			const copyBtn = document.createElement("button");
			copyBtn.style.cssText = "background: transparent; border: none; color: #38bdf8; cursor: pointer; font-size: 11px; padding: 0 4px;";
			copyBtn.innerText = "📋";
			copyBtn.title = t("quickLoginCopyCode");
			copyBtn.onclick = async () => {
				try {
					await navigator.clipboard.writeText(acc.code);
					copyBtn.innerText = "✔";
					setTimeout(() => { copyBtn.innerText = "📋"; }, 2000);
				} catch (e) {
					console.error("Clipboard copy failed:", e);
				}
			};

			const del = document.createElement("button");
			del.style.cssText = "background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 11px; padding: 0 4px;";
			del.innerText = "✕";
			del.onclick = () => {
				if (window.confirm(t("quickLoginRemoveConfirm", acc.nickname))) {
					removeAccountLocally(acc.nickname);
					refreshSettingsAccounts();
				}
			};

			actions.appendChild(copyBtn);
			actions.appendChild(del);

			row.appendChild(info);
			row.appendChild(actions);
			accountsList.appendChild(row);
		});
	};

	saveBtn.onclick = async () => {
		saveBtn.disabled = true;
		saveBtn.innerText = "...";
		try {
			const code = await fetchCurrentRecoveryCode();
			const currentNick = (gameState && (gameState.myPlayerName || gameState.myStat?.name)) || document.querySelector('.sr-player-card__name')?.innerText?.trim() || window.myPlayerName || "Player";
			saveAccountLocally(currentNick, code);
			saveBtn.innerText = "✔ " + t("quickLoginSaveSuccess", currentNick);
			try {
				if (typeof chatLog === "function") {
					chatLog(t("quickLoginSaveSuccess", currentNick));
				}
			} catch (_) {}
			refreshSettingsAccounts();
			setTimeout(() => {
				saveBtn.disabled = false;
				saveBtn.innerText = "💾 " + t("quickLoginSaveCurrentBtn");
			}, 3000);
		} catch (err) {
			console.error("[SpeakiMod+] Failed to save current account:", err);
			saveBtn.disabled = false;
			saveBtn.innerText = "⚠️ " + err.message;
			setTimeout(() => {
				saveBtn.innerText = "💾 " + t("quickLoginSaveCurrentBtn");
			}, 3000);
		}
	};

	section.appendChild(title);
	section.appendChild(desc);
	section.appendChild(saveBtn);
	section.appendChild(accountsList);

	const privacyNote = document.createElement("div");
	privacyNote.style.cssText = "font-size: 10px; color: #94a3b8; line-height: 1.3; margin-top: 6px; display: flex; align-items: center; gap: 4px;";
	privacyNote.innerText = "🔒 " + t("quickLoginPrivacyNotice");
	section.appendChild(privacyNote);

	col.appendChild(section);

	refreshSettingsAccounts();

	spkmodI18nRenderers.push(() => {
		if (!section.isConnected) return;
		title.innerText = "🔑 " + t("quickLoginSectionSettings") + " (F2)";
		desc.innerText = t("quickLoginSectionDesc");
		if (!saveBtn.disabled) saveBtn.innerText = "💾 " + t("quickLoginSaveCurrentBtn");
		privacyNote.innerText = "🔒 " + t("quickLoginPrivacyNotice");
	});
}

function toggleQuickLoginSettings(forceState) {
	if (typeof injectQuickLoginIntoSettingsModal === "function") {
		injectQuickLoginIntoSettingsModal();
	}
	const sec = document.getElementById("spkmod-settings-ql-section");
	const btn = document.getElementById("spkmod-settings-accounts-btn");
	if (!sec) return false;

	const isCurrentlyHidden = sec.style.display === "none" || sec.classList.contains("hidden");
	const shouldShow = typeof forceState === "boolean" ? forceState : isCurrentlyHidden;

	sec.style.display = shouldShow ? "block" : "none";
	sec.classList.toggle("hidden", !shouldShow);

	if (btn) {
		btn.classList.toggle("active", shouldShow);
		btn.style.background = shouldShow ? "rgba(59, 130, 246, 0.35)" : "";
		btn.style.borderColor = shouldShow ? "#3b82f6" : "";
	}
	if (shouldShow) {
		sec.scrollIntoView({ behavior: "smooth", block: "nearest" });
	}
	return shouldShow;
}

if (typeof window !== "undefined") {
	window.toggleQuickLoginSettings = toggleQuickLoginSettings;
	window.injectQuickLoginIntoSettingsModal = injectQuickLoginIntoSettingsModal;
}

function initQuickLoginInGamePrompt() {
	if (typeof window === "undefined" || !window.localStorage) return;
	if (localStorage.getItem(SPKMOD_DISMISS_KEY)) return;
	const accounts = getSavedAccounts();
	if (accounts.length > 0) return;

	setTimeout(() => {
		if (getSavedAccounts().length > 0) return;
		if (typeof chatLog === "function") {
			chatLog(`${t("quickLoginInviteChat")} (⚙️ -> ${t("quickLoginSectionSettings")})`);
		}
	}, 6000);
}

initPreLoginGateObserver();

function onInGameReady() {
	if (typeof hookGameStateOnce === "function") {
		hookGameStateOnce();
	}
	if (typeof hookRemotePlayersOnce === "function") {
		hookRemotePlayersOnce();
	}
	if (typeof hookQuestManagerOnce === "function") {
		hookQuestManagerOnce();
	}
	const hudEl = document.getElementById("spkmod-hud");
	if (hudEl) hudEl.classList.remove("hidden");
	if (typeof lunHudElements !== "undefined" && lunHudElements.hud) {
		lunHudElements.hud.classList.remove("hidden");
	}

	if (typeof gameState !== "undefined" && gameState?.myStat) {
		const currentNick = (gameState.myPlayerName || gameState.myStat.name || "").trim();
		const currentExp = gameState.myStat.exp ?? 0;
		window._lunActiveCharacter = currentNick;
		window._lunSessionStartExp = currentExp;
		window._lunSessionStartTime = Date.now();
		if (typeof resetExpTracker === "function") {
			resetExpTracker();
		}
	}

	injectQuickLoginIntoSettingsModal();
	initQuickLoginInGamePrompt();
	if (typeof checkAndShowNewsPopup === "function") {
		setTimeout(() => {
			checkAndShowNewsPopup();
		}, 3000);
	}
}

let inGameReadyExecuted = false;
function checkAndTriggerInGameReady() {
	if (inGameReadyExecuted) return true;
	const isInGame = typeof gameState !== "undefined" && gameState && gameState.myStat && (gameState.myPlayerName || gameState.myStat.name);
	if (isInGame) {
		inGameReadyExecuted = true;
		onInGameReady();
		return true;
	}
	return false;
}

if (!checkAndTriggerInGameReady()) {
	const _waitForGameInterval = setInterval(() => {
		if (checkAndTriggerInGameReady()) {
			clearInterval(_waitForGameInterval);
		}
	}, 200);
}

window.__speakiInitInGame = onInGameReady;

window.addEventListener("keydown", e => {
	if (lunDroneModeActive) {
		const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
		if (tag !== "input" && tag !== "textarea" && !document.activeElement.isContentEditable) {
			let handled = false;
			if (e.code === "Space") { window.spkmodDroneKeys.up = true; handled = true; }
			if (e.code === "ControlLeft") { window.spkmodDroneKeys.down = true; handled = true; }
			if (e.code === "KeyW" || e.code === "ArrowUp") { window.spkmodDroneKeys.w = true; handled = true; }
			if (e.code === "KeyS" || e.code === "ArrowDown") { window.spkmodDroneKeys.s = true; handled = true; }
			if (e.code === "KeyA" || e.code === "ArrowLeft") { window.spkmodDroneKeys.a = true; handled = true; }
			if (e.code === "KeyD" || e.code === "ArrowRight") { window.spkmodDroneKeys.d = true; handled = true; }
			if (handled) {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				return;
			}
		}
	}
	if (e.ctrlKey && !e.altKey && !e.shiftKey) {
		let newEffect = null;
		if (e.key === "6") newEffect = "none";
		if (e.key === "7") newEffect = "bw";
		if (e.key === "8") newEffect = "sepia";
		if (e.key === "9") newEffect = "morning";
		if (e.key === "0") newEffect = "night"; // 0 instead of 10
		
		if (newEffect !== null) {
			e.preventDefault();
			lunCameraEffect = newEffect;
			if (window.localStorage) localStorage.setItem("spkmod-camera-effect", lunCameraEffect);
			if (typeof updateDynamicStyles === "function") updateDynamicStyles();
			if (typeof lunPanelElements !== "undefined" && lunPanelElements.cameraEffectSelect) lunPanelElements.cameraEffectSelect.value = lunCameraEffect;
			if (typeof chatLog === "function") chatLog("Camera Effect: " + newEffect.toUpperCase());
			return;
		}
	}
	if (lunDroneModeActive) {
		if (e.code === "NumpadAdd" || (e.key === "+" && !e.ctrlKey && !e.altKey && !e.metaKey)) {
			e.preventDefault();
			lunDroneSpeed = Math.min(2.0, lunDroneSpeed + 0.05);
			window.lunDroneSpeed = lunDroneSpeed;
			if (window.localStorage) localStorage.setItem("spkmod-drone-speed", lunDroneSpeed);
			if (typeof lunPanelElements !== "undefined" && lunPanelElements.droneSpeedInput) lunPanelElements.droneSpeedInput.value = lunDroneSpeed.toFixed(2);
			if (typeof lunPanelElements !== "undefined" && lunPanelElements.droneSpeedLabel) lunPanelElements.droneSpeedLabel.innerText = (typeof t === "function" ? (t("droneSpeedLabel") || "Drone Speed") : "Drone Speed") + ": x" + lunDroneSpeed.toFixed(2);
			if (typeof chatLog === "function") chatLog("Drone Speed: " + lunDroneSpeed.toFixed(2));
			return;
		}
		if (e.code === "NumpadSubtract" || (e.key === "-" && !e.ctrlKey && !e.altKey && !e.metaKey)) {
			e.preventDefault();
			lunDroneSpeed = Math.max(0.01, lunDroneSpeed - 0.05);
			window.lunDroneSpeed = lunDroneSpeed;
			if (window.localStorage) localStorage.setItem("spkmod-drone-speed", lunDroneSpeed);
			if (typeof lunPanelElements !== "undefined" && lunPanelElements.droneSpeedInput) lunPanelElements.droneSpeedInput.value = lunDroneSpeed.toFixed(2);
			if (typeof lunPanelElements !== "undefined" && lunPanelElements.droneSpeedLabel) lunPanelElements.droneSpeedLabel.innerText = (typeof t === "function" ? (t("droneSpeedLabel") || "Drone Speed") : "Drone Speed") + ": x" + lunDroneSpeed.toFixed(2);
			if (typeof chatLog === "function") chatLog("Drone Speed: " + lunDroneSpeed.toFixed(2));
			return;
		}
	}
	if ((e.key === "n" || e.key === "N") && !e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
		const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
		if (tag !== "input" && tag !== "textarea" && !document.activeElement.isContentEditable) {
			const rows = document.querySelectorAll(".sr-panel__row");
			for (const row of rows) {
				const checkbox = row.querySelector("input[type='checkbox']");
				const span = row.querySelector("span");
				if (checkbox && span) {
					const txt = span.innerText.toLowerCase();
					if (txt.includes("night") || txt.includes("darker") || txt.includes("밤") || txt.includes("야간") || txt.includes("夜") || txt.includes("noche") || txt.includes("noite")) {
						e.preventDefault();
						checkbox.click();
						if (typeof chatLog === "function") chatLog("Toggled Native Night Mode");
						break;
					}
				}
			}
		}
	}

	if (e.key === "F4" && !e.ctrlKey && !e.altKey && !e.shiftKey) {
		const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
		if (tag !== "input" && tag !== "textarea" && !document.activeElement.isContentEditable) {
			e.preventDefault();
			if (typeof lunPanelElements !== "undefined" && lunPanelElements.freeCamBtn) {
				lunPanelElements.freeCamBtn.click();
				if (typeof chatLog === "function") chatLog(lunDroneModeActive ? "Free Camera Mode ON" : "Free Camera Mode OFF");
			}
		}
	}

	if ((e.key === "u" || e.key === "U") && e.ctrlKey && !e.altKey && !e.shiftKey) {
		e.preventDefault();
		lunGameUiScale = 1;
		if (window.localStorage) localStorage.setItem("spkmod-uiscale", lunGameUiScale);
		const appEl = document.getElementById("app");
		if (appEl) appEl.style.zoom = ""; // Clear old buggy zoom
		if (typeof updateDynamicStyles === "function") updateDynamicStyles();
		if (typeof lunPanelElements !== "undefined" && lunPanelElements.gameUiScaleSlider) {
			lunPanelElements.gameUiScaleSlider.value = lunGameUiScale;
		}
		if (typeof chatLog === "function") {
			chatLog("Game UI scale reset to 1");
		}
	}
}, true);

window.addEventListener("keyup", e => {
	if (lunDroneModeActive) {
		const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
		if (tag !== "input" && tag !== "textarea" && !document.activeElement.isContentEditable) {
			let handled = false;
			if (e.code === "Space") { window.spkmodDroneKeys.up = false; handled = true; }
			if (e.code === "ControlLeft") { window.spkmodDroneKeys.down = false; handled = true; }
			if (e.code === "KeyW" || e.code === "ArrowUp") { window.spkmodDroneKeys.w = false; handled = true; }
			if (e.code === "KeyS" || e.code === "ArrowDown") { window.spkmodDroneKeys.s = false; handled = true; }
			if (e.code === "KeyA" || e.code === "ArrowLeft") { window.spkmodDroneKeys.a = false; handled = true; }
			if (e.code === "KeyD" || e.code === "ArrowRight") { window.spkmodDroneKeys.d = false; handled = true; }
			if (handled) {
				e.stopPropagation();
				e.stopImmediatePropagation();
				return;
			}
		}
	}
}, true);

// Restore uiscale on load
setTimeout(() => {
	const appEl = document.getElementById('app');
	if (appEl) appEl.style.zoom = ""; // Clear any buggy inline zoom
	const savedScale = window.localStorage ? localStorage.getItem('spkmod-uiscale') : null;
	if (savedScale) {
		lunGameUiScale = savedScale;
		if (typeof updateDynamicStyles === "function") updateDynamicStyles();
	}
}, 1000);



