// --- EMOJI PICKER ---
let lunEmojiPickerPanel = null;
let lunEmojiTab = "standard";
const LUN_EMOJIS = ["👍","👎","👋","🙏","👏","🙌","🤝","😊","😂","🤣","😍","😎","🤔","😅","😭","🥺","🔥","💯","❤️","✨","🎉","💀","👀","🗣️","💰","💎","🟣","⭐","❌","✅", "💪", "🤷", "🤦", "🎈", "🎂", "🥳", "🙄", "🤐", "🥵", "🥶", "🤯", "😴", "🤮", "🤡", "👻", "👽", "💩", "🤖", "🎃"];
let lunEmojiFreq = JSON.parse((window.localStorage && localStorage.getItem("spkmod-emoji-freq")) || "{}");
let lunEmojiFavorites = JSON.parse((window.localStorage && localStorage.getItem("spkmod-emoji-fav")) || "[]");
let lunEmojiSize = parseInt((window.localStorage && localStorage.getItem("spkmod-emoji-size")) || "35", 10);
if (isNaN(lunEmojiSize) || lunEmojiSize < 20 || lunEmojiSize > 80) lunEmojiSize = 35;

function toggleFavoriteEmoji(id) {
    if (lunEmojiFavorites.includes(id)) {
        lunEmojiFavorites = lunEmojiFavorites.filter(x => x !== id);
        if (typeof chatLog !== "undefined") chatLog(t("emojiFavRemoved", id));
    } else {
        lunEmojiFavorites.push(id);
        if (typeof chatLog !== "undefined") chatLog(t("emojiFavAdded", id));
    }
    if (window.localStorage) localStorage.setItem("spkmod-emoji-fav", JSON.stringify(lunEmojiFavorites));
    if (typeof lunEmojiTab !== "undefined" && lunEmojiTab === "fav") { if (typeof renderEmojiGrid === "function") renderEmojiGrid(); }
}
window.toggleFavoriteEmoji = toggleFavoriteEmoji;

function loadEmojiCatalogFile(url, targetObj) {
    const fallbackUrl = url.replace(/\/main\//, "/161e1bca722be72c67da40a04da2880ea83b1928/").replace(/\/refs\/heads\/main\//, "/161e1bca722be72c67da40a04da2880ea83b1928/");
    const parse = (txt) => {
        txt.split("\n").forEach(l => {
            const line = l.trim();
            if (!line) return;
            const parts = line.split(",");
            if (parts.length >= 2) {
                const name = parts[0].replace(/:/g, "").trim();
                const u = parts.slice(1).join(",").trim();
                if (name && u) {
                    targetObj[name] = u;
                }
            }
        });
        if (typeof spkmodAvatarController !== "undefined" && spkmodAvatarController.refreshCatalog) spkmodAvatarController.refreshCatalog();
        if (typeof renderEmojiGrid === "function" && typeof lunEmojiPickerPanel !== "undefined" && lunEmojiPickerPanel) renderEmojiGrid();
        if (typeof renderBbsPosts === "function" && typeof lunHudElements !== "undefined" && lunHudElements && lunHudElements.bbsModal && !lunHudElements.bbsModal.classList.contains("hidden")) {
            renderBbsPosts();
        }
        if (typeof updateBbsI18n === "function") updateBbsI18n();
        const bbsIconSpan = document.getElementById("spkmod-bbs-btn-icon");
        if (bbsIconSpan && typeof renderSpkmodInlineEmojis === "function") {
            bbsIconSpan.innerHTML = renderSpkmodInlineEmojis(":t_280:", "height: 20px; width: 20px; object-fit: contain; display: block; pointer-events: none; user-select: none;");
        }
    };
    fetch(url).then(res => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.text();
    }).then(parse).catch(() => {
        fetch(fallbackUrl).then(res => res.text()).then(parse).catch(err => {
            console.warn("[SpeakiMod+] Failed to load emojis from", url, err);
        });
    });
}

// Custom Emojis (Fetched from GitHub)
var lunCustomEmojis = {};
loadEmojiCatalogFile("https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/refs/heads/main/assets/emojis.txt", lunCustomEmojis);

var lunTrickcalEmojis = {};
loadEmojiCatalogFile("https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/main/assets/emojis2.txt", lunTrickcalEmojis);

var lunTrickcal2Emojis = {};
loadEmojiCatalogFile("https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/main/assets/emojis3.txt", lunTrickcal2Emojis);

var lunTrickcal3Emojis = {};
loadEmojiCatalogFile("https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/main/assets/emojis4.txt", lunTrickcal3Emojis);

var lunTrickcal4Emojis = {};
loadEmojiCatalogFile("https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/main/assets/emojis5.txt", lunTrickcal4Emojis);

function renderSpkmodInlineEmojis(text, imgStyle) {
    if (!text || typeof text !== "string") return "";
    const escaped = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    const spkmodAllEmojis = {
        t_280: "https://i.imgur.com/tCrOOr5.png",
        SPK_88: "https://i.imgur.com/6H1r2Vz.gif",
        ...(typeof lunCustomEmojis !== "undefined" ? lunCustomEmojis : {}),
        ...(typeof lunTrickcalEmojis !== "undefined" ? lunTrickcalEmojis : {}),
        ...(typeof lunTrickcal2Emojis !== "undefined" ? lunTrickcal2Emojis : {}),
        ...(typeof lunTrickcal3Emojis !== "undefined" ? lunTrickcal3Emojis : {}),
        ...(typeof lunTrickcal4Emojis !== "undefined" ? lunTrickcal4Emojis : {})
    };
    const styleAttr = imgStyle || "height: 1.35em; width: 1.35em; object-fit: contain; vertical-align: middle; margin-right: 2px; display: inline-block; pointer-events: none; user-select: none;";
    return escaped.replace(/:([a-zA-Z0-9_+-]+):/g, (match, ename) => {
        const eurl = spkmodAllEmojis[ename];
        if (!eurl) return match;
        return `<img src="${eurl}" alt=":${ename}:" draggable="false" style="${styleAttr}" onerror="this.onerror=null; this.style.opacity='0.4';">`;
    });
}
window.renderSpkmodInlineEmojis = renderSpkmodInlineEmojis;

function spkmodIsTouchOrMobile() {
    if (typeof spkmodIsMobile === "function" && spkmodIsMobile()) return true;
    if (typeof window.speakiMobile !== "undefined") return true;
    if (typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches && (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0)) return true;
    return false;
}

function ensureSpkmodRichTooltipEl() {
    let el = document.getElementById("spkmod-rich-tooltip");
    if (!el && document.body) {
        el = document.createElement("div");
        el.id = "spkmod-rich-tooltip";
        el.style.cssText = "position: fixed; z-index: 2147483647; pointer-events: none; display: none; align-items: center; gap: 5px; background: rgba(15, 23, 42, 0.96); color: #f8fafc; border: 1px solid var(--spkmod-accent, #ffd54a); border-radius: 6px; padding: 4px 8px; font-size: 11px; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.65); white-space: nowrap; transform: translate(-50%, -100%);";
        document.body.appendChild(el);
    }
    return el;
}

function setSpkmodRichTooltip(elem, rawText) {
    if (!elem) return;
    elem.removeAttribute("title");
    elem.dataset.spkRichTooltip = rawText || "";
    if (!elem.__spkRichTooltipBound) {
        elem.__spkRichTooltipBound = true;
        const showTip = (e) => {
            // Never display hover tooltips on mobile or touch devices
            if (spkmodIsTouchOrMobile()) return;
            if (e && e.pointerType === "touch") return;

            const txt = elem.dataset.spkRichTooltip;
            if (!txt) return;
            const tip = ensureSpkmodRichTooltipEl();
            if (!tip) return;
            tip.innerHTML = renderSpkmodInlineEmojis(txt, "height: 16px; width: 16px; object-fit: contain; vertical-align: middle; display: inline-block; pointer-events: none; user-select: none;");
            tip.style.display = "inline-flex";
            const rect = elem.getBoundingClientRect();
            let left = rect.left + rect.width / 2;
            let top = rect.top - 6;
            tip.style.transform = "translate(-50%, -100%)";
            if (top < 30) {
                top = rect.bottom + 6;
                tip.style.transform = "translate(-50%, 0)";
            }
            const tipWidth = tip.offsetWidth || 80;
            left = Math.max(tipWidth / 2 + 6, Math.min(window.innerWidth - tipWidth / 2 - 6, left));
            tip.style.left = left + "px";
            tip.style.top = top + "px";
        };
        const hideTip = () => {
            const tip = document.getElementById("spkmod-rich-tooltip");
            if (tip) tip.style.display = "none";
        };
        elem.addEventListener("mouseenter", showTip);
        elem.addEventListener("mouseleave", hideTip);
        elem.addEventListener("pointerdown", hideTip);
        elem.addEventListener("touchstart", hideTip, { passive: true });
        elem.addEventListener("blur", hideTip);
    }
}
window.setSpkmodRichTooltip = setSpkmodRichTooltip;

function updateHudIconTooltips() {
    if (typeof setSpkmodRichTooltip !== "function" || typeof lunPanelElements === "undefined" || !lunPanelElements) return;

    // 1. Mute button
    if (lunPanelElements.muteBtn) {
        const muted = typeof isGameMuted === "function" && isGameMuted();
        const icon = muted ? "🔇" : "🔊";
        const tip = muted ? (t("unmuteBtnTooltip") || "Unmute Game") : (t("muteBtnTooltip") || "Mute Game");
        setSpkmodRichTooltip(lunPanelElements.muteBtn, icon + " " + tip);
    }

    // 2. Invisible button
    if (lunPanelElements.invisibleBtn) {
        const raw = t("invisibleBtn") || "Invisible Self";
        const clean = raw.replace(/^👻\s*/, '');
        setSpkmodRichTooltip(lunPanelElements.invisibleBtn, "👻 " + clean);
    }

    // 3. Settings button
    if (lunPanelElements.settingsBtn) {
        setSpkmodRichTooltip(lunPanelElements.settingsBtn, "⚙️ " + (t("settingsBtnTooltip") || "Settings (F2)"));
    }

    // 4. Hotkeys button
    if (lunPanelElements.hotkeysBtn) {
        setSpkmodRichTooltip(lunPanelElements.hotkeysBtn, "⌨️ " + (t("hotkeysModalTitle") || "Hotkeys"));
    }

    // 5. Patch Notes button
    if (lunPanelElements.patchNotesBtn) {
        setSpkmodRichTooltip(lunPanelElements.patchNotesBtn, "📰 " + (t("patchNotesBtnTooltip") || "Game Patch Notes"));
    }

    // 6. BBS / DarkNet button
    if (lunPanelElements.bbsBtn) {
        const rawTip = t("bbsBtnTooltip");
        const tipStr = (!rawTip || rawTip === "bbsBtnTooltip") ? ":t_280: DarkNet" : (rawTip.includes(":t_280:") ? rawTip : ":t_280: " + rawTip);
        setSpkmodRichTooltip(lunPanelElements.bbsBtn, tipStr);
    }

    // 7. Info button
    if (lunPanelElements.infoBtn) {
        const tip = t("infoBtnTooltip");
        const clean = (!tip || tip === "infoBtnTooltip") ? "Info & News" : tip;
        setSpkmodRichTooltip(lunPanelElements.infoBtn, "ℹ️ " + clean.replace(/^ℹ️\s*/, ''));
    }

    // 8. Minigame button
    if (lunPanelElements.minigameBtn) {
        setSpkmodRichTooltip(lunPanelElements.minigameBtn, "🎮 " + (t("eventMinigameTitle") || "Minigame"));
    }

    // 9. Event button
    if (lunPanelElements.eventBtn) {
        setSpkmodRichTooltip(lunPanelElements.eventBtn, "🎉 " + (t("eventInfoBtnTooltip") || "Event Info"));
    }

    // 10. Map button
    if (lunPanelElements.mapBtn) {
        setSpkmodRichTooltip(lunPanelElements.mapBtn, "🗺️ " + (t("mapModalTitle") || "World Map"));
    }

    // 11. Stats button
    if (lunPanelElements.statsBtn) {
        setSpkmodRichTooltip(lunPanelElements.statsBtn, "⏱️ " + (t("statsBtnTooltip") || "Session Stats & Tracker"));
    }

    // 12. Quests button
    if (lunPanelElements.questsBtn) {
        setSpkmodRichTooltip(lunPanelElements.questsBtn, "📋 " + (t("questsBtnTooltip") || "Quests Checklist"));
    }

    // 13. Jukebox button
    if (lunPanelElements.jukeboxBtn) {
        const tip = (typeof getJukeboxText === "function" ? getJukeboxText("jukeboxBtnTooltip") : t("jukeboxBtnTooltip")) || "Monatium Radio Station (Alt+M)";
        setSpkmodRichTooltip(lunPanelElements.jukeboxBtn, "🎵 " + tip);
    }

    // 14. Drag / Lock button
    if (lunPanelElements.dragBtn) {
        const isLocked = lunHudElements && lunHudElements.hud && lunHudElements.hud.dataset.spkmodLocked === "true";
        const tip = t("dragMenuTooltip") || "Drag Menu";
        setSpkmodRichTooltip(lunPanelElements.dragBtn, (isLocked ? "🔒 " : "⚓ ") + tip);
    }
}
window.updateHudIconTooltips = updateHudIconTooltips;

function parseCustomEmojisToHtml(html) {
    if (!html || typeof html !== "string") return html;
    const spkmodAllEmojis = {
        ...(typeof lunCustomEmojis !== "undefined" ? lunCustomEmojis : {}),
        ...(typeof lunTrickcalEmojis !== "undefined" ? lunTrickcalEmojis : {}),
        ...(typeof lunTrickcal2Emojis !== "undefined" ? lunTrickcal2Emojis : {}),
        ...(typeof lunTrickcal3Emojis !== "undefined" ? lunTrickcal3Emojis : {}),
        ...(typeof lunTrickcal4Emojis !== "undefined" ? lunTrickcal4Emojis : {})
    };
    if (Object.keys(spkmodAllEmojis).length === 0) return html;
    for (const [ename, eurl] of Object.entries(spkmodAllEmojis)) {
        const tag = ":" + ename + ":";
        if (html.includes(tag)) {
            html = html.split(tag).join(`<span class="spkmod-custom-emoji" data-name="${ename}" data-url="${eurl}" title="${tag}"><img src="${eurl}" style="height: 1.6em; vertical-align: middle; padding: 0 1px; display: inline-block;" loading="lazy" onerror="this.onerror=null; this.style.opacity='0.4';"></span>`);
        }
    }
    return html;
}
window.parseCustomEmojisToHtml = parseCustomEmojisToHtml;


// Local emoji avatars
// This adapter is deliberately independent of the DOM. A future authenticated
// service can implement the same async get/set contract without changing the UI.
// Only emoji references are saved; never game credentials or arbitrary image URLs.
function getSpeakiAvatarPlayer(state) {
	const name = typeof state?.myPlayerName === "string" ? state.myPlayerName.trim() : "";
	// myPlayerId is an in-world identifier, not a guaranteed persistent account ID.
	// Keep this local identity separate so a future service can supply stable IDs.
	return name ? { id: `name:${name}`, name } : null;
}

function validSpeakiAvatar(value) {
	return value && ["custom", "trickcal", "trickcal2", "trickcal3", "trickcal4"].includes(value.pack)
		&& typeof value.name === "string" && value.name.length > 0 && value.name.length <= 100;
}

function createSpeakiAvatarStore(storage) {
	const keyFor = id => `spkmod-avatar-v1:${encodeURIComponent(String(id))}`;
	return {
		async get(id) {
			const raw = storage.getItem(keyFor(id));
			if (!raw) return null;
			try {
				const data = JSON.parse(raw);
				return data.version === 1 && validSpeakiAvatar(data.emoji)
					? { pack: data.emoji.pack, name: data.emoji.name } : null;
			} catch { return null; }
		},
		async set(id, emoji) {
			if (emoji === null) { storage.removeItem(keyFor(id)); return; }
			if (!validSpeakiAvatar(emoji)) throw new Error("Invalid avatar selection");
			storage.setItem(keyFor(id), JSON.stringify({ version: 1, emoji: { pack: emoji.pack, name: emoji.name } }));
		}
	};
}

function createSpeakiAvatarController({ document, store, getPlayer, getCatalog, translate }) {
	let player = null, selection = null, portrait = null, button = null, dialog = null;
	let generation = 0, imageGeneration = 0, renderedUrl = null, loaded = false;
	let refreshDialog = () => {};
	const style = document.createElement("style");
	style.textContent = `
		.sr-player-card__portrait-wrap:has(> .spkmod-avatar-button) { position: relative; }
		.sr-player-card__portrait-wrap > .spkmod-avatar-button { position:absolute; inset:0; width:100%; height:100%; border:0; padding:0; border-radius:50%; overflow:hidden; background:transparent; cursor:pointer; z-index:1; }
		.sr-player-card__portrait-wrap > .sr-player-card__lv-badge { z-index:2; pointer-events:none; }
		.sr-player-card__portrait-wrap > .sr-player-card__class-badge { z-index:2; }
		.spkmod-avatar-button:focus-visible { outline:3px solid #ffd54a; outline-offset:3px; }
		.spkmod-avatar-button img, .spkmod-avatar-preview img, .spkmod-avatar-choice img { display:block; width:100%; height:100%; object-fit:cover; object-position:center; border-radius:50%; }
		.spkmod-avatar-dialog { box-sizing:border-box; width:min(480px, calc(100vw - 28px)); max-height:85vh; padding:20px; color:#f8fafc; background:#172033; border:1px solid #475569; border-radius:16px; font:14px/1.5 sans-serif; box-shadow:0 20px 60px #0008; overscroll-behavior:contain; overflow-y:auto; }
		.spkmod-avatar-dialog::backdrop { background:#0008; }
		.spkmod-avatar-dialog h2 { margin:0; font-size:20px; }
		.spkmod-avatar-dialog p { color:#bac6d8; margin:8px 0 16px; }
		.spkmod-avatar-dialog button, .spkmod-avatar-dialog input { font:inherit; }
		.spkmod-avatar-dialog button { cursor:pointer; color:inherit; background:#29364c; border:1px solid #52627b; border-radius:8px; padding:8px 12px; }
		.spkmod-avatar-dialog button:disabled { opacity:.45; cursor:default; }
		.spkmod-avatar-dialog button:focus-visible, .spkmod-avatar-dialog input:focus-visible { outline:2px solid #ffd54a; outline-offset:2px; }
		.spkmod-avatar-preview { width:88px; height:88px; border-radius:50%; overflow:hidden; background:#334155; display:grid; place-items:center; font-size:36px; margin:12px auto; }
		.spkmod-avatar-tabs, .spkmod-avatar-actions { display:flex; gap:8px; flex-wrap:wrap; margin:12px 0; }
		.spkmod-avatar-dialog button[aria-pressed="true"] { border-color:#ffd54a; background:#51462b; }
		.spkmod-avatar-search { box-sizing:border-box; width:100%; padding:9px 12px; border-radius:8px; border:1px solid #52627b; background:#0f172a; color:inherit; }
		.spkmod-avatar-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(56px,1fr)); gap:10px; max-height:240px; overflow-y:auto; padding:6px; margin-top:12px; overscroll-behavior:contain; }
		.spkmod-avatar-grid .spkmod-avatar-choice { padding:0; width:56px; height:56px; border-radius:50%; overflow:hidden; border:2px solid transparent; background:#334155; }
		.spkmod-avatar-status { min-height:1.5em; color:#fcd34d; margin-top:8px; }
		.spkmod-avatar-actions { justify-content:flex-end; margin-bottom:0; }
		.spkmod-avatar-actions .spkmod-avatar-apply { background:#ffd54a; border-color:#ffd54a; color:#172033; font-weight:bold; }
	`;
	document.head.appendChild(style);
	const text = key => translate(key);
	const same = (a, b) => a?.pack === b?.pack && a?.name === b?.name;
	function imageUrl(emoji) {
		if (!validSpeakiAvatar(emoji)) return null;
		const url = getCatalog()[emoji.pack]?.[emoji.name];
		if (typeof url !== "string") return null;
		try { return ["https:", "http:"].includes(new URL(url).protocol) ? url : null; }
		catch { return null; }
	}
	function close() {
		if (!dialog) return;
		dialog.close(); dialog.remove(); dialog = null;
		refreshDialog = () => {};
		button?.focus();
	}
	function renderPortrait() {
		if (!button) return;
		button.title = text("avatarChange");
		button.setAttribute("aria-label", text("avatarChange"));
		button.disabled = !loaded;
		const url = imageUrl(selection);
		if (url === renderedUrl) return;
		renderedUrl = url;
		const token = ++imageGeneration;
		button.replaceChildren(); // The game's initials remain underneath until the image loads.
		if (!url) return;
		const img = document.createElement("img");
		img.alt = ""; img.referrerPolicy = "no-referrer"; img.draggable = false;
		img.onload = () => { if (token === imageGeneration && button) button.replaceChildren(img); };
		img.onerror = () => { if (token === imageGeneration && button) button.replaceChildren(); };
		img.src = url;
	}
	function open() {
		if (!player || !loaded || dialog) return;
		const owner = player.id, token = generation;
		let pending = selection ? { ...selection } : null;
		let pack = pending?.pack || "custom", previewGeneration = 0, ready = false, saving = false;
		dialog = document.createElement("dialog");
		dialog.className = "spkmod-avatar-dialog";
		dialog.id = "spkmod-avatar-dialog";
		dialog.setAttribute("aria-labelledby", "spkmod-avatar-title");
		const modal = dialog;
		function element(tag, className, content) {
			const el = document.createElement(tag);
			if (className) el.className = className;
			if (content) el.textContent = content;
			return el;
		}
		const title = element("h2", "", text("avatarTitle")); title.id = "spkmod-avatar-title";
		const note = element("p", "", text("avatarLocalNote"));
		const preview = element("div", "spkmod-avatar-preview");
		const tabs = element("div", "spkmod-avatar-tabs");
		const search = element("input", "spkmod-avatar-search");
		search.type = "search"; search.placeholder = text("avatarSearch"); search.setAttribute("aria-label", text("avatarSearch"));
		const grid = element("div", "spkmod-avatar-grid");
		const status = element("div", "spkmod-avatar-status"); status.setAttribute("role", "status");
		const actions = element("div", "spkmod-avatar-actions");
		const reset = element("button", "", text("avatarReset"));
		const cancel = element("button", "", text("avatarCancel"));
		const apply = element("button", "spkmod-avatar-apply", text("avatarApply"));
		actions.append(reset, cancel, apply);
		modal.append(title, note, preview, tabs, search, grid, status, actions);
		const initial = () => Array.from(player?.name || "?")[0];
		function updatePreview() {
			const current = ++previewGeneration;
			preview.textContent = initial();
			ready = pending === null; apply.disabled = !ready || saving;
			status.textContent = "";
			if (!pending) return;
			const url = imageUrl(pending);
			if (!url) { status.textContent = text("avatarUnavailable"); return; }
			const img = element("img"); img.alt = pending.name; img.referrerPolicy = "no-referrer";
			img.onload = () => {
				if (current !== previewGeneration || dialog !== modal) return;
				preview.replaceChildren(img); ready = true; apply.disabled = saving;
			};
			img.onerror = () => {
				if (current !== previewGeneration || dialog !== modal) return;
				status.textContent = text("avatarUnavailable"); ready = false; apply.disabled = true;
			};
			img.src = url;
		}
		function renderGrid() {
			grid.replaceChildren();
			const query = search.value.trim().toLowerCase();
			for (const [name] of Object.entries(getCatalog()[pack] || {})) {
				if (query && !name.toLowerCase().includes(query)) continue;
				const emoji = { pack, name }, url = imageUrl(emoji);
				if (!url) continue;
				const choice = element("button", "spkmod-avatar-choice");
				choice.title = name; choice.setAttribute("aria-label", name);
				choice.setAttribute("aria-pressed", String(same(pending, emoji)));
				choice.disabled = saving;
				const img = element("img"); img.alt = ""; img.loading = "lazy"; img.referrerPolicy = "no-referrer";
				img.onerror = () => { choice.disabled = true; choice.textContent = "×"; };
				img.src = url; choice.appendChild(img);
				choice.onclick = () => {
					pending = emoji;
					for (const other of grid.children) other.setAttribute("aria-pressed", String(other === choice));
					updatePreview();
				};
				grid.appendChild(choice);
			}
			if (!grid.children.length) grid.textContent = text("avatarEmpty");
		}
		for (const [key, label] of [["custom", "avatarCustom"], ["trickcal", "Trickcal"], ["trickcal2", "Trickcal 2"], ["trickcal3", "Trickcal 3"], ["trickcal4", "Trickcal 4"]]) {
			const tab = element("button", "", key === "custom" ? text(label) : label);
			tab.setAttribute("aria-pressed", String(pack === key));
			tab.onclick = () => {
				pack = key;
				for (const other of tabs.children) other.setAttribute("aria-pressed", String(other === tab));
				renderGrid();
			};
			tabs.appendChild(tab);
		}
		search.oninput = renderGrid;
		reset.onclick = () => { pending = null; updatePreview(); renderGrid(); };
		cancel.onclick = close;
		apply.onclick = async () => {
			if (!ready || saving || generation !== token || String(getPlayer()?.id) !== owner) { sync(); return; }
			saving = true; apply.disabled = true; reset.disabled = true; renderGrid();
			try {
				await store.set(owner, pending);
				if (generation !== token || String(getPlayer()?.id) !== owner) { sync(); return; }
				selection = pending; renderPortrait();
				if (dialog === modal) close();
			} catch {
				if (dialog !== modal) return;
				saving = false; apply.disabled = !ready; reset.disabled = false;
				status.textContent = text("avatarSaveError"); renderGrid();
			}
		};
		modal.addEventListener("cancel", e => { e.preventDefault(); close(); });
		// Prevent wheel/touch inside the avatar dialog from zooming the game camera
		const scrollDelta = (e) => (e.deltaMode === 1 ? e.deltaY * 33 : (e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY));
		modal.addEventListener("wheel", (e) => {
			e.stopPropagation();
			if (grid && e.target !== grid && !grid.contains(e.target)) {
				grid.scrollTop += scrollDelta(e);
			}
		}, { passive: true });
		modal.addEventListener("touchmove", (e) => e.stopPropagation(), { passive: true });
		modal.addEventListener("mousedown", (e) => e.stopPropagation());
		modal.addEventListener("pointerdown", (e) => e.stopPropagation());
		grid.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });
		grid.addEventListener("touchmove", (e) => e.stopPropagation(), { passive: true });

		// Keep typing and Escape inside the dialog rather than triggering game/mod shortcuts.
		modal.addEventListener("keydown", e => {
			e.stopPropagation();
			if (e.key === "Escape") { e.preventDefault(); close(); }
		});
		modal.addEventListener("keyup", e => e.stopPropagation());
		modal.addEventListener("click", e => { if (e.target === modal) {
			const r = modal.getBoundingClientRect();
			if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close();
		} });
		refreshDialog = () => { renderGrid(); updatePreview(); };
		document.body.appendChild(modal); refreshDialog(); modal.showModal();
	}
	function sync() {
		const current = getPlayer();
		const id = current?.id != null && String(current.id).trim() ? String(current.id) : null;
		if (id !== (player?.id ?? null)) {
			generation++; selection = null; loaded = false; close();
			player = id ? { id, name: current.name } : null;
			if (id) {
				const token = generation;
				Promise.resolve().then(() => store.get(id)).then(value => {
					if (token !== generation) return;
					selection = validSpeakiAvatar(value) ? value : null;
				}).catch(() => {}).finally(() => {
					if (token !== generation) return;
					loaded = true; renderPortrait();
				});
			}
		} else if (player) player.name = current.name;
		const target = id ? document.querySelector(".sr-player-card__portrait") : null;
		if (target !== portrait || (button && !button.isConnected)) {
			button?.remove(); button = null; portrait = target; renderedUrl = null; imageGeneration++;
			if (portrait?.parentElement) {
				button = document.createElement("button"); button.type = "button";
				button.className = "spkmod-avatar-button";
				button.setAttribute("aria-haspopup", "dialog");
				button.onclick = e => { e.preventDefault(); e.stopPropagation(); open(); };
				portrait.parentElement.appendChild(button);
			}
		}
		renderPortrait();
	}
	return { sync, open, refreshCatalog() { renderPortrait(); refreshDialog(); } };
}

const spkmodAvatarStore = createSpeakiAvatarStore({
	getItem: key => localStorage.getItem(key),
	setItem: (key, value) => localStorage.setItem(key, value),
	removeItem: key => localStorage.removeItem(key)
});

const spkmodAvatarController = createSpeakiAvatarController({
	document,
	store: spkmodAvatarStore,
	getPlayer: () => getSpeakiAvatarPlayer(window.gameState),
	getCatalog: () => ({ custom: lunCustomEmojis, trickcal: lunTrickcalEmojis, trickcal2: lunTrickcal2Emojis, trickcal3: lunTrickcal3Emojis, trickcal4: lunTrickcal4Emojis }),
	translate: key => t(key)
});

function getSortedEmojis() {
    return [...LUN_EMOJIS].sort((a,b) => (lunEmojiFreq[b]||0) - (lunEmojiFreq[a]||0));
}

function toggleEmojiPicker(anchorBtn) {
    if (typeof lunEmojiPreviewTooltip !== "undefined" && lunEmojiPreviewTooltip) {
        lunEmojiPreviewTooltip.style.display = "none";
    }
    if (lunEmojiPickerPanel) {
        lunEmojiPickerPanel.remove();
        lunEmojiPickerPanel = null;
        window.lunEmojiTargetInput = null;
        return;
    }
    
    lunEmojiPickerPanel = document.createElement("div");
    lunEmojiPickerPanel.id = "spkmod-emoji-picker-v2";
    
    const isMobile = typeof window.speakiMobile !== "undefined" || (typeof navigator !== "undefined" && /mobi|android/i.test(navigator.userAgent));
    const defaultW = isMobile ? "360px" : "420px";
    const defaultH = isMobile ? "320px" : "420px";
    lunEmojiPickerPanel.style.cssText = `position: fixed; width: ${defaultW}; height: ${defaultH}; max-width: 95vw; max-height: 80vh; min-width: 200px; min-height: 150px; resize: both; overflow: hidden; background: rgba(20, 20, 20, 0.95); border: 1px solid #555; border-radius: 6px; padding: 6px; display: flex; flex-direction: column; gap: 4px; z-index: 2147483646 !important; box-shadow: 0 4px 12px rgba(0,0,0,0.5); pointer-events: auto;`;
    lunEmojiPickerPanel.style.setProperty("z-index", "2147483646", "important");
    const emojiSizeKey = "spkmod-size-spkmod-emoji-picker-v2";

    try {
        const savedSize = window.localStorage && localStorage.getItem(emojiSizeKey);
        if (savedSize) {
            const parsedSize = JSON.parse(savedSize);
            const sw = parseInt(parsedSize && parsedSize.width, 10);
            const sh = parseInt(parsedSize && parsedSize.height, 10);
            if (!isNaN(sw) && !isNaN(sh)) {
                lunEmojiPickerPanel.style.width = Math.max(200, Math.min(Math.round(window.innerWidth * 0.95), sw)) + "px";
                lunEmojiPickerPanel.style.height = Math.max(150, Math.min(Math.round(window.innerHeight * 0.8), sh)) + "px";
            }
        }
    } catch (_) {}
    
    if (!(window.localStorage && localStorage.getItem("spkmod-pos-spkmod-emoji-picker-v2"))) {
        if (isMobile) {
            lunEmojiPickerPanel.style.left = Math.max(10, (window.innerWidth / 2) - 180) + "px";
            lunEmojiPickerPanel.style.top = Math.max(10, (window.innerHeight / 2) - 160) + "px";
            lunEmojiPickerPanel.style.bottom = "auto";
        } else if (anchorBtn) {
            const btnRect = anchorBtn.getBoundingClientRect();
            const panelW = 420;
            const panelH = 420;
            let left = btnRect.right + 10;
            if (left + panelW > window.innerWidth - 10) {
                left = btnRect.left - panelW - 10;
            }
            if (left < 10) {
                left = Math.max(10, (window.innerWidth - panelW) / 2);
            }
            let top = btnRect.bottom - panelH;
            if (top < 10) {
                top = Math.max(10, btnRect.top);
            }
            if (top + panelH > window.innerHeight - 10) {
                top = Math.max(10, window.innerHeight - panelH - 10);
            }
            lunEmojiPickerPanel.style.left = left + "px";
            lunEmojiPickerPanel.style.top = top + "px";
            lunEmojiPickerPanel.style.bottom = "auto";
        } else {
            lunEmojiPickerPanel.style.left = Math.max(10, (window.innerWidth - 420) / 2) + "px";
            lunEmojiPickerPanel.style.top = Math.max(10, (window.innerHeight - 420) / 2) + "px";
            lunEmojiPickerPanel.style.bottom = "auto";
        }
    }
    
    // Prevent scrolling inside the panel from zooming the game camera
    lunEmojiPickerPanel.addEventListener("wheel", (e) => { e.stopPropagation(); }, { passive: true });
    lunEmojiPickerPanel.addEventListener("touchmove", (e) => { e.stopPropagation(); }, { passive: true });
    lunEmojiPickerPanel.addEventListener("mousedown", (e) => { e.stopPropagation(); });
    lunEmojiPickerPanel.addEventListener("touchstart", (e) => { e.stopPropagation(); }, { passive: true });

    renderEmojiGrid();
    document.body.appendChild(lunEmojiPickerPanel);
    lunEmojiPickerPanel.style.setProperty("z-index", "2147483646", "important");

    if (typeof ResizeObserver !== "undefined" && window.localStorage) {
        const panelEl = lunEmojiPickerPanel;
        const cs = getComputedStyle(panelEl);
        let lastW = Math.round(parseFloat(cs.width)) || 0;
        let lastH = Math.round(parseFloat(cs.height)) || 0;
        const sizeObserver = new ResizeObserver(() => {
            if (!panelEl.isConnected) { sizeObserver.disconnect(); return; }
            const c = getComputedStyle(panelEl);
            const w = Math.round(parseFloat(c.width));
            const h = Math.round(parseFloat(c.height));
            if (!w || !h || (w === lastW && h === lastH)) return;
            lastW = w; lastH = h;
            try { localStorage.setItem(emojiSizeKey, JSON.stringify({ width: w, height: h })); } catch (_) {}
        });
        sizeObserver.observe(panelEl);
    }
    
    const closeHandler = (e) => {
        if (!lunEmojiPickerPanel) return;
        if (e.target && !document.contains(e.target)) return;
        
        const path = e.composedPath ? e.composedPath() : [];
        let isInside = false;
        if (path.length > 0) {
            isInside = path.includes(lunEmojiPickerPanel) || (anchorBtn && path.includes(anchorBtn)) || (window.lunEmojiTargetInput && path.includes(window.lunEmojiTargetInput));
        }
        
        if (!isInside) {
            let el = e.target;
            while (el) {
                if (el === lunEmojiPickerPanel || (anchorBtn && el === anchorBtn) || (window.lunEmojiTargetInput && el === window.lunEmojiTargetInput)) {
                    isInside = true;
                    break;
                }
                el = el.parentElement;
            }
        }
        
        if (!isInside) {
            lunEmojiPickerPanel.remove();
            lunEmojiPickerPanel = null;
            window.lunEmojiTargetInput = null;
            document.removeEventListener("mousedown", closeHandler);
            document.removeEventListener("touchstart", closeHandler);
        }
    };
    setTimeout(() => {
        document.addEventListener("mousedown", closeHandler);
        document.addEventListener("touchstart", closeHandler, {passive: true});
    }, 10);
}

function renderEmojiGrid() {
    if (!lunEmojiPickerPanel) return;
    
    let headerWrap = lunEmojiPickerPanel.querySelector(".spkmod-emoji-header");
    let header = lunEmojiPickerPanel.querySelector("#spkmod-emoji-tabs");
    let grid = lunEmojiPickerPanel.querySelector("#spkmod-emoji-grid");
    
    if (!headerWrap) {
        lunEmojiPickerPanel.innerHTML = "";
        
        headerWrap = document.createElement("div");
        headerWrap.className = "spkmod-emoji-header";
        headerWrap.style.cssText = "cursor: move; user-select: none; touch-action: none;";
        
        const warningBanner = document.createElement("div");
        warningBanner.id = "spkmod-emoji-warning";
        warningBanner.style.cssText = "color: #ffaa00; font-size: 11px; text-align: center; margin-bottom: 4px; padding-bottom: 4px; border-bottom: 1px dashed #555; font-weight: bold; font-family: sans-serif; white-space: pre-line; line-height: 1.35;";
        headerWrap.appendChild(warningBanner);

        header = document.createElement("div");
        header.id = "spkmod-emoji-tabs";
        header.style.cssText = "display: flex; gap: 4px; margin-bottom: 4px; border-bottom: 1px solid #444; padding-bottom: 4px; flex-wrap: wrap;";
        headerWrap.appendChild(header);
        
        lunEmojiPickerPanel.appendChild(headerWrap);

        grid = document.createElement("div");
        grid.id = "spkmod-emoji-grid";
        grid.style.cssText = "display: flex; flex-wrap: wrap; gap: 4px; flex-grow: 1; overflow-y: auto; align-content: flex-start;";
        lunEmojiPickerPanel.appendChild(grid);
        
        const fixEmojiPanelPos = () => {
            if (lunEmojiPickerPanel.style.bottom !== "auto") {
                lunEmojiPickerPanel.style.top = lunEmojiPickerPanel.getBoundingClientRect().top + "px";
                lunEmojiPickerPanel.style.bottom = "auto";
            }
        };
        headerWrap.addEventListener("mousedown", fixEmojiPanelPos);
        headerWrap.addEventListener("touchstart", fixEmojiPanelPos, { passive: true });

        if (typeof makeDraggable === 'function') {
            makeDraggable(lunEmojiPickerPanel, [headerWrap]);
        }
    }
    
    let warningBannerEl = lunEmojiPickerPanel.querySelector("#spkmod-emoji-warning");
    if (warningBannerEl) {
        warningBannerEl.innerText = lunEmojiTab === "fav" ? t("emojiWarningFav") : t("emojiWarning");
    }
    
    header.innerHTML = "";
    
    const btnStd = document.createElement("button");
    btnStd.innerText = "😀 " + t("emojiTabStandard", "Standard");
    btnStd.style.cssText = `flex: 1; padding: 4px; cursor: pointer; border-radius: 4px; background: ${lunEmojiTab === 'standard' ? 'rgba(255,255,255,0.2)' : 'transparent'}; border: none; color: #fff;`;
    btnStd.onclick = (e) => { lunEmojiTab = 'standard'; renderEmojiGrid(); };
    
    const btnCus = document.createElement("button");
    btnCus.innerText = "⭐ " + t("emojiTabCustom", "Custom");
    btnCus.style.cssText = `flex: 1; padding: 4px; cursor: pointer; border-radius: 4px; background: ${lunEmojiTab === 'custom' ? 'rgba(255,255,255,0.2)' : 'transparent'}; border: none; color: #fff;`;
    btnCus.onclick = (e) => { lunEmojiTab = 'custom'; renderEmojiGrid(); };
    
    const btnTrickcal = document.createElement("button");
    btnTrickcal.innerText = "🍀 " + t("emojiTabTrickcal", "Trickcal");
    btnTrickcal.style.cssText = `flex: 1; padding: 4px; cursor: pointer; border-radius: 4px; background: ${lunEmojiTab === 'trickcal' ? 'rgba(255,255,255,0.2)' : 'transparent'}; border: none; color: #fff;`;
    btnTrickcal.onclick = (e) => { lunEmojiTab = 'trickcal'; renderEmojiGrid(); };

    const btnTrickcal2 = document.createElement("button");
    btnTrickcal2.innerText = "🍀 " + t("emojiTabTrickcal2", "Trickcal 2");
    btnTrickcal2.style.cssText = `flex: 1; padding: 4px; cursor: pointer; border-radius: 4px; background: ${lunEmojiTab === 'trickcal2' ? 'rgba(255,255,255,0.2)' : 'transparent'}; border: none; color: #fff;`;
    btnTrickcal2.onclick = (e) => { lunEmojiTab = 'trickcal2'; renderEmojiGrid(); };

    const btnTrickcal3 = document.createElement("button");
    btnTrickcal3.innerText = "🍀 " + t("emojiTabTrickcal3", "Trick 3");
    btnTrickcal3.style.cssText = `flex: 1; padding: 4px; cursor: pointer; border-radius: 4px; background: ${lunEmojiTab === 'trickcal3' ? 'rgba(255,255,255,0.2)' : 'transparent'}; border: none; color: #fff;`;
    btnTrickcal3.onclick = (e) => { lunEmojiTab = 'trickcal3'; renderEmojiGrid(); };

    const btnTrickcal4 = document.createElement("button");
    btnTrickcal4.innerText = "🍀 " + t("emojiTabTrickcal4", "Trick 4");
    btnTrickcal4.style.cssText = `flex: 1; padding: 4px; cursor: pointer; border-radius: 4px; background: ${lunEmojiTab === 'trickcal4' ? 'rgba(255,255,255,0.2)' : 'transparent'}; border: none; color: #fff;`;
    btnTrickcal4.onclick = (e) => { lunEmojiTab = 'trickcal4'; renderEmojiGrid(); };
    
    header.appendChild(btnStd);
    header.appendChild(btnCus);
    header.appendChild(btnTrickcal);
    header.appendChild(btnTrickcal2);
    header.appendChild(btnTrickcal3);
    header.appendChild(btnTrickcal4);

    const btnFav = document.createElement("button");
    btnFav.innerText = t("emojiTabFav", "Fav");
    btnFav.style.cssText = `flex: 1; padding: 4px; cursor: pointer; border-radius: 4px; background: ${lunEmojiTab === 'fav' ? 'rgba(255,255,255,0.2)' : 'transparent'}; border: none; color: #fff;`;
    btnFav.onclick = (e) => { lunEmojiTab = 'fav'; renderEmojiGrid(); };
    header.appendChild(btnFav);

    const btnSizePlus = document.createElement("button");
    btnSizePlus.innerText = "+";
    btnSizePlus.title = t("emojiSizeIncreaseTooltip") || "Increase emoji size (+)";
    btnSizePlus.style.cssText = `flex: 0 0 22px; width: 22px; padding: 2px 0; cursor: ${lunEmojiSize >= 80 ? 'default' : 'pointer'}; border-radius: 4px; background: rgba(255,255,255,0.08); border: 1px solid #555; color: #fff; font-size: 13px; font-weight: bold; display: inline-flex; align-items: center; justify-content: center; line-height: 1; user-select: none; opacity: ${lunEmojiSize >= 80 ? '0.4' : '1'};`;
    btnSizePlus.onmouseenter = () => { if (lunEmojiSize < 80) btnSizePlus.style.background = "rgba(255,255,255,0.2)"; };
    btnSizePlus.onmouseleave = () => { if (lunEmojiSize < 80) btnSizePlus.style.background = "rgba(255,255,255,0.08)"; };
    btnSizePlus.onclick = (e) => {
        e.stopPropagation();
        if (lunEmojiSize >= 80) return;
        lunEmojiSize = Math.min(80, (lunEmojiSize || 35) + 5);
        if (window.localStorage) localStorage.setItem("spkmod-emoji-size", String(lunEmojiSize));
        renderEmojiGrid();
    };

    const btnSizeMinus = document.createElement("button");
    btnSizeMinus.innerText = "−";
    btnSizeMinus.title = t("emojiSizeDecreaseTooltip") || "Decrease emoji size (−)";
    btnSizeMinus.style.cssText = `flex: 0 0 22px; width: 22px; padding: 2px 0; cursor: ${lunEmojiSize <= 20 ? 'default' : 'pointer'}; border-radius: 4px; background: rgba(255,255,255,0.08); border: 1px solid #555; color: #fff; font-size: 13px; font-weight: bold; display: inline-flex; align-items: center; justify-content: center; line-height: 1; user-select: none; opacity: ${lunEmojiSize <= 20 ? '0.4' : '1'};`;
    btnSizeMinus.onmouseenter = () => { if (lunEmojiSize > 20) btnSizeMinus.style.background = "rgba(255,255,255,0.2)"; };
    btnSizeMinus.onmouseleave = () => { if (lunEmojiSize > 20) btnSizeMinus.style.background = "rgba(255,255,255,0.08)"; };
    btnSizeMinus.onclick = (e) => {
        e.stopPropagation();
        if (lunEmojiSize <= 20) return;
        lunEmojiSize = Math.max(20, (lunEmojiSize || 35) - 5);
        if (window.localStorage) localStorage.setItem("spkmod-emoji-size", String(lunEmojiSize));
        renderEmojiGrid();
    };

    header.appendChild(btnSizePlus);
    header.appendChild(btnSizeMinus);

    grid.innerHTML = "";
    const curCustomSize = lunEmojiSize || 35;
    const curStdSize = Math.max(16, curCustomSize - 4);
    const curStdFontSize = Math.max(12, Math.round(curCustomSize * 0.55));
    
    if (lunEmojiTab === 'fav') {
        if (lunEmojiFavorites.length === 0) {
            const noFavs = document.createElement("div");
            noFavs.innerText = t("emojiNoFavs", "No favorites yet. Right click emojis to favorite!");
            noFavs.style.cssText = "color: #aaa; width: 100%; text-align: center; margin-top: 20px; font-size: 13px;";
            grid.appendChild(noFavs);
        } else {
            lunEmojiFavorites.forEach(id => {
                let isCustom = false;
                let url = null;
                let name = id;
                if (typeof lunTrickcalEmojis !== 'undefined' && lunTrickcalEmojis[id]) { isCustom = true; url = lunTrickcalEmojis[id]; }
                else if (typeof lunTrickcal2Emojis !== 'undefined' && lunTrickcal2Emojis[id]) { isCustom = true; url = lunTrickcal2Emojis[id]; }
                else if (typeof lunTrickcal3Emojis !== 'undefined' && lunTrickcal3Emojis[id]) { isCustom = true; url = lunTrickcal3Emojis[id]; }
                else if (typeof lunTrickcal4Emojis !== 'undefined' && lunTrickcal4Emojis[id]) { isCustom = true; url = lunTrickcal4Emojis[id]; }
                else if (typeof lunCustomEmojis !== 'undefined' && lunCustomEmojis[id]) { isCustom = true; url = lunCustomEmojis[id]; }
                
                const btn = document.createElement("button");
                if (isCustom) {
                    btn.title = `:${name}:`;
                    btn.className = "spkmod-custom-emoji";
                    btn.setAttribute("data-url", url);
                    btn.style.cssText = `width: ${curCustomSize}px; height: ${curCustomSize}px; background: rgba(255,255,255,0.1); border: 1px solid transparent; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.1s; padding: 2px;`;
                    btn.onmouseenter = () => btn.style.background = "rgba(255,255,255,0.2)";
                    btn.onmouseleave = () => btn.style.background = "rgba(255,255,255,0.1)";
                    const img = document.createElement("img");
                    img.src = url;
                    img.style.cssText = "max-width: 100%; max-height: 100%; object-fit: contain;";
                    btn.appendChild(img);
                    btn.onclick = (e) => {
                        insertEmojiIntoChat(`:${name}: `);
                    };
                } else {
                    btn.innerText = id;
                    btn.style.cssText = `width: ${curStdSize}px; height: ${curStdSize}px; background: rgba(255,255,255,0.1); border: 1px solid transparent; border-radius: 4px; cursor: pointer; font-size: ${curStdFontSize}px; display: flex; align-items: center; justify-content: center; transition: background 0.1s;`;
                    btn.onmouseenter = () => btn.style.background = "rgba(255,255,255,0.2)";
                    btn.onmouseleave = () => btn.style.background = "rgba(255,255,255,0.1)";
                    btn.onclick = (e) => {
                        lunEmojiFreq[id] = (lunEmojiFreq[id]||0) + 1;
                        if (window.localStorage) localStorage.setItem("spkmod-emoji-freq", JSON.stringify(lunEmojiFreq));
                        insertEmojiIntoChat(id);
                    };
                }
                btn.oncontextmenu = (e) => {
                    e.preventDefault();
                    if (typeof toggleFavoriteEmoji === 'function') toggleFavoriteEmoji(id);
                };
                grid.appendChild(btn);
            });
        }
    } else if (lunEmojiTab === 'standard') {
        const sorted = getSortedEmojis();
        sorted.forEach(emoji => {
            const btn = document.createElement("button");
            btn.innerText = emoji;
            btn.style.cssText = `width: ${curStdSize}px; height: ${curStdSize}px; background: rgba(255,255,255,0.1); border: 1px solid transparent; border-radius: 4px; cursor: pointer; font-size: ${curStdFontSize}px; display: flex; align-items: center; justify-content: center; transition: background 0.1s;`;
            btn.onmouseenter = () => btn.style.background = "rgba(255,255,255,0.2)";
            btn.onmouseleave = () => btn.style.background = "rgba(255,255,255,0.1)";
            btn.onclick = (e) => {
                lunEmojiFreq[emoji] = (lunEmojiFreq[emoji]||0) + 1;
                if (window.localStorage) localStorage.setItem("spkmod-emoji-freq", JSON.stringify(lunEmojiFreq));
                renderEmojiGrid();
                insertEmojiIntoChat(emoji);
            };
            btn.oncontextmenu = (e) => {
                e.preventDefault();
                if (typeof toggleFavoriteEmoji === 'function') toggleFavoriteEmoji(emoji);
            };
            grid.appendChild(btn);
        });
    } else {
        const targetEmojis = lunEmojiTab === 'trickcal' ? lunTrickcalEmojis : (lunEmojiTab === 'trickcal2' ? lunTrickcal2Emojis : (lunEmojiTab === 'trickcal3' ? lunTrickcal3Emojis : (lunEmojiTab === 'trickcal4' ? lunTrickcal4Emojis : lunCustomEmojis)));
        Object.entries(targetEmojis).forEach(([name, url]) => {
            const btn = document.createElement("button");
            btn.title = `:${name}:`;
            btn.className = "spkmod-custom-emoji";
            btn.setAttribute("data-url", url);
            btn.style.cssText = `width: ${curCustomSize}px; height: ${curCustomSize}px; background: rgba(255,255,255,0.1); border: 1px solid transparent; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.1s; padding: 2px;`;
            btn.onmouseenter = () => btn.style.background = "rgba(255,255,255,0.2)";
            btn.onmouseleave = () => btn.style.background = "rgba(255,255,255,0.1)";
            
            const img = document.createElement("img");
            img.src = url;
            img.style.cssText = "max-width: 100%; max-height: 100%; object-fit: contain;";
            btn.appendChild(img);
            
            btn.onclick = (e) => {
                insertEmojiIntoChat(`:${name}: `);
            };
            btn.oncontextmenu = (e) => {
                e.preventDefault();
                if (typeof toggleFavoriteEmoji === 'function') toggleFavoriteEmoji(name);
            };
            grid.appendChild(btn);
        });
    }
    
    lunEmojiPickerPanel.appendChild(grid);
}

function insertEmojiIntoChat(emoji) {
    let target = null;
    if (window.lunEmojiTargetInput && document.body.contains(window.lunEmojiTargetInput)) {
        target = window.lunEmojiTargetInput;
    } else if (document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) {
        target = document.activeElement;
    } else {
        target = document.querySelector(".sr-chatbox__input, .sr-chatbox input, input[placeholder*='chat']");
    }

    if (!target) return;
    
    target.focus();
    const isTextarea = target.tagName === "TEXTAREA";
    const start = (typeof target.selectionStart === "number") ? target.selectionStart : target.value.length;
    const end = (typeof target.selectionEnd === "number") ? target.selectionEnd : target.value.length;
    
    let inserted = false;
    try {
        inserted = document.execCommand('insertText', false, emoji);
    } catch (_) {
        inserted = false;
    }
    
    if (!inserted) {
        const val = target.value || "";
        const maxLen = target.maxLength > 0 ? target.maxLength : 500;
        const nextVal = val.slice(0, start) + emoji + val.slice(end);
        if (nextVal.length <= maxLen) {
            const proto = isTextarea ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
            const nativeSetter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
            if (nativeSetter) {
                nativeSetter.call(target, nextVal);
            } else {
                target.value = nextVal;
            }
            target.selectionStart = target.selectionEnd = start + emoji.length;
            target.dispatchEvent(new Event('input', { bubbles: true }));
            target.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
    
    if (typeof bbsModalElements !== "undefined" && target === bbsModalElements.input && bbsModalElements.charCount) {
        bbsModalElements.charCount.innerText = `${target.value.length}/500`;
    }
}

// --- FEEDBACK POLL MODAL & EMOJI BUTTON HOOK ---
let lunPollAnswers = { q1: null, q2: null, q3: null };

function hookChatEmojiButton() {
    const chatInput = document.querySelector(".sr-chatbox input, input[placeholder*='chat']");
    if (!chatInput) return;
    const container = chatInput.parentElement;
    
    let btn = document.getElementById("spkmod-emoji-btn");
    if (!btn) {
        btn = document.createElement("button");
        btn.id = "spkmod-emoji-btn";
        btn.innerText = "😀";
        btn.title = "Emojis";
        btn.style.cssText = "position: absolute; right: 5px; top: 50%; transform: translateY(-50%); width: 24px; height: 24px; background: transparent; border: none; cursor: pointer; z-index: 999999; font-size: 16px; display: flex; align-items: center; justify-content: center; filter: grayscale(100%); transition: filter 0.2s; pointer-events: auto; user-select: none;";
        btn.onmousedown = (e) => { e.preventDefault(); };
        btn.onmouseenter = () => btn.style.filter = "none";
        btn.onmouseleave = () => btn.style.filter = "grayscale(100%)";
        btn.onclick = (e) => {
            e.preventDefault();
            window.lunEmojiTargetInput = chatInput;
            toggleEmojiPicker(btn);
        };
        container.style.position = "relative";
        container.appendChild(btn);
        
        chatInput.style.paddingRight = "30px";
    } else {
        btn.title = "Emojis";
        btn.onclick = (e) => {
            e.preventDefault();
            window.lunEmojiTargetInput = chatInput;
            toggleEmojiPicker(btn);
        };
    }
}

window.showPollModal = function(forceLang) {
    const existing = document.getElementById("spkmod-poll-modal");
    if (existing) existing.remove();

    let lang = forceLang;
    if (!lang) {
        lang = (typeof spkmodLang !== 'undefined') ? spkmodLang : 'en';
        if (typeof window.lunCurrentLang !== 'undefined') lang = window.lunCurrentLang;
    }
    if (lang === 'zh') lang = 'zh-CN';
    if (lang === 'es') lang = 'es-419';

    const getTranslation = (k, ...args) => {
        let str = (typeof spkmodTranslations !== 'undefined' && spkmodTranslations[lang] && spkmodTranslations[lang][k])
            || (typeof spkmodTranslations !== 'undefined' && spkmodTranslations['en'] && spkmodTranslations['en'][k])
            || k;
        args.forEach((a, i) => { str = str.split(`{${i}}`).join(a); });
        return str;
    };

    const overlay = document.createElement("div");
    overlay.id = "spkmod-poll-modal";
    overlay.style.cssText = "position: fixed; inset: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.93); z-index: 2147483646 !important; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; color: white;";

    overlay.addEventListener("wheel", (e) => { e.stopPropagation(); }, { passive: true });
    overlay.addEventListener("touchmove", (e) => { e.stopPropagation(); }, { passive: true });
    overlay.addEventListener("mousedown", (e) => { e.stopPropagation(); });

    const content = document.createElement("div");
    content.style.cssText = "background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 24px; max-width: 620px; width: 90%; max-height: 95vh; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.6); box-sizing: border-box;";

    const langRow = document.createElement("div");
    langRow.style.cssText = "display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; margin-bottom: 4px;";
    const langs = [
        { code: 'en', label: 'English' },
        { code: 'ja', label: '日本語' },
        { code: 'ko', label: '한국어' },
        { code: 'zh-TW', label: '繁體中文' },
        { code: 'zh-CN', label: '简体中文' },
        { code: 'es-419', label: 'Español' }
    ];
    langs.forEach(l => {
        const btn = document.createElement("button");
        btn.innerText = l.label;
        btn.style.cssText = `padding: 5px 10px; font-size: 13px; font-weight: bold; border-radius: 6px; border: 1px solid #475569; background: ${lang === l.code ? '#3b82f6' : '#0f172a'}; color: white; cursor: pointer; transition: 0.15s;`;
        btn.onmouseover = () => { if (lang !== l.code) btn.style.background = '#334155'; };
        btn.onmouseleave = () => { if (lang !== l.code) btn.style.background = '#0f172a'; };
        btn.onclick = () => window.showPollModal(l.code);
        langRow.appendChild(btn);
    });
    content.appendChild(langRow);

    const title = document.createElement("h2");
    title.innerText = "📊 " + getTranslation("pollTitle");
    title.style.cssText = "margin: 0; font-size: 22px; color: #facc15; text-align: center; border-bottom: 1px solid #334155; padding-bottom: 10px;";
    content.appendChild(title);

    const notice = document.createElement("div");
    notice.innerText = getTranslation("pollNotice");
    notice.style.cssText = "margin: 0; font-size: 14px; line-height: 1.5; color: #cbd5e1; background: rgba(15, 23, 42, 0.6); border-left: 4px solid #facc15; padding: 10px 14px; border-radius: 4px; white-space: pre-line;";
    content.appendChild(notice);

    const bodyContainer = document.createElement("div");
    bodyContainer.id = "spkmod-poll-body";
    bodyContainer.style.cssText = "display: flex; flex-direction: column; gap: 14px;";
    content.appendChild(bodyContainer);

    const getPollServerUrl = () => {
        let saved = (window.localStorage && localStorage.getItem("spkmod-poll-server-url")) || "";
        if (saved.startsWith("http://") || saved.includes("YOUR_RPI")) saved = "";
        return window.spkmodPollServerUrl || saved || "https://spk.lena.moe";
    };

    let storedVote = null;
    let pendingVote = null;
    try {
        storedVote = JSON.parse(localStorage.getItem("spkmod-poll-voted-v1") || "null");
    } catch (_) {}
    try {
        pendingVote = JSON.parse(localStorage.getItem("spkmod-poll-pending-v1") || "null");
    } catch (_) {}

    const initialVote = storedVote || pendingVote;
    if (initialVote) {
        if (initialVote.q1) lunPollAnswers.q1 = initialVote.q1;
        if (initialVote.q2) lunPollAnswers.q2 = initialVote.q2;
        if (initialVote.q3) lunPollAnswers.q3 = initialVote.q3;
    }

    function renderResults(results, isAlreadyVoted, offlineMsg) {
        bodyContainer.innerHTML = "";
        
        const headerNote = document.createElement("div");
        headerNote.innerText = offlineMsg || (isAlreadyVoted ? getTranslation("pollAlreadyVoted") : getTranslation("pollSubmitted"));
        headerNote.style.cssText = `font-size: 15px; font-weight: bold; text-align: center; padding: 10px; border-radius: 8px; ${offlineMsg ? 'background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid #ef4444;' : 'background: rgba(16, 185, 129, 0.2); color: #6ee7b7; border: 1px solid #10b981;'}`;
        bodyContainer.appendChild(headerNote);

        if (results) {
            const totalText = document.createElement("div");
            totalText.innerText = getTranslation("pollTotalVotes", results.totalVotes || 0);
            totalText.style.cssText = "font-size: 14px; color: #94a3b8; text-align: right; margin-top: -4px;";
            bodyContainer.appendChild(totalText);

            const questions = [
                { id: "q1", title: getTranslation("pollQ1") },
                { id: "q2", title: getTranslation("pollQ2") },
                { id: "q3", title: getTranslation("pollQ3") }
            ];

            questions.forEach(q => {
                const qBlock = document.createElement("div");
                qBlock.style.cssText = "background: #0f172a; padding: 12px 14px; border-radius: 8px; border: 1px solid #334155; display: flex; flex-direction: column; gap: 6px;";

                const qTitle = document.createElement("div");
                qTitle.innerText = q.title;
                qTitle.style.cssText = "font-size: 14px; font-weight: bold; color: #e2e8f0;";
                qBlock.appendChild(qTitle);

                const qStats = results[q.id] || { yes: 0, no: 0, yesPct: 0, noPct: 0 };
                const yesPct = qStats.yesPct || 0;
                const noPct = qStats.noPct || 0;

                const bar = document.createElement("div");
                bar.style.cssText = "position: relative; width: 100%; height: 26px; border-radius: 6px; overflow: hidden; background: #334155; display: flex; margin-top: 4px;";

                const yesPart = document.createElement("div");
                yesPart.style.cssText = `height: 100%; width: ${yesPct}%; background: #10b981; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; color: white; transition: width 0.5s ease;`;
                if (yesPct >= 15) yesPart.innerText = `${yesPct}%`;

                const noPart = document.createElement("div");
                noPart.style.cssText = `height: 100%; width: ${noPct}%; background: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; color: white; transition: width 0.5s ease;`;
                if (noPct >= 15) noPart.innerText = `${noPct}%`;

                bar.appendChild(yesPart);
                bar.appendChild(noPart);
                qBlock.appendChild(bar);

                const legend = document.createElement("div");
                legend.style.cssText = "display: flex; justify-content: space-between; font-size: 12px; color: #cbd5e1; margin-top: 2px;";
                legend.innerHTML = `<span><strong style="color: #34d399;">${getTranslation("pollYes")}:</strong> ${qStats.yes || 0} (${yesPct}%)</span><span><strong style="color: #f87171;">${getTranslation("pollNo")}:</strong> ${qStats.no || 0} (${noPct}%)</span>`;
                qBlock.appendChild(legend);

                bodyContainer.appendChild(qBlock);
            });
        }
    }

    function renderVotingForm() {
        bodyContainer.innerHTML = "";

        const questions = [
            { key: "q1", label: getTranslation("pollQ1") },
            { key: "q2", label: getTranslation("pollQ2") },
            { key: "q3", label: getTranslation("pollQ3") }
        ];

        let isSubmitting = false;

        questions.forEach(q => {
            const qBox = document.createElement("div");
            qBox.style.cssText = "background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 8px;";

            const qLabel = document.createElement("div");
            qLabel.innerText = q.label;
            qLabel.style.cssText = "font-size: 14px; font-weight: bold; color: #f1f5f9;";
            qBox.appendChild(qLabel);

            const btnRow = document.createElement("div");
            btnRow.style.cssText = "display: flex; gap: 10px;";

            const btnYes = document.createElement("button");
            const isYes = lunPollAnswers[q.key] === "yes";
            btnYes.innerText = (isYes ? "✓ " : "") + getTranslation("pollYes");
            btnYes.style.cssText = `flex: 1; padding: 10px; font-size: 15px; font-weight: bold; border-radius: 6px; cursor: pointer; transition: all 0.2s; ${isYes ? 'background: #10b981; border: 2px solid #34d399; color: white;' : 'background: #1e293b; border: 1px solid #475569; color: #cbd5e1;'}`;

            const btnNo = document.createElement("button");
            const isNo = lunPollAnswers[q.key] === "no";
            btnNo.innerText = (isNo ? "✓ " : "") + getTranslation("pollNo");
            btnNo.style.cssText = `flex: 1; padding: 10px; font-size: 15px; font-weight: bold; border-radius: 6px; cursor: pointer; transition: all 0.2s; ${isNo ? 'background: #ef4444; border: 2px solid #f87171; color: white;' : 'background: #1e293b; border: 1px solid #475569; color: #cbd5e1;'}`;

            btnYes.onclick = () => {
                if (isSubmitting) return;
                lunPollAnswers[q.key] = "yes";
                renderVotingForm();
                checkAndAutoSubmit();
            };

            btnNo.onclick = () => {
                if (isSubmitting) return;
                lunPollAnswers[q.key] = "no";
                renderVotingForm();
                checkAndAutoSubmit();
            };

            btnRow.appendChild(btnYes);
            btnRow.appendChild(btnNo);
            qBox.appendChild(btnRow);
            bodyContainer.appendChild(qBox);
        });

        // If all 3 answers are ready, provide a clear Submit button
        if (lunPollAnswers.q1 && lunPollAnswers.q2 && lunPollAnswers.q3) {
            const submitRow = document.createElement("div");
            submitRow.style.cssText = "display: flex; justify-content: center; margin-top: 4px;";
            const submitBtn = document.createElement("button");
            submitBtn.innerText = "🚀 " + getTranslation("pollSubmitNow");
            submitBtn.style.cssText = "padding: 10px 28px; font-size: 15px; font-weight: bold; color: white; background: #10b981; border: none; border-radius: 8px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);";
            submitBtn.onmouseover = () => submitBtn.style.background = '#059669';
            submitBtn.onmouseleave = () => submitBtn.style.background = '#10b981';
            submitBtn.onclick = () => {
                if (isSubmitting) return;
                isSubmitting = true;
                submitBtn.disabled = true;
                submitBtn.innerText = getTranslation("pollSubmitting");
                submitPoll();
            };
            submitRow.appendChild(submitBtn);
            bodyContainer.appendChild(submitRow);
        }

        const statusArea = document.createElement("div");
        statusArea.id = "spkmod-poll-status";
        statusArea.style.cssText = "font-size: 14px; text-align: center; color: #94a3b8; min-height: 20px;";
        bodyContainer.appendChild(statusArea);

        function checkAndAutoSubmit() {
            if (lunPollAnswers.q1 && lunPollAnswers.q2 && lunPollAnswers.q3) {
                isSubmitting = true;
                const statusEl = document.getElementById("spkmod-poll-status");
                if (statusEl) {
                    statusEl.innerText = getTranslation("pollSubmitting");
                    statusEl.style.color = "#facc15";
                }

                setTimeout(() => {
                    submitPoll();
                }, 300);
            }
        }

        function submitPoll() {
            const username = (window.gameState && window.gameState.myPlayerName) ? String(window.gameState.myPlayerName).trim() : (localStorage.getItem("spkmod-last-player-name") || "Player");
            const playerId = (window.gameState && window.gameState.myPlayerId) ? String(window.gameState.myPlayerId) : (localStorage.getItem("spkmod-last-player-id") || "");

            const voteData = {
                username: username,
                playerId: playerId,
                q1: lunPollAnswers.q1,
                q2: lunPollAnswers.q2,
                q3: lunPollAnswers.q3,
                timestamp: Date.now()
            };

            // Store in pending key temporarily so user selections aren't lost if connection drops
            try {
                localStorage.setItem("spkmod-poll-pending-v1", JSON.stringify(voteData));
            } catch (_) {}

            const sUrl = getPollServerUrl().replace(/\/+$/, "");
            const safeFetch = window.spkmodSafeFetch || window.fetch;
            safeFetch(`${sUrl}/api/poll/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(voteData)
            }, 5000)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (data && (data.success || data.alreadyVoted)) {
                    // Permanently record completion only upon server confirmation
                    try {
                        localStorage.setItem("spkmod-poll-voted-v1", JSON.stringify(voteData));
                        localStorage.removeItem("spkmod-poll-pending-v1");
                    } catch (_) {}
                    renderResults(data.results, data.alreadyVoted);
                } else {
                    renderOfflineFallback(voteData);
                }
            })
            .catch(err => {
                console.warn("[SpeakiMod+] Poll server unreachable:", err);
                renderOfflineFallback(voteData);
            });
        }

        function renderOfflineFallback(voteData) {
            const fakeResults = {
                totalVotes: 1,
                q1: { yes: voteData && voteData.q1 === 'yes' ? 1 : 0, no: voteData && voteData.q1 === 'no' ? 1 : 0, yesPct: voteData && voteData.q1 === 'yes' ? 100 : 0, noPct: voteData && voteData.q1 === 'no' ? 100 : 0 },
                q2: { yes: voteData && voteData.q2 === 'yes' ? 1 : 0, no: voteData && voteData.q2 === 'no' ? 1 : 0, yesPct: voteData && voteData.q2 === 'yes' ? 100 : 0, noPct: voteData && voteData.q2 === 'no' ? 100 : 0 },
                q3: { yes: voteData && voteData.q3 === 'yes' ? 1 : 0, no: voteData && voteData.q3 === 'no' ? 1 : 0, yesPct: voteData && voteData.q3 === 'yes' ? 100 : 0, noPct: voteData && voteData.q3 === 'no' ? 100 : 0 }
            };
            renderResults(fakeResults, false, getTranslation("pollServerOffline"));

            const actionRow = document.createElement("div");
            actionRow.style.cssText = "display: flex; gap: 12px; justify-content: center; margin-top: 10px; flex-wrap: wrap;";

            const retryBtn = document.createElement("button");
            retryBtn.innerText = "🔄 " + getTranslation("pollRetry");
            retryBtn.style.cssText = "padding: 9px 20px; font-size: 14px; font-weight: bold; color: white; background: #10b981; border: none; border-radius: 6px; cursor: pointer; transition: all 0.2s;";
            retryBtn.onmouseover = () => retryBtn.style.background = '#059669';
            retryBtn.onmouseleave = () => retryBtn.style.background = '#10b981';
            retryBtn.onclick = () => {
                if (window.spkmodServerHealth) window.spkmodServerHealth.forceRetry();
                retryBtn.disabled = true;
                retryBtn.innerText = getTranslation("pollSubmitting");
                if (voteData) {
                    if (voteData.q1) lunPollAnswers.q1 = voteData.q1;
                    if (voteData.q2) lunPollAnswers.q2 = voteData.q2;
                    if (voteData.q3) lunPollAnswers.q3 = voteData.q3;
                }
                submitPoll();
            };

            const editBtn = document.createElement("button");
            editBtn.innerText = "✏️ " + getTranslation("pollChangeVote");
            editBtn.style.cssText = "padding: 9px 20px; font-size: 14px; font-weight: bold; color: #cbd5e1; background: #334155; border: 1px solid #475569; border-radius: 6px; cursor: pointer; transition: all 0.2s;";
            editBtn.onmouseover = () => editBtn.style.background = '#475569';
            editBtn.onmouseleave = () => editBtn.style.background = '#334155';
            editBtn.onclick = () => {
                try {
                    localStorage.removeItem("spkmod-poll-voted-v1");
                } catch (_) {}
                if (voteData) {
                    if (voteData.q1) lunPollAnswers.q1 = voteData.q1;
                    if (voteData.q2) lunPollAnswers.q2 = voteData.q2;
                    if (voteData.q3) lunPollAnswers.q3 = voteData.q3;
                }
                renderVotingForm();
            };

            actionRow.appendChild(retryBtn);
            actionRow.appendChild(editBtn);
            bodyContainer.appendChild(actionRow);
        }
    }

    if (storedVote) {
        const username = (window.gameState && window.gameState.myPlayerName) ? String(window.gameState.myPlayerName).trim() : (localStorage.getItem("spkmod-last-player-name") || "Player");
        const playerId = (window.gameState && window.gameState.myPlayerId) ? String(window.gameState.myPlayerId) : (localStorage.getItem("spkmod-last-player-id") || "");
        const sUrl = getPollServerUrl().replace(/\/+$/, "");

        bodyContainer.innerHTML = `<div style="text-align: center; color: #94a3b8; padding: 24px; font-size: 15px;">⏳ ${getTranslation("pollSubmitting")}</div>`;

        const safeFetch = window.spkmodSafeFetch || window.fetch;
        safeFetch(`${sUrl}/api/poll/status?username=${encodeURIComponent(username)}&playerId=${encodeURIComponent(playerId)}`, {}, 5000)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(data => {
            if (data && data.hasVoted) {
                renderResults(data.results, true);
            } else {
                // Server is UP, but reports this player has NOT voted yet!
                // Clear the local lock so they can submit to the live server
                try {
                    localStorage.removeItem("spkmod-poll-voted-v1");
                } catch (_) {}
                if (storedVote.q1) lunPollAnswers.q1 = storedVote.q1;
                if (storedVote.q2) lunPollAnswers.q2 = storedVote.q2;
                if (storedVote.q3) lunPollAnswers.q3 = storedVote.q3;
                renderVotingForm();
                const statusEl = document.getElementById("spkmod-poll-status");
                if (statusEl) {
                    statusEl.innerHTML = `<span style="color: #38bdf8;">💡 ${getTranslation("pollUnsentRecovered")}</span>`;
                }
            }
        })
        .catch(_ => {
            renderOfflineFallback(storedVote);
        });
    } else {
        renderVotingForm();
    }

    const footerRow = document.createElement("div");
    footerRow.style.cssText = "display: flex; justify-content: center; align-items: center; margin-top: 6px; padding-top: 8px; border-top: 1px solid #334155;";

    const closeBtn = document.createElement("button");
    closeBtn.innerText = getTranslation("pollClose");
    closeBtn.style.cssText = "padding: 10px 32px; font-size: 16px; font-weight: bold; color: white; background: #3b82f6; border: none; border-radius: 8px; cursor: pointer; transition: all 0.2s;";
    closeBtn.onmouseover = () => closeBtn.style.background = '#2563eb';
    closeBtn.onmouseleave = () => closeBtn.style.background = '#3b82f6';
    closeBtn.onclick = () => overlay.remove();
    footerRow.appendChild(closeBtn);

    content.appendChild(footerRow);
    overlay.appendChild(content);
    document.body.appendChild(overlay);
};

// --- TELEMETRY CONSENT MODAL ---
window.showTelemetryConsentModal = function(forceLang) {
    const existing = document.getElementById("spkmod-telemetry-modal");
    if (existing) existing.remove();

    let lang = forceLang;
    if (!lang) {
        lang = (typeof spkmodLang !== 'undefined') ? spkmodLang : 'en';
        if (typeof window.lunCurrentLang !== 'undefined') lang = window.lunCurrentLang;
    }
    if (lang === 'zh') lang = 'zh-CN';
    if (lang === 'es') lang = 'es-419';

    const getTranslation = (k, ...args) => {
        let str = (typeof spkmodTranslations !== 'undefined' && spkmodTranslations[lang] && spkmodTranslations[lang][k])
            || (typeof spkmodTranslations !== 'undefined' && spkmodTranslations['en'] && spkmodTranslations['en'][k])
            || k;
        args.forEach((a, i) => { str = str.split(`{${i}}`).join(a); });
        return str;
    };

    const overlay = document.createElement("div");
    overlay.id = "spkmod-telemetry-modal";
    overlay.style.cssText = "position: fixed; inset: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.90); z-index: 2147483646 !important; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; color: white;";

    overlay.addEventListener("wheel", (e) => { e.stopPropagation(); }, { passive: true });
    overlay.addEventListener("touchmove", (e) => { e.stopPropagation(); }, { passive: true });
    overlay.addEventListener("mousedown", (e) => { e.stopPropagation(); });

    const content = document.createElement("div");
    content.style.cssText = "background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 24px; max-width: 540px; width: 90%; max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.6); box-sizing: border-box;";

    const langRow = document.createElement("div");
    langRow.style.cssText = "display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; margin-bottom: 4px;";
    const langs = [
        { code: 'en', label: 'English' },
        { code: 'ja', label: '日本語' },
        { code: 'ko', label: '한국어' },
        { code: 'zh-TW', label: '繁體中文' },
        { code: 'zh-CN', label: '简体中文' },
        { code: 'es-419', label: 'Español' }
    ];
    langs.forEach(l => {
        const btn = document.createElement("button");
        btn.innerText = l.label;
        btn.style.cssText = `padding: 5px 10px; font-size: 13px; font-weight: bold; border-radius: 6px; border: 1px solid #475569; background: ${lang === l.code ? '#3b82f6' : '#0f172a'}; color: white; cursor: pointer; transition: 0.15s;`;
        btn.onclick = () => window.showTelemetryConsentModal(l.code);
        langRow.appendChild(btn);
    });
    content.appendChild(langRow);

    const title = document.createElement("h2");
    title.innerText = "ℹ️ " + getTranslation("telemetryConsentTitle");
    title.style.cssText = "margin: 0; font-size: 20px; color: #facc15; text-align: center; border-bottom: 1px solid #334155; padding-bottom: 10px;";
    content.appendChild(title);

    const msg = document.createElement("div");
    msg.innerText = getTranslation("telemetryConsentMessage");
    msg.style.cssText = "margin: 0; font-size: 14.5px; line-height: 1.6; color: #cbd5e1; background: rgba(15, 23, 42, 0.6); border-left: 4px solid #3b82f6; padding: 14px 16px; border-radius: 6px; white-space: pre-line;";
    content.appendChild(msg);

    const btnRow = document.createElement("div");
    btnRow.style.cssText = "display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px;";

    const btnDecline = document.createElement("button");
    btnDecline.innerText = "✕ " + getTranslation("telemetryDeclineBtn");
    btnDecline.style.cssText = "padding: 10px 20px; font-size: 15px; font-weight: bold; color: #94a3b8; background: #0f172a; border: 1px solid #475569; border-radius: 8px; cursor: pointer; transition: all 0.2s;";
    btnDecline.onmouseover = () => btnDecline.style.background = "#1e293b";
    btnDecline.onmouseleave = () => btnDecline.style.background = "#0f172a";
    btnDecline.onclick = () => {
        try { localStorage.setItem("spkmod-telemetry-consent", "denied"); } catch (_) {}
        if (typeof lunPanelElements !== 'undefined' && lunPanelElements.telemetryToggleInput) {
            lunPanelElements.telemetryToggleInput.checked = false;
        }
        overlay.remove();
    };

    const btnAllow = document.createElement("button");
    btnAllow.innerText = "✓ " + getTranslation("telemetryAllowBtn");
    btnAllow.style.cssText = "padding: 10px 24px; font-size: 15px; font-weight: bold; color: white; background: #10b981; border: none; border-radius: 8px; cursor: pointer; transition: all 0.2s;";
    btnAllow.onmouseover = () => btnAllow.style.background = "#059669";
    btnAllow.onmouseleave = () => btnAllow.style.background = "#10b981";
    btnAllow.onclick = () => {
        try { localStorage.setItem("spkmod-telemetry-consent", "granted"); } catch (_) {}
        if (typeof lunPanelElements !== 'undefined' && lunPanelElements.telemetryToggleInput) {
            lunPanelElements.telemetryToggleInput.checked = true;
        }
        if (typeof window.spkmodSendTelemetryPing === "function") {
            window.spkmodSendTelemetryPing();
        }
        overlay.remove();
    };

    btnRow.appendChild(btnDecline);
    btnRow.appendChild(btnAllow);
    content.appendChild(btnRow);

    overlay.appendChild(content);
    document.body.appendChild(overlay);
};

// Check telemetry consent on game startup
setTimeout(() => {
    try {
        if (localStorage.getItem("spkmod-telemetry-consent") === null) {
            window.showTelemetryConsentModal();
        }
    } catch (_) {}
}, 1000);

if (typeof spkmodI18nRenderers !== 'undefined') {
    spkmodI18nRenderers.push(() => {
        if (typeof lunPanelElements !== 'undefined') {
            if (lunPanelElements.telemetryToggleLabel) lunPanelElements.telemetryToggleLabel.innerText = t("telemetrySettingLabel");
            if (lunPanelElements.muteMinimizedLabel) lunPanelElements.muteMinimizedLabel.innerText = t("muteMinimizedToggleLabel") || "Mute Game when Minimized";
            if (lunPanelElements.resolutionOverrideLabel && typeof lunResolutionOverrideLabel === "function") lunPanelElements.resolutionOverrideLabel.innerText = lunResolutionOverrideLabel();
            if (lunPanelElements.resolutionOverrideRow) {
                const isMob = typeof spkmodIsMobile === "function" && spkmodIsMobile();
                lunPanelElements.resolutionOverrideRow.style.setProperty("display", isMob ? "" : "none", isMob ? "" : "important");
            }
        }
        if (typeof updateMuteButtonUI === "function") updateMuteButtonUI();
        const emojiBtn = document.getElementById("spkmod-emoji-btn");
        if (emojiBtn) {
            emojiBtn.title = t("emojiRemovedTooltip", "Removed by developer request, our apologies for the inconvenience, click for the feedback icon");
        }
        if (typeof window.updateZoomButtonText === "function") window.updateZoomButtonText();
    });
}



window.applySeparatePanel = function() {
	const panel = document.getElementById("spkmod-panel");
	const hud = document.getElementById("spkmod-hud");
	if (!panel || !hud) return;

	let sepHeader = document.getElementById("spkmod-sep-header-row");

	if (lunSeparatePanel) {
		if (panel.parentElement !== document.body) {
			document.body.appendChild(panel);
		}
		panel.style.position = "absolute";
		panel.style.zIndex = "600000";
		
		if (!sepHeader) {
			sepHeader = buildElement("div", { id: "spkmod-sep-header-row", className: "spkmod-panel-cat", style: "cursor: move; user-select: none; touch-action: none; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 4px; margin-bottom: 2px;" }, [
				buildElement("span", {
					innerText: "≡ " + (t("header") || "SpeakiMod+ Actions"),
					style: "font-weight: bold; flex-grow: 1; font-size: 11px; color: #ffd54a;"
				}),
				buildElement("button", {
					innerText: "−",
					className: "spkmod-panel-btn-small",
					style: "padding: 0px 6px; font-size: 14px; line-height: 14px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px;",
					onclick: e => {
						const isHidden = panel.dataset.minimized === "true";
						if (isHidden) {
							panel.dataset.minimized = "false";
							e.target.innerText = "−";
							Array.from(panel.children).forEach(c => {
								if (c.id !== "spkmod-sep-header-row") c.style.display = "";
							});
						} else {
							panel.dataset.minimized = "true";
							e.target.innerText = "+";
							Array.from(panel.children).forEach(c => {
								if (c.id !== "spkmod-sep-header-row") c.style.display = "none";
							});
						}
					}
				})
			]);
			panel.insertBefore(sepHeader, panel.firstChild);
			makeDraggable(panel, [sepHeader]);
		}
		
		if (!panel.dataset.userDragged) {
            panel.style.right = "10px";
            panel.style.top = "60px";
            panel.style.left = "auto";
        }
	} else {
		if (panel.parentElement !== hud) {
			hud.appendChild(panel);
		}
		panel.style.position = "";
		panel.style.zIndex = "";
		panel.style.right = "";
		panel.style.top = "";
		panel.style.left = "";
		
		if (sepHeader) {
			panel.removeChild(sepHeader);
		}
		
		if (panel.dataset.minimized === "true") {
			panel.dataset.minimized = "false";
			Array.from(panel.children).forEach(c => {
				c.style.display = "";
			});
		}
	}
};

// Apply it immediately if HUD is already built
if (document.getElementById("spkmod-panel")) {
    window.applySeparatePanel();
}


window.checkDecalogueToS = function(forceLang) {
    if (!window.localStorage) return;
    if (localStorage.getItem("spkmod-tosread") === "true") return;

    // Remove old ToS if any
    const existing = document.getElementById("spkmod-decalogue-tos");
    if (existing) existing.remove();

    let lang = forceLang;
    if (!lang) {
        lang = (typeof spkmodLang !== 'undefined') ? spkmodLang : 'en';
        if (typeof window.lunCurrentLang !== 'undefined') lang = window.lunCurrentLang;
    }
    if (lang === 'zh') lang = 'zh-CN';
    if (lang === 'es') lang = 'es-419';

    let t = null;
    if (typeof spkmodTranslations !== 'undefined' && spkmodTranslations[lang] && spkmodTranslations[lang].decalogue) {
        t = spkmodTranslations[lang].decalogue;
    } else if (typeof spkmodTranslations !== 'undefined' && spkmodTranslations['en'] && spkmodTranslations['en'].decalogue) {
        t = spkmodTranslations['en'].decalogue;
    }

    if (!t) {
        // Translations not loaded yet, retry shortly
        setTimeout(() => window.checkDecalogueToS(forceLang), 500);
        return;
    }

    const overlay = document.createElement("div");
    overlay.id = "spkmod-decalogue-tos";
    overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.95); z-index: 2147483646 !important; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; color: white;";

    const content = document.createElement("div");
    content.style.cssText = "background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 24px; max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);";

    const langRow = document.createElement("div");
    langRow.style.cssText = "display: flex; gap: 8px; justify-content: center; margin-bottom: 4px; flex-wrap: wrap;";
    
    const langs = [
        { code: 'en', label: 'English' },
        { code: 'ja', label: '日本語' },
        { code: 'ko', label: '한국어' },
        { code: 'zh-TW', label: '繁體中文' },
        { code: 'zh-CN', label: '简体中文' },
        { code: 'es-419', label: 'Español' }
    ];

    langs.forEach(l => {
        const btn = document.createElement("button");
        btn.innerText = l.label;
        btn.style.cssText = `padding: 6px 12px; font-weight: bold; border-radius: 6px; border: 1px solid #475569; background: ${lang === l.code ? '#3b82f6' : '#0f172a'}; color: white; cursor: pointer; transition: 0.2s;`;
        btn.onmouseover = () => { if (lang !== l.code) btn.style.background = '#1e293b'; };
        btn.onmouseleave = () => { if (lang !== l.code) btn.style.background = '#0f172a'; };
        btn.onclick = () => window.checkDecalogueToS(l.code);
        langRow.appendChild(btn);
    });
    content.appendChild(langRow);

    const title = document.createElement("h1");
    title.innerText = t.title;
    title.style.cssText = "margin: 0; font-size: 24px; color: #facc15; text-align: center; border-bottom: 1px solid #334155; padding-bottom: 12px;";
    content.appendChild(title);

    const img = document.createElement("img");
    img.src = "https://i.imgur.com/znG7SZf.png";
    img.style.cssText = "width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px; border: 1px solid #334155;";
    content.appendChild(img);

    const desc = document.createElement("p");
    desc.innerText = t.desc;
    desc.style.cssText = "margin: 0; font-size: 16px; font-weight: bold; color: #cbd5e1;";
    content.appendChild(desc);

    const ruleList = document.createElement("ul");
    ruleList.style.cssText = "margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 10px; color: #e2e8f0; font-size: 14.5px;";
    
    t.rules.forEach(rText => {
        const li = document.createElement("li");
        li.innerText = rText;
        ruleList.appendChild(li);
    });
    content.appendChild(ruleList);

    const checkboxContainer = document.createElement("label");
    checkboxContainer.style.cssText = "display: flex; align-items: center; gap: 10px; margin-top: 10px; cursor: pointer; padding: 12px; background: rgba(0,0,0,0.2); border-radius: 8px; border: 1px solid #475569;";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style.cssText = "width: 20px; height: 20px; cursor: pointer;";

    const checkText = document.createElement("span");
    checkText.innerText = t.checkbox;
    checkText.style.cssText = "font-size: 15px; font-weight: bold; color: #f8fafc;";
    
    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(checkText);
    content.appendChild(checkboxContainer);

    const proceedBtn = document.createElement("button");
    proceedBtn.innerText = t.proceed;
    proceedBtn.disabled = true;
    proceedBtn.style.cssText = "padding: 12px; font-size: 18px; font-weight: bold; color: white; background: #475569; border: none; border-radius: 8px; cursor: not-allowed; transition: all 0.2s; margin-top: 8px;";

    checkbox.addEventListener("change", (e) => {
        if (e.target.checked) {
            proceedBtn.disabled = false;
            proceedBtn.style.background = "#f97316";
            proceedBtn.style.cursor = "pointer";
        } else {
            proceedBtn.disabled = true;
            proceedBtn.style.background = "#475569";
            proceedBtn.style.cursor = "not-allowed";
        }
    });

    proceedBtn.addEventListener("click", () => {
        if (!checkbox.checked) return;
        localStorage.setItem("spkmod-tosread", "true");
        overlay.remove();
    });

    content.appendChild(proceedBtn);
    overlay.appendChild(content);
    document.body.appendChild(overlay);
};

// Check shortly after load to ensure body exists
setTimeout(() => window.checkDecalogueToS(), 500);


window.showMovieNews = function(forceLang) {
    if (localStorage.getItem('spkmod-movie-seen-v1') === 'true') return;

    const existing = document.getElementById('spkmod-movie-news');
    if (existing) existing.remove();

    let lang = forceLang;
    if (!lang) {
        lang = (typeof spkmodLang !== 'undefined') ? spkmodLang : 'en';
        if (typeof window.lunCurrentLang !== 'undefined') lang = window.lunCurrentLang;
    }
    if (lang === 'zh') lang = 'zh-CN';
    if (lang === 'es') lang = 'es-419';

    let t = null;
    if (typeof spkmodTranslations !== 'undefined' && spkmodTranslations[lang] && spkmodTranslations[lang].movieNews) {
        t = spkmodTranslations[lang].movieNews;
    } else if (typeof spkmodTranslations !== 'undefined' && spkmodTranslations['en'] && spkmodTranslations['en'].movieNews) {
        t = spkmodTranslations['en'].movieNews;
    }

    if (!t) {
        setTimeout(() => window.showMovieNews(forceLang), 500);
        return;
    }

    const overlay = document.createElement('div');
    overlay.id = 'spkmod-movie-news';
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.95); z-index: 9999998; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; color: white;';

    const content = document.createElement('div');
    content.style.cssText = 'background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 24px; max-width: 640px; width: 90%; max-height: 95vh; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);';

    const langRow = document.createElement('div');
    langRow.style.cssText = 'display: flex; gap: 8px; justify-content: center; margin-bottom: 4px; flex-wrap: wrap;';

    const langs = [
        { code: 'en', label: 'English' },
        { code: 'ja', label: '日本語' },
        { code: 'ko', label: '한국어' },
        { code: 'zh-TW', label: '繁體中文' },
        { code: 'zh-CN', label: '简体中文' },
        { code: 'es-419', label: 'Español' }
    ];

    langs.forEach(l => {
        const btn = document.createElement('button');
        btn.innerText = l.label;
        btn.style.cssText = `padding: 6px 12px; font-weight: bold; border-radius: 6px; border: 1px solid #475569; background: ${lang === l.code ? '#3b82f6' : '#0f172a'}; color: white; cursor: pointer; transition: 0.2s;`;
        btn.onmouseover = () => { if (lang !== l.code) btn.style.background = '#1e293b'; };
        btn.onmouseleave = () => { if (lang !== l.code) btn.style.background = '#0f172a'; };
        btn.onclick = () => window.showMovieNews(l.code);
        langRow.appendChild(btn);
    });
    content.appendChild(langRow);

    const title = document.createElement('h1');
    title.innerText = t.title;
    title.style.cssText = 'margin: 0; font-size: 24px; color: #facc15; text-align: center; border-bottom: 1px solid #334155; padding-bottom: 12px;';
    content.appendChild(title);

    const desc = document.createElement('p');
    desc.innerText = t.desc;
    desc.style.cssText = 'margin: 0; font-size: 16px; font-weight: bold; color: #cbd5e1; text-align: center;';
    content.appendChild(desc);

    const iframeContainer = document.createElement('div');
    iframeContainer.style.cssText = 'position: relative; width: 100%; padding-bottom: 56.25%; height: 0; border-radius: 8px; overflow: hidden; border: 1px solid #334155;';
    
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube.com/embed/yaIEanyk6WI?autoplay=0';
    iframe.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    
    iframeContainer.appendChild(iframe);
    content.appendChild(iframeContainer);

    const closeBtn = document.createElement('button');
    closeBtn.innerText = t.close;
    closeBtn.style.cssText = 'padding: 12px; font-size: 18px; font-weight: bold; color: white; background: #3b82f6; border: none; border-radius: 8px; cursor: pointer; transition: all 0.2s; margin-top: 8px;';
    closeBtn.onmouseover = () => closeBtn.style.background = '#2563eb';
    closeBtn.onmouseleave = () => closeBtn.style.background = '#3b82f6';
    
    closeBtn.addEventListener('click', () => {
        localStorage.setItem('spkmod-movie-seen-v1', 'true');
        overlay.remove();
    });

    content.appendChild(closeBtn);
    overlay.appendChild(content);
    document.body.appendChild(overlay);
};

setTimeout(() => window.showMovieNews(), 1500);


// --- Info / News Modal Logic ---

document.body.appendChild(
	lunHudElements.infoModal = buildElement("div", {
		id: "spkmod-info-modal",
		className: "hidden"
	}, [
		buildElement("div", { className: "spkmod-panel-cat", style: "justify-content: space-between;" }, [
			lunHudElements.infoModalHeader = buildElement("span", {
				innerText: "ℹ️ " + (t("infoBtnTooltip") === "infoBtnTooltip" ? "Info & News" : t("infoBtnTooltip")),
				style: "font-weight: bold; font-size: 12px; cursor: move; user-select: none;"
			}),
			buildElement("span", {
				id: "spkmod-info-close",
				innerText: "✕",
				style: "cursor: pointer; padding: 0 4px;",
				onclick: _ => lunHudElements.infoModal.classList.add("hidden")
			})
		]),
		lunHudElements.infoContentContainer = buildElement("div", {
			style: "display: flex; flex-direction: column; gap: 8px; max-height: 60vh; overflow-y: auto; padding-right: 2px;"
		})
	])
);
setTimeout(() => {
	if (typeof makeDraggable === 'function' && lunHudElements.infoModal && lunHudElements.infoModalHeader) {
		makeDraggable(lunHudElements.infoModal, [lunHudElements.infoModalHeader]);
	}
}, 500);

window.lunInfoFetched = false;
window.lunInfoLoading = false;
window.lunInfoData = "";

function toggleInfoModal() {
	if (!lunHudElements.infoModal) return;
	const isClosed = lunHudElements.infoModal.classList.contains("hidden");
	if (isClosed) {
		if (typeof positionModalNicely === 'function') positionModalNicely(lunHudElements.infoModal);
		lunHudElements.infoModal.classList.remove("hidden");
		if (!window.lunInfoFetched) {
			fetchInfoOnce();
		}
	} else {
		lunHudElements.infoModal.classList.add("hidden");
	}
}

function fetchInfoOnce() {
    window.lunInfoLoading = true;
    renderInfoUI();
    const ts = Date.now(); // Cache busting
    fetch('https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/main/assets/info.html?t=' + ts)
        .then(r => r.text())
        .then(html => {
            window.lunInfoData = html;
            window.lunInfoLoading = false;
            window.lunInfoFetched = true;
            renderInfoUI();
        })
        .catch(e => {
            window.lunInfoData = "<div style='color:#f87171; padding: 10px; text-align: center;'>Failed to load info.</div>";
            window.lunInfoLoading = false;
            window.lunInfoFetched = true;
            renderInfoUI();
        });
}

function renderInfoUI() {
    const container = lunHudElements.infoContentContainer;
    if (!container) return;
    if (window.lunInfoLoading) {
        container.innerHTML = "<div style='text-align: center; padding: 20px; color: #aaa;'>Loading...</div>";
        return;
    }
    container.innerHTML = window.lunInfoData;
}

// ============================================================================