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
			const modCode = await (await fetch("https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/refs/heads/main/SpeakiMod.js")).text();

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

	// Identify minified i18n and questManager functions
	const m_i18n = (code.match(/function (\w+?)\(e\)\s*\{\s*let \w+\s*=\s*\w+\[\w+\(\)\];\s*return Object\.prototype\.hasOwnProperty.call\(\w+,\s*e\)\s*\?\s*\w+\[e\]\s*:/) || [])[1] || "null";
	const m_questManager = (code.match(/new\s*(\w+)\({\s*container:\s*e,\s*showToast:\s*e\s*=>\s*\w+\.setStatus\(e\),\s*onClaimSuccess:\s*\(\)\s*=>\s*{\s*\w+\.markStale\(\),\s*\w+\.markStale\(\),\s*\w+\(\)\s*}/) || [])[1] || "null";

	// 1. Rewrite relative asset imports to absolute URLs
	code = code.replaceAll(/from\s*"\.\//g, 'from "https://speakirpg.overture.io.kr/assets/');

	// 2. Multi-layered GameState & Injector Hooking:
	// Layer A: Internal GameState method hook on connect(e)
	const reqChannelPattern = /connect\(([^)]*)\)\s*\{\s*this\.requestedChannel\s*=/;
	if (reqChannelPattern.test(code)) {
		code = code.replace(reqChannelPattern, `connect($1){window.speakiInjectorVer = 2; window.gameState = this; window.i18n = ${m_i18n}; window.questManager = ${m_questManager}; this.requestedChannel=`);
	}

	// Layer B: Internal GameState method hook on handleLogin(e)
	const handleLoginPattern = /handleLogin\(([^)]*)\)\s*\{/;
	if (handleLoginPattern.test(code)) {
		code = code.replace(handleLoginPattern, `handleLogin($1){window.gameState = this; if (typeof window.injectSpeakiMod === "function") window.injectSpeakiMod();`);
	}

	// Layer C: External connect invocation hook (supports ;, :, ,, or ) before .connect)
	const callerPattern = /([;:,]|\)\s*)\s*((\w+)\.connect\(\w+\)),/;
	if (callerPattern.test(code)) {
		code = code.replace(callerPattern, `$1((window.speakiInjectorVer = 2), (window.gameState = $3), (window.i18n = ${m_i18n}), (window.questManager = ${m_questManager}), $2),`);
	}

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