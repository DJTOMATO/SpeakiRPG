window.injectSpeakiMod = () => {
	setTimeout(async () => {
		const blob = URL.createObjectURL(
			new Blob(
				[
					await (await fetch("https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/refs/heads/main/SpeakiMod.js")).text()
				],
				{
					type: "text/javascript"
				}
			)
		);

		const inj = document.createElement("script");
		inj.type = "module";
		inj.crossOrigin = "";
		inj.src = blob;

		document.head.appendChild(inj);
	}, 1000);
};

async function patchScript(og, src) {
	og.type = 'text/speakimod';
	og.removeAttribute('src');
	og.remove();

	const code = await (await fetch(src)).text();

	// the king of hardcoding
	const m_i18n = (code.match(/function (\w+?)\(e\)\s*\{\s*let \w+\s*=\s*\w+\[\w+\(\)\];\s*return Object\.prototype\.hasOwnProperty.call\(\w+,\s*e\)\s*\?\s*\w+\[e\]\s*:/) || [])[1] || "null";
	const m_questManager = (code.match(/new\s*(\w+)\({\s*container:\s*e,\s*showToast:\s*e\s*=>\s*\w+\.setStatus\(e\),\s*onClaimSuccess:\s*\(\)\s*=>\s*{\s*\w+\.markStale\(\),\s*\w+\.markStale\(\),\s*\w+\(\)\s*}/) || [])[1] || "null";

	const blob = URL.createObjectURL(
		new Blob(
			[
				code
					.replaceAll(/from\s*"\.\//g, 'from "https://speakirpg.overture.io.kr/assets/')
					.replace(/;\s*((\w+)\.connect\(\w+\)),/, `;((window.speakiInjectorVer = 2), (window.gameState = $2), (window.i18n = ${m_i18n}), (window.questManager = ${m_questManager}), (gameState.handleLogin = window.injectSpeakiMod), $1),`)
			],
			{
				type: "text/javascript"
			}
		)
	);

	const inj = document.createElement("script");
	inj.type = "module";
	inj.crossOrigin = "";
	inj.src = blob;

	document.head.appendChild(inj);
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