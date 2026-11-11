function getQuestDisplayText(quest) {
	if (!quest) return "";
	let title = quest.title || "";
	let desc = quest.description || "";
	if (quest.code && typeof window.i18n === "function") {
		try {
			const tKey = `content.quest.${quest.code}.title`;
			const dKey = `content.quest.${quest.code}.description`;
			const tVal = window.i18n(tKey);
			const dVal = window.i18n(dKey);
			if (tVal && tVal !== tKey) title = tVal;
			if (dVal && dVal !== dKey) desc = dVal;
		} catch (_) {}
	}
	return desc ? `${title ? title + " — " : ""}${desc}` : (title || quest.code || "Quest");
}

function getQuestTitle(quest) {
	if (!quest) return "";
	let title = quest.title || "";
	if (quest.code && typeof window.i18n === "function") {
		try {
			const tKey = `content.quest.${quest.code}.title`;
			const tVal = window.i18n(tKey);
			if (tVal && tVal !== tKey) title = tVal;
		} catch (_) {}
	}
	return title || quest.code || "Quest";
}

function getQuestDescription(quest) {
	if (!quest) return "";
	let desc = quest.description || "";
	if (quest.code && typeof window.i18n === "function") {
		try {
			const dKey = `content.quest.${quest.code}.description`;
			const dVal = window.i18n(dKey);
			if (dVal && dVal !== dKey) desc = dVal;
		} catch (_) {}
	}
	return desc;
}

var lunPinnedQuestExpanded = false;

function updatePinnedQuestDisplay(quest) {
	if (!quest) return;
	const title = getQuestTitle(quest);
	const desc = getQuestDescription(quest);
	const cur = quest.currentAmount ?? 0;
	const tgt = quest.targetAmount ?? 1;

	const fullText = desc ? `${title ? title + " — " : ""}${desc}` : title;
	const text = lunPinnedQuestExpanded ? fullText : title;

	lunPinnedQuestContent = `${text} / ${cur}/${tgt}`;
	if (lunHudElements && lunHudElements.pinnedQuest && lunHudElements.pinnedQuest.content) {
		setText(lunHudElements.pinnedQuest.content, lunPinnedQuestContent);
	}
	const pct = Math.min(100, Math.max(0, (cur / tgt) * 100));
	if (lunHudElements && lunHudElements.pinnedQuest && lunHudElements.pinnedQuest.pbar) {
		lunHudElements.pinnedQuest.pbar.style.width = `${pct.toFixed(0)}%`;
	}
	if (typeof window !== "undefined" && window.localStorage) {
		try {
			localStorage.setItem("spkmod-pinned-quest", JSON.stringify({
				period: lunPinnedQuestPeriod,
				questId: lunPinnedQuestId,
				content: lunPinnedQuestContent,
				pbar: `${pct.toFixed(0)}%`,
				expanded: lunPinnedQuestExpanded
			}));
		} catch (_) {}
	}
}

function getPanelType(panel) {
	if (!panel) return null;

	// Check header or panel title
	const headerEl = panel.querySelector(".sr-panel__header, .sr-modal__header, .sr-dialog__header, header") || panel;
	const headerText = (headerEl.textContent || "").toLowerCase();

	// Check for type-exclusive keywords
	const exclusiveKeywords = {
		quests: ["quest", "퀘스트", "クエスト", "任務", "任务", "misión", "mision", "quête", "aufgabe"],
		shop: ["shop", "상점", "ショップ", "商店", "tienda", "boutique", "magasin", "laden"],
		inventory: ["inventory", "인벤토리", "인벤", "インベントリ", "背包", "inventario", "bag", "가방"],
		storage: ["storage", "warehouse", "창고", "depot",],
		equipment: ["equipment", "장비", "装備", "裝備", "装备"],
		settings: ["settings", "setting", "설정", "設定", "设置", "config", "option"],
		skills: ["skills", "skill", "스킬"],
		mailbox: ["mail", "우편", "郵便箱", "郵便", "信箱", "邮箱", "mailbox"],
		ranking: ["ranking", "rank", "랭킹", "ランキング", "順位", "排行榜", "排行", "leaderboard"],
		party: ["party", "파티"],
		friends: ["friend", "친구", "フレンド", "好友"],
		bbs: ["bbs", "bulletin", "게시판"]
	};
	let result = null;
	for (const type of Object.keys(exclusiveKeywords)) {
		if (exclusiveKeywords[type].some(kw => headerText.includes(kw))) {
				// Return null if the text contains keywords from multiple types
				if (result != null) return null;
				result = type;
				break;
		}
	}

	// Also check for shop controls or buttons anywhere in the panel
	if (result == "shop") {
		return "shop";
	}
	const bodyText = (panel.textContent || "").toLowerCase();
	if (
		bodyText.includes("leave shop") ||
		bodyText.includes("buy item") ||
		bodyText.includes("상점 나가기") ||
		bodyText.includes("아이템 구매") ||
		bodyText.includes("balance") ||
		panel.querySelector(".sr-shop, [class*='shop']")
	) {
		if (result == null) {
			return "shop";
		} else {
			// Return null if the header text contains a keyword from a non-shop type
			return null;
		}
	}

	if (result != null) {
		return result;
	}

	// Quest tabs (Daily / Weekly / Standing / Permanent)
	const tabBtns = panel.querySelectorAll(".sr-panel__tabs button, .sr-panel__tabs .sr-btn, .sr-tabs button, .sr-tab");
	if (tabBtns && tabBtns.length > 0) {
		for (const tb of tabBtns) {
			const txt = (tb.textContent || "").toLowerCase();
			if (
				txt.includes("daily") || txt.includes("일일") || txt.includes("デイリー") || txt.includes("diaria") || txt.includes("每日") || txt.includes("日常") ||
				txt.includes("week") || txt.includes("주간") || txt.includes("ウィークリー") || txt.includes("semanal") || txt.includes("每周") || txt.includes("周常") ||
				txt.includes("stand") || txt.includes("perma") || txt.includes("상시") || txt.includes("常設") || txt.includes("permanente") || txt.includes("永久") || txt.includes("常驻")
			) {
				return "quest";
			}
		}
	}

	return null;
}

function isQuestPanel(panel) {
	return getPanelType(panel) == "quests";
}

function refreshPinButtons() {
	document.querySelectorAll(".sr-panel, .sr-modal, .sr-dialog, [role='dialog']").forEach(panel => {
		if (!isQuestPanel(panel)) {
			panel.querySelectorAll(".spkmod-pq-button, .spkmod-star-button, .spkmod-list-button").forEach(btn => btn.remove());
		}
	});

	document.querySelectorAll(".spkmod-star-button").forEach(btn => {
		const isThisStarred = lunPinnedQuestId && String(btn.__questId) === String(lunPinnedQuestId);
		btn.innerText = isThisStarred ? "⭐ HUD" : "☆ HUD";
		btn.title = isThisStarred ? (t("unstarQuestBtn") || "Unstar from HUD") : (t("starQuestBtn") || "Star on HUD");
		btn.style.background = isThisStarred ? "#d97706" : "#334155";
		btn.style.color = "#fff";
		btn.style.borderColor = isThisStarred ? "#f59e0b" : "#475569";
	});

	document.querySelectorAll(".spkmod-list-button").forEach(btn => {
		const isThisInList = typeof isChecklistPinned === "function" && isChecklistPinned(btn.__questId);
		btn.innerText = isThisInList ? ("✕ " + (t("unpinChecklistBtn") !== "unpinChecklistBtn" ? t("unpinChecklistBtn") : "List")) : ("📌 " + (t("pinChecklistBtn") !== "pinChecklistBtn" ? t("pinChecklistBtn") : "List"));
		btn.title = isThisInList ? (t("unpinChecklistBtn") || "Unpin from List") : (t("pinChecklistBtn") || "Pin to List");
		btn.style.background = isThisInList ? "#dc2626" : "#2563eb";
	});

	document.querySelectorAll(".spkmod-pq-button").forEach(btn => {
		const isThisPinned = lunPinnedQuestId && String(btn.__questId) === String(lunPinnedQuestId);
		btn.innerText = isThisPinned ? ("✕ " + (t("unpinQuestBtn") !== "unpinQuestBtn" ? t("unpinQuestBtn") : "Unpin")) : ("📌 " + (t("pinQuestBtn") || "Pin"));
		btn.style.background = isThisPinned ? "#dc2626" : "#2563eb";
	});
}

function unpinQuest() {
	if (lunHudElements && lunHudElements.pinnedQuest && lunHudElements.pinnedQuest.panel) {
		lunHudElements.pinnedQuest.panel.className = "hidden";
	}

	lunPinnedQuestContent = null;
	lunPinnedQuestPeriod = null;
	lunPinnedQuestId = 0;
	lunPinnedQuestNextQueryTick = 0;

	if (typeof window !== "undefined" && window.localStorage) {
		try {
			localStorage.removeItem("spkmod-pinned-quest");
		} catch (_) {}
	}

	refreshPinButtons();
	if (typeof renderQuestChecklist === "function") renderQuestChecklist();
}
window.unpinQuest = unpinQuest;

function pinQuest(quest, questElm) {
	if (lunPinnedQuestId && String(lunPinnedQuestId) === String(quest.questId)) {
		unpinQuest();
		return;
	}

	lunPinnedQuestPeriod = quest.period || "daily";
	lunPinnedQuestId = quest.questId;
	lunPinnedQuestNextQueryTick = lunTickCount + sec(1);

	updatePinnedQuestDisplay(quest);

	if (lunHudElements && lunHudElements.pinnedQuest && lunHudElements.pinnedQuest.panel) {
		lunHudElements.pinnedQuest.panel.className = "";
	}

	refreshPinButtons();
	if (typeof renderQuestChecklist === "function") renderQuestChecklist();
}

// Restore saved pinned quest on initialization
(function restoreSavedPinnedQuest() {
	if (typeof window === "undefined" || !window.localStorage) return;
	try {
		const saved = localStorage.getItem("spkmod-pinned-quest");
		if (saved) {
			const parsed = JSON.parse(saved);
			if (parsed && parsed.questId) {
				if (typeof parsed.questId === "string" && parsed.questId.startsWith("v_")) {
					const content = parsed.content || "";
					const shopKeywords = ["scroll", "pouch", "eraser", "crayon", "sack of gold", "potion", "shop", "상점"];
					const isLikelyShop = shopKeywords.some(kw => content.toLowerCase().includes(kw));
					if (isLikelyShop || !/\/\s*\d+\s*\/\s*\d+$/.test(content)) {
						localStorage.removeItem("spkmod-pinned-quest");
						return;
					}
				}
				lunPinnedQuestPeriod = parsed.period || "daily";
				lunPinnedQuestId = parsed.questId;
				lunPinnedQuestNextQueryTick = 0;
				if (parsed.expanded !== undefined) lunPinnedQuestExpanded = !!parsed.expanded;
				if (parsed.content) {
					lunPinnedQuestContent = parsed.content;
					if (lunHudElements && lunHudElements.pinnedQuest && lunHudElements.pinnedQuest.content) {
						setText(lunHudElements.pinnedQuest.content, lunPinnedQuestContent);
					}
					if (lunHudElements && lunHudElements.pinnedQuest && lunHudElements.pinnedQuest.pbar && parsed.pbar) {
						lunHudElements.pinnedQuest.pbar.style.width = parsed.pbar;
					}
					if (lunHudElements && lunHudElements.pinnedQuest && lunHudElements.pinnedQuest.panel) {
						lunHudElements.pinnedQuest.panel.className = "";
					}
				}
			}
		}
	} catch (_) {}
})();

let _fetchingQuests = false;
async function fetchAllQuests() {
	if (_fetchingQuests) return;
	_fetchingQuests = true;
	try {
		const token = (typeof window.getNativeAuthToken === "function" ? window.getNativeAuthToken() : "") ||
		              (typeof getAuthToken === "function" ? getAuthToken() : "");
		const headers = {};
		if (token) headers["authorization"] = `Bearer ${token.replace(/^Bearer /i, "")}`;

		const endpoint = window.lunActiveApiEndpoint ||
		                 (window.speakiServerEndpoint ? window.speakiServerEndpoint : "") ||
		                 "https://sr1.overture.io.kr";
		const periods = ["daily", "weekly", "permanent"];
		for (const p of periods) {
			try {
				const res = await fetch(`${endpoint}/api/quests?period=${p}`, {
					method: "GET",
					headers: headers,
					mode: "cors"
				});
				if (res.ok) {
					const data = await res.json();
					if (Array.isArray(data)) {
						window.__spkmodCachedQuests = window.__spkmodCachedQuests || {};
						for (const q of data) {
							if (q && q.questId) {
								q.period = q.period || p;
								window.__spkmodCachedQuests[q.questId] = q;
								if (lunPinnedQuestId && String(lunPinnedQuestId) === String(q.questId)) {
									updatePinnedQuestDisplay(q);
								}
							}
						}
					}
				}
			} catch (_) {}
		}
	} finally {
		_fetchingQuests = false;
		refreshPinButtons();
		if (typeof renderQuestChecklist === "function") {
			renderQuestChecklist();
		}
	}
}

// --- SpeakiMod Quest Checklist System ---

function getChecklistPinnedIds() {
	try {
		const raw = localStorage.getItem("spkmod-checklist-pins");
		if (raw) return JSON.parse(raw);
	} catch (_) {}
	return [];
}

function setChecklistPinnedIds(ids) {
	try {
		localStorage.setItem("spkmod-checklist-pins", JSON.stringify(ids));
	} catch (_) {}
}

function clearClaimedQuestPin(quest) {
    if (!quest || !quest.questId || !quest.isClaimed) {
        return false;
    }

    const questId = String(quest.questId);
    const pinnedIds = getChecklistPinnedIds();
    const remainingIds = pinnedIds.filter(id => String(id) !== questId);
	const removed = remainingIds.length !== pinnedIds.length;

    if (removed) {
        setChecklistPinnedIds(remainingIds);
    }

    if (lunPinnedQuestId && String(lunPinnedQuestId) === questId) {
        unpinQuest();
    }

    if (removed && typeof refreshPinButtons === "function") {
        refreshPinButtons();
    }

    return removed;
}

function isChecklistPinned(questId) {
	if (!questId) return false;
	const pins = getChecklistPinnedIds();
	return pins.some(id => String(id) === String(questId));
}

function toggleChecklistPin(questId) {
	if (!questId) return false;
	const pins = getChecklistPinnedIds();
	const idx = pins.findIndex(id => String(id) === String(questId));
	let nowPinned = false;
	if (idx >= 0) {
		pins.splice(idx, 1);
		nowPinned = false;
	} else {
		pins.push(questId);
		nowPinned = true;
	}
	setChecklistPinnedIds(pins);
	return nowPinned;
}

function getDismissedQuests() {
	try {
		const raw = localStorage.getItem("spkmod-dismissed-quests");
		if (raw) return JSON.parse(raw);
	} catch (_) {}
	return {};
}

function dismissQuest(questId, period) {
	try {
		const dismissed = getDismissedQuests();
		dismissed[String(questId)] = { ts: Date.now(), period: period || "daily" };
		localStorage.setItem("spkmod-dismissed-quests", JSON.stringify(dismissed));
	} catch (_) {}
}

function undismissQuest(questId) {
	try {
		const dismissed = getDismissedQuests();
		delete dismissed[String(questId)];
		localStorage.setItem("spkmod-dismissed-quests", JSON.stringify(dismissed));
	} catch (_) {}
}

function isQuestDismissed(questId, period) {
	if (!questId) return false;
	try {
		const dismissed = getDismissedQuests();
		const entry = dismissed[String(questId)];
		if (!entry) return false;
		const ts = typeof entry === "object" ? entry.ts : entry;
		const qPeriod = (typeof entry === "object" ? entry.period : period) || period || "daily";

		const now = new Date();
		const dismissedDate = new Date(ts);

		// Korean Standard Time (UTC+9) daily reset
		if (qPeriod === "daily") {
			const kstNow = new Date(now.getTime() + 9 * 3600000);
			const kstDismissed = new Date(dismissedDate.getTime() + 9 * 3600000);
			if (kstNow.getUTCDate() !== kstDismissed.getUTCDate() || (now.getTime() - ts) > 86400000) {
				undismissQuest(questId);
				return false;
			}
			return true;
		}

		if (qPeriod === "weekly") {
			if ((now.getTime() - ts) > 7 * 86400000) {
				undismissQuest(questId);
				return false;
			}
			return true;
		}

		return true;
	} catch (_) {
		return false;
	}
}

async function claimQuest(questId) {
	try {
		const token = (typeof window.getNativeAuthToken === "function" ? window.getNativeAuthToken() : "") ||
		              (typeof getAuthToken === "function" ? getAuthToken() : "") ||
		              (window.speakiAuthToken || "");
		const headers = { "Content-Type": "application/json" };
		if (token) headers["authorization"] = `Bearer ${token.replace(/^Bearer /i, "")}`;

		const endpoint = window.lunActiveApiEndpoint ||
		                 (window.speakiServerEndpoint ? window.speakiServerEndpoint : "") ||
		                 "https://sr1.overture.io.kr";

		const res = await fetch(`${endpoint}/api/quests/${questId}/claim`, {
			method: "POST",
			headers: headers,
			credentials: "include"
		});

		if (res.ok) {
			if (window.__spkmodCachedQuests && window.__spkmodCachedQuests[questId]) {
				window.__spkmodCachedQuests[questId].isClaimed = true;
				window.__spkmodCachedQuests[questId].isCompleted = true;
			}
			if (typeof renderQuestChecklist === "function") renderQuestChecklist();
			if (typeof refreshPinButtons === "function") refreshPinButtons();

			// Refresh player inventory and quest status in background
			try {
				fetch(`${endpoint}/api/items/inventory`, { method: "GET", headers: headers, credentials: "include" });
			} catch (_) {}

			return true;
		} else {
			console.warn(`[SpeakiMod+] Failed to claim quest ${questId}: HTTP ${res.status}`);
		}
	} catch (err) {
		console.warn("[SpeakiMod+] Error claiming quest:", err);
	}
	return false;
}

var questsModalElements = window.questsModalElements = window.questsModalElements || {
	modal: null,
	headerRow: null,
	headerTitle: null,
	countBadge: null,
	showHiddenBtn: null,
	listContainer: null,
	showHidden: false,
	expandedQuestIds: new Set()
};

function buildQuestsModal() {
	if (lunHudElements.questsModal) return;

	const shouldBeOpen = (window.localStorage && localStorage.getItem("spkmod-quests-modal-open")) === "true";

	lunHudElements.questsModal = buildElement("div", {
		id: "spkmod-quests-modal",
		className: shouldBeOpen ? "" : "hidden",
		style: `display: flex; flex-direction: column; gap: 6px; padding: 8px 10px; box-sizing: border-box; min-width: 380px; max-width: 95vw; max-height: 80vh; background: #000C; border: ${spkmodBorderWidth} solid #DDD; border-radius: 8px; position: fixed; z-index: 600000; color: #FFF; user-select: none;`
	}, [
		// Header Row
		questsModalElements.headerRow = buildElement("div", {
			id: "spkmod-quests-header-row",
			className: "spkmod-panel-cat",
			style: "display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; cursor: move; user-select: none; flex-shrink: 0; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 4px;"
		}, [
			buildElement("div", { style: "display: flex; align-items: center; gap: 6px; cursor: move; user-select: none;" }, [
				questsModalElements.headerTitle = buildElement("span", {
					innerText: "📋 " + (t("questsModalTitle") || "Quests Checklist"),
					style: "font-weight: bold; font-size: 12px; color: #ffd54a; cursor: move; user-select: none;"
				}),
				questsModalElements.countBadge = buildElement("span", {
					innerText: "0",
					style: "font-size: 9.5px; background: rgba(255,255,255,0.15); padding: 1px 6px; border-radius: 8px; color: #94a3b8; font-weight: bold; cursor: move; user-select: none;"
				})
			]),
			buildElement("div", { style: "display: flex; align-items: center; gap: 5px;" }, [
				questsModalElements.showHiddenBtn = buildElement("button", {
					className: "spkmod-panel-btn-small",
					innerText: "👁️",
					title: t("showHiddenQuests") || "Show Dismissed Quests",
					style: "padding: 2px 6px; font-size: 11px; cursor: pointer; border-radius: 4px;",
					onclick: (e) => {
						e.stopPropagation();
						questsModalElements.showHidden = !questsModalElements.showHidden;
						questsModalElements.showHiddenBtn.style.background = questsModalElements.showHidden ? "#2563eb" : "";
						questsModalElements.showHiddenBtn.title = questsModalElements.showHidden ? (t("hideHiddenQuests") || "Hide Dismissed") : (t("showHiddenQuests") || "Show Dismissed");
						renderQuestChecklist();
					}
				}),
				buildElement("button", {
					className: "spkmod-panel-btn-small",
					innerText: "🔄",
					title: "Refresh Quests",
					style: "padding: 2px 6px; font-size: 11px; cursor: pointer; border-radius: 4px;",
					onclick: async (e) => {
						e.stopPropagation();
						if (typeof fetchAllQuests === "function") await fetchAllQuests();
						renderQuestChecklist();
					}
				}),
				buildElement("button", {
					className: "spkmod-panel-btn-small",
					innerText: "✕",
					style: "padding: 2px 6px; font-size: 11px; cursor: pointer; color: #ff6b6b; border-radius: 4px;",
					onclick: (e) => {
						e.stopPropagation();
						lunHudElements.questsModal.classList.add("hidden");
						if (window.localStorage) localStorage.setItem("spkmod-quests-modal-open", "false");
					}
				})
			])
		]),
		// Scrollable List container
		questsModalElements.listContainer = buildElement("div", {
			id: "spkmod-quests-list",
			style: "display: flex; flex-direction: column; gap: 4px; overflow-y: auto; max-height: calc(80vh - 60px); min-height: 40px; padding-right: 2px;"
		})
	]);

	document.body.appendChild(lunHudElements.questsModal);

	if (typeof makeDraggable === 'function') {
		makeDraggable(lunHudElements.questsModal, [questsModalElements.headerRow]);
	}

	lunHudElements.questsModal.addEventListener("wheel", (e) => { e.stopPropagation(); }, { passive: true });
	lunHudElements.questsModal.addEventListener("touchmove", (e) => { e.stopPropagation(); }, { passive: true });
	lunHudElements.questsModal.addEventListener("keydown", (e) => { e.stopPropagation(); });
}

function renderQuestChecklist() {
	if (!questsModalElements || !questsModalElements.listContainer) {
		buildQuestsModal();
	}
	if (!questsModalElements || !questsModalElements.listContainer) return;
	const container = questsModalElements.listContainer;
	container.innerHTML = "";

	const cached = window.__spkmodCachedQuests || {};
	const allQuests = Object.values(cached);

	if (allQuests.length === 0) {
		container.appendChild(buildElement("div", {
			style: "padding: 20px; text-align: center; color: #94a3b8; font-size: 11.5px;",
			innerText: _fetchingQuests ? "Loading quests..." : (t("noQuestsTracked") || "No quests tracked. Pin some in the native quest log!")
		}));
		if (questsModalElements.countBadge) questsModalElements.countBadge.innerText = "0";
		return;
	}

	// Filter quests to show
	const toShow = [];
	let claimableCount = 0;

	for (const q of allQuests) {
		if (!q || !q.questId) continue;
		const period = (q.period || "daily").toLowerCase();
		const isDaily = (period === "daily");
		const isPinned = isChecklistPinned(q.questId);
		const isDismissed = isQuestDismissed(q.questId, period);

		const cur = q.currentAmount ?? 0;
		const tgt = q.targetAmount ?? 1;
		const isClaimable = (cur >= tgt && !q.isClaimed);

		if (isClaimable) claimableCount++;

		// Mode 1: Dailies auto-added if uncompleted, or any pinned quest
		let shouldInclude = false;
		if (isDaily && !q.isClaimed) {
			shouldInclude = true;
		} else if (isPinned) {
			shouldInclude = true;
		}

		if (!shouldInclude) continue;

		if (isDismissed && !questsModalElements.showHidden) {
			continue;
		}

		toShow.push({ quest: q, isDismissed: isDismissed, isClaimable: isClaimable });
	}

	// Update badge
	if (questsModalElements.countBadge) {
		questsModalElements.countBadge.innerText = String(toShow.length);
		questsModalElements.countBadge.style.color = claimableCount > 0 ? "#4ade80" : "#94a3b8";
	}
	if (lunPanelElements && lunPanelElements.questsBtn) {
		lunPanelElements.questsBtn.style.color = claimableCount > 0 ? "#4ade80" : "";
	}

	if (toShow.length === 0) {
		container.appendChild(buildElement("div", {
			style: "padding: 20px; text-align: center; color: #94a3b8; font-size: 11.5px;",
			innerText: t("noQuestsTracked") || "No quests tracked. Pin some in the native quest log!"
		}));
		return;
	}

	// Sort: Claimable first, then Daily, Weekly, Standing
	const periodOrder = { "daily": 1, "weekly": 2, "permanent": 3, "standing": 3 };
	toShow.sort((a, b) => {
		if (a.isClaimable !== b.isClaimable) return a.isClaimable ? -1 : 1;
		if (a.isDismissed !== b.isDismissed) return a.isDismissed ? 1 : -1;
		const pA = periodOrder[a.quest.period] || 9;
		const pB = periodOrder[b.quest.period] || 9;
		if (pA !== pB) return pA - pB;
		return Number(a.quest.questId) - Number(b.quest.questId);
	});

	// Render rows
	for (const item of toShow) {
		const q = item.quest;
		const isDismissed = item.isDismissed;
		const cur = q.currentAmount ?? 0;
		const tgt = q.targetAmount ?? 1;
		const isClaimable = (cur >= tgt && !q.isClaimed);
		const isClaimed = !!q.isClaimed;
		const isStarred = (lunPinnedQuestId && String(lunPinnedQuestId) === String(q.questId));
		const period = (q.period || "daily").toLowerCase();
		const descText = getQuestDescription(q);
		const isExpanded = !!(questsModalElements.expandedQuestIds && questsModalElements.expandedQuestIds.has(String(q.questId)));

		let periodBadgeText = `(${t("periodDaily") || "Daily"})`;
		let periodColor = "#38bdf8";
		let periodBg = "rgba(56, 189, 248, 0.15)";
		if (period === "weekly") {
			periodBadgeText = `(${t("periodWeekly") || "Weekly"})`;
			periodColor = "#c084fc";
			periodBg = "rgba(168, 85, 247, 0.15)";
		} else if (period === "permanent" || period === "standing") {
			periodBadgeText = `(${t("periodStanding") || "Standing"})`;
			periodColor = "#facc15";
			periodBg = "rgba(234, 179, 8, 0.15)";
		}

		try {
			const row = buildElement("div", {
				className: "spkmod-quest-row",
				style: `display: flex; flex-direction: column; gap: 4px; padding: 5px 8px; border-radius: 5px; font-size: 11.5px; border: 1px solid ${isClaimable ? "rgba(74, 222, 128, 0.45)" : "rgba(255,255,255,0.1)"}; background: ${isDismissed ? "rgba(255,255,255,0.02)" : (isClaimable ? "rgba(34, 197, 94, 0.12)" : "rgba(255,255,255,0.04)")}; opacity: ${isDismissed ? "0.45" : "1"}; cursor: pointer; user-select: none;`
			}, [
				// Main 1-line Header Row
				buildElement("div", {
					style: "display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%; cursor: pointer;"
				}, [
					// Left side: Period Tag & Quest Title
					buildElement("div", {
						style: "display: flex; align-items: center; gap: 6px; overflow: hidden; min-width: 0; flex: 1; cursor: pointer;",
						title: isExpanded ? "Click to collapse" : (descText ? "Click to view description" : "")
					}, [
						buildElement("span", {
							innerText: periodBadgeText,
							style: `font-size: 10px; font-weight: bold; color: ${periodColor}; background: ${periodBg}; padding: 1px 5px; border-radius: 4px; flex-shrink: 0;`
						}),
						buildElement("span", {
							className: "spkmod-quest-row-title",
							innerText: getQuestTitle(q),
							style: "font-weight: 500; color: #f1f5f9; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;"
						})
					]),

					// Right side: Progress / Claim / Star / Dismiss
					buildElement("div", {
						style: "display: flex; align-items: center; gap: 6px; flex-shrink: 0;"
					}, [
						// Claim button or Progress or Claimed text
						isClaimable ? buildElement("button", {
							className: "spkmod-panel-btn-small",
							innerText: "🎁 " + (t("claimQuestBtn") || "Claim"),
							style: "padding: 2px 7px; font-size: 10.5px; background: #16a34a; color: #fff; border: 1px solid #4ade80; border-radius: 4px; font-weight: bold; cursor: pointer;",
							onclick: async (e) => {
								e.stopPropagation();
								e.target.disabled = true;
								e.target.innerText = "...";
								const ok = await claimQuest(q.questId);
								if (!ok) {
									e.target.innerText = t("claimQuestBtn") || "Claim";
									e.target.disabled = false;
								}
							}
						}) : (isClaimed ? buildElement("span", {
							innerText: "✓ " + (t("claimedQuestStatus") || "Claimed"),
							style: "font-size: 10.5px; color: #4ade80; font-weight: bold;"
						}) : buildElement("span", {
							className: "spkmod-quest-progress-text",
							innerText: `${cur}/${tgt}`,
							style: "font-size: 11px; font-weight: bold; color: #fbbf24; min-width: 32px; text-align: right;"
						})),

						// Star button (Single HUD Pinned Quest)
						buildElement("button", {
							className: "spkmod-panel-btn-small",
							innerText: isStarred ? "⭐" : "☆",
							title: isStarred ? (t("unstarQuestBtn") || "Unstar from HUD") : (t("starQuestBtn") || "Star on HUD"),
							style: `padding: 1px 5px; font-size: 11px; cursor: pointer; border-radius: 4px; border: 1px solid ${isStarred ? "#eab308" : "rgba(255,255,255,0.15)"}; background: ${isStarred ? "rgba(234, 179, 8, 0.25)" : "rgba(255,255,255,0.06)"}; color: ${isStarred ? "#ffd700" : "#94a3b8"};`,
							onclick: (e) => {
								e.stopPropagation();
								if (isStarred) {
									unpinQuest();
								} else {
									pinQuest(q);
								}
								renderQuestChecklist();
							}
						}),

						// Dismiss (✕) or Restore (↩️) button
						isDismissed ? buildElement("button", {
							className: "spkmod-panel-btn-small",
							innerText: "↩️",
							title: "Restore Quest",
							style: "padding: 1px 4px; font-size: 10px; cursor: pointer; border-radius: 4px;",
							onclick: (e) => {
								e.stopPropagation();
								undismissQuest(q.questId);
								renderQuestChecklist();
							}
						}) : buildElement("button", {
							className: "spkmod-panel-btn-small",
							innerText: "✕",
							title: "Dismiss from list until reset",
							style: "padding: 1px 5px; font-size: 10.5px; cursor: pointer; color: #ff6b6b; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 4px;",
							onclick: (e) => {
								e.stopPropagation();
								dismissQuest(q.questId, q.period);
								renderQuestChecklist();
							}
						})
					])
				]),

				// Second part of the text (Description): shown when clicked/tapped, hidden by default
				(isExpanded && descText) ? buildElement("div", {
					className: "spkmod-quest-row-desc",
					style: `font-size: 10.5px; color: #cbd5e1; line-height: 1.4; padding: 5px 8px; background: rgba(0,0,0,0.35); border-radius: 4px; border-left: 2px solid ${periodColor}; margin-top: 2px; white-space: pre-wrap; word-break: break-word; user-select: text;`,
					innerText: descText
				}) : null
			]);

			row.setAttribute("data-quest-id", String(q.questId));
			row.__questId = String(q.questId);

			// Tapping/clicking anywhere on the quest toggles description expansion
			row.onclick = (e) => {
				if (e.target.closest("button") || e.target.closest(".spkmod-panel-btn-small")) return;
				if (!descText) return;
				if (!questsModalElements.expandedQuestIds) questsModalElements.expandedQuestIds = new Set();
				const qIdStr = String(q.questId);
				if (questsModalElements.expandedQuestIds.has(qIdStr)) {
					questsModalElements.expandedQuestIds.delete(qIdStr);
				} else {
					questsModalElements.expandedQuestIds.add(qIdStr);
				}
				renderQuestChecklist();
			};

			container.appendChild(row);
		} catch (rowErr) {
			console.warn("[SpeakiMod+] Error rendering quest row:", q, rowErr);
		}
	}
}

function updateQuestChecklistProgress(questId, cur, tgt) {
	if (!questsModalElements || !questsModalElements.listContainer) return;
	const row = questsModalElements.listContainer.querySelector(`[data-quest-id='${questId}']`);
	if (!row) return;

	// If it reached target, re-render so Claim button appears
	if (cur !== undefined && tgt !== undefined && cur >= tgt) {
		renderQuestChecklist();
		return;
	}

	const progEl = row.querySelector(".spkmod-quest-progress-text");
	if (progEl && cur !== undefined && tgt !== undefined) {
		progEl.innerText = `${cur}/${tgt}`;
	}
}

window.toggleQuestsModal = function() {
	if (!lunHudElements.questsModal) {
		buildQuestsModal();
	}
	if (!lunHudElements.questsModal) return;

	const isClosed = lunHudElements.questsModal.classList.contains("hidden");
	if (isClosed) {
		if (typeof positionModalNicely === "function") positionModalNicely(lunHudElements.questsModal);
		lunHudElements.questsModal.classList.remove("hidden");
		if (typeof bringToFront === "function") bringToFront(lunHudElements.questsModal);
		if (typeof fetchAllQuests === "function") fetchAllQuests();
		renderQuestChecklist();
		if (window.localStorage) localStorage.setItem("spkmod-quests-modal-open", "true");
	} else {
		lunHudElements.questsModal.classList.add("hidden");
		if (window.localStorage) localStorage.setItem("spkmod-quests-modal-open", "false");
	}
};

// Initialize Quests Modal structure
setTimeout(() => {
	buildQuestsModal();
	const shouldBeOpen = (window.localStorage && localStorage.getItem("spkmod-quests-modal-open")) === "true";
	if (shouldBeOpen && lunHudElements.questsModal) {
		if (typeof positionModalNicely === "function") positionModalNicely(lunHudElements.questsModal);
		lunHudElements.questsModal.classList.remove("hidden");
		if (typeof bringToFront === "function") bringToFront(lunHudElements.questsModal);
		if (typeof fetchAllQuests === "function") fetchAllQuests();
		if (typeof renderQuestChecklist === "function") renderQuestChecklist();
	}
}, 600);

function matchQuestFromTitleText(titleText, item) {
	if (!titleText) return null;

	// 1. Try matching from cached quests
	if (window.__spkmodCachedQuests) {
		for (const q of Object.values(window.__spkmodCachedQuests)) {
			if (!q) continue;
			if (q.title && titleText.includes(q.title)) return q;
			if (q.description && titleText.includes(q.description)) return q;
			if (q.code) {
				try {
					const tVal = typeof window.i18n === "function" ? window.i18n(`content.quest.${q.code}.title`) : "";
					const dVal = typeof window.i18n === "function" ? window.i18n(`content.quest.${q.code}.description`) : "";
					if (tVal && titleText.includes(tVal)) return q;
					if (dVal && titleText.includes(dVal)) return q;
				} catch (_) {}
			}
		}
	}

	// 2. Parse from DOM row text ONLY if it contains an explicit quest progress fraction (/ X / Y)
	const progressMatch = titleText.match(/\/\s*(\d+)\s*\/\s*(\d+)\s*$/);
	if (!progressMatch) {
		return null;
	}

	const currentAmount = parseInt(progressMatch[1], 10);
	const targetAmount = parseInt(progressMatch[2], 10);

	const cleanTitle = titleText.replace(/\/\s*\d+\s*\/\s*\d+\s*$/, "").trim();
	let hash = 0;
	for (let i = 0; i < cleanTitle.length; i++) {
		hash = ((hash << 5) - hash) + cleanTitle.charCodeAt(i);
		hash |= 0;
	}
	const virtualId = "v_" + Math.abs(hash);

	let period = "daily";
	const activeTab = (_spkmodQuestDomState.panelRoot || document).querySelector(".sr-panel__tabs .sr-btn--secondary, .sr-panel__tabs .active");
	if (activeTab) {
		const tabText = (activeTab.textContent || "").toLowerCase();
		if (tabText.includes("stand") || tabText.includes("perma") || tabText.includes("상시") || tabText.includes("常設") || tabText.includes("permanente")) period = "permanent";
		else if (tabText.includes("week") || tabText.includes("주간") || tabText.includes("ウィークリー") || tabText.includes("semanal")) period = "weekly";
	}

	return {
		questId: virtualId,
		title: cleanTitle,
		description: "",
		currentAmount: currentAmount,
		targetAmount: targetAmount,
		period: period,
		isCompleted: currentAmount >= targetAmount,
		isClaimed: false
	};
}

// Cached references for the game quest panel
const _spkmodQuestDomState = {};
let _spkmodQuestScanPending = false;

const _spkmodPanelSelector =
    ".sr-panel, .sr-modal, .sr-dialog, [role='dialog']";
const _spkmodQuestPanelSelector = _spkmodPanelSelector;

const _spkmodQuestButtonSelector =
    ".spkmod-pq-button, .spkmod-star-button, .spkmod-list-button";

function createRafThrottler(callback) {
	let isPending = false;
	let lastArgs;

	return (...args) => {
		lastArgs = args;

		if (isPending) return;
		isPending = true;

		requestAnimationFrame(() => {
			isPending = false;
			callback(...lastArgs);
		});
	};
}

var scheduleSpkmodQuestPinScan = createRafThrottler(() => {
	if (
		!_spkmodQuestDomState.panelRoot?.isConnected ||
		!_spkmodQuestDomState.panelBody?.isConnected
	) {
		return;
	}

	injectPinButtonsIntoQuestList();
});

function attachSpkmodPanel(state, panel, callback) {
    const body = panel.querySelector(".sr-panel__body");
    if (!body) return false;

    if (
        panel === state.panelRoot &&
        body === state.panelBody &&
        state.domObserver
    ) {
        return true;
    }

    if (state.domObserver) {
        state.domObserver.disconnect();
        state.domObserver = null;
    }

    state.panelRoot = panel;
    state.panelBody = body;

    state.domObserver = new MutationObserver(records => {
        const rowsChanged = records.some(record => {
            const nodes = [
                ...record.addedNodes,
                ...record.removedNodes
            ];

            return nodes.some(node =>
                node.nodeType === 1 && (
                    node.matches(".sr-list-item") ||
                    node.querySelector(".sr-list-item")
                )
            );
        });

        if (rowsChanged) {
            callback(panel, body);
        }
    });

    // Observe only direct children of the list body.
    state.domObserver.observe(body, {
        childList: true
    });

    if (state.initObserver) {
        state.initObserver.disconnect();
        state.initObserver = null;
    }

    callback(panel, body);
    return true;
}

function observeSpkmodPanel(state, panelType, callback) {
    // Already initialized: reuse the cached references.
    if (
        state.panelRoot?.isConnected &&
        state.panelBody?.isConnected &&
        state.domObserver
    ) {
        return true;
    }

    // Find the existing quest panel once.
    for (const panel of document.querySelectorAll(
        _spkmodPanelSelector
    )) {
        if (
			getPanelType(panel) == panelType &&
			attachSpkmodPanel(state, panel, callback)
		) {
            return true;
        }
    }

    // Fallback only if the panel has not been mounted yet.
    if (!state.initObserver && document.body) {
        state.initObserver = new MutationObserver(records => {
            const possiblePanelAdded = records.some(record =>
                [...record.addedNodes].some(node => {
                    if (node.nodeType !== 1) return false;

                    return (
                        node.matches?.(_spkmodPanelSelector) ||
                        node.closest?.(_spkmodPanelSelector) ||
                        node.querySelector?.(_spkmodPanelSelector)
                    );
                })
            );

            if (!possiblePanelAdded) return;

            for (const panel of document.querySelectorAll(
                _spkmodPanelSelector
            )) {
                if (
					getPanelType(panel) == panelType &&
					attachSpkmodPanel(state, panel, callback)
				) {
                    return;
                }
            }
        });

        state.initObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    return false;
}

function createPanelObserver(panelType, callback) {
	const state = {};
	return () => observeSpkmodPanel(state, panelType, callback);
}

function observeSpkmodQuestPanel() {
	return observeSpkmodPanel(_spkmodQuestDomState, "quests", scheduleSpkmodQuestPinScan);
}

function injectPinButtonsIntoQuestList() {
    const panel = _spkmodQuestDomState.panelRoot;
    const panelBody = _spkmodQuestDomState.panelBody;

    if (!panel || !panel.isConnected || !panelBody || !panelBody.isConnected) {
        return;
    }

    const items = panelBody.querySelectorAll(".sr-list-item");
    if (!items.length) return;

    items.forEach(item => {
			// Item-level guard: never attach pin button if item has currency / price indicators or shop actions
			if (item.querySelector(".sr-currency, .sr-price") || /leave shop|buy item/i.test(item.textContent)) {
				item.querySelectorAll(".spkmod-pq-button, .spkmod-star-button, .spkmod-list-button").forEach(btn => btn.remove());
				return;
			}

			if (item.querySelector(".spkmod-star-button, .spkmod-list-button, .spkmod-pq-button")) return;

			const topRow = item.firstElementChild;
			if (!topRow) return;

			const titleEl = topRow.querySelector(".sr-list-item__title");
			if (!titleEl) return;

			const titleText = (titleEl.textContent || "").trim();
			if (!titleText) return;

			// If already claimed, no buttons needed
			if (topRow.querySelector(".sr-badge--success") || topRow.textContent.includes("✓")) {
				return;
			}

			const quest = matchQuestFromTitleText(titleText, item);
			if (!quest || !quest.questId) return;

			const questId = quest.questId;
			const isStarred = (lunPinnedQuestId && questId && String(lunPinnedQuestId) === String(questId));
			const isInList = typeof isChecklistPinned === "function" && isChecklistPinned(questId);

			const starBtn = document.createElement("button");
			starBtn.type = "button";
			starBtn.className = "spkmod-star-button";
			starBtn.__quest = quest;
			starBtn.__questId = questId;
			starBtn.innerText = isStarred ? "⭐ HUD" : "☆ HUD";
			starBtn.title = isStarred ? (t("unstarQuestBtn") || "Unstar from HUD") : (t("starQuestBtn") || "Star on HUD");
			starBtn.style.cssText = `
				flex-shrink: 0;
				margin-left: 0;
				padding: 3px 6px;
				font-size: 11px;
				line-height: 1.2;
				height: auto;
				border-radius: 4px;
				cursor: pointer;
				background: ${isStarred ? "#d97706" : "#334155"};
				color: #fff;
				border: 1px solid ${isStarred ? "#f59e0b" : "#475569"};
				font-weight: bold;
				user-select: none;
				transition: background 0.15s ease;
			`;
			starBtn.onclick = function (e) {
				e.preventDefault();
				e.stopPropagation();
				const q = starBtn.__quest || matchQuestFromTitleText(titleText, item);
				if (q) {
					pinQuest(q, item);
				}
			};

			const pinBtn = document.createElement("button");
			pinBtn.type = "button";
			pinBtn.className = "spkmod-list-button";
			pinBtn.__quest = quest;
			pinBtn.__questId = questId;
			pinBtn.innerText = isInList ? ("✕ " + (t("unpinChecklistBtn") !== "unpinChecklistBtn" ? t("unpinChecklistBtn") : "List")) : ("📌 " + (t("pinChecklistBtn") !== "pinChecklistBtn" ? t("pinChecklistBtn") : "List"));
			pinBtn.title = isInList ? (t("unpinChecklistBtn") || "Unpin from List") : (t("pinChecklistBtn") || "Pin to List");
			pinBtn.style.cssText = `
				flex-shrink: 0;
				margin-left: 0;
				padding: 3px 6px;
				font-size: 11px;
				line-height: 1.2;
				height: auto;
				border-radius: 4px;
				cursor: pointer;
				background: ${isInList ? "#dc2626" : "#2563eb"};
				color: #fff;
				border: 1px solid rgba(255,255,255,0.25);
				font-weight: bold;
				user-select: none;
				transition: background 0.15s ease;
			`;
			pinBtn.onclick = function (e) {
				e.preventDefault();
				e.stopPropagation();
				const q = pinBtn.__quest || matchQuestFromTitleText(titleText, item);
				if (q) {
					if (typeof toggleChecklistPin === "function") {
						toggleChecklistPin(q.questId);
					}
					refreshPinButtons();
					if (typeof renderQuestChecklist === "function") renderQuestChecklist();
				}
			};

			const subRow = document.createElement("div");
			subRow.className = "spkmod-quest-subrow";
			subRow.style.cssText = "display: flex; gap: 4px; align-items: center;";
			subRow.appendChild(starBtn);
			subRow.appendChild(pinBtn);

			const statusEl = topRow.querySelector(".sr-list-item__subtitle") || topRow.querySelector("button.sr-btn--primary");
			if (statusEl && statusEl.parentElement === topRow) {
				const rightCol = document.createElement("div");
				rightCol.className = "spkmod-quest-actions-col";
				rightCol.style.cssText = "display: flex; flex-direction: column; align-items: flex-end; justify-content: center; gap: 4px; flex-shrink: 0; margin-left: 8px;";
				topRow.replaceChild(rightCol, statusEl);
				rightCol.appendChild(statusEl);
				rightCol.appendChild(subRow);
			} else if (!topRow.querySelector(".spkmod-star-button")) {
				topRow.appendChild(subRow);
			}
    });
}

const _spkmodFriendPanelBorder = "1px solid #808080";
let _spkmodFriendPanelBody = null;
let _spkmodFriendPanelMenu = null;
let _spkmodFriendPanelSortBy = "lastLogin";
let _spkmodFriendPanelSortAscending = true;
let _spkmodFriendOriginalOrder = null;
const _spkmodFriendPanelFilterPresence = {
	online: true,
	offline: true
};
let _spkmodFriendPanelFilterPlayerName = "";

function resetSpkmodFriendPanelSortAndFilter() {
	_spkmodFriendPanelSortBy = "lastLogin";
	_spkmodFriendPanelSortAscending = true;
	_spkmodFriendPanelFilterPresence.online = true;
	_spkmodFriendPanelFilterPresence.offline = true;
	_spkmodFriendPanelFilterPlayerName = "";
}

function buildRadioButtonList(name, options, onchange) {
	return buildElement("div", {
		style: `
			padding: 2px;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			gap: 2px;
		`
	}, options.map(({
		value,
		translateKey,
		defaultChecked
	}) => buildElement("label", {}, [
		buildElement("input", {
			type: "radio",
			name,
			value,
			defaultChecked: Boolean(defaultChecked),
			onchange: () => onchange(value)
		}),
		buildElement("span", {
			dataset: { spkmodI18n: translateKey },
			innerText: t(translateKey)
		})
	])));
}

function buildCheckBoxList(name, options, onchange) {
	return buildElement("div", {
		style: `
			padding: 2px;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			gap: 2px;
		`
	}, options.map(({
		value,
		translateKey,
		defaultChecked
	}) => {
		const input = buildElement("input", {
			type: "checkbox",
			name,
			value,
			defaultChecked: Boolean(defaultChecked),
		});
		input.addEventListener("change", () => onchange(value, input.checked));
		return buildElement("label", {}, [
			input,
			buildElement("span", {
				dataset: { spkmodI18n: translateKey },
				innerText: t(translateKey)
			})
		])
	}));
}

function buildSpkmodFriendSortForm() {
	const title = buildElement("p", {
		style: `
			margin: 0;
			border: 0 none;
			padding: 2px;
		`,
		dataset: { spkmodI18n: "sortOptions" },
		innerText: t("sortOptions")
	});
	const sortBy = buildRadioButtonList("spkmod-friend-sort-by", [
		{ value: "lastLogin", translateKey: "lastLogin", defaultChecked: true },
		{ value: "playerName", translateKey: "playerName" },
		{ value: "level", translateKey: "level" },
		{ value: "zoneId", translateKey: "zoneIdPlain" },
		{ value: "channel", translateKey: "channel" }
	], value => {
		_spkmodFriendPanelSortBy = value;
		sortFriendList(false);
	});
	sortBy.style.borderBottom = _spkmodFriendPanelBorder;
	const sortDirection = buildRadioButtonList("spkmod-frined-sort-direction", [
		{ value: "ascending", translateKey: "ascendingOrder", defaultChecked: true },
		{ value: "descending", translateKey: "descendingOrder" }
	], value => {
		_spkmodFriendPanelSortAscending = (value == "ascending");
		sortFriendList(false);
	});
	return buildElement("div", {}, [title, sortBy, sortDirection]);
}

function buildSpkmodFriendFilterForm() {
	const title = buildElement("p", {
		style: `
			margin: 0;
			border: 0 none;
			padding: 2px;
		`,
		dataset: { spkmodI18n: "filterOptions" },
		innerText: t("filterOptions")
	});
	const presence = buildCheckBoxList("spkmod-friend-filter-presence", [
		{ value: "online", translateKey: "online", defaultChecked: true },
		{ value: "offline", translateKey: "offline", defaultChecked: true }
	], (value, checked) => {
		_spkmodFriendPanelFilterPresence[value] = checked;
		filterFriendList();
	});
	presence.style.borderBottom = _spkmodFriendPanelBorder;
	const playerNameInput = buildElement("input", { type: "text" });
	playerNameInput.addEventListener("input", () => {
		_spkmodFriendPanelFilterPlayerName = playerNameInput.value.toLowerCase();
		filterFriendList();
	});
	const playerName = buildElement("div", {}, [
		buildElement("label", {}, [
			buildElement("span", {
				dataset: { spkmodI18n: "playerName" },
				innerText: t("playerName")
			}),
			document.createTextNode(" "),
			playerNameInput
		])
	]);
	return buildElement("div", {
		style: `
			margin-top: 1em;
		`
	}, [title, presence, playerName]);
}

function buildSpkmodFriendPanelMenu() {
	const form = buildElement("form", {}, [
		buildSpkmodFriendSortForm(),
		buildSpkmodFriendFilterForm(),
		buildElement("div", {
			style: `
				margin-top: 1em;
			`
		}, [
			buildElement("button", {
				className: "spkmod-panel-btn",
				type: "button",
				dataset: { spkmodI18n: "resetSelections" },
				innerText: t("resetSelections"),
				onclick: e => {
					e.preventDefault();
					form.reset();
					resetSpkmodFriendPanelSortAndFilter();
					sortFriendList(false);
					filterFriendList();
				}
			})
		])
	]);
	const menu = buildElement("div", {
		className: "spkmod-friend-panel-menu hidden",
		style: `
			position: fixed;
			border: ${spkmodBorderWidth} solid;
			border-radius: 8px;
			width: 300px;
			padding: 1em;
			background-color: #000000;
			color: #FFFFFF;
			font-size: 12px;
		`
	}, [form]);
	menu.setAttribute("data-spkmod-friend-menu", "");
	return menu;
}

function getSpkmodFriendPanelMenu() {
	if (_spkmodFriendPanelMenu != null) return _spkmodFriendPanelMenu;

	const menu = buildSpkmodFriendPanelMenu();
	document.body.appendChild(menu);

	document.addEventListener("pointerdown", e => {
		if (!menu.classList.contains("hidden") && !menu.contains(e.target) && !e.target.hasAttribute("data-spkmod-friend-panel-btn")) {
			menu.classList.add("hidden");
		}
	});
	document.addEventListener("wheel", e => {
		if (!menu.classList.contains("hidden") && !menu.contains(e.target)) {
			menu.classList.add("hidden");
		}
	}, true);
	window.addEventListener("blur", () => {
		menu.classList.add("hidden");
	});

	_spkmodFriendPanelMenu = menu;
	return menu;
}

function toggleSpkmodFriendPanelMenu(btn, panel) {
	const menu = getSpkmodFriendPanelMenu();
	const hidden = menu.classList.toggle("hidden");
	if (hidden) return;

	const menuRect = menu.getBoundingClientRect();
	const btnRect = btn.getBoundingClientRect();
	if (btnRect.bottom + menuRect.height <= document.documentElement.clientHeight) {
		menu.style.top = `${btnRect.bottom}px`;
	} else {
		menu.style.top = `${btnRect.top - menuRect.height}px`;
	}
	if (btnRect.left + menuRect.width <= document.documentElement.clientWidth) {
		menu.style.left = `${btnRect.left}px`;
	} else {
		menu.style.left = `${btnRect.right - menuRect.width}px`;
	}

	const panelZIndex = window.getComputedStyle(panel).zIndex;
	if (panelZIndex != null && /^-?[0-9]+$/.test(panelZIndex)) {
		menu.style.zIndex = Number(panelZIndex) + 1;
	}
}

function getOnlineFriendPresenceFromText(text) {
	if (text == null) {
		return {
			online: false,
			zoneId: null,
			channel: null
		};
	}
	const prefix = "📍 "
	const prefixRemoved = text.startsWith(prefix) ? text.slice(prefix.length) : text;
	const statusItems = prefixRemoved.split(" · ");
	const presence = {
		online: true,
		zoneId: null,
		channel: null
	};

	// If the zone exists
	if (statusItems.length >= 2) {
		const zoneName = statusItems[0];
		presence.zoneId = getZoneIdFromName(zoneName) ?? null;

		// If the channel exists
		if (statusItems.length == 3) {
			const channelString = statusItems[1].match(/\d+/)?.[0];
			presence.channel = channelString ? Number(channelString) : null;
		}
	}

	return presence;
}

function getFriendPropertiesFromElement(friendElem) {
	const titleElem = friendElem.querySelector(".sr-list-item__title");
	const levelElem = friendElem.querySelector(".sr-party__level");
	const presenceElem = friendElem.querySelector(".sr-list-item__subtitle");

	const name = titleElem?.textContent;

	const levelString = levelElem?.textContent.match(/^Lv\.(\d+)$/)?.[1];
	const level = levelString ? Number(levelString) : null;

	const online = !friendElem.classList.contains("sr-friend__row--offline");
	const presence = online ? getOnlineFriendPresenceFromText(presenceElem?.textContent) : {
		online: false,
		zoneId: null,
		channel: null
	};

	return {
		name,
		level,
		...presence
	}
}

// A function comparing numbers that places null at the end
function compareFriendNumberProperties(a, b, sign) {
	if (a == null) {
		return b == null ? 0 : 1;
	} else {
		return b == null ? -1 : sign * (a - b);
	}
}

function compareFriendProperties(a, b) {
	const sign = _spkmodFriendPanelSortAscending ? 1 : -1;

	switch (_spkmodFriendPanelSortBy) {
		case "lastLogin":
			return 0;
		case "playerName":
			if (a.name < b.name) return -sign;
			if (a.name > b.name) return sign;
			return 0;
		case "level":
			return compareFriendNumberProperties(a.level, b.level, sign);
		case "zoneId":
			return compareFriendNumberProperties(a.zoneId, b.zoneId, sign);
		case "channel":
			return compareFriendNumberProperties(a.channel, b.channel, sign);
	}
}

function sortFriendList(isOriginalOrder) {
	if (!_spkmodFriendPanelBody || !_spkmodFriendPanelBody.isConnected) return;
	if (isOriginalOrder && _spkmodFriendPanelSortBy == "lastLogin" && _spkmodFriendPanelSortAscending == "ascending") return;

	const sectionTitles = _spkmodFriendPanelBody.querySelectorAll(".sr-panel__section-title");
	const sectionTitle1 = sectionTitles[0];
	const sectionTitle2 = sectionTitles[1];
	if (sectionTitle1 == null || sectionTitle2 == null) return;

	let items;
	if (isOriginalOrder) {
		items = [];
		for (let item = sectionTitle1.nextElementSibling; item !== sectionTitle2; item = item.nextElementSibling) {
			if (item.matches(".sr-list-item")) items.push(item);
		}
		_spkmodFriendOriginalOrder = [...items];
	} else if (_spkmodFriendOriginalOrder) {
		items = [..._spkmodFriendOriginalOrder];
	} else {
		return;
	}
	if (items.length == 0) return;

	if (_spkmodFriendPanelSortBy == "lastLogin") {
		if (!_spkmodFriendPanelSortAscending) items.reverse();
	} else {
		const properties = new Map();
		for (const item of items) {
			properties.set(item, getFriendPropertiesFromElement(item));
		}
		items.sort((a, b) => compareFriendProperties(
			properties.get(a),
			properties.get(b)
		));
	}

	for (const item of items) {
		_spkmodFriendPanelBody.insertBefore(item, sectionTitle2);
	}
}

function testFriendListItemFilter(elem) {
	const properties = getFriendPropertiesFromElement(elem);
	if (properties.online && !_spkmodFriendPanelFilterPresence.online) return false;
	if (!properties.online && !_spkmodFriendPanelFilterPresence.offline) return false;
	if (!properties.name?.toLowerCase()?.includes(_spkmodFriendPanelFilterPlayerName)) return false;
	return true;
}

function filterFriendList() {
	if (!_spkmodFriendPanelBody || !_spkmodFriendPanelBody.isConnected) return;

	const sectionTitles = _spkmodFriendPanelBody.querySelectorAll(".sr-panel__section-title");
	const sectionTitle1 = sectionTitles[0];
	const sectionTitle2 = sectionTitles[1];
	if (sectionTitle1 == null || sectionTitle2 == null) return;

	const items = [];
	for (let item = sectionTitle1.nextElementSibling; item !== sectionTitle2; item = item.nextElementSibling) {
		if (item.matches(".sr-list-item")) items.push(item);
	}
	if (items.length == 0) return;

	let hasShownItem = false;
	for (const item of items) {
		const shown = testFriendListItemFilter(item);
		item.classList.toggle("hidden", !shown);
		if (shown) hasShownItem = true;
	}

	const existingMessage = _spkmodFriendPanelBody.querySelector("[data-spkmod-no-friends-match-filter]");
	if (hasShownItem) {
		if (existingMessage) existingMessage.classList.add("hidden");
		return;
	}

	if (existingMessage) {
		existingMessage.classList.remove("hidden");
		return;
	}

	const message = buildElement("div", {
		className: "sr-state",
		dataset: { spkmodNoFriendsMatchFilter: "" }
	}, [
		buildElement("div", {
			className: "sr-state__text",
			dataset: { spkmodI18n: "noFriendsMatchFilter" },
			textContent: t("noFriendsMatchFilter")
		})
	]);
	_spkmodFriendPanelBody.insertBefore(message, sectionTitle2);
}

const renderSpkmodFriendPanel = createRafThrottler((panel, panelBody) => {
	if (!panel || !panel.isConnected || !panelBody || !panelBody.isConnected) return;
	_spkmodFriendPanelBody = panelBody;

	const sectionTitle = panelBody.querySelector(".sr-panel__section-title:first-child");

	if (sectionTitle != null && !sectionTitle.querySelector(":scope > [data-spkmod-friend-panel-btn]")) {
		sectionTitle.style.position = "relative";
		const btn = buildElement("button", {
			type: "button",
			style: `
				position: absolute;
				bottom: 0;
				right: 0;
				background-color: #000000;
				color: #FFFFFF;
				border: 0 none;
				border-radius: 4px;
				padding: 3px 6px;
			`,
			dataset: {
				spkmodFriendPanelBtn: "",
				spkmodI18n: "sortAndFilter",
			},
			innerText: t("sortAndFilter"),
			onclick: e => {
				e.preventDefault();
				toggleSpkmodFriendPanelMenu(btn, panel);
			}
		});
		sectionTitle.appendChild(btn);
		sortFriendList(true);
		filterFriendList();
	}
});

const observeSpkmodFriendPanel = createPanelObserver("friends", renderSpkmodFriendPanel);

if (typeof spkmodI18nRenderers !== "undefined") {
    spkmodI18nRenderers.push(() => {
		if (_spkmodFriendPanelBody != null) {
			for (const elem of _spkmodFriendPanelBody.querySelectorAll("[data-spkmod-i18n]")) {
				elem.innerText = t(elem.getAttribute("data-spkmod-i18n"));
			}
		}
		if (_spkmodFriendPanelMenu != null) {
			for (const elem of _spkmodFriendPanelMenu.querySelectorAll("[data-spkmod-i18n]")) {
				elem.innerText = t(elem.getAttribute("data-spkmod-i18n"));
			}
		}
	});
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
