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
			z-index: 2147483646 !important;
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
				width: 90vw !important;
				max-width: 320px !important;
				max-height: 45vh !important;
			}
		}
		@media (max-width: 960px) and (orientation: landscape) {
			#spkmod-quick-login-box {
				left: auto !important;
				right: 16px !important;
				top: 50% !important;
				bottom: auto !important;
				transform: translateY(-50%) !important;
				max-height: 85vh !important;
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

let lunQuickLoginCollapsed = typeof window.speakiMobile !== "undefined" || (typeof navigator !== "undefined" && /mobi|android/i.test(navigator.userAgent));

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
	header.style.cssText = "display: flex; align-items: center; justify-content: space-between; border-bottom: " + (lunQuickLoginCollapsed ? "none" : "1px solid rgba(255,255,255,0.1)") + "; padding-bottom: " + (lunQuickLoginCollapsed ? "0" : "8px") + "; cursor: pointer;";
	header.onclick = () => {
		lunQuickLoginCollapsed = !lunQuickLoginCollapsed;
		renderQuickLoginBox(gateEl);
	};
	
	const title = document.createElement("div");
	title.style.cssText = "font-weight: bold; font-size: 14px; display: flex; align-items: center; gap: 6px;";
	title.innerText = "🔑 " + t("quickLoginTitle") + (lunQuickLoginCollapsed ? " (Click to open)" : "");
	
	const countBadge = document.createElement("span");
	countBadge.style.cssText = "font-size: 11px; color: #94a3b8; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 10px;";
	countBadge.innerText = String(accounts.length);

	header.appendChild(title);
	header.appendChild(countBadge);
	box.appendChild(header);

	if (lunQuickLoginCollapsed) {
		return;
	}

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
	section.style.cssText = "display: none; contain: inline-size; width: 100%; box-sizing: border-box; margin-top: 14px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;";

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
	if (typeof fetchAllQuests === "function") {
		fetchAllQuests();
	}
	if (typeof observeSpkmodQuestPanel === "function") {
	    observeSpkmodQuestPanel();
	}
	if (typeof observeSpkmodFriendPanel === "function") {
		observeSpkmodFriendPanel();
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
	if (typeof lunFontPreset !== "undefined" && lunFontPreset !== "default" && typeof window.spkmodForceNametagRedraw === "function") {
		setTimeout(() => {
			if (typeof window.spkmodForceNametagRedraw === "function") window.spkmodForceNametagRedraw();
		}, 400);
	}
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
		if (e.key === "0") newEffect = "dusk"; // Ctrl + 0 -> Dusk
		
		if (newEffect !== null) {
			e.preventDefault();
			if (typeof setCameraEffectLocal === "function") {
				setCameraEffectLocal(newEffect);
			} else {
				lunCameraEffect = newEffect;
				if (window.localStorage) localStorage.setItem("spkmod-camera-effect", lunCameraEffect);
				if (typeof updateDynamicStyles === "function") updateDynamicStyles();
				if (typeof lunPanelElements !== "undefined" && lunPanelElements.cameraEffectSelect) lunPanelElements.cameraEffectSelect.value = lunCameraEffect;
				if (typeof updateLocalEditsUI === "function") updateLocalEditsUI();
				if (typeof chatLog === "function") chatLog("Camera Effect: " + newEffect.toUpperCase());
			}
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
			e.preventDefault();
			if (typeof window.spkmodToggleNightMode === "function") {
				window.spkmodToggleNightMode();
			} else {
				const rows = document.querySelectorAll(".sr-panel__row");
				for (const row of rows) {
					const checkbox = row.querySelector("input[type='checkbox']");
					const span = row.querySelector("span");
					if (checkbox && span) {
						const txt = span.innerText.toLowerCase();
						if (txt.includes("night") || txt.includes("darker") || txt.includes("밤") || txt.includes("야간") || txt.includes("夜") || txt.includes("noche") || txt.includes("noite")) {
							checkbox.click();
							if (typeof chatLog === "function") chatLog("Toggled Native Night Mode");
							break;
						}
					}
				}
			}
		}
	}

	if (e.key === "F3" && !e.ctrlKey && !e.altKey && !e.shiftKey) {
		const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
		if (tag !== "input" && tag !== "textarea" && !document.activeElement?.isContentEditable) {
			e.preventDefault();
			if (typeof resetWindowPositions === "function") {
				resetWindowPositions();
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
