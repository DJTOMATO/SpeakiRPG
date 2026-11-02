try {
	// Sanitize native audio settings early before i18n/game bundle boots
	const s = localStorage.getItem("sr1_settings");
	if (s) {
		const p = JSON.parse(s);
		if (p && p.muteAll) {
			p.muteAll = false;
			localStorage.setItem("sr1_settings", JSON.stringify(p));
		}
	}
} catch (_) {}

try {
	const isMobile = typeof window.speakiMobile !== "undefined" ||
		(typeof navigator !== "undefined" && /mobi|android|iphone|ipad|ipod/i.test(navigator.userAgent || "")) ||
		(typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches && navigator.maxTouchPoints > 0);
	if (!isMobile) {
		window.spkmodResolutionOverride = 1;
		try { localStorage.removeItem("spkmod-resolution-override"); } catch (_) {}
	} else {
		const v = parseFloat(localStorage.getItem("spkmod-resolution-override"));
		window.spkmodResolutionOverride = (v >= 1 && v <= 3.5) ? v : 1;
	}
} catch (_) {
	window.spkmodResolutionOverride = 1;
}

window.injectSpeakiMod = () => {
	if (window.__speakiModInjected) {
		if (typeof window.__speakiInitInGame === "function") {
			window.__speakiInitInGame();
		}
		return;
	}
	window.__speakiModInjected = true;
	setTimeout(async () => {
		try {
			const modCode = await (await fetch("https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/refs/heads/main/SpeakiMod.js?t=" + Date.now())).text();

			const blob = URL.createObjectURL(
				new Blob([modCode], { type: "text/javascript" })
			);

			const inj = document.createElement("script");
			inj.type = "module";
			inj.crossOrigin = "";
			inj.src = blob;

			document.head.appendChild(inj);
		} catch (e) {
			console.error("[SpeakiMod] Failed to inject SpeakiMod.js:", e);
		}
	}, 100);
};

async function patchScript(og, src) {
	og.type = 'text/speakimod';
	og.removeAttribute('src');
	og.remove();

	let code = await (await fetch(src)).text();

	// Identify minified i18n function
	const m_i18n = (code.match(/function (\w+?)\(e\)\s*\{\s*let \w+\s*=\s*\w+\[\w+\(\)\];\s*return Object\.prototype\.hasOwnProperty.call\(\w+,\s*e\)\s*\?\s*\w+\[e\]\s*:/) || [])[1] || "null";
	const m_settingsMatch = code.match(/case[\x60'"]muteAll[\x60'"]\s*:\s*(\w+)\(\{muteAll:!(\w+)\(\)\.muteAll\}\)/) || [];
	const m_updateSettings = m_settingsMatch[1] || "null";
	const m_getSettings = m_settingsMatch[2] || "null";
	const m_listenerMatch = code.match(/function\s+(\w+)\((\w+)\)\{(\w+)=new \w+,\2\.add\(\3\)/) || [];
	const m_vc = m_listenerMatch[3] || "null";
	const m_tokenMatch = code.match(/function (\w+)\(\)\{return \w+\}function \w+\(\w+\)\{\w+=\w+\.accessToken/) || [];
	const m_getToken = m_tokenMatch[1] || "null";
	const m_refreshMatch = code.match(/function (\w+)\(\)\{if\(\w+\)return \w+;let \w+=\w+\(\)\.finally\(\(\)=>\{\w+=null\}/) || [];
	const m_refreshToken = m_refreshMatch[1] || "null";
	
	code = code.replace(
		/function ([\w$]+)\(\)\{let ([\w$]+);if\(([\w$]+)\(\)\)([\w$]+)=([\w$]+)\(\)\.resolutionScale;else\{let ([\w$]+)=window\.devicePixelRatio;/,
		(_m, fn, e, isMobileLayout, e2, getSettings, dpr) =>
			`function ${fn}(){if(window.spkmodResolutionOverride>1&&${isMobileLayout}())return Math.min(window.spkmodResolutionOverride,4);let ${e};if(${isMobileLayout}())${e2}=${getSettings}().resolutionScale;else{let ${dpr}=window.devicePixelRatio;`
	);

	// Frame limiter fix: keep the frame schedule instead of re-anchoring on every rendered frame
	code = code.replace(
		/shouldRender\((\w+),(\w+)\)\{if\(\2<=0\)return!0;let (\w+)=1e3\/\2\*(\w+);return \1-this\.lastFrameTimeMs<\3\?!1:\(this\.lastFrameTimeMs=\1,!0\)\}/,
		(_m, e, t, n, k) =>
			`shouldRender(${e},${t}){if(${t}<=0)return!0;const p=1e3/${t};const d=${e}-this.lastFrameTimeMs;if(d<p*${k})return!1;this.lastFrameTimeMs=d>p*2?${e}:this.lastFrameTimeMs+p;return!0}`
	);

	// 1. Rewrite relative asset imports to absolute URLs
	code = code.replaceAll(/from\s*"\.\//g, 'from "https://speakirpg.overture.io.kr/assets/');

	// 2. Multi-layered GameState & Injector Hooking:
	// Layer A: Internal GameState method hook on connect(e)
	const reqChannelPattern = /connect\(([^)]*)\)\s*\{\s*this\.requestedChannel\s*=/;
	if (reqChannelPattern.test(code)) {
		code = code.replace(reqChannelPattern, `connect($1){window.speakiInjectorVer = 2; window.gameState = this; window.getAudioListener = () => ${m_vc}; window.i18n = ${m_i18n}; window.getGameSettings = ${m_getSettings}; window.updateGameSettings = ${m_updateSettings}; window.getNativeAuthToken = ${m_getToken}; window.refreshAuthToken = ${m_refreshToken}; this.requestedChannel=`);
	}

	// Layer B: Internal GameState method hook on handleLogin(e)
	const handleLoginPattern = /handleLogin\(([^)]*)\)\s*\{/;
	if (handleLoginPattern.test(code)) {
		code = code.replace(handleLoginPattern, `handleLogin($1){window.gameState = this; window.getAudioListener = () => ${m_vc}; window.getGameSettings = ${m_getSettings}; window.updateGameSettings = ${m_updateSettings}; window.getNativeAuthToken = ${m_getToken}; window.refreshAuthToken = ${m_refreshToken}; if (typeof window.injectSpeakiMod === "function") window.injectSpeakiMod();`);
	}

	code += `\ntry { window.getAudioListener = () => ${m_vc}; window.getGameSettings = ${m_getSettings}; window.updateGameSettings = ${m_updateSettings}; window.getNativeAuthToken = ${m_getToken}; window.refreshAuthToken = ${m_refreshToken}; } catch (_) {}\n`;

	const blob = URL.createObjectURL(
		new Blob([code], { type: "text/javascript" })
	);

	const inj = document.createElement("script");
	inj.type = "module";
	inj.crossOrigin = "";
	inj.src = blob;

	document.head.appendChild(inj);

	// Early injection: allows SpeakiMod to mount pre-login features (like Quick Login) on .sr-nickname-gate
	window.injectSpeakiMod();
}

const observer = new MutationObserver(muts => {
	for (const mut of muts) {
		for (const node of mut.addedNodes) {
			// why tf can tagName be nullable????
			if (node.tagName?.toLowerCase() === "script") {
				const src = node.getAttribute('src');

				if (src?.includes("assets/index-")) {
					patchScript(node, src);
					observer.disconnect();
					return;
				}
			}
		}
	}
});

observer.observe(document, { childList: true, subtree: true });

const existing = document.querySelector('script[src*="/assets/index-"]');
if (existing) { // TODO: Deduplicate code
	const src = existing.getAttribute('src');

	if (src?.includes("assets/index-")) {
		patchScript(existing, src);
		observer.disconnect();
	}
}
