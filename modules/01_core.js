// Suppress report-only CSP warnings in console for custom emoji assets
try {
	const _spkOrigWarn = console.warn;
	console.warn = function(...args) {
		if (typeof args[0] === 'string' && (args[0].includes('violates the following Content Security Policy directive') || args[0].includes('Content Security Policy'))) return;
		return _spkOrigWarn.apply(this, args);
	};
	const _spkOrigError = console.error;
	console.error = function(...args) {
		if (typeof args[0] === 'string' && (args[0].includes('violates the following Content Security Policy directive') || args[0].includes('Content Security Policy'))) return;
		return _spkOrigError.apply(this, args);
	};
} catch (_) {}

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
const isSpeakiMobile = typeof window.speakiMobile !== "undefined";

function spkmodIsMobile() {
	if (typeof window.speakiMobile !== "undefined") return true;
	if (typeof navigator !== "undefined" && /mobi|android|iphone|ipad|ipod/i.test(navigator.userAgent || "")) return true;
	if (typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches && navigator.maxTouchPoints > 0) return true;
	if (typeof document !== "undefined" && document.body && document.body.classList.contains("sr-mobile-layout")) return true;
	return false;
}
window.spkmodIsMobile = spkmodIsMobile;

if (!isElectronEnv && !isSpeakiMobile) {
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
		const res = await origFetch.apply(this, args);
		try {
			const url = typeof resource === "string" ? resource : (resource?.url || "");
			// Detect a successful quest reward claim
			const method = String(config?.method || resource?.method || "GET").toUpperCase();			
			const claimMatch = url.match(/\/api\/quests\/([^/?#]+)\/claim(?:[/?#]|$)/i);
			if (method === "POST" && res.ok && claimMatch) {
				const questId = decodeURIComponent(claimMatch[1]);
				console.info("[SpeakiMod+] Quest reward claimed; clearing pins:", questId);
				if (typeof clearClaimedQuestPin === "function") {
					clearClaimedQuestPin({questId: questId, isClaimed: true});
				}
			}
			if (url && url.includes("/api/quests")) {
				const clone = res.clone();
				clone.json().then(data => {
					if (Array.isArray(data)) {
						window.__spkmodCachedQuests = window.__spkmodCachedQuests || {};
						for (const q of data) {
							if (q && q.questId) {
								window.__spkmodCachedQuests[q.questId] = q;
								if (q.isClaimed) {
									const removed = clearClaimedQuestPin(q);
									if (removed && typeof renderQuestChecklist === "function") {
										renderQuestChecklist();
									}
								}
								else if (typeof lunPinnedQuestId !== "undefined" && lunPinnedQuestId && String(lunPinnedQuestId) === String(q.questId)) {
									if (typeof updatePinnedQuestDisplay === "function") {
										updatePinnedQuestDisplay(q);
									}
								}
							}
						}
					}
				}).catch(() => {});
			}
		} catch (_) {}
		return res;
	};
}

// --- NETWORK RESILIENCE: SAFE FETCH & CIRCUIT BREAKER ---
window.spkmodSafeFetch = async function(url, options = {}, timeoutMs = 5000) {
	const controller = new AbortController();
	const timer = setTimeout(() => {
		try { controller.abort(); } catch (_) {}
	}, timeoutMs);
	const opts = { ...options };
	if (options.signal) {
		options.signal.addEventListener("abort", () => {
			try { controller.abort(); } catch (_) {}
		});
	}
	opts.signal = controller.signal;
	try {
		const fetchFn = window.__origFetch || window.fetch;
		const res = await fetchFn(url, opts);
		return res;
	} finally {
		clearTimeout(timer);
	}
};

window.spkmodServerHealth = {
	failures: 0,
	lastFailTime: 0,
	baseCooldownMs: 60000,   // 1 minute initial cooldown
	maxCooldownMs: 300000,   // 5 minutes max cooldown
	isAvailable() {
		if (this.failures === 0) return true;
		const delay = Math.min(this.baseCooldownMs * Math.pow(2, this.failures - 1), this.maxCooldownMs);
		return (Date.now() - this.lastFailTime) > delay;
	},
	recordSuccess() {
		this.failures = 0;
		this.lastFailTime = 0;
	},
	recordFailure() {
		this.failures++;
		this.lastFailTime = Date.now();
	},
	forceRetry() {
		this.lastFailTime = 0;
	}
};

if (!window.__speakiWsHooked && typeof window.WebSocket !== "undefined") {
	window.__speakiWsHooked = true;
	const OrigWebSocket = window.WebSocket;
	window.WebSocket = new Proxy(OrigWebSocket, {
		construct(target, args) {
			let [url, protocols] = args;
			if (typeof url === "string" && (url.includes("/ws/") || url.includes("/game") || url.includes("overture.io.kr"))) {
				let sep = url.includes("?") ? "&" : "?";
				if (!url.includes("emoji=1")) {
					url += sep + "emoji=1";
					sep = "&";
				}
				if (!url.includes("mod=1")) {
					url += sep + "mod=1";
				}
				args[0] = url;
			}
			return Reflect.construct(target, args);
		},
		apply(target, thisArg, args) {
			let [url, protocols] = args;
			if (typeof url === "string" && (url.includes("/ws/") || url.includes("/game") || url.includes("overture.io.kr"))) {
				let sep = url.includes("?") ? "&" : "?";
				if (!url.includes("emoji=1")) {
					url += sep + "emoji=1";
					sep = "&";
				}
				if (!url.includes("mod=1")) {
					url += sep + "mod=1";
				}
				args[0] = url;
			}
			return Reflect.construct(target, args);
		}
	});
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
	if (typeof window.getNativeAuthToken === "function") {
		try {
			const nativeToken = window.getNativeAuthToken();
			if (nativeToken) {
				window.speakiAuthToken = nativeToken;
				return nativeToken;
			}
		} catch (_) {}
	}
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
	if (typeof lunSpkAuthToken === "string" && lunSpkAuthToken) {
		let t = lunSpkAuthToken;
		if (t.toLowerCase().startsWith("bearer ")) t = t.substring(7).trim();
		if (t) return t;
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
	StageDance: 8,
	Faint: 15,
	Dance: 16
};

// True First Person & Speedometer State
var lunTrueFirstPersonActive = false;
var lunSpeedometerEnabled = true;
var lunCurrentSpeedMps = 0;

// In-Game 3D Cinema / Movie Player Default Configuration
var SPKMOD_CINEMA_DEFAULT_CONFIG = {
	enabled: false,
	muted: false,
	volume: 80,
	pos: { x: 75.0, y: 4.2, z: 32.5 },
	rotationY: 1.6000,
	width: 12.8,
	height: 7.2
};

window.spkmodCinemaConfig = Object.assign({}, SPKMOD_CINEMA_DEFAULT_CONFIG);
if (typeof window !== "undefined" && window.localStorage) {
	try {
		const en = localStorage.getItem("spkmod-cinema-enabled");
		if (en !== null) {
			window.spkmodCinemaConfig.enabled = en === "true";
		} else {
			window.spkmodCinemaConfig.enabled = false;
		}
		const mutedStr = localStorage.getItem("spkmod-cinema-muted");
		if (mutedStr !== null) window.spkmodCinemaConfig.muted = mutedStr === "true";
		const vol = localStorage.getItem("spkmod-cinema-volume");
		if (vol !== null) window.spkmodCinemaConfig.volume = parseInt(vol, 10) || 80;
		const posStr = localStorage.getItem("spkmod-cinema-pos");
		if (posStr) {
			const parsed = JSON.parse(posStr);
			if (parsed && typeof parsed.x === "number") {
				if ((Math.abs(parsed.x - 44.0) < 0.1 && Math.abs(parsed.z - 62.0) < 0.1) ||
					(Math.abs(parsed.x - 65.0) < 0.1 && Math.abs(parsed.z - 33.5) < 0.1)) {
					window.spkmodCinemaConfig.pos = { x: 75.0, y: 4.2, z: 32.5 };
					window.spkmodCinemaConfig.rotationY = 1.6000;
				} else {
					window.spkmodCinemaConfig.pos = { x: parsed.x, y: parsed.y ?? 4.2, z: parsed.z };
					if (typeof parsed.rotationY === "number") window.spkmodCinemaConfig.rotationY = parsed.rotationY;
				}
			}
		}
	} catch (_) {}
}
var spkmodCinemaConfig = window.spkmodCinemaConfig;




