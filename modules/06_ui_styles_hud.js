function updateDynamicStyles() {
	let bgRule = "rgba(0, 0, 0, 0.75)";
	let blurRule = "blur(4px)";
	let filterRule = "none";

	if (typeof document !== "undefined" && !document.getElementById("spkmod-fx-svg") && document.body) {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.id = "spkmod-fx-svg";
		svg.setAttribute("style", "position: absolute; width: 0; height: 0; pointer-events: none; overflow: hidden;");
		svg.setAttribute("aria-hidden", "true");
		svg.innerHTML = `
			<defs>
				<filter id="spkmod-fx-chromatic">
					<feColorMatrix type="matrix" result="red" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/>
					<feOffset in="red" dx="3.5" dy="0" result="red-shifted"/>
					<feColorMatrix in="SourceGraphic" type="matrix" result="blue" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"/>
					<feOffset in="blue" dx="-3.5" dy="0" result="blue-shifted"/>
					<feColorMatrix in="SourceGraphic" type="matrix" result="green" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"/>
					<feBlend in="red-shifted" in2="green" mode="screen" result="rg"/>
					<feBlend in="rg" in2="blue-shifted" mode="screen"/>
				</filter>
				<filter id="spkmod-fx-glitch">
					<feTurbulence type="fractalNoise" baseFrequency="0.04 0.95" numOctaves="1" result="noise" />
					<feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" result="distorted" />
					<feColorMatrix in="distorted" type="matrix" result="red" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/>
					<feOffset in="red" dx="4" dy="0" result="red-shifted"/>
					<feColorMatrix in="distorted" type="matrix" result="blue" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"/>
					<feOffset in="blue" dx="-4" dy="0" result="blue-shifted"/>
					<feColorMatrix in="distorted" type="matrix" result="green" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"/>
					<feBlend in="red-shifted" in2="green" mode="screen" result="rg"/>
					<feBlend in="rg" in2="blue-shifted" mode="screen"/>
				</filter>
			</defs>
		`;
		document.body.appendChild(svg);
	}

	switch(lunCameraEffect) {
		case "bw": filterRule = "grayscale(100%) contrast(110%)"; break;
		case "sepia": filterRule = "sepia(80%) saturate(140%) hue-rotate(-10deg) contrast(110%)"; break;
		case "morning": filterRule = "brightness(110%) contrast(110%) sepia(20%) hue-rotate(5deg) saturate(120%)"; break;
		case "dusk": filterRule = "brightness(90%) sepia(30%) hue-rotate(330deg) saturate(130%) contrast(120%)"; break;
		case "night": filterRule = "brightness(75%) contrast(120%) sepia(40%) hue-rotate(180deg) saturate(150%)"; break;
		case "vaporwave": filterRule = "contrast(125%) saturate(220%) hue-rotate(285deg) brightness(105%)"; break;
		case "chromatic": filterRule = "url('#spkmod-fx-chromatic') contrast(115%) saturate(130%)"; break;
		case "unfocus": filterRule = "blur(3.5px) contrast(105%) brightness(105%)"; break;
		case "focus": filterRule = "contrast(140%) saturate(125%) brightness(102%)"; break;
		case "vhs": filterRule = "contrast(125%) saturate(140%) sepia(30%) hue-rotate(15deg) brightness(95%)"; break;
		case "cyberpunk": filterRule = "contrast(140%) saturate(190%) hue-rotate(145deg) brightness(110%)"; break;
		case "nostalgia": filterRule = "contrast(95%) brightness(110%) saturate(120%) blur(0.7px) sepia(15%)"; break;
		case "pastel": filterRule = "brightness(112%) contrast(92%) saturate(135%) hue-rotate(345deg)"; break;
		case "warmVintage": filterRule = "sepia(50%) saturate(150%) contrast(108%) brightness(102%) hue-rotate(-15deg)"; break;
		case "coolCinema": filterRule = "contrast(115%) saturate(115%) hue-rotate(190deg) brightness(96%)"; break;
		case "matrix": filterRule = "contrast(150%) saturate(200%) hue-rotate(90deg) brightness(85%)"; break;
		case "inverted": filterRule = "invert(100%) hue-rotate(180deg)"; break;
		case "gameboy": filterRule = "grayscale(100%) brightness(95%) contrast(160%) sepia(100%) hue-rotate(50deg) saturate(320%)"; break;
		case "bloodMoon": filterRule = "contrast(160%) brightness(85%) saturate(220%) sepia(60%) hue-rotate(300deg)"; break;
		case "synthwave": filterRule = "contrast(145%) saturate(260%) hue-rotate(240deg) brightness(105%)"; break;
		case "underwater": filterRule = "contrast(115%) saturate(160%) hue-rotate(140deg) brightness(105%) blur(0.4px)"; break;
		case "goldenHour": filterRule = "brightness(115%) contrast(108%) sepia(35%) saturate(175%) hue-rotate(-20deg)"; break;
		case "comicBook": filterRule = "contrast(200%) saturate(190%) brightness(102%)"; break;
		case "arctic": filterRule = "brightness(108%) contrast(120%) saturate(85%) hue-rotate(160deg) sepia(15%)"; break;
		case "cosmic": filterRule = "contrast(135%) saturate(230%) hue-rotate(110deg) brightness(110%)"; break;
		case "filmNoir": filterRule = "grayscale(100%) contrast(210%) brightness(80%)"; break;
		case "acidTrip": filterRule = "contrast(180%) saturate(450%) hue-rotate(85deg) brightness(115%)"; break;
		case "radioactive": filterRule = "contrast(220%) saturate(300%) hue-rotate(65deg) brightness(120%)"; break;
		case "deepFried": filterRule = "contrast(320%) saturate(550%) brightness(130%) hue-rotate(-25deg)"; break;
		case "alienAbduction": filterRule = "invert(75%) hue-rotate(130deg) saturate(260%) contrast(170%)"; break;
		case "xRay": filterRule = "invert(100%) grayscale(100%) contrast(260%) brightness(90%)"; break;
		case "thermal": filterRule = "invert(90%) saturate(450%) hue-rotate(185deg) contrast(190%)"; break;
		case "virtualBoy": filterRule = "grayscale(100%) brightness(130%) contrast(350%) sepia(100%) hue-rotate(310deg) saturate(1000%)"; break;
		case "eldritch": filterRule = "contrast(240%) brightness(55%) saturate(190%) hue-rotate(255deg)"; break;
		case "haunted": filterRule = "grayscale(75%) brightness(135%) contrast(165%) sepia(35%) hue-rotate(65deg) blur(0.5px)"; break;
		case "glitch": filterRule = "url('#spkmod-fx-glitch') contrast(135%) saturate(200%)"; break;
		case "kaleido": filterRule = "contrast(135%) saturate(380%) hue-rotate(180deg) brightness(115%)"; break;
		case "supernova": filterRule = "brightness(165%) contrast(180%) saturate(240%)"; break;
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
		isVip = n === "glas" || n === "sp1cky" || n === "gmdt" || n === "peiyu" || n === "obagi";
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

	const activeFontStack = (typeof getSpkmodActiveFontStack === "function") ? getSpkmodActiveFontStack() : "";
	const customFontRules = activeFontStack ? `
		:root {
			--sr-font: ${activeFontStack} !important;
		}
		body, #app,
		input, button, textarea, select, .sr-input, .sr-btn,
		#spkmod-hud, #spkmod-drag-btn,
		[id^="spkmod-"], [id^="spkmod-"] *:not(code):not(pre):not(.spkmod-ql-masked),
		.spkmod-avatar-dialog, .spkmod-avatar-dialog * {
			font-family: ${activeFontStack} !important;
		}
	` : "";

	const styleTag = document.getElementById("spkmod-dynamic-styles") || document.createElement("style");
	styleTag.id = "spkmod-dynamic-styles";
	styleTag.innerHTML = `
		:root {
			--spkmod-scale: ${lunUiScale};
			--spkmod-bg: ${bgRule};
			--spkmod-blur: ${blurRule};
			--spkmod-accent: ${lunAccentColor};
		}
		${customFontRules}
				#app { filter: ${filterRule}; }
		#app > *:not(.sr-game-canvas):not(canvas):not(.sr-click-ripple-layer) { zoom: ${lunGameUiScale} !important; }
		#spkmod-hud, #spkmod-settings-modal, #spkmod-event-modal, #spkmod-patchnotes-modal, #spkmod-bbs-modal, #spkmod-info-modal, #spkmod-effects-modal, #spkmod-stats-modal, #spkmod-edits-modal, #spkmod-quests-modal, #spkmod-jukebox-modal, #spkmod-css-modal, #spkmod-resource-pack-modal { transform: scale(var(--spkmod-scale)); transform-origin: top left; }
		#spkmod-pq, body > #spkmod-panel { transform: scale(var(--spkmod-scale)); transform-origin: top right; }
		#spkmod-main, #spkmod-pq, #spkmod-settings-modal, #spkmod-gamepad-modal, #spkmod-players-modal, #spkmod-event-modal, #spkmod-patchnotes-modal, #spkmod-bbs-modal, #spkmod-info-modal, #spkmod-effects-modal, #spkmod-stats-modal, #spkmod-edits-modal, #spkmod-quests-modal, #spkmod-jukebox-modal, #spkmod-css-modal, #spkmod-resource-pack-modal, .spkmod-panel-btn, .spkmod-panel-counter, .spkmod-panel-combo, #spkmod-discord-btn, .spkmod-friend-panel-menu {
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
		.spkmod-panel-btn:not(:disabled):hover { background: rgba(255,255,255,0.1) !important; }
		.spkmod-panel-btn:disabled { opacity: 0.45; cursor: not-allowed; }
		.spkmod-custom-emoji { position: relative; display: inline-block; cursor: pointer; }
	`;
	if (!document.getElementById("spkmod-dynamic-styles")) {
		document.head.appendChild(styleTag);
	}
}

function isFaintBlockedZone(zoneId) {
	const raw = zoneId !== undefined ? zoneId : (typeof gameState !== "undefined" && gameState ? gameState.zoneId : null);
	if (typeof raw !== "number" || isNaN(raw)) return false;
	const zid = raw % 10000;
	return zid >= 6900 && zid <= 6999;
}

function syncFaintButtonsForZone(zoneId) {
	const blocked = isFaintBlockedZone(zoneId);
	if (blocked && window.AutoFaintActive) {
		window.AutoFaintActive = false;
		window.__autoFaintPhase = false;
		clearTimeout(window.__autoFaintTimeoutId);
		if (lunPanelElements.autoFaintBtn) {
			setText(lunPanelElements.autoFaintBtn, t("aFaintOff"));
		}
	}
	if (lunPanelElements.faintBtn) {
		lunPanelElements.faintBtn.disabled = blocked;
	}
	if (lunPanelElements.autoFaintBtn) {
		lunPanelElements.autoFaintBtn.disabled = blocked;
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
		isVip = n === "glas" || n === "sp1cky" || n === "gmdt" || n === "peiyu" || n === "obagi";
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
		body.spkmod-panel-left-mode #spkmod-hud {
			flex-direction: row-reverse !important;
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
			pointer-events: none;
		}
		#spkmod-hud > * {
			pointer-events: auto;
		}
		.sr-chatbox__body-text.spkmod-translated-line { color: #ffd54a !important; -webkit-text-fill-color: #ffd54a !important;  }
		body.spkmod-chat-player-colors-on .sr-chatbox__sender.spkmod-colored-msg-el,
		body.spkmod-chat-player-colors-on .sr-chatbox__body-text.spkmod-colored-msg-el:not(.spkmod-gmdt-line),
		body.spkmod-chat-player-colors-on .sr-chatbox__body-text.spkmod-translated-line.spkmod-colored-msg-el {
			color: var(--spkmod-msg-color) !important;
			-webkit-text-fill-color: var(--spkmod-msg-color) !important;
			text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85) !important;
		}
		body.spkmod-chat-player-colors-on .sr-chatbox__sender.spkmod-friend-sender.spkmod-colored-msg-el {
			text-shadow: 0 0 6px rgba(77, 208, 225, 0.45), 0 1px 2px rgba(0, 0, 0, 0.85) !important;
		}
		body.spkmod-chat-player-colors-on .sr-chatbox__sender.spkmod-party-sender.spkmod-colored-msg-el {
			text-shadow: 0 0 6px rgba(105, 240, 174, 0.45), 0 1px 2px rgba(0, 0, 0, 0.85) !important;
		}
		body.spkmod-chat-player-colors-on .sr-chatbox__sender.spkmod-gm-sender.spkmod-colored-msg-el {
			text-shadow: 0 0 6px rgba(255, 167, 38, 0.45), 0 1px 2px rgba(0, 0, 0, 0.85) !important;
		}
		.sr-chatbox__row.spkmod-mention-line {
			background: rgba(255, 200, 0, 0.15) !important;
			border-left: 3px solid #ffcc00 !important;
		}
		body .sr-chatbox__row.spkmod-mention-line .sr-chatbox__body-text {
			font-weight: bold !important;
			color: #fffacd !important;
			-webkit-text-fill-color: #fffacd !important;
			text-shadow: 1px 1px 2px #000, 0 0 4px #ffaa00 !important;
		}
		.sr-chatbox__body-text.spkmod-gmdt-line { font-weight: 800 !important; color: #ffa726 !important; -webkit-text-fill-color: #ffa726 !important; text-shadow: 0 0 6px rgba(255, 167, 38, 0.45) !important; }
		.sr-chatbox__sender.spkmod-friend-sender { color: #4dd0e1 !important; -webkit-text-fill-color: #4dd0e1 !important; font-weight: bold !important; text-shadow: 0 0 6px rgba(77, 208, 225, 0.45) !important; }
		.sr-chatbox__sender.spkmod-party-sender { color: #69f0ae !important; -webkit-text-fill-color: #69f0ae !important; font-weight: bold !important; text-shadow: 0 0 6px rgba(105, 240, 174, 0.45) !important; }
		.sr-chatbox__sender.spkmod-gm-sender { color: #ffa726 !important; -webkit-text-fill-color: #ffa726 !important; font-weight: bold !important; text-shadow: 0 0 6px rgba(255, 167, 38, 0.45) !important; }
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
			max-height: calc(100vh / var(--spkmod-scale) - 80px);
			overflow-y: auto;
			overflow-x: hidden;
		}
		#spkmod-panel::-webkit-scrollbar { width: 4px; }
		#spkmod-panel::-webkit-scrollbar-track { background: transparent; }
		#spkmod-panel::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
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
			width: min(720px, calc(100vw - 20px));
			min-width: min(440px, calc(100vw - 20px));
			max-width: calc(100vw - 20px);
			height: max-content;
			max-height: calc(100vh - 40px);
			overflow-y: auto;
			overflow-x: hidden;
			box-sizing: border-box;
			color: #FFF;
			background: #000C;
			border: ${spkmodBorderWidth} solid #DDD;
			border-radius: 8px;
			padding: 10px;
			gap: 8px;
			cursor: move;
			user-select: none;
			-webkit-overflow-scrolling: touch;
		}
		.spkmod-settings-grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 10px;
		}
		@media (max-width: 720px) {
			#spkmod-settings-modal {
				width: calc(100vw - 20px) !important;
				max-width: calc(100vw - 20px) !important;
				min-width: 0 !important;
			}
			.spkmod-settings-grid {
				grid-template-columns: 1fr !important;
			}
			#spkmod-settings-resize-handle {
				display: none !important;
			}
		}
		@media (max-height: 500px) {
			#spkmod-settings-modal {
				max-height: calc(100vh - 16px) !important;
				padding: 8px 10px;
				gap: 5px;
			}
		}
		body.spkmod-is-mobile #spkmod-settings-modal {
			min-width: 0 !important;
			width: min(760px, calc(100vw - 16px)) !important;
			max-width: calc(100vw - 16px) !important;
			max-height: calc(100vh - 12px) !important;
			padding: 6px 8px !important;
			gap: 4px !important;
			font-size: 11px !important;
			transform: scale(calc(var(--spkmod-scale) * 0.95)) !important;
			transform-origin: top left !important;
		}
		body.spkmod-is-mobile #spkmod-css-modal,
		body.spkmod-is-mobile #spkmod-resource-pack-modal {
			width: min(720px, calc(100vw - 16px)) !important;
			max-width: calc(100vw - 16px) !important;
			min-width: 0 !important;
			max-height: calc(100vh - 16px) !important;
			transform: scale(calc(var(--spkmod-scale) * 0.95)) !important;
			transform-origin: top left !important;
		}
		body.spkmod-is-mobile .spkmod-settings-grid {
			grid-template-columns: 1fr 1fr !important;
			gap: 6px !important;
		}
		@media (max-width: 520px) {
			body.spkmod-is-mobile .spkmod-settings-grid {
				grid-template-columns: 1fr !important;
			}
		}
		body.spkmod-is-mobile #spkmod-settings-resize-handle {
			display: none !important;
		}
		body.spkmod-is-mobile .spkmod-settings-col {
			padding: 4px 6px !important;
			gap: 3px !important;
		}
		body.spkmod-is-mobile .spkmod-settings-col .spkmod-panel-cat {
			gap: 4px !important;
			font-size: 10px !important;
		}
		body.spkmod-is-mobile .spkmod-settings-slider {
			width: 60px !important;
			height: 4px !important;
		}
		body.spkmod-is-mobile .spkmod-panel-combo {
			font-size: 10px !important;
			padding: 1px 3px !important;
			max-width: 80px !important;
		}
		body.spkmod-is-mobile .spkmod-panel-btn {
			font-size: 10px !important;
			padding: 2px 5px !important;
		}
		body.spkmod-is-mobile .spkmod-settings-section-title {
			font-size: 10px !important;
			padding-bottom: 2px !important;
			margin-bottom: 1px !important;
		}
		body.spkmod-is-mobile #spkmod-settings-modal .spkmod-credits {
			font-size: 9px !important;
			line-height: 1.2 !important;
			padding: 3px 5px !important;
		}
		body.spkmod-is-mobile #spkmod-cinema-hud-bar {
			top: 6px !important;
			padding: 3px 8px !important;
			gap: 5px !important;
			font-size: 11px !important;
			max-width: calc(100vw - 16px) !important;
			border-radius: 6px !important;
		}
		body.spkmod-is-mobile #spkmod-cinema-hud-now-playing-container {
			max-width: min(180px, 26vw) !important;
			font-size: 10.5px !important;
		}
		body.spkmod-is-mobile #spkmod-cinema-hud-vol-slider {
			width: 38px !important;
		}
		body.spkmod-is-mobile #spkmod-cinema-exit-btn {
			padding: 2px 7px !important;
			font-size: 10.5px !important;
			margin-left: 2px !important;
		}
		body.spkmod-is-mobile #spkmod-cinema-hud-playlist-btn {
			padding: 2px 5px !important;
			font-size: 10px !important;
		}
		body.spkmod-is-mobile #spkmod-cinema-dock {
			padding: 2px 7px !important;
			gap: 4px !important;
			font-size: 11px !important;
			border-radius: 16px !important;
			max-width: calc(100vw - 20px) !important;
		}
		body.spkmod-is-mobile #spkmod-cinema-dock button {
			font-size: 11px !important;
			padding: 1px 2px !important;
		}
		body.spkmod-is-mobile #spkmod-cinema-dock #spkmod-cinema-vol-slider {
			width: 38px !important;
		}
		body.spkmod-is-mobile #spkmod-cinema-dock #spkmod-cinema-vol-label {
			font-size: 10px !important;
			min-width: 24px !important;
		}
		body.spkmod-is-mobile #spkmod-cinema-modal {
			width: min(340px, calc(100vw - 16px)) !important;
			max-height: calc(100vh - 12px) !important;
			padding: 8px 10px !important;
			gap: 5px !important;
		}
		body.spkmod-is-mobile #spkmod-cinema-modal-list {
			max-height: 140px !important;
			min-height: 80px !important;
		}
		body.spkmod-is-mobile #spkmod-cinema-modal-thumb {
			width: 44px !important;
			height: 32px !important;
		}
		body.spkmod-is-mobile #spkmod-cinema-modal-now-card {
			padding: 5px 7px !important;
			gap: 6px !important;
		}
		body.spkmod-is-mobile #spkmod-cinema-modal-controls {
			padding: 3px 6px !important;
		}
		.spkmod-settings-col {
			display: flex;
			flex-direction: column;
			gap: 5px;
			background: rgba(255, 255, 255, 0.03);
			border: 1px solid rgba(255, 255, 255, 0.08);
			border-radius: 6px;
			padding: 8px;
			min-width: 0;
			box-sizing: border-box;
		}
		.spkmod-settings-col .spkmod-panel-cat {
			gap: 8px;
			justify-content: space-between;
		}
		.spkmod-settings-col .spkmod-panel-cat > span {
			white-space: nowrap;
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
			padding: 2px 8px;
			font-size: 14px;
			font-weight: bold;
			line-height: 1;
			touch-action: manipulation;
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
			user-select: none;
			cursor: pointer;
		}
		#spkmod-gamepad-modal, #spkmod-players-modal, #spkmod-event-modal, #spkmod-patchnotes-modal, #spkmod-bbs-modal, #spkmod-info-modal, #spkmod-effects-modal, #spkmod-stats-modal, #spkmod-edits-modal {
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
			overflow-x: hidden;
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
		#spkmod-patchnotes-modal, #spkmod-info-modal {
			width: 380px;
			max-width: 95vw;
		}
		#spkmod-bbs-modal {
			position: fixed !important;
			width: 520px;
			min-width: 360px;
			min-height: 280px;
			max-width: 98vw;
			max-height: 94vh;
			overflow: hidden !important;
		}
		#spkmod-css-modal {
			position: fixed !important;
			width: 580px;
			height: 500px;
			min-width: 420px;
			min-height: 320px;
			max-width: 98vw;
			max-height: 94vh;
			display: flex;
			flex-direction: column;
			color: #FFF;
			background: rgba(12, 12, 12, 0.96);
			border: ${spkmodBorderWidth} solid #666;
			border-radius: 8px;
			padding: 10px;
			gap: 8px;
			box-shadow: 0 6px 28px rgba(0,0,0,0.85);
			box-sizing: border-box;
			overflow: hidden !important;
		}
		#spkmod-resource-pack-modal {
			position: fixed !important;
			z-index: 2147483645 !important;
			width: 660px;
			height: 540px;
			min-width: 460px;
			min-height: 360px;
			max-width: 98vw;
			max-height: 94vh;
			display: flex;
			flex-direction: column;
			color: #FFF;
			background: rgba(12, 12, 12, 0.96);
			border: ${spkmodBorderWidth} solid #666;
			border-radius: 8px;
			padding: 10px;
			gap: 8px;
			box-shadow: 0 6px 28px rgba(0,0,0,0.85);
			box-sizing: border-box;
			overflow: hidden !important;
		}
		#spkmod-css-textarea {
			font-family: 'Consolas', 'Menlo', 'Monaco', 'Courier New', monospace !important;
			font-size: 12px !important;
			line-height: 1.5 !important;
			tab-size: 2 !important;
			background: #141414 !important;
			color: #f0f0f0 !important;
			border: 1px solid #444 !important;
			border-radius: 4px !important;
			padding: 8px !important;
			resize: none !important;
			width: 100% !important;
			height: 100% !important;
			flex: 1 !important;
			box-sizing: border-box !important;
			outline: none !important;
			white-space: pre !important;
			overflow-wrap: normal !important;
			overflow-x: auto !important;
		}
		#spkmod-css-textarea:focus {
			border-color: #888 !important;
			box-shadow: 0 0 6px rgba(255, 255, 255, 0.2) !important;
		}
		#spkmod-effects-modal {
			width: 960px;
			min-width: 600px;
			max-width: 96vw;
			top: 15%;
		}
		#spkmod-edits-modal {
			width: fit-content;
			min-width: 460px;
			max-width: 95vw;
			top: 15%;
			overflow-x: hidden;
			box-sizing: border-box;
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
		#spkmod-hud.hidden, .hidden, #spkmod-pq.hidden, #spkmod-settings-modal.hidden, #spkmod-gamepad-modal.hidden, #spkmod-players-modal.hidden, #spkmod-event-modal.hidden, #spkmod-stats-modal.hidden, #spkmod-effects-modal.hidden, #spkmod-edits-modal.hidden, #spkmod-quests-modal.hidden, #spkmod-jukebox-modal.hidden, #spkmod-css-modal.hidden, #spkmod-resource-pack-modal.hidden {
			display: none !important;
		}
		
		#spkmod-hud, #spkmod-drag-btn, .spkmod-quick-btn,
		#spkmod-settings-modal, #spkmod-patchnotes-modal, #spkmod-bbs-modal,
		#spkmod-info-modal, #spkmod-effects-modal, #spkmod-stats-modal,
		#spkmod-edits-modal, #spkmod-quests-modal, #spkmod-map-modal,
		#spkmod-jukebox-modal, #spkmod-css-modal, .spkmod-music-modal,
		#spkmod-resource-pack-modal, .spkmod-floating-button {
			z-index: 2147483645 !important;
		}

		#spkmod-emoji-picker-v2, #spkmod-emoji-picker,
		#spkmod-custom-dialog-backdrop,
		#spkmod-poll-modal, #spkmod-telemetry-modal, #spkmod-decalogue-tos {
			z-index: 2147483646 !important;
		}

		#spkmod-global-emoji-preview,
		#spkmod-jukebox-thumb-preview,
		#spkmod-jukebox-hint-toast {
			z-index: 2147483647 !important;
		}

		#spkmod-jukebox-modal:not(.spkmod-mini-mode) {
			min-width: 340px;
			min-height: 220px;
		}
		#spkmod-jukebox-modal.spkmod-mini-mode {
			width: 290px !important;
			height: 42px !important;
			min-width: 0 !important;
			max-width: 290px !important;
			min-height: 0 !important;
			max-height: 42px !important;
			padding: 4px 10px !important;
			border-radius: 24px !important;
			flex-direction: row !important;
			align-items: center !important;
			gap: 8px !important;
			overflow: hidden !important;
		}
		#spkmod-jukebox-modal.spkmod-mini-mode #spkmod-jukebox-header,
		#spkmod-jukebox-modal.spkmod-mini-mode #spkmod-jukebox-seek-row,
		#spkmod-jukebox-modal.spkmod-mini-mode #spkmod-jukebox-drawer,
		#spkmod-jukebox-modal.spkmod-mini-mode #spkmod-jukebox-vol-box,
		#spkmod-jukebox-modal.spkmod-mini-mode #spkmod-jukebox-shuffle,
		#spkmod-jukebox-modal.spkmod-mini-mode #spkmod-jukebox-repeat,
		#spkmod-jukebox-modal.spkmod-mini-mode #spkmod-jukebox-author,
		#spkmod-jukebox-modal.spkmod-mini-mode #spkmod-jukebox-heart-btn,
		#spkmod-jukebox-modal.spkmod-mini-mode #spkmod-jukebox-resize-handle {
			display: none !important;
		}
		#spkmod-jukebox-resize-handle:hover svg path {
			stroke: #ffc94a;
			opacity: 1;
		}

		#spkmod-jukebox-drawer::-webkit-scrollbar {
			width: 6px;
		}
		#spkmod-jukebox-drawer::-webkit-scrollbar-track {
			background: rgba(0, 0, 0, 0.25);
			border-radius: 4px;
		}
		#spkmod-jukebox-drawer::-webkit-scrollbar-thumb {
			background: rgba(232, 184, 75, 0.45);
			border-radius: 4px;
		}
		#spkmod-jukebox-drawer::-webkit-scrollbar-thumb:hover {
			background: rgba(232, 184, 75, 0.75);
		}
		#spkmod-jukebox-bolpop-msg mark {
			background: #e8b84b;
			color: #1a1424;
			padding: 1px 5px;
			border-radius: 4px;
			font-weight: 700;
			display: inline-block;
			margin-top: 4px;
		}
		#spkmod-jukebox-modal.spkmod-mini-mode #spkmod-jukebox-thumb {
			width: 28px !important;
			height: 28px !important;
			border-radius: 50% !important;
		}
		#spkmod-jukebox-modal.spkmod-mini-mode #spkmod-jukebox-track-info {
			padding: 0 !important;
			background: transparent !important;
			flex: 1 !important;
			min-width: 0 !important;
			min-height: 0 !important;
		}
		#spkmod-jukebox-modal.spkmod-mini-mode #spkmod-jukebox-title {
			font-size: 11px !important;
		}
		#spkmod-jukebox-modal.spkmod-mini-mode #spkmod-jukebox-controls-row {
			padding: 0 !important;
			gap: 4px !important;
			flex-shrink: 0 !important;
		}
		#spkmod-jukebox-modal.spkmod-mini-mode #spkmod-jukebox-controls-row button {
			width: 26px !important;
			height: 26px !important;
			font-size: 12px !important;
		}
		#spkmod-jukebox-modal.spkmod-mini-mode #spkmod-jukebox-play {
			width: 30px !important;
			height: 30px !important;
			font-size: 14px !important;
		}
		#spkmod-jukebox-modal.spkmod-mini-mode .spkmod-mini-expand-btn {
			display: flex !important;
		}
		.spkmod-mini-expand-btn {
			display: none;
		}
		
		body.spkmod-ui-hidden #spkmod-hud,
		body.spkmod-ui-hidden #spkmod-pq,
		body.spkmod-ui-hidden #spkmod-settings-modal,
		body.spkmod-ui-hidden #spkmod-event-modal,
		body.spkmod-ui-hidden #spkmod-patchnotes-modal,
		body.spkmod-ui-hidden #spkmod-bbs-modal,
		body.spkmod-ui-hidden #spkmod-gamepad-modal,
		body.spkmod-ui-hidden #spkmod-players-modal,
		body.spkmod-ui-hidden #spkmod-map-modal,
		body.spkmod-ui-hidden #spkmod-stats-modal,
		body.spkmod-ui-hidden #spkmod-effects-modal,
		body.spkmod-ui-hidden #spkmod-edits-modal,
		body.spkmod-ui-hidden #spkmod-quests-modal,
		body.spkmod-ui-hidden #spkmod-jukebox-modal,
		body.spkmod-ui-hidden #spkmod-css-modal,
		body.spkmod-ui-hidden #spkmod-info-modal,
		body.spkmod-ui-hidden #spkmod-translate-picker {
			display: none !important;
		}
		body.sr-hud-hidden.spkmod-hud-keep-chat .sr-chatbox {
			display: flex !important;
		}
		#spkmod-quests-modal {
			min-width: 380px;
			max-width: 95vw;
			max-height: 80vh;
			display: flex;
			flex-direction: column;
			gap: 6px;
			padding: 8px 10px;
			box-sizing: border-box;
			position: fixed;
			z-index: 600000;
			color: #FFF;
			user-select: none;
		}
		#spkmod-quests-list::-webkit-scrollbar { width: 4px; }
		#spkmod-quests-list::-webkit-scrollbar-track { background: transparent; }
		#spkmod-quests-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
		.spkmod-quest-row {
			transition: background 0.15s ease, border-color 0.15s ease;
		}
		.spkmod-quest-row:hover {
			background: rgba(255, 255, 255, 0.08) !important;
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
		@keyframes spkmod-rainbow-glow {
			0% { border-color: #ff3366; box-shadow: 0 0 10px rgba(255, 51, 102, 0.85); }
			20% { border-color: #ff9933; box-shadow: 0 0 10px rgba(255, 153, 51, 0.85); }
			40% { border-color: #ffff33; box-shadow: 0 0 10px rgba(255, 255, 51, 0.85); }
			60% { border-color: #33ff66; box-shadow: 0 0 10px rgba(51, 255, 102, 0.85); }
			80% { border-color: #3399ff; box-shadow: 0 0 10px rgba(51, 153, 255, 0.85); }
			100% { border-color: #cc33ff; box-shadow: 0 0 10px rgba(204, 51, 255, 0.85); }
		}
		.spkmod-rainbow-btn {
			animation: spkmod-rainbow-glow 3s infinite linear alternate !important;
			border: 2px solid #ff3366 !important;
			background: linear-gradient(135deg, rgba(255, 51, 102, 0.3), rgba(51, 153, 255, 0.3)) !important;
			position: relative;
			transition: transform 0.15s ease, filter 0.15s ease;
		}
		.spkmod-rainbow-btn:hover {
			filter: brightness(1.25);
			transform: scale(1.05);
		}
		`

	}
));


document.body.classList.remove("spkmod-ui-hidden");
lunHudElements.lowHpOverlay = buildElement("div", { id: "spkmod-low-hp-overlay" });
document.body.appendChild(lunHudElements.lowHpOverlay);

	const isMobileDevice = typeof window.speakiMobile !== "undefined" || (typeof navigator !== "undefined" && /mobi|android|iphone|ipad|ipod/i.test(navigator.userAgent));
	if (isMobileDevice) {
		document.body.classList.add("spkmod-is-mobile");
		const mobileBtnContainer = document.createElement("div");
		mobileBtnContainer.id = "spkmod-mobile-btn-container";
		mobileBtnContainer.style.cssText = "position: fixed; bottom: 65px; left: 10px; z-index: 2147483647; display: flex; flex-direction: column; gap: 6px;";
		
		const createToggleBtn = (id, icon, onClick, title = "") => {
			const btn = document.createElement("button");
			btn.id = id;
			btn.innerText = icon;
			if (title) btn.title = title;
			btn.style.cssText = "width: 38px; height: 38px; border-radius: 50%; background: rgba(0,0,0,0.65); border: 1.5px solid rgba(255,255,255,0.3); color: white; display: flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer; user-select: none; opacity: 0.85; touch-action: manipulation; box-shadow: 0 2px 8px rgba(0,0,0,0.5); transition: transform 0.1s ease;";
			
			let lastTrigger = 0;
			const handleTrigger = (e) => {
				const now = Date.now();
				if (now - lastTrigger < 250) return;
				lastTrigger = now;
				if (e) {
					e.preventDefault();
					e.stopPropagation();
				}
				btn.style.transform = "scale(0.9)";
				setTimeout(() => { btn.style.transform = ""; }, 120);
				onClick(e);
			};

			btn.addEventListener("click", handleTrigger);
			btn.addEventListener("touchend", handleTrigger, { passive: false });
			return btn;
		};

		const eyeBtn = createToggleBtn("spkmod-mobile-ui-toggle", "👁️", (e) => {
			const isHidden = document.body.classList.toggle("spkmod-ui-hidden");
			if (typeof chatLog !== 'undefined' && typeof t !== 'undefined') {
				chatLog(t(isHidden ? "uiHiddenMsg" : "uiShownMsg") || (isHidden ? "Mod UI Hidden" : "Mod UI Shown"));
			}
		}, (typeof t === "function" ? t("hkDescToggleUI") : "") || "Toggle UI Visibility");

		const muteBtn = createToggleBtn("spkmod-mobile-mute-toggle", (typeof isGameMuted === "function" && isGameMuted()) ? "🔇" : "🔊", (e) => {
			if (typeof toggleGameMute === "function") toggleGameMute();
		}, "Mute / Unmute");

		const resetBtn = createToggleBtn("spkmod-mobile-reset-toggle", "🔄", (e) => {
			if (typeof resetWindowPositions === "function") {
				resetWindowPositions();
			}
		}, (typeof t === "function" ? (t("hkDescResetPositions") || t("resetPositionsBtn")) : "") || "Reset Window Positions (F3)");

		const settingsBtn = createToggleBtn("spkmod-mobile-settings-toggle", "⚙️", (e) => {
			if (typeof toggleSettingsModal === "function") {
				toggleSettingsModal();
			} else if (lunHudElements.settingsModal) {
				const isHidden = lunHudElements.settingsModal.classList.toggle("hidden");
				if (!isHidden) {
					if (typeof positionModalNicely === "function") positionModalNicely(lunHudElements.settingsModal);
					if (typeof bringToFront === "function") bringToFront(lunHudElements.settingsModal);
					if (typeof updateHudBgDropdown === 'function') updateHudBgDropdown();
				}
			}
		}, (typeof t === "function" ? t("settings") : "") || "Settings");

		const panelBtn = createToggleBtn("spkmod-mobile-panel-toggle", "🔘", (e) => {
			const panel = document.getElementById("spkmod-panel");
			if (panel) {
				panel.classList.toggle("hidden");
			}
		}, "Action Panel");

		mobileBtnContainer.appendChild(eyeBtn);
		mobileBtnContainer.appendChild(muteBtn);
		mobileBtnContainer.appendChild(resetBtn);
		mobileBtnContainer.appendChild(settingsBtn);
		mobileBtnContainer.appendChild(panelBtn);
		document.body.appendChild(mobileBtnContainer);
	}



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
				// innerText: t("currencyTracker", "--", "--", "--"),
				innerText: t("currencyTracker", "--", "--", "--").replace(/ \| 🟣.*/, ""),
				style: lunCurrencyTrackerEnabled ? "" : "display: none;"
			}),
			lunHudElements.sessionGoldTracker = buildElement("span", {
				innerText: t("sessionGoldText", "--", "--"),
				style: lunSessionGoldTrackerEnabled ? "" : "display: none;"
			}),
			lunHudElements.channelTracker = buildElement("span", {
				innerText: "...",
				style: lunChannelTrackerEnabled ? "" : "none"
			}),
			lunHudElements.fpsPingTracker = buildElement("span", {
				innerText: t("fpsPingText", "--", "--"),
				style: lunFpsPingEnabled ? "" : "display: none;"
			}),
			lunHudElements.speedometerTracker = buildElement("span", {
				innerText: t("speedometerText", "0.0"),
				style: lunSpeedometerEnabled ? "" : "display: none;"
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
				style: (typeof window.speakiMobile !== "undefined" || (typeof navigator !== "undefined" && /mobi|android/i.test(navigator.userAgent))) ? "display: none !important;" : "",
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
		lunHudElements.panel = buildElement("div", {
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
							gameState.sendEmoteNow(Emotes.Dance || 16);
						}
					}
				}),
				lunPanelElements.faintBtn = buildElement("button", {
					className: "spkmod-panel-btn",
					innerText: t("faintOn"),
					value: "",
					disabled: isFaintBlockedZone(),
					onclick: _ => {
						if (isFaintBlockedZone()) return;
						if (typeof gameState !== "undefined" && gameState?.sendEmoteNow) gameState.sendEmoteNow(15);
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
				lunPanelElements.autoFaintBtn = buildElement("button", {
					id: "spkmod-autofaint-btn",
					className: "spkmod-panel-btn",
					innerText: t(window.AutoFaintActive ? "aFaintOn" : "aFaintOff"),
					value: "",
					disabled: isFaintBlockedZone(),
					onclick: e => {
						if (isFaintBlockedZone()) return;
						window.AutoFaintActive = !window.AutoFaintActive;
						setText(e.target, t(window.AutoFaintActive ? "aFaintOn" : "aFaintOff"));
						if (window.AutoFaintActive) {
							if (typeof autoFaintLoop === "function") autoFaintLoop();
						} else {
							clearTimeout(window.__autoFaintTimeoutId);
						}
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
				lunPanelElements.justPetBtn = buildElement("button", {
					id: "spkmod-justpet-btn",
					className: "spkmod-panel-btn",
					innerText: t(window.JustPetActive ? "justPetOn" : "justPetOff") || (window.JustPetActive ? "Just Pet: ⏸️" : "Just Pet: ▶️"),
					value: "",
					onclick: e => {
						toggleJustPet(e.target);
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
					max: "4.0",
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

			(function() {
				// Zoom step cycle helper (5-10-15-20-30-40-50-60-70-80-90-5)
				window.LUN_ZOOM_STEPS = [5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90];
				window.lunZoomIndex = -1;

				window.cycleCameraZoom = function() {
					if (typeof gameState === "undefined" || !gameState?.cameraController) {
						if (typeof chatLog !== "undefined") chatLog("Camera not ready.");
						return;
					}
					const curZoom = Math.round(gameState.cameraController.cameraZoomDistance || 12);
					const matchIdx = window.LUN_ZOOM_STEPS.indexOf(curZoom);
					if (matchIdx !== -1) {
						window.lunZoomIndex = (matchIdx + 1) % window.LUN_ZOOM_STEPS.length;
					} else if (window.lunZoomIndex === -1) {
						window.lunZoomIndex = 0;
					} else {
						window.lunZoomIndex = (window.lunZoomIndex + 1) % window.LUN_ZOOM_STEPS.length;
					}
					const targetZoom = window.LUN_ZOOM_STEPS[window.lunZoomIndex];
					gameState.cameraController.cameraZoomDistance = targetZoom;
					if (typeof chatLog !== "undefined") {
						chatLog(t("zoomSetMsg", targetZoom));
					}
					window.updateZoomButtonText();
				};

				window.updateZoomButtonText = function() {
					if (!lunPanelElements.zoomBtn) return;
					const cur = (typeof gameState !== "undefined" && gameState?.cameraController?.cameraZoomDistance) 
						? Math.round(gameState.cameraController.cameraZoomDistance) 
						: (window.lunZoomIndex >= 0 ? window.LUN_ZOOM_STEPS[window.lunZoomIndex] : 12);
					setText(lunPanelElements.zoomBtn, t("zoomBtn", cur));
				};
				return null;
			})(),

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
					id: "lun-nametags-btn",
					className: "spkmod-panel-btn",
					innerText: t(NAMETAG_MODES[lunNametagMode] + "Btn") || t("showAllNametagsBtn"),
					value: "",
					onclick: () => {
						lunNametagMode = (lunNametagMode + 1) % 4;
						window.lunNametagMode = lunNametagMode;
						if (window.localStorage) {
							try { localStorage.setItem("spkmod-nametag-mode", String(lunNametagMode)); } catch (_) {}
						}
						if (lunNametagMode === 2) {
							fetchFriendsList(true);
						}
						refreshAllNametags();
						if (lunPanelElements.nametagsBtn) {
							setText(lunPanelElements.nametagsBtn, t(NAMETAG_MODES[lunNametagMode] + "Btn"));
						}
					}
				}),
				lunPanelElements.chowayoBtn = buildElement("button", {
					id: "spkmod-chowayo-btn",
					className: "spkmod-panel-btn",
					innerText: t("chowayo") || "Chowayo",
					value: "",
					onclick: e => {
						if (typeof gameState !== "undefined" && gameState?.sendEmoteNow) {
							gameState.sendEmoteNow(typeof Emotes !== "undefined" ? Emotes.MinigameJoayo || 3 : 3);
						}
					}
				})
			]),

			buildElement("div", { className: "spkmod-panel-cat" }, [
				lunPanelElements.zoomBtn = buildElement("button", {
					id: "spkmod-zoom-btn",
					className: "spkmod-panel-btn",
					innerText: t("zoomBtn", (typeof gameState !== "undefined" && gameState?.cameraController?.cameraZoomDistance) ? Math.round(gameState.cameraController.cameraZoomDistance) : 12),
					value: "",
					onclick: () => {
						if (typeof window.cycleCameraZoom === "function") window.cycleCameraZoom();
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
							if (lunTrueFirstPersonActive) {
								lunTrueFirstPersonActive = false;
								if (window.lunInvisibilityActive && typeof window.spkmodToggleInvisibility === "function") window.spkmodToggleInvisibility();
								if (lunPanelElements.trueFirstPersonBtn) setText(lunPanelElements.trueFirstPersonBtn, t("trueFirstPersonOff"));
							}
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
									if (remoteContainers.includes(c) || c === gameState.selfMinigameRing) return;
									c.visible = true;
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
				lunPanelElements.trueFirstPersonBtn = buildElement("button", {
					className: "spkmod-panel-btn",
					innerText: t("trueFirstPersonOff"),
					onclick: e => {
						lunTrueFirstPersonActive = !lunTrueFirstPersonActive;
						setText(e.target, t(lunTrueFirstPersonActive ? "trueFirstPersonOn" : "trueFirstPersonOff"));
						if (lunTrueFirstPersonActive) {
							if (lunFirstPersonActive) {
								lunFirstPersonActive = false;
								if (lunPanelElements.firstPersonBtn) setText(lunPanelElements.firstPersonBtn, t("firstPersonOff"));
							}
							lunDroneModeActive = false;
							if (lunPanelElements.freeCamBtn) setText(lunPanelElements.freeCamBtn, t("freeCamOff"));

							// Enable 👻 invisibility
							if (!window.lunInvisibilityActive && typeof window.spkmodToggleInvisibility === "function") {
								window.spkmodToggleInvisibility();
							}

							if (typeof gameState !== "undefined" && gameState?.cameraController) {
								gameState.cameraController.cameraZoomDistance = 0.05;
								lunViewClip = true;
								if (lunPanelElements.viewClipBtn) setText(lunPanelElements.viewClipBtn, t("viewClipOn"));
							}
						} else {
							// Disable 👻 invisibility
							if (window.lunInvisibilityActive && typeof window.spkmodToggleInvisibility === "function") {
								window.spkmodToggleInvisibility();
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
							if (lunTrueFirstPersonActive) {
								lunTrueFirstPersonActive = false;
								if (window.lunInvisibilityActive && typeof window.spkmodToggleInvisibility === "function") window.spkmodToggleInvisibility();
								if (lunPanelElements.trueFirstPersonBtn) setText(lunPanelElements.trueFirstPersonBtn, t("trueFirstPersonOff"));
							}
							if (gameState.playerContainer) {
								const remoteContainers = gameState.remotePlayers?.remotePlayers ? 
									Array.from(gameState.remotePlayers.remotePlayers.values()).map(rp => rp.container) : [];
								gameState.playerContainer.children.forEach(c => {
									if (remoteContainers.includes(c) || c === gameState.selfMinigameRing) return;
									c.visible = true;
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
			buildElement("div", { className: "spkmod-panel-cat", style: "display: flex; gap: 4px;" }, [
				lunPanelElements.localEffectsBtn = buildElement("button", {
					className: "spkmod-panel-btn",
					style: "padding: 6px; font-size: 11px; flex: 1; text-align: center; font-weight: bold; cursor: pointer;",
					innerText: t("localEffectsBtn"),
					onclick: (e) => {
						e.preventDefault();
						if (typeof toggleEffectsModal === "function") {
							toggleEffectsModal();
						} else if (lunHudElements.effectsModal) {
							const isHidden = lunHudElements.effectsModal.classList.toggle("hidden");
							if (!isHidden) {
								if (typeof bringToFront === "function") bringToFront(lunHudElements.effectsModal);
								if (typeof positionModalNicely === "function") positionModalNicely(lunHudElements.effectsModal);
								if (typeof updateLocalEditsUI === "function") updateLocalEditsUI();
							}
						}
					}
				}),
				lunPanelElements.localEditsBtn = buildElement("button", {
					className: "spkmod-panel-btn",
					style: "padding: 6px; font-size: 11px; flex: 1; text-align: center; font-weight: bold; cursor: pointer;",
					innerText: t("localEditsBtn") || "🎨 Local Edits",
					onclick: (e) => {
						e.preventDefault();
						if (typeof toggleLocalEditsModal === "function") {
							toggleLocalEditsModal();
						} else if (lunHudElements.editsModal) {
							const isHidden = lunHudElements.editsModal.classList.toggle("hidden");
							if (!isHidden) {
								if (typeof bringToFront === "function") bringToFront(lunHudElements.editsModal);
								if (typeof positionModalNicely === "function") positionModalNicely(lunHudElements.editsModal);
								if (typeof updateLocalEditsUI === "function") updateLocalEditsUI();
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
				}),
				lunPanelElements.langSelect = buildElement("select", {
					className: "spkmod-panel-combo",
					style: "flex: 0 0 88px; width: 88px; height: 28px; padding: 0 4px; font-size: 9pt; box-sizing: border-box;",
					value: spkmodLang,
					onchange: e => {
						setLanguage(e.target.value);
					}
				}, Object.keys(spkmodTranslations).map(code => buildElement("option", {
					value: code,
					innerText: spkmodTranslations[code].langName,
					selected: code === spkmodLang
				})))
			]),
			buildElement("div", {
				className: "spkmod-panel-cat"
			}, [
				lunPanelElements.muteBtn = buildElement("button", {
					id: "spkmod-mute-btn",
					className: "spkmod-panel-btn",
					style: "flex: 1; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 12pt; cursor: pointer;",
					innerText: (typeof isGameMuted === "function" && isGameMuted()) ? "🔇" : "🔊",
					onclick: _ => {
						if (typeof toggleGameMute === "function") toggleGameMute();
					}
				}),
				lunPanelElements.invisibleBtn = buildElement("button", {
					id: "spkmod-invisible-ghost-btn",
					className: "spkmod-panel-btn",
					style: "flex: 1; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 12pt; cursor: pointer;" + (window.lunInvisibilityActive ? " background: #5a2e2e !important;" : ""),
					innerText: "👻",
					onclick: _ => {
						if (window.spkmodToggleInvisibility) window.spkmodToggleInvisibility();
					}
				}),
				lunPanelElements.settingsBtn = buildElement("button", {
					id: "spkmod-settings-btn",
					className: "spkmod-panel-btn",
					style: "flex: 1; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 12pt; cursor: pointer;",
					innerText: "⚙️",
					onclick: _ => {
						toggleSettingsModal();
					}
				}),
				lunPanelElements.hotkeysBtn = buildElement("button", {
					id: "spkmod-hotkeys-btn",
					className: "spkmod-panel-btn",
					style: "flex: 1; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 12pt; cursor: pointer;",
					innerText: "⌨️",
					onclick: _ => {
						toggleHotkeysModal();
					}
				}),
				lunPanelElements.patchNotesBtn = buildElement("button", {
					id: "spkmod-patchnotes-btn",
					className: "spkmod-panel-btn",
					style: "flex: 1; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 12pt; cursor: pointer;",
					innerText: "📰",
					onclick: _ => {
						togglePatchNotesModal();
					}
				}),
				lunPanelElements.bbsBtn = buildElement("button", {
					id: "spkmod-bbs-btn",
					className: "spkmod-panel-btn",
					style: "flex: 1; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 12pt; cursor: pointer; position: relative;",
					onclick: _ => {
						if (typeof toggleBbsModal === "function") toggleBbsModal();
					}
				}, [
					buildElement("span", {
						id: "spkmod-bbs-btn-icon",
						style: "display: inline-flex; align-items: center; justify-content: center; pointer-events: none;",
						innerHTML: renderSpkmodInlineEmojis(":t_280:", "height: 20px; width: 20px; object-fit: contain; display: block; pointer-events: none; user-select: none;")
					})
				]),
				lunPanelElements.infoBtn = buildElement("button", {
					id: "spkmod-info-btn",
					className: "spkmod-panel-btn",
					style: "flex: 1; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 12pt; cursor: pointer;",
					innerText: "ℹ️",
					onclick: _ => {
						toggleInfoModal();
					}
				})
			]),
			buildElement("div", {
				className: "spkmod-panel-cat"
			}, [
				lunPanelElements.minigameBtn = buildElement("button", {
					id: "spkmod-minigame-btn",
					className: "spkmod-panel-btn",
					style: "flex: 1; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 12pt; cursor: pointer;",
					innerText: "🎮",
					onclick: () => {
						lunHudElements.eventModal.classList.add("hidden");
						window.gameState.onNpcInteract("minigame")
					}
				}),
				lunPanelElements.eventBtn = buildElement("button", {
					id: "spkmod-event-btn",
					className: "spkmod-panel-btn",
					style: "flex: 1; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 12pt; cursor: pointer;",
					innerText: "🎉",
					onclick: _ => {
						toggleEventModal();
					}
				}),
				lunPanelElements.mapBtn = buildElement("button", {
					id: "spkmod-map-btn",
					className: "spkmod-panel-btn",
					style: "flex: 1; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 12pt; cursor: pointer;",
					innerText: "🗺️",
					onclick: _ => {
						toggleMapModal();
					}
				}),
				lunPanelElements.statsBtn = buildElement("button", {
					id: "spkmod-stats-btn",
					className: "spkmod-panel-btn",
					style: "flex: 1; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 12pt; cursor: pointer;",
					innerText: "⏱️",
					onclick: _ => {
						toggleStatsModal();
					}
				}),
				lunPanelElements.questsBtn = buildElement("button", {
					id: "spkmod-quests-btn",
					className: "spkmod-panel-btn",
					style: "flex: 1; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 12pt; cursor: pointer; position: relative;",
					innerText: "📋",
					onclick: _ => {
						if (typeof toggleQuestsModal === "function") toggleQuestsModal();
					}
				}),
				lunPanelElements.jukeboxBtn = buildElement("button", {
					id: "spkmod-jukebox-btn",
					className: "spkmod-panel-btn",
					style: "flex: 1; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 12pt; cursor: pointer;",
					innerText: "🎵",
					title: (typeof getJukeboxText === "function" ? getJukeboxText("jukeboxBtnTooltip") : (typeof t === "function" ? t("jukeboxBtnTooltip") : null)) || "Monatium Radio Station (Alt+M)",
					onclick: _ => {
						if (typeof toggleMusicPlayer === "function") toggleMusicPlayer();
					}
				}),
				lunPanelElements.dragBtn = buildElement("button", {
					id: "spkmod-drag-btn",
					className: "spkmod-panel-btn",
					style: "flex: 1; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 12pt; cursor: grab;",
					innerText: "⚓",
					ondblclick: (e) => {
						const isLocked = lunHudElements.hud.dataset.spkmodLocked === "true";
						if (isLocked) {
							lunHudElements.hud.dataset.spkmodLocked = "false";
							e.target.innerText = "⚓";
							e.target.style.cursor = "grab";
							if (window.localStorage) localStorage.setItem("spkmod-hud-locked", "false");
						} else {
							lunHudElements.hud.dataset.spkmodLocked = "true";
							e.target.innerText = "🔒";
							e.target.style.cursor = "not-allowed";
							if (window.localStorage) localStorage.setItem("spkmod-hud-locked", "true");
						}
						if (typeof updateHudIconTooltips === "function") {
							updateHudIconTooltips();
						}
					}
				})
			])
		])
	])
);
if (typeof updateHudIconTooltips === "function") {
	updateHudIconTooltips();
}


let lastPinnedQuestTap = 0;
document.body.appendChild(
	lunHudElements.pinnedQuest.panel = buildElement("div", {
		id: "spkmod-pq",
		className: "hidden",
		title: t("pinnedQuestTooltip") || "Click to expand/collapse. Double-click to unpin",
		onclick: (e) => {
			if (e.target.closest("button")) return;
			if (typeof lunPinnedQuestExpanded !== "undefined") {
				lunPinnedQuestExpanded = !lunPinnedQuestExpanded;
				if (window.__spkmodCachedQuests && typeof lunPinnedQuestId !== "undefined" && lunPinnedQuestId && window.__spkmodCachedQuests[lunPinnedQuestId]) {
					if (typeof updatePinnedQuestDisplay === "function") {
						updatePinnedQuestDisplay(window.__spkmodCachedQuests[lunPinnedQuestId]);
					}
				}
			}
		},
		ondblclick: (e) => {
			e.preventDefault();
			e.stopPropagation();
			if (typeof unpinQuest === "function") {
				unpinQuest();
			} else if (typeof window.unpinQuest === "function") {
				window.unpinQuest();
			}
		},
		ontouchend: (e) => {
			const now = Date.now();
			if (now - lastPinnedQuestTap < 400) {
				e.preventDefault();
				e.stopPropagation();
				if (typeof unpinQuest === "function") {
					unpinQuest();
				} else if (typeof window.unpinQuest === "function") {
					window.unpinQuest();
				}
				lastPinnedQuestTap = 0;
			} else {
				lastPinnedQuestTap = now;
			}
		}
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
);

document.body.appendChild(
	lunHudElements.settingsModal = buildElement("div", {
		id: "spkmod-settings-modal",
		className: "hidden"
	}, [
		buildElement("div", { className: "spkmod-panel-cat", style: "justify-content: space-between; align-items: center; touch-action: none; user-select: none;" }, [
			buildElement("div", { style: "display: flex; align-items: center; gap: 8px; flex-wrap: wrap; flex: 1; min-width: 0;" }, [
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
						
						if (typeof toggleQuickLoginSettings === "function") {
							toggleQuickLoginSettings();
						}
					}
				}),

				lunPanelElements.customCssSettingsBtn = buildElement("button", {
					id: "spkmod-settings-css-btn",
					className: "spkmod-panel-btn",
					style: "padding: 2px 6px; font-size: 11px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;",
					innerText: "🎨 " + tCustom("customCssBtn", "Custom CSS"),
					title: tCustom("customCssBtnTooltip", "Edit custom CSS styles and themes"),
					onclick: (e) => {
						e.preventDefault();
						if (typeof toggleCustomCssModal === "function") {
							toggleCustomCssModal();
						}
					}
				}),

				lunPanelElements.resourcePackSettingsBtn = buildElement("button", {
					id: "spkmod-settings-respack-btn",
					className: "spkmod-panel-btn",
					style: "padding: 2px 6px; font-size: 11px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;",
					innerText: "⛏️ " + tCustom("resourcePackBtn", "Resource Packs"),
					title: tCustom("resourcePackBtnTooltip", "Customize mining game voxel block textures"),
					onclick: (e) => {
						e.preventDefault();
						if (typeof toggleResourcePackModal === "function") {
							toggleResourcePackModal();
						}
					}
				}),

				lunPanelElements.cinemaSettingsBtn = buildElement("button", {
					id: "spkmod-settings-cinema-btn",
					className: "spkmod-panel-btn",
					style: "padding: 2px 6px; font-size: 11px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;",
					innerText: (t("cinemaModeBtn") ? ("🎬 " + t("cinemaModeBtn").replace(/^🎬\s*/, "")) : "🎬 Monatium Cinema"),
					title: t("cinemaDesc") || "Open Monatium Cinema controls",
					onclick: (e) => {
						e.preventDefault();
						if (typeof window.spkmodToggleCinemaMode === "function") {
							window.spkmodToggleCinemaMode(true);
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
				lunPanelElements.resolutionOverrideRow = buildElement("div", {
					className: "spkmod-panel-cat",
					style: (typeof spkmodIsMobile === "function" && spkmodIsMobile()) ? "" : "display: none !important;"
				}, [
					lunPanelElements.resolutionOverrideLabel = buildElement("span", {
						style: "color: #fff; font-size: 11px; font-weight: bold; user-select: none; flex: 1;",
						innerText: lunResolutionOverrideLabel()
					}),
					lunPanelElements.resolutionOverrideInput = buildElement("input", {
						type: "range",
						min: "1",
						max: "3.5",
						step: "0.05",
						value: lunResolutionOverride,
						style: "width: 75px; accent-color: #38bdf8; cursor: pointer;",
						oninput: e => {
							lunResolutionOverride = parseFloat(e.target.value);
							if (lunPanelElements.resolutionOverrideLabel) {
								lunPanelElements.resolutionOverrideLabel.innerText = lunResolutionOverrideLabel();
							}
						},
						onchange: e => {
							setResolutionOverride(e.target.value);
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
					lunPanelElements.partyChatToggleLabel = buildElement("span", {
						style: "color: #fff; font-size: 11px; font-weight: bold; user-select: none; flex: 1;",
						innerText: (function() { const s = t("partyChatToggleLabel"); return (!s || s === "partyChatToggleLabel") ? "Highlight Party Members in Chat" : s; })()
					}),
					lunPanelElements.partyChatToggleInput = buildElement("input", {
						type: "checkbox",
						checked: lunPartyChatHighlightEnabled,
						onchange: e => {
							setPartyChatHighlightEnabled(e.target.checked);
						}
					})
				]),
				buildElement("div", { className: "spkmod-panel-cat" }, [
					lunPanelElements.chatRandomColorsLabel = buildElement("span", {
						style: "color: #fff; font-size: 11px; font-weight: bold; user-select: none; flex: 1;",
						innerText: (function() { const s = t("chatRandomColorsToggleLabel"); return (!s || s === "chatRandomColorsToggleLabel") ? "Colorize Player Messages" : s; })()
					}),
					lunPanelElements.chatRandomColorsToggleInput = buildElement("input", {
						type: "checkbox",
						checked: lunChatRandomColorsEnabled,
						onchange: e => {
							setChatRandomColorsEnabled(e.target.checked);
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
					lunPanelElements.mentionPingToggleLabel = buildElement("span", {
						style: "color: #fff; font-size: 11px; font-weight: bold; user-select: none; flex: 1;",
						innerText: t("mentionPingToggleLabel")
					}),
					lunPanelElements.mentionPingToggleInput = buildElement("input", {
						type: "checkbox",
						checked: lunMentionPingEnabled,
						onchange: e => {
							setMentionPingEnabled(e.target.checked);
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
				buildElement("div", { className: "spkmod-panel-cat" }, [
					lunPanelElements.translateEngineLabel = buildElement("span", {
						style: "color: #fff; font-size: 11px; font-weight: bold; user-select: none; flex: 1;",
						innerText: t("translateEngineLabel")
					}),
					lunPanelElements.translateEngineSelect = buildElement("select", {
						className: "spkmod-panel-combo",
						value: lunTranslateEngine,
						onchange: e => setTranslateEngine(e.target.value)
					}, [
						{ value: "google", label: "Google" },
						{ value: "mymemory", label: "MyMemory" }
					].map(item => buildElement("option", {
						value: item.value,
						innerText: item.label,
						selected: item.value === lunTranslateEngine
					})))
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
					style: "contain: inline-size; width: 100%; box-sizing: border-box; color: #aaa; font-size: 10px; line-height: 1.4; padding: 2px 4px 6px;",
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
				]),
				buildElement("div", { className: "spkmod-panel-cat" }, [
					lunPanelElements.telemetryToggleLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("telemetrySettingLabel") }),
					lunPanelElements.telemetryToggleInput = buildElement("input", {
						type: "checkbox",
						checked: (window.localStorage && localStorage.getItem("spkmod-telemetry-consent") === "granted"),
						onchange: e => {
							const granted = e.target.checked;
							if (window.localStorage) localStorage.setItem("spkmod-telemetry-consent", granted ? "granted" : "denied");
							if (granted && typeof window.spkmodSendTelemetryPing === "function") {
								window.spkmodSendTelemetryPing();
							}
						}
					})
				]),
				buildElement("div", { className: "spkmod-panel-cat" }, [
					lunPanelElements.discordRpcLabel = buildElement("span", {
						style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;",
						innerText: t("discordRpcToggleLabel") || "Discord Activity (RPC)",
						title: "Share your game status and level on Discord (Desktop Client)"
					}),
					lunPanelElements.discordRpcToggleInput = buildElement("input", {
						type: "checkbox",
						checked: lunDiscordRpcEnabled,
						title: "Share your game status and level on Discord (Desktop Client)",
						onchange: e => setDiscordRpcEnabled(e.target.checked)
					})
				]),
				buildElement("div", { className: "spkmod-panel-cat" }, [
					lunPanelElements.muteMinimizedLabel = buildElement("span", {
						style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;",
						innerText: t("muteMinimizedToggleLabel") || "Mute Game when Minimized",
						title: "Automatically mute game audio when the window is minimized or hidden"
					}),
					lunPanelElements.muteMinimizedToggleInput = buildElement("input", {
						type: "checkbox",
						checked: lunMuteMinimizedEnabled,
						title: "Automatically mute game audio when the window is minimized or hidden",
						onchange: e => setMuteMinimized(e.target.checked)
					})
				]),

				// Cinema / Movie Theater Controls
				buildElement("div", { className: "spkmod-panel-cat" }, [
					lunPanelElements.cinemaToggleLabel = buildElement("span", {
						style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;",
						innerText: "🎬 " + (t("cinemaTitle") || "Monatium Cinema"),
						title: t("cinemaDesc") || "In-game 3D screen playing YouTube playlist in Zone 1 Festival Plaza"
					}),
					lunPanelElements.cinemaToggleInput = buildElement("input", {
						type: "checkbox",
						checked: (window.spkmodCinemaConfig ? window.spkmodCinemaConfig.enabled : false),
						title: "Toggle 3D screen in Zone 1 Festival Plaza",
						onchange: e => {
							if (window.spkmodCinemaConfig) {
								window.spkmodCinemaConfig.enabled = e.target.checked;
								localStorage.setItem("spkmod-cinema-enabled", e.target.checked ? "true" : "false");
								if (!e.target.checked) {
									if (typeof window.spkmodSendYtCommand === "function") {
										window.spkmodSendYtCommand("pauseVideo");
										window.spkmodSendYtCommand("mute");
									}
									const cont = document.getElementById("spkmod-cinema-container");
									if (cont) cont.style.display = "none";
									const occ = document.getElementById("spkmod-cinema-occlusion-canvas");
									if (occ) occ.style.display = "none";
									if (window.spkmodCinemaFrameMesh) window.spkmodCinemaFrameMesh.visible = false;
									if (typeof window.spkmodUpdateCinemaFloatingPill === "function") {
										window.spkmodUpdateCinemaFloatingPill(false);
									}
								} else {
									if (typeof window.spkmodInitCinema === "function") window.spkmodInitCinema();
								}
							}
						}
					})
				]),
				buildElement("div", { className: "spkmod-panel-cat" }, [
					lunPanelElements.cinemaOcclusionLabel = buildElement("span", {
						style: "color: #ddd; font-size: 11px; flex: 1;",
						innerText: "👥 " + (t("cinemaOcclusionToggle") || "Spiki Occlusion (Avatars block screen)"),
						title: "Avatars standing in front of screen will naturally obscure the movie"
					}),
					lunPanelElements.cinemaOcclusionInput = buildElement("input", {
						type: "checkbox",
						checked: (window.spkmodCinemaConfig ? window.spkmodCinemaConfig.occlusion !== false : true),
						title: "Toggle avatar occlusion in front of cinema screen",
						onchange: e => {
							if (typeof window.spkmodToggleCinemaOcclusion === "function") {
								window.spkmodToggleCinemaOcclusion(e.target.checked);
							} else if (window.spkmodCinemaConfig) {
								window.spkmodCinemaConfig.occlusion = e.target.checked;
								localStorage.setItem("spkmod-cinema-occlusion", e.target.checked ? "true" : "false");
							}
						}
					})
				]),
				buildElement("div", { className: "spkmod-panel-cat", style: "gap: 6px; align-items: center;" }, [
					lunPanelElements.cinemaVolumeLabel = buildElement("span", {
						style: "color: #aaa; font-size: 11px; flex: 1;",
						innerText: "🔊 " + (t("cinemaVolumeLabel") || "Monatium Cinema Volume") + ":"
					}),
					lunPanelElements.cinemaMuteBtn = buildElement("button", {
						id: "spkmod-cinema-panel-mute-btn",
						className: "spkmod-panel-btn",
						style: "padding: 1px 6px; font-size: 11px; cursor: pointer; background: rgba(255,255,255,0.06); border: 1px solid rgba(232, 184, 75, 0.4); border-radius: 4px;",
						innerText: (window.spkmodCinemaConfig?.muted ? "🔇" : "🔊"),
						title: (window.spkmodCinemaConfig?.muted ? (t("cinemaUnmute") || "Unmute") : (t("cinemaMute") || "Mute")),
						onclick: () => {
							if (typeof window.spkmodToggleCinemaMute === "function") {
								window.spkmodToggleCinemaMute();
							}
						}
					}),
					lunPanelElements.cinemaVolumeInput = buildElement("input", {
						type: "range",
						min: "0",
						max: "100",
						value: (window.spkmodCinemaConfig ? window.spkmodCinemaConfig.volume : 80),
						style: "width: 70px; height: 14px; cursor: pointer; accent-color: #e8b84b;",
						oninput: e => {
							const v = parseInt(e.target.value, 10);
							if (typeof window.spkmodSetCinemaVolume === "function") {
								window.spkmodSetCinemaVolume(v, v === 0 ? true : false);
							} else if (window.spkmodCinemaConfig) {
								window.spkmodCinemaConfig.volume = v;
								localStorage.setItem("spkmod-cinema-volume", String(v));
							}
						}
					})
				]),
				buildElement("div", { className: "spkmod-panel-cat", style: "gap: 6px;" }, [
					lunPanelElements.cinemaReloadBtn = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 2px 6px; font-size: 10px; cursor: pointer; flex: 1;",
						innerText: "🔄 " + (t("cinemaReloadPlaylist") || "Reload"),
						title: t("cinemaReloadPlaylist") || "Reload playlist",
						onclick: () => {
							if (typeof window.spkmodLoadMoviesPlaylist === "function") {
								window.spkmodLoadMoviesPlaylist().then(() => {
									if (typeof window.spkmodSyncCinemaPlayback === "function") window.spkmodSyncCinemaPlayback(true);
									alert("🎬 " + (t("cinemaReloadPlaylist") || "Reload Playlist") + " OK!");
								});
							}
						}
					}),
					buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 2px 6px; font-size: 10px; cursor: pointer; flex: 1;",
						innerText: "📋 " + (t("cinemaPlaylistBtn") || "Playlist"),
						title: t("cinemaPlaylistTitle") || "Open Monatium Cinema Playlist",
						onclick: () => {
							if (typeof window.spkmodToggleCinemaModal === "function") {
								window.spkmodToggleCinemaModal(true);
							}
						}
					})
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
					lunPanelElements.panelLeftLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("panelLeftToggleLabel") }),
					lunPanelElements.panelLeftToggleInput = buildElement("input", { type: "checkbox", checked: lunPanelLeft, onchange: e => setPanelLeft(e.target.checked) })
				]),
				buildElement("div", { className: "spkmod-panel-cat" }, [
					lunPanelElements.separatePanelLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("separatePanel") || "Separate Action Panel (Mobile)" }),
					lunPanelElements.separatePanelToggleInput = buildElement("input", { type: "checkbox", checked: lunSeparatePanel, onchange: e => setSeparatePanel(e.target.checked) })
				]),
				buildElement("div", { className: "spkmod-panel-cat" }, [
					lunPanelElements.hidePlayerLevelsLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("hidePlayerLevelsLabel") }),
					lunPanelElements.hidePlayerLevelsToggleInput = buildElement("input", { type: "checkbox", checked: lunHidePlayerLevels, onchange: e => setHidePlayerLevels(e.target.checked) })
				]),
				buildElement("div", { className: "spkmod-panel-cat" }, [
					lunPanelElements.disableRightClickPinningLabel = buildElement("span", {
						style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;",
						innerText: t("disableRightClickPinningLabel") || "Disable Double Right-Click Pinning",
						title: "Disable double right-clicking HUD and modal buttons to pin them floating on screen"
					}),
					lunPanelElements.disableRightClickPinningToggleInput = buildElement("input", {
						type: "checkbox",
						checked: lunDisableRightClickPinning,
						title: "Disable double right-clicking HUD and modal buttons to pin them floating on screen",
						onchange: e => setDisableRightClickPinning(e.target.checked)
					})
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
					lunPanelElements.channelTrackerToggleLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("channelTrackerToggleLabel") }),
					lunPanelElements.channelTrackerToggleInput = buildElement("input", { type: "checkbox", checked: lunChannelTrackerEnabled, onchange: e => {
						lunChannelTrackerEnabled = e.target.checked;
						if (window.localStorage) localStorage.setItem("spkmod-channel-tracker", lunChannelTrackerEnabled);
						if (lunHudElements.channelTracker) lunHudElements.channelTracker.style.display = lunChannelTrackerEnabled ? "" : "none";
						if (typeof lunChannelTrackerNextTicks !== 'undefined') lunChannelTrackerNextTicks = 0;
					} })
				]),
				buildElement("div", { className: "spkmod-panel-cat" }, [
					lunPanelElements.speedometerToggleLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("speedometerToggleLabel") }),
					lunPanelElements.speedometerToggleInput = buildElement("input", { type: "checkbox", checked: lunSpeedometerEnabled, onchange: e => {
						lunSpeedometerEnabled = e.target.checked;
						if (window.localStorage) localStorage.setItem("spkmod-speedometer", lunSpeedometerEnabled ? "true" : "false");
						if (lunHudElements.speedometerTracker) lunHudElements.speedometerTracker.style.display = lunSpeedometerEnabled ? "" : "none";
					} })
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
					lunPanelElements.uiScaleSlider = buildElement("input", { type: "range", min: "0.4", max: "1.3", step: "0.05", value: lunUiScale, style: "width: 70px;", onchange: e => { lunUiScale = e.target.value; if (window.localStorage) localStorage.setItem("spkmod-ui-scale", lunUiScale); updateDynamicStyles(); } })
				]),
				buildElement("div", { className: "spkmod-panel-cat" }, [
					lunPanelElements.cameraEffectLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("cameraEffectLabel") || "Camera Effect" }),
					lunPanelElements.cameraEffectSelect = buildElement("select", { className: "spkmod-panel-combo", value: lunCameraEffect, onchange: e => { lunCameraEffect = e.target.value; if (window.localStorage) localStorage.setItem("spkmod-camera-effect", lunCameraEffect); updateDynamicStyles(); if (typeof updateLocalEditsUI === "function") updateLocalEditsUI(); } }, [
						buildElement("option", { value: "none", innerText: t("effectNone") || "Normal" }),
						buildElement("option", { value: "bw", innerText: t("effectBw") || "Black & White" }),
						buildElement("option", { value: "sepia", innerText: t("effectSepia") || "Sepia" }),
						buildElement("option", { value: "morning", innerText: t("effectMorning") || "Morning" }),
						buildElement("option", { value: "dusk", innerText: t("effectDusk") || "Dusk / Dawn" }),
						buildElement("option", { value: "night", innerText: t("effectNight") || "Night" }),
						buildElement("option", { value: "vaporwave", innerText: t("effectVaporwave") || "Vaporwave" }),
						buildElement("option", { value: "chromatic", innerText: t("effectChromatic") || "Chromatic Aberration" }),
						buildElement("option", { value: "unfocus", innerText: t("effectUnfocus") || "Dreamy Blur" }),
						buildElement("option", { value: "focus", innerText: t("effectFocus") || "Sharp Clarity" }),
						buildElement("option", { value: "vhs", innerText: t("effectVhs") || "90s VHS Tape" }),
						buildElement("option", { value: "cyberpunk", innerText: t("effectCyberpunk") || "Cyberpunk" }),
						buildElement("option", { value: "nostalgia", innerText: t("effectNostalgia") || "Dreamy Train" }),
						buildElement("option", { value: "pastel", innerText: t("effectPastel") || "Pastel Anime" }),
						buildElement("option", { value: "warmVintage", innerText: t("effectWarmVintage") || "Vintage Film" }),
						buildElement("option", { value: "coolCinema", innerText: t("effectCoolCinema") || "Cool Cinema" }),
						buildElement("option", { value: "matrix", innerText: t("effectMatrix") || "Matrix" }),
						buildElement("option", { value: "inverted", innerText: t("effectInverted") || "Negative" }),
						buildElement("option", { value: "gameboy", innerText: t("effectGameboy") || "Monatium Boy" }),
						buildElement("option", { value: "bloodMoon", innerText: t("effectBloodMoon") || "Blood Moon" }),
						buildElement("option", { value: "synthwave", innerText: t("effectSynthwave") || "Synthwave" }),
						buildElement("option", { value: "underwater", innerText: t("effectUnderwater") || "Aqua Fantasy" }),
						buildElement("option", { value: "goldenHour", innerText: t("effectGoldenHour") || "Golden Hour" }),
						buildElement("option", { value: "comicBook", innerText: t("effectComicBook") || "Comic Book" }),
						buildElement("option", { value: "arctic", innerText: t("effectArctic") || "Arctic Frost" }),
						buildElement("option", { value: "cosmic", innerText: t("effectCosmic") || "Cosmic Aurora" }),
						buildElement("option", { value: "filmNoir", innerText: t("effectFilmNoir") || "Film Noir" }),
						buildElement("option", { value: "acidTrip", innerText: t("effectAcidTrip") || "Acid Trip" }),
						buildElement("option", { value: "radioactive", innerText: t("effectRadioactive") || "Radioactive" }),
						buildElement("option", { value: "deepFried", innerText: t("effectDeepFried") || "Deep Fried" }),
						buildElement("option", { value: "alienAbduction", innerText: t("effectAlienAbduction") || "Alien Abduction" }),
						buildElement("option", { value: "xRay", innerText: t("effectXRay") || "X-Ray Vision" }),
						buildElement("option", { value: "thermal", innerText: t("effectThermal") || "Thermal Vision" }),
						buildElement("option", { value: "virtualBoy", innerText: t("effectVirtualBoy") || "Virtual Boy" }),
						buildElement("option", { value: "eldritch", innerText: t("effectEldritch") || "Eldritch Void" }),
						buildElement("option", { value: "haunted", innerText: t("effectHaunted") || "Paranormal Cam" }),
						buildElement("option", { value: "glitch", innerText: t("effectGlitch") || "Glitch Art" }),
						buildElement("option", { value: "kaleido", innerText: t("effectKaleido") || "Rainbow Prism" }),
						buildElement("option", { value: "supernova", innerText: t("effectSupernova") || "Supernova" })
					])
				]),
				buildElement("div", { className: "spkmod-panel-cat" }, [
					lunPanelElements.gameUiScaleLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("gameUiScaleLabel") || "Game UI Scale" }),
					lunPanelElements.gameUiScaleSlider = buildElement("input", { type: "range", min: "0.4", max: "2", step: "0.05", value: lunGameUiScale, style: "width: 70px;", onchange: e => { 
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
					lunPanelElements.fontPresetLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("fontPresetLabel") || "Game Font" }),
					lunPanelElements.fontPresetSelect = buildElement("select", {
						className: "spkmod-panel-combo",
						value: lunFontPreset,
						onchange: e => {
							const val = e.target.value;
							if (lunPanelElements.customFontContainer) {
								if (val === "custom") lunPanelElements.customFontContainer.classList.remove("hidden");
								else lunPanelElements.customFontContainer.classList.add("hidden");
							}
							if (typeof applySpkmodFont === "function") {
								applySpkmodFont(val, lunPanelElements.customFontInput ? lunPanelElements.customFontInput.value : lunCustomFont, true);
							}
						}
					}, [
						buildElement("option", { value: "default", innerText: t("fontPresetDefault") || "Default", selected: lunFontPreset === "default" }),
						buildElement("option", { value: "trickcalPop", innerText: t("fontPresetTrickcalPop") || "Pop (Auto CJK)", selected: lunFontPreset === "trickcalPop" }),
						buildElement("option", { value: "oneMobilePop", innerText: "ONE Mobile POP", selected: lunFontPreset === "oneMobilePop" }),
						buildElement("option", { value: "dfpPop", innerText: "DFP-Pop1-W9", selected: lunFontPreset === "dfpPop" }),
						buildElement("option", { value: "mochiyPop", innerText: "Mochiy Pop One", selected: lunFontPreset === "mochiyPop" }),
						buildElement("option", { value: "knBobohei", innerText: "KNBobohei Bold", selected: lunFontPreset === "knBobohei" }),
						buildElement("option", { value: "serif", innerText: t("fontPresetSerif") || "Serif (Mincho)", selected: lunFontPreset === "serif" }),
						buildElement("option", { value: "rounded", innerText: t("fontPresetRounded") || "Rounded (Maru)", selected: lunFontPreset === "rounded" }),
						buildElement("option", { value: "pixel", innerText: t("fontPresetPixel") || "Pixel / Retro", selected: lunFontPreset === "pixel" }),
						buildElement("option", { value: "monospace", innerText: t("fontPresetMonospace") || "Monospace", selected: lunFontPreset === "monospace" }),
						buildElement("option", { value: "custom", innerText: t("fontPresetCustom") || "Custom OS Font...", selected: lunFontPreset === "custom" })
					])
				]),
				lunPanelElements.customFontContainer = buildElement("div", {
					className: "spkmod-panel-cat" + (lunFontPreset === "custom" ? "" : " hidden"),
					style: "margin-top: 2px;"
				}, [
					lunPanelElements.customFontInputLabel = buildElement("span", { style: "color: #aaa; font-size: 10px; flex: 1;", innerText: t("customFontInputLabel") || "Font:" }),
					lunPanelElements.customFontInput = buildElement("input", {
						type: "text",
						value: lunCustomFont,
						placeholder: t("customFontPlaceholder") || "Meiryo, Yu Mincho...",
						style: "width: 115px; background: #222; color: #fff; border: 1px solid #444; border-radius: 3px; font-size: 10px; padding: 2px;",
						oninput: e => {
							const v = e.target.value;
							lunCustomFont = v;
							if (window.localStorage) localStorage.setItem("spkmod-custom-font", v);
							if (window.__spkmodCustomFontInputDebounce) clearTimeout(window.__spkmodCustomFontInputDebounce);
							window.__spkmodCustomFontInputDebounce = setTimeout(() => {
								if (typeof applySpkmodFont === "function") {
									applySpkmodFont("custom", v, true);
								}
							}, 250);
						}
					})
				]),
				buildElement("div", { className: "spkmod-panel-cat" }, [
					lunPanelElements.accentColorLabel = buildElement("span", { style: "color: #fff; font-size: 11px; font-weight: bold; flex: 1;", innerText: t("accentColorLabel") }),
					lunPanelElements.accentColorInput = buildElement("input", { type: "color", value: lunAccentColor, style: "width: 40px; height: 20px; padding: 0; border: none; background: none; cursor: pointer;", onchange: e => { lunAccentColor = e.target.value; updateDynamicStyles(); } }),
					lunPanelElements.accentColorConfirmBtn = buildElement("button", { className: "spkmod-panel-btn", style: "padding: 0px 4px; font-size: 10px; margin-left: 4px;", innerText: t("confirmBtn") || "OK", onclick: () => { lunAccentColor = lunPanelElements.accentColorInput.value; updateDynamicStyles(); } })
				]),
				buildElement("div", { className: "spkmod-panel-cat", style: "margin-top: 6px; padding-top: 6px; border-top: 1px solid #333;" }, [
					lunPanelElements.customCssSectionBtn = buildElement("button", {
						id: "spkmod-open-custom-css-btn",
						className: "spkmod-panel-btn",
						style: "width: 100%; padding: 5px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; background: #262626; border: 1px solid #555;",
						innerText: "🎨 " + tCustom("customCssTitle", "Custom CSS & Themes"),
						title: tCustom("customCssBtnTooltip", "Edit custom CSS styles and themes"),
						onclick: e => {
							e.preventDefault();
							if (typeof toggleCustomCssModal === "function") toggleCustomCssModal();
						}
					}),
					lunPanelElements.resourcePackSectionBtn = buildElement("button", {
						id: "spkmod-open-respack-btn",
						className: "spkmod-panel-btn",
						style: "width: 100%; padding: 5px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; background: #262626; border: 1px solid #555; margin-top: 4px;",
						innerText: "⛏️ " + tCustom("resourcePackTitle", "Mining Resource Packs"),
						title: tCustom("resourcePackBtnTooltip", "Customize mining game voxel block textures"),
						onclick: e => {
							e.preventDefault();
							if (typeof toggleResourcePackModal === "function") toggleResourcePackModal();
						}
					})
				])
			])
		]),

		buildElement("div", { className: "spkmod-panel-cat", style: "gap: 4px; margin-top: 4px;" }, [
			lunPanelElements.exportSettingsBtn = buildElement("button", { className: "spkmod-panel-btn", style: "flex: 1;", innerText: t("exportSettingsBtn"), onclick: () => {
				const exportData = {};
				SPKMOD_SETTINGS_KEYS.forEach(k => {
					const value = localStorage.getItem(k);
					if (value !== null) exportData[k] = value;
				});
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
								if (!data || typeof data !== "object" || Array.isArray(data)) {
									throw new Error("Settings must be a JSON object");
								}
								const entries = Object.entries(data).filter(([k]) => SPKMOD_SETTINGS_KEYS.has(k));
								// Validate before writing so malformed files do not partially apply.
								if (entries.some(([, value]) => typeof value !== "string")) {
									throw new Error("Settings values must be strings");
								}
								entries.forEach(([k, value]) => localStorage.setItem(k, value));
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
			lunPanelElements.resetPositionsBtn = buildElement("button", {
				id: "spkmod-reset-positions-btn",
				className: "spkmod-panel-btn",
				style: "flex: 1; width: 100%;",
				innerText: "🔄 " + (t("resetPositionsBtn") || "Reset Window Positions (F3)"),
				onclick: () => {
					if (typeof resetWindowPositions === "function") {
						resetWindowPositions();
					}
				}
			})
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
			style: "contain: inline-size; width: 100%; box-sizing: border-box; color: #aaa; font-size: 10px; margin-top: 4px; white-space: pre-wrap; line-height: 1.4; border-top: 1px solid #555; padding-top: 4px; user-select: none; cursor: pointer;",
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
		}),

		lunPanelElements.settingsResizeHandle = buildElement("div", {
			id: "spkmod-settings-resize-handle",
			title: t("bbsResizeTooltip") || "Drag to resize window",
			style: "position: sticky; bottom: -6px; margin-top: auto; margin-right: -6px; margin-bottom: -6px; align-self: flex-end; width: 18px; height: 18px; cursor: nwse-resize; display: flex; align-items: flex-end; justify-content: flex-end; padding: 2px; user-select: none; z-index: 10; touch-action: none;"
		}, [
			buildElement("span", {
				innerHTML: '<svg viewBox="0 0 10 10" width="10" height="10" style="opacity: 0.65; display: block; pointer-events: none;"><path d="M9 1 L1 9 M9 5 L5 9 M9 9 L9 9" stroke="#e8b84b" stroke-width="1.2" stroke-linecap="round"/></svg>'
			})
		])

	])
);
if (lunPanelElements.settingsResizeHandle) {
	lunPanelElements.settingsResizeHandle.onmouseenter = () => {
		const p = lunPanelElements.settingsResizeHandle.querySelector("path");
		if (p) p.setAttribute("stroke", "#ffd56b");
	};
	lunPanelElements.settingsResizeHandle.onmouseleave = () => {
		const p = lunPanelElements.settingsResizeHandle.querySelector("path");
		if (p) p.setAttribute("stroke", "#e8b84b");
	};
}
setTimeout(() => {
	if (typeof makeDraggable === 'function' && lunHudElements.settingsModal) {
		makeDraggable(lunHudElements.settingsModal, [lunHudElements.settingsModal]);
	}
	if (typeof makeResizable === 'function' && lunHudElements.settingsModal && lunPanelElements.settingsResizeHandle) {
		makeResizable(lunHudElements.settingsModal, lunPanelElements.settingsResizeHandle, {
			minWidth: 440,
			minHeight: 280,
			storageKey: "spkmod-size-spkmod-settings-modal",
			restoreSize: true
		});
	}
}, 500);


/* ==========================================================================
   Custom CSS & Themes Module
   ========================================================================== */

const SPKMOD_CSS_STORAGE_PROFILES = "spkmod-custom-css-profiles";
const SPKMOD_CSS_STORAGE_ACTIVE = "spkmod-custom-css-active-profile";
const SPKMOD_CSS_STORAGE_ENABLED = "spkmod-custom-css-enabled";
const SPKMOD_CSS_STORAGE_LIVE_PREVIEW = "spkmod-custom-css-live-preview";

const SPKMOD_DEFAULT_CSS = `/* Custom SpeakiMod CSS & Themes */
/* Tip: Add !important to guarantee overriding client styles */

/* Example: Customize SpeakiMod Modals */
/*
#spkmod-hud, #spkmod-settings-modal {
  border-color: #e8b84b !important;
}
*/
`;

const SPKMOD_CSS_SNIPPETS = [
	{
		key: "customCssSnippetDarkGlass",
		defaultLabel: "Dark Glass Panels",
		code: `/* Dark Glass Panels */\n.spkmod-panel-cat, #spkmod-settings-modal, #spkmod-bbs-modal, #spkmod-quests-modal {\n  background: rgba(10, 10, 15, 0.75) !important;\n  backdrop-filter: blur(8px) !important;\n  border: 1px solid rgba(255, 255, 255, 0.15) !important;\n}\n`
	},
	{
		key: "customCssSnippetGolden",
		defaultLabel: "Golden Fantasy Theme",
		code: `/* Golden Fantasy Theme */\n.spkmod-panel-btn, .spkmod-panel-combo {\n  border-color: #d4af37 !important;\n  color: #f7e7a9 !important;\n  box-shadow: 0 0 5px rgba(212, 175, 55, 0.4) !important;\n}\n#spkmod-hud, #spkmod-settings-modal {\n  border: 2px solid #d4af37 !important;\n}\n`
	},
	{
		key: "customCssSnippetCyberpunk",
		defaultLabel: "Cyberpunk Neon Cyan",
		code: `/* Cyberpunk Neon Cyan */\n#spkmod-hud, #spkmod-settings-modal, #spkmod-bbs-modal, #spkmod-quests-modal, #spkmod-css-modal {\n  border: 1.5px solid #00f0ff !important;\n  box-shadow: 0 0 12px rgba(0, 240, 255, 0.5) !important;\n}\n.spkmod-panel-btn {\n  border-color: #00f0ff !important;\n  color: #00f0ff !important;\n}\n`
	},
	{
		key: "customCssSnippetCompactHud",
		defaultLabel: "Compact HUD",
		code: `/* Compact HUD */\n#spkmod-hud {\n  padding: 4px 6px !important;\n  gap: 2px !important;\n  opacity: 0.85 !important;\n}\n#spkmod-hud:hover {\n  opacity: 1 !important;\n}\n`
	},
	{
		key: "customCssSnippetCustomFont",
		defaultLabel: "Custom Game Font",
		code: `/* Custom Game Font */\nbody, button, input, select, textarea, #spkmod-main {\n  font-family: 'Segoe UI', system-ui, sans-serif !important;\n}\n`
	}
];

var lunCustomCssStyleElement = null;
var lunCustomCssProfiles = { "Default": SPKMOD_DEFAULT_CSS };
var lunCustomCssActiveProfile = "Default";
var lunCustomCssEnabled = true;
var lunCustomCssLivePreview = true;
var lunCustomCssHasUnsavedChanges = false;
var lunCustomCssLivePreviewTimer = null;

function loadCustomCssData() {
	if (typeof window !== "undefined" && window.localStorage) {
		try {
			const savedProfiles = localStorage.getItem(SPKMOD_CSS_STORAGE_PROFILES);
			if (savedProfiles) {
				const parsed = JSON.parse(savedProfiles);
				if (parsed && typeof parsed === "object" && !Array.isArray(parsed) && Object.keys(parsed).length > 0) {
					lunCustomCssProfiles = parsed;
				}
			}
		} catch (_) {}

		try {
			const savedActive = localStorage.getItem(SPKMOD_CSS_STORAGE_ACTIVE);
			if (savedActive && lunCustomCssProfiles[savedActive] !== undefined) {
				lunCustomCssActiveProfile = savedActive;
			} else {
				lunCustomCssActiveProfile = Object.keys(lunCustomCssProfiles)[0] || "Default";
			}
		} catch (_) {}

		try {
			const savedEnabled = localStorage.getItem(SPKMOD_CSS_STORAGE_ENABLED);
			if (savedEnabled !== null) {
				lunCustomCssEnabled = savedEnabled === "true";
			}
		} catch (_) {}

		try {
			const savedLive = localStorage.getItem(SPKMOD_CSS_STORAGE_LIVE_PREVIEW);
			if (savedLive !== null) {
				lunCustomCssLivePreview = savedLive === "true";
			}
		} catch (_) {}
	}
	if (!lunCustomCssProfiles[lunCustomCssActiveProfile]) {
		lunCustomCssProfiles[lunCustomCssActiveProfile] = SPKMOD_DEFAULT_CSS;
	}
}

function saveCustomCssData() {
	if (typeof window !== "undefined" && window.localStorage) {
		try {
			localStorage.setItem(SPKMOD_CSS_STORAGE_PROFILES, JSON.stringify(lunCustomCssProfiles));
			localStorage.setItem(SPKMOD_CSS_STORAGE_ACTIVE, lunCustomCssActiveProfile);
			localStorage.setItem(SPKMOD_CSS_STORAGE_ENABLED, lunCustomCssEnabled ? "true" : "false");
			localStorage.setItem(SPKMOD_CSS_STORAGE_LIVE_PREVIEW, lunCustomCssLivePreview ? "true" : "false");
		} catch (_) {}
	}
}

function applyCustomCss(cssText) {
	if (!lunCustomCssStyleElement) {
		lunCustomCssStyleElement = document.getElementById("spkmod-custom-css");
		if (!lunCustomCssStyleElement) {
			lunCustomCssStyleElement = document.createElement("style");
			lunCustomCssStyleElement.id = "spkmod-custom-css";
			document.head.appendChild(lunCustomCssStyleElement);
		}
	}
	if (!lunCustomCssEnabled) {
		lunCustomCssStyleElement.textContent = "";
		return;
	}
	const code = typeof cssText === "string" ? cssText : (lunCustomCssProfiles[lunCustomCssActiveProfile] || "");
	lunCustomCssStyleElement.textContent = code;
	// Guarantee maximum cascade priority over game stylesheets and SpeakiMod defaults by re-appending to the end of <head>
	if (lunCustomCssStyleElement.parentNode === document.head) {
		document.head.appendChild(lunCustomCssStyleElement);
	}
}

function updateCustomCssStatus(saved) {
	lunCustomCssHasUnsavedChanges = !saved;
	if (customCssModalElements.statusBadge) {
		if (saved) {
			customCssModalElements.statusBadge.innerText = tCustom("customCssSaved", "✓ Saved");
			customCssModalElements.statusBadge.style.color = "#4ade80";
			customCssModalElements.statusBadge.style.borderColor = "rgba(74, 222, 128, 0.4)";
		} else {
			customCssModalElements.statusBadge.innerText = tCustom("customCssUnsaved", "● Unsaved");
			customCssModalElements.statusBadge.style.color = "#fbbf24";
			customCssModalElements.statusBadge.style.borderColor = "rgba(251, 191, 36, 0.4)";
		}
	}
}

function updateCustomCssProfileDropdown() {
	if (!customCssModalElements.profileSelect) return;
	const sel = customCssModalElements.profileSelect;
	sel.innerHTML = "";
	const names = Object.keys(lunCustomCssProfiles);
	if (names.length === 0) {
		lunCustomCssProfiles["Default"] = SPKMOD_DEFAULT_CSS;
		names.push("Default");
	}
	names.forEach(name => {
		const opt = document.createElement("option");
		opt.value = name;
		opt.innerText = name;
		if (name === lunCustomCssActiveProfile) opt.selected = true;
		sel.appendChild(opt);
	});
}

function loadActiveProfileIntoEditor() {
	if (customCssModalElements.textarea) {
		customCssModalElements.textarea.value = lunCustomCssProfiles[lunCustomCssActiveProfile] || "";
	}
	updateCustomCssStatus(true);
}

function saveAndApplyCustomCss() {
	if (customCssModalElements.textarea) {
		lunCustomCssProfiles[lunCustomCssActiveProfile] = customCssModalElements.textarea.value;
	}
	saveCustomCssData();
	applyCustomCss();
	updateCustomCssStatus(true);
}

function insertCssSnippet(snippetCode) {
	if (!snippetCode || !customCssModalElements.textarea) return;
	const ta = customCssModalElements.textarea;
	const start = ta.selectionStart;
	const end = ta.selectionEnd;
	const val = ta.value;
	const insert = (start > 0 && val[start - 1] !== "\n" ? "\n" : "") + snippetCode + (snippetCode.endsWith("\n") ? "" : "\n");
	ta.value = val.substring(0, start) + insert + val.substring(end);
	ta.selectionStart = ta.selectionEnd = start + insert.length;
	ta.focus();
	updateCustomCssStatus(false);
	if (lunCustomCssLivePreview && lunCustomCssEnabled) {
		clearTimeout(lunCustomCssLivePreviewTimer);
		lunCustomCssLivePreviewTimer = setTimeout(() => {
			applyCustomCss(ta.value);
		}, 150);
	}
}

function renderCustomCssSnippetsDropdown() {
	if (!customCssModalElements.snippetsSelect) return;
	const sel = customCssModalElements.snippetsSelect;
	sel.innerHTML = "";
	const placeholder = document.createElement("option");
	placeholder.value = "";
	placeholder.innerText = "📋 " + tCustom("customCssSnippets", "Snippets");
	sel.appendChild(placeholder);
	SPKMOD_CSS_SNIPPETS.forEach((snip, i) => {
		const opt = document.createElement("option");
		opt.value = String(i);
		opt.innerText = tCustom(snip.key, snip.defaultLabel);
		sel.appendChild(opt);
	});
}

function renderCustomCssExportDropdown() {
	if (!customCssModalElements.exportSelect) return;
	const sel = customCssModalElements.exportSelect;
	sel.innerHTML = "";
	const placeholder = document.createElement("option");
	placeholder.value = "";
	placeholder.innerText = "📤 " + tCustom("customCssExport", "Export");
	sel.appendChild(placeholder);

	const optCss = document.createElement("option");
	optCss.value = "css";
	optCss.innerText = tCustom("customCssExportCss", "Export .css");
	sel.appendChild(optCss);

	const optJson = document.createElement("option");
	optJson.value = "json";
	optJson.innerText = tCustom("customCssExportAll", "Export All (.json)");
	sel.appendChild(optJson);

	const optCopy = document.createElement("option");
	optCopy.value = "copy";
	optCopy.innerText = tCustom("customCssCopyClipboard", "Copy CSS");
	sel.appendChild(optCopy);
}

function downloadTextFile(filename, text, mimeType = "text/plain;charset=utf-8") {
	const blob = new Blob([text], { type: mimeType });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportCurrentProfileCss() {
	const safeName = lunCustomCssActiveProfile.replace(/[^a-zA-Z0-9_\-]/g, "_") || "profile";
	const content = (customCssModalElements.textarea ? customCssModalElements.textarea.value : lunCustomCssProfiles[lunCustomCssActiveProfile]) || "";
	downloadTextFile(`speakimod_theme_${safeName}.css`, content, "text/css;charset=utf-8");
}

function exportAllProfilesJson() {
	if (customCssModalElements.textarea) {
		lunCustomCssProfiles[lunCustomCssActiveProfile] = customCssModalElements.textarea.value;
	}
	const payload = {
		version: 1,
		activeProfile: lunCustomCssActiveProfile,
		exportedAt: new Date().toISOString(),
		profiles: lunCustomCssProfiles
	};
	downloadTextFile("speakimod_themes_backup.json", JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
}

function fallbackCopyText(text) {
	const dummy = document.createElement("textarea");
	dummy.value = text;
	document.body.appendChild(dummy);
	dummy.select();
	try {
		document.execCommand("copy");
		if (typeof chatLog === "function") chatLog(tCustom("customCssCopied", "CSS copied to clipboard!"));
		else alert(tCustom("customCssCopied", "CSS copied to clipboard!"));
	} catch (_) {}
	document.body.removeChild(dummy);
}

function copyCustomCssToClipboard() {
	const text = (customCssModalElements.textarea ? customCssModalElements.textarea.value : lunCustomCssProfiles[lunCustomCssActiveProfile]) || "";
	if (navigator.clipboard && navigator.clipboard.writeText) {
		navigator.clipboard.writeText(text).then(() => {
			if (typeof chatLog === "function") {
				chatLog(tCustom("customCssCopied", "CSS copied to clipboard!"));
			} else {
				alert(tCustom("customCssCopied", "CSS copied to clipboard!"));
			}
		}).catch(() => {
			fallbackCopyText(text);
		});
	} else {
		fallbackCopyText(text);
	}
}

function importCustomCssFile(file) {
	if (!file) return;
	const reader = new FileReader();
	reader.onload = e => {
		try {
			const text = e.target.result;
			if (file.name.endsWith(".json")) {
				const data = JSON.parse(text);
				if (data && typeof data === "object") {
					const incomingProfiles = data.profiles && typeof data.profiles === "object" ? data.profiles : data;
					let count = 0;
					for (const [k, v] of Object.entries(incomingProfiles)) {
						if (typeof v === "string") {
							lunCustomCssProfiles[k] = v;
							count++;
						}
					}
					if (count === 0) throw new Error("No valid profiles found in JSON");
					if (data.activeProfile && lunCustomCssProfiles[data.activeProfile]) {
						lunCustomCssActiveProfile = data.activeProfile;
					}
					saveCustomCssData();
					updateCustomCssProfileDropdown();
					loadActiveProfileIntoEditor();
					applyCustomCss();
					alert(tCustom("customCssImportSuccess", `Imported ${count} profile(s) successfully!`, count));
				}
			} else {
				let profileName = file.name.replace(/\.css$/i, "").trim();
				if (!profileName) profileName = "Imported";
				if (lunCustomCssProfiles[profileName] !== undefined && lunCustomCssProfiles[profileName] !== text) {
					profileName = `${profileName} (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
				}
				lunCustomCssProfiles[profileName] = text;
				lunCustomCssActiveProfile = profileName;
				saveCustomCssData();
				updateCustomCssProfileDropdown();
				loadActiveProfileIntoEditor();
				applyCustomCss();
				alert(tCustom("customCssImportSuccess", `Imported 1 profile(s) successfully!`, 1));
			}
		} catch (err) {
			alert("Failed to import file: " + (err && err.message ? err.message : "Invalid format"));
		}
	};
	reader.readAsText(file);
}

function createNewCssProfile() {
	const promptText = tCustom("customCssPromptNew", "Enter new profile name:");
	const name = prompt(promptText);
	if (!name || !name.trim()) return;
	const trimmed = name.trim();
	if (lunCustomCssProfiles[trimmed] !== undefined) {
		alert(tCustom("customCssProfileExists", "A profile with this name already exists."));
		return;
	}
	lunCustomCssProfiles[trimmed] = (customCssModalElements.textarea ? customCssModalElements.textarea.value : lunCustomCssProfiles[lunCustomCssActiveProfile]) || SPKMOD_DEFAULT_CSS;
	lunCustomCssActiveProfile = trimmed;
	saveCustomCssData();
	updateCustomCssProfileDropdown();
	loadActiveProfileIntoEditor();
}

function renameCurrentCssProfile() {
	const promptTpl = tCustom("customCssPromptRename", "Enter new name for profile '{0}':", lunCustomCssActiveProfile);
	const promptText = promptTpl.includes("{0}") ? promptTpl.replace("{0}", lunCustomCssActiveProfile) : promptTpl;
	const newName = prompt(promptText, lunCustomCssActiveProfile);
	if (!newName || !newName.trim() || newName.trim() === lunCustomCssActiveProfile) return;
	const trimmed = newName.trim();
	if (lunCustomCssProfiles[trimmed] !== undefined) {
		alert(tCustom("customCssProfileExists", "A profile with this name already exists."));
		return;
	}
	const currentContent = (customCssModalElements.textarea ? customCssModalElements.textarea.value : lunCustomCssProfiles[lunCustomCssActiveProfile]) || "";
	lunCustomCssProfiles[trimmed] = currentContent;
	delete lunCustomCssProfiles[lunCustomCssActiveProfile];
	lunCustomCssActiveProfile = trimmed;
	saveCustomCssData();
	updateCustomCssProfileDropdown();
}

function deleteCurrentCssProfile() {
	const keys = Object.keys(lunCustomCssProfiles);
	if (keys.length <= 1) {
		alert(tCustom("customCssCannotDeleteOnly", "Cannot delete the only profile."));
		return;
	}
	const confirmTpl = tCustom("customCssConfirmDelete", "Are you sure you want to delete profile '{0}'?", lunCustomCssActiveProfile);
	const confirmText = confirmTpl.includes("{0}") ? confirmTpl.replace("{0}", lunCustomCssActiveProfile) : confirmTpl;
	if (!confirm(confirmText)) return;
	delete lunCustomCssProfiles[lunCustomCssActiveProfile];
	lunCustomCssActiveProfile = Object.keys(lunCustomCssProfiles)[0] || "Default";
	saveCustomCssData();
	updateCustomCssProfileDropdown();
	loadActiveProfileIntoEditor();
	applyCustomCss();
}

function resetCurrentCssProfile() {
	if (!confirm(tCustom("customCssConfirmReset", "Reset current profile CSS to default template?"))) return;
	if (customCssModalElements.textarea) {
		customCssModalElements.textarea.value = SPKMOD_DEFAULT_CSS;
	}
	lunCustomCssProfiles[lunCustomCssActiveProfile] = SPKMOD_DEFAULT_CSS;
	saveCustomCssData();
	applyCustomCss();
	updateCustomCssStatus(true);
}

function buildCustomCssModal() {
	if (lunHudElements.customCssModal) return lunHudElements.customCssModal;

	const hiddenFileInput = buildElement("input", {
		type: "file",
		accept: ".css,.json",
		style: "display: none;",
		onchange: e => {
			const file = e.target.files && e.target.files[0];
			if (file) {
				importCustomCssFile(file);
			}
			hiddenFileInput.value = "";
		}
	});

	const modal = buildElement("div", {
		id: "spkmod-css-modal",
		className: "hidden"
	}, [
		hiddenFileInput,
		// Header row
		customCssModalElements.headerRow = buildElement("div", {
			className: "spkmod-panel-cat",
			style: "justify-content: space-between; align-items: center; border-bottom: 1px solid #444; padding-bottom: 6px; cursor: move; user-select: none;"
		}, [
			buildElement("div", { style: "display: flex; align-items: center; gap: 8px;" }, [
				customCssModalElements.headerTitle = buildElement("span", {
					style: "font-weight: bold; font-size: 13px; color: #FFF; display: flex; align-items: center; gap: 4px;",
					innerText: "🎨 " + tCustom("customCssTitle", "Custom CSS & Themes")
				}),
				customCssModalElements.statusBadge = buildElement("span", {
					style: "border: 1px solid rgba(74, 222, 128, 0.4); border-radius: 4px; padding: 1px 6px; font-size: 10px; color: #4ade80; user-select: none;",
					innerText: tCustom("customCssSaved", "✓ Saved")
				})
			]),
			buildElement("div", { style: "display: flex; align-items: center; gap: 10px;" }, [
				buildElement("label", {
					style: "display: flex; align-items: center; gap: 4px; font-size: 11px; color: #ddd; cursor: pointer; user-select: none;",
					title: "Enable or disable custom CSS injection"
				}, [
					customCssModalElements.enableToggle = buildElement("input", {
						type: "checkbox",
						checked: lunCustomCssEnabled,
						onchange: e => {
							lunCustomCssEnabled = e.target.checked;
							saveCustomCssData();
							applyCustomCss();
						}
					}),
					customCssModalElements.enableLabel = buildElement("span", { innerText: tCustom("customCssEnable", "Active") })
				]),
				buildElement("span", {
					style: "cursor: pointer; font-size: 14px; color: #aaa; padding: 0 4px; line-height: 1;",
					innerText: "✕",
					title: "Close (Esc)",
					onclick: () => toggleCustomCssModal(false)
				})
			])
		]),

		// Profile Toolbar
		buildElement("div", {
			className: "spkmod-panel-cat",
			style: "gap: 6px; align-items: center;"
		}, [
			customCssModalElements.profileLabel = buildElement("span", {
				style: "font-size: 11px; color: #aaa; user-select: none;",
				innerText: tCustom("customCssProfile", "Profile:")
			}),
			customCssModalElements.profileSelect = buildElement("select", {
				className: "spkmod-panel-combo",
				style: "flex: 1; padding: 3px 6px; font-size: 11px; cursor: pointer;",
				onchange: e => {
					if (lunCustomCssHasUnsavedChanges) {
						if (!confirm(tCustom("customCssConfirmSwitch", "You have unsaved changes. Switch profile anyway?"))) {
							e.target.value = lunCustomCssActiveProfile;
							return;
						}
					}
					lunCustomCssActiveProfile = e.target.value;
					saveCustomCssData();
					loadActiveProfileIntoEditor();
					applyCustomCss();
				}
			}),
			customCssModalElements.newBtn = buildElement("button", {
				className: "spkmod-panel-btn",
				style: "flex: 0 0 auto; padding: 3px 8px; font-size: 11px;",
				innerText: tCustom("customCssNewProfile", "+ New"),
				onclick: () => createNewCssProfile()
			}),
			customCssModalElements.renameBtn = buildElement("button", {
				className: "spkmod-panel-btn",
				style: "flex: 0 0 auto; padding: 3px 8px; font-size: 11px;",
				innerText: tCustom("customCssRenameProfile", "Rename"),
				onclick: () => renameCurrentCssProfile()
			}),
			customCssModalElements.deleteBtn = buildElement("button", {
				className: "spkmod-panel-btn",
				style: "flex: 0 0 auto; padding: 3px 8px; font-size: 11px; color: #f87171;",
				innerText: tCustom("customCssDeleteProfile", "Delete"),
				onclick: () => deleteCurrentCssProfile()
			})
		]),

		// Actions & Snippets Toolbar
		buildElement("div", {
			className: "spkmod-panel-cat",
			style: "gap: 6px; align-items: center; flex-wrap: wrap;"
		}, [
			customCssModalElements.saveBtn = buildElement("button", {
				className: "spkmod-panel-btn",
				style: "flex: 0 0 auto; padding: 3px 10px; font-size: 11px; font-weight: bold; background: #1a472a; border-color: #4ade80; color: #4ade80;",
				innerText: "💾 " + tCustom("customCssSaveApply", "Apply & Save"),
				title: "Save and apply styles (Ctrl+S)",
				onclick: () => saveAndApplyCustomCss()
			}),
			buildElement("label", {
				style: "display: flex; align-items: center; gap: 4px; font-size: 11px; color: #bbb; cursor: pointer; user-select: none;",
				title: "Automatically apply CSS as you type"
			}, [
				customCssModalElements.livePreviewToggle = buildElement("input", {
					type: "checkbox",
					checked: lunCustomCssLivePreview,
					onchange: e => {
						lunCustomCssLivePreview = e.target.checked;
						saveCustomCssData();
						if (lunCustomCssLivePreview && lunCustomCssEnabled && customCssModalElements.textarea) {
							applyCustomCss(customCssModalElements.textarea.value);
						}
					}
				}),
				customCssModalElements.livePreviewLabel = buildElement("span", { innerText: tCustom("customCssLivePreview", "Live Preview") })
			]),
			customCssModalElements.snippetsSelect = buildElement("select", {
				className: "spkmod-panel-combo",
				style: "flex: 1; min-width: 130px; padding: 3px 6px; font-size: 11px; cursor: pointer;",
				onchange: e => {
					const idx = parseInt(e.target.value, 10);
					if (!isNaN(idx) && SPKMOD_CSS_SNIPPETS[idx]) {
						insertCssSnippet(SPKMOD_CSS_SNIPPETS[idx].code);
					}
					e.target.selectedIndex = 0;
				}
			}),
			customCssModalElements.exportSelect = buildElement("select", {
				className: "spkmod-panel-combo",
				style: "flex: 0 0 auto; padding: 3px 6px; font-size: 11px; cursor: pointer;",
				onchange: e => {
					const val = e.target.value;
					if (val === "css") exportCurrentProfileCss();
					else if (val === "json") exportAllProfilesJson();
					else if (val === "copy") copyCustomCssToClipboard();
					e.target.selectedIndex = 0;
				}
			}),
			customCssModalElements.importBtn = buildElement("button", {
				className: "spkmod-panel-btn",
				style: "flex: 0 0 auto; padding: 3px 8px; font-size: 11px;",
				innerText: "📥 " + tCustom("customCssImport", "Import"),
				title: "Import .css or .json themes",
				onclick: () => hiddenFileInput.click()
			}),
			customCssModalElements.resetBtn = buildElement("button", {
				className: "spkmod-panel-btn",
				style: "flex: 0 0 auto; padding: 3px 8px; font-size: 11px;",
				innerText: tCustom("customCssReset", "Reset"),
				title: "Reset current profile to default template",
				onclick: () => resetCurrentCssProfile()
			})
		]),

		// Textarea editor
		customCssModalElements.textarea = buildElement("textarea", {
			id: "spkmod-css-textarea",
			spellcheck: false,
			autocomplete: "off",
			autocapitalize: "off",
			placeholder: "/* Enter your custom CSS here... */",
			onkeydown: e => {
				if (e.key === "Tab") {
					e.preventDefault();
					const ta = e.target;
					const start = ta.selectionStart;
					const end = ta.selectionEnd;
					ta.setRangeText("  ", start, end, "end");
					updateCustomCssStatus(false);
					if (lunCustomCssLivePreview && lunCustomCssEnabled) {
						clearTimeout(lunCustomCssLivePreviewTimer);
						lunCustomCssLivePreviewTimer = setTimeout(() => {
							applyCustomCss(ta.value);
						}, 150);
					}
				} else if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
					e.preventDefault();
					saveAndApplyCustomCss();
				}
			},
			oninput: e => {
				updateCustomCssStatus(false);
				if (lunCustomCssLivePreview && lunCustomCssEnabled) {
					clearTimeout(lunCustomCssLivePreviewTimer);
					lunCustomCssLivePreviewTimer = setTimeout(() => {
						applyCustomCss(e.target.value);
					}, 150);
				}
			}
		}),

		// Footer Row
		buildElement("div", {
			className: "spkmod-panel-cat",
			style: "justify-content: space-between; align-items: center; margin-top: 2px; position: relative;"
		}, [
			customCssModalElements.tipLabel = buildElement("span", {
				style: "font-size: 10px; color: #888; user-select: none; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;",
				innerText: tCustom("customCssTip", "Tip: Use !important to override game styles. Ctrl+S to save.")
			}),
			customCssModalElements.resizeHandle = buildElement("div", {
				style: "position: absolute; right: -6px; bottom: -6px; width: 18px; height: 18px; cursor: nwse-resize; display: flex; align-items: flex-end; justify-content: flex-end; padding: 2px; user-select: none; z-index: 10;",
				title: "Resize"
			}, [
				buildElement("span", {
					innerHTML: '<svg viewBox="0 0 10 10" width="10" height="10" style="opacity: 0.65; display: block; pointer-events: none;"><path d="M9 1 L1 9 M9 5 L5 9 M9 9 L9 9" stroke="#e8b84b" stroke-width="1.2" stroke-linecap="round"/></svg>'
				})
			])
		])
	]);

	lunHudElements.customCssModal = modal;
	document.body.appendChild(modal);

	modal.addEventListener("wheel", e => { e.stopPropagation(); }, { passive: true });
	modal.addEventListener("touchmove", e => { e.stopPropagation(); }, { passive: true });
	modal.addEventListener("mouseenter", () => {
		if (document.pointerLockElement) {
			try { document.exitPointerLock(); } catch (_) {}
		}
	});
	modal.addEventListener("mousedown", e => {
		e.stopPropagation();
		if (document.pointerLockElement) {
			try { document.exitPointerLock(); } catch (_) {}
		}
	}, true);

	updateCustomCssProfileDropdown();
	loadActiveProfileIntoEditor();
	renderCustomCssSnippetsDropdown();
	renderCustomCssExportDropdown();

	setTimeout(() => {
		if (typeof makeDraggable === "function" && lunHudElements.customCssModal && customCssModalElements.headerRow) {
			makeDraggable(lunHudElements.customCssModal, [customCssModalElements.headerRow]);
		}
		if (typeof makeResizable === "function" && lunHudElements.customCssModal && customCssModalElements.resizeHandle) {
			makeResizable(lunHudElements.customCssModal, customCssModalElements.resizeHandle, {
				minWidth: 420,
				minHeight: 320,
				storageKey: "spkmod-size-spkmod-css-modal"
			});
		}
		if (lunHudElements.customCssModal && !(window.localStorage && localStorage.getItem("spkmod-size-spkmod-css-modal"))) {
			lunHudElements.customCssModal.style.width = "580px";
			lunHudElements.customCssModal.style.height = "500px";
		}
		if (lunHudElements.customCssModal && !(window.localStorage && (localStorage.getItem("spkmod-pos-x-spkmod-css-modal") || localStorage.getItem("spkmod-pos-spkmod-css-modal")))) {
			if (typeof positionModalNicely === "function") {
				positionModalNicely(lunHudElements.customCssModal);
			}
		}
	}, 500);

	return modal;
}

function toggleCustomCssModal(explicitState) {
	if (!lunHudElements.customCssModal) {
		buildCustomCssModal();
	}
	const isHidden = lunHudElements.customCssModal.classList.contains("hidden");
	const shouldShow = explicitState !== undefined ? explicitState : isHidden;
	if (shouldShow) {
		updateCustomCssI18n();
		updateCustomCssProfileDropdown();
		loadActiveProfileIntoEditor();
		if (customCssModalElements.enableToggle) {
			customCssModalElements.enableToggle.checked = lunCustomCssEnabled;
		}
		if (customCssModalElements.livePreviewToggle) {
			customCssModalElements.livePreviewToggle.checked = lunCustomCssLivePreview;
		}
		if (typeof positionModalNicely === "function") {
			positionModalNicely(lunHudElements.customCssModal);
		}
		lunHudElements.customCssModal.classList.remove("hidden");
		if (customCssModalElements.textarea) {
			setTimeout(() => customCssModalElements.textarea.focus(), 50);
		}
	} else {
		lunHudElements.customCssModal.classList.add("hidden");
	}
}

function updateCustomCssI18n() {
	if (lunPanelElements.customCssSettingsBtn) {
		lunPanelElements.customCssSettingsBtn.innerText = "🎨 " + tCustom("customCssBtn", "Custom CSS");
		lunPanelElements.customCssSettingsBtn.title = tCustom("customCssBtnTooltip", "Edit custom CSS styles and themes");
	}
	if (lunPanelElements.customCssSectionBtn) {
		lunPanelElements.customCssSectionBtn.innerText = "🎨 " + tCustom("customCssTitle", "Custom CSS & Themes");
		lunPanelElements.customCssSectionBtn.title = tCustom("customCssBtnTooltip", "Edit custom CSS styles and themes");
	}
	if (customCssModalElements.headerTitle) {
		customCssModalElements.headerTitle.innerText = "🎨 " + tCustom("customCssTitle", "Custom CSS & Themes");
	}
	if (customCssModalElements.statusBadge) {
		updateCustomCssStatus(!lunCustomCssHasUnsavedChanges);
	}
	if (customCssModalElements.enableLabel) {
		customCssModalElements.enableLabel.innerText = tCustom("customCssEnable", "Active");
	}
	if (customCssModalElements.profileLabel) {
		customCssModalElements.profileLabel.innerText = tCustom("customCssProfile", "Profile:");
	}
	if (customCssModalElements.newBtn) {
		customCssModalElements.newBtn.innerText = tCustom("customCssNewProfile", "+ New");
	}
	if (customCssModalElements.renameBtn) {
		customCssModalElements.renameBtn.innerText = tCustom("customCssRenameProfile", "Rename");
	}
	if (customCssModalElements.deleteBtn) {
		customCssModalElements.deleteBtn.innerText = tCustom("customCssDeleteProfile", "Delete");
	}
	if (customCssModalElements.saveBtn) {
		customCssModalElements.saveBtn.innerText = "💾 " + tCustom("customCssSaveApply", "Apply & Save");
	}
	if (customCssModalElements.livePreviewLabel) {
		customCssModalElements.livePreviewLabel.innerText = tCustom("customCssLivePreview", "Live Preview");
	}
	renderCustomCssSnippetsDropdown();
	renderCustomCssExportDropdown();
	if (customCssModalElements.importBtn) {
		customCssModalElements.importBtn.innerText = "📥 " + tCustom("customCssImport", "Import");
	}
	if (customCssModalElements.resetBtn) {
		customCssModalElements.resetBtn.innerText = tCustom("customCssReset", "Reset");
	}
	if (customCssModalElements.tipLabel) {
		customCssModalElements.tipLabel.innerText = tCustom("customCssTip", "Tip: Use !important to override game styles. Ctrl+S to save.");
	}
}

if (typeof spkmodI18nRenderers !== "undefined") {
	spkmodI18nRenderers.push(updateCustomCssI18n);
}

loadCustomCssData();
buildCustomCssModal();
applyCustomCss();


// ============================================================================
// MINING GAME RESOURCE PACK & ASSET REPLACER SYSTEM
// ============================================================================

const SPKMOD_DEFAULT_MINING_ATLAS_B64 = "data:image/png;base64,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";

const SPKMOD_MINING_BLOCKS = [
	{ id: 0, key: "resBlockStone", name: "Stone", cat: "terrain" },
	{ id: 1, key: "resBlockDirt", name: "Dirt", cat: "terrain" },
	{ id: 2, key: "resBlockGrassTop", name: "Grass (Top)", cat: "terrain" },
	{ id: 3, key: "resBlockGrassSide", name: "Grass (Side)", cat: "terrain" },
	{ id: 4, key: "resBlockBedrock", name: "Bedrock", cat: "terrain" },
	{ id: 5, key: "resBlockTorch", name: "Torch", cat: "props" },
	{ id: 7, key: "resBlockRail", name: "Rail", cat: "rail_tech" },
	{ id: 8, key: "resBlockRailBed", name: "Rail Bed", cat: "rail_tech" },
	{ id: 9, key: "resBlockStation", name: "Station", cat: "rail_tech" },
	{ id: 10, key: "resBlockCoal", name: "Coal Ore", cat: "ores" },
	{ id: 11, key: "resBlockCopper", name: "Copper Ore", cat: "ores" },
	{ id: 12, key: "resBlockIron", name: "Iron Ore", cat: "ores" },
	{ id: 13, key: "resBlockBronze", name: "Bronze Ore", cat: "ores" },
	{ id: 14, key: "resBlockSilver", name: "Silver Ore", cat: "ores" },
	{ id: 15, key: "resBlockGold", name: "Gold Ore", cat: "ores" },
	{ id: 16, key: "resBlockPlatinum", name: "Platinum Ore", cat: "ores" },
	{ id: 17, key: "resBlockMithril", name: "Mithril Ore", cat: "ores" },
	{ id: 18, key: "resBlockRailNS", name: "Rail Straight (NS)", cat: "rail_tech" },
	{ id: 19, key: "resBlockRailEW", name: "Rail Straight (EW)", cat: "rail_tech" },
	{ id: 20, key: "resBlockRailNE", name: "Rail Curve (NE)", cat: "rail_tech" },
	{ id: 21, key: "resBlockRailNW", name: "Rail Curve (NW)", cat: "rail_tech" },
	{ id: 22, key: "resBlockRailSE", name: "Rail Curve (SE)", cat: "rail_tech" },
	{ id: 23, key: "resBlockRailSW", name: "Rail Curve (SW)", cat: "rail_tech" },
	{ id: 24, key: "resBlockLeverStraight", name: "Lever (Straight)", cat: "rail_tech" },
	{ id: 25, key: "resBlockLeverBranch", name: "Lever (Branch)", cat: "rail_tech" },
	{ id: 26, key: "resBlockPlanks", name: "Wood Planks", cat: "building" },
	{ id: 27, key: "resBlockGlass", name: "Glass", cat: "building" },
	{ id: 28, key: "resBlockDoorLower", name: "Door (Lower)", cat: "building" },
	{ id: 29, key: "resBlockDoorUpper", name: "Door (Upper)", cat: "building" },
	{ id: 30, key: "resBlockDoorOpenLower", name: "Door Open (Lower)", cat: "building" },
	{ id: 32, key: "resBlockFossil", name: "Fossil Ore", cat: "ores" },
	{ id: 33, key: "resBlockSulfur", name: "Sulfur Ore", cat: "ores" },
	{ id: 34, key: "resBlockAmethyst", name: "Amethyst Ore", cat: "ores" },
	{ id: 35, key: "resBlockDiamond", name: "Diamond Ore", cat: "ores" },
	{ id: 36, key: "resBlockLogSide", name: "Oak Log (Side)", cat: "terrain" },
	{ id: 37, key: "resBlockLogTop", name: "Oak Log (Top)", cat: "terrain" },
	{ id: 38, key: "resBlockLeaves", name: "Leaves", cat: "terrain" },
	{ id: 39, key: "resBlockStoneBrick", name: "Stone Brick", cat: "building" },
	{ id: 40, key: "resBlockBrick", name: "Brick", cat: "building" },
	{ id: 41, key: "resBlockPlaster", name: "Plaster", cat: "building" },
	{ id: 42, key: "resBlockGlassTint", name: "Tinted Glass", cat: "building" },
	{ id: 43, key: "resBlockLattice", name: "Lattice", cat: "building" },
	{ id: 44, key: "resBlockIronBars", name: "Iron Bars", cat: "building" },
	{ id: 45, key: "resBlockIronBlock", name: "Iron Block", cat: "building" },
	{ id: 46, key: "resBlockGoldBlock", name: "Gold Block", cat: "building" },
	{ id: 47, key: "resBlockBookshelf", name: "Bookshelf", cat: "building" },
	{ id: 48, key: "resBlockChestSide", name: "Chest (Side)", cat: "building" },
	{ id: 49, key: "resBlockChestTop", name: "Chest (Top)", cat: "building" },
	{ id: 50, key: "resBlockDoorOpenUpper", name: "Door Open (Upper)", cat: "building" }
];

let lunResourcePackEnabled = true;
let lunMiningCustomTextures = {};
let lunMiningLoadedPresets = [];
let lunMiningSelectedPreset = "custom";
let lunMiningHasUnsavedChanges = false;
let lunMiningBaseAtlasImg = null;

function spkmodGetBaseMiningAtlasImage() {
	if (lunMiningBaseAtlasImg && lunMiningBaseAtlasImg.complete && lunMiningBaseAtlasImg.naturalWidth > 0) {
		return lunMiningBaseAtlasImg;
	}
	lunMiningBaseAtlasImg = new Image();
	lunMiningBaseAtlasImg.src = SPKMOD_DEFAULT_MINING_ATLAS_B64;
	return lunMiningBaseAtlasImg;
}

function loadResourcePackData() {
	if (window.localStorage) {
		try {
			const en = localStorage.getItem("spkmod-resource-pack-enabled");
			if (en !== null) lunResourcePackEnabled = en === "true";
			const raw = localStorage.getItem("spkmod-mining-resource-pack");
			if (raw) {
				const parsed = JSON.parse(raw);
				if (parsed && typeof parsed === "object") {
					lunMiningCustomTextures = parsed;
				}
			}
		} catch (e) {
			console.warn("[SpeakiMod+] Failed to load resource pack data:", e);
		}
	}
}

function saveResourcePackData() {
	if (window.localStorage) {
		try {
			localStorage.setItem("spkmod-resource-pack-enabled", lunResourcePackEnabled ? "true" : "false");
			localStorage.setItem("spkmod-mining-resource-pack", JSON.stringify(lunMiningCustomTextures));
			lunMiningHasUnsavedChanges = false;
			updateResourcePackStatus(true);
		} catch (e) {
			console.warn("[SpeakiMod+] Failed to save resource pack data:", e);
		}
	}
}

function updateResourcePackStatus(saved) {
	lunMiningHasUnsavedChanges = !saved;
	if (resourcePackModalElements.statusBadge) {
		if (saved) {
			resourcePackModalElements.statusBadge.innerText = "● " + (tCustom("customCssSaved", "Saved"));
			resourcePackModalElements.statusBadge.style.color = "#4ade80";
			resourcePackModalElements.statusBadge.style.borderColor = "#22c55e";
		} else {
			resourcePackModalElements.statusBadge.innerText = "● " + (tCustom("customCssUnsaved", "Unsaved"));
			resourcePackModalElements.statusBadge.style.color = "#fbbf24";
			resourcePackModalElements.statusBadge.style.borderColor = "#f59e0b";
		}
	}
}

async function spkmodValidateAndRead16x16Png(file) {
	if (!file) throw new Error("No file selected.");
	const buf = await file.arrayBuffer();
	const bytes = new Uint8Array(buf);

	// 1. Check PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
	if (bytes.length < 29 || bytes[0] !== 0x89 || bytes[1] !== 0x50 || bytes[2] !== 0x4E || bytes[3] !== 0x47 || bytes[4] !== 0x0D || bytes[5] !== 0x0A || bytes[6] !== 0x1A || bytes[7] !== 0x0A) {
		throw new Error(tCustom("resPackErrNotPng", "Error: File is not a valid PNG image!"));
	}

	// 2. Read IHDR (offset 16: width, offset 20: height, offset 24: bitDepth, offset 25: colorType)
	const view = new DataView(buf);
	const width = view.getUint32(16);
	const height = view.getUint32(20);
	const bitDepth = bytes[24];
	const colorType = bytes[25];

	if (width !== 16 || height !== 16) {
		throw new Error(tCustom("resPackErrDim", `Error: Image must be exactly 16x16 pixels (got ${width}x${height})!`, width, height));
	}

	// 3. Strict 32bpp check: bitDepth 8, colorType 6 (RGBA)
	if (bitDepth !== 8 || colorType !== 6) {
		throw new Error(tCustom("resPackErrBpp", "Error: Image must be 32bpp (RGBA PNG)!"));
	}

	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result);
		reader.onerror = () => reject(new Error("Failed to read file as data URL."));
		reader.readAsDataURL(file);
	});
}

function spkmodExportBlockPng(tileId, blockName) {
	const canvas = document.createElement("canvas");
	canvas.width = 16;
	canvas.height = 16;
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	const custom = lunMiningCustomTextures[tileId];
	if (custom) {
		const img = new Image();
		img.onload = () => {
			ctx.clearRect(0, 0, 16, 16);
			ctx.drawImage(img, 0, 0);
			const a = document.createElement("a");
			a.href = canvas.toDataURL("image/png");
			a.download = `mining_tile_${tileId}_${blockName || "block"}.png`;
			a.click();
		};
		img.src = custom;
	} else {
		const baseImg = spkmodGetBaseMiningAtlasImage();
		const renderBase = () => {
			const col = tileId % 8;
			const row = Math.floor(tileId / 8);
			ctx.clearRect(0, 0, 16, 16);
			ctx.drawImage(baseImg, col * 16, row * 16, 16, 16, 0, 0, 16, 16);
			const a = document.createElement("a");
			a.href = canvas.toDataURL("image/png");
			a.download = `mining_tile_${tileId}_${blockName || "block"}.png`;
			a.click();
		};
		if (baseImg.complete && baseImg.naturalWidth > 0) {
			renderBase();
		} else {
			baseImg.onload = renderBase;
		}
	}
}

function spkmodExportFullPackXml() {
	if (Object.keys(lunMiningCustomTextures).length === 0) {
		alert(tCustom("resPackExportEmpty", "No custom textures to export!"));
		return;
	}

	const defaultAuthor = (
		(typeof gameState !== "undefined" && (gameState?.myPlayerName || gameState?.myStat?.name)) ||
		(typeof window !== "undefined" && window.gameState && (window.gameState.myPlayerName || window.gameState.myStat?.name)) ||
		(typeof document !== "undefined" && (document.querySelector(".sr-player-card__name")?.innerText || document.querySelector(".sr-hud-player-name")?.innerText)) ||
		localStorage.getItem("spkmod-last-player-name") ||
		localStorage.getItem("spkmod-last-nickname") ||
		localStorage.getItem("spkmod-last-username") ||
		"Player"
	).trim();

	const selOption = resourcePackModalElements.presetSelect?.selectedOptions?.[0];
	let curPackName = "";
	if (selOption && selOption.value && selOption.value !== "custom") {
		curPackName = selOption.dataset?.packName || selOption.textContent.replace(/^📂\s*/, '').replace(/\s*\([^)]*\)$/, '').trim();
	}
	if (!curPackName) {
		curPackName = defaultAuthor && defaultAuthor !== "Player" ? `${defaultAuthor} Pack` : "Custom Pack";
	}

	let preferredAuthor = defaultAuthor;
	if (selOption && selOption.dataset?.author && selOption.value !== "custom" && (!preferredAuthor || preferredAuthor === "Player")) {
		preferredAuthor = selOption.dataset.author;
	}

	const promptNameText = tCustom("resPackPromptName", "Enter resource pack name:");
	const packNameInput = prompt(promptNameText, curPackName);
	if (packNameInput === null) return;
	const packName = packNameInput.trim() || curPackName || "Custom Pack";

	const promptAuthorText = tCustom("resPackPromptAuthor", "Enter author name:");
	const authorInput = prompt(promptAuthorText, preferredAuthor);
	if (authorInput === null) return;
	const authorName = authorInput.trim() || preferredAuthor || "Player";

	const packId = packName.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || "custom-pack";
	const fileSafeName = packName.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
	const fileName = `speaki_mining_resourcepack_${fileSafeName}.xml`;

	let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<resourcepacks version="1.0">\n';
	xml += `    <pack id="${packId}" name="${packName}">\n`;
	xml += `        <description>Custom mining textures by ${authorName}</description>\n`;
	xml += `        <author>${authorName}</author>\n`;
	xml += '        <textures>\n';
	Object.keys(lunMiningCustomTextures).forEach(idStr => {
		const id = parseInt(idStr, 10);
		const block = SPKMOD_MINING_BLOCKS.find(b => b.id === id);
		const name = block ? block.name.replace(/\s+/g, '_').toUpperCase() : `TILE_${id}`;
		xml += `            <tile id="${id}" name="${name}">${lunMiningCustomTextures[id]}</tile>\n`;
	});
	xml += '        </textures>\n    </pack>\n</resourcepacks>\n';

	const blob = new Blob([xml], { type: "application/xml;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = fileName;
	a.click();
	setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function spkmodParseResourcePacksXml(xmlText) {
	const parser = new DOMParser();
	const doc = parser.parseFromString(xmlText, "text/xml");
	const packs = [];
	const packNodes = doc.querySelectorAll("pack");
	packNodes.forEach(pn => {
		const id = pn.getAttribute("id") || "";
		const name = pn.getAttribute("name") || id;
		const desc = pn.querySelector("description")?.textContent?.trim() || "";
		const author = pn.querySelector("author")?.textContent?.trim() || "";
		const textures = {};
		pn.querySelectorAll("tile").forEach(tn => {
			const tid = parseInt(tn.getAttribute("id"), 10);
			const data = tn.textContent?.trim() || "";
			if (!isNaN(tid) && data.startsWith("data:image/png;base64,")) {
				textures[tid] = data;
			}
		});
		packs.push({ id, name, desc, author, textures });
	});
	return packs;
}

function spkmodGetFallbackResourcePacks() {
	return [
		{ id: "default", name: tCustom("resPackPresetVanilla", "Default Vanilla"), desc: "Default textures", textures: {} },
		{
			id: "classic-8bit",
			name: tCustom("resPackPresetRetro", "Classic Retro 8-Bit"),
			desc: "Vibrant high-contrast 8-bit arcade style",
			textures: {}
		},
		{
			id: "neon-cyberpunk",
			name: tCustom("resPackPresetCyberpunk", "Neon Cyberpunk"),
			desc: "Futuristic neon aesthetic",
			textures: {}
		},
		{
			id: "pastel-fantasy",
			name: tCustom("resPackPresetPastel", "Pastel Fantasy"),
			desc: "Soft pastel fantasy colors",
			textures: {}
		},
		{
			id: "obagi",
			name: "OBAGI",
			author: "OBAGI",
			desc: "Custom mining textures by OBAGI",
			textures: {}
		}
	];
}

async function spkmodFetchResourcePacksXml() {
	const url = "https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/main/assets/resourcespacks.xml?t=" + Date.now();
	try {
		const res = await fetch(url, { cache: "no-store" });
		if (res.ok) {
			const xmlText = await res.text();
			const packs = spkmodParseResourcePacksXml(xmlText);
			if (packs && packs.length > 0) return packs;
		}
	} catch (e) {
		console.warn("[SpeakiMod+] Failed to load remote resourcespacks.xml:", e);
	}
	return spkmodGetFallbackResourcePacks();
}

function spkmodApplyMiningResourcePack() {
	if (!lunResourcePackEnabled) {
		spkmodRestoreDefaultMiningAtlas();
		return;
	}
	try {
		const world = (typeof gameState !== "undefined" && gameState?.miningHost?.world) ? gameState.miningHost.world : null;
		if (world && world.atlas && world.atlas.texture && world.atlas.texture.image) {
			const canvas = world.atlas.texture.image;
			const ctx = canvas.getContext("2d");
			if (ctx) {
				const baseImg = spkmodGetBaseMiningAtlasImage();
				const applyAll = () => {
					// For all 64 tiles: if custom is defined, draw custom. If not, draw default base tile.
					for (let t = 0; t < 64; t++) {
						const col = t % 8;
						const row = Math.floor(t / 8);
						const custom = lunMiningCustomTextures[t];
						if (custom) {
							const cImg = new Image();
							cImg.onload = () => {
								ctx.clearRect(col * 16, row * 16, 16, 16);
								ctx.drawImage(cImg, col * 16, row * 16, 16, 16);
								world.atlas.texture.needsUpdate = true;
							};
							cImg.src = custom;
						} else if (baseImg.complete && baseImg.naturalWidth > 0) {
							ctx.clearRect(col * 16, row * 16, 16, 16);
							ctx.drawImage(baseImg, col * 16, row * 16, 16, 16, col * 16, row * 16, 16, 16);
						}
					}
					world.atlas.texture.needsUpdate = true;
					if (world.dirtyMeshes && world.renders) {
						for (const chunkKey of world.renders.keys()) {
							world.dirtyMeshes.add(chunkKey);
						}
					}
				};
				if (baseImg.complete && baseImg.naturalWidth > 0) {
					applyAll();
				} else {
					baseImg.onload = applyAll;
				}
			}
		}
	} catch (err) {
		console.warn("[SpeakiMod+] Error applying mining resource pack:", err);
	}

	// Clear icon cache and update hotbar if active
	try {
		if (typeof qH !== "undefined" && qH instanceof Map) qH.clear();
		if (typeof gameState !== "undefined" && gameState?.miningHost?.hud?.rebuildHotbar) {
			gameState.miningHost.hud.rebuildHotbar();
		}
	} catch (_) {}
}

function spkmodRestoreDefaultMiningAtlas() {
	try {
		const world = (typeof gameState !== "undefined" && gameState?.miningHost?.world) ? gameState.miningHost.world : null;
		if (world && world.atlas && world.atlas.texture && world.atlas.texture.image) {
			const canvas = world.atlas.texture.image;
			const ctx = canvas.getContext("2d");
			if (ctx) {
				const baseImg = spkmodGetBaseMiningAtlasImage();
				const restore = () => {
					ctx.clearRect(0, 0, 128, 128);
					ctx.drawImage(baseImg, 0, 0, 128, 128);
					world.atlas.texture.needsUpdate = true;
					if (world.dirtyMeshes && world.renders) {
						for (const chunkKey of world.renders.keys()) {
							world.dirtyMeshes.add(chunkKey);
						}
					}
				};
				if (baseImg.complete && baseImg.naturalWidth > 0) {
					restore();
				} else {
					baseImg.onload = restore;
				}
			}
		}
	} catch (err) {
		console.warn("[SpeakiMod+] Error restoring default mining atlas:", err);
	}
}

// Hook mining host initialization so packs auto-apply on entry
(function installMiningHostHooks() {
	if (typeof window !== "undefined") {
		// Periodic check or getter hook on gameState.miningHost
		let lastMiningActive = false;
		setInterval(() => {
			try {
				if (typeof gameState !== "undefined" && gameState?.miningHost) {
					const active = Boolean(gameState.miningHost.active || gameState.miningHost.isActive?.());
					if (active && !lastMiningActive) {
						lastMiningActive = true;
						if (lunResourcePackEnabled && Object.keys(lunMiningCustomTextures).length > 0) {
							setTimeout(spkmodApplyMiningResourcePack, 250);
						}
					} else if (!active) {
						lastMiningActive = false;
					}
				}
			} catch (_) {}
		}, 1000);
	}
})();

function buildResourcePackModal() {
	if (lunHudElements.resourcePackModal) return lunHudElements.resourcePackModal;

	const hiddenXmlInput = buildElement("input", {
		type: "file",
		accept: ".xml",
		style: "display: none;",
		onchange: e => {
			const file = e.target.files && e.target.files[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = () => {
					try {
						const packs = spkmodParseResourcePacksXml(reader.result);
						if (packs.length > 0) {
							const p = packs[0];
							lunMiningCustomTextures = p.textures || {};
							updateResourcePackStatus(false);
							spkmodRenderResourcePackBlockList();
							if (resourcePackModalElements.presetSelect) {
								let opt = resourcePackModalElements.presetSelect.querySelector(`option[value="${p.id}"]`);
								if (!opt) {
									opt = document.createElement("option");
									opt.value = p.id;
									opt.dataset.packName = p.name;
									opt.dataset.author = p.author || "";
									opt.innerText = p.author && !p.name.includes(p.author) ? `${p.name} (${p.author})` : p.name;
									resourcePackModalElements.presetSelect.appendChild(opt);
								} else {
									opt.dataset.packName = p.name;
									opt.dataset.author = p.author || "";
								}
								resourcePackModalElements.presetSelect.value = p.id;
							}
							alert(tCustom("resPackImportSuccess", `Resource pack '${p.name}' imported successfully (${Object.keys(lunMiningCustomTextures).length} textures)!`, p.name, Object.keys(lunMiningCustomTextures).length));
						} else {
							alert(tCustom("resPackErrNotPng", "No valid pack found in XML!"));
						}
					} catch (err) {
						alert("Import error: " + err.message);
					}
				};
				reader.readAsText(file);
			}
			hiddenXmlInput.value = "";
		}
	});
	document.body.appendChild(hiddenXmlInput);

	const modal = buildElement("div", {
		id: "spkmod-resource-pack-modal",
		className: "hidden",
		style: "z-index: 2147483645 !important;"
	}, [
		resourcePackModalElements.headerRow = buildElement("div", {
			style: "display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #333; padding-bottom: 6px; user-select: none; cursor: move;"
		}, [
			buildElement("div", { style: "display: flex; align-items: center; gap: 8px;" }, [
				resourcePackModalElements.headerTitle = buildElement("span", {
					style: "font-weight: bold; font-size: 14px;",
					innerText: "⛏️ " + tCustom("resourcePackTitle", "Mining Resource Packs")
				}),
				resourcePackModalElements.statusBadge = buildElement("span", {
					style: "font-size: 10px; padding: 1px 6px; border-radius: 10px; border: 1px solid #22c55e; color: #4ade80;",
					innerText: "● " + tCustom("customCssSaved", "Saved")
				})
			]),
			buildElement("div", { style: "display: flex; align-items: center; gap: 10px;" }, [
				resourcePackModalElements.enableLabel = buildElement("label", {
					style: "display: flex; align-items: center; gap: 4px; font-size: 12px; cursor: pointer;"
				}, [
					resourcePackModalElements.enableToggle = buildElement("input", {
						type: "checkbox",
						checked: lunResourcePackEnabled,
						onchange: e => {
							lunResourcePackEnabled = e.target.checked;
							updateResourcePackStatus(false);
						}
					}),
					document.createTextNode("Active")
				]),
				buildElement("button", {
					className: "spkmod-panel-btn",
					style: "padding: 1px 6px; font-weight: bold;",
					innerText: "✕",
					title: "Close",
					onclick: () => toggleResourcePackModal(false)
				})
			])
		]),

		// Control Bar (Presets & Actions)
		buildElement("div", {
			style: "display: flex; align-items: center; justify-content: space-between; gap: 6px; flex-wrap: wrap; background: rgba(25, 25, 25, 0.7); padding: 6px; border-radius: 6px; border: 1px solid #333;"
		}, [
			buildElement("div", { style: "display: flex; align-items: center; gap: 6px; flex-wrap: wrap;" }, [
				resourcePackModalElements.presetLabel = buildElement("span", {
					style: "font-size: 11px; color: #bbb;",
					innerText: tCustom("resPackPreset", "Preset:")
				}),
				resourcePackModalElements.presetSelect = buildElement("select", {
					className: "spkmod-panel-combo",
					style: "font-size: 11px; padding: 2px 4px; max-width: 160px;",
					onchange: e => {
						const pid = e.target.value;
						lunMiningSelectedPreset = pid;
						if (pid === "default") {
							lunMiningCustomTextures = {};
							updateResourcePackStatus(false);
							spkmodRenderResourcePackBlockList();
						} else {
							const pack = lunMiningLoadedPresets.find(p => p.id === pid);
							if (pack && pack.textures) {
								lunMiningCustomTextures = Object.assign({}, pack.textures);
								updateResourcePackStatus(false);
								spkmodRenderResourcePackBlockList();
							}
						}
					}
				}, [
					buildElement("option", { value: "custom", innerText: tCustom("resPackPresetCustom", "Custom / Current") }),
					buildElement("option", { value: "default", innerText: tCustom("resPackPresetVanilla", "Default Vanilla") }),
					buildElement("option", { value: "classic-8bit", innerText: tCustom("resPackPresetRetro", "Classic Retro 8-Bit") }),
					buildElement("option", { value: "neon-cyberpunk", innerText: tCustom("resPackPresetCyberpunk", "Neon Cyberpunk") }),
					buildElement("option", { value: "pastel-fantasy", innerText: tCustom("resPackPresetPastel", "Pastel Fantasy") })
				]),
				resourcePackModalElements.saveBtn = buildElement("button", {
					className: "spkmod-panel-btn",
					style: "padding: 3px 8px; font-size: 11px; font-weight: bold; background: #1e3a1e; border-color: #22c55e; color: #4ade80;",
					innerText: "💾 " + tCustom("resPackApplySave", "Apply & Save"),
					onclick: () => {
						saveResourcePackData();
						spkmodApplyMiningResourcePack();
					}
				}),
				resourcePackModalElements.restoreBtn = buildElement("button", {
					className: "spkmod-panel-btn",
					style: "padding: 3px 8px; font-size: 11px;",
					innerText: "↺ " + tCustom("resPackRestoreDefault", "Restore Defaults"),
					onclick: () => {
						if (confirm(tCustom("resPackConfirmRestore", "Restore all mining textures back to default vanilla?"))) {
							lunMiningCustomTextures = {};
							saveResourcePackData();
							spkmodRestoreDefaultMiningAtlas();
							spkmodRenderResourcePackBlockList();
						}
					}
				})
			]),
			buildElement("div", { style: "display: flex; align-items: center; gap: 4px;" }, [
				resourcePackModalElements.exportPackBtn = buildElement("button", {
					className: "spkmod-panel-btn",
					style: "padding: 3px 6px; font-size: 11px;",
					innerText: "📤 " + tCustom("resPackExportPack", "Export Pack (.xml)"),
					onclick: () => spkmodExportFullPackXml()
				}),
				resourcePackModalElements.importPackBtn = buildElement("button", {
					className: "spkmod-panel-btn",
					style: "padding: 3px 6px; font-size: 11px;",
					innerText: "📥 " + tCustom("resPackImportPack", "Import Pack (.xml)"),
					onclick: () => hiddenXmlInput.click()
				})
			])
		]),

		// Search & Category Filters
		buildElement("div", {
			style: "display: flex; align-items: center; gap: 6px;"
		}, [
			resourcePackModalElements.searchInput = buildElement("input", {
				type: "text",
				className: "spkmod-panel-combo",
				placeholder: tCustom("resPackSearchPlaceholder", "Filter blocks..."),
				style: "flex: 1; padding: 3px 6px; font-size: 11px;",
				oninput: () => spkmodRenderResourcePackBlockList()
			}),
			resourcePackModalElements.catSelect = buildElement("select", {
				className: "spkmod-panel-combo",
				style: "font-size: 11px; padding: 3px 6px;",
				onchange: () => spkmodRenderResourcePackBlockList()
			}, [
				buildElement("option", { value: "all", innerText: tCustom("resPackAllCategories", "All Categories") }),
				buildElement("option", { value: "terrain", innerText: tCustom("resPackCatTerrain", "Terrain") }),
				buildElement("option", { value: "ores", innerText: tCustom("resPackCatOres", "Ores") }),
				buildElement("option", { value: "building", innerText: tCustom("resPackCatBuilding", "Building") }),
				buildElement("option", { value: "rail_tech", innerText: tCustom("resPackCatTech", "Rail & Tech") }),
				buildElement("option", { value: "props", innerText: tCustom("resPackCatProps", "Props") })
			])
		]),

		// Main Block Cards List
		resourcePackModalElements.blocksContainer = buildElement("div", {
			id: "spkmod-respack-container",
			style: "flex: 1; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; padding-right: 4px; border: 1px solid #333; border-radius: 6px; background: rgba(16, 16, 16, 0.9);"
		}),

		// Footer Row
		buildElement("div", {
			style: "display: flex; align-items: center; justify-content: space-between; font-size: 10px; color: #888; border-top: 1px solid #333; padding-top: 4px;"
		}, [
			resourcePackModalElements.tipLabel = buildElement("span", {
				innerText: tCustom("resPackTip", "Tip: Imported textures must be exactly 16x16 pixels with 32bpp RGBA.")
			}),
			resourcePackModalElements.resizeHandle = buildElement("div", {
				style: "width: 14px; height: 14px; cursor: nwse-resize; display: flex; align-items: flex-end; justify-content: flex-end; user-select: none;",
				title: "Resize"
			}, [
				buildElement("span", {
					innerHTML: '<svg viewBox="0 0 10 10" width="10" height="10" style="opacity: 0.65; display: block; pointer-events: none;"><path d="M9 1 L1 9 M9 5 L5 9 M9 9 L9 9" stroke="#e8b84b" stroke-width="1.2" stroke-linecap="round"/></svg>'
				})
			])
		])
	]);

	lunHudElements.resourcePackModal = modal;
	document.body.appendChild(modal);

	modal.addEventListener("wheel", e => { e.stopPropagation(); }, { passive: true });
	modal.addEventListener("touchmove", e => { e.stopPropagation(); }, { passive: true });
	modal.addEventListener("mouseenter", () => {
		if (document.pointerLockElement) {
			try { document.exitPointerLock(); } catch (_) {}
		}
	});
	modal.addEventListener("mousedown", e => {
		e.stopPropagation();
		if (document.pointerLockElement) {
			try { document.exitPointerLock(); } catch (_) {}
		}
	}, true);

	setTimeout(() => {
		if (typeof makeDraggable === "function" && lunHudElements.resourcePackModal && resourcePackModalElements.headerRow) {
			makeDraggable(lunHudElements.resourcePackModal, [resourcePackModalElements.headerRow]);
		}
		if (typeof makeResizable === "function" && lunHudElements.resourcePackModal && resourcePackModalElements.resizeHandle) {
			makeResizable(lunHudElements.resourcePackModal, resourcePackModalElements.resizeHandle, {
				minWidth: 460,
				minHeight: 360,
				storageKey: "spkmod-size-spkmod-respack-modal"
			});
		}
		if (lunHudElements.resourcePackModal && !(window.localStorage && localStorage.getItem("spkmod-size-spkmod-respack-modal"))) {
			lunHudElements.resourcePackModal.style.width = "660px";
			lunHudElements.resourcePackModal.style.height = "540px";
		}
		if (lunHudElements.resourcePackModal && !(window.localStorage && (localStorage.getItem("spkmod-pos-x-spkmod-respack-modal") || localStorage.getItem("spkmod-pos-spkmod-respack-modal")))) {
			if (typeof positionModalNicely === "function") {
				positionModalNicely(lunHudElements.resourcePackModal);
			}
		}
	}, 500);

	// Load remote XML presets in background
	spkmodFetchResourcePacksXml().then(packs => {
		lunMiningLoadedPresets = packs;
		if (resourcePackModalElements.presetSelect && packs.length > 0) {
			resourcePackModalElements.presetSelect.innerHTML = "";
			const optCustom = document.createElement("option");
			optCustom.value = "custom";
			optCustom.innerText = tCustom("resPackPresetCustom", "Custom / Current");
			resourcePackModalElements.presetSelect.appendChild(optCustom);

			packs.forEach(p => {
				const opt = document.createElement("option");
				opt.value = p.id;
				opt.dataset.packName = p.name;
				opt.dataset.author = p.author || "";
				opt.innerText = p.author && p.author !== "SpeakiMod" && p.author !== "SpeakiRPG" && !p.name.includes(p.author)
					? `${p.name} (${p.author})`
					: p.name;
				opt.title = p.desc || p.name;
				resourcePackModalElements.presetSelect.appendChild(opt);
			});
		}
	});

	return modal;
}

function spkmodRenderResourcePackBlockList() {
	if (!resourcePackModalElements.blocksContainer) return;
	const container = resourcePackModalElements.blocksContainer;
	container.innerHTML = "";

	const query = (resourcePackModalElements.searchInput?.value || "").trim().toLowerCase();
	const catFilter = resourcePackModalElements.catSelect?.value || "all";

	const baseImg = spkmodGetBaseMiningAtlasImage();

	SPKMOD_MINING_BLOCKS.forEach(block => {
		if (catFilter !== "all" && block.cat !== catFilter) return;
		const localizedName = tCustom(block.key, block.name);
		if (query && !String(block.id).includes(query) && !localizedName.toLowerCase().includes(query) && !block.name.toLowerCase().includes(query)) {
			return;
		}

		const row = buildElement("div", {
			style: "display: flex; align-items: center; justify-content: space-between; padding: 4px 8px; border-bottom: 1px solid #222; gap: 8px; background: rgba(22, 22, 22, 0.7); border-radius: 4px;"
		}, [
			// Col 1: Info (ID, Name, Category)
			buildElement("div", { style: "display: flex; align-items: center; gap: 8px; min-width: 160px; flex: 1;" }, [
				buildElement("span", {
					style: "font-size: 10px; font-weight: bold; background: #333; color: #e8b84b; padding: 2px 5px; border-radius: 3px; min-width: 24px; text-align: center;",
					innerText: "#" + block.id
				}),
				buildElement("div", { style: "display: flex; flex-direction: column;" }, [
					buildElement("span", {
						style: "font-size: 12px; font-weight: bold; color: #EEE;",
						innerText: localizedName
					}),
					buildElement("span", {
						style: "font-size: 9px; color: #777;",
						innerText: block.cat.toUpperCase()
					})
				])
			]),

			// Col 2: Default Preview Canvas
			buildElement("div", { style: "display: flex; align-items: center; gap: 4px;" }, [
				buildElement("span", { style: "font-size: 9px; color: #666;", innerText: "Def:" }),
				(() => {
					const cv = document.createElement("canvas");
					cv.width = 16;
					cv.height = 16;
					cv.style.cssText = "width: 32px; height: 32px; image-rendering: pixelated; border: 1px solid #444; border-radius: 4px; background: #111;";
					cv.title = "Default game texture";
					const drawBase = () => {
						const ctx = cv.getContext("2d");
						if (ctx) {
							const col = block.id % 8;
							const row = Math.floor(block.id / 8);
							ctx.clearRect(0, 0, 16, 16);
							ctx.drawImage(baseImg, col * 16, row * 16, 16, 16, 0, 0, 16, 16);
						}
					};
					if (baseImg.complete && baseImg.naturalWidth > 0) drawBase();
					else baseImg.addEventListener("load", drawBase);
					return cv;
				})()
			]),

			// Col 3: Custom Replacement Preview Canvas
			buildElement("div", { style: "display: flex; align-items: center; gap: 4px;" }, [
				buildElement("span", { style: "font-size: 9px; color: #e8b84b;", innerText: "Custom:" }),
				(() => {
					const cv = document.createElement("canvas");
					cv.width = 16;
					cv.height = 16;
					cv.style.cssText = "width: 32px; height: 32px; image-rendering: pixelated; border: 1px solid #555; border-radius: 4px; background: #181818;";
					const customData = lunMiningCustomTextures[block.id];
					if (customData) {
						cv.style.borderColor = "#22c55e";
						cv.title = "Custom active texture";
						const img = new Image();
						img.onload = () => {
							const ctx = cv.getContext("2d");
							if (ctx) {
								ctx.clearRect(0, 0, 16, 16);
								ctx.drawImage(img, 0, 0, 16, 16);
							}
						};
						img.src = customData;
					} else {
						cv.title = "No custom texture (using default)";
						const ctx = cv.getContext("2d");
						if (ctx) {
							ctx.fillStyle = "#222";
							ctx.fillRect(0, 0, 16, 16);
							ctx.strokeStyle = "#444";
							ctx.beginPath();
							ctx.moveTo(0, 0); ctx.lineTo(16, 16);
							ctx.stroke();
						}
					}
					return cv;
				})()
			]),

			// Col 4: Per-Block Actions (Export, Import, Clear)
			buildElement("div", { style: "display: flex; align-items: center; gap: 4px;" }, [
				buildElement("button", {
					className: "spkmod-panel-btn",
					style: "padding: 2px 6px; font-size: 10px;",
					innerText: "📤 " + tCustom("resPackExportPng", "Export"),
					title: "Export 16x16 PNG for " + localizedName,
					onclick: () => spkmodExportBlockPng(block.id, block.name)
				}),
				(() => {
					const fileInput = document.createElement("input");
					fileInput.type = "file";
					fileInput.accept = "image/png";
					fileInput.style.display = "none";
					fileInput.onchange = async e => {
						const file = e.target.files && e.target.files[0];
						if (!file) return;
						try {
							const dataUrl = await spkmodValidateAndRead16x16Png(file);
							lunMiningCustomTextures[block.id] = dataUrl;
							updateResourcePackStatus(false);
							spkmodRenderResourcePackBlockList();
						} catch (err) {
							alert(err.message);
						}
						fileInput.value = "";
					};
					const importBtn = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 2px 6px; font-size: 10px; background: #1a3020; border-color: #22c55e;",
						innerText: "📥 " + tCustom("resPackImportPng", "Import"),
						title: "Import 16x16 32bpp PNG for " + localizedName,
						onclick: () => fileInput.click()
					});
					const wrap = document.createElement("span");
					wrap.appendChild(fileInput);
					wrap.appendChild(importBtn);
					return wrap;
				})(),
				buildElement("button", {
					className: "spkmod-panel-btn",
					style: "padding: 2px 5px; font-size: 10px; color: #e57373;",
					innerText: "✕",
					title: "Clear custom texture for this block",
					onclick: () => {
						if (lunMiningCustomTextures[block.id]) {
							delete lunMiningCustomTextures[block.id];
							updateResourcePackStatus(false);
							spkmodRenderResourcePackBlockList();
						}
					}
				})
			])
		]);

		container.appendChild(row);
	});
}

function toggleResourcePackModal(explicitState) {
	if (!lunHudElements.resourcePackModal) {
		buildResourcePackModal();
	}
	const isHidden = lunHudElements.resourcePackModal.classList.contains("hidden");
	const shouldShow = explicitState !== undefined ? explicitState : isHidden;
	if (shouldShow) {
		if (document.pointerLockElement) {
			try { document.exitPointerLock(); } catch (_) {}
		}
		if (resourcePackModalElements.enableToggle) {
			resourcePackModalElements.enableToggle.checked = lunResourcePackEnabled;
		}
		spkmodRenderResourcePackBlockList();
		if (typeof positionModalNicely === "function") {
			positionModalNicely(lunHudElements.resourcePackModal);
		}
		lunHudElements.resourcePackModal.classList.remove("hidden");
	} else {
		lunHudElements.resourcePackModal.classList.add("hidden");
	}
}

function updateResourcePackI18n() {
	if (lunPanelElements.resourcePackSettingsBtn) {
		lunPanelElements.resourcePackSettingsBtn.innerText = "⛏️ " + tCustom("resourcePackBtn", "Resource Packs");
		lunPanelElements.resourcePackSettingsBtn.title = tCustom("resourcePackBtnTooltip", "Customize mining game voxel block textures");
	}
	if (lunPanelElements.resourcePackSectionBtn) {
		lunPanelElements.resourcePackSectionBtn.innerText = "⛏️ " + tCustom("resourcePackTitle", "Mining Resource Packs");
		lunPanelElements.resourcePackSectionBtn.title = tCustom("resourcePackBtnTooltip", "Customize mining game voxel block textures");
	}
	if (resourcePackModalElements.headerTitle) {
		resourcePackModalElements.headerTitle.innerText = "⛏️ " + tCustom("resourcePackTitle", "Mining Resource Packs");
	}
	if (resourcePackModalElements.presetLabel) {
		resourcePackModalElements.presetLabel.innerText = tCustom("resPackPreset", "Preset:");
	}
	if (resourcePackModalElements.saveBtn) {
		resourcePackModalElements.saveBtn.innerText = "💾 " + tCustom("resPackApplySave", "Apply & Save");
	}
	if (resourcePackModalElements.restoreBtn) {
		resourcePackModalElements.restoreBtn.innerText = "↺ " + tCustom("resPackRestoreDefault", "Restore Defaults");
	}
	if (resourcePackModalElements.exportPackBtn) {
		resourcePackModalElements.exportPackBtn.innerText = "📤 " + tCustom("resPackExportPack", "Export Pack (.xml)");
	}
	if (resourcePackModalElements.importPackBtn) {
		resourcePackModalElements.importPackBtn.innerText = "📥 " + tCustom("resPackImportPack", "Import Pack (.xml)");
	}
	if (resourcePackModalElements.tipLabel) {
		resourcePackModalElements.tipLabel.innerText = tCustom("resPackTip", "Tip: Imported textures must be exactly 16x16 pixels with 32bpp RGBA.");
	}
	if (resourcePackModalElements.statusBadge) {
		updateResourcePackStatus(!lunMiningHasUnsavedChanges);
	}
	if (lunHudElements.resourcePackModal && !lunHudElements.resourcePackModal.classList.contains("hidden")) {
		spkmodRenderResourcePackBlockList();
	}
}

if (typeof spkmodI18nRenderers !== "undefined") {
	spkmodI18nRenderers.push(updateResourcePackI18n);
}

loadResourcePackData();
buildResourcePackModal();
if (lunResourcePackEnabled && Object.keys(lunMiningCustomTextures).length > 0) {
	setTimeout(spkmodApplyMiningResourcePack, 500);
}

