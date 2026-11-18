// Suppress report-only CSP warnings, Three.js duplicate-instance warnings, WebGPU Windows powerPreference warnings, and unsupported iframe allow="web-share"
try {
	const _spkOrigWarn = console.warn;
	console.warn = function(...args) {
		if (typeof args[0] === 'string' && (args[0].includes('violates the following Content Security Policy directive') || args[0].includes('Content Security Policy') || args[0].includes('Multiple instances of Three.js'))) return;
		return _spkOrigWarn.apply(this, args);
	};
	const _spkOrigError = console.error;
	console.error = function(...args) {
		if (typeof args[0] === 'string' && (args[0].includes('violates the following Content Security Policy directive') || args[0].includes('Content Security Policy'))) return;
		return _spkOrigError.apply(this, args);
	};
	if (typeof GPU !== 'undefined' && GPU.prototype && typeof GPU.prototype.requestAdapter === 'function' && /Win/i.test(navigator.platform || navigator.userAgent || '')) {
		const _spkOrigRequestAdapter = GPU.prototype.requestAdapter;
		GPU.prototype.requestAdapter = function(options) {
			if (options && typeof options === 'object' && 'powerPreference' in options) {
				const { powerPreference, ...rest } = options;
				return _spkOrigRequestAdapter.call(this, Object.keys(rest).length ? rest : undefined);
			}
			return _spkOrigRequestAdapter.apply(this, arguments);
		};
	}
	if (typeof HTMLIFrameElement !== 'undefined') {
		const stripWebShare = (val) => typeof val === 'string'
			? val.replace(/(^|[;\s])web-share(?=[;\s]|$)/gi, '$1').replace(/;\s*;/g, ';').replace(/^\s*;\s*|\s*;\s*$/g, '').trim()
			: val;
		const _spkOrigSetAttr = HTMLIFrameElement.prototype.setAttribute;
		HTMLIFrameElement.prototype.setAttribute = function(name, value) {
			if (typeof name === 'string' && name.toLowerCase() === 'allow') {
				value = stripWebShare(value);
			}
			return _spkOrigSetAttr.call(this, name, value);
		};
		const allowDesc = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'allow');
		if (allowDesc && typeof allowDesc.set === 'function') {
			Object.defineProperty(HTMLIFrameElement.prototype, 'allow', {
				configurable: true,
				enumerable: allowDesc.enumerable,
				get: allowDesc.get,
				set(value) {
					return allowDesc.set.call(this, stripWebShare(value));
				}
			});
		}
		const cwDesc = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentWindow');
		if (cwDesc && typeof cwDesc.get === 'function') {
			Object.defineProperty(HTMLIFrameElement.prototype, 'contentWindow', {
				configurable: true,
				enumerable: cwDesc.enumerable,
				get() {
					const win = cwDesc.get.call(this);
					if (win) {
						try {
							if (win.location && win.location.href === 'about:blank' && !win.__spkPostMsgPatched) {
								const origPost = win.postMessage;
								if (typeof origPost === 'function') {
									win.__spkPostMsgPatched = true;
									win.postMessage = function(message, targetOrigin) {
										try {
											if (win.location.href === 'about:blank' && typeof targetOrigin === 'string' && targetOrigin !== '*' && targetOrigin !== window.location.origin) {
												return;
											}
										} catch (_) {}
										return origPost.apply(this, arguments);
									};
								}
							}
						} catch (_) {}
					}
					return win;
				}
			});
		}
	}
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

const spkmodQuestResponseJsonCache = new WeakMap();

function spkmodReadQuestResponseJson(response) {
    if (!response || typeof response.clone !== "function") {
        return Promise.resolve(null);
    }

    let promise = spkmodQuestResponseJsonCache.get(response);

    if (!promise) {
        promise = response.clone().json();
        spkmodQuestResponseJsonCache.set(response, promise);
    }

    return promise;
}

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
			// Detect a successful quest reward claim (single or claim-all)
			const method = String(config?.method || resource?.method || "GET").toUpperCase();			
			const claimMatch = url.match(/\/api\/quests\/([^/?#]+)\/claim(?:[/?#]|$)/i);
			if (method === "POST" && res.ok && claimMatch) {
				const questId = decodeURIComponent(claimMatch[1]);
				console.info("[SpeakiMod+] Quest reward claimed; clearing pins:", questId);
				if (window.__spkmodCachedQuests && window.__spkmodCachedQuests[questId]) {
					window.__spkmodCachedQuests[questId].isClaimed = true;
					window.__spkmodCachedQuests[questId].isCompleted = true;
				}
				if (typeof clearClaimedQuestPin === "function") {
					clearClaimedQuestPin({questId: questId, isClaimed: true});
				}
				if (typeof refreshPinButtons === "function") refreshPinButtons();
				if (typeof renderQuestChecklist === "function") renderQuestChecklist();
			}
			if (method === "POST" && res.ok && /\/api\/quests\/claim-all(?:[/?#]|$)/i.test(url)) {
				spkmodReadQuestResponseJson(res).then(data => {
					const claimedIds = Array.isArray(data?.claimedQuestIds) ? data.claimedQuestIds : [];
					for (const qId of claimedIds) {
						if (window.__spkmodCachedQuests && window.__spkmodCachedQuests[qId]) {
							window.__spkmodCachedQuests[qId].isClaimed = true;
							window.__spkmodCachedQuests[qId].isCompleted = true;
						}
						if (typeof clearClaimedQuestPin === "function") {
							clearClaimedQuestPin({questId: qId, isClaimed: true});
						}
					}
					if (typeof refreshPinButtons === "function") refreshPinButtons();
					if (typeof renderQuestChecklist === "function") renderQuestChecklist();
				}).catch(() => {});
			}
			if (url && url.includes("/api/quests") && !/\/claim(?:-all)?(?:[/?#]|$)/i.test(url)) {
				const periodMatch = url.match(/[?&]period=([^&#]+)/i);
				const reqPeriod = periodMatch ? decodeURIComponent(periodMatch[1]).toLowerCase() : undefined;
    			spkmodReadQuestResponseJson(res).then(data => {
        			if (!Array.isArray(data)) return;
        			window.__spkmodMergeCompletedQuests?.(data);
        			for (let idx = 0; idx < data.length; idx++) {
            			const q = data[idx];
            			if (!q?.questId) continue;
            			const cachedQuest = spkmodCacheQuestRecord(q, reqPeriod, idx);
            			if (q.isClaimed) {
                			clearClaimedQuestPin(cachedQuest);
            			} else if (typeof lunPinnedQuestId !== "undefined" && lunPinnedQuestId && String(lunPinnedQuestId) === String(q.questId)) {
                			if (typeof updatePinnedQuestDisplay === "function") {
                    			updatePinnedQuestDisplay(cachedQuest);
                			}
            			}
        			}
        			if (typeof scheduleSpkmodQuestPinScan === "function") scheduleSpkmodQuestPinScan();
        			if (typeof refreshPinButtons === "function") refreshPinButtons();
        			if (typeof renderQuestChecklist === "function") renderQuestChecklist();
    			}).catch(() => {});
			}
		} catch (_) {}
		return res;
	};
}

// --- NETWORK RESILIENCE: SAFE FETCH & CIRCUIT BREAKER ---
const SPKMOD_SERVER_URL = "https://spk.lena.moe";
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

(function initSpkmodI18nBridge() {
	let _nativeI18nFn = null;
	const existingFn = window.i18n;
	if (typeof existingFn === "function") {
		try {
			const test = existingFn("content.item.1.name");
			if (test && test !== "content.item.1.name") {
				_nativeI18nFn = existingFn;
			}
		} catch (_) {}
	}

	function getActiveGameLocale() {
		try {
			if (typeof window.getGameSettings === "function") {
				const gs = window.getGameSettings();
				if (gs && gs.locale) return gs.locale;
			}
		} catch (_) {}
		try {
			if (window.localStorage) {
				const raw = localStorage.getItem("sr1_settings");
				if (raw) {
					const parsed = JSON.parse(raw);
					if (parsed && parsed.locale) return parsed.locale;
				}
			}
		} catch (_) {}
		return typeof spkmodLang === "string" && spkmodLang ? spkmodLang : "en";
	}

	function spkmodI18nLookup(key) {
		if (!key) return key;
		if (typeof _nativeI18nFn === "function") {
			try {
				const val = _nativeI18nFn(key);
				if (val && val !== key) return val;
			} catch (_) {}
		}
		const map = window.i18nMap;
		if (map && typeof map === "object") {
			const loc = getActiveGameLocale();
			const primary = map[loc];
			if (primary && Object.prototype.hasOwnProperty.call(primary, key)) {
				return primary[key];
			}
			const fallbacks = ["en", "ko", "ja", "zh-CN", "zh-TW"];
			for (const fb of fallbacks) {
				if (map[fb] && Object.prototype.hasOwnProperty.call(map[fb], key)) {
					return map[fb][key];
				}
			}
		}
		return key;
	}

	try {
		Object.defineProperty(window, "i18n", {
			configurable: true,
			enumerable: true,
			get() {
				return _nativeI18nFn || spkmodI18nLookup;
			},
			set(fn) {
				if (typeof fn === "function" && fn !== spkmodI18nLookup) {
					try {
						const test = fn("content.item.1.name");
						if (test && test !== "content.item.1.name") {
							_nativeI18nFn = fn;
						}
					} catch (_) {
						_nativeI18nFn = fn;
					}
				}
			}
		});
	} catch (_) {
		if (typeof window.i18n !== "function") {
			window.i18n = spkmodI18nLookup;
		}
	}

	async function recoverGameI18nMapFromBundle() {
		if (window.i18nMap && typeof window.i18nMap === "object" && window.i18nMap.en) return;
		try {
			let bundleUrl = "";
			if (typeof performance !== "undefined" && typeof performance.getEntriesByType === "function") {
				const resEntries = performance.getEntriesByType("resource") || [];
				for (const r of resEntries) {
					if (r && typeof r.name === "string" && r.name.includes("/assets/index-") && r.name.endsWith(".js")) {
						bundleUrl = r.name;
						break;
					}
				}
			}
			if (!bundleUrl && typeof document !== "undefined") {
				const scriptEl = document.querySelector('script[src*="/assets/index-"]');
				if (scriptEl && scriptEl.src) bundleUrl = scriptEl.src;
			}
			if (!bundleUrl) {
				const htmlRes = await fetch("https://speakirpg.overture.io.kr/");
				if (htmlRes.ok) {
					const htmlText = await htmlRes.text();
					const m = htmlText.match(/assets\/index-[^"']+\.js/);
					if (m) bundleUrl = "https://speakirpg.overture.io.kr/" + m[0].replace(/^\/+/, "");
				}
			}
			if (!bundleUrl) return;

			const res = await fetch(bundleUrl);
			if (!res.ok) return;
			const code = await res.text();
			const dictMatch = code.match(/var [\w$]+=(\{ko:\{"content\.item\.1\.name":[\s\S]*?\}\});function [\w$]+\(e\)/);
			if (!dictMatch || !dictMatch[1]) return;

			const dictStr = dictMatch[1];
			const sections = dictStr.split(/(?:^\{|\},)(ko|en|ja|"zh-CN"|"zh-TW"):\{/);
			const parsedMap = {};
			for (let i = 1; i < sections.length; i += 2) {
				const lang = sections[i].replace(/"/g, "");
				const body = sections[i + 1] || "";
				const entries = {};
				const entryRe = /"(content\.[^"]+)":`([^`]*)`/g;
				let em;
				while ((em = entryRe.exec(body)) !== null) {
					entries[em[1]] = em[2];
				}
				parsedMap[lang] = entries;
			}
			if (Object.keys(parsedMap).length > 0) {
				window.i18nMap = parsedMap;
				if (typeof _zoneNameToIdMap !== "undefined") _zoneNameToIdMap = null;
				if (typeof scheduleSpkmodQuestPinScan === "function") scheduleSpkmodQuestPinScan();
				if (typeof refreshPinButtons === "function") refreshPinButtons();
				if (typeof renderQuestChecklist === "function") renderQuestChecklist();
				if (typeof lunPinnedQuestId !== "undefined" && lunPinnedQuestId && window.__spkmodCachedQuests?.[lunPinnedQuestId] && typeof updatePinnedQuestDisplay === "function") {
					updatePinnedQuestDisplay(window.__spkmodCachedQuests[lunPinnedQuestId]);
				}
			}
		} catch (_) {}
	}

	setTimeout(recoverGameI18nMapFromBundle, 50);
})();

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
	Mop: 1, // Maid skin (SKIN_SPEAKI_MAID) emoteOverride on Cry/otl
	Jump: 2,
	MinigameJoayo: 3,
	StrokeStart: 4,
	StrokeStage2: 5,
	StrokeBloom: 6,
	StrokeCancel: 7,
	StageDance: 8,
	QuickTalkYes: 9,
	QuickTalkNo: 10,
	QuickTalkGo: 11,
	QuickTalkStop: 12,
	QuickTalkHelp: 13,
	QuickTalkFollowMe: 14,
	Faint: 15,
	Dance: 16
};

const LUN_BURGER_SKIN_CODES = [null, "SKIN_SPEAKI_BURGER_STAFF_A", "SKIN_SPEAKI_BURGER_STAFF_B"];
const LUN_BURGER_SKIN_KEYS = ["burgerSkinOff", "burgerSkinA", "burgerSkinB"];
const LUN_BURGER_SKIN_FALLBACKS = ["Burger: OFF", "Burger: A", "Burger: B"];
const LUN_BURGER_CAR_MODES = [null, "Vehicle_Sedan", "Vehicle_Van"];
const LUN_BURGER_CAR_KEYS = ["burgerCarOff", "burgerCarSedan", "burgerCarVan"];
const LUN_BURGER_CAR_FALLBACKS = ["Car: OFF", "Car: Sedan (F/G)", "Car: Van (F/G)"];
const LUN_BURGER_CAR_COLORS = [13653578, 3964880, 5025658, 15254855, 15239740, 15856108, 7259880, 9069513];

// True First Person & Speedometer State
var lunTrueFirstPersonActive = false;
var lunSpeedometerEnabled = true;
var lunCurrentSpeedMps = 0;

// In-Game 3D Cinema / Movie Player Default Configuration
var SPKMOD_CINEMA_DEFAULT_CONFIG = {
	enabled: true,
	muted: false,
	volume: 80,
	pos: { x: 75.0, y: 4.2, z: 32.5 },
	rotationY: 1.6000,
	width: 12.8,
	height: 7.2,
	occlusion: true
};

window.spkmodCinemaConfig = Object.assign({}, SPKMOD_CINEMA_DEFAULT_CONFIG);
if (typeof window !== "undefined" && window.localStorage) {
	try {
		window.spkmodCinemaConfig.enabled = true;
		localStorage.setItem("spkmod-cinema-enabled", "true");
		const mutedStr = localStorage.getItem("spkmod-cinema-muted");
		if (mutedStr !== null) window.spkmodCinemaConfig.muted = mutedStr === "true";
		const vol = localStorage.getItem("spkmod-cinema-volume");
		if (vol !== null) window.spkmodCinemaConfig.volume = parseInt(vol, 10) || 80;
		const occ = localStorage.getItem("spkmod-cinema-occlusion");
		if (occ !== null) window.spkmodCinemaConfig.occlusion = occ === "true";
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




